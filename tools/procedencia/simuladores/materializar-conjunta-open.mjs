import {Schema} from 'effect';
// Private materializer: read-only inputs; fresh, private output; stdlib only.
import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {canonical, equal, hash, need} from './conjunta-estricta.mjs';
import {deriveOpen, readOpenRelative} from './vincular-conjunta-open.mjs';

export function materializeOpen({root, captureBase, planBase, id, out}) {
  need(Schema.is(Schema.String)(id) && /^open2025-[a-z0-9-]+$/.test(id), 'materializar-id');
  const index = JSON.parse(readOpenRelative(root, 'tools/procedencia/simuladores/conjunta-referencias/index.json'));
  need(!index.excluded.some(c => c.id === id), 'monoparental-sin-evidencia');
  const pins = index.cases.filter(c => c.id === id); need(pins.length === 1, 'materializar-referencia');
  const referenceBytes = readOpenRelative(root, 'tools/procedencia/simuladores/conjunta-referencias/' + pins[0].file);
  need(hash(referenceBytes) === pins[0].sha256, 'materializar-referencia-integridad');
  const ref = JSON.parse(referenceBytes);
  const planBytes = readOpenRelative(planBase, 'plan.json'), plan = JSON.parse(planBytes);
  need(hash(planBytes) === ref.source.planSha256, 'materializar-plan-integridad');
  const cases = plan.cases.filter(c => c.id === id); need(cases.length === 1, 'materializar-caso');
  const casePlan = cases[0]; equal(casePlan, ref.casePlan, 'materializar-plan');
  const fixtureBytes = Buffer.from(JSON.stringify(casePlan.fixture));
  const expedienteBytes = readOpenRelative(root, casePlan.fixture.expediente);
  const receiptBytes = readOpenRelative(captureBase, id + '/recibo.json'), receipt = JSON.parse(receiptBytes);
  // No directory scan, polling or speculative read of unfinished captures. A
  // final receipt plus all original hashes and a second unchanged receipt are
  // required. Any in-progress/missing source aborts without output.
  need(receipt.captura === 'conservada' && receipt.id === id, 'materializar-no-final');
  need(Array.isArray(receipt.files) && receipt.files.length <= 2000, 'materializar-inventario');
  const allFiles = Object.create(null);
  for (const f of receipt.files) {
    need(Schema.is(Schema.String)(f.file) && /^[a-zA-Z0-9_.-]+$/.test(f.file) && !Object.hasOwn(allFiles, f.file), 'materializar-ruta-duplicada');
    const b = readOpenRelative(captureBase, id + '/' + f.file);
    need(b.length === f.bytes && hash(b) === f.sha256, 'materializar-original-integridad');
    allFiles[f.file] = b;
  }
  need(readOpenRelative(captureBase, id + '/recibo.json').equals(receiptBytes), 'materializar-captura-cambio');
  const context = {fixtureBytes, expedienteBytes, referenceBytes, referenceSha256: pins[0].sha256};
  if (ref.authority?.archivo) {
    context.authorityBytes = readOpenRelative(root, ref.authority.archivo);
    need(hash(context.authorityBytes) === ref.authority.sha256, 'materializar-autoridad');
    const authority = JSON.parse(context.authorityBytes);
    const source = readOpenRelative(root, authority.disenoArchivo);
    need(hash(source) === authority.disenoSha256, 'materializar-diseno');
    context.authoritySources = {[authority.disenoSha256]: source};
  }
  const {bytes, derivation} = deriveOpen(context, receiptBytes, allFiles);
  // Publication and sanitization are external gates. This tool NEVER publishes.
  // Output path must not already exist; source files are never opened for write.
  mkdirSync(out, {recursive: false, mode: 0o700});
  writeFileSync(resolve(out, id + '.json.gz'), bytes, {flag: 'wx', mode: 0o600});
  writeFileSync(resolve(out, 'derivacion-privada.json'), canonical(derivation) + '\n', {flag: 'wx', mode: 0o600});
  return {id, bytes: bytes.length, sha256: hash(bytes), countedAsMatch: false};
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [root, captureBase, planBase, id, out] = process.argv.slice(2);
  need(process.argv.length === 7 && root && captureBase && planBase && id && out, 'uso-root-capturas-plan-id-salida-nueva');
  // Do not print private paths, exception objects or captured data.
  try { console.log(JSON.stringify(materializeOpen({root, captureBase, planBase, id, out}))); }
  catch (e) { console.error(/^[a-z0-9-]+$/.test(e.message) ? e.message : 'materializar-fallo'); process.exitCode = 1; }
}
