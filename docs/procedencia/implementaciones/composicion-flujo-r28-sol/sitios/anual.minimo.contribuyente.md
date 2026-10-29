# anual.minimo.contribuyente

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: `Edad del contribuyente: ${caso.situacionFamiliar.edad}`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- derechosEstatales?.contribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20490
- undefined / contribuyente (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
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
- edad >= 75 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1439–1449
- derechosEstatales / contribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20458–20475
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2013.ts:1072–1609
- obtenerMinimoContribuyente({
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20498–20630
- MINIMOS_ESTATALES_2014 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12535–12557
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / minimos.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1532–1544
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor75 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2012.ts:1072–1609
- minimos.contribuyente / adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1484
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- minimos.contribuyente / adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1289
- caso / anio (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12379
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1383–1549
- caso / situacionFamiliar.edad (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- minimos / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1275
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
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
- MINIMOS_ESTATALES_2013 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor65 (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- caso.situacionFamiliar.edad / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20589
- caso / situacionFamiliar.edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20566
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1248
- minimosEstatales / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- minimosEstatales / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20606–20622
- incrementoMayor75 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1600–1617
- Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CER / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1188–1354
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1200–1204
- MINIMOS_ESTATALES_2012 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
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
- caso.anio / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12375–12384
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.general (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- caso.situacionFamiliar / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20562–20584
- minimos.contribuyente.adicionalMayor65 / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1268–1306
- 75 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1447–1449
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.general (EUR, value); Parámetro de auxiliar/callback sin binding: dependencias; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9404–9416
- medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
     / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12292–12674
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
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- edad / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1395–1399
- MINIMOS_ESTATALES_2012 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12423–12445
- MINIMOS_ESTATALES_2013 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12479–12501
- minimos.contribuyente / general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1151
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
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
- minimoBase.plus(incrementoMayor65).plus(incrementoMayor75) / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1618
- {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    prim / contribuyente.adicionalMayor65 (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/normativa/datos/minimos-autonomicos-2014.ts:1072–1609
- minimos.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1159
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 65 / value (selector, selection); literal; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1252–1254
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1337–1349
- dependencias.parametrosNormativos / minimosEstatales2025.contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12631
- dependencias / parametrosNormativos.minimosEstatales2025.contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12610
- minimoBase / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1560–1570
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when( / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12363–12670
- minimos / contribuyente.general (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1130–1137
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / contribuyente (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- edad >= 65 / value (selector, selection); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1244–1254
- minimoContribuyente / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:43159–43178
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / contribuyente (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
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
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- dependencias.parametrosNormativos.minimosEstatales2025 / contribuyente.adicionalMayor65 (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12598–12652
- minimos / contribuyente.adicionalMayor75 (EUR, value); productor; lib/dominio/irpf/minimos/minimo-contribuyente.ts:1463–1470
- {
      anio: caso.anio,
      edad: caso.situacionFamiliar.edad,
      minimos: minimosEstatales,
    } / edad (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20525–20629

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

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
