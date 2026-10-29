import {readFileSync} from 'node:fs';
import Decimal from '/home/elies/Repos/IRoboPF/node_modules/decimal.js/decimal.mjs';
const root='/home/elies/.t3/worktrees/IRoboPF/t3-bddec546/';
const {obtenerParametrosComunidadAutonoma:select}=await import(root+'lib/dominio/irpf/comunidades/comunidad-autonoma.ts');
const m=JSON.parse(readFileSync(root+'docs/procedencia/inventario.json'));let selected=[];
for(const p of m.pages)selected.push(...JSON.parse(readFileSync(root+'docs/procedencia/'+p.file)).filter(i=>i.layer==='selected'));
const cases=[[2025,'madrid'],[2024,'aragon'],[2026,'simulada-estatal'],[2014,'galicia','17707.20'],[2014,'galicia','17707.21'],[2022,'comunitat-valenciana',null,'2022-10-27T00:00:00.000Z'],[2022,'comunitat-valenciana',null,'2022-10-28T00:00:00.000Z'],[2023,'illes-balears',null,'2023-11-25T00:00:00.000Z'],[2023,'illes-balears',null,'2023-11-26T00:00:00.000Z']];
const results=[];
for(const [year,territory,base,death] of cases){const s=select({anio:year,comunidadAutonoma:territory,baseLiquidableGeneral:base?new Decimal(base):undefined,fechaFallecimiento:death?new Date(death):undefined});const scenario=base?`base=${base}`:death?`fallecimiento=${death}`:'sin entradas opcionales';const prefix=`${year}/${territory}/${scenario}/`;let checked=0;for(const i of selected.filter(i=>i.path.startsWith(prefix))){let keys=i.path.slice(prefix.length).split('/');let v=({escalaEstatalGeneral:s.escalaEstatalGeneral,escalaAutonomica:s.escalaAutonomica.tramos,minimosAutonomicos:s.minimosAutonomicos});for(const k of keys)v=v[k];if(String(v)!==i.value)throw Error(i.path);checked++;}results.push({year,territory,scenario,checked,firstBracket:s.escalaAutonomica.tramos[0].map(String),minimum:String(s.minimosAutonomicos.contribuyente.general)});}
console.log(JSON.stringify(results,null,2));
