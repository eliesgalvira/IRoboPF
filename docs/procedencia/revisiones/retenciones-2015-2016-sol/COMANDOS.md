# Reproducción y controles

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-e16eb2bc`, Git exclusivamente lectura: `git rev-parse HEAD`, `git status --short`, `git diff --stat 1ec684b4e4408068282febf1319c12c6ac8a15c1`, `git ls-tree -rz BASE`. El script inicial recorrió cada entrada con `os.lstat`; enlaces con `os.readlink`, sin seguirlos para decidir presencia.10583 entradas y tres enlaces existentes, cero ausencias, diff vacío.

rg y python3 faltaban en PATH inicial. Para las búsquedas pequeñas se utilizó grep/find; Python se obtuvo mediante Nix y el wrapper fijado del proyecto. Ninguna instalación global ni alteración del lock de dependencias. No se ejecutó Effect ni se escribióTS.

## Aserciones

```sh
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-e16eb2bc/.cache/retenciones-sol/venv bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-sol/casos.py
```

`casos.log` conserva el primer pase188; `casos-final.log` corresponde a la ampliación de trazas iniciales e irregularidad. No sumar los pases. Cada entrada de `casos-resultados.json` se añade solo después de una aserción real. Varias aserciones son controles de dominio/subpaso, no casos fiscales completos ni comparaciones con el servicioAEAT.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python3 /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-sol/repro_rojo.py
```

Salida esperada del ensayo de literalidad: tres fallos y código1. El log conservado se ejecutó desde el mismo script en scratch, antes de copiarlo a la entrega; no se cambió la expectativa para conseguir verde. No hay fix en esta ronda. No equivale a tres fallos del motor actual, que no se llama.

## Calidad del Python mantenido

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-sol/casos.py /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-sol/repro_rojo.py && mypy --strict --cache-dir /home/elies/.t3/worktrees/IRoboPF/t3-e16eb2bc/.cache/retenciones-sol/mypy /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-sol/casos.py /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2015-2016-sol/repro_rojo.py'
```

`lint-tipos.log`: Ruff correcto y cuatro diagnósticos de tipos. `lint-tipos-final.log`: pase después de renombrar variables locales de tipos diferentes. No se relajaron reglas ni expectativas. Las16 reglasanti-slop se cotejan aerror en la configuración; no se atribuye ejecuciónoxlint aPython ni un typecheckglobal de la aplicación.

## Adquisición y geometría

Se usó Python urllib conTLS, User-Agent `IRoboPF-auditoria-documental/1.0 (revision retenciones 2015-2016)`, timeout40s, límite25MB porrespuesta, pausa2s entre peticiones y descarga secuencial bajo el mismoflock. Los metadatos solo conservan Content-Type, Content-Length, ETag y Last-Modified además deURL/estado/fecha; nunca Cookie/Authorization. `archivo-busquedas.json` conserva CDX y errores404, sin convertirlos en demostración de inexistencia.

Cada original nuevo está en `fuentes/SHA256`, también SHA512 ysize en adquisiciones. Los tres algoritmos y otros primarios anteriores se leen enCAS delpadre; `originales.json` y `integridad-19.json` conservan sus rutas yhashes.

Facsímiles de algoritmos: PyMuPDF1.26.7/MuPDF1.26.12, página física1-based, `page.get_pixmap(matrix=fitz.Matrix(1.1,1.1), alpha=False)`, PNG. Citasjurídicas nuevas: matrix1.2, alphaFalse. Coordenadas PDF en puntos, origen superiorizquierdo. Página completa para preservar tachados ycontexto; no afirmar selección fina de cada celda. El SHA256 del PNG da su nombre. Texto de página: `page.get_text(sort=True)` enalgoritmos; citasjurídicas declaran su extracción sinordenación. NoOCR ni saneamiento de signos/glifos numéricos.

Los scripts auxiliares de adquisición/generación permanecen en caché propia; esta receta, hashes y selectores permiten regenerar desde originales. No se copian fuentes delproducto, tsconfig, entornos o node_modules a la documentación. El manifiesto final excluye autorreferencias y caches; altas textuales enpatch y binariosporhash.

No Nextbuild, suitelegacy completa, render de servidor, transferenciaexterna, gasto ni operaciónVCSmutante. El controlfinal vuelve a comprobar presencia de base y diff, sin tocar índices.
