import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import type { CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { anualCanonico, anualEfectivo, multiple } from "./p5-fixtures"

const basesFamiliares2025: CensoBasesFamiliares2025 = {
  referencia: "censo-integracion-sintetico", ejercicio: 2025, devengo: "2025-12-31",
  contribuyente: "s-1", estadoCivil: "sin-vinculo", censoCompleto: true,
  hijosCompletos: true, hijos: [], personas: [{
    id: "s-1", soporte: "censo-sintetico", residenteComunTodo2025: true,
    vivoTodo2025: true, economia: { perfil: "declarante-en-composicion" },
  }],
}

it.each(["canonico", "explicito"] as const)("%s: el censo familiar conserva los 260 EUR de varios donativos y su aplicación única", api => {
  const deduccionesTerritoriales2025 = { solicitudes: [], donativosEstatales2025: multiple() }
  if (api === "canonico") {
    const caso = { ...anualCanonico(), comunidadAutonoma: "madrid" as const }
    const antes = Effect.runSync(liquidarIrpfAnual(caso, { modo: "canonico" }))
    const soloDonativos = Effect.runSync(liquidarIrpfAnual({ ...caso, deduccionesTerritoriales2025 }, { modo: "canonico" }))
    const junto = Effect.runSync(liquidarIrpfAnual({ ...caso, basesFamiliares2025, deduccionesTerritoriales2025 }, { modo: "canonico" }))
    expect(antes.cuotaLiquidaCentimos - junto.cuotaLiquidaCentimos).toBe(26000)
    expect(junto.cuotaLiquidaCentimos).toBe(soloDonativos.cuotaLiquidaCentimos)
    expect(junto.deduccionesTerritoriales2025).toEqual(soloDonativos.deduccionesTerritoriales2025)
  } else {
    const caso = { ...anualEfectivo(), comunidadAutonoma: "madrid" as const }
    const antes = Effect.runSync(liquidarIrpfAnualExplicito(caso))
    const soloDonativos = Effect.runSync(liquidarIrpfAnualExplicito({ ...caso, deduccionesTerritoriales2025 }))
    const junto = Effect.runSync(liquidarIrpfAnualExplicito({ ...caso, basesFamiliares2025, deduccionesTerritoriales2025 }))
    expect(new Decimal(antes.cuotaLiquidaLegal).minus(junto.cuotaLiquidaLegal).eq(260)).toBe(true)
    expect(junto.cuotaLiquidaLegal).toBe(soloDonativos.cuotaLiquidaLegal)
    expect(junto.deduccionesTerritoriales2025).toEqual(soloDonativos.deduccionesTerritoriales2025)
    const libro = junto.deduccionesTerritoriales2025
    if (libro === undefined || !("donativosEstatales2025" in libro)) throw new Error("Falta el libro de donativos")
    expect(libro.donativosEstatales2025.aplicado).toEqual(racional("260"))
  }
})
