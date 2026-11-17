import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isDeepStrictEqual as equal } from 'node:util';
import { Schema } from 'effect';

const pins = JSON.parse(readFileSync(new URL('./inquilinos-exclusion-pins.json', import.meta.url)));
const record = Schema.is(Schema.Record(Schema.String, Schema.Unknown));
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : record(value)
    ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const digest = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const need = (ok, reason) => { if (!ok) throw new Error(reason); };

/** Binding documental de dos expedientes congelados. No es un evaluador fiscal
 * general ni una prueba de transporte UI. Fija también los hechos sin efecto en
 * cuota: eliminarlos o sustituir el slot por su referencia salarial lo invalida.
 */
export function vincularExclusionInquilino(slot, fixtures) {
  try {
    const pin = pins.casos.find(p => p.id === slot?.id);
    need(pin && digest(slot) === pin.slotSha256, 'exclusion-slot-distinto');
    const matches = fixtures.filter(f => f.id === slot.id);
    need(matches.length === 1 && digest(matches[0].entrada) === pin.entradaSha256
      && equal(slot.entradaAPI, matches[0].entrada), 'exclusion-entrada-distinta');
    const h = slot.preparacionVivienda.hechosHabitacion;
    need(digest(h) === pin.housingSha256 && h.inquilino === true, 'exclusion-vivienda-distinta');
    // Las negativas proceden de hechos expresos, nunca de edad, blancos o SES.
    need(slot.entradaAPI.edad === 40 && h.nacimiento === '1985-01-01'
      && h.familiaNumerosa === false && h.monoparental === false
      && h.discapacidadPorcentaje === 0 && h.desempleoDias2025 === 0
      && h.viudedad === false && h.dacionEnPago === false
      && h.violenciaGenero === false, 'exclusion-negativas-incompletas');
    return {
      id: slot.id, estado: 'exclusion-documental-vinculada',
      entradaAPI: structuredClone(slot.entradaAPI),
      hechosHabitacion: structuredClone(h),
      motivos: [...pin.motivos], fuentes: structuredClone(pin.fuentes),
      deduccionAlquilerDocumentalEUR: '0.00',
      // No elevar este cero documental a medida del simulador.
      deduccionAlquilerOpenEUR: null, resultadoOpenEUR: null,
      transportComplete: false, countedAsMatch: false,
    };
  } catch {
    return { estado: 'no-verificado', deduccionAlquilerDocumentalEUR: null,
      deduccionAlquilerOpenEUR: null, resultadoOpenEUR: null,
      transportComplete: false, countedAsMatch: false };
  }
}

export const titulosAlquiler = Object.freeze({
  'castilla-la-mancha': 'Por arrendamiento de vivienda habitual para contribuyentes menores de 36 años (importe de la casilla [1130] del anexo B.11):',
  catalunya: 'Por alquiler de la vivienda habitual (se traslada este importe a la casilla [1130] del anexo B.11):',
});

/** Resolver en el DOM vivo únicamente la relación observada en ambos originales.
 * Devuelve el nodo; no hace click, no rellena ni acepta una deducción. El modal
 * resultante requiere un nuevo censo antes de preparar cualquier escritura.
 */
export function resolverLanzadorAlquiler(documento, territorio) {
  const title = titulosAlquiler[territorio];
  need(title, 'exclusion-territorio-no-admitido');
  const visible = node => node.getClientRects().length > 0;
  const fields = [...documento.querySelectorAll('input[title]')]
    .filter(n => n.getAttribute('title') === title && visible(n));
  need(fields.length === 1 && !fields[0].disabled && fields[0].readOnly,
    'exclusion-campo-no-unico');
  const row = fields[0].closest('.contenedor960');
  need(row, 'exclusion-ancestro-ausente');
  const buttons = [...row.querySelectorAll('button.botonLanzaVentana')].filter(visible);
  need(buttons.length === 1 && !buttons[0].disabled
    && buttons[0].getAttribute('aria-disabled') !== 'true', 'exclusion-lanzador-no-unico');
  return buttons[0];
}
