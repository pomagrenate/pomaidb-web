"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { PomaiDbWorkerClient } from "@/lib/pomaidbClient";
import {
  bruteForceTopK,
  computeRecallReport,
  generateDeterministicDataset,
  percentile,
} from "@/lib/dataset";
import styles from "./page.module.css";

type DatasetState = {
  ids: Int32Array;
  vectors: Float32Array;
  queries: Float32Array;
};

type RecallReport = {
  1: number;
  10: number;
  100: number;
};

const DEFAULT_SEED = 1337;
const DEFAULT_TOPK = 10;
const DEFAULT_QUERY_COUNT = 25;

const sizeOptions = [1000, 5000, 10000];
const dimOptions = [128, 256, 512];

export default function WasmPlaygroundPage() {
  const [dim, setDim] = useState(128);
  const [size, setSize] = useState(1000);
  const [topk, setTopk] = useState(DEFAULT_TOPK);
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [mode, setMode] = useState<"approx" | "oracle">("approx");
  const [approxRatio, setApproxRatio] = useState(0.4);
  const [dataset, setDataset] = useState<DatasetState | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [recall, setRecall] = useState<RecallReport | null>(null);
  const [latency, setLatency] = useState<{ p50: number; p95: number; p99: number; p999: number } | null>(null);
  const [throughput, setThroughput] = useState<number | null>(null);
  const [memoryEstimate, setMemoryEstimate] = useState<number | null>(null);
  const [lastSearchIds, setLastSearchIds] = useState<Int32Array | null>(null);
  const [tuningNote, setTuningNote] = useState<string | null>(null);

  const [client, setClient] = useState<PomaiDbWorkerClient | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const instance = new PomaiDbWorkerClient();
    setClient(instance);
    instance.init().catch((error) => setStatus(`Init failed: ${error.message}`));
    return () => {
      instance.terminate();
    };
  }, []);

  const queries = dataset?.queries ?? new Float32Array();

  const handleGenerate = () => {
    const generated = generateDeterministicDataset({
      seed,
      size,
      dim,
      queryCount: DEFAULT_QUERY_COUNT,
    });
    setDataset(generated);
    setRecall(null);
    setLatency(null);
    setThroughput(null);
    setLastSearchIds(null);
    setTuningNote(null);
    setStatus(`Generated deterministic dataset (seed ${seed}).`);
  };

  const handleIngest = async () => {
    if (!dataset) {
      setStatus("Generate a dataset first.");
      return;
    }
    setStatus("Ingesting into WASM runtime...");
    const start = performance.now();
    if (!client) {
      setStatus("WASM worker not ready yet.");
      return;
    }
    await client.freeDb();
    await client.createDb(dim);
    if (mode === "approx") {
      await client.setParam("approx_ratio", approxRatio);
    } else {
      await client.setParam("approx_ratio", 1);
    }
    await client.upsertBatch(dataset.ids, dataset.vectors, dataset.ids.length, dim);
    const elapsed = performance.now() - start;
    const perSec = Math.round((dataset.ids.length / elapsed) * 1000);
    setThroughput(perSec);
    const estimate = dataset.ids.length * dim * 4;
    setMemoryEstimate(estimate);
    setStatus(`Ingested ${dataset.ids.length} vectors into WASM.`);
  };

  const handleSearch = async () => {
    if (!dataset || !client) {
      setStatus("Generate and ingest a dataset first.");
      return;
    }
    const query = dataset.queries.slice(0, dim);
    setStatus("Running search...");
    const start = performance.now();
    const result = await client.search(query, topk);
    const elapsed = performance.now() - start;
    setLastSearchIds(result.ids);
    setLatency({ p50: elapsed, p95: elapsed, p99: elapsed, p999: elapsed });
    setStatus(`Search completed in ${elapsed.toFixed(2)}ms.`);
  };

  const runRecallPass = async () => {
    if (!dataset || !client) {
      setStatus("Generate and ingest a dataset first.");
      return;
    }
    setStatus("Running recall test...");
    const approxResults: number[][] = [];
    const exactResults: number[][] = [];
    for (let q = 0; q < DEFAULT_QUERY_COUNT; q += 1) {
      const query = dataset.queries.slice(q * dim, (q + 1) * dim);
      const approx = await client.search(query, 100);
      approxResults.push(Array.from(approx.ids));
      exactResults.push(
        bruteForceTopK({
          vectors: dataset.vectors,
          ids: dataset.ids,
          query,
          dim,
          topk: 100,
        })
      );
    }
    const report = computeRecallReport({
      approxResults,
      exactResults,
      ks: [1, 10, 100],
    }) as RecallReport;
    setRecall(report);
    return report;
  };

  const handleRecall = async () => {
    if (!client) {
      setStatus("WASM worker not ready yet.");
      return;
    }
    setTuningNote(null);
    let report = await runRecallPass();
    if (!report || mode !== "approx") {
      return;
    }
    const gates = report[1] >= 0.94 && report[10] >= 0.94 && report[100] >= 0.94;
    if (gates) {
      setStatus("Recall gates satisfied.");
      return;
    }
    let tuned = approxRatio;
    while (tuned < 1) {
      tuned = Math.min(1, Number((tuned + 0.1).toFixed(2)));
      await client.setParam("approx_ratio", tuned);
      report = await runRecallPass();
      if (report && report[1] >= 0.94 && report[10] >= 0.94 && report[100] >= 0.94) {
        setApproxRatio(tuned);
        setTuningNote(`Recall gates failed at ${approxRatio}. Auto-tuned approx_ratio to ${tuned}.`);
        setStatus("Recall gates satisfied after tuning.");
        return;
      }
    }
    setStatus("Recall gates failed after tuning.");
  };

  const handleBenchmark = async () => {
    if (!dataset || !client) {
      setStatus("Generate and ingest a dataset first.");
      return;
    }
    const samples: number[] = [];
    const count = Math.min(DEFAULT_QUERY_COUNT, dataset.queries.length / dim);
    for (let q = 0; q < count; q += 1) {
      const query = dataset.queries.slice(q * dim, (q + 1) * dim);
      const start = performance.now();
      await client.search(query, topk);
      samples.push(performance.now() - start);
    }
    setLatency({
      p50: percentile(samples, 50),
      p95: percentile(samples, 95),
      p99: percentile(samples, 99),
      p999: percentile(samples, 99.9),
    });
    setStatus("Benchmark complete.");
  };

  return (
    <div className={styles.page}>
      <Container>
        <SectionHeading
          eyebrow="PomaiDB in Browser"
          title="Run PomaiDB core logic fully in WebAssembly."
          description="Generate a deterministic dataset, ingest it into the WASM runtime, and validate recall and latency locally."
        />
        <div className={styles.grid}>
          <Card>
            <h3>Config</h3>
            <div className={styles.field}>
              <label htmlFor="dim">Dimension</label>
              <select id="dim" value={dim} onChange={(event) => setDim(Number(event.target.value))}>
                {dimOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="size">Dataset size</label>
              <select id="size" value={size} onChange={(event) => setSize(Number(event.target.value))}>
                {sizeOptions.map((value) => (
                  <option key={value} value={value}>
                    {value.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="topk">Top-k</label>
              <input
                id="topk"
                type="number"
                value={topk}
                min={1}
                max={100}
                onChange={(event) => setTopk(Number(event.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="seed">Seed</label>
              <input
                id="seed"
                type="number"
                value={seed}
                onChange={(event) => setSeed(Number(event.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="mode">Algorithm mode</label>
              <select id="mode" value={mode} onChange={(event) => setMode(event.target.value as "approx" | "oracle")}>
                <option value="approx">Approx mode (ratio)</option>
                <option value="oracle">Brute force oracle</option>
              </select>
            </div>
            {mode === "approx" && (
              <div className={styles.field}>
                <label htmlFor="ratio">Approx ratio</label>
                <input
                  id="ratio"
                  type="number"
                  step={0.05}
                  min={0.05}
                  max={1}
                  value={approxRatio}
                  onChange={(event) => setApproxRatio(Number(event.target.value))}
                />
              </div>
            )}
          </Card>
          <Card>
            <h3>Actions</h3>
            <div className={styles.actions}>
              <Button onClick={handleGenerate}>Generate dataset</Button>
              <Button onClick={handleIngest} variant="secondary">
                Ingest into WASM
              </Button>
              <Button onClick={handleRecall} variant="ghost">
                Run recall test
              </Button>
              <Button onClick={handleSearch} variant="ghost">
                Search single query
              </Button>
              <Button onClick={handleBenchmark} variant="ghost">
                Benchmark quick
              </Button>
            </div>
            <div className={styles.status}>
              <strong>Status</strong>
              <p>{status}</p>
              {tuningNote && <p className={styles.tuning}>{tuningNote}</p>}
            </div>
          </Card>
        </div>
        <div className={styles.grid}>
          <Card>
            <h3>Metrics</h3>
            <ul>
              <li>Ingest throughput: {throughput ? `${throughput.toLocaleString()} vec/s` : "—"}</li>
              <li>
                Memory estimate: {memoryEstimate ? `${(memoryEstimate / 1024 / 1024).toFixed(2)} MB` : "—"}
              </li>
            </ul>
            {latency && (
              <ul>
                <li>Latency p50: {latency.p50.toFixed(2)} ms</li>
                <li>Latency p95: {latency.p95.toFixed(2)} ms</li>
                <li>Latency p99: {latency.p99.toFixed(2)} ms</li>
                <li>Latency p999: {latency.p999.toFixed(2)} ms</li>
              </ul>
            )}
          </Card>
          <Card>
            <h3>Recall report</h3>
            {recall ? (
              <ul>
                <li>Recall@1: {recall[1].toFixed(3)}</li>
                <li>Recall@10: {recall[10].toFixed(3)}</li>
                <li>Recall@100: {recall[100].toFixed(3)}</li>
              </ul>
            ) : (
              <p>No recall data yet.</p>
            )}
            {lastSearchIds && (
              <div className={styles.results}>
                <strong>Last search IDs</strong>
                <p>{Array.from(lastSearchIds).join(", ")}</p>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}
