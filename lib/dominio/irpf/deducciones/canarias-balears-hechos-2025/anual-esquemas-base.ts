// Contratos públicos C36: hechos cerrados; ningún puerto de magnitudes del motor.
import { Schema } from "effect"
const CentimosC36 = Schema.String.check(
  Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/)
)
export const PagoHechos = Schema.Struct({
  id: Schema.String,
  fecha: Schema.String,
  pagador: Schema.String,
  perceptor: Schema.String,
  factura: Schema.String,
  importe: CentimosC36,
  ayudasExentas: CentimosC36,
  reembolsos: CentimosC36,
  medio: Schema.Literals([
    "transferencia",
    "tarjeta",
    "cheque_nominativo",
    "ingreso",
    "efectivo",
  ]),
})
export const PagoCHechos = Schema.Struct({
  ...PagoHechos.fields,
  ...Schema.Struct({
    naturaleza: Schema.Literals(["propio", "comun"]),
    distribucion: Schema.Array(
      Schema.Struct({ persona: Schema.String, porcentaje: Schema.String })
    ).check(Schema.isMaxLength(1000)),
  }).fields,
})
export const BeneficiarioDonacionCHechos = Schema.Struct({
  nif: Schema.String,
  clase: Schema.Literals([
    "administracion",
    "entidad_publica",
    "universidad",
    "centro_investigacion",
    "iglesia_acuerdo",
    "fundacion49",
    "entidad_parcialmente_exenta",
    "empresa_cultural",
    "empresa_cientifica",
    "empresa_tecnologica",
  ]),
  territorio: Schema.Literals(["canarias", "illes-balears"]),
  registro: Schema.String,
  finalidad: Schema.Literals([
    "medio_ambiente_exclusivo",
    "patrimonio",
    "cultura",
    "deporte",
    "investigacion",
    "docencia",
    "acceso_superior",
    "lengua_catalana",
  ]),
  fondosPropios: Schema.String,
  proyecto: Schema.String,
  declaracionProyecto: Schema.String,
  naturaleza: Schema.Literals(["publica", "privada"]),
  centroUniversitarioOrigen: Schema.String,
  patenteResultado: Schema.String,
})
export const DonacionCHechos = Schema.Struct({
  id: Schema.String,
  entidad: BeneficiarioDonacionCHechos,
  certificado: Schema.String,
  fechaEntrega: Schema.String,
  aceptacion: Schema.Literal("irrevocable_aceptada"),
  bienProtegido: Schema.String,
  modalidad: Schema.Literals([
    "dinero",
    "capital_tecnologico",
    "bien",
    "convenio",
    "comodato",
  ]),
  destino4bis: Schema.Literals(["a", "b", "c", "d", "e", "f", "no_aplica"]),
  pagos: Schema.Array(PagoCHechos).check(Schema.isMaxLength(1000)),
  valoracionBien: Schema.String,
  documentoValoracion: Schema.String,
  comodato: Schema.Struct({
    desde: Schema.String,
    hasta: Schema.String,
    ejerciciosPrevios: Schema.Array(
      Schema.Number.check(Schema.isFinite())
    ).check(Schema.isMaxLength(1000)),
    valorFiscal: Schema.String,
    criterio: Schema.Literals(["comision_patrimonio", "catastro"]),
    documento: Schema.String,
  }),
})
export const ViviendaCHechos = Schema.Struct({
  id: Schema.String,
  catastro: Schema.String,
  derecho: Schema.Literals(["propiedad", "usufructo", "arrendatario"]),
  habitualDesde: Schema.optional(Schema.String),
  adquisicion: Schema.optional(Schema.String),
  ocupacion: Schema.optional(Schema.String),
  finObras: Schema.optional(Schema.String),
  gastos: Schema.Array(
    Schema.Struct({
      ...PagoCHechos.fields,
      ...Schema.Struct({
        concepto: Schema.Literals([
          "adquisicion",
          "rehabilitacion",
          "energia",
          "agua",
          "accesibilidad",
          "reparacion",
          "contrato",
          "seguro_danos",
          "seguro_impago",
          "certificado",
          "alquiler",
          "tributo",
          "comunidad",
          "suministro",
          "judicial",
        ]),
      }).fields,
    })
  ).check(Schema.isMaxLength(1000)),
  proteccionPatrimonial: Schema.optional(Schema.String),
  autorizacionObras: Schema.optional(Schema.String),
  certificadoAntes: Schema.optional(
    Schema.Struct({
      registro: Schema.String,
      calificacion: Schema.Literals(["A", "B", "C", "D", "E", "F", "G"]),
    })
  ),
  certificadoDespues: Schema.optional(
    Schema.Struct({
      registro: Schema.String,
      calificacion: Schema.Literals(["A", "B", "C", "D", "E", "F", "G"]),
    })
  ),
  alquiler: Schema.optional(
    Schema.Struct({
      arrendador: Schema.String,
      arrendatario: Schema.String,
      desde: Schema.String,
      hasta: Schema.String,
      fianza: Schema.optional(Schema.String),
      rentaMensual: Schema.optional(Schema.String),
      superficieUtil: Schema.optional(Schema.String),
      repercusionObras: Schema.optional(Schema.String),
      programa: Schema.Literals(["ordinario", "alquiler_seguro"]),
      parientesGrado: Schema.Number.check(Schema.isFinite()),
      islaOrigen: Schema.optional(Schema.String),
      islaDestino: Schema.optional(Schema.String),
      relacionLaboralAntes: Schema.optional(Schema.String),
      relacionLaboralDespues: Schema.optional(Schema.String),
    })
  ),
  ocupacionIlegal: Schema.optional(
    Schema.Struct({
      situacion: Schema.Literals(["ocupacion", "suspension_vulnerabilidad"]),
      resolucion: Schema.String,
    })
  ),
  dacion: Schema.optional(
    Schema.Struct({
      fecha: Schema.String,
      escritura: Schema.String,
      acreedor: Schema.String,
      deudaExtinguida: Schema.String,
    })
  ),
})
export const InversionEntidadCHechos = Schema.Struct({
  id: Schema.String,
  fecha: Schema.String,
  modalidad: Schema.Literals(["constitucion", "ampliacion"]),
  escritura: Schema.String,
  aportacion: Schema.String,
  entidad: Schema.Struct({
    nif: Schema.String,
    clase: Schema.Literals(["sa", "sl", "sal", "sll", "cooperativa"]),
    constitucion: Schema.String,
    domicilioSocial: Schema.Literals(["canarias", "illes-balears"]),
    domicilioFiscal: Schema.Literals(["canarias", "illes-balears"]),
    actividad: Schema.Literals(["operativa", "patrimonial", "arrendamiento"]),
    cifraNegocio: Schema.String,
    universidadesCentros: Schema.Array(Schema.String).check(
      Schema.isMaxLength(1000)
    ),
    selloInnovador: Schema.String,
    registroInnovador: Schema.String,
    vigenciaSelloHasta: Schema.String,
  }),
  participaciones: Schema.Array(
    Schema.Struct({
      desde: Schema.String,
      hasta: Schema.String,
      tenedores: Schema.Array(
        Schema.Struct({
          persona: Schema.String,
          relacion: Schema.Literals(["propio", "conyuge", "pariente"]),
          grado: Schema.Number.check(Schema.isFinite()),
          capital: Schema.String,
          votos: Schema.String,
        })
      ).check(Schema.isMaxLength(1000)),
    })
  ).check(Schema.isMaxLength(1000)),
  cargo: Schema.Literals([
    "socio",
    "consejero_sin_direccion",
    "ejecutivo",
    "empleado",
  ]),
  empleados: Schema.Array(
    Schema.Struct({
      persona: Schema.String,
      domicilioFiscal: Schema.Literals(["canarias", "illes-balears"]),
      jornadaPorcentaje: Schema.String,
      altaGeneral: Schema.String,
      socio: Schema.Literals(["si", "no"]),
    })
  ).check(Schema.isMaxLength(1000)),
  plantillaAnterior: Schema.String,
  plantillaActual: Schema.String,
  mantenimientoHasta: Schema.String,
})
export const AltaAutonomoCHechos = Schema.Struct({
  altasCenso: Schema.Array(Schema.String).check(Schema.isMaxLength(1000)),
  bajasCenso: Schema.Array(Schema.String).check(Schema.isMaxLength(1000)),
  domiciliosActividad: Schema.Array(
    Schema.Struct({ territorio: Schema.String, volumen: Schema.String })
  ).check(Schema.isMaxLength(1000)),
  certificadoCenso: Schema.String,
})
export const DestinoPlazaCHechos = Schema.Struct({
  cuerpo: Schema.Literals([
    "autonomico_complemento",
    "policia_nacional",
    "guardia_civil",
  ]),
  nominaComplemento: Schema.String,
  isla: Schema.Literals(["Mallorca", "Menorca", "Ibiza", "Formentera"]),
  desde: Schema.String,
  hasta: Schema.String,
})
