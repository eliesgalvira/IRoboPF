Comandos e instrumentos del alcance

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Ejecutar desde la raíz del proyecto con herramientas Nix.

- Rojo: node .cache/flujo-ss-r32/rojo.mjs contra el compositor recibido. El primer instrumento apuntaba a FirstStatement y se conserva; el siguiente falló por ruta de import. No se confunden con un rojo semántico. El instrumento corregido conserva la expresión valueTags exacta.
- Pruebas: /home/elies/Repos/IRoboPF/node_modules/.bin/vitest run --config .cache/flujo-ss-r32/vitest.config.mjs. Un trabajador. Primer intento interrumpido, sin anunciar pase. El nuevo intérprete valida una copia privada y memoriza el DAG por caso y el callback por elemento.
- Tipos: en .cache/flujo-ss-r32/quality, node node_modules/typescript/bin/tsc --noEmit. Proyección de alcance con configuraciones estrictas originales; dependencias compartidas solo lectura. No se declara validación global.
- Lint: en esa misma proyección, node node_modules/oxlint/bin/oxlint --threads=1 --disable-nested-config scripts/procedencia/flujo-ss-r32.mjs tests/flujo-ss-r32.test.ts. Las 16 reglas originales se comprueban a error al preparar la proyección.
- Generación: node .cache/flujo-ss-r32/generate.mjs, artefacto y schema específicos; no se sobrescribe ninguna salida histórica.

Los logs junto al informe contienen el resultado efectivo. Los comandos lanzados y todavía esperando bloqueo no se cuentan como completados. Los instrumentos definitivos se conservan como texto para reproducirlos en scratch propio.
