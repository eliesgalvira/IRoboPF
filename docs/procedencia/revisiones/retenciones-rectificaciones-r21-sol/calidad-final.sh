#!/usr/bin/env bash
set -u
out="$PWD/docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol"
nix shell nixpkgs#ruff nixpkgs#mypy --command bash -c 'ruff check "$1"/*.py; r=$?; mypy --check-untyped-defs --follow-untyped-imports --python-executable "$3" --cache-dir "$2" "$1"/*.py; t=$?; exit $((r || t))' audit "$out" "$PWD/.cache/rectificaciones-r21/mypy" "$PWD/.cache/rectificaciones-r21/venv/bin/python" > "$out/calidad-final.log" 2>&1
code=$?
printf '\nexitCode=%s\n' "$code" >> "$out/calidad-final.log"
exit "$code"
