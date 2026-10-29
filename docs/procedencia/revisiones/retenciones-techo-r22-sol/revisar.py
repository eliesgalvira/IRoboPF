"""Contraste documental independiente. No decide admisión fiscal ni ejecuta nóminas."""
import copy
from decimal import Decimal
import hashlib
import html
from html.parser import HTMLParser
import importlib.util
import json
from pathlib import Path
import re
import subprocess

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
R22 = ROOT / 'docs/procedencia/correcciones/retenciones-2015-2016-r22'
R21 = R22.parent / 'retenciones-2015-2016-r21'
ORIG = ROOT / 'docs/procedencia/revisiones/retenciones-2015-2016-sol'


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def digest(data):
    return hashlib.sha256(data).hexdigest()


class Article(HTMLParser):
    """Extrae texto del div seleccionado, sin serializar ni normalizar el documento."""
    def __init__(self, target):
        super().__init__(convert_charrefs=True)
        self.target = target
        self.depth = 0
        self.parts = []
        self.count = 0

    def handle_starttag(self, tag, attrs):
        if tag == 'div':
            if self.depth:
                self.depth += 1
            elif dict(attrs).get('id') == self.target:
                self.depth = 1
                self.count += 1

    def handle_endtag(self, tag):
        if tag == 'div' and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if self.depth:
            self.parts.append(data)


def run_history():
    jobs = [
        ('rojo-original.log', [str(ORIG / 'repro_rojo.py')], 1),
        ('rojo-r21.log', ['docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol/rojos.py'], 1),
        ('contraste-viejo.log', [str(R22 / 'contraste.py'), '--edition', str(R21),
         'Contraste.test_techo_no_eleva_un_tipo_inferior',
         'Contraste.test_minimo_satisfecho_se_conserva_en_el_dominio_acotado'], 1),
        ('contraste-nuevo.log', [str(R22 / 'contraste.py')], 0),
    ]
    rows = []
    import sys
    for log, args, expected in jobs:
        result = subprocess.run([sys.executable, *args], capture_output=True, text=True, check=False)
        (OUT / log).write_text(result.stdout + result.stderr + f'\nexitCode={result.returncode}\n')
        rows.append(dict(log=log, args=args, code=result.returncode, expected=expected))
        assert result.returncode == expected
    save('ejecuciones.json', rows)


def overlay():
    new = json.loads((R22 / 'ajustes.json').read_text())
    old = json.loads((R21 / 'ajustes.json').read_text())
    assert len(new['corrections']) == 12
    assert not new['completeRuleAcceptance'] and new['enableVersions'] == []
    for source in [*new['sources'], new['previousEdition'], new['reviewOfPreviousEdition']]:
        assert digest((ROOT / source['path']).read_bytes()) == source['sha256']
    rows = []
    composed = {}
    for source in ['matriz-60.json', 'ramas-regularizacion.json']:
        original = json.loads((ORIG / source).read_text())
        replacements = {c['id']: c['replacement'] for c in new['corrections'] if c['source'] == source}
        assert len(replacements) == 6
        composed[source] = [replacements.get(r['id'], r) for r in original]
        assert sum(r['id'] in replacements for r in original) == 6
    for c in new['corrections']:
        before = next(x for x in old['corrections'] if x['id'] == c['id'])
        suffix = c['id'].split(':')[1]
        if suffix == 'minimos':
            assert before == c
        rows.append(dict(id=c['id'], source=c['source'],
                         changedFields=[k for k in c['replacement'] if c['replacement'][k] != before['replacement'].get(k)],
                         previous=before['replacement'], current=c['replacement']))
    base = (ORIG / 'CONTRATO-CANDIDATO.md').read_text()
    start = base.index('Causas5/6/8/9/10/11 excluyen')
    end = base.index('\n\n', start)
    addendum = (R22 / 'CONTRATO.md').read_text()
    effective = base[:start] + '\n[Adenda R22, normativa del subpaso]\n' + addendum + '\n' + base[end:]
    (OUT / 'contrato-compuesto.txt').write_text(effective)
    save('superposicion.json', dict(rows=rows, effective=composed, removed=base[start:end]))
    # Búsqueda de residuos para revisión humana, no prueba jurídica por palabras clave.
    candidates = []
    for source, entries in composed.items():
        for row in entries:
            for key, value in row.items():
                if isinstance(value, str) and re.search(r'TIPOREG=TIPOA|salvo causas|excluyen los límites|87\.5|mínim', value):
                    candidates.append(dict(source=source, id=row['id'], field=key, value=value))
    save('residuos.json', candidates)


def numerical():
    # Expectativas externas al intérprete del autor: proyección sobre el intervalo [mínimo, anterior].
    spec = importlib.util.spec_from_file_location('r22_contraste', R22 / 'contraste.py')
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    rows = []
    for floor, previous, candidate, expected in [
        ('0', '12', '0', '0'), ('2', '12', '2', '2'),
        ('2', '12', '11.999', '11.999'), ('2', '12', '12', '12'),
        ('2', '12', '12.001', '12'), ('15', '15', '99', '15'),
        ('1', '1', '1', '1'), ('8', '8', '20', '8'), ('0', '0', '7', '0'),
    ]:
        m, a, t, want = map(Decimal, (floor, previous, candidate, expected))
        for row in json.loads((R22 / 'ajustes.json').read_text())['corrections']:
            if row['id'].endswith(':87.5-no-aumento'):
                actual = module.literal_substep(row['replacement']['formula'], t, a)
                assert actual == want and m <= actual <= a and actual <= t
        rows.append(dict(minimum=floor, previous=previous, candidate=candidate, expected=expected))
    # Ilustra por qué la función aritmética no es validador de entrada.
    outside = []
    for raw_t, raw_a, raw_m, reason in [('1', '12', '2', 'candidato incumple mínimo'),
                           ('15', '12', '15', 'mínimo superior al anterior')]:
        result = module.literal_substep('TIPOREG=min(TIPOREG,TIPOA)', Decimal(raw_t), Decimal(raw_a))
        outside.append(dict(candidate=raw_t, previous=raw_a, minimum=raw_m, arithmeticOnly=str(result),
                            contractDecision='fuera de alcance', reason=reason))
    save('casos-numericos.json', dict(admittedConditional=rows, excluded=outside,
         caveat='No se reconstruye nómina; no se exige rechazo a una función que solo interpreta una fórmula.'))
    return module


def citations(module):
    checks = []
    for c in json.loads((R22 / 'citas-art87-5.json').read_text()):
        data = Path(c['document']['path']).read_bytes()
        module.verify_citation(c, data)
        start = data.index(b'id="a87"')
        end = data.index(b'id="a88"')
        fragment = data[start:end]
        assert digest(fragment) == c['sectionSha256']
        assert not fragment.startswith(b'<') and fragment.endswith(b'<div class="bloque" ')
        parser = Article('a87')
        parser.feed(data.decode('utf-8'))
        assert parser.count == 1
        dom_text = ' '.join(' '.join(parser.parts).split())
        paragraph = dom_text[dom_text.index('5. El tipo de retención'):dom_text.index('Asimismo,')].strip()
        assert paragraph == c['textNormalized']
        # Selección semántica por límites div: representación deliberadamente distinta.
        div_start = data.rfind(b'<div', 0, start)
        div_end = data.rfind(b'</div>', start, end) + len(b'</div>')
        assert digest(data[div_start:div_end]) != c['sectionSha256']
        raw_text = html.unescape(re.sub(r'<[^>]+>', ' ', fragment.decode('utf-8')))
        raw_text = ' '.join(raw_text.split())
        p = raw_text[raw_text.index('5. El tipo de retención'):raw_text.index('Asimismo,')].strip()
        assert digest(p.encode()) == c['textSha256']
        attacks = []
        for field, value in [('fragmentEncoding', 'latin-1'), ('fragmentNormalization', 'NFC'),
                             ('textSteps', ['receta distinta: normalizar NFKC'])]:
            mutant = copy.deepcopy(c)
            mutant['recipe'][field] = value
            module.verify_citation(mutant, data)
            attacks.append(dict(field=field, acceptedByAuthor=True,
                                meaning='metadato descriptivo no cotejado; ejecución fija en código'))
        mutant = copy.deepcopy(c)
        mutant['selector'] = '#a88'
        module.verify_citation(mutant, data)
        attacks.append(dict(field='selector', acceptedByAuthor=True))
        # Prueba de la frontera de confianza: un sobre íntegramente sustituido es autoconsistente.
        altered = data.replace(b'no podr\xc3\xa1 incrementarse', b'no podr\xc3\xa1 decrementarse')
        assert altered != data and len(altered) == len(data)
        mutant = copy.deepcopy(c)
        mutant['document']['sha256'] = digest(altered)
        mutant['document']['sha512'] = hashlib.sha512(altered).hexdigest()
        mutant['sectionSha256'] = digest(altered[start:end])
        mutant['textNormalized'] = c['textNormalized'].replace('incrementarse', 'decrementarse')
        mutant['textSha256'] = digest(mutant['textNormalized'].encode())
        module.verify_citation(mutant, altered)
        attacks.append(dict(field='documento y sobre recalculados', acceptedByAuthor=True,
                            meaning='sin ancla externa; no demuestra validez de la norma sustituida'))
        for change in [data[:-1], data + b' ', data.replace(b'id="a87"', b'id="a87" id="a87"'),
                       data[:start] + b'\xff' + data[start + 1:]]:
            try:
                module.verify_citation(c, change)
            except (AssertionError, ValueError):
                pass
            else:
                raise AssertionError('Datos alterados admitidos')
        # Sin normalización Unicode: NFC/NFD cambian bytes y textoSha; NBSP sí colapsa.
        assert ' '.join('a\u00a0b'.split()) == 'a b'
        assert digest('retención'.encode()) != digest('retencio\u0301n'.encode())
        assert 'a\u200bb'.split() == ['a\u200bb']
        articles = {}
        for target in ['a85', 'a86', 'a87', 'a88']:
            parser = Article(target)
            parser.feed(data.decode('utf-8'))
            assert parser.count == 1
            articles[target] = ' '.join(' '.join(parser.parts).split())
        save(c['document']['sha256'][:8] + '-primaria.json', articles)
        checks.append(dict(document=c['document'], byteStart=start, byteEnd=end,
                           fragmentSize=len(fragment), sectionSha256=digest(fragment),
                           textSha256=digest(p.encode()), semanticElementSha256=digest(data[div_start:div_end]),
                           metadataAttacks=attacks, alteredDataRejected=4))
    save('citas-controles.json', checks)


def main():
    run_history()
    overlay()
    citations(numerical())
    config = json.loads((ROOT / '.oxlintrc.json').read_text())
    assert len(config['rules']) == 16 and set(config['rules'].values()) == {'error'}
    save('anti-slop.json', config['rules'])
    print('Contrastes documentales ejecutados; resultados y límites en JSON. Sin aceptación fiscal.')


if __name__ == '__main__':
    main()
