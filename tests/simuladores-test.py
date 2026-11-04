"""Fixtures sintéticos, sin corpus privado ni red. Operador real separado de mock."""
import copy
import json
import os
import subprocess
import sys
import tempfile
import unittest
import zlib
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia/simuladores'))
import config
import contract
import binding
import compare_engine
import storage
import run
import offline

ROOT = Path(__file__).resolve().parents[1]
SYNTHETIC = '''<?xml CodModelo="100" EjModelo="2025" VersionReglas="N1" VersionModelo="0.12"?><PERSISTENCIAV2>
[DECLARACIONES]
 INDV~1~true
  [DP]
   EDADD~1~40
   DPFNAC_D~1~01/01/1985
   CAD_D~1~MADRID
   CAC_D~1~12
  [IRPF2025]
   TITULAR~1~DECLARANTE
   ZCCAD~1~12
   ZFNAC_D~1~01/01/1985
   RESULTADO~1~1.00
    [ATRABAJO]
      [DLGTRABAJO]
       IDII~1~17000.42
       GSS~1~1000.00
       IDRE~1~1000.00
</PERSISTENCIAV2>'''


def ses(text=SYNTHETIC):
    return zlib.compress(text.encode('latin1'))


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


class Portable(unittest.TestCase):
    def test_reference_binding_preserves_all_expenses(self):
        refs = json.loads((ROOT / 'docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json').read_text())
        original = refs[5]['entrada']
        text = SYNTHETIC
        for key, value in [('IDII', '30000.00'), ('GSS', '2000.00'), ('IDRE', '3000.00')]:
            text = __import__('re').sub(key+r'~1~[^\n]+', key+'~1~'+value, text)
        text = text.replace('       IDRE~1~3000.00', '       IDRE~1~3000.00\n       GCS~1~100.00\n       GCC~1~600.00\n       GDJ~1~400.00')
        selected = offline.select_input(ses(text), refs)
        self.assertEqual(selected, original)

    def test_parser_scope_types_and_duplicates(self):
        self.assertEqual(contract.parse(ses(), 2025)['fields']['RESULTADO'], '1.00')
        for text in [SYNTHETIC.replace('IRPF2025', 'IRPF2024'), SYNTHETIC.replace('RESULTADO~1~1.00', 'RESULTADO~9~1.00'), SYNTHETIC.replace('RESULTADO~1~1.00', 'RESULTADO~1~1.00\n   RESULTADO~1~1.00')]:
            with self.assertRaises(ValueError): contract.parse(ses(text), 2025)
        with self.assertRaises(ValueError): contract.parse(ses() + ses())

    def test_absence_is_not_money_and_cent_is_difference(self):
        self.assertFalse(contract.compare({}, {})['0414']['monetaryComparison'])
        self.assertFalse(contract.compare({'RESULTADO': '1'}, {'RESULTADO': '1.01'})['0670']['equal'])
        self.assertEqual(compare_engine.assess({}, {})['state'], 'incompleto')

    def test_external_config_and_missing_tool(self):
        with patch.dict(os.environ, {'C_RUN_DIR': str(config.SOURCE)}, clear=True):
            with self.assertRaises(ValueError): config.directory('C_RUN_DIR')
        with patch.dict(os.environ, {'C_BUN': '/definitely/missing'}):
            with self.assertRaisesRegex(ValueError, 'C_BUN'): config.executable('C_BUN', 'bun')

    def test_all_personal_keys_require_one_complete_record(self):
        entry = json.loads((ROOT / 'docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json').read_text())[3]['entrada']
        self.assertEqual(binding.bind(ses(), entry)['state'], 'incompleto')
        for key in binding.PERSONAL_SCOPES:
            line = next(line for line in SYNTHETIC.splitlines() if line.startswith('   ' + key + '~'))
            for bad in (key + '~9~99', key + '~1~99~residuo', key + '~2~', key + '~3~99', key + '~1~', key, key + ' ~1~99'):
                for replacement in ('   ' + bad, line + '\n   ' + bad):
                    with self.subTest(key=key, bad=bad, duplicate=replacement.startswith(line)), self.assertRaises(ValueError):
                        binding.bind(ses(SYNTHETIC.replace(line, replacement)), entry)
            for replacement in (line + '\n' + line, '', line.lstrip()):
                with self.subTest(key=key, replacement=replacement), self.assertRaises(ValueError):
                    binding.bind(ses(SYNTHETIC.replace(line, replacement)), entry)

    def test_personal_scope_ends_at_shallower_record(self):
        changed = SYNTHETIC.replace('   EDADD~1~40', ' OTRO~1~false\n   EDADD~1~40')
        with self.assertRaisesRegex(ValueError, 'ámbito'):
            binding.personal(ses(changed))

    def test_external_config_resolves_links_and_dotdot(self):
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, {}, clear=True):
            root = Path(tmp)
            alias = root / 'source-alias'
            alias.symlink_to(config.SOURCE, target_is_directory=True)
            checkout = root / 'checkout-alias'
            checkout.symlink_to(ROOT, target_is_directory=True)
            for name in config.DIRECTORIES:
                for path in (alias, alias / 'new', alias / '..' / 'other', checkout / 'new-state', ROOT, ROOT.parent):
                    with self.subTest(name=name, path=path), patch.dict(os.environ, {name: str(path)}), self.assertRaises(ValueError):
                        config.directory(name)
                with self.subTest(name=name), patch.dict(os.environ, {name: 'relative'}), self.assertRaises(ValueError):
                    config.directory(name)
            target = root / 'outside'
            target.mkdir()
            link = root / 'outside-alias'
            link.symlink_to(target, target_is_directory=True)
            with patch.dict(os.environ, {'C_RUN_DIR': str(link / 'new')}):
                self.assertEqual(config.directory('C_RUN_DIR'), target / 'new')

    def test_configured_directories_are_disjoint(self):
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, {}, clear=True):
            root = Path(tmp)
            for left in config.DIRECTORIES:
                for right in config.DIRECTORIES:
                    if left == right:
                        continue
                    for path in (root / 'state', root / 'state' / 'nested'):
                        with self.subTest(left=left, right=right, path=path), patch.dict(os.environ, {left: str(root / 'state'), right: str(path)}), self.assertRaises(ValueError):
                            config.directory(left)
            values = {name: str(root / name) for name in config.DIRECTORIES}
            with patch.dict(os.environ, values):
                for name, path in values.items():
                    self.assertEqual(config.directory(name), Path(path))

    def test_launcher_change_invalidates_loaded_and_restarted_identity(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in run.CODE_FILES:
                (root / name).write_bytes((config.SOURCE / name).read_bytes())
            data = ses()
            (root / 'da61.ses').write_bytes(data)
            job = {'id': 'launcher', 'source': 'da61', 'gross': '17000.42', 'ss': '1000.00', 'retention': '1000.00'}
            with patch.object(run, 'SOURCE', root), patch.object(run, 'BASE', root), patch.object(run, 'STORE', root / 'cas'), patch.object(run, 'TEMPLATES', {'da61': storage.digest(data)}):
                before, stamp = run.identity(job, {'fixture': 'offline'})
                self.assertIn('launch.sh', stamp['code'])
                (root / 'launch.sh').write_text('# timeout retirado solo en fixture\n')
                with self.assertRaisesRegex(ValueError, 'reiniciar'):
                    run.identity(job, {'fixture': 'offline'})
                changed = {name: storage.digest((root / name).read_bytes()) for name in run.CODE_FILES}
                with patch.object(run, 'LOADED_CODE', changed):
                    self.assertNotEqual(before, run.identity(job, {'fixture': 'offline'})[0])

    def test_cas_corruption_and_journal_last_state(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            ref = storage.put_blob(root, b'synthetic')
            self.assertEqual(storage.read_ref(ref), b'synthetic')
            Path(ref['path']).write_bytes(b'corrupt')
            with self.assertRaises(ValueError): storage.put_blob(root, b'synthetic')
            journal = root / 'journal'
            storage.append_jsonl(journal, {'key': 'a'*64, 'status': 'done'})
            with journal.open('ab') as stream: stream.write(b'{"partial":')
            rows = storage.read_jsonl(journal, repair_tail=True)
            self.assertEqual(storage.read_ref(rows[-1]['artifact']), b'{"partial":')
            storage.append_jsonl(journal, {'key': 'a'*64, 'status': 'error'})
            self.assertEqual(storage.latest_states(storage.read_jsonl(journal))['a'*64]['status'], 'error')
            journal.write_bytes(b'{bad}\n{}\n')
            with self.assertRaises(ValueError): storage.read_jsonl(journal, repair_tail=True)

    def test_binding_discriminants_and_pending_facts(self):
        entry = json.loads((ROOT / 'docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json').read_text())[3]['entrada']
        self.assertEqual(binding.bind(ses(), entry)['state'], 'incompleto')
        for key, value in [('edad', 41), ('ejercicio', 2024), ('comunidadAutonoma', 'galicia'), ('modalidad', 'conjunta')]:
            changed = dict(entry, **{key: value})
            with self.assertRaises(ValueError): binding.bind(ses(), changed)
        for field in ['IDII', 'GSS', 'IDRE']:
            text = SYNTHETIC.replace(next(line for line in SYNTHETIC.splitlines() if field+'~' in line), '       '+field+'~1~100.01')
            with self.assertRaises(ValueError): binding.bind(ses(text), entry)
        with self.assertRaises(ValueError): binding.bind(ses(), entry, b'unknown template')
        with self.assertRaisesRegex(ValueError, 'añadida'):
            binding.bind(ses(SYNTHETIC.replace('   RESULTADO', '   NUEVOHECHO~1~true\n   RESULTADO')), entry)

    def test_seed_serial_limit(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(run, 'OUT', Path(tmp)):
            run.generate()
            jobs = storage.read_jsonl(Path(tmp) / 'jobs-seed20261104.jsonl')
            self.assertEqual(len({r['gross'] for r in jobs}), 2020)

    def test_synthetic_transport_validation_and_resume(self):
        # Transporte mock explícito; parser, PDF, CAS, journal y operador reales.
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            text = SYNTHETIC.replace('VersionReglas="N1"', 'VersionReglas="N000088955"')
            additions = ''.join('   '+key+'~1~1.00\n' for key in contract.MAP.values() if key != 'RESULTADO')
            additions += '   IDICLDED2~1~17000.42\n   GSSCLDED2~1~1000.00\n'
            text = text.replace('   RESULTADO', additions+'   RESULTADO')
            data = ses(text)
            (root / 'da61.ses').write_bytes(data)
            parsed = contract.parse(data)
            fields = {k: parsed['fields'].get(k) for k in contract.OUTPUT_KEYS}
            row = {'id': 'synthetic', 'ses': storage.put_blob(root/'cas', data),
                   'summary': storage.put_blob(root/'cas', b'synthetic diagnostic'),
                   'bootstrap': storage.put_blob(root/'cas', b"id:'txtVersion',value:'1.19 (OPEN)'"),
                   'visibleVersion': '1.19', 'version': parsed['metadata']['header'], 'fields': fields}
            lines = ['Ejercicio 2025'] + [fields[k].replace('.', ',')+' '+box for box, k in contract.MAP.items()]
            row['pdf'] = storage.put_blob(root/'cas', pdf(lines))
            job = {'id': 'synthetic', 'source': 'da61', 'gross': '17000.42', 'ss': '1000.00', 'retention': '1000.00'}
            with patch.object(run, 'OUT', root), patch.object(run, 'STORE', root/'cas'), patch.object(run, 'BASE', root), patch.object(run, 'TEMPLATES', {'da61': storage.digest(data)}):
                self.assertTrue(run.process_job(job, lambda _: copy.deepcopy(row), {'mock': 'synthetic'}))
                self.assertFalse(run.process_job(job, lambda _: self.fail('No recapture'), {'mock': 'synthetic'}))
                corrupt = copy.deepcopy(row)
                corrupt['pdf'] = storage.put_blob(root/'cas', b'invalid PDF')
                with self.assertRaises(ValueError): run.process_job(job, lambda _: corrupt, {'mock': 'synthetic'}, fresh=True)
                self.assertEqual(list(storage.latest_states(storage.read_jsonl(root/'journal.jsonl')).values())[0]['status'], 'error')
                self.assertTrue(run.process_job(job, lambda _: copy.deepcopy(row), {'mock': 'synthetic'}))

    def test_real_operator_and_rejection(self):
        entries = json.loads((ROOT / 'docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json').read_text())
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'inputs.json'
            good = entries[3]['entrada']
            other = copy.deepcopy(good)
            other['retenciones'][0]['importe'] = '100.01'
            path.write_text(json.dumps([good, other, dict(good, extra=True)]))
            result = subprocess.run([config.executable('C_BUN', 'bun'), str(config.SOURCE / 'engine.mjs'), str(path)], capture_output=True, timeout=240)
            self.assertEqual(result.returncode, 2, result.stderr)
            receipt = json.loads(result.stdout)
            a, b, rejected = receipt['results']
            self.assertEqual(rejected['state'], 'rechazado')
            self.assertNotEqual(a['inputSha256'], b['inputSha256'])
            self.assertEqual(a['monetario']['cuotaPosterior'], b['monetario']['cuotaPosterior'])
            self.assertNotEqual(a['monetario']['cuotaDiferencial'], b['monetario']['cuotaDiferencial'])
            self.assertEqual(receipt['motor']['before'], receipt['motor']['after'])


if __name__ == '__main__': unittest.main(verbosity=2)
