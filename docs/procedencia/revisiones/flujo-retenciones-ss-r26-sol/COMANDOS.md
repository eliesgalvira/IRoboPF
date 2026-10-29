# Reproducción y controles

Raíz: `/home/elies/.t3/worktrees/IRoboPF/t3-1bcd822f`. Sin operaciones VCS mutantes. Nix proporciona Node, Bun y rg; no se usa Python, no se crea entorno ni node_modules. Las dependencias del padre se leen exclusivamente a través de createRequire y ejecutables existentes.

```sh
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/fisico.mjs inicial
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/revisar.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/validador.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/tsconfig.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/oxlint.json docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/fisico.mjs final
```

Effect: `nix shell nixpkgs#bun -c bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list`, seguido de `show testing basics`; fuente local Effect.test.ts, ejemplos runPromise. No se escribe código Effect del motor. El instrumento usa runPromise para las funciones reales transpiladas y expone auxiliares arrow identificados mediante AST. Los originales TS no se escriben.

`validador.mjs` redirige únicamente escrituras de resultados del verificador y de los 28 casos del autor a esta carpeta. Para mutaciones del grafo sustituye únicamente la expresión de lectura de data por un literal en memoria, conserva los restantes inputs originales y ejecuta el programa restante sin modificar sus esperados. El primer adaptador de redirección tenía una concatenación incorrecta y se conserva su diagnóstico en validador-inicial.log. No ejecuta construir.mjs, inventario.mjs, clasificar-retencion.mjs ni trazar.mjs porque escriben sobre entregas recibidas. La reproducción de esos 28 es complementaria a los discriminantes nuevos.

El primer rg no existía en PATH y se proporcionó mediante Nix. No se relajan reglas por ese diagnóstico. Las 16 reglas anti-slop siguen a error en el config copiado; los plugins de dependencia se leen del padre. Los tipos son checkJs sobre los instrumentos de esta carpeta, no tsc global del motor. Sin Next build, suite legacy masiva, renders, servidores o preview.

Los recibos físicos incluyen todas las entradas base y diff de archivos versionados; el empaquetado añade el inventario exacto de adiciones de esta carpeta. Ambos controles son necesarios: el diff vacío por sí solo no describe archivos nuevos. Los logs mayores de1MB se comprimen al cierre. Los rojos conservan esperados y permanecen en casos-resultados.json/casos.log; el proceso recoge sus diagnósticos para completar la revisión sin saltarse casos siguientes.
