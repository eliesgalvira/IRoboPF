# Comandos de la corrección documental R22

Directorio: `/home/elies/Repos/IRoboPF`. Los cotejos de recepción se ejecutaron bajo `flock /tmp/irobopf-recepcion-acotada.lock`, leyendo un blob cada vez. No se empleó ese bloqueo para pruebas.

Rojo independiente anterior a la corrección, conservado en `rojo-reproducido.log`:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol/rojos.py
```

Generación documental con biblioteca estándar; no modifica el motor:

```sh
nix shell nixpkgs#python3 -c python docs/procedencia/correcciones/retenciones-2015-2016-r22/precisar.py
```

Contraste de las mismas fronteras con la edición anterior, log `rojo-contraste-r21.log`:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python docs/procedencia/correcciones/retenciones-2015-2016-r22/contraste.py --edition docs/procedencia/correcciones/retenciones-2015-2016-r21 Contraste.test_techo_no_eleva_un_tipo_inferior Contraste.test_minimo_satisfecho_se_conserva_en_el_dominio_acotado
```

Edición nueva, log `verde-contraste-r22.log`:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python docs/procedencia/correcciones/retenciones-2015-2016-r22/contraste.py
```

Calidad del código propio, logs `ruff.log` y `mypy.log`:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check docs/procedencia/correcciones/retenciones-2015-2016-r22/precisar.py docs/procedencia/correcciones/retenciones-2015-2016-r22/contraste.py
UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv PYTHONDONTWRITEBYTECODE=1 flock /tmp/irobopf-validacion-pesada.lock nix develop path:tools/procedencia --command bash -c 'uv run --project tools/procedencia --frozen --with mypy python -m mypy --follow-imports=silent --check-untyped-defs docs/procedencia/correcciones/retenciones-2015-2016-r22/precisar.py docs/procedencia/correcciones/retenciones-2015-2016-r22/contraste.py'
```

Resultados finales: rojo independiente código1 con tres subcasos fallidos; contraste numérico R21 código1 con doce subcasos fallidos; contraste R22 código0, tres métodos correctos; Ruff código0; mypy código0, dos scripts sin incidencias. Las esperas del bloqueo no se contaron como controles ejecutados.
