# anual.explicito.trabajo.art19

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "íntegro menos gastos efectivos a–e y gasto f limitado"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- c / ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1114–1115
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- decoded / success.ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- rechazo("Rendimiento duplicado") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2222–2254
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- caso.trabajo / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:2919–2931
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1514–1523
- c / discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1716
- c.ejercicio === 2026 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1114–1134
- D.max(0, previo) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3693–3709
- c.rendimientos.length / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2188–2209
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3699–3700
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.territorio !== "comun" || c.ejercicio === 2026 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1134
- "pendiente" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1411–1422
- ordinarios / value (EUR, value); Asignaciones y flujo imperativo pendientes: ordinarios; lib/dominio/irpf/trabajo-anual/calcular.ts:3507–3517
- 1 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1586–1587
- c.discapacidadActiva === "ninguna"
      ? 0
      : c.discapacidadActiva.grado === "65-o-mas" ||
          c.discapacidadActiva.ayudaOMovilidadReducida === "si / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3736–3927
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3761–3770
- decoded / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:971–978
- generales / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4310–4319
- rechazo("Ámbito territorial o vigencia 2026 no cerrados") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1147–1204
- discapacidad / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4327–4339
- rechazo("Requisitos de los gastos desconocidos") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2812–2860
- 500 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3538–3541
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- r.clase / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2404
- D.min(defensa, 300) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3549–3568
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c.discapacidadActiva === "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3736–3770
- gastos.netoArt19 / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:461–477
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.reduccionesArt18 (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.reduccionesArt18 !== "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2034–2066
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.discapacidadActiva.ayudaOMovilidadReducida === "si" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3844–3897
- decoded.success / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatut / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1775
- c.territorio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1098
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- c.rendimientos / length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2188–2202
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- decoded.success / ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- decoded.success / territorio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1587
- c.movilidad !== "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1211–1236
- rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2477–2544
- decoded / success.discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- rechazo("Rendimiento duplicado") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2222–2254
- r.cotizaciones.clase !== "efectivas" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2462
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- gastos / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3599–3605
- decoded.success / discapacidadActiva.grado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- D.min(teoricos, D.max(0, previo)) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3677–3710
- c.movilidad / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1211–1222
- 300 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3564–3567
- c / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1490
- decoded.success / discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- c / discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3844–3845
- 3500 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3923–3927
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/adaptador.ts:320–334
- 2026 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1130–1134
- Schema.decodeUnknownResult(CasoFiscalAnualExplicito)(
    entrada,
    { onExcessProperty: "error" }
  ) / success.trabajo (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(CasoFiscalAnualExplicito); lib/dominio/irpf/trabajo-anual/conexion.ts:1592–1696
- ordinarios.plus(D.min(colegio, 500)) / value (EUR, value); Receptor Decimal no demostrado; lib/dominio/irpf/trabajo-anual/calcular.ts:3507–3543
- r.cotizaciones.clase / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2446
- gastos / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:343–349
- new Set(c.rendimientos.map((r) => r.id)) / size (selector, selection); Forma AST no admitida: NewExpression; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2178
- c.ejercicio >= 2015 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3626–3645
- decoded / success.discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- c.rendimientos.length / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1581
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.discapacidadActiva / ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3844–3864
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- new Set(c.rendimientos.map((r) => r.id)).size / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2183
- rechazo("Imputación y reducciones art18 pendientes") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2079–2131
- gastos / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:461–467
- c.reduccionesArt18 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2034–2052
- "desconocido" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2409–2422
- c.discapacidadActiva !== "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1523
- decoded / success.movilidad (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- "si" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3893–3897
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario" / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/trabajo-anual/calcular.ts:1626–1697
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo("Discapacidad activa desconocida") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1435–1477
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- generales / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3991–4000
- c.discapacidadActiva.grado === "65-o-mas" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3789–3830
- previo / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3978–3984
- c.discapacidadActiva / grado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3789–3809
- previo / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4297–4303
- rechazo("Ámbito territorial o vigencia 2026 no cerrados") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1147–1204
- caso / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:290–294
- calcularGastosTrabajo(caso) / rendimientoAntesArt20 (EUR, value); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2350–2351
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2320–2328
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- bruto / value (EUR, value); Asignaciones y flujo imperativo pendientes: bruto; lib/dominio/irpf/trabajo-anual/calcular.ts:3587–3592
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- decoded / success.discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- c.rendimientos / length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1574
- c.territorio !== "comun" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1110
- incremento / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3957–3967
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeori / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4013–4451
- c.discapacidadActiva.grado === "65-o-mas" ||
          c.discapacidadActiva.ayudaOMovilidadReducida === "si"
        ? 7750
        : 3500 / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3789–3927
- c.discapacidadActiva.grado / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3789–3815
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    ) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1249–1379
- rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
   / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1864–2027
- c.discapacidadActiva / acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1735
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c / discapacidadActiva.grado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3789–3790
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- "calculado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:4027–4038
- rechazo("Ámbito territorial o vigencia 2026 no cerrados") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1147–1204
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.movilidad (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- previo.minus(generales).minus(discapacidad) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4297–4340
- (c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatu / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1531–1848
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatut / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1705
- c / ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1533
- decoded / success.trabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1888–1895
- decoded.success / reduccionesArt18 (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2326–2327
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- { onExcessProperty: "error" } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/trabajo-anual/conexion.ts:1663–1692
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.territorio (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- r.clase === "desconocido" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2422
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo("Imputación y reducciones art18 pendientes") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2079–2131
- rechazo("Requisitos de los gastos desconocidos") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2812–2860
- gastos.estado === "no-soportado" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:302–334
- gastos.estado / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:302–315
- rechazo("Entrada inválida, incompleta o con campos ajenos") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:992–1051
- ordinarios.plus(D.min(colegio, 500)).plus(D.min(defensa, 300)) / value (EUR, value); Receptor Decimal no demostrado; lib/dominio/irpf/trabajo-anual/calcular.ts:3507–3569
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3779–3780
- rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2477–2544
- c.discapacidadActiva !== "ninguna" &&
    (c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "emp / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1848
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.grado (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    ) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1249–1379
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- adaptarTrabajoAnual(caso.trabajo) / rendimientoAntesArt20 (EUR, value); Retornos/guardas imperativas requieren contrato: adaptarTrabajoAnual; lib/dominio/irpf/trabajo-anual/conexion.ts:2899–2932
- D.min(colegio, 500) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3523–3542
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1227–1236
- c / movilidad (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1211–1212
- c.discapacidadActiva.acreditadaDuranteTodoElTrabajo / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1766
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2344–2352
- previo.minus(generales) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3978–4001
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / value (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.discapacidadActiva / ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1805
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    ) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1249–1379
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.ejercicio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1543
- decoded.success / discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- D.min(incremento, D.max(0, previo.minus(generales))) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3951–4003
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- decoded / success.territorio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- r / cotizaciones.clase (selector, selection); Declaración sin inicializador; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2427
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.discapacidadActiva / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1386–1406
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.ayudaOMovilidadReducida (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.discapacidadActiva.ayudaOMovilidadReducida === "desconocido" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1847
- {
    onExcessProperty: "error",
  } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/trabajo-anual/calcular.ts:910–946
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.ejercicio >= 2015 ? 2000 : 0 / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3626–3656
- decoded / success.rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- "comun" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1103–1110
- D.max(0, previo.minus(generales)) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3969–4002
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- "desconocido" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2778–2791
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3655–3656
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3736–3737
- defensa / value (EUR, value); Asignaciones y flujo imperativo pendientes: defensa; lib/dominio/irpf/trabajo-anual/calcular.ts:3555–3562
- c.discapacidadActiva === "pendiente" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1386–1422
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- r.clase === "desconocido" || r.cotizaciones.clase !== "efectivas" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2462
- 7750 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3908–3912
- c.discapacidadActiva.ayudaOMovilidadReducida / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3844–3888
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.ejercicio (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.discapacidadActiva / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3736–3756
- [
        r.sindicato.satisfecho,
        r.colegio.satisfecho,
        r.colegio.obligatorio,
        r.colegio.finesEsenciales,
        r.defensa.satisfecho,
 / value (selector, selection); Contrato de llamada pendiente: [
        r.sindicato.satisfecho,
        r.colegio.satisfecho,
        r.colegio.obligatorio,
        r.colegio.finesEsenciales,
        r.defensa.satisfecho,
        r.defensa.litigioDirectoPagador,
      ].includes; lib/dominio/irpf/trabajo-anual/calcular.ts:2560–2792
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeori / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4013–4451
- decoded.success / movilidad (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- rechazo("Rendimiento duplicado") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2222–2254
- c.ejercicio < 2015 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1550
- calcularGastosTrabajo(caso) / netoArt19 (EUR, value); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- c / reduccionesArt18 (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2034–2035
- trabajo.rendimientoAntesArt20 / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:5236–5265
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.discapacidadActiva.grado === "65-o-mas" ||
          c.discapacidadActiva.ayudaOMovilidadReducida === "si" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3789–3897
- c / ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3626–3627
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- previo.minus(generales).minus(discapacidad).toString() / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4297–4351
- "si" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1771–1775
- rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
   / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1864–2027
- gastos / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:302–308
- calcularGastosTrabajo(caso) / estado (selector, selection); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- c.discapacidadActiva.acreditadaDuranteTodoElTrabajo !== "si" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1775
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1386–1387
- Result.isFailure(decoded) / value (selector, selection); Contrato de llamada pendiente: Result.isFailure; lib/dominio/irpf/trabajo-anual/calcular.ts:954–979
- caso / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:904–908
- 2015 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1546–1550
- r / clase (selector, selection); Declaración sin inicializador; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2398
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- decoded / success.discapacidadActiva.grado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- 2015 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3641–3645
- "efectivas" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2451–2462
- {
    estado: "aporte-disponible" as const,
    ejercicio: caso.ejercicio,
    rendimientoAntesArt20: gastos.netoArt19,
    argumentoArt20: gastos.netoPrevioArt / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:359–889
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- previo / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3702–3708
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- {
  estado: "no-soportado",
  motivo,
} / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- caso / trabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:2919–2923
- ({
  estado: "no-soportado",
  motivo,
}) / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c.ejercicio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3626–3637
- rechazo("Requisitos de los gastos desconocidos") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2812–2860
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2269–2277
- r.cotizaciones / clase (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2440
- c.discapacidadActiva / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1509
- rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
   / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1864–2027
- rechazo("Imputación y reducciones art18 pendientes") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2079–2131
- new Set(c.rendimientos.map((r) => r.id)).size !== c.rendimientos.length / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2209
- teoricos / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3683–3691
- c / territorio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1087
- decoded / success.reduccionesArt18 (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- colegio / value (EUR, value); Asignaciones y flujo imperativo pendientes: colegio; lib/dominio/irpf/trabajo-anual/calcular.ts:3529–3536
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2057–2066
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- previo.minus(generales) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4297–4320
- c / discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1786
- 2000 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3648–3652
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2477–2544
- c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario"
      ) / value (selector, selection); Contrato de llamada pendiente: c.rendimientos.some; lib/dominio/irpf/trabajo-anual/calcular.ts:1597–1705
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2302–2303
- entrada / entrada (selector, selection); public-input; lib/dominio/irpf/trabajo-anual/conexion.ts:1650–1657
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- rechazo("Entrada inválida, incompleta o con campos ajenos") / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:992–1051
- c.ejercicio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1114–1125
- ({
  estado: "no-soportado",
  motivo,
}) / netoArt19 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- rechazo("Entrada inválida, incompleta o con campos ajenos") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:992–1051
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatut / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1847
- rechazo("Discapacidad activa desconocida") / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1435–1477
- rechazo("Discapacidad activa desconocida") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1435–1477
- "65-o-mas" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3820–3830
- "desconocido" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1834–1847
- {
  estado: "no-soportado",
  motivo,
} / netoArt19 (EUR, value); Propiedad no resuelta (spread/alias): netoArt19; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3975–3976
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2296–2304
- c.rendimientos.length !== 1 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1587
- decoded.success / rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- bruto.minus(gastos) / value (EUR, value); Receptor Decimal no demostrado; lib/dominio/irpf/trabajo-anual/calcular.ts:3587–3606
- {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeori / rendimientoAntesArt20 (EUR, value); Propiedad no resuelta (spread/alias): rendimientoAntesArt20; lib/dominio/irpf/trabajo-anual/calcular.ts:4013–4451
- decoded.success / trabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1888–1903
- c / rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1561
- c.discapacidadActiva.ayudaOMovilidadReducida / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1829
- trabajo / rendimientoAntesArt20 (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:5236–5243
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.rendimientos.length (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- c / rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2188–2189
- new D(trabajo.rendimientoAntesArt20) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:5230–5266
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2275–2276
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320

## Condiciones por relación

- [selection] argumento conservado sin afirmar cierre; e:7960
- [selection] argumento conservado sin afirmar cierre; e:7961
- [selection] sustitución de argumento exacto; e:7966
- [selection] sustitución de argumento exacto; e:7967
- [selection] argumento conservado sin afirmar cierre; e:7968
- [selection] argumento conservado sin afirmar cierre; e:7969
- [selection] argumento conservado sin afirmar cierre; e:7971
- [selection] retorno de rechazo; e:7975
- [selection] retorno de calcularGastosTrabajo; e:7976
- [selection] argumento conservado sin afirmar cierre; e:7977
- [selection] argumento conservado sin afirmar cierre; e:7978
- [selection] !==; e:7984
- [selection] argumento conservado sin afirmar cierre; e:7986
- [selection] argumento conservado sin afirmar cierre; e:7987
- [selection] ===; e:7993
- [selection] ||; e:7994
- [selection] retorno de rechazo; e:7998
- [selection] retorno de calcularGastosTrabajo; e:7999
- [selection] argumento conservado sin afirmar cierre; e:8000
- [selection] argumento conservado sin afirmar cierre; e:8001
- [selection] !==; e:8007
- [selection] retorno de rechazo; e:8011
- [selection] retorno de calcularGastosTrabajo; e:8012
- [selection] argumento conservado sin afirmar cierre; e:8013
- [selection] argumento conservado sin afirmar cierre; e:8014
- [selection] ===; e:8020
- [selection] retorno de rechazo; e:8024
- [selection] retorno de calcularGastosTrabajo; e:8025
- [selection] !==; e:8029
- [selection] <; e:8034
- [selection] argumento conservado sin afirmar cierre; e:8036
- [selection] argumento conservado sin afirmar cierre; e:8037
- [selection] !==; e:8044
- [selection] ||; e:8045
- [selection] argumento conservado sin afirmar cierre; e:8047
- [selection] ||; e:8048
- [selection] argumento conservado sin afirmar cierre; e:8050
- [selection] argumento conservado sin afirmar cierre; e:8051
- [selection] !==; e:8058
- [selection] ||; e:8059
- [selection] argumento conservado sin afirmar cierre; e:8061
- [selection] argumento conservado sin afirmar cierre; e:8062
- [selection] ===; e:8069
- [selection] ||; e:8070
- [selection] &&; e:8072
- [selection] retorno de rechazo; e:8076
- [selection] retorno de calcularGastosTrabajo; e:8077
- [selection] argumento conservado sin afirmar cierre; e:8078
- [selection] argumento conservado sin afirmar cierre; e:8079
- [selection] !==; e:8085
- [selection] retorno de rechazo; e:8089
- [selection] retorno de calcularGastosTrabajo; e:8090
- [selection] !==; e:8096
- [selection] retorno de rechazo; e:8100
- [selection] retorno de calcularGastosTrabajo; e:8101
- [selection] ===; e:8104
- [selection] !==; e:8109
- [selection] ||; e:8110
- [selection] retorno de rechazo; e:8114
- [selection] retorno de calcularGastosTrabajo; e:8115
- [selection] argumento conservado sin afirmar cierre; e:8116
- [selection] retorno de rechazo; e:8120
- [selection] retorno de calcularGastosTrabajo; e:8121
- [selection] retorno de calcularGastosTrabajo; e:8123
- [selection] ===; e:8127
- [value] constructor Decimal; e:8204
- [value] constructor Decimal; e:8292
- [value] receptor de operación Decimal; e:8294
- [value] constructor Decimal; e:8295
- [value] argumento de min; e:8297
- [value] argumento de min; e:8298
- [value] argumento de plus; e:8299
- [value] receptor de operación Decimal; e:8300
- [value] constructor Decimal; e:8301
- [value] argumento de min; e:8303
- [value] argumento de min; e:8304
- [value] argumento de plus; e:8305
- [selection] >=; e:8396
- [selection] selecciona rama; e:8397
- [value] c.ejercicio >= 2015; e:8398
- [value] !(c.ejercicio >= 2015); e:8399
- [value] argumento de min; e:8401
- [value] argumento de max; e:8402
- [value] receptor de operación Decimal; e:8404
- [value] argumento de minus; e:8406
- [value] argumento de max; e:8408
- [value] argumento de min; e:8409
- [value] retorno de rechazo; e:8424
- [value] retorno de calcularGastosTrabajo; e:8425
- [value] retorno de rechazo; e:8428
- [value] retorno de calcularGastosTrabajo; e:8429
- [value] retorno de rechazo; e:8432
- [value] retorno de calcularGastosTrabajo; e:8433
- [value] retorno de rechazo; e:8436
- [value] retorno de calcularGastosTrabajo; e:8437
- [value] retorno de rechazo; e:8440
- [value] retorno de calcularGastosTrabajo; e:8441
- [value] retorno de rechazo; e:8444
- [value] retorno de calcularGastosTrabajo; e:8445
- [value] retorno de rechazo; e:8448
- [value] retorno de calcularGastosTrabajo; e:8449
- [value] retorno de rechazo; e:8452
- [value] retorno de calcularGastosTrabajo; e:8453
- [value] retorno de rechazo; e:8456
- [value] retorno de calcularGastosTrabajo; e:8457
- [value] retorno de calcularGastosTrabajo; e:8458
- [value] retorno de adaptarTrabajoAnual; e:8460
- [value] retorno de rechazo; e:8463
- [value] retorno de calcularGastosTrabajo; e:8464
- [value] retorno de rechazo; e:8467
- [value] retorno de calcularGastosTrabajo; e:8468
- [value] retorno de rechazo; e:8471
- [value] retorno de calcularGastosTrabajo; e:8472
- [value] retorno de rechazo; e:8475
- [value] retorno de calcularGastosTrabajo; e:8476
- [value] retorno de rechazo; e:8479
- [value] retorno de calcularGastosTrabajo; e:8480
- [value] retorno de rechazo; e:8483
- [value] retorno de calcularGastosTrabajo; e:8484
- [value] retorno de rechazo; e:8487
- [value] retorno de calcularGastosTrabajo; e:8488
- [value] retorno de rechazo; e:8491
- [value] retorno de calcularGastosTrabajo; e:8492
- [value] retorno de rechazo; e:8495
- [value] retorno de calcularGastosTrabajo; e:8496
- [value] receptor de operación Decimal; e:8498
- [value] argumento de minus; e:8500
- [value] receptor de operación Decimal; e:8501
- [selection] ===; e:8505
- [selection] selecciona rama; e:8506
- [value] c.discapacidadActiva === "ninguna"; e:8507
- [selection] argumento conservado sin afirmar cierre; e:8508
- [selection] argumento conservado sin afirmar cierre; e:8509
- [selection] ===; e:8516
- [selection] ===; e:8522
- [selection] ||; e:8523
- [selection] selecciona rama; e:8524
- [value] c.discapacidadActiva.grado === "65-o-mas" ||
          c.discapacidadActiva.ayudaOMovilidadReducida === "si"; e:8525
- [value] !(c.discapacidadActiva.grado === "65-o-mas" ||
          c.discapacidadActiva.ayudaOMovilidadReducida === "si"); e:8526
- [value] !(c.discapacidadActiva === "ninguna"); e:8527
- [value] argumento de min; e:8529
- [value] argumento de max; e:8530
- [value] receptor de operación Decimal; e:8532
- [value] argumento de minus; e:8534
- [value] argumento de max; e:8535
- [value] argumento de min; e:8536
- [value] argumento de minus; e:8538
- [value] receptor de operación Decimal; e:8539
- [value] retorno de calcularGastosTrabajo; e:8541
- [value] retorno de adaptarTrabajoAnual; e:8545
- [value] constructor Decimal; e:8548

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
