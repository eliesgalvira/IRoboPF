# Comandos y resultados

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Herramientas de la validación: Node/Bun/Python mediante Nix.

- `node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --config .cache/contratos-composicion-r45-sol/vitest.config.mts --configLoader native`: rojo 1; intentos 1/1; posteriores 0. Terminal añade `--reporter=json --outputFile=docs/procedencia/implementaciones/contratos-composicion-r45-sol/RESULTADOS.json`: 0, 18 pruebas.
- `node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/contratos-composicion-r45-sol/tsconfig.json`: primeros 2 por arnés, terminal 0.
- Mismo tsc con `-p .cache/contratos-composicion-r45-sol/global.json`: 2, no se declara pase global; véase informe.
- `NODE_OPTIONS=--import=/home/elies/.t3/worktrees/IRoboPF/t3-a0fed5b8/.cache/contratos-composicion-r45-sol/resolver.mjs node /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads 1 --disable-nested-config`: terminal 0. Intentos fallidos: resolución plugin, parámetro object.
- Mismo resolver con `node /home/elies/Repos/IRoboPF/node_modules/eslint/bin/eslint.js .`: 0, 12 avisos.
