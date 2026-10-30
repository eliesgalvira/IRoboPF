# Reproducción y resultados

Ejecutar desde `/home/elies/.t3/worktrees/IRoboPF/t3-6e7aee17`, base `5799bb03826719a4dd3500a962e2d6bb5124fdca`. Los scripts fijan esa base de lectura, la caché de originales del padre y la carpeta autorizada de entrega. Para reproducir en otra ubicación deben adaptarse esas rutas explícitas; los hashes identifican el contenido exigido. No requieren copiar fuentes, tsconfig ni node_modules al directorio publicable.

```sh
git rev-parse HEAD
sha256sum docs/procedencia/inventario.json docs/procedencia/inventario-datos.json.gz
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-6e7aee17/.cache/revision-retenciones/venv bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016/verificar.py
flock /tmp/irobopf-validacion-pesada.lock env UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-6e7aee17/.cache/revision-retenciones/venv bash tools/procedencia/run.sh /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016/casos.py
```

El primer caso de verificación y generación Decimal se ejecutó desde la copia del script propio en scratch; la verificación final usa el script entregado tras corregir la anotación inferida por Pyright. Los outputs no se suman: 19 originales, 191 citas/renders, cero fallos. Decimal: 133 escenarios y cinco aserciones de control, sin motor.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#pyright nixpkgs#nodejs -c bash -c 'ruff check /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016/casos.py /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016/verificar.py && pyright --pythonpath /home/elies/.t3/worktrees/IRoboPF/t3-6e7aee17/.cache/revision-retenciones/venv/bin/python /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016/casos.py /home/elies/Repos/IRoboPF/docs/procedencia/revisiones/retenciones-originales-2012-2016/verificar.py'
```

Ruff: correcto. Pyright inicial: un error de stubs por enumerate(Document). Pyright final: cero errores y advertencias, sustituyendo iteración por índices, sin supresiones. El log inicial permanece. Los entornos de evidencia usan flake/uv.lock del proyecto sin cambiarlos; las utilidades Ruff/Pyright se resolvieron mediante Nix, sin instalación global. No se ejecutó oxlint contra Python ni se rebautizaron scripts para evitar reglas. Las 16 severidades de la configuración anti-slop se verificaron mediante lectura JSON y aserciones.

Render adicional: PyMuPDF 1.26.7, página física 34 de `e0f7f92d96c6…`, 140 dpi, RGB, sin alpha ni recorte. Se ejecutó con el wrapper y lock común, un trabajador. El facsímil original a 72 dpi permanece inalterado. La copia ampliada incluida se fija en el manifiesto.

Las consultas web incluyeron `site.agenciatributaria.es "2016" "22/12/2015" algoritmo`, `site.agenciatributaria.es "2015" "14/07/2015" algoritmo`, `"retenciones" "2016" "22/12/2015" "Especificaciones"` y `"retenciones" "14/07/2015" "corregido"`; también se abrieron fichas BOE de Ley 22/2013 y RD 633/2015. No se descargó nuevo CAS. La búsqueda no es exhaustiva ni demuestra ausencia de revisiones.

El control de base comprueba la presencia de las 8456 entradas, sin ausencias. Este control no sustituye un cotejo de todos los bytes contra la base. Scratch y logs permanecen conservados.
