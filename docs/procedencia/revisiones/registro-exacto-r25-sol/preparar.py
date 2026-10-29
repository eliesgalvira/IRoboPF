"""Recepción independiente y árbol mínimo de ensayo; no modifica confianza real."""
import base64
import hashlib
import json
import shutil
from pathlib import Path
from urllib.parse import unquote

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/registro-exacto-r25-sol'
TREE = ROOT / '.cache/registro-exacto-r25-sol/ensayo'
D = 'docs/procedencia/revisiones/tecnica-r23-sol/registro-derivado-candidato.json'
C = 'docs/procedencia/correcciones/registro-candidato-r25/revisores-candidatos.json'
copied: set[str] = set()


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def copy(path):
    assert not Path(path).is_absolute() and '..' not in Path(path).parts
    source = ROOT / path
    assert source.is_file() and not source.is_symlink(), path
    target = TREE / path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    copied.add(path)
    return source.read_bytes()


def ref(value):
    raw = copy(value['path'])
    assert sha(raw) == value['sha256'], value
    if 'sha512' in value:
        assert hashlib.sha512(raw).hexdigest() == value['sha512']
    if 'size' in value:
        assert len(raw) == value['size']
    return raw


def close(value):
    if isinstance(value, dict):
        if 'path' in value and 'sha256' in value and isinstance(value['path'], str) and not Path(value['path']).is_absolute():
            path = value['path']
            seen = path in copied
            raw = ref(value)
            if path.endswith('.json') and not seen:
                close(json.loads(raw))
        else:
            for child in value.values():
                close(child)
    elif isinstance(value, list):
        for child in value:
            close(child)


def main():
    derived = json.loads(copy(D))
    original_raw = ref(derived['sourceRegistry'])
    assert original_raw == base64.b64decode(derived['sourceRegistryOriginalBytesBase64'], validate=True)
    original = json.loads(original_raw)
    mapping = json.loads(ref(derived['identityMap']))
    candidate = json.loads(copy(C))
    assert derived['operationalApproval'] is derived['trustMutation'] is False
    assert len(candidate['reviewers']) == 2
    entries = []
    decisions = []
    rows = json.loads(copy('docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json'))['rows']
    expected = {r['candidate']['sha256'] for r in rows}
    assert len(expected) == 264
    bindings = {b['payload']['sha256']: b for b in derived['bindings']}
    assert len(bindings) == len(derived['bindings']) == 264
    for reviewer in candidate['reviewers']:
        matches = [i for i in mapping['identities'] if reviewer['taskId'] in (i['canonicalTaskId'], i['commandKey'])]
        assert len(matches) == 1
        identity = matches[0]
        delegates = [d for d in original['delegates'] if d['key'] == identity['key']]
        assert len(delegates) == 1
        delegate = delegates[0]
        assert delegate['taskId'] == delegate['childNodeId'] == identity['canonicalTaskId']
        assert unquote(delegate['taskId'].removeprefix('node:delegated-task:')) == identity['commandKey']
        assert delegate['role'] == 'review' and delegate['model'] == 'gpt-6.1-sol'
        assert reviewer['delegationRegistry'] == {'path': D, 'sha256': sha((ROOT / D).read_bytes())}
        exact = {(a['path'], a['sha256']) for a in identity['attestations']}
        assert len(exact) == len(reviewer['approvals'])
        for approval in reviewer['approvals']:
            h = approval['payloadSha256']
            binding = bindings[h]
            payload = json.loads(ref(binding['payload']))
            att = json.loads(ref(approval['attestation']))
            assert (approval['attestation']['path'], approval['attestation']['sha256']) in exact
            assert approval['attestation'] == {k: binding['attestation'][k] for k in ('path', 'sha256')}
            assert att['reviewTaskId'] == reviewer['taskId'] == binding['reviewTaskId']
            assert payload['authorTaskId'] not in (identity['canonicalTaskId'], identity['commandKey'])
            assert att['payloadSha256'] == h
            assert att['scope'] == payload['scope'] == binding['scope']
            assert att['inventory'] == payload['inventory'] == binding['inventory']
            assert att['report'] == binding['report'] and ref(att['report']).strip()
            assert str(Path(att['report']['path']).parent) == reviewer['reportDirectory']
            assert payload['scope']['completeRule'] is False
            close(payload)
            entries.append({'payload': {k: binding['payload'][k] for k in ('path', 'sha256')}, 'attestation': approval['attestation']})
            decisions.append({'payload': entries[-1]['payload'], 'attestation': approval['attestation'], 'itemId': payload['itemId'], 'scope': payload['scope'], 'reviewTaskId': reviewer['taskId'], 'dictamen': 'proyección exacta candidata; recorrido conjunto pendiente', 'objecion': 'La igualdad de hashes no prueba ejecución ni aceptación jurídica.', 'respuesta': 'Se ensaya el consumidor real por lote; se mantiene el alcance nominal y completo false.', 'coste': 'Decisión editorial y contraste posterior del padre; sin promoción.'})
    assert len(entries) == 264 and {e['payload']['sha256'] for e in entries} == expected
    manifest = json.loads(copy('docs/procedencia/inventario.json'))
    copy('docs/procedencia/' + manifest['artifact']['file'])
    for item in manifest['generationInputs']:
        assert sha(copy(item['file'])) == item['sha256']
    for folder in ['scripts/procedencia', 'lib/procedencia', 'schemas/procedencia', 'tools/procedencia']:
        for path in (ROOT / folder).rglob('*'):
            if path.is_file() and '__pycache__' not in path.parts and path.suffix in ('.mjs', '.ts', '.tsx', '.py', '.json', '.nix', '.lock', '.toml', '.sh'):
                copy(str(path.relative_to(ROOT)))
    for config_path in ['next.config.mjs', 'package.json', 'bun.lock', 'tsconfig.json', 'docs/procedencia/implementaciones/contenidos/conceptos.json']:
        copy(config_path)
    for concept in json.loads((ROOT / 'docs/procedencia/implementaciones/contenidos/conceptos.json').read_bytes()):
        copy(concept['informe'])
    for path in (ROOT / 'app/procedencia').rglob('route.ts'):
        copy(str(path.relative_to(ROOT)))
    cas = []
    cas_seen = set()
    for entry in entries:
        p = json.loads((ROOT / entry['payload']['path']).read_bytes())
        doc = json.loads((ROOT / p['document']['path']).read_bytes())
        cite = json.loads((ROOT / p['citation']['path']).read_bytes())
        for h in (doc['sha256'], cite['facsimile']['sha256']):
            if h in cas_seen:
                continue
            cas_seen.add(h)
            dest = TREE / 'docs/procedencia/corpus/fixtures/sha256' / h
            source = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256') / h
            if not source.is_file():
                found = [f for f in (ROOT / 'docs/procedencia').rglob(h + '*') if f.is_file() and sha(f.read_bytes()) == h]
                assert found, 'CAS ausente: ' + h
                source = found[0]
            raw = source.read_bytes()
            assert sha(raw) == h
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(raw)
            cas.append({'source': str(source), 'sha256': h, 'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw)})
    (TREE / "docs/procedencia/enlaces").mkdir(parents=True, exist_ok=True)
    (TREE / 'docs/procedencia/enlaces/registro.json').write_text(json.dumps({'schemaVersion': 1, 'entries': entries}))
    (TREE / 'docs/procedencia/enlaces/revisores.json').write_bytes((ROOT / C).read_bytes())
    if not (TREE / 'node_modules').is_symlink():
        (TREE / 'node_modules').symlink_to('/home/elies/Repos/IRoboPF/node_modules', target_is_directory=True)
    (OUT / 'decisiones-264.json').write_text(json.dumps(decisions, ensure_ascii=False, indent=2) + '\n')
    (OUT / 'preparacion.json').write_text(json.dumps({'files': sorted(copied), 'cas': cas, 'pairs': len(entries), 'identities': 2, 'operationalApproval': False}, indent=2) + '\n')
    print('Proyección exacta, 264 pares, dos delegaciones independientes; árbol propio preparado.')


if __name__ == '__main__':
    main()
