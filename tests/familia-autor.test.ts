import { sinDiscapacidad } from "../lib/dominio/irpf/caso-fiscal-anual"
import { it, expect } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import { producirBasesFamiliares2025 as producir, sumaBasesPersonas2025 as sumar, baseTrabajoMiembro2025, type CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { aplicarDosDescendientesAnual2025 as aplicar } from "../lib/dominio/irpf/bases-familiares-2025/valencia"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
const D = Decimal.clone({ precision: 80 })
const propia = { general: new D(20000), ahorro: new D(0) }
type Mutable<T> = { -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K] }
function censo(): Mutable<CensoBasesFamiliares2025> {
 return { referencia:"censo-sintetico", ejercicio:2025, devengo:"2025-12-31", contribuyente:"s-1", estadoCivil:"sin-vinculo", censoCompleto:true, hijosCompletos:true,
 hijos:["s-3","s-4"].map(id => ({id, nacimiento:"2017-01-01", progenitores:["s-1","s-2"], conviveCon:["s-1","s-2"], independienteConConsentimiento:false, apoyoJudicial:"ninguno", soporte:"filiacion"})),
 personas:["s-1","s-2","s-3","s-4"].map(id => ({id, soporte:"censo", residenteComunTodo2025:true, vivoTodo2025:true, economia:id === "s-1" ? {perfil:"declarante-en-composicion"} : {perfil:"sin-rentas", censoRentasCompleto:true}})) }
}
const ambito = { anio:2025, contribuyenteId:"s-1", comunidadAutonoma:"comunitat-valenciana" } as const
const ats = ["s-3","s-4"].map(sujetoId => ({ sujetoId, titulares:["s-1","s-2"] }))
const codigo="valenciana_dos_o_mas_descendientes"
const solicitud = () => ({ejercicio:2025, territorio:"comunitat-valenciana", modalidad:"individual", devengo:"2025-12-31", contribuyente:"s-1", cantidades:[], solicitudes:[{codigo,eleccion:"aplicar",unidades:[{id:"u",titulares:["s-1"],fecha:"2025-12-31",numeros:{},textos:{}}], referencias:[{unidad:"u",sujetos:["s-3","s-4"],bienes:[],eventos:[],cantidades:[]}]}], ordenBase30:[],consignaciones:[],arrastres:[],ordenConsumo:[JSON.stringify([codigo,2025,"s-1"])], criterioOrden:"eleccion_experta"} as const)
it("art82: pareja no casada no agrega otro progenitor; sí hijos menores",()=>{
 const l=producir(censo(),ambito,propia);expect(l.miembrosUnidad).toEqual(["s-1","s-3","s-4"]);expect(sumar(l,l.miembrosUnidad).toFixed()).toBe("20000");expect(sumar(l,["s-2"]).toFixed()).toBe("0")
})
it("conyugal agrega cónyuge y nunca duplica hijos",()=>{const c={...censo(),estadoCivil:"casado-no-separado",conyuge:"s-2"} as const;expect(producir(c,ambito,propia).miembrosUnidad).toEqual(["s-1","s-2","s-3","s-4"])})
it("mayor ordinario e independiente no forman unidad aunque sigan en el censo",()=>{const c=censo();c.hijos[0]!.nacimiento="2007-12-31";c.hijos[1]!.independienteConConsentimiento=true;expect(producir(c,ambito,propia).miembrosUnidad).toEqual(["s-1"])})
it("núcleo art19/art20: 30000-1944-2000=26056, no bruto ni renta de mínimos",()=>{if(efectivo.perfil!=="solo-trabajo")throw Error();expect(baseTrabajoMiembro2025(efectivo.trabajo,false).general.toFixed()).toBe("26056")})
it.each(["2025-02-30","2026-01-01","sin-fecha"])("rechaza nacimiento inválido %s",n=>{const c=censo();c.hijos[0]!.nacimiento=n;expect(()=>producir(c,ambito,propia)).toThrow(/nacimiento/)})
it("no recibe bases externas ni trata ausencia de economía como cero",()=>{/* SAFETY: magnitud fiscal externa intencional para probar su rechazo; jamás se calcula con esta entrada. */
expect(()=>producir({...censo(),baseGeneral:"0"} as never,ambito,propia)).toThrow(/externas/);const c=censo();const incompleto={...c,personas:c.personas.map((p,i)=>i===1?{...p,economia:undefined}:p)};
/* SAFETY: entrada intencionalmente incompleta para probar el rechazo del Schema; no es una base fiscal. */
expect(()=>producir(incompleto as never,ambito,propia)).toThrow()})
it("rechaza duplicados, identidad, año, apoyo pendiente y auto parentesco",()=>{
 const c=censo();expect(()=>producir({...c,personas:[...c.personas,c.personas[0]!]},ambito,propia)).toThrow(/duplicado/)
 expect(()=>producir(c,{...ambito,contribuyenteId:"s-9"},propia)).toThrow(/identidad/)
 /* SAFETY: ejercicio corrupto intencional para probar la validación de frontera. */
 expect(()=>producir({...c,ejercicio:2024} as never,ambito,propia)).toThrow()
 c.hijos[0]!.apoyoJudicial="pendiente";expect(()=>producir(c,ambito,propia)).toThrow(/resolución/)
 c.hijos[0]!.apoyoJudicial="ninguno";c.hijos[0]!.progenitores=["s-3"];expect(()=>producir(c,ambito,propia)).toThrow(/filiación/)
})
it("agregación única rechaza ausentes y repetidos",()=>{const l=producir(censo(),ambito,propia);expect(()=>sumar(l,["s-1","s-1"])).toThrow();expect(()=>sumar(l,["s-99"])).toThrow(/económicos/)})
it.each([["30000","12.34567890123456789012345678901234567890123456789"],["30000.0000000000000000000000000000000000000001","0"]])("Valencia límite inclusivo80 %s",(general,expected)=>{
 const l=producir(censo(),ambito,{general:new D(general),ahorro:new D(0)})
 expect(aplicar(solicitud(),l,ats,new D("123.4567890123456789012345678901234567890123456789")).totalAplicado).toBe(expected)
})
it("Valencia suma otro titular del mínimo fuera unidad; cero no usa cuota externa",()=>{
 const l=producir(censo(),ambito,propia);const bases=new Map(l.bases);bases.set("s-2",{general:new D(10001),ahorro:new D(0)})
 expect(aplicar(solicitud(),{...l,bases},ats,new D(1000)).totalAplicado).toBe("0")
 expect(aplicar(solicitud(),l,ats,new D(0)).totalAplicado).toBe("0")
})
it("rechaza unidad numérica tributaria y concurrencia concreta",()=>{const l=producir(censo(),ambito,propia),s=solicitud();expect(()=>aplicar({...s,solicitudes:[{...s.solicitudes[0],unidades:[{...s.solicitudes[0].unidades[0],numeros:{cuotaIntegraAutonomica:900}}]}]},l,ats,new D(1000))).toThrow(/consignadas/);expect(()=>aplicar({...s,cantidades:[{id:"x",euros:1}]},l,ats,new D(1000))).toThrow(/minoraciones/)})
function familia(territorio:"madrid"|"comunitat-valenciana") {
 const ds=["s-3","s-4"].map(sujetoId=>({...derechos.descendientes[0]!,sujetoId,titulares:derechos.descendientes[0]!.titulares.map(t=>({...t,rentasNoExentasCentimos:t.titularId==="s-1"?2605600:0}))}))
 return {...derechos,territorio,descendientes:ds}
}
it("ambas API: censo ajeno no cambia base/cuota ni mínimos una segunda vez",()=>{
 const d=familia("madrid"),c=censo()
 const a={...analitico,contribuyenteId:"s-1",derechosMinimos:d}
 const e={...efectivo,contribuyenteId:"s-1",derechosMinimos:d,familiaresConDerechoMinimo:"segun-derechos"} as const
 const ra=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),rb=Effect.runSync(liquidarIrpfAnual({...a,basesFamiliares2025:c},{modo:"canonico"}))
 expect(rb.cuotaLiquidaCentimos).toBe(ra.cuotaLiquidaCentimos)
 const re=Effect.runSync(liquidarIrpfAnualExplicito(e)),rf=Effect.runSync(liquidarIrpfAnualExplicito({...e,basesFamiliares2025:c}))
 expect(rf.baseLiquidableGeneral).toBe(re.baseLiquidableGeneral);expect(rf.cuotaLiquidaLegal).toBe(re.cuotaLiquidaLegal)
})
it("ambas API Valencia consumen 10% de cuota propia una vez; oráculo racional 9/10",()=>{
 const d=familia("comunitat-valenciana"),c=censo()
 const a={...analitico,comunidadAutonoma:"comunitat-valenciana",contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c} as const
 const antes=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"}))
 const despues=Effect.runSync(liquidarIrpfAnual({...a,deduccionesValencianas2025:solicitud()},{modo:"canonico"}))
 expect(despues.deduccionesValencianas2025?.movimientos).toHaveLength(1)
 const mv=despues.deduccionesValencianas2025!.movimientos[0]!
 expect(new D(mv.aplicado).times(9).eq(despues.deduccionesValencianas2025!.cuotaRestante!)).toBe(true)
 expect(despues.cuotaLiquidaCentimos).toBeLessThan(antes.cuotaLiquidaCentimos)
 const e={...efectivo,comunidadAutonoma:"comunitat-valenciana",contribuyenteId:"s-1",derechosMinimos:d,familiaresConDerechoMinimo:"segun-derechos",basesFamiliares2025:c,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()} as const
 const re=Effect.runSync(liquidarIrpfAnualExplicito(e));expect(re.baseLiquidableGeneral).toBe("26056")
})
import { consumirCuotaAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual-cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import { evaluarAnualF2025 } from "../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/anual"
it.each([["92790","calculo_parcial"],["92790.0000000000000000000000000000000000000001","excluida"]])("Madrid art18.2 límite inclusivo por tres miembros %s",(g,estado)=>{
 const caso={...ambito,comunidadAutonoma:"madrid",situacionFamiliar:analitico.situacionFamiliar} as const
 const libro=producir(censo(),caso,{general:new D(g),ahorro:new D(0)})
 const r=evaluarAnualF2025({lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{titulo:{categoria:"general",referencia:"titulo",efectos:"2025-01-01",titulares:["s-1"]}}}, {caso,libroBasesFamiliares2025:libro,baseGeneral:new D(g),baseAhorro:new D(0),minimoPersonalFamiliar:new D(5550),cuotaAutonomica:new D(100),sujetosConMinimo:[]})
 // La evaluación de hechos entrega dependenciaAnual; la cuota única es quien la resuelve.
 const aplicada=consumirCuotaAnualF2025(racional("100"),["madrid_condicion_familia_numerosa"],[r])
 expect(aplicada.total).toEqual(racional(estado==="calculo_parcial"?"50":"0"))
 expect(aplicada.aplicaciones[0]!.estado).toBe(estado==="calculo_parcial"?"aplicada":"excluida")
})
it("economía ajena deriva BIG26056; jamás sustituye la del declarante",()=>{
 if(efectivo.perfil!=="solo-trabajo")throw Error()
 const c=censo();c.personas[1]!.economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:{...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r}))}}
 const l=producir(c,ambito,propia);expect(l.bases.get("s-2")!.general.toFixed()).toBe("26056");expect(l.bases.get("s-1")!.general.toFixed()).toBe("20000")
})
it("ambas API Madrid: familia numerosa conectada al libro y a su única cuota",()=>{
 const d=familia("madrid"),c=censo()
 const solicitudF={solicitudes:[{lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{titulo:{categoria:"general",referencia:"titulo",efectos:"2025-01-01",titulares:["s-1"]}}}]} as const
 const a={...analitico,contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c}
 const antes=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"}))
 const despues=Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:solicitudF},{modo:"canonico"}))
 expect(despues.cuotaLiquidaCentimos).toBeLessThan(antes.cuotaLiquidaCentimos)
 const e={...efectivo,contribuyenteId:"s-1",derechosMinimos:d,familiaresConDerechoMinimo:"segun-derechos",basesFamiliares2025:c,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:solicitudF} as const
 const r=Effect.runSync(liquidarIrpfAnualExplicito(e));expect(r.baseLiquidableGeneral).toBe("26056")
})

it("activación runtime del contrato de caso fiscal congelado",()=>{ expect(sinDiscapacidad).toEqual({_tag:"SinDiscapacidad"}) })

// H2: el grado durante el trabajo puede diferir del grado al devengo. El libro
// familiar todavía no tiene periodos con los que conciliar esos hechos.
function familiarConTrabajoActivo(territorio: "madrid" | "comunitat-valenciana", discapacidad: typeof derechos.descendientes[number]["discapacidad"]) {
 if (efectivo.perfil !== "solo-trabajo") throw Error("fixture laboral")
 const c = censo()
 c.estadoCivil = "casado-no-separado"; c.conyuge = "s-2"
 c.hijos[0]!.nacimiento = "2005-06-11"; c.hijos[1]!.nacimiento = "2024-02-17"
 const trabajo = {...efectivo.trabajo, discapacidadActiva: {grado:"65-o-mas",ayudaOMovilidadReducida:"no",acreditadaDuranteTodoElTrabajo:"si"} as const,
  rendimientos: efectivo.trabajo.rendimientos.map(r => ({...r,integro:"17000",cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}
 c.personas[2]!.economia = {perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:{...trabajo,rendimientos:[...trabajo.rendimientos]}}
 const d = {...familia(territorio),descendientes: familia(territorio).descendientes.map((s,i) => ({...s,
  fechaNacimiento:c.hijos[i]!.nacimiento, edadDevengo:i===0?20:1,
  rentasNoExentasCentimos:i===0?725000:0, discapacidad:i===0?discapacidad:sinDiscapacidad,
  titulares:s.titulares.map(t=>({...t,rentasNoExentasCentimos:t.titularId==="s-1"?2044480:0}))}))}
 const a = {...analitico,comunidadAutonoma:territorio,contribuyenteId:"s-1",rendimientos:{trabajo:[{importeIntegroCentimos:2400000}]},derechosMinimos:d,basesFamiliares2025:c} as const
 const e = {...efectivo,comunidadAutonoma:territorio,contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c,familiaresConDerechoMinimo:"segun-derechos",
  trabajo:{...efectivo.trabajo,rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,integro:"24000",cotizaciones:{...r.cotizaciones,seguridadSocial:"1555.20"}}))}} as const
 const personas=d.descendientes.map(s=>({id:s.sujetoId,nacimiento:s.fechaNacimiento,relacion:"hijo",rentasNoExentasEUR:new D(s.rentasNoExentasCentimos).div(100).toFixed(),declaracionTipo:"no_presentada",
  discapacidadPorcentaje:s.discapacidad._tag==="Discapacidad65OMas"?"65":s.discapacidad._tag==="Discapacidad33a64"?"33":"0",certificadoDiscapacidad:"H2-discapacidad",situacionDevengo:"vivo",certificadoParentesco:"H2-filiacion",alimentos64175:"no",
  progenitores:["s-1","s-2"],titularesMinimo:["s-1","s-2"],titularesDeduccion:["s-1","s-2"],gradoMasCercanoConPrioridad:[],convivencia:[{desde:"2025-01-01",hasta:"2025-12-31"}],declarantesConDerechoReferencia:"H2-derechos"}))
 const f={solicitudes:[{lote:"F-ampliado",codigo:"madrid_familias_dos_descendientes_ingresos_reducidos",hechos:{personas,titularesConMismoMinimo:["s-1","s-2"]}}]} as const
 return {a,e,c,d,f,trabajo}
}
function rechazaH2<A, E>(calculo: Effect.Effect<A, E>) {
 const resultado = Effect.runSync(Effect.result(calculo))
 expect.soft(resultado).toMatchObject({_tag:"Failure",failure:{motivo:expect.stringContaining("discapacidad activa ajena")}})
}
const gradosH2 = [sinDiscapacidad,{_tag:"Discapacidad33a64",necesitaAyudaOMovilidadReducida:false},{_tag:"Discapacidad65OMas"}] as const
for (const territorio of ["madrid","comunitat-valenciana"] as const) {
 for (const grado of gradosH2) {
  it(`H2 ${territorio} ${grado._tag}: ambas API requieren periodos de discapacidad ajena`,()=>{
   const {a,e,f}=familiarConTrabajoActivo(territorio,grado)
   // La preimagen admitía los ocho casos con grados distintos; también se
   // delimita el caso de grado igual, sin convertir esta reserva en renta cero.
   if(territorio==="madrid") {
    rechazaH2(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:f},{modo:"canonico"}))
    rechazaH2(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:f}))
   } else {
    rechazaH2(liquidarIrpfAnual({...a,deduccionesValencianas2025:solicitud()},{modo:"canonico"}))
    rechazaH2(liquidarIrpfAnualExplicito({...e,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()}))
   }
  })
 }
}
it("H2 limita el libro familiar y conserva el núcleo económico usado por Andalucía",()=>{
 const {trabajo,c,d}=familiarConTrabajoActivo("madrid",sinDiscapacidad)
 const b=baseTrabajoMiembro2025(trabajo,true)
 expect(b.general.toFixed()).toBe("3707");expect(b.rentaAntesReducciones!.toFixed()).toBe("7250")
 // Mismo neto sin gasto por discapacidad: positivo ordinario de control.
 c.personas[2]!.economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:{...trabajo,discapacidadActiva:"ninguna",rendimientos:trabajo.rendimientos.map(r=>({...r,integro:"9250"}))}}
 expect(producir(c,{...ambito,comunidadAutonoma:"madrid",derechosMinimos:d}, {general:new D("20444.8"),ahorro:new D(0)}).bases.get("s-3")!.rentaAntesReducciones!.toFixed()).toBe("7250")
})

// T07: los H2 anteriores se conservan sin modificar; nuevo calendario suficiente.
import { type CalendarioTrabajo2025, calcularGastosTrabajoCalendario2025 } from "../lib/dominio/irpf/trabajo-anual/calendario-2025"
function importeT07(valor: string | undefined): string {
 if(valor === undefined) throw Error("T07 importe calculado ausente")
 return valor
}
function calendarioT07(parcial = false, grado = 65, ayuda = false, ultimoIngreso = "1000"): Mutable<CalendarioTrabajo2025> {
 return { sujetoId:"s-2",rendimientoId:"pagador-a",empleador:"empleador-unico",soporteRelacionLaboral:"contrato-ordinario",fechaCorteDocumental:"2026-11-06",censoCompleto:true,imputacion:"servicios-ordinarios-2025-sin-atrasos",
 certificados:[{id:"cert-1",sujetoId:"s-2",organismo:"organo-competente-ccaa",emision:"2026-02-01",efectosDesde:parcial?"2025-10-20":"2025-01-01",efectosHasta:"2025-12-31",grado,ayudaOMovilidadReducida:ayuda,soporte:"resolucion-con-efectos-expresos"}],
 tramos:parcial ? [
 {id:"nomina-a",desde:"2025-01-01",hasta:"2025-10-19",soporte:"nominas-a",actividad:"servicios-efectivos",integro:new D(17000).minus(ultimoIngreso).toFixed(),seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},
 {id:"nomina-b",desde:"2025-10-20",hasta:"2025-12-31",soporte:"nominas-b",actividad:"servicios-efectivos",integro:ultimoIngreso,seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},
 ] : [{id:"nomina-anual",desde:"2025-01-01",hasta:"2025-12-31",soporte:"nominas",actividad:"servicios-efectivos",integro:"17000",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"}] }
}
function trabajoT07(parcial = false, grado: "33-a-64" | "65-o-mas" = "65-o-mas", ayuda = false) {
 if(efectivo.perfil !== "solo-trabajo") throw Error("fixture laboral")
 return {...efectivo.trabajo,discapacidadActiva:{grado,ayudaOMovilidadReducida:ayuda?"si":"no",acreditadaDuranteTodoElTrabajo:parcial?"no":"si"} as const,
 rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,integro:"17000",cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}
}
function casosT07(territorio: "madrid" | "comunitat-valenciana", parcial = false) {
 const c=censo(), d=familia(territorio)
 const renta=parcial?1440000:725000
 for(const s of d.descendientes) for(const t of s.titulares) if(t.titularId === "s-2") t.rentasNoExentasCentimos=renta
 c.personas[1]!.economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:trabajoT07(parcial),calendarioTrabajo2025:calendarioT07(parcial)}
 const a={...analitico,comunidadAutonoma:territorio,contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c} as const
 const e={...efectivo,comunidadAutonoma:territorio,contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c,familiaresConDerechoMinimo:"segun-derechos"} as const
 return {a,e,c,d}
}
it.each([
 [false,33,false,"3500","11500","7957"],
 [false,65,false,"7750","7250","3707"],
 [false,33,true,"7750","7250","3707"],
 [true,65,false,"600","14400","10857"],
] as const)("T07 oráculo independiente art19/20 parcial=%s grado=%s ayuda=%s",(parcial,grado,ayuda,gasto,renta,base)=>{
 const t=trabajoT07(parcial,grado>=65?"65-o-mas":"33-a-64",ayuda), cal=calendarioT07(parcial,grado,ayuda)
 const g=calcularGastosTrabajoCalendario2025(t,cal)
 expect(g.discapacidadAplicada).toBe(gasto);expect(g.netoArt19).toBe(renta)
 // El núcleo anual existente aplica art20 una sola vez, previo17000 =>3543.
 const c=censo();c.personas[1]!.economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:t,calendarioTrabajo2025:cal}
 expect(producir(c,ambito,propia).bases.get("s-2")!.general.toFixed()).toBe(base)
})
it("T07 73d con ingresos suficientes conserva7750 íntegros; emisión posterior no mueve efectos",()=>{
 const g=calcularGastosTrabajoCalendario2025(trabajoT07(true),calendarioT07(true,65,false,"9000"))
 expect(g.discapacidadAplicada).toBe("7750");expect(g.netoArt19).toBe("7250")
})
for(const territorio of ["madrid","comunitat-valenciana"] as const) {
 it(`T07 ${territorio}: ambas API calculan y conservan cuota propia sin solicitud regional`,()=>{
  const {a,e}=casosT07(territorio)
  const ra=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})), re=Effect.runSync(liquidarIrpfAnualExplicito(e))
  const {basesFamiliares2025: libroA,...aa}=a
  const {basesFamiliares2025: libroE,...ee}=e
  expect(libroA).toBe(libroE)
  expect(ra.cuotaLiquidaCentimos).toBe(Effect.runSync(liquidarIrpfAnual(aa,{modo:"canonico"})).cuotaLiquidaCentimos)
  expect(re.cuotaLiquidaLegal).toBe(Effect.runSync(liquidarIrpfAnualExplicito(ee)).cuotaLiquidaLegal)
  expect(re.baseLiquidableGeneral).toBe("26056")
 })
 it(`T07 ${territorio}: ambas API usan calendario en consumidor regional`,()=>{
  const {a,e}=casosT07(territorio)
  if(territorio === "comunitat-valenciana") {
   const ra=Effect.runSync(liquidarIrpfAnual({...a,deduccionesValencianas2025:solicitud()},{modo:"canonico"}))
   const re=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()}))
   expect(new D(importeT07(ra.deduccionesValencianas2025!.totalAplicado)).gt(0)).toBe(true)
   expect(new D(importeT07(re.deduccionesValencianas2025!.totalAplicado)).gt(0)).toBe(true)
   const p=casosT07(territorio,true)
   expect(Effect.runSync(liquidarIrpfAnual({...p.a,deduccionesValencianas2025:solicitud()},{modo:"canonico"})).deduccionesValencianas2025!.totalAplicado).toBe("0")
   expect(Effect.runSync(liquidarIrpfAnualExplicito({...p.e,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()})).deduccionesValencianas2025!.totalAplicado).toBe("0")
  } else {
   const f={solicitudes:[{lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{titulo:{categoria:"general",referencia:"titulo",efectos:"2025-01-01",titulares:["s-1"]}}}]} as const
   const antes=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),despues=Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:f},{modo:"canonico"}))
   expect(despues.cuotaLiquidaCentimos).toBeLessThan(antes.cuotaLiquidaCentimos)
   const re=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:f}))
   expect(new D(re.cuotaLiquidaLegal).lt(Effect.runSync(liquidarIrpfAnualExplicito(e)).cuotaLiquidaLegal)).toBe(true)
  }
 })
 for(const causa of ["identidad","laguna","solape","renta-ajena","duplicado","emision","censo"] as const) {
  it(`T07 ${territorio} ambas API rechazan ${causa}`,()=>{
   const {a,e,c}=casosT07(territorio,true)
   const ec=c.personas[1]!.economia
   if(ec.perfil !== "solo-trabajo" || ec.calendarioTrabajo2025 === undefined) throw Error("fixture calendario")
   const cal=ec.calendarioTrabajo2025
   if(causa === "identidad") ec.calendarioTrabajo2025={...cal,sujetoId:"s-99",certificados:cal.certificados.map(s=>({...s,sujetoId:"s-99"}))}
   if(causa === "laguna") ec.calendarioTrabajo2025={...cal,tramos:cal.tramos.map((s,i)=>i===1?{...s,desde:"2025-10-21"}:s)}
   if(causa === "solape") ec.calendarioTrabajo2025={...cal,tramos:cal.tramos.map((s,i)=>i===1?{...s,desde:"2025-10-19"}:s)}
   if(causa === "renta-ajena") ec.calendarioTrabajo2025={...cal,tramos:cal.tramos.map((s,i)=>i===1?{...s,integro:"1000.01"}:s)}
   if(causa === "duplicado") ec.calendarioTrabajo2025={...cal,tramos:cal.tramos.map((s,i)=>i===1?{...s,id:cal.tramos[0]!.id}:s)}
   if(causa === "emision") ec.calendarioTrabajo2025={...cal,certificados:cal.certificados.map(s=>({...s,emision:"2026-11-07"}))}
   if(causa === "censo") ec.calendarioTrabajo2025={...cal,tramos:cal.tramos.map((s,i)=>i===1?{...s,hasta:"2026-01-01"}:s)}
   const motivo={identidad:"identidad calendario",laguna:"laguna/solape",solape:"laguna/solape","renta-ajena":"ingresos/cotizaciones",duplicado:"ingreso/tramo duplicado",emision:"identidad/emisión",censo:"laguna/solape"}[causa]
   const resultadoCanonico=Effect.runSync(Effect.result(liquidarIrpfAnual(a,{modo:"canonico"})))
   const resultadoExplicito=Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))
   expect(resultadoCanonico).toMatchObject({_tag:"Failure",failure:{motivo:expect.stringContaining(motivo)}})
   expect(resultadoExplicito).toMatchObject({_tag:"Failure",failure:{motivo:expect.stringContaining(motivo)}})
  })
 }
}
it.each([["26293","100"],["26293.01","0"]])("T07 frontera familiar valenciana un céntimo %s",(propiaBase,aplicada)=>{
 const {c,d}=casosT07("comunitat-valenciana")
 const libro=producir(c,{...ambito,derechosMinimos:d},{general:new D(propiaBase),ahorro:new D(0)})
 expect(aplicar(solicitud(),libro,ats,new D(1000)).totalAplicado).toBe(aplicada)
})
it("T07 calendario concilia discapacidad al devengo y renta de mínimos; no basta igualdad anual",()=>{
 const {c,d,trabajo}=familiarConTrabajoActivo("madrid",sinDiscapacidad)
 const cal=calendarioT07();cal.sujetoId="s-3";cal.certificados[0]!.sujetoId="s-3"
 c.personas[2]!.economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo,calendarioTrabajo2025:cal}
 expect(()=>producir(c,{...ambito,comunidadAutonoma:"madrid",derechosMinimos:d},propia)).toThrow(/devengo contradice mínimos/)
 d.descendientes[0]!.discapacidad={_tag:"Discapacidad65OMas"}
 expect(producir(c,{...ambito,comunidadAutonoma:"madrid",derechosMinimos:d},propia).bases.get("s-3")!.general.toFixed()).toBe("3707")
 d.descendientes[0]!.rentasNoExentasCentimos=725001
 expect(()=>producir(c,{...ambito,comunidadAutonoma:"madrid",derechosMinimos:d},propia)).toThrow(/renta económica/)
})
for(const territorio of ["madrid","comunitat-valenciana"] as const) for(const centimo of [0,1]) {
 it(`T07 frontera ${territorio} ambas API céntimo=${centimo}`,()=>{
  const {a,e,c,d}=casosT07(territorio)
  const ec=c.personas[1]!.economia
  if(ec.perfil !== "solo-trabajo" || ec.calendarioTrabajo2025 === undefined) throw Error("fixture calendario")
  if(territorio === "madrid") {
   c.estadoCivil="casado-no-separado";c.conyuge="s-2"
   const ingreso=new D("107414").plus(new D(centimo).div(100)).toFixed()
   ec.trabajo.rendimientos[0]!.integro=ingreso
   ec.calendarioTrabajo2025={...ec.calendarioTrabajo2025,tramos:ec.calendarioTrabajo2025.tramos.map((s,i)=>i===0?{...s,integro:ingreso}:s)}
  } else {
   ec.trabajo=trabajoT07(true)
   ec.calendarioTrabajo2025=calendarioT07(true,65,false,new D(7913).minus(new D(centimo).div(100)).toFixed())
  }
  for(const s of d.descendientes) for(const t of s.titulares) if(t.titularId === "s-2") t.rentasNoExentasCentimos=(territorio === "madrid" ? 9766400 : 748700)+centimo
  const aa=a,ee=e
  if(territorio === "comunitat-valenciana") {
   const ra=Effect.runSync(liquidarIrpfAnual({...aa,deduccionesValencianas2025:solicitud()},{modo:"canonico"}))
   const re=Effect.runSync(liquidarIrpfAnualExplicito({...ee,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()}))
   expect(new D(importeT07(ra.deduccionesValencianas2025!.totalAplicado)).gt(0)).toBe(centimo===0)
   expect(new D(importeT07(re.deduccionesValencianas2025!.totalAplicado)).gt(0)).toBe(centimo===0)
  } else {
   const f={solicitudes:[{lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{titulo:{categoria:"general",referencia:"titulo",efectos:"2025-01-01",titulares:["s-1"]}}}]} as const
   const antes=Effect.runSync(liquidarIrpfAnual(aa,{modo:"canonico"})),despues=Effect.runSync(liquidarIrpfAnual({...aa,deduccionesTerritoriales2025:f},{modo:"canonico"}))
   const pre=Effect.runSync(liquidarIrpfAnualExplicito(ee)),post=Effect.runSync(liquidarIrpfAnualExplicito({...ee,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:f}))
   expect(despues.cuotaLiquidaCentimos<antes.cuotaLiquidaCentimos).toBe(centimo===0)
   expect(new D(post.cuotaLiquidaLegal).lt(pre.cuotaLiquidaLegal)).toBe(centimo===0)
  }
 })
}
it("T07 rechaza certificados solapados y empleo+pensión expresamente",()=>{
 const cal=calendarioT07(),t=trabajoT07()
 cal.certificados.push({...cal.certificados[0]!,id:"cert-2",grado:33})
 expect(()=>calcularGastosTrabajoCalendario2025(t,cal)).toThrow(/solapados/)
 const pension={...t,rendimientos:[...t.rendimientos,{...t.rendimientos[0]!,id:"pension",clase:"pension" as const}]}
 expect(()=>calcularGastosTrabajoCalendario2025(pension,calendarioT07())).toThrow(/empleo ordinario/)
})
