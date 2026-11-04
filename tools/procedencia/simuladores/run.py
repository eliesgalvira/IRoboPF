"""Piloto serial: evidencia verificada y durable antes de done o SKIP histórico."""
import argparse
import fcntl
import hashlib
import importlib.metadata
import json
import platform
import random
import re
import sys
import time
import uuid
from pathlib import Path
from contract import monetary
from evidence import POLICY, validate_result
from storage import append_jsonl, canonical, digest, latest_states, put_blob, read_jsonl

from config import global_lock, SOURCE, directory, executable

# Se resuelven al entrar al operador; importar módulos no crea estado.
OUT = None
STORE = None
BASE = None
CHROMIUM = None
OFFICIAL = {'year': 2025, 'rules': 'N000088955', 'model': '0.12', 'visible': '1.19'}
TEMPLATES = {'componentes': 'd7ea4ea703305e6881d33af1d60a63ae0c884fea0e8a8a3c3a07b5e6f3cabe17',
             'da61': '5d5e0610c18b033878e62078c146193657a3e00efbd36942d5b0de86df3d554e'}
CODE_FILES = ('run.py', 'contract.py', 'evidence.py', 'storage.py', 'compare_engine.py', 'replay_functions.py', 'config.py', 'acquire.py', 'verify.py', 'launch.sh')
LOADED_CODE = {name: digest((SOURCE / name).read_bytes()) for name in CODE_FILES}


def blob(data):
    return put_blob(STORE, data)


def runtime_identity():
    with Path(CHROMIUM).open('rb') as stream:
        browser_hash = hashlib.file_digest(stream, 'sha256').hexdigest()
    return {'pythonExecutableSha256': digest(Path(sys.executable).read_bytes()), 'python': sys.version, 'platform': platform.platform(),
            'playwright': importlib.metadata.version('playwright'), 'chromiumSha256': browser_hash}


def identity(job, environment):
    if set(job) != {'id', 'source', 'gross', 'ss', 'retention'} or job['source'] not in TEMPLATES:
        raise ValueError('Entrada no admitida por el piloto')
    if not re.fullmatch('[a-zA-Z0-9_-]{1,100}', job['id']):
        raise ValueError('Identificador de caso inválido')
    for key in ('gross', 'ss', 'retention'):
        if not isinstance(job[key], str) or not re.fullmatch(r'\d{1,7}\.\d{2}', job[key]) or monetary(job[key]) > 1000000:
            raise ValueError('Importe de entrada fuera de contrato')
    code = {name: digest((SOURCE / name).read_bytes()) for name in CODE_FILES}
    if code != LOADED_CODE:
        raise ValueError('El código cambió durante el proceso: reiniciar antes de continuar')
    template_sha256 = TEMPLATES[job['source']]
    if digest((BASE / (job['source'] + '.ses')).read_bytes()) != template_sha256:
        raise ValueError('Plantilla distinta del perfil examinado')
    value = {'schema': 'open-run-v2', 'job': job, 'code': code, 'environment': environment,
             'officialPinned': OFFICIAL, 'templateSha256': template_sha256, 'verificationPolicy': POLICY, 'paths': {'templates': str(BASE), 'cas': str(STORE)},
             'pdfTool': digest(Path(executable('C_PDFTOTEXT', 'pdftotext')).read_bytes())}
    return digest(canonical(value)), value


def process_job(job, capture, environment, states=None, fresh=False):
    if states is None:
        states = latest_states(read_jsonl(OUT / 'journal.jsonl', repair_tail=True))
    key, stamp = identity(job, environment)
    last = states.get(key)
    if not fresh and last and last['status'] == 'done':
        if last.get('identity') != stamp or last.get('job') != job:
            raise ValueError('Journal con identidad contradictoria')
        checked = validate_result(last['result'], job, OFFICIAL)
        if last.get('validation') != checked:
            raise ValueError('Dictamen guardado distinto del cotejo actual')
        if identity(job, environment) != (key, stamp):
            raise ValueError('Identidad cambió durante la comprobación de reutilización')
        print('SKIP historical-fixed', job['id'], OFFICIAL['rules'], flush=True)
        return False
    attempt = uuid.uuid4().hex
    common = {'key': key, 'attempt': attempt, 'job': job, 'identity': stamp}
    started = dict(common, status='started')
    append_jsonl(OUT / 'journal.jsonl', started)
    states[key] = started
    try:
        row = capture(job)
        validation = validate_result(row, job, OFFICIAL)
        if identity(job, environment) != (key, stamp):
            raise ValueError('Identidad cambió durante el cálculo')
        receipt = dict(common, result=row, validation=validation)
        # Un resultado huérfano antes de done no cuenta como aceptación.
        append_jsonl(OUT / 'results.jsonl', receipt)
        done = dict(receipt, status='done')
        append_jsonl(OUT / 'journal.jsonl', done)
        states[key] = done
        print('DONE verified', job['id'], row['fields']['RESULTADO'], flush=True)
        return True
    except Exception as error:
        failed = dict(common, status='error', error=type(error).__name__ + ': ' + str(error))
        append_jsonl(OUT / 'journal.jsonl', failed)
        states[key] = failed
        raise


def capture_official(job):
    from playwright.sync_api import sync_playwright
    import replay_functions as transport
    with sync_playwright() as driver:
        browser = driver.chromium.launch(executable_path=CHROMIUM, headless=True)
        context = browser.new_context(accept_downloads=True, user_agent='IRoboPF research synthetic simulation Chromium')
        try:
            transport.BASE = BASE
            transport.context = context
            transport.page = context.new_page()
            transport.page.set_default_timeout(20000)
            transport.blob = blob
            transport.load(job['source'])
            transport.change({'Importe íntegro:': job['gross'], 'Seguridad Social y otros:': job['ss'], 'Retención:': job['retention']})
            transport.da61(job['gross'], job['ss'])
            return transport.capture_case(job['id'])
        except Exception:
            # Diagnóstico privado separado de los resultados aceptados.
            append_jsonl(OUT / 'browser-errors.jsonl', {'job': job['id'],
                         'html': blob(transport.page.content().encode()),
                         'text': blob(transport.page.locator('body').inner_text().encode())})
            raise
        finally:
            context.close()
            browser.close()


def generate():
    rng = random.Random(20261104)
    cents = [1587600, 1700041, 1700042, 1700043, 1832600, 1974749, 2074748, 2074749, 2074750, 2200462]
    cents += [rng.randrange(1200000, 6000000) for _ in range(2010)]
    jobs, seen = [], set()
    for value in cents:
        if value in seen:
            continue
        seen.add(value)
        jobs.append({'id': 'seed20261104-' + str(len(jobs)), 'source': 'componentes',
                     'gross': f'{value // 100}.{value % 100:02d}', 'ss': '1000.00', 'retention': '100.00'})
    (OUT / 'jobs-seed20261104.jsonl').write_text(''.join(json.dumps(job) + '\n' for job in jobs))
    print('GENERATED', len(jobs))


def main():
    parser = argparse.ArgumentParser(description='Reutilización por defecto de evidencia fijada; no verifica frescura del servidor al hacer SKIP.')
    parser.add_argument('--generate', action='store_true')
    parser.add_argument('--fresh', action='store_true', help='Forzar una ejecución nueva aun con evidencia fijada válida')
    parser.add_argument('--limit', type=int, default=1)
    parser.add_argument('--jobs', type=Path, default=None)
    args = parser.parse_args()
    global OUT, STORE, BASE, CHROMIUM
    OUT = directory('C_RUN_DIR')
    STORE = directory('C_CAS_DIR')
    BASE = directory('C_TEMPLATE_DIR')
    OUT.mkdir(parents=True, exist_ok=True)
    STORE.mkdir(parents=True, exist_ok=True)
    if args.jobs is None:
        args.jobs = OUT / 'jobs-pilot.jsonl'
    if args.generate:
        generate()
        return
    if not 1 <= args.limit <= 20:
        raise ValueError('Máximo 20; no se habilita lote masivo')
    CHROMIUM = executable('C_CHROMIUM', 'chromium')
    environment = runtime_identity()
    with global_lock().open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        states = latest_states(read_jsonl(OUT / 'journal.jsonl', repair_tail=True))
        read_jsonl(OUT / 'results.jsonl', repair_tail=True)
        jobs = read_jsonl(args.jobs)
        if len({job['id'] for job in jobs}) != len(jobs):
            raise ValueError('Entradas con identificadores repetidos')
        executed = 0
        for job in jobs:
            if executed >= args.limit:
                break
            if process_job(job, capture_official, environment, states, args.fresh):
                executed += 1
                time.sleep(2)


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, ImportError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(2)
