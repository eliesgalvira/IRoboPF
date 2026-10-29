#!/usr/bin/env bash
set -u
root="$PWD"
out="$root/docs/procedencia/implementaciones/madrid-v2-r25-sol"
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$root/.cache/madrid-v2-r25-sol/venv"
export NODE_PATH=/home/elies/Repos/IRoboPF/node_modules
nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff.log" 2>&1
printf 'ruff %s\n' "$?" >> "$out/codigos.log"
MYPYPATH="$root/tools/procedencia" nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/madrid-v2-r25-sol/mypy docs/procedencia/implementaciones/madrid-v2-r25-sol/*.py' > "$out/mypy.log" 2>&1
printf 'mypy %s\n' "$?" >> "$out/codigos.log"
nix shell nixpkgs#bun nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config docs/procedencia/implementaciones/madrid-v2-r25-sol/coordinador.mjs > "$out/oxlint.log" 2>&1
printf 'oxlint %s\n' "$?" >> "$out/codigos.log"
nix shell nixpkgs#bun nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/eslint docs/procedencia/implementaciones/madrid-v2-r25-sol/coordinador.mjs > "$out/eslint.log" 2>&1
printf 'eslint %s\n' "$?" >> "$out/codigos.log"
