# anual.retencion.base

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Rendimiento neto reducido menos reducciones comunicadas"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- centimosAEuros(retencion.baseRetencionCentimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64375–64422
- retencion / baseRetencionCentimos (centimos, value); Parámetro de auxiliar/callback sin binding: retencion; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64390–64399
- retencion.baseRetencionCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64390–64421
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660

## Condiciones por relación

- [value] conversión monetaria explícita; e:8598
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8599

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
