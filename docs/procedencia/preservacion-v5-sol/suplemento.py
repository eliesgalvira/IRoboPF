"""Receta de comprobación adicional; solo datos y consumidor de la restauración r2."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import sys


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--cache',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    software=args.cache/'software-restaurado/docs/procedencia/preservacion-v5-sol'
    sys.path.insert(0,str(software))
    import consumidor as c
    pin=json.loads((args.cache/'PIN-final.json').read_bytes())['manifest']['sha256']
    m=c.load(pin,args.cache/'manifest-final.json')
    package=args.cache/'restauracion-v5'
    deps={d['path']:d for d in m['dependencies']}
    def raw(name):
        row=deps[name]
        path=package/'dependencies'/row['sha256']
        c.p.check(path,row)
        return path.read_bytes()
    name='docs/procedencia/auditorias/retenciones-2020-2026/citas-candidatas.json'
    original=raw(name)
    regenerated=c.p.encoded(c.p.strict_json(original))
    assert regenerated==original
    result={'largeIndex':{'path':name,'sourceSha256':deps[name]['sourceSha256'],'transportSha256':hashlib.sha256(regenerated).hexdigest(),'canonicalBytesExact':True,'bytes':len(original)},'consumer':c.p.fingerprint(Path(c.__file__))}
    rows=c.p.strict_json(raw('docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/citas-propias.json'))
    sample=next(row for row in rows if row.get('sourceSha256Prefix')=='82a57fd7' and row.get('selector')=='id="a84"')
    obj=next(row for row in m['objects'] if row['sha256'].startswith(sample['sourceSha256Prefix']))
    path=package/'sha256'/obj['sha256']
    c.p.check(path,obj)
    chunks=re.split(r'<div[^>]+class="bloque"',path.read_text())
    selected=[chunk for chunk in chunks if sample['selector'] in chunk[:300]]
    assert len(selected)==1
    text=' '.join(html.unescape(re.sub('<[^>]+>',' ',selected[0])).split())
    assert text==sample['textNormalized']
    result['historicalHtml']={'sourceSha256':obj['sha256'],'sourceSha512':obj['sha512'],'selector':sample['selector'],'textNormalized':text,'exact':True,'recipe':'split bloque, quitar etiquetas, html.unescape, colapsar espacios; cita histórica conservada'}
    args.output.write_bytes(c.p.encoded(result))
    print('Índice grande regenerado byte a byte; HTML histórico a84 reproducido desde original restaurado')


if __name__=='__main__':
    main()
