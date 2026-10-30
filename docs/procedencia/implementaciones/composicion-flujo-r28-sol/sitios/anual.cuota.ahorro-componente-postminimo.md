# anual.cuota.ahorro-componente-postminimo

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: caso.anio <= 2014
                    ? `F ${nombre}(${euros(baseLiquidableAhorro)} − ${euros(componente.remanente)})`
                    : `F ${nombre}(${euros(baseLiquidableAhorro)}) − F ${nombre}(${euros(componente.remanente)})`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- componente / despuesMinimo (EUR, value); Parámetro destructurado sin instancia pública acreditada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:55952–55962
## Condiciones por relación



Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
