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
  readonly baseTramo80: Racional; readonly baseResto: Racional
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
  readonly prioridad68_3: readonly string[]
  readonly agrupaciones: readonly { readonly entidadNIF: string; readonly bruto2025: Racional; readonly operaciones: readonly string[]; readonly porcentajeResto: "0.40" | "0.45" }[]
  readonly citas: readonly string[]; readonly reservas: readonly string[]
}
function mismaEntidad(a: OperacionDonativo2025["entidad"], b: OperacionDonativo2025["entidad"]): boolean {
  return a.id === b.id && a.nif === b.nif && a.clase === b.clase && a.registro === b.registro &&
    a.utilidadPublica === b.utilidadPublica && a.regimen === b.regimen &&
    a.referenciaRegimen === b.referenciaRegimen && a.referenciaOpcionRegimen === b.referenciaOpcionRegimen &&
    a.regimenDesde === b.regimenDesde && a.regimenHasta === b.regimenHasta
}
/** Aplicación interna posterior a generación; no recibe hechos fiscales públicos. */
export type AplicacionCuotasDonativos2025 = {
  readonly estatal: ParteCuotaDonativo; readonly autonomica: ParteCuotaDonativo; readonly aplicado: Racional
}
export function aplicarGeneracionDonativos2025(generado: Racional, cuotaEstatal: Decimal, cuotaAutonomica: Decimal): AplicacionCuotasDonativos2025 {
  exigir(BigInt(generado.numeradorEuros) >= 0n, "generacion_interna", "Generación no negativa requerida")
  const mitad = multiplicarDonativo(generado, racional("0.50"))
  function parte(cuota: Decimal): ParteCuotaDonativo {
    exigir(cuota.isFinite() && cuota.gte(0), "cuota_interna", "Cuota interna no finita o negativa")
    const integra = racional(cuota.toFixed()), aplicada = menor(integra, mitad)
    return { integra, generada: mitad, aplicada, disponible: restar(integra, aplicada) }
  }
  const estatal = parte(cuotaEstatal), autonomica = parte(cuotaAutonomica)
  return { estatal, autonomica, aplicado: sumar(estatal.aplicada, autonomica.aplicada) }
}
/** Escala única y prioridad elegida; ninguna cuota ni magnitud fiscal se lee del cliente. */
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
  for (const v of [m.baseLiquidableGeneral, m.baseLiquidableAhorro, m.cuotaEstatal, m.cuotaAutonomica])
    exigir(v.isFinite() && v.gte(0), "magnitudes_internas", "Magnitud interna no finita o negativa")
  const bl = racional(new D(m.baseLiquidableGeneral).plus(m.baseLiquidableAhorro).toFixed())
  const limite = multiplicarDonativo(bl, racional("0.10"))
  const ids = new Set<string>(), pagos = new Set<string>(), certificados = new Set<string>(), documentos = new Set<string>()
  const historicas = new Set<string>()
  const grupos = new Map<string, OperacionDonativo2025[]>()
  const nifsPorId = new Map<string, string>()
  const brutos = new Map<string, Racional>()
  // Validar antes de generar: no se ignora un hecho contradictorio por no aplicarlo.
  for (const o of s.operaciones68_3) {
    for (const valor of [o.operacionId, o.entidad.id, o.entidad.registro, o.entidad.referenciaRegimen, o.entidad.referenciaOpcionRegimen]) texto(valor, "operacion_entidad.identidad_referencia")
    nif(o.entidad.nif)
    exigir(!ids.has(o.operacionId) && !pagos.has(o.pago.id) && !certificados.has(o.certificado.referencia) && !documentos.has(o.pago.documento), "duplicidad_operacion_pago_certificado", "Operación, pago o certificado repetidos")
    ids.add(o.operacionId); pagos.add(o.pago.id); certificados.add(o.certificado.referencia); documentos.add(o.pago.documento)
    exigir(o.pago.operacionId === o.operacionId, "pago.operacionId", "Identificador de operación contradictorio")
    exigir(o.entidad.clase !== "asociacion_utilidad_publica" || o.entidad.utilidadPublica !== undefined, "entidad.utilidadPublica", "Resolución de utilidad pública ausente")
    brutos.set(o.operacionId, comprobar(o.pago, o.certificado, o, m.contribuyente, s.nifContribuyente, 2025))
    exigir(!nifsPorId.has(o.entidad.id) || nifsPorId.get(o.entidad.id) === o.entidad.nif, "entidad.id", "Identidad de entidad reutilizada con otro NIF")
    nifsPorId.set(o.entidad.id, o.entidad.nif)
    const grupo = grupos.get(o.entidad.nif) ?? []
    const anterior = grupo[0]
    exigir(anterior === undefined || (mismaEntidad(anterior.entidad, o.entidad) && anterior.incremento === o.incremento), "entidad_agrupada", "Mismo NIF con identidad, régimen o incremento contradictorios")
    grupos.set(o.entidad.nif, [...grupo, o])
  }
  const seleccionadas = s.operaciones68_3.filter(o => o.eleccion === "aplicar")
  const necesitaPrioridad = seleccionadas.length > 1 || [...grupos.values()].some(g => g.length > 1)
  exigir(!necesitaPrioridad || s.prioridad68_3 !== undefined, "prioridad68_3", "Múltiples operaciones: prioridad explícita para límite y franquicia250 única")
  const prioridad = s.prioridad68_3 ?? s.operaciones68_3.map(o => o.operacionId)
  exigir(prioridad.length === ids.size && new Set(prioridad).size === ids.size && prioridad.every(id => ids.has(id)), "prioridad68_3", "Prioridad duplicada, incompleta o de otra operación")
  const porcentajes = new Map<string, "0.40" | "0.45">()
  const agrupaciones: LibroDonativosEstatales2025["agrupaciones"][number][] = []
  for (const [entidadNIF, grupo] of grupos) {
    const primero = grupo[0]!
    const bruto = grupo.reduce((v, o) => sumar(v, brutos.get(o.operacionId)!), racional("0"))
    const portadores = grupo.filter(o => o.historial !== undefined || o.historialExhaustivo !== undefined)
    exigir(portadores.length <= 1, "historial_entidad_unico", "Historia exhaustiva se declara una vez por entidad; no duplicar aportaciones históricas")
    const portador = portadores[0]
    exigir((portador?.historial?.length ?? 0) <= 200, "historial_entidad_acotado", "Máximo200 aportaciones históricas por entidad")
    let total2023 = racional("0"), total2024 = racional("0")
    for (const h of portador?.historial ?? []) {
      exigir(!ids.has(h.pago.operacionId) && !historicas.has(h.pago.operacionId) && !pagos.has(h.pago.id) && !certificados.has(h.certificado.referencia), "historial.identidades", "Pago, operación, documento o certificado repetidos entre períodos")
      historicas.add(h.pago.operacionId); pagos.add(h.pago.id); certificados.add(h.certificado.referencia)
      const valor = comprobar(h.pago, h.certificado, primero, m.contribuyente, s.nifContribuyente, h.ejercicio)
      if (h.ejercicio === 2023) total2023 = sumar(total2023, valor)
      else total2024 = sumar(total2024, valor)
    }
    let porcentaje: "0.40" | "0.45" = "0.40"
    if (primero.incremento === "reiteracion_45") {
      exigir(portador?.historialExhaustivo !== undefined && BigInt(total2023.numeradorEuros) > 0n && BigInt(total2024.numeradorEuros) > 0n, "historial2023_2024", "45% solicitado sin dos períodos completos2023/2024 positivos")
      exigir(menor(total2023, total2024) === total2023 && menor(total2024, bruto) === total2024, "historial_no_decreciente2023_2025", "Agregados por entidad no decrecientes requeridos")
      porcentaje = "0.45"
    }
    porcentajes.set(entidadNIF, porcentaje)
    agrupaciones.push({ entidadNIF, bruto2025: bruto, operaciones: grupo.map(o => o.operacionId), porcentajeResto: porcentaje })
  }
  const entidadesElegidas = new Set(seleccionadas.map(o => o.entidad.nif))
  exigir(entidadesElegidas.size <= 1 || seleccionadas.every(o => o.incremento === "general_40"), "atribucion_franquicia_tipos_mixtos", "Varias entidades con reiteración45: atribución de franquicia por entidad pendiente de criterio; no optimizar implícitamente")
  const registros: RegistroDonativo[] = []
  let base = racional("0"), generado = racional("0"), franquicia = racional("250")
  for (const id of prioridad) {
    const o = s.operaciones68_3.find(v => v.operacionId === id)!
    const porcentaje = porcentajes.get(o.entidad.nif)!
    const computada = o.eleccion === "aplicar" ? menor(brutos.get(id)!, restar(limite, base)) : racional("0")
    const tramo = menor(computada, franquicia), resto = restar(computada, tramo)
    const deduccion = sumar(multiplicarDonativo(tramo, racional("0.80")), multiplicarDonativo(resto, racional(porcentaje)))
    registros.push({ operacionId: o.operacionId, entidadId: o.entidad.id, entidadNIF: o.entidad.nif, claseEntidad: o.entidad.clase, pago: o.pago, certificado: o.certificado, eleccion: o.eleccion, porcentajeResto: porcentaje, baseComputada68_3: computada, generado: deduccion, baseTramo80: tramo, baseResto: resto })
    base = sumar(base, computada); generado = sumar(generado, deduccion); franquicia = restar(franquicia, tramo)
  }
  const { estatal, autonomica, aplicado } = aplicarGeneracionDonativos2025(generado, m.cuotaEstatal, m.cuotaAutonomica)
  return { aceptacionFiscal: "pendiente", ejercicio: 2025, contribuyente: m.contribuyente, origen: "composicion-unica-anual:2025:" + m.contribuyente,
    baseLiquidable: bl, limiteBase: limite, base68_3: base, base68_5: racional("0"), operaciones: registros, generado, aplicado, estatal, autonomica,
    prioridad68_3: prioridad, agrupaciones,
    atribucionBaseRegionalCompleta: restar(generado, aplicado).numeradorEuros === "0",
    citas: ["p2-aeat2025-tabla-80-40-45", "p2-aeat2025-limite10", "p2-lirpf-art67-77", "p2-ley49-entidad-certificado"],
    reservas: ["Hechos/documentos y censo declarados, no autenticados; sin especie, prioritarias,68.5 ni otras deducciones generales", "Insuficiencia de una parte de cuota no se transfiere a la otra ni se convierte en arrastre"] }
}
export const eurosDonativos = (r: Racional): Decimal => new D(r.numeradorEuros).div(r.divisor)
