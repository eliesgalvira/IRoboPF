import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { aplicarDeduccionesTerritoriales2025 as aplicar } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { magnitudesConexionC36 as marco, donativoConexionC36 as donativo, viviendaConexionC36 as vivienda, magnitudesConFamiliaC36 as familia, nacimientoConexionC36 as nacimiento } from "./c36-conexion-anual.fixtures"
import { familiarC } from "./canarias-balears-ampliacion.fixtures"

it("art4ter: el límite de base usa toda la fracción producida por el anual", () => {
  // 20% * 150 + 15% * (10% * 20000.123456789123456789 - 150).
  const r = aplicar({ solicitudes: [donativo("canarias_donaciones_entidades_sin_animo_lucro", "5000")] }, marco())
  expect(r.total).toEqual(racional("307501851851836851851835", "1000000000000000000000"))
})

it("estudios baleares: BL fraccionaria no elimina 50% de cuota = 500", () => {
  const s = nacimiento(), m = familia(), d = m.caso.derechosMinimos
  if (d === undefined) throw new Error("Fixture familiar sin censo anual")
  const solicitud = { ...s, codigo: "balears_estudios_superiores_fuera_isla" as const, hechos: { ...s.hechos, personas: s.hechos.personas.map(p => ({ ...p, convivencia: [{ desde: "2025-01-01", hasta: "2025-12-31" }], estudio: { ...familiarC().estudio, nivel: "universidad" as const } })) } }
  const caso = { ...m.caso, derechosMinimos: { ...d, descendientes: d.descendientes.map(h => ({ ...h, fechaNacimiento: "2005-02-01", edadDevengo: 20 })) } }
  expect(aplicar({ solicitudes: [solicitud] }, { ...m, caso }).total).toEqual(racional("500"))
})

function traslado(derecho: "arrendatario" | "propiedad", arrendatario: string) {
  const s = vivienda("balears_arrendamiento_traslado_laboral")
  return { ...s, hechos: { ...s.hechos, viviendas: s.hechos.viviendas.map(v => ({ ...v, derecho, uso: "habitual_propia" as const, gastos: v.gastos.map(p => ({ ...p, concepto: "alquiler" as const, importe: "1000" })), alquiler: { arrendador: derecho === "propiedad" ? "s-1" : "s-8", arrendatario, desde: "2025-01-01", hasta: "2026-01-01", fianza: "FIANZA", programa: "ordinario" as const, parientesGrado: 0, islaOrigen: "Mallorca", islaDestino: "Menorca", relacionLaboralAntes: "EMPRESA", relacionLaboralDespues: "EMPRESA" } })) } }
}
it("traslado: el arrendatario real conserva 15% sin capital inmobiliario", () => {
  const s = traslado("arrendatario", "s-1")
  expect(aplicar({ solicitudes: [s] }, marco("illes-balears")).total).toEqual(racional("150"))
})
it("traslado: propietario no sustituye al arrendatario ajeno por una etiqueta", () => {
  expect(() => aplicar({ solicitudes: [traslado("propiedad", "s-9")] }, marco("illes-balears"))).toThrow()
})
it("grupo15% efectivo con céntimos impares: 100.0005 de presupuesto", () => {
  const r = aplicar({ solicitudes: [vivienda("canarias_restauracion_bienes_interes_cultural", "1"), vivienda("canarias_rehabilitacion_energetica_vivienda", "2")] }, { ...marco(), cuotaAutonomica: new Decimal("666.67") })
  expect(r.total).toEqual(racional("200001", "2000"))
})
it("nacimiento: insuficiencia de cuota no promete 800 de abono", () => {
  expect(aplicar({ solicitudes: [nacimiento()] }, { ...familia(), cuotaAutonomica: new Decimal("123.45") }).total).toEqual(racional("2469", "20"))
})

it("grupo15%: el decimal80 de cuota también limita el importe efectivo", () => {
  const r = aplicar({ solicitudes: [vivienda("canarias_restauracion_bienes_interes_cultural", "1"), vivienda("canarias_rehabilitacion_energetica_vivienda", "2")] }, { ...marco(), cuotaAutonomica: new Decimal("1." + "0".repeat(79) + "1") })
  expect(r.total).toEqual(racional((15n * (10n ** 80n + 1n)).toString(), (100n * 10n ** 80n).toString()))
})
it("pago común al50% aporta exactamente50 de deducción ecológica", () => {
  const s = donativo()
  const r = aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, donaciones: s.hechos.donaciones.map(d => ({ ...d, pagos: d.pagos.map(p => ({ ...p, naturaleza: "comun" as const, distribucion: [{ persona: "s-1", porcentaje: "50" }, { persona: "s-9", porcentaje: "50" }] })) })) } }] }, marco())
  expect(r.total).toEqual(racional("50"))
})
it("historia: no admite el mismo recibo con ID nuevo para fabricar reiteración", () => {
  const s = donativo("canarias_donaciones_entidades_sin_animo_lucro")
  const h = { id: "H1", factura: "RECIBO2023", entidad: "ENT", fecha: "2023-01-01", importe: "100" }
  expect(() => aplicar({ solicitudes: [{ ...s, hechos: { ...s.hechos, historiaDonativos: [h, { ...h, id: "H2" }] } }] }, marco())).toThrow(/reutilizado/)
})
