# Medición nacional 2025

**76/80 objetivos cuadran al céntimo con evidencia vinculada.** Se han capturado
y comparado 32 perfiles salariales sin mínimos familiares, cuatro con
ascendientes, 18 con descendientes, siete viviendas con deducción transitoria
y ocho conjuntas matrimoniales, dos monoparentales y los alquileres murciano y valenciano.
Coinciden los 32 salarios, cuatro ascendientes, 18 familias, siete viviendas, diez conjuntas,
ambos alquileres, dos proyecciones de alquiler sin derecho en CLM y Cataluña
y la proyección de vivienda riojana descrita en `RIOJA-PROYECCION.md`.
Estas últimas conservan los hechos completos de vivienda y acreditan la equivalencia
fiscal con el transporte salarial bajo las guardas de `PROYECCION-INQUILINOS.md`;
no acreditan que la vivienda se haya introducido en Open.
Los otros cuatro objetivos siguen en N. El alcance de la proyección de hechos
sintéticos está descrito en `ASCENDIENTES.md`, `FAMILIAS.md`, `DT18.md`, `CONJUNTAS.md`
y `../../inquilinos-murcia-binding.md` y `../valencia-binding.md`.

`observaciones.json` contiene las entradas del manifiesto y las referencias
relativas a los documentos en `oficiales/`. `medicion.json` conserva la salida
del medidor, las huellas y las diferencias. Los documentos oficiales son
resultados de perfiles inventados introducidos en el simulador público; no son
declaraciones de personas reales. Los nombres de prueba y los NIF sintéticos
proceden de constantes del transporte, no de datos del usuario.

Los PDF se conservan byte a byte. Los SES se publican como `persistencia.txt`:
descompresión zlib y transcripción íntegra Latin1 → UTF8, reversible sin perder
caracteres. Así el sanitizador puede examinar todo el contenido. Cada referencia
conserva el SHA de la transcripción, del contenido Latin1 y del original
comprimido; el medidor verifica los dos primeros. En los vínculos que exigen
reconstrucción, incluido Rioja, verifica además que el compresor fijado reproduce
el tercer SHA byte a byte. En los demás, ese tercer SHA identifica la recepción
original conservada fuera del repositorio. Ningún SHA se presenta como firma de
la AEAT. No se omiten campos.

## Diferencias corregidas

| Caso | Open 0670 | Motor anterior | Motor actual |
| --- | ---: | ---: | ---: |
| open2025-illes-balears-02 | 1.011,01 EUR | 1.011,00 EUR | 1.011,01 EUR |
| open2025-andalucia-11 | 429,22 EUR | 429,23 EUR | 429,22 EUR |
| open2025-canarias-02 | 226,80 EUR | 226,79 EUR | 226,80 EUR |

Los cuatro gravámenes completos se cuantizan antes de restar mínimos, en los
perfiles observados y delimitados por `BALEARES-COMPONENTES.md` y
`FAMILIA-CUANTIZACION.md`. Se conservan los importes oficiales, las cotizaciones
efectivas y la validación de derechos. No se suma un céntimo al resultado ni se
usa tolerancia para contarlo como igual. No quedan discrepancias monetarias
observadas entre los 76 casos comparables; los pendientes no son coincidencias.
La cuantización por componentes corrige las tres diferencias matrimoniales
de Murcia y Aragón; conserva las otras cinco referencias matrimoniales.
Su frontera monetaria y la reserva sobre la etapa interna de Open se describen
en `../../implementaciones/conjunta-cuantizacion-2025/ALCANCE.md`.

El proxy es N/n de la tabla territorial AEAT 2024 citada en `MUESTRA.md`.
No estima cuántos contribuyentes tienen este perfil concreto. Los pendientes
no reciben un impacto monetario inventado: hacen falta sus capturas y una
salida del motor antes de calcular la diferencia.

Quedan cuatro arrendadores pendientes de comparación acreditada.
La restricción territorial de las tres entradas ordinarias de ascendientes se
ha ampliado sin modificar sus hechos. Las viviendas requieren completar su vinculación o
expediente; no se reemplazan por declaraciones individuales o salariales.

## Revisión del instrumento

La revisión independiente reprodujo tres defectos antes de publicar: el vínculo
aceptaba modalidad/titular alterados, aceptaba una etiqueta territorial con
códigos incompatibles y duplicaba pesos de entradas repetidas. Se conservaron
las reproducciones y se corrigieron los tres comportamientos. Los controles
propios ahora rechazan esas alteraciones y mantienen los originales válidos.

La comprobación exige las 76 vinculaciones SES/PDF, incluidas las proyecciones
fiscales justificadas y los predicados familiares identificados.
El verde técnico de esa comprobación no
equivale a cerrar los 80 objetivos ni el ejercicio completo.
