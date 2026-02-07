# PomaiDB Web

Official marketing + documentation site for PomaiDB, the local-first embedded vector database.

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## WASM build + demo

```bash
git submodule update --init --recursive
./scripts/build_wasm.sh
./scripts/dev.sh
```

Open [http://localhost:3000/wasm](http://localhost:3000/wasm) to use the in-browser PomaiDB WASM demo.

## Headless WASM test

```bash
./scripts/test_wasm_node.sh
```

## All checks

```bash
./scripts/test_all.sh
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
