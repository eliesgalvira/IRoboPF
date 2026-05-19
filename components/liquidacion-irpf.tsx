"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Effect, Match, Option, Result } from "effect"
import { AlertTriangle, CircleHelp, FileText } from "lucide-react"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { NumberField } from "@/components/ui/number-field"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip } from "@/components/ui/tooltip"
import {
  discapacidad33a64,
  discapacidad65OMas,
  sinDiscapacidad,
  type ComunidadAutonoma,
} from "@/lib/dominio/irpf/caso-fiscal-anual"
import {
  liquidarIrpfAnual,
  type CasoFiscalAnual,
  type ResultadoLiquidacionIrpf,
} from "@/lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { ConciliacionSimuladorLegacy } from "@/lib/dominio/irpf/liquidacion/conciliacion-simulador-legacy"
import { calcularCotizacionesSocialesLegacy } from "@/lib/dominio/laboral/cotizaciones-sociales"
import { crearImporteMonetario } from "@/lib/dominio/dinero/importe-monetario"
import type {
  CasoRetencionTrabajo,
  ContratoRetencion,
  DiscapacidadRetencion,
  SituacionFamiliarRetencion,
  SituacionLaboralRetencion,
} from "@/lib/dominio/irpf/retenciones/retencion-trabajo-aeat"
import { CATALOGO_DEDUCCIONES_AUTONOMICAS_2025 } from "@/lib/dominio/normativa/datos/deducciones-autonomicas-2025"
import {
  booleanoDeduccion,
  calcularDeduccionesAutonomicasAplicadas,
  ENTRADAS_DEDUCCIONES_INICIALES,
  numeroDeduccion,
  textoDeduccion,
  type EntradasDeduccionesAutonomicas,
} from "@/lib/dominio/irpf/deducciones-autonomicas-aplicadas"
import type {
  CuantiaDeduccionAutonomica,
  CatalogoDeduccionesAutonomicasPorComunidad,
  FichaDeduccionAutonomica,
} from "@/lib/dominio/normativa/datos/deducciones-autonomicas-2025"
import { formatearPuntosPorcentuales } from "@/lib/formato"
import { cn } from "@/lib/utils"

const eurosACentimos = (euros: number) => Math.round(euros * 100)
const centimosAEuros = (centimos: number) => centimos / 100
const FORMATO_ENTERO = {
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions
const FORMATO_EUROS = {
  maximumFractionDigits: 2,
} satisfies Intl.NumberFormatOptions
const OPCIONES_COMUNIDAD_AUTONOMA: ReadonlyArray<{
  readonly valor: ComunidadAutonoma
  readonly etiqueta: string
}> = [
  { valor: "simulada-estatal", etiqueta: "Simulada estatal" },
  { valor: "andalucia", etiqueta: "Andalucía" },
  { valor: "aragon", etiqueta: "Aragón" },
  { valor: "asturias", etiqueta: "Asturias" },
  { valor: "illes-balears", etiqueta: "Illes Balears" },
  { valor: "canarias", etiqueta: "Canarias" },
  { valor: "cantabria", etiqueta: "Cantabria" },
  { valor: "castilla-la-mancha", etiqueta: "Castilla-La Mancha" },
  { valor: "castilla-y-leon", etiqueta: "Castilla y León" },
  { valor: "catalunya", etiqueta: "Catalunya" },
  { valor: "extremadura", etiqueta: "Extremadura" },
  { valor: "galicia", etiqueta: "Galicia" },
  { valor: "madrid", etiqueta: "Madrid" },
  { valor: "murcia", etiqueta: "Murcia" },
  { valor: "la-rioja", etiqueta: "La Rioja" },
  { valor: "comunitat-valenciana", etiqueta: "Comunitat Valenciana" },
  { valor: "ceuta", etiqueta: "Ceuta" },
  { valor: "melilla", etiqueta: "Melilla" },
]
type TratamientoGananciaPatrimonial =
  | "sin-exencion"
  | "vivienda-habitual-mayores-65"
  | "renta-vitalicia-mayores-65"

interface EntradasRetencionAeat {
  readonly retribucionAnualEuros: number
  readonly cotizacionesEuros: number
  readonly situacionFamiliar: Exclude<SituacionFamiliarRetencion, "general">
  readonly situacionLaboral: SituacionLaboralRetencion
  readonly contrato: ContratoRetencion
  readonly discapacidad: DiscapacidadRetencion
  readonly movilidadGeografica: boolean
  readonly movilidadReducidaPerceptor: boolean
  readonly descendientes: number
  readonly descendientesMenoresTres: number
  readonly descendientesComputoEntero: number
  readonly descendientesDiscapacidad33a64: number
  readonly descendientesDiscapacidad65: number
  readonly descendientesMovilidadReducida: number
  readonly ascendientes: number
  readonly ascendientesMayores75: number
  readonly ascendientesComputoEntero: number
  readonly ascendientesDiscapacidad33a64: number
  readonly ascendientesDiscapacidad65: number
  readonly ascendientesMovilidadReducida: number
  readonly irregular1Euros: number
  readonly irregular2Euros: number
  readonly pensionCompensatoriaConyugeEuros: number
  readonly anualidadesAlimentosHijosEuros: number
  readonly residenciaCeutaMelilla: boolean
  readonly rendimientosCeutaMelilla: boolean
  readonly pagosViviendaHabitual: boolean
}

const OPCIONES_SITUACION_FAMILIAR_RETENCION: ReadonlyArray<{
  readonly valor: Exclude<SituacionFamiliarRetencion, "general">
  readonly etiqueta: string
}> = [
  { valor: "situacion3", etiqueta: "Situación 3: general" },
  { valor: "situacion1", etiqueta: "Situación 1: monoparental" },
  { valor: "situacion2", etiqueta: "Situación 2: cónyuge sin rentas" },
]
const OPCIONES_SITUACION_LABORAL_RETENCION: ReadonlyArray<{
  readonly valor: SituacionLaboralRetencion
  readonly etiqueta: string
}> = [
  { valor: "activo", etiqueta: "Activo" },
  { valor: "pensionista", etiqueta: "Pensionista" },
  { valor: "desempleado", etiqueta: "Desempleado" },
  { valor: "otra-situacion", etiqueta: "Otra situación" },
]
const OPCIONES_CONTRATO_RETENCION: ReadonlyArray<{
  readonly valor: ContratoRetencion
  readonly etiqueta: string
}> = [
  { valor: "general", etiqueta: "General" },
  { valor: "inferior-anio", etiqueta: "Inferior al año" },
  { valor: "especial", etiqueta: "Relación especial" },
  { valor: "manuales", etiqueta: "Manuales" },
]
const OPCIONES_DISCAPACIDAD_RETENCION: ReadonlyArray<{
  readonly valor: DiscapacidadRetencion
  readonly etiqueta: string
}> = [
  { valor: "sin-discapacidad", etiqueta: "Sin discapacidad" },
  { valor: "de33a65", etiqueta: "33% a 64%" },
  { valor: "desde65", etiqueta: "65% o más" },
]
const OPCIONES_GANANCIA_PATRIMONIAL: ReadonlyArray<{
  readonly valor: TratamientoGananciaPatrimonial
  readonly etiqueta: string
}> = [
  { valor: "sin-exencion", etiqueta: "Sin exención" },
  {
    valor: "vivienda-habitual-mayores-65",
    etiqueta: "Vivienda habitual mayores de 65",
  },
  {
    valor: "renta-vitalicia-mayores-65",
    etiqueta: "Reinversión en renta vitalicia",
  },
]
const OPCIONES_CATEGORIA_FAMILIA_NUMEROSA = [
  { valor: "ninguna", etiqueta: "No aplicar" },
  { valor: "general", etiqueta: "General" },
  { valor: "especial", etiqueta: "Especial" },
] as const
const OPCIONES_REGIMEN_INVERSION_ANDALUCIA = [
  { valor: "general", etiqueta: "General" },
  { valor: "universidad", etiqueta: "Universidad/centro I+D" },
] as const
const OPCIONES_ORDEN_HIJO_CANARIAS = [
  { valor: "primero-segundo", etiqueta: "1º o 2º" },
  { valor: "tercero", etiqueta: "3º" },
  { valor: "cuarto", etiqueta: "4º" },
  { valor: "quinto-sucesivos", etiqueta: "5º o sucesivos" },
] as const
const describirCuantiaDeduccion = (
  cuantia: CuantiaDeduccionAutonomica
): string =>
  Match.value(cuantia).pipe(
    Match.when({ tipo: "mixta" }, (cuantia) => cuantia.descripcion),
    Match.when(
      { tipo: "importe_fijo" },
      (cuantia) => `${cuantia.euros} euros por ${cuantia.por}.`
    ),
    Match.orElse(
      (cuantia) =>
        `${formatearPuntosPorcentuales(cuantia.porcentaje)} sobre ${cuantia.base}${
          cuantia.limiteMaximoEuros !== undefined &&
          cuantia.limiteMaximoEuros !== ""
            ? `, con límite maximo de ${cuantia.limiteMaximoEuros} euros.`
            : "."
        }`
    )
  )

const describirEstadoDeduccion = (
  deduccion: FichaDeduccionAutonomica
): string =>
  Match.value(deduccion.estado).pipe(
    Match.when(
      "implementada",
      () => "Calculable en esta interfaz con los campos de abajo."
    ),
    Match.when(
      "normalizada_pendiente_tests",
      () =>
        "Ficha estructurada, pendiente de tests antes de aplicarla automáticamente."
    ),
    Match.when(
      "no_soportada",
      () =>
        "Revisada y no calculable con los datos actuales; debe tratarse como caso no soportado."
    ),
    Match.orElse(
      () =>
        "Reconocida en el manual, pendiente de convertir a ficha y fórmula revisadas."
    )
  )

const AYUDAS_RESUMEN = {
  "Rendimientos del trabajo":
    "Ingresos brutos anuales nominales de 2025 por salario o trabajo antes de restar cotizaciones y gastos deducibles.",
  "Base liquidable":
    "Resultado que queda para aplicar los tramos: rendimientos netos menos reducciones de base.",
  "Rendimiento neto del trabajo":
    "Salario bruto menos cotización del trabajador y gastos deducibles aplicados.",
  "Capital inmobiliario neto":
    "Rendimiento de inmuebles, por ejemplo alquileres, que se suma a la base general.",
  "Ganancia patrimonial exenta":
    "Parte de la ganancia que no tributa por exención reconocida, por ejemplo vivienda habitual de mayores de 65.",
  "Base ahorro":
    "Importe de ganancias y rentas del ahorro que queda sujeto a la escala del ahorro.",
  "Gastos y reducciones del trabajo":
    "Total que se resta al rendimiento del trabajo: cotización del trabajador, gastos deducibles y reducción por rendimientos del trabajo.",
  "Cotización empresa":
    "Aportacion a la Seguridad Social que paga la empresa por el trabajador.",
  "Cotización trabajador":
    "Aportacion a la Seguridad Social descontada al trabajador. Incluye MEI y, si procede, solidaridad.",
  "Coste laboral": "Salario bruto más la cotización de empresa.",
  "MEI empresa":
    "Mecanismo de Equidad Intergeneracional que paga la empresa. Esta parte esta incluida en la cotización de empresa.",
  "MEI trabajador":
    "Mecanismo de Equidad Intergeneracional descontado al trabajador. Esta parte esta incluida en la cotización del trabajador.",
  "Cuota líquida":
    "Impuesto resultante antes de restar retenciones y pagos a cuenta.",
  "Retenciones/pagos a cuenta":
    "Importes nominales ya pagados durante el año que se restan de la cuota líquida.",
  "Deducciones autonómicas":
    "Importe total de deducciones autonómicas aplicables, si ya lo conoces.",
  "Cuota diferencial":
    "Resultado tras restar retenciones y pagos a cuenta. Positivo: a pagar; negativo: a devolver.",
} satisfies Record<string, string>
const AYUDAS_FORMULARIO = {
  "Rendimientos del trabajo":
    "Ingresos brutos anuales nominales de 2025 por salario o trabajo antes de restar cotizaciones.",
  "Capital inmobiliario":
    "Ingresos anuales por inmuebles alquilados u otros rendimientos inmobiliarios.",
  "Ganancia patrimonial":
    "Ganancia obtenida al transmitir un bien, antes de aplicar posibles exenciones.",
  "Importe de transmisión":
    "Importe total obtenido en la venta o transmisión del bien.",
  "Reinversión renta vitalicia":
    "Importe reinvertido en una renta vitalicia asegurada para aplicar la exención de mayores de 65.",
  "Reinversiones previas":
    "Importes ya usados antes para el límite conjunto de 240.000 euros en rentas vitalicias.",
  Descendientes:
    "Número de hijos, nietos, acogidos o tutelados que quieres contar. Si una misma persona tiene discapacidad o ayuda, sigue contando como 1 en Total.",
  "Requisitos descendientes":
    "Para contar un descendiente: menor de 25 años, o con discapacidad desde el 33%; convivencia o dependencia económica; rentas no exentas de hasta 8.000 €; sin declaración individual con rentas superiores a 1.800 €.",
  "Descendientes con discapacidad":
    "De ese total, cuántos tienen discapacidad reconocida entre el 33% y el 64%.",
  "Descendientes discapacidad 65%":
    "De ese total, cuántos tienen discapacidad reconocida igual o superior al 65%.",
  "Descendientes con asistencia":
    "De los descendientes con discapacidad del 33% al 64%, cuántos tienen ayuda de tercera persona o movilidad reducida reconocida.",
  Ascendientes:
    "Padres, madres o abuelos que computan para el mínimo familiar: mayores de 65 años, o con discapacidad igual o superior al 33%.",
  "Retenciones soportadas":
    "IRPF nominal ya retenido durante 2025, por ejemplo en la nomina.",
  "Pagos a cuenta":
    "Otros pagos anticipados del impuesto ya realizados, incluidas retenciones de trabajo si decides estimarlas aqui.",
  "Deducciones autonómicas":
    "Importe total de deducciones autonómicas que quieras aplicar como dato revisable.",
} satisfies Record<string, string>

const estimarCotizacionTrabajadorEuros = (salarioBrutoAnualEuros: number) =>
  calcularCotizacionesSocialesLegacy({
    anio: 2025,
    salarioBrutoAnual: crearImporteMonetario(salarioBrutoAnualEuros),
  }).cotizacionTrabajador.toNumber()

const limitarConteo = (valor: number, maximo: number) =>
  Math.max(0, Math.min(Math.trunc(valor), Math.trunc(maximo)))

const discapacidadRetencionPorIndice = ({
  discapacidad33a64,
  discapacidad65,
  indice,
}: {
  readonly discapacidad33a64: number
  readonly discapacidad65: number
  readonly indice: number
}): DiscapacidadRetencion => {
  if (indice < discapacidad65) {
    return "desde65"
  }

  if (indice < discapacidad65 + discapacidad33a64) {
    return "de33a65"
  }

  return "sin-discapacidad"
}

const edadDescendienteRetencion = ({
  descendientesMenoresTres,
  indice,
}: {
  readonly descendientesMenoresTres: number
  readonly indice: number
}) => {
  if (indice < descendientesMenoresTres) {
    return 2
  }

  return 10
}

const edadAscendienteRetencion = ({
  ascendientesMayores75,
  indice,
}: {
  readonly ascendientesMayores75: number
  readonly indice: number
}) => {
  if (indice < ascendientesMayores75) {
    return 78
  }

  return 70
}

const convivenciaAscendienteRetencion = ({
  ascendientesComputoEntero,
  indice,
}: {
  readonly ascendientesComputoEntero: number
  readonly indice: number
}) => {
  if (indice < ascendientesComputoEntero) {
    return 1
  }

  return 2
}

const entradasRetencionPorDefecto = ({
  ascendientes,
  descendientes,
  descendientesConAsistencia = 0,
  descendientesConDiscapacidad = 0,
  descendientesDiscapacidad65 = 0,
  rendimientosTrabajoEuros,
}: {
  readonly ascendientes: number
  readonly descendientes: number
  readonly descendientesConAsistencia?: number
  readonly descendientesConDiscapacidad?: number
  readonly descendientesDiscapacidad65?: number
  readonly rendimientosTrabajoEuros: number
}): EntradasRetencionAeat => {
  const descendientesComputables = limitarConteo(descendientes, 16)
  const descendientesDiscapacidad65Computables = limitarConteo(
    descendientesDiscapacidad65,
    descendientesComputables
  )
  const descendientesDiscapacidad33a64Computables = limitarConteo(
    descendientesConDiscapacidad - descendientesDiscapacidad65Computables,
    descendientesComputables - descendientesDiscapacidad65Computables
  )
  const ascendientesComputables = limitarConteo(ascendientes, 6)

  return {
    retribucionAnualEuros: rendimientosTrabajoEuros,
    cotizacionesEuros: estimarCotizacionTrabajadorEuros(
      rendimientosTrabajoEuros
    ),
    situacionFamiliar: "situacion3",
    situacionLaboral: "activo",
    contrato: "general",
    discapacidad: "sin-discapacidad",
    movilidadGeografica: false,
    movilidadReducidaPerceptor: false,
    descendientes: descendientesComputables,
    descendientesMenoresTres: 0,
    descendientesComputoEntero: descendientesComputables,
    descendientesDiscapacidad33a64: descendientesDiscapacidad33a64Computables,
    descendientesDiscapacidad65: descendientesDiscapacidad65Computables,
    descendientesMovilidadReducida: limitarConteo(
      descendientesConAsistencia,
      descendientesDiscapacidad33a64Computables
    ),
    ascendientes: ascendientesComputables,
    ascendientesMayores75: ascendientesComputables,
    ascendientesComputoEntero: ascendientesComputables,
    ascendientesDiscapacidad33a64: 0,
    ascendientesDiscapacidad65: 0,
    ascendientesMovilidadReducida: 0,
    irregular1Euros: 0,
    irregular2Euros: 0,
    pensionCompensatoriaConyugeEuros: 0,
    anualidadesAlimentosHijosEuros: 0,
    residenciaCeutaMelilla: false,
    rendimientosCeutaMelilla: false,
    pagosViviendaHabitual: false,
  }
}

const construirCasoRetencionAeat = ({
  edad,
  entradas,
}: {
  readonly edad: number
  readonly entradas: EntradasRetencionAeat
}): CasoRetencionTrabajo => {
  const descendientes = limitarConteo(entradas.descendientes, 16)
  const descendientesMenoresTres = limitarConteo(
    entradas.descendientesMenoresTres,
    descendientes
  )
  const descendientesComputoEntero = limitarConteo(
    entradas.descendientesComputoEntero,
    descendientes
  )
  const descendientesDiscapacidad65 = limitarConteo(
    entradas.descendientesDiscapacidad65,
    descendientes
  )
  const descendientesDiscapacidad33a64 = limitarConteo(
    entradas.descendientesDiscapacidad33a64,
    descendientes - descendientesDiscapacidad65
  )
  const descendientesMovilidadReducida = limitarConteo(
    entradas.descendientesMovilidadReducida,
    descendientesDiscapacidad33a64
  )
  const ascendientes = limitarConteo(entradas.ascendientes, 6)
  const ascendientesMayores75 = limitarConteo(
    entradas.ascendientesMayores75,
    ascendientes
  )
  const ascendientesComputoEntero = limitarConteo(
    entradas.ascendientesComputoEntero,
    ascendientes
  )
  const ascendientesDiscapacidad65 = limitarConteo(
    entradas.ascendientesDiscapacidad65,
    ascendientes
  )
  const ascendientesDiscapacidad33a64 = limitarConteo(
    entradas.ascendientesDiscapacidad33a64,
    ascendientes - ascendientesDiscapacidad65
  )
  const ascendientesMovilidadReducida = limitarConteo(
    entradas.ascendientesMovilidadReducida,
    ascendientesDiscapacidad33a64
  )

  return {
    anio: 2025,
    edad,
    retribucionAnualCentimos: eurosACentimos(entradas.retribucionAnualEuros),
    cotizacionesCentimos: eurosACentimos(entradas.cotizacionesEuros),
    situacionFamiliar: entradas.situacionFamiliar,
    situacionLaboral: entradas.situacionLaboral,
    contrato: entradas.contrato,
    discapacidad: entradas.discapacidad,
    movilidadGeografica: entradas.movilidadGeografica,
    movilidadReducidaPerceptor: entradas.movilidadReducidaPerceptor,
    descendientes: Array.from({ length: descendientes }, (_, indice) => {
      const discapacidad = discapacidadRetencionPorIndice({
        discapacidad33a64: descendientesDiscapacidad33a64,
        discapacidad65: descendientesDiscapacidad65,
        indice,
      })
      const indiceDiscapacidad33a64 = indice - descendientesDiscapacidad65

      return {
        edad: edadDescendienteRetencion({
          descendientesMenoresTres,
          indice,
        }),
        computoPorEntero: indice < descendientesComputoEntero,
        discapacidad,
        movilidadReducida:
          discapacidad === "de33a65" &&
          indiceDiscapacidad33a64 < descendientesMovilidadReducida,
        adopcionOAcogimientoMenosTresAnios: indice < descendientesMenoresTres,
      }
    }),
    ascendientes: Array.from({ length: ascendientes }, (_, indice) => {
      const discapacidad = discapacidadRetencionPorIndice({
        discapacidad33a64: ascendientesDiscapacidad33a64,
        discapacidad65: ascendientesDiscapacidad65,
        indice,
      })
      const indiceDiscapacidad33a64 = indice - ascendientesDiscapacidad65

      return {
        edad: edadAscendienteRetencion({ ascendientesMayores75, indice }),
        convivencia: convivenciaAscendienteRetencion({
          ascendientesComputoEntero,
          indice,
        }),
        discapacidad,
        movilidadReducida:
          discapacidad === "de33a65" &&
          indiceDiscapacidad33a64 < ascendientesMovilidadReducida,
      }
    }),
    irregular1Centimos: eurosACentimos(entradas.irregular1Euros),
    irregular2Centimos: eurosACentimos(entradas.irregular2Euros),
    pensionCompensatoriaConyugeCentimos: eurosACentimos(
      entradas.pensionCompensatoriaConyugeEuros
    ),
    anualidadesAlimentosHijosCentimos: eurosACentimos(
      entradas.anualidadesAlimentosHijosEuros
    ),
    residenciaCeutaMelilla: entradas.residenciaCeutaMelilla,
    rendimientosCeutaMelilla: entradas.rendimientosCeutaMelilla,
    pagosViviendaHabitual: entradas.pagosViviendaHabitual,
  }
}

function formatearEuros(centimos: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(centimosAEuros(centimos))
}

export function LiquidacionIrpf() {
  const [rendimientosTrabajoEuros, fijarRendimientosTrabajoEuros] =
    React.useState(18_000)
  const [capitalInmobiliarioEuros, fijarCapitalInmobiliarioEuros] =
    React.useState(0)
  const [comunidadAutonoma, fijarComunidadAutonoma] =
    React.useState<ComunidadAutonoma>("simulada-estatal")
  const [edad, fijarEdad] = React.useState(40)
  const [descendientes, fijarDescendientes] = React.useState(0)
  const [descendientesConDiscapacidad, fijarDescendientesConDiscapacidad] =
    React.useState(0)
  const [descendientesDiscapacidad65, fijarDescendientesDiscapacidad65] =
    React.useState(0)
  const [descendientesConAsistencia, fijarDescendientesConAsistencia] =
    React.useState(0)
  const [ascendientes, fijarAscendientes] = React.useState(0)
  const [retencionesSoportadasEuros, fijarRetencionesSoportadasEuros] =
    React.useState(0)
  const [pagosACuentaEuros, fijarPagosACuentaEuros] = React.useState(0)
  const [deduccionAutonomicaManualEuros, fijarDeduccionAutonomicaManualEuros] =
    React.useState(0)
  const [catalogoDeduccionesAbierto, fijarCatalogoDeduccionesAbierto] =
    React.useState(false)
  const [entradasDeduccionesAutonomicas, fijarEntradasDeduccionesAutonomicas] =
    React.useState<EntradasDeduccionesAutonomicas>(
      ENTRADAS_DEDUCCIONES_INICIALES
    )
  const [gananciaPatrimonialEuros, fijarGananciaPatrimonialEuros] =
    React.useState(0)
  const [tratamientoGananciaPatrimonial, fijarTratamientoGananciaPatrimonial] =
    React.useState<TratamientoGananciaPatrimonial>("sin-exencion")
  const [importeTransmisionEuros, fijarImporteTransmisionEuros] =
    React.useState(0)
  const [reinversionRentaVitaliciaEuros, fijarReinversionRentaVitaliciaEuros] =
    React.useState(0)
  const [reinversionesPreviasEuros, fijarReinversionesPreviasEuros] =
    React.useState(0)
  const [dialogoPagosACuentaAbierto, fijarDialogoPagosACuentaAbierto] =
    React.useState(false)
  const [usarRetencionAeat, fijarUsarRetencionAeat] = React.useState(false)
  const [entradasRetencionAeat, fijarEntradasRetencionAeat] =
    React.useState<EntradasRetencionAeat>(() =>
      entradasRetencionPorDefecto({
        ascendientes: 0,
        descendientes: 0,
        rendimientosTrabajoEuros: 18_000,
      })
    )

  const deduccionesAutonomicasAplicadasEuros = React.useMemo(
    () =>
      comunidadAutonoma === "simulada-estatal"
        ? 0
        : calcularDeduccionesAutonomicasAplicadas(
            entradasDeduccionesAutonomicas
          ),
    [comunidadAutonoma, entradasDeduccionesAutonomicas]
  )
  const deduccionesAutonomicasEuros =
    comunidadAutonoma === "simulada-estatal"
      ? 0
      : deduccionAutonomicaManualEuros + deduccionesAutonomicasAplicadasEuros
  const activarRetencionAeat = React.useCallback(
    (activo: boolean) => {
      fijarUsarRetencionAeat(activo)
      if (activo) {
        fijarEntradasRetencionAeat(
          entradasRetencionPorDefecto({
            ascendientes,
            descendientes,
            descendientesConAsistencia,
            descendientesConDiscapacidad,
            descendientesDiscapacidad65,
            rendimientosTrabajoEuros,
          })
        )
      }
    },
    [
      ascendientes,
      descendientes,
      descendientesConAsistencia,
      descendientesConDiscapacidad,
      descendientesDiscapacidad65,
      rendimientosTrabajoEuros,
    ]
  )
  const actualizarEntradaRetencionAeat = React.useCallback(
    <TClave extends keyof EntradasRetencionAeat>(
      clave: TClave,
      valor: EntradasRetencionAeat[TClave]
    ) => {
      fijarEntradasRetencionAeat((actual) => ({
        ...actual,
        [clave]: valor,
      }))
    },
    []
  )
  const retencionTrabajoAeat = React.useMemo(
    () =>
      usarRetencionAeat
        ? construirCasoRetencionAeat({
            edad,
            entradas: entradasRetencionAeat,
          })
        : undefined,
    [edad, entradasRetencionAeat, usarRetencionAeat]
  )

  const caso = React.useMemo(
    () =>
      ({
        anio: 2025,
        comunidadAutonoma,
        situacionFamiliar: {
          tipo: "individual",
          edad,
          descendientes: Array.from({ length: descendientes }, (_, indice) => ({
            edad: 10,
            discapacidad:
              indice < descendientesDiscapacidad65
                ? discapacidad65OMas
                : indice < descendientesConDiscapacidad
                  ? discapacidad33a64({
                      necesitaAyudaOMovilidadReducida:
                        indice < descendientesConAsistencia,
                    })
                  : sinDiscapacidad,
          })),
          ascendientes: Array.from({ length: ascendientes }, () => ({
            edad: 78,
            discapacidad: sinDiscapacidad,
          })),
          discapacidad: sinDiscapacidad,
        },
        rendimientos: {
          trabajo: [
            {
              importeIntegroCentimos: eurosACentimos(rendimientosTrabajoEuros),
            },
          ],
          capitalInmobiliario:
            capitalInmobiliarioEuros > 0
              ? [
                  {
                    importeIntegroCentimos: eurosACentimos(
                      capitalInmobiliarioEuros
                    ),
                  },
                ]
              : [],
          gananciasPatrimoniales:
            gananciaPatrimonialEuros > 0
              ? [
                  {
                    importeGananciaCentimos: eurosACentimos(
                      gananciaPatrimonialEuros
                    ),
                    tratamientoMayores65:
                      tratamientoGananciaPatrimonial ===
                      "vivienda-habitual-mayores-65"
                        ? { _tag: "ViviendaHabitualMayores65" }
                        : tratamientoGananciaPatrimonial ===
                            "renta-vitalicia-mayores-65"
                          ? {
                              _tag: "ReinversionRentaVitaliciaMayores65",
                              importeTransmisionCentimos: eurosACentimos(
                                importeTransmisionEuros
                              ),
                              importeReinvertidoRentaVitaliciaCentimos:
                                eurosACentimos(reinversionRentaVitaliciaEuros),
                              reinversionesPreviasRentaVitaliciaCentimos:
                                eurosACentimos(reinversionesPreviasEuros),
                            }
                          : { _tag: "SinExencionMayores65" },
                  },
                ]
              : [],
        },
        reducciones: [],
        deducciones: [],
        ...(comunidadAutonoma !== "simulada-estatal" &&
        deduccionesAutonomicasEuros > 0
          ? {
              deduccionAutonomicaAgregadaCentimos: eurosACentimos(
                deduccionesAutonomicasEuros
              ),
            }
          : {}),
        retencionesSoportadasCentimos: eurosACentimos(
          retencionesSoportadasEuros
        ),
        pagosACuentaCentimos: usarRetencionAeat
          ? 0
          : eurosACentimos(pagosACuentaEuros),
        ...(retencionTrabajoAeat !== undefined ? { retencionTrabajoAeat } : {}),
      }) satisfies CasoFiscalAnual,
    [
      ascendientes,
      capitalInmobiliarioEuros,
      comunidadAutonoma,
      descendientes,
      descendientesConAsistencia,
      descendientesConDiscapacidad,
      descendientesDiscapacidad65,
      deduccionesAutonomicasEuros,
      edad,
      gananciaPatrimonialEuros,
      importeTransmisionEuros,
      pagosACuentaEuros,
      rendimientosTrabajoEuros,
      reinversionRentaVitaliciaEuros,
      reinversionesPreviasEuros,
      retencionesSoportadasEuros,
      retencionTrabajoAeat,
      tratamientoGananciaPatrimonial,
      usarRetencionAeat,
    ]
  )
  const resultado = React.useMemo(
    () =>
      Result.match(
        Effect.runSync(
          Effect.result(liquidarIrpfAnual(caso, { modo: "canonico" }))
        ),
        {
          onFailure: (error) => error,
          onSuccess: (liquidacion) => liquidacion,
        }
      ),
    [caso]
  )

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <NavegacionSitio />

        <section className="border border-[var(--rule)] bg-[var(--paper)] p-4">
          <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            Unidad de cálculo
          </p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--ink-soft)]">
            Todos los importes de esta pantalla están en euros nominales del año
            fiscal 2025: rendimientos, minimos, reducciones, deducciones,
            retenciones y cuotas. No se ajustan por IPC; los euros reales
            ajustados a inflación sólo se usan en las comparativas históricas.
          </p>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(320px,470px)_1fr]">
          <FormularioCaso
            ascendientes={ascendientes}
            capitalInmobiliarioEuros={capitalInmobiliarioEuros}
            comunidadAutonoma={comunidadAutonoma}
            descendientes={descendientes}
            descendientesConAsistencia={descendientesConAsistencia}
            descendientesConDiscapacidad={descendientesConDiscapacidad}
            descendientesDiscapacidad65={descendientesDiscapacidad65}
            catalogoDeduccionesAbierto={catalogoDeduccionesAbierto}
            dialogoPagosACuentaAbierto={dialogoPagosACuentaAbierto}
            edad={edad}
            entradasRetencionAeat={entradasRetencionAeat}
            entradasDeduccionesAutonomicas={entradasDeduccionesAutonomicas}
            activarRetencionAeat={activarRetencionAeat}
            fijarCatalogoDeduccionesAbierto={fijarCatalogoDeduccionesAbierto}
            fijarAscendientes={fijarAscendientes}
            fijarCapitalInmobiliarioEuros={fijarCapitalInmobiliarioEuros}
            fijarComunidadAutonoma={fijarComunidadAutonoma}
            fijarDescendientes={fijarDescendientes}
            fijarDescendientesConAsistencia={fijarDescendientesConAsistencia}
            fijarDescendientesConDiscapacidad={
              fijarDescendientesConDiscapacidad
            }
            fijarDescendientesDiscapacidad65={fijarDescendientesDiscapacidad65}
            fijarDeduccionAutonomicaManualEuros={
              fijarDeduccionAutonomicaManualEuros
            }
            fijarDialogoPagosACuentaAbierto={fijarDialogoPagosACuentaAbierto}
            fijarEdad={fijarEdad}
            fijarEntradasDeduccionesAutonomicas={
              fijarEntradasDeduccionesAutonomicas
            }
            fijarGananciaPatrimonialEuros={fijarGananciaPatrimonialEuros}
            fijarImporteTransmisionEuros={fijarImporteTransmisionEuros}
            fijarPagosACuentaEuros={fijarPagosACuentaEuros}
            fijarRendimientosTrabajoEuros={fijarRendimientosTrabajoEuros}
            fijarReinversionRentaVitaliciaEuros={
              fijarReinversionRentaVitaliciaEuros
            }
            fijarReinversionesPreviasEuros={fijarReinversionesPreviasEuros}
            fijarRetencionesSoportadasEuros={fijarRetencionesSoportadasEuros}
            fijarTratamientoGananciaPatrimonial={
              fijarTratamientoGananciaPatrimonial
            }
            gananciaPatrimonialEuros={gananciaPatrimonialEuros}
            importeTransmisionEuros={importeTransmisionEuros}
            pagosACuentaEuros={pagosACuentaEuros}
            rendimientosTrabajoEuros={rendimientosTrabajoEuros}
            reinversionRentaVitaliciaEuros={reinversionRentaVitaliciaEuros}
            reinversionesPreviasEuros={reinversionesPreviasEuros}
            retencionesSoportadasEuros={retencionesSoportadasEuros}
            tratamientoGananciaPatrimonial={tratamientoGananciaPatrimonial}
            actualizarEntradaRetencionAeat={actualizarEntradaRetencionAeat}
            deduccionesAutonomicasEuros={deduccionesAutonomicasEuros}
            deduccionesAutonomicasAplicadasEuros={
              deduccionesAutonomicasAplicadasEuros
            }
            usarRetencionAeat={usarRetencionAeat}
          />
          <Resultado resultado={resultado} />
        </section>
      </div>
    </main>
  )
}

function FormularioCaso({
  ascendientes,
  capitalInmobiliarioEuros,
  comunidadAutonoma,
  descendientes,
  descendientesConAsistencia,
  descendientesConDiscapacidad,
  descendientesDiscapacidad65,
  catalogoDeduccionesAbierto,
  deduccionesAutonomicasEuros,
  deduccionesAutonomicasAplicadasEuros,
  dialogoPagosACuentaAbierto,
  edad,
  entradasRetencionAeat,
  entradasDeduccionesAutonomicas,
  activarRetencionAeat,
  fijarAscendientes,
  fijarCapitalInmobiliarioEuros,
  fijarComunidadAutonoma,
  fijarDescendientes,
  fijarDescendientesConAsistencia,
  fijarDescendientesConDiscapacidad,
  fijarDescendientesDiscapacidad65,
  fijarCatalogoDeduccionesAbierto,
  fijarDeduccionAutonomicaManualEuros,
  fijarDialogoPagosACuentaAbierto,
  fijarEdad,
  fijarEntradasDeduccionesAutonomicas,
  fijarGananciaPatrimonialEuros,
  fijarImporteTransmisionEuros,
  fijarPagosACuentaEuros,
  fijarRendimientosTrabajoEuros,
  fijarReinversionRentaVitaliciaEuros,
  fijarReinversionesPreviasEuros,
  fijarRetencionesSoportadasEuros,
  fijarTratamientoGananciaPatrimonial,
  gananciaPatrimonialEuros,
  importeTransmisionEuros,
  pagosACuentaEuros,
  rendimientosTrabajoEuros,
  reinversionRentaVitaliciaEuros,
  reinversionesPreviasEuros,
  retencionesSoportadasEuros,
  tratamientoGananciaPatrimonial,
  actualizarEntradaRetencionAeat,
  usarRetencionAeat,
}: {
  readonly activarRetencionAeat: (activo: boolean) => void
  readonly ascendientes: number
  readonly capitalInmobiliarioEuros: number
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly descendientes: number
  readonly descendientesConAsistencia: number
  readonly descendientesConDiscapacidad: number
  readonly descendientesDiscapacidad65: number
  readonly catalogoDeduccionesAbierto: boolean
  readonly deduccionesAutonomicasEuros: number
  readonly deduccionesAutonomicasAplicadasEuros: number
  readonly dialogoPagosACuentaAbierto: boolean
  readonly edad: number
  readonly entradasRetencionAeat: EntradasRetencionAeat
  readonly entradasDeduccionesAutonomicas: EntradasDeduccionesAutonomicas
  readonly actualizarEntradaRetencionAeat: <
    TClave extends keyof EntradasRetencionAeat,
  >(
    clave: TClave,
    valor: EntradasRetencionAeat[TClave]
  ) => void
  readonly fijarAscendientes: (valor: number) => void
  readonly fijarCapitalInmobiliarioEuros: (valor: number) => void
  readonly fijarComunidadAutonoma: (valor: ComunidadAutonoma) => void
  readonly fijarDescendientes: (valor: number) => void
  readonly fijarDescendientesConAsistencia: (valor: number) => void
  readonly fijarDescendientesConDiscapacidad: (valor: number) => void
  readonly fijarDescendientesDiscapacidad65: (valor: number) => void
  readonly fijarCatalogoDeduccionesAbierto: (valor: boolean) => void
  readonly fijarDeduccionAutonomicaManualEuros: (valor: number) => void
  readonly fijarDialogoPagosACuentaAbierto: (valor: boolean) => void
  readonly fijarEdad: (valor: number) => void
  readonly fijarEntradasDeduccionesAutonomicas: React.Dispatch<
    React.SetStateAction<EntradasDeduccionesAutonomicas>
  >
  readonly fijarGananciaPatrimonialEuros: (valor: number) => void
  readonly fijarImporteTransmisionEuros: (valor: number) => void
  readonly fijarPagosACuentaEuros: (valor: number) => void
  readonly fijarRendimientosTrabajoEuros: (valor: number) => void
  readonly fijarReinversionRentaVitaliciaEuros: (valor: number) => void
  readonly fijarReinversionesPreviasEuros: (valor: number) => void
  readonly fijarRetencionesSoportadasEuros: (valor: number) => void
  readonly fijarTratamientoGananciaPatrimonial: (
    valor: TratamientoGananciaPatrimonial
  ) => void
  readonly gananciaPatrimonialEuros: number
  readonly importeTransmisionEuros: number
  readonly pagosACuentaEuros: number
  readonly rendimientosTrabajoEuros: number
  readonly reinversionRentaVitaliciaEuros: number
  readonly reinversionesPreviasEuros: number
  readonly retencionesSoportadasEuros: number
  readonly tratamientoGananciaPatrimonial: TratamientoGananciaPatrimonial
  readonly usarRetencionAeat: boolean
}) {
  const catalogoDeducciones = (
    CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor as Partial<
      Record<ComunidadAutonoma, CatalogoDeduccionesAutonomicasPorComunidad>
    >
  )[comunidadAutonoma]
  const usaComunidadAutonomicaReal = comunidadAutonoma !== "simulada-estatal"
  const deduccionesCatalogadas = catalogoDeducciones?.deducciones ?? []
  const catalogoDeduccionesVacio = deduccionesCatalogadas.length === 0
  const descendientesDiscapacidad33a64 = Math.max(
    0,
    descendientesConDiscapacidad - descendientesDiscapacidad65
  )

  return (
    <section className="border border-[var(--rule)] bg-[var(--paper)] p-3 shadow-[6px_6px_0_var(--rule)] lg:sticky lg:top-4 lg:max-h-[calc(100svh-2rem)] lg:overflow-y-auto 2xl:p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            2025 nominal · individual
          </p>
          <h1 className="mt-2 text-3xl leading-none font-[var(--display)]">
            Liquidación IRPF
          </h1>
        </div>
        <FileText aria-hidden className="mt-1 size-6 shrink-0" />
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Rendimientos del trabajo"]}
            compacto
            etiqueta="Rendimientos trabajo nominales"
            formato={FORMATO_ENTERO}
            onChange={fijarRendimientosTrabajoEuros}
            paso={500}
            valor={rendimientosTrabajoEuros}
          />
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Capital inmobiliario"]}
            compacto
            etiqueta="Capital inmobiliario"
            formato={FORMATO_ENTERO}
            onChange={fijarCapitalInmobiliarioEuros}
            paso={250}
            valor={capitalInmobiliarioEuros}
          />
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Ganancia patrimonial"]}
            compacto
            etiqueta="Ganancia patrimonial"
            formato={FORMATO_ENTERO}
            onChange={fijarGananciaPatrimonialEuros}
            paso={1_000}
            valor={gananciaPatrimonialEuros}
          />
          <Select
            compacto
            etiqueta="Tratamiento ganancia"
            onChange={fijarTratamientoGananciaPatrimonial}
            opciones={OPCIONES_GANANCIA_PATRIMONIAL}
            valor={tratamientoGananciaPatrimonial}
          />
        </div>
        {tratamientoGananciaPatrimonial === "renta-vitalicia-mayores-65" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Importe de transmisión"]}
              compacto
              etiqueta="Importe de transmisión"
              formato={FORMATO_ENTERO}
              onChange={fijarImporteTransmisionEuros}
              paso={1_000}
              valor={importeTransmisionEuros}
            />
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Reinversión renta vitalicia"]}
              compacto
              etiqueta="Reinversión renta vitalicia"
              formato={FORMATO_ENTERO}
              onChange={fijarReinversionRentaVitaliciaEuros}
              paso={1_000}
              valor={reinversionRentaVitaliciaEuros}
            />
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Reinversiones previas"]}
              compacto
              etiqueta="Reinversiones previas"
              formato={FORMATO_ENTERO}
              onChange={fijarReinversionesPreviasEuros}
              paso={1_000}
              valor={reinversionesPreviasEuros}
            />
          </div>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Retenciones soportadas"]}
            compacto
            etiqueta="Retenciones soportadas nominales"
            formato={FORMATO_ENTERO}
            onChange={fijarRetencionesSoportadasEuros}
            paso={250}
            valor={retencionesSoportadasEuros}
          />
          <div className="grid gap-1.5">
            <div className="flex min-h-8 items-end gap-1.5">
              <span className="text-sm leading-tight font-bold">
                Pagos a cuenta
              </span>
              <Tooltip contenido={AYUDAS_FORMULARIO["Pagos a cuenta"]}>
                <Button
                  aria-label="Ayuda sobre pagos a cuenta"
                  className="mb-0.5 text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  type="button"
                  variant="unstyled"
                >
                  <FileText aria-hidden className="size-3.5" />
                </Button>
              </Tooltip>
            </div>
            <Button
              className="grid h-8 w-full grid-cols-[1.75rem_minmax(0,1fr)_1.75rem] items-center border border-[var(--rule)] bg-[var(--paper-2)] px-2 text-sm font-[var(--mono)] font-bold text-[var(--ink)] tabular-nums hover:bg-[var(--paper)] focus-visible:ring-2 focus-visible:ring-[var(--mark)] focus-visible:outline-none"
              onClick={() => fijarDialogoPagosACuentaAbierto(true)}
              type="button"
              variant="unstyled"
            >
              <span className="col-start-2 min-w-0 justify-self-center truncate">
                {usarRetencionAeat
                  ? "Retención estimada"
                  : formatearEuros(eurosACentimos(pagosACuentaEuros))}
              </span>
              <FileText
                aria-hidden
                className="col-start-3 size-4 justify-self-end opacity-70"
              />
            </Button>
          </div>
        </div>
      </div>

      <DialogoPagosACuentaRetenciones
        abierto={dialogoPagosACuentaAbierto}
        activarRetencionAeat={activarRetencionAeat}
        actualizarEntradaRetencionAeat={actualizarEntradaRetencionAeat}
        entradasRetencionAeat={entradasRetencionAeat}
        fijarAbierto={fijarDialogoPagosACuentaAbierto}
        fijarPagosACuentaEuros={fijarPagosACuentaEuros}
        pagosACuentaEuros={pagosACuentaEuros}
        usarRetencionAeat={usarRetencionAeat}
      />

      <Dialog.Root
        open={catalogoDeduccionesAbierto && usaComunidadAutonomicaReal}
        onOpenChange={(abierto) => fijarCatalogoDeduccionesAbierto(abierto)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/35 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
            <Dialog.Popup className="relative max-h-[80vh] w-full max-w-2xl overflow-auto border border-[var(--rule)] bg-[var(--paper)] p-4 text-[var(--ink)] shadow-[6px_6px_0_var(--rule)] transition-[opacity,translate] duration-150 outline-none data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)] uppercase">
                    Deducciones autonómicas
                  </p>
                  <Dialog.Title className="mt-1 text-xl font-bold">
                    {catalogoDeducciones?.comunidad ?? comunidadAutonoma}
                  </Dialog.Title>
                </div>
                <Dialog.Close className="border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-1 text-sm font-bold hover:bg-[var(--paper)]">
                  Cerrar
                </Dialog.Close>
              </div>
              <Dialog.Description className="mt-3 block text-sm leading-6 text-[var(--ink-soft)]">
                {catalogoDeduccionesVacio
                  ? "La Parte 2 del manual práctico de la renta no lista deducciones autonómicas para esta ciudad."
                  : "Estas deducciones existen en el manual. Las fichas implementadas debajo actualizan la deducción agregada del formulario; el importe agregado queda marcado en el rastro."}
              </Dialog.Description>
              {catalogoDeduccionesVacio ? (
                <div className="mt-4 border border-dashed border-[var(--rule)] bg-[var(--paper-2)] p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-[var(--ink-soft)]"
                    />
                    <div>
                      <p className="font-bold">
                        Sin deducciones autonómicas en este catálogo
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                        Ceuta y Melilla mantienen reglas estatales y
                        territoriales específicas, pero no aportan fichas a este
                        catálogo autonómico.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {deduccionesCatalogadas.map((deduccion) => (
                    <li
                      className="border border-[var(--rule)] bg-[var(--paper-2)] p-3"
                      key={deduccion.codigo}
                    >
                      <p className="font-bold">{deduccion.nombre}</p>
                      <p className="mt-1 text-xs break-all text-[var(--ink-soft)]">
                        {deduccion.codigo}
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        {describirCuantiaDeduccion(deduccion.cuantia)}
                      </p>
                      <p className="mt-2 text-xs font-bold text-[var(--ink-soft)]">
                        {describirEstadoDeduccion(deduccion)}
                      </p>
                      {deduccion.requisitos.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-xs font-bold uppercase">
                            Requisitos
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-5 text-[var(--ink-soft)]">
                            {deduccion.requisitos.map((requisito) => (
                              <li key={requisito}>{requisito}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {deduccion.limites.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-xs font-bold uppercase">Límites</p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-5 text-[var(--ink-soft)]">
                            {deduccion.limites.map((limite) => (
                              <li key={limite}>{limite}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <ControlesDeduccionAutonomica
                        deduccion={deduccion}
                        entradas={entradasDeduccionesAutonomicas}
                        fijarEntradas={fijarEntradasDeduccionesAutonomicas}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <NumberField
          compacto
          etiqueta="Edad"
          formato={FORMATO_ENTERO}
          max={120}
          min={18}
          onChange={fijarEdad}
          valor={edad}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Ascendientes"]}
          compacto
          etiqueta="Ascendientes"
          formato={FORMATO_ENTERO}
          max={12}
          onChange={fijarAscendientes}
          valor={ascendientes}
        />
        <fieldset className="min-w-0 border border-[var(--rule)] px-2 pt-1 pb-2 sm:col-span-2">
          <legend className="px-1">
            <span className="inline-flex items-center gap-1.5 text-sm leading-tight font-bold">
              Descendientes
              <Tooltip contenido={AYUDAS_FORMULARIO["Requisitos descendientes"]}>
                <Button
                  aria-label="Requisitos para contar descendientes"
                  className="text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  type="button"
                  variant="unstyled"
                >
                  <CircleHelp aria-hidden className="size-3.5" />
                </Button>
              </Tooltip>
            </span>
          </legend>
          <div className="grid gap-2 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Descendientes"]}
              compacto
              etiqueta="Total"
              formato={FORMATO_ENTERO}
              max={8}
              onChange={(valor) => {
                const siguientesDiscapacidad65 = Math.min(
                  descendientesDiscapacidad65,
                  valor
                )
                const siguientesDiscapacidad33a64 = Math.min(
                  descendientesDiscapacidad33a64,
                  valor - siguientesDiscapacidad65
                )

                fijarDescendientes(valor)
                fijarDescendientesConDiscapacidad(
                  siguientesDiscapacidad65 + siguientesDiscapacidad33a64
                )
                fijarDescendientesDiscapacidad65(siguientesDiscapacidad65)
                fijarDescendientesConAsistencia(
                  Math.min(
                    descendientesConAsistencia,
                    siguientesDiscapacidad33a64
                  )
                )
              }}
              valor={descendientes}
            />
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Descendientes con discapacidad"]}
              compacto
              etiqueta="33%-64%"
              formato={FORMATO_ENTERO}
              max={Math.max(0, descendientes - descendientesDiscapacidad65)}
              onChange={(valor) => {
                fijarDescendientesConDiscapacidad(
                  descendientesDiscapacidad65 + valor
                )
                fijarDescendientesConAsistencia(
                  Math.min(descendientesConAsistencia, valor)
                )
              }}
              valor={descendientesDiscapacidad33a64}
            />
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Descendientes discapacidad 65%"]}
              compacto
              etiqueta="≥65%"
              formato={FORMATO_ENTERO}
              max={descendientes}
              onChange={(valor) => {
                const siguientesDiscapacidad33a64 = Math.min(
                  descendientesDiscapacidad33a64,
                  descendientes - valor
                )

                fijarDescendientesDiscapacidad65(valor)
                fijarDescendientesConDiscapacidad(
                  valor + siguientesDiscapacidad33a64
                )
                fijarDescendientesConAsistencia(
                  Math.min(
                    descendientesConAsistencia,
                    siguientesDiscapacidad33a64
                  )
                )
              }}
              valor={descendientesDiscapacidad65}
            />
            <NumberField
              ayuda={AYUDAS_FORMULARIO["Descendientes con asistencia"]}
              compacto
              etiqueta="Ayuda"
              formato={FORMATO_ENTERO}
              max={descendientesDiscapacidad33a64}
              onChange={fijarDescendientesConAsistencia}
              valor={descendientesConAsistencia}
            />
          </div>
        </fieldset>
      </div>

      <div className="mt-3">
        <Select
          compacto
          etiqueta="Comunidad autónoma"
          onChange={fijarComunidadAutonoma}
          opciones={OPCIONES_COMUNIDAD_AUTONOMA}
          valor={comunidadAutonoma}
        />
        <div
          aria-hidden={!usaComunidadAutonomicaReal}
          inert={!usaComunidadAutonomicaReal}
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out motion-reduce:transition-none",
            usaComunidadAutonomicaReal
              ? "mt-2 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,12rem)]">
              <NumberField
                ayuda={AYUDAS_FORMULARIO["Deducciones autonómicas"]}
                compacto
                etiqueta="Deducción agregada"
                formato={FORMATO_ENTERO}
                onChange={(valor) =>
                  fijarDeduccionAutonomicaManualEuros(
                    Math.max(0, valor - deduccionesAutonomicasAplicadasEuros)
                  )
                }
                paso={100}
                valor={deduccionesAutonomicasEuros}
              />
              <div className="grid gap-1.5">
                <div className="flex min-h-8 items-end">
                  <p className="text-sm leading-tight font-bold">
                    Deducciones autonómicas
                  </p>
                </div>
                <Button
                  className="h-8 w-full border border-[var(--rule)] bg-[var(--paper-2)] px-3 text-left text-sm font-bold hover:bg-[var(--paper)]"
                  onClick={() => fijarCatalogoDeduccionesAbierto(true)}
                  type="button"
                  variant="unstyled"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ControlesDeduccionAutonomica({
  deduccion,
  entradas,
  fijarEntradas,
}: {
  readonly deduccion: FichaDeduccionAutonomica
  readonly entradas: EntradasDeduccionesAutonomicas
  readonly fijarEntradas: React.Dispatch<
    React.SetStateAction<EntradasDeduccionesAutonomicas>
  >
}) {
  const { codigo } = deduccion
  const actualizar = (clave: string, valor: boolean | number | string) =>
    fijarEntradas((actual) => ({ ...actual, [clave]: valor }))
  const campoNumero = (
    clave: string,
    etiqueta: string,
    opciones?: { readonly euros?: boolean; readonly paso?: number }
  ) => {
    const propiedadesPaso =
      opciones?.paso === undefined ? {} : { paso: opciones.paso }

    return (
      <NumberField
        compacto
        etiqueta={etiqueta}
        formato={opciones?.euros === true ? FORMATO_EUROS : FORMATO_ENTERO}
        onChange={(valor) => actualizar(clave, valor)}
        valor={numeroDeduccion(entradas, clave)}
        {...propiedadesPaso}
      />
    )
  }
  const campoCheckbox = (clave: string, etiqueta: string) => (
    <Checkbox
      checked={booleanoDeduccion(entradas, clave)}
      etiqueta={etiqueta}
      onCheckedChange={(checked) => actualizar(clave, checked)}
    />
  )

  if (codigo === "andalucia_nacimiento_adopcion_acogimiento_menores") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          compacto
          etiqueta="Hijos nacidos/adoptados"
          formato={FORMATO_ENTERO}
          onChange={(valor) =>
            actualizar("andaluciaHijosNacimientoAdopcion", valor)
          }
          valor={numeroDeduccion(entradas, "andaluciaHijosNacimientoAdopcion")}
        />
        <NumberField
          compacto
          etiqueta="Menores acogidos"
          formato={FORMATO_ENTERO}
          onChange={(valor) => actualizar("andaluciaMenoresAcogidos", valor)}
          valor={numeroDeduccion(entradas, "andaluciaMenoresAcogidos")}
        />
        <div className="sm:col-span-2">
          <Checkbox
            checked={booleanoDeduccion(
              entradas,
              "andaluciaMunicipioDespoblacion"
            )}
            etiqueta="Reside en municipio con problemas de despoblación"
            onCheckedChange={(checked) =>
              actualizar("andaluciaMunicipioDespoblacion", checked)
            }
          />
        </div>
      </div>
    )
  }

  if (codigo === "andalucia_familia_monoparental_ascendientes_mayores_75") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Checkbox
            checked={booleanoDeduccion(
              entradas,
              "andaluciaFamiliaMonoparental"
            )}
            etiqueta="Familia monoparental"
            onCheckedChange={(checked) =>
              actualizar("andaluciaFamiliaMonoparental", checked)
            }
          />
        </div>
        <NumberField
          compacto
          etiqueta="Ascendientes mayores de 75"
          formato={FORMATO_ENTERO}
          onChange={(valor) =>
            actualizar("andaluciaAscendientesMayores75", valor)
          }
          valor={numeroDeduccion(entradas, "andaluciaAscendientesMayores75")}
        />
      </div>
    )
  }

  if (codigo === "andalucia_adopcion_internacional") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("andaluciaHijosAdopcionInternacional", "Hijos adoptados")}
        <div className="grid gap-2 sm:col-span-2">
          {campoCheckbox(
            "andaluciaAdopcionInternacionalCumpleLimites",
            "Cumple límites de base"
          )}
          {campoCheckbox(
            "andaluciaAdopcionInternacionalProrrateada",
            "Prorratear entre dos contribuyentes"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "andalucia_familia_numerosa") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Select
          compacto
          etiqueta="Categoría"
          onChange={(valor) =>
            actualizar("andaluciaCategoriaFamiliaNumerosa", valor)
          }
          opciones={OPCIONES_CATEGORIA_FAMILIA_NUMEROSA}
          valor={textoDeduccion(entradas, "andaluciaCategoriaFamiliaNumerosa")}
        />
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "andaluciaFamiliaNumerosaCumpleLimites",
            "Cumple límites de base"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "andalucia_contribuyente_discapacidad") {
    return (
      <div className="mt-3 grid gap-2">
        {campoCheckbox(
          "andaluciaContribuyenteDiscapacidad",
          "Discapacidad del contribuyente ≥33%"
        )}
        {campoCheckbox(
          "andaluciaContribuyenteDiscapacidadCumpleLimites",
          "Cumple límites de base"
        )}
      </div>
    )
  }

  if (codigo === "andalucia_conyuge_pareja_discapacidad") {
    return (
      <div className="mt-3 grid gap-2">
        {campoCheckbox(
          "andaluciaConyugeParejaDiscapacidad65",
          "Cónyuge o pareja con discapacidad ≥65%"
        )}
        {campoCheckbox(
          "andaluciaConyugeParejaDiscapacidadCumpleRequisitos",
          "Cumple límites, inscripción y no declaración individual"
        )}
      </div>
    )
  }

  if (codigo === "andalucia_asistencia_personas_discapacidad") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero(
          "andaluciaPersonasDiscapacidadConMinimo",
          "Personas con mínimo"
        )}
        {campoNumero("andaluciaCuotasHogarDiscapacidad", "Cuotas hogar", {
          euros: true,
          paso: 100,
        })}
        <div className="grid gap-2 sm:col-span-2">
          {campoCheckbox(
            "andaluciaAsistenciaDiscapacidadCumpleLimites",
            "Cumple límites de base"
          )}
          {campoCheckbox(
            "andaluciaAsistenciaTercerasPersonas",
            "Precisa ayuda de terceras personas"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "andalucia_ayuda_domestica") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("andaluciaCuotasAyudaDomestica", "Cuotas empleador", {
          euros: true,
          paso: 100,
        })}
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "andaluciaAyudaDomesticaCumpleRequisitos",
            "Cumple requisitos"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "andalucia_inversion_acciones_participaciones_mercantiles") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("andaluciaInversionAccionesImporte", "Importe invertido", {
          euros: true,
          paso: 500,
        })}
        <Select
          compacto
          etiqueta="Régimen"
          onChange={(valor) =>
            actualizar("andaluciaInversionAccionesRegimen", valor)
          }
          opciones={OPCIONES_REGIMEN_INVERSION_ANDALUCIA}
          valor={textoDeduccion(entradas, "andaluciaInversionAccionesRegimen")}
        />
        <div className="sm:col-span-2">
          {campoCheckbox(
            "andaluciaInversionAccionesCumpleRequisitos",
            "Cumple forma jurídica, participación y mantenimiento"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "aragon_nacimiento_adopcion_tercer_hijo_sucesivos") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("aragonTercerHijoSucesivos", "Terceros o sucesivos")}
        <div className="grid gap-2">
          {campoCheckbox(
            "aragonTercerHijoFiscalidadDiferenciada",
            "Fiscalidad diferenciada"
          )}
          {campoCheckbox("aragonTercerHijoBaseReducida", "Base reducida")}
        </div>
      </div>
    )
  }

  if (codigo === "aragon_cuidado_personas_dependientes") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("aragonPersonasDependientes", "Personas dependientes")}
        <div className="grid gap-2">
          {campoCheckbox(
            "aragonDependientesFiscalidadDiferenciada",
            "Fiscalidad diferenciada"
          )}
          {campoCheckbox(
            "aragonDependientesCumpleLimites",
            "Cumple límites y convivencia"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "aragon_mayores_70") {
    return (
      <div className="mt-3">
        {campoCheckbox("aragonMayor70CumpleRequisitos", "Cumple requisitos")}
      </div>
    )
  }

  if (codigo === "canarias_nacimiento_adopcion_hijos") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Select
          compacto
          etiqueta="Orden del hijo"
          onChange={(valor) =>
            actualizar("canariasOrdenHijoNacimientoAdopcion", valor)
          }
          opciones={OPCIONES_ORDEN_HIJO_CANARIAS}
          valor={textoDeduccion(
            entradas,
            "canariasOrdenHijoNacimientoAdopcion"
          )}
        />
        {campoNumero("canariasHijosNacimientoAdopcion", "Hijos")}
        {campoNumero(
          "canariasHijosNacimientoAdopcionDiscapacidad65",
          "Hijos discapacidad ≥65%"
        )}
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "canariasNacimientoCumpleLimites",
            "Cumple límites de base"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "canarias_discapacidad_mayores_65") {
    return (
      <div className="mt-3 grid gap-2">
        {campoCheckbox(
          "canariasContribuyenteDiscapacidad33",
          "Discapacidad ≥33%"
        )}
        {campoCheckbox("canariasContribuyenteMayor65", "Mayor de 65 años")}
        {campoCheckbox(
          "canariasDiscapacidadMayoresCumpleLimites",
          "Cumple límites de base"
        )}
      </div>
    )
  }

  if (codigo === "canarias_familia_numerosa") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Select
          compacto
          etiqueta="Categoría"
          onChange={(valor) =>
            actualizar("canariasCategoriaFamiliaNumerosa", valor)
          }
          opciones={OPCIONES_CATEGORIA_FAMILIA_NUMEROSA}
          valor={textoDeduccion(entradas, "canariasCategoriaFamiliaNumerosa")}
        />
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "canariasFamiliaNumerosaDiscapacidad65",
            "Discapacidad ≥65% en cónyuge o descendiente"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "canarias_contribuyentes_desempleados") {
    return (
      <div className="mt-3">
        {campoCheckbox(
          "canariasDesempleadoCumpleRequisitos",
          "Cumple desempleo, rendimientos y bases"
        )}
      </div>
    )
  }

  if (codigo === "clm_nacimiento_adopcion_hijos") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("clmPartosAdopcionesUnHijo", "Partos/adop. 1 hijo")}
        {campoNumero("clmPartosAdopcionesDosHijos", "Partos/adop. 2 hijos")}
        {campoNumero("clmPartosAdopcionesTresOMas", "Partos/adop. 3+ hijos")}
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "clmNacimientoCumpleLimites",
            "Cumple límites de base"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "clm_familia_numerosa") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Select
          compacto
          etiqueta="Categoría"
          onChange={(valor) => actualizar("clmCategoriaFamiliaNumerosa", valor)}
          opciones={OPCIONES_CATEGORIA_FAMILIA_NUMEROSA}
          valor={textoDeduccion(entradas, "clmCategoriaFamiliaNumerosa")}
        />
        <div className="grid gap-2">
          {campoCheckbox(
            "clmFamiliaNumerosaDiscapacidad65",
            "Discapacidad ≥65%"
          )}
          {campoCheckbox(
            "clmFamiliaNumerosaCumpleLimites",
            "Cumple límites de base"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "clm_discapacidad_contribuyente") {
    return (
      <div className="mt-3 grid gap-2">
        {campoCheckbox(
          "clmContribuyenteDiscapacidad65",
          "Discapacidad del contribuyente ≥65%"
        )}
        {campoCheckbox(
          "clmDiscapacidadContribuyenteCumpleLimites",
          "Cumple límites de base"
        )}
      </div>
    )
  }

  if (codigo === "clm_discapacidad_ascendientes_descendientes") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero(
          "clmAscDescDiscapacidad65",
          "Asc./desc. discapacidad ≥65%"
        )}
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "clmAscDescDiscapacidadCumpleLimites",
            "Cumple límites de base"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "madrid_nacimiento_adopcion_hijos") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          compacto
          etiqueta="Hijos nacidos/adoptados"
          formato={FORMATO_ENTERO}
          onChange={(valor) =>
            actualizar("madridHijosNacimientoAdopcion", valor)
          }
          valor={numeroDeduccion(entradas, "madridHijosNacimientoAdopcion")}
        />
        <div className="flex items-end pb-1">
          <Checkbox
            checked={booleanoDeduccion(
              entradas,
              "madridProrrateoDosProgenitores"
            )}
            etiqueta="Prorratear entre dos progenitores"
            onCheckedChange={(checked) =>
              actualizar("madridProrrateoDosProgenitores", checked)
            }
          />
        </div>
      </div>
    )
  }

  if (codigo === "cataluna_alquiler_victimas_violencia_machista") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          compacto
          etiqueta="Alquiler pagado"
          formato={FORMATO_EUROS}
          onChange={(valor) => actualizar("catalunyaAlquilerVictima", valor)}
          paso={100}
          valor={numeroDeduccion(entradas, "catalunyaAlquilerVictima")}
        />
        <div className="grid gap-2">
          <Checkbox
            checked={booleanoDeduccion(
              entradas,
              "catalunyaVictimaViolenciaMachista"
            )}
            etiqueta="Víctima de violencia machista"
            onCheckedChange={(checked) =>
              actualizar("catalunyaVictimaViolenciaMachista", checked)
            }
          />
          <Checkbox
            checked={booleanoDeduccion(
              entradas,
              "catalunyaAlquilerIncrementado"
            )}
            etiqueta="Discapacidad ≥65% o hijo menor a cargo"
            onCheckedChange={(checked) =>
              actualizar("catalunyaAlquilerIncrementado", checked)
            }
          />
        </div>
      </div>
    )
  }

  if (codigo === "cataluna_viudedad_2023_2024_2025") {
    return (
      <div className="mt-3 grid gap-2">
        {campoCheckbox("catalunyaViudedad", "Viudedad 2023, 2024 o 2025")}
        {campoCheckbox(
          "catalunyaViudedadConDescendientes",
          "Con descendientes con derecho al mínimo"
        )}
      </div>
    )
  }

  if (codigo === "cataluna_rehabilitacion_vivienda_habitual") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero(
          "catalunyaRehabilitacionVivienda",
          "Importe rehabilitación",
          {
            euros: true,
            paso: 500,
          }
        )}
      </div>
    )
  }

  if (codigo === "cataluna_intereses_prestamos_master_doctorado") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("catalunyaInteresesMasterDoctorado", "Intereses pagados", {
          euros: true,
          paso: 100,
        })}
      </div>
    )
  }

  if (codigo === "cataluna_inversion_cooperativas_agrarias_vivienda") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          compacto
          etiqueta="Aportaciones de capital"
          formato={FORMATO_EUROS}
          onChange={(valor) =>
            actualizar("catalunyaAportacionesCooperativas", valor)
          }
          paso={100}
          valor={numeroDeduccion(entradas, "catalunyaAportacionesCooperativas")}
        />
      </div>
    )
  }

  if (deduccion.estado === "implementada") {
    const claveBase = `${deduccion.codigo}:base`
    const claveImporte = `${deduccion.codigo}:importe`
    const claveUnidades = `${deduccion.codigo}:unidades`
    const claveCumple = `${deduccion.codigo}:cumple`

    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {deduccion.cuantia.tipo === "importe_fijo"
          ? campoNumero(claveUnidades, "Unidades/personas")
          : deduccion.cuantia.tipo === "porcentaje"
            ? campoNumero(claveBase, "Base de deducción", {
                euros: true,
                paso: 100,
              })
            : campoNumero(claveImporte, "Importe calculado", {
                euros: true,
                paso: 100,
              })}
        <div className="flex items-end pb-1">
          {campoCheckbox(claveCumple, "Cumple requisitos y límites")}
        </div>
      </div>
    )
  }

  return (
    <p className="mt-3 border-l-4 border-[var(--rule)] pl-3 text-xs leading-5 text-[var(--ink-soft)]">
      Esta deducción está reconocida, pero todavía no está convertida en campos
      y fórmula revisada. No se suma automáticamente a la deducción agregada.
    </p>
  )
}

function DialogoPagosACuentaRetenciones({
  abierto,
  activarRetencionAeat,
  actualizarEntradaRetencionAeat,
  entradasRetencionAeat,
  fijarAbierto,
  fijarPagosACuentaEuros,
  pagosACuentaEuros,
  usarRetencionAeat,
}: {
  readonly abierto: boolean
  readonly activarRetencionAeat: (activo: boolean) => void
  readonly actualizarEntradaRetencionAeat: <
    TClave extends keyof EntradasRetencionAeat,
  >(
    clave: TClave,
    valor: EntradasRetencionAeat[TClave]
  ) => void
  readonly entradasRetencionAeat: EntradasRetencionAeat
  readonly fijarAbierto: (abierto: boolean) => void
  readonly fijarPagosACuentaEuros: (valor: number) => void
  readonly pagosACuentaEuros: number
  readonly usarRetencionAeat: boolean
}) {
  const maxDescendientesDiscapacidad33a64 = Math.max(
    0,
    entradasRetencionAeat.descendientes -
      entradasRetencionAeat.descendientesDiscapacidad65
  )
  const maxAscendientesDiscapacidad33a64 = Math.max(
    0,
    entradasRetencionAeat.ascendientes -
      entradasRetencionAeat.ascendientesDiscapacidad65
  )
  const fijarDescendientesRetencion = (valor: number) => {
    const discapacidad65 = Math.min(
      entradasRetencionAeat.descendientesDiscapacidad65,
      valor
    )
    const discapacidad33a64 = Math.min(
      entradasRetencionAeat.descendientesDiscapacidad33a64,
      Math.max(0, valor - discapacidad65)
    )
    actualizarEntradaRetencionAeat("descendientes", valor)
    actualizarEntradaRetencionAeat(
      "descendientesMenoresTres",
      Math.min(entradasRetencionAeat.descendientesMenoresTres, valor)
    )
    actualizarEntradaRetencionAeat(
      "descendientesComputoEntero",
      Math.min(entradasRetencionAeat.descendientesComputoEntero, valor)
    )
    actualizarEntradaRetencionAeat(
      "descendientesDiscapacidad65",
      discapacidad65
    )
    actualizarEntradaRetencionAeat(
      "descendientesDiscapacidad33a64",
      discapacidad33a64
    )
    actualizarEntradaRetencionAeat(
      "descendientesMovilidadReducida",
      Math.min(
        entradasRetencionAeat.descendientesMovilidadReducida,
        discapacidad33a64
      )
    )
  }
  const fijarAscendientesRetencion = (valor: number) => {
    const discapacidad65 = Math.min(
      entradasRetencionAeat.ascendientesDiscapacidad65,
      valor
    )
    const discapacidad33a64 = Math.min(
      entradasRetencionAeat.ascendientesDiscapacidad33a64,
      Math.max(0, valor - discapacidad65)
    )
    actualizarEntradaRetencionAeat("ascendientes", valor)
    actualizarEntradaRetencionAeat(
      "ascendientesMayores75",
      Math.min(entradasRetencionAeat.ascendientesMayores75, valor)
    )
    actualizarEntradaRetencionAeat(
      "ascendientesComputoEntero",
      Math.min(entradasRetencionAeat.ascendientesComputoEntero, valor)
    )
    actualizarEntradaRetencionAeat("ascendientesDiscapacidad65", discapacidad65)
    actualizarEntradaRetencionAeat(
      "ascendientesDiscapacidad33a64",
      discapacidad33a64
    )
    actualizarEntradaRetencionAeat(
      "ascendientesMovilidadReducida",
      Math.min(
        entradasRetencionAeat.ascendientesMovilidadReducida,
        discapacidad33a64
      )
    )
  }

  return (
    <Dialog.Root open={abierto} onOpenChange={fijarAbierto}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/35 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
          <Dialog.Popup className="relative grid max-h-[90svh] w-full max-w-2xl gap-4 overflow-auto border border-[var(--rule)] bg-[var(--paper)] p-5 text-[var(--ink)] shadow-[6px_6px_0_var(--rule)] transition-[opacity,translate] duration-150 outline-none data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)] uppercase">
                  Pagos a cuenta
                </p>
                <Dialog.Title className="mt-1 text-xl font-bold">
                  Retenciones y pagos anticipados
                </Dialog.Title>
              </div>
              <Dialog.Close className="border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-1 text-sm font-bold hover:bg-[var(--paper)]">
                Cerrar
              </Dialog.Close>
            </div>
            <Dialog.Description className="text-sm leading-6 text-[var(--ink-soft)]">
              Introduce un importe manual o estima la retención de trabajo. Los
              importes son euros nominales de 2025.
            </Dialog.Description>

            <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,15rem)]">
              <NumberField
                ayuda="Importe total ya ingresado que quieres restar sin estimarlo automáticamente."
                disabled={usarRetencionAeat}
                etiqueta="Pagos a cuenta"
                formato={FORMATO_ENTERO}
                onChange={fijarPagosACuentaEuros}
                paso={250}
                valor={pagosACuentaEuros}
              />
              <Switch
                checked={usarRetencionAeat}
                etiqueta="Estimar retención"
                onCheckedChange={activarRetencionAeat}
              />
            </div>

            {usarRetencionAeat ? (
              <div className="grid gap-5">
                <section className="grid gap-3 border-t border-[var(--rule)] pt-4">
                  <h3 className="text-sm font-bold tracking-[0.14em] uppercase">
                    1. Trabajo
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <NumberField
                      etiqueta="Retribuciones anuales nominales"
                      formato={FORMATO_ENTERO}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "retribucionAnualEuros",
                          valor
                        )
                      }
                      paso={500}
                      valor={entradasRetencionAeat.retribucionAnualEuros}
                    />
                    <NumberField
                      etiqueta="Cotizaciones deducibles nominales"
                      formato={FORMATO_ENTERO}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "cotizacionesEuros",
                          valor
                        )
                      }
                      paso={100}
                      valor={entradasRetencionAeat.cotizacionesEuros}
                    />
                    <Select
                      etiqueta="Situación laboral"
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "situacionLaboral",
                          valor
                        )
                      }
                      opciones={OPCIONES_SITUACION_LABORAL_RETENCION}
                      valor={entradasRetencionAeat.situacionLaboral}
                    />
                    <Select
                      etiqueta="Contrato"
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat("contrato", valor)
                      }
                      opciones={OPCIONES_CONTRATO_RETENCION}
                      valor={entradasRetencionAeat.contrato}
                    />
                  </div>
                </section>

                <section className="grid gap-3 border-t border-[var(--rule)] pt-4">
                  <h3 className="text-sm font-bold tracking-[0.14em] uppercase">
                    2. Persona y familia
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select
                      etiqueta="Situación familiar"
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "situacionFamiliar",
                          valor
                        )
                      }
                      opciones={OPCIONES_SITUACION_FAMILIAR_RETENCION}
                      valor={entradasRetencionAeat.situacionFamiliar}
                    />
                    <Select
                      etiqueta="Discapacidad perceptor"
                      onChange={(valor) => {
                        actualizarEntradaRetencionAeat("discapacidad", valor)
                        if (valor !== "de33a65") {
                          actualizarEntradaRetencionAeat(
                            "movilidadReducidaPerceptor",
                            false
                          )
                        }
                      }}
                      opciones={OPCIONES_DISCAPACIDAD_RETENCION}
                      valor={entradasRetencionAeat.discapacidad}
                    />
                    <div className="flex items-end pb-1">
                      <Checkbox
                        checked={
                          entradasRetencionAeat.movilidadReducidaPerceptor
                        }
                        etiqueta="Ayuda o movilidad perceptor"
                        onCheckedChange={(checked) =>
                          actualizarEntradaRetencionAeat(
                            "movilidadReducidaPerceptor",
                            checked
                          )
                        }
                      />
                    </div>
                    <NumberField
                      etiqueta="Descendientes"
                      formato={FORMATO_ENTERO}
                      max={16}
                      onChange={fijarDescendientesRetencion}
                      valor={entradasRetencionAeat.descendientes}
                    />
                    <NumberField
                      etiqueta="Menores de 3 años"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.descendientes}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "descendientesMenoresTres",
                          valor
                        )
                      }
                      valor={entradasRetencionAeat.descendientesMenoresTres}
                    />
                    <NumberField
                      etiqueta="Desc. por entero"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.descendientes}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "descendientesComputoEntero",
                          valor
                        )
                      }
                      valor={entradasRetencionAeat.descendientesComputoEntero}
                    />
                    <NumberField
                      etiqueta="Desc. disc. 33-64%"
                      formato={FORMATO_ENTERO}
                      max={maxDescendientesDiscapacidad33a64}
                      onChange={(valor) => {
                        actualizarEntradaRetencionAeat(
                          "descendientesDiscapacidad33a64",
                          valor
                        )
                        actualizarEntradaRetencionAeat(
                          "descendientesMovilidadReducida",
                          Math.min(
                            entradasRetencionAeat.descendientesMovilidadReducida,
                            valor
                          )
                        )
                      }}
                      valor={
                        entradasRetencionAeat.descendientesDiscapacidad33a64
                      }
                    />
                    <NumberField
                      etiqueta="Desc. disc. 65%+"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.descendientes}
                      onChange={(valor) => {
                        const discapacidad33a64 = Math.min(
                          entradasRetencionAeat.descendientesDiscapacidad33a64,
                          Math.max(
                            0,
                            entradasRetencionAeat.descendientes - valor
                          )
                        )
                        actualizarEntradaRetencionAeat(
                          "descendientesDiscapacidad65",
                          valor
                        )
                        actualizarEntradaRetencionAeat(
                          "descendientesDiscapacidad33a64",
                          discapacidad33a64
                        )
                        actualizarEntradaRetencionAeat(
                          "descendientesMovilidadReducida",
                          Math.min(
                            entradasRetencionAeat.descendientesMovilidadReducida,
                            discapacidad33a64
                          )
                        )
                      }}
                      valor={entradasRetencionAeat.descendientesDiscapacidad65}
                    />
                    <NumberField
                      etiqueta="Desc. movilidad reducida"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.descendientesDiscapacidad33a64}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "descendientesMovilidadReducida",
                          valor
                        )
                      }
                      valor={
                        entradasRetencionAeat.descendientesMovilidadReducida
                      }
                    />
                    <NumberField
                      etiqueta="Ascendientes"
                      formato={FORMATO_ENTERO}
                      max={6}
                      onChange={fijarAscendientesRetencion}
                      valor={entradasRetencionAeat.ascendientes}
                    />
                    <NumberField
                      etiqueta="Asc. mayores 75"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.ascendientes}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "ascendientesMayores75",
                          valor
                        )
                      }
                      valor={entradasRetencionAeat.ascendientesMayores75}
                    />
                    <NumberField
                      etiqueta="Asc. por entero"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.ascendientes}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "ascendientesComputoEntero",
                          valor
                        )
                      }
                      valor={entradasRetencionAeat.ascendientesComputoEntero}
                    />
                    <NumberField
                      etiqueta="Asc. disc. 33-64%"
                      formato={FORMATO_ENTERO}
                      max={maxAscendientesDiscapacidad33a64}
                      onChange={(valor) => {
                        actualizarEntradaRetencionAeat(
                          "ascendientesDiscapacidad33a64",
                          valor
                        )
                        actualizarEntradaRetencionAeat(
                          "ascendientesMovilidadReducida",
                          Math.min(
                            entradasRetencionAeat.ascendientesMovilidadReducida,
                            valor
                          )
                        )
                      }}
                      valor={
                        entradasRetencionAeat.ascendientesDiscapacidad33a64
                      }
                    />
                    <NumberField
                      etiqueta="Asc. disc. 65%+"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.ascendientes}
                      onChange={(valor) => {
                        const discapacidad33a64 = Math.min(
                          entradasRetencionAeat.ascendientesDiscapacidad33a64,
                          Math.max(
                            0,
                            entradasRetencionAeat.ascendientes - valor
                          )
                        )
                        actualizarEntradaRetencionAeat(
                          "ascendientesDiscapacidad65",
                          valor
                        )
                        actualizarEntradaRetencionAeat(
                          "ascendientesDiscapacidad33a64",
                          discapacidad33a64
                        )
                        actualizarEntradaRetencionAeat(
                          "ascendientesMovilidadReducida",
                          Math.min(
                            entradasRetencionAeat.ascendientesMovilidadReducida,
                            discapacidad33a64
                          )
                        )
                      }}
                      valor={entradasRetencionAeat.ascendientesDiscapacidad65}
                    />
                    <NumberField
                      etiqueta="Asc. movilidad reducida"
                      formato={FORMATO_ENTERO}
                      max={entradasRetencionAeat.ascendientesDiscapacidad33a64}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "ascendientesMovilidadReducida",
                          valor
                        )
                      }
                      valor={
                        entradasRetencionAeat.ascendientesMovilidadReducida
                      }
                    />
                  </div>
                </section>

                <section className="grid gap-3 border-t border-[var(--rule)] pt-4">
                  <h3 className="text-sm font-bold tracking-[0.14em] uppercase">
                    3. Ajustes comunicados
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <NumberField
                      etiqueta="Reducción irregular art. 18.2"
                      formato={FORMATO_ENTERO}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat("irregular1Euros", valor)
                      }
                      paso={500}
                      valor={entradasRetencionAeat.irregular1Euros}
                    />
                    <NumberField
                      etiqueta="Otras reducciones irregulares"
                      formato={FORMATO_ENTERO}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat("irregular2Euros", valor)
                      }
                      paso={500}
                      valor={entradasRetencionAeat.irregular2Euros}
                    />
                    <NumberField
                      etiqueta="Pensión compensatoria"
                      formato={FORMATO_ENTERO}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "pensionCompensatoriaConyugeEuros",
                          valor
                        )
                      }
                      paso={500}
                      valor={
                        entradasRetencionAeat.pensionCompensatoriaConyugeEuros
                      }
                    />
                    <NumberField
                      etiqueta="Anualidades alimentos"
                      formato={FORMATO_ENTERO}
                      onChange={(valor) =>
                        actualizarEntradaRetencionAeat(
                          "anualidadesAlimentosHijosEuros",
                          valor
                        )
                      }
                      paso={500}
                      valor={
                        entradasRetencionAeat.anualidadesAlimentosHijosEuros
                      }
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Checkbox
                      checked={entradasRetencionAeat.movilidadGeografica}
                      etiqueta="Movilidad geográfica"
                      onCheckedChange={(checked) =>
                        actualizarEntradaRetencionAeat(
                          "movilidadGeografica",
                          checked
                        )
                      }
                    />
                    <Checkbox
                      checked={entradasRetencionAeat.pagosViviendaHabitual}
                      etiqueta="Pagos vivienda habitual"
                      onCheckedChange={(checked) =>
                        actualizarEntradaRetencionAeat(
                          "pagosViviendaHabitual",
                          checked
                        )
                      }
                    />
                    <Checkbox
                      checked={entradasRetencionAeat.residenciaCeutaMelilla}
                      etiqueta="Residencia Ceuta/Melilla"
                      onCheckedChange={(checked) =>
                        actualizarEntradaRetencionAeat(
                          "residenciaCeutaMelilla",
                          checked
                        )
                      }
                    />
                    <Checkbox
                      checked={entradasRetencionAeat.rendimientosCeutaMelilla}
                      etiqueta="Rendimientos Ceuta/Melilla"
                      onCheckedChange={(checked) =>
                        actualizarEntradaRetencionAeat(
                          "rendimientosCeutaMelilla",
                          checked
                        )
                      }
                    />
                  </div>
                </section>
              </div>
            ) : null}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Resultado({
  resultado,
}: {
  readonly resultado: ResultadoLiquidacionIrpf
}) {
  const esNoSoportado = resultado._tag === "ResultadoNoSoportado"

  return (
    <section className="grid gap-5">
      <div
        className={cn(
          "border bg-[var(--paper)] p-4",
          esNoSoportado ? "border-[var(--danger)]" : "border-[var(--rule)]"
        )}
      >
        <div className="grid gap-4">
          <div className="grid gap-3">
            <p className="text-xs tracking-[0.12em] text-[var(--ink-soft)] uppercase">
              {esNoSoportado
                ? "Resultado no soportado"
                : "Liquidación calculada"}
            </p>
            <div className="flex items-start gap-3 rounded-md border border-[color-mix(in_oklab,var(--danger),var(--rule)_25%)] bg-[oklch(0.94_0.045_27)] p-3 text-[color-mix(in_oklab,var(--danger),var(--ink)_24%)]">
              <AlertTriangle
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
              />
              <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                Este resultado puede contener errores y discrepar de forma
                sustancial del cálculo real de la declaración; contrástalo con
                el rastro antes de usarlo.
              </p>
            </div>
          </div>
          {esNoSoportado ? (
            <div className="pl-8">
              <>
                <h2 className="text-xl font-bold">{resultado.motivo}</h2>
                <p className="mt-2 text-sm break-all text-[var(--ink-soft)]">
                  {resultado.fuenteReconocida}
                </p>
              </>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="rounded-md border border-[color-mix(in_oklab,var(--rule),transparent_72%)] bg-[oklch(0.94_0.045_105)] p-4">
                <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)] uppercase">
                  Resultado final
                </p>
                <EtiquetaConAyuda
                  ayuda={AYUDAS_RESUMEN["Cuota diferencial"]}
                  etiqueta="Cuota diferencial"
                />
                <p className="mt-1 text-5xl leading-none font-[var(--display)] tabular-nums">
                  {formatearEuros(resultado.cuotaDiferencialCentimos)}
                </p>
              </div>

              <GrupoResumen tono="verde" titulo="1 · Rendimiento del trabajo">
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Rendimientos del trabajo"]}
                  etiqueta="Rendimientos del trabajo"
                  signo="+"
                  valor={formatearEuros(
                    resultado.rendimientoIntegroTrabajoCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Cotización trabajador"]}
                  detalle={`Incluye ${formatearEuros(resultado.meiTrabajadorCentimos)} de MEI descontado al trabajador.`}
                  etiqueta="Cotización trabajador"
                  signo="-"
                  valor={formatearEuros(resultado.cotizacionTrabajadorCentimos)}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Gastos y reducciones del trabajo"]}
                  etiqueta="Gastos y reducciones del trabajo"
                  signo="-"
                  valor={formatearEuros(
                    resultado.totalGastosYDeduccionesTrabajoCentimos -
                      resultado.cotizacionTrabajadorCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Rendimiento neto del trabajo"]}
                  destacado
                  etiqueta="Rendimiento neto del trabajo"
                  signo="="
                  valor={formatearEuros(
                    resultado.rendimientoNetoTrabajoCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Coste laboral"]}
                  detalle={`Dato laboral complementario: incluye ${formatearEuros(resultado.cotizacionEmpresarialCentimos)} de cotización empresa, con ${formatearEuros(resultado.meiEmpresarialCentimos)} de MEI.`}
                  etiqueta="Coste laboral empresa"
                  valor={formatearEuros(resultado.costeLaboralCentimos)}
                />
              </GrupoResumen>

              <GrupoResumen tono="azul" titulo="2 · Base liquidable">
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Rendimiento neto del trabajo"]}
                  etiqueta="Rendimiento neto del trabajo"
                  signo="+"
                  valor={formatearEuros(
                    resultado.rendimientoNetoTrabajoCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Capital inmobiliario neto"]}
                  etiqueta="Capital inmobiliario neto"
                  signo="+"
                  valor={formatearEuros(
                    resultado.rendimientoNetoCapitalInmobiliarioCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Ganancia patrimonial exenta"]}
                  etiqueta="Ganancia patrimonial exenta"
                  valor={formatearEuros(
                    resultado.gananciaPatrimonialExentaCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Base liquidable"]}
                  destacado
                  etiqueta="Base liquidable general"
                  signo="="
                  valor={formatearEuros(
                    resultado.baseLiquidableGeneralCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Base ahorro"]}
                  etiqueta="Base del ahorro"
                  valor={formatearEuros(resultado.baseLiquidableAhorroCentimos)}
                />
              </GrupoResumen>

              <GrupoResumen tono="rosa" titulo="3 · Cuota y pagos">
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Base liquidable"]}
                  etiqueta="Cuota íntegra general"
                  signo="+"
                  valor={formatearEuros(resultado.cuotaIntegraGeneralCentimos)}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Base ahorro"]}
                  etiqueta="Cuota íntegra ahorro"
                  signo="+"
                  valor={formatearEuros(resultado.cuotaIntegraAhorroCentimos)}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Cuota líquida"]}
                  etiqueta="Mínimo personal y familiar"
                  signo="-"
                  valor={formatearEuros(
                    resultado.cuotaMinimoPersonalCentimos +
                      resultado.cuotaMinimoPersonalAhorroCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Cuota líquida"]}
                  destacado
                  etiqueta="Cuota líquida"
                  signo="="
                  valor={formatearEuros(resultado.cuotaLiquidaCentimos)}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Deducciones autonómicas"]}
                  detalle="Se aplican contra la parte autonómica disponible."
                  etiqueta="Deducciones autonómicas"
                  valor={formatearEuros(
                    resultado.deduccionesAutonomicasCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Retenciones/pagos a cuenta"]}
                  etiqueta="Retenciones y pagos a cuenta"
                  signo="-"
                  valor={formatearEuros(
                    resultado.retencionesYPagosACuentaCentimos
                  )}
                />
                <LineaResumen
                  ayuda={AYUDAS_RESUMEN["Cuota diferencial"]}
                  destacado
                  etiqueta="Cuota diferencial"
                  signo="="
                  valor={formatearEuros(resultado.cuotaDiferencialCentimos)}
                />
              </GrupoResumen>
              {Option.match(resultado.conciliacionSimuladorLegacy, {
                onNone: () => null,
                onSome: (conciliacion) => (
                  <ConciliacionSimuladorLegacyPanel
                    conciliacion={conciliacion}
                  />
                ),
              })}
            </div>
          )}
        </div>
      </div>

      <section className="border border-[var(--rule)] bg-[var(--paper)]">
        <header className="border-b border-[var(--rule)] p-4">
          <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            Rastro de cálculo
          </p>
          <h2 className="mt-1 text-2xl font-bold">{resultado.rastro.titulo}</h2>
        </header>
        <ol className="divide-y divide-[var(--rule)]">
          {resultado.rastro.pasos.map((paso, indice) => (
            <li className="grid gap-3 p-4 sm:grid-cols-[4rem_1fr]" key={indice}>
              <div className="text-4xl leading-none font-[var(--display)]">
                {(indice + 1).toString().padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-bold">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
                  {paso.descripcion}
                </p>
                {(paso.lineasCalculo?.length ?? 0) > 0 ? (
                  <dl className="mt-4 grid gap-2">
                    {paso.lineasCalculo?.map((linea) => (
                      <div
                        className="grid gap-2 border border-[var(--rule)] bg-[var(--paper-2)] p-3 md:grid-cols-[minmax(10rem,0.9fr)_minmax(14rem,1.4fr)_minmax(8rem,0.7fr)]"
                        key={`${paso.titulo}-${linea.etiqueta}`}
                      >
                        <dt className="text-xs font-bold">{linea.etiqueta}</dt>
                        <dd className="text-xs break-words text-[var(--ink-soft)]">
                          {linea.formula}
                        </dd>
                        <dd className="text-sm font-bold tabular-nums md:text-right">
                          {linea.resultado}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {paso.fuentes.length > 0 ? (
                  <ul className="mt-3 grid gap-2">
                    {paso.fuentes.map((fuente) => (
                      <li
                        className="border-l-4 border-[var(--rule)] pl-3 text-xs"
                        key={fuente.referencia}
                      >
                        <span className="font-bold">{fuente.titulo}</span>
                        <span className="block break-all text-[var(--ink-soft)]">
                          {fuente.referencia}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border border-[var(--rule)] bg-[var(--paper)] p-4">
        <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Revisión técnica
        </p>
        <h2 className="mt-1 text-xl font-bold">Reportar una discrepancia</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
          Si detectas un error, referencia esta ruta, el año fiscal, el tipo de
          resultado y los pasos del rastro de cálculo. El caso se puede
          reproducir con los importes visibles en el formulario y las fuentes
          enlazadas en cada paso.
        </p>
        <a
          className="mt-3 inline-block border-b border-current text-sm font-bold transition-colors hover:text-[var(--danger)] focus-visible:text-[var(--danger)] focus-visible:outline-none"
          href="https://github.com/eliesgalvira/IRoboPF/issues"
          rel="noreferrer"
          target="_blank"
        >
          Abrir incidencia en GitHub
        </a>
      </section>
    </section>
  )
}

function ConciliacionSimuladorLegacyPanel({
  conciliacion,
}: {
  readonly conciliacion: ConciliacionSimuladorLegacy
}) {
  return (
    <GrupoResumen
      tono="amarillo"
      titulo={`Conciliación con simulador simplificado ${conciliacion.anio}`}
    >
      <div className="rounded-sm bg-[color-mix(in_oklab,var(--paper),transparent_36%)] px-3 py-3 text-sm leading-6 text-[var(--ink-soft)]">
        La cuota diferencial es una magnitud de declaración anual. El simulador
        simplificado muestra una estimación de IRPF de nómina: parte de la cuota
        anual y después aplica la deducción vinculada al SMI y el límite legal
        de retención de nómina. Todos estos importes son nominales de{" "}
        {conciliacion.anio}.
      </div>
      <LineaResumen
        ayuda="Cuota anual antes de restar retenciones y pagos a cuenta; es la base comparable con el cálculo de nómina."
        etiqueta="Cuota liquidada anual"
        signo="+"
        valor={formatearEuros(conciliacion.cuotaLiquidadaAnualCentimos)}
      />
      <LineaResumen
        ayuda="Deducción vinculada al SMI usada para estimar el IRPF final de nómina."
        etiqueta="Deducción SMI"
        signo="-"
        valor={formatearEuros(conciliacion.deduccionSmiCentimos)}
      />
      <LineaResumen
        ayuda="Cuota anual después de aplicar la deducción vinculada al SMI."
        etiqueta="Cuota tras SMI"
        signo="="
        valor={formatearEuros(conciliacion.cuotaTrasDeduccionSmiCentimos)}
      />
      <LineaResumen
        ayuda="Límite máximo nominal de retención en nómina aplicado por el simulador simplificado."
        detalle={
          <>
            <span>
              Rendimientos del trabajo nominales - minimo exento de retención
              nominal:{" "}
              {formatearEuros(conciliacion.rendimientoIntegroTrabajoCentimos)} -{" "}
              {formatearEuros(conciliacion.minimoExentoRetencionCentimos)} ={" "}
              {formatearEuros(
                conciliacion.rendimientoIntegroTrabajoCentimos -
                  conciliacion.minimoExentoRetencionCentimos
              )}
              .
            </span>
            <span className="block">
              Límite maximo legal nominal de retención en nómina, art. 85.3
              RIRPF:{" "}
              {formatearEuros(
                conciliacion.rendimientoIntegroTrabajoCentimos -
                  conciliacion.minimoExentoRetencionCentimos
              )}{" "}
              ×{" "}
              {formatearPuntosPorcentuales(
                conciliacion.tipoMaximoRetencionNominaPorcentaje
              )}{" "}
              = {formatearEuros(conciliacion.limiteRetencionNominaCentimos)}.
            </span>
          </>
        }
        etiqueta="Límite retención nómina nominal"
        valor={formatearEuros(conciliacion.limiteRetencionNominaCentimos)}
      />
      <LineaResumen
        ayuda="Resultado que muestra el simulador simplificado como IRPF final: el menor entre cuota tras SMI y límite de retención."
        destacado
        etiqueta="IRPF final simulador"
        signo="="
        valor={formatearEuros(conciliacion.irpfFinalSimuladorCentimos)}
      />
      <LineaResumen
        ayuda="Diferencia entre la cuota diferencial visible en esta liquidación y el IRPF final de nómina del simulador simplificado."
        etiqueta="Diferencia explicada"
        valor={formatearEuros(
          conciliacion.diferenciaCuotaDiferencialEIrpfFinalCentimos
        )}
      />
    </GrupoResumen>
  )
}

function GrupoResumen({
  children,
  tono,
  titulo,
}: {
  readonly children: React.ReactNode
  readonly tono: "amarillo" | "azul" | "rosa" | "verde"
  readonly titulo: string
}) {
  const fondoPorTono = {
    amarillo: "bg-[oklch(0.955_0.045_90)]",
    azul: "bg-[oklch(0.94_0.035_235)]",
    rosa: "bg-[oklch(0.945_0.04_15)]",
    verde: "bg-[oklch(0.94_0.04_150)]",
  } as const

  return (
    <section
      className={cn(
        "rounded-md border border-[color-mix(in_oklab,var(--rule),transparent_76%)] p-4",
        fondoPorTono[tono]
      )}
    >
      <h3 className="text-xs tracking-[0.18em] text-[var(--ink-soft)] uppercase">
        {titulo}
      </h3>
      <dl className="mt-2 grid gap-1">{children}</dl>
    </section>
  )
}

function LineaResumen({
  ayuda,
  destacado = false,
  detalle,
  etiqueta,
  signo,
  valor,
}: {
  readonly ayuda: string
  readonly destacado?: boolean
  readonly detalle?: React.ReactNode
  readonly etiqueta: string
  readonly signo?: "+" | "-" | "="
  readonly valor: string
}) {
  const tieneDetalle =
    detalle !== undefined && detalle !== null && detalle !== false

  return (
    <div className="grid gap-2 rounded-sm bg-[color-mix(in_oklab,var(--paper),transparent_36%)] px-3 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-4">
      <dt className="grid min-w-0 grid-cols-[1.25rem_minmax(0,1fr)] gap-2">
        <span className="pt-0.5 text-sm font-bold text-[var(--ink-soft)]">
          {signo ?? ""}
        </span>
        <span className="min-w-0">
          <EtiquetaConAyuda ayuda={ayuda} etiqueta={etiqueta} />
          {tieneDetalle ? (
            <span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">
              {detalle}
            </span>
          ) : null}
        </span>
      </dt>
      <dd
        className={cn(
          "font-bold tabular-nums sm:text-right",
          destacado ? "text-xl" : "text-base"
        )}
      >
        {valor}
      </dd>
    </div>
  )
}

function EtiquetaConAyuda({
  ayuda,
  etiqueta,
}: {
  readonly ayuda: string
  readonly etiqueta: string
}) {
  return (
    <Tooltip contenido={ayuda}>
      <Button
        className="cursor-help border-b border-dotted border-current text-left text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]"
        type="button"
        variant="unstyled"
      >
        {etiqueta}
      </Button>
    </Tooltip>
  )
}
