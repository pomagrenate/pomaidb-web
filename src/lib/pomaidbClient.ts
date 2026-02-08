type Pending = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

type WorkerResponse = {
  id: number;
  ok: boolean;
  result?: unknown;
  error?: string;
};

export type SearchResult = {
  ids: Int32Array;
  scores: Float32Array;
  found: number;
};

export type IterateResult = {
  ids: Int32Array;
  vectors: Float32Array;
};

export class PomaiDbWorkerClient {
  private worker: Worker;
  private nextId = 1;
  private pending = new Map<number, Pending>();

  constructor() {
    this.worker = new Worker(new URL("../worker/pomaidb.worker.ts", import.meta.url), {
      type: "module",
    });
    this.worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const { id, ok, result, error } = event.data;
      const pending = this.pending.get(id);
      if (!pending) {
        return;
      }
      this.pending.delete(id);
      if (ok) {
        pending.resolve(result);
      } else {
        pending.reject(new Error(error ?? "Worker error"));
      }
    });
  }

  private call<T = unknown>(type: string, payload?: Record<string, unknown>): Promise<T> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      // FIX: Ép kiểu resolve thành (value: unknown) => void để khớp với type Pending
      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });

      // Gửi message xuống worker
      this.worker.postMessage({ id, type, payload });
    }); // Lưu ý: Không cần "as Promise<T>" ở cuối nữa vì new Promise<T> đã tự trả về đúng type, 
    // nhưng nếu bạn muốn giữ nguyên style cũ thì cứ để "as Promise<T>"
  }

  async init() {
    await this.call("init");
  }

  async createDb(dim: number) {
    await this.call("create_db", { dim });
  }

  async prepareIngest(total: number, dim: number) {
    await this.call("prepare_ingest", { total, dim });
  }

  async freeDb() {
    await this.call("free_db");
  }

  async upsertBatch(ids: Int32Array, vectors: Float32Array, n: number, dim: number) {
    await this.call("upsert_batch", { ids, vectors, n, dim });
  }

  async setParam(key: string, value: number) {
    await this.call("set_param", { key, value });
  }

  async search(query: Float32Array, topk: number) {
    return (await this.call<SearchResult>("search", { query, topk })) as SearchResult;
  }

  async stats() {
    return (await this.call<Record<string, number>>("stats")) as Record<string, number>;
  }

  async iterate(offset: number, limit: number, dim: number) {
    return (await this.call<IterateResult>("iterate", { offset, limit, dim })) as IterateResult;
  }

  terminate() {
    this.worker.terminate();
  }
}
