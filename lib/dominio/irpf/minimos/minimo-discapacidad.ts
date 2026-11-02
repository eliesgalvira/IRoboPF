import type Decimal from "decimal.js"
import { Match } from "effect"
import { IMPORTE_CERO } from "../../dinero/importe-monetario"
import type {
  MinimoDiscapacidadIrpf,
  MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
import type {
  DiscapacidadFiscal,
  SituacionFamiliarIndividual,
} from "../caso-fiscal-anual"
export const obtenerMinimoPorDiscapacidad = (
  discapacidad: DiscapacidadFiscal,
  minimos: MinimoDiscapacidadIrpf
): Decimal =>
  Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minimos.grado33Hasta65.plus(minimos.gastosAsistencia)
        : minimos.grado33Hasta65,
    Discapacidad65OMas: () =>
      minimos.grado65OMas.plus(minimos.gastosAsistencia),
  })

export const obtenerMinimoDiscapacidadContribuyente = (
  situacionFamiliar: SituacionFamiliarIndividual,
  minimos: MinimosPersonalesFamiliaresIrpf
): Decimal =>
  obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  )
