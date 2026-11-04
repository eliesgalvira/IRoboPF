#!/usr/bin/env bash
# Fixtures públicos y operador real; no necesita capturas privadas ni red.
set -euo pipefail
cd "$(dirname "$0")/.."
export UV_CACHE_DIR="$HOME/.cache/uv"
export PYTHONDONTWRITEBYTECODE=1

# actions/checkout crea un repositorio normal, no un worktree de T3.
# El operador obtiene la base con jj; no se sustituye por un identificador ficticio.
if [[ "${GITHUB_ACTIONS:-false}" == true && ! -e .jj ]]; then
  if [[ ! -d .git ]]; then
    printf '%s\n' 'Se requiere checkout Git normal para inicializar jj en CI.' >&2
    exit 1
  fi
  timeout -k 30s 2m jj git init --colocate .
fi
timeout -k 30s 1m jj root >/dev/null
timeout -k 30s 10m bash tools/procedencia/simuladores/ci.sh
