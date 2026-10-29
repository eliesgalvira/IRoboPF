import { buscar } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/lib/procedencia/almacen.ts'
const v1='8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3',v2='efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6';
const datos=[];for(const id of [v2,v2,v1,v2,v2]){const start=performance.now();const count=buscar(id,'Madrid').length;datos.push({snapshot:id,ms:performance.now()-start,count,rss:process.memoryUsage().rss})}process.stdout.write(JSON.stringify(datos,null,2)+'\n');
