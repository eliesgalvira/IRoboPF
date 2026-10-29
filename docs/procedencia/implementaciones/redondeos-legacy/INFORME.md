# Redondeos del detalle tabular heredado

Entrega candidata contra c61a306107f280c399eb57e57a7c45452bd68864. Integración y revisión nueva corresponden al padre. Sin mutaciones VCS, originales alterados, fixtures regenerados, contratos canónicos modificados ni aceptación fiscal propia.

## Decisión, objeción y coste

Se separa el detalle DAT_YYYY del cálculo Decimal liquidado. El original calcula con escalares NumPy procedentes de np.arange y con floats Python procedentes de parámetros y constantes. Aplicar half-even decimal a un valor Decimal no reproduce ese procedimiento. Tampoco lo reproduce round(float) indiscriminado. La objeción experta es preservar la representación, el orden y el tipo de cada operación, no corregir solo dos salarios mediante epsilon. Por eso el adaptador conserva ambos tipos de escalar y redondea únicamente cada columna de salida. El coste es mantener un adaptador técnico adicional con fórmulas binarias heredadas; debe revisarse separadamente de cambios normativos.

El dinero liquidado conserva HALF_UP y precisión Decimal existente. Ni el adaptador ni el HALF_UP son una norma fiscal universal. No se modifica factor-ipc.ts. La comparativa IPC conserva su implementación anterior: esta entrega corrige DAT_YYYY, no certifica equivalencia integral de COMPARATIVA_INFLACION, ni subsana su doble redondeo mensual. No debe declararse cerrado RED-ETAPAS-IPC.

## Reproducción antes de corregir

rojo.log registra tres fallos: D32 devuelve 1,91 frente a 1,90; E12 y W12 devuelven 9,37 frente al valor XML 9.359999999999999 (9,36 a céntimos). Q2 pasa con 1.274,87 y se conserva como control positivo, no como defecto inventado.

El Excel se leyó mediante ZIP/XML iterparse, solo controles completos y filas seleccionadas. SHA-256 106c8cd765c60d587938939fff5b0dec8ff1ea76b690eee142fc59e16739c1a7. Las celdas contienen valores escritos. excel.json conserva la extracción independiente inicial, sin modificar el libro. Las comprobaciones de cadenas son exactas; la muestra XML numérica permite solo residuos de representación a 10 decimales, nunca un céntimo.

NumPy 2.5.4 y Python 3.13.15 reproducen los casos; numpy-final.log conserva valores reales. La documentación instalada de numpy/_core/fromnumeric.py:3662–3666 describe multiplicación por 10**decimals, rint y división. El helper NumPy hace esas tres operaciones binary64 y desempata al par. El helper Python descompone el binary64 mediante DataView, obtiene su racional exacto y redondea ese racional mediante enteros BigInt antes de volver a Number. No suma epsilon. Se usa con decimales enteros no negativos pequeños (0–4), dentro del rango de salarios del perfil; no se ofrece como API general para NaN, infinitos ni escalados desbordados.

## Orden del detalle

1. Salario NumPy; min(salario, base máxima) conserva el primer operando en empate. Si vence el tope, la base es float Python.
2. Sumar tipos ordinarios en su orden original; sumar MEI; multiplicar por base. Añadir solidaridad después de sumar sus tres tramos, con repartos binarios 5/6 y 1/6.
3. Restar cotización sin liquidar al bruto. Evaluar reducción sobre ese rendimiento. Restar gastos y aplicar máximo con cero; después restar reducción y aplicar máximo con cero.
4. Calcular tramos completos con floats Python y el parcial con el tipo de la base. Sumar cuotas en orden. Restar mínimo personal, deducción y aplicar límite de retención sin liquidar intermedios.
5. Restar cotización e IRPF precisos al bruto para el neto. Redondear separadamente las columnas al final. Redondear componentes antes de restarlos sería otro algoritmo.

Las etiquetas de columnas y estructura de filas se conservan. oracle_acotado.py compila cuerpos originales sin modificarlos y cambia únicamente el iterable de salarios y el contenedor DataFrame. Sus salidas son evidencia nueva del Python, no un fixture existente sustituido ni un oracle escrito a partir del adaptador.

## Presentación mensual y porcentajes

La API mensual de céntimos conserva su contrato histórico: Math.round(anual/12), con empate hacia +∞. +18 produce +2 y −18 produce −1. Se nombra expresamente mensualizarCentimosPresentacionLegacy y se prueba la falta de antisimetría. No se introduce una API fiscal nueva sin norma y no se altera la API canónica ajena. El Python tabular divide el delta preciso de euros antes de redondear; por ejemplo 0,059/12 da 0,00, mientras mensualizar seis céntimos liquidados da uno. Las dos etapas se prueban y no se equiparan.

Las 543 celdas CONTROL (195 generales y 348 de tramos) conservan la implementación actual y se cotejan íntegramente con la extracción del libro, incluidas cabeceras. El glosario atribuye half-even al helper de porcentajes, pero porcentajeCompatibleLegacy ejecuta HALF_UP. Una prueba discriminante con ±0,01005 produce ±1,01 %. Decisión: no cambiar ese helper fuera de propiedad ni deducir otra política de controles que no contienen empates discriminantes. Propuesta documental al padre: sustituir la entrada genérica «Half-even tabular legacy» por contratos separados de porcentajes actuales, round NumPy y round Python del detalle; limitar half-up al dinero liquidado de las APIs. No se editó el glosario ni GLOSSARY.md.

## Integridad, autenticidad, interpretación, exactitud y aceptación

Integridad: hashes del libro, Python, base y entrega; originales sin alteración. Autenticidad: no se acredita autoría del libro ni versión del entorno que lo generó. Interpretación: el contrato es reproducción técnica de una hoja histórica, no vigencia de sus parámetros. Exactitud: los resultados de pruebas acreditan solo sus salarios, años y columnas; no son una auditoría fiscal exhaustiva. Aceptación: pendiente de revisión independiente nueva; ningún resultado se autoacepta.

## Límites de integración

La caracterización previa falla con salario 20.000 en 2012: espera 3.979,31 en tramo e íntegra y el adaptador entrega 3.979,30. verde-inicial.log conserva el fallo. No se cambian sus expectativas ni se oculta con tolerancia de un céntimo. La decisión sobre esa caracterización corresponde al padre tras contrastar los originales. El informe distingue este fallo de una suite global verde.

No se han ejecutado Next build ni las suites legacy pesadas. No se han cambiado package, lockfiles, CI, ESTADO, DECISIONES, corpus, contenidos, UI ni contratos fiscales canónicos. El enlace node_modules no forma parte de la entrega para integrar.

## Resultado final de la validación

- 15 pruebas focalizadas correctas (verde-final.log): tres contraejemplos, Q2, 543 celdas CONTROL exactas, 2.323 celdas DAT_2012 de salarios 0–100, fila 20002 del libro, y 40.875 celdas de 1.875 filas Python (125 salarios × 15 años). Los recuentos se solapan; no sumarlos como cobertura fiscal independiente.
- El contraste Python acotado compara números exactamente, sin tolerancia. El contraste XML permite únicamente el residuo de serialización indicado. Las cabeceras se comparan exactamente.
- Confirmación adicional: DAT_2012 fila 20002, tramo e íntegra = 3.979,30 en Excel, Python original y adaptador. El fixture previo espera 3.979,31; permanece sin modificar y su suite no está verde.
- ESLint y oxlint con política existente: correctos en las cinco fuentes TS de la entrega. Ruff: correcto en los tres scripts Python.
- Typecheck principal sin incremental: correcto; no se ha cambiado vendor.
- Pendiente: integración selectiva, contrarrevisión nueva, decisión del padre sobre caracterización previa y reconciliación separada de COMPARATIVA_INFLACION. No se afirma regresión global verde ni equivalencia universal del libro.
