# anual.retencion.base

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: "Rendimiento neto reducido menos reducciones comunicadas"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- retencion / baseRetencionCentimos (centimos, value); Parámetro de auxiliar/callback sin binding: retencion; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:64390–64399
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660

## Condiciones por relación

- [value] conversión monetaria explícita; e:8598
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8599

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
