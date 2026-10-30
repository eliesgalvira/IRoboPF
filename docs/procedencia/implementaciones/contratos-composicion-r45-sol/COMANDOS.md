# Comandos y resultados

CWD: `/home/elies/.t3/worktrees/IRoboPF/t3-a0fed5b8`.
Todas las lecturas VCS usan git read-only porque el encargo prohíbe mutaciones; no se inicializa JJ.

- `git rev-parse HEAD`: 0, 31a70bd671f92fdb47ca1bf0fe95613a9fa4fb59.
- `git ls-tree -r HEAD | wc -l`: 0, 21357.
- Python físico inicial con uv genérico: 2, loader NixOS. Python Nix/uv con lock acotado: 0, 21357 iguales.
- `bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show error-handling testing`: 0. Consulta de Result.isFailure/Effect.result en fuente local.
- `node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --config .cache/contratos-composicion-r45-sol/vitest.config.mts --configLoader native`: rojo 1; intentos 1/1; posteriores 0. Terminal añade `--reporter=json --outputFile=docs/procedencia/implementaciones/contratos-composicion-r45-sol/RESULTADOS.json`: 0, 18 pruebas.
- `node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/contratos-composicion-r45-sol/tsconfig.json`: primeros 2 por arnés, terminal 0.
- Mismo tsc con `-p .cache/contratos-composicion-r45-sol/global.json`: 2, no se declara pase global; véase informe.
- `NODE_OPTIONS=--import=/home/elies/.t3/worktrees/IRoboPF/t3-a0fed5b8/.cache/contratos-composicion-r45-sol/resolver.mjs node /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads 1 --disable-nested-config`: terminal 0. Intentos fallidos: resolución plugin, parámetro object.
- Mismo resolver con `node /home/elies/Repos/IRoboPF/node_modules/eslint/bin/eslint.js .`: 0, 12 avisos.

Node/bun/Python/patch se proporcionan por `nix shell nixpkgs#nodejs`, `nixpkgs#bun`, `nixpkgs#python3`, `nixpkgs#patch`. Pruebas/tipos/lint/reconstrucción se ejecutan bajo `flock /tmp/irobopf-validacion-pesada.lock`, una validación por adquisición. El cotejo físico usa `flock /tmp/irobopf-recepcion-acotada.lock`, nunca para pruebas. Python usa uv run --no-project --python apuntando al Python de Nix, PYTHONDONTWRITEBYTECODE=1 y UV_PROJECT_ENVIRONMENT absoluto en la caché propia. Los instrumentos completos y configuraciones están en controles.
