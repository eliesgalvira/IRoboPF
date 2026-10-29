"""Ensayos adicionales de confirmación: fallos en cada fsync y bytes alterados."""
import importlib
import importlib.util
from pathlib import Path
import os
import sys
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
ROOT = HERE / 'scratch'
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
p = importlib.import_module("preservacion")
spec = importlib.util.spec_from_file_location('base_tests', ROOT / 'tests/procedencia-preservacion_test.py')
assert spec is not None and spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class Extra(unittest.TestCase):
    def setUp(self):
        fixture = module.PreservationTests()
        fixture.setUp()
        self.addCleanup(fixture.doCleanups)
        self.root = fixture.root
        self.manifest = fixture.manifest
        self.blob = fixture.blob

    def test_confirm_every_fsync_failure(self):
        destination = self.root / 'extra'
        p.transfer(self.manifest, self.root, destination)
        actual = os.fsync
        calls = []

        def record(fd):
            calls.append(os.readlink(f'/proc/self/fd/{fd}'))
            actual(fd)

        with patch.object(p.os, 'fsync', record):
            p.confirm(self.manifest, destination)
        self.assertEqual(len(calls), 5)
        self.assertEqual(calls[-3:], [str(destination / 'sha256'), str(destination), str(destination.parent)])
        for fail_at in range(1, 6):
            count = 0

            def fail(fd):
                nonlocal count
                count += 1
                if count == fail_at:
                    raise OSError('Fallo sintético')
                actual(fd)

            with patch.object(p.os, 'fsync', fail), self.assertRaises(OSError):
                p.confirm(self.manifest, destination)
            self.assertEqual((destination / 'manifest.json').read_bytes(), self.manifest.read_bytes())

    def test_confirm_corrupt_or_missing_object(self):
        destination = self.root / 'corrupt'
        p.transfer(self.manifest, self.root, destination)
        blob = destination / 'sha256' / self.blob['sha256']
        blob.chmod(0o644)
        blob.write_bytes(b'corrupto')
        with self.assertRaises(ValueError):
            p.confirm(self.manifest, destination)
        blob.rename(destination / 'apartado')
        with self.assertRaises(ValueError):
            p.confirm(self.manifest, destination)


if __name__ == '__main__':
    unittest.main(verbosity=2)
