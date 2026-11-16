import {Schema} from 'effect';
// Estructura de dt18-ses: stdlib, ámbitos por instancia; sin importar producto.
const need = (ok, why) => { if (!ok) throw Error(why); };
export function parseSES(text) {
  need(Schema.is(Schema.String)(text) && text.length <= 4194304 && !/[\x00-\x09\x0b-\x1f\x7f]/.test(text), 'ses-formato');
  const lines = text.replace(/\n$/, '').split('\n'), header=lines.shift();
  const match=/^<\?xml ((?:[A-Za-z][A-Za-z0-9]*="[^"<>\n]*" ?)+)\?><PERSISTENCIAV2>$/.exec(header);
  need(match && lines.pop() === '</PERSISTENCIAV2>', 'ses-envoltura');
  const attributes=[...match[1].matchAll(/([A-Za-z][A-Za-z0-9]*)="([^"<>]*)"/g)];
  need(new Set(attributes.map(a=>a[1])).size===attributes.length,'ses-atributo-duplicado');
  const metadata=Object.fromEntries(attributes.map(a=>[a[1],a[2]]));
  need(metadata.EjModelo==='2025' && Object.keys(metadata).every(k=>['sello','VersionReglas','CodModelo','EjModelo','VersionModelo','FechaCreacion','version','encoding','standalone'].includes(k)), 'ses-metadata');
  need(!metadata.CodModelo || metadata.CodModelo==='100','ses-modelo');
  const sections = [], records = [], stack = [], keys = new Set();
  for (const line of lines) {
    if (!line.trim()) continue;
    need(!line.includes('\t'), 'ses-tab');
    const indent = line.length - line.trimStart().length;
    while (stack.length && stack.at(-1).indent >= indent) stack.pop();
    const s = /^ *\[([A-Z0-9_]+)\]$/.exec(line);
    if (s) {
      const parent = stack.at(-1);
      need(parent ? indent === parent.indent + 2 : indent === 0 && s[1] === 'DECLARACIONES', 'ses-indent');
      const item = {id: sections.length, name: s[1], indent, parent: parent?.id ?? null, path: [...stack.map(x => x.name), s[1]].join('/')};
      sections.push(item); stack.push(item); continue;
    }
    const m = /^ *([A-Z0-9_]+)~([123])~([^~]*)(?:~(254|255))?$/.exec(line), scope = stack.at(-1);
    need(m && scope && indent === scope.indent + 1, 'ses-registro');
    need(m[2] === '1' ? !m[4] : m[2] === '2' ? !m[4] && /^(254|255)$/.test(m[3]) : !!m[4], 'ses-tipo');
    const key = `${scope.id}:${m[1]}`; need(!keys.has(key), 'ses-duplicado'); keys.add(key);
    records.push({scope: scope.id, key: m[1], type: m[2], value: m[3], flag: m[4] ?? null});
  }
  need(sections.filter(s => s.parent === null).length === 1, 'ses-raiz');
  return {sections, records, metadata};
}
export function accessSES(text) {
  const parsed = parseSES(text), {sections, records} = parsed;
  const row = (scope, key, type = '1', flag = null) => {
    const rs = records.filter(r => r.scope === scope.id && r.key === key);
    need(rs.length === 1 && rs[0].type === type && rs[0].flag === flag, 'ses-campo-' + key.toLowerCase());
    return rs[0].value;
  };
  const unique = (items) => { need(items.length === 1, 'ses-instancia-no-unica'); return items[0]; };
  const path = name => unique(sections.filter(s => s.path === name));
  const instance = (name, key, value) => unique(sections.filter(s => s.name === name && s.parent === path('DECLARACIONES').id && records.some(r => r.scope === s.id && r.key === key && r.type === '1' && r.value === value)));
  return {...parsed, row, path, instance};
}
