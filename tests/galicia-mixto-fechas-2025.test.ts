import { Effect, Result } from "effect"
import { expect, it } from "vitest"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { galiciaMixto } from "./galicia-mixto-2025.fixtures"

const contrato = (c: ReturnType<typeof galiciaMixto>) => {
  const solicitud = c.deduccionesTerritoriales2025.solicitudes[0]
  if (
    solicitud?.lote !== "E38" ||
    solicitud.hechos.codigo !== "galicia_alquiler_vivienda_habitual"
  )
    throw new Error("Fixture sin alquiler gallego")
  const alquiler = solicitud.hechos.contratos[0]
  if (alquiler === undefined) throw new Error("Fixture sin contrato")
  return alquiler
}

for (const api of ["canonica", "explicita"] as const) {
  const ejecutar = (c: ReturnType<typeof galiciaMixto>) =>
    api === "canonica"
      ? liquidarIrpfAnual(c, { modo: "canonico" })
      : liquidarIrpfAnualExplicito(c)

  for (const justificante of ["fianzaIGVS", "denunciaFianza"] as const) {
    for (const fecha of ["2026-07-01", "2030-01-01"]) {
      it(`${api}: rechaza ${justificante} fuera del plazo ordinario ${fecha}`, () => {
        const c = galiciaMixto()
        Object.assign(contrato(c), {
          fianzaIGVS: null,
          denunciaFianza: null,
          [justificante]: { referencia: "JUSTIFICANTE", fecha, emisor: "IGVS" },
        })
        const r = Effect.runSync(Effect.result(ejecutar(c)))
        expect(Result.isFailure(r)).toBe(true)
        if (Result.isFailure(r))
          expect(r.failure).toMatchObject({ codigo: "renta-mixta" })
      })
    }
    for (const fecha of ["2026-01-01", "2026-06-29", "2026-06-30"]) {
      it(`${api}: admite ${justificante} válido en 2026 ${fecha}`, () => {
        const c = galiciaMixto()
        Object.assign(contrato(c), {
          fianzaIGVS: null,
          denunciaFianza: null,
          [justificante]: { referencia: "JUSTIFICANTE", fecha, emisor: "IGVS" },
        })
        const r = Effect.runSync(ejecutar(c))
        expect(r.composicion.deduccionesAutonomicasAplicadas.toFixed()).toBe(
          "300"
        )
      })
    }
  }

  for (const fecha of ["2025-01-02", "2030-01-01"]) {
    it(`${api}: rechaza contrato posterior a la ocupación ${fecha}`, () => {
      const c = galiciaMixto()
      Object.assign(contrato(c), { fecha })
      expect(Result.isFailure(Effect.runSync(Effect.result(ejecutar(c))))).toBe(
        true
      )
    })
  }
  it(`${api}: rechaza pago anterior al título representado`, () => {
    const c = galiciaMixto()
    const x = contrato(c)
    Object.assign(x, { fecha: "2025-01-01" })
    const pago = x.pagos[0]
    if (pago === undefined) throw new Error("Fixture sin pago")
    Object.assign(pago, { fecha: "2024-12-31" })
    expect(Result.isFailure(Effect.runSync(Effect.result(ejecutar(c))))).toBe(
      true
    )
  })
  it(`${api}: admite contrato y ocupación del mismo día`, () => {
    const c = galiciaMixto()
    Object.assign(contrato(c), { fecha: "2025-01-01" })
    expect(
      Effect.runSync(
        ejecutar(c)
      ).composicion.deduccionesAutonomicasAplicadas.toFixed()
    ).toBe("300")
  })
  it(`${api}: conserva cero fiscal cuando faltan ambos justificantes`, () => {
    const c = galiciaMixto()
    Object.assign(contrato(c), { fianzaIGVS: null, denunciaFianza: null })
    expect(
      Effect.runSync(
        ejecutar(c)
      ).composicion.deduccionesAutonomicasAplicadas.toFixed()
    ).toBe("0")
  })
}
