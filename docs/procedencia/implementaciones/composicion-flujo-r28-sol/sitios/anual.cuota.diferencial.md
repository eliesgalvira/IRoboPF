# anual.cuota.diferencial

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: `${euros(cuotaLiquida)} - ${euros(centimosAEuros(caso.retencionesSoportadasCentimos))} - ${euros(centimosAEuros(pagosACuentaAplicadosCentimos))}`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:882–886
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- 7302 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5843–5847
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21708
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- baseCotizacion.baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 2 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4957–4958
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1942–1963
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- caso / situacionFamiliar.descendientes (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 2014 / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17586–17590
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- minimos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- 4080 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2209–2213
- rendimientoCapitalInmobiliario?.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–805
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3261
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- segundoExceso.mul(tipos[1]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaA / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22648–22890
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- ["0.0015", "0.0017", "0.0019"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- situacionFamiliar.descendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63501
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- exceso.minus(baseMaxima.mul("0.5")) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / baseGeneral (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- Match.value(anio).pipe(
    Match.when(
      () => otrasRentasNoExentas.gt(6500),
      () => (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO)
    ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1208–1969
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- rendimientoTrabajo.rendimientoNeto / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–702
- minimos.contribuyente.general / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9268–9272
- minimoPersonalYFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22253–22276
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- tiposSolidaridad[2025] / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- "0.0021" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- crearImporte(0) / value (centimos, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- caso / rendimientos.trabajo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("2364.34").minus(
          crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6361
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- comunidadAutonoma === "catalunya" && anio >= 2022 && anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4165
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseOrdinaria.mul(parametros.mei.trabajador) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180),
      () => crearImporteMonetario(408 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2052–2511
- obtenerMinimoDiscapacidadAscendientes(
        caso.situacionFamiliar.ascendientes,
        minimosEstatales
      ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21388–21504
- primerExceso / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- caso.situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21470
- caso / situacionFamiliar.ascendientes (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- cuotaIntegraGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24450–24469
- MINIMOS_ESTATALES_2012 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).plus(
      obtenerMinimoDiscapacidadAscendientes( / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21510
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- usaEscalaAutonomicaReal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18490–18513
- gananciasPatrimoniales / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15558
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- reduccionNueva / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4926
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15172–15176
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- parametros / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- derechosEstatales?.descendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20868
- TRAMOS_IRPF_AHORRO_2014 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9743–9766
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1308
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- 4080 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2209–2213
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- parametros / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- minimoContribuyente / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21564
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
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
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / cotizacionTrabajador (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
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
- TRAMOS_IRPF_AHORRO_2024 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3605–3628
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2975–2978
- parametrosComunidad.escalaAutonomica / tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22781–22817
- minimoContribuyente
    .plus(minimoDescendientes) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21595
- 6 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- situacionFamiliar / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63487
- minimoBase.plus(incrementoMayor65) / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2343–2537
- Effect.mapError(errorDerechosMinimos) / value (centimos, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- crearImporteMonetario("1.14") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6282
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- anio <= 2014
        ? calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2514
- "1.5" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63135
- tiposSolidaridad / 2026.trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- Decimal.max(
    0,
    cuotaIntegraAhorro.minus(cuotaMinimoPersonalAhorro)
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24677–24756
- {
      anio,
      base,
      componente: nombre,
    } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- calcularDesgloseCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio,
  }) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7541–7623
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- caso / situacionFamiliar.ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporte(0) / value (centimos, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- ["0", "0", "0"] / 0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 7 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- obtenerTiposMei(anio) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- reduccionTrabajo2023(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1847–1890
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- tiposSolidaridad / 2026.trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- reduccionAnterior / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4876
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"
      ? [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014]
      : undefined / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17573–17729
- caso.situacionFamiliar / discapacidad (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- minimosEstatales / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19976
- crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852)) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6078
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoAutonomico (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
 / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13460–13650
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tipos / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- {
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      } / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18196–18339
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- { fechaFallecimiento, rendimientoPrevioNeto } / rendimientoPrevioNeto (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1652–1697
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17878–17887
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- ahorroConMinimos.autonomico / minoracion (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23365–23392
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- Decimal.max(0, base.minus(remanente)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- undefined / contribuyente (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario("3803.70").mul(12) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- ["0.0019", "0.0021", "0.0024"] / 0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1738–1742
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- minimoPersonalYFamiliar / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23196–23219
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto. / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5341–5554
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / gananciaPatrimonialGeneral (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- TRAMOS_IRPF_AHORRO_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4133–4156
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- "0.0017" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- retencionTrabajoAeat / importeRetencionAnualCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28632–28652
- caso.situacionFamiliar / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21457
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
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
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- obtenerTramosIrpfLegacy(anio) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:839–868
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- minimoContribuyente / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63659
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
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- tiposSolidaridad[2026] / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- minimo / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- b / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaAhorro (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- minimos.contribuyente.general / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- ahorroConMinimos.estatal.minoracion.plus(
    ahorroConMinimos.autonomico.minoracion
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23407
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- "0.001" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / rendimientoPrevioNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- caso / comunidadAutonoma (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- minimo.minus(Decimal.max(0, baseGeneral)) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- retencionesSoportadasCentimos / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-diferencial.ts:297–326
- minimos.contribuyente.general / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- derechosAutonomicos / total (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21776
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- bruto / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- minimos.contribuyente / adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- "2364.34" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6225–6234
- escalasPublicadasAutonomicas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22853–22881
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- 6498 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5405–5409
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17573–17639
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22278–22299
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- "3751.20" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- rendimientoPrevioNeto.minus(14852) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6077
- minimoPersonalYFamiliarAutonomico / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22687–22720
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- remanente / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- derechosEstatales / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20853
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 6498 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5405–5409
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- {
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
    / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18543–18707
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- calcularAhorroConMinimos({
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamili / autonomico.minoracion (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23057–23282
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4898–4910
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3261
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5775–5796
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  ) / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–747
- (a, b) => b.edad - a.edad / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- minimos / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- 0 / value (centimos, value); literal; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:312–313
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- tipos / 1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18559–18580
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (centimos, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- Object.values(parametros.tiposSeguridadSocial) / value (centimos, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4933–4950
- reduccionAnterior / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4810–4827
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- rendimientoPrevioNeto.lte(16825) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3402
- tiposSolidaridad / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario(3700) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20876–20976
- crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5532
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- GASTOS_FIJOS_IRPF_LEGACY / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1183
- (a, b) => b.edad - a.edad / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4238–4251
- ["0.0015", "0.0017", "0.0019"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- caso / retencionTrabajoAeat (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- parametros.solidaridad / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- MADRID_2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4260–4271
- calcularCuotaDiferencialCentimos({
                  cuotaLiquidaCentimos:
                    importesLiquidacion.cuotaLiquidaCentimos,
                  pagos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59578–59909
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- baseMaxima.mul("0.4") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- despuesMinimo / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2564–2577
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18715–18736
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- ascendientes / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- parametros.mei.trabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- {
    estatal: componente("estatal", minimoEstatal),
    autonomico: componente("autonomico", minimoAutonomico),
  } / autonomico.minoracion (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2644–2760
- incrementoMayor75 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15172–15181
- caso.situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20771
- usaEscalaAutonomicaReal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22172–22195
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
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
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
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
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / rendimientoIntegro (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18490–18743
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- 12 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadFamiliares (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    }) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20498–20630
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1868–1889
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–854
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- comunidadAutonoma === "catalunya" && anio >= 2020 && anio <= 2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4061
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21143
- crearImporteMonetario(7302) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5821–5848
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1454–1475
- crearImporteMonetario(2652) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2479–2506
- situacionFamiliar / discapacidad (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- "0.1" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
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
- 2022 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1746–1750
- minimos.contribuyente.general / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
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
- caso / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17594–17598
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- escalasPublicadasEstatales / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18304–18330
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- escalaPublicadaAutonomica === undefined
      ? undefined
      : [escalaPublicadaAutonomica] / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17848–17941
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto.minus(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- exceso / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- 13115 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- derechosAutonomicos?.total ??
    calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: param / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21958
- MINIMOS_ESTATALES_2012 / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tiposSolidaridad / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- segundoExceso / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4145–4149
- parametros / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
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
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
  } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18903–18961
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- medirAuditoriaSync(
    "liquidacion.parametrosComunidad.obtener",
    () =>
      obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        bas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15974–16270
- solidaridad / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- cuotaMinimoPersonal / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24476–24495
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- derecha / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(
    fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    })
  ).pipe(
    Match.when(tr / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4640–4977
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- SIN_SOLIDARIDAD / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- baseGeneral / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- minimoBase.plus(incrementoMayor65) / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- incrementoMayor65 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- minimoDiscapacidadContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21636–21667
- 2652 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2501–2505
- {
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
} / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1377–1441
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- 2652 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2501–2505
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- despuesMinimo / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2609–2622
- anio <= 2020 / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9402–9414
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- baseCotizacion / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- rendimientoCapitalInmobiliario / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15628–15658
- cotizacionesTotales.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- "0.0015" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3162–3183
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
 / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13460–13650
- reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto }) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1631–1698
- crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5532
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimos.contribuyente.adicionalMayor65 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario(7302) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–5991
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseCotizacion / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- {
        anio: caso.anio,
        base: baseLiquidableGeneral,
      } / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18377–18448
- base.minus(remanente) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
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
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1542–1590
- TRAMOS_IRPF_AHORRO_2021 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10114–10137
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- "0.0019" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- "14047.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5507–5517
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- {
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18196–18339
- contexto / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28361–28369
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1868–1889
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
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
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
- derechosEstatales?.ascendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20695
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- minimoDiscapacidadFamiliares / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63774–63802
- minimoAscendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63701–63719
- "0.0013" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1674–1695
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.lte("14047.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5147–5184
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4041–4045
- minimoBase.plus(incrementoMayor65) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- caso.rendimientos / trabajo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23154–23175
- caso / situacionFamiliar.descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21313
- parametros / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- ascendientes / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- derechosAutonomicos?.total / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21783
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- caso.situacionFamiliar / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21331
- 2016 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3951–3955
- rendimientoTrabajo / rendimientoPrevioNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15285
- ["0.0019", "0.0021", "0.0024"] / 2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4305–4313
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1220–1224
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2251–2257
- caso / situacionFamiliar.discapacidad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- crearImporteMonetario(7302) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–5991
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–811
- 13115 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- parametros.solidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- baseLiquidableAhorro / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18936–18956
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- crearImporteMonetario("3751.20").mul(12) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- desglose / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7729
- crearImporteMonetario("2364.34") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6235
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- cuotaMinimoPersonalAhorro / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24726–24751
- 2652 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1341–1345
- derechosEstatales / contribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20475
- fechaFallecimiento / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4342–4360
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21075–21173
- comunidadAutonoma === "catalunya" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4029
- primerExceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- minimo.minus(Decimal.max(0, baseGeneral)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- parametros.baseMaxima / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- Decimal.max(0, base.minus(remanente)) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- ascendientes / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- minimos / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- ahorroConMinimos.autonomico / despuesMinimo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25053–25080
- 5565 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- crearImporteMonetario("0.35") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2399
- baseCotizacion / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- {
    salarioBrutoAnual,
    anio,
  } / salarioBrutoAnual (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- "1.15625" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- 0 / value (centimos, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:741–742
- undefined / ascendientes (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1764–1812
- ahorroConMinimos.autonomico.minoracion / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23365–23403
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4238–4242
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimoDiscapacidadFamiliares / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63774–63802
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
} / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1377–1441
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derechosEstatales?.descendientes ??
    obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20976
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20200
- [
  ...filas([
    ["0", "0", ".096"],
    ["12960.45", "1244.20", ".1146"],
    ["21028.20", "2168.76", ".1374"],
    ["35394", "4142.62", ".1822"],
  ]),
  {
 / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3107–3406
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (selector, selection); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- TRAMOS_IRPF_2015 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9351–9367
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- {
      rendimientoIntegroTrabajoCentimos: liquidarCentimos(
        rendimientoTrabajo.rendimientoIntegro
      ),
      rendimientoNetoTrabajoCentimos: liquid / cuotaLiquidaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25552–28121
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- ganancias / value (centimos, value); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      }) / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13776–13908
- "0.0019" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- rendimientoTrabajo.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–702
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- "canonico" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12811–12821
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21625
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13179–13188
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
- {
                  cuotaLiquidaCentimos:
                    importesLiquidacion.cuotaLiquidaCentimos,
                  pagosACuentaCentimos: pagosACuentaApli / cuotaLiquidaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59611–59908
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- baseMaxima / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- minimoAutonomico / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2738–2754
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- caso.situacionFamiliar.ascendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20771
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:852–853
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18418–18439
- undefined / total (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20239–20248
- excesoBase / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- {
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
    / tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18543–18707
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- ["0.0019", "0.0021", "0.0024"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2438
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1361
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4959
- TRAMOS_IRPF_AHORRO_2016 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9849–9872
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- rendimientoPrevioNeto.minus(9180) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2437
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- rendimientos / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
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
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- baseLiquidableAhorro / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23115–23135
- familiares / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- parametrosComunidad.escalaAutonomicaIgualEstatal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18057–18105
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2105–2109
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- medirAuditoriaSync(
    "liquidacion.baseImponibleGeneral",
    () =>
      calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananci / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15383–15700
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoTrabajo / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15285
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- minimos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- ["0.0019", "0.0021", "0.0024"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / otrasRentasNoExentas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- izquierda / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerTiposMei(anio) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- parametros.solidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12379
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3497
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0 / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–810
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- derecha.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    }) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20498–20630
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- TRAMOS_IRPF_AHORRO_2024 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10273–10296
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- base.minus(remanente) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
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
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2109
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 5 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0) / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–743
- segundoExceso.mul(tipos[1]) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18915–18919
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- b / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63763
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- parametrosComunidad.escalaAutonomica / tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18598–18634
- caso / situacionFamiliar.ascendientes (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 2020 / value (selector, selection); literal; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9410–9414
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- cotizacionesOrdinarias / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- rendimientoPrevioNeto.lte(16825) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3402
- cotizacionesSociales / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13295
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      situacionFamili / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63629
- 2652 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1341–1345
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:819–823
- ahorroConMinimos.estatal / minoracion (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23343
- centimosAEuros(
    sumarDeduccionesAutonomicasCentimos(caso)
  ) / value (centimos, value); Unidad de salida no acreditada: centimosAEuros; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24800–24865
- caso / rendimientos.trabajo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- reduccionRendimientosTrabajo / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–737
- "0.1" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- "0.001" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- caso / situacionFamiliar.descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21313
- rendimientoTrabajo / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15668–15686
- calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo, / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15459–15696
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor75 (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- incrementoMayor75 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- tipos[0] / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- minimos.contribuyente / general (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21708
- tiposSolidaridad[2025] / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- "0.0019" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- SIN_SOLIDARIDAD / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos, / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21791–21958
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- ["0.0015", "0.0017", "0.0019"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5585–5597
- {
      bruta,
      remanente,
      despuesMinimo,
      minoracion: bruta.minus(despuesMinimo),
    } / despuesMinimo (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2526–2630
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimient / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15117–15347
- 7302 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5986–5990
- minimoDiscapacidadContribuyente / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21636–21667
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- undefined / descendientes (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- cuotaGeneralDespuesMinimo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25199–25224
- "3803.70" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- derecha / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- gananciasPatrimoniales.gananciaSujetaGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15580
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1738–1750
- {
        gananciasPatrimoniales,
      } / gananciasPatrimoniales.gananciaSujetaAhorro (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15888–15929
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoEstatal (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:608–612
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  }) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62967–63057
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- ["0", "0", "0"] / 1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- cotizacionTrabajadorOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4114
- escalasPublicadasEstatales / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22371–22397
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:891–892
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17573–17577
- TRAMOS_IRPF_DESDE_2021 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9482–9504
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- Decimal.max(0, base) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- TRAMOS_IRPF_AHORRO_2014 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4778–4801
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / contribuyente (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- TRAMOS_IRPF_AHORRO_2025 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10322–10345
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2357
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros.mei / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNet / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–811
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
- [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17648–17711
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimos / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- minimoDescendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63670–63689
- errorDerechosMinimos / value (centimos, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- cotizacionesTotales / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- 13260 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2297–2302
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / cotizacionTrabajador (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- 2 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4957–4958
- situacionFamiliar / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63591
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- SIN_SOLIDARIDAD / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- {
        gananciasPatrimoniales,
      } / gananciasPatrimoniales.gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15888–15929
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- derechosEstatales?.discapacidadContribuyente ??
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21173
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario("3803.70") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1568–1589
- rendimientoIntegroTrabajo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13218–13243
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- ["0.0019", "0.0021", "0.0024"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametrosComunidad / escalaEstatalGeneral (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17977–17996
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- filas([
  ["0", "0", ".085"],
  ["12960.45", "1101.64", ".107"],
  ["18433.20", "1687.22", ".128"],
  ["34360.50", "3725.91", ".174"],
  ["55596.90", "7421.04", / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2539–2711
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- crearImporteMonetario("0.0013") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- [escalaPublicadaAutonomica] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17914–17941
- derechosEstatales?.discapacidadFamiliares ??
    obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).p / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21510
- ahorroConMinimos / autonomico.despuesMinimo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25053–25069
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.discapacidad (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- {
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      } / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18196–18339
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:549–550
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- {
        anio: caso.anio,
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      } / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22444–22553
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- baseOrdinaria.mul(parametros.mei.trabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3943–3947
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- TRAMOS_IRPF_AHORRO_2012 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9637–9660
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2120–2271
- calcularCuotaPorEscala({
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:579–661
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- caso / fechaFallecimiento (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17799–17803
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- 3700 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- salarioBrutoAnual / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
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
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- anio <= 2014 / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9268–9280
- caso / situacionFamiliar.discapacidad (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- "3803.70" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- "andalucia" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3784–3795
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2207
- rendimientoCapitalInmobiliario / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14637
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22522–22543
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4959
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaAutonomica.tramos (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3935
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25192–25193
- obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  }) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62967–63057
- crearImporteMonetario("1.5") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- gananciasPatrimoniales.gananciaSujetaAhorro / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14720–14763
- rendimientoPrevioNeto.lte(14852) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5775–5807
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- "0.4" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- minimos.contribuyente.adicionalMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- {
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublica / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22225–22406
- Effect.mapError(errorDerechosMinimos) / value (centimos, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- parametrosComunidad.escalaEstatalGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17977–18017
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimos / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      anio,
      base,
      componente: nombre,
    } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- familiares / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- Decimal.max(0, base.minus(remanente)) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- parametrosComunidad.minimosAutonomicos / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- cuotaIntegraAhorro.minus(cuotaMinimoPersonalAhorro) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24701–24752
- crearImporteMonetario("1.14") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6282
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
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
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
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- TRAMOS_IRPF_2016_A_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9428–9451
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- rendimientoCapitalInmobiliario.rendimientoNeto
    .plus(gananciasPatrimoniales.gananciaSujetaGeneral) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14709
- exceso / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- ({
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
}) / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1376–1442
- obtenerMinimoDiscapacidadAscendientes(
      situacionFamiliar.ascendientes,
      minimos
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63529–63625
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- comunidadAutonoma === "murcia" &&
    anio === 2022 &&
    fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4588
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- 14852 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6071–6076
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- a / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18418–18439
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63720
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoTrabajo / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–686
- Decimal.min(
      Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))),
      Decimal.max(0, base)
    ) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1847–1957
- cuotaGeneralDespuesMinimo
      .plus(cuotaAhorroDespuesMinimo) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25199–25262
- calcularCuotaPorEscala({
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: para / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22625–22891
- derechosEstatales?.descendientes ??
    obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20976
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- solidaridad / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- TRAMOS_IRPF_AHORRO_2017 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9902–9925
- minimos.contribuyente / adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 9180 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2168–2172
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / gananciaPatrimonialGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63362–63379
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2164–2168
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- cotizacionesTotales.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- solidaridad.trabajador / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1568–1589
- bruta / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2602
- "simulada-estatal" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17621–17639
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }),
    base.mul(0),
    (total, tramo) => / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:756–944
- ahorroConMinimos / estatal.minoracion (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23335
- caso / retencionTrabajoAeat (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28219
- cotizacionesTotales / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- cuotaAutonomicaGeneralDespuesMinimo.plus(
          ahorroConMinimos.autonomico.despuesMinimo
        ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25001–25104
- minimoBase.plus(incrementoMayor65) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- excesoRestante / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- ganancias / value (selector, selection); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- discapacidad / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4898–4910
- minimoContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63659
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- minimosEstatales / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- cuotaLiquidaCentimos / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-diferencial.ts:274–294
- anio <= 2020 / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9402–9414
- crearImporteMonetario(7302) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5821–5848
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- cotizacionTrabajadorOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4114
- legacy / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- cotizacionTrabajador ??
    calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–1054
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
- 7302 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5843–5847
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20216
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- {
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaA / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22648–22890
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- caso.pagosACuentaCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28733–28758
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- "comunitat-valenciana" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3893–3915
- calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos, / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21791–21958
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- usaEscalaAutonomicaReal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22595–22618
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2980–2983
- reduccionTrabajoDesde2024(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1916–1964
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22926–22927
- crearImporteMonetario("1.14") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5459
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- undefined / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17896–17905
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.sumar",
    () =>
      sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimi / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13379–13654
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5585–5597
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18559–18580
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- caso / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21439
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- Decimal.max(
    0,
    cuotaIntegraGeneral.minus(cuotaMinimoPersonal)
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24426–24500
- minimo(bruto, parametros.baseMaxima) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
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
- parametros / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- comunidadAutonoma === "andalucia" && anio >= 2012 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3811
- filas([
  ["0", "0", ".119"],
  ["17707.20", "2107.16", ".1392"],
  ["33007.20", "4236.92", ".1845"],
  ["53407.20", "8000.72", ".2148"],
  ["120000.20", "22304 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1688–1904
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19981–19990
- escalasPublicadasAutonomicas / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22853–22881
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- contexto.modo === "canonico" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12821
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:809–810
- "0" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- calcularCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: baseLiquidableAhorro,
  }) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18874–18962
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0) / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–743
- derechosEstatales?.ascendientes ??
    obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20801
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- ["0", "0", "0"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14720–14742
- minimosEstatales / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- rendimientoIntegro.minus(cotizacionAplicada) / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1131
- obtenerMinimoDescendientes(
    situacionFamiliar.descendientes,
    minimos
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63196–63276
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22485–22544
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- crearImporteMonetario(3700) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- 12 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- cotizacionesOrdinarias / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- {
    cotizacionEmpresarial: desglose.cotizacionEmpresarial,
    cotizacionTrabajador: desglose.cotizacionTrabajador,
  } / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7634–7755
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- minimos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- {
        anio: caso.anio,
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      } / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22444–22553
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- baseMaxima.mul("0.1") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- {
      bruta,
      remanente,
      despuesMinimo,
      minoracion: bruta.minus(despuesMinimo),
    } / minoracion (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2526–2630
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4226–4234
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- {
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublica / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22225–22406
- cuotaIntegraGeneralEstatal / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18774–18800
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- TRAMOS_IRPF_AHORRO_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10061–10084
- baseCotizacion.baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- minimos.contribuyente / adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- filas([
  ["0", "0", ".105"],
  ["12450", "1307.25", ".12"],
  ["17707.20", "1938.11", ".14"],
  ["21000", "2399.10", ".15"],
  ["33007.20", "4200.18", ".188"], / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2212–2511
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6145–6166
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- caso.situacionFamiliar / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20758
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- crearImporteMonetario(4080) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2187–2214
- 5565 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- gananciasPatrimoniales.gananciaSujetaGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15580
- cotizacionesMei / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9268–9272
- caso / situacionFamiliar.descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
  / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22595–22928
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- calcularAhorroConMinimos({
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamili / estatal.minoracion (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23057–23282
- reduccionRendimientosTrabajo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15590–15618
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto.minus(gastosDeducibles) / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1415
- comunidadAutonoma === "madrid" && anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4251
- rendimientoPrevioNeto.lte(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3272
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.lt("19747.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6145–6181
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4085–4285
- obtenerTramosIrpfAhorro(anio) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:626–655
- gananciasPatrimoniales / gananciaSujetaAhorro (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–337
- caso.retencionesSoportadasCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59855–59889
- caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"
      ? [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014]
      : undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17573–17729
- TRAMOS_IRPF_AHORRO_2022 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3888–3911
- ["0.0015", "0.0017", "0.0019"] / 1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- gananciaPatrimonialGeneral / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–848
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4137–4141
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoPrevioNeto (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("1.15625") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- desglose / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7729
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1402–1414
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- crearImporteMonetario(2652) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1319–1346
- tiposSolidaridad / 2025.trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 &&
    anio <= 2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3955
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- crearImporteMonetario(3700) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1349–1361
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:608–612
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1420–1438
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2027–2297
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- derechosEstatales?.discapacidadContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21067
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3931–3935
- cotizacionesTotales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- desglose.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7750
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- minimoContribuyente
    .plus(minimoDescendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63690
- caso.situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20589
- yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28263–28379
- comunidadAutonoma === "madrid" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4313
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- componente("estatal", minimoEstatal) / minoracion (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2659–2695
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario("0.35") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2399
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- {
                anio,
                base: remanente,
                componente: nombre,
              } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- cotizacionAplicada / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1112–1130
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- contexto / contexto (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- bruto / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- medirAuditoriaSync(
    "liquidacion.baseImponibleAhorro",
    () =>
      calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      })
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15785–15934
- solidaridad.trabajador / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- crearImporteMonetario(4080).minus(
          crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2448
- baseCotizacion / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20566
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2464–2470
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- componente("autonomico", minimoAutonomico) / minoracion (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2713–2755
- totalSolidaridad.div(6) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- crearImporteMonetario("0.0015") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- "0.5" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
              }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2349–2488
- importesLiquidacion / cuotaLiquidaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59673–59692
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 11250 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5147–5168
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- minimos.contribuyente / adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- rendimientoIntegroTrabajo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Contrato de llamada pendiente: dependencias.retencionTrabajoAeat.calcular; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28270–28379
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- crearImporteMonetario("0.0012") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- ["0", "0", "0"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- ["0", "0", "0"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6112
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4607–4628
- crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6078
- derechosEstatales?.ascendientes ??
    obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20801
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
           / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5544
- cotizacionesMei / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- Decimal.max(0, baseGeneral) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- {
      anio,
      base,
      componente: nombre,
    } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
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
- 0 / value (centimos, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- obtenerMinimoDiscapacidadAscendientes(
      situacionFamiliar.ascendientes,
      minimos
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63529–63625
- caso.anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17573–17590
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18212–18233
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- tiposSolidaridad[2025] / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- reduccionTrabajoHasta2014(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1428–1476
- crearImporteMonetario("1.14") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5459
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3391
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- "1.14" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5452–5458
- minimo / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- {
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      } / rendimientoIntegro (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13831–13907
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
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
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- derechosEstatales?.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20695
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- primerExceso
    .mul(tipos[0]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- parametros.baseMaxima / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- ahorroConMinimos.autonomico.despuesMinimo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25053–25094
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- escalaPublicadaAutonomica / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17848–17873
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- baseGeneral / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- ["0.0019", "0.0021", "0.0024"] / 1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- parametros / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- "autonomico" / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2724–2736
- rendimientoIntegroCapitalInmobiliario / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13861–13898
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- 0 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1001–1002
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 11250 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- 2014 / value (selector, selection); literal; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9276–9280
- cuotaIntegraGeneralAutonomica / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18811–18840
- gananciasPatrimoniales.gananciaSujetaAhorro / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–358
- 3700 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- baseCotizacion.baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63803
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1054
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- solidaridad.trabajador / 1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- tiposSolidaridad[2026] / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
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
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- "1.15625" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
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
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2050–2056
- undefined / discapacidadFamiliares (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- 4080 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2347–2351
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "1.14" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5452–5458
- derechosEstatales?.contribuyente ??
    obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstat / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20630
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- caso.comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16181–16203
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- baseMaxima.mul("0.4") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 6 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3497
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- cotizacionesMei / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- caso.retencionTrabajoAeat / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28240
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- cuotaIntegraGeneralEstatal.plus(
    cuotaIntegraGeneralAutonomica
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18774–18844
- parametrosComunidad / escalaAutonomicaIgualEstatal (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18057–18076
- VALENCIA_2014_2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3971–3989
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- totalSolidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- tiposSolidaridad / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- {
                anio,
                base: remanente,
                componente: nombre,
              } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPub / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18520–18708
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7590–7607
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- totalSolidaridad / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- reduccionRendimientosTrabajo / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–737
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- crearImporteMonetario("1.15625") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derechosAutonomicos / total (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21776
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- 2014 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1410–1414
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (centimos, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–337
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2307–2308
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / baseGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoAutonomico (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
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
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- liquidarCentimos(cuotaLiquida) / value (centimos, value); Contrato de llamada pendiente: liquidarCentimos; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28084–28114
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:661–662
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:891–892
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- excesoRestante.mul(tipos[2]) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
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
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- crearImporteMonetario(5565) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- TRAMOS_IRPF_HASTA_2014 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9294–9316
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4365–4374
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- crearImporteMonetario(6498) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5410
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:312–313
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- remanente / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- minimos.contribuyente / general (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- ({
      rendimientoIntegroTrabajoCentimos: liquidarCentimos(
        rendimientoTrabajo.rendimientoIntegro
      ),
      rendimientoNetoTrabajoCentimos: liqui / cuotaLiquidaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25551–28122
- caso.retencionTrabajoAeat !== undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28254
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- caso.comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17594–17616
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1361–1362
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.general (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- "murcia" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4519–4527
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22485–22544
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- () => [] / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- salarioBrutoAnual / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28245–28254
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- caso / rendimientos.trabajo (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22460–22464
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4033–4037
- cotizacionesOrdinarias / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- solidaridadTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4154–4175
- TRAMOS_IRPF_AHORRO_2022 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10167–10190
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- discapacidad / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3823–3827
- {
        anio: caso.anio,
        base: baseLiquidableGeneral,
      } / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18377–18448
- bruto / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3266–3271
- baseGeneral / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- !parametrosComunidad.escalaAutonomicaIgualEstatal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18056–18105
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2026–2030
- usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18143–18449
- 0 / value (centimos, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:852–853
- minimoDescendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21575–21594
- {
    salarioBrutoAnual,
    anio,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- ahorroConMinimos / autonomico.minoracion (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23365–23381
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- rendimientoCapitalInmobiliario / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15628–15658
- deduccionesAutonomicasAplicadas / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25276–25307
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoPrevioNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2101
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- salarioBrutoAnual.minus(baseOrdinaria) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- situacionFamiliar.discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3779
- 16825 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3396–3401
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- cotizacionesSociales.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13316
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20230
- calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      }) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15860–15930
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21668
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoCapitalInmobiliario.rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- anio <= 2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4049–4061
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21668
- crearImporteMonetario("3751.20") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- anio <= 2014
        ? calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2514
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- crearImporteMonetario(4080) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2352
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- situacionFamiliar.descendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63501
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- tiposSolidaridad[2026] / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- caso.situacionFamiliar / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- "1.75" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6031–6037
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimoPersonalYFamiliar / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22497–22520
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- caso / retencionTrabajoAeat (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- parametros / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:899–940
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoPrevioNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- rendimientoPrevioNeto.minus(11250) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- {
    cotizacionEmpresarial: desglose.cotizacionEmpresarial,
    cotizacionTrabajador: desglose.cotizacionTrabajador,
  } / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7634–7755
- (a, b) => b.edad - a.edad / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- CATALUNYA_2022_2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4178–4197
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4544–4548
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- remanente / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- rendimientoPrevioNeto.minus(13115) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- minimos / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- parametros.mei.trabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- rendimientoIntegro / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1420–1438
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- minimoPersonalYFamiliar / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22253–22276
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- tipos[1] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
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
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- izquierda / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- situacionFamiliar.discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- cotizacionAplicada / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1112–1130
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1402–1406
- anio / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:976–980
- Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22664–22763
- exceso.minus(baseMaxima.mul("0.1")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- solidaridadTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4154–4175
- "0.001" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublica / tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22225–22406
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- escalaPublicadaAutonomica === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17848–17887
- medirAuditoriaSync(
    "liquidacion.baseImponibleAhorro",
    () =>
      calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      })
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15785–15934
- obtenerEscalasAhorroPublicadas(anio, componente) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- derechosEstatales?.contribuyente / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20490
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20876–20976
- 0 / value (centimos, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:661–662
- excesoRestante.mul(tipos[2]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- cotizacionesSolidaridad / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
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
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24564–24565
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- a / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2980–2983
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- 2014 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1312–1316
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- tiposSolidaridad / 2025.trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- anio <= 2017 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1516–1528
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- tiposSolidaridad / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2787–2791
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3391
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4176
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- ["0.0015", "0.0017", "0.0019"] / 2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- cotizacionTrabajador / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–925
- escalasPublicadasEstatales / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22371–22397
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / pagosACuentaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28733–28737
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1443
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5069–5090
- pagosACuentaAplicadosCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59755–59784
- [
  [importe(6000), importe("0.195")],
  [importe(50000), importe("0.215")],
  [importe(Infinity), importe("0.235")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4437–4556
- crearImporteMonetario(4080).minus(
          crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
        ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2448
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- obtenerMinimoAscendientes(
    situacionFamiliar.ascendientes,
    minimos
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63087–63165
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:882–893
- cotizacionesTotales / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- salarioBrutoAnual / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- derechosEstatales?.discapacidadContribuyente ??
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21173
- 3700 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- minimos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- cotizacionesTotales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimos.contribuyente.adicionalMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5282–5303
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12384
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- caso.situacionFamiliar / discapacidad (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21143
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.neto",
    () =>
      calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoInte / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13696–13912
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoTrabajo.rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- baseCotizacion / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- tiposSolidaridad / 2026.trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- cuotaMinimoPersonalEstatal.plus(
    cuotaMinimoPersonalAutonomica
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22959–23029
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- minimo.minus(Decimal.max(0, baseGeneral)) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- pagosACuentaCentimos / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-diferencial.ts:329–349
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ahorroConMinimos.estatal.minoracion / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23319–23354
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- rendimientoPrevioNeto.minus(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- baseCotizacion.baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- incrementoMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- undefined / contribuyente (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4247–4251
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaEstatalGeneral (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- "0.0015" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
  / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18173–18340
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63148
- medirAuditoriaSync(
    "liquidacion.parametrosComunidad.obtener",
    () =>
      obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        bas / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15974–16270
- situacionFamiliar.discapacidad / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17648–17711
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2307–2308
- "0" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2975–2978
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametrosComunidad.escalaAutonomica.tramos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22781–22824
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13179–13183
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4514
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9402–9406
- anio <= 2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3943–3955
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20584
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- "17673.52" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6328–6338
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- cotizacionesSolidaridad / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- usaEscalaAutonomicaReal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24908–24931
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- baseLiquidableAhorro / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18936–18956
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4581–4629
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4810–4827
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16112–16116
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- tiposSolidaridad[2026] / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- 6 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- derechosEstatales?.discapacidadFamiliares ??
    obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).p / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21510
- crearImporteMonetario(2652) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1319–1346
- Object.values(parametros.tiposSeguridadSocial) / value (centimos, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- caso / situacionFamiliar.ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20740
- caso / rendimientos.trabajo (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- minimoContribuyente
    .plus(minimoDescendientes) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63690
- rendimientoIntegro / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1105
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- rendimientoPrevioNeto.lte("19747.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5282–5319
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- parametros.baseMaxima / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- parametros.tiposSeguridadSocial / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- obtenerTiposMei(anio) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- 16825 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3396–3401
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- b / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- obtenerMinimoAscendientes(
    situacionFamiliar.ascendientes,
    minimos
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63087–63165
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:507–519
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22278–22299
- Decimal.max(
            0,
            bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
       / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2282–2514
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- cuotaAutonomicaGeneralDespuesMinimo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25001–25036
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- rendimientoPrevioNeto.lte(13260) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2271–2303
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- tipos / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6321
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimos.contribuyente / adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4952
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- minimos.contribuyente / adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1105
- MINIMOS_ESTATALES_2013 / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 14852 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6071–6076
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2397–2401
- gananciasPatrimoniales / gananciaSujetaGeneral (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15536–15558
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.minus("14047.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5518
- escalasPublicadasAutonomicas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18670–18698
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- otrasRentasNoExentas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15317–15337
- obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fech / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16057–16266
- "0.35" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2392–2398
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- Object.values(parametros.tiposSeguridadSocial) / value (centimos, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- parametros.tiposSeguridadSocial / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3799–3803
- solidaridad.trabajador / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- excesoBase / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- tiposSolidaridad / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23154–23175
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["90000", "15908.31", ".2 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1940–2176
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- [AHORRO_2021_2022] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
- bruta.minus(despuesMinimo) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2623
- minimos.contribuyente.adicionalMayor65 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
  } / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18903–18961
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- otrasRentasNoExentas.gt(6500) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1260–1289
- rendimientoPrevioNeto.minus(11250) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1007–1025
- minimoEstatal / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2681–2694
- rendimientoPrevioNeto.lte(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3272
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16181–16185
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2833–3062
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio >= 2012 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3799–3811
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2014–2018
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1361
- rendimientoPrevioNeto.minus(11250) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- Decimal.min(
        deduccionesAutonomicasDeclaradas,
        cuotaAutonomicaGeneralDespuesMinimo.plus(
          ahorroConMinimos.autonomico.despuesMinimo
    / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24938–25112
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 7 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22732–22753
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / situacionFamiliar.descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- caso.situacionFamiliar.ascendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21470
- rendimientoPrevioNeto.minus("17673.52") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6339
- fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4556–4588
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4579–4588
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
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4342–4374
- Decimal.max(
    0,
    cuotaIntegraGeneralAutonomica.minus(cuotaMinimoPersonalAutonomica)
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24547–24641
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- derechosEstatales / contribuyente (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20475
- tiposSolidaridad[2025] / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- rendimientoPrevioNeto.minus(14852) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6077
- totalSolidaridad.div(6) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- undefined / discapacidadFamiliares (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- caso.situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21457
- incrementoMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- "1.15625" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
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
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- "0.0017" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaAhorro (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- "0.35" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2392–2398
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- Option.getOrElse(() => []) / value (centimos, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- exceso / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
    / base (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18543–18707
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- minimo.minus(Decimal.max(0, baseGeneral)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1922
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- Match.value(anio).pipe(
    Match.when(2012, () => TRAMOS_IRPF_AHORRO_2012),
    Match.when(2013, () => TRAMOS_IRPF_AHORRO_2013),
    Match.when(2014, () => TRA / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9586–10350
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- deduccionesAutonomicasDeclaradas / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24959–24991
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- bruta / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2327
- {
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublica / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22225–22406
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4625–4634
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- bruta / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2327
- Decimal.max(
    0,
    cuotaGeneralDespuesMinimo
      .plus(cuotaAhorroDespuesMinimo)
      .minus(deduccionesAutonomicasAplicadas)
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25175–25312
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- retencionTrabajoAeat?.importeRetencionAnualCentimos ?? 0 / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28632–28688
- crearImporteMonetario("1.5") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
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
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- 14852 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5801–5806
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / contribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor75 (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- parametros.mei / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- baseMaxima / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosEstatales / discapacidadContribuyente (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21040
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- "0.0024" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:726–734
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- 4080 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2347–2351
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- crearImporteMonetario("0.001") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- crearImporteMonetario(7302).minus(
          crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852))
        ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–6088
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23094–23103
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- exceso.minus(baseMaxima.mul("0.5")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- minimoDiscapacidadContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63731–63762
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1942–1963
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- 6500 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1284–1288
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2425
- "0.0021" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- minimos.contribuyente.adicionalMayor75 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5500
- baseImponibleGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15733–15753
- comunidadAutonoma === "andalucia" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3795
- minimos / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17799–17803
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- 0 / value (centimos, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1361–1362
- deduccionesAutonomicasDeclaradas / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25119–25151
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- obtenerPoliticaSolidaridad(anio) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- minimosEstatales / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3888
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- crearImporteMonetario("3803.70").mul(12) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- Decimal.max(0, base) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- parametros.solidaridad / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- cuotaIntegraAhorro / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24701–24719
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (centimos, value); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6321
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1790–1811
- cuotaIntegraGeneral.minus(cuotaMinimoPersonal) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24450–24496
- resultadoParametrosComunidad / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16390–16418
- minimoPersonalYFamiliar.mul(0) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22898–22928
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- minimo(bruto, parametros.baseMaxima) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- parametros / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- calcularAhorroConMinimos({
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamili / autonomico.despuesMinimo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23057–23282
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- "17673.52" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5931–5941
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2064–2085
- baseLiquidableGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22522–22543
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- rendimientoCapitalInmobiliario / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–788
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9224–9228
- baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- TRAMOS_IRPF_2015 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9351–9367
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- reduccionRendimientosTrabajo ?? 0 / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–742
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- parametrosComunidad.minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- crearImporteMonetario("3751.20").mul(12) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- retencionTrabajoAeat?.importeRetencionAnualCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28632–28683
- discapacidad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- {
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaA / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22648–22890
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- reduccionTrabajo2023(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1847–1890
- comunidadAutonoma === "andalucia" && anio >= 2012 && anio <= 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3827
- rendimientoPrevioNeto.minus(9180) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2437
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16096–16265
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- calcularCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: baseLiquidableGeneral,
      }) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18347–18449
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- derechosEstatales?.contribuyente ??
    obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstat / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20630
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- parametros / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3923–3927
- 7302 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5986–5990
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
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- tramosIrpfEstatalGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18251–18275
- obtenerMinimoDiscapacidadAscendientes(
        caso.situacionFamiliar.ascendientes,
        minimosEstatales
      ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21388–21504
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- cuotaLiquidaCentimos - retencionesSoportadasCentimos / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-diferencial.ts:274–326
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- gananciasPatrimoniales.gananciaSujetaGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14664–14708
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- derechosAutonomicos?.total / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21783
- parametros / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- comunidadAutonoma === "madrid" &&
    anio === 2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4334
- parametros / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- "2364.34" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6225–6234
- calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
              }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2349–2488
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- minimos.contribuyente / general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- baseMaxima.mul("0.1") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    }) / value (selector, selection); Contrato de llamada pendiente: Option.match; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4136–4281
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- baseLiquidableGeneral.mul(0) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18715–18743
- tipos[2] / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 2020 / value (selector, selection); literal; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9410–9414
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2101
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5795–5856
- situacionFamiliar.discapacidad / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
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
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4049–4053
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadContribuyente (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- minimoAscendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63701–63719
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- MINIMOS_ESTATALES_2013 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- reduccionTrabajoHasta2014(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1428–1476
- minimoBase / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- Decimal.max(
            0,
            bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
       / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2282–2514
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- reduccionRendimientosTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15590–15618
- bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
           / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2502
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3162–3183
- rendimientoCapitalInmobiliario.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14653
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17720–17729
- familiares / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }) / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1033
- solidaridad / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- anio <= 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3815–3827
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2072–2076
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6392–6404
- meiTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4127–4140
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(4080) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2187–2214
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–925
- TRAMOS_IRPF_HASTA_2014 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9294–9316
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }) / cotizacionTrabajador (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1033
- medirAuditoriaSync(
    "liquidacion.importesLiquidacion.redondeos",
    () => ({
      rendimientoIntegroTrabajoCentimos: liquidarCentimos(
        rendimiento / cuotaLiquidaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25472–28126
- {
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaA / tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22648–22890
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    }) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4657–4772
- componente("autonomico", minimoAutonomico) / despuesMinimo (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2713–2755
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- minimoDiscapacidadContribuyente / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63731–63762
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23094–23098
- tiposSolidaridad / 2025.trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- {
    estatal: componente("estatal", minimoEstatal),
    autonomico: componente("autonomico", minimoAutonomico),
  } / autonomico.despuesMinimo (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2644–2760
- Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro) / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:300–359
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5500
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- minimos / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro) / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:300–359
- crearImporteMonetario(6498) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5198–5225
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
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(4080) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2352
- minimos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- 2014 / value (selector, selection); literal; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9276–9280
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- tipos[1] / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- izquierda / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- parametros.mei.trabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- caso.comunidadAutonoma !== "simulada-estatal" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17594–17639
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- TRAMOS_IRPF_AHORRO_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4285–4308
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- { fechaFallecimiento, rendimientoPrevioNeto } / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1652–1697
- "0.0012" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1946–1950
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- comunidadAutonoma === "madrid" &&
    anio === 2025 &&
    fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4374
- desglose.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7750
- totalSolidaridad.div(6) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- caso.rendimientos / trabajo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- parametrosComunidad.escalaAutonomica.tramos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18598–18641
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
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- izquierda.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- caso.rendimientos.trabajo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => crearImporteMonetario(73 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5685–6409
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63518
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Decimal.max(0, base.minus(remanente)) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2188–2225
- baseMaxima.mul("0.5") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
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
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1316
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (centimos, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cuotaMinimoPersonalAutonomica / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24607–24636
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      anio,
      base,
      componente: nombre,
    } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- caso.pagosACuentaCentimos + retencionTrabajoAeatCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28733–28789
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- ascendientes / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1674–1695
- minimos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.minus("17673.52") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6339
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- derechosEstatales?.discapacidadFamiliares / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21258
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- derechosEstatales?.contribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20490
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- caso.situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20758
- tiposSolidaridad[2025] / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2590–2781
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- TRAMOS_IRPF_AHORRO_2014 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4854–4877
- undefined / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17720–17729
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1276–1297
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- cotizacionesMei / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- parametros.tiposSeguridadSocial / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- anio >= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4033–4045
- "catalunya" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4018–4029
- parametros / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3266–3271
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4176
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:650–654
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- anio === 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5913
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- {
      anio,
      base,
      componente: nombre,
    } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- minimoContribuyente
    .plus(minimoDescendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21595
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:1636–1975
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- tipos / 2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- minimo / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
- derecha / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22664–22763
- "0.5" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- gananciaPatrimonialGeneral ?? 0 / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–853
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      }) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15860–15930
- gastosDeducibles / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1398–1414
- minimos.contribuyente / general (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- minimos.contribuyente.adicionalMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- minimoBase / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- minimos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- caso / situacionFamiliar.ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21439
- situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63016–63038
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2397–2401
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
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
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5359–5371
- {
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.ganancia / ganancias (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14069–14338
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- izquierda / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63323–63389
- caso.situacionFamiliar / descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- tramosIrpfEstatalGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22318–22342
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21375
- filas([
  ["0", "0", ".085"],
  ["13362.22", "1135.79", ".107"],
  ["19004.63", "1739.53", ".128"],
  ["35425.68", "3841.42", ".174"],
  ["57320.40", "7651.10", / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2890–3062
- undefined / discapacidadContribuyente (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- caso / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17799–17803
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18212–18233
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19990
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo, / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15459–15696
- calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:780–876
- Match.value(anio).pipe(
    Match.when(
      () => otrasRentasNoExentas.gt(6500),
      () => (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO)
    ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1208–1969
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- undefined / ascendientes (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6064
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- minimoPersonalYFamiliar / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22898–22921
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- situacionFamiliar.ascendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63148
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- 2021 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4057–4061
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- comunidadAutonoma === "catalunya" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4133
- caso / fechaFallecimiento (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- rendimientoPrevioNeto.minus(gastosDeducibles) / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1415
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- gananciaPatrimonialGeneral / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–848
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (centimos, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- minimoPersonalYFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23196–23219
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:819–823
- a / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180),
      () => crearImporteMonetario(408 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2052–2511
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- cuotaAhorroDespuesMinimo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25237–25261
- derecha.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- tipos[0] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
           / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5544
- situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- caso.rendimientos.trabajo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
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
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- primerExceso
    .mul(tipos[0]) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63323–63389
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5772
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- a / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- {
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      } / tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18196–18339
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- MINIMOS_ESTATALES_2014 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4013
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- 11250 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4607–4628
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- caso.retencionTrabajoAeat / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28324–28349
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- crearImporteMonetario("1.5") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
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
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- comunidadAutonoma === "catalunya" && anio >= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4149
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- calcularCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      }) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22414–22554
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- minimos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- Decimal.max(0, base) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- 6498 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5220–5224
- situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63591
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- 0 / value (selector, selection); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:741–742
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
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
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- crearImporteMonetario(2652) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2479–2506
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- incrementoMayor75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- derechosEstatales / discapacidadFamiliares (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21234
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6064
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20221–20230
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24694–24695
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- 2017 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1524–1528
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- rendimientoIntegro.minus(cotizacionAplicada) / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1131
- minimoPersonalYFamiliarAutonomico / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23243–23276
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- minimoBase / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- derecha.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5905–5926
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9224–9228
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- "1.14" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6275–6281
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- gastosDeducibles / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1398–1414
- minimoPersonalYFamiliarAutonomico / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22687–22720
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- reduccionAnterior / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4933–4950
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- minimo(bruto, parametros.baseMaxima) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: / minimoEstatal (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23082–23281
- gananciasPatrimoniales.gananciaSujetaAhorro / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–358
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21375
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3115–3307
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- meiTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4127–4140
- baseMaxima / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1056
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- convertirCentimosAEuros(0) / value (selector, selection); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- derechosEstatales?.descendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20868
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- ascendientes / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- 12 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- anio >= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3923–3935
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- TRAMOS_IRPF_AHORRO_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4361–4384
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
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
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (selector, selection); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- {
        anio: caso.anio,
        base: baseLiquidableGeneral,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18377–18448
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- 9180 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2432–2436
- minimoContribuyente / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21564
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:899–940
- Decimal.max(0, baseGeneral) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- izquierda.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- "14047.50" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5507–5517
- Match.value(
    fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    })
  ).pipe(
    Match.when(tr / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4640–4977
- importesLiquidacion.cuotaLiquidaCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59673–59713
- baseGeneral / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1909–1920
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2014–2018
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0 / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–810
- derechosEstatales?.discapacidadFamiliares / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21258
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- minimoPersonalYFamiliarAutonomico / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23243–23276
- reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto }) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1631–1698
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6108–6120
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- escalasPublicadasEstatales / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18304–18330
- {
                anio,
                base: remanente,
                componente: nombre,
              } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- "0.1" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- caso / retencionTrabajoAeat (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28324–28328
- caso.retencionTrabajoAeat !== undefined
      ? yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
      / importeRetencionAnualCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28397
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (centimos, value); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- crearImporteMonetario(6498) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5198–5225
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (centimos, value); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- "0.4" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- crearImporteMonetario("1.75") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6038
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- rendimientoTrabajo / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:668–686
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (selector, selection); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2271–2292
- Decimal.max(
      0,
      rendimientoPrevioNeto.minus(gastosDeducibles)
    ) / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1342–1421
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2027–2297
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- crearImporteMonetario("2364.34").minus(
          crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          )
        ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6361
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["60000", "9458.31", ".23 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1452–1653
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- reduccionNueva.minus(reduccionAnterior) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4951
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6020
- b / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- "0.1" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- parametros / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- baseLiquidableAhorro / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:23115–23135
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- reduccionNueva / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4926
- Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22241–22300
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4535–4539
- rendimientoTrabajo / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15668–15686
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- base.minus(remanente) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4161–4165
- TRAMOS_IRPF_2016_A_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9428–9451
- minimoDescendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63670–63689
- rendimientoCapitalInmobiliario.rendimientoNeto
    .plus(gananciasPatrimoniales.gananciaSujetaGeneral)
    .plus(gananciasPatrimoniales.gananciaSujetaAhorro) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14764
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- situacionFamiliar.ascendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63604
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4221
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
- 0 / value (centimos, value); literal; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:549–550
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- SIN_SOLIDARIDAD / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- cuotaLiquida / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28101–28113
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1391
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
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- TRAMOS_IRPF_AHORRO_2023 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10220–10243
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- crearImporteMonetario("1.15625") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- GASTOS_FIJOS_IRPF_LEGACY / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1183
- 2025 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4330–4334
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / cotizacionTrabajador (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17896–17905
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5359–5371
- convertirCentimosAEuros(0) / value (centimos, value); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- crearImporteMonetario("3751.20") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- tipos[2] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24443–24444
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1349–1361
- minimo / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1881–1887
- tipos / 0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- caso / situacionFamiliar.discapacidad (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- crearImporteMonetario(3700) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1790–1811
- minimoAscendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21606–21624
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- (total, tramo) => total.plus(tramo.cuota) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- Decimal.max(0, minimo.minus(Decimal.max(0, baseGeneral))) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1866–1923
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2026–2030
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- TRAMOS_IRPF_AHORRO_2015 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9796–9819
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4153–4157
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadFamiliares (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- 9180 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2432–2436
- gananciasPatrimoniales / gananciaSujetaAhorro (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15898–15920
- undefined / total (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20239–20248
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- minimoAutonomico / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2738–2754
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1370–1391
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- "0.0024" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:726–734
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- {
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaA / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22648–22890
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- solidaridad / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- derechosEstatales?.discapacidadContribuyente / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21067
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- fechaFallecimiento / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4556–4574
- "1.75" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6031–6037
- Decimal.max(0, baseGeneral) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1894–1921
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- 3700 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2097–2109
- "1.5" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (selector, selection); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- 3700 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- anio >= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4137–4149
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cuotaGeneralDespuesMinimo
      .plus(cuotaAhorroDespuesMinimo)
      .minus(deduccionesAutonomicasAplicadas) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:25199–25308
- CATALUNYA_2020_2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4074–4093
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- reduccionAnterior.plus(
        maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2)
      ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4967
- {
    estatal: componente("estatal", minimoEstatal),
    autonomico: componente("autonomico", minimoAutonomico),
  } / estatal.minoracion (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2644–2760
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63763
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaGeneral (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / reduccionRendimientosTrabajo (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1542–1590
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- calcularDesgloseCuotaPorEscala({
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:780–876
- TRAMOS_IRPF_AHORRO_2013 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9690–9713
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimient / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15117–15347
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (centimos, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- minimosEstatales / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- minimos / contribuyente.general (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- remanente / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2425–2434
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- {
      anio,
      base,
      componente: nombre,
    } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaGeneral (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- [AHORRO_2023_2024] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- caso.situacionFamiliar / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- bruta.minus(
              calcularCuotaComponenteAhorro({
                anio,
                base: remanente,
                componente: nombre,
           / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2322–2502
- rendimientoCapitalInmobiliario / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–788
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22460–22469
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- minimos / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minim / total (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20423
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (centimos, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2251–2257
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / escalaAutonomica.tramos (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6351
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18741–18742
- caso / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- situacionFamiliar / discapacidad (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- gananciasPatrimoniales / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14664–14686
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- baseMaxima.mul("0.1") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- "1.14" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6275–6281
- b / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- {
    anio: caso.anio,
    base: baseLiquidableAhorro,
  } / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18903–18961
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- minimos.contribuyente.adicionalMayor75 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- {
      anio,
      base,
      componente: nombre,
    } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- reduccionNueva.minus(reduccionAnterior) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4951
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / anio (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- ["0", "0", "0"] / 2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:882–886
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
- medirAuditoriaSync(
    "liquidacion.reduccionRendimientosTrabajo",
    () =>
      calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fe / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15033–15351
- "19747.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5308–5318
- reduccionAnterior.plus(
        maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2)
      ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4967
- caso.situacionFamiliar / discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- TRAMOS_IRPF_AHORRO_2019 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:10008–10031
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1516–1520
- comunidadAutonoma === "murcia" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4527
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- {
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16096–16265
- minimoDiscapacidadFamiliares / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21679–21707
- rendimientoIntegroCapitalInmobiliario / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13861–13898
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15898–15920
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- caso / situacionFamiliar.ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20740
- rendimientoPrevioNeto.minus("14047.50") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5518
- despuesMinimo / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2609–2622
- BASE_MAXIMA_COTIZACION_LEGACY / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- crearImporteMonetario("2364.34") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6235
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- caso / pagosACuentaCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1878–1879
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- {
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18196–18339
- Decimal.max(0, base) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1931–1951
- baseImponibleGeneral / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15733–15753
- componente === "estatal" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5786
- caso / situacionFamiliar.discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.descendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- calcularCuotaPorEscala({
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPub / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22202–22407
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- 2012 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3807–3811
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- b / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- comunidadAutonoma === "murcia" &&
    anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4548
- crearImporteMonetario("1.75") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6038
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- ["0.0015", "0.0017", "0.0019"] / 0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- bruta / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2602
- exceso.minus(baseMaxima.mul("0.1")) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- [AHORRO_2025] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularDesgloseCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio,
  }) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7541–7623
- {
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
    / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18543–18707
- "estatal" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5777–5786
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
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
- situacionFamiliar / descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63487
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- anio <= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6016–6028
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28687–28688
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- anio === 2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4321–4334
- excesoRestante / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- totalSolidaridad.div(6) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2142–2163
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaGeneral (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- usaEscalaAutonomicaReal / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18143–18166
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13218–13243
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- MURCIA_2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4604–4615
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- {
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1288–1392
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1303–1362
- derecha / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
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
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- Match.value(anio).pipe(
    Match.when(
      (anio) => anio <= 2014,
      () => TRAMOS_IRPF_HASTA_2014
    ),
    Match.when(2015, () => TRAMOS_IRPF_2015),
   / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9212–9509
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6116–6120
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- {
                  cuotaLiquidaCentimos:
                    importesLiquidacion.cuotaLiquidaCentimos,
                  pagosACuentaCentimos: pagosACuentaApli / pagosACuentaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59611–59908
- "1.5" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- {
      base,
      tramos: obtenerTramosIrpfLegacy(anio),
    } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:811–875
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18393–18402
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- [AHORRO_2025] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6157–6170
- cotizacionesSociales / cotizacionTrabajador (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13295
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- situacionFamiliar / discapacidad (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63362–63379
- {
                anio,
                base: remanente,
                componente: nombre,
              } / anio (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- "14047.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5173–5183
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
- undefined / discapacidadContribuyente (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- {
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
    / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18543–18707
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [impo / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:2343–2537
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- { base, tramos, escalasPublicadas } / tramos (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4321–4325
- base.minus(remanente) / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2203–2224
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- rendimientoPrevioNeto.lte(9180) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2142–2173
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1054
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- situacionFamiliar.ascendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63604
- calcularCuotaPorEscala({
    base,
    tramos: [],
    escalasPublicadas: obtenerEscalasAhorroPublicadas(anio, componente),
  }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1265–1393
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- caso.situacionFamiliar.descendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21345
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (centimos, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7613–7617
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- calcularCuotaComponenteAhorro({
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2120–2271
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6066
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2464–2470
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- 0 / value (centimos, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- remanente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2214–2223
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- usaEscalaAutonomicaReal
    ? Decimal.min(
        deduccionesAutonomicasDeclaradas,
        cuotaAutonomicaGeneralDespuesMinimo.plus(
          ahorroConMinimo / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24908–25151
- legacy.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / reduccionRendimientosTrabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:863–867
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3815–3819
- parametros / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5749
- otrasRentasNoExentas / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1260–1280
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- crearImporteMonetario(5565) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- parametros.baseMaxima / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- BASE_MAXIMA_COTIZACION_LEGACY / value (centimos, value); Límite explícito de recorrido; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- incrementoMayor65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- {
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublica / base (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22225–22406
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- 6 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- nombre / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2050–2056
- crearImporteMonetario(3700) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.ganancia / ganancias (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14069–14338
- crearImporteMonetario(3700) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- situacionFamiliar / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63135
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEsta / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22172–22554
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      situacionFamili / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63629
- incrementoMayor65 / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2164–2168
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5900–5904
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (centimos, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6392–6404
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- cuotaMinimoPersonalEstatal / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22959–22985
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5865–5893
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- minimoDiscapacidadFamiliares / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21679–21707
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- cuotaIntegraGeneralAutonomica / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24571–24600
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- resultadoParametrosComunidad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16390–16418
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- [escalaPublicadaAutonomica] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17914–17941
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:863–867
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- a / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minim / total (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20423
- anio / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1184–1188
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- anio <= 2014 / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9268–9280
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63518
- derechosEstatales / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20681
- tiposSolidaridad / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- reduccionTrabajoDesde2024(rendimientoPrevioNeto) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1916–1964
- crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6351
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      } / rendimientoIntegro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13831–13907
- undefined / importeRetencionAnualCentimos (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28388–28397
- 0 / value (centimos, value); literal; lib/dominio/irpf/integracion/base-imponible-general.ts:809–810
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4300
- "19747.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6170–6180
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- rendimientoTrabajo.rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15307
- derecha.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- errorDerechosMinimos / value (centimos, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- escalaPublicadaAutonomica === undefined
      ? undefined
      : [escalaPublicadaAutonomica] / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17848–17941
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derechosEstatales / discapacidadContribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21040
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- baseLiquidableGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22732–22753
- obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20703–20801
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- gananciaPatrimonialGeneral ?? 0 / value (selector, selection); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:822–853
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16112–16121
- parametrosComunidad / escalaAutonomica.tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18598–18617
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- rendimientoPrevioNeto.minus(13115) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- caso / retencionesSoportadasCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59855–59859
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- calcularCuotaComponenteAhorro({
      anio,
      base,
      componente: nombre,
    }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1976–2064
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Effect.mapError(errorDerechosMinimos) / value (selector, selection); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- izquierda.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (centimos, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- MINIMOS_ESTATALES_2014 / contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2105–2109
- baseMaxima.mul("0.5") / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- salarioBrutoAnual.minus(baseOrdinaria) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- minimoAscendientes / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21606–21624
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- rendimientoCapitalInmobiliario?.rendimientoNeto / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:758–805
- anio === 2018 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2366
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1312–1314
- derechosEstatales / descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20853
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
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- () => [] / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- parametrosComunidad / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- a / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- tiposSolidaridad[2026] / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- comunidadAutonoma === "madrid" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4234
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- solidaridad.trabajador / 2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21075–21173
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.001" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9402–9406
- 5565 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- parametrosComunidad / escalaAutonomica.tramos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22781–22800
- base.mul(0) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:882–893
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4535–4548
- cuotaIntegraGeneralAutonomica.minus(cuotaMinimoPersonalAutonomica) / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:24571–24637
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- "1.5" / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- medirAuditoriaSync(
    "liquidacion.baseImponibleGeneral",
    () =>
      calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananci / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15383–15700
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- escalasPublicadas / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- rendimientoTrabajo.rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15307
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- IMPORTE_CERO / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- reduccionRendimientosTrabajo ?? 0 / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:709–742
- minimosEstatales / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- crearImporteMonetario(5565) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2200–2201
- Match.value(anio).pipe(
    Match.when(
      (anio) => anio <= 2014,
      () => TRAMOS_IRPF_HASTA_2014
    ),
    Match.when(2015, () => TRAMOS_IRPF_2015),
   / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9212–9509
- 0 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- 0 / value (centimos, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- anio / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9598–9602
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- derechosAutonomicos?.total ??
    calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: param / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21958
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18915–18924
- calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      }) / rendimientoNeto (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13776–13908
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- caso / retencionesSoportadasCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- salarioBrutoAnual / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- {
      bruta,
      remanente,
      despuesMinimo,
      minoracion: bruta.minus(despuesMinimo),
    } / minoracion (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2526–2630
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- comunidadAutonoma === "comunitat-valenciana" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3915
- solidaridad / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- obtenerPoliticaSolidaridad(anio) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- parametros.mei / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1443
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- 6498 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5220–5224
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto. / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5341–5554
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- centimosAEuros(
                calcularCuotaDiferencialCentimos({
                  cuotaLiquidaCentimos:
                    importesLiquidacion.cuotaLiquidaC / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59546–59925
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- "3751.20" / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- minimos.contribuyente / adicionalMayor65 (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1370–1374
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Option.getOrElse(() => []) / value (centimos, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- salarioBrutoAnual / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1001–1002
- derechosEstatales / discapacidadFamiliares (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21234
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4859–4876
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => crearImporteMonetar / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5057–5602
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18393–18397
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 3700 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- solidaridad.trabajador / 0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4117
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6062–6074
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5745–5749
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5737–5741
- cotizacionesOrdinarias / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- caso.situacionFamiliar / ascendientes (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- cuotaMinimoPersonalAutonomica / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22996–23025
- rendimientos / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- legacy / baseOrdinaria (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180)) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2438
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- caso / situacionFamiliar.discapacidad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21125
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- escalasPublicadasAutonomicas / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:18670–18698
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => crearImporteMonetar / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5057–5602
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6070–6074
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.1 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- [AHORRO_2016_2020] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- crearImporteMonetario("1.5") / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- 0 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- rendimientoPrevioNeto.lte("17673.52") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5905–5942
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (centimos, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- baseCotizacion.baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- obtenerEscalasAhorroPublicadas(anio, componente) / value (centimos, value); Retornos/guardas imperativas requieren contrato: obtenerEscalasAhorroPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1339–1387
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5697–5718
- undefined / descendientes (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- calcularCuotaComponenteAhorro({
      anio,
      base,
      componente: nombre,
    }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1976–2064
- izquierda.cotizacionTrabajador / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20703–20801
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
- cuotaLiquidaCentimos - retencionesSoportadasCentimos - pagosACuentaCentimos / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-diferencial.ts:274–349
- crearImporteMonetario(5565) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4581–4629
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- new Decimal(valor) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerPoliticaSolidaridad(anio) / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- componente / value (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1376–1386
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor75 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- TRAMOS_IRPF_AHORRO_2020 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4209–4232
- rendimientos / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:507–519
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014] / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5762–5893
- obtenerPoliticaSolidaridad(anio) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- derechosEstatales / ascendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20681
- errorDerechosMinimos / value (selector, selection); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- b / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- cotizacionesSolidaridad / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- legacy.baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- caso / situacionFamiliar.discapacidad (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21125
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (centimos, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- minimoPersonalYFamiliar / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22497–22520
- 5565 / value (centimos, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- a / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadContribuyente (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- totalSolidaridad / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4952
- comunidadAutonoma === "catalunya" && anio >= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4045
- minimos / contribuyente.general (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (centimos, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- {
            anio,
            base: Decimal.max(0, base.minus(remanente)),
            componente: nombre,
          } / base (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2150–2270
- valor / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cotizacionesTotales / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseMaxima.mul("0.1") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- crearImporteMonetario(7302).minus(
          crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852))
        ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5964–6088
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (centimos, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- cotizacionesSolidaridad / cotizacionTrabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (centimos, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5926–6009
- parametros / solidaridad (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21625
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- bruta.minus(despuesMinimo) / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2597–2623
- [AHORRO_2016_2020] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6037–6055
- segundoExceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1294–1298
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor75 (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- [AHORRO_2021_2022] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6083–6101
- Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22241–22300
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (centimos, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1764–1812
- parametrosComunidad / minimosAutonomicos.contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- minimos.contribuyente / adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:5909–5913
- crearImporteMonetario(0) / value (centimos, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- baseOrdinaria / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (centimos, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- { base, tramos, escalasPublicadas } / escalasPublicadas (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- familiares / value (centimos, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- cotizacionTrabajador ??
    calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–1054
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- {
        anio: caso.anio,
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:22444–22553
- medirAuditoriaSync(
    "liquidacion.reduccionRendimientosTrabajo",
    () =>
      calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fe / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15033–15351
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- tiposSolidaridad[2025] / trabajador.2 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- base / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (centimos, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoTrabajo.rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- ANDALUCIA_2012_2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3840–3859
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- tiposSolidaridad[2026] / trabajador.0 (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- "catalunya" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4122–4133
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- [AHORRO_2023_2024] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6129–6147
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / escalaAutonomicaIgualEstatal (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- [] / value (centimos, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  ) / value (centimos, value); productor; lib/dominio/irpf/integracion/base-imponible-general.ts:644–747
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- obtenerEscalaAutonomicaPublicada(caso) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalaAutonomicaPublicada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17766–17804
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1906–1907
- 5 / value (centimos, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4153–4165
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- {
                  cuotaLiquidaCentimos:
                    importesLiquidacion.cuotaLiquidaCentimos,
                  pagosACuentaCentimos: pagosACuentaApli / retencionesSoportadasCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59611–59908
- totalSolidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:17573–17582
- TRAMOS_IRPF_DESDE_2021 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9482–9504
- minimoEstatal / value (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2681–2694
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:1943–1944
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor65 (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1454–1475
- (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1303–1362
- {
                anio,
                base: remanente,
                componente: nombre,
              } / componente (selector, selection); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2379–2487
- caso.situacionFamiliar / descendientes (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21331
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- rendimientoPrevioNeto / value (centimos, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1276–1297
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.general (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- crearImporteMonetario(6498) / value (centimos, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5410
- retencionTrabajoAeatCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28761–28789
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- solidaridad / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- {
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalIn / rendimientoCapitalInmobiliario.rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15488–15695
- minimoDescendientes / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21575–21594
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
- obtenerTramosIrpfLegacy(anio) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:839–868
- tramos / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
      anio,
      base,
      componente: nombre,
    } / base (centimos, value); productor; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:2006–2063
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:6024–6028
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- MADRID_2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4390–4401
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- baseMaxima / value (centimos, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- TRAMOS_IRPF_AHORRO_2018 / value (centimos, value); productor; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:9955–9978
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (centimos, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- minimoBase / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 0 / value (centimos, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493

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
