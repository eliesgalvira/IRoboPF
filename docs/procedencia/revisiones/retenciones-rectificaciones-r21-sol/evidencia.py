import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

import fitz

OUT = Path('docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol')
PRE = Path('docs/procedencia/revisiones/retenciones-2015-2016-contraste-sol')
R21 = Path('docs/procedencia/correcciones/retenciones-2015-2016-r21')

def sha(data):
    return hashlib.sha256(data).hexdigest()

def main():
    sources = json.loads((PRE / 'fuentes-verificadas.json').read_text())
    wanted = json.loads((R21 / 'recortes-comprobados.json').read_text())['rows']
    results = []
    for row in wanted:
        source = next(s for s in sources if s['sha256'] == row['documentSha256'])
        data = Path(source['path']).read_bytes()
        assert sha(data) == source['sha256']
        assert hashlib.sha512(data).hexdigest() == source['sha512']
        with fitz.open(stream=data, filetype='pdf') as doc:
            page = doc[15]
            png = page.get_pixmap(matrix=fitz.Matrix(3, 3), clip=fitz.Rect(50, 535, 560, 650), alpha=False).tobytes('png')
            name = source['sha256'][:8] + '-p16.png'
            (OUT / name).write_bytes(png)
            results.append({**row, 'actualSha256': sha(png), 'path': name, 'text': page.get_text(clip=fitz.Rect(50, 535, 560, 650)), 'source': source})
            assert sha(png) == row['renderSha256']
            (OUT / (source['sha256'][:8] + '-regularizacion.txt')).write_text('\n'.join(f'PÁGINA {i+1}\n' + doc[i].get_text(sort=True) for i in range(28, min(39, len(doc)))))
    htmls = []
    for row in json.loads((R21 / 'citas-art87-5.json').read_text()):
        source = row['document']
        data = Path(source['path']).read_bytes()
        assert sha(data) == source['sha256'] and len(data) == source['size']
        assert hashlib.sha512(data).hexdigest() == source['sha512']
        text = data.decode()
        sections = {}
        for article in ['a82', 'a84', 'a85', 'a86', 'a87', 'a88']:
            match = re.search(r'<div[^>]+id="' + article + r'"[^>]*>', text)
            assert match, article
            end = re.search(r'<div[^>]+id="a\d+', text[match.end():])
            fragment = text[match.start():match.end() + end.start()] if end else text[match.start():]
            from html import unescape
            normalized = ' '.join(unescape(re.sub('<[^>]+>', ' ', fragment)).split())
            sections[article] = {'fragmentSha256': sha(fragment.encode()), 'text': normalized}
        htmls.append({'document': source, 'sections': sections})
        (OUT / (source['sha256'][:8] + '-articulos.txt')).write_text('\n\n'.join(k + '\n' + v['text'] for k, v in sections.items()))
    (OUT / 'evidencia.json').write_text(json.dumps({'renders': results, 'html': htmls, 'software': fitz.version}, ensure_ascii=False, indent=2))
    # Reproduce el rojo histórico sin permitir escrituras en su carpeta.
    original = Path('docs/procedencia/revisiones/retenciones-2015-2016-sol/repro_rojo.py')
    run = subprocess.run([sys.executable, str(original)], capture_output=True, text=True, check=False)
    (OUT / 'rojo-historico.log').write_text(run.stdout + run.stderr + f'\nexitCode={run.returncode}\n')
    print('Tres renders exactos; dos HTML íntegros; rojo histórico:', run.returncode)

if __name__ == '__main__':
    main()
