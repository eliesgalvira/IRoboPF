# Revisión independiente de la API efectiva histórica privada

Dictamen favorable para la conexión y preservación examinadas. No se encontraron defectos reproducibles de importes ni datos públicos incorrectos atribuibles al parche. No se propone corrección de producción. Esta revisión ligera no acredita equivalencia fiscal histórica ni sustituye la revisión de C2025. No autoriza capturas ni campañas históricas.

Candidato: /home/elies/Backups/IRoboPF/producto-c-historico-api-20261104. Parche SHA256 b228b74a65eb6fdb6b3131f3007891b5335a13126ad3d4be34aac0697d3e7f6b. Leídos los ocho documentos solicitados y las dependencias de producción y referencias locales necesarias. Raíz, candidato y preimágenes intactos: 27 archivos con SHA256 antes/después idénticos (listas adjuntas). Sin worktree, VCS mutante, subdelegación ni turno pesado.

## Evidencia propia

pruebas-propias.ts: 1489 comprobaciones y 109 escenarios positivos, salida 0; evidencia en pruebas-propias.log.

- Cada literal histórico 2018–2024 decodifica y ejecuta con edades 18 y 64. Preservadas 25 variantes válidas 2025: empleo laboral/estatutario/pensión, familia E+B y actividad EDS con pagos, en Madrid, Andalucía, Catalunya, Galicia y Comunitat Valenciana. Igualdad completa de objetos frente a raíz, incluido rastro.
- Diez importes por año histórico, incluidos cero, distintas ramas Art20 y máximo de entrada. Reducción cotejada con productor existente recibiendo el año real; neto cotejado con productor de gastos y reducción. Cuota posterior cotejada con composición común invocada directamente con año real, precisión 80 y decimal-hasta-salida. Son comprobaciones de conexión al motor existente, no un oráculo fiscal histórico.
- Devengo, conciliación, trabajo y retenciones de cada histórico cruzados con todos los otros años 2018–2025: rechazo ResultadoNoSoportado. También desajustes desde 2025 hacia históricos.
- Negativos: pensión, actividad, familia/derechos, otro territorio, cotizaciones estimadas/desconocidas, otros años, edades fuera del rango, rendimientos vacíos, pagos no efectivos/duplicados, otras rentas y deducciones. Extras en raíz y estructuras anidadas, alias anio y controles politica/precision/cotizaciones/serviciosLaborales/pagosACuentaCentimos/retencionTrabajoAeat: rechazo.
- Quitar retenciones conserva cuota posterior y cambia diferencial por el pago declarado. Entradas inmutables. DA61 histórica cero por exclusión explícita de serviciosLaborales, sin recuperar errores ni inventar ceros.
- Art20 2018: neto previo 13000 produce 1676.5625 antes del 5 de julio y 3620.78125 desde esa fecha y al devengo ordinario. API histórica sólo admite devengo 31 de diciembre y rechaza fechaFallecimiento como extra. El enlace al productor recibe el año real. Precisión global Decimal permanece 20; conexión/composición usan clones de 80.

sondeo-autor-repetido.log: ejecución separada del sondeo del autor, salida 0, 498 asserts y 30+7 resultados completos 2025. Sirve como evidencia de preservación 2025, nunca como aceptación histórica. No se capturaron ni consultaron resultados oficiales históricos. Las referencias locales 2025 no son capturas nuevas.

## Selección e imports

El contrato construye siete Struct con literal propio para ejercicio, primera propiedad heredada de Alcance. Los positivos de cada año y los 2025 fuera de Madrid comprueban el despacho efectivo en la versión instalada. No se introduce la unión de años que ocultaba ramas 2025.

Conexión pasa caso.ejercicio a Art20 y composición, exige coincidencia de trabajo/conciliación/retenciones/devengo, restringe empleo histórico y conserva los productores de gastos y cuotas. Open y serviciosLaborales exigen 2025; los históricos llegan a composición con decimal-hasta-salida y sin serviciosLaborales.

Mínimos estatales: liquidar-irpf-anual.ts:318–328 sólo singulariza 2012, 2013, 2014 y 2026; 2018–2024 usan dependencias.parametrosNormativos.minimosEstatales2025. El servicio predeterminado en comunidades/comunidad-autonoma.ts:612 apunta a MINIMOS_ESTATALES_2025, el mismo objeto pasado por el candidato. Para 18–64 sin familia/discapacidad mantiene 5550. Composición recibe el año real para escalas y mínimos autonómicos; no se troca el año. Esto verifica la selección existente, sin nueva acreditación normativa.

auditoria-runtime.log: SHA del candidato y de preimágenes de raíz coinciden con manifiesto. Las copias runtime coinciden byte a byte con las propuestas tras resolver exclusivamente imports relativos; conexión importa el contrato privado y los demás módulos de raíz. Alias runtime de Effect, Decimal y TypeScript apuntan a dependencias de raíz. No hay sustituciones de lógica ni capas para silenciar errores.

## Incidencias y límites

Sin hallazgos que requieran solución mínima de producción. El primer sondeo propio usó por error valencia; se corrigió a comunitat-valenciana. Se conserva pruebas-propias-intento1.log. El fallo era del sondeo, no del candidato. La versión final imprime la entrada y relanza si falla una ejecución positiva.

Bun emite el aviso interno conocido directory mismatch de tsconfig-override también con salida 0. No se toma ese aviso ni su ausencia como evidencia de corrección: cuentan assertions y código de salida.

No se ejecutaron Vitest, tipos ni lint globales por el turno LIGERO3. Se leyeron los 17 casos Vitest propuestos; no se declara superada esa suite. La integración requiere sus checks ordinarios cuando tenga turno. No se amplía a auditoría universal de gastos ni se repiten revisiones fiscales históricas aceptadas.

C2025 debe superar su revisión independiente antes de capturas/comparaciones históricas. Equivalencia Open histórica y redondeo oficial observado quedan pendientes para punto7. Aceptación fiscal permanece pendiente.

## Entrega y reproducción

revision.patch añade sólo recursos de revisión bajo revision-historico-api/. No contiene cambios sobre lib ni sobre el candidato. manifiesto-sha256.json identifica archivos y SHA256, excluyéndose a sí mismo. Sin dependencias, caches, entornos ni copias completas.

Ejecutar un proceso por vez, desde cualquier directorio:

    timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; bun --no-install --tsconfig-override /home/elies/Backups/IRoboPF/producto-c-historico-api-20261104/runtime.json /home/elies/Backups/IRoboPF/producto-c-historico-api-revision-20261104/pruebas-propias.ts'

    timeout -k 30s 25s bash -c 'source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh; /home/elies/.cache/irobopf-corpus/.venv/bin/python /home/elies/Backups/IRoboPF/producto-c-historico-api-revision-20261104/verificar-fuentes.py'

Consultadas guías Effect Solutions list/show basics, error-handling y testing, y fuente local Effect.result/runSync antes del sondeo.
