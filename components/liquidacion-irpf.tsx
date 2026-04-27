"use client"

import * as React from "react"
import { AlertTriangle, FileText } from "lucide-react"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox } from "@/components/ui/combobox"
import { NumberField } from "@/components/ui/number-field"
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
import {
  CATALOGO_DEDUCCIONES_AUTONOMICAS_2025,
  DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS,
} from "@/lib/dominio/normativa/datos/deducciones-autonomicas-2025"
import type {
  CuantiaDeduccionAutonomica,
  CatalogoDeduccionesAutonomicasPorComunidad,
  FichaDeduccionAutonomica,
} from "@/lib/dominio/normativa/datos/deducciones-autonomicas-2025"
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
type EntradasDeduccionesAutonomicas = {
  readonly [clave: string]: boolean | number | string
}

const ENTRADAS_DEDUCCIONES_INICIALES: EntradasDeduccionesAutonomicas = {
  andaluciaHijosNacimientoAdopcion: 0,
  andaluciaMenoresAcogidos: 0,
  andaluciaMunicipioDespoblacion: false,
  andaluciaFamiliaMonoparental: false,
  andaluciaAscendientesMayores75: 0,
  andaluciaHijosAdopcionInternacional: 0,
  andaluciaAdopcionInternacionalCumpleLimites: false,
  andaluciaAdopcionInternacionalProrrateada: false,
  andaluciaCategoriaFamiliaNumerosa: "ninguna",
  andaluciaFamiliaNumerosaCumpleLimites: false,
  andaluciaContribuyenteDiscapacidad: false,
  andaluciaContribuyenteDiscapacidadCumpleLimites: false,
  andaluciaConyugeParejaDiscapacidad65: false,
  andaluciaConyugeParejaDiscapacidadCumpleRequisitos: false,
  andaluciaPersonasDiscapacidadConMinimo: 0,
  andaluciaAsistenciaDiscapacidadCumpleLimites: false,
  andaluciaAsistenciaTercerasPersonas: false,
  andaluciaCuotasHogarDiscapacidad: 0,
  andaluciaCuotasAyudaDomestica: 0,
  andaluciaAyudaDomesticaCumpleRequisitos: false,
  andaluciaInversionAccionesImporte: 0,
  andaluciaInversionAccionesRegimen: "general",
  andaluciaInversionAccionesCumpleRequisitos: false,
  aragonTercerHijoSucesivos: 0,
  aragonTercerHijoFiscalidadDiferenciada: false,
  aragonTercerHijoBaseReducida: false,
  aragonPersonasDependientes: 0,
  aragonDependientesFiscalidadDiferenciada: false,
  aragonDependientesCumpleLimites: false,
  aragonMayor70CumpleRequisitos: false,
  canariasOrdenHijoNacimientoAdopcion: "primero-segundo",
  canariasHijosNacimientoAdopcion: 0,
  canariasHijosNacimientoAdopcionDiscapacidad65: 0,
  canariasNacimientoCumpleLimites: false,
  canariasContribuyenteDiscapacidad33: false,
  canariasContribuyenteMayor65: false,
  canariasDiscapacidadMayoresCumpleLimites: false,
  canariasCategoriaFamiliaNumerosa: "ninguna",
  canariasFamiliaNumerosaDiscapacidad65: false,
  canariasDesempleadoCumpleRequisitos: false,
  clmPartosAdopcionesUnHijo: 0,
  clmPartosAdopcionesDosHijos: 0,
  clmPartosAdopcionesTresOMas: 0,
  clmNacimientoCumpleLimites: false,
  clmCategoriaFamiliaNumerosa: "ninguna",
  clmFamiliaNumerosaDiscapacidad65: false,
  clmFamiliaNumerosaCumpleLimites: false,
  clmContribuyenteDiscapacidad65: false,
  clmDiscapacidadContribuyenteCumpleLimites: false,
  clmAscDescDiscapacidad65: 0,
  clmAscDescDiscapacidadCumpleLimites: false,
  catalunyaViudedad: false,
  catalunyaViudedadConDescendientes: false,
  catalunyaRehabilitacionVivienda: 0,
  catalunyaInteresesMasterDoctorado: 0,
  madridHijosNacimientoAdopcion: 0,
  madridProrrateoDosProgenitores: false,
  catalunyaAlquilerVictima: 0,
  catalunyaVictimaViolenciaMachista: false,
  catalunyaAlquilerIncrementado: false,
  catalunyaAportacionesCooperativas: 0,
}

const numeroDeduccion = (
  entradas: EntradasDeduccionesAutonomicas,
  clave: string
): number => {
  const valor = entradas[clave]

  return typeof valor === "number" ? valor : 0
}

const booleanoDeduccion = (
  entradas: EntradasDeduccionesAutonomicas,
  clave: string
): boolean => entradas[clave] === true

const textoDeduccion = (
  entradas: EntradasDeduccionesAutonomicas,
  clave: string
): string => {
  const valor = entradas[clave]

  return typeof valor === "string" ? valor : ""
}

const importeSi = (condicion: boolean, importe: number): number =>
  condicion ? importe : 0

const CODIGOS_DEDUCCIONES_CON_CONTROL_ESPECIFICO = new Set([
  "andalucia_nacimiento_adopcion_acogimiento_menores",
  "andalucia_familia_monoparental_ascendientes_mayores_75",
  "andalucia_adopcion_internacional",
  "andalucia_familia_numerosa",
  "andalucia_contribuyente_discapacidad",
  "andalucia_conyuge_pareja_discapacidad",
  "andalucia_asistencia_personas_discapacidad",
  "andalucia_ayuda_domestica",
  "andalucia_inversion_acciones_participaciones_mercantiles",
  "aragon_nacimiento_adopcion_tercer_hijo_sucesivos",
  "aragon_cuidado_personas_dependientes",
  "aragon_mayores_70",
  "canarias_nacimiento_adopcion_hijos",
  "canarias_discapacidad_mayores_65",
  "canarias_familia_numerosa",
  "canarias_contribuyentes_desempleados",
  "clm_nacimiento_adopcion_hijos",
  "clm_familia_numerosa",
  "clm_discapacidad_contribuyente",
  "clm_discapacidad_ascendientes_descendientes",
  "madrid_nacimiento_adopcion_hijos",
  "cataluna_viudedad_2023_2024_2025",
  "cataluna_rehabilitacion_vivienda_habitual",
  "cataluna_intereses_prestamos_master_doctorado",
  "cataluna_alquiler_victimas_violencia_machista",
  "cataluna_inversion_cooperativas_agrarias_vivienda",
])

const calcularDeduccionGenerica = (
  deduccion: FichaDeduccionAutonomica,
  entradas: EntradasDeduccionesAutonomicas
): number => {
  if (CODIGOS_DEDUCCIONES_CON_CONTROL_ESPECIFICO.has(deduccion.codigo)) {
    return 0
  }
  if (!booleanoDeduccion(entradas, `${deduccion.codigo}:cumple`)) {
    return 0
  }

  const base = numeroDeduccion(entradas, `${deduccion.codigo}:base`)
  const unidades = Math.max(1, numeroDeduccion(entradas, `${deduccion.codigo}:unidades`))

  if (deduccion.cuantia.tipo === "importe_fijo") {
    return Number(deduccion.cuantia.euros) * unidades
  }
  if (deduccion.cuantia.tipo === "porcentaje") {
    const importe = base * (Number(deduccion.cuantia.porcentaje) / 100)
    return Math.min(
      importe,
      deduccion.cuantia.limiteMaximoEuros
        ? Number(deduccion.cuantia.limiteMaximoEuros)
        : importe
    )
  }

  return numeroDeduccion(entradas, `${deduccion.codigo}:importe`)
}

const calcularDeduccionesAutonomicasAplicadas = (
  entradas: EntradasDeduccionesAutonomicas
): number => {
  const andaluciaNacimiento =
    (numeroDeduccion(entradas, "andaluciaHijosNacimientoAdopcion") +
      numeroDeduccion(entradas, "andaluciaMenoresAcogidos")) *
    (booleanoDeduccion(entradas, "andaluciaMunicipioDespoblacion") ? 400 : 200)
  const andaluciaMonoparental = booleanoDeduccion(
    entradas,
    "andaluciaFamiliaMonoparental"
  )
    ? 100 + numeroDeduccion(entradas, "andaluciaAscendientesMayores75") * 100
    : 0
  const andaluciaAdopcionInternacional = importeSi(
    booleanoDeduccion(entradas, "andaluciaAdopcionInternacionalCumpleLimites"),
    numeroDeduccion(entradas, "andaluciaHijosAdopcionInternacional") *
      600 *
      (booleanoDeduccion(entradas, "andaluciaAdopcionInternacionalProrrateada")
        ? 0.5
        : 1)
  )
  const andaluciaFamiliaNumerosa = importeSi(
    booleanoDeduccion(entradas, "andaluciaFamiliaNumerosaCumpleLimites"),
    textoDeduccion(entradas, "andaluciaCategoriaFamiliaNumerosa") ===
      "especial"
      ? 400
      : textoDeduccion(entradas, "andaluciaCategoriaFamiliaNumerosa") ===
          "general"
        ? 200
        : 0
  )
  const andaluciaContribuyenteDiscapacidad = importeSi(
    booleanoDeduccion(entradas, "andaluciaContribuyenteDiscapacidad") &&
      booleanoDeduccion(
        entradas,
        "andaluciaContribuyenteDiscapacidadCumpleLimites"
      ),
    150
  )
  const andaluciaConyugeParejaDiscapacidad = importeSi(
    booleanoDeduccion(entradas, "andaluciaConyugeParejaDiscapacidad65") &&
      booleanoDeduccion(
        entradas,
        "andaluciaConyugeParejaDiscapacidadCumpleRequisitos"
      ),
    100
  )
  const andaluciaAsistenciaDiscapacidad = importeSi(
    booleanoDeduccion(
      entradas,
      "andaluciaAsistenciaDiscapacidadCumpleLimites"
    ),
    numeroDeduccion(entradas, "andaluciaPersonasDiscapacidadConMinimo") * 100 +
      importeSi(
        booleanoDeduccion(entradas, "andaluciaAsistenciaTercerasPersonas"),
        Math.min(
          numeroDeduccion(entradas, "andaluciaCuotasHogarDiscapacidad") * 0.2,
          500
        )
      )
  )
  const andaluciaAyudaDomestica = importeSi(
    booleanoDeduccion(entradas, "andaluciaAyudaDomesticaCumpleRequisitos"),
    Math.min(numeroDeduccion(entradas, "andaluciaCuotasAyudaDomestica") * 0.2, 500)
  )
  const andaluciaInversionAcciones = importeSi(
    booleanoDeduccion(entradas, "andaluciaInversionAccionesCumpleRequisitos"),
    textoDeduccion(entradas, "andaluciaInversionAccionesRegimen") ===
      "universidad"
      ? Math.min(
          numeroDeduccion(entradas, "andaluciaInversionAccionesImporte") * 0.5,
          12_000
        )
      : Math.min(
          numeroDeduccion(entradas, "andaluciaInversionAccionesImporte") * 0.2,
          4_000
        )
  )
  const aragonTercerHijo =
    numeroDeduccion(entradas, "aragonTercerHijoSucesivos") *
    (booleanoDeduccion(entradas, "aragonTercerHijoFiscalidadDiferenciada")
      ? booleanoDeduccion(entradas, "aragonTercerHijoBaseReducida")
        ? 720
        : 600
      : booleanoDeduccion(entradas, "aragonTercerHijoBaseReducida")
        ? 600
        : 500)
  const aragonDependientes = importeSi(
    booleanoDeduccion(entradas, "aragonDependientesCumpleLimites"),
    numeroDeduccion(entradas, "aragonPersonasDependientes") *
      (booleanoDeduccion(entradas, "aragonDependientesFiscalidadDiferenciada")
        ? 300
        : 150)
  )
  const aragonMayores70 = importeSi(
    booleanoDeduccion(entradas, "aragonMayor70CumpleRequisitos"),
    75
  )
  const canariasNacimientoPorHijo =
    textoDeduccion(entradas, "canariasOrdenHijoNacimientoAdopcion") === "tercero"
      ? 530
      : textoDeduccion(entradas, "canariasOrdenHijoNacimientoAdopcion") ===
          "cuarto"
        ? 796
        : textoDeduccion(entradas, "canariasOrdenHijoNacimientoAdopcion") ===
            "quinto-sucesivos"
          ? 928
          : 265
  const canariasNacimiento = importeSi(
    booleanoDeduccion(entradas, "canariasNacimientoCumpleLimites"),
    numeroDeduccion(entradas, "canariasHijosNacimientoAdopcion") *
      canariasNacimientoPorHijo +
      numeroDeduccion(entradas, "canariasHijosNacimientoAdopcionDiscapacidad65") *
        (canariasNacimientoPorHijo <= 265 ? 600 : 1100)
  )
  const canariasDiscapacidadMayores = importeSi(
    booleanoDeduccion(entradas, "canariasDiscapacidadMayoresCumpleLimites"),
    importeSi(
      booleanoDeduccion(entradas, "canariasContribuyenteDiscapacidad33"),
      400
    ) + importeSi(booleanoDeduccion(entradas, "canariasContribuyenteMayor65"), 160)
  )
  const canariasFamiliaNumerosa =
    textoDeduccion(entradas, "canariasCategoriaFamiliaNumerosa") === "especial"
      ? booleanoDeduccion(entradas, "canariasFamiliaNumerosaDiscapacidad65")
        ? 1459
        : 796
      : textoDeduccion(entradas, "canariasCategoriaFamiliaNumerosa") ===
          "general"
        ? booleanoDeduccion(entradas, "canariasFamiliaNumerosaDiscapacidad65")
          ? 1326
          : 597
        : 0
  const canariasDesempleados = importeSi(
    booleanoDeduccion(entradas, "canariasDesempleadoCumpleRequisitos"),
    120
  )
  const clmNacimiento = importeSi(
    booleanoDeduccion(entradas, "clmNacimientoCumpleLimites"),
    numeroDeduccion(entradas, "clmPartosAdopcionesUnHijo") * 100 +
      numeroDeduccion(entradas, "clmPartosAdopcionesDosHijos") * 500 +
      numeroDeduccion(entradas, "clmPartosAdopcionesTresOMas") * 900
  )
  const clmFamiliaNumerosa = importeSi(
    booleanoDeduccion(entradas, "clmFamiliaNumerosaCumpleLimites"),
    textoDeduccion(entradas, "clmCategoriaFamiliaNumerosa") === "especial"
      ? booleanoDeduccion(entradas, "clmFamiliaNumerosaDiscapacidad65")
        ? 900
        : 400
      : textoDeduccion(entradas, "clmCategoriaFamiliaNumerosa") === "general"
        ? booleanoDeduccion(entradas, "clmFamiliaNumerosaDiscapacidad65")
          ? 300
          : 200
        : 0
  )
  const clmDiscapacidadContribuyente = importeSi(
    booleanoDeduccion(entradas, "clmContribuyenteDiscapacidad65") &&
      booleanoDeduccion(
        entradas,
        "clmDiscapacidadContribuyenteCumpleLimites"
      ),
    300
  )
  const clmDiscapacidadAscDesc = importeSi(
    booleanoDeduccion(entradas, "clmAscDescDiscapacidadCumpleLimites"),
    numeroDeduccion(entradas, "clmAscDescDiscapacidad65") * 300
  )
  const catalunyaViudedad = importeSi(
    booleanoDeduccion(entradas, "catalunyaViudedad"),
    booleanoDeduccion(entradas, "catalunyaViudedadConDescendientes") ? 300 : 150
  )
  const catalunyaRehabilitacion = Math.min(
    numeroDeduccion(entradas, "catalunyaRehabilitacionVivienda") * 0.015,
    135.6
  )
  const catalunyaInteresesMasterDoctorado = numeroDeduccion(
    entradas,
    "catalunyaInteresesMasterDoctorado"
  )
  const deduccionesGenericas =
    DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.reduce(
      (total, deduccion) =>
        total + calcularDeduccionGenerica(deduccion, entradas),
      0
    )
  const madridNacimiento =
    numeroDeduccion(entradas, "madridHijosNacimientoAdopcion") *
    721.7 *
    (booleanoDeduccion(entradas, "madridProrrateoDosProgenitores") ? 0.5 : 1)
  const catalunyaAlquiler = booleanoDeduccion(
    entradas,
    "catalunyaVictimaViolenciaMachista"
  )
    ? Math.min(
        numeroDeduccion(entradas, "catalunyaAlquilerVictima") *
          (booleanoDeduccion(entradas, "catalunyaAlquilerIncrementado")
            ? 0.25
            : 0.2),
        booleanoDeduccion(entradas, "catalunyaAlquilerIncrementado")
          ? 1200
          : 1000
      )
    : 0
  const catalunyaCooperativas = Math.min(
    numeroDeduccion(entradas, "catalunyaAportacionesCooperativas") * 0.2,
    3000
  )

  return (
    Math.round(
      (andaluciaNacimiento +
        andaluciaMonoparental +
        andaluciaAdopcionInternacional +
        andaluciaFamiliaNumerosa +
        andaluciaContribuyenteDiscapacidad +
        andaluciaConyugeParejaDiscapacidad +
        andaluciaAsistenciaDiscapacidad +
        andaluciaAyudaDomestica +
        andaluciaInversionAcciones +
        aragonTercerHijo +
        aragonDependientes +
        aragonMayores70 +
        canariasNacimiento +
        canariasDiscapacidadMayores +
        canariasFamiliaNumerosa +
        canariasDesempleados +
        clmNacimiento +
        clmFamiliaNumerosa +
        clmDiscapacidadContribuyente +
        clmDiscapacidadAscDesc +
        catalunyaViudedad +
        catalunyaRehabilitacion +
        catalunyaInteresesMasterDoctorado +
        deduccionesGenericas +
        madridNacimiento +
        catalunyaAlquiler +
        catalunyaCooperativas) *
        100
    ) / 100
  )
}

const describirCuantiaDeduccion = (
  cuantia: CuantiaDeduccionAutonomica
): string => {
  if (cuantia.tipo === "mixta") return cuantia.descripcion
  if (cuantia.tipo === "importe_fijo") {
    return `${cuantia.euros} euros por ${cuantia.por}.`
  }

  return `${cuantia.porcentaje}% sobre ${cuantia.base}${
    cuantia.limiteMaximoEuros
      ? `, con límite máximo de ${cuantia.limiteMaximoEuros} euros.`
      : "."
  }`
}

const describirEstadoDeduccion = (
  deduccion: FichaDeduccionAutonomica
): string => {
  if (deduccion.estado === "implementada") {
    return "Calculable en esta interfaz con los campos de abajo."
  }
  if (deduccion.estado === "normalizada_pendiente_tests") {
    return "Ficha estructurada, pendiente de tests antes de aplicarla automáticamente."
  }
  if (deduccion.estado === "no_soportada") {
    return "Revisada y no calculable con los datos actuales; debe tratarse como caso no soportado."
  }

  return "Reconocida en el manual, pendiente de convertir a ficha y fórmula revisadas."
}

const AYUDAS_RESUMEN = {
  "Base liquidable":
    "Resultado que queda para aplicar los tramos: rendimientos netos menos reducciones de base.",
  "Rendimiento neto trabajo":
    "Salario bruto menos cotizacion del trabajador y gastos deducibles aplicados.",
  "Capital inmobiliario neto":
    "Rendimiento de inmuebles, por ejemplo alquileres, que se suma a la base general.",
  "Ganancia patrimonial exenta":
    "Parte de la ganancia que no tributa por exención reconocida, por ejemplo vivienda habitual de mayores de 65.",
  "Base ahorro":
    "Importe de ganancias y rentas del ahorro que queda sujeto a la escala del ahorro.",
  "Gastos y deducciones trabajo":
    "Total que se resta al rendimiento del trabajo: cotizacion del trabajador, gastos deducibles y reduccion por rendimientos del trabajo.",
  "Cotización empresa":
    "Aportacion a la Seguridad Social que paga la empresa por el trabajador.",
  "Cotización trabajador":
    "Aportacion a la Seguridad Social descontada al trabajador. Incluye MEI y, si procede, solidaridad.",
  "Coste laboral": "Salario bruto mas la cotizacion de empresa.",
  "MEI empresa":
    "Mecanismo de Equidad Intergeneracional que paga la empresa. Esta parte esta incluida en la cotizacion de empresa.",
  "MEI trabajador":
    "Mecanismo de Equidad Intergeneracional descontado al trabajador. Esta parte esta incluida en la cotizacion del trabajador.",
  "Cuota líquida":
    "Impuesto resultante antes de restar retenciones y pagos a cuenta.",
  "Retenciones/pagos a cuenta":
    "Importes ya pagados durante el año que se restan de la cuota liquida.",
  "Deducciones autonómicas":
    "Importe total de deducciones autonómicas aplicables, si ya lo conoces.",
  "Cuota diferencial":
    "Resultado tras restar retenciones y pagos a cuenta. Positivo: a pagar; negativo: a devolver.",
} satisfies Record<string, string>
const AYUDAS_FORMULARIO = {
  "Rendimientos del trabajo":
    "Ingresos brutos anuales por salario o trabajo antes de restar cotizaciones.",
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
    "Hijos, nietos u otros familiares hacia abajo que pueden computar si cumplen requisitos fiscales.",
  "Descendientes con discapacidad":
    "Descendientes que cumplen los requisitos fiscales y tienen discapacidad reconocida.",
  "Descendientes discapacidad 65%":
    "Descendientes con discapacidad reconocida igual o superior al 65%.",
  "Descendientes con asistencia":
    "Descendientes con discapacidad de 33% a 64% que necesitan ayuda de terceras personas o tienen movilidad reducida.",
  Ascendientes:
    "Padres, madres o abuelos que pueden computar solo si cumplen requisitos fiscales.",
  "Retenciones soportadas":
    "IRPF ya retenido durante el año, por ejemplo en la nomina.",
  "Pagos a cuenta": "Otros pagos anticipados del impuesto ya realizados.",
  "Deducciones autonómicas":
    "Importe total de deducciones autonómicas que quieras aplicar como dato revisable.",
} satisfies Record<string, string>

function formatearEuros(centimos: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(centimosAEuros(centimos))
}

export function LiquidacionIrpf() {
  const [rendimientosTrabajoEuros, fijarRendimientosTrabajoEuros] =
    React.useState(30_000)
  const [capitalInmobiliarioEuros, fijarCapitalInmobiliarioEuros] =
    React.useState(1_000)
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
  const [
    deduccionAutonomicaManualEuros,
    fijarDeduccionAutonomicaManualEuros,
  ] =
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
        pagosACuentaCentimos: eurosACentimos(pagosACuentaEuros),
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
      tratamientoGananciaPatrimonial,
    ]
  )
  const resultado = React.useMemo(
    () => liquidarIrpfAnual(caso, { modo: "canonico" }),
    [caso]
  )

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <NavegacionSitio />

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
            edad={edad}
            entradasDeduccionesAutonomicas={entradasDeduccionesAutonomicas}
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
            deduccionesAutonomicasEuros={deduccionesAutonomicasEuros}
            deduccionesAutonomicasAplicadasEuros={
              deduccionesAutonomicasAplicadasEuros
            }
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
  edad,
  entradasDeduccionesAutonomicas,
  fijarAscendientes,
  fijarCapitalInmobiliarioEuros,
  fijarComunidadAutonoma,
  fijarDescendientes,
  fijarDescendientesConAsistencia,
  fijarDescendientesConDiscapacidad,
  fijarDescendientesDiscapacidad65,
  fijarCatalogoDeduccionesAbierto,
  fijarDeduccionAutonomicaManualEuros,
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
}: {
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
  readonly edad: number
  readonly entradasDeduccionesAutonomicas: EntradasDeduccionesAutonomicas
  readonly fijarAscendientes: (valor: number) => void
  readonly fijarCapitalInmobiliarioEuros: (valor: number) => void
  readonly fijarComunidadAutonoma: (valor: ComunidadAutonoma) => void
  readonly fijarDescendientes: (valor: number) => void
  readonly fijarDescendientesConAsistencia: (valor: number) => void
  readonly fijarDescendientesConDiscapacidad: (valor: number) => void
  readonly fijarDescendientesDiscapacidad65: (valor: number) => void
  readonly fijarCatalogoDeduccionesAbierto: (valor: boolean) => void
  readonly fijarDeduccionAutonomicaManualEuros: (valor: number) => void
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
}) {
  const catalogoDeducciones = (
    CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor as Partial<
      Record<ComunidadAutonoma, CatalogoDeduccionesAutonomicasPorComunidad>
    >
  )[comunidadAutonoma]
  const usaComunidadAutonomicaReal = comunidadAutonoma !== "simulada-estatal"

  return (
    <section className="border border-[var(--rule)] bg-[var(--paper)] p-4 shadow-[6px_6px_0_var(--rule)] lg:sticky lg:top-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            2025 · individual
          </p>
          <h1 className="mt-2 text-4xl leading-none font-[var(--display)]">
            Liquidación IRPF
          </h1>
        </div>
        <FileText aria-hidden className="mt-1 size-6 shrink-0" />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Rendimientos del trabajo"]}
            compacto
            etiqueta="Rendimientos del trabajo"
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
          <Combobox
            compacto
            etiqueta="Tratamiento ganancia"
            onChange={fijarTratamientoGananciaPatrimonial}
            opciones={OPCIONES_GANANCIA_PATRIMONIAL}
            valor={tratamientoGananciaPatrimonial}
          />
        </div>
        {tratamientoGananciaPatrimonial === "renta-vitalicia-mayores-65" ? (
          <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Retenciones soportadas"]}
            compacto
            etiqueta="Retenciones soportadas"
            formato={FORMATO_ENTERO}
            onChange={fijarRetencionesSoportadasEuros}
            paso={250}
            valor={retencionesSoportadasEuros}
          />
          <NumberField
            ayuda={AYUDAS_FORMULARIO["Pagos a cuenta"]}
            compacto
            etiqueta="Pagos a cuenta"
            formato={FORMATO_ENTERO}
            onChange={fijarPagosACuentaEuros}
            paso={250}
            valor={pagosACuentaEuros}
          />
        </div>
      </div>

      {catalogoDeduccionesAbierto && usaComunidadAutonomicaReal ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4"
          onClick={() => fijarCatalogoDeduccionesAbierto(false)}
          role="dialog"
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-auto border border-[var(--rule)] bg-[var(--paper)] p-4 shadow-[6px_6px_0_var(--rule)]"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)] uppercase">
                  Deducciones autonómicas
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {catalogoDeducciones?.comunidad ?? comunidadAutonoma}
                </h2>
              </div>
              <button
                className="border border-[var(--rule)] bg-[var(--paper-2)] px-3 py-1 text-sm font-bold hover:bg-[var(--paper)]"
                onClick={() => fijarCatalogoDeduccionesAbierto(false)}
                type="button"
              >
                Cerrar
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
              Estas deducciones existen en el manual. Las fichas implementadas
              debajo actualizan la deducción agregada del formulario; el importe
              agregado queda marcado en el rastro.
            </p>
            <ul className="mt-4 grid gap-2">
              {(catalogoDeducciones?.deducciones ?? []).map((deduccion) => (
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
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Combobox
          compacto
          etiqueta="Comunidad autónoma"
          onChange={fijarComunidadAutonoma}
          opciones={OPCIONES_COMUNIDAD_AUTONOMA}
          valor={comunidadAutonoma}
        />
        {usaComunidadAutonomicaReal ? (
          <>
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
            <div className="grid gap-2">
              <div className="flex min-h-10 items-end">
                <p className="text-sm leading-tight font-bold">
                  Deducciones autonómicas
                </p>
              </div>
              <button
                className="h-9 w-full border border-[var(--rule)] bg-[var(--paper-2)] px-3 text-left text-sm font-bold hover:bg-[var(--paper)]"
                onClick={() => fijarCatalogoDeduccionesAbierto(true)}
                type="button"
              >
                Aplicar
              </button>
            </div>
          </>
        ) : null}
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
          ayuda={AYUDAS_FORMULARIO["Descendientes"]}
          compacto
          etiqueta="Descendientes"
          formato={FORMATO_ENTERO}
          max={8}
          onChange={(valor) => {
            fijarDescendientes(valor)
            fijarDescendientesConDiscapacidad(
              Math.min(descendientesConDiscapacidad, valor)
            )
            fijarDescendientesDiscapacidad65(
              Math.min(descendientesDiscapacidad65, valor)
            )
            fijarDescendientesConAsistencia(
              Math.min(descendientesConAsistencia, valor)
            )
          }}
          valor={descendientes}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Descendientes con discapacidad"]}
          compacto
          etiqueta="Desc. discapacidad 33%-64%"
          formato={FORMATO_ENTERO}
          max={descendientes}
          onChange={(valor) => {
            const siguiente = Math.max(valor, descendientesDiscapacidad65)
            fijarDescendientesConDiscapacidad(siguiente)
            fijarDescendientesConAsistencia(
              Math.min(descendientesConAsistencia, siguiente)
            )
          }}
          valor={descendientesConDiscapacidad}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Descendientes discapacidad 65%"]}
          compacto
          etiqueta="Desc. discapacidad ≥65%"
          formato={FORMATO_ENTERO}
          max={descendientes}
          onChange={(valor) => {
            fijarDescendientesDiscapacidad65(valor)
            fijarDescendientesConDiscapacidad(
              Math.max(descendientesConDiscapacidad, valor)
            )
          }}
          valor={descendientesDiscapacidad65}
        />
        <NumberField
          ayuda={AYUDAS_FORMULARIO["Descendientes con asistencia"]}
          compacto
          etiqueta="Desc. asistencia/movilidad"
          formato={FORMATO_ENTERO}
          max={Math.max(
            0,
            descendientesConDiscapacidad - descendientesDiscapacidad65
          )}
          onChange={fijarDescendientesConAsistencia}
          valor={descendientesConAsistencia}
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
        formato={opciones?.euros ? FORMATO_EUROS : FORMATO_ENTERO}
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
          valor={numeroDeduccion(
            entradas,
            "andaluciaHijosNacimientoAdopcion"
          )}
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
            "Cumple limites de base"
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
        <Combobox
          compacto
          etiqueta="Categoría"
          onChange={(valor) =>
            actualizar("andaluciaCategoriaFamiliaNumerosa", valor)
          }
          opciones={OPCIONES_CATEGORIA_FAMILIA_NUMEROSA}
          valor={textoDeduccion(
            entradas,
            "andaluciaCategoriaFamiliaNumerosa"
          )}
        />
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "andaluciaFamiliaNumerosaCumpleLimites",
            "Cumple limites de base"
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
          "Cumple limites de base"
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
          "Cumple limites, inscripción y no declaración individual"
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
            "Cumple limites de base"
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
        <Combobox
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
            "Cumple limites y convivencia"
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
        <Combobox
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
            "Cumple limites de base"
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
          "Cumple limites de base"
        )}
      </div>
    )
  }

  if (codigo === "canarias_familia_numerosa") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Combobox
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
            "Cumple limites de base"
          )}
        </div>
      </div>
    )
  }

  if (codigo === "clm_familia_numerosa") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Combobox
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
            "Cumple limites de base"
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
          "Cumple limites de base"
        )}
      </div>
    )
  }

  if (codigo === "clm_discapacidad_ascendientes_descendientes") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campoNumero("clmAscDescDiscapacidad65", "Asc./desc. discapacidad ≥65%")}
        <div className="flex items-end pb-1">
          {campoCheckbox(
            "clmAscDescDiscapacidadCumpleLimites",
            "Cumple limites de base"
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
            checked={booleanoDeduccion(entradas, "catalunyaAlquilerIncrementado")}
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
        {campoNumero(
          "catalunyaInteresesMasterDoctorado",
          "Intereses pagados",
          {
            euros: true,
            paso: 100,
          }
        )}
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
          valor={numeroDeduccion(
            entradas,
            "catalunyaAportacionesCooperativas"
          )}
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
          <div className="flex items-start gap-3">
            <AlertTriangle
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
            />
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.12em] text-[var(--ink-soft)] uppercase">
                {esNoSoportado
                  ? "Resultado no soportado"
                  : "Liquidación calculada"}
              </p>
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
            <div className="grid gap-3 pl-8 sm:grid-cols-2 xl:grid-cols-4">
              <DatoResultado
                etiqueta="Cotización empresa"
                ayuda={AYUDAS_RESUMEN["Cotización empresa"]}
                valor={formatearEuros(resultado.cotizacionEmpresarialCentimos)}
              />
              <DatoResultado
                etiqueta="Coste laboral"
                ayuda={AYUDAS_RESUMEN["Coste laboral"]}
                valor={formatearEuros(resultado.costeLaboralCentimos)}
              />
              <DatoResultado
                etiqueta="Cotización trabajador"
                ayuda={AYUDAS_RESUMEN["Cotización trabajador"]}
                valor={formatearEuros(resultado.cotizacionTrabajadorCentimos)}
              />
              <DatoResultado
                etiqueta="MEI empresa"
                ayuda={AYUDAS_RESUMEN["MEI empresa"]}
                valor={formatearEuros(resultado.meiEmpresarialCentimos)}
              />
              <DatoResultado
                etiqueta="MEI trabajador"
                ayuda={AYUDAS_RESUMEN["MEI trabajador"]}
                valor={formatearEuros(resultado.meiTrabajadorCentimos)}
              />
              <DatoResultado
                etiqueta="Gastos y deducciones trabajo"
                ayuda={AYUDAS_RESUMEN["Gastos y deducciones trabajo"]}
                valor={formatearEuros(
                  resultado.totalGastosYDeduccionesTrabajoCentimos
                )}
              />
              <DatoResultado
                etiqueta="Rendimiento neto trabajo"
                ayuda={AYUDAS_RESUMEN["Rendimiento neto trabajo"]}
                valor={formatearEuros(resultado.rendimientoNetoTrabajoCentimos)}
              />
              <DatoResultado
                etiqueta="Capital inmobiliario neto"
                ayuda={AYUDAS_RESUMEN["Capital inmobiliario neto"]}
                valor={formatearEuros(
                  resultado.rendimientoNetoCapitalInmobiliarioCentimos
                )}
              />
              <DatoResultado
                etiqueta="Ganancia patrimonial exenta"
                ayuda={AYUDAS_RESUMEN["Ganancia patrimonial exenta"]}
                valor={formatearEuros(
                  resultado.gananciaPatrimonialExentaCentimos
                )}
              />
              <DatoResultado
                etiqueta="Base ahorro"
                ayuda={AYUDAS_RESUMEN["Base ahorro"]}
                valor={formatearEuros(resultado.baseLiquidableAhorroCentimos)}
              />
              <DatoResultado
                etiqueta="Base liquidable"
                ayuda={AYUDAS_RESUMEN["Base liquidable"]}
                valor={formatearEuros(resultado.baseLiquidableGeneralCentimos)}
              />
              <DatoResultado
                etiqueta="Cuota líquida"
                ayuda={AYUDAS_RESUMEN["Cuota líquida"]}
                valor={formatearEuros(resultado.cuotaLiquidaCentimos)}
              />
              <DatoResultado
                etiqueta="Deducciones autonómicas"
                ayuda={AYUDAS_RESUMEN["Deducciones autonómicas"]}
                valor={formatearEuros(resultado.deduccionesAutonomicasCentimos)}
              />
              <DatoResultado
                etiqueta="Retenciones/pagos a cuenta"
                ayuda={AYUDAS_RESUMEN["Retenciones/pagos a cuenta"]}
                valor={formatearEuros(
                  resultado.retencionesYPagosACuentaCentimos
                )}
              />
              <DatoResultado
                etiqueta="Cuota diferencial"
                ayuda={AYUDAS_RESUMEN["Cuota diferencial"]}
                valor={formatearEuros(resultado.cuotaDiferencialCentimos)}
              />
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
                {paso.lineasCalculo?.length ? (
                  <dl className="mt-4 grid gap-2">
                    {paso.lineasCalculo.map((linea) => (
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
          className="mt-3 inline-block border-b border-current text-sm font-bold"
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

function DatoResultado({
  ayuda,
  etiqueta,
  valor,
}: {
  readonly ayuda: string
  readonly etiqueta: string
  readonly valor: string
}) {
  return (
    <div className="border border-[var(--rule)] bg-[var(--paper-2)] p-3">
      <dt className="text-xs text-[var(--ink-soft)]">
        <Tooltip contenido={ayuda}>
          <button
            className="cursor-help border-b border-dotted border-current text-left"
            type="button"
          >
            {etiqueta}
          </button>
        </Tooltip>
      </dt>
      <dd className="mt-1 font-bold">{valor}</dd>
    </div>
  )
}
