# Comandos y resultados

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Todos desde el checkout; IROBOPF_DEPENDENCIES_PACKAGE=/home/elies/Repos/IRoboPF/package.json en las llamadas Node que importan el módulo.

- Rojos antes de implementación: flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --config .cache/admision-evaluable-r35/vitest.mjs. Salida 1, 226 correctos y cinco rojos.
- Propios: mismo bloqueo/runtime/vitest con --config .cache/admision-evaluable-r35/vitest-r35.mjs --reporter=default --reporter=json --outputFile=.cache/admision-evaluable-r35/pruebas.json. Resultado en pruebas-final.log y pruebas.json.
- Tipos: flock pesado, nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc --noEmit -p .cache/admision-evaluable-r35/tsconfig.json. Inicial con errores conservados; final cero.
- Oxlint: flock pesado, nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config -c .cache/admision-evaluable-r35/oxlint.json scripts/procedencia/flujo-admision-r35*.mjs tests/flujo-admision-r35*.test.ts docs/procedencia/implementaciones/admision-evaluable-r35-sol/*.mjs. Dieciséis reglas anti-slop a error. Inicial dos errores; final log anexo.
- Artefacto y documentos: node .cache/admision-evaluable-r35/documentar.mjs; importa funciones, solo escribe entrega propia. No ejecuta productores históricos.

vitest.mjs es copia del instrumento recibido con cacheDir adaptado a scratch propio; vitest-r35 añade únicamente tests del ámbito nuevo. Se conservan configs y sus diferencias. No se ejecutó generador alguno sobre informes históricos.
