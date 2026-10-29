#!/usr/bin/env bash
set -u
out=docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol
/home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config "$out/oxlint.json" "$out" > "$out/lint.log" 2>&1
printf 'lint=%s\n' "$?"
node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p "$out/tsconfig.json" > "$out/tipos.log" 2>&1
printf 'tipos=%s\n' "$?"
