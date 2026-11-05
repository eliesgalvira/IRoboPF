import Decimal from "decimal.js"
import { Result, Schema } from "effect"
import { fecha } from "../deducciones/asturias-cantabria-hechos-2025/comun"
import { racional, type Racional } from "../deducciones/anual-territorial-racional"
import { CensoIngresosIdentificados2025 } from "./contrato"

// El cobro agregado necesita <=18 cifras (<=16 tras conciliar concesiones).
// Transporte interno:18 enteros+80 posiciones decimales=98 cifras; hasta100
// sumandos acotados añaden como máximo2 enteros. No modifica Decimal global
// ni la precisión80 de composición. Derivación:PRECISION.md.
export const DecimalIngreso2025 = Decimal.clone({ precision: 100 })
type Ayuda = CensoIngresosIdentificados2025["ayudas"][number]
export type PreparacionIngresos2025 = {
  readonly censo: CensoIngresosIdentificados2025
  readonly totalGeneral: Decimal
  readonly ayudas: readonly { readonly hechos: Ayuda; readonly cobrado: string }[]
}
export type IngresoIdentificadoIntegrado2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly ayudaId: string
  readonly beneficiario: string
  readonly programa: Ayuda["programa"]
  readonly clasificacionFiscal: Ayuda["clasificacionFiscal"]
  readonly resolucion: Ayuda["resolucion"]
  readonly cobros: Ayuda["cobros"]
  readonly cobrado: Racional
  readonly integradoBaseGeneral: string
  readonly integradoBaseLiquidable: string
  readonly nodoFiscalOrigen: string
  readonly criterio: "cobro-art14_2_c-sin-reducciones-ni-compensaciones-base"
}
export type LibroIngresosIdentificados2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly liquidacion: string
  readonly ingresos: readonly IngresoIdentificadoIntegrado2025[]
  readonly totalIntegradoGeneral: Racional
  readonly reservas: readonly string[]
  readonly aceptacionFiscal: "pendiente"
}
type Rechazo = { readonly estado: "no_soportado"; readonly motivo: string }
type Ambito = {
  readonly anio: number
  readonly comunidadAutonoma: string
  readonly contribuyenteId?: string | undefined
  readonly fallecimiento: boolean
}
/** No transforma una concesión en renta ni acepta bases atribuidas del cliente. */
export function prepararIngresosIdentificados2025(
  entrada: CensoIngresosIdentificados2025,
  ambito: Ambito
): Rechazo | { readonly estado: "preparado"; readonly preparacion: PreparacionIngresos2025 } {
  const decoded = Schema.decodeUnknownResult(CensoIngresosIdentificados2025)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(decoded)) return { estado: "no_soportado", motivo: "Censo P1 cerrado: programa/clasificación, cobros2025 y hechos primarios; no bases, compensaciones ni cuotas externas" }
  const censo = decoded.success
  if (ambito.anio !== 2025 || !["asturias", "galicia", "extremadura"].includes(ambito.comunidadAutonoma) || ambito.fallecimiento || censo.contribuyenteId !== ambito.contribuyenteId)
    return { estado: "no_soportado", motivo: "Ingreso identificado: territorio soportado2025 individual ordinario con identidad anual propia" }
  const ayudas = new Set<string>(), resoluciones = new Set<string>(), cobros = new Set<string>(), justificantes = new Set<string>()
  const preparadas: { readonly hechos: Ayuda; readonly cobrado: string }[] = []
  let total = new DecimalIngreso2025("0")
  for (const a of censo.ayudas) {
    if (ayudas.has(a.ayudaId) || resoluciones.has(a.resolucion.referencia))
      return { estado: "no_soportado", motivo: "ayudaId o resolución duplicada en censo de ingresos" }
    ayudas.add(a.ayudaId); resoluciones.add(a.resolucion.referencia)
    if (a.beneficiario !== censo.contribuyenteId || a.cobros.some(c => c.beneficiario !== a.beneficiario))
      return { estado: "no_soportado", motivo: "Beneficiario del ingreso/cobro distinto del contribuyente" }
    const region = a.programa === "asturias-ela-2025" ? "asturias" : a.programa === "galicia-bs215a-2025" ? "galicia" : "extremadura"
    if (region !== ambito.comunidadAutonoma)
      return { estado: "no_soportado", motivo: "Programa regional distinto del territorio de residencia" }
    const inicio = region === "asturias" ? "2025-06-27" : region === "galicia" ? "2025-07-15" : "2025-01-01"
    if (region !== "asturias" && (censo.ayudas.length !== 1 ||
      (region === "galicia" ? new DecimalIngreso2025(a.resolucion.importeConcedido).gt("12000") : !new DecimalIngreso2025(a.resolucion.importeConcedido).eq("2000"))))
      return { estado: "no_soportado", motivo: "Extensión regional: un expediente2025; Galicia máximo12000, Extremadura cuantía fija2000" }
    if (!fecha(a.resolucion.fecha) || a.resolucion.fecha < inicio)
      return { estado: "no_soportado", motivo: "Resolución fuera de la convocatoria regional2025 o fecha civil inválida" }
    let cobrado = new DecimalIngreso2025("0")
    for (const c of a.cobros) {
      if (cobros.has(c.cobroId) || justificantes.has(c.justificante))
        return { estado: "no_soportado", motivo: "Cobro o justificante repetido entre ingresos identificados" }
      cobros.add(c.cobroId); justificantes.add(c.justificante)
      if (!fecha(c.fecha) || c.fecha < a.resolucion.fecha || !c.fecha.startsWith("2025-"))
        return { estado: "no_soportado", motivo: "Cobro fuera de2025, anterior a resolución o fecha civil inválida" }
      const importe = new DecimalIngreso2025(c.euros)
      if (!importe.gt("0")) return { estado: "no_soportado", motivo: "Se necesita cobro positivo; concesión sin cobro no integra renta" }
      cobrado = cobrado.plus(importe)
    }
    if (cobrado.gt(a.resolucion.importeConcedido))
      return { estado: "no_soportado", motivo: "Cobros superiores a la resolución; falta conciliación del expediente" }
    if (region === "galicia" && !cobrado.eq(a.resolucion.importeConcedido))
      return { estado: "no_soportado", motivo: "Galicia: el evaluador clasifica toda la concesión; cobro parcial requiere libro de saldo pendiente no representado" }
    total = total.plus(cobrado)
    preparadas.push({ hechos: a, cobrado: cobrado.toFixed() })
  }
  return { estado: "preparado", preparacion: { censo, totalGeneral: total, ayudas: preparadas } }
}
/** Sólo composición: BIG/BLG calculadas, nunca etiquetas sobre una renta agregada. */
export function atribuirIngresosIdentificados2025(
  preparacion: PreparacionIngresos2025,
  baseImponibleGeneral: Decimal,
  baseLiquidableGeneral: Decimal
): Rechazo | { readonly estado: "integrado"; readonly libro: LibroIngresosIdentificados2025 } {
  if (!baseImponibleGeneral.eq(baseLiquidableGeneral) || baseImponibleGeneral.lt(preparacion.totalGeneral))
    return { estado: "no_soportado", motivo: "P1 requiere BIG=BLG sin pérdidas, reducciones ni compensaciones de base no atribuidas; no admite prorrateo" }
  const contribuyente = preparacion.censo.contribuyenteId
  const liquidacion = "motor-anual:2025:" + contribuyente
  const ingresos = preparacion.ayudas.map(({ hechos: a, cobrado }): IngresoIdentificadoIntegrado2025 => ({
    ejercicio: 2025, contribuyente, ayudaId: a.ayudaId, beneficiario: a.beneficiario,
    programa: a.programa, clasificacionFiscal: a.clasificacionFiscal,
    resolucion: a.resolucion, cobros: a.cobros, cobrado: racional(cobrado),
    integradoBaseGeneral: cobrado, integradoBaseLiquidable: cobrado,
    nodoFiscalOrigen: liquidacion + ":ganancia-no-transmision:" + a.ayudaId,
    criterio: "cobro-art14_2_c-sin-reducciones-ni-compensaciones-base",
  }))
  return { estado: "integrado", libro: {
    ejercicio: 2025, contribuyente, liquidacion, ingresos,
    totalIntegradoGeneral: racional(preparacion.totalGeneral.toFixed()),
    reservas: ["Resoluciones, diagnóstico, justificantes de cobro y exhaustividad declarados; no se certifica su autenticidad ni aceptación fiscal", "Sólo Asturias ELA2025, Galicia BS215A2025 y Extremadura ELA convocatoria2025; excluidas prestaciones SAAD, estatales y convocatorias2026"],
    aceptacionFiscal: "pendiente",
  } }
}
