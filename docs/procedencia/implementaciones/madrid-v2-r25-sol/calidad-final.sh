#!/usr/bin/env bash
set -u
root="$PWD"
out="$root/docs/procedencia/implementaciones/madrid-v2-r25-sol"
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$root/.cache/madrid-v2-r25-sol/venv"
bash tools/procedencia/run.sh "$out/tipar-y-lint.py" > "$out/lint-preparar.log" 2>&1
nix shell nixpkgs#ruff -c ruff check "$out" > "$out/ruff-final.log" 2>&1
printf 'ruff-final %s\n' "$?" >> "$out/codigos.log"
MYPYPATH="$out/stubs:$root/tools/procedencia" nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/madrid-v2-r25-sol/mypy docs/procedencia/implementaciones/madrid-v2-r25-sol/*.py' > "$out/mypy-final.log" 2>&1
printf 'mypy-final %s\n' "$?" >> "$out/codigos.log"
cd "$root/.cache/madrid-v2-r25-sol/lint"
nix shell nixpkgs#bun nixpkgs#nodejs -c ./node_modules/.bin/oxlint --threads=1 --disable-nested-config docs/procedencia/implementaciones/madrid-v2-r25-sol/coordinador.mjs > "$out/oxlint-final.log" 2>&1
printf 'oxlint-final %s\n' "$?" >> "$out/codigos.log"
nix shell nixpkgs#bun nixpkgs#nodejs -c ./node_modules/.bin/eslint docs/procedencia/implementaciones/madrid-v2-r25-sol/coordinador.mjs > "$out/eslint-final.log" 2>&1
printf 'eslint-final %s\n' "$?" >> "$out/codigos.log"
