# anual.pagos.retenciones

Candidato pendiente de revisión independiente. Cierre técnico: true. Publicación y aceptación jurídica: false.

Fórmula TS: "Importe declarado en el caso fiscal"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- caso.retencionesSoportadasCentimos / value (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:58752–58786
- centimosAEuros(caso.retencionesSoportadasCentimos) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:58737–58787
- caso / retencionesSoportadasCentimos (centimos, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:58752–58756
- centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100) / signature:centimosAEuros (EUR, value); primitive; lib/dominio/dinero/importe-monetario.ts:561–660
- caso / retencionesSoportadasCentimos (centimos, value); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402

## Condiciones por relación

- [value] binding único desde servicio anual; e:8590
- [value] conversión monetaria explícita; e:8592
- [value] aplicación de la primitiva monetaria del módulo dinero; e:8593

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
