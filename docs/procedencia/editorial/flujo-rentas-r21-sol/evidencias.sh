#!/usr/bin/env bash
set -euo pipefail
export UV_PROJECT_ENVIRONMENT="$(pwd)/.cache/flujo-rentas-r21-sol/uv"
export PYTHONDONTWRITEBYTECODE=1
out=docs/procedencia/editorial/flujo-rentas-r21-sol
bash tools/procedencia/run.sh "$out/evidencias.py"
nix shell nixpkgs#ruff -c ruff check "$out/evidencias.py" > "$out/ruff.log" 2>&1
nix shell nixpkgs#python3Packages.mypy -c mypy --python-executable "$UV_PROJECT_ENVIRONMENT/bin/python" --follow-untyped-imports --cache-dir "$(pwd)/.cache/flujo-rentas-r21-sol/mypy" "$out/evidencias.py" > "$out/mypy.log" 2>&1
