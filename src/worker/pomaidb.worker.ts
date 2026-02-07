type Pending = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

type WorkerRequest = {
  id: number;
  type: string;
  payload?: Record<string, unknown>;
};

type ModuleType = {
  cwrap: (name: string, returnType: string | null, argTypes: string[]) => (...args: unknown[]) => unknown;
  UTF8ToString: (ptr: number) => string;
  stringToUTF8: (value: string, ptr: number, maxBytes: number) => void;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  HEAPF32: Float32Array;
  HEAP32: Int32Array;
};

let moduleInstance: ModuleType | null = null;
let moduleLoadPromise: Promise<ModuleType> | null = null;
let dbHandle = 0;

async function loadModule() {
  if (moduleInstance) {
    return moduleInstance;
  }
  if (!moduleLoadPromise) {
    moduleLoadPromise = (async () => {
      const moduleFactory = (await import(/* webpackIgnore: true */ "/wasm/pomaidb_wasm.js")).default as (
        config?: Record<string, unknown>
      ) => Promise<ModuleType>;
      moduleInstance = await moduleFactory({
        locateFile: (file) => `/wasm/${file}`,
      });
      return moduleInstance;
    })();
  }
  return moduleLoadPromise;
}

function writeFloat32(module: ModuleType, data: Float32Array) {
  const ptr = module._malloc(data.byteLength);
  module.HEAPF32.set(data, ptr / 4);
  return ptr;
}

function writeInt32(module: ModuleType, data: Int32Array) {
  const ptr = module._malloc(data.byteLength);
  module.HEAP32.set(data, ptr / 4);
  return ptr;
}

async function handleMessage(event: MessageEvent<WorkerRequest>) {
  const { id, type, payload } = event.data;
  try {
    const module = await loadModule();
    if (type === "init") {
      const init = module.cwrap("pomaidb_init", null, []);
      init();
      postMessage({ id, ok: true });
      return;
    }
    if (type === "create_db") {
      const createDb = module.cwrap("pomaidb_create_db", "number", ["number"]);
      dbHandle = Number(createDb(payload?.dim ?? 0));
      postMessage({ id, ok: true, result: dbHandle });
      return;
    }
    if (type === "free_db") {
      const freeDb = module.cwrap("pomaidb_free_db", null, ["number"]);
      freeDb(dbHandle);
      dbHandle = 0;
      postMessage({ id, ok: true });
      return;
    }
    if (type === "upsert_batch") {
      const ids = payload?.ids as Int32Array;
      const vectors = payload?.vectors as Float32Array;
      const n = payload?.n as number;
      const dim = payload?.dim as number;
      const upsert = module.cwrap("pomaidb_upsert_batch", "number", ["number", "number", "number", "number", "number"]);
      const idsPtr = writeInt32(module, ids);
      const vecPtr = writeFloat32(module, vectors);
      const status = Number(upsert(dbHandle, idsPtr, vecPtr, n, dim));
      module._free(idsPtr);
      module._free(vecPtr);
      postMessage({ id, ok: status === 0, result: status });
      return;
    }
    if (type === "set_param") {
      const setParam = module.cwrap("pomaidb_set_param", "number", ["number", "string", "number"]);
      const status = Number(setParam(dbHandle, payload?.key ?? "", payload?.value ?? 0));
      postMessage({ id, ok: status === 0, result: status });
      return;
    }
    if (type === "search") {
      const query = payload?.query as Float32Array;
      const topk = payload?.topk as number;
      const search = module.cwrap("pomaidb_search", "number", ["number", "number", "number", "number", "number"]);
      const queryPtr = writeFloat32(module, query);
      const outIdsPtr = module._malloc(topk * Int32Array.BYTES_PER_ELEMENT);
      const outScoresPtr = module._malloc(topk * Float32Array.BYTES_PER_ELEMENT);
      const found = Number(search(dbHandle, queryPtr, topk, outIdsPtr, outScoresPtr));
      const ids = new Int32Array(module.HEAP32.buffer, outIdsPtr, found).slice();
      const scores = new Float32Array(module.HEAPF32.buffer, outScoresPtr, found).slice();
      module._free(queryPtr);
      module._free(outIdsPtr);
      module._free(outScoresPtr);
      postMessage({ id, ok: true, result: { ids, scores, found } });
      return;
    }
    if (type === "stats") {
      const stats = module.cwrap("pomaidb_stats_json", "number", ["number"]);
      const freeStr = module.cwrap("pomaidb_free_string", null, ["number"]);
      const ptr = Number(stats(dbHandle));
      const json = module.UTF8ToString(ptr);
      freeStr(ptr);
      postMessage({ id, ok: true, result: JSON.parse(json) });
      return;
    }
    postMessage({ id, ok: false, error: `Unknown type: ${type}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    postMessage({ id, ok: false, error: message });
  }
}

self.addEventListener("message", handleMessage);
