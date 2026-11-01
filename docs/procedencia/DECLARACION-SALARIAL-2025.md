# Cálculo anual salarial de Madrid 2025

**El cálculo interno está terminado y revisado para el perfil descrito aquí.** Recibe ingresos, gastos, cotizaciones y retenciones efectivas y calcula las bases, cuotas y el resultado a ingresar o devolver. Falta conectarlo con una interfaz preparada por Opus.

El perfil admite empleo laboral o estatutario, uno o varios pagadores, declaración individual de Madrid en 2025, edad de 18 a 64 años y residencia durante todo el ejercicio. Exige ausencia de otras rentas, familiares con derecho a mínimo, discapacidad, reducciones de base, saldos anteriores, rentas extranjeras y otras especialidades. Solo incluye la deducción del trabajo DA61 cuando corresponde. Los gastos deben cumplir los requisitos del contrato y los totales anuales deben estar conciliados, sin duplicados. Las entradas incompatibles conservan su rechazo explícito.

## Qué se ha comprobado

Siete casos sintéticos se ejecutaron en **Renta WEB Open 2025, versión 1.19**, conservando sus PDF y archivos de sesión. La comparación detectó tres diferencias de uno o dos céntimos y permitió corregir el orden del redondeo: artículo 20 antes de calcular la base, cada gravamen antes de restar el del mínimo y DA61 antes de descontarla. El cálculo corregido coincide con todas las casillas disponibles de esa muestra. [Originales y resultados](auditorias/redondeo-anual-rentaweb-open/INFORME.md).

La revisión independiente contrastó también los decimales consumidos entre etapas, las fronteras examinadas y la conservación del comportamiento de pensiones y actividad. No encontró nuevos defectos. Pasan las 280 pruebas seleccionadas y los tipos del alcance; en la integración pasan además el lint global y las 16 reglas anti-slop. Esto no equivale a un pase global de tipos, que conserva deuda previa. [Revisión y evidencias](revisiones/redondeo-salarial-open/INFORME.md).

Los ejemplos completos conservan **1.333,92 € a ingresar** y **321,18 € a devolver**. Son resultados de entradas sintéticas concretas, no estimaciones para cualquier salario.

## Límites y siguiente trabajo

La muestra acredita el comportamiento observado en Open; no prueba todos los casos posibles ni una política universal de redondeo. El empate positivo examinado coincide. No se aisló un empate negativo final y no se cambió la regla monetaria general. La Ley 46/1998, por sí sola, no determina estas etapas del cálculo anual.

Se utilizan cotizaciones y retenciones **efectivamente aportadas**. Este recorrido no calcula una liquidación mensual TGSS ni demuestra otros años, territorios, rentas o situaciones familiares. Las pruebas de pensión y actividad acreditan conservación respecto al código anterior, no una nueva comparación oficial de esos perfiles.

El rastro actual tiene sus propias fuentes e importes verificables. Los dictámenes históricos de los 65 sitios permanecen asociados a su código anterior; no se trasladan automáticamente al algoritmo corregido. El nuevo snapshot es candidato y no hereda sus atestaciones documentales. Las 19 familias, la composición y la admisión generales siguen fuera del trabajo cerrado aquí.

Para Opus: usar la entrada y los rechazos existentes, pedir los hechos exigidos y los importes efectivos, y distinguir saldo positivo —a ingresar—, negativo —a devolver— y cero. Las propiedades monetarias salariales ya contienen los redondeos intermedios; la interfaz no debe volver a calcular el impuesto. La [implementación](implementaciones/redondeo-salarial-open/INFORME.md) detalla el contrato y sus pruebas. No queda otra ronda de backend justificada por esta revisión favorable.

## Commits y respaldo

- `3af102ba`: demostración inicial del recorrido salarial.
- `7b514098`: revisión inicial y reserva sobre redondeo entre casillas.
- `b99c6842`: conservación de las siete ejecuciones de Open y del fallo reproducible.
- `f8f1e531`: corrección del redondeo y actualización del rastro.

El código y estas evidencias se respaldan únicamente en `origin/procedencia-documental`. La interfaz no se ha modificado ni desplegado. Los originales de estas pruebas se conservan junto al informe; los límites de los respaldos generales y de la copia desfasada de host-b siguen descritos en el [informe de auditoría](INFORME-FINAL.md#respaldo-y-conservación).
