import { DateTime, Match, Option } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2023Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"
import {
  MINIMOS_AUTONOMICOS_IRPF_2025,
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "./minimos-autonomicos-2025"

const importe = crearImporteMonetario

export const MINIMOS_ESTATALES_2023 = MINIMOS_ESTATALES_2025

export const MINIMOS_ILLES_BALEARS_2023_FALLECIDO_ANTES_26_NOVIEMBRE = {
  ...MINIMOS_AUTONOMICOS_IRPF_2025.valor["illes-balears"],
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_AUTONOMICOS_IRPF_2023 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2023",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2023,
    canarias: MINIMOS_ESTATALES_2023,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2023Parte1,
})

const fechaLimiteIllesBalearsMs = DateTime.makeUnsafe(
  "2023-11-26T00:00:00.000Z"
).epochMilliseconds

const fallecidoAntesDe = ({
  fechaFallecimiento,
  fechaLimiteMs,
}: {
  readonly fechaFallecimiento: Date | undefined
  readonly fechaLimiteMs: number
}): boolean =>
  Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fecha) => fecha.getTime() < fechaLimiteMs,
    })
  )

export const obtenerMinimosAutonomicosIrpf2023 = ({
  comunidadAutonoma,
  fechaFallecimiento,
}: {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
}): MinimosPersonalesFamiliaresIrpf =>
  Match.value({
    comunidadAutonoma,
    fallecidoAntesIllesBalears: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteIllesBalearsMs,
    }),
  }).pipe(
    Match.when(
      { comunidadAutonoma: "illes-balears", fallecidoAntesIllesBalears: true },
      () => MINIMOS_ILLES_BALEARS_2023_FALLECIDO_ANTES_26_NOVIEMBRE
    ),
    Match.orElse(() => MINIMOS_AUTONOMICOS_IRPF_2023.valor[comunidadAutonoma])
  )
