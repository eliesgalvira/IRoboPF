# Decisión técnica por sitio

Cada fila es candidata a revisión posterior. «Pendiente» aquí describe aristas a descomponer o discriminantes que debe conservar el wiring, no un error fiscal demostrado. No se aprueba ningún código propio.

| siteId (prefijo anual.) | Valor y pendiente concreto de adaptación |
|---|---|
| base.ahorro | max(0,gananciaSujetaAhorro); mantener frontera del submotor de transmisiones y no conectar el saldo de otras rentas ni capital mobiliario ausente. |
| base.general-imponible | Saturar solo el subtotal trabajo; aristas de renta inmobiliaria y ganancias conservan signo. Falta desglose del submotor de ganancias por clasificación/exención. |
| base.general-liquidable | Alias de BIG; no conectar mínimos como resta ni afirmar que el caso real carece de reducciones. La frontera transitiva es la misma de BIG. |
| cuota.ahorro-componente-postminimo | Remanente independiente por componente; preservar anio<=2014 y su orden. Falta desglose de cada tabla del selector de ahorro como arista individual. |
| cuota.ahorro-total | Bruta conjunta integrada; no usar celdas estatales generales ni MADRID2022. Descomponer selector anual conjunto sin sustituirlo por las tablas por componente. |
| cuota.ahorro-tramo | Map del desglose conjunto; importe es tramo.cuota, no la cuota fija de otra representación. Mantener índice por ejecución. |
| cuota.diferencial | Redondeo de cuota líquida a céntimos y resta de soportadas/pagos. Descomponer política monetaria y retención opcional; no asociar pagos a cuotas previas. |
| cuota.general-autonomica-tramo | Map del desglose real; conservar selector por territorio/año/fecha y fila estricta Murcia. Resolver todas las ramas fallback de tablas anuales. |
| cuota.general-estatal-tramo | Map real con publicadas2012–14 o simulada conjunta; no unirlas. Descomponer el dispatcher anual y el fallback integrado por su contrato. |
| cuota.general-total | Suma de los dos componentes ya obtenidos; no sumar de nuevo ordinaria/complementaria. Faltan los cierres de ambos selectores anteriores. |
| cuota.liquida | Suma postmínimo general/ahorro menos deducción limitada, saturada0. Conservar el límite autonómico y la excepción simulada. |
| cuota.minimo-ahorro-total | Suma de minoraciones por componente; no igualar a F(remanente) hasta2014. Cerrar selector por componente y no reutilizar ahorro bruto como su identidad. |
| cuota.minimo-autonomico-tramo | Map de FA(min(MA,BG)); distinguir mínimo propio madrileño de tabla. Faltan ramas de mínimos condicionados y vigencia. |
| cuota.minimo-estatal-tramo | Map de FE(min(ME,BG)); publicadas2012–14 o simulada. Mínimo estatal recibido no certifica derecho. |
| cuota.minimo-general-total | Suma de las dos cuotas de mínimos, no de mínimos nominales. Conservar selección autonómica distinta y las omisiones de sus dos componentes. |
| deducciones.autonomicas | Importe aplicado=min(consignado,capacidad autonómica general+ahorro), salvo simulada. Descomponer consignaciones por código sin confundir catálogo con evaluador. |
| explicito.big | neto final con signo: rama trabajo con reducción una vez o aporteEDS. Escrituras localizadas; faltan propiedades internas de gastos/EDS. |
| explicito.blg | Misma variable neto, sin reducciones de base; no usar base positiva de tarifas como valor de esta línea. Mismas fronteras transitivas que BIG. |
| explicito.cuota.autonomica | FA(base positiva)−FA(min(base,MA propio)), saturado0; publicadaMadrid2025. Conservar exclusión familiar y la selección sin fallecimiento. |
| explicito.cuota.estatal | FE(base positiva)−FE(min(base,ME propio)), saturado0; integrada2025. No usar ordinaria2012–14 aunque coincida una cifra. |
| explicito.cuota.liquida-legal | Estatal+autonómica antes deDA61. No conectar retenciones,pagos ni la deducción posterior como restas aquí. |
| explicito.cuota.posterior | Inicialmente líquida; sustituida por resultadoDA61 con brutoServicios>0. Escritura localizada; falta descomponer cada límite interno deDA61. |
| minimo.ascendientes | Derechos explícitos actuales devuelven0; helper legacy parcial por edad/discapacidad. No convertir cero de contrato en regla universal ni inferir convivencia. |
| minimo.autonomico | DerechosAutonomicos.total o suma con juego autonómico; falta desglose de selector anual/renta/fecha. No usar ME por cohabitación. |
| minimo.contribuyente | DerechosEstatales.contribuyente o helper anual con incrementos; no depende cuantitativamente del divisor de descendientes. Mantener selector nominal antiguo y condición de edad. |
| minimo.descendientes | Derechos explícitos seleccionan titular/grado/renta y reparten por derecho; helper legacy filtra edad/discapacidad y ordena. No sustituir ambos por una división global. |
| minimo.discapacidad | Suma contribuyente+familiares seleccionados; juegos por rol, asistencia y grado. No conectar gasto por discapacidad laboral como mínimo fiscal. |
| minimo.estatal | Suma cinco subtotales estatales, sin dividir mínimo propio. Mantener derechos opcionales y conciliación como guardas; no extenderlos fuera deMadrid2025. |

Objeción común del mejor experto: una tabla por sitio puede ocultar una arista falsa al resumir. Respuesta: cada fila remite al contrato con cadenas y expresiones por hash/rango; no sustituye sus omisiones ni el contraste posterior. Coste: conservar dos niveles de lectura y bloquear la promoción automática.
