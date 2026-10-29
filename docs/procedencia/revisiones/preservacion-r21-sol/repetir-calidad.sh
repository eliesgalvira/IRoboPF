#!/usr/bin/env bash
set -u
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r21-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r21-sol/uv-cache"
export PYTHONDONTWRITEBYTECODE=1
export MYPYPATH="$PWD/docs/procedencia/revisiones/preservacion-v3-sol:$PWD/docs/procedencia/correcciones/preservacion-r21"
out="$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
flock /tmp/irobopf-validacion-pesada.lock bash -c '
 out="$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
 nix shell nixpkgs#python3 -c python3 "$out/lint_runtime.py" > "$out/lint-preparacion.log" 2>&1
 nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c '\''cd .cache/preservacion-r21-sol/lint-runtime1 && /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config smoke.ts'\'' > "$out/oxlint-runtime.log" 2>&1
 printf "oxlint-runtime %s\n" "$?" >> "$out/codigos-repeticion.log"
 nix develop path:tools/procedencia --command bash -c '\''uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-r21-sol/mypy docs/procedencia/revisiones/preservacion-r21-sol/*.py'\'' > "$out/mypy-propio-final.log" 2>&1
 printf "mypy-propio-final %s\n" "$?" >> "$out/codigos-repeticion.log"
 nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff-cierre.log" 2>&1
 printf "ruff-cierre %s\n" "$?" >> "$out/codigos-repeticion.log"
 bash tools/procedencia/run.sh "$out/revisar.py" inherited > "$out/diez-repeticion.log" 2>&1
 printf "diez-repeticion %s\n" "$?" >> "$out/codigos-repeticion.log"
 bash tools/procedencia/run.sh "$out/complementos.py" > "$out/complementos-final.log" 2>&1
 printf "complementos-final %s\n" "$?" >> "$out/codigos-repeticion.log"
'
