import {it,expect} from 'vitest';
import {Effect,Schema} from 'effect';
import Decimal from 'decimal.js';
import datos from './fixtures/ext-inversion-2025.json';
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts';
import {aplicarDeduccionesTerritoriales2025,SolicitudDeduccionesTerritoriales2025} from '../lib/dominio/irpf/deducciones/anual-territorial.ts';
const caso=()=>structuredClone(datos);
const solicitud=s=>Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({solicitudes:s},{onExcessProperty:'error'});
function tecnica(ss){return {anio:2025,comunidadAutonoma:"extremadura",contribuyenteId:"t",situacionFamiliar:{tipo:"individual",edad:40,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:100000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:10000,pagosACuentaCentimos:20000,deduccionesTerritoriales2025:ss}}
function explicita(ss){return {ejercicio:2025,comunidadAutonoma:"extremadura",contribuyenteId:"t",edad:40,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:ss,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"empleo",clase:"empleo-laboral",integro:"1000000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[{ejercicio:2025,operacionId:"retencion",procedencia:"certificado",importe:"100",efectiva:true}]}}

function partition(s,e,forma='SL') {
 const x=caso(),h=x.hechos,i=h.inversion,p=s+e,capital=10*p;
 i.pago.importeCentimos=p;i.eleccion={estatalCentimos:s,extremaduraCentimos:e};
 h.escrituraPublica.capitalSocialCentimos=capital;
 h.escrituraPublica.inversores.forEach((v,n)=>v.importeCentimos=n===2?8*p:p);
 const t=i.historialParticipacionTercero[0];
 for(const key of ['capitalPropio','votoPropio'])t[key]={numerador:1,denominador:10};
 for(const key of ['capitalDirectoIndirecto','votoDirectoIndirecto'])t.familiares[0][key]={numerador:1,denominador:10};
 h.inscripcion.forma=forma;i.historialEntidad[0].forma=forma;
 // Capital inicial de constitución conciliado; máximo400000 observado en estos positivos.
 i.fondosPropiosInicioCentimos=capital;
 return x;
}
function conCapital(x,capital) {
 const h=x.hechos,p=h.inversion.pago.importeCentimos;
 h.escrituraPublica.capitalSocialCentimos=capital;
 h.escrituraPublica.inversores.forEach((v,n)=>v.importeCentimos=n===2?capital-2*p:p);
 h.inversion.fondosPropiosInicioCentimos=capital;
 const t=h.inversion.historialParticipacionTercero[0];
 for(const key of ['capitalPropio','votoPropio'])t[key]={numerador:p,denominador:capital};
 for(const key of ['capitalDirectoIndirecto','votoDirectoIndirecto'])t.familiares[0][key]={numerador:p,denominador:capital};
 return x;
}
function partitionValida(s,e,forma) {
 return conCapital(partition(s,e,forma),Math.max(10*(s+e),forma==='SA'?6000000:100));
}
const gcd=(a,b)=>b===0n?a:gcd(b,a%b);
function rational(n,d){n=BigInt(n);d=BigInt(d);const g=gcd(n,d);return {numeradorEuros:String(n/g),divisor:String(d/g)}}
const run=(api,ss)=>Effect.runSync(api==='tecnica'?liquidarIrpfAnual(tecnica(ss),{modo:'canonico'}):liquidarIrpfAnualExplicito(explicita(ss)));
for(const api of ['tecnica','explicita']) {
 for(const [s,e,f] of [[0,1,'SL'],[1,0,'SA'],[3,7,'SL'],[123457,543211,'SA'],[1000000,0,'SL'],[0,2000000,'SA'],[2000000,2000000,'SL']])it(`${api} racional propio ${s}:${e}:${f}`,()=>{
  const b=run(api,solicitud([])),v=run(api,solicitud([partitionValida(s,e,f)])),d=v.deduccionesTerritoriales2025;
  expect(d.estatal681.consumo.total).toEqual(rational(s,200));expect(d.total).toEqual(rational(e,500));
  if(api==='tecnica')expect(Math.abs((b.cuotaLiquidaCentimos-v.cuotaLiquidaCentimos)-(s/2+e/5))).toBeLessThanOrEqual(1);
  else expect(new Decimal(b.cuotaLiquidaLegal).minus(v.cuotaLiquidaLegal).toNumber()).toBeCloseTo(s/200+e/500,2);
 });
 for(const [label,fn] of [
  ['capital41',h=>{const t=h.inversion.historialParticipacionTercero[0];h.escrituraPublica.inversores[1].importeCentimos=1100000;h.escrituraPublica.inversores[2].importeCentimos=5900000;t.familiares[0].capitalDirectoIndirecto={numerador:11,denominador:100};t.familiares[0].votoDirectoIndirecto={numerador:11,denominador:100};}],
  ['sinSS',h=>{h.empleo.altaSS=' ';}],['fondos400k+',h=>{h.inversion.fondosPropiosInicioCentimos=40000001;}],
  ['balance49',h=>{h.actividad.contabilidad[0].activos[0].valorContableCentimos=4900000;h.actividad.contabilidad[0].activos[1].valorContableCentimos=5100000;}],
  ['cert2025fechaImposible',h=>{h.inversion.certificadoEntidad.fechaEmision='2025-02-29';}],
 ])it(`${api} discriminante ${label}`,()=>{const x=caso();fn(x.hechos);expect(()=>run(api,solicitud([x]))).toThrow();});
 for(const year of [2026,2029,2035])it(`${api} certificado ${year}`,()=>{const x=caso();x.hechos.inversion.certificadoEntidad.fechaEmision=year+'-12-31';expect(run(api,solicitud([x])).deduccionesTerritoriales2025.total).toEqual(rational(4000,1));});
}
for(const rounding of [0,1,2,3,4,5,6,7,8])it(`cuota80 global6 rounding${rounding}`,()=>{
 const prev={precision:Decimal.precision,rounding:Decimal.rounding};Decimal.set({precision:6,rounding});
 try {const m={caso:tecnica(solicitud([])),baseGeneral:new Decimal(1000000),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal('0.'+'0'.repeat(79)+'7'),cuotaEstatal681:new Decimal('0.'+'0'.repeat(79)+'3'),sujetosConMinimo:[]};
 const d=aplicarDeduccionesTerritoriales2025(solicitud([caso()]),m);
 expect(d.total).toEqual(rational(7,10n**80n));expect(d.estatal681.consumo.total).toEqual(rational(3,10n**80n));expect(Decimal.precision).toBe(6);expect(Decimal.rounding).toBe(rounding);
 } finally {Decimal.set(prev);}
});
// Regresión normativa deseada: falla en el candidato revisado; el padre corrige producto.
for(const api of ['tecnica','explicita'])it(`F02 ${api}: rechazar constitución SA capital10000`,()=>{expect(()=>run(api,solicitud([partition(100000,0,'SA')]))).toThrow();});

// Fronteras LSC4: mismo desembolso, censo y participaciones conciliados exactamente.
for(const api of ['tecnica','explicita'])for(const [forma,capital,pago,admitido] of [
 ['SA',5999999,100000,false],['SA',6000000,100000,true],
 ['SL',99,10,false],['SL',100,10,true],
])it(`F02 ${api} ${forma} capital=${capital}`,()=>{
 const x=conCapital(partition(pago,0,forma),capital);
 if(admitido)expect(run(api,solicitud([x])).deduccionesTerritoriales2025.estatal681.consumo.total).toEqual(rational(pago,200));
 else {
  expect(()=>run(api,solicitud([x]))).toThrow();
  const m={caso:tecnica(solicitud([])),baseGeneral:new Decimal(1000000),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal(60000),cuotaEstatal681:new Decimal(60000),sujetosConMinimo:[]};
  expect(()=>aplicarDeduccionesTerritoriales2025(solicitud([x]),m)).toThrow(/capital mínimo/);
 }
});
