"""Campaña sintética Open2025: captura serial reanudable, sin motor alternativo."""
import argparse
import copy
import fcntl
import json
import os
import re
import subprocess
import sys
import time
import uuid
from decimal import Decimal
from pathlib import Path

import run
from binding import PENDING, personal
from compare_engine import compare_engine
from config import SOURCE, directory, executable, external_directory, global_lock
from c300_evidence import validate_result
from storage import append_jsonl, canonical, digest, latest_states, put_blob, read_jsonl, read_ref

POLICY = 'c300-synthetic-v1; fresh-context-template-per-case; aggregate-payers'


def eur(cents):
    return f'{cents // 100}.{cents % 100:02d}'


def matrix():
    refs = json.loads((SOURCE.parents[2] / 'docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json').read_text())
    base = refs[1]['entrada']
    cases = []

    def add(gross, ss, retention, group, expenses=(0, 0, 0), payers=1):
        entry = copy.deepcopy(base)
        r = entry['trabajo']['rendimientos'][0]
        r['integro'] = eur(gross)
        r['cotizaciones']['seguridadSocial'] = eur(ss)
        for name, value in zip(('sindicato', 'colegio', 'defensa'), expenses):
            r[name]['importe'] = eur(value)
        entry['retenciones'][0]['importe'] = eur(retention)
        if payers == 2:
            second = copy.deepcopy(r)
            second['id'] = 'b'
            for obj, value in ((r, gross // 2), (second, gross - gross // 2)):
                obj['integro'] = eur(value)
            r['cotizaciones']['seguridadSocial'] = eur(ss // 2)
            second['cotizaciones']['seguridadSocial'] = eur(ss - ss // 2)
            for name in ('sindicato', 'colegio', 'defensa'):
                second[name]['importe'] = '0.00'
            entry['trabajo']['rendimientos'].append(second)
            other = copy.deepcopy(entry['retenciones'][0])
            entry['retenciones'][0]['importe'] = eur(retention // 2)
            other.update(operacionId='ret-1', procedencia='sintetico:certificado-1', importe=eur(retention - retention // 2))
            entry['retenciones'].append(other)
        job = dict(id=f'c300-{len(cases) + 1:03}', source='componentes', gross=eur(gross), ss=eur(ss), retention=eur(retention))
        cases.append(dict(job=job, entrada=entry, group=group, expenses=dict(zip(('GCS', 'GCC', 'GDJ'), map(eur, expenses))),
                          officialPayers='totales agregados del trabajo; no registro individual de pagadores',
                          syntheticAssumptions='Hechos completos declarados en entrada, personas ficticias; sin documentos reales'))

    # Pilotos variados primero: DA61, gastos y dos pagadores agregados.
    add(1700043, 100000, 100001, 'piloto-da61')
    add(2500017, 163002, 310003, 'piloto-gastos', (12345, 49999, 29999))
    add(4200031, 273005, 700007, 'piloto-dos-pagadores', (22001, 50000, 30000), 2)
    # Cortes expresados como hipótesis de diseño, no nuevas afirmaciones legales.
    cuts = [1587600, 1700042, 1832600, 1974749, 2074749, 2200462,
            1245000, 2020000, 3520000, 6000000, 30000000]
    for cut in cuts:
        for offset in (-2, -1, 0, 1, 2):
            for ss in (0, 100000, 237891):
                add(cut + offset, ss, (cut + offset) // 11, 'cortes-bruto')
    for net in (1485200, 1767349, 1974749, 1245000, 2020000, 3520000, 6000000):
        for offset in (-1, 0, 1):
            add(net + 300000 + offset, 100000, 172301, 'cortes-neto-hipotesis')
    for i in range(51):
        gross = (900000, 1600000, 2400000, 4500000, 9000000, 35000000)[i % 6] + i * 137 + 1
        add(gross, gross * (4 + i % 5) // 100, (0, 1, 10001, gross // 7)[i % 4], 'rentas-ss-retencion')
    for i in range(40):
        add(1500000 + i * 69713, 80000 + i * 7391, i * 19003, 'gastos-limites',
            ((i % 5) * 12501, (0, 49999, 50000, 50001)[i % 4], (0, 29999, 30000, 30001)[(i // 4) % 4]))
    for i in range(20):
        add(1800000 + i * 183179, 90000 + i * 7919, 10001 + i * 17911, 'dos-pagadores-agregados', (i * 1703, 0, 0), 2)
    assert len(cases) == 300
    validate_cases(cases)
    return cases


def validate_cases(cases):
    ids, inputs = set(), set()
    for case in cases:
        job = case['job']
        entry = case['entrada']
        if (entry['ejercicio'], entry['comunidadAutonoma'], entry['edad'], entry['modalidad'], entry['perfil']) != (2025, 'madrid', 40, 'individual', 'solo-trabajo'):
            raise ValueError('Entrada fuera del perfil C300 salarial')
        if set(job) != {'id', 'source', 'gross', 'ss', 'retention'} or job['source'] != 'componentes' or not re.fullmatch(r'c300-\d{3}', job['id']):
            raise ValueError('Contrato job C300 inválido')
        for name in ('gross', 'ss', 'retention'):
            if not re.fullmatch(r'\d{1,7}\.\d{2}', job[name]):
                raise ValueError('Importe job inválido')
        rs = case['entrada']['trabajo']['rendimientos']
        totals = dict(gross=sum(Decimal(r['integro']) for r in rs),
                      ss=sum(Decimal(r['cotizaciones'][k]) for r in rs for k in ('seguridadSocial', 'derechosPasivos', 'colegiosHuerfanos')),
                      retention=sum(Decimal(r['importe']) for r in case['entrada']['retenciones']))
        if any(Decimal(job[k]) != v for k, v in totals.items()):
            raise ValueError('Totales distintos de entrada completa')
        for field, name in zip(('GCS', 'GCC', 'GDJ'), ('sindicato', 'colegio', 'defensa')):
            if Decimal(case['expenses'][field]) != sum(Decimal(r[name]['importe']) for r in rs):
                raise ValueError('Gasto distinto de entrada completa')
        key = digest(canonical(case['entrada']))
        if key in inputs or job['id'] in ids:
            raise ValueError('Caso duplicado')
        ids.add(job['id'])
        inputs.add(key)


def code_identity():
    return {p.name: digest(p.read_bytes()) for p in sorted(SOURCE.iterdir()) if p.is_file()}


def archive_code():
    refs = {p.name: put_blob(run.STORE, p.read_bytes()) for p in sorted(SOURCE.iterdir()) if p.is_file()}
    name = 'capture-code-' + digest(canonical({k: v['sha256'] for k, v in refs.items()})) + '.json'
    (run.OUT / name).write_bytes(canonical(refs))


def historical_receipts(cases):
    """Selección histórica explícita; no crea done bajo una identidad nueva."""
    proofs = set()
    for path in run.OUT.glob('capture-code-*.json'):
        refs = json.loads(path.read_bytes())
        hashes = {name: digest(read_ref(ref)) for name, ref in refs.items()}
        proofs.add(digest(canonical(hashes)))
    records = read_jsonl(run.OUT / 'journal.jsonl', closed_snapshot=True)
    states = latest_states(records)
    by_id = {c['job']['id']: c for c in cases}
    selected = {}
    for r in records:
        if r.get('status') != 'done' or states[r['key']]['status'] != 'done':
            continue
        selected[r['job']['id']] = r
    for r in selected.values():
        case = by_id[r['job']['id']]
        if r['key'] != digest(canonical(r['identity'])) or r['job'] != case['job']:
            raise ValueError('Identidad original contradictoria')
        if r['identity'].get('case') != case or r['identity'].get('matrixSha256') != digest(canonical(cases)):
            raise ValueError('Recibo histórico de otra matriz/entrada')
        if digest(canonical(r['identity']['code'])) not in proofs:
            raise ValueError('Código original del recibo histórico no conservado')
        validate(r['result'], case)
    return selected


def identity(case, environment, matrix_hash):
    _, original = run.identity(case['job'], environment)
    stamp = dict(transport=original, case=case, matrixSha256=matrix_hash, policy=POLICY, code=code_identity())
    return digest(canonical(stamp)), stamp


def validate(row, case):
    checked = validate_result(row, official=run.OFFICIAL)
    if row['id'] != case['job']['id']:
        raise ValueError('Resultado de otro caso')
    missing = []
    for field, key in (('IDII', 'gross'), ('GSS', 'ss'), ('IDRE', 'retention'), ('IDICLDED2', 'gross'), ('GSSCLDED2', 'ss')):
        value = row['fields'][field]
        expected = case['job'][key]
        if value is None:
            if Decimal(expected) != 0 or row.get('uiReadback', {}).get(field) != expected:
                raise ValueError('Entrada ausente sin lectura UI cero: ' + field)
            missing.append(field)
        elif Decimal(value) != Decimal(expected):
            raise ValueError('Entrada consumida distinta: ' + field)
    data = read_ref(row['ses'])
    if personal(data) != {'EDADD': '40', 'DPFNAC_D': '01/01/1985', 'CAD_D': 'MADRID', 'CAC_D': '12', 'ZCCAD': '12', 'ZFNAC_D': '01/01/1985'}:
        raise ValueError('Identidad personal distinta')
    if digest((run.BASE / 'componentes.ses').read_bytes()) != run.TEMPLATES['componentes']:
        raise ValueError('Plantilla distinta')
    from contract import decode
    schema = json.loads((SOURCE / 'observed-schema.json').read_bytes())
    text = decode(data)
    unknown = sorted(set(re.findall(r'^ *(\w+)~', text, re.M)) - set(schema['keys']))
    sections = sorted(set(re.findall(r'^ *\[([A-Z0-9_]+)\]', text, re.M)) - set(schema['sections']))
    binding = dict(state='incompleto', pending=PENDING + ['auditoria-exhaustiva-registros-plantilla'],
                   absentInputs=missing, unreviewedKeys=unknown, unreviewedSections=sections,
                   scope='Hechos sintéticos declarados; cantidades/personal comprobados; sin admisión universal')
    for field, value in case['expenses'].items():
        actual = row['fields'][field]
        # Cero ausente es reserva explícita; nunca igualdad monetaria.
        if actual is None and Decimal(value) == 0:
            continue
        if actual is None or Decimal(actual) != Decimal(value):
            raise ValueError('Gasto consumido distinto: ' + field)
    return dict(evidence=checked, binding=binding, absentInputs=missing)


def capture(case):
    import replay_functions as t
    from playwright.sync_api import sync_playwright
    job = case['job']
    with sync_playwright() as driver:
        browser = driver.chromium.launch(executable_path=run.CHROMIUM, headless=True)
        context = browser.new_context(accept_downloads=True, user_agent='IRoboPF synthetic Open2025 campaign')
        t.BASE, t.context, t.blob = run.BASE, context, run.blob
        t.page = context.new_page()
        t.page.set_default_timeout(20000)
        message = 'Compruebe el importe de los ingresos y de la "Seguridad Social y otros" (Seguridad Social, mutualidades de funcionarios, derechos pasivos y colegios de huérfanos)'

        def warning_handler(text):
            def confirm_known_warning():
                append_jsonl(run.OUT / 'confirmations.jsonl', dict(id=job['id'], warning=text,
                             html=run.blob(t.page.content().encode())))
                t.page.get_by_role('dialog', name=re.compile('^Verificar datos')).get_by_role('button', name='Continuar', exact=True).click()
            return confirm_known_warning

        # La misma confirmación puede reaparecer al abrir DA61. El handler de
        # actionability actúa sólo ante este aviso exacto, también si llega tarde.
        for known in (message, 'Compruebe el importe de los ingresos reflejados y de los gastos de Seguridad Social y otros'):
            t.page.add_locator_handler(t.page.get_by_text(known, exact=True), warning_handler(known), times=5)
        try:
            t.load(job['source'])
            t.work()
            t.page.get_by_text('0003', exact=True).locator('xpath=../../..').get_by_role('button').click()
            # Los títulos desaparecen al reconstruirse ZK; etiquetas y celda
            # contigua observadas en el diagnóstico del piloto, sin ids efímeros.
            values = [('Importe íntegro', job['gross']), ('Seguridad Social y otros', job['ss']), ('Retención', job['retention']),
                      ('Cuotas satisfechas a Sindicatos', case['expenses']['GCS']), ('Cuotas a Colegios profesionales', case['expenses']['GCC']),
                      ('Gastos de defensa jurídica', case['expenses']['GDJ'])]
            for label, value in values:
                field = t.dlg().get_by_text(label, exact=True).locator('xpath=ancestor::td[1]/following-sibling::td[1]').locator('input[type=text]')
                t.amount(field, value)
            t.dlg().get_by_role('button', name='Aceptar', exact=True).click()
            t.da61(job['gross'], job['ss'])
            result = t.capture_case(job['id'])
            # t.amount afirma lectura exacta tras Tab en cada escritura; da61
            # usa el mismo control. Sólo se registra tras completar ambos.
            result['uiReadback'] = dict(IDII=job['gross'], GSS=job['ss'], IDRE=job['retention'],
                                        IDICLDED2=job['gross'], GSSCLDED2=job['ss'])
            return result
        except Exception:
            append_jsonl(run.OUT / 'browser-errors.jsonl', dict(id=job['id'], html=run.blob(t.page.content().encode()), text=run.blob(t.page.locator('body').inner_text().encode())))
            raise
        finally:
            context.close()
            browser.close()


def operate(cases, limit, matrix_hash):
    environment = run.runtime_identity()
    initial_code = code_identity()
    with global_lock().open('a') as lock:
        # Sin espera indefinida ni operaciones remotas simultáneas.
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        states = latest_states(read_jsonl(run.OUT / 'journal.jsonl', repair_tail=True))
        read_jsonl(run.OUT / 'results.jsonl', repair_tail=True)
        executed = 0
        for case in cases:
            if executed >= limit:
                break
            key, stamp = identity(case, environment, matrix_hash)
            if code_identity() != initial_code:
                raise ValueError('Código cambiado: reiniciar')
            last = states.get(key)
            if last and last['status'] == 'done':
                if last['identity'] != stamp or last['validation'] != validate(last['result'], case):
                    raise ValueError('Recibo reutilizado contradictorio')
                if identity(case, environment, matrix_hash) != (key, stamp):
                    raise ValueError('Identidad cambió durante SKIP')
                print('SKIP historical-fixed', case['job']['id'], flush=True)
                continue
            common = dict(key=key, attempt=uuid.uuid4().hex, identity=stamp, job=case['job'])
            append_jsonl(run.OUT / 'journal.jsonl', dict(common, status='started'))
            try:
                # Proceso y descendientes bajo timeout por caso. El padre conserva el bloqueo.
                child = subprocess.run(['timeout', '-k', '30s', '5m', sys.executable, str(SOURCE / 'c300.py'), 'worker', '--case', case['job']['id'], '--lock-fd', str(lock.fileno())], capture_output=True, pass_fds=(lock.fileno(),))
                append_jsonl(run.OUT / 'worker-log.jsonl', dict(id=case['job']['id'], exit=child.returncode, stdout=run.blob(child.stdout), stderr=run.blob(child.stderr)))
                if child.returncode:
                    raise ValueError('Captura detenida; consulte worker-log, código ' + str(child.returncode))
                row = json.loads(child.stdout.splitlines()[-1])
                checked = validate(row, case)
                if identity(case, environment, matrix_hash) != (key, stamp):
                    raise ValueError('Identidad cambió durante captura')
                receipt = dict(common, result=row, validation=checked)
                append_jsonl(run.OUT / 'results.jsonl', receipt)
                done = dict(receipt, status='done')
                append_jsonl(run.OUT / 'journal.jsonl', done)
                states[key] = done
                executed += 1
                print('DONE verified', case['job']['id'], row['fields']['RESULTADO'], flush=True)
                time.sleep(2)
            except Exception as error:
                append_jsonl(run.OUT / 'journal.jsonl', dict(common, status='error', error=str(error)))
                raise


def compare(cases, output):
    output = external_directory(output, '--output')
    output.mkdir(parents=True, exist_ok=True)
    by_id = {c['job']['id']: c for c in cases}
    receipts = list(historical_receipts(cases).values())
    if len({r['job']['id'] for r in receipts}) != len(receipts):
        raise ValueError('Varias identidades por caso: selección explícita requerida')
    selected = [by_id[r['job']['id']] for r in receipts]
    for r, c in zip(receipts, selected):
        validate(r['result'], c)
        if r['identity']['case'] != c:
            raise ValueError('Entrada de recibo distinta de matriz')
    path = output / 'inputs.json'
    path.write_bytes(canonical([c['entrada'] for c in selected]))
    process = subprocess.run([executable('C_BUN', 'bun'), str(SOURCE / 'engine.mjs'), str(path)], capture_output=True, timeout=300)
    (output / 'engine.json').write_bytes(process.stdout)
    (output / 'engine.stderr').write_bytes(process.stderr)
    engine = json.loads(process.stdout)
    if 'results' not in engine or len(engine['results']) != len(receipts):
        raise ValueError('Operador incompleto: consulte engine.json')
    results = []
    for receipt, case, motor in zip(receipts, selected, engine['results']):
        row = dict(id=case['job']['id'], entrada=case['entrada'], ses=receipt['result']['ses'], pdf=receipt['result']['pdf'],
                   originalCaptureKey=receipt['key'], originalCaptureCode=receipt['identity']['code'])
        if motor['entrada'] != case['entrada']:
            raise ValueError('Operador cambió entrada')
        if motor['state'] != 'calculado':
            row.update(state='contrato-no-soportado', reason=motor.get('reason'))
        else:
            boxes = compare_engine(receipt['result'], motor)
            row.update(state='discrepante' if any(b['status'] == 'difiere' for b in boxes.values()) else 'coincidencia-condicionada', boxes=boxes)
        results.append(row)
    counts = {state: sum(r['state'] == state for r in results) for state in ('contrato-no-soportado', 'discrepante', 'coincidencia-condicionada')}
    report = dict(scope='Cotejo sintético monetario; no aceptación fiscal universal', counts=counts, results=results, motor=engine['motor']['sourcesSha256'])
    (output / 'comparison.json').write_bytes(canonical(report))
    (output / 'discrepancias.json').write_bytes(canonical([r for r in results if r['state'] == 'discrepante']))
    print(json.dumps(counts))
    return 1 if counts['discrepante'] else 2


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=('generate', 'capture', 'worker', 'compare'))
    parser.add_argument('--limit', type=int, default=3)
    parser.add_argument('--case')
    parser.add_argument('--lock-fd', type=int)
    parser.add_argument('--pending-only', action='store_true', help='Completar matriz histórica: verifica originales y código conservado; no reetiqueta capturas')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    run.OUT, run.STORE, run.BASE = directory('C_RUN_DIR'), directory('C_CAS_DIR'), directory('C_TEMPLATE_DIR')
    run.OUT.mkdir(parents=True, exist_ok=True)
    path = run.OUT / 'cases.json'
    if args.action == 'generate':
        data = canonical(matrix())
        if path.exists() and path.read_bytes() != data:
            raise ValueError('No sobrescribir matriz distinta')
        path.write_bytes(data)
        print('GENERATED 300', digest(data))
        return 0
    data = path.read_bytes()
    cases = json.loads(data)
    validate_cases(cases)
    if args.action == 'compare':
        if not args.output:
            parser.error('--output requerido')
        return compare(cases, args.output)
    run.CHROMIUM = executable('C_CHROMIUM', 'chromium')
    if args.action == 'worker':
        if args.lock_fd is None or os.fstat(args.lock_fd).st_ino != global_lock().stat().st_ino:
            raise ValueError('Worker requiere bloqueo heredado del operador')
        fcntl.flock(args.lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        selected = [c for c in cases if c['job']['id'] == args.case]
        if len(selected) != 1:
            raise ValueError('Caso inexistente')
        print(json.dumps(capture(selected[0])))
    else:
        if not 1 <= args.limit <= 300:
            raise ValueError('Límite 1–300')
        archive_code()
        if args.pending_only:
            fixed = historical_receipts(cases)
            append_jsonl(run.OUT / 'historical-selection.jsonl', dict(originalKeys={k: r['key'] for k, r in fixed.items()}, verifierCode=code_identity()))
            cases = [c for c in cases if c['job']['id'] not in fixed]
            print('HISTORICAL original identities', len(fixed), 'PENDING', len(cases), flush=True)
        operate(cases, args.limit, digest(data))
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, OSError, KeyError, subprocess.SubprocessError) as error:
        print(type(error).__name__ + ': ' + str(error), file=sys.stderr)
        raise SystemExit(2)
