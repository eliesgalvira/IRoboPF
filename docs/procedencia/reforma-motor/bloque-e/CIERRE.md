# Cierre técnico del motor anual y su API

4 de noviembre de 2026. Las entradas anuales técnica y efectiva usan
`componerLiquidacionAnual` para seleccionar parámetros, calcular mínimos y
derechos, gravámenes, ahorro, límite autonómico, cuota y DA61 cuando procede.
Los adaptadores preparan rendimientos y bases y proyectan la salida; no
conservan otra fórmula de cuota. La resta de retenciones y pagos se comparte
en `liquidarPagosAnuales`.

La [API del motor](../../API-MOTOR.md) es el contrato para el rediseño. Incluye
unidades, signos, discriminantes, errores recuperables, alcance y
[ejemplos ejecutables](ejemplos.ts). Las cotizaciones efectivas y estimadas
siguen siendo hechos distintos. Se conservan las políticas monetarias de
cada productor y las siete referencias de Renta WEB Open sin cambiar sus
expectativas de importe.

## Revisión y validación

La [primera revisión](REVISION.md) confirmó la composición común y encontró
E-REV-01: el constructor local de 80 cifras no llegaba a todas las operaciones
de los gravámenes. El rojo se reprodujo; se corrigió propagando el constructor
por escalas, ahorro y reparto familiar, sin mutar Decimal global. La prueba
original y sus aserciones permanecen intactas. El [contraste independiente](CONTRASTE-PRECISION.md)
aprueba la corrección y no identifica otro bloqueo en ese alcance.

- CI completo local: **582 pruebas Vitest y 167 Python correctas**, incluidos
  inventarios, procedencia y el bloque de unidades/enlaces e IPC/SS. Tipos y
  lint pasan; se mantienen 18 avisos existentes.
- Contraste independiente: **227 pruebas recibidas y cuatro nuevas correctas**;
  tipos y lint correctos. La integración vuelve a ejecutar las cuatro nuevas
  y las incorpora al workflow y al script local. El conjunto enumerado pasa
  así a **586 pruebas Vitest**.
- Se conserva el contraste aritmético de 196 pares IPC y cinco bases de 2018.
  El corpus CAS histórico completo sigue omitido explícitamente en CI; estos
  resultados no lo acreditan.

Los informes distinguen la recepción inicial, la corrección y el contraste.
Los parches y manifiestos compactos conservan sus hashes por versión. Los
cambios del integrador posteriores al contraste se limitan a integrar su test
en CI y a actualizar documentación, sin modificar código de cálculo.
Cada ejecución usa timeout; las suites pesadas se coordinan con un máximo de
dos en toda la máquina y un trabajador por suite Vitest.

## Límites del hito

Este cierre entrega el motor común y su API. La cobertura familiar sigue
limitada a Madrid 2025 individual y rechaza los ámbitos sin soporte. La
ampliación por ejercicio y territorio requiere los datos y condiciones
documentales de A/E. Tampoco se cierran el redondeo mensual TGSS de D, los
productores y la declaración completa de F ni las puertas fiscales.

Las referencias anteriores permanecen como históricas, con hashes y enlaces
conservados dentro de motivos pendientes. Los pines e inventarios actuales
identifican el código nuevo; no le atribuyen los certificados del algoritmo
anterior. La revisión técnica y las referencias Open no sustituyen la
acreditación normativa de cada regla. El [balance A–F](../../BALANCE-A-F.md)
expresa el trabajo restante.
