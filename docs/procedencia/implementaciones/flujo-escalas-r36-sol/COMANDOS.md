# Reproducción autorizada

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Desde la raíz del checkout, con el HEAD indicado en INFORME.md. No ejecuta productores históricos en sus ubicaciones.

```bash
nix shell nixpkgs#bun -c bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list
nix shell nixpkgs#bun -c bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js show basics data-modeling testing
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node .cache/flujo-escalas-r36/r28.mjs antes
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/flujo-escalas-r36/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/flujo-escalas-r36/r26.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node scripts/procedencia/flujo-escalas-r36-artefacto.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --config .cache/flujo-escalas-r36/vitest.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/flujo-escalas-r36/tsconfig.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/flujo-escalas-r36/tsconfig-tests.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config -c .cache/flujo-escalas-r36/oxlint.json scripts/procedencia/flujo-escalas-r36*.mjs tests/flujo-escalas-r36*.test.ts
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node scripts/procedencia/flujo-escalas-r36-transporte.mjs
```

La configuración propia de Vitest fija los imports de effect/decimal al node_modules compartido, exclusivamente leído. `tsconfig.json` comprueba los MJS con checkJs/noEmit, sin noImplicitAny: el intérprete dinámico conserva límites de tipado explícitos. `tsconfig-tests.json` comprueba las pruebas TypeScript. El schema se valida con Draft202012Validator del entorno fijado por tools/procedencia/run.sh y las dos variables indicadas; se ensayan mutaciones de estados, operadores y unidades. Las configuraciones y las copias adaptadas se conservan en scratch; los diffs y los logs forman parte de la entrega.

No anidar los bloqueos. Cada invocación libera el bloqueo al terminar su validación. El scratch de transporte es un directorio nuevo, sin checkout ni metadatos VCS. El script exige el HEAD y todas las entradas físicas, y el transporte compara cada archivo reconstruido. No ejecutar estos controles con salida en carpetas recibidas.

Preparar configuraciones propias: `nix shell nixpkgs#nodejs -c node scripts/procedencia/flujo-escalas-r36-preparar.mjs`. Validar schema y mutaciones: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node scripts/procedencia/flujo-escalas-r36-schema.mjs`.
