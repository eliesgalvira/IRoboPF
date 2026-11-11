import { HechosDT18Territoriales2025, HechosDerechoDT18Rioja2025 } from "../vivienda-dt18-2025/contrato"
import { HechosVehiculoDA58 } from "../vehiculo-da58-2025/productor"
import { SolicitudCuidadoCyl81 } from "../maternidad-2025/contrato"
import { SolicitudD51 } from "./d51-anual-esquemas"
import { SolicitudAnualC36 } from "./canarias-balears-hechos-2025/anual-esquemas"
import { SolicitudAragonDosAnual2025 } from "./aragon-dos-anual-esquemas"
import { SolicitudBAmpliadoAnual } from "./b-ampliado-anual-2025/esquemas"
// Contratos de hechos: sin bases, cuotas ni contexto anual externo.
import { Schema } from "effect"
import { SolicitudE38Anual2025 } from "./galicia-rioja-ampliacion-2025/anual-esquemas"
import { SolicitudAnualF2025 } from "./territorial-f-ampliacion-2025/anual-esquemas"
import { SolicitudAmpliacionAnualA2025 } from "./ampliacion-a-anual-esquemas"
import { SolicitudDonativosEstatales2025 } from "./donativos-estatales-2025/esquemas"
export const SolicitudDeduccionesTerritoriales2025 = Schema.Struct({
  viviendaDT182025: Schema.optionalKey(HechosDT18Territoriales2025),
  derechoInversionAlquilerRioja2025: Schema.optionalKey(HechosDerechoDT18Rioja2025),
  vehiculoDA582025: Schema.optionalKey(HechosVehiculoDA58),
  donativosEstatales2025: Schema.optionalKey(SolicitudDonativosEstatales2025),
  solicitudes: Schema.Array(
    Schema.Union([
      SolicitudCuidadoCyl81,
      SolicitudE38Anual2025,
      SolicitudD51,
      SolicitudAnualF2025,
      SolicitudAnualC36,
      SolicitudAragonDosAnual2025,
      SolicitudBAmpliadoAnual,
      SolicitudAmpliacionAnualA2025,
      Schema.Struct({
        lote: Schema.Literal("A"),
        hechos: Schema.Union([
          Schema.Struct({
            codigo: Schema.Union([
              Schema.Literal("cataluna_donativos_lengua_catalana_occitana"),
              Schema.Literal("cataluna_donativos_idi"),
              Schema.Literal(
                "cataluna_donaciones_medio_ambiente_patrimonio_natural"
              ),
            ]),
            donativos: Schema.Array(
              Schema.Struct({
                claseEntidad: Schema.Union([
                  Schema.Literal("iec"),
                  Schema.Literal("iea"),
                  Schema.Literal("privada-sin-lucro"),
                  Schema.Literal("sindicato"),
                  Schema.Literal("empresarial"),
                  Schema.Literal("colegio-corporacion"),
                  Schema.Literal("universidad-catalana"),
                  Schema.Literal("centro-universitario-catalan"),
                  Schema.Literal("centro-generalitat"),
                  Schema.Literal("fundacion"),
                  Schema.Literal("asociacion"),
                ]),
                censo: Schema.Union([
                  Schema.Literal("incluida"),
                  Schema.Literal("no-incluida"),
                  Schema.Literal("no-exigible"),
                ]),
                finalidad: Schema.Union([
                  Schema.Literal("lengua-catalana-occitana"),
                  Schema.Literal("investigacion-desarrollo-innovacion"),
                  Schema.Literal("medio-ambiente"),
                ]),
                modelo993: Schema.Struct({
                  ejercicioInformado: Schema.Literal(2025),
                  via: Schema.Literal("telematica"),
                  fecha: Schema.String,
                  referencia: Schema.String,
                }),
                fecha: Schema.String,
                entidad: Schema.String,
                calificacionEntidad: Schema.String,
                referenciaCenso: Schema.String,
                certificado: Schema.String,
                deduccionEstatalMismoDonativoCentimos: Schema.Number.check(
                  Schema.isFinite()
                ),
                id: Schema.String,
                pagador: Schema.String,
                importeCentimos: Schema.Number.check(Schema.isFinite()),
                justificante: Schema.String,
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("cataluna_nacimiento_adopcion_acogimiento"),
            eventos: Schema.Array(
              Schema.Struct({
                fecha: Schema.String,
                id: Schema.String,
                clase: Schema.Union([
                  Schema.Literal("nacimiento"),
                  Schema.Literal("adopcion"),
                  Schema.Literal("acogimiento"),
                ]),
                nacimiento: Schema.String,
                titulares: Schema.Array(Schema.String),
                familia: Schema.Union([
                  Schema.Literal("ordinaria"),
                  Schema.Literal("monoparental"),
                ]),
                normaAcogimiento: Schema.Union([
                  Schema.Literal("Ley14/2010"),
                  Schema.Literal("no-aplica"),
                ]),
                persona: Schema.String,
                tituloVinculo: Schema.String,
                tituloMonoparental: Schema.String,
                acuerdoAcogimiento: Schema.String,
                antecedenteAcogimiento: Schema.optionalKey(
                  Schema.Struct({
                    contribuyente: Schema.String,
                    estado: Schema.Union([
                      Schema.Literal("sin-acogimiento-previo"),
                      Schema.Literal("previo"),
                      Schema.Literal("desconocido"),
                    ]),
                    persona: Schema.String,
                    soporte: Schema.String,
                  })
                ),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("cataluna_viudedad_2023_2024_2025"),
            viudedad: Schema.Struct({
              fecha: Schema.String,
              certificado: Schema.String,
              descendientes: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  ejerciciosConMinimo: Schema.Array(
                    Schema.Number.check(Schema.isFinite())
                  ),
                  referenciaDerechos: Schema.String,
                })
              ),
            }),
          }),
          Schema.Struct({
            codigo: Schema.Literal(
              "cataluna_intereses_prestamos_master_doctorado"
            ),
            prestamos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                canal: Schema.Union([
                  Schema.Literal("AGAUR"),
                  Schema.Literal("otro"),
                ]),
                estudios: Schema.Union([
                  Schema.Literal("master"),
                  Schema.Literal("doctorado"),
                  Schema.Literal("otros"),
                ]),
                pagosIntereses: Schema.Array(
                  Schema.Struct({
                    fecha: Schema.String,
                    id: Schema.String,
                    pagador: Schema.String,
                    importeCentimos: Schema.Number.check(Schema.isFinite()),
                    justificante: Schema.String,
                  })
                ),
                prestatario: Schema.String,
                tituloConcesion: Schema.String,
              })
            ),
          }),
        ]),
      }),
      Schema.Struct({
        lote: Schema.Literal("B"),
        hechos: Schema.Union([
          Schema.Struct({
            codigo: Schema.Union([
              Schema.Literal("asturias_acogimiento_familiar_menores"),
              Schema.Literal("asturias_acogimiento_no_remunerado_mayores_65"),
            ]),
            personas: Schema.Array(
              Schema.Struct({
                titulares: Schema.Array(Schema.String),
                exhaustividadTitulares: Schema.Union([
                  Schema.Literal("completa"),
                  Schema.Literal("incompleta"),
                ]),
                id: Schema.String,
                nacimiento: Schema.String,
                diasConvivencia: Schema.Number.check(Schema.isFinite()),
                inicioAcogimiento: Schema.String,
                finAcogimiento: Schema.String,
                resolucion: Schema.Struct({
                  referencia: Schema.String,
                  organismo: Schema.String,
                  fecha: Schema.String,
                }),
                regimen: Schema.Union([
                  Schema.Literal("familiar"),
                  Schema.Literal("preadoptivo"),
                  Schema.Literal("no_remunerado_mayores"),
                ]),
                contraprestacion: Schema.String,
                ayudasAsturiasAcogedor: Schema.String,
                ayudasAsturiasAcogido: Schema.String,
                gradoParentesco: Schema.Union([
                  Schema.Null,
                  Schema.Number.check(Schema.isFinite()),
                ]),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal(
              "asturias_certificacion_gestion_forestal_sostenible"
            ),
            monte: Schema.String,
            municipioAsturias: Schema.String,
            fechaAdquisicionMonte: Schema.String,
            propietarios: Schema.Array(Schema.String),
            certificacion: Schema.Struct({
              referencia: Schema.String,
              organismo: Schema.String,
              fecha: Schema.String,
            }),
            emisor: Schema.Union([
              Schema.Literal("entidad_regional"),
              Schema.Literal("equivalente"),
            ]),
            pagosCertificacion: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                euros: Schema.String,
                documento: Schema.String,
                medio: Schema.Union([
                  Schema.Literal("tarjeta"),
                  Schema.Literal("transferencia"),
                  Schema.Literal("cheque_nominativo"),
                  Schema.Literal("ingreso"),
                  Schema.Literal("efectivo"),
                ]),
              })
            ),
            subvenciones: Schema.String,
            reparto: Schema.Struct({
              titulares: Schema.Array(Schema.String),
              exhaustividadTitulares: Schema.Union([
                Schema.Literal("completa"),
                Schema.Literal("incompleta"),
              ]),
            }),
          }),
          Schema.Struct({
            codigo: Schema.Literal("asturias_gastos_vitales_hasta_35"),
            nacimiento: Schema.String,
            gastos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                euros: Schema.String,
                documento: Schema.String,
                medio: Schema.Union([
                  Schema.Literal("tarjeta"),
                  Schema.Literal("transferencia"),
                  Schema.Literal("cheque_nominativo"),
                  Schema.Literal("ingreso"),
                  Schema.Literal("efectivo"),
                ]),
                concepto: Schema.Union([
                  Schema.Literal("vivienda_suministros"),
                  Schema.Literal("educacion"),
                  Schema.Literal("transporte_movilidad"),
                  Schema.Literal("tecnologia"),
                  Schema.Literal("deporte"),
                  Schema.Literal("cultura"),
                ]),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("asturias_vivienda_protegida"),
            reparto: Schema.Struct({
              titulares: Schema.Array(Schema.String),
              exhaustividadTitulares: Schema.Union([
                Schema.Literal("completa"),
                Schema.Literal("incompleta"),
              ]),
            }),
            vivienda: Schema.String,
            calificacion: Schema.Struct({
              referencia: Schema.String,
              organismo: Schema.String,
              fecha: Schema.String,
            }),
            fechaAdquisicionRehabilitacion: Schema.String,
            destino: Schema.Union([
              Schema.Literal("otro"),
              Schema.Literal("habitual"),
            ]),
            pagos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                euros: Schema.String,
                documento: Schema.String,
                medio: Schema.Union([
                  Schema.Literal("tarjeta"),
                  Schema.Literal("transferencia"),
                  Schema.Literal("cheque_nominativo"),
                  Schema.Literal("ingreso"),
                  Schema.Literal("efectivo"),
                ]),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal(
              "cantabria_traslado_estudios_despoblamiento"
            ),
            municipioResidencia: Schema.String,
            pruebaResidencia: Schema.Struct({
              referencia: Schema.String,
              organismo: Schema.String,
              fecha: Schema.String,
            }),
            hijos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                nacimiento: Schema.String,
                rentaAnual: Schema.String,
                progenitores: Schema.Array(Schema.String),
                inicioEstudios: Schema.String,
                finEstudios: Schema.String,
                relacion: Schema.Union([
                  Schema.Literal("otro"),
                  Schema.Literal("hijo"),
                ]),
                municipioEstudios: Schema.String,
                etapa: Schema.Union([
                  Schema.Literal("bachillerato"),
                  Schema.Literal("fp"),
                  Schema.Literal("universidad"),
                  Schema.Literal("otra"),
                ]),
                pagosTraslado: Schema.Array(
                  Schema.Struct({
                    id: Schema.String,
                    pagador: Schema.String,
                    receptor: Schema.String,
                    fecha: Schema.String,
                    euros: Schema.String,
                    documento: Schema.String,
                    medio: Schema.Union([
                      Schema.Literal("tarjeta"),
                      Schema.Literal("transferencia"),
                      Schema.Literal("cheque_nominativo"),
                      Schema.Literal("ingreso"),
                      Schema.Literal("efectivo"),
                    ]),
                  })
                ),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("cantabria_gastos_educacion"),
            gastos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                euros: Schema.String,
                documento: Schema.String,
                medio: Schema.Union([
                  Schema.Literal("tarjeta"),
                  Schema.Literal("transferencia"),
                  Schema.Literal("cheque_nominativo"),
                  Schema.Literal("ingreso"),
                  Schema.Literal("efectivo"),
                ]),
                descendiente: Schema.String,
                etapa: Schema.Union([
                  Schema.Literal("otra"),
                  Schema.Literal("primaria"),
                  Schema.Literal("eso"),
                ]),
                concepto: Schema.Union([
                  Schema.Literal("libros"),
                  Schema.Literal("idiomas_extraescolares"),
                ]),
                prestador: Schema.Union([
                  Schema.Literal("otro"),
                  Schema.Literal("centro_docente"),
                  Schema.Literal("centro_publico_privado"),
                  Schema.Literal("persona_iae"),
                ]),
              })
            ),
            unidadFamiliar: Schema.String,
            miembros: Schema.Array(Schema.String),
          }),
          Schema.Struct({
            codigo: Schema.Literal("cantabria_gastos_enfermedad"),
            gastos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                euros: Schema.String,
                documento: Schema.String,
                medio: Schema.Union([
                  Schema.Literal("tarjeta"),
                  Schema.Literal("transferencia"),
                  Schema.Literal("cheque_nominativo"),
                  Schema.Literal("ingreso"),
                  Schema.Literal("efectivo"),
                ]),
                paciente: Schema.String,
                concepto: Schema.Union([
                  Schema.Literal("otro"),
                  Schema.Literal("enfermedad"),
                  Schema.Literal("dental"),
                  Schema.Literal("embarazo_nacimiento"),
                  Schema.Literal("accidente_invalidez"),
                ]),
                honorarios: Schema.Union([
                  Schema.Literal("otro"),
                  Schema.Literal("profesional_sanitario"),
                ]),
                coberturaSSMutuaSeguro: Schema.String,
              })
            ),
            personasMinimo: Schema.Array(Schema.String),
            discapacidades: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                grado: Schema.Number.check(Schema.isFinite()),
                certificado: Schema.Struct({
                  referencia: Schema.String,
                  organismo: Schema.String,
                  fecha: Schema.String,
                }),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("cantabria_familias_monoparentales"),
            hijos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                nacimiento: Schema.String,
                convivencia: Schema.Union([
                  Schema.Literal("si"),
                  Schema.Literal("no"),
                ]),
                emancipacionConsentida: Schema.Union([
                  Schema.Literal("si"),
                  Schema.Literal("no"),
                ]),
                medida: Schema.Union([
                  Schema.Literal("ninguna"),
                  Schema.Literal("patria_prorrogada_transitoria"),
                  Schema.Literal("patria_rehabilitada_transitoria"),
                  Schema.Literal("curatela_representativa"),
                  Schema.Literal("curatela_asistencial"),
                ]),
                resolucion: Schema.Union([
                  Schema.Null,
                  Schema.Struct({
                    referencia: Schema.String,
                    organismo: Schema.String,
                    fecha: Schema.String,
                  }),
                ]),
                representante: Schema.Union([Schema.Null, Schema.String]),
              })
            ),
            estadoCivil: Schema.Union([
              Schema.Literal("otro"),
              Schema.Literal("sin_vinculo"),
              Schema.Literal("separacion_legal"),
            ]),
          }),
        ]),
      }),
      Schema.Struct({
        lote: Schema.Literal("E"),
        hechos: Schema.Union([
          Schema.Struct({
            codigo: Schema.Literal("galicia_familias_dos_hijos"),
            familia: Schema.Struct({
              contribuyente: Schema.Struct({
                id: Schema.String,
                nacimiento: Schema.String,
                discapacidad: Schema.Number.check(Schema.isFinite()),
              }),
              descendientes: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  nacimiento: Schema.String,
                  discapacidad: Schema.Number.check(Schema.isFinite()),
                  titularesMinimo: Schema.Array(Schema.String),
                })
              ),
              titularesMismosDescendientes: Schema.Array(Schema.String),
              eleccionFamilia: Schema.Union([
                Schema.Literal("dos_hijos"),
                Schema.Literal("numerosa"),
              ]),
            }),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
          }),
          Schema.Struct({
            codigo: Schema.Literal("galicia_acogimiento_menores"),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            menores: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                nacimiento: Schema.String,
                desde: Schema.String,
                hasta: Schema.String,
                regimen: Schema.Union([
                  Schema.Literal("preadoptivo"),
                  Schema.Literal("simple"),
                  Schema.Literal("permanente"),
                  Schema.Literal("provisional"),
                ]),
                resolucionXunta: Schema.String,
                adopcion: Schema.Union([Schema.Null, Schema.String]),
                acogedores: Schema.Array(Schema.String),
                vinculoAcogedores: Schema.Union([
                  Schema.Literal("unico"),
                  Schema.Literal("matrimonio"),
                  Schema.Literal("pareja_ley_2_2006"),
                ]),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal(
              "galicia_discapacidad_mayor_65_ayuda_terceras_personas"
            ),
            persona: Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              discapacidad: Schema.Number.check(Schema.isFinite()),
            }),
            pagos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                importe: Schema.String,
                factura: Schema.String,
              })
            ),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            necesidadTerceros: Schema.String,
            residencia: Schema.Union([
              Schema.Literal("domicilio"),
              Schema.Literal("publica"),
              Schema.Literal("concertada"),
            ]),
          }),
          Schema.Struct({
            codigo: Schema.Literal("galicia_nuevas_tecnologias_hogares"),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            contratos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                titular: Schema.String,
                alta: Schema.String,
                velocidad: Schema.Union([
                  Schema.Literal("otra"),
                  Schema.Literal("alta"),
                ]),
                uso: Schema.Union([
                  Schema.Literal("hogar_exclusivo"),
                  Schema.Literal("actividad"),
                ]),
                contratoAnterior: Schema.Union([
                  Schema.Null,
                  Schema.Struct({ alta: Schema.String }),
                ]),
                lineasAnterioresSimultaneas: Schema.Array(Schema.String),
                pagos: Schema.Array(
                  Schema.Struct({
                    id: Schema.String,
                    pagador: Schema.String,
                    receptor: Schema.String,
                    fecha: Schema.String,
                    importe: Schema.String,
                    factura: Schema.String,
                    concepto: Schema.Union([
                      Schema.Literal("alta"),
                      Schema.Literal("cuota"),
                      Schema.Literal("equipo"),
                    ]),
                  })
                ),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("rioja_bicicletas_pedaleo_no_asistido"),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            regimen: Schema.Union([
              Schema.Literal("privativo"),
              Schema.Literal("gananciales"),
            ]),
            conyuges: Schema.Array(Schema.String),
            bicicletas: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                asistencia: Schema.Union([
                  Schema.Literal("no"),
                  Schema.Literal("electrica"),
                ]),
                pago: Schema.Struct({
                  id: Schema.String,
                  pagador: Schema.String,
                  receptor: Schema.String,
                  fecha: Schema.String,
                  importe: Schema.String,
                  factura: Schema.String,
                }),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Union([
              Schema.Literal("rioja_ejercicio_fisico_deporte"),
              Schema.Literal("rioja_enfermos_ela"),
            ]),
            pagos: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                pagador: Schema.String,
                receptor: Schema.String,
                fecha: Schema.String,
                importe: Schema.String,
                factura: Schema.String,
                facturaTipo: Schema.Union([
                  Schema.Literal("ordinaria"),
                  Schema.Literal("simplificada"),
                ]),
                concepto: Schema.String,
                territorio: Schema.String,
                origenServicio: Schema.String,
              })
            ),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            diagnosticoEla: Schema.Union([Schema.Null, Schema.String]),
            beneficiariosDelEjercicio: Schema.Array(Schema.String),
            beneficiario: Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              discapacidad: Schema.Number.check(Schema.isFinite()),
            }),
            relacion: Schema.Union([
              Schema.Literal("contribuyente"),
              Schema.Literal("conyuge"),
              Schema.Literal("minimo"),
            ]),
            titularesMinimo: Schema.Array(Schema.String),
            titularesDeduccion: Schema.Array(Schema.String),
          }),
          Schema.Struct({
            codigo: Schema.Literal(
              "rioja_cuotas_organizaciones_profesionales_agrarias"
            ),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            cuotas: Schema.Array(
              Schema.Struct({
                pago: Schema.Struct({
                  id: Schema.String,
                  pagador: Schema.String,
                  receptor: Schema.String,
                  fecha: Schema.String,
                  importe: Schema.String,
                  factura: Schema.String,
                }),
                constitucion: Schema.Union([
                  Schema.Literal("otra"),
                  Schema.Literal("ley_19_1977"),
                ]),
                certificadoAnual: Schema.String,
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal(
              "galicia_inversion_proyectos_especial_interes"
            ),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            entidades: Schema.Array(
              Schema.Struct({
                id: Schema.String,
                objeto: Schema.Union([
                  Schema.Literal("otro"),
                  Schema.Literal("exclusivo_proyecto"),
                ]),
                declaracionLey2_2024: Schema.String,
                fechaDeclaracion: Schema.String,
                operaciones: Schema.Array(
                  Schema.Struct({
                    id: Schema.String,
                    tipo: Schema.Union([
                      Schema.Literal("constitucion"),
                      Schema.Literal("ampliacion"),
                    ]),
                    fecha: Schema.String,
                    pago: Schema.Struct({
                      id: Schema.String,
                      pagador: Schema.String,
                      receptor: Schema.String,
                      fecha: Schema.String,
                      importe: Schema.String,
                      factura: Schema.String,
                    }),
                  })
                ),
                baseConsumidaAnterior: Schema.String,
                historia: Schema.Literal("exhaustiva"),
                otrasDeduccionesMismaInversion: Schema.Array(Schema.String),
              })
            ),
          }),
          Schema.Struct({
            codigo: Schema.Literal("galicia_donaciones_idi"),
            coleccion: Schema.Literal("exhaustiva_2025"),
            creditoFiscalMecenazgoRioja: Schema.Union([
              Schema.Literal("no_aplicado"),
              Schema.Literal("aplicado"),
            ]),
            donaciones: Schema.Array(
              Schema.Struct({
                pago: Schema.Struct({
                  id: Schema.String,
                  pagador: Schema.String,
                  receptor: Schema.String,
                  fecha: Schema.String,
                  importe: Schema.String,
                  factura: Schema.String,
                }),
                destinatario: Schema.Union([
                  Schema.Literal("centro_universidad_gallega"),
                  Schema.Literal("centro_promovido_participado_galicia"),
                ]),
                objeto: Schema.Union([
                  Schema.Literal("otro"),
                  Schema.Literal("investigacion_desarrollo_innovacion"),
                ]),
                comunicacionAtriGa: Schema.String,
                fechaComunicacion: Schema.String,
              })
            ),
          }),
        ]),
      }),
      Schema.Struct({
        lote: Schema.Literal("F"),
        codigo: Schema.Union([
          Schema.Literal("madrid_adopcion_internacional"),
          Schema.Literal("murcia_nacimiento_adopcion"),
          Schema.Literal("murcia_contribuyentes_discapacidad"),
          Schema.Literal("murcia_cristales_lentes_soluciones_limpieza"),
          Schema.Literal("murcia_deporte_actividades_saludables"),
          Schema.Literal("murcia_enfermedades_raras"),
          Schema.Literal("murcia_ensenanza_idiomas"),
          Schema.Literal("murcia_gastos_veterinarios"),
        ]),
        hechos: Schema.Struct({
          codigo: Schema.optionalKey(Schema.String),
          certificado: Schema.optionalKey(Schema.String),
          eventos: Schema.optionalKey(
            Schema.Array(
              Schema.Struct({
                fecha: Schema.optionalKey(Schema.String),
                ejercicio: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                soporte: Schema.optionalKey(Schema.String),
                hijos: Schema.optionalKey(Schema.Array(Schema.String)),
                hijo: Schema.optionalKey(Schema.String),
                tipo: Schema.optionalKey(Schema.String),
                normaConvenioAplicable: Schema.optionalKey(Schema.String),
                progenitoresConvivientesConDerecho: Schema.optionalKey(
                  Schema.Array(Schema.String)
                ),
                ordenParaContribuyente: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                soporteOrden: Schema.optionalKey(Schema.String),
                progenitoresConvivientes: Schema.optionalKey(
                  Schema.Array(Schema.String)
                ),
              })
            )
          ),
          gastos: Schema.optionalKey(
            Schema.Array(
              Schema.Struct({
                titulares: Schema.optionalKey(Schema.Array(Schema.String)),
                hijo: Schema.optionalKey(Schema.String),
                custodia: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                alimentacion: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                vestuarioEscolar: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                ayudas: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
              })
            )
          ),
          pagos: Schema.optionalKey(
            Schema.Array(
              Schema.Struct({
                fecha: Schema.optionalKey(Schema.String),
                id: Schema.optionalKey(Schema.String),
                pagador: Schema.optionalKey(Schema.String),
                beneficiario: Schema.optionalKey(Schema.String),
                atribucion: Schema.optionalKey(Schema.String),
                factura: Schema.optionalKey(Schema.String),
                soportePago: Schema.optionalKey(Schema.String),
                conservacionFactura: Schema.optionalKey(Schema.String),
                concepto: Schema.optionalKey(Schema.String),
                importeEUR: Schema.optionalKey(Schema.String),
              })
            )
          ),
          contexto: Schema.optionalKey(
            Schema.Struct({
              ejercicio: Schema.Number.check(Schema.isFinite()),
              territorio: Schema.String,
              modalidad: Schema.Union([
                Schema.Literal("individual"),
                Schema.Literal("conjunta"),
              ]),
              contribuyente: Schema.String,
              declarantes: Schema.optionalKey(Schema.Array(Schema.String)),
            })
          ),
          baseImponible: Schema.optionalKey(
            Schema.Number.check(Schema.isFinite())
          ),
          elegibilidadExterna: Schema.optionalKey(
            Schema.Union([Schema.Literal(false), Schema.Literal(true)])
          ),
          historia: Schema.optionalKey(
            Schema.Array(
              Schema.Struct({
                ejercicio: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                basesUnidadFamiliar: Schema.optionalKey(
                  Schema.Array(Schema.Number.check(Schema.isFinite()))
                ),
                general: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
                ahorro: Schema.optionalKey(
                  Schema.Number.check(Schema.isFinite())
                ),
              })
            )
          ),
          beneficiarios: Schema.optionalKey(
            Schema.Array(
              Schema.Struct({
                id: Schema.optionalKey(Schema.String),
                clase: Schema.optionalKey(Schema.String),
                nacimiento: Schema.optionalKey(Schema.String),
                relacion: Schema.optionalKey(Schema.String),
                progenitoresConvivientes: Schema.optionalKey(
                  Schema.Array(Schema.String)
                ),
                declaracion: Schema.optionalKey(
                  Schema.Struct({
                    tipo: Schema.optionalKey(Schema.String),
                    rentas: Schema.optionalKey(Schema.String),
                  })
                ),
                diagnostico: Schema.optionalKey(
                  Schema.Struct({
                    certificado: Schema.optionalKey(Schema.String),
                    clase: Schema.optionalKey(Schema.String),
                    fechaEfectos: Schema.optionalKey(Schema.String),
                  })
                ),
                situacionDevengo: Schema.optionalKey(Schema.String),
                soporteParentescoConvivencia: Schema.optionalKey(Schema.String),
                rentasNoExentas: Schema.optionalKey(Schema.String),
                etapa: Schema.optionalKey(Schema.String),
                regimenPago: Schema.optionalKey(Schema.String),
                soporteRegimenPago: Schema.optionalKey(Schema.String),
                titular: Schema.optionalKey(Schema.String),
                soporteTitularidad: Schema.optionalKey(Schema.String),
                soporteMatrimonioVigente: Schema.optionalKey(Schema.String),
              })
            )
          ),
          fechaEfectos: Schema.optionalKey(Schema.String),
          unidad: Schema.optionalKey(Schema.String),
          gradoPorcentaje: Schema.optionalKey(Schema.String),
          nacimientoContribuyente: Schema.optionalKey(Schema.String),
          precioEUR: Schema.optionalKey(Schema.String),
          rama: Schema.optionalKey(Schema.String),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal(
          "canarias_traslado_residencia_otra_isla_trabajo"
        ),
        hechos: Schema.Struct({
          traslado: Schema.Struct({
            fecha: Schema.String,
            persona: Schema.String,
            islaOrigen: Schema.String,
            islaDestino: Schema.String,
            actividad: Schema.Union([
              Schema.Literal("trabajo"),
              Schema.Literal("economica"),
            ]),
            contratoOAlta: Schema.String,
            modalidadOrigen: Schema.Union([
              Schema.Literal("individual"),
              Schema.Literal("conjunta"),
            ]),
            baseGeneralOrigen: Schema.String,
            baseAhorroOrigen: Schema.String,
            permanenciaHasta: Schema.String,
          }),
          cuotaTrabajoActividad: Schema.Struct({
            ejercicio: Schema.Literal(2025),
            persona: Schema.String,
            importe: Schema.String,
            liquidacion: Schema.String,
          }),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("canarias_gasto_enfermedad"),
        hechos: Schema.Struct({
          nacimiento: Schema.String,
          gastos: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              fecha: Schema.String,
              pagador: Schema.String,
              perceptor: Schema.String,
              factura: Schema.String,
              importe: Schema.String,
              ayudasExentas: Schema.String,
              reembolsos: Schema.String,
              medio: Schema.Union([
                Schema.Literal("tarjeta"),
                Schema.Literal("transferencia"),
                Schema.Literal("cheque_nominativo"),
                Schema.Literal("ingreso"),
                Schema.Literal("efectivo"),
              ]),
              paciente: Schema.String,
              concepto: Schema.Union([
                Schema.Literal("dental"),
                Schema.Literal("tratamiento"),
                Schema.Literal("embarazo"),
                Schema.Literal("accidente"),
                Schema.Literal("identidad_sexual"),
                Schema.Literal("aparato"),
                Schema.Literal("estetica"),
                Schema.Literal("prima_seguro"),
              ]),
              profesional: Schema.Union([
                Schema.Literal("medico"),
                Schema.Literal("sanitario"),
                Schema.Literal("farmaceutico"),
              ]),
              colegiacion: Schema.String,
            })
          ),
          discapacidad: Schema.Number.check(Schema.isFinite()),
          pacientesMinimo: Schema.Array(
            Schema.Struct({
              persona: Schema.String,
              expediente: Schema.String,
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("canarias_estudios_no_superiores"),
        hechos: Schema.Struct({
          hijos: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              titulares: Schema.Array(Schema.String),
              minimo: Schema.Struct({
                ejercicio: Schema.Literal(2025),
                persona: Schema.String,
                contribuyente: Schema.String,
                expediente: Schema.String,
              }),
              convivenciaDesde: Schema.String,
              convivenciaHasta: Schema.String,
              etapa: Schema.Union([
                Schema.Literal("infantil"),
                Schema.Literal("basica"),
                Schema.Literal("secundaria_posobligatoria"),
              ]),
              gastos: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  fecha: Schema.String,
                  pagador: Schema.String,
                  perceptor: Schema.String,
                  factura: Schema.String,
                  importe: Schema.String,
                  ayudasExentas: Schema.String,
                  reembolsos: Schema.String,
                  medio: Schema.Union([
                    Schema.Literal("tarjeta"),
                    Schema.Literal("transferencia"),
                    Schema.Literal("cheque_nominativo"),
                    Schema.Literal("ingreso"),
                    Schema.Literal("efectivo"),
                  ]),
                  concepto: Schema.Union([
                    Schema.Literal("libro"),
                    Schema.Literal("material"),
                    Schema.Literal("transporte"),
                    Schema.Literal("uniforme"),
                    Schema.Literal("comedor"),
                  ]),
                })
              ),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("canarias_custodia_guarderias"),
        hechos: Schema.Struct({
          hijos: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              titulares: Schema.Array(Schema.String),
              minimo: Schema.Struct({
                ejercicio: Schema.Literal(2025),
                persona: Schema.String,
                contribuyente: Schema.String,
                expediente: Schema.String,
              }),
              convivenciaDesde: Schema.String,
              convivenciaHasta: Schema.String,
              centro: Schema.String,
              autorizacion: Schema.String,
              gastos: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  fecha: Schema.String,
                  pagador: Schema.String,
                  perceptor: Schema.String,
                  factura: Schema.String,
                  importe: Schema.String,
                  ayudasExentas: Schema.String,
                  reembolsos: Schema.String,
                  medio: Schema.Union([
                    Schema.Literal("tarjeta"),
                    Schema.Literal("transferencia"),
                    Schema.Literal("cheque_nominativo"),
                    Schema.Literal("ingreso"),
                    Schema.Literal("efectivo"),
                  ]),
                })
              ),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("canarias_primas_seguro_impago_arrendamientos"),
        hechos: Schema.Struct({
          viviendas: Schema.Array(
            Schema.Struct({
              catastro: Schema.String,
              territorio: Schema.Union([
                Schema.Literal("canarias"),
                Schema.Literal("illes-balears"),
              ]),
              arrendatario: Schema.String,
              inicio: Schema.String,
              finInicial: Schema.String,
              destino: Schema.Literal("vivienda"),
              fianzaDeposito: Schema.String,
              rendimiento: Schema.Literal("capital_inmobiliario"),
              rentaMensual: Schema.String,
              certificadoObligacionesFiscales: Schema.String,
              poliza: Schema.String,
              cobertura: Schema.Literal("impago_rentas"),
              gastos: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  fecha: Schema.String,
                  pagador: Schema.String,
                  perceptor: Schema.String,
                  factura: Schema.String,
                  importe: Schema.String,
                  ayudasExentas: Schema.String,
                  reembolsos: Schema.String,
                  medio: Schema.Union([
                    Schema.Literal("tarjeta"),
                    Schema.Literal("transferencia"),
                    Schema.Literal("cheque_nominativo"),
                    Schema.Literal("ingreso"),
                    Schema.Literal("efectivo"),
                  ]),
                })
              ),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal(
          "balears_arrendador_vivienda_permanente_primas_seguro"
        ),
        hechos: Schema.Struct({
          viviendas: Schema.Array(
            Schema.Struct({
              catastro: Schema.String,
              territorio: Schema.Union([
                Schema.Literal("canarias"),
                Schema.Literal("illes-balears"),
              ]),
              arrendatario: Schema.String,
              inicio: Schema.String,
              finInicial: Schema.String,
              destino: Schema.Literal("vivienda"),
              fianzaDeposito: Schema.String,
              rendimiento: Schema.Literal("capital_inmobiliario"),
              rentaMensual: Schema.String,
              certificadoObligacionesFiscales: Schema.String,
              poliza: Schema.String,
              cobertura: Schema.Literal("impago_rentas"),
              gastos: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  fecha: Schema.String,
                  pagador: Schema.String,
                  perceptor: Schema.String,
                  factura: Schema.String,
                  importe: Schema.String,
                  ayudasExentas: Schema.String,
                  reembolsos: Schema.String,
                  medio: Schema.Union([
                    Schema.Literal("tarjeta"),
                    Schema.Literal("transferencia"),
                    Schema.Literal("cheque_nominativo"),
                    Schema.Literal("ingreso"),
                    Schema.Literal("efectivo"),
                  ]),
                })
              ),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("balears_idiomas_extraescolares"),
        hechos: Schema.Struct({
          hijos: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              titulares: Schema.Array(Schema.String),
              minimo: Schema.Struct({
                ejercicio: Schema.Literal(2025),
                persona: Schema.String,
                contribuyente: Schema.String,
                expediente: Schema.String,
              }),
              convivenciaDesde: Schema.String,
              convivenciaHasta: Schema.String,
              etapa: Schema.Union([
                Schema.Literal("bachillerato"),
                Schema.Literal("fp"),
                Schema.Literal("primaria"),
                Schema.Literal("eso"),
                Schema.Literal("infantil_segundo_ciclo"),
              ]),
              idioma: Schema.String,
              actividad: Schema.Literal("extraescolar"),
              gastos: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  fecha: Schema.String,
                  pagador: Schema.String,
                  perceptor: Schema.String,
                  factura: Schema.String,
                  importe: Schema.String,
                  ayudasExentas: Schema.String,
                  reembolsos: Schema.String,
                  medio: Schema.Union([
                    Schema.Literal("tarjeta"),
                    Schema.Literal("transferencia"),
                    Schema.Literal("cheque_nominativo"),
                    Schema.Literal("ingreso"),
                    Schema.Literal("efectivo"),
                  ]),
                })
              ),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("balears_entidades_tercer_sector"),
        hechos: Schema.Struct({
          donaciones: Schema.Array(
            Schema.Struct({
              entidad: Schema.String,
              registro: Schema.String,
              regimen: Schema.Union([
                Schema.Literal("ley49_art2_3"),
                Schema.Literal("is9_3"),
              ]),
              certificado: Schema.String,
              pago: Schema.Struct({
                id: Schema.String,
                fecha: Schema.String,
                pagador: Schema.String,
                perceptor: Schema.String,
                factura: Schema.String,
                importe: Schema.String,
                ayudasExentas: Schema.String,
                reembolsos: Schema.String,
                medio: Schema.Union([
                  Schema.Literal("tarjeta"),
                  Schema.Literal("transferencia"),
                  Schema.Literal("cheque_nominativo"),
                  Schema.Literal("ingreso"),
                  Schema.Literal("efectivo"),
                ]),
              }),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal(
          "balears_declarantes_discapacidad_o_descendientes_discapacidad"
        ),
        hechos: Schema.Struct({
          personas: Schema.Array(
            Schema.Struct({
              persona: Schema.String,
              residencia: Schema.Literal("illes-balears"),
              condicion: Schema.Union([
                Schema.Literal("contribuyente"),
                Schema.Literal("descendiente"),
              ]),
              naturaleza: Schema.Union([
                Schema.Literal("fisica_sensorial"),
                Schema.Literal("psiquica"),
              ]),
              grado: Schema.Number.check(Schema.isFinite()),
              resolucion: Schema.String,
              minimo: Schema.Struct({
                contribuyente: Schema.String,
                ejercicio: Schema.Literal(2025),
                expediente: Schema.String,
              }),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("C"),
        codigo: Schema.Literal("balears_conciliacion_menores_6"),
        hechos: Schema.Struct({
          nacimiento: Schema.String,
          titulares: Schema.Array(Schema.String),
          familia: Schema.Union([
            Schema.Literal("ordinaria"),
            Schema.Literal("numerosa_general"),
            Schema.Literal("numerosa_especial"),
            Schema.Literal("monoparental_7_7"),
          ]),
          menores: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              titulares: Schema.Array(Schema.String),
              minimo: Schema.Struct({
                ejercicio: Schema.Literal(2025),
                persona: Schema.String,
                contribuyente: Schema.String,
                expediente: Schema.String,
              }),
              convivenciaDesde: Schema.String,
              convivenciaHasta: Schema.String,
              gastos: Schema.Array(
                Schema.Struct({
                  id: Schema.String,
                  fecha: Schema.String,
                  pagador: Schema.String,
                  perceptor: Schema.String,
                  factura: Schema.String,
                  importe: Schema.String,
                  ayudasExentas: Schema.String,
                  reembolsos: Schema.String,
                  medio: Schema.Union([
                    Schema.Literal("tarjeta"),
                    Schema.Literal("transferencia"),
                    Schema.Literal("cheque_nominativo"),
                    Schema.Literal("ingreso"),
                    Schema.Literal("efectivo"),
                  ]),
                  servicio: Schema.Union([
                    Schema.Literal("guarderia"),
                    Schema.Literal("custodia_centro"),
                    Schema.Literal("comedor_centro"),
                    Schema.Literal("extraescolar_centro"),
                    Schema.Literal("empleado_hogar"),
                  ]),
                  altaSeguridadSocial: Schema.String,
                })
              ),
            })
          ),
          actividad: Schema.Struct({
            tipo: Schema.Union([
              Schema.Literal("trabajo"),
              Schema.Literal("economica"),
            ]),
            identificador: Schema.String,
            diasRETA: Schema.Number.check(Schema.isFinite()),
          }),
          discapacidad: Schema.Number.check(Schema.isFinite()),
          resolucionDiscapacidad: Schema.String,
          tituloFamilia: Schema.String,
          minimoDiscapacidad: Schema.Array(
            Schema.Struct({
              persona: Schema.String,
              expediente: Schema.String,
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CLM"),
        codigo: Schema.Literal("clm_discapacidad_contribuyente"),
        hechos: Schema.Struct({
          nacimiento: Schema.String,
          persona: Schema.String,
          elecciones: Schema.Array(Schema.String),
          grado: Schema.Number.check(Schema.isFinite()),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CLM"),
        codigo: Schema.Literal("clm_mayores_75"),
        hechos: Schema.Struct({
          nacimiento: Schema.String,
          persona: Schema.String,
          grado: Schema.Number.check(Schema.isFinite()),
          diasCentro: Schema.Number.check(Schema.isFinite()),
          diasConvalecenciaSescam: Schema.Number.check(Schema.isFinite()),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CLM"),
        codigo: Schema.Literal("clm_nacimiento_adopcion_hijos"),
        hechos: Schema.Struct({
          eventos: Schema.Array(
            Schema.Struct({
              fecha: Schema.String,
              id: Schema.String,
              hijos: Schema.Array(Schema.String),
              titularesMinimo: Schema.Array(Schema.String),
              tipo: Schema.String,
            })
          ),
          exhaustividad: Schema.String,
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CLM"),
        codigo: Schema.Literal("clm_cuidado_ascendientes_mayores_75"),
        hechos: Schema.Struct({
          exhaustividad: Schema.String,
          ascendientes: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              nacimiento: Schema.String,
              titularesMinimo: Schema.Array(Schema.String),
              grado: Schema.Number.check(Schema.isFinite()),
              diasCentro: Schema.Number.check(Schema.isFinite()),
              diasConvalecenciaSescam: Schema.Number.check(Schema.isFinite()),
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CYL"),
        codigo: Schema.Literal("cyl_contribuyentes_discapacidad"),
        hechos: Schema.Struct({
          nacimiento: Schema.String,
          persona: Schema.String,
          residencia: Schema.String,
          grado: Schema.Number.check(Schema.isFinite()),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CYL"),
        codigo: Schema.Literal("cyl_gastos_adopcion"),
        hechos: Schema.Struct({
          exhaustividad: Schema.String,
          adopciones: Schema.Array(
            Schema.Struct({
              clase: Schema.String,
              hijo: Schema.String,
              titularesMinimo: Schema.Array(Schema.String),
              fechaResolucion: Schema.String,
              fechaInscripcion: Schema.String,
              ayudaAnalogica: Schema.String,
            })
          ),
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CYL"),
        codigo: Schema.Literal("cyl_cuotas_seguridad_social_empleados_hogar"),
        hechos: Schema.Struct({
          pagos: Schema.Array(
            Schema.Struct({
              fecha: Schema.String,
              id: Schema.String,
              regimen: Schema.String,
              conyuge: Schema.Union([Schema.Null, Schema.String]),
              importe: Schema.String,
              nifEmpleado: Schema.String,
              empleador: Schema.String,
            })
          ),
          hijo: Schema.String,
          titularesMinimo: Schema.Array(Schema.String),
          exhaustividad: Schema.String,
          ayudaAnalogica: Schema.String,
          hijoNacimiento: Schema.String,
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("CYL"),
        codigo: Schema.Literal("cyl_familia_numerosa"),
        hechos: Schema.Struct({
          titulares: Schema.Array(Schema.String),
          descendientes: Schema.Array(Schema.String),
          conyuge: Schema.Union([Schema.Null, Schema.String]),
          discapacidad65: Schema.Array(Schema.String),
          tituloInicio: Schema.String,
          tituloFin: Schema.String,
          residenciaConyuge: Schema.String,
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("EXT"),
        codigo: Schema.Literal("extremadura_trabajo_dependiente"),
        hechos: Schema.Struct({
          personas: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              integroTrabajo: Schema.String,
              restoRentas: Schema.String,
              eleccion: Schema.String,
            })
          ),
          exhaustividad: Schema.String,
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("EXT"),
        codigo: Schema.Literal("extremadura_partos_multiples"),
        hechos: Schema.Struct({
          exhaustividad: Schema.String,
          partos: Schema.Array(
            Schema.Struct({
              fecha: Schema.String,
              id: Schema.String,
              titulares: Schema.Array(Schema.String),
              hijosConvivientes: Schema.Array(Schema.String),
            })
          ),
          regimenRenta: Schema.String,
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("EXT"),
        codigo: Schema.Literal("extremadura_material_escolar"),
        hechos: Schema.Struct({
          descendientes: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              titularesMinimo: Schema.Array(Schema.String),
              etapa: Schema.String,
            })
          ),
          exhaustividad: Schema.String,
          regimenRenta: Schema.String,
        }),
      }),
      Schema.Struct({
        lote: Schema.Literal("EXT"),
        codigo: Schema.Literal("extremadura_enfermos_ela_familiares"),
        hechos: Schema.Struct({
          personas: Schema.Array(
            Schema.Struct({
              id: Schema.String,
              relacion: Schema.String,
              familiaresConDerecho: Schema.Array(Schema.String),
              fechaDiagnostico: Schema.String,
            })
          ),
          exhaustividad: Schema.String,
        }),
      }),
    ])
  ),
})
export type SolicitudDeduccionesTerritoriales2025 =
  typeof SolicitudDeduccionesTerritoriales2025.Type
