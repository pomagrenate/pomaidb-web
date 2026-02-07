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

type Engine = {
  init: () => void;
  createDb: (dim: number) => number;
  freeDb: (handle: number) => void;
  upsertBatch: (handle: number, ids: Int32Array, vectors: Float32Array, n: number, dim: number) => number;
  setParam: (handle: number, key: string, value: number) => number;
  search: (handle: number, query: Float32Array, topk: number) => SearchResult;
  stats: (handle: number) => Record<string, number>;
};

type SearchResult = {
  ids: Int32Array;
  scores: Float32Array;
  found: number;
};

const engineState: {
  instance: Engine | null;
  promise: Promise<Engine> | null;
} = {
  instance: null,
  promise: null,
};
let dbHandle = 0;

async function loadEngine() {
  if (engineState.instance) {
    return engineState.instance;
  }
  if (!engineState.promise) {
    engineState.promise = (async () => {
      try {
        const moduleFactory = (await import(/* webpackIgnore: true */ "/wasm/pomaidb_wasm.js")).default as (
          config?: Record<string, unknown>
        ) => Promise<ModuleType>;
        const moduleInstance = await moduleFactory({
          locateFile: (file) => `/wasm/${file}`,
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

function createWasmEngine(module: ModuleType): Engine {
  const init = module.cwrap("pomaidb_init", null, []);
  const createDb = module.cwrap("pomaidb_create_db", "number", ["number"]);
  const freeDb = module.cwrap("pomaidb_free_db", null, ["number"]);
  const upsertBatch = module.cwrap("pomaidb_upsert_batch", "number", ["number", "number", "number", "number", "number"]);
  const setParam = module.cwrap("pomaidb_set_param", "number", ["number", "string", "number"]);
  const search = module.cwrap("pomaidb_search", "number", ["number", "number", "number", "number", "number"]);
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
      init();
    },
    createDb: (dim) => Number(createDb(dim)),
    freeDb: (handle) => {
      freeDb(handle);
    },
    upsertBatch: (handle, ids, vectors, n, dim) => {
      const idsPtr = writeInt32(ids);
      const vecPtr = writeFloat32(vectors);
      const status = Number(upsertBatch(handle, idsPtr, vecPtr, n, dim));
      module._free(idsPtr);
      module._free(vecPtr);
      return status;
    },
    setParam: (handle, key, value) => Number(setParam(handle, key, value)),
    search: (handle, query, topk) => {
      const queryPtr = writeFloat32(query);
      const outIdsPtr = module._malloc(topk * Int32Array.BYTES_PER_ELEMENT);
      const outScoresPtr = module._malloc(topk * Float32Array.BYTES_PER_ELEMENT);
      const found = Number(search(handle, queryPtr, topk, outIdsPtr, outScoresPtr));
      const ids = new Int32Array(module.HEAP32.buffer, outIdsPtr, found).slice();
      const scores = new Float32Array(module.HEAPF32.buffer, outScoresPtr, found).slice();
      module._free(queryPtr);
      module._free(outIdsPtr);
      module._free(outScoresPtr);
      return { ids, scores, found };
    },
    stats: (handle) => {
      const ptr = Number(stats(handle));
      const json = module.UTF8ToString(ptr);
      freeStr(ptr);
      return JSON.parse(json) as Record<string, number>;
    },
  };
}

function createFallbackEngine(): Engine {
  let nextHandle = 1;
  const dbs = new Map<
    number,
    { dim: number; ids: Int32Array; vectors: Float32Array; approxRatio: number }
  >();

  return {
    init: () => {},
    createDb: (dim) => {
      const handle = nextHandle++;
      dbs.set(handle, { dim, ids: new Int32Array(), vectors: new Float32Array(), approxRatio: 1 });
      return handle;
    },
    freeDb: (handle) => {
      dbs.delete(handle);
    },
    upsertBatch: (handle, ids, vectors, n, dim) => {
      const entry = dbs.get(handle);
      if (!entry || entry.dim !== dim) {
        return 1;
      }
      entry.ids = ids.slice(0, n);
      entry.vectors = vectors.slice(0, n * dim);
      return 0;
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
        return { ids: new Int32Array(), scores: new Float32Array(), found: 0 };
      }
      const { dim, ids, vectors } = entry;
      const count = ids.length;
      const scores = new Array<{ id: number; score: number }>(count);
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
        return { count: 0 };
      }
      return {
        count: entry.ids.length,
        dim: entry.dim,
        approx_ratio: entry.approxRatio,
      };
    },
  };
}

async function handleMessage(event: MessageEvent<WorkerRequest>) {
  const { id, type, payload } = event.data;
  try {
    const engine = await loadEngine();
    if (type === "init") {
      engine.init();
      postMessage({ id, ok: true });
      return;
    }
    if (type === "create_db") {
      dbHandle = Number(engine.createDb(payload?.dim ?? 0));
      postMessage({ id, ok: true, result: dbHandle });
      return;
    }
    if (type === "free_db") {
      engine.freeDb(dbHandle);
      dbHandle = 0;
      postMessage({ id, ok: true });
      return;
    }
    if (type === "upsert_batch") {
      const ids = payload?.ids as Int32Array;
      const vectors = payload?.vectors as Float32Array;
      const n = payload?.n as number;
      const dim = payload?.dim as number;
      const status = Number(engine.upsertBatch(dbHandle, ids, vectors, n, dim));
      postMessage({ id, ok: status === 0, result: status });
      return;
    }
    if (type === "set_param") {
      const status = Number(engine.setParam(dbHandle, payload?.key ?? "", payload?.value ?? 0));
      postMessage({ id, ok: status === 0, result: status });
      return;
    }
    if (type === "search") {
      const query = payload?.query as Float32Array;
      const topk = payload?.topk as number;
      const result = engine.search(dbHandle, query, topk);
      postMessage({ id, ok: true, result });
      return;
    }
    if (type === "stats") {
      postMessage({ id, ok: true, result: engine.stats(dbHandle) });
      return;
    }
    postMessage({ id, ok: false, error: `Unknown type: ${type}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    postMessage({ id, ok: false, error: message });
  }
}

self.addEventListener("message", handleMessage);
