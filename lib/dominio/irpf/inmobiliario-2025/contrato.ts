import { Schema } from "effect"
import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"

const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const Dinero = Schema.String.check(Schema.isPattern(/^\d{1,13}(?:\.\d{1,2})?$/))
const PrimerAlquiler2025 = Schema.Struct({
  tituloOneroso: Texto,
  construccionTerminada: Fecha,
  documentoConstruccion: Texto,
  historiaInmueble: Schema.Array(Schema.Struct({ desde: Fecha, hasta: Fecha, propietario: Texto, documento: Texto, uso: Schema.Literals(["sin-alquiler", "alquiler"]) })),
  historiaPersonal: Schema.Struct({ persona: Texto, nacimiento: Fecha, hasta: Fecha, documento: Texto,
    cobertura: Schema.Literal("todos-los-inmuebles-y-medidas-desde-nacimiento"),
    alquileresAnteriores: Schema.Array(Schema.Struct({ inmueble: Texto, desde: Fecha, hasta: Fecha, documento: Texto })),
    aplicacionesAnteriores: Schema.Array(Schema.Struct({ inmueble: Texto, ejercicio: Schema.Number, codigo: Texto, documento: Texto })),
  }),
  censoDerechos: Schema.Struct({ documento: Texto, cobertura: Schema.Literal("mundial-completo-a-devengo"), inmuebles: Schema.Array(Texto) }),
  vinculo: Schema.Struct({ documento: Texto, conyuge: Schema.Boolean, parejaEquiparada: Schema.Boolean, consanguinidad: Schema.Number, afinidad: Schema.Number }),
  catastroImputacion: Schema.Struct({ municipio: Texto, notificacion: Fecha, documento: Texto,
    procedimiento: Schema.Literals(["colectivo-general", "otro"]), entradaVigor: Fecha }),
  fianza: Schema.Struct({ ente: Texto, resguardo: Texto, fecha: Fecha }),
  superficieUtil: Dinero,
  documentoSuperficie: Texto,
  rentaMensual: Schema.Array(Schema.Struct({ concepto: Texto, importe: Dinero })),
  programa: Schema.Literal("ordinario"),
  observacion: Schema.Struct({ hasta: Schema.Literal("2025-12-31"), arrendatario: Texto, documento: Texto, incidencias: Schema.Literal("ninguna") }),
})
const Periodo = { desde: Fecha, hasta: Fecha }
export const InmuebleP4a = Schema.Struct({
  primerAlquiler2025: Schema.optional(PrimerAlquiler2025),
  id: Texto,
  catastro: Texto,
  ubicacion: Schema.Literals(["canarias", "illes-balears", "resto-espana"]),
  titular: Texto,
  titulo: Texto,
  derecho: Schema.Literal("propiedad"),
  regimenMatrimonial: Schema.Literals(["no-casado", "separacion-bienes"]),
  titulares: Schema.Array(Texto),
  adquisicion: Schema.Struct({ fecha: Fecha, escritura: Texto, precio: Dinero, gastosTributos: Dinero, sueloPrecio: Dinero, sueloGastosTributos: Dinero }),
  catastro2025: Schema.Struct({ documento: Texto, suelo: Dinero, construccion: Dinero }),
  usosDesdeAdquisicion: Schema.Array(Schema.Struct({ ...Periodo, uso: Schema.Literals(["personal", "a-disposicion", "alquiler-vivienda"]) })),
  contrato: Schema.Struct({
    id: Texto, documento: Texto, firma: Fecha, ...Periodo,
    arrendador: Texto, arrendatario: Texto,
    destino: Schema.Literal("vivienda-permanente-persona-fisica"),
    parentesco: Schema.Literal("ninguno"),
    fianzaDepositada: Texto,
    zonaTensionada: Schema.Literal(false),
    alquilerSocial: Schema.Literal(false),
    rehabilitacionesTresAnios: Schema.Literal("ninguna"),
    repercusionObras: Dinero,
  }),
  exigibilidades: Schema.Array(Schema.Struct({ id: Texto, documento: Texto, fecha: Fecha, importe: Dinero })),
  gastos: Schema.Array(Schema.Struct({
    id: Texto, factura: Texto, lineaFactura: Texto, totalFactura: Dinero,
    fechaOperacion: Fecha, fechaFactura: Fecha, fechaPago: Fecha, importe: Dinero,
    periodoDevengo: Schema.optional(Schema.Struct(Periodo)),
    puestaEnServicio: Schema.optional(Fecha),
    prestadorNif: Texto,
    clase: Schema.Literals(["intereses", "reparacion", "tributo", "comunidad", "seguro", "servicios", "defensa", "suministro", "mejora", "principal-prestamo", "sancion"]),
  })),
  censo: Schema.Literal("contratos-ingresos-gastos-usos-y-titulares-completos"),
  serviciosHospedaje: Schema.Literal("ninguno"),
  personalJornadaCompleta: Schema.Literal("ninguno"),
  ayudas: Schema.Literal("ninguna"),
  saldosPrevios: Schema.Literal("ninguno"),
  insolvencia: Schema.Literal("ninguna"),
  mobiliario: Schema.Literal("ninguno"),
  mejorasAnteriores2025: Schema.Literal("ninguna"),
  ingresosIrregulares: Schema.Literal("ninguno"),
})
export type InmuebleP4a = typeof InmuebleP4a.Type

/** Perfil exclusivo: la renta mixta necesita una conexión posterior de trabajo efectivo. */
export const CasoInmobiliarioP4a = Schema.Struct({
  perfil: Schema.Literal("solo-inmobiliario-p4a"),
  ejercicio: Schema.Literal(2025),
  contribuyenteId: Texto,
  liquidacionId: Texto,
  comunidadAutonoma: Schema.Literals(["canarias", "illes-balears"]),
  edad: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 18, maximum: 64 })),
  otrasRentas: Schema.Literal("ninguna"),
  familiares: Schema.Literal("ninguno"),
  discapacidad: Schema.Literal("ninguna"),
  reduccionesBase: Schema.Literal("ninguna"),
  inmuebles: Schema.Array(InmuebleP4a).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  deduccionesTerritoriales2025: Schema.optional(SolicitudDeduccionesTerritoriales2025),
  retenciones: Schema.Array(Schema.Struct({ id: Texto, documento: Texto, fecha: Fecha, importe: Dinero })),
})
export type CasoInmobiliarioP4a = typeof CasoInmobiliarioP4a.Type
export class RechazoP4a extends Schema.TaggedErrorClass<RechazoP4a>()("RechazoP4a", {
  codigo: Schema.Literals(["entrada", "identidad", "duplicado", "dias", "historia", "contrato", "gasto", "renta-mixta"]),
  motivo: Texto,
}) {}
