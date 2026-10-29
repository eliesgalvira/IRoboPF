# Contrarrevisión independiente: autonómicas 2017–2021

29 de octubre de 2026. Los 95 IDs tienen entrada individual en revisiones.json. Cinco hallazgos aceptados con alcance limitado; las 90 escalas año-territorio permanecen **needs-evidence como reglas completas**. No se acepta por muestreo ni por autoridad del autor. Se separa coincidencia numérica de validez jurídica.

## Hallazgos accionables

**P2 — AUT1721-MADRID-2020-LIMITE confirmado.** lib/dominio/normativa/datos/irpf-autonomico-2020.ts:265 contiene 53407.29. El original BOCM-20181228-1, página PDF 4, impresa 13, artículo único.Dos, fija **53407.20**; el ancho anterior es **20400.00**, no 20200. SHA-256: 8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660. refined-citations.json contiene la tabla y artículo acotados a [98,628,497,748], con texto literal y hash de coordenadas.

Cadena examinada: Ley 6/2018 y disposición final (PDF p12); historial del artículo 1 en HTML del texto refundido, usado como índice de reformas, no como versión histórica; [corrección BOCM de 20/03/2019](https://www.boe.es/buscar/doc.php?id=BOCM-m-2019-90376), que únicamente cambia la fecha de firma; y [Ley 2/2021](https://www.boe.es/eli/es-md/l/2021/12/15/2), efectiva desde 01/01/2022. No aparece reforma intermedia del artículo 1 en el historial inspeccionado. La escala de 2018 continúa en 2019–2021: el límite correcto aplica en 2020. No se certifica autenticidad criptográfica.

El manual PDF AEAT 2020 dice realmente 53.407,29 en la última fila y 20.400,00 como ancho anterior. La contradicción es del documento, no del extractor. Las ediciones 2018, 2019 y 2021 dicen ,20. Se considera errata material frente a la ley; no se encontró ni se afirma una declaración formal de errata de AEAT.

**Prueba real fallida:** base 53407.29, calcularCuotaPorEscala devuelve 7395.82251; redondearImporteLiquidado devuelve **7395.82**. Fórmula independiente publicada: 7395.81 + (53407.29 − 53407.20) × 0.21 = 7395.8289, redondeada **7395.83**. Cambiar solo el límite en una copia en memoria da 7395.8253, también **7395.83**. Así se discrimina el límite con la política Half Up actual sin exigir cambiar otra regla. Los 0.09 son diferencia de límite, no de cuota. El ensayo termina con error explícito esperado. Reproducir desde raíz con `nix shell nixpkgs#bun -c bun .cache/procedencia/revision-autonomicas-2017-2021/repro.ts`. El orquestador debe trasladar el caso antes del arreglo. No se cambió el motor. Alcance: cuota íntegra autonómica antes de mínimos/deducciones, no declaración completa.

**AUT1721-MADRID-2018-VIGENCIA aceptado, alcance limitado.** La disposición final abarca todos los períodos terminados durante 2018. Se descarta excluir fallecidos antes de 31/12 por la fecha de entrada en vigor. El resolutor 2018 (comunidad-autonoma.ts:280) no introduce esa excepción. No extrapolar a otros territorios.

**P2 — AUT1721-RASTRO-ANIO confirmado.** liquidar-irpf-anual.ts:967 contiene 2025 fijo. Los resolutores anuales de comunidad-autonoma.ts:261 y siguientes seleccionan las tablas del ejercicio pedido. La carga ejecutada de todas las tablas y aliases no demuestra cálculo global con año equivocado. La corrección acreditada es documental.

**P2 — AUT1721-SIMULADA-CONTRATO confirmado como capacidad.** liquidar-irpf-anual.ts:360 usa escala conjunta legacy cuando escalaAutonomicaIgualEstatal es verdadero y asigna autonómica cero. La diferencia real Q(300001)−Q(300000) en 2021 es 0.47; duplicar el estatal superior 0.245 daría 0.49. No cambiar automáticamente a 49%: definir primero el contrato y sus etiquetas.

**AUT1721-CADENA-NORMATIVA-PENDIENTE aceptado como carencia.** Los manuales no sustituyen originales y reformas. Los HTML solicitados con fechas inexistentes devolvieron textos posteriores: sus notas solo sirven de índice. No se usaron ni se presuponen terminados los informes de otros revisores.

## Cobertura exhaustiva y anomalías

Se cargaron desde TypeScript las 90 entradas efectivas, incluidas todas las reutilizaciones de 2025. Se reabrieron originales comprobando hashes y se extrajeron **2328 celdas, 582 filas, 85 tablas distintas** mediante PDFMiner/pdfplumber; el autor empleó PyMuPDF. Cero discrepancias textuales después de quitar espacios. Las otras cinco entradas corresponden a Melilla, cotejada cada año con Ceuta y su tabla conjunta. Se comprobaron todos los aliases de Castilla-La Mancha, Ceuta, Melilla y simulada 2021 contra valores efectivos.

comparacion-independiente.json conserva todas las filas, tipos, límites y cuotas. Se recalcularon mediante Decimal independiente las cuotas en cada inicio: **31 tablas** difieren de la cuota impresa en alguna fila. escalas-gravamen.ts:93 integra anchuras y tipos sin anclar a cuotas publicadas; dinero/redondeo.ts:4 aplica Half Up. Una diferencia exacta subcéntimo no es automáticamente error liquidado, pero tampoco desaparece siempre al combinar operaciones. testcases.json contiene 139 casos: 136 de cuotas pendientes de política jurídica, el discriminante Madrid y dos casos técnicos.

- Canarias 2017–2021: los comienzos +0,01 son reales, no OCR. La suma comienzo+ancho no puede sustituir sin más los extremos discretos. En 2017, base 17707.21 produce integral 1813.6154 frente a cuota publicada 1813.61. Falta resolver norma histórica, selección de tramo y resto; no borrar +0,01 automáticamente.
- Castilla y León 2020–2021: ambos extractores confirman 18.207,20,00 y 53.407,20,00. Se normalizaron solo para comparar a 18207.20 y 53407.20, por coherencia entre filas y ediciones previas. La cita literal conserva el error; cierre normativo pendiente.
- Andalucía 2019: el literal 18.90 es decimal, no 1890. El BOJA original p7, transitoria primera.1, confirma 18,90%. Se inspeccionó ese pasaje. No confundir con otra fila de 2021; cuotas acumuladas pendientes.
- Illes Balears y ancho estatal 2021: 10.000 y 240.000 sin coma son millares. El parser distingue este patrón de 18.90; no borra indiscriminadamente los puntos.
- Catalunya 2020–2021: en 90000, integral 15908.316 frente a cuota publicada 15908.31. Se conserva la objeción: igualdad de límites y tipos no acredita cuota completa.

Las entradas Madrid 2018–2021 anotan aceptación parcial de límites/tipos y vigencia; no se certifica la función completa de cuota. Las demás cadenas territoriales quedan pendientes aunque haya match numérico.

## Citas, reproducibilidad y límites

Se examinaron las 2339 citas: 2328 de celdas y 11 de páginas normativas. Página completa no cumple pinpoint. refined-citations.json ofrece artículo, tabla o bloques pertinentes con texto literal y hash en estado **candidate**. Se descartan para fundamentar escalas los índices de La Rioja p2/p4, preámbulos y otros pasajes no sustantivos. La Rioja p12 art31 y p41 transitoria/entrada en vigor quedan acotados, igual que Andalucía p7 tablas y p8 vigencia. Los nuevos recortes no se aceptan por autoridad del autor.

Hash de coordenadas: SHA-256 del JSON compacto [documentSha256,page,box], en ese orden. No es hash de facsímil: no se renderizaron los recortes ni validaron firmas. Esa fase queda pendiente. Las cajas candidatas sirvieron de localizadores para extracción independiente de caracteres; no se reconstruyó un detector autónomo de tablas. Scripts y salidas de reproducción permanecen en scratch propio; engine-snapshot.json fija los hashes del motor revisado.

Navarra y País Vasco no figuran en ComunidadAutonoma (caso-fiscal-anual.ts:5): no hay soporte foral certificado. Los resolutores 2017–2021 reciben territorio sin fecha de fallecimiento ni base para elegir escala. Eso acredita capacidad limitada, no ausencia legal de excepciones. Faltan cadenas temporales, excepciones y política de redondeo de los demás territorios. No se revalidó el oracle Excel/Python ni se certifica fiscalidad mediante los ensayos mecánicos.

Solo se escribieron el directorio de revisión y scratch propio. Sin operaciones VCS mutantes, cambios de motor, node_modules, ESTADO o informes ajenos; sin builds ni suites pesadas. Extracción con un worker.
