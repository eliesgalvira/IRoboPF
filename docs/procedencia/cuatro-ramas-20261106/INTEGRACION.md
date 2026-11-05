# Vivienda canaria, alquiler balear, libros gallegos y pagadores catalanes

El corte conecta cuatro productores por hechos con las API anuales existentes.
Conserva una sola composición de bases y cuotas, precisión y consumo común de
cuota. Los límites son de los perfiles implementados; no niegan el derecho legal
de todos los contribuyentes que quedan fuera. El punto 4 de deducciones continúa
abierto. [Contrato y límites de API](../API-MOTOR.md).

## Primeras revisiones y correcciones

- Canarias: 33 casos por ambas API, 192 vectores racionales y 486 regresiones.
  La primera revisión confirmó la aritmética admitida y detectó H1, que exigía
  pago el mismo día de compra, y H2, que perdía tres causas bancarias concretas.
  H1 admite ahora pagos posteriores dentro de 2025, conciliados con la escritura,
  el destinatario y el movimiento bancario. Anticipos y financiación siguen fuera
  del perfil. H2 conserva el motivo patrimonial sin admitir hechos contradictorios.
- Baleares: dictamen favorable acotado, 205 pruebas independientes, tipos y
  linters. Localización material, perceptor y todo el plan de solicitudes se
  concilian con el censo completo. No se deduce ausencia de derecho de inversión
  simplemente de no solicitarlo. Se conserva el resultado racional 529,9995 euros
  sin redondeo anticipado y los máximos aplicables al perfil revisado.
- Galicia: dictamen favorable acotado, 115 observaciones, no 115 tests Vitest.
  Los importes históricos y el reparto coinciden con los oráculos propios.
  Una pensión declarada debe concordar con la economía censada. Los no declarantes
  con trabajo positivo mantienen `Libros.imputaciones`: sus seis rechazos no se
  contabilizan como importes certificados. Las políticas monetarias de ambas API
  se comparan con sus propias cuotas basales, sin fingir igualdad entre ellas.
- Catalunya: 134 de 136 invocaciones propias conformes en el original; R1 produjo
  los dos rechazos indebidos por una referencia de certificado igual entre NIF
  distintos. El oráculo conserva líquida 3.123 euros y diferencial 2.923 euros.
  La corrección identifica cada certificado dentro de su NIF y conserva el uso
  único de rendimientos y retenciones. R2 se resuelve con los bloques históricos
  BOE realmente seleccionados, sin fechar todo el HTML por una URL solicitada.
  [Alcance y fuentes](../deducciones-2025/catalunya-pagadores-20261105/ALCANCE.md).

El integrador conservó las preimágenes y ejecutó primero las pruebas nuevas
contra el producto anterior: 12 fallos y 111 aciertos. Tras aplicar las
correcciones pasan las 123 pruebas de los dos archivos afectados y ambos
linters focales. No se modificaron los esperados monetarios para conseguir verde.
Las correcciones acotadas de cobertura y diagnóstico no encargan otra ronda de
contraste: se aplica la pauta de una primera revisión y pruebas del arreglo.
La evidencia anterior de autor, 1.479 pruebas en 36 archivos, permanece separada;
las suites solapadas no se suman como casos únicos.

## Publicación y recursos

Se añaden las seis suites nuevas al paso territorial del workflow. La publicación
exige los 31 comandos completos con PATH limpio, runtimes fijados y los mismos
`nix develop`, incluidos inventario y archivos generados actuales. Los resultados
locales y sus huellas se conservan en el manifiesto de integración; el CI remoto
se comprueba después del push y antes de retirar las entregas.

Cada orden tiene timeout y limpieza de hijos. Los controles pesados del corte
son secuenciales, con un worker y límites de memoria; las entregas contienen
parches y manifiestos y usan dependencias externas compartidas. Las reservas
fiscales y la autenticación documental no se convierten en ceros ni en aceptación
por pasar pruebas internas. Ascendientes, Aragón social y familiar extremeño
conservan una preparación posterior que no se atribuye a este corte.
