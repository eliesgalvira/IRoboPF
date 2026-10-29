#!/usr/bin/env bash
set -u
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r21-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r21-sol/uv-cache"
export PYTHONDONTWRITEBYTECODE=1
out="$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/rojos_test.py" > "$out/rojos.log" 2>&1
printf 'rojos %s\n' "$?" >> "$out/codigos-adicionales.log"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/revisar.py" routes > "$out/rutas.log" 2>&1
printf 'rutas %s\n' "$?" >> "$out/codigos-adicionales.log"
