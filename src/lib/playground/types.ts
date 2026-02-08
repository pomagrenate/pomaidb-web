export type NormalVectorRecord = {
  id: number;
  label: number;
  vector: Float32Array;
};

export type RagVectorRecord = {
  id: number;
  docId: string;
  chunkId: string;
  text: string;
  tokens: string[];
  embedding: Float32Array;
  metadata: {
    length: number;
    source: string;
  };
};

export type PlaygroundConfig = {
  seed: number;
  size: number;
  dim: number;
  topK: number;
};

export type NormalPlaygroundConfig = PlaygroundConfig & {
  classCount: number;
  clusterSpread: number;
};

export type RagPlaygroundConfig = PlaygroundConfig & {
  docCount: number;
  chunksPerDoc: number;
  tokensPerChunk: number;
};

export type MetricsSnapshot = {
  ingestThroughput: number | null;
  searchP50: number | null;
  searchP99: number | null;
  iterateThroughput: number | null;
  memoryEstimate: number | null;
};

export type DebugInfo = {
  code: string;
  message: string;
  details: string;
  context?: Record<string, unknown>;
};

export type PlaygroundError = {
  code: string;
  userMessage: string;
  details: string;
  cause?: unknown;
};

export type OracleRecall = {
  recallAt1: number;
  recallAt10: number;
  recallAt50: number;
};

export type TrainingResult = {
  accuracy: number;
  lossHistory: number[];
  classCount: number;
  confusion?: number[][];
};
