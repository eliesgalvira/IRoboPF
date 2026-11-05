import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { casoUniformeC36, casoExplicitoC36, donativoConexionC36, viviendaConexionC36 } from "./c36-conexion-anual.fixtures"

const solicitud = donativoConexionC36("canarias_donaciones_entidades_sin_animo_lucro", "5000")

it("H1 uniforme: conserva BL fraccionaria derivada de cotizaciones estimadas", () => {
  // 30000.01*(1-0.0648)-2000 = 26056.009352, sin reducción art.20.
  // Art.4ter: 30 + (10% de BL - 150)*15% = 398.34014028.
  const caso = casoUniformeC36()
  const r = Effect.runSync(liquidarIrpfAnual({
    ...caso,
    rendimientos: { trabajo: [{ importeIntegroCentimos: 3000001 }] },
    deduccionesTerritoriales2025: { solicitudes: [solicitud] },
  }, { modo: "canonico" }))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("39834014028", "100000000"))
})

it("H1 efectiva: conserva BL fraccionaria derivada de la reducción art.20", () => {
  // Sin cotizaciones: reducción = 2364.34-1.14*(18500.01-17673.52)=1422.1414.
  // BL = 18500.01-2000-1422.1414=15077.8686.
  // Art.4ter: 30+(1507.78686-150)*15%=233.668029.
  const caso = casoExplicitoC36([solicitud])
  const r = Effect.runSync(liquidarIrpfAnualExplicito({
    ...caso,
    trabajo: { ...caso.trabajo, rendimientos: caso.trabajo.rendimientos.map(x => ({ ...x, integro: "18500.01" })) },
  }))
  expect(r.deduccionesTerritoriales2025?.total).toEqual(racional("233668029", "1000000"))
})

function traslado(derecho: "propiedad" | "arrendatario", arrendador: string) {
  const s = viviendaConexionC36("balears_arrendamiento_traslado_laboral")
  return { ...s, hechos: { ...s.hechos, viviendas: s.hechos.viviendas.map(v => ({
    ...v, derecho, uso: "habitual_propia" as const,
    gastos: v.gastos.map(p => ({ ...p, concepto: "alquiler" as const, importe: "1000" })),
    alquiler: { arrendador, arrendatario: derecho === "propiedad" ? "s-9" : "s-1", desde: "2025-01-01", hasta: "2026-01-01", fianza: "FIANZA", programa: "ordinario" as const, parientesGrado: 0, islaOrigen: "Mallorca", islaDestino: "Menorca", relacionLaboralAntes: "EMPRESA", relacionLaboralDespues: "EMPRESA" },
  })) } }
}

for (const api of ["uniforme", "efectiva"] as const) {
  const ejecutar = (s: ReturnType<typeof traslado>) => api === "uniforme"
    ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), comunidadAutonoma: "illes-balears", deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
    : Effect.runSync(liquidarIrpfAnualExplicito({ ...casoExplicitoC36([s]), comunidadAutonoma: "illes-balears" }))
  it(`H2 ${api}: arrendatario real aplica 150 sin renta inmobiliaria`, () => {
    expect(ejecutar(traslado("arrendatario", "s-8")).deduccionesTerritoriales2025?.total).toEqual(racional("150"))
  })
  it(`H2 ${api}: propietario no ocupa el lugar del arrendatario`, () => {
    expect(() => ejecutar(traslado("propiedad", "s-1"))).toThrow()
  })
  it(`H2 ${api}: sujeto no se arrienda a sí mismo`, () => {
    expect(() => ejecutar(traslado("arrendatario", "s-1"))).toThrow()
  })
}
