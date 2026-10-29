# anual.retencion.anual

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Retribuciones x tipo de retención"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- retencion / importeRetencionAnualCentimos (centimos, value); Parámetro de auxiliar/callback sin binding: retencion; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:65230–65239
- centimosAEuros(retencion.importeRetencionAnualCentimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:65215–65270
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- retencion.importeRetencionAnualCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:65230–65269

## Condiciones por relación

- [value] conversión monetaria explícita; e:8606
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8607

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
