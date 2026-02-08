import { NormalPlaygroundConfig, RagPlaygroundConfig } from "./types";
import { mulberry32 } from "./random";
import { demoEmbed, tokenize } from "./tokenizer";

const WORD_BANK = [
  "vector",
  "database",
  "search",
  "latency",
  "deterministic",
  "offline",
  "precision",
  "recall",
  "embedding",
  "storage",
  "chunk",
  "token",
  "pipeline",
  "index",
  "query",
  "cluster",
  "similarity",
  "dimension",
  "worker",
  "wasm",
];

export type NormalDataset = {
  ids: Int32Array;
  vectors: Float32Array;
  labels: Int32Array;
  queries: Float32Array;
};

export type RagDataset = {
  ids: Int32Array;
  vectors: Float32Array;
  records: {
    id: number;
    docId: string;
    chunkId: string;
    text: string;
    tokens: string[];
    embedding: Float32Array;
    metadata: { length: number; source: string };
  }[];
  queries: { text: string; embedding: Float32Array }[];
};

export function generateNormalDataset(config: NormalPlaygroundConfig): NormalDataset {
  const rand = mulberry32(config.seed);
  const ids = new Int32Array(config.size);
  const vectors = new Float32Array(config.size * config.dim);
  const labels = new Int32Array(config.size);
  const classCount = config.classCount;
  const centers = Array.from({ length: classCount }, () => {
    const center = new Float32Array(config.dim);
    for (let d = 0; d < config.dim; d += 1) {
      center[d] = rand() * 2 - 1;
    }
    return center;
  });

  for (let i = 0; i < config.size; i += 1) {
    ids[i] = i + 1;
    const label = i % classCount;
    labels[i] = label;
    const center = centers[label];
    const base = i * config.dim;
    for (let d = 0; d < config.dim; d += 1) {
      const noise = (rand() * 2 - 1) * config.clusterSpread;
      vectors[base + d] = center[d] + noise;
    }
  }

  const queryCount = Math.min(25, config.size);
  const queries = new Float32Array(queryCount * config.dim);
  for (let q = 0; q < queryCount; q += 1) {
    const idx = Math.floor(rand() * config.size);
    const base = q * config.dim;
    const vecBase = idx * config.dim;
    for (let d = 0; d < config.dim; d += 1) {
      queries[base + d] = vectors[vecBase + d];
    }
  }

  return { ids, vectors, labels, queries };
}

export function generateRagDataset(config: RagPlaygroundConfig): RagDataset {
  const rand = mulberry32(config.seed);
  const records = [] as RagDataset["records"];
  const queries = [] as RagDataset["queries"];
  const totalChunks = config.size;
  const ids = new Int32Array(totalChunks);
  const vectors = new Float32Array(totalChunks * config.dim);
  let chunkIndex = 0;

  for (let doc = 0; chunkIndex < totalChunks; doc += 1) {
    const docId = `doc-${doc + 1}`;
    for (let chunk = 0; chunk < config.chunksPerDoc; chunk += 1) {
      if (chunkIndex >= totalChunks) {
        break;
      }
      const chunkId = `${docId}-chunk-${chunk + 1}`;
      const tokenCount = config.tokensPerChunk;
      const words = [] as string[];
      for (let w = 0; w < tokenCount; w += 1) {
        words.push(WORD_BANK[Math.floor(rand() * WORD_BANK.length)]);
      }
      const text = words.join(" ");
      const tokens = tokenize(text);
      const embedding = demoEmbed(text, config.dim, config.seed);
      ids[chunkIndex] = chunkIndex + 1;
      vectors.set(embedding, chunkIndex * config.dim);
      records.push({
        id: ids[chunkIndex],
        docId,
        chunkId,
        text,
        tokens,
        embedding,
        metadata: { length: text.length, source: "synthetic" },
      });
      chunkIndex += 1;
    }
  }

  for (let i = 0; i < Math.min(10, records.length); i += 1) {
    const record = records[Math.floor(rand() * records.length)];
    queries.push({
      text: record.text,
      embedding: demoEmbed(record.text, config.dim, config.seed),
    });
  }

  return { ids, vectors, records, queries };
}
