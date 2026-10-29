#!/usr/bin/env bash
set -euo pipefail
cd /home/elies/.t3/worktrees/IRoboPF/t3-c26a76c1
review_out=/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v2
review_scratch=$PWD/.cache/conexion-anual-v2
mkdir -p "$review_scratch"
for instrument in preparar.py sondeos.mjs ampliar.py ampliados.mjs controles.mjs componentes.py verificar.py; do
  cp "$review_out/$instrument" "$review_scratch/$instrument"
done
export TMPDIR="$review_scratch"
export UV_PROJECT_ENVIRONMENT="$review_scratch/uv-environment"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash -c '
python3 .cache/conexion-anual-v2/preparar.py
bun --no-install .cache/conexion-anual-v2/sondeos.mjs
python3 .cache/conexion-anual-v2/ampliar.py
bun --no-install .cache/conexion-anual-v2/ampliados.mjs
bun --no-install .cache/conexion-anual-v2/controles.mjs
python3 .cache/conexion-anual-v2/componentes.py
python3 .cache/conexion-anual-v2/verificar.py
bun run test tests/conexion-anual.test.ts tests/liquidacion-irpf-anual.test.ts --maxWorkers=1
bun run typecheck
bun run lint
bun run test:lint
# Dos rojos en la base fijada, no se deben ocultar:
bun run test tests/rastro-anual-procedencia.test.ts --maxWorkers=1
'
