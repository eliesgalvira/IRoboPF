"""Revisión independiente del transporte R28; no escribe fuentes ni candidatos."""
import copy
import gzip
import hashlib
import json
from pathlib import Path
import jsonschema

ROOT = Path.cwd()
HERE = ROOT / 'docs/procedencia/revisiones/flujos-rectificaciones-r28-sol'
INPUT = ROOT / 'docs/procedencia/correcciones/flujos-r28'


def main():
    receipt = json.loads((INPUT / 'rectificaciones.json').read_bytes())
    schemas = {
        'escalas': 'flujo-escalas-r23-sol/grafo.schema.json',
        'rentas': 'flujo-rentas-actividad-r23-sol/schema.json',
        'ss': 'flujo-retenciones-ss-r23-sol/grafo.schema.json',
    }
    rows = []
    for artifact in receipt['artifacts']:
        path = INPUT / artifact['file']
        raw = path.read_bytes()
        assert len(raw) == artifact['size']
        assert hashlib.sha256(raw).hexdigest() == artifact['sha256']
        content = gzip.decompress(raw)
        assert hashlib.sha256(content).hexdigest() == artifact['contentSha256']
        original_path = ROOT / artifact['from']['path']
        original = original_path.read_bytes()
        assert hashlib.sha256(original).hexdigest() == artifact['from']['sha256']
        initial = json.loads(gzip.decompress(original) if original_path.suffix == '.gz' else original)
        reconstructed = copy.deepcopy(initial)
        group = artifact['file'].split('.')[0]
        changes = [c for c in receipt['changes'] if c['group'].split('.')[0] == group]
        for change in changes:
            section = change['group'].split('.')[1]
            target = reconstructed['instances'] if group == 'rentas' and section == 'argument4' else reconstructed
            if section != 'argument4':
                target = target[section]
            index = change['index']
            if section == 'argument4':
                assert target[index]['argument4'] == change['before']
                target[index]['argument4'] = change['after']
            else:
                assert target[index] == change['before']
                target[index] = change['after']
        candidate = json.loads(content)
        assert candidate == reconstructed
        # Más fuerte que igualdad JSON: receta de serialización completa de R28.
        expected_bytes = (json.dumps(candidate, ensure_ascii=False, indent=2, separators=(',', ': ')) + '\n').encode()
        # JS no escapa caracteres Unicode; estos artefactos no usan floats ambiguos.
        assert expected_bytes == content
        if group in schemas:
            schema = json.loads((ROOT / 'docs/procedencia/editorial' / schemas[group]).read_bytes())
            validator = jsonschema.validators.validator_for(schema)
            validator.check_schema(schema)
            validator(schema).validate(candidate)
        rows.append({'file': str(path.relative_to(ROOT)), 'changes': len(changes), 'schema': schemas.get(group), 'exactTransport': True, 'sha256': artifact['sha256'], 'sourceSha256': artifact['from']['sha256']})
    assert len(receipt['changes']) == 28
    assert not receipt['completeClosure'] and not receipt['wiringAllowed'] and not receipt['completeRuleAcceptance']
    (HERE / 'transporte.json').write_text(json.dumps({'artifacts': rows, 'onlyDeclaredChanges': True, 'fiscalAcceptance': False}, indent=2) + '\n')
    print(json.dumps(rows))


if __name__ == '__main__':
    main()
