import { NormalPlaygroundConfig, RagPlaygroundConfig } from "./types";

export const SIZE_PRESETS = [10000, 50000, 100000] as const;
export const DIM_PRESETS = [128, 256, 384] as const;
export const TOPK_PRESETS = [5, 10, 20, 50] as const;

export const DEFAULT_NORMAL_CONFIG: NormalPlaygroundConfig = {
  seed: 1337,
  size: 10000,
  dim: 128,
  topK: 10,
  classCount: 4,
  clusterSpread: 0.12,
};

export const DEFAULT_RAG_CONFIG: RagPlaygroundConfig = {
  seed: 1337,
  size: 10000,
  dim: 128,
  topK: 10,
  docCount: 200,
  chunksPerDoc: 5,
  tokensPerChunk: 64,
};

export function clampToPresets(value: number, presets: readonly number[]) {
  if (presets.includes(value)) {
    return value;
  }
  return presets[0];
}

export function sanitizeNormalConfig(config: NormalPlaygroundConfig): NormalPlaygroundConfig {
  return {
    ...config,
    size: clampToPresets(config.size, SIZE_PRESETS),
    dim: clampToPresets(config.dim, DIM_PRESETS),
    topK: Math.min(Math.max(config.topK, 1), 100),
    classCount: Math.min(Math.max(config.classCount, 2), 10),
    clusterSpread: Math.min(Math.max(config.clusterSpread, 0.05), 0.5),
  };
}

export function sanitizeRagConfig(config: RagPlaygroundConfig): RagPlaygroundConfig {
  return {
    ...config,
    size: clampToPresets(config.size, SIZE_PRESETS),
    dim: clampToPresets(config.dim, DIM_PRESETS),
    topK: Math.min(Math.max(config.topK, 1), 100),
    docCount: Math.min(Math.max(config.docCount, 20), 2000),
    chunksPerDoc: Math.min(Math.max(config.chunksPerDoc, 2), 20),
    tokensPerChunk: Math.min(Math.max(config.tokensPerChunk, 16), 256),
  };
}

export function estimateVectorBytes(size: number, dim: number) {
  return size * dim * Float32Array.BYTES_PER_ELEMENT;
}

export function formatBytes(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function configToJson(config: object) {
  return JSON.stringify(config, null, 2);
}
