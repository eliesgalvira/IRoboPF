# Madrid artículo 14 y compatibilidad acotada de Open 2019

Base: `92fac180b33ddde586fd0a4af97aa92bca12a8e6`, publicada con los dos trabajos del [CI remoto](https://github.com/eliesgalvira/IRoboPF/actions/runs/42157768216) correctos. Este corte conserva sus conexiones de Murcia, Madrid y Andalucía.

## Madrid 2025: donativos y dos descendientes

Las dos API admiten el artículo 14 madrileño con el censo de donativos existente. El cálculo utiliza la cuota autonómica restante después de los donativos generales efectivamente aplicados a esa parte y de las deducciones regionales anteriores. La deducción del artículo 14 consume después el 10 % de ese residual, una sola vez. Las mitades estatal y autonómica mantienen sus límites independientes; no se traslada un sobrante entre ellas.

Se concilian ejercicio, contribuyente, origen y conservación del libro de cuota. No se introducen bases o cuotas fiscales externas. El contrato conserva las restricciones de economía familiar, de las clases de donativo y de las demás concurrencias. Los controles internos de familia numerosa e inversión extranjera no habilitan esas combinaciones en la API pública. [Regla del artículo 14 en la guía AEAT 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/10-cumplimentacion-irpf-deducciones-autonomicas/10_12-comunidad-madrid/10_12_7-familias-dos-descendientes-ingresos-reducidos.html).

La revisión independiente verifica 191 pruebas propias y 300 regresiones recibidas, con límites familiares y agotamiento asimétrico de cuota. Son ejecuciones sintéticas, no capturas Open. El original de la [Ley 26/2014](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2014-12327), sus efectos temporales y el [manual AEAT 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c16-deducciones-generales-cuota/introduccion/deducciones-generales-autonomicas-aplicables.html) fundamentan el reparto de los donativos entre ambas cuotas. No se atribuye vigencia histórica por el mero parámetro de fecha de un consolidado.

La revisión detectó R1: el rastro explícito decía «sin otras deducciones» pese a restar el artículo 14. El fallo también existía en la base sin donativos. El integrador conserva las reproducciones y corrige la fórmula y el resumen explicativos. Las dos nuevas pruebas mantienen la cuota legal de 2.446,398 euros y la deducción de 118,492 euros; fallan antes del cambio y pasan después.

El primer oráculo del autor, sustituido con causa documentada, permanece en el respaldo privado. La prueba publicada importa únicamente `madrid-art14-tabla-oficial.json`, calculado desde las cuotas fijas legales. No se cambia ningún esperado final para acomodarlo al motor.

## Madrid 2019: etapas observadas en la API explícita

El cotejo anterior de 60 entradas conserva 17 diferencias en cinco casos. Cuatro capturas discriminantes separadas permiten preparar y revisar una política operativa que reproduce las casillas acreditadas de esos originales. La revisión ejecuta el control de 60 y las cuatro observaciones adicionales: 64 identidades diferentes, porque los cinco originales ya pertenecen al control. No se suman las repeticiones como nuevos casos.

La reducción del artículo 20 se cuantiza a céntimos antes de propagar la base. El recorrido estatal utiliza operaciones binary64, su representación decimal corta y HALF_UP por gravamen; Madrid conserva la escala publicada y operaciones Decimal sobre la base resultante. El núcleo sigue conteniendo una sola fórmula por cálculo. [Diagnóstico causal y alternativas discriminadas](../simuladores/historico/CAUSA-DISCRIMINANTES-2019.txt).

Alcance: API explícita, Madrid 2019, declaración individual, edad 34, un rendimiento laboral, cotizaciones efectivas de 1.000 euros y gastos a–e de 1.000 euros, junto con los negativos declarados y guardas numéricas del contrato. La cota técnica de un millón de euros no acredita oficialmente todo ese intervalo. Otras edades, territorios, años, gastos, agregaciones y la API canónica conservan su selección previa. La evidencia no identifica de forma única el algoritmo interno de AEAT ni convierte la política observada en una regla fiscal universal.

Los 64 casos del control y los discriminantes pasan en el candidato revisado; se conservan nueve ausencias y 120 reservas del control de 60. Las casillas 0023 y 0414 siguen sin promoverse a mapeos acreditados. No hay tolerancia de céntimo ni sustitución de ausencias por cero. La campaña mantiene 1.027 capturas; las cuatro observaciones adicionales tienen identidad separada. El resultado anterior de comparación permanece intacto, sin sobrescribir sus cifras con resultados de pruebas.

La revisión detectó 2019-EXP-01: el resumen afirmaba conservar la precisión histórica del artículo 20. El integrador añade una explicación específica de 2019, coherente con la base propagada. Las nueve pruebas de originales conservan sus importes PDF/SES y comprueban también esa explicación.

## Verificación e integración

Las dos revisiones no identificaron un defecto monetario en los perfiles ensayados. Sus objeciones explicativas están corregidas por el integrador. Pasan 111 pruebas focales en siete archivos, incluidas las dos reproducciones de R1, originales y guardas de 2019 y regresiones de 2018 y familia/donativos. Los supervisores acreditan cero procesos supervivientes y ninguna guardia de recursos activada.

Las tres suites nuevas se incorporan a los comandos existentes del workflow. Antes de publicar se regeneran los artefactos y se reproducen sus 31 comandos con las versiones fijadas, el entorno Nix indicado y PATH limpio. La evidencia de ejecución y las huellas quedan en `EVIDENCIA.json` y, tras completar la comprobación, en `VALIDACION.json`. La comprobación remota corresponde al push posterior.

El punto 4 sigue abierto. El corte posterior de Valencia, Murcia y continuidad madrileña se incorpora a esta misma publicación tras sus primeras revisiones. Su [evidencia separada](../corte-valencia-murcia81-20261106/INTEGRACION.md) no se atribuye retrospectivamente a este corte. No se habilitan puertas de aceptación fiscal.

El corte conjunto supera los 31 comandos locales exactos, con inventario y generados actuales. Publicación y CI remoto son posteriores a esta comprobación.
