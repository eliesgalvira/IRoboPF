"""Auxiliar documental. La comprobación completa empieza en verificar-enlaces.mjs.

La atestación se confía al registro editorial del repositorio, no a nombres
autodeclarados dentro de la cita. No es firma digital ni certificación fiscal.
"""
import argparse
from cas import CasResolver
from jsonschema.exceptions import ValidationError
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import re
import sys

from corpus import verify, validate_schema, public_document


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read_json(data):
    def pairs(entries):
        result = {}
        for key, value in entries:
            if key in result:
                raise ValueError('Clave JSON duplicada: ' + key)
            result[key] = value
        return result

    def constant(value):
        raise ValueError('Constante JSON no finita: ' + value)

    return json.loads(data, object_pairs_hook=pairs, parse_constant=constant)


def local_file(root, relative):
    if not isinstance(relative, str) or not relative.startswith('docs/procedencia/'):
        raise ValueError('Referencia fuera del corpus documental')
    parts = Path(relative).parts
    if '..' in parts or '.' in parts or '\\' in relative:
        raise ValueError('Ruta no canónica')
    path = root / relative
    resolved = path.resolve(strict=True)
    if not resolved.is_relative_to(root.resolve() / 'docs/procedencia'):
        raise ValueError('Referencia escapada mediante enlace simbólico')
    if path.is_symlink() or not path.is_file():
        raise ValueError('Referencia no es archivo ordinario')
    return path


class DocumentaryReadSet:
    """Bytes observados al leer; todos se vuelven a comprobar al terminar."""
    def __init__(self, root):
        self.root = root
        self.dependencies = {}

    def read_bytes(self, relative):
        raw = local_file(self.root, relative).read_bytes()
        actual = sha(raw)
        if relative in self.dependencies and actual != self.dependencies[relative]:
            raise ValueError('Documento cambió durante la verificación: ' + relative)
        self.dependencies[relative] = actual
        return raw

    def read_ref(self, ref):
        raw = self.read_bytes(ref['path'])
        if sha(raw) != ref['sha256']:
            raise ValueError('Hash de referencia incorrecto: ' + ref['path'])
        return read_json(raw)

    def finish(self):
        for path, expected in self.dependencies.items():
            if sha(local_file(self.root, path).read_bytes()) != expected:
                raise ValueError('Documento cambió durante la verificación: ' + path)
        return [{'path': path, 'sha256': expected} for path, expected in sorted(self.dependencies.items())]


def verify_attestation(reader, ref, payload, payload_hash):
    if ref is None:
        return 'pending'
    attestation = reader.read_ref(ref)
    validate_schema(attestation, 'binding-attestation')
    if (attestation['payloadSha256'] != payload_hash
            or attestation['inventory'] != payload['inventory']
            or attestation['scope'] != payload['scope']):
        raise ValueError('Atestación de otro payload, snapshot o alcance')
    task = attestation['reviewTaskId']
    if task == payload['authorTaskId']:
        raise ValueError('Autor no puede contrarrevisarse')
    # Registro separado y fijo; no se admite un catálogo elegido por la cita.
    reviewers = read_json(reader.read_bytes('docs/procedencia/enlaces/revisores.json'))
    validate_schema(reviewers, 'binding-reviewers')
    matches = [r for r in reviewers['reviewers'] if r['taskId'] == task]
    if len(matches) != 1:
        raise ValueError('Revisor no registrado inequívocamente por el orquestador')
    registration = matches[0]
    delegates = reader.read_ref(registration['delegationRegistry'])
    registered = [d for d in delegates if d['taskId'] == task and d['key'].startswith('revision-')]
    if len(registered) != 1:
        raise ValueError('Delegación independiente inexistente')
    if not attestation['report']['path'].startswith(registration['reportDirectory'] + '/'):
        raise ValueError('Informe ajeno al ámbito del revisor')
    report_raw = reader.read_bytes(attestation['report']['path'])
    if sha(report_raw) != attestation['report']['sha256'] or not report_raw.strip():
        raise ValueError('Informe independiente ausente o alterado')
    return 'accepted-limited'


def select_decision(decisions, identifier):
    if not isinstance(decisions, list) or any(not isinstance(d, dict) for d in decisions):
        raise ValueError('Lista de decisiones inválida')
    matches = [d for d in decisions if d.get('id') == identifier]
    if len(matches) != 1:
        raise ValueError('Decisión jurídica ausente o duplicada')
    decision = matches[0]
    # Schema explícito de la proyección operativa; la prosa editorial no autoriza.
    projection = {k: decision[k] for k in ('id', 'status', 'decision', 'engineLocations') if k in decision}
    try:
        validate_schema(projection, 'legal-decision-scope')
    except ValidationError as error:
        raise ValueError('Decisión jurídica ambigua o sin alcance explícito') from error
    state = decision.get('status', decision.get('decision'))
    if state != 'accepted':
        raise ValueError('Decisión jurídica independiente no aceptada')
    return decision


def location_matches(location, source):
    if isinstance(location, str):
        path, symbol = location.split('#')
    else:
        path, symbol = location['path'], location.get('symbol')
    if path != source['file']:
        return False
    if symbol is None:
        return True
    # Solo identificadores y accesos simples; nunca eliminar un sufijo para ampliar alcance.
    parts = re.fullmatch(r'([A-Za-z_$][A-Za-z0-9_$]*)(.*)', symbol)
    if parts is None or parts[1] != source['symbol']:
        return False
    suffix = parts[2]
    segments = re.findall(r'\.([A-Za-z0-9_-]+)|\[([A-Za-z0-9_-]+)\]', suffix)
    consumed = ''.join(m.group() for m in re.finditer(r'\.[A-Za-z0-9_-]+|\[[A-Za-z0-9_-]+\]', suffix))
    if consumed != suffix:
        return False
    prefix = [a or b for a, b in segments]
    return source['tablePath'][:len(prefix)] == prefix


def verify_evidence(root, context, *, cas_roots=None):
    """Componente parcial: context debe producirlo el coordinador Node fresco."""
    root = Path(root).resolve()
    resolver = CasResolver(cas_roots if cas_roots is not None else [root / "docs/procedencia/corpus/fixtures"])
    reader = DocumentaryReadSet(root)
    registry_raw = reader.read_bytes('docs/procedencia/enlaces/registro.json')
    if sha(registry_raw) != context['registrySha256']:
        raise ValueError('Registro distinto del leído por el coordinador')
    registry = read_json(registry_raw)
    validate_schema(registry, 'binding-registry')
    items = {}
    for item in context['items']:
        if item['id'] in items:
            raise ValueError('ID de inventario duplicado')
        items[item['id']] = item
    results = []
    seen = set()
    for entry in registry['entries']:
        payload = reader.read_ref(entry['payload'])
        validate_schema(payload, 'binding-payload')
        if payload['id'] in seen:
            raise ValueError('Binding duplicado')
        seen.add(payload['id'])
        if payload['inventory'] != {k: context[k] for k in ('manifestSha256', 'artifactSha256')}:
            raise ValueError('Binding de otro snapshot de inventario')
        item = items.get(payload['itemId'])
        if item is None or item['layer'] != 'effective':
            raise ValueError('Binding requiere valor efectivo inventariado')
        source = payload['source']
        if (item['source']['file'] != source['file'] or item['source']['sha256'] != source['sha256']
                or item['symbol'] != source['symbol'] or json.loads(item['path']) != source['tablePath']):
            raise ValueError('Binding de otra ocurrencia del motor')
        citation = reader.read_ref(payload['citation'])
        document = reader.read_ref(payload['document'])
        if public_document(document) != document:
            raise ValueError('Manifiesto público debe estar saneado antes del hash')
        for label, blob in (('Original', document['sha256']), ('Facsímil', citation['facsimile']['sha256'])):
            try:
                resolver.resolve(blob)
            except ValueError as error:
                raise ValueError(label + ' CAS: ' + str(error)) from error
            if cas_roots is None:
                reader.read_bytes('docs/procedencia/corpus/fixtures/sha256/' + blob)
        verify(document, citation, root / 'docs/procedencia/corpus/fixtures', resolver=resolver)
        binding = citation['engineBinding']
        if binding is None:
            raise ValueError('Cita sin número y unidad literales')
        if (binding['unitCode'] != payload['scope']['unit']
                or payload['conversion'] != 'identity'):
            raise ValueError('Unidad o conversión no acreditadas')
        actual = item['value']
        if not isinstance(actual, str) or not re.fullmatch(r'[+-]?[0-9]+(?:\.[0-9]+)?', actual):
            raise ValueError('Valor del motor no es un decimal finito')
        if Decimal(actual) != Decimal(binding['value']):
            raise ValueError('Número oficial distinto del valor efectivo actual')
        decisions = reader.read_ref(payload['legalReview']['decisions'])
        decision = select_decision(decisions, payload['legalReview']['decisionId'])
        if not any(location_matches(loc, source) for loc in decision['engineLocations']):
            raise ValueError('Decisión no refiere a la ocurrencia del motor')
        review = verify_attestation(reader, entry['attestation'], payload, entry['payload']['sha256'])
        # Dimensiones candidatas de ESTA ocurrencia, no inferencias por igualdad numérica.
        # La pertenencia evita contradicciones; no acredita vigencia ni el claim libre.
        if (payload['scope']['year'] not in item.get('years', [])
                or payload['scope']['territory'] not in item.get('territories', [])):
            raise ValueError('Ámbito del binding sin correspondencia explícita en la ocurrencia')
        results.append({'id': payload['id'], 'itemId': item['id'], 'value': actual,
                        'documentSha256': document['sha256'], 'scope': payload['scope'],
                        'integrity': 'verified', 'numericBinding': 'verified',
                        'legalDecision': payload['legalReview']['decisionId'],
                        'bindingReview': review, 'authenticity': document.get('authenticity', {'status': 'not-validated'}).get('status'),
                        'completeRuleAcceptance': False})
    return {'evidence': results, 'documentaryDependencies': reader.finish(), 'casDependencies': resolver.finish()}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cas-root', action='append', type=Path)
    args = parser.parse_args()
    result = verify_evidence(Path.cwd(), read_json(sys.stdin.read()), cas_roots=args.cas_root)
    print(json.dumps(result, ensure_ascii=False, indent=2))
