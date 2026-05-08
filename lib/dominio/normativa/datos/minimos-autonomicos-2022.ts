import { Match, Option } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2022Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"
import {
  MINIMOS_AUTONOMICOS_IRPF_2025,
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "./minimos-autonomicos-2025"

const importe = crearImporteMonetario

export const MINIMOS_ESTATALES_2022 = MINIMOS_ESTATALES_2025

export const MINIMOS_ILLES_BALEARS_2022 = {
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1820"),
    adicionalMayor75: importe("1540"),
  },
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
  discapacidad:
    MINIMOS_AUTONOMICOS_IRPF_2025.valor["illes-balears"].discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_MADRID_2022 = {
  contribuyente: {
    general: importe("5777.55"),
    adicionalMayor65: importe("1197.15"),
    adicionalMayor75: importe("1457.40"),
  },
  descendientes: {
    primero: importe("2498.40"),
    segundo: importe("2810.70"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2914.80"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1197.15"),
    adicionalMayor75: importe("1457.40"),
  },
  discapacidad: {
    contribuyente: {
      grado33Hasta65: importe("3123"),
      grado65OMas: importe("9369"),
      gastosAsistencia: importe("3123"),
    },
    descendiente: {
      grado33Hasta65: importe("3123"),
      grado65OMas: importe("9369"),
      gastosAsistencia: importe("3123"),
    },
    ascendiente: {
      grado33Hasta65: importe("3123"),
      grado65OMas: importe("9369"),
      gastosAsistencia: importe("3123"),
    },
  },
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_AUTONOMICOS_IRPF_2022 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2022",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2022,
    canarias: MINIMOS_ESTATALES_2022,
    "illes-balears": MINIMOS_ILLES_BALEARS_2022,
    madrid: MINIMOS_MADRID_2022,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2022Parte1,
})

const fechaCivilIsoUtc = (fecha: Date): string =>
  [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, "0"),
    String(fecha.getUTCDate()).padStart(2, "0"),
  ].join("-")

const fallecidoAntesDeFechaCivil = ({
  fechaFallecimiento,
  fechaCorte,
}: {
  readonly fechaFallecimiento: Date | undefined
  readonly fechaCorte: string
}): boolean =>
  Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fecha) => fechaCivilIsoUtc(fecha) < fechaCorte,
    })
  )

export const obtenerMinimosAutonomicosIrpf2022 = ({
  comunidadAutonoma,
  fechaFallecimiento,
}: {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
}): MinimosPersonalesFamiliaresIrpf =>
  Match.value({
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  }).pipe(
    Match.when(
      {
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      },
      () => MINIMOS_ESTATALES_2022
    ),
    Match.orElse(() => MINIMOS_AUTONOMICOS_IRPF_2022.valor[comunidadAutonoma])
  )
