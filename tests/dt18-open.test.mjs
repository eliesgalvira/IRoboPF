import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { validateDT18Case, dt18SesPdfReadback, dt18UiReadback } from '../tools/procedencia/simuladores/dt18-open.mjs';
import { parseSES, housingSES } from '../tools/procedencia/simuladores/dt18-ses.mjs';
import { vincularDT18Open } from '../tools/procedencia/simuladores/vincular-dt18-open.mjs';
const f = JSON.parse(readFileSync(new URL('./fixtures/dt18-binding.json',import.meta.url)));
const original = () => structuredClone(f.caso);
const contract = c => c.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025;
const validated = () => validateDT18Case(original(),original());
const bind = (ses=f.ses,pdf=f.pdfText,readbacks=f.readbacks) => dt18SesPdfReadback(ses,pdf,validated(),f.housing,readbacks);

describe('DT18: entrada preparada íntegra antes de proyección salarial', () => {
  it('conserva la entrada y todo el contrato externo', () => {
    const c=original(),before=JSON.stringify(c),v=validateDT18Case(c,original());
    expect(JSON.stringify(c)).toBe(before);
    expect(v.contratoExterno).toEqual(c.entradaAPI.deduccionesTerritoriales2025);
    expect(v.salary.amounts.IDII).toBe('60000.00');
    expect(v.salary.amounts.IDRE).toBe('14000.00');
  });
  it.each([
    ['modalidad', c=>{c.entradaAPI.modalidad='conjunta';}],
    ['titular', c=>{c.entradaAPI.contribuyenteId='s-2';}],
    ['territorio', c=>{c.entradaAPI.comunidadAutonoma='madrid';}],
    ['salario', c=>{c.entradaAPI.trabajo.rendimientos[0].integro='60000.01';}],
    ['retenciones', c=>{c.entradaAPI.retenciones[0].importe='14000.01';}],
    ['renta desconocida', c=>{c.entradaAPI.otraRentaNoTransportada='1';}],
    ['deducción borrada', c=>{delete c.entradaAPI.deduccionesTerritoriales2025;c.entradaAPI.deducciones='solo-da61-si-procede';}],
    ['fecha', c=>{contract(c).proyectos[0].vivienda.inmueble.adquisicion='2010-02-02';}],
    ['importe', c=>{contract(c).proyectos[0].vivienda.pagos[0].importe='3000.01';}],
    ['importe negativo', c=>{contract(c).proyectos[0].vivienda.pagos[0].importe='-3000.00';}],
    ['pago omitido', c=>{contract(c).proyectos[0].vivienda.pagos.pop();}],
    ['pago duplicado', c=>{contract(c).proyectos[0].vivienda.pagos.push(structuredClone(contract(c).proyectos[0].vivienda.pagos[0]));}],
    ['préstamo', c=>{contract(c).proyectos[0].prestamo.id='L2';}],
    ['documento histórico', c=>{contract(c).proyectos[0].prestamo.contrato.referencia='sintetico:alterado';}],
    ['censo duplicado', c=>{contract(c).censo.push(structuredClone(contract(c).censo[0]));}],
    ['censo omitido', c=>{contract(c).censo.pop();}],
    ['porcentaje', c=>{contract(c).proyectos[0].vivienda.inmueble.titulares[0].numerador=0;}],
    ['uso', c=>{contract(c).proyectos[0].vivienda.inmueble.uso='alquiler';}],
  ])('rechaza %s incluso si se altera también el original aportado', (_name,mutate) => {
    const c=original();mutate(c);
    expect(()=>validateDT18Case(c,structuredClone(c))).toThrow();
  });
  it('rechaza el original de otro caso y el territorio exterior incoherente', () => {
    const o=original();o.id='otro';expect(()=>validateDT18Case(original(),o)).toThrow();
    const c=original();c.territorio='madrid';expect(()=>validateDT18Case(c,original())).toThrow();
  });
});

describe('DT18: ámbitos SES y PDF, sin fórmula fiscal ni fallback', () => {
  it('contrasta los tres importes exactos y conserva límites externos', () => {
    expect(bind()).toMatchObject({estado:'transporte-dt18-ses-pdf-vinculado',countedAsMatch:false,
      casillas:{'0547':'228.75','0548':'228.75','0670':'-67.37'},contratoHistorico:'externofactual'});
  });
  it.each([
    ['modalidad','INDV~1~true','INDV~1~false'],
    ['titular','TITULAR~1~DECLARANTE','TITULAR~1~CONYUGE'],
    ['territorio','CAC_D~1~05','CAC_D~1~12'],
    ['fecha','VIVFA~1~01/02/2010','VIVFA~1~02/02/2010'],
    ['pago','VHADQ~1~3050.0','VHADQ~1~3050.01'],
    ['préstamo','VIVNIPH~1~00000000000000000000','VIVNIPH~1~00000000000000000001'],
    ['porcentaje','VIVPORC~1~100.0','VIVPORC~1~99.0'],
    ['días','DIASHAB~1~365','DIASHAB~1~364'],
    ['salario negativo','IDII~1~60000.0','IDII~1~-60000.0'],
    ['salario omitido','IDII~1~60000.0','IDII_OMITIDO~1~60000.0'],
    ['resultado omitido','RESULTADO~1~-67.37','RESULTADO_OMITIDO~1~-67.37'],
    ['impuesto distinto','DED1E~1~228.75','DED1E~1~228.76'],
    ['censo duplicado','    [INMUEBLES]','    [INMUEBLES]\n    [INMUEBLES]'],
    ['registro duplicado','   VHADQ~1~3050.0','   VHADQ~1~3050.0\n   VHADQ~1~3050.0'],
    ['otro uso','     DIASHAB~1~365','     OTROUSO~1~true\n     DIASHAB~1~365'],
  ])('rechaza %s', (_name,a,b) => {
    const ses=f.ses.replace(a,b);expect(ses).not.toBe(f.ses);expect(()=>bind(ses)).toThrow();
  });
  it.each(['0547','0548','0670'])('rechaza PDF omitido, duplicado o discrepante %s', box => {
    const line=f.pdfText.split('\n').find(l=>new RegExp(`\\b${box}\\s*$`).test(l));
    expect(line).toBeTruthy();
    for(const changed of [f.pdfText.replace(line,''),f.pdfText+'\n'+line+'\n',f.pdfText.replace(line,`1,00 ${box}`)])
      expect(()=>bind(f.ses,changed)).toThrow();
  });
  it('no admite cero salarial ausente sin escritura y readback explícitos', () => {
    expect(()=>bind(f.ses,f.pdfText,f.readbacks.filter(r=>r.key!=='GCS'))).toThrow();
  });
  it('rechaza ambigüedad, truncado y registros fuera de ámbito', () => {
    for(const s of [f.ses.slice(0,-50),f.ses.replace('   VHADQ~1~3050.0',' VHADQ~1~3050.0'),f.ses.replace('    [INMUEBLES]','\t[INMUEBLES]')])
      expect(()=>housingSES(s,f.housing)).toThrow();
    expect(parseSES(f.ses).sections.length).toBeGreaterThan(1);
  });
});

describe('DT18 adaptador optativo sin promoción', () => {
  it('sin documentos nunca verifica ni devuelve un cero de resultado', () => {
    expect(vincularDT18Open(original(),'.')).toEqual({estado:'no-verificado',countedAsMatch:false,motivo:'dt18-evidencia-ausente'});
  });
  it.each(['/captura.ses','../captura.ses','a/../captura.ses'])('rechaza referencia no relativa segura %s', archivo => {
    const c=original(),ref={archivo,sha256:'0'.repeat(64)};
    c.evidenciaOpen={dt18:{original:ref}};c.integridadReferencias={referencias:[ref]};
    expect(vincularDT18Open(c,'.').motivo).toBe('dt18-referencia-invalida');
  });
});

describe('DT18 readbacks y negativos completos', () => {
  const data = () => {
    const readbacks=structuredClone(f.readbacks);
    const inventories={antes:readbacks.find(r=>r.key==='dt18-negativos-antes').observed,
      despues:readbacks.find(r=>r.key==='dt18-negativos-despues').observed};
    const receipt={id:f.caso.id,state:'complete-status',transportComplete:true,templateSha256:null,
      dt18:{state:'complete-status',transportComplete:true,uiControlsAccepted:true,missing:[]},readbacks};
    return {readbacks,inventories,receipt};
  };
  const check = d => dt18UiReadback(d.receipt,d.readbacks,d.inventories,f.housing,f.caso);
  it('preserva el límite externofactual',()=>expect(check(data()).contratoHistorico).toBe('externofactual'));
  it.each([
    d=>{d.receipt.state='failed';},
    d=>{d.receipt.templateSha256='0'.repeat(64);},
    d=>{d.receipt.dt18.missing=['solicitud regional'];},
    d=>{d.readbacks.find(r=>r.key==='dt18-percent').observed='99,00';},
    d=>{d.readbacks.find(r=>r.key==='dt18-loan').observed='1';},
    d=>{d.readbacks.find(r=>r.key==='dt18-date').observed='02/02/2010';},
    d=>{d.readbacks.find(r=>r.key==='dt18-payments').observed='3.050,01';},
    d=>{d.readbacks.find(r=>r.key==='housing-days').observed='364';},
    d=>{d.readbacks.find(r=>r.key==='housing-ownership').observed='50,00';},
    d=>{d.readbacks.push(structuredClone(d.readbacks.find(r=>r.key==='dt18-date')));},
    d=>{d.readbacks.splice(d.readbacks.findIndex(r=>r.key==='dt18-loan'),1);},
    d=>{d.inventories.despues=structuredClone(d.inventories.despues);d.inventories.despues.pop();},
    d=>{d.readbacks.find(r=>r.key==='dt18-negativos-despues').exactExternalFactsEntered=true;},
  ])('rechaza recibos, controles, duplicados u omisiones alterados', mutate=>{
    const d=data();mutate(d);expect(()=>check(d)).toThrow();
  });
});
