"""Reproducciones propias: los defectos quedan rojos, sin alterar producto."""
import copy
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from auditar import SCRATCH, module

r = module()


class Adversos(unittest.TestCase):
    def setUp(self):
        self.work = Path(tempfile.mkdtemp(prefix='caso-', dir=SCRATCH))
        self.source = self.work / 'source'
        (self.source / 'sha256').mkdir(parents=True)
        raw = b'fixture independiente\n'
        payload = self.work / 'payload'
        payload.write_bytes(raw)
        self.fp = r.p.fingerprint(payload)
        (self.source / 'sha256' / self.fp['sha256']).write_bytes(raw)
        self.t = r.p.strict_json((r.HERE / 'transporte-v2.json').read_bytes())
        self.t.update(blobs=[], bytes=0, dependencies=[], unresolvedReferences=[], exclusions=[])
        r.save(self.work / 'transporte-v2.json', self.t)
        self.dep = self.work / 'adquisicion.json'
        self.dep.write_bytes(b'{"fixture":true}\n')
        dep = r.p.fingerprint(self.dep)
        (self.source / 'dependencies').mkdir()
        (self.source / 'dependencies' / dep['sha256']).write_bytes(self.dep.read_bytes())
        event = dict(self.fp, canonicalUrl='https://web.archive.org/web/20150101000000id_/http://www.agenciatributaria.es/static_files/AEAT/algoritmo.pdf', finalUrl='https://web.archive.org/web/20150101000000id_/http://www.agenciatributaria.es/static_files/AEAT/algoritmo.pdf', retrievedAt='2026-10-29T10:00:00Z', httpStatus=200, source='adquisicion.json', sourceSha256=dep['sha256'])
        self.m = dict(format='irobopf-ampliacion-local', formatVersion=1, edition=3, acceptance='ninguna', base='a' * 40, baseline=dict(dep), transport=r.p.fingerprint(self.work / 'transporte-v2.json'), annex=[dict(self.fp, sources=['checkout:payload'], acquisitions=[event], references=[], **{'class': 'captura-secundaria-URL-oficial'})], dependencies=[dict(path='adquisicion.json', **dep)], unresolvedReferences=[], exclusions=[])
        self.scope = patch.object(r, 'HERE', self.work)
        self.scope.start()
        self.addCleanup(self.scope.stop)
        self.dest = self.work / 'dest'

    def store(self):
        r.save(self.work / 'manifest.json', self.m)

    def test_control_restore_corruption_absence_marker_symlink(self):
        self.store()
        r.transfer(self.dest, self.source)
        self.assertEqual(r.verify(self.dest)['bytes'], self.fp['size'])
        with self.assertRaises(FileExistsError):
            r.transfer(self.dest, self.source)
        for name in ['../escape', '/etc/passwd']:
            with self.assertRaises(ValueError):
                r.p.safe_source(self.work, name)
        alias = self.work / 'alias'
        alias.symlink_to(self.source, target_is_directory=True)
        with self.assertRaises(ValueError):
            r.transfer(self.work / 'linked', alias)
        target = self.dest / 'sha256' / self.fp['sha256']
        target.chmod(0o644)
        target.write_bytes(b'corrupto')
        with self.assertRaises(ValueError):
            r.confirm(self.dest)
        r.transfer(self.work / 'recovery', self.source)
        self.assertEqual(r.confirm(self.work / 'recovery')['durability'], 'fsync-confirmed')
        absent = copy.deepcopy(self.m)
        absent['annex'][0].update(sha256='b' * 64)
        absent['annex'][0]['acquisitions'][0]['sha256'] = 'b' * 64
        self.m = absent
        self.store()
        with self.assertRaises(FileNotFoundError):
            r.transfer(self.work / 'missing', self.source)
        self.assertFalse((self.work / 'missing/manifest.json').exists())

    def test_control_timestamp_and_parser(self):
        for offset in ['+00:99', '-01:60', '+24:00']:
            self.m['annex'][0]['acquisitions'][0]['retrievedAt'] = '2026-01-01T00:00:00' + offset
            self.store()
            with self.assertRaises(ValueError):
                r.load()
        self.m['annex'][0]['acquisitions'][0]['retrievedAt'] = '2026-01-01T00:00:00+05:45'
        self.store()
        r.load()
        for raw in ['{"x":1,"x":2}', '{"x":NaN}']:
            with self.assertRaises(ValueError):
                r.p.strict_json(raw)

    def test_control_final_publish_fsync_and_recover(self):
        self.store()
        actual = r.p.sync_directory
        def fail(path):
            if path == self.dest and (path / 'manifest.json').exists():
                raise OSError('fsync marcador inducido')
            actual(path)
        with patch.object(r.p, 'sync_directory', fail):
            with self.assertRaises(r.p.PublicationDurabilityUnknown):
                r.transfer(self.dest, self.source)
        self.assertTrue((self.dest / 'manifest.json').exists())
        r.confirm(self.dest)

    def test_pv3_01_no_nested_private_metadata(self):
        self.m['dependencies'][0]['headers'] = {'Cookie': 'PRIVATE_SENTINEL'}
        self.store()
        with self.assertRaises(ValueError):
            r.transfer(self.dest, self.source)

    def test_pv3_02_secondary_cannot_claim_primary(self):
        self.m['annex'][0]['class'] = 'documento-primario-candidato'
        self.store()
        with self.assertRaises(ValueError):
            r.transfer(self.dest, self.source)

    def test_pv3_03_confirm_fsync_after_publication_is_indeterminate(self):
        self.store()
        actual = r.p.sync_directory
        def fail(path):
            # El publish sincroniza dest; solo confirm toca su padre al final.
            if path == self.work and (self.dest / 'manifest.json').exists():
                raise OSError('fsync padre en confirm inducido')
            actual(path)
        with patch.object(r.p, 'sync_directory', fail):
            with self.assertRaises(r.p.PublicationDurabilityUnknown):
                r.transfer(self.dest, self.source)

    def test_pv3_04_required_baseline_and_relative_dependency(self):
        del self.m['baseline']
        self.m['dependencies'][0]['path'] = '/absolute/sintetico'
        self.m['annex'][0]['acquisitions'][0]['source'] = '/absolute/sintetico'
        self.store()
        with self.assertRaises(ValueError):
            r.transfer(self.dest, self.source)

    def test_pv3_05_url_path_payload_rejected(self):
        self.assertIsNone(r.url('https://www.seg-social.es/descarga/es/PRIVATE_SENTINEL'))


if __name__ == '__main__':
    unittest.main(verbosity=2)
