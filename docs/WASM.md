# PomaiDB WASM Demo

## Architecture

```
UI (React/Next)
  ↕ postMessage
Web Worker (src/worker/pomaidb.worker.ts)
  ↕ cwrap
Emscripten WASM module (public/wasm/pomaidb_wasm.js + .wasm)
```

- UI uses a worker client wrapper (`src/lib/pomaidbClient.ts`) to avoid blocking the main thread.
- The WASM module exports a minimal C ABI (`wasm/bindings/pomaidb_bindings.cpp`) built via `wasm/CMakeLists.txt`.

## Deterministic dataset

- Deterministic PRNG: Mulberry32.
- Dataset generation: `src/lib/dataset.js`.
  - `seed`, `size`, `dim`, and `queryCount` control reproducibility.
  - Vectors and queries are uniform in [-1, 1].

## Recall definition

- For each query:
  - Compute approximate top-k from WASM search.
  - Compute oracle top-k via brute force in JS.
- Recall@k = average overlap between approximate and oracle top-k / k.
- Gates:
  - Recall@1 ≥ 0.94
  - Recall@10 ≥ 0.94
  - Recall@100 ≥ 0.94
- If approximate mode fails, the UI and Node test sweep `approx_ratio` until gates pass or budget exhausted.

## Build + test

```bash
git submodule update --init --recursive
./scripts/build_wasm.sh
./scripts/dev.sh
```

Node headless recall gate:

```bash
./scripts/test_wasm_node.sh
```

All checks:

```bash
./scripts/test_all.sh
```

## Troubleshooting

- **COOP/COEP headers missing**: ensure `next.config.ts` headers are enabled and use `./scripts/dev.sh`.
- **WASM build fails**: confirm Emscripten is installed and `emcmake`/`emmake` are on PATH.
- **Recall fails**: increase `approx_ratio` or switch to Oracle mode.
- **Memory growth**: `ALLOW_MEMORY_GROWTH=1` is enabled; expect higher memory for larger datasets.

## Proof (fill after running locally)

- Commands executed:
  - `./scripts/build_wasm.sh`
  - `./scripts/test_wasm_node.sh`
  - `./scripts/dev.sh`
- Recall numbers:
  - Recall@1: (record from node test output)
  - Recall@10: (record from node test output)
  - Recall@100: (record from node test output)
- Sample latency summary (from UI benchmark):
  - p50: 
  - p95: 
  - p99: 
  - p999: 
- Confirmation: all ingestion/search executed in-browser with no remote compute.
