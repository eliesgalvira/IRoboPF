# Reproducción

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-e38076e1`. Herramientas por Nix; dependencias JS existentes del padre solo lectura. No se instaló nada globalmente, no se creó entorno Python ni node_modules propio. No se ejecutó Python.

Recepción, un blob por vez:

```sh
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs --command node docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/fisico.mjs inicial
```

Consulta previa de Effect: `nix shell nixpkgs#bun --command bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show testing basics`. Se consultaron ejemplos runPromise en `~/.local/share/effect-solutions/effect/packages/effect/test/Effect.test.ts`. No se modificó Effect del motor.

Construcción, casos sobre TS transpilado real, anti-slop16 reglas, tipos checkJs, verificaciones de fuente/schema y correspondencia exacta con inventario:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs --command bash docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/calidad.sh
```

Se preserva `tipos-inicial.log`, con cuatro diagnósticos del instrumento. Se corrigieron resolución de declaraciones Effect/Ajv, discriminación de nodos AST y acceso a propiedad de una unión. No se alteraron expectativas ni fuentes fiscales. El segundo pase completo termina0. Cada etapa tiene su propio log; el script usa set-eu y para ante cualquier fallo. El tipo aplicado a los instrumentos no es typecheck estricto de todo el motor. El lector TS de los casos resuelve recursivamente los módulos de este checkout y usa solo paquetes externos del padre; sus hashes ejecutados/mutaciones se conservan.

El primer intento de búsqueda encontró rg ausente; se proporcionó con `nix shell nixpkgs#ripgrep`. No se sustituyó por una herramienta prohibida. La cola del lock pesado se respetó; ningún test utilizó el lock de recepción.

Cotejo final y empaquetado:

```sh
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs --command node docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/fisico.mjs final
nix shell nixpkgs#nodejs --command node docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/empacar.mjs
```

Empaquetar solo después de cerrar informe y controles. El script rechaza reemplazar un archivo ya existente en la base y registra los tres metadatos autorreferentes excluidos. Los binarios gzip permanecen por ruta y hash; no se incluyen en el patch textual. El manifiesto fija además los hashes del patch y del mapa binario. La recepción siguiente debe cotejar de nuevo los bytes físicos, no solo el índice.

Sin Next build, suite legacy masiva, servidores, preview, escritura VCS ni publicación. No hay nuevos originales ni fuentes adquiridas externamente. El conjunto es candidato técnico, no validador fiscal general ni autorización de wiring.

El pase final añade `clasificar-retencion.mjs`, tras el cotejo del inventario, para disponer también los tokens nuevos de familia, escala y umbrales. Sus asociaciones son candidatas explícitas por operación y propiedad; la tabla de localizadores no implica aprobación. Los scripts de entrega (`fisico.mjs`, `empacar.mjs`) también están incluidos en el lint y checkJs del alcance.
