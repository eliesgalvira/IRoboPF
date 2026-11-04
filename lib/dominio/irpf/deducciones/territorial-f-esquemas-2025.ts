import { Schema } from "effect"

// Campos opcionales para emitir siguienteHecho por rama, sin inventar valores.
// La frontera comprueba tipos y el evaluador comprueba requisitos territoriales.
const Texto = Schema.optionalKey(Schema.String)
const Numero = Schema.optionalKey(Schema.Number.check(Schema.isFinite()))
const Identidades = Schema.optionalKey(Schema.Array(Schema.String))
export const ContextoTerritorialF = Schema.Struct({
  ejercicio: Schema.Number.check(Schema.isFinite()),
  territorio: Schema.String,
  contribuyente: Schema.String,
  modalidad: Schema.Literals(["individual", "conjunta"]),
  declarantes: Identidades,
})
const Beneficiario = Schema.Struct({
  id: Texto,
  nacimiento: Texto,
  progenitoresConvivientes: Identidades,
  situacionDevengo: Texto,
  soporteParentescoConvivencia: Texto,
  rentasNoExentas: Texto,
  declaracion: Schema.optionalKey(
    Schema.Struct({ tipo: Texto, rentas: Texto })
  ),
  etapa: Texto,
  regimenPago: Texto,
  soporteRegimenPago: Texto,
  clase: Texto,
  titular: Texto,
  soporteTitularidad: Texto,
  relacion: Texto,
  soporteMatrimonioVigente: Texto,
  diagnostico: Schema.optionalKey(
    Schema.Struct({ clase: Texto, certificado: Texto, fechaEfectos: Texto })
  ),
})
const PagoDeclarado = Schema.Struct({
  id: Texto,
  fecha: Texto,
  pagador: Texto,
  atribucion: Texto,
  factura: Texto,
  soportePago: Texto,
  conservacionFactura: Texto,
  beneficiario: Texto,
  concepto: Texto,
  importeEUR: Texto,
})
const EventoDeclarado = Schema.Struct({
  hijo: Texto,
  fecha: Texto,
  tipo: Texto,
  soporte: Texto,
  normaConvenioAplicable: Texto,
  progenitoresConvivientesConDerecho: Identidades,
  ordenParaContribuyente: Numero,
  soporteOrden: Texto,
  ejercicio: Numero,
  hijos: Identidades,
  progenitoresConvivientes: Identidades,
})
export const HechosTerritorialesF = Schema.Struct({
  codigo: Texto,
  contexto: Schema.optionalKey(ContextoTerritorialF),
  declarantes: Identidades,
  elegibilidadExterna: Schema.optionalKey(Schema.Boolean),
  baseGeneralEUR: Texto,
  baseAhorroEUR: Texto,
  unidad: Texto,
  gradoPorcentaje: Texto,
  certificado: Texto,
  fechaEfectos: Texto,
  nacimientoContribuyente: Texto,
  precioEUR: Texto,
  rama: Texto,
  eventos: Schema.optionalKey(Schema.Array(EventoDeclarado)),
  historia: Schema.optionalKey(
    Schema.Array(
      Schema.Struct({
        ejercicio: Numero,
        general: Numero,
        ahorro: Numero,
        basesUnidadFamiliar: Schema.optionalKey(
          Schema.Array(Schema.Number.check(Schema.isFinite()))
        ),
      })
    )
  ),
  baseImponible: Numero,
  gastos: Schema.optionalKey(
    Schema.Array(
      Schema.Struct({
        hijo: Texto,
        titulares: Identidades,
        custodia: Numero,
        alimentacion: Numero,
        vestuarioEscolar: Numero,
        ayudas: Numero,
      })
    )
  ),
  pagos: Schema.optionalKey(Schema.Array(PagoDeclarado)),
  beneficiarios: Schema.optionalKey(Schema.Array(Beneficiario)),
})
export const SolicitudTerritorialF = Schema.Struct({
  tipo: Schema.Literal("territorial_f_hechos_2025"),
  contexto: ContextoTerritorialF,
  codigo: Schema.String,
  hechos: HechosTerritorialesF,
})
export type BeneficiarioF2025 = typeof Beneficiario.Type
export type PagoDeclaradoF2025 = typeof PagoDeclarado.Type
export const decodificarTerritorialF = Schema.decodeUnknownResult(
  SolicitudTerritorialF
)
