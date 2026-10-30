# anual.inmobiliario.neto

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: "Sin gastos, amortizaciones ni reducciones específicas todavía implementadas"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:557–658
- convertirCentimosAEuros(0) / value (EUR, value); Contrato de llamada pendiente: convertirCentimosAEuros; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:525–551
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13599–13607
- EffectArray.reduce(
    rendimientos,
    convertirCentimosAEuros(0),
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIn / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts:483–662
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13582–13608
- Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13506–13618
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
