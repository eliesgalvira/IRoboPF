import { Schema } from "effect"
import { Unidad } from "./comun"
import type { ResultadoCuotaConjuntaValenciana2025 } from "./cuota-conjunta"
import type { RastroCalculo } from "../../../explicacion/rastro-calculo"

const Texto = Schema.String.check(Schema.isPattern(/\S/))
/** Sin bases ni cuota externas: las deriva exclusivamente la composición anual. */
export const SolicitudDeduccionesValencianasAnual2025 = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  territorio: Schema.Literal("comunitat-valenciana"),
  modalidad: Schema.Literal("individual"),
  devengo: Schema.Literal("2025-12-31"),
  contribuyente: Texto,
  cantidades: Schema.Array(Schema.Struct({ id: Texto, euros: Schema.Number })),
  solicitudes: Schema.Array(
    Schema.Struct({
      codigo: Texto,
      eleccion: Schema.Literals(["aplicar", "omitir"]),
      unidades: Schema.Array(Unidad),
      referencias: Schema.Array(
        Schema.Struct({
          unidad: Texto,
          sujetos: Schema.Array(Texto),
          bienes: Schema.Array(Texto),
          eventos: Schema.Array(Texto),
          cantidades: Schema.Array(Texto),
        })
      ),
      descendientesIncremento: Schema.optional(Schema.Array(Texto)),
    })
  ),
  ordenBase30: Schema.Array(Texto),
  consignaciones: Schema.Array(
    Schema.Struct({ codigo: Texto, contribuyente: Texto })
  ),
  arrastres: Schema.Array(
    Schema.Struct({
      id: Texto,
      codigo: Texto,
      contribuyente: Texto,
      origen: Schema.Number,
      pendiente: Schema.Number,
      soporte: Texto,
    })
  ),
  ordenConsumo: Schema.Array(Texto),
  criterioOrden: Schema.Literal("eleccion_experta"),
})
export type SolicitudDeduccionesValencianasAnual2025 =
  typeof SolicitudDeduccionesValencianasAnual2025.Type

export const pasosDeduccionesValencianasAnual = (
  resultado: ResultadoCuotaConjuntaValenciana2025<string> | undefined
): RastroCalculo["pasos"] =>
  resultado === undefined
    ? []
    : [
        {
          _tag: "PasoExplicacion",
          titulo: "Deducciones valencianas por hechos y cuota anual compartida",
          descripcion:
            "Cuota derivada una vez por el núcleo anual. Resultado condicionado, sin aceptación fiscal ni habilitación de especialidades pendientes. " +
            JSON.stringify(resultado),
          fuentes: [
            {
              titulo: "Conexión anual valenciana 2025",
              referencia:
                "docs/procedencia/deducciones-2025/VALENCIANA-ANUAL.md",
            },
          ],
          lineasCalculo: [],
        },
      ]
