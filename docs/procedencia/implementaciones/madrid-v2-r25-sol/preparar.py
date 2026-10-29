"""Prepara datos candidatos; no modifica consumidores, registros ni originales."""
import gzip
import hashlib
import json
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
PREFIX = OUT.relative_to(ROOT).as_posix()
SCRATCH = ROOT / '.cache/madrid-v2-r25-sol/ensayo'
AUTHOR = 'thread:delegated-task:command%3Amcp%3A99a9fe10-4fb8-419d-8198-e5c0210805ae%3Adelegate-task%3Airobopf-r25-sol-madrid-v2'


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def ref(path):
    raw = (ROOT / path).read_bytes()
    return {'path': path, 'sha256': digest(raw)}


def write(name, data):
    path = OUT / name
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    return ref(path.relative_to(ROOT).as_posix())


def main():
    oldpath = 'docs/procedencia/enlaces/madrid-2020-limite.json'
    original = json.loads((ROOT / oldpath).read_bytes())
    assert ref(oldpath)['sha256'] == 'e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258'
    manifest = (ROOT / 'docs/procedencia/inventario.json').read_bytes()
    archive = (ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes()
    assert digest(manifest) == original['inventory']['manifestSha256']
    assert digest(archive) == original['inventory']['artifactSha256']
    found: list[dict] = []
    for name, data in json.loads(gzip.decompress(archive)):
        if name.startswith('inventario-pagina-'):
            found.extend(i for i in json.loads(data) if i['id'] == original['itemId'])
    assert len(found) == 1
    item = found[0]
    assert item['layer'] == 'effective'
    assert item['source']['file'] == original['source']['file']
    assert item['source']['sha256'] == original['source']['sha256']
    assert digest((ROOT / item['source']['file']).read_bytes()) == item['source']['sha256']
    assert item['symbol'] == original['source']['symbol']
    assert json.loads(item['path']) == original['source']['tablePath']
    assert item['value'] == '53407.2'
    assert 2020 in item['years'] and 'madrid' in item['territories']
    conditions = [
        'Componente autonómico de la base liquidable general de Madrid, ejercicio 2020; residencia y elegibilidad no acreditadas.',
        'Cuantía nominal de una sola celda: límite superior del cuarto tramo, 53.407,20 EUR. No selecciona período, devengo ni fallecimiento.',
        'No acepta cuotas fijas, tipos, mínimos, deducciones, redondeos, liquidación completa, otros ejercicios ni autenticidad histórica.',
        'Propuesta nueva pendiente de revisión independiente exacta; no hereda la atestación ni la aceptación histórica de Madrid v1.',
    ]
    scope = {'schemaVersion': 1, 'decision': original['legalReview'], 'source': original['source'],
             'itemId': item['id'], 'inventory': original['inventory'], 'year': 2020,
             'territory': 'madrid', 'unit': 'EUR', 'value': item['value'],
             'component': 'autonomico', 'taxBase': 'general', 'period': 'nominal-only',
             'predicate': 'nominal-cell', 'externalConditions': ['residence-unverified', 'eligibility-unverified'],
             'editorialConditions': conditions, 'completeRuleAcceptance': False}
    scope_ref = write('ambito.json', scope)
    payload = dict(original)
    payload.update(schemaVersion=2, id='madrid-2020-limite-53407-20-v2-r25-sol', authorTaskId=AUTHOR,
                   executableScope=scope_ref)
    payload['scope'] = dict(original['scope'], conditions=conditions,
                            claim='Candidato nominal: límite superior del cuarto tramo autonómico general de Madrid 2020, 53.407,20 EUR; sin selección temporal.')
    payload_ref = write('payload-v2.json', payload)
    write('identidad.json', {'observedVia': 't3_thread_configure sin argumentos', 'threadId': AUTHOR,
          'modelSelection': {'instanceId': 'codex', 'model': 'gpt-6.1-sol',
                             'options': {'reasoningEffort': 'high', 'serviceTier': 'priority'}},
          'canonicalTaskId': None, 'note': 'Se conserva el threadId expuesto; no se presenta como taskId canónico ni se inventa alias.'})
    write('correspondencias.json', {'historical': ref(oldpath), 'payload': payload_ref, 'executableScope': scope_ref,
          'item': item, 'nominalValue': '53407.20', 'unit': 'EUR',
          'unitLimit': 'El inventario dice EUR (límite de base; periodicidad pendiente). EUR se vincula al literal EUROS de la cita, sin aceptar periodicidad.',
          'bindingReview': 'pending', 'operationalStatus': 'blocked', 'completeRuleAcceptance': False,
          'blockers': ['La decisión histórica no contiene conditions/year/territory/unit/value/column exigidos por verify_executable_scope.',
                       'Ruta efectiva de cuatro segmentos; el consumidor exige exactamente dos.',
                       'El consumidor restringe Madrid a 2022 y MADRID_2022; nominal-only no está admitido para esta identidad.']})
    # Árbol publicable de referencias exactas del candidato; los blobs se sirven desde CAS externo.
    seen = {}
    edges = []

    def visit(reference, parent=None):
        path = reference['path']
        actual = ref(path)
        assert actual == reference
        if parent:
            edges.append({'from': parent, 'to': path, 'sha256': actual['sha256']})
        if path in seen:
            return
        raw = (ROOT / path).read_bytes()
        seen[path] = dict(actual, sha512=hashlib.sha512(raw).hexdigest(), size=len(raw))
        data = json.loads(raw)

        def walk(value):
            if isinstance(value, dict):
                if set(value) == {'path', 'sha256'}:
                    visit(value, path)
                else:
                    for child in value.values():
                        walk(child)
            elif isinstance(value, list):
                for child in value:
                    walk(child)
        walk(data)
    visit(payload_ref)
    document = json.loads((ROOT / original['document']['path']).read_bytes())
    cite = json.loads((ROOT / original['citation']['path']).read_bytes())
    blobs = []
    for sha in [document['sha256'], cite['facsimile']['sha256']]:
        path = Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256') / sha
        raw = path.read_bytes() if path.exists() else (OUT / 'tabla.png').read_bytes()
        assert digest(raw) == sha
        blobs.append({'sha256': sha, 'sha512': hashlib.sha512(raw).hexdigest(), 'size': len(raw),
                      'role': 'original-pdf' if sha == document['sha256'] else 'facsimile-png'})
    write('dependencias.json', {'root': payload_ref, 'documents': list(seen.values()), 'edges': edges,
          'blobs': blobs, 'source': dict(original['source']), 'inventory': original['inventory'],
          'authenticity': document['authenticity']['status'], 'review': 'pending', 'publishableAsAccepted': False,
          'note': 'Árbol de transporte candidato; no incluye una atestación. El fundamento temporal auxiliar se fija aparte en evidencias-temporales.json.'})
    if '--scratch' in sys.argv:
        SCRATCH.mkdir(parents=True, exist_ok=True)
        # Vista mínima con enlaces de solo lectura a fuentes del checkout propio; sin VCS ni copia de aplicación.
        for name in ['lib', 'scripts', 'schemas', 'package.json', 'bun.lock', 'tsconfig.json', 'Calculo_Salario_IRPF.py']:
            path = SCRATCH / name
            if not path.exists():
                path.symlink_to(ROOT / name)
        path = SCRATCH / 'node_modules'
        if not path.exists():
            path.symlink_to('/home/elies/Repos/IRoboPF/node_modules')
        for relative in [*seen, oldpath, 'docs/procedencia/inventario.json', 'docs/procedencia/inventario-datos.json.gz', 'docs/procedencia/inventario-schema.json']:
            target = SCRATCH / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / relative, target)
        target = SCRATCH / 'docs/procedencia/enlaces/registro.json'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps({'schemaVersion': 1, 'entries': [{'payload': payload_ref, 'attestation': None}]}) + '\n')
    print(json.dumps({'payload': payload_ref, 'scope': scope_ref, 'itemId': item['id'], 'operationalStatus': 'blocked'}))


if __name__ == '__main__':
    main()
