"""Demuestra selectores INE existentes, sin fabricar cita PDF o PNG."""
import argparse
import json
from pathlib import Path
import consumidor as c


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--cache',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    pin=json.loads((args.cache/'PIN-final.json').read_bytes())['manifest']['sha256']
    m=c.load(pin,args.cache/'manifest-final.json')
    package=args.cache/'restauracion-v5'
    dep=next(d for d in m['dependencies'] if d['path']=='docs/procedencia/auditorias/ipc-redondeos/citas-candidatas.json')
    source=package/'dependencies'/dep['sha256']
    c.p.check(source,dep)
    citations=c.p.strict_json(source.read_bytes())
    rows=[]
    for sha in ('8786d9b266a83ea6e0a6045c55e4574fa927ac13c1ab45802de92d8795afb043','c94efbe5606cc9d14ff09436a486b117acb2905c3da4f51d415e2d180ca841dd'):
        citation=next(row for row in citations if row.get('documentSha256')==sha and 'jsonPointer' in row)
        path=package/'sha256'/sha
        c.p.check(path,next(o for o in m['objects'] if o['sha256']==sha))
        value=c.p.strict_json(path.read_bytes())
        for segment in citation['jsonPointer'].split('/')[1:]:
            value=value[int(segment)] if isinstance(value,list) else value[segment.replace('~1','/').replace('~0','~')]
        assert value==citation['value']
        rows.append({'sha256':sha,'citationId':citation['id'],'jsonPointer':citation['jsonPointer'],'value':value,'exact':True,'pdfOrPngInvented':False})
    args.output.write_bytes(c.p.encoded(rows))
    print('Dos selectores JSON INE exactos desde restauración')


if __name__=='__main__':
    main()
