import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { producirBasesFamiliares2025, producirEconomiaAjena2025, EconomiaPersonaFamiliar2025, type CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { producirAlquilerFamiliar2025, type AlquilerViviendaFamilia2025 } from "../lib/dominio/irpf/bases-familiares-2025/alquiler-vivienda"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { galiciaInversion } from "./galicia-alquiler-inversion.fixtures"
import oraculos from "./familia-alquiler-2025.oraculos.json"
const D = Decimal.clone({ precision: 80 })
type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T
function alquiler(neto = "1000", sujeto = "s-2"): Mutable<AlquilerViviendaFamilia2025> {
  // SAFETY: la fixture está tipada como InmuebleP4a; structuredClone crea arrays y objetos propios. Sólo se elimina readonly.
  const v = structuredClone(galiciaInversion(false, new D(neto).plus(2400).toFixed()).inmuebles[0]!) as Mutable<AlquilerViviendaFamilia2025["inmueble"]>
  const id = v.id + "-" + sujeto
  return { referencia: "arrendador-familiar", ejercicio: 2025, tituloAdquisicion: "compraventa-onerosa", sujetoId: sujeto, nacimiento: "1985-01-01",
    inmueble: { ...v, id, catastro: v.catastro + "-" + sujeto, titular: sujeto, titulares: [sujeto], regimenMatrimonial: "separacion-bienes",
      contrato: { ...v.contrato, arrendador: sujeto } },
    censoDerechos: { documento: "censo-mundial", cobertura: "mundial-propiedad-usufructo-cualquier-porcentaje-todo-2025", inmuebles: [id] },
    contextoRendimientos: "calculo-ordinario-sin-procedimiento-ni-rectificacion", retenciones: "ninguna" }
}
function economia(neto = "1000", sujeto = "s-2") {
  return { perfil: "solo-alquiler-vivienda", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno", alquilerVivienda2025: alquiler(neto, sujeto) } as const
}
function trabajo(bruto: string) {
  return { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: bruto,
    cotizaciones: { ...r.cotizaciones, seguridadSocial: "1000" } })) }
}
function casos(territorio: "madrid" | "comunitat-valenciana", importe = "1000") {
  const c: Mutable<CensoBasesFamiliares2025> = { referencia: "familia", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1",
    estadoCivil: "casado-no-separado", conyuge: "s-2", censoCompleto: true, hijosCompletos: true,
    hijos: ["s-3", "s-4"].map(id => ({ id, nacimiento: "2017-01-01", progenitores: ["s-1", "s-2"], conviveCon: ["s-1", "s-2"],
      independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "filiacion" })),
    personas: ["s-1", "s-2", "s-3", "s-4"].map(id => ({ id, soporte: "censo", residenteComunTodo2025: true, vivoTodo2025: true,
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-2" ? economia(importe) : { perfil: "sin-rentas", censoRentasCompleto: true } })) }
  const ds = ["s-3", "s-4"].map(sujetoId => ({ ...derechos.descendientes[0]!, sujetoId,
    titulares: derechos.descendientes[0]!.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? 2605600 : new D(importe).times(100).toNumber() })) }))
  const d = { ...derechos, territorio, descendientes: ds }
  const a = { ...analitico, comunidadAutonoma: territorio, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: c }
  const e = { ...efectivo, comunidadAutonoma: territorio, contribuyenteId: "s-1", derechosMinimos: d, basesFamiliares2025: c, familiaresConDerechoMinimo: "segun-derechos" } as const
  return { c, d, a, e }
}

it.each(oraculos)("Fraction: art20 sobre alquiler neto y base tras art23 %s", o => {
  const e = { ...economia(o.neto), perfil: "trabajo-y-alquiler-vivienda", trabajo: trabajo(o.bruto) } as const
  for (const madrid of [true, false]) {
    const b = producirEconomiaAjena2025(e, madrid)
    // El oráculo racional legal permanece intacto. Madrid conserva la política
    // publicada de cuantización laboral; no se cuantiza la parte inmobiliaria.
    const netoTrabajo = new D(o.bruto).minus(3000)
    const reduccion = netoTrabajo.minus(new D(o.general).minus(o.reducido))
    const general = madrid ? netoTrabajo.minus(reduccion.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)).plus(o.reducido).toFixed() : o.general
    expect(b.general.toFixed()).toBe(general)
    expect(b.ahorro.toFixed()).toBe("0")
    expect(b.rentaAntesReducciones!.toFixed()).toBe(o.renta)
  }
})
it("8000 netos computan 4000 en base y 8000 para mínimos; principal no es gasto", () => {
  const b = producirEconomiaAjena2025(economia("8000"), true)
  expect(b.general.toFixed()).toBe("4000")
  expect(b.rentaAntesReducciones!.toFixed()).toBe("8000")
})
it("cero neto admitido sin importe ficticio ni reducción negativa", () => {
  expect(producirAlquilerFamiliar2025(alquiler("0")).reducido.toFixed()).toBe("0")
})
it("contrato laboral anterior no se amplía implícitamente", () => {
  expect(Schema.decodeUnknownResult(EconomiaPersonaFamiliar2025)(economia())._tag).toBe("Failure")
})
for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
  for (const api of ["canonica", "explicita"] as const) {
    it(`${territorio} PRE positivo ${api}: acepta familiar y conserva cuota propia`, () => {
      const { a, e } = casos(territorio)
      const control = casos(territorio)
      control.c.personas[1]!.economia = { perfil: "sin-rentas", censoRentasCompleto: true }
      for (const d of control.d.descendientes) d.titulares[1]!.rentasNoExentasCentimos = 0
      if (api === "canonica") {
        const r = Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))
        expect(r._tag).toBe("Success")
        if (r._tag !== "Success") throw Error("positivo rechazado")
        expect(r.success.cuotaLiquidaCentimos).toBe(Effect.runSync(liquidarIrpfAnual(control.a, { modo: "canonico" })).cuotaLiquidaCentimos)
      } else {
        const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))
        expect(r._tag).toBe("Success")
        if (r._tag !== "Success") throw Error("positivo rechazado")
        expect(r.success.cuotaLiquidaLegal).toBe(Effect.runSync(liquidarIrpfAnualExplicito(control.e)).cuotaLiquidaLegal)
      }
    })
  }
  for (const causa of ["titular", "persona", "cotitular", "arrendatario-familiar", "nacimiento", "estado-civil", "censo", "fecha", "devengo", "perdida", "arrastre", "DT38", "parcial", "mejora", "duplicado", "renta-minimos", "H2"] as const) {
    it(`${territorio} ambas API rechazan ${causa}`, () => {
      const { c, d, a, e } = casos(territorio)
      const ec = economia(), h = ec.alquilerVivienda2025, v = h.inmueble
      c.personas[1]!.economia = ec
      if (causa === "titular") v.titular = "s-99"
      if (causa === "persona") { h.sujetoId = "s-99"; v.titular = "s-99"; v.titulares = ["s-99"]; v.contrato.arrendador = "s-99" }
      if (causa === "cotitular") v.titulares.push("s-1")
      if (causa === "arrendatario-familiar") v.contrato.arrendatario = "s-3"
      if (causa === "nacimiento") h.nacimiento = "2008-01-01"
      if (causa === "estado-civil") v.regimenMatrimonial = "no-casado"
      if (causa === "censo") h.censoDerechos.inmuebles.push("otra")
      if (causa === "fecha") v.exigibilidades[0]!.fecha = "2025-02-30"
      if (causa === "devengo") { v.gastos[0]!.clase = "seguro"; v.gastos[0]!.periodoDevengo = { desde: "2024-01-01", hasta: "2024-12-31" } }
      if (causa === "perdida") v.exigibilidades[0]!.importe = "2399.99"
      if (causa === "arrastre") { v.gastos[0]!.clase = "intereses"; v.gastos[0]!.importe = "9999"; v.gastos[0]!.totalFactura = "9999" }
      if (causa === "DT38") v.contrato.firma = "2023-05-25"
      if (causa === "parcial") v.contrato.desde = "2025-01-02"
      if (causa === "mejora") v.gastos[0]!.clase = "mejora"
      if (causa === "duplicado") v.exigibilidades.push(structuredClone(v.exigibilidades[0]!))
      if (causa === "renta-minimos") d.descendientes[0]!.titulares[1]!.rentasNoExentasCentimos = 50000
      if (causa === "H2") c.personas[1]!.economia = { ...ec, perfil: "trabajo-y-alquiler-vivienda", trabajo: { ...trabajo("10000"), discapacidadActiva: { grado: "65-o-mas", ayudaOMovilidadReducida: "no", acreditadaDuranteTodoElTrabajo: "si" } } }
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))).toMatchObject({ _tag: "Failure" })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: "Failure" })
    })
  }
  for (const neto of ["1800", "1800.01", "8000", "8000.01"]) {
    it(`${territorio} mínimo y declaración concilian neto ${neto} sin art23`, () => {
      const { c, d, a, e } = casos(territorio)
      const ec = economia(neto, "s-3")
      ec.alquilerVivienda2025.nacimiento = "2006-01-01"
      c.personas[2]!.economia = ec; c.hijos[0]!.nacimiento = "2006-01-01"
      d.descendientes[0]!.fechaNacimiento = "2006-01-01"
      d.descendientes[0]!.edadDevengo = 19
      d.descendientes[0]!.rentasNoExentasCentimos = new D(neto).times(100).toNumber()
      d.descendientes[0]!.declaracion = { modalidad: "individual", rentasCentimos: new D(neto).times(100).toNumber() }
      const b = producirBasesFamiliares2025(c, a, { general: new D(26056), ahorro: new D(0) }).bases.get("s-3")!
      expect(b.general.toFixed()).toBe(new D(neto).div(2).toFixed())
      expect(b.rentaAntesReducciones!.toFixed()).toBe(neto)
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))).toMatchObject({ _tag: "Success" })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: "Success" })
      d.descendientes[0]!.declaracion = { modalidad: "individual", rentasCentimos: new D(neto).times(50).toNumber() }
      expect(() => producirBasesFamiliares2025(c, a, { general: new D(26056), ahorro: new D(0) })).toThrow("renta económica contradice declaración")
    })
  }
}

const codigoValencia = "valenciana_dos_o_mas_descendientes"
const solicitudValencia = () => ({ ejercicio: 2025, territorio: "comunitat-valenciana", modalidad: "individual", devengo: "2025-12-31", contribuyente: "s-1", cantidades: [],
  solicitudes: [{ codigo: codigoValencia, eleccion: "aplicar", unidades: [{ id: "u", titulares: ["s-1"], fecha: "2025-12-31", numeros: {}, textos: {} }],
    referencias: [{ unidad: "u", sujetos: ["s-3", "s-4"], bienes: [], eventos: [], cantidades: [] }] }], ordenBase30: [], consignaciones: [], arrastres: [],
  ordenConsumo: [JSON.stringify([codigoValencia, 2025, "s-1"])], criterioOrden: "eleccion_experta" } as const)

for (const centimo of [0, 1]) {
  it(`Valencia ambas API usan base reducida del alquiler en frontera30000 céntimo=${centimo}`, () => {
    const { a, e } = casos("comunitat-valenciana", new D(7888).plus(new D(centimo).div(100)).toFixed())
    const ra = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesValencianas2025: solicitudValencia() }, { modo: "canonico" }))
    const re = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "valencianas-por-hechos-y-da61", deduccionesValencianas2025: solicitudValencia() }))
    expect(new D(ra.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(centimo === 0)
    expect(new D(re.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(centimo === 0)
  })
  it(`Madrid ambas API usan base reducida del alquiler en frontera familiar céntimo=${centimo}`, () => {
    const { a, e } = casos("madrid", new D(195328).plus(new D(centimo).div(100)).toFixed())
    const f = { solicitudes: [{ lote: "F-ampliado", codigo: "madrid_condicion_familia_numerosa", hechos: {
      titulo: { categoria: "general", referencia: "titulo", efectos: "2025-01-01", titulares: ["s-1"] } } }] } as const
    const pre = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" }))
    const post = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: f }, { modo: "canonico" }))
    const preE = Effect.runSync(liquidarIrpfAnualExplicito(e))
    const postE = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: f }))
    expect(post.cuotaLiquidaCentimos < pre.cuotaLiquidaCentimos).toBe(centimo === 0)
    expect(new D(postE.cuotaLiquidaLegal).lt(preE.cuotaLiquidaLegal)).toBe(centimo === 0)
  })
}

it("adquisición antes del nacimiento no produce base", () => {
  const h = alquiler(); h.inmueble.adquisicion.fecha = "1984-12-31"
  expect(() => producirAlquilerFamiliar2025(h)).toThrow("adquisición anterior")
})
for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
  it(`${territorio} ambas API rechazan propiedad exclusiva repetida entre miembros`, () => {
    const { c, d, a, e } = casos(territorio)
    const ec = economia("1000", "s-3"), propio = economia().alquilerVivienda2025.inmueble
    ec.alquilerVivienda2025.nacimiento = "2006-01-01"
    ec.alquilerVivienda2025.inmueble.id = propio.id
    ec.alquilerVivienda2025.inmueble.catastro = propio.catastro
    ec.alquilerVivienda2025.censoDerechos.inmuebles = [propio.id]
    c.personas[2]!.economia = ec; c.hijos[0]!.nacimiento = "2006-01-01"
    d.descendientes[0]!.fechaNacimiento = "2006-01-01"
      d.descendientes[0]!.edadDevengo = 19
    d.descendientes[0]!.rentasNoExentasCentimos = 100000
    expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))).toMatchObject({ _tag: "Failure" })
    expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: "Failure" })
  })
}

for (const territorio of ["madrid", "comunitat-valenciana"] as const) {
  for (const umbral of [1800, 8000]) for (const diferencia of ["0.01", "-0.01"]) {
    it(`${territorio} conserva clasificación ${umbral} con amortización subcéntimo ${diferencia}`, () => {
      const { c, d, a, e } = casos(territorio)
      const ec = economia(String(umbral), "s-3")
      ec.alquilerVivienda2025.nacimiento = "2006-01-01"
      ec.alquilerVivienda2025.inmueble.adquisicion.precio = new D(100000).plus(diferencia).toFixed()
      c.personas[2]!.economia = ec; c.hijos[0]!.nacimiento = "2006-01-01"
      d.descendientes[0]!.fechaNacimiento = "2006-01-01"
      d.descendientes[0]!.edadDevengo = 19
      d.descendientes[0]!.rentasNoExentasCentimos = umbral * 100
      d.descendientes[0]!.declaracion = { modalidad: "individual", rentasCentimos: umbral * 100 }
      const neto = new D(umbral).minus(new D(diferencia).times("0.03"))
      expect(producirAlquilerFamiliar2025(ec.alquilerVivienda2025).neto.toFixed()).toBe(neto.toFixed())
      const esperado = diferencia === "0.01" ? "Success" : "Failure"
      expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a, { modo: "canonico" })))).toMatchObject({ _tag: esperado })
      expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({ _tag: esperado })
    })
  }
}
