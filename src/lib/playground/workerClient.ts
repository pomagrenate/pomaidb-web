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

export class PlaygroundWorkerClient {
  private worker: Worker;
  private nextId = 1;
  private pending = new Map<number, Pending>();

  constructor() {
    this.worker = new Worker(new URL("../../worker/playground.worker.ts", import.meta.url), {
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
      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
      this.worker.postMessage({ id, type, payload });
    });
  }

  oracle(vectors: Float32Array, ids: Int32Array, queries: Float32Array, dim: number, topk: number) {
    return this.call<number[][]>("oracle", { vectors, ids, queries, dim, topk });
  }

  train(vectors: Float32Array, labels: Int32Array, dim: number, classCount: number, seed: number) {
    return this.call("train", { vectors, labels, dim, classCount, seed });
  }

  embed(text: string, dim: number, seed: number) {
    return this.call<{ tokens: string[]; embedding: Float32Array }>("embed", { text, dim, seed });
  }

  terminate() {
    this.worker.terminate();
  }
}
