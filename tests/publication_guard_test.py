"""All identities, network examples and tax identifiers here are synthetic."""
import base64
import bz2
import gzip
import importlib.util
import io
import json
import lzma
import os
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest
from unittest.mock import patch
import zipfile
import zlib

spec = importlib.util.spec_from_file_location('guard', Path(__file__).resolve().parents[1] / 'scripts/publication_guard.py')
g = importlib.util.module_from_spec(spec)
spec.loader.exec_module(g)


def policy():
    rules = {key: r'(?!)' for key in g.REQUIRED}
    rules.update(hosts=r'\bnebula\b', personal='Fictional Sensitive Person')
    return {'privateConfigurationOnly': True, 'patterns': rules,
            'knownPrivateThreadUuids': ['11111111-2222-4333-8444-555555555555']}


def pdf_fixture(attachment=False):
    stream = b'BT /F1 24 Tf 40 120 Td (nebulaVersion) Tj ET'
    objects = [b'<< /Type /Catalog /Pages 2 0 R >>',
               b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
               b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
               b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
               b'<< /Length ' + str(len(stream)).encode() + b' >>\nstream\n' + stream + b'\nendstream',
               b'<< /Author (Fictional Sensitive Person) >>']
    if attachment:
        payload = zlib.compress(b'nebulaVersion')
        objects[0] = b'<< /Type /Catalog /Pages 2 0 R /Names << /EmbeddedFiles << /Names [(fixture.txt) 8 0 R] >> >> >>'
        objects += [b'<< /Type /EmbeddedFile /Filter /FlateDecode /Length ' + str(len(payload)).encode() + b' >>\nstream\n' + payload + b'\nendstream',
                    b'<< /Type /Filespec /F (fixture.txt) /EF << /F 7 0 R >> >>']
    pdf, offsets = b'%PDF-1.4\n', [0]
    for index, body in enumerate(objects, 1):
        offsets.append(len(pdf))
        pdf += str(index).encode() + b' 0 obj\n' + body + b'\nendobj\n'
    xref = len(pdf)
    pdf += f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n'.encode()
    pdf += b''.join(f'{offset:010d} 00000 n \n'.encode() for offset in offsets[1:])
    pdf += f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n'.encode() + str(xref).encode() + b'\n%%EOF\n'
    return pdf


class PayloadTests(unittest.TestCase):
    def blocked(self, data, rule=None, name='fixture.txt'):
        guard = g.Guard(policy())
        guard.scan(name, data)
        self.assertTrue(guard.findings)
        if rule:
            self.assertIn(rule, {f['rule'] for f in guard.findings})
        self.assertNotIn('nebula', json.dumps(guard.findings).lower())

    def test_machine_camel_case_and_legitimate_cross_axis(self):
        self.blocked(b'nebulaVersion', 'hosts')
        self.blocked(b'NEBULAVersion', 'hosts')
        guard = g.Guard(policy())
        guard.scan('source', b'cross' + b'Axis Alignment public data')
        self.assertEqual(guard.findings, [])

    def test_percent_and_unicode_encoded_ids(self):
        for suffix in (b'%253Aexample', b'\\u003aexample', b'\\x3aexample'):
            self.blocked(b'mcp' + suffix, 'internal-id')

    def test_paths_names_and_utf16(self):
        private = '/' + 'home' + '/synthetic-user/result'
        self.blocked(private.encode(), 'personal-path')
        self.blocked(private.replace('/', '\\/').encode(), 'personal-path')
        self.blocked(b'clean', 'personal-path', private)
        self.blocked(b'clean', 'personal-path', base64.b64encode(private.encode()).decode())
        self.blocked('nebulaVersion'.encode('utf-16'), 'hosts')

    def test_network_secret_and_runtime_fields(self):
        self.blocked(b'example-node.' + b'ts.net', 'network')
        self.blocked(b'100.' + b'64.12.34', 'network')
        self.blocked(('ghp_' + 'x' * 36).encode(), 'secret')
        self.blocked(b'{"threadId":"unlisted-runtime-id"}', 'runtime-field')

    def test_base64_and_wrapped_nested_compression(self):
        self.blocked(base64.b64encode(b'nebulaVersion value'), 'hosts')
        self.blocked(base64.b64encode(('/' + 'home' + '/a').encode()), 'personal-path')
        self.blocked(base64.b64encode('nebulaVersion'.encode('utf-16')), 'hosts')
        self.blocked(base64.b64encode(b'mcp' + b':x'), 'internal-id')
        encoded_url = ''.join('%%%02x' % c for c in base64.b64encode(b'nebulaVersion'))
        self.blocked(encoded_url.encode(), 'hosts')
        encoded = base64.b64encode(gzip.compress(zlib.compress(b'nebulaVersion')))
        self.blocked(encoded[:20] + b'\n' + encoded[20:], 'hosts')

    def test_base64_opaque_bytes_still_check_private_literals(self):
        self.blocked(base64.b64encode(b'\xff\xfeopaque nebulaVersion'), 'hosts')
        self.blocked(base64.b64encode(b'\xfeopaque nebulaVersion'), 'hosts')

    def test_zip_metadata_and_nested_payload(self):
        for entry, body in [('nebulaVersion.txt', b'clean'), ('nested.gz', gzip.compress(b'nebulaVersion'))]:
            stream = io.BytesIO()
            with zipfile.ZipFile(stream, 'w') as archive:
                archive.writestr(entry, body)
            self.blocked(stream.getvalue(), 'hosts')

    def test_base64_other_transports_and_payload_directories(self):
        for level in (1, 6, 9):
            self.blocked(base64.b64encode(zlib.compress(b'nebulaVersion', level)), 'hosts')
        for window in (9, 12, 15):
            self.blocked(base64.b64encode(zlib.compress(b'nebulaVersion', wbits=window)), 'hosts')
        for encoding in ('utf-16-le', 'utf-16-be'):
            with self.assertRaises(g.Blocked):
                g.Guard(policy()).scan('fixture', base64.b64encode('nebulaVersion'.encode(encoding)))
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode='w') as archive:
            body = b'nebulaVersion'
            entry = tarfile.TarInfo('fixture.txt')
            entry.size = len(body)
            archive.addfile(entry, io.BytesIO(body))
        self.blocked(stream.getvalue(), 'hosts')
        self.blocked(base64.b64encode(stream.getvalue()), 'hosts')
        zipped = io.BytesIO()
        with zipfile.ZipFile(zipped, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
            archive.writestr('directory/', b'nebulaVersion')
        with self.assertRaisesRegex(g.Blocked, 'directory-with-payload'):
            g.Guard(policy()).scan('fixture.zip', zipped.getvalue())

    def test_gzip_header(self):
        stream = io.BytesIO()
        with gzip.GzipFile(filename='nebulaVersion.txt', mode='wb', fileobj=stream) as output:
            output.write(b'clean')
        self.blocked(stream.getvalue(), 'hosts')

    def test_fail_closed_binary_container_and_limits(self):
        for body in (b'\x00\xffunknown', b'\x1f\x8btruncated'):
            with self.assertRaises(g.Blocked):
                g.Guard(policy()).scan('fixture', body)
        with patch.object(g, 'MAX_TOTAL', 4), self.assertRaises(g.Blocked):
            g.Guard(policy()).scan('fixture', b'12345')
        body = b'clean'
        for _ in range(g.MAX_DEPTH + 2):
            body = gzip.compress(body)
        with self.assertRaises(g.Blocked):
            g.Guard(policy()).scan('fixture', body)

    def test_policy_and_exceptions_fail_closed(self):
        with self.assertRaises(g.Blocked):
            g.Guard({})
        bad = policy()
        bad['patterns']['hosts'] = '['
        with self.assertRaises(g.Blocked):
            g.Guard(bad)
        body = b'12345678Z'
        exception = {'kind': 'synthetic-fixture', 'path': 'fixture', 'sha256': g.digest(body),
                     'rules': ['fiscal-identity'], 'justification': 'Invented test identifier', 'evidence': 'tests/publication_guard_test.py'}
        guard = g.Guard(policy(), [exception])
        guard.scan('fixture', body)
        self.assertEqual(guard.findings, [])
        self.assertTrue(guard.used_exceptions)
        guard.scan('fixture', body + b' changed')
        self.assertTrue(guard.findings)
        for rule in ('secret', 'personal-path', 'hosts', 'known-private-thread', 'ids', 'tailscale', 'personal'):
            with self.assertRaises(g.Blocked):
                g.Guard(policy(), [{**exception, 'rules': [rule]}])

    def test_trailing_containers_and_recursive_metadata(self):
        secret = gzip.compress(b'nebulaVersion')
        for body in (gzip.compress(b'clean'), bz2.compress(b'clean'), lzma.compress(b'clean')):
            with self.assertRaises(g.Blocked):
                g.Guard(policy()).scan('fixture', body + secret)
        stream = io.BytesIO()
        with tarfile.open(fileobj=stream, mode='w') as archive:
            entry = tarfile.TarInfo('fixture.txt')
            entry.uname = base64.b64encode(b'nebulaVersion').decode()
            archive.addfile(entry)
        self.blocked(stream.getvalue(), 'hosts')
        with self.assertRaises(g.Blocked):
            g.Guard(policy()).scan('fixture.tar', stream.getvalue() + secret)
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            entry = zipfile.ZipInfo('fixture.txt')
            entry.comment = base64.b64encode(b'nebulaVersion')
            archive.writestr(entry, b'clean')
        self.blocked(stream.getvalue(), 'hosts')

    def test_scanner_source_is_not_mistaken_for_utf16(self):
        guard = g.Guard(policy())
        guard.scan('scripts/publication_guard.py', Path(g.__file__).read_bytes())
        self.assertEqual(guard.findings, [])

    def test_zip_local_extra_is_not_hidden_by_central_directory(self):
        output = io.BytesIO()
        with zipfile.ZipFile(output, 'w') as archive:
            archive.writestr('fixture.txt', b'clean')
        original = output.getvalue()
        name_size = int.from_bytes(original[26:28], 'little')
        encoded = base64.b64encode(b'nebulaVersion')
        extra = b'\xfe\xca' + len(encoded).to_bytes(2, 'little') + encoded
        split = 30 + name_size
        body = bytearray(original[:split] + extra + original[split:])
        body[28:30] = len(extra).to_bytes(2, 'little')
        end = body.rfind(b'PK\x05\x06')
        offset = int.from_bytes(body[end + 16:end + 20], 'little') + len(extra)
        body[end + 16:end + 20] = offset.to_bytes(4, 'little')
        with zipfile.ZipFile(io.BytesIO(body)) as archive:
            self.assertEqual(archive.infolist()[0].extra, b'')
            self.assertEqual(archive.read('fixture.txt'), b'clean')
        with self.assertRaisesRegex(g.Blocked, 'zip-local-extra-not-admitted'):
            g.Guard(policy()).scan('fixture.zip', bytes(body))

    def test_missing_document_tools_blocks(self):
        with patch.object(g, 'command', side_effect=g.Blocked('extractor-or-git-failed')):
            with self.assertRaises(g.Blocked):
                g.Guard(policy()).scan('fixture.pdf', b'%PDF-1.4 synthetic')

    def test_document_metadata_text_and_ocr_all_scanned(self):
        def extract(argv, cwd=None):
            if argv[0] == 'exiftool':
                return b'[{"SourceFile":"temporary", "PDF:Author":"nebulaVersion"}]'
            if argv[0] == 'pdfinfo':
                return b'Pages: 1\nEncrypted: no\n'
            if argv[0] == 'pdfdetach':
                return b'0 embedded files\n'
            if argv[0] == 'pdftotext':
                return b'mcp' + b':synthetic'
            if argv[0] == 'pdftoppm':
                Path(argv[-1] + '-1.png').write_bytes(b'fake-rendered-page')
                return b''
            if argv[0] == 'tesseract':
                return b'100.' + b'64.12.34'
            raise AssertionError(argv[0])
        with patch.object(g, 'command', side_effect=extract):
            guard = g.Guard(policy())
            guard.scan('fixture.pdf', b'%PDF-1.4 synthetic')
        self.assertTrue({'hosts', 'internal-id', 'network'} <= {f['rule'] for f in guard.findings})

    def test_image_ocr_and_unsupported_frames(self):
        with patch.object(g, 'command', side_effect=[b'[{}]', b'nebulaVersion']):
            self.blocked(b'\x89PNG synthetic\x00\x00\x00\x00IEND\xaeB`\x82', 'hosts')
        with patch.object(g, 'command', return_value=b'[{}]'):
            with self.assertRaises(g.Blocked):
                g.Guard(policy()).scan('fixture.gif', b'GIF89a synthetic')


class GitTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name)
        self.run_git('init', '-q')
        self.run_git('config', 'user.name', 'IRoboPF')
        self.run_git('config', 'user.email', 'irobopf@users.noreply.github.com')
        self.commit('base.txt', b'public')
        self.base = self.run_git('rev-parse', 'HEAD').decode().strip()

    def run_git(self, *args):
        return g.git(self.repo, *args)

    def commit(self, name, content):
        (self.repo / name).write_bytes(content)
        self.run_git('add', '--', name)
        self.run_git('commit', '-qm', 'Public fixture')

    def test_incremental_metadata_and_contents(self):
        self.commit('safe.txt', b'public')
        guard = g.Guard(policy())
        g.inspect_git(guard, self.repo, self.base, 'HEAD')
        self.assertEqual(guard.findings, [])
        self.commit('unsafe.txt', b'nebulaVersion')
        g.inspect_git(guard, self.repo, self.base, 'HEAD')
        self.assertTrue(guard.findings)

    def test_author_and_committer(self):
        self.commit('safe.txt', b'public')
        self.run_git('commit', '--amend', '--no-edit', '--author', 'Synthetic Author <synthetic@example.invalid>')
        with self.assertRaisesRegex(g.Blocked, 'private-git-identity'):
            g.inspect_git(g.Guard(policy()), self.repo, self.base, 'HEAD')
        self.run_git('config', 'user.name', 'Synthetic Committer')
        self.run_git('commit', '--amend', '--no-edit', '--author', g.PUBLIC_ID)
        with self.assertRaisesRegex(g.Blocked, 'private-git-identity'):
            g.inspect_git(g.Guard(policy()), self.repo, self.base, 'HEAD')

    def test_extra_git_headers_and_signature(self):
        self.commit('safe.txt', b'public')
        raw = self.run_git('cat-file', 'commit', 'HEAD')
        for extra in (b'private-extra nebulaVersion', b'gpgsig synthetic\n nebulaVersion'):
            header, message = raw.split(b'\n\n', 1)
            altered = header + b'\n' + extra + b'\n\n' + message
            obj = subprocess.run(['git', 'hash-object', '-w', '-t', 'commit', '--stdin'], input=altered, cwd=self.repo,
                                 check=True, capture_output=True, timeout=30).stdout.decode().strip()
            guard = g.Guard(policy())
            g.inspect_git(guard, self.repo, self.base, obj)
            self.assertIn('hosts', {f['rule'] for f in guard.findings})

    def test_tags_complete_history_and_messages(self):
        self.run_git('tag', '-a', 'public-fixture', '-m', 'nebulaVersion')
        guard = g.Guard(policy())
        g.inspect_public_refs(guard, self.repo, ['refs/tags/public-fixture'])
        self.assertTrue(guard.findings)
        self.run_git('config', 'user.name', 'Synthetic Tagger')
        self.run_git('tag', '-a', 'other-fixture', '-m', 'public')
        with self.assertRaisesRegex(g.Blocked, 'private-tag-identity'):
            g.inspect_public_refs(g.Guard(policy()), self.repo, ['refs/tags/other-fixture'])

    def test_shallow_full_audit_is_rejected(self):
        (self.repo / '.git/shallow').write_text(self.base + '\n')
        with self.assertRaisesRegex(g.Blocked, 'shallow-history'):
            g.inspect_public_refs(g.Guard(policy()), self.repo, ['refs/heads/master'])

    def test_split_manifest_and_hash(self):
        payload = gzip.compress(b'nebulaVersion')
        self.commit('fixture.part1', payload[:8])
        self.commit('fixture.part2', payload[8:])
        # Test final tree against its immediate parent, without concealing a partial-history commit.
        base = self.run_git('rev-parse', 'HEAD^').decode().strip()
        group = {'name': 'assembled.gz', 'parts': ['fixture.part1', 'fixture.part2'], 'sha256': g.digest(payload)}
        guard = g.Guard(policy())
        g.inspect_git(guard, self.repo, base, 'HEAD', [group])
        self.assertTrue(guard.findings)
        with self.assertRaises(g.Blocked):
            g.inspect_git(g.Guard(policy()), self.repo, base, 'HEAD')
        with self.assertRaises(g.Blocked):
            g.inspect_git(g.Guard(policy()), self.repo, base, 'HEAD', [{**group, 'sha256': '0' * 64}])


class ExtractionTests(unittest.TestCase):
    """Real extractors, mandatory in the pinned publication Nix shell."""
    def test_real_image_ocr(self):
        from PIL import Image, ImageDraw, ImageFont
        image = Image.new('RGB', (600, 120), 'white')
        font = ImageFont.truetype(os.environ['PUBLICATION_TEST_FONT'], 64)
        ImageDraw.Draw(image).text((20, 15), 'nebulaVersion', fill='black', font=font)
        output = io.BytesIO()
        image.save(output, format='PNG')
        data = output.getvalue()
        guard = g.Guard(policy())
        guard.scan('synthetic-ocr.png', data)
        self.assertIn('hosts', {row['rule'] for row in guard.findings})
        zipped = io.BytesIO()
        with zipfile.ZipFile(zipped, 'w') as archive:
            archive.writestr('clean.txt', 'clean')
        with self.assertRaisesRegex(g.Blocked, 'polyglot-container'):
            g.Guard(policy()).scan('synthetic-polyglot.png', data + zipped.getvalue())
        with self.assertRaisesRegex(g.Blocked, 'zip-trailing-data'):
            g.Guard(policy()).scan('synthetic-polyglot.zip', zipped.getvalue() + data)

    def test_real_pdf_text_and_metadata(self):
        pdf = pdf_fixture()
        guard = g.Guard(policy())
        guard.scan('synthetic-document.pdf', pdf)
        self.assertTrue({'hosts', 'personal'} <= {row['rule'] for row in guard.findings})

    def test_real_pdf_attachment_blocks(self):
        with self.assertRaisesRegex(g.Blocked, 'pdf-attachments-not-admitted'):
            g.Guard(policy()).scan('attachment.pdf', pdf_fixture(attachment=True))

    def test_pdf_attachments_block(self):
        # The attachment listing is a separate mandatory surface, even with no visible text.
        def extract(argv, cwd=None):
            if argv[0] == 'exiftool':
                return b'[{}]'
            if argv[0] == 'pdfdetach':
                return b'1 embedded files\n1: synthetic.txt\n'
            raise AssertionError('Attachment must block before other extraction')
        with patch.object(g, 'command', side_effect=extract):
            with self.assertRaisesRegex(g.Blocked, 'pdf-attachments-not-admitted'):
                g.Guard(policy()).scan('attachment.pdf', b'%PDF-1.4 fixture')


if __name__ == '__main__':
    unittest.main()
