# Escalas estatales y ahorro, 2012–2026: análisis documental

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Todos los hallazgos son **candidatos, pendientes de contrarrevisión independiente**. No se ha cambiado cálculo, añadido pruebas al repositorio, aceptado hallazgos ni realizado operaciones VCS mutantes. La fecha de consulta es 29 de octubre de 2026; no equivale al cierre normativo del ejercicio.

La entrega contiene 42 hallazgos: 31 coincidencias de alcance limitado, cinco discrepancias, cuatro carencias y dos cuestiones ambiguas. Una coincidencia de tabla no valida la liquidación que la consume. Se examinaron los quince ejercicios, los componentes estatales de los catorce módulos autonómicos 2012–2025, el selector territorial, las cuatro escalas conjuntas legacy, todas las variantes del ahorro y la integración que alimenta su cuota.

## Diferencias que debe intentar refutar el segundo auditor

1. **Mínimo del ahorro 2012–2014 (`EEA-MINIMO-AHORRO-2012-14`).** Con base general cero, ahorro 10.000 € y mínimo 5.151 € en ambos componentes, el motor obtiene 1.178,29 € después del mínimo. El procedimiento histórico da 1.018,29 €: se grava 4.849 €, después de restar el mínimo de la base. Diferencia: **160 € de exceso**. No se aplica aquí la fórmula posterior de restar cuotas. Ley 39/2010, PDF páginas 64; RDL 20/2011, página 53; prórroga Ley 22/2013, páginas 75–76; manual AEAT 2014, página PDF 467 (impresa 449) y 473 (455).
2. **Mínimos distintos (`EEA-MINIMOS-DISTINTOS`).** La liquidación toma el mayor remanente y lo grava con la tarifa conjunta para minorar la cuota. Debe aplicar a cada componente su propio mínimo. Con ahorro 10.000 €, base general cero, mínimo estatal 5.550 € y autonómico 5.956,65 €, en 2025 calcula 848,2365 € frente a 886,86825 €: liquidado, **848,24 frente a 886,87 €**. Es un fixture de fórmula con mínimos suministrados; el segundo importe coincide con el parámetro Madrid del motor, cuya legalidad autonómica debe acreditar el auditor de mínimos. La discrepancia solo se materializa si queda mínimo para el ahorro y difieren los componentes; no afecta a todos los contribuyentes de todos los años.
3. **Pérdidas convertidas en exención negativa (`EEA-PERDIDAS`).** Ejecutada la función existente con edad 40, año 2025, sin exenciones y transmisiones +10.000/−4.000 €, devuelve ganancia total 6.000 €, exenta −4.000 € y sujeta al ahorro 10.000 €. El saldo sujeto debe ser **6.000 €**, exenta cero. No es simplemente la ausencia de compensación entre compartimentos: se elimina una pérdida dentro del propio compartimento de ganancias. Para 2013–2014 el caso debe incluir permanencia superior al año.
4. **Cuotas fijas 2012–2014 (`EEA-CUOTAS-FIJAS`).** La escala estatal fusionada suma anchuras por tipos y no representa cuotas fijas normativas. Con base 17.707,21 € obtiene 2.257,6696 €; las filas oficiales dan 2.124,86 + 132,80 + 0,01×(14%+2%) = **2.257,6616 €**. A céntimos: **2.257,67 frente a 2.257,66**. La prueba usa un céntimo sobre el corte para evitar que una discusión sobre inclusión del extremo o redondeo en el corte oculte el problema. Hay que contrarrevisar también la política de redondeo por componente, antes de cambiar el algoritmo genérico.
5. **Límites legacy truncados (`EEA-LEGACY-LIMITES`).** Python, Excel y `TRAMOS_IRPF_HASTA_2014` usan 17.707/33.007/53.407/120.000/175.000/300.000; las tablas normativas usan esos límites **más 0,20 €**. Los componentes estatales territoriales sí conservan los céntimos. No se propone romper la compatibilidad legacy: se debe identificar su naturaleza de simplificación y evitar presentarla como tarifa legal.

Los cinco hallazgos incluyen input, resultado actual, esperado y prueba propuesta en `hallazgos.json`. Los ejemplos antes de mínimo y los ejemplos después de mínimo son distintos objetos: no deben mezclarse para medir diferencias finales.

## Tablas y vigencia examinadas

### General estatal

- **2012–2014:** base 12/14/18,5/21,5/22,5/23,5%; complemento 0,75/2/3/4/5/6/7%; tarifa fusionada 12,75/16/21,5/25,5/27,5/29,5/30,5%. Límites 17.707,20; 33.007,20; 53.407,20; 120.000,20; 175.000,20; 300.000,20. La base procede de Ley 39/2010 art.62; el complemento de RDL20/2011 disposición final segunda; la prórroga 2014 de Ley22/2013 art.64. Se comprobaron también las constantes BASE y COMPLEMENTARIO separadas, que no impiden la pérdida de cuotas fijas al ejecutar la fusionada.
- **2015:** límites 12.450; 20.200; **34.000**; 60.000; tipos 9,5/12/15/18,5/22,5%. Cuotas fijas 0; 1.182,75; 2.112,75; 4.182,75; 8.992,75. RDL9/2015 art.1, modificación DA31, efectos desde 1 de enero. No es tarifa anual 9,75/12,25/... ni promedio por días. La retención anterior al 12 de julio usa 20/25/31/39/47%; desde entonces, 19,5/24,5/30,5/38/46%. La opción de regularización en agosto no altera la escala anual estatal. El código estatal es correcto en este punto.
- **2016–2020:** mismos tipos, tercer límite **35.200**, cuota fija a 60.000 de **8.950,75**. Ley26/2014 art.1.39. Los cinco módulos anuales declaran las mismas cifras. Manuales oficiales 2017, 2018 y 2019 aportan corroboración histórica adicional; no se usan sus transcripciones del repositorio como evidencia.
- **2021–2026:** tramo adicional desde 300.000 al **24,5% estatal**, cuota fija **62.950,75**. Ley11/2020 art.58, vigencia indefinida desde 1 de enero de 2021. Se conservó además HTML BOE actual efectivamente recibido al consultar 2026 con el artículo y las referencias de modificación. El selector 2021–2024 reutiliza la constante llamada 2025: coincidencia numérica, no prueba por el nombre del símbolo.

El **47% conjunto legacy desde 2021 no se puede dividir por dos ni duplicar para verificar el 24,5% estatal**. La rama `simulada-estatal` usa cuota conjunta legacy y cero cuota autonómica separada; su nombre no garantiza que ambas escalas coincidan. Debe mantenerse visible como supuesto técnico.

### Ahorro conjunto y componentes

- **2012–2014:** 21/25/27%, límites 6.000 y 24.000. Estado: 9,5/10,5% ordinario más recargo 2/4/6%; autonomía: 9,5/10,5%. El recargo es exclusivamente estatal. Con mínimos iguales se puede sumar tipos, después de reducir la base según regla histórica.
- **2015:** 19,5/21,5/23,5%, límites 6.000 y 50.000. Estado **9,5/10,5/11,5** y autonomía **10/11/12**. No son mitades iguales. Cuotas fijas conjuntas 0/1.170/10.630. Original RDL9/2015 páginas 9–10 y manual AEAT2015 página PDF528 (498 impresa).
- **2016–2020:** 19/21/23%, límites 6.000/50.000; componentes iguales. Cuotas fijas conjuntas 0/1.140/10.380. Ley26/2014 artículos 66 y 76, sin la excepción anual de 2015.
- **2021–2022:** añade 26% desde 200.000; cuota fija conjunta allí 44.880. Ley11/2020 art.59, páginas 82–83.
- **2023–2024:** 27% entre 200.000 y 300.000; 28% sobre 300.000. Cuota fija conjunta a 300.000: 71.880. Ley31/2022 art.63, páginas 88–90.
- **2025–2026:** último tipo **30%**, compuesto por 15% estatal y 15% autonómico; resto sin cambio. Ley7/2024 disposición final séptima, páginas 110–112. Una base de 300.001 € genera 71.880,30 € antes de mínimos, frente a 71.880,28 en 2024. Coincide la tabla del motor; 2026 hereda explícitamente la de 2025 en el selector de ahorro y su vigencia se contrastó además con el contenido actual BOE HTML.

## Integración, compensación y fronteras

`calcularBaseImponibleAhorro` solo hace `max(0, gananciaSujetaAhorro)`. No recibe año, rendimientos del capital mobiliario, saldos pendientes ni reducciones de base. Por ello la variable que la liquidación llama base liquidable del ahorro no representa todas las operaciones entre base imponible y liquidable.

El art.49 impone integrar pérdidas y ganancias dentro de su compartimento y rendimientos del capital dentro del suyo. En el régimen ordinario, fuera de la excepción DA39 de preferentes y deuda subordinada, la compensación cruzada era inexistente en 2012–2014; fue 10% en 2015, 15% en 2016, 20% en 2017 y 25% desde 2018. Ley26/2014 página25 y DA12 añadida en página50. Con capital positivo 1.000 y pérdidas −500, bases esperadas: 1.000/900/850/800/750 según esos periodos; remanentes 500/400/350/300/250. Se proponen pruebas de signo inverso, saldo cero, agotamiento del límite y caducidad en el cuarto año siguiente.

La DT7 modificada por Ley26/2014, páginas57–58, exige conservar origen y ejercicio de pérdidas 2011–2014. No se debe permitir cruzar indiscriminadamente saldos antiguos con capital positivo por el nuevo porcentaje. Las pérdidas de transmisiones de corta permanencia 2013–2014 pendientes pasan al compartimento de ganancias del ahorro; las demás pérdidas generales conservan su régimen. Un saldo ahorro de 2014 puede compensarse hasta 2018, no en 2019. `EEA-SALDOS-TRANSITORIOS` incluye casos concretos; todavía falta representar esos saldos en el motor. La ordenación completa de varios saldos concurrentes queda pendiente de prueba exhaustiva, no se declara validada.

La clasificación de transmisiones es distinta en 2013–2014: el motor exige fecha posterior al aniversario para ahorro y usa general en igualdad. Si faltan fechas elige ahorro; esa suposición no acredita permanencia. En 2012 y desde 2015 la transmisión va a ahorro sin esa restricción. Los originales de clasificación y exenciones pertenecen también al auditor de ganancias; aquí se identifica la dependencia y no se acepta su legalidad por una prueba existente.

Para escalas crecientes y bases finitas, `min(max(base-límiteAnterior,0), ancho)` no cuenta dos veces el extremo. Con céntimos, el tramo siguiente empieza a producir cuota en límite+0,01. Python usa `>` y rompe en igualdad; TS omite segmentos de importe cero. Las salidas económicas son compatibles en esos extremos aunque los desgloses no contengan igual número de filas. Se verificaron 348 casos con Decimal independiente y ejecución real TS/Bun, todos coincidentes **con la fórmula por anchuras**, no con todas las cuotas fijas legales.

`Infinity` es un centinela técnico válido como último límite para bases finitas, no una cantidad de dinero admisible. `base.mul(0)` con Infinity/NaN propaga NaN. Debe fijarse la precondición de entrada finita; no se atribuye a la ley una política informática. Tipos en fracción y dinero en euros se conservaron como Decimal; no se redondeó cada tramo por intuición. Las pruebas incluyen −0,01/0 y los vecinos centesimales de cada límite. La exportación redondea tipos y el Python usa float: ninguna de esas representaciones resuelve la norma.

## Territorios y cobertura efectiva

Se enumeran los quince años por 17 territorios comunes, `simulada-estatal` y los dos regímenes forales excluidos, para cuatro familias: **1.200 entradas de cobertura**. Es un registro de alcance, no 1.200 liquidaciones verificadas ni 1.200 reglas territoriales diferentes.

El componente estatal y la tarifa del ahorro comunes se examinan para Andalucía, Aragón, Asturias, Illes Balears, Canarias, Cantabria, Castilla-La Mancha, Castilla y León, Cataluña, Extremadura, Galicia, Madrid, Murcia, La Rioja, Comunitat Valenciana, Ceuta y Melilla. Las deducciones territoriales posteriores y tarifas generales autonómicas están fuera de este lote. No se confunde tarifa común con tributación efectiva idéntica en Ceuta/Melilla.

Navarra y País Vasco no están en `ComunidadAutonoma`: no se les atribuyen escalas estatales comunes. En 2026 los 17 territorios reales devuelven `ComunidadAutonomaNoSoportada`; solo se admite el caso técnico `simulada-estatal`, con más restricciones de perfil en la liquidación. Los componentes normativos de 2026 no convierten esa limitación en cobertura real.

## Evidencia, reproducción y límites

`documentos.json` conserva 19 adquisiciones: once normas originales PDF, seis manuales históricos AEAT y dos HTML BOE (uno descartado como evidencia histórica). Metadatos: URL canónica/final, instante UTC, HTTP, cabeceras recibidas, SHA256 y SHA512, tamaño, MIME, localPath e identificador/versión. Las fechas editoriales exactas de los manuales quedan pendientes: el año fiscal no se ha presentado como fecha de publicación. Los originales se adquirieron mediante `tools/procedencia/descargar.py`, serializado y con User-Agent IRoboPF; se reutilizaron blobs de la caché compartida tras verificar SHA256. No hubo descargas propias paralelas.

`citas-candidatas.json` contiene 2.308 candidatos: 2.304 bloques/celdas PDF y cuatro selectores HTML. Las cajas están en puntos, origen superior izquierdo y páginas PDF 1-based. Las celdas geométricas son 0-based e incluyen encabezados; no equivalen aún a ids semánticos de parámetro. Las citas incluyen texto exacto reextraíble con `get_textbox`; los selectores HTML declaran su normalización y no fingen página ni facsímil. Hay bloques contextuales además de cifras pertinentes: el segundo auditor deberá seleccionar los que sostienen cada afirmación. `sources.citationIds` enlaza los candidatos de las páginas relevantes.

No se han validado firmas PAdES, CSV, cadena de confianza, WARC ni sello de tiempo. Hashes prueban integridad de lo descargado, no identidad del firmante. No se renderizaron manuales completos ni se generaron recortes raster; están disponibles originales y coordenadas para producirlos después de contrarrevisión. Los informes no dependen de transcripciones `docs/fuentes/*.md` como prueba.

Artefactos auxiliares: `escalas-extraidas.json` (26 arrays explícitos, 142 filas, más alias documentados por ejercicio), `fronteras-python.json` (57 casos de la función pura Python extraída por AST sin ejecutar generación Excel), `fronteras-runtime.json` (348 comparaciones), `excel-control-tramos.json` (87 filas de datos y cabecera, celdas exactas y hash del libro), `snapshot-motor.json` (rutas y hashes). Leer el control Excel no verifica todas las hojas DAT ni pretende hacerlo.

Comandos ejecutados desde la raíz, con scripts propios en `.cache/procedencia/escalas-estatales-ahorro/`:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/escalas-estatales-ahorro/descargas.py
nix shell nixpkgs#python3 -c python .cache/procedencia/escalas-estatales-ahorro/mas-descargas.py
nix shell nixpkgs#python3 -c python .cache/procedencia/escalas-estatales-ahorro/comprobar.py
nix shell nixpkgs#python3 -c python .cache/procedencia/escalas-estatales-ahorro/excel.py
nix shell nixpkgs#bun -c bun .cache/procedencia/escalas-estatales-ahorro/runtime.mjs
```

Para PyMuPDF se utilizó `nix shell nixpkgs#uv nixpkgs#python3 nixpkgs#stdenv.cc.cc.lib`, Python de Nix explícito en `uv run --python`, dependencia puntual `--with pymupdf` y `LD_LIBRARY_PATH` al lib del compilador Nix. Scripts de extracción: `manuales.py`, `buscar-paginas.py`, `paginas.py`, `citas.py`, `verificar.py`. `verificacion-citas.json` registra la comprobación geométrica, no una aceptación fiscal.

## Decisiones y coste explícito

- **Separar tablas, fórmulas y cobertura.** Objeción experta: un `match` podría interpretarse como validación anual. Motivo: permitir localizar la coincidencia numérica sin ocultar los fallos de integración. Coste aceptado: varios hallazgos por ejercicio y explicación expresa del alcance; todos siguen pendientes.
- **Conservar legacy como referencia observable.** Objeción experta: copiarlo como norma duplica una simplificación. Motivo: distinguir error normativo de ruptura de contrato de compatibilidad. Coste: mantener dos referencias y pruebas distintas; conservar la referencia Python/Excel.
- **No cerrar el problema de redondeos con una regla inventada.** Objeción experta: la cuota fija publicada y el redondeo de cada componente pueden cambiar céntimos. Motivo: aportar caso que diverge y ambos originales antes de cualquier fix. Coste: dejar política definitiva pendiente del auditor de redondeos y del segundo revisor.
- **Reutilizar caché oficial y conservar citas candidatas amplias.** Objeción experta: una caja exacta no demuestra relevancia jurídica ni firma. Motivo: evitar peticiones duplicadas y permitir relectura del original. Coste: validación de autenticidad y selección semántica todavía pendientes; ningún facsímil anunciado como ya generado.
- **No convertir el rechazo 2026 en éxito.** Objeción experta: disponer de la escala estatal no basta para una liquidación regional. Motivo: expresar exactamente qué puede ejecutar el motor. Coste: 2026 continúa incompleto; no se heredan silenciosamente normas autonómicas 2025.

El análisis encuentra problemas sustantivos y cubre todas las variantes de tablas del ámbito. No constituye una auditoría aceptada exhaustiva de todos los casos fiscales: quedan la contrarrevisión, pruebas rojas previas a corrección, saldos concurrentes/transitorios completos, especialidades no modeladas (anualidades y rentas exentas con progresividad), facsímiles y autenticación. Ninguna de estas lagunas se ha marcado como validada.

## Ampliación de la comprobación histórica

Se descartó expresamente el HTML solicitado con `p=20120101`: el contenido recibido contenía la redacción actual del art.49. El parámetro de URL no acredita la versión servida. Se eliminó de todas las fuentes de hallazgos y de las citas históricas. Se conserva su registro como adquisición descartada, con advertencia. El HTML de 2026 se describe como texto actual recibido, sin prometer que el servidor respetase una selección histórica.

La revisión de integración se amplió a **preferentes y deuda subordinada**: Ley18/2014 art.122.Dos, PDF página123, y manual AEAT2014 páginas414–416. La DA39 permite compensación especial cruzada de rentas negativas anteriores a 2015 y, exclusivamente en 2014, remanente contra ganancias de transmisión en base general. No se aplica a ellas el cero/10/15/20/25% del régimen ordinario. `EEA-PREFERENTES` incluye tres casos esperados y el coste de ampliar el modelo por naturaleza/origen del saldo. Objeción experta: una tabla anual de porcentajes ocultaría esta excepción. Motivo de separarla: evitar esa falsa universalidad. Coste aceptado: otro hallazgo de cobertura ausente y nuevos inputs necesarios.

El original de Ley16/2012 art.3, PDF página10, confirma más de un año para ahorro en 2013–2014. `EEA-FECHAS-2013-14` distingue el comparador correcto con fechas completas del supuesto silencioso cuando faltan. Se exige rechazo o supuesto explícito; queda pendiente el caso civil del aniversario de 29 de febrero.

El original de Ley35/2006, PDF página27 (BOE41760), se añadió para acreditar el art.49 anterior a la reforma. No se utiliza su tarifa de 2006 para ejercicios posteriores. Las fuentes de integración histórica combinan ese original, la modificación de 2012, la transición de 2014 y el manual oficial de 2014.

La comparación de las 87 filas de CONTROL_TRAMOS_IRPF contra las tablas legacy no produjo diferencias (`comparacion-excel.json`). Ocho casos técnicos adicionales, incluidos cero, negativos, Infinity y NaN, figuran en `bordes-tecnicos.json`.

Metadatos publicables saneados recursivamente: se excluyen las cabeceras de sesión y autorización indicadas por la política de publicación, también en fuentes embebidas. No se modificaron originales ni sus hashes.

Verificación final: **2.304 citas PDF reextraídas, cero diferencias de hash/texto**. Las cuatro citas HTML tienen selectores y normalización declarada, sin verificación PDF. Esta comprobación mecánica no sustituye la contrarrevisión jurídica.
