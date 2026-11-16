# Medición nacional 2025

**51/80 objetivos cuadran al céntimo con evidencia vinculada.** Se han capturado
y comparado 32 perfiles salariales sin mínimos familiares, cuatro con
ascendientes y 18 con descendientes. Coinciden 31 salarios, tres ascendientes
y 17 familias. Los otros 26 objetivos siguen en N. El alcance de la proyección
de hechos sintéticos está descrito en `ASCENDIENTES.md` y `FAMILIAS.md`.

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
comprimido; el medidor verifica los dos primeros. El tercer SHA identifica la
recepción original, conservada fuera del repositorio: no se presenta como un
comprimido reconstruido ni como una firma de la AEAT. No se omiten campos.

## Registro de diferencias

| Caso | Open 0670 | Motor presentado | Motor − Open | Peso territorial proxy | Impacto absoluto × proxy |
| --- | ---: | ---: | ---: | ---: | ---: |
| open2025-illes-balears-02 | 1.011,01 EUR | 1.011,00 EUR | −0,01 EUR | 329.261 | 3.292,61 EUR |
| open2025-andalucia-11 | 429,22 EUR | 429,23 EUR | +0,01 EUR | 316.738,071428571429 | 3.167,38071428571429 EUR |
| open2025-canarias-02 | 226,80 EUR | 226,79 EUR | −0,01 EUR | 276.831,75 | 2.768,3175 EUR |

El perfil balear tiene un salario de 45.000 EUR y cotizaciones efectivas de
2.925 EUR. La diferencia nace al cuantizar las cuotas, no al introducir las
cotizaciones. Queda abierta como diferencia menor; no se ha aplicado una
corrección arbitraria al resultado ni una tolerancia que la cuente como igual.
Canarias añade otra diferencia menor de cuantización con un ascendiente.
Andalucía conserva una diferencia de un céntimo con descendiente. Las tres
diferencias permanecen abiertas y fuera del contador de coincidencias.

El proxy es N/n de la tabla territorial AEAT 2024 citada en `MUESTRA.md`.
No estima cuántos contribuyentes tienen este perfil concreto. Los pendientes
no reciben un impacto monetario inventado: hacen falta sus capturas y una
salida del motor antes de calcular la diferencia.

Quedan diez perfiles conjuntos con hijos y dieciséis de vivienda.
La restricción territorial de las tres entradas ordinarias de ascendientes se
ha ampliado sin modificar sus hechos. Diez conjuntas y las viviendas requieren completar su conexión o
expediente; no se reemplazan por declaraciones individuales o salariales.

## Revisión del instrumento

La revisión independiente reprodujo tres defectos antes de publicar: el vínculo
aceptaba modalidad/titular alterados, aceptaba una etiqueta territorial con
códigos incompatibles y duplicaba pesos de entradas repetidas. Se conservaron
las reproducciones y se corrigieron los tres comportamientos. Los controles
propios ahora rechazan esas alteraciones y mantienen los originales válidos.

La comprobación exige las 54 vinculaciones SES/PDF, incluidas las proyecciones
de predicados familiares identificados, y registra los tres céntimos pendientes.
El verde técnico de esa comprobación no
equivale a cerrar los 80 objetivos ni el ejercicio completo.
