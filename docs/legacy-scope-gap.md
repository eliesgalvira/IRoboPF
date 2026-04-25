# Brecha de alcance entre legacy Python y motor Effect

Revisión: 2026-04-25.

## Decisión de producto

El lenguaje de dominio define **Exportacion compatible** como una salida que replica
el Excel original y define **Equivalencia tabular** como igualdad de cada hoja,
columna, fila y celda de datos. Esa es la decisión de producto: la compatibilidad
legacy debe replicar el libro Excel original completo generado por
`Calculo_Salario_IRPF.py`.

El motor Effect actual no alcanza todavía esa equivalencia tabular completa. La
brecha no es una contradicción del lenguaje de dominio; es trabajo de migración
pendiente.

Hasta que se complete esa migración, no debe afirmarse que el motor Effect tiene el
mismo alcance funcional que `Calculo_Salario_IRPF.py`.

## Definiciones relevantes en CONTEXT.md

- **Exportacion compatible**: replica el Excel original, incluyendo nombres de
  hojas, columnas, orden y redondeos.
- **Equivalencia tabular**: garantiza que cada hoja, columna, fila y celda de
  datos de la exportacion compatible coincide con el Excel original bajo reglas
  explicitas de tipos, orden y redondeo.
- **Oracle legacy congelado**: version estable del proyecto original usada como
  referencia fija para validar la migracion inicial.
- **Fixture legacy Excel**: archivo Excel generado por el oracle legacy congelado
  y usado como referencia rapida de equivalencia tabular.
- **Regeneracion legacy**: proceso pesado que vuelve a ejecutar el script Python
  legacy para comprobar o actualizar el fixture legacy Excel.
- **Modo compatible legacy**: modo de salida que replica el Excel original,
  incluso cuando requiere conservar decisiones tecnicas heredadas observables.
- **Modo canonico**: modo de salida que aplica reglas del dominio con decimal
  exacto y redondeo explicito.

## Oracle legacy producido por `Calculo_Salario_IRPF.py`

La ejecucion por defecto llama a `generar_excel_completo()` y escribe
`Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx` con estas hojas:

1. `CONTROL_GENERAL`
2. `CONTROL_TRAMOS_IRPF`
3. `COMPARATIVA_INFLACION`
4. `DAT_2012` ... `DAT_2026`

Existe un modo reducido mediante `IROBOPF_LEGACY_SOLO_COMPARATIVA=1`, que solo
genera `COMPARATIVA_INFLACION`.

### `CONTROL_GENERAL`

Rango: una fila por ano fiscal 2012-2026.

Columnas:

- `Año`
- `Base Máx. Anual`
- `SS Empleador %`
- `SS Empleado %`
- `MEI Empleador %`
- `MEI Empleado %`
- `Gastos Fijos Art.19`
- `Mín. Contribuyente`
- `Mín. Exento Retención`
- `Art.20 Umbral Inf`
- `Art.20 Red. Máxima`
- `Art.20 Umbral Sup`
- `Art.20 Red. Mínima`

Redondeos visibles: porcentajes SS a 2 decimales, MEI a 3 decimales. Para 2018,
los metadatos Art.20 son el texto `Transitorio`.

### `CONTROL_TRAMOS_IRPF`

Rango: tramos de IRPF para cada ano fiscal 2012-2026.

Columnas:

- `Año`
- `Nº Tramo`
- `Hasta Base`
- `Tipo %`

Redondeos visibles: `Tipo %` a 2 decimales. El ultimo tramo usa el texto
`En adelante`.

### `COMPARATIVA_INFLACION`

Rango: anos 2012-2026 y salarios equivalentes 2026 de 15.000 a 100.000 euros en
saltos de 1.000 euros. Son 15 * 86 = 1.290 filas de datos.

Columnas:

- `Año a Comparar`
- `Salario Equivalente (2026)`
- `Multiplicador IPC Acum.`
- `IPC Acumulado (%)`
- `Salario Bruto Nominal`
- `Coste Lab. (Euros 2026)`
- `SS Emp. (Euros 2026)`
- `SS Tra. (Euros 2026)`
- `IRPF (Euros 2026)`
- `Neto Real en su Año`
- `Neto Real en 2026`
- `Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)`
- `Pérdida/Ganancia Anual Poder Adq.`

Redondeos visibles: factor IPC a 4 decimales, IPC acumulado como texto con `%` y
2 decimales, importes monetarios a 2 decimales.

### `DAT_YYYY`

Rango: una hoja por ano fiscal 2012-2026. Cada hoja cubre salarios brutos de 0 a
100.000 euros en saltos de 1 euro, es decir, 100.001 filas de datos por ano.

Columnas comunes:

- `Salario Bruto`
- `Cot. Soc. Empresa`
- `Coste Laboral`
- `Cot. Soc. Trab.`
- `Ren. Previo`
- `Gastos Fijos`
- `Red. Ren. Trab.`
- `Base Imponible`
- cuotas por tramo `Tn (x.x%)`, con el numero de tramos propio del ano
- `Cuota Íntegra`
- `Cuota Mínimo Personal`
- `Cuota Teórica`
- `Deducción SMI`
- `Cuota tras SMI`
- `Límite 43% (Art 85.3)`
- `IRPF Final`
- `Salario Neto`

Columnas de tramos por periodo:

- 2012-2014: 7 tramos, `T1 (24.8%)` ... `T7 (52.0%)`.
- 2015: 5 tramos, `T1 (19.5%)` ... `T5 (46.0%)`.
- 2016-2020: 5 tramos, `T1 (19.0%)` ... `T5 (45.0%)`.
- 2021-2026: 6 tramos, `T1 (19.0%)` ... `T6 (47.0%)`.

Redondeos visibles: importes monetarios a 2 decimales, `Salario Bruto` entero,
`Gastos Fijos` entero. No hay formato Excel explicito mas alla de la escritura
por `pandas.to_excel`.

## Alcance actual del motor Effect

### Implementado

- Parametros fiscales/laborales 2012-2026 usados por la comparativa: bases
  maximas, tipos de seguridad social, MEI, solidaridad 2025-2026, minimo
  personal, minimo exento, gastos fijos, reduccion del trabajo, tramos IRPF y
  deduccion SMI.
- Calculo agregado de cotizacion empresarial, coste laboral, cotizacion del
  trabajador, IRPF final y salario neto anual.
- Comparacion ajustada por IPC contra ano de referencia, con importes reexpresados
  en euros de referencia.
- Barrido salarial configurable para la experiencia educativa.
- Exportacion compatible parcial de una sola hoja `COMPARATIVA_INFLACION`.
- Tests que comparan `COMPARATIVA_INFLACION` contra el fixture existente.

### Parcialmente implementado

- **Equivalencia tabular**: solo esta validada para `COMPARATIVA_INFLACION`, y
  ademas el rango lo construyen los tests llamando 15 veces al exportador de un
  ano/rango para reconstruir el rango legacy completo.
- **Motor detallado de calculo unitario**: internamente calcula muchos conceptos,
  pero la interfaz publica `DesgloseLiquidado` solo expone los agregados
  necesarios para comparativa, no las cuotas por tramo ni columnas `DAT_YYYY`.
- **Fixture legacy Excel**: el archivo versionado actual contiene solo
  `COMPARATIVA_INFLACION`, aunque el script por defecto genera el libro completo.

### No implementado

- Exportar `CONTROL_GENERAL`.
- Exportar `CONTROL_TRAMOS_IRPF`.
- Exportar `DAT_2012` ... `DAT_2026`.
- Exponer un contrato publico para filas `DAT_YYYY` con cuotas por tramo y todos
  los importes intermedios.
- Validar hoja por hoja la equivalencia tabular completa del libro legacy.
- Regenerar o versionar un fixture completo que contenga todas las hojas del
  oracle default.

### Pendiente de decisión técnica

- Si conviene mantener temporalmente un nombre interno como **Exportacion
  compatible de comparativa** para la capacidad parcial actual, sin cambiar el
  objetivo final de **Exportacion compatible** completa.
- Si el boton actual `XLSX compatible` debe ocultarse, marcarse como parcial o
  generar el libro completo cuando la migracion este terminada.
- Si el fixture rapido debe ser el libro completo o un fixture reducido dedicado a
  `COMPARATIVA_INFLACION`.
- Si el modo canonico debe ofrecer hojas educativas equivalentes a `DAT_YYYY` o si
  esas hojas pertenecen exclusivamente al modo compatible legacy.

## Brechas de implementación observadas

- `lib/export/auditoria-excel.ts` solo anade `COMPARATIVA_INFLACION` en
  `construirLibroAuditoriaCompatible`; faltan las demas hojas del libro legacy.
- `tests/auditoria-excel.test.ts` valida equivalencia tabular solo para
  `COMPARATIVA_INFLACION`; no existe una prueba de contrato para todas las hojas.
- El mensaje de regeneracion del test apunta a ejecutar el script legacy sin
  `IROBOPF_LEGACY_SOLO_COMPARATIVA=1`; esa ejecucion produciria el libro completo,
  pero el fixture versionado inspeccionado solo contiene `COMPARATIVA_INFLACION`.
- `README.md` describe que la descarga compatible actual contiene una hoja
  `COMPARATIVA_INFLACION`, pero debe quedar claro que eso es una implementacion
  parcial y no el alcance final de compatibilidad.

## Estrategia incremental con TDD

1. Fijar una prueba de contrato que compare los nombres de hojas esperados del
   libro legacy completo contra `construirLibroAuditoriaCompatible`. Debe fallar
   antes de implementar nuevas hojas.
2. Implementar `CONTROL_GENERAL` y `CONTROL_TRAMOS_IRPF` primero: son pequenas,
   deterministas y validan que los parametros legacy estan exportables.
3. Exponer un calculo unitario detallado publico para una fila `DAT_YYYY`, con
   cuotas por tramo. Validarlo para pocos salarios representativos antes de barrer
   100.001 filas.
4. Implementar una hoja `DAT_YYYY` de un ano piloto, preferiblemente 2026 por
   solidaridad y deduccion SMI, y despues generalizar al resto de anos.
5. Separar tests rapidos por hoja de una prueba pesada de regeneracion/fixture
   completo, para no convertir la suite diaria en una exportacion masiva.
