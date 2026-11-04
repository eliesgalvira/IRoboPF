"""Regresiones F1–F5. Transporte simulado, validación/persistencia reales; sin red."""
import contextlib
import copy
import io
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
import zlib
from pathlib import Path
from unittest.mock import patch
import os
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia/simuladores'))
import acquire
import compare_engine as comparator
import contract
import evidence
import run
import storage
import verify

if not os.environ.get('C_PRIVATE_ORIGINALS'):
    print('SKIP explícito: suite privada requiere C_PRIVATE_ORIGINALS; CI usa simuladores-test.py')
    raise SystemExit(0)
SRC = Path(os.environ['C_PRIVATE_ORIGINALS'])
ROOT = Path(__file__).resolve().parents[1] / 'tools/procedencia/simuladores'
run.BASE = Path(os.environ['C_TEMPLATE_DIR'])
run.STORE = Path(os.environ['C_CAS_DIR'])
ROWS = storage.read_jsonl(SRC / 'results.jsonl')
JOB = storage.read_jsonl(SRC / 'jobs-pilot.jsonl')[0]
PILOT = copy.deepcopy(ROWS[-1])
PILOT.update(bootstrap=json.loads((SRC / 'versions-visible.json').read_text())[0]['body'], visibleVersion='1.19')
SAMPLE = contract.decode(storage.read_ref(ROWS[0]['ses']))
LINE = next(x for x in SAMPLE.splitlines(True) if re.match(r'^\s*RESULTADO~', x))


def parse(text):
    return contract.parse(zlib.compress(text.encode('latin1')))['fields']


def pdf(lines):
    # Documento sintético mínimo válido; nunca se presenta como evidencia oficial.
    stream = ('BT /F1 10 Tf 40 760 Td ' + ' 0 -18 Td '.join('(' + line + ') Tj' for line in lines) + ' ET').encode()
    parts = [b'<< /Type /Catalog /Pages 2 0 R >>', b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
             b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
             b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
             b'<< /Length ' + str(len(stream)).encode() + b' >>\nstream\n' + stream + b'\nendstream']
    data, offsets = b'%PDF-1.4\n', []
    for i, part in enumerate(parts, 1):
        offsets.append(len(data))
        data += str(i).encode() + b' 0 obj\n' + part + b'\nendobj\n'
    xref = len(data)
    return data + b'xref\n0 6\n0000000000 65535 f \n' + b''.join(f'{o:010} 00000 n \n'.encode() for o in offsets) + b'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + str(xref).encode() + b'\n%%EOF\n'


class ParserTests(unittest.TestCase):
    def test_all_originals(self):
        for row in ROWS:
            with self.subTest(row=row['id']):
                evidence.validate_result(row)
        self.assertEqual(len(ROWS), 16)

    def test_outside_irpf_is_not_consumed(self):
        text = SAMPLE.replace(LINE, '').replace('  [RESUMEN]\n', '  [RESUMEN]\n' + LINE)
        self.assertIsNone(parse(text).get('RESULTADO'))

    def test_malformed_and_ambiguous(self):
        mutations = {
            'year': SAMPLE.replace('[IRPF2025]', '[IRPF2024]'),
            'duplicate_type3_owner': SAMPLE.replace('TITULAR~1~DECLARANTE', 'TITULAR~1~DECLARANTE\n   TITULAR~3~CONYUGE'),
            'unknown_type': SAMPLE.replace(LINE, LINE.replace('~1~', '~9~')),
            'extra_separator': SAMPLE.replace(LINE, '   RESULTADO~1~1.00~residuo\n'),
            'duplicate_indv': SAMPLE.replace(' INDV~1~true', ' INDV~1~false\n INDV~1~true'),
            'duplicate_result': SAMPLE.replace(LINE, LINE + LINE),
            'conjugue': SAMPLE.replace('TITULAR~1~DECLARANTE', 'TITULAR~1~CONYUGE'),
            'tail_records': SAMPLE + '\n   RESULTADO~1~2575.26\n',
            'duplicate_da61': contract.decode(storage.read_ref(PILOT['ses'])).replace('   IDICLDED2~1~17000.41', '   IDICLDED2~1~999\n   IDICLDED2~1~17000.41'),
        }
        for name, text in mutations.items():
            with self.subTest(name=name), self.assertRaises(ValueError):
                parse(text)

    def test_absence_and_exact_decimal(self):
        self.assertIsNone(parse(SAMPLE.replace(LINE, LINE.replace('~1~', '~2~'))).get('RESULTADO'))
        self.assertTrue(contract.compare({'RESULTADO': '1.0'}, {'RESULTADO': '1.00'})['0670']['equal'])
        self.assertFalse(contract.compare({'RESULTADO': '1.0'}, {'RESULTADO': '1.01'})['0670']['equal'])
        self.assertFalse(contract.compare({}, {'CLDED2': '0'})['0414']['equal'])
        self.assertFalse(contract.compare({}, {})['0414']['monetaryComparison'])
        for bad in ('', 'NaN', '1e2', '1,00'):
            with self.subTest(value=bad), self.assertRaises(ValueError):
                contract.monetary(bad)

    def test_container_and_expected_year(self):
        data = storage.read_ref(PILOT['ses'])
        for bad in (data[:-2], data + data):
            with self.assertRaises(ValueError):
                contract.parse(bad)
        with self.assertRaises(ValueError):
            contract.parse(data, expected_year=2024)


class TempCase(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='c-regression-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)


class LocalTests(TempCase):
    def test_empty_cli_is_incomplete(self):
        a, b = self.root / 'official.json', self.root / 'engine.json'
        a.write_text('{"fields":{}}')
        b.write_text('{"monetario":{}}')
        p = subprocess.run([sys.executable, str(ROOT / 'compare_engine.py'), str(a), str(b)], capture_output=True, timeout=30)
        self.assertEqual(p.returncode, 2)
        result = json.loads(p.stdout)
        self.assertEqual(result['state'], 'incompleto')
        self.assertEqual(result['counts']['equal'], 0)
        self.assertGreater(result['counts']['missingRequired'], 0)

    def test_comparison_requires_profile_and_projection(self):
        row = PILOT
        engine = {'id': row['id'], 'ejercicio': 2025, 'perfil': comparator.PROFILE,
                  'motor': {'commit': 'a' * 40, 'sourcesSha256': 'b' * 64},
                  'monetario': {name: row['fields'][contract.MAP[box]] for box, name in comparator.SCALARS.items() if row['fields'][contract.MAP[box]] is not None}}
        self.assertEqual(comparator.assess(row, engine)['state'], 'incompleto')
        wrong = copy.deepcopy(engine)
        wrong['monetario']['cuotaDiferencialPresentada'] = '-721.22'
        self.assertEqual(comparator.assess(row, wrong)['state'], 'discrepante')
        for field in ('id', 'ejercicio', 'perfil', 'motor'):
            incomplete = copy.deepcopy(engine)
            incomplete.pop(field)
            self.assertEqual(comparator.assess(row, incomplete)['state'], 'incompleto')
        incomplete = copy.deepcopy(engine)
        incomplete['monetario'].pop('cuotaPosterior')
        self.assertEqual(comparator.assess(row, incomplete)['state'], 'incompleto')
        for bad in ('NaN', None, '1e2'):
            incomplete['monetario']['unused'] = bad
            with self.assertRaises(ValueError):
                comparator.assess(row, incomplete)

    def test_cas_integrity(self):
        ref = storage.put_blob(self.root, b'evidencia valida')
        self.assertEqual(storage.read_ref(ref), b'evidencia valida')
        self.assertEqual(storage.put_blob(self.root, b'evidencia valida'), ref)
        Path(ref['path']).write_bytes(b'evidencia falsa!')
        with self.assertRaises(ValueError):
            storage.put_blob(self.root, b'evidencia valida')
        with self.assertRaises(ValueError):
            storage.read_ref(ref)
        self.assertEqual(list(self.root.glob('.pending-*')), [])

    def test_tail_recovery_preserves_bytes(self):
        path = self.root / 'journal.jsonl'
        good = {'key': 'a' * 64, 'status': 'started'}
        storage.append_jsonl(path, good)
        with path.open('ab') as stream:
            stream.write(b'{"key":')
        rows = storage.read_jsonl(path, repair_tail=True)
        self.assertEqual(rows[0], good)
        self.assertEqual(storage.read_ref(rows[-1]['artifact']), b'{"key":')
        self.assertEqual(storage.latest_states(rows)['a' * 64], good)
        self.assertEqual(storage.read_jsonl(path, repair_tail=True), rows)
        storage.append_jsonl(path, dict(good, status='error'))
        self.assertEqual(storage.latest_states(storage.read_jsonl(path))['a' * 64]['status'], 'error')

    def test_middle_or_terminated_corruption_rejected(self):
        path = self.root / 'journal.jsonl'
        for payload in (b'{"key":\n{}\n', b'{"key":\n', b'[]'):
            path.write_bytes(payload)
            with self.assertRaises(ValueError):
                storage.read_jsonl(path, repair_tail=True)
            self.assertEqual(path.read_bytes(), payload)

    def test_complete_last_record_without_newline(self):
        path = self.root / 'journal.jsonl'
        path.write_bytes(b'{"x":1}')
        self.assertEqual(storage.read_jsonl(path, repair_tail=True), [{'x': 1}])
        storage.append_jsonl(path, {'x': 2})
        self.assertEqual(storage.read_jsonl(path), [{'x': 1}, {'x': 2}])

    def test_pdf_missing_boxes_wrong_year_conflicts(self):
        values = PILOT['fields']
        lines = ['Ejercicio 2025'] + [values[key].replace('.', ',') + ' ' + box for box, key in contract.MAP.items() if values.get(key) is not None]
        evidence.verify_pdf(pdf(lines), values, 2025)
        cases = [(['Ejercicio 2024'], 'Ejercicio'), (['Ejercicio 2025'], 'sin correspondencia|Casilla'),
                 (lines + ['-721,22 0670'], 'Discrepancia'),
                 (['Ejercicio 2024'] + lines, 'Ejercicio')]
        for text, message in cases:
            with self.subTest(message=message), self.assertRaisesRegex(ValueError, message):
                evidence.verify_pdf(pdf(text), values, 2025)

    def test_acquire_cache_is_checked(self):
        url = 'https://www2.agenciatributaria.gob.es/test'
        ref = storage.put_blob(self.root / 'cas', b'fixed')
        storage.append_jsonl(self.root / 'acquisitions.jsonl', {'url': url, 'status': 200, 'artifact': ref})
        with patch.object(acquire, 'OUT', self.root), patch.object(acquire.urllib.request, 'urlopen', side_effect=AssertionError('No network')):
            self.assertEqual(acquire.fetch(url)[0]['reuse'], 'historical-fixed')
            Path(ref['path']).write_bytes(b'wrong')
            with self.assertRaises(ValueError):
                acquire.fetch(url)


class RunnerTests(TempCase):
    def setUp(self):
        super().setUp()
        for name in run.CODE_FILES:
            shutil.copyfile(ROOT / name, self.root / name)
        self.out_patch = patch.object(run, 'OUT', self.root)
        self.out_patch.start()
        self.source_patch = patch.object(run, 'SOURCE', self.root)
        self.source_patch.start()
        self.addCleanup(self.source_patch.stop)
        self.addCleanup(self.out_patch.stop)
        self.env = {'fixture': 'offline-only'}

    def process(self, row=PILOT, **kwargs):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            result = run.process_job(JOB, lambda _: copy.deepcopy(row), self.env, **kwargs)
        return result, output.getvalue()

    def test_done_and_validated_historical_skip(self):
        self.assertTrue(self.process()[0])
        with patch.object(run, 'capture_official', side_effect=AssertionError('No browser')):
            self.assertFalse(self.process()[0])
        self.assertIn('historical-fixed', self.process()[1])
        self.assertEqual(len(storage.read_jsonl(self.root / 'results.jsonl')), 1)
        self.assertEqual(verify.verify(self.root / 'journal.jsonl', journal=True)['executions'], 1)

    def test_skip_missing_and_corrupt_evidence_rejected(self):
        self.process()
        original = storage.read_jsonl(self.root / 'journal.jsonl')
        for kind in ('missing', 'corrupt'):
            records = copy.deepcopy(original)
            target = self.root / kind
            if kind == 'corrupt':
                target.write_bytes(b'corrupt')
            records[-1]['result']['pdf']['path'] = str(target)
            (self.root / 'journal.jsonl').write_bytes(b''.join(storage.canonical(row) + b'\n' for row in records))
            with self.assertRaises(ValueError):
                self.process()

    def test_invalid_pdf_never_done(self):
        for content in (b'not PDF', pdf(['Ejercicio 2024']), pdf(['Ejercicio 2025'])):
            row = copy.deepcopy(PILOT)
            row['pdf'] = storage.put_blob(self.root / 'cas', content)
            with self.assertRaisesRegex(ValueError, 'PDF|Ejercicio|Casilla|correspondencia'):
                self.process(row)
        self.assertFalse(any(r['status'] == 'done' for r in storage.read_jsonl(self.root / 'journal.jsonl')))
        self.assertFalse((self.root / 'results.jsonl').exists())

    def test_last_state_error_or_started_retries(self):
        self.process()
        key, stamp = run.identity(JOB, self.env)
        for status in ('error', 'started'):
            storage.append_jsonl(self.root / 'journal.jsonl', {'key': key, 'status': status})
            self.assertTrue(self.process()[0])
        self.assertEqual(len(storage.read_jsonl(self.root / 'results.jsonl')), 3)

    def test_orphan_result_and_partial_journal_retry(self):
        self.process()
        rows = storage.read_jsonl(self.root / 'journal.jsonl')
        (self.root / 'journal.jsonl').write_bytes(storage.canonical(rows[0]) + b'\n{"key":')
        self.assertTrue(self.process()[0])
        self.assertEqual(len(storage.read_jsonl(self.root / 'results.jsonl')), 2)

    def test_code_change_requires_restart_and_changes_identity(self):
        key, _ = run.identity(JOB, self.env)
        for name in run.CODE_FILES:
            path = self.root / name
            original = path.read_bytes()
            path.write_bytes(original + b'\n# changed\n')
            with self.assertRaisesRegex(ValueError, 'reiniciar'):
                run.identity(JOB, self.env)
            with patch.object(run, 'LOADED_CODE', {n: storage.digest((self.root / n).read_bytes()) for n in run.CODE_FILES}):
                self.assertNotEqual(key, run.identity(JOB, self.env)[0])
            path.write_bytes(original)
        self.assertNotEqual(key, run.identity(JOB, {'fixture': 'other'})[0])

    def test_fresh_forces_new_capture(self):
        self.process()
        self.assertTrue(self.process(fresh=True)[0])
        self.assertEqual(len(storage.read_jsonl(self.root / 'results.jsonl')), 2)

    def test_launcher_changed_during_skip_is_rejected(self):
        self.process()
        validate = run.validate_result

        def change_after_validation(*args):
            result = validate(*args)
            (self.root / 'launch.sh').write_text('# cambio solo en fixture\n')
            return result

        with patch.object(run, 'validate_result', side_effect=change_after_validation):
            with self.assertRaisesRegex(ValueError, 'reiniciar'):
                self.process()
        self.assertEqual(len(storage.read_jsonl(self.root / 'results.jsonl')), 1)

    def test_seed_bytes_unchanged(self):
        with contextlib.redirect_stdout(io.StringIO()):
            run.generate()
        self.assertEqual((self.root / 'jobs-seed20261104.jsonl').read_bytes(), (SRC / 'jobs-seed20261104.jsonl').read_bytes())
        self.assertEqual(len({j['gross'] for j in storage.read_jsonl(self.root / 'jobs-seed20261104.jsonl')}), 2020)


if __name__ == '__main__':
    unittest.main(verbosity=2)
