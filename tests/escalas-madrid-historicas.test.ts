import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { DateTime, Effect, Schema } from "effect"
import { efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import {
  obtenerEscalaAutonomicaPublicada,
  MADRID_2022,
  MADRID_2025,
} from "../lib/dominio/irpf/cuotas/escalas-publicadas"
import evidencia from "./fixtures/madrid-series-2018-2024.json"

// Esperados del oráculo documental independiente, con hash del original y página.
// La entrada conserva hechos completos: empleo sin otras rentas, SS efectiva cero.
it.each(evidencia.casos)(
  "cuota fija Madrid $ejercicio, bruto $bruto EUR",
  ({ ejercicio, bruto, cuotaEsperada, presentadaEsperada }) => {
    if (efectivo.perfil !== "solo-trabajo")
      throw new Error("El ejemplo histórico debe conservar el perfil de trabajo")
    const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...efectivo,
      ejercicio,
      devengo: `${ejercicio}-12-31`,
      deducciones: "ninguna",
      conciliacion: { ...efectivo.conciliacion, ejercicio },
      trabajo: {
        ...efectivo.trabajo,
        ejercicio,
        rendimientos: efectivo.trabajo.rendimientos.map((r) => ({
          ...r,
          integro: bruto,
          cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" },
        })),
      },
    })
    const resultado = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
    expect(new Decimal(resultado.cuotaLiquidaLegal).eq(cuotaEsperada)).toBe(true)
    expect(resultado.cuotaDiferencialPresentada).toBe(presentadaEsperada)
  }
)
it.each([2018, 2019, 2020, 2021, 2023, 2024] as const)(
  "no amplía a fallecimientos la selección nueva de %s",
  (anio) => {
    expect(
      obtenerEscalaAutonomicaPublicada({
        anio,
        comunidadAutonoma: "madrid",
        fechaFallecimiento: DateTime.toDateUtc(
          DateTime.makeUnsafe(`${anio}-06-30T00:00:00Z`)
        ),
      })
    ).toBeUndefined()
  }
)
it("conserva las selecciones vecinas y las referencias de 2025", () => {
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2017,
      comunidadAutonoma: "madrid",
    })
  ).toBeUndefined()
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2022,
      comunidadAutonoma: "madrid",
    })
  ).toBe(MADRID_2022)
  expect(
    obtenerEscalaAutonomicaPublicada({
      anio: 2025,
      comunidadAutonoma: "madrid",
    })
  ).toBe(MADRID_2025)
})
