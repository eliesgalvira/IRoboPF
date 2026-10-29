"""Clasifica ausencias tipadas sin equipararlas a PDF perdidos."""
import gzip
import json
from revisar import CACHE, e, save


def main():
    package = CACHE / 'restauracion'
    m = json.loads((package / 'manifest.json').read_bytes())
    expanded = json.loads((CACHE.parents[1] / 'docs/procedencia/revisiones/preservacion-v4-r24-sol/seleccion-ampliada.json').read_bytes())
    missing = {r['sha256'] for r in expanded['absentFromObjects']}
    output = {sha: dict(dependency=[], exclusions=[r for r in m['exclusions'] if r.get('sha256') == sha], records=[]) for sha in missing}
    for d in m['dependencies']:
        if d['sha256'] in missing or d['sourceSha256'] in missing:
            output[d['sha256'] if d['sha256'] in missing else d['sourceSha256']]['dependency'].append(d['path'])
        if d['historical'] or not d['path'].endswith(('.json', '.json.gz')):
            continue
        raw = (package / 'dependencies' / d['sha256']).read_bytes()
        if d['path'].endswith('.gz'):
            raw = gzip.decompress(raw)
        for r in e.p.nodes(e.p.strict_json(raw)):
            hits = {v for k,v in r.items() if k in ('sha256','documentSha256','documentHash') and isinstance(v,str) and v in missing}
            for sha in hits:
                output[sha]['records'].append(dict(path=d['path'], fields={k:v for k,v in r.items() if k in ('id','canonicalUrl','url','finalUrl','mimeType','mediaType','httpStatus','status','source','title','name')}))
    save('faltantes-clasificados.json', output)
    for sha, row in output.items():
        urls = sorted({r['fields'].get('canonicalUrl', r['fields'].get('url','')) for r in row['records']} - {''})
        print(sha, 'auxiliares', row['dependency'], 'urls', urls, 'registros', len(row['records']))

if __name__ == '__main__':
    main()
