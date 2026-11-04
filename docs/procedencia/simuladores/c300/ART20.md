# Compatibilidad observada del artículo 20 en Open 2025

El corte revisado de C300 contenía cuatro discrepancias de un céntimo en la
casilla 0023. En `c300-016` se propagaban a dos gravámenes y cambiaban el
resultado final de −1310,96 a −1310,94 €. El cotejo exacto de la corrección
integrada reproduce las 2.603 casillas presentes de los 218 casos del corte;
las 449 ausencias siguen siendo ausencias. Conserva también los siete anclajes
anteriores. Estas cifras no son el balance final de los 300 casos.

## Cambio de cálculo

En empleo laboral o estatutario de Madrid 2025, el núcleo compartido del
artículo 20 puede evaluar sus operaciones con aritmética binaria64. Reconstruye
el argumento desde los subtotales íntegro y gastos a–e, sin incluir el gasto f,
y redondea el resultado binario con `Math.round(valor * 100) / 100`. Cada tramo
conserva una sola fórmula; la política selecciona sus operaciones. El adaptador
sólo aporta los subtotales y mantiene el límite por saldo positivo.

Esta implementación reproduce el comportamiento observado; no demuestra el
código interno del servidor ni una regla jurídica universal de redondeo.
Los coeficientes y tramos siguen procediendo del
[artículo 20 de la LIRPF](https://boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20250725&tn=0#a20).
La evaluación decimal sigue siendo la predeterminada del núcleo.
No se extiende esta compatibilidad a otros ejercicios, territorios, pensiones
o actividades económicas.

Cuatro empates ilustran la diferencia: 5.509,965; 7.259,965; 2.972,465 y
2.897,985. Su evaluación binaria en el recorrido observado queda por debajo
del empate. Sin embargo, otros anclajes exigen redondear hacia arriba: el caso
DA61 conserva 5.292,27. Redondear el producto intermedio o cambiar globalmente
a half-even rompe coincidencias anteriores. Tampoco basta convertir a número
el neto decimal ya calculado: el anclaje `c300-045` discrimina ese recorrido.

## Cota técnica para conservar precisión

La revisión independiente encontró una pérdida distinta con acumulados enormes:
90 billones de euros de íntegro y gastos casi iguales daban un neto binario
19.747,484375 en lugar del neto exacto 19.747,49. La propuesta publicaba reducción
0,02 en vez de 0,01. Otro extremo alteraba 2.364,34 a 2.364,35.

La compatibilidad binaria se limita por ello a subtotales íntegro y gastos a–e
finitos entre 0 y **1.000.000 EUR**. Es una cota técnica, no un límite fiscal ni
un rechazo de rentas mayores: fuera de ella se conserva el cálculo Decimal y
la cuantización de salida ya existente. La cota cubre todos los anclajes del
corte y deja el error de representación de la resta muy por debajo de 0,0001
EUR, el paso mínimo de las expresiones con entradas a céntimos. No se usa ninguna
tolerancia para comparar resultados oficiales.

Los dos extremos tienen regresiones permanentes y reproducción roja sobre la
propuesta anterior, sin sustituir importes esperados. La repetición del arnés
independiente sobre la integración conserva las 2.603 coincidencias, los siete
anclajes y once muestras completas fuera del selector. Las 34 muestras sintéticas
del arnés son predicciones de la API, no nuevas capturas oficiales.

## Evidencia y pruebas

[art20-oficial.json](art20-oficial.json) transcribe once capturas del corte:
los cuatro casos discrepantes y siete discriminantes. Conserva entradas,
casillas y hashes/tamaños de PDF y SES; los originales permanecen en CAS externo.
`tests/art20-open-c300.test.ts` comprueba sus casillas presentes mediante igualdad
Decimal exacta, además de precisión histórica, perfiles excluidos y acumulados.
Con los anclajes anteriores pasan 37 pruebas focales. Los informes originales,
el dictamen y la integración se conservan en
[la revisión numérica](revision-art20/INTEGRACION.md).

Se corrige una afirmación del informe del investigador: en `c300-026`,
`toFixed(2)` sobre la expresión binaria reconstruida da 5.292,27. No distingue
ese recorrido de `Math.round`; el 5.292,26 corresponde a otra conversión.
Se conserva el informe original y esta rectificación, sin cambiar la captura.

El primer lanzamiento de la prueba nueva reprodujo las cuatro discrepancias y
tuvo además cuatro errores de preparación de casos históricos: arrastraban el
marcador DA61 de 2025. Se corrigió ese marcador a `ninguna`, sin cambiar el motor
histórico ni sus expectativas. Un control de lint detectó asimismo una anotación
que ensanchaba innecesariamente el tipo de la tabla del test; se corrigió por
inferencia. Ambos intentos fallidos se conservan y no se presentan como defectos
fiscales adicionales. El CI completo y el cotejo final C300 siguen siendo pasos
posteriores, separados de esta validación focal.
