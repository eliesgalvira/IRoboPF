#!/usr/bin/env bash
set -u
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r23-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r23-sol/uv-cache"
export MYPYPATH="$PWD/tools/procedencia:$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
out="$PWD/docs/procedencia/revisiones/preservacion-r23-sol"
files=(tools/procedencia/preservacion.py tools/procedencia/preservacion_urls.py docs/procedencia/preservacion-v3/recolector.py docs/procedencia/correcciones/tecnica-r23/preservacion-controles.py docs/procedencia/correcciones/tecnica-r23/preservacion-politica.py)
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check "${files[@]}" "$out" > "$out/ruff.log" 2>&1
printf 'ruff %s\n' "$?" >> "$out/calidad-codigos.log"
flock /tmp/irobopf-validacion-pesada.lock nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema python -m mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-r23-sol/mypy "$@"' check "${files[@]}" "$out/revisar.py" "$out/arbol.py" > "$out/mypy.log" 2>&1
printf 'mypy %s\n' "$?" >> "$out/calidad-codigos.log"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py > "$out/regresiones.log" 2>&1
printf 'regresiones %s\n' "$?" >> "$out/calidad-codigos.log"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/auxiliar.py" > "$out/lint-preparacion.log" 2>&1
printf 'lint-preparacion %s\n' "$?" >> "$out/calidad-codigos.log"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c 'cd .cache/preservacion-r23-sol/lint && /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config historicos.mjs' > "$out/oxlint.log" 2>&1
printf 'oxlint %s\n' "$?" >> "$out/calidad-codigos.log"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun "$out/historicos.mjs" > "$out/historicos.log" 2>&1
printf 'historicos %s\n' "$?" >> "$out/calidad-codigos.log"
