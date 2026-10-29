# anual.trabajo.reduccion

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: `Reducción estatal; otras rentas netas no exentas antes de compensaciones: ${euros(otrasRentasNoExentas)}`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1942–1963
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- excesoRestante / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3261
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- segundoExceso.mul(tipos[1]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- ["0.0015", "0.0017", "0.0019"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- tipos[2] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- tiposSolidaridad[2025] / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1054
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- reduccionNueva / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4926
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1361
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- reduccionNueva / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4926
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15172–15176
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
- tiposSolidaridad[2026] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
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
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.minus(11250) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- rendimientoTrabajo.rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15307
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- reduccionNueva.minus(reduccionAnterior) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4951
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
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
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
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
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
 / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13460–13650
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5359–5371
- 11250 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- tipos / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- tiposSolidaridad[2025] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1738–1742
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
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
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- "0.0019" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- tiposSolidaridad[2026] / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- "2364.34" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6225–6234
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
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
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- { fechaFallecimiento, rendimientoPrevioNeto } / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1652–1697
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- "3751.20" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- rendimientoPrevioNeto.minus(9180) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2437
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- tipos[1] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4533–4554
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- 6498 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5405–5409
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3261
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5775–5796
- totalSolidaridad.div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4581–4629
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- reduccionAnterior / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4933–4950
- rendimientoPrevioNeto.lte(16825) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3402
- tiposSolidaridad / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- ["0.0019", "0.0021", "0.0024"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- tiposSolidaridad / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5532
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6392–6404
- crearImporteMonetario("3803.70").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- ["0.0015", "0.0017", "0.0019"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- baseMaxima.mul("0.4") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15172–15181
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4607–4628
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- 6498 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5405–5409
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / rendimientoIntegro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- ({
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
}) / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1376–1442
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- crearImporteMonetario("3803.70") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 2022 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1746–1750
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
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
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario("1.75").mul(rendimientoPrevioNeto.minus(14852)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6078
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- "0.0021" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- crearImporteMonetario(4080).minus(
          crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180))
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2448
- tiposSolidaridad / 2026.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- reduccionTrabajoHasta2014(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1428–1476
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- solidaridad / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
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
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
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
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1454–1475
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3162–3183
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2404–2425
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- rendimientoPrevioNeto.minus("14047.50") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5518
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- "14047.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5507–5517
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1868–1889
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- cotizacionAplicada / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1112–1130
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- medirAuditoriaSync(
    "liquidacion.reduccionRendimientosTrabajo",
    () =>
      calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fe / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15033–15351
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1674–1695
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto.lte("14047.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5147–5184
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- solidaridad / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- ["0.0015", "0.0017", "0.0019"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1220–1224
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- parametros.solidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- desglose / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7729
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- solidaridad.trabajador / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- primerExceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- {
    salarioBrutoAnual,
    anio,
  } / salarioBrutoAnual (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- cotizacionesSociales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13316
- crearImporteMonetario("3751.20").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- {
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
} / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1377–1441
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
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
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
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- crearImporteMonetario(2652) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1319–1346
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- ["0.0019", "0.0021", "0.0024"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- 5565 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3488–3492
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5532
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1868–1889
- reduccionTrabajo2023(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1847–1890
- tiposSolidaridad / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- rendimientoTrabajo / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15285
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- ["0.0019", "0.0021", "0.0024"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / otrasRentasNoExentas (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- "0.5" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- reduccionAnterior / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4810–4827
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- parametros.solidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- crearImporteMonetario("0.0013") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3497
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
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
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimient / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15117–15347
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- SIN_SOLIDARIDAD / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- 5 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
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
- rendimientoPrevioNeto.lte(16825) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3402
- cotizacionesSociales / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13295
- "0.0017" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- legacy.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
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
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- tiposSolidaridad[2025] / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- "0.0019" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- SIN_SOLIDARIDAD / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- ["0.0015", "0.0017", "0.0019"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => crearImporteMonetario(73 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5685–6409
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio <= 2022 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1738–1750
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- tipos / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2980–2983
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2357
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- tipos[0] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- ["0", "0", "0"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- 13260 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2297–2302
- crearImporteMonetario(4080) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2325–2352
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- derecha.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- ["0.0019", "0.0021", "0.0024"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:549–550
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- crearImporteMonetario(4080) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2187–2214
- baseOrdinaria.mul(parametros.mei.trabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
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
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- crearImporteMonetario("1.5") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- gananciasPatrimoniales.gananciaSujetaAhorro / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14720–14763
- rendimientoPrevioNeto.lte(14852) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5775–5807
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- excesoRestante.mul(tipos[2]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- solidaridad.trabajador / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- crearImporteMonetario("1.15625") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- solidaridad / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- ["0", "0", "0"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- 9180 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2168–2172
- rendimientoIntegro.minus(cotizacionAplicada) / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1131
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- solidaridad.trabajador / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1568–1589
- cotizacionesTotales / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ganancias / value (selector, selection); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4898–4910
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
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
- crearImporteMonetario("3803.70") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- crearImporteMonetario("1.75") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6009–6038
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4507–4555
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporteMonetario("1.14") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5459
- "0" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
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
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- contexto.modo === "canonico" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12821
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- "1.5" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- legacy / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- ["0", "0", "0"] / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- gananciasPatrimoniales / gananciaSujetaAhorro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14720–14742
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoIntegro.minus(cotizacionAplicada) / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1131
- "1.15625" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- baseMaxima.mul("0.1") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6145–6166
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1007–1025
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- 7302 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5843–5847
- rendimientoPrevioNeto.minus(14852) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6077
- crearImporteMonetario("1.5") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- rendimientoPrevioNeto.lte(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3272
- rendimientoPrevioNeto.lt("19747.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6145–6181
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4085–4285
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
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
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1402–1414
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- "14047.50" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5507–5517
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
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
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => crearImporteMonetar / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5057–5602
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- cotizacionesTotales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- desglose.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7750
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5500
- cotizacionAplicada / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1112–1130
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
- solidaridad.trabajador / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- totalSolidaridad.div(6) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5147–5168
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- ["0", "0", "0"] / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- ["0", "0", "0"] / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- "1.14" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5452–5458
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
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2705
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
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
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- primerExceso
    .mul(tipos[0]) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- primerExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- rendimientoIntegroCapitalInmobiliario / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13861–13898
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- tiposSolidaridad / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
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
- tiposSolidaridad[2026] / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporteMonetario(5565) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 6 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- cotizacionesMei / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- tipos / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- totalSolidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- tiposSolidaridad / 2026.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- desglose / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7729
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7590–7607
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- cotizacionesMei / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- 2014 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1410–1414
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6043–6064
- cotizacionesMei / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- rendimientoPrevioNeto.minus(13115) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
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
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- crearImporteMonetario(6498) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5410
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- "0.35" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2392–2398
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
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- "0.0012" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7590–7607
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- cotizacionesOrdinarias / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- solidaridadTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4154–4175
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3266–3271
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- {
    salarioBrutoAnual,
    anio,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7584–7622
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- tiposSolidaridad[2026] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- 16825 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3396–3401
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
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "1.15625" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- tiposSolidaridad[2026] / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
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
- {
    cotizacionEmpresarial: desglose.cotizacionEmpresarial,
    cotizacionTrabajador: desglose.cotizacionTrabajador,
  } / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7634–7755
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
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
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1402–1406
- anio / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:976–980
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- exceso.minus(baseMaxima.mul("0.1")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- crearImporteMonetario(3700).minus(
          crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–3019
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3581
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
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- 2014 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1312–1316
- bruto / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- anio <= 2017 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1516–1528
- tiposSolidaridad / 2025.trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2787–2791
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3370–3391
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4176
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5069–5090
- cotizacionesTotales / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- cotizacionesTotales / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- cotizacionesTotales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5282–5303
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- 7302 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5986–5990
- caso.rendimientos.trabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- salarioBrutoAnual.minus(baseOrdinaria) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
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
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- rendimientoPrevioNeto.minus(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- Match.value(anio).pipe(
    Match.when(
      () => otrasRentasNoExentas.gt(6500),
      () => (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO)
    ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1208–1969
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
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
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- cotizacionesSolidaridad / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1674–1695
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- "1.15625" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- rendimientoPrevioNeto.lte("19747.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5282–5319
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- "3751.20" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- 2 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4957–4958
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 2652 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1341–1345
- 16825 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3396–3401
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- rendimientos / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:507–519
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- rendimientoPrevioNeto.lte(13260) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2271–2303
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- tipos / 0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1105
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.minus("14047.50") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5518
- otrasRentasNoExentas / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15317–15337
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto. / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5341–5554
- rendimientoPrevioNeto.minus(13115) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3580
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- solidaridad.trabajador / 1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- excesoBase / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- tiposSolidaridad / 2025.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
- otrasRentasNoExentas.gt(6500) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1260–1289
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- rendimientoIntegro / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1007–1025
- rendimientoPrevioNeto.lte(13115) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3240–3272
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cotizacionesTotales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- crearImporteMonetario("1.5") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- 6498 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5220–5224
- 7 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- cotizacionesSociales.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13275–13316
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- tiposSolidaridad[2025] / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8274
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2975–2978
- cotizacionesSolidaridad / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- tipos / 2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
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
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
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
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- 13115 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- 14852 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5801–5806
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => crearImporteMonetario(55 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3150–3651
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => crearImporteMonetario(37 / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2594–3067
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- crearImporteMonetario("1.14") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5430–5459
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- solidaridad.trabajador / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- exceso.minus(baseMaxima.mul("0.5")) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- 6500 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1284–1288
- "0.0021" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
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
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- cotizacionesSolidaridad / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1790–1811
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- crearImporteMonetario("3803.70").mul(12) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- minimo(bruto, parametros.baseMaxima) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- "17673.52" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5931–5941
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2064–2085
- baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- crearImporte(0) / value (selector, selection); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4952
- cotizacionTrabajador ??
    calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }).cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–1054
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("3751.20").mul(12) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }) / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1033
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
- crearImporteMonetario("1.15625") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- baseOrdinaria.mul(parametros.mei.trabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- gananciasPatrimoniales.gananciaSujetaGeneral / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14664–14708
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    }) / value (selector, selection); Contrato de llamada pendiente: Option.match; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4136–4281
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- tiposSolidaridad[2025] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2835
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3162–3183
- rendimientoCapitalInmobiliario.rendimientoNeto / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14607–14653
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- solidaridad / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- calcularCotizacionesSocialesLegacy({
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    }) / cotizacionTrabajador (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:933–1033
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2072–2076
- "1.5" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- cotizacionTrabajador / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–925
- crearImporteMonetario("1.15625") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–2945
- fallecidoAntesDeFechaCivil({
      fechaCorte: FECHA_CORTE_REDUCCION_TRABAJO_2018,
      fechaFallecimiento,
    }) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4657–4772
- parametros.tiposSeguridadSocial / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5479–5500
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- ["0.0015", "0.0017", "0.0019"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- { fechaFallecimiento, rendimientoPrevioNeto } / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1652–1697
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 11250 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2710–2715
- totalSolidaridad.div(6) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
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
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- crearImporteMonetario(2652) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2479–2506
- caso / rendimientos.trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- baseMaxima.mul("0.5") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- anio <= 2014 / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1304–1316
- "0.0015" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
           / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5544
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- rendimientoPrevioNeto.lte(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2684–2716
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.minus("17673.52") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6300–6339
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1276–1297
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
- ["0", "0", "0"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3266–3271
- rendimientoPrevioNeto / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1276–1297
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
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
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1087–1105
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- "0.5" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- reduccionTrabajo2018({ fechaFallecimiento, rendimientoPrevioNeto }) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1631–1698
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoTrabajo / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15285
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- totalSolidaridad.div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5359–5371
- {
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.ganancia / ganancias (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14069–14338
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2984
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- 11250 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- segundoExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- derecha / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3286–3313
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- a / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- baseCotizacion.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- rendimientoPrevioNeto.minus(11250) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- rendimientoPrevioNeto.minus(11250) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2963–2997
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- tipos[0] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:292–293
- 5565 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3308–3312
- crearImporteMonetario(6498).minus(
            crearImporteMonetario("1.14").mul(
              rendimientoPrevioNeto.minus("14047.50")
            )
           / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5383–5544
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- "1.14" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6275–6281
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4898–4910
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4607–4628
- parametros / solidaridad (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- parametros / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("0.0015") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- crearImporteMonetario("1.5") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3513–3541
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
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
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador)
      .plus(solidaridadTrabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4176
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- 2652 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2501–2505
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.neto",
    () =>
      calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoInte / rendimientoNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13696–13912
- 13115 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- 2017 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1524–1528
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- crearImporteMonetario("0.35").mul(rendimientoPrevioNeto.minus(9180)) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2370–2438
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
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
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5905–5926
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- {
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        / rendimientoPrevioNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15156–15346
- 3700 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2890–2894
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 14450 / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2840–2845
- meiTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4127–4140
- crearImporteMonetario(3700) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- convertirCentimosAEuros(0) / value (selector, selection); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseMaxima.mul("0.5") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
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
- b / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:344–345
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoPrevioNeto (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- "0.1" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- "0.4" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- 12 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2271–2292
- a / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- "0.1" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- crearImporteMonetario("3751.20") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- reduccionTrabajo2015A2017(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1542–1590
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
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
- "0.0013" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- SIN_SOLIDARIDAD / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- a / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:360–361
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- crearImporteMonetario("3751.20") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- tipos[2] / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
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
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 4080 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2209–2213
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- "0.0024" / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:726–734
- new Decimal(valor) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tipos / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- ["0.0019", "0.0021", "0.0024"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5585–5597
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- 13115 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3574–3579
- "1.5" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (selector, selection); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3634–3646
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- rendimientoPrevioNeto.lte(14450) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2814–2846
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- crearImporteMonetario("1.14") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6282
- a.greaterThan(b) / value (selector, selection); Contrato de llamada pendiente: a.greaterThan; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:330–346
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- obtenerTiposMei(anio) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- maximo(IMPORTE_CERO, reduccionNueva.minus(reduccionAnterior)).div(2) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4891–4959
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario("2364.34") / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6235
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- exceso.minus(baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporteMonetario("1.15625").mul(
            rendimientoPrevioNeto.minus(11250)
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2913–3009
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2606–2627
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
- crearImporteMonetario("0.0015") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- Object.values(parametros.tiposSeguridadSocial) / value (selector, selection); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:905–925
- gananciasPatrimoniales / gananciaSujetaGeneral (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14664–14686
- crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3593
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso / rendimientos.trabajo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- reduccionNueva.minus(reduccionAnterior) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4912–4951
- {
      anio,
      salarioBrutoAnual: rendimientoIntegro,
    } / anio (selector, selection); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:968–1032
- "19747.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5308–5318
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- anio / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1516–1520
- 11250 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2991–2996
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1056
- caso.rendimientos / trabajo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2730–2757
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- crearImporteMonetario(3700) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2868–2895
- calcularDesgloseCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio,
  }) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7541–7623
- {
    anio,
    salarioBrutoAnual,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1349–1361
- excesoRestante / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2142–2163
- excesoBase / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13218–13243
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
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
- "1.5" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3535–3540
- desglose.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7721–7750
- crearImporteMonetario("0.001") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8260
- "14047.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5173–5183
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
- tiposSolidaridad[2025] / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- rendimientoPrevioNeto.lte(9180) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2142–2173
- crearImporteMonetario("2364.34").minus(
          crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          )
        ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6203–6361
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3546–3567
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7613–7617
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- obtenerPoliticaSolidaridad(anio) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- legacy.baseOrdinaria / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- otrasRentasNoExentas / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1260–1280
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- 6 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- b / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:392–393
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- crearImporteMonetario("1.14").mul(
            rendimientoPrevioNeto.minus("17673.52")
          ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6253–6351
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- parametros / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- cotizacionTrabajadorOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4114
- 0 / value (selector, selection); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- "0.4" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- tiposSolidaridad / 2026.trabajador.2 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      } / rendimientoIntegro (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13831–13907
- 0 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- "19747.50" / value (selector, selection); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6170–6180
- "1.75" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:6031–6037
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- rendimientoTrabajo.rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15267–15307
- "1.15625" / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2935–2944
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- primerExceso
    .mul(tipos[0]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- 4080 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2347–2351
- exceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- salarioBrutoAnual.minus(baseOrdinaria) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- anio === 2018 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2366
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- parametros.mei.trabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- rendimientoIntegroTrabajo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
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
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- parametros.mei / trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
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
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- parametros.solidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
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
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- 7 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- 3700 / value (EUR, value); literal; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:2752–2756
- izquierda / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- cotizacionesOrdinarias / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- reduccionRendimientosTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:34584–34612
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
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- rendimientoPrevioNeto.lte("17673.52") / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5905–5942
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5697–5718
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- crearImporteMonetario(7302) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5821–5848
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (selector, selection); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:4581–4629
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
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- obtenerPoliticaSolidaridad(anio) / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- Match.value(a).pipe(
    Match.when(
      (a) => a.greaterThan(b),
      () => a
    ),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:280–398
- cotizacionesSolidaridad / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8840–8863
- (anio <= 2014 ? crearImporteMonetario(2652) : IMPORTE_CERO) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1303–1362
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- valor / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3442–3454
- baseMaxima.mul("0.1") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- crearImporteMonetario(6498) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:5198–5225
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- segundoExceso / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- salarioBrutoAnual / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
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
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- maximo(
          IMPORTE_CERO,
          crearImporteMonetario(5565).minus(
            crearImporteMonetario("1.5").mul(rendimientoPrevioNeto.minus(13115))
   / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3424–3603
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- reduccionTrabajo2019A2022(rendimientoPrevioNeto) / value (EUR, value); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1764–1812
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario(5565) / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3466–3493
- totalSolidaridad / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- rendimientoPrevioNeto / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:1454–1475
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- IMPORTE_CERO / value (selector, selection); productor; lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts:3050–3062
- solidaridad / trabajador.1 (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- izquierda.cotizacionTrabajador / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- crearImporteMonetario(0) / value (selector, selection); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- crearImporteMonetario("0.0012") / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284

## Condiciones por relación

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

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
