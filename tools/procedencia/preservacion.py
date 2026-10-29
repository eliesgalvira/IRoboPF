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
from typing import TypedDict
from jsonschema import Draft202012Validator, FormatChecker, validators

from preservacion_urls import public_url

HASH = re.compile(r'[0-9a-f]{64}')
EXCLUDED = ('necesidades-expertas', 'revision-corpus', 'revision-inventario',
            'inventario-pruebas', 'synthetic', 'fixture')


class Fingerprint(TypedDict):
    sha256: str
    sha512: str
    size: int


class BlobLocations(TypedDict):
    facts: Fingerprint
    paths: list[str]


def fingerprint(path: Path) -> Fingerprint:
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
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2, allow_nan=False) + '\n').encode()


def strict_json(data):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise ValueError('Clave JSON repetida')
            result[key] = value
        return result

    def invalid_constant(_value):
        raise ValueError('Constante no JSON')
    return json.loads(data, object_pairs_hook=pairs, parse_constant=invalid_constant)


def no_symlink_ancestors(path):
    path = Path(os.path.abspath(path))
    if any(part.is_symlink() for part in (path, *path.parents)):
        raise ValueError('Ancestro enlazado no autorizado')
    return path


def sync_directory(path):
    fd = os.open(path, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def durable_mkdir(path, exist_ok=False):
    path = no_symlink_ancestors(path)
    if path.exists():
        if exist_ok and path.is_dir():
            return
        raise FileExistsError(path)
    missing = [path]
    while not missing[-1].parent.exists():
        missing.append(missing[-1].parent)
    for part in reversed(missing):
        part.mkdir()
        sync_directory(part)
        sync_directory(part.parent)


def publish(path, data):
    """Publicación exclusiva: nunca sustituye un objeto existente."""
    path = no_symlink_ancestors(path)
    durable_mkdir(path.parent, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as out:
        temp = Path(out.name)
        out.write(data)
        out.flush()
        os.fchmod(out.fileno(), 0o444)
        os.fsync(out.fileno())
    try:
        os.link(temp, path)
    finally:
        temp.unlink()
        sync_directory(path.parent)


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def plan(root):
    root = no_symlink_ancestors(root)
    cache = no_symlink_ancestors(root / '.cache/procedencia')
    no_symlink_ancestors(root / 'docs/procedencia')
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
                value = strict_json(text)
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
    selected_bytes = 0
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
        selected_bytes += blob['facts']['size']
    selected_hashes = {b['sha256'] for b in selected}
    result = {'version': 2, 'acceptance': 'ninguna', 'blobs': selected,
            'bytes': selected_bytes,
            'dependencies': [{'path': p, **v} for p, v in sorted(dependencies.items())],
            'unresolvedReferences': [{'sha256': h, 'sources': sorted(ps)} for h, ps in sorted(references.items()) if h not in selected_hashes],
            'exclusions': [value for _, value in sorted({encoded(e): e for e in exclusions}.items())]}
    validate(result)
    return result


def validate(manifest):
    schema = strict_json(Path(__file__).with_name('preservacion.schema.json').read_bytes())
    checker = Draft202012Validator.TYPE_CHECKER.redefine('integer', lambda _checker, value: type(value) is int)
    validator = validators.extend(Draft202012Validator, type_checker=checker)(schema, format_checker=FormatChecker())
    error = next(validator.iter_errors(manifest), None)
    if error is not None:
        # No incluir valores recibidos potencialmente privados en logs.
        raise ValueError(f'Manifiesto fuera del esquema v2: {list(error.absolute_path)} ({error.validator})')
    # Comprobar listas de objetos en tiempo lineal, sin uniqueItems cuadrático.
    def unique(values):
        if len({encoded(value) for value in values}) != len(values):
            raise ValueError('Entrada duplicada')
    for field in ('blobs', 'dependencies', 'unresolvedReferences', 'exclusions'):
        unique(manifest[field])
    dependencies = {d['path']: d['sha256'] for d in manifest['dependencies']}
    if len(dependencies) != len(manifest['dependencies']):
        raise ValueError('Dependencia duplicada')
    seen = set()
    for b in manifest['blobs']:
        unique(b['acquisitions'])
        if not HASH.fullmatch(b['sha256']) or b['sha256'] in seen:
            raise ValueError('Hash inválido o duplicado')
        if not re.fullmatch('[0-9a-f]{128}', b['sha512']) or type(b['size']) is not int or b['size'] < 0:
            raise ValueError('Huella inválida')
        seen.add(b['sha256'])
        for event in b['acquisitions']:
            date = event['retrievedAt']
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})', date):
                raise ValueError('Fecha de adquisición sin formato o zona explícita')
            try:
                datetime.fromisoformat(date.replace('Z', '+00:00'))
            except ValueError as error:
                raise ValueError('Fecha de adquisición imposible') from error
            if (not public_url(event['canonicalUrl']) or not public_url(event['finalUrl'])
                    or dependencies.get(event['source']) != event['sourceSha256']):
                raise ValueError('Adquisición no publicable o dependencia incoherente')
    if manifest['bytes'] != sum(b['size'] for b in manifest['blobs']):
        raise ValueError('Total inválido')


def check(path, blob):
    if fingerprint(path) != {k: blob[k] for k in ('sha256', 'sha512', 'size')}:
        raise ValueError('Bytes alterados: ' + blob['sha256'])


def safe_source(root, relative):
    root = no_symlink_ancestors(root)
    if Path(relative).is_absolute() or '..' in Path(relative).parts:
        raise ValueError('Se requiere ruta relativa portable')
    p = root / relative
    if not p.resolve().is_relative_to(root.resolve()) or any(x.is_symlink() for x in [p, *p.parents]):
        raise ValueError('Ruta externa o enlace')
    return p


def transfer(manifest_path, source, destination, restore=False):
    data = no_symlink_ancestors(manifest_path).read_bytes()
    manifest = strict_json(data)
    validate(manifest)
    source = no_symlink_ancestors(source)
    destination = no_symlink_ancestors(destination)
    durable_mkdir(destination)
    durable_mkdir(destination / 'sha256')
    for blob in manifest['blobs']:
        src = safe_source(source, 'sha256/' + blob['sha256'] if restore else blob['sources'][0])
        target = destination / 'sha256' / blob['sha256']
        # Copia en flujo, nunca hardlink al original. Un fallo no publica manifiesto.
        with src.open('rb') as inp, target.open('xb') as out:
            for chunk in iter(lambda: inp.read(1024 * 1024), b''):
                out.write(chunk)
            out.flush()
            os.fchmod(out.fileno(), 0o444)
            os.fsync(out.fileno())
        check(target, blob)
    sync_directory(destination / 'sha256')
    sync_directory(destination)
    publish(destination / 'manifest.json', data)


def verify(manifest_path, root):
    m = strict_json(no_symlink_ancestors(manifest_path).read_bytes())
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
