# Comandos y secuencia

Todos los comandos pesados se ejecutaron con `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador, `PYTHONDONTWRITEBYTECODE=1` y `UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv`. Las rutas relativas siguientes se resuelven desde `/home/elies/Repos/IRoboPF`.

Preparación y recorrido: Nix proporciona `python3`, `bun` y `nodejs`. Para cada fase se ejecuta `python3 docs/procedencia/correcciones/multiplicidad-r27/preparar.py` y después `bun docs/procedencia/correcciones/multiplicidad-r27/recorrido.mjs`, con `IRPF_MULTIPLICIDAD_ETAPA` fijado. Los árboles anteriores bajo `.cache/orquestador-recepcion/r27/multiplicidad/` conservan sus propias fuentes; no repetir su preparación contra fuentes actuales esperando reproducir un código antiguo.

- `antes`: fallo real `ID duplicado`, lote 264.
- `despues`: supera el duplicado y falla la URL BORM, lote 264.
- `despues-url`: supera ambos y falla el original de 42.900.459 bytes, lote 264.
- `despues-acotado`: excluye de forma explícita los 36 pares dependientes de ese original, publica/verifica 228 y se detiene en una expectativa textual incorrecta del instrumento GET.

La continuación `bun docs/procedencia/correcciones/multiplicidad-r27/comprobar-get.mjs` lee ese snapshot ya publicado. Comprueba noventa fichas, todos sus estados y dieciocho respuestas de objetos por bytes/hash. Después `bun docs/procedencia/correcciones/multiplicidad-r27/comprobar-publicacion.mjs` contrasta los 228 pares/90 sujetos y las cuatro mutaciones de cobertura. Ambas terminan con código 0; el primer instrumento GET y sus fallos se conservan aparte.

`validar-cierre.sh`, ejecutado con Bun, Node y Ruff de Nix, pasó tipos, lint, Ruff y mypy. El paso de regeneración verificó los 36 históricos y generó V1, pero le faltaba Python en el entorno externo para el coordinador. No se omite ese fallo. Se añadió `nixpkgs#python3` al entorno y se ejecutó `bun docs/procedencia/correcciones/multiplicidad-r27/reanudar-publicacion.mjs`, que exige la entrada de dependencias exactamente igual y conserva los 36 históricos. Termina con código 0 y total de 38 snapshots; confianza e inventario intactos.

Regresiones finales, con Bun/Node/Python de Nix:

```sh
bun x vitest run tests/evidencia-multiplicidad.test.ts tests/publicacion-evidencia.test.ts tests/evidencia-contenido-procedencia.test.ts tests/rastro-anual-procedencia.test.ts tests/contenido-integridad-procedencia.test.ts --maxWorkers=1
bun x vitest run --config scripts/procedencia/contenido-vitest.mjs --maxWorkers=1
```

Resultado: 43 y 20 pruebas correctas, respectivamente. No implican aceptación fiscal ni publicación correcta del lote completo. Los logs iniciales y finales, recibos JSON y exclusiones se conservan en esta carpeta.
