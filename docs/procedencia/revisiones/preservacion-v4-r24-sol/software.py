"""Identidades del software actual y comparación histórica; no ejecuta fuentes preservadas."""
import ast
import importlib.metadata
import json
from pathlib import Path
import sys
from revisar import CACHE, ROOT, e, facts, save


def main():
    import pymupdf
    manifest = json.loads((CACHE / 'restauracion/manifest.json').read_bytes())
    deps = {d['path']: d for d in manifest['dependencies']}
    current = []
    for name, mod in sorted(sys.modules.items()):
        path = getattr(mod, '__file__', None)
        if path and name.startswith(('jsonschema', 'referencing', 'rpds', 'attr', 'pymupdf', 'preservacion', 'edicion')):
            file = Path(path)
            if file.is_file():
                current.append(dict(module=name, file=str(file), **facts(file)))
    current.append(dict(module='v3-importado-dinamicamente', file=str(e.v3.__file__), **facts(Path(e.v3.__file__))))
    comparison = []
    for name in ('tools/procedencia/preservacion.py', 'tools/procedencia/preservacion_urls.py', 'tools/procedencia/preservacion.schema.json', 'tools/procedencia/preservacion_ampliacion.schema.json', 'docs/procedencia/preservacion-v3/recolector.py', 'docs/procedencia/preservacion-v4-sol/edicion.py', 'docs/procedencia/preservacion-v4-sol/schema.json'):
        row = deps[name]
        comparison.append(dict(path=name, current=facts(ROOT / name), preserved=row, equalCurrent=facts(ROOT / name)['sha256'] == row['sourceSha256'], equalTransported=facts(ROOT / name)['sha256'] == row['sha256']))
    # AST, sin importar ni ejecutar las fuentes históricas.
    imports = []
    for name in ('tools/procedencia/preservacion.py', 'docs/procedencia/preservacion-v3/recolector.py', 'docs/procedencia/preservacion-v4-sol/edicion.py'):
        tree = ast.parse((CACHE / 'metadatos' / name).read_text())
        imports.append(dict(path=name, imports=[ast.unparse(n) for n in ast.walk(tree) if isinstance(n, (ast.Import, ast.ImportFrom))]))
    save('software.json', dict(interpreter=dict(path=sys.executable, version=sys.version, **facts(Path(sys.executable))), currentImported=current, historicalComparison=comparison, historicalImportsAST=imports, pymupdf=pymupdf.VersionBind, distributions={name: importlib.metadata.version(name) for name in ('PyMuPDF', 'jsonschema', 'referencing', 'attrs', 'rpds-py')}, dependencyLocks=[dict(path=name, current=facts(ROOT / name), preserved=deps.get(name)) for name in ('tools/procedencia/pyproject.toml', 'tools/procedencia/uv.lock', 'tools/procedencia/flake.lock')]))
    print('Software actual identificado; AST histórico leído sin ejecución')

if __name__ == '__main__':
    main()
