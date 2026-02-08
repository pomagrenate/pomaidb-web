"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { PomaiDbWorkerClient } from "@/lib/pomaidbClient";
import {
  DEFAULT_NORMAL_CONFIG,
  DIM_PRESETS,
  SIZE_PRESETS,
  configToJson,
  estimateVectorBytes,
  formatBytes,
  sanitizeNormalConfig,
} from "@/lib/playground/config";
import { ingestInChunks, iterateAll } from "@/lib/playground/db";
import { generateNormalDataset } from "@/lib/playground/datasets";
import { ERROR_CODES, logPlaygroundError, toPlaygroundError, toDebugInfo } from "@/lib/playground/errors";
import { initialState, playgroundReducer } from "@/lib/playground/stateMachine";
import { PlaygroundWorkerClient } from "@/lib/playground/workerClient";
import styles from "../playground.module.css";

export default function NormalPipelinePlayground() {
  const [config, setConfig] = useState(DEFAULT_NORMAL_CONFIG);
  const [dataset, setDataset] = useState<ReturnType<typeof generateNormalDataset> | null>(null);
  const [client, setClient] = useState<PomaiDbWorkerClient | null>(null);
  const [worker, setWorker] = useState<PlaygroundWorkerClient | null>(null);
  const [metrics, setMetrics] = useState({
    ingestThroughput: null as number | null,
    searchP50: null as number | null,
    searchP99: null as number | null,
    iterateThroughput: null as number | null,
    memoryEstimate: null as number | null,
  });
  const [progress, setProgress] = useState(0);
  const [training, setTraining] = useState<{ accuracy: number; lossHistory: number[] } | null>(null);
  const [errorInfo, setErrorInfo] = useState<ReturnType<typeof toDebugInfo> | null>(null);
  const [state, dispatch] = useReducer(playgroundReducer, initialState);

  useEffect(() => {
    const dbClient = new PomaiDbWorkerClient();
    const workerClient = new PlaygroundWorkerClient();
    setClient(dbClient);
    setWorker(workerClient);
    dbClient.init().catch((error) => {
      const mapped = toPlaygroundError(ERROR_CODES.WASM_INIT, "Failed to initialize WASM worker.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    });
    return () => {
      dbClient.terminate();
      workerClient.terminate();
    };
  }, []);

  const sanitized = useMemo(() => sanitizeNormalConfig(config), [config]);
  const memoryEstimate = useMemo(
    () => estimateVectorBytes(sanitized.size, sanitized.dim),
    [sanitized.size, sanitized.dim],
  );
  const configJson = useMemo(() => configToJson(sanitized), [sanitized]);

  const handleGenerate = () => {
    dispatch({ type: "GENERATE", message: "Generating labeled dataset..." });
    const generated = generateNormalDataset(sanitized);
    setDataset(generated);
    setMetrics((prev) => ({ ...prev, memoryEstimate }));
    setProgress(0);
    setTraining(null);
    dispatch({ type: "READY", message: "Dataset ready." });
  };

  const handleIngest = async () => {
    if (!client || !dataset) {
      dispatch({ type: "ERROR", message: "Generate a dataset first." });
      return;
    }
    dispatch({ type: "INGEST", message: "Ingesting vectors into WASM..." });
    setProgress(0);
    try {
      await client.freeDb();
      await client.createDb(sanitized.dim);
      const result = await ingestInChunks(
        client,
        dataset.ids,
        dataset.vectors,
        sanitized.dim,
        5000,
        (ingested) => setProgress(ingested / dataset.ids.length),
      );
      setMetrics((prev) => ({ ...prev, ingestThroughput: result.throughput, memoryEstimate }));
      dispatch({ type: "READY", message: "Ingested vectors." });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.INGEST, "Failed to ingest vectors.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleIterate = async () => {
    if (!client || !dataset) {
      dispatch({ type: "ERROR", message: "Generate and ingest a dataset first." });
      return;
    }
    dispatch({ type: "ITERATE", message: "Iterating records for training..." });
    setProgress(0);
    try {
      let count = 0;
      const total = dataset.ids.length;
      const result = await iterateAll(client, sanitized.dim, 5000, (ids) => {
        count += ids.length;
        setProgress(count / total);
      });
      setMetrics((prev) => ({ ...prev, iterateThroughput: result.throughput }));
      dispatch({ type: "READY", message: `Iterated ${count.toLocaleString()} records.` });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.ITERATE, "Iteration failed.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleTrain = async () => {
    if (!worker || !dataset) {
      dispatch({ type: "ERROR", message: "Generate dataset first." });
      return;
    }
    dispatch({ type: "TRAIN", message: "Training logistic regression (worker)..." });
    try {
      const result = (await worker.train(
        dataset.vectors,
        dataset.labels,
        sanitized.dim,
        sanitized.classCount,
        sanitized.seed,
      )) as { accuracy: number; lossHistory: number[] };
      setTraining(result);
      dispatch({ type: "READY", message: "Training complete." });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.TRAIN, "Training failed.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleReset = async () => {
    if (client) {
      await client.freeDb();
    }
    setDataset(null);
    setTraining(null);
    setProgress(0);
    dispatch({ type: "RESET" });
  };

  const copyConfig = async () => {
    await navigator.clipboard.writeText(configJson);
  };

  const copyDebug = async () => {
    if (!errorInfo) {
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
  };

  const testHookEnabled = typeof window !== "undefined" && window.location.search.includes("test=1");
  useEffect(() => {
    if (!testHookEnabled) {
      return;
    }
    (window as Window & { __playgroundTest?: Record<string, unknown> }).__playgroundTest = {
      runPipelineTraining: async () => {
        const generated = generateNormalDataset(sanitized);
        setDataset(generated);
        if (!client || !worker) {
          throw new Error("Clients not ready");
        }
        await client.freeDb();
        await client.createDb(sanitized.dim);
        await ingestInChunks(client, generated.ids, generated.vectors, sanitized.dim, 5000);
        const trainResult = await worker.train(
          generated.vectors,
          generated.labels,
          sanitized.dim,
          sanitized.classCount,
          sanitized.seed,
        );
        return { trainResult };
      },
    };
  }, [client, worker, sanitized, testHookEnabled]);

  return (
    <div className={styles.page}>
      <Container>
        <SectionHeading
          eyebrow="WASM Playground"
          title="End-to-end normal pipeline: dataset → PomaiDB → classifier"
          description="Deterministic train/test split and reproducible classifier accuracy, fully offline."
        />
        <div className={styles.proves}>
          <strong>What this proves</strong>
          <ul className={styles.list}>
            <li>PomaiDB can round-trip data for deterministic ML workflows.</li>
            <li>Re-running with same seed produces identical train/test and accuracy.</li>
            <li>Worker training avoids blocking the UI thread.</li>
          </ul>
        </div>

        <div className={styles.grid}>
          <Card>
            <h3>Config</h3>
            <div className={styles.field}>
              <label htmlFor="size">Dataset size</label>
              <select
                id="size"
                value={sanitized.size}
                onChange={(event) => setConfig((prev) => ({ ...prev, size: Number(event.target.value) }))}
              >
                {SIZE_PRESETS.map((value) => (
                  <option key={value} value={value}>
                    {value.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="dim">Dimension</label>
              <select
                id="dim"
                value={sanitized.dim}
                onChange={(event) => setConfig((prev) => ({ ...prev, dim: Number(event.target.value) }))}
              >
                {DIM_PRESETS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="topk">Top-K (for sanity search)</label>
              <input
                id="topk"
                type="number"
                min={1}
                max={100}
                value={sanitized.topK}
                onChange={(event) => setConfig((prev) => ({ ...prev, topK: Number(event.target.value) }))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="seed">Seed</label>
              <input
                id="seed"
                type="number"
                value={sanitized.seed}
                onChange={(event) => setConfig((prev) => ({ ...prev, seed: Number(event.target.value) }))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="classes">Classes</label>
              <input
                id="classes"
                type="number"
                min={2}
                max={10}
                value={sanitized.classCount}
                onChange={(event) => setConfig((prev) => ({ ...prev, classCount: Number(event.target.value) }))}
              />
            </div>
            <p className={styles.warning}>Estimated vector memory: {formatBytes(memoryEstimate)}</p>
          </Card>

          <Card>
            <h3>Pipeline actions</h3>
            <div className={styles.actions}>
              <Button onClick={handleGenerate}>Generate dataset</Button>
              <Button onClick={handleIngest} variant="secondary">
                Ingest into WASM
              </Button>
              <Button onClick={handleIterate} variant="ghost">
                Iterate out
              </Button>
              <Button onClick={handleTrain} variant="ghost">
                Train classifier
              </Button>
              <Button onClick={handleReset} variant="ghost">
                Reset DB
              </Button>
            </div>
            <div className={styles.status}>
              <strong>Status</strong>
              <p>{state.status}</p>
              {state.phase === "ingesting" || state.phase === "iterating" ? (
                <div className={styles.progress}>
                  <span style={{ width: `${Math.round(progress * 100)}%` }} />
                </div>
              ) : null}
              {errorInfo && (
                <div>
                  <p className={styles.error}>{errorInfo.message}</p>
                  <Button onClick={copyDebug} variant="ghost">
                    Copy debug info
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className={styles.grid}>
          <Card>
            <h3>Training results</h3>
            {training ? (
              <div className={styles.list}>
                <div>Accuracy: {training.accuracy.toFixed(3)}</div>
                <div>Loss curve: {training.lossHistory.map((loss) => loss.toFixed(3)).join(" → ")}</div>
              </div>
            ) : (
              <p>No training results yet.</p>
            )}
          </Card>
          <Card>
            <h3>Metrics</h3>
            <div className={styles.metrics}>
              <div>
                <strong>Ingest throughput</strong>
                <p>{metrics.ingestThroughput ? `${metrics.ingestThroughput.toLocaleString()} vec/s` : "—"}</p>
              </div>
              <div>
                <strong>Iterate throughput</strong>
                <p>{metrics.iterateThroughput ? `${metrics.iterateThroughput.toLocaleString()} vec/s` : "—"}</p>
              </div>
              <div>
                <strong>Memory estimate</strong>
                <p>{metrics.memoryEstimate ? formatBytes(metrics.memoryEstimate) : "—"}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className={styles.grid}>
          <Card>
            <h3>Reproducibility config</h3>
            <pre className={styles.codeBlock}>{configJson}</pre>
            <div className={styles.actions}>
              <Button onClick={copyConfig} variant="ghost">
                Copy config
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
