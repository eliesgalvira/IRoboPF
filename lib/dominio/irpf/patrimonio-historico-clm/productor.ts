import type { TrabajoActualCLM2025 } from "./actual"
import { Result, Schema } from "effect"
import { PatrimonioHistoricoCLM } from "./contrato"
import { ajustarPatrimonioP5a } from "../patrimonio-p5a/productor"
import { cero, euros, suma, mas, menos, compara, exige, ids, fecha, documento, serial } from "../deducciones/galicia-rioja-ampliacion-2025/comun"
import type { HistoriaBasesD51 } from "../deducciones/historia-bases-d51"

type Contexto = { readonly trabajoActual2025: TrabajoActualCLM2025; readonly titular: string; readonly vivienda: string; readonly fecha: string; readonly coste: string;
  readonly escritura: { readonly referencia: string; readonly emisor: string; readonly fecha: string };
  readonly certificados2024: readonly { readonly rendimiento: string; readonly titular: string;
    readonly documento: { readonly referencia: string; readonly emisor: string; readonly fecha: string };
    readonly integro: string; readonly seguridadSocial: string; readonly derechosPasivos: string; readonly colegiosHuerfanos: string }[] }
const clave = (d: Contexto["escritura"]) => JSON.stringify([d.emisor, d.referencia])
const mismo = (a: Contexto["escritura"], b: Contexto["escritura"]) => clave(a) === clave(b) && a.fecha === b.fecha
/** Productor propio 2024/2025; no transforma fechas para invocar P5a2025.
 * La compra crea el activo por precio total y la obligación con el vendedor;
 * los pagos reducen banco y deuda. Nunca incrementan por sí solos el patrimonio.
 */
export function producirPatrimonioHistoricoCLM(entrada: PatrimonioHistoricoCLM, historia: HistoriaBasesD51, c: Contexto) {
  const no = (b: boolean, m: string): void => { if (!b) throw new RangeError("Patrimonio histórico CLM: " + m) }
  const dec = Schema.decodeUnknownResult(PatrimonioHistoricoCLM)(entrada, { onExcessProperty: "error" })
  exige(Result.isSuccess(dec), "Patrimonio histórico CLM: contrato factual cerrado inválido")
  const h = dec.success, a = h.adquisicion, d = a.precioAplazado
  const igual = (x: ReturnType<typeof euros>, y: ReturnType<typeof euros>, m: string) => no(compara(x, y) === 0, m)
  const soporte = (doc: Contexto["escritura"], desde: string) => {
    documento(doc); no(doc.fecha >= desde && doc.fecha <= "2026-12-31", "soporte anterior al hecho o fuera de ventana")
  }
  no(h.titular === c.titular && a.titular === c.titular && a.vivienda === c.vivienda &&
    a.fecha === c.fecha && fecha(a.fecha) && a.fecha >= "2024-01-01" && a.fecha <= "2024-12-31", "identidad/adquisición2024")
  no(a.vendedor !== c.titular && d.acreedor === a.vendedor && d.id !== a.vivienda, "acreedor vendedor")
  no(mismo(a.escritura, c.escritura) && a.escritura.fecha === a.fecha && d.contrato.fecha === a.fecha, "título y obligación original")
  soporte(a.escritura, a.fecha); soporte(d.contrato, a.fecha)
  no(fecha(d.vencimiento) && d.vencimiento >= "2025-01-01" && d.vencimiento <= "2025-12-31", "plazo de precio aplazado")
  const precio = euros(a.precio), original = euros(d.importeOriginal)
  igual(precio, euros(c.coste), "coste/precio contradictorio; gastos accesorios fuera de perfil")
  no(compara(precio, cero) > 0 && compara(original, cero) > 0 && compara(original, precio) < 0, "precio/deuda original")
  no(historia.titular === c.titular && historia.objeto === c.vivienda &&
    historia.financiacion === "precio-aplazado-vendedor-sin-intereses", "HistoriaBases debe declarar deuda vendedor, no sin-financiacion")
  const actual = c.trabajoActual2025, salarios25 = h.cortes2025.salarios
  no(actual.ejercicio === 2025 && actual.titular === c.titular && actual.rendimientos.length > 0 &&
    actual.rendimientos.every(r => r.clase === "empleo-laboral" || r.clase === "empleo-estatutario"), "salarios2025: ámbito/clase anual no conciliado")
  igual(suma(salarios25.map(s => euros(s.integro))), suma(actual.rendimientos.map(r => euros(r.integro))), "salarios2025: bruto contradice entrada anual")
  igual(suma(salarios25.map(s => euros(s.retenciones))), euros(actual.retenciones), "salarios2025: retenciones contradicen entrada anual")
  if (actual.origen === "explicita") {
    no(actual.rendimientos.length === salarios25.length && ids(actual.rendimientos.map(r => r.id ?? "")), "salarios2025: rendimientos incompletos/duplicados")
    for (const r of actual.rendimientos) {
      const s = salarios25.find(s => s.rendimiento === r.id)
      no(s !== undefined && r.cotizaciones !== null, "salarios2025: rendimiento/cotizaciones efectivas ausentes")
      if (s !== undefined && r.cotizaciones !== null) {
        igual(euros(s.integro), euros(r.integro), "salarios2025: bruto nominal contradictorio")
        igual(euros(s.cotizaciones), euros(r.cotizaciones), "salarios2025: cotizaciones nominales contradictorias")
      }
    }
  }
  const anuales = [h.cortes2024, h.cortes2025] as const
  const nominas = anuales.flatMap(x => x.salarios)
  no(ids(nominas.map(x => x.id)) && ids(nominas.map(x => clave(x.documento))), "certificado salarial repetido entre ejercicios")
  const todos = anuales.flatMap(x => x.movimientos)
  no(ids(todos.map(x => x.id)) && ids(todos.map(x => clave(x.documento))), "movimiento/pago/documento duplicado")
  const pagos = todos.filter(x => x.clase === "precio")
  no(ids(d.pagos) && d.pagos.length === pagos.length && d.pagos.every(id => pagos.some(p => p.id === id)), "relación de pagos de precio incompleta")
  no(pagos.length === historia.operaciones.length, "pagos ajenos u omitidos en HistoriaBases")
  for (const p of pagos) {
    const op = historia.operaciones.find(x => x.id === p.id)
    no(op !== undefined && op.objeto === a.vivienda && op.titular === c.titular && op.clase === "adquisicion" &&
      op.fecha === p.fecha && mismo(op.documento, p.documento) && compara(euros(op.importe), euros(p.importe)) === 0 &&
      p.contraparte === a.vendedor && p.fecha >= a.fecha && p.fecha <= d.vencimiento, "pago no concilia con historia/vendedor/plazo")
  }
  const p24 = suma(pagos.filter(x => x.fecha < "2025-01-01").map(x => euros(x.importe)))
  const p25 = suma(pagos.filter(x => x.fecha >= "2025-01-01").map(x => euros(x.importe)))
  igual(p24, menos(precio, original), "entrada y precio aplazado original no concilian")
  igual(p25, original, "precio aplazado no saldado al vencimiento2025")
  no(pagos.filter(x => x.fecha < "2025-01-01").every(x => x.fecha === a.fecha), "precio2024 íntegro en compra; otros anticipos fuera de perfil")
  const resultados = anuales.map((e, i) => {
    const y = 2024 + i, inicio = `${y}-01-01`, fin = `${y}-12-31`
    no(e.ejercicio === y, "ejercicio del corte")
    soporte(e.documentoCenso, fin)
    const esperados = [...e.cuentas.map(x => x.id), a.vivienda, d.id]
    no(e.cuentas.length > 0 && ids(esperados) && ids(e.censo.map(x => x.id)) && e.censo.length === esperados.length, "inventario incompleto/duplicado")
    for (const x of e.censo) {
      soporte(x.documento, fin)
      no(esperados.includes(x.id) && x.titular === c.titular && x.tipo === (x.id === a.vivienda ? "vivienda" : x.id === d.id ? "precio-aplazado-vendedor" : "cuenta") &&
        x.inicio === (i === 0 && [a.vivienda, d.id].includes(x.id) ? "ausente" : "presente") &&
        x.cierre === (i === 1 && x.id === d.id ? "ausente" : "presente"), "clasificación/propiedad/cortes no soportados")
    }
    let anterior = inicio, orden = 0
    for (const m of e.movimientos) {
      no(fecha(m.fecha) && m.fecha >= inicio && m.fecha <= fin &&
        (m.fecha > anterior || m.fecha === anterior && m.orden > orden), "trayectoria no cronológica o orden duplicado")
      anterior = m.fecha; orden = m.orden
      soporte(m.documento, m.fecha)
      no(m.titular === c.titular && m.contraparte !== c.titular && e.cuentas.some(x => x.id === m.cuenta) && compara(euros(m.importe), cero) > 0, "movimiento nominal inválido")
      no(m.clase !== "donacion" && m.clase !== "herencia", "ISD: falta cronología del derecho; no restar ni calcular importe")
    }
    for (const cuenta of e.cuentas) {
      no(cuenta.titular === c.titular && cuenta.inicio.documento.fecha === inicio && cuenta.cierre.documento.fecha === fin, "titular/corte bancario")
      soporte(cuenta.inicio.documento, inicio); soporte(cuenta.cierre.documento, fin)
      let saldo = euros(cuenta.inicio.importe)
      for (const m of e.movimientos.filter(x => x.cuenta === cuenta.id)) {
        saldo = m.clase === "salario" ? mas(saldo, euros(m.importe)) : menos(saldo, euros(m.importe))
        no(compara(saldo, cero) >= 0, "descubierto requiere deuda adicional")
      }
      igual(saldo, euros(cuenta.cierre.importe), "saldo bancario no conciliado con todos los movimientos")
      if (i === 1) {
        const previo = h.cortes2024.cuentas.find(x => x.id === cuenta.id)
        no(previo !== undefined && previo.entidad === cuenta.entidad && previo.titular === cuenta.titular, "continuidad nominal bancaria")
        if (previo !== undefined) igual(euros(previo.cierre.importe), euros(cuenta.inicio.importe), "continuidad cierre2024=inicio2025 rota")
      }
    }
    if (i === 1) no(e.cuentas.length === h.cortes2024.cuentas.length, "apertura/cierre de cuentas fuera de perfil")
    no(ids(e.salarios.map(x => x.id)) && ids(e.salarios.map(x => clave(x.documento))) && ids(e.salarios.map(x => x.rendimiento)), "salarios nominales duplicados")
    const cobros = e.salarios.flatMap(x => x.cobros)
    const bancarios = e.movimientos.filter(x => x.clase === "salario")
    no(ids(cobros) && cobros.length === bancarios.length && bancarios.every(x => cobros.includes(x.id)), "censo de salarios/cobros incompleto")
    for (const s of e.salarios) {
      soporte(s.documento, fin)
      no(s.titular === c.titular && s.pagador !== c.titular && s.cobros.length > 0, "salario nominal")
      const ms = bancarios.filter(x => s.cobros.includes(x.id))
      no(ms.length === s.cobros.length && ms.every(x => x.contraparte === s.pagador), "cobro de otro pagador")
      const neto = menos(menos(euros(s.integro), euros(s.cotizaciones)), euros(s.retenciones))
      no(compara(neto, cero) > 0, "neto salarial no positivo")
      igual(suma(ms.map(x => euros(x.importe))), neto, "salario bruto/cotizaciones/retenciones no concilian con banco")
      if (i === 0) {
        const cert = c.certificados2024.find(x => x.rendimiento === s.rendimiento)
        no(cert !== undefined && cert.titular === s.titular && mismo(cert.documento, s.documento), "salario2024 sin certificado histórico coincidente")
        if (cert !== undefined) {
          igual(euros(s.integro), euros(cert.integro), "íntegro2024 contradictorio")
          igual(euros(s.cotizaciones), suma([cert.seguridadSocial, cert.derechosPasivos, cert.colegiosHuerfanos].map(x => euros(x))), "cotizaciones2024 contradictorias")
        }
      }
    }
    if (i === 0) no(e.salarios.length === c.certificados2024.length && c.certificados2024.every(x => e.salarios.some(s => s.rendimiento === x.rendimiento)), "certificado2024 sin trayectoria bancaria")
    soporte(e.valorVivienda.documento, fin)
    no(e.deudaVendedor.inicio.documento.fecha === inicio && e.deudaVendedor.cierre.documento.fecha === fin, "fechas de deuda")
    soporte(e.deudaVendedor.inicio.documento, inicio); soporte(e.deudaVendedor.cierre.documento, fin)
    const deudaInicio = i === 0 ? cero : original, deudaFin = i === 0 ? original : cero
    igual(euros(e.deudaVendedor.inicio.importe), deudaInicio, "deuda inicial no conciliada")
    igual(euros(e.deudaVendedor.cierre.importe), deudaFin, "deuda final no conciliada")
    const ajuste = ajustarPatrimonioP5a(suma(e.cuentas.map(x => euros(x.inicio.importe))), suma(e.cuentas.map(x => euros(x.cierre.importe))),
      i === 0 ? cero : precio, euros(e.valorVivienda.importe), precio, deudaInicio, deudaFin, cero)
    const incremento = menos(ajuste.final, ajuste.inicial), inversion = i === 0 ? p24 : p25
    // Se devuelve el cero factual; la selección positiva exige suficiencia fuera de este productor.
    return { ejercicio: y, ...ajuste, incremento, inversion, traza: { inicial: serial(ajuste.inicial), final: serial(ajuste.final),
      variacionExcluida: serial(ajuste.variacion), deudaInicio: serial(deudaInicio), deudaFin: serial(deudaFin), incremento: serial(incremento), inversion: serial(inversion) } }
  })
  return { cortes2024: resultados[0]!, cortes2025: resultados[1]! }
}
