#!/usr/bin/env bash
# Valida los manifiestos versionados sin originales privados ni historial Git.
set -euo pipefail
deducciones_tools=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
corpus_tools=$(cd -- "$deducciones_tools/../../../tools/procedencia" && pwd)
exec nix develop "path:$corpus_tools" --command bun "$deducciones_tools/verificar.mjs" "$@"
