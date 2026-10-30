# anual.cuota.diferencial

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: `${euros(cuotaLiquida)} - ${euros(centimosAEuros(caso.retencionesSoportadasCentimos))} - ${euros(centimosAEuros(pagosACuentaAplicadosCentimos))}`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- caso / situacionFamiliar.descendientes (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- crearImporte(0) / value (centimos, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
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
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- caso / situacionFamiliar.ascendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
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
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2343–2537
- Effect.mapError(errorDerechosMinimos) / value (centimos, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- crearImporte(0) / value (centimos, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaAutonomicaIgualEstatal (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- caso / comunidadAutonoma (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- bruto / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (a, b) => b.edad - a.edad / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (centimos, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- Object.values(parametros.tiposSeguridadSocial) / value (centimos, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- (a, b) => b.edad - a.edad / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- caso / retencionTrabajoAeat (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (centimos, value); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
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
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- caso / situacionFamiliar.discapacidad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- parametros.baseMaxima / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- [
  ...filas([
    ["0", "0", ".096"],
    ["12960.45", "1244.20", ".1146"],
    ["21028.20", "2168.76", ".1374"],
    ["35394", "4142.62", ".1822"],
  ]),
  {
 / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3107–3406
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
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
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
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
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
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
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- caso / situacionFamiliar.ascendientes (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- centimosAEuros(
    sumarDeduccionesAutonomicasCentimos(caso)
  ) / value (centimos, value); Unidad de salida no acreditada: centimosAEuros; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24800–24865
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaEstatalGeneral (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
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
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17648–17711
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- errorDerechosMinimos / value (centimos, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- [escalaPublicadaAutonomica] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17914–17941
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (centimos, value); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- caso / situacionFamiliar.discapacidad (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaAutonomica.tramos (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- Effect.mapError(errorDerechosMinimos) / value (centimos, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }),
    base.mul(0),
    (total, tramo) => / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:756–944
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4085–4285
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2027–2297
- yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28263–28379
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- contexto / contexto (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- bruto / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Contrato de llamada pendiente: dependencias.retencionTrabajoAeat.calcular; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28270–28379
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
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
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
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
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (centimos, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
- liquidarCentimos(cuotaLiquida) / value (centimos, value); Contrato de llamada pendiente: liquidarCentimos; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28084–28114
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
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
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.general (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- () => [] / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- caso / rendimientos.trabajo (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- caso / retencionTrabajoAeat (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:899–940
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
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
    prim / contribuyente.adicionalMayor75 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2590–2781
- [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- [
  [importe(6000), importe("0.195")],
  [importe(50000), importe("0.215")],
  [importe(Infinity), importe("0.235")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4437–4556
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
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
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaEstatalGeneral (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17648–17711
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
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
- Object.values(parametros.tiposSeguridadSocial) / value (centimos, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- caso / rendimientos.trabajo (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- Object.values(parametros.tiposSeguridadSocial) / value (centimos, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2833–3062
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
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
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- Option.getOrElse(() => []) / value (centimos, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor75 (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (centimos, value); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }),
    base.mul(0),
    (total, tramo) => / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:756–944
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
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
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2590–2781
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
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
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2833–3062
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- caso / fechaFallecimiento (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (centimos, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3115–3307
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- convertirCentimosAEuros(0) / value (selector, selection); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:899–940
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (centimos, value); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (centimos, value); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2027–2297
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- convertirCentimosAEuros(0) / value (centimos, value); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso / situacionFamiliar.descendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (selector, selection); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (centimos, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (centimos, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaAutonomica.tramos (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- caso / pagosACuentaCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- {
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4149–4280
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
- [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2343–2537
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (centimos, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- parametros.baseMaxima / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- BASE_MAXIMA_COTIZACION_LEGACY / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [escalaPublicadaAutonomica] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17914–17941
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- errorDerechosMinimos / value (centimos, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
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
- () => [] / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- caso / retencionesSoportadasCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- Option.getOrElse(() => []) / value (centimos, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (centimos, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (centimos, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaAutonomicaIgualEstatal (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- obtenerEscalaAutonomicaPublicada(caso) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalaAutonomicaPublicada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17766–17804
## Condiciones por relación

- [selection] binding único desde servicio anual; e:36
- [selection] ===; e:39
- [selection] binding único desde servicio anual; e:41
- [selection] sustitución por propiedad del argumento; e:44
- [selection] ===; e:46
- [selection] sustitución por propiedad del argumento; e:87
- [selection] sustitución por propiedad del argumento; e:89
- [selection] sustitución de argumento exacto; e:90
- [selection] selección de elemento; e:91
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:94
- [selection] sustitución de argumento exacto; e:96
- [selection] sustitución de argumento exacto; e:98
- [selection] argumento conservado sin afirmar cierre; e:99
- [selection] sustitución por propiedad del argumento; e:152
- [selection] sustitución de argumento exacto; e:153
- [selection] sustitución de argumento exacto; e:154
- [selection] sustitución de argumento exacto; e:174
- [selection] >=; e:176
- [selection] sustitución de argumento exacto; e:213
- [selection] sustitución por propiedad del argumento; e:226
- [selection] binding único desde servicio anual; e:338
- [selection] sustitución por propiedad del argumento; e:341
- [selection] sustitución de argumento exacto; e:342
- [selection] selección de elemento; e:343
- [selection] retorno de obtenerParametrosCotizacionLegacy; e:346
- [selection] sustitución de argumento exacto; e:348
- [selection] sustitución de argumento exacto; e:350
- [selection] argumento conservado sin afirmar cierre; e:351
- [selection] sustitución de argumento exacto; e:412
- [selection] sustitución de argumento exacto; e:413
- [selection] sustitución de argumento exacto; e:433
- [selection] >=; e:435
- [selection] sustitución de argumento exacto; e:469
- [selection] sustitución de argumento exacto; e:470
- [selection] sustitución de argumento exacto; e:474
- [selection] >=; e:476
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
- [selection] sustitución de argumento exacto; e:587
- [selection] sustitución de argumento exacto; e:588
- [selection] sustitución de argumento exacto; e:608
- [selection] >=; e:610
- [selection] sustitución de argumento exacto; e:644
- [selection] sustitución de argumento exacto; e:645
- [selection] sustitución de argumento exacto; e:649
- [selection] >=; e:651
- [selection] sustitución por propiedad del argumento; e:696
- [selection] binding único desde servicio anual; e:709
- [selection] sustitución por propiedad del argumento; e:712
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
- [selection] sustitución por propiedad del argumento; e:762
- [selection] <=; e:764
- [selection] sustitución de argumento exacto; e:777
- [selection] <=; e:779
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
- [selection] sustitución de argumento exacto; e:1345
- [selection] receptor de operación Decimal; e:1346
- [selection] argumento de lte; e:1347
- [selection] sustitución de argumento exacto; e:1353
- [selection] receptor de operación Decimal; e:1354
- [selection] argumento de lte; e:1355
- [selection] sustitución de argumento exacto; e:1385
- [selection] <=; e:1387
- [selection] sustitución por propiedad del argumento; e:1389
- [selection] sustitución de argumento exacto; e:1390
- [selection] sustitución de argumento exacto; e:1392
- [selection] receptor de operación Decimal; e:1393
- [selection] argumento de lte; e:1394
- [selection] sustitución de argumento exacto; e:1400
- [selection] receptor de operación Decimal; e:1401
- [selection] argumento de lte; e:1402
- [selection] argumento conservado sin afirmar cierre; e:1426
- [selection] argumento conservado sin afirmar cierre; e:1427
- [selection] retorno de fallecidoAntesDeFechaCivil; e:1428
- [selection] sustitución por propiedad del argumento; e:1430
- [selection] sustitución por propiedad del argumento; e:1432
- [selection] sustitución de argumento exacto; e:1433
- [selection] sustitución de argumento exacto; e:1435
- [selection] receptor de operación Decimal; e:1436
- [selection] argumento de lte; e:1437
- [selection] sustitución de argumento exacto; e:1443
- [selection] receptor de operación Decimal; e:1444
- [selection] argumento de lte; e:1445
- [selection] sustitución por propiedad del argumento; e:1472
- [selection] sustitución de argumento exacto; e:1473
- [selection] sustitución de argumento exacto; e:1475
- [selection] receptor de operación Decimal; e:1476
- [selection] argumento de lte; e:1477
- [selection] sustitución de argumento exacto; e:1483
- [selection] receptor de operación Decimal; e:1484
- [selection] argumento de lte; e:1485
- [selection] sustitución de argumento exacto; e:1510
- [selection] constructor Decimal; e:1511
- [selection] retorno de crearImporteMonetario; e:1512
- [selection] sustitución de argumento exacto; e:1514
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
- [selection] sustitución de argumento exacto; e:1657
- [selection] <=; e:1659
- [selection] sustitución por propiedad del argumento; e:1661
- [selection] sustitución de argumento exacto; e:1662
- [selection] sustitución de argumento exacto; e:1664
- [selection] receptor de operación Decimal; e:1665
- [selection] argumento de lte; e:1666
- [selection] sustitución de argumento exacto; e:1672
- [selection] receptor de operación Decimal; e:1673
- [selection] argumento de lte; e:1674
- [selection] sustitución de argumento exacto; e:1676
- [selection] constructor Decimal; e:1677
- [selection] retorno de crearImporteMonetario; e:1678
- [selection] sustitución de argumento exacto; e:1680
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
- [selection] sustitución por propiedad del argumento; e:1729
- [selection] sustitución de argumento exacto; e:1730
- [selection] sustitución de argumento exacto; e:1732
- [selection] receptor de operación Decimal; e:1733
- [selection] argumento de lte; e:1734
- [selection] sustitución de argumento exacto; e:1740
- [selection] receptor de operación Decimal; e:1741
- [selection] argumento de lte; e:1742
- [selection] sustitución de argumento exacto; e:1744
- [selection] constructor Decimal; e:1745
- [selection] retorno de crearImporteMonetario; e:1746
- [selection] sustitución de argumento exacto; e:1748
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
- [selection] sustitución por propiedad del argumento; e:1797
- [selection] sustitución de argumento exacto; e:1798
- [selection] sustitución de argumento exacto; e:1800
- [selection] receptor de operación Decimal; e:1801
- [selection] argumento de lte; e:1802
- [selection] sustitución de argumento exacto; e:1808
- [selection] receptor de operación Decimal; e:1809
- [selection] argumento de lte; e:1810
- [selection] sustitución de argumento exacto; e:1827
- [selection] receptor de operación Decimal; e:1828
- [selection] argumento de lt; e:1829
- [selection] sustitución por propiedad del argumento; e:1904
- [selection] sustitución por propiedad del argumento; e:1906
- [selection] !==; e:1908
- [selection] argumento de max; e:1910
- [selection] sustitución por propiedad del argumento; e:1913
- [selection] argumento de max; e:1915
- [selection] retorno de calcularBaseImponibleAhorro; e:1916
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1917
- [selection] sustitución por propiedad del argumento; e:1920
- [selection] sustitución por propiedad del argumento; e:1922
- [selection] sustitución por propiedad del argumento; e:1924
- [selection] sustitución de argumento exacto; e:1926
- [selection] receptor de operación Decimal; e:1927
- [selection] argumento de lte; e:1928
- [selection] binding único desde servicio anual; e:1931
- [selection] sustitución por propiedad del argumento; e:1934
- [selection] sustitución de argumento exacto; e:1935
- [value] argumento de max; e:1999
- [value] argumento de max; e:2000
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
- [selection] selecciona rama; e:2055
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
- [selection] selecciona rama; e:2076
- [selection] selecciona rama; e:2077
- [value] caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"; e:2078
- [value] !(caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"); e:2079
- [value] sustitución por propiedad del argumento; e:2082
- [value] sustitución por propiedad del argumento; e:2084
- [value] argumento conservado sin afirmar cierre; e:2085
- [value] argumento conservado sin afirmar cierre; e:2086
- [value] escalasPublicadas !== undefined; e:2087
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
- [selection] selecciona Match; e:2343
- [selection] sustitución de argumento exacto; e:2344
- [selection] receptor de operación Decimal; e:2345
- [selection] argumento de lte; e:2346
- [selection] base matches (base) => base.lte(0); e:2347
- [value] base matches (base) => base.lte(0); e:2348
- [selection] selecciona Match; e:2349
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:2350
- [value] anio matches 2012; e:2351
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:2352
- [value] ningún matcher previo (2012) && anio matches 2013; e:2353
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:2354
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:2355
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:2356
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:2357
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:2358
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:2359
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:2360
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:2361
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:2362
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:2363
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:2364
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:2365
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:2366
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:2367
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:2368
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:2369
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:2370
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:2371
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:2372
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:2373
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:2374
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:2375
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:2376
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:2377
- [selection] selecciona Match; e:2378
- [value] comunidadAutonoma matches "simulada-estatal"; e:2379
- [value] ningún matcher previo ("simulada-estatal") && else; e:2380
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:2381
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:2382
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:2383
- [value] retorno de obtenerParametrosComunidadAutonomaPuro; e:2384
- [value] si calcular devuelve; instrumentación no transforma el valor; e:2385
- [value] argumento conservado sin afirmar cierre; e:2387
- [value] argumento conservado sin afirmar cierre; e:2388
- [value] sustitución por propiedad del argumento; e:2394
- [value] sustitución por propiedad del argumento; e:2396
- [value] argumento conservado sin afirmar cierre; e:2397
- [value] argumento conservado sin afirmar cierre; e:2398
- [value] argumento conservado sin afirmar cierre; e:2399
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:2401
- [value] !(escalasPublicadas !== undefined); e:2402
- [value] retorno de calcularDesgloseCuotaPorEscala; e:2403
- [value] argumento conservado sin afirmar cierre; e:2404
- [value] argumento de max; e:2405
- [value] argumento de max; e:2406
- [value] binding único desde servicio anual; e:2407
- [value] sustitución de argumento exacto; e:2410
- [value] argumento conservado sin afirmar cierre; e:2411
- [value] argumento conservado sin afirmar cierre; e:2412
- [value] argumento conservado sin afirmar cierre; e:2413
- [value] argumento conservado sin afirmar cierre; e:2414
- [value] retorno de sumarRendimientosTrabajo; e:2415
- [value] si calcular devuelve; instrumentación no transforma el valor; e:2416
- [value] sustitución por propiedad del argumento; e:2419
- [value] receptor de operación Decimal; e:2420
- [selection] selección de función; e:2421
- [selection] selecciona rama; e:2422
- [value] binding único desde servicio anual; e:2423
- [value] sustitución de argumento exacto; e:2426
- [value] argumento conservado sin afirmar cierre; e:2427
- [value] argumento conservado sin afirmar cierre; e:2428
- [value] argumento conservado sin afirmar cierre; e:2429
- [value] argumento conservado sin afirmar cierre; e:2430
- [value] retorno de sumarRendimientosTrabajo; e:2431
- [value] si calcular devuelve; instrumentación no transforma el valor; e:2432
- [value] sustitución por propiedad del argumento; e:2435
- [value] argumento de min; e:2436
- [value] sustitución de argumento exacto; e:2437
- [value] constructor Decimal; e:2438
- [value] retorno de crearImporteMonetario; e:2439
- [value] receptor de operación Decimal; e:2440
- [value] argumento de mul; e:2441
- [value] argumento de min; e:2442
- [value] receptor de operación Decimal; e:2443
- [value] argumento de mul; e:2444
- [value] receptor de operación Decimal; e:2445
- [value] sustitución por propiedad del argumento; e:2446
- [value] argumento de min; e:2447
- [value] sustitución de argumento exacto; e:2448
- [value] constructor Decimal; e:2449
- [value] retorno de crearImporteMonetario; e:2450
- [value] receptor de operación Decimal; e:2451
- [value] argumento de mul; e:2452
- [value] argumento de min; e:2453
- [value] receptor de operación Decimal; e:2454
- [value] argumento de mul; e:2455
- [value] argumento de plus; e:2456
- [value] receptor de operación Decimal; e:2457
- [value] argumento de div; e:2458
- [value] anio === 2018; e:2459
- [selection] selecciona Match; e:2460
- [value] sustitución por propiedad del argumento; e:2461
- [value] sustitución por propiedad del argumento; e:2463
- [value] sustitución de argumento exacto; e:2464
- [value] sustitución de argumento exacto; e:2465
- [value] a.lessThan(b) matches true; e:2466
- [selection] selección de elemento; e:2468
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2471
- [value] sustitución de argumento exacto; e:2473
- [value] sustitución de argumento exacto; e:2475
- [value] ningún matcher previo (true) && else; e:2476
- [value] retorno de minimo; e:2477
- [value] retorno de baseCotizacionPara; e:2480
- [value] retorno de calcularDesgloseCotizacionesSocialesLegacy; e:2484
- [value] !(anio === 2018); e:2487
- [value] receptor de operación Decimal; e:2489
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2493
- [value] sustitución de argumento exacto; e:2495
- [value] argumento conservado sin afirmar cierre; e:2497
- [value] argumento conservado sin afirmar cierre; e:2498
- [value] sustitución de argumento exacto; e:2499
- [value] constructor Decimal; e:2500
- [value] retorno de crearImporteMonetario; e:2501
- [value] argumento conservado sin afirmar cierre; e:2503
- [value] argumento conservado sin afirmar cierre; e:2504
- [value] retorno de sumarTipoCotizacionLegacy; e:2505
- [value] argumento de mul; e:2506
- [value] receptor de operación Decimal; e:2508
- [value] receptor de operación Decimal; e:2510
- [selection] selecciona Match; e:2511
- [value] sustitución de argumento exacto; e:2512
- [value] constructor Decimal; e:2513
- [value] retorno de crearImporteMonetario; e:2514
- [value] anio matches 2023; e:2517
- [value] sustitución de argumento exacto; e:2518
- [value] constructor Decimal; e:2519
- [value] retorno de crearImporteMonetario; e:2520
- [value] ningún matcher previo (2023) && anio matches 2024; e:2523
- [value] sustitución de argumento exacto; e:2524
- [value] constructor Decimal; e:2525
- [value] retorno de crearImporteMonetario; e:2526
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:2529
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:2530
- [value] sustitución de argumento exacto; e:2531
- [value] constructor Decimal; e:2532
- [value] retorno de crearImporteMonetario; e:2533
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:2536
- [value] sustitución de argumento exacto; e:2537
- [value] constructor Decimal; e:2538
- [value] retorno de crearImporteMonetario; e:2539
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:2543
- [value] retorno de obtenerTiposMei; e:2544
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2547
- [value] argumento de mul; e:2551
- [value] argumento de plus; e:2553
- [value] receptor de operación Decimal; e:2554
- [value] argumento de max; e:2555
- [value] sustitución por propiedad del argumento; e:2556
- [value] receptor de operación Decimal; e:2557
- [value] argumento de minus; e:2559
- [value] argumento de max; e:2560
- [value] sustitución de argumento exacto; e:2562
- [value] argumento de min; e:2563
- [selection] selección de elemento; e:2566
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2569
- [value] sustitución de argumento exacto; e:2572
- [value] receptor de operación Decimal; e:2573
- [value] argumento de mul; e:2574
- [value] argumento de min; e:2575
- [value] receptor de operación Decimal; e:2577
- [selection] selecciona Match; e:2578
- [value] anio matches 2025; e:2585
- [value] ningún matcher previo (2025) && anio matches 2026; e:2592
- [value] ningún matcher previo (2025 | 2026) && else; e:2597
- [value] sustitución de argumento exacto; e:2600
- [value] argumento de mul; e:2602
- [value] receptor de operación Decimal; e:2603
- [value] argumento de max; e:2604
- [value] sustitución de argumento exacto; e:2605
- [value] receptor de operación Decimal; e:2606
- [value] sustitución de argumento exacto; e:2607
- [value] receptor de operación Decimal; e:2608
- [value] argumento de mul; e:2609
- [value] argumento de minus; e:2610
- [value] argumento de max; e:2611
- [value] argumento de min; e:2612
- [value] sustitución de argumento exacto; e:2613
- [value] receptor de operación Decimal; e:2614
- [value] argumento de mul; e:2615
- [value] argumento de min; e:2616
- [value] receptor de operación Decimal; e:2618
- [selection] selecciona Match; e:2619
- [value] anio matches 2025; e:2626
- [value] ningún matcher previo (2025) && anio matches 2026; e:2633
- [value] ningún matcher previo (2025 | 2026) && else; e:2638
- [value] sustitución de argumento exacto; e:2641
- [value] argumento de mul; e:2643
- [value] argumento de plus; e:2644
- [value] receptor de operación Decimal; e:2645
- [value] argumento de max; e:2646
- [value] sustitución de argumento exacto; e:2647
- [value] receptor de operación Decimal; e:2648
- [value] sustitución de argumento exacto; e:2649
- [value] receptor de operación Decimal; e:2650
- [value] argumento de mul; e:2651
- [value] argumento de minus; e:2652
- [value] argumento de max; e:2653
- [value] receptor de operación Decimal; e:2655
- [selection] selecciona Match; e:2656
- [value] anio matches 2025; e:2663
- [value] ningún matcher previo (2025) && anio matches 2026; e:2670
- [value] ningún matcher previo (2025 | 2026) && else; e:2675
- [value] sustitución de argumento exacto; e:2678
- [value] argumento de mul; e:2680
- [value] argumento de plus; e:2681
- [value] retorno de cuotaSolidaridad; e:2682
- [value] argumento de plus; e:2684
- [value] contexto.modo === "canonico" && (retorno de calcularDesgloseCotizacionesPerfilUniforme); e:2686
- [selection] selecciona Match; e:2687
- [value] sustitución de argumento exacto; e:2688
- [value] a.lessThan(b) matches true; e:2689
- [value] sustitución de argumento exacto; e:2690
- [value] ningún matcher previo (true) && else; e:2691
- [value] retorno de minimo; e:2692
- [value] retorno de baseCotizacionPara; e:2695
- [value] receptor de operación Decimal; e:2698
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2700
- [value] sustitución de argumento exacto; e:2702
- [value] argumento conservado sin afirmar cierre; e:2704
- [value] argumento conservado sin afirmar cierre; e:2705
- [value] sustitución de argumento exacto; e:2706
- [value] constructor Decimal; e:2707
- [value] retorno de crearImporteMonetario; e:2708
- [value] argumento conservado sin afirmar cierre; e:2710
- [value] argumento conservado sin afirmar cierre; e:2711
- [value] retorno de sumarTipoCotizacionLegacy; e:2712
- [value] argumento de mul; e:2713
- [value] sustitución de argumento exacto; e:2716
- [value] receptor de operación Decimal; e:2718
- [value] receptor de operación Decimal; e:2721
- [selection] selecciona Match; e:2722
- [value] anio matches 2023; e:2723
- [value] ningún matcher previo (2023) && anio matches 2024; e:2724
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:2725
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:2726
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:2727
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:2728
- [value] retorno de obtenerTiposMei; e:2729
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2732
- [value] argumento de mul; e:2736
- [value] sustitución de argumento exacto; e:2739
- [value] argumento de plus; e:2741
- [value] retorno de sumarCotizacionesSociales; e:2744
- [value] sustitución de argumento exacto; e:2745
- [value] receptor de operación Decimal; e:2747
- [selection] selecciona Match; e:2748
- [value] anio matches 2025; e:2750
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:2751
- [value] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:2753
- [value] ningún matcher previo (2025 | (anio) => anio >= 2026) && else; e:2755
- [value] retorno de obtenerPoliticaSolidaridad; e:2756
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2759
- [value] sustitución de argumento exacto; e:2761
- [value] argumento conservado sin afirmar cierre; e:2763
- [value] argumento conservado sin afirmar cierre; e:2764
- [value] retorno de calcularTotalSolidaridad; e:2765
- [value] sustitución de argumento exacto; e:2766
- [value] receptor de operación Decimal; e:2767
- [value] argumento de div; e:2768
- [value] retorno de repartirCotizacionSolidaridad; e:2771
- [value] sustitución de argumento exacto; e:2773
- [value] argumento de plus; e:2775
- [value] retorno de sumarCotizacionesSociales; e:2778
- [value] !(contexto.modo === "canonico") && (retorno de calcularDesgloseCotizacionesSocialesLegacy); e:2782
- [value] si calcular devuelve; instrumentación no transforma el valor; e:2783
- [value] sustitución por propiedad del argumento; e:2787
- [selection] selecciona Match; e:2789
- [value] sustitución de argumento exacto; e:2790
- [value] a.lessThan(b) matches true; e:2791
- [value] sustitución de argumento exacto; e:2792
- [value] ningún matcher previo (true) && else; e:2793
- [value] retorno de minimo; e:2794
- [value] retorno de baseCotizacionPara; e:2797
- [value] receptor de operación Decimal; e:2800
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2802
- [value] sustitución de argumento exacto; e:2804
- [value] argumento conservado sin afirmar cierre; e:2806
- [value] argumento conservado sin afirmar cierre; e:2807
- [value] sustitución de argumento exacto; e:2808
- [value] constructor Decimal; e:2809
- [value] retorno de crearImporteMonetario; e:2810
- [value] argumento conservado sin afirmar cierre; e:2812
- [value] argumento conservado sin afirmar cierre; e:2813
- [value] retorno de sumarTipoCotizacionLegacy; e:2814
- [value] argumento de mul; e:2815
- [value] sustitución de argumento exacto; e:2818
- [value] receptor de operación Decimal; e:2820
- [value] receptor de operación Decimal; e:2823
- [selection] selecciona Match; e:2824
- [value] anio matches 2023; e:2825
- [value] ningún matcher previo (2023) && anio matches 2024; e:2826
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:2827
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:2828
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:2829
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:2830
- [value] retorno de obtenerTiposMei; e:2831
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2834
- [value] argumento de mul; e:2838
- [value] sustitución de argumento exacto; e:2841
- [value] argumento de plus; e:2843
- [value] retorno de sumarCotizacionesSociales; e:2846
- [value] sustitución de argumento exacto; e:2847
- [value] receptor de operación Decimal; e:2849
- [selection] selecciona Match; e:2850
- [value] anio matches 2025; e:2852
- [selection] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:2853
- [value] ningún matcher previo (2025) && anio matches (anio) => anio >= 2026; e:2855
- [value] ningún matcher previo (2025 | (anio) => anio >= 2026) && else; e:2857
- [value] retorno de obtenerPoliticaSolidaridad; e:2858
- [value] retorno de obtenerParametrosCotizacionLegacy; e:2861
- [value] sustitución de argumento exacto; e:2863
- [value] argumento conservado sin afirmar cierre; e:2865
- [value] argumento conservado sin afirmar cierre; e:2866
- [value] retorno de calcularTotalSolidaridad; e:2867
- [value] sustitución de argumento exacto; e:2868
- [value] receptor de operación Decimal; e:2869
- [value] argumento de div; e:2870
- [value] retorno de repartirCotizacionSolidaridad; e:2873
- [value] sustitución de argumento exacto; e:2875
- [value] argumento de plus; e:2877
- [value] retorno de sumarCotizacionesSociales; e:2880
- [value] retorno de calcularDesgloseCotizacionesSocialesLegacy; e:2884
- [value] retorno de calcularCotizacionesSocialesLegacy; e:2888
- [value] ??; e:2890
- [value] argumento de minus; e:2892
- [value] receptor de operación Decimal; e:2894
- [selection] selección de elemento; e:2897
- [value] argumento de minus; e:2899
- [value] argumento de max; e:2900
- [value] retorno de calcularRendimientoNetoTrabajo; e:2902
- [value] si calcular devuelve; instrumentación no transforma el valor; e:2903
- [value] sustitución por propiedad del argumento; e:2906
- [value] receptor de operación Decimal; e:2908
- [selection] selecciona Match; e:2909
- [selection] anio matches () => otrasRentasNoExentas.gt(6500); e:2910
- [selection] selecciona rama; e:2911
- [value] sustitución de argumento exacto; e:2912
- [value] constructor Decimal; e:2913
- [value] retorno de crearImporteMonetario; e:2914
- [value] anio <= 2014; e:2915
- [value] sustitución de argumento exacto; e:2916
- [value] constructor Decimal; e:2917
- [value] retorno de crearImporteMonetario; e:2918
- [value] !(anio <= 2014); e:2920
- [value] anio matches () => otrasRentasNoExentas.gt(6500); e:2922
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500)) && anio matches (anio) => anio <= 2014; e:2923
- [selection] selecciona Match; e:2924
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180); e:2925
- [value] sustitución de argumento exacto; e:2926
- [value] constructor Decimal; e:2927
- [value] retorno de crearImporteMonetario; e:2928
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180); e:2929
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260); e:2930
- [value] sustitución de argumento exacto; e:2931
- [value] constructor Decimal; e:2932
- [value] retorno de crearImporteMonetario; e:2933
- [value] receptor de operación Decimal; e:2934
- [value] sustitución de argumento exacto; e:2935
- [value] constructor Decimal; e:2936
- [value] retorno de crearImporteMonetario; e:2937
- [value] receptor de operación Decimal; e:2938
- [value] retorno de calcularRendimientoNetoTrabajo; e:2941
- [value] si calcular devuelve; instrumentación no transforma el valor; e:2942
- [value] sustitución por propiedad del argumento; e:2946
- [value] sustitución de argumento exacto; e:2947
- [value] receptor de operación Decimal; e:2948
- [value] argumento de minus; e:2949
- [value] argumento de mul; e:2950
- [value] argumento de minus; e:2951
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260); e:2952
- [value] sustitución de argumento exacto; e:2953
- [value] constructor Decimal; e:2954
- [value] retorno de crearImporteMonetario; e:2955
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260)) && else; e:2956
- [value] retorno de reduccionTrabajoHasta2014; e:2957
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500)) && anio matches (anio) => anio <= 2014; e:2958
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014) && anio matches (anio) => anio <= 2017; e:2959
- [selection] selecciona Match; e:2960
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2961
- [value] sustitución de argumento exacto; e:2962
- [value] constructor Decimal; e:2963
- [value] retorno de crearImporteMonetario; e:2964
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2965
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2966
- [value] sustitución de argumento exacto; e:2967
- [value] constructor Decimal; e:2968
- [value] retorno de crearImporteMonetario; e:2969
- [value] receptor de operación Decimal; e:2970
- [value] sustitución de argumento exacto; e:2971
- [value] constructor Decimal; e:2972
- [value] retorno de crearImporteMonetario; e:2973
- [value] receptor de operación Decimal; e:2974
- [value] sustitución por propiedad del argumento; e:2975
- [value] sustitución de argumento exacto; e:2976
- [value] receptor de operación Decimal; e:2977
- [value] argumento de minus; e:2978
- [value] argumento de mul; e:2979
- [value] argumento de minus; e:2980
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2981
- [value] sustitución de argumento exacto; e:2982
- [value] constructor Decimal; e:2983
- [value] retorno de crearImporteMonetario; e:2984
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:2986
- [value] retorno de reduccionTrabajo2015A2017; e:2987
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014) && anio matches (anio) => anio <= 2017; e:2988
- [selection] selecciona Match; e:2989
- [selection] selecciona Match; e:2990
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2991
- [value] sustitución de argumento exacto; e:2992
- [value] constructor Decimal; e:2993
- [value] retorno de crearImporteMonetario; e:2994
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:2995
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:2996
- [value] sustitución de argumento exacto; e:2997
- [value] constructor Decimal; e:2998
- [value] retorno de crearImporteMonetario; e:2999
- [value] receptor de operación Decimal; e:3000
- [value] sustitución de argumento exacto; e:3001
- [value] constructor Decimal; e:3002
- [value] retorno de crearImporteMonetario; e:3003
- [value] receptor de operación Decimal; e:3004
- [value] sustitución por propiedad del argumento; e:3005
- [value] sustitución por propiedad del argumento; e:3007
- [value] sustitución de argumento exacto; e:3008
- [value] receptor de operación Decimal; e:3009
- [value] argumento de minus; e:3010
- [value] argumento de mul; e:3011
- [value] argumento de minus; e:3012
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:3013
- [value] sustitución de argumento exacto; e:3014
- [value] constructor Decimal; e:3015
- [value] retorno de crearImporteMonetario; e:3016
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:3018
- [value] retorno de reduccionTrabajo2015A2017; e:3019
- [value] fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    }) matches true; e:3021
- [selection] selecciona Match; e:3022
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:3023
- [value] sustitución de argumento exacto; e:3024
- [value] constructor Decimal; e:3025
- [value] retorno de crearImporteMonetario; e:3026
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250); e:3027
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:3028
- [value] sustitución de argumento exacto; e:3029
- [value] constructor Decimal; e:3030
- [value] retorno de crearImporteMonetario; e:3031
- [value] receptor de operación Decimal; e:3032
- [value] sustitución de argumento exacto; e:3033
- [value] constructor Decimal; e:3034
- [value] retorno de crearImporteMonetario; e:3035
- [value] receptor de operación Decimal; e:3036
- [value] sustitución por propiedad del argumento; e:3037
- [value] sustitución de argumento exacto; e:3038
- [value] receptor de operación Decimal; e:3039
- [value] argumento de minus; e:3040
- [value] argumento de mul; e:3041
- [value] argumento de minus; e:3042
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450); e:3043
- [value] sustitución de argumento exacto; e:3044
- [value] constructor Decimal; e:3045
- [value] retorno de crearImporteMonetario; e:3046
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450)) && else; e:3048
- [value] retorno de reduccionTrabajo2015A2017; e:3049
- [value] receptor de operación Decimal; e:3051
- [selection] selecciona Match; e:3052
- [selection] a matches (a) => a.greaterThan(b); e:3053
- [value] sustitución de argumento exacto; e:3054
- [value] constructor Decimal; e:3055
- [value] retorno de crearImporteMonetario; e:3056
- [value] sustitución de argumento exacto; e:3058
- [value] a matches (a) => a.greaterThan(b); e:3059
- [selection] selecciona Match; e:3060
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:3061
- [value] sustitución de argumento exacto; e:3062
- [value] constructor Decimal; e:3063
- [value] retorno de crearImporteMonetario; e:3064
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:3065
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:3066
- [selection] selecciona Match; e:3067
- [selection] a matches (a) => a.greaterThan(b); e:3068
- [value] sustitución de argumento exacto; e:3069
- [value] constructor Decimal; e:3070
- [value] retorno de crearImporteMonetario; e:3071
- [value] sustitución de argumento exacto; e:3073
- [value] a matches (a) => a.greaterThan(b); e:3074
- [value] sustitución de argumento exacto; e:3075
- [value] constructor Decimal; e:3076
- [value] retorno de crearImporteMonetario; e:3077
- [value] receptor de operación Decimal; e:3078
- [value] sustitución de argumento exacto; e:3079
- [value] constructor Decimal; e:3080
- [value] retorno de crearImporteMonetario; e:3081
- [value] receptor de operación Decimal; e:3082
- [value] sustitución por propiedad del argumento; e:3083
- [value] sustitución de argumento exacto; e:3084
- [value] receptor de operación Decimal; e:3085
- [value] argumento de minus; e:3086
- [value] argumento de mul; e:3087
- [value] argumento de minus; e:3088
- [value] sustitución de argumento exacto; e:3089
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:3090
- [value] retorno de maximo; e:3091
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:3092
- [value] sustitución de argumento exacto; e:3093
- [value] constructor Decimal; e:3094
- [value] retorno de crearImporteMonetario; e:3095
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825)) && else; e:3097
- [value] retorno de reduccionTrabajo2019A2022; e:3098
- [value] receptor de operación Decimal; e:3100
- [value] argumento de minus; e:3102
- [value] sustitución de argumento exacto; e:3103
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:3104
- [value] retorno de maximo; e:3105
- [value] receptor de operación Decimal; e:3106
- [value] argumento de div; e:3107
- [value] argumento de plus; e:3108
- [value] ningún matcher previo (true) && else; e:3109
- [value] retorno de reduccionTrabajo2018; e:3110
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017) && anio matches 2018; e:3111
- [selection] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018) && anio matches (anio) => anio <= 2022; e:3112
- [selection] selecciona Match; e:3113
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:3114
- [value] sustitución de argumento exacto; e:3115
- [value] constructor Decimal; e:3116
- [value] retorno de crearImporteMonetario; e:3117
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115); e:3118
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:3119
- [selection] selecciona Match; e:3120
- [selection] a matches (a) => a.greaterThan(b); e:3121
- [value] sustitución de argumento exacto; e:3122
- [value] constructor Decimal; e:3123
- [value] retorno de crearImporteMonetario; e:3124
- [value] sustitución de argumento exacto; e:3126
- [value] a matches (a) => a.greaterThan(b); e:3127
- [value] sustitución de argumento exacto; e:3128
- [value] constructor Decimal; e:3129
- [value] retorno de crearImporteMonetario; e:3130
- [value] receptor de operación Decimal; e:3131
- [value] sustitución de argumento exacto; e:3132
- [value] constructor Decimal; e:3133
- [value] retorno de crearImporteMonetario; e:3134
- [value] receptor de operación Decimal; e:3135
- [value] sustitución por propiedad del argumento; e:3136
- [value] sustitución de argumento exacto; e:3137
- [value] receptor de operación Decimal; e:3138
- [value] argumento de minus; e:3139
- [value] argumento de mul; e:3140
- [value] argumento de minus; e:3141
- [value] sustitución de argumento exacto; e:3142
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:3143
- [value] retorno de maximo; e:3144
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825); e:3145
- [value] sustitución de argumento exacto; e:3146
- [value] constructor Decimal; e:3147
- [value] retorno de crearImporteMonetario; e:3148
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825)) && else; e:3150
- [value] retorno de reduccionTrabajo2019A2022; e:3151
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018) && anio matches (anio) => anio <= 2022; e:3152
- [selection] selecciona Match; e:3153
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"); e:3154
- [value] sustitución de argumento exacto; e:3155
- [value] constructor Decimal; e:3156
- [value] retorno de crearImporteMonetario; e:3157
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"); e:3158
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"); e:3159
- [selection] selecciona Match; e:3160
- [selection] a matches (a) => a.greaterThan(b); e:3161
- [value] sustitución de argumento exacto; e:3162
- [value] constructor Decimal; e:3163
- [value] retorno de crearImporteMonetario; e:3164
- [value] sustitución de argumento exacto; e:3166
- [value] a matches (a) => a.greaterThan(b); e:3167
- [value] sustitución de argumento exacto; e:3168
- [value] constructor Decimal; e:3169
- [value] retorno de crearImporteMonetario; e:3170
- [value] receptor de operación Decimal; e:3171
- [value] sustitución de argumento exacto; e:3172
- [value] constructor Decimal; e:3173
- [value] retorno de crearImporteMonetario; e:3174
- [value] receptor de operación Decimal; e:3175
- [value] sustitución por propiedad del argumento; e:3176
- [value] sustitución de argumento exacto; e:3177
- [value] receptor de operación Decimal; e:3178
- [value] argumento de minus; e:3179
- [value] argumento de mul; e:3180
- [value] argumento de minus; e:3181
- [value] sustitución de argumento exacto; e:3182
- [value] ningún matcher previo ((a) => a.greaterThan(b)) && else; e:3183
- [value] retorno de maximo; e:3184
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"); e:3185
- [value] sustitución de argumento exacto; e:3186
- [value] constructor Decimal; e:3187
- [value] retorno de crearImporteMonetario; e:3188
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50") | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50")) && else; e:3190
- [value] retorno de reduccionTrabajo2023; e:3191
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018 | (anio) => anio <= 2022) && anio matches 2023; e:3192
- [selection] selecciona Match; e:3193
- [selection] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852); e:3194
- [value] sustitución de argumento exacto; e:3195
- [value] constructor Decimal; e:3196
- [value] retorno de crearImporteMonetario; e:3197
- [value] rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852); e:3198
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"); e:3199
- [value] sustitución de argumento exacto; e:3200
- [value] constructor Decimal; e:3201
- [value] retorno de crearImporteMonetario; e:3202
- [value] receptor de operación Decimal; e:3203
- [value] sustitución de argumento exacto; e:3204
- [value] constructor Decimal; e:3205
- [value] retorno de crearImporteMonetario; e:3206
- [value] receptor de operación Decimal; e:3207
- [value] sustitución por propiedad del argumento; e:3208
- [value] sustitución de argumento exacto; e:3209
- [value] receptor de operación Decimal; e:3210
- [value] argumento de minus; e:3211
- [value] argumento de mul; e:3212
- [value] argumento de minus; e:3213
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852)) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"); e:3214
- [selection] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"); e:3215
- [value] sustitución de argumento exacto; e:3216
- [value] constructor Decimal; e:3217
- [value] retorno de crearImporteMonetario; e:3218
- [value] receptor de operación Decimal; e:3219
- [value] sustitución de argumento exacto; e:3220
- [value] constructor Decimal; e:3221
- [value] retorno de crearImporteMonetario; e:3222
- [value] receptor de operación Decimal; e:3223
- [value] sustitución de argumento exacto; e:3224
- [value] receptor de operación Decimal; e:3225
- [value] argumento de minus; e:3226
- [value] argumento de mul; e:3227
- [value] argumento de minus; e:3228
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52")) && rendimientoPrevioNeto matches (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50"); e:3229
- [value] sustitución de argumento exacto; e:3230
- [value] constructor Decimal; e:3231
- [value] retorno de crearImporteMonetario; e:3232
- [value] ningún matcher previo ((rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852) | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52") | (rendimientoPrevioNeto) => rendimientoPrevioNeto.lt("19747.50")) && else; e:3234
- [value] retorno de reduccionTrabajoDesde2024; e:3235
- [value] ningún matcher previo (() => otrasRentasNoExentas.gt(6500) | (anio) => anio <= 2014 | (anio) => anio <= 2017 | 2018 | (anio) => anio <= 2022 | 2023) && else; e:3236
- [value] retorno de calcularReduccionTrabajoConOtrasRentas; e:3237
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3238
- [value] sustitución por propiedad del argumento; e:3241
- [value] ??; e:3243
- [value] argumento de minus; e:3244
- [value] argumento de max; e:3245
- [value] receptor de operación Decimal; e:3246
- [value] argumento conservado sin afirmar cierre; e:3247
- [value] argumento conservado sin afirmar cierre; e:3248
- [value] sustitución de argumento exacto; e:3249
- [value] argumento conservado sin afirmar cierre; e:3250
- [value] argumento conservado sin afirmar cierre; e:3251
- [value] argumento conservado sin afirmar cierre; e:3252
- [value] argumento conservado sin afirmar cierre; e:3253
- [value] retorno de sumarRendimientosCapitalInmobiliario; e:3254
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3255
- [value] sustitución por propiedad del argumento; e:3258
- [value] retorno de calcularRendimientoNetoCapitalInmobiliarioSimplificado; e:3261
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3262
- [value] sustitución por propiedad del argumento; e:3265
- [value] ??; e:3268
- [value] argumento de plus; e:3269
- [value] receptor de operación Decimal; e:3270
- [value] argumento conservado sin afirmar cierre; e:3271
- [value] argumento conservado sin afirmar cierre; e:3272
- [value] sustitución por propiedad del argumento; e:3274
- [value] argumento conservado sin afirmar cierre; e:3275
- [value] argumento conservado sin afirmar cierre; e:3276
- [value] argumento conservado sin afirmar cierre; e:3277
- [value] argumento conservado sin afirmar cierre; e:3278
- [value] argumento conservado sin afirmar cierre; e:3279
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:3280
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3281
- [value] sustitución por propiedad del argumento; e:3285
- [value] ??; e:3287
- [value] argumento de plus; e:3288
- [value] retorno de calcularBaseImponibleGeneral; e:3289
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3290
- [value] sustitución por propiedad del argumento; e:3294
- [value] receptor de operación Decimal; e:3295
- [value] argumento de mul; e:3296
- [value] argumento conservado sin afirmar cierre; e:3297
- [value] argumento conservado sin afirmar cierre; e:3298
- [value] retorno de calcularCuotaPorEscala; e:3299
- [value] usaEscalaAutonomicaReal; e:3300
- [selection] sustitución por propiedad del argumento; e:3301
- [selection] !==; e:3303
- [selection] selecciona rama; e:3304
- [selection] sustitución por propiedad del argumento; e:3307
- [selection] sustitución por propiedad del argumento; e:3309
- [selection] selecciona Match; e:3310
- [selection] sustitución de argumento exacto; e:3311
- [selection] receptor de operación Decimal; e:3312
- [selection] argumento de lte; e:3313
- [selection] base matches (base) => base.lte(0); e:3314
- [value] base matches (base) => base.lte(0); e:3315
- [selection] binding único desde servicio anual; e:3316
- [selection] sustitución por propiedad del argumento; e:3319
- [selection] sustitución de argumento exacto; e:3320
- [selection] selecciona Match; e:3321
- [selection] sustitución de argumento exacto; e:3322
- [selection] <=; e:3324
- [selection] anio matches (anio) => anio <= 2014; e:3325
- [value] anio matches (anio) => anio <= 2014; e:3327
- [value] ningún matcher previo ((anio) => anio <= 2014) && anio matches 2015; e:3329
- [selection] sustitución de argumento exacto; e:3330
- [selection] <=; e:3332
- [selection] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:3333
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:3335
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015 | (anio) => anio <= 2020) && else; e:3337
- [value] retorno de obtenerTramosIrpfLegacy; e:3338
- [value] sustitución por propiedad del argumento; e:3340
- [value] argumento conservado sin afirmar cierre; e:3341
- [value] argumento conservado sin afirmar cierre; e:3342
- [value] argumento conservado sin afirmar cierre; e:3343
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:3345
- [value] !(escalasPublicadas !== undefined); e:3346
- [value] retorno de calcularDesgloseCuotaPorEscala; e:3347
- [value] argumento conservado sin afirmar cierre; e:3348
- [value] sustitución por propiedad del argumento; e:3351
- [value] receptor de operación Decimal; e:3352
- [value] argumento de mul; e:3353
- [value] argumento conservado sin afirmar cierre; e:3354
- [value] argumento conservado sin afirmar cierre; e:3355
- [value] retorno de calcularCuotaPorEscalaGeneral; e:3356
- [value] !(usaEscalaAutonomicaReal); e:3357
- [value] receptor de operación Decimal; e:3359
- [selection] selecciona rama; e:3361
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
- [selection] selecciona rama; e:3498
- [selection] selecciona rama; e:3499
- [value] escalaPublicadaAutonomica === undefined; e:3500
- [value] !(escalaPublicadaAutonomica === undefined); e:3501
- [value] sustitución por propiedad del argumento; e:3504
- [value] sustitución por propiedad del argumento; e:3506
- [value] argumento conservado sin afirmar cierre; e:3507
- [value] argumento conservado sin afirmar cierre; e:3508
- [value] escalasPublicadas !== undefined; e:3509
- [selection] sustitución por propiedad del argumento; e:3512
- [selection] sustitución por propiedad del argumento; e:3514
- [selection] selecciona Match; e:3515
- [selection] sustitución de argumento exacto; e:3516
- [selection] receptor de operación Decimal; e:3517
- [selection] argumento de lte; e:3518
- [selection] base matches (base) => base.lte(0); e:3519
- [value] base matches (base) => base.lte(0); e:3520
- [value] argumento conservado sin afirmar cierre; e:3521
- [value] argumento conservado sin afirmar cierre; e:3522
- [value] sustitución por propiedad del argumento; e:3528
- [value] sustitución por propiedad del argumento; e:3530
- [value] argumento conservado sin afirmar cierre; e:3531
- [value] argumento conservado sin afirmar cierre; e:3532
- [value] argumento conservado sin afirmar cierre; e:3533
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:3535
- [value] !(escalasPublicadas !== undefined); e:3536
- [value] retorno de calcularDesgloseCuotaPorEscala; e:3537
- [value] argumento conservado sin afirmar cierre; e:3538
- [value] sustitución por propiedad del argumento; e:3541
- [value] receptor de operación Decimal; e:3542
- [value] argumento de mul; e:3543
- [value] argumento conservado sin afirmar cierre; e:3544
- [value] argumento conservado sin afirmar cierre; e:3545
- [value] retorno de calcularCuotaPorEscala; e:3546
- [value] usaEscalaAutonomicaReal; e:3547
- [value] receptor de operación Decimal; e:3549
- [value] argumento de mul; e:3550
- [value] !(usaEscalaAutonomicaReal); e:3551
- [value] argumento de plus; e:3553
- [value] receptor de operación Decimal; e:3555
- [selection] selecciona rama; e:3557
- [selection] sustitución por propiedad del argumento; e:3560
- [selection] sustitución por propiedad del argumento; e:3562
- [selection] !==; e:3564
- [selection] selecciona rama; e:3565
- [value] sustitución por propiedad del argumento; e:3568
- [value] sustitución por propiedad del argumento; e:3570
- [value] argumento conservado sin afirmar cierre; e:3571
- [value] argumento conservado sin afirmar cierre; e:3572
- [value] escalasPublicadas !== undefined; e:3573
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
- [selection] selecciona Match; e:3790
- [selection] sustitución de argumento exacto; e:3791
- [selection] receptor de operación Decimal; e:3792
- [selection] argumento de lte; e:3793
- [selection] base matches (base) => base.lte(0); e:3794
- [value] base matches (base) => base.lte(0); e:3795
- [value] sustitución por propiedad del argumento; e:3798
- [value] sustitución por propiedad del argumento; e:3800
- [value] argumento conservado sin afirmar cierre; e:3801
- [value] argumento conservado sin afirmar cierre; e:3802
- [value] argumento conservado sin afirmar cierre; e:3803
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:3805
- [value] !(escalasPublicadas !== undefined); e:3806
- [value] retorno de calcularDesgloseCuotaPorEscala; e:3807
- [value] argumento conservado sin afirmar cierre; e:3808
- [selection] selecciona rama; e:3809
- [value] caso.derechosMinimos === undefined; e:3810
- [value] argumento conservado sin afirmar cierre; e:3811
- [value] argumento conservado sin afirmar cierre; e:3812
- [value] !(caso.derechosMinimos === undefined); e:3814
- [selection] selecciona Match; e:3818
- [value] caso.anio matches 2012; e:3820
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:3822
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:3824
- [value] binding único desde servicio anual; e:3825
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:3828
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3829
- [value] sustitución por propiedad del argumento; e:3832
- [value] receptor de operación Decimal; e:3836
- [selection] selecciona Match; e:3837
- [selection] edad matches (edad) => edad >= 65; e:3838
- [selection] selecciona Match; e:3839
- [value] caso.anio matches 2012; e:3841
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:3843
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:3845
- [value] binding único desde servicio anual; e:3846
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:3849
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3850
- [value] sustitución por propiedad del argumento; e:3853
- [value] edad matches (edad) => edad >= 65; e:3856
- [value] sustitución de argumento exacto; e:3857
- [value] constructor Decimal; e:3858
- [value] retorno de crearImporteMonetario; e:3859
- [value] ningún matcher previo ((edad) => edad >= 65) && else; e:3861
- [value] argumento de plus; e:3863
- [value] receptor de operación Decimal; e:3864
- [selection] selecciona Match; e:3865
- [selection] edad matches (edad) => edad >= 75; e:3866
- [selection] selecciona Match; e:3867
- [value] caso.anio matches 2012; e:3869
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:3871
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:3873
- [value] binding único desde servicio anual; e:3874
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:3877
- [value] si calcular devuelve; instrumentación no transforma el valor; e:3878
- [value] sustitución por propiedad del argumento; e:3881
- [value] edad matches (edad) => edad >= 75; e:3884
- [value] sustitución de argumento exacto; e:3885
- [value] constructor Decimal; e:3886
- [value] retorno de crearImporteMonetario; e:3887
- [value] ningún matcher previo ((edad) => edad >= 75) && else; e:3889
- [value] argumento de plus; e:3891
- [value] retorno de obtenerMinimoContribuyente; e:3892
- [value] ??; e:3893
- [value] receptor de operación Decimal; e:3895
- [selection] selecciona rama; e:3896
- [value] caso.derechosMinimos === undefined; e:3897
- [value] argumento conservado sin afirmar cierre; e:3898
- [value] !(caso.derechosMinimos === undefined); e:3900
- [value] argumento conservado sin afirmar cierre; e:3904
- [value] argumento conservado sin afirmar cierre; e:3905
- [value] sustitución de argumento exacto; e:3906
- [value] constructor Decimal; e:3907
- [value] retorno de crearImporteMonetario; e:3908
- [value] argumento conservado sin afirmar cierre; e:3910
- [value] argumento conservado sin afirmar cierre; e:3911
- [value] retorno de obtenerMinimoDescendientes; e:3912
- [value] ??; e:3913
- [value] argumento de plus; e:3915
- [value] receptor de operación Decimal; e:3916
- [selection] selecciona rama; e:3917
- [value] caso.derechosMinimos === undefined; e:3918
- [value] argumento conservado sin afirmar cierre; e:3919
- [value] !(caso.derechosMinimos === undefined); e:3921
- [value] binding único desde servicio anual; e:3925
- [value] sustitución de argumento exacto; e:3928
- [value] argumento conservado sin afirmar cierre; e:3929
- [value] sustitución de argumento exacto; e:3930
- [value] constructor Decimal; e:3931
- [value] retorno de crearImporteMonetario; e:3932
- [value] argumento conservado sin afirmar cierre; e:3934
- [value] argumento conservado sin afirmar cierre; e:3935
- [value] retorno de obtenerMinimoAscendientes; e:3936
- [value] ??; e:3937
- [value] argumento de plus; e:3939
- [value] receptor de operación Decimal; e:3940
- [selection] selecciona rama; e:3941
- [value] caso.derechosMinimos === undefined; e:3942
- [value] argumento conservado sin afirmar cierre; e:3943
- [value] !(caso.derechosMinimos === undefined); e:3945
- [value] binding único desde servicio anual; e:3949
- [value] sustitución de argumento exacto; e:3951
- [value] sustitución de argumento exacto; e:3953
- [value] argumento conservado sin afirmar cierre; e:3954
- [value] argumento conservado sin afirmar cierre; e:3955
- [value] retorno de obtenerMinimoPorDiscapacidad; e:3956
- [value] retorno de obtenerMinimoDiscapacidadContribuyente; e:3957
- [value] ??; e:3958
- [value] argumento de plus; e:3960
- [value] receptor de operación Decimal; e:3961
- [selection] selecciona rama; e:3962
- [value] caso.derechosMinimos === undefined; e:3963
- [value] argumento conservado sin afirmar cierre; e:3964
- [value] !(caso.derechosMinimos === undefined); e:3966
- [value] binding único desde servicio anual; e:3970
- [value] sustitución de argumento exacto; e:3973
- [value] argumento conservado sin afirmar cierre; e:3974
- [value] sustitución de argumento exacto; e:3975
- [value] constructor Decimal; e:3976
- [value] retorno de crearImporteMonetario; e:3977
- [value] argumento conservado sin afirmar cierre; e:3979
- [value] argumento conservado sin afirmar cierre; e:3980
- [value] retorno de obtenerMinimoDiscapacidadFamiliares; e:3981
- [value] receptor de operación Decimal; e:3982
- [value] binding único desde servicio anual; e:3983
- [value] sustitución de argumento exacto; e:3986
- [value] argumento conservado sin afirmar cierre; e:3987
- [value] sustitución de argumento exacto; e:3988
- [value] constructor Decimal; e:3989
- [value] retorno de crearImporteMonetario; e:3990
- [value] argumento conservado sin afirmar cierre; e:3992
- [value] argumento conservado sin afirmar cierre; e:3993
- [value] retorno de obtenerMinimoDiscapacidadAscendientes; e:3994
- [value] argumento de plus; e:3995
- [value] ??; e:3996
- [value] argumento de plus; e:3998
- [value] argumento de min; e:4000
- [value] argumento de min; e:4002
- [value] sustitución por propiedad del argumento; e:4004
- [value] receptor de operación Decimal; e:4005
- [value] argumento de mul; e:4006
- [value] argumento conservado sin afirmar cierre; e:4007
- [value] argumento conservado sin afirmar cierre; e:4008
- [value] retorno de calcularCuotaPorEscala; e:4009
- [value] usaEscalaAutonomicaReal; e:4010
- [selection] sustitución por propiedad del argumento; e:4011
- [selection] !==; e:4013
- [selection] selecciona rama; e:4014
- [selection] argumento de min; e:4016
- [selection] argumento de min; e:4018
- [selection] sustitución por propiedad del argumento; e:4020
- [selection] sustitución por propiedad del argumento; e:4022
- [selection] selecciona Match; e:4023
- [selection] sustitución de argumento exacto; e:4024
- [selection] receptor de operación Decimal; e:4025
- [selection] argumento de lte; e:4026
- [selection] base matches (base) => base.lte(0); e:4027
- [value] base matches (base) => base.lte(0); e:4028
- [selection] binding único desde servicio anual; e:4029
- [selection] sustitución por propiedad del argumento; e:4032
- [selection] sustitución de argumento exacto; e:4033
- [selection] selecciona Match; e:4034
- [selection] sustitución de argumento exacto; e:4035
- [selection] <=; e:4037
- [selection] anio matches (anio) => anio <= 2014; e:4038
- [value] anio matches (anio) => anio <= 2014; e:4040
- [value] ningún matcher previo ((anio) => anio <= 2014) && anio matches 2015; e:4042
- [selection] sustitución de argumento exacto; e:4043
- [selection] <=; e:4045
- [selection] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:4046
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015) && anio matches (anio) => anio <= 2020; e:4048
- [value] ningún matcher previo ((anio) => anio <= 2014 | 2015 | (anio) => anio <= 2020) && else; e:4050
- [value] retorno de obtenerTramosIrpfLegacy; e:4051
- [value] sustitución por propiedad del argumento; e:4053
- [value] argumento conservado sin afirmar cierre; e:4054
- [value] argumento conservado sin afirmar cierre; e:4055
- [value] argumento conservado sin afirmar cierre; e:4056
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4058
- [value] !(escalasPublicadas !== undefined); e:4059
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4060
- [value] argumento conservado sin afirmar cierre; e:4061
- [value] argumento de min; e:4063
- [value] argumento de min; e:4065
- [value] sustitución por propiedad del argumento; e:4067
- [value] receptor de operación Decimal; e:4068
- [value] argumento de mul; e:4069
- [value] argumento conservado sin afirmar cierre; e:4070
- [value] argumento conservado sin afirmar cierre; e:4071
- [value] retorno de calcularCuotaPorEscalaGeneral; e:4072
- [value] !(usaEscalaAutonomicaReal); e:4073
- [value] receptor de operación Decimal; e:4075
- [selection] selecciona rama; e:4077
- [selection] sustitución por propiedad del argumento; e:4080
- [selection] sustitución por propiedad del argumento; e:4082
- [selection] !==; e:4084
- [selection] selecciona rama; e:4085
- [value] sustitución por propiedad del argumento; e:4088
- [value] sustitución por propiedad del argumento; e:4090
- [value] argumento conservado sin afirmar cierre; e:4091
- [value] argumento conservado sin afirmar cierre; e:4092
- [value] escalasPublicadas !== undefined; e:4093
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
- [selection] selecciona Match; e:4262
- [selection] sustitución de argumento exacto; e:4263
- [selection] receptor de operación Decimal; e:4264
- [selection] argumento de lte; e:4265
- [selection] base matches (base) => base.lte(0); e:4266
- [value] base matches (base) => base.lte(0); e:4267
- [value] sustitución por propiedad del argumento; e:4272
- [value] sustitución por propiedad del argumento; e:4274
- [value] argumento conservado sin afirmar cierre; e:4275
- [value] argumento conservado sin afirmar cierre; e:4276
- [value] argumento conservado sin afirmar cierre; e:4277
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4279
- [value] !(escalasPublicadas !== undefined); e:4280
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4281
- [value] argumento conservado sin afirmar cierre; e:4282
- [selection] selecciona rama; e:4283
- [value] caso.derechosMinimos === undefined; e:4284
- [value] argumento conservado sin afirmar cierre; e:4285
- [value] argumento conservado sin afirmar cierre; e:4286
- [value] !(caso.derechosMinimos === undefined); e:4288
- [value] argumento conservado sin afirmar cierre; e:4292
- [value] argumento conservado sin afirmar cierre; e:4293
- [value] sustitución por propiedad del argumento; e:4298
- [value] sustitución por propiedad del argumento; e:4300
- [value] receptor de operación Decimal; e:4304
- [selection] selecciona Match; e:4305
- [selection] edad matches (edad) => edad >= 65; e:4306
- [value] argumento conservado sin afirmar cierre; e:4307
- [value] argumento conservado sin afirmar cierre; e:4308
- [value] sustitución por propiedad del argumento; e:4313
- [value] sustitución por propiedad del argumento; e:4315
- [value] edad matches (edad) => edad >= 65; e:4318
- [value] sustitución de argumento exacto; e:4319
- [value] constructor Decimal; e:4320
- [value] retorno de crearImporteMonetario; e:4321
- [value] ningún matcher previo ((edad) => edad >= 65) && else; e:4323
- [value] argumento de plus; e:4325
- [value] receptor de operación Decimal; e:4326
- [selection] selecciona Match; e:4327
- [selection] edad matches (edad) => edad >= 75; e:4328
- [value] argumento conservado sin afirmar cierre; e:4329
- [value] argumento conservado sin afirmar cierre; e:4330
- [value] sustitución por propiedad del argumento; e:4335
- [value] sustitución por propiedad del argumento; e:4337
- [value] edad matches (edad) => edad >= 75; e:4340
- [value] sustitución de argumento exacto; e:4341
- [value] constructor Decimal; e:4342
- [value] retorno de crearImporteMonetario; e:4343
- [value] ningún matcher previo ((edad) => edad >= 75) && else; e:4345
- [value] argumento de plus; e:4347
- [value] retorno de obtenerMinimoContribuyente; e:4348
- [value] receptor de operación Decimal; e:4350
- [value] argumento conservado sin afirmar cierre; e:4351
- [value] argumento conservado sin afirmar cierre; e:4352
- [value] sustitución de argumento exacto; e:4353
- [value] constructor Decimal; e:4354
- [value] retorno de crearImporteMonetario; e:4355
- [value] argumento conservado sin afirmar cierre; e:4357
- [value] argumento conservado sin afirmar cierre; e:4358
- [value] retorno de obtenerMinimoDescendientes; e:4359
- [value] argumento de plus; e:4361
- [value] receptor de operación Decimal; e:4362
- [value] binding único desde servicio anual; e:4363
- [value] sustitución por propiedad del argumento; e:4366
- [value] sustitución de argumento exacto; e:4368
- [value] argumento conservado sin afirmar cierre; e:4369
- [value] sustitución de argumento exacto; e:4370
- [value] constructor Decimal; e:4371
- [value] retorno de crearImporteMonetario; e:4372
- [value] argumento conservado sin afirmar cierre; e:4374
- [value] argumento conservado sin afirmar cierre; e:4375
- [value] retorno de obtenerMinimoAscendientes; e:4376
- [value] argumento de plus; e:4378
- [value] receptor de operación Decimal; e:4379
- [value] binding único desde servicio anual; e:4380
- [value] sustitución por propiedad del argumento; e:4383
- [value] sustitución de argumento exacto; e:4384
- [value] sustitución de argumento exacto; e:4386
- [value] argumento conservado sin afirmar cierre; e:4387
- [value] argumento conservado sin afirmar cierre; e:4388
- [value] retorno de obtenerMinimoPorDiscapacidad; e:4389
- [value] retorno de obtenerMinimoDiscapacidadContribuyente; e:4390
- [value] argumento de plus; e:4392
- [value] receptor de operación Decimal; e:4393
- [value] binding único desde servicio anual; e:4394
- [value] sustitución por propiedad del argumento; e:4397
- [value] sustitución de argumento exacto; e:4399
- [value] argumento conservado sin afirmar cierre; e:4400
- [value] sustitución de argumento exacto; e:4401
- [value] constructor Decimal; e:4402
- [value] retorno de crearImporteMonetario; e:4403
- [value] argumento conservado sin afirmar cierre; e:4405
- [value] argumento conservado sin afirmar cierre; e:4406
- [value] retorno de obtenerMinimoDiscapacidadFamiliares; e:4407
- [value] receptor de operación Decimal; e:4408
- [value] sustitución por propiedad del argumento; e:4409
- [value] sustitución de argumento exacto; e:4411
- [value] argumento conservado sin afirmar cierre; e:4412
- [value] sustitución de argumento exacto; e:4413
- [value] constructor Decimal; e:4414
- [value] retorno de crearImporteMonetario; e:4415
- [value] argumento conservado sin afirmar cierre; e:4417
- [value] argumento conservado sin afirmar cierre; e:4418
- [value] retorno de obtenerMinimoDiscapacidadAscendientes; e:4419
- [value] argumento de plus; e:4420
- [value] argumento de plus; e:4422
- [value] retorno de calcularMinimoPersonalYFamiliar; e:4423
- [value] ??; e:4424
- [value] argumento de min; e:4426
- [value] argumento de min; e:4428
- [value] sustitución por propiedad del argumento; e:4430
- [value] receptor de operación Decimal; e:4431
- [value] argumento de mul; e:4432
- [value] argumento conservado sin afirmar cierre; e:4433
- [value] argumento conservado sin afirmar cierre; e:4434
- [value] retorno de calcularCuotaPorEscala; e:4435
- [value] usaEscalaAutonomicaReal; e:4436
- [value] receptor de operación Decimal; e:4438
- [value] argumento de mul; e:4439
- [value] !(usaEscalaAutonomicaReal); e:4440
- [value] argumento de plus; e:4442
- [value] argumento de minus; e:4444
- [value] argumento de max; e:4445
- [value] receptor de operación Decimal; e:4447
- [value] argumento de max; e:4448
- [selection] selecciona rama; e:4449
- [selection] selecciona Match; e:4450
- [selection] base matches (base) => base.lte(0); e:4451
- [value] base matches (base) => base.lte(0); e:4452
- [selection] selecciona Match; e:4453
- [value] anio matches 2012; e:4456
- [value] ningún matcher previo (2012) && anio matches 2013; e:4459
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:4461
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:4463
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:4466
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:4469
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:4472
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:4475
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:4477
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:4480
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:4482
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:4485
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:4487
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && else; e:4489
- [value] retorno de obtenerTramosIrpfAhorro; e:4490
- [value] sustitución por propiedad del argumento; e:4492
- [value] sustitución por propiedad del argumento; e:4494
- [value] argumento conservado sin afirmar cierre; e:4495
- [value] argumento conservado sin afirmar cierre; e:4496
- [value] argumento conservado sin afirmar cierre; e:4497
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4499
- [value] !(escalasPublicadas !== undefined); e:4500
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4501
- [value] argumento conservado sin afirmar cierre; e:4502
- [value] argumento de max; e:4503
- [value] argumento conservado sin afirmar cierre; e:4504
- [value] argumento conservado sin afirmar cierre; e:4505
- [value] argumento conservado sin afirmar cierre; e:4506
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:4507
- [value] si calcular devuelve; instrumentación no transforma el valor; e:4508
- [value] sustitución por propiedad del argumento; e:4511
- [value] argumento de max; e:4513
- [value] retorno de calcularBaseImponibleAhorro; e:4514
- [value] si calcular devuelve; instrumentación no transforma el valor; e:4515
- [value] sustitución por propiedad del argumento; e:4518
- [value] sustitución por propiedad del argumento; e:4520
- [value] receptor de operación Decimal; e:4521
- [value] argumento de mul; e:4522
- [value] argumento conservado sin afirmar cierre; e:4523
- [value] argumento conservado sin afirmar cierre; e:4524
- [value] retorno de calcularCuotaPorEscala; e:4525
- [value] retorno de calcularCuotaPorEscalaAhorro; e:4526
- [value] receptor de operación Decimal; e:4528
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
- [selection] selecciona rama; e:4575
- [selection] selecciona rama; e:4577
- [value] componente === "estatal"; e:4578
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4579
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4581
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4583
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4585
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4587
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4588
- [value] sustitución por propiedad del argumento; e:4590
- [value] sustitución por propiedad del argumento; e:4592
- [value] argumento conservado sin afirmar cierre; e:4593
- [value] argumento conservado sin afirmar cierre; e:4594
- [value] escalasPublicadas !== undefined; e:4595
- [selection] sustitución por propiedad del argumento; e:4598
- [selection] sustitución por propiedad del argumento; e:4600
- [selection] sustitución por propiedad del argumento; e:4602
- [selection] sustitución por propiedad del argumento; e:4604
- [selection] selecciona Match; e:4605
- [selection] sustitución de argumento exacto; e:4606
- [selection] receptor de operación Decimal; e:4607
- [selection] argumento de lte; e:4608
- [selection] base matches (base) => base.lte(0); e:4609
- [value] base matches (base) => base.lte(0); e:4610
- [value] sustitución por propiedad del argumento; e:4612
- [value] sustitución por propiedad del argumento; e:4614
- [value] argumento conservado sin afirmar cierre; e:4615
- [value] argumento conservado sin afirmar cierre; e:4616
- [value] argumento conservado sin afirmar cierre; e:4617
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4619
- [value] !(escalasPublicadas !== undefined); e:4620
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4621
- [value] argumento conservado sin afirmar cierre; e:4622
- [value] sustitución por propiedad del argumento; e:4625
- [value] sustitución por propiedad del argumento; e:4627
- [value] sustitución por propiedad del argumento; e:4629
- [value] receptor de operación Decimal; e:4630
- [value] argumento de mul; e:4631
- [value] argumento conservado sin afirmar cierre; e:4632
- [value] argumento conservado sin afirmar cierre; e:4633
- [value] retorno de calcularCuotaPorEscala; e:4634
- [value] retorno de calcularCuotaComponenteAhorro; e:4635
- [value] receptor de operación Decimal; e:4637
- [selection] sustitución por propiedad del argumento; e:4638
- [selection] <=; e:4640
- [selection] selecciona rama; e:4641
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
- [selection] selecciona rama; e:4685
- [selection] selecciona rama; e:4687
- [value] componente === "estatal"; e:4688
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4689
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4691
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4693
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4695
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4697
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4698
- [value] sustitución por propiedad del argumento; e:4700
- [value] sustitución por propiedad del argumento; e:4702
- [value] argumento conservado sin afirmar cierre; e:4703
- [value] argumento conservado sin afirmar cierre; e:4704
- [value] escalasPublicadas !== undefined; e:4705
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
- [selection] selecciona Match; e:4736
- [selection] sustitución de argumento exacto; e:4737
- [selection] receptor de operación Decimal; e:4738
- [selection] argumento de lte; e:4739
- [selection] base matches (base) => base.lte(0); e:4740
- [value] base matches (base) => base.lte(0); e:4741
- [value] sustitución por propiedad del argumento; e:4743
- [value] sustitución por propiedad del argumento; e:4745
- [value] argumento conservado sin afirmar cierre; e:4746
- [value] argumento conservado sin afirmar cierre; e:4747
- [value] argumento conservado sin afirmar cierre; e:4748
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4750
- [value] !(escalasPublicadas !== undefined); e:4751
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4752
- [value] argumento conservado sin afirmar cierre; e:4753
- [value] argumento de max; e:4754
- [value] sustitución por propiedad del argumento; e:4755
- [value] receptor de operación Decimal; e:4756
- [value] argumento de max; e:4757
- [value] sustitución por propiedad del argumento; e:4760
- [value] sustitución de argumento exacto; e:4761
- [value] receptor de operación Decimal; e:4762
- [value] argumento de max; e:4763
- [value] sustitución por propiedad del argumento; e:4766
- [value] argumento de max; e:4767
- [value] argumento de minus; e:4768
- [value] argumento de max; e:4769
- [value] argumento de min; e:4770
- [value] argumento de max; e:4771
- [value] sustitución por propiedad del argumento; e:4772
- [value] argumento de max; e:4773
- [value] argumento de min; e:4774
- [value] argumento de minus; e:4776
- [value] argumento de max; e:4777
- [value] sustitución por propiedad del argumento; e:4779
- [value] sustitución por propiedad del argumento; e:4781
- [value] receptor de operación Decimal; e:4782
- [value] argumento de mul; e:4783
- [value] argumento conservado sin afirmar cierre; e:4784
- [value] argumento conservado sin afirmar cierre; e:4785
- [value] retorno de calcularCuotaPorEscala; e:4786
- [value] retorno de calcularCuotaComponenteAhorro; e:4787
- [value] anio <= 2014; e:4788
- [value] argumento de max; e:4789
- [value] receptor de operación Decimal; e:4791
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
- [selection] selecciona rama; e:4835
- [selection] selecciona rama; e:4837
- [value] componente === "estatal"; e:4838
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4839
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4841
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4843
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4845
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4847
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4848
- [value] sustitución por propiedad del argumento; e:4850
- [value] sustitución por propiedad del argumento; e:4852
- [value] argumento conservado sin afirmar cierre; e:4853
- [value] argumento conservado sin afirmar cierre; e:4854
- [value] escalasPublicadas !== undefined; e:4855
- [selection] sustitución por propiedad del argumento; e:4858
- [selection] sustitución por propiedad del argumento; e:4860
- [selection] sustitución por propiedad del argumento; e:4862
- [selection] selecciona Match; e:4863
- [selection] sustitución de argumento exacto; e:4864
- [selection] receptor de operación Decimal; e:4865
- [selection] argumento de lte; e:4866
- [selection] base matches (base) => base.lte(0); e:4867
- [value] base matches (base) => base.lte(0); e:4868
- [value] sustitución por propiedad del argumento; e:4870
- [value] sustitución por propiedad del argumento; e:4872
- [value] argumento conservado sin afirmar cierre; e:4873
- [value] argumento conservado sin afirmar cierre; e:4874
- [value] argumento conservado sin afirmar cierre; e:4875
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4877
- [value] !(escalasPublicadas !== undefined); e:4878
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4879
- [value] argumento conservado sin afirmar cierre; e:4880
- [value] sustitución por propiedad del argumento; e:4883
- [value] sustitución por propiedad del argumento; e:4885
- [value] receptor de operación Decimal; e:4886
- [value] argumento de mul; e:4887
- [value] argumento conservado sin afirmar cierre; e:4888
- [value] argumento conservado sin afirmar cierre; e:4889
- [value] retorno de calcularCuotaPorEscala; e:4890
- [value] retorno de calcularCuotaComponenteAhorro; e:4891
- [value] argumento de minus; e:4892
- [value] argumento de max; e:4893
- [value] !(anio <= 2014); e:4894
- [value] argumento de minus; e:4896
- [value] retorno de componente; e:4898
- [value] retorno de calcularAhorroConMinimos; e:4900
- [value] receptor de operación Decimal; e:4904
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
- [selection] selecciona rama; e:4948
- [selection] selecciona rama; e:4950
- [value] !(componente === "estatal"); e:4951
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4952
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4954
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4956
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4958
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4960
- [value] retorno de obtenerEscalasAhorroPublicadas; e:4961
- [value] sustitución por propiedad del argumento; e:4963
- [value] sustitución por propiedad del argumento; e:4965
- [value] argumento conservado sin afirmar cierre; e:4966
- [value] argumento conservado sin afirmar cierre; e:4967
- [value] escalasPublicadas !== undefined; e:4968
- [selection] sustitución por propiedad del argumento; e:4969
- [selection] sustitución por propiedad del argumento; e:4971
- [selection] sustitución por propiedad del argumento; e:4973
- [selection] sustitución por propiedad del argumento; e:4975
- [selection] selecciona Match; e:4976
- [selection] sustitución de argumento exacto; e:4977
- [selection] receptor de operación Decimal; e:4978
- [selection] argumento de lte; e:4979
- [selection] base matches (base) => base.lte(0); e:4980
- [value] base matches (base) => base.lte(0); e:4981
- [value] sustitución por propiedad del argumento; e:4983
- [value] sustitución por propiedad del argumento; e:4985
- [value] argumento conservado sin afirmar cierre; e:4986
- [value] argumento conservado sin afirmar cierre; e:4987
- [value] argumento conservado sin afirmar cierre; e:4988
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:4990
- [value] !(escalasPublicadas !== undefined); e:4991
- [value] retorno de calcularDesgloseCuotaPorEscala; e:4992
- [value] argumento conservado sin afirmar cierre; e:4993
- [value] sustitución por propiedad del argumento; e:4994
- [value] sustitución por propiedad del argumento; e:4996
- [value] sustitución por propiedad del argumento; e:4998
- [value] receptor de operación Decimal; e:4999
- [value] argumento de mul; e:5000
- [value] argumento conservado sin afirmar cierre; e:5001
- [value] argumento conservado sin afirmar cierre; e:5002
- [value] retorno de calcularCuotaPorEscala; e:5003
- [value] retorno de calcularCuotaComponenteAhorro; e:5004
- [value] receptor de operación Decimal; e:5006
- [selection] sustitución por propiedad del argumento; e:5007
- [selection] <=; e:5009
- [selection] selecciona rama; e:5010
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
- [selection] selecciona rama; e:5054
- [selection] selecciona rama; e:5056
- [value] !(componente === "estatal"); e:5057
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5058
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5060
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5062
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5064
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5066
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5067
- [value] sustitución por propiedad del argumento; e:5069
- [value] sustitución por propiedad del argumento; e:5071
- [value] argumento conservado sin afirmar cierre; e:5072
- [value] argumento conservado sin afirmar cierre; e:5073
- [value] escalasPublicadas !== undefined; e:5074
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
- [selection] selecciona Match; e:5103
- [selection] sustitución de argumento exacto; e:5104
- [selection] receptor de operación Decimal; e:5105
- [selection] argumento de lte; e:5106
- [selection] base matches (base) => base.lte(0); e:5107
- [value] base matches (base) => base.lte(0); e:5108
- [value] sustitución por propiedad del argumento; e:5110
- [value] sustitución por propiedad del argumento; e:5112
- [value] argumento conservado sin afirmar cierre; e:5113
- [value] argumento conservado sin afirmar cierre; e:5114
- [value] argumento conservado sin afirmar cierre; e:5115
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5117
- [value] !(escalasPublicadas !== undefined); e:5118
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5119
- [value] argumento conservado sin afirmar cierre; e:5120
- [value] argumento de max; e:5121
- [value] sustitución por propiedad del argumento; e:5122
- [value] receptor de operación Decimal; e:5123
- [value] argumento de max; e:5124
- [value] sustitución por propiedad del argumento; e:5127
- [value] sustitución de argumento exacto; e:5128
- [value] receptor de operación Decimal; e:5129
- [value] argumento de max; e:5130
- [value] sustitución por propiedad del argumento; e:5131
- [value] argumento de max; e:5132
- [value] argumento de minus; e:5133
- [value] argumento de max; e:5134
- [value] argumento de min; e:5135
- [value] argumento de max; e:5136
- [value] sustitución por propiedad del argumento; e:5137
- [value] argumento de max; e:5138
- [value] argumento de min; e:5139
- [value] argumento de minus; e:5141
- [value] argumento de max; e:5142
- [value] sustitución por propiedad del argumento; e:5144
- [value] sustitución por propiedad del argumento; e:5146
- [value] receptor de operación Decimal; e:5147
- [value] argumento de mul; e:5148
- [value] argumento conservado sin afirmar cierre; e:5149
- [value] argumento conservado sin afirmar cierre; e:5150
- [value] retorno de calcularCuotaPorEscala; e:5151
- [value] retorno de calcularCuotaComponenteAhorro; e:5152
- [value] anio <= 2014; e:5153
- [value] argumento de max; e:5154
- [value] receptor de operación Decimal; e:5156
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
- [selection] selecciona rama; e:5200
- [selection] selecciona rama; e:5202
- [value] !(componente === "estatal"); e:5203
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5204
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5206
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5208
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5210
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5212
- [value] retorno de obtenerEscalasAhorroPublicadas; e:5213
- [value] sustitución por propiedad del argumento; e:5215
- [value] sustitución por propiedad del argumento; e:5217
- [value] argumento conservado sin afirmar cierre; e:5218
- [value] argumento conservado sin afirmar cierre; e:5219
- [value] escalasPublicadas !== undefined; e:5220
- [selection] sustitución por propiedad del argumento; e:5223
- [selection] sustitución por propiedad del argumento; e:5225
- [selection] sustitución por propiedad del argumento; e:5227
- [selection] selecciona Match; e:5228
- [selection] sustitución de argumento exacto; e:5229
- [selection] receptor de operación Decimal; e:5230
- [selection] argumento de lte; e:5231
- [selection] base matches (base) => base.lte(0); e:5232
- [value] base matches (base) => base.lte(0); e:5233
- [value] sustitución por propiedad del argumento; e:5235
- [value] sustitución por propiedad del argumento; e:5237
- [value] argumento conservado sin afirmar cierre; e:5238
- [value] argumento conservado sin afirmar cierre; e:5239
- [value] argumento conservado sin afirmar cierre; e:5240
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:5242
- [value] !(escalasPublicadas !== undefined); e:5243
- [value] retorno de calcularDesgloseCuotaPorEscala; e:5244
- [value] argumento conservado sin afirmar cierre; e:5245
- [value] sustitución por propiedad del argumento; e:5248
- [value] sustitución por propiedad del argumento; e:5250
- [value] receptor de operación Decimal; e:5251
- [value] argumento de mul; e:5252
- [value] argumento conservado sin afirmar cierre; e:5253
- [value] argumento conservado sin afirmar cierre; e:5254
- [value] retorno de calcularCuotaPorEscala; e:5255
- [value] retorno de calcularCuotaComponenteAhorro; e:5256
- [value] argumento de minus; e:5257
- [value] argumento de max; e:5258
- [value] !(anio <= 2014); e:5259
- [value] argumento de minus; e:5261
- [value] retorno de componente; e:5263
- [value] retorno de calcularAhorroConMinimos; e:5265
- [value] argumento de plus; e:5269
- [value] argumento de minus; e:5271
- [value] argumento de max; e:5272
- [value] argumento de plus; e:5274
- [value] receptor de operación Decimal; e:5275
- [selection] selecciona rama; e:5277
- [value] argumento de min; e:5279
- [value] argumento de max; e:5280
- [value] receptor de operación Decimal; e:5282
- [value] argumento de minus; e:5284
- [value] argumento de max; e:5285
- [value] receptor de operación Decimal; e:5287
- [value] retorno de componente; e:5290
- [value] retorno de calcularAhorroConMinimos; e:5292
- [value] argumento de plus; e:5296
- [value] argumento de min; e:5297
- [value] usaEscalaAutonomicaReal; e:5298
- [value] !(usaEscalaAutonomicaReal); e:5300
- [value] argumento de minus; e:5302
- [value] argumento de max; e:5303
- [value] argumento conservado sin afirmar cierre; e:5305
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5308
- [value] sustitución por propiedad del argumento; e:5312
- [value] binding único desde servicio anual; e:5314
- [value] sustitución por propiedad del argumento; e:5317
- [value] -; e:5318
- [value] binding único desde servicio anual; e:5320
- [selection] binding único desde servicio anual; e:5323
- [selection] !==; e:5326
- [selection] selecciona rama; e:5327
- [value] binding único desde servicio anual; e:5328
- [value] argumento conservado sin afirmar cierre; e:5330
- [value] binding único desde servicio anual; e:5331
- [value] argumento conservado sin afirmar cierre; e:5332
- [value] caso.retencionTrabajoAeat !== undefined; e:5334
- [value] !(caso.retencionTrabajoAeat !== undefined); e:5335
- [value] ??; e:5339
- [value] +; e:5341
- [value] sustitución por propiedad del argumento; e:5344
- [value] -; e:5345
- [value] retorno de calcularCuotaDiferencialCentimos; e:5346
- [value] conversión monetaria explícita; e:5347
- [value] aplicación de la primitiva monetaria del módulo dinero; e:5348

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
