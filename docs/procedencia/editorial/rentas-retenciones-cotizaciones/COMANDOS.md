# Comandos y códigos de salida

Receta histórica de validación: Bun de Nix 1.3.13 y Python del entorno fijado 3.13.15. Ejecutar desde la raíz de la base documentada en el informe, con un trabajador y el bloqueo común.

## Reproducción de la entrega final

```sh
UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-98a20b70/.cache/editorial-b/venv flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/rentas-retenciones-cotizaciones/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff --command ruff check docs/procedencia/editorial/rentas-retenciones-cotizaciones/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy --command mypy --follow-untyped-imports --python-executable /home/elies/.t3/worktrees/IRoboPF/t3-98a20b70/.cache/editorial-b/venv/bin/python --cache-dir .cache/editorial-b/mypy docs/procedencia/editorial/rentas-retenciones-cotizaciones/verificar.py
```

Códigos finales y métricas: resultado-pruebas.json, pruebas-final.log y lint-tipos-final.log. El verificador vuelve a extraer el texto de todas las páginas, reproduce todos los PNG con la misma receta, coteja ambos hashes de los originales y verifica la identidad de todas las ocurrencias enlazadas frente al artefacto. 

## Preparación realizada

La muestra visual identificada comprende tres páginas oficiales: `7393a032cbcb-p11`, `0236d8d10472-p23` y `73e5f7ae8b2c-p8`. Ver `inspeccionPersonal` en `citas.json`. La regeneración de los demás PNG no acredita su inspección visual.

Las16 reglas anti-slop siguen a error en .oxlintrc.json. No hay TypeScript/Effect nuevo; no se presenta un lint de archivos Python ignorados por oxlint como prueba anti-slop del producto. El chequeo de configuración y la invocación con --disable-nested-config se registran aparte. No se usa extensión/ignore nuevo para eludir reglas.

No se ejecutaron suites del motor, Next build, servidores ni render visual del producto. Los casos racionales son oracles aritméticos propios de la autoría candidata, no resultados fiscales aceptados ni pruebas de hechos personales.

El conjunto final incluye el original Ley39/2010 p60 para acreditar directamente4080/9180/13260 de2012–2014. `anadir-historica.py` termina0; no marca inspección personal. El pase final incorpora **15 originales,69 páginas,15PNG,195 hojas y54 casos**, con ambos esquemas cerrados validados. El esquema de hojas también se comprueba contra el artefacto original por id/fuente/símbolo/ruta/valor.
