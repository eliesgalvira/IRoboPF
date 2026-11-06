import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { evaluarAmpliacionLoteA2025 } from "../lib/dominio/irpf/deducciones/lote-a-ampliacion-2025"
import { evaluarAmpliacionAnualA2025 } from "../lib/dominio/irpf/deducciones/ampliacion-a-anual"
import { analitico } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
const contexto = { ejercicio: 2025, modalidad: "individual", devengo: "2025-12-31", territorio: "andalucia", contribuyente: "s-1", nacimiento: "1985-01-01",
  imponibleGeneralCentimos: { euros: "22000" }, imponibleAhorroCentimos: 0, liquidableGeneralCentimos: { euros: "22000" }, liquidableAhorroCentimos: 0,
  minimoContribuyenteCentimos: 555000, minimoDescendientesCentimos: 0, minimoPersonalFamiliarCentimos: 555000 } as const
const adopcion = { persona: "s-3", inscripcionCivil: "2025-05-01", normaConvenio: "La-Haya", asiento: "RC", titulares: [{ id: "s-1", imponibleTotalCentimos: { euros: "22000" } }] }
it("art12 incompatibilidad sólo por los mismos hijos", () => {
  const s = { ...contexto, codigo: "andalucia_adopcion_internacional", hechos: { adopciones: [adopcion] } } as const
  expect(evaluarAmpliacionLoteA2025({ ...s, elecciones: [{ codigo: "andalucia_nacimiento_adopcion_acogimiento_menores", objeto: "s-3" }] }).estado).toBe("no_soportado")
  const r = evaluarAmpliacionLoteA2025({ ...s, elecciones: [{ codigo: "andalucia_nacimiento_adopcion_acogimiento_menores", objeto: "s-4" }] })
  expect(r.estado).toBe("calculo_parcial")
  if (r.estado !== "calculo_parcial") throw Error(r.motivo)
  expect(r.importeExactoEuros).toBe("600")
})
it("art14 incompatibilidad total art11 aunque el hijo sea otro", () => {
  const r = evaluarAmpliacionLoteA2025({ ...contexto, codigo: "andalucia_familia_numerosa", hechos: { familia: { categoria: "general", desde: "2024-01-01", hasta: "2026-01-01", referencia: "titulo", titulares: ["s-1"] }, posicion: "ascendiente", rentasTitulares: adopcion.titulares }, elecciones: [{ codigo: "andalucia_nacimiento_adopcion_acogimiento_menores", objeto: "s-4" }] })
  expect(r.estado).toBe("no_soportado")
})
it.each(["25000", "25000.01"])("art14 usa imponibles %s aunque liquidables sean cero", base => {
  const s = { lote: "A40", codigo: "andalucia_familia_numerosa", nacimiento: "1985-01-01", hechos: { familia: { categoria: "general", desde: "2024-01-01", hasta: "2026-01-01", referencia: "titulo", titulares: ["s-1"] }, posicion: "ascendiente" } } as const
  const r = evaluarAmpliacionAnualA2025(s, { caso: { anio: 2025, comunidadAutonoma: "andalucia", contribuyenteId: "s-1", situacionFamiliar: analitico.situacionFamiliar },
    basesImponiblesE38: { general: new Decimal(base), ahorro: new Decimal(0) }, baseGeneral: new Decimal(0), baseAhorro: new Decimal(0), basesLiquidables: { general: new Decimal(0), ahorro: new Decimal(0) }, componentesMinimoEstatal: { contribuyente: new Decimal(5550), descendientes: new Decimal(0) }, minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(0), sujetosConMinimo: [] }, [s])
  expect(r.estado).toBe(base === "25000" ? "calculo_parcial" : "no_soportado")
})
