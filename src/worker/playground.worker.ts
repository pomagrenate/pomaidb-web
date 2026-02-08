import { bruteForceTopK } from "@/lib/playground/oracle";
import { demoEmbed, tokenize } from "@/lib/playground/tokenizer";
import { hashString, shuffleDeterministic } from "@/lib/playground/random";
import { TrainingResult } from "@/lib/playground/types";

type WorkerRequest = {
  id: number;
  type: string;
  payload?: Record<string, unknown>;
};

type WorkerResponse = {
  id: number;
  ok: boolean;
  result?: unknown;
  error?: string;
};

function send(id: number, response: Omit<WorkerResponse, "id">) {
  self.postMessage({ id, ...response });
}

function splitTrainTest(ids: Int32Array, trainRatio: number) {
  const train: number[] = [];
  const test: number[] = [];
  for (let i = 0; i < ids.length; i += 1) {
    const hash = hashString(String(ids[i]));
    if ((hash % 1000) / 1000 < trainRatio) {
      train.push(i);
    } else {
      test.push(i);
    }
  }
  return { train, test };
}

function trainLogisticRegression(
  vectors: Float32Array,
  labels: Int32Array,
  dim: number,
  classCount: number,
  seed: number,
): TrainingResult {
  const total = labels.length;
  const weights = new Float32Array(classCount * dim);
  const bias = new Float32Array(classCount);
  const learningRate = 0.1;
  const epochs = 8;

  const { train, test } = splitTrainTest(new Int32Array(total).map((_, i) => i), 0.8);
  const lossHistory: number[] = [];

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    shuffleDeterministic(train, seed + epoch);
    let totalLoss = 0;
    for (const idx of train) {
      const label = labels[idx];
      const offset = idx * dim;
      const logits = new Float32Array(classCount);
      for (let c = 0; c < classCount; c += 1) {
        let sum = bias[c];
        const base = c * dim;
        for (let d = 0; d < dim; d += 1) {
          sum += weights[base + d] * vectors[offset + d];
        }
        logits[c] = sum;
      }
      const maxLogit = Math.max(...logits);
      let denom = 0;
      const probs = new Float32Array(classCount);
      for (let c = 0; c < classCount; c += 1) {
        probs[c] = Math.exp(logits[c] - maxLogit);
        denom += probs[c];
      }
      for (let c = 0; c < classCount; c += 1) {
        probs[c] /= denom;
      }
      totalLoss += -Math.log(Math.max(probs[label], 1e-6));
      for (let c = 0; c < classCount; c += 1) {
        const grad = probs[c] - (c === label ? 1 : 0);
        const base = c * dim;
        for (let d = 0; d < dim; d += 1) {
          weights[base + d] -= learningRate * grad * vectors[offset + d];
        }
        bias[c] -= learningRate * grad;
      }
    }
    lossHistory.push(totalLoss / train.length);
  }

  let correct = 0;
  for (const idx of test) {
    const offset = idx * dim;
    let best = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let c = 0; c < classCount; c += 1) {
      let sum = bias[c];
      const base = c * dim;
      for (let d = 0; d < dim; d += 1) {
        sum += weights[base + d] * vectors[offset + d];
      }
      if (sum > bestScore) {
        bestScore = sum;
        best = c;
      }
    }
    if (best === labels[idx]) {
      correct += 1;
    }
  }
  const accuracy = test.length ? correct / test.length : 0;

  return { accuracy, lossHistory, classCount };
}

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = event.data;
  try {
    if (type === "oracle") {
      const vectors = payload?.vectors as Float32Array;
      const ids = payload?.ids as Int32Array;
      const queries = payload?.queries as Float32Array;
      const dim = (payload?.dim as number) ?? 0;
      const topk = (payload?.topk as number) ?? 10;
      if (!vectors || !ids || !queries || dim <= 0) {
        throw new Error("Invalid oracle payload");
      }
      const queryCount = Math.floor(queries.length / dim);
      const exact: number[][] = [];
      for (let q = 0; q < queryCount; q += 1) {
        const query = queries.slice(q * dim, (q + 1) * dim);
        exact.push(bruteForceTopK(vectors, ids, query, dim, topk));
      }
      send(id, { ok: true, result: exact });
      return;
    }

    if (type === "train") {
      const vectors = payload?.vectors as Float32Array;
      const labels = payload?.labels as Int32Array;
      const dim = (payload?.dim as number) ?? 0;
      const classCount = (payload?.classCount as number) ?? 2;
      const seed = (payload?.seed as number) ?? 0;
      if (!vectors || !labels || dim <= 0) {
        throw new Error("Invalid training payload");
      }
      const result = trainLogisticRegression(vectors, labels, dim, classCount, seed);
      send(id, { ok: true, result });
      return;
    }

    if (type === "embed") {
      const text = (payload?.text as string) ?? "";
      const dim = (payload?.dim as number) ?? 128;
      const seed = (payload?.seed as number) ?? 0;
      const tokens = tokenize(text);
      const embedding = demoEmbed(text, dim, seed);
      send(id, { ok: true, result: { tokens, embedding } });
      return;
    }

    throw new Error(`Unknown type: ${type}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    send(id, { ok: false, error: message });
  }
});
