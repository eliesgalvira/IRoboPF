import { Effect } from "effect"
import { expect, it } from "vitest"
import { hechos, ejecutar, type Solicitud } from "./balears-alquiler-revision-adaptador"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

function perfil(importe = "1000"): Solicitud {
  const s = hechos(29, importe), c = s.hechos.censoViviendaInversion
  if (c === undefined) throw new Error("fixture sin censo")
  return { ...s, hechos: { ...s.hechos, censoViviendaInversion: { ...c,
    titulos: [...c.titulos, { id: "USO", catastro: "RC-USO", documento: "ESCRITURA-USO",
      derecho: "uso", desde: "2018-01-01", hasta: "2024-12-31",
      usoGratuitoExtinguido: { titular: "s-1", constituyente: "s-9",
        constitucion: "2018-01-01", vencimiento: "2024-12-31", documentoVencimiento: "ESCRITURA-PLAZO",
        localizacion: { catastro: "RC-USO", territorio: "illes-balears", documento: "CATASTRO-USO" },
        destino: "uso_personal_sin_cesion", pagos: [] } }],
    operaciones: [{ id: "CONSTITUCION", catastro: "RC-USO", documento: "ESCRITURA-USO",
      fecha: "2018-01-01", clase: "constitucion_uso_gratuito" }],
  } } }
}
for (const api of ["uniforme", "efectiva"] as const) {
  for (const [importe, n, d] of [["1000", "200", "1"], ["3250.01", "650", "1"], ["0.01", "1", "500"]]) {
    it(`${api} T06 uso extinguido Fraction ${importe}`, () => {
      expect(ejecutar(api, [perfil(importe)]).deduccionesTerritoriales2025?.total)
        .toEqual({ numeradorEuros: n, divisor: d })
    })
  }
  for (const causa of ["historia", "titular", "constituyente", "fecha", "vigente", "catastro", "localizacion", "documento", "propiedad", "pago", "operacion", "duplicada", "omitida", "titulo-duplicado"] as const) {
    it(`${api} T06 rechazo por ${causa}`, () => {
      const s = structuredClone(perfil()), c = s.hechos.censoViviendaInversion
      if (c === undefined) throw new Error("censo")
      const t = c.titulos.find(t => t.id === "USO"), o = c.operaciones[0]
      if (t === undefined || t.usoGratuitoExtinguido === undefined || o === undefined) throw new Error("historia")
      const h = t.usoGratuitoExtinguido
      // Mutaciones de entrada reales; no sanear antes de pasar a la API.
      if (causa === "historia") Object.assign(t, { usoGratuitoExtinguido: undefined })
      if (causa === "titular") Object.assign(h, { titular: "s-8" })
      if (causa === "constituyente") Object.assign(h, { constituyente: "s-1" })
      if (causa === "fecha") Object.assign(h, { constitucion: "2018-02-30" })
      if (causa === "vigente") { Object.assign(t, { hasta: "2025-12-31" }); Object.assign(h, { vencimiento: "2025-12-31" }) }
      if (causa === "catastro") Object.assign(h.localizacion, { catastro: "RC-OTRO" })
      if (causa === "localizacion") Object.assign(h.localizacion, { documento: " " })
      if (causa === "documento") Object.assign(h, { documentoVencimiento: " " })
      if (causa === "propiedad") Object.assign(t, { derecho: "propiedad" })
      if (causa === "pago") Object.assign(h, { pagos: s.hechos.viviendas[0].gastos })
      if (causa === "operacion") Object.assign(o, { clase: "rehabilitacion" })
      if (causa === "duplicada") Object.assign(c, { operaciones: [o, { ...o, id: "OTRA-ID" }] })
      if (causa === "omitida") Object.assign(c, { operaciones: [] })
      if (causa === "titulo-duplicado") Object.assign(c, { titulos: [...c.titulos, { ...t, id: "OTRA-ID" }] })
      expect(() => ejecutar(api, [s])).toThrow()
    })
  }
  it(`${api} T06 cuota escasa sin elegir cuota externa`, () => {
    const solicitudes = [perfil()]
    if (api === "uniforme") {
      const c = casoUniformeC36()
      const r = Effect.runSync(liquidarIrpfAnual({ ...c, comunidadAutonoma: "illes-balears",
        situacionFamiliar: { ...c.situacionFamiliar, edad: 29 },
        rendimientos: { trabajo: [{ importeIntegroCentimos: 1000000 }] },
        deduccionesTerritoriales2025: { solicitudes } }, { modo: "canonico" }))
      expect(r.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: "0", divisor: "1" })
    } else {
      const c = casoExplicitoC36(solicitudes)
      const r = Effect.runSync(liquidarIrpfAnualExplicito({ ...c, comunidadAutonoma: "illes-balears", edad: 29,
        trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, integro: "10000",
          cotizaciones: { clase: "efectivas" as const, seguridadSocial: "648", derechosPasivos: "0", colegiosHuerfanos: "0" } })) } }))
      expect(r.deduccionesTerritoriales2025?.total).toEqual({ numeradorEuros: "0", divisor: "1" })
    }
  })
  it(`${api} T06 solicitud repetida rechazada`, () => {
    const s = perfil(); expect(() => ejecutar(api, [s, s])).toThrow()
  })
}
