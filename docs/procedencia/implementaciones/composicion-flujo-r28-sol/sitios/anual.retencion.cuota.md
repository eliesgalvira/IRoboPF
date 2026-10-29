# anual.retencion.cuota

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: "Escala de retención sobre base menos escala sobre mínimo"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- centimosAEuros(retencion.cuotaRetencionCentimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64662–64710
- retencion / cuotaRetencionCentimos (centimos, value); Parámetro de auxiliar/callback sin binding: retencion; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64677–64686
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- retencion.cuotaRetencionCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64677–64709

## Condiciones por relación

- [value] conversión monetaria explícita; e:8601
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8602

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
