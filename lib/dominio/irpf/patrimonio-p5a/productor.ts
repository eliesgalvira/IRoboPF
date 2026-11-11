import type { PatrimonioP5a, PatrimonioRiojaAnterior } from "./contrato"
import type { ViviendaRioja } from "../deducciones/galicia-rioja-ampliacion-2025/vivienda-rioja"
import { cero, euros, mas, menos, suma, compara, exige, ids, fecha, documento, serial, paso } from "../deducciones/galicia-rioja-ampliacion-2025/comun"
type ViviendaEntrada = Omit<ViviendaRioja,"inversionAnteriorDeducida"|"gananciaExentaReinversion"|"inversionNuevaAcumuladaAntes2025">
export function producirPatrimonioP5a(p:PatrimonioP5a, persona:string, nacimiento:string, v:ViviendaEntrada){return producir(p,persona,nacimiento,v)}
export function producirSegundaRiojaAnterior(p:PatrimonioRiojaAnterior,persona:string,nacimiento:string,v:ViviendaEntrada){return producir(p,persona,nacimiento,v,p.financiacionAnterior)}
function producir(p:PatrimonioP5a, persona:string, nacimiento:string, v:Omit<ViviendaRioja,"inversionAnteriorDeducida"|"gananciaExentaReinversion"|"inversionNuevaAcumuladaAntes2025">, anterior?:PatrimonioRiojaAnterior["financiacionAnterior"]){
 function no(b:boolean,m:string):asserts b{exige(b,"P5a perfil no representado: "+m)}
 const igual=(a:ReturnType<typeof euros>,b:ReturnType<typeof euros>,m:string)=>no(compara(a,b)===0,m)
 no(p.persona===persona&&p.ejercicio===2025,"persona/ejercicio ajeno")
 no(p.exhaustividad==="todos_activos_deudas_derechos_y_movimientos","censo incompleto")
 const a=p.adquisicion,l=p.prestamo,h=p.historia
 no(v.operacion==="adquisicion"&&a.inmueble===v.inmueble.id&&fecha(a.fecha)&&a.fecha>=nacimiento&&(anterior===undefined?a.fecha>="2025-01-01"&&a.fecha<="2025-12-31":a.fecha<"2013-01-01"&&v.inmueble.uso==="esporadico")&&a.fecha===v.inmueble.adquisicion&&a.fecha===v.fechaInicioInversion,"sólo adquisición del perfil y de la inversión exacta")
 no(v.inmueble.titulares.length===1&&v.inmueble.titulares[0]?.titular===persona&&v.inmueble.titulares[0]?.numerador===1&&v.inmueble.titulares[0]?.denominador===1,"titularidad plena exclusiva")
 no(a.vendedor.trim().length>0&&a.vendedor!==persona,"vendedor")
 documento(a.escritura);documento(a.valorCierre.documento)
 no(a.escritura.fecha===a.fecha&&a.valorCierre.documento.fecha>="2025-12-31","documentos de adquisición/cierre")
 const precio=euros(a.precio),valorCierre=euros(a.valorCierre.importe)
 no(compara(precio,cero)>0,"precio no positivo");igual(precio,euros(v.inmueble.precioAdquisicion),"precio contradictorio")
 no(v.coberturaIntereses==="0"&&v.deduccionPre2013===null&&v.ejercicioDeduccionAnterior===null&&v.excepcion6812===null,"historia o cobertura no representada")
 no(h.desde===nacimiento&&h.hasta==="2025-12-31"&&fecha(nacimiento),"cobertura vital del censo")
 documento(h.documento);no(h.documento.fecha>="2025-12-31","censo sin cierre")
 no(h.derechos.length===1&&h.derechos[0]?.inmueble===a.inmueble&&h.derechos[0]?.titular===persona&&h.derechos[0]?.adquisicion===a.fecha&&h.derechos[0]?.transmision===null,"antecedentes/derechos omitidos o no representados")
 for(const d of h.derechos)documento(d.titulo)
 no(h.anticipos.length===0,"anticipos requieren productor histórico")
 const nacimientoAnio=Number(nacimiento.slice(0,4))
 no(h.ejercicios.length===2025-nacimientoAnio&&new Set(h.ejercicios.map(x=>x.anio)).size===h.ejercicios.length,"censo fiscal anual vital incompleto/duplicado")
 for(const e of h.ejercicios){no(Number.isInteger(e.anio)&&e.anio>=nacimientoAnio&&e.anio<2025&&(anterior===undefined?e.eventos.length===0:e.eventos.length===(e.anio===Number(a.fecha.slice(0,4))?1:0)&&e.eventos.every(x=>x.tipo==="inversion_vivienda"&&x.inmueble===a.inmueble)),"historia de deducciones/reinversión no representada");for(const x of e.eventos)documento(x.documento);documento(e.documento);no(e.documento.fecha>=`${e.anio}-12-31`,"cobertura de ejercicio fiscal")}
 no(ids(p.censo.map(x=>x.id))&&ids(p.cuentas.map(x=>x.id))&&ids(p.movimientos.map(x=>x.id))&&ids(p.movimientos.map(x=>x.documento.referencia))&&p.cuentas.length>0,"identidades duplicadas/cuentas ausentes")
 const esperados=[...p.cuentas.map(x=>x.id),a.inmueble,...(l===null?[]:[l.id])]
 no(ids(esperados)&&p.censo.length===esperados.length,"censo de activos/deudas incompleto")
 for(const c of p.censo){documento(c.documento);no(c.documento.fecha>="2025-12-31","censo patrimonial sin cierre");no(esperados.includes(c.id)&&c.titular===persona&&c.participacion[0]===1&&c.participacion[1]===1&&c.cierre==="presente","categoría/participación/cierre no representado");no(c.tipo===(c.id===a.inmueble?"vivienda":c.id===l?.id?"prestamo":"cuenta_euros")&&c.inicio===(anterior!==undefined||p.cuentas.some(x=>x.id===c.id)?"presente":"ausente"),"clasificación/cortes contradictorios")}
 conciliarCuentasP5a(p.cuentas,p.movimientos)
 for(const m of p.movimientos){documento(m.documento);no(p.cuentas.some(c=>c.id===m.cuenta)&&fecha(m.fecha)&&m.fecha>="2025-01-01"&&m.fecha<="2025-12-31"&&m.documento.fecha>=m.fecha&&compara(euros(m.importe),cero)>0,"movimiento/fecha/importe inválido");no(m.sentido===(["ingreso","donacion","herencia","disposicion"].includes(m.clase)?"entrada":"salida"),"signo del flujo");if(["precio","disposicion"].includes(m.clase))no(m.fecha===a.fecha,"cronología adquisición/financiación");if(["amortizacion","intereses","gastos_financiacion"].includes(m.clase))no(l!==null&&m.fecha>=a.fecha,"pago de préstamo sin financiación")}
 const total=(clase:PatrimonioP5a["movimientos"][number]["clase"])=>suma(p.movimientos.filter(x=>x.clase===clase).map(x=>euros(x.importe)))
 let principalInicio=cero
 if(anterior!==undefined){
  no(l!==null&&anterior.usoDesdeAdquisicion==="segunda_residencia_sin_uso_habitual","requiere préstamo original exclusivo de segunda residencia")
  documento(anterior.disposicion.documento);documento(anterior.principalInicio.documento)
  no(anterior.disposicion.documento.fecha===a.fecha&&anterior.principalInicio.documento.fecha==="2025-01-01","fechas de préstamo histórico")
  no(anterior.exhaustividad==="trayectoria_completa_sin_refinanciacion_ni_disposiciones_adicionales","trayectoria bancaria incompleta")
  documento(anterior.pagoPrecio.documento)
  no(anterior.pagoPrecio.fecha===a.fecha&&anterior.pagoPrecio.receptor===a.vendedor&&anterior.pagoPrecio.documento.fecha>=a.fecha,"pago original no vinculado a adquisición/vendedor")
  igual(euros(anterior.pagoPrecio.importe),precio,"precio original no conciliado")
  const original=euros(anterior.disposicion.importe)
  no(compara(original,cero)>0&&compara(original,precio)<=0,"disposición original fuera de precio")
  no(ids(anterior.amortizaciones.map(x=>x.id))&&ids(anterior.amortizaciones.map(x=>x.documento.referencia)),"amortizaciones históricas repetidas")
  let ultima=a.fecha
  for(const x of anterior.amortizaciones){documento(x.documento);no(fecha(x.fecha)&&x.fecha>=ultima&&x.fecha<"2025-01-01"&&x.documento.fecha>=x.fecha&&compara(euros(x.importe),cero)>0,"amortización histórica inválida");ultima=x.fecha}
  principalInicio=menos(original,suma(anterior.amortizaciones.map(x=>euros(x.importe))))
  no(compara(principalInicio,cero)>0,"principal inicial no positivo")
  igual(principalInicio,euros(anterior.principalInicio.importe),"principal inicial no concilia con toda la trayectoria")
  igual(total("precio"),cero,"precio ya satisfecho en adquisición histórica")
  igual(total("disposicion"),cero,"no admite nueva financiación ni refinanciación")
 }else igual(total("precio"),precio,"pago del precio completo")
 const dispuesto=anterior===undefined?total("disposicion"):principalInicio,amortizado=total("amortizacion"),principal=menos(dispuesto,amortizado)
 no(compara(principal,cero)>=0&&compara(dispuesto,precio)<=0,"principal/financiación mixta")
 if(l===null)igual(dispuesto,cero,"disposición sin préstamo")
 else {documento(l.contrato);documento(l.principalCierre.documento);no(l.inmueble===a.inmueble&&l.fecha===a.fecha&&l.contrato.fecha===l.fecha&&l.principalCierre.documento.fecha>="2025-12-31"&&l.acreedor.trim().length>0&&l.acreedor!==persona&&compara(dispuesto,cero)>0,"préstamo no vinculado íntegramente a adquisición");igual(principal,euros(l.principalCierre.importe),"principal de cierre no concilia")}
 // Conserva los pagos documentados. El consumidor resta la financiación agregada una sola vez.
 const movimientosPago=p.movimientos.filter(m=>["precio","amortizacion","intereses","gastos_financiacion"].includes(m.clase))
 no(ids(v.pagos.map(x=>x.id))&&v.pagos.length===movimientosPago.length,"censo de pagos no concilia")
 const pagos=v.pagos.map(pago=>{const m=movimientosPago.find(m=>m.id===pago.id);no(m!==undefined,"pago ajeno a la inversión");no(m.clase==="precio"||m.clase==="amortizacion"||m.clase==="intereses"||m.clase==="gastos_financiacion","clase ajena al pago de inversión");no(pago.pagador===persona&&pago.fecha===m.fecha&&pago.factura===m.documento.referencia&&pago.receptor===(m.clase==="precio"?a.vendedor:l?.acreedor)&&pago.medio!=="efectivo"&&pago.subvencion==="0"&&pago.especieExenta==="0"&&pago.concepto===({precio:"adquisicion",amortizacion:"amortizacion",intereses:"intereses",gastos_financiacion:"gastos"} as const)[m.clase],"pago no vinculado a documento/concepto/receptor");igual(euros(pago.importe),euros(m.importe),"pago contradictorio");return pago})
 const isd=mas(total("donacion"),total("herencia"))
 const {inicial,brutoFinal,variacion,final}=ajustarPatrimonioP5a(suma(p.cuentas.map(x=>euros(x.inicio.importe))),suma(p.cuentas.map(x=>euros(x.cierre.importe))),anterior===undefined?cero:precio,valorCierre,precio,anterior===undefined?cero:principalInicio,principal,isd)
 const inversion=mas(anterior===undefined?menos(precio,dispuesto):cero,amortizado)
 return {inicial,final,inversion,pagos,financiacionAdquisicion:{inmueble:a.inmueble,dispuesto:anterior===undefined?dispuesto:cero},rastro:[paso(a.inmueble,"P5a activo de cierre menos principal vivo",brutoFinal,principal),paso(a.inmueble,"P5a variación de valoración excluida (cierre menos precio)",valorCierre,variacion),paso(persona,"P5a perfil sin ingresos ISD: patrimonio final ajustado por valoración",isd,final),paso(persona,"P5a incremento comparable e inversión propia sin intereses ni gastos de financiación",menos(final,inicial),inversion)],historia:{inversionAnteriorDeducida:"0",gananciaExentaReinversion:"0",inversionNuevaAcumuladaAntes2025:"0"},traza:{persona,inmueble:a.inmueble,patrimonioInicial:serial(inicial),patrimonioFinalBruto:serial(brutoFinal),variacionExcluida:serial(variacion),isdExcluido:serial(isd),principalVivo:serial(principal),incrementoComparable:serial(menos(final,inicial)),inversionSinFinanciacion:serial(inversion)}}
}

/** Cuentas y flujos económicos compartidos; no recibe bases fiscales. */
export function conciliarCuentasP5a(cuentas:PatrimonioP5a["cuentas"],movimientos:PatrimonioP5a["movimientos"]):void{
 function no(b:boolean,m:string):asserts b{exige(b,"P5a cuentas: "+m)}
 const igual=(a:ReturnType<typeof euros>,b:ReturnType<typeof euros>,m:string)=>no(compara(a,b)===0,m)
 no(cuentas.length>0&&ids(cuentas.map(x=>x.id))&&ids(movimientos.map(x=>x.id))&&ids(movimientos.map(x=>x.documento.referencia)),"censo duplicado/vacío")
 for(const m of movimientos){documento(m.documento);no(cuentas.some(c=>c.id===m.cuenta)&&fecha(m.fecha)&&m.fecha>="2025-01-01"&&m.fecha<="2025-12-31"&&m.documento.fecha>=m.fecha&&compara(euros(m.importe),cero)>0,"movimiento inválido");no(m.sentido===(["ingreso","donacion","herencia","disposicion"].includes(m.clase)?"entrada":"salida"),"signo del movimiento")}
 for(const c of cuentas){documento(c.inicio.documento);documento(c.cierre.documento);no(c.inicio.documento.fecha==="2025-01-01"&&c.cierre.documento.fecha==="2025-12-31","fechas de saldos bancarios");let fin=euros(c.inicio.importe);let fechaAnterior="2025-01-01";for(const m of movimientos.filter(m=>m.cuenta===c.id)){no(m.fecha>=fechaAnterior,"movimientos sin orden cronológico");fechaAnterior=m.fecha;fin=m.sentido==="entrada"?mas(fin,euros(m.importe)):menos(fin,euros(m.importe));no(compara(fin,cero)>=0,"descubierto bancario requiere deuda adicional")}igual(fin,euros(c.cierre.importe),"saldo bancario no concilia")}
}
/** Identidad patrimonial; la selección de activos y deudas corresponde a cada productor. */
export function ajustarPatrimonioP5a(cuentasInicio:ReturnType<typeof euros>,cuentasFinal:ReturnType<typeof euros>,costeInicio:ReturnType<typeof euros>,valorFinal:ReturnType<typeof euros>,costeFinal:ReturnType<typeof euros>,deudaInicio:ReturnType<typeof euros>,deudaFinal:ReturnType<typeof euros>,isd:ReturnType<typeof euros>){
 const inicial=menos(mas(cuentasInicio,costeInicio),deudaInicio)
 const brutoFinal=menos(mas(cuentasFinal,valorFinal),deudaFinal)
 const variacion=menos(valorFinal,costeFinal)
 // La fecha bancaria no acredita cuándo se adquirió el derecho ni si ya
 // integraba el patrimonio inicial. No restar ISD ni fabricar un cero fiscal.
 exige(compara(isd,cero)===0,"P5a donación/herencia: falta cronología de adquisición del derecho y patrimonio inicial; no se calcula importe")
 const final=menos(brutoFinal,variacion)
 return {inicial,brutoFinal,variacion,final}
}
