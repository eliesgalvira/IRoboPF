"""Auxiliar documental. La comprobación completa empieza en verificar-enlaces.mjs.

La atestación se confía al registro editorial del repositorio, no a nombres
autodeclarados dentro de la cita. No es firma digital ni certificación fiscal.
"""
import argparse
from cas import CasResolver
from jsonschema.exceptions import ValidationError
from decimal import Decimal
from datetime import date
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


def delegation_entries(registry):
    """Formas históricas reales; sin inferir un rol de una identidad arbitraria."""
    if isinstance(registry, list):
        entries = registry
    elif isinstance(registry, dict) and type(registry.get('version')) is int and registry['version'] == 1:
        containers = [key for key in ('delegates', 'delegate', 'delegaciones') if key in registry]
        if len(containers) != 1:
            raise ValueError('Contenedores de delegación ambiguos')
        entries = [registry['delegate']] if containers[0] == 'delegate' else registry[containers[0]]
    else:
        raise ValueError('Versión de delegaciones no soportada')
    if not isinstance(entries, list) or any(not isinstance(d, dict) for d in entries):
        raise ValueError('Delegaciones inválidas')
    normalized = []
    for entry in entries:
        if ('key' in entry and 'clave' in entry) or ('role' in entry and 'rol' in entry):
            raise ValueError('Aliases de delegación ambiguos')
        converted = dict(entry)
        if 'clave' in converted:
            converted['key'] = converted.pop('clave')
        if 'rol' in converted:
            converted['role'] = converted.pop('rol')
        normalized.append(converted)
    entries = normalized
    tasks = [d.get('taskId') for d in entries]
    keys = [d['key'] for d in entries if 'key' in d]
    if (any(not isinstance(t, str) or not t for t in tasks + keys)
            or len(set(tasks)) != len(tasks) or len(set(keys)) != len(keys)):
        raise ValueError('Identidades de delegación ausentes o duplicadas')
    return entries


def evaluate_scope(scope, context):
    """Comprueba un contexto declarado; jamás acredita residencia o elegibilidad."""
    required = {'year', 'territory', 'component', 'taxBase', 'periodStart',
                'accrual', 'death', 'externalConditions'}
    if not isinstance(context, dict) or not required <= context.keys() or context.keys() - required - {'generalBase'}:
        raise ValueError('Contexto incompleto o no soportado')
    for key in ('year', 'territory', 'component', 'taxBase', 'externalConditions'):
        if context[key] != scope[key]:
            raise ValueError('Contexto fuera de ámbito: ' + key)
    if type(context['year']) is not int:
        raise ValueError('Año inválido')
    year = context['year']
    if (scope['externalConditions'] != ['residence-unverified', 'eligibility-unverified']
            or scope['taxBase'] != 'general'
            or (scope['period'] == 'madrid-2022' and (year != 2022 or scope['territory'] != 'madrid'))):
        raise ValueError('Condiciones externas o período no respaldados')
    if context['periodStart'] != f'{year}-01-01':
        raise ValueError('Inicio de período fuera de ámbito')
    def civil(value):
        if not isinstance(value, str) or not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', value):
            raise ValueError('Fecha civil requerida')
        parsed = date.fromisoformat(value)
        if parsed.year != year:
            raise ValueError('Fecha de otro ejercicio')
        return parsed
    civil(context['accrual'])
    death = context['death']
    if death is not None:
        civil(death)
        if scope['period'] != 'madrid-2022' or year != 2022 or scope['territory'] != 'madrid':
            raise ValueError('Fallecimiento fuera del ámbito respaldado')
        if death != context['accrual']:
            raise ValueError('Fallecimiento y devengo contradictorios')
    elif context['accrual'] != f'{year}-12-31':
        raise ValueError('Devengo ordinario contradictorio')
    if scope['period'] not in ('ordinary-no-death', 'madrid-2022'):
        raise ValueError('La cuantía nominal no respalda selección de período')
    predicate = scope['predicate']
    if predicate == 'murcia-blg-gt-60000':
        amount = context.get('generalBase')
        if (scope['territory'] != 'murcia' or year != 2022
                or not isinstance(amount, str) or not re.fullmatch(r'[0-9]+(?:\.[0-9]+)?', amount)
                or Decimal(amount) <= Decimal('60000')):
            raise ValueError('Murcia requiere BLG estrictamente mayor que 60000')
    elif predicate != 'nominal-cell':
        raise ValueError('Predicado no soportado')
    return {'periodAndPredicate': 'matched', 'externalConditions': 'unverified',
            'applicability': 'not-established', 'completeRuleAcceptance': False}


def verify_executable_scope(reader, payload, item):
    """Propuesta nueva; conserva la decisión original, sin atribuirle aprobación."""
    scope = reader.read_ref(payload['executableScope'])
    validate_schema(scope, 'executable-cell-scope')
    if (scope['decision'] != payload['legalReview'] or scope['source'] != payload['source']
            or scope['inventory'] != payload['inventory'] or scope['itemId'] != item['id']
            or scope['value'] != item['value']):
        raise ValueError('Ámbito de otra identidad, valor o inventario')
    for key in ('year', 'territory', 'unit'):
        if scope[key] != payload['scope'][key]:
            raise ValueError('Ámbito contradictorio: ' + key)
    decisions = reader.read_ref(scope['decision']['decisions'])
    decision = select_decision(decisions, scope['decision']['decisionId'])
    if (scope['editorialConditions'] != decision.get('conditions')
            or payload['scope']['conditions'] != scope['editorialConditions']):
        raise ValueError('Condiciones editoriales omitidas o alteradas')
    for key in ('year', 'territory', 'unit', 'value'):
        if scope[key] != decision.get(key):
            raise ValueError('Decisión de otra celda o ejercicio: ' + key)
    source = scope['source']
    if len(source['tablePath']) != 2:
        raise ValueError('Se requiere ruta exacta de fila y columna')
    symbol = source['symbol'] + '[' + source['tablePath'][0] + '].' + source['tablePath'][1]
    locations = decision['engineLocations']
    if (len(source['tablePath']) != 2 or len(locations) != 1
            or not isinstance(locations[0], dict)
            or locations[0].get('symbol') != symbol
            or locations[0].get('path') != source['file']
            or locations[0].get('sha256') != source['sha256']
            or decision.get('column') != source['tablePath'][1]):
        raise ValueError('Identidad exacta de celda no acreditada')
    state = scope['territory'] == 'estatal-comun'
    expected_period = 'nominal-only' if state else 'ordinary-no-death'
    if scope['territory'] == 'madrid':
        if scope['year'] != 2022 or source['symbol'] != 'MADRID_2022':
            raise ValueError('Madrid fuera de 2022')
        expected_period = 'madrid-2022'
    if scope['territory'] == 'catalunya' and scope['year'] not in range(2020, 2025):
        raise ValueError('Catalunya fuera del período revisado')
    expected_predicate = ('murcia-blg-gt-60000' if source['symbol'] == 'MURCIA_2022'
                          and source['tablePath'][0] == '4' else 'nominal-cell')
    if (scope['component'] != ('estatal' if state else 'autonomico')
            or scope['period'] != expected_period or scope['predicate'] != expected_predicate):
        raise ValueError('Condiciones ejecutables contradictorias')
    # Cierre documental del fundamento, no solo de su proyección.
    for citation in decision.get('citations', []):
        reader.read_ref(citation)
    for key in ('chainEvidence', 'additionalCitations'):
        if key in decision:
            reader.read_ref(decision[key])
    return scope


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
    registered = [d for d in delegation_entries(delegates) if d['taskId'] == task and ('key' not in d or d['key'].startswith('revision-'))]
    if len(registered) != 1 or registered[0].get('role', 'review') not in ('review', 'revision'):
        raise ValueError('Delegación independiente inexistente')
    if not attestation['report']['path'].startswith(registration['reportDirectory'] + '/'):
        raise ValueError('Informe ajeno al ámbito del revisor')
    report_raw = reader.read_bytes(attestation['report']['path'])
    if sha(report_raw) != attestation['report']['sha256'] or not report_raw.strip():
        raise ValueError('Informe independiente ausente o alterado')
    if payload.get('schemaVersion') != 2:
        raise ValueError('Nueva aceptación requiere ámbito ejecutable v2')
    if reviewers['schemaVersion'] != 2:
        raise ValueError('Nueva aceptación requiere aprobación exacta del orquestador')
    approvals = registration['approvals']
    approved = [a for a in approvals if a['payloadSha256'] == payload_hash]
    if len(approved) != 1 or approved[0]['attestation'] != ref:
        raise ValueError('Payload o atestación sin aprobación exacta del orquestador')
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
        if payload['schemaVersion'] == 2:
            verify_executable_scope(reader, payload, item)
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
