import { describe, expect, it } from "vitest"
import { Effect } from "effect"
import Decimal from "decimal.js"
import { casosAuditoria as casos } from "./p7-madrid-auditoria.casos"
import { efectivo } from "./revision-f-fixtures"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { aplicarDeduccionesTerritoriales2025 as aplicar, type MagnitudesTerritorialesAnuales } from "../lib/dominio/irpf/deducciones/anual-territorial"
import type { SolicitudAnualF2025 as Solicitud } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-esquemas"
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

describe("Primera auditoría monetaria posterior al autor P7", () => {
  for (const c of casos) {
    it(c.nombre + " mensualidades y cuota exactas", () => {
      const r = evaluar(c.solicitud)
      expect(r.evaluacionesF[0]?.estado).toBe("calculo_parcial")
      expect(r.total).toEqual(c.esperado)
      for (let mes=1;mes<=12;mes++) expect(r.evaluacionesF[0]?.rastro).toContain(`2025-${String(mes).padStart(2,"0")}-15: intereses céntimos real=${c.real[mes-1]}; contrafactual=${c.contra[mes-1]}`)
    })
    it(c.nombre + " dos API sin cambiar oráculos", () => {
      const canonico = Effect.runSync(liquidarIrpfAnual({
        ...magnitudes().caso, rendimientos: { trabajo: [{ importeIntegroCentimos: 3000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
        deduccionesTerritoriales2025: { solicitudes: [c.solicitud] },
      }, { modo: "canonico" }))
      const explicito = Effect.runSync(liquidarIrpfAnualExplicito({ ...efectivo(), comunidadAutonoma: "madrid", deduccionesTerritoriales2025: { solicitudes: [c.solicitud] } }))
      expect(canonico.deduccionesTerritoriales2025?.total).toEqual(c.esperado)
      expect(explicito.deduccionesTerritoriales2025?.total).toEqual(c.esperado)
    })
  }
  for (const cambio of ["referencia", "cuota", "recibo_repetido", "precision7", "TIN_negativo"]) it("auditoría adversa " + cambio, () => {
    const s=primera(), p=s.hechos.prestamos?.[0], h=p?.contratoMadrid
    if (h === undefined) throw new RangeError("Contrato ausente")
    const contrato = { ...h }
    if (cambio === "cuota") contrato.recibos=h.recibos.map((r,i) => i===0 ? {...r,cuotaSatisfechaEUR:"1"} : r)
    if (cambio === "recibo_repetido") contrato.recibos=h.recibos.map((r,i) => i===1 ? {...r,mes:1} : r)
    contrato.revisiones=h.revisiones.map((r,i) => {
      if (i!==0) return r
      const revision = { ...r }
      if (cambio === "referencia") revision.mesIndice="2024-01"
      if (cambio === "precision7") revision.euriborPorcentaje="4.5000001"
      if (cambio === "TIN_negativo") revision.euriborPorcentaje="-1"
      return revision
    })
    expect(evaluar({...s,hechos:{...s.hechos,prestamos:[{...p,contratoMadrid:contrato}]}}).evaluacionesF[0]?.estado).toBe("no_soportado")
  })
})
