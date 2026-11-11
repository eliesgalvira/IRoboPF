import {
  racional, sumar, restar, menor, type Racional,
} from "../anual-territorial-racional"
import type { ResultadoF } from "./comun"

type Importe = Racional | ResultadoF
type Aplicacion = {
  codigo: string
  estado: "aplicada" | "excluida" | "pendiente_hechos" | "pendiente_cuota"
  consumoCompartidoDT18?: ResultadoF["consumoCompartidoDT18"]
  generado?: Racional
  aplicado?: Racional
  pendiente?: Racional
  resultado?: ResultadoF
  resolucionAnual?: { ejercicio: 2025; productor: string; operacion: string }
  saldoHistoricoRenovablesMurcia?: { origen: NonNullable<ResultadoF["origenRenovablesMurcia2024"]>; aplicado2025: Racional; pendiente2025: Racional }
  origen?: { ejercicio: 2024 | 2025; objetoId?: string; objetosIds?: readonly string[]; contribuyente: string }
  arrastre?: { primerEjercicio: 2025 | 2026; ultimoEjercicio: 2026 | 2027 | 2028 | 2030; saldo: Racional }
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
  // Art14: disponible ya descuenta la parte autonómica aplicada del libro general
  // y el resto regional (prioridad1). Nuevos contribuyentes extranjeros va después.
  if (d?.magnitud === "cuota_tras_resto_deducciones" && x.codigo === "madrid_familias_dos_descendientes_ingresos_reducidos")
    return multiplicar(disponible, racional(d.factor))
  if (x.estado === "calculo_parcial" && x.importeAntesPresentacionEUR !== undefined)
    return racional(x.importeAntesPresentacionEUR)
  return undefined
}
/** Una cuota y un libro. Ningún rechazo se convierte en importe generado cero. */
export function consumirCuotaAnualF2025(cuota: Racional, codigos: readonly string[], importes: readonly Importe[], cuotaIntegra = cuota) {
  if (codigos.length !== importes.length) throw new RangeError("Libro territorial incompleto")
  if (BigInt(cuota.numeradorEuros) < 0n) throw new RangeError("Cuota anual negativa")
  let disponible = cuota, total = racional("0")
  let anteriorPendiente: string | undefined
  const aplicaciones: Aplicacion[] = []
  const orden = importes.map((x, i) => ({ x, codigo: codigos[i]! }))
    .sort((a, b) => prioridad(a.codigo) - prioridad(b.codigo) || a.codigo.localeCompare(b.codigo))
  for (const { x, codigo } of orden) {
    const resultado = "estado" in x ? x : undefined
    if(resultado?.consumoCompartidoDT18!==undefined){
      if(codigo!=="murcia_regimen_transitorio_inversion_vivienda_habitual")throw new RangeError("Consumo DT18 ajeno")
      aplicaciones.push({codigo,estado:"aplicada",resultado,consumoCompartidoDT18:resultado.consumoCompartidoDT18})
      continue // El total y la cuota residual ya excluyen este consumo en composición-anual.
    }
    const historico = resultado?.origenRenovablesMurcia2024
    if (historico !== undefined) {
      if (codigo !== "murcia_instalaciones_recursos_energeticos_renovables" || resultado?.estado !== "calculo_parcial" ||
          historico.ejercicio !== 2024 || historico.ultimoEjercicio !== 2026)
        throw new RangeError("Libro de origen renovable ajeno o caducidad contradictoria")
      const a: Aplicacion = { codigo, estado: "pendiente_cuota", resultado,
        origen: { ejercicio: 2024, objetoId: historico.instalacionId, contribuyente: historico.contribuyente } }
      if (anteriorPendiente !== undefined && BigInt(disponible.numeradorEuros) > 0n) {
        a.siguienteCondicion = "Resolver importe y prelación de " + anteriorPendiente
        aplicaciones.push(a)
        continue
      }
      const aplicado = menor(disponible, historico.saldoPorInsuficiencia2024)
      const pendiente = restar(historico.saldoPorInsuficiencia2024, aplicado)
      disponible = restar(disponible, aplicado)
      total = sumar(total, aplicado)
      a.estado = "aplicada"
      a.aplicado = aplicado
      a.pendiente = pendiente
      // Separado del campo generado2025: no rejuvenece el saldo ni lo vuelve a generar.
      a.saldoHistoricoRenovablesMurcia = { origen: historico, aplicado2025: aplicado, pendiente2025: pendiente }
      if (BigInt(pendiente.numeradorEuros) > 0n)
        a.arrastre = { primerEjercicio: 2025, ultimoEjercicio: 2026, saldo: pendiente }
      aplicaciones.push(a)
      continue
    }
    const generado = anteriorPendiente !== undefined && resultado?.dependenciaAnual?.magnitud === "cuota_tras_resto_deducciones"
      ? undefined : generar(x, cuotaIntegra, disponible)
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
