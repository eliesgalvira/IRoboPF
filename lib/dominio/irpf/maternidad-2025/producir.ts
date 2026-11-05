import Decimal from "decimal.js"
import { Result, Schema } from "effect"
import type { CasoFiscalAnual } from "../caso-fiscal-anual"
import { HechosMaternidad2025 } from "./contrato"
import { menor, racional, restar, sumar, type Racional } from "../deducciones/anual-territorial-racional"

export type Ambito81 = Pick<CasoFiscalAnual, "anio" | "contribuyenteId" | "fechaFallecimiento" | "situacionFamiliar" | "derechosMinimos">
type Hijo81 = HechosMaternidad2025["hijos"][number]
type Centro81 = Hijo81["centros"][number]
type Pago81 = Hijo81["facturas"][number]["pagos"][number]
type Mes81 = { readonly mes: number; readonly maternidad: boolean; readonly guarderia: boolean; readonly contratoCompleto: boolean; readonly motivo: string }
export interface HijoProducido81 {
  readonly hijo: string
  readonly beneficiaria: string
  readonly meses: readonly Mes81[]
  readonly maternidad: Racional
  readonly incremento: Racional
  readonly gastoNeto: Racional
  readonly anticipos: Racional
  readonly gastoCompletoRegional: Racional
  readonly ayudasRegionales: Racional
  readonly pagosRegionales: readonly Pago81[]
  readonly hechos: Hijo81
}
export interface LibroMaternidad81 {
  readonly ejercicio: 2025
  readonly composicion: "anual_81_unica"
  readonly beneficiaria: string
  readonly hijos: readonly HijoProducido81[]
  readonly maternidad: Racional
  readonly incremento: Racional
  readonly anticipos: Racional
  readonly aceptacionFiscal: "pendiente"
}

export function exigir81(b: boolean, motivo: string): asserts b { if (!b) throw new RangeError("Art81: " + motivo) }
function diasMes(anio: number, mes: number): number {
  if (mes === 2) return anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0) ? 29 : 28
  return [4, 6, 9, 11].includes(mes) ? 30 : 31
}
export function fecha81(s: string): string {
  exigir81(/^\d{4}-\d{2}-\d{2}$/.test(s), "fecha inválida: " + s)
  const [a,m,d] = s.split("-").map(Number)
  exigir81(a >= 1900 && a <= 2200 && m >= 1 && m <= 12 && d >= 1 && d <= diasMes(a,m), "fecha inexistente: " + s)
  return s
}
function intervalo(desde: string, hasta: string): void { exigir81(fecha81(desde) <= fecha81(hasta), "intervalo invertido") }
function centimos(s: string): bigint {
  exigir81(/^(0|[1-9]\d{0,11})(\.\d{1,2})?$/.test(s), "importe de hecho inválido")
  const [a,b=""] = s.split("."); return BigInt(a)*100n + BigInt(b.padEnd(2,"0"))
}
function euros(n: bigint): Racional { return racional(String(n),"100") }
function total(xs: readonly Racional[]): Racional { return xs.reduce(sumar,racional("0")) }
function finMes(m: number): string { return `2025-${String(m).padStart(2,"0")}-${diasMes(2025,m)}` }
function inicioMes(m: number): string { return `2025-${String(m).padStart(2,"0")}-01` }
function autorizado(c: Centro81, desde: string, hasta: string): boolean {
  const a=c.autorizacion
  return a.desde <= desde && a.hasta >= hasta && (c.clase === "guarderia" ? a.clase === "apertura_funcionamiento_municipal" : a.clase === "educativa")
}

/** Invocado una vez, después de la conciliación efectiva del mínimo en la composición común. */
export function producirMaternidad81(entrada: HechosMaternidad2025, ambito: Ambito81, sujetosConMinimo: readonly string[]): LibroMaternidad81 {
  const parsed=Schema.decodeUnknownResult(HechosMaternidad2025)(entrada,{onExcessProperty:"error"})
  exigir81(Result.isSuccess(parsed),"contrato incompleto, desconocido o contiene magnitudes fiscales externas: "+(Result.isFailure(parsed)?String(parsed.failure):""))
  const h=parsed.success
  exigir81(ambito.anio===2025 && ambito.fechaFallecimiento===undefined && ambito.situacionFamiliar.tipo==="individual", "sólo residente individual2025 sin fallecimiento")
  exigir81(ambito.contribuyenteId===h.beneficiaria,"beneficiaria distinta del contribuyente")
  intervalo(h.residencia.desde,h.residencia.hasta)
  exigir81(h.residencia.pais==="ES" && h.residencia.desde<="2025-01-01" && h.residencia.hasta>="2025-12-31","residencia parcial/exterior fuera de esta rama")
  const derechos=ambito.derechosMinimos
  exigir81(derechos!==undefined && derechos.contribuyenteId===h.beneficiaria && derechos.ejercicio===2025,"falta mínimo nominal conciliado")
  exigir81(!derechos.descendientes.some(p=>p.titulares.some(t=>t.titularId===h.beneficiaria && t.vinculo.clase!=="consanguinidad")),"censo con adopción/acogimiento: determinar primero sus períodos81, no omitirlos")
  const ids=new Set<string>()
  function unico(id: string): void { exigir81(!ids.has(id),"identificador duplicado de operación/niño: "+id);ids.add(id) }
  const candidatos=derechos.descendientes.filter(p=>p.fechaNacimiento>="2022-01-01" && p.titulares.some(t=>t.titularId===h.beneficiaria && t.grado===1 && t.vinculo.clase==="consanguinidad"))
  exigir81(candidatos.length===h.hijos.length && candidatos.every(p=>h.hijos.some(x=>x.id===p.sujetoId)),"censo de hijos biológicos potenciales81 no exhaustivo")
  const hijos=h.hijos.map((n): HijoProducido81=>{
    unico(n.id);fecha81(n.nacimiento)
    exigir81(n.id!==h.beneficiaria,"nadie es su propio hijo")
    exigir81(n.filiacion==="biologica","adopción/acogimiento y otros vínculos pendientes")
    exigir81(n.convivencia==="estable_2025","custodia especial/cambio de beneficiaria no modelado")
    const p=derechos.descendientes.find(p=>p.sujetoId===n.id)
    exigir81(p!==undefined && p.fechaNacimiento===n.nacimiento && sujetosConMinimo.includes(n.id),"nacimiento o mínimo del niño no conciliado")
    const titular=p.titulares.find(t=>t.titularId===h.beneficiaria)
    exigir81(titular!==undefined && titular.grado===1 && titular.vinculo.clase==="consanguinidad" && titular.relacion==="convivencia" && titular.residenteIrpf && titular.custodia==="no-procede","vínculo, residencia o custodia fuera de primera rama")
    const padres=n.progenitores.map(p=>p.id)
    exigir81(new Set(padres).size===padres.length && !padres.includes(n.id),"identidades de progenitores duplicadas o iguales al niño")
    exigir81(!padres.some(id=>h.hijos.some(h=>h.id===id)),"un hijo del censo no puede figurar como progenitor de otro")
    exigir81(n.progenitores.length>=1 && n.progenitores.length<=2 && n.progenitores.filter(p=>p.papel==="madre_biologica").length===1 && n.progenitores.every(p=>p.papel!=="otro"),"otra titularidad81 necesita cálculo nominal; no asumir cero")
    const madre=n.progenitores.find(p=>p.id===h.beneficiaria && p.papel==="madre_biologica")
    exigir81(madre!==undefined,"beneficiaria no es madre biológica del censo")
    exigir81(p.titulares.every(t=>t.grado!==1 || padres.includes(t.titularId)),"progenitor del mínimo ausente del censo81")
    for(const padre of n.progenitores){
      for(const alta of padre.altas)intervalo(alta.desde,alta.hasta)
      for(const actividad of padre.actividades)intervalo(actividad.desde,actividad.hasta)
    }
    exigir81(madre.altas.some(a=>a.desde<=n.nacimiento && a.hasta>=n.nacimiento),"alta posterior o prestación al nacimiento pendiente de rama distinta")
    exigir81(n.antecedenteInfancia2022==="sin_cobros_2022","excepción transitoria maternidad/complemento2022 necesita historia nominal")
    const centros=new Map(n.centros.map(c=>[c.id,c]))
    exigir81(centros.size===n.centros.length,"centro duplicado")
    for(const c of n.centros){intervalo(c.autorizacion.desde,c.autorizacion.hasta);if(c.registroCyl.estado==="inscrito")intervalo(c.registroCyl.desde,c.registroCyl.hasta)}
    exigir81(n.calendario.length===12 && new Set(n.calendario.map(m=>m.mes)).size===12,"calendario debe contener los doce meses sin duplicados")
    const completos=new Set<number>(),bloqueados=new Set<number>()
    for(const mes of n.calendario){
      for(const cobro of mes.complementoInfancia){
        unico(cobro.id);exigir81(centimos(cobro.importe)>0n,"complemento sin cobro positivo identificado")
        exigir81(padres.includes(cobro.perceptor),"complemento de perceptor ajeno al niño")
        exigir81(fecha81(cobro.fechaCobro)>=inicioMes(mes.mes) && cobro.fechaCobro<=finMes(mes.mes),"complemento no corresponde al mes")
        exigir81(cobro.fechaCobro>=n.nacimiento,"complemento atribuido al niño antes de su nacimiento")
        bloqueados.add(mes.mes)
      }
      for(const contrato of mes.contratos){
        intervalo(contrato.desde,contrato.hasta)
        exigir81(contrato.desde>=inicioMes(mes.mes) && contrato.hasta<=finMes(mes.mes) && contrato.desde>=n.nacimiento,"contrato fuera del mes o anterior al nacimiento")
        const centro=centros.get(contrato.centro)
        exigir81(centro!==undefined && autorizado(centro,contrato.desde,contrato.hasta),"centro/autorización no válido para el período; no certificar referencia")
        if(contrato.desde===inicioMes(mes.mes) && contrato.hasta===finMes(mes.mes))completos.add(mes.mes)
      }
      exigir81(new Set(mes.contratos.map(c=>c.centro)).size===mes.contratos.length,"contrato duplicado en mes/centro")
      exigir81(mes.contratos.length<=1,"cambio entre centros dentro del mes requiere unión de períodos; no inferir mes completo")
    }
    const porFactura=new Map<string,bigint>(),exentas=new Map<string,bigint>(),subvenciones=new Map<string,bigint>()
    const regionales=new Map<string,bigint>()
    for(const f of n.facturas){
      unico(f.id)
      exigir81(centros.has(f.centro) && n.calendario.some(m=>m.mes===f.mes && m.contratos.some(c=>c.centro===f.centro)),"factura sin centro/contrato nominal del mes")
      const familiar=f.pagos.reduce((s,p)=>{
        unico(p.id);exigir81(padres.includes(p.pagador),"pagador sin vínculo parental nominal")
        exigir81(fecha81(p.fecha)>="2025-01-01" && p.fecha<="2025-12-31","pagos fuera2025: imputación temporal no modelada")
        exigir81(p.fecha>=n.nacimiento,"pago anterior al nacimiento fuera de esta rama")
        return s+centimos(p.importe)
      },0n)
      const exento=f.pagosEmpresa.reduce((s,e)=>{
        unico(e.id)
        exigir81(e.forma==="contratacion_directa_custodia","reembolso en dinero u otra especie requiere clasificación propia; no presumir exención")
        exigir81(fecha81(e.fecha)>="2025-01-01" && e.fecha<="2025-12-31" && e.fecha>=n.nacimiento,"pago empresarial fuera2025 o anterior al nacimiento: imputación pendiente")
        const empleado=n.progenitores.find(p=>p.id===e.empleado)
        exigir81(empleado!==undefined && empleado.actividades.some(a=>a.clase==="cuenta_ajena" && a.empresa===e.empresa && a.desde<=e.fecha && a.hasta>=e.fecha),"servicio empresarial sin empleado/empleador nominal conciliado")
        return s+centimos(e.importe)
      },0n)
      const bruto=familiar+exento
      porFactura.set(f.id,bruto);exentas.set(f.id,exento)
    }
    for(const ayuda of n.ayudas){
      unico(ayuda.id);fecha81(ayuda.fechaCobro)
      exigir81(ayuda.fechaCobro>="2025-01-01" && ayuda.fechaCobro<="2025-12-31","ayuda con imputación temporal pendiente")
      exigir81(ayuda.atribucion==="nominal" && padres.includes(ayuda.beneficiario),"ayuda compartida sin atribución nominal; no suponer cero")
      exigir81(new Set(ayuda.facturas.map(f=>f.id)).size===ayuda.facturas.length,"imputación de ayuda duplicada")
      exigir81(ayuda.facturas.reduce((s,f)=>s+centimos(f.importe),0n)===centimos(ayuda.importe),"ayuda sin atribución exhaustiva a facturas")
      for(const f of ayuda.facturas){
        exigir81(porFactura.has(f.id),"ayuda atribuida a factura ajena")
        subvenciones.set(f.id,(subvenciones.get(f.id)??0n)+centimos(f.importe))
        if(ayuda.programa!=="bono_concilia" && ayuda.programa!=="reduccion_jornada_FAM1454")regionales.set(f.id,(regionales.get(f.id)??0n)+centimos(f.importe))
      }
    }
    let gasto=0n,gastoCompleto=0n,ayudasRegional=0n
    const pagosRegionales: Pago81[]=[],mesesPagados=new Set<number>()
    for(const f of n.facturas){
      const bruto=porFactura.get(f.id)??0n,exento=exentas.get(f.id)??0n,ayuda=subvenciones.get(f.id)??0n
      exigir81(exento+ayuda<=bruto,"ayudas más especie exenta exceden gasto; conciliación pendiente")
      gasto+=bruto-exento-ayuda
      if(bruto>exento)mesesPagados.add(f.mes)
      if(completos.has(f.mes)){gastoCompleto+=bruto-exento;ayudasRegional+=regionales.get(f.id)??0n;pagosRegionales.push(...f.pagos)}
    }
    const nacimientoMes=n.nacimiento.slice(0,7),cumple3=Number(n.nacimiento.slice(0,4))+3
    const cumpleMes=`${cumple3}-${n.nacimiento.slice(5,7)}`
    let inicioSegundoCiclo=0
    if(cumple3===2025){
      exigir81(n.segundoCiclo.calendario==="ordinario_septiembre2025","falta calendario de segundo ciclo del año en que cumple3")
      exigir81(fecha81(n.segundoCiclo.inicio).startsWith("2025-09-"),"calendario escolar distinto: rama pendiente")
      inicioSegundoCiclo=9
    }else exigir81(n.segundoCiclo.calendario==="no_cumple3_2025","calendario escolar contradice nacimiento")
    const meses=n.calendario.map((m): Mes81=>{
      const mes=inicioMes(m.mes).slice(0,7),sinComplemento=!bloqueados.has(m.mes)
      const maternidad=mes>=nacimientoMes && mes<cumpleMes && sinComplemento
      const edadGuarderia=mes>=nacimientoMes && (mes<cumpleMes || (cumple3===2025 && m.mes<inicioSegundoCiclo))
      const guarderia=edadGuarderia && sinComplemento && completos.has(m.mes) && mesesPagados.has(m.mes)
      return {mes:m.mes,maternidad,guarderia,contratoCompleto:completos.has(m.mes),motivo:!sinComplemento?"complemento_infancia":maternidad?"menor3_alta_nacimiento":edadGuarderia?"extension_guarderia_antes_segundo_ciclo":"fuera_calendario81"}
    }).sort((a,b)=>a.mes-b.mes)
    const maternidad=racional(String(100*meses.filter(m=>m.maternidad).length))
    const incremento=menor(racional(String(1000*meses.filter(m=>m.guarderia).length),"12"),euros(gasto))
    const anticipos=n.anticipos140.reduce((s,a)=>{
      unico(a.id);exigir81(a.beneficiaria===h.beneficiaria,"anticipo de otra beneficiaria")
      exigir81(fecha81(a.fechaCobro)>="2025-01-01" && a.fechaCobro<="2025-12-31" && fecha81(a.periodo)>="2025-01-01" && a.periodo<="2025-12-31","regularización de anticipos de otro ejercicio pendiente")
      exigir81(a.fechaCobro>=n.nacimiento && a.periodo.slice(0,7)>=n.nacimiento.slice(0,7),"anticipo anterior al nacimiento requiere conciliación nominal propia")
      return s+centimos(a.importe)
    },0n)
    return {hijo:n.id,beneficiaria:h.beneficiaria,meses,maternidad,incremento,gastoNeto:euros(gasto),anticipos:euros(anticipos),gastoCompletoRegional:euros(gastoCompleto),ayudasRegionales:euros(ayudasRegional),pagosRegionales,hechos:n}
  })
  return {ejercicio:2025,composicion:"anual_81_unica",beneficiaria:h.beneficiaria,hijos,maternidad:total(hijos.map(h=>h.maternidad)),incremento:total(hijos.map(h=>h.incremento)),anticipos:total(hijos.map(h=>h.anticipos)),aceptacionFiscal:"pendiente"}
}

/** Único ajuste diferencial; no usa cuota autonómica ni aplica un segundo libro de cuota. */
export function aplicarArt81AlDiferencial(previoEuros: Decimal, libro: LibroMaternidad81 | undefined): Decimal {
  if(libro===undefined)return previoEuros
  const exacto=sumar(restar(restar(racional(previoEuros.toFixed()),libro.maternidad),libro.incremento),libro.anticipos)
  const D=Decimal.clone({precision:200})
  return new D(exacto.numeradorEuros).div(exacto.divisor)
}
