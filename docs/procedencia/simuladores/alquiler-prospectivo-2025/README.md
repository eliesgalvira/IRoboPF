# Observaciones adicionales de alquiler, renta 2025

La muestra ponderada original conserva **76 de 80 casos**. Estos cuatro casos
sintéticos son adicionales, sin peso, de una selección prospectiva de cuatro.
No sustituyen los cuatro arrendadores originales con coste del suelo conocido.
Asturias declara expresamente una vivienda unifamiliar excluida del rango
individual SERPAVI, con reserva documental histórica y hechos ficticios.
El manifiesto no habilita por sí mismo el conteo en el medidor público.

Las predicciones se guardaron antes de las capturas. Los originales de cada
carpeta son el escenario, la predicción completa y los archivos SES/PDF de Open;
`MANIFIESTO.json` y los recibos fijan sus bytes. Todos los datos personales y
documentales son inventados: no representan a contribuyentes reales. Los PDF
son borradores del simulador, no declaraciones presentadas. El SES se conserva
en `captura-ses.json` como texto Latin-1 transportado en JSON UTF-8. Convertir
`contenido` a bytes Latin-1 y comprimir con zlib nivel 6 reconstruye exactamente
el original: se verificaron tanto el hash descomprimido como el comprimido.
No se cambia ningún registro ni se omiten los buffers internos.

Andalucía arroja un diferencial de **2.547,87 euros**. Los casos madrileños
arrojan **1.973,14** y **2.682,34 euros**, incluyendo una deducción autonómica
de 100 euros por 1.000 euros de reparación. Se introdujo el gasto, no el
resultado de la deducción ni una amortización calculada externamente.

Asturias arroja **1.664,74 euros**, con 500 euros de deducción por 1.000 euros
de reparación. Su predicción se selló antes de abrir una nueva declaración.
La captura ordinaria introduce salario, retenciones, valores de adquisición y
catastro, contrato y gastos; Open calcula la amortización y la deducción.
Se conservan 312 registros SES, sus 31 secciones y las cinco páginas del PDF.
La tipología, el municipio y la validez material de los documentos son hechos
externos estipulados; la salida del simulador no los autentica.

## Revisión y límites

La revisión independiente cotejó los censos completos, identidad sintética,
salario principal y desglose, ocho lecturas laborales, resumen, buffers
auxiliares, inmueble y contrato, gastos, deducciones, casillas y todas las
páginas del PDF. Andalucía y el primer Madrid recibieron dictamen favorable
condicionado a los hechos externos del escenario. El segundo Madrid conserva
una reserva de precisión intermedia. Las tres salidas finales concuerdan al
céntimo con las predicciones; esto no identifica el algoritmo interno de AEAT.

En el segundo Madrid, el coste operativo racional previsto es 75.015,20004,
mientras que SES y PDF guardan 75.015,20. La diferencia exacta es **0,00004 euros**.
Ambos importes conducen a la amortización de 2.250,46 y a la misma cuota en
este caso. No se cambia el esperado, no se añade tolerancia y no se afirma
igualdad exacta de ese campo. Esta observación no permite decidir entre
cuantización interna y cuantización de persistencia o presentación.

La prueba histórica utiliza una cota uniforme: si A es precio más gastos,
C el coste racional de construcción y H = 0,03 × A × 31/366, cualquier
amortización anterior admisible D cumple 0 ≤ D ≤ H. Se verifican
H + 0,03 × C ≤ C y H + amortización operativa ≤ C. Por tanto, dentro de las
condiciones declaradas, el límite acumulado no recorta la amortización anual
para ningún D admisible. No se supone D = 0.

El desconocimiento del suelo, los usos anteriores, la historia catastral,
el censo mundial, la naturaleza corriente de la reparación y la cesión gratuita
del domicilio por un tercero ajeno al empleo son estipulaciones sintéticas.
Open no acredita esos hechos omitidos. En Madrid también son estipulados la
localización y la copia nominal del depósito de fianza. El cotejo confirma la
proyección representada, no la autenticidad de documentos ficticios ni todos
los perfiles de arrendadores.

## Incidencias conservadas

La previsión inicial de una única tentativa no se cumplió en Andalucía ni en
el primer Madrid: hubo errores mecánicos de navegación y exportación. Las
capturas finales parten de una declaración nueva y concilian el salario, su
desglose y el resumen. Se preservaron las tentativas anteriores; no se cambiaron
entradas o esperados monetarios para acomodar los resultados. No se cuenta
cada tentativa como un caso independiente.

Antes de las predicciones madrileñas se enmendó expresamente el escenario para
representar el derecho a la deducción por reparación y su depósito de fianza.
No se presenta como una entrada idéntica a la selección inicial sin otras
deducciones. Los estados pendientes conservados dentro de los escenarios son
antecedentes documentales, no banderas actuales de admisión.

La regresión `tests/alquiler-prospectivo-2025.test.ts` conserva las cuatro
predicciones y comprueba bases, amortización, cuatro gravámenes, deducción,
retenciones y diferencial mediante la API explícita. Es una prueba de cálculo;
no reemplaza el vínculo documental ni modifica el contador original.

El cierre previo de la conexión madrileña está en
`docs/procedencia/reforma-motor/revision-madrid-arrendador-cierre.txt`.
Su reserva de que todavía no había observaciones oficiales corresponde al
momento de aquella revisión; las presentes capturas son posteriores.

Cada caso aporta una distinción: escala andaluza, gasto deducible madrileño,
coste intermedio madrileño con subcéntimos y gasto asturiano al 100 % con tope.
La igualdad final es 4/4; la igualdad de los intermedios contrastados es 3/4.
No se añaden pesos sin soporte estadístico ni se sustituyen los cuatro casos
originales cuyo suelo conocido no se pudo transmitir por esta vía ordinaria.
