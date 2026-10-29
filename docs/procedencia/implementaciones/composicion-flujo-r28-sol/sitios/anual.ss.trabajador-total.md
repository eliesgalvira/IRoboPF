# anual.ss.trabajador-total

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Ordinaria trabajador + MEI trabajador + solidaridad trabajador"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- excesoRestante / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- tipos[2] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3621
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- tiposSolidaridad[2026] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- cotizacionesTotales / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9087
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- exceso.minus(baseMaxima.mul("0.5")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- tiposSolidaridad[2025] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- baseOrdinaria.mul(
    sumarTipoCotizacionLegacy(parametros, "trabajador")
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3497
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- cotizacionesSociales / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:39461–39481
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- tipos[1] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- ["0.0019", "0.0021", "0.0024"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- tiposSolidaridad / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- crearImporteMonetario("3803.70").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- crearImporteMonetario("3803.70") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8569
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- "0.0021" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- ["0.0015", "0.0017", "0.0019"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- crearImporteMonetario("0.0015") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- tiposSolidaridad / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8518
- solidaridad / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- ["0.0015", "0.0017", "0.0019"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- parametros / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8554
- solidaridad.trabajador / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- obtenerParametrosCotizacionLegacy(anio) / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseC / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8091–8348
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- crearImporteMonetario("3751.20").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- "canonico" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12811–12821
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tiposSolidaridad / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- "0.5" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- obtenerTiposMei(anio) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- SIN_SOLIDARIDAD / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- "0.0017" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- legacy.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8737–8867
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- tipos / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2980–2983
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2357
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.trabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3166–3257
- tipos[0] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- ["0", "0", "0"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
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
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- "0.0013" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3907–3915
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
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
- solidaridad.trabajador / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8312–8322
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
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
- ["0", "0", "0"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
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
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- solidaridad / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- parametros.solidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- "0.0024" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:726–734
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- contexto.modo === "canonico" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12821
- legacy / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- parametros.tiposSeguridadSocial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3321
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8286–8337
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- sumarTipoCotizacionLegacy(parametros, "trabajador") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3442–3493
- primerExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8532
- tiposSolidaridad / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- tipos / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4084–4092
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- cotizacionesMei / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8818–8833
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporteMonetario("0.0015") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4062–4093
- cotizacionesOrdinarias / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8794–8816
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / cotizacionTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- tiposSolidaridad[2026] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3606
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2787–2791
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- salarioBrutoAnual.minus(baseOrdinaria) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
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
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- tiposSolidaridad / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- cotizacionesTotales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9068–9108
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
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
- cotizacionesSociales.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:39461–39502
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4188–4200
- solidaridadTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4154–4175
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
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
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- "0.0012" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3765–3773
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- baseOrdinaria.mul(parametros.mei.trabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3593–3637
- "0.001" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3624–3631
- tiposSolidaridad[2025] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- solidaridad / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2072–2076
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- ["0.0015", "0.0017", "0.0019"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- "0.0015" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:598–606
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3468–3478
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- ["0", "0", "0"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2974–2989
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1001–1002
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8544–8558
- totalSolidaridad.div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- segundoExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- crearImporteMonetario("0.0012") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3743–3774
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8504–8575
- ["0.0019", "0.0021", "0.0024"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
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
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- baseMaxima.mul("0.5") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
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
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- crearImporteMonetario("0.001") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3602–3632
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- derecha / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7337
- {
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.p / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7161–7365
- crearImporteMonetario("3751.20") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- TIPOS_SEGURIDAD_SOCIAL_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5126–5155
- izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7362
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- tipos / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- ["0.0019", "0.0021", "0.0024"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- obtenerParametrosCotizacionLegacy(anio) / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8246–8343
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- exceso.minus(baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- tiposSolidaridad / 2026.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3419–3432
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
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- parametros.mei.trabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3636
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- {
    anio,
    salarioBrutoAnual,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- excesoBase / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3188–3198
- obtenerPoliticaSolidaridad(anio) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- tiposSolidaridad[2026] / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
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
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- tiposSolidaridad[2025] / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- cotizacionTrabajadorOrdinaria
      .plus(meiTrabajador) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4141
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- izquierda.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7319
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- cotizacionTrabajadorOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4085–4114
- "0.4" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- primerExceso
    .mul(tipos[0]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- anio === 2018 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2366
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- baseMaxima.mul("0.4") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- segundoExceso.mul(tipos[1]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- "3803.70" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- parametros.mei / trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3611–3625
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- 7 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8768–8834
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- derecha.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7330–7358
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- crearImporteMonetario("0.0013") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3885–3916
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- parametros / tiposSeguridadSocial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3290–3300
- meiTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:4127–4140
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- izquierda / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7289–7298
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3328–3340
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador. / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7160–7366
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.trabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284

## Condiciones por relación

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

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
