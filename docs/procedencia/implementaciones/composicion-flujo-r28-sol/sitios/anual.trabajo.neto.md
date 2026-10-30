# anual.trabajo.neto

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: `max(0, ${euros(rendimientoTrabajo.rendimientoPrevioNeto)} - ${euros(rendimientoTrabajo.gastosDeducibles)})`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
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
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExc / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4396–4607
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: cre / value (EUR, value); Matcher no admitido; lib/dominio/laboral/cotizaciones-sociales.ts:4295–4943
- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase).pipe(
        Match.when(
          (ex / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:5640–6791
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
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
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImport / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:1919–2516
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- GASTOS_FIJOS_IRPF_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1159–1189
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/laboral/cotizaciones-sociales.ts:3252–3412
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- Match.valueTags(parametros.solidaridad, {
    SinSolidaridad: () => IMPORTE_CERO,
    ConSolidaridad: (politica) =>
      Match.value(baseCotizacion.excesoBase) / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/laboral/cotizaciones-sociales.ts:5600–6792
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/laboral/cotizaciones-sociales.ts:3346–3408
- Object.values(parametros.tiposSeguridadSocial) / value (EUR, value); Contrato de llamada pendiente: Object.values; lib/dominio/laboral/cotizaciones-sociales.ts:3276–3322
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
## Condiciones por relación

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

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
