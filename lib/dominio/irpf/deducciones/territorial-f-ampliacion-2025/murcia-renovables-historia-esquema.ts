import { Schema } from "effect"
import { Euros, GastosTrabajo } from "../../trabajo-anual/contrato"

const Texto = Schema.String.check(Schema.isPattern(/^\S(?:[^\r\n]*\S)?$/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
/** Hechos de un único origen. Ninguna magnitud fiscal entra desde el cliente. */
export const HistoriaRenovablesMurcia2024 = Schema.Struct({
  ejercicio: Schema.Literal(2024), contribuyente: Texto, referencia: Texto,
  nacimiento: Fecha, residencia: Schema.Literal("murcia-todo-2024-y-2025"),
  modalidad: Schema.Literal("individual"), devengo: Schema.Literal("2024-12-31"),
  familia: Schema.Literal("ninguna"), discapacidad: Schema.Literal("ninguna"),
  otrasRentas: Schema.Literal("ninguna"), reduccionesBase: Schema.Literal("ninguna"),
  deduccionesGenerales: Schema.Literal("ninguna"), otrasDeduccionesAutonomicas: Schema.Literal("ninguna"),
  otrosSaldos: Schema.Literal("ninguno"), declaracion: Texto,
  eleccion2024: Schema.Literals(["aplicar", "no_aplicar"]),
  eleccion2025: Schema.Literals(["aplicar", "no_aplicar"]),
  empleo: Schema.Struct({
    perceptor: Texto, pagador: Texto, rendimientoId: Texto, certificado: Texto,
    desde: Schema.Literal("2024-01-01"), hasta: Schema.Literal("2024-12-31"), retencionesEUR: Euros,
  }),
  trabajo: GastosTrabajo,
  inventario: Schema.Struct({
    referencia: Texto, completoHasta: Schema.Literal("2025-12-31"),
    otrasInstalaciones: Schema.Literal("ninguna"), inversiones2023: Schema.Literal("ninguna"),
    inversiones2025: Schema.Literal("ninguna"), ayudasPosteriores2024: Schema.Literal("ninguna"),
  }),
  vivienda: Schema.Struct({
    id: Texto, titular: Texto, territorio: Schema.Literal("murcia"),
    porcentajePropiedad: Schema.Literal("100"), uso: Schema.Literal("habitual"),
    adquisicion: Fecha, ocupacionDesde: Fecha, permanenciaHasta: Schema.Literal("2025-12-31"), soporte: Texto,
  }),
  instalacion: Schema.Struct({
    id: Texto, operacionId: Texto, titular: Texto, viviendaId: Texto, finalizacion: Fecha,
    tecnologia: Schema.Literal("solar_fotovoltaica"),
    autoconsumo: Schema.Literals(["sin_excedentes", "excedentes_compensados"]),
    instalador: Texto, habilitacionInstalador: Texto,
    declaracionResponsable: Schema.Struct({ referencia: Texto, titular: Texto, instalacionId: Texto, fecha: Fecha }),
  }),
  factura: Schema.Struct({
    id: Texto, concepto: Schema.Literal("adquisicion-e-instalacion-renovable"), operacionId: Texto, instalacionId: Texto, destinatario: Texto, emisor: Texto,
    fecha: Fecha, importeEUR: Euros, soporte: Texto,
  }),
  pagos: Schema.Array(Schema.Struct({
    id: Texto, operacionId: Texto, instalacionId: Texto, facturaId: Texto, pagador: Texto, beneficiario: Texto,
    fecha: Fecha, importeEUR: Euros, medio: Schema.Literals(["transferencia", "tarjeta", "cheque_nominativo", "ingreso_cuenta"]), soporte: Texto,
  })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  ayudas: Schema.Array(Schema.Struct({
    id: Texto, beneficiario: Texto, instalacionId: Texto, fecha: Fecha, importeEUR: Euros, soporte: Texto,
    concesion: Schema.optionalKey(Schema.Struct({
      norma: Schema.Literal("Real Decreto 477/2021"), programa: Schema.Literal(4),
      referencia: Texto, autoridad: Texto, fecha: Fecha, beneficiario: Texto, instalacionId: Texto,
    })),
  })).check(Schema.isMaxLength(100)),
})
export type HistoriaRenovablesMurcia2024 = typeof HistoriaRenovablesMurcia2024.Type
