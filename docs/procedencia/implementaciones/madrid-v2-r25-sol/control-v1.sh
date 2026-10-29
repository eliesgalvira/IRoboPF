#!/usr/bin/env bash
set -u
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/madrid-v2-r25-sol/venv" NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
out=docs/procedencia/implementaciones/madrid-v2-r25-sol
bash tools/procedencia/run.sh "$out/control-v1.py" --v1 > "$out/control-v1-preparar.log" 2>&1
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun "$out/coordinador.mjs" > "$out/coordinador-v1-control.log" 2>&1
printf 'coordinador-v1 %s\n' "$?" >> "$out/codigos.log"
bash tools/procedencia/run.sh "$out/control-v1.py" > "$out/control-v2-restaurar.log" 2>&1
