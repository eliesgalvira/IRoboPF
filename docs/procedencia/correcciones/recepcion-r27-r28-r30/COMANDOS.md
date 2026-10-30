# Comandos y condiciones de reproducción

Ejecutados desde la raíz, un trabajador bajo `/tmp/irobopf-validacion-pesada.lock`. Nix proporciona Bun, Node y Python. `PYTHONDONTWRITEBYTECODE=1`; el entorno uv está en una ruta absoluta dentro de la caché de integración. No se ejecuta build ni las suites legacy masivas.

Las recetas `validar-inicial.sh` y `validar-cierre.sh` conservan los comandos exactos y destinos utilizados. Algunas rutas de instrumentos apuntan a la caché de ejecución; sus copias legibles están junto a este archivo y `preservacion-r30/caso-real.py`. Para repetir, adaptar **una copia** a un directorio propio y a logs nuevos. No sobrescribir los originales ni los rojos conservados.

Comprobaciones focalizadas:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun run typecheck
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun run lint
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun test tests/nominal-software-explicacion.test.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun x vitest run tests/flujo-procedencia.test.ts --maxWorkers=1
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun -c bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
```

Las pruebas nominales Python/Node necesitan el CAS de fixture. `preparar-nominal.py` describe sus copias por hash desde el paquete v5 r2 preservado, sin alterar el registro activo ni los informes del autor. Su ruta absoluta de origen es una condición local, no una garantía de restauración en otra máquina. La preparación y el coordinador se ejecutaron bajo el bloqueo con el entorno de `tools/procedencia/run.sh` y Python también disponible en el proceso exterior. Los logs separan esas comprobaciones de las pruebas sintéticas.

`regenerar.mjs` exige 38 históricos; `regenerar-final.mjs` exige 40 y el recibo de la primera ejecución. No son scripts idempotentes para volver a ejecutar sobre 42 snapshots: se conservan como recetas de esta transición. La segunda ejecución se justifica por incorporar seis dependencias de software después de una prueba realmente fallida. No se deben borrar snapshots para satisfacer sus precondiciones.

La primera tanda conjunta dejó 58 pruebas correctas y el timeout de una; se repitió el archivo de composición tras acotar su tiempo. La segunda regeneración se siguió de las regresiones de rastro/publicación y de contenido. Los recuentos se solapan; `validacion.json` los registra por ejecución sin sumarlos como cobertura fiscal.
