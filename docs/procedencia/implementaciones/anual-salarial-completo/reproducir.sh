#!/usr/bin/env bash
# Desde la raíz del checkout, dentro de:
# nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 nixpkgs#poppler-utils
set -euo pipefail
trabajo_root="$PWD"
entrega="$trabajo_root/docs/procedencia/implementaciones/anual-salarial-completo"
scratch="$trabajo_root/.cache/anual-salarial-completo"
mkdir -p "$scratch/tmp"
export TMPDIR="$scratch/tmp"
export PYTHONPYCACHEPREFIX="$scratch/pycache"
export UV_CACHE_DIR="$scratch/uv-cache"
export UV_PROJECT_ENVIRONMENT="$scratch/uv-environment"
# Dependencias ya instaladas; no instalar ni escribir en node_modules compartido.
python3 "$entrega/expectativas.py"
flock /tmp/irobopf-validacion-pesada.lock python3 "$entrega/fuentes.py"
bun --no-install "$entrega/ejecutar.ts" > "$scratch/resultados-reproducidos.json"
cmp "$entrega/resultados.json" "$scratch/resultados-reproducidos.json"
python3 - <<'PY'
import pathlib,json
r=pathlib.Path.cwd(); s=r/'.cache/anual-salarial-completo'
(s/'tsconfig.json').write_text(json.dumps({'extends':str(r/'tsconfig.json'),'compilerOptions':{'incremental':False},'include':[str(r/'tests/anual-salarial-completo.test.ts'),str(r/'docs/procedencia/implementaciones/anual-salarial-completo/ejecutar.ts')]}))
PY
flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/tsc --noEmit -p "$scratch/tsconfig.json"
flock /tmp/irobopf-validacion-pesada.lock bun run test tests/anual-salarial-completo.test.ts tests/conexion-anual.test.ts tests/trabajo-anual-contratos.test.ts tests/rastro-anual-procedencia.test.ts --maxWorkers=1
flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/oxlint --disable-nested-config tests/anual-salarial-completo.test.ts "$entrega/ejecutar.ts"
flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/eslint tests/anual-salarial-completo.test.ts "$entrega/ejecutar.ts"
flock /tmp/irobopf-validacion-pesada.lock bun run test:lint
