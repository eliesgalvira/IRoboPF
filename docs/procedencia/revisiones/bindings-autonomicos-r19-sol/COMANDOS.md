# Comandos ejecutados y códigos

Directorio: `/home/elies/.t3/worktrees/IRoboPF/t3-918d8d05`. Todos los comandos Python siguientes llevan `PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/bindings-autonomicos-r19-sol/venv"` y se ejecutan mediante `flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh`. No se instala un entorno en tools/procedencia/.venv.

- `git rev-parse HEAD`: 0, base exacta7668bdad60a79a8b3ad8e1e1b911f3d6c223692a.
- `jj log -r @ --no-graph`: no hay repositorio JJ; se conserva la prohibición de inicializarlo. Comprobaciones Git exclusivamente de lectura.
- `... "$PWD/docs/procedencia/revisiones/bindings-autonomicos-r19-sol/revisar.py"`: 1, `revision.log`; error propio de igualdad del objeto source.
- `... "$PWD/docs/procedencia/revisiones/bindings-autonomicos-r19-sol/revisar.py"`: 0, `revision-final.log`;186 payloads,94 citas,94 selecciones,9 recortes,36 temporales,2796 adversos.
- `... "$PWD/docs/procedencia/revisiones/bindings-autonomicos-r19-sol/historico.py"`: 1, `historico.log`; base equivocada para localizadores históricos.
- Repetición corregida del mismo comando: 0, `historico-final.log`; ambas recetas fijadas y186 localizadores cotejados.
- `... "$PWD/docs/procedencia/revisiones/bindings-autonomicos-r19-sol/revisar.py" --tree`: 0, `arbol.log`;13422 blobs físicos, sin diferencias ni borrados. Invoca `git ls-tree -rz BASE` y `git cat-file blob OID`; cada ruta pasa lstat y cada enlace readlink.
- `... "$PWD/docs/procedencia/revisiones/bindings-autonomicos-r19-sol/complementos.py"`: 0, `complementos.log`;11 HTML reabiertos,317 decisiones previas conservadas,16 reglas a error y frontera Decimal propia.
- `... -` con programa inline de reapertura HTML: 0, `lectura-primarias.log` y `cadena-extractos.log`. Los hashes/rutas literales están en cadenas-originales.json; lecturas originales conservadas en scratch. Se distinguen rúbricas correctoras y referencias a artículos de otras leyes.
- `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy --command bash -c 'ruff check docs/procedencia/revisiones/bindings-autonomicos-r19-sol/*.py; mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir .cache/bindings-autonomicos-r19-sol/mypy docs/procedencia/revisiones/bindings-autonomicos-r19-sol/*.py'`: 1, `calidad-inicial.log`; Ruff correcto, un diagnóstico de captura de variable Path en mypy.
- Mismo comando de calidad con `&&` entre Ruff y mypy: 0, `calidad-final.log`; cuatro fuentes correctas.

Para reproducir el cierre, ejecutar el control --tree, después empaquetar.py mediante el mismo prefijo Nix/uv/lock. El empaquetador exige186 hashes distintos, valida cada atestación contra binding-attestation.schema.json, genera el patch gzip y manifiesto sin autorreferencia, y comprueba que el informe no ha cambiado al terminar. El informe no se modifica después de fijar su hash. El transporte fija su hash y el del manifiesto y patch.

El ensayo adicional de las atestaciones usa DocumentaryReadSet real, sin modificar revisores.json ni registro.json; su log `puerta-real.log` identifica el rechazo por falta de registro real. Los registros sintéticos no se usan para declarar aceptación.
