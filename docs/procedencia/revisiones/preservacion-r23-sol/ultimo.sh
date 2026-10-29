#!/usr/bin/env bash
set -u
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r23-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r23-sol/uv-cache"
export MYPYPATH="$PWD/tools/procedencia:$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
flock /tmp/irobopf-validacion-pesada.lock bash -c '
 out="$PWD/docs/procedencia/revisiones/preservacion-r23-sol"
 nix shell nixpkgs#ruff -c ruff check tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/recolector.py docs/procedencia/correcciones/tecnica-r23/preservacion-*.py "$out" > "$out/ruff-ultimo.log" 2>&1
 printf "ruff %s\n" "$?" >> "$out/ultimo-codigos.log"
 nix develop path:tools/procedencia --command bash -c '\''uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema python -m mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-r23-sol/mypy tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/recolector.py docs/procedencia/correcciones/tecnica-r23/preservacion-*.py docs/procedencia/revisiones/preservacion-r23-sol/*.py'\'' > "$out/mypy-ultimo.log" 2>&1
 printf "mypy %s\n" "$?" >> "$out/ultimo-codigos.log"
 bash tools/procedencia/run.sh "$out/auxiliar.py" > "$out/auxiliar-ultimo.log" 2>&1
 nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c '\''cd .cache/preservacion-r23-sol/lint && /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config historicos.mjs'\'' > "$out/oxlint-ultimo.log" 2>&1
 printf "oxlint %s\n" "$?" >> "$out/ultimo-codigos.log"
 nix shell nixpkgs#bun nixpkgs#nodejs -c bun --no-install "$out/historicos.mjs" > "$out/historicos-ultimo.log" 2>&1
 printf "historicos %s\n" "$?" >> "$out/ultimo-codigos.log"
'
