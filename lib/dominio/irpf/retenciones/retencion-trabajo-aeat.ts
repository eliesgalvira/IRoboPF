import Decimal from "decimal.js"
import { Context, Effect, Layer, Match } from "effect"

import type { ModoCalculo } from "../perfil-calculo"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import {
  centimosAEuros,
  eurosACentimos,
  redondearImporteLiquidado,
  truncarImporteMonetario,
} from "../../dinero/importe-monetario"
import {
  maximoUmbralRetencionTrabajoEuros,
  umbralRetencionTrabajoRequeridoEuros,
} from "../../normativa/datos/irpf-retenciones-trabajo-2012-2026"

export interface CasoRetencionTrabajo {
  readonly anio: AnioFiscal
  readonly edad?: number
  readonly retribucionAnualCentimos: number
  readonly cotizacionesCentimos?: number
  readonly situacionFamiliar: SituacionFamiliarRetencion
  readonly situacionLaboral?: SituacionLaboralRetencion
  readonly contrato?: ContratoRetencion
  readonly descendientes: ReadonlyArray<DescendienteRetencion> | number
  readonly ascendientes: ReadonlyArray<AscendienteRetencion> | number
  readonly discapacidad: DiscapacidadRetencion
  readonly movilidadGeografica?: boolean
  readonly movilidadReducidaPerceptor?: boolean
  readonly irregular1Centimos?: number
  readonly irregular2Centimos?: number
  readonly pensionCompensatoriaConyugeCentimos?: number
  readonly anualidadesAlimentosHijosCentimos?: number
  readonly residenciaCeutaMelilla?: boolean
  readonly rendimientosCeutaMelilla?: boolean
  readonly pagosViviendaHabitual?: boolean
}

export type SituacionFamiliarRetencion =
  | "situacion1"
  | "situacion2"
  | "situacion3"
  | "general"
export type SituacionLaboralRetencion =
  | "activo"
  | "pensionista"
  | "desempleado"
  | "otra-situacion"
export type ContratoRetencion =
  | "general"
  | "inferior-anio"
  | "especial"
  | "manuales"
export type DiscapacidadRetencion = "sin-discapacidad" | "de33a65" | "desde65"

export interface DescendienteRetencion {
  readonly edad: number
  readonly computoPorEntero: boolean
  readonly discapacidad: DiscapacidadRetencion
  readonly movilidadReducida: boolean
  readonly adopcionOAcogimientoMenosTresAnios: boolean
}

export interface AscendienteRetencion {
  readonly edad: number
  readonly convivencia: number
  readonly discapacidad: DiscapacidadRetencion
  readonly movilidadReducida: boolean
}

export interface ContextoRetencionTrabajo {
  readonly modo: ModoCalculo
}

export interface ResultadoNoSoportadoRetencion {
  readonly _tag: "ResultadoNoSoportado"
  readonly motivo: string
  readonly fuenteReconocida: string
  readonly rastro: RastroCalculo
}

export interface RetencionTrabajoCalculada {
  readonly _tag: "RetencionTrabajoCalculada"
  readonly anio: AnioFiscal
  readonly rendimientoNetoTrabajoCentimos: number
  readonly reduccionRendimientosTrabajoCentimos: number
  readonly rendimientoNetoReducidoCentimos: number
  readonly minimoPersonalFamiliarCentimos: number
  readonly baseRetencionCentimos: number
  readonly cuotaRetencionCentimos: number
  readonly limite43Centimos: number
  readonly tipoRetencionPorcentaje: string
  readonly importeRetencionAnualCentimos: number
  readonly rastro: RastroCalculo
}

export type ResultadoRetencionTrabajo =
  | RetencionTrabajoCalculada
  | ResultadoNoSoportadoRetencion
export type CalcularRetencionTrabajoError = ResultadoNoSoportadoRetencion

export interface ServicioRetencionTrabajoAeat {
  readonly calcular: (
    caso: CasoRetencionTrabajo,
    contexto: ContextoRetencionTrabajo
  ) => Effect.Effect<RetencionTrabajoCalculada, CalcularRetencionTrabajoError>
}

const FUENTE_RETENCIONES_AEAT = {
  titulo: "Algoritmo de retenciones 2026",
  referencia: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
} as const

const CERO = new Decimal(0)
const CIEN = new Decimal(100)

const redondear1 = redondearImporteLiquidado
const truncar = (valor: Decimal) => truncarImporteMonetario(valor, 2)
const aCentimos = (euros: Decimal) => eurosACentimos(euros)
const euros = (valor: Decimal) => `${valor.toFixed(2)} euros`
const porcentaje = (valor: Decimal) => `${valor.toFixed(2)}%`

const max = (...valores: ReadonlyArray<Decimal.Value>) =>
  Decimal.max(...valores)
const min = (...valores: ReadonlyArray<Decimal.Value>) =>
  Decimal.min(...valores)

const resultadoNoSoportadoRetencion = (
  caso: CasoRetencionTrabajo
): ResultadoNoSoportadoRetencion => ({
  _tag: "ResultadoNoSoportado",
  motivo: "Caso de retención de trabajo no soportado con las entradas actuales",
  fuenteReconocida: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
  rastro: {
    titulo: `Procedimiento de retención de trabajo ${caso.anio}`,
    pasos: [
      {
        _tag: "PasoExplicacion",
        titulo: "Caso de retención reconocido",
        descripcion:
          "El motor ha recibido rendimientos del trabajo para calcular una retención a cuenta, no una liquidación anual del IRPF.",
        fuentes: [
          {
            titulo: "Algoritmo de retenciones 2026",
            referencia: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
          },
        ],
      },
    ],
  },
})

const esCasoCalculable = (
  caso: CasoRetencionTrabajo
): caso is CasoRetencionTrabajo & {
  readonly cotizacionesCentimos: number
  readonly situacionFamiliar: "situacion1" | "situacion2" | "situacion3"
  readonly situacionLaboral: SituacionLaboralRetencion
  readonly contrato: ContratoRetencion
  readonly descendientes: ReadonlyArray<DescendienteRetencion>
  readonly ascendientes: ReadonlyArray<AscendienteRetencion>
} =>
  typeof caso.cotizacionesCentimos === "number" &&
  caso.situacionFamiliar !== "general" &&
  typeof caso.situacionLaboral === "string" &&
  typeof caso.contrato === "string" &&
  Array.isArray(caso.descendientes) &&
  Array.isArray(caso.ascendientes) &&
  !(caso.situacionFamiliar === "situacion1" && caso.descendientes.length === 0)

const importeOpcional = (centimos: number | undefined): Decimal =>
  centimosAEuros(centimos ?? 0)

const multiplicadorDescendiente = (descendiente: DescendienteRetencion) =>
  Match.value(descendiente.computoPorEntero).pipe(
    Match.when(true, () => new Decimal(1)),
    Match.orElse(() => new Decimal(0.5))
  )

const incrementoMovilidadGeografica = (caso: CasoRetencionTrabajo) =>
  Match.value(caso).pipe(
    Match.when({ movilidadGeografica: true }, () => new Decimal(2000)),
    Match.orElse(() => CERO)
  )

const incrementoGastosDiscapacidadTrabajador = (caso: CasoRetencionTrabajo) =>
  Match.value(caso).pipe(
    Match.when(
      { situacionLaboral: "activo", discapacidad: "desde65" },
      () => new Decimal(7750)
    ),
    Match.when(
      {
        situacionLaboral: "activo",
        discapacidad: "de33a65",
        movilidadReducidaPerceptor: true,
      },
      () => new Decimal(7750)
    ),
    Match.when(
      { situacionLaboral: "activo", discapacidad: "de33a65" },
      () => new Decimal(3500)
    ),
    Match.orElse(() => CERO)
  )

const calcularOtrosGastos = ({
  caso,
  retribucion,
  cotizaciones,
}: {
  readonly caso: CasoRetencionTrabajo
  readonly retribucion: Decimal
  readonly cotizaciones: Decimal
}) => {
  const gastosGenerales = new Decimal(2000)
  const incrementoMovilidad = incrementoMovilidadGeografica(caso)
  const incrementoDiscapacidad = incrementoGastosDiscapacidadTrabajador(caso)
  const otrosGastos = gastosGenerales
    .plus(incrementoMovilidad)
    .plus(incrementoDiscapacidad)
  const maximo = retribucion.minus(cotizaciones)

  return Match.value(maximo).pipe(
    Match.when(
      (valor) => valor.lt(0),
      () => CERO
    ),
    Match.orElse(() => min(otrosGastos, maximo))
  )
}

const calcularReduccionTrabajo = (rendimientoNetoTrabajo: Decimal) =>
  Match.value(rendimientoNetoTrabajo).pipe(
    Match.when(
      (valor) => valor.lte(14_852),
      () => redondear1(new Decimal(7302))
    ),
    Match.when(
      (valor) => valor.lte(17_673.52),
      () =>
        redondear1(
          new Decimal(7302).minus(
            rendimientoNetoTrabajo.minus(14_852).mul(1.75)
          )
        )
    ),
    Match.when(
      (valor) => valor.lt(19_747.5),
      () =>
        redondear1(
          new Decimal(2364.34).minus(
            rendimientoNetoTrabajo.minus(17_673.52).mul(1.14)
          )
        )
    ),
    Match.orElse(() => CERO)
  )

const cuantiaMinimoDescendiente = (indice: number) =>
  Match.value(indice).pipe(
    Match.when(0, () => new Decimal(2400)),
    Match.when(1, () => new Decimal(2700)),
    Match.when(2, () => new Decimal(4000)),
    Match.orElse(() => new Decimal(4500))
  )

const esDescendienteMenorTres = (descendiente: DescendienteRetencion) =>
  Match.value(descendiente).pipe(
    Match.when({ edad: (edad) => edad < 3 }, () => true),
    Match.when({ adopcionOAcogimientoMenosTresAnios: true }, () => true),
    Match.orElse(() => false)
  )

const calcularMinimoDescendientes = (
  descendientes: ReadonlyArray<DescendienteRetencion>
) => {
  const descendientesOrdenados = [...descendientes].sort(
    (a, b) => b.edad - a.edad
  )
  const minimoGeneral = descendientesOrdenados.reduce(
    (total, descendiente, indice) => {
      const cuantia = cuantiaMinimoDescendiente(indice)
      const multiplicador = multiplicadorDescendiente(descendiente)

      return total.plus(cuantia.mul(multiplicador))
    },
    CERO
  )
  const minimoMenoresTres = descendientesOrdenados.reduce(
    (total, descendiente) =>
      Match.value(esDescendienteMenorTres(descendiente)).pipe(
        Match.when(false, () => total),
        Match.orElse(() =>
          total.plus(
            new Decimal(2800).mul(multiplicadorDescendiente(descendiente))
          )
        )
      ),
    CERO
  )

  return redondear1(minimoGeneral).plus(redondear1(minimoMenoresTres))
}

const calcularMinimoAscendientes = (
  ascendientes: ReadonlyArray<AscendienteRetencion>
) => {
  const minimo65 = ascendientes.reduce((total, ascendiente) => {
    const computaPorEdad = ascendiente.edad >= 65
    const computaPorDiscapacidad =
      ascendiente.discapacidad !== "sin-discapacidad"

    return Match.value({ computaPorDiscapacidad, computaPorEdad }).pipe(
      Match.when(
        { computaPorDiscapacidad: false, computaPorEdad: false },
        () => total
      ),
      Match.orElse(() =>
        total.plus(new Decimal(1150).div(ascendiente.convivencia))
      )
    )
  }, CERO)
  const minimo75 = ascendientes.reduce(
    (total, ascendiente) =>
      Match.value(ascendiente.edad).pipe(
        Match.when(
          (edad) => edad < 75,
          () => total
        ),
        Match.orElse(() =>
          total.plus(new Decimal(1400).div(ascendiente.convivencia))
        )
      ),
    CERO
  )

  return redondear1(minimo65).plus(redondear1(minimo75))
}

const minimoDiscapacidad = (discapacidad: DiscapacidadRetencion) =>
  Match.value(discapacidad).pipe(
    Match.when("desde65", () => new Decimal(9000)),
    Match.when("de33a65", () => new Decimal(3000)),
    Match.orElse(() => CERO)
  )

const minimoAsistencia = ({
  discapacidad,
  movilidadReducida,
}: {
  readonly discapacidad: DiscapacidadRetencion
  readonly movilidadReducida: boolean
}) =>
  Match.value({ discapacidad, movilidadReducida }).pipe(
    Match.when({ discapacidad: "desde65" }, () => new Decimal(3000)),
    Match.when(
      { discapacidad: "de33a65", movilidadReducida: true },
      () => new Decimal(3000)
    ),
    Match.orElse(() => CERO)
  )

const calcularMinimoDiscapacidad = ({
  caso,
  descendientes,
  ascendientes,
}: {
  readonly caso: CasoRetencionTrabajo
  readonly descendientes: ReadonlyArray<DescendienteRetencion>
  readonly ascendientes: ReadonlyArray<AscendienteRetencion>
}) => {
  const discapacidadPerceptor = minimoDiscapacidad(caso.discapacidad)
  const asistenciaPerceptor = minimoAsistencia({
    discapacidad: caso.discapacidad,
    movilidadReducida: caso.movilidadReducidaPerceptor === true,
  })
  const discapacidadDescendientes = descendientes.reduce(
    (total, descendiente) =>
      total.plus(
        minimoDiscapacidad(descendiente.discapacidad).mul(
          multiplicadorDescendiente(descendiente)
        )
      ),
    CERO
  )
  const asistenciaDescendientes = descendientes.reduce(
    (total, descendiente) =>
      total.plus(
        minimoAsistencia({
          discapacidad: descendiente.discapacidad,
          movilidadReducida: descendiente.movilidadReducida,
        }).mul(multiplicadorDescendiente(descendiente))
      ),
    CERO
  )
  const discapacidadAscendientes = ascendientes.reduce(
    (total, ascendiente) =>
      total.plus(
        minimoDiscapacidad(ascendiente.discapacidad).div(
          ascendiente.convivencia
        )
      ),
    CERO
  )
  const asistenciaAscendientes = ascendientes.reduce(
    (total, ascendiente) =>
      total.plus(
        minimoAsistencia({
          discapacidad: ascendiente.discapacidad,
          movilidadReducida: ascendiente.movilidadReducida,
        }).div(ascendiente.convivencia)
      ),
    CERO
  )

  return discapacidadPerceptor
    .plus(asistenciaPerceptor)
    .plus(redondear1(discapacidadDescendientes))
    .plus(redondear1(asistenciaDescendientes))
    .plus(redondear1(discapacidadAscendientes))
    .plus(redondear1(asistenciaAscendientes))
}

const calcularMinimoPersonalFamiliar = ({
  caso,
  descendientes,
  ascendientes,
}: {
  readonly caso: CasoRetencionTrabajo
  readonly descendientes: ReadonlyArray<DescendienteRetencion>
  readonly ascendientes: ReadonlyArray<AscendienteRetencion>
}) => {
  const edad = caso.edad ?? 40
  const incrementoEdad = Match.value(edad).pipe(
    Match.when(
      (valor) => valor >= 75,
      () => new Decimal(2550)
    ),
    Match.when(
      (valor) => valor >= 65,
      () => new Decimal(1150)
    ),
    Match.orElse(() => CERO)
  )
  const minimoContribuyente = new Decimal(5550).plus(incrementoEdad)

  return minimoContribuyente
    .plus(calcularMinimoDescendientes(descendientes))
    .plus(calcularMinimoAscendientes(ascendientes))
    .plus(calcularMinimoDiscapacidad({ caso, descendientes, ascendientes }))
}

const calcularCuotaEscala = (base: Decimal) => {
  const tramos = [
    { desde: 0, cuota: 0, resto: 12_450, tipo: 0.19 },
    { desde: 12_450, cuota: 2365.5, resto: 7_750, tipo: 0.24 },
    { desde: 20_200, cuota: 4225.5, resto: 15_000, tipo: 0.3 },
    { desde: 35_200, cuota: 8725.5, resto: 24_800, tipo: 0.37 },
    { desde: 60_000, cuota: 17_901.5, resto: 240_000, tipo: 0.45 },
    { desde: 300_000, cuota: 125_901.5, resto: Infinity, tipo: 0.47 },
  ] as const
  const tramo =
    [...tramos].reverse().find(({ desde }) => base.gte(desde)) ?? tramos[0]

  return new Decimal(tramo.cuota).plus(base.minus(tramo.desde).mul(tramo.tipo))
}

const calcularCuotaRetencion = ({
  anualidades,
  base,
  minimoPersonalFamiliar,
}: {
  readonly anualidades: Decimal
  readonly base: Decimal
  readonly minimoPersonalFamiliar: Decimal
}) => {
  const aplicaAnualidades = anualidades.gt(0) && base.minus(anualidades).gt(0)
  const cuotas = Match.value(aplicaAnualidades).pipe(
    Match.when(true, () => ({
      cuota1: calcularCuotaEscala(base.minus(anualidades)).plus(
        calcularCuotaEscala(anualidades)
      ),
      cuota2: calcularCuotaEscala(minimoPersonalFamiliar.plus(1980)),
    })),
    Match.orElse(() => ({
      cuota1: calcularCuotaEscala(base),
      cuota2: calcularCuotaEscala(minimoPersonalFamiliar),
    }))
  )

  return max(CERO, cuotas.cuota1.minus(cuotas.cuota2))
}

const reduccionPorSituacionLaboral = ({
  descendientes,
  situacionLaboral,
}: {
  readonly descendientes: ReadonlyArray<DescendienteRetencion>
  readonly situacionLaboral: SituacionLaboralRetencion
}) => {
  const pensionista = Match.value(situacionLaboral).pipe(
    Match.when("pensionista", () => new Decimal(600)),
    Match.orElse(() => CERO)
  )
  const hijos = Match.value(descendientes.length).pipe(
    Match.when(
      (numero) => numero > 2,
      () => new Decimal(600)
    ),
    Match.orElse(() => CERO)
  )
  const desempleado = Match.value(situacionLaboral).pipe(
    Match.when("desempleado", () => new Decimal(1200)),
    Match.orElse(() => CERO)
  )

  return {
    desempleado,
    hijos,
    pensionista,
  }
}

const cuotaRetencionInicial = ({
  anualidades,
  baseRetencion,
  exento,
  minimoPersonalFamiliar,
}: {
  readonly anualidades: Decimal
  readonly baseRetencion: Decimal
  readonly exento: boolean
  readonly minimoPersonalFamiliar: Decimal
}) =>
  Match.value(exento).pipe(
    Match.when(true, () => CERO),
    Match.orElse(() =>
      calcularCuotaRetencion({
        anualidades,
        base: baseRetencion,
        minimoPersonalFamiliar,
      })
    )
  )

const calcularLimite43 = ({
  cuotaInicial,
  exento,
  retribucion,
  umbralConReducciones,
}: {
  readonly cuotaInicial: Decimal
  readonly exento: boolean
  readonly retribucion: Decimal
  readonly umbralConReducciones: Decimal
}) =>
  Match.value({ exento, retribucion }).pipe(
    Match.when({ exento: true }, () => cuotaInicial),
    Match.when(
      { retribucion: (valor) => valor.gt(35_200) },
      () => cuotaInicial
    ),
    Match.orElse(() =>
      max(CERO, retribucion.minus(umbralConReducciones).mul(0.43))
    )
  )

const calcularMinoracionVivienda = ({
  caso,
  retribucion,
}: {
  readonly caso: CasoRetencionTrabajo
  readonly retribucion: Decimal
}) =>
  Match.value({
    aplica: caso.pagosViviendaHabitual === true,
    retribucion,
  }).pipe(
    Match.when({ aplica: false }, () => CERO),
    Match.when({ retribucion: (valor) => valor.gte(33_007.2) }, () => CERO),
    Match.orElse(() => truncar(retribucion.mul(0.02)))
  )

const calcularDiferenciaPositiva = ({
  ceutaMelilla,
  cuotaRetencion,
  minopago,
}: {
  readonly ceutaMelilla: boolean
  readonly cuotaRetencion: Decimal
  readonly minopago: Decimal
}) =>
  Match.value(ceutaMelilla).pipe(
    Match.when(true, () => max(CERO, cuotaRetencion.mul(0.4).minus(minopago))),
    Match.orElse(() => max(CERO, cuotaRetencion.minus(minopago)))
  )

const calcularTipoInicial = ({
  diferenciaPositiva,
  retribucion,
}: {
  readonly diferenciaPositiva: Decimal
  readonly retribucion: Decimal
}) =>
  Match.value(retribucion).pipe(
    Match.when(
      (valor) => valor.lte(0),
      () => CERO
    ),
    Match.orElse(() => truncar(diferenciaPositiva.div(retribucion).mul(100)))
  )

const aplicarMinimoContrato = ({
  ceutaMelilla,
  contrato,
  tipoCalculado,
}: {
  readonly ceutaMelilla: boolean
  readonly contrato: ContratoRetencion
  readonly tipoCalculado: Decimal
}) =>
  Match.value({ ceutaMelilla, contrato, tipoCalculado }).pipe(
    Match.when(
      {
        ceutaMelilla: true,
        contrato: "especial",
        tipoCalculado: (tipo) => tipo.lt(6),
      },
      () => new Decimal(6)
    ),
    Match.when(
      {
        ceutaMelilla: true,
        contrato: "inferior-anio",
        tipoCalculado: (tipo) => tipo.lt(0.8),
      },
      () => new Decimal(0.8)
    ),
    Match.when(
      {
        ceutaMelilla: false,
        contrato: "especial",
        tipoCalculado: (tipo) => tipo.lt(15),
      },
      () => new Decimal(15)
    ),
    Match.when(
      {
        ceutaMelilla: false,
        contrato: "inferior-anio",
        tipoCalculado: (tipo) => tipo.lt(2),
      },
      () => new Decimal(2)
    ),
    Match.orElse(() => tipoCalculado)
  )

const formulaCuotaRetencion = ({
  exento,
  limite43,
}: {
  readonly exento: boolean
  readonly limite43: Decimal
}) =>
  Match.value(exento).pipe(
    Match.when(true, () => "Rendimientos exentos segun tabla 1"),
    Match.orElse(() => `min(cuota escala, limite 43% ${euros(limite43)})`)
  )

const calcularRetencionTrabajo = (
  caso: CasoRetencionTrabajo & {
    readonly cotizacionesCentimos: number
    readonly situacionFamiliar: "situacion1" | "situacion2" | "situacion3"
    readonly situacionLaboral: SituacionLaboralRetencion
    readonly contrato: ContratoRetencion
    readonly descendientes: ReadonlyArray<DescendienteRetencion>
    readonly ascendientes: ReadonlyArray<AscendienteRetencion>
  }
): RetencionTrabajoCalculada => {
  const retribucion = centimosAEuros(caso.retribucionAnualCentimos)
  const cotizaciones = centimosAEuros(caso.cotizacionesCentimos)
  const irregular1 = importeOpcional(caso.irregular1Centimos)
  const irregular2 = importeOpcional(caso.irregular2Centimos)
  const anualidades = importeOpcional(caso.anualidadesAlimentosHijosCentimos)
  const pensionCompensatoria = importeOpcional(
    caso.pensionCompensatoriaConyugeCentimos
  )
  const descendientes = caso.descendientes
  const otrosGastos = calcularOtrosGastos({ caso, retribucion, cotizaciones })
  const rendimientoNetoTrabajo = max(
    CERO,
    retribucion.minus(irregular1).minus(irregular2).minus(cotizaciones)
  )
  const reduccionRendimientosTrabajo = calcularReduccionTrabajo(
    rendimientoNetoTrabajo
  )
  const rendimientoNetoReducido = max(
    CERO,
    rendimientoNetoTrabajo
      .minus(otrosGastos)
      .minus(reduccionRendimientosTrabajo)
  )
  const reduccionLaboral = reduccionPorSituacionLaboral({
    descendientes,
    situacionLaboral: caso.situacionLaboral,
  })
  const reducciones = reduccionLaboral.pensionista
    .plus(reduccionLaboral.hijos)
    .plus(reduccionLaboral.desempleado)
    .plus(pensionCompensatoria)
  const baseRetencion = max(CERO, rendimientoNetoReducido.minus(reducciones))
  const minimoPersonalFamiliar = calcularMinimoPersonalFamiliar({
    caso,
    descendientes,
    ascendientes: caso.ascendientes,
  })
  const umbral = new Decimal(
    umbralRetencionTrabajoRequeridoEuros({
      anio: caso.anio,
      situacionFamiliar: caso.situacionFamiliar,
      situacionLaboral: caso.situacionLaboral,
      numeroDescendientes: descendientes.length,
    })
  )
  const umbralMaximo = new Decimal(
    maximoUmbralRetencionTrabajoEuros({
      anio: caso.anio,
      situacionLaboral: caso.situacionLaboral,
    })
  )
  const umbralConReducciones = umbral
    .plus(reduccionLaboral.pensionista)
    .plus(reduccionLaboral.desempleado)
  const umbralMaximoConReducciones = umbralMaximo
    .plus(reduccionLaboral.pensionista)
    .plus(reduccionLaboral.desempleado)
  const exento =
    retribucion.lte(umbralMaximoConReducciones) &&
    retribucion.lte(umbralConReducciones)
  const cuotaInicial = cuotaRetencionInicial({
    anualidades,
    baseRetencion,
    exento,
    minimoPersonalFamiliar,
  })
  const limite43 = calcularLimite43({
    cuotaInicial,
    exento,
    retribucion,
    umbralConReducciones,
  })
  const cuotaRetencion = min(cuotaInicial, limite43)
  const ceutaMelilla =
    caso.residenciaCeutaMelilla === true &&
    caso.rendimientosCeutaMelilla === true
  const minopago = calcularMinoracionVivienda({ caso, retribucion })
  const diferenciaPositiva = calcularDiferenciaPositiva({
    ceutaMelilla,
    cuotaRetencion,
    minopago,
  })
  const tipoCalculado = calcularTipoInicial({ diferenciaPositiva, retribucion })
  const tipoRetencion = aplicarMinimoContrato({
    ceutaMelilla,
    contrato: caso.contrato,
    tipoCalculado,
  })
  const importeRetencion = redondear1(retribucion.mul(tipoRetencion).div(CIEN))

  return {
    _tag: "RetencionTrabajoCalculada",
    anio: caso.anio,
    rendimientoNetoTrabajoCentimos: aCentimos(rendimientoNetoTrabajo),
    reduccionRendimientosTrabajoCentimos: aCentimos(
      reduccionRendimientosTrabajo
    ),
    rendimientoNetoReducidoCentimos: aCentimos(rendimientoNetoReducido),
    minimoPersonalFamiliarCentimos: aCentimos(minimoPersonalFamiliar),
    baseRetencionCentimos: aCentimos(baseRetencion),
    cuotaRetencionCentimos: aCentimos(cuotaRetencion),
    limite43Centimos: aCentimos(limite43),
    tipoRetencionPorcentaje: tipoRetencion.toFixed(2),
    importeRetencionAnualCentimos: aCentimos(importeRetencion),
    rastro: {
      titulo: `Procedimiento de retención de trabajo ${caso.anio}`,
      pasos: [
        {
          _tag: "PasoExplicacion",
          titulo: "Base de retención",
          descripcion:
            "Se calcula el rendimiento neto reducido y se restan las reducciones personales comunicadas.",
          lineasCalculo: [
            {
              etiqueta: "Rendimiento neto del trabajo",
              formula: `${euros(retribucion)} - ${euros(irregular1)} - ${euros(irregular2)} - ${euros(cotizaciones)}`,
              resultado: euros(rendimientoNetoTrabajo),
            },
            {
              etiqueta: "Reducción por rendimientos del trabajo",
              formula: "Art. 20 LIRPF segun tramos del procedimiento",
              resultado: euros(reduccionRendimientosTrabajo),
            },
            {
              etiqueta: "Base para calcular el tipo",
              formula: `${euros(rendimientoNetoReducido)} - ${euros(reducciones)}`,
              resultado: euros(baseRetencion),
            },
          ],
          fuentes: [FUENTE_RETENCIONES_AEAT],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota y tipo de retención",
          descripcion:
            "La cuota se obtiene aplicando la escala de retención a la base y al mínimo personal y familiar; el tipo se trunca a dos decimales.",
          lineasCalculo: [
            {
              etiqueta: "Mínimo personal y familiar",
              formula:
                "Contribuyente, descendientes, ascendientes y discapacidad",
              resultado: euros(minimoPersonalFamiliar),
            },
            {
              etiqueta: "Cuota de retención",
              formula: formulaCuotaRetencion({ exento, limite43 }),
              resultado: euros(cuotaRetencion),
            },
            {
              etiqueta: "Tipo de retención",
              formula: `${euros(diferenciaPositiva)} / ${euros(retribucion)} x 100`,
              resultado: porcentaje(tipoRetencion),
            },
            {
              etiqueta: "Importe anual",
              formula: `${euros(retribucion)} x ${porcentaje(tipoRetencion)}`,
              resultado: euros(importeRetencion),
            },
          ],
          fuentes: [FUENTE_RETENCIONES_AEAT],
        },
      ],
    },
  }
}

const calcularRetencionTrabajoAeatImpl = Effect.fn(
  "RetencionTrabajoAeat.calcular"
)(function* (caso: CasoRetencionTrabajo, contexto: ContextoRetencionTrabajo) {
  yield* Effect.annotateCurrentSpan("retencion.anio", caso.anio)
  yield* Effect.annotateCurrentSpan("retencion.modo", contexto.modo)

  return yield* Match.value(caso).pipe(
    Match.when(esCasoCalculable, (casoCalculable) =>
      Effect.succeed(calcularRetencionTrabajo(casoCalculable))
    ),
    Match.orElse((casoNoSoportado) =>
      Effect.fail(resultadoNoSoportadoRetencion(casoNoSoportado))
    )
  )
})

export class RetencionTrabajoAeat extends Context.Service<
  RetencionTrabajoAeat,
  ServicioRetencionTrabajoAeat
>()(
  "irobopf/lib/dominio/irpf/retenciones/retencion-trabajo-aeat/RetencionTrabajoAeat"
) {
  static readonly layer = Layer.succeed(RetencionTrabajoAeat, {
    calcular: calcularRetencionTrabajoAeatImpl,
  })
}

const calcularRetencionTrabajoAeatDesdeServicio = Effect.fn(
  "RetencionTrabajoAeat.calcularDesdeServicio"
)(function* (caso: CasoRetencionTrabajo, contexto: ContextoRetencionTrabajo) {
  const retencion = yield* RetencionTrabajoAeat

  return yield* retencion.calcular(caso, contexto)
})

export const calcularRetencionTrabajoAeat = (
  caso: CasoRetencionTrabajo,
  contexto: ContextoRetencionTrabajo
): Effect.Effect<RetencionTrabajoCalculada, CalcularRetencionTrabajoError> =>
  // @effect-diagnostics-next-line effect/strictEffectProvide:off
  calcularRetencionTrabajoAeatDesdeServicio(caso, contexto).pipe(
    Effect.provide(RetencionTrabajoAeat.layer)
  )
