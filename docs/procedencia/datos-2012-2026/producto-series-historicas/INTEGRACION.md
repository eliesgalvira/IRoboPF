# Integración de las cuotas históricas de Madrid

El 4 de noviembre de 2026 se integra la selección de las cuotas fijas publicadas
para 2018–2021 y 2023–2024, exclusivamente en devengos ordinarios sin fallecimiento.
La [revisión independiente](../revision-series-historicas/DICTAMEN.md) contrasta
las columnas normativas y su vigencia. Conserva los originales, sus hashes y
facsimilares; no acredita concordancia con Open histórico.

Las 40 diferencias de céntimo del sondeo original se reproducen en pruebas antes
del arreglo. Después pasan las 47 regresiones permanentes: esos 40 casos,
seis exclusiones de fallecimientos y las selecciones vecinas de 2017/2022/2025.
El bloque focal completo pasa 228 pruebas. La cuota exacta se compara con
Decimal, sin tolerancia; los ceros decimales finales del oráculo no son una
diferencia monetaria. La presentación en céntimos se compara literalmente.

El CI completo también detecta una expectativa antigua de Madrid 2018 con
400.000 EUR brutos. La cuota fija revisada produce 163.510,38682975 EUR íntegros
y 162.483,63682975 EUR tras mínimo: sus presentaciones suben un céntimo.
Se recalcula con Decimal desde bruto y cotización, usando las filas normativas
revisadas, y se actualiza esa regresión con la derivación explícita. No es un
cambio adicional de fórmula ni una modificación de una referencia Open.

2022 y las referencias de 2025 se conservan. El límite genérico de 2020 ya era
53.407,20 EUR, conforme a la norma; el 53.407,29 del manual AEAT se documenta como
discrepancia de la fuente secundaria, sin cambiar ese dato del motor.

Los informes, parches «no aplicados» y resultados rojos originales permanecen
inalterados como evidencia de recepción. Este documento registra su integración
posterior. El CI completo del candidato se ejecuta antes de publicar. No se
amplía el alcance a fallecimientos, otros territorios ni declaraciones completas.
