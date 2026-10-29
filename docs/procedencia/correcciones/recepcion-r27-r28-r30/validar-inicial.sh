#!/usr/bin/env bash
set -euo pipefail
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r30/uv
export RUFF_CACHE_DIR=/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r30/ruff
out=/home/elies/Repos/IRoboPF/docs/procedencia/correcciones/recepcion-r27-r28-r30
bun run typecheck > "$out/typecheck-nominal.log" 2>&1
bun run lint > "$out/lint-nominal.log" 2>&1
python .cache/orquestador-recepcion/r30/preparar-nominal.py > "$out/nominal-preparacion.log" 2>&1
bash tools/procedencia/run.sh tests/test_nominal_contrato.py > "$out/nominal-python.log" 2>&1
node --test --test-concurrency=1 tests/nominal-contrato.test.mjs > "$out/nominal-node.log" 2>&1
node docs/procedencia/implementaciones/contrato-nominal-r29-sol/recorrido.mjs > "$out/nominal-coordinador.log" 2>&1
bun "$out/regenerar.mjs" > "$out/regeneracion.log" 2>&1
bun x vitest run tests/evidencia-multiplicidad.test.ts tests/publicacion-evidencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/rastro-anual-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts tests/flujo-procedencia.test.ts --maxWorkers=1 > "$out/pruebas.log" 2>&1
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1 > "$out/contenido.log" 2>&1
printf 'Validación integrada completada\n'
