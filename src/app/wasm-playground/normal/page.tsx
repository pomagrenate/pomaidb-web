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
import { percentile } from "@/lib/playground/metrics";
import { computeRecall } from "@/lib/playground/oracle";
import { initialState, playgroundReducer } from "@/lib/playground/stateMachine";
import { PlaygroundWorkerClient } from "@/lib/playground/workerClient";
import styles from "../playground.module.css";

type SearchReport = {
  ids: number[];
  scores: number[];
  deterministic: boolean;
};

export default function NormalVectorsPlayground() {
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
  const [searchReport, setSearchReport] = useState<SearchReport | null>(null);
  const [recall, setRecall] = useState<{ recallAt1: number; recallAt10: number; recallAt50: number } | null>(null);
  const [exportReady, setExportReady] = useState<string | null>(null);
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
    dispatch({ type: "GENERATE", message: "Generating deterministic dataset..." });
    const generated = generateNormalDataset(sanitized);
    setDataset(generated);
    setProgress(0);
    setRecall(null);
    setSearchReport(null);
    setExportReady(null);
    setMetrics((prev) => ({ ...prev, memoryEstimate }));
    dispatch({ type: "READY", message: `Dataset generated (seed ${sanitized.seed}).` });
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
      dispatch({ type: "READY", message: `Ingested ${dataset.ids.length.toLocaleString()} vectors.` });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.INGEST, "Failed to ingest vectors.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleSearch = async (repeat = 1) => {
    if (!client || !dataset) {
      dispatch({ type: "ERROR", message: "Generate and ingest a dataset first." });
      return;
    }
    dispatch({ type: "SEARCH", message: "Running search..." });
    try {
      const query = dataset.queries.slice(0, sanitized.dim);
      const latencies: number[] = [];
      const runs: number[][] = [];
      const scores: number[][] = [];
      for (let i = 0; i < repeat; i += 1) {
        const start = performance.now();
        const result = await client.search(query, sanitized.topK);
        latencies.push(performance.now() - start);
        runs.push(Array.from(result.ids));
        scores.push(Array.from(result.scores));
      }
      const deterministic = runs.every((run) => run.join(",") === runs[0].join(","));
      setSearchReport({ ids: runs[0], scores: scores[0], deterministic });
      setMetrics((prev) => ({
        ...prev,
        searchP50: percentile(latencies, 50),
        searchP99: percentile(latencies, 99),
      }));
      dispatch({ type: "READY", message: "Search complete." });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.SEARCH, "Search failed.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleRecall = async () => {
    if (!client || !worker || !dataset) {
      dispatch({ type: "ERROR", message: "Generate and ingest a dataset first." });
      return;
    }
    if (dataset.ids.length > 20000) {
      dispatch({ type: "ERROR", message: "Oracle recall is only available for <= 20k vectors." });
      return;
    }
    dispatch({ type: "SEARCH", message: "Running recall vs oracle..." });
    try {
      const queryCount = Math.min(10, dataset.queries.length / sanitized.dim);
      const approx: number[][] = [];
      for (let q = 0; q < queryCount; q += 1) {
        const query = dataset.queries.slice(q * sanitized.dim, (q + 1) * sanitized.dim);
        const result = await client.search(query, 50);
        approx.push(Array.from(result.ids));
      }
      const exact = await worker.oracle(dataset.vectors, dataset.ids, dataset.queries, sanitized.dim, 50);
      const report = computeRecall(approx, exact.slice(0, queryCount));
      setRecall(report);
      dispatch({ type: "READY", message: "Recall report ready." });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.SEARCH, "Recall computation failed.", error);
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
    dispatch({ type: "ITERATE", message: "Iterating records out of PomaiDB..." });
    setProgress(0);
    try {
      let count = 0;
      const total = dataset.ids.length;
      const exportRows: string[] = [];
      const result = await iterateAll(client, sanitized.dim, 5000, (ids, vectors) => {
        count += ids.length;
        setProgress(count / total);
        if (total <= 20000) {
          for (let i = 0; i < ids.length; i += 1) {
            const base = i * sanitized.dim;
            const vector = Array.from(vectors.slice(base, base + sanitized.dim));
            exportRows.push(JSON.stringify({ id: ids[i], vector }));
          }
        }
      });
      setMetrics((prev) => ({ ...prev, iterateThroughput: result.throughput }));
      if (total <= 20000) {
        setExportReady(exportRows.join("\n"));
      } else {
        setExportReady(null);
      }
      dispatch({ type: "READY", message: `Iterated ${count.toLocaleString()} records.` });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.ITERATE, "Iteration failed.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
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

  const exportJsonl = () => {
    if (!exportReady) {
      return;
    }
    const blob = new Blob([exportReady], { type: "application/jsonl" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "normal_vectors_export.jsonl";
    link.click();
    URL.revokeObjectURL(url);
  };

  const testHookEnabled = typeof window !== "undefined" && window.location.search.includes("test=1");
  useEffect(() => {
    if (!testHookEnabled) {
      return;
    }
    (window as Window & { __playgroundTest?: Record<string, unknown> }).__playgroundTest = {
      runNormalPipeline: async () => {
        const generated = generateNormalDataset(sanitized);
        setDataset(generated);
        if (!client) {
          throw new Error("Client not ready");
        }
        await client.freeDb();
        await client.createDb(sanitized.dim);
        await ingestInChunks(client, generated.ids, generated.vectors, sanitized.dim, 5000);
        const query = generated.queries.slice(0, sanitized.dim);
        const result = await client.search(query, sanitized.topK);
        const iterStats = await iterateAll(client, sanitized.dim, 10000);
        return { result: { ids: Array.from(result.ids), scores: Array.from(result.scores) }, iterStats };
      },
    };
  }, [client, sanitized, testHookEnabled]);

  return (
    <div className={styles.page}>
      <Container>
        <SectionHeading
          eyebrow="WASM Playground"
          title="Normal vectors: ingest, search, iterate"
          description="Deterministic clustered vectors prove reproducibility, stable search ordering, and fast iteration in-browser."
        />
        <div className={styles.proves}>
          <strong>What this proves</strong>
          <ul className={styles.list}>
            <li>Same seed → same dataset → identical top-K ordering.</li>
            <li>WASM ingestion/search is deterministic and iteration returns all records.</li>
            <li>Oracle recall sanity check for small datasets.</li>
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
              <label htmlFor="topk">Top-K</label>
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
            <div className={styles.field}>
              <label htmlFor="spread">Cluster spread</label>
              <input
                id="spread"
                type="number"
                step={0.01}
                min={0.05}
                max={0.5}
                value={sanitized.clusterSpread}
                onChange={(event) => setConfig((prev) => ({ ...prev, clusterSpread: Number(event.target.value) }))}
              />
            </div>
            <p className={styles.warning}>Estimated vector memory: {formatBytes(memoryEstimate)}</p>
          </Card>

          <Card>
            <h3>Actions</h3>
            <div className={styles.actions}>
              <Button onClick={handleGenerate}>Generate dataset</Button>
              <Button onClick={handleIngest} variant="secondary">
                Ingest into WASM
              </Button>
              <Button onClick={() => handleSearch(1)} variant="ghost">
                Search once
              </Button>
              <Button onClick={() => handleSearch(5)} variant="ghost">
                Run search 5×
              </Button>
              <Button onClick={handleRecall} variant="ghost">
                Recall vs oracle
              </Button>
              <Button onClick={handleIterate} variant="ghost">
                Iterate all
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
            <h3>Metrics</h3>
            <div className={styles.metrics}>
              <div>
                <strong>Ingest throughput</strong>
                <p>{metrics.ingestThroughput ? `${metrics.ingestThroughput.toLocaleString()} vec/s` : "—"}</p>
              </div>
              <div>
                <strong>Search latency p50</strong>
                <p>{metrics.searchP50 ? `${metrics.searchP50.toFixed(2)} ms` : "—"}</p>
              </div>
              <div>
                <strong>Search latency p99</strong>
                <p>{metrics.searchP99 ? `${metrics.searchP99.toFixed(2)} ms` : "—"}</p>
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
          <Card>
            <h3>Results</h3>
            {searchReport ? (
              <div className={styles.list}>
                <div>
                  <strong>Top-K IDs</strong>
                  <p>{searchReport.ids.join(", ")}</p>
                </div>
                <div>
                  <strong>Distances</strong>
                  <p>{searchReport.scores.map((score) => score.toFixed(4)).join(", ")}</p>
                </div>
                <div>
                  <strong>Deterministic order</strong>
                  <p className={searchReport.deterministic ? styles.highlight : styles.error}>
                    {searchReport.deterministic ? "Stable across runs" : "Mismatch detected"}
                  </p>
                </div>
              </div>
            ) : (
              <p>No search results yet.</p>
            )}
            {recall && (
              <div className={styles.list}>
                <div>Recall@1: {recall.recallAt1.toFixed(3)}</div>
                <div>Recall@10: {recall.recallAt10.toFixed(3)}</div>
                <div>Recall@50: {recall.recallAt50.toFixed(3)}</div>
              </div>
            )}
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
          <Card>
            <h3>Export iteration (JSONL)</h3>
            <p>
              Export is enabled for ≤ 20k vectors. Iteration pulls records out of the WASM DB and writes
              JSONL.
            </p>
            <div className={styles.actions}>
              <Button onClick={exportJsonl} variant="ghost" disabled={!exportReady}>
                Download JSONL
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
