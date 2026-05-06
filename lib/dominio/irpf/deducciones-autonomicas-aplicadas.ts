import { Array as EffectArray, Match, Option } from "effect"

import {
  DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS,
  type FichaDeduccionAutonomica,
} from "../normativa/datos/deducciones-autonomicas-2025"

export type EntradasDeduccionesAutonomicas = {
  readonly [clave: string]: boolean | number | string
}

export const ENTRADAS_DEDUCCIONES_INICIALES: EntradasDeduccionesAutonomicas = {
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

export const numeroDeduccion = (
  entradas: EntradasDeduccionesAutonomicas,
  clave: string
): number => {
  const valor = entradas[clave]

  return Match.value(valor).pipe(
    Match.when(Match.number, (valor) => valor),
    Match.orElse(() => 0)
  )
}

export const booleanoDeduccion = (
  entradas: EntradasDeduccionesAutonomicas,
  clave: string
): boolean => entradas[clave] === true

export const textoDeduccion = (
  entradas: EntradasDeduccionesAutonomicas,
  clave: string
): string => {
  const valor = entradas[clave]

  return Match.value(valor).pipe(
    Match.when(Match.string, (valor) => valor),
    Match.orElse(() => "")
  )
}

const importeSi = (condicion: boolean, importe: number): number =>
  Match.value(condicion).pipe(
    Match.when(true, () => importe),
    Match.orElse(() => 0)
  )

const numeroSi = (
  condicion: boolean,
  valorVerdadero: number,
  valorFalso: number
): number =>
  Match.value(condicion).pipe(
    Match.when(true, () => valorVerdadero),
    Match.orElse(() => valorFalso)
  )

const limitarImporteMaximo = (
  importe: number,
  limiteMaximoEuros?: unknown
): number =>
  Match.value(limiteMaximoEuros).pipe(
    Match.when(Match.undefined, () => importe),
    Match.orElse((limiteMaximoEuros) =>
      Math.min(importe, Number(limiteMaximoEuros))
    )
  )

export type ControlDeduccionAutonomica =
  | {
      readonly tipo: "especifico"
      readonly codigo: string
      readonly entradasPrueba: EntradasDeduccionesAutonomicas
      readonly importeEsperadoPrueba: number
    }
  | {
      readonly tipo: "generico"
      readonly codigo: string
      readonly entradasPrueba: EntradasDeduccionesAutonomicas
      readonly importeEsperadoPrueba: number
    }

type FormulaDeduccionEspecificaAutonomica =
  | { readonly tipo: "calculo_existente" }
  | {
      readonly tipo: "importe_manual"
      readonly importeEsperadoPrueba: number
    }

type DeduccionEspecificaAutonomica<Codigo extends string = string> = {
  readonly codigo: Codigo
  readonly entradasPrueba: EntradasDeduccionesAutonomicas
  readonly importeEsperadoPrueba: number
  readonly formula: FormulaDeduccionEspecificaAutonomica
}

const deduccionEspecificaControl = <const Codigo extends string>({
  codigo,
  entradasPrueba,
  importeEsperadoPrueba,
}: {
  readonly codigo: Codigo
  readonly entradasPrueba: EntradasDeduccionesAutonomicas
  readonly importeEsperadoPrueba: number
}): DeduccionEspecificaAutonomica<Codigo> => ({
  codigo,
  entradasPrueba,
  importeEsperadoPrueba,
  formula: { tipo: "calculo_existente" },
})

const deduccionEspecificaManual = <const Codigo extends string>({
  codigo,
  importeEsperadoPrueba = 123,
}: {
  readonly codigo: Codigo
  readonly importeEsperadoPrueba?: number
}): DeduccionEspecificaAutonomica<Codigo> => ({
  codigo,
  entradasPrueba: {
    [`${codigo}:cumple`]: true,
    [`${codigo}:importe`]: importeEsperadoPrueba,
  },
  importeEsperadoPrueba,
  formula: {
    tipo: "importe_manual",
    importeEsperadoPrueba,
  },
})

export const ANDALUCIA_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaControl({
    codigo: "andalucia_nacimiento_adopcion_acogimiento_menores",
    entradasPrueba: {
      andaluciaHijosNacimientoAdopcion: 1,
    },
    importeEsperadoPrueba: 200,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_familia_monoparental_ascendientes_mayores_75",
    entradasPrueba: {
      andaluciaFamiliaMonoparental: true,
      andaluciaAscendientesMayores75: 1,
    },
    importeEsperadoPrueba: 200,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_adopcion_internacional",
    entradasPrueba: {
      andaluciaHijosAdopcionInternacional: 1,
      andaluciaAdopcionInternacionalCumpleLimites: true,
    },
    importeEsperadoPrueba: 600,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_familia_numerosa",
    entradasPrueba: {
      andaluciaCategoriaFamiliaNumerosa: "general",
      andaluciaFamiliaNumerosaCumpleLimites: true,
    },
    importeEsperadoPrueba: 200,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_contribuyente_discapacidad",
    entradasPrueba: {
      andaluciaContribuyenteDiscapacidad: true,
      andaluciaContribuyenteDiscapacidadCumpleLimites: true,
    },
    importeEsperadoPrueba: 150,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_conyuge_pareja_discapacidad",
    entradasPrueba: {
      andaluciaConyugeParejaDiscapacidad65: true,
      andaluciaConyugeParejaDiscapacidadCumpleRequisitos: true,
    },
    importeEsperadoPrueba: 100,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_asistencia_personas_discapacidad",
    entradasPrueba: {
      andaluciaPersonasDiscapacidadConMinimo: 1,
      andaluciaAsistenciaDiscapacidadCumpleLimites: true,
    },
    importeEsperadoPrueba: 100,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_ayuda_domestica",
    entradasPrueba: {
      andaluciaCuotasAyudaDomestica: 1000,
      andaluciaAyudaDomesticaCumpleRequisitos: true,
    },
    importeEsperadoPrueba: 200,
  }),
  deduccionEspecificaControl({
    codigo: "andalucia_inversion_acciones_participaciones_mercantiles",
    entradasPrueba: {
      andaluciaInversionAccionesImporte: 1000,
      andaluciaInversionAccionesCumpleRequisitos: true,
    },
    importeEsperadoPrueba: 200,
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const ARAGON_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaControl({
    codigo: "aragon_nacimiento_adopcion_tercer_hijo_sucesivos",
    entradasPrueba: {
      aragonTercerHijoSucesivos: 1,
    },
    importeEsperadoPrueba: 500,
  }),
  deduccionEspecificaControl({
    codigo: "aragon_cuidado_personas_dependientes",
    entradasPrueba: {
      aragonPersonasDependientes: 1,
      aragonDependientesCumpleLimites: true,
    },
    importeEsperadoPrueba: 150,
  }),
  deduccionEspecificaControl({
    codigo: "aragon_mayores_70",
    entradasPrueba: {
      aragonMayor70CumpleRequisitos: true,
    },
    importeEsperadoPrueba: 75,
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const ASTURIAS_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const BALEARS_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const CANARIAS_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaControl({
    codigo: "canarias_nacimiento_adopcion_hijos",
    entradasPrueba: {
      canariasHijosNacimientoAdopcion: 1,
      canariasNacimientoCumpleLimites: true,
    },
    importeEsperadoPrueba: 265,
  }),
  deduccionEspecificaControl({
    codigo: "canarias_discapacidad_mayores_65",
    entradasPrueba: {
      canariasContribuyenteDiscapacidad33: true,
      canariasDiscapacidadMayoresCumpleLimites: true,
    },
    importeEsperadoPrueba: 400,
  }),
  deduccionEspecificaControl({
    codigo: "canarias_familia_numerosa",
    entradasPrueba: {
      canariasCategoriaFamiliaNumerosa: "general",
    },
    importeEsperadoPrueba: 597,
  }),
  deduccionEspecificaControl({
    codigo: "canarias_contribuyentes_desempleados",
    entradasPrueba: {
      canariasDesempleadoCumpleRequisitos: true,
    },
    importeEsperadoPrueba: 120,
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const CANTABRIA_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const CLM_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaControl({
    codigo: "clm_nacimiento_adopcion_hijos",
    entradasPrueba: {
      clmPartosAdopcionesUnHijo: 1,
      clmNacimientoCumpleLimites: true,
    },
    importeEsperadoPrueba: 100,
  }),
  deduccionEspecificaControl({
    codigo: "clm_familia_numerosa",
    entradasPrueba: {
      clmCategoriaFamiliaNumerosa: "general",
      clmFamiliaNumerosaCumpleLimites: true,
    },
    importeEsperadoPrueba: 200,
  }),
  deduccionEspecificaControl({
    codigo: "clm_discapacidad_contribuyente",
    entradasPrueba: {
      clmContribuyenteDiscapacidad65: true,
      clmDiscapacidadContribuyenteCumpleLimites: true,
    },
    importeEsperadoPrueba: 300,
  }),
  deduccionEspecificaControl({
    codigo: "clm_discapacidad_ascendientes_descendientes",
    entradasPrueba: {
      clmAscDescDiscapacidad65: 1,
      clmAscDescDiscapacidadCumpleLimites: true,
    },
    importeEsperadoPrueba: 300,
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const CYL_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const CATALUNYA_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaControl({
    codigo: "cataluna_viudedad_2023_2024_2025",
    entradasPrueba: {
      catalunyaViudedad: true,
    },
    importeEsperadoPrueba: 150,
  }),
  deduccionEspecificaControl({
    codigo: "cataluna_rehabilitacion_vivienda_habitual",
    entradasPrueba: {
      catalunyaRehabilitacionVivienda: 1000,
    },
    importeEsperadoPrueba: 15,
  }),
  deduccionEspecificaControl({
    codigo: "cataluna_intereses_prestamos_master_doctorado",
    entradasPrueba: {
      catalunyaInteresesMasterDoctorado: 100,
    },
    importeEsperadoPrueba: 100,
  }),
  deduccionEspecificaControl({
    codigo: "cataluna_alquiler_victimas_violencia_machista",
    entradasPrueba: {
      catalunyaAlquilerVictima: 1000,
      catalunyaVictimaViolenciaMachista: true,
    },
    importeEsperadoPrueba: 200,
  }),
  deduccionEspecificaControl({
    codigo: "cataluna_inversion_cooperativas_agrarias_vivienda",
    entradasPrueba: {
      catalunyaAportacionesCooperativas: 1000,
    },
    importeEsperadoPrueba: 200,
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const EXTREMADURA_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const GALICIA_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaManual({ codigo: "galicia_familias_dos_hijos" }),
  deduccionEspecificaManual({ codigo: "galicia_acogimiento_menores" }),
  deduccionEspecificaManual({ codigo: "galicia_cuidado_hijos_menores" }),
  deduccionEspecificaManual({
    codigo: "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
  }),
  deduccionEspecificaManual({ codigo: "galicia_nuevas_tecnologias_hogares" }),
  deduccionEspecificaManual({
    codigo: "galicia_inversion_entidades_nuevas_reciente_creacion",
  }),
  deduccionEspecificaManual({
    codigo: "galicia_inversion_entidades_nuevas_financiacion",
  }),
  deduccionEspecificaManual({ codigo: "galicia_inversion_mab" }),
  deduccionEspecificaManual({ codigo: "galicia_donaciones_idi" }),
  deduccionEspecificaManual({
    codigo: "galicia_climatizacion_agua_caliente_renovables",
  }),
  deduccionEspecificaManual({
    codigo: "galicia_rehabilitacion_centros_historicos",
  }),
  deduccionEspecificaManual({ codigo: "galicia_inversion_empresas_agrarias" }),
  deduccionEspecificaManual({
    codigo: "galicia_ayudas_incendios_peifoga_2025",
  }),
  deduccionEspecificaManual({ codigo: "galicia_obras_eficiencia_energetica" }),
  deduccionEspecificaManual({
    codigo: "galicia_ayudas_deportistas_alto_nivel",
  }),
  deduccionEspecificaManual({ codigo: "galicia_aldeas_modelo" }),
  deduccionEspecificaManual({
    codigo: "galicia_inversion_proyectos_especial_interes",
  }),
  deduccionEspecificaManual({
    codigo: "galicia_adecuacion_inmueble_vacio_arrendamiento",
  }),
  deduccionEspecificaManual({
    codigo: "galicia_arrendamiento_viviendas_vacias",
  }),
  deduccionEspecificaManual({ codigo: "galicia_ayudas_ela_fenotipos" }),
  deduccionEspecificaManual({
    codigo: "galicia_libros_texto_material_escolar",
  }),
  deduccionEspecificaManual({ codigo: "galicia_ayudas_talidomida" }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const MADRID_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaControl({
    codigo: "madrid_nacimiento_adopcion_hijos",
    entradasPrueba: {
      madridHijosNacimientoAdopcion: 1,
    },
    importeEsperadoPrueba: 721.7,
  }),
  deduccionEspecificaManual({ codigo: "madrid_adopcion_internacional" }),
  deduccionEspecificaManual({ codigo: "madrid_acogimiento_familiar_menores" }),
  deduccionEspecificaManual({
    codigo: "madrid_acogimiento_mayores_65_discapacidad",
  }),
  deduccionEspecificaManual({ codigo: "madrid_cuidado_ascendientes" }),
  deduccionEspecificaManual({
    codigo: "madrid_gastos_arrendamiento_viviendas",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_arrendamiento_viviendas_vacias",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_donativos_fundaciones_clubes_deportivos",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_incremento_costes_financiacion_vivienda",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_cambio_residencia_municipio_despoblacion",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_vivienda_municipios_despoblacion",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_cuidado_hijos_mayores_dependientes_discapacidad",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_intereses_vivienda_jovenes_menores_30",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_intereses_estudios_grado_master_doctorado",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_vivienda_nacimiento_adopcion_hijos",
  }),
  deduccionEspecificaManual({ codigo: "madrid_condicion_familia_numerosa" }),
  deduccionEspecificaManual({
    codigo: "madrid_familias_dos_descendientes_ingresos_reducidos",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_inversion_entidades_nuevas_reciente_creacion",
  }),
  deduccionEspecificaManual({ codigo: "madrid_autoempleo_jovenes_menores_35" }),
  deduccionEspecificaManual({
    codigo: "madrid_inversiones_mercado_alternativo_bursatil",
  }),
  deduccionEspecificaManual({
    codigo: "madrid_inversiones_nuevos_contribuyentes_extranjero",
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const MURCIA_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaManual({ codigo: "murcia_vivienda_jovenes_hasta_40" }),
  deduccionEspecificaManual({
    codigo: "murcia_donativos_patrimonio_cultural_actividades",
  }),
  deduccionEspecificaManual({
    codigo: "murcia_donativos_investigacion_biosanitaria",
  }),
  deduccionEspecificaManual({
    codigo: "murcia_donaciones_bienes_patrimonio_cultural",
  }),
  deduccionEspecificaManual({ codigo: "murcia_dispositivos_ahorro_agua" }),
  deduccionEspecificaManual({
    codigo: "murcia_instalaciones_recursos_energeticos_renovables",
  }),
  deduccionEspecificaManual({
    codigo: "murcia_inversion_entidades_nuevas_reciente_creacion",
  }),
  deduccionEspecificaManual({ codigo: "murcia_inversion_mab" }),
  deduccionEspecificaManual({ codigo: "murcia_material_escolar_libros_texto" }),
  deduccionEspecificaManual({ codigo: "murcia_nacimiento_adopcion" }),
  deduccionEspecificaManual({ codigo: "murcia_contribuyentes_discapacidad" }),
  deduccionEspecificaManual({ codigo: "murcia_conciliacion" }),
  deduccionEspecificaManual({
    codigo: "murcia_acogimiento_mayores_65_discapacidad",
  }),
  deduccionEspecificaManual({ codigo: "murcia_mujeres_trabajadoras" }),
  deduccionEspecificaManual({
    codigo: "murcia_nueva_vivienda_o_ampliacion_familias_numerosas",
  }),
  deduccionEspecificaManual({ codigo: "murcia_familia_monoparental" }),
  deduccionEspecificaManual({ codigo: "murcia_ensenanza_idiomas" }),
  deduccionEspecificaManual({ codigo: "murcia_acceso_internet" }),
  deduccionEspecificaManual({ codigo: "murcia_vehiculos_electricos" }),
  deduccionEspecificaManual({ codigo: "murcia_recarga_vehiculos_electricos" }),
  deduccionEspecificaManual({
    codigo: "murcia_cristales_lentes_soluciones_limpieza",
  }),
  deduccionEspecificaManual({
    codigo: "murcia_deporte_actividades_saludables",
  }),
  deduccionEspecificaManual({ codigo: "murcia_enfermedades_raras" }),
  deduccionEspecificaManual({ codigo: "murcia_inversion_economia_social" }),
  deduccionEspecificaManual({
    codigo: "murcia_regimen_transitorio_inversion_vivienda_habitual",
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const RIOJA_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaManual({
    codigo: "rioja_vivienda_habitual_pequenos_municipios",
  }),
  deduccionEspecificaManual({
    codigo: "rioja_escuelas_infantiles_pequenos_municipios",
  }),
  deduccionEspecificaManual({
    codigo: "rioja_menor_acogimiento_guarda_adopcion",
  }),
  deduccionEspecificaManual({ codigo: "rioja_hijo_0_3_pequenos_municipios" }),
  deduccionEspecificaManual({ codigo: "rioja_hijo_0_3_escolarizado" }),
  deduccionEspecificaManual({ codigo: "rioja_vehiculos_electricos_nuevos" }),
  deduccionEspecificaManual({
    codigo: "rioja_fijacion_poblacion_ocupada_medio_rural",
  }),
  deduccionEspecificaManual({ codigo: "rioja_internet_jovenes_emancipados" }),
  deduccionEspecificaManual({ codigo: "rioja_luz_gas_jovenes_emancipados" }),
  deduccionEspecificaManual({
    codigo: "rioja_inversion_vivienda_jovenes_menores_36",
  }),
  deduccionEspecificaManual({ codigo: "rioja_bicicletas_pedaleo_no_asistido" }),
  deduccionEspecificaManual({
    codigo: "rioja_obras_rehabilitacion_vivienda_habitual",
  }),
  deduccionEspecificaManual({
    codigo: "rioja_adquisicion_construccion_vivienda_jovenes",
  }),
  deduccionEspecificaManual({ codigo: "rioja_segunda_vivienda_medio_rural" }),
  deduccionEspecificaManual({
    codigo: "rioja_adecuacion_vivienda_discapacidad",
  }),
  deduccionEspecificaManual({ codigo: "rioja_donaciones_fomento_mecenazgo" }),
  deduccionEspecificaManual({
    codigo: "rioja_cantidades_patrimonio_historico",
  }),
  deduccionEspecificaManual({ codigo: "rioja_ejercicio_fisico_deporte" }),
  deduccionEspecificaManual({ codigo: "rioja_enfermos_ela" }),
  deduccionEspecificaManual({
    codigo: "rioja_cuotas_organizaciones_profesionales_agrarias",
  }),
  deduccionEspecificaManual({
    codigo: "rioja_paliar_subida_intereses_hipotecarios",
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const VALENCIANA_DEDUCCIONES_ESPECIFICAS_2025 = [
  deduccionEspecificaManual({
    codigo: "valenciana_nacimiento_adopcion_multiples",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_nacimiento_adopcion_acogimiento_discapacidad",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_familia_numerosa_monoparental",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_custodia_guarderias_menores_3",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_conciliacion_trabajo_familia",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_discapacidad_65" }),
  deduccionEspecificaManual({
    codigo: "valenciana_empleados_hogar_cuidado_personas",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_arrendador_renta_precio_referencia",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_primera_vivienda_menores_35",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_vivienda_discapacidad" }),
  deduccionEspecificaManual({ codigo: "valenciana_vivienda_ayudas_publicas" }),
  deduccionEspecificaManual({
    codigo: "valenciana_arrendamiento_actividad_distinto_municipio",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_autoconsumo_renovables" }),
  deduccionEspecificaManual({
    codigo: "valenciana_donaciones_finalidad_ecologica",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_donaciones_bienes_patrimonio_cultural",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_donativos_conservacion_patrimonio_cultural",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_conservacion_patrimonio_cultural_titulares",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_donaciones_lengua_valenciana",
  }),
  deduccionEspecificaManual({
    codigo:
      "valenciana_donaciones_cesiones_fines_culturales_cientificos_deportivos",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_dos_o_mas_descendientes" }),
  deduccionEspecificaManual({
    codigo: "valenciana_incremento_costes_financiacion_vivienda",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_material_escolar" }),
  deduccionEspecificaManual({
    codigo: "valenciana_obras_conservacion_mejora_periodo",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_obras_conservacion_mejora_2014_2015",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_abonos_culturales" }),
  deduccionEspecificaManual({ codigo: "valenciana_vehiculos_orden_5_2020" }),
  deduccionEspecificaManual({
    codigo: "valenciana_inversion_entidades_nuevas_reciente_creacion",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_municipio_riesgo_despoblamiento",
  }),
  deduccionEspecificaManual({ codigo: "valenciana_tratamientos_fertilidad" }),
  deduccionEspecificaManual({ codigo: "valenciana_gastos_salud" }),
  deduccionEspecificaManual({ codigo: "valenciana_fomento_formacion_musical" }),
  deduccionEspecificaManual({
    codigo: "valenciana_ayudas_publicas_erte_covid",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_donaciones_covid_investigacion",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_donaciones_covid_gastos_crisis_sanitaria",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_dana_danos_materiales_vivienda_habitual",
  }),
  deduccionEspecificaManual({
    codigo: "valenciana_dana_aportaciones_fondos_propios_entidades",
  }),
] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const CEUTA_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const MELILLA_DEDUCCIONES_ESPECIFICAS_2025 =
  [] as const satisfies ReadonlyArray<DeduccionEspecificaAutonomica>

export const DEDUCCIONES_ESPECIFICAS_AUTONOMICAS_2025 = {
  andalucia: ANDALUCIA_DEDUCCIONES_ESPECIFICAS_2025,
  aragon: ARAGON_DEDUCCIONES_ESPECIFICAS_2025,
  asturias: ASTURIAS_DEDUCCIONES_ESPECIFICAS_2025,
  "illes-balears": BALEARS_DEDUCCIONES_ESPECIFICAS_2025,
  canarias: CANARIAS_DEDUCCIONES_ESPECIFICAS_2025,
  cantabria: CANTABRIA_DEDUCCIONES_ESPECIFICAS_2025,
  "castilla-la-mancha": CLM_DEDUCCIONES_ESPECIFICAS_2025,
  "castilla-y-leon": CYL_DEDUCCIONES_ESPECIFICAS_2025,
  catalunya: CATALUNYA_DEDUCCIONES_ESPECIFICAS_2025,
  extremadura: EXTREMADURA_DEDUCCIONES_ESPECIFICAS_2025,
  galicia: GALICIA_DEDUCCIONES_ESPECIFICAS_2025,
  madrid: MADRID_DEDUCCIONES_ESPECIFICAS_2025,
  murcia: MURCIA_DEDUCCIONES_ESPECIFICAS_2025,
  "la-rioja": RIOJA_DEDUCCIONES_ESPECIFICAS_2025,
  "comunitat-valenciana": VALENCIANA_DEDUCCIONES_ESPECIFICAS_2025,
  ceuta: CEUTA_DEDUCCIONES_ESPECIFICAS_2025,
  melilla: MELILLA_DEDUCCIONES_ESPECIFICAS_2025,
} as const
const deduccionesEspecificasAutonomicas = Object.values(
  DEDUCCIONES_ESPECIFICAS_AUTONOMICAS_2025
).flat()

const deduccionesEspecificasAutonomicasPorCodigo: ReadonlyMap<
  string,
  DeduccionEspecificaAutonomica
> = new Map(
  deduccionesEspecificasAutonomicas.map((deduccion) => [
    deduccion.codigo,
    deduccion,
  ])
)

export const CONTROLES_DEDUCCIONES_ESPECIFICAS = Object.fromEntries(
  deduccionesEspecificasAutonomicas.map((deduccion) => [
    deduccion.codigo,
    deduccion.entradasPrueba,
  ])
) as Record<string, EntradasDeduccionesAutonomicas>

const IMPORTES_ESPERADOS_CONTROLES_ESPECIFICOS = Object.fromEntries(
  deduccionesEspecificasAutonomicas.map((deduccion) => [
    deduccion.codigo,
    deduccion.importeEsperadoPrueba,
  ])
) as Record<string, number>

export const calcularDeduccionEspecificaAutonomica = (
  codigo: string,
  entradas: EntradasDeduccionesAutonomicas
): Option.Option<number> => {
  return Option.match(
    Option.fromNullishOr(
      deduccionesEspecificasAutonomicasPorCodigo.get(codigo)
    ),
    {
      onNone: () => Option.none(),
      onSome: (deduccion) =>
        Match.value(
          booleanoDeduccion(entradas, `${deduccion.codigo}:cumple`)
        ).pipe(
          Match.when(false, () => Option.some(0)),
          Match.orElse(() =>
            Match.value(deduccion.formula.tipo).pipe(
              Match.when("calculo_existente", () => Option.none<number>()),
              Match.when("importe_manual", () =>
                Option.some(
                  Math.round(
                    numeroDeduccion(entradas, `${deduccion.codigo}:importe`) *
                      100
                  ) / 100
                )
              ),
              Match.orElse(() => Option.none<number>())
            )
          )
        ),
    }
  )
}

export const CODIGOS_DEDUCCIONES_CON_CONTROL_ESPECIFICO = new Set(
  Object.keys(CONTROLES_DEDUCCIONES_ESPECIFICAS)
)

const entradasCon = (
  entradas: EntradasDeduccionesAutonomicas
): EntradasDeduccionesAutonomicas => ({
  ...ENTRADAS_DEDUCCIONES_INICIALES,
  ...entradas,
})

const entradasGenericasPara = (
  deduccion: FichaDeduccionAutonomica
): EntradasDeduccionesAutonomicas =>
  Match.value(deduccion.cuantia).pipe(
    Match.when({ tipo: "importe_fijo" }, () =>
      entradasCon({
        [`${deduccion.codigo}:cumple`]: true,
        [`${deduccion.codigo}:unidades`]: 1,
      })
    ),
    Match.when({ tipo: "porcentaje" }, () =>
      entradasCon({
        [`${deduccion.codigo}:cumple`]: true,
        [`${deduccion.codigo}:base`]: 1000,
      })
    ),
    Match.orElse(() =>
      entradasCon({
        [`${deduccion.codigo}:cumple`]: true,
        [`${deduccion.codigo}:importe`]: 123,
      })
    )
  )

const importeEsperadoGenericoPara = (
  deduccion: FichaDeduccionAutonomica
): number =>
  Match.value(deduccion.cuantia).pipe(
    Match.when({ tipo: "importe_fijo" }, (cuantia) => Number(cuantia.euros)),
    Match.when({ tipo: "porcentaje" }, (cuantia) => {
      const importe = 1000 * (Number(cuantia.porcentaje) / 100)

      return limitarImporteMaximo(importe, cuantia.limiteMaximoEuros)
    }),
    Match.orElse(() => 123)
  )

const calcularDeduccionGenerica = (
  deduccion: FichaDeduccionAutonomica,
  entradas: EntradasDeduccionesAutonomicas
): number => {
  const deduccionFinal = calcularDeduccionEspecificaAutonomica(
    deduccion.codigo,
    entradas
  )
  return Option.match(deduccionFinal, {
    onSome: (deduccionFinal) => deduccionFinal,
    onNone: () =>
      Match.value({
        controlEspecifico: CODIGOS_DEDUCCIONES_CON_CONTROL_ESPECIFICO.has(
          deduccion.codigo
        ),
        cumple: booleanoDeduccion(entradas, `${deduccion.codigo}:cumple`),
      }).pipe(
        Match.when({ controlEspecifico: true }, () => 0),
        Match.when({ cumple: false }, () => 0),
        Match.orElse(() => {
          const base = numeroDeduccion(entradas, `${deduccion.codigo}:base`)
          const unidades = Math.max(
            1,
            numeroDeduccion(entradas, `${deduccion.codigo}:unidades`)
          )

          return Match.value(deduccion.cuantia).pipe(
            Match.when(
              { tipo: "importe_fijo" },
              (cuantia) => Number(cuantia.euros) * unidades
            ),
            Match.when({ tipo: "porcentaje" }, (cuantia) => {
              const importe = base * (Number(cuantia.porcentaje) / 100)
              return limitarImporteMaximo(importe, cuantia.limiteMaximoEuros)
            }),
            Match.orElse(() =>
              numeroDeduccion(entradas, `${deduccion.codigo}:importe`)
            )
          )
        })
      ),
  })
}

export const calcularDeduccionesAutonomicasAplicadas = (
  entradas: EntradasDeduccionesAutonomicas
): number => {
  const andaluciaNacimiento =
    (numeroDeduccion(entradas, "andaluciaHijosNacimientoAdopcion") +
      numeroDeduccion(entradas, "andaluciaMenoresAcogidos")) *
    numeroSi(
      booleanoDeduccion(entradas, "andaluciaMunicipioDespoblacion"),
      400,
      200
    )
  const andaluciaMonoparental = importeSi(
    booleanoDeduccion(entradas, "andaluciaFamiliaMonoparental"),
    100 + numeroDeduccion(entradas, "andaluciaAscendientesMayores75") * 100
  )
  const andaluciaAdopcionInternacional = importeSi(
    booleanoDeduccion(entradas, "andaluciaAdopcionInternacionalCumpleLimites"),
    numeroDeduccion(entradas, "andaluciaHijosAdopcionInternacional") *
      600 *
      numeroSi(
        booleanoDeduccion(
          entradas,
          "andaluciaAdopcionInternacionalProrrateada"
        ),
        0.5,
        1
      )
  )
  const andaluciaFamiliaNumerosa = importeSi(
    booleanoDeduccion(entradas, "andaluciaFamiliaNumerosaCumpleLimites"),
    Match.value(
      textoDeduccion(entradas, "andaluciaCategoriaFamiliaNumerosa")
    ).pipe(
      Match.when("especial", () => 400),
      Match.when("general", () => 200),
      Match.orElse(() => 0)
    )
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
    booleanoDeduccion(entradas, "andaluciaAsistenciaDiscapacidadCumpleLimites"),
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
    Math.min(
      numeroDeduccion(entradas, "andaluciaCuotasAyudaDomestica") * 0.2,
      500
    )
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
  const canariasNacimientoPorHijo = Match.value(
    textoDeduccion(entradas, "canariasOrdenHijoNacimientoAdopcion")
  ).pipe(
    Match.when("tercero", () => 530),
    Match.when("cuarto", () => 796),
    Match.when("quinto-sucesivos", () => 928),
    Match.orElse(() => 265)
  )
  const canariasNacimiento = importeSi(
    booleanoDeduccion(entradas, "canariasNacimientoCumpleLimites"),
    numeroDeduccion(entradas, "canariasHijosNacimientoAdopcion") *
      canariasNacimientoPorHijo +
      numeroDeduccion(
        entradas,
        "canariasHijosNacimientoAdopcionDiscapacidad65"
      ) *
        numeroSi(canariasNacimientoPorHijo <= 265, 600, 1100)
  )
  const canariasDiscapacidadMayores = importeSi(
    booleanoDeduccion(entradas, "canariasDiscapacidadMayoresCumpleLimites"),
    importeSi(
      booleanoDeduccion(entradas, "canariasContribuyenteDiscapacidad33"),
      400
    ) +
      importeSi(
        booleanoDeduccion(entradas, "canariasContribuyenteMayor65"),
        160
      )
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
      booleanoDeduccion(entradas, "clmDiscapacidadContribuyenteCumpleLimites"),
    300
  )
  const clmDiscapacidadAscDesc = importeSi(
    booleanoDeduccion(entradas, "clmAscDescDiscapacidadCumpleLimites"),
    numeroDeduccion(entradas, "clmAscDescDiscapacidad65") * 300
  )
  const catalunyaViudedad = importeSi(
    booleanoDeduccion(entradas, "catalunyaViudedad"),
    numeroSi(
      booleanoDeduccion(entradas, "catalunyaViudedadConDescendientes"),
      300,
      150
    )
  )
  const catalunyaRehabilitacion = Math.min(
    numeroDeduccion(entradas, "catalunyaRehabilitacionVivienda") * 0.015,
    135.6
  )
  const catalunyaInteresesMasterDoctorado = numeroDeduccion(
    entradas,
    "catalunyaInteresesMasterDoctorado"
  )
  const deduccionesGenericas = EffectArray.reduce(
    DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor,
    0,
    (total, deduccion) => total + calcularDeduccionGenerica(deduccion, entradas)
  )
  const madridNacimiento =
    numeroDeduccion(entradas, "madridHijosNacimientoAdopcion") *
    721.7 *
    numeroSi(
      booleanoDeduccion(entradas, "madridProrrateoDosProgenitores"),
      0.5,
      1
    )
  const catalunyaAlquiler = importeSi(
    booleanoDeduccion(entradas, "catalunyaVictimaViolenciaMachista"),
    Math.min(
      numeroDeduccion(entradas, "catalunyaAlquilerVictima") *
        numeroSi(
          booleanoDeduccion(entradas, "catalunyaAlquilerIncrementado"),
          0.25,
          0.2
        ),
      numeroSi(
        booleanoDeduccion(entradas, "catalunyaAlquilerIncrementado"),
        1200,
        1000
      )
    )
  )
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

export const obtenerControlDeduccionAutonomica = (
  deduccion: FichaDeduccionAutonomica
): Option.Option<ControlDeduccionAutonomica> => {
  return Match.value(deduccion.estado).pipe(
    Match.not("implementada", () => Option.none<ControlDeduccionAutonomica>()),
    Match.orElse(() => {
      const entradasEspecificas =
        CONTROLES_DEDUCCIONES_ESPECIFICAS[
          deduccion.codigo as keyof typeof CONTROLES_DEDUCCIONES_ESPECIFICAS
        ]

      return Option.match(Option.fromNullishOr(entradasEspecificas), {
        onSome: (entradasEspecificas) => {
          const entradasPrueba = entradasCon(entradasEspecificas)
          return Option.some({
            tipo: "especifico",
            codigo: deduccion.codigo,
            entradasPrueba,
            importeEsperadoPrueba:
              IMPORTES_ESPERADOS_CONTROLES_ESPECIFICOS[
                deduccion.codigo as keyof typeof CONTROLES_DEDUCCIONES_ESPECIFICAS
              ],
          } satisfies ControlDeduccionAutonomica)
        },
        onNone: () => {
          const entradasPrueba = entradasGenericasPara(deduccion)
          return Option.some({
            tipo: "generico",
            codigo: deduccion.codigo,
            entradasPrueba,
            importeEsperadoPrueba: importeEsperadoGenericoPara(deduccion),
          } satisfies ControlDeduccionAutonomica)
        },
      })
    })
  )
}
