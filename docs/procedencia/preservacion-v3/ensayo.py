"""Adversos sintéticos; conserva todos los bytes bajo .cache propia."""
import copy
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import recolector as r


class TransferTest(unittest.TestCase):
    def setUp(self):
        self.work = Path(tempfile.mkdtemp(prefix='adverso-', dir=r.ROOT / '.cache/preservacion-v3'))
        self.source = self.work / 'source'
        (self.source / 'sha256').mkdir(parents=True)
        payload = self.work / 'payload'
        payload.write_bytes(b'original sintetico\n')
        facts = r.p.fingerprint(payload)
        self.sha = facts['sha256']
        (self.source / 'sha256' / self.sha).write_bytes(payload.read_bytes())
        t = r.p.strict_json((r.HERE / 'transporte-v2.json').read_bytes())
        obj = copy.deepcopy(t['blobs'][0])
        obj.update(facts)
        t['blobs'], t['bytes'] = [obj], facts['size']
        r.save(self.work / 'transporte-v2.json', t)
        m = {'format': 'irobopf-ampliacion-local', 'formatVersion': 1, 'edition': 3,
             'acceptance': 'ninguna', 'transport': r.p.fingerprint(self.work / 'transporte-v2.json'),
             'annex': [], 'dependencies': []}
        r.save(self.work / 'manifest.json', m)
        self.destination = self.work / 'destination'
        self.scope = patch.object(r, 'HERE', self.work)
        self.scope.start()
        self.addCleanup(self.scope.stop)

    def test_roundtrip_and_exclusive(self):
        r.transfer(self.destination, self.source)
        r.transfer(self.work / 'restored', self.destination)
        self.assertEqual(r.verify(self.destination)['bytes'], 19)
        with self.assertRaises(FileExistsError):
            r.transfer(self.destination, self.source)
        self.assertNotEqual((self.source / 'sha256' / self.sha).stat().st_ino,
                            (self.destination / 'sha256' / self.sha).stat().st_ino)

    def test_missing(self):
        r.transfer(self.destination, self.source)
        target = self.destination / 'sha256' / self.sha
        target.rename(self.work / 'conservado')
        with self.assertRaises(ValueError):
            r.verify(self.destination)

    def test_corrupt_and_recover(self):
        r.transfer(self.destination, self.source)
        target = self.destination / 'sha256' / self.sha
        target.chmod(0o644)
        target.write_bytes(b'corrupto')
        with self.assertRaises(ValueError):
            r.confirm(self.destination)
        r.transfer(self.work / 'recovery', self.source)
        r.confirm(self.work / 'recovery')

    def test_visible_durability_unknown(self):
        sync = r.p.sync_directory
        def fault(path):
            if path == self.destination and (path / 'manifest.json').exists():
                raise OSError('fsync inducido')
            sync(path)
        with patch.object(r.p, 'sync_directory', fault):
            with self.assertRaises(r.p.PublicationDurabilityUnknown):
                r.transfer(self.destination, self.source)
        self.assertTrue((self.destination / 'manifest.json').exists())
        self.assertEqual(r.confirm(self.destination)['durability'], 'fsync-confirmed')

    def test_marker_and_symlink_rejected(self):
        r.transfer(self.destination, self.source)
        marker = self.destination / 'manifest.json'
        marker.chmod(0o644)
        marker.write_bytes(b'{}')
        with self.assertRaises(ValueError):
            r.confirm(self.destination)
        alias = self.work / 'alias'
        alias.symlink_to(self.source, target_is_directory=True)
        with self.assertRaises(ValueError):
            r.transfer(self.work / 'linked', alias)


if __name__ == '__main__':
    unittest.main(verbosity=2)
