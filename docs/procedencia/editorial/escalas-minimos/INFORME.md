# Lote A: escalas, mínimos y consignación de deducciones

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Superposición editorial candidata sobre la base `1196269d4e73742beeed35cc05011b70c21a0b69`. No constituye revisión independiente ni aceptación fiscal. Su integración en el generador requiere adaptación y revisión.

Se cubren los 28 sitios seleccionados literalmente entre los 65 bindings del rastro y las 264 propuestas por celda: 78 estatales y 186 autonómicas. Cada sitio conserva sujeto y revisión del snapshot v2 `259584e4c4defcebb069df72a9da5e522c4a13fca51417eb349efaaa1902c608`. Las propuestas se resuelven primero por archivo, hash, símbolo y ruta de segmentos, después se cotejan valor, unidad, ejercicio y territorio. No hay bloqueos de identidad en las 264. Esto no valida la selección del supuesto real ni el payload nuevo.

## Qué contiene cada ficha

`fichas.json` es una superposición editorial con contrato propio `overlay.schema.json`. Cada entrada contiene fórmula, derivación, norma, evidencia y bordes, junto con unidad, expresión de entrada/salida, código exacto de la llamada y selector UTF-16 de la fuente fijada por hash. Sus estados solo son candidatos y pendientes de contrarrevisión. No se inventa un estado jurídico «verificado» en Entidad. La integración deberá adaptar y revisar esta superposición antes de aplicarla al modelo existente.

Las derivaciones comunes de `derivaciones.json` explican las operaciones compartidas sin sustituir los párrafos particulares de cada hoja. La cuota fija publicada y la integración de marginales tienen fórmulas distintas. El ahorro distingue remanente estatal y autonómico y el cambio temporal de 2015. Los mínimos distinguen nominal, cuota minoradora, orden y atribución familiar. La consignación explica el límite contra cuota autonómica general más ahorro, y por qué un catálogo de 351 deducciones no equivale a 351 evaluadores.

`celdas.json` conserva una explicación por propuesta, con valor y unidad, fila del código 0-based y fila de la decisión original, columna, año, territorio y condiciones. Añade las tres hojas de la fila (base, cuota y tipo) y un caso aritmético calculado con Decimal independientemente del motor. Las repeticiones anuales comparten tabla pero conservan la razón normativa temporal de cada decisión. El caso B=L+1 pertenece a la fila y discrimina su pendiente; no pretende verificar por sí mismo que la selección de fila en el motor sea correcta.

`correspondencias.json` separa los sitios de las celdas. Las ocurrencias dentro de una llamada son un vínculo técnico por contención de offsets, no una prueba jurídica de todas las dependencias. Los documentos, citas y PNG se cuentan como dependencias documentales, nunca como fórmulas fiscales pendientes. `cobertura.json` expresa denominadores de sitios y decisiones; no calcula porcentaje fiscal agregado ni agrega como reglas aceptadas los recuentos técnicos.

## Hallazgos editoriales concretos

1. El texto original de `irpf.madrid.limite-escala` quedó obsoleto al decir «aún no enlaza»: el candidato documenta el enlace actual exacto sin reescribir el editorial original. El límite legal es 53.407,20; el manual2020 conserva53.407,29. No se afirma una errata oficial de AEAT ni se acepta toda la escala por haber resuelto el límite.
2. En Murcia2022 el corte superior es estricto. A60000 la fila anterior produce8625,8332; a60000,01 la quinta produce8716,67227. La discontinuidad no se corrige editorialmente como si fuera un error de transcripción.
3. Estado2012–2014 conserva dos cuotas publicadas. A17707,21 la suma da2257,6616, frente2257,6696 al integrar. El efecto a céntimos es2257,66 frente2257,67. No se cambia el oracle ni se atribuye al helper legacy la fórmula de cuotas publicadas.
4. El ahorro2012–2014 grava la base después del remanente; desde2015 resta cuotas. En2015 los dos componentes no son mitades. En2025 el ejemplo con ahorro10000 y mínimos5550/5956,65 da462,75 estatales y424,11825 autonómicos. No acredita el derecho ni la procedencia jurídica de las cuantías recibidas.
5. El helper familiar antiguo filtra antes del orden, pero no comprueba todos los hechos de renta, convivencia o atribución. El contrato explícito exige titulares y grado preferente antes de repartir. No dividir todos los mínimos por dos: el mínimo propio queda íntegro. La ficha distingue edades cumplidas ejecutadas de la literalidad «superior/mayor» de la ley.
6. MDV2-P01 permanece abierto jurídicamente. La base actual excluye de la ruta anual los alimentos propios sin derecho al mínimo por ese descendiente; otro hijo con derecho no oculta el cruce. La exclusión no demuestra cuál sería la cuota legal fuera del contrato.
7. El anual explícito conserva BIG y BLG con signo, aunque aplique tarifa a base positiva. Su cuota líquida legal precede a DA61; la posterior ya la descuenta. No duplicar esa deducción al obtener diferencial ni presentar un ejemplo algebraico de composición como elegibilidad acreditada.
8. La tabla2025 heredada técnicamente en2026 no acredita vigencia de2026. Los regímenes forales no se convierten en régimen común ni en deducción cero por desconocimiento.

## Fuentes y límites de acreditación

Las fuentes primarias se identifican por ruta literal, SHA-256/SHA-512 y tamaño en `originales.json`; las citas conservan transcripción, página física1-based y caja en `fuentes-primarias.json`. Los informes anteriores se usan como índices hacia originales, nunca como sustitutos de la ley. Las decisiones estatales/autonómicas previas no se atribuyen a este autor ni se extiende su aceptación acotada.

Se reutilizan las citas geométricas históricas de las celdas y se reextraen personalmente con PyMuPDF1.26.7, flags0, sort=false. Para la compilación anual oficial de Ley35/2006 se añaden citas y PNG reproducibles de páginas concretas; la compilación es primaria para su texto reproducido, pero no sustituye las disposiciones originales y su cadena histórica para cada año. Madrid2020 añade el recorte de la tabla original BOCM. La muestra visual personal se declara por separado en el control visual; no se confunde el cotejo de texto o hash con haber visto todas las páginas.

Los bloqueos se expresan por afirmación en cada ficha. La continuidad2015–2024 de los alias de mínimos, las variaciones autonómicas completas, el supuesto real de residencia, el derecho a DA61 y la elegibilidad de deducciones no quedan aceptados por las celdas. El contenido puede explicar la operación implementada sin resolver definitivamente esos aspectos. Los 78/186 dictámenes previos siguen limitados a las celdas y ejercicios declarados. Los payloads recibidos todavía no integrados no se leen como si fueran el estado ejecutado ni se promocionan.

La integridad de bytes y reextracción no autentica al emisor: no se validaron firma PAdES, CSV, confianza histórica, revocación ni cadena completa de reformas. Madrid conserva binding pendiente, aceptación completa false y autenticidad indeterminada. La evidencia de este análisis no acredita custodia independiente ni restauración externa.

## Decisiones, objeción experta, respuesta y coste

- **Superposición separada.** Objeción: unas fichas correctas pero incompatibles con el publicador no resuelven su integración. Respuesta: contrato propio y selectores exactos para disponer de una propuesta revisable antes de integrar. Coste: adaptación posterior, nueva revisión y ausencia de publicación en esta entrega.
- **Autoría por magnitud y derivación compartida.** Objeción: cambiar título/año de una plantilla dejaría derivaciones vacías. Respuesta: textos específicos para cada operación y tabla, cinco secciones y casos por fila; lo común se cita explícitamente. Coste: duplicación editorial acotada y mantenimiento de referencias.
- **Conservar condiciones de las 264 decisiones.** Objeción: la igualdad numérica no demuestra identidad ni vigencia. Respuesta: selección estructural exacta y cotejo posterior de valor/unidad/dimensiones, sin inferir aceptación del payload. Coste: 264 registros aunque haya menos celdas físicas distintas y exigencia de revisión nueva.
- **Separar lectura de imagen y reextracción.** Objeción: texto bien extraído puede ocultar cabeceras o columnas. Respuesta: muestra visual propia identificada y reproducción geométrica; no se atribuye inspección universal. Coste: el revisor posterior debe ampliar la inspección si quiere aceptar todos los aspectos visuales.
- **Conservar límites jurídicos localmente.** Objeción: demasiadas advertencias genéricas pueden ocultar falta de trabajo. Respuesta: distinguir la explicación completa de una operación de las afirmaciones específicas aún no acreditadas; los bloqueos no detienen los otros sitios ni eliminan propuestas. Coste: ninguna regla completa se promociona por el contenido redactado.

## Reproducción y validación

Los comandos, salidas y códigos están en `COMANDOS.md` y los logs propios. Python se ejecuta con `bash tools/procedencia/run.sh`, entorno UV absoluto en `.cache/escalas-minimos/venv`, bajo `flock /tmp/irobopf-validacion-pesada.lock`. Un trabajador, sin instalación global ni copia del entorno a documentación. No se escribe Effect ni TypeScript; por ello no procede ejecutar oxlint sobre Python ni presentar tipos del motor como tipos propios. El verificador comprueba que las16 reglas anti-slop permanecen a error; la calidad del instrumento Python se comprueba por su analizador y tipos propios.

`verificar.py` valida Schema, conjunto exacto de sitios y revisiones, código, hash de fuente, referencias, originales por ambos hashes, reextracción, 264 identidades y ejemplos. Los casos propios no importan el motor y comprueban diferencias discriminantes, fronteras y unidades. Los negativos de Schema rechazan promoción y pérdida de derivación. No se inventan rojos fiscales: no hay cambio de cálculo en esta entrega.

## Resultado final ejecutado

Validación final: salida0, 28 sitios sin pérdida, 264 celdas, 244 citas reextraídas, 18 casos propios y264 ejemplos de fila. Los schemas de fichas, celdas y concepto pasan; los dos negativos de promoción/pérdida de derivación se rechazan. Ruff y mypy de verificar.py: salida0. Configuración de las16 reglas anti-slop a error comprobada, sin TypeScript/Effect nuevo.

Documentos: 19 originales por ambos hashes; 39 PNG nuevos preservados,59 facsímiles únicos cotejados por regeneración antes de añadir las páginas30/90; estas dos páginas adicionales se generaron con receta y se reextrajeron en el pase final. Cinco imágenes inspeccionadas personalmente; detalle de lo visto y del margen superior del crop deMadrid en inspeccion-visual.json. No se atribuye inspección visual al resto.
