/** Vínculo optativo DT18: acredita transporte; el medidor compara después la API. */
import { readFileSync, realpathSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { spawnSync } from 'node:child_process';
import { Schema } from 'effect';
import { decodificarPersistencia } from './vincular-open.mjs';
import { dt18Hash, dt18ReceiptReadback, validateDT18Case, dt18UiReadback, dt18SesPdfReadback } from './dt18-open.mjs';
const ensure = (ok, code) => { if (!ok) throw Error(code); };
const string = Schema.is(Schema.String);

export function vincularDT18Open(caso, base) {
  try {
    const ev = caso.evidenciaOpen?.dt18;
    ensure(ev, 'dt18-evidencia-ausente');
    const refs = caso.integridadReferencias?.referencias ?? [];
    const root = realpathSync(base);
    const load = (ref, expectedHash) => {
      ensure(ref && string(ref.archivo) && !isAbsolute(ref.archivo)
        && !ref.archivo.includes('\\') && !ref.archivo.split('/').some(p => p === '..' || p === '' || p === '.')
        && /^[a-f0-9]{64}$/.test(ref.sha256 ?? '')
        && refs.filter(r => r.archivo === ref.archivo && r.sha256 === ref.sha256).length === 1,
      'dt18-referencia-invalida');
      const path = realpathSync(resolve(root, ref.archivo)), rel = relative(root,path);
      ensure(rel !== '..' && !rel.startsWith('../') && !isAbsolute(rel), 'dt18-referencia-fuera-base');
      const bytes = readFileSync(path);
      ensure(bytes.length <= 16*1024*1024 && dt18Hash(bytes) === ref.sha256
        && (!expectedHash || ref.sha256 === expectedHash), 'dt18-artefacto-distinto');
      return { path, bytes };
    };
    const originalBytes = load(ev.original).bytes;
    const original = JSON.parse(originalBytes);
    const v = validateDT18Case(caso, original), pin = v.pin;
    ensure(pin.estado === 'captura-completa-observada', pin.territorio === 'la-rioja'
      ? 'dt18-solicitud-regional-no-observada' : 'dt18-captura-no-observada');
    ensure(dt18Hash(originalBytes) === pin.originales['caso.json'], 'dt18-original-hash-distinto');
    const json = (key, name) => JSON.parse(load(ev[key],pin.originales[name]).bytes);
    const entry = json('entrada','entrada.json');
    ensure(JSON.stringify(entry) === JSON.stringify(original.entradaAPI), 'dt18-entrada-original-distinta');
    const housing = json('expediente','expediente-sintetico.json');
    const receipt = json('recibo','recibo.json');
    dt18ReceiptReadback(receipt,pin);
    const readbacks = json('readbacks','readbacks.json').readbacks;
    const antes = json('inventarioAntes','dt18-inventario-antes.json');
    const despues = json('inventarioDespues','dt18-inventario-despues.json');
    // Cardinalidad, ficha reabierta y censo completos, no una selección de positivos.
    for (const [key,name] of [['controles','controles-observados.json'],['ficha','ficha-reabierta.json'],
      ['censoAntes','inmuebles-censo-antes.json'],['censoDespues','inmuebles-censo-despues.json']]) json(key,name);
    dt18UiReadback(receipt,readbacks,{antes,despues},housing,original);
    const ses = load(ev.ses), pdf = load(ev.pdf,pin.originales['captura.pdf']);
    ensure(pdf.bytes.subarray(0,5).toString() === '%PDF-', 'dt18-pdf-invalido');
    if (ev.ses.formato === undefined) ensure(ev.ses.sha256 === pin.originales['captura.ses'], 'dt18-ses-original-distinto');
    const decoded = decodificarPersistencia(ses.bytes,ev.ses);
    ensure(dt18Hash(Buffer.from(decoded,'latin1')) === pin.contenidoLatin1Sha256, 'dt18-ses-contenido-distinto');
    ensure(receipt.inputSha256 === pin.originales['entrada.json']
      && receipt.caseSha256 === pin.originales['caso.json'] && receipt.pdf.sha256 === ev.pdf.sha256
      && receipt.ses.sha256 === pin.originales['captura.ses'], 'dt18-recibo-distinto');
    const tool = process.env.C_PDFTOTEXT;
    ensure(tool && isAbsolute(tool), 'dt18-lector-pdf-no-configurado');
    const lectorPdfSha256 = dt18Hash(readFileSync(tool));
    const r = spawnSync('timeout',['-k','5s','20s',tool,'-layout',pdf.path,'-'],
      {encoding:'utf8',timeout:26000,maxBuffer:4*1024*1024});
    ensure(r.status === 0, 'dt18-lector-pdf-fallo');
    const result = dt18SesPdfReadback(decoded,r.stdout,v,housing,readbacks);
    ensure(caso.resultadoOpenEUR === result.casillas['0670'], 'dt18-resultado-aportado-distinto');
    return { ...result, lectorPdfSha256, referencias:ev, historiaVerificada:false,
      expedienteExternoSha256:ev.expediente.sha256 };
  } catch (e) {
    return { estado:'no-verificado', countedAsMatch:false,
      motivo:e instanceof Error && /^dt18-[a-z0-9-]+$/.test(e.message) ? e.message : 'dt18-vinculo-fallo' };
  }
}
