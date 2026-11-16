# Primera medición nacional 2025

**31/80 objetivos cuadran al céntimo con evidencia vinculada.** Se han capturado
y comparado los 32 perfiles salariales individuales sin mínimos familiares;
31 coinciden y uno difiere en un céntimo. Los otros 48 objetivos siguen en N.
El motor fiscal no cambia en este corte respecto de `1e80971c`.

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

El perfil balear tiene un salario de 45.000 EUR y cotizaciones efectivas de
2.925 EUR. La diferencia nace al cuantizar las cuotas, no al introducir las
cotizaciones. Queda abierta como diferencia menor; no se ha aplicado una
corrección arbitraria al resultado ni una tolerancia que la cuente como igual.
No hay otra diferencia monetaria en los 32 perfiles medidos.

El proxy es N/n de la tabla territorial AEAT 2024 citada en `MUESTRA.md`.
No estima cuántos contribuyentes tienen este perfil concreto. Los pendientes
no reciben un impacto monetario inventado: hacen falta sus capturas y una
salida del motor antes de calcular la diferencia.

Quedan 28 perfiles con hijos, cuatro con ascendientes y dieciséis de vivienda.
El primer piloto familiar coincide numéricamente, pero está fuera del contador
verificado hasta completar la correspondencia de los predicados familiares.
Tres entradas ordinarias de ascendientes encuentran una restricción territorial
del motor. Diez conjuntas y las viviendas requieren completar su conexión o
expediente; no se reemplazan por declaraciones individuales o salariales.

## Revisión del instrumento

La revisión independiente reprodujo tres defectos antes de publicar: el vínculo
aceptaba modalidad/titular alterados, aceptaba una etiqueta territorial con
códigos incompatibles y duplicaba pesos de entradas repetidas. Se conservaron
las reproducciones y se corrigieron los tres comportamientos. Los controles
propios ahora rechazan esas alteraciones y mantienen los originales válidos.

La comprobación de esta línea base exige las 32 vinculaciones SES/PDF y registra
explícitamente el céntimo pendiente. El verde técnico de esa comprobación no
equivale a cerrar los 80 objetivos ni el ejercicio completo.
