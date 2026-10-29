#!/usr/bin/env bash
set -u
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r23-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r23-sol/uv-cache"
export MYPYPATH="$PWD/tools/procedencia:$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
out="$PWD/docs/procedencia/revisiones/preservacion-r23-sol"
flock /tmp/irobopf-validacion-pesada.lock bash -c '
 out="$PWD/docs/procedencia/revisiones/preservacion-r23-sol"
 nix shell nixpkgs#ruff -c ruff format "$out" > "$out/formato.log" 2>&1
 nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff-final.log" 2>&1
 printf "ruff-final %s\n" "$?" >> "$out/calidad-final-codigos.log"
 nix develop path:tools/procedencia --command bash -c '\''uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema python -m mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-r23-sol/mypy docs/procedencia/revisiones/preservacion-r23-sol/*.py'\'' > "$out/mypy-final.log" 2>&1
 printf "mypy-final %s\n" "$?" >> "$out/calidad-final-codigos.log"
 bash tools/procedencia/run.sh "$out/fronteras.py" > "$out/fronteras-final.log" 2>&1
 printf "fronteras-final %s\n" "$?" >> "$out/calidad-final-codigos.log"
'
