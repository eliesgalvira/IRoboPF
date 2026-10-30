# Reproducción acotada

Desde la raíz del checkout. Dependencias del padre en lectura; Nix aporta ejecutables.
Cada comando pesado está envuelto individualmente por flock. No instalar ni cambiar paquetes.

```sh
nix shell nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node .cache/puertos-composicion-r51-sol/harness.mjs
nix shell nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/puertos-composicion-r51-sol/vitest.mjs
nix shell nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/puertos-composicion-r51-sol/rojos-final.config.mjs
nix shell nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node /home/elies/Repos/IRoboPF/node_modules/vitest/vitest.mjs run --configLoader native --config .cache/puertos-composicion-r51-sol/rojo.config.mjs
nix shell nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node .cache/puertos-composicion-r51-sol/tipos.mjs
nix shell nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --no-ignore --config .cache/puertos-composicion-r51-sol/oxlint.json .cache/puertos-composicion-r51-sol/autor.test.ts .cache/puertos-composicion-r51-sol/nullproto.test.ts .cache/puertos-composicion-r51-sol/observador.test.ts .cache/puertos-composicion-r51-sol/propiedades.test.ts
```

El comando de rojos candidatos debe salir 1 con cinco casos fallidos específicos, el histórico 1 con su aserción original. La suite principal actual debe pasar sus 28 casos; en esta revisión solo se repitió el de sustracción que falló por el instrumento. RESULTADOS y logs conservan las ejecuciones efectivas, no un pase completo inventado después de corregir el instrumento.

transportar.py requiere que no exista todavía su destino reconstruccion; usa su propio lock solo durante reconstrucción. fisico.py adquiere el lock de recepción dentro del programa: no anidarlo. Los scripts no crean checkouts ni mutan VCS. La reconstrucción se hizo antes del cotejo terminal y los archivos base permanecen intactos.
