"""Resume controles ejecutados y conserva tres binarios de muestra por hash."""
import json
from revisar import CACHE, OUT, ROOT, facts, save


def main():
    m = json.loads((CACHE / 'restauracion/manifest.json').read_bytes())
    software = json.loads((OUT / 'software.json').read_bytes())
    restoration = json.loads((OUT / 'restauracion.json').read_bytes())
    censo = json.loads((OUT / 'censo.json').read_bytes())
    muestras = json.loads((OUT / 'muestras.json').read_bytes())
    save('resumen.json', dict(physical=restoration['restoredPhysical'], metadata=restoration['materializedPhysical'], currentSourceMismatches=restoration['sourceIdentity']['mismatches'], runtimeDifferences=[r['path'] for r in software['historicalComparison'] if not r['equalCurrent']], typed=censo['typed'], batches={k: dict(rows=len(v), auxiliary=sum(r['auxiliary'] for r in v)) for k,v in censo['batches'].items()}, duplicates=muestras['duplicatesActual'], newObjects=sum(not o['inherited'] for o in m['objects']), exclusions=restoration['exclusions'], unresolved=len(m['unresolvedReferences'])))
    binary = []
    for name in ('mei2025', 'madrid-tabla-ley13-2023', 'colegio-art10-p16'):
        source = CACHE / (name + '.png')
        fp = facts(source)
        dest = OUT / (fp['sha256'] + '.png')
        dest.write_bytes(source.read_bytes())
        binary.append(dict(path=dest.relative_to(ROOT).as_posix(), **fp))
    save('muestras-binarias.json', binary)
    cfg = json.loads((ROOT / '.oxlintrc.json').read_bytes())
    rules = {k:v for k,v in cfg['rules'].items() if k.startswith(('anti-slop/', 'anti-slop-effect/'))}
    assert len(rules) == 16 and set(rules.values()) == {'error'}
    save('anti-slop.json', rules)
    # Configuración de humo conserva severidades; plugins y node_modules del padre solo lectura.
    parent = '/home/elies/Repos/IRoboPF/'
    cfg['jsPlugins'] = [parent + str(p).removeprefix('./') for p in cfg['jsPlugins']]
    (CACHE / 'oxlint.json').write_text(json.dumps(cfg))
    print(json.dumps(json.loads((OUT / 'resumen.json').read_bytes()), ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
