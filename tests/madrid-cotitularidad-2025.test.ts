import Decimal from "decimal.js"
import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { aplicarDeduccionesTerritoriales2025 as aplicar } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { SolicitudAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { censo, familia, magnitudes, solicitud } from "./madrid-vivienda-historia.fixtures"

const D = Decimal.clone({ precision: 80 })
const nacimiento = "madrid_vivienda_nacimiento_adopcion_hijos"
type Api = "canonico" | "explicito"
type Titular = "s-1" | "s-2"

function compartida(porcentaje = "50", precio = "100000", propio: Titular = "s-1"): SolicitudAnualF2025 {
  const s = solicitud(nacimiento)
  const porcentajes = [porcentaje, new D(100).minus(porcentaje).toFixed()]
  const titulares = [propio, propio === "s-1" ? "s-2" : "s-1"]
  return {
    ...s,
    hechos: { ...s.hechos, viviendas: [{ ...s.hechos.viviendas![0]!, precioEUR: precio, titulares, porcentajePropiedad: porcentaje }] },
    adquisicionCompartidaMadrid2025: {
      ejercicio: 2025, contribuyente: propio, viviendaId: "v", adquisicion: "2025-01-01",
      modalidad: "compraventa-terminada", escritura: "escritura-sintetica", regimen: "separacion-bienes",
      soporteRegimen: "capitulaciones-sinteticas", regimenDesde: "2020-01-01", regimenHasta: "2025-12-31",
      titularesCompletos: true, titularidadHasta: "2025-12-31",
      titulares: titulares.map((id, i) => ({ id, porcentaje: porcentajes[i]!,
        precioAdquiridoEUR: new D(precio).times(porcentajes[i]!).div(100).toFixed(),
        gastosAtribuidosEUR: new D(2000).times(porcentajes[i]!).div(100).toFixed(),
        tributosAtribuidosEUR: new D(8000).times(porcentajes[i]!).div(100).toFixed(),
        soporte: "escritura-facturas-" + id,
      })),
    },
  }
}

function ejecutar<T>(api: Api, entrada: T, propio: Titular = "s-1") {
  const base = censo()
  const basesFamiliares2025 = { ...base, contribuyente: propio, conyuge: propio === "s-1" ? "s-2" : "s-1",
    personas: base.personas.map(p => ({ ...p, economia: p.id === propio
      ? { perfil: "declarante-en-composicion" as const }
      : p.id === "s-3" ? { perfil: "sin-rentas" as const, censoRentasCompleto: true as const }
      : { perfil: "solo-trabajo" as const, censoRentasCompleto: true as const, otrasRentas: "ninguna" as const,
        reduccionesBase: "ninguna" as const, saldosAnteriores: "ninguno" as const, trabajo: efectivo.trabajo } })),
  }
  const derechosMinimos = { ...familia(), contribuyenteId: propio }
  // SAFETY: las adversas atraviesan el Schema público sin sanitizar ni convertir en positivos.
  const deduccionesTerritoriales2025 = { solicitudes: [entrada as never] }
  const comunes = { contribuyenteId: propio, derechosMinimos, basesFamiliares2025, deduccionesTerritoriales2025 }
  return api === "canonico"
    ? Effect.runSync(Effect.result(liquidarIrpfAnual({ ...analitico, ...comunes }, { modo: "canonico" })))
    : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...efectivo, ...comunes, familiaresConDerechoMinimo: "segun-derechos", deducciones: "territoriales-por-hechos-y-da61" })))
}

const adversas = [
  ["sin escritura compartida", (s: SolicitudAnualF2025) => { const { adquisicionCompartidaMadrid2025: _a, ...resto } = s; return resto }],
  ["otro contribuyente", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, contribuyente: "s-99" } })],
  ["otro inmueble", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, viviendaId: "otra" } })],
  ["fecha de escritura contradictoria", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, adquisicion: "2025-01-02" } })],
  ["régimen posterior a compra", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, regimenDesde: "2025-01-02" } })],
  ["gananciales fuera del contrato", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, regimen: "gananciales" } })],
  ["censo incompleto", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titularesCompletos: false } })],
  ["sin soporte", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, escritura: " " } })],
  ["porcentaje propio contradictorio", (s: SolicitudAnualF2025) => ({ ...s, hechos: { ...s.hechos, viviendas: [{ ...s.hechos.viviendas![0], porcentajePropiedad: "75" }] } })],
  ["titular duplicado", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titulares: [s.adquisicionCompartidaMadrid2025!.titulares[0], s.adquisicionCompartidaMadrid2025!.titulares[0]] } })],
  ["vivienda con titular duplicado", (s: SolicitudAnualF2025) => ({ ...s, hechos: { ...s.hechos, viviendas: [{ ...s.hechos.viviendas![0], titulares: ["s-1", "s-1"] }] } })],
  ["tercero ajeno al cónyuge", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titulares: s.adquisicionCompartidaMadrid2025!.titulares.map(t => t.id === "s-2" ? { ...t, id: "s-99" } : t) } })],
  ["reparto menor de 100", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titulares: s.adquisicionCompartidaMadrid2025!.titulares.map(t => t.id === "s-2" ? { ...t, porcentaje: "25", precioAdquiridoEUR: "25000", gastosAtribuidosEUR: "500", tributosAtribuidosEUR: "2000" } : t) } })],
  ["coste asignado excesivo", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titulares: s.adquisicionCompartidaMadrid2025!.titulares.map(t => ({ ...t, precioAdquiridoEUR: "50000.01" })) } })],
  ["gasto ajeno al título", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titulares: s.adquisicionCompartidaMadrid2025!.titulares.map(t => ({ ...t, gastosAtribuidosEUR: "1000.01" })) } })],
  ["tributo duplicado", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, titulares: s.adquisicionCompartidaMadrid2025!.titulares.map(t => ({ ...t, tributosAtribuidosEUR: "8000" })) } })],
  ["base fiscal externa", (s: SolicitudAnualF2025) => ({ ...s, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, baseDeduccionEUR: "55000" } })],
  ["compra histórica compartida", (s: SolicitudAnualF2025) => ({ ...s, hechos: { ...s.hechos, viviendas: [{ ...s.hechos.viviendas![0], adquisicion: "2024-01-01", ocupacionDesde: "2024-02-01" }] }, adquisicionCompartidaMadrid2025: { ...s.adquisicionCompartidaMadrid2025, adquisicion: "2024-01-01" } })],
  ["venta contradictoria", (s: SolicitudAnualF2025) => ({ ...s, hechos: { ...s.hechos, viviendas: [{ ...s.hechos.viviendas![0], transmision: "2025-05-01" }] } })],
  ["contrato sobre otra deducción", (s: SolicitudAnualF2025) => ({ ...s, codigo: "madrid_incremento_costes_financiacion_vivienda" })],
  ["porcentaje cero", () => compartida("0")],
  ["propietario único disfrazado", () => compartida("100")],
] as const

for (const api of ["canonico", "explicito"] as const) describe(api + ": compra compartida de Madrid", () => {
  it.each([["25", "275"], ["50", "550"], ["75", "825"]])("porcentaje %s, sin prorratear dos veces", (porcentaje, esperado) => {
    for (const propio of ["s-1", "s-2"] as const) {
      const r = ejecutar(api, compartida(porcentaje, "100000", propio), propio)
      expect(r._tag).toBe("Success")
      if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional(esperado))
    }
  })
  it("el tope de 1546,50 no se divide entre copropietarios", () => {
    const r = ejecutar(api, compartida("50", "400000"))
    expect(r._tag).toBe("Success")
    if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("1546.50"))
  })
  it("orden de titulares irrelevante", () => {
    const s = compartida(), a = s.adquisicionCompartidaMadrid2025!
    const r = ejecutar(api, { ...s, adquisicionCompartidaMadrid2025: { ...a, titulares: [...a.titulares].reverse() } })
    expect(r._tag).toBe("Success")
    if (r._tag === "Success") expect(r.success.deduccionesTerritoriales2025?.total).toEqual(racional("550"))
  })
  for (const [nombre, transformar] of adversas) it(nombre, () => {
    const r = ejecutar(api, transformar(compartida()))
    expect(r._tag).toBe("Failure")
    if (r._tag === "Failure") expect(r.failure._tag).toBe("ResultadoNoSoportado")
  })
  it("conserva incompatibilidad art13/depoblación en la misma vivienda", () => {
    const s = compartida()
    const r = ejecutar(api, { ...s, hechos: { ...s.hechos, elecciones: [{ codigo: "madrid_vivienda_municipios_despoblacion", objetoId: "v" }] } })
    expect(r._tag).toBe("Failure")
  })
})

it.each(["0", "10.001", "549.999"])("una reserva de cuota residual %s sin presentación anticipada", cuota => {
  expect(aplicar({ solicitudes: [compartida()] }, magnitudes("20000", cuota)).total).toEqual(racional(cuota))
})
it.each(["66734", "66734.00000000000000000001"])("frontera familiar con cotitularidad: %s", base => {
  const r = aplicar({ solicitudes: [compartida()] }, magnitudes(base))
  expect(r.total).toEqual(racional(base === "66734" ? "550" : "0"))
})
