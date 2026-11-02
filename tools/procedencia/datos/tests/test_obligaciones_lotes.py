"""Integración sintética por la CLI real; no usa Git, red ni corpus privado."""
import copy
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from test_flujo import f

ROOT = Path(__file__).resolve().parents[4]
BASE = "a1be4f9dadacb1fdd1ec0e4b4d8387a39a342dd3"


class Lots(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.cas = self.root / 'cas'
        self.cas.mkdir()
        self.work = self.root / 'work'
        self.work.mkdir()
        self.mapping = self.root / 'mapping.json'
        self.registry = self.root / 'registry.json'
        self.output = self.root / 'manifest.json'

    def fixture(self, code='synthetic-eur', unit='EUR', header='Cuota íntegra euros'):
        doc = f.pymupdf.open()
        page = doc.new_page()
        page.insert_text((20, 30), header)
        page.insert_text((20, 65), '12')
        ref = f.put(self.cas, doc.tobytes(), 'application/pdf')
        doc.close()
        cell = {'row':'0', 'column':'amount', 'bbox':[15,50,80,70], 'unit':unit}
        table = {'code':code, 'year':2025, 'territory':'synthetic',
                 'document':{k:ref[k] for k in ('sha256','size')}, 'page':1, 'cells':[cell]}
        mapping = [copy.deepcopy(table)]
        mapping[0]['cells'][0]['expression'] = None
        table['cells'][0]['unitEvidence'] = {'bbox':[15,15,240,35], 'literal':header, 'unit':unit}
        registry = {'version':1, 'basis':'Synthetic independent physical fixture; no fiscal acceptance.',
                    'tables':[table], 'semantics':{}}
        self.mapping.write_bytes(f.encode(mapping))
        self.registry.write_bytes(f.encode(registry))
        return registry

    def cli(self, *extra, success=True, mapping=True):
        command = [sys.executable, str(ROOT / 'tools/procedencia/datos/flujo.py'),
                   '--repo', str(ROOT), '--base', BASE, '--cas', str(self.cas),
                   '--work', str(self.work), '--output', str(self.output)]
        if mapping:
            command += ['--mapping', str(self.mapping)]
        result = subprocess.run([*command, *extra], capture_output=True, text=True,
                                env={**os.environ, 'PYTHONDONTWRITEBYTECODE':'1'})
        self.assertEqual(result.returncode == 0, success, result.stdout + result.stderr)
        return result

    def pins(self):
        return ['--obligations', str(self.registry), '--obligations-sha256', f.digest(self.registry.read_bytes())]

    def test_two_non_pilot_cli_and_manifest_replay(self):
        for code, unit, header in [('synthetic-eur','EUR','Cuota íntegra euros'),
                                   ('synthetic-percent','percent','Tipo aplicable Porcentaje')]:
            with self.subTest(code=code):
                self.fixture(code, unit, header)
                self.cli(*self.pins())
                raw = self.output.read_bytes()
                manifest = json.loads(raw)
                self.assertEqual(manifest['cells'], {'not-verifiable':1})
                self.assertEqual(manifest['obligationsSelection']['review'], 'pending')
                self.assertEqual(manifest['acceptance'], 'pending')
                self.assertEqual(manifest['obligationsSelection']['expectedSha256'], f.digest(self.registry.read_bytes()))
                saved = self.root / (code + '.json')
                saved.write_bytes(raw)
                # No archivos de selección ni objetos Git: solo manifiesto, CAS y código.
                self.registry.write_bytes(b'selection unavailable')
                self.mapping.write_bytes(b'selection unavailable')
                self.cli('--verify', str(saved), mapping=False)
                self.assertEqual(self.output.read_bytes(), raw)

    def test_selection_and_schema_adversaries(self):
        registry = self.fixture()
        self.cli(success=False)  # Omitir el registro no acepta el mapping ajeno.
        self.cli('--obligations', str(self.registry), success=False)
        self.cli('--obligations-sha256', '0'*64, success=False)
        self.cli('--obligations', str(self.registry), '--obligations-sha256', '0'*64, success=False)
        pins = self.pins()
        altered = copy.deepcopy(registry)
        altered['basis'] += ' replaced'
        self.registry.write_bytes(f.encode(altered))
        self.cli(*pins, success=False)
        self.registry.write_bytes(f.encode(registry))
        self.cli('--obligations', str(self.mapping), '--obligations-sha256', f.digest(self.mapping.read_bytes()), success=False)
        self.cli(*self.pins(), '--mapping', str(self.registry), success=False)
        for key, value in [('year',2024), ('territory','elsewhere'), ('page',2), ('code','transplanted')]:
            changed = copy.deepcopy(registry)
            changed['tables'][0][key] = value
            self.registry.write_bytes(f.encode(changed))
            self.cli(*self.pins(), success=False)
        self.registry.write_bytes(f.encode(registry))
        mapping = json.loads(self.mapping.read_bytes())
        mapping[0]['cells'] = []
        self.mapping.write_bytes(f.encode(mapping))
        self.cli(*self.pins(), success=False)

    def test_header_vocabulary_not_extended_by_registry(self):
        self.fixture(header='Arbitrary euros')
        result = self.cli(*self.pins(), success=False)
        self.assertIn('semántica de cabecera', result.stderr)

    def test_missing_unit_proof_remains_unverified(self):
        registry = self.fixture()
        registry['tables'][0]['cells'][0]['unitEvidence'] = None
        self.registry.write_bytes(f.encode(registry))
        self.cli(*self.pins())
        manifest = json.loads(self.output.read_bytes())
        rows = json.loads(f.Store([self.cas]).read(manifest['artifacts']['comparison']))
        self.assertEqual(rows[0]['reason'], 'source-unit-unproven')

    def test_rehashed_artifacts_and_wrong_code_preimage(self):
        self.fixture()
        self.cli(*self.pins())
        manifest = json.loads(self.output.read_bytes())
        saved = self.root / 'tampered.json'
        changed = copy.deepcopy(manifest)
        changed['codeInputs']['tools/procedencia/datos/flujo.py'] = '0'*64
        saved.write_bytes(f.encode(changed))
        self.assertIn('Preimagen', self.cli('--verify', str(saved), success=False, mapping=False).stderr)
        changed = copy.deepcopy(manifest)
        cells = json.loads(f.Store([self.cas]).read(changed['artifacts']['extraction']))
        cells[0].update(literal='13', normalized='13')
        changed['artifacts']['extraction'] = f.put(self.cas, f.encode(cells))
        changed['cells'] = {'match':1}
        saved.write_bytes(f.encode(changed))
        self.assertIn('Reconstrucción distinta', self.cli('--verify', str(saved), success=False, mapping=False).stderr)
        # Alterar el original bajo el hash esperado tampoco se repara.
        source = json.loads(self.registry.read_bytes())['tables'][0]['document']
        (self.cas / source['sha256']).write_bytes(b'altered original')
        self.cli(*self.pins(), success=False)

    def test_schema_and_semantics_guards(self):
        registry = self.fixture()
        for mutate in [lambda x:x['tables'].append(copy.deepcopy(x['tables'][0])),
                       lambda x:x['tables'][0]['cells'].append(copy.deepcopy(x['tables'][0]['cells'][0])),
                       lambda x:x.update(reviewed=True),
                       lambda x:x['semantics'].update({'invented':{'unit':'EUR','sourceSha256':'0'*64,'quote':'euros'}})]:
            changed = copy.deepcopy(registry)
            mutate(changed)
            self.registry.write_bytes(f.encode(changed))
            self.cli(*self.pins(), success=False)

    def test_pilot_pin_preserved(self):
        registry, raw, selection = f.load_registry(ROOT, None, None)
        self.assertEqual(f.digest(raw), f.OBLIGATIONS_SHA256)
        self.assertEqual(sum(len(t['cells']) for t in registry['tables']), 277)
        self.assertEqual(selection['selection'], 'pilot')


if __name__ == '__main__':
    unittest.main()
