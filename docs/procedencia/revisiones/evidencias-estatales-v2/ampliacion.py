"""Pasajes nuevos, erratas y discriminantes; no modifica evidencia previa."""
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from decimal import Decimal
from pathlib import Path

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SCRATCH = ROOT / '.cache/revision-estatales-v2'
sys.dont_write_bytecode = True
import pymupdf  # noqa: E402


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')


def main():
    acquisitions = sum([read(OUT / n) for n in ('adquisiciones.json', 'adquisiciones-erratas-2012.json', 'adquisiciones-ley2012.json')], [])
    passages = []
    for d in acquisitions:
        raw = (OUT / 'cas/sha256' / d['sha256']).read_bytes()
        assert sha(raw) == d['sha256'] and hashlib.sha512(raw).hexdigest() == d['sha512']
        if not d['url'].endswith('.pdf'):
            continue
        with pymupdf.open(stream=raw, filetype='pdf') as pdf:
            if '8745' in d['url']:
                candidates = [n for n in range(50, 95) if 'Artículo 61.' in pdf[n].get_text()]
                assert len(candidates) == 1
                numbers = [candidates[0], candidates[0]+1]
            else:
                numbers = list(range(len(pdf)))
            for n in numbers:
                page = pdf[n]
                text = page.get_text('text', flags=0, sort=False)
                png = page.get_pixmap(dpi=144, colorspace=pymupdf.csRGB, alpha=False, annots=False).tobytes('png')
                (SCRATCH / (sha(png)+'.png')).write_bytes(png)
                (OUT / 'cas/sha256' / sha(png)).write_bytes(png)
                passages.append({'url': d['url'], 'documentSha256': d['sha256'], 'page': n+1, 'bbox': list(page.rect),
                                 'coordinateSystem': 'pymupdf-unrotated-top-left-points', 'quote': text,
                                 'facsimileSha256': sha(png), 'dpi': 144, 'pymupdf': pymupdf.VersionBind, 'textFlags': 0, 'sort': False, 'alpha': False, 'annots': False})
    write('citas-propias-ampliacion.json', passages)
    summaries = []
    for d in acquisitions:
        raw = (OUT / 'cas/sha256' / d['sha256']).read_bytes()
        if 'xml.php' in d['url']:
            tree = ET.fromstring(raw)
            analyses = tree.findall('.//analisis')
            summaries.append({'url': d['url'], 'sha256': d['sha256'], 'analysis': [' '.join(a.itertext()) for a in analyses]})
        if 'act.php' in d['url']:
            text = raw.decode()
            excerpts = []
            for anchor in ('a63', 'datrigesimaquinta'):
                pos = text.index('id="'+anchor+'"')
                end = text.find('<div class="bloque"', pos+1)
                excerpts.append({'anchor': anchor, 'html': text[pos:end]})
            summaries.append({'url': d['url'], 'sha256': d['sha256'], 'excerpts': excerpts})
    write('analisis-boe.json', summaries)
    source = (ROOT / 'lib/dominio/irpf/cuotas/escalas-publicadas.ts').read_text()
    e = ROOT / 'docs/procedencia/evidencias/estatales'
    index = read(e/'citas-indice.json')
    types = []
    for component, official in [('ordinaria', ['12', '14', '18,5', '21,5', '22,5', '23,5']), ('complementaria', ['0,75', '2', '3', '4', '5', '6', '7'])]:
        symbol = 'ESTATAL_'+component.upper()+'_2012_2014'
        block = source.split('export const '+symbol+' = filas([')[1].split('])')[0]
        rows = re.findall(r'\["([0-9.]+)", "([0-9.]+)", "([0-9.]+)"\]', block)
        c = read(e / 'citas' / f'escala-{component}-0-cuota.json')
        with pymupdf.open(Path('/home/elies/Repos/IRoboPF/.cache/procedencia/sha256') / c['documentSha256']) as pdf:
            words = pdf[c['page']-1].get_text('words', flags=0, sort=False)
            for n, literal in enumerate(official):
                box = index[f'escala-{component}-{n}-baseInferior']['cellBBox']
                choices = [w for w in words if w[4] == literal and abs(w[1]-box[1]) < 2 and w[0] > 350]
                assert len(choices) == 1, (component, n, choices)
                percent = Decimal(literal.replace(',', '.'))
                fraction = Decimal(rows[n][2])
                assert percent/100 == fraction and percent != fraction
                types.append({'symbol': symbol+f'[{n}].tipo', 'page': c['page'], 'documentSha256': c['documentSha256'], 'bbox': list(choices[0][:4]), 'literalPercent': literal, 'engineFraction': str(fraction), 'conversion': 'divide-by-100', 'identityRejected': True, 'payloadAcceptance': False})
    assert len(types) == 13
    write('tipos-13.json', types)
    integral = Decimal('17707.20')*Decimal('.12')
    assert integral == Decimal('2124.864') and integral != Decimal('2124.86')
    write('discriminantes-adicionales.json', {'types': 13, 'identityConversionRejected': True, 'ordinaryFirstAccumulatedExactIntegral': str(integral), 'published': '2124.86', 'publishedIsNotUnroundedIntegral': True,
          'tableDistinction': 'DA35.1.a general, DA35.1.b ahorro, DA35.2 retenciones; cifras iguales de DA35.2 no prueban identidad.',
          'historicalAliases': {'count': 190, 'equalImportsDoNotProveAnnualValidity': True}, 'completeRuleAcceptance': False})
    print(json.dumps({'newPassages': len(passages), 'types': len(types), 'analysisDocuments': len(summaries)}))


if __name__ == '__main__':
    main()
