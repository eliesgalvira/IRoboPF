import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { aplicarDeduccionesTerritoriales2025 as aplicar } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { casoUniformeC36, casoExplicitoC36, magnitudesConexionC36, viviendaConexionC36, donativoConexionC36 } from "./c36-conexion-anual.fixtures"
const doc = (referencia: string, fecha = "2025-12-31") => ({referencia, fecha, emisor: "entidad"})
function fixture(precio = "10000") {
  const s = viviendaConexionC36("canarias_inversion_vivienda_habitual")
  const v = s.hechos.viviendas[0]
  if (v === undefined) throw new RangeError("fixture sin vivienda")
  const p = v.gastos[0]
  if (p === undefined) throw new RangeError("fixture sin pago")
  return Schema.decodeUnknownSync(ViviendaC36)({...s, hechos: {...s.hechos,
    viviendas: [{...v, adquisicion: "2025-02-01", ocupacion: "2025-02-01", habitualDesde: "2025-02-01", propietarios: [{persona: "s-1", porcentaje: "100", titulo: "escritura"}], gastos: [{...p, fecha: "2025-02-01", concepto: "adquisicion", importe: precio, perceptor: "VEN", naturaleza: "propio", ayudasExentas: "0", reembolsos: "0", medio: "transferencia"}]}],
    historiaAdquisicion: {
      ubicacion: "canarias", catastro: v.catastro, localizacion: doc("catastro"), residencia: {desde: "2025-02-01", hasta: "2025-12-31", documento: doc("padron")}, ayudas: {documento: doc("censo-ayudas"), censo: "todas_concesiones_y_cobros_desde_adquisicion", expedientes: []},
      patrimonio: {ejercicio: 2025, persona: "s-1", exhaustividad: "todos_activos_deudas_derechos_y_movimientos", prestamo: null,
        censo: [{id: "CTA", tipo: "cuenta_euros", inicio: "presente"}, {id: v.id, tipo: "vivienda", inicio: "ausente"}].map(c => ({...c, titular: "s-1", participacion: [1,1], cierre: "presente", documento: doc("censo")})),
        cuentas: [{id: "CTA", inicio: {importe: "2000", documento: doc("inicio", "2025-01-01")}, cierre: {importe: "2000", documento: doc("cierre")}}],
        movimientos: [{id: "ingreso", fecha: "2025-01-02", importe: precio, clase: "ingreso", sentido: "entrada", documento: doc("ingreso")}, {id: p.id, fecha: "2025-02-01", importe: precio, clase: "precio", sentido: "salida", documento: doc(p.factura)}].map(x => ({...x, cuenta: "CTA"})),
        adquisicion: {inmueble: v.id, fecha: "2025-02-01", vendedor: "VEN", precio, escritura: doc("escritura", "2025-02-01"), valorCierre: {importe: precio, documento: doc("valor")}},
        historia: {desde: "1985-01-01", hasta: "2025-12-31", documento: doc("vida"), derechos: [{inmueble: v.id, titular: "s-1", adquisicion: "2025-02-01", transmision: null, titulo: doc("escritura", "2025-02-01")}], anticipos: [], ejercicios: Array.from({length: 40}, (_, i) => ({anio: 1985 + i, documento: doc("ejercicio" + i), eventos: []}))},
      },
    },
  }}, {onExcessProperty: "error"})
}
const marco = () => ({...magnitudesConexionC36(), baseGeneral: new Decimal("26035"), cuotaAutonomica: new Decimal("10000")})
for (const [precio, esperado] of [["0.01", "0.00035"], ["5999.99", "209.99965"], ["6000", "210"], ["6000.01", "210"], ["10000", "210"]]) {
  it(`Fraction base frontera ${precio}`, () => {
    expect(aplicar({solicitudes: [fixture(precio)]}, marco()).total).toEqual(racional(esperado))
  })
}
it.each([["26034.99", "300"], ["26035", "210"], ["46454.99", "210"]])("renta %s", (renta, esperado) => {
  expect(aplicar({solicitudes: [fixture()]}, {...marco(), baseGeneral: new Decimal(renta)}).total).toEqual(racional(esperado))
})
it("46455 no habilita importe", () => expect(() => aplicar({solicitudes: [fixture()]}, {...marco(), baseGeneral: new Decimal("46455")})).toThrow(/46455/))
it("cuota0 agota un derecho calculado", () => expect(aplicar({solicitudes: [fixture()]}, {...marco(), cuotaAutonomica: new Decimal(0)}).total).toEqual(racional("0")))
it("grupo15% consume una sola vez", () => expect(aplicar({solicitudes: [fixture()]}, {...marco(), cuotaAutonomica: new Decimal(1000)}).total).toEqual(racional("150")))
it("concurrencia exige censo conjunto aunque cambie la factura", () => expect(() => aplicar({solicitudes: [fixture(), donativoConexionC36()]}, marco())).toThrow(/concurrencia/))
it("la referencia bancaria al pago no permite duplicar la solicitud", () => {
  const s = fixture()
  expect(() => aplicar({solicitudes: [s, s]}, marco())).toThrow()
})
it("la referencia bancaria exige conciliar el importe, no sólo el ID", () => {
  const s = fixture(), h = s.hechos.historiaAdquisicion
  if (h === undefined) throw new RangeError("fixture sin historia")
  Object.assign(s.hechos.viviendas[0].gastos[0], {importe: "9999.99"})
  expect(() => aplicar({solicitudes: [s]}, marco())).toThrow(/pago no vinculado/)
})
for (const api of ["uniforme", "explicita"] as const) {
  const programa = (s: typeof ViviendaC36.Type) => Effect.gen(function* () {
    if (api === "uniforme") return yield* liquidarIrpfAnual({...casoUniformeC36(), deduccionesTerritoriales2025: {solicitudes: [s]}}, {modo: "canonico"})
    return yield* liquidarIrpfAnualExplicito(casoExplicitoC36([s]))
  })
  it(`${api} genera210 sin cuota estatal DT18`, () => {
    const r = Effect.runSync(programa(fixture()))
    expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("210"))
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
  })
  for (const causa of ["vida", "antecedente", "territorio", "pago", "ayuda", "patrimonio", "fecha"] as const) {
    it(`${api} rechazo tipado sin importe: ${causa}`, () => {
      const s = fixture(), h = s.hechos.historiaAdquisicion
      if (h === undefined) throw new RangeError("fixture sin historia")
      if (causa === "vida") Object.assign(h.patrimonio.historia, {ejercicios: []})
      if (causa === "antecedente") Object.assign(h.patrimonio.historia, {anticipos: [{inmueble: "otra", fecha: "2024-01-01", importe: "1", documento: doc("anticipo")}]})
      if (causa === "territorio") Object.assign(h, {ubicacion: "otra"})
      if (causa === "pago") Object.assign(s.hechos.viviendas[0]?.gastos[0] ?? {}, {importe: "9999.99"})
      if (causa === "ayuda") Object.assign(h.ayudas, {expedientes: [doc("ayuda")]})
      if (causa === "patrimonio") Object.assign(h.patrimonio, {censo: [...h.patrimonio.censo, {...h.patrimonio.censo[0], id: "otra"}]})
      if (causa === "fecha") Object.assign(h.patrimonio.adquisicion, {fecha: "2012-02-01"})
      const error = Effect.runSync(Effect.flip(programa(s)))
      expect(error._tag).toBe("ResultadoNoSoportado")
      expect("cuotaLiquidaCentimos" in error).toBe(false)
    })
  }
}
it("incremento un céntimo insuficiente produce0 por condición, sin prorrata", () => {
  const s = fixture(), h = s.hechos.historiaAdquisicion
  if (h === undefined) throw new RangeError("fixture sin historia")
  Object.assign(h.patrimonio, {movimientos: [...h.patrimonio.movimientos, {id: "consumo", cuenta: "CTA", fecha: "2025-12-31", importe: "0.01", sentido: "salida", clase: "consumo", documento: doc("consumo")}]})
  Object.assign(h.patrimonio.cuentas[0]?.cierre ?? {}, {importe: "1999.99"})
  expect(aplicar({solicitudes: [s]}, marco()).total).toEqual(racional("0"))
})

it("menor40: censo vital reconstruido, no edad aislada", () => {
  const s = fixture(), h = s.hechos.historiaAdquisicion
  if (h === undefined) throw new RangeError("fixture sin historia")
  Object.assign(s.hechos, {nacimientoContribuyente: "1986-01-01"})
  Object.assign(h.patrimonio.historia, {desde: "1986-01-01", ejercicios: h.patrimonio.historia.ejercicios.filter(x => x.anio >= 1986)})
  const m = marco()
  expect(aplicar({solicitudes: [s]}, {...m, caso: {...m.caso, situacionFamiliar: {...m.caso.situacionFamiliar, edad: 39}}}).total).toEqual(racional("240"))
})
it.each(["baseElegible", "gananciaExentaReinvertida", "derecho"])('contrato rechaza magnitud fiscal externa %s', campo => {
  const s = fixture()
  expect(() => Schema.decodeUnknownSync(ViviendaC36)({...s, hechos: {...s.hechos, [campo]: "0"}}, {onExcessProperty: "error"})).toThrow()
})

// H1/H2 de la primera revisión independiente: esperado conservado, sin ampliar financiación.
for (const api of ["uniforme", "explicita"] as const) {
  const programa = (s: typeof ViviendaC36.Type) => Effect.gen(function* () {
    if (api === "uniforme") {
      const caso = casoUniformeC36()
      return yield* liquidarIrpfAnual({...caso, situacionFamiliar: {...caso.situacionFamiliar, edad: 39}, deduccionesTerritoriales2025: {solicitudes: [s]}}, {modo: "canonico"})
    }
    return yield* liquidarIrpfAnualExplicito({...casoExplicitoC36([s]), edad: 39})
  })
  const propia = (fechaPago: string) => {
    const s = fixture("6000"), h = s.hechos.historiaAdquisicion
    if (h === undefined) throw new RangeError("fixture sin historia")
    Object.assign(s.hechos, {nacimientoContribuyente: "1986-01-01"})
    Object.assign(h.patrimonio.historia, {desde: "1986-01-01", ejercicios: h.patrimonio.historia.ejercicios.filter(x => x.anio >= 1986)})
    const pago = s.hechos.viviendas[0]?.gastos[0]
    const banco = h.patrimonio.movimientos.find(x => x.clase === "precio")
    if (pago === undefined || banco === undefined) throw new RangeError("fixture sin pago bancario")
    Object.assign(pago, {fecha: fechaPago})
    Object.assign(banco, {fecha: fechaPago, documento: doc(pago.factura, fechaPago)})
    return s
  }
  it.each(["2025-02-02", "2025-12-31"])(`${api} H1 pago propio posterior a compra %s:240`, fechaPago => {
    const r = Effect.runSync(programa(propia(fechaPago)))
    expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("240"))
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
  })
  it.each(["2025-01-31", "2026-01-01"])(`${api} H1 conserva rechazo de anticipo o pago ajeno a2025:%s`, fechaPago => {
    const r = Effect.runSync(Effect.flip(programa(propia(fechaPago))))
    expect(r._tag).toBe("ResultadoNoSoportado")
    expect("cuotaLiquidaCentimos" in r).toBe(false)
  })
  it.each(["censo duplicado/vacío", "movimiento inválido", "saldo bancario no concilia"])(`${api} H2 preserva causa bancaria:%s`, causa => {
    const s = propia("2025-02-02"), h = s.hechos.historiaAdquisicion
    if (h === undefined) throw new RangeError("fixture sin historia")
    const p = h.patrimonio, banco = p.movimientos.find(x => x.clase === "precio")
    if (banco === undefined) throw new RangeError("fixture sin precio")
    if (causa === "censo duplicado/vacío") Object.assign(p, {movimientos: [...p.movimientos, {...banco, id: "banco-repetido"}]})
    if (causa === "movimiento inválido") Object.assign(banco, {fecha: "2024-12-31"})
    if (causa === "saldo bancario no concilia") Object.assign(p.cuentas[0]?.cierre ?? {}, {importe: "1999.99"})
    const r = Effect.runSync(Effect.flip(programa(s)))
    expect(r._tag).toBe("ResultadoNoSoportado")
    expect(r.motivo).toContain("P5a cuentas: " + causa)
    expect("cuotaLiquidaCentimos" in r).toBe(false)
  })
}
