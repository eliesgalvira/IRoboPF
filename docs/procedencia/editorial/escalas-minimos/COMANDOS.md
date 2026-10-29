# Comandos de reproducción

Desde la raíz de la base1196269d4e73742beeed35cc05011b70c21a0b69:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/escalas-minimos/venv"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/escalas-minimos/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c ruff check docs/procedencia/editorial/escalas-minimos/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --ignore-missing-imports --check-untyped-defs docs/procedencia/editorial/escalas-minimos/verificar.py
```

El primer comando reextrae y coteja originales locales por hash. No necesita red. El entorno fijado de tools/procedencia contiene PyMuPDF1.26.7 y jsonschema4.25.1. Las herramientas de calidad proceden de Nix; los logs indican las ejecuciones reales y sus códigos, no una promesa de pase.

La autoría se preparó en `.cache/escalas-minimos/textos.py` y el ensamblado temporal en `armar.py`, `ampliar.py`, `cerrar-contenido.py`; no se entregan como generador del producto. Las fichas y los JSON completos son la entrega revisable. `armar.log` conserva el primer error de lectura gzip; `armar-2.log` el pase corregido. La entrega no necesita repetir esos instrumentos para validar sus referencias.

Comprobación inicial: `git rev-parse HEAD`, `git status --porcelain=v1`, `git ls-tree -rz HEAD`, `git cat-file blob <oid>`; cotejo con `os.lstat` y `os.readlink`, una entrada tras otra. El control final repite los bytes de las11.181 entradas y comprueba diff sin borrados. Son comandos VCS de lectura; no hay init, reset, commit, bookmark, push o PR.

El manifiesto excluye su propia autorreferencia y el patch. El patch comprimido contiene altas textuales; `binarios.json` fija las altas binarias por ruta/hash/tamaño. Se integran solo las rutas de esta carpeta después de comparar la base. No incluye caché ni entorno UV.
