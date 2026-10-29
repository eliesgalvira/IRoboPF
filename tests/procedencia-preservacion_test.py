"""Ensayos de preservación; fixtures explícitamente sintéticos, nunca oficiales."""
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia'))
import preservacion as p


class PreservationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'source').mkdir()
        original = self.root / 'source/a'
        original.write_bytes(b'fixture-sintetico')
        self.blob = {**p.fingerprint(original), 'sources': ['source/a']}
        self.manifest = self.root / 'manifest.json'
        self.manifest.write_bytes(p.encoded({'version': 1, 'acceptance': 'ninguna',
            'bytes': self.blob['size'], 'blobs': [self.blob]}))

    def test_plan_stable_sanitized_and_versions(self):
        cache = self.root / '.cache/procedencia'
        (cache / 'sha256').mkdir(parents=True)
        (cache / 'urls').mkdir()
        for index, data in enumerate([b'primera', b'segunda']):
            temp = self.root / 'document'
            temp.write_bytes(data)
            facts = p.fingerprint(temp)
            (cache / 'sha256' / facts['sha256']).write_bytes(data)
            record = {**facts, 'canonicalUrl': 'https://www.boe.es/documento',
                      'finalUrl': 'https://www.boe.es/documento', 'httpStatus': 200,
                      'retrievedAt': '2026-10-29T10:00:00+00:00',
                      'headers': {'Set-Cookie': 'PRIVATE_SENTINEL'}}
            (cache / 'urls' / f'{index}.json').write_text(json.dumps(record))
        first = p.plan(self.root)
        self.assertEqual(len(first['blobs']), 2)
        self.assertEqual(p.encoded(first), p.encoded(p.plan(self.root)))
        self.assertNotIn(b'PRIVATE_SENTINEL', p.encoded(first))
        self.assertNotIn(b'Set-Cookie', p.encoded(first))

    def test_export_restore(self):
        p.transfer(self.manifest, self.root, self.root / 'export')
        p.transfer(self.manifest, self.root / 'export', self.root / 'restore', True)
        self.assertEqual(p.verify(self.manifest, self.root / 'restore')['objects'], 1)
        self.assertNotEqual((self.root / 'source/a').stat().st_ino,
            (self.root / 'restore/sha256' / self.blob['sha256']).stat().st_ino)

    def test_tamper_no_manifest(self):
        (self.root / 'source/a').write_bytes(b'alterado')
        with self.assertRaises(ValueError):
            p.transfer(self.manifest, self.root, self.root / 'bad')
        self.assertFalse((self.root / 'bad/manifest.json').exists())

    def test_absence_no_manifest(self):
        (self.root / 'source/a').unlink()
        with self.assertRaises(FileNotFoundError):
            p.transfer(self.manifest, self.root, self.root / 'bad')
        self.assertFalse((self.root / 'bad/manifest.json').exists())

    def test_no_overwrite(self):
        p.publish(self.root / 'immutable', b'a')
        with self.assertRaises(FileExistsError):
            p.publish(self.root / 'immutable', b'b')
        self.assertEqual((self.root / 'immutable').read_bytes(), b'a')

    def test_path_escape_and_symlink(self):
        with self.assertRaises(ValueError):
            p.safe_source(self.root, '../outside')
        (self.root / 'link').symlink_to(self.root / 'source/a')
        with self.assertRaises(ValueError):
            p.safe_source(self.root, 'link')

    def test_private_url(self):
        for url in ['https://www.boe.es/a?token=secret',
                    'https://user:secret@www.boe.es/a', 'https://example.org/a']:
            self.assertIsNone(p.public_url(url))

    def test_duplicate_hash(self):
        value = json.loads(self.manifest.read_text())
        value['blobs'].append(self.blob)
        with self.assertRaises(ValueError):
            p.validate(value)

    def test_no_fiscal_acceptance(self):
        value = json.loads(self.manifest.read_text())
        value['acceptance'] = 'accepted'
        with self.assertRaises(ValueError):
            p.validate(value)


if __name__ == '__main__':
    unittest.main()
