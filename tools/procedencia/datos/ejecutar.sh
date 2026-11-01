#!/usr/bin/env bash
set -euo pipefail
: "${DATOS_CAS:?Directorio plano externo de objetos SHA256}"
: "${DATOS_WORK:?Directorio externo de temporales}"
: "${DATOS_OUTPUT:?Manifiesto de salida}"
# NODE_PATH puede apuntar a dependencias congeladas externas al checkout.
# UV_CACHE_DIR y UV_PROJECT_ENVIRONMENT, si se configuran, deben ser externos.
exec uv run --no-project --python python3 --no-managed-python \
  --with pymupdf==1.26.7 --with jsonschema==4.25.1 \
  python tools/procedencia/datos/flujo.py \
  --cas "$DATOS_CAS" --work "$DATOS_WORK" \
  --mapping docs/procedencia/datos-2012-2026/tablas.json \
  --output "$DATOS_OUTPUT" "$@"
