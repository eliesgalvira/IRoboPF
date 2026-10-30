# anual.explicito.trabajo.integro

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: "suma de rendimientos anuales conciliados"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- adaptarTrabajoAnual(caso.trabajo) / gastos.integro (EUR, value); Retornos/guardas imperativas requieren contrato: adaptarTrabajoAnual; lib/dominio/irpf/trabajo-anual/conexion.ts:2899–2932
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.reduccionesArt18 (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(CasoFiscalAnualExplicito)(
    entrada,
    { onExcessProperty: "error" }
  ) / success.trabajo (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(CasoFiscalAnualExplicito); lib/dominio/irpf/trabajo-anual/conexion.ts:1592–1696
- new Set(c.rendimientos.map((r) => r.id)) / size (selector, selection); Forma AST no admitida: NewExpression; lib/dominio/irpf/trabajo-anual/calcular.ts:2138–2178
- {
    estado: "calculado",
    discapacidadAplicada: discapacidad.toString(),
    integro: bruto.toString(),
    gastosAE: gastos.toString(),
    generalesTeori / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:4013–4451
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- bruto / value (EUR, value); Asignaciones y flujo imperativo pendientes: bruto; lib/dominio/irpf/trabajo-anual/calcular.ts:4104–4109
- (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario" / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/trabajo-anual/calcular.ts:1626–1697
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.movilidad (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- { onExcessProperty: "error" } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/trabajo-anual/conexion.ts:1663–1692
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.territorio (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / value (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- r / cotizaciones.clase (selector, selection); Declaración sin inicializador; lib/dominio/irpf/trabajo-anual/calcular.ts:2426–2427
- calcularGastosTrabajo(caso) / integro (EUR, value); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.ayudaOMovilidadReducida (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
    onExcessProperty: "error",
  } / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/trabajo-anual/calcular.ts:910–946
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.discapacidadActiva.acreditadaDuranteTodoElTrabajo (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.ejercicio (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- [
        r.sindicato.satisfecho,
        r.colegio.satisfecho,
        r.colegio.obligatorio,
        r.colegio.finesEsenciales,
        r.defensa.satisfecho,
 / value (selector, selection); Contrato de llamada pendiente: [
        r.sindicato.satisfecho,
        r.colegio.satisfecho,
        r.colegio.obligatorio,
        r.colegio.finesEsenciales,
        r.defensa.satisfecho,
        r.defensa.litigioDirectoPagador,
      ].includes; lib/dominio/irpf/trabajo-anual/calcular.ts:2560–2792
- bruto.toString() / value (EUR, value); Receptor Decimal no demostrado; lib/dominio/irpf/trabajo-anual/calcular.ts:4104–4120
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- {
  estado: "no-soportado",
  motivo,
} / gastos.integro (EUR, value); Propiedad no resuelta (spread/alias): gastos.integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- calcularGastosTrabajo(caso) / estado (selector, selection); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- Result.isFailure(decoded) / value (selector, selection); Contrato de llamada pendiente: Result.isFailure; lib/dominio/irpf/trabajo-anual/calcular.ts:954–979
- r / clase (selector, selection); Declaración sin inicializador; lib/dominio/irpf/trabajo-anual/calcular.ts:2397–2398
- calcularGastosTrabajo(caso) / gastos.integro (EUR, value); Retornos/guardas imperativas requieren contrato: calcularGastosTrabajo; lib/dominio/irpf/trabajo-anual/adaptador.ts:268–295
- c.rendimientos.some(
        (r) => r.clase !== "empleo-laboral" && r.clase !== "empleo-estatutario"
      ) / value (selector, selection); Contrato de llamada pendiente: c.rendimientos.some; lib/dominio/irpf/trabajo-anual/calcular.ts:1597–1705
- entrada / entrada (selector, selection); public-input; lib/dominio/irpf/trabajo-anual/conexion.ts:1650–1657
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
- Schema.decodeUnknownResult(GastosTrabajo)(caso, {
    onExcessProperty: "error",
  }) / success.rendimientos.length (selector, selection); Contrato de llamada pendiente: Schema.decodeUnknownResult(GastosTrabajo); lib/dominio/irpf/trabajo-anual/calcular.ts:862–947
- {
  estado: "no-soportado",
  motivo,
} / integro (EUR, value); Propiedad no resuelta (spread/alias): integro; lib/dominio/irpf/trabajo-anual/calcular.ts:294–333
## Condiciones por relación

- [selection] argumento conservado sin afirmar cierre; e:7960
- [selection] argumento conservado sin afirmar cierre; e:7961
- [selection] sustitución de argumento exacto; e:7966
- [selection] sustitución de argumento exacto; e:7967
- [selection] argumento conservado sin afirmar cierre; e:7968
- [selection] argumento conservado sin afirmar cierre; e:7969
- [selection] argumento conservado sin afirmar cierre; e:7971
- [selection] retorno de rechazo; e:7975
- [selection] retorno de calcularGastosTrabajo; e:7976
- [selection] argumento conservado sin afirmar cierre; e:7977
- [selection] argumento conservado sin afirmar cierre; e:7978
- [selection] !==; e:7984
- [selection] argumento conservado sin afirmar cierre; e:7986
- [selection] argumento conservado sin afirmar cierre; e:7987
- [selection] ===; e:7993
- [selection] ||; e:7994
- [selection] retorno de rechazo; e:7998
- [selection] retorno de calcularGastosTrabajo; e:7999
- [selection] argumento conservado sin afirmar cierre; e:8000
- [selection] argumento conservado sin afirmar cierre; e:8001
- [selection] !==; e:8007
- [selection] retorno de rechazo; e:8011
- [selection] retorno de calcularGastosTrabajo; e:8012
- [selection] argumento conservado sin afirmar cierre; e:8013
- [selection] argumento conservado sin afirmar cierre; e:8014
- [selection] ===; e:8020
- [selection] retorno de rechazo; e:8024
- [selection] retorno de calcularGastosTrabajo; e:8025
- [selection] !==; e:8029
- [selection] <; e:8034
- [selection] argumento conservado sin afirmar cierre; e:8036
- [selection] argumento conservado sin afirmar cierre; e:8037
- [selection] !==; e:8044
- [selection] ||; e:8045
- [selection] argumento conservado sin afirmar cierre; e:8047
- [selection] ||; e:8048
- [selection] argumento conservado sin afirmar cierre; e:8050
- [selection] argumento conservado sin afirmar cierre; e:8051
- [selection] !==; e:8058
- [selection] ||; e:8059
- [selection] argumento conservado sin afirmar cierre; e:8061
- [selection] argumento conservado sin afirmar cierre; e:8062
- [selection] ===; e:8069
- [selection] ||; e:8070
- [selection] &&; e:8072
- [selection] retorno de rechazo; e:8076
- [selection] retorno de calcularGastosTrabajo; e:8077
- [selection] argumento conservado sin afirmar cierre; e:8078
- [selection] argumento conservado sin afirmar cierre; e:8079
- [selection] !==; e:8085
- [selection] retorno de rechazo; e:8089
- [selection] retorno de calcularGastosTrabajo; e:8090
- [selection] !==; e:8096
- [selection] retorno de rechazo; e:8100
- [selection] retorno de calcularGastosTrabajo; e:8101
- [selection] ===; e:8104
- [selection] !==; e:8109
- [selection] ||; e:8110
- [selection] retorno de rechazo; e:8114
- [selection] retorno de calcularGastosTrabajo; e:8115
- [selection] argumento conservado sin afirmar cierre; e:8116
- [selection] retorno de rechazo; e:8120
- [selection] retorno de calcularGastosTrabajo; e:8121
- [selection] retorno de calcularGastosTrabajo; e:8123
- [selection] ===; e:8127
- [value] retorno de rechazo; e:8131
- [value] retorno de calcularGastosTrabajo; e:8132
- [value] retorno de rechazo; e:8135
- [value] retorno de calcularGastosTrabajo; e:8136
- [value] retorno de rechazo; e:8139
- [value] retorno de calcularGastosTrabajo; e:8140
- [value] retorno de rechazo; e:8143
- [value] retorno de calcularGastosTrabajo; e:8144
- [value] retorno de rechazo; e:8147
- [value] retorno de calcularGastosTrabajo; e:8148
- [value] retorno de rechazo; e:8151
- [value] retorno de calcularGastosTrabajo; e:8152
- [value] retorno de rechazo; e:8155
- [value] retorno de calcularGastosTrabajo; e:8156
- [value] retorno de rechazo; e:8159
- [value] retorno de calcularGastosTrabajo; e:8160
- [value] retorno de rechazo; e:8163
- [value] retorno de calcularGastosTrabajo; e:8164
- [value] retorno de calcularGastosTrabajo; e:8165
- [value] retorno de adaptarTrabajoAnual; e:8167
- [value] retorno de rechazo; e:8170
- [value] retorno de calcularGastosTrabajo; e:8171
- [value] retorno de rechazo; e:8174
- [value] retorno de calcularGastosTrabajo; e:8175
- [value] retorno de rechazo; e:8178
- [value] retorno de calcularGastosTrabajo; e:8179
- [value] retorno de rechazo; e:8182
- [value] retorno de calcularGastosTrabajo; e:8183
- [value] retorno de rechazo; e:8186
- [value] retorno de calcularGastosTrabajo; e:8187
- [value] retorno de rechazo; e:8190
- [value] retorno de calcularGastosTrabajo; e:8191
- [value] retorno de rechazo; e:8194
- [value] retorno de calcularGastosTrabajo; e:8195
- [value] retorno de rechazo; e:8198
- [value] retorno de calcularGastosTrabajo; e:8199
- [value] retorno de rechazo; e:8202
- [value] retorno de calcularGastosTrabajo; e:8203
- [value] constructor Decimal; e:8204
- [value] receptor de operación Decimal; e:8206
- [value] retorno de calcularGastosTrabajo; e:8208
- [value] retorno de adaptarTrabajoAnual; e:8211
- [value] constructor Decimal; e:8215

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
