import type { PatrimonioP5a } from "./contrato"
import type { ViviendaRioja } from "../deducciones/galicia-rioja-ampliacion-2025/vivienda-rioja"
import { cero, euros, mas, menos, suma, compara, exige, ids, fecha, documento, serial, paso } from "../deducciones/galicia-rioja-ampliacion-2025/comun"
export function producirPatrimonioP5a(p:PatrimonioP5a, persona:string, nacimiento:string, v:Omit<ViviendaRioja,"inversionAnteriorDeducida"|"gananciaExentaReinversion"|"inversionNuevaAcumuladaAntes2025">){
 function no(b:boolean,m:string):asserts b{exige(b,"P5a perfil no representado: "+m)}
 const igual=(a:ReturnType<typeof euros>,b:ReturnType<typeof euros>,m:string)=>no(compara(a,b)===0,m)
 no(p.persona===persona&&p.ejercicio===2025,"persona/ejercicio ajeno")
 no(p.exhaustividad==="todos_activos_deudas_derechos_y_movimientos","censo incompleto")
 const a=p.adquisicion,l=p.prestamo,h=p.historia
 no(v.operacion==="adquisicion"&&a.inmueble===v.inmueble.id&&fecha(a.fecha)&&a.fecha>="2025-01-01"&&a.fecha<="2025-12-31"&&a.fecha===v.inmueble.adquisicion&&a.fecha===v.fechaInicioInversion,"sólo adquisición2025 de la inversión exacta")
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
 for(const e of h.ejercicios){no(Number.isInteger(e.anio)&&e.anio>=nacimientoAnio&&e.anio<2025&&e.eventos.length===0,"historia de deducciones/reinversión no representada");documento(e.documento);no(e.documento.fecha>=`${e.anio}-12-31`,"cobertura de ejercicio fiscal")}
 no(ids(p.censo.map(x=>x.id))&&ids(p.cuentas.map(x=>x.id))&&ids(p.movimientos.map(x=>x.id))&&ids(p.movimientos.map(x=>x.documento.referencia))&&p.cuentas.length>0,"identidades duplicadas/cuentas ausentes")
 const esperados=[...p.cuentas.map(x=>x.id),a.inmueble,...(l===null?[]:[l.id])]
 no(ids(esperados)&&p.censo.length===esperados.length,"censo de activos/deudas incompleto")
 for(const c of p.censo){documento(c.documento);no(c.documento.fecha>="2025-12-31","censo patrimonial sin cierre");no(esperados.includes(c.id)&&c.titular===persona&&c.participacion[0]===1&&c.participacion[1]===1&&c.cierre==="presente","categoría/participación/cierre no representado");no(c.tipo===(c.id===a.inmueble?"vivienda":c.id===l?.id?"prestamo":"cuenta_euros")&&c.inicio===(p.cuentas.some(x=>x.id===c.id)?"presente":"ausente"),"clasificación/cortes contradictorios")}
 for(const c of p.cuentas){documento(c.inicio.documento);documento(c.cierre.documento);no(c.inicio.documento.fecha==="2025-01-01"&&c.cierre.documento.fecha==="2025-12-31","fechas de saldos bancarios");let fin=euros(c.inicio.importe);let fechaAnterior="2025-01-01";for(const m of p.movimientos.filter(m=>m.cuenta===c.id)){no(m.fecha>=fechaAnterior,"movimientos sin orden cronológico");fechaAnterior=m.fecha;fin=m.sentido==="entrada"?mas(fin,euros(m.importe)):menos(fin,euros(m.importe));no(compara(fin,cero)>=0,"descubierto bancario requiere deuda adicional")}igual(fin,euros(c.cierre.importe),"saldo bancario no concilia")}
 for(const m of p.movimientos){documento(m.documento);no(p.cuentas.some(c=>c.id===m.cuenta)&&fecha(m.fecha)&&m.fecha>="2025-01-01"&&m.fecha<="2025-12-31"&&m.documento.fecha>=m.fecha&&compara(euros(m.importe),cero)>0,"movimiento/fecha/importe inválido");no(m.sentido===(["ingreso","donacion","herencia","disposicion"].includes(m.clase)?"entrada":"salida"),"signo del flujo");if(["precio","disposicion"].includes(m.clase))no(m.fecha===a.fecha,"cronología adquisición/financiación");if(["amortizacion","intereses","gastos_financiacion"].includes(m.clase))no(l!==null&&m.fecha>=a.fecha,"pago de préstamo sin financiación")}
 const total=(clase:PatrimonioP5a["movimientos"][number]["clase"])=>suma(p.movimientos.filter(x=>x.clase===clase).map(x=>euros(x.importe)))
 igual(total("precio"),precio,"pago del precio completo")
 const dispuesto=total("disposicion"),amortizado=total("amortizacion"),principal=menos(dispuesto,amortizado)
 no(compara(principal,cero)>=0&&compara(dispuesto,precio)<=0,"principal/financiación mixta")
 if(l===null)igual(dispuesto,cero,"disposición sin préstamo")
 else {documento(l.contrato);documento(l.principalCierre.documento);no(l.inmueble===a.inmueble&&l.fecha===a.fecha&&l.contrato.fecha===l.fecha&&l.principalCierre.documento.fecha>="2025-12-31"&&l.acreedor.trim().length>0&&l.acreedor!==persona&&compara(dispuesto,cero)>0,"préstamo no vinculado íntegramente a adquisición");igual(principal,euros(l.principalCierre.importe),"principal de cierre no concilia")}
 // Conserva los pagos documentados. El consumidor resta la financiación agregada una sola vez.
 const movimientosPago=p.movimientos.filter(m=>["precio","amortizacion","intereses","gastos_financiacion"].includes(m.clase))
 no(ids(v.pagos.map(x=>x.id))&&v.pagos.length===movimientosPago.length,"censo de pagos no concilia")
 const pagos=v.pagos.map(pago=>{const m=movimientosPago.find(m=>m.id===pago.id);no(m!==undefined,"pago ajeno a la inversión");no(m.clase==="precio"||m.clase==="amortizacion"||m.clase==="intereses"||m.clase==="gastos_financiacion","clase ajena al pago de inversión");no(pago.pagador===persona&&pago.fecha===m.fecha&&pago.factura===m.documento.referencia&&pago.receptor===(m.clase==="precio"?a.vendedor:l?.acreedor)&&pago.medio!=="efectivo"&&pago.subvencion==="0"&&pago.especieExenta==="0"&&pago.concepto===({precio:"adquisicion",amortizacion:"amortizacion",intereses:"intereses",gastos_financiacion:"gastos"} as const)[m.clase],"pago no vinculado a documento/concepto/receptor");igual(euros(pago.importe),euros(m.importe),"pago contradictorio");return pago})
 const inicial=suma(p.cuentas.map(x=>euros(x.inicio.importe)))
 const brutoFinal=menos(mas(suma(p.cuentas.map(x=>euros(x.cierre.importe))),valorCierre),principal)
 const variacion=menos(valorCierre,precio),isd=mas(total("donacion"),total("herencia"))
 const final=menos(menos(brutoFinal,variacion),isd)
 const inversion=mas(menos(precio,dispuesto),amortizado)
 return {inicial,final,inversion,pagos,financiacionAdquisicion:{inmueble:a.inmueble,dispuesto},rastro:[paso(a.inmueble,"P5a activo de cierre menos principal vivo",brutoFinal,principal),paso(a.inmueble,"P5a variación de valoración excluida (cierre menos precio)",valorCierre,variacion),paso(persona,"P5a incremento ISD monetario excluido",isd,final),paso(persona,"P5a incremento comparable e inversión propia sin intereses ni gastos de financiación",menos(final,inicial),inversion)],historia:{inversionAnteriorDeducida:"0",gananciaExentaReinversion:"0",inversionNuevaAcumuladaAntes2025:"0"},traza:{persona,inmueble:a.inmueble,patrimonioInicial:serial(inicial),patrimonioFinalBruto:serial(brutoFinal),variacionExcluida:serial(variacion),isdExcluido:serial(isd),principalVivo:serial(principal),incrementoComparable:serial(menos(final,inicial)),inversionSinFinanciacion:serial(inversion)}}
}
