"""Replay de mappings candidatos, sin ampliar acreditaciones comunes.

Las propuestas de unidad se conservan fuera de semantics del registro. Un rechazo
no permite resultados parciales. El balance cuenta identidades, no estrategias.
"""
from __future__ import annotations
import argparse
from collections import Counter
from copy import deepcopy
import json
from pathlib import Path
import sys
import subprocess
import tempfile
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
import flujo


def unit_evidence_cache(original):
    """Memoiza sólo la prueba física completa, nunca el ámbito ni el cotejo.

    Incluye cajas vecinas de la misma fila: una cabecera ancha que cruza otra
    columna debe conservar el rechazo incluso después de una prueba positiva.
    Cada Store conserva sus propios bytes verificados.
    """
    checked = {}
    def cached(store, table, obligation):
        if table.get('format') == 'ine-json' or obligation.get('unitEvidence') is None:
            return original(store, table, obligation)
        key = (store, flujo.encode([table['document'], table['page'], obligation['unitEvidence'],
                                   obligation['unit'], obligation['bbox'],
                                   [(c['column'], c['bbox']) for c in table['cells'] if c['row'] == obligation['row']]]))
        if key not in checked:
            try:
                checked[key] = original(store, table, obligation)
            except ValueError as error:
                checked[key] = str(error)
        result = checked[key]
        if isinstance(result, str):
            raise ValueError(result)
        return result
    return cached


def batch_positions(repo, registry, work):
    """Ejecuta el resolver actual por lotes; cada replay vuelve a leer el AST.

    No usa posiciones propuestas como caché de verdad. El callback comprueba las
    preimágenes recibidas por expression_unit antes de devolver el resultado.
    """
    proofs = registry.get('semantics', {})
    tasks = [json.loads(key) for key in proofs]
    for binding in tasks:
        source = Path(binding['file'])
        if source.is_absolute() or '..' in source.parts or not (repo / source).resolve().is_relative_to(repo.resolve()):
            raise ValueError('Fuente fuera del repositorio')
    resolved = {}
    resolver = repo / 'tools/procedencia/datos/binding-position.mjs'
    resolver_hash = flujo.digest(resolver.read_bytes())
    with tempfile.TemporaryDirectory(prefix='ast-lote-', dir=work) as folder:
        task_file = Path(folder) / 'bindings.json'
        for start in range(0, len(tasks), 32):
            batch = tasks[start:start + 32]
            task_file.write_bytes(flujo.encode(batch))
            process = subprocess.run(['bun', '--no-install', str(Path(__file__).with_name('posiciones.mjs')),
                                      str(repo), str(task_file)], capture_output=True, text=True, check=True, timeout=120)
            results = [json.loads(line) for line in process.stdout.splitlines()]
            if [r['binding'] for r in results] != batch:
                raise ValueError('Cobertura del resolver incompleta')
            for result in results:
                if 'error' in result:
                    raise ValueError(result['error'])
                binding = result['binding']
                key = (str(repo), str(repo / binding['file']), binding['symbol'], json.dumps(binding['path']),
                       flujo.digest((repo / binding['file']).read_bytes()), resolver_hash)
                resolved[key] = result['position']
    def lookup(*key):
        if key not in resolved:
            raise ValueError('Preimagen o binding distinto del AST ejecutado')
        return resolved[key]
    return lookup


class VerifiedStore(flujo.Store):
    """Caché efímera: cada objeto se comprueba al menos una vez por ejecución."""
    def __init__(self, roots):
        super().__init__(roots)
        self.verified = {}

    def read(self, ref):
        key = (ref['sha256'],ref['size'])
        if key not in self.verified:
            self.verified[key] = super().read(ref)
        return self.verified[key]


def identity(binding):
    return (binding['file'], binding['symbol'], tuple(binding['path']))


def bindings(expression):
    if not expression:
        return []
    if 'binding' in expression:
        return [expression['binding']]
    return [b for arg in expression['args'] for b in bindings(arg)]


def applicability(table, cell):
    """Transporta el ámbito declarado; este lote no acredita su aplicabilidad."""
    return {'status': 'pending',
            'pendingDimensions': ['temporal', 'territorial', 'period', 'conditions'],
            'declared': {'year': table['year'], 'territory': table['territory'],
                         'period': cell.get('period', table.get('period')),
                         'subject': cell.get('subject'), 'conditions': cell.get('conditions')}}


def reservations(table, cell):
    return {'subject': cell.get('subject'), 'conditions': cell.get('conditions'),
            'applicability': applicability(table, cell)}


def rejected_cells(result, tables):
    rejected = {error['code']: error for error in result.get('errors', [])}
    return [{
        'code': table['code'], 'row': cell['row'], 'column': cell['column'],
        'status': 'ambiguity', 'reason': rejected[table['code']]['error'],
        'numericCandidate': None, 'directCorrespondence': False,
        'document': table['document'], 'year': table['year'],
        'territory': table['territory'], 'page': table['page'],
        'period': cell.get('period', table.get('period')),
        'bindings': bindings(cell.get('expression') or cell.get('candidateExpression')),
        **reservations(table, cell)}
        for table in tables if table['code'] in rejected for cell in table['cells']]


def review_queues(result, tables):
    cells = [*result['comparison'], *rejected_cells(result, tables)]
    return {'queue': [c for c in cells if c['status'] != 'match' or c['applicability']['status'] == 'pending'],
            'applicabilityQueue': [c for c in cells if c['applicability']['status'] == 'pending']}


def inventory(folder, repo=None):
    """El inventario común acredita bytes y exports; no una lista histórica fija."""
    summary = json.loads((folder / 'inventario.json').read_bytes())
    items = []
    for page in summary['pages']:
        raw = (folder / page['file']).read_bytes()
        if flujo.digest(raw) != page['sha256']:
            raise ValueError('Inventory page hash differs')
        items.extend(json.loads(raw))
    effective = [i for i in items if i['layer'] == 'effective']
    if repo is not None:
        sources = {i['source']['file']: i['source']['sha256'] for i in items}
        for source, expected in sources.items():
            if flujo.digest((repo / source).read_bytes()) != expected:
                raise ValueError('Inventario obsoleto: ' + source)
    keys = [identity({**i['source'], 'symbol': i['symbol'], 'path': json.loads(i['path'])}) for i in effective]
    if len(keys) != len(set(keys)):
        raise ValueError('Duplicate effective binding')
    return items


def execute(repo, tables, registry, items, store, proposals):
    flujo.validate_obligations(tables, registry['tables'])
    if len({t['code'] for t in tables}) != len(tables):
        raise ValueError('Duplicate table code')
    comparisons, extraction, errors, proofs = [], [], [], []
    physical_cache = {}
    unit_cache = {}
    item_index = {}
    for item in items:
        item_index.setdefault((item['source']['file'],item['symbol']),[]).append(item)
    for table, obligation in zip(tables, registry['tables'], strict=True):
        candidate = deepcopy(obligation)
        try:
            if any(c.get('unitEvidenceRejection') for c in table['cells']):
                raise ValueError('Prueba de unidad sin relación v2; propuesta conservada, tabla rechazada')
            keys = [flujo.encode([table['document'],table['page'],c['bbox'],c['unit'],c.get('numberFormat'),c.get('literalVariant')]) for c in table['cells']]
            if not all(k in physical_cache for k in keys):
                fresh = flujo.pdf_table(store, table)
                for key, cell in zip(keys, fresh, strict=True):
                    physical_cache[key] = {k:cell[k] for k in ('quote','literal','normalized','words','normalization','geometry','selectors')}
            cells = [{**physical_cache[key], **spec, 'document':table['document'],
                      'page':table['page'], 'table':table['code'], 'year':table['year'],
                      'territory':table['territory']} for key,spec in zip(keys,table['cells'],strict=True)]
            for spec in candidate['cells']:
                if spec.get('unitEvidence') is not None:
                    try:
                        key = flujo.encode([table['document'],table['page'],spec,
                                            [(c['row'],c['column'],c['bbox']) for c in table['cells']]])
                        if key not in unit_cache:
                            try:
                                flujo.evidence_unit(store, table, spec)
                                unit_cache[key] = None
                            except ValueError as error:
                                unit_cache[key] = str(error)
                        if unit_cache[key]:
                            raise ValueError(unit_cache[key])
                    except ValueError as error:
                        if str(error) != 'Relación semántica de cabecera sin acreditar':
                            raise
                        proofs.append({'code': table['code'], 'row': spec['row'], 'column': spec['column'],
                                       'document': table['document'], 'page': table['page'],
                                       'proposal': spec['unitEvidence'], 'integration': str(error)})
                        spec['unitEvidence'] = None
            # Sólo las acreditaciones del registro; no autoaceptar las propuestas.
            used = {(b['file'], b['symbol']) for c in table['cells'] for b in bindings(c.get('expression'))}
            table_items = [i for key in sorted(used) for i in item_index.get(key,[])]
            result = flujo.compare([table], cells, table_items, obligations=[candidate], store=store,
                                   semantics=registry['semantics'], repo=repo)
        except ValueError as error:
            errors.append({'code': table['code'], 'cells': len(table['cells']), 'error': str(error)})
            continue
        for result_cell, spec in zip(result, table['cells'], strict=True):
            result_cell.update(reservations(table, spec))
            result_cell['bindings'] = bindings(spec.get('expression') or spec.get('candidateExpression'))
            if spec.get('candidateExpression') is not None:
                result_cell['bindingResolution'] = 'indirect-or-unproven; see resolution-failures'
            expression = spec.get('expression') or {}
            result_cell['directCorrespondence'] = ('binding' in expression or expression.get('op') == 'percent')
            result_cell['review'] = 'candidate'
            # El cotejo común calcula observed incluso sin unidad admitida.
            # No convertir estas igualdades en match acreditado.
            result_cell['numericCandidate'] = None
            if result_cell['observed'] is not None and result_cell['expected'] != 'absent':
                from decimal import Decimal
                result_cell['numericCandidate'] = ('equal' if Decimal(result_cell['observed']) == Decimal(result_cell['expected']) else 'different')
        extraction.extend(cells)
        comparisons.extend(result)
    return {'comparison': comparisons, 'extraction': extraction, 'errors': errors,
            'unitCorrespondenceProposals': proofs, 'engineUnitProposals': proposals,
            'counts': dict(Counter(c['status'] for c in comparisons))}


def occurrence(leaf, candidates):
    # Una diferencia no se oculta por otra estrategia que coincida.
    status = ('difference' if any(c['status'] == 'difference' and c.get('directCorrespondence') for c in candidates)
              else 'match' if any(c['status'] == 'match' and c.get('directCorrespondence') for c in candidates) else 'not-verifiable')
    simulated = leaf.get('territories') == ['simulada-estatal']
    if simulated:
        status = 'not-applicable'
    evidence_keys = ('code', 'row', 'column', 'status', 'reason', 'numericCandidate',
                     'directCorrespondence', 'subject', 'conditions', 'applicability',
                     'year', 'territory', 'period', 'document', 'page', 'bbox')
    return {'binding': {k: deepcopy(leaf[k]) for k in ('file', 'symbol', 'path')},
            'years': deepcopy(leaf['years']), 'territories': deepcopy(leaf['territories']),
            'period': leaf.get('period'),
            'status': status, 'evidence': [{k: deepcopy(c.get(k)) for k in evidence_keys} for c in candidates],
            'reason': 'simulation-not-official-territory' if simulated else None if status != 'not-verifiable' else (
                'table-extraction-rejected' if candidates and all(c['status'] == 'ambiguity' for c in candidates)
                else 'integration-unit-or-scope-review' if candidates else 'selector-not-implemented'),
            'availability': 'not-applicable' if simulated else 'not-assessed' if not candidates else
                'source-extraction-rejected' if all(c['status'] == 'ambiguity' for c in candidates) else 'source-bytes-extracted',
            'applicability': {'status': 'not-applicable' if simulated else 'pending',
                              'reason': 'simulation-not-official-territory' if simulated else 'candidate-scope-not-reviewed'}}


def balance(scope, result, tables):
    links = {}
    for cell in [*result['comparison'], *rejected_cells(result, tables)]:
        for binding in cell['bindings']:
            links.setdefault(identity(binding), []).append(cell)
    occurrences = [occurrence(leaf, links.get(identity(leaf), [])) for leaf in scope]
    keys = [identity(o['binding']) for o in occurrences]
    if len(keys) != len(set(keys)):
        raise ValueError('Overlapping occurrence denominator')
    return {'occurrences': occurrences, 'counts': dict(Counter(o['status'] for o in occurrences)),
            'reasons': dict(Counter(o['reason'] for o in occurrences if o['reason'])),
            'policy': 'candidate; no fiscal acceptance; selector gaps are not external unavailability'}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    for name in ('repo','mapping','obligations','census','scope','proposals','cas','output'):
        p.add_argument('--'+name, type=Path, required=True)
    p.add_argument('--obligations-sha256', required=True)
    p.add_argument('--base', required=True)
    p.add_argument('--read-root', type=Path, action='append', default=[])
    p.add_argument('--verify', type=Path)
    a = p.parse_args()
    import re
    if re.fullmatch(r'[0-9a-f]{40}', a.base) is None:
        raise ValueError('Base debe ser SHA completo declarado')
    # El loader común conserva schema, pin, ámbitos y validación de posiciones.
    # Sólo se sustituye su transporte por la ejecución acotada del mismo resolver.
    flujo.binding_position = batch_positions(a.repo, json.loads(a.obligations.read_bytes()), a.cas.parent)
    registry, _, selection = flujo.load_registry(a.repo, a.obligations, a.obligations_sha256)
    flujo.evidence_unit = unit_evidence_cache(flujo.evidence_unit)
    tables = json.loads(a.mapping.read_bytes())
    result = execute(a.repo, tables, registry, inventory(a.census, a.repo), VerifiedStore([a.cas,*a.read_root]), json.loads(a.proposals.read_bytes()))
    result.update(review_queues(result, tables))
    if len(result['comparison']) + sum(error['cells'] for error in result['errors']) != sum(len(t['cells']) for t in tables):
        raise ValueError('Cobertura de resultados incompleta')
    result['balance'] = balance(json.loads(a.scope.read_bytes()), result, tables)
    manifest = {'selection': selection, 'base': a.base,
                'counts': result['counts'], 'occurrences': result['balance']['counts'],
                'artifacts': {k: flujo.put(a.cas, flujo.encode(v)) for k,v in result.items()},
                'inputs': {k: flujo.put(a.cas, getattr(a,k).read_bytes()) for k in ('mapping','obligations','scope','proposals')},
                'code': {**flujo.software_inputs(a.repo),
                         **{str(f.relative_to(a.repo)): flujo.digest(f.read_bytes()) for f in Path(__file__).parent.iterdir() if f.suffix in ('.py', '.mjs')}},
                'inventoryArtifacts': {f.name: flujo.put(a.cas, f.read_bytes()) for f in sorted(a.census.iterdir()) if f.is_file()},
                'runtime': flujo.runtime_inputs(),
                'census': flujo.digest((a.census/'censo-completo.json').read_bytes()),
                'dependencies': flujo.digest((a.census/'dependencias-runtime.json').read_bytes())}
    raw = flujo.encode(manifest)
    if a.verify and a.verify.read_bytes() != raw:
        raise ValueError('Replay differs')
    a.output.write_bytes(raw)
    print(json.dumps({'counts':manifest['counts'],'occurrences':manifest['occurrences']}))


if __name__ == '__main__':
    main()
