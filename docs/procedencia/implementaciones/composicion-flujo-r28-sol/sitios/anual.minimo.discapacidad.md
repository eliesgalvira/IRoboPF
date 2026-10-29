# anual.minimo.discapacidad

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Contribuyente, descendientes y ascendientes con discapacidad computados"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  ) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1114–1222
- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19976
- undefined / discapacidadContribuyente (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- derechosEstatales?.discapacidadFamiliares ??
    obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).p / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21510
- familiares / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1425–1435
- (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    ) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1451–1610
- caso / situacionFamiliar.descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21313
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21375
- derechosEstatales / discapacidadFamiliares (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21234
- situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1165
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosEstatales?.discapacidadContribuyente ??
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21173
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        min / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1406–1614
- caso / situacionFamiliar.ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21439
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- caso.situacionFamiliar.ascendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21470
- EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
    / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1802–2017
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
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / discapacidadFamiliares (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19960
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19981–19990
- minimoDiscapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:45794–45822
- caso / situacionFamiliar.discapacidad (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
  / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1849–2013
- undefined / discapacidadFamiliares (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minim / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/minimos/minimo-discapacidad.ts:587–921
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadFamiliares (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- obtenerMinimoDiscapacidadFamiliares(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ).plus(
      obtenerMinimoDiscapacidadAscendientes( / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21266–21510
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- situacionFamiliar.discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1148–1178
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1835–1847
- derechosEstatales?.discapacidadFamiliares / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21217–21258
- obtenerMinimoDiscapacidadAscendientes(
        caso.situacionFamiliar.ascendientes,
        minimosEstatales
      ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21388–21504
- obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21075–21173
- minimoDiscapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:45740–45771
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- discapacidad / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:573–585
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / discapacidadContribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- derechosEstatales / discapacidadContribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21040
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19990
- ascendientes / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1821–1833
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-discapacidad.ts:1437–1449
- caso / situacionFamiliar.discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21125
- caso.situacionFamiliar.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21345
- minimoDiscapacidadContribuyente.plus(
                minimoDiscapacidadFamiliares
              ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:45740–45838
- caso.situacionFamiliar / ascendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21435–21457
- caso / situacionFamiliar.descendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso.situacionFamiliar / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21309–21331
- caso.situacionFamiliar / discapacidad (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21121–21143
- derechosEstatales?.discapacidadContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:21023–21067
- caso / situacionFamiliar.ascendientes (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159
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

## Condiciones por relación

- [selection] binding único desde servicio anual; e:3574
- [selection] ===; e:3577
- [value] argumento conservado sin afirmar cierre; e:5551
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
- [value] receptor de operación Decimal; e:7933
- [value] argumento de plus; e:7935

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
