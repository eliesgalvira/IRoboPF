# Reproducción de la revisión

Ejecutar desde `/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef`, HEAD `1196269d4e73742beeed35cc05011b70c21a0b69`. El código y el node_modules compartido no se modifican. Entrega absoluta: `/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/alimentos-sin-minimo-sol`. Los imports de casos.test.ts fijan este checkout. Para relocalizar hay que registrar imports nuevos y sus hashes; no importar inadvertidamente el motor actual del padre.

Scratch `.cache/alimentos-sol`. Las configuraciones temporales no se entregan en docs: vitest.config.mjs tiene `export default {cacheDir: RUTA_SCRATCH_ABSOLUTA+'/vite', test:{include:[RUTA_ENTREGA_ABSOLUTA+'/*.test.ts'],maxWorkers:1}}`; tsconfig.json extiende `../../tsconfig.json`, incremental=false, include absoluto a ese test, exclude=[]. No se rebajan tipos ni reglas.

## Comandos y resultados

Todo comando de pruebas, tipos, lint, hashes masivos o render lleva el prefijo:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c COMANDO
```

Para Python usar en cambio:

```sh
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-fdd037ef/.cache/alimentos-sol/uv bash tools/procedencia/run.sh .cache/alimentos-sol/primaria.py
```

Python usa únicamente el entorno gestionado y absoluto. No instalaciones globales ni más de un trabajador. El pase existente usa UV_PROJECT_ENVIRONMENT absoluto igual al anterior dentro de nix shell.

| Comando dentro del entorno | Log | Salida |
|---|---|---|
| `git rev-parse HEAD` | base.json | 0, base exacta |
| `git diff a0c449575 HEAD -- …` | INFORME.md, discrepancia literal | 128, objeto inexistente |
| `git diff HEAD^ HEAD -- lib/dominio/irpf/minimos/derechos.ts lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts tests/minimos-derechos-integracion.test.ts` | cambio-revisado.diff | 0 |
| `node .cache/alimentos-sol/integridad.mjs` | integridad.log, base.json y base-entradas.json.gz | 0, 11.181 entradas idénticas |
| `bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show basics error-handling testing` | effect.log | 0 |
| `node_modules/.bin/vitest run --config .cache/alimentos-sol/vitest.config.mjs --reporter=verbose` | pruebas-final.log | 0, 61 correctas |
| `node_modules/.bin/tsc -p .cache/alimentos-sol/tsconfig.json --noEmit --incremental false` | tipos-propios-final.log | 0 |
| `node_modules/.bin/tsc --noEmit --incremental false` | tipos-principal.log | 0 |
| `node_modules/.bin/tsc --noEmit --incremental false -p tools/oxlint/tsconfig.json` | tipos-vendor.log | 0 |
| `node_modules/.bin/vitest run tests/minimos-derechos-integracion.test.ts tests/minimos-derechos.test.ts tests/rastro-anual-procedencia.test.ts tests/publicacion-evidencia.test.ts --maxWorkers=1` | existentes.log | 0, 70 correctas |
| `node .cache/alimentos-sol/focal.mjs` | focal.log y publicacion-verificada.json | 0 |
| wrapper Python sobre `.cache/alimentos-sol/primaria.py` | primaria.log, fuentes-verificadas.json y facsimiles.json | 0 |
| wrapper Python sobre `.cache/alimentos-sol/citas.py` | citas.log y citas.json | 0, cinco pasajes |
| `bun .cache/alimentos-sol/reglas.mjs` con bun y node en Nix | anti-slop-verificado.log | 0; fixture debe devolver 1 |

Para lint se usa cwd `/home/elies/Repos/IRoboPF` y selección **solo de la entrega**:

```sh
node_modules/.bin/oxlint --disable-nested-config docs/procedencia/revisiones/alimentos-sin-minimo-sol/
node_modules/.bin/eslint docs/procedencia/revisiones/alimentos-sin-minimo-sol/
```

Ambos salida 0, lint-entrega.log. El archivo TS también tiene pase separado en lint.log. Se incluyen scripts propios reproducibles integridad.mjs, focal.mjs, reglas.mjs, primaria.py y citas.py. Copiarlos a `.cache/alimentos-sol/` para ejecutar los comandos anteriores; reglas.mjs importa los plugins relativos desde esa ubicación. Las rutas de entrega y primarios están fijadas deliberadamente. No ejecutar scripts de generación oficial.

El ensayo reglas.mjs copia a scratch la configuración con todas las reglas y plugins originales; únicamente vacía ignorePatterns para poder analizar el fixture deliberadamente inválido dentro de .cache. --disable-nested-config permanece activo. No modifica la configuración del producto ni omite una infracción del código entregado. Las dos ejecuciones iniciales sin node fallaron con 127 interno/1 del ensayo; la tercera no encontró archivo por el ignore de .cache y produjo fallo al parsear salida no JSON. Se conservan anti-slop.log, anti-slop-final.log y anti-slop-node.log. El pase final comprueba ambos diagnósticos.

pruebas.log conserva 26 fallos iniciales de mi regex de privacidad; tipos-propios.log conserva el diagnóstico de async. Ambos se corrigen solo en el test propio; INFORME.md explica la causa. El lector inicial de Git falló ENOBUFS por el límite por defecto de execFileSync; ampliar ls-tree no resolvía el truncamiento del cat-file total. No se acepta ese cotejo intermedio. integridad.mjs usa lotes de 50, comprueba exit/status y tamaño de cada blob, sin permitir salida incompleta. El resumen final y las entradas comprimidas proceden solo de ese pase válido.

## Artefactos y preservación

manifiesto.json incluye rutas literales relativas al repositorio, SHA256/size/baseSha256; todas las rutas de esta revisión son altas sobre la base y tienen baseSha256=null. Se excluye el propio manifiesto por autorreferencia. entrega.patch.gz contiene el patch textual de altas, excluidos los binarios y el manifiesto. binarios.json identifica PNG y datos gzip por hash SHA256/SHA512/tamaño; no hay código de motor, entornos, fuentes completas ni tsconfig copiados a docs. Los originales primarios se resuelven por las rutas literales fijadas en fuentes-verificadas.json; no se borran ni duplican.

Las lecturas masivas y la comprobación inicial se hicieron bajo el lock. El resumen final puede repetirse con integridad.mjs. Git status se usa solo como diagnóstico adicional; los bytes se comprueban mediante lstat/readlink/cat-file. Cero cambios de VCS, cero borrados y ninguna publicación o atestación.
