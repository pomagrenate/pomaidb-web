# SOT: PomaiDB WASM Plan

## Existing web stack + build system (current repo)

- Framework: Next.js App Router.
  - Entry points: `src/app/layout.tsx`, `src/app/page.tsx`, plus other routes under `src/app/*`. 
- Styling: Tailwind + CSS modules (`src/app/globals.css`, per-page `*.module.css`).
- Build config: `next.config.ts` (MDX support, headers config for COOP/COEP).
- Package scripts: `package.json` (`dev`, `build`, `start`, `lint`).

Local run (documented in `README.md`):

```bash
git submodule update --init --recursive
npm install
./scripts/build_wasm.sh
./scripts/dev.sh
```

## PomaiDB core components needed (submodule status)

- PomaiDB is expected as a git submodule at `third_party/pomaidb` (declared in `.gitmodules`).
- Submodule clone is blocked in this environment (HTTP 403), so the core sources were **not available** for inspection.
  - This prevents referencing concrete PomaiDB core files and entry points in this plan.
  - Once the submodule is available, this section must be updated with exact core entry points (e.g., DB creation, upsert batch, search top-k) from the PomaiDB C++ sources.

## Platform blockers / constraints (WASM)

- Filesystem: WASM build assumes in-memory only (no persistence).
- Threading: MVP is single-threaded, no pthreads.
- mmap / file IO: not used in the WASM lite path.
- Clocks: use `performance.now()` in browser; Node uses standard timers.

## Proposed MVP scope

- Implement WASM Core Lite (in-repo shim):
  - Minimal C ABI with:
    - `pomaidb_init`, `pomaidb_create_db`, `pomaidb_free_db`, `pomaidb_upsert_batch`, `pomaidb_search`, `pomaidb_set_param`, `pomaidb_stats_json`.
  - In-memory vector store + L2 search.
  - Approx mode simulated via a ratio that scans a prefix of the dataset; brute force oracle is available in JS.
- UI integration:
  - New route `src/app/wasm/page.tsx` exposes config, deterministic dataset generation, ingest, recall tests, and benchmarks.
  - Web worker runs the WASM module for responsiveness (`src/worker/pomaidb.worker.ts`).
- Deterministic dataset + recall harness shared between browser and Node:
  - `src/lib/dataset.js` for generation, brute force oracle, recall metrics.
- Build/test automation:
  - WASM build via `wasm/CMakeLists.txt` and `scripts/build_wasm.sh`.
  - Node headless test via `scripts/test_wasm_node.sh` and `scripts/wasm_node_test.mjs`.
  - `scripts/test_all.sh` orchestrates build + tests.

## Deferred (post-MVP)

- Integrating real PomaiDB core C++ logic from the submodule.
- PThreads + COOP/COEP multi-thread target.
- OPFS persistence.
- SIMD kernels.
