# API del motor

Se retiran la selección legacy, los helpers familiares insuficientes y la reconstrucción salarial paralela de la cuota. `modo: "canonico"` es el único valor admitido; otro valor se rechaza también en JavaScript. El análisis salarial consume la liquidación anual. Las entradas analítica y efectiva normalizan hechos y consumen `componerLiquidacionAnual`; no seleccionan dos fórmulas de liquidación.

## Declaración anual

`lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts` exporta `liquidarIrpfAnual(caso: CasoFiscalAnual, contexto: ContextoLiquidacionIrpf)`, `LiquidacionIrpfAnual` y su `layer`, `liquidarIrpfAnualConDerechos` y la reexportación `liquidarIrpfAnualExplicito`. Los tipos públicos incluyen `LiquidacionIrpfAnualCalculada`, `ResultadoNoSoportado`, `LiquidarIrpfAnualError`, `ContextoLiquidacionIrpf`.

Las notas anteriores del [catálogo de deducciones](deducciones-2025/CAMBIOS-PARA-REDISENO.md) describen entregas existentes, pero no obligan a conservar su API. El rediseño debe tomar como referencia el contrato vigente de esta página.

El catálogo integrado conserva las colecciones regionales, pero Comunitat Valenciana, Galicia y La Rioja ya no exponen constructores o exportaciones intermedias para cada deducción. Sus descripciones expresan las condiciones documentadas; no constituyen todavía evaluadores automáticos completos. Las 40 fórmulas valencianas cuentan ahora con evaluadores parciales por hechos y pruebas revisadas. La composición individual resuelve límites e incompatibilidades declarados y `aplicarCuotaConjuntaValenciana2025` consume una cuota común y saldos históricos según orden explícito. Esta aplicación conserva su alcance individual y parcial y la acreditación pendiente de las fichas. La ruta anual salarial valenciana de 2025 ya la consume con las condiciones del apartado «Deducciones valencianas en la ruta anual». Véase [contrato de cuota y saldos](deducciones-2025/VALENCIANA-CUOTA-CONJUNTA.md).
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

`minimos/derechos-contrato.ts` exporta `DerechosMinimosAnuales`, `DescendienteDerechos`, `TitularDescendiente`, `DiscapacidadDerechos` y `DerechosMinimosNoSoportados`. El perfil de descendientes admite hechos de 2012–2026, 17 territorios reales comunes, modalidad individual y cierre a 31 de diciembre del mismo ejercicio, sin fallecimientos. La rama de ascendientes se limita a 2025 en Madrid, Castilla-La Mancha y Comunitat Valenciana, con el censo adicional descrito a continuación. `DerechosMinimos2025` queda como esquema/tipo obsoleto restringido a Madrid 2025; delega en la misma validación y cálculo. Los territorios forales o desconocidos se rechazan explícitamente antes de indexar tablas.

La API anual familiar calcula 2012–2026 con los parámetros estatales/autonómicos existentes de cada ejercicio. Las cuantías estatales anteriores a 2015 son distintas: dos hijos compartidos producen 1.938 EUR para cada padre en 2012–2014 y 2.550 desde 2015. Antes de 2015 se exige convivencia declarada (incluida su asimilación legal por internamiento dependiente); la mera dependencia económica no concede mínimo. Desde 2015 se asimila dependencia, salvo especialidad de alimentos. La custodia compartida permite reparto entre titulares con derecho; la exclusiva no reparte por sí sola a un pagador judicial sin custodia. No se admiten porcentajes libres.

2026 conecta el contrato familiar con `MINIMOS_ESTATALES_2026` (arts.57–61 sin reforma de cuantías en la fuente BOE de 4/11/2026) y con mínimos y escalas autonómicos B2026. Se admiten los 17 territorios comunes por la API canónica anual; las cuotas fijas oficiales se consumen en la composición común. La entrada efectiva familiar conserva 2025; deducciones autonómicas 2026 soportadas: ninguna. El conjunto E+B cuenta con [revisión independiente favorable acotada](reforma-motor/bloque-e/revision-familia-2026/INFORME.md); su alcance parcial no equivale a una declaración completa.

`minimos/derechos.ts` exporta `validarDerechosMinimos`, `calcularDerechosMinimos`, `validarRentasAnualesDerechos` y `hayAlimentosPropiosSinMinimo`. `calcularDerechosMinimos(hechos, minimos, aritmetica?)` recibe los hechos completos y los parámetros seleccionados, y devuelve euros `Decimal` para contribuyente, descendientes, ascendientes, discapacidad, total y atribuciones por sujeto, orden, titulares y divisor. El tercer argumento opcional es un constructor `Decimal`; por defecto crea un constructor local de 80 cifras. La composición pasa su constructor local para que el reparto y la suma respeten la precisión elegida (80 con derechos). No es por sí mismo una declaración. La ruta anual selecciona separadamente parámetros estatales y autonómicos.

Los hechos incluyen identificadores locales anónimos, nacimiento y edad al devengo, rentas no exentas, declaración propia, discapacidad y censo completo de titulares con grado, vínculo, convivencia/dependencia, custodia, residencia, rentas y alimentos. La conexión anual exige además conciliación de rentas del contribuyente antes de reducciones. Desde 2015, dos titulares del mismo grado con derecho al primer descendiente reciben 1.200 euros estatales cada uno; no 2.400 cada uno. Tres reciben 800. La discapacidad del descendiente comparte el divisor y exige elegibilidad.

Se cubren límites de 8.000 y 1.800 euros, edad de 25 años con excepción por discapacidad, incremento de menores de tres años y vínculos asimilados soportados, así como concurrencia de grados acotada. Se rechazan, con motivo, fechas incoherentes, hechos incompletos, porcentajes manuales, ascendientes fuera de la rama acotada de 2025, fallecimientos, especialidades propias de alimentos pendientes, ciertos grafos y empates de orden, mayoría de edad en vínculos asimilados y concurrencia no soportada. Los tests `minimos-derechos.test.ts` contienen ejemplos completos. La matriz de cobertura y ejemplos están en [familia anual](reforma-motor/bloque-e/FAMILIA-ANUAL.md).

El mínimo del contribuyente y la cuantía de discapacidad se calculan mediante las mismas piezas monetarias que usa la ruta sin familiares. Las piezas monetarias no deciden elegibilidad familiar. No existen `FamiliarFiscal`, `obtenerMinimoDescendientes`, `obtenerMinimoAscendientes` ni los acumuladores de discapacidad de familiares basados solo en edad/discapacidad.

## Ascendientes de 2025: mínimos y deducciones territoriales

En Madrid, Castilla-La Mancha y Comunitat Valenciana, `derechosMinimos.ascendientes` admite el censo `AscendienteAnual2025[]`, con `ascendientesCompletos: true`. La ausencia mantiene el contrato anterior. Ambas API exigen identificación, fecha de nacimiento, discapacidad, situación al devengo, declaración y economía completa del ascendiente; cada titular aporta grado, vínculo, residencia, economía y períodos de convivencia o internamiento. No se reciben cuotas, bases ni divisores elegidos por el cliente.

`producirAscendientes2025` deriva la renta y los titulares con derecho. Un mismo titular debe conservar su economía, residencia IRPF y modalidad de declaración entre relaciones; una contradicción devuelve `ResultadoNoSoportado` antes de publicar cuota. Grado, convivencia, vínculo y soporte pueden variar por relación. Las pruebas `ascendientes-conciliacion-titular.test.ts` conservan los seis casos originales del defecto H1 y los controles coherentes.

El libro alimenta los mínimos estatal y autonómico en la composición común. También alimenta `madrid_cuidado_ascendientes` por `F-ampliado`, `clm_cuidado_ascendientes_mayores_75` por la solicitud CLM y `valenciana_ascendientes_mayores_discapacidad` por el contrato valenciano. La deducción territorial se consume una vez en el libro de cuota. Sus censos y referencias deben conciliar con los hechos anuales; los divisores del mínimo y de cada deducción no se presumen iguales.

El perfil excluye fallecimiento, conjunta, mezcla simultánea de censos de ascendientes y descendientes y las clases económicas o grafos no representados. Esos rechazos expresan límites de cobertura. La revisión de ascendientes y el contraste H1 son acotados; siguen documentadas H2 —componentes económicos distintos con el mismo neto— y H3 —situación de devengo regional contradictoria—, sin daño monetario independiente aislado en esa revisión. Los ejemplos completos están en `ascendientes-tres-territorios-2025.test.ts`; no se habilitan puertas fiscales.

## Bases familiares y donativos múltiples de 2025

`basesFamiliares2025` recibe hechos de las personas, vínculos y rentas, y produce las bases de los familiares necesarios para las deducciones. No recibe bases fiscales calculadas por el cliente ni suma esas rentas a la declaración individual del contribuyente. Distingue la unidad familiar del artículo 82 de los titulares con derecho al mínimo. La ausencia de rentas requiere un censo expreso.

El libro conecta las ramas representadas de Madrid y la deducción valenciana por dos o más descendientes. Admite empleo sin gasto por discapacidad activa, pensión ordinaria homogénea y ausencia expresa de rentas; las otras clases, mezclas, saldos y situaciones no representadas conservan rechazo concreto. El libro rechaza la discapacidad activa ajena hasta representar y conciliar sus periodos con los hechos de mínimos. No supone que el grado deba coincidir siempre durante el trabajo y al devengo, ni sustituye la rama pendiente por una renta cero. El núcleo laboral existente calcula los gastos y la reducción de trabajo. Los derechos al mínimo se concilian con sus hechos; el libro económico no los concede por sí solo.

En `deduccionesTerritoriales2025.donativosEstatales2025`, varias operaciones se concilian por entidad y NIF. `prioridad68_3` expresa el orden completo de las operaciones cuando el contrato lo requiere. El límite conjunto de base y el primer tramo de 250 euros se consumen una sola vez; generación, aplicación y remanentes se conservan separados. Las dos mitades de cuota no se transfieren entre sí.

Las ramas de Cantabria, Murcia y Madrid mantienen sus respectivos límites y reglas de concurrencia. La atribución regional que depende de una base estatal con cuota insuficiente sigue rechazada donde no se ha fijado el criterio; tampoco se habilitan varias entidades con tipo incrementado, nuevas clases de entidad o donativos en especie. Los [ejemplos y condiciones del contrato](deducciones-2025/p5-multiples-e47-20261105/CONTRATO.md) delimitan el perfil.

Las políticas monetarias de las API se conservan. En empleo de Madrid, la entrada efectiva cuantiza los gravámenes conforme a la política Open documentada; la canónica mantiene Decimal hasta la salida. Las revisiones de familia y donativos conservan sus diferencias de igualdad exacta anteriores a estas deducciones. No se declara equivalencia exacta de todas las cuotas entre políticas.

## Cónyuge o pareja con discapacidad en Andalucía

La solicitud `A40` con código `andalucia_conyuge_pareja_discapacidad` aporta vínculo civil o registro público, vigencia, identificación, reconocimiento de discapacidad y declaración y economía de la pareja. No requiere hijos ni una unidad familiar del artículo 82 para representar el vínculo. Las bases propias se obtienen de la composición anual, antes de reducciones de base.

El perfil conectado es individual, ordinario de 2025 y con pareja que no presenta declaración, sin `basesFamiliares2025`: el libro familiar está limitado a Madrid y Valencia. La economía civil andaluza puede representar discapacidad activa con sus propias comprobaciones de grado y vigencia. La conjunta, otras rentas no representadas, fallecimiento, residencia parcial y las demás ramas delimitadas conservan rechazo específico. La solicitud no recibe el importe de una deducción aplicada por la pareja ni una base ajena calculada externamente. La generación pasa al consumo común de cuota; el adaptador no vuelve a restarla.

La revisión andaluza es favorable dentro de ese perfil. La reserva temporal del libro familiar queda delimitada por separado; no se declara cierre universal de las deducciones.

## Entrada anual con importes efectivos

`liquidarIrpfAnualExplicito` conserva los esquemas y contratos de `trabajo-anual/conexion-contrato.ts`. El contrato efectivo admite 2025 individual en los 17 territorios comunes, edad 18–150 y ausencia de discapacidad propia/otras especialidades. Con familiares exige `familiaresConDerechoMinimo: "segun-derechos"` y `derechosMinimos` completos, conciliados con los rendimientos efectivos antes del art.20. Sin derechos exige `"ninguno"`. Discapacidad de descendientes se recibe dentro de los derechos. Conserva las restricciones de los productores laboral, pensión y EDS. Empleo Madrid 2025 conserva su política de céntimos Open. Empleo Andalucía 2025 sin derechos familiares declarados cuantiza los gravámenes mediante una política separada, apoyada en una captura adicional; no cambia allí artículo 20 ni DA61. Empleo efectivo positivo sin derechos familiares en Catalunya, Comunitat Valenciana, Galicia, Canarias y Aragón usa igualmente cuantización por gravamen, en una política territorial separada. Cinco capturas sustentan esos resultados, sin probar universalmente el desempate de medio céntimo. Los demás perfiles conservan precisión decimal hasta salida. Véanse [alcance andaluz](simuladores/c300/ANDALUCIA.md) y [variantes territoriales](simuladores/c300/VALIDACION-VARIANTES-20261105.md). No se sustituyen las cotizaciones efectivas por estimaciones. Los siete casos de Renta WEB Open 2025 y los ejemplos de 1.333,92 euros a ingresar y 321,18 euros a devolver mantienen sus expectativas y reservas. Véase [alcance salarial](DECLARACION-SALARIAL-2025.md).

El mismo contrato admite además un perfil histórico de empleo: Madrid 2018–2024,
individual, edad de 18 a 64 años, sin familiares, discapacidad, deducciones ni
otras especialidades, con devengo el 31 de diciembre del ejercicio. Aportes,
retenciones y conciliación deben declarar ese mismo año. Selecciona el artículo
20 y los parámetros anuales reales mediante la composición común. Los cuatro
gravámenes se cuantizan a céntimos antes de restar mínimos; el artículo 20
conserva su precisión histórica y DA61 no aplica. Su alcance de salida es
`individual-madrid-2018-a-2024-hechos-explicitos`. La
[revisión de la conexión](simuladores/revision-historico-api/INFORME.md)
comprueba admisión, rechazo y conservación de 2025. La
[revisión de cuotas históricas](simuladores/historico/REVISION-CUOTAS.md)
corrobora las 83 casillas comparables de siete pilotos, con catorce mapeos
reservados y una ausencia; la campaña ampliada sigue pendiente. El perfil
histórico no admite pensiones ni actividad. Esta evidencia no acredita un
redondeo fiscal universal ni habilita el ámbito excluido.
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

`politica` declara `decimal-hasta-salida`, `open-empleo-madrid-2025` u `open-cuotas-empleo-andalucia-2025`; `precision` declara 20 u 80 cifras significativas de composición, según el productor (80 también en la ruta analítica con derechos familiares). Son políticas monetarias, no algoritmos fiscales alternativos. El constructor local se propaga a escalas, cuotas fijas, remanentes del ahorro y reparto de mínimos antes de operar; no se cambia `Decimal.precision` global ni se recuperan cifras ya perdidas en la entrada. Los helpers de escala y ahorro aceptan `aritmetica?: Decimal.Constructor`, con el constructor global como valor predeterminado para los demás consumidores. Cada política Open se rechaza fuera de su territorio y ejercicio o con cotización estimada; la andaluza rechaza además derechos familiares declarados. El núcleo selecciona escalas, calcula derechos estatales y autonómicos, gravámenes y mínimos, ahorro, límite autonómico de deducciones, cuota líquida y, cuando el productor acredita servicios laborales, DA61 y cuota posterior. La política de Madrid cuantiza cada gravamen y DA61 antes de restar. La andaluza y la territorial de cinco comunidades cuantizan los gravámenes y conservan DA61 sin nueva cuantización: esas capturas no discriminan una política adicional de esa deducción. En artículo 20, el núcleo comparte una sola fórmula por tramo y ofrece, para empleo Madrid 2025, compatibilidad binaria observada para íntegro y gastos a–e entre 0 y 1.000.000 EUR; fuera de esa cota técnica conserva Decimal. El adaptador limita por saldo positivo y cuantiza el importe, sin duplicar la fórmula. Esta compatibilidad se apoya en capturas concretas y no acredita el algoritmo interno del servidor; véase [artículo 20 y C300](simuladores/c300/ART20.md). Los perfiles pensión y actividad conservan precisión hasta salida y excluyen DA61. No se deduce DA61 automáticamente de un bruto del perfil analítico, que no acredita la calificación efectiva requerida.

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
política andaluza y la territorial de cinco comunidades cuantizan los gravámenes dentro de sus alcances declarados. En los
demás perfiles admitidos se conserva su precisión existente. La proyección consume el alcance familiar y territorial vigente descrito arriba. Con los ocho escalares previos permite
cotejar catorce casillas; una omisión oficial permanece ausencia. La coincidencia
monetaria no acredita todos los hechos de la entrada ni aceptación fiscal.
La campaña histórica debe comprobar la correspondencia de casillas de cada
ejercicio; una casilla inexistente o ausente no se convierte en cero.

<!-- valenciana-anual-2025:start -->
## Deducciones valencianas en la ruta anual

La solicitud `deduccionesValencianas2025` y `contribuyenteId` conectan hechos y
saldos con la composición anual individual ordinaria de 2025. La entrada efectiva
usa `deducciones: "valencianas-por-hechos-y-da61"`; conserva el discriminante previo
sin solicitud y el contrato histórico sin deducciones. Las dos entradas consumen
el mismo núcleo, que deriva bases y cuota autonómica disponible, aplica una sola
vez la composición/cuota compartida revisada y conserva los pagos finales únicos.
No recibe cuota ni bases externas, no consume el total parcial como agregado ni
mezcla consignaciones. Conserva resultado detallado, motivos y reservas en salida
y rastro; `aceptacionFiscal` permanece pendiente. Los importes de los movimientos
y totales de esta conexión son textos decimales EUR exactos; la cuota interna no
se trunca a céntimos. El aplicador aislado conserva su contrato numérico anterior.

El [contrato y límites de esta conexión](deducciones-2025/VALENCIANA-ANUAL.md)
especifica el rechazo acotado de bases no representables y de la deducción de dos
o más descendientes sin bases familiares exhaustivas. Las afirmaciones anteriores
sobre separación anual describen la API parcial aislada; esta sección delimita
la nueva conexión por hechos. No amplía 2026, conjunta ni las ramas fiscales
pendientes, y no cierra las 351 fichas.
<!-- valenciana-anual-2025:end -->

Los [evaluadores territoriales por hechos de 2025](deducciones-2025/producto-territorial-20261105/INTEGRACION.md)
añaden 55 códigos parciales revisados. Sus contratos aislados conservan las reservas y el importe anterior a cuota.

## Conexión territorial anual 2025 (parcial y revisada)

Las dos entradas anuales admiten `deduccionesTerritoriales2025`, una unión cerrada de hechos de las 55 altas territoriales iniciales y las ampliaciones A40, B37, E38, D51, C36, F y Aragón2 descritas abajo. La efectiva requiere el discriminante `territoriales-por-hechos-y-da61`. La composición deriva magnitudes y consume cuota autonómica una sola vez desde salidas exactas; conserva el resultado condicionado y sus reservas. No se permiten bases o cuotas externas ni mezcla con consignaciones o la solicitud valenciana anterior.

La edad y discapacidad declaradas deben coincidir con el caso anual. Los familiares y el conjunto completo de titulares se vinculan a la atribución efectiva calculada para cada sujeto; la presencia en el censo no basta. Los eventos de nacimiento o adopción se contrastan con los vínculos y fechas ya conocidos. La conexión rechaza el reparto adoptivo mixto mientras no distinga los titulares de esa deducción de los del mínimo. En Extremadura, los ingresos para trabajo dependiente proceden del cálculo anual; los duplicados introducidos en los hechos no sustituyen esos ingresos.

El [contrato y sus límites](deducciones-2025/conexion-anual-territorial-20261105/CONTRATO.md) delimita las ramas admitidas. La revisión detectó H1–H5; sus correcciones y el contraste de los hallazgos graves están integrados, con 41 discriminantes permanentes. No actualiza las matrices auditadas ni acredita todas las ramas.


## Ampliaciones A40 y B37 en la misma ruta anual

`lote: "A40"` añade contratos de hechos para cuarenta códigos de Andalucía, Aragón y Catalunya. Treinta y ocho admiten ramas parciales. Deriva bases, componentes del mínimo estatal y rendimientos desde la composición. Los censos monetarios concilian con el mínimo efectivo del mismo sujeto y no pueden omitir convivientes/adoptantes ya representados. La revisión independiente y las correcciones H1/H2 están validadas; se mantienen los rechazos de cónyuge/pareja con discapacidad, personas o pagadores no representados y repartos no finitos. Véase [contrato A40](deducciones-2025/ampliacion-a-anual-20261105/CONTRATO.md).

`lote: "B-ampliado"` añade los 37 contratos de Asturias y Cantabria. La preparación se hace una vez por sublote; los pagos y referencias documentales se concilian entre lotes y las elecciones se derivan por sujeto u objeto. El único libro de cuota aplica las prioridades declaradas y devuelve las aplicaciones en el orden de los códigos recibidos. No se aceptan bases, cuotas, tipos ni elecciones calculadas por el cliente.

Los tipos generales proceden de las cuotas tras mínimo y la base liquidable general, con dos decimales fiscales sin redondeo. La cuota de trabajo/actividad se atribuye sólo cuando la procedencia exclusiva está demostrada por el perfil de la API; no se añade la cuota del ahorro. La renta monoparental sin cambios y los rendimientos propios para ayuda doméstica proceden de la misma anual. Las bases estatales de donativos se obtienen mediante el productor específico descrito más adelante, dentro de sus combinaciones admitidas. La cuota general mixta no representada y la renta del período tras cambio familiar mantienen rechazos concretos sin importe por productores ausentes. ELA dispone de la rama identificada que se describe a continuación. Véanse [contrato B37](deducciones-2025/b-conexion-completa-20261105/CONTRATO.md) y [revisión independiente](deducciones-2025/b-conexion-completa-20261105/REVISION.md).

Ambas ampliaciones conservan las dos API, magnitudes internas de hasta 80 decimales, fracciones exactas y un solo consumo de cuota. Los hechos monetarios aportados permanecen limitados a dos decimales. Las fórmulas aisladas de otros lotes no se suman automáticamente a la anual: sus conexiones se publican sólo tras validación y revisión. Las limitaciones de sujetos, historia y hechos externos siguen explícitas; este contrato no certifica una declaración completa ni las 351 fichas.


## Dos contratos aragoneses adicionales

El módulo `aragon-dos-codigos-2025` incorpora el cálculo parcial de inversión en entidades nuevas, con asignación estatal/autonómica y rechazo de reinversión positiva no coordinada. El contrato de arrendamiento social expresa la petición de cuota atribuida y su fracción 3/10; no recibe una cuota externa ni produce una deducción cuando falta el productor anual. Su [revisión independiente](deducciones-2025/producto-aragon-dos-codigos/REVISION.md) es favorable dentro del alcance declarado. `lote: "A-aragon-dos"` conecta ambas API: inversión con elección estatal cero explícita y censo completo entra en el único libro de cuota; la elección estatal positiva dispone del productor68.1 descrito más adelante y la reinversión conserva su rechazo tipado. La solicitud social fuera del perfil `aragon-social-mixto-2025` conserva la dependencia 3/10 sin importe; el perfil mixto acotado descrito a continuación dispone de productor anual. La [revisión de la conexión anual](deducciones-2025/producto-aragon-conexion-anual/REVISION-INDEPENDIENTE.md) es favorable acotada; no completa el punto 4.


## Arrendamiento social aragonés y trabajo en 2025

Las dos funciones anuales admiten `CasoAragonSocialMixto2025`, discriminado por `perfil: "aragon-social-mixto-2025"`. Es una entrada individual de Aragón 2025, edad de 18 a 64 años, sin familiares ni discapacidad, con trabajo o pensión ordinarios y un único inmueble identificado. Declara censo inmobiliario completo, titularidad, arrendamiento, gastos, trabajo, retenciones y solicitud territorial por hechos; no recibe rendimiento neto ni cuota atribuida del cliente.

El productor inmobiliario común y la composición anual calculan la renta mixta. La atribución de cuota de la deducción social usa el criterio operativo contrastado en cuatro observaciones oficiales, incluida la frontera de un céntimo; ese cotejo no autentica el acceso administrativo al programa. El resto de perfiles mantiene su rechazo concreto. La conexión no amplía otras deducciones combinadas, cotitularidad, períodos parciales ni derechos familiares. Los casos y límites ejecutables están en `aragon-social-mixto.test.ts` y `aragon-social-mixto.fixtures.ts`. El gestor debe tener identidad distinta del propietario y del arrendatario en este perfil de roles separados; esa validación no acredita por sí sola la habilitación administrativa. El productor inmobiliario compartido rechaza un período de gasto declarado inválido, invertido o con algún extremo fuera de 2025, antes de sumar su importe. Los gastos con atribución entre ejercicios requieren una rama específica; no se deducen íntegros por tener factura y pago en 2025. `aragon-m1-m2.test.ts` conserva las tres entradas originales de la revisión y los controles de devengo válidos.

## Ampliación E38 en la ruta anual

`lote: "E38"` añade los contratos de Galicia y La Rioja a las dos API y al mismo libro de cuota. Los contratos conservan ramas parciales y rechazos con el productor ausente identificado. Las conexiones de patrimonio y de ingresos identificados se describen en sus apartados específicos; la matriz inicial de la ampliación es un antecedente de esas conexiones. La entrada recibe hechos, fechas, identidades y pagos. Las bases imponibles general y del ahorro proceden de sus nodos anuales antes de limitar las bases liquidables, y la composición aporta el mínimo efectivo, el censo y la cuota. No se reciben esas magnitudes calculadas por el cliente.

El canal interno conserva hasta 80 cifras y céntimos racionales, con conversión única a euros al dispatcher. Las ayudas sin un programa de imputación representado y los libros sin renta familiar de 2024 continúan rechazados. Patrimonio P5a habilita sólo las dos ramas riojanas descritas más adelante; no produce la historia de vivienda ni las bases estatales de las otras ramas. Se conservan las suspensiones de 2025 y las restricciones de titularidad, alquiler, mecenazgo y arrastres. Véanse el [contrato de magnitudes](deducciones-2025/producto-e-anual/CONTRATO-MAGNITUDES.md), la [matriz de ramas](deducciones-2025/producto-e-anual/MATRIZ-38.json) y la [revisión independiente](deducciones-2025/producto-e-anual/REVISION.md).


## Ampliación D51 en la ruta anual

`lote: "D51"` conecta los contratos de Castilla-La Mancha, Castilla y León y Extremadura con las dos API. Sus 51 códigos tienen despacho específico y conservan rechazos por rama. La [matriz inicial](deducciones-2025/conexion-d51/matriz-51.json) se completa con los productores descritos más adelante; no es un recuento actualizado de ramas sin conexión. Bases imponibles, bases liquidables, mínimo y cuota se derivan de la composición. Los límites de base compartida de Castilla y León se consumen en la sesión del sublote y después se aplica el único libro de cuota, manteniendo las prioridades B.

No se aceptan bases, cuotas ni deducciones estatales calculadas por el cliente. Las ramas de historial de vivienda, renta exenta familiar y otras magnitudes sin productor se rechazan con causa identificada. Maternidad estatal se conecta mediante CYL81; las conexiones específicas posteriores de movilidad o de ingresos no habilitan los demás perfiles inmobiliarios, ayudas ni combinaciones. Se mantienen las condiciones de identidad, censo, reparto y fechas, y las correcciones H1–H3. La precisión local de trabajo-anual/calcular.ts pasa de 60 a 80 para gastos, artículo 80bis y DA61; los importes aportados conservan su formato previo. El contrato interno DA61 admite hasta 80 decimales calculados y rechaza 81. Véanse el [informe de conexión](deducciones-2025/conexion-d51/INFORME.md) y la [revisión independiente](deducciones-2025/conexion-d51/REVISION.md).


## Ampliación C36 en la ruta anual

`lote: "C36"` lleva 36 contratos de Canarias y Baleares al mismo dispatcher. Los códigos tienen ramas conectadas y rechazos por productor ausente. Las ampliaciones inmobiliarias descritas más adelante habilitan sólo sus perfiles y no la historia previa ni las restantes ramas del código. El cálculo usa bases, mínimos y cuotas internos, con precisión de 80 cifras. Antes del consumo común aplica los límites por código y el presupuesto canario compartido del 15%; conserva prioridad de nacimiento/adopción balear e incompatibilidades por sujeto y bien. Los pagos repetidos y los datos familiares contradictorios se rechazan.

Los históricos, las imputaciones inmobiliarias, las cuotas de otros miembros, la regularización de anticipos y las ayudas sin integración fiscal representada no se sustituyen por cero. La validación del autor pasa 402 pruebas; la primera revisión independiente anual detectó H1/H2, corregidos con sus tres rojos y dos rojos nuevos de API. El contraste C36 H1/H2 es favorable acotado, con sus pruebas y esperados intactos. La integración conjunta con Aragón pasa 1.342 pruebas, tipos/Effect y ambos linters. Véanse las [correcciones](deducciones-2025/c36-conexion-anual-20261105/CORRECCIONES-REVISION.md). Véanse el [contrato](deducciones-2025/c36-conexion-anual-20261105/CONTRATO.md) y el [informe de conexión](deducciones-2025/c36-conexion-anual-20261105/INFORME.md).

## Ampliación F en la ruta anual de Madrid y Murcia

`lote: "F-ampliado"` incorpora las ramas preparadas de Madrid y Murcia, con hechos cerrados, magnitudes anuales internas y un libro de aplicación único. El combinado contiene 36 ramas numéricas, cinco fórmulas condicionadas y diez contratos reutilizados. La recarga sin ayudas mantiene el 100% de base y un máximo de 4.000 EUR; el ahorro de agua mantiene el 20%, base máxima de 300 EUR y límite de 60 EUR dentro de sus condiciones documentadas.

El libro murciano aplica primero las deducciones sin arrastre, después vehículos, recarga y renovables. Los saldos nacidos en 2025 conservan titular, objeto, plazo y obligaciones posteriores. Un importe pendiente impide declarar completa la cuota posterior. Las bases ajenas, consumos históricos y ayudas sin conciliación siguen rechazados. Las dos API no aceptan cuotas, tipos ni asignaciones estatales calculadas por el cliente. La validación del autor pasa 182 pruebas F y 572 regresiones, con dos pendientes preexistentes; la primera revisión monetaria detectó R1–R3, corregidos por el integrador con sus 22 expectativas conservadas. El contraste R1–R3 es favorable acotado. La primera lectura normativa de las 41 ramas detectó N1–N4; el padre corrigió edad de acogimiento, cronología societaria, inicio de incentivos de vivienda y edad del ejercicio de adquisición. La fusión con Aragón pasa 1.342 pruebas, tipos/Effect y ambos linters. El contraste de las cuatro reparaciones graves es favorable acotado: 63 pruebas, incluidos 25 discriminantes propios; véanse las [correcciones N1–N4](deducciones-2025/producto-f-ampliacion-20261105/CORRECCIONES-N1-N4.md). Véanse las [correcciones](deducciones-2025/producto-f-ampliacion-20261105/CORRECCIONES-REVISION.md). Véanse el [contrato](deducciones-2025/producto-f-ampliacion-20261105/CONTRATO.md) y la [conexión anual](deducciones-2025/producto-f-ampliacion-20261105/CONEXION-ANUAL.md).


## Ingreso identificado y deducción ELA de Asturias 2025

La API canónica admite el censo opcional `ingresosIdentificados2025`. La efectiva añade el perfil `trabajo-y-ayudas-ela`, con `otrasRentas: "solo-ingresos-identificados"` y el censo obligatorio. Ambas incorporan los cobros reales conciliados con la resolución a las otras rentas del artículo 20 y a la base general una sola vez. El importe concedido no sustituye al cobrado. El libro de ingresos devuelve la atribución por ayuda; los tipos generales y la cuota disponible proceden de esa misma liquidación, sin recibir magnitudes fiscales calculadas por el cliente.

La rama se limita al programa personal Asturias ELA 2025 declarado como ganancia patrimonial no derivada de transmisión y no exenta. El censo comprueba identidad, fechas y duplicados representados; la autenticidad documental, clasificación fiscal y derecho externo siguen condicionados. Pérdidas, compensaciones, reducciones no atribuibles, conjunta y otros programas conservan rechazos explícitos. El ahorro positivo representado se admite sólo en la API canónica y no forma parte de los tipos generales. La deducción utiliza el libro común de cuota, sin doble aplicación ni arrastre inventado.

La validación del autor suma 1.312 pruebas y conserva dos TODO heredados; la primera revisión independiente pasa 193 pruebas, de las cuales 39 son propias. El dictamen es favorable con reservas y no acredita todas las ayudas por ELA. Véanse el [contrato](deducciones-2025/ela-ingreso-20261105/CONTRATO.md), la [precisión](deducciones-2025/ela-ingreso-20261105/PRECISION.md) y la [revisión](deducciones-2025/ela-ingreso-20261105/REVISION.md).


## Donativos estatales y maternidad en la composición anual de 2025
El sobre territorial admite `donativosEstatales2025`: hechos de una donación dineraria seleccionada bajo la Ley 49/2002, censo completo y elección por operación. El productor deriva bases y cuotas desde la anual; aplica la parte estatal y autonómica una vez antes de las deducciones territoriales y DA61. La primera conexión se acota a Cantabria, Murcia y los topes de Madrid. Los certificados, régimen y derecho externo permanecen condicionados. Véanse el [alcance](deducciones-2025/producto-donativos-estatales-20261105/ALCANCE.md) y la [revisión independiente](deducciones-2025/producto-donativos-estatales-20261105/REVISION.md).

La solicitud `maternidad2025` añade un libro mensual por hijo y beneficiaria para el artículo 81, su incremento por guardería y los anticipos efectivamente cobrados. La rama inicial exige madre biológica, alta al nacimiento y situación familiar estable representada. El mínimo familiar concilia identidades y derechos; no concede por sí solo la deducción. Ambas API usan el mismo libro y ajustan el diferencial después de los pagos, sin consumir de nuevo cuota autonómica.

`lote: "CYL81"` conecta el cuidado de hijos en Castilla y León con el incremento estatal y los pagos del mismo niño. Su primera rama admite un niño y un titular; las restantes condiciones y rechazos se detallan en el [alcance](maternidad-guarderia-cyl-20261105/ALCANCE.md). La combinación ELA+81 sigue rechazada explícitamente. Donativos+81 admite únicamente el ámbito ya soportado de donativos; Castilla y León con donativos conserva su rechazo. Un pago o factura reutilizado entre guardería y donativos se rechaza antes de componer el resultado.

La primera revisión monetaria independiente de maternidad y sus interacciones detectó R1 (colisión entre clases de identificador) y R2 (referencia documental). Las correcciones del integrador pasan 310 pruebas, incluidas las propias recibidas; dos hipótesis del revisor permanecen apartadas, sin dictamen monetario adverso confirmado. Los 31 pasos del CI global de la integración pasan en entorno limpio. No se declara cerrado el catálogo de deducciones. Véase el [informe de integración](productores-anuales-20261105/INTEGRACION.md).

Los identificadores de pago y las referencias documentales se concilian por clase entre los libros. `operacionId` es una etiqueta local del libro de donativos; su coincidencia con una clave de pago o factura no elimina una deducción. Véanse la [revisión de maternidad](maternidad-guarderia-cyl-20261105/REVISION.md) y las [correcciones y reserva](maternidad-guarderia-cyl-20261105/CORRECCIONES-R1-R2.md).

## Auxiliares exactos de Madrid y Murcia en la composición anual

La ampliación `F-ampliado` conecta nacimiento/adopción de Madrid y guardería de Murcia con las dos API y el libro único de cuota. Ambas consumen el núcleo racional compartido con el auxiliar anterior. Los hechos anuales añaden filiación, unidad familiar, eventos y gastos identificados; no basta la elegibilidad declarada del auxiliar.

Madrid admite eventos de 2025 en el perfil no conyugal acotado. El censo exige padres de primer grado por consanguinidad o adopción: la presencia de un abuelo en el grafo de mínimos no lo convierte en progenitor. Murcia concilia gasto propio por menor, ayudas, centro y período de primer ciclo. Los demás perfiles y la combinación pendiente con maternidad estatal siguen rechazados con motivo. Véanse [contratos, revisión y límites](deducciones-2025/f-auxiliares-exactos-20261105/INTEGRACION.md). F-REV-01 tiene contraste independiente favorable acotado y los 31 pasos del CI local de este corte pasan en entorno limpio.


## Alquileres identificados de Canarias y Baleares en 2025

El perfil `solo-inmobiliario-p4a` añade una entrada por hechos a `liquidarIrpfAnual(caso, { modo: "canonico" })` y a `liquidarIrpfAnualExplicito(caso)`. Ambas delegan en `liquidarInmobiliarioP4a` y en la composición anual común; no existe otra fórmula de cuota. El contrato es `CasoInmobiliarioP4a`, en `lib/dominio/irpf/inmobiliario-2025/contrato.ts`.

Admite 2025, residencia en Canarias o Illes Balears, tributación individual, edad de18 a64 años y renta exclusivamente inmobiliaria. Cada inmueble tiene propietario pleno único, identidad catastral, ubicación independiente de la residencia fiscal, adquisición onerosa y contrato LAU de vivienda permanente durante todo2025. El historial de usos desde la adquisición es exhaustivo y no contiene alquiler anterior. Se excluyen expresamente actividad, servicios de hospedaje, familiares, discapacidad, cotitularidad, usufructo, ayudas, mobiliario, saldos previos, insolvencia y las otras ramas no representadas.

Ingresos se aportan por exigibilidad. Los gastos identifican emisor, factura, línea y total del documento, fecha de operación, expedición y pago, además de naturaleza e importe. La mejora identifica por separado su puesta en servicio. Esta entrada sólo representa operaciones, facturas y pagos íntegros de2025; otras combinaciones conservan rechazo. La misma factura puede contener partidas distintas para varios inmuebles, pero no puede duplicarse una línea ni excederse el total declarado. Las clases de gasto declaran su vinculación necesaria al arrendamiento; una factura no convierte un gasto personal en deducible.

El productor calcula ingresos, gastos limitados, exceso no aplicado, otros gastos, amortización, neto, reducción y neto reducido por inmueble. Estos pasos usan racionales EUR `{ n: bigint, d: bigint }`; la composición recibe `Decimal` con80 cifras. El resultado de ambas entradas es `_tag: "LiquidacionInmobiliariaP4a"`, con el detalle por inmueble, base, composición, retenciones y diferencial. Para transportarlo como JSON hay que convertir los `bigint` a texto; no son céntimos ni `number` seguros por defecto. El exceso de gastos se muestra, sin certificar un saldo fiscal futuro.

Conecta dos ramas regionales: adecuación para arrendamiento en Canarias y sostenibilidad de vivienda arrendada en Baleares. Los gastos regionales se concilian con los del productor y consumen una única cuota. Cambiar a vivienda habitual propia dentro de este perfil no elude la conciliación. La deducción balear requiere inmueble declarado en Illes Balears, sin inferirlo de la residencia del titular. `energia` y `agua` son las actuaciones tasadas del artículo3, no cualquier gasto con esa etiqueta comercial.

Los rechazos de entrada, identidad, historia, fechas, gastos o duplicados usan `_tag: "RechazoP4a"`; las condiciones regionales no soportadas pueden devolver `ResultadoNoSoportado`. Ambos son fallos recuperables de `Effect`. Los casos incompatibles no devuelven impuesto cero. El cálculo sigue condicionado a la veracidad de los hechos aportados y no declara aceptación fiscal universal.

Ejemplos comprobados en `tests/inmobiliario-p4a.test.ts` y `tests/inmobiliario-p4a-correcciones.test.ts`: dos API con cuota única, mejora disponible antes de factura/pago, facturas con varias partidas e inmueble fuera del territorio de la deducción. Los importes de sus fixtures son sintéticos y no amplían los cotejos con Open.

El período de devengo, cuando se declara, debe contener fechas civiles válidas, estar ordenado y quedar íntegro en 2025. La ausencia del campo opcional mantiene el contrato anterior; no demuestra un devengo que no se haya declarado. El perfil P4b mantiene sus controles adicionales sobre el período exclusivamente arrendado. Las fechas y líneas no acreditan por sí solas los plazos formales de expedición ni el ámbito mensual de una factura recapitulativa. [Integración y evidencia](inmobiliario-p4a-20261105/INTEGRACION.md).

## Patrimonio y vivienda habitual riojana de 2025

Las solicitudes `E38` de `rioja_vivienda_habitual_pequenos_municipios` y `rioja_inversion_vivienda_jovenes_menores_36` usan el inventario opcional `patrimonioP5a`, obligatorio al seleccionar esas ramas. Su contrato está en `lib/dominio/irpf/patrimonio-p5a/contrato.ts`. El consumidor deriva las magnitudes patrimoniales del censo, las cuentas, los movimientos, la adquisición y su historia; la entrada no admite un incremento fiscal calculado por el cliente.

El perfil inicial exige adquisición plena individual de 2025, una vivienda y cuentas en euros. La rama de pequeños municipios sólo admite precio directo sin préstamo. La rama de jóvenes admite además un préstamo nuevo y exclusivo identificado, con disposición y amortización conciliadas. Los perfiles fuera de alcance se rechazan con `ResultadoNoSoportado`, sin importe sustitutorio. El resto de condiciones territoriales se evalúa dentro del mismo libro de cuota usado por ambas API.

Una residencia abandonada antes de la compra no puede reutilizarse para conceder la deducción. Se conserva ocupación previa que continúa. La permanencia futura es una expectativa condicionada al cumplimiento posterior. Véanse [alcance, evidencias y reservas](patrimonio-p5a-20261105/INTEGRACION.md).

## Etapas monetarias observadas en Open Madrid 2018

La entrada efectiva de empleo de Madrid de 2018 selecciona internamente `open-etapas-empleo-madrid-2018`, dentro del perfil histórico individual admitido. La API canónica conserva su aritmética Decimal. No se introduce un selector externo que habilite por sí solo nuevos territorios, familias, pensiones o actividades.

El perfil de compatibilidad exige importes acumulados a céntimos, no negativos y hasta un millón de euros; los gastos a–e deben ser enteros. Son límites técnicos del contraste disponible, no umbrales fiscales. Fuera de ese perfil se devuelve `ResultadoNoSoportado`. La política conserva las fórmulas comunes y cambia únicamente las operaciones y cuantizaciones documentadas para 2018. Véanse [evidencia observada, generalizaciones y límites](simuladores/historico/CORRECCION-ETAPAS-2018.md).

## Vehículo eléctrico DA58 y movilidad de Castilla y León · 2025

`deduccionesTerritoriales2025.vehiculoDA582025` conecta hechos de adquisición, matrícula, pagos y ayudas previstas con la composición anual de ambas API. El corte admite un único M1 BEV nuevo de dos a siete plazas, titular pleno, adquisición/matrícula/pagos en 2025 y ámbito Madrid o Castilla y León. Calcula internamente el 15 % de una base máxima de 20.000 euros y limita su aplicación a cuota estatal.

La movilidad regional de Castilla y León consume la generación estatal del mismo vehículo para minorar su máximo de 4.000 euros; una cuota estatal insuficiente no incrementa ese máximo. Se concilian los pagos compartidos antes de aplicar cada deducción a su cuota. Los demás perfiles permanecen rechazados con motivo concreto. Véanse [alcance y reservas documentales](deducciones-2025/vehiculo-da58-20261105/ALCANCE.md) y [primera revisión](deducciones-2025/vehiculo-da58-20261105/REVISION.md).


## Inversión estatal68.1 y conexión aragonesa2025

La cartera `A-aragon-dos` admite elección estatal positiva con `hechos.estatal681`: hechos patrimoniales exhaustivos y titularidades, sin base ni deducción fiscal aportada. Perfil individual Aragón2025, sociedad ordinaria, pagos bancarios de suscripción nueva/reciente; sin reinversión38.2, saldos anteriores ni otros bienes/deudas en el patrimonio. Las cuentas se valoran por sus saldos documentados; las acciones nuevas por los pagos conciliados del censo. Se comprueba internamente el incremento del art70. No se cubren empresas emergentes en esta rama nueva ni se extiende por analogía a otros territorios.

El productor común valida entidad/grupo, fondos, forma, mercado, actividad, participación familiar y cronología hasta devengo. El positivo añade conciliación documental contribuyente/entidad/escritura/adquisición/certificado, consistencia por entidad y certificado relativo al ejercicio2025 de adquisición, aunque se haya expedido después. La fecha debe ser civilmente válida y no anterior a la suscripción. Las obligaciones futuras de tenencia y requisitos se conservan condicionadas. No se autentican documentos ni exhaustividad.

La asignación monetaria estatal es una elección sobre pagos reales: estatal+Aragón+sin deducción debe coincidir con cada desembolso. Base estatal máxima100000, porcentaje50%; el importe sólo consume cuota estatal. La base regional conserva el exceso sobre100000 y excluye la asignación estatal, independientemente de la cuota estatal disponible. Se preservan20%/4000 regionales y la rama estatal0 ya publicada. El libro `deduccionesTerritoriales2025.estatal681` expone generación y consumo racional único para ambas API; cuota líquida y diferencial descuentan sólo lo aplicado. El pendiente es información de cuota, sin derecho a arrastre.

Sin hechos adicionales se mantiene el rechazo tipado estatal positivo, ahora con petición concreta. Reinversión38.2 y vivienda social3/10 siguen rechazadas. Combinaciones con donativos mantienen su alcance previo; no se habilitan interacciones nuevas. Véase [entrega y límites](deducciones-2025/producto-681-aragon/ALCANCE.md).


## Nacimiento múltiple y adopción balear2025

En `lote: "C36"`, `registroPartoMultiple` incorpora la secuencia física documentada de un mismo parto y `filiacionAdopcion` identifica la adopción única admitida. Se concilian evento, fecha, personas, progenitores, inscripción y derechos al mínimo ya producidos por la anual. El orden no se infiere del identificador ni de la posición del array. El reparto de nacimiento usa los progenitores y conserva la prioridad de aplicación sobre la cuota común.

Ambas API admiten los perfiles del [contrato registral balear](deducciones-2025/baleares-registro-familiar-20261105/CONTRATO.md). Continúan fuera anticipos, regularización, abono administrativo de insuficiencia, segundo adoptante y las historias registrales no representadas. Las referencias documentales declaran hechos externos; el motor no autentica certificados.

## Inversión extremeña2025 con elección estatal68.1

`lote: "D51"`, código `extremadura_inversion_acciones_participaciones_mercantiles`, conecta una constitución ordinaria2025 con el productor estatal común68.1 y el libro autonómico. El desembolso se reparte expresamente entre estatal y Extremadura; las cantidades usadas en una base no vuelven a utilizarse en la otra, aunque falte cuota para aplicar toda la deducción. Ambas API calculan y consumen una sola cuota de cada componente.

El contrato concilia capital notarial, aportaciones y participación propia/familiar por fracciones exactas, inscripción, actividad, contabilidad, empleo y alta en Seguridad Social. La constitución SA exige capital mínimo60.000EUR y la SL1EUR. El pago bancario es una restricción documental del perfil. Se conserva la emisión posterior de certificados del ejercicio2025 y se identifican las obligaciones futuras de tenencia y empleo sin darlas por cumplidas.

Perfil individual ordinario de una inversión, sin grupo, reinversión, transmisión, primas ni las restantes combinaciones excluidas. No se reciben bases ni cuotas fiscales calculadas por el usuario. La envoltura aragonesa conserva sus propias condiciones. Véase [contrato extremeño](ext-inversion-20261105/CONTRATO.md).


## Cuotas de empleados de hogar en Canarias2025

`lote: "C36"`, código `canarias_cuotas_seguridad_social_empleados_hogar`, añade `registroHogar`: contratos, altas, cuotas, pagos, ayudas, vivienda y régimen matrimonial documentado para todo el ejercicio. El productor concilia identidades y fechas, deriva la atribución íntegra o por mitades en gananciales y entrega la base al consumidor común del20%, con límite agregado500EUR y cuota disponible una sola vez.

El acceso utiliza edad, discapacidad o mínimo de descendientes y trabajo propio ya representados por la anual. El perfil exige empleador propio; no infiere separación de bienes de la tributación individual. NIF/NIE, pagador, TGSS, recibos, periodos y ayudas deben ser coherentes. Los perfiles del cónyuge empleador, cambios civiles intranuales y cuotas de asistencia siguen rechazados con causa concreta. Véase [contrato de hogar](deducciones-2025/canarias-hogar-atribucion-20261105/CONTRATO.md).


## Ayuda identificada de talidomida y vivienda vacía extremeña

La ayuda pública RD 574/2023 admite expediente propio único y cobro íntegro único en 2025, conciliado con la resolución de la Dirección General del Imserso. Se integra en la base general aunque no se solicite la deducción gallega. La solicitud territorial referencia `ingresoId`; no aporta una base fiscal ni una deducción calculada. Las otras ayudas y las concurrencias no representadas conservan sus rechazos.

El perfil `solo-inmobiliario-p4a` incorpora Extremadura con una vivienda en pleno dominio y `vaciaExt2025`: hechos catastrales, observaciones de vacío de 2024 y ocupación de 2025 conciliados. La imputación de 2024 verifica la condición histórica, sin entrar en ingresos de 2025. Ambas API consumen el mismo productor de RNR y el mismo libro de cuota. El corte se limita a firma e inicio 1/1/2025, ocupación observada hasta devengo y pacto hasta al menos 1/1/2028; otros supuestos jurídicamente posibles aún no están conectados.

[Contrato, fuentes y límites de estas dos ampliaciones](registros-ayudas-inversion-20261105/INTEGRACION.md).


## Ayudas gallegas e historia de bases de 2025

`ingresosIdentificados2025` incorpora los perfiles identificados de reparación VI100B y de ayudas gallegas por resultados deportivos. El primero conserva la ayuda no integrada en el libro y no habilita una deducción positiva; el segundo deriva su integración general y enlaza el selector E38 por `ingresoId`. Identidad, finalidad, reconocimiento, resolución y cobros se concilian antes de calcular. La renta se integra aunque no se solicite la deducción.

Las cuatro rutas D51 de vivienda rural CLM, cuenta ahorro vivienda CLM, rehabilitación rural para alquiler EXT y vivienda rural EXT admiten `historiaBases` documentada. El productor deriva la magnitud de los hechos completos; ausencia de historia y aplicaciones previas positivas aún no reconstruidas se rechazan. La prorrata extremeña conserva exactamente el divisor365. Su subcálculo devuelve cadena decimal si es finita o `{ numeradorEuros, divisor }` si es periódica; ambas API anuales conservan el racional del libro de cuota.

[Alcances, fuentes, revisiones y validación](galicia-historia-20261105/INTEGRACION.md).


## Ayudas de emergencia de Baleares

El perfil de vivienda habitual del artículo 3.2.e del Decreto 33/2018 incorpora la
reforma de la Ley 17/2019: el daño peritado limita la ayuda, pero el coste efectivo
de reparación determina el exceso que se integra en la base general según la
DA 5.3 de la LIRPF. No se confunden ambas magnitudes.

Se admite un pago íntegro en 2025 de una concesión posterior al 13 de abril de
2019, con solicitud dentro del período representado y reclamaciones de pago que
conservan el derecho. El perfil exige reparación completa terminada en 2025,
propiedad y uso propios, sin concurrencia de ayudas, litigio, intereses ni costas.
Las exclusiones temporales conservadoras se explican en la documentación del
perfil; no declaran por sí mismas la prescripción de otros expedientes.

La solicitud territorial identifica la ayuda mediante `ingresoId`. El productor
común deriva su integración y la deducción consume los tipos de la liquidación
anual y su cuota restante. Ambas API usan esa ruta. Las referencias documentales
no acreditan la autenticidad de un expediente externo.

## Vivienda riojana anterior a 2013 y DT18

Las dos API anuales conectan cuatro ramas de vivienda riojana de 2025 mediante los productores de hechos: segunda vivienda rural anterior a 2013, adquisición habitual de jóvenes, rehabilitación y adecuación de la vivienda habitual por discapacidad propia. La solicitud de segunda vivienda aporta `patrimonioRiojaAnterior`; las tres ramas habituales aportan el libro común `viviendaDT182025`. Los censos de segunda residencia e inversión habitual no se pueden mezclar en este perfil.

El libro DT18 reconstruye la primera vivienda, los proyectos, los desembolsos originales, la aplicación histórica, los préstamos y los pagos del ejercicio. Comprueba conjuntamente el incremento patrimonial y separa capital e intereses. Las cuotas estatal y autonómica se limitan por separado antes de consumir la cuota regional residual. Las reservas de 9.040 y 12.080 euros se conservan como magnitudes distintas; rehabilitación y adecuación comparten además la reserva regional de 9.040 euros. Un incumplimiento patrimonial conjunto anula las deducciones correspondientes aunque cada proyecto aislado parezca cumplirlo.

El contrato representa plena titularidad individual, historia ordinaria completa y préstamos originales sin refinanciación ni nuevas disposiciones. Los pagos de la segunda vivienda son hechos conciliados; su contrato no contiene un cuadro que certifique un sistema francés. Se mantienen los rechazos concretos para construcción, ampliación, reinversión, cotitularidad y otras historias no representadas. La discapacidad propia nueva de la entrada efectiva se limita al perfil de pensión; no habilita discapacidad en empleo activo. Las referencias identifican los documentos declarados y no autentican por sí solas sus contenidos.

## Incremento hipotecario madrileño de 2025

Las dos API derivan el incremento de coste desde el contrato y los recibos del préstamo. El núcleo financiero reconstruye las trayectorias real y contrafactual, concilia las mensualidades y entrega el importe al consumidor regional común. El cliente no aporta una diferencia de intereses, una base fiscal ni una deducción calculadas.

El perfil representa amortización francesa con TIN dividido entre doce, cuota e interés mensual en céntimos, revisión en enero o en enero y julio, y doce recibos pagados con fondos propios. Exige un único propietario y prestatario, préstamo de adquisición anterior a 2025 y vivienda todavía habitual. Los índices admiten signo y hasta seis decimales; el TIN resultante no puede ser negativo. Las condiciones regionales de acceso, incompatibilidad, renta y cuota siguen aplicándose después de producir los intereses.

Otras fechas de revisión, titularidades compartidas, novaciones, amortización extraordinaria, cancelación, carencia, mora, tipos mixtos, suelos, techos y coberturas mantienen rechazos concretos. El contrato tampoco reconstruye por sí solo las bases fiscales de familiares ajenos ni autentica documentos. Estas restricciones describen la cobertura del productor, no todos los requisitos legales de la deducción.

## Vivienda canaria, alquiler balear, libros gallegos y pagadores catalanes

La adquisición canaria C36 recibe `hechos.historiaAdquisicion`: escritura,
identificación del inmueble, ocupación, cuentas, movimientos y censo vital de
inversiones y ayudas. El primer perfil representa adquisición íntegramente
pagada con fondos propios en 2025, sin préstamo, anticipos ni ayudas. El pago
puede ser posterior al día de adquisición dentro del ejercicio; debe conciliar
fecha, importe, documento y destinatario con el movimiento bancario. La condición
patrimonial se obtiene del censo completo y los límites siguen en el consumidor
C36 común. Las contradicciones bancarias conservan su causa en el rechazo.

El alquiler balear C36 recibe `hechos.censoViviendaInversion` y la localización
material del inmueble, además del contrato, ocupación y pagos. El primer perfil
es individual, de 18 a 35 años, sin derechos reales ni operaciones de inversión
en el censo completo. Se concilia todo el plan de solicitudes: no solicitar una
deducción de inversión no prueba que falte el derecho. Isla, catastro y arrendador
se verifican contra sus hechos propios; la residencia fiscal no los sustituye.
La fianza documental, el cobro directo al arrendador y la ausencia de otros
colectivos son límites técnicos del perfil, no requisitos legales universales.

Los libros escolares gallegos E38 reciben `historiaLibros2024` junto a los hechos
familiares y las compras de 2025. La composición familiar estable y las economías
de 2024 permiten producir las bases de los declarantes con el motor común; no se
acepta `renta2024` calculada por el cliente. Una pensión declarada debe concordar
con la economía de esa persona antes de afectar al reparto. Un censo expreso sin
ingresos permite producir cero; un no declarante con trabajo positivo conserva
el rechazo `Libros.imputaciones` hasta resolver el criterio del certificado.
Las pensiones exentas y las historias familiares cambiantes siguen fuera del
productor representado.

La pluralidad de pagadores de Catalunya usa el perfil efectivo
`trabajo-pagadores-catalunya-2025` en ambas API. Recibe certificados, NIF, salarios
y retenciones identificados, junto a censos de otras causas de obligación; el
motor agrupa por pagador y reutiliza sus bases y cuotas. La referencia de un
certificado es local a su NIF emisor. Este perfil no estima cotizaciones ni
admite pensiones, otras rentas o causas distintas de obligación como si fueran
salarios ordinarios. [Contrato, alcance y fuentes temporales](deducciones-2025/catalunya-pagadores-20261105/ALCANCE.md).

Estas conexiones conservan la composición común, la cuota disponible y los
rechazos tipados. No acreditan por sí mismas autenticidad documental ni completan
todas las ramas de los cuatro códigos.

## Familiar con renta exenta en Extremadura 2025

La solicitud `D51`, código `extremadura_cuidado_familiares_discapacidad`, incorpora `hechos.perfil: "familiar-pension-exenta-2025"`. Recibe la ausencia expresa de rentas o la pensión pública de incapacidad representada, sus resoluciones y cobros, un censo patrimonial acotado de cuentas, vivienda y deudas y los parientes lineales vivos de primer grado. No recibe una renta fiscal ni una respuesta de obligación de Patrimonio calculada externamente.

El productor concilia cobros y movimientos bancarios y deriva las magnitudes que consume el evaluador territorial existente. El reparto se obtiene del censo; la deducción pasa al consumo común de cuota una vez. La rama mantiene residencia estable, discapacidad durante el período representado, municipios de al menos 3.000 habitantes y las demás restricciones expresas del contrato. No habilita un simulador general de Patrimonio ni presupone derecho al mínimo familiar. Las demás rentas, patrimonios, grados y situaciones no representados conservan rechazo.

El libro común `basesFamiliares2025` de Madrid y Valencia no queda habilitado en Extremadura por esta conexión. Las pruebas de rechazo de esa combinación no acreditan una conciliación positiva entre ambos libros. `ext-familiar-pension-exenta-2025.test.ts` conserva los ejemplos y límites del productor acotado.

El cobro y su exigibilidad deben estar dentro de 2025 y del período de efectos
declarado, con extremos inclusivos. Una exigibilidad anterior al inicio o posterior
al final se rechaza antes de calcular la deducción. La cronología de resolución
y efectos sigue acotada por el contrato; no se presenta como exclusión legal
general de pensiones retroactivas.

La omisión de `vivienda` sólo representa ausencia dentro del censo mundial
completo declarado, con `otrasClases.inmuebles: "ninguno"`. No representa una
vivienda desconocida ni autentica la exhaustividad de los hechos aportados.
El consumidor no recibe una respuesta externa sobre obligación de Patrimonio.
