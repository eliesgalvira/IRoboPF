#!/usr/bin/env bash
set -u
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r21-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r21-sol/uv-cache"
export PYTHONDONTWRITEBYTECODE=1
out="$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
for action in inherited mutations fsync real; do
 flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/revisar.py" "$action" > "$out/$action.log" 2>&1
 printf '%s %s\n' "$action" "$?" >> "$out/codigos.log"
done
