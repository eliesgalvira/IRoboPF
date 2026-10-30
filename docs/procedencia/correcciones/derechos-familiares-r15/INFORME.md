# Correcciones de derechos familiares después de la revisión independiente

MDV1-01/02/03 se reproducen y corrigen. La revisión original y sus rojos se conservan como evidencia del defecto anterior.

## Renta propia y alcance de la conciliación

El contrato anual compara ahora la renta propia declarada con la suma del neto laboral y las otras rentas no exentas que representa ese mismo perfil, antes del artículo 20, de la integración de bases y de compensar o truncar pérdidas. No compara con el bruto ni con la base liquidable. Para 30.000 de salario uniforme, la cuenta del perfil es 30.000 − 1.944 − 2.000 = 26.056; declarar cero o 30.000 como renta neta es contradictorio. Con pérdida de 20.000, conserva el saldo 6.056 aunque la base del ahorro se limite a cero.

La conexión exige una declaración explícita `conciliacionRentasContribuyente`, perfil `caso-anual-parcial`, sin rentas ni gastos fuera de su representación. Es optativa en el helper aislado de derechos y obligatoria en la liquidación. Esta declaración no prueba hechos externos. El perfil todavía usa cotización salarial uniforme, gasto laboral acotado, alquiler sin gastos representados y ganancias soportadas; no acredita la renta universal de un contribuyente con otras categorías, gastos, irregularidad o exenciones no modeladas. Esos hechos no pueden declararse conciliados con este perfil. No se modifica el cálculo anterior del rendimiento ni se atribuye a este control una certificación fiscal completa.

La renta declarada está en céntimos. Se compara con la representación HALF_UP del saldo del perfil y se exige además que ambos permanezcan en el mismo lado del límite de 8.000. Por ejemplo, 10.692,90 × 0,9352 − 2.000 = 8.000,00008 no puede declararse como 8.000 para cambiar la prioridad de grado: se rechaza. Esto fija la coherencia del contrato de entrada, no una regla universal de redondeo tributario. El rastro distingue conciliación interna de acreditación de hechos.

## Edad en la adopción

Se comparan fechas civiles completas después de validarlas. El nacimiento 31-12-2007 y evento 02-01-2025 corresponde a 17 años al evento, aunque al devengo tenga 18. La liquidación acepta ese caso y mantiene el incremento, con minoración de control 2.001,95. El cumpleaños dieciocho y fechas posteriores siguen fuera del alcance declarado para adopciones adultas.

El contraste de integración detectó además que la inscripción o el primer acogimiento que abre el incremento no determina la edad en la constitución del vínculo actual. El artículo 176 del Código Civil distingue la constitución judicial de la adopción. Se conserva un rojo adicional de datos insuficientes en `rojo-constitucion.log` y se exige `fechaConstitucionVinculo`, separada de `fechaInicioIncremento`. Una adopción constituida antes del cumpleaños e inscrita después conserva el incremento; un primer acogimiento anterior no permite atravesar la exclusión de una adopción ya adulta. No se reconstruye la fecha omitida. Esta precisión nueva de integración también debe ser contrarrevisada.

Se conserva un rechazo expreso para la frontera del 28 de febrero en el año del decimoctavo aniversario de un nacimiento bisiesto. No se ha cerrado aquí su interpretación civil específica; no se convierte una normalización de Date en criterio jurídico. Tampoco se amplía el contrato a ley personal extranjera, emancipación u otros supuestos no representados.

## Alimentos judiciales

La frontera anual rechaza al contribuyente pagador de alimentos judiciales sin custodia, incluso si marca falso el campo `aplicaEspecialidadAlimentos`. No conoce la cuantía ni puede resolver esa especialidad. No se inventa una cuota alternativa.

Un pagador distinto del contribuyente no bloquea la liquidación del custodio. Si sus hechos indican alimentos y ausencia de custodia, se conserva su exclusión del mínimo aunque declare que aplica la especialidad. Se rechazan flags incompatibles con los hechos. Los casos propios y ajenos se prueban separadamente; no se presume que una prestación alimenticia elimine el derecho del progenitor custodio.

## Evidencia y pruebas

El contraste de integración consultó los apartados oficiales AEAT 2025 de [requisitos](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/concepto-requisitos-descendientes.html) y [cuantías](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/cuantias-aplicables.html). La revisión conserva la ley y sus reformas. Para el día del cumpleaños se consultó y conservó el [Código Civil, artículo 240](https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763&p=20250103&tn=1#art240). `fuentes.json` fija cuatro originales HTML por SHA-256/SHA-512 y manifiesto saneado. No hay nuevas firmas, validación histórica ni atestación.

`rojo.log`: tres fallos reales antes de editar implementación. Los nuevos tests usan la renta 26.056 en los casos positivos; el revisor había usado 26.050 en su fábrica general, irrelevante para aquellos defectos antes de existir la conciliación. Sus originales no se corrigen. La fábrica del test previo del autor pasa de bruto 30.000 a neto 26.056: se corrige la entrada contradictoria, sin cambiar esperados monetarios ni fixtures legacy.

El primer pase posterior obtiene 111 correctos y dos fallos de un esperado propio de integración. La derivación correcta es (5.550 + 2.400) × 0,095 + (5.956,65 + 2.575,85) × 0,085 = 1.480,5125, presentada 1.480,51. Se corrige solo ese esperado nuevo; no era defecto de implementación. Los 15 tests nuevos pasan después, y las otras 98 pruebas ya habían pasado. Los recuentos entre pases se solapan. Se prueban rechazo por renta contradictoria, pérdida sin truncamiento, ganancia exclusiva del ahorro, límite con fracción de céntimo, declaración de conciliación ausente, aniversario, adopción menor/adulta y alimentos propios/ajenos.

Lint global, tipos principal/vendor y las 16 reglas anti-slop pasan; Effect guides y fuente local consultadas. La modificación final del texto de rastro se prueba de nuevo, con lint y tipos. La generación del inventario, contenido y recibos se conserva en los logs de esta carpeta. Las nuevas cifras siguen pendientes de revisión fiscal; una ruta calculable no equivale a una declaración completa.

El contrato de conciliación conserva el alcance parcial descrito. Las correcciones no promueven bindings ni aceptación fiscal completa.

## Regeneración final tras separar constitución e inscripción

La separación añade tres casos, con 18 regresiones nuevas y 28 pruebas previas de derechos: **46 correctas** en el pase final de contrato. Lint y tipos vuelven a pasar. Se conservan los recibos anteriores en `publicacion-intermedia/`; sus snapshots no se sobrescriben.

La regeneración final incorpora la separación de constitución e inscripción. Los contadores del inventario no acreditan reglas fiscales aceptadas.

La publicación conserva su carácter documental; Madrid mantiene atestación nula y aceptación fiscal completa falsa.

El pase final de rastro y publicación obtiene **13 pruebas correctas** contra estas identidades. No se repite build: los cambios del bloque afectan al contrato fiscal, tests y datos versionados; las rutas y la configuración de empaquetado no cambian. El build y la revisión técnica anterior mantienen su alcance histórico, no se anuncian como una ejecución del commit nuevo.
