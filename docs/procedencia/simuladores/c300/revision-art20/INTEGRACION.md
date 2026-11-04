# Integración del artículo 20 tras revisión

La [investigación](INVESTIGACION.md) propuso compatibilidad binaria64 para la
política de empleo Madrid 2025. La [revisión independiente](REVISION.md) corroboró
las 2.603 casillas presentes del corte de 218 casos, los siete anclajes previos
y el alcance del selector. Detectó un bloqueo monetario por cancelación de
acumulados enormes y dos detalles documentales. Se conserva su dictamen previo
sin reescribirlo como aprobación retrospectiva.

El integrador limita la compatibilidad a operandos finitos entre 0 y 1.000.000
EUR. Fuera de esa cota técnica se usa la fórmula Decimal existente. No se
rechazan ingresos mayores ni se altera un límite fiscal. Dos pruebas permanentes
reproducen los acumulados: el neto 19.747,49 conserva reducción 0,01 y base
17.747,48; el neto 17.673,52 conserva reducción 2.364,34 y base 13.309,18.
`extremos-rojo.log` ejecuta la propuesta original en memoria y falla ambos;
`extremos-verde.log` ejecuta la raíz corregida y pasa ambos.

La [repetición del arnés independiente](revision-integrada.json) usa igualdad
Decimal exacta: 218 casos, 2.603 casillas presentes sin diferencias, 449 ausencias,
siete anclajes conservados y 34 muestras sintéticas. Once muestras fuera del
selector conservan también sus resultados y rastros completos. La adaptación
del arnés sólo retira el bloqueo de los hashes de preimagen y cambia el destino
y la etiqueta del resultado; no cambia expectativas ni comparación.

Se corrigen la descripción del rastro y la afirmación del investigador sobre
`toFixed(2)` en 026, como explica [ART20.md](../ART20.md). El valor oficial no
cambia. La propuesta no prueba el código interno de Open ni extiende una regla
de redondeo al histórico.

La prueba permanente contiene once capturas y controles de límites, otros
perfiles y años. Con las pruebas anteriores de Open pasan 37 métodos. Los
primeros lanzamientos conservaron cuatro discrepancias monetarias reales y
cuatro errores de preparación histórica del propio test; estos últimos se
corrigieron declarando `deducciones: "ninguna"`. Se conserva también el fallo
de lint de la anotación del test y su corrección por inferencia. Tipos y lint
focal pasan. Estas verificaciones no sustituyen el CI completo posterior.

Según el dictamen, este arreglo lo verifica el integrador sin otra revisión
general. El [manifiesto](manifiesto.json) conserva los artefactos originales y
las nuevas comprobaciones. La comparación final de 300 casos y su publicación
se registran por separado; no se atribuyen a la revisión del corte de 218.
