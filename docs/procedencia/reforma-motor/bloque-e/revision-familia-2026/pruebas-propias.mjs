import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import Decimal from "/home/elies/Repos/IRoboPF/node_modules/decimal.js/decimal.mjs";
import { Effect, Result } from "/home/elies/Repos/IRoboPF/node_modules/effect/dist/index.js";
import { calcularDerechosMinimos } from "/home/elies/Repos/IRoboPF/lib/dominio/irpf/minimos/derechos.ts";
import { MINIMOS_ESTATALES_2012 } from "/home/elies/Repos/IRoboPF/lib/dominio/normativa/datos/minimos-autonomicos-2012.ts";
import { MINIMOS_ESTATALES_2026 } from "/home/elies/Repos/IRoboPF/lib/dominio/normativa/datos/minimos-estatales-2026.ts";
import { obtenerMinimosAutonomicosIrpf2026 } from "/home/elies/Repos/IRoboPF/lib/dominio/normativa/datos/minimos-autonomicos-2026.ts";
import { obtenerParametrosComunidadAutonoma } from "/home/elies/Repos/IRoboPF/lib/dominio/irpf/comunidades/comunidad-autonoma.ts";
import { obtenerEscalaAutonomicaPublicada } from "/home/elies/Repos/IRoboPF/lib/dominio/irpf/cuotas/escalas-publicadas.ts";
import { calcularCuotaPorEscala } from "/home/elies/Repos/IRoboPF/lib/dominio/irpf/cuotas/escalas-gravamen.ts";
import { componerLiquidacionAnual } from "/home/elies/Repos/IRoboPF/lib/dominio/irpf/liquidacion/composicion-anual.ts";
const P="/home/elies/Backups/IRoboPF/producto-eb-revision-20261104/";
const oracle=JSON.parse(readFileSync(P+"oraculo-escalas-cas.json","utf8"));
const A=Decimal.clone({precision:80}), results=[];
const test=(name,f)=>{try{f();results.push({name,ok:true})}catch(e){results.push({name,ok:false,error:String(e),stack:e.stack})}};
const eq=(a,b)=>assert(new A(a).eq(b),`expected ${b}, actual ${a}`);
const off=(rows,b)=>{b=new A(b); if(b.lte(0))return new A(0);const r=rows.findLast(r=>b.gte(r.base));return new A(r.cuota).plus(b.minus(r.base).times(r.tipoPorcentaje).div(100))};
const t=(id,extra={})=>({titularId:id,grado:1,vinculo:{clase:"consanguinidad"},relacion:"convivencia",custodia:"compartida",alimentosJudiciales:false,aplicaEspecialidadAlimentos:false,residenteIrpf:true,rentasNoExentasCentimos:3000000,...extra});
const child=(y,id,age,extra={})=>({sujetoId:id,fechaNacimiento:`${y-age}-12-31`,edadDevengo:age,vivoAlDevengo:true,rentasNoExentasCentimos:0,declaracion:{modalidad:"no-presenta"},discapacidad:{_tag:"SinDiscapacidad"},titulares:[t("s-1"),t("s-2")],titularesCompletos:true,...extra});
const facts=(y,ds,extra={})=>({ejercicio:y,territorio:"madrid",regimen:"comun",modalidad:"individual",devengo:`${y}-12-31`,contribuyenteId:"s-1",edadContribuyenteDevengo:40,discapacidadContribuyente:{_tag:"SinDiscapacidad"},ascendientes:"ninguno",fallecimientosEnElEjercicio:"ninguno",descendientesCompletos:true,conciliacionRentasContribuyente:{perfil:"caso-anual-parcial",otrasRentasOGastosNoRepresentados:"ninguno"},descendientes:ds,...extra});
const calc=(f,m)=>Effect.runSync(calcularDerechosMinimos(f,m??(f.ejercicio<=2014?MINIMOS_ESTATALES_2012:MINIMOS_ESTATALES_2026)));
for(const [region,{rows}] of Object.entries(oracle)){
 const p=obtenerParametrosComunidadAutonoma({anio:2026,comunidadAutonoma:region});
 test(`CAS transcription ${region}`,()=>{const actual=obtenerEscalaAutonomicaPublicada({anio:2026,comunidadAutonoma:region});assert.equal(actual.length,rows.length);rows.forEach((r,i)=>{eq(actual[i].baseInferior,r.base);eq(actual[i].cuota,r.cuota);eq(actual[i].tipo,new A(r.tipoPorcentaje).div(100))})});
 for(const r of rows)for(const delta of ["-0.01","0","0.01","123.4567"]){const b=new A(r.base).plus(delta);test(`CAS formula ${region}/${b}`,()=>eq(calcularCuotaPorEscala({base:b,tramos:p.escalaAutonomica.tramos,escalasPublicadas:[obtenerEscalaAutonomicaPublicada({anio:2026,comunidadAutonoma:region})],aritmetica:A}),off(rows,b)))}
 test(`CAS minimo y base altos ${region}`,()=>{
  const f=facts(2026,Array.from({length:30},(_,i)=>child(2026,`s-${i+3}`,i%20+1,{discapacidad:{_tag:"Discapacidad65OMas"}})),{territorio:region});
  const r=Effect.runSync(componerLiquidacionAnual({ambito:{anio:2026,comunidadAutonoma:region,derechosMinimos:f,situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},cotizaciones:{naturaleza:"estimadas-perfil-uniforme",trabajador:new A(0)},precision:80,politica:"decimal-hasta-salida",baseGeneral:new A(500000),baseAhorro:new A(0),rentasAntesReducciones:new A(30000),minimosEstatales:MINIMOS_ESTATALES_2026,deduccionesAutonomicasCentimos:0}));
  eq(r.cuotaIntegraGeneralAutonomica,off(rows,500000));eq(r.cuotaMinimoPersonalAutonomica,off(rows,r.minimoPersonalYFamiliarAutonomico));assert(r.minimoPersonalYFamiliarAutonomico.gt(rows.at(-1).base));
 });
}
for(let y=2012;y<=2026;y++){
 const d=child(y,"s-3",7), d2=child(y,"s-4",2), first=y<2015?1836:2400,second=y<2015?2040:2700,bonus=y<2015?2244:2800;
 test(`familia orden reverso reparto ${y}`,()=>{const f=facts(y,[d2,d]);const a=calc(f),b=calc({...f,contribuyenteId:"s-2"});eq(a.descendientes,(first+second+bonus)/2);eq(a.descendientes.plus(b.descendientes),first+second+bonus);assert.equal(a.atribuciones[0].sujetoId,"s-3")});
 for(const [rent,decl,expected] of [[800000,180000,first/2],[800001,180000,0],[800000,180001,0]])test(`rentas exactas ${y}/${rent}/${decl}`,()=>eq(calc(facts(y,[{...d,rentasNoExentasCentimos:rent,declaracion:{modalidad:"individual",rentasCentimos:decl}}])).descendientes,expected));
 test(`dependencia sin alimentos ${y}`,()=>eq(calc(facts(y,[{...d,titulares:[t("s-1",{relacion:"dependencia-economica",custodia:"sin-custodia"})]}])).descendientes,y<2015?0:first));
 for(const age of [24,25])test(`edad ${y}/${age}`,()=>eq(calc(facts(y,[child(y,"s-3",age)])).descendientes,age===24?first/2:0));
 test(`discapacidad elimina limite 25 ${y}`,()=>{const r=calc(facts(y,[child(y,"s-3",27,{discapacidad:{_tag:"Discapacidad65OMas"}})]));eq(r.descendientes,first/2);eq(r.discapacidadFamiliares,y<2015?4677:6000)});
 for(const dist of [0,2,3])test(`primer acogimiento no reinicio ${y}/${dist}`,()=>{const v={clase:"adopcion",fechaInicioIncremento:`${y-dist}-01-01`,fechaConstitucionVinculo:`${y}-01-01`,fundamento:"inscripcion-registro-civil",historialCompleto:true};eq(calc(facts(y,[{...d,titulares:[t("s-1",{vinculo:v})]}])).descendientes,first+(dist<=2?bonus:0))});
 test(`grado prioridad ${y}`,()=>{const ds=[{...d,titulares:[t("s-1",{rentasNoExentasCentimos:800000}),t("s-9",{grado:2})]}];eq(calc(facts(y,ds)).descendientes,0);eq(calc(facts(y,ds,{contribuyenteId:"s-9"})).descendientes,first);ds[0].titulares[0].rentasNoExentasCentimos=800001;eq(calc(facts(y,ds)).descendientes,first)});
 test(`custodia exclusiva ambos calculos ${y}`,()=>{const ds=[{...d,titulares:[t("s-1",{custodia:"exclusiva"}),t("s-2",{custodia:"sin-custodia",relacion:"ninguna",alimentosJudiciales:true})]}];eq(calc(facts(y,ds)).descendientes,first);eq(calc(facts(y,ds,{contribuyenteId:"s-2"})).descendientes,0)});
}
for(const [region,expected] of [["la-rioja",12900],["asturias",13200],["canarias",12120],["illes-balears",13200]])test(`discapacidad autonomica ${region}`,()=>{const m=obtenerMinimosAutonomicosIrpf2026(region);const r=calc(facts(2026,[child(2026,"s-3",30,{discapacidad:{_tag:"Discapacidad65OMas"},titulares:[t("s-1")]})]),m);eq(r.discapacidadFamiliares,expected)});
test("Baleares propio 65 y75",()=>{for(const [age,total] of [[64,5550],[65,7370],[75,8910]])eq(calc(facts(2026,[],{edadContribuyenteDevengo:age}),obtenerMinimosAutonomicosIrpf2026("illes-balears")).contribuyente,total)});
// Each discrepant fixed-quota row is exercised as minimum and base in composition.
const diff=JSON.parse(readFileSync("/home/elies/Backups/IRoboPF/producto-eb2026-integracion-20261104/diferencias-cuotas.json","utf8"));
for(const item of diff)test(`24 diferencias consumidas base y minimo ${item.territorio}/${item.base}`,()=>{
 const region=item.territorio, rows=oracle[region].rows, ri=rows.findIndex(r=>new A(r.base).eq(item.base)), next=rows[ri+1]?.base;
 const m=obtenerMinimosAutonomicosIrpf2026(region);
 let f,min;
 for(let n=1;n<=100;n++){
  f=facts(2026,Array.from({length:n},(_,i)=>child(2026,`s-${i+3}`,10,{titulares:[t("s-1")]})),{territorio:region});
  min=calc(f,m).total;
  if(min.gte(item.base))break;
 }
 assert(min.gte(item.base)&&(!next||min.lt(next)),"generated family must select target row");
 const r=Effect.runSync(componerLiquidacionAnual({ambito:{anio:2026,comunidadAutonoma:region,derechosMinimos:f,situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},cotizaciones:{naturaleza:"estimadas-perfil-uniforme",trabajador:new A(0)},precision:80,politica:"decimal-hasta-salida",baseGeneral:min.plus(1),baseAhorro:new A(0),rentasAntesReducciones:new A(30000),minimosEstatales:MINIMOS_ESTATALES_2026,deduccionesAutonomicasCentimos:0}));
 eq(r.cuotaMinimoPersonalAutonomica,off(rows,min)); eq(r.cuotaIntegraGeneralAutonomica,off(rows,min.plus(1)));
 eq(r.desgloseCuotaMinimoPersonalAutonomica[0].cuotaFija,rows[ri].cuota);
 eq(r.desgloseCuotaIntegraGeneralAutonomica[0].cuotaFija,rows[ri].cuota);
});
for(const region of Object.keys(oracle))test(`deducciones vacias y guardia foral ${region}`,()=>assert.deepEqual(obtenerParametrosComunidadAutonoma({anio:2026,comunidadAutonoma:region}).deduccionesAutonomicasSoportadas,[]));
for(const region of ["navarra","pais-vasco","bizkaia","unknown"])test(`foral fuera ${region}`,()=>assert.equal(obtenerParametrosComunidadAutonoma({anio:2026,comunidadAutonoma:region})._tag,"ComunidadAutonomaNoSoportada"));
for(const y of [2012,2014,2015,2026]){
 for(const help of [false,true])test(`33pct asistencia ${y}/${help}`,()=>eq(calc(facts(y,[child(y,"s-3",25,{discapacidad:{_tag:"Discapacidad33a64",necesitaAyudaOMovilidadReducida:help}})])).discapacidadFamiliares,(y<2015?(help?4632:2316):(help?6000:3000))/2));
 for(const age of [0,2,3])test(`menor3 al devengo ${y}/${age}`,()=>eq(calc(facts(y,[child(y,"s-3",age)])).descendientes,((y<2015?1836:2400)+(age<3?(y<2015?2244:2800):0))/2));
 test(`rechazo censo incompleto ${y}`,()=>assert(Result.isFailure(Effect.runSync(Effect.result(calcularDerechosMinimos(facts(y,[child(y,"s-3",10,{titularesCompletos:false})]),MINIMOS_ESTATALES_2026))))));
}
test("precision global intacta",()=>assert.equal(Decimal.precision,20));
writeFileSync(P+"resultados-propios.json",JSON.stringify({total:results.length,passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,results},null,2));
console.log(JSON.stringify({total:results.length,passed:results.filter(r=>r.ok).length,failures:results.filter(r=>!r.ok)},null,2));
process.exitCode=results.some(r=>!r.ok)?1:0;
