import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe,it,expect} from 'vitest';
import {vincularDT18Open} from '../tools/procedencia/simuladores/vincular-dt18-open.mjs';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
const doc=JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/observaciones.json',import.meta.url)));
const cases=doc.casos.filter(c=>c.evidenciaOpen?.dt18);
describe('DT18: cargador completo con originales y PDF real',()=>{
  it('conserva siete entradas independientes dentro del denominador fijo',()=>{
    expect(cases).toHaveLength(7);expect(new Set(cases.map(c=>c.id)).size).toBe(7);
    expect(doc.casos).toHaveLength(80);
  });
  it.each(cases.map(c=>[c.id,c]))('%s: verifica los trece artefactos y compara con el motor',(_id,c)=>{
    expect(vincularDT18Open(c,base)).toMatchObject({estado:'transporte-dt18-ses-pdf-vinculado',
      countedAsMatch:false,historiaVerificada:false,casillas:{'0670':c.resultadoOpenEUR}});
    expect(medirCasos([c],{base}).medicion.iguales).toBe(1);
  });
  it.each(cases.map(c=>[c.id,c]))('%s: rechaza signo, censo, referencias duplicadas y salida de base',(_id,c)=>{
    for(const mutate of [x=>{x.resultadoOpenEUR=x.resultadoOpenEUR.startsWith('-')?x.resultadoOpenEUR.slice(1):'-'+x.resultadoOpenEUR;},
      x=>{delete x.evidenciaOpen.dt18.censoDespues;},
      x=>{x.integridadReferencias.referencias.push(structuredClone(x.evidenciaOpen.dt18.pdf));},
      x=>{x.evidenciaOpen.dt18.pdf.archivo='../captura.pdf';}]){
      const bad=structuredClone(c);mutate(bad);
      expect(vincularDT18Open(bad,base)).toMatchObject({estado:'no-verificado',countedAsMatch:false});
      expect(medirCasos([bad],{base}).medicion.iguales).toBe(0);
    }
  });
  it('rechaza el cruce de los dos expedientes madrileños',()=>{
    const c=structuredClone(cases.find(c=>c.id==='open2025-madrid-04'));
    const other=cases.find(c=>c.id==='open2025-madrid-12');
    c.evidenciaOpen.dt18.ses=structuredClone(other.evidenciaOpen.dt18.ses);
    c.integridadReferencias.referencias.push(c.evidenciaOpen.dt18.ses);
    expect(vincularDT18Open(c,base).estado).toBe('no-verificado');
  });
  it('extractor ausente no acredita resultados ni activa otro binding',()=>{
    const before=process.env.C_PDFTOTEXT;
    try{
      delete process.env.C_PDFTOTEXT;
      expect(vincularDT18Open(cases[0],base)).toMatchObject({estado:'no-verificado',motivo:'dt18-lector-pdf-no-configurado'});
      expect(medirCasos([cases[0]],{base}).medicion.iguales).toBe(0);
    }finally{
      if(before===undefined)delete process.env.C_PDFTOTEXT;else process.env.C_PDFTOTEXT=before;
    }
  });
});
