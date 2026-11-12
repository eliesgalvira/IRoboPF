# Galicia 2025: empleo y alquileres identificados

El perfil `galicia-trabajo-inmueble-2025` conecta un empleo ordinario, una
vivienda cedida y el alquiler de la vivienda del contribuyente a ambas API.
Deriva gastos laborales, artículo 20, rendimiento inmobiliario, base y cuotas
desde los hechos. La deducción gallega y las retenciones consumen cada importe
una sola vez. No acepta bases, rentas netas ni cuotas elegidas por el llamante.

## Contrato

Residente individual en Galicia durante todo 2025, de 18 a 64 años, sin
familiares, discapacidad, otras rentas, compensaciones o reducciones de base.
Un solo empleo laboral o estatutario con cotizaciones efectivas, conciliación
documental del titular y gastos del contrato laboral existente. No representa
pensiones, varios empleos, actividad económica, ahorro ni declaración conjunta.

El censo mundial contiene exactamente una vivienda gallega, con titularidad
y operaciones conciliadas por el productor inmobiliario común. Debe estar
alquilada los 365 días, con contrato posterior al 26 de mayo de 2023, reducción
del 50 %, neto no negativo, sin imputación ni exceso de gastos pendiente. Los
contratos antiguos, otros porcentajes, pérdidas y cambios de residencia quedan
fuera de este perfil; su rechazo no es una prohibición legal universal.

La solicitud regional es exclusivamente el alquiler propio de Galicia. Conserva
los controles existentes de edad, fianza, ocupación, pagadores y de la suma de
bases hasta 22.000 euros, así como la conciliación de inversiones del inmueble
cedido. No se habilitan otros consumidores ni concurrencias. Los identificadores
y documentos de trabajo, alquileres, gastos y retenciones deben ser coherentes.

El título de alquiler propio debe preceder o coincidir con la ocupación y los
pagos representados; un título previo distinto requiere otro expediente. La
fianza o denuncia se concilia con el plazo ordinario de Renta2025, hasta el
30 de junio de 2026 inclusive, según el artículo7.1 de la Orden HAC/277/2026.
Los justificantes válidos de 2026 se admiten. Los posteriores se rechazan antes
de importe; este perfil no modela contextos especiales de presentación. La
ausencia de ambos justificantes conserva la deducción cero. El criterio y el
plazo están documentados en las fuentes AEAT y BOE del índice.

## Etapas y fuentes

El neto laboral se obtiene con el artículo 19. El artículo 20 usa su argumento
propio y el neto inmobiliario **anterior** a la reducción del artículo 23 para
la frontera de otras rentas de 6.500 euros. La base integra el trabajo reducido
y el neto inmobiliario reducido. Se reutilizan mínimos y cuotas fijas oficiales
gallegas de 2025, con precisión decimal80 y sin redondeo fiscal entre etapas.

Las fuentes primarias, fechas de recuperación y SHA256 se recogen en
[FUENTES.json](FUENTES.json). Los originales y cabeceras se preservan en el
CAS de la entrega. La norma de alquiler es el artículo 5.Siete del texto
refundido gallego; los artículos 19, 20, 23 y 48 de la LIRPF determinan las
magnitudes integradas. El manual AEAT2025 acredita escala, mínimos y requisitos.

La conexión ha reproducido además un defecto común de DA61: su límite
proporcional recibía la cuota líquida, después de deducciones. La
[Ley5/2025, disposición final tercera](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-15424)
fija el límite sobre las íntegras atribuibles al trabajo y ordena restar el
importe después del artículo80. La corrección entrega al límite la cuota
general después del mínimo personal; mantiene por separado la cuota disponible.
El contrato integrado sigue excluyendo ahorro y compensaciones.

Caso discriminante: íntegro laboral13.902, SS1.000, neto inmobiliario6.500,
trabajo reducido3.600 y base6.850. Las íntegras son218,99; el alquiler consume
95,49 y deja líquida123,50. DA61 es `218,99 × 3.600 / 6.850`, aproximadamente
115,089635, frente a64,905109 anteriores. Ambas API reproducen el PRE y pasan
el POST. Los originales y salidas rojas permanecen en la entrega.

## Evidencia y límites

`tools/galicia-mixto-oraculo.py` calcula 17 escenarios con `Fraction`, sin
importar producto ni tablas del motor. Conserva las fracciones y una proyección
a doce decimales exclusivamente comparativa. Incluye fronteras de artículos20
y DA61, 22.000 euros, cuota agotada y cuota proporcional. Sus expectativas se
conservan en `tests/fixtures/galicia-mixto-2025-oraculos.json`.

La validación de autor y sus incidencias se registran en la entrega. No es una
revisión independiente ni un cotejo con Open. No se añaden observaciones a la
campaña histórica y el CI anterior de 2018 no acredita esta nueva imagen.

La [revisión inicial y el contraste de H1/H2](REVISION.md) están cerrados.
La imagen corregida pasa los [31 comandos del CI local](CI.json), con runtimes
exactos, entorno limpio e inventario regenerado. Los valores de autor y las
reservas anteriores se conservan; la comprobación remota corresponde al commit
publicado.
