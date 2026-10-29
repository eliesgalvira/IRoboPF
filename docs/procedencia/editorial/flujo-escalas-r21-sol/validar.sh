#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r21-sol/uv"
export PYTHONDONTWRITEBYTECODE=1
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
out="$PWD/docs/procedencia/editorial/flujo-escalas-r21-sol"
run() {
  local label="$1"
  shift
  "$@" > "$out/$label.log" 2>&1
  local code=$?
  printf '%s %s\n' "$label" "$code" >> "$out/codigos.log"
  return "$code"
}
run preparar-lint nix shell nixpkgs#nodejs -c node "$out/preparar-lint.mjs"
run esquema bash tools/procedencia/run.sh "$out/esquema.py"
run verificar bash tools/procedencia/run.sh "$out/verificar.py"
run semantica bash tools/procedencia/run.sh "$out/semantica.py"
run ruff nix shell nixpkgs#ruff -c ruff check "$out" --output-format concise
run tipos-python nix shell nixpkgs#mypy -c mypy --ignore-missing-imports --cache-dir "$PWD/.cache/flujo-escalas-r21-sol/mypy" "$out"
run anti-slop nix shell nixpkgs#bun nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config -c "$PWD/.cache/flujo-escalas-r21-sol/oxlint.json" "$out/extraer.mjs" "$out/casos.mjs" "$out/preparar-lint.mjs"
