#!/usr/bin/env bash
set -euo pipefail
# El operador entero, incluidos sus hijos, queda bajo el timeout del grupo.
command -v timeout >/dev/null || { echo 'Falta timeout en el entorno' >&2; exit 2; }
C_PYTHON=${C_PYTHON:-python3}
command -v "$C_PYTHON" >/dev/null || { echo 'Configure C_PYTHON con Python 3.11+' >&2; exit 2; }
exec timeout -k 30s 20m "$C_PYTHON" "$(dirname "${BASH_SOURCE[0]}")/run.py" "$@"
