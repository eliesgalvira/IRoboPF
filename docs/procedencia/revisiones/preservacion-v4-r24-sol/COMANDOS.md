# Reproducción y registros

Checkout T3 /home/elies/.t3/worktrees/IRoboPF/t3-1b749ca4. HEAD 59bb4c8e8dc239823008c02213ea78b59b51d249. Runtime declarado por T3: gpt-6.1-sol, high; prioridad solicitada, sin medición independiente del scheduler. Trabajo personal, sin subdelegar, atestaciones ni VCS mutante.

Se leyeron BRIEF completo, AGENTS, CONTRATO-AUDITORIA, COORDINACION, secciones actuales de ESTADO/DECISIONES, informes técnicos R23 y recepción R21, autoría v4 y recepción R24. La ruta abreviada recepcion-r21-r23/INFORME.md no existe en raíz de procedencia; se leyó correcciones/recepcion-r21-r23/INFORME.md. rg no estaba en PATH; no se instaló globalmente. Git se usó solo para rev-parse, ls-tree, cat-file, status y diff de lectura. No se ejecutó collect.

Todos los Python usan este entorno:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-v4-r24-sol/uv"
```

Cotejo inicial y final, un blob por vez:

```sh
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v4-r24-sol/fisico.py inicio
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v4-r24-sol/fisico.py final
```

Cada ejecución siguiente se hizo con `flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v4-r24-sol/<script>`. Scripts: revisar.py, ataques.py, muestras.py, rojos.py, identidades.py, heredados.py, software.py, reconstruir.py, resumen.py, seleccion.py, faltantes.py. No repetir revisar.py sobre los destinos ya creados: es restauración exclusiva y conserva residuos. Los demás scripts son controles pequeños o lecturas, no ejecutan el software histórico.

revisar.py terminó con código 1 por la operación de extracción equivocada del instrumento después de completar y cotejar restauración, materialización, censo e identidades. restauracion.json y censo.json se escribieron antes de ese error. reconstruir.py reproduce get_textbox según evidencias.py conservado; reconstruccion-final.log confirma textos y PNG exactos. muestras.log conserva el StopIteration inicial por buscar adquisiciones secundarias en el nivel v4; muestras-final.log usa heredado/manifest.json sin cambiar fuentes o expectativas. El primer mypy queda en calidad-inicial.log; solo se corrigieron instrumentos propios. software-final.log/resumen-final.log distinguen identidad fuente y derivado; no se toma el reserializado de schema por cambio de fuente.

rojos.py debe terminar con código 1: cinco fallos protectores deliberadamente conservados. ataques.log registra los nueve adversos del autor sin cambios y los sintéticos propios. heredados.log contiene solo dos casos pertinentes R21, sin repetir la suite completa ajena de 29.

Calidad propia:

```sh
export RUFF_CACHE_DIR="$PWD/.cache/preservacion-v4-r24-sol/ruff"
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check docs/procedencia/revisiones/preservacion-v4-r24-sol/*.py; mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir .cache/preservacion-v4-r24-sol/mypy docs/procedencia/revisiones/preservacion-v4-r24-sol/*.py'
```

Las 16 reglas anti-slop están a error: anti-slop.json. Humo sobre lib/formato.ts intacto con plugins del padre de solo lectura y configuración temporal propia:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config .cache/preservacion-v4-r24-sol/oxlint.json lib/formato.ts
```

No hay TS/Effect nuevo; este humo no verifica Python. Ruff y mypy son del alcance propio; mypy comprueba cuerpos sin exigir anotaciones completas y omite seguimiento de imports. Ninguna prueba legacy masiva, build, servidor, preview, red documental, transferencia externa, gasto, LFS, PR o mutación de confianza.

entrega.py genera patch textual gzip, binarios por ruta/hash y manifiesto relativo con baseSha256 null para archivos nuevos. Excluye del patch manifiesto, índice binario y el propio patch para evitar circularidad; el manifiesto solo se excluye a sí mismo. Los logs y controles mayores de 1 MB se comprimen. Los PDF originales, entornos y paquetes permanecen fuera de docs y Git.
