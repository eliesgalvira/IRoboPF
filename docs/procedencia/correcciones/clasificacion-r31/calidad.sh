#!/usr/bin/env bash
set -euo pipefail
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r30/uv
export RUFF_CACHE_DIR=/home/elies/Repos/IRoboPF/.cache/orquestador-recepcion/r31/ruff
out=/home/elies/Repos/IRoboPF/docs/procedencia/correcciones/clasificacion-r31
ruff format docs/procedencia/preservacion-v5-sol/recolector.py tests/test_censo_origen.py "$out/reproducir.py" > "$out/formato.log" 2>&1
ruff check docs/procedencia/preservacion-v5-sol/recolector.py tests/test_censo_origen.py tests/test_censo_clasificacion.py "$out/reproducir.py" > "$out/ruff.log" 2>&1
bash tools/procedencia/run.sh tests/test_censo_clasificacion.py > "$out/regresiones-r30.log" 2>&1
bash tools/procedencia/run.sh docs/procedencia/preservacion-v5-sol/pruebas.py > "$out/regresiones-preservacion.log" 2>&1
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/orquestador-recepcion/r31/mypy docs/procedencia/preservacion-v5-sol/recolector.py tests/test_censo_origen.py tests/test_censo_clasificacion.py docs/procedencia/correcciones/clasificacion-r31/reproducir.py' > "$out/mypy.log" 2>&1
printf 'Calidad y regresiones correctas\n'
