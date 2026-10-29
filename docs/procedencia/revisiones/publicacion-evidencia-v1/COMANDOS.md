# Reproducción

Ejecutar desde `/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5`, base 5799bb03826719a4dd3500a962e2d6bb5124fdca. Los scripts entregados importan esta base mediante rutas absolutas; relocalizarlos exige registrar sus nuevos hashes. Solo crean/modifican su copia CAS en `.cache/revision-publicacion/cas`, nunca los originales. No ejecutar desde la carpeta publicable.

El entorno Python se fijó antes del wrapper:

```sh
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/.cache/revision-publicacion/venv
```

Comandos efectivamente ejecutados bajo `flock /tmp/irobopf-validacion-pesada.lock`, con `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3` y un trabajador:

```sh
bun run test -- tests/publicacion-evidencia.test.ts tests/evidencia-contenido.test.ts --maxWorkers=1
bun run typecheck
bun run lint
bun .cache/revision-publicacion/repro.mjs
bun .cache/revision-publicacion/medir.mjs
bun scripts/procedencia/verificar-enlaces.mjs
bun .cache/revision-publicacion/grafo.mjs
```

El nombre correcto del test del adaptador es `tests/evidencia-contenido-procedencia.test.ts`. No fue seleccionado por el primer comando: no atribuirle ejecución. La publicación abortó por la ruta ausente, antes de los seis casos. El coordinador sí se ejecutó aparte y pasó, usando internamente `bash tools/procedencia/run.sh` con Nix/uv fijados. No se sustituyó su salida ni se modificó registro alguno.

La relectura visual añadió nixpkgs#poppler-utils al mismo entorno y lock:

```sh
pdftotext -f 4 -l 4 -layout docs/procedencia/corpus/fixtures/sha256/8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660 .cache/revision-publicacion/original.txt
pdftoppm -f 4 -l 4 -scale-to 1200 -png -singlefile docs/procedencia/corpus/fixtures/sha256/8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660 .cache/revision-publicacion/original
```

El PNG del fixture se abrió directamente y el render propio también. No son archivos modificados de la cita ni una nueva autenticación del emisor.

Lint de entrega: el primer intento desde el checkout omitió archivos externos en ESLint. Repetición desde `/home/elies/Repos/IRoboPF`, únicamente archivos propios, usando Bun/Node de Nix y lock:

```sh
node node_modules/eslint/bin/eslint.js --config /home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/eslint.config.mjs docs/procedencia/revisiones/publicacion-evidencia-v1/*.mjs
bun x oxlint --disable-nested-config --no-ignore -c /home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/.oxlintrc.json docs/procedencia/revisiones/publicacion-evidencia-v1/*.mjs
```

Resultados con tiempos, errores y estados en logs y JSON. No sumar observaciones a tests fiscales. Ningún log excedió 1 MB. El manifiesto excluye su propio contenido y entrega.patch para evitar ciclos. El patch es exclusivamente aditivo; original.png se entrega como binario por hash. No incluye copias de implementación, tsconfig, node_modules, caché ni CAS. No se hizo Next build ni suite legacy completa.
