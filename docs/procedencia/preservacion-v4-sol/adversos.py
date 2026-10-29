"""Adversos propios de la edición; residuos conservados en caché propia."""
import copy
import hashlib
from pathlib import Path
import tempfile
import unittest
from typing import Any
from unittest.mock import patch

import edicion as e


class EditionTests(unittest.TestCase):
    def setUp(self):
        self.work = Path(tempfile.mkdtemp(dir=e.CACHE, prefix='adverso-'))
        self.source = self.work / 'source'
        self.source.mkdir()
        (self.source / 'sha256').mkdir()
        (self.source / 'dependencies').mkdir()
        blob = self.work / 'payload'
        blob.write_bytes(b'prueba sintetica, nunca documento oficial')
        self.fp = e.p.fingerprint(blob)
        e.put(blob, self.source / 'sha256' / self.fp['sha256'])
        self.m: dict[str, Any] = {'format': 'irobopf-preservacion-local-v4', 'edition': 4, 'base': e.BASE, 'acceptance': 'ninguna', 'objects': [{**self.fp, 'kind': 'facsimil', 'inherited': False, 'acquisitions': [], 'references': []}], 'dependencies': [], 'unresolvedReferences': [], 'exclusions': []}
        self.external = self.work / 'externo.json'
        self.dest = self.work / 'destino'
        self.store()

    def store(self):
        data = e.p.encoded(self.m)
        self.external.write_bytes(data)
        marker = self.source / 'manifest.json'
        marker.chmod(0o644) if marker.exists() else None
        marker.write_bytes(data)
        self.pin = hashlib.sha256(data).hexdigest()

    def test_roundtrip_exclusive_and_no_hardlinks(self):
        e.transfer(self.source, self.dest, self.pin, self.external)
        restored = self.work / 'restored'
        e.transfer(self.dest, restored, self.pin, self.external)
        self.assertEqual(e.verify(restored, self.pin, self.external)['objects'], 1)
        self.assertNotEqual((self.source / 'sha256' / self.fp['sha256']).stat().st_ino, (restored / 'sha256' / self.fp['sha256']).stat().st_ino)
        with self.assertRaises(FileExistsError):
            e.transfer(self.source, self.dest, self.pin, self.external)

    def test_pin_and_marker(self):
        with self.assertRaises(ValueError):
            e.load('0' * 64, self.external)
        e.transfer(self.source, self.dest, self.pin, self.external)
        (self.dest / 'manifest.json').chmod(0o644)
        (self.dest / 'manifest.json').write_bytes(b'{}')
        with self.assertRaises(ValueError):
            e.verify(self.dest, self.pin, self.external)

    def test_missing_and_corrupt(self):
        e.transfer(self.source, self.dest, self.pin, self.external)
        target = self.dest / 'sha256' / self.fp['sha256']
        target.rename(self.work / 'conservado')
        with self.assertRaises(ValueError):
            e.verify(self.dest, self.pin, self.external)
        target.write_bytes(b'alterado')
        with self.assertRaises(ValueError):
            e.verify(self.dest, self.pin, self.external)

    def test_recursive_privacy_and_paths(self):
        original = copy.deepcopy(self.m)
        for relative in ('../fuera', './fuera', '/fuera', 'a/../b', 'a//b', 'a\\b', 'a:b'):
            self.m = copy.deepcopy(original)
            self.m['objects'][0]['references'] = [relative]
            self.store()
            with self.assertRaises(ValueError):
                e.load(self.pin, self.external)
        for target in ('root', 'object'):
            self.m = copy.deepcopy(original)
            (self.m if target == 'root' else self.m['objects'][0])['headers'] = {'Cookie': 'PRIVATE_SENTINEL'}
            self.store()
            with self.assertRaises(ValueError) as caught:
                e.load(self.pin, self.external)
            self.assertNotIn('PRIVATE_SENTINEL', str(caught.exception))

    def test_symlinks(self):
        alias = self.work / 'alias'
        alias.symlink_to(self.source, target_is_directory=True)
        with self.assertRaises(ValueError):
            e.transfer(alias, self.dest, self.pin, self.external)
        with self.assertRaises(ValueError):
            e.transfer(self.source, alias / 'destination', self.pin, self.external)

    def test_durability_recovery(self):
        sync = e.p.sync_directory
        def fault(path):
            if path == self.dest and (self.dest / 'manifest.json').exists():
                raise OSError('fallo inducido')
            sync(path)
        with patch.object(e.p, 'sync_directory', fault):
            with self.assertRaises(e.p.PublicationDurabilityUnknown):
                e.transfer(self.source, self.dest, self.pin, self.external)
        self.assertTrue((self.dest / 'manifest.json').exists())
        self.assertEqual(e.confirm(self.dest, self.pin, self.external)['durability'], 'fsync-confirmed')

    def test_sanitized_source_has_distinct_identity(self):
        raw = {'headers': {'Cookie': 'PRIVATE_SENTINEL'}, 'nested': {'localPath': '/home/private', 'sha256': 'a' * 64}, 'url': 'https://www.boe.es/'}
        sanitized = e.clean(raw)
        self.assertNotIn('PRIVATE_SENTINEL', str(sanitized))
        self.assertNotEqual(hashlib.sha256(e.p.encoded(raw)).hexdigest(), hashlib.sha256(e.p.encoded(sanitized)).hexdigest())

    def test_duplicate_index_and_untrusted_acquisition(self):
        self.m['objects'].append(copy.deepcopy(self.m['objects'][0]))
        self.store()
        with self.assertRaises(ValueError):
            e.load(self.pin, self.external)
        self.m['objects'].pop()
        self.m['objects'][0].update(kind='documento-primario-candidato')
        self.store()
        with self.assertRaises(ValueError):
            e.load(self.pin, self.external)

    def test_secondary_identity_and_dates(self):
        dep = {**self.fp, 'path': 'adquisicion.json', 'sourceSha256': self.fp['sha256'], 'sourceSha512': self.fp['sha512'], 'sourceSize': self.fp['size'], 'sanitized': False, 'historical': False}
        self.m['dependencies'] = [dep]
        archive = 'https://web.archive.org/web/20150101000000id_/http://www.agenciatributaria.es/static_files/AEAT/algoritmo.pdf'
        event = {**self.fp, 'canonicalUrl': archive, 'finalUrl': 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', 'retrievedAt': '2026-10-29T10:00:00Z', 'httpStatus': 200, 'dependency': self.fp['sha256']}
        self.m['objects'][0].update(kind='documento-primario-candidato', acquisitions=[event])
        self.store()
        with self.assertRaises(ValueError):
            e.load(self.pin, self.external)
        self.m['objects'][0]['kind'] = 'captura-secundaria-URL-oficial'
        for date in ('2026-10-29T10:00:00+00:99', '2026-02-30T10:00:00Z'):
            event['retrievedAt'] = date
            self.store()
            with self.assertRaises(ValueError):
                e.load(self.pin, self.external)


if __name__ == '__main__':
    unittest.main(verbosity=2)
