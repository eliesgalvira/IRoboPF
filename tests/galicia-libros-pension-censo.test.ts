import { expect, it } from "vitest"
import { Effect, Result } from "effect"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import caso from "./galicia-libros-pension-censo-caso.json"
import type { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"

// Caso independiente adaptado sólo a IDs locales y conciliación 2025: la renta de 108.000 euros entre tres miembros
// impide la deducción. Una pensión incompatible con el censo vacío no puede
// aumentar el divisor a cuatro y generar 15 euros.
for (const api of ["canon", "explicito"] as const) {
  function ejecutar(pension: "total" | "ninguna") {
    const solicitud = structuredClone(caso.solicitud)
    solicitud.hechos.miembros2024[1].pensionIncapacidad = pension
    const input = {
      ...caso.input[api],
      deduccionesTerritoriales2025: { solicitudes: [solicitud] },
    }
    return Effect.runSync(Effect.result(Effect.gen(function* () {
      if (api === "canon") return yield* liquidarIrpfAnual(
          // SAFETY: Fixture JSON deliberada; la API valida el contrato antes de calcular.
          input as Parameters<typeof liquidarIrpfAnual>[0],
          { modo: "canonico" },
        )
      // SAFETY: La API explícita valida esta entrada JSON antes de calcular.
      return yield* liquidarIrpfAnualExplicito(
          input as CasoFiscalAnualExplicito,
        )
    })))
  }

  it(api + ": pensión percibida contradice censo sin rentas ni exentas", () => {
    const resultado = ejecutar("total")
    expect(Result.isFailure(resultado)).toBe(true)
    if (Result.isFailure(resultado))
      expect(resultado.failure.motivo).toMatch(/Libros.*pensi/i)
  })

  it(api + ": el censo coherente conserva el cálculo de cero por renta", () => {
    const resultado = ejecutar("ninguna")
    expect(Result.isSuccess(resultado)).toBe(true)
    if (Result.isSuccess(resultado))
      expect(resultado.success.deduccionesTerritoriales2025?.total).toEqual(racional("0"))
  })
}
