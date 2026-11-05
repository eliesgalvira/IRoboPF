# Magnitudes anuales que requiere la ampliaciónE

Todas son entradas identificadas del cálculo fiscal2025, no importes de deducción profesional. Cada valor debe conservar ejercicio, declarantes exactos y nodo de derivación. Este contrato permite derivarlas en la anual sin incorporar aquí otra liquidación. Los consumos compartidos se actualizan en un orden explícito de composición; no se calculan varias veces con el mismo saldo inicial.

| Clave | Definición y uso concreto |
| --- | --- |
| `baseImponibleTotal` | Base imponible total antes de mínimos. Para nacimiento/cuidado gallego se resta el mínimo personal/familiar; alquiler gallego compara directamente con22000. |
| `minimoPersonalFamiliar` | Mínimo de la declaración correspondiente. No es una reducción ficticia ya descontada de la base recibida. |
| `baseLiquidableGeneral` | Base liquidable general sometida a tributación. Umbral18030 individual/30050 conjunta en las ramas riojanas que lo exigen. |
| `baseLiquidableAhorro` | Base liquidable del ahorro sometida a tributación, umbral1800. No sustituir por precio de vivienda/vehículo o renta familiar. |
| `cuotaIntegraAutonomica` | Cuota íntegra autonómica de la declaración, antes de estas deducciones; base del tope30% del mecenazgo32.14. No es cuota disponible aportada para fingir liquidación. |
| `patrimonioInicialAjustado`, `patrimonioFinalAjustado` | Valores comprobados al inicio/fin para la remisión de vivienda: excluyen cambios de valor de bienes que siguen en patrimonio y adquisiciones por ISD en los términos legales. Su diferencia se compara con la inversión sin intereses ni gastos de financiación. Se exige derivación patrimonial del caso, no saldo bancario. |
| `baseEstatalViviendaSinAdecuacion` | Base2025 de deducción estatal de viviendaDT18, excluida adecuación por discapacidad. Reduce9040 en adquisición joven histórica/segunda vivienda. No es el importe de la deducción estatal ni su cuota. |
| `baseConsumidaAdquisicionSegunda` | Base regional ya reservada de9040 para la otra modalidadDT1b/c, una vez descontada la base estatal. Compartida por contribuyente. |
| `baseConsumidaRehabilitacionAdecuacion` | Base ya reservada por la otra modalidadDT1a/d del límite regional conjunto9040. No usar12020 de la antigua estatal como base regional. |
| `baseConsumidaViviendaMunicipios` | Base ya reservada por otras atribuciones de la misma declaración en32.2. Evita aplicar9040/452 una vez por cada solicitante. |
| `cuotaElectricoConsumidaDeclaracion` | Consumo del cupo legal aplicable al vehículo elegido ya reservado en la misma declaración. Reduce máximo300, o225 en bicicleta, sin inventar un límite personal por cada cónyuge. Si concurren categorías, el compositor debe derivar el consumo correspondiente a la categoría elegida y documentar su nodo;esta llamada no resuelve por sí sola aquella composición cruzada. |
| `mecenazgoConsumidoDeclaracion` | Importe ya reservado contra30% de cuota íntegra autonómica por otras atribuciones del apartado14. No se aplica ese30% a patrimonio histórico del apartado15. |

Las bases imponibles y valores patrimoniales admiten signo cuando corresponda. Mínimos, cuotas y bases/consumos reservados no admiten cantidades negativas. Una clave repetida, nodo ausente o declarantes distintos produce rechazo, sin importe.

Ayudas gallegas usa dos `TipoMedio`: estatal y autonómico, porcentajes con numerador/denominador enteros y nodo de derivación anual. Este módulo no prescribe un cociente alternativo al tipo medio legal ni lo confunde con un tipo marginal. La anual debe proporcionar los tipos medios2025 que resulten del cálculo fiscal, su ámbito y sus componentes de derivación. Para cada ayuda integrada se necesita además la porción que termina incluida en base liquidable, con nodo de imputación; base imponible integrada y ayuda concedida no son magnitudes intercambiables.

Libros necesita renta2024 de cada miembro de la unidad familiar y sus hechos de discapacidad/pensión para el denominador ponderado. No se utiliza por defecto la renta2025. La comparación con30000 per cápita se hace cruzada sin redondear.

Los seguimientos y saldos pendientes de aplicación de cuota son contratos diferentes: adecuación/vivienda vacía gallega puede producir remanente por cuota4años y actividad agraria riojana3años con aplicación última. Este candidato calcula generación/base y conserva esas condiciones; la cantidad de cuota efectivamente aplicada/arrastrada debe salir del compositor anual, nunca de un importe externo inventado.
