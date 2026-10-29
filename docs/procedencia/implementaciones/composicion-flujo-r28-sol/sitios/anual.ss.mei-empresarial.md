# anual.ss.mei-empresarial

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Base ordinaria x tipo empresarial del MEI"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- cotizacionesMei / cotizacionEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9298–9313
- obtenerTiposMei(anio) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- cotizacionesSociales / meiEmpresarial (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:37404–37424
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- crearImporteMonetario("0.005") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3552–3582
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0075" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4031–4039
- parametros.mei.empresarial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3541–3567
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ).mul(5) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2616
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- 2018 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2362–2366
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- {
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      } / salarioBrutoAnual (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12929–13017
- crearImporteMonetario("3803.70").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2595
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4156–4168
- crearImporteMonetario("3803.70") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2555–2587
- {
    anio,
    salarioBrutoAnual,
  } / salarioBrutoAnual (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- crearImporteMonetario("0.005") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3552–3582
- cotizacionesMei.cotizacionEmpresarial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:9298–9335
- crearImporteMonetario("0.0075") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4009–4040
- {
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
} / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5350–5480
- baseCotizacionPara(salarioBrutoAnual, parametros) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8008–8057
- Decimal.min(
              salarioBrutoAnual,
              crearImporteMonetario("3803.70").mul(12)
            ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2495–2609
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- obtenerTiposMei(anio) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5164–5185
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- cotizacionesSociales.meiEmpresarial / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:37404–37439
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8899–8913
- baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8404–8476
- 5 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2614–2615
- crearImporteMonetario("3751.20").mul(12) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2446
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12983–13008
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- crearImporteMonetario("0.0067") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3834–3865
- "canonico" / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12811–12821
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- parametros.mei / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8444–8458
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- crearImporteMonetario("0.0058") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3692–3723
- legacy.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2676
- ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3670–3782
- parametros.mei / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3541–3555
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2357
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4134–4208
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
}) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5349–5481
- obtenerParametrosCotizacionLegacy(anio) / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:1966–2005
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtene / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5048–5238
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- contexto.modo === "canonico" / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12821
- legacy / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2656–2662
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4156–4168
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12949
- baseOrdinaria.mul(parametros.mei.empresarial) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3523–3568
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- anio >= 2026 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3971
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2082–2099
- baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3523–3536
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresari / meiEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8878–9545
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- anio === 2018
      ? Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
      / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2676
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7)
          .plus(
            Decimal.min(
              salarioBrutoA / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2628
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5095–5099
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- crearImporteMonetario("0.0067") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3834–3865
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2000–2004
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- {
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3813–3923
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- "0.0075" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:4031–4039
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2387–2404
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- "0.0067" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3856–3864
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2522–2539
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
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- minimo(bruto, parametros.baseMaxima) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5369–5405
- "0.005" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3574–3581
- contexto / modo (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12801
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- salarioBrutoAnual / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8027–8044
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12))
          .mul(7) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2465
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- parametros.baseMaxima / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- parametros.mei.empresarial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8444–8470
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- crearImporteMonetario("0.0075") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4009–4040
- "0.0058" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3714–3722
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
- meiEmpresarial / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3846–3860
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
- ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3812–3924
- baseCotizacion.baseOrdinaria / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8404–8432
- {
    alcance: "analitico-doce-mensualidades-uniformes",
    redondeoTgss: "pendiente",
    baseOrdinaria,
    excesoBase,
    cotizacionEmpresarialOrdinaria,
  / meiEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3648–4181
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- a / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2717–2718
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- parametros / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8444–8454
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2644–2646
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- baseCotizacion / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8404–8418
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
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
- ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3530–3640
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- parametros.baseMaxima / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5404
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- {
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:4135–4207
- crearImporteMonetario("3751.20") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2406–2438
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- calcularDesgloseCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual,
  }) / baseOrdinaria (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2023–2105
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- parametros / baseMaxima (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8046–8056
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- obtenerParametrosCotizacionLegacy(anio) / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3959–3963
- ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      }) / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3985–4103
- BASE_MAXIMA_COTIZACION_LEGACY / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- b / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2680–2681
- Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  ) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2657–2750
- parametros / mei.empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:3541–3551
- {
    anio,
    salarioBrutoAnual,
  } / anio (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2066–2104
- {
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3671–3781
- medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfil / meiEmpresarial (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12706–13022
- {
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtener / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5049–5237
- 2026 / value (selector, selection); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3967–3971
- Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3479–4213
- parametros / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5383–5393
- bruto / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5376–5381
- contexto.modo / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12793–12806
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12945–12954
- (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.an / meiEmpresarial (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12792–13018
- "0.0067" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3856–3864
- crearImporteMonetario("0.0058") / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3692–3723
- "0.0058" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3714–3722
- anio === 2018 / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2353–2366
- "0.005" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-sociales.ts:3574–3581
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2443–2445
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3491–3495
- BASE_MAXIMA_COTIZACION_LEGACY / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5094
- {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mu / cotizacionEmpresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:8375–8580
- obtenerParametrosCotizacionLegacy(anio) / baseMaxima (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7943–7982
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Decimal.min(salarioBrutoAnual, crearImporteMonetario("3751.20").mul(12)) / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2375–2447
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:5180–5184
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- anio / value (selector, selection); productor; lib/dominio/laboral/cotizaciones-sociales.ts:7977–7981
- "3803.70" / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2577–2586
- 7 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2463–2464
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- {
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3531–3639
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      } / empresarial (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:3986–4102
- 12 / value (EUR, value); literal; lib/dominio/laboral/cotizaciones-perfil-uniforme.ts:2592–2594
- b / value (EUR, value); productor; lib/dominio/laboral/cotizaciones-sociales.ts:2744–2745

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
- [selection] sustitución de argumento exacto; e:153
- [selection] sustitución de argumento exacto; e:154
- [selection] sustitución de argumento exacto; e:174
- [selection] >=; e:176
- [value] sustitución de argumento exacto; e:184
- [value] constructor Decimal; e:185
- [value] retorno de crearImporteMonetario; e:186
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
- [selection] sustitución de argumento exacto; e:412
- [selection] sustitución de argumento exacto; e:413
- [selection] sustitución de argumento exacto; e:433
- [selection] >=; e:435
- [value] sustitución de argumento exacto; e:443
- [value] constructor Decimal; e:444
- [value] retorno de crearImporteMonetario; e:445
- [selection] selección de función; e:8709
- [value] receptor de operación Decimal; e:8711
- [selection] selecciona Match; e:8712
- [value] sustitución de argumento exacto; e:8713
- [value] constructor Decimal; e:8714
- [value] retorno de crearImporteMonetario; e:8715
- [value] anio matches 2023; e:8718
- [value] sustitución de argumento exacto; e:8719
- [value] constructor Decimal; e:8720
- [value] retorno de crearImporteMonetario; e:8721
- [value] ningún matcher previo (2023) && anio matches 2024; e:8724
- [value] sustitución de argumento exacto; e:8725
- [value] constructor Decimal; e:8726
- [value] retorno de crearImporteMonetario; e:8727
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:8730
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:8731
- [value] sustitución de argumento exacto; e:8732
- [value] constructor Decimal; e:8733
- [value] retorno de crearImporteMonetario; e:8734
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:8737
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:8741
- [value] retorno de obtenerTiposMei; e:8742
- [value] retorno de obtenerParametrosCotizacionLegacy; e:8745
- [value] argumento de mul; e:8749
- [value] contexto.modo === "canonico" && (retorno de calcularDesgloseCotizacionesPerfilUniforme); e:8752
- [value] receptor de operación Decimal; e:8755
- [selection] selecciona Match; e:8756
- [value] sustitución de argumento exacto; e:8757
- [value] constructor Decimal; e:8758
- [value] retorno de crearImporteMonetario; e:8759
- [value] anio matches 2023; e:8762
- [value] sustitución de argumento exacto; e:8763
- [value] constructor Decimal; e:8764
- [value] retorno de crearImporteMonetario; e:8765
- [value] ningún matcher previo (2023) && anio matches 2024; e:8768
- [value] sustitución de argumento exacto; e:8769
- [value] constructor Decimal; e:8770
- [value] retorno de crearImporteMonetario; e:8771
- [value] ningún matcher previo (2023 | 2024) && anio matches 2025; e:8774
- [selection] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:8775
- [value] sustitución de argumento exacto; e:8776
- [value] constructor Decimal; e:8777
- [value] retorno de crearImporteMonetario; e:8778
- [value] ningún matcher previo (2023 | 2024 | 2025) && anio matches (anio) => anio >= 2026; e:8781
- [value] ningún matcher previo (2023 | 2024 | 2025 | (anio) => anio >= 2026) && else; e:8785
- [value] retorno de obtenerTiposMei; e:8786
- [value] retorno de obtenerParametrosCotizacionLegacy; e:8789
- [value] argumento de mul; e:8793
- [value] !(contexto.modo === "canonico") && (retorno de calcularDesgloseCotizacionesSocialesLegacy); e:8798
- [value] si calcular devuelve; instrumentación no transforma el valor; e:8799

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
