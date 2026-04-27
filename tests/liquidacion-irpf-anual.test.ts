import { describe, expect, it } from "@effect/vitest"

import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

describe("liquidarIrpfAnual", () => {
  it("devuelve ResultadoNoSoportado para rendimientos reconocidos aun no implementados", () => {
    const caso = {
      anio: 2025,
      comunidadAutonoma: "simulada-estatal",
      situacionFamiliar: {
        tipo: "individual",
        edad: 40,
        descendientes: [],
        ascendientes: [],
        discapacidad: "sin-discapacidad",
      },
      rendimientos: {
        trabajo: [{ importeIntegroCentimos: 30_000_00 }],
        capitalInmobiliario: [{ importeIntegroCentimos: 1_000_00 }],
      },
      reducciones: [],
      deducciones: [],
      retencionesSoportadasCentimos: 0,
      pagosACuentaCentimos: 0,
    } satisfies CasoFiscalAnual

    expect(liquidarIrpfAnual(caso, { modo: "canonico" })).toEqual({
      _tag: "ResultadoNoSoportado",
      motivo: "Rendimientos de capital inmobiliario aun no implementados",
      fuenteReconocida: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
      rastro: {
        titulo: "Liquidacion anual del IRPF 2025",
        pasos: [
          {
            _tag: "PasoExplicacion",
            titulo: "Caso fiscal anual reconocido",
            descripcion:
              "El motor ha recibido un caso individual para la comunidad simulada-estatal.",
            fuentes: [],
          },
          {
            _tag: "PasoExplicacion",
            titulo: "Rendimiento no soportado",
            descripcion:
              "Los rendimientos de capital inmobiliario estan reconocidos por el dominio, pero esta vertical slice aun no liquida sus reglas.",
            fuentes: [
              {
                titulo: "Manual Renta 2025 Parte 1",
                referencia:
                  "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
              },
            ],
          },
        ],
      },
    })
  })
})
