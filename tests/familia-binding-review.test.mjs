import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { completeFamilyReadback } from '../tools/procedencia/simuladores/familia-open.mjs';
import { validateCase } from '../tools/procedencia/simuladores/capturar-casos.mjs';
import { conciliarMinimosFamilia, vincularOpen } from '../tools/procedencia/simuladores/vincular-open.mjs';
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/familia-binding-catalogo.json', import.meta.url)));
const sample = () => { const f=structuredClone(fixtures.casos[0]); f.evidence.catalogos=[...fixtures.catalogos]; return f; };
const run = f => completeFamilyReadback(f.text,f.caso,f.evidence);
const money = ['IDII','GSS','IDRE','GCS','GCC','GDJ','IDICLDED2','GSSCLDED2'];
describe('revisi\u00F3n adversa independiente de binding familiar',()=>{
  it.each(fixtures.casos.map(f=>[f.caso.id,f]))('%s mantiene transporte general acotado',(_id,f)=>{
    expect(validateCase(f.caso,{allowSyntheticFamily:true}).family).toBe(true);
    if(f.caso.entradaAPI.comunidadAutonoma!=='madrid') expect(()=>validateCase(f.caso)).toThrow();
  });
  it.each(money)('rechaza ausencia de readback %s',key=>{
    const f=sample(); f.evidence.readbacks=f.evidence.readbacks.filter(r=>r.key!==key); expect(()=>run(f)).toThrow();
  });
  it.each(money)('rechaza duplicado de readback %s',key=>{
    const f=sample(); f.evidence.readbacks.push(structuredClone(f.evidence.readbacks.find(r=>r.key===key))); expect(()=>run(f)).toThrow();
  });
  it.each(money)('rechaza requested ajeno en %s',key=>{
    const f=sample(); f.evidence.readbacks.find(r=>r.key===key).requested='999999.99'; expect(()=>run(f)).toThrow();
  });
  it('no convierte el legado sin cat\u00E1logos en total',()=>{
    const f=sample(); delete f.evidence.catalogos;
    expect(run(f).aptoParaBindingSintetico).toBe(false); expect(run(f).countedAsMatch).toBe(false);
  });
  it('rechaza hash de entrada ajeno',()=>{
    const f=sample(); f.evidence.familyControls.entradaSha256='0'.repeat(64); expect(()=>run(f)).toThrow();
  });
  it('rechaza cambio SES sin actualizar digest',()=>{
    const f=sample(); f.text=f.text.replace('NOMH~1~HIJO','NOMH~1~AJENO'); expect(()=>run(f)).toThrow();
  });
  it('rechaza ascendiente aun recalculando digest',()=>{
    const f=sample(); f.text=f.text.replace('[ASCENDIENTES]','[ASCENDIENTES]\n     DNIAS~1~90000002J');
    f.evidence.familyControls.sesLatin1Sha256=createHash('sha256').update(Buffer.from(f.text,'latin1')).digest('hex');
    expect(()=>run(f)).toThrow();
  });
});
const boxes={MPER:'0511',MPERAU:'0512',MDES:'0513',MDESAU:'0514',MPERFA:'0519',MPERFAAU:'0520'};
const ses='<?xml?><PERSISTENCIAV2>\n[DECLARACIONES]\n  [IRPF2025]\n'+Object.keys(boxes).map(k=>'   '+k+'~1~1200').join('\n');
const pdf=Object.values(boxes).map(b=>'1.200,00 '+b).join('\n');
describe('m\u00EDnimos PDF: el signo forma parte del importe',()=>{
  it.each(Object.values(boxes))('rechaza negativo en %s',box=>{
    expect(()=>conciliarMinimosFamilia(ses,pdf.replace('1.200,00 '+box,'-1.200,00 '+box))).toThrow();
  });
});
// Integraci\u00F3n privada opcional. Ejecutar en serie con C_PDFTOTEXT absoluto.
// No invoca motor ni navegador. Las variables se resuelven s\u00F3lo en el equipo ejecutor.
const obs=process.env.C_FAMILY_REVIEW_OBSERVACIONES;
const base=process.env.C_FAMILY_REVIEW_BASE;
const enabled=Boolean(obs&&base&&process.env.C_PDFTOTEXT);
const cases=enabled?JSON.parse(readFileSync(obs)).casos.filter(c=>c.evidenciaOpen?.familia):[];
describe.skipIf(!enabled)('18 originales integrados: pipeline de binding',()=>{
  it('cubre exactamente 18 identidades',()=>{expect(cases).toHaveLength(18);expect(new Set(cases.map(c=>c.id)).size).toBe(18);});
  it.each(cases.map(c=>[c.id,c]))('%s vincula s\u00F3lo la proyecci\u00F3n',(_id,c)=>{
    const r=vincularOpen(c,base);
    expect(r.estado).toBe('entrada-ses-y-resultado-pdf-vinculados');
    expect(r.tipoVinculo).toBe('proyeccion-de-predicados-sinteticos');
    expect(r.familia.countedAsMatch).toBe(false);
    expect(r.familia.faltantes).toEqual([]);
    expect(r.familia.censo).toEqual({controlesPersonales:41,descendientesActivos:1,ascendientesActivos:0});
    expect(r.familia.monetarios.controles).toHaveLength(8);
    expect(new Set(r.familia.minimos.casillas)).toEqual(new Set(Object.values(boxes)));
    expect(r.familia.hechosNoIntroducidosExactamente).toContain('situacion-vital-otro-progenitor');
  });
});
