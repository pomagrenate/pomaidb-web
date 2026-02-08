# PomaiDB Web

Official marketing + documentation site for PomaiDB, the local-first embedded vector database.

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## WASM build + playground

```bash
git submodule update --init --recursive
./scripts/build_wasm.sh
./scripts/dev.sh
```

Open [http://localhost:3000/wasm-playground](http://localhost:3000/wasm-playground) to use the Trust Playground:

- Normal vectors: ingest/search/iterate with deterministic clustered data.
- RAG vectors: deterministic tokens + embeddings with retrieval.
- End-to-end normal pipeline: generate → ingest → iterate → train classifier.
- End-to-end RAG pipeline: generate docs → ingest → retrieve → optional synthesis.

Limitations: the demo embedder is a deterministic hashing-based stub (not an ML model), and oracle recall is only enabled for datasets ≤ 20k.

## Headless WASM test

```bash
./scripts/test_wasm_node.sh
```

## All checks

```bash
./scripts/test_all.sh
```

## Playground CI checklist

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:integration
```

## How to edit content

- **Home + core pages**: Update files under `src/app/`.
  - Home: `src/app/page.tsx`
  - Docs landing: `src/app/docs/page.tsx`
  - Benchmarks: `src/app/benchmarks/page.tsx`
  - Architecture: `src/app/architecture/page.tsx`
  - Examples: `src/app/examples/page.tsx`
- **MDX docs**: Add MDX pages under `src/app/docs/` (example: `src/app/docs/get-started/page.mdx`).
- **Design system**: Reusable components live in `src/components/`.
- **Theme**: CSS variables and global styles are in `src/app/globals.css`.

## Build

```bash
npm run build
```
