#!/usr/bin/env bash
set -u
out=docs/procedencia/editorial/flujo-rentas-actividad-r23-sol
status=0
for script in construir completar terminales verificar; do
 node "$out/$script.mjs" > "$out/$script.log" 2>&1
 code=$?
 printf '%s=%s\n' "$script" "$code"
 if [ "$code" -ne 0 ]; then exit "$code"; fi
done
for script in discriminantes actividad; do
 bun "$out/$script.mjs" > "$out/$script.log" 2>&1
 code=$?
 printf '%s=%s\n' "$script" "$code"
 if [ "$code" -ne 0 ]; then status=1; fi
done
/home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config "$out/oxlint.json" "$out" > "$out/lint.log" 2>&1
code=$?
printf 'lint=%s\n' "$code"
if [ "$code" -ne 0 ]; then status=1; fi
node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p "$out/tsconfig.json" > "$out/tipos.log" 2>&1
code=$?
printf 'tipos=%s\n' "$code"
if [ "$code" -ne 0 ]; then status=1; fi
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-94b3dc00/.cache/flujo-rentas-actividad-r23-uv bash tools/procedencia/run.sh -c 'import json,jsonschema; from pathlib import Path; p=Path("docs/procedencia/editorial/flujo-rentas-actividad-r23-sol"); jsonschema.Draft202012Validator.check_schema(json.loads((p/"schema.json").read_text())); jsonschema.validate(json.loads((p/"grafo.json").read_text()),json.loads((p/"schema.json").read_text())); print("Schema draft2020-12 correcto")' > "$out/schema.log" 2>&1
code=$?
printf 'schema=%s\n' "$code"
if [ "$code" -ne 0 ]; then status=1; fi
exit "$status"
