# anual.trabajo.integro

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Suma de importes declarados como trabajo"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- rendimientoTrabajo.rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:32753–32790
- caso.rendimientos / trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12235
- rendimientoTrabajo / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:32753–32771
- 0 / value (EUR, value); literal; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1631–1632
- (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos)) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1635–1723
- EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1585–1727
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoInt / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13052–13330
- rendimientos / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1604–1616
- rendimientoIntegro / value (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1206–1224
- caso.rendimientos.trabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12243
- rendimientoIntegroTrabajo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13218–13243
- crearImporte(0) / value (EUR, value); Contrato de llamada pendiente: crearImporte; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1618–1633
- calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSocia / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13132–13326
- {
    rendimientoIntegro,
    cotizacionTrabajador: cotizacionAplicada,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:1200–1426
- sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12193–12260
- {
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      / rendimientoIntegro (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:13163–13325
- medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12118–12264
- caso / rendimientos.trabajo (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:12218–12222
- caso / rendimientos.trabajo (EUR, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402

## Condiciones por relación

- [value] binding único desde servicio anual; e:22
- [value] sustitución de argumento exacto; e:25
- [value] argumento conservado sin afirmar cierre; e:26
- [value] argumento conservado sin afirmar cierre; e:27
- [value] argumento conservado sin afirmar cierre; e:28
- [value] argumento conservado sin afirmar cierre; e:29
- [value] retorno de sumarRendimientosTrabajo; e:30
- [value] si calcular devuelve; instrumentación no transforma el valor; e:31
- [value] sustitución por propiedad del argumento; e:7937
- [value] retorno de calcularRendimientoNetoTrabajo; e:7939
- [value] si calcular devuelve; instrumentación no transforma el valor; e:7940

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
