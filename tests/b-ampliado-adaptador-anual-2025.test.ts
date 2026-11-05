import { producirNodosFiscalesB2025 } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025/productores"
import { expect,it,describe } from "vitest"
import { Schema,Result } from "effect"
import { prepararBAmpliadoAnual,SolicitudBAmpliadoAnual,type ResultadoAdaptadorB } from "../lib/dominio/irpf/deducciones/b-ampliado-anual-2025"
import { marco,solicitudAdopcion,solicitudCelia,persona,pago,doc,decimal } from "./b-ampliado-anual-fixtures"
function cantidad(r:ResultadoAdaptadorB,n:string,d="1"):void {
 expect(r.estado).toBe("generaciones_preparadas")
 if(r.estado!=="generaciones_preparadas")throw new Error("No genera:"+r.motivo)
 const g=r.generaciones[0];expect(g.estado).toBe("generada")
 if(g.estado==="generada")expect(BigInt(g.generado.numeradorEuros)*BigInt(d)).toBe(BigInt(n)*BigInt(g.generado.divisor))
 expect(r.aplicacionCuota).toBe("libro_comun_pendiente")
}
function rechazo(r:ResultadoAdaptadorB,patron:RegExp):void {
 expect(r.estado).toBe("no_soportado")
 if(r.estado==="no_soportado")expect(r.motivo).toMatch(patron)
 expect(r).not.toHaveProperty("generaciones");expect(r).not.toHaveProperty("importe");expect(r).not.toHaveProperty("generado")
}
it("genera750 de adopción con dos titulares, sin aplicar cuota",()=>cantidad(prepararBAmpliadoAnual([solicitudAdopcion()],marco()),"750"))
it("censado inelegible no reduce1500 a750",()=>cantidad(prepararBAmpliadoAnual([solicitudAdopcion(["s-1"])],marco("asturias",["s-1"])),"1500"))
it.each([["s-1"],["s-1","s-3","s-4"],["s-1","s-1"]])("rechaza conjunto de titulares incompleto/extra/duplicado:%j",(...ids)=>rechazo(prepararBAmpliadoAnual([solicitudAdopcion(ids)],marco()),/titulares efectivos/))
it("respeta orden irrelevante de titulares efectivos",()=>cantidad(prepararBAmpliadoAnual([solicitudAdopcion(["s-3","s-1"])],marco()),"750"))
it("censo sin atribución calculada no sustituye derecho efectivo",()=>rechazo(prepararBAmpliadoAnual([solicitudAdopcion()],{...marco(),atribucionesMinimo:[]}),/Atribución efectiva/))
it("reparto global familiar no puede omitir al otro titular efectivo de los hijos",()=>{
 const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"asturias_familias_numerosas",titulo:null,hijos:[{...persona(),titulares:["s-1","s-3"],exhaustividad:"completa",parentesco:"hijo",progenitores:["s-1","s-3"]}],ascendientes:["s-1","s-3"],reparto:{titulares:["s-1"],exhaustividad:"completa"}}}
 rechazo(prepararBAmpliadoAnual([s],marco()),/Reparto familiar distinto/)
})
it("reparto de celiaquía también exige mínimo efectivo, no referencia",()=>rechazo(prepararBAmpliadoAnual([solicitudCelia()],{...marco("asturias",["s-1","s-3","s-4"]),sujetosConMinimo:[]}),/mínimo efectivo/))
it("conserva100/3 en el libro común aunque sólo quede1 euro de cuota",()=>cantidad(prepararBAmpliadoAnual([solicitudCelia()],{...marco("asturias",["s-1","s-3","s-4"]),cuotaAutonomica:decimal("1")}),"100","3"))
it("base con80 decimales se transporta íntegra en rama que no la usa como límite",()=>{
 const valor="20000."+"0".repeat(79)+"1"
 const r=prepararBAmpliadoAnual([solicitudAdopcion()],{...marco(),baseGeneral:decimal(valor)})
 cantidad(r,"750");if("magnitudes" in r)expect(r.magnitudes?.baseGeneral).toBe(valor)
})
it("base sobre límite en el80º decimal queda excluida sin truncamiento",()=>{
 const valor="35000."+"0".repeat(79)+"1"
 const r=prepararBAmpliadoAnual([solicitudCelia()],{...marco("asturias",["s-1","s-3","s-4"]),baseGeneral:decimal(valor)})
 expect(r.estado).toBe("generaciones_preparadas");if(r.estado==="generaciones_preparadas")expect(r.generaciones[0].estado).toBe("excluida");if("magnitudes" in r)expect(r.magnitudes?.baseGeneral).toBe(valor)
})
it("renta familiar distinta a la anual se rechaza",()=>{
 const s=solicitudAdopcion()
 if(s.hechos.codigo!=="asturias_adopcion_internacional")throw new Error("Fixture")
 const modificada:SolicitudBAmpliadoAnual={...s,hechos:{...s.hechos,adopciones:s.hechos.adopciones.map(a=>({...a,hijo:{...a.hijo,rentaNoExenta:"1",rentaBrutaIncluidasExentas:"1"}}))}}
 rechazo(prepararBAmpliadoAnual([modificada],marco()),/Renta familiar contradictoria/)
})
it("fecha de nacimiento exacta no se sustituye por la misma edad",()=>{
 const s=solicitudAdopcion();if(s.hechos.codigo!=="asturias_adopcion_internacional")throw new Error("Fixture")
 const modificada:SolicitudBAmpliadoAnual={...s,hechos:{...s.hechos,adopciones:s.hechos.adopciones.map(a=>({...a,hijo:{...a.hijo,nacimiento:"2015-12-31"}}))}}
 rechazo(prepararBAmpliadoAnual([modificada],marco()),/Nacimiento/)
})
function conVinculoAdoptivo(inicio:string,constitucion?:string){
 const m=marco();if(m.caso.derechosMinimos===undefined)throw new Error("Fixture")
 return {...m,caso:{...m.caso,derechosMinimos:{...m.caso.derechosMinimos,descendientes:m.caso.derechosMinimos.descendientes.map(d=>({...d,titulares:d.titulares.map(t=>{
  const vinculo={clase:"adopcion" as const,fechaInicioIncremento:inicio,fundamento:"inscripcion-registro-civil" as const,historialCompleto:true as const}
  return {...t,vinculo:constitucion===undefined?vinculo:{...vinculo,fechaConstitucionVinculo:constitucion}}
 })}))}}}
}
it("constitución adoptiva discrepa aunque coincidan inscripción y ejercicio",()=>rechazo(prepararBAmpliadoAnual([solicitudAdopcion()],conVinculoAdoptivo("2025-01-01","2024-12-02")),/constitución adoptiva/))
it("antecedente de acogimiento no se reinicia al inscribir la adopción",()=>cantidad(prepararBAmpliadoAnual([solicitudAdopcion()],conVinculoAdoptivo("2023-01-01","2024-12-01")),"750"))
it("inicio anual del vínculo posterior a inscripción no se ignora",()=>rechazo(prepararBAmpliadoAnual([solicitudAdopcion()],conVinculoAdoptivo("2025-02-01","2024-12-01")),/Inicio del vínculo/))
it("nacimiento propio incoherente con edad anual no abre emancipación",()=>{
 const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"asturias_emancipacion_jovenes_hasta_35",personas:[{id:"s-1",nacimiento:"1990-01-01",fechaSalidaAscendientes:"2025-01-01",emancipacionesPrevias:[],retornos:[],vivienda:{id:"V1",municipio:"33001",titulo:"propiedad",fechaTitulo:"2025-01-01",ocupacion:{inicio:"2025-01-01",fin:"2025-12-31"},destino:"habitual",contrato:doc},gastos:[pago()]}]}}
 rechazo(prepararBAmpliadoAnual([s],marco()),/Nacimiento propio/)
})
it("el esquema prohíbe bases,cuotas y grados de reparto externos",()=>{
 const original=solicitudAdopcion();if(original.hechos.codigo!=="asturias_adopcion_internacional")throw new Error("Fixture")
 for(const objeto of [{...original,baseGeneral:"0"},{...original,cuotaAutonomica:"999999"},{...original,tipoMedioAutonomico:"0"},{...original,hechos:{...original.hechos,adopciones:original.hechos.adopciones.map(a=>({...a,hijo:{...a.hijo,gradoTitular:1,gradosOtrosAscendientes:[]}}))}}]){
  const d=Schema.decodeUnknownResult(SolicitudBAmpliadoAnual)(objeto,{onExcessProperty:"error"});expect(Result.isFailure(d)).toBe(true)
 }
})
it("duplicar solicitud no duplica generación",()=>rechazo(prepararBAmpliadoAnual([solicitudAdopcion(),solicitudAdopcion()],marco()),/Código.*duplicado/))
it("identidad distinta del contribuyente en derechos mínimos se rechaza",()=>{
 const m=marco();if(m.caso.derechosMinimos===undefined)throw new Error("Fixture")
 rechazo(prepararBAmpliadoAnual([solicitudAdopcion()],{...m,caso:{...m.caso,derechosMinimos:{...m.caso.derechosMinimos,contribuyenteId:"s-9"}}}),/Contribuyente/)
})
function guarderia():SolicitudBAmpliadoAnual {
 return {lote:"B-ampliado",hechos:{codigo:"cantabria_gastos_guarderia",municipio:"39075",hijos:[{...persona(),nacimiento:"2023-01-01",titulares:["s-1","s-3"],exhaustividad:"completa",parentesco:"hijo",progenitores:["s-1","s-3"],centro:doc,pagosFamilia:[{...pago("1000"),documento:"FACTURA-COMUN"},{...pago("3000","P2","s-3"),documento:"FACTURA-COMUN"}]}]}}
}
function marcoGuarderia(){const m=marco("cantabria");if(m.caso.derechosMinimos===undefined)throw new Error("Fixture");return {...m,caso:{...m.caso,derechosMinimos:{...m.caso.derechosMinimos,descendientes:m.caso.derechosMinimos.descendientes.map(d=>({...d,fechaNacimiento:"2023-01-01",edadDevengo:2}))}}}}
it("descendiente con identidad propia del contribuyente se rechaza",()=>{
 const s=guarderia();if(s.hechos.codigo!=="cantabria_gastos_guarderia")throw new Error("Fixture")
 const h:SolicitudBAmpliadoAnual={...s,hechos:{...s.hechos,hijos:s.hechos.hijos.map(p=>({...p,id:"s-1"}))}}
 rechazo(prepararBAmpliadoAnual([h],marcoGuarderia()),/Identidad del descendiente/)
})
it("descendiente con identidad de otro progenitor se rechaza",()=>{
 const s=guarderia();if(s.hechos.codigo!=="cantabria_gastos_guarderia")throw new Error("Fixture")
 const h:SolicitudBAmpliadoAnual={...s,hechos:{...s.hechos,hijos:s.hechos.hijos.map(p=>({...p,progenitores:["s-1","s-2"]}))}}
 rechazo(prepararBAmpliadoAnual([h],marcoGuarderia()),/Identidad del descendiente/)
})
it("gastos compartidos por titulares efectivos conservan proporción1/4, no mitad",()=>cantidad(prepararBAmpliadoAnual([guarderia()],marcoGuarderia()),"75"))
it("duplicar un pago compartido no duplica el gasto",()=>{
 const s=guarderia();if(s.hechos.codigo!=="cantabria_gastos_guarderia")throw new Error("Fixture")
 const h:SolicitudBAmpliadoAnual={...s,hechos:{...s.hechos,hijos:s.hechos.hijos.map(p=>({...p,pagosFamilia:[pago(),pago()]}))}}
 rechazo(prepararBAmpliadoAnual([h],marcoGuarderia()),/Pago duplicado/)
})
it("un mismo documento no financia dos códigos aunque cambien IDs",()=>{
 const s=guarderia()
 const obras:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_obras_mejora",obras:[{id:"O1",inmueble:{id:"V1",municipio:"39003",titulo:"propiedad",fechaTitulo:"2025-01-01",ocupacion:{inicio:"2025-01-01",fin:"2025-12-31"},destino:"habitual",contrato:doc},objeto:"telecomunicaciones",calificacion:null,ejecucion:{inicio:"2025-01-01",fin:"2025-12-31"},gastos:[{...pago("1000","P9"),documento:"FACTURA-COMUN",subvencionNoSujetaExenta:"0"}]}],derechosEstatales:[],discapacidades:[]}}
 rechazo(prepararBAmpliadoAnual([s,obras],marcoGuarderia()),/Documento monetario/)
})
it("los grados propios no se confunden con grados de parentesco",()=>{
 const obras:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_obras_mejora",obras:[],derechosEstatales:[],discapacidades:[{id:"s-1",grado:65,documento:doc}]}}
 rechazo(prepararBAmpliadoAnual([obras],marco("cantabria")),/categoría anual/)
})
describe("Productores ausentes y cuota rural disponible",()=>{
 it("ELA no calcula tipo medio dividiendo cuota total entre base",()=>{
  const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"asturias_ayudas_ela",ayudas:[{id:"A1",beneficiario:"s-1",organismo:"principado_asturias",concesion:doc,enfermedad:"ELA",importeConcedido:"5000"}]}}
  rechazo(prepararBAmpliadoAnual([s],marco()),/tiposMediosGenerales2025/)
  if(s.hechos.codigo!=="asturias_ayudas_ela")throw new Error("Fixture");const externa={...s,hechos:{...s.hechos,ayudas:s.hechos.ayudas.map(a=>({...a,integradoBaseGeneral:"5000",integradoBaseLiquidable:"5000"}))}}
  rechazo(prepararBAmpliadoAnual([externa],marco()),/cerrada/)
 })
 it("traslado rural identifica la cuota de trabajo faltante, no usa cuota total",()=>{
  const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_traslado_residencia_motivos_laborales_despoblamiento",personas:[]}}
  rechazo(prepararBAmpliadoAnual([s],marco("cantabria")),/cuotaAutonomicaTrabajoActividad2025/)
 })
 it("donativos no supone cero en bases estatales compartidas ausentes",()=>{
  const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad",donaciones:[]}}
  rechazo(prepararBAmpliadoAnual([s],marco("cantabria")),/basesDonativosEstatales2025/)
 })
 it("residencia rural recibe cuota del motor y conserva generado200 sin consumirla",()=>{
  const m=marco("cantabria"),s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_residencia_municipio_riesgo_despoblamiento",personas:[{id:"s-1",nacimiento:"1990-01-01",residencias:[{inicio:"2025-01-01",fin:"2025-12-31",territorio:"cantabria",municipio:"39003"}]}]}}
  if(m.caso.derechosMinimos===undefined)throw new Error("Fixture");const anual={...m,caso:{...m.caso,situacionFamiliar:{...m.caso.situacionFamiliar,edad:35},derechosMinimos:{...m.caso.derechosMinimos,edadContribuyenteDevengo:35}}}
  cantidad(prepararBAmpliadoAnual([s],anual),"200")
  cantidad(prepararBAmpliadoAnual([s],{...anual,cuotaAutonomica:decimal("0")}),"0")
 })
 it.todo("al integrar productores ELA comprobar tipos generales art.63.2/74.2 e imputación por ayuda desde nodos fiscales,sin valores del cliente")
 it.todo("al representar bases estatales68.3/68.5 comprobar límite compartido de donativos desde sus nodos")
 it("base por debajo del límite en el80º decimal genera la fracción exacta",()=>{
  const valor="34999."+"9".repeat(80)
  const r=prepararBAmpliadoAnual([solicitudCelia()],{...marco("asturias",["s-1","s-3","s-4"]),baseGeneral:decimal(valor)})
  cantidad(r,"100","3");if("magnitudes" in r)expect(r.magnitudes?.baseGeneral).toBe(valor)
 })
})
it("las elecciones incompatibles se derivan de las solicitudes,no de una lista vacía del cliente",()=>{
 const a:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_gastos_guarderia",municipio:"39003",hijos:[]}}
 const b:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_guarderia_municipios_riesgo_despoblamiento",municipio:"39003",hijos:[]}}
 rechazo(prepararBAmpliadoAnual([a,b],marco("cantabria")),/incompatible/)
 const evasiva={...a,hechos:{...a.hechos,usos:[]}}
 rechazo(prepararBAmpliadoAnual([evasiva],marco("cantabria")),/cerrada/)
})
it("ayuda doméstica deriva trabajo anual del motor,no del cliente",()=>{
 const m=marco("cantabria");if(m.caso.derechosMinimos===undefined)throw new Error("Fixture")
 const anual={...m,caso:{...m.caso,situacionFamiliar:{...m.caso.situacionFamiliar,edad:75},derechosMinimos:{...m.caso.derechosMinimos,edadContribuyenteDevengo:75}},rentasTrabajoAnuales:{integroTrabajo:decimal("0"),restoRentas:decimal("0")},nodosFiscalesB2025:producirNodosFiscalesB2025("s-1",decimal("20000"),decimal("1000"),decimal("1000"),"solo-trabajo")}
 const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"cantabria_ayuda_domestica",empleado:"s-9",altaCantabria:doc,vivienda:{id:"V1",municipio:"39003",titulo:"propiedad",fechaTitulo:"2025-01-01",ocupacion:{inicio:"2025-01-01",fin:"2025-12-31"},destino:"habitual",contrato:doc},empleadores:[{id:"s-1",nacimiento:"1950-01-01",altaTGSS:doc}],vinculo:"monoparental",registroPareja:null,hijos:[],cotizaciones:[pago("2000")]}}
 cantidad(prepararBAmpliadoAnual([s],anual),"300")
 if(s.hechos.codigo!=="cantabria_ayuda_domestica")throw new Error("Fixture")
 const externa={...s,hechos:{...s.hechos,empleadores:s.hechos.empleadores.map(e=>({...e,rendimientosTrabajo:"999999"}))}}
 rechazo(prepararBAmpliadoAnual([externa],anual),/cerrada/)
})
it("monoparentalidad no oculta custodia compartida conocida por el productor anual",()=>{
 const s:SolicitudBAmpliadoAnual={lote:"B-ampliado",hechos:{codigo:"asturias_familias_monoparentales",familia:{convivientes:[{clase:"descendiente",custodia:"exclusiva",persona:{...persona(),titulares:["s-1","s-3"],exhaustividad:"completa",parentesco:"hijo",progenitores:["s-1","s-3"]}}],exhaustividad:"completa",alimentosExentos:"0",cambioSituacion:null}}}
 rechazo(prepararBAmpliadoAnual([s],marco()),/Custodia/)
})
