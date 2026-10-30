# anual.cuota.liquida

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: `max(0, ${euros(cuotaGeneralDespuesMinimo)} + ${euros(cuotaAhorroDespuesMinimo)} - ${euros(deduccionesAutonomicasAplicadas)})`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.general (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- caso / situacionFamiliar.ascendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.general (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [escalaPublicadaAutonomica] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17914–17941
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaAutonomicaIgualEstatal (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2833–3062
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- caso / comunidadAutonoma (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaEstatalGeneral (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- caso / situacionFamiliar.discapacidad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [impo / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2027–2297
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (EUR, value); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- [
  ...filas([
    ["0", "0", ".096"],
    ["12960.45", "1244.20", ".1146"],
    ["21028.20", "2168.76", ".1374"],
    ["35394", "4142.62", ".1822"],
  ]),
  {
 / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3107–3406
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- [
  [importe(6000), importe("0.195")],
  [importe(50000), importe("0.215")],
  [importe(Infinity), importe("0.235")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4437–4556
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (selector, selection); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17648–17711
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2590–2781
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- convertirCentimosAEuros(0) / value (EUR, value); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3115–3307
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17648–17711
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4085–4285
- [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- caso / situacionFamiliar.discapacidad (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (selector, selection); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [impo / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2343–2537
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:899–940
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (EUR, value); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (EUR, value); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    }) / value (selector, selection); Contrato de llamada pendiente: Option.match; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4136–4281
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaAutonomica.tramos (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- caso / deduccionAutonomicaAgregadaCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2833–3062
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- caso / fechaFallecimiento (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }),
    base.mul(0),
    (total, tramo) => / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:756–944
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- convertirCentimosAEuros(0) / value (selector, selection); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [impo / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2027–2297
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:899–940
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor75 (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso / situacionFamiliar.descendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (selector, selection); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4149–4280
- caso / situacionFamiliar.descendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2590–2781
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }),
    base.mul(0),
    (total, tramo) => / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:756–944
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaEstatalGeneral (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [impo / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2343–2537
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- [escalaPublicadaAutonomica] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17914–17941
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- caso / situacionFamiliar.ascendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaAutonomicaIgualEstatal (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- obtenerEscalaAutonomicaPublicada(caso) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalaAutonomicaPublicada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17766–17804
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaAutonomica.tramos (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
## Condiciones por relación

- [value] argumento de max; e:0
- [value] argumento conservado sin afirmar cierre; e:1
- [value] argumento conservado sin afirmar cierre; e:2
- [value] sustitución por propiedad del argumento; e:4
- [value] argumento conservado sin afirmar cierre; e:5
- [value] argumento conservado sin afirmar cierre; e:6
- [value] argumento conservado sin afirmar cierre; e:7
- [value] argumento conservado sin afirmar cierre; e:8
- [value] argumento conservado sin afirmar cierre; e:9
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:10
- [value] si calcular devuelve; instrumentación no transforma el valor; e:11
- [value] sustitución por propiedad del argumento; e:14
- [value] argumento de max; e:16
- [value] retorno de calcularBaseImponibleAhorro; e:17
- [value] si calcular devuelve; instrumentación no transforma el valor; e:18
- [value] argumento de max; e:20
- [value] argumento de max; e:21
- [value] binding único desde servicio anual; e:22
- [value] sustitución de argumento exacto; e:25
- [value] argumento conservado sin afirmar cierre; e:26
- [value] argumento conservado sin afirmar cierre; e:27
- [value] argumento conservado sin afirmar cierre; e:28
- [value] argumento conservado sin afirmar cierre; e:29
- [value] retorno de sumarRendimientosTrabajo; e:30
- [value] si calcular devuelve; instrumentación no transforma el valor; e:31
- [value] sustitución por propiedad del argumento; e:34
- [value] receptor de operación Decimal; e:35
- [selection] binding único desde servicio anual; e:36
- [selection] ===; e:39
- [selection] selección de función; e:40
- [selection] binding único desde servicio anual; e:41
- [selection] sustitución por propiedad del argumento; e:44
- [selection] ===; e:46
- [selection] selecciona rama; e:47
- [value] binding único desde servicio anual; e:48
- [value] sustitución de argumento exacto; e:51
- [value] argumento conservado sin afirmar cierre; e:52
- [value] argumento conservado sin afirmar cierre; e:53
- [value] argumento conservado sin afirmar cierre; e:54
- [value] argumento conservado sin afirmar cierre; e:55
- [value] retorno de sumarRendimientosTrabajo; e:56
- [value] si calcular devuelve; instrumentación no transforma el valor; e:57
- [value] sustitución por propiedad del argumento; e:60
- [value] argumento de min; e:61
- [value] sustitución de argumento exacto; e:62
- [value] constructor Decimal; e:63
- [value] retorno de crearImporteMonetario; e:64
- [value] receptor de operación Decimal; e:65
- [value] argumento de mul; e:66
- [value] argumento de min; e:67
- [value] receptor de operación Decimal; e:68
- [value] argumento de mul; e:69
- [value] receptor de operación Decimal; e:70
- [value] sustitución por propiedad del argumento; e:71
- [value] argumento de min; e:72
- [value] sustitución de argumento exacto; e:73
- [value] constructor Decimal; e:74
- [value] retorno de crearImporteMonetario; e:75
- [value] receptor de operación Decimal; e:76
- [value] argumento de mul; e:77
- [value] argumento de min; e:78
- [value] receptor de operación Decimal; e:79
- [value] argumento de mul; e:80
- [value] argumento de plus; e:81
- [value] receptor de operación Decimal; e:82
- [value] argumento de div; e:83
- [value] anio === 2018; e:84
- [selection] sustitución por propiedad del argumento; e:87
- [selection] sustitución por propiedad del argumento; e:89
- [selection] sustitución de argumento exacto; e:90
- [selection] selección de elemento; e:91
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:94
- [selection] sustitución de argumento exacto; e:96
- [selection] sustitución de argumento exacto; e:98
- [selection] argumento conservado sin afirmar cierre; e:99
- [selection] selecciona Match; e:100
- [value] sustitución por propiedad del argumento; e:101
- [value] sustitución por propiedad del argumento; e:103
- [value] sustitución de argumento exacto; e:104
- [value] sustitución de argumento exacto; e:105
- [value] a.lessThan(b) matches true; e:106
- [selection] selección de elemento; e:109
- [value] retorno de obtenerParametrosCotizacionLegacy; e:112
- [value] sustitución de argumento exacto; e:114
- [value] sustitución de argumento exacto; e:116
- [value] ningún matcher previo (true) && else; e:117
- [value] retorno de minimo; e:118
- [value] retorno de baseCotizacionPara; e:121
- [value] retorno de calcularDesgloseCotizacionesSocialesLegacy; e:125
- [value] !(anio === 2018); e:128
- [value] receptor de operación Decimal; e:130
- [value] retorno de obtenerParametrosCotizacionLegacy; e:134
- [value] sustitución de argumento exacto; e:136
- [value] argumento conservado sin afirmar cierre; e:138
- [value] argumento conservado sin afirmar cierre; e:139
- [value] sustitución de argumento exacto; e:140
- [value] constructor Decimal; e:141
- [value] retorno de crearImporteMonetario; e:142
- [value] argumento conservado sin afirmar cierre; e:144
- [value] argumento conservado sin afirmar cierre; e:145
- [value] retorno de sumarTipoCotizacionLegacy; e:146
- [value] argumento de mul; e:147
- [value] receptor de operación Decimal; e:149
- [value] receptor de operación Decimal; e:151
- [selection] sustitución por propiedad del argumento; e:152
- [selection] sustitución de argumento exacto; e:153
- [selection] sustitución de argumento exacto; e:154
- [selection] selecciona Match; e:155
- [value] sustitución de argumento exacto; e:156
- [value] constructor Decimal; e:157
- [value] retorno de crearImporteMonetario; e:158
- [value] anio matches 2023; e:161
- [value] sustitución de argumento exacto; e:162
- [value] constructor Decimal; e:163
- [value] retorno de crearImporteMonetario; e:164
- [value] ningún matcher previo (2023) && anio matches 2024; e:167
- [value] sustitución de argumento exacto; e:168
- [value] constructor Decimal; e:169
- [value] retorno de crearImporteMonetario; e:170
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:173
- [selection] sustitución de argumento exacto; e:174
- [selection] >=; e:176
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:177
- [value] sustitución de argumento exacto; e:178
- [value] constructor Decimal; e:179
- [value] retorno de crearImporteMonetario; e:180
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:183
- [value] sustitución de argumento exacto; e:184
- [value] constructor Decimal; e:185
- [value] retorno de crearImporteMonetario; e:186
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:190
- [value] retorno de obtenerTiposMei; e:191
- [value] retorno de obtenerParametrosCotizacionLegacy; e:194
- [value] argumento de mul; e:198
- [value] argumento de plus; e:200
- [value] receptor de operación Decimal; e:201
- [value] argumento de max; e:202
- [value] sustitución por propiedad del argumento; e:203
- [value] receptor de operación Decimal; e:204
- [value] argumento de minus; e:206
- [value] argumento de max; e:207
- [value] sustitución de argumento exacto; e:209
- [value] argumento de min; e:210
- [selection] sustitución de argumento exacto; e:213
- [selection] selección de elemento; e:214
- [value] retorno de obtenerParametrosCotizacionLegacy; e:217
- [value] sustitución de argumento exacto; e:220
- [value] receptor de operación Decimal; e:221
- [value] argumento de mul; e:222
- [value] argumento de min; e:223
- [value] receptor de operación Decimal; e:225
- [selection] sustitución por propiedad del argumento; e:226
- [selection] selecciona Match; e:227
- [value] anio matches 2025; e:234
- [value] ningún matcher previo (2025) && anio matches 2026; e:241
- [value] ningún matcher previo (2025 | 2026) && else; e:246
- [value] sustitución de argumento exacto; e:249
- [value] argumento de mul; e:251
- [value] receptor de operación Decimal; e:252
- [value] argumento de max; e:253
- [value] sustitución de argumento exacto; e:254
- [value] receptor de operación Decimal; e:255
- [value] sustitución de argumento exacto; e:256
- [value] receptor de operación Decimal; e:257
- [value] argumento de mul; e:258
- [value] argumento de minus; e:259
- [value] argumento de max; e:260
- [value] argumento de min; e:261
- [value] sustitución de argumento exacto; e:262
- [value] receptor de operación Decimal; e:263
- [value] argumento de mul; e:264
- [value] argumento de min; e:265
- [value] receptor de operación Decimal; e:267
- [selection] selecciona Match; e:268
- [value] anio matches 2025; e:275
- [value] ningún matcher previo (2025) && anio matches 2026; e:282
- [value] ningún matcher previo (2025 | 2026) && else; e:287
- [value] sustitución de argumento exacto; e:290
- [value] argumento de mul; e:292
- [value] argumento de plus; e:293
- [value] receptor de operación Decimal; e:294
- [value] argumento de max; e:295
- [value] sustitución de argumento exacto; e:296
- [value] receptor de operación Decimal; e:297
- [value] sustitución de argumento exacto; e:298
- [value] receptor de operación Decimal; e:299
- [value] argumento de mul; e:300
- [value] argumento de minus; e:301
- [value] argumento de max; e:302
- [value] receptor de operación Decimal; e:304
- [selection] selecciona Match; e:305
- [value] anio matches 2025; e:312
- [value] ningún matcher previo (2025) && anio matches 2026; e:319
- [value] ningún matcher previo (2025 | 2026) && else; e:324
- [value] sustitución de argumento exacto; e:327
- [value] argumento de mul; e:329
- [value] argumento de plus; e:330
- [value] retorno de cuotaSolidaridad; e:331
- [value] argumento de plus; e:333
- [value] contexto.modo === "canonico" && (retorno de calcularDesgloseCotizacionesPerfilUniforme); e:335
- [selection] binding único desde servicio anual; e:338
- [selection] sustitución por propiedad del argumento; e:341
- [selection] sustitución de argumento exacto; e:342
- [selection] selección de elemento; e:343
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:346
- [selection] sustitución de argumento exacto; e:348
- [selection] sustitución de argumento exacto; e:350
- [selection] argumento conservado sin afirmar cierre; e:351
- [selection] selecciona Match; e:352
- [value] binding único desde servicio anual; e:353
- [value] sustitución de argumento exacto; e:356
- [value] argumento conservado sin afirmar cierre; e:357
- [value] argumento conservado sin afirmar cierre; e:358
- [value] argumento conservado sin afirmar cierre; e:359
- [value] argumento conservado sin afirmar cierre; e:360
- [value] retorno de sumarRendimientosTrabajo; e:361
- [value] si calcular devuelve; instrumentación no transforma el valor; e:362
- [value] sustitución por propiedad del argumento; e:365
- [value] sustitución de argumento exacto; e:366
- [value] sustitución de argumento exacto; e:367
- [value] a.lessThan(b) matches true; e:368
- [selection] selección de elemento; e:371
- [value] retorno de obtenerParametrosCotizacionLegacy; e:374
- [value] sustitución de argumento exacto; e:376
- [value] sustitución de argumento exacto; e:378
- [value] ningún matcher previo (true) && else; e:379
- [value] retorno de minimo; e:380
- [value] retorno de baseCotizacionPara; e:383
- [value] receptor de operación Decimal; e:386
- [value] retorno de obtenerParametrosCotizacionLegacy; e:390
- [value] sustitución de argumento exacto; e:392
- [value] argumento conservado sin afirmar cierre; e:394
- [value] argumento conservado sin afirmar cierre; e:395
- [value] sustitución de argumento exacto; e:396
- [value] constructor Decimal; e:397
- [value] retorno de crearImporteMonetario; e:398
- [value] argumento conservado sin afirmar cierre; e:400
- [value] argumento conservado sin afirmar cierre; e:401
- [value] retorno de sumarTipoCotizacionLegacy; e:402
- [value] argumento de mul; e:403
- [value] sustitución de argumento exacto; e:406
- [value] receptor de operación Decimal; e:408
- [value] receptor de operación Decimal; e:411
- [selection] sustitución de argumento exacto; e:412
- [selection] sustitución de argumento exacto; e:413
- [selection] selecciona Match; e:414
- [value] sustitución de argumento exacto; e:415
- [value] constructor Decimal; e:416
- [value] retorno de crearImporteMonetario; e:417
- [value] anio matches 2023; e:420
- [value] sustitución de argumento exacto; e:421
- [value] constructor Decimal; e:422
- [value] retorno de crearImporteMonetario; e:423
- [value] ningún matcher previo (2023) && anio matches 2024; e:426
- [value] sustitución de argumento exacto; e:427
- [value] constructor Decimal; e:428
- [value] retorno de crearImporteMonetario; e:429
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:432
- [selection] sustitución de argumento exacto; e:433
- [selection] >=; e:435
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:436
- [value] sustitución de argumento exacto; e:437
- [value] constructor Decimal; e:438
- [value] retorno de crearImporteMonetario; e:439
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:442
- [value] sustitución de argumento exacto; e:443
- [value] constructor Decimal; e:444
- [value] retorno de crearImporteMonetario; e:445
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:449
- [value] retorno de obtenerTiposMei; e:450
- [value] retorno de obtenerParametrosCotizacionLegacy; e:453
- [value] argumento de mul; e:457
- [value] sustitución de argumento exacto; e:460
- [value] argumento de plus; e:462
- [value] retorno de sumarCotizacionesSociales; e:465
- [value] sustitución de argumento exacto; e:466
- [value] receptor de operación Decimal; e:468
- [selection] sustitución de argumento exacto; e:469
- [selection] sustitución de argumento exacto; e:470
- [selection] selecciona Match; e:471
- [value] anio matches 2025; e:473
- [selection] sustitución de argumento exacto; e:474
- [selection] >=; e:476
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:477
- [value] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:479
- [value] ningún matcher previo (2025 | (anio) => anio >= 2026) && else; e:481
- [value] retorno de obtenerPoliticaSolidaridad; e:482
- [value] retorno de obtenerParametrosCotizacionLegacy; e:485
- [value] sustitución de argumento exacto; e:487
- [value] argumento conservado sin afirmar cierre; e:489
- [value] argumento conservado sin afirmar cierre; e:490
- [value] retorno de calcularTotalSolidaridad; e:491
- [value] sustitución de argumento exacto; e:492
- [value] receptor de operación Decimal; e:493
- [value] argumento de div; e:494
- [value] retorno de repartirCotizacionSolidaridad; e:497
- [value] sustitución de argumento exacto; e:499
- [value] argumento de plus; e:501
- [value] retorno de sumarCotizacionesSociales; e:504
- [value] !(contexto.modo === "canonico") && (retorno de calcularDesgloseCotizacionesSocialesLegacy); e:508
- [value] si calcular devuelve; instrumentación no transforma el valor; e:509
- [value] sustitución por propiedad del argumento; e:513
- [selection] binding único desde servicio anual; e:517
- [selection] sustitución por propiedad del argumento; e:520
- [selection] sustitución por propiedad del argumento; e:522
- [selection] sustitución por propiedad del argumento; e:524
- [selection] sustitución de argumento exacto; e:525
- [selection] selección de elemento; e:526
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:529
- [selection] sustitución de argumento exacto; e:531
- [selection] sustitución de argumento exacto; e:533
- [selection] argumento conservado sin afirmar cierre; e:534
- [selection] selecciona Match; e:535
- [value] sustitución por propiedad del argumento; e:536
- [value] sustitución por propiedad del argumento; e:538
- [value] sustitución por propiedad del argumento; e:540
- [value] sustitución de argumento exacto; e:541
- [value] sustitución de argumento exacto; e:542
- [value] a.lessThan(b) matches true; e:543
- [selection] selección de elemento; e:546
- [value] retorno de obtenerParametrosCotizacionLegacy; e:549
- [value] sustitución de argumento exacto; e:551
- [value] sustitución de argumento exacto; e:553
- [value] ningún matcher previo (true) && else; e:554
- [value] retorno de minimo; e:555
- [value] retorno de baseCotizacionPara; e:558
- [value] receptor de operación Decimal; e:561
- [value] retorno de obtenerParametrosCotizacionLegacy; e:565
- [value] sustitución de argumento exacto; e:567
- [value] argumento conservado sin afirmar cierre; e:569
- [value] argumento conservado sin afirmar cierre; e:570
- [value] sustitución de argumento exacto; e:571
- [value] constructor Decimal; e:572
- [value] retorno de crearImporteMonetario; e:573
- [value] argumento conservado sin afirmar cierre; e:575
- [value] argumento conservado sin afirmar cierre; e:576
- [value] retorno de sumarTipoCotizacionLegacy; e:577
- [value] argumento de mul; e:578
- [value] sustitución de argumento exacto; e:581
- [value] receptor de operación Decimal; e:583
- [value] receptor de operación Decimal; e:586
- [selection] sustitución de argumento exacto; e:587
- [selection] sustitución de argumento exacto; e:588
- [selection] selecciona Match; e:589
- [value] sustitución de argumento exacto; e:590
- [value] constructor Decimal; e:591
- [value] retorno de crearImporteMonetario; e:592
- [value] anio matches 2023; e:595
- [value] sustitución de argumento exacto; e:596
- [value] constructor Decimal; e:597
- [value] retorno de crearImporteMonetario; e:598
- [value] ningún matcher previo (2023) && anio matches 2024; e:601
- [value] sustitución de argumento exacto; e:602
- [value] constructor Decimal; e:603
- [value] retorno de crearImporteMonetario; e:604
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:607
- [selection] sustitución de argumento exacto; e:608
- [selection] >=; e:610
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:611
- [value] sustitución de argumento exacto; e:612
- [value] constructor Decimal; e:613
- [value] retorno de crearImporteMonetario; e:614
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:617
- [value] sustitución de argumento exacto; e:618
- [value] constructor Decimal; e:619
- [value] retorno de crearImporteMonetario; e:620
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:624
- [value] retorno de obtenerTiposMei; e:625
- [value] retorno de obtenerParametrosCotizacionLegacy; e:628
- [value] argumento de mul; e:632
- [value] sustitución de argumento exacto; e:635
- [value] argumento de plus; e:637
- [value] retorno de sumarCotizacionesSociales; e:640
- [value] sustitución de argumento exacto; e:641
- [value] receptor de operación Decimal; e:643
- [selection] sustitución de argumento exacto; e:644
- [selection] sustitución de argumento exacto; e:645
- [selection] selecciona Match; e:646
- [value] anio matches 2025; e:648
- [selection] sustitución de argumento exacto; e:649
- [selection] >=; e:651
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:652
- [value] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:654
- [value] ningún matcher previo (2025 | (anio) => anio >= 2026) && else; e:656
- [value] retorno de obtenerPoliticaSolidaridad; e:657
- [value] retorno de obtenerParametrosCotizacionLegacy; e:660
- [value] sustitución de argumento exacto; e:662
- [value] argumento conservado sin afirmar cierre; e:664
- [value] argumento conservado sin afirmar cierre; e:665
- [value] retorno de calcularTotalSolidaridad; e:666
- [value] sustitución de argumento exacto; e:667
- [value] receptor de operación Decimal; e:668
- [value] argumento de div; e:669
- [value] retorno de repartirCotizacionSolidaridad; e:672
- [value] sustitución de argumento exacto; e:674
- [value] argumento de plus; e:676
- [value] retorno de sumarCotizacionesSociales; e:679
- [value] retorno de calcularDesgloseCotizacionesSocialesLegacy; e:683
- [value] retorno de calcularCotizacionesSocialesLegacy; e:687
- [value] ??; e:689
- [value] argumento de minus; e:691
- [value] receptor de operación Decimal; e:693
- [selection] sustitución por propiedad del argumento; e:696
- [selection] selección de elemento; e:697
- [value] argumento de minus; e:699
- [value] argumento de max; e:700
- [value] retorno de calcularRendimientoNetoTrabajo; e:702
- [value] si calcular devuelve; instrumentación no transforma el valor; e:703
- [value] sustitución por propiedad del argumento; e:706
- [value] receptor de operación Decimal; e:708
- [selection] binding único desde servicio anual; e:709
- [selection] sustitución por propiedad del argumento; e:712
- [selection] selecciona Match; e:713
- [selection] argumento conservado sin afirmar cierre; e:714
- [selection] argumento conservado sin afirmar cierre; e:715
- [selection] sustitución de argumento exacto; e:716
- [selection] argumento conservado sin afirmar cierre; e:717
- [selection] argumento conservado sin afirmar cierre; e:718
- [selection] argumento conservado sin afirmar cierre; e:719
- [selection] argumento conservado sin afirmar cierre; e:720
- [selection] retorno de sumarRendimientosCapitalInmobiliario; e:721
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:722
- [selection] sustitución por propiedad del argumento; e:725
- [selection] retorno de calcularRendimientoNetoCapitalInmobiliarioSimplificado; e:728
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:729
- [selection] receptor de operación Decimal; e:732
- [selection] argumento conservado sin afirmar cierre; e:733
- [selection] argumento conservado sin afirmar cierre; e:734
- [selection] sustitución por propiedad del argumento; e:736
- [selection] argumento conservado sin afirmar cierre; e:737
- [selection] argumento conservado sin afirmar cierre; e:738
- [selection] argumento conservado sin afirmar cierre; e:739
- [selection] argumento conservado sin afirmar cierre; e:740
- [selection] argumento conservado sin afirmar cierre; e:741
- [selection] retorno de calcularGananciasPatrimonialesPorTransmision; e:742
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:743
- [selection] argumento de plus; e:746
- [selection] receptor de operación Decimal; e:747
- [selection] argumento conservado sin afirmar cierre; e:748
- [selection] argumento conservado sin afirmar cierre; e:749
- [selection] argumento conservado sin afirmar cierre; e:750
- [selection] retorno de calcularGananciasPatrimonialesPorTransmision; e:751
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:752
- [selection] argumento de plus; e:755
- [selection] sustitución por propiedad del argumento; e:758
- [selection] receptor de operación Decimal; e:759
- [selection] argumento de gt; e:760
- [selection] anio matches () => otrasRentasNoExentas.gt(6500); e:761
- [selection] sustitución por propiedad del argumento; e:762
- [selection] <=; e:764
- [selection] selecciona rama; e:765
- [value] sustitución de argumento exacto; e:766
- [value] constructor Decimal; e:767
- [value] retorno de crearImporteMonetario; e:768
- [value] anio <= 2014; e:769
- [value] sustitución de argumento exacto; e:770
- [value] constructor Decimal; e:771
- [value] retorno de crearImporteMonetario; e:772
- [value] !(anio <= 2014); e:774
- [value] anio matches () => otrasRentasNoExentas.gt(6500); e:776
- [selection] sustitución de argumento exacto; e:777
- [selection] <=; e:779
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500)) && anio matches (anio) => anio <= 2014; e:780
- [selection] binding único desde servicio anual; e:781
- [selection] sustitución de argumento exacto; e:784
- [selection] argumento conservado sin afirmar cierre; e:785
- [selection] argumento conservado sin afirmar cierre; e:786
- [selection] argumento conservado sin afirmar cierre; e:787
- [selection] argumento conservado sin afirmar cierre; e:788
- [selection] retorno de sumarRendimientosTrabajo; e:789
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:790
- [selection] sustitución por propiedad del argumento; e:793
- [selection] receptor de operación Decimal; e:794
- [selection] selección de función; e:795
- [selection] selecciona rama; e:796
- [selection] binding único desde servicio anual; e:797
- [selection] sustitución de argumento exacto; e:800
- [selection] argumento conservado sin afirmar cierre; e:801
- [selection] argumento conservado sin afirmar cierre; e:802
- [selection] argumento conservado sin afirmar cierre; e:803
- [selection] argumento conservado sin afirmar cierre; e:804
- [selection] retorno de sumarRendimientosTrabajo; e:805
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:806
- [selection] sustitución por propiedad del argumento; e:809
- [selection] argumento de min; e:810
- [selection] sustitución de argumento exacto; e:811
- [selection] constructor Decimal; e:812
- [selection] retorno de crearImporteMonetario; e:813
- [selection] receptor de operación Decimal; e:814
- [selection] argumento de mul; e:815
- [selection] argumento de min; e:816
- [selection] receptor de operación Decimal; e:817
- [selection] argumento de mul; e:818
- [selection] receptor de operación Decimal; e:819
- [selection] sustitución por propiedad del argumento; e:820
- [selection] argumento de min; e:821
- [selection] sustitución de argumento exacto; e:822
- [selection] constructor Decimal; e:823
- [selection] retorno de crearImporteMonetario; e:824
- [selection] receptor de operación Decimal; e:825
- [selection] argumento de mul; e:826
- [selection] argumento de min; e:827
- [selection] receptor de operación Decimal; e:828
- [selection] argumento de mul; e:829
- [selection] argumento de plus; e:830
- [selection] receptor de operación Decimal; e:831
- [selection] argumento de div; e:832
- [selection] anio === 2018; e:833
- [selection] selecciona Match; e:834
- [selection] sustitución por propiedad del argumento; e:835
- [selection] sustitución por propiedad del argumento; e:837
- [selection] sustitución de argumento exacto; e:838
- [selection] sustitución de argumento exacto; e:839
- [selection] a.lessThan(b) matches true; e:840
- [selection] sustitución de argumento exacto; e:841
- [selection] ningún matcher previo (true) && else; e:842
- [selection] retorno de minimo; e:843
- [selection] retorno de baseCotizacionPara; e:846
- [selection] retorno de calcularDesgloseCotizacionesSocialesLegacy; e:850
- [selection] !(anio === 2018); e:853
- [selection] receptor de operación Decimal; e:855
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:859
- [selection] sustitución de argumento exacto; e:861
- [selection] argumento conservado sin afirmar cierre; e:863
- [selection] argumento conservado sin afirmar cierre; e:864
- [selection] sustitución de argumento exacto; e:865
- [selection] constructor Decimal; e:866
- [selection] retorno de crearImporteMonetario; e:867
- [selection] argumento conservado sin afirmar cierre; e:869
- [selection] argumento conservado sin afirmar cierre; e:870
- [selection] retorno de sumarTipoCotizacionLegacy; e:871
- [selection] argumento de mul; e:872
- [selection] receptor de operación Decimal; e:874
- [selection] receptor de operación Decimal; e:876
- [selection] selecciona Match; e:877
- [selection] sustitución de argumento exacto; e:878
- [selection] constructor Decimal; e:879
- [selection] retorno de crearImporteMonetario; e:880
- [selection] anio matches 2023; e:883
- [selection] sustitución de argumento exacto; e:884
- [selection] constructor Decimal; e:885
- [selection] retorno de crearImporteMonetario; e:886
- [selection] ningún matcher previo (2023) && anio matches 2024; e:889
- [selection] sustitución de argumento exacto; e:890
- [selection] constructor Decimal; e:891
- [selection] retorno de crearImporteMonetario; e:892
- [selection] ningún matcher previo (2023 | 2024) && anio matches 2025; e:895
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:896
- [selection] sustitución de argumento exacto; e:897
- [selection] constructor Decimal; e:898
- [selection] retorno de crearImporteMonetario; e:899
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:902
- [selection] sustitución de argumento exacto; e:903
- [selection] constructor Decimal; e:904
- [selection] retorno de crearImporteMonetario; e:905
- [selection] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:909
- [selection] retorno de obtenerTiposMei; e:910
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:913
- [selection] argumento de mul; e:917
- [selection] argumento de plus; e:919
- [selection] receptor de operación Decimal; e:920
- [selection] argumento de max; e:921
- [selection] sustitución por propiedad del argumento; e:922
- [selection] receptor de operación Decimal; e:923
- [selection] argumento de minus; e:925
- [selection] argumento de max; e:926
- [selection] sustitución de argumento exacto; e:928
- [selection] argumento de min; e:929
- [selection] selección de elemento; e:932
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:935
- [selection] sustitución de argumento exacto; e:938
- [selection] receptor de operación Decimal; e:939
- [selection] argumento de mul; e:940
- [selection] argumento de min; e:941
- [selection] receptor de operación Decimal; e:943
- [selection] selecciona Match; e:944
- [selection] anio matches 2025; e:951
- [selection] ningún matcher previo (2025) && anio matches 2026; e:958
- [selection] ningún matcher previo (2025 | 2026) && else; e:963
- [selection] sustitución de argumento exacto; e:966
- [selection] argumento de mul; e:968
- [selection] receptor de operación Decimal; e:969
- [selection] argumento de max; e:970
- [selection] sustitución de argumento exacto; e:971
- [selection] receptor de operación Decimal; e:972
- [selection] sustitución de argumento exacto; e:973
- [selection] receptor de operación Decimal; e:974
- [selection] argumento de mul; e:975
- [selection] argumento de minus; e:976
- [selection] argumento de max; e:977
- [selection] argumento de min; e:978
- [selection] sustitución de argumento exacto; e:979
- [selection] receptor de operación Decimal; e:980
- [selection] argumento de mul; e:981
- [selection] argumento de min; e:982
- [selection] receptor de operación Decimal; e:984
- [selection] selecciona Match; e:985
- [selection] anio matches 2025; e:992
- [selection] ningún matcher previo (2025) && anio matches 2026; e:999
- [selection] ningún matcher previo (2025 | 2026) && else; e:1004
- [selection] sustitución de argumento exacto; e:1007
- [selection] argumento de mul; e:1009
- [selection] argumento de plus; e:1010
- [selection] receptor de operación Decimal; e:1011
- [selection] argumento de max; e:1012
- [selection] sustitución de argumento exacto; e:1013
- [selection] receptor de operación Decimal; e:1014
- [selection] sustitución de argumento exacto; e:1015
- [selection] receptor de operación Decimal; e:1016
- [selection] argumento de mul; e:1017
- [selection] argumento de minus; e:1018
- [selection] argumento de max; e:1019
- [selection] receptor de operación Decimal; e:1021
- [selection] selecciona Match; e:1022
- [selection] anio matches 2025; e:1029
- [selection] ningún matcher previo (2025) && anio matches 2026; e:1036
- [selection] ningún matcher previo (2025 | 2026) && else; e:1041
- [selection] sustitución de argumento exacto; e:1044
- [selection] argumento de mul; e:1046
- [selection] argumento de plus; e:1047
- [selection] retorno de cuotaSolidaridad; e:1048
- [selection] argumento de plus; e:1050
- [selection] contexto.modo === "canonico" && (retorno de calcularDesgloseCotizacionesPerfilUniforme); e:1052
- [selection] selecciona Match; e:1053
- [selection] binding único desde servicio anual; e:1054
- [selection] sustitución de argumento exacto; e:1057
- [selection] argumento conservado sin afirmar cierre; e:1058
- [selection] argumento conservado sin afirmar cierre; e:1059
- [selection] argumento conservado sin afirmar cierre; e:1060
- [selection] argumento conservado sin afirmar cierre; e:1061
- [selection] retorno de sumarRendimientosTrabajo; e:1062
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1063
- [selection] sustitución por propiedad del argumento; e:1066
- [selection] sustitución de argumento exacto; e:1067
- [selection] sustitución de argumento exacto; e:1068
- [selection] a.lessThan(b) matches true; e:1069
- [selection] sustitución de argumento exacto; e:1070
- [selection] ningún matcher previo (true) && else; e:1071
- [selection] retorno de minimo; e:1072
- [selection] retorno de baseCotizacionPara; e:1075
- [selection] receptor de operación Decimal; e:1078
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:1082
- [selection] sustitución de argumento exacto; e:1084
- [selection] argumento conservado sin afirmar cierre; e:1086
- [selection] argumento conservado sin afirmar cierre; e:1087
- [selection] sustitución de argumento exacto; e:1088
- [selection] constructor Decimal; e:1089
- [selection] retorno de crearImporteMonetario; e:1090
- [selection] argumento conservado sin afirmar cierre; e:1092
- [selection] argumento conservado sin afirmar cierre; e:1093
- [selection] retorno de sumarTipoCotizacionLegacy; e:1094
- [selection] argumento de mul; e:1095
- [selection] sustitución de argumento exacto; e:1098
- [selection] receptor de operación Decimal; e:1100
- [selection] receptor de operación Decimal; e:1103
- [selection] selecciona Match; e:1104
- [selection] sustitución de argumento exacto; e:1105
- [selection] constructor Decimal; e:1106
- [selection] retorno de crearImporteMonetario; e:1107
- [selection] anio matches 2023; e:1110
- [selection] sustitución de argumento exacto; e:1111
- [selection] constructor Decimal; e:1112
- [selection] retorno de crearImporteMonetario; e:1113
- [selection] ningún matcher previo (2023) && anio matches 2024; e:1116
- [selection] sustitución de argumento exacto; e:1117
- [selection] constructor Decimal; e:1118
- [selection] retorno de crearImporteMonetario; e:1119
- [selection] ningún matcher previo (2023 | 2024) && anio matches 2025; e:1122
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:1123
- [selection] sustitución de argumento exacto; e:1124
- [selection] constructor Decimal; e:1125
- [selection] retorno de crearImporteMonetario; e:1126
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:1129
- [selection] sustitución de argumento exacto; e:1130
- [selection] constructor Decimal; e:1131
- [selection] retorno de crearImporteMonetario; e:1132
- [selection] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:1136
- [selection] retorno de obtenerTiposMei; e:1137
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:1140
- [selection] argumento de mul; e:1144
- [selection] sustitución de argumento exacto; e:1147
- [selection] argumento de plus; e:1149
- [selection] retorno de sumarCotizacionesSociales; e:1152
- [selection] sustitución de argumento exacto; e:1153
- [selection] receptor de operación Decimal; e:1155
- [selection] selecciona Match; e:1156
- [selection] anio matches 2025; e:1158
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:1159
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:1161
- [selection] ningún matcher previo (2025 | (anio) => anio >= 2026) && else; e:1163
- [selection] retorno de obtenerPoliticaSolidaridad; e:1164
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:1167
- [selection] sustitución de argumento exacto; e:1169
- [selection] argumento conservado sin afirmar cierre; e:1171
- [selection] argumento conservado sin afirmar cierre; e:1172
- [selection] retorno de calcularTotalSolidaridad; e:1173
- [selection] sustitución de argumento exacto; e:1174
- [selection] receptor de operación Decimal; e:1175
- [selection] argumento de div; e:1176
- [selection] retorno de repartirCotizacionSolidaridad; e:1179
- [selection] sustitución de argumento exacto; e:1181
- [selection] argumento de plus; e:1183
- [selection] retorno de sumarCotizacionesSociales; e:1186
- [selection] !(contexto.modo === "canonico") && (retorno de calcularDesgloseCotizacionesSocialesLegacy); e:1190
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1191
- [selection] sustitución por propiedad del argumento; e:1195
- [selection] selecciona Match; e:1197
- [selection] sustitución por propiedad del argumento; e:1198
- [selection] sustitución por propiedad del argumento; e:1200
- [selection] sustitución por propiedad del argumento; e:1202
- [selection] sustitución de argumento exacto; e:1203
- [selection] sustitución de argumento exacto; e:1204
- [selection] a.lessThan(b) matches true; e:1205
- [selection] sustitución de argumento exacto; e:1206
- [selection] ningún matcher previo (true) && else; e:1207
- [selection] retorno de minimo; e:1208
- [selection] retorno de baseCotizacionPara; e:1211
- [selection] receptor de operación Decimal; e:1214
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:1218
- [selection] sustitución de argumento exacto; e:1220
- [selection] argumento conservado sin afirmar cierre; e:1222
- [selection] argumento conservado sin afirmar cierre; e:1223
- [selection] sustitución de argumento exacto; e:1224
- [selection] constructor Decimal; e:1225
- [selection] retorno de crearImporteMonetario; e:1226
- [selection] argumento conservado sin afirmar cierre; e:1228
- [selection] argumento conservado sin afirmar cierre; e:1229
- [selection] retorno de sumarTipoCotizacionLegacy; e:1230
- [selection] argumento de mul; e:1231
- [selection] sustitución de argumento exacto; e:1234
- [selection] receptor de operación Decimal; e:1236
- [selection] receptor de operación Decimal; e:1239
- [selection] selecciona Match; e:1240
- [selection] sustitución de argumento exacto; e:1241
- [selection] constructor Decimal; e:1242
- [selection] retorno de crearImporteMonetario; e:1243
- [selection] anio matches 2023; e:1246
- [selection] sustitución de argumento exacto; e:1247
- [selection] constructor Decimal; e:1248
- [selection] retorno de crearImporteMonetario; e:1249
- [selection] ningún matcher previo (2023) && anio matches 2024; e:1252
- [selection] sustitución de argumento exacto; e:1253
- [selection] constructor Decimal; e:1254
- [selection] retorno de crearImporteMonetario; e:1255
- [selection] ningún matcher previo (2023 | 2024) && anio matches 2025; e:1258
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:1259
- [selection] sustitución de argumento exacto; e:1260
- [selection] constructor Decimal; e:1261
- [selection] retorno de crearImporteMonetario; e:1262
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:1265
- [selection] sustitución de argumento exacto; e:1266
- [selection] constructor Decimal; e:1267
- [selection] retorno de crearImporteMonetario; e:1268
- [selection] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:1272
- [selection] retorno de obtenerTiposMei; e:1273
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:1276
- [selection] argumento de mul; e:1280
- [selection] sustitución de argumento exacto; e:1283
- [selection] argumento de plus; e:1285
- [selection] retorno de sumarCotizacionesSociales; e:1288
- [selection] sustitución de argumento exacto; e:1289
- [selection] receptor de operación Decimal; e:1291
- [selection] selecciona Match; e:1292
- [selection] anio matches 2025; e:1294
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:1295
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:1297
- [selection] ningún matcher previo (2025 | (anio) => anio >= 2026) && else; e:1299
- [selection] retorno de obtenerPoliticaSolidaridad; e:1300
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:1303
- [selection] sustitución de argumento exacto; e:1305
- [selection] argumento conservado sin afirmar cierre; e:1307
- [selection] argumento conservado sin afirmar cierre; e:1308
- [selection] retorno de calcularTotalSolidaridad; e:1309
- [selection] sustitución de argumento exacto; e:1310
- [selection] receptor de operación Decimal; e:1311
- [selection] argumento de div; e:1312
- [selection] retorno de repartirCotizacionSolidaridad; e:1315
- [selection] sustitución de argumento exacto; e:1317
- [selection] argumento de plus; e:1319
- [selection] retorno de sumarCotizacionesSociales; e:1322
- [selection] retorno de calcularDesgloseCotizacionesSocialesLegacy; e:1326
- [selection] retorno de calcularCotizacionesSocialesLegacy; e:1330
- [selection] ??; e:1332
- [selection] argumento de minus; e:1334
- [selection] retorno de calcularRendimientoNetoTrabajo; e:1337
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1338
- [selection] sustitución por propiedad del argumento; e:1342
- [selection] sustitución de argumento exacto; e:1343
- [selection] selecciona Match; e:1344
- [selection] sustitución de argumento exacto; e:1345
- [selection] receptor de operación Decimal; e:1346
- [selection] argumento de lte; e:1347
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180); e:1348
- [value] sustitución de argumento exacto; e:1349
- [value] constructor Decimal; e:1350
- [value] retorno de crearImporteMonetario; e:1351
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180); e:1352
- [selection] sustitución de argumento exacto; e:1353
- [selection] receptor de operación Decimal; e:1354
- [selection] argumento de lte; e:1355
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260); e:1356
- [value] sustitución de argumento exacto; e:1357
- [value] constructor Decimal; e:1358
- [value] retorno de crearImporteMonetario; e:1359
- [value] receptor de operación Decimal; e:1360
- [value] sustitución de argumento exacto; e:1361
- [value] constructor Decimal; e:1362
- [value] retorno de crearImporteMonetario; e:1363
- [value] receptor de operación Decimal; e:1364
- [value] retorno de calcularRendimientoNetoTrabajo; e:1367
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1368
- [value] sustitución por propiedad del argumento; e:1372
- [value] sustitución de argumento exacto; e:1373
- [value] receptor de operación Decimal; e:1374
- [value] argumento de minus; e:1375
- [value] argumento de mul; e:1376
- [value] argumento de minus; e:1377
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260); e:1378
- [value] sustitución de argumento exacto; e:1379
- [value] constructor Decimal; e:1380
- [value] retorno de crearImporteMonetario; e:1381
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260)) && else; e:1382
- [value] retorno de reduccionTrabajoHasta2014; e:1383
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500)) && anio matches (anio) => anio <= 2014; e:1384
- [selection] sustitución de argumento exacto; e:1385
- [selection] <=; e:1387
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014) && anio matches (anio) => anio <= 2017; e:1388
- [selection] sustitución por propiedad del argumento; e:1389
- [selection] sustitución de argumento exacto; e:1390
- [selection] selecciona Match; e:1391
- [selection] sustitución de argumento exacto; e:1392
- [selection] receptor de operación Decimal; e:1393
- [selection] argumento de lte; e:1394
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1395
- [value] sustitución de argumento exacto; e:1396
- [value] constructor Decimal; e:1397
- [value] retorno de crearImporteMonetario; e:1398
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1399
- [selection] sustitución de argumento exacto; e:1400
- [selection] receptor de operación Decimal; e:1401
- [selection] argumento de lte; e:1402
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1403
- [value] sustitución de argumento exacto; e:1404
- [value] constructor Decimal; e:1405
- [value] retorno de crearImporteMonetario; e:1406
- [value] receptor de operación Decimal; e:1407
- [value] sustitución de argumento exacto; e:1408
- [value] constructor Decimal; e:1409
- [value] retorno de crearImporteMonetario; e:1410
- [value] receptor de operación Decimal; e:1411
- [value] sustitución por propiedad del argumento; e:1412
- [value] sustitución de argumento exacto; e:1413
- [value] receptor de operación Decimal; e:1414
- [value] argumento de minus; e:1415
- [value] argumento de mul; e:1416
- [value] argumento de minus; e:1417
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1418
- [value] sustitución de argumento exacto; e:1419
- [value] constructor Decimal; e:1420
- [value] retorno de crearImporteMonetario; e:1421
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:1423
- [value] retorno de reduccionTrabajo2015A2017; e:1424
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014) && anio matches (anio) => anio <= 2017; e:1425
- [selection] argumento conservado sin afirmar cierre; e:1426
- [selection] argumento conservado sin afirmar cierre; e:1427
- [selection] retorno de fallecidoAntesDeFechaCivil; e:1428
- [selection] selecciona Match; e:1429
- [selection] sustitución por propiedad del argumento; e:1430
- [selection] sustitución por propiedad del argumento; e:1432
- [selection] sustitución de argumento exacto; e:1433
- [selection] selecciona Match; e:1434
- [selection] sustitución de argumento exacto; e:1435
- [selection] receptor de operación Decimal; e:1436
- [selection] argumento de lte; e:1437
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1438
- [value] sustitución de argumento exacto; e:1439
- [value] constructor Decimal; e:1440
- [value] retorno de crearImporteMonetario; e:1441
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1442
- [selection] sustitución de argumento exacto; e:1443
- [selection] receptor de operación Decimal; e:1444
- [selection] argumento de lte; e:1445
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1446
- [value] sustitución de argumento exacto; e:1447
- [value] constructor Decimal; e:1448
- [value] retorno de crearImporteMonetario; e:1449
- [value] receptor de operación Decimal; e:1450
- [value] sustitución de argumento exacto; e:1451
- [value] constructor Decimal; e:1452
- [value] retorno de crearImporteMonetario; e:1453
- [value] receptor de operación Decimal; e:1454
- [value] sustitución por propiedad del argumento; e:1455
- [value] sustitución por propiedad del argumento; e:1457
- [value] sustitución de argumento exacto; e:1458
- [value] receptor de operación Decimal; e:1459
- [value] argumento de minus; e:1460
- [value] argumento de mul; e:1461
- [value] argumento de minus; e:1462
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1463
- [value] sustitución de argumento exacto; e:1464
- [value] constructor Decimal; e:1465
- [value] retorno de crearImporteMonetario; e:1466
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:1468
- [value] retorno de reduccionTrabajo2015A2017; e:1469
- [value] fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    }) matches true; e:1471
- [selection] sustitución por propiedad del argumento; e:1472
- [selection] sustitución de argumento exacto; e:1473
- [selection] selecciona Match; e:1474
- [selection] sustitución de argumento exacto; e:1475
- [selection] receptor de operación Decimal; e:1476
- [selection] argumento de lte; e:1477
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1478
- [value] sustitución de argumento exacto; e:1479
- [value] constructor Decimal; e:1480
- [value] retorno de crearImporteMonetario; e:1481
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1482
- [selection] sustitución de argumento exacto; e:1483
- [selection] receptor de operación Decimal; e:1484
- [selection] argumento de lte; e:1485
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1486
- [value] sustitución de argumento exacto; e:1487
- [value] constructor Decimal; e:1488
- [value] retorno de crearImporteMonetario; e:1489
- [value] receptor de operación Decimal; e:1490
- [value] sustitución de argumento exacto; e:1491
- [value] constructor Decimal; e:1492
- [value] retorno de crearImporteMonetario; e:1493
- [value] receptor de operación Decimal; e:1494
- [value] sustitución por propiedad del argumento; e:1495
- [value] sustitución de argumento exacto; e:1496
- [value] receptor de operación Decimal; e:1497
- [value] argumento de minus; e:1498
- [value] argumento de mul; e:1499
- [value] argumento de minus; e:1500
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1501
- [value] sustitución de argumento exacto; e:1502
- [value] constructor Decimal; e:1503
- [value] retorno de crearImporteMonetario; e:1504
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:1506
- [value] retorno de reduccionTrabajo2015A2017; e:1507
- [value] receptor de operación Decimal; e:1509
- [selection] sustitución de argumento exacto; e:1510
- [selection] constructor Decimal; e:1511
- [selection] retorno de crearImporteMonetario; e:1512
- [selection] sustitución de argumento exacto; e:1514
- [selection] selecciona Match; e:1515
- [selection] sustitución por propiedad del argumento; e:1516
- [selection] sustitución de argumento exacto; e:1517
- [selection] selecciona Match; e:1518
- [selection] sustitución de argumento exacto; e:1519
- [selection] receptor de operación Decimal; e:1520
- [selection] argumento de lte; e:1521
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:1522
- [selection] sustitución de argumento exacto; e:1523
- [selection] constructor Decimal; e:1524
- [selection] retorno de crearImporteMonetario; e:1525
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:1526
- [selection] sustitución de argumento exacto; e:1527
- [selection] receptor de operación Decimal; e:1528
- [selection] argumento de lte; e:1529
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:1530
- [selection] sustitución de argumento exacto; e:1531
- [selection] constructor Decimal; e:1532
- [selection] retorno de crearImporteMonetario; e:1533
- [selection] sustitución de argumento exacto; e:1535
- [selection] selecciona Match; e:1536
- [selection] sustitución de argumento exacto; e:1537
- [selection] constructor Decimal; e:1538
- [selection] retorno de crearImporteMonetario; e:1539
- [selection] receptor de operación Decimal; e:1540
- [selection] sustitución de argumento exacto; e:1541
- [selection] constructor Decimal; e:1542
- [selection] retorno de crearImporteMonetario; e:1543
- [selection] receptor de operación Decimal; e:1544
- [selection] sustitución de argumento exacto; e:1545
- [selection] receptor de operación Decimal; e:1546
- [selection] argumento de minus; e:1547
- [selection] argumento de mul; e:1548
- [selection] argumento de minus; e:1549
- [selection] sustitución de argumento exacto; e:1550
- [selection] argumento conservado sin afirmar cierre; e:1551
- [selection] a matches (a) => a.greaterThan(b); e:1552
- [selection] sustitución de argumento exacto; e:1553
- [selection] a matches (a) => a.greaterThan(b); e:1554
- [selection] sustitución de argumento exacto; e:1555
- [selection] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:1556
- [selection] retorno de maximo; e:1557
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:1558
- [selection] sustitución de argumento exacto; e:1559
- [selection] constructor Decimal; e:1560
- [selection] retorno de crearImporteMonetario; e:1561
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825)) && else; e:1563
- [selection] retorno de reduccionTrabajo2019A2022; e:1564
- [selection] receptor de operación Decimal; e:1566
- [selection] selecciona Match; e:1567
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1568
- [selection] sustitución de argumento exacto; e:1569
- [selection] constructor Decimal; e:1570
- [selection] retorno de crearImporteMonetario; e:1571
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:1572
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1573
- [selection] sustitución de argumento exacto; e:1574
- [selection] constructor Decimal; e:1575
- [selection] retorno de crearImporteMonetario; e:1576
- [selection] receptor de operación Decimal; e:1577
- [selection] sustitución de argumento exacto; e:1578
- [selection] constructor Decimal; e:1579
- [selection] retorno de crearImporteMonetario; e:1580
- [selection] receptor de operación Decimal; e:1581
- [selection] sustitución de argumento exacto; e:1582
- [selection] receptor de operación Decimal; e:1583
- [selection] argumento de minus; e:1584
- [selection] argumento de mul; e:1585
- [selection] argumento de minus; e:1586
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:1587
- [selection] sustitución de argumento exacto; e:1588
- [selection] constructor Decimal; e:1589
- [selection] retorno de crearImporteMonetario; e:1590
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:1592
- [selection] retorno de reduccionTrabajo2015A2017; e:1593
- [selection] argumento de minus; e:1595
- [selection] sustitución de argumento exacto; e:1596
- [selection] argumento conservado sin afirmar cierre; e:1597
- [selection] a matches (a) => a.greaterThan(b); e:1598
- [value] sustitución de argumento exacto; e:1599
- [value] constructor Decimal; e:1600
- [value] retorno de crearImporteMonetario; e:1601
- [value] sustitución de argumento exacto; e:1603
- [value] a matches (a) => a.greaterThan(b); e:1604
- [selection] selecciona Match; e:1605
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:1606
- [value] sustitución de argumento exacto; e:1607
- [value] constructor Decimal; e:1608
- [value] retorno de crearImporteMonetario; e:1609
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:1610
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:1611
- [selection] selecciona Match; e:1612
- [selection] a matches (a) => a.greaterThan(b); e:1613
- [value] sustitución de argumento exacto; e:1614
- [value] constructor Decimal; e:1615
- [value] retorno de crearImporteMonetario; e:1616
- [value] sustitución de argumento exacto; e:1618
- [value] a matches (a) => a.greaterThan(b); e:1619
- [value] sustitución de argumento exacto; e:1620
- [value] constructor Decimal; e:1621
- [value] retorno de crearImporteMonetario; e:1622
- [value] receptor de operación Decimal; e:1623
- [value] sustitución de argumento exacto; e:1624
- [value] constructor Decimal; e:1625
- [value] retorno de crearImporteMonetario; e:1626
- [value] receptor de operación Decimal; e:1627
- [value] sustitución por propiedad del argumento; e:1628
- [value] sustitución de argumento exacto; e:1629
- [value] receptor de operación Decimal; e:1630
- [value] argumento de minus; e:1631
- [value] argumento de mul; e:1632
- [value] argumento de minus; e:1633
- [value] sustitución de argumento exacto; e:1634
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:1635
- [value] retorno de maximo; e:1636
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:1637
- [value] sustitución de argumento exacto; e:1638
- [value] constructor Decimal; e:1639
- [value] retorno de crearImporteMonetario; e:1640
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825)) && else; e:1642
- [value] retorno de reduccionTrabajo2019A2022; e:1643
- [value] receptor de operación Decimal; e:1645
- [value] argumento de minus; e:1647
- [value] sustitución de argumento exacto; e:1648
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:1649
- [value] retorno de maximo; e:1650
- [value] receptor de operación Decimal; e:1651
- [value] argumento de div; e:1652
- [value] argumento de plus; e:1653
- [value] ningún matcher previo (true) && else; e:1654
- [value] retorno de reduccionTrabajo2018; e:1655
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017) && anio matches 2018; e:1656
- [selection] sustitución de argumento exacto; e:1657
- [selection] <=; e:1659
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018) && anio matches (anio) => anio <= 2022; e:1660
- [selection] sustitución por propiedad del argumento; e:1661
- [selection] sustitución de argumento exacto; e:1662
- [selection] selecciona Match; e:1663
- [selection] sustitución de argumento exacto; e:1664
- [selection] receptor de operación Decimal; e:1665
- [selection] argumento de lte; e:1666
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:1667
- [value] sustitución de argumento exacto; e:1668
- [value] constructor Decimal; e:1669
- [value] retorno de crearImporteMonetario; e:1670
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:1671
- [selection] sustitución de argumento exacto; e:1672
- [selection] receptor de operación Decimal; e:1673
- [selection] argumento de lte; e:1674
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:1675
- [selection] sustitución de argumento exacto; e:1676
- [selection] constructor Decimal; e:1677
- [selection] retorno de crearImporteMonetario; e:1678
- [selection] sustitución de argumento exacto; e:1680
- [selection] selecciona Match; e:1681
- [selection] sustitución de argumento exacto; e:1682
- [selection] constructor Decimal; e:1683
- [selection] retorno de crearImporteMonetario; e:1684
- [selection] receptor de operación Decimal; e:1685
- [selection] sustitución de argumento exacto; e:1686
- [selection] constructor Decimal; e:1687
- [selection] retorno de crearImporteMonetario; e:1688
- [selection] receptor de operación Decimal; e:1689
- [selection] sustitución de argumento exacto; e:1690
- [selection] receptor de operación Decimal; e:1691
- [selection] argumento de minus; e:1692
- [selection] argumento de mul; e:1693
- [selection] argumento de minus; e:1694
- [selection] sustitución de argumento exacto; e:1695
- [selection] argumento conservado sin afirmar cierre; e:1696
- [selection] a matches (a) => a.greaterThan(b); e:1697
- [value] sustitución de argumento exacto; e:1698
- [value] constructor Decimal; e:1699
- [value] retorno de crearImporteMonetario; e:1700
- [value] sustitución de argumento exacto; e:1702
- [value] a matches (a) => a.greaterThan(b); e:1703
- [value] sustitución de argumento exacto; e:1704
- [value] constructor Decimal; e:1705
- [value] retorno de crearImporteMonetario; e:1706
- [value] receptor de operación Decimal; e:1707
- [value] sustitución de argumento exacto; e:1708
- [value] constructor Decimal; e:1709
- [value] retorno de crearImporteMonetario; e:1710
- [value] receptor de operación Decimal; e:1711
- [value] sustitución por propiedad del argumento; e:1712
- [value] sustitución de argumento exacto; e:1713
- [value] receptor de operación Decimal; e:1714
- [value] argumento de minus; e:1715
- [value] argumento de mul; e:1716
- [value] argumento de minus; e:1717
- [value] sustitución de argumento exacto; e:1718
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:1719
- [value] retorno de maximo; e:1720
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:1721
- [value] sustitución de argumento exacto; e:1722
- [value] constructor Decimal; e:1723
- [value] retorno de crearImporteMonetario; e:1724
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825)) && else; e:1726
- [value] retorno de reduccionTrabajo2019A2022; e:1727
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018) && anio matches (anio) => anio <= 2022; e:1728
- [selection] sustitución por propiedad del argumento; e:1729
- [selection] sustitución de argumento exacto; e:1730
- [selection] selecciona Match; e:1731
- [selection] sustitución de argumento exacto; e:1732
- [selection] receptor de operación Decimal; e:1733
- [selection] argumento de lte; e:1734
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"); e:1735
- [value] sustitución de argumento exacto; e:1736
- [value] constructor Decimal; e:1737
- [value] retorno de crearImporteMonetario; e:1738
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"); e:1739
- [selection] sustitución de argumento exacto; e:1740
- [selection] receptor de operación Decimal; e:1741
- [selection] argumento de lte; e:1742
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"); e:1743
- [selection] sustitución de argumento exacto; e:1744
- [selection] constructor Decimal; e:1745
- [selection] retorno de crearImporteMonetario; e:1746
- [selection] sustitución de argumento exacto; e:1748
- [selection] selecciona Match; e:1749
- [selection] sustitución de argumento exacto; e:1750
- [selection] constructor Decimal; e:1751
- [selection] retorno de crearImporteMonetario; e:1752
- [selection] receptor de operación Decimal; e:1753
- [selection] sustitución de argumento exacto; e:1754
- [selection] constructor Decimal; e:1755
- [selection] retorno de crearImporteMonetario; e:1756
- [selection] receptor de operación Decimal; e:1757
- [selection] sustitución de argumento exacto; e:1758
- [selection] receptor de operación Decimal; e:1759
- [selection] argumento de minus; e:1760
- [selection] argumento de mul; e:1761
- [selection] argumento de minus; e:1762
- [selection] sustitución de argumento exacto; e:1763
- [selection] argumento conservado sin afirmar cierre; e:1764
- [selection] a matches (a) => a.greaterThan(b); e:1765
- [value] sustitución de argumento exacto; e:1766
- [value] constructor Decimal; e:1767
- [value] retorno de crearImporteMonetario; e:1768
- [value] sustitución de argumento exacto; e:1770
- [value] a matches (a) => a.greaterThan(b); e:1771
- [value] sustitución de argumento exacto; e:1772
- [value] constructor Decimal; e:1773
- [value] retorno de crearImporteMonetario; e:1774
- [value] receptor de operación Decimal; e:1775
- [value] sustitución de argumento exacto; e:1776
- [value] constructor Decimal; e:1777
- [value] retorno de crearImporteMonetario; e:1778
- [value] receptor de operación Decimal; e:1779
- [value] sustitución por propiedad del argumento; e:1780
- [value] sustitución de argumento exacto; e:1781
- [value] receptor de operación Decimal; e:1782
- [value] argumento de minus; e:1783
- [value] argumento de mul; e:1784
- [value] argumento de minus; e:1785
- [value] sustitución de argumento exacto; e:1786
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:1787
- [value] retorno de maximo; e:1788
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"); e:1789
- [value] sustitución de argumento exacto; e:1790
- [value] constructor Decimal; e:1791
- [value] retorno de crearImporteMonetario; e:1792
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50") | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50")) && else; e:1794
- [value] retorno de reduccionTrabajo2023; e:1795
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018 | (anio) => anio <= 2022) && anio matches 2023; e:1796
- [selection] sustitución por propiedad del argumento; e:1797
- [selection] sustitución de argumento exacto; e:1798
- [selection] selecciona Match; e:1799
- [selection] sustitución de argumento exacto; e:1800
- [selection] receptor de operación Decimal; e:1801
- [selection] argumento de lte; e:1802
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852); e:1803
- [value] sustitución de argumento exacto; e:1804
- [value] constructor Decimal; e:1805
- [value] retorno de crearImporteMonetario; e:1806
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852); e:1807
- [selection] sustitución de argumento exacto; e:1808
- [selection] receptor de operación Decimal; e:1809
- [selection] argumento de lte; e:1810
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"); e:1811
- [value] sustitución de argumento exacto; e:1812
- [value] constructor Decimal; e:1813
- [value] retorno de crearImporteMonetario; e:1814
- [value] receptor de operación Decimal; e:1815
- [value] sustitución de argumento exacto; e:1816
- [value] constructor Decimal; e:1817
- [value] retorno de crearImporteMonetario; e:1818
- [value] receptor de operación Decimal; e:1819
- [value] sustitución por propiedad del argumento; e:1820
- [value] sustitución de argumento exacto; e:1821
- [value] receptor de operación Decimal; e:1822
- [value] argumento de minus; e:1823
- [value] argumento de mul; e:1824
- [value] argumento de minus; e:1825
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"); e:1826
- [selection] sustitución de argumento exacto; e:1827
- [selection] receptor de operación Decimal; e:1828
- [selection] argumento de lt; e:1829
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"); e:1830
- [value] sustitución de argumento exacto; e:1831
- [value] constructor Decimal; e:1832
- [value] retorno de crearImporteMonetario; e:1833
- [value] receptor de operación Decimal; e:1834
- [value] sustitución de argumento exacto; e:1835
- [value] constructor Decimal; e:1836
- [value] retorno de crearImporteMonetario; e:1837
- [value] receptor de operación Decimal; e:1838
- [value] sustitución de argumento exacto; e:1839
- [value] receptor de operación Decimal; e:1840
- [value] argumento de minus; e:1841
- [value] argumento de mul; e:1842
- [value] argumento de minus; e:1843
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"); e:1844
- [value] sustitución de argumento exacto; e:1845
- [value] constructor Decimal; e:1846
- [value] retorno de crearImporteMonetario; e:1847
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52") | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50")) && else; e:1849
- [value] retorno de reduccionTrabajoDesde2024; e:1850
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018 | (anio) => anio <= 2022 | 2023) && else; e:1851
- [value] retorno de calcularReduccionTrabajoConOtrasRentas; e:1852
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1853
- [value] sustitución por propiedad del argumento; e:1856
- [value] ??; e:1858
- [value] argumento de minus; e:1859
- [value] argumento de max; e:1860
- [value] receptor de operación Decimal; e:1861
- [value] argumento conservado sin afirmar cierre; e:1862
- [value] argumento conservado sin afirmar cierre; e:1863
- [value] sustitución de argumento exacto; e:1864
- [value] argumento conservado sin afirmar cierre; e:1865
- [value] argumento conservado sin afirmar cierre; e:1866
- [value] argumento conservado sin afirmar cierre; e:1867
- [value] argumento conservado sin afirmar cierre; e:1868
- [value] retorno de sumarRendimientosCapitalInmobiliario; e:1869
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1870
- [value] sustitución por propiedad del argumento; e:1873
- [value] retorno de calcularRendimientoNetoCapitalInmobiliarioSimplificado; e:1876
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1877
- [value] sustitución por propiedad del argumento; e:1880
- [value] ??; e:1883
- [value] argumento de plus; e:1884
- [value] receptor de operación Decimal; e:1885
- [value] argumento conservado sin afirmar cierre; e:1886
- [value] argumento conservado sin afirmar cierre; e:1887
- [value] argumento conservado sin afirmar cierre; e:1888
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:1889
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1890
- [value] sustitución por propiedad del argumento; e:1894
- [value] ??; e:1896
- [value] argumento de plus; e:1897
- [value] retorno de calcularBaseImponibleGeneral; e:1898
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1899
- [selection] sustitución por propiedad del argumento; e:1904
- [selection] sustitución por propiedad del argumento; e:1906
- [selection] !==; e:1908
- [selection] selecciona rama; e:1909
- [selection] argumento de max; e:1910
- [selection] sustitución por propiedad del argumento; e:1913
- [selection] argumento de max; e:1915
- [selection] retorno de calcularBaseImponibleAhorro; e:1916
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1917
- [selection] sustitución por propiedad del argumento; e:1920
- [selection] sustitución por propiedad del argumento; e:1922
- [selection] sustitución por propiedad del argumento; e:1924
- [selection] selecciona Match; e:1925
- [selection] sustitución de argumento exacto; e:1926
- [selection] receptor de operación Decimal; e:1927
- [selection] argumento de lte; e:1928
- [selection] base matches (base) => base.lte(0); e:1929
- [value] base matches (base) => base.lte(0); e:1930
- [selection] binding único desde servicio anual; e:1931
- [selection] sustitución por propiedad del argumento; e:1934
- [selection] sustitución de argumento exacto; e:1935
- [selection] selecciona Match; e:1936
- [value] anio matches 2012; e:1939
- [value] ningún matcher previo (2012) && anio matches 2013; e:1942
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:1944
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:1946
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:1949
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:1952
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:1955
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:1958
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:1960
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:1963
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:1965
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:1968
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:1970
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && else; e:1972
- [value] retorno de obtenerTramosIrpfAhorro; e:1973
- [value] sustitución por propiedad del argumento; e:1975
- [value] sustitución por propiedad del argumento; e:1977
- [value] argumento conservado sin afirmar cierre; e:1978
- [value] argumento conservado sin afirmar cierre; e:1979
- [value] argumento conservado sin afirmar cierre; e:1980
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:1982
- [value] !(escalasPublicadas !== undefined); e:1983
- [value] retorno de calcularDesgloseCuotaPorEscala; e:1984
- [value] argumento conservado sin afirmar cierre; e:1985
- [value] sustitución por propiedad del argumento; e:1988
- [value] sustitución por propiedad del argumento; e:1990
- [value] receptor de operación Decimal; e:1991
- [value] argumento de mul; e:1992
- [value] argumento conservado sin afirmar cierre; e:1993
- [value] argumento conservado sin afirmar cierre; e:1994
- [value] retorno de calcularCuotaPorEscala; e:1995
- [value] retorno de calcularCuotaPorEscalaAhorro; e:1996
- [selection] binding único desde servicio anual; e:2001
- [selection] sustitución por propiedad del argumento; e:2004
- [selection] selecciona Match; e:2005
- [selection] retorno de resolverParametrosComunidadAutonoma2012; e:2006
- [selection] anio matches 2012; e:2007
- [selection] retorno de resolverParametrosComunidadAutonoma2013; e:2008
- [selection] ningún matcher previo (2012) && anio matches 2013; e:2009
- [selection] retorno de resolverParametrosComunidadAutonoma2014; e:2010
- [selection] ningún matcher previo (2012 | 2013) && anio matches 2014; e:2011
- [selection] retorno de resolverParametrosComunidadAutonoma2015; e:2012
- [selection] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:2013
- [selection] retorno de resolverParametrosComunidadAutonoma2016; e:2014
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:2015
- [selection] retorno de resolverParametrosComunidadAutonoma2017; e:2016
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:2017
- [selection] retorno de resolverParametrosComunidadAutonoma2018; e:2018
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:2019
- [selection] retorno de resolverParametrosComunidadAutonoma2019; e:2020
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:2021
- [selection] retorno de resolverParametrosComunidadAutonoma2020; e:2022
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:2023
- [selection] retorno de resolverParametrosComunidadAutonoma2021; e:2024
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:2025
- [selection] retorno de resolverParametrosComunidadAutonoma2022; e:2026
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:2027
- [selection] retorno de resolverParametrosComunidadAutonoma2023; e:2028
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:2029
- [selection] retorno de resolverParametrosComunidadAutonoma2024; e:2030
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:2031
- [selection] retorno de resolverParametrosComunidadAutonoma2025; e:2032
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:2033
- [selection] binding único desde servicio anual; e:2034
- [selection] sustitución por propiedad del argumento; e:2037
- [selection] sustitución de argumento exacto; e:2038
- [selection] selecciona Match; e:2039
- [selection] comunidadAutonoma matches "simulada-estatal"; e:2040
- [selection] ningún matcher previo ("simulada-estatal") && else; e:2041
- [selection] retorno de resolverParametrosComunidadAutonoma2026; e:2042
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:2043
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:2044
- [selection] retorno de obtenerParametrosComunidadAutonomaPuro; e:2045
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:2046
- [selection] argumento conservado sin afirmar cierre; e:2048
- [selection] argumento conservado sin afirmar cierre; e:2049
- [selection] binding único desde servicio anual; e:2056
- [selection] <=; e:2059
- [selection] binding único desde servicio anual; e:2061
- [selection] !==; e:2064
- [selection] &&; e:2065
- [selection] selecciona rama; e:2066
- [selection] caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"; e:2067
- [selection] !(caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"); e:2068
- [selection] sustitución por propiedad del argumento; e:2071
- [selection] sustitución por propiedad del argumento; e:2073
- [selection] !==; e:2075
- [selection] argumento de max; e:2088
- [selection] argumento de max; e:2089
- [selection] receptor de operación Decimal; e:2091
- [selection] selección de elemento; e:2094
- [selection] argumento de minus; e:2096
- [selection] argumento de max; e:2097
- [selection] retorno de calcularRendimientoNetoTrabajo; e:2099
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:2100
- [selection] sustitución por propiedad del argumento; e:2103
- [selection] receptor de operación Decimal; e:2105
- [selection] selecciona Match; e:2106
- [selection] anio matches () => otrasRentasNoExentas.gt(6500); e:2107
- [selection] selecciona rama; e:2108
- [selection] sustitución de argumento exacto; e:2109
- [selection] constructor Decimal; e:2110
- [selection] retorno de crearImporteMonetario; e:2111
- [selection] anio <= 2014; e:2112
- [selection] sustitución de argumento exacto; e:2113
- [selection] constructor Decimal; e:2114
- [selection] retorno de crearImporteMonetario; e:2115
- [selection] !(anio <= 2014); e:2117
- [selection] anio matches () => otrasRentasNoExentas.gt(6500); e:2119
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500)) && anio matches (anio) => anio <= 2014; e:2120
- [selection] selecciona Match; e:2121
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180); e:2122
- [selection] sustitución de argumento exacto; e:2123
- [selection] constructor Decimal; e:2124
- [selection] retorno de crearImporteMonetario; e:2125
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180); e:2126
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260); e:2127
- [selection] sustitución de argumento exacto; e:2128
- [selection] constructor Decimal; e:2129
- [selection] retorno de crearImporteMonetario; e:2130
- [selection] receptor de operación Decimal; e:2131
- [selection] sustitución de argumento exacto; e:2132
- [selection] constructor Decimal; e:2133
- [selection] retorno de crearImporteMonetario; e:2134
- [selection] receptor de operación Decimal; e:2135
- [selection] sustitución de argumento exacto; e:2136
- [selection] receptor de operación Decimal; e:2137
- [selection] argumento de minus; e:2138
- [selection] argumento de mul; e:2139
- [selection] argumento de minus; e:2140
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260); e:2141
- [selection] sustitución de argumento exacto; e:2142
- [selection] constructor Decimal; e:2143
- [selection] retorno de crearImporteMonetario; e:2144
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260)) && else; e:2145
- [selection] retorno de reduccionTrabajoHasta2014; e:2146
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500)) && anio matches (anio) => anio <= 2014; e:2147
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014) && anio matches (anio) => anio <= 2017; e:2148
- [selection] selecciona Match; e:2149
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2150
- [selection] sustitución de argumento exacto; e:2151
- [selection] constructor Decimal; e:2152
- [selection] retorno de crearImporteMonetario; e:2153
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2154
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2155
- [selection] sustitución de argumento exacto; e:2156
- [selection] constructor Decimal; e:2157
- [selection] retorno de crearImporteMonetario; e:2158
- [selection] receptor de operación Decimal; e:2159
- [selection] sustitución de argumento exacto; e:2160
- [selection] constructor Decimal; e:2161
- [selection] retorno de crearImporteMonetario; e:2162
- [selection] receptor de operación Decimal; e:2163
- [selection] sustitución de argumento exacto; e:2164
- [selection] receptor de operación Decimal; e:2165
- [selection] argumento de minus; e:2166
- [selection] argumento de mul; e:2167
- [selection] argumento de minus; e:2168
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2169
- [selection] sustitución de argumento exacto; e:2170
- [selection] constructor Decimal; e:2171
- [selection] retorno de crearImporteMonetario; e:2172
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:2174
- [selection] retorno de reduccionTrabajo2015A2017; e:2175
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014) && anio matches (anio) => anio <= 2017; e:2176
- [selection] selecciona Match; e:2177
- [selection] selecciona Match; e:2178
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2179
- [selection] sustitución de argumento exacto; e:2180
- [selection] constructor Decimal; e:2181
- [selection] retorno de crearImporteMonetario; e:2182
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2183
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2184
- [selection] sustitución de argumento exacto; e:2185
- [selection] constructor Decimal; e:2186
- [selection] retorno de crearImporteMonetario; e:2187
- [selection] receptor de operación Decimal; e:2188
- [selection] sustitución de argumento exacto; e:2189
- [selection] constructor Decimal; e:2190
- [selection] retorno de crearImporteMonetario; e:2191
- [selection] receptor de operación Decimal; e:2192
- [selection] sustitución de argumento exacto; e:2193
- [selection] receptor de operación Decimal; e:2194
- [selection] argumento de minus; e:2195
- [selection] argumento de mul; e:2196
- [selection] argumento de minus; e:2197
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2198
- [selection] sustitución de argumento exacto; e:2199
- [selection] constructor Decimal; e:2200
- [selection] retorno de crearImporteMonetario; e:2201
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:2203
- [selection] retorno de reduccionTrabajo2015A2017; e:2204
- [selection] fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    }) matches true; e:2206
- [selection] receptor de operación Decimal; e:2208
- [selection] selecciona Match; e:2209
- [selection] a matches (a) => a.greaterThan(b); e:2210
- [selection] sustitución de argumento exacto; e:2211
- [selection] a matches (a) => a.greaterThan(b); e:2212
- [selection] sustitución de argumento exacto; e:2213
- [selection] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:2214
- [selection] retorno de maximo; e:2215
- [selection] receptor de operación Decimal; e:2216
- [selection] argumento de div; e:2217
- [selection] argumento de plus; e:2218
- [selection] ningún matcher previo (true) && else; e:2219
- [selection] retorno de reduccionTrabajo2018; e:2220
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017) && anio matches 2018; e:2221
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018) && anio matches (anio) => anio <= 2022; e:2222
- [selection] selecciona Match; e:2223
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:2224
- [selection] sustitución de argumento exacto; e:2225
- [selection] constructor Decimal; e:2226
- [selection] retorno de crearImporteMonetario; e:2227
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:2228
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:2229
- [selection] selecciona Match; e:2230
- [selection] a matches (a) => a.greaterThan(b); e:2231
- [selection] sustitución de argumento exacto; e:2232
- [selection] a matches (a) => a.greaterThan(b); e:2233
- [selection] sustitución de argumento exacto; e:2234
- [selection] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:2235
- [selection] retorno de maximo; e:2236
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:2237
- [selection] sustitución de argumento exacto; e:2238
- [selection] constructor Decimal; e:2239
- [selection] retorno de crearImporteMonetario; e:2240
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825)) && else; e:2242
- [selection] retorno de reduccionTrabajo2019A2022; e:2243
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018) && anio matches (anio) => anio <= 2022; e:2244
- [selection] selecciona Match; e:2245
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"); e:2246
- [selection] sustitución de argumento exacto; e:2247
- [selection] constructor Decimal; e:2248
- [selection] retorno de crearImporteMonetario; e:2249
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"); e:2250
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"); e:2251
- [selection] selecciona Match; e:2252
- [selection] a matches (a) => a.greaterThan(b); e:2253
- [selection] sustitución de argumento exacto; e:2254
- [selection] a matches (a) => a.greaterThan(b); e:2255
- [selection] sustitución de argumento exacto; e:2256
- [selection] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:2257
- [selection] retorno de maximo; e:2258
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"); e:2259
- [selection] sustitución de argumento exacto; e:2260
- [selection] constructor Decimal; e:2261
- [selection] retorno de crearImporteMonetario; e:2262
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50") | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50")) && else; e:2264
- [selection] retorno de reduccionTrabajo2023; e:2265
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018 | (anio) => anio <= 2022) && anio matches 2023; e:2266
- [selection] selecciona Match; e:2267
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852); e:2268
- [selection] sustitución de argumento exacto; e:2269
- [selection] constructor Decimal; e:2270
- [selection] retorno de crearImporteMonetario; e:2271
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852); e:2272
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"); e:2273
- [selection] sustitución de argumento exacto; e:2274
- [selection] constructor Decimal; e:2275
- [selection] retorno de crearImporteMonetario; e:2276
- [selection] receptor de operación Decimal; e:2277
- [selection] sustitución de argumento exacto; e:2278
- [selection] constructor Decimal; e:2279
- [selection] retorno de crearImporteMonetario; e:2280
- [selection] receptor de operación Decimal; e:2281
- [selection] sustitución de argumento exacto; e:2282
- [selection] receptor de operación Decimal; e:2283
- [selection] argumento de minus; e:2284
- [selection] argumento de mul; e:2285
- [selection] argumento de minus; e:2286
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"); e:2287
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"); e:2288
- [selection] sustitución de argumento exacto; e:2289
- [selection] constructor Decimal; e:2290
- [selection] retorno de crearImporteMonetario; e:2291
- [selection] receptor de operación Decimal; e:2292
- [selection] sustitución de argumento exacto; e:2293
- [selection] constructor Decimal; e:2294
- [selection] retorno de crearImporteMonetario; e:2295
- [selection] receptor de operación Decimal; e:2296
- [selection] sustitución de argumento exacto; e:2297
- [selection] receptor de operación Decimal; e:2298
- [selection] argumento de minus; e:2299
- [selection] argumento de mul; e:2300
- [selection] argumento de minus; e:2301
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"); e:2302
- [selection] sustitución de argumento exacto; e:2303
- [selection] constructor Decimal; e:2304
- [selection] retorno de crearImporteMonetario; e:2305
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52") | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50")) && else; e:2307
- [selection] retorno de reduccionTrabajoDesde2024; e:2308
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018 | (anio) => anio <= 2022 | 2023) && else; e:2309
- [selection] retorno de calcularReduccionTrabajoConOtrasRentas; e:2310
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:2311
- [selection] sustitución por propiedad del argumento; e:2314
- [selection] ??; e:2316
- [selection] argumento de minus; e:2317
- [selection] argumento de max; e:2318
- [selection] receptor de operación Decimal; e:2319
- [selection] sustitución por propiedad del argumento; e:2322
- [selection] ??; e:2325
- [selection] argumento de plus; e:2326
- [selection] receptor de operación Decimal; e:2327
- [selection] sustitución por propiedad del argumento; e:2331
- [selection] ??; e:2333
- [selection] argumento de plus; e:2334
- [selection] retorno de calcularBaseImponibleGeneral; e:2335
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:2336
- [selection] sustitución por propiedad del argumento; e:2340
- [selection] sustitución por propiedad del argumento; e:2342
- [selection] sustitución de argumento exacto; e:2344
- [selection] receptor de operación Decimal; e:2345
- [selection] argumento de lte; e:2346
- [selection] sustitución por propiedad del argumento; e:3301
- [selection] !==; e:3303
- [selection] sustitución por propiedad del argumento; e:3307
- [selection] sustitución por propiedad del argumento; e:3309
- [selection] sustitución de argumento exacto; e:3311
- [selection] receptor de operación Decimal; e:3312
- [selection] argumento de lte; e:3313
- [selection] binding único desde servicio anual; e:3316
- [selection] sustitución por propiedad del argumento; e:3319
- [selection] sustitución de argumento exacto; e:3320
- [selection] sustitución de argumento exacto; e:3322
- [selection] <=; e:3324
- [selection] sustitución de argumento exacto; e:3330
- [selection] <=; e:3332
- [selection] binding único desde servicio anual; e:3362
- [selection] sustitución por propiedad del argumento; e:3363
- [selection] ===; e:3365
- [selection] binding único desde servicio anual; e:3367
- [selection] sustitución por propiedad del argumento; e:3368
- [selection] >=; e:3370
- [selection] &&; e:3371
- [selection] sustitución por propiedad del argumento; e:3373
- [selection] <=; e:3375
- [selection] &&; e:3376
- [selection] argumento conservado sin afirmar cierre; e:3378
- [selection] retorno de filas; e:3379
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3381
- [selection] sustitución por propiedad del argumento; e:3382
- [selection] ===; e:3384
- [selection] sustitución por propiedad del argumento; e:3386
- [selection] >=; e:3388
- [selection] &&; e:3389
- [selection] sustitución por propiedad del argumento; e:3391
- [selection] <=; e:3393
- [selection] &&; e:3394
- [selection] argumento conservado sin afirmar cierre; e:3396
- [selection] retorno de filas; e:3397
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3399
- [selection] sustitución por propiedad del argumento; e:3400
- [selection] ===; e:3402
- [selection] sustitución por propiedad del argumento; e:3404
- [selection] >=; e:3406
- [selection] &&; e:3407
- [selection] sustitución por propiedad del argumento; e:3409
- [selection] <=; e:3411
- [selection] &&; e:3412
- [selection] argumento conservado sin afirmar cierre; e:3414
- [selection] retorno de filas; e:3415
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3417
- [selection] sustitución por propiedad del argumento; e:3418
- [selection] ===; e:3420
- [selection] sustitución por propiedad del argumento; e:3422
- [selection] >=; e:3424
- [selection] &&; e:3425
- [selection] sustitución por propiedad del argumento; e:3427
- [selection] <=; e:3429
- [selection] &&; e:3430
- [selection] argumento conservado sin afirmar cierre; e:3432
- [selection] retorno de filas; e:3433
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3435
- [selection] sustitución por propiedad del argumento; e:3436
- [selection] ===; e:3438
- [selection] sustitución por propiedad del argumento; e:3440
- [selection] ===; e:3442
- [selection] &&; e:3443
- [selection] argumento conservado sin afirmar cierre; e:3445
- [selection] retorno de filas; e:3446
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3448
- [selection] sustitución por propiedad del argumento; e:3449
- [selection] ===; e:3451
- [selection] sustitución por propiedad del argumento; e:3453
- [selection] ===; e:3455
- [selection] &&; e:3456
- [selection] binding único desde servicio anual; e:3458
- [selection] sustitución por propiedad del argumento; e:3459
- [selection] ===; e:3461
- [selection] &&; e:3462
- [selection] argumento conservado sin afirmar cierre; e:3464
- [selection] retorno de filas; e:3465
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3467
- [selection] sustitución por propiedad del argumento; e:3468
- [selection] ===; e:3470
- [selection] sustitución por propiedad del argumento; e:3472
- [selection] ===; e:3474
- [selection] &&; e:3475
- [selection] sustitución por propiedad del argumento; e:3477
- [selection] ===; e:3479
- [selection] &&; e:3480
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3483
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:3484
- [selection] ===; e:3487
- [selection] selecciona rama; e:3488
- [selection] escalaPublicadaAutonomica === undefined; e:3489
- [selection] !(escalaPublicadaAutonomica === undefined); e:3490
- [selection] sustitución por propiedad del argumento; e:3493
- [selection] sustitución por propiedad del argumento; e:3495
- [selection] !==; e:3497
- [selection] sustitución por propiedad del argumento; e:3512
- [selection] sustitución por propiedad del argumento; e:3514
- [selection] sustitución de argumento exacto; e:3516
- [selection] receptor de operación Decimal; e:3517
- [selection] argumento de lte; e:3518
- [selection] sustitución por propiedad del argumento; e:3560
- [selection] sustitución por propiedad del argumento; e:3562
- [selection] !==; e:3564
- [selection] binding único desde servicio anual; e:3574
- [selection] ===; e:3577
- [selection] selecciona rama; e:3578
- [selection] caso.derechosMinimos === undefined; e:3579
- [selection] argumento conservado sin afirmar cierre; e:3580
- [selection] argumento conservado sin afirmar cierre; e:3581
- [selection] !(caso.derechosMinimos === undefined); e:3583
- [selection] binding único desde servicio anual; e:3587
- [selection] selecciona Match; e:3589
- [selection] caso.anio matches 2012; e:3591
- [selection] ningún matcher previo (2012) && caso.anio matches 2013; e:3593
- [selection] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:3595
- [selection] binding único desde servicio anual; e:3596
- [selection] ningún matcher previo (2012 | 2013 | 2014) && else; e:3599
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:3600
- [selection] sustitución por propiedad del argumento; e:3603
- [selection] receptor de operación Decimal; e:3607
- [selection] binding único desde servicio anual; e:3608
- [selection] sustitución por propiedad del argumento; e:3612
- [selection] selecciona Match; e:3613
- [selection] sustitución de argumento exacto; e:3614
- [selection] >=; e:3616
- [selection] edad matches (edad) => edad >= 65; e:3617
- [selection] selecciona Match; e:3618
- [selection] caso.anio matches 2012; e:3620
- [selection] ningún matcher previo (2012) && caso.anio matches 2013; e:3622
- [selection] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:3624
- [selection] binding único desde servicio anual; e:3625
- [selection] ningún matcher previo (2012 | 2013 | 2014) && else; e:3628
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:3629
- [selection] sustitución por propiedad del argumento; e:3632
- [selection] edad matches (edad) => edad >= 65; e:3635
- [selection] sustitución de argumento exacto; e:3636
- [selection] constructor Decimal; e:3637
- [selection] retorno de crearImporteMonetario; e:3638
- [selection] ningún matcher previo ((edad) => edad >= 65) && else; e:3640
- [selection] argumento de plus; e:3642
- [selection] receptor de operación Decimal; e:3643
- [selection] sustitución por propiedad del argumento; e:3644
- [selection] selecciona Match; e:3645
- [selection] sustitución de argumento exacto; e:3646
- [selection] >=; e:3648
- [selection] edad matches (edad) => edad >= 75; e:3649
- [selection] selecciona Match; e:3650
- [selection] caso.anio matches 2012; e:3652
- [selection] ningún matcher previo (2012) && caso.anio matches 2013; e:3654
- [selection] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:3656
- [selection] binding único desde servicio anual; e:3657
- [selection] ningún matcher previo (2012 | 2013 | 2014) && else; e:3660
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:3661
- [selection] sustitución por propiedad del argumento; e:3664
- [selection] edad matches (edad) => edad >= 75; e:3667
- [selection] sustitución de argumento exacto; e:3668
- [selection] constructor Decimal; e:3669
- [selection] retorno de crearImporteMonetario; e:3670
- [selection] ningún matcher previo ((edad) => edad >= 75) && else; e:3672
- [selection] argumento de plus; e:3674
- [selection] retorno de obtenerMinimoContribuyente; e:3675
- [selection] ??; e:3676
- [selection] receptor de operación Decimal; e:3678
- [selection] selecciona rama; e:3679
- [selection] caso.derechosMinimos === undefined; e:3680
- [selection] argumento conservado sin afirmar cierre; e:3681
- [selection] !(caso.derechosMinimos === undefined); e:3683
- [selection] argumento conservado sin afirmar cierre; e:3687
- [selection] argumento conservado sin afirmar cierre; e:3688
- [selection] sustitución de argumento exacto; e:3689
- [selection] constructor Decimal; e:3690
- [selection] retorno de crearImporteMonetario; e:3691
- [selection] argumento conservado sin afirmar cierre; e:3693
- [selection] argumento conservado sin afirmar cierre; e:3694
- [selection] retorno de obtenerMinimoDescendientes; e:3695
- [selection] ??; e:3696
- [selection] argumento de plus; e:3698
- [selection] receptor de operación Decimal; e:3699
- [selection] selecciona rama; e:3700
- [selection] caso.derechosMinimos === undefined; e:3701
- [selection] argumento conservado sin afirmar cierre; e:3702
- [selection] !(caso.derechosMinimos === undefined); e:3704
- [selection] binding único desde servicio anual; e:3708
- [selection] sustitución de argumento exacto; e:3711
- [selection] argumento conservado sin afirmar cierre; e:3712
- [selection] sustitución de argumento exacto; e:3713
- [selection] constructor Decimal; e:3714
- [selection] retorno de crearImporteMonetario; e:3715
- [selection] argumento conservado sin afirmar cierre; e:3717
- [selection] argumento conservado sin afirmar cierre; e:3718
- [selection] retorno de obtenerMinimoAscendientes; e:3719
- [selection] ??; e:3720
- [selection] argumento de plus; e:3722
- [selection] receptor de operación Decimal; e:3723
- [selection] selecciona rama; e:3724
- [selection] caso.derechosMinimos === undefined; e:3725
- [selection] argumento conservado sin afirmar cierre; e:3726
- [selection] !(caso.derechosMinimos === undefined); e:3728
- [selection] binding único desde servicio anual; e:3732
- [selection] sustitución de argumento exacto; e:3734
- [selection] sustitución de argumento exacto; e:3736
- [selection] argumento conservado sin afirmar cierre; e:3737
- [selection] argumento conservado sin afirmar cierre; e:3738
- [selection] retorno de obtenerMinimoPorDiscapacidad; e:3739
- [selection] retorno de obtenerMinimoDiscapacidadContribuyente; e:3740
- [selection] ??; e:3741
- [selection] argumento de plus; e:3743
- [selection] receptor de operación Decimal; e:3744
- [selection] selecciona rama; e:3745
- [selection] caso.derechosMinimos === undefined; e:3746
- [selection] argumento conservado sin afirmar cierre; e:3747
- [selection] !(caso.derechosMinimos === undefined); e:3749
- [selection] binding único desde servicio anual; e:3753
- [selection] sustitución de argumento exacto; e:3756
- [selection] argumento conservado sin afirmar cierre; e:3757
- [selection] sustitución de argumento exacto; e:3758
- [selection] constructor Decimal; e:3759
- [selection] retorno de crearImporteMonetario; e:3760
- [selection] argumento conservado sin afirmar cierre; e:3762
- [selection] argumento conservado sin afirmar cierre; e:3763
- [selection] retorno de obtenerMinimoDiscapacidadFamiliares; e:3764
- [selection] receptor de operación Decimal; e:3765
- [selection] binding único desde servicio anual; e:3766
- [selection] sustitución de argumento exacto; e:3769
- [selection] argumento conservado sin afirmar cierre; e:3770
- [selection] sustitución de argumento exacto; e:3771
- [selection] constructor Decimal; e:3772
- [selection] retorno de crearImporteMonetario; e:3773
- [selection] argumento conservado sin afirmar cierre; e:3775
- [selection] argumento conservado sin afirmar cierre; e:3776
- [selection] retorno de obtenerMinimoDiscapacidadAscendientes; e:3777
- [selection] argumento de plus; e:3778
- [selection] ??; e:3779
- [selection] argumento de plus; e:3781
- [selection] argumento de min; e:3783
- [selection] argumento de min; e:3785
- [selection] sustitución por propiedad del argumento; e:3787
- [selection] sustitución por propiedad del argumento; e:3789
- [selection] sustitución de argumento exacto; e:3791
- [selection] receptor de operación Decimal; e:3792
- [selection] argumento de lte; e:3793
- [selection] sustitución por propiedad del argumento; e:4011
- [selection] !==; e:4013
- [selection] argumento de min; e:4016
- [selection] argumento de min; e:4018
- [selection] sustitución por propiedad del argumento; e:4020
- [selection] sustitución por propiedad del argumento; e:4022
- [selection] sustitución de argumento exacto; e:4024
- [selection] receptor de operación Decimal; e:4025
- [selection] argumento de lte; e:4026
- [selection] binding único desde servicio anual; e:4029
- [selection] sustitución por propiedad del argumento; e:4032
- [selection] sustitución de argumento exacto; e:4033
- [selection] sustitución de argumento exacto; e:4035
- [selection] <=; e:4037
- [selection] sustitución de argumento exacto; e:4043
- [selection] <=; e:4045
- [selection] sustitución por propiedad del argumento; e:4080
- [selection] sustitución por propiedad del argumento; e:4082
- [selection] !==; e:4084
- [selection] binding único desde servicio anual; e:4094
- [selection] ===; e:4097
- [selection] selecciona rama; e:4098
- [selection] caso.derechosMinimos === undefined; e:4099
- [selection] argumento conservado sin afirmar cierre; e:4100
- [selection] argumento conservado sin afirmar cierre; e:4101
- [selection] !(caso.derechosMinimos === undefined); e:4103
- [selection] argumento conservado sin afirmar cierre; e:4107
- [selection] argumento conservado sin afirmar cierre; e:4108
- [selection] sustitución por propiedad del argumento; e:4113
- [selection] sustitución por propiedad del argumento; e:4115
- [selection] receptor de operación Decimal; e:4119
- [selection] binding único desde servicio anual; e:4120
- [selection] sustitución por propiedad del argumento; e:4123
- [selection] sustitución por propiedad del argumento; e:4126
- [selection] selecciona Match; e:4127
- [selection] sustitución de argumento exacto; e:4128
- [selection] >=; e:4130
- [selection] edad matches (edad) => edad >= 65; e:4131
- [selection] argumento conservado sin afirmar cierre; e:4132
- [selection] argumento conservado sin afirmar cierre; e:4133
- [selection] sustitución por propiedad del argumento; e:4138
- [selection] sustitución por propiedad del argumento; e:4140
- [selection] edad matches (edad) => edad >= 65; e:4143
- [selection] sustitución de argumento exacto; e:4144
- [selection] constructor Decimal; e:4145
- [selection] retorno de crearImporteMonetario; e:4146
- [selection] ningún matcher previo ((edad) => edad >= 65) && else; e:4148
- [selection] argumento de plus; e:4150
- [selection] receptor de operación Decimal; e:4151
- [selection] sustitución por propiedad del argumento; e:4152
- [selection] selecciona Match; e:4153
- [selection] sustitución de argumento exacto; e:4154
- [selection] >=; e:4156
- [selection] edad matches (edad) => edad >= 75; e:4157
- [selection] argumento conservado sin afirmar cierre; e:4158
- [selection] argumento conservado sin afirmar cierre; e:4159
- [selection] sustitución por propiedad del argumento; e:4164
- [selection] sustitución por propiedad del argumento; e:4166
- [selection] edad matches (edad) => edad >= 75; e:4169
- [selection] sustitución de argumento exacto; e:4170
- [selection] constructor Decimal; e:4171
- [selection] retorno de crearImporteMonetario; e:4172
- [selection] ningún matcher previo ((edad) => edad >= 75) && else; e:4174
- [selection] argumento de plus; e:4176
- [selection] retorno de obtenerMinimoContribuyente; e:4177
- [selection] receptor de operación Decimal; e:4179
- [selection] argumento conservado sin afirmar cierre; e:4180
- [selection] argumento conservado sin afirmar cierre; e:4181
- [selection] sustitución de argumento exacto; e:4182
- [selection] constructor Decimal; e:4183
- [selection] retorno de crearImporteMonetario; e:4184
- [selection] argumento conservado sin afirmar cierre; e:4186
- [selection] argumento conservado sin afirmar cierre; e:4187
- [selection] retorno de obtenerMinimoDescendientes; e:4188
- [selection] argumento de plus; e:4190
- [selection] receptor de operación Decimal; e:4191
- [selection] binding único desde servicio anual; e:4192
- [selection] sustitución por propiedad del argumento; e:4195
- [selection] sustitución de argumento exacto; e:4197
- [selection] argumento conservado sin afirmar cierre; e:4198
- [selection] sustitución de argumento exacto; e:4199
- [selection] constructor Decimal; e:4200
- [selection] retorno de crearImporteMonetario; e:4201
- [selection] argumento conservado sin afirmar cierre; e:4203
- [selection] argumento conservado sin afirmar cierre; e:4204
- [selection] retorno de obtenerMinimoAscendientes; e:4205
- [selection] argumento de plus; e:4207
- [selection] receptor de operación Decimal; e:4208
- [selection] binding único desde servicio anual; e:4209
- [selection] sustitución por propiedad del argumento; e:4212
- [selection] sustitución de argumento exacto; e:4213
- [selection] sustitución de argumento exacto; e:4215
- [selection] argumento conservado sin afirmar cierre; e:4216
- [selection] argumento conservado sin afirmar cierre; e:4217
- [selection] retorno de obtenerMinimoPorDiscapacidad; e:4218
- [selection] retorno de obtenerMinimoDiscapacidadContribuyente; e:4219
- [selection] argumento de plus; e:4221
- [selection] receptor de operación Decimal; e:4222
- [selection] binding único desde servicio anual; e:4223
- [selection] sustitución por propiedad del argumento; e:4226
- [selection] sustitución de argumento exacto; e:4228
- [selection] argumento conservado sin afirmar cierre; e:4229
- [selection] sustitución de argumento exacto; e:4230
- [selection] constructor Decimal; e:4231
- [selection] retorno de crearImporteMonetario; e:4232
- [selection] argumento conservado sin afirmar cierre; e:4234
- [selection] argumento conservado sin afirmar cierre; e:4235
- [selection] retorno de obtenerMinimoDiscapacidadFamiliares; e:4236
- [selection] receptor de operación Decimal; e:4237
- [selection] sustitución por propiedad del argumento; e:4238
- [selection] sustitución de argumento exacto; e:4240
- [selection] argumento conservado sin afirmar cierre; e:4241
- [selection] sustitución de argumento exacto; e:4242
- [selection] constructor Decimal; e:4243
- [selection] retorno de crearImporteMonetario; e:4244
- [selection] argumento conservado sin afirmar cierre; e:4246
- [selection] argumento conservado sin afirmar cierre; e:4247
- [selection] retorno de obtenerMinimoDiscapacidadAscendientes; e:4248
- [selection] argumento de plus; e:4249
- [selection] argumento de plus; e:4251
- [selection] retorno de calcularMinimoPersonalYFamiliar; e:4252
- [selection] ??; e:4253
- [selection] argumento de min; e:4255
- [selection] argumento de min; e:4257
- [selection] sustitución por propiedad del argumento; e:4259
- [selection] sustitución por propiedad del argumento; e:4261
- [selection] sustitución de argumento exacto; e:4263
- [selection] receptor de operación Decimal; e:4264
- [selection] argumento de lte; e:4265
- [selection] binding único desde servicio anual; e:4529
- [selection] sustitución por propiedad del argumento; e:4532
- [selection] sustitución por propiedad del argumento; e:4534
- [selection] sustitución de argumento exacto; e:4535
- [selection] <=; e:4537
- [selection] sustitución de argumento exacto; e:4539
- [selection] sustitución por propiedad del argumento; e:4541
- [selection] sustitución de argumento exacto; e:4542
- [selection] ===; e:4544
- [selection] selecciona rama; e:4545
- [selection] componente === "estatal"; e:4546
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4547
- [selection] sustitución de argumento exacto; e:4548
- [selection] ===; e:4550
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4552
- [selection] sustitución de argumento exacto; e:4553
- [selection] <=; e:4555
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4557
- [selection] sustitución de argumento exacto; e:4558
- [selection] <=; e:4560
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4562
- [selection] sustitución de argumento exacto; e:4563
- [selection] <=; e:4565
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4567
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4568
- [selection] sustitución por propiedad del argumento; e:4570
- [selection] sustitución por propiedad del argumento; e:4572
- [selection] !==; e:4574
- [selection] sustitución por propiedad del argumento; e:4598
- [selection] sustitución por propiedad del argumento; e:4600
- [selection] sustitución por propiedad del argumento; e:4602
- [selection] sustitución por propiedad del argumento; e:4604
- [selection] sustitución de argumento exacto; e:4606
- [selection] receptor de operación Decimal; e:4607
- [selection] argumento de lte; e:4608
- [selection] sustitución por propiedad del argumento; e:4638
- [selection] <=; e:4640
- [selection] sustitución por propiedad del argumento; e:4642
- [selection] sustitución por propiedad del argumento; e:4644
- [selection] sustitución de argumento exacto; e:4645
- [selection] <=; e:4647
- [selection] sustitución de argumento exacto; e:4649
- [selection] sustitución por propiedad del argumento; e:4651
- [selection] sustitución de argumento exacto; e:4652
- [selection] ===; e:4654
- [selection] selecciona rama; e:4655
- [selection] componente === "estatal"; e:4656
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4657
- [selection] sustitución de argumento exacto; e:4658
- [selection] ===; e:4660
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4662
- [selection] sustitución de argumento exacto; e:4663
- [selection] <=; e:4665
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4667
- [selection] sustitución de argumento exacto; e:4668
- [selection] <=; e:4670
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4672
- [selection] sustitución de argumento exacto; e:4673
- [selection] <=; e:4675
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4677
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4678
- [selection] sustitución por propiedad del argumento; e:4680
- [selection] sustitución por propiedad del argumento; e:4682
- [selection] !==; e:4684
- [selection] argumento de max; e:4706
- [selection] sustitución por propiedad del argumento; e:4707
- [selection] receptor de operación Decimal; e:4708
- [selection] argumento de max; e:4709
- [selection] sustitución por propiedad del argumento; e:4712
- [selection] sustitución de argumento exacto; e:4713
- [selection] receptor de operación Decimal; e:4714
- [selection] argumento de max; e:4715
- [selection] sustitución por propiedad del argumento; e:4718
- [selection] argumento de max; e:4719
- [selection] argumento de minus; e:4720
- [selection] argumento de max; e:4721
- [selection] argumento de min; e:4722
- [selection] argumento de max; e:4723
- [selection] sustitución por propiedad del argumento; e:4724
- [selection] argumento de max; e:4725
- [selection] argumento de min; e:4726
- [selection] argumento de minus; e:4728
- [selection] argumento de max; e:4729
- [selection] sustitución por propiedad del argumento; e:4731
- [selection] sustitución por propiedad del argumento; e:4733
- [selection] sustitución por propiedad del argumento; e:4735
- [selection] sustitución de argumento exacto; e:4737
- [selection] receptor de operación Decimal; e:4738
- [selection] argumento de lte; e:4739
- [selection] sustitución por propiedad del argumento; e:4792
- [selection] sustitución por propiedad del argumento; e:4794
- [selection] sustitución de argumento exacto; e:4795
- [selection] <=; e:4797
- [selection] sustitución de argumento exacto; e:4799
- [selection] sustitución por propiedad del argumento; e:4801
- [selection] sustitución de argumento exacto; e:4802
- [selection] ===; e:4804
- [selection] selecciona rama; e:4805
- [selection] componente === "estatal"; e:4806
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4807
- [selection] sustitución de argumento exacto; e:4808
- [selection] ===; e:4810
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4812
- [selection] sustitución de argumento exacto; e:4813
- [selection] <=; e:4815
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4817
- [selection] sustitución de argumento exacto; e:4818
- [selection] <=; e:4820
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4822
- [selection] sustitución de argumento exacto; e:4823
- [selection] <=; e:4825
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4827
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4828
- [selection] sustitución por propiedad del argumento; e:4830
- [selection] sustitución por propiedad del argumento; e:4832
- [selection] !==; e:4834
- [selection] sustitución por propiedad del argumento; e:4858
- [selection] sustitución por propiedad del argumento; e:4860
- [selection] sustitución por propiedad del argumento; e:4862
- [selection] sustitución de argumento exacto; e:4864
- [selection] receptor de operación Decimal; e:4865
- [selection] argumento de lte; e:4866
- [selection] sustitución por propiedad del argumento; e:4905
- [selection] sustitución por propiedad del argumento; e:4907
- [selection] sustitución de argumento exacto; e:4908
- [selection] <=; e:4910
- [selection] sustitución de argumento exacto; e:4912
- [selection] sustitución por propiedad del argumento; e:4914
- [selection] sustitución de argumento exacto; e:4915
- [selection] ===; e:4917
- [selection] selecciona rama; e:4918
- [selection] !(componente === "estatal"); e:4919
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4920
- [selection] sustitución de argumento exacto; e:4921
- [selection] ===; e:4923
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4925
- [selection] sustitución de argumento exacto; e:4926
- [selection] <=; e:4928
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4930
- [selection] sustitución de argumento exacto; e:4931
- [selection] <=; e:4933
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4935
- [selection] sustitución de argumento exacto; e:4936
- [selection] <=; e:4938
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4940
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:4941
- [selection] sustitución por propiedad del argumento; e:4943
- [selection] sustitución por propiedad del argumento; e:4945
- [selection] !==; e:4947
- [selection] sustitución por propiedad del argumento; e:4969
- [selection] sustitución por propiedad del argumento; e:4971
- [selection] sustitución por propiedad del argumento; e:4973
- [selection] sustitución por propiedad del argumento; e:4975
- [selection] sustitución de argumento exacto; e:4977
- [selection] receptor de operación Decimal; e:4978
- [selection] argumento de lte; e:4979
- [selection] sustitución por propiedad del argumento; e:5007
- [selection] <=; e:5009
- [selection] sustitución por propiedad del argumento; e:5011
- [selection] sustitución por propiedad del argumento; e:5013
- [selection] sustitución de argumento exacto; e:5014
- [selection] <=; e:5016
- [selection] sustitución de argumento exacto; e:5018
- [selection] sustitución por propiedad del argumento; e:5020
- [selection] sustitución de argumento exacto; e:5021
- [selection] ===; e:5023
- [selection] selecciona rama; e:5024
- [selection] !(componente === "estatal"); e:5025
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5026
- [selection] sustitución de argumento exacto; e:5027
- [selection] ===; e:5029
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5031
- [selection] sustitución de argumento exacto; e:5032
- [selection] <=; e:5034
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5036
- [selection] sustitución de argumento exacto; e:5037
- [selection] <=; e:5039
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5041
- [selection] sustitución de argumento exacto; e:5042
- [selection] <=; e:5044
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5046
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5047
- [selection] sustitución por propiedad del argumento; e:5049
- [selection] sustitución por propiedad del argumento; e:5051
- [selection] !==; e:5053
- [selection] argumento de max; e:5075
- [selection] sustitución por propiedad del argumento; e:5076
- [selection] receptor de operación Decimal; e:5077
- [selection] argumento de max; e:5078
- [selection] sustitución por propiedad del argumento; e:5081
- [selection] sustitución de argumento exacto; e:5082
- [selection] receptor de operación Decimal; e:5083
- [selection] argumento de max; e:5084
- [selection] sustitución por propiedad del argumento; e:5085
- [selection] argumento de max; e:5086
- [selection] argumento de minus; e:5087
- [selection] argumento de max; e:5088
- [selection] argumento de min; e:5089
- [selection] argumento de max; e:5090
- [selection] sustitución por propiedad del argumento; e:5091
- [selection] argumento de max; e:5092
- [selection] argumento de min; e:5093
- [selection] argumento de minus; e:5095
- [selection] argumento de max; e:5096
- [selection] sustitución por propiedad del argumento; e:5098
- [selection] sustitución por propiedad del argumento; e:5100
- [selection] sustitución por propiedad del argumento; e:5102
- [selection] sustitución de argumento exacto; e:5104
- [selection] receptor de operación Decimal; e:5105
- [selection] argumento de lte; e:5106
- [selection] sustitución por propiedad del argumento; e:5157
- [selection] sustitución por propiedad del argumento; e:5159
- [selection] sustitución de argumento exacto; e:5160
- [selection] <=; e:5162
- [selection] sustitución de argumento exacto; e:5164
- [selection] sustitución por propiedad del argumento; e:5166
- [selection] sustitución de argumento exacto; e:5167
- [selection] ===; e:5169
- [selection] selecciona rama; e:5170
- [selection] !(componente === "estatal"); e:5171
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5172
- [selection] sustitución de argumento exacto; e:5173
- [selection] ===; e:5175
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5177
- [selection] sustitución de argumento exacto; e:5178
- [selection] <=; e:5180
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5182
- [selection] sustitución de argumento exacto; e:5183
- [selection] <=; e:5185
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5187
- [selection] sustitución de argumento exacto; e:5188
- [selection] <=; e:5190
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5192
- [selection] retorno de obtenerEscalasAhorroPublicadas; e:5193
- [selection] sustitución por propiedad del argumento; e:5195
- [selection] sustitución por propiedad del argumento; e:5197
- [selection] !==; e:5199
- [selection] sustitución por propiedad del argumento; e:5223
- [selection] sustitución por propiedad del argumento; e:5225
- [selection] sustitución por propiedad del argumento; e:5227
- [selection] sustitución de argumento exacto; e:5229
- [selection] receptor de operación Decimal; e:5230
- [selection] argumento de lte; e:5231
- [selection] selecciona rama; e:5351
- [selection] selecciona rama; e:5352
- [selection] selecciona rama; e:5353
- [value] caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"; e:5354
- [value] !(caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"); e:5355
- [value] sustitución por propiedad del argumento; e:5358
- [value] sustitución por propiedad del argumento; e:5360
- [value] argumento conservado sin afirmar cierre; e:5361
- [value] argumento conservado sin afirmar cierre; e:5362
- [value] escalasPublicadas !== undefined; e:5363
- [selection] selecciona Match; e:5364
- [selection] base matches (base) => base.lte(0); e:5365
- [value] base matches (base) => base.lte(0); e:5366
- [selection] selecciona Match; e:5367
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:5368
- [value] anio matches 2012; e:5369
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:5370
- [value] ningún matcher previo (2012) && anio matches 2013; e:5371
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:5372
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:5373
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:5374
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:5375
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:5376
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:5377
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:5378
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:5379
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:5380
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:5381
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:5382
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:5383
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:5384
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:5385
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:5386
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:5387
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:5388
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:5389
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:5390
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:5391
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:5392
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:5393
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:5394
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:5395
- [selection] selecciona Match; e:5396
- [value] comunidadAutonoma matches "simulada-estatal"; e:5397
- [value] ningún matcher previo ("simulada-estatal") && else; e:5398
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:5399
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:5400
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:5401
- [value] retorno de obtenerParametrosComunidadAutonomaPuro; e:5402
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5403
- [value] argumento conservado sin afirmar cierre; e:5405
- [value] argumento conservado sin afirmar cierre; e:5406
- [value] sustitución por propiedad del argumento; e:5412
- [value] sustitución por propiedad del argumento; e:5414
- [value] argumento conservado sin afirmar cierre; e:5415
- [value] argumento conservado sin afirmar cierre; e:5416
- [value] argumento conservado sin afirmar cierre; e:5417
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5419
- [value] !(escalasPublicadas !== undefined); e:5420
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5421
- [value] argumento conservado sin afirmar cierre; e:5422
- [value] sustitución por propiedad del argumento; e:5425
- [value] receptor de operación Decimal; e:5426
- [value] argumento de mul; e:5427
- [value] argumento conservado sin afirmar cierre; e:5428
- [value] argumento conservado sin afirmar cierre; e:5429
- [value] retorno de calcularCuotaPorEscala; e:5430
- [value] usaEscalaAutonomicaReal; e:5431
- [selection] selecciona rama; e:5432
- [selection] selecciona Match; e:5433
- [selection] base matches (base) => base.lte(0); e:5434
- [value] base matches (base) => base.lte(0); e:5435
- [selection] selecciona Match; e:5436
- [selection] anio matches (anio) => anio <= 2014; e:5437
- [value] anio matches (anio) => anio <= 2014; e:5439
- [value] ningún matcher previo ((anio) => anio <= 2014) && anio matches 2015; e:5441
- [selection] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:5442
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:5444
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015 | (anio) => anio <= 2020) && else; e:5446
- [value] retorno de obtenerTramosIrpfLegacy; e:5447
- [value] sustitución por propiedad del argumento; e:5449
- [value] argumento conservado sin afirmar cierre; e:5450
- [value] argumento conservado sin afirmar cierre; e:5451
- [value] argumento conservado sin afirmar cierre; e:5452
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5454
- [value] !(escalasPublicadas !== undefined); e:5455
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5456
- [value] argumento conservado sin afirmar cierre; e:5457
- [value] sustitución por propiedad del argumento; e:5460
- [value] receptor de operación Decimal; e:5461
- [value] argumento de mul; e:5462
- [value] argumento conservado sin afirmar cierre; e:5463
- [value] argumento conservado sin afirmar cierre; e:5464
- [value] retorno de calcularCuotaPorEscalaGeneral; e:5465
- [value] !(usaEscalaAutonomicaReal); e:5466
- [value] receptor de operación Decimal; e:5468
- [selection] selecciona rama; e:5469
- [selection] selecciona rama; e:5470
- [selection] selecciona rama; e:5471
- [value] escalaPublicadaAutonomica === undefined; e:5472
- [value] !(escalaPublicadaAutonomica === undefined); e:5473
- [value] sustitución por propiedad del argumento; e:5476
- [value] sustitución por propiedad del argumento; e:5478
- [value] argumento conservado sin afirmar cierre; e:5479
- [value] argumento conservado sin afirmar cierre; e:5480
- [value] escalasPublicadas !== undefined; e:5481
- [selection] selecciona Match; e:5482
- [selection] base matches (base) => base.lte(0); e:5483
- [value] base matches (base) => base.lte(0); e:5484
- [value] argumento conservado sin afirmar cierre; e:5485
- [value] argumento conservado sin afirmar cierre; e:5486
- [value] sustitución por propiedad del argumento; e:5492
- [value] sustitución por propiedad del argumento; e:5494
- [value] argumento conservado sin afirmar cierre; e:5495
- [value] argumento conservado sin afirmar cierre; e:5496
- [value] argumento conservado sin afirmar cierre; e:5497
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5499
- [value] !(escalasPublicadas !== undefined); e:5500
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5501
- [value] argumento conservado sin afirmar cierre; e:5502
- [value] sustitución por propiedad del argumento; e:5505
- [value] receptor de operación Decimal; e:5506
- [value] argumento de mul; e:5507
- [value] argumento conservado sin afirmar cierre; e:5508
- [value] argumento conservado sin afirmar cierre; e:5509
- [value] retorno de calcularCuotaPorEscala; e:5510
- [value] usaEscalaAutonomicaReal; e:5511
- [value] receptor de operación Decimal; e:5513
- [value] argumento de mul; e:5514
- [value] !(usaEscalaAutonomicaReal); e:5515
- [value] argumento de plus; e:5517
- [value] argumento de max; e:5519
- [value] argumento de max; e:5520
- [value] receptor de operación Decimal; e:5522
- [selection] selecciona rama; e:5523
- [selection] selecciona rama; e:5524
- [value] sustitución por propiedad del argumento; e:5527
- [value] sustitución por propiedad del argumento; e:5529
- [value] argumento conservado sin afirmar cierre; e:5530
- [value] argumento conservado sin afirmar cierre; e:5531
- [value] escalasPublicadas !== undefined; e:5532
- [selection] selecciona Match; e:5533
- [selection] base matches (base) => base.lte(0); e:5534
- [value] base matches (base) => base.lte(0); e:5535
- [value] sustitución por propiedad del argumento; e:5538
- [value] sustitución por propiedad del argumento; e:5540
- [value] argumento conservado sin afirmar cierre; e:5541
- [value] argumento conservado sin afirmar cierre; e:5542
- [value] argumento conservado sin afirmar cierre; e:5543
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5545
- [value] !(escalasPublicadas !== undefined); e:5546
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5547
- [value] argumento conservado sin afirmar cierre; e:5548
- [selection] selecciona rama; e:5549
- [value] caso.derechosMinimos === undefined; e:5550
- [value] argumento conservado sin afirmar cierre; e:5551
- [value] argumento conservado sin afirmar cierre; e:5552
- [value] !(caso.derechosMinimos === undefined); e:5554
- [selection] selecciona Match; e:5558
- [value] caso.anio matches 2012; e:5560
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:5562
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:5564
- [value] binding único desde servicio anual; e:5565
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:5568
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5569
- [value] sustitución por propiedad del argumento; e:5572
- [value] receptor de operación Decimal; e:5576
- [selection] selecciona Match; e:5577
- [selection] edad matches (edad) => edad >= 65; e:5578
- [selection] selecciona Match; e:5579
- [value] caso.anio matches 2012; e:5581
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:5583
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:5585
- [value] binding único desde servicio anual; e:5586
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:5589
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5590
- [value] sustitución por propiedad del argumento; e:5593
- [value] edad matches (edad) => edad >= 65; e:5596
- [value] sustitución de argumento exacto; e:5597
- [value] constructor Decimal; e:5598
- [value] retorno de crearImporteMonetario; e:5599
- [value] ningún matcher previo ((edad) => edad >= 65) && else; e:5601
- [value] argumento de plus; e:5603
- [value] receptor de operación Decimal; e:5604
- [selection] selecciona Match; e:5605
- [selection] edad matches (edad) => edad >= 75; e:5606
- [selection] selecciona Match; e:5607
- [value] caso.anio matches 2012; e:5609
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:5611
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:5613
- [value] binding único desde servicio anual; e:5614
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:5617
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5618
- [value] sustitución por propiedad del argumento; e:5621
- [value] edad matches (edad) => edad >= 75; e:5624
- [value] sustitución de argumento exacto; e:5625
- [value] constructor Decimal; e:5626
- [value] retorno de crearImporteMonetario; e:5627
- [value] ningún matcher previo ((edad) => edad >= 75) && else; e:5629
- [value] argumento de plus; e:5631
- [value] retorno de obtenerMinimoContribuyente; e:5632
- [value] ??; e:5633
- [value] receptor de operación Decimal; e:5635
- [selection] selecciona rama; e:5636
- [value] caso.derechosMinimos === undefined; e:5637
- [value] argumento conservado sin afirmar cierre; e:5638
- [value] !(caso.derechosMinimos === undefined); e:5640
- [value] argumento conservado sin afirmar cierre; e:5644
- [value] argumento conservado sin afirmar cierre; e:5645
- [value] sustitución de argumento exacto; e:5646
- [value] constructor Decimal; e:5647
- [value] retorno de crearImporteMonetario; e:5648
- [value] argumento conservado sin afirmar cierre; e:5650
- [value] argumento conservado sin afirmar cierre; e:5651
- [value] retorno de obtenerMinimoDescendientes; e:5652
- [value] ??; e:5653
- [value] argumento de plus; e:5655
- [value] receptor de operación Decimal; e:5656
- [selection] selecciona rama; e:5657
- [value] caso.derechosMinimos === undefined; e:5658
- [value] argumento conservado sin afirmar cierre; e:5659
- [value] !(caso.derechosMinimos === undefined); e:5661
- [value] binding único desde servicio anual; e:5665
- [value] sustitución de argumento exacto; e:5668
- [value] argumento conservado sin afirmar cierre; e:5669
- [value] sustitución de argumento exacto; e:5670
- [value] constructor Decimal; e:5671
- [value] retorno de crearImporteMonetario; e:5672
- [value] argumento conservado sin afirmar cierre; e:5674
- [value] argumento conservado sin afirmar cierre; e:5675
- [value] retorno de obtenerMinimoAscendientes; e:5676
- [value] ??; e:5677
- [value] argumento de plus; e:5679
- [value] receptor de operación Decimal; e:5680
- [selection] selecciona rama; e:5681
- [value] caso.derechosMinimos === undefined; e:5682
- [value] argumento conservado sin afirmar cierre; e:5683
- [value] !(caso.derechosMinimos === undefined); e:5685
- [value] binding único desde servicio anual; e:5689
- [value] sustitución de argumento exacto; e:5691
- [value] sustitución de argumento exacto; e:5693
- [value] argumento conservado sin afirmar cierre; e:5694
- [value] argumento conservado sin afirmar cierre; e:5695
- [value] retorno de obtenerMinimoPorDiscapacidad; e:5696
- [value] retorno de obtenerMinimoDiscapacidadContribuyente; e:5697
- [value] ??; e:5698
- [value] argumento de plus; e:5700
- [value] receptor de operación Decimal; e:5701
- [selection] selecciona rama; e:5702
- [value] caso.derechosMinimos === undefined; e:5703
- [value] argumento conservado sin afirmar cierre; e:5704
- [value] !(caso.derechosMinimos === undefined); e:5706
- [value] binding único desde servicio anual; e:5710
- [value] sustitución de argumento exacto; e:5713
- [value] argumento conservado sin afirmar cierre; e:5714
- [value] sustitución de argumento exacto; e:5715
- [value] constructor Decimal; e:5716
- [value] retorno de crearImporteMonetario; e:5717
- [value] argumento conservado sin afirmar cierre; e:5719
- [value] argumento conservado sin afirmar cierre; e:5720
- [value] retorno de obtenerMinimoDiscapacidadFamiliares; e:5721
- [value] receptor de operación Decimal; e:5722
- [value] binding único desde servicio anual; e:5723
- [value] sustitución de argumento exacto; e:5726
- [value] argumento conservado sin afirmar cierre; e:5727
- [value] sustitución de argumento exacto; e:5728
- [value] constructor Decimal; e:5729
- [value] retorno de crearImporteMonetario; e:5730
- [value] argumento conservado sin afirmar cierre; e:5732
- [value] argumento conservado sin afirmar cierre; e:5733
- [value] retorno de obtenerMinimoDiscapacidadAscendientes; e:5734
- [value] argumento de plus; e:5735
- [value] ??; e:5736
- [value] argumento de plus; e:5738
- [value] argumento de min; e:5740
- [value] argumento de min; e:5742
- [value] sustitución por propiedad del argumento; e:5744
- [value] receptor de operación Decimal; e:5745
- [value] argumento de mul; e:5746
- [value] argumento conservado sin afirmar cierre; e:5747
- [value] argumento conservado sin afirmar cierre; e:5748
- [value] retorno de calcularCuotaPorEscala; e:5749
- [value] usaEscalaAutonomicaReal; e:5750
- [selection] selecciona rama; e:5751
- [selection] selecciona Match; e:5752
- [selection] base matches (base) => base.lte(0); e:5753
- [value] base matches (base) => base.lte(0); e:5754
- [selection] selecciona Match; e:5755
- [selection] anio matches (anio) => anio <= 2014; e:5756
- [value] anio matches (anio) => anio <= 2014; e:5758
- [value] ningún matcher previo ((anio) => anio <= 2014) && anio matches 2015; e:5760
- [selection] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:5761
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:5763
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015 | (anio) => anio <= 2020) && else; e:5765
- [value] retorno de obtenerTramosIrpfLegacy; e:5766
- [value] sustitución por propiedad del argumento; e:5768
- [value] argumento conservado sin afirmar cierre; e:5769
- [value] argumento conservado sin afirmar cierre; e:5770
- [value] argumento conservado sin afirmar cierre; e:5771
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5773
- [value] !(escalasPublicadas !== undefined); e:5774
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5775
- [value] argumento conservado sin afirmar cierre; e:5776
- [value] argumento de min; e:5778
- [value] argumento de min; e:5780
- [value] sustitución por propiedad del argumento; e:5782
- [value] receptor de operación Decimal; e:5783
- [value] argumento de mul; e:5784
- [value] argumento conservado sin afirmar cierre; e:5785
- [value] argumento conservado sin afirmar cierre; e:5786
- [value] retorno de calcularCuotaPorEscalaGeneral; e:5787
- [value] !(usaEscalaAutonomicaReal); e:5788
- [value] receptor de operación Decimal; e:5790
- [selection] selecciona rama; e:5791
- [selection] selecciona rama; e:5792
- [value] sustitución por propiedad del argumento; e:5795
- [value] sustitución por propiedad del argumento; e:5797
- [value] argumento conservado sin afirmar cierre; e:5798
- [value] argumento conservado sin afirmar cierre; e:5799
- [value] escalasPublicadas !== undefined; e:5800
- [selection] selecciona Match; e:5801
- [selection] base matches (base) => base.lte(0); e:5802
- [value] base matches (base) => base.lte(0); e:5803
- [value] sustitución por propiedad del argumento; e:5808
- [value] sustitución por propiedad del argumento; e:5810
- [value] argumento conservado sin afirmar cierre; e:5811
- [value] argumento conservado sin afirmar cierre; e:5812
- [value] argumento conservado sin afirmar cierre; e:5813
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5815
- [value] !(escalasPublicadas !== undefined); e:5816
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5817
- [value] argumento conservado sin afirmar cierre; e:5818
- [selection] selecciona rama; e:5819
- [value] caso.derechosMinimos === undefined; e:5820
- [value] argumento conservado sin afirmar cierre; e:5821
- [value] argumento conservado sin afirmar cierre; e:5822
- [value] !(caso.derechosMinimos === undefined); e:5824
- [value] argumento conservado sin afirmar cierre; e:5828
- [value] argumento conservado sin afirmar cierre; e:5829
- [value] sustitución por propiedad del argumento; e:5834
- [value] sustitución por propiedad del argumento; e:5836
- [value] receptor de operación Decimal; e:5840
- [selection] selecciona Match; e:5841
- [selection] edad matches (edad) => edad >= 65; e:5842
- [value] argumento conservado sin afirmar cierre; e:5843
- [value] argumento conservado sin afirmar cierre; e:5844
- [value] sustitución por propiedad del argumento; e:5849
- [value] sustitución por propiedad del argumento; e:5851
- [value] edad matches (edad) => edad >= 65; e:5854
- [value] sustitución de argumento exacto; e:5855
- [value] constructor Decimal; e:5856
- [value] retorno de crearImporteMonetario; e:5857
- [value] ningún matcher previo ((edad) => edad >= 65) && else; e:5859
- [value] argumento de plus; e:5861
- [value] receptor de operación Decimal; e:5862
- [selection] selecciona Match; e:5863
- [selection] edad matches (edad) => edad >= 75; e:5864
- [value] argumento conservado sin afirmar cierre; e:5865
- [value] argumento conservado sin afirmar cierre; e:5866
- [value] sustitución por propiedad del argumento; e:5871
- [value] sustitución por propiedad del argumento; e:5873
- [value] edad matches (edad) => edad >= 75; e:5876
- [value] sustitución de argumento exacto; e:5877
- [value] constructor Decimal; e:5878
- [value] retorno de crearImporteMonetario; e:5879
- [value] ningún matcher previo ((edad) => edad >= 75) && else; e:5881
- [value] argumento de plus; e:5883
- [value] retorno de obtenerMinimoContribuyente; e:5884
- [value] receptor de operación Decimal; e:5886
- [value] argumento conservado sin afirmar cierre; e:5887
- [value] argumento conservado sin afirmar cierre; e:5888
- [value] sustitución de argumento exacto; e:5889
- [value] constructor Decimal; e:5890
- [value] retorno de crearImporteMonetario; e:5891
- [value] argumento conservado sin afirmar cierre; e:5893
- [value] argumento conservado sin afirmar cierre; e:5894
- [value] retorno de obtenerMinimoDescendientes; e:5895
- [value] argumento de plus; e:5897
- [value] receptor de operación Decimal; e:5898
- [value] binding único desde servicio anual; e:5899
- [value] sustitución por propiedad del argumento; e:5902
- [value] sustitución de argumento exacto; e:5904
- [value] argumento conservado sin afirmar cierre; e:5905
- [value] sustitución de argumento exacto; e:5906
- [value] constructor Decimal; e:5907
- [value] retorno de crearImporteMonetario; e:5908
- [value] argumento conservado sin afirmar cierre; e:5910
- [value] argumento conservado sin afirmar cierre; e:5911
- [value] retorno de obtenerMinimoAscendientes; e:5912
- [value] argumento de plus; e:5914
- [value] receptor de operación Decimal; e:5915
- [value] binding único desde servicio anual; e:5916
- [value] sustitución por propiedad del argumento; e:5919
- [value] sustitución de argumento exacto; e:5920
- [value] sustitución de argumento exacto; e:5922
- [value] argumento conservado sin afirmar cierre; e:5923
- [value] argumento conservado sin afirmar cierre; e:5924
- [value] retorno de obtenerMinimoPorDiscapacidad; e:5925
- [value] retorno de obtenerMinimoDiscapacidadContribuyente; e:5926
- [value] argumento de plus; e:5928
- [value] receptor de operación Decimal; e:5929
- [value] binding único desde servicio anual; e:5930
- [value] sustitución por propiedad del argumento; e:5933
- [value] sustitución de argumento exacto; e:5935
- [value] argumento conservado sin afirmar cierre; e:5936
- [value] sustitución de argumento exacto; e:5937
- [value] constructor Decimal; e:5938
- [value] retorno de crearImporteMonetario; e:5939
- [value] argumento conservado sin afirmar cierre; e:5941
- [value] argumento conservado sin afirmar cierre; e:5942
- [value] retorno de obtenerMinimoDiscapacidadFamiliares; e:5943
- [value] receptor de operación Decimal; e:5944
- [value] sustitución por propiedad del argumento; e:5945
- [value] sustitución de argumento exacto; e:5947
- [value] argumento conservado sin afirmar cierre; e:5948
- [value] sustitución de argumento exacto; e:5949
- [value] constructor Decimal; e:5950
- [value] retorno de crearImporteMonetario; e:5951
- [value] argumento conservado sin afirmar cierre; e:5953
- [value] argumento conservado sin afirmar cierre; e:5954
- [value] retorno de obtenerMinimoDiscapacidadAscendientes; e:5955
- [value] argumento de plus; e:5956
- [value] argumento de plus; e:5958
- [value] retorno de calcularMinimoPersonalYFamiliar; e:5959
- [value] ??; e:5960
- [value] argumento de min; e:5962
- [value] argumento de min; e:5964
- [value] sustitución por propiedad del argumento; e:5966
- [value] receptor de operación Decimal; e:5967
- [value] argumento de mul; e:5968
- [value] argumento conservado sin afirmar cierre; e:5969
- [value] argumento conservado sin afirmar cierre; e:5970
- [value] retorno de calcularCuotaPorEscala; e:5971
- [value] usaEscalaAutonomicaReal; e:5972
- [value] receptor de operación Decimal; e:5974
- [value] argumento de mul; e:5975
- [value] !(usaEscalaAutonomicaReal); e:5976
- [value] argumento de plus; e:5978
- [value] argumento de minus; e:5980
- [value] argumento de max; e:5981
- [value] receptor de operación Decimal; e:5983
- [value] argumento de max; e:5984
- [value] receptor de operación Decimal; e:5986
- [selection] selecciona rama; e:5987
- [selection] selecciona rama; e:5989
- [value] componente === "estatal"; e:5990
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5991
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5993
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5995
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5997
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5999
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6000
- [value] sustitución por propiedad del argumento; e:6002
- [value] sustitución por propiedad del argumento; e:6004
- [value] argumento conservado sin afirmar cierre; e:6005
- [value] argumento conservado sin afirmar cierre; e:6006
- [value] escalasPublicadas !== undefined; e:6007
- [selection] selecciona Match; e:6008
- [selection] base matches (base) => base.lte(0); e:6009
- [value] base matches (base) => base.lte(0); e:6010
- [value] sustitución por propiedad del argumento; e:6012
- [value] sustitución por propiedad del argumento; e:6014
- [value] argumento conservado sin afirmar cierre; e:6015
- [value] argumento conservado sin afirmar cierre; e:6016
- [value] argumento conservado sin afirmar cierre; e:6017
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6019
- [value] !(escalasPublicadas !== undefined); e:6020
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6021
- [value] argumento conservado sin afirmar cierre; e:6022
- [value] sustitución por propiedad del argumento; e:6025
- [value] sustitución por propiedad del argumento; e:6027
- [value] sustitución por propiedad del argumento; e:6029
- [value] receptor de operación Decimal; e:6030
- [value] argumento de mul; e:6031
- [value] argumento conservado sin afirmar cierre; e:6032
- [value] argumento conservado sin afirmar cierre; e:6033
- [value] retorno de calcularCuotaPorEscala; e:6034
- [value] retorno de calcularCuotaComponenteAhorro; e:6035
- [value] receptor de operación Decimal; e:6037
- [selection] selecciona rama; e:6038
- [selection] selecciona rama; e:6039
- [selection] selecciona rama; e:6041
- [value] componente === "estatal"; e:6042
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6043
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6045
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6047
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6049
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6051
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6052
- [value] sustitución por propiedad del argumento; e:6054
- [value] sustitución por propiedad del argumento; e:6056
- [value] argumento conservado sin afirmar cierre; e:6057
- [value] argumento conservado sin afirmar cierre; e:6058
- [value] escalasPublicadas !== undefined; e:6059
- [selection] selecciona Match; e:6060
- [selection] base matches (base) => base.lte(0); e:6061
- [value] base matches (base) => base.lte(0); e:6062
- [value] sustitución por propiedad del argumento; e:6064
- [value] sustitución por propiedad del argumento; e:6066
- [value] argumento conservado sin afirmar cierre; e:6067
- [value] argumento conservado sin afirmar cierre; e:6068
- [value] argumento conservado sin afirmar cierre; e:6069
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6071
- [value] !(escalasPublicadas !== undefined); e:6072
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6073
- [value] argumento conservado sin afirmar cierre; e:6074
- [value] argumento de max; e:6075
- [value] sustitución por propiedad del argumento; e:6076
- [value] receptor de operación Decimal; e:6077
- [value] argumento de max; e:6078
- [value] sustitución por propiedad del argumento; e:6081
- [value] sustitución de argumento exacto; e:6082
- [value] receptor de operación Decimal; e:6083
- [value] argumento de max; e:6084
- [value] sustitución por propiedad del argumento; e:6087
- [value] argumento de max; e:6088
- [value] argumento de minus; e:6089
- [value] argumento de max; e:6090
- [value] argumento de min; e:6091
- [value] argumento de max; e:6092
- [value] sustitución por propiedad del argumento; e:6093
- [value] argumento de max; e:6094
- [value] argumento de min; e:6095
- [value] argumento de minus; e:6097
- [value] argumento de max; e:6098
- [value] sustitución por propiedad del argumento; e:6100
- [value] sustitución por propiedad del argumento; e:6102
- [value] receptor de operación Decimal; e:6103
- [value] argumento de mul; e:6104
- [value] argumento conservado sin afirmar cierre; e:6105
- [value] argumento conservado sin afirmar cierre; e:6106
- [value] retorno de calcularCuotaPorEscala; e:6107
- [value] retorno de calcularCuotaComponenteAhorro; e:6108
- [value] anio <= 2014; e:6109
- [value] argumento de max; e:6110
- [value] receptor de operación Decimal; e:6112
- [selection] selecciona rama; e:6113
- [selection] selecciona rama; e:6115
- [value] componente === "estatal"; e:6116
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6117
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6119
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6121
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6123
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6125
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6126
- [value] sustitución por propiedad del argumento; e:6128
- [value] sustitución por propiedad del argumento; e:6130
- [value] argumento conservado sin afirmar cierre; e:6131
- [value] argumento conservado sin afirmar cierre; e:6132
- [value] escalasPublicadas !== undefined; e:6133
- [selection] selecciona Match; e:6134
- [selection] base matches (base) => base.lte(0); e:6135
- [value] base matches (base) => base.lte(0); e:6136
- [value] sustitución por propiedad del argumento; e:6138
- [value] sustitución por propiedad del argumento; e:6140
- [value] argumento conservado sin afirmar cierre; e:6141
- [value] argumento conservado sin afirmar cierre; e:6142
- [value] argumento conservado sin afirmar cierre; e:6143
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6145
- [value] !(escalasPublicadas !== undefined); e:6146
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6147
- [value] argumento conservado sin afirmar cierre; e:6148
- [value] sustitución por propiedad del argumento; e:6151
- [value] sustitución por propiedad del argumento; e:6153
- [value] receptor de operación Decimal; e:6154
- [value] argumento de mul; e:6155
- [value] argumento conservado sin afirmar cierre; e:6156
- [value] argumento conservado sin afirmar cierre; e:6157
- [value] retorno de calcularCuotaPorEscala; e:6158
- [value] retorno de calcularCuotaComponenteAhorro; e:6159
- [value] argumento de minus; e:6160
- [value] argumento de max; e:6161
- [value] !(anio <= 2014); e:6162
- [value] argumento de minus; e:6164
- [value] retorno de componente; e:6166
- [value] retorno de calcularAhorroConMinimos; e:6168
- [value] receptor de operación Decimal; e:6172
- [selection] selecciona rama; e:6173
- [selection] selecciona rama; e:6175
- [value] !(componente === "estatal"); e:6176
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6177
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6179
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6181
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6183
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6185
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6186
- [value] sustitución por propiedad del argumento; e:6188
- [value] sustitución por propiedad del argumento; e:6190
- [value] argumento conservado sin afirmar cierre; e:6191
- [value] argumento conservado sin afirmar cierre; e:6192
- [value] escalasPublicadas !== undefined; e:6193
- [selection] selecciona Match; e:6194
- [selection] base matches (base) => base.lte(0); e:6195
- [value] base matches (base) => base.lte(0); e:6196
- [value] sustitución por propiedad del argumento; e:6198
- [value] sustitución por propiedad del argumento; e:6200
- [value] argumento conservado sin afirmar cierre; e:6201
- [value] argumento conservado sin afirmar cierre; e:6202
- [value] argumento conservado sin afirmar cierre; e:6203
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6205
- [value] !(escalasPublicadas !== undefined); e:6206
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6207
- [value] argumento conservado sin afirmar cierre; e:6208
- [value] sustitución por propiedad del argumento; e:6209
- [value] sustitución por propiedad del argumento; e:6211
- [value] sustitución por propiedad del argumento; e:6213
- [value] receptor de operación Decimal; e:6214
- [value] argumento de mul; e:6215
- [value] argumento conservado sin afirmar cierre; e:6216
- [value] argumento conservado sin afirmar cierre; e:6217
- [value] retorno de calcularCuotaPorEscala; e:6218
- [value] retorno de calcularCuotaComponenteAhorro; e:6219
- [value] receptor de operación Decimal; e:6221
- [selection] selecciona rama; e:6222
- [selection] selecciona rama; e:6223
- [selection] selecciona rama; e:6225
- [value] !(componente === "estatal"); e:6226
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6227
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6229
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6231
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6233
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6235
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6236
- [value] sustitución por propiedad del argumento; e:6238
- [value] sustitución por propiedad del argumento; e:6240
- [value] argumento conservado sin afirmar cierre; e:6241
- [value] argumento conservado sin afirmar cierre; e:6242
- [value] escalasPublicadas !== undefined; e:6243
- [selection] selecciona Match; e:6244
- [selection] base matches (base) => base.lte(0); e:6245
- [value] base matches (base) => base.lte(0); e:6246
- [value] sustitución por propiedad del argumento; e:6248
- [value] sustitución por propiedad del argumento; e:6250
- [value] argumento conservado sin afirmar cierre; e:6251
- [value] argumento conservado sin afirmar cierre; e:6252
- [value] argumento conservado sin afirmar cierre; e:6253
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6255
- [value] !(escalasPublicadas !== undefined); e:6256
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6257
- [value] argumento conservado sin afirmar cierre; e:6258
- [value] argumento de max; e:6259
- [value] sustitución por propiedad del argumento; e:6260
- [value] receptor de operación Decimal; e:6261
- [value] argumento de max; e:6262
- [value] sustitución por propiedad del argumento; e:6265
- [value] sustitución de argumento exacto; e:6266
- [value] receptor de operación Decimal; e:6267
- [value] argumento de max; e:6268
- [value] sustitución por propiedad del argumento; e:6269
- [value] argumento de max; e:6270
- [value] argumento de minus; e:6271
- [value] argumento de max; e:6272
- [value] argumento de min; e:6273
- [value] argumento de max; e:6274
- [value] sustitución por propiedad del argumento; e:6275
- [value] argumento de max; e:6276
- [value] argumento de min; e:6277
- [value] argumento de minus; e:6279
- [value] argumento de max; e:6280
- [value] sustitución por propiedad del argumento; e:6282
- [value] sustitución por propiedad del argumento; e:6284
- [value] receptor de operación Decimal; e:6285
- [value] argumento de mul; e:6286
- [value] argumento conservado sin afirmar cierre; e:6287
- [value] argumento conservado sin afirmar cierre; e:6288
- [value] retorno de calcularCuotaPorEscala; e:6289
- [value] retorno de calcularCuotaComponenteAhorro; e:6290
- [value] anio <= 2014; e:6291
- [value] argumento de max; e:6292
- [value] receptor de operación Decimal; e:6294
- [selection] selecciona rama; e:6295
- [selection] selecciona rama; e:6297
- [value] !(componente === "estatal"); e:6298
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6299
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6301
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6303
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6305
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6307
- [value] retorno de obtenerEscalasAhorroPublicadas; e:6308
- [value] sustitución por propiedad del argumento; e:6310
- [value] sustitución por propiedad del argumento; e:6312
- [value] argumento conservado sin afirmar cierre; e:6313
- [value] argumento conservado sin afirmar cierre; e:6314
- [value] escalasPublicadas !== undefined; e:6315
- [selection] selecciona Match; e:6316
- [selection] base matches (base) => base.lte(0); e:6317
- [value] base matches (base) => base.lte(0); e:6318
- [value] sustitución por propiedad del argumento; e:6320
- [value] sustitución por propiedad del argumento; e:6322
- [value] argumento conservado sin afirmar cierre; e:6323
- [value] argumento conservado sin afirmar cierre; e:6324
- [value] argumento conservado sin afirmar cierre; e:6325
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6327
- [value] !(escalasPublicadas !== undefined); e:6328
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6329
- [value] argumento conservado sin afirmar cierre; e:6330
- [value] sustitución por propiedad del argumento; e:6333
- [value] sustitución por propiedad del argumento; e:6335
- [value] receptor de operación Decimal; e:6336
- [value] argumento de mul; e:6337
- [value] argumento conservado sin afirmar cierre; e:6338
- [value] argumento conservado sin afirmar cierre; e:6339
- [value] retorno de calcularCuotaPorEscala; e:6340
- [value] retorno de calcularCuotaComponenteAhorro; e:6341
- [value] argumento de minus; e:6342
- [value] argumento de max; e:6343
- [value] !(anio <= 2014); e:6344
- [value] argumento de minus; e:6346
- [value] retorno de componente; e:6348
- [value] retorno de calcularAhorroConMinimos; e:6350
- [value] argumento de plus; e:6354
- [value] argumento de minus; e:6356
- [value] argumento de max; e:6357
- [value] argumento de plus; e:6359
- [value] receptor de operación Decimal; e:6360
- [selection] selecciona rama; e:6361
- [value] binding único desde servicio anual; e:6362
- [value] sustitución de argumento exacto; e:6363
- [value] ??; e:6366
- [value] retorno de sumarDeduccionesAutonomicasCentimos; e:6367
- [value] conversión monetaria explícita; e:6368
- [value] aplicación de la primitiva monetaria del módulo dinero; e:6369
- [value] argumento de min; e:6371
- [value] argumento de max; e:6372
- [value] receptor de operación Decimal; e:6374
- [value] argumento de minus; e:6376
- [value] argumento de max; e:6377
- [value] receptor de operación Decimal; e:6379
- [value] retorno de componente; e:6382
- [value] retorno de calcularAhorroConMinimos; e:6384
- [value] argumento de plus; e:6388
- [value] argumento de min; e:6389
- [value] usaEscalaAutonomicaReal; e:6390
- [value] !(usaEscalaAutonomicaReal); e:6392
- [value] argumento de minus; e:6394
- [value] argumento de max; e:6395

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
