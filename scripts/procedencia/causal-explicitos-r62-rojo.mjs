import assert from 'node:assert/strict';
import { composeRentasR36 } from './flujo-rentas-r36.mjs';
import { consumeExplicitRentas } from './flujo-rentas-r36-consumidor.mjs';
import { explicit } from './causal-escalas-r60-casos.mjs';
import { loadTs } from './causal-explicitos-r62-oracle.mjs';
const boundaries={};
for (const [file,names] of [
 ['lib/dominio/irpf/comunidades/comunidad-autonoma.ts',['obtenerParametrosComunidadAutonoma']],
 ['lib/dominio/irpf/cuotas/escalas-publicadas.ts',['obtenerEscalaAutonomicaPublicada']],
 ['lib/dominio/irpf/cuotas/escalas-gravamen.ts',['calcularCuotaPorEscala']],
 ['lib/dominio/normativa/datos/minimos-autonomicos-2025.ts',['MINIMOS_ESTATALES_2025']],
]) for(const n of names) boundaries['boundary:'+n]=loadTs(file)[n];
const out=consumeExplicitRentas(composeRentasR36(),explicit(),boundaries);
assert.equal(out.status,'success',JSON.stringify(out));
assert.equal(out.result._tag,'LiquidacionIrpfAnualExplicitaCalculada');
console.log('Salida real alcanzada',out.result.cuotaDiferencial);
assert.ok(out.evidence,'Falta evidencia causal por propiedad hasta origen.decimal');
