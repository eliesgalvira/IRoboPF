import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateFamilyCase, familySesReadback, familyPredicateReadback } from '../tools/procedencia/simuladores/familia-open.mjs';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/c300-variantes.json', import.meta.url)));
const variants = fixtures.filter(c => c.id.includes('extension-familia-'));
const matrix = JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/casos.json', import.meta.url))).casos;
// Texto mínimo sintético para pruebas adversariales; no es evidencia oficial.
function ses(c) {
  const p = validateFamilyCase(c), date = p.fechaNacimientoSES, link = p.vinculoSES;
  const age = p.menor ? 'MEN' : 'MAY';
  return `<?xml CodModelo="100" EjModelo="2025" VersionReglas="N1" VersionModelo="0.12"?><PERSISTENCIAV2>
[DECLARACIONES]
 INDV~1~true
${p.otroTitularId ? ' NIFOPAUX~1~90000001N\n' : ''}  [DP]
   DPNIF_D~3~90000000B~254
   EDADD~1~40
   DPFNAC_D~1~01/01/1985
   CAD_D~1~MADRID
   CAC_D~1~12
    [ASCENDIENTES]
    [DESCENDIENTES]
     NIFH~1~90000002J
     NIFDLG~1~90000002J
     FNAC~1~${date}
     FNACDLG~1~${date}
     EDADH~1~${p.edad}
     VINCU~1~${link}
     VINCUDLG~1~${link}
     VNUMMDES~1~${p.titulares}
${p.otroTitularId ? '     NIFOPDLG~1~90000001N\n' : ''}    [RWHIJOS${p.menor ? 'MENOR' : 'MAYOR'}18]
     NIFH${age}~1~90000002J
     NIFH${age}DLG~1~90000002J
     FNACH${age}~1~${date}
     FNACH${age}DLG~1~${date}
     VINCUH${age}DLG~1~${link}
${p.menor ? '     CACHMEN~1~12\n     CACHMENDLG~1~12\n     CADHMENDLG~1~MADRID\n' : ''}${p.otroTitularId ? '     NIFOPDLGHMEN~1~90000001N\n' : ''}  [IRPF2025]
   TITULAR~1~DECLARANTE
   ZCCAD~1~12
   ZFNAC_D~1~01/01/1985
   VINCU1~1~${link}
${p.otroTitularId ? '   NIFOP01~1~90000001N\n  [OTROSPROGENITORES]\n   NIFOP~1~90000001N\n' : ''}</PERSISTENCIAV2>`;
}

describe('familia Open: identidad referencial y observación parcial', () => {
  it('admite los 18 casos individuales del manifiesto, sin sustituir conjunta', () => {
    const family = matrix.filter(c => c.grupo === 'salario-hijos');
    expect(family.filter(c => c.entradaAPI)).toHaveLength(18);
    for (const c of family) {
      if (c.entradaAPI) expect(validateFamilyCase(c).sujetoId).toBe('s-3');
      else expect(() => validateFamilyCase(c)).toThrow();
    }
  });
  it.each(variants)('$id: fecha, B/D, espejo por edad y reserva explícita', c => {
    const result = familySesReadback(ses(c), c);
    expect(result.estado).toBe('identidad-familiar-ses-parcial');
    expect(result.countedAsMatch).toBe(false);
    expect(result.noVerificable).toContain('rentas-exactas-hijo-y-titulares');
    expect(result.noVerificable).toContain('custodia-juridica');
  });
  it('no confunde renta propia corregida con transporte UI acreditado', () => {
    const c = structuredClone(variants[0]);
    const before = familySesReadback(ses(c), c);
    c.entrada.derechosMinimos.descendientes[0].titulares[0].rentasNoExentasCentimos = 0;
    expect(familySesReadback(ses(c), c)).toEqual(before);
  });
  it.each([
    c => { c.entrada.derechosMinimos.contribuyenteId = 's-9'; },
    c => { c.entrada.contribuyenteId = 's-9'; },
    c => { c.entrada.derechosMinimos.descendientes[0].sujetoId = 's-1'; },
    c => { c.entrada.derechosMinimos.descendientes[0].titulares.push(structuredClone(c.entrada.derechosMinimos.descendientes[0].titulares[0])); },
    c => { c.entrada.derechosMinimos.descendientes[0].edadDevengo++; },
    c => { c.entrada.derechosMinimos.descendientes[0].fechaNacimiento = '2023-02-29'; },
    c => { c.entrada.derechosMinimos.descendientes[0].rentasNoExentasCentimos = 800001; },
    c => { c.entrada.derechosMinimos.descendientes[0].titulares[0].vinculo.clase = 'adopcion'; },
    c => { c.entrada.derechosMinimos.descendientes[0].titulares[0].alimentosJudiciales = true; },
  ])('rechaza identidad/hechos fuera del corte', mutate => {
    const c = structuredClone(variants[0]); mutate(c);
    expect(() => validateFamilyCase(c)).toThrow();
  });
  it.each([
    s => s.replace('NIFH~1~90000002J', 'NIFH~1~90000001N'),
    s => s.replace('FNAC~1~', 'FNAC~3~'),
    s => s.replace('VINCU~1~B', 'VINCU~1~D'),
    s => s.replace('EDADH~1~2', 'EDADH~1~2\n     EDADH~1~2'),
    s => s.replace('[DESCENDIENTES]', '[AJENO]'),
    s => s.replace('INDV~1~true', 'INDV~1~false'),
    s => s.replace('TITULAR~1~DECLARANTE', 'TITULAR~1~CONYUGE'),
    s => s.replace('EjModelo="2025"', 'EjModelo="2024"'),
    s => s.replace('[IRPF2025]', '[IRPF2025]\n  [IRPF2025]'),
    s => s.replace('CAC_D~1~12', 'CAC_D~1~13'),
    s => s.replace('</PERSISTENCIAV2>', ''),
  ])('rechaza SES ambiguo, incompleto o contradictorio', mutate => {
    expect(() => familySesReadback(mutate(ses(variants[0])), variants[0])).toThrow();
  });
  it('exige el otro progenitor en todos los ámbitos compartidos', () => {
    const c = variants.find(c => c.id.includes('familia-5'));
    expect(() => familySesReadback(ses(c).replace('   NIFOP~1~90000001N\n', ''), c)).toThrow();
  });
});

describe('predicados del piloto sintético: evidencia insuficiente no suma igualdad', () => {
  const caso = () => structuredClone(matrix.find(c => c.id === 'open2025-madrid-03'));
  const readbacks = () => ({ readbacks: [
    ...[['nif', '90000000B'], ['birth', '01/01/1985'], ['child-nif', '90000002J'],
      ['child-birth', '01/01/2015'], ['other-nif', '90000001N']]
      .map(([key, value]) => ({ key, requested: value, observed: value })),
    { key: 'region', selected: 'MADRID', options: ['MADRID'] },
    { key: 'family-link', selected: label, options: [label] },
    { key: 'child-income-over-8000', observed: false, exactIncomeEntered: false },
  ] });
  const label = 'DHijos del primer declarante si también conviven con el otro progenitor: hijos de parejas de hecho, hijos del declarante con guarda y custodia compartida, hijos del declarante cuando haya fallecido el otro progenitor en el año';
  it('acota renta API cero sin atribuir ese importe a Open ni declarar verificada la familia', () => {
    const c = caso(), r = familyPredicateReadback(ses(c), c, readbacks());
    expect(r).toMatchObject({ countedAsMatch: false, origen: 'sintetico', rentaExactaIntroducidaEnOpen: false });
    expect(r.faltantes).toContain('declaracion-hijo-control-identificado');
  });
  it.each([
    c => { c.entradaAPI.derechosMinimos.descendientes[0].rentasNoExentasCentimos = 1; },
    c => { c.entradaAPI.derechosMinimos.descendientes[0].declaracion = { modalidad: 'individual' }; },
    c => { c.entradaAPI.derechosMinimos.descendientes[0].sujetoId = 's-4'; },
    c => { c.entradaAPI.derechosMinimos.descendientes[0].titulares[1].titularId = 's-4'; },
    c => { c.entradaAPI.derechosMinimos.descendientes[0].titulares[0].custodia = 'exclusiva'; },
  ])('no amplía el corte cambiando renta, declaración, identidad o custodia', mutate => {
    const c = caso(); mutate(c);
    expect(() => familyPredicateReadback(ses(c), c, readbacks())).toThrow();
  });
  it.each([
    r => { r.readbacks.find(x => x.key === 'child-nif').observed = '90000001N'; },
    r => { delete r.readbacks.find(x => x.key === 'child-income-over-8000').observed; },
    r => { r.readbacks.find(x => x.key === 'child-income-over-8000').observed = true; },
    r => { r.readbacks.find(x => x.key === 'child-income-over-8000').exactIncomeEntered = true; },
    r => { r.readbacks.find(x => x.key === 'family-link').selected = 'D'; },
    r => { r.readbacks.push(r.readbacks[0]); },
  ])('rechaza controles alterados, ausentes, duplicados o sin semántica identificada', mutate => {
    const c = caso(), r = readbacks(); mutate(r);
    expect(() => familyPredicateReadback(ses(c), c, r)).toThrow();
  });
});
