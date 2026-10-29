"""Derivación explícita candidata; ninguna alta en registros operativos."""
import base64
import hashlib
import json
from pathlib import Path
from urllib.parse import unquote

ROOT = Path.cwd()
OUT = ROOT / 'docs/procedencia/revisiones/tecnica-r23-sol'


def ref(path: str) -> dict:
    raw = (ROOT / path).read_bytes()
    return {'path': path, 'sha256': hashlib.sha256(raw).hexdigest(),
            'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw)}


def main() -> None:
    mapping_path = 'docs/procedencia/correcciones/contratos-r21/identidades-candidatas.json'
    mapping = json.loads((ROOT / mapping_path).read_bytes())
    source_path = mapping['sourceRegistry']['path']
    raw = (ROOT / source_path).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == mapping['sourceRegistry']['sha256']
    registry = json.loads(raw)
    rows = json.loads((ROOT / 'docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json').read_bytes())['rows']
    by_hash = {r['candidate']['sha256']: r for r in rows}
    delegates = []
    bindings = []
    for identity in mapping['identities']:
        matches = [d for d in registry['delegates'] if d['key'] == identity['key']]
        assert len(matches) == 1
        original = matches[0]
        canonical = original['taskId']
        command = unquote(canonical.removeprefix('node:delegated-task:'))
        assert canonical == original['childNodeId'] == identity['canonicalTaskId']
        assert command == identity['commandKey']
        exact_ids = {a['reviewTaskId'] for a in identity['attestations']}
        assert len(exact_ids) == 1
        exact = exact_ids.pop()
        assert exact in (canonical, command)
        delegates.append({'key': original['key'], 'role': 'review', 'taskId': exact,
                          'canonicalTaskId': canonical, 'commandKey': command,
                          'sourceRegistrySha256': hashlib.sha256(raw).hexdigest(),
                          'sourceDelegateIndex': registry['delegates'].index(original),
                          'sourceDelegate': original,
                          'rule': 'Identidad exacta observada, cotejada contra canonicalTaskId y decodificación porcentual única del taskId registrado; no regla de búsqueda.'})
        for att_ref in identity['attestations']:
            att = json.loads((ROOT / att_ref['path']).read_bytes())
            assert ref(att_ref['path'])['sha256'] == att_ref['sha256']
            assert att['reviewTaskId'] == exact
            row = by_hash[att['payloadSha256']]
            payload = json.loads((ROOT / row['candidate']['path']).read_bytes())
            assert ref(row['candidate']['path'])['sha256'] == att['payloadSha256']
            assert payload['authorTaskId'] not in (canonical, command)
            assert att['scope'] == payload['scope'] and att['inventory'] == payload['inventory']
            bindings.append({'reviewTaskId': exact, 'canonicalTaskId': canonical,
                             'payload': ref(row['candidate']['path']),
                             'attestation': ref(att_ref['path']), 'report': att['report'],
                             'inventory': att['inventory'], 'scope': att['scope'],
                             'operationalApproval': False})
    assert len(bindings) == 264
    encoded_registry = base64.b64encode(raw).decode()
    result = {'kind': 'registro-derivado-candidato', 'version': 1,
              'base': '07c07e6376a72f229be735a904ecf36517a1b571',
              'operationalApproval': False, 'trustMutation': False,
              'identityMap': ref(mapping_path), 'sourceRegistry': ref(source_path),
              'sourceRegistryOriginalBytesBase64': encoded_registry,
              'delegates': delegates, 'bindings': bindings,
              'limits': 'No es entrada operativa sin adaptación/revisión explícita del contrato del registro. No reemite atestaciones, no crea identidad del revisor actual, no habilita reglas ni alias genéricos.'}
    assert base64.b64decode(encoded_registry) == raw
    (OUT / 'registro-derivado-candidato.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print('Registro candidato: 2 identidades exactas, 264 pares inmutables; aprobación operativa false')


if __name__ == '__main__':
    main()
