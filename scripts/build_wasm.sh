#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${ROOT_DIR}/build/wasm"
OUT_DIR="${ROOT_DIR}/public/wasm"

mkdir -p "${BUILD_DIR}" "${OUT_DIR}"

emcmake cmake -S "${ROOT_DIR}/wasm" -B "${BUILD_DIR}" -DCMAKE_BUILD_TYPE=Release
emmake cmake --build "${BUILD_DIR}" -j

cp "${BUILD_DIR}/pomaidb_wasm.js" "${OUT_DIR}/pomaidb_wasm.js"
cp "${BUILD_DIR}/pomaidb_wasm.wasm" "${OUT_DIR}/pomaidb_wasm.wasm"

echo "WASM artifacts copied to ${OUT_DIR}"
