# Vertical de servicios profesionales EDS 2025

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Implementación aislada para revisión posterior. No es un simulador general de autónomos ni una liquidación anual. `soportado` significa que los hechos suministrados entran en el contrato técnico; la autenticidad de sus justificantes y su calificación fiscal no se certifican mediante un string ni mediante los tests. `revisionFiscal` permanece `pendiente`.

<a id="integración-por-el-padre"></a>

## Integración

Entrada: `CasoActividad2025` en `lib/dominio/irpf/actividades-economicas/contrato.ts`; se exporta tanto el schema como el tipo. `calcularActividad2025` valida también en runtime, rechaza propiedades adicionales, datos incompletos y categorías ajenas, y devuelve una unión discriminada. Un rechazo no contiene un rendimiento cero utilizable.

`adaptarActividadGeneral(caso)` devuelve `aporte-disponible` con `AporteActividadGeneral`, o los motivos de no soporte. Consumir `importeEurosExactos` como Decimal con signo en el saldo de rendimientos generales; conservar las pérdidas. No convertir a salario, no llamar al algoritmo de retención laboral, no reutilizar art. 20. Retenciones y pagos fraccionados son campos independientes y nunca gastos. El adaptador no suma ganancias generales, no compensa saldos, no presupone BIG=BLG y no calcula cuota diferencial.

Al integrar se deberá añadir la rama discriminada de actividad a los contratos anuales y revisar integración/compensaciones antes de conectar la salida. Los tres archivos anuales excluidos del encargo siguen intactos. El contrato de salida conserva euros decimales: su conversión a los céntimos del motor existente necesita una decisión de redondeo revisada; queda expresamente fuera de esta entrega.

## Admisión y alcance

Una profesión ordinaria de servicios, individual, régimen común, 2025, IVA plenamente recuperable y ninguna otra renta o actividad. Los hechos desconocidos y cualquier discriminante positivo bloquean. Declarar IAE y naturaleza no equivale a verificar administrativamente su calificación: corresponde al aportante documentar la actividad; el cálculo no tiene catálogo automático IAE.

Historia completa anual desde inicio hasta 2024, con EDS continua, sin renuncias/exclusiones y siempre devengo. Se exige además régimen, renuncia, exclusión y criterio actual. Cualquier opción antigua por cobros/pagos se rechaza incluso si el criterio actual se declara devengo. La versión estrecha rechaza también cambios históricos ya extinguidos: no presume vencimiento de una renuncia a los tres años. Actividades anteriores al inicio, incluso la excepción de cesadas sin beneficios, quedan fuera; desconocido no equivale a ausencia.

Volumen anterior hasta 600.000 inclusive. En inicio 2024 se comprueban días naturales desde inicio hasta fin de año y se compara `volumen*366 <= 600000*dias`; 2024 tiene 366 días. No se redondea el cociente. La vertical exige continuidad desde inicio, sin períodos interrumpidos. Inicio 2025 exige cero actividad y volumen anterior. El volumen de 2025 no determina retrospectivamente la admisión de 2025.

Cada ingreso/gasto tiene ID, justificante, devengo, categoría, base, IVA y afectación. Se suman bases antes de retención. Categorías de gastos: consumibles consumidos, alquiler de local exclusivo, servicios profesionales y suministros de local exclusivo, con correlación y registro. No hay neto agregado ni casilla contabilidad validada. No admite facturas rectificativas, partidas negativas, IVA parcial, subvenciones ni gastos de familias no modeladas. Servicios gratuitos, autoconsumo, no facturados y subvalorados bloquean hasta implementar valor de mercado.

Los IDs son globales entre diarios; los justificantes económicos no pueden repetirse en ingreso/gasto/activo, evitando capitalizar y deducir la misma factura. Es una política conservadora: una factura con varias líneas debe consolidarse en un asiento admisible; una factura mixta fuera del alcance se rechaza. Para pagos, `operacionId` representa la operación económica, no la copia documental. Una factura solo puede tener una retención agregada efectiva; certificado y factura no se suman. Un período solo puede tener un pago 130 agregado acreditado; no se modelan complementarias ni devoluciones. El cuarto trimestre admite pago en enero de 2026; no se calcula su deuda ni su plazo legal.

RETA: únicamente cuotas ordinarias propias efectivamente pagadas en 2025 para períodos mensuales 2025, una por período. No se modelan regularizaciones, devoluciones, intereses, recargos, deudas antiguas, mutualidades ni simulación de cuotas. El justificante debe acreditar la naturaleza ordinaria: el motor no analiza PDFs.

Activos: nuevos adquiridos onerosamente desde 2005, mobiliario o hardware, afectación exclusiva, IVA plenamente recuperable, en uso todo 2025, método lineal histórico y coeficiente constante documentados. Mobiliario: 5–10%; hardware: 10–26%. Base coste+puesta en marcha-residual; cuota limitada al saldo. Sin mejoras, deterioros, incentivos, subvenciones o leasing. No se aplican días/365 ni half-up. Debe funcionar y funciona el caso sin activos.

Se calcula P; luego G (5%, tope 2.000, solo positivo) salvo elección de cliente único; RN conserva signo. Cliente único requiere no vinculación, gastos totales incluidos RETA y amortización <=30%, ingresos sujetos >=70%, obligaciones formales y ausencia de todas las otras rentas. TRADE se rechaza siempre. La discapacidad se representa mediante grado, ayuda/movilidad, ejercicio efectivo y documento; incremento alternativo, nunca suma de 3.500 y 7.750.

Si cumple cliente único pero elige G, no se aplica 32.2.3. La elección de rentas bajas es explícita y solo actúa sin elegibilidad para 32.2.2. Inicio es explícito: 20% después de otras reducciones, base hasta 100.000; primer RN positivo antes de reducciones y ejercicio siguiente, sin prolongarlo por pérdidas. La historia suministra netos anuales anteriores, no liquidaciones ni netos después de reducciones. Se compara cada antiguo empleador por identidad única con el 50%, sin sumar empleadores distintos.

## Evidencia y trazabilidad

Cada etapa devuelve regla ID, fórmula, importe decimal y documentos de origen. `fuentes.ts` asocia reglas con fuentes decisorias y páginas del manual. `fuentes.json` conserva URL/hash/versión de los originales, sin rutas privadas ni cabeceras. Para citas geométricas y contrarrevisión consultar los archivos históricos de `auditorias/actividades-economicas-2025/` y `revisiones/actividades-economicas-2025/`; no se han reescrito sus decisiones ni sus ejemplos.

La fórmula investigada AE25-03/04 en las referencias describe la propuesta histórica: NO es la fórmula ejecutada para regularizaciones o prorrata. Mandan la etapa concreta y los rechazos aquí documentados. El rechazo AE25-02 se aborda con historia temporal y discriminantes de valoración. Los pendientes AE25-03/04/08 se acotan a cuotas ordinarias, activos completos y cliente único. Esto exige una nueva revisión; no convierte el alcance acotado en aceptación del código.

Separaciones obligatorias: los tests acreditan aritmética y defensas sobre fixtures; los hashes acreditan integridad de archivos; la interpretación jurídica depende de fuentes y hechos; la aceptación fiscal exige contrarrevisión y enlace al inventario. No se modifica la puerta cerrada `--accepted` del corpus.

<a id="decisiones-para-incorporar-al-registro-del-padre"></a>

## Decisiones de integración

1. Historia conservadora. Objeción: excluir renuncias ya revocadas y actividades cesadas sin beneficios reduce cobertura lícita. Motivo: no implementar sus transitorios por suposición. Coste: rechazo explícito y ampliación posterior; no se deniega un derecho fiscal.
2. Decimales sin redondear, precisión local de 80 cifras, entradas de hasta 12 enteros/2 decimales y 10.000 documentos. Objeción: el consumidor anual usa céntimos y Decimal tiene precisión finita. Motivo: las sumas y multiplicaciones finitas de esta vertical caben holgadamente bajo ese límite, sin división ni truncado; no cambiar configuración Decimal global. Coste: salida distinta del contrato anual y redondeo pendiente de revisión.
3. Solo activos completos y RETA ordinaria. Objeción: omite operaciones frecuentes. Motivo: no elevar los pendientes AE25-03/04 a reglas aceptadas. Coste: rechazos en altas intermedias, regularizaciones y devoluciones.
4. Cliente único comprobado, TRADE excluido. Objeción: restringe el art. 32.2.1. Motivo: su acreditación tiene requisitos que un porcentaje o booleano no resuelve. Coste: cobertura parcial, con prueba separada del rechazo TRADE. Los ejemplos llamados «trade» se usan únicamente para aritmética de umbrales bajo hechos de cliente único; no prueban elegibilidad TRADE.
5. Identidad documental conservadora y evidencia referenciada. Objeción: un ID/justificante no demuestra autenticidad ni detecta dos identidades fraudulentas del mismo cliente. Motivo: separar contrato de adquisición documental del cálculo. Coste: al integrar se debe normalizar identidades económicas, revisar los justificantes y agrupar pagos; no presentar soporte técnico como certificación.
6. Adaptador sin integración anual. Objeción: no ofrece deuda final. Motivo: el contrato anual y las pérdidas necesitan revisión propia, y están fuera de propiedad. Coste: integración pendiente y utilidad limitada al rendimiento trazable.
