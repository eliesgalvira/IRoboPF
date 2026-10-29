# anual.cuota.minimo-ahorro-total

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: caso.anio <= 2014
                  ? "Suma por componente de F(base) − F(base − remanente)"
                  : "F estatal(remanente estatal) + F autonómica(remanente autonómico)"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- derechosEstatales?.contribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20490
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21708
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1942–1963
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- excesoRestante / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- derechosEstatales / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20681
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- minimos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- rendimientoCapitalInmobiliario?.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–805
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3261
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- segundoExceso.mul(tipos[1]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- undefined / contribuyente (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- ["0.0015", "0.0017", "0.0019"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- tipos[2] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- base.minus(remanente) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- minimos.contribuyente.general / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- tiposSolidaridad[2025] / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1054
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("2364.34").minus(
          crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6361
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- reduccionNueva / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4926
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.general (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1361
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- caso.situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20771
- caso.situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21470
- caso / situacionFamiliar.ascendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- MINIMOS_ESTATALES_2012 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- gananciasPatrimoniales / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15558
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- reduccionNueva / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4926
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15172–15176
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- derechosEstatales?.descendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20868
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1308
- cotizacionesSociales / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13295
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- tiposSolidaridad[2026] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- reduccionRendimientosTrabajo / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–737
- 4080 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2209–2213
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- obtenerMinimoDescendientes(
    situacionFamiliar.descendientes,
    minimos
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63196–63276
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
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
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
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2975–2978
- cotizacionesTotales / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.minus(11250) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- rendimientoTrabajo.rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15307
- situacionFamiliar / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63487
- {
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
} / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1377–1441
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- reduccionNueva.minus(reduccionAnterior) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4951
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- caso.situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63135
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
      anio,
      base,
      componente: nombre,
    } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- reduccionTrabajo2023(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1847–1890
- minimoBase.plus(incrementoMayor65) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- exceso.minus(baseMaxima.mul("0.5")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
      bruta,
      remanente,
      despuesMinimo,
      minoracion: bruta.minus(despuesMinimo),
    } / minoracion (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2526–2630
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19976
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- derechosEstatales?.contribuyente ??
    obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstat / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20630
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      situacionFamili / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63629
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoAutonomico (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
 / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13460–13650
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5359–5371
- 0 / value (EUR, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:852–853
- 11250 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- tipos / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2026–2030
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- undefined / discapacidadContribuyente (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaGeneral (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- Decimal.max(0, base.minus(remanente)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- undefined / contribuyente (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- tiposSolidaridad[2025] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minim / total (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20423
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1738–1742
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto. / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5341–5554
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- ahorroConMinimos / estatal.minoracion (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23335
- "0.0017" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- minimoPersonalYFamiliarAutonomico / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23243–23276
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- "0.0019" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63720
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- derechosEstatales?.discapacidadFamiliares ??
    obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).p / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21510
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- tiposSolidaridad[2026] / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- "2364.34" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6225–6234
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2307–2308
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21708
- "0.001" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- reduccionAnterior.plus(
        maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2)
      ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4967
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3497
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- caso / comunidadAutonoma (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimos.contribuyente.general / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- {
    estatal: componente("estatal", minimoEstatal),
    autonomico: componente("autonomico", minimoAutonomico),
  } / autonomico.minoracion (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2644–2760
- derechosEstatales / contribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20475
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- { fechaFallecimiento, rendimientoPrevioNeto } / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1652–1697
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- remanente / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- "3751.20" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- rendimientoPrevioNeto.minus(9180) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2437
- rendimientoPrevioNeto.minus(14852) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6077
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- tipos[1] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- derechosEstatales / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20853
- 6498 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5405–5409
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- familiares / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
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
- gananciasPatrimoniales.gananciaSujetaGeneral / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15580
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3261
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5775–5796
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  ) / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–747
- totalSolidaridad.div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- {
      anio,
      base,
      componente: nombre,
    } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4581–4629
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4933–4950
- rendimientoPrevioNeto.lte(16825) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3402
- tiposSolidaridad / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- ["0.0019", "0.0021", "0.0024"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- tiposSolidaridad / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- ahorroConMinimos.autonomico / minoracion (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23365–23392
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5532
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6392–6404
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- GASTOS_FIJOS_IRPF_LEGACY / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1183
- crearImporteMonetario("3803.70").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- ["0.0015", "0.0017", "0.0019"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- minimoDiscapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21636–21667
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- caso / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21313
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- baseMaxima.mul("0.4") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- Decimal.max(0, baseGeneral) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15172–15181
- caso.situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20771
- bruta / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2327
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4607–4628
- Decimal.max(0, base.minus(remanente)) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21375
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- 6498 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5405–5409
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / rendimientoIntegro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- Decimal.max(0, baseGeneral) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- ({
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
}) / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1376–1442
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- crearImporteMonetario("3803.70") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- caso.situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21143
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- rendimientoCapitalInmobiliario?.rendimientoNeto / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–805
- 2022 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1746–1750
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- minimos.contribuyente / adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto.minus(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- derechosEstatales / discapacidadFamiliares (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21234
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6078
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- "0.0021" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- crearImporteMonetario(4080).minus(
          crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2448
- tiposSolidaridad / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- baseLiquidableGeneral / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23154–23175
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- reduccionTrabajoHasta2014(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1428–1476
- situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63016–63033
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoTrabajo.rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- minimoAutonomico / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2738–2754
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- medirAuditoriaSync(
    "liquidacion.parametrosComunidad.obtener",
    () =>
      obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        bas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15974–16270
- solidaridad / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- ["0.0015", "0.0017", "0.0019"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20498–20630
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- baseGeneral / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario("0.0015") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- minimoDiscapacidadContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21636–21667
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1454–1475
- 2652 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2501–2505
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(7302).minus(
          crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852))
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–6088
- tiposSolidaridad / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- rendimientoCapitalInmobiliario / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15628–15658
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3162–3183
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2425
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- minimoDiscapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63731–63762
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- crearImporteMonetario(7302) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–5991
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- rendimientoPrevioNeto.minus("14047.50") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5518
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2026–2030
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1542–1590
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21625
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / base (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- "14047.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5507–5517
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1868–1889
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- cotizacionAplicada / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1112–1130
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- medirAuditoriaSync(
    "liquidacion.reduccionRendimientosTrabajo",
    () =>
      calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fe / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15033–15351
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimoDiscapacidadFamiliares / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63774–63802
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1674–1695
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.lte("14047.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5147–5184
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:549–550
- minimoBase.plus(incrementoMayor65) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- incrementoMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23154–23175
- caso / situacionFamiliar.descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21313
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- solidaridad / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- caso.situacionFamiliar / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21331
- ["0.0015", "0.0017", "0.0019"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1220–1224
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2251–2257
- caso / situacionFamiliar.discapacidad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–811
- derechosEstatales?.discapacidadContribuyente ??
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21173
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- parametros.solidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- desglose / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7729
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosEstatales / contribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20475
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- solidaridad.trabajador / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21075–21173
- primerExceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- gananciasPatrimoniales / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–337
- minimo.minus(Decimal.max(0, baseGeneral)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- {
    salarioBrutoAnual,
    anio,
  } / salarioBrutoAnual (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
           / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2502
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / reduccionRendimientosTrabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- cotizacionesSociales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13316
- undefined / ascendientes (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- crearImporteMonetario("3751.20").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15860–15930
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimos.contribuyente / adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- {
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
} / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1377–1441
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20200
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
           / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2502
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- gananciasPatrimoniales / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15898–15920
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63591
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      }) / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13776–13908
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- rendimientoTrabajo.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–702
- "canonico" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12811–12821
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporteMonetario("0.35") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2399
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13179–13188
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
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
- "17673.52" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6328–6338
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- minimoAutonomico / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2738–2754
- derechosEstatales?.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20695
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- crearImporteMonetario(2652) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1319–1346
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:852–853
- undefined / total (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20239–20248
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- ["0.0019", "0.0021", "0.0024"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2438
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4959
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5532
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- familiares / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2105–2109
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1868–1889
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- reduccionTrabajo2023(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1847–1890
- tiposSolidaridad / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimos.contribuyente / general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- rendimientoTrabajo / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15285
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- minimos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- minimos.contribuyente / adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- ["0.0019", "0.0021", "0.0024"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / otrasRentasNoExentas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- "0.5" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- reduccionAnterior / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4810–4827
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- parametros.solidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12379
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3497
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0 / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–810
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    }) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20498–20630
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1942–1963
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21439
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimient / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15117–15347
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- base.minus(remanente) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
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
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- despuesMinimo / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2609–2622
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2109
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- SIN_SOLIDARIDAD / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- 5 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      }) / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13776–13908
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63763
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- rendimientoPrevioNeto.lte(16825) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3402
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- cotizacionesSociales / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13295
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- "0.0017" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- 2652 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1341–1345
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- legacy.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- minimo.minus(Decimal.max(0, baseGeneral)) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- "0.001" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- rendimientoTrabajo / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15668–15686
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
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
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- tiposSolidaridad[2025] / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- "0.0019" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- SIN_SOLIDARIDAD / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos, / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21791–21958
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ["0.0015", "0.0017", "0.0019"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- 7302 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5986–5990
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => crearImporteMonetario(73 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5685–6409
- undefined / descendientes (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1738–1750
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoEstatal (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- tipos / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2980–2983
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
      bruta,
      remanente,
      despuesMinimo,
      minoracion: bruta.minus(despuesMinimo),
    } / minoracion (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2526–2630
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2357
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- tipos[0] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- caso.situacionFamiliar.descendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21345
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2425
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- minimoContribuyente
    .plus(minimoDescendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21595
- caso.situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21470
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- minimoDescendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63670–63689
- ["0", "0", "0"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- 13260 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2297–2302
- crearImporteMonetario(4080) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2352
- caso.situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- 2 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4957–4958
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- {
        gananciasPatrimoniales,
      } / gananciasPatrimoniales.gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15888–15929
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- derechosEstatales?.descendientes ??
    obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20976
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- medirAuditoriaSync(
    "liquidacion.baseImponibleAhorro",
    () =>
      calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      })
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15785–15934
- derechosEstatales?.discapacidadContribuyente ??
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21173
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21668
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- bruta.minus(despuesMinimo) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2623
- ["0.0019", "0.0021", "0.0024"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.sumar",
    () =>
      sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimi / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13379–13654
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:549–550
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- crearImporteMonetario(4080) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2187–2214
- baseOrdinaria.mul(parametros.mei.trabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- minimos.contribuyente.adicionalMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- calcularCuotaComponenteAhorro({
      anio,
      base,
      componente: nombre,
    }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1976–2064
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- "3803.70" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- rendimientoCapitalInmobiliario / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14637
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- familiares / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  }) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62967–63057
- minimos.contribuyente.adicionalMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- crearImporteMonetario("1.5") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- gananciasPatrimoniales.gananciaSujetaAhorro / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14720–14763
- rendimientoPrevioNeto.lte(14852) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5775–5807
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- minimos.contribuyente.adicionalMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- minimoAscendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63701–63719
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- excesoRestante.mul(tipos[2]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- solidaridad.trabajador / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- convertirCentimosAEuros(0) / value (EUR, value); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      anio,
      base,
      componente: nombre,
    } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- familiares / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20703–20801
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20876–20976
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("1.14") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6282
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2670–2679
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- rendimientoCapitalInmobiliario.rendimientoNeto
    .plus(gananciasPatrimoniales.gananciaSujetaGeneral) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14709
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- obtenerMinimoDiscapacidadAscendientes(
      situacionFamiliar.ascendientes,
      minimos
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63529–63625
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  ) / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–747
- 14852 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6071–6076
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosEstatales?.descendientes ??
    obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20976
- solidaridad / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimos.contribuyente / adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- ["0", "0", "0"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 9180 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2168–2172
- rendimientoIntegro.minus(cotizacionAplicada) / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1131
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadFamiliares (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / gananciaPatrimonialGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63362–63379
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2164–2168
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- solidaridad.trabajador / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1568–1589
- cotizacionesTotales / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio <= 2014
        ? calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2514
- minimoBase.plus(incrementoMayor65) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- ganancias / value (selector, selection); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4898–4910
- minimoContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63659
- ahorroConMinimos.autonomico.minoracion / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23365–23403
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- minimosEstatales / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- minimoContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63659
- crearImporteMonetario(7302) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5821–5848
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- cotizacionTrabajadorOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4114
- legacy / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- solidaridad / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63803
- crearImporteMonetario("3803.70") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- 7302 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5843–5847
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20216
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- crearImporteMonetario("1.75") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6038
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- cotizacionesOrdinarias / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1056
- parametros.solidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2980–2983
- reduccionTrabajoDesde2024(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1916–1964
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporteMonetario("1.14") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5459
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5585–5597
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- caso / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21439
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19960
- "0.0024" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:726–734
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180),
      () => crearImporteMonetario(408 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2052–2511
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19981–19990
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- contexto.modo === "canonico" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12821
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2120–2271
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:809–810
- rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0) / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–743
- "1.5" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- legacy / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- ["0", "0", "0"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14720–14742
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- rendimientoIntegro.minus(cotizacionAplicada) / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1131
- "1.15625" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- minimoDescendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63670–63689
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.neto",
    () =>
      calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoInte / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13696–13912
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- minimos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- baseMaxima.mul("0.1") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- minimos.contribuyente / adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6145–6166
- base.minus(remanente) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- crearImporteMonetario(4080) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2187–2214
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- gananciasPatrimoniales.gananciaSujetaGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15580
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1007–1025
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto.minus(gastosDeducibles) / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1415
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- 7302 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5843–5847
- rendimientoPrevioNeto.minus(14852) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6077
- bruta / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2327
- crearImporteMonetario("1.5") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- rendimientoPrevioNeto.lte(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3272
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.lt("19747.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6145–6181
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4085–4285
- parametrosComunidad / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimo / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1402–1414
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- "14047.50" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5507–5517
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1349–1361
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1420–1438
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- 14852 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6071–6076
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => crearImporteMonetar / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5057–5602
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derechosEstatales?.discapacidadContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21067
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- cotizacionesTotales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- desglose.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7750
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- minimoContribuyente
    .plus(minimoDescendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63690
- caso.situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20589
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- caso / situacionFamiliar.discapacidad (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ahorroConMinimos / autonomico.minoracion (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23365–23381
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5500
- crearImporteMonetario("0.35") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2399
- {
                anio,
                base: remanente,
                componente: nombre,
              } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- cotizacionAplicada / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1112–1130
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- solidaridad.trabajador / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- crearImporteMonetario(4080).minus(
          crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2448
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20566
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2464–2470
- totalSolidaridad.div(6) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5147–5168
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- minimo / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- undefined / discapacidadFamiliares (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- derechosEstatales / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20853
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- ["0", "0", "0"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- ["0", "0", "0"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
              }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2349–2488
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6078
- derechosEstatales?.ascendientes ??
    obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20801
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- derechosAutonomicos / total (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21776
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- Decimal.max(0, baseGeneral) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
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
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
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
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- reduccionTrabajoHasta2014(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1428–1476
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("1.15625") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3391
- 9180 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2432–2436
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto.minus(11250) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimosEstatales / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- "1.14" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5452–5458
- minimosEstatales / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- {
    salarioBrutoAnual,
    anio,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- despuesMinimo / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2609–2622
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.sumar",
    () =>
      sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimi / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13379–13654
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- derechosEstatales?.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20695
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- primerExceso
    .mul(tipos[0]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseGeneral / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- "autonomico" / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2724–2736
- primerExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- rendimientoIntegroCapitalInmobiliario / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13861–13898
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- tiposSolidaridad / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- reduccionRendimientosTrabajo ?? 0 / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–742
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1054
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- tiposSolidaridad[2026] / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- gananciaPatrimonialGeneral / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–848
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- calcularCuotaComponenteAhorro({
      anio,
      base,
      componente: nombre,
    }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1976–2064
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => crearImporteMonetario(73 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5685–6409
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2050–2056
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosEstatales?.contribuyente ??
    obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstat / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20630
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- caso.comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16181–16203
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 6 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- minimos.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- ahorroConMinimos.estatal.minoracion.plus(
    ahorroConMinimos.autonomico.minoracion
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23407
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- cotizacionesMei / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- incrementoMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- tipos / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- totalSolidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- tiposSolidaridad / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
                anio,
                base: remanente,
                componente: nombre,
              } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- minimoBase / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- desglose / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7729
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7590–7607
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2026–2030
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- reduccionRendimientosTrabajo / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–737
- cotizacionesMei / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derechosAutonomicos / total (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21776
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- 2014 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1410–1414
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–337
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6064
- cotizacionesMei / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / baseGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- undefined / total (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20239–20248
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- undefined / descendientes (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- rendimientoPrevioNeto.minus(13115) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
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
- reduccionAnterior / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4876
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13218–13243
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("0.0015") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- cotizacionesOrdinarias / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- "17673.52" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6328–6338
- reduccionAnterior / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4933–4950
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:661–662
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).plus(
      obtenerMinimoDiscapacidadAscendientes( / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21510
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
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
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63148
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- crearImporteMonetario(6498) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5410
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:312–313
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- "0.35" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2392–2398
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- "1.14" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5452–5458
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1361–1362
- minimoContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21564
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- caso / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7590–7607
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- minimoDiscapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21679–21707
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- situacionFamiliar.discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- cotizacionesOrdinarias / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- solidaridadTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4154–4175
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3266–3271
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / baseGeneral (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63720
- minimoDescendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21575–21594
- {
    salarioBrutoAnual,
    anio,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2101
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- tiposSolidaridad[2026] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- situacionFamiliar.discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- 16825 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3396–3401
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20230
- calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      }) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15860–15930
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21668
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos, / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21791–21958
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- {
        gananciasPatrimoniales,
      } / gananciasPatrimoniales.gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15888–15929
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1361–1362
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- minimoDescendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21575–21594
- situacionFamiliar.descendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63501
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- tiposSolidaridad[2026] / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- caso.situacionFamiliar / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
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
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
    cotizacionEmpresarial: desglose.cotizacionEmpresarial,
    cotizacionTrabajador: desglose.cotizacionTrabajador,
  } / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7634–7755
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- {
    cotizacionEmpresarial: desglose.cotizacionEmpresarial,
    cotizacionTrabajador: desglose.cotizacionTrabajador,
  } / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7634–7755
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62967–63057
- baseGeneral / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- tipos[1] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- situacionFamiliar.discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1402–1406
- anio / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:976–980
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- exceso.minus(baseMaxima.mul("0.1")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- medirAuditoriaSync(
    "liquidacion.baseImponibleAhorro",
    () =>
      calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      })
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15785–15934
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20876–20976
- excesoRestante.mul(tipos[2]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoEstatal (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- 2014 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1312–1316
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- anio <= 2017 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1516–1528
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- tiposSolidaridad / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2787–2791
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3391
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4176
- componente("autonomico", minimoAutonomico) / minoracion (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2713–2755
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1443
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5069–5090
- cotizacionesTotales / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- cotizacionesTotales / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- minimos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- cotizacionesTotales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- minimos.contribuyente.adicionalMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5282–5303
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12384
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- 7302 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5986–5990
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- salarioBrutoAnual.minus(baseOrdinaria) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
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
- remanente / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- rendimientoPrevioNeto.minus(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- derechosEstatales?.ascendientes ??
    obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20801
- incrementoMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63148
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2120–2271
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoAutonomico (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63518
- {
    estatal: componente("estatal", minimoEstatal),
    autonomico: componente("autonomico", minimoAutonomico),
  } / estatal.minoracion (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2644–2760
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- Match.value(anio).pipe(
    Match.when(
      () => otrasRentasNoExentas.gt(6500),
      () => (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO)
    ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1208–1969
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13179–13183
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20584
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- cotizacionesSolidaridad / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- minimoDiscapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63774–63802
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1674–1695
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4810–4827
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16112–16116
- derechosAutonomicos?.total / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21783
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fech / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16057–16266
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- derechosEstatales?.discapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21258
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- derechosEstatales?.discapacidadFamiliares ??
    obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).p / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21510
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDiscapacidadAscendientes(
        caso.situacionFamiliar.ascendientes,
        minimosEstatales
      ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21388–21504
- crearImporteMonetario(2652) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1319–1346
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- 0 / value (EUR, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:809–810
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- "1.15625" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63323–63389
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- bruta / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2602
- rendimientoPrevioNeto.lte("19747.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5282–5319
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- minimos.contribuyente.adicionalMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- "3751.20" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21075–21173
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- 2 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4957–4958
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 2652 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1341–1345
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 16825 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3396–3401
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- GASTOS_FIJOS_IRPF_LEGACY / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1183
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- obtenerMinimoAscendientes(
    situacionFamiliar.ascendientes,
    minimos
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63087–63165
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:507–519
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- rendimientoPrevioNeto.lte(13260) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2271–2303
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- tipos / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6321
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- minimos.contribuyente / adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tiposSolidaridad / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1105
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2397–2401
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.minus("14047.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5518
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- otrasRentasNoExentas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15317–15337
- "0.35" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2392–2398
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- baseLiquidableAhorro / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23115–23135
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto. / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5341–5554
- rendimientoPrevioNeto.minus(13115) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- solidaridad.trabajador / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- excesoBase / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- tiposSolidaridad / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
- otrasRentasNoExentas.gt(6500) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1260–1289
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1007–1025
- minimoEstatal / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2681–2694
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- rendimientoPrevioNeto.lte(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3272
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16181–16185
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2014–2018
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cotizacionesTotales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1361
- crearImporteMonetario("1.5") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- 6498 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5220–5224
- discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- 7 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
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
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- caso / situacionFamiliar.descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- rendimientoPrevioNeto.minus("17673.52") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6339
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- cotizacionesSociales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13316
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- tiposSolidaridad[2025] / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- undefined / discapacidadFamiliares (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- caso.situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21457
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- incrementoMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2975–2978
- cotizacionesSolidaridad / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fech / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16057–16266
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- tipos / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1568–1589
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- solidaridadTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4154–4175
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:507–519
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- calcularAhorroConMinimos({
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamili / estatal.minoracion (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23057–23282
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- minimo.minus(Decimal.max(0, baseGeneral)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- situacionFamiliar.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63501
- {
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      } / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13831–13907
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- 13115 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- 14852 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5801–5806
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / contribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- rendimientoCapitalInmobiliario / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15628–15658
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- crearImporteMonetario("1.14") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5459
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- solidaridad.trabajador / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 4080 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2347–2351
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- crearImporteMonetario(7302).minus(
          crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852))
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–6088
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23094–23103
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- exceso.minus(baseMaxima.mul("0.5")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- minimoDiscapacidadContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63731–63762
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- 6500 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1284–1288
- "0.0021" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- baseImponibleGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15733–15753
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
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
- minimoAscendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21606–21624
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- cotizacionesSolidaridad / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1790–1811
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- crearImporteMonetario("3803.70").mul(12) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- Decimal.max(0, base) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- cuotaMinimoPersonalAhorro / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:56523–56548
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- Decimal.max(
            0,
            bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
       / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2282–2514
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- reduccionRendimientosTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15590–15618
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- crearImporteMonetario(7302) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–5991
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- "17673.52" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5931–5941
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2064–2085
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- rendimientoCapitalInmobiliario / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–788
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- rendimientoIntegroCapitalInmobiliario / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13861–13898
- reduccionRendimientosTrabajo ?? 0 / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–742
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4952
- parametrosComunidad.minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- cotizacionTrabajador ??
    calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–1054
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseGeneral / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- crearImporteMonetario("3751.20").mul(12) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- {
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.ganancia / ganancias (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14069–14338
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto.minus(9180) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2437
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }) / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1033
- {
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16096–16265
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
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
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- crearImporteMonetario("1.15625") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- baseOrdinaria.mul(parametros.mei.trabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- obtenerMinimoDiscapacidadAscendientes(
        caso.situacionFamiliar.ascendientes,
        minimosEstatales
      ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21388–21504
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- gananciasPatrimoniales.gananciaSujetaGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14664–14708
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- derechosAutonomicos?.total / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21783
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63487
- "2364.34" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6225–6234
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- minimos.contribuyente / general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    }) / value (selector, selection); Contrato de llamada pendiente: Option.match; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4136–4281
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- tiposSolidaridad[2025] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2101
- MINIMOS_ESTATALES_2012 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- Decimal.max(
      0,
      rendimientoPrevioNeto.minus(gastosDeducibles)
    ) / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1342–1421
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- minimoAscendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63701–63719
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- MINIMOS_ESTATALES_2013 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- reduccionRendimientosTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15590–15618
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3162–3183
- rendimientoCapitalInmobiliario.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14653
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- solidaridad / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- 0 / value (EUR, value); literal; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:312–313
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }) / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1033
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2072–2076
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- rendimientoTrabajo / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15668–15686
- "1.5" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6392–6404
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- MINIMOS_ESTATALES_2013 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–925
- crearImporteMonetario("1.15625") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    }) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4657–4772
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- derechosAutonomicos?.total ??
    calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: param / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21958
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23094–23098
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro) / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:300–359
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5500
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- minimos.contribuyente / general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- crearImporteMonetario(4080) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2352
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- minimos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- ["0.0015", "0.0017", "0.0019"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoCapitalInmobiliario.rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- { fechaFallecimiento, rendimientoPrevioNeto } / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1652–1697
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- ({
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
}) / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1376–1442
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- totalSolidaridad.div(6) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- situacionFamiliar.discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- crearImporteMonetario(2652) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2479–2506
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo, / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15459–15696
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- Decimal.max(0, base.minus(remanente)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- baseMaxima.mul("0.5") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1316
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
      anio,
      base,
      componente: nombre,
    } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- obtenerMinimoDiscapacidadAscendientes(
      situacionFamiliar.ascendientes,
      minimos
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63529–63625
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- minimos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
           / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5544
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- derechosEstatales?.discapacidadFamiliares / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21258
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- derechosEstatales?.contribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20490
- caso.situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20758
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.minus("17673.52") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6339
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1276–1297
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- cotizacionesMei / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- derechosEstatales / discapacidadContribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21040
- Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro) / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:300–359
- ["0", "0", "0"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3266–3271
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1276–1297
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- Match.value(
    fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    })
  ).pipe(
    Match.when(tr / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4640–4977
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- {
      anio,
      base,
      componente: nombre,
    } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- minimoContribuyente
    .plus(minimoDescendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21595
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1001–1002
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimosEstatales / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1105
- minimo / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- "0.5" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- gastosDeducibles / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1398–1414
- minimos.contribuyente / general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- minimos.contribuyente.adicionalMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1391
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- minimoBase / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- minimos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63016–63038
- obtenerMinimoDescendientes(
    situacionFamiliar.descendientes,
    minimos
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63196–63276
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto }) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1631–1698
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2397–2401
- rendimientoTrabajo / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15285
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- gastosDeducibles / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1398–1414
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- totalSolidaridad.div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5359–5371
- {
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.ganancia / ganancias (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14069–14338
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63323–63389
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21375
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- medirAuditoriaSync(
    "liquidacion.parametrosComunidad.obtener",
    () =>
      obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        bas / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15974–16270
- undefined / discapacidadContribuyente (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19990
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- 11250 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- segundoExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo, / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15459–15696
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- Match.value(anio).pipe(
    Match.when(
      () => otrasRentasNoExentas.gt(6500),
      () => (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO)
    ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1208–1969
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1420–1438
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- rendimientoPrevioNeto.minus(11250) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- Decimal.max(0, base.minus(remanente)) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- gananciaPatrimonialGeneral / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–848
- minimoPersonalYFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23196–23219
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- [AHORRO_2025] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180),
      () => crearImporteMonetario(408 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2052–2511
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- tipos[0] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- Decimal.max(
            0,
            bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
       / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2282–2514
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
           / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5544
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–854
- "1.14" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6275–6281
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–854
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- MINIMOS_ESTATALES_2014 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4898–4910
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4607–4628
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20758
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- ahorroConMinimos.estatal.minoracion / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23354
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- crearImporteMonetario("0.0015") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- crearImporteMonetario("1.5") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- minimoContribuyente
    .plus(minimoDescendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63690
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- ["0.0019", "0.0021", "0.0024"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
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
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4176
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- minimos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- 6498 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5220–5224
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63591
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:741–742
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- 2652 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2501–2505
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- minimos.contribuyente.adicionalMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.neto",
    () =>
      calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoInte / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13696–13912
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).plus(
      obtenerMinimoDiscapacidadAscendientes( / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21510
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- crearImporteMonetario(2652) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2479–2506
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- incrementoMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- derechosEstatales / discapacidadFamiliares (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21234
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6064
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20221–20230
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- 2017 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1524–1528
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2438
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5905–5926
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "1.14" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6275–6281
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- gananciasPatrimoniales.gananciaSujetaAhorro / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–358
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- meiTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4127–4140
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- convertirCentimosAEuros(0) / value (selector, selection); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- rendimientoTrabajo / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–686
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- baseMaxima.mul("0.5") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- crearImporteMonetario(6498) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5410
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- cotizacionesTotales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- SIN_SOLIDARIDAD / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- gananciaPatrimonialGeneral ?? 0 / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–853
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- resultadoParametrosComunidad / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16390–16418
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- minimoContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21564
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- Match.value(
    fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    })
  ).pipe(
    Match.when(tr / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4640–4977
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2014–2018
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–811
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- minimoPersonalYFamiliarAutonomico / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23243–23276
- reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto }) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1631–1698
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- "0.1" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- minimos.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- crearImporteMonetario(6498) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5198–5225
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63362–63379
- "0.4" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- crearImporteMonetario("1.75") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6038
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- rendimientoTrabajo / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–686
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2271–2292
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0) / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–743
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
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
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- "0.1" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- baseLiquidableAhorro / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23115–23135
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- crearImporteMonetario("3751.20") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- obtenerMinimoAscendientes(
    situacionFamiliar.ascendientes,
    minimos
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63087–63165
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1542–1590
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- rendimientoCapitalInmobiliario.rendimientoNeto
    .plus(gananciasPatrimoniales.gananciaSujetaGeneral)
    .plus(gananciasPatrimoniales.gananciaSujetaAhorro) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14764
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- [AHORRO_2023_2024] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- SIN_SOLIDARIDAD / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- rendimientoCapitalInmobiliario / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–788
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63763
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- Decimal.max(
      0,
      rendimientoPrevioNeto.minus(gastosDeducibles)
    ) / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1342–1421
- crearImporteMonetario("3751.20") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- tipos[2] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- minimo / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1790–1811
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 4080 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2209–2213
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / gananciaPatrimonialGeneral (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadFamiliares (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- 9180 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2432–2436
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- componente("estatal", minimoEstatal) / minoracion (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2659–2695
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63604
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1391
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- "0.0024" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:726–734
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tipos / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso / situacionFamiliar.descendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2026–2030
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- "1.75" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6031–6037
- ["0.0019", "0.0021", "0.0024"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5585–5597
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2109
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 13115 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- "1.5" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (selector, selection); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- minimo.minus(Decimal.max(0, baseGeneral)) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- reduccionAnterior.plus(
        maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2)
      ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4967
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- crearImporteMonetario("1.14") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6282
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63803
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- minimoPersonalYFamiliar / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23196–23219
- calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimient / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15117–15347
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- caso / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21125
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4959
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario("2364.34") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6235
- minimosEstatales / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- exceso.minus(baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- {
      anio,
      base,
      componente: nombre,
    } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- reduccionTrabajoDesde2024(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1916–1964
- tiposSolidaridad / 2026.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- minimos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2251–2257
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- baseImponibleGeneral / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15733–15753
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6351
- caso / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0 / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–810
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–925
- minimoBase / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- gananciasPatrimoniales / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14664–14686
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- caso.situacionFamiliar.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21345
- [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- {
      anio,
      base,
      componente: nombre,
    } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- reduccionNueva.minus(reduccionAnterior) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4951
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / anio (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- medirAuditoriaSync(
    "liquidacion.reduccionRendimientosTrabajo",
    () =>
      calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fe / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15033–15351
- "19747.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5308–5318
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
- caso.situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1516–1520
- gananciasPatrimoniales / gananciaSujetaGeneral (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15558
- {
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16096–16265
- 11250 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20740
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15898–15920
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- caso / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20740
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- crearImporteMonetario("2364.34") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6235
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- Decimal.max(0, base) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1056
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- caso / situacionFamiliar.discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
              }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2349–2488
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- remanente / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
 / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13460–13650
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- calcularDesgloseCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio,
  }) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7541–7623
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / contribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- {
    anio,
    salarioBrutoAnual,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1349–1361
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- excesoRestante / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2142–2163
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21457
- excesoBase / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13218–13243
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- remanente / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1303–1362
- {
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4149–4280
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- obtenerPoliticaSolidaridad(anio) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- tiposSolidaridad[2026] / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- "1.5" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- caso / situacionFamiliar.descendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- desglose.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7750
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- {
                anio,
                base: remanente,
                componente: nombre,
              } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- "14047.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5173–5183
- calcularAhorroConMinimos({
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamili / autonomico.minoracion (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23057–23282
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- tiposSolidaridad[2025] / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63135
- base.minus(remanente) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- caso.situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21331
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- rendimientoPrevioNeto.lte(9180) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2142–2173
- crearImporteMonetario("2364.34").minus(
          crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6361
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63604
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- derechosEstatales?.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20868
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7613–7617
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- 0 / value (EUR, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:661–662
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2464–2470
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- obtenerPoliticaSolidaridad(anio) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- legacy.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- ganancias / value (EUR, value); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / reduccionRendimientosTrabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- Decimal.max(0, base) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- otrasRentasNoExentas / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1260–1280
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- incrementoMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- caso.situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21143
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- 6 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- [AHORRO_2021_2022] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2050–2056
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- rendimientoTrabajo.rendimientoNeto / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–702
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      situacionFamili / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63629
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2164–2168
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6351
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- minimoDiscapacidadFamiliares / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21679–21707
- minimoBase.plus(incrementoMayor65) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- resultadoParametrosComunidad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16390–16418
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- cotizacionTrabajadorOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4114
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minim / total (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20423
- anio / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1184–1188
- medirAuditoriaSync(
    "liquidacion.baseImponibleGeneral",
    () =>
      calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananci / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15383–15700
- "0.4" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63518
- derechosEstatales / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20681
- tiposSolidaridad / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- {
      anio,
      base,
      componente: nombre,
    } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      } / rendimientoIntegro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13831–13907
- derechosEstatales?.discapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21067
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- "19747.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6170–6180
- "1.75" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6031–6037
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- rendimientoTrabajo.rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15307
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- "1.15625" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- gananciasPatrimoniales.gananciaSujetaAhorro / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–358
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derechosEstatales / discapacidadContribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21040
- minimos.contribuyente / adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- gananciaPatrimonialGeneral ?? 0 / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–853
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16112–16121
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- primerExceso
    .mul(tipos[0]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- minimoEstatal / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2681–2694
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- 4080 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2347–2351
- caso / situacionFamiliar.ascendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2105–2109
- salarioBrutoAnual.minus(baseOrdinaria) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- minimoAscendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21606–21624
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- anio === 2018 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2366
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- parametrosComunidad / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- parametrosComunidad.minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.001" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- baseMaxima.mul("0.4") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- medirAuditoriaSync(
    "liquidacion.baseImponibleGeneral",
    () =>
      calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananci / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15383–15700
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- caso / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- minimosEstatales / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosAutonomicos?.total ??
    calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: param / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21958
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- parametros.solidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- minimos.contribuyente.adicionalMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- bruta / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2602
- MINIMOS_ESTATALES_2014 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- [AHORRO_2016_2020] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- calcularDesgloseCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio,
  }) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7541–7623
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6321
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- obtenerPoliticaSolidaridad(anio) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- incrementoMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1443
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- minimos.contribuyente / adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- segundoExceso.mul(tipos[1]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- "3803.70" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1001–1002
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4876
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => crearImporteMonetar / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5057–5602
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- 7 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
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
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- Decimal.max(0, base) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- cotizacionesOrdinarias / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- caso.situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- caso / situacionFamiliar.discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21125
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaGeneral (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- rendimientoPrevioNeto.lte("17673.52") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5905–5942
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5697–5718
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- crearImporteMonetario(7302) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5821–5848
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2307–2308
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20703–20801
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadContribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- bruta.minus(despuesMinimo) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2623
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4581–4629
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- obtenerEscalasAhorroPublicadas(anio, componente) / value (EUR, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- obtenerPoliticaSolidaridad(anio) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- cotizacionesSolidaridad / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1303–1362
- ahorroConMinimos.estatal / minoracion (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23343
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadContribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4952
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- baseMaxima.mul("0.1") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- rendimientoPrevioNeto.minus(gastosDeducibles) / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1415
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- crearImporteMonetario(6498) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5198–5225
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21625
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- segundoExceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1764–1812
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- anio <= 2014
        ? calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2514
- meiTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4127–4140
- cotizacionTrabajador ??
    calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–1054
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoTrabajo.rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1764–1812
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- totalSolidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1454–1475
- 0 / value (EUR, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:741–742
- {
                anio,
                base: remanente,
                componente: nombre,
              } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- solidaridad / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoCapitalInmobiliario.rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- undefined / ascendientes (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- Decimal.max(0, baseGeneral) / value (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- minimoBase / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- incrementoMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284

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
- [selection] argumento de max; e:1910
- [selection] sustitución por propiedad del argumento; e:1913
- [selection] argumento de max; e:1915
- [selection] retorno de calcularBaseImponibleAhorro; e:1916
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1917
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

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
