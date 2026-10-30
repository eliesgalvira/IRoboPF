# Reproducción

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base de los ensayos: `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`.

Entorno Nix resuelto en nixpkgs.json; Python 3.13.15 y NumPy 2.5.4. El hash de Calculo_Salario_IRPF.py queda en python.json; los hashes SHA-256/512 y tamaño del libro en excel.json. La versión que creó el libro histórico no está acreditada.

Todos los comandos pesados se ejecutan con `flock /tmp/irobopf-validacion-pesada.lock` y un trabajador. Ejecutar desde la raíz de este checkout.

```bash
nix shell nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock python docs/procedencia/implementaciones/comparativa-inflacion/extraer.py /home/elies/Repos/IRoboPF/Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx
nix shell nixpkgs#python3 nixpkgs#uv nixpkgs#gcc nixpkgs#zlib -c bash -c 'export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#gcc.cc.lib.outPath)/lib:$(nix eval --raw nixpkgs#zlib.outPath)/lib"; flock /tmp/irobopf-validacion-pesada.lock uv run --no-project --python "$(command -v python3)" --with numpy==2.5.4 python docs/procedencia/implementaciones/comparativa-inflacion/oracle.py'
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/vitest run tests/comparativa-inflacion-tabular.test.ts --maxWorkers=1
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/tsc --noEmit --incremental false
```

Para fijar la misma revisión Nix, sustituir nixpkgs por el `resolvedUrl` de nixpkgs.json (ruta del store y narHash registrados). El entorno no instala dependencias globales. No se ejecuta corpus Python ni inventario; sus entornos fijados no se modifican.

Lint: ESLint y oxlint sobre progresividad-frio.ts, comparativa-tabular.ts, tests/comparativa-inflacion-tabular.test.ts y diferencias.ts. `bun scripts/test-lint.mjs` comprueba las 16 reglas a error. Prettier sobre las fuentes editadas. Effect: list/show basics/testing antes de escribir y lectura de Iterable.makeBy de la fuente local.

`bun diferencias.ts > salida.json` (versión final sin node:fs; la ejecución inicial guardó por argumento) se ejecuta con Bun sobre el constructor de base antes de conectarlo al helper nuevo. Guarda coordenadas, año, salario y ambos valores, sin derivar expectativas del TypeScript. El oracle Python ejecuta cuerpos AST íntegros; sustituye únicamente DataFrame por la captura de filas y, para fronteras, arange por 22 salarios explícitos. No ejecuta los cuerpos de exportación ni escribe el libro.

`entrega.py` genera manifiesto y patch textual mediante lecturas Git; comprueba presencia de todos los archivos de base. No usa el índice. El manifiesto excluye su propia identidad y fija el hash separado del patch.

Python propio: `nix shell nixpkgs#ruff -c ruff check docs/procedencia/implementaciones/comparativa-inflacion/*.py`. Versión y resultado en ruff.log. El intento inicial de Ruff vía uv falló por enlace dinámico NixOS; el NumPy de uv sí ejecutó correctamente con gcc/zlib en LD_LIBRARY_PATH.
