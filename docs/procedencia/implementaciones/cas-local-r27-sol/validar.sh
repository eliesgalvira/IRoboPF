#!/usr/bin/env bash
# Ejecutar desde la raíz de una copia local nueva con dependencias disponibles.
set -euo pipefail
if [[ ${IRPF_CAS_LOCK_ADQUIRIDO:-0} != 1 ]]; then
  exec flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun nixpkgs#python3 -c env IRPF_CAS_LOCK_ADQUIRIDO=1 bash "$0"
fi
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/cas-local-r27-sol/venv"
node_modules/.bin/tsc --noEmit --incremental false
node_modules/.bin/oxlint --threads=1 --disable-nested-config lib/procedencia/{io.mjs,almacen.ts,modelo.ts,http.ts} scripts/procedencia/{contenido-publicar.mjs,contenido-verificar.mjs,evidencia-contenido.mjs} 'app/procedencia/[snapshot]/[id]/[revision]/route.ts' tests/cas-local-r27.mjs docs/procedencia/implementaciones/cas-local-r27-sol/*.mjs
bun docs/procedencia/implementaciones/cas-local-r27-sol/preparar.mjs
bun docs/procedencia/implementaciones/cas-local-r27-sol/recorrido.mjs
bun docs/procedencia/implementaciones/cas-local-r27-sol/historicos.mjs
bun tests/cas-local-r27.mjs
node_modules/.bin/vitest run tests/evidencia-contenido-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts --maxWorkers=1
node_modules/.bin/vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
