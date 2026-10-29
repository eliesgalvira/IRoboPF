"""Prepara candidatos por identidad exacta; no modifica el registro editorial."""
import copy
import gzip
import hashlib
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / 'tools/procedencia'))
from enlaces import DocumentaryReadSet, verify_executable_scope
from corpus import validate_schema

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / 'docs/procedencia/correcciones/integracion-r19/candidatos'


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def ref(path):
    return {'path': str(path.relative_to(ROOT)), 'sha256': digest(path.read_bytes())}


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    return ref(path)


def main():
    manifest_path = ROOT / 'docs/procedencia/inventario.json'
    manifest = json.loads(manifest_path.read_bytes())
    artifact = (manifest_path.parent / manifest['artifact']['file']).read_bytes()
    if digest(artifact) != manifest['artifact']['sha256']:
        raise ValueError('Artefacto alterado')
    inventory = {'manifestSha256': digest(manifest_path.read_bytes()),
                 'artifactSha256': digest(artifact)}
    expected = {'manifestSha256': '30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7',
                'artifactSha256': '59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7'}
    if inventory != expected:
        raise ValueError('Inventario distinto de la base encargada')
    items = {}
    for name, raw in json.loads(gzip.decompress(artifact)):
        if name.startswith('inventario-pagina-'):
            for item in json.loads(raw):
                if item['layer'] == 'effective':
                    key = (item['source']['file'], item['symbol'], item['path'])
                    if key in items:
                        raise ValueError('Identidad efectiva duplicada')
                    items[key] = item
    correspondence = json.loads((ROOT / 'docs/procedencia/evidencias/propuestas-r12/correspondencias.json').read_bytes())
    old = {}
    for row in correspondence['rows']:
        path = ROOT / row['proposal']['path']
        if digest(path.read_bytes()) != row['proposal']['sha256']:
            raise ValueError('Propuesta histórica alterada')
        payload = json.loads(path.read_bytes())
        old[payload['id']] = (payload, row['proposal'])
    rows = []
    reader = DocumentaryReadSet(ROOT)
    for domain, count in [('estatales', 78), ('autonomicas', 186)]:
        folder = ROOT / f'docs/procedencia/revisiones/evidencias-{domain}-v2'
        decisions_ref = ref(folder / 'decisiones-canonicas.json')
        decisions = reader.read_ref(decisions_ref)
        mapping = json.loads((folder / f'mapeo-{count}.json').read_bytes())
        by_decision = {m['decisionId']: m for m in mapping}
        if len(decisions) != count or len(by_decision) != count:
            raise ValueError('Cobertura de decisiones incorrecta')
        for decision in decisions:
            mapped = by_decision[decision['id']]
            original, original_ref = old[mapped.get('payloadId', mapped.get('id'))]
            if original_ref['sha256'] != mapped['payloadSha256']:
                raise ValueError('Mapeo de otro payload')
            payload = copy.deepcopy(original)
            source = payload['source']
            key = (source['file'], source['symbol'], json.dumps(source['tablePath'], separators=(',', ':')))
            item = items[key]
            if (item['value'] != decision['value'] or item['unit'] != decision['unit']
                    or item['source']['sha256'] != source['sha256']
                    or digest((ROOT / source['file']).read_bytes()) != source['sha256']
                    or decision['year'] not in item['years'] or decision['territory'] not in item['territories']):
                raise ValueError('Correspondencia actual no acreditada: ' + decision['id'])
            payload.update(schemaVersion=2, id='ambito-r19-' + decision['id'],
                           authorTaskId='Codex /root orquestador integracion-r19',
                           inventory=inventory, itemId=item['id'])
            payload['legalReview'] = {'decisions': decisions_ref, 'decisionId': decision['id']}
            payload['scope']['conditions'] = decision['conditions']
            payload['citation'] = decision['citations'][0]
            state = domain == 'estatales'
            scope = {'schemaVersion': 1, 'decision': payload['legalReview'], 'source': source,
                     'itemId': item['id'], 'inventory': inventory,
                     'year': decision['year'], 'territory': decision['territory'],
                     'unit': decision['unit'], 'value': decision['value'],
                     'component': 'estatal' if state else 'autonomico', 'taxBase': 'general',
                     'period': 'nominal-only' if state else ('madrid-2022' if decision['territory'] == 'madrid' else 'ordinary-no-death'),
                     'predicate': 'murcia-blg-gt-60000' if source['symbol'] == 'MURCIA_2022' and source['tablePath'][0] == '4' else 'nominal-cell',
                     'externalConditions': ['residence-unverified', 'eligibility-unverified'],
                     'editorialConditions': decision['conditions'], 'completeRuleAcceptance': False}
            payload['executableScope'] = write(OUT / 'ambitos' / (decision['id'] + '.json'), scope)
            validate_schema(payload, 'binding-payload')
            verify_executable_scope(reader, payload, item)
            candidate = write(OUT / 'payloads' / (payload['id'] + '.json'), payload)
            rows.append({'original': original_ref, 'candidate': candidate,
                         'decision': payload['legalReview'], 'scope': payload['executableScope'],
                         'itemId': item['id'], 'status': 'pending',
                         'blockers': ['revision-independiente-del-contrato-y-payload-exactos',
                                      'registro-y-atestacion-del-orquestador-ausentes',
                                      'cierre-fisico-y-publicacion-no-ejecutados'],
                         'contextBlockers': ['seleccion-de-periodo-no-respaldada'] if state else [],
                         'completeRuleAcceptance': False})
    write(OUT / 'correspondencias.json', {'inventory': inventory, 'count': len(rows), 'rows': rows,
                                        'dependencies': reader.finish()})
    print(f'{len(rows)} candidatos; ninguna promoción')


if __name__ == '__main__':
    main()
