import {it,expect} from "vitest"
import {Effect} from "effect"
import Decimal from "decimal.js"
import {aplicarDeduccionesTerritoriales2025,type MagnitudesTerritorialesAnuales,type SolicitudDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
import {PRODUCTORES_PENDIENTES_E38} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import {casos} from "./galicia-rioja-ampliacion-2025.casos"
import {solicitudE38} from "./e38-anual-facturas.casos"
const codigoN1="rioja_vehiculos_electricos_nuevos"
const vehiculo=casos.find(c=>c.hechos.codigo===codigoN1)
if(vehiculo===undefined||vehiculo.hechos.codigo!==codigoN1)throw new Error("fixture corregida de vehículo")
const vehiculoHechos=vehiculo.hechos
const n1=solicitudE38({...vehiculoHechos,vehiculos:vehiculoHechos.vehiculos.map(v=>({...v,categoria:"N1"}))})
const territorial={solicitudes:[n1]} satisfies SolicitudDeduccionesTerritoriales2025
function canonico(comunidad:CasoFiscalAnual["comunidadAutonoma"]="la-rioja"):CasoFiscalAnual{return{anio:2025,comunidadAutonoma:comunidad,contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
function efectivo(s:SolicitudDeduccionesTerritoriales2025){return{ejercicio:2025,comunidadAutonoma:"la-rioja",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"R",clase:"empleo-laboral",integro:"30000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const}
function magnitudes(territorio:MagnitudesTerritorialesAnuales["caso"]["comunidadAutonoma"]="la-rioja"):MagnitudesTerritorialesAnuales{return{caso:canonico(territorio),basesImponiblesE38:{general:new Decimal("20000"),ahorro:new Decimal("0")},baseGeneral:new Decimal("20000"),baseAhorro:new Decimal("0"),minimoPersonalFamiliar:new Decimal("5550"),cuotaAutonomica:new Decimal("1000"),sujetosConMinimo:[],atribucionesMinimo:[]}}
function vehiculoConImporte(importe:string){if(n1.hechos.codigo!==codigoN1)throw new Error('fixture');return {...n1,hechos:{...n1.hechos,vehiculos:n1.hechos.vehiculos.map(v=>({...v,precio:importe,pagos:v.pagos.map(p=>({...p,importe}))}))}}}
function proyectar(r:{readonly deduccionesTerritoriales2025?:ReturnType<typeof aplicarDeduccionesTerritoriales2025>|undefined}){return {deduccionesTerritoriales2025:r.deduccionesTerritoriales2025}}
function ambas(s:SolicitudDeduccionesTerritoriales2025){return [Effect.map(liquidarIrpfAnual({...canonico(),deduccionesTerritoriales2025:s},{modo:'canonico'}),proyectar),Effect.map(liquidarIrpfAnualExplicito(efectivo(s)),proyectar)]}
for(const importe of ['0.01','1','1.01','100','1000'])it('EUR único al cruzar ambas API: '+importe,()=>{
 const s={solicitudes:[vehiculoConImporte(importe)]}; const esperado=racional(new Decimal(importe).times('0.15').toFixed());
 for(const e of ambas(s))expect(Effect.runSync(e).deduccionesTerritoriales2025?.evaluaciones[0].exacto).toEqual(esperado);
})
for(const importe of ['-0.01','-100','1.001','NaN','Infinity','1e3'])it('ambas API rechazan pago inválido '+importe,()=>{for(const e of ambas({solicitudes:[vehiculoConImporte(importe)]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe('ResultadoNoSoportado')})
for(const cuota of ['0','0.00000000000000000001','149.99999999999999999999','150','150.00000000000000000001'])it('cota exacta cuota '+cuota,()=>{
 const r=aplicarDeduccionesTerritoriales2025(territorial,{...magnitudes(),cuotaAutonomica:new Decimal(cuota)});
 const tope=new Decimal(cuota).lt(150)?cuota:'150';expect(r.total).toEqual(racional(tope));
})
for(const cuota of ['-0.01','NaN','Infinity'])it('contrato interno rechaza cuota '+cuota,()=>expect(()=>aplicarDeduccionesTerritoriales2025(territorial,{...magnitudes(),cuotaAutonomica:new Decimal(cuota)})).toThrow())
for(const campo of ['baseImponibleTotal','magnitudesMotor','magnitudes','contexto','cuotaIntegraAutonomica','denominador'])it('inyección profunda ambas API '+campo,()=>{
 if(n1.hechos.codigo!==codigoN1)throw new Error('fixture');
 const h={...n1.hechos,vehiculos:n1.hechos.vehiculos.map(v=>Object.assign({...v},{[campo]:'0'}))};
 for(const e of ambas({solicitudes:[{...n1,hechos:h}]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe('ResultadoNoSoportado');
})
for(const nacimientoContribuyente of ['1991-01-01','2025-02-30','2026-01-01'])it('fecha propia inconsistente ambas API '+nacimientoContribuyente,()=>{for(const e of ambas({solicitudes:[{...n1,nacimientoContribuyente}]}))expect(Effect.runSync(Effect.flip(e))._tag).toBe('ResultadoNoSoportado')})
it('once productores ausentes: ambos canales rechazan e identifican código sin magnitudes inyectadas',()=>{
 const pendientes=casos.filter(c=>c.hechos.codigo in PRODUCTORES_PENDIENTES_E38);expect(pendientes).toHaveLength(11);
 for(const c of pendientes){const s={solicitudes:[solicitudE38(c.hechos)]};const a=liquidarIrpfAnual({...canonico(c.contexto.territorio),deduccionesTerritoriales2025:s},{modo:'canonico'});const b=liquidarIrpfAnualExplicito({...efectivo(s),comunidadAutonoma:c.contexto.territorio});
 for(const e of [Effect.as(a,undefined),Effect.as(b,undefined)]){const err=Effect.runSync(Effect.flip(e));expect(err._tag).toBe('ResultadoNoSoportado');expect(JSON.stringify(err)).toContain(c.hechos.codigo)} }
})
it('80 cifras se conservan en frontera BLG, sin usar base imponible',()=>{
 const c=casos.find(c=>c.hechos.codigo==='rioja_internet_jovenes_emancipados');if(c===undefined)throw new Error('fixture'); const s={solicitudes:[solicitudE38(c.hechos)]};
 const m={...magnitudes(),basesImponiblesE38:{general:new Decimal('999999'),ahorro:new Decimal(0)}};
 expect(aplicarDeduccionesTerritoriales2025(s,{...m,baseGeneral:new Decimal('18030')}).total).toEqual(racional('200'));
 expect(aplicarDeduccionesTerritoriales2025(s,{...m,baseGeneral:new Decimal('18030.'+'0'.repeat(74)+'1')}).total).toEqual(racional('0'));
})
it('fracción de céntimo en el contrato monetario se convierte una sola vez',()=>{
 const c=casos.find(c=>c.hechos.codigo==='rioja_donaciones_fomento_mecenazgo');if(c===undefined)throw new Error('fixture');
 const cuota='0.'+'0'.repeat(78)+'1';const r=aplicarDeduccionesTerritoriales2025({solicitudes:[solicitudE38(c.hechos)]},{...magnitudes(),cuotaAutonomica:new Decimal(cuota)});
 expect(r.total).toEqual(racional('3',String(10n**80n)));
})
it('dos E independientes comparten una cuota y conservan indices del libro',()=>{
 const c=casos.find(c=>c.hechos.codigo==='rioja_fijacion_poblacion_ocupada_medio_rural');if(c===undefined)throw new Error('fixture');
 const r=aplicarDeduccionesTerritoriales2025({solicitudes:[vehiculoConImporte('0.01'),solicitudE38(c.hechos)]},{...magnitudes(),cuotaAutonomica:new Decimal('0.051')});
 expect(r.total).toEqual(racional('0.051'));expect(r.aplicaciones[0].aplicado).toEqual(racional('0.0015'));expect(r.aplicaciones[1].aplicado).toEqual(racional('0.0495'));expect(r.saldosE38?.[0].importe).toEqual(racional('999.9505'));
})
const bici={lote:'E',hechos:{codigo:'rioja_bicicletas_pedaleo_no_asistido',coleccion:'exhaustiva_2025',creditoFiscalMecenazgoRioja:'no_aplicado',regimen:'privativo',conyuges:[],bicicletas:[{id:'BICI',asistencia:'no',pago:{id:'PBICI',pagador:'A',receptor:'R',fecha:'2025-06-01',importe:'1.01',factura:'FBICI'}}]}} as const
for(const invertir of [false,true])it('coexistencia E anterior/E38 un solo libro: '+invertir,()=>{
 const solicitudes=invertir?[bici,n1]:[n1,bici]; const r=aplicarDeduccionesTerritoriales2025({solicitudes},{...magnitudes(),cuotaAutonomica:new Decimal('150.1')});
 expect(r.total).toEqual(racional('150.1'));expect(r.aplicaciones[invertir?0:1].aplicado).toEqual(racional(invertir?'0.1515':'0.1'));expect(r.aplicaciones[invertir?1:0].aplicado).toEqual(racional(invertir?'149.9485':'150'));
 for(const e of ambas({solicitudes}))expect(Effect.runSync(e).deduccionesTerritoriales2025?.total).toEqual(racional('150.1515'));
})
it('pago idéntico entre E y E38 se rechaza aunque cambie el código',()=>{
 if(n1.hechos.codigo!==codigoN1)throw new Error('fixture');const p=n1.hechos.vehiculos[0].pagos[0];
 const repetida={...bici,hechos:{...bici.hechos,bicicletas:bici.hechos.bicicletas.map(b=>({...b,pago:{...b.pago,id:p.id,factura:p.factura}}))}};
 expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[repetida,n1]},magnitudes())).toThrow(/duplicado/);
})
for(const anio of [2024,2026])it('E38 no habilita ejercicio histórico/futuro '+anio,()=>{
 expect(Effect.runSync(Effect.flip(liquidarIrpfAnual(Object.assign({...canonico(),deduccionesTerritoriales2025:territorial},{anio}),{modo:'canonico'})))._tag).toBe('ResultadoNoSoportado');
 expect(Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(Object.assign({...efectivo(territorial)},{ejercicio:anio}))))._tag).toBe('ResultadoNoSoportado');
})
import {magnitud} from '../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/comun'
import {ctx} from './galicia-rioja-ampliacion-2025.casos'
function interno(numeradorCentimos:string,denominador:string){return {...ctx(),magnitudes:[],magnitudesMotor:[{clave:'cuotaIntegraAutonomica' as const,exacto:{numeradorCentimos,denominador},ejercicio:2025 as const,declarantes:['A'],nodoDerivacion:'revision.cuota'}]}}
for(const denominador of ['0','-1','0.1','1e3'])it('denominador interno inválido '+denominador,()=>expect(()=>magnitud(interno('1',denominador),'cuotaIntegraAutonomica')).toThrow())
it('contrato interno permite 1/3 céntimo sin redondear y rechaza signo negativo',()=>{expect(magnitud(interno('1','3'),'cuotaIntegraAutonomica')).toEqual({n:1n,d:3n});expect(()=>magnitud(interno('-1','3'),'cuotaIntegraAutonomica')).toThrow()})
it('contrato interno no admite magnitud ajena',()=>{
 const c=interno('1','3');expect(()=>magnitud({...c,magnitudesMotor:c.magnitudesMotor.map(m=>({...m,declarantes:['Q']}))},'cuotaIntegraAutonomica')).toThrow();
})
