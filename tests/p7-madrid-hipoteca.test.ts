import { describe, expect, it } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import { casos } from "./p7-madrid-fixtures"
import { efectivo } from "./revision-f-fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
const magnitudes = (cuota = "10000", base = "20000"): MagnitudesTerritorialesAnuales => ({
  caso: { anio: 2025, comunidadAutonoma: "madrid", contribuyenteId: "s-1", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] } },
  baseGeneral: new Decimal(base), baseAhorro: new Decimal(0), minimoPersonalFamiliar: new Decimal(5550), cuotaAutonomica: new Decimal(cuota), sujetosConMinimo: [],
  basesLiquidables: { general: new Decimal(base), ahorro: new Decimal(0) },
})
function primera(): Solicitud {
  const caso = casos[0]
  if (caso === undefined) throw new RangeError("Fixture ausente")
  return structuredClone(caso.solicitud)
}
const evaluar = (s: Solicitud, cuota = "10000", base = "20000") => aplicar({ solicitudes: [s] }, magnitudes(cuota, base))

describe("P7 Madrid2025 contrato, calendario y cuota común", () => {
  for (const c of casos) {
    it(c.nombre + " oráculo racional independiente", () => {
      const resultado = evaluar(c.solicitud)
      expect(resultado.evaluacionesF[0]?.estado).toBe("calculo_parcial")
      expect(resultado.total).toEqual(c.esperado)
    })
    it(c.nombre + " ambas API públicas", () => {
      const canonico = Effect.runSync(liquidarIrpfAnual({
        ...magnitudes().caso, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
        deduccionesTerritoriales2025: { solicitudes: [c.solicitud] },
      }, { modo: "canonico" }))
      const explicito = Effect.runSync(liquidarIrpfAnualExplicito({ ...efectivo(), comunidadAutonoma: "madrid", deduccionesTerritoriales2025: { solicitudes: [c.solicitud] } }))
      expect(canonico.deduccionesTerritoriales2025?.total).toEqual(c.esperado)
      expect(explicito.deduccionesTerritoriales2025?.total).toEqual(c.esperado)
    })
  }
  it("cuota autonómica insuficiente consume sólo disponible", () => expect(evaluar(primera(), "10.001").total).toEqual(racional("10.001")))
  it("cuota cero", () => expect(evaluar(primera(), "0").total).toEqual(racional("0")))
  it("precio390000 y renta30930 incluidos", () => expect(evaluar(primera(), "10000", "30930").total).toEqual(racional("35.96")))
  it("renta30930.01 excluida", () => expect(evaluar(primera(), "10000", "30930.01").total).toEqual(racional("0")))
  it("precio390000.01 excluido", () => {
    const s=primera(); const v=s.hechos.viviendas?.[0]
    expect(evaluar({...s,hechos:{...s.hechos,viviendas:[{...v,precioEUR:"390000.01"}]}}).total).toEqual(racional("0"))
  })
  for (const campo of ["diferenciaInteresesEUR", "baseFiscalEUR", "importeDeduccionEUR"]) it("rechaza " + campo, () => {
    const s=primera()
    expect(() => evaluar({...s,hechos:{...s.hechos,[campo]:"1000"}})).toThrow("Hechos territoriales inválidos o magnitudes anuales externas")
  })
  for (const incidencia of ["novacion", "amortizacion_extraordinaria", "mixto", "mora"]) it("delimita " + incidencia, () => {
    const s=primera(); const p=s.hechos.prestamos?.[0];const h=p?.contratoMadrid
    if (h === undefined) throw new RangeError("Contrato ausente")
    expect(evaluar({...s,hechos:{...s.hechos,prestamos:[{...p,contratoMadrid:{...h,incidencias2025:[incidencia]}}]}}).evaluacionesF[0]?.estado).toBe("no_soportado")
  })
  for (const modo of ["duplicado", "interes_inventado", "mes_ausente", "otro_pagador"]) it("rechaza recibo " + modo, () => {
    const s=primera(); const pagos=s.hechos.pagos ?? []
    const alterados = modo === "mes_ausente" ? pagos.slice(1) : pagos.map((p,i) => i !== 1 ? p : {...p, ...(modo === "duplicado" ? {fecha:"2025-01-15"} : modo === "otro_pagador" ? {pagador:"otro"} : {importeEUR:"9999"})})
    expect(evaluar({...s,hechos:{...s.hechos,pagos:alterados}}).evaluacionesF[0]?.estado).toBe("no_soportado")
  })
})
