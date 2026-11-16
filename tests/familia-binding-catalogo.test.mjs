import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { completeFamilyReadback, familyMoneyReadback, validateFamilyCase, validateSyntheticFamilyCase } from '../tools/procedencia/simuladores/familia-open.mjs';
import { conciliarMinimosFamilia } from '../tools/procedencia/simuladores/vincular-open.mjs';
import { validateCase } from '../tools/procedencia/simuladores/capturar-casos.mjs';
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/familia-binding-catalogo.json', import.meta.url)));
const sample = () => { const f = structuredClone(fixtures.casos[0]); f.evidence.catalogos = [...fixtures.catalogos]; return f; };
const run = f => completeFamilyReadback(f.text, f.caso, f.evidence);
const rehash = f => { f.evidence.familyControls.sesLatin1Sha256 = createHash('sha256').update(Buffer.from(f.text,'latin1')).digest('hex'); };

describe('binding familiar sintético con catálogo versionado', () => {
  it.each(fixtures.casos.map(f => [f.caso.id, f]))('%s: censo cerrado y límites', (_id, original) => {
    const f = structuredClone(original); f.evidence.catalogos = [...fixtures.catalogos];
    const r = run(f);
    expect(validateCase(f.caso, {allowSyntheticFamily:true}).family).toBe(true);
    if (f.caso.entradaAPI.comunidadAutonoma !== 'madrid')
      expect(()=>validateCase(f.caso)).toThrow('Familia fuera del corte observado');
    expect(r.aptoParaBindingSintetico).toBe(true);
    expect(r.countedAsMatch).toBe(false);
    expect(r.censo).toEqual({controlesPersonales:41,descendientesActivos:1,ascendientesActivos:0});
    expect(r.hechosNoIntroducidosExactamente).toContain('situacion-vital-otro-progenitor');
    expect(r.monetarios.controles).toHaveLength(8);
  });
  it('sin catálogos mantiene el informe parcial', () => {
    const f=sample(); delete f.evidence.catalogos;
    expect(run(f).aptoParaBindingSintetico).toBe(false);
  });
  it.each(['VersionReglas="N000088955"','VersionModelo="0.12"'])('rechaza cambio de %s aun con hash actualizado', attr => {
    const f=sample(); f.text=f.text.replace(attr,attr.replace(/.$/,'X')); rehash(f);
    expect(()=>run(f)).toThrow();
  });
  it.each([0,1,2])('rechaza catálogo %i cambiado', i=>{
    const f=sample();f.evidence.catalogos[i]=f.evidence.catalogos[i].replace('Borrar','Ausencia');
    expect(()=>run(f)).toThrow('familia-catalogo-distinto');
  });
  it('rechaza intercambio de catálogos',()=>{const f=sample();f.evidence.catalogos.reverse();expect(()=>run(f)).toThrow('familia-catalogo-distinto');});
  it.each([
    f=>{f.evidence.familyControls.personal.push({...f.evidence.familyControls.personal[22],value:'90000002J'});},
    f=>{f.evidence.personalHtml+='<input id="extra" type="hidden" value="90000002J">';},
    f=>{f.evidence.familyControls.personal[22].value='90000002J';},
    f=>{f.evidence.familyControls.personal[23].value='01/01/2020';},
    f=>{f.evidence.familyControls.personal[35].value='OTRO';},
    f=>{f.evidence.familyControls.personal[18].checked=true;},
    f=>{f.evidence.familyControls.personal[40].value='1';},
    f=>{f.evidence.personalHtml=f.evidence.personalHtml.replace('value="90000002J"','value="90000001N"');},
    f=>{f.evidence.dialogoHtml=f.evidence.dialogoHtml.replace(f.evidence.familyControls.rows[0].dom.id,'sin-owner');},
    f=>{f.evidence.dialogoHtml+='<input id="otra-fila" type="text" value="">';},
    f=>{f.evidence.familyControls.rows[3].dom.checked=true;},
    f=>{f.evidence.familyControls.rows[6].dom.value='3';},
  ])('rechaza censo o controles contradictorios', mutate=>{const f=sample();mutate(f);expect(()=>run(f)).toThrow();});
  it.each([
    s=>s.replace('[DESCENDIENTES]','[DESCENDIENTES]\n     EXTRA~1~true'),
    s=>s.replace('[ASCENDIENTES]','[ASCENDIENTES]\n     DNIAS~1~90000002J'),
    s=>s.replace('[RWHIJOSMAYOR18]','[RWHIJOSMAYOR18]\n     FNAC~1~01/01/2000'),
    s=>s.replace('[DESCENDIENTES]','[DESCENDIENTES]\n    [DESCENDIENTES]'),
    s=>s.replace('[IRPF2025]','[IRPF2025]\n   VINCU2~1~D'),
    s=>s.replace('NOMH~1~HIJO','NOMH~1~HIJO\n     NOMH~1~HIJO'),
    s=>s.replace('UFHMENDLG~2~254','UFHMENDLG~1~true'),
    s=>s.replace('VNUMMDES~1~2','VNUMMDES~1~1'),
    s=>s.replace('MUJEROPAUX~1~true','MUJEROPAUX~1~false'),
  ])('rechaza SES extra o contradictorio sin depender del hash', mutate=>{
    const f=sample();f.text=mutate(f.text);rehash(f);expect(()=>run(f)).toThrow();
  });
  it.each(['IDII','GSS','IDRE','GCS','GCC','GDJ','IDICLDED2','GSSCLDED2'])('contrasta dinero %s', key=>{
    const f=sample();f.evidence.readbacks.find(r=>r.key===key).observed='0,01';
    expect(()=>familyMoneyReadback(f.caso,f.evidence)).toThrow('familia-moneda-distinta');
  });
  it('rechaza moneda duplicada',()=>{const f=sample();f.evidence.readbacks.push(f.evidence.readbacks.find(r=>r.key==='IDII'));expect(()=>run(f)).toThrow('familia-moneda-ausente-o-duplicada');});
  it('conserva C300 adulto fuera de la rama nueva',()=>{
    const cs=JSON.parse(readFileSync(new URL('./fixtures/c300-variantes.json',import.meta.url)));
    const adult=cs.find(c=>c.id.includes('extension-familia-') && c.entrada?.derechosMinimos.descendientes[0].edadDevengo>=18);
    expect(adult).toBeDefined();expect(validateFamilyCase(adult).menor).toBe(false);
    expect(()=>validateSyntheticFamilyCase(adult)).toThrow();
  });
});

const minSes=`<?xml?><PERSISTENCIAV2>\n[DECLARACIONES]\n  [IRPF2025]\n`+Object.entries({MPER:'5550',MPERAU:'5956.65',MDES:'1200',MDESAU:'1287.93',MPERFA:'6750',MPERFAAU:'7244.58'}).map(([k,v])=>`   ${k}~1~${v}`).join('\n');
const minPdf=['5.550,00 0511','5.956,65 0512','1.200,00 0513','1.287,93 0514','6.750,00 0519','7.244,58 0520'].join('\n');
describe('mínimos familiares: contraste de artefactos, sin fórmula fiscal',()=>{
  it('concilia las seis casillas',()=>expect(conciliarMinimosFamilia(minSes,minPdf).casillas).toEqual(['0513','0514','0511','0512','0519','0520']));
  it.each(['0511','0512','0513','0514','0519','0520'])('falla si falta %s',box=>expect(()=>conciliarMinimosFamilia(minSes,minPdf.split('\n').filter(l=>!l.endsWith(box)).join('\n'))).toThrow());
  it('falla por contradicción',()=>expect(()=>conciliarMinimosFamilia(minSes,minPdf.replace('1.200,00','1.200,01'))).toThrow());
  it('falla por duplicado PDF',()=>expect(()=>conciliarMinimosFamilia(minSes,minPdf+'\n1.200,00 0513')).toThrow());
  it('falla por duplicado SES',()=>expect(()=>conciliarMinimosFamilia(minSes+'\n   MDES~1~1200',minPdf)).toThrow());
});
