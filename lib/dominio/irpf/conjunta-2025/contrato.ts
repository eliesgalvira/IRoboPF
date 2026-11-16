import { Schema } from "effect"
import { Euros, GastosTrabajo } from "../trabajo-anual/contrato"

const Id = Schema.String.check(Schema.isPattern(/\S/))
const Persona = Schema.Struct({
  id: Id,
  fechaNacimiento: Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/)),
  residenteIrpfTodo2025: Schema.Literal(true),
  vivoTodo2025: Schema.Literal(true),
  discapacidad: Schema.Literal("ninguna"),
  opcion: Schema.Literal("conjunta"),
  unidadId: Id,
  declaracionSeparada: Schema.Literal("ninguna"),
  otraUnidad: Schema.Literal(false),
})
const Adulto = Schema.Struct({
  ...Persona.fields,
  estadoCivil: Schema.Literals(["casado-no-separado", "sin-vinculo"]),
})
const Hijo = Schema.Struct({
  ...Persona.fields,
  rentaNoExenta: Schema.Literal("0.00"),
  independienteConConsentimiento: Schema.Literal(false),
  apoyoJudicial: Schema.Literal("ninguno"),
  progenitoresTitulares: Schema.Array(Id),
  titularesCompletos: Schema.Literal(true),
  guardaCustodia: Schema.Literals(["ambos-conyuges-convivientes", "exclusiva-declarante-todo2025"]),
  alimentosJudiciales: Schema.Literal(false),
})
/** Corte ordinario deliberadamente cerrado: un perceptor, un hijo menor de tres,
 * adultos18–64; todos residentes, vivos y convivientes durante todo2025.
 * Cada censo se declara exhaustivo; no sustituye la comprobación de los hechos. */
export const CasoConjunta2025 = Schema.Struct({
  perfil: Schema.Literal("conjunta-trabajo-ordinario-2025"),
  modalidad: Schema.Literal("conjunta"),
  ejercicio: Schema.Literal(2025),
  devengo: Schema.Literal("2025-12-31"),
  comunidadAutonoma: Schema.Literals(["aragon", "illes-balears", "castilla-y-leon", "galicia", "murcia", "castilla-la-mancha", "comunitat-valenciana", "madrid"]),
  unidadId: Id,
  tipoUnidad: Schema.Literals(["matrimonial", "monoparental"]),
  declarante: Adulto,
  conyuge: Schema.NullOr(Adulto),
  hijos: Schema.Array(Hijo).check(Schema.isMinLength(1), Schema.isMaxLength(1)),
  miembros: Schema.Array(Id),
  convivientesTodo2025: Schema.Array(Id),
  censoAlDevengoCompleto: Schema.Literal(true),
  opcionTodos: Schema.Literal(true),
  otrosHijosAscendientesConvivientes: Schema.Literal("ninguno"),
  otroProgenitorExterno: Schema.NullOr(Schema.Struct({
    convive: Schema.Literal(false),
    incluyeHijoOtraConjunta: Schema.Literal(false),
    derechoMinimo: Schema.Literal(false),
    dependenciaEconomica: Schema.Literal(false),
    alimentosJudiciales: Schema.Literal(false),
  })),
  economia: Schema.Struct({
    censoCompleto: Schema.Literal(true),
    perceptorId: Id,
    miembrosSinRentas: Schema.Array(Id),
    otrasRentasIncluidasExentas: Schema.Literal("ninguna"),
    actividadesAhorroInmueblesGanancias: Schema.Literal("ninguno"),
    reduccionesPersonalesSaldosAnteriores: Schema.Literal("ninguno"),
    deducciones: Schema.Literal("solo-da61-si-procede"),
    trabajo: GastosTrabajo,
    conciliacion: Schema.Struct({
      ejercicio: Schema.Literal(2025),
      estado: Schema.Literal("totales-anuales-sin-duplicados"),
      procedencia: Schema.Array(Id).check(Schema.isMinLength(1)),
    }),
    retenciones: Schema.Array(Schema.Struct({
      operacionId: Id, procedencia: Id, ejercicio: Schema.Literal(2025),
      importe: Euros, efectiva: Schema.Literal(true),
    })),
  }),
})
export type CasoConjunta2025 = typeof CasoConjunta2025.Type
