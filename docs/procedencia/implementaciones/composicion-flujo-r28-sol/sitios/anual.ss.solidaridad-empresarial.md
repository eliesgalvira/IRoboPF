# anual.ss.solidaridad-empresarial

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: contexto.modo === "canonico"
                  ? "Suma de excesos por los tipos empresariales publicados de cada tramo"
                  : "5/6 de la cuota adicional de solidaridad"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/laboral/cotizaciones-sociales.ts:2542–2610
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- contexto / modo (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
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
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- {
  2012: crearImporteMonetario("39150.0"),
  2013: crearImporteMonetario("41108.4"),
  2014: crearImporteMonetario("43164.0"),
  2015: crearImporteMonetario("4 / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:242–875
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
- {
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/laboral/cotizaciones-sociales.ts:4670–4891
- a.lessThan(b) / value (selector, selection); Contrato de llamada pendiente: a.lessThan; lib/dominio/laboral/cotizaciones-sociales.ts:2669–2682
- BASE_MAXIMA_COTIZACION_LEGACY[anio] / value (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/laboral/cotizaciones-sociales.ts:5065–5100
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
