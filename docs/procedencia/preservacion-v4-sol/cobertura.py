"""Cierre por lotes y referencias tipadas; sin juicio fiscal."""
from collections import Counter
from pathlib import Path
import edicion as e


def main():
    receipt = e.p.strict_json((e.HERE / 'coleccion.json').read_bytes())
    source = Path(receipt['source'])
    m = e.p.strict_json((source / 'manifest.json').read_bytes())
    objects = {o['sha256']: o for o in m['objects']}
    deps = {d['path']: d for d in m['dependencies']}
    batches = {}
    required: dict[str, set[str]] = {}
    for name in ('docs/procedencia/revisiones/preservacion-v3-sol/posteriores.json', 'docs/procedencia/correcciones/retenciones-antiguas-r20/cas-originales.json', 'docs/procedencia/correcciones/integracion-r19/cas-retenciones.json'):
        value = e.p.strict_json((e.ROOT / name).read_bytes())
        rows = value['objects'] if isinstance(value, dict) else value
        batch = []
        for row in rows:
            sha = row['sha256']
            present = objects.get(sha)
            if not present:
                d = next((d for d in m['dependencies'] if d['sourceSha256'] == sha), None)
                state = 'auxiliar-preservado' if d else 'ausente'
            else:
                state = 'objeto-preservado'
                if any(row[k] != present[k] for k in ('sha256', 'sha512', 'size') if k in row):
                    raise ValueError('Huella de lote distinta')
            batch.append({'sha256': sha, 'status': state})
        batches[name] = batch
    for prefix in ('docs/procedencia/auditorias/retenciones-2020-2026/', 'docs/procedencia/correcciones/editorial-r21/citas/', 'docs/procedencia/revisiones/retenciones-2012-2014-sol/', 'docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol/', 'docs/procedencia/editorial/', 'docs/procedencia/auditorias/tgss-etapas-operativas/', 'docs/procedencia/correcciones/derechos-familiares-r15/'):
        for path in sorted((e.ROOT / prefix).rglob('*.json')):
            name = path.relative_to(e.ROOT).as_posix()
            if name not in deps:
                continue
            for rec in e.p.nodes(e.p.strict_json(path.read_bytes())):
                for key in ('documentSha256', 'documentHash', 'facsimileSha256', 'cropSha256'):
                    sha = rec.get(key)
                    if isinstance(sha, str) and e.p.HASH.fullmatch(sha):
                        required.setdefault(sha, set()).add(name)
                for key in ('original', 'facsimil', 'facsimile'):
                    row = rec.get(key)
                    if isinstance(row, dict) and isinstance(row.get('sha256'), str):
                        required.setdefault(row['sha256'], set()).add(name)
    typed = [{'sha256': sha, 'sources': sorted(names), 'status': 'objeto-preservado' if sha in objects else 'ausente'} for sha, names in sorted(required.items())]
    result = {'manifest': e.p.fingerprint(source / 'manifest.json'), 'batches': batches, 'typedReferences': typed, 'typedCounts': dict(Counter(r['status'] for r in typed)), 'warning': 'Lotes solapados; no sumar. Referencias no tipadas no equivalen a documentos perdidos.'}
    e.save(e.HERE / 'cierre-referencias.json', result)
    missing = [r for rows in batches.values() for r in rows if r['status'] == 'ausente'] + [r for r in typed if r['status'] == 'ausente']
    print({'missing': len(missing), 'typed': len(typed), 'objects': len(objects)})
    if missing:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
