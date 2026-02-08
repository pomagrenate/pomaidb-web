import { PomaiDbWorkerClient, SearchResult } from "../pomaidbClient";
import { formatRate, yieldToBrowser } from "./metrics";

export async function ingestInChunks(
  client: PomaiDbWorkerClient,
  ids: Int32Array,
  vectors: Float32Array,
  dim: number,
  chunkSize = 5000,
  onProgress?: (ingested: number) => void,
) {
  const total = ids.length;
  await client.prepareIngest(total, dim);
  let offset = 0;
  const start = performance.now();
  while (offset < total) {
    const end = Math.min(total, offset + chunkSize);
    const idSlice = ids.slice(offset, end);
    const vecSlice = vectors.slice(offset * dim, end * dim);
    await client.upsertBatch(idSlice, vecSlice, idSlice.length, dim);
    offset = end;
    onProgress?.(offset);
    await yieldToBrowser();
  }
  const elapsed = performance.now() - start;
  return {
    throughput: formatRate(total, elapsed),
    elapsed,
  };
}

export async function searchOnce(client: PomaiDbWorkerClient, query: Float32Array, topk: number): Promise<SearchResult> {
  return client.search(query, topk);
}

export async function iterateAll(
  client: PomaiDbWorkerClient,
  dim: number,
  batchSize = 5000,
  onBatch?: (ids: Int32Array, vectors: Float32Array) => void,
) {
  const stats = await client.stats();
  const total = stats.count ?? 0;
  let offset = 0;
  const start = performance.now();
  while (offset < total) {
    const limit = Math.min(batchSize, total - offset);
    const batch = await client.iterate(offset, limit, dim);
    onBatch?.(batch.ids, batch.vectors);
    offset += limit;
    await yieldToBrowser();
  }
  const elapsed = performance.now() - start;
  return {
    throughput: formatRate(total, elapsed),
    elapsed,
  };
}
