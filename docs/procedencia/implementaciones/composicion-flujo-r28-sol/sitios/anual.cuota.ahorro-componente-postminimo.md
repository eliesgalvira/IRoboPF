# anual.cuota.ahorro-componente-postminimo

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: caso.anio <= 2014
                    ? `F ${nombre}(${euros(baseLiquidableAhorro)} − ${euros(componente.remanente)})`
                    : `F ${nombre}(${euros(baseLiquidableAhorro)}) − F ${nombre}(${euros(componente.remanente)})`

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- componente / despuesMinimo (EUR, value); Parámetro destructurado sin instancia pública acreditada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:55952–55962
- componente.despuesMinimo / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:55952–55976

## Condiciones por relación



Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
