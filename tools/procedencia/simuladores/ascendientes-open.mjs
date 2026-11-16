/** Cuatro perfiles explícitamente sintéticos Open2025. Sólo procedencia, sin cálculo.
 * No convertir predicados de inclusión UI en renta cero, no declaración o año
 * completo. CONVIVENCIA vacío es obligatorio para uno (error UI 100R304).
 */
import { isDeepStrictEqual as equal } from 'node:util';
import { Schema } from 'effect';
const string = Schema.is(Schema.String);
const ensure = (ok, code) => { if (!ok) throw Error(code); };
const norm = s => String(s).replaceAll('\u00a0', ' ').replace(/\s+/g, ' ').trim();
const profiles = {
  'open2025-comunitat-valenciana-01': ['comunitat-valenciana', 'COMUNITAT VALENCIANA', '17', '30000.00', '1950.00', '4200.00'],
  'open2025-canarias-02': ['canarias', 'CANARIAS', '05', '45000.00', '2925.00', '8500.00'],
  'open2025-aragon-03': ['aragon', 'ARAGON', '02', '60000.00', '3900.00', '14000.00'],
  'open2025-castilla-y-leon-04': ['castilla-y-leon', 'CASTILLA Y LEON', '08', '30000.00', '1950.00', '4200.00'],
};
export function validateAscendantCase(caso) {
  ensure(!(Object.hasOwn(caso, 'entradaAPI') && Object.hasOwn(caso, 'entrada')), 'asc-entrada-ambigua');
  const e = Object.hasOwn(caso, 'entradaAPI') ? caso.entradaAPI : caso.entrada;
  const p = profiles[caso.id ?? caso.job?.id];
  ensure(p && e?.comunidadAutonoma === p[0] && e.edad === 40 && e.ejercicio === 2025
    && e.modalidad === 'individual' && e.perfil === 'solo-trabajo'
    && e.devengo === '2025-12-31' && e.familiaresConDerechoMinimo === 'segun-derechos'
    && caso.modalidadObjetivo !== 'conjunta', 'asc-perfil-no-observado');
  const d = e.derechosMinimos;
  const birth = ['canarias', 'castilla-y-leon'].includes(p[0]) ? '1948-12-31' : '1955-01-01';
  const expected = {
    ascendientes: [{ sujetoId: 's-90', fechaNacimiento: birth, situacionDevengo: 'vivo',
      gradoDiscapacidad: 0, ayudaOMovilidadReducida: false, claseDiscapacidad: 'fisica', permanente: false,
      soporteDiscapacidad: 'no-discapacidad', declaracion: 'no-presenta',
      economia: { perfil: 'sin-rentas', exhaustividad: 'completa', soporte: 'hecho-sintetico-revisor' },
      titularesCompletos: true, titulares: [{ titularId: 's-1', grado: 1, vinculo: 'consanguinidad',
        residenteIrpf: true, declaracion: 'individual',
        economia: { perfil: 'solo-trabajo', exhaustividad: 'completa', soporte: 'hecho-sintetico-revisor',
          otrasRentas: 'ninguna', trabajo: e.trabajo },
        convivencia: [{ desde: '2025-01-01', hasta: '2025-12-31' }], internamientoEspecializado: [],
        dependenciaEconomica: false, soporte: 'vinculo-sintetico' }] }],
    conciliacionRentasContribuyente: { otrasRentasOGastosNoRepresentados: 'ninguno', perfil: 'caso-anual-parcial' },
    contribuyenteId: 's-1', descendientes: [], descendientesCompletos: true, ascendientesCompletos: true,
    devengo: e.devengo, discapacidadContribuyente: { _tag: 'SinDiscapacidad' }, edadContribuyenteDevengo: 40,
    ejercicio: 2025, fallecimientosEnElEjercicio: 'ninguno', modalidad: 'individual', regimen: 'comun', territorio: p[0],
  };
  ensure(equal(d, expected) && (e.contribuyenteId === undefined || e.contribuyenteId === 's-1'), 'asc-contrato-fuera-corte');
  ensure(e.trabajo?.rendimientos?.length === 1 && e.retenciones?.length === 1
    && e.trabajo.rendimientos[0].integro === p[3]
    && e.trabajo.rendimientos[0].cotizaciones?.seguridadSocial === p[4]
    && e.retenciones[0].importe === p[5], 'asc-importes-fuera-corte');
  const work = e.trabajo.rendimientos[0];
  ensure(work.cotizaciones.derechosPasivos === '0' && work.cotizaciones.colegiosHuerfanos === '0'
    && ['sindicato', 'colegio', 'defensa'].every(k => work[k]?.importe === '0'), 'asc-gastos-fuera-corte');
  return { territorio: p[0], etiqueta: p[1], codigo: p[2], birth,
    birthUi: birth.split('-').reverse().join('/'), edad: String(2025 - Number(birth.slice(0, 4))) };
}

// Ámbitos y censo cerrado: únicamente las claves familiares observadas. Una
// sección vacía es estructura UI; otro registro/ámbito familiar no se ignora.
export function ascendantSesReadback(text, caso) {
  const p = validateAscendantCase(caso), stack = [], sections = [], rows = [];
  ensure(string(text) && text.length <= 4 * 1024 * 1024 && !text.includes('\r')
    && /^<\?xml[^\n]*CodModelo="100"[^\n]*EjModelo="2025"[^\n]*\?><PERSISTENCIAV2>\s*\n/.test(text)
    && text.trimEnd().endsWith('</PERSISTENCIAV2>'), 'asc-ses-invalido');
  for (const line of text.split('\n').slice(1)) {
    if (!line.trim() || line === '</PERSISTENCIAV2>') continue;
    ensure(!line.includes('\t'), 'asc-ses-indentacion');
    const indent = line.length - line.trimStart().length;
    while (stack.length && stack.at(-1).indent >= indent) stack.pop();
    const s = /^ *\[([A-Z0-9_]+)\]$/.exec(line);
    if (s) { const b = { name: s[1], indent, path: [...stack.map(x => x.name), s[1]].join('/'), rows: [] }; sections.push(b); stack.push(b); continue; }
    if (['{', '}', '(', ')'].includes(line.trim())) continue;
    const r = /^ *(\w+)~([123])~([^~\r\n]*)(?:~(254|255))?$/.exec(line);
    ensure(r && stack[0]?.name === 'DECLARACIONES', 'asc-ses-registro');
    const row = { key: r[1], type: r[2], value: r[3], suffix: r[4], path: stack.map(x => x.name).join('/') };
    rows.push(row); stack.at(-1).rows.push(row);
  }
  for (const [name, path, indent] of [['DECLARACIONES', 'DECLARACIONES', 0], ['DP', 'DECLARACIONES/DP', 2], ['IRPF2025', 'DECLARACIONES/IRPF2025', 2]]) {
    const found = sections.filter(x => x.name === name);
    ensure(found.length === 1 && found[0].path === path && found[0].indent === indent, 'asc-ses-ambito');
  }
  const dpKeys = new Set(['SOLTERO', 'HOMBRE_D', 'HOMBRE_C', 'ISAUTORIZCONYU', 'DPFNAC_D', 'CAD_D',
    'MUJER_D', 'MUJER_C', 'CASADO', 'DECFAL', 'PH18', 'ECIVIL', 'VIUDO', 'ECIVILC', 'CAC_D',
    'DP_APENOM_D', 'EDADD', 'SEPARADO', 'DPNIF_C', 'DPNIF_D']);
  ensure(rows.filter(r => r.path === 'DECLARACIONES/DP').every(r => dpKeys.has(r.key)), 'asc-ses-dp-extra');
  for (const key of ['DPNIF_C', 'DECFAL', 'CASADO', 'HOMBRE_C', 'MUJER_C', 'ISAUTORIZCONYU']) {
    const rs = rows.filter(r => r.key === key);
    ensure(rs.length === 1 && rs[0].path === 'DECLARACIONES/DP' && rs[0].type === '2'
      && rs[0].value === '254' && rs[0].suffix === undefined, 'asc-ses-titular-extra');
  }
  const asc = sections.filter(x => x.name === 'ASCENDIENTES');
  ensure(asc.length === 2 && asc.every(x => x.path === 'DECLARACIONES/DP/ASCENDIENTES' && x.indent === 4)
    && asc.filter(x => x.rows.length).length === 1, 'asc-ses-censo');
  for (const b of sections) {
    if (/DESCENDIENT|RWHIJOS|OTROSPROGEN|ASCENDIENT/.test(b.name))
      ensure(b.name === 'ASCENDIENTES' || (b.path === `DECLARACIONES/DP/${b.name}`
        && ['DESCENDIENTES', 'RWHIJOSMENOR18', 'RWHIJOSMAYOR18'].includes(b.name) && !b.rows.length), 'asc-ses-censo-extra');
    ensure(!/^IRPF/.test(b.name) || b.name === 'IRPF2025', 'asc-ses-ejercicio');
  }
  const expected = [];
  const add = (path, key, value, type = '1', suffix) => expected.push({ path: `DECLARACIONES${path}`, key, value, type, suffix });
  add('', 'INDV', 'true'); add('/IRPF2025', 'TITULAR', 'DECLARANTE');
  add('/DP', 'DPNIF_D', '90000000B', '3', '254'); add('/DP', 'DPFNAC_D', '01/01/1985');
  add('/DP', 'EDADD', '40'); add('/DP', 'CAD_D', p.etiqueta); add('/DP', 'CAC_D', p.codigo);
  add('/IRPF2025', 'ZCCAD', p.codigo); add('/IRPF2025', 'ZFNAC_D', '01/01/1985');
  const fields = { VINASDLG: 'D', ANOASDLG: p.birthUi, APENOM_DAFAS_ASC: 'PRUEBA ASCENDIENTE',
    APENOMDLG_ASC: 'PRUEBA ASCENDIENTE', DNIAS: '90000002J', EDADA: p.edad, APENOM_ASC: 'PRUEBA ASCENDIENTE',
    VINAS: 'D', ANOAS: p.birthUi, DNIASDLG: '90000002J', MESESDAFAS2: '13' };
  for (const [key, value] of Object.entries(fields)) add('/DP/ASCENDIENTES', key, value);
  for (const [key, value] of Object.entries({ ZDNIAS1: '90000002J', ZANOAS1: p.birthUi, VINAS1: 'D', ZAPENAS1: 'PRUEBA ASCENDIENTE' })) add('/IRPF2025', key, value);
  for (const w of expected) {
    const found = rows.filter(r => r.key === w.key);
    ensure(found.length === 1 && equal({ ...found[0], value: norm(found[0].value) }, { ...w, value: norm(w.value) }), 'asc-ses-identidad');
  }
  ensure(asc.find(x => x.rows.length).rows.length === Object.keys(fields).length, 'asc-ses-campos-extra');
  // Rechaza otro ordinal familiar o titular aunque aparezca fuera del censo.
  ensure(!rows.some(r => /^(?:Z?DNIAS\d*|Z?ANOAS\d*|VINAS\d*|ZAPENAS\d*|CONVIVENCIA\d*|NIFOP\w*|NIFH\w*|VINCU\w*|FNAC\w*)$/.test(r.key)
    && !expected.some(w => w.key === r.key)), 'asc-ses-familia-extra');
  return { territorio: p.territorio, codigoTerritorial: p.codigo, nifSintetico: '90000002J',
    nacimiento: p.birth, vinculo: 'D', registrosAscendientesActivos: 1,
    mesesDafas2Observado: '13', semanticaMesesDafas2: 'no-inferida' };
}

const inclusion = 'Sólo deben relacionarse los ascendientes que convivan con el contribuyente, que no tengan rentas superiores a 8.000 euros y que no presenten declaración con rentas superiores a 1.800 euros.';
const sharing = 'Si el ascendiente convive con varios descendientes que cumplan los requisitos para poder aplicar el mínimo familiar por ascendientes, indique el número de ellos:';
export function ascendantPredicateReadback(text, caso, evidence) {
  const identity = ascendantSesReadback(text, caso), p = validateAscendantCase(caso);
  ensure(Array.isArray(evidence?.readbacks?.readbacks), 'asc-readbacks-ausentes');
  const row = key => { const rs = evidence.readbacks.readbacks.filter(x => x?.key === key); ensure(rs.length === 1, 'asc-readback-ambiguo'); return rs[0]; };
  const amounts = profiles[caso.id ?? caso.job?.id];
  for (const [key, value] of [['IDII', amounts[3]], ['GSS', amounts[4]], ['IDRE', amounts[5]],
    ['GCS', '0.00'], ['GCC', '0.00'], ['GDJ', '0.00'],
    ['IDICLDED2', amounts[3]], ['GSSCLDED2', amounts[4]]]) {
    const r = row(key);
    const observed = r.observed === '' ? '0.00' : string(r.observed)
      && /^(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2}$/.test(r.observed)
      ? r.observed.replaceAll('.', '').replace(',', '.') : null;
    ensure(r.requested === value && observed === value, 'asc-readback-moneda');
  }
  for (const [key, value] of [['nif', '90000000B'], ['birth', '01/01/1985'], ['asc-nif', '90000002J'],
    ['asc-birth', p.birthUi], ['asc-name', 'PRUEBA ASCENDIENTE']]) {
    const r = row(key); ensure(r.requested === value && r.observed === value, 'asc-readback-identidad');
  }
  const link = row('asc-link'), region = row('region'), holders = row('asc-number-right-holders');
  ensure(link.selected === 'DAscendiente del primer declarante' && link.observed === 'D'
    && link.options?.filter(x => x === link.selected).length === 1
    && norm(region.selected) === p.etiqueta && region.options?.filter(x => x === region.selected).length === 1, 'asc-readback-vinculo-territorio');
  ensure(row('asc-inclusion-predicates').observed === inclusion && holders.label === sharing
    && holders.observed === '' && holders.reglaUiObservada === '100R304'
    && row('asc-disability').observed === ' ' && row('asc-death').observed === '', 'asc-readback-predicados');
  const htmlText = html => norm(html.replace(/<[^>]*>/g, ' ').replaceAll('&nbsp;', ' '));
  ensure(string(evidence.dialogo) && htmlText(evidence.dialogo).includes(inclusion)
    && htmlText(evidence.dialogo).includes('Sólo deben reflejarse los ascendientes que convivan con el contribuyente, al menos, la mitad del período impositivo.')
    && evidence.dialogo.includes('title="Clave de discapacidad:"')
    && evidence.dialogo.includes(`title="${sharing}"`), 'asc-dialogo-predicados');
  ensure(string(evidence.reglaConvivencia) && htmlText(evidence.reglaConvivencia).includes('Error 100R304')
    && htmlText(evidence.reglaConvivencia).includes('cuando el ascendiente haya convivido con más de un descendiente'), 'asc-regla-convivencia');
  // Snapshot identificado: una fila ascendiente y ningún nombre de hijo. Los
  // controles anónimos no se interpretan como comprobación de hechos fiscales.
  const personal = evidence.personal;
  ensure(Array.isArray(personal), 'asc-personal-ausente');
  for (const title of ['Nombre del hijo', 'Nombre del descendiente']) {
    const rs = personal.filter(x => x.title === title);
    ensure(rs.length === 1 && rs[0].value === '', 'asc-personal-descendientes');
  }
  for (const [title, values] of [['Vinculación:', ['D', '']], ['Convivencia:', ['', '']],
    ['Fallecido en 2025:', ['', '']]])
    ensure(equal(personal.filter(x => x.title === title).map(x => x.value), values), 'asc-personal-censo');
  ensure(equal(personal.filter(x => x.title === 'NIF:').map(x => x.value), ['90000000B', '', '', '90000002J', '']), 'asc-personal-identidad');
  // La entrada sintética está fijada arriba: renta cero, no declaración,
  // convivencia anual y un único titular. Open solicita las condiciones del
  // mínimo, no esos hechos exactos. En este corte sin otras deducciones,
  // proyectarlos a <=8000, no declaración con >1800 y >=medio período conserva
  // íntegro el derecho: no hay prorrateo por meses para un único titular.
  // La equivalencia se limita a este cálculo y no acredita hechos de una persona.
  return { estado: 'proyeccion-sintetica-de-predicados', aptoParaBindingSintetico: true,
    countedAsMatch: false, origen: 'sintetico', identidad: identity,
    equivalencias: ['identidad-y-nacimiento-ses-ui', 'vinculo-D', 'un-registro-sin-descendientes-observados',
      'convivencia-ui-al-menos-medio-periodo', 'inclusion-ui-renta-no-superior-8000',
      'inclusion-ui-no-declaracion-con-renta-superior-1800', 'convivencia-vacia-regla-100R304'],
    controlesVaciosObservados: ['discapacidad', 'fallecimiento', 'numero-descendientes-con-derecho'],
    hechosNoIntroducidosExactamente: ['renta-exacta-cero', 'no-presentacion-absoluta-declaracion', 'convivencia-todo-el-anio',
      'ausencia-discapacidad-hecho', 'grado-consanguinidad-y-residencia-efectivos', 'exhaustividad-fiscal', 'autenticidad-aeat'],
    limite: 'Equivalencia de predicados para el mínimo ordinario del perfil sintético, sin otras deducciones. No acredita hechos externos ni autenticidad AEAT; MESESDAFAS2 no se interpreta.' };
}
