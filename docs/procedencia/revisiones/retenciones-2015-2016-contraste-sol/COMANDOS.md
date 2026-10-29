# Recetas exactas

Raíz de ejecución: `/home/elies/.t3/worktrees/IRoboPF/t3-99399e12`.

```sh
jj log -r @ --no-graph -T commit_id
# Error: There is no jj repo; no se inicializa.
git rev-parse HEAD
# 7668bdad60a79a8b3ad8e1e1b911f3d6c223692a
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-99399e12/.cache/contraste-s1516/venv bash tools/procedencia/run.sh .cache/contraste-s1516/control.py
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-99399e12/.cache/contraste-s1516/venv bash tools/procedencia/run.sh .cache/contraste-s1516/extraer.py
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-99399e12/.cache/contraste-s1516/venv bash tools/procedencia/run.sh docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/verificar.py
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-99399e12/.cache/contraste-s1516/venv bash tools/procedencia/run.sh .cache/contraste-s1516/primarias.py
flock /tmp/irobopf-validacion-pesada.lock bash .cache/contraste-s1516/validar.sh
```

Los dos scripts originales se copian a scratch sin modificar sus bytes. El intérprete se obtiene con `bash tools/procedencia/run.sh`; `verificar.py` ejecuta luego esos scripts con `sys.executable`, dentro del mismo entorno gestionado. `casos.py` escribe su JSON junto a su copia scratch; nunca sobre el registro histórico. Código0 y207 aserciones; `repro_rojo.py` código1, tres fallos. Los dos scripts nuevos se ejecutan con el mismo wrapper: `casos_propios.py` código0; `repro_nuevos.py` código1, dos fallos esperados contra afirmaciones candidatas. Los logs añaden `exitCode` explícito.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy --command bash -c 'ruff check "$1"/*.py; mypy --strict --ignore-missing-imports --cache-dir "$2" "$1"/*.py' audit /home/elies/.t3/worktrees/IRoboPF/t3-99399e12/docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol /home/elies/.t3/worktrees/IRoboPF/t3-99399e12/.cache/contraste-s1516/mypy
```

`--ignore-missing-imports` permite el módulo PyMuPDF sin stubs en el intérprete aislado de mypy. No demuestra tipos internos de esa biblioteca; los documentos se verifican en ejecución en el entorno fijado del proyecto. No se deshabilitan reglas de aplicación o anti-slop. No hay fuentes TS/Effect propias que comprobar con oxlint. Las16 reglas existentes se verifican comoerror desde `.oxlintrc.json` en `verificar.py`. No se atribuye lint de Python aoxlint.

Render independiente C01: PyMuPDF1.26.7/MuPDF1.26.12, página16 física, clip `[50,535,560,650]`, matrix3, alphaFalse, `get_pixmap(...).tobytes('png')`. El archivo de imagen se nombraSHA256.png. El texto de las140 citas se reextrae con `page.get_text(sort=True)`; comparar quitando solo salto final, no normalizar números o signos. Los renders se regeneran a1.1 conalphaFalse, comparandoPNG completo. Las lecturas de tablas usan `sort=False`, conservadas por separado para no atribuir secuencia de columnas a `sort=True`.

Controles de cierre: `git ls-tree -rz --full-tree HEAD`, `lstat/readlink`, comparación de todos los blobs con discos; `git diff --name-status BASE HEAD` y filtroD, además de `git diff HEAD --` para detectar cambios sobre base actual. El índice no se altera. Control y diff completos comprimidos; manifiesto sin autorreferencia. El patch textual puede contener logs de fallos esperados: no aplicar como corrección al producto.

Los auxiliares de scratch usados se conservan como `control.py.txt`, `extraer.py.txt`, `primarias.py.txt` y `decidir.py.txt`, sin fuentes de aplicación ni entornos. Para repetir, copiar esos cuatro archivos a `.cache/contraste-s1516/` quitando solo el sufijo `.txt`, desde esta misma raíz. El verificador mantenido genera además sus propios textos y recortes antes de comprobarlos; los ensayos nuevos se ejecutan después. Los auxiliares son testimonio de sesión; el lint/tipos propio se declara sobre los tres `.py` mantenidos, sin atribuirles chequeo de aplicación.
