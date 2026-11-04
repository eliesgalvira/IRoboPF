# Conexión anual valenciana por hechos · 2025

La entrada técnica `CasoFiscalAnual` admite `contribuyenteId` y
`deduccionesValencianas2025: SolicitudDeduccionesValencianasAnual2025`.
La entrada efectiva conserva sus contratos de empleo/pensión/EDS y admite esos
mismos campos, con `deducciones: "valencianas-por-hechos-y-da61"`.
Si hay arrastres de deducciones, la entrada efectiva declara
`saldosAnteriores: "solo-deducciones-valencianas"`; sin ellos conserva `"ninguno"`.
Esto no habilita compensaciones de bases anteriores.
El discriminante anterior sigue vigente sin solicitud. Histórico 2018–2024
conserva su contrato sin deducciones; no se habilitan 2026 ni modalidad conjunta.

El esquema de solicitud se exporta desde
`lib/dominio/irpf/deducciones/valenciana-2025/anual.ts`. Contiene ejercicio,
territorio, modalidad, devengo, contribuyente, cantidades, solicitudes y
referencias del contrato de composición, ordenBase30, consignaciones, arrastres,
ordenConsumo y criterioOrden `eleccion_experta`. No recibe bases ni cuota, ni
resultados evaluados. Se exige inventario de consignaciones vacío: la conexión
no combina importes externos con hechos, aunque los códigos sean diferentes.
En la entrada técnica tampoco se admite agregado externo, incluso explícito cero,
ni deducciones antiguas identificadas por código junto a la solicitud.

Las dos entradas consumen `componerLiquidacionAnual`. Después de gravar las bases
y minorar mínimos general/ahorro, el núcleo obtiene una cuota autonómica
disponible. Pasa una sola cuota a `aplicarCuotaAnualValenciana2025`, que
reevalúa, compone bases compartidas e incompatibilidades y consume saldos según
orden experto. Su importe aplicado se resta una sola vez en la etapa de
cuota líquida. DA61 conserva su posición posterior en la entrada efectiva;
retenciones y pagos se descuentan en su única etapa final existente.

El aplicador aislado conserva su contrato de cuota externa a céntimos. La ruta
anual comparte el mismo algoritmo de composición, prioridad y consumo, pero recibe
la cuota decimal exacta serializada. Los importes monetarios de sus movimientos,
`totalAplicado`, `cuotaRestante` y `composicion.cuotaSinAplicar.disponible` se devuelven
como textos decimales EUR; no son números binarios ni céntimos presentados.
Una cuota de 20,079 con deducción suficiente se consume íntegramente: aplicado,
remanentes, pérdidas y caducidades concilian exactamente con cada saldo. La
cuantización de la salida anual sigue su política existente, sin una nueva regla
territorial para Valencia. Las bases son las reales del núcleo, sin redondearlas
para elegibilidad. Si una base negativa o de precisión superior no puede pasar
sin pérdida al contrato numérico existente, se rechaza expresamente ese caso.
No se reemplaza la base por cero ni por la declarada externamente.

Se concilian identidad con contribuyenteId y derechosMinimos cuando existen,
territorio, ejercicio, modalidad y devengo ordinario; edad/discapacidad propia
representadas en las unidades no pueden contradecir el caso. El sujeto se resuelve
por la referencia de la unidad, que puede identificar un gasto. Edad y grado
exigen un único sujeto conciliado con el contribuyente o los derechos del
descendiente; una referencia ambigua se rechaza. El libro y las
referencias, titularidades y fechas conservan las validaciones de composición.
No se crean familiares ni rentas implícitos. Los expedientes particulares y
condiciones externas de los evaluadores siguen siendo declarados y reservados;
no habilitan anualidades, ascendientes u otras ramas anuales pendientes.

Limitación acotada: `valenciana_dos_o_mas_descendientes` aplicada requiere las
bases imponibles agregadas de personas únicas de la unidad familiar, que el
contrato anual no representa exhaustivamente. Se rechaza esa solicitud con motivo
específico, sin solicitar una cuota externa ni fabricar las bases ausentes.
Las demás solicitudes mantienen los límites de sus evaluadores revisados.
Las deducciones que requieren mínimo por descendientes exigen sujetos identificados
con derecho calculado en derechosMinimos; gastos familiares externos al contribuyente
exigen esa misma conciliación de sujetos. Ascendientes y cuidado de ascendientes
se rechazan por falta de representación anual: la elegibilidad externa no abre
esas ramas.

La salida pública conserva `deduccionesValencianas2025`, con composición,
movimientos, aplicado, pendiente, pérdida sin traslado, caducidad, motivos y
reservas. En rechazos de composición/cuota el error recuperable conserva ese
diagnóstico en el rastro y no emite un impuesto cero. El rastro anual conserva
el resultado completo además de las líneas anuales anteriores. El estado
`calculo_parcial` y `aceptacionFiscal: "pendiente"` no se convierten en aceptación
fiscal por atravesar esta conexión. No hay persistencia de consumos: el expediente
debe guardar los movimientos y no reaplicarlos como saldo disponible.

Las pruebas de integración reutilizan los ejemplos revisados de acumulación k/l
y prioridad de autoconsumo. Verifican competencia por cuota única (15 y 5,07),
prioridad y caducidad históricas, pérdida/traslado con cuota cero, contradicciones,
consignación doble, rechazo con motivo y ambas entradas públicas. No constituyen
una nueva revisión jurídica ni un cierre de las 351 deducciones. La revisión
monetaria independiente y el CI completo/publicación corresponden al integrador.
