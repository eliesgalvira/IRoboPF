# API del motor

Se retiran la selección legacy, los helpers familiares insuficientes y la reconstrucción salarial paralela de la cuota. `modo: "canonico"` es el único valor admitido; otro valor se rechaza también en JavaScript. El análisis salarial consume la liquidación anual. Las entradas analítica y efectiva normalizan hechos y consumen `componerLiquidacionAnual`; no seleccionan dos fórmulas de liquidación.

## Declaración anual

`lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts` exporta `liquidarIrpfAnual(caso: CasoFiscalAnual, contexto: ContextoLiquidacionIrpf)`, `LiquidacionIrpfAnual` y su `layer`, `liquidarIrpfAnualConDerechos` y la reexportación `liquidarIrpfAnualExplicito`. Los tipos públicos incluyen `LiquidacionIrpfAnualCalculada`, `ResultadoNoSoportado`, `LiquidarIrpfAnualError`, `ContextoLiquidacionIrpf`.

Las notas anteriores del [catálogo de deducciones](deducciones-2025/CAMBIOS-PARA-REDISENO.md) describen entregas existentes, pero no obligan a conservar su API. El rediseño debe tomar como referencia el contrato vigente de esta página.

El catálogo integrado conserva las colecciones regionales, pero Comunitat Valenciana, Galicia y La Rioja ya no exponen constructores o exportaciones intermedias para cada deducción. Sus descripciones expresan las condiciones documentadas; no constituyen todavía evaluadores automáticos completos. Las 40 fórmulas valencianas cuentan ahora con evaluadores parciales por hechos y pruebas revisadas. La composición individual resuelve límites e incompatibilidades declarados y `aplicarCuotaConjuntaValenciana2025` consume una cuota común y saldos históricos según orden explícito. Esta aplicación sigue siendo individual, parcial y separada de la liquidación anual; conserva la acreditación pendiente de las fichas. Véase [contrato de cuota y saldos](deducciones-2025/VALENCIANA-CUOTA-CONJUNTA.md).
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

Este recorrido parcial conserva la selección normativa existente por ejercicio y territorio, incluidos los escenarios estatales simulados. Su cotización estimada corresponde al perfil uniforme descrito abajo. No acredita una declaración completa para todos los años ni la elegibilidad de deducciones. Las deducciones parciales descritas abajo no se suman automáticamente a esta liquidación; la consignación anual de importes externos conserva su contrato.

## Derechos familiares

`minimos/derechos-contrato.ts` exporta `DerechosMinimosAnuales`, `DescendienteDerechos`, `TitularDescendiente`, `DiscapacidadDerechos` y `DerechosMinimosNoSoportados`. El contrato general admite hechos de 2012–2026, 17 territorios reales comunes, modalidad individual y cierre a 31 de diciembre del mismo ejercicio, sin ascendientes ni fallecimientos. `DerechosMinimos2025` queda como esquema/tipo obsoleto restringido a Madrid 2025; delega en la misma validación y cálculo. Los territorios forales o desconocidos se rechazan explícitamente antes de indexar tablas.

La API anual familiar calcula 2012–2026 con los parámetros estatales/autonómicos existentes de cada ejercicio. Las cuantías estatales anteriores a 2015 son distintas: dos hijos compartidos producen 1.938 EUR para cada padre en 2012–2014 y 2.550 desde 2015. Antes de 2015 se exige convivencia declarada (incluida su asimilación legal por internamiento dependiente); la mera dependencia económica no concede mínimo. Desde 2015 se asimila dependencia, salvo especialidad de alimentos. La custodia compartida permite reparto entre titulares con derecho; la exclusiva no reparte por sí sola a un pagador judicial sin custodia. No se admiten porcentajes libres.

2026 conecta el contrato familiar con `MINIMOS_ESTATALES_2026` (arts.57–61 sin reforma de cuantías en la fuente BOE de 4/11/2026) y con mínimos y escalas autonómicos B2026. Se admiten los 17 territorios comunes por la API canónica anual; las cuotas fijas oficiales se consumen en la composición común. La entrada efectiva familiar conserva 2025; deducciones autonómicas 2026 soportadas: ninguna. El conjunto E+B cuenta con [revisión independiente favorable acotada](reforma-motor/bloque-e/revision-familia-2026/INFORME.md); su alcance parcial no equivale a una declaración completa.

`minimos/derechos.ts` exporta `validarDerechosMinimos`, `calcularDerechosMinimos`, `validarRentasAnualesDerechos` y `hayAlimentosPropiosSinMinimo`. `calcularDerechosMinimos(hechos, minimos, aritmetica?)` recibe los hechos completos y los parámetros seleccionados, y devuelve euros `Decimal` para contribuyente, descendientes, discapacidad, total y atribuciones por sujeto, orden, titulares y divisor. El tercer argumento opcional es un constructor `Decimal`; por defecto crea un constructor local de 80 cifras. La composición pasa su constructor local para que el reparto y la suma respeten la precisión elegida (80 con derechos). No es por sí mismo una declaración. La ruta anual selecciona separadamente parámetros estatales y autonómicos.

Los hechos incluyen identificadores locales anónimos, nacimiento y edad al devengo, rentas no exentas, declaración propia, discapacidad y censo completo de titulares con grado, vínculo, convivencia/dependencia, custodia, residencia, rentas y alimentos. La conexión anual exige además conciliación de rentas del contribuyente antes de reducciones. Desde 2015, dos titulares del mismo grado con derecho al primer descendiente reciben 1.200 euros estatales cada uno; no 2.400 cada uno. Tres reciben 800. La discapacidad del descendiente comparte el divisor y exige elegibilidad.

Se cubren límites de 8.000 y 1.800 euros, edad de 25 años con excepción por discapacidad, incremento de menores de tres años y vínculos asimilados soportados, así como concurrencia de grados acotada. Se rechazan, con motivo, fechas incoherentes, hechos incompletos, porcentajes manuales, ascendientes, fallecimientos, especialidades propias de alimentos pendientes, ciertos grafos y empates de orden, mayoría de edad en vínculos asimilados y concurrencia no soportada. Los tests `minimos-derechos.test.ts` contienen ejemplos completos. La matriz de cobertura y ejemplos están en [familia anual](reforma-motor/bloque-e/FAMILIA-ANUAL.md).

El mínimo del contribuyente y la cuantía de discapacidad se calculan mediante las mismas piezas monetarias que usa la ruta sin familiares. Las piezas monetarias no deciden elegibilidad familiar. No existen `FamiliarFiscal`, `obtenerMinimoDescendientes`, `obtenerMinimoAscendientes` ni los acumuladores de discapacidad de familiares basados solo en edad/discapacidad.

## Entrada anual con importes efectivos

`liquidarIrpfAnualExplicito` conserva los esquemas y contratos de `trabajo-anual/conexion-contrato.ts`. El contrato efectivo admite 2025 individual en los 17 territorios comunes, edad 18–150 y ausencia de discapacidad propia/otras especialidades. Con familiares exige `familiaresConDerechoMinimo: "segun-derechos"` y `derechosMinimos` completos, conciliados con los rendimientos efectivos antes del art.20. Sin derechos exige `"ninguno"`. Discapacidad de descendientes se recibe dentro de los derechos. Conserva las restricciones de los productores laboral, pensión y EDS. Empleo Madrid 2025 conserva su política de céntimos Open. Empleo Andalucía 2025 sin derechos familiares declarados cuantiza los gravámenes mediante una política separada, apoyada en una captura adicional; no cambia allí artículo 20 ni DA61. Los demás perfiles conservan precisión decimal hasta salida, sin afirmar contraste oficial universal. Véase [alcance andaluz](simuladores/c300/ANDALUCIA.md). No se sustituyen las cotizaciones efectivas por estimaciones. Los siete casos de Renta WEB Open 2025 y los ejemplos de 1.333,92 euros a ingresar y 321,18 euros a devolver mantienen sus expectativas y reservas. Véase [alcance salarial](DECLARACION-SALARIAL-2025.md).

El mismo contrato admite además un perfil histórico de empleo: Madrid 2018–2024,
individual, edad de 18 a 64 años, sin familiares, discapacidad, deducciones ni
otras especialidades, con devengo el 31 de diciembre del ejercicio. Aportes,
retenciones y conciliación deben declarar ese mismo año. Selecciona el artículo
20 y los parámetros anuales reales mediante la composición común; conserva
`decimal-hasta-salida` y excluye DA61. Su alcance de salida es
`individual-madrid-2018-a-2024-hechos-explicitos`. La
[revisión de la conexión](simuladores/revision-historico-api/INFORME.md)
comprueba admisión, rechazo y conservación de 2025; aún no acredita coincidencia
contra Open histórico. El perfil histórico no admite pensiones ni actividad.
Madrid 2018–2021 y 2023–2024 consume las cuotas fijas publicadas en devengos
ordinarios sin fallecimiento. La [integración revisada de esas series](datos-2012-2026/producto-series-historicas/INTEGRACION.md)
corrige 40 diferencias de céntimo reproducidas y conserva 2022 y las referencias
de 2025. Este contraste documental no sustituye la campaña Open histórica.

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

`SolicitudDeduccion` admite `tipo: "valenciana_hechos"`, con `contexto` y
`hechos: SolicitudValenciana2025`. `evaluarDeduccion` valida estrictamente esos
hechos y concilia ejercicio, territorio, contribuyente, modalidad y conjunto
exhaustivo de declarantes antes de llamar al evaluador valenciano. Conserva
`calculo_parcial` y sus reservas; `totalDeduccionesEvaluadas` rechaza parciales
y detecta el mismo código repetido, incluida su mezcla con consignaciones.
`componerDeduccionesValencianas2025` ofrece una composición individual ordinaria
anterior a cuota: bases únicas, libro de cantidades, elecciones y orden explícito
para el límite conjunto del 30 %, con los resultados y reservas por código.
Rechazos y exclusiones aplicadas impiden emitir un total. Cuota y arrastres quedan
identificados y separados, sin consumirse. Véase [contrato y límites](deducciones-2025/VALENCIANA-COMPOSICION.md).
No se activa una deducción genérica ni una suma automática en la liquidación anual. Véanse [hechos y alcance](deducciones-2025/VALENCIANA-EVALUADORES.md)
y [correcciones de la revisión](deducciones-2025/revisiones/formulas-producto-20261104/CORRECCIONES.md).

Madrid (nacimiento) y Murcia (guardería), ejercicio 2025, usan el mismo evaluador de contratos tanto desde `evaluarDeduccion` como desde `evaluarHechosAuxiliar2025` y `calcularDeduccionesAutonomicasAplicadas`. `ContextoDeduccion.declarantes` identifica exhaustivamente a los declarantes en conjunta: lista no vacía, sin duplicados y con la referencia `contribuyente` incluida. Omitirla en la API directa conjunta devuelve `no_soportado`. En hechos auxiliares la lista obligatoria `declarantes` se propaga íntegra al contexto; si también figura en el contexto ambas deben coincidir. El orden y la elección de referencia dentro de la unidad no cambian la cuantía.

En conjunta se incluyen los derechos de los declarantes, sin sustituir la referencia por un titular. Progenitores o titulares externos a la unidad provocan rechazo explícito, incluidos los conjuntos mixtos de titulares internos y externos. En individual se conserva el reparto entre todos los titulares, aunque presenten declaraciones separadas. Murcia aplica el máximo de 1.000 euros por hijo antes del reparto individual; Madrid conserva ventana temporal, historial de bases, multiplicidad y redondeo.

El adaptador numérico admite un ámbito con identidad de referencia, modalidad y declarantes; cuando se aportan, los contrasta con los hechos y rechaza discrepancias. Una lista de declarantes es una afirmación externa exhaustiva: esta API no acredita parentesco, convivencia ni elegibilidad jurídica. Los resultados continúan siendo cálculos parciales, con aceptación fiscal pendiente. No amplían por sí mismas el contrato familiar. Mínimos anuales y retenciones tienen los alcances distintos descritos arriba.

## Escalas y exportación retiradas

La selección de 2025 para Aragón, Asturias, Galicia y Castilla y León consume
las 27 filas de cuotas fijas oficiales, además de sus tipos marginales. El
[cotejo documental y su integración](datos-2012-2026/producto-escalas2025/INTEGRACION.md)
conservan las diferencias anteriores y las pruebas de frontera. Este cambio se
limita al cierre ordinario de 2025; no amplía cobertura a fallecimientos.

Se eliminan `calcularCuotaPorEscalaGeneral`, `calcularDesgloseCuotaPorEscalaGeneral`, `obtenerTramosIrpfLegacy` y sus cuatro tablas combinadas. El cálculo utiliza `calcularCuotaPorEscala` y `calcularDesgloseCuotaPorEscala` con los parámetros del selector territorial y las cuotas publicadas cuando corresponda. No hay una API equivalente sin ámbito que pueda devolver la tarifa truncada.

Se retira `construirTablaControlTramosIrpfCompatible` y la hoja `CONTROL_TRAMOS_IRPF` de la exportación corriente. Los controles históricos permanecen como evidencia; no se regeneran con código incorrecto.

El escenario `simulada-estatal`, cuando duplica la parte estatal, deriva sus tipos de ese mismo selector. Desde 2021 su tipo simulado final pasa de 47 % a 49 % sobre el exceso de 300.000 euros. Es una simulación; no representa la cuota de una comunidad real ni amplía los ejercicios o situaciones admitidos.

## Contrato de composición vigente (4 de noviembre de 2026)

Los adaptadores públicos conservan contratos distintos para hechos distintos. El núcleo interno `liquidacion/composicion-anual.ts` recibe `EntradaComposicionAnual`: `ambito` (ejercicio, territorio, fecha de fallecimiento, contribuyente y derechos), bases general/ahorro integradas en euros `Decimal`, rentas antes de reducciones para conciliar derechos, parámetros estatales y deducciones autonómicas declaradas en céntimos. `cotizaciones.naturaleza` distingue `efectivas` y `estimadas-perfil-uniforme`; `trabajador` conserva el importe decimal recibido como procedencia, ya deducido por el productor de rendimientos. El núcleo no lo vuelve a restar. En actividad incluye RETA ya consumida por el aporte. Esta API interna presupone la admisión de cada productor; no debe exponerse directamente a formularios.

`politica` declara `decimal-hasta-salida`, `open-empleo-madrid-2025` u `open-cuotas-empleo-andalucia-2025`; `precision` declara 20 u 80 cifras significativas de composición, según el productor (80 también en la ruta analítica con derechos familiares). Son políticas monetarias, no algoritmos fiscales alternativos. El constructor local se propaga a escalas, cuotas fijas, remanentes del ahorro y reparto de mínimos antes de operar; no se cambia `Decimal.precision` global ni se recuperan cifras ya perdidas en la entrada. Los helpers de escala y ahorro aceptan `aritmetica?: Decimal.Constructor`, con el constructor global como valor predeterminado para los demás consumidores. Cada política Open se rechaza fuera de su territorio y ejercicio o con cotización estimada; la andaluza rechaza además derechos familiares declarados. El núcleo selecciona escalas, calcula derechos estatales y autonómicos, gravámenes y mínimos, ahorro, límite autonómico de deducciones, cuota líquida y, cuando el productor acredita servicios laborales, DA61 y cuota posterior. La política de Madrid cuantiza cada gravamen y DA61 antes de restar. La andaluza cuantiza los gravámenes y conserva DA61 sin nueva cuantización: la captura no discrimina esa deducción. En artículo 20, el núcleo comparte una sola fórmula por tramo y ofrece, para empleo Madrid 2025, compatibilidad binaria observada para íntegro y gastos a–e entre 0 y 1.000.000 EUR; fuera de esa cota técnica conserva Decimal. El adaptador limita por saldo positivo y cuantiza el importe, sin duplicar la fórmula. Esta compatibilidad se apoya en capturas concretas y no acredita el algoritmo interno del servidor; véase [artículo 20 y C300](simuladores/c300/ART20.md). Los perfiles pensión y actividad conservan precisión hasta salida y excluyen DA61. No se deduce DA61 automáticamente de un bruto del perfil analítico, que no acredita la calificación efectiva requerida.

`liquidarPagosAnuales` resta retenciones y pagos una vez, en la unidad y etapa monetaria recibidas. En el perfil técnico se aplica a la cuota ya liquidada a céntimos; en el efectivo a euros decimales y después se presenta a dos decimales. Los adaptadores solo preparan rendimientos/bases según su dominio y proyectan resultados y rastros. No recalculan los mínimos ni los gravámenes.

| Entrada pública | Unidades / discriminantes | Resultado y uso |
| --- | --- | --- |
| `liquidarIrpfAnual(caso, { modo: "canonico" })` | Enteros `Centimos`; `anio`, `comunidadAutonoma`; `situacionFamiliar.tipo: "individual"`; cotización uniforme estimada | `LiquidacionIrpfAnualCalculada`; bases, cotizaciones, cuotas y diferencial en céntimos; análisis, servicios y derechos consumen esta salida |
| `liquidarIrpfAnualConDerechos(caso)` | Mismo caso, `derechosMinimos` completo obligatorio | Misma salida y composición, sin cuota familiar alternativa |
| `liquidarIrpfAnualExplicito(caso)` | `CasoFiscalAnualExplicito`, `perfil: "solo-trabajo"` o `"solo-actividad-eds"`; importes aportados como texto EUR con hasta dos decimales, nunca `number` | `_tag: "LiquidacionIrpfAnualExplicitaCalculada"`; importes calculados como texto decimal EUR, `cuotaDiferencialPresentada` a dos decimales; `aceptacionFiscal: "pendiente"` |

La entrada efectiva exige todos los discriminantes de `conexion-contrato.ts`: residencia anual, devengo, modalidad, ausencia de otras rentas y discapacidad propia, hechos familiares según el marcador declarado, reducciones de base, saldos, rentas extranjeras y especialidades. El empleo exige rendimientos laborales/estatutarios disjuntos, gastos acreditados y cotizaciones `clase: "efectivas"`; en 2025, pensión sola se admite sin DA61 y sin mezclarla con empleo. `solo-actividad-eds`, limitado a 2025, consume `CasoActividad2025` con los rechazos del adaptador; amortizaciones y discapacidad siguen fuera del anual. No se admiten importes estimados en esta entrada efectiva ni se rellenan hechos ausentes. Retenciones efectivas llevan ejercicio, identidad de operación única, procedencia e importe.

El perfil técnico conserva parámetros territoriales parciales 2012–2026 y el escenario `simulada-estatal` 2012–2026; esto no acredita declaraciones completas ni la procedencia universal de las tablas históricas. 2026 real admite mínimos y escalas vigentes al corte 4/11/2026, con cuotas fijas oficiales consumidas por el núcleo común. Los derechos familiares están conectados en 2012–2026 para los 17 territorios comunes mediante `liquidarIrpfAnualConDerechos(caso)` (y `liquidarIrpfAnual` con derechos). En 2026 la lista de deducciones autonómicas soportadas está vacía; no se heredan las de 2025. Véase [B2026](reforma-motor/bloque-e/B2026.md). Ascendientes, fallecimientos y hechos insuficientes conservan rechazo. El contrato efectivo admite familia 2025 en esos territorios; retenciones conserva Madrid 2025. No se abre ninguna puerta de actividad o aceptación fiscal general.

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

## Proyección de componentes anuales para contraste C

`liquidarIrpfAnualExplicito` devuelve además `componentesCuota`, con `unidad:
"EUR"` y seis textos decimales sin redondeo adicional, con estas casillas de
2025: `gravamenEstatal` (0528),
`gravamenAutonomico` (0529), `gravamenMinimoEstatal` (0530),
`gravamenMinimoAutonomico` (0531), `cuotaEstatal` (0532) y `cuotaAutonomica`
(0533). Son los valores ya calculados por `componerLiquidacionAnual`: gravámenes
sobre base general, gravámenes del mínimo y cuotas generales tras mínimo,
respectivamente. No incluyen DA61 ni retenciones. No se reconstruyen desde el
rastro ni se introduce una fórmula de cuota.

En empleo Madrid 2025 se mantiene la cuantización Open ya vigente; la nueva
política andaluza cuantiza los gravámenes dentro de su alcance declarado. En los
demás perfiles admitidos se conserva su precisión existente. La proyección consume el alcance familiar y territorial vigente descrito arriba. Con los ocho escalares previos permite
cotejar catorce casillas; una omisión oficial permanece ausencia. La coincidencia
monetaria no acredita todos los hechos de la entrada ni aceptación fiscal.
La campaña histórica debe comprobar la correspondencia de casillas de cada
ejercicio; una casilla inexistente o ausente no se convierte en cero.
