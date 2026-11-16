/** Corte familiar sintético Open2025; no calcula mínimos ni resultados fiscales.
 * Evidencia: tests/fixtures/c300-variantes.json (familia 1, 2, 3 y 5),
 * binding.py, contract.py, c300.py y replay_functions.py. Los originales de
 * esas variantes repiten FNAC/NIF/VINCU en DP y en el diálogo por edad.
 * B/D y VNUMMDES=1/2 son correspondencias observadas, no definiciones legales.
 * GUARD, GUAROD y RENTASHMEN se conservan como observaciones sin semántica
 * inferida. La corrección de renta propia no cambió la proyección UI familiar.
 *
 * Integración: validateFamilyCase(caso) antes del transporte, y
 * familySesReadback(textoLatin1, caso) después de guardar el SES original.
 * Complementar con validación salarial, hashes, readbacks UI y resultado PDF.
 * No sustituye validateCase/sesReadback ni elimina su restricción Madrid.
 * Nunca convertir este informe parcial en acreditación fiscal completa.
 */
import { Schema } from 'effect';
const string = Schema.is(Schema.String), record = Schema.is(Schema.Record(Schema.String, Schema.Unknown));
const ensure = (ok, code) => { if (!ok) throw Error(code); };
const syntheticId = value => string(value) && /^s-[1-9]\d{0,5}$/.test(value);
const income = value => Number.isSafeInteger(value) && value >= 0;
const names = {
  andalucia: 'ANDALUCIA', catalunya: 'CATALUÑA', 'comunitat-valenciana': 'COMUNITAT VALENCIANA',
  galicia: 'GALICIA', canarias: 'CANARIAS', aragon: 'ARAGON', madrid: 'MADRID',
  asturias: 'PRINCIPADO DE ASTURIAS', 'illes-balears': 'ILLES BALEARS', cantabria: 'CANTABRIA',
  'castilla-la-mancha': 'CASTILLA-LA MANCHA', 'castilla-y-leon': 'CASTILLA Y LEON',
  extremadura: 'EXTREMADURA', murcia: 'REGION DE MURCIA', 'la-rioja': 'LA RIOJA',
};
const norm = s => s.normalize('NFD').replace(/\p{M}/gu, '').trim().toUpperCase();
const only = (o, keys) => record(o) && Object.keys(o).every(k => keys.includes(k));
const noDisability = o => only(o, ['_tag']) && o._tag === 'SinDiscapacidad';

/** Valida identidad referencial y el corte transportable, no la renta fiscal.
 * Acepta {entrada} del transporte o {entradaAPI} del manifiesto. Nunca usa
 * entradaTrabajoIndividualReferencia cuando entradaAPI es null (conjunta).
 */
export function validateFamilyCase(caso) {
  ensure(caso && caso.modalidadObjetivo !== 'conjunta', 'familia-modalidad-no-soportada');
  ensure(!(Object.hasOwn(caso, 'entradaAPI') && Object.hasOwn(caso, 'entrada')), 'familia-entrada-ambigua');
  const e = Object.hasOwn(caso, 'entradaAPI') ? caso.entradaAPI : caso.entrada;
  ensure(e && e.ejercicio === 2025 && e.modalidad === 'individual' && e.perfil === 'solo-trabajo'
    && e.edad === 40 && e.devengo === '2025-12-31' && Object.hasOwn(names, e.comunidadAutonoma)
    && e.familiaresConDerechoMinimo === 'segun-derechos', 'familia-perfil-no-soportado');
  const d = e.derechosMinimos;
  ensure(only(d, ['ascendientes', 'conciliacionRentasContribuyente', 'contribuyenteId', 'descendientes',
    'descendientesCompletos', 'devengo', 'discapacidadContribuyente', 'edadContribuyenteDevengo',
    'ejercicio', 'fallecimientosEnElEjercicio', 'modalidad', 'regimen', 'territorio'])
    && d.ejercicio === e.ejercicio && d.modalidad === e.modalidad && d.devengo === e.devengo
    && d.territorio === e.comunidadAutonoma && d.regimen === 'comun' && d.edadContribuyenteDevengo === e.edad
    && d.ascendientes === 'ninguno' && d.fallecimientosEnElEjercicio === 'ninguno'
    && d.descendientesCompletos === true && noDisability(d.discapacidadContribuyente)
    && Array.isArray(d.descendientes) && d.descendientes.length === 1, 'familia-derechos-no-soportados');
  ensure(syntheticId(d.contribuyenteId) && (e.contribuyenteId === undefined || e.contribuyenteId === d.contribuyenteId), 'familia-contribuyente-incoherente');
  const child = d.descendientes[0];
  ensure(only(child, ['declaracion', 'discapacidad', 'edadDevengo', 'fechaNacimiento', 'rentasNoExentasCentimos',
    'sujetoId', 'titulares', 'titularesCompletos', 'vivoAlDevengo'])
    && syntheticId(child.sujetoId) && child.sujetoId !== d.contribuyenteId, 'familia-sujeto-incoherente');
  ensure(string(child.fechaNacimiento) && /^(?:200\d|201\d|202[0-5])-01-01$/.test(child.fechaNacimiento)
    && child.edadDevengo === 2025 - Number(child.fechaNacimiento.slice(0, 4))
    && child.edadDevengo >= 0 && child.edadDevengo < 25, 'familia-fecha-no-soportada');
  ensure(child.vivoAlDevengo === true && child.titularesCompletos === true && noDisability(child.discapacidad)
    && only(child.declaracion, ['modalidad']) && child.declaracion.modalidad === 'no-presenta'
    && income(child.rentasNoExentasCentimos) && child.rentasNoExentasCentimos <= 800000,
  'familia-hechos-no-soportados');
  const ts = child.titulares, minor = child.edadDevengo < 18;
  ensure(Array.isArray(ts) && [1, 2].includes(ts.length), 'familia-titulares-no-soportados');
  const ids = ts.map(t => t?.titularId);
  ensure(ids.every(syntheticId) && new Set(ids).size === ids.length && !ids.includes(child.sujetoId)
    && ids.filter(id => id === d.contribuyenteId).length === 1, 'familia-titulares-incoherentes');
  // El fixture adulto conserva "exclusiva"; admitirlo no acredita custodia de adulto.
  ensure(ts.every(t => only(t, ['alimentosJudiciales', 'aplicaEspecialidadAlimentos', 'custodia', 'grado',
    'relacion', 'rentasNoExentasCentimos', 'residenteIrpf', 'titularId', 'vinculo'])
    && only(t.vinculo, ['clase']) && t.vinculo.clase === 'consanguinidad' && t.grado === 1
    && t.relacion === 'convivencia' && t.alimentosJudiciales === false && t.aplicaEspecialidadAlimentos === false
    && t.residenteIrpf === true && income(t.rentasNoExentasCentimos)
    && (minor ? t.custodia === (ts.length === 2 ? 'compartida' : 'exclusiva')
      : ts.length === 1 && ['exclusiva', 'no-procede'].includes(t.custodia))), 'familia-vinculo-no-soportado');
  return {
    contribuyenteId: d.contribuyenteId, sujetoId: child.sujetoId,
    otroTitularId: ids.find(id => id !== d.contribuyenteId) ?? null,
    fechaNacimientoSES: `01/01/${child.fechaNacimiento.slice(0, 4)}`,
    edad: child.edadDevengo, menor: minor, vinculoSES: ts.length === 2 ? 'D' : 'B',
    titulares: ts.length, territorio: e.comunidadAutonoma,
  };
}

// Parser local del texto ya descomprimido: ámbitos por indentación, sin búsqueda
// global de NIF/fecha. No abre archivos, no descomprime y no ejecuta transporte.
function parse(text) {
  ensure(string(text) && Buffer.byteLength(text, 'latin1') <= 4 * 1024 * 1024
    && !text.includes('\r'), 'familia-ses-texto-invalido');
  const header = /^<\?xml\s+([^\n]+)\?><PERSISTENCIAV2>\s*\n/.exec(text);
  ensure(header && text.trimEnd().endsWith('</PERSISTENCIAV2>'), 'familia-ses-incompleto');
  const attrs = [...header[1].matchAll(/(\w+)="([^"<>]*)"/g)];
  ensure(new Set(attrs.map(m => m[1])).size === attrs.length
    && header[1].replace(/(\w+)="([^"<>]*)"/g, '').trim() === '', 'familia-ses-cabecera-ambigua');
  const meta = Object.fromEntries(attrs.map(m => [m[1], m[2]]));
  ensure(meta.CodModelo === '100' && meta.EjModelo === '2025' && /^N\d+$/.test(meta.VersionReglas)
    && /^\d+\.\d+$/.test(meta.VersionModelo), 'familia-ses-modelo-invalido');
  const stack = [], sections = [], records = [];
  for (const line of text.slice(header[0].length, text.lastIndexOf('</PERSISTENCIAV2>')).split('\n')) {
    if (!line.trim()) continue;
    ensure(!line.includes('\t'), 'familia-ses-indentacion-invalida');
    const indent = line.length - line.trimStart().length;
    while (stack.length && stack.at(-1).indent >= indent) stack.pop();
    const section = /^ *\[([A-Z0-9_]+)\]$/.exec(line);
    if (section) {
      const block = { indent, name: section[1], path: [...stack.map(s => s.name), section[1]].join('/'), records: [] };
      sections.push(block); stack.push(block); continue;
    }
    ensure(stack[0]?.name === 'DECLARACIONES', 'familia-ses-fuera-declaracion');
    if (['{', '}', '(', ')'].includes(line.trim())) continue;
    const record = /^ *(\w+)~([123])~([^~\r\n]*)(?:~(254|255))?$/.exec(line);
    ensure(record, 'familia-ses-registro-malformado');
    const row = { key: record[1], type: record[2], value: record[3], suffix: record[4], path: stack.map(s => s.name).join('/') };
    records.push(row); stack.at(-1).records.push(row);
  }
  for (const [name, path, indent] of [['DECLARACIONES', 'DECLARACIONES', 0], ['DP', 'DECLARACIONES/DP', 2], ['IRPF2025', 'DECLARACIONES/IRPF2025', 2]]) {
    const blocks = sections.filter(s => s.name === name);
    ensure(blocks.length === 1 && blocks[0].path === path && blocks[0].indent === indent, 'familia-ses-ambito-ambiguo');
  }
  ensure(!sections.some(s => /^IRPF/.test(s.name) && s.name !== 'IRPF2025'), 'familia-ses-otro-ejercicio');
  return { sections, records };
}

/** Comprueba correspondencias observadas; errores sin valores ni texto SES.
 * El resultado nunca certifica custodia, rentas, autenticidad o cálculo fiscal.
 * NIF exclusivamente sintéticos, iguales a los del transporte actual.
 */
export function familySesReadback(text, caso) {
  const p = validateFamilyCase(caso), { sections, records } = parse(text);
  const expected = new Map();
  const add = (path, key, value, type = '1', suffix) => {
    const list = expected.get(key) ?? [];
    list.push({ path: `DECLARACIONES${path}`, value, type, suffix }); expected.set(key, list);
  };
  add('', 'INDV', 'true'); add('/IRPF2025', 'TITULAR', 'DECLARANTE');
  add('/DP', 'DPNIF_D', '90000000B', '3', '254');
  add('/DP', 'DPFNAC_D', '01/01/1985'); add('/DP', 'EDADD', '40');
  add('/DP', 'CAD_D', names[p.territorio]); add('/IRPF2025', 'ZFNAC_D', '01/01/1985');
  const dp = '/DP/DESCENDIENTES';
  for (const key of ['NIFH', 'NIFDLG']) add(dp, key, '90000002J');
  for (const key of ['FNAC', 'FNACDLG']) add(dp, key, p.fechaNacimientoSES);
  for (const key of ['VINCU', 'VINCUDLG']) add(dp, key, p.vinculoSES);
  add(dp, 'EDADH', String(p.edad)); add(dp, 'VNUMMDES', String(p.titulares));
  const age = p.menor ? '/DP/RWHIJOSMENOR18' : '/DP/RWHIJOSMAYOR18';
  const tail = p.menor ? 'HMEN' : 'HMAY';
  for (const key of [`NIF${tail}`, `NIF${tail}DLG`]) add(age, key, '90000002J');
  for (const key of [`FNAC${tail}`, `FNAC${tail}DLG`]) add(age, key, p.fechaNacimientoSES);
  add(age, `VINCU${tail}DLG`, p.vinculoSES);
  add('/IRPF2025', 'VINCU1', p.vinculoSES);
  if (p.otroTitularId) {
    add('', 'NIFOPAUX', '90000001N'); add(dp, 'NIFOPDLG', '90000001N');
    add(age, 'NIFOPDLGHMEN', '90000001N'); add('/OTROSPROGENITORES', 'NIFOP', '90000001N');
    add('/IRPF2025', 'NIFOP01', '90000001N');
  }
  // No aceptar otra familia oculta en un bloque duplicado o de otra edad.
  for (const name of ['DESCENDIENTES', 'RWHIJOSMENOR18', 'RWHIJOSMAYOR18', 'ASCENDIENTES']) {
    const blocks = sections.filter(s => s.name === name);
    ensure(blocks.every(s => s.path === `DECLARACIONES/DP/${name}` && s.indent === 4), 'familia-ses-ambito-familiar');
    const active = name === 'DESCENDIENTES' || name === (p.menor ? 'RWHIJOSMENOR18' : 'RWHIJOSMAYOR18');
    ensure(active ? blocks.filter(s => s.records.length).length === 1 : blocks.every(s => !s.records.length), 'familia-ses-familia-ambigua');
  }
  for (const [key, wanted] of expected) {
    const found = records.filter(r => r.key === key);
    ensure(found.length === wanted.length && wanted.every(w => found.filter(r => r.path === w.path
      && r.type === w.type && r.suffix === w.suffix
      && (key === 'CAD_D' ? norm(r.value) === norm(w.value) : r.value === w.value)).length === 1), 'familia-ses-identidad-distinta');
  }
  const code = (key, path) => {
    const rows = records.filter(r => r.key === key);
    ensure(rows.length === 1 && rows[0].path === `DECLARACIONES${path}` && rows[0].type === '1'
      && !rows[0].suffix && /^\d{1,2}$/.test(rows[0].value), 'familia-ses-territorio-ambiguo');
    return rows[0].value;
  };
  const region = code('CAC_D', '/DP');
  ensure(region === code('ZCCAD', '/IRPF2025') && (p.territorio !== 'madrid' || region === '12'), 'familia-ses-territorio-distinto');
  if (p.menor) {
    ensure(code('CACHMEN', age) === region && code('CACHMENDLG', age) === region, 'familia-ses-territorio-hijo-distinto');
    const labels = records.filter(r => r.key === 'CADHMENDLG');
    ensure(labels.length === 1 && labels[0].path === `DECLARACIONES${age}` && labels[0].type === '1'
      && !labels[0].suffix && norm(labels[0].value) === norm(names[p.territorio]), 'familia-ses-territorio-hijo-distinto');
  }
  if (!p.otroTitularId) ensure(!records.some(r => /^(?:NIFOP|NIFOPAUX|NIFOPDLG|NIFOPDLGHMEN|NIFOP01)$/.test(r.key)), 'familia-ses-otro-titular');
  return {
    estado: 'identidad-familiar-ses-parcial', countedAsMatch: false,
    observado: { fechaNacimiento: p.fechaNacimientoSES, edad: p.edad, vinculo: p.vinculoSES,
      numeroTitularesObservado: p.titulares, territorio: p.territorio },
    noVerificable: ['custodia-juridica', 'convivencia-y-residencia-efectivas', 'rentas-exactas-hijo-y-titulares',
      'declaracion-hijo', 'ausencia-alimentos-adopcion-discapacidad', 'exhaustividad-hechos-y-registros',
      'autenticidad-aeat', ...(p.territorio === 'madrid' ? [] : ['corte-familiar-fuera-madrid-no-observado'])],
    // Sin interpretar GUARD/GUAROD/RENTASHMEN ni convertir ausencias en false/cero.
    camposSinSemantica: ['GUARD', 'GUAROD', 'RENTASHMEN'],
  };
}

/** Diagnóstico del piloto sintético, nunca una certificación de hechos reales.
 * No se atribuye semántica a controles anónimos ni a ausencias del SES/PDF.
 * Hasta disponer de readbacks identificados de los restantes predicados, este
 * informe no habilita coincidenciaVerificada. Los nombres en faltantes son
 * requisitos de recaptura, no claves que baste añadir manualmente al JSON.
 */
export function familyPredicateReadback(text, caso, evidence) {
  const identity = familySesReadback(text, caso);
  const e = caso.entradaAPI ?? caso.entrada, d = e.derechosMinimos;
  const child = d.descendientes[0];
  ensure(e.comunidadAutonoma === 'madrid' && child.edadDevengo === 10
    && d.contribuyenteId === 's-1' && child.sujetoId === 's-3'
    && child.titulares.length === 2 && child.titulares.some(t => t.titularId === 's-2'),
  'familia-scope-fuera-piloto');
  ensure(child.rentasNoExentasCentimos === 0, 'familia-renta-fuera-piloto');
  ensure(Array.isArray(evidence?.readbacks), 'familia-readbacks-ausentes');
  const row = key => {
    const rows = evidence.readbacks.filter(r => r?.key === key);
    ensure(rows.length === 1, 'familia-readback-ausente-o-duplicado');
    return rows[0];
  };
  for (const [key, expected] of [['nif', '90000000B'], ['birth', '01/01/1985'],
    ['child-nif', '90000002J'], ['child-birth', '01/01/2015'], ['other-nif', '90000001N']]) {
    const r = row(key);
    ensure(r.requested === expected && r.observed === expected, 'familia-readback-identidad-distinta');
  }
  const region = row('region'), link = row('family-link');
  const label = 'DHijos del primer declarante si también conviven con el otro progenitor: hijos de parejas de hecho, hijos del declarante con guarda y custodia compartida, hijos del declarante cuando haya fallecido el otro progenitor en el año';
  ensure(region.selected === 'MADRID' && region.options?.filter(x => x === region.selected).length === 1
    && link.selected === label && link.options?.filter(x => x === label).length === 1,
  'familia-readback-scope-distinto');
  const rent = row('child-income-over-8000');
  ensure(rent.observed === false && rent.exactIncomeEntered === false, 'familia-readback-renta-distinta');
  return {
    estado: 'predicados-familiares-parciales', countedAsMatch: false, origen: 'sintetico',
    alcance: 'Piloto Madrid individual, hijo de 10 años, renta API cero y dos titulares; no prueba hechos reales',
    identidad: identity.observado,
    equivalencias: ['identidad-referencial', 'fecha-y-edad', 'vinculo-ui-D', 'dos-titulares-observados',
      'renta-api-cero-satisface-predicado-ui-no-superior-8000'],
    // renta0 es una restricción de la entrada sintética, no una observación UI.
    rentaExactaIntroducidaEnOpen: false,
    faltantes: ['declaracion-hijo-control-identificado', 'discapacidad-control-identificado',
      'otras-situaciones-y-alimentos-control-identificado', 'custodia-compartida-sin-convivencia-progenitores',
      'exhaustividad-familiar-y-ausencia-fallecimientos'],
    limite: 'D admite varios supuestos; checkbox8000 no demuestra renta exacta ni ausencia de declaración. No interpretar RENTASHMEN ni controles sin etiqueta',
  };
}
