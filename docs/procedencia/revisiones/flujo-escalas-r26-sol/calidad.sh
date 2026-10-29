#!/usr/bin/env bash
set -uo pipefail
out="$PWD/docs/procedencia/revisiones/flujo-escalas-r26-sol"
cache="$PWD/.cache/flujo-escalas-r26-sol"
run() {
 local label="$1"
 shift
 "$@" > "$out/$label.log" 2>&1
 local code=$?
 printf '%s %s\n' "$label" "$code" >> "$out/codigos.log"
}
run lint nix shell nixpkgs#bun nixpkgs#nodejs --command /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config -c "$cache/oxlint.json" "$out/casos.mjs"
run tipos-js nix shell nixpkgs#nodejs --command node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p "$cache/tsconfig.json"
run ruff nix shell nixpkgs#ruff --command ruff check "$out" --output-format concise
run tipos-python nix shell nixpkgs#mypy --command mypy --ignore-missing-imports --cache-dir "$cache/mypy" "$out"
