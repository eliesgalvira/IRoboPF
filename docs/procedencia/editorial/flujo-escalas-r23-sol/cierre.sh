#!/usr/bin/env bash
set -euo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r23-sol/venv"
export PYTHONDONTWRITEBYTECODE=1
out="$PWD/docs/procedencia/editorial/flujo-escalas-r23-sol"
bash tools/procedencia/run.sh "$out/generar.py" > "$out/generar-final.log" 2>&1
bash tools/procedencia/run.sh "$out/verificar.py" > "$out/verificar-final.log" 2>&1
nix shell nixpkgs#ruff --command ruff check "$out" --output-format concise > "$out/ruff-final.log" 2>&1
nix shell nixpkgs#mypy --command mypy --ignore-missing-imports --cache-dir "$PWD/.cache/flujo-escalas-r23-sol/mypy" "$out" > "$out/tipos-python-final.log" 2>&1
