#!/usr/bin/env bash
set -u
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r23-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r23-sol/uv-cache"
out="$PWD/docs/procedencia/revisiones/preservacion-r23-sol"
for version in anterior actual; do
 flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/revisar.py" "$version" > "$out/$version.log" 2>&1
 printf '%s %s\n' "$version" "$?" >> "$out/codigos.log"
done
