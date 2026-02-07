import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import {
  bruteForceTopK,
  computeRecallReport,
  generateDeterministicDataset,
} from "../src/lib/dataset.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const wasmDir = path.join(repoRoot, "public", "wasm");
const wasmJs = path.join(wasmDir, "pomaidb_wasm.js");
const wasmBinary = path.join(wasmDir, "pomaidb_wasm.wasm");

if (!fs.existsSync(wasmJs) || !fs.existsSync(wasmBinary)) {
  console.error("Missing wasm artifacts. Run scripts/build_wasm.sh first.");
  process.exit(1);
}

const moduleUrl = pathToFileURL(wasmJs).href;
const moduleFactory = (await import(moduleUrl)).default;

const moduleInstance = await moduleFactory({
  locateFile: (file) => {
    if (file.endsWith(".wasm")) {
      return wasmBinary;
    }
    return path.join(wasmDir, file);
  },
});

const init = moduleInstance.cwrap("pomaidb_init", null, []);
const createDb = moduleInstance.cwrap("pomaidb_create_db", "number", ["number"]);
const freeDb = moduleInstance.cwrap("pomaidb_free_db", null, ["number"]);
const upsertBatch = moduleInstance.cwrap("pomaidb_upsert_batch", "number", ["number", "number", "number", "number", "number"]);
const search = moduleInstance.cwrap("pomaidb_search", "number", ["number", "number", "number", "number", "number"]);
const setParam = moduleInstance.cwrap("pomaidb_set_param", "number", ["number", "string", "number"]);

function writeFloat32(data) {
  const ptr = moduleInstance._malloc(data.byteLength);
  moduleInstance.HEAPF32.set(data, ptr / 4);
  return ptr;
}

function writeInt32(data) {
  const ptr = moduleInstance._malloc(data.byteLength);
  moduleInstance.HEAP32.set(data, ptr / 4);
  return ptr;
}

function readInt32(ptr, count) {
  return new Int32Array(moduleInstance.HEAP32.buffer, ptr, count).slice();
}

function readFloat32(ptr, count) {
  return new Float32Array(moduleInstance.HEAPF32.buffer, ptr, count).slice();
}

init();

const seed = 1337;
const dim = 128;
const size = 1000;
const queryCount = 25;
const dataset = generateDeterministicDataset({ seed, size, dim, queryCount });

const handle = createDb(dim);
if (!handle) {
  console.error("Failed to create db");
  process.exit(1);
}

const idsPtr = writeInt32(dataset.ids);
const vecPtr = writeFloat32(dataset.vectors);
const status = upsertBatch(handle, idsPtr, vecPtr, dataset.ids.length, dim);
moduleInstance._free(idsPtr);
moduleInstance._free(vecPtr);

if (status !== 0) {
  console.error("Upsert batch failed");
  process.exit(1);
}

const targetKs = [1, 10, 100];
let approxRatio = 0.4;
let recallReport = null;

while (approxRatio <= 1.0) {
  setParam(handle, "approx_ratio", approxRatio);
  const approxResults = [];
  const exactResults = [];
  for (let q = 0; q < queryCount; q += 1) {
    const query = dataset.queries.slice(q * dim, (q + 1) * dim);
    const queryPtr = writeFloat32(query);
    const outIdsPtr = moduleInstance._malloc(100 * Int32Array.BYTES_PER_ELEMENT);
    const outScoresPtr = moduleInstance._malloc(100 * Float32Array.BYTES_PER_ELEMENT);
    const found = search(handle, queryPtr, 100, outIdsPtr, outScoresPtr);
    const ids = readInt32(outIdsPtr, found);
    moduleInstance._free(queryPtr);
    moduleInstance._free(outIdsPtr);
    moduleInstance._free(outScoresPtr);
    approxResults.push(Array.from(ids));
    exactResults.push(
      bruteForceTopK({
        vectors: dataset.vectors,
        ids: dataset.ids,
        query,
        dim,
        topk: 100,
      })
    );
  }

  recallReport = computeRecallReport({
    approxResults,
    exactResults,
    ks: targetKs,
  });

  const gates = targetKs.every((k) => recallReport[k] >= 0.94);
  if (gates) {
    break;
  }
  approxRatio = Number((approxRatio + 0.1).toFixed(2));
}

if (!recallReport) {
  console.error("Recall report missing");
  process.exit(1);
}

const gates = targetKs.every((k) => recallReport[k] >= 0.94);
if (!gates) {
  console.error("Recall gates failed", recallReport);
  process.exit(1);
}

console.log("Recall gates passed", recallReport);
freeDb(handle);
