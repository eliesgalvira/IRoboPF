# Transporte C y operador de la API

Candidato para revisión independiente. No habilita miles de ejecuciones ni da C
por completo. Código público; originales, CAS, journal, resultados y logs externos.
No se distribuyen tráfico, sesiones, PDFs ni SES con este tooling.

Requisitos del entorno: Python 3.11+, Bun y dependencias del lock del proyecto,
Jujutsu en un checkout del proyecto, `timeout`, `pdftotext` (Poppler). Solo para
capturar: Playwright Python y Chromium disponibles en el entorno. No se instala
nada globalmente. `C_PYTHON`, `C_BUN`, `C_PDFTOTEXT` y `C_CHROMIUM` permiten elegir
los ejecutables; se resuelven con PATH y se informa del ausente. No hay requisito
Nix ni rutas privadas. Use `UV_CACHE_DIR="$HOME/.cache/uv"` si gestiona Python con uv.

Desde la raíz, con dependencias ya instaladas y sin red:

```sh
timeout -k 30s 10m bash tools/procedencia/simuladores/ci.sh
timeout -k 30s 5m bunx --no-install tsc --noEmit --incremental false
timeout -k 30s 5m bunx --no-install oxlint --disable-nested-config tools/procedencia/simuladores/engine.mjs tests/simuladores-proyeccion.test.ts lib/dominio/irpf/trabajo-anual/conexion.ts
timeout -k 30s 5m bunx --no-install eslint tools/procedencia/simuladores/engine.mjs tests/simuladores-proyeccion.test.ts lib/dominio/irpf/trabajo-anual/conexion.ts
```

CI requiere un workspace Jujutsu para acreditar el commit base; no se fabrica
una identidad si falta. El padre decide instalación/pines y workflow global.
La suite privada está separada: `tests/simuladores-private.py` imprime SKIP
explícito sin `C_PRIVATE_ORIGINALS`; ese valor apunta a la recepción v1 con sus
índices existentes. Requiere también `C_TEMPLATE_DIR`, `C_CAS_DIR` y Poppler.
No modifica la recepción. Las pruebas de transporte simulado están identificadas;
la prueba del operador ejecuta la API real y un rechazo real.

Comparación real offline, con rutas externas elegidas por el operador:

```sh
timeout -k 30s 5m python3 tools/procedencia/simuladores/offline.py \
  --output /ruta/externa/comparacion \
  --references docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json \
  --originals /ruta/externa/originales \
  --receipts /ruta/externa/recepcion/results.jsonl
```

`--receipts` puede repetirse. Se verifica SES/PDF antes del cotejo. Referencias
se vinculan a originales por hash, nunca solo id/año. `engine.mjs` también admite
un archivo JSON con una lista no vacía de entradas completas de la API y escribe
un recibo JSON por stdout. Rechazos: salida 2. `offline.py` devuelve 1 si hay
diferencias y 2 mientras el vínculo fiscal esté incompleto. El contrato escalar
solo puede señalar coincidencias condicionadas: no acepta metadatos declarados
como prueba de ejecución. La aceptación 0 queda reservada a cobertura completa;
esta fase no la alcanza.

El recibo fija inventario completo conservador de `lib`, tooling, `node_modules`
(excepto cachés), package/lock/tsconfig, antes de importar la API y después de
calcular; SHA-256, base real leída por `jj --ignore-working-copy`, ejecutable Bun,
versiones/runtime/política y entrada efectiva decodificada. Declara siempre
candidato base más inventario, nunca ejecución atribuida al commit limpio.
El inventario completo puede ser grande: conservarlo externamente. Cambiar
fuentes/dependencias durante el proceso invalida la ejecución.

Para preparar la semilla de **2020 casos**, sin red:

```sh
export C_RUN_DIR=/ruta/externa/ejecucion
export C_CAS_DIR=/ruta/externa/cas/sha256
export C_TEMPLATE_DIR=/ruta/externa/plantillas
timeout -k 30s 1m bash tools/procedencia/simuladores/launch.sh --generate
```

La captura explícita usa `launch.sh --jobs /ruta/externa/jobs.jsonl --limit 1`.
Límite 1–20, serial, pausa 2 s, timeout de proceso, bloqueo compartido propio en
`$HOME/.cache/irobopf-c-official.lock` también para descargas. No lanzar más de
una suite pesada propia; máximo dos en la máquina. Esta entrega **no ejecutó
capturas**. `--fresh` fuerza captura; por defecto SKIP significa evidencia
histórica verificada, nunca frescura actual. Los cambios de código/configuración/
entorno cambian la identidad v2; no convierten recibos anteriores en nuevos.

La identidad incluye los bytes de `launch.sh` y los comprueba antes y después
de capturar o reutilizar. Modificarlos durante el proceso exige reiniciarlo;
tras reiniciar, la identidad nueva no reutiliza la anterior. Invocar directamente
`run.py` conserva esas verificaciones, pero no ejecuta el timeout del lanzador:
en esa modalidad el llamante debe envolver el proceso y sus hijos en `timeout`.
El hash del lanzador fija su versión, no demuestra por sí solo que se haya usado.
La identidad de transporte fija los ejecutables Python, Chromium y Poppler y
la versión declarada de Playwright; no es un inventario completo de sus librerías
dinámicas. El inventario conservador de dependencias descrito arriba corresponde
al operador del motor Bun.

Las tres rutas `C_RUN_DIR`, `C_CAS_DIR` y `C_TEMPLATE_DIR` deben ser absolutas,
estar fuera de todo el checkout y no contenerse entre sí. Se resuelven enlaces
simbólicos y `..` antes de comprobarlas y se usa la ruta canónica resultante,
también cuando el último directorio aún no existe. La salida de `offline.py`
obedece la misma separación del checkout; sus originales de solo lectura pueden
ser los archivos históricos ya conservados dentro del repositorio.

CAS conserva integridad y escritura completa; journal recupera únicamente el
último sufijo parcial conservando sus bytes. Último estado manda; un resultado
huérfano no es done. Validación SES/PDF obligatoria antes de done y de SKIP.
No cambian las plantillas admitidas por hash ni las versiones oficiales fijadas.

Se cotejan 14 casillas: 0023, 0025, 0500, 0505, 0528–0533, 0414, 0595, 0610,
0670. Decimal exacto, sin tolerancia ni redondeo nuevo. 0023/0414 pueden estar
omitidas legalmente en PDF si SES está ausente o cero; ausencia nunca cuenta
como comparación monetaria ni se transforma en cero. 2018–2024 se registran
fuera del perfil actual. Duplicados se identifican por hechos/entradas monetarias
normalizados, separadamente del número de capturas y de casillas comparadas.

`binding.py` exige ejercicio, territorio, modalidad, edad y cantidades observadas.
Las seis claves personales deben aparecer una vez en su ámbito, con registro
completo de tipo 1; un duplicado malformado no desaparece del cotejo.
Los hechos restantes y la auditoría exhaustiva de registros de plantilla siguen
pendientes: un hash de plantilla no acredita negativos fiscales. El cotejo puede
coincidir y continuar incompleto. Véase el informe de integración.
