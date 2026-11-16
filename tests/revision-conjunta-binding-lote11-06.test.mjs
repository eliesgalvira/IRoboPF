// Exclusivamente sintético. Preparado en GRANT0; NO ejecutado.
// Adversas del contrato sintético matrimonial y su persistencia SES.
import {describe, it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {validateSES} from '../tools/procedencia/simuladores/conjunta-estricta.mjs';

const ref = JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/conjunta-referencias/open2025-castilla-la-mancha-02.json', import.meta.url)));
// El árbol es INPUT observado fijado. Ningún esperado de rechazo se obtiene
// del árbol, del generador de referencias ni del código fiscal del producto.
function section(n, indent = 0) {
  return ' '.repeat(indent) + '[' + n.name + ']\n' +
    n.fields.map(([k, t, f, v]) => ' '.repeat(indent + 1) + [k, t, v ?? 'synthetic', ...(f ? [f] : [])].join('~') + '\n').join('') +
    n.children.map(c => section(c, indent + 2)).join('');
}
const text = '<?xml ' + Object.entries(ref.metadata).map(([k,v]) => k + '="' + v + '"').join(' ') + '?><PERSISTENCIAV2>\n' + section(ref.census) + '</PERSISTENCIAV2>';
const entry = () => ({
  tipoUnidad: 'matrimonial', modalidad: 'conjunta', ejercicio: 2025,
  comunidadAutonoma: 'castilla-la-mancha', miembros: ['s-1','s-2','s-3'],
  declarante: {id: 's-1', fechaNacimiento: '1985-01-01'},
  conyuge: {id: 's-2', fechaNacimiento: '1985-01-01'},
  hijos: [{id: 's-3', fechaNacimiento: '2023-01-01', rentaNoExenta: '0.00'}],
  economia: {
    censoCompleto: true, perceptorId: 's-1', miembrosSinRentas: ['s-2','s-3'],
    otrasRentasIncluidasExentas: 'ninguna', actividadesAhorroInmueblesGanancias: 'ninguno',
    trabajo: {ejercicio: 2025, territorio: 'comun', rendimientos: [{
      integro: '30000.00', cotizaciones: {seguridadSocial: '1950.00', derechosPasivos: '0', colegiosHuerfanos: '0'},
      sindicato: {importe: '0'}, colegio: {importe: '0'}, defensa: {importe: '0'},
    }]}, retenciones: [{importe: '4200.00'}],
  },
});

describe('contrato sintético frente a SES fijo, esperados independientes', () => {
  it('control: entrada CLM salarial concordante', () => {
    expect(() => validateSES(text, ref, entry())).not.toThrow();
  });
  const adversas = [
    ['región Aragón no corresponde al SES CLM', e => {e.comunidadAutonoma = 'aragon';}],
    ['sindicato positivo no corresponde a gastos cero', e => {e.economia.trabajo.rendimientos[0].sindicato.importe = '1.00';}],
    ['colegio positivo no corresponde a gastos cero', e => {e.economia.trabajo.rendimientos[0].colegio.importe = '1.00';}],
    ['defensa positiva no corresponde a gastos cero', e => {e.economia.trabajo.rendimientos[0].defensa.importe = '1.00';}],
    ['otros conceptos de cotización no se pierden al mapear GSS', e => {e.economia.trabajo.rendimientos[0].cotizaciones.derechosPasivos = '1.00';}],
    ['renta del hijo contradice el corte sin otras rentas', e => {e.hijos[0].rentaNoExenta = '1.00';}],
    ['censo de miembros sin rentas no puede incluir al perceptor', e => {e.economia.miembrosSinRentas = ['s-1','s-3'];}],
    ['identidades de miembros deben ser distintas', e => {e.conyuge.id = 's-1'; e.miembros[1] = 's-1'; e.economia.miembrosSinRentas[0] = 's-1';}],
    ['trabajo de otro ejercicio no se vincula a 2025', e => {e.economia.trabajo.ejercicio = 2024;}],
    ['trabajo foral no se vincula al corte común', e => {e.economia.trabajo.territorio = 'foral';}],
    ['censo económico incompleto no acredita el corte cerrado', e => {e.economia.censoCompleto = false;}],
    ['control negativo: perceptor cónyuge no corresponde al trabajo del declarante', e => {e.economia.perceptorId = 's-2';}],
  ];
  for (const [name, mutate] of adversas) it(name, () => {
    const e = entry(); mutate(e);
    // Rechazo contractual: NO se pide calcular cuota ni probar hechos legales.
    expect(() => validateSES(text, ref, e)).toThrow();
  });
  it('control aritmético entero independiente: base CLM sin otros gastos específicos', () => {
    const ses = validateSES(text, ref, entry());
    const cents = s => {const [a,b=''] = s.split('.'); return BigInt(a)*100n + BigInt(b.padEnd(2,'0'));};
    expect(cents(ses.p.row(ses.joint, 'BLGRAL'))).toBe(3000000n - 195000n - 200000n - 340000n);
    expect(cents(ses.p.row(ses.joint, 'MPERFA'))).toBe(555000n + 240000n + 280000n);
  });
});
