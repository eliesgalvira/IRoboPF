#!/usr/bin/env bash
set -euo pipefail
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv
out=docs/procedencia/correcciones/multiplicidad-r27
logs="$out/cierre"
mkdir -p "$logs"
bun run typecheck > "$logs/typecheck-final.log" 2>&1
bun run lint > "$logs/lint-final.log" 2>&1
ruff check "$out/preparar.py" > "$logs/ruff.log" 2>&1
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/orquestador-recepcion/r27/mypy docs/procedencia/correcciones/multiplicidad-r27/preparar.py' > "$logs/mypy.log" 2>&1
bun "$out/regenerar.mjs" > "$logs/regeneracion.log" 2>&1
bun x vitest run tests/evidencia-multiplicidad.test.ts tests/publicacion-evidencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/rastro-anual-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts --maxWorkers=1 > "$logs/regresiones.log" 2>&1
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1 > "$logs/contenido.log" 2>&1
printf 'Calidad, regeneración y regresiones terminadas.\n'
