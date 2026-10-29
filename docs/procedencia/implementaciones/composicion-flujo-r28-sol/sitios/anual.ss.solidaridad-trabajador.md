# anual.ss.solidaridad-trabajador

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: contexto.modo === "canonico"
                  ? "Suma de excesos por los tipos del trabajador publicados de cada tramo"
                  : "1/6 de la cuota adicional de solidaridad"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- excesoRestante / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1253
- tipos[2] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1266
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- tiposSolidaridad[2026] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:618–626
- exceso.minus(baseMaxima.mul("0.5")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1112–1147
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- tiposSolidaridad[2025] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3225
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- tipos[1] / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1218–1226
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5229–5233
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- ["0.0019", "0.0021", "0.0024"] / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- tiposSolidaridad / 2026.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- crearImporteMonetario("3803.70").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- exceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:917–923
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–946
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:989–1040
- solidaridadTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3913–3934
- crearImporteMonetario("3803.70") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- "0.0019" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:706–714
- "0.0021" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:716–724
- ["0.0015", "0.0017", "0.0019"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1125–1135
- tiposSolidaridad / 2025.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- cotizacionesSolidaridad / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9496–9519
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4643–4647
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:940–945
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- "0.1" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1032–1037
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- solidaridad / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- ["0.0015", "0.0017", "0.0019"] / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:597–627
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- solidaridad.trabajador / 1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- crearImporteMonetario("3751.20").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- "canonico" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12811–12821
- tiposSolidaridad / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- "0.5" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1140–1145
- Decimal.min(
    Decimal.max(0, exceso.minus(baseMaxima.mul("0.1"))),
    baseMaxima.mul("0.4")
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:972–1071
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- SIN_SOLIDARIDAD / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4923–4938
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- "0.0017" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:608–616
- legacy.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
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
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- excesoRestante.mul(tipos[2]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1239–1267
- solidaridad.trabajador / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3253
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:925–935
- cotizacionesSolidaridad.cotizacionTrabajador / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9496–9540
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2737–2750
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
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
- solidaridad / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
- {
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
} / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6897–7006
- parametros.solidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5638
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
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / solidaridadTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- baseMaxima.mul("0.1") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1017–1038
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoEx / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4395–4608
- primerExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1170
- tiposSolidaridad / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- tipos / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1258–1263
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3204–3214
- tiposSolidaridad[2026] / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2900
- ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
}) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6896–7007
- 6 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:7001–7002
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / solidaridadTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2787–2791
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / solidaridadTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- salarioBrutoAnual.minus(baseOrdinaria) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2713–2751
- Match.value(anio).pipe(
    Match.when(2025, () => tiposSolidaridad[2025]),
    Match.when(2026, () => tiposSolidaridad[2026]),
    Match.orElse(
      () => ({ / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2775–3011
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5616–5626
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4651–4655
- Decimal.min(exceso, baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:905–947
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- "3751.20" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2428–2437
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
- repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  ) / cotizacionTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8615–8706
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- tiposSolidaridad / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2842
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2975–2978
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / solidaridadTrabajador (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
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
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2026.trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–743
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- cotizacionesSociales / solidaridadTrabajador (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:38572–38592
- tiposSolidaridad[2025] / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2647
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8927
- solidaridad / trabajador.0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3231–3242
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
- totalSolidaridad.div(6) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–7003
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4307–4311
- segundoExceso / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1213
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- cotizacionesSociales.solidaridadTrabajador / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:38572–38614
- ["0.0019", "0.0021", "0.0024"] / 2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:705–735
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) as const / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–3001
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- "0" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2985–2988
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
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- crearImporteMonetario("3751.20") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 0 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2710–2711
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
    empresa: ["0.0096", "0.0104", "0.0122"],
    trabajador: ["0.0019", "0.0021", "0.0024"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:642–740
- tipos / 0 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1180–1185
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
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- exceso.minus(baseMaxima.mul("0.1")) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1004–1039
- tiposSolidaridad / 2026.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2878–2894
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- Decimal.max(0, exceso.minus(baseMaxima.mul("0.5"))) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1097–1148
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1046–1056
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
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
- tiposSolidaridad[2025] / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2826–2848
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- parametros / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8691–8701
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- obtenerParametrosCotizacionLegacy(anio) / solidaridad (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- totalSolidaridad / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:6980–6996
- primerExceso
    .mul(tipos[0])
    .plus(segundoExceso.mul(tipos[1])) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1158–1228
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
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2698–2752
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- segundoExceso.mul(tipos[1]) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1200–1227
- "3803.70" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- 7 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  } / trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:534–632
- ({ empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] }) / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2933–2992
- {
  2025: {
    empresa: ["0.0077", "0.0083", "0.0098"],
    trabajador: ["0.0015", "0.0017", "0.0019"],
  },
  2026: {
    empresa: ["0.0096", "0.0104", "0.012 / 2025.trabajador.2 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:524–752
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- { empresa: ["0", "0", "0"], trabajador: ["0", "0", "0"] } / trabajador.1 (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2934–2991
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
- [value] sustitución de argumento exacto; e:492
- [value] receptor de operación Decimal; e:493
- [value] argumento de div; e:494
- [value] retorno de repartirCotizacionSolidaridad; e:497
- [selection] selección de función; e:8948
- [value] contexto.modo === "canonico" && (retorno de calcularDesgloseCotizacionesPerfilUniforme); e:8951
- [value] !(contexto.modo === "canonico") && (retorno de calcularDesgloseCotizacionesSocialesLegacy); e:8955
- [value] si calcular devuelve; instrumentación no transforma el valor; e:8956

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
