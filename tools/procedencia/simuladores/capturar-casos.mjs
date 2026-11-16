/** Transporte serial Open2025, sin motor ni comparación fiscal.
 * Reutiliza c300.py/replay_functions.py, fresh/family_setup acreditados y el
 * piloto TS: teclado + Tab + readback; PDF por fetch en el contexto de página.
 * Node/Bun: --cases /ruta/casos.json --limit 1 [--case id]. --self-test es offline.
 * Entorno obligatorio: C_RUN_DIR (externo al repo), C_CHROMIUM (ejecutable),
 * C_PLAYWRIGHT_MODULE (archivo absoluto del módulo externo playwright-core).
 * Opcional: C_TEMPLATE_FILE + C_TEMPLATE_SHA256, sólo Madrid sin familia.
 * Cada caso se ejecuta bajo timeout -k 30s 10m, sin reintentos; su directorio
 * exclusivo también reserva los intentos fallidos. No borra ni pisa originales.
 * Límites: empleo agregado, individual, edades 40/42/45/48 y regiones comunes;
 * familia sólo Madrid, un descendiente sin discapacidad, nacido el 1 de enero,
 * <25 años, rentas <=8000, sin declaración ni alimentos/adopción. La UI declara
 * predicados familiares, no la renta exacta ni derechos externos. SES sin editar.
 */
import { readFileSync, writeFileSync, mkdirSync, realpathSync, statSync, rmdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { isAbsolute, relative, resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { Schema } from 'effect';
import { validateFamilyCase, validateSyntheticFamilyCase, familySesReadback } from './familia-open.mjs';
import { validateAscendantCase } from './ascendientes-open.mjs';

const self = fileURLToPath(import.meta.url);
const root = fileURLToPath(new URL('../../../', import.meta.url));
const URL_OPEN = 'https://www2.agenciatributaria.gob.es/wlpl/PARE-RW25/OPEN/index.zul?EJER=2025&TACCESO=COLAB';
const names = { andalucia: 'ANDALUCIA', catalunya: 'CATALUÑA', 'comunitat-valenciana': 'COMUNITAT VALENCIANA', galicia: 'GALICIA', canarias: 'CANARIAS', aragon: 'ARAGON', madrid: 'MADRID', asturias: 'PRINCIPADO DE ASTURIAS', 'illes-balears': 'ILLES BALEARS', cantabria: 'CANTABRIA', 'castilla-la-mancha': 'CASTILLA-LA MANCHA', 'castilla-y-leon': 'CASTILLA Y LEON', extremadura: 'EXTREMADURA', murcia: 'REGION DE MURCIA', 'la-rioja': 'LA RIOJA' };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const norm = s => s.normalize('NFD').replace(/\p{M}/gu, '').replaceAll('\u00a0', ' ').trim().toUpperCase();
const ensure = (ok, message) => { if (!ok) throw Error(message); };
const write = (path, bytes) => writeFileSync(path, bytes, { flag: 'wx' });
const string = Schema.is(Schema.String);
export function cents(value) {
  ensure(string(value) && /^\d{1,7}(?:\.\d{1,2})?$/.test(value), 'Importe fuera del contrato');
  const [whole, fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
}
const euros = n => `${n / 100n}.${String(n % 100n).padStart(2, '0')}`;
export function uiCents(value) {
  ensure(string(value) && /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(value), 'Readback monetario ambiguo');
  return cents(value.replaceAll('.', '').replace(',', '.'));
}

// Lectura acotada de los ámbitos de contract.py/binding.py. No interpreta
// casillas fiscales ni atribuye a los campos ausentes hechos no declarados.
export function sesReadback(decoded, c) {
  ensure(/^<\?xml[^\n]*EjModelo="2025"[^\n]*\?><PERSISTENCIAV2>\s*\n/.test(decoded) && decoded.trimEnd().endsWith('</PERSISTENCIAV2>'), 'SES incompleto o de otro ejercicio');
  const personal = {}, amounts = {}, stack = [];
  const workKeys = ['IDII', 'GSS', 'IDRE', 'GCS', 'GCC', 'GDJ'];
  const personalKeys = ['EDADD', 'DPFNAC_D', 'CAD_D', 'CAC_D', 'ZCCAD', 'ZFNAC_D'];
  for (const line of decoded.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    while (stack.length && stack.at(-1)[0] >= indent) stack.pop();
    const section = /^ *\[([A-Z0-9_]+)\]$/.exec(line);
    if (section) { stack.push([indent, section[1]]); continue; }
    const prefix = /^ *(\w+)~/.exec(line), key = prefix?.[1];
    if (!Object.hasOwn(c.amounts, key) && !personalKeys.includes(key)) continue;
    const record = /^ *(\w+)~([123])~([^~\r\n]*)$/.exec(line);
    ensure(record, `SES registro malformado: ${key}`);
    const path = stack.map(([, name]) => name).join('/');
    if (personalKeys.includes(key)) {
      const wanted = ['ZCCAD', 'ZFNAC_D'].includes(key) ? 'DECLARACIONES/IRPF2025' : 'DECLARACIONES/DP';
      ensure(path === wanted && !Object.hasOwn(personal, key) && record[2] === '1', `SES ámbito personal ambiguo: ${key}`);
      personal[key] = record[3];
    } else {
      const wanted = 'DECLARACIONES/IRPF2025' + (workKeys.includes(key) ? '/ATRABAJO/DLGTRABAJO' : '');
      ensure(path === wanted && !Object.hasOwn(amounts, key), `SES ámbito monetario ambiguo: ${key}`);
      amounts[key] = record[2] === '2' ? null : record[3];
    }
  }
  const birth = `01/01/${2025 - c.entry.edad}`;
  ensure(personalKeys.every(k => Object.hasOwn(personal, k)) && personal.EDADD === String(c.entry.edad) && personal.DPFNAC_D === birth && personal.ZFNAC_D === birth && norm(personal.CAD_D) === norm(names[c.entry.comunidadAutonoma]) && personal.CAC_D === personal.ZCCAD, 'SES identidad/territorio distintos');
  if (c.entry.comunidadAutonoma === 'madrid') ensure(personal.CAC_D === '12', 'SES código Madrid distinto');
  const observed = {};
  for (const [key, value] of Object.entries(c.amounts)) {
    const actual = amounts[key] ?? null;
    ensure(actual === null ? cents(value) === 0n : cents(actual) === cents(value), `SES importe distinto: ${key}`);
    observed[key] = { value: actual, absentZeroWithUiReadback: actual === null };
  }
  return { personal, amounts: observed };
}

// Ascendientes sólo para vinculación de las capturas existentes. El transporte
// general no implementa su diálogo y conserva el rechazo por defecto.
export function validateCase(c, { allowAscendants = false, allowSyntheticFamily = false } = {}) {
  const id = c?.id ?? c?.job?.id;
  ensure(string(id) && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(id), 'ID de caso inválido');
  ensure(!(Object.hasOwn(c, 'entradaAPI') && Object.hasOwn(c, 'entrada')), 'Entrada ambigua');
  const e = Object.hasOwn(c, 'entradaAPI') ? c.entradaAPI : c.entrada;
  ensure(e && e.ejercicio === 2025 && [40, 42, 45, 48].includes(e.edad) && e.modalidad === 'individual' && e.perfil === 'solo-trabajo' && Object.hasOwn(names, e.comunidadAutonoma), 'Perfil no acreditado');
  const required = { residenciaTodoElAnio: true, devengo: '2025-12-31', otrasRentas: 'ninguna', discapacidad: 'ninguna', reduccionesBase: 'ninguna', saldosAnteriores: 'ninguno', deducciones: 'solo-da61-si-procede', rentasExtranjeras: 'ninguna', especialidades: 'ninguna' };
  for (const [k, v] of Object.entries(required)) ensure(e[k] === v, `Hecho no soportado: ${k}`);
  const allowed = new Set([...Object.keys(required), 'ejercicio', 'edad', 'modalidad', 'perfil', 'comunidadAutonoma', 'familiaresConDerechoMinimo', 'derechosMinimos', 'contribuyenteId', 'conciliacion', 'trabajo', 'retenciones']);
  ensure(Object.keys(e).every(k => allowed.has(k)), 'Entrada contiene hechos sin transporte acreditado');
  const t = e.trabajo;
  ensure(t && t.ejercicio === 2025 && t.territorio === 'comun' && ['reduccionesArt18', 'movilidad', 'discapacidadActiva'].every(k => t[k] === 'ninguna'), 'Trabajo no soportado');
  ensure(Array.isArray(t.rendimientos) && t.rendimientos.length > 0 && Array.isArray(e.retenciones), 'Faltan rendimientos/retenciones');
  for (const [rows, key] of [[t.rendimientos, 'id'], [e.retenciones, 'operacionId']]) {
    ensure(rows.every(r => string(r[key]) && r[key].length > 0) && new Set(rows.map(r => r[key])).size === rows.length, 'Operaciones duplicadas o sin identidad');
  }
  const totals = { IDII: 0n, GSS: 0n, IDRE: 0n, GCS: 0n, GCC: 0n, GDJ: 0n };
  for (const r of t.rendimientos) {
    ensure(r.clase === 'empleo-laboral' && r.cotizaciones?.clase === 'efectivas', 'Clase de empleo/cotización no acreditada');
    totals.IDII += cents(r.integro);
    for (const k of ['seguridadSocial', 'derechosPasivos', 'colegiosHuerfanos']) totals.GSS += cents(r.cotizaciones[k]);
    for (const [k, f] of [['sindicato', 'GCS'], ['colegio', 'GCC'], ['defensa', 'GDJ']]) {
      ensure(r[k]?.satisfecho === 'si', 'Gasto no satisfecho'); totals[f] += cents(r[k].importe);
    }
    ensure(r.colegio.obligatorio === 'si' && r.colegio.finesEsenciales === 'si' && r.defensa.litigioDirectoPagador === 'si', 'Gastos especiales no acreditados');
  }
  for (const r of e.retenciones) { ensure(r.ejercicio === 2025 && r.efectiva === true, 'Retención no efectiva'); totals.IDRE += cents(r.importe); }
  const asc = allowAscendants && Array.isArray(e.derechosMinimos?.ascendientes);
  if (asc) validateAscendantCase(c);
  const family = !asc && e.familiaresConDerechoMinimo === 'segun-derechos';
  ensure(asc || family || (e.familiaresConDerechoMinimo === 'ninguno' && e.derechosMinimos === undefined), 'Familia incoherente');
  if (family) {
    if (allowSyntheticFamily) validateSyntheticFamilyCase(c);
    else {
      validateFamilyCase(c);
      ensure(e.comunidadAutonoma === 'madrid', 'Familia fuera del corte observado');
    }
  }
  const amounts = Object.fromEntries(Object.entries(totals).map(([k, n]) => [k, euros(n)]));
  Object.values(amounts).forEach(cents);
  return { id: c.id ?? c.job.id, entry: e, family, asc, amounts: { ...amounts, IDICLDED2: amounts.IDII, GSSCLDED2: amounts.GSS } };
}

function absoluteFile(key) {
  const p = process.env[key]; ensure(p && isAbsolute(p) && statSync(p).isFile(), `${key}: archivo absoluto obligatorio`); return realpathSync(p);
}
function configuration() {
  const p = process.env.C_RUN_DIR;
  ensure(p && isAbsolute(p), 'C_RUN_DIR absoluto obligatorio');
  mkdirSync(p, { recursive: true });
  const out = realpathSync(p), rel = relative(realpathSync(root), out);
  ensure(rel === '..' || rel.startsWith('../') || isAbsolute(rel), 'C_RUN_DIR debe ser externo al repositorio');
  const chromium = absoluteFile('C_CHROMIUM'), playwrightModule = absoluteFile('C_PLAYWRIGHT_MODULE');
  let template;
  if (process.env.C_TEMPLATE_FILE || process.env.C_TEMPLATE_SHA256) {
    const file = absoluteFile('C_TEMPLATE_FILE'), bytes = readFileSync(file), hash = sha(bytes);
    ensure(hash === process.env.C_TEMPLATE_SHA256 && ['d7ea4ea703305e6881d33af1d60a63ae0c884fea0e8a8a3c3a07b5e6f3cabe17', '5d5e0610c18b033878e62078c146193657a3e00efbd36942d5b0de86df3d554e'].includes(hash), 'Plantilla sin hash acreditado');
    template = { file, bytes, hash };
  }
  return { out, chromium, playwrightModule, template };
}

async function capture(c, config, dir) {
  const transportSha256 = sha(readFileSync(self));
  const { chromium } = await import(pathToFileURL(config.playwrightModule).href);
  let browser, context, page;
  const readbacks = [], confirmations = [];
  const save = (name, bytes) => { write(join(dir, name), bytes); return { file: name, sha256: sha(bytes) }; };
  const snapshot = async name => save(`${name}.json`, json(await page.locator('input:visible').evaluateAll(es => es.map(e => ({ title: e.title, type: e.type, value: e.value, checked: e.checked })))));
  const pause = () => page.waitForTimeout(1500);
  const dialog = () => page.locator('.z-window-modal:visible').last();
  async function text(field, value, key) {
    await field.click(); await field.press('ControlOrMeta+A'); await field.pressSequentially(value, { delay: 60 }); await field.press('Tab'); await pause();
    const observed = await field.inputValue(); readbacks.push({ key, requested: value, observed });
    ensure(observed === value, `Readback distinto: ${key}`);
  }
  async function amount(field, value, key) {
    await field.click(); await field.press('ControlOrMeta+A'); await field.pressSequentially(value.replace('.', ','), { delay: 60 }); await field.press('Tab'); await pause();
    const observed = await field.inputValue(); readbacks.push({ key, requested: value, observed });
    // Open limpia visualmente el cero después de Tab. Sólo se permite vacío
    // tras escribir explícitamente cero; el SES vuelve a verificar el importe.
    ensure(observed === '' ? cents(value) === 0n : uiCents(observed) === cents(value), `Readback monetario distinto: ${key}`);
  }
  const accept = async () => { await dialog().getByRole('button', { name: 'Aceptar', exact: true }).click(); await pause(); };
  async function sharedWarning(stage) {
    const message = 'Compruebe si tiene que cumplimentar la clave "otras situaciones" para el hijo';
    const warning = page.getByRole('dialog', { name: /^Verificar datos/ });
    await warning.getByText(message, { exact: true }).waitFor();
    confirmations.push({ stage, message, assumption: 'custodia compartida sin convivencia entre progenitores; sin clave 3', evidence: await snapshot(`aviso-${stage}`) });
    await warning.getByRole('button', { name: 'Continuar', exact: true }).click(); await pause();
  }
  async function familySetup() {
    const child = c.entry.derechosMinimos.descendientes[0], shared = child.titulares.length === 2;
    await page.getByTitle(child.edadDevengo < 18 ? 'Nombre del hijo' : 'Nombre del descendiente', { exact: true }).first().locator('xpath=ancestor::div[.//button][1]').getByRole('button').click(); await pause();
    const d = page.getByRole('dialog').first(); await d.waitFor({ state: 'visible' });
    await text(d.getByTitle('Apellidos y nombre:', { exact: true }).first(), 'PRUEBA HIJO', 'child-name');
    await text(d.getByTitle('NIF:', { exact: true }).first(), '90000002J', 'child-nif');
    await text(d.locator('.z-datebox input').first(), `01/01/${child.fechaNacimiento.slice(0, 4)}`, 'child-birth');
    await d.getByTitle('Vinculación', { exact: true }).click();
    const options = page.locator('.z-comboitem-text:visible'); await options.first().waitFor();
    const choices = await options.allTextContents(), matches = choices.filter(s => s.startsWith(`${shared ? 'D' : 'B'}Hijos`) && s.includes('primer declarante'));
    ensure(matches.length === 1, 'Vinculación no observada'); await page.getByText(matches[0], { exact: true }).click();
    readbacks.push({ key: 'family-link', options: choices, selected: matches[0] });
    if (child.edadDevengo < 18) {
      await d.getByText('Hombre', { exact: true }).first().click();
      await d.getByTitle('Comunidad Autónoma', { exact: true }).click(); await page.locator('.z-comboitem-text:visible').filter({ hasText: /^MADRID$/ }).click();
    }
    if (shared) {
      await d.getByTitle('Si en la casilla vinculación ha seleccionado las claves D ó E debe reflejar los datos del otro progenitor', { exact: true }).click();
      const other = page.getByRole('dialog').nth(1); await other.waitFor({ state: 'visible' });
      await text(other.getByTitle(/^Apellidos y nombre:?$/), 'PRUEBA OTRO PROGENITOR', 'other-name');
      await text(other.getByTitle(/^NIF:?$/), '90000001N', 'other-nif');
      await other.getByText('Mujer', { exact: true }).click(); await snapshot('otro-progenitor');
      await other.getByRole('button', { name: 'Aceptar', exact: true }).click(); await other.waitFor({ state: 'hidden' });
    }
    if (child.edadDevengo < 18) {
      const box = d.getByText('Marque la casilla si el hijo ha percibido rentas en cuantía superior a 8.000 euros', { exact: true }).locator('xpath=ancestor::*[count(.//input[@type="checkbox"])=1][1]').locator('input[type=checkbox]');
      await box.setChecked(false); ensure(!await box.isChecked(), 'Predicado de renta distinto');
      readbacks.push({ key: 'child-income-over-8000', observed: false, exactIncomeEntered: false });
    }
    await snapshot('familia-antes-aceptar'); await d.getByRole('button', { name: 'Aceptar', exact: true }).click(); await pause();
    if (shared) await sharedWarning('familia');
    await d.waitFor({ state: 'hidden' });
  }
  try {
    browser = await chromium.launch({ executablePath: config.chromium, headless: true, args: ['--disable-dev-shm-usage'], slowMo: 500 });
    context = await browser.newContext({ acceptDownloads: true }); page = await context.newPage(); page.setDefaultTimeout(45000); page.setDefaultNavigationTimeout(45000);
    const response = await page.goto(URL_OPEN); ensure(response?.status() === 200, 'Open2025 no disponible');
    const bootstrap = save('bootstrap.html', await response.body()); await pause();
    let templateSha256 = null;
    if (config.template && !c.family && c.entry.edad === 40 && c.entry.comunidadAutonoma === 'madrid') {
      templateSha256 = config.template.hash;
      // Carga los mismos bytes cuyo hash se conserva, sin carrera con la ruta externa.
      await page.getByRole('button', { name: 'Cargar', exact: true }).click();
      await page.locator('input[type=file][accept=".ses"]').setInputFiles({ name: 'plantilla.ses', mimeType: 'application/octet-stream', buffer: config.template.bytes });
    } else {
      await page.getByRole('button', { name: 'Nueva declaración', exact: true }).click(); await pause();
      await text(page.locator('input[title="NIF:"],input[title="NIF"]').first(), '90000000B', 'nif');
      await text(page.locator('input[title="Apellidos y nombre:"],input[title="Apellidos y nombre"]').first(), 'PRUEBA C OPEN', 'name');
      await page.locator('input[type=checkbox]:visible').first().check();
      await page.locator('.z-combobox[title^="Estado Civil"]').click(); await page.getByText('SOLTERO/A', { exact: true }).click();
      await text(page.locator('.z-datebox input:visible').first(), `01/01/${2025 - c.entry.edad}`, 'birth');
      await page.locator('.z-combobox[title="Comunidad Autónoma"]').click();
      const options = page.locator('.z-comboitem-text:visible'); await options.first().waitFor();
      const choices = await options.allTextContents(), matches = choices.filter(s => norm(s) === norm(names[c.entry.comunidadAutonoma]));
      ensure(matches.length === 1, 'Comunidad no identificada'); await page.getByText(matches[0], { exact: true }).click();
      readbacks.push({ key: 'region', options: choices, selected: matches[0] });
      await page.getByText('Hombre', { exact: true }).click();
      if (c.family) await familySetup();
      await snapshot('personal-antes-aceptar'); await page.getByRole('button', { name: 'Aceptar', exact: true }).click(); await pause();
      if (c.family && c.entry.derechosMinimos.descendientes[0].titulares.length === 2) await sharedWarning('personal');
    }
    await page.getByRole('button', { name: 'Vista previa', exact: true }).waitFor(); await pause();
    if (!await page.getByTitle(/^Apartados(?: declaración)?$/).count()) await page.getByTitle('Continuar con la declaración', { exact: true }).click();
    await pause(); await page.getByTitle(/^Apartados(?: declaración)?$/).click();
    await page.getByText('Rendimientos del trabajo (sueldos, nóminas, pensiones, etc.)', { exact: true }).click(); await pause();
    const editWork = () => page.getByText(/^0*3$/).locator('xpath=../../..').getByRole('button').click();
    await editWork(); await pause();
    for (const [label, key] of [['Importe íntegro', 'IDII'], ['Seguridad Social y otros', 'GSS'], ['Retención', 'IDRE'], ['Cuotas satisfechas a Sindicatos', 'GCS'], ['Cuotas a Colegios profesionales', 'GCC'], ['Gastos de defensa jurídica', 'GDJ']]) {
      await amount(dialog().getByText(label, { exact: true }).locator('xpath=ancestor::td[1]/following-sibling::td[1]').locator('input[type=text]'), c.amounts[key], key);
    }
    await accept(); await editWork();
    await page.getByText('Deducción por obtención de rendimientos del trabajo', { exact: true }).click(); await pause();
    for (const [index, key] of [[0, 'IDICLDED2'], [8, 'GSSCLDED2']]) await amount(dialog().locator('input[type=text]:visible').nth(index), c.amounts[key], key);
    await accept();
    if (await page.getByTitle('Mostrar opciones', { exact: true }).count()) await page.getByTitle('Mostrar opciones', { exact: true }).click();
    const downloading = page.waitForEvent('download'); await page.getByTitle('Guardar datos trabajo (.ses)', { exact: true }).click();
    const download = await downloading; ensure(!await download.failure(), 'Descarga SES fallida');
    // Stream local: write exclusivo, nunca download.saveAs sobre un original.
    const stream = await download.createReadStream(), chunks = []; for await (const chunk of stream) chunks.push(chunk);
    const bytes = Buffer.concat(chunks), ses = save('captura.ses', bytes);
    const decoded = inflateSync(bytes, { maxOutputLength: 4 * 1024 * 1024 }).toString('latin1');
    save('ses-observado.txt', decoded);
    const observed = sesReadback(decoded, c);
    if (c.family) {
      save('familia-ses.json', json(familySesReadback(decoded, { id: c.id, entrada: c.entry })));
    }
    await page.getByTitle('Resumen de declaraciones', { exact: true }).click(); await pause();
    const summary = save('resumen.txt', await page.locator('body').innerText());
    await page.getByRole('button', { name: 'Vista previa', exact: true }).click();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('iframe')).some(e => e.src.includes('PDFborrador.pdf')));
    const pdfUrl = await page.locator('iframe').evaluateAll(es => es.map(e => e.src).find(s => s.includes('PDFborrador.pdf')));
    const data = await page.evaluate(async url => { const r = await fetch(new URL(url, location.href), { signal: AbortSignal.timeout(45000) }); if (!r.ok) throw Error(`PDF HTTP ${r.status}`); return Array.from(new Uint8Array(await r.arrayBuffer())); }, pdfUrl);
    const pdfBytes = Buffer.from(data); ensure(pdfBytes.subarray(0, 5).equals(Buffer.from('%PDF-')), 'PDF inválido');
    const pdf = save('captura.pdf', pdfBytes);
    ensure(sha(readFileSync(self)) === transportSha256, 'Transporte cambió durante captura');
    save('recibo.json', json({ schema: 'open2025-transporte-v1', id: c.id, utc: new Date().toISOString(), state: 'capturado-pendiente-motor', countedAsMatch: false, inputSha256: sha(readFileSync(join(dir, 'entrada.json'))), caseSha256: sha(readFileSync(join(dir, 'caso.json'))), transportSha256, matrixSha256: process.env.C_MATRIX_SHA256, templateSha256, bootstrap, ses, pdf, summary, observed, readbacks, confirmations, limits: 'Trabajo agregado; hechos sintéticos. Familia: predicados UI, sin acreditación universal ni cotejo motor.' }));
  } catch (error) {
    save('error.txt', String(error));
    if (page) {
      try { save('error.html', await page.content()); } catch { /* página cerrada */ }
      try { save('error.png', await page.screenshot({ timeout: 10000 })); } catch { /* navegador no disponible */ }
    }
    throw error;
  } finally {
    try {
      if (!existsSync(join(dir, 'readbacks.json'))) save('readbacks.json', json({ readbacks, confirmations }));
    } finally {
      try { await context?.close(); } finally { await browser?.close(); }
    }
  }
}

async function main() {
  if (process.argv.slice(2).join(' ') === '--self-test') return selfTest();
  const args = process.argv.slice(2), opts = {};
  for (let i = 0; i < args.length; i += 2) { ensure(['--cases', '--limit', '--case', '--worker'].includes(args[i]) && args[i + 1] && !Object.hasOwn(opts, args[i]), 'Uso: --cases archivo --limit 1 [--case id]'); opts[args[i]] = args[i + 1]; }
  ensure(opts['--cases'] && /^\d+$/.test(opts['--limit'] ?? '') && Number(opts['--limit']) >= 1 && Number(opts['--limit']) <= 300, 'Límite explícito 1–300 obligatorio');
  const raw = readFileSync(opts['--cases']), document = JSON.parse(raw), cases = Array.isArray(document) ? document : document.casos;
  ensure(Array.isArray(cases) && cases.length > 0, 'Lista de casos no vacía requerida');
  ensure(new Set(cases.map(c => c?.id ?? c?.job?.id)).size === cases.length, 'IDs duplicados');
  const checked = [], plan = [];
  for (const c of cases) {
    try { const v = validateCase(c); checked.push(v); plan.push({ id: v.id, state: 'transportable' }); }
    catch { plan.push({ id: c?.id ?? c?.job?.id, state: 'pendiente-transporte', countedAsMatch: false }); }
  }
  const selected = checked.filter(c => !opts['--case'] || c.id === opts['--case']); ensure(selected.length > 0, 'Caso desconocido');
  const config = configuration();
  if (opts['--worker']) {
    ensure(selected.length === 1 && opts['--worker'] === selected[0].id && process.env.C_MATRIX_SHA256 === sha(raw), 'Worker/entrada incoherentes');
    await capture(selected[0], config, join(config.out, selected[0].id)); return;
  }
  const lock = join(config.out, '.captura-serial.lock'); mkdirSync(lock);
  try {
    write(join(config.out, 'plan.json'), json({ total: cases.length, matrixSha256: sha(raw), casos: plan }));
    write(join(config.out, 'transporte.mjs'), readFileSync(self));
    for (const c of selected.slice(0, Number(opts['--limit']))) {
      const dir = join(config.out, c.id); mkdirSync(dir);
      write(join(dir, 'caso.json'), json(cases.find(x => (x.id ?? x.job?.id) === c.id))); write(join(dir, 'entrada.json'), json(c.entry));
      const child = spawnSync('timeout', ['-k', '30s', '10m', process.execPath, self, '--cases', resolve(opts['--cases']), '--limit', '1', '--case', c.id, '--worker', c.id], { env: { ...process.env, C_MATRIX_SHA256: sha(raw) }, encoding: 'utf8', timeout: 640000, maxBuffer: 1024 * 1024 });
      write(join(dir, 'worker.json'), json({ status: child.status, signal: child.signal, error: child.error?.message, stdout: child.stdout, stderr: child.stderr }));
      ensure(child.status === 0, `Captura detenida: ${c.id}; sin reintento automático`);
      console.log(`${c.id}: capturado, pendiente de motor`);
    }
  } finally { rmdirSync(lock); }
}

function selfTest() {
  assert.equal(cents('123.4'), 12340n); assert.equal(uiCents('1.234,56'), 123456n);
  for (const v of ['', '1e3', '-1', '1.234', '1,20']) assert.throws(() => cents(v));
  for (const v of ['', '1.23,45', '1,234', 'NaN']) assert.throws(() => uiCents(v));
  const sample = JSON.parse(readFileSync(new URL('../../../docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json', import.meta.url)))[1];
  assert.equal(validateCase(sample).amounts.IDII, '22004.62');
  const decoded = inflateSync(readFileSync(new URL('../../../docs/procedencia/auditorias/redondeo-anual-rentaweb-open/componentes.ses', import.meta.url))).toString('latin1');
  assert.equal(sesReadback(decoded, validateCase(sample)).personal.CAC_D, '12');
  assert.throws(() => sesReadback(decoded.replace('IDII~1~', 'IDII~3~invalido'), validateCase(sample)));
  assert.throws(() => sesReadback(decoded.replace('[DLGTRABAJO]', '[AJENO]'), validateCase(sample)));
  assert.throws(() => sesReadback(decoded.replace('CAD_D~1~MADRID', 'CAD_D~1~GALICIA'), validateCase(sample)));
  const aggregated = structuredClone(sample); aggregated.entrada.trabajo.rendimientos.push(structuredClone(aggregated.entrada.trabajo.rendimientos[0]));
  assert.throws(() => validateCase(aggregated));
  aggregated.entrada.trabajo.rendimientos[1].id = 'segundo-distinto';
  assert.equal(validateCase(aggregated).amounts.IDII, '44009.24');
  const familial = JSON.parse(readFileSync(new URL('../../../tests/fixtures/c300-variantes.json', import.meta.url))).find(c => c.entrada.derechosMinimos?.descendientes?.[0]?.edadDevengo === 2);
  assert.equal(validateCase(familial).family, true);
  for (const change of [{ rentasNoExentasCentimos: 800001 }, { fechaNacimiento: '2017-06-01' }, { edadDevengo: 25 }, { declaracion: { modalidad: 'individual' } }]) {
    const bad = structuredClone(familial); Object.assign(bad.entrada.derechosMinimos.descendientes[0], change); assert.throws(() => validateCase(bad));
  }
  for (const override of [{ edad: 41 }, { perfil: 'hipoteca' }, { comunidadAutonoma: 'desconocida' }, { alquiler: {} }]) assert.throws(() => validateCase({ ...sample, entrada: { ...sample.entrada, ...override } }));
  console.log('Offline: importes, readback, SES original/ámbitos, agregación y límites familiares OK; navegador no ejecutado');
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) main().catch(error => { console.error(String(error)); process.exitCode = 2; });
