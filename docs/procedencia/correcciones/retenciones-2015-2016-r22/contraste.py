"""Contrapruebas de un subcontrato escrito; no ejecuta nóminas ni el motor."""
import argparse
import copy
from decimal import Decimal
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import unittest

HERE = Path(__file__).resolve().parent
EDITION = HERE


def literal_substep(formula: str, candidate: Decimal, previous: Decimal) -> Decimal:
    """Interpreta solo las dos asignaciones documentales comparadas, sin eval."""
    first = formula.split(';')[0]
    if first == 'TIPOREG=TIPOA':
        return previous
    if first == 'TIPOREG=min(TIPOREG,TIPOA)':
        return min(candidate, previous)
    raise ValueError('Fórmula documental no soportada por el contraste')


def verify_citation(citation: dict, data: bytes) -> None:
    document, recipe = citation['document'], citation['recipe']
    assert len(data) == document['size']
    assert hashlib.sha256(data).hexdigest() == document['sha256']
    assert hashlib.sha512(data).hexdigest() == document['sha512']
    assert recipe['version'] == 1
    assert recipe['kind'] == 'raw-byte-interval-and-python-text-v1'
    assert recipe['fragmentIsHtmlElement'] is False
    assert recipe['startMarkerUtf8'] == 'id="a87"'
    assert recipe['endMarkerUtf8'] == 'id="a88"'
    assert recipe['requiredOccurrencesEach'] == 1
    start_marker = recipe['startMarkerUtf8'].encode('utf-8')
    end_marker = recipe['endMarkerUtf8'].encode('utf-8')
    assert data.count(start_marker) == data.count(end_marker) == 1
    start, end = data.index(start_marker), data.index(end_marker)
    assert (start, end) == (recipe['byteStartInclusive'], recipe['byteEndExclusive'])
    fragment = data[start:end]
    assert hashlib.sha256(fragment).hexdigest() == citation['sectionSha256']
    text = re.sub(r'<[^>]+>', ' ', fragment.decode('utf-8'))
    text = re.sub(r'\s+', ' ', html.unescape(text))
    start = text.index('5. El tipo de retención')
    end = text.index('Asimismo,', start)
    paragraph = text[start:end].strip()
    assert paragraph == citation['textNormalized']
    assert hashlib.sha256(paragraph.encode('utf-8')).hexdigest() == citation['textSha256']


class Contraste(unittest.TestCase):
    def test_techo_no_eleva_un_tipo_inferior(self) -> None:
        data = json.loads((EDITION / 'ajustes.json').read_text())
        rows = [x for x in data['corrections'] if x['id'].endswith(':87.5-no-aumento')]
        self.assertEqual(len(rows), 3)
        # Expectativas independientes: antes/después del techo y valores próximos.
        cases = [('0', '0'), ('6', '6'), ('11.99', '11.99'),
                 ('12', '12'), ('12.01', '12'), ('18', '12')]
        for row in rows:
            for candidate, expected in cases:
                with self.subTest(id=row['id'], candidate=candidate):
                    result = literal_substep(row['replacement']['formula'],
                                             Decimal(candidate), Decimal('12'))
                    self.assertEqual(result, Decimal(expected))
                    self.assertLessEqual(result, Decimal(candidate))

    def test_minimo_satisfecho_se_conserva_en_el_dominio_acotado(self) -> None:
        # No adjudica la colisión fuera de dominio mínimo15/anterior12.
        data = json.loads((EDITION / 'ajustes.json').read_text())
        rows = [x for x in data['corrections'] if x['id'].endswith(':87.5-no-aumento')]
        for row in rows:
            for floor, previous, candidate, expected in [
                ('2', '12', '6', '6'), ('15', '15', '15', '15'),
                ('15', '15', '20', '15'),
            ]:
                with self.subTest(id=row['id'], floor=floor, candidate=candidate):
                    result = literal_substep(row['replacement']['formula'],
                                             Decimal(candidate), Decimal(previous))
                    self.assertEqual(result, Decimal(expected))
                    self.assertGreaterEqual(result, Decimal(floor))

    def test_receta_y_mutaciones(self) -> None:
        citations = json.loads((EDITION / 'citas-art87-5.json').read_text())
        self.assertEqual(len(citations), 2)
        for citation in citations:
            original = Path(citation['document']['path']).read_bytes()
            verify_citation(citation, original)
            for key, value in [('byteStartInclusive', citation['recipe']['byteStartInclusive'] + 1),
                               ('byteEndExclusive', citation['recipe']['byteEndExclusive'] - 1),
                               ('fragmentIsHtmlElement', True)]:
                changed = copy.deepcopy(citation)
                changed['recipe'][key] = value
                with self.subTest(document=citation['document']['sha256'], field=key):
                    with self.assertRaises(AssertionError):
                        verify_citation(changed, original)
            for key, value in [('textNormalized', citation['textNormalized'] + ' '),
                               ('sectionSha256', '0' * 64), ('textSha256', '0' * 64)]:
                changed = copy.deepcopy(citation)
                changed[key] = value
                with self.subTest(document=citation['document']['sha256'], field=key):
                    with self.assertRaises(AssertionError):
                        verify_citation(changed, original)
            with self.assertRaises(AssertionError):
                verify_citation(citation, original + b' ')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--edition', type=Path, default=HERE)
    args, remaining = parser.parse_known_args()
    EDITION = args.edition
    unittest.main(argv=[sys.argv[0], *remaining], verbosity=2)
