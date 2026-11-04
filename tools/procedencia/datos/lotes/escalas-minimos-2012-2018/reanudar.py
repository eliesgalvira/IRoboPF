"""Conciliación por identidad y ejecución actual sin regenerar un censo por tabla.

Requiere un censo común generado previamente. No descarga ni escribe el motor.
Los inputs históricos se conservan; cada resultado actual lleva base y preimágenes.
"""
from __future__ import annotations

import argparse
from collections import Counter
from copy import deepcopy
import json
from pathlib import Path
import subprocess
import sys

import enlaces as e
from censo_cuotas import augment
from selectores_minimos import manual_contribuyente
from aliases import component

f = e.flujo
LOTS = ('2012-2018', '2019-2026')


def selected(leaf):
    name = Path(leaf['file']).name
    return (leaf.get('classification') == 'fiscal-candidate'
            and leaf.get('type') in ('Decimal', 'number')
            and (name.startswith(('irpf-autonomico-', 'minimos-autonomicos-'))
                 or name == 'escalas-publicadas.ts'
                 or name == 'irpf-estatal-2012-2026.ts'
                 and ('TRAMOS' in leaf['symbol'] or 'MINIMO_PERSONAL' in leaf['symbol'])))


def reconcile(previous, current):
    """No hay emparejamientos por valor ni sustitución de símbolos retirados."""
    old = {e.identity(v): v for v in previous}
    new = {e.identity(v): v for v in current}
    if len(old) != len(previous) or len(new) != len(current):
        raise ValueError('Identidad repetida en censo')
    rows = []
    for key in sorted(old.keys() | new.keys()):
        before, after = old.get(key), new.get(key)
        dimensions = ('years', 'territories', 'unit', 'period')
        changed = [d for d in dimensions if before and after and before.get(d) != after.get(d)]
        rows.append({'binding': dict(file=key[0], symbol=key[1], path=list(key[2])),
                     'status': 'new' if before is None else 'retired' if after is None else
                     'scope-changed' if changed else 'retained',
                     'changedDimensions': changed,
                     'previous': before, 'current': after})
    return rows


def prepare(args):
    census = augment(args.census)
    # La preimagen de cada módulo se coteja con el checkout, sin ejecutar imports.
    for module in census['modules']:
        if f.digest((args.repo / module['file']).read_bytes()) != module['sha256']:
            raise ValueError('Censo obsoleto: ' + module['file'])
    for page in json.loads((args.census / 'inventario.json').read_bytes())['pages']:
        if f.digest((args.census / page['file']).read_bytes()) != page['sha256']:
            raise ValueError('Página de inventario alterada')
    all_leaves = [v for v in census['leaves'] if selected(v)]
    known = {e.identity(v) for v in census['leaves']}
    for lot in LOTS:
        out = args.work / lot
        out.mkdir(parents=True, exist_ok=True)
        lo, hi = map(int, lot.split('-'))
        scope = [v for v in all_leaves if any(lo <= y <= hi for y in v['years'])]
        old_scope = json.loads((args.previous / lot / 'scope.json').read_bytes())
        reconciliation = reconcile(old_scope, scope)
        tables = json.loads((args.previous / lot / 'mapping.json').read_bytes())
        registry = json.loads((args.previous / lot / 'obligaciones.json').read_bytes())
        gaps = []
        for table in tables:
            for cell in table['cells']:
                missing = [b for b in e.bindings(cell.get('expression')) if e.identity(b) not in known]
                if missing:
                    gaps.append({'code': table['code'], 'row': cell['row'], 'column': cell['column'],
                                 'missingBindings': missing, 'previousExpression': cell['expression']})
                    cell['expression'] = None
        for name, value in [('scope', scope), ('mapping', tables), ('obligaciones', registry),
                            ('reconciliation', reconciliation), ('binding-gaps', gaps)]:
            (out / (name + '.json')).write_bytes(f.encode(value))
        proposals = (args.previous / lot / 'propuestas.json').read_bytes()
        (out / 'propuestas.json').write_bytes(proposals)
        print(lot, len(scope), dict(Counter(r['status'] for r in reconciliation)), flush=True)


def run(args):
    roots = json.loads((args.previous / 'roots.json').read_bytes())
    for lot in LOTS:
        folder = args.work / lot
        registry = folder / 'obligaciones.json'
        original_mapping = folder / 'mapping-v1.json'
        if original_mapping.exists():
            current = json.loads((folder / 'mapping.json').read_bytes())
            original = json.loads(original_mapping.read_bytes())
            for table, old_table in zip(current, original, strict=True):
                for cell, old_cell in zip(table['cells'], old_table['cells'], strict=True):
                    if cell.get('expression') is None and old_cell.get('expression') is not None:
                        cell['candidateExpression'] = old_cell['expression']
            (folder / 'mapping.json').write_bytes(f.encode(current))
        command = [sys.executable, str(Path(__file__).with_name('enlaces.py')), '--repo', str(args.repo),
                   '--base', args.base, '--census', str(args.census), '--cas', str(args.cas),
                   '--mapping', str(folder / 'mapping.json'), '--obligations', str(registry),
                   '--obligations-sha256', f.digest(registry.read_bytes()),
                   '--scope', str(folder / 'scope.json'), '--proposals', str(folder / 'propuestas.json')]
        for root in roots:
            command.extend(['--read-root', root])
        (folder / 'command.json').write_bytes(f.encode(command))
        log_path = folder / ('execution-' + f.digest(registry.read_bytes()) + '.log')
        with log_path.open('wb') as log:
            subprocess.run([*command, '--output', str(folder / 'canonical.json')], check=True, stdout=log, stderr=log)
            subprocess.run([*command, '--output', str(folder / 'replay.json'), '--verify', str(folder / 'canonical.json')],
                           check=True, stdout=log, stderr=log)
        print(lot, 'replay byte a byte', flush=True)


def enrich(args):
    """Propone posiciones AST actuales, sin convertir referencias indirectas en literales.

    Los sujetos y períodos siguen siendo los candidatos heredados. Esta acción
    produce correspondencias técnicas v2; no certifica su aplicabilidad jurídica.
    """
    store = e.VerifiedStore([args.cas, *map(Path, json.loads((args.previous / 'roots.json').read_bytes()))])
    f.evidence_unit = e.unit_evidence_cache(f.evidence_unit)
    positions = {}
    tasks = {}
    for lot in LOTS:
        folder = args.work / lot
        mapping = folder / 'mapping-v1.json'
        if not mapping.exists():
            mapping = folder / 'mapping.json'
        for table in json.loads(mapping.read_bytes()):
            for cell in table['cells']:
                for binding in e.bindings(cell.get('expression')):
                    tasks[f.encode(binding).decode().strip()] = binding
    task_list = list(tasks.values())
    for start in range(0, len(task_list), 32):
        batch = task_list[start:start + 32]
        input_file = args.work / 'position-batch.json'
        input_file.write_bytes(f.encode(batch))
        process = subprocess.run(['bun', '--no-install', str(Path(__file__).with_name('posiciones.mjs')),
                                  str(args.repo), str(input_file)], capture_output=True, text=True, timeout=120, check=True)
        results = [json.loads(line) for line in process.stdout.splitlines()]
        if [v['binding'] for v in results] != batch:
            raise ValueError('Cobertura AST incompleta')
        for result in results:
            key = f.encode(result.pop('binding')).decode().strip()
            positions[key] = result
        (args.work / 'positions-progress.json').write_bytes(f.encode(positions))
        print('AST', min(start + 32, len(task_list)), '/', len(task_list), flush=True)
    for lot in LOTS:
        folder = args.work / lot
        tables = json.loads((folder / ('mapping-v1.json' if (folder / 'mapping-v1.json').exists() else 'mapping.json')).read_bytes())
        registry = json.loads((folder / ('obligaciones-v1.json' if (folder / 'obligaciones-v1.json').exists() else 'obligaciones.json')).read_bytes())
        registry['version'] = 2
        registry['semantics'] = {}
        failures = []
        for table, obligation in zip(tables, registry['tables'], strict=True):
            for cell, spec in zip(table['cells'], obligation['cells'], strict=True):
                proofs = {}
                for binding in e.bindings(cell.get('expression')):
                    key = f.encode(binding).decode().strip()
                    if key not in positions:
                        raise ValueError('Binding fuera del lote AST precensado')
                    resolution = positions[key]
                    if 'error' in resolution:
                        failures.append({'binding': binding, **resolution})
                        break
                    position = deepcopy(resolution['position'])
                    quote = position.pop('quote')
                    adapter = position.pop('adapter', None)
                    text = (args.repo / binding['file']).read_text()
                    # Sólo unidades expresadas por la propiedad y constructor real.
                    if Path(binding['file']).name == 'escalas-publicadas.ts':
                        unit = 'proportion' if binding['path'][-1] == 'tipo' else 'EUR'
                    elif quote.startswith('importe(') and 'const importe = crearImporteMonetario' in text:
                        unit = 'EUR'
                    elif quote.startswith('tipo(') and 'const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)' in text:
                        unit = 'proportion'
                    else:
                        failures.append({'binding': binding, 'error': 'Constructor/unidad sin adaptador acreditado', 'quote': quote})
                        break
                    proof = {'unit': unit, 'quote': quote, 'position': position,
                             'sourceSha256': f.digest((args.repo / binding['file']).read_bytes()), 'targets': []}
                    if adapter:
                        proof['adapter'] = adapter
                    proofs[key] = proof
                # Todos los operandos deben tener posición; no usar pruebas parciales.
                if len(proofs) != len({f.encode(b) for b in e.bindings(cell.get('expression'))}):
                    cell['candidateExpression'] = deepcopy(cell.get('expression'))
                    cell['expression'] = None
                    proofs = {}
                cell['subject'] = 'minimum-amount' if 'minim' in table['code'] else 'scale-component'
                cell['conditions'] = 'Ámbito candidato heredado; aplicabilidad temporal y territorial pendiente de revisión'
                spec.update(subject=cell['subject'], conditions=cell['conditions'], engineExpression=cell.get('expression'))
                target = {k: table[k] for k in ('code', 'year', 'territory')}
                target.update({k: cell[k] for k in ('row', 'column', 'subject', 'conditions')})
                for key, proof in proofs.items():
                    accepted = registry['semantics'].setdefault(key, proof)
                    if target not in accepted['targets']:
                        accepted['targets'].append(target)
                if spec.get('unitEvidence') and 'relation' not in spec['unitEvidence']:
                    for relation in ('column', 'adjacent'):
                        proposed = deepcopy(spec)
                        proposed['unitEvidence']['relation'] = relation
                        try:
                            f.evidence_unit(store, table, proposed)
                        except ValueError:
                            continue
                        spec['unitEvidence'] = proposed['unitEvidence']
                        break
                    if 'relation' not in spec['unitEvidence']:
                        cell['unitEvidenceRejection'] = deepcopy(spec['unitEvidence'])
                        spec['unitEvidence'] = None
        # Conservar íntegro el resultado anterior como antecedente de la transformación.
        for name, obj in [('mapping', tables), ('obligaciones', registry), ('resolution-failures', failures)]:
            previous = folder / (name + '.json')
            if previous.exists() and not (folder / (name + '-v1.json')).exists():
                (folder / (name + '-v1.json')).write_bytes(previous.read_bytes())
            previous.write_bytes(f.encode(obj))
        print(lot, 'bindings con posición', len(registry['semantics']), 'intentos rechazados', len(failures), flush=True)
    (args.work / 'positions.json').write_bytes(f.encode(positions))


def merge_balances(balances):
    """Recalcula la unión sin arrastrar la causa de la primera estrategia."""
    union = {}
    for lot, balance in sorted(balances.items()):
        for row in balance['occurrences']:
            union.setdefault(e.identity(row['binding']), []).append((lot, row))
    rows = []
    for key in sorted(union):
        strategies = union[key]
        first = strategies[0][1]
        leaf = {**first['binding'], **{k: first.get(k) for k in ('years', 'territories', 'period')}}
        evidence = []
        for _, row in strategies:
            if any(row.get(k) != first.get(k) for k in ('years', 'territories', 'period')):
                raise ValueError('Ámbitos distintos para una misma identidad de censo')
            for candidate in row['evidence']:
                if candidate not in evidence:
                    evidence.append(candidate)
        merged = e.occurrence(leaf, evidence)
        merged['lots'] = [lot for lot, _ in strategies]
        merged['strategies'] = [{'lot': lot, **{k: deepcopy(row[k]) for k in
                                  ('status', 'reason', 'availability', 'applicability', 'evidence')}}
                                for lot, row in strategies]
        rows.append(merged)
    return rows


def summarize(args):
    balances = {}
    lot_results = {}
    for lot in LOTS:
        folder = args.work / lot
        manifest = json.loads((folder / 'canonical.json').read_bytes())
        balance = json.loads((args.cas / manifest['artifacts']['balance']['sha256']).read_bytes())
        balances[lot] = balance
        errors = json.loads((args.cas / manifest['artifacts']['errors']['sha256']).read_bytes())
        comparison = json.loads((args.cas / manifest['artifacts']['comparison']['sha256']).read_bytes())
        groups = Counter((c['year'], c['territory'], c['status']) for c in comparison)
        lot_results[lot] = {'manifest': manifest, 'tablesRejected': len(errors),
                            'numericCandidates': dict(Counter(c['numericCandidate'] or 'uncompared' for c in comparison)),
                            'balance': [{'year': y, 'territory': t, 'status': s, 'cells': n}
                                        for (y, t, s), n in sorted(groups.items())]}
    rows = merge_balances(balances)
    concepts = {}
    for row in rows:
        binding = row['binding']
        target = component((args.repo / binding['file']).read_text(), binding)
        canonical = target[0] if target else binding
        concepts.setdefault(e.identity(canonical), []).append(binding)
    concept_rows = [{'binding': dict(file=key[0], symbol=key[1], path=list(key[2])),
                     'occurrences': value, 'review': 'structural-reference-candidate; not normative acceptance'}
                    for key, value in sorted(concepts.items())]
    grouped = Counter(('minimos' if 'minimos' in r['binding']['file'] or 'MINIMO' in r['binding']['symbol'] else 'escalas',
                       year, territory, r['status']) for r in rows for year in r['years']
                      for territory in (r['territories'] or ['scope-unknown']))
    result = {'base': args.base, 'uniqueOccurrences': len(rows),
              'counts': dict(Counter(r['status'] for r in rows)),
              'occurrences': f.put(args.cas, f.encode(rows)), 'lots': lot_results,
              'applicabilityCounts': dict(Counter(row['applicability']['status'] for row in rows)),
              'applicabilityQueue': f.put(args.cas, f.encode([row for row in rows if row['applicability']['status'] == 'pending'])),
              'structuralConcepts': f.put(args.cas, f.encode(concept_rows)),
              'structuralConceptCount': len(concept_rows),
              'byDomainYearTerritory': [{'domain': d, 'year': y, 'territory': t, 'status': s, 'occurrences': n}
                                       for (d, y, t, s), n in sorted(grouped.items())],
              'acceptance': 'pending', 'complete': False,
              'policy': 'Los huecos de selector y ámbito son trabajo interno, no ausencia externa de fuente.'}
    (args.work / 'balance.json').write_bytes(f.encode(result))
    print(result['uniqueOccurrences'], result['counts'])


def repair_units(args):
    """Reanuda un registro rechazado por schema sin repetir censo ni AST.

    Conserva la propuesta legacy y rechaza la tabla completa, en vez de aceptar
    una cabecera cuya relación v2 no pudo acreditarse.
    """
    for lot in LOTS:
        folder = args.work / lot
        tables = json.loads((folder / 'mapping.json').read_bytes())
        registry = json.loads((folder / 'obligaciones.json').read_bytes())
        count = 0
        for table, obligation in zip(tables, registry['tables'], strict=True):
            for cell, spec in zip(table['cells'], obligation['cells'], strict=True):
                proof = spec.get('unitEvidence')
                if proof and 'bbox' in proof and 'relation' not in proof:
                    cell['unitEvidenceRejection'] = proof
                    spec['unitEvidence'] = None
                    count += 1
        for name, value in [('mapping', tables), ('obligaciones', registry)]:
            path = folder / (name + '.json')
            preserved = folder / (name + '-schema-rejected.json')
            if not preserved.exists():
                preserved.write_bytes(path.read_bytes())
            path.write_bytes(f.encode(value))
        print(lot, 'propuestas sin relación v2 conservadas', count)


def manual(args):
    """Selector nuevo del mínimo general: subconjunto explícito, sin sumar estrategias."""
    roots = [args.cas, *map(Path, json.loads((args.previous / 'roots.json').read_bytes()))]
    store = e.VerifiedStore(roots)
    items = e.inventory(args.census, args.repo)
    tables, obligations, semantics, contexts, gaps = [], [], {}, [], []
    seen = set()
    for lot in LOTS:
        previous = json.loads((args.previous / lot / 'mapping.json').read_bytes())
        for entry in previous:
            if entry.get('kind') != 'minimum-euro-candidates':
                continue
            key = (entry['year'], entry['document']['sha256'], entry['page'])
            if key in seen:
                continue
            seen.add(key)
            with f.pymupdf.open(stream=store.read(entry['document']), filetype='pdf') as doc:
                try:
                    selected = manual_contribuyente(doc[entry['page'] - 1])
                except ValueError as error:
                    gaps.append({'year': entry['year'], 'document': entry['document'], 'page': entry['page'], 'reason': str(error)})
                    continue
            year = entry['year']
            binding = {'file': f'lib/dominio/normativa/datos/minimos-autonomicos-{year}.ts',
                       'symbol': f'MINIMOS_ESTATALES_{year}', 'path': selected['path']}
            source = args.repo / binding['file']
            if not source.exists():
                gaps.append({'year': year, 'reason': 'engine-module-absent'})
                continue
            position = deepcopy(f.binding_position(str(args.repo), str(source), binding['symbol'], json.dumps(binding['path']),
                                          f.digest(source.read_bytes()), f.digest((args.repo / 'tools/procedencia/datos/binding-position.mjs').read_bytes())))
            quote = position.pop('quote')
            adapter = position.pop('adapter', None)
            if not quote.startswith('importe(') or 'const importe = crearImporteMonetario' not in source.read_text():
                raise ValueError('Constructor del mínimo sin prueba de unidad')
            cell = {'row': '0', 'column': 'amount', 'bbox': selected['bbox'], 'unit': 'EUR',
                    'expression': {'binding': binding}, 'subject': selected['subject'],
                    'conditions': 'cuantía general anual; condiciones del derecho no comprobadas'}
            table = {k: entry[k] for k in ('document', 'page', 'year')}
            table.update(code=f'manual-general-{year}-p{entry["page"]}', territory='estatal-comun', cells=[cell])
            obligation = deepcopy(table)
            obligation['cells'][0].pop('expression')
            obligation['cells'][0].update(unitEvidence=selected['unitEvidence'], engineExpression=cell['expression'])
            target = {k: table[k] for k in ('code', 'year', 'territory')}
            target.update({k: cell[k] for k in ('row', 'column', 'subject', 'conditions')})
            proof = {'unit': 'EUR', 'sourceSha256': f.digest(source.read_bytes()), 'quote': quote,
                     'position': position, 'targets': [target]}
            if adapter:
                proof['adapter'] = adapter
            proof_key = f.encode(binding).decode().strip()
            if proof_key in semantics:
                semantics[proof_key]['targets'].append(target)
            else:
                semantics[proof_key] = proof
            tables.append(table)
            obligations.append(obligation)
            contexts.append({'code': table['code'], 'document': table['document'], 'page': table['page'], **selected})
    registry = {'version': 2, 'basis': 'Selector físico por frase de sujeto, cuantía general y unidad anual; candidato',
                'tables': obligations, 'semantics': semantics}
    path = args.work / 'manual-obligaciones.json'
    path.write_bytes(f.encode(registry))
    f.load_registry(args.repo, path, f.digest(path.read_bytes()))
    first = e.execute(args.repo, tables, registry, items, e.VerifiedStore(roots), {})
    replay = e.execute(args.repo, tables, registry, items, e.VerifiedStore(roots), {})
    if f.encode(first) != f.encode(replay):
        raise ValueError('Replay del selector manual distinto')
    result = {'base': args.base, 'counts': first['counts'], 'artifacts': {
        name: f.put(args.cas, f.encode(value)) for name, value in [('result', first), ('mapping', tables),
        ('obligations', registry), ('contexts', contexts), ('gaps', gaps)]}, 'replay': 'byte-identical',
        'policy': 'Estrategia suplementaria; no sumar al denominador; aceptación y aplicabilidad pendientes'}
    (args.work / 'manual.json').write_bytes(f.encode(result))
    print('Selector manual general', result['counts'])


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('action', choices=('prepare', 'run', 'summarize', 'enrich', 'manual', 'repair-units'))
    for name in ('repo', 'previous', 'census', 'cas', 'work'):
        p.add_argument('--' + name, type=Path, required=True)
    p.add_argument('--base', required=True)
    args = p.parse_args()
    if not all(v.is_absolute() for v in (args.repo, args.previous, args.census, args.cas, args.work)):
        p.error('Todas las rutas deben ser absolutas')
    if args.work.is_relative_to(args.repo) or args.cas.is_relative_to(args.repo):
        p.error('Artefactos grandes fuera del checkout')
    args.cas.mkdir(parents=True, exist_ok=True)
    args.work.mkdir(parents=True, exist_ok=True)
    {'prepare': prepare, 'run': run, 'summarize': summarize, 'enrich': enrich, 'manual': manual,
     'repair-units': repair_units}[args.action](args)


if __name__ == '__main__':
    main()
