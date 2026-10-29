#!/usr/bin/env python3
"""Planificación conservadora y traslado CAS local. Nunca usa red ni VCS."""
import argparse
import hashlib
from datetime import datetime
import json
import os
from pathlib import Path
import re
import tempfile
from urllib.parse import parse_qsl, urlsplit
from typing import TypedDict

from descargar import DEFAULT_HOSTS

HASH = re.compile(r'[0-9a-f]{64}')
EXCLUDED = ('necesidades-expertas', 'revision-corpus', 'revision-inventario',
            'inventario-pruebas', 'synthetic', 'fixture')


class BlobLocations(TypedDict):
    facts: dict[str, str | int]
    paths: list[str]


def fingerprint(path):
    a, b, size = hashlib.sha256(), hashlib.sha512(), 0
    if path.is_symlink() or not path.is_file():
        raise ValueError('Se requiere archivo regular sin enlace')
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            a.update(chunk)
            b.update(chunk)
            size += len(chunk)
    return {'sha256': a.hexdigest(), 'sha512': b.hexdigest(), 'size': size}


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode()


def publish(path, data):
    """Publicación exclusiva: nunca sustituye un objeto existente."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as out:
        temp = Path(out.name)
        out.write(data)
        out.flush()
        os.fsync(out.fileno())
    try:
        os.chmod(temp, 0o444)
        os.link(temp, path)
        descriptor = os.open(path.parent, os.O_RDONLY)
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)
    finally:
        temp.unlink()


def public_url(value):
    if not isinstance(value, str):
        return None
    u = urlsplit(value)
    if (u.scheme != 'https' or u.hostname not in DEFAULT_HOSTS or u.username
            or u.password or u.fragment or u.port not in (None, 443)):
        return None
    # No conservar queries arbitrarias: pueden contener identificadores de casos.
    allowed = {'id', 'p', 'tn', 'acc', 'lang', 'idweb', 'idcat', 'c', 'txt',
               'n', 'fecha', 'version', 'L', 'limit', 'offset'}
    if any(k not in allowed for k, _ in parse_qsl(u.query, keep_blank_values=True)):
        return None
    return value


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def plan(root):
    root = root.resolve()
    cache = root / '.cache/procedencia'
    blobs: dict[str, BlobLocations] = {}
    acquisitions: dict[str, list[dict[str, str | int]]] = {}
    references: dict[str, set[str]] = {}
    dependencies, exclusions = {}, []
    # No sigue symlinks ni confía en el nombre del CAS como prueba de integridad.
    for p in sorted(cache.rglob('*')):
        if p.is_file() and not p.is_symlink() and HASH.fullmatch(p.name):
            rel = p.relative_to(root).as_posix()
            if any(term in rel for term in EXCLUDED):
                exclusions.append({'path': rel, 'reason': 'editorial-o-fixture-no-oficial'})
                continue
            facts = fingerprint(p)
            if facts['sha256'] != p.name:
                exclusions.append({'path': rel, 'reason': 'nombre-CAS-no-coincide', **facts})
                continue
            blobs.setdefault(p.name, {'facts': facts, 'paths': []})['paths'].append(rel)
    for area in (cache, root / 'docs/procedencia'):
        for p in sorted(area.rglob('*')):
            if p.suffix not in ('.json', '.md') or p.is_symlink() or not p.is_file():
                continue
            rel = p.relative_to(root).as_posix()
            if any(term in rel for term in EXCLUDED) or '/preservacion/' in rel:
                continue
            if p.stat().st_size > 16 * 1024 * 1024:
                exclusions.append({'path': rel, 'reason': 'indice-grande-no-leido'})
                continue
            try:
                raw = p.read_bytes()
                text = raw.decode('utf-8')
            except UnicodeError:
                continue
            found = set(HASH.findall(text))
            if found:
                dependencies[rel] = fingerprint(p)
                for sha in found:
                    references.setdefault(sha, set()).add(rel)
            if p.suffix != '.json':
                continue
            try:
                value = json.loads(text)
            except ValueError:
                continue
            for record in nodes(value):
                sha = record.get('sha256')
                if not isinstance(sha, str) or sha not in blobs or 'canonicalUrl' not in record:
                    continue
                url, final = public_url(record['canonicalUrl']), public_url(record.get('finalUrl'))
                if not url or not final:
                    exclusions.append({'path': rel, 'sha256': sha, 'reason': 'URL-no-publicable-o-no-fiscal'})
                    continue
                facts = blobs[sha]['facts']
                if any(record.get(k) != facts[k] for k in ('sha512', 'size')) or record.get('httpStatus') != 200:
                    exclusions.append({'path': rel, 'sha256': sha, 'reason': 'metadatos-no-concuerdan'})
                    continue
                retrieved = record.get('retrievedAt')
                try:
                    datetime.fromisoformat(retrieved.replace('Z', '+00:00'))
                except (ValueError, AttributeError, TypeError):
                    exclusions.append({'path': rel, 'sha256': sha, 'reason': 'fecha-invalida'})
                    continue
                event = {'canonicalUrl': url, 'finalUrl': final,
                         'retrievedAt': retrieved, 'httpStatus': 200,
                         'source': rel, 'sourceSha256': dependencies[rel]['sha256']}
                acquisitions.setdefault(sha, []).append(event)
    selected = []
    for sha, blob in sorted(blobs.items()):
        if sha not in acquisitions:
            exclusions.append({'sha256': sha, 'paths': blob['paths'], 'reason': 'sin-adquisicion-oficial-verificada'})
            continue
        events = {encoded(e): e for e in acquisitions[sha]}
        selected.append({**blob['facts'], 'sources': sorted(blob['paths']),
                         'class': 'original-oficial-candidato',
                         'authenticity': 'no-certificada',
                         'acquisitions': [events[k] for k in sorted(events)],
                         'references': sorted(references.get(sha, set()))})
    selected_hashes = {b['sha256'] for b in selected}
    return {'version': 1, 'acceptance': 'ninguna', 'blobs': selected,
            'bytes': sum(b['size'] for b in selected),
            'dependencies': [{'path': p, **v} for p, v in sorted(dependencies.items())],
            'unresolvedReferences': [{'sha256': h, 'sources': sorted(ps)} for h, ps in sorted(references.items()) if h not in selected_hashes],
            'exclusions': sorted(exclusions, key=lambda e: encoded(e))}


def validate(manifest):
    if manifest.get('version') != 1 or manifest.get('acceptance') != 'ninguna':
        raise ValueError('Versión o aceptación inválida')
    seen = set()
    for b in manifest['blobs']:
        if not HASH.fullmatch(b['sha256']) or b['sha256'] in seen:
            raise ValueError('Hash inválido o duplicado')
        if not re.fullmatch('[0-9a-f]{128}', b['sha512']) or type(b['size']) is not int or b['size'] < 0:
            raise ValueError('Huella inválida')
        seen.add(b['sha256'])
    if manifest['bytes'] != sum(b['size'] for b in manifest['blobs']):
        raise ValueError('Total inválido')


def check(path, blob):
    if fingerprint(path) != {k: blob[k] for k in ('sha256', 'sha512', 'size')}:
        raise ValueError('Bytes alterados: ' + blob['sha256'])


def safe_source(root, relative):
    p = root / relative
    if not p.resolve().is_relative_to(root.resolve()) or any(x.is_symlink() for x in [p, *p.parents]):
        raise ValueError('Ruta externa o enlace')
    return p


def transfer(manifest_path, source, destination, restore=False):
    data = manifest_path.read_bytes()
    manifest = json.loads(data)
    validate(manifest)
    destination.mkdir(parents=True, exist_ok=False)
    (destination / 'sha256').mkdir()
    for blob in manifest['blobs']:
        src = safe_source(source, 'sha256/' + blob['sha256'] if restore else blob['sources'][0])
        target = destination / 'sha256' / blob['sha256']
        # Copia en flujo, nunca hardlink al original. Un fallo no publica manifiesto.
        with src.open('rb') as inp, target.open('xb') as out:
            for chunk in iter(lambda: inp.read(1024 * 1024), b''):
                out.write(chunk)
            out.flush()
            os.fsync(out.fileno())
        check(target, blob)
        os.chmod(target, 0o444)
    publish(destination / 'manifest.json', data)


def verify(manifest_path, root):
    m = json.loads(manifest_path.read_bytes())
    validate(m)
    for blob in m['blobs']:
        check(safe_source(root, 'sha256/' + blob['sha256']), blob)
    return {'objects': len(m['blobs']), 'bytes': m['bytes'], 'integrity': 'verified', 'acceptance': 'ninguna'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['plan', 'export', 'import', 'restore', 'verify'])
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--destination', type=Path)
    args = parser.parse_args()
    if args.action == 'plan':
        publish(args.manifest, encoded(plan(args.root)))
    elif args.action == 'verify':
        print(json.dumps(verify(args.manifest, args.root)))
    else:
        if args.destination is None:
            parser.error('--destination requerido')
        transfer(args.manifest, args.root, args.destination, args.action != 'export')


if __name__ == '__main__':
    main()
