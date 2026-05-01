import { Match, Option } from "effect"

import type { ComunidadAutonoma } from "../irpf/caso-fiscal-anual"
import type { AnioFiscal } from "../normativa/anio-fiscal"

export type MagnitudAuditada =
  | "irpf_final"
  | "cotizacion_trabajador"
  | "cotizacion_empresarial"
  | "salario_neto_anual"
  | "coste_laboral"
  | "carga_fiscal_efectiva"

export type EstrategiaProyeccionSalarial =
  | "salario_bruto_real_constante"
  | "coste_laboral_real_constante"
  | "trayectoria_salarial_propia"

export type PerfilAuditoriaNormativa =
  | "soltero_sin_hijos"
  | "pareja_con_hijos"
  | "trabajador_medio_comunidad"
  | "trabajador_mediano_comunidad"
  | "distribucion_sintetica_comunidad"

export interface VarianteAuditoriaNormativaHistorica {
  readonly magnitudAuditada: MagnitudAuditada
  readonly estrategiaProyeccionSalarial: EstrategiaProyeccionSalarial
}

export interface EscenarioAuditoriaNormativaHistorica {
  readonly perfil: PerfilAuditoriaNormativa
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly anioReferencia: AnioFiscal
  readonly anioComparado: AnioFiscal
  readonly magnitudAuditada: MagnitudAuditada
  readonly estrategiaProyeccionSalarial: EstrategiaProyeccionSalarial
}

export interface ContratoUrlAuditoriaNormativaHistoricaV1 {
  readonly v: 1
  readonly perfil: PerfilAuditoriaNormativa
  readonly anioReferencia: AnioFiscal
  readonly periodo: string
  readonly estrategiaSalario: EstrategiaProyeccionSalarial
  readonly magnitud: MagnitudAuditada
  readonly medida?: string
  readonly paquete?: string
  readonly comunidad: ComunidadAutonoma
  readonly salario?: number
  readonly vista?: string
}

export const varianteAuditoriaPorDefecto = {
  magnitudAuditada: "irpf_final",
  estrategiaProyeccionSalarial: "salario_bruto_real_constante",
} as const satisfies VarianteAuditoriaNormativaHistorica

export const escenarioAuditoriaPorDefecto = {
  perfil: "soltero_sin_hijos",
  comunidadAutonoma: "simulada-estatal",
  anioReferencia: 2026,
  anioComparado: 2019,
  ...varianteAuditoriaPorDefecto,
} as const satisfies EscenarioAuditoriaNormativaHistorica

export const escenarioPermiteReferenciaTecnica2026 = (
  escenario: Pick<
    EscenarioAuditoriaNormativaHistorica,
    "perfil" | "comunidadAutonoma"
  >
): boolean =>
  Match.value(escenario).pipe(
    Match.when(
      {
        perfil: "soltero_sin_hijos",
        comunidadAutonoma: "simulada-estatal",
      },
      () => true
    ),
    Match.orElse(() => false)
  )

const normalizarAnioComparado = ({
  anioReferencia,
  anioComparado,
}: Pick<
  EscenarioAuditoriaNormativaHistorica,
  "anioReferencia" | "anioComparado"
>): AnioFiscal =>
  Match.value({ anioReferencia, anioComparado }).pipe(
    Match.withReturnType<AnioFiscal>(),
    Match.when({ anioReferencia: 2025, anioComparado: 2026 }, () => 2024),
    Match.when({ anioComparado: 2026 }, () => 2025),
    Match.orElse(({ anioComparado }) => anioComparado)
  )

export const normalizarEscenarioAuditoriaNormativa = (
  escenario: EscenarioAuditoriaNormativaHistorica
): EscenarioAuditoriaNormativaHistorica => {
  const anioReferencia = Match.value({
    anioReferencia: escenario.anioReferencia,
    permiteReferenciaTecnica2026:
      escenarioPermiteReferenciaTecnica2026(escenario),
  }).pipe(
    Match.when(
      { anioReferencia: 2026, permiteReferenciaTecnica2026: false },
      () => 2025 as const
    ),
    Match.orElse(({ anioReferencia }) => anioReferencia)
  )

  return {
    ...escenario,
    anioReferencia,
    anioComparado: normalizarAnioComparado({
      anioReferencia,
      anioComparado: escenario.anioComparado,
    }),
  }
}

export const perfilesAuditoriaNormativa = [
  "soltero_sin_hijos",
  "pareja_con_hijos",
  "trabajador_medio_comunidad",
  "trabajador_mediano_comunidad",
  "distribucion_sintetica_comunidad",
] as const satisfies ReadonlyArray<PerfilAuditoriaNormativa>

export const estrategiasAuditoriaNormativa = [
  "salario_bruto_real_constante",
  "coste_laboral_real_constante",
  "trayectoria_salarial_propia",
] as const satisfies ReadonlyArray<EstrategiaProyeccionSalarial>

export const magnitudesAuditoriaNormativa = [
  "irpf_final",
  "salario_neto_anual",
  "cotizacion_trabajador",
  "cotizacion_empresarial",
  "coste_laboral",
] as const satisfies ReadonlyArray<MagnitudAuditada>

export const comunidadesAuditoriaNormativa = [
  "simulada-estatal",
  "andalucia",
  "aragon",
  "asturias",
  "illes-balears",
  "canarias",
  "cantabria",
  "castilla-la-mancha",
  "castilla-y-leon",
  "catalunya",
  "extremadura",
  "galicia",
  "madrid",
  "murcia",
  "la-rioja",
  "comunitat-valenciana",
  "ceuta",
  "melilla",
] as const satisfies ReadonlyArray<ComunidadAutonoma>

export interface FichaOpcionAuditoriaNormativa<Valor extends string> {
  readonly valor: Valor
  readonly etiqueta: string
  readonly detalle: string
}

export interface LectorParametrosAuditoriaUrl {
  readonly get: (clave: string) => string | null
}

export type CambioEscenarioAuditoriaNormativa = Partial<
  EscenarioAuditoriaNormativaHistorica
>

export const describirPerfilAuditoriaNormativa = (
  perfil: PerfilAuditoriaNormativa
): FichaOpcionAuditoriaNormativa<PerfilAuditoriaNormativa> =>
  Match.value(perfil).pipe(
    Match.withReturnType<
      FichaOpcionAuditoriaNormativa<PerfilAuditoriaNormativa>
    >(),
    Match.when("soltero_sin_hijos", (valor) => ({
      valor,
      etiqueta: "SOLTERO",
      detalle: "Individual, sin hijos, autonomia estatal compatible",
    })),
    Match.when("pareja_con_hijos", (valor) => ({
      valor,
      etiqueta: "PAREJA HIJOS",
      detalle: "Hogar con hijos para futuros minimos familiares",
    })),
    Match.when("trabajador_medio_comunidad", (valor) => ({
      valor,
      etiqueta: "MEDIO CCAA",
      detalle: "Salario medio por comunidad autonoma",
    })),
    Match.when("trabajador_mediano_comunidad", (valor) => ({
      valor,
      etiqueta: "MEDIANO CCAA",
      detalle: "Salario mediano por comunidad autonoma",
    })),
    Match.when("distribucion_sintetica_comunidad", (valor) => ({
      valor,
      etiqueta: "DISTRIBUCION",
      detalle: "Rango salarial sintetico por comunidad",
    })),
    Match.exhaustive
  )

export const describirEstrategiaAuditoriaNormativa = (
  estrategia: EstrategiaProyeccionSalarial
): FichaOpcionAuditoriaNormativa<EstrategiaProyeccionSalarial> =>
  Match.value(estrategia).pipe(
    Match.withReturnType<
      FichaOpcionAuditoriaNormativa<EstrategiaProyeccionSalarial>
    >(),
    Match.when("salario_bruto_real_constante", (valor) => ({
      valor,
      etiqueta: "BRUTO REAL",
      detalle: "Salario bruto constante en euros reales",
    })),
    Match.when("coste_laboral_real_constante", (valor) => ({
      valor,
      etiqueta: "COSTE REAL",
      detalle: "Coste laboral constante en euros reales",
    })),
    Match.when("trayectoria_salarial_propia", (valor) => ({
      valor,
      etiqueta: "TRAYECTORIA",
      detalle: "Serie salarial declarada por perfil",
    })),
    Match.exhaustive
  )

export const describirMagnitudAuditoriaNormativa = (
  magnitud: MagnitudAuditada
): FichaOpcionAuditoriaNormativa<MagnitudAuditada> =>
  Match.value(magnitud).pipe(
    Match.withReturnType<FichaOpcionAuditoriaNormativa<MagnitudAuditada>>(),
    Match.when("irpf_final", (valor) => ({
      valor,
      etiqueta: "IRPF",
      detalle: "IRPF pagado de menos o de mas",
    })),
    Match.when("salario_neto_anual", (valor) => ({
      valor,
      etiqueta: "BOLSILLO",
      detalle: "Cambio en salario neto anual",
    })),
    Match.when("cotizacion_trabajador", (valor) => ({
      valor,
      etiqueta: "SS TRAB.",
      detalle: "Cotizacion soportada por el trabajador",
    })),
    Match.when("cotizacion_empresarial", (valor) => ({
      valor,
      etiqueta: "SS EMP.",
      detalle: "Cotizacion empresarial",
    })),
    Match.when("coste_laboral", (valor) => ({
      valor,
      etiqueta: "COSTE",
      detalle: "Coste laboral total",
    })),
    Match.when("carga_fiscal_efectiva", (valor) => ({
      valor,
      etiqueta: "CARGA",
      detalle: "Carga fiscal efectiva total",
    })),
    Match.exhaustive
  )

export const describirComunidadAutonomaAuditoria = (
  comunidad: ComunidadAutonoma
): FichaOpcionAuditoriaNormativa<ComunidadAutonoma> =>
  Match.value(comunidad).pipe(
    Match.withReturnType<FichaOpcionAuditoriaNormativa<ComunidadAutonoma>>(),
    Match.when("simulada-estatal", (valor) => ({
      valor,
      etiqueta: "Simulada estatal",
      detalle: "Escala estatal de compatibilidad",
    })),
    Match.when("andalucia", (valor) => ({
      valor,
      etiqueta: "Andalucía",
      detalle: "Comunidad Autónoma de Andalucía",
    })),
    Match.when("aragon", (valor) => ({
      valor,
      etiqueta: "Aragón",
      detalle: "Comunidad Autónoma de Aragón",
    })),
    Match.when("asturias", (valor) => ({
      valor,
      etiqueta: "Asturias",
      detalle: "Principado de Asturias",
    })),
    Match.when("illes-balears", (valor) => ({
      valor,
      etiqueta: "Illes Balears",
      detalle: "Illes Balears",
    })),
    Match.when("canarias", (valor) => ({
      valor,
      etiqueta: "Canarias",
      detalle: "Canarias",
    })),
    Match.when("cantabria", (valor) => ({
      valor,
      etiqueta: "Cantabria",
      detalle: "Cantabria",
    })),
    Match.when("castilla-la-mancha", (valor) => ({
      valor,
      etiqueta: "Castilla-La Mancha",
      detalle: "Castilla-La Mancha",
    })),
    Match.when("castilla-y-leon", (valor) => ({
      valor,
      etiqueta: "Castilla y León",
      detalle: "Castilla y León",
    })),
    Match.when("catalunya", (valor) => ({
      valor,
      etiqueta: "Catalunya",
      detalle: "Catalunya",
    })),
    Match.when("extremadura", (valor) => ({
      valor,
      etiqueta: "Extremadura",
      detalle: "Extremadura",
    })),
    Match.when("galicia", (valor) => ({
      valor,
      etiqueta: "Galicia",
      detalle: "Galicia",
    })),
    Match.when("madrid", (valor) => ({
      valor,
      etiqueta: "Madrid",
      detalle: "Comunidad de Madrid",
    })),
    Match.when("murcia", (valor) => ({
      valor,
      etiqueta: "Murcia",
      detalle: "Región de Murcia",
    })),
    Match.when("la-rioja", (valor) => ({
      valor,
      etiqueta: "La Rioja",
      detalle: "La Rioja",
    })),
    Match.when("comunitat-valenciana", (valor) => ({
      valor,
      etiqueta: "Comunitat Valenciana",
      detalle: "Comunitat Valenciana",
    })),
    Match.when("ceuta", (valor) => ({
      valor,
      etiqueta: "Ceuta",
      detalle: "Ciudad Autónoma de Ceuta",
    })),
    Match.when("melilla", (valor) => ({
      valor,
      etiqueta: "Melilla",
      detalle: "Ciudad Autónoma de Melilla",
    })),
    Match.exhaustive
  )

export const decodificarPerfilAuditoriaNormativa = (
  valor: string
): Option.Option<PerfilAuditoriaNormativa> =>
  Match.value(valor).pipe(
    Match.withReturnType<Option.Option<PerfilAuditoriaNormativa>>(),
    Match.when("soltero_sin_hijos", (perfil) => Option.some(perfil)),
    Match.when("pareja_con_hijos", (perfil) => Option.some(perfil)),
    Match.when("trabajador_medio_comunidad", (perfil) => Option.some(perfil)),
    Match.when("trabajador_mediano_comunidad", (perfil) =>
      Option.some(perfil)
    ),
    Match.when("distribucion_sintetica_comunidad", (perfil) =>
      Option.some(perfil)
    ),
    Match.orElse(() => Option.none())
  )

export const decodificarEstrategiaProyeccionSalarial = (
  valor: string
): Option.Option<EstrategiaProyeccionSalarial> =>
  Match.value(valor).pipe(
    Match.withReturnType<Option.Option<EstrategiaProyeccionSalarial>>(),
    Match.when("salario_bruto_real_constante", (estrategia) =>
      Option.some(estrategia)
    ),
    Match.when("coste_laboral_real_constante", (estrategia) =>
      Option.some(estrategia)
    ),
    Match.when("trayectoria_salarial_propia", (estrategia) =>
      Option.some(estrategia)
    ),
    Match.orElse(() => Option.none())
  )

export const decodificarMagnitudAuditada = (
  valor: string
): Option.Option<MagnitudAuditada> =>
  Match.value(valor).pipe(
    Match.withReturnType<Option.Option<MagnitudAuditada>>(),
    Match.when("irpf_final", (magnitud) => Option.some(magnitud)),
    Match.when("cotizacion_trabajador", (magnitud) => Option.some(magnitud)),
    Match.when("cotizacion_empresarial", (magnitud) => Option.some(magnitud)),
    Match.when("salario_neto_anual", (magnitud) => Option.some(magnitud)),
    Match.when("coste_laboral", (magnitud) => Option.some(magnitud)),
    Match.when("carga_fiscal_efectiva", (magnitud) => Option.some(magnitud)),
    Match.orElse(() => Option.none())
  )

export const decodificarComunidadAutonomaAuditoria = (
  valor: string
): Option.Option<ComunidadAutonoma> =>
  Match.value(valor).pipe(
    Match.withReturnType<Option.Option<ComunidadAutonoma>>(),
    Match.when("simulada-estatal", (comunidad) => Option.some(comunidad)),
    Match.when("andalucia", (comunidad) => Option.some(comunidad)),
    Match.when("aragon", (comunidad) => Option.some(comunidad)),
    Match.when("asturias", (comunidad) => Option.some(comunidad)),
    Match.when("illes-balears", (comunidad) => Option.some(comunidad)),
    Match.when("canarias", (comunidad) => Option.some(comunidad)),
    Match.when("cantabria", (comunidad) => Option.some(comunidad)),
    Match.when("castilla-la-mancha", (comunidad) => Option.some(comunidad)),
    Match.when("castilla-y-leon", (comunidad) => Option.some(comunidad)),
    Match.when("catalunya", (comunidad) => Option.some(comunidad)),
    Match.when("comunitat-valenciana", (comunidad) => Option.some(comunidad)),
    Match.when("extremadura", (comunidad) => Option.some(comunidad)),
    Match.when("galicia", (comunidad) => Option.some(comunidad)),
    Match.when("madrid", (comunidad) => Option.some(comunidad)),
    Match.when("murcia", (comunidad) => Option.some(comunidad)),
    Match.when("la-rioja", (comunidad) => Option.some(comunidad)),
    Match.when("ceuta", (comunidad) => Option.some(comunidad)),
    Match.when("melilla", (comunidad) => Option.some(comunidad)),
    Match.orElse(() => Option.none())
  )

const decodificarAnioFiscal = (valor: string): Option.Option<AnioFiscal> =>
  Match.value(Number(valor)).pipe(
    Match.withReturnType<Option.Option<AnioFiscal>>(),
    Match.when(2012, (anio) => Option.some(anio)),
    Match.when(2013, (anio) => Option.some(anio)),
    Match.when(2014, (anio) => Option.some(anio)),
    Match.when(2015, (anio) => Option.some(anio)),
    Match.when(2016, (anio) => Option.some(anio)),
    Match.when(2017, (anio) => Option.some(anio)),
    Match.when(2018, (anio) => Option.some(anio)),
    Match.when(2019, (anio) => Option.some(anio)),
    Match.when(2020, (anio) => Option.some(anio)),
    Match.when(2021, (anio) => Option.some(anio)),
    Match.when(2022, (anio) => Option.some(anio)),
    Match.when(2023, (anio) => Option.some(anio)),
    Match.when(2024, (anio) => Option.some(anio)),
    Match.when(2025, (anio) => Option.some(anio)),
    Match.when(2026, (anio) => Option.some(anio)),
    Match.orElse(() => Option.none())
  )

const leerValorUrl = (
  parametros: LectorParametrosAuditoriaUrl,
  clave: string
): Option.Option<string> => Option.fromNullishOr(parametros.get(clave))

const leerAnioComparadoDesdePeriodo = (
  parametros: LectorParametrosAuditoriaUrl
): Option.Option<AnioFiscal> =>
  leerValorUrl(parametros, "periodo").pipe(
    Option.flatMap((periodo) => Option.fromNullishOr(periodo.split("-").at(0))),
    Option.flatMap(decodificarAnioFiscal)
  )

export const leerEscenarioAuditoriaNormativaDesdeUrl = (
  parametros: LectorParametrosAuditoriaUrl
): EscenarioAuditoriaNormativaHistorica =>
  normalizarEscenarioAuditoriaNormativa({
    perfil: leerValorUrl(parametros, "perfil").pipe(
      Option.flatMap(decodificarPerfilAuditoriaNormativa),
      Option.getOrElse(() => escenarioAuditoriaPorDefecto.perfil)
    ),
    comunidadAutonoma: leerValorUrl(parametros, "comunidad").pipe(
      Option.flatMap(decodificarComunidadAutonomaAuditoria),
      Option.getOrElse(() => escenarioAuditoriaPorDefecto.comunidadAutonoma)
    ),
    anioReferencia: leerValorUrl(parametros, "anioReferencia").pipe(
      Option.flatMap(decodificarAnioFiscal),
      Option.getOrElse(() => escenarioAuditoriaPorDefecto.anioReferencia)
    ),
    anioComparado: leerAnioComparadoDesdePeriodo(parametros).pipe(
      Option.getOrElse(() => escenarioAuditoriaPorDefecto.anioComparado)
    ),
    estrategiaProyeccionSalarial: leerValorUrl(
      parametros,
      "estrategiaSalario"
    ).pipe(
      Option.flatMap(decodificarEstrategiaProyeccionSalarial),
      Option.getOrElse(
        () => escenarioAuditoriaPorDefecto.estrategiaProyeccionSalarial
      )
    ),
    magnitudAuditada: leerValorUrl(parametros, "magnitud").pipe(
      Option.flatMap(decodificarMagnitudAuditada),
      Option.getOrElse(() => escenarioAuditoriaPorDefecto.magnitudAuditada)
    ),
  })

export const construirContratoUrlAuditoriaNormativaV1 = ({
  perfil,
  comunidadAutonoma,
  anioReferencia,
  anioComparado,
  estrategiaProyeccionSalarial,
  magnitudAuditada,
}: EscenarioAuditoriaNormativaHistorica): ContratoUrlAuditoriaNormativaHistoricaV1 => ({
  v: 1,
  perfil,
  anioReferencia,
  periodo: `${anioComparado}-${anioReferencia}`,
  estrategiaSalario: estrategiaProyeccionSalarial,
  magnitud: magnitudAuditada,
  comunidad: comunidadAutonoma,
})

export const serializarContratoUrlAuditoriaNormativaV1 = (
  contrato: ContratoUrlAuditoriaNormativaHistoricaV1
): URLSearchParams => {
  const parametros = new URLSearchParams()
  parametros.set("v", String(contrato.v))
  parametros.set("perfil", contrato.perfil)
  parametros.set("anioReferencia", String(contrato.anioReferencia))
  parametros.set("periodo", contrato.periodo)
  parametros.set("estrategiaSalario", contrato.estrategiaSalario)
  parametros.set("magnitud", contrato.magnitud)
  parametros.set("comunidad", contrato.comunidad)
  return parametros
}

export const serializarEscenarioAuditoriaNormativa = (
  escenario: EscenarioAuditoriaNormativaHistorica
): URLSearchParams =>
  serializarContratoUrlAuditoriaNormativaV1(
    construirContratoUrlAuditoriaNormativaV1(
      normalizarEscenarioAuditoriaNormativa(escenario)
    )
  )

export const impactoDesdePerspectivaCiudadano = ({
  magnitud,
  resultadoRealCentimos,
  resultadoContrafactualCentimos,
}: {
  readonly magnitud: MagnitudAuditada
  readonly resultadoRealCentimos: number
  readonly resultadoContrafactualCentimos: number
}): number =>
  Match.value(magnitud).pipe(
    Match.when(
      "salario_neto_anual",
      () => resultadoRealCentimos - resultadoContrafactualCentimos
    ),
    Match.orElse(() => resultadoContrafactualCentimos - resultadoRealCentimos)
  )
