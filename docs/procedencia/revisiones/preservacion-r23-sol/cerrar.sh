#!/usr/bin/env bash
set -u
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r23-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r23-sol/uv-cache"
flock /tmp/irobopf-validacion-pesada.lock bash -c '
 out="$PWD/docs/procedencia/revisiones/preservacion-r23-sol"
 bash tools/procedencia/run.sh "$out/auxiliar.py" > "$out/pins-final.log" 2>&1
 nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c '\''cd .cache/preservacion-r23-sol/lint && /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config historicos.mjs'\'' > "$out/oxlint-final.log" 2>&1
 printf "oxlint-final %s\n" "$?" >> "$out/fin-codigos.log"
 bash tools/procedencia/run.sh "$out/fronteras.py" > "$out/fronteras-fin.log" 2>&1
 printf "fronteras-fin %s\n" "$?" >> "$out/fin-codigos.log"
'
