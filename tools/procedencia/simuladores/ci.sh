#!/usr/bin/env bash
set -euo pipefail
# Dependencias ya instaladas según lock del proyecto. Sin red ni corpus privado.
exec timeout -k 30s 10m bash -c '
  set -euo pipefail
  "${C_PYTHON:-python3}" tests/simuladores-test.py
  bunx --no-install vitest run tests/simuladores-proyeccion.test.ts tests/redondeo-salarial-open.test.ts tests/conexion-anual.test.ts tests/composicion-anual-revision.test.ts tests/composicion-anual-unica.test.ts tests/composicion-precision-contraste.test.ts tests/composicion-precision.test.ts --maxWorkers=1
'
