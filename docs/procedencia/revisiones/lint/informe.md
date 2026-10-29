# Revisión independiente de lint

Veredicto: **aprobable para integración selectiva del contenido revisado**. No encuentro un P1/P2 demostrado en los recorridos actuales de la aplicación. Hay diferencias de comportamiento fuera de esos recorridos: se documentan abajo, no se afirma equivalencia para cualquier objeto JavaScript. Esta revisión no certifica cifras fiscales.

Fecha: 29 de octubre de 2026. Base: `d4d708f68c4cfd95d462f7503014e39042963dbf`. Entrega: `/home/elies/.t3/worktrees/IRoboPF/t3-3d3cd9a7`. Leídos BRIEF y COORDINACION. Revisión sin delegación, correcciones, operaciones VCS mutantes, commits ni despliegue. El informe del autor se leyó después del parche de código y las comprobaciones principales; no se usa como prueba de equivalencia.

## Integridad y bootstrap

Recalculados SHA-256 de los 29 archivos de manifiesto: objetos de la base mediante `git show` de solo lectura, archivos reales del hijo y archivos del padre. Todos coinciden con sus valores esperados; los nuevos no existen en base/padre. Aplicado el parche completo a copias de la base en scratch y comprobados los 29 resultados contra la entrega. Cero borrados. El mapa original contiene 96 diagnósticos en 25 rutas, todas incluidas. Los otros cuatro archivos son el test nuevo, informe y dos reportes. El índice anómalo del hijo no se utilizó ni reparó.

Descarga independiente del archivo upstream del commit `e8c4880471b23ab7f216fba7b27d173a6ef07d4c`: los 23 archivos de runtime coinciden con los hashes declarados; 22 son idénticos y la única diferencia del restante es `unsafeMembers[0]` → `(unsafeMembers[0] ?? null)`. Licencia MIT idéntica, versión 0.1.2 comprobada en package.json. API GitHub confirma tag anotado `bbf64a096fd02585ce3e547406602e6be23f621e`, nombre v0.1.2 y destino declarado. No se copiaron tests upstream a la entrega. La adaptación conserva el resultado del caso normal y permite comprobar el vendor con noUncheckedIndexedAccess. No afirmo que ese tag sea el último disponible.

Fuentes primarias: [runtime fijado](https://github.com/dmmulroy/anti-slop/tree/e8c4880471b23ab7f216fba7b27d173a6ef07d4c), [dictionary-types original](https://raw.githubusercontent.com/dmmulroy/anti-slop/e8c4880471b23ab7f216fba7b27d173a6ef07d4c/src/shared/dictionary-types.ts), [objeto del tag](https://api.github.com/repos/dmmulroy/anti-slop/git/tags/bbf64a096fd02585ce3e547406602e6be23f621e). No fue necesario confiar en Celda para verificar la diferencia local exacta.

`.oxlintrc.json` carga ambos plugins: 15 reglas generales y una Effect, todas a error. No se excluyen fuentes de aplicación; exclusiones de salidas generadas y runtime vendor. ESLint mantiene Next/React. `test:lint` enumera reglas y exige severidad error y total 16; ejecuta oxlint real contra un fixture negativo y comprueba salida 1 y diagnósticos de ambos plugins. No es un test vacío, aunque no ejercita individualmente las 16 reglas.

`run-lint.mjs` ejecuta ambos analizadores aun fallando el primero y conserva fallo mediante status distinto de cero (incluido null por señal/error). `lint-report.mjs` conserva errores de ejecución/parseo y sale 1 ante diagnósticos error. CI instala con lock congelado, ejecuta test:lint y lint sin continue-on-error; typecheck y test:ci usan !cancelled para ejecutarse incluso tras fallo. No hay tubería que oculte el código de salida. D004/D005 documentan coexistencia de analizadores y alcance reducido de CI. El reporte vacío de la entrega concuerda con mi lint real.

## Diferencias investigadas y objeciones descartadas

### Retenciones: defensa retirada, sin regresión actual demostrada

`lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts:164` cambia tres comprobaciones de tipo por presencia. El servicio no decodifica antes: `calcularRetencionTrabajoAeat` → servicio → `esCasoCalculable`; la liquidación también pasa directamente el caso al servicio (líneas 611–615). Por tanto **la interfaz TypeScript no demuestra por sí sola equivalencia runtime**.

Repro independiente contra ambas implementaciones: caso 2025, edad 40, retribución 3000000, cotizaciones 194400, situación3, activo, contrato general, sin discapacidad, arrays familiares vacíos, modo canonico. Ambos dan 492600 céntimos. Cambiando solo cotizaciones a la cadena `"194400"`, antes Failure/Fail ResultadoNoSoportado y ahora Success 492600. Con null, antes Fail ResultadoNoSoportado y ahora Failure/Die (Decimal). Con contrato null o situación laboral 42, antes Fail y ahora Success.

No clasifico estos repros como P1/P2: he seguido los productores actuales. `components/liquidacion-irpf.tsx:425` construye el objeto, convierte cotizaciones con eurosACentimos y toma contrato/situación de selectores tipados de opciones cerradas; no importa JSON ni almacenamiento en esa ruta. `calculo-salario-legacy.ts:174` calcula cotizaciones numéricas y fija activo/general. Los tests forman objetos propios. No se ha encontrado una frontera HTTP/JSON que permita los valores anteriores. El experimento introduce expresamente datos fuera del contrato; no prueba un fallo actual de usuario.

Defensa opcional mínima, si se desea preservar también ese rechazo histórico: usar Match.number para cotizaciones y Match.string para situación laboral/contrato, conservando las restantes condiciones y añadiendo pruebas del canal Fail frente a Die. No hace falta desactivar anti-slop, rediseñar el servicio ni ampliar fiscalidad. Si se incorpora entrada externa, esta observación debe revisarse antes de exponer el servicio. El informe del autor solo es defendible limitado a entradas del contrato.

### Gráfico: Struct no reproduce la consulta de propiedades heredadas

`components/ui/chart.tsx:345`: contraste de claves name/value/__proto__/constructor/ausente con objeto vacío, null, undefined, arrays, campos directos/anidados, strings y números. Para objetos propios normales se conserva prioridad directa > anidada > respaldo, incluso cuando la directa es una cadena sin entrada en config. No hay excepción con key ausente, __proto__ propio, null o array vacío en los casos ejecutados.

Diferencia reproducible: config `{name: respaldo, directa: directo}`, payload `Object.create({name: "directa"})`, key name: antes directo, ahora respaldo. Ocurre también anidado; Schema exige propiedad propia donde `in` aceptaba heredadas. Con primitivos antes undefined y ahora config[key]. Los primitivos no pertenecen al contrato Recharts y los productores inspeccionados de las gráficas construyen filas de propiedades propias; no he identificado un caso actual de UI con datos heredados. No elevo a P2 una posibilidad de otro consumidor futuro. Tampoco afirmo equivalencia universal. Si se decide soportar objetos con prototipo, caracterizar y preservar explícitamente esa lectura; no añadir casts para fingir validación.

### Años, opciones, tipos, bytes y pruebas

- `components/auditoria.tsx:1592`: el decoder síncrono puede lanzar para 2011/NaN, pero la llamada real recibe join de aniosGraficoIrpfVisibles, filtrados por includes de la lista permitida (ANIOS_COMPARABLES y 2026). No usa directamente el parámetro de URL. No hay crash de UI demostrado por año externo. En fixtures/scripts rechazar años imposibles fortalece una frontera que antes era un cast.
- Caso fiscal en liquidacion-irpf y calculo-salario-legacy: las ramas conservan ausencia real de deducción agregada y retención opcionales; no las sustituyen por propiedades presentes con undefined. Campos, condiciones y dependencias del useMemo se conservan.
- Deducciones: Object.fromEntries infiere valores concretos; el límite procede del catálogo string. La búsqueda del catálogo devuelve undefined para comunidades sin catálogo. Los dos SAFETY descansan en literal local cerrado y recorrido de todas sus claves sin filtro. Map evita consultar prototipo del diccionario de traducciones; los códigos actuales son propios del catálogo. No cambian importes ni fórmulas.
- Blob en auditoria-excel: las vistas conservan byteOffset/byteLength; el camino de buffer compartido copia la vista, no el buffer entero. Repro con bytes [9,8,7,6,5,4,3,2] y subarray(2,5): tanto ArrayBuffer como SharedArrayBuffer producen [7,6,5]. Pruebas XLSX focalizadas pasan.
- Fixture JSON y salida del hijo: Schema verifica estructura; decodeUnknownResult y reject en close corrigen el posible throw de JSON.parse fuera del ejecutor Promise. Rama de código no cero retorna tras reject, error de spawn también rechaza. Las pruebas nuevas verifican decoder, no ejecutan por sí mismas el proceso hijo malformado: limitación explícita, no prueba integral del harness.
- CSS: literales y variables personalizadas se conservan; temas light/dark recorren las mismas dos claves y orden. No se cambian clases, colores ni estructura de diseño. Select propaga el genérico; Predicate.isFunction conserva refs; instanceof Node evita pasar otro EventTarget a contains. El clon SVG mantiene la invariante del receptor. No se detectan imports de módulos exclusivos de servidor en cliente. No se midió bundle ni se hizo inspección visual.

## Cobertura completa del parche

Se revisaron todos los hunks de las siguientes rutas, no una muestra:

| Rutas | Resultado |
| --- | --- |
| app/auditoria/page.tsx; app/layout.tsx | Predicado string equivalente; CSS conservado. |
| components/auditoria.tsx; components/copiar-imagen-grafico.tsx | Años y tipos de filas/arrays; FileReader y assertion SVG revisados. |
| components/liquidacion-irpf.tsx | Todas las propiedades del caso, ramas opcionales y consulta del catálogo contrastadas. |
| components/ui/chart.tsx; combobox.tsx; select.tsx; tooltip.tsx | Decoder y diferencias descritas; CSS, refs, genérico y target revisados. |
| lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts | Ausencia opcional preservada. |
| lib/dominio/irpf/cuotas/escalas-gravamen.ts | Array vacío tipado, sin cambio de reducción/cálculo. |
| lib/dominio/irpf/deducciones-autonomicas-aplicadas.ts | Inferencia y accesos revisados; mismas tablas y operaciones. |
| lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts | Los tres checks y sus productores revisados; defensa opcional arriba. |
| lib/dominio/normativa/datos/deducciones-autonomicas-2025/helpers.ts; index.ts | Map y justificación de assertions revisados. |
| lib/dominio/normativa/datos/ipc-2012-2026.ts | Tipo exige 2013–2026 y reconoce ausencia fuera; cifras intactas. |
| lib/export/auditoria-excel.ts; lib/observabilidad/auditoria-rendimiento.ts | Bytes/cabeceras, unión de detalles y reloj globalThis revisados. |
| scripts/hash-effect-sheet.ts; tests/helpers/canonical-tabular-hashes.ts | Esquemas y selección anual; algoritmo de hash intacto. |
| tests/auditoria-excel-pesada.test.ts; tests/auditoria-excel.test.ts | Discriminación conserva contrato number/string y variantes CellValue; tolerancias intactas. |
| tests/auditoria-fixture-canonico.test.ts; tests/calculo-salario-legacy.test.ts; tests/progresividad-caracterizacion-legacy.test.ts | Decode y rechazo Promise revisados; fixtures esperados no modificados. |
| tests/lint-contratos.test.ts | Tres pruebas con assertions observables, sin mocks. |
| docs/procedencia/LINT-CORRECCION.md; lint/diagnosticos.json; lint/por-regla-archivo.tsv | Informe contrastado después del código; retirada de diagnósticos concuerda con ejecución independiente. |

## Validación y límites

Memoria inicial disponible 8241 MiB, sin swap. Nix bun/nodejs, máximo un trabajador, ejecuciones secuenciales. Resultados propios:

- test:lint: correcto, fixture negativo rechazado por ambos plugins.
- lint completo en hijo: salida 0, oxlint y ESLint.
- TypeScript aplicación y vendor: salida 0 con `--incremental false` para no escribir tsbuildinfo.
- lint-contratos + retencion-trabajo-aeat: 10 pruebas correctas.
- auditoria-excel + deducciones-autonomicas-aplicadas: 9 pruebas correctas.
- Contrastes temporales descritos arriba; scripts y logs en `/tmp/irobopf-review-lint/`.

Consultados effect-solutions list y show data-modeling/error-handling. El ejecutable nativo empaquetado no arrancó en Nix; se utilizó su dist/cli.js con Bun. Consultada fuente local Effect v4: Match.string y Match.number delegan a Predicate.isString/isNumber. No se extrapolaron APIs v3.

No se repitieron las 177 pruebas, Next build, suite legacy exhaustiva, validación fiscal ni medición del bundle. La nueva suite no cubre las diferencias defensivas arriba: quedan explícitas, pero no se requiere rediseño o tests de entradas imposibles como condición de aprobación. La aprobación corresponde a estos bytes y a los contratos actuales, no a futuras entradas externas ni a cambios concurrentes posteriores en el padre.
