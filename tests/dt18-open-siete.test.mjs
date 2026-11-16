import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {validateDT18Case,dt18UiReadback,dt18SesPdfReadback,dt18ReceiptReadback} from '../tools/procedencia/simuladores/dt18-open.mjs';
const fixtures=JSON.parse(readFileSync(new URL('./fixtures/dt18-binding-siete.json',import.meta.url)));
const pins=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/dt18-pins.json',import.meta.url)));
const clone=x=>structuredClone(x);
const v=f=>validateDT18Case(clone(f.caso),clone(f.caso));
const inventories=f=>({antes:f.readbacks.find(r=>r.key==='dt18-negativos-antes').observed,
  despues:f.readbacks.find(r=>r.key==='dt18-negativos-despues').observed});
const ui=(f,receipt=f.receipt,housing=f.housing,readbacks=f.readbacks)=>dt18UiReadback(receipt,readbacks,inventories(f),housing,f.caso);
const bind=(f,ses=f.ses,housing=f.housing)=>dt18SesPdfReadback(ses,f.pdfText,v(f),housing,f.readbacks);

describe('DT18 siete capturas originales: discriminantes sin fórmula fiscal',()=>{
  it('admite exactamente siete pins completos; Rioja no está admitida',()=>{
    expect(pins.map(p=>p.id)).toEqual([
      'open2025-canarias-01','open2025-extremadura-02','open2025-comunitat-valenciana-03',
      'open2025-madrid-04','open2025-andalucia-07','open2025-comunitat-valenciana-09','open2025-madrid-12']);
    for(const p of pins){expect(p.estado).toBe('captura-completa-observada');expect(Object.keys(p.originales)).toHaveLength(13);}
    const c=clone(fixtures[0].caso);c.id='open2025-la-rioja-01';c.territorio='la-rioja';
    expect(()=>validateDT18Case(c,c)).toThrow('dt18-solicitud-regional-no-observada');
  });
  it.each(fixtures.map(f=>[f.caso.id,f]))('%s: entrada intacta, recibo, UI, SES y tres casillas',(_id,f)=>{
    const before=JSON.stringify(f),checked=v(f);
    dt18ReceiptReadback(f.receipt,checked.pin);
    expect(ui(f)).toMatchObject({contratoHistorico:'externofactual'});
    expect(bind(f)).toMatchObject({estado:'transporte-dt18-ses-pdf-vinculado',countedAsMatch:false,casillas:f.casillas});
    expect(JSON.stringify(f)).toBe(before);
  });
  it.each(fixtures.map(f=>[f.caso.id,f]))('%s: rechaza identidad, territorio y pagos alterados',(_id,f)=>{
    const p=v(f).pin;
    for(const key of ['nif','name','birth','region']){
      const readbacks=clone(f.readbacks),r=readbacks.find(r=>r.key===key);
      if(key==='region'){r.selected='OTRA';r.observed='OTRA';}else {r.requested='OTRO';r.observed='OTRO';}
      const receipt=clone(f.receipt);receipt.readbacks=readbacks;
      expect(()=>ui(f,receipt,f.housing,readbacks)).toThrow('dt18-ui-identidad-distinta');
    }
    const wrong=p.codigoTerritorio==='12'?'05':'12';
    for(const key of ['CAC_D','ZCCAD']){
      const ses=f.ses.replace(`${key}~1~${p.codigoTerritorio}`,`${key}~1~${wrong}`);
      expect(ses).not.toBe(f.ses);expect(()=>bind(f,ses)).toThrow();
    }
    const ses=f.ses.replace('DPNIF_D~3~90000000B~254','DPNIF_D~3~90000001N~254');
    expect(ses).not.toBe(f.ses);expect(()=>bind(f,ses)).toThrow();
    const h=clone(f.housing);h.payments=p.payments==='3050.00'?'6000.00':'3050.00';
    expect(()=>ui(f,f.receipt,h)).toThrow('dt18-pagos-captura-distintos');
    expect(()=>bind(f,f.ses,h)).toThrow();
    for(const name of ['entrada.json','caso.json','captura.pdf','captura.ses']){
      const receipt=clone(f.receipt);
      if(name==='entrada.json')receipt.inputSha256='0'.repeat(64);
      if(name==='caso.json')receipt.caseSha256='0'.repeat(64);
      if(name==='captura.pdf')receipt.pdf.sha256='0'.repeat(64);
      if(name==='captura.ses')receipt.ses.sha256='0'.repeat(64);
      expect(()=>dt18ReceiptReadback(receipt,p)).toThrow('dt18-recibo-distinto');
    }
    for(const mutate of [r=>{r.countedAsMatch=true;},r=>{r.dt18.countedAsMatch=true;},
      r=>{r.transportComplete=false;},r=>{r.dt18.state='pending';},
      r=>{r.dt18.fields.find(x=>x.key==='payments').value='1.00';},
      r=>{r.dt18.fields.push(clone(r.dt18.fields[0]));}]){
      const receipt=clone(f.receipt);mutate(receipt);expect(()=>dt18ReceiptReadback(receipt,p)).toThrow();
    }
  });
  it('rechaza todos los cruces de recibo e identidad de caso, incluso región o pagos iguales',()=>{
    for(const f of fixtures)for(const other of fixtures){if(f===other)continue;
      expect(()=>dt18ReceiptReadback(other.receipt,v(f).pin)).toThrow();
      expect(()=>ui(f,other.receipt)).toThrow();
      expect(()=>validateDT18Case(f.caso,other.caso)).toThrow();
      const c=clone(f.caso);c.entradaAPI=clone(other.caso.entradaAPI);
      expect(()=>validateDT18Case(c,c)).toThrow();
      // Sólo cruces discriminables por el corte SES; no atribuir a SES una identidad de caso que no contiene.
      if(f.caso.territorio!==other.caso.territorio || f.housing.payments!==other.housing.payments)
        expect(()=>bind(f,other.ses)).toThrow();
    }
  });
  it('rechaza pagos y territorio de entrada aunque se cambie también el original aportado',()=>{
    for(const f of fixtures){
      const c=clone(f.caso);c.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025.proyectos[0].vivienda.pagos[0].importe='1.00';
      expect(()=>validateDT18Case(c,c)).toThrow('dt18-entrada-preparada-distinta');
      const t=clone(f.caso);t.territorio='territorio-ajeno';expect(()=>validateDT18Case(t,t)).toThrow();
    }
  });
  it.each(fixtures.map(f=>[f.caso.id,f]))('%s: concilia mínimos, identidad y modalidad del PDF completo',(_id,f)=>{
    const check=(ses,pdf)=>dt18SesPdfReadback(ses,pdf,v(f),f.housing,f.readbacks);
    for(const key of ['MPER','MPERAU','MPERFA','MPERFAAU']){
      const changed=f.ses.replace(new RegExp(`^( +${key}~1~)[^\\n]+`,'m'),(_all,prefix)=>prefix+'1.01');
      expect(changed).not.toBe(f.ses);expect(()=>check(changed,f.pdfText)).toThrow();
    }
    for(const key of ['DP_APENOM_D','ZAPENOM_D','SPNOM']){
      const changed=f.ses.replace(new RegExp(`^( +${key}~1~)[^\\n]+`,'m'),(_all,prefix)=>prefix+'OTRO SINTETICO');
      expect(changed).not.toBe(f.ses);expect(()=>check(changed,f.pdfText)).toThrow();
    }
    for(const box of ['0511','0512','0519','0520']){
      const line=f.pdfText.split('\n').find(l=>new RegExp(`\\b${box}\\s*$`).test(l));
      expect(line).toBeTruthy();
      for(const pdf of [f.pdfText.replace(line,''),f.pdfText+'\n'+line,f.pdfText.replace(line,`1,01 ${box}`)])
        expect(()=>check(f.ses,pdf)).toThrow();
    }
    for(const [from,to] of [['90000000B','90000001N'],['PRUEBA C OPEN','OTRO SINTETICO'],
      ['Tributación individual','Tributación conjunta'],['01/01/1985','01/01/1986']]){
      const pdf=f.pdfText.replaceAll(from,to);expect(pdf).not.toBe(f.pdfText);
      expect(()=>check(f.ses,pdf)).toThrow();
    }
    const threeLines=f.pdfText.split('\n').filter(l=>/\b(?:0547|0548|0670)\s*$/.test(l)).join('\n');
    expect(()=>check(f.ses,threeLines)).toThrow();
  });
});
