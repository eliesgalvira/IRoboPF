"""Fronteras adicionales y carga del manifiesto histórico, sin reescribirlo."""
import copy
import hashlib
import importlib
import json
from pathlib import Path
import sys
import unittest

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'docs/procedencia/revisiones/preservacion-r21-sol'))
review = importlib.import_module('revisar')
review.old.SCRATCH = ROOT / '.cache/orquestador-recepcion/r23/fixtures-preservacion'
review.old.SCRATCH.mkdir(parents=True, exist_ok=True)
r = review.r


class Politica(unittest.TestCase):
    def test_referencias_no_resueltas_son_conjuntos(self):
        c = review.fixture()
        self.addCleanup(c.doCleanups)
        for duplicate_sources in [False, True]:
            with self.subTest(duplicate_sources=duplicate_sources):
                sources = ['doc.json']
                if duplicate_sources:
                    sources.append('doc.json')
                row = {'sha256': 'f' * 64, 'sources': sources}
                c.m['unresolvedReferences'] = [row] if duplicate_sources else [row, copy.deepcopy(row)]
                c.store()
                with self.assertRaises(ValueError):
                    r.load()

    def test_exclusiones_conservan_multiplicidad_sin_nueva_evidencia(self):
        c = review.fixture()
        self.addCleanup(c.doCleanups)
        row = {'path': 'doc.json', 'reason': 'URL-no-admitida'}
        c.m['exclusions'] = [row, copy.deepcopy(row)]
        c.store()
        manifest, _, _ = r.load()
        self.assertEqual(manifest['exclusions'], [row, row])
        self.assertEqual(len({r.p.encoded(x) for x in manifest['exclusions']}), 1)

    def test_urls_malformadas_no_exponen_valores(self):
        c = review.fixture()
        self.addCleanup(c.doCleanups)
        for url in ['https://www.seg-social.es:PRIVATE_SENTINEL/descarga/es/123',
                    'https://[PRIVATE_SENTINEL/descarga/es/123']:
            with self.subTest(kind='puerto' if ':PRIVATE' in url else 'host'):
                self.assertIsNone(r.url(url))
                c.m['annex'][0]['acquisitions'][0]['finalUrl'] = url
                c.store()
                with self.assertRaises(ValueError) as raised:
                    r.load()
                self.assertNotIn('PRIVATE_SENTINEL', str(raised.exception))


suite = unittest.TestSuite([
    unittest.defaultTestLoader.loadTestsFromTestCase(Politica),
    unittest.defaultTestLoader.loadTestsFromTestCase(review.corrected.ContratoCompleto),
])
result = unittest.TextTestRunner(verbosity=2).run(suite)
assert result.wasSuccessful()
manifest, _, objects = r.load()
raw = (r.HERE / 'manifest.json').read_bytes()
assert hashlib.sha256(raw).hexdigest() == '147e90bf15aa6a82e71b304bd6bd8983983007c2b07ed6e306f1ca244f3ae8be'
assert len(objects) == 945
unique = len({r.p.encoded(x) for x in manifest['exclusions']})
(OUT / 'preservacion-politica.json').write_text(json.dumps({
    'objects': len(objects), 'bytes': sum(x['size'] for x in objects),
    'manifestSha256': hashlib.sha256(raw).hexdigest(),
    'exclusionObservations': len(manifest['exclusions']), 'distinctExclusions': unique,
    'repeatedExclusionObservations': len(manifest['exclusions']) - unique,
    'historicalManifestRewritten': False, 'restoreRepeated': False,
}, indent=2) + '\n')
