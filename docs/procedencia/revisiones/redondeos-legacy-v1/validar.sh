#!/usr/bin/env bash
set -u
out=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/redondeos-legacy-v1
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
export NODE_OPTIONS=--max-old-space-size=1536
export OPENBLAS_NUM_THREADS=1
export OMP_NUM_THREADS=1
export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#gcc.cc.lib.outPath)/lib:$(nix eval --raw nixpkgs#zlib.outPath)/lib"
uv run --no-project --python "$(command -v python3)" --with numpy==2.5.4 python "$out/boundaries.py" > "$out/boundaries.json" 2> "$out/boundaries-python.log"
echo "python:$?"
bun "$out/check-boundaries.mjs" > "$out/boundaries-check.log" 2>&1
echo "fronteras:$?"
cd "$out/validacion" || exit 1
node_modules/.bin/vitest run tests/redondeos-legacy-oracle.test.ts tests/progresividad-caracterizacion-legacy.test.ts tests/dinero.test.ts tests/progresividad.test.ts --maxWorkers=1 > "$out/tests.log" 2>&1
echo "tests:$?"
node_modules/.bin/tsc --noEmit --incremental false > "$out/typecheck.log" 2>&1
echo "typecheck:$?"
node_modules/.bin/oxlint lib/dominio/compatibilidad-legacy tests/*.ts ../contrast.mjs ../check-boundaries.mjs > "$out/oxlint.log" 2>&1
echo "oxlint:$?"
node_modules/.bin/eslint lib/dominio/compatibilidad-legacy tests/*.ts ../contrast.mjs ../check-boundaries.mjs > "$out/eslint.log" 2>&1
echo "eslint:$?"
uv run --no-project --with ruff ruff check "$out/stream.py" "$out/boundaries.py" > "$out/ruff.log" 2>&1
echo "ruff:$?"
