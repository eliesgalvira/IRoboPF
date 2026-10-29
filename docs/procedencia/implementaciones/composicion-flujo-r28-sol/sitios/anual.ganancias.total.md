# anual.ganancias.total

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Suma de ganancias por transmisión"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- gananciasPatrimoniales / gananciaTotal (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:46820–46842
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
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaTotal (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        ed / gananciaTotal (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13946–14343
- calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNu / gananciaTotal (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14024–14339
- ganancias / value (EUR, value); productor; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1466–1475
- gananciasPatrimoniales.gananciaTotal / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:46820–46856

## Condiciones por relación

- [value] argumento conservado sin afirmar cierre; e:1
- [value] argumento conservado sin afirmar cierre; e:2
- [value] sustitución por propiedad del argumento; e:4
- [value] argumento conservado sin afirmar cierre; e:5
- [value] argumento conservado sin afirmar cierre; e:6
- [value] argumento conservado sin afirmar cierre; e:8574
- [value] argumento conservado sin afirmar cierre; e:8575
- [value] argumento conservado sin afirmar cierre; e:8576
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:8577
- [value] si calcular devuelve; instrumentación no transforma el valor; e:8578

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
