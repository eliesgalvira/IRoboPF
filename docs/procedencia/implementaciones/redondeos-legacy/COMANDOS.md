# Reproducción

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Desde la raíz de este worktree. Base c61a306107f280c399eb57e57a7c45452bd68864.

- Dependencias: enlace node_modules al repositorio principal, utilizado para lectura. Sin instalar paquetes de proyecto ni cambiar lockfiles.
- Extracción nueva del libro:
  `nix shell nixpkgs#python3 -c flock /tmp/irobopf-validacion-pesada.lock python docs/procedencia/implementaciones/redondeos-legacy/extraer.py /home/elies/Repos/IRoboPF/Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx`
- NumPy: entorno Nix python3, uv, gcc y zlib; LD_LIBRARY_PATH contiene gcc.cc.lib/lib y zlib/lib. Comando:
  `uv run --no-project --python "$(command -v python3)" --with numpy==2.5.4 python docs/procedencia/implementaciones/redondeos-legacy/reproducir_numpy.py`
- Oracle acotado: mismo entorno, bajo flock, ejecutar oracle_acotado.py. Ejecuta por AST los tres cuerpos originales sin modificarlos; el adaptador de np.arange devuelve los salarios listados, y DataFrame conserva los diccionarios. No genera ni escribe Excel ni altera fuente original.
- Rojo, antes del cambio: `flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/vitest run tests/redondeos-legacy-oracle.test.ts --maxWorkers=1`.
- Verde y regresiones: comandos iguales con tests/dinero.test.ts y tests/progresividad-caracterizacion-legacy.test.ts. Los resultados conservan la regresión de caracterización, sin reescribir su expectativa.
- Lint: oxlint y eslint sobre las cinco fuentes TS de la entrega, con reglas existentes.
- Tipos: `flock /tmp/irobopf-validacion-pesada.lock node_modules/.bin/tsc --noEmit --incremental false`.
