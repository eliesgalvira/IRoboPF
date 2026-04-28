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

  return typeof valor === "number" ? valor : 0
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

  return typeof valor === "string" ? valor : ""
}

const importeSi = (condicion: boolean, importe: number): number =>
  condicion ? importe : 0

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

export const CONTROLES_DEDUCCIONES_ESPECIFICAS = {
  andalucia_nacimiento_adopcion_acogimiento_menores: {
    andaluciaHijosNacimientoAdopcion: 1,
  },
  andalucia_familia_monoparental_ascendientes_mayores_75: {
    andaluciaFamiliaMonoparental: true,
    andaluciaAscendientesMayores75: 1,
  },
  andalucia_adopcion_internacional: {
    andaluciaHijosAdopcionInternacional: 1,
    andaluciaAdopcionInternacionalCumpleLimites: true,
  },
  andalucia_familia_numerosa: {
    andaluciaCategoriaFamiliaNumerosa: "general",
    andaluciaFamiliaNumerosaCumpleLimites: true,
  },
  andalucia_contribuyente_discapacidad: {
    andaluciaContribuyenteDiscapacidad: true,
    andaluciaContribuyenteDiscapacidadCumpleLimites: true,
  },
  andalucia_conyuge_pareja_discapacidad: {
    andaluciaConyugeParejaDiscapacidad65: true,
    andaluciaConyugeParejaDiscapacidadCumpleRequisitos: true,
  },
  andalucia_asistencia_personas_discapacidad: {
    andaluciaPersonasDiscapacidadConMinimo: 1,
    andaluciaAsistenciaDiscapacidadCumpleLimites: true,
  },
  andalucia_ayuda_domestica: {
    andaluciaCuotasAyudaDomestica: 1000,
    andaluciaAyudaDomesticaCumpleRequisitos: true,
  },
  andalucia_inversion_acciones_participaciones_mercantiles: {
    andaluciaInversionAccionesImporte: 1000,
    andaluciaInversionAccionesCumpleRequisitos: true,
  },
  aragon_nacimiento_adopcion_tercer_hijo_sucesivos: {
    aragonTercerHijoSucesivos: 1,
  },
  aragon_cuidado_personas_dependientes: {
    aragonPersonasDependientes: 1,
    aragonDependientesCumpleLimites: true,
  },
  aragon_mayores_70: {
    aragonMayor70CumpleRequisitos: true,
  },
  canarias_nacimiento_adopcion_hijos: {
    canariasHijosNacimientoAdopcion: 1,
    canariasNacimientoCumpleLimites: true,
  },
  canarias_discapacidad_mayores_65: {
    canariasContribuyenteDiscapacidad33: true,
    canariasDiscapacidadMayoresCumpleLimites: true,
  },
  canarias_familia_numerosa: {
    canariasCategoriaFamiliaNumerosa: "general",
  },
  canarias_contribuyentes_desempleados: {
    canariasDesempleadoCumpleRequisitos: true,
  },
  clm_nacimiento_adopcion_hijos: {
    clmPartosAdopcionesUnHijo: 1,
    clmNacimientoCumpleLimites: true,
  },
  clm_familia_numerosa: {
    clmCategoriaFamiliaNumerosa: "general",
    clmFamiliaNumerosaCumpleLimites: true,
  },
  clm_discapacidad_contribuyente: {
    clmContribuyenteDiscapacidad65: true,
    clmDiscapacidadContribuyenteCumpleLimites: true,
  },
  clm_discapacidad_ascendientes_descendientes: {
    clmAscDescDiscapacidad65: 1,
    clmAscDescDiscapacidadCumpleLimites: true,
  },
  madrid_nacimiento_adopcion_hijos: {
    madridHijosNacimientoAdopcion: 1,
  },
  cataluna_viudedad_2023_2024_2025: {
    catalunyaViudedad: true,
  },
  cataluna_rehabilitacion_vivienda_habitual: {
    catalunyaRehabilitacionVivienda: 1000,
  },
  cataluna_intereses_prestamos_master_doctorado: {
    catalunyaInteresesMasterDoctorado: 100,
  },
  cataluna_alquiler_victimas_violencia_machista: {
    catalunyaAlquilerVictima: 1000,
    catalunyaVictimaViolenciaMachista: true,
  },
  cataluna_inversion_cooperativas_agrarias_vivienda: {
    catalunyaAportacionesCooperativas: 1000,
  },
} as const satisfies Record<string, EntradasDeduccionesAutonomicas>

export const CODIGOS_DEDUCCIONES_CON_CONTROL_ESPECIFICO = new Set(
  Object.keys(CONTROLES_DEDUCCIONES_ESPECIFICAS)
)

const IMPORTES_ESPERADOS_CONTROLES_ESPECIFICOS = {
  andalucia_nacimiento_adopcion_acogimiento_menores: 200,
  andalucia_familia_monoparental_ascendientes_mayores_75: 200,
  andalucia_adopcion_internacional: 600,
  andalucia_familia_numerosa: 200,
  andalucia_contribuyente_discapacidad: 150,
  andalucia_conyuge_pareja_discapacidad: 100,
  andalucia_asistencia_personas_discapacidad: 100,
  andalucia_ayuda_domestica: 200,
  andalucia_inversion_acciones_participaciones_mercantiles: 200,
  aragon_nacimiento_adopcion_tercer_hijo_sucesivos: 500,
  aragon_cuidado_personas_dependientes: 150,
  aragon_mayores_70: 75,
  canarias_nacimiento_adopcion_hijos: 265,
  canarias_discapacidad_mayores_65: 400,
  canarias_familia_numerosa: 597,
  canarias_contribuyentes_desempleados: 120,
  clm_nacimiento_adopcion_hijos: 100,
  clm_familia_numerosa: 200,
  clm_discapacidad_contribuyente: 300,
  clm_discapacidad_ascendientes_descendientes: 300,
  madrid_nacimiento_adopcion_hijos: 721.7,
  cataluna_viudedad_2023_2024_2025: 150,
  cataluna_rehabilitacion_vivienda_habitual: 15,
  cataluna_intereses_prestamos_master_doctorado: 100,
  cataluna_alquiler_victimas_violencia_machista: 200,
  cataluna_inversion_cooperativas_agrarias_vivienda: 200,
} as const satisfies Record<
  keyof typeof CONTROLES_DEDUCCIONES_ESPECIFICAS,
  number
>

const entradasCon = (
  entradas: EntradasDeduccionesAutonomicas
): EntradasDeduccionesAutonomicas => ({
  ...ENTRADAS_DEDUCCIONES_INICIALES,
  ...entradas,
})

const entradasGenericasPara = (
  deduccion: FichaDeduccionAutonomica
): EntradasDeduccionesAutonomicas => {
  const claveCumple = `${deduccion.codigo}:cumple`

  if (deduccion.cuantia.tipo === "importe_fijo") {
    return entradasCon({
      [claveCumple]: true,
      [`${deduccion.codigo}:unidades`]: 1,
    })
  }
  if (deduccion.cuantia.tipo === "porcentaje") {
    return entradasCon({
      [claveCumple]: true,
      [`${deduccion.codigo}:base`]: 1000,
    })
  }

  return entradasCon({
    [claveCumple]: true,
    [`${deduccion.codigo}:importe`]: 123,
  })
}

const importeEsperadoGenericoPara = (
  deduccion: FichaDeduccionAutonomica
): number => {
  if (deduccion.cuantia.tipo === "importe_fijo") {
    return Number(deduccion.cuantia.euros)
  }
  if (deduccion.cuantia.tipo === "porcentaje") {
    const importe = 1000 * (Number(deduccion.cuantia.porcentaje) / 100)

    return Math.min(
      importe,
      deduccion.cuantia.limiteMaximoEuros
        ? Number(deduccion.cuantia.limiteMaximoEuros)
        : importe
    )
  }

  return 123
}

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
  const unidades = Math.max(
    1,
    numeroDeduccion(entradas, `${deduccion.codigo}:unidades`)
  )

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

export const calcularDeduccionesAutonomicasAplicadas = (
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
    textoDeduccion(entradas, "andaluciaCategoriaFamiliaNumerosa") === "especial"
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
  const canariasNacimientoPorHijo =
    textoDeduccion(entradas, "canariasOrdenHijoNacimientoAdopcion") ===
    "tercero"
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
      numeroDeduccion(
        entradas,
        "canariasHijosNacimientoAdopcionDiscapacidad65"
      ) *
        (canariasNacimientoPorHijo <= 265 ? 600 : 1100)
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

export const obtenerControlDeduccionAutonomica = (
  deduccion: FichaDeduccionAutonomica
): ControlDeduccionAutonomica | null => {
  if (deduccion.estado !== "implementada") {
    return null
  }

  const entradasEspecificas =
    CONTROLES_DEDUCCIONES_ESPECIFICAS[
      deduccion.codigo as keyof typeof CONTROLES_DEDUCCIONES_ESPECIFICAS
    ]
  if (entradasEspecificas) {
    const entradasPrueba = entradasCon(entradasEspecificas)
    return {
      tipo: "especifico",
      codigo: deduccion.codigo,
      entradasPrueba,
      importeEsperadoPrueba:
        IMPORTES_ESPERADOS_CONTROLES_ESPECIFICOS[
          deduccion.codigo as keyof typeof CONTROLES_DEDUCCIONES_ESPECIFICAS
        ],
    }
  }

  const entradasPrueba = entradasGenericasPara(deduccion)
  return {
    tipo: "generico",
    codigo: deduccion.codigo,
    entradasPrueba,
    importeEsperadoPrueba: importeEsperadoGenericoPara(deduccion),
  }
}
