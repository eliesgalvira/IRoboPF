"""Comprobar transporte, schemas heredados y cambios declarados de R28."""

import gzip
import hashlib
import json
from pathlib import Path

import jsonschema

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
SCHEMAS = {
    'escalas': 'docs/procedencia/editorial/flujo-escalas-r23-sol/grafo.schema.json',
    'rentas': 'docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/schema.json',
    'ss': 'docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/grafo.schema.json',
}


def main():
    receipt = json.loads((HERE / 'rectificaciones.json').read_bytes())
    graphs = {}
    for artifact in receipt['artifacts']:
        raw = (HERE / artifact['file']).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == artifact['sha256']
        assert len(raw) == artifact['size']
        content = gzip.decompress(raw)
        assert hashlib.sha256(content).hexdigest() == artifact['contentSha256']
        original = (ROOT / artifact['from']['path']).read_bytes()
        assert hashlib.sha256(original).hexdigest() == artifact['from']['sha256']
        key = artifact['file'].split('.')[0]
        graphs[key] = json.loads(content)
        # Reproducir cada sustitución partiendo de los bytes históricos.
        before = json.loads(gzip.decompress(original) if artifact['from']['path'].endswith('.gz') else original)
        for change in receipt['changes']:
            if change['group'].split('.')[0] != key:
                continue
            group = change['group'].split('.')[1]
            if group == 'argument4':
                rows = before['instances'] if key == 'rentas' else before
                assert rows[change['index']]['argument4'] == change['before']
                rows[change['index']]['argument4'] = change['after']
            else:
                assert before[group][change['index']] == change['before']
                before[group][change['index']] = change['after']
        assert before == graphs[key], key
    for key, path in SCHEMAS.items():
        schema = json.loads((ROOT / path).read_bytes())
        validator = jsonschema.validators.validator_for(schema)
        validator.check_schema(schema)
        validator(schema).validate(graphs[key])
    assert graphs['rentas']['instances'] == graphs['instancias']
    assert not receipt['completeClosure'] and not receipt['wiringAllowed']
    assert not receipt['completeRuleAcceptance']
    result = {'schemas': list(SCHEMAS), 'exactSubstitutions': len(receipt['changes']),
              'originalsUnchanged': True, 'standaloneInstancesEqual': True,
              'semanticClosureValidated': False, 'completeRuleAcceptance': False}
    (HERE / 'validacion.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result))


if __name__ == '__main__':
    main()
