"""Pruebas offline: fallos adversarios de evidencia, geometría y bindings."""
import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia'))
import corpus
import descargar
import pymupdf
from jsonschema.exceptions import ValidationError


class EvidenceTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / 'sha256').mkdir()
        doc = pymupdf.open()
        page = doc.new_page()
        page.insert_text((60, 70), 'Importe: 1.234,56 euros')
        data = doc.tobytes()
        doc.close()
        sha = corpus.hashlib.sha256(data).hexdigest()
        path = self.root / 'sha256' / sha
        path.write_bytes(data)
        self.record = {'canonicalUrl': 'https://www.boe.es/a.pdf', 'finalUrl': 'https://www.boe.es/a.pdf', 'sha256': sha, 'sha512': descargar.digest(path, 'sha512'), 'size': len(data),
                       'retrievedAt': '2026-10-29T10:00:00Z', 'httpStatus': 200,
                       'headers': {}, 'mimeType': 'application/pdf', 'authenticity': {'status': 'not-validated'}}
        self.box = [50, 50, 250, 90]
        self.citation = corpus.cite(self.record, self.root, 1, self.box)

    def test_roundtrip_pending(self):
        self.assertEqual(corpus.verify(self.record, self.citation, self.root)['integrity'], 'verified')
        with self.assertRaises((ValueError, ValidationError)):
            corpus.verify(self.record, self.citation, self.root, accepted=True)

    def test_fabricated_acceptance_is_rejected(self):
        base = Path(__file__).resolve().parents[1] / 'docs/procedencia/corpus'
        record = json.loads((base / 'bocm-firmado.manifest.json').read_text())
        citation = json.loads((base / 'bocm-celda.citation.json').read_text())
        citation['semanticValidation'] = {'status': 'verified'}
        citation['independentReview'] = {'status': 'verified', 'author': 'A',
                                         'reviewer': 'B', 'evidence': 'no-existe'}
        with self.assertRaises((ValueError, ValidationError)):
            corpus.verify(record, citation, base / 'fixtures', accepted=True)

    def test_unicode_sign_cannot_be_omitted(self):
        for sign in ('−', '﹣', '－', '＋', '±', '⁻', '₋'):
            text = sign + '8,50%'
            binding = {'number': {'start': 1, 'end': 5, 'literal': '8,50'},
                       'numberFormat': 'es-ES', 'value': '8.50',
                       'unit': {'start': 5, 'end': 6, 'literal': '%'}, 'unitCode': 'percent'}
            with self.subTest(sign=sign), self.assertRaises(ValueError):
                corpus.verify_binding(text, binding)

    def test_separated_sign_cannot_be_omitted(self):
        text = '− 8,50%'
        binding = {'number': {'start': 2, 'end': 6, 'literal': '8,50'},
                   'numberFormat': 'es-ES', 'value': '8.50',
                   'unit': {'start': 6, 'end': 7, 'literal': '%'}, 'unitCode': 'percent'}
        with self.assertRaises(ValueError):
            corpus.verify_binding(text, binding)

    def test_api_rejects_unknown_document_field(self):
        record = dict(self.record, unexpected=True)
        with self.assertRaises(ValidationError):
            corpus.verify(record, self.citation, self.root)

    def test_public_metadata_and_cache_identity(self):
        record = dict(self.record, headers={'Set-Cookie': 'fixture', 'ETag': 'hash', 'X-Private': 'fixture'},
                      redirects=[{'headers': {'Authorization': 'fixture'}}])
        public = corpus.public_document(record)
        self.assertEqual(public['headers'], {'etag': 'hash'})
        self.assertEqual(public['redirects'][0]['headers'], {})
        self.assertIn('Set-Cookie', record['headers'])
        key = corpus.hashlib.sha256(self.record['canonicalUrl'].encode()).hexdigest()
        forged = dict(self.record, canonicalUrl='https://example.org/a.pdf', finalUrl='https://example.org/a.pdf')
        descargar.atomic_json(self.root / 'urls' / (key + '.json'), forged)
        with self.assertRaises(ValueError):
            descargar.download(self.record['canonicalUrl'], self.root)
        self.assertEqual(descargar.verify_origin(self.record, self.record['canonicalUrl'], descargar.DEFAULT_HOSTS)['status'], 'pending')

    def test_atomic_crop_failure_leaves_no_partial_blob(self):
        data = b'fixture de publicacion'
        path = self.root / 'sha256' / corpus.hashlib.sha256(data).hexdigest()
        before = set(path.parent.iterdir())
        with patch('corpus.os.replace', side_effect=OSError('fallo simulado')):
            with self.assertRaises(OSError):
                corpus.store_bytes(path, data)
        self.assertEqual(set(path.parent.iterdir()), before)
        corpus.store_bytes(path, data)
        self.assertEqual(path.read_bytes(), data)

    def test_page_boolean_and_unreviewed_hosts(self):
        with self.assertRaises(ValueError):
            corpus.cite(self.record, self.root, True, self.box)
        for host in ('www3.agenciatributaria.gob.es', 'bocyl.jcyl.es', 'www.borm.es', 'www.hacienda.gob.es'):
            descargar.check_url('https://' + host + '/original', descargar.DEFAULT_HOSTS)
        with self.assertRaises(ValueError):
            descargar.check_url('https://rivet.dev/docs', descargar.DEFAULT_HOSTS)

    def test_tampering(self):
        for field, value in [('quote', 'Falso'), ('documentSha256', 'a' * 64),
                             ('bbox', [-1, 0, 20, 20]), ('page', 0),
                             ('normalization', 'strip'), ('selectors', [])]:
            with self.subTest(field=field):
                candidate = copy.deepcopy(self.citation)
                candidate[field] = value
                with self.assertRaises((ValueError, ValidationError)):
                    corpus.verify(self.record, candidate, self.root)

    def test_crop_corruption(self):
        path = self.root / 'sha256' / self.citation['facsimile']['sha256']
        path.write_bytes(b'alterado')
        with self.assertRaises((ValueError, ValidationError)):
            corpus.verify(self.record, self.citation, self.root)

    def test_missing_crop(self):
        path = self.root / 'sha256' / self.citation['facsimile']['sha256']
        path.unlink()
        with self.assertRaises((ValueError, FileNotFoundError)):
            corpus.verify(self.record, self.citation, self.root)

    def test_original_corruption(self):
        (self.root / 'sha256' / self.record['sha256']).write_bytes(b'alterado')
        with self.assertRaises((ValueError, ValidationError)):
            corpus.verify(self.record, self.citation, self.root)

    def test_bindings(self):
        text = 'Importe: 1.234,56 euros'
        binding = {'number': {'start': 9, 'end': 17, 'literal': '1.234,56'},
                   'numberFormat': 'es-ES', 'value': '1234.56',
                   'unit': {'start': 18, 'end': 23, 'literal': 'euros'}, 'unitCode': 'EUR'}
        # Índices explícitos calculados sobre la cita, no búsqueda de substring.
        binding['number']['end'] = 17
        self.assertTrue(corpus.verify_binding(text, binding))
        compact = {'number': {'start': 0, 'end': 4, 'literal': '8,50'},
                   'numberFormat': 'es-ES', 'value': '8.50',
                   'unit': {'start': 4, 'end': 5, 'literal': '%'}, 'unitCode': 'percent'}
        self.assertTrue(corpus.verify_binding('8,50%', compact))
        for field, value in [('value', '1234.57'), ('numberFormat', 'decimal'), ('unitCode', 'percent')]:
            bad = copy.deepcopy(binding)
            bad[field] = value
            with self.assertRaises((ValueError, ValidationError)):
                corpus.verify_binding(text, bad)
        bad = copy.deepcopy(binding)
        bad['number'] = {'start': 11, 'end': 17, 'literal': '234,56'}
        bad['value'] = '234.56'
        with self.assertRaises((ValueError, ValidationError)):
            corpus.verify_binding(text, bad)
        for literal in ('1.23,56', '1,234.56', 'NaN'):
            bad = copy.deepcopy(binding)
            bad['number'] = {'start': 0, 'end': len(literal), 'literal': literal}
            with self.assertRaises((ValueError, ValidationError)):
                corpus.verify_binding(literal, bad)

    def test_rotated_and_cropped(self):
        doc = pymupdf.open()
        page = doc.new_page(width=400, height=500)
        page.set_cropbox(pymupdf.Rect(20, 30, 350, 450))
        page.insert_text((40, 60), 'Capa selectiva')
        page.set_rotation(90)
        self.assertTrue(corpus.extract(page, [20, 30, 200, 90]).strip())
        self.assertTrue(corpus.crop_bytes(page, [20, 30, 200, 90]).startswith(b'\x89PNG'))
        for box in ([0, 0, 331, 50], [0, 0, 20, 421], [0, 0, float('nan'), 20], [4, 4, 2, 2]):
            with self.assertRaises((ValueError, ValidationError)):
                corpus.rect_checked(page, box)
        doc.close()


    def test_real_offline_fixtures(self):
        base = Path(__file__).resolve().parents[1] / 'docs/procedencia/corpus'
        for name, expected in [('irpf-consolidado', 'unsigned'), ('bocm-firmado', 'trust-indeterminate')]:
            record = json.loads((base / (name + '.manifest.json')).read_text())
            citation = json.loads((base / (name + '.citation.json')).read_text())
            corpus.validate_schema(record, 'document')
            self.assertEqual(corpus.verify(record, citation, base / 'fixtures')['integrity'], 'verified')
            signature = corpus.signatures(record, base / 'fixtures')
            self.assertEqual(signature['status'], expected)

    def test_real_table_cell(self):
        base = Path(__file__).resolve().parents[1] / 'docs/procedencia/corpus'
        record = json.loads((base / 'bocm-firmado.manifest.json').read_text())
        cell = json.loads((base / 'bocm-celda.citation.json').read_text())
        self.assertEqual(corpus.verify(record, cell, base / 'fixtures')['fiscalAcceptance'], 'pending')
        cell['engineBinding']['value'] = '8.51'
        with self.assertRaises(ValueError):
            corpus.verify(record, cell, base / 'fixtures')

    def test_real_signature_tamper(self):
        base = Path(__file__).resolve().parents[1] / 'docs/procedencia/corpus'
        record = json.loads((base / 'bocm-firmado.manifest.json').read_text())
        data = bytearray((base / 'fixtures/sha256' / record['sha256']).read_bytes())
        # Un byte del comentario de cabecera está cubierto por la firma; el PDF sigue abriéndose.
        self.assertEqual(data[:5], b'%PDF-')
        data[12] = (data[12] + 1) % 256
        sha = corpus.hashlib.sha256(data).hexdigest()
        path = self.root / 'sha256' / sha
        path.write_bytes(data)
        altered = {'sha256': sha, 'sha512': descargar.digest(path, 'sha512'), 'size': len(data)}
        self.assertEqual(corpus.signatures(altered, self.root)['status'], 'invalid')

    def test_legacy_import_and_history(self):
        source = self.root / 'source'
        (source / 'sha256').mkdir(parents=True)
        record = dict(self.record, canonicalUrl='https://www.boe.es/a.pdf', finalUrl='https://www.boe.es/a.pdf')
        blob = self.root / 'sha256' / record['sha256']
        (source / 'sha256' / record['sha256']).write_bytes(blob.read_bytes())
        key = corpus.hashlib.sha256(record['canonicalUrl'].encode()).hexdigest()
        index = source / 'urls' / (key + '.json')
        descargar.atomic_json(index, record)
        before = index.read_bytes()
        corpus.ingest(source, self.root)
        self.assertEqual(before, index.read_bytes())
        changed = dict(record, retrievedAt='later')
        descargar.archive(changed, self.root)
        key = corpus.hashlib.sha256(record['canonicalUrl'].encode()).hexdigest()
        self.assertGreaterEqual(len(list((self.root / 'history' / key).glob('*.json'))), 2)
        with patch('descargar.fcntl.flock'):
            with self.assertRaises(ValueError):
                descargar.download(record['canonicalUrl'], self.root, expected_sha256='f' * 64)

    def test_redirect_policy(self):
        handler = descargar.Redirects(descargar.DEFAULT_HOSTS)
        request = descargar.urllib.request.Request('https://www.boe.es/a')
        with self.assertRaises(ValueError):
            handler.redirect_request(request, None, 302, '', {}, 'http://www.boe.es/a')
        with self.assertRaises(ValueError):
            handler.redirect_request(request, None, 302, '', {}, 'https://example.org/a')

    def test_allowlist(self):
        for url in ('http://www.boe.es/x', 'https://www.boe.es.evil.org/x',
                    'https://user@www.boe.es/x', 'https://www.boe.es:444/x'):
            with self.assertRaises((ValueError, ValidationError)):
                descargar.check_url(url, descargar.DEFAULT_HOSTS)
        descargar.check_url('https://www.boe.es/x', descargar.DEFAULT_HOSTS)

    def test_pdf_false_200_and_bounds(self):
        class Headers(dict):
            def get_content_type(self):
                return 'application/pdf'
        class Response:
            status = 200
            url = 'https://www.boe.es/x.pdf'
            headers = Headers()
            def __enter__(self):
                return self
            def __exit__(self, *args):
                return False
            def read1(self, size):
                value, self.data = self.data, b''
                return value
        for data, limit in [(b'<html>error</html>', 1000), (b'%PDF-' + b'x' * 100, 10)]:
            response = Response()
            response.data = data
            with patch('descargar.urllib.request.build_opener') as opener, patch('descargar.time.sleep'), patch('descargar.fcntl.flock'):
                opener.return_value.open.return_value = response
                with self.assertRaises((ValueError, ValidationError)):
                    descargar.download(response.url, self.root, max_bytes=limit)


if __name__ == '__main__':
    unittest.main()
