#!/usr/bin/env bash
set -euo pipefail
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv
out=docs/procedencia/correcciones/multiplicidad-r27
bun run typecheck > "$out/typecheck-final.log" 2>&1
bun run lint > "$out/lint-final.log" 2>&1
ruff check "$out/preparar.py" > "$out/ruff.log" 2>&1
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/orquestador-recepcion/r27/mypy docs/procedencia/correcciones/multiplicidad-r27/preparar.py' > "$out/mypy.log" 2>&1
bun "$out/regenerar.mjs" > "$out/regeneracion.log" 2>&1
bun x vitest run tests/evidencia-multiplicidad.test.ts tests/publicacion-evidencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/rastro-anual-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts --maxWorkers=1 > "$out/regresiones.log" 2>&1
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1 > "$out/contenido.log" 2>&1
printf 'Calidad, regeneración y regresiones terminadas.\n'
