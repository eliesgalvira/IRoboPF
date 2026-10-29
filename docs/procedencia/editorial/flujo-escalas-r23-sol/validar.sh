#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r23-sol/venv"
export PYTHONDONTWRITEBYTECODE=1
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
out="$PWD/docs/procedencia/editorial/flujo-escalas-r23-sol"
run() {
 local label="$1"
 shift
 "$@" > "$out/$label.log" 2>&1
 local code=$?
 printf '%s %s\n' "$label" "$code" >> "$out/codigos.log"
 return "$code"
}
run extraer nix shell nixpkgs#nodejs --command node "$out/extraer.mjs"
run resolver nix shell nixpkgs#nodejs --command node "$out/resolver-datos.mjs"
run ocurrencias bash tools/procedencia/run.sh "$out/ocurrencias.py"
run generar bash tools/procedencia/run.sh "$out/generar.py"
run preparar-lint nix shell nixpkgs#nodejs --command node "$out/preparar-lint.mjs"
run casos-heredados nix shell nixpkgs#bun nixpkgs#nodejs --command bun --no-install --tsconfig-override "$PWD/.cache/flujo-escalas-r23-sol/runtime.tsconfig.json" "$out/casos-heredados.mjs"
run casos-selectores nix shell nixpkgs#bun nixpkgs#nodejs --command bun --no-install --tsconfig-override "$PWD/.cache/flujo-escalas-r23-sol/runtime.tsconfig.json" "$out/casos-selectores.mjs"
run anti-slop nix shell nixpkgs#bun nixpkgs#nodejs --command /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config -c "$PWD/.cache/flujo-escalas-r23-sol/oxlint.json" "$out/extraer.mjs" "$out/resolver-datos.mjs" "$out/casos-heredados.mjs" "$out/casos-selectores.mjs" "$out/preparar-lint.mjs"
run ruff nix shell nixpkgs#ruff --command ruff check "$out" --output-format concise
run tipos-python nix shell nixpkgs#mypy --command mypy --ignore-missing-imports --cache-dir "$PWD/.cache/flujo-escalas-r23-sol/mypy" "$out"
run verificar bash tools/procedencia/run.sh "$out/verificar.py"
run tipos-javascript nix shell nixpkgs#nodejs --command node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p "$out/tsconfig.json"
