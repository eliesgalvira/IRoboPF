import { AuxiliaresAnualesF } from "./auxiliares-esquemas"
import { Schema } from "effect"
import { HechosTerritorialesF } from "../territorial-f-esquemas-2025"
import { CODIGOS_TERRITORIAL_F_HECHOS_2025 } from "../territorial-f-2025"
import { HechosAmpliacionF, Pago } from "./esquemas"
import { CODIGOS_FAMILIA_F } from "./familia"
import { CODIGOS_VIVIENDA_F } from "./vivienda"
import { CODIGOS_INVERSION_F } from "./inversiones"

const Interno = Schema.optionalKey(Schema.Never)
// Las bases históricas sólo se admiten dentro de historia y con ejercicio anterior.
const PreviosAnuales = Schema.Struct({
  ...HechosTerritorialesF.fields,
  codigo: Interno,
  contexto: Interno,
  declarantes: Interno,
  baseGeneralEUR: Interno,
  baseAhorroEUR: Interno,
  baseImponible: Interno,
  elegibilidadExterna: Interno,
})
export const HechosAnualesF = Schema.Struct({
  ...HechosAmpliacionF.fields,
  bases: Interno,
  basesOtrosTitulares: Interno,
  liquidableGeneralEUR: Interno,
  liquidableAhorroEUR: Interno,
  minimoPersonalFamiliarEUR: Interno,
  baseViviendaEstatalEUR: Interno,
  pagos: Schema.optionalKey(Schema.Array(Schema.Struct({
    ...Pago.fields,
    computoBaseEstatalEUR: Interno,
  }))),
  hechosPrevios: Schema.optionalKey(PreviosAnuales),
})

/** Censo histórico de instalaciones, no importes de deducción ni cuotas consignadas.
 * Una infraestructura histórica requiere reconstruir su año de origen antes de aplicarla. */
const HistorialRecarga = Schema.Struct({
  periodos: Schema.Tuple([Schema.Literal(2022), Schema.Literal(2023), Schema.Literal(2024)]),
  contribuyente: Schema.String,
  referencia: Schema.String,
  infraestructuras: Schema.Array(Schema.Struct({
    objetoId: Schema.String,
    ejercicioOrigen: Schema.Literals([2022, 2023, 2024]),
    referencia: Schema.String,
  })),
})
export const SolicitudAnualF2025 = Schema.Struct({
  auxiliares: Schema.optionalKey(AuxiliaresAnualesF),
  lote: Schema.Literal("F-ampliado"),
  codigo: Schema.Literals([
    ...CODIGOS_FAMILIA_F,
    ...CODIGOS_VIVIENDA_F,
    ...CODIGOS_INVERSION_F,
    ...CODIGOS_TERRITORIAL_F_HECHOS_2025,
  ]),
  hechos: HechosAnualesF,
  historialRecarga: Schema.optionalKey(HistorialRecarga),
  historialSaldosIncentivoMurcia: Schema.optionalKey(Schema.Struct({
    codigo: Schema.Literals(["murcia_vehiculos_electricos", "murcia_instalaciones_recursos_energeticos_renovables"]),
    periodos: Schema.Array(Schema.Literals([2022, 2023, 2024])),
    contribuyente: Schema.String,
    referencia: Schema.String,
    operaciones: Schema.Array(Schema.Struct({ objetoId: Schema.String, ejercicioOrigen: Schema.Literals([2022, 2023, 2024]), referencia: Schema.String })),
  })),
})
export type SolicitudAnualF2025 = typeof SolicitudAnualF2025.Type
