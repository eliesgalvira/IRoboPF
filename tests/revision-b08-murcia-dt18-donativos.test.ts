import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import { fixture as viviendaHistorica } from "./dt18-rioja-fixture"
import { censo, operacion } from "./p5-fixtures"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import oraculos from "./revision-b08-oraculos.json"

type Oraculo = (typeof oraculos)[number]
const cero = { numeradorEuros: "0", divisor: "1" }
// Comparte sólo hechos históricos ya presentes en raíz, nunca fixture/runner/oráculo del autor B08.
function hechos(o: Oraculo) {
  const h = structuredClone(viviendaHistorica(["adquisicion"]).viviendaDT182025)
  const p = h.proyectos[0]!
  Object.assign(p.vivienda, { municipio: "Murcia", municipioHabitual: "Murcia", inmueble: { ...p.vivienda.inmueble, territorio: "murcia" } })
  Object.assign(p.vivienda.pagos.find(x => x.concepto === "amortizacion")!, { importe: o.capital })
  Object.assign(p.prestamo!.principalFinal, { importe: new Decimal("9000").minus(o.capital).toFixed() })
  Object.assign(h.movimientos.find(x => x.id === "adquisicion-A")!, { importe: o.capital })
  Object.assign(h.movimientos.find(x => x.id === "ING")!, { importe: o.neto })
  Object.assign(h.movimientos.find(x => x.id === "CON")!, { importe: o.consumo })
  const op = operacion(o.donativo, "revision-b08")
  Object.assign(op.pago, { pagador: "A" })
  Object.assign(op.certificado, { donante: "A" })
  Object.assign(op, { eleccion: o.eleccion })
  Object.assign(h, { movimientos: [...h.movimientos, {
    id: op.pago.id, cuenta: "CTA", fecha: op.pago.fecha, importe: op.pago.euros,
    sentido: "salida", clase: "consumo",
    documento: { referencia: op.pago.documento, fecha: op.pago.fecha, emisor: "Entidad" },
  }].sort((a,b) => a.fecha.localeCompare(b.fecha)) })
  return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({
    viviendaDT182025: h,
    solicitudes: [{ lote: "F-ampliado", codigo: "murcia_regimen_transitorio_inversion_vivienda_habitual", hechos: { ramaTransitoria: "estatal_pre2013" } }],
    donativosEstatales2025: { ...censo([op]), contribuyente: "A" },
    prioridadCuotasDT18Donativos2025: "dt18_antes_donativos",
  }, { onExcessProperty: "error" })
}
type Hechos = ReturnType<typeof hechos>
// No normalizar ni reparar libros dentro de la llamada: las mutaciones adversas deben llegar intactas.
function ejecutar(api: "canonico" | "explicito", s: Hechos, o: Oraculo) {
  if (api === "canonico") return Effect.map(liquidarIrpfAnual({
    anio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "A",
    situacionFamiliar: { tipo: "individual", edad: 35, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
    rendimientos: { trabajo: [{ importeIntegroCentimos: Number(o.bruto) * 100 }] },
    reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0,
    deduccionesTerritoriales2025: s,
  }, { modo: "canonico" }), r => ({ libro: r.deduccionesTerritoriales2025!, final: new Decimal(r.cuotaLiquidaCentimos).div(100).toFixed(2) }))
  return Effect.map(liquidarIrpfAnualExplicito({
    ejercicio: 2025, comunidadAutonoma: "murcia", contribuyenteId: "A", edad: 35,
    modalidad: "individual", residenciaTodoElAnio: true, devengo: "2025-12-31",
    otrasRentas: "ninguna", familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna",
    reduccionesBase: "ninguna", saldosAnteriores: "ninguno", deducciones: "territoriales-por-hechos-y-da61",
    deduccionesTerritoriales2025: s, rentasExtranjeras: "ninguna", especialidades: "ninguna", perfil: "solo-trabajo",
    conciliacion: { ejercicio: 2025, estado: "totales-anuales-sin-duplicados", procedencia: ["certificado"] }, retenciones: [],
    trabajo: { ejercicio: 2025, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna", rendimientos: [{
      id: "R", clase: "empleo-laboral", integro: o.bruto,
      cotizaciones: { clase: "efectivas", seguridadSocial: o.ss, derechosPasivos: "0", colegiosHuerfanos: "0" },
      sindicato: { importe: "0", satisfecho: "no" },
      colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" },
      defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" },
    }] },
  }), r => ({ libro: r.deduccionesTerritoriales2025!, final: new Decimal(r.cuotaLiquidaLegal).toFixed(2) }))
}
for (const api of ["canonico", "explicito"] as const) {
  for (const o of oraculos) it(`${api}: revisión propia ${o.caso}`, () => {
    const s = hechos(o), anterior = structuredClone(s)
    const { libro: r, final } = Effect.runSync(ejecutar(api, s, o))
    expect(s).toEqual(anterior)
    if (!("donativosEstatales2025" in r) || r.donativosEstatales2025 === undefined) throw new Error("Libro donativos ausente")
    const d = r.donativosEstatales2025
    expect(r.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual({ numeradorCentimos: String(Number(o.baseVivienda)*100), denominador: "1" })
    expect(r.viviendaDT182025?.cumpleCondicionPatrimonial).toBe(true)
    expect(d.baseLiquidable).toEqual(o.base)
    expect(d.base68_3).toEqual(o.baseDonativo)
    expect(d.generado).toEqual(o.generado)
    for (const parte of ["estatal", "autonomica"] as const) {
      expect(r.viviendaDT182025?.cuotas?.[parte].total).toEqual(o[parte].dt18)
      expect(r.viviendaDT182025?.cuotas?.[parte].disponible).toEqual(o[parte].residual)
      expect(d[parte].integra).toEqual(o[parte].residual)
      expect(d[parte].aplicada).toEqual(o[parte].donativo)
      expect(d[parte].disponible).toEqual(o[parte].final)
    }
    expect(r.evaluacionesF[0]?.consumoCompartidoDT18?.aplicado).toEqual(o.autonomica.dt18)
    expect(r.total).toEqual(cero) // F compartido aporta cero al segundo consumo.
    expect(r.prioridadCuotasDT18Donativos2025).toBe("dt18_antes_donativos")
    expect(final).toBe(o.cuotaFinal) // Control independiente del único consumo, incluido redondeo final.
  })
  for (const caso of ["suficiente", "escasa", "cero"]) it(`${api}: selección exigida incluso ${caso}`, () => {
    const o = oraculos.find(x => x.caso === caso)!, s = hechos(o)
    Object.assign(s, { prioridadCuotasDT18Donativos2025: undefined })
    expect(Effect.runSync(Effect.flip(ejecutar(api, s, o)))._tag).toBe("ResultadoNoSoportado")
  })
  const adversas = [
    "sin_dt18", "sin_donativos", "orden_inverso", "orden_array", "cuota_externa",
    "rama_distinta", "solicitud_duplicada", "pago_duplicado", "persona", "sin_movimiento",
    "id_distinto", "documento_distinto", "fecha_distinta", "importe_distinto", "entrada_consumo",
    "movimiento_duplicado", "documento_duplicado", "pago_inversion", "documento_inversion",
    "pago_original", "documento_original", "historia", "regional", "patrimonio_parcial",
    "herencia", "donacion_recibida", "no_aplicar_sin_movimiento",
  ] as const
  for (const fallo of adversas) it(`${api}: adversa nominal ${fallo}`, () => {
    const o = oraculos[0]!, s = hechos(o), h = s.viviendaDT182025!, d = s.donativosEstatales2025!
    const op = d.operaciones68_3[0]!, p = op.pago, m = h.movimientos.find(x => x.id === p.id)!
    if (fallo === "sin_dt18") Object.assign(s, { viviendaDT182025: undefined })
    if (fallo === "sin_donativos") Object.assign(s, { donativosEstatales2025: undefined })
    if (fallo === "orden_inverso") Object.assign(s, { prioridadCuotasDT18Donativos2025: "donativos_antes_dt18" })
    if (fallo === "orden_array") Object.assign(s, { prioridadCuotasDT18Donativos2025: ["dt18_antes_donativos", "dt18_antes_donativos"] })
    if (fallo === "cuota_externa") Object.assign(s, { cuotaEstatal: "999999" })
    if (fallo === "rama_distinta") Object.assign(s.solicitudes[0]!, { hechos: { ramaTransitoria: "Uno_vigente" } })
    if (fallo === "solicitud_duplicada") Object.assign(s, { solicitudes: [...s.solicitudes, ...s.solicitudes] })
    if (fallo === "pago_duplicado") Object.assign(d, { operaciones68_3: [...d.operaciones68_3, ...d.operaciones68_3] })
    if (fallo === "persona") Object.assign(p, { pagador: "B" })
    if (fallo === "sin_movimiento" || fallo === "no_aplicar_sin_movimiento") Object.assign(h, { movimientos: h.movimientos.filter(x => x !== m) })
    if (fallo === "no_aplicar_sin_movimiento") Object.assign(op, { eleccion: "no_aplicar" })
    if (fallo === "id_distinto") Object.assign(m, { id: "otro" })
    if (fallo === "documento_distinto") Object.assign(m.documento, { referencia: "otro" })
    if (fallo === "fecha_distinta") Object.assign(m, { fecha: "2025-06-02" })
    if (fallo === "importe_distinto") Object.assign(m, { importe: "301" })
    if (fallo === "entrada_consumo") Object.assign(m, { sentido: "entrada" })
    if (fallo === "movimiento_duplicado") Object.assign(h, { movimientos: [...h.movimientos, structuredClone(m)] })
    if (fallo === "documento_duplicado") Object.assign(h.movimientos.find(x => x.id === "CON")!.documento, { referencia: p.documento })
    if (fallo === "pago_inversion") Object.assign(p, { id: h.proyectos[0]!.vivienda.pagos[0]!.id })
    if (fallo === "documento_inversion") Object.assign(p, { documento: h.proyectos[0]!.vivienda.pagos[0]!.factura })
    if (fallo === "pago_original") Object.assign(p, { id: h.proyectos[0]!.pagosOriginales[0]!.id })
    if (fallo === "documento_original") Object.assign(p, { documento: h.proyectos[0]!.pagosOriginales[0]!.documento.referencia })
    if (fallo === "historia") Object.assign(op, { historial: [] })
    if (fallo === "regional") Object.assign(s, { solicitudes: [...s.solicitudes, { lote: "F-ampliado", codigo: "murcia_donativos_investigacion_biosanitaria", hechos: {} }] })
    if (fallo === "patrimonio_parcial") {
      Object.assign(h.cuentas[0]!.cierre, { importe: "1999.99" })
      Object.assign(h.movimientos.find(x => x.id === "CON")!, { importe: new Decimal(o.consumo).plus("0.01").toFixed() })
    }
    if (fallo === "herencia" || fallo === "donacion_recibida") Object.assign(h.movimientos.find(x => x.id === "ING")!, { clase: fallo === "herencia" ? "herencia" : "donacion" })
    // TypeError/defecto lanzado no cumple esta aserción: se exige fallo tipado público.
    expect(Effect.runSync(Effect.flip(ejecutar(api, s, o)))._tag).toBe("ResultadoNoSoportado")
  })
  it(`${api}: orden físico de propiedades no selecciona prioridad`, () => {
    const o = oraculos[1]!, s = hechos(o)
    const invertida = { donativosEstatales2025: s.donativosEstatales2025!, solicitudes: s.solicitudes, prioridadCuotasDT18Donativos2025: s.prioridadCuotasDT18Donativos2025!, viviendaDT182025: s.viviendaDT182025! }
    expect(Effect.runSync(ejecutar(api, invertida, o))).toEqual(Effect.runSync(ejecutar(api, s, o)))
  })
}
