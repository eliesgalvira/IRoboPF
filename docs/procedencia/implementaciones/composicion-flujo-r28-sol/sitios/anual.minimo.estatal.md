# anual.minimo.estatal

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: `${euros(minimoContribuyente)} + ${euros(minimoDescendientes)} + ${euros(minimoAscendientes)} + ${euros(minimoDiscapacidadContribuyente)} + ${euros(minimoDiscapacidadFamiliares)}`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- derechosEstatales?.contribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20490
- derechosEstatales / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20681
- undefined / contribuyente (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- caso.situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20771
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- minimoBase.plus(incrementoMayor65) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1594
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19976
- derechosEstatales?.contribuyente ??
    obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstat / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20630
- undefined / discapacidadContribuyente (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacida / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-ascendientes.ts:512–975
- derechosEstatales?.discapacidadFamiliares ??
    obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).p / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21510
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliar / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21708
- derechosEstatales / contribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20475
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- familiares / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- minimoDiscapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21636–21667
- caso / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21313
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21375
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- derechosEstatales / discapacidadFamiliares (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21234
- obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20498–20630
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21625
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- derechosEstatales?.discapacidadContribuyente ??
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21173
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- minimos.contribuyente / adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- derechosEstatales?.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20695
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- minimos.contribuyente / adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / ascendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12379
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21439
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- minimoContribuyente
    .plus(minimoDescendientes) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21595
- caso.situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21470
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- derechosEstatales?.descendientes ??
    obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20976
- minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21668
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20703–20801
- obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20876–20976
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadFamiliares (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19960
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19981–19990
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- caso.situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20589
- caso / situacionFamiliar.discapacidad (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20566
- undefined / discapacidadFamiliares (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- derechosEstatales / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20853
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- minimosEstatales / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- minimosEstatales / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- incrementoMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- undefined / descendientes (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).plus(
      obtenerMinimoDiscapacidadAscendientes( / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21510
- minimoContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21545–21564
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimoDiscapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21679–21707
- situacionFamiliar.discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- minimoDescendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21575–21594
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:545–557
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1443
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12384
- derechosEstatales?.ascendientes ??
    obtenerMinimoAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20664–20801
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20584
- derechosEstatales?.discapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21258
- obtenerMinimoDiscapacidadAscendientes(
        caso.situacionFamiliar.ascendientes,
        minimosEstatales
      ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21388–21504
- minimos.contribuyente.adicionalMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21075–21173
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- minimoPersonalYFamiliar / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:44769–44792
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
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad >= 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos. / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-ascendientes.ts:559–974
- minimoAscendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21606–21624
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- MINIMOS_ESTATALES_2012 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- MINIMOS_ESTATALES_2013 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- minimos.contribuyente / general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- derechosEstatales / discapacidadContribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21040
- minimosEstatales / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19990
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20758
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- minimos.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- caso / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21125
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-ascendientes.ts:531–543
- minimoBase / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- caso.situacionFamiliar.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21345
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20736–20740
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / contribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21457
- caso / situacionFamiliar.descendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- caso.situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21331
- derechosEstatales?.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20868
- caso.situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21143
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- derechosEstatales?.discapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21067
- caso / situacionFamiliar.ascendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- minimos.contribuyente.adicionalMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1501
- MINIMOS_ESTATALES_2014 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- incrementoMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1576–1593
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadContribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMov / value (EUR, value); Contrato de llamada pendiente: Match.valueTags; lib/dominio/irpf/minimos/minimo-discapacidad.ts:557–922
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- undefined / ascendientes (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008

## Condiciones por relación

- [selection] binding único desde servicio anual; e:3574
- [selection] ===; e:3577
- [selection] binding único desde servicio anual; e:3587
- [selection] binding único desde servicio anual; e:3608
- [selection] sustitución por propiedad del argumento; e:3612
- [selection] sustitución de argumento exacto; e:3614
- [selection] >=; e:3616
- [selection] sustitución por propiedad del argumento; e:3644
- [selection] sustitución de argumento exacto; e:3646
- [selection] >=; e:3648
- [selection] selecciona rama; e:5549
- [value] caso.derechosMinimos === undefined; e:5550
- [value] argumento conservado sin afirmar cierre; e:5551
- [value] argumento conservado sin afirmar cierre; e:5552
- [value] !(caso.derechosMinimos === undefined); e:5554
- [selection] selecciona Match; e:5558
- [value] caso.anio matches 2012; e:5560
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:5562
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:5564
- [value] binding único desde servicio anual; e:5565
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:5568
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5569
- [value] sustitución por propiedad del argumento; e:5572
- [value] receptor de operación Decimal; e:5576
- [selection] selecciona Match; e:5577
- [selection] edad matches (edad) => edad >= 65; e:5578
- [selection] selecciona Match; e:5579
- [value] caso.anio matches 2012; e:5581
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:5583
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:5585
- [value] binding único desde servicio anual; e:5586
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:5589
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5590
- [value] sustitución por propiedad del argumento; e:5593
- [value] edad matches (edad) => edad >= 65; e:5596
- [value] sustitución de argumento exacto; e:5597
- [value] constructor Decimal; e:5598
- [value] retorno de crearImporteMonetario; e:5599
- [value] ningún matcher previo ((edad) => edad >= 65) && else; e:5601
- [value] argumento de plus; e:5603
- [value] receptor de operación Decimal; e:5604
- [selection] selecciona Match; e:5605
- [selection] edad matches (edad) => edad >= 75; e:5606
- [selection] selecciona Match; e:5607
- [value] caso.anio matches 2012; e:5609
- [value] ningún matcher previo (2012) && caso.anio matches 2013; e:5611
- [value] ningún matcher previo (2012 | 2013) && caso.anio matches 2014; e:5613
- [value] binding único desde servicio anual; e:5614
- [value] ningún matcher previo (2012 | 2013 | 2014) && else; e:5617
- [value] si calcular devuelve; instrumentación no transforma el valor; e:5618
- [value] sustitución por propiedad del argumento; e:5621
- [value] edad matches (edad) => edad >= 75; e:5624
- [value] sustitución de argumento exacto; e:5625
- [value] constructor Decimal; e:5626
- [value] retorno de crearImporteMonetario; e:5627
- [value] ningún matcher previo ((edad) => edad >= 75) && else; e:5629
- [value] argumento de plus; e:5631
- [value] retorno de obtenerMinimoContribuyente; e:5632
- [value] ??; e:5633
- [value] receptor de operación Decimal; e:5635
- [selection] selecciona rama; e:5636
- [value] caso.derechosMinimos === undefined; e:5637
- [value] argumento conservado sin afirmar cierre; e:5638
- [value] !(caso.derechosMinimos === undefined); e:5640
- [value] argumento conservado sin afirmar cierre; e:5644
- [value] argumento conservado sin afirmar cierre; e:5645
- [value] sustitución de argumento exacto; e:5646
- [value] constructor Decimal; e:5647
- [value] retorno de crearImporteMonetario; e:5648
- [value] argumento conservado sin afirmar cierre; e:5650
- [value] argumento conservado sin afirmar cierre; e:5651
- [value] retorno de obtenerMinimoDescendientes; e:5652
- [value] ??; e:5653
- [value] argumento de plus; e:5655
- [value] receptor de operación Decimal; e:5656
- [selection] selecciona rama; e:5657
- [value] caso.derechosMinimos === undefined; e:5658
- [value] argumento conservado sin afirmar cierre; e:5659
- [value] !(caso.derechosMinimos === undefined); e:5661
- [value] binding único desde servicio anual; e:5665
- [value] sustitución de argumento exacto; e:5668
- [value] argumento conservado sin afirmar cierre; e:5669
- [value] sustitución de argumento exacto; e:5670
- [value] constructor Decimal; e:5671
- [value] retorno de crearImporteMonetario; e:5672
- [value] argumento conservado sin afirmar cierre; e:5674
- [value] argumento conservado sin afirmar cierre; e:5675
- [value] retorno de obtenerMinimoAscendientes; e:5676
- [value] ??; e:5677
- [value] argumento de plus; e:5679
- [value] receptor de operación Decimal; e:5680
- [selection] selecciona rama; e:5681
- [value] caso.derechosMinimos === undefined; e:5682
- [value] argumento conservado sin afirmar cierre; e:5683
- [value] !(caso.derechosMinimos === undefined); e:5685
- [value] binding único desde servicio anual; e:5689
- [value] sustitución de argumento exacto; e:5691
- [value] sustitución de argumento exacto; e:5693
- [value] argumento conservado sin afirmar cierre; e:5694
- [value] argumento conservado sin afirmar cierre; e:5695
- [value] retorno de obtenerMinimoPorDiscapacidad; e:5696
- [value] retorno de obtenerMinimoDiscapacidadContribuyente; e:5697
- [value] ??; e:5698
- [value] argumento de plus; e:5700
- [value] receptor de operación Decimal; e:5701
- [selection] selecciona rama; e:5702
- [value] caso.derechosMinimos === undefined; e:5703
- [value] argumento conservado sin afirmar cierre; e:5704
- [value] !(caso.derechosMinimos === undefined); e:5706
- [value] binding único desde servicio anual; e:5710
- [value] sustitución de argumento exacto; e:5713
- [value] argumento conservado sin afirmar cierre; e:5714
- [value] sustitución de argumento exacto; e:5715
- [value] constructor Decimal; e:5716
- [value] retorno de crearImporteMonetario; e:5717
- [value] argumento conservado sin afirmar cierre; e:5719
- [value] argumento conservado sin afirmar cierre; e:5720
- [value] retorno de obtenerMinimoDiscapacidadFamiliares; e:5721
- [value] receptor de operación Decimal; e:5722
- [value] binding único desde servicio anual; e:5723
- [value] sustitución de argumento exacto; e:5726
- [value] argumento conservado sin afirmar cierre; e:5727
- [value] sustitución de argumento exacto; e:5728
- [value] constructor Decimal; e:5729
- [value] retorno de crearImporteMonetario; e:5730
- [value] argumento conservado sin afirmar cierre; e:5732
- [value] argumento conservado sin afirmar cierre; e:5733
- [value] retorno de obtenerMinimoDiscapacidadAscendientes; e:5734
- [value] argumento de plus; e:5735
- [value] ??; e:5736
- [value] argumento de plus; e:5738

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
