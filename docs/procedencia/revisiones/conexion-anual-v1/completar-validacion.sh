#!/usr/bin/env bash
out=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1
src=/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4
cd "$out/checkout-validacion" || exit 1
for f in docs/procedencia/auditorias/actividades-economicas-2025/especificacion-implementacion.json docs/procedencia/correcciones/integracion-ronda10/caracterizacion-python.json docs/procedencia/implementaciones/redondeos-legacy/excel.json docs/procedencia/implementaciones/redondeos-legacy/python-oracle.json docs/procedencia/implementaciones/redondeos-legacy/excel-ampliado.json; do
 mkdir -p "$(dirname "$f")"
 cp "$src/$f" "$f"
done
bun run lint > "$out/lint-final.log" 2>&1
echo lint:$?
bun run typecheck > "$out/typecheck-final.log" 2>&1
echo tipos:$?
cp "$out/sondeos.mjs" scripts/revision-conexion-sondeos.mjs
cp "$out/precision.mjs" scripts/revision-conexion-precision.mjs
bun node_modules/oxlint/bin/oxlint scripts/revision-conexion-sondeos.mjs scripts/revision-conexion-precision.mjs > "$out/lint-instrumentos-final.log" 2>&1
echo oxlintInstrumentos:$?
bun node_modules/eslint/bin/eslint.js scripts/revision-conexion-sondeos.mjs scripts/revision-conexion-precision.mjs >> "$out/lint-instrumentos-final.log" 2>&1
echo eslintInstrumentos:$?
