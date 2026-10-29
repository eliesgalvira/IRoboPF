# anual.inmobiliario.neto

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Sin gastos, amortizaciones ni reducciones específicas todavía implementadas"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- {
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
} / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1377–1441
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:549–550
- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      }) / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13776–13908
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.sumar",
    () =>
      sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimi / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13379–13654
- convertirCentimosAEuros(0) / value (EUR, value); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.neto",
    () =>
      calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoInte / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13696–13912
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- rendimientoCapitalInmobiliario / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:41345–41375
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:507–519
- {
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      } / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13831–13907
- rendimientoIntegroCapitalInmobiliario / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13861–13898
- ({
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
}) / rendimientoNeto (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1376–1442
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:1420–1438
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
- sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
 / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13460–13650
- rendimientoCapitalInmobiliario.rendimientoNeto / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:41345–41391

## Condiciones por relación

- [value] argumento conservado sin afirmar cierre; e:1862
- [value] argumento conservado sin afirmar cierre; e:1863
- [value] sustitución de argumento exacto; e:1864
- [value] argumento conservado sin afirmar cierre; e:1865
- [value] argumento conservado sin afirmar cierre; e:1866
- [value] argumento conservado sin afirmar cierre; e:1867
- [value] argumento conservado sin afirmar cierre; e:1868
- [value] retorno de sumarRendimientosCapitalInmobiliario; e:1869
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1870
- [value] sustitución por propiedad del argumento; e:1873
- [value] retorno de calcularRendimientoNetoCapitalInmobiliarioSimplificado; e:1876
- [value] si calcular devuelve; instrumentación no transforma el valor; e:1877

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
