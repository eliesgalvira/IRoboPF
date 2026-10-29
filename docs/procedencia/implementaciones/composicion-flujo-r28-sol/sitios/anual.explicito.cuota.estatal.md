# anual.explicito.cuota.estatal

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "escala(base positiva) − escala(mínimo limitado a base)"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:581–752
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13481–13513
- minimosIrpf / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2252–2263
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- TRAMOS_IRPF_ESTATAL_GENERAL_2013 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6385–6417
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:1976–1977
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- estatal(base) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8146–8159
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- "5550" / value (EUR, value); literal; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2353–2359
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7502–7510
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / escalaEstatalGeneral (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- importe("5550") / value (selector, selection); Contrato de llamada pendiente: importe; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2345–2360
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- estatal(base).minus(
      estatal(D.min(base, MINIMOS_ESTATALES_2025.contribuyente.general))
    ) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8146–8245
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- D.max(
    0,
    estatal(base).minus(
      estatal(D.min(base, MINIMOS_ESTATALES_2025.contribuyente.general))
    )
  ) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8128–8249
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- { base: b, tramos: parametros.escalaEstatalGeneral } / tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- TRAMOS_IRPF_ESTATAL_GENERAL_2017 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9350–9382
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7402–7403
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15026–15058
- base / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8154–8158
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- resolverParametrosComunidadAutonoma2026(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18304–18362
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:581–752
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- escalasPublicadas !== undefined / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1908
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [imp / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:1771–2041
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- resolverParametrosComunidadAutonoma2021(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17715–17773
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- base / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8154–8158
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7426–7549
- base / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8187–8191
- minimosIrpf / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2252–2263
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–1894
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15412–15429
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- resolverParametrosComunidadAutonoma2012(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16696–16754
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7473–7477
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- TRAMOS_IRPF_ESTATAL_GENERAL_2017 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9350–9382
- TRAMOS_IRPF_ESTATAL_GENERAL_2015 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7946–7978
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- calcularCuotaPorEscala({ base: b, tramos: parametros.escalaEstatalGeneral }) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7814–7890
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- {
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: {
    pri / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2311–2817
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12018–12050
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / escalaEstatalGeneral (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12685–12717
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- TRAMOS_IRPF_ESTATAL_GENERAL_2018 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10017–10049
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:581–752
- { base: b, tramos: parametros.escalaEstatalGeneral } / base (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- parametros.escalaEstatalGeneral / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7856–7887
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14761–15262
- { base: b, tramos: parametros.escalaEstatalGeneral } / base (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- new D(0) / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1970–1978
- minimos({
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: { / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2303–2818
- { base, tramos, escalasPublicadas } / base (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  } / general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2330–2443
- TRAMOS_IRPF_ESTATAL_GENERAL_2012 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5753–5785
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5523–5930
- calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1474–1541
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3256–3262
- resolverParametrosComunidadAutonoma2017(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17319–17377
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- parametros / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7856–7866
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6155–6562
- { base: b, tramos: parametros.escalaEstatalGeneral } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / escalaEstatalGeneral (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- {
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: {
    pri / contribuyente.general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2311–2817
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- MINIMOS_ESTATALES_2025 / contribuyente.general (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8193–8215
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11086–11528
- 2025 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7473–7477
- D.max(neto, 0) / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7390–7404
- [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [imp / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:1575–1845
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- D.min(base, MINIMOS_ESTATALES_2025.contribuyente.general) / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8181–8238
- TRAMOS_IRPF_ESTATAL_GENERAL_2018 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10017–10049
- TRAMOS_IRPF_ESTATAL_GENERAL_2013 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6385–6417
- D.max(neto, 0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7390–7404
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2017.ts:581–752
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10419–10861
- parametros.escalaEstatalGeneral / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7856–7887
- "madrid" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7502–7510
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- escalasPublicadas !== undefined
    ? EffectArray.flatMap(escalasPublicadas, (filas) =>
        Option.match(
          EffectArray.findLast(
            filas, / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1877–4468
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2016.ts:581–752
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- TRAMOS_IRPF_ESTATAL_GENERAL_2016 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8683–8715
- TRAMOS_IRPF_ESTATAL_GENERAL_2016 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8683–8715
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(34000), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:872–1043
- [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [imp / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:1575–1845
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12685–12717
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- obtenerParametrosComunidadAutonoma({
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7426–7549
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:8418–8860
- TRAMOS_IRPF_ESTATAL_GENERAL_2015 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7946–7978
- "5550" / value (selector, selection); literal; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2353–2359
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / anio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:581–752
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- estatal(D.min(base, MINIMOS_ESTATALES_2025.contribuyente.general)) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8173–8239
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- neto / value (selector, selection); Asignaciones y flujo imperativo pendientes: neto; lib/dominio/irpf/trabajo-anual/conexion.ts:7396–7400
- { base, tramos, escalasPublicadas } / tramos (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- { base: b, tramos: parametros.escalaEstatalGeneral } / base (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- base.mul(0) / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1558
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- minimos({
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: { / contribuyente.general (EUR, value); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2303–2818
- D.min(base, MINIMOS_ESTATALES_2025.contribuyente.general) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8181–8238
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3129
- importe("5550") / value (EUR, value); Contrato de llamada pendiente: importe; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2345–2360
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2019.ts:581–752
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16894–17002
- { base: b, tramos: parametros.escalaEstatalGeneral } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no i / escalaEstatalGeneral (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18412–18909
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14318–14350
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- calcularCuotaPorEscala({ base: b, tramos: parametros.escalaEstatalGeneral }) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7814–7890
- TRAMOS_IRPF_ESTATAL_GENERAL_2019 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10684–10716
- resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17043–17179
- ({
          _tag: "ParametrosComunidadAutonoma",
          comunidadAutonoma,
          anio: 2026,
          minimoAutonomicoIgualEstatal: true,
          esc / escalaEstatalGeneral (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15499–15988
- base / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8187–8191
- resolverParametrosComunidadAutonoma2016(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17220–17278
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- resolverParametrosComunidadAutonoma2020(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17616–17674
- resolverParametrosComunidadAutonoma2018(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17418–17476
- TRAMOS_IRPF_ESTATAL_GENERAL_2014 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7121–7153
- resolverParametrosComunidadAutonoma2013(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16795–16853
- TRAMOS_IRPF_ESTATAL_GENERAL_2020 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11351–11383
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- { base, tramos, escalasPublicadas } / escalasPublicadas (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1505–1540
- cuotaEstatal / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:10583–10595
- anio / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16651–16655
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13481–13513
- resolverParametrosComunidadAutonoma2024(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18106–18164
- MINIMOS_ESTATALES_2025.contribuyente / general (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8193–8229
- { base: b, tramos: parametros.escalaEstatalGeneral } / tramos (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:8139–8140
- b / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7845–7846
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(34000), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2015.ts:872–1043
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1507–1511
- comunidadAutonoma / value (selector, selection); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18344–18361
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:581–752
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14318–14350
- MINIMOS_ESTATALES_2025 / contribuyente.general (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8193–8215
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2020.ts:581–752
- neto / value (EUR, value); Asignaciones y flujo imperativo pendientes: neto; lib/dominio/irpf/trabajo-anual/conexion.ts:7396–7400
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- escalasPublicadas / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1521–1538
- [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [imp / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2013.ts:1575–1845
- Match.value(base).pipe(
        Match.when(
          (base) => base.lte(0),
          () => []
        ),
        Match.orElse(
          (base) =>
            / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3061–4468
- resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17814–17919
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11753–12195
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- TRAMOS_IRPF_ESTATAL_GENERAL_2014 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7121–7153
- { base: b, tramos: parametros.escalaEstatalGeneral } / base (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7837–7889
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4450
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15026–15058
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12420–12862
- 0 / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3134–3135
- resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      }) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17960–18065
- 0 / value (EUR, value); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1556–1557
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:14053–14536
- parametros / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7856–7866
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- TRAMOS_IRPF_ESTATAL_GENERAL_2019 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:10684–10716
- undefined / value (selector, selection); literal; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1899–1908
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9085–9527
- b / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7845–7846
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [imp / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2012.ts:1575–1845
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1970–1978
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_202 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:13216–13699
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio: 2026,
          motivo:
            "IRPF 2026 solo esta modelad / escalaEstatalGeneral (EUR, value); Forma AST no admitida: SatisfiesExpression; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16051–16416
- tramos / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1513–1519
- resolverParametrosComunidadAutonoma2019(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:17517–17575
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo( / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2018.ts:581–752
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- b / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7845–7846
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:9752–10194
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:7716–8193
- b / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7845–7846
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- base / value (EUR, value); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1547–1551
- [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [imp / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2014.ts:1771–2041
- {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_201 / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:6891–7342
- base.lte(0) / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3125–3136
- TRAMOS_IRPF_ESTATAL_GENERAL_2012 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:5753–5785
- 0 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:1976–1977
- [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("2 / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-autonomico-2025.ts:645–851
- Match.value(comunidadAutonoma).pipe(
    Match.when(
      "simulada-estatal",
      () =>
        ({
          _tag: "ParametrosComunidadAutonoma",
          c / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:15400–16426
- MINIMOS_ESTATALES_2025.contribuyente / general (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8193–8229
- MINIMOS_ESTATALES_2025.contribuyente.general / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8193–8237
- {
    anio: 2025,
    comunidadAutonoma: "madrid",
    baseLiquidableGeneral: base,
  } / comunidadAutonoma (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:7461–7548
- TRAMOS_IRPF_ESTATAL_GENERAL_2020 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:11351–11383
- TRAMOS_IRPF_ESTATAL_GENERAL_2025 / value (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:12018–12050
- Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      reso / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:16639–18919
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- MINIMOS_ESTATALES_2025.contribuyente.general / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:8193–8237
- base / value (selector, selection); productor; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3073–3077
- {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  } / general (selector, selection); productor; lib/dominio/normativa/datos/minimos-autonomicos-2025.ts:2330–2443
- resolverParametrosComunidadAutonoma2025(comunidadAutonoma) / escalaEstatalGeneral (EUR, value); productor; lib/dominio/irpf/comunidades/comunidad-autonoma.ts:18205–18263
- 0 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/conexion.ts:7402–7403
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413

## Condiciones por relación

- [value] constructor Decimal; e:6402
- [selection] constructor Decimal; e:6551
- [selection] argumento de max; e:6553
- [selection] argumento de max; e:6554
- [value] argumento de max; e:6779
- [value] argumento de max; e:6780
- [value] argumento de max; e:7674
- [selection] sustitución por propiedad del argumento; e:7675
- [selection] sustitución por propiedad del argumento; e:7677
- [selection] !==; e:7679
- [selection] selecciona rama; e:7680
- [selection] sustitución de argumento exacto; e:7682
- [selection] sustitución por propiedad del argumento; e:7684
- [selection] sustitución por propiedad del argumento; e:7686
- [selection] selecciona Match; e:7687
- [selection] sustitución de argumento exacto; e:7688
- [selection] receptor de operación Decimal; e:7689
- [selection] argumento de lte; e:7690
- [selection] base matches (base) => base.lte(0); e:7691
- [value] base matches (base) => base.lte(0); e:7692
- [selection] sustitución por propiedad del argumento; e:7694
- [selection] selecciona Match; e:7695
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:7698
- [value] anio matches 2012; e:7699
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:7702
- [value] ningún matcher previo (2012) && anio matches 2013; e:7703
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:7706
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:7707
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:7710
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:7711
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:7714
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:7715
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:7718
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:7719
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:7722
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:7723
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:7726
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:7727
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:7730
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:7731
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:7734
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:7735
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:7738
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:7739
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:7742
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:7743
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:7746
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:7747
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:7750
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:7751
- [selection] sustitución por propiedad del argumento; e:7753
- [selection] sustitución de argumento exacto; e:7754
- [selection] selecciona Match; e:7755
- [value] comunidadAutonoma matches "simulada-estatal"; e:7756
- [value] ningún matcher previo ("simulada-estatal") && else; e:7757
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:7758
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:7759
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:7760
- [value] retorno de obtenerParametrosComunidadAutonoma; e:7761
- [value] sustitución por propiedad del argumento; e:7765
- [value] sustitución por propiedad del argumento; e:7767
- [value] argumento conservado sin afirmar cierre; e:7768
- [value] argumento conservado sin afirmar cierre; e:7769
- [value] argumento conservado sin afirmar cierre; e:7770
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:7772
- [value] !(escalasPublicadas !== undefined); e:7773
- [value] retorno de calcularDesgloseCuotaPorEscala; e:7774
- [value] argumento conservado sin afirmar cierre; e:7775
- [value] sustitución de argumento exacto; e:7777
- [value] sustitución por propiedad del argumento; e:7779
- [value] receptor de operación Decimal; e:7780
- [value] argumento de mul; e:7781
- [value] argumento conservado sin afirmar cierre; e:7782
- [value] argumento conservado sin afirmar cierre; e:7783
- [value] retorno de calcularCuotaPorEscala; e:7784
- [value] retorno de estatal; e:7785
- [value] receptor de operación Decimal; e:7786
- [selection] sustitución por propiedad del argumento; e:7787
- [selection] sustitución por propiedad del argumento; e:7789
- [selection] !==; e:7791
- [selection] selecciona rama; e:7792
- [selection] argumento de min; e:7794
- [selection] argumento conservado sin afirmar cierre; e:7795
- [selection] sustitución de argumento exacto; e:7798
- [selection] retorno de minimos; e:7799
- [selection] argumento de min; e:7803
- [selection] sustitución de argumento exacto; e:7804
- [selection] sustitución por propiedad del argumento; e:7806
- [selection] sustitución por propiedad del argumento; e:7808
- [selection] selecciona Match; e:7809
- [selection] sustitución de argumento exacto; e:7810
- [selection] receptor de operación Decimal; e:7811
- [selection] argumento de lte; e:7812
- [selection] base matches (base) => base.lte(0); e:7813
- [value] base matches (base) => base.lte(0); e:7814
- [selection] sustitución por propiedad del argumento; e:7816
- [selection] selecciona Match; e:7817
- [value] retorno de resolverParametrosComunidadAutonoma2012; e:7820
- [value] anio matches 2012; e:7821
- [value] retorno de resolverParametrosComunidadAutonoma2013; e:7824
- [value] ningún matcher previo (2012) && anio matches 2013; e:7825
- [value] retorno de resolverParametrosComunidadAutonoma2014; e:7828
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:7829
- [value] retorno de resolverParametrosComunidadAutonoma2015; e:7832
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:7833
- [value] retorno de resolverParametrosComunidadAutonoma2016; e:7836
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:7837
- [value] retorno de resolverParametrosComunidadAutonoma2017; e:7840
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:7841
- [value] retorno de resolverParametrosComunidadAutonoma2018; e:7844
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:7845
- [value] retorno de resolverParametrosComunidadAutonoma2019; e:7848
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:7849
- [value] retorno de resolverParametrosComunidadAutonoma2020; e:7852
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:7853
- [value] retorno de resolverParametrosComunidadAutonoma2021; e:7856
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:7857
- [value] retorno de resolverParametrosComunidadAutonoma2022; e:7860
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:7861
- [value] retorno de resolverParametrosComunidadAutonoma2023; e:7864
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:7865
- [value] retorno de resolverParametrosComunidadAutonoma2024; e:7868
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:7869
- [value] retorno de resolverParametrosComunidadAutonoma2025; e:7872
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && anio matches 2025; e:7873
- [selection] sustitución por propiedad del argumento; e:7875
- [selection] sustitución de argumento exacto; e:7876
- [selection] selecciona Match; e:7877
- [value] comunidadAutonoma matches "simulada-estatal"; e:7878
- [value] ningún matcher previo ("simulada-estatal") && else; e:7879
- [value] retorno de resolverParametrosComunidadAutonoma2026; e:7880
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025) && anio matches 2026; e:7881
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026) && else; e:7882
- [value] retorno de obtenerParametrosComunidadAutonoma; e:7883
- [value] sustitución por propiedad del argumento; e:7887
- [value] sustitución por propiedad del argumento; e:7889
- [value] argumento conservado sin afirmar cierre; e:7890
- [value] argumento conservado sin afirmar cierre; e:7891
- [value] argumento conservado sin afirmar cierre; e:7892
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:7894
- [value] !(escalasPublicadas !== undefined); e:7895
- [value] retorno de calcularDesgloseCuotaPorEscala; e:7896
- [value] argumento conservado sin afirmar cierre; e:7897
- [value] argumento de min; e:7899
- [value] argumento conservado sin afirmar cierre; e:7900
- [value] sustitución de argumento exacto; e:7903
- [value] retorno de minimos; e:7904
- [value] argumento de min; e:7908
- [value] sustitución de argumento exacto; e:7909
- [value] sustitución por propiedad del argumento; e:7911
- [value] receptor de operación Decimal; e:7912
- [value] argumento de mul; e:7913
- [value] argumento conservado sin afirmar cierre; e:7914
- [value] argumento conservado sin afirmar cierre; e:7915
- [value] retorno de calcularCuotaPorEscala; e:7916
- [value] retorno de estatal; e:7917
- [value] argumento de minus; e:7918
- [value] argumento de max; e:7919

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
