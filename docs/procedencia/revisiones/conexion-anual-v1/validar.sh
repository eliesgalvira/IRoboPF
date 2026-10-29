#!/usr/bin/env bash
set +e
out=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1
cd "$out/checkout-validacion" || exit 1
bun run test tests/conexion-anual.test.ts --maxWorkers=1 > "$out/tests-autor.log" 2>&1
echo tests:$?
bun run lint > "$out/lint.log" 2>&1
echo lint:$?
bun run typecheck > "$out/typecheck.log" 2>&1
echo tipos:$?
bun run test:lint > "$out/anti-slop.log" 2>&1
echo reglas:$?
