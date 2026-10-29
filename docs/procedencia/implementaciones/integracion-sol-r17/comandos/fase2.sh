#!/usr/bin/env bash
set -uo pipefail
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/integracion-r17/uv"
export PYTHONDONTWRITEBYTECODE=1
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
run() { local name="$1"; shift; "$@" > ".cache/integracion-r17/$name.log" 2>&1; local result=$?; echo "$name $result"; }
run preparar-actual bash tools/procedencia/run.sh docs/procedencia/implementaciones/integracion-sol-r17/preparar.py
run coordinador-real nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun scripts/procedencia/verificar-enlaces.mjs --cas-root /home/elies/Repos/IRoboPF/.cache/procedencia/sha256
run regeneracion nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun docs/procedencia/implementaciones/integracion-sol-r17/regenerar.mjs
run contenido nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
run rastro-publicacion nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/contenido-integridad-procedencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/publicacion-evidencia.test.ts tests/rastro-anual-procedencia.test.ts --maxWorkers=1
