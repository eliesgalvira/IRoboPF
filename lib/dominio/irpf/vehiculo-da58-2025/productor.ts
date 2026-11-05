import Decimal from "decimal.js"
import { DateTime, Option, Result, Schema } from "effect"

const Pago = Schema.Struct({ id: Schema.String, fecha: Schema.String, pagador: Schema.String, importe: Schema.String, documento: Schema.String, vendedor: Schema.String })
/** Hechos declarados; las referencias no autentican documentos ni homologación. */
export const HechosVehiculoDA58 = Schema.Struct({
  ejercicio: Schema.Literal(2025), contribuyente: Schema.String,
  opcion: Schema.Literal("adquisicion_y_matriculacion_2025"),
  historia: Schema.Literal("sin_otra_compra_DA58_ni_anticipos_previos"), referenciaHistoria: Schema.String,
  vehiculo: Schema.Struct({
    id: Schema.String, bastidor: Schema.String, matricula: Schema.String,
    titular: Schema.String, titularFactura: Schema.String, vendedor: Schema.String, factura: Schema.String,
    fechaAdquisicion: Schema.String, primeraMatriculacion: Schema.String,
    nuevo: Schema.Literal(true), categoria: Schema.Literal("M1"), tecnologia: Schema.Literal("BEV"),
    plazas: Schema.Number, autonomiaWLTP: Schema.String, fichaTecnica: Schema.String,
    modeloIDAE: Schema.String, referenciaIDAE: Schema.String, fechaConsultaIDAE: Schema.String,
    afectacion: Schema.Literal("ninguna"), permanencia: Schema.Literal("prevista_cuatro_anios"),
    precioSinIVA: Schema.String, tributos: Schema.String, gastosInherentes: Schema.String,
    pagos: Schema.Array(Pago),
    ayudas: Schema.Array(Schema.Struct({ id: Schema.String, vehiculoId: Schema.String, programa: Schema.String, referencia: Schema.String, importe: Schema.String, estado: Schema.Literal("prevista_no_cobrada_2025") })),
    exhaustividad: Schema.Literal("pagos_ayudas_y_titularidad_completos"),
  }),
})
export type HechosVehiculoDA58 = typeof HechosVehiculoDA58.Type
const A = Decimal.clone({ precision: 200 })
function exigir(b: boolean, motivo: string): asserts b { if (!b) throw new RangeError("DA58: " + motivo) }
const dinero = (s: string) => {
  exigir(/^(0|[1-9]\d{0,13})(\.\d{1,80})?$/.test(s), "importe primario no negativo, decimal hasta 80 posiciones")
  const v = new A(s)
  exigir(v.sd() <= 80, "importe excede 80 cifras significativas")
  return v
}
const fecha = (s: string) => {
  const motivo = "adquisición, matrícula y pagos íntegros de 2025; anticipos anteriores requieren libro por ejercicio y elección a/b"
  exigir(/^2025-\d{2}-\d{2}$/.test(s), motivo)
  const d = DateTime.make(s + "T00:00:00Z")
  exigir(Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === s, motivo)
  return s
}
export function producirVehiculoDA58(entrada: HechosVehiculoDA58, contribuyente: string, cuotaEstatal: Decimal) {
  const decoded = Schema.decodeUnknownResult(HechosVehiculoDA58)(entrada, { onExcessProperty: "error" })
  exigir(Result.isSuccess(decoded), "contrato incompleto o cálculo fiscal externo; sólo M1 BEV de 2–7 plazas, sin anticipos de otros ejercicios")
  const h = decoded.success, v = h.vehiculo
  for (const s of [contribuyente,h.contribuyente,h.referenciaHistoria,v.id,v.bastidor,v.matricula,v.titular,v.vendedor,v.factura,v.fichaTecnica,v.modeloIDAE,v.referenciaIDAE]) exigir(s.trim().length > 0, "identidad/evidencia vacía")
  exigir(h.contribuyente === contribuyente && v.titular === contribuyente && v.titularFactura === contribuyente, "titular, factura y contribuyente anual deben coincidir; sin cotitularidad")
  exigir(Number.isInteger(v.plazas) && v.plazas >= 2 && v.plazas <= 7, "sólo M1 de 2–7 plazas; excepción 8/9 plazas no representada")
  exigir(dinero(v.autonomiaWLTP).gte(30), "autonomía eléctrica mínima 30 km")
  fecha(v.fechaAdquisicion); fecha(v.primeraMatriculacion); fecha(v.fechaConsultaIDAE)
  exigir(v.fechaConsultaIDAE <= v.fechaAdquisicion, "evidencia IDAE del modelo a la adquisición")
  exigir(v.fechaAdquisicion <= v.primeraMatriculacion, "primera matrícula anterior a adquisición fuera del perfil")
  const precio = dinero(v.precioSinIVA), valor = precio.plus(dinero(v.tributos)).plus(dinero(v.gastosInherentes))
  exigir(precio.gt(0) && precio.lte(45000), "precio antes IVA debe ser positivo y <=45000 EUR; otros límites/categorías pendientes")
  const ids = new Set<string>(), documentos = new Set<string>()
  let pagos = new A(0), ayudas = new A(0)
  for (const p of v.pagos) {
    exigir(p.id.trim().length > 0 && !ids.has(p.id), "pago duplicado/vacío"); ids.add(p.id)
    exigir(p.documento.trim().length > 0 && !documentos.has(p.documento), "documento pago duplicado/vacío"); documentos.add(p.documento)
    exigir(p.pagador === contribuyente && p.vendedor === v.vendedor, "pagador/vendedor ajeno")
    fecha(p.fecha); exigir(p.fecha <= v.primeraMatriculacion, "pago posterior a matriculación fuera del perfil")
    exigir(dinero(p.importe).gt(0), "pago debe ser positivo"); pagos = pagos.plus(p.importe)
  }
  exigir(pagos.eq(valor), "pagos exhaustivos deben conciliar precio, tributos y gastos; sin financiación pendiente")
  const ayudasIds = new Set<string>()
  for (const a of v.ayudas) {
    exigir(a.id.trim().length > 0 && !ayudasIds.has(a.id), "ayuda duplicada/vacía"); ayudasIds.add(a.id)
    exigir(a.vehiculoId === v.id && a.programa.trim().length > 0 && a.referencia.trim().length > 0, "ayuda de otro vehículo o sin expediente")
    ayudas = ayudas.plus(dinero(a.importe))
  }
  exigir(ayudas.lte(valor), "ayudas superiores al valor")
  const base = A.min(20000, valor.minus(ayudas)), generada = base.mul("0.15")
  exigir(cuotaEstatal.isFinite() && cuotaEstatal.gte(0), "cuota estatal interna inválida")
  exigir([valor, ayudas, base, generada].every(x=>x.sd()<=80), "resultado excede transporte exacto de 80 cifras; no redondear frontera")
  const aplicada = A.min(generada, cuotaEstatal)
  return { ejercicio: 2025 as const, contribuyente, vehiculoId: v.id, hechos: h, valor, ayudas, base, generada, aplicada, noAplicada: generada.minus(aplicada), condicion: "documentos_declarados_y_permanencia_futura" as const }
}
export type LibroVehiculoDA58 = ReturnType<typeof producirVehiculoDA58>
