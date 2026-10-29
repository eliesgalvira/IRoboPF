# Revisión independiente de deducciones autonómicas B

29 de octubre de 2026. Revisor independiente, sin subdelegación. **Requiere cambios.** Se revisan los 196 candidatos, con decisión y alcance individual en `revisiones.json`. Hay 194 aceptaciones limitadas, un rechazo y un caso que requiere evidencia. **No son 194 reglas fiscales aceptadas**: 183 aceptaciones se refieren exclusivamente a carencias de evaluación del catálogo. La revisión jurídica completa de esas 183 reglas permanece pendiente.

Solo se han escrito esta carpeta y el scratch `.cache/procedencia/revision-deducciones-autonomicas-b/`. No se han modificado motor, tests mantenidos, informes del autor, ESTADO, DECISIONES ni metadatos VCS. No se han realizado commits, push, PR, despliegue ni inicialización JJ. Ejecución secuencial de pruebas pequeñas; adquisición serializada mediante el lock del helper, User-Agent y ritmo del proyecto. No builds ni suite legacy.

## Cobertura y significado de la decisión

Se importó el catálogo actual y se ejecutaron sondas individuales de las 183 fichas: Extremadura 19, Galicia 25, Baleares 24, Rioja 24, Madrid 23, Murcia 28 y Valenciana 40. Las fichas actuales coinciden con las fichas candidatas, aunque los hashes de algunos archivos envolventes y del evaluador cambiaron tras lint. `estado-codigo.json` conserva ambos hashes; una diferencia entre snapshots no se llama corrupción.

Las rutas observadas son 174 manuales (124 controles específicos y 50 genéricos), ocho genéricas y una parcial madrileña. Cada ID tiene razón, archivo/línea/hash, evidencia, objeciones y `acceptanceScope`. Las sondas no aceptan por sí mismas una norma: demuestran que el evaluador toma un importe externo o aplica una operación sin representar los hechos requeridos. La lectura del evaluador y de sus llamadas fundamenta la conclusión técnica. Las secciones oficiales son contraste informativo, no sustituto de la disposición.

`cobertura.json` enumera los 196 IDs, sin omisiones ni duplicados, conserva el estado previo y permite distinguir las reclasificaciones. `comprobacion-individual.json` conserva fichas y resultados propios. Todos los `DAB-COV-*` mantienen `legalReview.status=needs-evidence` para la regla fiscal completa. Esto es una limitación sustantiva: **no se ha concluido una revisión jurídica exhaustiva de todos los requisitos de las 183 fichas**.

## Hallazgos accionables

### P1: falta de aislamiento por año y territorio

`DAB-ruta-territorial` pasa de ambiguous a missing aceptado, con alcance estático. En `components/liquidacion-irpf.tsx:599` el helper se invoca para toda comunidad salvo simulada-estatal; no recibe año ni comunidad. El selector territorial usa directamente el setter en línea 1342. El diccionario de entradas es único y no se limpia en esa transición. El agregado se transmite a la liquidación.

Reproducción preparada: introducir nacimiento en Madrid, cambiar a Murcia conservando el diccionario y volver a evaluar. El helper continúa produciendo 721,70 porque no conoce el territorio. No se ha realizado navegación interactiva ni se afirma una explotación de navegador observada. Tampoco debe heredarse el catálogo 2025 a 2012–2024 o 2026.

Criterio para el orquestador: contrato explícito de ejercicio/territorio y estado por caso; rechazar o excluir entradas de otro ámbito antes de sumar. La ocultación visual no basta. Mantener una vía separada de importe externo, con ámbito declarado y procedencia.

### P1: límite de cuota demasiado estrecho

`DAB-cuota-ahorro` pasa de ambiguous a mismatch aceptado. `liquidar-irpf-anual.ts:516–531` limita el agregado mediante la cuota autonómica **general** disponible. Los artículos 73 y 77 LIRPF remiten a la cuota íntegra autonómica, que comprende general y ahorro; se contrastó también la redacción del artículo 77 en el original modificador de 2014.

Caso discriminante preparado, **no ejecutado en la liquidación**: cuota autonómica general disponible cero, ahorro disponible 100 y deducción admisible 75 sin regla especial. La expresión actual permite cero. El límite general universal pierde capacidad de deducción.

No autoriza sustituirlo ciegamente por una suma ni valida el cálculo previo del mínimo del ahorro. Hace falta separar componentes, titulares y reglas especiales de deducción, excesos, reintegros y arrastres antes de fijar un contrato de liquidación completo.

### P2: seis contraejemplos aceptados con hechos y alcance limitados

Las ocho salidas iniciales se reprodujeron personalmente sobre el código actual. `casos.json` separa observación ejecutada, expectativa fiscal condicionada y derivaciones estáticas.

- **Madrid sin requisitos:** 721,70 con un hijo frente a ausencia de derecho si la BI individual es 30.930,01. La entrada del helper ni contiene la base ni exige elegibilidad. Contrastar también BI exactamente 30.930, límite conjunto 37.322,20 y suma familiar 61.860, sin confundir BI con BL.
- **Madrid gemelos:** 1.443,40 frente a 2.886,80 para dos nacidos en evento múltiple en 2025, un único progenitor con derecho y convivencia, bases bajo límites. El incremento es por cada hijo en el primer período; no se extiende a los dos siguientes. Un hijo nacido en ejercicio previo exige revisar hechos y límites del período correspondiente.
- **Murcia:** gasto admisible de 5.000 por cada uno de dos hijos elegibles, único progenitor con derecho: 1.000 observado frente a 2.000. El límite es por hijo. Caso adicional ejecutado: un hijo, 10.000 de gasto común, dos progenitores convivientes con derecho en individual; introducir la mitad del gasto todavía produce 1.000 en vez del límite prorrateado de 500. Repartir gasto no implementa el reparto del tope.
- **Baleares:** dos ascendientes elegibles y 2.000 satisfechos por cada uno: 660 observado frente a 1.320. Se exigen mínimo, edad, servicio, base y medio de pago admitido. El artículo 6 quinquies.3 permite a contribuyentes con ascendientes comunes aplicar íntegramente su deducción; el apartado 5 establece reparto por mitades para descendientes comunes en individual. No copiar una prorrata universal. Debe examinarse también la incompatibilidad del apartado 6 con conciliación de menores.
- **Rioja:** cero personas diagnosticadas y cumple=true produce 250; debe rechazarse esa combinación o resultar cero. La sonda adicional con media unidad produce también 250: no representa la prorrata de 125 por persona común entre dos contribuyentes con derecho. No se prescribe una interfaz que admita personas fraccionarias; se necesita representar titularidad.
- **Extremadura:** mismo contribuyente viudo, trabajo íntegro 10.000, otros rendimientos cero y bases bajo límite: 175 observado frente a elección de 100. El artículo 7.4 hace incompatible la viudedad con trabajo dependiente para ese contribuyente. No bloquear ambas deducciones por declaración si corresponden a personas distintas. No se ejecutó liquidación conjunta.

Estas aceptaciones no certifican todos los supuestos de ninguna de las seis reglas. Los hechos no contenidos en el contrato del helper se declaran expresamente como condiciones externas.

### P2: Valenciana requiere evidencia adicional; no transformar un candidato en fix

`DAB-NUM-valencia_reduccion`: **needs-evidence**. Se reprodujo 197. El original DOGV de 2022 contiene los 197 por ascendiente y la reducción sobre BL general más ahorro entre 27.000 y 30.000 en individual. Para BL 28.500, la operación propuesta da 98,50.

Se recuperaron la Ley 5/2025, el Decreto ley 14/2025 y la corrección de enero de 2026. La corrección consultada se refiere a arrendamiento, no prueba por sí misma la vigencia completa de ascendientes. No se ha cerrado aquí toda la cadena, incluida convalidación y alcance de las reformas posteriores. La ausencia de BL en el contrato sí está demostrada; la expectativa fiscal continúa candidata.

No confundir esta reducción del importe con la reducción del límite del deporte. Mantener separados modalidad, parentesco, edad, discapacidad acreditada, convivencia, rentas del ascendiente, declaración presentada y concurrencia de titulares. El supuesto de mayor de 75 sin discapacidad evita introducir innecesariamente las reformas sobre acreditación de discapacidad, pero no sustituye el cierre temporal.

### Galicia: rechazar la clasificación de importe manual como fallo aritmético

`DAB-NUM-manual_arbitrario`: **rejected**, reclasificado a carencia ya cubierta por `DAB-COV-galicia_familias_dos_hijos`. La ruta está definida como importe_manual. Aceptar 999999 demuestra ausencia de verificación, no que una fórmula fiscal haya calculado mal 250. Un profesional debe poder introducir un importe externo; no corresponde imponerle un tope de 250 sin hechos.

Se ejecutó además un caso distinto: mismo contribuyente, dos descendientes y título de familia numerosa general, sin incremento de discapacidad; introducir 250 por cada concepto devuelve 500. El artículo 5.Tres.4 declara incompatibles las deducciones de ese apartado. Antes de corregir, modelar titular, descendientes compartidos y prorrateo. No trasladar automáticamente la regla de persona de Extremadura a toda combinación gallega o a toda conjunta.

### Integración y documentación

`DAB-reglas-tipadas-no-ejecutadas` se acepta como carencia técnica: `liquidar-irpf-anual.ts:1152` devuelve no soportado para la primera deducción tipada incluso reconocida; el agregado entra por una vía distinta en línea 1276. El catálogo no acredita una regla de liquidación.

`DAB-version-documental` se reclasifica a falta de vínculo inmutable de edición. El original AEAT conservado tiene 635 páginas, hash 765c89ade626… y fecha impresa de octubre de 2026; trata Renta 2025. Se comprobaron personalmente hash y los 9.924 recortes de texto de 183 grupos, sin discrepancias. Eso no identifica la edición anterior ni demuestra que toda página codificada sea errónea. No se ha recuperado la antigua edición de abril para cotejo visual.

## Cadena primaria ampliada

Las descargas nuevas están en `fuentes-nuevas.json`, con URL, hash, tamaño, fecha de recuperación y ruta CAS propia. Se usó `tools/procedencia/descargar.py`; las reutilizaciones comprobaron hash. Las citas conservan página física 1-based, texto reextraído y cajas en puntos PDF con origen superior izquierdo. Los HTML tienen selectores y hash, sin páginas ni cajas inventadas.

- Madrid: Ley 13/2023, original BOE-A-2024-5610, artículos 4 y 18 y efectos desde 2023; Ley 5/2024, BOE-A-2025-3303, reproduce los límites del artículo 18 con efectos desde 2024. Se recuperó Ley 6/2025, BOE-A-2026-3218: su entrada en vigor es 1-1-2026; no fundamenta una extensión global a 2025. El artículo 4 no aparece modificado por esas reformas posteriores en el índice legal inspeccionado.
- Murcia: Ley 14/2018, BOE-A-2019-2039, artículo 56.Uno, nueva redacción completa del apartado Tres desde 1-1-2019 y vigencia indefinida. Ley 3/2025, BOE-A-2025-16147, artículo 55: sus modificaciones enumeradas no incluyen ese apartado Tres. El contraste con el texto legal y el manual 2025 se usa como contraprueba, no como sustituto del original.
- Baleares: Ley 7/2024, BOE-A-2025-720, disposición final 11.3, redacción completa de cuidados, páginas físicas 155–156; entrada en vigor ligada a publicación BOIB, no a la fecha BOE de enero. Se recuperó también Ley 6/2025, BOE-A-2025-22028, sin usar sus otras deducciones como autoridad de cuidados.
- Rioja: Ley 9/2025, BOE-A-2026-991, artículo 1.4 y disposición final única.2. La entrada general es 1-1-2026, **pero celiaquía tiene efectos retroactivos 1-1-2025**. El original identifica publicación BOR 30-12-2025; el BOE es 17-1-2026. Se descarta la objeción de que necesariamente sea una deducción solo de 2026.
- Galicia: originales Ley 10/2023 (BOE-A-2024-2777), Ley 5/2024 (BOE-A-2025-2145) y Ley 5/2025 (BOE-A-2026-3385). La última no puede aplicarse íntegramente a 2025 por estar publicada el 31 de diciembre: contiene entrada general 2026 y excepciones específicas.
- Valenciana: DOGV del Decreto ley 14/2022, Ley 5/2025 y Decreto ley 14/2025, más corrección de enero de 2026. Se conserva la limitación indicada para la decisión numérica.
- Extremadura: original del texto refundido de 2018 y artículos 2 y 7 reextraídos del HTML. Se distingue la incompatibilidad por contribuyente de la presencia de distintos titulares en una declaración.
- LIRPF: original base y Ley 26/2014, BOE-A-2014-12327, modificación del artículo 77. Los artículos 73, 68.4 y 77 están reextraídos del HTML, con selectores explícitos.

Se inspeccionaron visualmente las páginas originales de Madrid y Baleares citadas, sin tachado visible en esos pasajes. **No se ha hecho inspección visual completa de todos los PDF**. Los bloques seleccionados conservan contexto y pueden incluir párrafos vecinos: no se atribuye una página entera a una regla. No se validaron firmas PAdES, CSV ni sello de tiempo; hash e HTTPS no equivalen a esa autenticación. La conservación local del CAS no garantiza disponibilidad pública duradera.

## Ceuta, Melilla, forales y ejercicios

`DAB-CEUTA-MELILLA` se acepta solo como delimitación: arrays vacíos no eliminan el beneficio del artículo 68.4 LIRPF ni habilitan importar una deducción de Madrid. El reparto entre cuotas no es el porcentaje del beneficio. La lógica de retención no acredita la liquidación anual.

Navarra y los tres territorios históricos requieren puntos de conexión, normativa y módulo propio; su ausencia del catálogo común no prueba inexistencia de deducciones. No se acepta ninguna regla foral en esta revisión.

No se certifica cobertura histórica 2012–2024, vigencia íntegra de 2026 ni cierre del ejercicio 2026. Las publicaciones de 2026 recuperadas se identifican por fecha y efectos concretos. Las correcciones del padre sobre el límite de escala de Madrid 2020 y la etiqueta de año son ajenas a estas deducciones; no se reabren ni se presentan como defectos actuales.

## Objeciones expertas y trabajo pendiente

Se mantienen las cinco objeciones del autor con estos ajustes: conservar importe externo profesional; representar personas y gastos por beneficiario, no solo contador; Madrid requiere historial del evento y bases del período; Valenciana necesita base liquidable y reducción específica del objeto correcto; la cadena histórica exige originales y efectos, no una URL fechada.

No aceptar nuevos contratos fiscales por el número de tests que pasan. Las pruebas propias ejecutan el helper; los hechos no modelados siguen fuera de él. El caso de cuota y la conjunta entre personas distintas son propuestas no ejecutadas. No se modificaron las expectativas del autor ni se usaron sus reportes como autoridad fiscal. El Excel no se cargó y no se presenta legacy como contraprueba normativa.

El orquestador puede usar `casos.json` para construir pruebas fallidas sobre su contrato definitivo. Antes de ampliar cálculo legal deberá cerrar los requisitos por ficha, identidad de beneficiarios y titulares, reglas de cuota y cadena temporal pendiente. La revisión individual de candidatos está cubierta; el cierre jurídico de las 183 deducciones no lo está.

## Reproducción de esta revisión

Desde la raíz del repositorio:

```sh
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-deducciones-autonomicas-b/runtime.ts
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-deducciones-autonomicas-b/contrapruebas.ts
```

Son sondas propias, no tests mantenidos. Los resultados archivados son `comprobacion-individual.json` y `casos.json`. No hay una afirmación de suite fiscal aprobada. La reextracción de citas se realizó con Python aportado por Nix y PyMuPDF mediante uv; el script propio `evidencia.py` registra las 183 comprobaciones en `comprobacion-citas.json`. Las selecciones adicionales están en `pdf.py`; no se renderizaron manuales completos.

Los hashes actuales identifican el estado leído en este checkout compartido. Si el padre cambia el helper posteriormente, debe repetir las sondas; no modificar los resultados históricos para aparentar que corresponden al nuevo código.
