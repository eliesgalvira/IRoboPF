# Asturias y Cantabria: procedencia de deducciones de 2025

Entrega **candidata con reservas**, sobre `016ec72d9539ccd887202735960ce306bd2354e5`. Contiene los 48 códigos censados: 27 de Asturias y 21 de Cantabria. No supone aceptación normativa ni cierre de todas las cadenas históricas.

Se contrastan las fichas, los artículos individuales, sus secciones del manual y las rutas reales de cálculo. Los dictámenes separan ficha y cálculo. Hay 462 comparaciones y 673 citas de 16 documentos conservados externamente. Las comparaciones anteriores a una corrección llevan `momento: antes`; las actuales del mismo campo conservan las reservas. La cita de nacimiento enlaza también el artículo 3.Seis de la Ley 3/2023 publicado en BOE; el original BOC se conserva ahora en el complemento de la revisión, pendiente de incorporar al paquete junto a las rectificaciones.

## Cambios documentales

En Cantabria se sustituyen 18 descripciones genéricas que prometían fórmulas y controles por resúmenes de las cantidades y condiciones identificadas. Se mantienen tipo `mixta`, entradas manuales, códigos, exports y campos. Estos cambios no implementan cálculo automático ni completan los requisitos de cada ficha.

Sus discriminantes documentales comparan el campo anterior con las magnitudes normativas y la ruta de consignación. No se cuentan como 18 errores numéricos corregidos: son omisiones y promesas de automatización de las descripciones. Los resúmenes nuevos requieren contraste independiente.

Se corrige además el límite de cuidado de familiares: el artículo 2.2 regula rentas del familiar —6.000 euros, o 1,5 IPREM en los supuestos de discapacidad— y no la base liquidable menos mínimo del contribuyente inferior a 31.485 euros que afirmaba la ficha. El caso hipotético de un contribuyente con base de 40.000 euros y un ascendiente elegible demuestra la diferencia documental. No se atribuye un error financiero a una consignación profesional.

Las pruebas rojas previas se conservan en el transporte privado. No se han cambiado evaluadores compartidos, tipos, adaptadores, helpers ni interfaz.

## Cálculo y consignación

Dos diferencias quedan reproducidas en el helper exportado `calcularDeduccionesAutonomicasAplicadas`:

- Alquiler cántabro conjunto, 6.000 euros elegibles: calcula 300; el artículo 2.1 permite 600 cuando concurren sus requisitos.
- Nacimiento cántabro, un hijo y declaración individual de un progenitor: calcula 1.400; el reparto legal da 700. La modalidad y los titulares son hechos externos que la API no recibe.

La ruta visible actual usa `calcularDeduccionesConsignadas`. Sin `:importe` devuelve cero en estos casos; una consignación explícita conserva el importe suministrado. Por ello las diferencias del helper no acreditan una liquidación anual actual incorrecta. Las otras 46 deducciones carecen en estas rutas de una evaluación fiscal completa verificable: una cantidad externa o una multiplicación genérica no acredita elegibilidad, sujetos, reparto e incompatibilidades.

Los dictámenes anteriores contienen 21 diferencias y 27 no verificables. Después de las correcciones documentales permanecen dos diferencias del helper y 46 no verificables. Ninguna ficha recibe coincidencia global: las coincidencias cuantitativas parciales no cierran su cadena histórica.

La [revisión independiente](../../revisiones/b/INFORME.md) detectó una tercera diferencia documental en estudios: la renta igual a 8.000 quedaba incluida en el resumen. Está corregida con prueba y cita original completa. También identificó 18 atribuciones incorrectas, citas de educación confundidas con inflación y un testimonio de vehículos que incorpora 2026. Esas rectificaciones siguen pendientes; los recuentos candidatos anteriores no constituyen aceptación. El [contraste posterior](../../revisiones/b/CONTRASTE.md) distingue los cambios ya comprobados de los trabajos abiertos.

## Fuentes y reservas

El manual comprobado es la edición de 21/10/2026, 635 páginas, SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. Las páginas del censo proceden de otra edición. Cada registro conserva ambas referencias y localiza su sección actual por artículo, sin aplicar un desplazamiento global. Se inspeccionó visualmente la tabla de libros y material escolar asturiana de la página física 104: sus tramos y límites individuales/conjuntos coinciden con las magnitudes de la ficha.

Se conservan el BOPA original del texto refundido asturiano, los originales autonómicos de las leyes 4/2023, 3/2025 y 5/2025, el BOCT original de 2008 y la Ley cántabra 3/2024, además de publicaciones BOE y los consolidados expresamente identificados como tales. La Ley asturiana 5/2025, pese a titularse presupuestos para 2026, establece en su disposición final tercera la entrada en vigor de los apartados 1 a 17 del artículo 39 el día de publicación en BOPA, 31/12/2025. La deducción de celiaquía se identifica separadamente. Para Cantabria se utiliza la redacción de 30/12/2024, excluyendo la modificación de abril de 2026.

**Permanece pendiente cerrar, por apartado, la secuencia íntegra de originales autonómicos, reformas y correcciones.** No se presenta la enumeración de referencias del consolidado como prueba de esa secuencia. Los registros individualizan el artículo, referencias localizadas, comprobaciones realizadas y evidencia restante. Las corroboraciones literales en originales son citas adicionales, sin convertirlas en acreditación de toda la vigencia. Las remisiones a mínimos, clasificación demográfica, categorías de vehículos y requisitos societarios siguen condicionando la evaluación completa; no se sustituyen por una casilla `cumple`.

Los originales, imágenes de inspección y registros de ejecución quedan fuera de Git. El manifiesto público solo contiene URL oficial, metadatos y hashes. Las cajas PDF son bloques de texto en puntos; las recetas HTML fijan selector y rango semiabierto sobre `get_text(' ', strip=True)` del original conservado. Algunas citas son fragmentos de un apartado: no representan su texto íntegro ni autorizan a prescindir de los demás requisitos.

## Verificación reproducible

`verificar.py` exige uno o varios roots CAS planos mediante `--cas-plano`. Revisa cobertura exacta, SHA-256, SHA-512, tamaño, referencias y literalidad de todas las citas. Dependencias: `pymupdf==1.26.7` y `beautifulsoup4==4.15.0`, con Python 3.13 y `uv run --no-project --with` en caché externa.

Las cuatro suites focalizadas son `deducciones-procedencia-2025-b`, `deducciones-autonomicas-2025`, `deducciones-autonomicas-aplicadas` y `deducciones-ambito`: 26 pruebas aprobadas. Las pruebas de esta entrega mantienen dos testigos de las diferencias conocidas del helper; no presentan esos resultados parciales como conformes a la norma. ESLint, oxlint con las reglas del proyecto y Ruff pasan. Los dos JSON cumplen el schema común candidato. La aceptación y el cierre de las reservas requieren revisión independiente.
