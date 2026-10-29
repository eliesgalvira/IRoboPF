#!/usr/bin/env bash
set -uo pipefail
export TMPDIR="$PWD/.cache/integracion-r17/tmp"
run() { local name="$1"; shift; "$@" > ".cache/integracion-r17/$name.log" 2>&1; local result=$?; echo "$name $result"; }
run smoke-un-trabajador nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/implementaciones/integracion-sol-r17/anti-slop-smoke.mjs
run oxlint-un-trabajador nix shell nixpkgs#bun nixpkgs#nodejs -c bun node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config
run eslint-final nix shell nixpkgs#bun nixpkgs#nodejs -c bun run lint:eslint
run ruff-final nix shell nixpkgs#ruff -c ruff check tools/procedencia/enlaces.py tests/test_ambitos_juridicos.py docs/procedencia/implementaciones/integracion-sol-r17/
