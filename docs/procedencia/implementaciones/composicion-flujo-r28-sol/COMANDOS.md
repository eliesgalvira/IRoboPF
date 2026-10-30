# Reproducción acotada

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Todos los comandos parten de este checkout. Las dependencias compartidas se leen, no se modifican. Un trabajador; ningún build ni suite legacy.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node .cache/composicion-flujo-r28-sol/rectificar.mjs antes
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun -c bash .cache/composicion-flujo-r28-sol/calidad.sh
```

El adaptador rojo copia el instrumento R28 sin modificarlo y sustituye solo la importación de TypeScript por su ruta de ejecución y el directorio de salida por scratch propio. Su código1 esperado exige además recibo con casos; un fallo de entorno no lo sustituye. Se conserva en esta entrega el recibo de casos y la receta de adaptación; el original queda intacto.

La generación pública reproducible, independiente del scratch, es:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node scripts/procedencia/flujo-componer.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p docs/procedencia/implementaciones/composicion-flujo-r28-sol/tsconfig.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config docs/procedencia/implementaciones/composicion-flujo-r28-sol/oxlint.json scripts/procedencia/flujo-ast.mjs scripts/procedencia/flujo-contrato.mjs scripts/procedencia/flujo-componer.mjs scripts/procedencia/flujo-adaptadores.mjs scripts/procedencia/flujo-fronteras.mjs tests/flujo-procedencia.test.ts
```

Los comandos y códigos efectivos están en los logs. Los instrumentos de recepción y transporte propios se incluyen como archivos de texto en esta carpeta para que el integrador no dependa de cachés ajenas. Ninguna ejecución modifica VCS. El ensayo de patch usa GNU patch en scratch propio.

Para las pruebas, crear scratch propio a partir de vitest.config.txt y ejecutar con Node el vitest del integrador, pasando --config a ese archivo. La receta calidad.txt conserva el comando exacto ejecutado; ultima-validacion.txt incluye además el check del artefacto.
