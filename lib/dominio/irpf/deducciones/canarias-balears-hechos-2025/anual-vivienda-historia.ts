import { Schema } from "effect"
import { PatrimonioP5a } from "../../patrimonio-p5a/contrato"
import { ajustarPatrimonioP5a, conciliarCuentasP5a } from "../../patrimonio-p5a/productor"
import { cero, compara, euros, menos, suma, min, max, documento, fecha as fechaValida } from "../galicia-rioja-ampliacion-2025/comun"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { ViviendaC36 } from "./anual-esquemas"
import type { HistoricoViviendasC } from "./vivienda-ampliacion"
import { comprobar, eurosC, ceroC } from "./ampliacion-comun"
import { magnitudesC36, sujetoC36, conciliarPagoC36 } from "./anual-productores"
import { unico, fecha } from "./comun"

const Documento = PatrimonioP5a.fields.adquisicion.fields.escritura
export const HistoriaAdquisicionCanarias2025 = Schema.Struct({
  patrimonio: PatrimonioP5a,
  financiacionOriginal: Schema.optional(Schema.Struct({
    trayectoria: Schema.Literal("original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales"),
    modalidad: Schema.Literal("ordinario_sin_coberturas_ni_seguros_vinculados"),
    documento: Documento,
    gastos: Schema.Array(Schema.Struct({
      movimiento: Schema.String,
      naturaleza: Schema.Literal("comision_apertura"),
      documento: Documento,
    })),
  })),
  ubicacion: Schema.Literals(["canarias", "illes-balears", "otra"]),
  catastro: Schema.String,
  localizacion: Documento,
  residencia: Schema.Struct({desde: Schema.String, hasta: Schema.String, documento: Documento}),
  ayudas: Schema.Struct({
    documento: Documento,
    censo: Schema.Literal("todas_concesiones_y_cobros_desde_adquisicion"),
    expedientes: Schema.Array(Documento),
  }),
})

/** Primera adquisición en2025, al contado o con préstamo original exclusivo, sin ayudas.
 * El censo vital acredita los tres ceros; no lo hace la ausencia de solicitud.
 * La fórmula y los límites de cuota siguen exclusivamente en C36/composición.
 */
export function producirHistoriaAdquisicionCanarias2025(
  s: typeof ViviendaC36.Type,
  m: MagnitudesTerritorialesAnuales,
) {
  const h = s.hechos.historiaAdquisicion
  comprobar(h !== undefined, "C36 art14: falta productor histórico de pagos anteriores; aportar historia de adquisición identificada")
  const p = h.patrimonio, a = p.adquisicion, vida = p.historia, id = sujetoC36(m)
  const no = (condicion: boolean, motivo: string) => comprobar(condicion, "C36 art14 historia compleja/no representada: " + motivo)
  const igual = (a: string, b: string) => compara(euros(a), euros(b)) === 0
  const v = s.hechos.viviendas[0]
  no(s.codigo === "canarias_inversion_vivienda_habitual" && s.hechos.viviendas.length === 1 && v !== undefined, "una adquisición y un titular")
  comprobar(v !== undefined, "C36 art14: vivienda ausente")
  no(p.ejercicio === 2025 && p.persona === id && p.exhaustividad === "todos_activos_deudas_derechos_y_movimientos", "identidad o censo patrimonial")
  fecha(a.fecha)
  no(a.fecha >= "2025-01-01" && a.fecha <= "2025-12-31" && a.fecha >= s.hechos.nacimientoContribuyente && a.fecha === v.adquisicion, "adquisición fuera del perfil2025; no trasladar el acceso DT18 estatal")
  const l = p.prestamo, f = h.financiacionOriginal
  no(new Set(p.movimientos.map(x => x.id)).size === p.movimientos.length, "movimiento duplicado")
  const total = (clase: typeof p.movimientos[number]["clase"]) => suma(p.movimientos.filter(x => x.clase === clase).map(x => euros(x.importe)))
  const dispuesto = total("disposicion"), amortizado = total("amortizacion")
  const principal = menos(dispuesto, amortizado)
  if (l === null) {
    no(f === undefined && !p.movimientos.some(x => ["disposicion", "amortizacion", "intereses", "gastos_financiacion"].includes(x.clase)), "movimientos de financiación sin préstamo original")
  } else {
    no(f !== undefined, "falta trayectoria del préstamo original y clasificación de gastos")
    comprobar(f !== undefined, "C36 art14: financiación ausente")
    documento(f.documento); documento(l.contrato); documento(l.principalCierre.documento)
    no(f.trayectoria === "original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales" && f.modalidad === "ordinario_sin_coberturas_ni_seguros_vinculados" && f.documento.fecha >= "2025-12-31" && l.fecha === a.fecha && l.contrato.fecha === a.fecha && l.inmueble === a.inmueble && l.acreedor.trim() !== "" && l.acreedor !== id && l.acreedor !== a.vendedor && l.principalCierre.documento.fecha >= "2025-12-31", "contrato original/acreedor/destino/cierre contradictorio")
    no(p.movimientos.filter(x => x.clase === "disposicion").length === 1 && p.movimientos.filter(x => x.clase === "precio").length === 1 && p.movimientos.filter(x => x.clase === "disposicion" || x.clase === "precio").every(x => x.fecha === a.fecha), "disposición original y pago único íntegro del precio en escritura; otra trayectoria no representada")
    no(compara(dispuesto, cero) > 0 && compara(dispuesto, euros(a.precio)) <= 0 && compara(principal, cero) >= 0 && compara(principal, euros(l.principalCierre.importe)) === 0, "disposición/amortización/principal de cierre no conciliados")
    const gastos = p.movimientos.filter(x => x.clase === "gastos_financiacion")
    unico(f.gastos.map(x => x.movimiento)); unico(f.gastos.map(x => x.documento.referencia))
    no(f.gastos.length === gastos.length, "gastos de financiación sin clasificación documental de comisión de apertura")
    for (const g of f.gastos) {
      documento(g.documento)
      no(g.naturaleza === "comision_apertura" && gastos.some(x => x.id === g.movimiento && x.fecha === a.fecha && x.documento.referencia === g.documento.referencia && g.documento.fecha >= x.fecha), "gasto ajeno a comisión de apertura del préstamo original")
    }
  }
  no(a.inmueble === v.id && h.catastro === v.catastro && h.catastro.trim() !== "", "identidad inmueble/catastro")
  documento(h.localizacion)
  no(h.ubicacion === "canarias" && h.localizacion.fecha >= a.fecha, "ubicación real, separada de residencia fiscal")
  documento(a.escritura); documento(a.valorCierre.documento)
  no(a.escritura.fecha === a.fecha && a.valorCierre.documento.fecha >= "2025-12-31" && a.vendedor.trim() !== "" && a.vendedor !== id && euros(a.precio).n > 0n, "escritura/precio/vendedor/cierre")
  no(v.derecho === "propiedad" && v.uso === "habitual_propia" && v.propietarios?.length === 1 && v.propietarios[0]?.persona === id && v.propietarios[0]?.porcentaje === "100" && v.propietarios[0]?.titulo === a.escritura.referencia, "plena titularidad exclusiva documentada")
  fecha(h.residencia.desde); fecha(h.residencia.hasta); documento(h.residencia.documento)
  no(h.residencia.desde === v.ocupacion && v.habitualDesde === v.ocupacion && h.residencia.hasta === "2025-12-31" && h.residencia.documento.fecha >= h.residencia.hasta && v.historiaContratos.length === 0, "ocupación efectiva continuada al devengo; permanencia futura sujeta a regularización")
  documento(h.ayudas.documento)
  no(h.ayudas.documento.fecha >= "2025-12-31" && h.ayudas.expedientes.length === 0, "ayudas con concesión/cobro requieren clasificación exenta e integración conciliada")
  documento(vida.documento)
  no(vida.desde === s.hechos.nacimientoContribuyente && fechaValida(vida.desde) && vida.hasta === "2025-12-31" && vida.documento.fecha >= vida.hasta, "censo vital incompleto")
  no(vida.derechos.length === 1 && vida.derechos[0]?.inmueble === a.inmueble && vida.derechos[0]?.titular === id && vida.derechos[0]?.adquisicion === a.fecha && vida.derechos[0]?.transmision === null && vida.derechos[0]?.titulo.referencia === a.escritura.referencia && vida.anticipos.length === 0, "derechos anteriores/transmisiones/anticipos requieren historia propia")
  for (const d of vida.derechos) documento(d.titulo)
  const anio = Number(vida.desde.slice(0, 4))
  unico(vida.ejercicios.map(e => String(e.anio)))
  no(vida.ejercicios.length === 2025 - anio, "censo fiscal vital incompleto")
  for (const e of vida.ejercicios) {
    documento(e.documento)
    no(Number.isInteger(e.anio) && e.anio >= anio && e.anio < 2025 && e.documento.fecha >= `${e.anio}-12-31` && e.eventos.length === 0, "inversiones deducidas/reinversiones previas no representadas")
  }
  unico(p.censo.map(c => c.id)); unico(p.cuentas.map(c => c.id))
  const esperados = [...p.cuentas.map(c => c.id), a.inmueble, ...(l === null ? [] : [l.id])]
  unico(esperados)
  no(p.cuentas.length > 0 && p.censo.length === esperados.length, "activos/deudas adicionales requieren patrimonio conjunto")
  for (const c of p.censo) {
    documento(c.documento)
    no(esperados.includes(c.id) && c.titular === id && c.participacion[0] === 1 && c.participacion[1] === 1 && c.documento.fecha >= "2025-12-31" && c.cierre === "presente" && c.inicio === (p.cuentas.some(x => x.id === c.id) ? "presente" : "ausente") && c.tipo === (c.id === a.inmueble ? "vivienda" : c.id === l?.id ? "prestamo" : "cuenta_euros"), "censo patrimonial contradictorio")
  }
  try {
    conciliarCuentasP5a(p.cuentas, p.movimientos)
  } catch (error) {
    // Conserva la causa patrimonial de dominio en el rechazo público C36.
    if (error instanceof Error && error.message.startsWith("P5a cuentas: "))
      throw new RangeError(error.message)
    throw error
  }
  const precio = p.movimientos.filter(x => x.clase === "precio")
  const pagos = p.movimientos.filter(x => ["precio", "amortizacion", "intereses", "gastos_financiacion"].includes(x.clase))
  no(pagos.length === v.gastos.length && precio.length > 0, "censo de pagos no conciliado")
  unico(v.gastos.map(x => x.id)); unico(v.gastos.map(x => x.factura))
  for (const pago of v.gastos) {
    conciliarPagoC36(m, pago)
    const banco = pagos.find(x => x.id === pago.id)
    no(banco !== undefined && banco.fecha >= a.fecha && pago.fecha === banco.fecha && pago.factura === banco.documento.referencia && igual(pago.importe, banco.importe) && pago.perceptor === (banco.clase === "precio" ? a.vendedor : l?.acreedor) && pago.concepto === "adquisicion" && pago.medio !== "efectivo" && pago.ayudasExentas === "0" && pago.reembolsos === "0" && pago.naturaleza === "propio" && pago.distribucion.length === 1 && pago.distribucion[0]?.persona === id && pago.distribucion[0]?.porcentaje === "100", "pago no vinculado íntegramente al precio, banco y titular")
  }
  no(compara(suma(precio.map(x => euros(x.importe))), euros(a.precio)) === 0, "precio no satisfecho íntegramente; pagos históricos no representados")
  const isd = suma(p.movimientos.filter(x => x.clase === "donacion" || x.clase === "herencia").map(x => euros(x.importe)))
  const patrimonio = ajustarPatrimonioP5a(suma(p.cuentas.map(x => euros(x.inicio.importe))), suma(p.cuentas.map(x => euros(x.cierre.importe))), cero, euros(a.valorCierre.importe), euros(a.precio), cero, principal, isd)
  // Art70: sólo el capital queda limitado por el incremento neto. Los
  // intereses y gastos de financiación se añaden después (AEAT2025).
  let capitalRestante = max(cero, menos(patrimonio.final, patrimonio.inicial))
  // Se conserva cada pago bruto como hecho. Sólo el puerto interno al evaluador
  // resta el capital financiado del precio, una vez; no es una base del cliente.
  const gastosElegibles = v.gastos.map(pago => {
    const banco = pagos.find(x => x.id === pago.id)
    if (banco?.clase !== "precio" && banco?.clase !== "amortizacion") return pago
    const propio = banco.clase === "precio" ? menos(euros(pago.importe), dispuesto) : euros(pago.importe)
    const computable = min(propio, capitalRestante)
    capitalRestante = menos(capitalRestante, computable)
    comprobar(computable.d === 1n && computable.n >= 0n, "C36 art14: capital computable fuera de céntimos")
    return {...pago, importe: `${computable.n / 100n}.${String(computable.n % 100n).padStart(2, "0")}`}
  })
  const pagadoAntes = vida.anticipos.reduce((q, x) => q.sumar(eurosC(x.importe)), ceroC())
  no(pagadoAntes.n === 0n, "anticipos históricos")
  return {ubicacion: "canarias", gastosElegibles, historico: {
    calculoId: magnitudesC36(m).calculoId, ejercicio: 2025,
    viviendas: [{catastro: v.catastro, persona: id, pagadoHasta2024: "0", inversionesAnterioresDeducidas: "0", gananciaExentaReinvertida: "0", saldoDudosoCobroDeducible2025: "0", deduccionesInversionConDerecho: [s.codigo]}],
  }} satisfies {ubicacion: "canarias"; gastosElegibles: typeof v.gastos; historico: HistoricoViviendasC}
}
