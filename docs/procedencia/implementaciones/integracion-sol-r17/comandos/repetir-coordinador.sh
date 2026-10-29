#!/usr/bin/env bash
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun scripts/procedencia/verificar-enlaces.mjs
