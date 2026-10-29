#!/usr/bin/env bash
set -euo pipefail
mkdir -p .cache/integracion-r17/tgss
cp docs/procedencia/auditorias/tgss-etapas-operativas/casos.py .cache/integracion-r17/tgss/casos.py
nix shell nixpkgs#python3 -c python3 .cache/integracion-r17/tgss/casos.py
cmp .cache/integracion-r17/tgss/discriminantes.json docs/procedencia/auditorias/tgss-etapas-operativas/discriminantes.json
nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/auditorias/cierre-cobertura/muestra.mjs
