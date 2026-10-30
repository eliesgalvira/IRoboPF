# Comandos y resultados

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Todos los comandos se ejecutan desde este checkout. Herramientas obtenidas por Nix: Node 24.19.0 y Bun 1.3.13. No hay instalación global, pip, entorno Python, node_modules propio ni cambios de package/lockfiles. Los módulos del integrador se leen desde `/home/elies/Repos/IRoboPF/node_modules`.

Preparación de pruebas privadas reproducible:

```sh
node scripts/procedencia/puertos-composicion-r47-harness.mjs
```

El preparador lee el blob original R43 de la base exigida; no crea checkout ni modifica VCS. Genera únicamente dos módulos en `.cache/puertos-composicion-r47-sol/`: constructor privado para sensibilidad y ejecutor original para el rojo. No se importa desde el router de producción. `controles/harness.mjs.txt`, configuraciones y fuentes del rojo permiten revisar el arnés; el código instalable del preparador está en scripts.

Validaciones concretas, cada una con adquisición/liberación propia:

```sh
flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/puertos-composicion-r47-sol/tsconfig.json
flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/puertos-composicion-r47-sol/tsconfig-global.json
flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p .cache/puertos-composicion-r47-sol/tsconfig-vendor.json
NODE_OPTIONS="--import=$PWD/.cache/puertos-composicion-r47-sol/resolver.mjs" flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config scripts/procedencia/puertos-composicion-r47*.ts scripts/procedencia/puertos-composicion-r47*.mjs scripts/procedencia/composicion-r43.ts scripts/procedencia/flujo-rentas-r36-consumidor.mjs scripts/procedencia/flujo-escalas-r36-consumidor.mjs tests/puertos-composicion-r47.test.ts
flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/puertos-composicion-r47-sol/vitest.config.mjs --reporter=verbose
```

Las configuraciones entregadas en controles son copias textuales de las usadas. Contienen rutas absolutas del checkout y de su caché: para repetir en otra ruta se debe sustituir ese prefijo por el nuevo, conservando opciones estrictas y exclusiones originales. Las resoluciones propias corrigen paquetes exportados y tipos react/react-dom; no reducen strict, exactOptionalPropertyTypes ni las reglas Effect. El resolver de Oxlint resuelve únicamente `@oxlint/plugins` contra el paquete existente, conservando los plugins locales y las 16 reglas a error.

El principal devuelve 2 por un único TS2345 histórico R42. El control virtual de base devuelve 1 y demuestra el mismo diagnóstico; no es una sustitución favorable del control principal. Alcance/vendor/lint tienen sus códigos separados. No se suman ejecuciones repetidas como cobertura adicional.

Rojo contra la base recibida:

```sh
flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/puertos-composicion-r47-sol/rojo.config.mjs
```

El JSON de composición capturado antes de editar se conserva como `base-composicion-recibida.json.gz`. Para repetir el rojo, descomprimirlo a `.cache/puertos-composicion-r47-sol/base.json` antes del comando. Su código esperado es 1: retirar los enlaces documentales no cambia las líneas del mapa original. Se conserva la aserción fallida, sin cambiar su esperado para contarla como verde. Se reproduce retrospectivamente sobre la receta capturada antes de editar y el cuerpo R43 exacto; no se presenta como un comando ejecutado antes de la primera edición.

Generación documental, sin evaluar TS financiero:

```sh
flock /tmp/irobopf-validacion-pesada.lock bun .cache/puertos-composicion-r47-sol/generar.ts
```

```sh
flock /tmp/irobopf-validacion-pesada.lock node .cache/puertos-composicion-r47-sol/empaquetar.mjs
```
