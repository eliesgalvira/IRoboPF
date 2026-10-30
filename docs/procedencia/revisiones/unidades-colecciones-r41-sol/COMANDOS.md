# Reproducción desde la raíz de este checkout

Herramientas por `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#ripgrep`; Python estándar por `nix shell nixpkgs#python3` y `uv run --no-project --python python3`, PYTHONDONTWRITEBYTECODE=1, UV_PROJECT_ENVIRONMENT absoluto bajo scratch propio. Schema añade `--with jsonschema`. No pip ni instalación global. Los instrumentos .txt son copias exactas de los ejecutados; reubicarlos en el scratch asignado antes de ejecutarlos. Los scripts usan process.cwd()/Path.cwd() como raíz.

- `flock /tmp/irobopf-validacion-pesada.lock bun .cache/revision-unidades-colecciones-r41-sol/revisar.mjs`: 13 grupos correctos, 17 mutaciones rechazadas y contextos de todos los ceros. Antes: 16 rojos; después: cero.
- `flock /tmp/irobopf-validacion-pesada.lock env NODE_PATH=/home/elies/Repos/IRoboPF/node_modules bun .cache/revision-unidades-colecciones-r41-sol/casos.mjs`: racionales/TS y runtime correctos; 24 contrapruebas de selector; 41 controles rentas repetidos. Bandas por índice/lado correctas.
- `flock /tmp/irobopf-validacion-pesada.lock /home/elies/Repos/IRoboPF/node_modules/.bin/vitest run --config .cache/revision-unidades-colecciones-r41-sol/vitest.config.mjs --configLoader native --maxWorkers 1 --cache false`: 4 archivos/78 pruebas correctos.
- `flock /tmp/irobopf-validacion-pesada.lock bun .cache/revision-unidades-colecciones-r41-sol/calidad.mjs`: SS checkJs exit2 antes/después, cinco mensajes idénticos; rentas exit0; Oxlint exit0. Instrumento inicial de preparación, crea herramientas/enlace solo si no existen.
- Oxlint final, bajo flock pesado: binario anterior `--config .cache/revision-unidades-colecciones-r41-sol/oxlint.json --threads 1 --disable-nested-config --no-ignore` sobre los dos productores y revisar.mjs/casos.mjs/calidad.mjs propios: exit0; `--debug files` confirma los cinco archivos, lista conservada. 16 reglas a error.
- Schema, bajo flock pesado: uv con jsonschema ejecuta schema.py: ambos schemas/candidatos válidos.
- Transporte: entregar.py, bajo flock pesado, crea patch textual gzip/objetos por hash y los aplica a directorio ordinario; compara cada byte del payload.
- Cotejo final: terminal.py bajo `flock /tmp/irobopf-recepcion-acotada.lock`, compara lstat/readlink/bytes/ejecutabilidad de 20.836 entradas, un blob cada vez, enumera altas y diff. No se apoya en el índice.

Incidencias conservadas: python3 ausente fuera de Nix; primer comando cat buscó COORDINACION en raíz; sonda AST propia inválida registrada antes de corregirla. No son pruebas aprobadas ni defectos fiscales. El primer lint se amplía con --no-ignore y lista explícita para acreditar selección; no se desactivan reglas. Ningún productor histórico se ejecuta como CLI de escritura.
