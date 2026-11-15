"""Read-only publication gate. Findings never include matched private values."""
import argparse
import base64
import bz2
import gzip
import hashlib
import io
import json
import lzma
import os
import re
import resource
import signal
import subprocess
import sys
import tarfile
import tempfile
import unicodedata
import zipfile
import zlib
from pathlib import Path
from urllib.parse import unquote

PUBLIC_ID = 'IRoboPF <irobopf@users.noreply.github.com>'
MAX_BYTES = 64 * 1024 * 1024
MAX_TOTAL = 512 * 1024 * 1024
MAX_DEPTH = 8
REQUIRED = {'home', 'hosts', 'tailscale', 'ids', 'brief', 'house', 'hardware', 'personal', 'credentials'}


class Blocked(Exception):
    pass


def digest(data):
    return hashlib.sha256(data).hexdigest()


def is_zlib(data):
    return len(data) > 2 and data[0] & 15 == 8 and data[0] >> 4 <= 7 and int.from_bytes(data[:2], 'big') % 31 == 0


def bounded(stream):
    data = stream.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise Blocked('size-limit')
    return data


def command(argv, cwd=None):
    def limits():
        resource.setrlimit(resource.RLIMIT_FSIZE, (MAX_BYTES * 4, MAX_BYTES * 4))
        resource.setrlimit(resource.RLIMIT_AS, (1024 ** 3, 1024 ** 3))
    try:
        with tempfile.TemporaryFile() as out, tempfile.TemporaryFile() as err:
            process = subprocess.Popen(argv, cwd=cwd, stdout=out, stderr=err, start_new_session=True, preexec_fn=limits)
            try:
                if process.wait(timeout=30):
                    raise Blocked('extractor-or-git-failed')
            finally:
                # Reap the primary and kill its process group, including on timeout.
                try:
                    os.killpg(process.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                process.wait()
            out.seek(0)
            return bounded(out)
    except (OSError, subprocess.SubprocessError):
        raise Blocked('extractor-or-git-failed') from None


class Guard:
    def __init__(self, config, exceptions=()):
        if not config.get('privateConfigurationOnly') or not REQUIRED <= config.get('patterns', {}).keys():
            raise Blocked('incomplete-private-policy')
        try:
            self.rules = {k: re.compile(v, re.I) for k, v in config['patterns'].items()}
        except (re.error, TypeError):
            raise Blocked('invalid-private-policy') from None
        self.uuids = [str(x).lower() for x in config.get('knownPrivateThreadUuids', [])]
        if any(not u for u in self.uuids) or any(p.search('') for p in self.rules.values()):
            raise Blocked('empty-private-pattern')
        if set(self.rules) & {'internal-id', 'personal-path', 'network', 'secret', 'fiscal-identity', 'runtime-field'}:
            raise Blocked('private-rule-name-collision')
        self.rules.update({
            'internal-id': re.compile(r'(?:mcp|t3-thread|runtime-request|delegated-task)\s*:', re.I),
            'personal-path': re.compile(r'/(?:home|Users)/[^/\s]+|[A-Z]:\\Users\\[^\\\s]+', re.I),
            'network': re.compile(r'\b(?:100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}|[\w.-]+\.ts\.net)\b', re.I),
            'secret': re.compile(r'-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})\b'),
            'fiscal-identity': re.compile(r'\b(?:[XYZ]?\d{7,8}[A-Z]|ES\d{2}(?:[ -]?\d){20})\b', re.I),
            'runtime-field': re.compile(r'(?:taskId|authorTaskId|reviewTaskId|projectionAuthorTaskId|parentTaskId|threadId|childRunId)[\s"\x27]*[:=]\s*["\x27][a-z0-9%:._-]{8,}', re.I),
        })
        self.exceptions = []
        for row in exceptions:
            if row.get('kind') not in ('synthetic-fixture', 'official-uuid') or not row.get('justification') or not row.get('evidence'):
                raise Blocked('unjustified-exception')
            if not re.fullmatch('[a-f0-9]{64}', row.get('sha256', '')) or not row.get('path') or not row.get('rules'):
                raise Blocked('unbound-exception')
            allowed = {'internal-id', 'runtime-field'} if row['kind'] == 'official-uuid' else {'fiscal-identity', 'runtime-field', 'internal-id', 'network'}
            if set(row['rules']) - allowed:
                raise Blocked('overbroad-uuid-exception')
            self.exceptions.append(row)
        self.total = 0
        self.findings = []
        self.used_exceptions = []

    def finding(self, name, data, rule):
        # Neither the path nor the matched text is emitted: both can be private.
        sha = digest(data)
        for row in self.exceptions:
            if row['path'] == name and row['sha256'] == sha and rule in row['rules']:
                self.used_exceptions.append({'pathSHA256': digest(name.encode()), 'sha256': sha, 'rule': rule, 'kind': row['kind']})
                return
        self.findings.append({'pathSHA256': digest(name.encode()), 'sha256': sha, 'rule': rule})

    def text(self, name, data, text):
        forms = [unicodedata.normalize('NFKC', text)]
        for _ in range(MAX_DEPTH):
            s = unquote(forms[-1]).replace('\\/', '/')
            s = re.sub(r'\\u([a-fA-F0-9]{4})|\\x([a-fA-F0-9]{2})', lambda m: chr(int(m[1] or m[2], 16)), s)
            if s == forms[-1]:
                break
            forms.append(s)
        else:
            self.finding(name, data, 'encoding-depth')
        encoded_forms = list(forms)
        forms += [re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', re.sub(r'([A-Z])([A-Z][a-z])', r'\1 \2', s)) for s in forms]
        for rule, pattern in self.rules.items():
            if any(pattern.search(s) for s in forms):
                self.finding(name, data, rule)
        if any(u in s.lower() for s in forms for u in self.uuids):
            self.finding(name, data, 'known-private-thread')
        return encoded_forms

    def scan(self, name, data, depth=0):
        self.total += len(data)
        if depth > MAX_DEPTH or len(data) > MAX_BYTES or self.total > MAX_TOTAL:
            raise Blocked('inspection-budget')
        self.text(name, data, name)
        # Use a digest label so a decoded filename is not recursively treated
        # as the original encoded filename again.
        self.encoded('name-' + digest(name.encode()), name, depth)
        self.text(name, data, data.decode('utf-8', 'replace'))
        for encoding in ('utf-16-le', 'utf-16-be'):
            if b'\x00' in data[:2048]:
                self.text(name, data, data.decode(encoding, 'replace'))
        child = lambda suffix, body: self.scan(name + suffix, body, depth + 1)
        try:
            if data.startswith(b'\x1f\x8b'):
                obj = zlib.decompressobj(31)
                body = obj.decompress(data, MAX_BYTES + 1)
                if len(body) > MAX_BYTES or not obj.eof or obj.unused_data:
                    raise Blocked('gzip-incomplete-or-trailing')
                cursor, flags = 10, data[3]
                if flags & 4:
                    size = int.from_bytes(data[cursor:cursor + 2], 'little')
                    child('!gzip-extra', data[cursor + 2:cursor + 2 + size])
                    cursor += 2 + size
                for bit, label in ((8, '!gzip-name'), (16, '!gzip-comment')):
                    if flags & bit:
                        end = data.index(b'\x00', cursor)
                        child(label, data[cursor:end])
                        cursor = end + 1
                child('!gzip', body)
                return
            if data.startswith(b'BZh'):
                obj = bz2.BZ2Decompressor()
                body = obj.decompress(data, max_length=MAX_BYTES + 1)
                if len(body) > MAX_BYTES or not obj.eof or obj.unused_data:
                    raise Blocked('bzip2-incomplete-or-trailing')
                child('!bzip2', body)
                return
            if data.startswith(b'\xfd7zXZ'):
                obj = lzma.LZMADecompressor(memlimit=128 * 1024 * 1024)
                body = obj.decompress(data, max_length=MAX_BYTES + 1)
                if len(body) > MAX_BYTES or not obj.eof or obj.unused_data:
                    raise Blocked('xz-incomplete-or-trailing')
                child('!xz', body)
                return
            if is_zlib(data):
                obj = zlib.decompressobj()
                body = obj.decompress(data, MAX_BYTES + 1)
                if len(body) > MAX_BYTES or not obj.eof or obj.unused_data:
                    raise Blocked('zlib-incomplete-or-limit')
                child('!zlib', body)
                return
            if zipfile.is_zipfile(io.BytesIO(data)):
                if not data.startswith((b'PK\x03\x04', b'PK\x05\x06')):
                    raise Blocked('polyglot-container')
                end = data.rfind(b'PK\x05\x06')
                if end < 0 or end + 22 + int.from_bytes(data[end + 20:end + 22], 'little') != len(data):
                    raise Blocked('zip-trailing-data')
                with zipfile.ZipFile(io.BytesIO(data)) as archive:
                    if archive.infolist() and min(e.header_offset for e in archive.infolist()) != 0:
                        raise Blocked('zip-prefixed-data')
                    position = 0
                    for entry in sorted(archive.infolist(), key=lambda e: e.header_offset):
                        header = data[entry.header_offset:entry.header_offset + 30]
                        if entry.header_offset != position or len(header) != 30 or header[:4] != b'PK\x03\x04':
                            raise Blocked('zip-uninspected-gap')
                        if int.from_bytes(header[28:30], 'little'):
                            raise Blocked('zip-local-extra-not-admitted')
                        if int.from_bytes(header[6:8], 'little') & 8 or entry.flag_bits & 8:
                            raise Blocked('zip-streaming-descriptor-not-admitted')
                        position += 30 + int.from_bytes(header[26:28], 'little') + entry.compress_size
                    if position != archive.start_dir:
                        raise Blocked('zip-uninspected-gap')
                    if archive.comment:
                        child('!zip-comment', archive.comment)
                    for entry in archive.infolist():
                        self.text(name, data, entry.filename)
                        if entry.extra:
                            raise Blocked('zip-extra-not-admitted')
                        if entry.comment:
                            child('!entry-comment', entry.comment)
                        if entry.flag_bits & 1 or entry.file_size > MAX_BYTES:
                            raise Blocked('encrypted-or-large-entry')
                        if entry.is_dir() and entry.file_size:
                            raise Blocked('directory-with-payload')
                        with archive.open(entry) as f:
                            child('!' + entry.filename, bounded(f))
                return
            if len(data) > 262 and data[257:262] == b'ustar':
                with tarfile.open(fileobj=io.BytesIO(data), mode='r:') as archive:
                    for entry in archive:
                        info = {k: v.decode('latin1') if isinstance(v, bytes) else v for k, v in entry.get_info().items()}
                        child('!tar-metadata', json.dumps(info).encode())
                        if not (entry.isfile() or entry.isdir()):
                            raise Blocked('archive-link-or-device')
                        if entry.isfile():
                            with archive.extractfile(entry) as f:
                                child('!' + entry.name, bounded(f))
                    tail = data[archive.offset:]
                    if len(tail) < 1024 or len(data) % 512 or any(tail):
                        raise Blocked('tar-trailing-or-incomplete')
                return
        except (OSError, EOFError, ValueError, RuntimeError, NotImplementedError, zipfile.BadZipFile, tarfile.TarError, zlib.error):
            raise Blocked('malformed-container') from None
        if data.startswith(b'%PDF-'):
            self.document(name, data, 'pdf', depth)
            return
        if data.startswith((b'\x89PNG', b'\xff\xd8', b'GIF8', b'II*\x00', b'MM\x00*', b'RIFF')):
            self.document(name, data, 'image', depth)
            return
        try:
            text = data.decode('utf-16') if data.startswith((b'\xff\xfe', b'\xfe\xff')) else data.decode('utf-8-sig')
            if '\x00' in text:
                if data.startswith((b'\xff\xfe', b'\xfe\xff')):
                    text = data.decode('utf-16')
                else:
                    raise UnicodeError()
        except UnicodeError:
            raise Blocked('unrecognized-binary') from None
        # Decode transports from normalized forms too (URL -> base64 -> UTF-16).
        self.encoded(name, text, depth)

    def encoded(self, name, text, depth):
        child = lambda suffix, body: self.scan(name + suffix, body, depth + 1)
        text = '\x00'.join(self.text(name, text.encode(), text))
        # MIME line wrapping is also an encoding surface.
        text = re.sub(r'(?<=[A-Za-z0-9+/=])\r?\n(?=[A-Za-z0-9+/])', '', text)
        seen = set()
        for match in re.finditer(r'(?<![A-Za-z0-9+/_-])([A-Za-z0-9+/_-]{6,}={0,2})(?![A-Za-z0-9+/_=-])', text):
            token = match[1]
            if token in seen or re.fullmatch('[a-fA-F0-9]+', token):
                continue  # Hexadecimal digests are not base64 transports.
            seen.add(token)
            try:
                body = base64.b64decode(token + '=' * (-len(token) % 4), altchars=b'-_', validate=True)
            except ValueError:
                continue
            # Even opaque decoded bytes can contain a known private literal.
            # Format recognition only controls deeper container extraction.
            self.text(name + '!base64', body, body.decode('utf-8', 'replace'))
            if len(body) % 2 == 0:
                for encoding in ('utf-16-le', 'utf-16-be'):
                    self.text(name + '!base64', body, body.decode(encoding, 'replace'))
            # Printable or a recognized transport: random identifiers are not payloads.
            try:
                decoded = body.decode('utf-8')
                printable = all(c.isprintable() or c in '\r\n\t' for c in decoded)
            except UnicodeError:
                printable = False
            utf16 = len(body) % 2 == 0 and body.count(b'\x00') >= 4
            deflate = is_zlib(body)
            tar = len(body) > 262 and body[257:262] == b'ustar'
            if body.startswith((b'\xff\xfe', b'\xfe\xff', b'\x1f\x8b', b'PK', b'%PDF', b'\x89PNG', b'\xff\xd8', b'GIF8', b'II*\x00', b'MM\x00*', b'RIFF', b'BZh', b'\xfd7zXZ', b'7z\xbc\xaf', b'Rar!', b'\x28\xb5\x2f\xfd', b'\xd0\xcf\x11\xe0')) or printable or utf16 or deflate or tar:
                child('!base64', body)

    def document(self, name, data, kind, depth):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / ('document.pdf' if kind == 'pdf' else 'image')
            p.write_bytes(data)
            metadata = command(['exiftool', '-j', '-a', '-G1', str(p)])
            # Tool-generated file system paths are not embedded metadata.
            rows = json.loads(metadata)
            if any(k.endswith((':Warning', ':Error')) for row in rows for k in row):
                raise Blocked('document-metadata-incomplete')
            rows = [{k: v for k, v in row.items() if k != 'SourceFile' and not k.startswith(('File:', 'System:', 'ExifTool:'))} for row in rows]
            self.text(name, data, json.dumps(rows))
            self.encoded(name + '!metadata', json.dumps(rows), depth)
            if kind == 'pdf':
                detached = command(['pdfdetach', '-list', str(p)]).decode()
                count = re.match(r'^(\d+) embedded files', detached)
                if not count or int(count[1]) != 0:
                    raise Blocked('pdf-attachments-not-admitted')
                info = command(['pdfinfo', str(p)]).decode()
                pages = re.search(r'^Pages:\s+(\d+)$', info, re.M)
                if not pages or not 1 <= int(pages[1]) <= 100 or re.search(r'^Encrypted:\s+yes', info, re.M):
                    raise Blocked('pdf-page-budget-or-encryption')
                extracted = command(['pdftotext', '-enc', 'UTF-8', str(p), '-']).decode()
                self.text(name, data, extracted)
                self.encoded(name + '!pdf-text', extracted, depth)
                command(['pdftoppm', '-r', '90', '-png', str(p), str(Path(tmp) / 'page')])
                images = sorted(Path(tmp).glob('page-*.png'))
                if len(images) != int(pages[1]):
                    raise Blocked('pdf-page-budget')
            else:
                # Animated/multipage formats must not silently inspect only frame one.
                if not data.startswith((b'\x89PNG', b'\xff\xd8')) or b'acTL' in data:
                    raise Blocked('unsupported-multiframe-image')
                if data.startswith(b'\x89PNG') and not data.endswith(b'\x00\x00\x00\x00IEND\xaeB`\x82'):
                    raise Blocked('image-trailing-data')
                if data.startswith(b'\xff\xd8') and (not data.endswith(b'\xff\xd9') or b'\xff\xd9' in data[:-2]):
                    raise Blocked('image-trailing-or-embedded-data')
                if any(k.endswith((':ThumbnailImage', ':PreviewImage', ':JpgFromRaw')) for row in rows for k in row):
                    raise Blocked('embedded-image-not-admitted')
                images = [p]
            for image in images:
                extracted = command(['tesseract', str(image), 'stdout']).decode()
                self.text(name, data, extracted)
                self.encoded(name + '!ocr', extracted, depth)


def git(repo, *args):
    # Keep Git's pack mappings within the extractor address-space budget.
    return command(['git', '-c', 'core.packedGitWindowSize=16m', '-c', 'core.packedGitLimit=64m',
                    '--no-replace-objects', '--literal-pathspecs', *args], repo)


def resolve(repo, ref):
    return git(repo, 'rev-parse', '--verify', '--end-of-options', ref + '^{commit}').decode().strip()


def inspect_git(guard, repo, base, revision, splits=()):
    # Only an explicitly supplied, already audited base can be excluded.
    base, revision = resolve(repo, base), resolve(repo, revision)
    git(repo, 'merge-base', '--is-ancestor', base, revision)
    commits = git(repo, 'rev-list', '--reverse', base + '..' + revision).decode().splitlines()
    inspect_commits(guard, repo, commits, splits)


def inspect_public_refs(guard, repo, refs, splits=()):
    """Explicit public refs only: private local bookmarks are never enumerated."""
    if git(repo, 'rev-parse', '--is-shallow-repository').strip() != b'false':
        raise Blocked('shallow-history')
    tips = []
    for ref in refs:
        if not ref.startswith(('refs/heads/', 'refs/tags/', 'refs/remotes/origin/')):
            raise Blocked('public-ref-must-be-explicit')
        guard.scan('ref-name', ref.encode())
        obj = git(repo, 'rev-parse', '--verify', '--end-of-options', ref).decode().strip()
        for _ in range(MAX_DEPTH):
            kind = git(repo, 'cat-file', '-t', obj).strip()
            if kind != b'tag':
                break
            tag = git(repo, 'cat-file', 'tag', obj)
            header, _, message = tag.partition(b'\n\n')
            tagger = re.search(rb'^tagger (.+) \d+ [+-]\d{4}$', header, re.M)
            if not tagger or tagger[1].decode() != PUBLIC_ID:
                raise Blocked('private-tag-identity')
            guard.scan('tag-message', message)
            guard.scan('tag-header', header)
            target = re.search(rb'^object ([a-f0-9]{40,64})$', header, re.M)
            if not target:
                raise Blocked('invalid-tag')
            obj = target[1].decode()
        else:
            raise Blocked('tag-depth')
        tips.append(resolve(repo, ref))
    commits = git(repo, 'rev-list', '--reverse', *tips).decode().splitlines()
    inspect_commits(guard, repo, commits, splits, full=True)


def inspect_commits(guard, repo, commits, splits, full=False):
    for commit in commits:
        guard.scan('commit-object', git(repo, 'cat-file', 'commit', commit))
        identities = git(repo, 'show', '-s', '--format=%an <%ae>%n%cn <%ce>', commit).decode().splitlines()
        if identities != [PUBLIC_ID, PUBLIC_ID]:
            raise Blocked('private-git-identity')
        guard.scan('commit-message', git(repo, 'show', '-s', '--format=%B', commit))
        parents = git(repo, 'show', '-s', '--format=%P', commit).decode().split()
        if len(parents) != 1 and not full:
            raise Blocked('merge-not-admitted')
        names = (git(repo, 'ls-tree', '-r', '--name-only', '-z', commit) if full else git(repo, 'diff-tree', '--no-commit-id', '--name-only', '-r', '-z', commit)).split(b'\x00')
        covered = set()
        for group in splits:
            parts = group.get('parts', [])
            if not parts or not group.get('name') or len(parts) != len(set(parts)):
                raise Blocked('invalid-split-manifest')
            if not set(parts) & {n.decode() for n in names if n}:
                continue
            bodies = []
            for part in parts:
                guard.text(part, part.encode(), part)
                entry = git(repo, 'ls-tree', '-z', commit, '--', part).split(b'\t', 1)[0].split()
                if len(entry) != 3 or entry[0] not in (b'100644', b'100755'):
                    raise Blocked('missing-split-part')
                bodies.append(git(repo, 'cat-file', 'blob', entry[2].decode()))
                if sum(map(len, bodies)) > MAX_BYTES:
                    raise Blocked('split-budget')
            body = b''.join(bodies)
            if digest(body) != group.get('sha256'):
                raise Blocked('split-hash-mismatch')
            guard.scan(group['name'], body)
            covered.update(parts)
        for raw in filter(None, names):
            name = raw.decode('utf-8', 'strict')
            guard.text(name, raw, name)
            if name in covered:
                continue
            if re.search(r'(?:\.part\d+|\.\d{3}|\.split\d+)$', name, re.I):
                raise Blocked('split-manifest-required')
            entries = git(repo, 'ls-tree', '-z', commit, '--', name).split(b'\x00')
            if not entries[0]:
                continue
            meta = entries[0].split(b'\t', 1)[0].split()
            if meta[0] not in (b'100644', b'100755'):
                raise Blocked('git-link-or-submodule')
            guard.scan(name, git(repo, 'cat-file', 'blob', meta[2].decode()))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--policy', required=True)
    parser.add_argument('--exceptions')
    parser.add_argument('--repo', default='.')
    parser.add_argument('--base', help='Previously audited base for incremental publication')
    parser.add_argument('--public-ref', action='append', help='Audit complete history of each explicit public branch/tag')
    parser.add_argument('--revision', default='HEAD')
    parser.add_argument('--splits', help='External manifest of ordered split transports')
    args = parser.parse_args()
    repo = Path(args.repo).resolve()
    policy = Path(args.policy).resolve()
    try:
        if policy.is_relative_to(repo):
            raise Blocked('policy-must-be-external')
        config = json.loads(policy.read_text())
        exceptions = json.loads(Path(args.exceptions).read_text()) if args.exceptions else []
        guard = Guard(config, exceptions)
        splits = json.loads(Path(args.splits).read_text()) if args.splits else []
        if bool(args.base) == bool(args.public_ref):
            raise Blocked('choose-base-or-public-refs')
        if args.public_ref:
            inspect_public_refs(guard, repo, args.public_ref, splits)
        else:
            inspect_git(guard, repo, args.base, args.revision, splits)
        print(json.dumps({'status': 'blocked' if guard.findings else 'passed', 'findings': guard.findings, 'exceptions': guard.used_exceptions}))
        return 1 if guard.findings else 0
    except (Blocked, OSError, ValueError, UnicodeError, TypeError, KeyError, AttributeError) as error:
        # Never echo arbitrary exception messages or private policy contents.
        code = str(error) if isinstance(error, Blocked) else 'invalid-input'
        print(json.dumps({'status': 'blocked', 'reason': code}))
        return 1


if __name__ == '__main__':
    sys.exit(main())
