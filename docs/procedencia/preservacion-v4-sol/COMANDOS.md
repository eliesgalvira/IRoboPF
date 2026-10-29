# Reproducción y límites operativos

Desde el checkout de base 960773f909d4ecff290edfa3d7a7b2699a8445d3 más esta entrega. No ejecutar collect de v3. Ningún comando VCS de esta entrega muta el repositorio. Git solo se usa para leer HEAD, árbol, blobs y diff, porque este checkout pertenece a T3.

Entorno usado:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-v4-sol/uv"
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v4-sol/edicion.py collect
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v4-sol/cobertura.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v4-sol/adversos.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v4-sol/heredados.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'export RUFF_CACHE_DIR="$PWD/.cache/preservacion-v4-sol/ruff"; ruff check docs/procedencia/preservacion-v4-sol/*.py && mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir .cache/preservacion-v4-sol/mypy docs/procedencia/preservacion-v4-sol/*.py'
```

collect necesita el paquete padre y CAS entregados, todos de solo lectura. Cada ejecución crea otra recepción, nunca modifica una anterior. El primer intento falló por JSON con claves repetidas; permanece su log y la recepción parcial. Una colección intermedia pudo ejecutarse mientras se terminaban instrumentos; solo el manifiesto externo final y su pin constituyen esta entrega.

paquete.py fija el JSON del corte como manifest-cierre.json.gz y PIN-CIERRE.json. El SHA256 requerido por el consumidor corresponde al JSON descomprimido; PIN-CIERRE.json incluye también ambas huellas de la compresión. No aceptar el pin porque venga dentro de un paquete recibido: debe contrastarlo el revisor por el canal editorial independiente.

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v4-sol/paquete.py
```

paquete.py crea destinos exclusivos .cache/preservacion-v4-sol/paquete-v4-final y restauracion-v4-final. No se repite sobre esos destinos. Para otro ensayo, usar edicion.py transfer con source, destination, manifest externo descomprimido y pin explícitos, en una ruta nueva. verify y confirm son repetibles; no cambian expectativas ni reparan blobs. Tras error de durabilidad conservar bytes y confirmar después de resolver el problema del filesystem.

materializar.py recibe --package, --destination inexistente, --manifest externo y --pin. Copia las dependencias por sus rutas y verifica ambos hashes/tamaño; no ejecuta código histórico. Las actuales se reconstruyen con metadatos saneados y las históricas bajo heredado/. sourceSha256/sourceSha512/sourceSize permiten cotejar el original del corte; sha256/sha512/size identifican lo efectivamente transportado. Los originales y PNG están en sha256/; citas y recetas los enlazan por hash. Los localizadores absolutos omitidos no son necesarios para resolver esos bytes. Para rerenderizar hay que seleccionar la cita y resolver su hash en este CAS, conservando engine/version/DPI/matriz/caja declarados; esta entrega no afirma haber vuelto a renderizar todos los recortes.

Los controles heredados conservan las expectativas de diez adversos R21 y diecinueve pruebas del transporte anterior. Solo se cambia mediante inyección la raíz temporal para que todas las escrituras queden en caché propia; se conservan residuos. No se corrigen fuentes históricas ni se vuelven a ejecutar colectores antiguos.

Oxlint usa --threads=1 --disable-nested-config. El primer intento no resolvía @oxlint/plugins desde el checkout sin node_modules. La configuración temporal conserva las dieciséis severidades a error y resuelve los plugins idénticos desde el padre, solo lectura. No hay TS/Effect nuevo; no se atribuye a oxlint el tipado de Python. No se ejecutan Next build, suites legacy masivas ni servidores.

El corte final incluye el índice de citas de24.110.694 bytes de retenciones2020–2026. El límite de lectura es64MiB y no excluye ningún metadato por tamaño en este corte. Los paquetes y pins anteriores permanecen como ensayos intermedios; usar únicamente PIN-CIERRE.json para la entrega definitiva.
