#!/usr/bin/env bash
# Ejecutar desde la raíz. Flake y uv.lock fijan el entorno de Linux x86_64.
set -euo pipefail
# Techo de memoria virtual por proceso; también lo hereda pdfsig.
ulimit -v 1572864
corpus_tools=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
exec nix develop "path:$corpus_tools" --command bash -c \
  'exec uv run --project "$1" --frozen --python "$(command -v python3)" python "${@:2}"' \
  corpus "$corpus_tools" "$@"
