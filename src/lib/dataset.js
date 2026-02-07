export function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDeterministicDataset({ seed, size, dim, queryCount }) {
  const rand = mulberry32(seed);
  const vectors = new Float32Array(size * dim);
  const ids = new Int32Array(size);
  for (let i = 0; i < size; i += 1) {
    ids[i] = i + 1;
    const base = i * dim;
    for (let d = 0; d < dim; d += 1) {
      vectors[base + d] = rand() * 2 - 1;
    }
  }

  const queries = new Float32Array(queryCount * dim);
  for (let q = 0; q < queryCount; q += 1) {
    const base = q * dim;
    for (let d = 0; d < dim; d += 1) {
      queries[base + d] = rand() * 2 - 1;
    }
  }

  return { vectors, ids, queries };
}

export function bruteForceTopK({ vectors, ids, query, dim, topk }) {
  const count = ids.length;
  const scores = new Array(count);
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

export function computeRecallAtK({ approxIds, exactIds, k }) {
  const exactSet = new Set(exactIds.slice(0, k));
  let hits = 0;
  for (const id of approxIds.slice(0, k)) {
    if (exactSet.has(id)) {
      hits += 1;
    }
  }
  return hits / k;
}

export function computeRecallReport({ approxResults, exactResults, ks }) {
  const totals = {};
  for (const k of ks) {
    totals[k] = 0;
  }
  const queryCount = approxResults.length;
  for (let i = 0; i < queryCount; i += 1) {
    for (const k of ks) {
      totals[k] += computeRecallAtK({
        approxIds: approxResults[i],
        exactIds: exactResults[i],
        k,
      });
    }
  }
  const report = {};
  for (const k of ks) {
    report[k] = totals[k] / queryCount;
  }
  return report;
}

export function percentile(values, p) {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)));
  return sorted[idx];
}
