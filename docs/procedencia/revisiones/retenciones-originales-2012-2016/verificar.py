"""Cotejo independiente de originales y citas, sin modificar el corpus."""
import base64
import hashlib
import json
from pathlib import Path

import fitz

BASE = Path('/home/elies/.t3/worktrees/IRoboPF/t3-6e7aee17')
PADRE = Path('/home/elies/Repos/IRoboPF')
AUD = BASE / 'docs/procedencia/auditorias/retenciones-originales-2012-2016'
OUT = BASE / '.cache/revision-retenciones'


def main():
    fuentes = json.loads((AUD / 'fuentes.json').read_text())
    citas = json.loads((AUD / 'citas.json').read_text())
    originales = []
    resultados = []
    for fuente in fuentes:
        path = PADRE / fuente['localPath']
        data = path.read_bytes()
        sha1 = base64.b32encode(hashlib.sha1(data).digest()).decode()
        checks = {
            'sha256': hashlib.sha256(data).hexdigest() == fuente['sha256'],
            'sha512': hashlib.sha512(data).hexdigest() == fuente['sha512'],
            'size': len(data) == fuente['size'],
            'pdf': data.startswith(b'%PDF'),
        }
        cdx = [dict(timestamp=c['timestamp'], original=c['original'], coincide=c['digest'] == sha1)
               for c in fuente['cdxCoincidente']]
        with fitz.open(path) as pdf:
            text = '\n'.join(f'\n--- PAGINA FISICA {i+1} ---\n{pdf[i].get_text()}' for i in range(pdf.page_count))
            (OUT / (fuente['sha256'][:12] + '.txt')).write_text(text)
            for cita in (c for c in citas if c['documentSha256'] == fuente['sha256']):
                p = pdf[cita['page'] - 1]
                receta = cita['facsimile']
                png = p.get_pixmap(dpi=receta['dpi'], colorspace=fitz.csRGB, alpha=receta['alpha']).tobytes('png')
                resultados.append(dict(id=cita['id'], texto=p.get_textbox(fitz.Rect(cita['bbox'])) == cita['quote'],
                    render=hashlib.sha256(png).hexdigest() == receta['sha256'],
                    archivo=hashlib.sha256((BASE / receta['path']).read_bytes()).hexdigest() == receta['sha256']))
        originales.append(dict(sha256=fuente['sha256'], checks=checks, cdx=cdx))
    resultado = dict(originales=originales, citas=resultados, aceptacionFiscal=False)
    (OUT / 'verificacion-independiente.json').write_text(json.dumps(resultado, indent=2, ensure_ascii=False)+'\n')
    assert all(all(o['checks'].values()) and all(c['coincide'] for c in o['cdx']) for o in originales)
    assert all(c['texto'] and c['render'] and c['archivo'] for c in resultados)
    print(f'{len(originales)} originales; {len(resultados)} citas y renders: correctos')


if __name__ == '__main__':
    main()
