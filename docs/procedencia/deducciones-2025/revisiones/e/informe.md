# Revisión independiente del lote E — ejercicio 2025

**Requiere correcciones; no se emite conformidad fiscal integral.** Las [49 decisiones](decisiones.json) identifican diferencias documentales individuales: 25 Galicia y 24 La Rioja. Las omisiones de las fichas son comprobables; que falte un evaluador no vuelve ilegibles las cifras, requisitos o límites de las normas. La [matriz por artículo](matriz.json) enlaza las publicaciones del lote sin duplicarlas y distingue cadena localizada de cadena agotada. Estas decisiones no aceptan el paquete ni cierran el encargo.

Se han demostrado tres citas AEAT mal atribuidas y un defecto de validación del contrato parcial de celiaquía. No se ha demostrado una cuota final incorrecta. No se ha modificado producto ni la entrega del autor.

## Correcciones necesarias

1. `galicia_ayudas_incendios_peifoga_2025-manual-cuantia`: el bloque del 15% con base 9.000 de la página 388 pertenece a eficiencia energética. El apartado 5.Dieciséis establece neutralización de ayudas mediante tipos medios, no ese porcentaje. El bloque correcto está en 388, antes del encabezado siguiente.
2. `galicia_ayudas_deportistas_alto_nivel-manual-cuantia`: el bloque del 15% de la página 391 pertenece a aldeas modelo. El 5.Diecinueve aplica tipos medios a subvenciones y exige reconocimiento de alto nivel y ausencia de rendimientos de actividad económica. Su cuantía está en 390.
3. `galicia_ayudas_ela_fenotipos-manual-cuantia`: el bloque del 15% de 400 pertenece a libros/material. El 5.Veinticuatro aplica tipos medios sobre ayudas integradas en base liquidable; el pasaje está en 399.

Las tres sustituciones propuestas, reextraídas con bbox, constan en [citas complementarias](citas-complementarias.json). Los pasajes autonómicos citados por el autor permiten demostrar las omisiones de ficha, pero no hacen correcta la concordancia AEAT equivocada.

La [delimitación de las 49 secciones](limites-manual.json) registra página y coordenada vertical inicial/final. Es una auditoría del contenido, no una nueva lista arbitraria de páginas. Se comprobó el orden de encabezados y cada bloque manual citado contra esos límites. Bicicletas ocupa solo parte de 504: 505–506 son rehabilitación. Celiaquía termina en 520: 521 es intereses hipotecarios. Cuidado de hijos y discapacidad comparten 371, pero esta última no hereda los requisitos laborales de la primera. El título de acogimiento comienza al pie de 369; el cuerpo empieza en 370. Referenciar páginas con contenido compartido es válido si se delimitan las secciones; incluir páginas completas ajenas como evidencia de una cuantía no lo es.

En Galicia, las citas del apartado Tres incluyen tanto familias con dos hijos (Tres.1) como familia numerosa (Tres.2). Sus cuantías no se intercambian; Tres.3 regula reparto y Tres.4 incompatibilidad. La decisión individual evita convertir todo el apartado en regla de ambas fichas.

## Vigencia y remisiones contrastadas

Las referencias `e-…` siguientes se resuelven exclusivamente en `lotes/e/fuentes.json`, salvo el original nuevo. Los originales se conservan externamente por hash.

| Regla | Publicación y efecto comprobados | Consecuencia para 2025 |
| --- | --- | --- |
| Galicia 5.Diez | Ley 9/2013; corrección DOG 39, 26/2/2014 (`e-ca33…`), DF primera.Uno | El límite de 20.000 es **conjunto** para capital/préstamos/garantías, no independiente para cada vía. |
| Galicia 5.Nueve | Ley 12/2014 art. 2.Cuatro.2; corrección DOG 43, 4/3/2015 (`e-888f…`) | Dice patrimonio «mobiliario o inmobiliario». No altera el porcentaje ni autoriza entidades patrimoniales. |
| Galicia 5.Dieciséis y Veintidós | Ley 5/2025 art. 2 y DF tercera.2.a (`e-2f05…`) | Efecto expreso 1/1/2025; no extender indiscriminadamente la entrada general de 2026 ni ignorar la retroactividad de adecuación. |
| Galicia 5.Veinticuatro | Misma ley, DF tercera.2.c | Ayudas ELA/fenotipos desde 1/1/2025, no gastos de tratamiento. |
| Galicia 5.Veinticinco | Ley 5/2025; corrección DOG 20, 30/1/2026 (`e-3f2b…`) | DF tercera.2.d remite a **adicional quinta**, no cuarta; efecto 1/1/2025 y facturas 1/7–31/12, ambos incluidos. |
| Libros: pago | Ley 2/2026, art. único y DF única (`e-c7fc…`) | Excepción expresa para efectivo en 2025. No trasladarla a climatización/eficiencia energética. |
| Libros: material | Orden 26/3/2026, arts. 2–4, DA única y DF (`e-7868…`) | Material total 300; deportivo 150; incluye mochilas, diccionarios, lectura prescrita y calculadoras básicas; excluye electrónica general, uniformes salvo deporte, servicios complementarios y recreativos ajenos al currículo. Aplica a las facturas del segundo semestre de 2025. Son límites de gasto, distintos del tope de deducción de 105 por descendiente. |
| Galicia 5.Veintiséis | Ley 5/2025 DF tercera.2.e | Talidomida con efecto desde 1/1/2023; en este encargo se revisa 2025. |
| Rioja 32.8 y 32.19 | Ley 5/2025 art. único.Uno/Dos y DF (`e-9a26…`) | Inicio de actividad agraria y cuotas con efecto expreso para periodos iniciados desde 1/1/2025. |
| Rioja 32.20 | Ley 9/2025 art. 1.Cuatro y DF única.2 (`e-1126…`) | Celiaquía retroactiva 1/1/2025. La fecha general de entrada es 1/1/2026: no retrotrae art. 1.Dos (matriculación de vehículos), Tres (remisión de mecenazgo), Once/Doce (anexo I). |
| Rioja 32.14.a | Ley 3/2021 DF tercera.2, corrección BOR 84 de 3/5/2021 (`e-c6d1…`) | Corrige 15.a por **14.a** para donativos COVID desde 2020; no extiende aquella retroactividad a todas las modalidades de mecenazgo. |
| Rioja 41 bis | Corrección BOR 119 de 21/6/2021 (`e-800c…`), DF primera.Nueve | Capítulo **III**, no II. No modifica tipos ni topes del 32.14. |
| Centros históricos | [Orden 1/3/2018, DOG 51 de 13/3/2018](https://www.xunta.gal/dog/Publicados/2018/20180313/AnuncioCA01-020318-0002_es.html), artículo único.1–2 y anexo | Original accesible que faltaba en el lote: centros delimitados por los instrumentos del anexo y certificado municipal. Se conserva en CAS y se añaden solo metadatos y dos citas. |

La referencia del consolidado de Rioja a Ley 3/2021 coincide en destino con la aclaración posterior de 2026; no es prueba de que toda Ley 9/2025 rigiera en 2025. Para esa remisión se debe conservar el texto original de 2021 y su contexto de inserción. La suspensión parcial de vehículos desde 2024 exige aplicar su disposición adicional, no leer aisladamente el 15% del 32.7.

## Base de nacimiento gallego

La corrección documental coincide con 5.Dos y las tablas AEAT 365–366, inspeccionadas visualmente: `general + ahorro − mínimo personal y familiar`. Para primer hijo, sin incrementos, 27.000 + 1.000 − 6.000 = 22.000 implica 360; aumentar general un céntimo implica 300. En los dos ejercicios posteriores, 36.000 + 1.000 − 6.000 = 31.000 implica 300 y un céntimo más implica cero; en el año del nacimiento ese último caso sigue en 300. Los demás requisitos deben satisfacerse.

Los [casos propios](casos-propios.ts) conservan este oráculo documental. No invocan una fórmula gallega inexistente para fingir una regresión de cálculo: cambiar el texto de `limites` no modifica la evaluación. La ficha sigue omitiendo prolongación dos años, convivencia al devengo y reparto. La base de alquiler gallego se comprueba **antes** de mínimos; no debe recibir la precisión de nacimiento.

## Celiaquía: alcance real y caso rojo

El art. 32.20.a–d permite 250 por persona: contribuyente, cónyuge o ascendientes/descendientes que generen mínimo; reparto igual entre quienes tengan derecho. Se comprobaron casos propios de contribuyente con un titular (250), ascendiente y descendiente con mínimo y dos titulares (125), ausencia de mínimo (0), diagnóstico después de 2025 (0), fecha civil inválida y ausencia de certificado (rechazo). Un certificado emitido en 2026 puede acreditar un diagnóstico de 2025: no procede exigir emisión dentro de 2025 sin norma.

El positivo del lote con `relacion: contribuyente` y dos titulares **puede ser admisible si el otro titular es su cónyuge**; también hay supuestos de mínimo cuya concurrencia requeriría conocer los vínculos. El caso no documenta quién es el segundo titular. No demuestra por sí solo ni error ni derecho al reparto: debe explicitar el hecho jurídico externo. Para una reproducción inequívoca basta usar descendiente común con mínimo de ambos, o añadir al escenario el vínculo conyugal de los dos titulares.

La API usa `contexto.contribuyente` para seleccionar al titular y divide 250 entre `titularesDeduccion`; el importe parcial se entiende por ese titular. `contexto.modalidad` no identifica los integrantes de una declaración conjunta. Dar 125 en ambas modalidades no demuestra infradeducción: falta saber si se pide atribución individual o resultado de declaración. `totalDeduccionesEvaluadas` rechaza `calculo_parcial` y exige mismo contribuyente/modalidad; la búsqueda de consumidores no encontró una ruta de producto que sume esos parciales como cuota definitiva. El riesgo de interpretación existe para consumidores futuros, pero no hay prueba de una suma indebida actual.

Contrato mínimo compatible: documentar «importe atribuible al contribuyente indicado, nunca total de conjunta», mantener el bloqueo del agregado y exigir que la titularidad y el mínimo aportados externamente estén acreditados. Si se pretende un total de declaración, faltan exactamente identidad de integrantes incluidos y su correspondencia con titulares: con el contrato actual debe rechazarse esa petición, sin ampliar aquí el modelo de familias.

**Rojo reproducido:** certificado con emisión 1/1/2025 y diagnóstico definitivo 31/12/2025 produce `calculo_parcial`, 250. Un certificado ya emitido no acredita como definitivo un diagnóstico futuro. Esperado: `no_soportado` por incoherencia de soporte. La prueba propia termina intencionadamente en esa aserción roja, después de los controles conformes. Arreglo mínimo propuesto: tras validar fechas civiles, rechazar `fechaDiagnostico > fechaEmision`; preservar diagnósticos de 2025 certificados posteriormente. No se implementó. Es validación del soporte, no prueba de una cuota final errónea.

## Comprobaciones y límites pendientes

HEAD comprobado: `ba266568de75dfa185f49ddcf2b969f64ff6616e`; base declarada del autor: `016ec72d9539ccd887202735960ce306bd2354e5`. Se leyeron encargo, censo, contrato y cambios para rediseño, entrega E, dos regionales, pruebas E, reserva y reproducciones privadas. Se reextrajeron las 1.048 citas de 38 documentos con SHA256/SHA512/tamaño. En HTML se contrastaron receta, índice global `p`, rango y contexto; la literalidad no elimina las atribuciones demasiado amplias del apartado Tres. En PDF se inspeccionaron las tablas gallegas y las dos correcciones riojanas visualmente. Manual fijo: SHA256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`; editorial 21/10/2026, publicación desconocida. Las cinco citas complementarias se extraen de bytes conservados.

Se separan cuatro vías: ficha descriptiva, helper heredado (`calcularDeduccionesAutonomicasAplicadas`, con fórmulas genéricas y unidades aportadas), contrato parcial y consignación (`calcularDeduccionesConsignadas`, que suma importes declarados). Ninguna prueba de páginas ni el importe consignado de bicicletas prueba aplicación de topes fiscales. El contrato parcial de celiaquía no alimenta automáticamente el agregado. Los resultados técnicos previamente comunicados por el autor no se presentan como validación propia de fiscalidad.

Queda **trabajo pendiente**, no imposibilidad de verificar: agotar las reformas intermedias y remisiones de las inversiones gallegas (calificaciones empresariales, empleo, proyectos declarados y registros); aplicar territorialmente los instrumentos del anexo de centros históricos recién incorporado; cotejar todas las ayudas del Decreto 76/2025 y su eventual exención estatal; fijar para los regímenes riojanos los anexos I/II efectivos en 2025 y agotar las remisiones históricas de vivienda anterior a 2013; completar el cotejo de destinatarios, valoración y crédito fiscal de mecenazgo. La matriz registra las cadenas localizadas y las reglas discriminantes, pero **no acredita que cada remisión de los 49 artículos haya quedado resuelta**. No se rellena esa tarea con 49 reservas de imposibilidad ni se convierte la ausencia de automatización en un dictamen normativo negativo.

La revisión demuestra las diferencias señaladas y limita expresamente su conclusión. Corresponden al integrador las sustituciones de citas, el eventual arreglo de validación y el resto del contraste fiscal; no se solicita una segunda revisión favorable ni se declara aceptado el lote.

Reproducción documental: `uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 python docs/procedencia/deducciones-2025/revisiones/e/verificar_revision.py --cas "$CAS_EXTERNO"`. Resultado propio: 49 decisiones, cinco complementos exactos y tres atribuciones ajenas reproducidas. Ruff del verificador pasa. `casos-propios.ts` puede compilarse con Bun para Node, resolviendo `effect` y `decimal.js` desde el entorno de desarrollo existente; los artefactos y el log deben ir a un directorio privado. La última aserción queda roja deliberadamente. No se ejecutaron builds ni suites pesadas.
