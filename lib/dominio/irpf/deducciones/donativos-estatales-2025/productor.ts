import Decimal from "decimal.js"
import { Schema, Result, DateTime, Option } from "effect"
import { racional, sumar, restar, menor, type Racional } from "../anual-territorial-racional"
import { SolicitudDonativosEstatales2025, type OperacionDonativo2025, type PagoDonativo2025, type CertificadoDonativo2025 } from "./esquemas"
const D = Decimal.clone({ precision: 80 })
export class DonativoNoSoportado extends Schema.TaggedErrorClass<DonativoNoSoportado>()("DonativoNoSoportado", { motivo: Schema.String, siguienteHecho: Schema.String }) {
  override readonly message = this.motivo
}
function exigir(b: boolean, campo: string, motivo: string): asserts b {
  if (!b) throw new DonativoNoSoportado({ siguienteHecho: campo, motivo })
}
function texto(s: string, campo: string): void {
  exigir(s.length > 0 && s.trim() === s && !/[\r\n]/.test(s), campo, "Identidad o referencia vacía/con espacios extremos")
}
export function multiplicarDonativo(a: Racional, b: Racional): Racional {
  return racional(String(BigInt(a.numeradorEuros) * BigInt(b.numeradorEuros)), String(BigInt(a.divisor) * BigInt(b.divisor)))
}
function fecha(s: string, campo: string): string {
  const d = DateTime.make(s + "T00:00:00Z")
  exigir(/^\d{4}-\d{2}-\d{2}$/.test(s) && Option.isSome(d) && DateTime.formatIsoDateUtc(d.value) === s, campo, "Fecha civil inexistente")
  return s
}
function dinero(s: string): Racional {
  exigir(/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(s) && new D(s).lte("90071992547409.91"), "pago.euros", "EUR declarados no negativos y exactos en céntimos")
  return racional(s)
}
function nif(s: string): void {
  exigir(/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(s), "entidad.nif", "NIF jurídico español requerido en esta primera rama")
  const cifras = s.slice(1, 8).split("").map(Number)
  const suma = cifras.reduce((a, n, i) => {
    const doble = n * 2
    return a + (i % 2 === 1 ? n : Math.floor(doble / 10) + doble % 10)
  }, 0)
  const control = (10 - suma % 10) % 10, ultimo = s.slice(-1)
  exigir(ultimo === String(control) || ultimo === "JABCDEFGHI"[control], "entidad.nif", "Control NIF contradictorio")
}
function comprobar(p: PagoDonativo2025, c: CertificadoDonativo2025, o: OperacionDonativo2025, actor: string, nifActor: string, anio: number): Racional {
  for (const s of [p.id, p.operacionId, p.documento, c.referencia, c.operacionId, c.destino]) texto(s, "pago_certificado.identidad_referencia")
  const f = fecha(p.fecha, "pago.fecha")
  exigir(f.startsWith(String(anio) + "-"), "pago.fecha", "Pago de otro período")
  exigir(p.operacionId === c.operacionId && p.pagador === actor && c.donante === actor && c.nifDonante === nifActor && p.receptorNIF === o.entidad.nif && c.entidadNIF === o.entidad.nif, "identidad_operacion_donante_entidad", "Pago/certificado de otra operación, persona o entidad")
  const certificado = dinero(c.euros), pagado = dinero(p.euros)
  exigir(fecha(c.fechaDonativo, "certificado.fechaDonativo") === f && certificado.numeradorEuros === pagado.numeradorEuros && certificado.divisor === pagado.divisor, "certificado.importe_fecha", "Certificado y pago no concuerdan")
  exigir(dinero(c.contraprestacionEUR).numeradorEuros === "0", "certificado.contraprestacionEUR", "Primera rama sin contraprestación")
  exigir(fecha(o.entidad.regimenDesde, "regimenDesde") <= f && fecha(o.entidad.regimenHasta, "regimenHasta") >= f && o.entidad.regimenHasta <= "2025-12-31", "entidad.regimen", "Aplicación temporal del régimen no acreditada para el pago")
  return dinero(p.euros)
}
export type MagnitudesDonativos = {
  readonly contribuyente: string; readonly baseLiquidableGeneral: Decimal; readonly baseLiquidableAhorro: Decimal
  readonly cuotaEstatal: Decimal; readonly cuotaAutonomica: Decimal
}
export type RegistroDonativo = {
  readonly operacionId: string; readonly entidadId: string; readonly entidadNIF: string
  readonly claseEntidad: "fundacion" | "asociacion_utilidad_publica"
  readonly pago: PagoDonativo2025; readonly certificado: CertificadoDonativo2025
  readonly eleccion: "aplicar" | "no_aplicar"; readonly porcentajeResto: "0.40" | "0.45"
  readonly baseComputada68_3: Racional; readonly generado: Racional
}
export type ParteCuotaDonativo = { readonly integra: Racional; readonly generada: Racional; readonly aplicada: Racional; readonly disponible: Racional }
export type LibroDonativosEstatales2025 = {
  readonly aceptacionFiscal: "pendiente"
  readonly ejercicio: 2025; readonly contribuyente: string; readonly origen: string
  readonly baseLiquidable: Racional; readonly limiteBase: Racional
  readonly base68_3: Racional; readonly base68_5: Racional
  readonly operaciones: readonly RegistroDonativo[]; readonly generado: Racional; readonly aplicado: Racional
  readonly estatal: ParteCuotaDonativo; readonly autonomica: ParteCuotaDonativo
  readonly atribucionBaseRegionalCompleta: boolean
  readonly citas: readonly string[]; readonly reservas: readonly string[]
}
/** Una operación seleccionada; ninguna cuota ni magnitud fiscal se lee del cliente. */
export function producirDonativosEstatales2025(entrada: SolicitudDonativosEstatales2025, m: MagnitudesDonativos): LibroDonativosEstatales2025 {
  const dec = Schema.decodeUnknownResult(SolicitudDonativosEstatales2025)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(dec)) throw new DonativoNoSoportado({ siguienteHecho: String(dec.failure), motivo: "Hechos de donativos incompletos, categoría no representada o magnitudes fiscales externas" })
  const s = dec.success
  texto(s.referenciaCenso, "referenciaCenso")
  exigir(/^(\d{8}|[XYZ]\d{7})[A-Z]$/.test(s.nifContribuyente), "nifContribuyente", "Primera rama DNI/NIE individual con control fiscal")
  const numeroNif = s.nifContribuyente.slice(0, -1).replace(/^X/, "0").replace(/^Y/, "1").replace(/^Z/, "2")
  exigir("TRWAGMYFPDXBNJZSQVHLCKE"[Number(numeroNif) % 23] === s.nifContribuyente.slice(-1), "nifContribuyente", "Control DNI/NIE contradictorio")
  exigir(s.contribuyente === m.contribuyente, "contribuyente", "Censo de otra persona")
  exigir(s.operaciones68_5.length === 0, "productor68_5", "Operaciones de patrimonio68.5 no representadas; no se suponen cero")
  exigir(s.operaciones68_3.length > 0 && s.operaciones68_3.length <= 100, "operaciones68_3", "Identificar al menos una operación y un censo acotado")
  exigir(s.operaciones68_3.filter((o) => o.eleccion === "aplicar").length <= 1, "eleccion_una_operacion", "Múltiples operaciones seleccionadas requieren atribución de franquicia y prioridad no implementadas")
  for (const v of [m.baseLiquidableGeneral, m.baseLiquidableAhorro, m.cuotaEstatal, m.cuotaAutonomica])
    exigir(v.isFinite() && v.gte(0), "magnitudes_internas", "Magnitud interna no finita o negativa")
  const bl = racional(new D(m.baseLiquidableGeneral).plus(m.baseLiquidableAhorro).toFixed())
  const limite = multiplicarDonativo(bl, racional("0.10"))
  const ids = new Set<string>(), pagos = new Set<string>(), certificados = new Set<string>(), documentos = new Set<string>(), entidades = new Set<string>()
  const registros: RegistroDonativo[] = []
  let base = racional("0"), generado = racional("0")
  for (const o of s.operaciones68_3) {
    for (const valor of [o.operacionId, o.entidad.id, o.entidad.registro, o.entidad.referenciaRegimen, o.entidad.referenciaOpcionRegimen]) texto(valor, "operacion_entidad.identidad_referencia")
    nif(o.entidad.nif)
    exigir(!ids.has(o.operacionId) && !pagos.has(o.pago.id) && !certificados.has(o.certificado.referencia) && !documentos.has(o.pago.documento), "duplicidad_operacion_pago_certificado", "Operación, pago o certificado repetidos")
    exigir(!entidades.has(o.entidad.nif), "agregacion_entidad", "Más de una operación de la misma entidad requiere agregado, no otra franquicia250")
    ids.add(o.operacionId); pagos.add(o.pago.id); certificados.add(o.certificado.referencia); documentos.add(o.pago.documento); entidades.add(o.entidad.nif)
    exigir(o.pago.operacionId === o.operacionId, "pago.operacionId", "Identificador de operación contradictorio")
    exigir(o.entidad.clase !== "asociacion_utilidad_publica" || o.entidad.utilidadPublica !== undefined, "entidad.utilidadPublica", "Resolución de utilidad pública ausente")
    const bruto = comprobar(o.pago, o.certificado, o, m.contribuyente, s.nifContribuyente, 2025)
    if (o.historial !== undefined)
      for (const h of o.historial) comprobar(h.pago, h.certificado, o, m.contribuyente, s.nifContribuyente, h.ejercicio)
    let porcentaje: "0.40" | "0.45" = "0.40"
    if (o.incremento === "reiteracion_45") {
      const historia = o.historial
      exigir(o.historialExhaustivo !== undefined && historia !== undefined && historia.length === 2 && new Set(historia.map((h) => h.ejercicio)).size === 2, "historial2023_2024", "45% solicitado sin dos períodos completos2023/2024")
      exigir(new Set([o.pago.id, ...historia.map((h) => h.pago.id)]).size === 3 && new Set([o.operacionId, ...historia.map((h) => h.pago.operacionId)]).size === 3, "historial.identidades", "Pago u operación repetidos entre períodos")
      const importes = historia.map((h) => ({ anio: h.ejercicio, valor: comprobar(h.pago, h.certificado, o, m.contribuyente, s.nifContribuyente, h.ejercicio) })).sort((a, b) => a.anio - b.anio)
      exigir(BigInt(importes[0]!.valor.numeradorEuros) > 0n && menor(importes[0]!.valor, importes[1]!.valor) === importes[0]!.valor && menor(importes[1]!.valor, bruto) === importes[1]!.valor, "historial_no_decreciente2023_2025", "Historial sin donativos positivos no decrecientes a la misma entidad")
      porcentaje = "0.45"
    }
    const computada = o.eleccion === "aplicar" ? menor(bruto, limite) : racional("0")
    const tramo = menor(computada, racional("250"))
    const deduccion = sumar(multiplicarDonativo(tramo, racional("0.80")), multiplicarDonativo(restar(computada, tramo), racional(porcentaje)))
    registros.push({ operacionId: o.operacionId, entidadId: o.entidad.id, entidadNIF: o.entidad.nif, claseEntidad: o.entidad.clase, pago: o.pago, certificado: o.certificado, eleccion: o.eleccion, porcentajeResto: porcentaje, baseComputada68_3: computada, generado: deduccion })
    base = sumar(base, computada); generado = sumar(generado, deduccion)
  }
  const mitad = multiplicarDonativo(generado, racional("0.50"))
  function parte(cuota: Decimal): ParteCuotaDonativo {
    const integra = racional(cuota.toFixed()), aplicada = menor(integra, mitad)
    return { integra, generada: mitad, aplicada, disponible: restar(integra, aplicada) }
  }
  const estatal = parte(m.cuotaEstatal), autonomica = parte(m.cuotaAutonomica)
  const aplicado = sumar(estatal.aplicada, autonomica.aplicada)
  return { aceptacionFiscal: "pendiente", ejercicio: 2025, contribuyente: m.contribuyente, origen: "composicion-unica-anual:2025:" + m.contribuyente,
    baseLiquidable: bl, limiteBase: limite, base68_3: base, base68_5: racional("0"), operaciones: registros, generado, aplicado, estatal, autonomica,
    atribucionBaseRegionalCompleta: restar(generado, aplicado).numeradorEuros === "0",
    citas: ["p2-aeat2025-tabla-80-40-45", "p2-aeat2025-limite10", "p2-lirpf-art67-77", "p2-ley49-entidad-certificado"],
    reservas: ["Hechos/documentos y censo declarados, no autenticados; sin especie, prioritarias,68.5 ni otras deducciones generales", "Insuficiencia de una parte de cuota no se transfiere a la otra ni se convierte en arrastre"] }
}
export const eurosDonativos = (r: Racional): Decimal => new D(r.numeradorEuros).div(r.divisor)
