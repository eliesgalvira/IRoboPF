import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import fixture from "../docs/procedencia/simuladores/historico/piloto-oficial.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

describe("Open histórico: originales de siete pilotos anuales", () => {
  for (const caso of fixture.cases) {
    it(`${caso.year}: conserva todas las casillas presentes con mapeo acreditado`, () => {
      const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(caso.input)
      const salida = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
      const escalares = {
        rendimientoNetoReducido: salida.rendimientoNetoReducido,
        baseLiquidableGeneral: salida.baseLiquidableGeneral,
        cuotaPosterior: salida.cuotaPosterior,
        cuotaDiferencial: salida.cuotaDiferencial,
        cuotaDiferencialPresentada: salida.cuotaDiferencialPresentada,
        gravamenEstatal: salida.componentesCuota.gravamenEstatal,
        gravamenAutonomico: salida.componentesCuota.gravamenAutonomico,
        gravamenMinimoEstatal: salida.componentesCuota.gravamenMinimoEstatal,
        gravamenMinimoAutonomico: salida.componentesCuota.gravamenMinimoAutonomico,
        cuotaEstatal: salida.componentesCuota.cuotaEstatal,
        cuotaAutonomica: salida.componentesCuota.cuotaAutonomica,
      }
      expect(salida.ejercicio).toBe(caso.year)
      expect(caso.expected).toHaveLength(caso.year === 2024 ? 11 : 12)
      for (const casilla of caso.expected) {
        const valor = Object.entries(escalares).find(([clave]) => clave === casilla.scalar)?.[1]
        if (valor === undefined) throw new Error(`Escalar sin proyección: ${casilla.scalar}`)
        expect.soft(new Decimal(valor).equals(casilla.official), `${caso.year}/${casilla.box}`).toBe(true)
      }
      // Una omisión oficial no se compara como cero. No se promueven 0023/0414.
      expect(caso.reserved.map((r) => r.box).sort()).toEqual(
        caso.year === 2024 ? ["0023", "0414", "0533"] : ["0023", "0414"]
      )
    })
    it(`${caso.year}: el rastro no atribuye políticas de artículo 20 o DA61 de 2025`, () => {
      const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(caso.input)
      const salida = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
      const lineas = salida.rastro.pasos.flatMap((p) => p.lineasCalculo ?? [])
      const art20 = lineas.find((l) => l.etiqueta === "Reducción artículo 20")
      const da61 = lineas.find((l) => l.etiqueta === "DA61")
      expect(art20).toBeDefined()
      expect(art20?.formula).not.toContain("2025")
      expect(da61?.formula).toBe("No aplicable al ejercicio histórico; importe cero")
      expect(salida.deduccionTrabajo).toBe("0")
    })
  }
})
