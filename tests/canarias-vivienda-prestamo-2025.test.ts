import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { ViviendaC36 } from "../lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-esquemas"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { casoUniformeC36, casoExplicitoC36, viviendaConexionC36 } from "./c36-conexion-anual.fixtures"
const doc = (referencia: string, fecha = "2025-12-31") => ({referencia, fecha, emisor: "entidad"})
function contado(precio = "10000") {
  const s = viviendaConexionC36("canarias_inversion_vivienda_habitual")
  const v = s.hechos.viviendas[0]
  if (v === undefined) throw new RangeError("fixture sin vivienda")
  const p = v.gastos[0]
  if (p === undefined) throw new RangeError("fixture sin pago")
  return Schema.decodeUnknownSync(ViviendaC36)({...s, hechos: {...s.hechos,
    viviendas: [{...v, adquisicion: "2025-02-01", ocupacion: "2025-02-01", habitualDesde: "2025-02-01", propietarios: [{persona: "s-1", porcentaje: "100", titulo: "escritura"}], gastos: [{...p, fecha: "2025-02-01", concepto: "adquisicion", importe: precio, perceptor: "VEN", naturaleza: "propio", ayudasExentas: "0", reembolsos: "0", medio: "transferencia"}]}],
    historiaAdquisicion: {
      ubicacion: "canarias", catastro: v.catastro, localizacion: doc("catastro"), residencia: {desde: "2025-02-01", hasta: "2025-12-31", documento: doc("padron")}, ayudas: {documento: doc("censo-ayudas"), censo: "todas_concesiones_y_cobros_desde_adquisicion", expedientes: []},
      patrimonio: {ejercicio: 2025, persona: "s-1", exhaustividad: "todos_activos_deudas_derechos_y_movimientos", prestamo: null,
        censo: [{id: "CTA", tipo: "cuenta_euros", inicio: "presente"}, {id: v.id, tipo: "vivienda", inicio: "ausente"}].map(c => ({...c, titular: "s-1", participacion: [1,1], cierre: "presente", documento: doc("censo")})),
        cuentas: [{id: "CTA", inicio: {importe: "2000", documento: doc("inicio", "2025-01-01")}, cierre: {importe: "2000", documento: doc("cierre")}}],
        movimientos: [{id: "ingreso", fecha: "2025-01-02", importe: precio, clase: "ingreso", sentido: "entrada", documento: doc("ingreso")}, {id: p.id, fecha: "2025-02-01", importe: precio, clase: "precio", sentido: "salida", documento: doc(p.factura)}].map(x => ({...x, cuenta: "CTA"})),
        adquisicion: {inmueble: v.id, fecha: "2025-02-01", vendedor: "VEN", precio, escritura: doc("escritura", "2025-02-01"), valorCierre: {importe: precio, documento: doc("valor")}},
        historia: {desde: "1985-01-01", hasta: "2025-12-31", documento: doc("vida"), derechos: [{inmueble: v.id, titular: "s-1", adquisicion: "2025-02-01", transmision: null, titulo: doc("escritura", "2025-02-01")}], anticipos: [], ejercicios: Array.from({length: 40}, (_, i) => ({anio: 1985 + i, documento: doc("ejercicio" + i), eventos: []}))},
      },
    },
  }}, {onExcessProperty: "error"})
}

// Importes esperados fijados por contabilidad y fracciones en oraculos.json;
// no se consulta ningún productor fiscal para obtener el esperado.
function financiada(capital = "1000", interes = "200", comision = "100", ingreso = "3300") {
  const s = contado(), h = s.hechos.historiaAdquisicion
  if (h === undefined) throw new RangeError("fixture sin historia")
  const p = h.patrimonio, v = s.hechos.viviendas[0], precio = p.movimientos.find(x => x.clase === "precio")
  if (v === undefined || precio === undefined || v.gastos[0] === undefined) throw new RangeError("fixture sin compra")
  const pago = v.gastos[0]
  const salida = (id: string, importe: string, clase: "amortizacion" | "intereses" | "gastos_financiacion", fecha: string) => ({id, cuenta: "CTA", fecha, importe, clase, sentido: "salida" as const, documento: doc(id, fecha)})
  const gastos = [
    ...(comision === "0" ? [] : [salida("comision", comision, "gastos_financiacion", "2025-02-01")]),
    ...(capital === "0" ? [] : [salida("capital", capital, "amortizacion", "2025-12-01")]),
    ...(interes === "0" ? [] : [salida("interes", interes, "intereses", "2025-12-01")]),
  ]
  Object.assign(p, {
    prestamo: {id: "L", fecha: "2025-02-01", acreedor: "BANCO", inmueble: v.id, contrato: doc("contrato", "2025-02-01"), principalCierre: {importe: String(8000 - Number(capital)), documento: doc("principal")}},
    censo: [...p.censo, {id: "L", tipo: "prestamo", titular: "s-1", participacion: [1,1], inicio: "ausente", cierre: "presente", documento: doc("censo-prestamo")}],
    movimientos: [
      {id: "ingreso", cuenta: "CTA", fecha: "2025-01-02", importe: ingreso, clase: "ingreso", sentido: "entrada", documento: doc("ingreso")},
      {id: "disposicion", cuenta: "CTA", fecha: "2025-02-01", importe: "8000", clase: "disposicion", sentido: "entrada", documento: doc("disposicion", "2025-02-01")},
      precio, ...gastos,
    ],
  })
  Object.assign(h, {financiacionOriginal: {
    trayectoria: "original_exclusivo_sin_refinanciacion_ni_disposiciones_adicionales",
    modalidad: "ordinario_sin_coberturas_ni_seguros_vinculados", documento: doc("trayectoria"),
    gastos: comision === "0" ? [] : [{movimiento: "comision", naturaleza: "comision_apertura", documento: doc("comision", "2025-02-01")}],
  }})
  Object.assign(v, {gastos: [pago, ...gastos.map(g => ({...pago, id: g.id, factura: g.documento.referencia, fecha: g.fecha, importe: g.importe, perceptor: "BANCO"}))]})
  return Schema.decodeUnknownSync(ViviendaC36)(s, {onExcessProperty: "error"})
}
for (const api of ["uniforme", "explicita"] as const) {
  const uniforme = (s: typeof ViviendaC36.Type) => liquidarIrpfAnual({...casoUniformeC36(), deduccionesTerritoriales2025: {solicitudes: [s]}}, {modo: "canonico"})
  const explicita = (s: typeof ViviendaC36.Type) => liquidarIrpfAnualExplicito(casoExplicitoC36([s]))
  const programa = (s: typeof ViviendaC36.Type) => api === "uniforme" ? Effect.runSync(uniforme(s)) : Effect.runSync(explicita(s))
  const rechazo = (s: typeof ViviendaC36.Type) => api === "uniforme" ? Effect.runSync(Effect.flip(uniforme(s))) : Effect.runSync(Effect.flip(explicita(s)))
  it.each([
    ["1000", "200", "100", "3300", "115.5"],
    ["1000", "200", "0", "3200", "112"],
    ["1000", "0", "0", "3000", "105"],
    ["0", "200", "100", "2300", "80.5"],
    ["3699.99", "200", "100", "5999.99", "209.99965"],
    ["3700", "200", "100", "6000", "210"],
    ["3700.01", "200", "100", "6000.01", "210"],
  ])(`${api} capital=%s interés=%s apertura=%s`, (capital, interes, comision, ingreso, esperado) => {
    const r = programa(financiada(capital, interes, comision, ingreso))
    expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(esperado))
    expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
  })
  it(`${api} patrimonio limita capital, conserva intereses y comisión`, () => {
    const s = financiada(), h = s.hechos.historiaAdquisicion!
    // Banco y patrimonio conservan coherencia: consumo extra y saldo menor.
    Object.assign(h.patrimonio, {movimientos: [...h.patrimonio.movimientos, {id: "consumo", cuenta: "CTA", fecha: "2025-12-31", importe: "0.01", clase: "consumo", sentido: "salida", documento: doc("consumo")} ]})
    Object.assign(h.patrimonio.cuentas[0].cierre, {importe: "1999.99"})
    expect(programa(s).deduccionesTerritoriales2025?.total).toEqual(racional("115.49965"))
  })
  for (const causa of ["trayectoria", "principal", "censo", "comision", "receptor", "importe", "duplicado", "fecha", "ayuda", "antecedente", "anticipo", "cotitular", "saldo", "refinanciacion"] as const) {
    it(`${api} rechazo concreto sin cuota: ${causa}`, () => {
      const s = financiada(), h = s.hechos.historiaAdquisicion!, p = h.patrimonio, v = s.hechos.viviendas[0]
      if (causa === "trayectoria") Reflect.deleteProperty(h, "financiacionOriginal")
      if (causa === "principal") Object.assign(p.prestamo!.principalCierre, {importe: "6999.99"})
      if (causa === "censo") Object.assign(p, {censo: p.censo.filter(c => c.id !== "L")})
      if (causa === "comision") Object.assign(h.financiacionOriginal!, {gastos: []})
      if (causa === "receptor") Object.assign(v.gastos[1], {perceptor: "OTRO"})
      if (causa === "importe") Object.assign(v.gastos[1], {importe: "100.01"})
      if (causa === "duplicado") Object.assign(v, {gastos: [...v.gastos, v.gastos[1]]})
      if (causa === "fecha") Object.assign(p.prestamo!, {fecha: "2024-12-31"})
      if (causa === "ayuda") Object.assign(h.ayudas, {expedientes: [doc("ayuda")]})
      if (causa === "antecedente") Object.assign(p.historia.ejercicios[0], {eventos: [{tipo: "inversion_vivienda", inmueble: "otra", documento: doc("previa")}]})
      if (causa === "anticipo") Object.assign(p.historia, {anticipos: [{inmueble: v.id, fecha: "2024-01-01", importe: "1", documento: doc("anticipo")}]})
      if (causa === "cotitular") Object.assign(v.propietarios![0], {porcentaje: "50"})
      if (causa === "saldo") Object.assign(p.cuentas[0].cierre, {importe: "1999.99"})
      if (causa === "refinanciacion") Object.assign(p, {movimientos: [...p.movimientos, {...p.movimientos[1], id: "segunda-disposicion", documento: doc("segunda-disposicion")} ]})
      const error = rechazo(s)
      expect(error._tag).toBe("ResultadoNoSoportado")
      const motivos = {
        trayectoria: /trayectoria del préstamo original/, principal: /principal de cierre/,
        censo: /patrimonio conjunto/, comision: /clasificación documental/,
        receptor: /pago no vinculado/, importe: /pago no vinculado/, duplicado: /pago o documento monetario reutilizado/,
        fecha: /contrato original/, ayuda: /ayudas con concesión/,
        antecedente: /inversiones deducidas/, anticipo: /anticipos/,
        cotitular: /titularidad exclusiva/, saldo: /saldo bancario no concilia/,
        refinanciacion: /disposición original/,
      }
      expect(error.motivo).toMatch(motivos[causa])
      expect("cuotaLiquidaCentimos" in error).toBe(false)
    })
  }
  it(`${api} exceso fiscal externo no entra en contrato`, () => {
    expect(() => Schema.decodeUnknownSync(ViviendaC36)({...financiada(), baseElegible: "3300"}, {onExcessProperty: "error"})).toThrow()
  })
}
