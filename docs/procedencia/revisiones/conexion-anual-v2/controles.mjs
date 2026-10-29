import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import Decimal from 'decimal.js';
import { Effect } from 'effect';
import { liquidarIrpfAnual } from '../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts';
import { sinDiscapacidad } from '../../lib/dominio/irpf/caso-fiscal-anual.ts';
import { obtenerEscalaAutonomicaPublicada } from '../../lib/dominio/irpf/cuotas/escalas-publicadas.ts';
import { calcularCuotaPorEscala } from '../../lib/dominio/irpf/cuotas/escalas-gravamen.ts';
import { enlazarRastroAnualActual } from '../../lib/procedencia/rastro-anual.ts';
const dir=import.meta.dirname;
const r=Effect.runSync(liquidarIrpfAnual({anio:2025,comunidadAutonoma:'madrid',situacionFamiliar:{tipo:'individual',edad:40,descendientes:[],ascendientes:[],discapacidad:sinDiscapacidad},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0},{modo:'canonico'}));
assert.equal(r.baseLiquidableGeneralCentimos,2605600);
assert.equal(r.cuotaIntegraGeneralCentimos,563326);
assert.equal(r.cuotaMinimoPersonalCentimos,103357);
assert.equal(r.cuotaLiquidaCentimos,459969);
const tabla=obtenerEscalaAutonomicaPublicada({anio:2025,comunidadAutonoma:'madrid'});
const rows=[['0','0','.085'],['13362.22','1135.79','.107'],['19004.63','1739.53','.128'],['35425.68','3841.42','.174'],['57320.40','7651.10','.205']];
const fronteras=[];
for(const [lo] of rows) for(const delta of ['-.01','0','.01']) {
 const b=new Decimal(lo).plus(delta);if(b.lt(0))continue;
 const row=rows.filter(row=>b.gte(row[0])).at(-1);
 const esperado=new Decimal(row[1]).plus(b.minus(row[0]).times(row[2])).toFixed();
 const actual=calcularCuotaPorEscala({base:b,tramos:[],escalasPublicadas:[tabla]}).toFixed();
 assert.equal(actual,esperado);fronteras.push({base:b.toFixed(),esperado,actual});
}
assert.equal(obtenerEscalaAutonomicaPublicada({anio:2025,comunidadAutonoma:'madrid',fechaFallecimiento:new Date('2025-12-30')}),undefined);
for(const anio of [2023,2024,2026])assert.equal(obtenerEscalaAutonomicaPublicada({anio,comunidadAutonoma:'madrid'}),undefined);
const traces=JSON.parse(readFileSync(dir+'/rastro.json','utf8'));
const ids=new Set();
for(const t of traces){
 assert.deepEqual(t.contexto,{anio:2025,territorio:'madrid',perfilCalculo:t.id.startsWith('eds')?'solo-actividad-eds':'solo-trabajo'});
 for(const l of t.lineas){ids.add(l.origen.siteId);assert.equal(l.procedencia.snapshot,'efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6');assert.equal(l.procedencia.estado,'enlazada');assert.equal(l.origen.unidad,'EUR');}
 assert.throws(()=>enlazarRastroAnualActual({titulo:'histórico',pasos:[{lineasCalculo:t.lineas}]}),/ya versionado/);
}
assert.equal(ids.size,16);
writeFileSync(dir+'/controles.json',JSON.stringify({canonico:r,fronteras,siteIds:[...ids],retagging:'rechazado',alcanceSelector:'2025 ordinario'},null,2));
