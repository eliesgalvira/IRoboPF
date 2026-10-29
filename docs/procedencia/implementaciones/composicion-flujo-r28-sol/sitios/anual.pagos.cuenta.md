# anual.pagos.cuenta

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: retencionTrabajoAeat !== undefined
                  ? "Importe declarado más retención de trabajo estimada"
                  : "Importe declarado en el caso fiscal"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- retencionTrabajoAeat / importeRetencionAnualCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28632–28652
- caso / retencionTrabajoAeat (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- contexto / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28361–28369
- caso / retencionTrabajoAeat (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28219
- caso.pagosACuentaCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28733–28758
- centimosAEuros(pagosACuentaAplicadosCentimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59073–59118
- yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28263–28379
- contexto / contexto (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Contrato de llamada pendiente: dependencias.retencionTrabajoAeat.calcular; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28270–28379
- caso.retencionTrabajoAeat / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28240
- caso.retencionTrabajoAeat !== undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28254
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28245–28254
- caso / retencionTrabajoAeat (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- caso / pagosACuentaCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28733–28737
- retencionTrabajoAeat?.importeRetencionAnualCentimos ?? 0 / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28632–28688
- retencionTrabajoAeat?.importeRetencionAnualCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28632–28683
- caso.pagosACuentaCentimos + retencionTrabajoAeatCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28733–28789
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- caso.retencionTrabajoAeat / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28324–28349
- caso / retencionTrabajoAeat (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28324–28328
- caso.retencionTrabajoAeat !== undefined
      ? yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
      / importeRetencionAnualCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28215–28397
- caso / pagosACuentaCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- 0 / value (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28687–28688
- undefined / importeRetencionAnualCentimos (centimos, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28388–28397
- pagosACuentaAplicadosCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:59088–59117
- retencionTrabajoAeatCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28761–28789

## Condiciones por relación

- [value] binding único desde servicio anual; e:5320
- [selection] binding único desde servicio anual; e:5323
- [selection] !==; e:5326
- [selection] selecciona rama; e:5327
- [value] binding único desde servicio anual; e:5328
- [value] argumento conservado sin afirmar cierre; e:5330
- [value] binding único desde servicio anual; e:5331
- [value] argumento conservado sin afirmar cierre; e:5332
- [value] caso.retencionTrabajoAeat !== undefined; e:5334
- [value] !(caso.retencionTrabajoAeat !== undefined); e:5335
- [value] ??; e:5339
- [value] +; e:5341
- [value] conversión monetaria explícita; e:8595
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8596

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
