#!/usr/bin/env bash
# Fixtures públicos de unidades, enlaces e IPC/SS; una suite a la vez.
set -euo pipefail
cd "$(dirname "$0")/.."
export UV_CACHE_DIR="$HOME/.cache/uv"
export DATOS_RUNTIME_ROOT="$PWD"
export NODE_PATH="$PWD/node_modules"
export PYTHONDONTWRITEBYTECODE=1
export BUN_RUNTIME_TRANSPILER_CACHE_PATH=0

python_test() {
  timeout -k 30s 10m uv run --no-project --python python3 --no-managed-python \
    --with pymupdf==1.26.7 --with jsonschema==4.25.1 python "$@"
}

python_test -m unittest discover -s tools/procedencia/datos/tests -p 'test_*.py' -v
python_test docs/procedencia/datos-2012-2026/revision-unidades-enlaces/casos.py -v
python_test -m unittest discover -s tools/procedencia/datos/lotes/ipc-ss -p 'test_*.py' -v
python_test docs/procedencia/datos-2012-2026/revisiones/ipc-ss-enlaces/test_discriminantes.py -v
python_test tests/datos-ipc-ss.test.py -v
timeout -k 30s 2m bun docs/procedencia/datos-2012-2026/revisiones/ipc-ss-enlaces/verificar_motor.mjs
