"""Edición local v4; pin externo obligatorio, transporte exclusivo sin red."""
import argparse
from collections import Counter
from datetime import datetime
import gzip
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from typing import Any

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
CACHE = ROOT / '.cache/preservacion-v4-sol'
PARENT = Path('/home/elies/Repos/IRoboPF')
OLD = PARENT / '.cache/orquestador-preservacion/paquete-v3'
BASE = '960773f909d4ecff290edfa3d7a7b2699a8445d3'
sys.path.insert(0, str(ROOT / 'tools/procedencia'))
p = importlib.import_module('preservacion')
spec = importlib.util.spec_from_file_location('v3', ROOT / 'docs/procedencia/preservacion-v3/recolector.py')
assert spec and spec.loader
v3 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v3)
HASH = re.compile(r'(?<![0-9a-f])[0-9a-f]{64}(?![0-9a-f])')
PRIVATE = {'headers', 'redirects', 'cookie', 'cookies', 'authorization', 'set-cookie', 'token', 'password', 'secret', 'localPath'}
EXCLUDED = ('necesidades-expertas', 'correcciones-x', 'revision-corpus', 'revision-inventario', '/fixtures/', 'inventario-pruebas', '/contenido/', '/contenidos/', '/preservacion-v4-sol/', '/scratch/', '/validacion/', '/tmp/', '/checkout-validacion/', '/node_modules/', '/.venv/', '/synthetic/', '/mocks/')
EXACT_URLS = frozenset(p.strict_json((HERE / 'urls-exactas.json').read_bytes()))


def url(value):
    return value if isinstance(value, str) and value in EXACT_URLS else v3.url(value)


def save(path, value):
    data = p.encoded(value)
    if len(data) > 1_000_000:
        with gzip.open(str(path) + '.gz', 'wb') as f:
            f.write(data)
    else:
        path.write_bytes(data)


def clean(value):
    if isinstance(value, dict):
        return {k: clean(v) for k, v in value.items() if k.lower() not in {x.lower() for x in PRIVATE}}
    if isinstance(value, list):
        return [clean(v) for v in value]
    if isinstance(value, str):
        if value.startswith('/home/'):
            return '[localizador-local-omitido]'
    return value


def put(source, destination):
    p.no_symlink_ancestors(source)
    p.no_symlink_ancestors(destination)
    with source.open('rb') as inp, destination.open('xb') as out:
        shutil.copyfileobj(inp, out, 1024 * 1024)
        out.flush()
        os.fchmod(out.fileno(), 0o444)
        os.fsync(out.fileno())


def collect():
    if subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip() != BASE:
        raise ValueError('HEAD distinto')
    staging = Path(tempfile.mkdtemp(dir=CACHE, prefix='recepcion-'))
    (staging / 'sha256').mkdir()
    (staging / 'dependencies').mkdir()
    old = p.strict_json((OLD / 'manifest.json').read_bytes())
    p.check(OLD / 'manifest.json', p.fingerprint(ROOT / 'docs/procedencia/preservacion-v3/manifest.json'))
    transport = p.strict_json((OLD / 'transporte-v2.json').read_bytes())
    objects: dict[str, dict[str, Any]] = {}
    deps = []
    locations = {}
    references: dict[str, set[str]] = {}
    events: dict[str, list[dict[str, Any]]] = {}
    crops = set()
    exclusions = []

    def dep(path, source, historical=False):
        fp = p.fingerprint(path)
        payload = path.read_bytes()
        sanitized = False
        if path.suffix == '.json' or path.name.endswith('.json.gz'):
            decoded = gzip.decompress(payload) if path.suffix == '.gz' else payload
            payload = p.encoded(clean(p.strict_json(decoded)))
            if path.suffix == '.gz':
                payload = gzip.compress(payload, mtime=0)
            sanitized = payload != path.read_bytes()
        sha = hashlib.sha256(payload).hexdigest()
        target = staging / 'dependencies' / sha
        if not target.exists():
            p.publish(target, payload)
        record = {'path': source, **p.fingerprint(target), 'sourceSha256': fp['sha256'], 'sourceSha512': fp['sha512'], 'sourceSize': fp['size'], 'sanitized': sanitized, 'historical': historical}
        deps.append(record)
        return record

    for name in ('manifest.json', 'transporte-v2.json'):
        # Marcadores históricos exactos, sin transformación.
        path = OLD / name
        fp = p.fingerprint(path)
        target = staging / 'dependencies' / fp['sha256']
        if not target.exists():
            put(path, target)
        deps.append({'path': 'heredado/' + name, **fp, 'sourceSha256': fp['sha256'], 'sourceSha512': fp['sha512'], 'sourceSize': fp['size'], 'sanitized': False, 'historical': True})
    for d in old['dependencies']:
        path = p.safe_source(OLD, 'dependencies/' + d['sha256'])
        p.check(path, d)
        fp = p.fingerprint(path)
        target = staging / 'dependencies' / fp['sha256']
        if not target.exists():
            put(path, target)
        deps.append({'path': 'heredado/' + d['path'], **fp, 'sourceSha256': fp['sha256'], 'sourceSha512': fp['sha512'], 'sourceSize': fp['size'], 'sanitized': False, 'historical': True})
    for o in transport['blobs'] + old['annex']:
        path = p.safe_source(OLD, 'sha256/' + o['sha256'])
        p.check(path, o)
        objects[o['sha256']] = {k: o[k] for k in ('sha256', 'sha512', 'size')}
        objects[o['sha256']].update(kind=o.get('class', 'original-oficial-candidato'), inherited=True, acquisitions=[], references=['heredado/manifest.json'])
        locations[o['sha256']] = path
    if len(objects) != 945:
        raise ValueError('Corte heredado distinto')
    tracked = subprocess.check_output(['git', 'ls-tree', '-rz', '--name-only', BASE]).decode().split('\0')
    for name in sorted(filter(None, tracked)):
        if any(term in name for term in EXCLUDED):
            continue
        path = ROOT / name
        if not name.startswith(('docs/procedencia/', 'tools/procedencia/')):
            continue
        if path.is_symlink():
            continue
        if p.HASH.fullmatch(path.name) or path.suffix.lower() in {'.pdf', '.png', '.zip'}:
            fp = p.fingerprint(path)
            locations.setdefault(fp['sha256'], path)
            continue
        compressed = path.name.endswith('.json.gz') and ('/editorial/' in name or 'pasajes-primarios' in name or 'decisiones-195-hojas' in name)
        if path.suffix not in {'.json', '.md', '.py', '.toml', '.lock', '.sh', '.nix'} and not compressed:
            continue
        # Índices masivos y artefactos generados no son recetas documentales.
        if path.stat().st_size > 64 * 1024 * 1024:
            exclusions.append({'path': name, 'reason': 'indice-mayor-64MiB'})
            continue
        try:
            d = dep(path, name)
        except (ValueError, UnicodeError):
            exclusions.append({'path': name, 'reason': 'metadato-JSON-invalido-no-reparado', 'sha256': p.fingerprint(path)['sha256']})
            continue
        text = gzip.decompress(path.read_bytes()).decode() if compressed else path.read_text()
        for sha in HASH.findall(text):
            references.setdefault(sha, set()).add(name)
        if path.suffix != '.json' and not compressed:
            continue
        value = p.strict_json(text)
        for rec in p.nodes(value):
            for key, item in rec.items():
                if isinstance(item, str) and ('facsimil' in key.lower() or key == 'cropSha256') and p.HASH.fullmatch(item):
                    crops.add(item)
                if 'facsimil' in key.lower() and isinstance(item, dict):
                    crop = item.get('sha256')
                    if isinstance(crop, str) and p.HASH.fullmatch(crop):
                        crops.add(crop)
            sha = rec.get('sha256')
            if not isinstance(sha, str) or not p.HASH.fullmatch(sha):
                continue
            # Solo localizadores entregados, nunca otras cachés o worktrees.
            for key in ('localPath', 'path'):
                loc = rec.get(key)
                if not isinstance(loc, str):
                    continue
                candidate = Path(loc)
                if not candidate.is_absolute():
                    candidate = ROOT / candidate
                allowed = candidate.is_relative_to(ROOT) or candidate.is_relative_to(PARENT / '.cache/procedencia') or candidate.is_relative_to(PARENT / 'docs/procedencia') or candidate.is_relative_to(PARENT / '.cache/redondeo-tgss-mensual')
                if allowed and not any(term in str(candidate) for term in EXCLUDED) and candidate.is_file() and not candidate.is_symlink():
                    if p.fingerprint(candidate)['sha256'] == sha:
                        locations.setdefault(sha, candidate)
            canonical = url(rec.get('canonicalUrl', rec.get('url')))
            final = url(rec.get('finalUrl'))
            date = rec.get('retrievedAt', rec.get('acquiredAt'))
            status = rec.get('httpStatus', rec.get('status'))
            if canonical and ('finalUrl' not in rec or final) and isinstance(date, str) and status == 200 and all(k in rec for k in ('sha512', 'size')):
                try:
                    parsed = datetime.fromisoformat(date.replace('Z', '+00:00'))
                    assert parsed.tzinfo
                except (ValueError, AssertionError):
                    continue
                events.setdefault(sha, []).append({**{k: rec[k] for k in ('sha256', 'sha512', 'size')}, 'canonicalUrl': canonical, 'finalUrl': final, 'retrievedAt': date, 'httpStatus': 200, 'dependency': d['sha256']})
    # Cinco CAS TGSS explícitos del índice entregado; no explorar otros checkouts.
    delivered = p.strict_json((ROOT / 'docs/procedencia/revisiones/preservacion-v3-sol/posteriores.json').read_bytes())
    for row in delivered['objects']:
        if row['sources'] == ['docs/procedencia/auditorias/tgss-etapas-operativas/binarios.json']:
            candidate = Path(row['path'])
            if not str(candidate).startswith('/home/elies/.t3/worktrees/IRoboPF/t3-dcd41bbd/.cache/tgss-etapas/cas/sha256/'):
                raise ValueError('Localizador TGSS no entregado')
            p.check(candidate, row)
            locations[row['sha256']] = candidate
    # Excepción individual oficial: PDF AEAT recuperado en una revisión de X.
    # No se recorre ni se copia el resto de ese material no oficial.
    appendix = '95d7f10a386b345af1cb9249821faa0c8bf56a9e7b4c578ac9194c50f9b6bf94'
    candidate = ROOT / 'docs/procedencia/revisiones/correcciones-x-v1' / appendix
    if p.fingerprint(candidate)['sha256'] != appendix:
        raise ValueError('Apéndice distinto')
    locations[appendix] = candidate
    # Índices CDX de adquisición, auxiliares; no son originales fiscales.
    for sha in ('b804f042c9c8fe96d6e338e12c8c873d5b5e4ad7fe731184791e67c0a2fd1413', 'e3ae5b8dafac259a57a4182d602149f8538d4ae50b715f878d132e31fb1cac0a'):
        candidate = PARENT / '.cache/procedencia/recepcion-r19/retenciones/sha256' / sha
        if p.fingerprint(candidate)['sha256'] != sha:
            raise ValueError('Índice CDX distinto')
        dep(candidate, 'auxiliares-cdx/' + sha + '.json')
    # Resolver referencias por hash solo en los CAS entregados, sin censar cachés.
    for sha in references:
        if sha in locations:
            continue
        for area in ('sha256', 'recepcion-r20/retenciones-2012-2014/sha256',
                     'recepcion-r19/retenciones/sha256', 'retenciones-originales-2012-2016/sha256'):
            candidate = PARENT / '.cache/procedencia' / area / sha
            if candidate.is_file() and not candidate.is_symlink():
                if p.fingerprint(candidate)['sha256'] == sha:
                    locations[sha] = candidate
                    break
    # Los mapas recibidos son controles de bytes, nunca adquisiciones inventadas.
    for sha, path in sorted(locations.items()):
        if sha in objects:
            continue
        fp = p.fingerprint(path)
        valid = [e for e in events.get(sha, []) if all(e[k] == fp[k] for k in fp)]
        if not valid and sha not in crops:
            exclusions.append({'path': path.relative_to(ROOT).as_posix() if path.is_relative_to(ROOT) else 'CAS-entregado/' + sha, 'reason': 'sin-adquisicion-admisible-ni-referencia-facsimil', 'sha256': sha})
            continue
        kind = 'facsimil' if not valid else 'captura-secundaria-URL-oficial' if any(isinstance(e[k], str) and 'web.archive.org' in e[k] for e in valid for k in ('canonicalUrl', 'finalUrl')) else 'documento-primario-candidato'
        objects[sha] = {**fp, 'kind': kind, 'inherited': False, 'acquisitions': valid, 'references': sorted(references.get(sha, set()))}
    for sha in objects:
        put(locations[sha], staging / 'sha256' / sha)
    # El programa, esquema y contratos propios se fijan antes de exportar.
    for path in sorted(HERE.glob('*.py')):
        dep(path, path.relative_to(ROOT).as_posix())
    dep(HERE / 'schema.json', (HERE / 'schema.json').relative_to(ROOT).as_posix())
    dep(HERE / 'urls-exactas.json', (HERE / 'urls-exactas.json').relative_to(ROOT).as_posix())
    resolved = set(objects) | {d['sha256'] for d in deps} | {d['sourceSha256'] for d in deps}
    m: dict[str, Any] = {'format': 'irobopf-preservacion-local-v4', 'edition': 4, 'base': BASE, 'acceptance': 'ninguna', 'objects': sorted(objects.values(), key=lambda o: o['sha256']), 'dependencies': deps, 'unresolvedReferences': [{'sha256': sha, 'sources': sorted(names)} for sha, names in sorted(references.items()) if sha not in resolved], 'exclusions': exclusions}
    p.publish(staging / 'manifest.json', p.encoded(m))
    save(HERE / 'cobertura.json', {'objects': len(objects), 'new': len(objects)-945, 'classes': dict(Counter(o['kind'] for o in objects.values())), 'bytes': sum(o['size'] for o in objects.values()), 'dependencies': len(deps), 'unresolved': len(m['unresolvedReferences']), 'exclusions': len(exclusions)})
    save(HERE / 'coleccion.json', {'source': str(staging), 'manifest': p.fingerprint(staging / 'manifest.json')})
    print(p.fingerprint(staging / 'manifest.json'))


def load(pin, external):
    if not p.HASH.fullmatch(pin):
        raise ValueError('Pin externo requerido')
    p.no_symlink_ancestors(external)
    raw = external.read_bytes()
    if hashlib.sha256(raw).hexdigest() != pin:
        raise ValueError('Manifiesto distinto del pin externo')
    m = p.strict_json(raw)
    schema = p.strict_json((HERE / 'schema.json').read_bytes())
    error = next(p.Draft202012Validator(schema).iter_errors(m), None)
    if error is not None:
        raise ValueError(f'Índice fuera del schema ({error.validator})')
    deps = {d['sha256'] for d in m['dependencies']}
    for group, key in ((m['objects'], 'sha256'), (m['dependencies'], 'path')):
        if len({o[key] for o in group}) != len(group):
            raise ValueError('Identidad repetida')
    for obj in m['objects']:
        if not obj['inherited'] and obj['kind'] != 'facsimil' and not obj['acquisitions']:
            raise ValueError('Falta adquisición')
        for e in obj['acquisitions']:
            if e['dependency'] not in deps or not url(e['canonicalUrl']) or (e['finalUrl'] is not None and not url(e['finalUrl'])):
                raise ValueError('Adquisición no publicable')
            if any(e[k] != obj[k] for k in ('sha256', 'sha512', 'size')):
                raise ValueError('Adquisición distinta')
            if any(isinstance(e[k], str) and 'web.archive.org' in e[k] for k in ('canonicalUrl', 'finalUrl')) and obj['kind'] != 'captura-secundaria-URL-oficial':
                raise ValueError('Captura secundaria mal clasificada')
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)', e['retrievedAt']):
                raise ValueError('Fecha sin zona o imposible')
            datetime.fromisoformat(e['retrievedAt'].replace('Z', '+00:00'))
    return m


def verify(destination, pin, external):
    m = load(pin, external)
    if p.safe_source(destination, 'manifest.json').read_bytes() != external.read_bytes():
        raise ValueError('Marcador sustituido')
    for folder, rows in (('sha256', m['objects']), ('dependencies', m['dependencies'])):
        for row in rows:
            path = p.safe_source(destination, folder + '/' + row['sha256'])
            p.check(path, row)
            if folder == 'dependencies' and not row['historical'] and row['path'].endswith(('.json', '.json.gz')):
                data = gzip.decompress(path.read_bytes()) if row['path'].endswith('.gz') else path.read_bytes()
                value = p.strict_json(data)
                if clean(value) != value:
                    raise ValueError('Metadatos nuevos sin sanear')
    return {'manifest': pin, 'objects': len(m['objects']), 'dependencies': len(m['dependencies']), 'bytes': sum(o['size'] for o in m['objects'])}


def confirm(destination, pin, external):
    receipt = verify(destination, pin, external)
    try:
        for folder in ('sha256', 'dependencies'):
            for path in (destination / folder).iterdir():
                with path.open('rb') as stream:
                    os.fsync(stream.fileno())
            p.sync_directory(destination / folder)
        with (destination / 'manifest.json').open('rb') as stream:
            os.fsync(stream.fileno())
        p.sync_directory(destination)
        p.sync_directory(destination.parent)
    except OSError as error:
        raise p.PublicationDurabilityUnknown('Marcador visible; conservar bytes y repetir confirmación') from error
    return {**receipt, 'durability': 'fsync-confirmed'}


def transfer(source, destination, pin, external):
    m = load(pin, external)
    p.no_symlink_ancestors(source)
    p.no_symlink_ancestors(destination)
    if destination.exists():
        raise FileExistsError(destination)
    verify(source, pin, external)
    required = sum(o['size'] for o in m['objects']) + sum(d['size'] for d in m['dependencies'])
    if shutil.disk_usage(destination.parent).free < required + 100_000_000:
        raise OSError('Espacio insuficiente')
    p.durable_mkdir(destination)
    for folder, rows in (('sha256', m['objects']), ('dependencies', m['dependencies'])):
        p.durable_mkdir(destination / folder)
        for row in rows:
            target = destination / folder / row['sha256']
            if not target.exists():
                put(p.safe_source(source, folder + '/' + row['sha256']), target)
            p.check(target, row)
        p.sync_directory(destination / folder)
    p.publish(destination / 'manifest.json', external.read_bytes())
    return confirm(destination, pin, external)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['collect', 'transfer', 'verify', 'confirm'])
    parser.add_argument('--source', type=Path)
    parser.add_argument('--destination', type=Path)
    parser.add_argument('--manifest', type=Path)
    parser.add_argument('--pin')
    args = parser.parse_args()
    if args.action == 'collect':
        collect()
        return
    if not args.manifest or not args.pin or not args.destination:
        parser.error('Requiere manifest externo, pin y destino')
    if args.action == 'transfer':
        if not args.source:
            parser.error('Requiere source')
        result = transfer(args.source, args.destination, args.pin, args.manifest)
    else:
        result = (confirm if args.action == 'confirm' else verify)(args.destination, args.pin, args.manifest)
    print(json.dumps(result))


if __name__ == '__main__':
    main()
