#!/usr/bin/env python3
"""Adquisición acotada y CAS; compatible con download(url, root) del auditor."""
import argparse
from datetime import datetime, timezone
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_HOSTS = frozenset({'www.boe.es', 'boe.es', 'sede.agenciatributaria.gob.es',
                           'www.agenciatributaria.es', 'www3.agenciatributaria.gob.es',
                           'www.seg-social.es', 'www.ine.es', 'servicios.ine.es', 'www.bocm.es',
                           'bocyl.jcyl.es', 'www.borm.es', 'www.hacienda.gob.es',
                           'doe.juntaex.es', 'dogv.gva.es', 'www.cortsvalencianes.es',
                           'www.gobiernodecanarias.org', 'www3.gobiernodecanarias.org',
                           'www.juntadeandalucia.es', 'www.boa.aragon.es', 'sede.asturias.es',
                           'www.caib.es', 'boc.cantabria.es', 'docm.jccm.es',
                           'dogc.gencat.cat', 'www.xunta.gal', 'web.larioja.org',
                           'ias1.larioja.org', 'www.ceuta.es', 'bomemelilla.es'})
# La lista fiscal no convierte una descarga en norma auténtica o vigente.
# Fuentes técnicas/editoriales requieren --allow-host o hosts= explícito.
PUBLIC_HEADERS = frozenset({'content-type', 'content-length', 'content-encoding',
                            'etag', 'last-modified', 'date', 'cache-control', 'expires',
                            'vary', 'content-disposition', 'accept-ranges'})
MAX_BYTES = 64 * 1024 * 1024


def sanitize_metadata(value):
    """Sanea copias antes de archivar o devolver; nunca altera bytes originales."""
    if isinstance(value, list):
        return [sanitize_metadata(item) for item in value]
    if isinstance(value, dict):
        return {key: ({name.lower(): item for name, item in child.items()
                       if name.lower() in PUBLIC_HEADERS}
                      if key.lower() == 'headers' and isinstance(child, dict)
                      else sanitize_metadata(child))
                for key, child in value.items()
                if key.lower() not in {'cookie', 'set-cookie', 'authorization', 'proxy-authorization'}}
    return value


def verify_origin(record, requested_url, hosts):
    if record['canonicalUrl'] != requested_url:
        raise ValueError('Índice de caché asociado a otra URL')
    check_url(requested_url, hosts)
    check_url(record['finalUrl'], hosts)
    redirects = record.get('redirects')
    if redirects is None:
        return {'status': 'pending', 'reason': 'Cadena de redirecciones histórica desconocida'}
    if not isinstance(redirects, list) or len(redirects) > 5:
        raise ValueError('Cadena de redirecciones inválida')
    current = requested_url
    for redirect in redirects:
        if redirect['from'] != current or redirect['status'] not in (301, 302, 303, 307, 308):
            raise ValueError('Cadena de redirecciones discontinua')
        check_url(redirect['to'], hosts)
        current = redirect['to']
    if current != record['finalUrl']:
        raise ValueError('Destino de redirecciones no coincide')
    return {'status': 'allowlisted'}


def digest(path, algorithm='sha256'):
    h = hashlib.new(algorithm)
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()


def atomic_json(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, mode='w', delete=False) as out:
        temporary = Path(out.name)
        json.dump(data, out, ensure_ascii=False, indent=2, allow_nan=False)
        out.write('\n')
    os.replace(temporary, path)


def check_url(url, hosts):
    parsed = urllib.parse.urlsplit(url)
    if (parsed.scheme != 'https' or parsed.hostname not in hosts or parsed.username
            or parsed.password or parsed.port not in (None, 443) or parsed.fragment):
        raise ValueError('URL fuera de la allowlist HTTPS explícita: ' + url)


class Redirects(urllib.request.HTTPRedirectHandler):
    def __init__(self, hosts):
        self.hosts = hosts
        self.chain = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        check_url(newurl, self.hosts)
        if len(self.chain) >= 5:
            raise ValueError('Más de cinco redirecciones')
        self.chain.append({'from': req.full_url, 'to': newurl, 'status': code,
                           'headers': sanitize_metadata({'headers': dict(headers.items())})['headers']})
        time.sleep(2)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def verify_blob(record, root):
    sha = record['sha256']
    if not re.fullmatch('[0-9a-f]{64}', sha):
        raise ValueError('SHA256 mal formado')
    path = Path(root) / 'sha256' / sha
    if (digest(path) != sha or digest(path, 'sha512') != record['sha512']
            or path.stat().st_size != record['size']):
        raise ValueError('Original corrupto')
    return path


def archive(record, root):
    root = Path(root)
    record = sanitize_metadata(record)
    key = hashlib.sha256(record['canonicalUrl'].encode()).hexdigest()
    # El historial se identifica por todo el registro, no solo por el contenido.
    event = hashlib.sha256(json.dumps(record, sort_keys=True).encode()).hexdigest()
    previous = root / 'urls' / (key + '.json')
    if previous.exists():
        old = sanitize_metadata(json.loads(previous.read_text()))
        old_event = hashlib.sha256(json.dumps(old, sort_keys=True).encode()).hexdigest()
        atomic_json(root / 'history' / key / (old_event + '.json'), old)
    atomic_json(root / 'history' / key / (event + '.json'), record)
    atomic_json(root / 'urls' / (key + '.json'), record)


def download(url: str, root: Path, *, expected_sha256=None, hosts=DEFAULT_HOSTS,
             refresh=False, max_bytes=MAX_BYTES) -> dict:
    check_url(url, hosts)
    if expected_sha256 is not None and not re.fullmatch('[0-9a-f]{64}', expected_sha256):
        raise ValueError('Hash esperado inválido')
    root = Path(root)
    (root / 'sha256').mkdir(parents=True, exist_ok=True)
    record = root / 'urls' / (hashlib.sha256(url.encode()).hexdigest() + '.json')
    lock_path = Path(tempfile.gettempdir()) / ('irobopf-download-' + str(os.getuid()) + '.lock')
    with lock_path.open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if record.exists():
            cached = sanitize_metadata(json.loads(record.read_text()))
            cached['sourcePolicy'] = verify_origin(cached, url, hosts)
            verify_blob(cached, root)  # Nunca oculta corrupción mediante redownload.
            if not refresh:
                if expected_sha256 and expected_sha256 != cached['sha256']:
                    raise ValueError('La caché no corresponde al hash esperado')
                return cached
            archive(cached, root)
        for attempt in range(3):
            redirects = Redirects(hosts)
            opener = urllib.request.build_opener(redirects)
            request = urllib.request.Request(url, headers={
                'User-Agent': 'IRoboPF-auditoria/2.0 (+https://github.com/eliesgalvira/IRoboPF)',
                'Accept-Encoding': 'identity'})
            temporary = None
            try:
                started = time.monotonic()
                with opener.open(request, timeout=30) as response:
                    if response.status != 200:
                        raise ValueError('Solo se acepta respuesta completa 200')
                    headers = sanitize_metadata({'headers': dict(response.headers.items())})['headers']
                    mime = response.headers.get_content_type()
                    if response.headers.get('Content-Encoding', 'identity') != 'identity':
                        raise ValueError('Codificación de transporte no admitida')
                    declared = response.headers.get('Content-Length')
                    if declared and int(declared) > max_bytes:
                        raise ValueError('Documento demasiado grande')
                    size = 0
                    with tempfile.NamedTemporaryFile(dir=root, delete=False) as out:
                        temporary = Path(out.name)
                        while chunk := response.read1(65536):
                            size += len(chunk)
                            if size > max_bytes or time.monotonic() - started > 180:
                                raise ValueError('Límite de tamaño o duración excedido')
                            out.write(chunk)
                    if declared and size != int(declared):
                        raise ValueError('Cuerpo truncado')
                    with temporary.open('rb') as source:
                        magic = source.read(5)
                    if (mime == 'application/pdf' or urllib.parse.urlsplit(url).path.lower().endswith('.pdf')) and magic != b'%PDF-':
                        raise ValueError('Respuesta no PDF (posible HTML de error)')
                    if size == 0:
                        raise ValueError('Documento vacío')
                    sha = digest(temporary)
                    if expected_sha256 and sha != expected_sha256:
                        raise ValueError('Fuente mutable: hash esperado no recuperable')
                    blob = root / 'sha256' / sha
                    if blob.exists() and digest(blob) != sha:
                        raise ValueError('Colisión con CAS corrupto')
                    os.replace(temporary, blob)
                    temporary = None
                    ids = re.findall(r'BOE-[AB]-\d{4}-\d+', url)
                    metadata = {
                        'schemaVersion': 2, 'canonicalUrl': url, 'finalUrl': response.url,
                        'retrievedAt': datetime.now(timezone.utc).isoformat(),
                        'httpStatus': 200, 'headers': headers, 'redirects': redirects.chain,
                        'sha256': sha, 'sha512': digest(blob, 'sha512'), 'size': size,
                        'mimeType': mime, 'localPath': str(blob.resolve()),
                        'officialIdentifier': {'value': ids[0] if ids else None, 'status': 'url-derived' if ids else 'pending'},
                        'publication': {'status': 'pending'}, 'consolidation': {'status': 'pending'},
                        'eli': {'status': 'pending'}, 'csv': {'status': 'pending'},
                        'authenticity': {'status': 'not-validated'}}
                    metadata['sourcePolicy'] = verify_origin(metadata, url, hosts)
                    archive(metadata, root)
                    return metadata
            except urllib.error.HTTPError as error:
                if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                    raise
                retry = error.headers.get('Retry-After', '')
                time.sleep(min(int(retry), 30) if retry.isdecimal() else 2 ** (attempt + 1))
            except (urllib.error.URLError, TimeoutError):
                if attempt == 2:
                    raise
                time.sleep(2 ** (attempt + 1))
            finally:
                if temporary is not None:
                    temporary.unlink(missing_ok=True)
                time.sleep(2)
    raise RuntimeError('Descarga agotada')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url')
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[2] / '.cache/procedencia')
    parser.add_argument('--expected-sha256')
    parser.add_argument('--refresh', action='store_true')
    parser.add_argument('--allow-host', action='append', help='Allowlist exacta que sustituye la predeterminada')
    args = parser.parse_args()
    print(json.dumps(download(args.url, args.root, expected_sha256=args.expected_sha256,
                              refresh=args.refresh, hosts=frozenset(args.allow_host) if args.allow_host else DEFAULT_HOSTS), ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
