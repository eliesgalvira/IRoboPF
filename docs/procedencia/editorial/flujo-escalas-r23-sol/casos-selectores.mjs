import fs from 'node:fs'
import assert from 'node:assert/strict'
import {Effect} from '/home/elies/Repos/IRoboPF/node_modules/effect/dist/index.js'
import {Decimal} from '/home/elies/Repos/IRoboPF/node_modules/decimal.js/decimal.mjs'
const root=process.cwd(), out='docs/procedencia/editorial/flujo-escalas-r23-sol'
const {obtenerParametrosComunidadAutonoma:select}=await import(`${root}/lib/dominio/irpf/comunidades/comunidad-autonoma.ts`)
const {liquidarIrpfAnual}=await import(`${root}/lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts`)
const rows=[]
for(const year of [2020,2021]){
 const results=['-1','0','12449.99','12450','12450.01','20000'].map(b=>select({anio:year,comunidadAutonoma:'catalunya',baseLiquidableGeneral:new Decimal(b)}))
 assert(results.every(r=>r._tag==='ParametrosComunidadAutonoma'))
 assert(results.every(r=>r.minimosAutonomicos.contribuyente.general.eq('5550')))
 assert(results.every(r=>r.minimosAutonomicos===results[0].minimosAutonomicos))
 rows.push({id:`catalunya-${year}-renta`,bases:['-1','0','12449.99','12450','12450.01','20000'],ownMinimum:'5550',sameObject:true,meaning:'El resolver no pasa BG al selector de mínimos. No infiere vigencia ni legalidad.'})
}
for(const [year,community,cutoff] of [[2022,'comunitat-valenciana','2022-10-28'],[2023,'illes-balears','2023-11-26']]){
 const day=Date.parse(cutoff+'T00:00:00Z')
 const selected=[day-1,day,day+86399999].map(t=>select({anio:year,comunidadAutonoma:community,fechaFallecimiento:new Date(t)}).minimosAutonomicos)
 const property=year===2022?'contribuyente.general':'descendientes.segundo'
 const values=selected.map(m=>(year===2022?m.contribuyente.general:m.descendientes.segundo).toFixed())
 assert.notEqual(values[0],values[1]); assert.equal(values[1],values[2])
 if(year===2023)assert(selected.every(m=>m.contribuyente.general.eq(5550)))
 rows.push({id:`fecha-${year}`,community,cutoff,property,offsetMilliseconds:[-1,0,86399999],values,meaning:year===2022?'Fecha civil UTC < corte':'epochMilliseconds < corte; mínimo propio5550 invariante'})
}
for(const year of [2014,2015]){
 const values=['17707.20','17707.21'].map(b=>select({anio:year,comunidadAutonoma:'galicia',baseLiquidableGeneral:new Decimal(b)}).escalaAutonomica.tramos[0][1].toFixed())
 assert.notEqual(values[0],values[1]);rows.push({id:`galicia-${year}`,bases:['17707.20','17707.21'],rates:values})
}
for(let year=2012;year<=2026;year++){
 const r=select({anio:year,comunidadAutonoma:'simulada-estatal'})
 assert.equal(r._tag,'ParametrosComunidadAutonoma')
 assert.equal(r.escalaAutonomicaIgualEstatal,year>=2016)
 rows.push({id:`simulada-${year}`,separateComponents:!r.escalaAutonomicaIgualEstatal,meaning:'No deducir modo de escala de contexto.modo; lo selecciona este flag.'})
}
const base={anio:2025,comunidadAutonoma:'madrid',situacionFamiliar:{tipo:'individual',edad:40,descendientes:[],ascendientes:[],discapacidad:{_tag:'SinDiscapacidad'}},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
const run=c=>Effect.runSync(liquidarIrpfAnual(c,{modo:'canonico'}))
const initial=run(base),paid=run({...base,pagosACuentaCentimos:1234}),deducted=run({...base,deduccionAutonomicaAgregadaCentimos:10000})
assert.equal(initial.cuotaLiquidaCentimos,paid.cuotaLiquidaCentimos)
assert.equal(paid.cuotaDiferencialCentimos,initial.cuotaDiferencialCentimos-1234)
assert.equal(deducted.cuotaLiquidaCentimos,initial.cuotaLiquidaCentimos-10000)
const rejected=Effect.runSync(Effect.exit(liquidarIrpfAnual({...base,deducciones:[{codigo:'madrid-nacimiento',importeCentimos:10000}]},{modo:'canonico'})))
assert.equal(rejected._tag,'Failure')
rows.push({id:'deducciones-agregado-codigo-y-pagos',initial:initial.cuotaLiquidaCentimos,aggregate:deducted.cuotaLiquidaCentimos,paid:paid.cuotaDiferencialCentimos,codeRejected:true})
const {calcularDeduccionTrabajo}=await import(`${root}/lib/dominio/irpf/trabajo-anual/calcular.ts`)
const da={regla:'da61',ambito:'comun-individual',ejercicio:2025,brutoServicios:'16576',otrasRentasNoExentas:'0',netoReducidoServicios:'10000',baseLiquidableGeneral:'10000',cuotaIntegraGeneral:'1000',cuotaLiquidaTotal:'1000',cuotaTrasArt80:'1000',etapa:'despues-art80-sin-deduccion-trabajo',calificacion:'laboral-estatutaria-acreditada'}
for(const [bruto,other,amount] of [['16576','6500','340'],['16576','6500.01','0'],['18276','0','0'],['16577','0','339.8']]){
 const r=calcularDeduccionTrabajo({...da,brutoServicios:bruto,otrasRentasNoExentas:other})
 assert.equal(r.estado,'calculado');assert.equal(r.importeAplicable,amount)
 rows.push({id:`da61-${bruto}-${other}`,amount,posterior:r.cuotaPosterior})
}
fs.writeFileSync(`${out}/casos-selectores.json`,JSON.stringify({rows,legalAcceptance:false},null,2)+'\n')
console.log(`${rows.length} contrastes nuevos en TS real; ninguna aceptación jurídica`)
const published=await import(`${root}/lib/dominio/irpf/cuotas/escalas-publicadas.ts`)
const cellInputs=JSON.parse(fs.readFileSync('docs/procedencia/correcciones/editorial-r21/escalas-celdas.json','utf8'))
const selectedCells=[]
for(const cell of cellInputs){
 const year=cell.selector.ejercicio, territory=cell.selector.territorio, symbol=cell.selector.simbolo
 const table=published[symbol]
 const selected=territory==='estatal-comun'
  ? (year<=2014?[published.ESTATAL_ORDINARIA_2012_2014,published.ESTATAL_COMPLEMENTARIA_2012_2014]:[])
  : [published.obtenerEscalaAutonomicaPublicada({anio:year,comunidadAutonoma:territory})]
 assert(selected.includes(table),`${cell.id}: selector anual/territorial no devuelve tabla por identidad`)
 selectedCells.push({decisionId:cell.id,occurrenceId:cell.selector.itemId,year,territory,symbol,selectedByObjectIdentity:true,deathScope:'Sin fecha de fallecimiento; no amplía ámbito histórico nominal.'})
}
assert.equal(new Set(selectedCells.map(c=>c.occurrenceId)).size,102)
fs.writeFileSync(`${out}/casos-selectores-celdas.json`,JSON.stringify(selectedCells,null,2)+'\n')
console.log('264 selecciones por identidad de tabla actual contrastadas;102 occurrenceId, sin aceptación de ámbito jurídico')
const {calcularDerechosMinimos}=await import(`${root}/lib/dominio/irpf/minimos/derechos.ts`)
const {MINIMOS_ESTATALES_2025}=await import(`${root}/lib/dominio/normativa/datos/minimos-autonomicos-2025.ts`)
const titular=(id,grado,renta)=>({titularId:id,grado,vinculo:{clase:'consanguinidad'},relacion:'convivencia',custodia:'no-procede',alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:renta})
const family=renta=>({ejercicio:2025,territorio:'madrid',regimen:'comun',modalidad:'individual',devengo:'2025-12-31',contribuyenteId:'s-1',edadContribuyenteDevengo:40,discapacidadContribuyente:{_tag:'SinDiscapacidad'},ascendientes:'ninguno',fallecimientosEnElEjercicio:'ninguno',descendientesCompletos:true,descendientes:[{sujetoId:'s-3',edadDevengo:8,fechaNacimiento:'2017-01-01',vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:'no-presenta'},discapacidad:{_tag:'SinDiscapacidad'},titulares:[titular('s-1',1,renta),titular('s-2',2,2000000)],titularesCompletos:true}]})
const priority=[]
for(const [renta,expected] of [[800000,'0'],[800001,'2400']]){
 const r=Effect.runSync(calcularDerechosMinimos(family(renta),MINIMOS_ESTATALES_2025))
 assert.equal(r.descendientes.toFixed(),expected)
 assert.equal(r.contribuyente.toFixed(),'5550')
 priority.push({rentaTitular:renta,rentaDescendiente:0,descendientes:r.descendientes.toFixed(),contribuyente:r.contribuyente.toFixed()})
}
fs.writeFileSync(`${out}/casos-prioridad-familiar.json`,JSON.stringify({priority,scope:'Cambio de grado por renta del titular, no por renta del descendiente; sin aceptación jurídica.'},null,2)+'\n')
console.log('Prioridad familiar800000/800001 separada de renta del descendiente; mínimo propio sin reparto')
