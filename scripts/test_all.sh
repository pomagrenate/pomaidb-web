#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"${ROOT_DIR}/scripts/build_wasm.sh"
"${ROOT_DIR}/scripts/test_wasm_node.sh"

if command -v npm >/dev/null 2>&1; then
  (cd "${ROOT_DIR}" && npm run build)
fi

if command -v npm >/dev/null 2>&1; then
  (cd "${ROOT_DIR}" && npm run lint)
fi
