# anual.pagos.cuenta

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: retencionTrabajoAeat !== undefined
                  ? "Importe declarado más retención de trabajo estimada"
                  : "Importe declarado en el caso fiscal"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- caso / retencionTrabajoAeat (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28263–28379
- contexto / contexto (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9418–9426
- dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        ) / importeRetencionAnualCentimos (centimos, value); Contrato de llamada pendiente: dependencias.retencionTrabajoAeat.calcular; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:28270–28379
- caso / retencionTrabajoAeat (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- caso / pagosACuentaCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
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
