#!/usr/bin/env bash
set -eu
out=docs/procedencia/editorial/flujo-retenciones-ss-r23-sol
node "$out/construir.mjs" > "$out/construccion.log" 2>&1
node "$out/casos.mjs" > "$out/casos.log" 2>&1
/home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config "$out/oxlint.json" "$out" > "$out/lint.log" 2>&1
node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p "$out/tsconfig.json" > "$out/tipos.log" 2>&1
node "$out/verificar.mjs" > "$out/verificar.log" 2>&1
node --max-old-space-size=768 "$out/inventario.mjs" > "$out/inventario.log" 2>&1
node "$out/clasificar-retencion.mjs" > "$out/terminales.log" 2>&1
node "$out/trazar.mjs" > "$out/caminos.log" 2>&1
