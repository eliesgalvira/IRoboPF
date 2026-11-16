# Viabilidad de Open 2025

El recorrido automático de entrada, cálculo oficial, descarga SES/PDF y
comparación con la API real se completó el 16 de noviembre de 2026.
El piloto tiene un caso distinto y coincide al céntimo: **1/1**.
Las repeticiones técnicas del mismo perfil no aumentan ese denominador.

Perfil inventado: declaración individual, Madrid, edad 40, un empleo laboral,
30.000,00 EUR íntegros, 1.950,00 EUR de cotizaciones efectivas y 4.200,00 EUR de
retenciones. Sin otras rentas, familiares, discapacidad ni gastos adicionales.
Se reutilizó la plantilla sintética `componentes` del corte C300; los importes
se introdujeron mediante el formulario, sin editar el SES.

La lectura posterior del formulario y del SES verifica las entradas de trabajo
y las magnitudes de la deducción laboral. El PDF muestra 30.000,00 en 0003,
1.950,00 en 0013 y 4.200,00 en 0596. El resultado oficial de 0670 y el resultado
presentado por `liquidarIrpfAnualExplicito` son **398,02 EUR**. El PDF también
muestra 398,02 en 0610 y en el resumen de ingreso/devolución.

Huellas de originales conservados fuera del repositorio:

- SES: `21496a670e9302a778769266ae18d779dfb1c4d0cba5e7ffd35020fd9c5d5e27`.
- PDF: `033459cb9cc7ee6b456b4bdf9182b9272f3f930329656c948854b34cf167f467`.

El transporte reutiliza selectores de C300, escritura por teclado con pausas y
lectura posterior. Sólo opera una declaración cada vez. Las capturas fallidas
se conservan como intentos, nunca como resultados fiscales. La descarga del
PDF se hace desde el contexto del navegador para respetar sus redirecciones.

## Reutilización y cobertura pendiente

El C300 original aporta 300 declaraciones salariales de Madrid. El cotejo nuevo
del resultado presentado confirma **300/300**, con hashes de SES y PDF
verificados. Seis SES no expresan el resultado final; sus PDF sí presentan
explícitamente 0,00 en 0670: casos 190, 202, 214, 226, 238 y 241. Sólo en esos
seis casos el resultado se toma del PDF; no se convierten ausencias en cero.

La captura andaluza y las nueve variantes territoriales/familiares se conservan
como referencias adicionales, pendientes de revalidación conjunta. C300 no es
una muestra nacional ponderada. El piloto y esta regresión no sustituyen la
muestra nueva de vivienda, familia y comunidades, ni certifican el ejercicio
completo. Los contratos no admitidos permanecen visibles en su denominador.
