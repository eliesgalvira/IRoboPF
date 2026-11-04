"""Contrato cerrado PJC/178/2025 y PJC/297/2026; candidato, no validador universal.

CLI focal aditiva: no cambia contexto.period/local_period ni acepta mappings libres.
Registro revisable sellado: cambiar selección/semántica exige una nueva versión.
Los períodos abiertos nunca equivalen al período anual de enlaces.run.
"""
from __future__ import annotations

import argparse
from collections import Counter
from decimal import Decimal
import json
from pathlib import Path
import sys

# En la entrega se importa el pipeline del checkout en modo lectura.
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--objects', type=Path, required=True)
    parser.add_argument('--census', type=Path, required=True)
    parser.add_argument('--registry', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    sys.path[:0] = [str(args.repo / 'tools/procedencia/datos/lotes/ipc-ss'),
                   str(args.repo / 'tools/procedencia/datos')]

import contexto
import flujo

REGISTRY_SHA256 = 'ddafd77c1f6556e29fb034d5941768915ca7acbc56500c8b766413e76e561426'
SS = 'lib/dominio/normativa/datos/seguridad-social-2012-2026.ts'
RATES = 'lib/dominio/laboral/cotizaciones-sociales.ts'
PROFILE = 'lib/dominio/laboral/cotizaciones-perfil-uniforme.ts'
IPC = 'lib/dominio/normativa/datos/ipc-2012-2026.ts'


def unique(rows):
    if len(rows) != 1:
        raise ValueError('Enlace ausente o ambiguo')
    return rows[0]


def verify_registry(registry):
    if flujo.digest(flujo.encode(registry)) != REGISTRY_SHA256:
        raise ValueError('Contrato cerrado alterado: documento/año/artículo/columna/unidad/selector')


def verify_order(store, order):
    """Reproduce identidad, título, efecto, artículo, cabeceras y cada celda.

    La semántica de los párrafos está fijada en el registro sellado; no se infiere
    desde la fecha suministrada por un llamador ni mediante coincidencia numérica.
    """
    raw = store.read(order['document'])
    if flujo.digest(raw) != order['document']['sha256'] or len(raw) != order['document']['size']:
        raise ValueError('Identidad documental distinta')
    with flujo.pymupdf.open(stream=raw, filetype='pdf') as doc:
        if contexto.year(doc) != order['year']:
            raise ValueError('Ejercicio documental distinto')
        for proofs in [order['title'], order['effects'], *order['articles'].values()]:
            for proof in proofs:
                contexto.quote(doc, proof)
        rows = []
        for spec in order['cells']:
            proofs = [spec['value']]
            proofs += [spec['row'], spec['header']] if spec['kind'] == 'base' else spec['clause']
            for proof in proofs:
                contexto.quote(doc, proof)
            # El verificador común protege también signo cercano fuera de bbox.
            cell = flujo.pdf_table(store, dict(document=order['document'], page=spec['value']['page'],
                year=order['year'], territory='ES', code=spec['id'], cells=[dict(
                    row=str(spec.get('group', spec.get('party'))),
                    column=spec.get('column', spec.get('concept')),
                    unit=spec['unit'], bbox=spec['value']['bbox'])]))[0]
            if cell['literal'] != spec['value']['literal']:
                raise ValueError('Literal cambiado')
            rows.append({**spec, 'normalized': cell['normalized'], 'year': order['year'],
                         'document': order['document'], 'scopeStatus': 'closed-order-evidenced',
                         'period': {'from': f"{order['year']}-01-01", 'through': None},
                         'periodEvidence': order['effects'],
                         'articleEvidence': order['articles'][spec['article']]})
    return rows


def checked_modules(census, repo):
    proofs = []
    # Sólo hojas y AST de estos cuatro módulos; no se valida el censo completo.
    for file in (SS, RATES, PROFILE, IPC):
        module = unique([m for m in census['modules'] if m['file'] == file])
        actual = flujo.digest((repo / file).read_bytes())
        if actual != module['sha256']:
            raise ValueError('Módulo del censo obsoleto: ' + file)
        proofs.append({'file': file, 'sha256': actual})
    return proofs


def compare_row(row, engine, factor=1):
    expected = Decimal(row['normalized']) * factor
    return 'match' if expected == Decimal(engine) else 'difference'


def run(registry, store, census, repo):
    verify_registry(registry)
    modules = checked_modules(census, repo)
    rows = [r for order in registry for r in verify_order(store, order)]
    links = []
    def add(row, engine, binding, factor):
        links.append({'year': row['year'], 'id': row['id'], 'evidenceId': row['id'],
                      'engine': engine, 'binding': binding, 'factor': str(factor),
                      'status': compare_row(row, engine, factor),
                      'applicability': 'conditional-uniform-profile',
                      'period': row['period'],
                      'annualProjection': 'conditional; requires no superseding provision',
                      'futurePart': '2026-11-05/2026-12-31' if row['year'] == 2026 else None})
    for r in rows:
        year = r['year']
        if r['kind'] == 'base':
            if r['id'] != 'base-1-maximum':
                r['engineUse'] = 'not-consumed; minimum/group/day eligibility pending'
                continue
            leaf = unique([x for x in census['leaves'] if x['file'] == SS
                           and x['symbol'] == 'BASE_MAXIMA_COTIZACION_LEGACY' and x['path'] == [str(year)]])
            if leaf['sourceSha256'] != unique([m for m in modules if m['file'] == SS])['sha256']:
                raise ValueError('Hoja de otro módulo')
            add(r, leaf['value'], leaf, Decimal(12))
        elif r['party'] == 'total':
            r['engineUse'] = 'total-not-consumed'
        elif r['concept'] == 'mei':
            # Parámetros efectivos sólo tras comprobar módulo que los produce.
            p = unique([p for p in census['parameters'] if p['year'] == year])
            add(r, p['mei'][r['party']], {'file': RATES, 'symbol': 'obtenerTiposMei',
                'year': year, 'party': r['party'], 'censusParameter': p}, Decimal('.01'))
        elif r['concept'].startswith('solidaridad-'):
            tranche = int(r['concept'].split('-')[1]) - 1
            party = 'empresa' if r['party'] == 'empresarial' else 'trabajador'
            module = unique([m for m in census['modules'] if m['file'] == PROFILE])
            item = unique([x for x in module['ast']['items'] if x['symbol'] == 'tiposSolidaridad'
                and x.get('value') is not None
                and ['PropertyAssignment:' + str(year), 0] in json.loads(x['path'])
                and ['PropertyAssignment:' + party, 0] in json.loads(x['path'])
                and json.loads(x['path'])[-1] == ['StringLiteral', tranche]])
            if (item['source']['sha256'] != module['sha256']
                    or item['source']['file'] != PROFILE):
                raise ValueError('AST de otro módulo')
            add(r, item['value'], item, Decimal('.01'))
        else:
            leaf = unique([x for x in census['leaves'] if x['file'] == RATES
                and x['symbol'] == 'TIPOS_SEGURIDAD_SOCIAL_LEGACY'
                and x['path'] == [r['concept'], r['party']]])
            if leaf['sourceSha256'] != unique([m for m in modules if m['file'] == RATES])['sha256']:
                raise ValueError('Hoja de otro módulo')
            add(r, leaf['value'], leaf, Decimal('.01'))
    for year in (2025, 2026):
        for concept, party, reason in [
            ('atep', 'empresarial', '1,5% requiere selección de tarifa/actividad; art.4 remite a tarifa'),
            ('atep', 'trabajador', 'cero requiere derivación revisada del cargo exclusivo art.4'),
            ('fogasa', 'trabajador', 'cero requiere derivación revisada del cargo empresarial art.33'),
        ]:
            links.append(dict(year=year, id=f'{concept}-{party}', status='pending', reason=reason))
    return {'version': 1, 'acceptance': 'candidate-independent-review-required',
            'registrySha256': REGISTRY_SHA256, 'verifiedModules': modules,
            'censusScope': 'four modules only; no endorsement of full census/candidate',
            'sourceCutoff': {'2025': 'BOE original 2025-02-26', '2026': 'BOE original 2026-03-31'},
            'evaluationDate': '2026-11-04', 'laterAmendments': 'not searched; not certified absent',
            'ipc2026': {'status': 'declared-scenario', 'proportion': '0.03', 'INEObservation': False},
            'physicalCells': rows, 'links': links,
            'counts': dict(Counter(x['status'] for x in links)),
            'reserves': ['mínimos no consumidos por motor; no elegibilidad por grupo/jornada',
                         'solidaridad: tipos acreditados; umbrales y álgebra/centimos requieren revisión',
                         'sin certificación anual de vigencia, redondeo TGSS ni cuotas ingresables']}


if __name__ == '__main__':
    result = run(json.loads(args.registry.read_bytes()), flujo.Store([args.objects]),
                 json.loads(args.census.read_bytes()), args.repo)
    result['censusSha256'] = flujo.digest(args.census.read_bytes())
    args.output.write_bytes(flujo.encode(result))
    print(json.dumps({'physicalCells': len(result['physicalCells']), **result['counts']}))
