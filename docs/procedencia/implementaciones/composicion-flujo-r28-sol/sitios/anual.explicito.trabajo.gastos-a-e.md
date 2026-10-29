# anual.explicito.trabajo.gastos-a-e

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "cotizaciones efectivas + sindicato + colegio limitado + defensa limitada, una vez al año"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- c / ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1114–1115
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- gastos / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4136–4142
- decoded / success.ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- rechazo("Rendimiento duplicado") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2222–2254
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo("Ámbito territorial o vigencia 2026 no cerrados") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1147–1204
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- caso.trabajo / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:2919–2931
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1514–1523
- c / discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1716
- c.ejercicio === 2026 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1114–1134
- c.rendimientos.length / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2188–2209
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c.territorio !== "comun" || c.ejercicio === 2026 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1134
- "pendiente" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1411–1422
- ordinarios / value (EUR, value); Asignaciones y flujo imperativo pendientes: ordinarios; lib/dominio/irpf/trabajo-anual/calcular.ts:3507–3517
- 1 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1586–1587
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- decoded / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:971–978
- calcularGastosTrabajo(caso) / gastos.gastosAE (EUR, value); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
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
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.reduccionesArt18 (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.reduccionesArt18 !== "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2034–2066
- rechazo("Rendimiento duplicado") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2222–2254
- decoded.success / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatut / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1775
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- rechazo("Discapacidad activa desconocida") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1435–1477
- c.territorio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1098
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- c.rendimientos / length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2188–2202
- gastos / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:343–349
- decoded.success / ejercicio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- decoded.success / territorio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1587
- c.movilidad !== "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1211–1236
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- decoded / success.discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- r.cotizaciones.clase !== "efectivas" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2462
- trabajo.gastos.gastosAE / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:4576–4599
- rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2477–2544
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.movilidad / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1211–1222
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- 300 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:3564–3567
- c / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1490
- decoded.success / discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/adaptador.ts:320–334
- 2026 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1130–1134
- Schema.decodeUnknownResult(CasoFiscalAnualExplicito)(
    entrada,
    { onExcessProperty: "error" }
  ) / success.trabajo (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(CasoFiscalAnualExplicito); lib/dominio/irpf/trabajo-anual/conexion.ts:1592–1696
- ordinarios.plus(D.min(colegio, 500)) / value (EUR, value); Receptor Decimal no demostrado; lib/dominio/irpf/trabajo-anual/calcular.ts:3507–3543
- r.cotizaciones.clase / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2446
- trabajo.gastos / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:4576–4590
- new Set(c.rendimientos.map((r) => r.id)) / size (selector, selection); Forma AST no admitida: NewExpression; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2178
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- decoded / success.discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeori / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:4013–4451
- c.rendimientos.length / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1581
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- rechazo("Entrada inválida, incompleta o con campos ajenos") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:992–1051
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- new Set(c.rendimientos.map((r) => r.id)).size / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2183
- c.reduccionesArt18 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2034–2052
- rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
   / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1864–2027
- "desconocido" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2409–2422
- c.discapacidadActiva !== "ninguna" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1523
- decoded / success.movilidad (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario" / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/trabajo-anual/calcular.ts:1626–1697
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- caso / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:290–294
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2350–2351
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2320–2328
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- decoded / success.discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- c.rendimientos / length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1574
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c.territorio !== "comun" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1110
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
- rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2477–2544
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.discapacidadActiva / acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1735
- "calculado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:4027–4038
- rechazo("Ámbito territorial o vigencia 2026 no cerrados") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1147–1204
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.movilidad (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
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
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- { onExcessProperty: "error" } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/trabajo-anual/conexion.ts:1663–1692
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.territorio (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- r.clase === "desconocido" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2422
- rechazo("Imputación y reducciones art18 pendientes") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2079–2131
- gastos.estado === "no-soportado" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:302–334
- gastos.estado / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:302–315
- ordinarios.plus(D.min(colegio, 500)).plus(D.min(defensa, 300)) / value (EUR, value); Receptor Decimal no demostrado; lib/dominio/irpf/trabajo-anual/calcular.ts:3507–3569
- rechazo("Clase de trabajo o cotizaciones efectivas no acreditadas") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2477–2544
- c.discapacidadActiva !== "ninguna" &&
    (c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "emp / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1848
- calcularGastosTrabajo(caso) / gastosAE (EUR, value); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- rechazo("Discapacidad activa desconocida") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1435–1477
- rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    ) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1249–1379
- rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    ) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1249–1379
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- D.min(colegio, 500) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:3523–3542
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1227–1236
- c / movilidad (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1211–1212
- rechazo("Requisitos de los gastos desconocidos") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2812–2860
- rechazo("Requisitos de los gastos desconocidos") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2812–2860
- c.discapacidadActiva.acreditadaDuranteTodoElTrabajo / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1766
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2344–2352
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / value (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.discapacidadActiva / ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1805
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- new D(trabajo.gastos.gastosAE) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:4570–4600
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c.ejercicio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1543
- decoded.success / discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- adaptarTrabajoAnual(caso.trabajo) / gastos.gastosAE (EUR, value); Retornos/guardas imperativas requieren contrato: adaptarTrabajoAnual; lib/dominio/irpf/trabajo-anual/conexion.ts:2899–2932
- decoded / success.territorio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- r / cotizaciones.clase (selector, selection); Declaración sin inicializador; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2427
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- rechazo("Imputación y reducciones art18 pendientes") / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2079–2131
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- c.discapacidadActiva / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1386–1406
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.ayudaOMovilidadReducida (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- c.discapacidadActiva.ayudaOMovilidadReducida === "desconocido" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1847
- {
    onExcessProperty: "error",
  } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/trabajo-anual/calcular.ts:910–946
- decoded / success.rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- "comun" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1103–1110
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- ({
  estado: "no-soportado",
  motivo,
}) / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- "desconocido" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2778–2791
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- {
  estado: "no-soportado",
  motivo,
} / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- ({
  estado: "no-soportado",
  motivo,
}) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- rechazo("Imputación y reducciones art18 pendientes") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2079–2131
- defensa / value (EUR, value); Asignaciones y flujo imperativo pendientes: defensa; lib/dominio/irpf/trabajo-anual/calcular.ts:3555–3562
- c.discapacidadActiva === "pendiente" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1386–1422
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- r.clase === "desconocido" || r.cotizaciones.clase !== "efectivas" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2462
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.ejercicio (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
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
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- decoded.success / movilidad (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- c.ejercicio < 2015 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1550
- c / reduccionesArt18 (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2034–2035
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- "si" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1771–1775
- rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
   / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1864–2027
- gastos / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:302–308
- calcularGastosTrabajo(caso) / estado (selector, selection); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- gastos / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:527–533
- c.discapacidadActiva.acreditadaDuranteTodoElTrabajo !== "si" / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1715–1775
- c / discapacidadActiva (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1386–1387
- Result.isFailure(decoded) / value (selector, selection); Contrato de llamada pendiente: Result.isFailure; lib/dominio/irpf/trabajo-anual/calcular.ts:954–979
- caso / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:904–908
- 2015 / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1546–1550
- r / clase (selector, selection); Declaración sin inicializador; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2398
- "efectivas" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2451–2462
- gastos.toString() / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4136–4153
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- caso / trabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:2919–2923
- rechazo("Requisitos de los gastos desconocidos") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2812–2860
- trabajo / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:4576–4583
- r.cotizaciones / clase (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2440
- c.discapacidadActiva / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1489–1509
- rechazo("Entrada inválida, incompleta o con campos ajenos") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:992–1051
- new Set(c.rendimientos.map((r) => r.id)).size !== c.rendimientos.length / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2209
- c / territorio (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1086–1087
- {
  estado: "no-soportado",
  motivo,
} / gastos.gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastos.gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo("Rendimiento duplicado") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2222–2254
- rechazo("Ámbito territorial o vigencia 2026 no cerrados") / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1147–1204
- rechazo(
      "Movilidad ordinaria/histórica y DT6 requieren contrato temporal y de rendimientos asociados; no acumulables"
    ) / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1249–1379
- decoded / success.reduccionesArt18 (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1071
- colegio / value (EUR, value); Asignaciones y flujo imperativo pendientes: colegio; lib/dominio/irpf/trabajo-anual/calcular.ts:3529–3536
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- "ninguna" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2057–2066
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
- c / discapacidadActiva.ayudaOMovilidadReducida (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1786
- c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario"
      ) / value (selector, selection); Contrato de llamada pendiente: c.rendimientos.some; lib/dominio/irpf/trabajo-anual/calcular.ts:1597–1705
- 0 / value (EUR, value); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:2302–2303
- entrada / entrada (selector, selection); public-input; lib/dominio/irpf/trabajo-anual/conexion.ts:1650–1657
- c.ejercicio / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1114–1125
- rechazo("Entrada inválida, incompleta o con campos ajenos") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:992–1051
- {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeori / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:4013–4451
- c.ejercicio < 2015 ||
      c.rendimientos.length !== 1 ||
      c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatut / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1532–1847
- rechazo("Discapacidad activa desconocida") / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1435–1477
- "desconocido" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:1834–1847
- new D(0) / value (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2296–2304
- c.rendimientos.length !== 1 / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1587
- {
    estado: "aporte-disponible" as const,
    ejercicio: caso.ejercicio,
    rendimientoAntesArt20: gastos.netoArt19,
    argumentoArt20: gastos.netoPrevioArt / gastos.gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/adaptador.ts:359–889
- decoded.success / rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1064–1079
- decoded.success / trabajo (selector, selection); productor; lib/dominio/irpf/trabajo-anual/conexion.ts:1888–1903
- c / rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1560–1561
- c.discapacidadActiva.ayudaOMovilidadReducida / value (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1785–1829
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.rendimientos.length (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- "no-soportado" / value (selector, selection); literal; lib/dominio/irpf/trabajo-anual/calcular.ts:306–320
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- rechazo(
      "Discapacidad: solo empleo efectivo único con acreditación durante todos los rendimientos, desde 2015; asociación parcial/histórica pendiente"
   / gastosAE (EUR, value); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:1864–2027
- c / rendimientos.length (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:2188–2189
- {
  estado: "no-soportado",
  motivo,
} / gastosAE (EUR, value); Propiedad no resuelta (spread/alias): gastosAE; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- ({
  estado: "no-soportado",
  motivo,
}) / estado (selector, selection); productor; lib/dominio/irpf/trabajo-anual/calcular.ts:293–334
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
- [value] retorno de rechazo; e:8219
- [value] retorno de calcularGastosTrabajo; e:8220
- [value] retorno de rechazo; e:8223
- [value] retorno de calcularGastosTrabajo; e:8224
- [value] retorno de rechazo; e:8227
- [value] retorno de calcularGastosTrabajo; e:8228
- [value] retorno de rechazo; e:8231
- [value] retorno de calcularGastosTrabajo; e:8232
- [value] retorno de rechazo; e:8235
- [value] retorno de calcularGastosTrabajo; e:8236
- [value] retorno de rechazo; e:8239
- [value] retorno de calcularGastosTrabajo; e:8240
- [value] retorno de rechazo; e:8243
- [value] retorno de calcularGastosTrabajo; e:8244
- [value] retorno de rechazo; e:8247
- [value] retorno de calcularGastosTrabajo; e:8248
- [value] retorno de rechazo; e:8251
- [value] retorno de calcularGastosTrabajo; e:8252
- [value] retorno de calcularGastosTrabajo; e:8253
- [value] retorno de adaptarTrabajoAnual; e:8255
- [value] retorno de rechazo; e:8258
- [value] retorno de calcularGastosTrabajo; e:8259
- [value] retorno de rechazo; e:8262
- [value] retorno de calcularGastosTrabajo; e:8263
- [value] retorno de rechazo; e:8266
- [value] retorno de calcularGastosTrabajo; e:8267
- [value] retorno de rechazo; e:8270
- [value] retorno de calcularGastosTrabajo; e:8271
- [value] retorno de rechazo; e:8274
- [value] retorno de calcularGastosTrabajo; e:8275
- [value] retorno de rechazo; e:8278
- [value] retorno de calcularGastosTrabajo; e:8279
- [value] retorno de rechazo; e:8282
- [value] retorno de calcularGastosTrabajo; e:8283
- [value] retorno de rechazo; e:8286
- [value] retorno de calcularGastosTrabajo; e:8287
- [value] retorno de rechazo; e:8290
- [value] retorno de calcularGastosTrabajo; e:8291
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
- [value] receptor de operación Decimal; e:8307
- [value] retorno de calcularGastosTrabajo; e:8309
- [value] retorno de adaptarTrabajoAnual; e:8312
- [value] constructor Decimal; e:8316

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
