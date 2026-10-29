#!/usr/bin/env bash
set -euo pipefail
out="$PWD/docs/procedencia/revisiones/registro-exacto-r25-sol"
tree="$PWD/.cache/registro-exacto-r25-sol/ensayo"
mkdir -p "$tree/review" "$tree/tools/oxlint"
cp "$PWD/.oxlintrc.json" "$tree/.oxlintrc.json"
cp "$PWD/eslint.config.mjs" "$tree/eslint.config.mjs"
if [ ! -d "$tree/tools/oxlint/anti-slop" ]; then
  cp -r "$PWD/tools/oxlint/anti-slop" "$tree/tools/oxlint/anti-slop"
fi
cp "$out"/*.mjs "$tree/review/"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c 'cd "$1" && bun /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config -c .oxlintrc.json review && bun /home/elies/Repos/IRoboPF/node_modules/eslint/bin/eslint.js review' lint "$tree"
