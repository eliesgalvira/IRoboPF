set -u
ROOT=/home/local/.ws/worktrees/IRoboPF/t3-5faaec37
OUT=$ROOT/docs/procedencia/revisiones/redondeo-salarial-open
cd "$ROOT/.cache/revision-redondeo-sol/stage"
cp lib/dominio/irpf/trabajo-anual/conexion.ts ../conexion-actual.ts
cp ../conexion-anterior.ts lib/dominio/irpf/trabajo-anual/conexion.ts
bun runner.ts "$OUT/anterior.json"
node node_modules/vitest/vitest.mjs run tests/redondeo-salarial-open.test.ts --maxWorkers=1 > "$OUT/rojo.log" 2>&1
printf 'rojo exit=%s\n' "$?"
cp ../conexion-actual.ts lib/dominio/irpf/trabajo-anual/conexion.ts
bun runner.ts "$OUT/actual.json"
node node_modules/vitest/vitest.mjs run tests/redondeo-salarial-open.test.ts tests/anual-salarial-completo.test.ts tests/conexion-anual.test.ts tests/trabajo-anual-contratos.test.ts tests/liquidacion-irpf-anual.test.ts tests/actividades-economicas-2025.test.ts tests/redondeos-legacy-oracle.test.ts tests/dinero.test.ts tests/rastro-anual-procedencia.test.ts --maxWorkers=1 > "$OUT/pruebas.log" 2>&1
printf 'tests exit=%s\n' "$?"
node node_modules/typescript/bin/tsc --noEmit --incremental false -p tsconfig.revision.json > "$OUT/tipos.log" 2>&1
printf 'tipos exit=%s\n' "$?"
node node_modules/typescript/bin/tsc --noEmit --incremental false -p tools/oxlint/tsconfig.json > "$OUT/tipos-vendor.log" 2>&1
printf 'vendor exit=%s\n' "$?"
node node_modules/oxlint/bin/oxlint --disable-nested-config lib/dominio/irpf/trabajo-anual/conexion.ts tests/redondeo-salarial-open.test.ts tests/anual-salarial-completo.test.ts tests/conexion-anual.test.ts > "$OUT/lint-oxlint.log" 2>&1
printf 'oxlint exit=%s\n' "$?"
node node_modules/eslint/bin/eslint.js lib/dominio/irpf/trabajo-anual/conexion.ts tests/redondeo-salarial-open.test.ts tests/anual-salarial-completo.test.ts tests/conexion-anual.test.ts > "$OUT/lint-eslint.log" 2>&1
printf 'eslint exit=%s\n' "$?"
bun scripts/test-lint.mjs > "$OUT/reglas.log" 2>&1
printf 'reglas exit=%s\n' "$?"
bun scripts/procedencia/rastro-verificar.mjs > "$OUT/rastro.log" 2>&1
printf 'rastro exit=%s\n' "$?"
bun -e 'import {verificar} from "./scripts/procedencia/contenido-verificar.mjs"; console.log(JSON.stringify(verificar("cb3eb7602899073ef92e6bfb1c392c7e8c519c969855a1eb7fcd8cf00cd454ad")))' > "$OUT/contenido.log" 2>&1
printf 'contenido exit=%s\n' "$?"
