#!/usr/bin/env bash
set -u
out=docs/procedencia/editorial/flujo-rentas-r21-sol
node "$out/construir.mjs" > "$out/construccion.log" 2>&1
build_status=$?
node "$out/terminales.mjs" > "$out/terminales.log" 2>&1
terminal_status=$?
node "$out/verificar.mjs" > "$out/verificacion.log" 2>&1
verify_status=$?
/home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config "$out/oxlint.json" "$out" > "$out/lint-final.log" 2>&1
lint_status=$?
node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p "$out/tsconfig.json" > "$out/tipos.log" 2>&1
types_status=$?
printf 'build=%s terminal=%s verify=%s lint=%s types=%s\n' "$build_status" "$terminal_status" "$verify_status" "$lint_status" "$types_status" > "$out/calidad.log"
if [ "$build_status" -ne 0 ] || [ "$terminal_status" -ne 0 ] || [ "$verify_status" -ne 0 ] || [ "$lint_status" -ne 0 ] || [ "$types_status" -ne 0 ]; then exit 1; fi
