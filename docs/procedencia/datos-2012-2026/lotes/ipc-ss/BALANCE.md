# Balance por año y dominio

> Antecedente conservado. Los cinco defectos técnicos y el alcance vigente se
> documentan en la [corrección del 4 de noviembre](../../correcciones-cinco/INFORME.md).
> Las cifras y dictámenes de este documento corresponden al candidato anterior.

Estados candidatos, sin aceptación independiente. Las coincidencias de máximas son dimensionales (mensual × 12); las mínimas no son consumidas. Las cifras de tipos cuentan conceptos únicos por sujeto, incluido total, sin sumar versiones repetidas.

| Año | IPC | Máxima perfil | Tipos extraídos por sujeto | Mínimas: dimensiones / posiciones | Ambiguas |
|---|---|---|---:|---:|---:|
| 2012 | identidad | match | 10 | 11 / 11 | 0 |
| 2013 | coincide definitivo | match | 10 | 8 / 8 | 3 |
| 2014 | coincide definitivo | match | 10 | 11 / 11 | 0 |
| 2015 | coincide definitivo | match | 10 | 11 / 11 | 0 |
| 2016 | coincide definitivo | match | 10 | 11 / 11 | 0 |
| 2017 | coincide definitivo | match | 10 | 11 / 11 | 0 |
| 2018 | coincide definitivo | representation-only | 10 | 11 / 11 | 0 |
| 2019 | coincide definitivo | match | 10 | 11 / 22 | 0 |
| 2020 | coincide definitivo | match | 10 | 0 / 0 | 0 |
| 2021 | coincide definitivo | match | 10 | 11 / 11 | 0 |
| 2022 | coincide definitivo | match | 10 | 11 / 11 | 0 |
| 2023 | coincide definitivo | match | 13 | 11 / 33 | 0 |
| 2024 | coincide definitivo | match | 13 | 11 / 33 | 0 |
| 2025 | coincide definitivo | match | 22 | 11 / 11 | 0 |
| 2026 | escenario | match | 22 | 11 / 11 | 0 |

13 tasas IPC coincidentes; 14 máximas anualizadas coincidentes y una representación intranual separada (2018). 180 posiciones semánticas de tipos por año/concepto/sujeto, incluidas 10 remisiones explícitas de 2020; 8 componentes MEI coincidentes y 12 de solidaridad coincidentes con el motor. No diferencia vigente de parámetro demostrada. No parche financiero propuesto ni prueba roja inventada. 60 casos de base ordinaria: 59 igualdades exactas y una diferencia de representación inferior a 10⁻¹² EUR, sin interpretación como cuota ingresable.

Censo efectivo: 48 hojas, 9 metadatos, 1 escenario, 34 coincidencias, 1 representación, 1 hipótesis AT/EP, 2 ceros por sujeto. Además 265 ocurrencias AST dentro de símbolos del lote, con hash y posición: contenedores, reglas y auxiliares se conservan aparte; no son otras tantas magnitudes únicas. No equivale a recertificar las ocurrencias ajenas de la liquidación IRPF. Las remisiones v1 son antecedentes de otra base, no bindings actuales.

## Ausencias y límites concretos

No hay tabla de mínimas 2020 en las obligaciones adquiridas. La prórroga de 2019 no basta para fijarlas sin analizar el cambio del SMI: no se certifican 11 dimensiones de mínimas. La tabla 2021 empieza en septiembre: las 11 dimensiones de enero–agosto tampoco se certifican mediante ella. Se conserva la ley de 2021 para la máxima desde enero, pero el enlace de la tabla se mantiene desde septiembre. Para 2018 se conserva la máxima agosto–diciembre en la ley; el corpus tabular tiene enero–julio. La vigencia de mínimas del segundo tramo no se extiende silenciosamente. Estas ausencias no afectan a un parámetro mínimo consumido: ese perfil no lo incorpora.

Tres lecturas no inequívocas del original de 2013: mínimos diarios de grupos 9, 10 y 11, literal `25.10`. Otras 19 lecturas antes retenidas se normalizan con el parser común; no se corrige por similitud al motor. AT/EP 1,5% no es verificable universalmente sin actividad elegible. 2026 IPC diciembre no es observación publicada.

## Revisión y ejecución

13 tests públicos sintéticos correctos. Ruff y comprobación de tipos del lote correctos; suite completa local explícita con reextracción y replay byte a byte. No implica CI global ni cierre de redondeo CX-01/03. Declaraciones de unidades candidatas separadas, sin duplicar ni alterar el verificador central.
