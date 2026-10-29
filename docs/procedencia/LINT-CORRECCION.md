# Corrección de las 96 infracciones de lint

## Integración del orquestador tras contrarrevisión

Los 29 archivos se compararon con la base y el manifiesto, sin borrados. La revisión independiente está en `revisiones/lint/`. Se integró el contenido sin metadatos VCS. A continuación se conservaron los tres rechazos runtime anteriores en retenciones con Match.number/Match.string: una prueba nueva con entradas malformadas falló antes del ajuste y pasó después. Los cambios de presencia descritos en el informe original de abajo corresponden al parche entregado, no a la versión integrada final.

Comprobación del orquestador: lint global, typecheck de aplicación/vendor y test:lint correctos; cuatro archivos de pruebas focalizadas, 20 pruebas correctas. Se excluye `.cache/` de las comprobaciones de proyecto por contener experimentos temporales de auditores; no se excluyen fuentes mantenidas. El primer lint del padre detectó un script scratch con una variable `module`; no se confundió con una infracción del producto ni se silenció una regla de aplicación.

Fecha: 29 de octubre de 2026. Base de integración: `d4d708f68c4cfd95d462f7503014e39042963dbf`.

## Alcance y estado

Se corrigen los 25 archivos de la instantánea original de `lint/por-regla-archivo.tsv`, más `tests/lint-contratos.test.ts`. No se cambian importes, tipos impositivos, escalas, fórmulas fiscales, redondeos ni diseño. Esta entrega no valida ninguna cifra fiscal ni sustituye la revisión documental independiente. Esa revisión sigue pendiente y corresponde a los auditores de dominio.

No se modifican configuración del plugin, dependencias, lockfile, ESTADO ni DECISIONES. No se añaden exclusiones ni supresiones de reglas. Permanecen las directivas de diagnóstico Effect que ya existían, sin ampliarlas. Los reportes se regeneran al terminar las comprobaciones.

## Cambios por grupos

| Grupo | Archivos | Corrección y efecto |
| --- | --- | --- |
| Contratos de gráficos | `components/auditoria.tsx`, `components/ui/chart.tsx` | Las filas conservan campos obligatorios `salarioEuros` y `salario`; las series mantienen sus valores originales. Se eliminan casts de arrays vacíos y literales. Los años se validan contra la lista fiscal existente. Los payloads de Recharts tienen el tipo de su productor y se decodifican los campos usados para resolver la configuración, respetando prioridad directa, anidada y respaldo. |
| Adaptadores web | `app/auditoria/page.tsx`, `app/layout.tsx`, `components/copiar-imagen-grafico.tsx`, `components/ui/combobox.tsx`, `components/ui/select.tsx`, `components/ui/tooltip.tsx` | Discriminación de uniones ya tipadas de Next, FileReader y React; propiedades CSS personalizadas explícitas; genérico del selector propagado al componente Base UI; comprobación real de Node antes de `contains`. No se cambian estilos ni etiquetas. |
| Construcción de casos | `components/liquidacion-irpf.tsx`, `lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts` | Construcción por ramas que conserva la ausencia real de propiedades opcionales. La búsqueda del catálogo compara las claves existentes y devuelve ausencia para territorios sin catálogo. |
| Motor y catálogos | `lib/dominio/irpf/cuotas/escalas-gravamen.ts`, `lib/dominio/irpf/deducciones-autonomicas-aplicadas.ts`, `lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts` | Array vacío tipado sin assertion; inferencia de entradas y tablas; límite monetario con el contrato `string` del catálogo; comprobación de presencia de campos opcionales del caso de retención ya tipado. No cambia ningún cálculo para entradas del contrato. |
| Datos normativos | `lib/dominio/normativa/datos/deducciones-autonomicas-2025/helpers.ts`, `index.ts` del mismo directorio, `lib/dominio/normativa/datos/ipc-2012-2026.ts` | Traducciones conservan sus claves conocidas y se consultan con Map. El IPC exige todos los ejercicios 2013–2026 y reconoce ausencia en otros índices numéricos. Las dos assertions de construcción de catálogo explican su invariante local. No se altera ningún literal normativo. |
| Exportación y observabilidad | `lib/export/auditoria-excel.ts`, `lib/observabilidad/auditoria-rendimiento.ts` | Cabeceras con tipo ExcelJS; eliminación del doble cast de Blob mediante vistas de ArrayBuffer; detalles de diagnóstico limitados a valores concretos, colecciones y Option numérico; acceso al reloj mediante globalThis. |
| Fixtures y pruebas | `scripts/hash-effect-sheet.ts`, `tests/auditoria-excel-pesada.test.ts`, `tests/auditoria-excel.test.ts`, `tests/auditoria-fixture-canonico.test.ts`, `tests/calculo-salario-legacy.test.ts`, `tests/helpers/canonical-tabular-hashes.ts`, `tests/progresividad-caracterizacion-legacy.test.ts` | Esquemas compartidos para fixture y salida JSON del hijo; fallo del decoder rechaza la promesa. Años externos validados; celdas con contrato tabular; discriminación de variantes numéricas/textuales sin cambiar tolerancias ni hashes. |

## Objeciones expertas, decisiones y costes

- **Objeción: sustituir `typeof` por un helper que afirma tipos no arregla una frontera desconocida.** Se usan Schema y decoders para JSON, años externos y campos de payload de Recharts. Match y Predicate se reservan a uniones que ya tienen propietario y contrato: celdas, referencias React, valores de gráficos y resultado FileReader. No se introduce ningún predicado propio que afirme un tipo sin validarlo. Coste: decodificación en esos adaptadores y rechazo explícito de entradas que antes se aceptaban mediante casts.
- **Objeción: un guard de retenciones no debe convertirse silenciosamente en una validación parcial de JSON.** `esCasoCalculable` recibe `CasoRetencionTrabajo`, no datos desconocidos. Se comprueba presencia de los campos opcionales, preservando la elección de casos del contrato y el requisito de descendientes de situación 1. No se añade una política nueva para objetos JavaScript que incumplan esa interfaz: tal frontera sigue requiriendo validación por su propietario. Coste: la garantía es para entradas tipadas; no se anuncia soporte de entradas arbitrarias.
- **Objeción: hacer un cast a BlobPart o copiar todo el ZIP oculta el problema de ArrayBufferLike y aumenta memoria.** Se comprueba el buffer y se crea una vista con el mismo offset y longitud cuando es ArrayBuffer. Solo se copia si el buffer es compartido o no pertenece a esa clase del entorno. Coste: una vista por fragmento; posible copia en ese caso excepcional. Las pruebas de exportación comprueban el XLSX resultante.
- **Objeción: comentarios SAFETY genéricos no demuestran seguridad.** Quedan tres assertions justificadas: `cloneNode` preserva el subtipo SVG del receptor; `Object.keys` enumera las claves del literal local de metadatos; `Object.fromEntries` reconstruye exactamente una entrada por cada una de esas claves, sin filtrar ni renombrar. Coste: esas invariantes deben revisarse si se cambia la construcción o el origen de los metadatos. No se añade ninguna desactivación de lint.
- **Objeción: un diccionario abierto de IPC afirmaba valores para cualquier número.** El contrato exige los años presentes y permite ausencia en índices arbitrarios; se conservan los fallbacks existentes. Coste: el tipo es más explícito; no se reinterpretan 2012 ni la proyección 2026.
- **Objeción: extraer etiquetas de Recharts puede alterar prioridades y diseño.** Hay una prueba de prioridad directa/anidada/respaldo y ausencia. La importación de `cn` usa su ruta relativa para probar el módulo real sin mocks ni cambios de configuración. Coste: se exporta la función de resolución para probarla; no hay prueba visual de navegador en esta ronda.
- **Objeción: un fixture tipado por assertion puede ocultar una salida corrupta del proceso hijo.** El esquema compartido comprueba estructura y tipos; la decodificación devuelve un resultado cuyo fallo rechaza la promesa. Coste: una salida mal formada ahora falla explícitamente. La validación estructural no acredita que los hashes correspondan al Excel original; esa comparación pesada no se ejecuta aquí.

## Verificación reproducible

Entorno: `nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#ripgrep`. Dependencias existentes enlazadas mediante `node_modules`, sin instalación ni modificación. Antes de pruebas se ejecutó `free -m`: entre 5,6 y 8,5 GB disponibles, sin swap. Un worker por suite; no se ejecutaron Next build ni los dos archivos pesados.

Antes de escribir Effect se intentaron `bunx effect-solutions list` y `show basics data-modeling error-handling testing`. El ejecutable descargado no arrancaba en NixOS. Se ejecutó una copia temporal con el intérprete glibc de Nix corregido mediante patchelf, con los mismos subcomandos; se consultó también `packages/effect/src/Schema.ts` del repositorio local v4. No se modificó el paquete instalado ni se añadieron dependencias al proyecto.

Comandos desde la raíz del checkout:

```sh
free -m
bun run lint
bun run typecheck
bun run test:lint
bun run test:ci
bunx vitest run tests/lint-contratos.test.ts --maxWorkers=1
bunx vitest run --exclude tests/auditoria-fixture-canonico.test.ts --exclude tests/auditoria-excel-pesada.test.ts --maxWorkers=1
bun scripts/lint-report.mjs
```

Resultados de la suite ampliada: 22 archivos correctos, 177 pruebas correctas y una omitida por la condición de liquidación legacy completa; duración aproximada 10 segundos. El lote focalizado anterior tuvo 8 archivos correctos, 37 pruebas correctas y la misma omisión. Las tres pruebas nuevas verifican resolución de configuración Recharts, validación de JSON/fixture y rechazo de años fuera del contrato.

Resultado final: ESLint y anti-slop globales sin errores ni avisos; reporte regenerado con 0 diagnósticos. Typecheck de aplicación y plugin correcto; `test:ci`, 2 archivos y 5 pruebas correctas; las 3 pruebas nuevas pasan sin mocks. Se comprobó el ensayo del plugin: las 16 reglas siguen a error y ambos plugins rechazan el fixture negativo. Las primeras comprobaciones detectaron ajustes de tipos y un mock de módulo en la prueba nueva; se corrigieron eliminando el mock, sin silenciar diagnósticos.

No se ejecuta `auditoria-fixture-canonico.test.ts` porque lanza el cálculo completo de las hojas en procesos hijos. `auditoria-excel-pesada.test.ts` tampoco se ejecuta. Ambos archivos sí pasan análisis estático. La equivalencia exhaustiva con el Excel de 150 MB y la inspección visual de navegador quedan pendientes; no se presentan como comprobadas.

## Incidente de VCS y entrega

La instrucción inicial pedía inicializar JJ dentro del checkout T3. El intento colocated fue rechazado por tratarse de un worktree vinculado. Antes del aviso posterior del usuario, se copiaron objetos, referencias y HEAD a metadatos locales, se conservó el puntero original en `.cache/t3-git-pointer` y se inicializó JJ localmente. No se modificaron archivos del checkout padre. Se creó además una exclusión local del puntero de respaldo para que no formase parte de la entrega.

El aviso posterior revocó esa autorización y señaló un índice vacío. Desde ese aviso se suspendieron todas las operaciones VCS mutantes: no se reparó el índice, no se borraron ni reconstruyeron `.git`/`.jj` y no se hizo commit, push ni PR. El orquestador debe resolver el estado de metadatos. La entrega consiste en archivos y un parche contra la base indicada; no hay change ID ni SHA de commit de esta entrega. La consulta de la base para generar el diff usa `jj --ignore-working-copy`, sin tomar snapshots ni cambiar el índice.
