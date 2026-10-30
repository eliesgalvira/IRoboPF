# Comandos y resultados de esta entrega

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-cc935516`:

- `git rev-parse HEAD`: 65cff4fd8eb8c6269c2ce97b88e770aa711bff7f.
- `git diff --stat 65cff4fd8eb8c6269c2ce97b88e770aa711bff7f`: vacío al inicio y al final.
- `git ls-tree -rz BASE`, seguido de Path.lstat para todas las rutas y os.readlink para enlaces: 9.391 entradas, ninguna ausente. Datos en control-base.json. No se reparó índice.
- `rg` no estaba disponible; se utilizó find para enumerar archivos, sin instalar globalmente.

Entorno para todos los comandos corpus:

```sh
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-cc935516/.cache/retenciones-cierre/venv
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2012-2014-cierre/casos.py
```

Resultado real: 34 aserciones; exit 0. `casos.log` conserva salida. No hay comparación contra implementación ni fix.

La adquisición ejecutada fue el mismo wrapper con `tools/procedencia/descargar.py https://www.boe.es/boe/dias/2007/03/31/pdfs/A14097-14149.pdf --root /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-2012-2014-cierre/primarios`. Resultado HTTP200, metadatos saneados, SHA256/SHA512 y tamaño en adquisicion-boe.json. Descargador del proyecto, TLS y UA identificativo, máximo 64 MiB del helper; una adquisición PDF, sin transferencia de preservados. No se publican cookies ni autorizaciones.

Los originales AEAT se abrieron desde las rutas localPath de fuentes-comprobadas.json, resueltas contra `/home/elies/Repos/IRoboPF`. Se cotejaron bytes con hashlib.sha256/sha512 y tamaño antes de abrirlos con PyMuPDF. Render de página completa con `page.get_pixmap(dpi=100).save(...)`; BOE a 130 dpi. Caja, página, texto y versión del renderizador en citas-nuevas.json y cita-boe-art83.json. Extracciones completas de los cuatro PDF solo en scratch. Las llamadas view_image inspeccionaron las doce PNG AEAT y boe-art83.png. No hay inspección de las otras 175 páginas AEAT.

Lint/tipos inicial: `flock ... nix shell nixpkgs#uv nixpkgs#python3 nixpkgs#nodejs -c bash -c 'uv run --with ruff --with pyright ruff check ARCHIVO && uv run --with pyright pyright ARCHIVO'`. Falló por ejecutable dinámico Ruff de wheel incompatible con NixOS; no se ejecutó Pyright en ese intento.

Repetición: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#pyright -c bash -c 'ruff check ARCHIVO && pyright ARCHIVO'`, donde ARCHIVO es el path absoluto anterior de casos.py. Exit 0; Ruff sin diagnósticos, Pyright 0 errores/advertencias. No se modificó el script para evadir controles. Los dos logs permanecen.

El mapa y las matrices se serializaron con un proceso Python bajo el mismo lock; esa generación no evalúa la corrección jurídica ni cuenta como inspección. Matriz-80 conserva objeciones/proposiciones anteriores identificadas y fija todos los cierres como pendientes. No se tocó la matriz original.

El manifiesto excluye su propia autorreferencia y el patch textual. PNG y PDF se integran por archivo y hash. Las rutas son relativas a la raíz del repositorio; `baseSha256: null` identifica un alta respecto de la base indicada.
