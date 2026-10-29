"""Superposición documental; no importa ni habilita el motor de retenciones."""
import copy
import hashlib
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
PREVIOUS = OUT.parent / 'retenciones-2015-2016-r21'


def record(path: Path) -> dict[str, str]:
    return {'path': str(path.relative_to(ROOT)),
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def main() -> None:
    previous = json.loads((PREVIOUS / 'ajustes.json').read_text())
    current = copy.deepcopy(previous)
    current['version'] = 2
    current['previousEdition'] = record(PREVIOUS / 'ajustes.json')
    current['reviewOfPreviousEdition'] = record(
        ROOT / 'docs/procedencia/revisiones/retenciones-rectificaciones-r21-sol/INFORME.md')
    current['scopeContract'] = 'CONTRATO.md'
    for correction in current['corrections']:
        row = correction['replacement']
        if correction['id'].endswith(':87.5-no-aumento'):
            row['condicion'] = (
                'Subpaso condicionado: hechos admitidos por CONTRATO.md, mínimo86.2 ya conciliado, '
                'y (disminución exclusivamente calificada de diferencia positiva O nueva obligación '
                'judicial de alimentos a hijos con85.2 aplicable). El techo actúa solo si el tipo '
                'candidato pretende subir; no eleva un candidato inferior. La alternativa de '
                'alimentos no exige delta negativo. Concurrencias fuera del alcance explícito '
                'no producen un resultado utilizable.')
            row['formula'] = (
                'TIPOREG=min(TIPOREG,TIPOA); con mínimo86.2 previamente satisfecho y no superior '
                'a TIPOA; recalcular importe solo tras completar el procedimiento validado')
            row['decision'] = 'candidato-subpaso-restringido'
            row['respuesta'] = (
                'El techo no asigna incondicionalmente el tipo anterior. Se evalúa la calificación '
                'jurídica antes de cualquier filtro por números de causa del PDF. CONTRATO.md '
                'excluye todas las concurrencias alimentarias en esta edición, incluso si se '
                'declaran conciliadas, y todo conflicto entre mínimo y techo.')
            correction['reason'] = 'R21-01 y R21-02'
        elif correction['id'].endswith(':87.5-aumento'):
            row['decision'] = 'candidato-subpaso-restringido'
            row['condicion'] = (
                'Aumento exclusivamente calificado de diferencia positiva y exceso del incremento '
                'del importe, sin evento alimentario concurrente en el alcance de esta edición. '
                'No inferir exclusividad de un delta positivo. Las combinaciones con alimentos '
                'quedan fuera antes de calcular; el principio legal independiente87.5 se conserva.')
            row['respuesta'] = (
                'Techo de importe como subpaso condicionado. Esta edición no decide la composición '
                'con la nueva obligación alimentaria ni conflictos con mínimos. CONTRATO.md '
                'sustituye expresamente el filtro general por números de causa como criterio jurídico.')
            correction['reason'] = 'R21-02'
        elif correction['id'].endswith(':regularizacion'):
            row['alcance'] = (
                'Las operaciones objetivo, pendiente, minoración, truncamiento e importe conservan '
                'sus condiciones históricas y reservas. La aplicación jurídica87.5 se rige por '
                'CONTRATO.md de esta edición: calificar hechos antes del filtro de causas del PDF; '
                'techo de tipo min(candidato,anterior), sin incremento de candidatos inferiores. '
                'No basta que la diferencia no crezca: la primera alternativa requiere disminución '
                'exclusivamente calificada. La nueva obligación judicial con85.2 es alternativa '
                'independiente del signo. No se admiten concurrencias alimentarias ni conflicto '
                'mínimo/techo en este subcontrato. Las exclusiones numéricas del PDF se conservan '
                'como descripción del pseudocódigo, no como excepción normativa ni filtro de esta '
                'guarda. No hay nómina operable ni habilitación de versión por esta corrección.')
            if correction['id'].startswith('2015-julio'):
                row['alcance'] += ' Julio conserva su reserva editorial/territorial y tachados de causa11.'
            elif correction['id'].startswith('2016'):
                row['alcance'] += ' No se presume que2016 herede los cambios editoriales de julio.'
            correction['reason'] = 'R21-02'
    current['contractAddendum']['maintenanceGuard'] = (
        'Guarda jurídica anterior al filtro numérico PDF; techo min(candidato,anterior), '
        'nunca asignación que aumente el candidato. CONTRATO.md sustituye el párrafo señalado '
        'del contrato base. Solo se modela el evento alimentario único, con85.2 y comunicación '
        'ya acreditados, sin cambio de mínimo ni conflicto con el anterior. Toda concurrencia '
        'alimentaria queda fuera, también la declarada conciliada. No es una exclusión legal.')
    current['contractAddendum']['example']['scope'] = (
        'Hipótesis aislada de techo; no acredita que una nómina con evento único produzca estas '
        'magnitudes. No resuelve la admisión de hechos concurrentes.')
    current['contractAddendum']['minimumReconciliation'] = (
        'El candidato de entrada ya satisface el mínimo86.2 acreditado. Si este supera al tipo '
        'anterior, si cambió su calificación o si el candidato lo incumple: fuera de alcance. '
        'No elegir entre max(min()) y min(max()) para una colisión sin resolver.')
    (OUT / 'ajustes.json').write_text(json.dumps(current, ensure_ascii=False, indent=2) + '\n')

    citations = json.loads((PREVIOUS / 'citas-art87-5.json').read_text())
    for citation in citations:
        data = Path(citation['document']['path']).read_bytes()
        assert len(data) == citation['document']['size']
        assert hashlib.sha256(data).hexdigest() == citation['document']['sha256']
        assert hashlib.sha512(data).hexdigest() == citation['document']['sha512']
        start_marker, end_marker = b'id="a87"', b'id="a88"'
        assert data.count(start_marker) == data.count(end_marker) == 1
        start, end = data.index(start_marker), data.index(end_marker)
        fragment = data[start:end]
        assert hashlib.sha256(fragment).hexdigest() == citation['sectionSha256']
        text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', fragment.decode('utf-8'))))
        text_start = text.index('5. El tipo de retención')
        text_end = text.index('Asimismo,', text_start)
        paragraph = text[text_start:text_end].strip()
        assert paragraph == citation['textNormalized']
        citation['recipe'] = {
            'version': 1,
            'kind': 'raw-byte-interval-and-python-text-v1',
            'fragmentIsHtmlElement': False,
            'startMarkerUtf8': start_marker.decode(),
            'endMarkerUtf8': end_marker.decode(),
            'requiredOccurrencesEach': 1,
            'byteStartInclusive': start,
            'byteEndExclusive': end,
            'fragmentEncoding': 'UTF-8-strict',
            'fragmentNormalization': 'none; SHA-256 of original bytes[start:end]',
            'textSteps': [
                'decode UTF-8 strict',
                'Python re.sub(<[^>]+>, space)',
                'Python html.unescape',
                'Python re.sub(\\s+, space), Unicode default',
                'slice from first 5. El tipo de retención to next Asimismo, exclusive',
                'Python str.strip; no Unicode normalization',
                'encode UTF-8 for textSha256',
            ],
        }
        citation['textSha256'] = hashlib.sha256(paragraph.encode('utf-8')).hexdigest()
        citation['recipeCaveat'] = (
            'Reproduce el digest histórico de un fragmento bruto delimitado por atributos, '
            'no el outerHTML del elemento#a87. El selector semántico y el digest bruto son '
            'distintos. Hash y receta no acreditan vigencia ni autenticidad histórica.')
    (OUT / 'citas-art87-5.json').write_text(json.dumps(citations, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
