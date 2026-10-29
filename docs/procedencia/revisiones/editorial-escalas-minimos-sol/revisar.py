"""Reextracción independiente sin ejecutar ni modificar los instrumentos del autor."""
from __future__ import annotations

import hashlib
import json
from decimal import Decimal
from pathlib import Path

import pymupdf

OUT = Path(__file__).resolve().parent
AUTHOR = Path('docs/procedencia/editorial/escalas-minimos')


def read(path: Path) -> object:
    return json.loads(path.read_bytes())


def save(name: str, value: object) -> None:
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def main() -> None:
    originals = json.loads((AUTHOR / 'originales.json').read_bytes())
    citations = json.loads((AUTHOR / 'fuentes-primarias.json').read_bytes())
    cells = json.loads((AUTHOR / 'celdas.json').read_bytes())
    fichas = json.loads((AUTHOR / 'fichas.json').read_bytes())
    documents = {}
    checked = []
    for original in originals:
        raw = Path(original['path']).read_bytes()
        result = dict(original)
        result['hashesCoinciden'] = (
            sha(raw) == original['sha256']
            and hashlib.sha512(raw).hexdigest() == original['sha512']
            and len(raw) == original['size'])
        documents[original['sha256']] = original
        checked.append(result)
    save('originales-reabiertos.json', checked)
    extracts = []
    pages = {}
    for citation in citations:
        original = documents[citation['original']]
        with pymupdf.open(original['path']) as pdf:
            page = pdf[citation['pagina'] - 1]
            text = page.get_text('text', clip=pymupdf.Rect(citation['caja']), flags=0, sort=False)
            key = (citation['original'], citation['pagina'])
            if key not in pages:
                pages[key] = page.get_text('text', flags=0, sort=False)
        ref = citation['referencia']
        dependencies = [c['id'] for c in cells if ref['path'] in c['secciones']['evidencia']]
        sites = [f['id'] for f in fichas if ref['path'] in f['fuentesPrimarias']]
        extracts.append(dict(
            referencia=ref, original=citation['original'], pagina=citation['pagina'],
            caja=citation['caja'], texto=text, coincide=text == citation['texto'],
            referenciaCoincide=sha(Path(ref['path']).read_bytes()) == ref['sha256'],
            celdasQueLaInvocan=dependencies, sitiosQueLaInvocan=sites,
            alcance='Texto geométrico y asociación explícita. Una página compartida no demuestra cada afirmación de los sitios; ver dictámenes y reservas por grupo.'))
    save('reextraccion-independiente.json', extracts)
    # Selección de tabla/hoja: cotejar los tres componentes de cada ejemplo,
    # sin cargar ni calcular desde el motor.
    decisions = []
    for cell in cells:
        evidence = json.loads(Path(cell['secciones']['evidencia'][0]).read_bytes())
        number = evidence['engineBinding']['number']
        literal = evidence['quote'][number['start']:number['end']]
        value = Decimal(literal.replace('.', '').replace(',', '.'))
        values = {json.loads(h['path'])[-1]: Decimal(h['value']) for h in cell['casoIndependiente']['hojas']}
        base = Decimal(cell['casoIndependiente']['entradaEUR'])
        cuota = values['cuota'] + (base - values['baseInferior']) * values['tipo']
        decisions.append(dict(
            id=cell['id'], selector=cell['selector'], afirmacion=cell['secciones'],
            literal=literal, numeroCoincide=value == Decimal(cell['valor']),
            aritmeticaCoincide=cuota == Decimal(cell['casoIndependiente']['cuotaExactaEUR']),
            dictamen='explicación aritmética aprovechable con reservas; selección y regla completa pendientes',
            derivacionCompartida='CEL-01',
            objecion='B=L+1 tampoco distingue >= de > ni prueba qué fila selecciona el motor; tipo no aceptado por la cita EUR.',
            respuesta='Conservar la explicación de celda y exigir ternas de frontera y selección temporal antes de publicar como regla.',
            coste='Una decisión por ID; más casos y vínculo explícito al payload R19; no promoción.',
            cita=cell['secciones']['evidencia'][0]))
    save('decisiones-celdas.json', decisions)
    selectors = []
    bindings = json.loads(Path('lib/procedencia/rastro-generado.json').read_bytes())['bindings']
    for ficha in fichas:
        selector = ficha['selector']
        source = selector['fuente']
        raw = Path(source['archivo']).read_bytes()
        loc = json.loads(source['localizador'])
        call = raw.decode().encode('utf-16-le')[2 * loc['inicio']:2 * loc['fin']].decode('utf-16-le')
        actual = next(b for b in bindings if b['siteId'] == selector['siteId'])
        selectors.append(dict(id=ficha['id'], fuente=source, codigoCoincide=call == selector['codigoExacto'],
                              hashCoincide=sha(raw) == source['sha256'], sujetoCoincide=actual['sujeto'] == selector['sujeto']))
    save('selectores-actuales.json', selectors)
    # Reproducir los píxeles declarados como contraste distinto de inspección visual.
    pixels: list[dict[str, object]] = []
    for citation in citations:
        fac = citation.get('facsimil')
        if not fac or 'path' not in fac or any(p['path'] == fac['path'] for p in pixels):
            continue
        params = fac['parameters']
        with pymupdf.open(documents[citation['original']]['path']) as pdf:
            page = pdf[citation['pagina'] - 1]
            clip = params.get('clip', citation['caja'])
            pix = page.get_pixmap(dpi=params['dpi'], colorspace=pymupdf.csRGB,
                                 alpha=False, annots=False,
                                 clip=None if clip is None else pymupdf.Rect(clip))
            rendered = pix.tobytes('png')
        pixels.append(dict(path=fac['path'], sha256=sha(rendered), declarado=fac['sha256'], coincide=sha(rendered) == fac['sha256']))
    save('facsimiles-reproducidos.json', pixels)
    # Todas las páginas se reextraen; render propio de una página por documento.
    scratch = Path('.cache/revision-editorial')
    visual = []
    for index, (key, text) in enumerate(pages.items()):
        original_hash, page_number = key
        path = scratch / f'pagina-{index:02d}.png'
        with pymupdf.open(documents[original_hash]['path']) as pdf:
            pdf[page_number - 1].get_pixmap(dpi=90, alpha=False, annots=False).save(path)
        visual.append(dict(indice=index, original=original_hash, pagina=page_number, render=str(path), texto=text))
    save('paginas-reextraidas.json', visual)
    rules = json.loads(Path('.oxlintrc.json').read_bytes())['rules']
    save('resultado.json', dict(originales=len(checked), originalesCorrectos=sum(o['hashesCoinciden'] for o in checked),
                               citas=len(extracts), citasCorrectas=sum(c['coincide'] and c['referenciaCoincide'] for c in extracts),
                               paginas=len(pages), facsimiles=len(pixels), facsimilesCorrectos=sum(bool(p['coincide']) for p in pixels),
                               selectoresCorrectos=sum(s['codigoCoincide'] and s['hashCoincide'] and s['sujetoCoincide'] for s in selectors),
                               celdas=len(cells), reglasAntiSlop=len(rules), reglasError=all(v == 'error' for v in rules.values())))
    print((OUT / 'resultado.json').read_text())


if __name__ == '__main__':
    main()
