"""Adversos independientes sintéticos. Conserva las aserciones que detectaron los defectos."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / 'tools/procedencia/datos/tests'))
import test_unidades_enlaces as units  # noqa: E402
from test_flujo import f  # noqa: E402


class Review(unittest.TestCase):
    def setUp(self):
        self.u = units.Units()
        self.u.setUp()
        self.addCleanup(self.u.doCleanups)

    def test_external_pin_survives_consistent_forgery(self):
        r, key = self.u.registry()
        pins = self.u.fixture.pins()
        r['tables'][0]['cells'][0]['conditions'] = 'forged'
        r['semantics'][key]['targets'][0]['conditions'] = 'forged'
        m = json.loads(self.u.fixture.mapping.read_bytes())
        m[0]['cells'][0]['conditions'] = 'forged'
        self.u.fixture.mapping.write_bytes(f.encode(m))
        self.u.save(r)
        result = self.u.fixture.cli(*pins, success=False)
        self.assertIn('SHA256 esperado', result.stderr)
        # With a NEW externally supplied pin this is only a candidate declaration.
        self.u.fixture.cli(*self.u.fixture.pins())
        manifest = json.loads(self.u.fixture.output.read_bytes())
        self.assertEqual(manifest['acceptance'], 'pending')

    def test_same_value_other_property_and_utf16(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            resolver = root / 'tools/procedencia/datos/binding-position.mjs'
            resolver.parent.mkdir(parents=True)
            resolver.write_bytes((ROOT/'tools/procedencia/datos/binding-position.mjs').read_bytes())
            source = root / 'fixture.ts'
            source.write_text('// 😀\nexport const DATA = {a:"12", b:"12"}\n')
            def position(key):
                return json.loads(subprocess.check_output(['bun', str(ROOT/'tools/procedencia/datos/binding-position.mjs'),str(source),'DATA',json.dumps([key])]))
            a, b = position('a'), position('b')
            self.assertNotEqual(a['start'], b['start'])
            self.assertEqual(a['quote'], b['quote'])
            text = source.read_text()
            self.assertEqual(a['start'], len(text[:text.index('"12"')].encode('utf-16-le')) // 2)
            binding = {'file':'fixture.ts','symbol':'DATA','path':['a']}
            proof = {'unit':'EUR','sourceSha256':f.digest(source.read_bytes()),'quote':b.pop('quote'),'position':b}
            with self.assertRaisesRegex(ValueError,'Posición/propiedad'):
                f.expression_unit({'binding':binding},{f.encode(binding).decode().strip():proof},root)

    def test_divergent_helper_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp)/'fixture.ts'
            source.write_text('const id = (x) => ({a:"99"}); export const DATA = id({a:"12"})')
            result = subprocess.run(['bun',str(ROOT/'tools/procedencia/datos/binding-position.mjs'),str(source),'DATA','["a"]'],capture_output=True)
            self.assertNotEqual(result.returncode,0)

    def test_async_helper_is_not_identity(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp)/'fixture.ts'
            source.write_text('const id = async (x) => x; export const DATA = id({a:"12"})')
            result = subprocess.run(['bun',str(ROOT/'tools/procedencia/datos/binding-position.mjs'),str(source),'DATA','["a"]'],capture_output=True)
            self.assertNotEqual(result.returncode,0, 'async devuelve Promise; el resolver no debe acreditar DATA.a')

    def test_padded_foreign_header_rejected(self):
        r, _ = self.u.registry()
        doc = f.pymupdf.open()
        page = doc.new_page()
        page.insert_text((220,30), 'Tasa (%)')
        page.insert_text((20,65), '0,3')
        ref = f.put(self.u.fixture.cas, doc.tobytes(), 'application/pdf')
        doc.close()
        ref = {k:ref[k] for k in ('sha256','size')}
        r['tables'][0]['document'] = ref
        r['tables'][0]['cells'][0]['unitEvidence']['bbox'] = [15,15,300,35]
        m = json.loads(self.u.fixture.mapping.read_bytes())
        m[0]['document'] = ref
        self.u.fixture.mapping.write_bytes(f.encode(m))
        self.u.save(r)
        self.u.fixture.cli(*self.u.fixture.pins(), success=False)

    def test_wrong_scale_is_not_match(self):
        r, _ = self.u.registry()
        expression = r['tables'][0]['cells'][0]['engineExpression']['args'][0]
        r['tables'][0]['cells'][0]['engineExpression'] = expression
        m = json.loads(self.u.fixture.mapping.read_bytes())
        m[0]['cells'][0]['expression'] = expression
        self.u.fixture.mapping.write_bytes(f.encode(m))
        self.u.save(r)
        self.u.fixture.cli(*self.u.fixture.pins())
        manifest = json.loads(self.u.fixture.output.read_bytes())
        self.assertEqual(manifest['cells'], {'not-verifiable':1})

    def test_unknown_dimensions_remain_candidate(self):
        binding = {'file':'synthetic.ts','symbol':'UNKNOWN','path':['a']}
        items = [{'layer':'effective','source':{'file':'synthetic.ts'},'symbol':'UNKNOWN','path':'["a"]','value':'12','years':[], 'territories':[], 'unit':'unknown'}]
        f.validate_engine_scope({'binding':binding},items,{'year':2099,'territory':'candidate'}, {f.encode(binding).decode().strip():{'unit':'EUR'}})


if __name__ == '__main__':
    unittest.main()
