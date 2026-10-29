# anual.minimo.autonomico

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: parametrosComunidad.minimoAutonomicoIgualEstatal
                ? "Coincide con el mínimo estatal"
                : `Minimos autonomicos IRPF ${caso.anio} de ${parametrosComunidad.escalaAutonomica.nombre}`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.general (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- caso.situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      situacionFamili / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63629
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minim / total (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20423
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- caso / comunidadAutonoma (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- minimos.contribuyente / adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63016–63033
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20385–20422
- minimoDiscapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63731–63762
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMinimos)) / total (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20264–20423
- incrementoMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
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
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20200
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63591
- minimos.contribuyente / general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63044–63051
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso.situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- minimos.contribuyente.adicionalMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- familiares / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- minimos.contribuyente.adicionalMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- minimoAscendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63701–63719
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- minimoContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63659
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20216
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- minimoDescendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63670–63689
- yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _ta / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16362–17338
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- parametrosComunidad / minimosAutonomicos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- caso / situacionFamiliar.discapacidad (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- derechosAutonomicos / total (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21776
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- caso.comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16181–16203
- minimos.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- minimoBase / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunid / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16424–17334
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- undefined / total (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20239–20248
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63148
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.adicionalMayor75 (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63720
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / value (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20196–20230
- calcularMinimoPersonalYFamiliar({
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos, / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21791–21958
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62967–63057
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63429–63518
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimoDiscapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63774–63802
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16112–16116
- derechosAutonomicos?.total / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21757–21783
- obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fech / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16057–16266
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63323–63389
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- caso / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16181–16185
- discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21872
- situacionFamiliar.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63501
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- {
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16096–16265
- minimoPersonalYFamiliarAutonomico / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:45229–45262
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63470–63487
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
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
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- situacionFamiliar.discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20401–20421
- obtenerMinimoDiscapacidadAscendientes(
      situacionFamiliar.ascendientes,
      minimos
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63529–63625
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63016–63038
- obtenerMinimoDescendientes(
    situacionFamiliar.descendientes,
    minimos
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63196–63276
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- medirAuditoriaSync(
    "liquidacion.parametrosComunidad.obtener",
    () =>
      obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        bas / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15974–16270
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- minimoContribuyente
    .plus(minimoDescendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63690
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20221–20230
- Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "Res / minimosAutonomicos.contribuyente.general (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16369–17338
- parametrosComunidad / minimosAutonomicos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21931
- resultadoParametrosComunidad / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16390–16418
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63362–63379
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
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
- obtenerMinimoAscendientes(
    situacionFamiliar.ascendientes,
    minimos
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63087–63165
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63763
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63574–63604
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63640–63803
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- {
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  } / minimos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:62994–63056
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- {
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16096–16265
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- caso / situacionFamiliar.descendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:63118–63135
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- parametrosComunidad.minimosAutonomicos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- minimoBase.plus(incrementoMayor65) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- minimos.contribuyente / adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:16112–16121
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- caso / situacionFamiliar.ascendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- parametrosComunidad.minimosAutonomicos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21912–21950
- caso / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21850–21854
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1443
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- {
      situacionFamiliar: caso.situacionFamiliar,
      anio: caso.anio,
      minimos: parametrosComunidad.minimosAutonomicos,
    } / minimos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21823–21957
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          parametrosComunidad.minimosAutonomicos
        ).pipe(Effect.mapError(errorDerechosMin / total (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20257–20423
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- incrementoMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593

## Condiciones por relación

- [selection] binding único desde servicio anual; e:2001
- [selection] sustitución por propiedad del argumento; e:2004
- [selection] binding único desde servicio anual; e:2034
- [selection] sustitución por propiedad del argumento; e:2037
- [selection] sustitución de argumento exacto; e:2038
- [selection] binding único desde servicio anual; e:4094
- [selection] ===; e:4097
- [selection] binding único desde servicio anual; e:4120
- [selection] sustitución por propiedad del argumento; e:4123
- [selection] sustitución por propiedad del argumento; e:4126
- [selection] sustitución de argumento exacto; e:4128
- [selection] >=; e:4130
- [selection] sustitución por propiedad del argumento; e:4152
- [selection] sustitución de argumento exacto; e:4154
- [selection] >=; e:4156
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

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
