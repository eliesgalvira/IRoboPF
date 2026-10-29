# Revisión independiente — cadena autonómica A

Revisión personal del 29/10/2026. **No aprobar la cadena completa para modificar automáticamente parámetros.** Hay decisión individual para los 33 IDs, matriz de 31 grupos y 180 enlaces anuales. Dos aceptaciones estrechas y 31 `needs-evidence`; ninguna aceptación global de escala o liquidación. Los estados anteriores se conservan. Las diez correcciones se han leído personalmente y su alcance limitado se registra por separado.

Se han cerrado las **39 localizaciones PDF pendientes**, con texto, página física, cajas y cotejo visual de sus ocho documentos. Esto cierra la localización, no la vigencia. Se comprobaron los hashes de los 144 documentos recibidos; no se deduce autenticidad de ellos. Se descargaron además originales HTML de LGT y LIRPF y el PDF regional canario de 2018 usando el helper, lock común y ritmo de descarga.

## Hallazgos accionables

**P2 — Cuotas fijas no representadas por la integración.** `lib/dominio/irpf/cuotas/escalas-gravamen.ts:48` suma áreas de tramos y no recibe cuota acumulada legal. Asturias 2015, Ley11/2014 art.39, PDF BOE-A-2015-1764 p.24: desde17.707,20 publica1.875,86 y14%. Para base17.707,21, la integración ejecutada da1.875,8654; cuota publicada más exceso da1.875,8614. La prueba propia falla: esperado1.875,86, recibido1.875,87 al redondear cada resultado a dos decimales. No es una transcripción de una ejecución ajena. No prueba que la deuda final difiera exactamente un céntimo: faltan mínimo, restantes cuotas y política final de redondeo. El orquestador debe fijar contrato de cuota acumulada y probar límites antes de corregir; no aplicar un redondeo por tramo como arreglo universal.

Reproducción ejecutada, un worker:

```sh
nix shell nixpkgs#bun -c bun test --max-concurrency 1 ./.cache/procedencia/revision-cadena-autonomica-a/cuota-fija.test.ts
```

**P1 potencial — Asturias 2025 sin selección por fallecimiento.** `lib/dominio/irpf/comunidades/comunidad-autonoma.ts:430` recibe solo comunidad; línea543 selecciona2025 sin trasladar fecha. Prueba propia con02/12,03/12 y31/12 devuelve siempre mínimo6105 y cuota900 para base10000. El original Ley3/2025, pp.2–6, permite confirmar tabla, componentes y entrada3/12/2025, pero el preámbulo sobre ejercicio2025 no acredita por sí solo retroactividad para personas fallecidas antes. Clasificación jurídica `needs-evidence`, no error fiscal ya certificado. Preparados los tres casos; el esperado anterior1000/5550 es una hipótesis que debe resolver revisión fiscal antes de convertirla en aserción normativa. LGT10.2 distingue tributos con período impositivo: usar solo fecha del devengo tampoco basta para zanjar la interpretación.

**P2 documental — Canarias 2019 conserva una cifra mal formada en ambos boletines.** BOE-A-2019-860 p.108 y BOC-A-2018-252-6087 p.137 imprimen `1.120.50`; se miraron ambos dibujos. La corrección BOE-A-2019-9323 no toca esa tabla. No convertir el literal a1120,50 por intuición. Tampoco eliminar las fronteras12450,01/17707,21. La nueva publicación regional cierra la hipótesis de un simple error de extracción o transcripción exclusivamente del BOE, pero no aporta una corrección normativa. El preámbulo regional menciona2018; la DF8 dispone expresamente efectos1/1/2019. Conservar esa contraprueba y no datar la tabla por el preámbulo.

**P2 — No perpetuar tablas sustituidas.** Canarias: DL1/2023 art.1.3 sustituye DA4.17 para2022–2023, con7894,39 desde55276; la tabla anterior de Ley7/2022 sin céntimos no es alternativa elegible. Andalucía: Ley5/2021 deroga TR2018 desde1/1/2022; DL7/2022 sustituye art.23 y fija efectos1/1/2022 para escala y mínimos. La transitoria2022 delDL1/2019 no sobrevive automáticamente. Estas sustituciones están identificadas; no se aceptan por ello todas las cuotas del motor.

## Decisiones acotadas y contrapruebas

- `CAA-AST-2013-RESTO`: accepted exclusivamente para16.592,80, publicado en Ley3/2012 art.42 p.32 y TR2/2014 art.2 p.7. La resta70000−53407,20 corrobora; no reemplaza estos originales.36.592,80 sí pertenece al tramo anterior de la escala2012 hasta90000: no trasladarlo a2013.
- `CAA-2026-MODELO`: accepted exclusivamente como ausencia técnica. Las seis consultas ejecutadas devuelven `ComunidadAutonomaNoSoportada`. Ninguna autoriza copiar2025. Ley canaria9/2025 está publicada en BOE3/4/2026 y suDF11 declara efectos1/1/2025 y vigencia indefinida. Eso acredita disposición y efectos declarados, no el cierre del ejercicio2026 ni ausencia universal de reformas posteriores.
- Las diez correcciones se revisaron completas: nueve no cambian estas escalas en su texto;5521 renumera18ter a18quater. No se certifica una búsqueda exhaustiva de toda corrección regional no indexada.
- Balears: Ley12/2015 DF16 adelanta a31/12/2015 los apartados1–9 deDF2 y dispone vigencia indefinida donde no haya límite expreso. No reducir2015 a una sola variante. Ley11/2023 art.1 amplía componentes de mínimos; DFúnica retrotrae únicamente otros artículos, noart.1. Código2023 sí tiene selector26/11. Sigue pendiente interpretación temporal completa y requisitos familiares; no se declara que todo mínimo sea un incremento uniforme10%.

## Matriz y evidencia entregada

`revisiones.json` conserva cada ID, estado previo, reclasificación, razón específica, alcance, objeciones y referencias. `matriz-aceptacion.json` contiene los180 enlaces con decisión y condición; es una matriz de bloqueo y selección de evidencia, **no una tabla de importes autorizada para integración automática**. `minimos-componentes.json` distingue contribuyente, descendientes, ascendientes, discapacidad y componentes pendientes. No se certifican rentas de familiares, prorrateos, convivencia, tutela/adopción ni reglas comunesLIRPF61.

`localizaciones-refinadas.json` contiene las39 filas. Resolución: Canarias2012 p.97; Cantabria2014 p.27; Asturias2015 p.24; Cantabria2015 p.26; TRasturiano2014 p.7; Balears2016 p.54; Cantabria2024 p.25; DLandaluz2012 p.3. Son cajas de línea que pueden incluir filas adyacentes, no cajas de celda inventadas. `citas-independientes.json` conserva además páginas contextuales completas: no todas las afirmaciones de una página quedan aceptadas. La tabla asturiana2012 tiene dos celdas iniciales vacías en el dibujo; la balear2010 sí tiene ceros. La tabla aragonesa2015 se lee enPDFp.9. Cantabria2016 dice«Hasta0euros»: no es una cifra ilegible. No se observaron tachados en las filas visualizadas.

`motor-actual.json`:168 fragmentos técnicos2012–2025, con hash histórico y actual.154 están literalmente presentes; los14 restantes corresponden a mínimos heredados mediante spreads y no a14 corrupciones. Se leyeron los módulos actuales2021–2024 y la base2025. No se modificó código ni VCS. La corrección madrileña y la explicación anual del padre no se reabren ni se confunden con esta revisión.

## Cobertura y límites pendientes

La cobertura de IDs y enlaces es completa como registro de decisiones. **La investigación jurídica solicitada no queda cerrada exhaustivamente**: faltan la búsqueda completa de reformas intermedias/persistencia hasta2026, la resolución especializada de fallecimientos y el cotejo ejecutable de cada cuota y componente. No se suplió ese trabajo con un `match` numérico. La mayoría de cadenas siguen `needs-evidence` por razones individuales, no aceptadas por conteo o por extracción automática.

No se validaron firmasPAdES/CSV, no se produjeron recortes facsimilares publicables de todos los originales, no se ejecutaron builds ni suites generales. Los renders de inspección quedan en scratch. La prueba de cuota es deliberadamente fallida y usa el motor actual sin modificarlo. Los casos temporales son sondeos ejecutados, no pruebas fallidas de una interpretación jurídica ya aceptada. El orquestador conserva la decisión y la edición de las correcciones.

## Índice de decisiones individuales

| ID | Territorio | Años | Decisión |
|---|---|---|---|
|CAA-CAD-001|andalucia|2012, 2013, 2014, 2015|needs-evidence|
|CAA-CAD-002|andalucia|2016, 2017, 2018|needs-evidence|
|CAA-CAD-003|andalucia|2019|needs-evidence|
|CAA-CAD-004|andalucia|2020|needs-evidence|
|CAA-CAD-005|andalucia|2021|needs-evidence|
|CAA-CAD-006|andalucia|2022, 2023, 2024, 2025, 2026|needs-evidence|
|CAA-CAD-007|aragon|2012, 2013, 2014|needs-evidence|
|CAA-CAD-008|aragon|2015|needs-evidence|
|CAA-CAD-009|aragon|2016, 2017, 2018, 2019, 2020, 2021|needs-evidence|
|CAA-CAD-010|aragon|2022|needs-evidence|
|CAA-CAD-011|aragon|2023, 2024, 2025, 2026|needs-evidence|
|CAA-CAD-012|asturias|2012|needs-evidence|
|CAA-CAD-013|asturias|2013, 2014|needs-evidence|
|CAA-CAD-014|asturias|2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024|needs-evidence|
|CAA-CAD-015|asturias|2025, 2026|needs-evidence|
|CAA-CAD-016|illes-balears|2012, 2013, 2014|needs-evidence|
|CAA-CAD-017|illes-balears|2015|needs-evidence|
|CAA-CAD-018|illes-balears|2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023|needs-evidence|
|CAA-CAD-019|illes-balears|2024, 2025, 2026|needs-evidence|
|CAA-CAD-020|canarias|2012, 2013, 2014|needs-evidence|
|CAA-CAD-021|canarias|2015, 2016, 2017, 2018|needs-evidence|
|CAA-CAD-022|canarias|2019|needs-evidence|
|CAA-CAD-023|canarias|2020, 2021|needs-evidence|
|CAA-CAD-024|canarias|2022, 2023|needs-evidence|
|CAA-CAD-025|canarias|2024|needs-evidence|
|CAA-CAD-026|canarias|2025, 2026|needs-evidence|
|CAA-CAD-027|cantabria|2012, 2013|needs-evidence|
|CAA-CAD-028|cantabria|2014|needs-evidence|
|CAA-CAD-029|cantabria|2015|needs-evidence|
|CAA-CAD-030|cantabria|2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023|needs-evidence|
|CAA-CAD-031|cantabria|2024, 2025, 2026|needs-evidence|
|CAA-AST-2013-RESTO|asturias|2013, 2014|accepted|
|CAA-2026-MODELO|canarias, asturias, illes-balears, cantabria, andalucia, aragon|2026|accepted|

La razón concreta, fuentes, objeciones y alcance de cada fila están en `revisiones.json`. Los casos realmente ejecutados y los solo propuestos están separados en `casos.json`.
