import { Effect } from 'effect';
import Decimal from 'decimal.js';
const load=p=>import(`${process.cwd()}/${p}`);
const {calcularSalarioLegacy:sal}=await load('lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts');
const {auditarProgresividadFrio:aud,construirPuntosAuditoriaAnioAjustado:serie}=await load('lib/dominio/auditoria/auditoria-progresividad-frio.ts');
const {factorIpcPerfilLegacy:ipc}=await load('lib/dominio/inflacion/factor-ipc.ts');
const {construirTablaDetalleAnualCompatible:tabla}=await load('lib/dominio/compatibilidad-legacy/progresividad-frio.ts');
const rows=[];
const check=(id,expected,actual)=>rows.push({id,expected,actual,ok:expected===actual});
const run=fx=>Effect.runSync(fx);
const rango={salarioBrutoAnualMinimoCentimos:6000000,salarioBrutoAnualMaximoCentimos:6000000,pasoCentimos:100};
for(const modo of ['canonico','compatible-legacy'])for(const [a,b] of [[2018,2025],[2025,2018],[2025,2026],[2026,2025]]){
 const f=ipc(a,b).factor;
 const nominal=new Decimal(6000000).div(f).toDecimalPlaces(0).toNumber();
 const ref=run(sal({anio:b,salarioBrutoAnualCentimos:6000000,modo}));
 const cmp=run(sal({anio:a,salarioBrutoAnualCentimos:nominal,modo}));
 const r=run(aud({...rango,perfil:'legacy-progresividad-frio',anioComparado:a,anioReferencia:b},{modo})).auditoria.puntos[0].comparacion;
 const s=run(serie({...rango,anio:a,anioReferencia:b,modo}))[0].comparacion;
 for(const campo of ['cotizacionTrabajadorCentimos','salarioNetoAnualCentimos','irpfFinalCentimos']){
  check(`referencia-${modo}-${a}-${b}-${campo}`,ref[campo],r.referencia[campo]);
  const ajustado=new Decimal(cmp[campo]).mul(f).toDecimalPlaces(0).toNumber();
  check(`comparado-${modo}-${a}-${b}-${campo}`,ajustado,r.comparado.ajustado[campo]);
  check(`serie-${modo}-${a}-${b}-${campo}`,ajustado,s.referencia[campo]);
 }
}
for(const [id,salario,columna,expected] of [['D32',30,3,1.9],['E12',10,4,9.36],['W12',10,22,9.36],['Q2',0,16,1274.87]])check(`oracle-${id}`,expected,Array.from(tabla(2012,{salarioMinimoEuros:salario,salarioMaximoEuros:salario,pasoEuros:1}).filas)[0][columna]);
console.log(JSON.stringify(rows,null,2));console.error(JSON.stringify({total:rows.length,fallos:rows.filter(r=>!r.ok)}));
