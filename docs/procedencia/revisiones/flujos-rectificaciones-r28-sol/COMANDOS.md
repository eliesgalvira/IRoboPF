# Comandos y alcance

Raíz: `/home/elies/.t3/worktrees/IRoboPF/t3-0f096d05`. Herramientas por Nix; dependencias JS del padre solo en lectura mediante rutas absolutas. No se crea enlace node_modules ni se instala software global. Python usa uv; entorno absoluto propio y PYTHONDONTWRITEBYTECODE=1. Un solo proceso de validación adquiere el bloqueo pesado por cada lote y lo libera antes de redactar o consultar resultados.

```sh
git rev-parse HEAD
git diff --stat
git diff --cached --stat
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-0f096d05/.cache/flujos-review/venv flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#uv nixpkgs#python3 -c uv run --no-project python .cache/flujos-review/fisico.py .cache/flujos-review/recepcion.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/revisar.mjs
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-0f096d05/.cache/flujos-review/venv flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/transporte.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node /home/elies/Repos/IRoboPF/node_modules/typescript/bin/tsc -p docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/tsconfig.json
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun -c /home/elies/Repos/IRoboPF/node_modules/.bin/oxlint --threads=1 --disable-nested-config --config docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/oxlint.json docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/revisar.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff -c ruff check docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/transporte.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --check-untyped-defs --follow-imports=skip --ignore-missing-imports --cache-dir /home/elies/.t3/worktrees/IRoboPF/t3-0f096d05/.cache/flujos-review/mypy docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/transporte.py
```

Las llamadas reales agrupan los checks serialmente en `.cache/flujos-review/validar.sh`, dentro de una adquisición del lock, sin anidarlo. No se mantiene durante espera de API ni redacción. Los códigos están en RESULTADOS.json. Mypy permite fronteras JSON dinámicas: no equivale a tipado estricto de todos los contratos. TypeScript usa checkJs, sin noImplicitAny. Las 16 reglas anti-slop se fijan a error; no se rebajan para obtener un pase. No hay código Effect nuevo, Next build ni suites legacy.

El reproductor ajeno se ejecuta en copia `.cache/flujos-review/rectificar.mjs`; `adaptacion-padre.patch` conserva sus dos diferencias: destino scratch y resolución absoluta del módulo TypeScript. Fases antes/corregir con Node; antes exige código 1 y recibo con los casos, después exige 0 y comparación byte a byte de antes.json, rectificaciones.json y los cuatro gzip con las salidas recibidas. Ningún esperado ni rojo recibido se reescribe.

El transporte independiente reconstituye los cuatro artefactos desde originales y sustituciones exactas, valida hashes/tamaño/bytes JSON, tres schemas y ausencia de otros cambios. La igualdad de ambas representaciones la comprueba el instrumento AST propio. Los ensayos se conservan en scratch propio explícito, sin confianza operativa.

Ruff y mypy finales se ejecutan sobre `docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/*.py`, incluidos los auxiliares de cotejo y entrega. Ambos retornan 0. Se conserva mypy-inicial.log (ocho errores propios), sin alterar esperados recibidos.

Cotejo final con fisico.py hacia integridad-final.json.gz, bajo el bloqueo de recepción acotada. Empaquetado y ensayo con entregar.py mediante tools/procedencia/run.sh y `nixpkgs#patch`, bajo el bloqueo pesado. La receta de patch crea únicamente la carpeta propia en un directorio scratch nuevo; no constituye un checkout. MANIFIESTO.json lista el payload (rutas relativas, SHA256, tamaño, ejecutabilidad y baseSha256 null para adiciones); ENTREGA.json fija hashes del manifiesto, patch y catálogo binario y declara la exclusión inevitable de su propio hash. El padre debe fijar ese sobre al recibir. BINARIOS.json enumera cada gzip por ruta/hash; sus bytes acompañan al patch textual gzip, sin incrustar originales fiscales.

Corrección de higiene: Ruff final lleva `--cache-dir /home/elies/.t3/worktrees/IRoboPF/t3-0f096d05/.cache/flujos-review/ruff`. El intento anterior y la caché generada se conservan; integridad-final-intento1.json.gz registra esa incidencia. El ensayo de entrega definitivo usa `.cache/flujos-review/ensayo-transporte-r2`, manteniendo el fallido. El catálogo BINARIOS incluye también archivos vacíos, porque el diff vacío no los crea.
