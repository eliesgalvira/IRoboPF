import { validarVaciaExt2025 } from "./vacia-ext"
import { dia } from "./calendario"
import { validarPrimerAlquiler2025 } from "./primer-alquiler"
import { Effect, Result, Schema } from "effect"
import { CasoInmobiliarioP4a, RechazoP4a, type InmuebleP4a } from "./contrato"

/** Racionales de euros: no se cuantiza antes de componer las bases. */
export type ExactoP4a = { readonly n: bigint; readonly d: bigint }
const q = (n: bigint, d = 1n): ExactoP4a => ({ n, d })
const sumar = (a: ExactoP4a, b: ExactoP4a) => q(a.n * b.d + b.n * a.d, a.d * b.d)
const restar = (a: ExactoP4a, b: ExactoP4a) => q(a.n * b.d - b.n * a.d, a.d * b.d)
const por = (a: ExactoP4a, n: bigint, d = 1n) => q(a.n * n, a.d * d)
const menor = (a: ExactoP4a, b: ExactoP4a) => a.n * b.d <= b.n * a.d ? a : b
const dinero = (s: string) => { const [a = "0", b = ""] = s.split("."); return q(BigInt(a + b.padEnd(2, "0")), 100n) }
const total = (xs: readonly ExactoP4a[]) => xs.reduce(sumar, q(0n))
export interface ResultadoInmuebleP4a {
  readonly comprobacionVacia2024?: { readonly dias: number; readonly imputacion: ExactoP4a }
  readonly inmueble: InmuebleP4a
  readonly categoria: "capital_inmobiliario"
  readonly integro: ExactoP4a
  readonly gastosLimitados: ExactoP4a
  readonly excesoNoAplicado: ExactoP4a
  readonly otrosGastos: ExactoP4a
  readonly amortizacion: ExactoP4a
  readonly neto: ExactoP4a
  readonly reduccion: ExactoP4a
  readonly netoReducido: ExactoP4a
  readonly imputacion: ExactoP4a
  readonly diasAlquilados: number
  readonly diasImputados: number
  readonly seguimiento: readonly string[]
  readonly regimen: "DT38-60" | "art23-50"
}
interface HistoricoVaciaExtP4a {
  comprobacionVacia2024?: NonNullable<ResultadoInmuebleP4a["comprobacionVacia2024"]>
}
const producirInmueble = Effect.fn("P4a.inmueble")(function* (v: InmuebleP4a) {
  const fallo = (codigo: RechazoP4a["codigo"], motivo: string) => new RechazoP4a({ codigo, motivo: v.id + ": " + motivo })
  const c = v.contrato, a = v.adquisicion
  if (v.titulares.length !== 1 || v.titulares[0] !== v.titular || c.arrendador !== v.titular || c.arrendatario === v.titular)
    return yield* fallo("identidad", "título pleno exclusivo y contrato incompatibles")
  const comprobacionVacia2024 = v.vaciaExt2025 === undefined ? undefined : yield* Effect.try({
    try: () => validarVaciaExt2025(v),
    catch: e => fallo("historia", e instanceof RangeError ? e.message : "EXT: hechos incompletos"),
  })
  const primer = v.primerAlquiler2025
  const temporal = primer === undefined ? undefined : yield* Effect.try({
    try: () => validarPrimerAlquiler2025(v),
    catch: e => fallo("historia", e instanceof RangeError ? e.message : "Hechos P4b incompletos"),
  })
  if (primer === undefined) {
  if (![a.fecha, c.firma, c.desde, c.hasta].every(s => Number.isFinite(dia(s))) || a.fecha > "2025-01-01" || c.firma > c.desde || c.desde !== "2025-01-01" || c.hasta < "2025-12-31")
    return yield* fallo("contrato", "requiere adquisición anterior a2025 y contrato único vigente todo2025")
  let siguiente = dia(a.fecha)
  for (const u of v.usosDesdeAdquisicion) {
    if (dia(u.desde) !== siguiente || !Number.isFinite(dia(u.hasta)) || dia(u.hasta) < siguiente)
      return yield* fallo("dias", "cronología incompleta, desordenada o solapada")
    if ((u.uso === "personal" && u.hasta >= "2025-01-01") || (u.uso === "alquiler-vivienda" && (u.desde !== "2025-01-01" || u.hasta !== "2025-12-31")))
      return yield* fallo("historia", "uso mixto o amortización histórica requieren P4b")
    siguiente = dia(u.hasta) + 1
  }
  if (siguiente !== dia("2026-01-01") || !v.usosDesdeAdquisicion.some(u => u.uso === "alquiler-vivienda"))
    return yield* fallo("dias", "falta uso exhaustivo hasta devengo")
  }
  const diasAlquilados = temporal?.diasAlquilados ?? 365
  const diasImputados = temporal?.diasImputados ?? 0
  const imputacion = por(sumar(dinero(v.catastro2025.suelo), dinero(v.catastro2025.construccion)), BigInt(diasImputados) * BigInt(temporal?.tipoMilesimas ?? 0), 365000n)
  if (dinero(c.repercusionObras).n !== 0n)
    return yield* fallo("contrato", "repercusión de obras requiere conciliación adicional de ingresos")
  const fechas = [...v.exigibilidades.map(x => x.fecha), ...v.gastos.flatMap(x => [x.fechaOperacion, x.fechaFactura, x.fechaPago])]
  if (fechas.some(fecha => !Number.isFinite(dia(fecha)) || fecha < "2025-01-01" || fecha > "2025-12-31"))
    return yield* fallo("gasto", "P4a requiere exigibilidad, operación, factura y pago dentro de2025")
  const integro = total(v.exigibilidades.map(x => dinero(x.importe)))
  const limitables = total(v.gastos.filter(x => x.clase === "intereses" || x.clase === "reparacion").map(x => dinero(x.importe)))
  const gastosLimitados = menor(integro, limitables)
  const otrosGastos = total(v.gastos.filter(x => ["tributo", "comunidad", "seguro", "servicios", "defensa", "suministro"].includes(x.clase)).map(x => dinero(x.importe)))
  const coste = restar(sumar(dinero(a.precio), dinero(a.gastosTributos)), sumar(dinero(a.sueloPrecio), dinero(a.sueloGastosTributos)))
  if (coste.n <= 0n || dinero(a.sueloPrecio).n > dinero(a.precio).n || dinero(a.sueloGastosTributos).n > dinero(a.gastosTributos).n)
    return yield* fallo("gasto", "valor de suelo y coste de construcción incoherentes")
  // Historial sin alquiler previo: no existe amortización consumida antes2025.
  const mejoras = v.gastos.filter(x => x.clase === "mejora")
  for (const g of mejoras) {
    if (g.puestaEnServicio === undefined || !Number.isFinite(dia(g.puestaEnServicio)) || g.puestaEnServicio < "2025-01-01" || g.puestaEnServicio > "2025-12-31")
      return yield* fallo("gasto", "mejora sin puesta en servicio dentro de2025")
  }
  const eventos = mejoras.map(g => ({ dia: dia(g.puestaEnServicio ?? ""), coste: dinero(g.importe) })).sort((x, y) => x.dia - y.dia)
  let costeVigente = coste, inicio = dia(temporal === undefined ? "2025-01-01" : c.desde), amortizacion = q(0n)
  const tramo = (fin: number) => {
    const catastro = dinero(v.catastro2025.construccion)
    const base = costeVigente.n * catastro.d >= catastro.n * costeVigente.d ? costeVigente : catastro
    amortizacion = sumar(amortizacion, por(base, BigInt(fin - inicio) * 3n, 36500n))
    inicio = fin
  }
  for (const evento of eventos) {
    tramo(evento.dia)
    costeVigente = sumar(costeVigente, evento.coste)
  }
  tramo(dia("2026-01-01"))
  amortizacion = menor(costeVigente, amortizacion)
  const neto = restar(restar(restar(integro, gastosLimitados), otrosGastos), amortizacion)
  if (primer !== undefined && (neto.n < 0n || restar(limitables, gastosLimitados).n > 0n))
    return yield* fallo("gasto", "P4b: pérdidas o exceso de gastos con arrastre requieren productor posterior")
  if (comprobacionVacia2024 !== undefined && (neto.n <= 0n || restar(limitables, gastosLimitados).n > 0n))
    return yield* fallo("gasto", "EXT: requiere RNR positivo sin exceso pendiente")
  const regimen = c.firma < "2023-05-26" ? "DT38-60" : "art23-50"
  const reduccion = neto.n > 0n ? por(neto, regimen === "DT38-60" ? 60n : 50n, 100n) : q(0n)
  const historico: HistoricoVaciaExtP4a = {}
  if (comprobacionVacia2024 !== undefined) historico.comprobacionVacia2024 = comprobacionVacia2024
  return { ...historico, imputacion, diasAlquilados, diasImputados, seguimiento: temporal?.seguimiento ?? (comprobacionVacia2024 === undefined ? [] : ["EXT: duración y vivienda habitual futuras pendientes; conservar justificantes durante prescripción; regularización/reintegro no producidos"]), inmueble: v, categoria: "capital_inmobiliario", integro, gastosLimitados, excesoNoAplicado: restar(limitables, gastosLimitados), otrosGastos, amortizacion, neto, reduccion, netoReducido: restar(neto, reduccion), regimen } satisfies ResultadoInmuebleP4a
})

export const producirInmueblesP4a = Effect.fn("P4a.producir")(function* (entrada: CasoInmobiliarioP4a | Schema.Json) {
  const decoded = Schema.decodeUnknownResult(CasoInmobiliarioP4a)(entrada, { onExcessProperty: "error" })
  if (Result.isFailure(decoded)) return yield* new RechazoP4a({ codigo: "entrada", motivo: "Perfil P4a fuera del esquema cerrado: " + String(decoded.failure) })
  const caso = decoded.success
  const esExt = caso.comunidadAutonoma === "extremadura"
  if (esExt ? (caso.inmuebles.length !== 1 || caso.inmuebles[0]?.vaciaExt2025 === undefined || caso.inmuebles.some(v => v.primerAlquiler2025 !== undefined)) : caso.inmuebles.some(v => v.vaciaExt2025 !== undefined))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "EXT: una vivienda exclusiva con hechos vaciaExt2025; sin mezcla P4b ni otros territorios" })
  const esPrimerAlquiler = caso.inmuebles.some(v => v.primerAlquiler2025 !== undefined)
  if (esPrimerAlquiler && (caso.inmuebles.length !== 1 || caso.inmuebles[0]?.primerAlquiler2025 === undefined))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "P4b limitado a una vivienda y sin mezcla con P4a" })
  const codigoAdmitido = esExt ? "extremadura_arrendadores_viviendas_vacias" : caso.comunidadAutonoma === "canarias"
    ? (esPrimerAlquiler ? "canarias_puesta_viviendas_mercado_arrendamiento" : "canarias_adecuacion_inmueble_arrendamiento")
    : (esPrimerAlquiler ? "balears_arrendador_vivienda_permanente_otros_gastos" : "balears_mejora_sostenibilidad_vivienda")
  if (caso.deduccionesTerritoriales2025 !== undefined && caso.deduccionesTerritoriales2025.solicitudes.some(s => s.lote !== (esExt ? "D51" : "C36") || s.codigo !== codigoAdmitido))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "Perfil inmobiliario conecta exclusivamente su consumidor regional; combinaciones pendientes" })
  const ids = caso.inmuebles.map(v => v.id), catastros = caso.inmuebles.map(v => v.catastro)
  const documentos = caso.inmuebles.flatMap(v => v.exigibilidades.map(x => x.documento))
  const operaciones = [...caso.inmuebles.flatMap(v => [...v.exigibilidades.map(x => x.id), ...v.gastos.map(x => x.id)]), ...caso.retenciones.map(x => x.id)]
  if ([ids, catastros, documentos, operaciones, caso.inmuebles.map(v => v.contrato.id), caso.retenciones.map(x => x.documento)].some(xs => new Set(xs).size !== xs.length))
    return yield* new RechazoP4a({ codigo: "duplicado", motivo: "Identidad, catastro, contrato, operación o documento reutilizado" })
  // Una factura puede contener varias partidas, incluso para inmuebles distintos.
  // Su emisor y número identifican el documento; la línea identifica el gasto.
  const facturas = new Map<string, { fecha: string; total: string; lineas: Set<string>; registrado: ExactoP4a }>()
  for (const gasto of caso.inmuebles.flatMap(v => v.gastos)) {
    const clave = `${gasto.prestadorNif.length}:${gasto.prestadorNif}${gasto.factura}`
    const factura = facturas.get(clave) ?? { fecha: gasto.fechaFactura, total: gasto.totalFactura, lineas: new Set<string>(), registrado: q(0n) }
    if (factura.fecha !== gasto.fechaFactura || dinero(factura.total).n !== dinero(gasto.totalFactura).n || factura.lineas.has(gasto.lineaFactura))
      return yield* new RechazoP4a({ codigo: "duplicado", motivo: "Factura incoherente o partida ya incluida en el censo" })
    factura.lineas.add(gasto.lineaFactura)
    factura.registrado = sumar(factura.registrado, dinero(gasto.importe))
    const limite = dinero(factura.total)
    if (factura.registrado.n * limite.d > limite.n * factura.registrado.d)
      return yield* new RechazoP4a({ codigo: "gasto", motivo: "Las partidas del censo exceden el importe de su factura" })
    facturas.set(clave, factura)
  }
  if (caso.inmuebles.some(v => v.titular !== caso.contribuyenteId))
    return yield* new RechazoP4a({ codigo: "identidad", motivo: "Titular distinto del contribuyente" })
  if (caso.retenciones.some(x => !Number.isFinite(dia(x.fecha)) || x.fecha < "2025-01-01" || x.fecha > "2025-12-31"))
    return yield* new RechazoP4a({ codigo: "entrada", motivo: "Retención fuera del ejercicio" })
  if (caso.inmuebles.some(v => {
    const nacimiento = v.primerAlquiler2025?.historiaPersonal.nacimiento
    return nacimiento !== undefined && 2025 - Number(nacimiento.slice(0, 4)) !== caso.edad
  })) return yield* new RechazoP4a({ codigo: "identidad", motivo: "P4b: nacimiento histórico incompatible con edad al devengo" })
  const inmuebles = yield* Effect.forEach(caso.inmuebles, producirInmueble, { concurrency: 1 })
  return { caso, inmuebles, imputacion: total(inmuebles.map(x => x.imputacion)), neto: total(inmuebles.map(x => x.neto)), netoReducido: total(inmuebles.map(x => x.netoReducido)) }
})
