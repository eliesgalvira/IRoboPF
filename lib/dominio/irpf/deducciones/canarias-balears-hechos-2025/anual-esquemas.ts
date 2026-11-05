import { Schema } from "effect"
import {
  PagoCHechos,
  DonacionCHechos,
  ViviendaCHechos,
  InversionEntidadCHechos,
  AltaAutonomoCHechos,
  DestinoPlazaCHechos,
} from "./anual-esquemas-base"
import { RegistroHogarC36 } from "./anual-hogar"
const Texto = Schema.String.check(Schema.isMinLength(1))
const Numero = Schema.Number.check(Schema.isFinite())
const Intervalo = Schema.Struct({ desde: Texto, hasta: Texto })
const Familia = Schema.Struct({
  categoria: Schema.Literals([
    "ordinaria",
    "numerosa_general",
    "numerosa_especial",
    "monoparental_7_7",
  ]),
  titulo: Schema.String,
  titulares: Schema.Array(Texto),
  descendientes: Schema.Array(Texto),
  desde: Texto,
  hasta: Texto,
})
export const EstudioC36 = Schema.Struct({
  nivel: Schema.Literals([
    "universidad",
    "artistica_superior",
    "fp_superior",
    "otros_superiores",
    "infantil_segundo_ciclo",
    "primaria",
    "eso",
    "bachillerato",
    "fp",
  ]),
  centro: Texto,
  inicioCurso: Texto,
  creditos: Numero,
  curso: Schema.Literals(["completo", "parcial"]),
  ofertaPublicaPresencialIsla: Schema.Array(Texto),
  islaResidencia: Texto,
  islaCentro: Texto,
  municipioResidencia: Texto,
  municipioCentro: Texto,
  municipioAlojamiento: Schema.String,
  municipiosLimitrofes: Schema.Array(Texto),
  alojamiento: Schema.String,
  estadoCivil: Schema.Literals(["soltero", "casado"]),
  sostenimiento: Texto,
})
const Persona = Schema.Struct({
  id: Texto,
  convivencia: Schema.Array(Intervalo),
  expediente: Schema.optional(Texto),
  inscripcionCivil: Schema.optional(Texto),
  progenitorPrevio: Schema.optional(Texto),
  ingresoCentroEspecializado: Schema.optional(Texto),
  estudio: Schema.optional(EstudioC36),
  diagnosticoELA: Schema.optional(Texto),
  gastos: Schema.optional(
    Schema.Array(
      Schema.Struct({
        ...PagoCHechos.fields,
        concepto: Schema.Literals(["libro", "tratamiento_ela", "prima_seguro"]),
      })
    )
  ),
})
const Hogar = Schema.Struct({
  empleado: Texto,
  altaSistema: Texto,
  viviendaHabitual: Texto,
  pagos: Schema.Array(PagoCHechos),
  asistencia: Schema.Array(Texto),
})
const MarcoFamilia = Schema.Struct({
  nacimientoContribuyente: Texto,
  naturalezaDiscapacidad: Schema.Literals(["fisica_sensorial", "psiquica"]),
  resolucionDiscapacidad: Schema.String,
  familia: Familia,
  residenciaFiscal2024: Schema.Literals(["canarias", "illes-balears", "otra"]),
  documentoResidencia2024: Schema.String,
  altasRETA: Schema.Array(Intervalo),
  alteracionFamilia: Schema.String,
  otrosConvivientes: Schema.Array(Texto),
})

export const CODIGOS_DONACIONES = [
  "canarias_donaciones_finalidad_ecologica",
  "canarias_donaciones_patrimonio_historico",
  "canarias_donaciones_fines_culturales_deportivos_investigacion_docencia",
  "canarias_donaciones_entidades_sin_animo_lucro",
  "balears_donaciones_investigacion_desarrollo_innovacion",
  "balears_fomento_lengua_catalana",
  "balears_mecenazgo_cultural_cientifico_tecnologico",
  "balears_mecenazgo_deportivo",
] as const
export const CODIGOS_VIVIENDA = [
  "canarias_restauracion_bienes_interes_cultural",
  "canarias_inversion_vivienda_habitual",
  "canarias_rehabilitacion_energetica_vivienda",
  "canarias_adecuacion_vivienda_discapacidad",
  "canarias_arrendamiento_dacion_pago",
  "canarias_adecuacion_inmueble_arrendamiento",
  "canarias_puesta_viviendas_mercado_arrendamiento",
  "canarias_alquiler_vivienda_habitual",
  "balears_mejora_sostenibilidad_vivienda",
  "balears_arrendador_vivienda_permanente_otros_gastos",
  "balears_arrendamiento_traslado_laboral",
  "balears_vivienda_ocupada_ilegalmente_suspension_lanzamiento",
  "balears_arrendamiento_vivienda_habitual",
] as const
export const CODIGOS_FAMILIA = [
  "canarias_acogimiento_menores",
  "canarias_familias_monoparentales",
  "canarias_familiares_dependientes_discapacidad",
  "canarias_cuotas_seguridad_social_empleados_hogar",
  "canarias_estudios_educacion_superior",
  "balears_estudios_superiores_fuera_isla",
  "balears_libros_texto",
  "balears_nacimiento",
  "balears_adopcion",
  "balears_gastos_ela",
] as const
export const CODIGOS_INVERSION = [
  "canarias_inversion_entidades_nuevas_reciente_creacion",
  "balears_inversion_entidades_nuevas_reciente_creacion",
] as const
export const DonacionesC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literals(CODIGOS_DONACIONES),
  hechos: Schema.Struct({
    donaciones: Schema.Array(DonacionCHechos),
    ordenTramoInicial: Schema.Array(Texto),
    historiaDonativos: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Texto,
          fecha: Texto,
          entidad: Texto,
          factura: Texto,
          importe: Texto,
        })
      )
    ),
    censoHistoria2023Y2024: Schema.optional(Schema.Literal("completo")),
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const ViviendaC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literals(CODIGOS_VIVIENDA),
  hechos: Schema.Struct({
    nacimientoContribuyente: Texto,
    viviendas: Schema.Array(
      Schema.Struct({
        ...ViviendaCHechos.fields,
        uso: Schema.Literals(["habitual_propia", "arrendada"]),
        propietarios: Schema.optional(
          Schema.Array(
            Schema.Struct({ persona: Texto, porcentaje: Texto, titulo: Texto })
          )
        ),
        certificadoNecesidadAccesibilidad: Schema.optional(Texto),
        historiaContratos: Schema.Array(
          Schema.Struct({ id: Texto, desde: Texto, hasta: Texto })
        ),
        censoContratos: Schema.Literal("completo_desde_adquisicion"),
      })
    ),
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const FamiliaC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literals(CODIGOS_FAMILIA),
  hechos: Schema.Struct({
    contribuyente: MarcoFamilia,
    personas: Schema.Array(Persona),
    cuotasHogar: Schema.Array(Hogar),
    registroHogar: Schema.optional(RegistroHogarC36),
    ayudasNacimiento: Schema.Array(PagoCHechos),
    registroCobrosNacimiento: Schema.optional(
      Schema.Struct({
        consulta: Texto,
        censo: Schema.Literal("completo"),
        cobros: Schema.Array(
          Schema.Struct({
            id: Texto,
            fecha: Texto,
            beneficiario: Texto,
            resolucion: Texto,
            importe: Texto,
          })
        ),
      })
    ),
    // Hechos registrales; no se admite un orden fiscal suministrado.
    registroPartoMultiple: Schema.optional(
      Schema.Struct({
        documento: Texto,
        nacidos: Schema.Array(Schema.Struct({
          persona: Texto,
          fechaNacimiento: Texto,
          secuenciaParto: Numero,
        })),
      })
    ),
    filiacionAdopcion: Schema.optional(
      Schema.Struct({
        hijo: Texto,
        fechaConstitucion: Texto,
        documento: Texto,
        censo: Schema.Literal("completo_al_constituirse"),
        progenitoresPrevios: Schema.Array(Texto),
        conyugesOParejas: Schema.Array(Texto),
      })
    ),
    censoDescendientes: Schema.Array(Texto),
    censoPersonas: Schema.Literal("completo_segun_nucleo_v4"),
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const InversionC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literals(CODIGOS_INVERSION),
  hechos: Schema.Struct({
    inversiones: Schema.Array(InversionEntidadCHechos),
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const AutoocupacionC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literal("balears_fomento_autoocupacion"),
  hechos: Schema.Struct({
    altas: Schema.Array(AltaAutonomoCHechos),
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const PlazasC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literal("balears_plazas_dificil_cobertura"),
  hechos: Schema.Struct({
    destinos: Schema.Array(DestinoPlazaCHechos),
    gastos: Schema.Array(
      Schema.Struct({
        ...PagoCHechos.fields,
        concepto: Schema.Literals([
          "intereses_hipoteca_habitual",
          "alquiler_habitual",
          "transporte_aereo_interinsular",
          "transporte_maritimo_interinsular",
        ]),
      })
    ),
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const EmergenciaC36 = Schema.Struct({
  lote: Schema.Literal("C36"),
  codigo: Schema.Literal(
    "balears_subvenciones_zona_emergencia_proteccion_civil"
  ),
  hechos: Schema.Struct({
    ingresoId: Texto,
    exhaustividad: Schema.Literal("completa"),
  }),
})
export const SolicitudAnualC36 = Schema.Union([
  DonacionesC36,
  ViviendaC36,
  FamiliaC36,
  InversionC36,
  AutoocupacionC36,
  PlazasC36,
  EmergenciaC36,
])
export type SolicitudAnualC36 = typeof SolicitudAnualC36.Type
