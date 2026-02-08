"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { PomaiDbWorkerClient } from "@/lib/pomaidbClient";
import {
  DEFAULT_RAG_CONFIG,
  DIM_PRESETS,
  SIZE_PRESETS,
  configToJson,
  estimateVectorBytes,
  formatBytes,
  sanitizeRagConfig,
} from "@/lib/playground/config";
import { ingestInChunks } from "@/lib/playground/db";
import { generateRagDataset } from "@/lib/playground/datasets";
import { ERROR_CODES, logPlaygroundError, toPlaygroundError, toDebugInfo } from "@/lib/playground/errors";
import { initialState, playgroundReducer } from "@/lib/playground/stateMachine";
import { PlaygroundWorkerClient } from "@/lib/playground/workerClient";
import styles from "../playground.module.css";

export default function RagPipelinePlayground() {
  const [config, setConfig] = useState(DEFAULT_RAG_CONFIG);
  const [dataset, setDataset] = useState<ReturnType<typeof generateRagDataset> | null>(null);
  const [client, setClient] = useState<PomaiDbWorkerClient | null>(null);
  const [worker, setWorker] = useState<PlaygroundWorkerClient | null>(null);
  const [progress, setProgress] = useState(0);
  const [queryText, setQueryText] = useState("show deterministic retrieval");
  const [retrieved, setRetrieved] = useState<string[]>([]);
  const [synthesis, setSynthesis] = useState<string | null>(null);
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

  const sanitized = useMemo(() => sanitizeRagConfig(config), [config]);
  const memoryEstimate = useMemo(
    () => estimateVectorBytes(sanitized.size, sanitized.dim),
    [sanitized.size, sanitized.dim],
  );
  const configJson = useMemo(() => configToJson(sanitized), [sanitized]);

  const handleGenerate = () => {
    dispatch({ type: "GENERATE", message: "Generating docs/chunks..." });
    const generated = generateRagDataset(sanitized);
    setDataset(generated);
    setRetrieved([]);
    setSynthesis(null);
    dispatch({ type: "READY", message: "Docs ready." });
  };

  const handleIngest = async () => {
    if (!client || !dataset) {
      dispatch({ type: "ERROR", message: "Generate a dataset first." });
      return;
    }
    dispatch({ type: "INGEST", message: "Ingesting embeddings into WASM..." });
    setProgress(0);
    try {
      await client.freeDb();
      await client.createDb(sanitized.dim);
      await ingestInChunks(
        client,
        dataset.ids,
        dataset.vectors,
        sanitized.dim,
        5000,
        (ingested) => setProgress(ingested / dataset.ids.length),
      );
      dispatch({ type: "READY", message: "Ingested RAG embeddings." });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.INGEST, "Failed to ingest embeddings.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleRetrieve = async () => {
    if (!client || !worker || !dataset) {
      dispatch({ type: "ERROR", message: "Generate and ingest a dataset first." });
      return;
    }
    dispatch({ type: "SEARCH", message: "Retrieving top chunks..." });
    try {
      const embed = await worker.embed(queryText, sanitized.dim, sanitized.seed);
      const result = await client.search(embed.embedding, sanitized.topK);
      const lookup = new Map(dataset.records.map((record) => [record.id, record]));
      const rows = Array.from(result.ids).map((id, index) => {
        const record = lookup.get(id);
        if (!record) {
          return `#${index + 1} id=${id}`;
        }
        return `#${index + 1} ${record.chunkId}: ${record.text}`;
      });
      setRetrieved(rows);
      setSynthesis(null);
      dispatch({ type: "READY", message: "Retrieval complete." });
    } catch (error) {
      const mapped = toPlaygroundError(ERROR_CODES.SEARCH, "Retrieval failed.", error);
      logPlaygroundError(mapped);
      setErrorInfo(toDebugInfo(mapped));
      dispatch({ type: "ERROR", message: mapped.userMessage });
    }
  };

  const handleSynthesize = () => {
    if (retrieved.length === 0) {
      dispatch({ type: "ERROR", message: "Retrieve context first." });
      return;
    }
    const summary = retrieved.slice(0, 3).join(" ");
    setSynthesis(`(Not an LLM) Combined context: ${summary}`);
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
      runRagRetrieval: async () => {
        const generated = generateRagDataset(sanitized);
        setDataset(generated);
        if (!client || !worker) {
          throw new Error("Clients not ready");
        }
        await client.freeDb();
        await client.createDb(sanitized.dim);
        await ingestInChunks(client, generated.ids, generated.vectors, sanitized.dim, 5000);
        const embed = await worker.embed(queryText, sanitized.dim, sanitized.seed);
        const result = await client.search(embed.embedding, sanitized.topK);
        return { result: { ids: Array.from(result.ids), scores: Array.from(result.scores) } };
      },
    };
  }, [client, worker, sanitized, queryText, testHookEnabled]);

  return (
    <div className={styles.page}>
      <Container>
        <SectionHeading
          eyebrow="WASM Playground"
          title="End-to-end RAG retrieval pipeline"
          description="Generate docs, ingest embeddings, retrieve top chunks, and review deterministic context." 
        />
        <div className={styles.proves}>
          <strong>What this proves</strong>
          <ul className={styles.list}>
            <li>Deterministic embedding + retrieval pipeline with stable ordering.</li>
            <li>Clear separation between retrieval and optional synthesis.</li>
            <li>Offline, reproducible RAG workflow in browser.</li>
            <li>Demo embedder uses deterministic hashing, not ML inference.</li>
          </ul>
        </div>

        <div className={styles.grid}>
          <Card>
            <h3>Config</h3>
            <div className={styles.field}>
              <label htmlFor="size">Chunk count</label>
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
              <label htmlFor="dim">Embedding dim</label>
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
              <label htmlFor="docCount">Docs</label>
              <input
                id="docCount"
                type="number"
                min={20}
                max={2000}
                value={sanitized.docCount}
                onChange={(event) => setConfig((prev) => ({ ...prev, docCount: Number(event.target.value) }))}
              />
            </div>
            <p className={styles.warning}>Estimated vector memory: {formatBytes(memoryEstimate)}</p>
          </Card>

          <Card>
            <h3>Pipeline actions</h3>
            <div className={styles.actions}>
              <Button onClick={handleGenerate}>Generate docs</Button>
              <Button onClick={handleIngest} variant="secondary">
                Ingest embeddings
              </Button>
              <Button onClick={handleRetrieve} variant="ghost">
                Retrieve top chunks
              </Button>
              <Button onClick={handleSynthesize} variant="ghost">
                Synthesize answer (optional)
              </Button>
            </div>
            <div className={styles.status}>
              <strong>Status</strong>
              <p>{state.status}</p>
              {state.phase === "ingesting" ? (
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
            <h3>Query text</h3>
            <div className={styles.field}>
              <label htmlFor="query">Query</label>
              <textarea
                id="query"
                rows={3}
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
              />
            </div>
          </Card>
          <Card>
            <h3>Retrieved context</h3>
            {retrieved.length > 0 ? (
              <pre className={styles.codeBlock}>{retrieved.join("\n")}</pre>
            ) : (
              <p>No retrieval yet.</p>
            )}
            {synthesis && (
              <div className={styles.section}>
                <strong>Optional synthesis</strong>
                <p>{synthesis}</p>
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
        </div>
      </Container>
    </div>
  );
}
