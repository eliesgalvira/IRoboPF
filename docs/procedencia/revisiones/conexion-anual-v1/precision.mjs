import { readFileSync, writeFileSync } from 'node:fs';
import Decimal from 'decimal.js';
import { Effect } from 'effect';
import { liquidarIrpfAnualExplicito } from '/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1/checkout-validacion/lib/dominio/irpf/trabajo-anual/conexion.ts';
import { calcularDeduccionTrabajo } from '/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/conexion-anual-v1/checkout-validacion/lib/dominio/irpf/trabajo-anual/calcular.ts';
const dir=import.meta.dirname;
const cases=JSON.parse(readFileSync(dir+'/casos.json','utf8'));
const out=[];
for (const precision of [20,60,80]) {
 Decimal.set({precision});
 for (const id of ['cuota-publicada-centimo','eds-10000-importes-maximos']) {
  const c=cases.find(c=>c.id===id);
  const exit=Effect.runSyncExit(liquidarIrpfAnualExplicito(c.entrada));
  out.push({id,precision,exit:exit._tag==='Success'?{base:exit.value.baseImponibleGeneral,cuota:exit.value.cuotaLiquidaLegal,presentada:exit.value.cuotaDiferencialPresentada}:exit});
 }
}
Decimal.set({precision:20});
const d=calcularDeduccionTrabajo({regla:'da61',ambito:'comun-individual',ejercicio:2025,brutoServicios:'16576.01',otrasRentasNoExentas:'0',netoReducidoServicios:'10291.0275',baseLiquidableGeneral:'10291.0275',cuotaIntegraGeneral:'818.819700000000000000000000000000000000000000000000000000000001',cuotaLiquidaTotal:'818.819700000000000000000000000000000000000000000000000000000001',cuotaTrasArt80:'818.819700000000000000000000000000000000000000000000000000000001',etapa:'despues-art80-sin-deduccion-trabajo',calificacion:'laboral-estatutaria-acreditada'});
out.push({id:'magnitud-60-decimales',resultado:d});
writeFileSync(dir+'/precision.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
