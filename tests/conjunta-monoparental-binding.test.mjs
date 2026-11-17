// Fixtures exclusivamente sintéticos. Preparado; ejecución a cargo de integración.
import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {validateMonoparentalEntry,validateMonoparentalUI,validateSES,census,validatePdf,hash} from '../tools/procedencia/simuladores/conjunta-estricta.mjs';
import {replayOpenBytes} from '../tools/procedencia/simuladores/vincular-conjunta-open.mjs';
const base=new URL('../tools/procedencia/simuladores/conjunta-referencias/',import.meta.url);
for(const id of ['open2025-madrid-02','open2025-castilla-y-leon-03']) {
  const ref=JSON.parse(readFileSync(new URL(id+'.json',base))),entry=ref.casePlan.fixture.entradaCandidata;
  test(id+' contrato monoparental y adversas',()=>{
    validateMonoparentalEntry(entry);
    for(const edit of [
      e=>e.conyuge={id:'s-2'},e=>e.declarante.estadoCivil='casado',
      e=>e.otroProgenitorExterno.convive=true,e=>e.otroProgenitorExterno.derechoMinimo=true,
      e=>e.otroProgenitorExterno.incluyeHijoOtraConjunta=true,e=>e.convivientesTodo2025.push('s-2'),
      e=>e.hijos.push(structuredClone(e.hijos[0])),e=>e.miembros.push('s-2'),
      e=>e.hijos[0].progenitoresTitulares.push('s-2'),e=>e.hijos[0].guardaCustodia='compartida',
      e=>e.hijos[0].alimentosJudiciales=true,e=>e.censoAlDevengoCompleto=false
    ]) {const changed=structuredClone(entry);edit(changed);assert.throws(()=>validateMonoparentalEntry(changed));}
  });
  test(id+' B/SI no equivale a B/NO ni otro censo SES',()=>{
    const bytes=readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/conjuntas-oficiales/'+id+'.json.gz',import.meta.url));
    // Leer el compacto sin ejecutar producto ni cálculo para construir adversas documentales.
    const p=JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema,'conjunta-open-lossless-v2');
    const sesText=p.ses.utf8;
    const readbacks=JSON.parse(Buffer.from(p.files['readbacks.json'],'base64'));
    validateMonoparentalUI(readbacks);
    const no=structuredClone(readbacks),obs=no.find(r=>r.action?.expected==='SI');
    obs.observed='NO';obs.action.expected='NO';
    assert.throws(()=>validateMonoparentalUI(no),/monoparental-ui-solicitud/);
    const inventory=structuredClone(readbacks);
    inventory[inventory.findIndex(r=>r.action?.expected==='SI')+1].controls
      .find(c=>c.containerTitle==='Hijo que forma parte de la unidad familiar (Si/No)').value='NO';
    assert.throws(()=>validateMonoparentalUI(inventory));
    const ses=validateSES(sesText,ref,entry);
    validatePdf(Buffer.from(p.files['exportado.pdf'],'base64'),ses);
    for(const edit of [
      s=>s.replace('UFHMEN~1~1','UFHMEN~1~0'),
      s=>s.replace('VINCU~1~B','VINCU~1~D'),
      s=>s.replace('DPNIF_C~2~254','DPNIF_C~3~90000001N~254'),
      s=>s.replace('TITULAR~1~DECLARANTE','TITULAR~1~CONYUGE'),
      s=>s.replace('ZQ2~1~true','ZQ2~1~false')
    ]) {
      const changed=edit(sesText);assert.notEqual(changed,sesText);
      // Reanclar el censo editable para probar también guardas semánticas.
      assert.throws(()=>validateSES(changed,{...ref,census:census(changed)},entry));
    }
    const referenceBytes=readFileSync(new URL(id+'.json',base));
    const result=replayOpenBytes(bytes,{referenceBytes,referenceSha256:hash(referenceBytes),fixtureBytes:Buffer.from(JSON.stringify(ref.casePlan.fixture))});
    assert.equal(result.resultadoConjuntaEUR,id==='open2025-madrid-02'?'-1823.80':'-967.24');
    assert.equal(result.controlesMonetariosReplay.length,5);
    assert.equal(result.countedAsMatch,false);
    const originalPDF=Buffer.from(p.files['exportado.pdf'],'base64');
    assert.throws(()=>validatePdf(originalPDF,{...ses,joint:ses.p.instance('IRPF2025','TITULAR','DECLARANTE')}));
    for(const key of ['CINTEST','CINTAUT','CLIQT','RESULTADO']) {
      const contradictory=validateSES(sesText,ref,entry);
      const rows=contradictory.p.records.filter(r=>r.scope===contradictory.joint.id&&r.key===key);
      assert.equal(rows.length,1);assert.notEqual(rows[0].value,'0.00');
      rows[0].value='0.00';
      assert.throws(()=>validatePdf(originalPDF,contradictory),/pdf-dinero-/);
    }
  });
}
test('preserva exactamente las ocho referencias matrimoniales anteriores',()=>{
  const index=JSON.parse(readFileSync(new URL('index.json',base)));
  const married=index.cases.filter(p=>!['open2025-madrid-02','open2025-castilla-y-leon-03'].includes(p.id));
  assert.equal(married.length,8);
  for(const pin of married) {
    const bytes=readFileSync(new URL(pin.file,base));assert.equal(hash(bytes),pin.sha256);
    assert.equal(JSON.parse(bytes).casePlan.fixture.entradaCandidata.tipoUnidad,'matrimonial');
  }
});
