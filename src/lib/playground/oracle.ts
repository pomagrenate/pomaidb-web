import { OracleRecall } from "./types";

export function bruteForceTopK(vectors: Float32Array, ids: Int32Array, query: Float32Array, dim: number, topk: number) {
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
  return scores.slice(0, topk).map((entry) => entry.id);
}

export function computeRecall(approx: number[][], exact: number[][]): OracleRecall {
  const ks = [1, 10, 50];
  const totals = { 1: 0, 10: 0, 50: 0 };
  for (let i = 0; i < approx.length; i += 1) {
    for (const k of ks) {
      const exactSet = new Set(exact[i].slice(0, k));
      let hits = 0;
      for (const id of approx[i].slice(0, k)) {
        if (exactSet.has(id)) {
          hits += 1;
        }
      }
      totals[k as 1 | 10 | 50] += hits / k;
    }
  }
  const count = approx.length || 1;
  return {
    recallAt1: totals[1] / count,
    recallAt10: totals[10] / count,
    recallAt50: totals[50] / count,
  };
}
