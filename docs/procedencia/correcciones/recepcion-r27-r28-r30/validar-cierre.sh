#!/usr/bin/env bash
set -euo pipefail
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r30/uv
out=/home/elies/Repos/IRoboPF/docs/procedencia/correcciones/recepcion-r27-r28-r30
bun test tests/nominal-software-explicacion.test.mjs > "$out/nominal-software-verde.log" 2>&1
bun x vitest run tests/flujo-procedencia.test.ts --maxWorkers=1 > "$out/flujo-repeticion.log" 2>&1
bun run typecheck > "$out/typecheck-final.log" 2>&1
bun run lint > "$out/lint-final.log" 2>&1
bash tools/procedencia/run.sh .cache/orquestador-recepcion/r30/caso-real-clasificacion.py > docs/procedencia/correcciones/preservacion-r30/caso-real.json 2>&1
bun "$out/regenerar-final.mjs" > "$out/regeneracion-final.log" 2>&1
bun x vitest run tests/rastro-anual-procedencia.test.ts tests/publicacion-evidencia.test.ts --maxWorkers=1 > "$out/regresiones-software.log" 2>&1
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1 > "$out/contenido.log" 2>&1
printf 'Cierre de validación completado\n'
