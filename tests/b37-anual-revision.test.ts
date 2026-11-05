import { describe, expect, it } from "vitest"
import { aplicarDeduccionesTerritoriales2025 as aplicar } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { producirNodosFiscalesB2025 as producir } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { marcoPropioB, alquilerB, autonomoB, trasladoRuralB, obrasB, decimalB } from "./b-conexion-completa-fixtures"
import { traslado, doc, vivienda, pago } from "./asturias-cantabria-ampliacion-fixtures"
import { marco, solicitudCelia, solicitudAdopcion } from "./b-ampliado-anual-fixtures"

describe("Adversas independientes de conexión B37", () => {
  it.each([
    ["3", "1", "33.33"], ["10000", "999.999999", "9.99"],
    ["100", "0.009999999", "0.00"], ["100", "0.01", "0.01"],
    ["1", "0", "0.00"], ["0." + "0".repeat(79) + "1", "0." + "0".repeat(79) + "1", "100.00"],
  ])("tipo exacto base %s cuota %s", (base, cuota, esperado) => {
    const n = producir("A", decimalB(base), decimalB(cuota), decimalB(cuota))
    expect(n.tiposMediosGenerales?.estatal).toBe(esperado)
    expect(n.tiposMediosGenerales?.autonomico).toBe(esperado)
    expect(n.cuotaTrabajoActividad).toBeUndefined()
  })
  it.each(["0", "-0.0001"])("base no positiva %s no fabrica tipos", b => {
    expect(producir("A", decimalB(b), decimalB("0"), decimalB("0")).tiposMediosGenerales).toBeUndefined()
  })
  it.each([false, true])("prioridad y correspondencia con orden invertido=%s", invertir => {
    const residente = { lote: "B-ampliado" as const, hechos: { codigo: "cantabria_desplazamiento_permanencia_nuevos_residentes" as const, personas: [traslado("cantabria")] } }
    const solicitudes = invertir ? [residente, obrasB()] : [obrasB(), residente]
    const r = aplicar({ solicitudes }, { ...marcoPropioB("cantabria"), cuotaAutonomica: decimalB("10.01") })
    expect(r.total).toEqual(racional("10.01"))
    expect(r.disponible).toEqual(racional("0"))
    for (let i = 0; i < r.codigos.length; i++) {
      expect(r.aplicaciones[i].aplicado).toEqual(racional(r.codigos[i] === residente.hechos.codigo ? "10.01" : "0"))
    }
  })
  it("cuota fraccionaria se agota una vez entre dos generaciones", () => {
    const r = aplicar({ solicitudes: [alquilerB, autonomoB] }, { ...marcoPropioB(), cuotaAutonomica: decimalB("0." + "3".repeat(80)) })
    expect(r.total).toEqual(racional("0." + "3".repeat(80)))
    expect(r.disponible).toEqual(racional("0"))
    expect(r.aplicaciones[0].generado).toEqual(racional("1500"))
  })
  it.each(["baseGeneral", "cuotaAutonomica", "nodosFiscalesB2025", "tiposMediosGenerales", "usos"])("inyección anidada %s rechazada", campo => {
    const s = { ...alquilerB, hechos: { ...alquilerB.hechos, [campo]: "999999" } }
    expect(() => aplicar({ solicitudes: [s] }, marcoPropioB())).toThrow(/inválidos|externas/)
  })
  it("no acepta magnitud calculada en un pago", () => {
    if (alquilerB.hechos.codigo !== "asturias_arrendamiento_vivienda_habitual") throw new Error("Fixture no arrendamiento")
    const s = { ...alquilerB, hechos: { ...alquilerB.hechos, personas: alquilerB.hechos.personas.map(p => ({ ...p, pagos: p.pagos.map(g => ({ ...g, cuotaTrabajoActividad: "500" })) })) } }
    expect(() => aplicar({ solicitudes: [s] }, marcoPropioB())).toThrow(/inválidos|externas/)
  })
  it("documento repetido con ID nuevo entre códigos se rechaza", () => {
    if (alquilerB.hechos.codigo !== "asturias_arrendamiento_vivienda_habitual") throw new Error("Fixture no arrendamiento")
    const p = alquilerB.hechos.personas[0].pagos[0]
    const otro = { lote: "B" as const, hechos: { codigo: "asturias_gastos_vitales_hasta_35" as const, nacimiento: "1980-01-01", gastos: [{ ...p, id: "id-nuevo", concepto: "cultura" as const }] } }
    expect(() => aplicar({ solicitudes: [alquilerB, otro] }, marcoPropioB())).toThrow(/Documento monetario/)
  })
  it("base general sin atribución exclusiva rechaza traslado rural sin importe", () => {
    const m = marcoPropioB("cantabria")
    const n = producir("A", decimalB("20000"), decimalB("10000"), decimalB("10000"))
    expect(() => aplicar({ solicitudes: [trasladoRuralB()] }, { ...m, nodosFiscalesB2025: n })).toThrow(/base general mixta/)
  })
  it("ELA sigue rechazando aun con tipos y cuota producidos", () => {
    const n = producir("A", decimalB("1"), decimalB("1"), decimalB("1"), "solo-trabajo")
    const s = { lote: "B-ampliado" as const, hechos: { codigo: "asturias_ayudas_ela" as const, ayudas: [] } }
    expect(() => aplicar({ solicitudes: [s] }, { ...marcoPropioB(), nodosFiscalesB2025: n })).toThrow(/ayudaELAIntegrada2025/)
  })
  it("bases estatales no representadas no se suponen cero", () => {
    const s = { lote: "B-ampliado" as const, hechos: { codigo: "cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad" as const, donaciones: [] } }
    expect(() => aplicar({ solicitudes: [s] }, marcoPropioB("cantabria"))).toThrow(/68.3\/68.5/)
  })
  it.each(["34999." + "9".repeat(80), "35000", "35000." + "0".repeat(79) + "1"])("umbral 80 decimales %s", base => {
    const r = aplicar({ solicitudes: [solicitudCelia()] }, { ...marco("asturias", ["s-1", "s-3", "s-4"]), baseGeneral: decimalB(base) })
    expect(r.aplicaciones[0].generado).toEqual(base.startsWith("35000.") ? racional("0") : racional("100", "3"))
  })
})

describe("Productores familiares y domésticos", () => {
  it.each(["45000", "45000." + "0".repeat(79) + "1"])("renta monoparental anual sin cambio %s", renta => {
    const m = marco("asturias", ["s-1"]), derechos = m.caso.derechosMinimos
    if (derechos === undefined) throw new Error("Fixture derechos ausentes")
    const a = solicitudAdopcion(["s-1"])
    if (a.hechos.codigo !== "asturias_adopcion_internacional") throw new Error("Fixture adopción ausente")
    const solicitud = { lote: "B-ampliado" as const, hechos: { codigo: "asturias_familias_monoparentales" as const, familia: { convivientes: [{ clase: "descendiente" as const, custodia: "exclusiva" as const, persona: a.hechos.adopciones[0].hijo }], exhaustividad: "completa" as const, alimentosExentos: "0", cambioSituacion: null } } }
    const resultado = aplicar({ solicitudes: [solicitud] }, { ...m, rentaNoExentaAntesReduccionesB: decimalB(renta), caso: { ...m.caso, derechosMinimos: { ...derechos, descendientes: derechos.descendientes.map(d => ({ ...d, titulares: d.titulares.map(t => t.titularId === "s-1" ? { ...t, custodia: "exclusiva" as const } : t) })) } } })
    expect(resultado.aplicaciones[0].generado).toEqual(racional(renta === "45000" ? "500" : "0"))
  })
  it("cambio de período no toma renta anual aunque sea baja", () => {
    const s = { lote: "B-ampliado" as const, hechos: { codigo: "asturias_familias_monoparentales" as const, familia: { convivientes: [], exhaustividad: "completa" as const, alimentosExentos: "0", cambioSituacion: "2025-01-01" } } }
    expect(() => aplicar({ solicitudes: [s] }, { ...marcoPropioB(), rentaNoExentaAntesReduccionesB: decimalB("1") })).toThrow(/renta computable del período/)
  })
  it.each(["-1", "0", "1"])("ayuda doméstica mayor75 deriva actividad %s, sin renta positiva obligatoria", neto => {
    const s = { lote: "B-ampliado" as const, hechos: { codigo: "cantabria_ayuda_domestica" as const, empleado: "empleado", altaCantabria: doc, vivienda: vivienda("39003"), empleadores: [{ id: "A", nacimiento: "1950-01-01", altaTGSS: doc }], vinculo: "monoparental" as const, registroPareja: null, hijos: [], cotizaciones: [pago("500")] } }
    const n = producir("A", decimalB("0"), decimalB("0"), decimalB("0"), "solo-actividad")
    const r = aplicar({ solicitudes: [s] }, { ...marcoPropioB("cantabria", 75), rentaActividadAnualB: decimalB(neto), nodosFiscalesB2025: n })
    expect(r.aplicaciones[0].generado).toEqual(racional("100"))
  })
})
