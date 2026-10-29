# Reproducción acotada

Raíz: `/home/elies/.t3/worktrees/IRoboPF/t3-0e2aff8f`; HEAD/base `960773f909d4ecff290edfa3d7a7b2699a8445d3`.

```bash
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/rectificaciones-r21/venv"
export PYTHONDONTWRITEBYTECODE=1
out=docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol
git rev-parse HEAD
git diff --name-status 960773f909d4ecff290edfa3d7a7b2699a8445d3
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/control.py" inicial
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/evidencia.py"
bash tools/procedencia/run.sh "$out/lectura.py"
bash tools/procedencia/run.sh "$out/dictaminar.py"
bash tools/procedencia/run.sh "$out/hash_fragmento.py"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/casos.py"
flock /tmp/irobopf-validacion-pesada.lock bash "$out/validar.sh"
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh "$out/control.py" final
bash tools/procedencia/run.sh "$out/empaquetar.py"
```

El controlfinal usa la excepción de recepción acotada: unblob cada vez, sin renders/pruebas/tipos dentro de ese lock. El inicial usó el pesado. Los trabajos se encolan cuando otros procesos tienen el lock; no se elude.

`evidencia.py` solo escribe aquí. Ejecuta el rojo histórico original sin modificar bytes; inspección previa de ese script confirma que unittest no escribe artefactos. Su salida permanece roja, código1. Los tresPNG regenerados se abrieron con view_image individualmente. Los textos derivados no son facsímiles ni transcripciones normativas certificadas.

`rojos.py` conserva un rojo documental por asignación literal en tres subcasos. Se exige código1 en el runner. La ambigüedad de precedencia y la receta del hash de sección son reservas argumentadas, sin tests que fabriquen un esperado mediante una frase obligatoria. `casos.py` solo ejercita subpasos conDecimal/Fraction, no el motor ni servicioAEAT.

Calidad propia: Ruff y mypy `--check-untyped-defs --follow-untyped-imports`; caché absoluta propia. El segundo activa comprobación de cuerpos no anotados y siguePyMuPDF, pero no equivale a tipado estricto integral ni acredita tipos internos de terceros. No se suprime un falloPython mediante lintTS. Los logs registran diagnósticos y códigos. No hay fuenteTS/Effect nueva que pasar poroxlint; `dictaminar.py` verifica las16 severidades anti-slop. No se ejecutan build, suites legacy ni servidor.

La herramienta rg faltaba en el shell inicial; no se instaló globalmente ni se sustituyó VCS. Todos los intérpretes/dependencias Python se obtienen por el wrapperNix/uv fijado. No hay mutaciones deGit/JJ: ls-tree,cat-file,rev-parse,diff son lecturas. El patch lo construye difflib desde los bytes base y entregados, sin índice.

El manifiesto cubre todos los archivos de contenido en esta carpeta; `binarios.json` y `entrega.patch.gz` son transporte, y `manifiesto.json` es índice sin autorreferencia. `entrega.json` conserva hashes de esos tres artefactos de transporte y se excluye de sí mismo. Integrar por archivos relativos/base/hash, rechazando cualquier borrado o ruta ajena. CAS fuente del padre no forma parte de la copia de código.

Pase inicial `calidad.log`: Ruff correcto, mypy rojo por dos inferencias propias y búsqueda de fitz desde intérprete ajeno. Se conservaron los tres diagnósticos. Se añadieron anotaciones de contenedores propios y se fijó `--python-executable` al entorno absoluto ya creado; no se usa ignore-missing-imports. Repetición:

```bash
flock /tmp/irobopf-validacion-pesada.lock bash "$out/calidad-final.sh"
```

Se comprueba el Python mantenido de la entrega, incluidos empaquetado y controles; no se presenta como mypyestricto. Tras esta edición final del empaquetador se repite el mismo control para fijar sus bytes finales. Los rojos documentales no se corrigen ni se incluyen entre los defectos de tipado propio.

`cadena.py` relee desdeCAS, verificando ambos hashes, las páginas concretasRD1003 pp8/9/14/15, RD633 pp23/24/27 yRDL9 p11; guarda sus textos con numeración física. No se renderizan documentos completos. Para repetir:

```bash
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$out/cadena.py"
bash tools/procedencia/run.sh "$out/empaquetar.py"
bash tools/procedencia/run.sh "$out/verificar_entrega.py"
gzip -dc "$out/entrega.patch.gz" | git apply --stat
```

La última orden solo analiza el patch; no aplica cambios ni toca el índice.
