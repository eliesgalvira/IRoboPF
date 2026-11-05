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
