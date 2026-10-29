#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
run() { local name="$1"; shift; "$@" > ".cache/integracion-r17/$name.log" 2>&1; local result=$?; echo "$name $result"; }
run smoke-final nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/implementaciones/integracion-sol-r17/anti-slop-smoke.mjs
run python-quality nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check tools/procedencia/enlaces.py tests/test_ambitos_juridicos.py docs/procedencia/implementaciones/integracion-sol-r17/*.py && mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/integracion-r17/mypy tools/procedencia/enlaces.py tests/test_ambitos_juridicos.py docs/procedencia/implementaciones/integracion-sol-r17/preparar.py'
run lint-final nix shell nixpkgs#bun nixpkgs#nodejs -c bun run lint
