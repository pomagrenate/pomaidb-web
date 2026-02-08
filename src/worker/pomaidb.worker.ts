/* src/worker/pomaidb.worker.ts */

// --- Type Definitions ---

type Pending = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

type WorkerRequest = {
  id: number;
  type: string;
  payload?: Record<string, unknown>;
};

type WorkerResponse = {
  id: number;
  ok: boolean;
  result?: unknown;
  error?: string;
};

type Engine = {
  init: () => void;
  createDb: (dim: number) => number;
  freeDb: (handle: number) => void;
  upsertBatch: (
    handle: number,
    ids: Int32Array,
    vectors: Float32Array,
    n: number,
    dim: number
  ) => number;
  setParam: (handle: number, key: string, value: number) => number;
  search: (handle: number, query: Float32Array, topk: number) => SearchResult;
  stats: (handle: number) => Record<string, number>;
};

type SearchResult = {
  ids: Int32Array;
  scores: Float32Array;
  found: number;
};

// Emscripten Module Type definition
type ModuleType = {
  cwrap: (
    name: string,
    returnType: string | null,
    argTypes: string[]
  ) => (...args: unknown[]) => unknown;
  UTF8ToString: (ptr: number) => string;
  stringToUTF8: (value: string, ptr: number, maxBytes: number) => void;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  HEAPF32: Float32Array;
  HEAP32: Int32Array;
};

// --- State Management ---

const engineState: {
  instance: Engine | null;
  promise: Promise<Engine> | null;
} = {
  instance: null,
  promise: null,
};

let dbHandle = 0;
let lastIds: Int32Array = new Int32Array(0);
let lastVectors: Float32Array = new Float32Array(0);
let lastDim = 0;
let ingestCursor = 0;

// --- Engine Loading ---

async function loadEngine(): Promise<Engine> {
  if (engineState.instance) {
    return engineState.instance;
  }
  if (!engineState.promise) {
    engineState.promise = (async () => {
      try {
        // @ts-ignore: Loading external script from public folder (Next.js public assets)
        const moduleFactory = (await import(/* webpackIgnore: true */ "/wasm/pomaidb_wasm.js")).default as (
          config?: Record<string, unknown>
        ) => Promise<ModuleType>;

        const moduleInstance = await moduleFactory({
          locateFile: (file: string) => `/wasm/${file}`,
        });

        engineState.instance = createWasmEngine(moduleInstance);
        return engineState.instance;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`PomaiDB WASM load failed, using JS fallback: ${message}`);
        engineState.instance = createFallbackEngine();
        return engineState.instance;
      }
    })();
  }
  return engineState.promise;
}

// --- WASM Engine Implementation ---

function createWasmEngine(module: ModuleType): Engine {
  const init = module.cwrap("pomaidb_init", null, []);
  const createDb = module.cwrap("pomaidb_create_db", "number", ["number"]);
  const freeDb = module.cwrap("pomaidb_free_db", null, ["number"]);
  const upsertBatch = module.cwrap("pomaidb_upsert_batch", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  const setParam = module.cwrap("pomaidb_set_param", "number", [
    "number",
    "string",
    "number",
  ]);
  const search = module.cwrap("pomaidb_search", "number", [
    "number",
    "number",
    "number",
    "number",
    "number",
  ]);
  const stats = module.cwrap("pomaidb_stats_json", "number", ["number"]);
  const freeStr = module.cwrap("pomaidb_free_string", null, ["number"]);

  const writeFloat32 = (data: Float32Array) => {
    const ptr = module._malloc(data.byteLength);
    module.HEAPF32.set(data, ptr / 4);
    return ptr;
  };

  const writeInt32 = (data: Int32Array) => {
    const ptr = module._malloc(data.byteLength);
    module.HEAP32.set(data, ptr / 4);
    return ptr;
  };

  return {
    init: () => {
      (init as () => void)();
    },
    createDb: (dim) => Number((createDb as Function)(dim)),
    freeDb: (handle) => {
      (freeDb as Function)(handle);
    },
    upsertBatch: (handle, ids, vectors, n, dim) => {
      const idsPtr = writeInt32(ids);
      const vecPtr = writeFloat32(vectors);
      const status = Number(
        (upsertBatch as Function)(handle, idsPtr, vecPtr, n, dim)
      );
      module._free(idsPtr);
      module._free(vecPtr);
      return status;
    },
    setParam: (handle, key, value) =>
      Number((setParam as Function)(handle, key, value)),
    search: (handle, query, topk) => {
      const queryPtr = writeFloat32(query);
      const outIdsPtr = module._malloc(topk * Int32Array.BYTES_PER_ELEMENT);
      const outScoresPtr = module._malloc(topk * Float32Array.BYTES_PER_ELEMENT);

      const found = Number(
        (search as Function)(handle, queryPtr, topk, outIdsPtr, outScoresPtr)
      );

      // Copy results from WASM heap to JS
      const ids = new Int32Array(
        module.HEAP32.buffer,
        outIdsPtr,
        found
      ).slice();
      const scores = new Float32Array(
        module.HEAPF32.buffer,
        outScoresPtr,
        found
      ).slice();

      module._free(queryPtr);
      module._free(outIdsPtr);
      module._free(outScoresPtr);
      return { ids, scores, found };
    },
    stats: (handle) => {
      const ptr = Number((stats as Function)(handle));
      const json = module.UTF8ToString(ptr);
      (freeStr as Function)(ptr);
      return JSON.parse(json) as Record<string, number>;
    },
  };
}

// --- JS Fallback Engine Implementation ---

function createFallbackEngine(): Engine {
  let nextHandle = 1;
  const dbs = new Map<
    number,
    { dim: number; ids: number[]; vectors: number[]; approxRatio: number; idToIndex: Map<number, number> }
  >();

  return {
    init: () => { },
    createDb: (dim) => {
      const handle = nextHandle++;
      dbs.set(handle, {
        dim,
        ids: [],
        vectors: [],
        approxRatio: 1.0,
        idToIndex: new Map(),
      });
      return handle;
    },
    freeDb: (handle) => {
      dbs.delete(handle);
    },
    upsertBatch: (handle, ids, vectors, n, dim) => {
      const entry = dbs.get(handle);
      if (!entry || entry.dim !== dim) {
        return 1; // Error
      }
      for (let i = 0; i < n; i += 1) {
        const id = ids[i];
        const vecOffset = i * dim;
        const existing = entry.idToIndex.get(id);
        if (existing === undefined) {
          const index = entry.ids.length;
          entry.ids.push(id);
          entry.idToIndex.set(id, index);
          for (let d = 0; d < dim; d += 1) {
            entry.vectors.push(vectors[vecOffset + d]);
          }
        } else {
          const base = existing * dim;
          for (let d = 0; d < dim; d += 1) {
            entry.vectors[base + d] = vectors[vecOffset + d];
          }
        }
      }
      return 0; // Success
    },
    setParam: (handle, key, value) => {
      const entry = dbs.get(handle);
      if (!entry) {
        return 1;
      }
      if (key === "approx_ratio") {
        entry.approxRatio = value;
      }
      return 0;
    },
    search: (handle, query, topk) => {
      const entry = dbs.get(handle);
      if (!entry) {
        return { ids: new Int32Array(0), scores: new Float32Array(0), found: 0 };
      }
      const { dim, ids, vectors } = entry;
      const count = ids.length;
      const scores = new Array<{ id: number; score: number }>(count);

      // Brute-force Euclidean distance (squared)
      for (let i = 0; i < count; i += 1) {
        const base = i * dim;
        let sum = 0;
        for (let d = 0; d < dim; d += 1) {
          const diff = query[d] - vectors[base + d];
          sum += diff * diff;
        }
        scores[i] = { id: ids[i], score: sum };
      }

      scores.sort((a, b) => a.score - b.score);
      const slice = scores.slice(0, topk);

      const outIds = new Int32Array(slice.length);
      const outScores = new Float32Array(slice.length);

      for (let i = 0; i < slice.length; i += 1) {
        outIds[i] = slice[i].id;
        outScores[i] = slice[i].score;
      }
      return { ids: outIds, scores: outScores, found: slice.length };
    },
    stats: (handle) => {
      const entry = dbs.get(handle);
      if (!entry) {
        // Return a valid Record<string, number> even if empty
        return { count: 0, dim: 0, approx_ratio: 0 };
      }
      return {
        count: entry.ids.length,
        dim: entry.dim,
        approx_ratio: entry.approxRatio,
      };
    },
  };
}

// --- Message Handler ---

async function handleMessage(event: MessageEvent<WorkerRequest>) {
  const { id, type, payload } = event.data;

  // Helper to safely send response
  const send = (response: Omit<WorkerResponse, 'id'>) => {
    self.postMessage({ id, ...response });
  };

  try {
    const engine = await loadEngine();

    switch (type) {
      case "init":
        engine.init();
        send({ ok: true });
        break;

      case "create_db": {
        const dim = (payload?.dim as number) ?? 0;
        dbHandle = Number(engine.createDb(dim));
        send({ ok: true, result: dbHandle });
        break;
      }

      case "prepare_ingest": {
        const total = (payload?.total as number) ?? 0;
        const dim = (payload?.dim as number) ?? 0;
        if (total <= 0 || dim <= 0) {
          throw new Error("Invalid ingest dimensions");
        }
        lastIds = new Int32Array(total);
        lastVectors = new Float32Array(total * dim);
        lastDim = dim;
        ingestCursor = 0;
        send({ ok: true });
        break;
      }

      case "free_db":
        engine.freeDb(dbHandle);
        dbHandle = 0;
        lastIds = new Int32Array(0);
        lastVectors = new Float32Array(0);
        lastDim = 0;
        send({ ok: true });
        break;

      case "upsert_batch": {
        const ids = payload?.ids as Int32Array;
        const vectors = payload?.vectors as Float32Array;
        const n = (payload?.n as number) ?? 0;
        const dim = (payload?.dim as number) ?? 0;

        if (!ids || !vectors) throw new Error("Missing data for upsert");

        const status = Number(engine.upsertBatch(dbHandle, ids, vectors, n, dim));
        if (status === 0) {
          if (lastDim !== dim || lastIds.length === 0) {
            lastIds = new Int32Array(n);
            lastVectors = new Float32Array(n * dim);
            lastDim = dim;
            ingestCursor = 0;
          }
          lastIds.set(ids.slice(0, n), ingestCursor);
          lastVectors.set(vectors.slice(0, n * dim), ingestCursor * dim);
          ingestCursor += n;
        }
        send({ ok: status === 0, result: status });
        break;
      }

      case "set_param": {
        const key = (payload?.key as string) ?? "";
        const value = (payload?.value as number) ?? 0;
        const status = Number(engine.setParam(dbHandle, key, value));
        send({ ok: status === 0, result: status });
        break;
      }

      case "search": {
        const query = payload?.query as Float32Array;
        const topk = (payload?.topk as number) ?? 10;

        if (!query) throw new Error("Missing query vector");

        const result = engine.search(dbHandle, query, topk);
        send({ ok: true, result });
        break;
      }

      case "stats": {
        send({ ok: true, result: engine.stats(dbHandle) });
        break;
      }

      case "iterate": {
        const offset = (payload?.offset as number) ?? 0;
        const limit = (payload?.limit as number) ?? 0;
        const dim = (payload?.dim as number) ?? lastDim;
        if (dim <= 0 || lastDim !== dim) {
          throw new Error("Iterate dim mismatch or missing dataset");
        }
        const sliceIds = lastIds.slice(offset, offset + limit);
        const sliceVectors = lastVectors.slice(offset * dim, (offset + limit) * dim);
        send({ ok: true, result: { ids: sliceIds, vectors: sliceVectors } });
        break;
      }

      default:
        send({ ok: false, error: `Unknown type: ${type}` });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    send({ ok: false, error: message });
  }
}

self.addEventListener("message", handleMessage);
