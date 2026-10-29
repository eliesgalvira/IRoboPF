# Auditoría candidata de mínimos personales y familiares

Fecha de trabajo: 29 de octubre de 2026. Dominio: `minimos`. Ningún hallazgo de este informe está aceptado. La contrarrevisión debe efectuarla un auditor nuevo sobre los originales. No se modificó el cálculo, no se ejecutaron builds ni suites legacy completas, no se hicieron commits ni operaciones VCS mutantes.

La ronda identifica defectos reproducibles y reúne evidencia oficial sustantiva, pero **no cierra la auditoría exhaustiva de vigencia 2012–2026**. La matriz de código es completa para las tablas existentes; la acreditación histórica, las situaciones especiales y la revisión independiente tienen los pendientes concretos indicados abajo. No se debe convertir un `match` candidato en un sello de validación del año o del territorio.

## Entrega y alcance medido

- `hallazgos.json`: 33 candidatos: 5 `mismatch`, 7 `missing`, 3 `ambiguous` y 18 `match` limitados a la proposición descrita. Todos llevan revisión pendiente, fuente local y hashes cuando hay original, caso discriminante y objeción/coste.
- `cobertura.json`: 330 combinaciones de 15 ejercicios y 22 territorios/etiquetas. Incluye las 18 etiquetas del motor (17 territorios reales y `simulada-estatal`) y Navarra, Álava, Bizkaia y Gipuzkoa. Hay 252 tablas anuales efectivas de 2012–2025, 4.788 cuantías expandidas (19 por tabla), el supuesto técnico 2026 y las exclusiones de soporte. No se cuentan las 4.788 cuantías como verificaciones legales independientes.
- `documentos.json`: inventario de originales adquiridos, incluidos PDF AEAT 2014–2025, reformas estatales y originales autonómicos. Los originales están fuera de Git, en `.cache/procedencia/sha256/`; cada registro conserva `localPath`, URL canónica/final, fecha de recuperación, HTTP, cabeceras, SHA-256/SHA-512, tamaño y MIME. Las ausencias de fecha/publicación estructurada se reconocen, no se rellenan por conjetura.
- `citas-candidatas.json`: bloques de las páginas relevantes extraídos con PyMuPDF, página PDF física desde 1, cajas en puntos y origen superior izquierdo, texto de la capa PDF. Contiene también bloques de contexto y ejemplos: son material de selección, no miles de citas jurídicamente revisadas. No hay OCR ni renderizado de manuales completos. Las constataciones principales usan párrafos normativos y listas de importes. El cuadro de acogimiento AEAT 2025 tiene 21 celdas individualizadas; la selección de filas/celdas de otros cuadros permanece pendiente.
- `verificacion-citas.json`: comprobación técnica de hashes y reextracción por cajas; sus incidencias no deben confundirse con aceptación fiscal.
- `huellas-motor.json`: huellas de archivos leídos para detectar cambios posteriores en el checkout compartido.
- `legacy-control.json`: comparación concreta de `CONTROL_GENERAL!H2:H16`, con hash del libro, lectura incremental y encabezado H1 verificado.

Se leyeron BRIEF, CONTRATO-AUDITORIA, COORDINACION, LINT, README, AGENTS, glosarios, PRODUCT, ADR y documentación de alcance legacy. Se inspeccionaron los cuatro módulos de mínimos, las catorce tablas anuales, el selector comunitario, el tipo de caso fiscal, la liquidación y la función de escala del ahorro. El índice de fuentes del repositorio se usó para localizar originales, no como prueba.

## Diferencias y carencias que afectan al resultado

**MIN-001 — Descendientes de 25 años o más sin discapacidad.** `obtenerMinimoDescendientes` ordena todos los elementos y los suma sin filtrar elegibilidad. La sonda ejecutada devuelve 2.400 euros para edades 25 y 30. Los artículos 58 pre y posreforma exigen menos de 25 años, salvo discapacidad. Dos descendientes de 30 y 10 años sin discapacidad producen 5.100 euros desde 2015; si el mayor no genera derecho, el mínimo por el menor sería 2.400. El límite está modelado como dato pero no como condición. Un contrato que exigiera una lista previamente filtrada debería expresarlo y validarlo; el tipo actual no lo hace.

**MIN-010 — Ahorro: el máximo de los dos remanentes se utiliza para los dos gravámenes.** En `liquidar-irpf-anual.ts`, `cuotaMinimoPersonalAhorro` aplica la escala conjunta a `max(remanenteEstatal, remanenteAutonomico)`, limitado por la base del ahorro. Los artículos 66 y 76 distinguen los dos componentes. Para Madrid 2022, contribuyente de 40 años sin familiares, base general 1.000 y base del ahorro 10.000:

- Remanente estatal: 5.550 − 1.000 = 4.550.
- Remanente autonómico: 5.777,55 − 1.000 = 4.777,55.
- Minoración conjunta del motor: 4.777,55 × 19% = 907,7345.
- Minoración separada: 4.550 × 9,5% + 4.777,55 × 9,5% = 886,11725.
- Exceso de minoración: 21,61725 euros antes de redondear.

Es una comparación de etapa, no una ejecución completa de declaración: falta construir la entrada anual que produzca esas bases y dejar una prueba roja antes de corregir. Las tablas de mínimos iguales y los casos sin ahorro pueden ocultar el fallo.

**MIN-017 — Asturias, devengo anterior al 3 de diciembre de 2025.** La Ley 3/2025 introduce mínimos nuevos y entra en vigor el día siguiente a su publicación en el BOPA de 2 de diciembre. El selector 2025 no recibe fecha de fallecimiento y siempre entrega 6.105 euros de mínimo básico autonómico. Candidato: un contribuyente fallecido el 2 de diciembre mantendría 5.550, mientras uno fallecido el día 3 usaría 6.105. Se descargaron el texto original BOE y su PDF. Se ha releído también el BOPA 232, código 2025-09912, PDF 2–4. Su preámbulo 8 pretende la aplicación al ejercicio 2025, pero la disposición final no retrotrae expresamente los efectos a devengos anteriores. La contrarrevisión debe resolver esa objeción temporal y comprobar disposiciones conexas antes de aceptarlo.

**MIN-002 a MIN-006 y MIN-009 — Variables que faltan.** `FamiliarFiscal` solo tiene edad y discapacidad. No puede expresar rentas no exentas, presentación de declaración, convivencia/duración, dependencia, parentesco, número de titulares, grado de parentesco relativo, fecha/modalidad de adopción o acogimiento, ni fallecimiento del familiar. No son todos errores aritméticos: varios son casos que el dominio no puede representar y debería rechazar o declarar como precondición. La suma del mínimo por discapacidad del familiar tampoco comprueba el derecho al mínimo por ese ascendiente/descendiente.

Las reglas omitidas incluyen los límites 8.000 y 1.800 euros, reparto por partes iguales, prioridad de parentesco, convivencia del ascendiente durante al menos medio período, excepción de centro especializado, incremento por adopción durante tres ejercicios y cuantía especial por fallecimiento. El fallecimiento de un familiar no debe resolverse multiplicando indiscriminadamente el mínimo por días/365. Antes de 2015, el artículo 61.4 regula el fallecimiento del descendiente; desde 2015 también el del ascendiente. La regla no es históricamente idéntica.

**MIN-007 — Los 65/75 años cumplidos.** Sondas: contribuyente 65→6.700, 75→6.700 y 76→8.100; ascendiente sin discapacidad 65→0, 75→1.150 y 76→2.550. La página AEAT de requisitos de ascendientes precisa «edad igual o superior a 65 años». Los manuales AEAT 2014 (PDF 447) y 2025 (PDF 1069) dicen «igual o superior a 65 años o a 75 años» al explicar los incrementos de los cónyuges. Esto permite pasar de ambigüedad a discrepancia candidata: el ascendiente de 65 años queda excluido y el adicional de 75 se retrasa a 76. El `>=65` del contribuyente es coherente con la explicación AEAT. La contrarrevisión debe fijar años cumplidos a devengo y revisar específicamente la traslación al ascendiente de 75 y al día exacto de cumpleaños. No se ha modificado ningún operador.

**MIN-033 — El ahorro de 2012–2014 aplica una fórmula posterior a 2015.** Antes de 2015 se resta el remanente del mínimo de la base del ahorro antes de aplicar su escala. Lo acreditan los artículos 66 y 76 redactados por Ley 39/2010 (PDF 64), la disposición final segunda del RDL 20/2011 (PDF 53, para 2012/2013) y el manual AEAT 2014 (PDF 467, página impresa 449). La Ley 26/2014 introduce expresamente la minoración en cuota desde 2015 (PDF 30–31 y 33–34).

Sonda de etapa ejecutada con la escala real del motor, contribuyente de 40 años, sin familiares, base general 0, base ahorro 10.000 y mínimo estatal/autonómico 5.151:

- Motor: escala(10.000) − escala(5.151) = 2.260 − 1.081,71 = **1.178,29 €**.
- Regla 2012–2014: escala(10.000 − 5.151) = 4.849 × 21% = **1.018,29 €**.
- Exceso de cuota: **160 €**, reproducido en 2012, 2013 y 2014.

Es independiente del máximo indebido entre remanentes de MIN-010: aquí los dos mínimos son iguales. La prueba debe conservar un control 2015, cuyo régimen sí cambia. Falta convertir la sonda de etapa en una prueba roja integrada con la entrada anual antes de cualquier fix.

**MIN-018 — Catalunya 2020 no se resuelve borrando la norma anulada.** La STC 186/2021, FJ 3 D, página PDF 13, preserva expresamente las obligaciones tributarias devengadas al amparo del mínimo incrementado de 2020: no son revisables como consecuencia de su nulidad. El motor fija 5.550 en `MINIMOS_CATALUNYA_2020_CANONICO`; el mínimo incrementado era 6.105 para suma de bases liquidables general y ahorro no superior a 12.450. Es una discrepancia del contrato de reconstrucción histórica que exige decisión explícita, aunque el símbolo ya anuncie una elección «canónica». No se debe tratar esa elección como reproducción de todas las declaraciones de 2020. La clasificación queda ambigua hasta fijar el contrato de producto.

## Resultados por familia de reglas

La Ley 39/2010, artículo 61, PDF páginas 61–63, acredita las cuantías estatales anteriores a 2015 y su vigencia indefinida desde 2011. La Ley 26/2014, páginas 27–29 y disposición final sexta en página 79, acredita la reforma desde 1 de enero de 2015. Las tablas estatales coinciden en las cuantías descritas. El nombre de un alias que apunta a 2025 no es prueba de vigencia anterior: se conserva esta distinción en la cobertura.

Las ramas de discapacidad producen 0/3.000/6.000/12.000 desde 2015 y, con tabla antigua, 0/2.316/4.632/9.354, según ausencia, grado 33–64, ese grado con ayuda/movilidad o grado al menos 65. El adicional de asistencia en 65% o más se suma una sola vez. La correspondencia entre certificación, pensión de incapacidad, incapacitación judicial o curatela y el tag fiscal es una preclasificación no modelada, no una licencia para exigir siempre un certificado con porcentaje literal.

La ordenación de descendientes por edad descendente es adecuada para personas que generan derecho; el problema está en la elegibilidad y en no excluir fallecidos del orden ordinario. El incremento por edad menor de tres se comprueba en 2/3 años; el código no cubre el supuesto alternativo de adopción. El cuarto y siguientes reutiliza la cuarta cuantía; probar al menos cinco descendientes, incluyendo uno inelegible.

La limitación de mínimo sobre base general se hace separadamente por Estado y comunidad. El mínimo no debe restarse de la base antes de pasar por la escala. El fallecimiento del contribuyente no origina un prorrateo diario automático del mínimo: el manual indica aplicación íntegra. Edad y otras circunstancias deben referirse al devengo; no hay fecha de nacimiento para verificarlo internamente.

## Tablas y herencias territoriales

| Ejercicios | Excepciones a la tabla estatal codificadas |
|---|---|
| 2012–2013 | Madrid, tercer descendiente y siguientes |
| 2014 | Madrid; Cantabria; Castilla-La Mancha |
| 2015–2017 | Madrid e Illes Balears |
| 2018–2020 | Madrid, Illes Balears y La Rioja; Catalunya 2020 requiere tratamiento histórico específico |
| 2021 | Madrid, Illes Balears y La Rioja; varias entradas proceden por herencia de 2025 |
| 2022 | Andalucía, Illes Balears, Galicia, Madrid, La Rioja y Comunitat Valenciana |
| 2023 | Las anteriores; nuevo corte balear el 26 de noviembre y cuantías nuevas de Madrid |
| 2024 | Añade Canarias |
| 2025 | Añade Asturias, con problema de devengo pendiente |
| 2026 | Solo `simulada-estatal`, supuesto técnico heredado; comunidades reales no soportadas |

Las demás entradas del motor usan la tabla estatal: Aragón, Castilla y León, Extremadura, Murcia, Ceuta y Melilla durante todo el período implementado; las otras comunidades según los intervalos de la tabla. Esto describe código examinado, no acredita automáticamente ausencia de toda reforma territorial. Navarra y los tres territorios históricos vascos no están soportados y no se les atribuyen cuantías comunes.

Se descargaron originales para Madrid 2010/2014/2022/2023, Cantabria 2013, Castilla-La Mancha 2014, Illes Balears 2014/2023, La Rioja 2018, Andalucía 2022, Galicia 2022, Asturias 2025 y Canarias 2024, además del DOGV 9458 de Valencia 2022, páginas PDF 5–6 y 16, y del BOPA de Asturias 2025. Las citas y manifiestos distinguen publicación estatal, publicación autonómica y efectos. En Galicia, la publicación de la Ley 7/2022 no impide efectos de sus artículos 1 y 2 desde enero de 2022. En Canarias, la ley presupuestaria para 2025 da efectos a esta modificación desde enero de 2024. Madrid 2023 se aplica a períodos iniciados desde enero de ese año.

Illes Balears merece explicación propia: `5550 + 1820` equivale a `6105 + 1265` para mayores de 65. El importe 1.820 es una derivación para encajar en la interfaz de datos, no el incremento literal publicado. La suma 7.370 es consistente; la página de procedencia debe mostrar la derivación. La Rioja aumenta solo discapacidad de descendientes a 3.300/9.900 y conserva explícitamente asistencia en 3.000: no sustituir por una tabla homogénea de 3.300 para todos.

Los selectores de Valencia 2022 y Balears 2023 sí contemplan fallecimiento antes del corte. Los originales sustentan esos cortes. Falta verificar entradas civiles con zona horaria: el primero forma fecha UTC y el segundo compara instantes UTC. Una fecha española con `+01:00` puede caer en el día UTC anterior. No hay prueba de que todos los llamadores impongan UTC, por lo que el contrato de fecha debe documentarse.

## Pruebas manuales discriminantes propuestas

1. Descendientes de edades 30 y 10, sin discapacidad; después cambiar el mayor a discapacidad 33%. El orden fiscal cambia solo cuando genera derecho.
2. Familiar con rentas 8.000/8.000,01; declarar con 1.800/1.800,01; repetir con rentas exentas. Son variables ausentes: no simularlas cambiando la edad.
3. Un hijo de 10 años con dos titulares: 1.200 euros para cada uno desde 2015. Con discapacidad 33%, añadir 1.500 para cada uno.
4. Adopción de menor de 10 años: incremento en año de inscripción y dos siguientes; no confundir el nuevo período con el acogimiento previo.
5. Tres hijos y fallecimiento de uno: separar cuantía especial y orden de supervivientes; repetir menor de tres. Ascendiente fallecido de 76 años: convivencia hasta fallecimiento y régimen anterior/posterior a 2015.
6. Edades 64/65/66 y 74/75/76 a devengo, discapacidad 32/33/64/65 y ayuda de terceros. Usar años cumplidos a devengo y las aclaraciones primarias incorporadas a MIN-007; contrarrevisar cada extremo.
7. Base general 0, menor que mínimo estatal, entre estatal/autonómico, igual a ambos y superior; base ahorro 0, menor que remanentes y suficiente. Cruzar el primer tramo de ahorro para impedir que una equivalencia accidental esconda el fallo.
8. Valencia 27/28 de octubre de 2022; Balears 25/26 de noviembre de 2023; Asturias 2/3 de diciembre de 2025. Repetir fechas con offset civil español.
9. Catalunya 2020, bases sumadas 12.450/12.450,01, y declaraciones amparadas por la sentencia. Especificar qué contrato histórico se pretende reproducir.
10. Ruptura estatal 2014/2015 y cada cambio autonómico; cinco descendientes; tercero/cuarto en Madrid; discapacidad de ascendiente frente a descendiente en La Rioja.

## Decisiones, objeciones y costes aceptados

Se usa la fuente original frente a transcripciones. Objeción experta: incluso un PDF oficial puede no estar autenticado y una consolidación puede ser anacrónica. Motivo: preservar bytes y lectura exacta para una segunda revisión. Coste aceptado: firmas PAdES, CSV y sellado temporal no están validados; los hashes acreditan integridad local, no la autoría por sí solos.

Se conserva la diferencia entre error y variable ausente. Objeción experta: una lista de familiares podría venir prefiltrada por el llamador. Motivo: el contrato actual no expresa ni permite todos los requisitos; llamar incorrecta a toda fórmula confundiría modelo y cálculo. Coste aceptado: algunas pruebas necesitan primero ampliar entradas o establecer rechazo explícito; no hay fix en esta ronda.

Se extraen capítulos y páginas concretas sin imágenes masivas. Objeción experta: los bloques no identifican por sí solos una celda de tabla ni prueban su lectura visual. Motivo: obtener candidatos reproducibles con memoria moderada. Coste aceptado: faltan selección final, fila/celda en cuadros, recortes facsímiles y validación visual; las constataciones centrales remiten a texto normativo continuo.

Se compara solo una hoja de control del Excel. Objeción experta: coincidencia en 15 celdas no certifica el cálculo ni el libro. Motivo: comprobar la afirmación concreta sobre mínimo legacy con streaming sin ejecutar millones de casos. Coste aceptado: no se afirma equivalencia de DAT ni que el oracle sea normativamente correcto.

Se mantiene abierta la matriz de evidencia. Objeción experta: una auditoría exhaustiva necesita demostrar también ausencia de cambios y reglas de entrada en vigor para cada celda. Motivo: evitar un cierre ficticio por herencia de objetos o semejanza con tests. Coste aceptado y visible: la entrega es sustantiva pero parcial en vigencia; requiere continuación y contrarrevisión, no publicación de «todo validado».

## Límites concretos y continuación

Los enlaces legacy AEAT 2012/2013 fallaron por certificado TLS débil; las variantes HTTPS modernas probadas, incluidas las rutas antiguas bajo sede.agenciatributaria.gob.es, devolvieron 404. No se desactivó TLS. Las cuantías estatales antiguas sí tienen original Ley 39/2010 y contraste AEAT 2014; falta sustituir ambos manuales y cerrar la evidencia negativa de reformas autonómicas por esos ejercicios.

Una petición BOE con `p=20140101` devolvió artículos con importes posteriores a 2015. Se conserva como MIN-032, evidencia de un riesgo del corpus, y no se usa para acreditar valores de 2014. La versión histórica debe verificarse en el texto y en el selector efectivo, no en el nombre del archivo ni en la URL.

Faltan la cadena completa de versiones de todos los territorios sin cambios aparentes, originales autonómicos adicionales donde solo se reunió la publicación BOE, contrato de edad y cumpleaños a partir de las aclaraciones primarias ya obtenidas, contrato temporal de Catalunya y las verificaciones de firma/CSV. El PDF canario procede de una reproducción oficial del Gobierno de Canarias; no se afirma que sea el facsímil firmado del BOC. El año 2026 no dispone de cobertura real autonómica del motor. La segunda revisión no se ha iniciado ni se ha delegado desde este ámbito.

## Comandos reproducibles

Descarga: `nix shell nixpkgs#python3 -c python tools/procedencia/descargar.py URL`. Los lotes personales se serializan mediante el lock de esa herramienta; no hay peticiones propias concurrentes fuera de ella.

Extracción y verificación, desde la raíz:

```sh
nix shell nixpkgs#python3 nixpkgs#stdenv.cc.cc.lib -c bash -c 'export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib"; UV_PYTHON_DOWNLOADS=never uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/minimos/verificar.py'
nix shell nixpkgs#bun -c bun .cache/procedencia/minimos/sondas.js
nix shell nixpkgs#bun -c bun .cache/procedencia/minimos/sonda-ahorro.js
nix shell nixpkgs#python3 -c python .cache/procedencia/minimos/excel.py
```

La primera ejecución de `uv` falló porque el Python descargado no era ejecutable en NixOS; se resolvió usando Python de Nix y la biblioteca C++ de Nix, sin instalación global. Las sondas son lecturas del motor y cálculos de contraste, no una suite de aceptación ni pruebas rojas integradas. Todos los scripts están en scratch propio; no se escribió TypeScript ni Effect de aplicación.

Control adicional del contrato: `obtenerMinimoContribuyente` acepta `anio` pero lo ignora cuando no se suministra tabla. Una llamada directa con 2012 y tabla omitida usa la tabla 2025. La liquidación observada sí suministra la tabla correcta; queda registrado como riesgo del API en `cobertura.json`, sin atribuir un fallo anual al llamador actual.

Publicación: se filtraron recursivamente las cabeceras de sesión y autorización de todos los JSON publicables, incluidas fuentes embebidas. No se alteraron los bytes originales ni sus hashes. Los scripts de generación en scratch son auxiliares; si se regeneran los documentos debe ejecutarse también `sanitizar.py` antes de recogerlos para versión.

## Condiciones familiares y exclusiones de modelo precisadas

`SituacionFamiliarIndividual` solo admite modalidad individual. La declaración conjunta queda fuera del modelo; no se le atribuye una aritmética incorrecta que el API no pretende ofrecer. En una ampliación futura, el mínimo básico sería único por unidad, con los incrementos de edad y discapacidad de cada cónyuge; los hijos no generan otro mínimo básico. La Ley 35/2006 original, artículo 84 (PDF 38), acredita la estructura, aunque sus importes originales de 2006 no son los aplicables a 2012–2026.

En el reparto por descendientes importa la declaración conjunta del hijo con un progenitor: el umbral de 1.800 euros y la excepción de fallecimiento del otro progenitor impiden convertir la regla en un 50% automático. El manual 2025, PDF 1071–1073, también distingue custodia compartida, custodia exclusiva y alimentos judiciales sin custodia. Remite a las resoluciones TEAC de 29/05/2023 (00/08646/2022 y 00/10590/2022); sus originales siguen pendientes y no se presenta el criterio interpretativo como una norma inmutable de los quince años. La ausencia temporal por estudios no rompe por sí misma la convivencia.

La renta del familiar para el umbral de 8.000 euros no equivale al ingreso bruto: el manual 2025, PDF 1072, la define mediante rendimientos netos, imputaciones y ganancias/pérdidas, con reglas particulares sobre reducciones. Un futuro campo `ingresos` sin definición fiscal no resolvería MIN-002.


Precisiones incorporadas a MIN-005/MIN-006: el descendiente fallecido menor de tres años conserva el adicional; sin discapacidad y antes de reparto, el mínimo estatal total es 4.080 en 2014 (1.836 + 2.244) y 5.200 desde 2015 (2.400 + 2.800). El manual 2014, PDF 451, excluye expresamente al ascendiente fallecido antes del devengo, aunque conviviese más de medio año; la reforma de 2015 introduce el mínimo especial de 1.150. El manual conserva la discapacidad del descendiente fallecido, pero no debe extenderse esa frase por analogía al ascendiente. El acogimiento temporal o de urgencia y la guarda judicial solo permiten el adicional si el menor tiene menos de tres años; la extensión por tres ejercicios independientemente de edad corresponde a las modalidades asimiladas a adopción indicadas en la norma. Cambiar de acogimiento a adopción no reinicia los tres años. Se identificaron filas y celdas del cuadro AEAT 2025, PDF 1075.

Comprobación visual acotada: se renderizaron a 72 ppp y examinaron únicamente AEAT 2014 PDF 467 y DOGV Valencia 2022 PDF 5 para contrastar el pasaje del ahorro anterior a 2015 y la disposición valenciana. No equivale a una comprobación visual de todos los bloques ni a la segunda revisión exigida.


## Control de la entrega

La entrega final de este ámbito reúne **40 originales**, **33 hallazgos candidatos** (5 discrepancias, 7 carencias, 3 ambigüedades y 18 coincidencias limitadas) y **13.622 citas candidatas**: 13.555 PDF y 67 HTML. Entre las PDF hay 21 celdas del cuadro de acogimiento. Son bloques candidatos y contexto, no 13.622 conclusiones aceptadas.

Los 40 originales superaron la comprobación de SHA-256, SHA-512 y tamaño. La reextracción PDF obtuvo 10.751 coincidencias exactas tras normalizar espacios y 2.804 pasajes cuyo texto está íntegramente dentro de la caja junto con contexto adyacente; ninguna cita quedó sin localizar en esa comprobación. La comparación exacta inicial había marcado parte de esos bloques por contener texto vecino, debido a las cajas de glifos. `verificacion-citas.json` conserva el método y la distinción. Esto comprueba trazabilidad técnica, no interpretación, autenticidad firmada ni aceptación fiscal.

`tablas-oficiales-candidatas.json` recoge 16 variantes numéricas transcritas de los pasajes normativos y sus derivaciones. La comparación de las 4.788 hojas del motor da 4.787 coincidencias numéricas y una cuantía condicional (mínimo básico Catalunya 2020), además de los cortes temporales y condiciones tratados aparte. **La transcripción no constituye aceptación**, ni esa cifra cierra la cadena de vigencia de cada territorio. La comparación se conserva para que la contrarrevisión pueda discrepar campo por campo. `sondas-calculo.json` guarda los resultados de las sondas familiares y del ahorro; `control-entrega.json` registra validación de estructura, referencias y ausencia de cabeceras sensibles.

Se comprobó con `jj --ignore-working-copy file list -r d4d708f6 docs/procedencia/auditorias/minimos` que la subcarpeta no contenía archivos en esa base. El parche de entrega es un diff de archivos nuevos contra esa revisión; no se hizo snapshot, init, commit, movimiento de bookmark, push ni operación Git. Los auxiliares permanecen en scratch propio. El informe declara las limitaciones que impiden cerrar la auditoría exhaustiva y deja todos los hallazgos pendientes para el auditor independiente.

Control de checkout compartido: al cerrar se detectó un cambio ajeno en `liquidar-irpf-anual.ts`. Se comparó por lectura con `d4d708f6`: únicamente sustituye el año fijo 2025 por `parametrosComunidad.anio` en el texto explicativo de la escala. Las fórmulas auditadas no cambiaron. `huellas-motor.json` conserva la huella inicial y la releída. El parche de este ámbito no incluye ese archivo del motor.
