# Comandos y fronteras de la revisión

Checkout `/home/elies/.t3/worktrees/IRoboPF/t3-ad56e1f7`; HEAD exigido `5e69c68077ffd18be20457160595adb3f0ff52e4`.

Variables para todo Python gestionado:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-ad56e1f7/.cache/revision-v5-r28/venv
```

Recepción: `flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#python3 -c python3 .cache/revision-v5-r28/fisico.py`. Lee cada blob de HEAD por separado y contrasta lstat, readlink, bytes y ejecutabilidad. Se conservan inicio y final comprimidos. `git diff HEAD` y `git diff --cached HEAD` son controles adicionales, nunca sustitutos.

Restauración nueva: `flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/revision-v5-r28/restaurar.py`. Solo lee el paquete entregado fuera de T3, verifica el pin externo y llama a transfer hacia un destino nuevo propio. Materializa las dependencias de herramientas por path y coteja las 21 entradas software. El enlace propio paquete-v5 apunta exclusivamente al paquete recibido para la comparación física que exige recuperar2; no es un fallback de originales.

Después se usa exclusivamente el runner materializado:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash .cache/revision-v5-r28/software-restaurado/tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v5-r28-sol/recuperacion.py
flock /tmp/irobopf-validacion-pesada.lock bash .cache/revision-v5-r28/software-restaurado/tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v5-r28-sol/casos.py
flock /tmp/irobopf-validacion-pesada.lock bash .cache/revision-v5-r28/software-restaurado/tools/procedencia/run.sh docs/procedencia/revisiones/preservacion-v5-r28-sol/censo_receta.py
```

No se ejecutan recolectores ni inicializadores históricos de tests: censo_receta reconstruye la transformación del manifiesto en memoria, y lee un fragmento por vez. Recuperación ejecuta recuperar2 y selector_ine exactos; el suplemento de índice/HTML es una comprobación escrita por este revisor sobre las dependencias restauradas. Los imports efectivos del proyecto deben quedar dentro de software-restaurado; Nix y las bibliotecas Python son dependencias de entorno explícitas.

Los casos sintéticos viven únicamente en .cache/revision-v5-r28/casos. Un esperado incumplido permanece en casos.json; su etiqueta residual-conocido no lo convierte en pase ni acredita secretos reales. No se ejecutan suites legacy ni Next build. No hay código Effect/TS nuevo. Ruff y mypy se aplican a las fuentes propias; oxlint es solo humo sobre una fuente TS intacta y carga de las 16 reglas a error, no lint de Python.

Los scripts de restauración, controles físicos y entrega se conservan como fuentes para contrastar las conclusiones.
