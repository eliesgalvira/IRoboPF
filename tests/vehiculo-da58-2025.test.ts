import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import { HechosVehiculoDA58, producirVehiculoDA58 as producir } from "../lib/dominio/irpf/vehiculo-da58-2025/productor"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { anualEfectivo } from "./vehiculo-da58-fixture"
const A = Decimal.clone({ precision: 200 })
type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }
function hechos(total = "30000"): Mutable<typeof HechosVehiculoDA58.Type> {
  return { ejercicio: 2025, contribuyente: "s-1", opcion: "adquisicion_y_matriculacion_2025", historia: "sin_otra_compra_DA58_ni_anticipos_previos", referenciaHistoria: "declaracion-historia-completa", vehiculo: {
    id: "v-1", bastidor: "bastidor-sintetico", matricula: "matricula-sintetica", titular: "s-1", titularFactura: "s-1", vendedor: "vendedor", factura: "factura-adquisicion-a-s-1",
    fechaAdquisicion: "2025-06-01", primeraMatriculacion: "2025-06-01", nuevo: true, categoria: "M1", tecnologia: "BEV", plazas: 5, autonomiaWLTP: "300", fichaTecnica: "ficha", modeloIDAE: "modelo", referenciaIDAE: "copia-ficha-modelo-idae", fechaConsultaIDAE: "2025-06-01", afectacion: "ninguna", permanencia: "prevista_cuatro_anios", precioSinIVA: total, tributos: "0", gastosInherentes: "0", pagos: [{ id: "p-1", fecha: "2025-06-01", pagador: "s-1", importe: total, vendedor: "vendedor", documento: "justificante" }], ayudas: [], exhaustividad: "pagos_ayudas_y_titularidad_completos",
  } }
}
function sobre(h = hechos(), regional = true) {
  const v = h.vehiculo
  return { vehiculoDA582025: h, solicitudes: regional ? [{ lote: "D51" as const, codigo: "cyl_movilidad_sostenible" as const, hechos: { vehiculos: [{ id: v.id, tipo: "electrico" as const, wltp: v.autonomiaWLTP, precio: new A(v.precioSinIVA).plus(v.tributos).plus(v.gastosInherentes).toFixed(), fechaMatricula: v.primeraMatriculacion, afectacion: "no" as const, adquirentes: [v.titular], pagos: v.pagos.map(({ id,fecha,pagador,importe })=>({id,fecha,pagador,importe})) }], exhaustividad: "completa" as const } }] : [] }
}
const caso = (): CasoFiscalAnual => ({ anio: 2025, contribuyenteId: "s-1", comunidadAutonoma: "castilla-y-leon", situacionFamiliar: { tipo: "individual", edad: 40, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] }, rendimientos: { trabajo: [{ importeIntegroCentimos: 6000000 }] }, reducciones: [], deducciones: [], retencionesSoportadasCentimos: 0, pagosACuentaCentimos: 0 })
// Esperados racionales independientes, sin usar productor para construir el esperado:
// 30000 -> min(20000,30000)*15/100=3000; CyL min(4500,4000-3000)=1000.
it.each(["canonico", "efectivo"] as const)("%s: ambas cuotas una sola vez, total 4000", api => {
  if (api === "canonico") {
    const a = caso(), sin = Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})), con = Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:sobre()},{modo:"canonico"}))
    expect(sin.cuotaLiquidaCentimos-con.cuotaLiquidaCentimos).toBe(400000)
    expect(con.deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:"1000",divisor:"1"})
  } else {
    const a=anualEfectivo(), sin=Effect.runSync(liquidarIrpfAnualExplicito(a)), con=Effect.runSync(liquidarIrpfAnualExplicito({...a,deduccionesTerritoriales2025:sobre()}))
    expect(new A(sin.cuotaLiquidaLegal).minus(con.cuotaLiquidaLegal).toFixed()).toBe("4000")
  }
})
it.each([["10000","1500"],["20000","3000"],["20000.000000000000000000000000000000000000000000000000000000000000000000000001","3000"],["45000","3000"]])("base DA58 desde hechos %s", (valor, esperado) => {
  expect(producir(hechos(valor),"s-1",new A(99999)).generada.toFixed()).toBe(esperado)
})
it("ayuda prevista identificada reduce base; cuota estatal insuficiente no consume autonómica",()=>{
  const h=hechos("10000");h.vehiculo.ayudas=[{id:"a",vehiculoId:"v-1",programa:"MOVES",referencia:"expediente",importe:"1000",estado:"prevista_no_cobrada_2025"}]
  const r=producir(h,"s-1",new A(100));expect(r.base.toFixed()).toBe("9000");expect(r.generada.toFixed()).toBe("1350");expect(r.aplicada.toFixed()).toBe("100");expect(r.noAplicada.toFixed()).toBe("1250")
})
it.each(["titular","pago-ajeno","duplicado","2024","fecha-imposible","sobreprecio","exceso-pago","ayuda-ajena"])("rechazo productor: %s", clase=>{
  const h=hechos(),v=h.vehiculo
  if(clase==="titular")v.titular="otro"
  if(clase==="pago-ajeno")v.pagos[0]!.pagador="otro"
  if(clase==="duplicado")v.pagos=[...v.pagos,...v.pagos]
  if(clase==="2024")v.pagos[0]!.fecha="2024-12-31"
  if(clase==="fecha-imposible")v.primeraMatriculacion="2025-02-30"
  if(clase==="sobreprecio")v.precioSinIVA="45000.000000000000000000000000000000000000000000000000000000000000000000000001"
  if(clase==="exceso-pago")v.pagos[0]!.importe="30001"
  if(clase==="ayuda-ajena")v.ayudas=[{id:"a",vehiculoId:"otro",programa:"MOVES",referencia:"exp",importe:"1000",estado:"prevista_no_cobrada_2025"}]
  expect(()=>producir(h,"s-1",new A(9999))).toThrow()
})
it("frontera no acepta deducción/base externa ni opción anticipo",()=>{
  expect(()=>Schema.decodeUnknownSync(HechosVehiculoDA58)({...hechos(),base:"20000"},{onExcessProperty:"error"})).toThrow()
  expect(()=>Schema.decodeUnknownSync(HechosVehiculoDA58)({...hechos(),opcion:"anticipo_2024"})).toThrow()
})
it.each(["vehiculo","pagos","precio","ausente"])("ambas API rechazan CyL no conciliado: %s",clase=>{
  const s=sobre(),v=s.solicitudes[0]!.hechos.vehiculos[0]!
  if(clase==="vehiculo")v.id="otro"
  if(clase==="pagos")v.pagos[0]!.id="otro"
  if(clase==="precio")v.precio="30001"
  const entrada=clase==="ausente"?{solicitudes:s.solicitudes}:s
  expect(()=>Effect.runSync(liquidarIrpfAnual({...caso(),deduccionesTerritoriales2025:entrada},{modo:"canonico"}))).toThrow()
  expect(()=>Effect.runSync(liquidarIrpfAnualExplicito({...anualEfectivo(),deduccionesTerritoriales2025:entrada}))).toThrow()
})
it.each([["40000","1000"],["40000.000000000000000000000000000000000000000000000000000000000000000000000001","0"]])("CyL frontera exacta incluido impuestos %s",(precio,regional)=>{
  const con=Effect.runSync(liquidarIrpfAnual({...caso(),deduccionesTerritoriales2025:sobre(hechos(precio))},{modo:"canonico"}))
  expect(con.deduccionesTerritoriales2025?.total).toEqual({numeradorEuros:regional,divisor:"1"})
})
it("Madrid sin solicitud regional aplica 3000 estatal en ambas API",()=>{
  const a={...caso(),comunidadAutonoma:"madrid" as const},s=sobre(hechos(),false)
  const sin=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),con=Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:s},{modo:"canonico"}))
  expect(sin.cuotaLiquidaCentimos-con.cuotaLiquidaCentimos).toBe(300000)
  const e={...anualEfectivo(),comunidadAutonoma:"madrid" as const},sinE=Effect.runSync(liquidarIrpfAnualExplicito(e)),conE=Effect.runSync(liquidarIrpfAnualExplicito({...e,deduccionesTerritoriales2025:s}))
  expect(new A(sinE.cuotaLiquidaLegal).minus(conE.cuotaLiquidaLegal).toFixed()).toBe("3000")
})
it("80 posiciones: un incremento mínimo de ayuda cambia generación, sin double",()=>{
  const h=hechos("10000")
  h.vehiculo.ayudas=[{id:"a",vehiculoId:"v-1",programa:"MOVES",referencia:"exp",importe:"0.00000000000000000000000000000000000000000000000000000000000000000000000000000001",estado:"prevista_no_cobrada_2025"}]
  // La resta/multiplicación requeriría >80 cifras: rechazo explícito del transporte, no aproximación.
  expect(()=>producir(h,"s-1",new A(9999))).toThrow(/80 cifras/)
})
it.each(["2025-01-01","2025-12-31"])("fechas límite de adquisición %s", fecha=>{
  const h=hechos();h.vehiculo.fechaAdquisicion=fecha;h.vehiculo.primeraMatriculacion=fecha;h.vehiculo.fechaConsultaIDAE=fecha;h.vehiculo.pagos[0]!.fecha=fecha
  expect(producir(h,"s-1",new A(9999)).generada.toFixed()).toBe("3000")
})
it("clasificación autonomía 30 inclusive y factura propia",()=>{
  const h=hechos();h.vehiculo.autonomiaWLTP="30"
  expect(producir(h,"s-1",new A(9999)).generada.toFixed()).toBe("3000")
  h.vehiculo.autonomiaWLTP="29.999999999999999999999999999999999999999999999999999999999999999999999999999999"
  expect(()=>producir(h,"s-1",new A(9999))).toThrow()
  h.vehiculo.autonomiaWLTP="30";h.vehiculo.titularFactura="otro"
  expect(()=>producir(h,"s-1",new A(9999))).toThrow()
})
