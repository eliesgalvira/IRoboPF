# Corrección de las 96 infracciones de lint

<a id="integración-del-orquestador-tras-contrarrevisión"></a>

## Integración y contrarrevisión

La revisión independiente está en `revisiones/lint/`. La integración conserva los rechazos runtime de entradas malformadas en retenciones con `Match.number`/`Match.string`. La comprobación de presencia descrita en el parche inicial no sustituye esos rechazos. `.cache/` queda fuera de las comprobaciones de proyecto por contener experimentos temporales; las fuentes mantenidas siguen analizándose.

## Alcance y estado

Registro histórico de la corrección de lint sobre la base `d4d708f68c4cfd95d462f7503014e39042963dbf`. El lote corresponde a los 25 archivos de la instantánea original de `lint/por-regla-archivo.tsv`, más `tests/lint-contratos.test.ts`. No se cambian importes, tipos impositivos, escalas, fórmulas fiscales, redondeos ni diseño. El lint no valida cifras fiscales ni sustituye la revisión documental independiente.

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
- **Objeción: extraer etiquetas de Recharts puede alterar prioridades y diseño.** Hay una prueba de prioridad directa/anidada/respaldo y ausencia. La importación de `cn` usa su ruta relativa para probar el módulo real sin mocks ni cambios de configuración. Coste: se exporta la función de resolución para probarla; la prueba de prioridad no acredita el resultado visual en navegador.
- **Objeción: un fixture tipado por assertion puede ocultar una salida corrupta del proceso hijo.** El esquema compartido comprueba estructura y tipos; la decodificación devuelve un resultado cuyo fallo rechaza la promesa. Coste: una salida mal formada ahora falla explícitamente. La validación estructural no acredita que los hashes correspondan al Excel original; requiere una comparación independiente.

## Verificación reproducible

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

La selección de pruebas anterior excluye los dos archivos pesados: no acredita equivalencia exhaustiva con el Excel de 150 MB ni inspección visual de navegador. El análisis estático incluye ambos archivos.

<a id="incidente-de-vcs-y-entrega"></a>

## Recepción de archivos

Para integrar archivos, comparar su contenido con la base y limitarse al ámbito asignado; no importar `.git`, `.jj` ni cachés. El repositorio principal se gestiona con Jujutsu.
