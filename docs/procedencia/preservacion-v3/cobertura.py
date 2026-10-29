"""Cotejo por recibo y manifiesto; no presupone que todo CAS sea original."""
from collections import Counter
import recolector as r

INPUTS = [
    'docs/procedencia/auditorias/retenciones-originales-2012-2016/fuentes.json',
    'docs/procedencia/auditorias/redondeo-tgss-mensual/fuentes/documentos.json',
    'docs/procedencia/revisiones/redondeo-tgss-mensual-v1/nuevos-originales.json',
    'docs/procedencia/correcciones/integracion-ronda11/recepcion-tgss.json',
    'docs/procedencia/correcciones/integracion-ronda13/cas-preservado.json',
]


def main():
    m, t, objects = r.load()
    selected = {o['sha256']: o for o in objects}
    matrix = r.p.strict_json((r.HERE / 'matriz.json').read_bytes())
    reports = []
    missing = []
    for name in INPUTS:
        data = r.p.strict_json((r.ROOT / name).read_bytes())
        rows = []
        for record in r.p.nodes(data):
            if not all(k in record for k in ('sha256', 'sha512', 'size')):
                continue
            sha = record['sha256']
            obj = selected.get(sha)
            status = 'incluido' if obj else 'ausente-del-paquete'
            if not obj:
                missing.append({'source': name, 'sha256': sha})
            elif any(obj[k] != record[k] for k in ('sha512', 'size')):
                raise ValueError('Recibo contradictorio: ' + name)
            rows.append({'sha256': sha, 'status': status, 'class': obj['class'] if obj else None})
        reports.append({'source': name, 'fingerprint': r.p.fingerprint(r.ROOT / name), 'rows': rows})
    result = {'inputs': reports, 'missingRequired': missing, 'total': len(objects),
              'bytes': sum(o['size'] for o in objects), 'baselineObjects': len(t['blobs']),
              'annexClasses': dict(Counter(o['class'] for o in m['annex'])),
              'matrixStatuses': dict(Counter(o['status'] for o in matrix)),
              'absentAcquisitions': [o for o in matrix if o['status'] == 'ausente'],
              'dependencies': len(m['dependencies']),
              'dependencyBytesUnique': sum({d['sha256']: d['size'] for d in m['dependencies']}.values())}
    r.save(r.HERE / 'cobertura.json', result)
    print({k: v for k, v in result.items() if k not in {'inputs', 'absentAcquisitions'}})
    if missing:
        raise ValueError('Falta lote obligatorio')


if __name__ == '__main__':
    main()
