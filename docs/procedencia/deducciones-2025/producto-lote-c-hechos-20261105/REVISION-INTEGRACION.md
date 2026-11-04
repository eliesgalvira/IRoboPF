# Canarias y Baleares: revisión y corrección

La revisión independiente encontró R1 en conciliación balear con dos titulares.
La base contiene exclusivamente pagos del solicitante; aplicar después otro
reparto al resultado reducía indebidamente ese gasto propio. Se adopta el criterio
operativo explícito del manual AEAT2025, página155, cita
`balears_conciliacion_menores_6-manual-42`: se reparte el máximo, manteniendo el
porcentaje sobre pagos propios. Con1.000 euros propios y dos titulares, las
ramas general y reforzada generan330 y450 euros, frente a200 y250 anteriormente.

Se conserva la diferencia textual con el
[artículo6bis.4](https://www.boe.es/buscar/act.php?id=BOE-A-2014-6925&p=20250724&tn=1#a6-12),
que describe el prorrateo de modo general. La concreción del manual no se presenta
como una modificación del texto legal ni se exporta a otras deducciones. Esta
decisión queda también en el rastro del cálculo y en la matriz. El integrador
reabrió el original del manual con SHA256
`765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`
y cotejó la versión legal de24/7/2025. No cambian CAMP01 ni los efectos temporales
y límites de renta de CAMP02.

R2 admitía días RETA posteriores al fallecimiento. El período2025 se cuenta hasta
el devengo inclusive;11 de julio corresponde a192 días. Declarar193 o365 para ese
devengo se rechaza, sin devolver un impuesto cero. Se conservan los umbrales182/183
de la rama reforzada y las fronteras192/193 y365 al cierre ordinario.

La revisión original conserva14 pruebas verdes y tres rojas. Se añaden seis
regresiones permanentes y se conserva la suite independiente sin cambiar sus
expectativas. Validación posterior:50 pruebas permanentes y17 independientes,
67 correctas en total. Tipos, Oxlint y ESLint correctos, una suite a la vez bajo
timeout. CI global y publicación siguen pendientes.

Alcance: diez códigos parciales nuevos, cinco reutilizaciones y36 fórmulas
pendientes. Siguen fuera de esta rama el prorrateo diario por edad/eventos del
menor, titulares heterogéneos y composición conjunta y anual.
