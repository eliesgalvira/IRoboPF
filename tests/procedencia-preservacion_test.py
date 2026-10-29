"""Ensayos de preservación; fixtures explícitamente sintéticos, nunca oficiales."""
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import os
import copy

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
        self.blob = {**p.fingerprint(original), 'sources': ['source/a'],
                     'class': 'original-oficial-candidato', 'authenticity': 'no-certificada',
                     'references': [], 'acquisitions': [{
                         'canonicalUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764',
                         'finalUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764',
                         'retrievedAt': '2026-10-29T10:00:00Z', 'httpStatus': 200,
                         'source': 'source/a', 'sourceSha256': p.fingerprint(original)['sha256']}]}
        self.manifest = self.root / 'manifest.json'
        self.manifest.write_bytes(p.encoded({'version': 2, 'acceptance': 'ninguna',
            'bytes': self.blob['size'], 'blobs': [self.blob], 'exclusions': [],
            'unresolvedReferences': [], 'dependencies': [{'path': 'source/a', **p.fingerprint(original)}]}))

    def test_plan_stable_sanitized_and_versions(self):
        cache = self.root / '.cache/procedencia'
        (cache / 'sha256').mkdir(parents=True)
        (cache / 'urls').mkdir()
        for index, data in enumerate([b'primera', b'segunda']):
            temp = self.root / 'document'
            temp.write_bytes(data)
            facts = p.fingerprint(temp)
            (cache / 'sha256' / facts['sha256']).write_bytes(data)
            record = {**facts, 'canonicalUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764',
                      'finalUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', 'httpStatus': 200,
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

    def test_pre01_private_field_rejected_before_creation(self):
        value = json.loads(self.manifest.read_text())
        value['headers'] = {'Cookie': 'PRIVATE_SENTINEL'}
        self.manifest.write_bytes(p.encoded(value))
        with self.assertRaises(ValueError):
            p.transfer(self.manifest, self.root, self.root / 'private')
        self.assertFalse((self.root / 'private').exists())

    def test_pre01_duplicate_keys(self):
        raw = self.manifest.read_text().replace('"acceptance": "ninguna"', '"acceptance": "accepted", "acceptance": "ninguna"')
        self.manifest.write_text(raw)
        with self.assertRaises(ValueError):
            p.transfer(self.manifest, self.root, self.root / 'duplicate')

    def test_pre02_values_routes_and_ports(self):
        for url in ['https://www.boe.es/buscar/act.php?id=PRIVATE_SENTINEL',
                    'https://www.boe.es/buscar/act.php?txt=PRIVATE_SENTINEL',
                    'https://www.boe.es/PRIVATE_SENTINEL',
                    'https://www.boe.es:wrong/buscar/act.php?id=BOE-A-2006-20764']:
            with self.subTest(url=url):
                self.assertIsNone(p.public_url(url))

    def test_pre03_entry_and_destination_ancestors(self):
        (self.root / 'alias').symlink_to(self.root, target_is_directory=True)
        with self.assertRaises(ValueError):
            p.transfer(self.manifest, self.root, self.root / 'alias/new')
        (self.root / '.cache').mkdir()
        (self.root / '.cache/procedencia').symlink_to(self.root / 'source', target_is_directory=True)
        with self.assertRaises(ValueError):
            p.plan(self.root)

    def test_pre04_syncs_tree_before_marker(self):
        synced = []
        actual = os.fsync
        def record(fd):
            synced.append(os.readlink(f'/proc/self/fd/{fd}'))
            return actual(fd)
        with patch.object(p.os, 'fsync', record):
            p.transfer(self.manifest, self.root, self.root / 'durable')
        self.assertIn(str(self.root / 'durable/sha256'), synced)
        self.assertIn(str(self.root), synced)

    def test_pre01_nested_metadata_and_exact_types(self):
        original = json.loads(self.manifest.read_bytes())
        mutations = [
            (('version',), True), (('version',), 2.0), (('bytes',), float(original['bytes'])),
            (('blobs', 0, 'authenticity'), 'certificada'),
            (('blobs', 0, 'acquisitions', 0, 'headers'), {'Cookie': 'PRIVATE_SENTINEL'}),
            (('blobs', 0, 'acquisitions', 0, 'sourceSha256'), 'a' * 64),
            (('blobs', 0, 'acquisitions', 0, 'canonicalUrl'), 'https://www.boe.es/PRIVATE_SENTINEL'),
            (('blobs', 0, 'acquisitions', 0, 'retrievedAt'), '2026-02-30T00:00:00Z'),
            (('blobs', 0, 'sources'), ['/etc/passwd']),
            (('blobs', 0, 'sources'), ['source/../a']),
        ]
        for path, value in mutations:
            with self.subTest(path=path):
                data = copy.deepcopy(original)
                node = data
                for key in path[:-1]:
                    node = node[key]
                node[path[-1]] = value
                with self.assertRaises(ValueError):
                    p.validate(data)
        for raw in ['{"a":1,"a":2}', '{"a":NaN}', '{"a":Infinity}']:
            with self.assertRaises(ValueError):
                p.strict_json(raw)

    def test_pre04_sync_failure_has_no_marker(self):
        actual = p.sync_directory
        def fail(path):
            if Path(path).name == 'sha256':
                raise OSError('Fallo de sincronización sintético')
            return actual(path)
        with patch.object(p, 'sync_directory', fail):
            with self.assertRaises(OSError):
                p.transfer(self.manifest, self.root, self.root / 'failed-sync')
        self.assertFalse((self.root / 'failed-sync/manifest.json').exists())


if __name__ == '__main__':
    unittest.main()
