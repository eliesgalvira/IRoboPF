import {extractTs} from '/home/elies/.t3/worktrees/IRoboPF/t3-bddec546/scripts/procedencia/inventario-ast.mjs';
import {flatten,dimensions,validate} from '/home/elies/.t3/worktrees/IRoboPF/t3-bddec546/scripts/procedencia/inventario.mjs';
const result={};
const a=extractTs('fixture.ts','const t=[10,20];'); const b=extractTs('fixture.ts','const t=[5,10,20];');
result.ids=a.items.filter(x=>x.value).map(x=>({old:x.value,new:b.items.find(y=>y.id===x.id)?.value,id:x.id}));
result.literals=extractTs('fixture.ts','const t=["1E-3",-2,3n,Infinity,"hasta 42 euros"]; const f=(x)=> Math.floor(x); const g=(x)=>x==2;').items.map(({expression,value,kind})=>({expression,value,kind}));
result.bigint=flatten(42n); let cyc={x:1};cyc.self=cyc;result.cycle=flatten(cyc);
result.fakeDecimal=flatten({constructor:{name:'Decimal'}, amount:123});
result.fakeTag=flatten({[Symbol.toStringTag]:'Number',amount:123});
result.dimensions=dimensions('MINIMOS_ESTATALES_2025',['fuente','2024','madrid']);
let item=a.items[0];item.evidence='verified';try{validate(a.items,['fixture.ts']);result.evidence='accepted'}catch(e){result.evidence=e.message}
result.unicode=extractTs('fixture.ts','const ñ="😀"; const x=12;').items.filter(x=>x.value==='12');
console.log(JSON.stringify(result,null,2));
