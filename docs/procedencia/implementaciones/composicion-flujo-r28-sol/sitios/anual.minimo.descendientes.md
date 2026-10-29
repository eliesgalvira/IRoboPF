# anual.minimo.descendientes

Candidato pendiente de revisión independiente. Cierre técnico: false. Publicación y aceptación jurídica: false.

Fórmula TS: derechosEstatales === undefined
                  ? `${caso.situacionFamiliar.descendientes.length} descendiente(s); perfil parcial de edad/discapacidad sin acreditar derecho ni reparto`
                  : derechosEstatales.atribuciones
                      .map(
                        (a) =>
                          `orden ${a.orden}, divisor ${a.divisor}, incremento ${a.incremento ? "sí" : "no"}`
                      )
                      .join("; ") +
                    "; renta propia conciliada internamente con el perfil parcial, sin acreditar hechos externos"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

- caso.derechosMinimos / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19976
- crearImporteMonetario(0) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:470–494
- EffectArray.reduce(
    descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
     / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/minimos/minimo-descendientes.ts:886–1404
- derechosEstatales?.descendientes ??
    obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20976
- (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
         / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1116–1400
- obtenerMinimoDescendientes(
      caso.situacionFamiliar.descendientes,
      minimosEstatales
    ) / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20876–20976
- caso / derechosMinimos (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19960
- undefined / value (selector, selection); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19981–19990
- minimoDescendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:43902–43921
- derechosEstatales / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20853
- IMPORTE_CERO / value (EUR, value); productor; lib/dominio/irpf/minimos/minimo-descendientes.ts:1098–1110
- undefined / descendientes (EUR, value); literal; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19999–20008
- (a, b) => b.edad - a.edad / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/minimos/minimo-descendientes.ts:1066–1091
- descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted((a,  / value (EUR, value); Contrato de llamada pendiente: descendientes
      .filter(
        (familiar) =>
          familiar.edad < 25 || familiar.discapacidad._tag !== "SinDiscapacidad"
      )
      .toSorted; lib/dominio/irpf/minimos/minimo-descendientes.ts:910–1092
- 0 / value (EUR, value); literal; lib/dominio/dinero/importe-monetario.ts:492–493
- new Decimal(valor) / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:267–285
- Effect.mapError(errorDerechosMinimos) / value (EUR, value); Contrato de llamada pendiente: Effect.mapError; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20123–20160
- caso.derechosMinimos === undefined / value (selector, selection); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–19990
- yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Admisión Effect/servicio pendiente; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20017–20161
- caso.derechosMinimos === undefined
      ? undefined
      : yield* calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
         / descendientes (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:19956–20161
- caso / derechosMinimos (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe(Effect.mapError(errorDerechosMinimos)) / descendientes (EUR, value); Contrato de llamada pendiente: calcularDerechosMinimos(
          caso.derechosMinimos,
          minimosEstatales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20024–20161
- valor / value (EUR, value); productor; lib/dominio/dinero/importe-monetario.ts:279–284
- derechosEstatales?.descendientes / value (EUR, value); productor; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20836–20868
- errorDerechosMinimos / value (EUR, value); Función sin instancia de llamada; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:20139–20159

## Condiciones por relación

- [selection] binding único desde servicio anual; e:3574
- [selection] ===; e:3577
- [value] argumento conservado sin afirmar cierre; e:5551
- [selection] selecciona rama; e:5636
- [value] caso.derechosMinimos === undefined; e:5637
- [value] argumento conservado sin afirmar cierre; e:5638
- [value] !(caso.derechosMinimos === undefined); e:5640
- [value] argumento conservado sin afirmar cierre; e:5644
- [value] argumento conservado sin afirmar cierre; e:5645
- [value] sustitución de argumento exacto; e:5646
- [value] constructor Decimal; e:5647
- [value] retorno de crearImporteMonetario; e:5648
- [value] argumento conservado sin afirmar cierre; e:5650
- [value] argumento conservado sin afirmar cierre; e:5651
- [value] retorno de obtenerMinimoDescendientes; e:5652
- [value] ??; e:5653

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
