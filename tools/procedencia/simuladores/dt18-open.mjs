/** Binding privado acotado: transporte observado; nunca oráculo fiscal DT18. */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Schema } from 'effect';
import { validateCase, sesReadback, uiCents, cents } from './capturar-casos.mjs';
import { parseSES, housingSES } from './dt18-ses.mjs';

const pins = JSON.parse(readFileSync(new URL('./dt18-pins.json', import.meta.url)));
export const dt18Hash = b => createHash('sha256').update(b).digest('hex');
const ensure = (ok, code) => { if (!ok) throw Error(code); };
const object = Schema.is(Schema.Record(Schema.String, Schema.Unknown));
const string = Schema.is(Schema.String);
const canonical = v => JSON.stringify(Array.isArray(v) || object(v)
  ? Array.isArray(v) ? v.map(v => JSON.parse(canonical(v)))
    : Object.fromEntries(Object.keys(v).sort().map(k => [k, JSON.parse(canonical(v[k]))])) : v);

export function validateDT18Case(caso, original) {
  ensure(caso && !Object.hasOwn(caso, 'entrada') && caso.modalidadObjetivo !== 'conjunta', 'dt18-entrada-ambigua');
  ensure(caso.id !== 'open2025-la-rioja-01', 'dt18-solicitud-regional-no-observada');
  const pin = pins.find(p => p.id === caso.id), e = caso.entradaAPI;
  // Integridad de TODO el expediente antes de construir la proyección salarial.
  // Incluye documentos, historia, censo, solicitudes y hechos nunca introducidos.
  ensure(pin && e && dt18Hash(canonical(e)) === pin.entradaSha256, 'dt18-entrada-preparada-distinta');
  ensure(original?.id === caso.id && original.territorio === pin.territorio
    && canonical(original.entradaAPI) === canonical(e), 'dt18-original-caso-distinto');
  ensure(caso.territorio === pin.territorio && e.comunidadAutonoma === pin.territorio
    && e.modalidad === 'individual' && e.contribuyenteId === 's-1', 'dt18-identidad-distinta');
  const d = e.deduccionesTerritoriales2025;
  ensure(e.deducciones === 'territoriales-por-hechos-y-da61' && d?.viviendaDT182025
    && Array.isArray(d.solicitudes), 'dt18-expediente-ausente');
  // No modifica el caso recibido. Sólo tras el pin íntegro permite al validador
  // existente revisar su corte salarial, sin ampliar sus hechos admitidos.
  const projected = structuredClone(e);
  delete projected.deduccionesTerritoriales2025;
  projected.deducciones = 'solo-da61-si-procede';
  const salary = validateCase({ id: caso.id, entrada: projected });
  return { pin, salary, contratoExterno: d };
}

/** Requiere recibo e inventarios originales autenticados por el cargador. */
export function dt18UiReadback(receipt, readbacks, inventories, housing, original) {
  const {pin} = validateDT18Case(original,original);
  ensure(housing.payments === pin.payments, 'dt18-pagos-captura-distintos');
  ensure(receipt.id === original.id && receipt.state === 'complete-status'
    && receipt.transportComplete === true && receipt.dt18?.state === 'complete-status'
    && receipt.dt18.transportComplete === true && receipt.dt18.uiControlsAccepted === true
    && receipt.templateSha256 === null && receipt.dt18.missing?.length === 0,
  'dt18-transporte-incompleto');
  ensure(canonical(housing.externalFacts.fullContract) === canonical(original.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025)
    && canonical(housing.externalFacts.regionalRequests) === canonical(original.entradaAPI.deduccionesTerritoriales2025.solicitudes)
    && housing.externalFacts.observedInUI === false, 'dt18-contrato-externo-distinto');
  ensure(Array.isArray(readbacks) && canonical(readbacks) === canonical(receipt.readbacks), 'dt18-readbacks-distintos');
  const one = key => { const rows = readbacks.filter(r => r.key === key); ensure(rows.length === 1, 'dt18-readback-no-unico'); return rows[0]; };
  for (const [key, expected, observed] of [
    ['dt18-payments',housing.payments,formatUI(pin.payments)], ['dt18-date','01/02/2010','01/02/2010'],
    ['dt18-loan','00000000000000000000','00000000000000000000'], ['dt18-percent','100.00','100,00'],
    ['housing-ownership','100.00','100,00'], ['housing-days','365','365'],
    ['housing-address','CALLE PRUEBA SINTETICA 1','CALLE PRUEBA SINTETICA 1'],
  ]) {
    const r = one(key);
    ensure(r.requested === expected && r.observed === observed, 'dt18-readback-distinto');
  }
  for (const key of ['nif','name','birth','region']) {
    const r=one(key), expected=pin.identity[key];
    // El selector conserva NBSP y el readback del campo muestra espacios ordinarios.
    ensure(key === 'region' ? r.selected === expected && r.observed === expected.replaceAll('\u00a0',' ')
      : r.requested === expected && r.observed === expected, 'dt18-ui-identidad-distinta');
  }
  for (const key of ['IDII','GSS','IDRE','GCS','GCC','GDJ','IDICLDED2','GSSCLDED2']) {
    const r = one(key);
    // Un cero omitido sólo se admite tras escritura explícita y readback vacío.
    ensure(r.observed === '' ? cents(r.requested) === 0n : uiCents(r.observed) === cents(r.requested), 'dt18-salario-ui-distinto');
  }
  for (const [key,name] of [['dt18-negativos-antes','antes'],['dt18-negativos-despues','despues']]) {
    const r = one(key);
    ensure(r.exactExternalFactsEntered === false && canonical(r.observed) === canonical(inventories[name]), 'dt18-negativos-distintos');
  }
  return { contratoHistorico: 'externofactual', hechosNoIntroducidosConservados: true };
}

const decimal = value => {
  ensure(string(value) && /^-?\d+(?:\.\d{1,2})?$/.test(value), 'dt18-decimal-invalido');
  const negative = value.startsWith('-'), [a,b=''] = value.replace(/^-/, '').split('.');
  const n = BigInt(a)*100n+BigInt(b.padEnd(2,'0')); return negative ? -n : n;
};
export function dt18SesPdfReadback(decoded, pdfText, validated, housing, readbacks) {
  const { records, sections } = parseSES(decoded), base = 'DECLARACIONES/IRPF2025';
  for (const path of ['DECLARACIONES','DECLARACIONES/DP',base])
    ensure(sections.filter(s => s.path === path).length === 1, 'dt18-ses-ambito-ambiguo');
  const row = (key, path, type='1', flag=null) => {
    const rows = records.filter(r => r.key === key);
    ensure(rows.length === 1 && rows[0].path === path && rows[0].type === type && rows[0].flag === flag, 'dt18-ses-registro-ambiguo');
    return rows[0].value;
  };
  ensure(validated.pin.estado === 'captura-completa-observada'
    && validated.pin.payments === housing.payments, 'dt18-captura-no-observada');
  for (const [key,path,value,type,flag] of [
    ['INDV','DECLARACIONES','true'],['TITULAR',base,'DECLARANTE'],
    ['CAC_D','DECLARACIONES/DP',validated.pin.codigoTerritorio],['ZCCAD',base,validated.pin.codigoTerritorio],
    ['DPNIF_D','DECLARACIONES/DP',validated.pin.identity.nif,'3','254'],
    ['DP_APENOM_D','DECLARACIONES/DP',validated.pin.identity.name],
    ['ZAPENOM_D',base,validated.pin.identity.name],
    ['SPNOM',base,validated.pin.identity.name],
  ]) ensure(row(key,path,type,flag) === value, 'dt18-ses-identidad-distinta');
  // La identidad del PDF se contrasta en su cabecera, no por una subcadena
  // incidental ni sólo por la huella del fichero.
  const header = pdfText.split('Opción de tributación')[0];
  const normalize = text => text.normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ').trim();
  const pdfField = (box, expected, scope = header) => {
    const lines = scope.split('\n').filter(l => new RegExp(`\\b${box}\\s*$`).test(l));
    const suffix = normalize(`${expected} ${box}`);
    ensure(lines.length === 1 && (normalize(lines[0]) === suffix
      || normalize(lines[0]).endsWith(' ' + suffix)), 'dt18-pdf-identidad-distinta');
  };
  pdfField('0001', validated.pin.identity.nif);
  pdfField('0002', validated.pin.identity.name);
  pdfField('0010', validated.pin.identity.birth);
  pdfField('0070', validated.pin.identity.region.replaceAll('\u00a0', ' '));
  // pdftotext puede ordenar la marca X después del título de trabajo, por las
  // columnas del PDF. Acotamos la opción antes de las retribuciones dinerarias.
  const option = pdfText.split('Opción de tributación')[1]?.split('Retribuciones dinerarias')[0];
  ensure(option && option.includes('Tributación individual') && !option.includes('Tributación conjunta')
    && !/\b0069\s*$/m.test(option), 'dt18-pdf-modalidad-distinta');
  pdfField('0068', 'X', option);
  housingSES(decoded, housing);
  const salary = sesReadback(decoded, validated.salary);
  // Ausencia cero sólo con escritura explícita y readback UI autenticado.
  // No se usa ausencia SES como evidencia autónoma de cero.
  for (const [key, expected] of Object.entries(validated.salary.amounts)) {
    const rows = records.filter(r => r.key === key);
    const path = base + (['IDII','GSS','IDRE','GCS','GCC','GDJ'].includes(key) ? '/ATRABAJO/DLGTRABAJO' : '');
    const ui = readbacks.filter(r => r.key === key);
    ensure(ui.length === 1 && cents(ui[0].requested) === cents(expected), 'dt18-salario-ui-ausente');
    if (!rows.length) {
      ensure(decimal(expected) === 0n && ui[0].observed === '', 'dt18-ses-salario-omitido');
      continue;
    }
    ensure(rows.length === 1 && rows[0].path === path && rows[0].flag === null, 'dt18-ses-salario-omitido');
    const r = rows[0];
    ensure(r.type === '1' ? decimal(r.value) === decimal(expected)
      : r.type === '2' && r.value === '255' && decimal(expected) === 0n, 'dt18-ses-salario-distinto');
  }
  const boxes = {};
  for (const [key, box] of [['DED1E','0547'],['DED1A','0548'],['RESULTADO','0670'],
    ['MPER','0511'],['MPERAU','0512'],['MPERFA','0519'],['MPERFAAU','0520']]) {
    const lines = pdfText.split('\n').filter(l => new RegExp(`\\b${box}\\s*$`).test(l));
    const m = lines.length === 1 && /(?:^|\s)(-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})\s+\d{4}\s*$/.exec(lines[0]);
    ensure(m, 'dt18-pdf-casilla-no-unica');
    const amount = m[1].replaceAll('.','').replace(',','.');
    ensure(decimal(row(key,base)) === decimal(amount), 'dt18-ses-pdf-distinto');
    boxes[box] = amount;
  }
  return { estado:'transporte-dt18-ses-pdf-vinculado', countedAsMatch:false,
    casillas:boxes, salario:salary, contratoHistorico:'externofactual',
    limite:'Vincula entrada preparada y artefactos observados; no acredita historia, autenticidad AEAT ni calcula DT18. Oráculo fiscal separado.' };
}

// Formato decimal UI exacto; no cálculo fiscal.
const formatUI = value => {
  ensure(/^\d+\.\d{2}$/.test(value), 'dt18-decimal-invalido');
  const [whole,fraction]=value.split('.');
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+fraction;
};

/** Cruza hashes del recibo original con el pin; el cargador autentica sus bytes. */
export function dt18ReceiptReadback(receipt, pin) {
  ensure(receipt.id === pin.id && receipt.state === 'complete-status'
    && receipt.transportComplete === true && receipt.countedAsMatch === false
    && receipt.dt18?.state === 'complete-status' && receipt.dt18.transportComplete === true
    && receipt.dt18.countedAsMatch === false && receipt.dt18.uiControlsAccepted === true
    && Array.isArray(receipt.dt18.missing) && receipt.dt18.missing.length === 0
    && receipt.templateSha256 === null, 'dt18-transporte-incompleto');
  ensure(receipt.inputSha256 === pin.originales['entrada.json']
    && receipt.caseSha256 === pin.originales['caso.json']
    && receipt.ses?.sha256 === pin.originales['captura.ses']
    && receipt.pdf?.sha256 === pin.originales['captura.pdf'], 'dt18-recibo-distinto');
  const fields=receipt.dt18.fields;
  ensure(Array.isArray(fields) && fields.length === 4, 'dt18-recibo-campos-distintos');
  for(const [key,value] of [['payments',pin.payments],['date','01/02/2010'],
    ['loan','00000000000000000000'],['percent','100.00']]) {
    const rows=fields.filter(f=>f.key===key);
    ensure(rows.length === 1 && rows[0].state === 'readback-only' && rows[0].value === value, 'dt18-recibo-campos-distintos');
  }
}
