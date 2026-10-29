#!/usr/bin/env bash
set -u
out=docs/procedencia/revisiones/tecnica-r23-sol
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/tecnica-r23-sol/venv"
nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff-final.log" 2>&1
printf 'ruff-final %s\n' "$?" >> "$out/codigos.log"
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/tecnica-r23-sol/mypy docs/procedencia/revisiones/tecnica-r23-sol/*.py' > "$out/mypy-final.log" 2>&1
printf 'mypy-final %s\n' "$?" >> "$out/codigos.log"
bash tools/procedencia/run.sh "$out/modos.py" > "$out/modos.log" 2>&1
printf 'modos %s\n' "$?" >> "$out/codigos.log"
