import { readFileSync, writeFileSync } from 'node:fs';
import { Effect, Cause } from 'effect';
import Decimal from 'decimal.js';
import { liquidarIrpfAnualExplicito } from '/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1/checkout-validacion/lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts';
import { enlazarRastroAnualActual } from '/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1/checkout-validacion/lib/procedencia/rastro-anual.ts';
import { resolver } from '/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1/checkout-validacion/lib/procedencia/almacen.ts';
const dir='/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1';
const cases=JSON.parse(readFileSync(dir+'/casos.json','utf8'));
const results=cases.map(c=>{
 const exit=Effect.runSyncExit(liquidarIrpfAnualExplicito(c.entrada));
 const serialized=JSON.parse(JSON.stringify(exit)); if (exit._tag==='Failure') serialized.diagnostico=Cause.pretty(exit.cause);
 const ok=exit._tag==='Success' ? !c.rechazo && Object.entries(c.esperado).every(([k,v])=>new Decimal(exit.value[k]).eq(v)) : c.rechazo && JSON.stringify(serialized).includes('ResultadoNoSoportado') && !JSON.stringify(serialized).includes('"Die"');
 return {id:c.id,ok,esperado:c.esperado,exit:serialized};
});
writeFileSync(dir+'/resultados.json',JSON.stringify(results,null,2));
const traces=results.filter(r=>r.id==='empleo-laboral-16576.01' && r.exit._tag==='Success').concat(results.filter(r=>r.id==='eds-10000' && r.exit._tag==='Success')) .map(r=>{
 const raw=r.exit.value.rastro;
 const linked=enlazarRastroAnualActual(raw);
 return {id:r.id,contexto:raw.contexto??null,lineas:raw.pasos.flatMap(p=>p.lineasCalculo??[]),resolucionManual:linked.pasos.flatMap(p=>p.lineasCalculo??[]).map(l=>({origen:l.origen,procedencia:l.procedencia,tipo:resolver(l.procedencia.snapshot,l.procedencia.sujeto.id,l.procedencia.sujeto.revision)?.tipo}))};
});
writeFileSync(dir+'/resultados.json',JSON.stringify(results,null,2));
writeFileSync(dir+'/rastro.json',JSON.stringify(traces,null,2));
console.log(JSON.stringify({total:results.length,discrepancias:results.filter(r=>!r.ok).map(r=>({id:r.id,esperado:r.esperado,salida:r.exit.value ? {base:r.exit.value.baseImponibleGeneral,cuota:r.exit.value.cuotaLiquidaLegal,diferencial:r.exit.value.cuotaDiferencial,presentada:r.exit.value.cuotaDiferencialPresentada} : r.exit.cause})),rastro:traces.map(r=>({id:r.id,contexto:r.contexto,lineas:r.lineas.length,enlazadas:r.lineas.filter(l=>l.procedencia?.estado==='enlazada').length,resolubles:r.resolucionManual.filter(l=>l.tipo==='Step').length}))},null,2));
process.exitCode=results.some(r=>!r.ok)?1:0;
import { verificarRastroGenerado } from './checkout-validacion/scripts/procedencia/rastro-verificar.mjs';
writeFileSync(dir+'/catalogo-verificacion.json',JSON.stringify(verificarRastroGenerado('/home/elies/.t3/worktrees/IRoboPF/t3-f9097ac4'),null,2));
