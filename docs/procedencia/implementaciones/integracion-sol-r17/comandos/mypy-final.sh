#!/usr/bin/env bash
set -euo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export UV_CACHE_DIR="$PWD/.cache/integracion-r17/uv-cache"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --python "$(command -v python3)" --with mypy --with types-jsonschema mypy --follow-imports=silent --check-untyped-defs --cache-dir .cache/integracion-r17/mypy tools/procedencia/enlaces.py tests/test_ambitos_juridicos.py docs/procedencia/implementaciones/integracion-sol-r17/*.py'
