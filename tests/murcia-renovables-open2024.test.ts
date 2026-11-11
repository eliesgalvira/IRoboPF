import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { efectivo } from "./revision-f-fixtures"
import { historia2024, renovables2024 } from "./murcia-renovables-origen2024-fixtures"
import observaciones from "./fixtures/murcia-renovables-open2024.json"

for (const modo of ["canonica", "explicita"] as const) {
  describe(`Origen Murcia2024: PDF/SES por API ${modo}`, () => {
    for (const caso of observaciones) it(caso.id, () => {
      const h = historia2024(), trabajo = h.trabajo.rendimientos[0]!, pago = h.pagos[0]!
      const solicitud = renovables2024({ ...h,
        empleo: { ...h.empleo, retencionesEUR: "0" },
        trabajo: { ...h.trabajo, rendimientos: [{ ...trabajo, integro: caso.bruto,
          cotizaciones: { ...trabajo.cotizaciones, seguridadSocial: caso.ss } }] },
        factura: { ...h.factura, importeEUR: caso.coste }, pagos: [{ ...pago, importeEUR: caso.coste }],
      })
      const publico: CasoFiscalAnual = {
        anio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "s-1",
        situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
        rendimientos: { trabajo: [{ importeIntegroCentimos: 5000000 }] }, reducciones: [], deducciones: [],
        retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0, deduccionesTerritoriales2025: { solicitudes: [solicitud] },
      }
      const c = efectivo()
      const programa = Effect.gen(function* () {
        if (modo === "canonica") return yield* liquidarIrpfAnual(publico, { modo: "canonico" })
        return yield* liquidarIrpfAnualExplicito({ ...c, deduccionesTerritoriales2025: { solicitudes: [solicitud] },
          trabajo: { ...c.trabajo, rendimientos: [{ ...c.trabajo.rendimientos[0]!, integro: "50000" }] } })
      })
      const resultado = Effect.runSync(Effect.result(programa))
      expect(resultado._tag).toBe("Success")
      if (resultado._tag === "Failure") throw new Error(JSON.stringify(resultado.failure))
      const libro = resultado.success.deduccionesTerritoriales2025
      if (libro === undefined || !("completoEnRamasSolicitadas" in libro)) throw new Error("Falta libro territorial")
      expect(libro.evaluacionesF[0]?.origenRenovablesMurcia2024).toMatchObject({
        generado: racional(caso.generado), aplicado2024: racional(caso.aplicado), saldoPorInsuficiencia2024: racional(caso.saldo),
        liquidacion: { baseGeneral: racional(caso.base), cuotaAutonomica: racional(caso.cuotaAutonomica), cuotaEstatal: racional(caso.cuotaEstatal) },
      })
    })
  })
}
