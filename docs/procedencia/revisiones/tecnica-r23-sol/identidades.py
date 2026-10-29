"""Cotejo independiente de identidades, payloads y referencias, sin promociones."""
import hashlib
import gzip
import json
from pathlib import Path
from urllib.parse import unquote

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/tecnica-r23-sol'


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def read_ref(ref: dict) -> bytes:
    path = ref['path']
    assert not Path(path).is_absolute() and '..' not in Path(path).parts, path
    raw = (ROOT / path).read_bytes()
    assert digest(raw) == ref['sha256'], path
    return raw


def main() -> None:
    lint = json.loads((ROOT / '.oxlintrc.json').read_bytes())
    assert len(lint['rules']) == 16
    assert all(v == 'error' for v in lint['rules'].values())
    identities = json.loads((ROOT / 'docs/procedencia/correcciones/contratos-r21/identidades-candidatas.json').read_bytes())
    registry = json.loads(read_ref(identities['sourceRegistry']))
    rows = json.loads((ROOT / 'docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json').read_bytes())['rows']
    by_hash = {r['candidate']['sha256']: r for r in rows}
    assert len(by_hash) == 264
    archive = (ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes()
    assert digest(archive) == '59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7'
    wanted = {r['itemId'] for r in rows}
    items = {}
    for name, content in json.loads(gzip.decompress(archive)):
        if name.startswith('inventario-pagina-'):
            for item in json.loads(content):
                if item['id'] in wanted:
                    assert item['id'] not in items
                    items[item['id']] = item
    assert len(items) == len(wanted), (len(items), len(wanted))
    seen: set[str] = set()
    checked: set[str] = set()
    controls = []

    def close(value: object) -> None:
        if isinstance(value, dict):
            if set(value) == {'path', 'sha256'}:
                path = value['path']
                raw = read_ref(value)
                checked.add(path)
                if path.endswith('.json'):
                    marker = path + ':' + value['sha256']
                    if marker not in checked:
                        checked.add(marker)
                        close(json.loads(raw))
            else:
                for child in value.values():
                    close(child)
        elif isinstance(value, list):
            for child in value:
                close(child)

    for identity in identities['identities']:
        delegates = [d for d in registry['delegates'] if d['key'] == identity['key']]
        assert len(delegates) == 1
        delegate = delegates[0]
        assert identity['canonicalTaskId'] == delegate['taskId'] == delegate['childNodeId']
        command = unquote(delegate['taskId'].removeprefix('node:delegated-task:'))
        assert command == identity['commandKey']
        assert delegate['role'] == 'review' and delegate['model'] == 'gpt-6.1-sol'
        count = 0
        delivery_path = Path(identity['attestations'][0]['path']).parents[1] / 'manifiesto.json'
        delivery = json.loads((ROOT / delivery_path).read_bytes())
        delivered = {f['path']: f for f in delivery['files']}
        for ref in identity['attestations']:
            raw = read_ref({'path': ref['path'], 'sha256': ref['sha256']})
            att = json.loads(raw)
            assert delivered[ref['path']]['sha256'] == digest(raw)
            assert delivered[ref['path']]['size'] == len(raw)
            assert ref['reviewTaskId'] == att['reviewTaskId']
            expected = identity['canonicalTaskId'] if identity['key'].endswith('estatales') else command
            assert att['reviewTaskId'] == expected
            h = att['payloadSha256']
            assert h not in seen
            seen.add(h)
            row = by_hash[h]
            assert row['status'] == 'pending'
            payload = json.loads(read_ref(row['candidate']))
            item = items[payload['itemId']]
            assert item['layer'] == 'effective'
            assert item['source']['file'] == payload['source']['file']
            assert item['source']['sha256'] == payload['source']['sha256']
            assert item['symbol'] == payload['source']['symbol']
            assert json.loads(item['path']) == payload['source']['tablePath']
            assert item['unit'] == payload['scope']['unit']
            assert payload['scope']['year'] in item['years']
            assert payload['scope']['territory'] in item['territories']
            assert att['inventory'] == payload['inventory']
            assert att['scope'] == payload['scope']
            assert att['decision'] == 'accepted-limited'
            assert payload['authorTaskId'] not in (command, identity['canonicalTaskId'])
            report = read_ref(att['report'])
            assert delivered[att['report']['path']]['sha256'] == digest(report)
            assert report.strip()
            close(payload)
            count += 1
        controls.append({'key': identity['key'], 'canonical': identity['canonicalTaskId'],
                         'command': command, 'attestations': count, 'normalizationApplied': False})
    assert len(seen) == 264
    (OUT / 'identidades-control.json').write_text(json.dumps({'controls': controls,
        'payloads': len(seen), 'inventoryItems': len(items),
        'referencesChecked': sorted(checked), 'mismatches': []}, indent=2) + '\n')
    print('264 payloads/atestaciones exactos; 78 canónicos, 186 command; cierre hash de referencias comprobado')


if __name__ == '__main__':
    main()
