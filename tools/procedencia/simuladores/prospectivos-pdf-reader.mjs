// Lector deliberadamente acotado al PDF observado, no lector PDF general.
// Lee sólo Contents de Page; no acepta fuentes recodificadas ni texto TJ.
import {inflateSync} from 'node:zlib';
const need = (ok, why) => {if (!ok) throw Error(why);};
export function rawPdfRows(bytes, {pages = 3, positions = false} = {}) {
  need(pages === 3 || pages === 5, 'pdf-paginas-opcion');
  need(positions === true || positions === false, 'pdf-posiciones-opcion');
  need(bytes.length <= 4194304 && bytes.subarray(0, 8).toString() === '%PDF-1.4', 'pdf-formato');
  const text = bytes.toString('latin1'), objects = new Map();
  for (const m of text.matchAll(/(?:^|\n)(\d+) 0 obj\n([\s\S]*?)\nendobj/g)) {
    need(!objects.has(m[1]), 'pdf-objeto-duplicado'); objects.set(m[1], m[2]);
  }
  need(!/\/Encrypt\b|\/ObjStm\b|\/ToUnicode\b|\/Encoding\s*\d+\s+0\s+R/.test(text), 'pdf-codificacion-no-soportada');
  const rows = []; let page = 0;
  for (const object of objects.values()) {
    if (!/\/Type \/Page\b/.test(object)) continue;
    const ref = /\/Contents (\d+) 0 R/.exec(object); need(ref, 'pdf-contents');
    const content = objects.get(ref[1]); need(content && /\/Filter \/FlateDecode/.test(content), 'pdf-filtro');
    const stream = /stream\r?\n/.exec(content), len = /\/Length (\d+)\b/.exec(content);
    need(stream && len, 'pdf-stream');
    const data = Buffer.from(content.slice(stream.index + stream[0].length), 'latin1').subarray(0, Number(len[1]));
    const decoded = inflateSync(data, {maxOutputLength: 4194304}).toString('latin1');
    const lines = new Map();
    for (const block of decoded.matchAll(/\bBT\s([\s\S]*?)\bET\b/g)) {
      const s = block[1]; need(!/\bTJ\b|\bTm\b|\bTD\b|\bTL\b|T\*|\bTz\b|\bTs\b/.test(s), 'pdf-texto-no-soportado');
      const tokens = [...s.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?) Td\b|(\((?:\\[\s\S]|[^\\()])*\)|<[0-9A-Fa-f]+>) Tj\b/g)];
      need(tokens.length && tokens.filter(t=>t[3]).length === [...s.matchAll(/\bTj\b/g)].length, 'pdf-bloque-no-soportado');
      let x=0,y=0,positioned=false;
      for(const item of tokens) {
      if(!item[3]) { x+=Number(item[1]);y+=Number(item[2]);positioned=true;continue; }
      need(positioned,'pdf-posicion');const token=item[3];
      const value = token[0] === '<' ? Buffer.from(token.slice(1,-1), 'hex').toString('latin1') : token.slice(1,-1).replace(/\\([0-7]{1,3}|[nrtbf()\\])/g, (_, c) => /^[0-7]/.test(c) ? String.fromCharCode(parseInt(c,8)) : ({n:'\n',r:'\r',t:'\t',b:'\b',f:'\f'}[c] ?? c));
      const items = lines.get(y) ?? []; items.push({x,value}); lines.set(y,items);
      }
    }
    for (const [y, items] of lines) {
      const segments=items.sort((a,b)=>a.x-b.x);
      const row={page, y:Number(y), text:segments.map(x=>x.value).join(' ')};
      if(positions)row.segments=segments;
      rows.push(row);
    }
    page++;
  }
  need(page === pages, 'pdf-paginas');
  return rows;
}
