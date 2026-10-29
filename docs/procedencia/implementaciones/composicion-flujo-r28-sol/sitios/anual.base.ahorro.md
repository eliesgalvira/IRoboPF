# anual.base.ahorro

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: `max(0, ganancias sujetas clasificadas como ahorro: ${euros(gananciasPatrimoniales.gananciaSujetaAhorro)})`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- gananciasPatrimoniales / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–337
- calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      }) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15860–15930
- gananciasPatrimoniales / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15898–15920
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- medirAuditoriaSync(
    "liquidacion.baseImponibleAhorro",
    () =>
      calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      })
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15785–15934
- baseLiquidableAhorro / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:47593–47613
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- {
        gananciasPatrimoniales,
      } / gananciasPatrimoniales.gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:15888–15929
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaSujetaAhorro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (EUR, value); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- {
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.ganancia / ganancias (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14069–14338
- 0 / value (EUR, value); literal; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:312–313
- Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro) / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:300–359
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- ganancias / value (EUR, value); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- gananciasPatrimoniales.gananciaSujetaAhorro / value (EUR, value); productor; lib/dominio/irpf/integracion/base-imponible-ahorro.ts:315–358

## Condiciones por relación

- [value] argumento de max; e:0
- [value] argumento conservado sin afirmar cierre; e:1
- [value] argumento conservado sin afirmar cierre; e:2
- [value] sustitución por propiedad del argumento; e:4
- [value] argumento conservado sin afirmar cierre; e:5
- [value] argumento conservado sin afirmar cierre; e:6
- [value] argumento conservado sin afirmar cierre; e:7
- [value] argumento conservado sin afirmar cierre; e:8
- [value] argumento conservado sin afirmar cierre; e:9
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:10
- [value] si calcular devuelve; instrumentación no transforma el valor; e:11
- [value] sustitución por propiedad del argumento; e:14
- [value] argumento de max; e:16
- [value] retorno de calcularBaseImponibleAhorro; e:17
- [value] si calcular devuelve; instrumentación no transforma el valor; e:18

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
