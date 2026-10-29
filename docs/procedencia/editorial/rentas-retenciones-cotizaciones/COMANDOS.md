# Comandos y códigos de salida

Raíz: /home/elies/.t3/worktrees/IRoboPF/t3-98a20b70. Shell bash. Bun de Nix1.3.13; Python del wrapper fijado3.13.15. Se utilizó un trabajador y lock común en generación de evidencia, lectura del artefacto, comprobación física, render y validación. Algunas lecturas iniciales de documentación con cat se hicieron fuera del lock: desviación operativa, sin concurrencia de render/pruebas propias en ellas; no se atribuye retrospectivamente protección a esos comandos.

## Reproducción de la entrega final

```sh
UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-98a20b70/.cache/editorial-b/venv flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/rentas-retenciones-cotizaciones/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff --command ruff check docs/procedencia/editorial/rentas-retenciones-cotizaciones/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy --command mypy --follow-untyped-imports --python-executable /home/elies/.t3/worktrees/IRoboPF/t3-98a20b70/.cache/editorial-b/venv/bin/python --cache-dir .cache/editorial-b/mypy docs/procedencia/editorial/rentas-retenciones-cotizaciones/verificar.py
```

Códigos finales y métricas: resultado-pruebas.json, pruebas-final.log y lint-tipos-final.log. El verificador vuelve a extraer el texto de todas las páginas, reproduce todos los PNG con la misma receta, coteja ambos hashes de los originales y verifica la identidad de todas las ocurrencias enlazadas frente al artefacto. La igualdad byte a byte del árbol base se compara con el OID de cada blob de HEAD, incluyendo destino literal de symlinks. Ninguna comprobación modifica el índice.

## Preparación realizada

1. `git rev-parse HEAD`, `git status --short`, `git diff --stat`, `git diff --cached --numstat`:0; base exacta y sin cambios iniciales. No se usaron comandos VCS mutantes.
2. `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun --command bun .cache/editorial-b/inspeccionar.mjs`: primer intento1 por maxBuffer de child_process; repetición0 con cota8MiB. Recorre11181 entradas por lstat/readlink y prepara el lote literal.
3. Lectura de fuentes y autoría propia en .cache/editorial-b/contenido.mjs; ensamblado con ensamblar.mjs, precisar.mjs, hojas.mjs, separar-controles.mjs, dimensiones.mjs y revisiones-hojas.mjs. No se copian estos instrumentos de autoría a código de producto ni se introduce generador editorial. La entrega final es el dato concreto con esquema y verificador mantenido, no una plantilla que cambie títulos.
4. `UV_PROJECT_ENVIRONMENT=<absoluto> flock ... bash tools/procedencia/run.sh .cache/editorial-b/evidencia.py`:0 en extracción inicial; una ampliación1 por ruta asumida de Ley8/2012. Se corrigió a localPath de su manifiesto concluido, sin mover originales; repetición final0:14 originales,68 páginas y14PNG. evidencia-adquisicion-final.log preserva resultado; el diagnóstico anterior queda en incidencia-fuente.log.
5. Ruff0 en primer pase. Primer mypy1: faltaban descubrimiento del entorno y tipos de módulos. Repetición0 con --python-executable apuntando al entorno propio del wrapper y --follow-untyped-imports. No se instalaron globales, no se desactivaron diagnósticos ni se agregaron stubs vacíos. Se conserva primer diagnóstico en lint-tipos.log y final en lint-tipos-final.log.
6. Verificación racional/estructural anterior0 con325 hojas antes de separar130 controles; verificación final0 con195 hojas y54 casos. Los recuentos son pases sucesivos, no sumables. La comprobación final incluye relaciones contra el inventario fijado.
7. La muestra visual propia incluye tres páginas oficiales:7393a032cbcb-p11,0236d8d10472-p23,73e5f7ae8b2c-p8. Ver detalles en inspeccionPersonal de citas.json. No se marca como visto el resto de PNG por haberse regenerado.

Las16 reglas anti-slop siguen a error en .oxlintrc.json. No hay TypeScript/Effect nuevo; no se presenta un lint de archivos Python ignorados por oxlint como prueba anti-slop del producto. El chequeo de configuración y la invocación con --disable-nested-config se registran aparte. No se usa extensión/ignore nuevo para eludir reglas.

No se ejecutaron suites del motor, Next build, servidores ni render visual del producto. Los casos racionales son oracles aritméticos propios de la autoría candidata, no resultados fiscales aceptados ni pruebas de hechos personales.

Cierre posterior: se añadió el original Ley39/2010 p60 para acreditar directamente4080/9180/13260 de2012–2014. `anadir-historica.py` termina0; no marca inspección personal. El pase final incorpora **15 originales,69 páginas,15PNG,195 hojas y54 casos**, con ambos esquemas cerrados validados. Los14/68 anteriores corresponden al corte anterior, no al cierre. El esquema de hojas también se comprueba contra el artefacto original por id/fuente/símbolo/ruta/valor.
