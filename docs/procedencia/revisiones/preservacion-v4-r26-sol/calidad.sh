#!/usr/bin/env bash
set -euo pipefail
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-v4-r26-sol/venv"
out=docs/procedencia/revisiones/preservacion-v4-r26-sol
nix shell nixpkgs#ruff --command ruff check "$out"
export MYPYPATH="$PWD/tools/procedencia:$PWD/docs/procedencia/preservacion-v4-sol"
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir .cache/preservacion-v4-r26-sol/mypy docs/procedencia/revisiones/preservacion-v4-r26-sol/*.py'
nix shell nixpkgs#nodejs --command node "$out/patrones.mjs"
bash tools/procedencia/run.sh "$out/preparar_lint.py"
nix shell nixpkgs#bun --command bun build tools/oxlint/anti-slop/index.ts --external '@oxlint/plugins' --target node --outfile .cache/preservacion-v4-r26-sol/anti-slop.js
nix shell nixpkgs#bun --command bun build tools/oxlint/anti-slop/effect/index.ts --external '@oxlint/plugins' --target node --outfile .cache/preservacion-v4-r26-sol/anti-slop-effect.js
nix shell nixpkgs#bun nixpkgs#nodejs --command bun /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config -c .cache/preservacion-v4-r26-sol/oxlint.json "$out/patrones.mjs"
