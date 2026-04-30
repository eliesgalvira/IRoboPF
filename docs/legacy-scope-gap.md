# Alcance legacy del motor Effect

Revisión: 2026-04-25.

## Decisión de producto

El lenguaje de dominio define **Exportacion compatible** como una salida que replica
el Excel original y define **Equivalencia tabular** como igualdad de cada hoja,
columna, fila y celda de datos. Esa es la decisión de producto: la compatibilidad
legacy debe replicar el libro Excel original completo generado por
`Calculo_Salario_IRPF.py`.

La brecha funcional detectada se cerró en el exportador Effect: la exportación
compatible genera las hojas de control, la comparativa de inflación y las hojas
anuales `DAT_2012` ... `DAT_2026`.

La validación pesada con fixture completo ya existe y compara todas las hojas y
filas contra el oracle Python. Se ejecuta con `bun run test:legacy-completo`. La
suite rápida valida la comparativa contra el fixture versionado en streaming,
cubre estructura, controles y detalle anual con rangos acotados, e incluye una
validación de equivalencia tabular completa contra un fixture canónico del
contrato legacy. El fixture versiona hashes exactos por hoja generados desde las
tablas Effect para evitar leer el `.xlsx` completo en cada ejecución normal.

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
saltos de 1.000 euros. Son 15 \* 86 = 1.290 filas de datos.

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
- Exportacion compatible completa con `CONTROL_GENERAL`,
  `CONTROL_TRAMOS_IRPF`, `COMPARATIVA_INFLACION` y `DAT_2012` ... `DAT_2026`.
- Tests que comparan `COMPARATIVA_INFLACION` contra el fixture existente.
- Tests de contrato para estructura de hojas, hojas de control y columnas/filas
  `DAT_YYYY` con un rango acotado.

### Validación implementada

- **Equivalencia tabular exhaustiva**: `tests/auditoria-excel-pesada.test.ts`
  compara el fixture completo contra las tablas Effect en streaming.
- **Equivalencia tabular canónica**: `tests/auditoria-fixture-canonico.test.ts`
  compara las tablas Effect contra `tests/fixtures/canonical-tabular-hashes.json`,
  generado desde las tablas Effect con `bun run fixture:canonico-tabular`.
- **Fixture Excel legacy completo**: el archivo local sin versionar contiene las
  hojas de control, `COMPARATIVA_INFLACION` y `DAT_2012` ... `DAT_2026`.

### No implementado

- Ejecutar `bun run test:legacy-completo` en CI, si el coste de tiempo y memoria
  es aceptable para la pipeline.

### Pendiente de decisión técnica

- Si el fixture rapido debe ser el libro completo o un fixture reducido dedicado a
  `COMPARATIVA_INFLACION`.
- Si el modo canonico debe ofrecer hojas educativas equivalentes a `DAT_YYYY` o si
  esas hojas pertenecen exclusivamente al modo compatible legacy.

## Brecha de implementación corregida

- `lib/export/auditoria-excel.ts` ahora construye el libro compatible completo.
- La generación tabular legacy vive en
  `lib/dominio/compatibilidad-legacy/progresividad-frio.ts` para mantener el
  contrato histórico y dejar ExcelJS como adaptador de salida.
- `tests/auditoria-excel.test.ts` ya no reconstruye la comparativa llamando al
  exportador parcial 15 veces; usa el libro compatible y valida su
  `COMPARATIVA_INFLACION` contra el fixture.
- La prueba rápida usa opciones de rango para acotar `DAT_YYYY`; la exportación
  por defecto conserva el rango legacy completo de 0 a 100.000 euros en pasos de
  1 euro.

## Siguiente estrategia con TDD

1. Decidir si `bun run test:legacy-completo` entra en CI o queda como verificacion
   manual antes de releases.
2. Si entra en CI, asignarle un job separado con timeout amplio.
3. Si no entra en CI, documentar en el checklist de release que debe ejecutarse
   tras regenerar el fixture legacy.
