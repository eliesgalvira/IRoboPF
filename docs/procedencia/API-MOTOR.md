# API del motor

Se retiran la selección legacy, los helpers familiares insuficientes y la reconstrucción salarial paralela de la cuota. `modo: "canonico"` es el único valor admitido; otro valor se rechaza también en JavaScript. El análisis salarial consume la liquidación anual. Las entradas analítica y efectiva normalizan hechos y consumen `componerLiquidacionAnual`; no seleccionan dos fórmulas de liquidación.

## Declaración anual

`lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts` exporta `liquidarIrpfAnual(caso: CasoFiscalAnual, contexto: ContextoLiquidacionIrpf)`, `LiquidacionIrpfAnual` y su `layer`, `liquidarIrpfAnualConDerechos` y la reexportación `liquidarIrpfAnualExplicito`. Los tipos públicos incluyen `LiquidacionIrpfAnualCalculada`, `ResultadoNoSoportado`, `LiquidarIrpfAnualError`, `ContextoLiquidacionIrpf`.

Las notas anteriores del [catálogo de deducciones](deducciones-2025/CAMBIOS-PARA-REDISENO.md) describen entregas existentes, pero no obligan a conservar su API. El rediseño debe tomar como referencia el contrato vigente de esta página.

El catálogo integrado conserva las colecciones regionales, pero Comunitat Valenciana, Galicia y La Rioja ya no exponen constructores o exportaciones intermedias para cada deducción. Sus descripciones expresan las condiciones documentadas; no constituyen todavía evaluadores automáticos completos. Las 40 fichas valencianas están marcadas como pendientes de pruebas de cálculo.
El efecto devuelve la liquidación o un error recuperable `ResultadoNoSoportado` con `motivo`, `fuenteReconocida` y `rastro`. Se mantienen los campos de bases, cotizaciones, cuotas, deducciones, pagos y diferencial. Se elimina `conciliacionSimuladorLegacy`. Los importes de entrada y salida con sufijo `Centimos` son enteros en céntimos; las operaciones internas usan euros `Decimal`. Un diferencial positivo es a ingresar y uno negativo a devolver.

`CasoFiscalAnual` se define en `lib/dominio/irpf/caso-fiscal-anual.ts`: ejercicio, comunidad, situación individual, rendimientos, reducciones, deducciones, retenciones y pagos. Las listas `situacionFamiliar.descendientes` y `ascendientes` solo admiten ausencia (`readonly never[]`). Una lista antigua no vacía se rechaza: no se completa con hechos supuestos. La modalidad se valida también al ejecutar: se rechaza cualquier valor distinto de `individual`, aunque no se aporten derechos familiares. La edad y discapacidad del contribuyente siguen siendo explícitas. Cuando hay familiares se aportan `derechosMinimos`; el ámbito, edad y discapacidad deben conciliar con el caso anual.

Ejemplo del perfil técnico sin familiares:

```ts
const caso: CasoFiscalAnual = {
  anio: 2025,
  comunidadAutonoma: "madrid",
  situacionFamiliar: {
    tipo: "individual", edad: 40,
    discapacidad: { _tag: "SinDiscapacidad" },
    descendientes: [], ascendientes: [],
  },
  rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] },
  reducciones: [], deducciones: [],
  retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
}
const efecto = liquidarIrpfAnual(caso, { modo: "canonico" })
```

Este recorrido parcial conserva la selección normativa existente por ejercicio y territorio, incluidos los escenarios estatales simulados. Su cotización estimada corresponde al perfil uniforme descrito abajo. No acredita una declaración completa para todos los años ni la elegibilidad de deducciones. Las deducciones autonómicas actuales se consumen sin modificar su contrato; la unificación de ese contrato pertenece a otra entrega.

## Derechos familiares

`minimos/derechos-contrato.ts` exporta el esquema y tipo `DerechosMinimos2025`, `DescendienteDerechos`, `TitularDescendiente`, `DiscapacidadDerechos` y `DerechosMinimosNoSoportados`. El nombre refleja su alcance real: Madrid, 2025, régimen común, individual, devengo 31 de diciembre, sin ascendientes ni fallecimientos. No se extrapolan sus condiciones a otros ejercicios.

`minimos/derechos.ts` exporta `validarDerechosMinimos`, `calcularDerechosMinimos`, `validarRentasAnualesDerechos` y `hayAlimentosPropiosSinMinimo`. `calcularDerechosMinimos(hechos, minimos, aritmetica?)` recibe los hechos completos y los parámetros seleccionados, y devuelve euros `Decimal` para contribuyente, descendientes, discapacidad, total y atribuciones por sujeto, orden, titulares y divisor. El tercer argumento opcional es un constructor `Decimal`; por defecto conserva la aritmética global existente. La composición pasa su constructor local para que el reparto y la suma respeten las 20 u 80 cifras elegidas. No es por sí mismo una declaración. La ruta anual selecciona separadamente parámetros estatales y autonómicos.

Los hechos incluyen identificadores locales anónimos, nacimiento y edad al devengo, rentas no exentas, declaración propia, discapacidad y censo completo de titulares con grado, vínculo, convivencia/dependencia, custodia, residencia, rentas y alimentos. La conexión anual exige además conciliación de rentas del contribuyente antes de reducciones. Dos titulares del mismo grado con derecho al primer descendiente reciben 1.200 euros estatales cada uno; no 2.400 cada uno. Tres reciben 800. La discapacidad del descendiente comparte el divisor y exige elegibilidad.

Se cubren límites de 8.000 y 1.800 euros, edad de 25 años con excepción por discapacidad, incremento de menores de tres años y vínculos asimilados soportados, así como concurrencia de grados acotada. Se rechazan, con motivo, fechas incoherentes, hechos incompletos, porcentajes manuales, ascendientes, fallecimientos, especialidades propias de alimentos pendientes, ciertos grafos y empates de orden, mayoría de edad en vínculos asimilados y concurrencia no soportada. Los tests `minimos-derechos.test.ts` contienen ejemplos completos. La extensión normativa 2012–2026 sigue pendiente de A/E.

El mínimo del contribuyente y la cuantía de discapacidad se calculan mediante las mismas piezas monetarias que usa la ruta sin familiares. Las piezas monetarias no deciden elegibilidad familiar. No existen `FamiliarFiscal`, `obtenerMinimoDescendientes`, `obtenerMinimoAscendientes` ni los acumuladores de discapacidad de familiares basados solo en edad/discapacidad.

## Entrada anual con importes efectivos

`liquidarIrpfAnualExplicito` conserva los esquemas y contratos de `trabajo-anual/conexion-contrato.ts`. El perfil salarial contrastado admite Madrid 2025 individual, edad 18–64, residencia anual completa, empleo laboral/estatutario, importes efectivos conciliados y ausencia de familiares, discapacidad y otras especialidades según ese contrato. No se sustituyen las cotizaciones efectivas por estimaciones. Los siete casos de Renta WEB Open 2025 y los ejemplos de 1.333,92 euros a ingresar y 321,18 euros a devolver mantienen sus expectativas y reservas. Véase [alcance salarial](DECLARACION-SALARIAL-2025.md).

## Retenciones y cotizaciones estimadas

`retenciones/retencion-trabajo-aeat.ts` exporta `calcularRetencionTrabajoAeat(caso, contexto)`, `RetencionTrabajoAeat` y sus tipos de entrada, resultado, servicio y error. Sus tipos públicos son `CasoRetencionTrabajo`, `ContextoRetencionTrabajo`, `ServicioRetencionTrabajoAeat`, `ResultadoNoSoportadoRetencion`, `RetencionTrabajoCalculada`, `ResultadoRetencionTrabajo`, `CalcularRetencionTrabajoError`, `SituacionFamiliarRetencion`, `SituacionLaboralRetencion`, `ContratoRetencion` y `DiscapacidadRetencion`. `DescendienteRetencion` y `AscendienteRetencion` describen comunicaciones parciales que se reconocen para rechazarlas; no conceden derechos. Solo admite el procedimiento inicial soportado y una versión acreditada para el ejercicio/fecha. En años con reformas debe indicarse fecha del pago o `perfilTemporal: "cierre"`; no existe el atajo sin versión. Regularización, contrato manual sin anualización y límites de irregularidad conservan sus rechazos. La edad del perceptor es obligatoria: no se presume 40 años. Las listas familiares comunicadas, `computoPorEntero` y los divisores manuales no acreditan derechos y se rechazan. La entrada familiar es `derechosMinimos: DerechosMinimos2025`, con las listas antiguas vacías. Su conexión se limita a Madrid 2025, activo, situación 3, edad/discapacidad coherentes y sin especialidad de anualidades. Usa `calcularDerechosMinimos` y el mismo mínimo de contribuyente/discapacidad del motor anual; el rastro conserva los divisores. Otras situaciones laborales/familiares, ascendientes y ejercicios sin cobertura de derechos se rechazan con motivo. El censo de rentas es un hecho declarado, no una declaración anual calculada por este procedimiento.

`laboral/cotizaciones-perfil-uniforme.ts` exporta `calcularDesgloseCotizacionesPerfilUniforme` y `CotizacionesPerfilUniforme`. La única política analítica usa doce mensualidades uniformes, contrato indefinido, remuneración con prorrata y tipos ordinarios declarados, sin especialidades ni mínimos por grupo/jornada. Conserva el reparto de solidaridad por tipos de cada pagador y la ponderación de topes de 2018. Devuelve `alcance: "analitico-doce-mensualidades-uniformes"` y `redondeoTgss: "pendiente"`. No representa cuotas mensuales ingresables ni resuelve D. `CotizacionesSociales.layer` ofrece `calcular` y `desglosar`, ambos sobre esa política. Se retiran sus métodos y funciones legacy.

## Análisis salarial e inflación

`analisis-salarial/calculo-salario.ts` exporta `calcularSalario`, `CalculoSalario`, `EntradaCalculoSalario`, `ServicioCalculoSalario` y `SeleccionTemporalRetencion`. La entrada declara ejercicio, bruto anual en céntimos y, opcionalmente, territorio y selección temporal de retención. Los perfiles de auditoría con familiares insuficientes se rechazan. Usa la cuota líquida de la única liquidación anual para calcular neto; no resta otra deducción SMI ni limita la cuota por retenciones. Devuelve `DesgloseLiquidado`: bruto, cotización empresarial y del trabajador, coste laboral, `irpfFinalCentimos` (la cuota anual), neto anual y rastro. `irpfFinalPrecisoEuros` expresa el importe nominal como texto decimal. Se eliminan los campos auxiliares que seleccionaban otra cuota por obligación de declarar o por deducción SMI.

`analisis-salarial/perfil-progresividad-frio.ts` ofrece `calcularSalarioNetoEIrpf` y `PerfilProgresividadFrio`, con perfil `analisis-progresividad-frio`. Exporta también `PerfilCalculoAnalitico`, `EntradaCalculoSalarioNetoIrpf`, `ContextoCalculo` y `ResultadoCalculoSalarioNetoIrpf`. `progresividad-frio.ts` conserva comparación por IPC, comparación pasada, pérdida acumulada y rangos analíticos, alimentados por liquidaciones canónicas. El escenario declarado es individual de 40 años, sin familiares ni discapacidad, territorio estatal simulado y cotización uniforme; no es una declaración presentada. Los importes ajustados por IPC son magnitudes analíticas y conservan el rastro nominal original. El escenario de diciembre de 2026 sigue siendo una hipótesis del 3 %, no una observación INE. No se inventa precisión inferior al céntimo liquidado. Los tipos de análisis son `EntradaComparacionAjustadaPorIpc`, `ComparacionAjustadaPorIpc`, `DesgloseLiquidado`, `PerdidaAcumulada`, `PuntoPerdidaAcumulada`, `EntradaAuditoriaRangoSalarial`, `AuditoriaRangoSalarial`, `PuntoAuditoriaRangoSalarial` y `HallazgoAuditoria`. Las tablas de parámetros usan `TablaCompatible` y `ValorCeldaCompatible`; esos nombres de formato no habilitan otra liquidación.

`lib/export/auditoria-excel.ts` recibe `tablaComparativa` y `tablasDetalle` ya calculadas para las hojas salariales. Si no se suministra una tabla comparativa, proyecta los puntos ya calculados de la auditoría recibida; no regenera millones de celdas fiscales con fórmulas históricas. Las exportaciones son `construirLibroAuditoriaEducativa`, `exportarAuditoriaEducativaExcel`, `construirLibroAuditoriaCompatible`, `construirLibroAuditoriaCompatibleConProgreso`, `exportarAuditoriaCompatibleExcel`, `construirBlobXlsxCompatibleConProgreso` y `exportarAuditoriaCompatibleExcelConProgreso`. Los nombres de formato no habilitan un cálculo compatible. Los tipos son `OpcionesLibroAuditoriaCompatible`, `OpcionesExportacionCompatibleConProgreso` y `ProgresoExportacionCompatible`; el libro consume resultados de `AuditoriaRangoSalarial` y el constructor de blob consume tablas explícitas. Las funciones de descarga requieren navegador. Las tablas suministradas expresan euros en las columnas monetarias y nunca calculan derechos. Se retiran los constructores de hojas salariales legacy y sus regeneradores. Las fichas familiares insuficientes quedan desconectadas del cálculo anual con un rechazo explícito, sin rediseño visual.

## Procedencia y revisión pendiente

Los rastros conservan sitios, importes y fuentes. Para la liquidación anual reformada, las referencias del catálogo anterior quedan como referencias históricas por URL, snapshot y hashes dentro del motivo pendiente; no se atribuye a este código la revisión del anterior. El censo de fuentes y el inventario actuales se regeneran para esta composición. `rastro-generado.json` conserva su versión histórica; los ensayos simbólicos de composición/causalidad que dependían de símbolos retirados requieren nueva revisión. Ambas entradas devuelven referencias históricas dentro de motivos pendientes, sin atribuir sus certificados al núcleo nuevo. Los artefactos previos permanecen por versión y no se promueve ninguna atestación, registro ni `completeRuleAcceptance`. Esta retirada no cierra A ni los demás bloques del plan.

El contrato estructural actual y sus reservas se describen en [integración CI](reforma-motor/integracion-ci/INFORME.md). Su censo AST no acredita la composición simbólica histórica ni promueve sus cuatro puertas.

## Deducciones parciales: identidad de declaración

Madrid (nacimiento) y Murcia (guardería), ejercicio 2025, usan el mismo evaluador de contratos tanto desde `evaluarDeduccion` como desde `evaluarHechosAuxiliar2025` y `calcularDeduccionesAutonomicasAplicadas`. `ContextoDeduccion.declarantes` identifica exhaustivamente a los declarantes en conjunta: lista no vacía, sin duplicados y con la referencia `contribuyente` incluida. Omitirla en la API directa conjunta devuelve `no_soportado`. En hechos auxiliares la lista obligatoria `declarantes` se propaga íntegra al contexto; si también figura en el contexto ambas deben coincidir. El orden y la elección de referencia dentro de la unidad no cambian la cuantía.

En conjunta se incluyen los derechos de los declarantes, sin sustituir la referencia por un titular. Progenitores o titulares externos a la unidad provocan rechazo explícito, incluidos los conjuntos mixtos de titulares internos y externos. En individual se conserva el reparto entre todos los titulares, aunque presenten declaraciones separadas. Murcia aplica el máximo de 1.000 euros por hijo antes del reparto individual; Madrid conserva ventana temporal, historial de bases, multiplicidad y redondeo.

El adaptador numérico admite un ámbito con identidad de referencia, modalidad y declarantes; cuando se aportan, los contrasta con los hechos y rechaza discrepancias. Una lista de declarantes es una afirmación externa exhaustiva: esta API no acredita parentesco, convivencia ni elegibilidad jurídica. Los resultados continúan siendo cálculos parciales, con aceptación fiscal pendiente. No amplían el contrato familiar de mínimos y retenciones del motor anual a otros años o territorios; ese trabajo de E sigue pendiente y las entradas fuera de su contrato se rechazan.

## Escalas y exportación retiradas

Se eliminan `calcularCuotaPorEscalaGeneral`, `calcularDesgloseCuotaPorEscalaGeneral`, `obtenerTramosIrpfLegacy` y sus cuatro tablas combinadas. El cálculo utiliza `calcularCuotaPorEscala` y `calcularDesgloseCuotaPorEscala` con los parámetros del selector territorial y las cuotas publicadas cuando corresponda. No hay una API equivalente sin ámbito que pueda devolver la tarifa truncada.

Se retira `construirTablaControlTramosIrpfCompatible` y la hoja `CONTROL_TRAMOS_IRPF` de la exportación corriente. Los controles históricos permanecen como evidencia; no se regeneran con código incorrecto.

El escenario `simulada-estatal`, cuando duplica la parte estatal, deriva sus tipos de ese mismo selector. Desde 2021 su tipo simulado final pasa de 47 % a 49 % sobre el exceso de 300.000 euros. Es una simulación; no representa la cuota de una comunidad real ni amplía los ejercicios o situaciones admitidos.

## Contrato de composición vigente (4 de noviembre de 2026)

Los adaptadores públicos conservan contratos distintos para hechos distintos. El núcleo interno `liquidacion/composicion-anual.ts` recibe `EntradaComposicionAnual`: `ambito` (ejercicio, territorio, fecha de fallecimiento, contribuyente y derechos), bases general/ahorro integradas en euros `Decimal`, rentas antes de reducciones para conciliar derechos, parámetros estatales y deducciones autonómicas declaradas en céntimos. `cotizaciones.naturaleza` distingue `efectivas` y `estimadas-perfil-uniforme`; `trabajador` conserva el importe decimal recibido como procedencia, ya deducido por el productor de rendimientos. El núcleo no lo vuelve a restar. En actividad incluye RETA ya consumida por el aporte. Esta API interna presupone la admisión de cada productor; no debe exponerse directamente a formularios.

`politica` declara `decimal-hasta-salida` o `open-empleo-madrid-2025`; `precision` declara 20 u 80 cifras significativas de composición, respectivamente según el productor analítico o efectivo. Son políticas monetarias, no algoritmos fiscales alternativos. El constructor local se propaga a escalas, cuotas fijas, remanentes del ahorro y reparto de mínimos antes de operar; no se cambia `Decimal.precision` global ni se recuperan cifras ya perdidas en la entrada. Los helpers de escala y ahorro aceptan `aritmetica?: Decimal.Constructor`, con el constructor global como valor predeterminado para los demás consumidores. Open se rechaza fuera de Madrid 2025 o con cotización estimada. El núcleo selecciona escalas, calcula derechos estatales y autonómicos, gravámenes y mínimos, ahorro, límite autonómico de deducciones, cuota líquida y, cuando el productor acredita servicios laborales, DA61 y cuota posterior. La política Open cuantiza cada gravamen y DA61 antes de restar; el adaptador cuantiza artículo 20 con la misma función. Los perfiles pensión y actividad conservan precisión hasta salida y excluyen DA61. No se deduce DA61 automáticamente de un bruto del perfil analítico, que no acredita la calificación efectiva requerida.

`liquidarPagosAnuales` resta retenciones y pagos una vez, en la unidad y etapa monetaria recibidas. En el perfil técnico se aplica a la cuota ya liquidada a céntimos; en el efectivo a euros decimales y después se presenta a dos decimales. Los adaptadores solo preparan rendimientos/bases según su dominio y proyectan resultados y rastros. No recalculan los mínimos ni los gravámenes.

| Entrada pública | Unidades / discriminantes | Resultado y uso |
| --- | --- | --- |
| `liquidarIrpfAnual(caso, { modo: "canonico" })` | Enteros `Centimos`; `anio`, `comunidadAutonoma`; `situacionFamiliar.tipo: "individual"`; cotización uniforme estimada | `LiquidacionIrpfAnualCalculada`; bases, cotizaciones, cuotas y diferencial en céntimos; análisis, servicios y derechos consumen esta salida |
| `liquidarIrpfAnualConDerechos(caso)` | Mismo caso, `derechosMinimos` completo obligatorio | Misma salida y composición, sin cuota familiar alternativa |
| `liquidarIrpfAnualExplicito(caso)` | `CasoFiscalAnualExplicito`, `perfil: "solo-trabajo"` o `"solo-actividad-eds"`; importes aportados como texto EUR con hasta dos decimales, nunca `number` | `_tag: "LiquidacionIrpfAnualExplicitaCalculada"`; importes calculados como texto decimal EUR, `cuotaDiferencialPresentada` a dos decimales; `aceptacionFiscal: "pendiente"` |

La entrada efectiva exige todos los discriminantes de `conexion-contrato.ts`: residencia anual, devengo, modalidad, ausencia de otras rentas, familiares/discapacidad, reducciones de base, saldos, rentas extranjeras y especialidades. El empleo exige rendimientos laborales/estatutarios disjuntos, gastos acreditados y cotizaciones `clase: "efectivas"`; pensión sola se admite sin DA61 y sin mezclarla con empleo. `solo-actividad-eds` consume `CasoActividad2025` con los rechazos del adaptador; amortizaciones y discapacidad siguen fuera del anual. No se admiten importes estimados en esta entrada efectiva ni se rellenan hechos ausentes. Retenciones efectivas llevan ejercicio, identidad de operación única, procedencia e importe.

El perfil técnico conserva parámetros territoriales parciales 2012–2025 y el escenario `simulada-estatal` 2012–2026; esto no acredita declaraciones completas ni mínimos familiares históricos. 2026 real se rechaza. Los derechos familiares siguen restringidos a Madrid 2025: otro año/territorio, ascendientes, fallecimientos o hechos insuficientes se rechazan, aunque existan parámetros numéricos. El contrato efectivo sigue limitado a Madrid 2025 individual de 18–64 años. No se abre ninguna puerta de actividad o aceptación fiscal general.

Ambas funciones devuelven `Effect` sin servicios requeridos al llamante. Los rechazos anuales son fallos recuperables `_tag: "ResultadoNoSoportado"`, con `motivo`, `fuenteReconocida` y `rastro`; si se solicita retención AEAT puede propagarse `ResultadoNoSoportadoRetencion` (unión `LiquidarIrpfAnualError`). El núcleo mapea los rechazos de derechos a `ResultadoNoSoportado`; la API directa de derechos mantiene `DerechosMinimosNoSoportados`. Para UI usar `Effect.result`, distinguir `Result.isFailure` y mostrar el motivo. Nunca presentar un rechazo como impuesto cero.

### Ejemplos ejecutables para el rediseño

[ejemplos.ts](reforma-motor/bloque-e/ejemplos.ts) exporta hechos completos y sintéticos, comprobados en `tests/composicion-anual-unica.test.ts`. Desde un módulo TypeScript en la raíz:

```ts
import { Effect, Result } from "effect"
import { analitico, efectivo, conDerechos } from "./docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito, liquidarIrpfAnualConDerechos } from "./lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

const estimacion = Effect.runSync(liquidarIrpfAnual(analitico, { modo: "canonico" }))
const declaracion = Effect.runSync(liquidarIrpfAnualExplicito(efectivo))
const reparto = Effect.runSync(liquidarIrpfAnualConDerechos(conDerechos))
// El primer descendiente tiene dos titulares: 1200 EUR estatales para cada uno.
const rechazado = Effect.runSync(Effect.result(liquidarIrpfAnual(
  { ...conDerechos, comunidadAutonoma: "canarias" }, { modo: "canonico" }
)))
if (Result.isFailure(rechazado)) console.log(rechazado.failure.motivo)
```

La UI presenta las cantidades y el signo del diferencial recibidos; no integra tarifas ni vuelve a aplicar artículo 20, mínimos o DA61. Los ejemplos no sustituyen los certificados efectivos del usuario. Las siete referencias Open conservan sus cantidades originales; el nuevo código ha pasado la revisión independiente y su contraste de precisión, documentados en el [cierre técnico](reforma-motor/bloque-e/CIERRE.md); no hereda certificación histórica.

La salida efectiva incluye, además de `_tag`, `perfil`, `ejercicio`, `alcance`, `aceptacionFiscal` y `rastro`, estos textos EUR: `rendimientoNetoReducido`, `baseImponibleGeneral`, `baseLiquidableGeneral`, `baseLiquidableAhorro`, `reduccionArt20`, `cuotaLiquidaLegal` (antes de DA61), `deduccionTrabajo`, `cuotaPosterior` (después de DA61), `retenciones`, `pagosFraccionados`, `cuotaDiferencial` y `cuotaDiferencialPresentada`. Las bases con signo se conservan aunque el gravamen use su parte positiva. `cuotaDiferencialPresentada` es la presentación final; el resto puede tener más de dos decimales cuando la política no cuantiza esa etapa. No convertir esos textos a `number` para recalcular la declaración.
