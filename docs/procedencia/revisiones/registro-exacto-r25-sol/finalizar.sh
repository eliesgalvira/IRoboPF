#!/usr/bin/env bash
set -u
out="$PWD/docs/procedencia/revisiones/registro-exacto-r25-sol"
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/registro-exacto-r25-sol/venv"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/preparar.py" > "$out/preparacion-final.log" 2>&1
printf 'preparacion-final %s\n' "$?" >> "$out/codigos-final.log"
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh "$out/arbol.py" final > "$out/arbol-final.log" 2>&1
printf 'arbol-final %s\n' "$?" >> "$out/codigos-final.log"
