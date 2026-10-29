# anual.explicito.cuota.autonomica

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "escala publicada Madrid(base) − escala(mínimo limitado a base)"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- MINIMOS_AUTONOMICOS_IRPF_2020.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3706–3760
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- MINIMOS_AUTONOMICOS_IRPF_2019.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3587–3622
- {
    comunidadAutonoma,
    fallecidoAntesIllesBalears: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteIllesBalearsMs,
    }),
   / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2117–2278
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3623–3640
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18010–18027
- ESCALAS_AUTONOMICAS_IRPF_2016 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:9182–9211
- {
  "simulada-estatal": escala2013({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2013",
    tramos: TRAMOS_IRPF_AUT / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:3160–8206
- comunidadAutonoma === "catalunya" && anio >= 2022 && anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4165
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3943–3947
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
    asturias: MINIMOS_ESTATALES_2021,
    "illes-balears": MINIMOS_ILLES_BA / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:1687–2109
- parametros.escalaAutonomica / tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7986–8013
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
  nombre: "Mínimos autonómicos IRPF 2020",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEARS_2020,
    catalu / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3167–3573
- ESCALAS_AUTONOMICAS_IRPF_2015 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:12154–12183
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2016,
    "illes-balears": MINIMOS_ILLES_BALEARS_2016,
    madrid: MINIMOS_MADRID_2016,
  } satisfies Readonly<
    Rec / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:2822–3041
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13634–13652
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:1976–1977
- comunidadAutonoma === "madrid" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4234
- obtenerMinimosAutonomicosIrpf2012(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5460–5512
- MINIMOS_AUTONOMICOS_IRPF_2022 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3785–3814
- {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3417–3579
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2015,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:2749–3088
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14471–14489
- MINIMOS_AUTONOMICOS_IRPF_2025.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8743–8797
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- Match.value({
    comunidadAutonoma,
    fallecidoAntesIllesBalears: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteIllesBalearsMs / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2105–2539
- MINIMOS_AUTONOMICOS_IRPF_2019 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3587–3616
- 2021 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4057–4061
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2016",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2016,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:2749–3088
- MINIMOS_AUTONOMICOS_IRPF_2020 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3706–3735
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:4133–5867
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamil / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:528–702
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5841–5858
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- {
  ...MINIMOS_AUTONOMICOS_IRPF_2025.valor["illes-balears"],
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:641–1048
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- MINIMOS_AUTONOMICOS_IRPF_2012 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3363–3392
- Match.value(
        fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        })
      ).pipe(
        Match.when( / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11158–11499
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- {
  nombre: "Mínimos autonómicos IRPF 2016",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2016,
    "illes-balears": MINIMOS_ILLES_BALEARS_2016,
    madrid / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:2768–3087
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:9212–9229
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5841–5858
- MINIMOS_AUTONOMICOS_IRPF_2022.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3785–3839
- MINIMOS_AUTONOMICOS_IRPF_2022.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3785–3839
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- ESCALA_COMUNITAT_VALENCIANA_2022_FALLECIDO_ANTES_28_OCTUBRE / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14436–14495
- ESCALAS_AUTONOMICAS_IRPF_2015["illes-balears"] / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11444–11490
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3256–3273
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13577–13594
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- MINIMOS_AUTONOMICOS_IRPF_2018.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3587–3641
- filas([
  ["0", "0", ".119"],
  ["17707.20", "2107.16", ".1392"],
  ["33007.20", "4236.92", ".1845"],
  ["53407.20", "8000.72", ".2148"],
  ["120000.20", "22304 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1688–1904
- MINIMOS_AUTONOMICOS_IRPF_2023 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2480–2509
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- ESCALAS_AUTONOMICAS_IRPF_2015[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:12154–12202
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2017_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2017_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:7662–9112
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3931–3935
- MINIMOS_AUTONOMICOS_IRPF_2022.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3785–3820
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- MINIMOS_AUTONOMICOS_IRPF_2019.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3587–3641
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2017_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2017_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:7662–9112
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7502–7510
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2014 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_ / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:3883–4288
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9056–9073
- ESCALAS_AUTONOMICAS_IRPF_2018[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:9239–9287
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13634–13652
- ESCALAS_AUTONOMICAS_IRPF_2020 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:14743–14772
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- parametros.escalaAutonomica.tramos / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7986–8020
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3943–3947
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- comunidadAutonoma === "catalunya" && anio >= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4045
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- MINIMOS_AUTONOMICOS_IRPF_2019.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3587–3641
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4013
- "catalunya" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4018–4029
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- {
      baseLiquidableGeneral,
      comunidadAutonoma,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7209–7270
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEARS_2020,
    catalunya: MINIMOS_CATALUNYA_2020_CANONICO,
    madrid: MINI / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3221–3527
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17656–17673
- base / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8305–8309
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2015,
    "illes-balears": MINIMOS_ILLES_BALEARS_2015,
    madrid: MINIMOS_MADRID_2015,
  } satisfies Readonly<
    Rec / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:2822–3041
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- filas([
  ["0", "0", ".119"],
  ["17707.20", "2107.16", ".1392"],
  ["33007.20", "4236.92", ".1845"],
  ["53407.20", "8000.72", ".2148"],
  ["120000.20", "22304 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1688–1904
- MINIMOS_ESTATALES_2025 / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:536–558
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3256–3273
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7402–7403
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- obtenerMinimosAutonomicosIrpf2016(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8355–8407
- comunidadAutonoma === "madrid" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4234
- ESCALAS_AUTONOMICAS_IRPF_2015[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:12154–12202
- filas([
  ["0", "0", ".105"],
  ["12450", "1307.25", ".12"],
  ["17707.20", "1938.11", ".14"],
  ["21000", "2399.10", ".15"],
  ["33007.20", "4200.18", ".188"], / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2212–2511
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10129–10147
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / escalaAutonomica.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- anio <= 2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4049–4061
- MINIMOS_AUTONOMICOS_IRPF_2013 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3363–3392
- {
    comunidadAutonoma,
    fechaFallecimiento,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13989–14041
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2019",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3077–3455
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- obtenerEscalaAutonomicaIrpf2012(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5809–5859
- ESCALAS_AUTONOMICAS_IRPF_2022 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14526–14555
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4544–4548
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6126–6143
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2023",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:1095–1427
- {
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:2571–2702
- anio >= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4137–4149
- {
  nombre: "Mínimos autonómicos IRPF 2017",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2017,
    "illes-balears": MINIMOS_ILLES_BALEARS_2017,
    madrid / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:2768–3087
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:8183–8200
- ESCALAS_AUTONOMICAS_IRPF_2025 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:8153–8182
- MINIMOS_AUTONOMICOS_IRPF_2014.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4420–4474
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- ESCALAS_AUTONOMICAS_IRPF_2013[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:8327–8375
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7761–7769
- MINIMOS_AUTONOMICOS_IRPF_2017.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3220–3274
- Match.value(comunidadAutonoma).pipe(
    Match.when("galicia", () =>
      Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          on / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9367–10109
- ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["illes-balears"] / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9810–9874
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- MINIMOS_AUTONOMICOS_IRPF_2015.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3220–3255
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7473–7477
- base / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8305–8309
- MINIMOS_AUTONOMICOS_IRPF_2024.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:881–935
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14556–14573
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2019_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2019_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:13270–14720
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3256–3273
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10454–10471
- [
  ...filas([
    ["0", "0", ".096"],
    ["12960.45", "1244.20", ".1146"],
    ["21028.20", "2168.76", ".1374"],
    ["35394", "4142.62", ".1822"],
  ]),
  {
 / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3107–3406
- comunidadAutonoma === "catalunya" && anio >= 2022 && anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4165
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7761–7769
- MINIMOS_AUTONOMICOS_IRPF_2015.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3220–3255
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17458–17475
- ESCALAS_AUTONOMICAS_IRPF_2016 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:9182–9211
- undefined / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8073–8082
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- parametros.escalaAutonomica.tramos / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7986–8020
- {
  nombre: "Mínimos autonómicos IRPF 2018",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEARS_2018,
    madrid / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3096–3454
- ESCALAS_AUTONOMICAS_IRPF_2019 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:14841–14870
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2023",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:1095–1427
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4544–4548
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12797–12815
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- filas([
  ["0", "0", ".085"],
  ["13362.22", "1135.79", ".107"],
  ["19004.63", "1739.53", ".128"],
  ["35425.68", "3841.42", ".174"],
  ["57320.40", "7651.10", / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2890–3062
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / minimosAutonomicos.contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- ESCALAS_AUTONOMICAS_IRPF_2021[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:14302–14350
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4013
- Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: ( / tramos (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(baseLiquidableGeneral).pipe; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11545–12099
- filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["60000", "9458.31", ".23 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1452–1653
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4625–4634
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- Match.value({
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10056–10477
- MINIMOS_AUTONOMICOS_IRPF_2017.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3220–3255
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4247–4251
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- 2021 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4057–4061
- Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    }) / value (selector, selection); Contrato de llamada pendiente: Option.match; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:2558–2703
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8128–8146
- anio >= 2012 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3799–3811
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2017,
    "illes-balears": MINIMOS_ILLES_BALEARS_2017,
    madrid: MINIMOS_MADRID_2017,
  } satisfies Readonly<
    Rec / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:2822–3041
- MINIMOS_AUTONOMICOS_IRPF_2021.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2288–2323
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- minimosIrpf / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2252–2263
- {
        baseLiquidableGeneral,
        comunidadAutonoma,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16934–17001
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- comunidadAutonoma === "madrid" &&
    anio === 2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4334
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:11794–13336
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- {
  nombre: "Mínimos autonómicos IRPF 2018",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEARS_2018,
    madrid / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3096–3454
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- {
  nombre: "Mínimos autonómicos IRPF 2021",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
    asturias: MINIMOS / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:1633–2155
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3823–3827
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14414–14431
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17260–17277
- "comunitat-valenciana" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3893–3915
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9723–9740
- {
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:2571–2702
- MURCIA_2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4604–4615
- filas([
  ["0", "0", ".085"],
  ["12960.45", "1101.64", ".107"],
  ["18433.20", "1687.22", ".128"],
  ["34360.50", "3725.91", ".174"],
  ["55596.90", "7421.04", / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2539–2711
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2324–2341
- MINIMOS_AUTONOMICOS_IRPF_2016.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3220–3255
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- Option.match({
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiqu / value (EUR, value); Contrato de llamada pendiente: Option.match; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11603–12091
- {
  nombre: "Mínimos autonómicos IRPF 2013 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MADRID_2013,
  } satis / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:2943–3230
- publicada / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8056
- anio <= 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3815–3827
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:6018–6035
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- parametros / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8366
- {
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17854–17918
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10454–10471
- MINIMOS_AUTONOMICOS_IRPF_2014.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4420–4455
- {
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18000–18064
- 2012 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3807–3811
- obtenerMinimosAutonomicosIrpf2023({
    comunidadAutonoma,
    fechaFallecimiento,
  }) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13118–13205
- {
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17854–17918
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17557–17574
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7502–7510
- {
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17083–17178
- ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025 / illes-balears.tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9810–9857
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:9269–9286
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18245–18262
- 2025 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4330–4334
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:4133–5867
- obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  }) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7426–7549
- 2016 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3951–3955
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEARS_2018,
    madrid: MINIMOS_MADRID_2018,
    "la-rioja": MINIMOS_LA_RIOJ / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3150–3408
- ESCALAS_AUTONOMICAS_IRPF_2021 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:14302–14331
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7720–7774
- obtenerMinimosAutonomicosIrpf2014(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6828–6880
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2016",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2016,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:2749–3088
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4041–4045
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3779
- MINIMOS_AUTONOMICOS_IRPF_2014 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4420–4449
- Match.value(comunidadAutonoma).pipe(
    Match.when("illes-balears", () =>
      Match.value(
        fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-1 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11077–12212
- obtenerMinimosAutonomicosIrpf2022({
    comunidadAutonoma,
    fechaFallecimiento,
  }) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13955–14042
- obtenerEscalaAutonomicaIrpf2018(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10073–10123
- obtenerEscalaAutonomicaIrpf2013(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6441–6491
- MADRID_2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4260–4271
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:8357–8374
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15138–15156
- ({
  ...escala,
  fuente,
}) / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:1868–1896
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:14773–14790
- {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14121–14283
- ESCALAS_AUTONOMICAS_IRPF_2012[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:8211–8259
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- MINIMOS_AUTONOMICOS_IRPF_2019.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3587–3622
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8771–8788
- obtenerEscalaAutonomicaIrpf2017(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9406–9456
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.an / illes-balears.tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9482–10890
- {
  nombre: "Mínimos autonómicos IRPF 2021",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
    asturias: MINIMOS / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:1633–2155
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10796–10814
- b / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7969–7970
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4153–4157
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: ( / tramos (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(baseLiquidableGeneral).pipe; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9442–9996
- {
  nombre: "Mínimos autonómicos IRPF 2012 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MADRID_2012,
  } satis / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:2943–3230
- fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4342–4374
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9462–9480
- comunidadAutonoma === "catalunya" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4133
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15114–15131
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17359–17376
- obtenerEscalaAutonomicaIrpf2023({
      comunidadAutonoma,
      fechaFallecimiento,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13537–13628
- ESCALAS_AUTONOMICAS_IRPF_2015 / illes-balears.tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11444–11473
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- {
  nombre: "Mínimos autonómicos IRPF 2019",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEARS_2019,
    madrid / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3096–3454
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- {
  nombre: "Mínimos autonómicos IRPF 2013 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MADRID_2013,
  } satis / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:2943–3230
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- new D(0) / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1970–1978
- ESCALAS_AUTONOMICAS_IRPF_2022[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14526–14574
- ESCALAS_AUTONOMICAS_IRPF_2016[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:9182–9230
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["illes-balears"] / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9810–9874
- ANDALUCIA_2012_2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3840–3859
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- comunidadAutonoma === "andalucia" && anio >= 2012 && anio <= 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3827
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:6018–6035
- {
  nombre: "Mínimos autonómicos IRPF 2014 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_CANTABRIA_2014,
    / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:3902–4287
- anio >= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4033–4045
- comunidadAutonoma === "madrid" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4313
- parametros.minimosAutonomicos.contribuyente / general (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8399
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2012 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MAD / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:2924–3231
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MADRID_2013,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliare / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3014–3184
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:9263–9280
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:14332–14349
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4365–4374
- ESCALAS_AUTONOMICAS_IRPF_2014[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:10051–10099
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4137–4141
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4033–4037
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- MURCIA_2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4604–4615
- MINIMOS_AUTONOMICOS_IRPF_2018 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3587–3616
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17864–17881
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9438–9455
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17656–17673
- ESCALAS_AUTONOMICAS_IRPF_2025 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:8153–8182
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5865–5883
- MINIMOS_AUTONOMICOS_IRPF_2025.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8743–8797
- obtenerEscalaAutonomicaIrpf2019(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10740–10790
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4145–4149
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- {
  nombre: "Mínimos autonómicos IRPF 2017",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2017,
    "illes-balears": MINIMOS_ILLES_BALEARS_2017,
    madrid / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:2768–3087
- MINIMOS_AUTONOMICOS_IRPF_2013.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3363–3398
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- MINIMOS_AUTONOMICOS_IRPF_2019 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3587–3616
- b / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7969–7970
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
  } / fechaFallecimiento (selector, selection); Propiedad no resuelta (spread/alias): fechaFallecimiento; lib/dominio/irpf/trabajo-anual/conexion.ts:7720–7774
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7732–7736
- obtenerEscalaAutonomicaIrpf2019(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10740–10790
- fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4556–4588
- ESCALAS_AUTONOMICAS_IRPF_2022[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14526–14574
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3799–3803
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:9269–9286
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEARS_2019,
    madrid: MINIMOS_MADRID_2019,
    "la-rioja": MINIMOS_LA_RIOJ / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3150–3408
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- publicada === undefined ? undefined : [publicada] / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8096
- comunidadAutonoma === "andalucia" && anio >= 2012 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3811
- comunidadAutonoma === "catalunya" && anio >= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4045
- Match.value({
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28 / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3405–3844
- fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        }) / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11179–11284
- Match.value({
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14109–14579
- {
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18000–18064
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / base (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- MINIMOS_AUTONOMICOS_IRPF_2016 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3220–3249
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- {
  "simulada-estatal": escala2012({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2012",
    tramos: TRAMOS_IRPF_AUT / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:3175–8090
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8389–8406
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9482–10890
- MINIMOS_AUTONOMICOS_IRPF_2021.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2288–2342
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3888
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- {
  "simulada-estatal": escala2014({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2014",
    tramos: TRAMOS_IRPF_AUT / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:4121–9202
- ESCALAS_AUTONOMICAS_IRPF_2014 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:10051–10080
- parametros.minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8385
- {
  "simulada-estatal": escala2015({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2015",
    tramos: TRAMOS_IRPF_AUT / illes-balears.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:4118–9368
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8071–8088
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4145–4149
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4514
- MINIMOS_AUTONOMICOS_IRPF_2023.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2480–2515
- obtenerMinimosAutonomicosIrpf2018(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9689–9741
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3815–3819
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11089–11106
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3923–3927
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17557–17574
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- MINIMOS_AUTONOMICOS_IRPF_2023 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2480–2509
- comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3935
- cuotaAutonomica / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:10857–10872
- {
  nombre: "Mínimos autonómicos IRPF 2022",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    canarias: MINIMOS_ / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:2228–2622
- "andalucia" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3784–3795
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / escalaAutonomica.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- filas([
  ["0", "0", ".085"],
  ["12960.45", "1101.64", ".107"],
  ["18433.20", "1687.22", ".128"],
  ["34360.50", "3725.91", ".174"],
  ["55596.90", "7421.04", / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2539–2711
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7502–7510
- comunidadAutonoma === "catalunya" && anio >= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4149
- obtenerMinimosAutonomicosIrpf2023({
    comunidadAutonoma,
    fechaFallecimiento,
  }) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13118–13205
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- MINIMOS_AUTONOMICOS_IRPF_2017 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3220–3249
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13995–14012
- filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["90000", "15908.31", ".2 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1940–2176
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2015,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:2749–3088
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- {
      baseLiquidableGeneral,
      comunidadAutonoma,
      fechaFallecimiento,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8034–8121
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- MINIMOS_AUTONOMICOS_IRPF_2024.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:881–916
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / base (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- anio >= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3923–3935
- anio <= 2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3943–3955
- ESCALAS_AUTONOMICAS_IRPF_2021 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:14302–14331
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14414–14431
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16975–16992
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- importe("5550") / value (EUR, value); Contrato de llamada pendiente: importe; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2345–2360
- MINIMOS_AUTONOMICOS_IRPF_2021.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2288–2323
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10390–10407
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025,
    aragon: MINIMOS_ESTATALES_2025,
    asturias: MINIMOS_ASTURIAS_2025 / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:7732–8564
- anio >= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4137–4149
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4321–4325
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4117
- comunidadAutonoma === "catalunya" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4133
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6862–6879
- {
  ...MINIMOS_AUTONOMICOS_IRPF_2025.valor["illes-balears"],
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:641–1048
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEARS_2020,
    catalunya: MINIMOS_CATALUNYA_2020_CANONICO,
    madrid: MINI / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3221–3527
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4514
- {
  "simulada-estatal": escala2014({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2014",
    tramos: TRAMOS_IRPF_AUT / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:4121–9202
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:7668–9118
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2019_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2019_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:13270–14720
- MINIMOS_AUTONOMICOS_IRPF_2024 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:881–910
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18010–18027
- MINIMOS_AUTONOMICOS_IRPF_2013 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3363–3392
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- comunidadAutonoma === "madrid" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4313
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- obtenerMinimosAutonomicosIrpf2024(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12357–12409
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3923–3927
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- parametros / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7986–7996
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- {
        baseLiquidableGeneral,
        comunidadAutonoma,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16934–17001
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18146–18163
- "5550" / value (selector, selection); literal; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2353–2359
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16736–16753
- {
  nombre: "Mínimos autonómicos IRPF 2023",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    canarias: MINIMOS_ / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:1114–1426
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4321–4325
- ESCALAS_AUTONOMICAS_IRPF_2024[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:5988–6036
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / escalaAutonomica.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3821–3838
- {
  "simulada-estatal": escala2012({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2012",
    tramos: TRAMOS_IRPF_AUT / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:3175–8090
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- MINIMOS_AUTONOMICOS_IRPF_2017.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3220–3274
- D.max(neto, 0) / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7390–7404
- anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4535–4548
- comunidadAutonoma === "murcia" &&
    anio === 2022 &&
    fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4588
- obtenerEscalaAutonomicaIrpf2022({
      comunidadAutonoma,
      fechaFallecimiento,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14374–14465
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- ESCALAS_AUTONOMICAS_IRPF_2023 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10424–10453
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / base (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- comunidadAutonoma === "murcia" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4527
- fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4556–4588
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12773–12790
- fechaFallecimiento / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4556–4574
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- comunidadAutonoma === "andalucia" && anio >= 2012 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3811
- Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    }) / value (selector, selection); Contrato de llamada pendiente: Option.match; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:2558–2703
- MINIMOS_AUTONOMICOS_IRPF_2014.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4420–4455
- comunidadAutonoma === "madrid" &&
    anio === 2025 &&
    fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4374
- MINIMOS_AUTONOMICOS_IRPF_2012.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3363–3398
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- obtenerMinimosAutonomicosIrpf2025(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14698–14750
- MINIMOS_AUTONOMICOS_IRPF_2014 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4420–4449
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3815–3819
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4049–4053
- b / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7969–7970
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- [publicada] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/trabajo-anual/conexion.ts:8085–8096
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- "catalunya" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4122–4133
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- D.max(
    0,
    autonomica(base).minus(
      autonomica(
        D.min(base, parametros.minimosAutonomicos.contribuyente.general)
      )
    )
  ) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8276–8426
- D.max(neto, 0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7390–7404
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- ESCALA_ILLES_BALEARS_2015_FALLECIDO_ANTES_31_DICIEMBRE / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11351–11405
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- ESCALAS_AUTONOMICAS_IRPF_2014 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:10051–10080
- obtenerMinimosAutonomicosIrpf2013(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6092–6144
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- MINIMOS_AUTONOMICOS_IRPF_2020.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3706–3741
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2020",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3148–3574
- obtenerMinimosAutonomicosIrpf2024(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12357–12409
- filas([
  ["0", "0", ".105"],
  ["12450", "1307.25", ".12"],
  ["17707.20", "1938.11", ".14"],
  ["21000", "2399.10", ".15"],
  ["33007.20", "4200.18", ".188"], / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2212–2511
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4535–4539
- obtenerMinimosAutonomicosIrpf2017(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9022–9074
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- ESCALAS_AUTONOMICAS_IRPF_2015 / illes-balears.tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11444–11473
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- ESCALAS_AUTONOMICAS_IRPF_2024[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:5988–6036
- comunidadAutonoma === "madrid" && anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4251
- obtenerEscalaAutonomicaIrpf2020(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11407–11457
- ESCALAS_AUTONOMICAS_IRPF_2013 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:8327–8356
- {
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: {
    pri / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2311–2817
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1935–1952
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- ESCALAS_AUTONOMICAS_IRPF_2016[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:9182–9230
- ESCALAS_AUTONOMICAS_IRPF_2014[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:10051–10099
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8287–8288
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- MINIMOS_AUTONOMICOS_IRPF_2018.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3587–3622
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4625–4634
- {
  nombre: "Mínimos autonómicos IRPF 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2015,
    "illes-balears": MINIMOS_ILLES_BALEARS_2015,
    madrid / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:2768–3087
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MADRID_2012,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliare / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3014–3184
- minimos({
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: { / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2303–2818
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6497–6515
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3888
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- VALENCIA_2014_2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3971–3989
- obtenerMinimosAutonomicosIrpf2022({
    comunidadAutonoma,
    fechaFallecimiento,
  }) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13955–14042
- obtenerMinimosAutonomicosIrpf2015(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7653–7705
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17864–17881
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10796–10814
- [publicada] / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/trabajo-anual/conexion.ts:8085–8096
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4161–4165
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / escalaAutonomica.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11463–11481
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11089–11106
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / minimosAutonomicos.contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- publicada === undefined ? undefined : [publicada] / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8096
- comunidadAutonoma === "catalunya" && anio >= 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4149
- {
        baseLiquidableGeneral,
        comunidadAutonoma,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16934–17001
- [publicada] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/trabajo-anual/conexion.ts:8085–8096
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13158–13175
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- { base, tramos, escalasPublicadas } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:13172–14622
- filas([
  ["0", "0", ".085"],
  ["13362.22", "1135.79", ".107"],
  ["19004.63", "1739.53", ".128"],
  ["35425.68", "3841.42", ".174"],
  ["57320.40", "7651.10", / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:2890–3062
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- anio >= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3923–3935
- obtenerEscalaAutonomicaIrpf2021(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12074–12124
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18010–18027
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2018",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3077–3455
- MINIMOS_AUTONOMICOS_IRPF_2015.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3220–3274
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10772–10789
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- {
      comunidadAutonoma,
      fechaFallecimiento,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14406–14464
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEARS_2018,
    madrid: MINIMOS_MADRID_2018,
    "la-rioja": MINIMOS_LA_RIOJ / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3150–3408
- {
  nombre: "Mínimos autonómicos IRPF 2020",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEARS_2020,
    catalu / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3167–3573
- 2024 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4161–4165
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7732–7736
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:7611–9061
- MINIMOS_AUTONOMICOS_IRPF_2020 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3706–3735
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16975–16992
- MINIMOS_AUTONOMICOS_IRPF_2022 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3785–3814
- CATALUNYA_2020_2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4074–4093
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- {
  "simulada-estatal": escala2013({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2013",
    tramos: TRAMOS_IRPF_AUT / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:3160–8206
- autonomica(base).minus(
      autonomica(
        D.min(base, parametros.minimosAutonomicos.contribuyente.general)
      )
    ) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8294–8422
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- obtenerMinimosAutonomicosIrpf2015(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7653–7705
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- Match.value(comunidadAutonoma).pipe(
    Match.when("galicia", () =>
      Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          on / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9367–10109
- obtenerEscalaAutonomicaIrpf2016(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8739–8789
- {
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: {
    pri / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2311–2817
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- MINIMOS_AUTONOMICOS_IRPF_2025.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8743–8778
- obtenerMinimosAutonomicosIrpf2012(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5460–5512
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- obtenerMinimosAutonomicosIrpf2021(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11690–11742
- {
  nombre: "Mínimos autonómicos IRPF 2024",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } satisfies Readonly / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:474–748
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- ESCALAS_AUTONOMICAS_IRPF_2018 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:9239–9268
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2021(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2021 / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:12710–14181
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- MINIMOS_AUTONOMICOS_IRPF_2014.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4420–4474
- obtenerEscalaAutonomicaIrpf2025(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15082–15132
- parametros / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7986–7996
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14732–14749
- parametros.escalaAutonomica / tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7986–8013
- obtenerMinimosAutonomicosIrpf2019(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10356–10408
- {
  comunidadAutonoma: "comunitat-valenciana",
  nombre: "Comunitat Valenciana - fallecido antes del 28/10/2022",
  condicionAplicacion:
    "Aplicable solo a c / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:10641–11680
- neto / value (selector, selection); Asignaciones y flujo imperativo pendientes: neto; lib/dominio/irpf/trabajo-anual/conexion.ts:7396–7400
- fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        }) / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11179–11284
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2012 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MAD / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:2924–3231
- obtenerMinimosAutonomicosIrpf2016(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8355–8407
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- base / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8350–8354
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- D.min(base, parametros.minimosAutonomicos.contribuyente.general) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8344–8408
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:7668–9118
- Match.value(
        fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        })
      ).pipe(
        Match.when( / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11158–11499
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- Match.value({
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10056–10477
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14471–14489
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3623–3640
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- {
  "simulada-estatal": escala2015({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2015",
    tramos: TRAMOS_IRPF_AUT / illes-balears.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:4118–9368
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17755–17772
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
  } / fechaFallecimiento (selector, selection); Propiedad no resuelta (spread/alias): fechaFallecimiento; lib/dominio/irpf/trabajo-anual/conexion.ts:7720–7774
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4305–4313
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- CATALUNYA_2020_2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4074–4093
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9379–9396
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- 2014 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3931–3935
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2019",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3077–3455
- {
  comunidadAutonoma: "comunitat-valenciana",
  nombre: "Comunitat Valenciana - fallecido antes del 28/10/2022",
  condicionAplicacion:
    "Aplicable solo a c / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:10641–11680
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8795–8813
- ESCALA_EXTREMADURA_2023_FALLECIDO_ANTES_15_SEPTIEMBRE / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10340–10393
- "comunitat-valenciana" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3893–3915
- anio >= 2012 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3799–3811
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- ESCALA_EXTREMADURA_2023_FALLECIDO_ANTES_15_SEPTIEMBRE / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10340–10393
- MINIMOS_AUTONOMICOS_IRPF_2023.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2480–2534
- [publicada] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/trabajo-anual/conexion.ts:8085–8096
- Match.value({
    comunidadAutonoma,
    fallecidoAntesIllesBalears: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteIllesBalearsMs / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2105–2539
- {
  nombre: "Mínimos autonómicos IRPF 2023",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    canarias: MINIMOS_ / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:1114–1426
- {
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18000–18064
- MINIMOS_AUTONOMICOS_IRPF_2015 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3220–3249
- obtenerMinimosAutonomicosIrpf2025(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14698–14750
- obtenerMinimosAutonomicosIrpf2020(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11023–11075
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7473–7477
- {
    comunidadAutonoma,
    fechaFallecimiento,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13152–13204
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2025",
  valor: {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:7659–8611
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3399–3416
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:9212–9229
- MINIMOS_ESTATALES_2022 / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3732–3754
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2022",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:2209–2623
- {
  nombre: "Mínimos autonómicos IRPF 2019",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEARS_2019,
    madrid / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3096–3454
- 2022 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4247–4251
- comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3935
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- MINIMOS_AUTONOMICOS_IRPF_2017 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3220–3249
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7687–7704
- comunidadAutonoma === "madrid" &&
    anio === 2025 &&
    fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4374
- ESCALAS_AUTONOMICAS_IRPF_2020[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:14743–14791
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:8241–8258
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17656–17673
- ESCALAS_AUTONOMICAS_IRPF_2024 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:5988–6017
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:7725–9388
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6497–6515
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7473–7477
- comunidadAutonoma === "murcia" &&
    anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4548
- MINIMOS_ESTATALES_2025 / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:536–558
- MADRID_2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4390–4401
- ESCALAS_AUTONOMICAS_IRPF_2020[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:14743–14791
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:12184–12201
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- undefined / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8061–8070
- fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4342–4374
- ESCALA_COMUNITAT_VALENCIANA_2022_FALLECIDO_ANTES_28_OCTUBRE / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14436–14495
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- obtenerMinimosAutonomicosIrpf2019(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10356–10408
- MINIMOS_AUTONOMICOS_IRPF_2012.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3363–3417
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- MINIMOS_AUTONOMICOS_IRPF_2012 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3363–3392
- calcularCuotaPorEscala({
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [public / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7932–8104
- {
  ...escala,
  fuente,
} / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:1869–1895
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- obtenerMinimosAutonomicosIrpf2017(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9022–9074
- obtenerEscalaAutonomicaIrpf2021(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12074–12124
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16835–16852
- ESCALAS_AUTONOMICAS_IRPF_2015["illes-balears"] / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11444–11490
- obtenerEscalaAutonomicaPublicada({
    anio: 2025,
    comunidadAutonoma: "madrid",
  }) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalaAutonomicaPublicada; lib/dominio/irpf/trabajo-anual/conexion.ts:7687–7775
- Option.match({
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiqu / value (EUR, value); Contrato de llamada pendiente: Option.match; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9500–9988
- obtenerEscalaAutonomicaIrpf2024(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12741–12791
- ESCALAS_AUTONOMICAS_IRPF_2017 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:9233–9262
- {
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiquidableGeneral / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9513–9987
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2016,
    "illes-balears": MINIMOS_ILLES_BALEARS_2016,
    madrid: MINIMOS_MADRID_2016,
  } satisfies Readonly<
    Rec / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:2822–3041
- comunidadAutonoma === "andalucia" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3795
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4300
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- MINIMOS_AUTONOMICOS_IRPF_2023.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2480–2515
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7246–7263
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:8357–8374
- publicada === undefined ? undefined : [publicada] / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8096
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6473–6490
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4137–4141
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7277–7295
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:4456–4473
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6473–6490
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17755–17772
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2024",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:455–749
- autonomica(base) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8294–8310
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- ESCALAS_AUTONOMICAS_IRPF_2020 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:14743–14772
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- {
  "simulada-estatal": escala({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  }),
 / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:1561–8032
- {
  nombre: "Mínimos autonómicos IRPF 2025",
  valor: {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025,
    aragon: MINIM / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:7678–8610
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2015,
    "illes-balears": MINIMOS_ILLES_BALEARS_2015,
    madrid: MINIMOS_MADRID_2015,
  } satisfies Readonly<
    Rec / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:2822–3041
- MINIMOS_ILLES_BALEARS_2023_FALLECIDO_ANTES_26_NOVIEMBRE / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2394–2449
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- publicada === undefined / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8070
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / minimosAutonomicos.contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9379–9396
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2021",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
   / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:1614–2156
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2017",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2017,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:2749–3088
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16835–16852
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- ESCALAS_AUTONOMICAS_IRPF_2013 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:8327–8356
- {
      baseLiquidableGeneral,
      comunidadAutonoma,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7209–7270
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2018",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3077–3455
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- publicada / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8056
- MINIMOS_AUTONOMICOS_IRPF_2015 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3220–3249
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:8183–8200
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2013 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MAD / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:2924–3231
- obtenerEscalaAutonomicaIrpf2025(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15082–15132
- importe("5550") / value (selector, selection); Contrato de llamada pendiente: importe; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2345–2360
- ESCALAS_AUTONOMICAS_IRPF_2019[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:14841–14889
- ESCALAS_AUTONOMICAS_IRPF_2012 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:8211–8240
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- ESCALAS_AUTONOMICAS_IRPF_2022 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14526–14555
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11724–11741
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:14773–14790
- {
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17083–17178
- escalasPublicadas / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4226–4234
- ESCALAS_AUTONOMICAS_IRPF_2023[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10424–10472
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025,
    aragon: MINIMOS_ESTATALES_2025,
    asturias: MINIMOS_ASTURIAS_2025 / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:7732–8564
- {
      comunidadAutonoma,
      fechaFallecimiento,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13569–13627
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- base / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8350–8354
- 2020 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4041–4045
- fechaFallecimiento / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4342–4360
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11439–11456
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4153–4157
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:7725–9388
- parametros.minimosAutonomicos.contribuyente / general (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8399
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17458–17475
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MADRID_2013,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliare / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3014–3184
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4153–4165
- 2012 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3807–3811
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12106–12123
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15114–15131
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:12184–12201
- ESCALAS_AUTONOMICAS_IRPF_2023 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10424–10453
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17557–17574
- "murcia" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4519–4527
- comunidadAutonoma === "andalucia" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3795
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:917–934
- comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 &&
    anio <= 2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3955
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: ( / tramos (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(baseLiquidableGeneral).pipe; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9442–9996
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_CANTABRIA_2014,
    "castilla-la-mancha": MINIMOS_CASTILLA_LA_MANCHA_2014,
    madrid: MIN / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:3973–4241
- 2016 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3951–3955
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / minimosAutonomicos.contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- comunidadAutonoma === "madrid" &&
    anio === 2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4334
- comunidadAutonoma === "catalunya" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4029
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8795–8813
- {
  nombre: "Mínimos autonómicos IRPF 2016",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2016,
    "illes-balears": MINIMOS_ILLES_BALEARS_2016,
    madrid / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:2768–3087
- "murcia" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4519–4527
- obtenerMinimosAutonomicosIrpf2021(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11690–11742
- anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4238–4251
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16975–16992
- {
  nombre: "Mínimos autonómicos IRPF 2012 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MADRID_2012,
  } satis / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:2943–3230
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:10081–10098
- MINIMOS_AUTONOMICOS_IRPF_2022.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3785–3820
- comunidadAutonoma === "andalucia" && anio >= 2012 && anio <= 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3827
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3762–3779
- comunidadAutonoma === "catalunya" && anio >= 2020 && anio <= 2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4061
- MINIMOS_AUTONOMICOS_IRPF_2018.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3587–3641
- VALENCIA_2014_2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3971–3989
- {
      comunidadAutonoma,
      fechaFallecimiento,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13569–13627
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9462–9480
- ESCALAS_AUTONOMICAS_IRPF_2021[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:14302–14350
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9482–10890
- parametros.minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8385
- minimosIrpf / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2252–2263
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:10081–10098
- fechaFallecimiento / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4342–4360
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- {
      comunidadAutonoma,
      fechaFallecimiento,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14406–14464
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14121–14283
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7246–7263
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEARS_2019,
    madrid: MINIMOS_MADRID_2019,
    "la-rioja": MINIMOS_LA_RIOJ / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2019.ts:3150–3408
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- {
  nombre: "Mínimos autonómicos IRPF 2025",
  valor: {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025,
    aragon: MINIM / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:7678–8610
- ANDALUCIA_2012_2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3840–3859
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2024",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:455–749
- publicada === undefined ? undefined : [publicada] / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8096
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3799–3803
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- ESCALAS_AUTONOMICAS_IRPF_2018 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:9239–9268
- obtenerEscalaAutonomicaIrpf2023({
      comunidadAutonoma,
      fechaFallecimiento,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13537–13628
- ESCALAS_AUTONOMICAS_IRPF_2017[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:9233–9281
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:9263–9280
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:7611–9061
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- comunidadAutonoma === "murcia" &&
    anio === 2022 &&
    fechaFallecimiento === undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4588
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- MINIMOS_AUTONOMICOS_IRPF_2013.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3363–3398
- obtenerEscalaAutonomicaIrpf2018(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10073–10123
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- obtenerEscalaAutonomicaIrpf2020(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11407–11457
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- MINIMOS_AUTONOMICOS_IRPF_2016.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3220–3255
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18146–18163
- ESCALAS_AUTONOMICAS_IRPF_2012 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:8211–8240
- Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: ( / tramos (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(baseLiquidableGeneral).pipe; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11545–12099
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MADRID_2012,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliare / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3014–3184
- anio <= 2015 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3815–3827
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11463–11481
- neto / value (EUR, value); Asignaciones y flujo imperativo pendientes: neto; lib/dominio/irpf/trabajo-anual/conexion.ts:7396–7400
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / escalaAutonomica.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    canarias: MINIMOS_ESTATALES_2023,
  } satisfies Readonly<
    Record<Com / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:1168–1380
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- obtenerEscalaAutonomicaIrpf2014({
      baseLiquidableGeneral,
      comunidadAutonoma,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7177–7271
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17359–17376
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17864–17881
- {
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17083–17178
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8779–8796
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18146–18163
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- {
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiquidableGeneral / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9513–9987
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17124–17141
- {
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiquidableGeneral / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11616–12090
- undefined / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8073–8082
- {
  comunidadAutonoma: "extremadura",
  nombre: "Extremadura - fallecido antes del 15/09/2023",
  condicionAplicacion:
    "Aplicable solo a contribuyentes fall / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:6645–7611
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3399–3416
- MINIMOS_AUTONOMICOS_IRPF_2012.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3363–3398
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- MINIMOS_AUTONOMICOS_IRPF_2021 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2288–2317
- obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7426–7549
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2013 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MAD / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:2924–3231
- "catalunya" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4018–4029
- {
  ...escala,
  fuente,
} / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:1869–1895
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- MINIMOS_AUTONOMICOS_IRPF_2025 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8743–8772
- anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4535–4548
- MINIMOS_AUTONOMICOS_IRPF_2021.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2288–2342
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4579–4588
- MINIMOS_AUTONOMICOS_IRPF_2015.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:3220–3274
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    canarias: MINIMOS_ESTATALES_2022,
    "illes-balears": MINIMOS_ILLES_BAL / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:2282–2576
- {
  comunidadAutonoma: "extremadura",
  nombre: "Extremadura - fallecido antes del 15/09/2023",
  condicionAplicacion:
    "Aplicable solo a contribuyentes fall / tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:6645–7611
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- obtenerEscalaAutonomicaIrpf2017(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9406–9456
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17458–17475
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4221
- EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              b / value (EUR, value); Contrato de llamada pendiente: EffectArray.flatMap; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1915–3054
- MINIMOS_AUTONOMICOS_IRPF_2016 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3220–3249
- ESCALAS_AUTONOMICAS_IRPF_2012[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:8211–8259
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8771–8788
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2021",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
   / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:1614–2156
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:14871–14888
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4579–4588
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4283–4300
- comunidadAutonoma === "comunitat-valenciana" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3915
- MINIMOS_AUTONOMICOS_IRPF_2020.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3706–3760
- valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3742–3759
- ESCALAS_AUTONOMICAS_IRPF_2017[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:9233–9281
- obtenerEscalaAutonomicaIrpf2014({
      baseLiquidableGeneral,
      comunidadAutonoma,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7177–7271
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4238–4251
- "5550" / value (EUR, value); literal; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2353–2359
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.an / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:13172–14622
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4100–4117
- filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["60000", "9458.31", ".23 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1452–1653
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13577–13594
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12773–12790
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7277–7295
- obtenerMinimosAutonomicosIrpf2014(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6828–6880
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2516–2533
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10129–10147
- MINIMOS_AUTONOMICOS_IRPF_2024 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:881–910
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7720–7774
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / escalasPublicadas (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4221
- anio === 2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4321–4334
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15138–15156
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamil / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:528–702
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18245–18262
- obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7426–7549
- obtenerEscalaAutonomicaIrpf2024(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12741–12791
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:2507–2707
- obtenerMinimosAutonomicosIrpf2018(comunidadAutonoma) / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9689–9741
- MINIMOS_AUTONOMICOS_IRPF_2016.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3220–3274
- comunidadAutonoma === "madrid" && anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4204–4251
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- {
      baseLiquidableGeneral,
      comunidadAutonoma,
      fechaFallecimiento,
    } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8034–8121
- ESCALAS_AUTONOMICAS_IRPF_2023[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10424–10472
- MINIMOS_AUTONOMICOS_IRPF_2025 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8743–8772
- {
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [publicada],
    } / base (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7955–8103
- Match.value({
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14109–14579
- MINIMOS_AUTONOMICOS_IRPF_2024.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:881–935
- MINIMOS_AUTONOMICOS_IRPF_2018.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3587–3622
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- parametros.minimosAutonomicos.contribuyente.general / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8407
- comunidadAutonoma === "catalunya" && anio >= 2020 && anio <= 2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4061
- {
  nombre: "Mínimos autonómicos IRPF 2014 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_CANTABRIA_2014,
    / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:3902–4287
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5865–5883
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2017",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2017,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:2749–3088
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4305–4313
- MINIMOS_AUTONOMICOS_IRPF_2024.valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:881–916
- {
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
    }),
  } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10068–10227
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
    asturias: MINIMOS_ESTATALES_2021,
    "illes-balears": MINIMOS_ILLES_BA / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:1687–2109
- comunidadAutonoma === "comunitat-valenciana" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3915
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4049–4053
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18245–18262
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12797–12815
- {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  } / general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2330–2443
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    canarias: MINIMOS_ESTATALES_2022,
    "illes-balears": MINIMOS_ILLES_BAL / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:2282–2576
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- undefined / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8073–8082
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025 / illes-balears.tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9810–9857
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- MINIMOS_AUTONOMICOS_IRPF_2012.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:3363–3417
- comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 &&
    anio <= 2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3871–3955
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17124–17141
- obtenerEscalaAutonomicaIrpf2016(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8739–8789
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7720–7774
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17124–17141
- (filas) =>
        Option.match(
          EffectArray.findLast(
            filas,
            (fila) =>
              base.gt(0) &&
              (fila.inferi / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1954–3046
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2017,
    "illes-balears": MINIMOS_ILLES_BALEARS_2017,
    madrid: MINIMOS_MADRID_2017,
  } satisfies Readonly<
    Rec / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:2822–3041
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17260–17277
- CATALUNYA_2022_2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4178–4197
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1970–1978
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- ESCALAS_AUTONOMICAS_IRPF_2017 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:9233–9262
- obtenerEscalaAutonomicaIrpf2015({
      baseLiquidableGeneral,
      comunidadAutonoma,
      fechaFallecimiento,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8002–8122
- 2025 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4330–4334
- ESCALAS_AUTONOMICAS_IRPF_2018[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:9239–9287
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- MADRID_2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4260–4271
- {
  nombre: "Mínimos autonómicos IRPF 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2015,
    "illes-balears": MINIMOS_ILLES_BALEARS_2015,
    madrid / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2015.ts:2768–3087
- anio === 2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4321–4334
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:14556–14573
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16736–16753
- comunidadAutonoma === "murcia" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4527
- {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  } / general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2330–2443
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- comunidadAutonoma === "catalunya" / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3996–4029
- 2015 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3823–3827
- obtenerEscalaAutonomicaIrpf2012(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5809–5859
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- obtenerEscalaAutonomicaIrpf2022({
      comunidadAutonoma,
      fechaFallecimiento,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14374–14465
- autonomica(
        D.min(base, parametros.minimosAutonomicos.contribuyente.general)
      ) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8324–8416
- ESCALAS_AUTONOMICAS_IRPF_2019 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:14841–14870
- minimos({
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: { / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2303–2818
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- escala2015({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears - fallecido antes del 31/12/2015",
    condicionAplicacion:
      "Aplicable sol / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:3540–4053
- parametros / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8366
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4535–4539
- MINIMOS_AUTONOMICOS_IRPF_2020.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3706–3741
- ESCALAS_AUTONOMICAS_IRPF_2015 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:12154–12183
- ESCALAS_AUTONOMICAS_IRPF_2024 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2024.ts:5988–6017
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:14332–14349
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10105–10122
- anio >= 2020 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4033–4045
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4033–4037
- obtenerMinimosAutonomicosIrpf2020(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11023–11075
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12106–12123
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- "catalunya" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4122–4133
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11057–11074
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16736–16753
- Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fech / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(fechaFallecimiento).pipe; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:2507–2707
- datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  })) / value (selector, selection); Contrato de llamada pendiente: datos.map; lib/dominio/irpf/cuotas/escalas-publicadas.ts:560–716
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- anio <= 2021 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4049–4061
- fechaFallecimiento / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4556–4574
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- {
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
    }),
  } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2023.ts:10068–10227
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4365–4374
- calcularCuotaPorEscala({
      base: b,
      tramos: parametros.escalaAutonomica.tramos,
      escalasPublicadas: publicada === undefined ? undefined : [public / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7932–8104
- parametros.minimosAutonomicos.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8356–8407
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2022.ts:11794–13336
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9438–9455
- {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.an / illes-balears.tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:9482–10890
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4226–4234
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["90000", "15908.31", ".2 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:1940–2176
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:8241–8258
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2022",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:2209–2623
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- MINIMOS_ESTATALES_2022 / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3732–3754
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- publicada === undefined / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8047–8070
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2014 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_ / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:3883–4288
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  }) / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7426–7549
- ({
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
}) / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:494–568
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2020",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEA / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2020.ts:3148–3574
- obtenerEscalaAutonomicaIrpf2013(comunidadAutonoma) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6441–6491
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10772–10789
- {
  nombre: "Mínimos autonómicos IRPF 2022",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    canarias: MINIMOS_ / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:2228–2622
- "andalucia" / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3784–3795
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- MINIMOS_AUTONOMICOS_IRPF_2021 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2021.ts:2288–2317
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5494–5511
- obtenerEscalaAutonomicaPublicada({
    anio: 2025,
    comunidadAutonoma: "madrid",
  }) / value (selector, selection); Retornos/guardas imperativas requieren contrato: obtenerEscalaAutonomicaPublicada; lib/dominio/irpf/trabajo-anual/conexion.ts:7687–7775
- {
        comunidadAutonoma,
        fechaFallecimiento,
      } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17854–17918
- b / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7969–7970
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- ESCALAS_AUTONOMICAS_IRPF_2019[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:14841–14889
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7720–7774
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / escalaAutonomica.tramos (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12130–12148
- obtenerEscalaAutonomicaIrpf2015({
      baseLiquidableGeneral,
      comunidadAutonoma,
      fechaFallecimiento,
    }) / tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8002–8122
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- MINIMOS_ILLES_BALEARS_2023_FALLECIDO_ANTES_26_NOVIEMBRE / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2394–2449
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12391–12408
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16835–16852
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- undefined / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8073–8082
- MINIMOS_AUTONOMICOS_IRPF_2016.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2016.ts:3220–3274
- 0 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:1976–1977
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11439–11456
- ESCALAS_AUTONOMICAS_IRPF_2025[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:8153–8201
- {
  "simulada-estatal": escala({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  }),
 / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:1561–8032
- Match.value(comunidadAutonoma).pipe(
    Match.when("illes-balears", () =>
      Match.value(
        fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-1 / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11077–12212
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8071–8088
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / minimosAutonomicos.contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- ESCALAS_AUTONOMICAS_IRPF_2013[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:8327–8375
- MINIMOS_AUTONOMICOS_IRPF_2023.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:2480–2534
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- MINIMOS_AUTONOMICOS_IRPF_2017.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2017.ts:3220–3255
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    canarias: MINIMOS_ESTATALES_2023,
  } satisfies Readonly<
    Record<Com / contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2023.ts:1168–1380
- {
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiquidableGeneral / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11616–12090
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4238–4242
- {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_CANTABRIA_2014,
    "castilla-la-mancha": MINIMOS_CASTILLA_LA_MANCHA_2014,
    madrid: MIN / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:3973–4241
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:14871–14888
- [
  ...filas([
    ["0", "0", ".096"],
    ["12960.45", "1244.20", ".1146"],
    ["21028.20", "2168.76", ".1374"],
    ["35394", "4142.62", ".1822"],
  ]),
  {
 / value (selector, selection); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3107–3406
- CATALUNYA_2022_2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4178–4197
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- ([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-publicadas.ts:570–715
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- valor / contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:549–554
- Match.value({
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28 / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2022.ts:3405–3844
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- anio <= 2024 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4153–4165
- anio / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4238–4242
- ESCALA_ILLES_BALEARS_2015_FALLECIDO_ANTES_31_DICIEMBRE / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11351–11405
- escala2015({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears - fallecido antes del 31/12/2015",
    condicionAplicacion:
      "Aplicable sol / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:3540–4053
- MADRID_2025 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4390–4401
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / minimosAutonomicos.contribuyente.general (selector, selection); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- undefined / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8061–8070
- parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2025",
  valor: {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025 / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:7659–8611
- {
  nombre: "Mínimos autonómicos IRPF 2024",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } satisfies Readonly / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2024.ts:474–748
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17260–17277
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- MINIMOS_AUTONOMICOS_IRPF_2025.valor / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:8743–8778
- MINIMOS_AUTONOMICOS_IRPF_2013.valor[comunidadAutonoma] / contribuyente.general (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3363–3417
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- Option.match({
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiqu / value (EUR, value); Contrato de llamada pendiente: Option.match; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:11603–12091
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaAutonomica.tramos (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- MINIMOS_AUTONOMICOS_IRPF_2018 / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2018.ts:3587–3616
- MINIMOS_AUTONOMICOS_IRPF_2013.valor[comunidadAutonoma] / contribuyente.general (selector, selection); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:3363–3417
- ESCALAS_AUTONOMICAS_IRPF_2025[comunidadAutonoma] / tramos (EUR, value); Índice dinámico/array: requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:8153–8201
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10105–10122
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17359–17376
- comunidadAutonoma === "murcia" &&
    anio === 2022 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:4497–4548
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (EUR, value); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- Option.match({
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiqu / value (EUR, value); Contrato de llamada pendiente: Option.match; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:9500–9988
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17755–17772
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12130–12148
- ({
  ...escala,
  fuente,
}) / tramos (EUR, value); productor; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:1868–1896
- {
  _tag: "ParametroNormativoEjecutable",
  nombre,
  valor,
  fuente,
} / valor.contribuyente.general (selector, selection); productor; lib/dominio/normativa/repositorio-parametros.ts:495–567
- 0 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7402–7403
- {
  "simulada-estatal": reutilizarEscala2025ConFuente2021(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2021 / tramos (EUR, value); Propiedad no resuelta (spread/alias): tramos; lib/dominio/normativa/datos/irpf-autonomico-2021.ts:12710–14181
- anio <= 2016 / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-publicadas.ts:3943–3955
- D.min(base, parametros.minimosAutonomicos.contribuyente.general) / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8344–8408
- minimosAutonomicos / contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8128–8146
- obtenerMinimosAutonomicosIrpf2013(comunidadAutonoma) / contribuyente.general (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6092–6144
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / minimosAutonomicos.contribuyente.general (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263

## Condiciones por relación

- [value] constructor Decimal; e:6402
- [value] argumento de max; e:6405
- [selection] sustitución por propiedad del argumento; e:6407
- [selection] ===; e:6409
- [selection] sustitución por propiedad del argumento; e:6412
- [selection] >=; e:6414
- [selection] &&; e:6415
- [selection] sustitución por propiedad del argumento; e:6417
- [selection] <=; e:6419
- [selection] &&; e:6420
- [selection] argumento conservado sin afirmar cierre; e:6422
- [selection] retorno de filas; e:6423
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6425
- [selection] sustitución por propiedad del argumento; e:6426
- [selection] ===; e:6428
- [selection] sustitución por propiedad del argumento; e:6430
- [selection] >=; e:6432
- [selection] &&; e:6433
- [selection] sustitución por propiedad del argumento; e:6435
- [selection] <=; e:6437
- [selection] &&; e:6438
- [selection] argumento conservado sin afirmar cierre; e:6440
- [selection] retorno de filas; e:6441
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6443
- [selection] sustitución por propiedad del argumento; e:6444
- [selection] ===; e:6446
- [selection] sustitución por propiedad del argumento; e:6448
- [selection] >=; e:6450
- [selection] &&; e:6451
- [selection] sustitución por propiedad del argumento; e:6453
- [selection] <=; e:6455
- [selection] &&; e:6456
- [selection] argumento conservado sin afirmar cierre; e:6458
- [selection] retorno de filas; e:6459
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6461
- [selection] sustitución por propiedad del argumento; e:6462
- [selection] ===; e:6464
- [selection] sustitución por propiedad del argumento; e:6466
- [selection] >=; e:6468
- [selection] &&; e:6469
- [selection] sustitución por propiedad del argumento; e:6471
- [selection] <=; e:6473
- [selection] &&; e:6474
- [selection] argumento conservado sin afirmar cierre; e:6476
- [selection] retorno de filas; e:6477
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6479
- [selection] sustitución por propiedad del argumento; e:6480
- [selection] ===; e:6482
- [selection] sustitución por propiedad del argumento; e:6484
- [selection] ===; e:6486
- [selection] &&; e:6487
- [selection] argumento conservado sin afirmar cierre; e:6489
- [selection] retorno de filas; e:6490
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6492
- [selection] sustitución por propiedad del argumento; e:6493
- [selection] ===; e:6495
- [selection] sustitución por propiedad del argumento; e:6497
- [selection] ===; e:6499
- [selection] &&; e:6500
- [selection] sustitución por propiedad del argumento; e:6502
- [selection] ===; e:6504
- [selection] &&; e:6505
- [selection] argumento conservado sin afirmar cierre; e:6507
- [selection] retorno de filas; e:6508
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6510
- [selection] sustitución por propiedad del argumento; e:6511
- [selection] ===; e:6513
- [selection] sustitución por propiedad del argumento; e:6515
- [selection] ===; e:6517
- [selection] &&; e:6518
- [selection] sustitución por propiedad del argumento; e:6520
- [selection] ===; e:6522
- [selection] &&; e:6523
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6526
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6527
- [selection] ===; e:6530
- [selection] selecciona rama; e:6531
- [selection] publicada === undefined; e:6532
- [selection] !(publicada === undefined); e:6533
- [selection] sustitución por propiedad del argumento; e:6535
- [selection] sustitución por propiedad del argumento; e:6537
- [selection] !==; e:6539
- [selection] selecciona rama; e:6540
- [selection] selecciona rama; e:6541
- [value] publicada === undefined; e:6542
- [value] !(publicada === undefined); e:6543
- [value] sustitución por propiedad del argumento; e:6545
- [value] sustitución por propiedad del argumento; e:6547
- [value] argumento conservado sin afirmar cierre; e:6548
- [value] argumento conservado sin afirmar cierre; e:6549
- [value] escalasPublicadas !== undefined; e:6550
- [selection] constructor Decimal; e:6551
- [selection] argumento de max; e:6553
- [selection] argumento de max; e:6554
- [selection] sustitución de argumento exacto; e:6556
- [selection] sustitución por propiedad del argumento; e:6558
- [selection] sustitución por propiedad del argumento; e:6560
- [selection] selecciona Match; e:6561
- [selection] sustitución de argumento exacto; e:6562
- [selection] receptor de operación Decimal; e:6563
- [selection] argumento de lte; e:6564
- [selection] base matches (base) => base.lte(0); e:6565
- [value] base matches (base) => base.lte(0); e:6566
- [selection] sustitución por propiedad del argumento; e:6568
- [selection] selecciona Match; e:6569
- [selection] sustitución por propiedad del argumento; e:6573
- [selection] sustitución de argumento exacto; e:6574
- [selection] sustitución de argumento exacto; e:6575
- [selection] selección de elemento; e:6576
- [value] retorno de obtenerEscalaAutonomicaIrpf2012; e:6577
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:6579
- [value] anio matches 2012; e:6580
- [selection] sustitución por propiedad del argumento; e:6583
- [selection] sustitución de argumento exacto; e:6584
- [selection] sustitución de argumento exacto; e:6585
- [selection] selección de elemento; e:6586
- [value] retorno de obtenerEscalaAutonomicaIrpf2013; e:6587
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:6589
- [value] ningún matcher previo (2012) && anio matches 2013; e:6590
- [selection] sustitución por propiedad del argumento; e:6591
- [selection] sustitución por propiedad del argumento; e:6593
- [selection] sustitución por propiedad del argumento; e:6595
- [selection] selecciona Match; e:6596
- [value] argumento conservado sin afirmar cierre; e:6597
- [value] argumento conservado sin afirmar cierre; e:6598
- [value] comunidadAutonoma matches "galicia"; e:6599
- [selection] sustitución de argumento exacto; e:6602
- [selection] selección de elemento; e:6603
- [value] ningún matcher previo ("galicia") && else; e:6604
- [value] retorno de obtenerEscalaAutonomicaIrpf2014; e:6605
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:6607
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:6608
- [selection] sustitución por propiedad del argumento; e:6609
- [selection] sustitución por propiedad del argumento; e:6611
- [selection] sustitución por propiedad del argumento; e:6613
- [selection] selecciona Match; e:6614
- [selection] argumento conservado sin afirmar cierre; e:6615
- [selection] argumento conservado sin afirmar cierre; e:6616
- [selection] retorno de fallecidoAntesDeFechaCivil; e:6617
- [selection] selecciona Match; e:6618
- [value] retorno de escala2015; e:6620
- [value] fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        }) matches true; e:6622
- [value] ningún matcher previo (true) && else; e:6628
- [value] comunidadAutonoma matches "illes-balears"; e:6629
- [value] argumento conservado sin afirmar cierre; e:6630
- [value] argumento conservado sin afirmar cierre; e:6631
- [value] ningún matcher previo ("illes-balears") && comunidadAutonoma matches "galicia"; e:6632
- [selection] sustitución de argumento exacto; e:6635
- [selection] selección de elemento; e:6636
- [value] ningún matcher previo ("illes-balears" | "galicia") && else; e:6637
- [value] retorno de obtenerEscalaAutonomicaIrpf2015; e:6638
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:6640
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:6641
- [selection] sustitución por propiedad del argumento; e:6644
- [selection] sustitución de argumento exacto; e:6645
- [selection] sustitución de argumento exacto; e:6646
- [selection] selección de elemento; e:6647
- [value] retorno de obtenerEscalaAutonomicaIrpf2016; e:6648
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:6650
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:6651
- [selection] sustitución por propiedad del argumento; e:6654
- [selection] sustitución de argumento exacto; e:6655
- [selection] sustitución de argumento exacto; e:6656
- [selection] selección de elemento; e:6657
- [value] retorno de obtenerEscalaAutonomicaIrpf2017; e:6658
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:6660
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:6661
- [selection] sustitución por propiedad del argumento; e:6664
- [selection] sustitución de argumento exacto; e:6665
- [selection] sustitución de argumento exacto; e:6666
- [selection] selección de elemento; e:6667
- [value] retorno de obtenerEscalaAutonomicaIrpf2018; e:6668
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:6670
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:6671
- [selection] sustitución por propiedad del argumento; e:6674
- [selection] sustitución de argumento exacto; e:6675
- [selection] sustitución de argumento exacto; e:6676
- [selection] selección de elemento; e:6677
- [value] retorno de obtenerEscalaAutonomicaIrpf2019; e:6678
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:6680
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:6681
- [selection] sustitución por propiedad del argumento; e:6684
- [selection] sustitución de argumento exacto; e:6685
- [selection] sustitución de argumento exacto; e:6686
- [selection] selección de elemento; e:6687
- [value] retorno de obtenerEscalaAutonomicaIrpf2020; e:6688
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:6690
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:6691
- [selection] sustitución por propiedad del argumento; e:6694
- [selection] sustitución de argumento exacto; e:6695
- [selection] sustitución de argumento exacto; e:6696
- [selection] selección de elemento; e:6697
- [value] retorno de obtenerEscalaAutonomicaIrpf2021; e:6698
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:6700
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:6701
- [selection] selecciona Match; e:6702
- [value] {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  } matches {
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }; e:6704
- [selection] sustitución por propiedad del argumento; e:6707
- [selection] sustitución por propiedad del argumento; e:6709
- [selection] sustitución por propiedad del argumento; e:6711
- [selection] selección de elemento; e:6712
- [value] ningún matcher previo ({
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }) && else; e:6713
- [value] retorno de obtenerEscalaAutonomicaIrpf2022; e:6714
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:6716
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:6717
- [selection] selecciona Match; e:6718
- [value] {
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
    }),
  } matches { comunidadAutonoma: "extremadura", fallecidoAntesExtremadura: true }; e:6720
- [selection] sustitución por propiedad del argumento; e:6723
- [selection] sustitución por propiedad del argumento; e:6725
- [selection] sustitución por propiedad del argumento; e:6727
- [selection] selección de elemento; e:6728
- [value] ningún matcher previo ({ comunidadAutonoma: "extremadura", fallecidoAntesExtremadura: true }) && else; e:6729
- [value] retorno de obtenerEscalaAutonomicaIrpf2023; e:6730
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:6732
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:6733
- [selection] sustitución por propiedad del argumento; e:6736
- [selection] sustitución de argumento exacto; e:6737
- [selection] sustitución de argumento exacto; e:6738
- [selection] selección de elemento; e:6739
- [value] retorno de obtenerEscalaAutonomicaIrpf2024; e:6740
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:6742
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:6743
- [selection] sustitución por propiedad del argumento; e:6746
- [selection] sustitución de argumento exacto; e:6747
- [selection] sustitución de argumento exacto; e:6748
- [selection] selección de elemento; e:6749
- [value] retorno de obtenerEscalaAutonomicaIrpf2025; e:6750
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:6752
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:6753
- [selection] sustitución por propiedad del argumento; e:6754
- [selection] sustitución de argumento exacto; e:6755
- [selection] selecciona Match; e:6756
- [value] comunidadAutonoma matches "simulada-estatal"; e:6757
- [value] ningún matcher previo ("simulada-estatal") && else; e:6758
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:6759
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:6760
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:6761
- [value] retorno de obtenerParametrosComunidadAutonoma; e:6762
- [value] sustitución por propiedad del argumento; e:6767
- [value] sustitución por propiedad del argumento; e:6769
- [value] argumento conservado sin afirmar cierre; e:6770
- [value] argumento conservado sin afirmar cierre; e:6771
- [value] argumento conservado sin afirmar cierre; e:6772
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:6774
- [value] !(escalasPublicadas !== undefined); e:6775
- [value] retorno de calcularDesgloseCuotaPorEscala; e:6776
- [value] argumento conservado sin afirmar cierre; e:6777
- [value] argumento de max; e:6779
- [value] argumento de max; e:6780
- [value] sustitución de argumento exacto; e:6782
- [value] sustitución por propiedad del argumento; e:6784
- [value] receptor de operación Decimal; e:6785
- [value] argumento de mul; e:6786
- [value] argumento conservado sin afirmar cierre; e:6787
- [value] argumento conservado sin afirmar cierre; e:6788
- [value] retorno de calcularCuotaPorEscala; e:6789
- [value] retorno de autonomica; e:6790
- [value] receptor de operación Decimal; e:6791
- [selection] sustitución por propiedad del argumento; e:6793
- [selection] ===; e:6795
- [selection] sustitución por propiedad del argumento; e:6798
- [selection] >=; e:6800
- [selection] &&; e:6801
- [selection] sustitución por propiedad del argumento; e:6803
- [selection] <=; e:6805
- [selection] &&; e:6806
- [selection] argumento conservado sin afirmar cierre; e:6808
- [selection] retorno de filas; e:6809
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6811
- [selection] sustitución por propiedad del argumento; e:6812
- [selection] ===; e:6814
- [selection] sustitución por propiedad del argumento; e:6816
- [selection] >=; e:6818
- [selection] &&; e:6819
- [selection] sustitución por propiedad del argumento; e:6821
- [selection] <=; e:6823
- [selection] &&; e:6824
- [selection] argumento conservado sin afirmar cierre; e:6826
- [selection] retorno de filas; e:6827
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6829
- [selection] sustitución por propiedad del argumento; e:6830
- [selection] ===; e:6832
- [selection] sustitución por propiedad del argumento; e:6834
- [selection] >=; e:6836
- [selection] &&; e:6837
- [selection] sustitución por propiedad del argumento; e:6839
- [selection] <=; e:6841
- [selection] &&; e:6842
- [selection] argumento conservado sin afirmar cierre; e:6844
- [selection] retorno de filas; e:6845
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6847
- [selection] sustitución por propiedad del argumento; e:6848
- [selection] ===; e:6850
- [selection] sustitución por propiedad del argumento; e:6852
- [selection] >=; e:6854
- [selection] &&; e:6855
- [selection] sustitución por propiedad del argumento; e:6857
- [selection] <=; e:6859
- [selection] &&; e:6860
- [selection] argumento conservado sin afirmar cierre; e:6862
- [selection] retorno de filas; e:6863
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6865
- [selection] sustitución por propiedad del argumento; e:6866
- [selection] ===; e:6868
- [selection] sustitución por propiedad del argumento; e:6870
- [selection] ===; e:6872
- [selection] &&; e:6873
- [selection] argumento conservado sin afirmar cierre; e:6875
- [selection] retorno de filas; e:6876
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6878
- [selection] sustitución por propiedad del argumento; e:6879
- [selection] ===; e:6881
- [selection] sustitución por propiedad del argumento; e:6883
- [selection] ===; e:6885
- [selection] &&; e:6886
- [selection] sustitución por propiedad del argumento; e:6888
- [selection] ===; e:6890
- [selection] &&; e:6891
- [selection] argumento conservado sin afirmar cierre; e:6893
- [selection] retorno de filas; e:6894
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6896
- [selection] sustitución por propiedad del argumento; e:6897
- [selection] ===; e:6899
- [selection] sustitución por propiedad del argumento; e:6901
- [selection] ===; e:6903
- [selection] &&; e:6904
- [selection] sustitución por propiedad del argumento; e:6906
- [selection] ===; e:6908
- [selection] &&; e:6909
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6912
- [selection] retorno de obtenerEscalaAutonomicaPublicada; e:6913
- [selection] ===; e:6916
- [selection] selecciona rama; e:6917
- [selection] publicada === undefined; e:6918
- [selection] !(publicada === undefined); e:6919
- [selection] sustitución por propiedad del argumento; e:6921
- [selection] sustitución por propiedad del argumento; e:6923
- [selection] !==; e:6925
- [selection] selecciona rama; e:6926
- [selection] selecciona rama; e:6927
- [value] publicada === undefined; e:6928
- [value] !(publicada === undefined); e:6929
- [value] sustitución por propiedad del argumento; e:6931
- [value] sustitución por propiedad del argumento; e:6933
- [value] argumento conservado sin afirmar cierre; e:6934
- [value] argumento conservado sin afirmar cierre; e:6935
- [value] escalasPublicadas !== undefined; e:6936
- [selection] argumento de min; e:6938
- [selection] sustitución por propiedad del argumento; e:6940
- [selection] selecciona Match; e:6941
- [selection] sustitución por propiedad del argumento; e:6943
- [selection] retorno de parametroNormativo; e:6946
- [selection] sustitución por propiedad del argumento; e:6951
- [selection] sustitución de argumento exacto; e:6952
- [selection] sustitución de argumento exacto; e:6953
- [selection] selección de elemento; e:6954
- [selection] retorno de obtenerMinimosAutonomicosIrpf2012; e:6955
- [selection] retorno de resolverParametrosComunidadAutonoma2012; e:6958
- [selection] anio matches 2012; e:6959
- [selection] sustitución por propiedad del argumento; e:6961
- [selection] retorno de parametroNormativo; e:6964
- [selection] sustitución por propiedad del argumento; e:6968
- [selection] sustitución de argumento exacto; e:6969
- [selection] sustitución de argumento exacto; e:6970
- [selection] selección de elemento; e:6971
- [selection] retorno de obtenerMinimosAutonomicosIrpf2013; e:6972
- [selection] retorno de resolverParametrosComunidadAutonoma2013; e:6975
- [selection] ningún matcher previo (2012) && anio matches 2013; e:6976
- [selection] sustitución por propiedad del argumento; e:6978
- [selection] retorno de parametroNormativo; e:6981
- [selection] sustitución por propiedad del argumento; e:6985
- [selection] sustitución por propiedad del argumento; e:6987
- [selection] sustitución de argumento exacto; e:6988
- [selection] selección de elemento; e:6989
- [selection] retorno de obtenerMinimosAutonomicosIrpf2014; e:6990
- [selection] retorno de resolverParametrosComunidadAutonoma2014; e:6993
- [selection] ningún matcher previo (2012 | 2013) && anio matches 2014; e:6994
- [selection] sustitución por propiedad del argumento; e:6996
- [selection] retorno de parametroNormativo; e:6999
- [selection] sustitución por propiedad del argumento; e:7003
- [selection] sustitución por propiedad del argumento; e:7005
- [selection] sustitución de argumento exacto; e:7006
- [selection] selección de elemento; e:7007
- [selection] retorno de obtenerMinimosAutonomicosIrpf2015; e:7008
- [selection] retorno de resolverParametrosComunidadAutonoma2015; e:7011
- [selection] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:7012
- [selection] sustitución por propiedad del argumento; e:7014
- [selection] retorno de parametroNormativo; e:7017
- [selection] sustitución por propiedad del argumento; e:7021
- [selection] sustitución de argumento exacto; e:7022
- [selection] sustitución de argumento exacto; e:7023
- [selection] selección de elemento; e:7024
- [selection] retorno de obtenerMinimosAutonomicosIrpf2016; e:7025
- [selection] retorno de resolverParametrosComunidadAutonoma2016; e:7028
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:7029
- [selection] sustitución por propiedad del argumento; e:7031
- [selection] retorno de parametroNormativo; e:7034
- [selection] sustitución por propiedad del argumento; e:7038
- [selection] sustitución de argumento exacto; e:7039
- [selection] sustitución de argumento exacto; e:7040
- [selection] selección de elemento; e:7041
- [selection] retorno de obtenerMinimosAutonomicosIrpf2017; e:7042
- [selection] retorno de resolverParametrosComunidadAutonoma2017; e:7045
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:7046
- [selection] sustitución por propiedad del argumento; e:7048
- [selection] retorno de parametroNormativo; e:7051
- [selection] sustitución por propiedad del argumento; e:7055
- [selection] sustitución de argumento exacto; e:7056
- [selection] sustitución de argumento exacto; e:7057
- [selection] selección de elemento; e:7058
- [selection] retorno de obtenerMinimosAutonomicosIrpf2018; e:7059
- [selection] retorno de resolverParametrosComunidadAutonoma2018; e:7062
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:7063
- [selection] sustitución por propiedad del argumento; e:7065
- [selection] retorno de parametroNormativo; e:7068
- [selection] sustitución por propiedad del argumento; e:7072
- [selection] sustitución de argumento exacto; e:7073
- [selection] sustitución de argumento exacto; e:7074
- [selection] selección de elemento; e:7075
- [selection] retorno de obtenerMinimosAutonomicosIrpf2019; e:7076
- [selection] retorno de resolverParametrosComunidadAutonoma2019; e:7079
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:7080
- [selection] sustitución por propiedad del argumento; e:7082
- [selection] retorno de parametroNormativo; e:7085
- [selection] sustitución por propiedad del argumento; e:7089
- [selection] sustitución de argumento exacto; e:7090
- [selection] sustitución de argumento exacto; e:7091
- [selection] selección de elemento; e:7092
- [selection] retorno de obtenerMinimosAutonomicosIrpf2020; e:7093
- [selection] retorno de resolverParametrosComunidadAutonoma2020; e:7096
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:7097
- [selection] sustitución por propiedad del argumento; e:7099
- [selection] retorno de parametroNormativo; e:7102
- [selection] sustitución por propiedad del argumento; e:7106
- [selection] sustitución de argumento exacto; e:7107
- [selection] sustitución de argumento exacto; e:7108
- [selection] selección de elemento; e:7109
- [selection] retorno de obtenerMinimosAutonomicosIrpf2021; e:7110
- [selection] retorno de resolverParametrosComunidadAutonoma2021; e:7113
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:7114
- [selection] selecciona Match; e:7115
- [selection] argumento conservado sin afirmar cierre; e:7116
- [selection] sustitución de argumento exacto; e:7119
- [selection] retorno de minimos; e:7120
- [selection] {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  } matches {
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }; e:7123
- [selection] sustitución por propiedad del argumento; e:7125
- [selection] retorno de parametroNormativo; e:7128
- [selection] sustitución por propiedad del argumento; e:7132
- [selection] sustitución por propiedad del argumento; e:7134
- [selection] sustitución por propiedad del argumento; e:7136
- [selection] selección de elemento; e:7137
- [selection] ningún matcher previo ({
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }) && else; e:7138
- [selection] retorno de obtenerMinimosAutonomicosIrpf2022; e:7139
- [selection] retorno de resolverParametrosComunidadAutonoma2022; e:7142
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:7143
- [selection] selecciona Match; e:7144
- [selection] {
    comunidadAutonoma,
    fallecidoAntesIllesBalears: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteIllesBalearsMs,
    }),
  } matches { comunidadAutonoma: "illes-balears", fallecidoAntesIllesBalears: true }; e:7146
- [selection] sustitución por propiedad del argumento; e:7148
- [selection] retorno de parametroNormativo; e:7151
- [selection] sustitución por propiedad del argumento; e:7155
- [selection] sustitución por propiedad del argumento; e:7157
- [selection] sustitución por propiedad del argumento; e:7159
- [selection] selección de elemento; e:7160
- [selection] ningún matcher previo ({ comunidadAutonoma: "illes-balears", fallecidoAntesIllesBalears: true }) && else; e:7161
- [selection] retorno de obtenerMinimosAutonomicosIrpf2023; e:7162
- [selection] retorno de resolverParametrosComunidadAutonoma2023; e:7165
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:7166
- [selection] sustitución por propiedad del argumento; e:7168
- [selection] retorno de parametroNormativo; e:7171
- [selection] sustitución por propiedad del argumento; e:7175
- [selection] sustitución de argumento exacto; e:7176
- [selection] sustitución de argumento exacto; e:7177
- [selection] selección de elemento; e:7178
- [selection] retorno de obtenerMinimosAutonomicosIrpf2024; e:7179
- [selection] retorno de resolverParametrosComunidadAutonoma2024; e:7182
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:7183
- [selection] sustitución por propiedad del argumento; e:7185
- [selection] retorno de parametroNormativo; e:7188
- [selection] sustitución por propiedad del argumento; e:7192
- [selection] sustitución de argumento exacto; e:7193
- [selection] sustitución de argumento exacto; e:7194
- [selection] selección de elemento; e:7195
- [selection] retorno de obtenerMinimosAutonomicosIrpf2025; e:7196
- [selection] retorno de resolverParametrosComunidadAutonoma2025; e:7199
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:7200
- [selection] sustitución por propiedad del argumento; e:7201
- [selection] sustitución de argumento exacto; e:7202
- [selection] selecciona Match; e:7203
- [selection] comunidadAutonoma matches "simulada-estatal"; e:7204
- [selection] ningún matcher previo ("simulada-estatal") && else; e:7205
- [selection] retorno de resolverParametrosComunidadAutonoma2026; e:7206
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:7207
- [selection] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:7208
- [selection] retorno de obtenerParametrosComunidadAutonoma; e:7209
- [selection] argumento de min; e:7214
- [selection] sustitución de argumento exacto; e:7215
- [selection] sustitución por propiedad del argumento; e:7217
- [selection] sustitución por propiedad del argumento; e:7219
- [selection] selecciona Match; e:7220
- [selection] sustitución de argumento exacto; e:7221
- [selection] receptor de operación Decimal; e:7222
- [selection] argumento de lte; e:7223
- [selection] base matches (base) => base.lte(0); e:7224
- [value] base matches (base) => base.lte(0); e:7225
- [selection] sustitución por propiedad del argumento; e:7227
- [selection] selecciona Match; e:7228
- [selection] sustitución por propiedad del argumento; e:7232
- [selection] sustitución de argumento exacto; e:7233
- [selection] sustitución de argumento exacto; e:7234
- [selection] selección de elemento; e:7235
- [value] retorno de obtenerEscalaAutonomicaIrpf2012; e:7236
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:7238
- [value] anio matches 2012; e:7239
- [selection] sustitución por propiedad del argumento; e:7242
- [selection] sustitución de argumento exacto; e:7243
- [selection] sustitución de argumento exacto; e:7244
- [selection] selección de elemento; e:7245
- [value] retorno de obtenerEscalaAutonomicaIrpf2013; e:7246
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:7248
- [value] ningún matcher previo (2012) && anio matches 2013; e:7249
- [selection] sustitución por propiedad del argumento; e:7250
- [selection] sustitución por propiedad del argumento; e:7252
- [selection] sustitución por propiedad del argumento; e:7254
- [selection] selecciona Match; e:7255
- [value] argumento conservado sin afirmar cierre; e:7256
- [value] argumento conservado sin afirmar cierre; e:7257
- [value] comunidadAutonoma matches "galicia"; e:7258
- [selection] sustitución de argumento exacto; e:7261
- [selection] selección de elemento; e:7262
- [value] ningún matcher previo ("galicia") && else; e:7263
- [value] retorno de obtenerEscalaAutonomicaIrpf2014; e:7264
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:7266
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:7267
- [selection] sustitución por propiedad del argumento; e:7268
- [selection] sustitución por propiedad del argumento; e:7270
- [selection] sustitución por propiedad del argumento; e:7272
- [selection] selecciona Match; e:7273
- [selection] argumento conservado sin afirmar cierre; e:7274
- [selection] argumento conservado sin afirmar cierre; e:7275
- [selection] retorno de fallecidoAntesDeFechaCivil; e:7276
- [selection] selecciona Match; e:7277
- [value] retorno de escala2015; e:7279
- [value] fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        }) matches true; e:7281
- [value] ningún matcher previo (true) && else; e:7287
- [value] comunidadAutonoma matches "illes-balears"; e:7288
- [value] argumento conservado sin afirmar cierre; e:7289
- [value] argumento conservado sin afirmar cierre; e:7290
- [value] ningún matcher previo ("illes-balears") && comunidadAutonoma matches "galicia"; e:7291
- [selection] sustitución de argumento exacto; e:7294
- [selection] selección de elemento; e:7295
- [value] ningún matcher previo ("illes-balears" | "galicia") && else; e:7296
- [value] retorno de obtenerEscalaAutonomicaIrpf2015; e:7297
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:7299
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:7300
- [selection] sustitución por propiedad del argumento; e:7303
- [selection] sustitución de argumento exacto; e:7304
- [selection] sustitución de argumento exacto; e:7305
- [selection] selección de elemento; e:7306
- [value] retorno de obtenerEscalaAutonomicaIrpf2016; e:7307
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:7309
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:7310
- [selection] sustitución por propiedad del argumento; e:7313
- [selection] sustitución de argumento exacto; e:7314
- [selection] sustitución de argumento exacto; e:7315
- [selection] selección de elemento; e:7316
- [value] retorno de obtenerEscalaAutonomicaIrpf2017; e:7317
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:7319
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:7320
- [selection] sustitución por propiedad del argumento; e:7323
- [selection] sustitución de argumento exacto; e:7324
- [selection] sustitución de argumento exacto; e:7325
- [selection] selección de elemento; e:7326
- [value] retorno de obtenerEscalaAutonomicaIrpf2018; e:7327
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:7329
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:7330
- [selection] sustitución por propiedad del argumento; e:7333
- [selection] sustitución de argumento exacto; e:7334
- [selection] sustitución de argumento exacto; e:7335
- [selection] selección de elemento; e:7336
- [value] retorno de obtenerEscalaAutonomicaIrpf2019; e:7337
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:7339
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:7340
- [selection] sustitución por propiedad del argumento; e:7343
- [selection] sustitución de argumento exacto; e:7344
- [selection] sustitución de argumento exacto; e:7345
- [selection] selección de elemento; e:7346
- [value] retorno de obtenerEscalaAutonomicaIrpf2020; e:7347
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:7349
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:7350
- [selection] sustitución por propiedad del argumento; e:7353
- [selection] sustitución de argumento exacto; e:7354
- [selection] sustitución de argumento exacto; e:7355
- [selection] selección de elemento; e:7356
- [value] retorno de obtenerEscalaAutonomicaIrpf2021; e:7357
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:7359
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:7360
- [selection] selecciona Match; e:7361
- [value] {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  } matches {
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }; e:7363
- [selection] sustitución por propiedad del argumento; e:7366
- [selection] sustitución por propiedad del argumento; e:7368
- [selection] sustitución por propiedad del argumento; e:7370
- [selection] selección de elemento; e:7371
- [value] ningún matcher previo ({
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }) && else; e:7372
- [value] retorno de obtenerEscalaAutonomicaIrpf2022; e:7373
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:7375
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:7376
- [selection] selecciona Match; e:7377
- [value] {
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
    }),
  } matches { comunidadAutonoma: "extremadura", fallecidoAntesExtremadura: true }; e:7379
- [selection] sustitución por propiedad del argumento; e:7382
- [selection] sustitución por propiedad del argumento; e:7384
- [selection] sustitución por propiedad del argumento; e:7386
- [selection] selección de elemento; e:7387
- [value] ningún matcher previo ({ comunidadAutonoma: "extremadura", fallecidoAntesExtremadura: true }) && else; e:7388
- [value] retorno de obtenerEscalaAutonomicaIrpf2023; e:7389
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:7391
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:7392
- [selection] sustitución por propiedad del argumento; e:7395
- [selection] sustitución de argumento exacto; e:7396
- [selection] sustitución de argumento exacto; e:7397
- [selection] selección de elemento; e:7398
- [value] retorno de obtenerEscalaAutonomicaIrpf2024; e:7399
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:7401
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:7402
- [selection] sustitución por propiedad del argumento; e:7405
- [selection] sustitución de argumento exacto; e:7406
- [selection] sustitución de argumento exacto; e:7407
- [selection] selección de elemento; e:7408
- [value] retorno de obtenerEscalaAutonomicaIrpf2025; e:7409
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:7411
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:7412
- [selection] sustitución por propiedad del argumento; e:7413
- [selection] sustitución de argumento exacto; e:7414
- [selection] selecciona Match; e:7415
- [value] comunidadAutonoma matches "simulada-estatal"; e:7416
- [value] ningún matcher previo ("simulada-estatal") && else; e:7417
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:7418
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:7419
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:7420
- [value] retorno de obtenerParametrosComunidadAutonoma; e:7421
- [value] sustitución por propiedad del argumento; e:7426
- [value] sustitución por propiedad del argumento; e:7428
- [value] argumento conservado sin afirmar cierre; e:7429
- [value] argumento conservado sin afirmar cierre; e:7430
- [value] argumento conservado sin afirmar cierre; e:7431
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:7433
- [value] !(escalasPublicadas !== undefined); e:7434
- [value] retorno de calcularDesgloseCuotaPorEscala; e:7435
- [value] argumento conservado sin afirmar cierre; e:7436
- [value] argumento de min; e:7438
- [selection] selecciona Match; e:7439
- [value] sustitución por propiedad del argumento; e:7441
- [value] retorno de parametroNormativo; e:7444
- [selection] selección de elemento; e:7448
- [value] retorno de obtenerMinimosAutonomicosIrpf2012; e:7449
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:7452
- [value] anio matches 2012; e:7453
- [value] sustitución por propiedad del argumento; e:7455
- [value] retorno de parametroNormativo; e:7458
- [selection] selección de elemento; e:7462
- [value] retorno de obtenerMinimosAutonomicosIrpf2013; e:7463
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:7466
- [value] ningún matcher previo (2012) && anio matches 2013; e:7467
- [value] sustitución por propiedad del argumento; e:7469
- [value] retorno de parametroNormativo; e:7472
- [selection] selección de elemento; e:7476
- [value] retorno de obtenerMinimosAutonomicosIrpf2014; e:7477
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:7480
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:7481
- [value] sustitución por propiedad del argumento; e:7483
- [value] retorno de parametroNormativo; e:7486
- [selection] selección de elemento; e:7490
- [value] retorno de obtenerMinimosAutonomicosIrpf2015; e:7491
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:7494
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:7495
- [value] sustitución por propiedad del argumento; e:7497
- [value] retorno de parametroNormativo; e:7500
- [selection] selección de elemento; e:7504
- [value] retorno de obtenerMinimosAutonomicosIrpf2016; e:7505
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:7508
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:7509
- [value] sustitución por propiedad del argumento; e:7511
- [value] retorno de parametroNormativo; e:7514
- [selection] selección de elemento; e:7518
- [value] retorno de obtenerMinimosAutonomicosIrpf2017; e:7519
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:7522
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:7523
- [value] sustitución por propiedad del argumento; e:7525
- [value] retorno de parametroNormativo; e:7528
- [selection] selección de elemento; e:7532
- [value] retorno de obtenerMinimosAutonomicosIrpf2018; e:7533
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:7536
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:7537
- [value] sustitución por propiedad del argumento; e:7539
- [value] retorno de parametroNormativo; e:7542
- [selection] selección de elemento; e:7546
- [value] retorno de obtenerMinimosAutonomicosIrpf2019; e:7547
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:7550
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:7551
- [value] sustitución por propiedad del argumento; e:7553
- [value] retorno de parametroNormativo; e:7556
- [selection] selección de elemento; e:7560
- [value] retorno de obtenerMinimosAutonomicosIrpf2020; e:7561
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:7564
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:7565
- [value] sustitución por propiedad del argumento; e:7567
- [value] retorno de parametroNormativo; e:7570
- [selection] selección de elemento; e:7574
- [value] retorno de obtenerMinimosAutonomicosIrpf2021; e:7575
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:7578
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:7579
- [selection] selecciona Match; e:7580
- [value] argumento conservado sin afirmar cierre; e:7581
- [value] sustitución de argumento exacto; e:7584
- [value] retorno de minimos; e:7585
- [value] {
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  } matches {
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }; e:7588
- [value] sustitución por propiedad del argumento; e:7590
- [value] retorno de parametroNormativo; e:7593
- [selection] selección de elemento; e:7597
- [value] ningún matcher previo ({
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      }) && else; e:7598
- [value] retorno de obtenerMinimosAutonomicosIrpf2022; e:7599
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:7602
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:7603
- [selection] selecciona Match; e:7604
- [value] {
    comunidadAutonoma,
    fallecidoAntesIllesBalears: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteIllesBalearsMs,
    }),
  } matches { comunidadAutonoma: "illes-balears", fallecidoAntesIllesBalears: true }; e:7606
- [value] sustitución por propiedad del argumento; e:7608
- [value] retorno de parametroNormativo; e:7611
- [selection] selección de elemento; e:7615
- [value] ningún matcher previo ({ comunidadAutonoma: "illes-balears", fallecidoAntesIllesBalears: true }) && else; e:7616
- [value] retorno de obtenerMinimosAutonomicosIrpf2023; e:7617
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:7620
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:7621
- [value] sustitución por propiedad del argumento; e:7623
- [value] retorno de parametroNormativo; e:7626
- [selection] selección de elemento; e:7630
- [value] retorno de obtenerMinimosAutonomicosIrpf2024; e:7631
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:7634
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:7635
- [value] sustitución por propiedad del argumento; e:7637
- [value] retorno de parametroNormativo; e:7640
- [selection] selección de elemento; e:7644
- [value] retorno de obtenerMinimosAutonomicosIrpf2025; e:7645
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:7648
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:7649
- [selection] selecciona Match; e:7650
- [value] comunidadAutonoma matches "simulada-estatal"; e:7651
- [value] ningún matcher previo ("simulada-estatal") && else; e:7652
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:7653
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:7654
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:7655
- [value] retorno de obtenerParametrosComunidadAutonoma; e:7656
- [value] argumento de min; e:7661
- [value] sustitución de argumento exacto; e:7662
- [value] sustitución por propiedad del argumento; e:7664
- [value] receptor de operación Decimal; e:7665
- [value] argumento de mul; e:7666
- [value] argumento conservado sin afirmar cierre; e:7667
- [value] argumento conservado sin afirmar cierre; e:7668
- [value] retorno de calcularCuotaPorEscala; e:7669
- [value] retorno de autonomica; e:7670
- [value] argumento de minus; e:7671
- [value] argumento de max; e:7672

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
