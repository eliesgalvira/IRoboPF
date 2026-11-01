#!/usr/bin/env bash
# nix shell nixpkgs#python3 nixpkgs#bun nixpkgs#nodejs
set -euo pipefail
revision_dir="$PWD/docs/procedencia/revisiones/anual-salarial-completo"
revision_cache="$PWD/.cache/anual-salarial-revision"
export TMPDIR="$revision_cache/tmp"
export PYTHONPYCACHEPREFIX="$revision_cache/pycache"
export UV_CACHE_DIR="$revision_cache/uv-cache"
export UV_PROJECT_ENVIRONMENT="$revision_cache/uv-environment"
revision_deps="${REVISION_DEPS:-/home/local/Repos/IRoboPF/node_modules}"
python3 "$revision_dir/preparar.py"
python3 "$revision_dir/contraste.py"
flock /tmp/irobopf-validacion-pesada.lock bun --no-install "$revision_cache/stage/run.mjs" > "$revision_cache/resultados.json"
flock /tmp/irobopf-validacion-pesada.lock node "$revision_deps/vitest/vitest.mjs" run --config "$revision_cache/vitest.config.mjs" --configLoader native --maxWorkers=1
flock /tmp/irobopf-validacion-pesada.lock node "$revision_deps/typescript/bin/tsc" --noEmit -p "$revision_cache/tipos-originales-final.json"
flock /tmp/irobopf-validacion-pesada.lock "$revision_deps/.bin/oxlint" --disable-nested-config -c "$revision_cache/oxlint-final.json" "$revision_dir/ejecutar.mjs" tests/anual-salarial-completo.test.ts
