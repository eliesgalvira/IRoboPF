# Comandos realmente ejecutados

Raíz de revisión: `/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencia-contenido-v1`.

Se copiaron 260 archivos de fixtures/fuentes desde el worktree de base, excluyendo metadatos VCS, cachés y dependencias. `fuentes.json` enumera contenido y snapshot. Para repetir desde un árbol que conserve exactamente esos bytes:

```sh
nix shell nixpkgs#python3 -c python preparar.py /ruta/al/arbol/base
cd scratch
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bun x vitest run tests/evidencia-contenido-procedencia.test.ts --maxWorkers=1
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bun adversos.mjs
nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh render-original.py
nix shell nixpkgs#nodejs -c node node_modules/eslint/bin/eslint.js adversos.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x oxlint adversos.mjs
```

Los tres primeros comandos de ejecución produjeron los logs entregados mediante redirección a `../pruebas-existentes.log`, `../adversos.log` y `../original.log`. Salidas 0. Los rechazos adversariales esperados se capturan en adversos.json; consultar cada caso, no interpretar solo exit 0.

Lecturas VCS: git rev-parse HEAD; git diff --name-only BASE -- adaptador test modelo verificador; git ls-tree para comprobar presencia al cerrar. Sin mutaciones VCS. No Next build ni suites legacy.
