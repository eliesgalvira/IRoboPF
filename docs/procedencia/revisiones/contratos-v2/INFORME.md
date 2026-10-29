# Contrarrevisión de contratos v2

Revisión personal contra la base declarada `ed6a43fd750de05609abc3710dabdc2f8261020c`. Sin subdelegación, fixes ni operaciones VCS. **Las ocho reproducciones originales están corregidas dentro de su alcance; quedan dos defectos técnicos candidatos y límites históricos explícitos.** No se acepta ninguna regla fiscal ni se modifica una atestación.

Se leyeron íntegros BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO, DECISIONES, los informes deducciones-implementacion y actividades-implementacion y correcciones/integracion-ronda7/INFORME.md. Las fuentes examinadas y sus hashes están en manifiesto.json. La base es la indicada por el padre; el padre debe cotejar estos bytes con ella. No se ha usado un índice como prueba de identidad.

## Resultado por hallazgo anterior

- **DED-I-01:** corregido. Rioja conserva 125 euros parciales con una persona elegible y otra sin mínimo, en ambos órdenes; también con diagnóstico posterior de la segunda. Solo excluidos y colección vacía devuelven cero **parcial**. El agregado rechaza todos esos parciales, incluido cero. Emisión en enero de 2026 con diagnóstico en diciembre de 2025 no se excluye por emisión posterior.
- **DED-I-02:** corregida la conexión visible delimitada. El useMemo anual llama calcularDeduccionesConsignadas y no al helper de fórmulas heredadas. Dos hijos en controles específicos producen cero consignado. Solo un importe numérico con `:cumple === true` suma; ausencia o string `"true"` no habilitan. Se añade el agregado manual. La conversión posterior a céntimos sigue siendo la ruta anual. No se ha demostrado una liquidación interactiva completa en navegador.
- **DED-I-03:** corregido en API para contadores específicos y genéricos. −1, 0,5, strings `"0"`/`"1"`, NaN e Infinity se rechazan; 0 y 1 se admiten. Un contador inválido también lanza RangeError al llamar al nuevo helper de consignaciones, aunque no vaya a sumar ese contador. Es una dependencia de validación innecesaria y un riesgo de composición, pero no se ha demostrado un fallo visible: NumberField entrega números, fija mínimo cero y su formato entero se aplica mediante toValidatedNumber. Los ensayos con esa función real dan 0,5→1, −1→0 y 1,5→2. No confundir el formato con una garantía sin revisar el componente instalado.
- **DED-I-04:** corregido. Madrid rechaza NaN, ±Infinity, 2025,5 y string `"2025"` como año de evento; el control 2025 devuelve parcial. No equivale a certificar historia familiar ni modalidad.
- **DED-I-05:** corregido. Agregado vacío fuera de 2025, incluido NaN, no se etiqueta automático. Consignaciones profesionales de 2024 y 2026 conservan importe_externo, sin extender las fórmulas de 2025.
- **AEI-01:** corregido. Repetir justificante entre RETA y gasto rechaza todo el caso. Identidades `pdf#operacion-1` y `pdf#operacion-2` admiten dos operaciones del mismo documento y conservan la suma de 600 euros, pérdida −600: no deduplican por importe. Los strings representan identidad aportada, no autenticación ni comprobación de que sean operaciones diferentes. El mensaje «Documento económico repetido» es menos preciso que el contrato por operación, pero no se ha interpretado como prohibición legal de documentos agrupados.
- **AEI-02:** corregida la contradicción gruesa, **no conciliado el historial**. Hardware 1.000, 26 %, uso desde 1/1/2024 y acumulada 999 se rechaza. La frontera 260 pasa; 260,01 falla. Acumulada 1 con inicio de uso en 2025 y agotamiento prematuro de 1.000 en 2024 se rechazan. Véanse límites abajo.
- **AEI-03:** corregido. Coeficientes históricos `0.260` y `0.26` son equivalentes. NaN/Infinity como texto, signo negativo, texto arbitrario y diferencia real 0.27 se rechazan sin defecto Decimal. La validación precede a la comparación numérica.

## Hallazgos nuevos

### CV2-01 — P2: una clave con segmentos extra se trata como código de catálogo

`ambito.ts:66` toma solo el segmento anterior al primer `:` para decidir territorio; `deducciones-autonomicas-aplicadas.ts:89–91` toma todo el prefijo anterior a `:importe` como código y busca su propio `:cumple`. La entrada `andalucia_nacimiento_adopcion_acogimiento_menores:extra:importe = 100` con el correspondiente `:extra:cumple = true` suma 100. Añadir además la pareja canónica de 100 suma 200. Casos `consignar-sufijoExtra` y `consignar-duplicadoAlias`.

Objeción experta: una API de consignación puede admitir códigos libres y dos importes legítimos. Aquí el contrato y filtro prometen códigos de catálogo por ámbito; el código derivado con `:extra` no existe en ese catálogo. Motivo: exigir identidad completa evita que prefijos válidos autoricen claves ajenas o alias del mismo concepto. Coste propuesto: comprobar la clave completa y rechazar o ignorar la malformada, con regresión independiente; no limitar arbitrariamente la cuantía profesional ni autenticarla. **Exposición comprobada: API exportada.** Los controles actuales construyen claves canónicas, por lo que no se afirma doble aplicación causada por una interacción normal de UI. Es un candidato técnico, no una nueva interpretación jurídica.

### CV2-02 — P3: fechas inexistentes pasan la validación de Rioja

`contratos-2025.ts:458–463` combina regex y Date.parse. JavaScript normaliza 2025-02-29, 2025-02-30 y 2025-04-31; las tres entradas devuelven cálculo parcial 125 en lugar de no_soportado. Casos `rioja-fecha-inexistente-*`.

Objeción experta: la cuantía continúa bloqueada por el agregado y el certificado es un hecho externo. Motivo: aun sin autenticarlo, una fecha imposible no satisface la validación de calendario que el mensaje promete; puede contaminar el resultado parcial consumido directamente. Coste propuesto: validación estricta por componentes, sin inferir reglas sobre fecha de expedición o diagnóstico. No se ha probado aplicación anual ni se reabre la interpretación de la norma riojana.

## Historia, saldos y período de actividad

La cota `base * coef * (2025 − añoUso)` admite 260 acumulados con uso desde **31/12/2024**, y en 2025 calcula otra cuota 260. La cota toma un año civil entero pese a un único día de uso. También admite acumulada cero desde 1/1/2024 y calcula 260 en 2025. El segundo caso no demuestra por sí mismo ilegalidad: el motor no reconstruye cuotas contabilizadas, ajustes ni omisiones. Son límites de la conciliación, no dos regresiones nuevas encubiertas.

Se reabrió y verificó por SHA-256 el original BOE-A-2015-7771, páginas físicas 9–10. El artículo 3.3 sitúa el comienzo de la amortización en la puesta en funcionamiento; el 4 distingue coeficientes y contempla amortizaciones contabilizadas inferiores en períodos anteriores. La extracción directa se conserva. No se usa una conversión Markdown como evidencia. No se determina aquí una cuota diaria exacta de 2024 ni se cierra la cadena normativa de EDS. La cota conservadora **no puede presentarse como historial conciliado**; el propio informe integrado lo reconoce.

Objeción experta: admitir un saldo aportado no demuestra que sea coherente con un método constante y sus fechas. Decisión: reconocer el fix mínimo de AEI-02 y mantener abierta la conciliación por períodos, vida útil y documentación; no cambiar saldos para conseguir una cifra. Coste: menor garantía de `soportado`, que significa cálculo condicionado y revisión pendiente. Si se exige garantía histórica completa, hará falta ampliar hechos o restringir admisión antes de conectarlo al anual. El adaptador sigue declarando `liquidacionAnual: no-calculada`; no se ha conectado actividad al salario.

## Estado y ámbito visibles

El callback del cambio de comunidad reinicia las entradas y el componente manual conjuntamente. A→B→A con diccionario conservado en API produce 100→0→100; esa es una prueba del filtro, **no** del estado React. En la UI el reinicio descarta las consignaciones anteriores. La inspección de la closure confirma que utiliza setters y las entradas iniciales; no se hizo montaje React ni navegador.

El campo agregado muestra el total y guarda `max(0, valor − consignacionesDelCatalogo)`. Por ello no puede reducirse por debajo de las consignaciones activas desde ese campo: hay que retirarlas en el catálogo. Es comportamiento existente, no contaminación entre territorios. La etiqueta «Deducción consignada» más el aviso delimita la menor automatización; los controles parciales continúan expuestos, pero ya no alteran automáticamente la cuota. Coste: controles antiguos menos útiles y pérdida de datos al cambiar comunidad, aceptables dentro del encargo sin rediseño.

No se ha encontrado una fuga territorial entre entradas canónicas. La aceptación de códigos libres en evaluarConsignacion es otro contrato profesional que exige igualdad de contexto y soporte; no se le impone el catálogo de 2025. Los cálculos parciales exportados siguen accesibles a consumidores API. No se debe publicitar esa accesibilidad como evaluación de elegibilidad.

## Reproducción y cinco planos

`casos/sondeos.mjs.txt` conserva el instrumento ejecutado: copiarlo a `.cache/revision-contratos-v2/sondeos.mjs` desde la raíz del checkout y ejecutar `nix shell nixpkgs#bun -c bun .cache/revision-contratos-v2/sondeos.mjs`. Importa las funciones reales. Requiere los casos históricos versionados de actividades y el node_modules del proyecto; la salida usa la carpeta absoluta asignada. **165 sondeos**, de los cuales 79 reproducen entradas de la revisión anterior y 86 son adicionales; no son 165 aserciones verdes. `resultados.json` conserva entradas, expectativas y salidas. NaN e infinitos se serializan con nombre textual; el programa distingue el tipo original.

Las cinco suites focalizadas pasan **103 tests** con un trabajador; lint global y typecheck aplicación/vendor terminan en cero. Logs adjuntos. Se serializaron bajo `flock /tmp/irobopf-validacion-pesada.lock`; memoria disponible medida antes. Sin Next build, suites legacy pesadas ni regeneración de inventario. No se escribió código Effect: no hizo falta consultar patrones para implementar Effect. No se cambió producto, package, lockfiles, CI, normas ni registros. Los instrumentos son reproducciones conservadas, no fuentes de producto exentas de lint.

- **Integridad:** hashes de fuentes examinadas, instrumento, resultados, logs y original releído; no certifican emisor ni equivalencia con una base no cotejada por VCS en este hijo.
- **Autenticidad:** no validación nueva de PAdES, CSV o confianza histórica; original procedente de caché autorizada, sin descargas nuevas.
- **Interpretación:** los hallazgos nuevos son validación técnica e identidad de claves. La discusión histórica usa el original y no amplía la aceptación jurídica.
- **Exactitud:** casos observados y 103 tests, limitados a hechos suministrados. Sin oracle fiscal nuevo ni prueba completa de interacción UI.
- **Aceptación:** ninguna regla, binding, snapshot o declaración se autoacepta. Dos candidatos nuevos requieren decisión del padre; AEI-02 conserva su limitación explícita. No se migra la atestación madrileña.
