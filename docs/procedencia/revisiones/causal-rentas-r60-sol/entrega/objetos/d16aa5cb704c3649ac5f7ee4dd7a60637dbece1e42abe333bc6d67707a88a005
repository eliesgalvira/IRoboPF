import { Schema } from "effect"

/** Euros decimales exactos, sin exponentes ni coerción desde number. */
export const Euros = Schema.String.check(
  Schema.isPattern(/^(0|[1-9][0-9]{0,11})(\.[0-9]{1,2})?$/)
)
export const Renta = Schema.String.check(
  Schema.isPattern(/^-?(0|[1-9][0-9]{0,11})(\.[0-9]{1,2})?$/)
)
/** Magnitudes calculadas: no se redondean a céntimos entre etapas. */
const MagnitudCalculada = Schema.String.check(
  Schema.isPattern(/^(0|[1-9][0-9]{0,15})(\.[0-9]{1,60})?$/)
)
/** Suma de hasta 100 rendimientos de 12 enteros y dos decimales cada uno. */
const BrutoServiciosAcumulado = Schema.String.check(
  Schema.isPattern(/^(0|[1-9][0-9]{0,13})(\.[0-9]{1,2})?$/)
)
const Hecho = Schema.Literals(["si", "no", "desconocido"])
const Pago = Schema.Struct({ importe: Euros, satisfecho: Hecho })
export const Rendimiento = Schema.Struct({
  id: Schema.String.check(Schema.isMinLength(1)),
  clase: Schema.Literals([
    "empleo-laboral",
    "empleo-estatutario",
    "pension",
    "otro-trabajo",
    "desconocido",
  ]),
  integro: Euros,
  cotizaciones: Schema.Struct({
    clase: Schema.Literals(["efectivas", "estimadas", "desconocidas"]),
    seguridadSocial: Euros,
    derechosPasivos: Euros,
    colegiosHuerfanos: Euros,
  }),
  sindicato: Pago,
  colegio: Schema.Struct({
    importe: Euros,
    satisfecho: Hecho,
    obligatorio: Hecho,
    finesEsenciales: Hecho,
  }),
  defensa: Schema.Struct({
    importe: Euros,
    satisfecho: Hecho,
    litigioDirectoPagador: Hecho,
  }),
})
export const GastosTrabajo = Schema.Struct({
  ejercicio: Schema.Number.check(
    Schema.isInt(),
    Schema.isGreaterThanOrEqualTo(2012),
    Schema.isLessThanOrEqualTo(2026)
  ),
  territorio: Schema.Literals(["comun", "foral"]),
  rendimientos: Schema.Array(Rendimiento).check(Schema.isMaxLength(100)),
  reduccionesArt18: Schema.Literals(["ninguna", "pendiente"]),
  movilidad: Schema.Literals([
    "ninguna",
    "ordinaria",
    "dt6-2015",
    "desconocida",
  ]),
  discapacidadActiva: Schema.Union([
    Schema.Literal("ninguna"),
    Schema.Literal("pendiente"),
    Schema.Struct({
      grado: Schema.Literals(["33-a-64", "65-o-mas"]),
      ayudaOMovilidadReducida: Hecho,
      acreditadaDuranteTodoElTrabajo: Hecho,
    }),
  ]),
})
export type GastosTrabajo = typeof GastosTrabajo.Type
export const DeduccionTrabajo = Schema.Union([
  Schema.Struct({
    regla: Schema.Literal("art80bis"),
    ambito: Schema.Literal("comun-individual"),
    computo: Schema.Literal("netos-tras-art20-art32-sin-exterior-no-gravado"),
    ejercicio: Schema.Literals([2012, 2013, 2014]),
    baseImponible: Renta,
    tipoMedioEstatalPorcentaje: Euros,
    tipoMedioAutonomicoPorcentaje: Euros,
    rendimientoComputableTrabajoActividad: Euros,
    cuotaTrasArt80: Euros,
    etapa: Schema.Literal("despues-art80-sin-deduccion-trabajo"),
  }),
  Schema.Struct({
    regla: Schema.Literal("da61"),
    ambito: Schema.Literal("comun-individual"),
    ejercicio: Schema.Literals([2025, 2026]),
    brutoServicios: BrutoServiciosAcumulado,
    otrasRentasNoExentas: Renta,
    netoReducidoServicios: MagnitudCalculada,
    baseLiquidableGeneral: MagnitudCalculada,
    cuotaIntegraGeneral: MagnitudCalculada,
    cuotaLiquidaTotal: MagnitudCalculada,
    cuotaTrasArt80: MagnitudCalculada,
    etapa: Schema.Literal("despues-art80-sin-deduccion-trabajo"),
    calificacion: Schema.Literals([
      "laboral-estatutaria-acreditada",
      "pendiente",
    ]),
  }),
])
export type DeduccionTrabajo = typeof DeduccionTrabajo.Type
export type NoSoportado = {
  readonly estado: "no-soportado"
  readonly motivo: string
}
export type ResultadoDeduccion =
  | NoSoportado
  | {
      readonly estado: "calculado"
      readonly deduccionLegal: string
      readonly limiteAtribuible: string
      readonly importeAplicable: string
      readonly cuotaPosterior: string
      readonly fuente: string
      readonly aceptacionFiscal: "pendiente"
    }
