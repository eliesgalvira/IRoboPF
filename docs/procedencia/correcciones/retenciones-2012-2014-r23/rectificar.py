"""Rectificación documental con facsímiles fijados; no modifica el motor."""
import copy
import hashlib
import json
from pathlib import Path
import fitz

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
AUTHOR = ROOT / 'docs/procedencia/revisiones/retenciones-2012-2014-sol'
REVIEW = ROOT / 'docs/procedencia/revisiones/retenciones-2012-2014-contraste-sol'


def pin(path: Path) -> dict[str, str]:
    return {'path': str(path.relative_to(ROOT)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def main() -> None:
    corrections = []
    for name in ['matriz-80.json', 'ramas-44.json']:
        for original in json.loads((AUTHOR / name).read_text()):
            row = copy.deepcopy(original)
            kind = row['id'].split(':')[-1]
            if kind == 'minimos':
                row['objecionExperta'] = (
                    'Bucles auxiliares e índices pueden omitir sujetos. La lectura visual muestra '
                    '≥25 en p10 y ≤64 en p16; se retiran las supuestas omisiones por esos operadores.')
                row['respuesta'] += (
                    ' Rectificación C01: los trazos perdidos en extracción se conservan literalmente '
                    'en la cita histórica, sin convertirlos en cambio fiscal ni validar otros bucles.')
            elif kind == 'regularizacion':
                row['reglaCandidata'] += (
                    ' Adenda R23 prevalente: nueva obligación judicial de alimentos con 85.2 histórico '
                    'acreditado activa un techo independiente del signo de la diferencia. Subpaso '
                    'min(tipoCandidato,tipoAnterior), con mínimo ya satisfecho y compatible. '
                    'CONTRATO.md fija evento único, hechos y exclusiones; los números de causaPDF '
                    'no desactivan la calificación legal. No ejecutar los casos anteriores como '
                    'un regularizador completo que contemple ya esta alternativa.')
            elif kind == 'CAUSA4':
                row['contrato'] = (
                    'Nueva obligación judicial de alimentos a hijos; hechos y85.2 de la versión '
                    'histórica acreditados,0<ANUALIDADES<BASE y comunicación eficaz. Evento único, '
                    'mínimo contractual sin cambio y satisfecho, no superior al tipo anterior. '
                    'Techo87.5=min(tipoCandidato,tipoAnterior), independiente del signo del delta. '
                    'Todas las concurrencias y conflictos de mínimo quedan fuera de este subcontrato '
                    'según CONTRATO.md; no hay nómina completa habilitada.')
                row['subpasoDocumental'] = {
                    'formula': 'TIPOREG=min(TIPOREG,TIPOA)',
                    'admission': 'CONTRATO.md',
                    'evaluatesAdmission': False,
                    'completePayroll': False,
                }
                row['decision'] = 'candidato-subpaso-restringido'
            else:
                continue
            assert row['aceptacion'] is False
            corrections.append({'source': name, 'id': row['id'], 'replacement': row,
                                'reason': 'C01' if kind == 'minimos' else 'C02'})
    assert len(corrections) == len({c['id'] for c in corrections}) == 12
    data = {'version': 1, 'status': 'candidate-requires-new-review',
            'sources': [pin(AUTHOR / name) for name in ['matriz-80.json', 'ramas-44.json',
                        'hallazgos.json', 'CONTRATO-CANDIDATO.md', 'regularizacion-casos.py']],
            'independentReview': pin(REVIEW / 'INFORME.md'), 'corrections': corrections,
            'findingRectification': {'id': 'SOL-03', 'scope': 'Se retiran solo las inferencias sobre>25/<64; quedan índices, prefijos y demás reservas.'},
            'contractAddendum': 'CONTRATO.md', 'completeRuleAcceptance': False, 'enableVersions': []}
    (OUT / 'ajustes.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    sources = {x['sha256']: x for x in json.loads((REVIEW / 'fuentes.json').read_text())}
    results = []
    for version in json.loads((AUTHOR / 'versiones-4.json').read_text()):
        source = sources[version['sha256']]
        raw = Path(source['path']).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == source['sha256']
        assert hashlib.sha512(raw).hexdigest() == source['sha512'] and len(raw) == source['size']
        with fitz.open(stream=raw, filetype='pdf') as document:
            for number in [10, 16]:
                bounds = [45, 180 if number == 10 else 490, 570, 750 if number == 10 else 700]
                page = document[number - 1]
                image = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=fitz.Rect(*bounds), alpha=False).tobytes('png')
                prior = REVIEW / f"{version['id']}-p{number}.png"
                assert image == prior.read_bytes()
                results.append({'document': source, 'page': number, 'bbox': bounds,
                                'matrix': [2, 2], 'alpha': False, 'renderer': fitz.VersionBind,
                                'quote': page.get_textbox(fitz.Rect(*bounds)),
                                'facsimile': pin(prior), 'renderEqual': True,
                                'visualFinding': '≥25' if number == 10 else '≤64',
                                'visualScope': 'Inspección personal puntual; no algoritmo íntegro'})
    primary = []
    for citation in json.loads((AUTHOR / 'citas-boe.json').read_text()):
        if citation['id'] not in ['bc36ac7820d4:p4', 'bc36ac7820d4:p5']:
            continue
        source = sources[citation['documentSha256']]
        raw = Path(source['path']).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == source['sha256']
        assert hashlib.sha512(raw).hexdigest() == source['sha512'] and len(raw) == source['size']
        with fitz.open(stream=raw, filetype='pdf') as document:
            page = document[citation['page'] - 1]
            assert page.get_text() == citation['text']
            image = page.get_pixmap(dpi=110, alpha=False).tobytes('png')
            assert hashlib.sha256(image).hexdigest() == citation['imageSha256']
            primary.append({'source': source, 'citation': citation, 'renderEqual': True,
                            'facsimile': pin(AUTHOR / citation['facsimile'])})
    assert len(primary) == 2
    (OUT / 'evidencia.json').write_text(json.dumps({'algorithmCrops': results, 'primary': primary,
        'historicalAuthenticity': 'indeterminada', 'completeRuleAcceptance': False}, ensure_ascii=False, indent=2) + '\n')
    print('12 reemplazos; ocho recortes y dos páginas BOE reproducidos; ninguna habilitación')


if __name__ == '__main__':
    main()
