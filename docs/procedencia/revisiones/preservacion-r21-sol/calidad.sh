#!/usr/bin/env bash
set -u
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r21-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r21-sol/uv-cache"
export PYTHONDONTWRITEBYTECODE=1
export MYPYPATH="$PWD/docs/procedencia/revisiones/preservacion-v3-sol"
out="$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/recolector.py docs/procedencia/correcciones/preservacion-r21/adversos.py docs/procedencia/correcciones/editorial-r21/evidencias.py "$out" > "$out/ruff.log" 2>&1
printf 'ruff %s\n' "$?" >> "$out/codigos-calidad.log"
flock /tmp/irobopf-validacion-pesada.lock nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-r21-sol/mypy tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/recolector.py docs/procedencia/correcciones/preservacion-r21/adversos.py docs/procedencia/correcciones/editorial-r21/evidencias.py' > "$out/mypy-cinco.log" 2>&1
printf 'mypy-cinco %s\n' "$?" >> "$out/codigos-calidad.log"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config > "$out/oxlint.log" 2>&1
printf 'oxlint %s\n' "$?" >> "$out/codigos-calidad.log"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py > "$out/regresiones.log" 2>&1
printf 'regresiones %s\n' "$?" >> "$out/codigos-calidad.log"
