# anual.retencion.cuota

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: "Escala de retención sobre base menos escala sobre mínimo"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- retencion / cuotaRetencionCentimos (centimos, value); Parámetro de auxiliar/callback sin binding: retencion; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64677–64686
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
## Condiciones por relación

- [value] conversión monetaria explícita; e:8601
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8602

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
