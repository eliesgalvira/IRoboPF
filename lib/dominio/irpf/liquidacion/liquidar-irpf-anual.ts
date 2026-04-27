import type { CasoFiscalAnual } from "../caso-fiscal-anual"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"

export type { CasoFiscalAnual } from "../caso-fiscal-anual"

export interface ContextoLiquidacionIrpf {
  readonly modo: "canonico" | "compatible-legacy"
}

export interface ResultadoNoSoportado {
  readonly _tag: "ResultadoNoSoportado"
  readonly motivo: string
  readonly fuenteReconocida: string
  readonly rastro: RastroCalculo
}

export type ResultadoLiquidacionIrpf = ResultadoNoSoportado

export const liquidarIrpfAnual = (
  caso: CasoFiscalAnual,
  _contexto: ContextoLiquidacionIrpf
): ResultadoLiquidacionIrpf => {
  if ((caso.rendimientos.capitalInmobiliario?.length ?? 0) > 0) {
    return {
      _tag: "ResultadoNoSoportado",
      motivo: "Rendimientos de capital inmobiliario aun no implementados",
      fuenteReconocida: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
      rastro: rastroResultadoNoSoportado({
        caso,
        tituloPaso: "Rendimiento no soportado",
        descripcionPaso:
          "Los rendimientos de capital inmobiliario estan reconocidos por el dominio, pero esta vertical slice aun no liquida sus reglas.",
      }),
    }
  }

  return {
    _tag: "ResultadoNoSoportado",
    motivo: "Liquidacion anual del IRPF aun no implementada",
    fuenteReconocida: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
    rastro: rastroResultadoNoSoportado({
      caso,
      tituloPaso: "Liquidacion no soportada",
      descripcionPaso:
        "El caso fiscal anual esta reconocido, pero esta vertical slice aun no liquida sus reglas.",
    }),
  }
}

const rastroResultadoNoSoportado = ({
  caso,
  tituloPaso,
  descripcionPaso,
}: {
  readonly caso: CasoFiscalAnual
  readonly tituloPaso: string
  readonly descripcionPaso: string
}): RastroCalculo => ({
  titulo: `Liquidacion anual del IRPF ${caso.anio}`,
  pasos: [
    {
      _tag: "PasoExplicacion",
      titulo: "Caso fiscal anual reconocido",
      descripcion: `El motor ha recibido un caso individual para la comunidad ${caso.comunidadAutonoma}.`,
      fuentes: [],
    },
    {
      _tag: "PasoExplicacion",
      titulo: tituloPaso,
      descripcion: descripcionPaso,
      fuentes: [
        {
          titulo: "Manual Renta 2025 Parte 1",
          referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
        },
      ],
    },
  ],
})
