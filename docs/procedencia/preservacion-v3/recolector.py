"""Ampliación local v3: sobre nuevo, transporte v2 intacto y anexo tipado."""
import argparse
import copy
from datetime import datetime
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
from urllib.parse import unquote, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / 'tools/procedencia'))
import preservacion as p

BASE = '65cff4fd8eb8c6269c2ce97b88e770aa711bff7f'
PARENT = Path('/home/elies/Repos/IRoboPF')
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SKIP = {'node_modules', '.next', 'scratch', '__pycache__', 'uv', 'preservados',
        'necesidades-expertas', 'revision-necesidades-expertas', 'revision-corpus',
        'revision-inventario', 'inventario-pruebas', 'preservacion-v3', 'fixtures',
        'correcciones-x-2051956145145712916', 'correcciones-x-v1', 'contenidos'}


def files(root):
    for directory, dirs, names in os.walk(root, followlinks=False):
        dirs[:] = sorted(d for d in dirs if d not in SKIP and not d.startswith('paquete-')
                         and not (Path(directory) / d).is_symlink())
        for name in sorted(names):
            path = Path(directory) / name
            if not path.is_symlink():
                yield path


def save(path, value):
    path.write_bytes(p.encoded(value))


def preflight():
    entries = subprocess.check_output(['git', 'ls-tree', '-rz', BASE], cwd=ROOT).split(b'\0')
    missing, links = [], []
    count = 0
    for entry in filter(None, entries):
        meta, name = entry.split(b'\t', 1)
        path = ROOT / os.fsdecode(name)
        count += 1
        try:
            path.lstat()
        except FileNotFoundError:
            missing.append(os.fsdecode(name))
            continue
        if meta.startswith(b'120000'):
            links.append({'path': os.fsdecode(name), 'target': os.readlink(path)})
    result = {'base': BASE, 'head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT).decode().strip(),
              'entries': count, 'missing': missing, 'links': links,
              'diff': subprocess.check_output(['git', 'diff', BASE, '--stat'], cwd=ROOT).decode(),
              'diskFree': shutil.disk_usage(PARENT).free}
    save(HERE / 'preflight.json', result)
    if missing or result['head'] != BASE or result['diff']:
        raise ValueError('Base o presencia inesperada')


def url(value):
    if not isinstance(value, str):
        return None
    if p.public_url(value):
        return value
    parsed = urlsplit(value)
    decoded = unquote(parsed.path)
    if '..' in decoded.split('/') or '\\' in decoded or re.search(r'[\x00-\x1f\x7f]', decoded):
        return None
    if (parsed.scheme != 'https' or parsed.username or parsed.password or parsed.fragment
            or parsed.port not in (None, 443) or re.search(r'[\x00-\x20\x7f]', value)):
        return None
    if parsed.hostname == 'www.seg-social.es':
        if (parsed.path.startswith(('/descarga/es/', '/descarga/fr/', '/wps/wcm/connect/wss/', '/wps/portal/wss/internet/'))
                and parsed.query in ('', 'MOD=AJPERES', 'changeLanguage=es')):
            return value
    if (parsed.hostname == 'www.boe.es' and parsed.path == '/diario_boe/xml.php'
            and re.fullmatch(r'id=BOE-A-\d{4}-\d+', parsed.query)):
        return value
    if (parsed.hostname in ('www2.agenciatributaria.gob.es', 'www3.agenciatributaria.gob.es', 'www.agenciatributaria.es')
            and parsed.path.startswith('/static_files/') and parsed.path.endswith('.pdf')
            and not parsed.query):
        return value
    # Captura secundaria: URL de archivo exacta, sin query/credenciales.
    if (parsed.scheme == 'https' and parsed.hostname == 'web.archive.org'
            and not parsed.query and not parsed.fragment and not parsed.username
            and re.fullmatch(r'/web/\d+(?:id_)?/https?://(?:www\.)?agenciatributaria\.es(?::80)?/static_files/[^\s]+', parsed.path)):
        return value
    return None


def collect():
    preflight()
    baseline_path = ROOT / 'docs/procedencia/preservacion/manifest-v2.json'
    baseline = p.strict_json(baseline_path.read_bytes())
    p.validate(baseline)
    if len(baseline['blobs']) != 708 or baseline['bytes'] != 974801535:
        raise ValueError('Baseline inesperada')
    blobs = {}
    for item in baseline['blobs']:
        obj = copy.deepcopy(item)
        obj['sources'] = ['.cache/orquestador-preservacion/paquete-v2/sha256/' + obj['sha256']]
        blobs[obj['sha256']] = obj
    locations: dict[str, list[str]] = {}
    facts = {}
    for area in (PARENT / '.cache/procedencia', PARENT / '.cache/redondeo-tgss-mensual/cas/sha256',
                 ROOT / 'docs/procedencia'):
        for path in files(area):
            if p.HASH.fullmatch(path.name) or path.suffix.lower() in {'.pdf', '.png', '.zip'}:
                if any(x in path.parts for x in ('contenido', 'preservacion')):
                    continue
                fp = p.fingerprint(path)
                sha = fp['sha256']
                source_root = ROOT if path.is_relative_to(ROOT) else PARENT
                prefix = 'checkout:' if source_root == ROOT else 'parent:'
                locations.setdefault(sha, []).append(prefix + path.relative_to(source_root).as_posix())
                facts[sha] = fp
    records: dict[str, list] = {}
    facsimiles: set[str] = set()
    refs: dict[str, set] = {}
    dependencies = {}
    exclusions = []
    # Se leen solo documentos versionados: no trabajo en curso del padre.
    tracked = subprocess.check_output(['git', 'ls-tree', '-rz', '--name-only', BASE, 'docs/procedencia'], cwd=ROOT)
    for name in sorted(filter(None, tracked.decode().split('\0'))):
        path = ROOT / name
        if (path.suffix not in {'.json', '.jsonl', '.md'} or any(part in SKIP for part in path.parts)
                or any(term in name for term in ('correcciones-x', 'necesidades-expertas', '/contenido/', '/preservacion/'))):
            continue
        if path.stat().st_size > 16 * 1024 * 1024:
            exclusions.append({'path': name, 'reason': 'indice-mayor-16MiB'})
            continue
        data = path.read_bytes()
        text = data.decode()
        hashes = set(p.HASH.findall(text))
        if hashes:
            dependencies[name] = p.fingerprint(path)
        for sha in hashes:
            refs.setdefault(sha, set()).add(name)
        if path.suffix == '.md':
            continue
        values = [p.strict_json(line) for line in text.splitlines() if line] if path.suffix == '.jsonl' else [p.strict_json(data)]
        for value in values:
            for record in p.nodes(value):
                facsimile = record.get('facsimileSha256')
                if isinstance(facsimile, str):
                    facsimiles.add(facsimile)
                sha = record.get('sha256')
                if not isinstance(sha, str) or not ('canonicalUrl' in record or 'url' in record):
                    continue
                canonical, final = url(record.get('canonicalUrl', record.get('url'))), url(record.get('finalUrl'))
                if not canonical or not final:
                    exclusions.append({'path': name, 'sha256': sha, 'reason': 'URL-no-admitida'})
                    continue
                event = {k: record.get(k) for k in ('sha256', 'sha512', 'size', 'retrievedAt', 'httpStatus')}
                event.update(canonicalUrl=canonical, finalUrl=final, source=name, sourceSha256=dependencies[name]['sha256'])
                records.setdefault(sha, []).append(event)
    annex = []
    matrix = []
    for sha in sorted(set(locations) | set(records) | set(blobs)):
        events = records.get(sha, [])
        valid = [e for e in events if sha in facts and all(e[k] == facts[sha][k] for k in ('sha256', 'sha512', 'size')) and e['httpStatus'] == 200]
        secondary = any('web.archive.org' in e['finalUrl'] for e in valid)
        kind = 'captura-secundaria-URL-oficial' if secondary else 'documento-primario-candidato'
        if sha in blobs:
            status = 'incluido-v2'
        elif valid or (sha in facsimiles and sha in facts):
            status = 'incluido-nuevo'
            if not valid:
                kind = 'facsimil'
            annex.append({**facts[sha], 'class': kind, 'sources': sorted(locations[sha]),
                          'acquisitions': list({p.encoded(e): e for e in valid}.values()),
                          'references': sorted(refs.get(sha, set()))})
        else:
            status = 'ausente' if sha not in locations else 'excluido-sin-adquisicion'
            kind = 'facsimil-o-auxiliar-sin-adquisicion'
        matrix.append({'sha256': sha, 'status': status, 'class': kind, 'locations': locations.get(sha, []),
                       'manifests': sorted(refs.get(sha, set()))})
    # Las referencias no resueltas incluyen hashes de código: no son todos documentos ausentes.
    unresolved = [{'sha256': sha, 'sources': sorted(names)} for sha, names in sorted(refs.items())
                  if sha not in blobs and sha not in {a['sha256'] for a in annex}]
    transport = copy.deepcopy(baseline)
    transport['blobs'] = list(blobs.values())
    p.validate(transport)
    save(HERE / 'transporte-v2.json', transport)
    envelope = {'format': 'irobopf-ampliacion-local', 'formatVersion': 1, 'edition': 3,
                'acceptance': 'ninguna', 'base': BASE, 'baseline': p.fingerprint(baseline_path),
                'transport': p.fingerprint(HERE / 'transporte-v2.json'), 'annex': annex,
                'dependencies': [{'path': name, **fp} for name, fp in sorted(dependencies.items())],
                'unresolvedReferences': unresolved, 'exclusions': exclusions}
    save(HERE / 'manifest.json', envelope)
    save(HERE / 'matriz.json', matrix)
    print({'baseline': len(blobs), 'new': len(annex), 'newBytes': sum(a['size'] for a in annex), 'matrix': len(matrix)})


def load():
    m = p.strict_json((HERE / 'manifest.json').read_bytes())
    if set(m) - {'format', 'formatVersion', 'edition', 'acceptance', 'base', 'baseline',
                 'transport', 'annex', 'dependencies', 'unresolvedReferences', 'exclusions'}:
        raise ValueError('Campo desconocido del sobre')
    if (m['format'] != 'irobopf-ampliacion-local' or type(m['formatVersion']) is not int
            or m['formatVersion'] != 1 or type(m['edition']) is not int or m['edition'] != 3
            or m['acceptance'] != 'ninguna'):
        raise ValueError('Sobre inesperado')
    p.check(HERE / 'transporte-v2.json', m['transport'])
    t = p.strict_json((HERE / 'transporte-v2.json').read_bytes())
    p.validate(t)
    deps = {d['path']: d['sha256'] for d in m['dependencies']}
    for obj in m['annex']:
        if set(obj) != {'sha256', 'sha512', 'size', 'class', 'sources', 'acquisitions', 'references'}:
            raise ValueError('Campos del objeto no admitidos')
        if obj['class'] not in {'facsimil', 'documento-primario-candidato', 'captura-secundaria-URL-oficial'}:
            raise ValueError('Clase no admitida')
        if not obj['sources'] or (obj['class'] != 'facsimil' and not obj['acquisitions']):
            raise ValueError('Falta procedencia')
        for event in obj['acquisitions']:
            if set(event) != {'sha256', 'sha512', 'size', 'retrievedAt', 'httpStatus',
                              'canonicalUrl', 'finalUrl', 'source', 'sourceSha256'}:
                raise ValueError('Campos de adquisición no admitidos')
            if (not url(event['canonicalUrl']) or not url(event['finalUrl'])
                    or deps.get(event['source']) != event['sourceSha256']
                    or type(event['httpStatus']) is not int or event['httpStatus'] != 200
                    or any(event[k] != obj[k] for k in ('sha256', 'sha512', 'size'))):
                raise ValueError('Adquisición incoherente')
            date = event['retrievedAt']
            if not isinstance(date, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)', date):
                raise ValueError('Fecha sin formato o zona')
            datetime.fromisoformat(date.replace('Z', '+00:00'))
    objects = t['blobs'] + m['annex']
    if len({o['sha256'] for o in objects}) != len(objects):
        raise ValueError('Hash duplicado')
    for obj in objects:
        if not p.HASH.fullmatch(obj['sha256']) or not re.fullmatch('[a-f0-9]{128}', obj['sha512']):
            raise ValueError('Hash inválido')
        if type(obj['size']) is not int or obj['size'] < 0:
            raise ValueError('Tamaño inválido')
    return m, t, objects


def verify(destination):
    _, _, objects = load()
    for name in ('manifest.json', 'transporte-v2.json'):
        if p.safe_source(destination, name).read_bytes() != (HERE / name).read_bytes():
            raise ValueError('Marcador distinto del pin externo')
    receipt = []
    for obj in objects:
        path = p.safe_source(destination, 'sha256/' + obj['sha256'])
        p.check(path, obj)
        receipt.append(p.fingerprint(path))
    m, _, _ = load()
    for dep in m['dependencies']:
        p.check(p.safe_source(destination, 'dependencies/' + dep['sha256']), dep)
    p.verify(HERE / 'transporte-v2.json', destination)
    return {'destination': str(destination), 'objects': receipt, 'bytes': sum(o['size'] for o in objects)}


def transfer(destination, source=None):
    m, _, objects = load()
    destination = p.no_symlink_ancestors(destination)
    if destination.exists():
        raise FileExistsError(destination)
    if shutil.disk_usage(destination.parent).free < sum(o['size'] for o in objects) + 100_000_000:
        raise OSError('Espacio insuficiente')
    p.durable_mkdir(destination)
    p.publish(destination / 'STAGING-t3-7f0c6fb6.json', p.encoded({'base': BASE, 'owner': 'preservacion-v3', 'completionMarker': 'manifest.json'}))
    p.durable_mkdir(destination / 'sha256')
    for obj in objects:
        if source:
            src = p.safe_source(source, 'sha256/' + obj['sha256'])
        else:
            loc = obj['sources'][0]
            base, rel = (ROOT, loc[9:]) if loc.startswith('checkout:') else (PARENT, loc.removeprefix('parent:'))
            src = p.safe_source(base, rel)
        target = destination / 'sha256' / obj['sha256']
        with src.open('rb') as inp, target.open('xb') as out:
            shutil.copyfileobj(inp, out, 1024 * 1024)
            out.flush()
            os.fchmod(out.fileno(), 0o444)
            os.fsync(out.fileno())
        p.check(target, obj)
    # Dependencias completas del nuevo índice: copia separada; bytes originales intactos.
    p.durable_mkdir(destination / 'dependencies')
    for dep in m['dependencies']:
        target = destination / 'dependencies' / dep['sha256']
        if target.exists():
            p.check(target, dep)
            continue
        src = p.safe_source(source, 'dependencies/' + dep['sha256']) if source else p.safe_source(ROOT, dep['path'])
        p.check(src, dep)
        p.publish(target, src.read_bytes())
    p.sync_directory(destination / 'sha256')
    p.publish(destination / 'transporte-v2.json', (HERE / 'transporte-v2.json').read_bytes())
    p.publish(destination / 'manifest.json', (HERE / 'manifest.json').read_bytes())
    return confirm(destination)


def confirm(destination):
    receipt = verify(destination)
    m, _, _ = load()
    for dep in m['dependencies']:
        p.check(p.safe_source(destination, 'dependencies/' + dep['sha256']), dep)
    for folder in ('sha256', 'dependencies'):
        for path in (destination / folder).iterdir():
            with path.open('rb') as stream:
                os.fsync(stream.fileno())
        p.sync_directory(destination / folder)
    for name in ('manifest.json', 'transporte-v2.json'):
        with (destination / name).open('rb') as stream:
            os.fsync(stream.fileno())
    p.sync_directory(destination)
    p.sync_directory(destination.parent)
    return {**receipt, 'durability': 'fsync-confirmed'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['collect', 'export', 'restore', 'verify', 'confirm'])
    parser.add_argument('--destination', type=Path)
    parser.add_argument('--source', type=Path)
    args = parser.parse_args()
    if args.action == 'collect':
        collect()
        return
    if args.destination is None:
        parser.error('--destination requerido')
    if args.action == 'restore' and args.source is None:
        parser.error('--source requerido')
    result = (transfer(args.destination, args.source) if args.action in {'export', 'restore'}
              else confirm(args.destination) if args.action == 'confirm' else verify(args.destination))
    save(HERE / (args.action + '-recibo.json'), result)
    print({'action': args.action, 'objects': len(result['objects']), 'bytes': result['bytes']})


if __name__ == '__main__':
    main()
