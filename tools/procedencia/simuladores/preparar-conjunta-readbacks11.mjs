// Preparación offline, exclusivamente sintética. No ejecuta bindStrict ni producto.
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {inflateSync} from 'node:zlib';
import {loadRelative} from './vincular-conjunta-estricta.mjs';
import {adaptMoney11} from './conjunta-readbacks11.mjs';
import {accessSES} from './conjunta-ses.mjs';
import {rawPdfRows} from './conjunta-pdf.mjs';
import {need,hash,canonical,census,versionMetadata,controlsProjection,catalogs} from './conjunta-estricta.mjs';
export function prepare11(planBytes,captureRoot,repoRoot,out) {
  const plan=JSON.parse(planBytes),cases=[],skipped=[];
  mkdirSync(out,{recursive:false});
  for(const c of plan.cases) {
    need(/^[a-z0-9-]+$/.test(c.id),'caso-ruta');
    const base=resolve(captureRoot,c.id);
    if(!existsSync(resolve(base,'recibo.json'))){skipped.push(c.id);continue}
    const receiptBytes=loadRelative(base,'recibo.json'),receipt=JSON.parse(receiptBytes);
    need(receipt.captura==='conservada','recibo-no-final');
    const files=Object.fromEntries(receipt.files.map(f=>[f.file,loadRelative(base,f.file)]));
    const adapted=adaptMoney11({casePlan:c,receiptBytes,files});
    const fixtureBytes=Buffer.from(JSON.stringify(c.fixture));
    const expedienteBytes=loadRelative(repoRoot,c.fixture.expediente);
    need(hash(expedienteBytes)===c.fixture.sha256Expediente,'expediente-integridad');
    const readbacks=JSON.parse(files['readbacks.json']);
    const html=step=>files[receipt.files.find(f=>f.file.startsWith(String(step).padStart(3,'0')+'-')&&f.file.endsWith('.html')).file].toString('utf8');
    const text=inflateSync(files['exportado.ses'],{maxOutputLength:4194304}).toString('latin1');
    const reference={schema:'conjunta-referencia-raw11-v1',id:c.id,fixtureSha256:hash(fixtureBytes),expedienteSha256:hash(expedienteBytes),
      census:census(text),metadata:versionMetadata(accessSES(text)),
      controls:readbacks.filter(r=>r.controls).map(r=>({step:r.step,controls:controlsProjection(r.controls)})),
      actionObservations:readbacks.filter(r=>!r.controls),catalogs:Object.fromEntries(readbacks.filter(r=>r.controls).map(r=>[r.step,catalogs(html(r.step))])),
      pdfRowsSha256:hash(canonical(rawPdfRows(files['exportado.pdf']).map(r=>r.text))),casePlan:c,
      source:{receiptSha256:hash(receiptBytes),planSha256:hash(planBytes),sesSha256:hash(files['exportado.ses']),pdfSha256:hash(files['exportado.pdf']),rawBundleSha256:adapted.money[0].rawBundleSha256},
      authority:{estado:c.id==='open2025-aragon-02-v2'?'conflicto-pendiente':'contrato-ficticio-sintetico',
        motivo:c.id==='open2025-aragon-02-v2'?'hogar-legacy-diverge-de-entrada-v2':null}};
    const put=(n,v)=>writeFileSync(resolve(out,n),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
    put(c.id+'.json',reference);put(c.id+'.money.json',adapted.money);
    // No copy of captures, SES, PDF, raw sources or private fixture packages.
    cases.push({id:c.id,file:c.id+'.json',sha256:hash(readFileSync(resolve(out,c.id+'.json'))),estado:reference.authority.estado});
  }
  const index={schema:'referencias-revision-lote11-v1',cases,skipped,excluded:plan.excluded,estado:'requiere-revision'};
  writeFileSync(resolve(out,'index.json'),JSON.stringify(index,null,2)+'\n',{flag:'wx'});return index;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const [plan,captures,repo,out]=process.argv.slice(2);need(process.argv.length===6,'uso-plan-capturas-raiz-salida-nueva');
  console.log(JSON.stringify(prepare11(readFileSync(plan),captures,repo,out)));
}
