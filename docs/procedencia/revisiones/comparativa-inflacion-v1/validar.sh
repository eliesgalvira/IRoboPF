#!/usr/bin/env bash
set +e
out=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/comparativa-inflacion-v1
node_modules/.bin/vitest run tests/comparativa-inflacion-tabular.test.ts tests/progresividad-caracterizacion-legacy.test.ts tests/dinero.test.ts tests/aritmetica-tabular.test.ts --maxWorkers=1 > "$out/tests.log" 2>&1
printf 'tests %s\n' "$?"
node_modules/.bin/tsc --noEmit --incremental false > "$out/typecheck.log" 2>&1
printf 'typecheck %s\n' "$?"
node_modules/.bin/tsc --noEmit -p tools/oxlint/tsconfig.json > "$out/typecheck-vendor.log" 2>&1
printf 'typecheck-vendor %s\n' "$?"
node_modules/.bin/oxlint --disable-nested-config lib/dominio/compatibilidad-legacy/comparativa-tabular.ts lib/dominio/compatibilidad-legacy/progresividad-frio.ts lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts tests/comparativa-inflacion-tabular.test.ts "$out/contrastar.mjs" > "$out/oxlint.log" 2>&1
printf 'oxlint %s\n' "$?"
node_modules/.bin/eslint lib/dominio/compatibilidad-legacy/comparativa-tabular.ts lib/dominio/compatibilidad-legacy/progresividad-frio.ts lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts tests/comparativa-inflacion-tabular.test.ts > "$out/eslint.log" 2>&1
printf 'eslint %s\n' "$?"
bun scripts/test-lint.mjs > "$out/anti-slop.log" 2>&1
printf 'anti-slop %s\n' "$?"
