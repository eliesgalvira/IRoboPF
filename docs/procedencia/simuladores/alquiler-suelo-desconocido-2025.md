# Alquiler con coste del suelo desconocido, 2025

El contador de la muestra sigue en **76/80**. Las cuatro observaciones de este
documento son diagnósticos adicionales sin peso. No sustituyen los cuatro
objetivos de arrendadores con coste del suelo conocido ni acreditan una
equivalencia fiscal completa entre los hechos sintéticos y los originales de
Open.

## Contrato y dos cálculos separados

El productor inmobiliario admite el formato legado de coste conocido y un
discriminante `costeSuelo`. Los campos de ambos formatos no pueden mezclarse.
Con suelo desconocido calcula el coste de construcción como
`(precio + gastos) × construcción catastral / valor catastral total`, mediante
racionales. Conserva este libro en el resultado inmobiliario.

La ruta ordinaria acotada exige un propietario individual, trabajo de un solo
pagador, contrato iniciado en diciembre de 2024 y alquiler de vivienda durante
todo 2025; sólo admite reparaciones corrientes en este perfil. Comprueba una
cota histórica suficiente para que el límite acumulado de amortización no sea
vinculante. Esa cota depende de la historia declarada, puede rechazar otros
casos legalmente posibles y no inventa amortización previa igual a cero.

La API explícita, con cotizaciones efectivas y suelo desconocido, añade un libro
operativo separado para el perfil admitido en Asturias, Andalucía y Madrid:

1. Porcentaje catastral redondeado a dos decimales con HALF_UP.
2. Coste operativo obtenido con ese porcentaje, sin redondear el coste.
3. Amortización anual redondeada a dos decimales con HALF_UP.
4. Cada uno de los cuatro gravámenes —base y mínimo, estatal y autonómico—
   redondeado por separado antes de restarlos.

El rastro operativo usa las mismas bases, cuotas y retenciones que el resultado.
Los desgloses por tramos de la composición son anteriores a la cuantización:
HALF_UP2 de su suma coincide con el gravamen publicado. No se redondea cada
tramo para forzar una suma de importes ya presentados.
La composición vuelve a producir y conciliar los hechos: un indicador aislado
no habilita esta política. La API canónica, que estima cotizaciones, y los
hechos de suelo conocido conservan su ruta anterior.

La reducción del 50 % que deja fracciones de céntimo queda rechazada en esta
ruta operativa. Las observaciones no identifican cómo resolver esa frontera.
Tampoco identifican de forma única el algoritmo interno de la AEAT.

## Observaciones adicionales

Para precio 100.000, construcción catastral 50.000 y suelo catastral 10.000,
el libro racional produce amortización 2.500; Open muestra porcentaje 83,33 %
y amortización 2.499,90. La política conserva ambos cálculos diferenciados.

| Perfil diagnóstico | Bruto | Cotización efectiva | Retención | Diferencial observado |
|---|---:|---:|---:|---:|
| Asturias | 30.000 | 1.950 | 4.200 | 1.865,42 |
| Andalucía | 30.000 | 1.950 | 4.200 | 1.937,47 |
| Madrid, primero | 30.000 | 1.950 | 4.200 | 1.579,53 |
| Madrid, segundo | 32.000 | 2.080 | 4.480 | 1.819,39 |

Dos discriminantes separan órdenes de operaciones: con construcción 50.001 y
total catastral 60.000, Open muestra 83,34 % y amortización 2.500,20; con precio
100.000,20 y proporción 50.000/60.000 muestra 2.499,90, frente a 2.499,91 si se
redondeara también el coste intermedio. En Madrid, redondear sólo después de
restar los gravámenes daría un céntimo más que los resultados observados.

Los SES/PDF y sus lecturas de formulario se conservan como evidencia de esas
observaciones. Sus huellas están en
`tests/fixtures/suelo-desconocido-2025.diagnostico.json`. Las pruebas de producto
no sustituyen la vinculación de los originales y no activan la puerta del
medidor principal.

## Reserva de hechos no representados

Los originales de 2025 no acreditan el valor catastral de 2024, toda la historia
de usos anterior, el desconocimiento efectivo del coste del suelo ni todas las
condiciones del domicilio declarado. Esos hechos pertenecen al escenario
sintético. Un sello de integridad no demuestra que Open los haya recibido.

Existe una historia catastral alternativa, compatible con las lecturas de
2025, que podría hacer vinculante el límite acumulado. El motor la rechaza si
se entrega como entrada; los originales no permiten excluirla por sí solos.
Por ello la coincidencia numérica es condicionada, sin incremento del contador
y sin certificación general del perfil.

## Fuentes y comprobaciones

La separación del suelo y el límite proceden del [artículo 14 del Reglamento
del IRPF](https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820&p=20251224&tn=1#a14)
y del [manual práctico de Renta 2025 sobre
amortización](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c04-rendimientos-capital-inmobiliario/gastos-deducibles/cantidades-destinadas-amortizacion.html).
La política de cuantización se apoya en las observaciones del simulador, no se
atribuye a esos textos normativos. Fuentes fijadas por SHA y localizador en
`tests/fixtures/suelo-desconocido-2025.fuentes.json`.

Las pruebas `trabajo-alquiler-suelo-desconocido-2025.test.ts` comprueban el
productor racional y su admisión; `trabajo-alquiler-politica-open-2025.test.ts`
comprueba los resultados operativos, los rastros, los discriminantes y los
rechazos por contradicción. Se conservan las regresiones de suelo conocido,
incluido el segundo perfil madrileño con su salario propio.

La revisión independiente de lectura no identificó un bloqueo de cálculo nuevo.
Sus pruebas `trabajo-alquiler-revision240.test.ts` comprueban igualdad de hechos
por contenido, alteraciones de documentos y magnitudes, y la relación entre
desgloses y gravámenes. La reserva de historia no representada permanece abierta.
