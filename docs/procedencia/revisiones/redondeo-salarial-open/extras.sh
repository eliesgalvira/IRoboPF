set -e
ROOT=/home/local/.ws/worktrees/IRoboPF/t3-5faaec37
OUT=$ROOT/docs/procedencia/revisiones/redondeo-salarial-open
cd "$ROOT/.cache/revision-redondeo-sol/stage"
cp ../conexion-anterior.ts lib/dominio/irpf/trabajo-anual/conexion.ts
bun actividad.ts "$OUT/actividad-anterior.json"
cp ../conexion-actual.ts lib/dominio/irpf/trabajo-anual/conexion.ts
bun actividad.ts "$OUT/actividad-actual.json"
cmp "$OUT/actividad-anterior.json" "$OUT/actividad-actual.json"
bun rutas.ts "$OUT/rutas.json"
