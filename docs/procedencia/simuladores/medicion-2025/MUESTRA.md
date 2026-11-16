# Manifiesto inicial sintético Open2025

Diseño de 80 casos. Los archivos
[casos.json](casos.json) y [estadistica.json](estadistica.json) fijan los slots,
las entradas disponibles, sus límites y las fuentes. El manifiesto no contiene
resultados esperados: las capturas y mediciones se conservan por separado.
El [piloto](PILOTO.md) documenta la comprobación inicial de automatización.

## Composición y denominador

| Grupo de diseño | Slots | Entrada API documentada | Pendientes de expediente o contrato |
| --- | ---: | ---: | ---: |
| Salario solo | 32 | 32 | 0 |
| Salario con hijos | 28 | 18 | 10 conjunta |
| Salario con ascendiente | 4 | 4 | 0 |
| Salario y vivienda DT18 | 8 | 0 | 8 |
| Salario y alquiler | 8 | 0 | 8 |
| Total | 80 | 54 | 26 |

Todos permanecen en **N = 80**, incluidos los pendientes. «Documentada» significa
entrada completa según la estructura leída, pendiente de comprobar su admisión
en ejecución; no equivale a aceptada por el motor. Los resultados y las métricas
de igualdad del manifiesto de diseño son `null`. Esos valores no son un
resultado de ejecución ni implican ochenta discrepancias.

Los IDs `open2025-<slug>-<slot>` son sintéticos, estables y no son NIF.
Los identificadores `s-1`, `s-2`, etc. son locales a cada caso. No se utilizan
personas, certificados, referencias catastrales o documentos reales.

La comprobación de unicidad detectó nueve entradas API idénticas bajo IDs
distintos. Se conserva cada original y su correspondencia en
`revisiones-diseno.json`, fuera del denominador vigente. Los nueve sustitutos
llevan sufijo `-v2` y salarios distintos; se sustituyen todos los duplicados,
independientemente de que su captura coincidiese. N sigue siendo 80. No se
heredan resultados oficiales del perfil anterior.

## Reutilización y coherencia

La estructura salarial procede de la entrada `componentes` de
`docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json`, la misma
que reutiliza `tools/procedencia/simuladores/c300.py`. Se conserva íntegra la
estructura de conciliación, trabajo, cotizaciones, gastos y retenciones. Las
adaptaciones de importes, edad y territorio son hechos sintéticos de diseño;
no heredan el resultado oficial de la semilla. El manifiesto conserva rutas
relativas y SHA-256 de las fuentes estructurales; esos hashes no acreditan una
captura Open de la entrada adaptada y no se presentan como tal.

Los brutos frecuentes son 16.000, 22.000, 30.000, 45.000 y 60.000 EUR, con un
pagador laboral y sin actividades. Las cotizaciones efectivas y las retenciones
son importes anuales sintéticos, no un cálculo de nómina ni un tipo legal de SS.
Los gastos sindicales, colegiales y de defensa de esta muestra son cero.
`open2025-madrid-01` conserva el piloto: 40 años, bruto 30.000 EUR, SS 1.950 EUR,
retenciones 4.200 EUR y sin familia.

Los descendientes reutilizan las entradas **corregidas** de
`tests/fixtures/c300-variantes.json`, nunca `originalEntrada`. Se conservan edad,
nacimiento, rentas cero de menores, declaraciones y demás titulares. Para el
titular asalariado se concilia la renta no exenta con bruto menos SS efectiva y
2.000 EUR de gastos generales. Los salarios familiares se limitan a 30.000,
45.000 y 60.000 EUR, sin reducción art. 20 en este diseño; no se introduce una
base o cuota esperada. Los ascendientes parten de la estructura de
`tests/ascendientes-h1.fixtures.ts`: un ascendiente sin rentas, vivo, de 70 o 77
años, un único titular residente y convivencia anual. Se copia exactamente la
economía laboral del titular y se eliminan las contradicciones deliberadas del
fixture adverso; no se reutiliza su expectativa de rechazo.

Antes de capturar familias se retiran del diseño frecuente las cinco fronteras
de hijo de 24 años con renta de 7.999,99 EUR: se conservan en
`discriminantes-sin-peso.json`, fuera de N. Sus slots pasan a menores de 16 años
sin rentas. No se cambia ningún esperado ni resultado observado de esos slots.

Diez objetivos de **conjunta** están dentro de los 28 casos con hijos: ocho
matrimoniales con cónyuge sin rentas y dos monoparentales. Es una decisión de
cobertura, no una proporción matrimonial estimada por la tabla. Los hechos
objetivo están separados de la referencia salarial individual. `CasoFiscalAnualExplicito` y
`DerechosMinimosAnuales` exigen `individual`: por ello `entradaAPI` es `null`.
La entrada individual conservada en `entradaTrabajoIndividualReferencia` es
referencia de hechos, no sustituto del objetivo. Faltan el contrato conjunto,
la agregación familiar y su tratamiento antes de generar una entrada ejecutable.
La cuota de diez es una decisión de cobertura; no se atribuye a una estadística
de conjunta cruzada con este perfil.

Ocho asalariados del grupo salario solo incluyen además el hecho contextual de
compra de vivienda habitual en 2018, sin DT18 ni deducciones de vivienda
solicitadas, sin alquiler y sin otras rentas. El hecho se conserva fuera de la
entrada API porque `solo-trabajo` no codifica adquisiciones. «Sin impacto
solicitado» describe el diseño; no es una conclusión calculada ni acredita
ausencia de todo posible incentivo territorial.

## Vivienda: investigación de contratos, sin forzar perfiles

Se leyeron `vivienda-dt18-2025/contrato.ts`, los fixtures DT18 de Rioja y Murcia,
`inmobiliario-2025/contrato.ts` y los fixtures de inmueble y alquiler/DT18 de
Balears, cuyas referencias exactas están en el manifiesto. Existen expedientes
DT18 especializados y una API inmobiliaria separada; su existencia no acredita
la entrada salarial territorial concreta de estos slots.

Los ocho objetivos DT18 describen adquisición habitual anterior a 2013 y pagos
sintéticos. Siguen pendientes la historia fiscal, aplicación previa, patrimonio,
financiación y movimientos conciliados con el salario, además de la admisión
territorial del expediente exacto. No se copia una solicitud de Rioja o Murcia
en otra comunidad ni se sustituye el expediente por una deducción elegida.

Los ocho alquileres incluyen cuatro asalariados arrendatarios y cuatro
asalariados arrendadores. El contrato `solo-inmobiliario-p4a` es exclusivo y
no representa por sí solo el caso mixto salario e inmueble. Faltan la conexión
y el expediente completo de ingresos, gastos, amortización, usos y titulares
para los arrendadores; en arrendatarios faltan contrato, pagos, censo y requisitos
territoriales. No se afirman deducciones por alquiler sin esos hechos. Las
referencias salariales conservadas no son entradas ejecutables de esos objetivos.

## Referencias estadísticas y pesos

La fuente territorial es AEAT, ejercicio 2024,
[Distribución por Comunidades Autónomas y provincias](https://sede.agenciatributaria.gob.es/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Estadisticas/Publicaciones/sites/irpf/2024/jrubik761f99dedc02a6bd64c84e572c313aa65a720d84.html).
`estadistica.json` conserva las quince cifras N, cuotas n y pesos racionales N/n.
Los slugs se cotejaron con `TerritorioMinimosComun` en
`lib/dominio/irpf/minimos/derechos-contrato.ts`: Balears es `illes-balears` y
Castilla y León es `castilla-y-leon`.

Los quince territorios suman 24.550.451 liquidaciones frente a 24.628.279 del
total común. El residuo de **77.828 queda sin representar**. No se asigna peso
a País Vasco o Navarra ni se reparte el residuo entre los slots. La suma exacta
de los pesos racionales de los 80 slots es 24.550.451. El medidor recibe una
aproximación a doce decimales, calculada con enteros y redondeo de mitades hacia
arriba; no se usa aritmética binaria para producir esos pesos. Las fracciones
N/n se conservan para reconstruir y auditar la aproximación.

`pesoExterno` es exclusivamente un **proxy territorial**, también en los casos
pendientes. No es incidencia conjunta por perfil, estimación de afectados,
probabilidad de selección ni expansión válida de discrepancias a contribuyentes.
La asignación es sintética y no aleatoria; no hay calibración por renta,
familia, modalidad o vivienda. Una futura suma ponderada seguirá siendo una
medida condicionada a estos casos, sin alcance poblacional.

Los márgenes de diseño usan
[Situación familiar](https://sede.agenciatributaria.gob.es/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Estadisticas/Publicaciones/sites/irpf/2024/jrubik7445cd382152d799d93b05a0ed97133b688f01c9.html):
8.678.327 declaraciones con hijos / 24.628.279, aproximadamente 28 de 80; y
[Deducciones por inversión en vivienda habitual](https://sede.agenciatributaria.gob.es/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Estadisticas/Publicaciones/sites/irpf/2024/jrubik647b3971e9c3445ada0d2d92ccffc73f5282a50d.html):
2.501.524 en la partida 547 / 24.628.279, aproximadamente 8 de 80 como proxy
marginal de vivienda. No se suman las partes estatal y autonómica ni se infiere
su intersección con salarios, familia o territorio. Son referencias 2024 para
un diseño 2025, no frecuencias 2025 observadas.

## Validación y entrega

El control del diseño comprueba los JSON, 80 IDs únicos, cuotas territoriales y de
grupo, diez conjuntas pendientes, dieciséis viviendas pendientes, rentas
familiares conciliadas, el piloto y los hashes de fuentes. La medición usa
`tools/procedencia/simuladores/medir-casos.mjs` con `--manifest casos.json`:
mantiene los 80 slots, rechaza entradas sustituidas y no suma entradas idénticas
como coincidencias adicionales. Sólo cuenta igualdad verificada cuando también
se vinculan los hechos de la entrada al SES y el resultado al PDF.

Los ejercicios 2012–2017, actividades, deducciones raras y redondeo de SS quedan
en la lista de raros **sin peso y fuera de N**, como cobertura futura separada.
No se formulan conclusiones globales de exactitud o cobertura fiscal.

No se publica en esta entrega. Antes de cualquier publicación corresponde
aplicar la política externa vigente conforme a
[PUBLICACION.md](../../privacidad/PUBLICACION.md), sin copiarla al repositorio,
y superar las comprobaciones de publicación y CI. La revisión estática de
estos tres textos no sustituye esa puerta ni autoriza publicar.
