# anual.ss.solidaridad-empresarial

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: contexto.modo === "canonico"
                  ? "Suma de excesos por los tipos empresariales publicados de cada tramo"
                  : "5/6 de la cuota adicional de solidaridad"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- tiposSolidaridad[2025] / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- ["0.0096", "0.0104", "0.0122"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:657–687
- primerExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- cotizacionesSolidaridad / cotizacionEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9422–9445
- segundoExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- excesoRestante.mul(tipos[2]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- tipos[0] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1188
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / solidaridadEmpresarial (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1001–1002
- crearImporteMonetario("3803.70").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1109–1110
- solidaridad / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3110–3121
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- crearImporteMonetario("3803.70") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- totalSolidaridad.mul(5).div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6924–6954
- tipos[2] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- tiposSolidaridad[2025] / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- tiposSolidaridad[2026] / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- crearImporteMonetario("3751.20").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- "0.0122" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:678–686
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- "canonico" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12811–12821
- tiposSolidaridad[2025] / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1]))
    .plus(excesoRestante.mul(tipos[2])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1268
- "0.0104" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:668–676
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- ["0.0096", "0.0104", "0.0122"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:657–687
- SIN_SOLIDARIDAD / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- legacy.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4655
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1010
- "0.0077" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:550–558
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2357
- solidaridad / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3110–3121
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- tiposSolidaridad / 2026.empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- tiposSolidaridad / 2025.empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:6952–6953
- parametros.solidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- contexto.modo === "canonico" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12821
- legacy / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- tiposSolidaridad / 2025.empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- tiposSolidaridad / 2025.empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- ["0", "0", "0"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2945–2960
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1027
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1056
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- excesoBase / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3067–3077
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- "0.0096" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:658–666
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- cotizacionesSociales / solidaridadEmpresarial (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:38068–38088
- ["0.0077", "0.0083", "0.0098"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:549–579
- "0.4" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1061–1066
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- primerExceso
    .mul(tipos[0]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1189
- tiposSolidaridad / 2026.empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- tiposSolidaridad[2026] / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2787–2791
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / solidaridadEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3083–3104
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- salarioBrutoAnual.minus(baseOrdinaria) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3083–3093
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- ["0", "0", "0"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2945–2960
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / solidaridadEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- baseMaxima.mul("0.5") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1146
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- "3751.20" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- totalSolidaridad.mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6924–6947
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- segundoExceso.mul(tipos[1]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2951–2954
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- exceso.minus(baseMaxima.mul("0.5")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / solidaridadEmpresarial (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- excesoRestante / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- solidaridad / empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3110–3121
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2730
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- "0.0083" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:560–568
- cuotaSolidaridad(
    excesoBase,
    parametros.baseMaxima,
    solidaridad.empresa
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3045–3133
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- "0.5" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2072–2076
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- ["0.0096", "0.0104", "0.0122"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:657–687
- exceso.minus(baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- calcularTotalSolidaridad(baseCotizacion, parametros) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8650–8702
- ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
       / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4669–4892
- cotizacionesSociales.solidaridadEmpresarial / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:38068–38111
- solidaridadEmpresarial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3885–3907
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- tipos / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1223
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1118
- solidaridad.empresa / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3110–3129
- solidaridad.empresa / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3110–3129
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- cotizacionesSolidaridad.cotizacionEmpresarial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9422–9467
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- tipos / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
- baseMaxima.mul("0.4") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1067
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ["0.0077", "0.0083", "0.0098"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:549–579
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- ["0.0077", "0.0083", "0.0098"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:549–579
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- crearImporteMonetario("3751.20") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- tipos[1] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- solidaridad.empresa / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3110–3129
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:6945–6946
- "0.0098" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:570–578
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- {
    anio,
    salarioBrutoAnual,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- obtenerPoliticaSolidaridad(anio) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5202–5234
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.empresa.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2946–2949
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- tipos / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6924–6940
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- tiposSolidaridad[2026] / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2956–2959
- anio === 2018 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2366
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- "3803.70" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- 7 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- tiposSolidaridad / 2026.empresa.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- ["0", "0", "0"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2945–2960
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / empresa.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594

## Condiciones por relación

- [selection] binding único desde servicio anual; e:36
- [selection] ===; e:39
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
- [selection] sustitución por propiedad del argumento; e:152
- [value] argumento de max; e:202
- [value] sustitución por propiedad del argumento; e:203
- [value] receptor de operación Decimal; e:204
- [value] argumento de minus; e:206
- [value] argumento de max; e:207
- [selection] sustitución de argumento exacto; e:213
- [selection] selección de elemento; e:214
- [value] retorno de obtenerParametrosCotizacionLegacy; e:217
- [selection] sustitución por propiedad del argumento; e:226
- [selection] binding único desde servicio anual; e:338
- [selection] sustitución por propiedad del argumento; e:341
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
- [selection] selección de función; e:8813
- [value] sustitución de argumento exacto; e:8815
- [value] argumento de min; e:8816
- [value] sustitución de argumento exacto; e:8819
- [value] receptor de operación Decimal; e:8820
- [value] argumento de mul; e:8821
- [value] argumento de min; e:8822
- [value] receptor de operación Decimal; e:8824
- [selection] selecciona Match; e:8825
- [value] anio matches 2025; e:8832
- [value] ningún matcher previo (2025) && anio matches 2026; e:8839
- [value] ningún matcher previo (2025 | 2026) && else; e:8844
- [value] sustitución de argumento exacto; e:8847
- [value] argumento de mul; e:8849
- [value] receptor de operación Decimal; e:8850
- [value] argumento de max; e:8851
- [value] sustitución de argumento exacto; e:8852
- [value] receptor de operación Decimal; e:8853
- [value] sustitución de argumento exacto; e:8854
- [value] receptor de operación Decimal; e:8855
- [value] argumento de mul; e:8856
- [value] argumento de minus; e:8857
- [value] argumento de max; e:8858
- [value] argumento de min; e:8859
- [value] sustitución de argumento exacto; e:8860
- [value] receptor de operación Decimal; e:8861
- [value] argumento de mul; e:8862
- [value] argumento de min; e:8863
- [value] receptor de operación Decimal; e:8865
- [selection] selecciona Match; e:8866
- [value] anio matches 2025; e:8873
- [value] ningún matcher previo (2025) && anio matches 2026; e:8880
- [value] ningún matcher previo (2025 | 2026) && else; e:8885
- [value] sustitución de argumento exacto; e:8888
- [value] argumento de mul; e:8890
- [value] argumento de plus; e:8891
- [value] receptor de operación Decimal; e:8892
- [value] argumento de max; e:8893
- [value] sustitución de argumento exacto; e:8894
- [value] receptor de operación Decimal; e:8895
- [value] sustitución de argumento exacto; e:8896
- [value] receptor de operación Decimal; e:8897
- [value] argumento de mul; e:8898
- [value] argumento de minus; e:8899
- [value] argumento de max; e:8900
- [value] receptor de operación Decimal; e:8902
- [selection] selecciona Match; e:8903
- [value] anio matches 2025; e:8910
- [value] ningún matcher previo (2025) && anio matches 2026; e:8917
- [value] ningún matcher previo (2025 | 2026) && else; e:8922
- [value] sustitución de argumento exacto; e:8925
- [value] argumento de mul; e:8927
- [value] argumento de plus; e:8928
- [value] retorno de cuotaSolidaridad; e:8929
- [value] contexto.modo === "canonico" && (retorno de calcularDesgloseCotizacionesPerfilUniforme); e:8932
- [value] sustitución de argumento exacto; e:8933
- [value] receptor de operación Decimal; e:8934
- [value] argumento de mul; e:8935
- [value] receptor de operación Decimal; e:8936
- [value] argumento de div; e:8937
- [value] retorno de repartirCotizacionSolidaridad; e:8940
- [value] !(contexto.modo === "canonico") && (retorno de calcularDesgloseCotizacionesSocialesLegacy); e:8944
- [value] si calcular devuelve; instrumentación no transforma el valor; e:8945

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
