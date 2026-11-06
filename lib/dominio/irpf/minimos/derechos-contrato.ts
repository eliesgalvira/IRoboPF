import { AscendienteAnual2025 } from "./ascendientes-2025"
import { Schema } from "effect"

const Entero = Schema.Number.check(
  Schema.isInt(),
  Schema.isBetween({ minimum: 0, maximum: 150 })
)
const Centimos = Schema.Number.check(
  Schema.isInt(),
  Schema.isBetween({ minimum: -1e12, maximum: 1e12 })
)
// IDs locales sin nombres, DNI ni identificadores de fuentes personales.
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))
const Fecha = Schema.String.check(
  Schema.isPattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
)
export const DiscapacidadDerechos = Schema.Union([
  Schema.TaggedStruct("SinDiscapacidad", {}),
  Schema.TaggedStruct("Discapacidad33a64", {
    necesitaAyudaOMovilidadReducida: Schema.Boolean,
  }),
  Schema.TaggedStruct("Discapacidad65OMas", {}),
])
const Declaracion = Schema.Union([
  Schema.Struct({ modalidad: Schema.Literal("no-presenta") }),
  Schema.Struct({
    modalidad: Schema.Literal("individual"),
    rentasCentimos: Centimos,
  }),
])
const Vinculo = Schema.Union([
  Schema.Struct({ clase: Schema.Literal("consanguinidad") }),
  Schema.Struct({
    clase: Schema.Literals([
      "adopcion",
      "acogimiento-permanente",
      "guarda-preadoptiva",
    ]),
    // Primer hecho que abre el plazo, incluido acogimiento previo: no reiniciarlo.
    fechaInicioIncremento: Fecha,
    // La inscripción que abre el incremento no determina la edad al constituir.
    fechaConstitucionVinculo: Schema.optional(Fecha),
    fundamento: Schema.Literals([
      "inscripcion-registro-civil",
      "resolucion-sin-inscripcion-necesaria",
    ]),
    historialCompleto: Schema.Literal(true),
  }),
  Schema.Struct({
    clase: Schema.Literals([
      "acogimiento-temporal",
      "acogimiento-urgencia",
      "guarda-judicial",
    ]),
  }),
])
export const TitularDescendiente = Schema.Struct({
  titularId: Id,
  grado: Entero.check(Schema.isGreaterThanOrEqualTo(1)),
  vinculo: Vinculo,
  relacion: Schema.Literals([
    "convivencia",
    "dependencia-economica",
    "ninguna",
  ]),
  custodia: Schema.Literals([
    "exclusiva",
    "compartida",
    "sin-custodia",
    "no-procede",
  ]),
  alimentosJudiciales: Schema.Boolean,
  aplicaEspecialidadAlimentos: Schema.Boolean,
  residenteIrpf: Schema.Boolean,
  rentasNoExentasCentimos: Centimos,
})
export const DescendienteDerechos = Schema.Struct({
  sujetoId: Id,
  fechaNacimiento: Fecha,
  edadDevengo: Entero,
  vivoAlDevengo: Schema.Literal(true),
  rentasNoExentasCentimos: Centimos,
  declaracion: Declaracion,
  discapacidad: DiscapacidadDerechos,
  titulares: Schema.Array(TitularDescendiente).check(
    Schema.isMinLength(1),
    Schema.isMaxLength(100)
  ),
  titularesCompletos: Schema.Literal(true),
})
export type DescendienteDerechos = typeof DescendienteDerechos.Type
export type TitularDescendiente = typeof TitularDescendiente.Type

/** Territorios reales del régimen común; los forales se rechazan en frontera. */
export const TerritorioMinimosComun = Schema.Literals([
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
])
export const EjercicioDerechosMinimos = Schema.Literals([
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  2025, 2026,
])
/** Hechos al cierre anual, nunca certificación ni porcentaje manual. */
export const DerechosMinimosAnuales = Schema.Struct({
  ejercicio: EjercicioDerechosMinimos,
  territorio: TerritorioMinimosComun,
  regimen: Schema.Literal("comun"),
  modalidad: Schema.Literal("individual"),
  devengo: Fecha,
  contribuyenteId: Id,
  edadContribuyenteDevengo: Entero.check(Schema.isGreaterThanOrEqualTo(18)),
  discapacidadContribuyente: DiscapacidadDerechos,
  ascendientesCompletos: Schema.optional(Schema.Literal(true)),
  ascendientes: Schema.Union([Schema.Literal("ninguno"), Schema.Array(AscendienteAnual2025).check(Schema.isMaxLength(100))]),
  fallecimientosEnElEjercicio: Schema.Literal("ninguno"),
  descendientesCompletos: Schema.Literal(true),
  /** Solo la conexión anual exige esta declaración; no acredita hechos externos. */
  conciliacionRentasContribuyente: Schema.optional(
    Schema.Struct({
      perfil: Schema.Literal("caso-anual-parcial"),
      otrasRentasOGastosNoRepresentados: Schema.Literal("ninguno"),
    })
  ),
  descendientes: Schema.Array(DescendienteDerechos).check(
    Schema.isMaxLength(100)
  ),
})
export type DerechosMinimosAnuales = typeof DerechosMinimosAnuales.Type
/** @deprecated Use DerechosMinimosAnuales. Mismo cálculo y validación. */
export const DerechosMinimos2025 = Schema.Struct({
  ...DerechosMinimosAnuales.fields,
  ejercicio: Schema.Literal(2025),
  territorio: Schema.Literal("madrid"),
  devengo: Schema.Literal("2025-12-31"),
})
export type DerechosMinimos2025 = typeof DerechosMinimos2025.Type

export class DerechosMinimosNoSoportados extends Schema.TaggedErrorClass<DerechosMinimosNoSoportados>()(
  "DerechosMinimosNoSoportados",
  { motivo: Schema.String }
) {}
