#!/usr/bin/env bash
set -u
root="$PWD"
out="$root/docs/procedencia/implementaciones/contrato-nominal-r29-sol"
export PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$root/.cache/nominal-r29/uv" PYTHONPATH="$root/tools/procedencia" RUFF_CACHE_DIR="$root/.cache/nominal-r29/ruff"
bash tools/procedencia/run.sh .cache/nominal-r29/calidad-preparar.py
nix shell nixpkgs#ruff -c ruff check tools/procedencia/nominal.py tools/procedencia/enlaces.py tests/test_nominal_contrato.py > "$out/ruff-final.log" 2>&1
printf 'ruff %s\n' "$?" >> "$out/calidad-codigos.log"
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/nominal-r29/mypy tools/procedencia/nominal.py tools/procedencia/enlaces.py tests/test_nominal_contrato.py' > "$out/mypy-final.log" 2>&1
printf 'mypy %s\n' "$?" >> "$out/calidad-codigos.log"
cd "$root/.cache/nominal-r29/lint"
nix shell nixpkgs#bun nixpkgs#nodejs -c ./node_modules/.bin/oxlint --threads=1 --disable-nested-config scripts/procedencia/nominal-contrato.mjs scripts/procedencia/ambito-publicado.mjs tests/nominal-contrato.test.mjs docs/procedencia/implementaciones/contrato-nominal-r29-sol/recorrido.mjs > "$out/oxlint.log" 2>&1
printf 'oxlint %s\n' "$?" >> "$out/calidad-codigos.log"
nix shell nixpkgs#nodejs -c ./node_modules/.bin/eslint scripts/procedencia/nominal-contrato.mjs scripts/procedencia/ambito-publicado.mjs tests/nominal-contrato.test.mjs docs/procedencia/implementaciones/contrato-nominal-r29-sol/recorrido.mjs > "$out/eslint.log" 2>&1
printf 'eslint %s\n' "$?" >> "$out/calidad-codigos.log"
nix shell nixpkgs#nodejs -c ./node_modules/.bin/tsc --noEmit --allowJs --checkJs --skipLibCheck --target es2023 --module nodenext scripts/procedencia/nominal-contrato.mjs > "$out/tipos-js.log" 2>&1
printf 'tipos-js %s\n' "$?" >> "$out/calidad-codigos.log"
