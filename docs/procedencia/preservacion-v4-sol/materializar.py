"""Reconstruye metadatos y recetas por rutas portables, sin ejecutar código conservado."""
import argparse
from pathlib import Path

import edicion as e


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--package', required=True, type=Path)
    parser.add_argument('--destination', required=True, type=Path)
    parser.add_argument('--manifest', required=True, type=Path)
    parser.add_argument('--pin', required=True)
    args = parser.parse_args()
    e.verify(args.package, args.pin, args.manifest)
    m = e.load(args.pin, args.manifest)
    destination = e.p.no_symlink_ancestors(args.destination)
    e.p.durable_mkdir(destination)
    for dep in m['dependencies']:
        target = destination / dep['path']
        e.p.no_symlink_ancestors(target)
        e.p.durable_mkdir(target.parent, exist_ok=True)
        source = e.p.safe_source(args.package, 'dependencies/' + dep['sha256'])
        e.put(source, target)
        e.p.check(target, dep)
    print({'dependencies': len(m['dependencies']), 'destination': str(destination), 'status': 'bytes-materializados; no se ha ejecutado código histórico'})


if __name__ == '__main__':
    main()
