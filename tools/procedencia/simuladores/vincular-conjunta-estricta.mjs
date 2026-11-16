import {Schema} from 'effect';
import {adaptMoney11} from './conjunta-readbacks11.mjs';
import {readFileSync,realpathSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,isAbsolute} from 'node:path';
import {pathToFileURL} from 'node:url';
import {bindStrict,need,hash} from './conjunta-estricta.mjs';
export function loadRelative(base,name) {
  need(Schema.is(Schema.String)(name)&&!isAbsolute(name)&&!name.includes('\\')&&name.split('/').every(p=>p&&p!=='.'&&p!=='..'),'ruta-invalida');
  const root=realpathSync(base),file=realpathSync(resolve(root,name)),rel=relative(root,file);
  need(rel&&!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('../'),'ruta-fuera-base');
  need(statSync(file).isFile()&&statSync(file).size<=16*1024*1024,'archivo-excesivo');return readFileSync(file);
}
// Paquete privado: fixture.json = JSON.stringify(plan.cases[i].fixture), sin LF.
// expediente.json conserva los bytes originales. Ninguna captura se altera.
export function collect(base,id) {
  const index=JSON.parse(readFileSync(new URL('./conjunta-referencias/index.json',import.meta.url)));
  need(!index.excluded.some(x=>x.id===id),'monoparental-sin-evidencia');
  const entries=index.cases.filter(x=>x.id===id);need(entries.length===1,'caso-sin-referencia');
  const pin=entries[0],referenceBytes=readFileSync(new URL('./conjunta-referencias/'+pin.file,import.meta.url));
  const receiptBytes=loadRelative(base,'recibo.json'),receipt=JSON.parse(receiptBytes);
  const reference=JSON.parse(referenceBytes);need(hash(receiptBytes)===reference.source.receiptSha256,'recibo-integridad');
  let authority={};
  if(reference.authority?.archivo) {
    const authorityBytes=loadRelative(base,'autoridad.json');
    need(hash(authorityBytes)===reference.authority.sha256,'autoridad-integridad');
    const addition=JSON.parse(authorityBytes),source=loadRelative(base,'diseno.json');
    need(hash(source)===addition.disenoSha256,'autoridad-fuente-integridad');
    authority={authorityBytes,authoritySources:{[addition.disenoSha256]:source}};
  }
  const seen=new Set();
  for(const f of receipt.files) {
    need(!seen.has(f.file),'recibo-duplicado');seen.add(f.file);
    const bytes=loadRelative(base,f.file);need(bytes.length===f.bytes&&hash(bytes)===f.sha256,'artefacto-integridad');
  }
  const monetary=reference.casePlan?adaptMoney11({casePlan:reference.casePlan,receiptBytes,files:Object.fromEntries(receipt.files.map(f=>[f.file,loadRelative(base,f.file)]))}):{};
  const readbacks=JSON.parse(loadRelative(base,'readbacks.json'));
  const htmlByStep=Object.fromEntries(readbacks.filter(r=>r.controls).map(r=>{
    const names=receipt.files.filter(f=>f.file.startsWith(String(r.step).padStart(3,'0')+'-')&&f.file.endsWith('.html'));
    need(names.length===1,'html-no-unico');return [r.step,loadRelative(base,names[0].file).toString('utf8')];
  }));
  return {fixtureBytes:loadRelative(base,'fixture.json'),expedienteBytes:loadRelative(base,'expediente.json'),
    sesBytes:loadRelative(base,'exportado.ses'),pdfBytes:loadRelative(base,'exportado.pdf'),
    referenceBytes,referenceSha256:pin.sha256,readbacks,htmlByStep,...monetary,...authority};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const [base,id,out]=process.argv.slice(2);need(base&&id&&out&&process.argv.length===5,'uso-paquete-id-salida-nueva');
  let result;try{result=bindStrict(collect(base,id));}catch(error){result={estado:'pendiente',countedAsMatch:false,motivo:/^[a-z0-9_-]+$/.test(error.message)?error.message:'vinculo-fallo'};}
  mkdirSync(out,{recursive:false});writeFileSync(resolve(out,'recibo.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
}
