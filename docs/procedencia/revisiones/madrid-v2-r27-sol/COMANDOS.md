# Comandos y resultados

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-4c3aaff8`:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-4c3aaff8/.cache/madrid-r27/venv
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/madrid-v2-r27-sol/fisico.py docs/procedencia/revisiones/madrid-v2-r27-sol/inicial.json.gz
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/madrid-v2-r27-sol/revisar.py
flock /tmp/irobopf-validacion-pesada.lock bash docs/procedencia/revisiones/madrid-v2-r27-sol/calidad.sh
flock /tmp/irobopf-recepcion-acotada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/madrid-v2-r27-sol/fisico.py docs/procedencia/revisiones/madrid-v2-r27-sol/final.json.gz
```

El pase inicial usó la misma receta física desde `.cache/madrid-r27/fisico.py`, luego conservada aquí. `inicial.json.gz` registra HEAD/base 1ed8acfdf77dfee5330da0f0131f42956b45206a, 15.730 entradas, cero diferencias y diff vacío. No es una prueba fiscal. El lector carga un solo blob de base por vez y examina disco, tipos/enlaces/modo ejecutable, no el índice solamente.

La revisión usa originales locales existentes, sin descargas. Espera en el lock pesado antes de renderizar; no utiliza el lock de recepción para pruebas. `revision.log` registra la salida real; `casos.json` conserva rechazos de once contextos y del helper real. No hay ensayo de promoción ni coordinador parcheado. Los bloques posteriores de ruta/año/período se inspeccionan estáticamente porque el lector se detiene primero en condiciones editoriales.

Lint y tipos propios: Ruff y mypy en `calidad.sh`; el stub PDF se conserva como frontera limitada del subconjunto de PyMuPDF usado, no garantía completa de una librería dinámica. No se escribe ni ejecuta TypeScript/Effect propio; las 16 severidades anti-slop se cotejan contra la configuración, sin declarar un pase oxlint sobre Python. No procede Next build ni suites legacy masivas.

`empaquetar.py` genera el manifiesto, patch textual gzip y lista de binarios; ensaya su aplicación con `patch` únicamente en scratch propio y coteja todos los bytes reconstruidos. No crea checkout Git/JJ ni hace commits. El recibo de transporte fija hashes/tamaños de los artefactos excluidos de su propio manifiesto por circularidad.
