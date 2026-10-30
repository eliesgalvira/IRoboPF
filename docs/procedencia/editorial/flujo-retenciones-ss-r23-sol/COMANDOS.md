# Reproducción

Reproducción sobre la base indicada en el informe, con herramientas de Nix y dependencias JavaScript locales.

Recepción, un blob por vez:


Consulta previa de Effect: `nix shell nixpkgs#bun --command bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show testing basics`. Se consultaron ejemplos runPromise en `~/.local/share/effect-solutions/effect/packages/effect/test/Effect.test.ts`. No se modificó Effect del motor.

Construcción, casos sobre TS transpilado real, anti-slop16 reglas, tipos checkJs, verificaciones de fuente/schema y correspondencia exacta con inventario:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs --command bash docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/calidad.sh
```

El pase completo final termina con código 0. Cada etapa tiene su propio log; el script usa set-eu y para ante cualquier fallo. El tipo aplicado a los instrumentos no es typecheck estricto de todo el motor. El lector TS de los casos resuelve recursivamente los módulos de este checkout y usa solo paquetes externos del repositorio; sus hashes ejecutados/mutaciones se conservan.

Cotejo final y empaquetado:

```sh
nix shell nixpkgs#nodejs --command node docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/empacar.mjs
```

Sin Next build, suite legacy masiva, servidores, preview, escritura VCS ni publicación. No hay nuevos originales ni fuentes adquiridas externamente. El conjunto es candidato técnico, no validador fiscal general ni autorización de wiring.

El pase final añade `clasificar-retencion.mjs`, tras el cotejo del inventario, para disponer también los tokens nuevos de familia, escala y umbrales. Sus asociaciones son candidatas explícitas por operación y propiedad; la tabla de localizadores no implica aprobación. Los scripts de entrega (`fisico.mjs`, `empacar.mjs`) también están incluidos en el lint y checkJs del alcance.
