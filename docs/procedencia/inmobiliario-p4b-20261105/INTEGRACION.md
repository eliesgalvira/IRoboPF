# Primer alquiler de Canarias y Baleares en 2025

P4b extiende el productor inmobiliario común cuando se aporta `primerAlquiler2025`. Las dos entradas anuales consumen el mismo cálculo: rendimiento neto reducido e imputación por los días a disposición, seguidos de la composición común de cuotas. Conecta la puesta de vivienda en el mercado canario y otros gastos del arrendador balear dentro del [contrato acotado](CONTRATO-API.md).

El perfil exige una vivienda de adquisición onerosa en 2025, titular pleno único y primer alquiler absoluto, con historia documentada desde la construcción, historia personal y censo mundial. Los datos fiscales se derivan de esos hechos. La permanencia futura sigue condicionada; no se declara ya cumplida ni se calcula un reintegro futuro. Las demás exclusiones del contrato permanecen rechazadas con motivo.

La [primera revisión independiente](REVISION.md) no demostró un error fiscal para hechos coherentes, pero dejó una ambigüedad temporal de mejoras. P4b concreta ahora que su `fechaOperacion` identifica la terminación o entrega efectiva de la mejora. Se rechaza un servicio anterior a ese hito, sin inferir fechas desde factura o pago. Es una condición del perfil representado, no una regla fiscal universal sobre el orden de esos documentos. La fórmula de amortización y P4a sin primer alquiler permanecen iguales.

Se conservan los dos rojos exploratorios de cronología y su sensibilidad monetaria. Las pruebas actuales comprueban el rechazo y el positivo con servicio igual a operación y factura posterior. La expectativa roja del revisor para gasto balear de 4.000 EUR confundía deducción teórica de 1.500 EUR con su aplicación limitada por cuota; la prueba actual mantiene renta y gasto y comprueba ese límite. El original queda preservado, sin atribuirlo al producto.

Validación del integrador: 80 focales y 492 pruebas recogidas aprobadas en el conjunto de regresión; las 80 están incluidas en las 492. Tipos estrictos con diagnósticos Effect y ambos linters pasan. Dos suites antiguas, r43 y r45, no recogen pruebas por `Global sin frontera: calcularDesgloseCotizacionesSocialesLegacy`, reproducido también en raíz sin el candidato. La regresión conserva salida 1; no se presenta como aprobación de esas suites. Los controles completos del workflow se ejecutan en la integración conjunta antes de publicar.

Los 42 tests del autor conservan sus esperados. Las 38 pruebas derivadas de la revisión mantienen sus hechos y oráculos coherentes, con las adjudicaciones anteriores documentadas. No se suman repeticiones ni canarios. Ninguna prueba sintética añade comparaciones contra Open.

Las [fuentes revisadas](FUENTES-REVISADAS.json) conservan URLs, versiones, localizadores y hashes de doce originales. Se corrige el ancla balear de art. 4 quater a `a4-13` en el HTML consultado. Los originales permanecen en CAS externo; referencias e identificadores aportados no autentican por sí solos los documentos del contribuyente.
