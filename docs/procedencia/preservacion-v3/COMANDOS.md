# Reproducción local

Desde la raíz de este checkout. No ejecutar `collect` para sustituir un manifiesto ya revisado: una nueva colección debe hacerse en otra entrega y fijarse de nuevo. El script solo escribe sus resultados en su carpeta; .cache propia conserva entornos y adversos. `export`/`restore` rechazan un destino existente incluso si parece incompleto. Nunca borrar el paquete para repetir.

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/preservacion-v3/uv"
export PYTHONDONTWRITEBYTECODE=1
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/recolector.py collect
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/cobertura.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/ensayo.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh tests/procedencia-preservacion_test.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check docs/procedencia/preservacion-v3/*.py && mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs --cache-dir .cache/preservacion-v3/mypy docs/procedencia/preservacion-v3/*.py'
```

Comandos realmente ejecutados para las copias (destinos entonces inexistentes):

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/recolector.py export --destination /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/paquete-v3
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/recolector.py verify --destination /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/paquete-v3
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/recolector.py restore --source /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/paquete-v3 --destination /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/restauracion-v3
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/preservacion-v3/recolector.py confirm --destination /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/restauracion-v3
```

La sesión agrupó estos comandos bajo un único flock en `.cache/preservacion-v3/exportar.sh`; resultado en transferencia.log. `verify` y `confirm` pueden repetirse sin alterar objetos. Confirmar exige los dos manifiestos exactos de esta entrega, externos al destino. Fijar sus hashes antes de trasladar. Un marcador presente tras error no prueba durabilidad: diagnosticar el almacenamiento y ejecutar confirm, nunca borrar ni sobrescribir para ocultar el fallo.

El sobre es preparación local. No hay uploader ni orden de transferencia; no se añaden punteros LFS porque el anexo amplía el contrato y Elies no autorizó carga. El script usa preservacion.py, preservacion_urls.py y preservacion.schema.json actuales, que deben mantenerse junto con el repositorio y su entorno Nix/uv.
