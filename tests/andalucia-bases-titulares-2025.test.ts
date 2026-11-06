import { adaptarTrabajoAnual } from "../lib/dominio/irpf/trabajo-anual/adaptador"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"

// Importes derivados de Fraction en el oráculo entregado, nunca del productor.
const nacimiento = "1985-01-01"
function datos(adopcion: boolean, otraBase = 0, otraCA = false, especial = false) {
  const ids = ["s-1", "s-2"]
  const solicitud = adopcion ? { lote: "A40", codigo: "andalucia_adopcion_internacional", nacimiento,
    hechos: { adopciones: [{ persona: "s-3", inscripcionCivil: "2025-05-01", normaConvenio: "Convenio-La-Haya", asiento: "RC-2025", titulares: ids }] } }
    : { lote: "A40", codigo: "andalucia_familia_numerosa", nacimiento,
      hechos: { familia: { categoria: especial ? "especial" : "general", desde: "2024-01-01", hasta: "2026-12-31", referencia: "titulo2025", titulares: ids },
        posicion: "ascendiente", ambitoTitulares: { referenciaTitulo: "titulo2025", censoCompleto: true, ascendientes: ids, soporte: "censo-titulo" } } }
  const economia = otraBase === 0 ? { perfil: "sin-rentas", censoRentasCompleto: true }
    : { perfil: "solo-trabajo", censoRentasCompleto: true, otrasRentas: "ninguna", reduccionesBase: "ninguna", saldosAnteriores: "ninguno",
      trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, clase: "pension", integro: String(otraBase + 2000),
        cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" } })) } }
  const censo = { referencia: "censo2025", ejercicio: 2025, devengo: "2025-12-31", contribuyente: "s-1", estadoCivil: "sin-vinculo",
    censoCompleto: true, hijosCompletos: true,
    hijos: adopcion ? [{ id: "s-3", nacimiento: "2017-01-01", progenitores: ids, conviveCon: ids,
      independienteConConsentimiento: false, apoyoJudicial: "ninguno", soporte: "filiacion" }] : [],
    personas: ["s-1", "s-2", ...(adopcion ? ["s-3"] : [])].map(id => ({ id, soporte: "identidad-" + id, residenteComunTodo2025: true, vivoTodo2025: true,
      declaracion2025: { modalidad: id === "s-3" ? "no-presenta" : "individual", soporte: "declaracion-" + id },
      residenciaAutonomica2025: { comunidad: id === "s-2" && otraCA ? "otra-comunidad-comun" : "andalucia", desde: "2025-01-01", hasta: "2025-12-31", soporte: "residencia-" + id },
      economia: id === "s-1" ? { perfil: "declarante-en-composicion" } : id === "s-2" ? economia : { perfil: "sin-rentas", censoRentasCompleto: true } })) }
  const minimos = { ...derechos, territorio: "andalucia", descendientes: [{ ...derechos.descendientes[0], titulares: derechos.descendientes[0]!.titulares.map(t => ({ ...t,
    rentasNoExentasCentimos: t.titularId === "s-2" ? new Decimal(otraBase).times(100).toNumber() : 0,
    vinculo: { clase: "adopcion", fechaInicioIncremento: "2025-05-01", fechaConstitucionVinculo: "2025-05-01", fundamento: "inscripcion-registro-civil", historialCompleto: true } })) }] }
  return { solicitud, censo, minimos }
}
function casos(d: ReturnType<typeof datos>, integro = 22000) {
  const basesFamiliares2025 = Schema.decodeUnknownSync(CensoBasesFamiliares2025)(d.censo, { onExcessProperty: "error" })
  const deduccionesTerritoriales2025 = Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({ solicitudes: [d.solicitud] }, { onExcessProperty: "error" })
  const adopcion = d.solicitud.codigo === "andalucia_adopcion_internacional"
  const derechosMinimos = adopcion ? Schema.decodeUnknownSync(DerechosMinimosAnuales)(d.minimos) : undefined
  const a = { ...analitico, contribuyenteId: "s-1", comunidadAutonoma: "andalucia" as const, basesFamiliares2025,
    rendimientos: { trabajo: [{ importeIntegroCentimos: integro * 100 }] } }
  const e = { ...efectivo, contribuyenteId: "s-1", comunidadAutonoma: "andalucia" as const, basesFamiliares2025,
    familiaresConDerechoMinimo: adopcion ? "segun-derechos" as const : "ninguno" as const,
    trabajo: { ...efectivo.trabajo, rendimientos: efectivo.trabajo.rendimientos.map(r => ({ ...r, integro: String(integro), cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" } })) } }
  if (derechosMinimos !== undefined) {
    // Hechos de renta propia conciliados por API, sin asumir igualdad de políticas.
    const netoA = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" })).rendimientoNetoTrabajoCentimos
    const trabajo = adaptarTrabajoAnual(e.trabajo)
    if (trabajo.estado === "no-soportado") throw Error(trabajo.motivo)
    const netoE = new Decimal(trabajo.rendimientoAntesArt20).times(100).toNumber()
    const conRenta = (renta: number) => ({ ...derechosMinimos, descendientes: derechosMinimos.descendientes.map(d => ({ ...d,
      titulares: d.titulares.map(t => ({ ...t, rentasNoExentasCentimos: t.titularId === "s-1" ? renta : t.rentasNoExentasCentimos })) })) })
    return { a: { ...a, derechosMinimos: conRenta(netoA) }, e: { ...e, derechosMinimos: conRenta(netoE) }, deduccionesTerritoriales2025 }
  }
  return { a, e, deduccionesTerritoriales2025 }
}
function deltas(d: ReturnType<typeof datos>, integro = 22000) {
  const { a, e, deduccionesTerritoriales2025: s } = casos(d, integro)
  const ab = Effect.runSync(liquidarIrpfAnual(a, { modo: "canonico" })), ap = Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: s }, { modo: "canonico" }))
  const eb = Effect.runSync(liquidarIrpfAnualExplicito(e)), ep = Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s }))
  // Cada API contra su basal: sus políticas de trabajo no requieren cuotas iguales.
  return [new Decimal(ab.cuotaLiquidaCentimos - ap.cuotaLiquidaCentimos).div(100).toFixed(), new Decimal(eb.cuotaLiquidaLegal).minus(ep.cuotaLiquidaLegal).toFixed()]
}
it.each([
  [true, 0, false, false, "300"], [true, 80000, false, false, "300"], [true, 80000.01, false, false, "600"],
  [false, 0, false, false, "100"], [false, 25000, false, false, "100"], [false, 25000.01, false, false, "200"],
  [false, 0, true, false, "200"], [false, 0, false, true, "200"], [false, 25000.01, false, true, "400"],
] as const)("ambas API reparto (%s,%s,%s,%s)", (ad, b, ca, esp, esperado) => {
  expect(deltas(datos(ad, b, ca, esp))).toEqual([esperado, esperado])
})
it.each([true, false])("ambas API cero cuota no crea crédito (%s)", ad => {
  expect(deltas(datos(ad), 0)).toEqual(["0", "0"])
})
it.each([true, false])("ambas API propia sobre límite rechaza (%s)", ad => {
  const { a, e, deduccionesTerritoriales2025: s } = casos(datos(ad), ad ? 90000 : 35000)
  expect(() => Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: s }, { modo: "canonico" }))).toThrow()
  expect(() => Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s }))).toThrow()
})
it.each([true, false])("cuota escasa conserva límites sin igualar basales (%s)", ad => {
  for (const delta of deltas(datos(ad), 12500)) {
    expect(new Decimal(delta).gte(0)).toBe(true)
    expect(new Decimal(delta).lte(ad ? 300 : 100)).toBe(true)
  }
})
it.each([
  [true, "adoptante duplicado", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.adopciones![0]!.titulares = ["s-1", "s-1"] }],
  [true, "sujeto ajeno", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.adopciones![0]!.persona = "s-9" }],
  [true, "fecha inscripción", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.adopciones![0]!.inscripcionCivil = "2024-05-01" }],
  [true, "asiento ausente", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.adopciones![0]!.asiento = "" }],
  [true, "convenio ausente", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.adopciones![0]!.normaConvenio = "" }],
  [true, "historia incompleta", (d: ReturnType<typeof datos>) => { Object.assign(d.minimos.descendientes[0]!.titulares[0]!.vinculo, { historialCompleto: false }) }],
  [true, "filiación contradictoria", (d: ReturnType<typeof datos>) => { d.censo.hijos[0]!.progenitores = ["s-1"] }],
  [false, "título caducado", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.familia!.hasta = "2025-12-30" }],
  [false, "título ajeno", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.ambitoTitulares!.referenciaTitulo = "otro" }],
  [false, "censo titulares incompleto", (d: ReturnType<typeof datos>) => { d.solicitud.hechos.ambitoTitulares!.ascendientes = ["s-1"] }],
] as const)("ambas API adversa %s %s", (_ad, _nombre, cambiar) => {
  const d = datos(_ad); cambiar(d)
  // La preparación también cruza los contratos cerrados; jamás transforma rechazo en importe cero.
  expect(() => { const { a, deduccionesTerritoriales2025: s } = casos(d); Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: s }, { modo: "canonico" })) }).toThrow()
  expect(() => { const { e, deduccionesTerritoriales2025: s } = casos(d); Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s })) }).toThrow()
})
it.each([true, false])("ambas API censos/economía/residencia adversos (%s)", ad => {
  const cambios = [
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[1]!.declaracion2025, { modalidad: "conjunta" }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[0]!.declaracion2025, { modalidad: "no-presenta" }) },
    (d: ReturnType<typeof datos>) => { d.censo.personas.push(d.censo.personas[1]!) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo, { censoCompleto: false }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[1]!, { residenciaAutonomica2025: undefined }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[0]!.residenciaAutonomica2025, { comunidad: "otra-comunidad-comun" }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[1]!.residenciaAutonomica2025, { desde: "2025-06-01" }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[1]!, { economia: { perfil: "capital" } }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[1]!.economia, { baseGeneral: 0 }) },
    (d: ReturnType<typeof datos>) => { Object.assign(d.censo.personas[1]!.economia, { perfil: "sin-rentas", censoRentasCompleto: false }) },
  ]
  for (const cambiar of cambios) {
    const d = datos(ad); cambiar(d)
    expect(() => { const { a, deduccionesTerritoriales2025: s } = casos(d); Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: s }, { modo: "canonico" })) }).toThrow()
    expect(() => { const { e, deduccionesTerritoriales2025: s } = casos(d); Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s })) }).toThrow()
  }
})
it.each([true, false])("discapacidad activa ajena no se acepta sin períodos (%s)", ad => {
  const d = datos(ad, 25000)
  const economia = d.censo.personas[1]!.economia
  if (!("trabajo" in economia) || economia.trabajo === undefined) throw Error("fixture sin trabajo")
  Object.assign(economia.trabajo, { discapacidadActiva: { grado: "33-a-64", ayudaOMovilidadReducida: "no", acreditadaDuranteTodoElTrabajo: "si" } })
  expect(() => { const { a, deduccionesTerritoriales2025: s } = casos(d); Effect.runSync(liquidarIrpfAnual({ ...a, deduccionesTerritoriales2025: s }, { modo: "canonico" })) }).toThrow()
  expect(() => { const { e, deduccionesTerritoriales2025: s } = casos(d); Effect.runSync(liquidarIrpfAnualExplicito({ ...e, deducciones: "territoriales-por-hechos-y-da61", deduccionesTerritoriales2025: s })) }).toThrow()
})

it.each([true, false])("ambas API ejercen cuota positiva inferior a la deducción (%s)", ad => {
  const observaciones = [15000, 16000, 17000, 18000, 19000].map(integro => deltas(datos(ad), integro))
  for (const api of [0, 1]) {
    expect(observaciones.some(importes => new Decimal(importes[api]!).gt(0) && new Decimal(importes[api]!).lt(ad ? 300 : 100))).toBe(true)
  }
})
