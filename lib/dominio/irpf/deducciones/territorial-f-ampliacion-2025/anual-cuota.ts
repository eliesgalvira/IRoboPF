import {
  racional, sumar, restar, menor, type Racional,
} from "../anual-territorial-racional"
import type { ResultadoF } from "./comun"

type Importe = Racional | ResultadoF
type Aplicacion = {
  codigo: string
  estado: "aplicada" | "excluida" | "pendiente_hechos" | "pendiente_cuota"
  generado?: Racional
  aplicado?: Racional
  pendiente?: Racional
  resultado?: ResultadoF
  resolucionAnual?: { ejercicio: 2025; productor: string; operacion: string }
  origen?: { ejercicio: 2025; objetoId?: string; objetosIds?: readonly string[]; contribuyente: string }
  arrastre?: { primerEjercicio: 2026; ultimoEjercicio: 2027 | 2028 | 2030; saldo: Racional }
  siguienteCondicion?: string
}
function multiplicar(a: Racional, b: Racional): Racional {
  return racional(
    String(BigInt(a.numeradorEuros) * BigInt(b.numeradorEuros)),
    String(BigInt(a.divisor) * BigInt(b.divisor))
  )
}
function prioridad(codigo: string): number {
  if (codigo === "madrid_inversiones_nuevos_contribuyentes_extranjero") return 6
  if (codigo === "madrid_familias_dos_descendientes_ingresos_reducidos") return 5
  if (codigo === "murcia_instalaciones_recursos_energeticos_renovables") return 4
  if (codigo === "murcia_recarga_vehiculos_electricos") return 3
  if (codigo === "murcia_vehiculos_electricos") return 2
  return 1
}
function generar(x: Importe, cuotaIntegra: Racional, disponible: Racional): Racional | undefined {
  if (!("estado" in x)) return x
  if (x.estado === "excluida") return undefined
  if (x.estado === "calculo_parcial" && x.importeExactoRacional !== undefined)
    return x.importeExactoRacional
  const d = x.dependenciaAnual
  if (d?.magnitud === "cuota_integra_autonomica" && x.codigo === "madrid_condicion_familia_numerosa") {
    const bruto = multiplicar(cuotaIntegra, racional(d.factor))
    return d.topeEUR === undefined ? bruto : menor(bruto, racional(d.topeEUR))
  }
  // La composición anual actual no admite deducciones estatales sobre la cuota autonómica.
  // Si esa capacidad cambia, este productor debe ampliarse antes de habilitarla.
  if (d?.magnitud === "cuota_tras_resto_deducciones" && x.codigo === "madrid_familias_dos_descendientes_ingresos_reducidos")
    return multiplicar(disponible, racional(d.factor))
  if (x.estado === "calculo_parcial" && x.importeAntesPresentacionEUR !== undefined)
    return racional(x.importeAntesPresentacionEUR)
  return undefined
}
/** Una cuota y un libro. Ningún rechazo se convierte en importe generado cero. */
export function consumirCuotaAnualF2025(cuota: Racional, codigos: readonly string[], importes: readonly Importe[]) {
  if (codigos.length !== importes.length) throw new RangeError("Libro territorial incompleto")
  if (BigInt(cuota.numeradorEuros) < 0n) throw new RangeError("Cuota anual negativa")
  let disponible = cuota, total = racional("0")
  let anteriorPendiente: string | undefined
  const aplicaciones: Aplicacion[] = []
  const orden = importes.map((x, i) => ({ x, codigo: codigos[i]! }))
    .sort((a, b) => prioridad(a.codigo) - prioridad(b.codigo) || a.codigo.localeCompare(b.codigo))
  for (const { x, codigo } of orden) {
    const resultado = "estado" in x ? x : undefined
    const generado = anteriorPendiente !== undefined && resultado?.dependenciaAnual?.magnitud === "cuota_tras_resto_deducciones"
      ? undefined : generar(x, cuota, disponible)
    const aplicacion: Aplicacion = { codigo, estado: "pendiente_hechos" }
    if (resultado !== undefined) aplicacion.resultado = resultado
    if (generado === undefined) {
      if (resultado?.estado === "excluida") aplicacion.estado = "excluida"
      else anteriorPendiente = codigo
      aplicaciones.push(aplicacion)
      continue
    }
    if (BigInt(generado.numeradorEuros) < 0n) throw new RangeError("Deducción negativa: " + codigo)
    aplicacion.generado = generado
    if (anteriorPendiente !== undefined && BigInt(disponible.numeradorEuros) > 0n) {
      aplicacion.estado = "pendiente_cuota"
      aplicacion.siguienteCondicion = "Resolver importe y prelación de " + anteriorPendiente
      aplicaciones.push(aplicacion)
      continue
    }
    const aplicado = menor(disponible, generado), pendiente = restar(generado, aplicado)
    disponible = restar(disponible, aplicado)
    total = sumar(total, aplicado)
    aplicacion.estado = "aplicada"
    aplicacion.aplicado = aplicado
    aplicacion.pendiente = pendiente
    if (resultado?.dependenciaAnual !== undefined)
      aplicacion.resolucionAnual = { ejercicio: 2025, productor: resultado.dependenciaAnual.magnitud, operacion: resultado.dependenciaAnual.operacion }
    const recarga = resultado?.aplicacionAnualRecarga
    const incentivo = resultado?.aplicacionAnualSaldoMurcia ?? resultado?.aplicacionAnualSaldoMadrid
    if (recarga !== undefined) {
      aplicacion.origen = { ejercicio: 2025, objetoId: recarga.objetoId, contribuyente: recarga.contribuyente }
      aplicacion.arrastre = { primerEjercicio: 2026, ultimoEjercicio: 2028, saldo: pendiente }
    }
    if (incentivo !== undefined) {
      aplicacion.origen = { ejercicio: 2025, objetosIds: incentivo.objetosIds, contribuyente: incentivo.contribuyente }
      aplicacion.arrastre = { primerEjercicio: 2026, ultimoEjercicio: incentivo.ultimoEjercicio, saldo: pendiente }
    }
    aplicaciones.push(aplicacion)
  }
  return {
    total, disponible, aplicaciones,
    ordenAplicado: orden.map((x) => x.codigo),
    saldoEjercicio: { ejercicio: 2025 as const, cuotaInicial: cuota, aplicado: total, disponible },
    completoEnRamasSolicitadas: aplicaciones.every((x) => x.estado === "aplicada" || x.estado === "excluida"),
    seguimiento: aplicaciones.flatMap((x) => x.resultado?.aplicacionAnualRecarga === undefined ? [] : [{
      codigo: x.codigo, origen: { ejercicio: 2025 as const, objetoId: x.resultado.aplicacionAnualRecarga.objetoId, contribuyente: x.resultado.aplicacionAnualRecarga.contribuyente }, ...x.resultado.aplicacionAnualRecarga.seguimiento,
    }]),
  }
}
