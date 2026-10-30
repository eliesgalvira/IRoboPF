# anual.cuota.ahorro-total

Estado del candidato histórico: revisión independiente pendiente; cierre técnico, publicación y aceptación jurídica: false.

Fórmula TS: "Suma de cuotas por tramo"

Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.

El detalle de productores y literales, con archivo, rango y relación, se conserva en [composicion.json.gz](../composicion.json.gz). Las limitaciones no resueltas de esta ficha son:

- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (selector, selection); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- [] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3154–3156
- () => [] / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- EffectArray.reduce(
    calcularDesgloseCuotaPorEscala({ base, tramos, escalasPublicadas }),
    base.mul(0),
    (total, tramo) => total.plus(tramo.cuota)
  ) / value (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1450–1609
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- [
  [importe(6000), importe("0.195")],
  [importe(50000), importe("0.215")],
  [importe(Infinity), importe("0.235")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4437–4556
- (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        convertirCentimos,
      }) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1477–1635
- EffectArray.reduce(
              tramos,
              {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGener / tramos (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3222–4443
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3115–3307
- caso / anio (selector, selection); public-input; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:9398–9402
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3681–3835
- Option.getOrElse(() => []) / value (selector, selection); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (selector, selection); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
- [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:4609–4725
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (EUR, value); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (EUR, value); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- {
                limiteAnterior: base.mul(0),
                tramos: EffectArray.empty<TramoCuotaGeneralCalculado>(),
              } / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3278–3413
- {
      gananciaTotal: IMPORTE_CERO,
      gananciaExenta: IMPORTE_CERO,
      gananciaSujetaAhorro: IMPORTE_CERO,
      gananciaSujetaGeneral: IMPORTE_CERO,
   / value (EUR, value); Objeto completo: se exige propiedad de salida; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1647–1810
- () => [] / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14276–14284
- (total, tramo) => total.plus(tramo.cuota) / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:1564–1605
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- (total, ganancia) => ({
      gananciaTotal: total.gananciaTotal.plus(ganancia.gananciaTotal),
      gananciaExenta: total.gananciaExenta.plus(ganancia.ganancia / value (selector, selection); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1816–2358
- Option.getOrElse(() => []) / value (EUR, value); Contrato de llamada pendiente: Option.getOrElse; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14259–14285
- (estado, [limite, tipo]) => {
                const baseRestante = Decimal.max(
                  0,
                  base.minus(estado.limiteAnterior)
        / value (EUR, value); Forma AST no admitida: ArrowFunction; lib/dominio/irpf/cuotas/escalas-gravamen.ts:3429–4429
- EffectArray.reduce(
    EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
     / gananciaSujetaAhorro (EUR, value); Contrato de llamada pendiente: EffectArray.reduce; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1426–2362
- EffectArray.map(ganancias, (ganancia) =>
      calcularGananciaPatrimonialPorTransmision({
        anio,
        edadContribuyente,
        ganancia,
        co / value (selector, selection); Contrato de llamada pendiente: EffectArray.map; lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts:1450–1641
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
] / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3964–4080
- {
    base,
    tramos: obtenerTramosIrpfAhorro(anio),
  } / escalasPublicadas (selector, selection); Propiedad no resuelta (spread/alias): escalasPublicadas; lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts:602–660
- Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])) / value (selector, selection); Contrato de llamada pendiente: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe; lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:14171–14286
- [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [import / value (EUR, value); Array completo requiere contrato por elemento; lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts:3360–3552
## Condiciones por relación

- [value] argumento de max; e:0
- [value] argumento conservado sin afirmar cierre; e:1
- [value] argumento conservado sin afirmar cierre; e:2
- [value] sustitución por propiedad del argumento; e:4
- [value] argumento conservado sin afirmar cierre; e:5
- [value] argumento conservado sin afirmar cierre; e:6
- [value] argumento conservado sin afirmar cierre; e:7
- [value] argumento conservado sin afirmar cierre; e:8
- [value] argumento conservado sin afirmar cierre; e:9
- [value] retorno de calcularGananciasPatrimonialesPorTransmision; e:10
- [value] si calcular devuelve; instrumentación no transforma el valor; e:11
- [value] sustitución por propiedad del argumento; e:14
- [value] argumento de max; e:16
- [value] retorno de calcularBaseImponibleAhorro; e:17
- [value] si calcular devuelve; instrumentación no transforma el valor; e:18
- [selection] argumento conservado sin afirmar cierre; e:733
- [selection] argumento conservado sin afirmar cierre; e:734
- [selection] sustitución por propiedad del argumento; e:736
- [selection] argumento conservado sin afirmar cierre; e:737
- [selection] argumento conservado sin afirmar cierre; e:738
- [selection] argumento conservado sin afirmar cierre; e:748
- [selection] argumento conservado sin afirmar cierre; e:749
- [selection] argumento conservado sin afirmar cierre; e:750
- [selection] retorno de calcularGananciasPatrimonialesPorTransmision; e:751
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:752
- [selection] sustitución por propiedad del argumento; e:1904
- [selection] sustitución por propiedad del argumento; e:1906
- [selection] !==; e:1908
- [selection] selecciona rama; e:1909
- [selection] argumento de max; e:1910
- [selection] sustitución por propiedad del argumento; e:1913
- [selection] argumento de max; e:1915
- [selection] retorno de calcularBaseImponibleAhorro; e:1916
- [selection] si calcular devuelve; instrumentación no transforma el valor; e:1917
- [selection] sustitución por propiedad del argumento; e:1920
- [selection] sustitución por propiedad del argumento; e:1922
- [selection] sustitución por propiedad del argumento; e:1924
- [selection] selecciona Match; e:1925
- [selection] sustitución de argumento exacto; e:1926
- [selection] receptor de operación Decimal; e:1927
- [selection] argumento de lte; e:1928
- [selection] base matches (base) => base.lte(0); e:1929
- [value] base matches (base) => base.lte(0); e:1930
- [selection] binding único desde servicio anual; e:1931
- [selection] sustitución por propiedad del argumento; e:1934
- [selection] sustitución de argumento exacto; e:1935
- [selection] selecciona Match; e:1936
- [value] anio matches 2012; e:1939
- [value] ningún matcher previo (2012) && anio matches 2013; e:1942
- [value] ningún matcher previo (2012 | 2013) && anio matches 2014; e:1944
- [value] ningún matcher previo (2012 | 2013 | 2014) && anio matches 2015; e:1946
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015) && anio matches 2016; e:1949
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016) && anio matches 2017; e:1952
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017) && anio matches 2018; e:1955
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018) && anio matches 2019; e:1958
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019) && anio matches 2020; e:1960
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020) && anio matches 2021; e:1963
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021) && anio matches 2022; e:1965
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022) && anio matches 2023; e:1968
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023) && anio matches 2024; e:1970
- [value] ningún matcher previo (2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024) && else; e:1972
- [value] retorno de obtenerTramosIrpfAhorro; e:1973
- [value] sustitución por propiedad del argumento; e:1975
- [value] sustitución por propiedad del argumento; e:1977
- [value] argumento conservado sin afirmar cierre; e:1978
- [value] argumento conservado sin afirmar cierre; e:1979
- [value] argumento conservado sin afirmar cierre; e:1980
- [value] ningún matcher previo ((base) => base.lte(0)) && else; e:1982
- [value] !(escalasPublicadas !== undefined); e:1983
- [value] retorno de calcularDesgloseCuotaPorEscala; e:1984
- [value] argumento conservado sin afirmar cierre; e:1985
- [value] sustitución por propiedad del argumento; e:1988
- [value] sustitución por propiedad del argumento; e:1990
- [value] receptor de operación Decimal; e:1991
- [value] argumento de mul; e:1992
- [value] argumento conservado sin afirmar cierre; e:1993
- [value] argumento conservado sin afirmar cierre; e:1994
- [value] retorno de calcularCuotaPorEscala; e:1995
- [value] retorno de calcularCuotaPorEscalaAhorro; e:1996

Admisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.
