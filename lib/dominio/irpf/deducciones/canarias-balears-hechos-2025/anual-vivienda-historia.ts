import { Schema } from "effect"
import { PatrimonioP5a } from "../../patrimonio-p5a/contrato"
import { ajustarPatrimonioP5a, conciliarCuentasP5a } from "../../patrimonio-p5a/productor"
import { cero, compara, euros, menos, suma, documento, fecha as fechaValida } from "../galicia-rioja-ampliacion-2025/comun"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { ViviendaC36 } from "./anual-esquemas"
import type { HistoricoViviendasC } from "./vivienda-ampliacion"
import { comprobar, eurosC, ceroC } from "./ampliacion-comun"
import { magnitudesC36, sujetoC36, conciliarPagoC36 } from "./anual-productores"
import { unico, fecha } from "./comun"

const Documento = PatrimonioP5a.fields.adquisicion.fields.escritura
export const HistoriaAdquisicionCanarias2025 = Schema.Struct({
  patrimonio: PatrimonioP5a,
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

/** Primera adquisición pagada íntegramente en2025 sin préstamo ni ayudas.
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
  no(p.prestamo === null && !p.movimientos.some(x => ["disposicion", "amortizacion", "intereses", "gastos_financiacion"].includes(x.clase)), "financiación requiere trayectoria y atribución de capital/intereses/gastos")
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
  const esperados = [...p.cuentas.map(c => c.id), a.inmueble]
  unico(esperados)
  no(p.cuentas.length > 0 && p.censo.length === esperados.length, "activos/deudas adicionales requieren patrimonio conjunto")
  for (const c of p.censo) {
    documento(c.documento)
    no(esperados.includes(c.id) && c.titular === id && c.participacion[0] === 1 && c.participacion[1] === 1 && c.documento.fecha >= "2025-12-31" && c.cierre === "presente" && c.inicio === (c.id === a.inmueble ? "ausente" : "presente") && c.tipo === (c.id === a.inmueble ? "vivienda" : "cuenta_euros"), "censo patrimonial contradictorio")
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
  no(precio.length === v.gastos.length && precio.length > 0, "censo de pagos no conciliado")
  unico(v.gastos.map(x => x.id)); unico(v.gastos.map(x => x.factura))
  for (const pago of v.gastos) {
    conciliarPagoC36(m, pago)
    const banco = precio.find(x => x.id === pago.id)
    no(banco !== undefined && banco.fecha >= a.fecha && pago.fecha === banco.fecha && pago.factura === banco.documento.referencia && igual(pago.importe, banco.importe) && pago.perceptor === a.vendedor && pago.concepto === "adquisicion" && pago.medio !== "efectivo" && pago.ayudasExentas === "0" && pago.reembolsos === "0" && pago.naturaleza === "propio" && pago.distribucion.length === 1 && pago.distribucion[0]?.persona === id && pago.distribucion[0]?.porcentaje === "100", "pago no vinculado íntegramente al precio, banco y titular")
  }
  no(compara(suma(precio.map(x => euros(x.importe))), euros(a.precio)) === 0, "precio no satisfecho íntegramente; pagos históricos no representados")
  const isd = suma(p.movimientos.filter(x => x.clase === "donacion" || x.clase === "herencia").map(x => euros(x.importe)))
  const patrimonio = ajustarPatrimonioP5a(suma(p.cuentas.map(x => euros(x.inicio.importe))), suma(p.cuentas.map(x => euros(x.cierre.importe))), cero, euros(a.valorCierre.importe), euros(a.precio), cero, cero, isd)
  // Art70: comparación íntegra, sin prorratear por un incremento insuficiente.
  const cumplePatrimonio = compara(menos(patrimonio.final, patrimonio.inicial), euros(a.precio)) >= 0
  const pagadoAntes = vida.anticipos.reduce((q, x) => q.sumar(eurosC(x.importe)), ceroC())
  no(pagadoAntes.n === 0n, "anticipos históricos")
  return {ubicacion: "canarias", cumplePatrimonio, historico: {
    calculoId: magnitudesC36(m).calculoId, ejercicio: 2025,
    viviendas: [{catastro: v.catastro, persona: id, pagadoHasta2024: "0", inversionesAnterioresDeducidas: "0", gananciaExentaReinvertida: "0", saldoDudosoCobroDeducible2025: "0", deduccionesInversionConDerecho: [s.codigo]}],
  }} satisfies {ubicacion: "canarias"; cumplePatrimonio: boolean; historico: HistoricoViviendasC}
}
