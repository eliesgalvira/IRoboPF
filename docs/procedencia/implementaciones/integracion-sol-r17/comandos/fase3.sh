#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
run() { local name="$1"; shift; "$@" > ".cache/integracion-r17/$name.log" 2>&1; local result=$?; echo "$name $result"; }
run corte-preservacion bash tools/procedencia/run.sh docs/procedencia/implementaciones/integracion-sol-r17/cotejar-preservacion.py
run preparar-ensayo nix shell nixpkgs#python3 -c python3 docs/procedencia/implementaciones/integracion-sol-r17/preparar-ensayo.py
run ensayo nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash -c 'cd .cache/ambitos/e2e && bun ../../../docs/procedencia/implementaciones/integracion-sol-r17/ensayo-publicacion.mjs'
