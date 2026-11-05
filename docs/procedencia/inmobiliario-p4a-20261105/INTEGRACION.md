# Alquileres identificados de Canarias y Baleares · 2025

Las dos API anuales admiten el perfil `solo-inmobiliario-p4a` y delegan en un productor racional y la composición común de cuota. Conecta las ramas de adecuación canaria y sostenibilidad balear con los gastos, pagos e inmuebles que las originan. Se limita a renta inmobiliaria exclusiva, propiedad plena individual, alquiler permanente durante todo 2025 y los hechos adicionales del contrato. No cierra las deducciones autonómicas de 2025.

## Correcciones revisadas

La primera revisión detectó una elusión de la conciliación: cambiar el uso a vivienda propia permitía aplicar 1.164,51 EUR frente a los 500 EUR del caso conciliado. La corrección exige conciliación siempre que exista productor P4a. También incorpora la ubicación del inmueble, independiente de la residencia fiscal, y exige Illes Balears para esa deducción.

El contrato distingue operación, factura, pago y puesta en servicio de una mejora. No impone un orden entre esos cuatro hechos. Sólo representa operaciones, facturas y pagos íntegros de 2025; impagos, pagos parciales y cruces de ejercicio conservan rechazo. Una factura puede incluir varias líneas y varios inmuebles: la identidad es emisor, factura y línea; los metadatos deben concordar y la suma de partidas no puede exceder el total. El consumidor regional concilia la fecha de pago y el importe de la línea, sin repetir el total del documento.

La mejora utilizable en mayo conserva amortización 883350/365 EUR y deducción de 500 EUR aunque se facture en junio y se pague en julio. La factura con reparación de 600 EUR y servicios de 400 EUR conserva neto reducido de 4.300 EUR. No se han cambiado los importes esperados para acomodar los fallos.

## Fuentes y alcance

[FUENTES.json](FUENTES.json) fija siete fuentes oficiales por URL, versión y SHA256. Las peticiones BOE originales con `p=20251231` devolvieron versiones reales de 2026; se conservan como recepción, sin usarlas como prueba temporal. Se seleccionan LIRPF y RIRPF de 24/12/2025 y facturación de 06/12/2023, vigente durante 2025. Ocho artículos comparados conservan el texto normativo; el artículo 23 LIRPF cambia en 2026. La versión aplicable confirma el 50% ordinario y la remisión al 60% para contratos anteriores, sin cambiar las fórmulas del candidato.

Las clases de gasto declaran vinculación fiscal con el arrendamiento. `energia` y `agua` en la deducción balear son las inversiones tasadas, no cualquier reforma. Se concilian certificados, fianza y ausencia de repercusión. El motor no autentica documentos ni valida todos los plazos de expedición o las condiciones de una factura recapitulativa. Los hechos no representados no se convierten en impuestos cero.

## Controles

La [revisión inicial](REVISION-INICIAL.md) conserva los seis fallos reproducidos. El integrador pasa 925 pruebas en 36 archivos, con dos omisiones anteriores, tipos estrictos/Effect y linters. El [contraste de los defectos graves](CONTRASTE.md) reproduce los seis rojos y acepta el candidato acotado: 22 pruebas adaptadas, 50 adversos propios y 132 regresiones seleccionadas. Las suites se solapan; sus recuentos no se suman como casos distintos.

Los 50 adversos se trasladan a `tests/inmobiliario-p4a-contraste.test.ts`, con tipos concretos, comprobación síncrona del mismo Effect y sin logs de depuración. Los originales y su parche permanecen conservados. El texto de alcance de la salida se actualiza sin cambiar fórmulas. El traslado y los 31 pasos completos del workflow local pasan en entorno limpio, con inventario regenerado. Véase [CI del corte](CI.md). El CI remoto corresponde al push posterior.
