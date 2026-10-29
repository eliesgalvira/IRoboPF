#!/usr/bin/env bash
set -u
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-r21-sol/uv"
export UV_CACHE_DIR="$PWD/.cache/preservacion-r21-sol/uv-cache"
export PYTHONDONTWRITEBYTECODE=1
export MYPYPATH="$PWD/docs/procedencia/revisiones/preservacion-v3-sol"
out="$PWD/docs/procedencia/revisiones/preservacion-r21-sol"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff-final.log" 2>&1
printf 'ruff-final %s\n' "$?" >> "$out/codigos-finales.log"
flock /tmp/irobopf-validacion-pesada.lock nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-untyped-imports --follow-imports=silent --check-untyped-defs --cache-dir .cache/preservacion-r21-sol/mypy docs/procedencia/revisiones/preservacion-r21-sol/*.py' > "$out/mypy-propio.log" 2>&1
printf 'mypy-propio %s\n' "$?" >> "$out/codigos-finales.log"
