# Auxiliar de deducciones: hechos explícitos de 2025

Corrección candidata sobre base exacta `b95e56d6edc6c53ad68e41cd03e23ec85a6f073b`. Pendiente de revisión independiente; no supone aceptación fiscal de los casos ni cierre de las cadenas normativas regionales.

El auxiliar numérico incorpora un tercer argumento opcional `HechosAuxiliar2025`, separado del mapa escalar. Cada registro identifica código, ámbito, modalidad, contribuyente de referencia, declarantes y elegibilidad externa expresa. Las colecciones son exhaustivas para la deducción en esa declaración. No se crean personas ni se distribuyen gastos agregados entre personas supuestas. Los hechos sustituyen las fórmulas escalares de los nueve códigos, que se excluyen del recorrido genérico para evitar doble cómputo.

Las llamadas activas sin hechos suficientes lanzan `RangeError("Hechos insuficientes para deducción: " + codigo)`. Esto cambia deliberadamente el comportamiento de esas entradas: el retorno sigue siendo numérico, pero ya no ofrece como resultado corregido una cifra imposible de discriminar con la firma anterior. Los demás códigos conservan su comportamiento. Una consignación y hechos derivados del mismo código se rechazan, incluso si el importe manual es cero. Las declaraciones sin activación ni hechos conservan cero.

La API aditiva `evaluarHechosAuxiliar2025` conserva `ResultadoDeduccion`: produce `calculo_parcial`, aceptación pendiente, o `no_soportado`. El adaptador numérico suma esos importes únicamente como aritmética condicionada heredada; no equivale a `totalDeduccionesEvaluadas`. Este último sigue rechazando parciales, sin modificaciones. Se reutilizan los contratos de nacimiento canario, nacimiento madrileño y guardería murciana. No se modifica `contratos-2025.ts`: queda intacta la corrección de fechas de celiaquía. Tampoco se modifica `calcularDeduccionesConsignadas`, ni su conexión anual.

## Resultados y evidencia

Los casos sintéticos de la nueva suite comprueban: alquiler cántabro conjunto 600; nacimiento cántabro con dos progenitores individuales 700; nacimiento canario de orden ordinario tercero y primero discapacitado 1.130; familia numerosa general canaria con dos titulares individuales 298,50 y especial 398; dos contribuyentes discapacitados conjuntos 800; dos desempleados conjuntos con rendimientos de 9.000 cada uno 240; cuidados de dos ascendientes baleares con 2.000 cada uno 1.320 y con 1.000 cada uno 800; parto madrileño múltiple de 2025 2.886,80; dos menores murcianos con 5.000 cada uno 2.000, frente a un menor con 10.000 que da 1.000. Las ayudas murcianas se restan antes del porcentaje y del límite por menor.

**Precisión del encargo:** 530 corresponde al tercer hijo ordinario, no al cuarto. El art. 10 canario y el manual fijado atribuyen 796 al cuarto. Se conserva el discriminante original de C (tercero + primero discapacitado = 1.130) y se añade cuarto + primero discapacitado = 1.396; no se inventa una escala para obtener 1.130 en el cuarto.

Se contrastaron contra los bytes conservados 278 citas de estos nueve códigos, con comprobación de ambos hashes y tamaño. Se reextrajeron también las condiciones comunes, sin transformar su literalidad en aceptación completa. Referencias reproducibles en los paquetes existentes:

| Regla | Fuente y citas operativas conservadas | Manual AEAT, páginas comprobadas |
|---|---|---|
| Cantabria alquiler | Lote B, DL 62/2008 art. 2.1; citas del código `-n1` a `-n5`, reforma Ley 3/2023 art. 3 y reproducción primaria enlazada; se mantiene la rectificación de atribución advertida por revisión B | 208–209 |
| Cantabria nacimiento | Ley 3/2023 art. 3.Seis → art. 2.10; cita `cantabria_nacimiento_adopcion_hijos-reforma-2023-art3-seis` y revisión B `rb-2` | 220–221 |
| Canarias nacimiento | Lote C, DL 1/2009 art. 10, redacción Ley 9/2025 DF 11.5 con efectos 1/1/2025; `-ley-3` a `-ley-13` y `-original-literal-3` a `-original-literal-10` del código | 182–183, comunes 206–207 |
| Canarias discapacidad | Art. 11 y condiciones comunes arts. 2, 17 y 18; citas `-ley-` y `-original-literal-` del código | 184, 206–207 |
| Canarias familia numerosa | Art. 13; citas `-ley-1` a `-ley-5` del código: importes, discapacidad y reparto entre titulares convivientes | 187–188, 206–207 |
| Canarias desempleo | Art. 16 bis; `-ley-1` a `-ley-4` del código: más de seis meses; trabajo >15.876 y ≤22.000 sobre la suma en conjunta; otras bases ≤1.600 | 201–202, 206–207 |
| Baleares cuidados | Lote C, art. 6 quinquies, Ley 7/2024 DF 11; `-original-literal-1` a `-original-literal-11` del código, BOIB y reproducción enlazados; 40%, 660 por persona y reparto distinto de ascendientes/descendientes | 160–161 |
| Madrid nacimiento | Lote F, Ley 13/2023 art. único.Seis, art. 4 y límites art. 18; cita primaria `madrid_nacimiento_adopcion_hijos-c22`, fragmento acotado de revisión F `madrid_nacimiento_adopcion_hijos-original` | 404–405 |
| Murcia guardería | Art. 1.Tres, Ley 14/2018 art. 56.1; `murcia_gastos_guarderia-c27`, `-c28` y continuación normativa/manual; revisión F del código | 447–449 |

Manual SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. La fecha editorial no acredita publicación. Las referencias anteriores remiten a citas/localizadores y metadatos de fuentes públicos existentes, sin copiar originales.

## Elegibilidad externa y límites

`elegibilidadExterna` declara que se han comprobado, para todas las personas/gastos aportados, los requisitos no evaluados. No se deduce de los antiguos booleanos. En Cantabria alquiler incluye edad/discapacidad, vivienda, esfuerzo de renta y pagos documentados no efectivos. En nacimiento cántabro incluye nacimiento/adopción y titulares reales; el caso individual de progenitor único se rechaza en este parcial, sin inventar un segundo titular ni resolver silenciosamente la interpretación del reparto.

En Canarias nacimiento incluye convivencia, discapacidad que origina el suplemento, supervivencia de anteriores hijos con discapacidad y determinación del orden al devengo; la renta se aporta y contrasta expresamente. En familia numerosa incluye título, categoría, convivencia y derecho de cada titular; en discapacidad, reconocimiento y circunstancias al devengo. Desempleo recibe todos los declarantes y sus rendimientos, prestación y meses legales, sin exigir el mínimo de trabajo a cada cónyuge. La residencia y condiciones comunes siguen siendo externas.

Baleares recibe gasto elegible y ayuda por persona; el derecho al mínimo, servicio elegible, edad/discapacidad, pago bancario, alta laboral cuando proceda e incompatibilidad con conciliación siguen siendo externos. Cada titular de ascendiente común conserva el derecho íntegro; los descendientes se reparten entre titulares. No se infiere parentesco del contador.

Madrid agrupa por evento, con año, hijos y progenitores convivientes; se exige historial de bases desde el evento. El incremento múltiple se aplica a eventos de 2025, no a eventos separados ni a nacimientos de 2024. Sigue pendiente la acreditación externa de unidad familiar y modalidad histórica por período y documentación. Murcia conserva el cálculo por hijo, conceptos, ayudas, bases y reparto; centro autorizado, etapa, mínimos, convivencia, pagadores y facturas se acreditan externamente. En nacimientos cántabros/canarios y en Madrid/Murcia se rechazan conjuntas con titulares del evento fuera de los declarantes, en lugar de asumir su integración.

No se evalúan cuota disponible, todas las incompatibilidades regionales ni remisiones estatales. No se han añadido familias, composición, admisión, puertas ni UI.

## Verificación

Antes del fix se conservaron copias privadas ordinarias de B, C y F: C reproduce siete discrepancias en once escenarios; F, con `it.fails` convertido en `it`, dos fallos reales y cinco pases; B documenta los dos resultados escalares erróneos y sus fronteras. No se editan las revisiones ni sus rojos históricos.

La nueva suite añade hechos completos, falta de hechos, identidades duplicadas, fronteras de renta, céntimos, modalidades, territorio, año, ayudas y doble cómputo. Los controles antiguos de los nueve códigos pasan a exigir el rechazo de hechos insuficientes: sus importes históricos de control permanecen exportados y no acreditan elegibilidad. B conserva sus cálculos independientes de 600/700 y cambia las aserciones del auxiliar a rechazo; la prueba territorial de Madrid también distingue rechazo local de cero al filtrar otra comunidad. F conserva sus dos fallos esperados históricos.

Regresión focalizada: 14 archivos, 601 pruebas aprobadas y dos fallos históricos esperados. Lint del alcance: 16 reglas a error, sin diagnósticos; ESLint del alcance sin diagnósticos. Tipos globales conserva los cuatro errores históricos de pruebas r47/r52 por módulos privados ausentes; tipos del alcance pasan sin errores. No se ejecutan build ni suites legacy pesadas. La búsqueda en app y lib confirma que el único resultado del nombre del auxiliar es su definición: no hay consumidor que migrar allí. Logs, configuración, inventario, patch y comprobación sobre scratch privado se transportan fuera de Git.
