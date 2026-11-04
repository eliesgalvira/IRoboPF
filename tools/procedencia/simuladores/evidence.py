"""Verificación obligatoria de artefactos antes de aceptar o reutilizar un caso."""
import re
import subprocess
from contract import MAP, OUTPUT_KEYS, monetary, parse
from storage import read_ref

from config import executable

PDFTOTEXT = None
POLICY = 'open-salario-individual-pdf-ses-v2'
REQUIRED_PDF = set(MAP) - {'0023', '0414'}


def visible_version(bootstrap):
    text = bootstrap.decode('utf-8')
    versions = re.findall(r"id:'txtVersion'.{0,200}?value:'[^']*?([0-9]+\.[0-9]+)\s+\(OPEN\)", text)
    if len(versions) != 1:
        raise ValueError('Versión visible ausente o ambigua en la respuesta inicial')
    return versions[0]


def verify_pdf(data, values, year):
    if not data.startswith(b'%PDF'):
        raise ValueError('Respuesta no PDF')
    try:
        text = subprocess.check_output([PDFTOTEXT or executable('C_PDFTOTEXT', 'pdftotext'), '-layout', '-', '-'], input=data, timeout=30, stderr=subprocess.PIPE).decode()
    except (subprocess.SubprocessError, UnicodeDecodeError) as error:
        raise ValueError('PDF no interpretable') from error
    years = set(re.findall(r'Ejercicio\s+(20\d\d)\b', text))
    if years != {str(year)}:
        raise ValueError('Ejercicio PDF ausente o incompatible')
    checks = {}
    for box, key in MAP.items():
        occurrences = re.findall(r'(-?[\d.]+,\d\d)\s+' + box + r'\b', text)
        amounts = [x.replace('.', '').replace(',', '.') for x in occurrences]
        for amount in amounts:
            if values.get(key) is None or monetary(amount) != monetary(values[key]):
                raise ValueError('Discrepancia PDF/SES en ' + box)
        if box in REQUIRED_PDF and not amounts:
            raise ValueError('Casilla obligatoria ausente: ' + box)
        # Omisión documentada: artículo 20 y DA61 pueden no imprimirse.
        # Si SES aporta cuantía no nula, la casilla sí debe estar presente.
        if box not in REQUIRED_PDF and not amounts and values.get(key) is not None and monetary(values[key]) != 0:
            raise ValueError('Cuantía SES sin correspondencia PDF: ' + box)
        checks[box] = {'occurrences': len(amounts), 'ses': values.get(key)}
    return checks


def validate_result(row, job=None, official=None):
    ses = read_ref(row['ses'])
    parsed = parse(ses, expected_year=official['year'] if official else None)
    metadata, values = parsed['metadata'], parsed['fields']
    indexed = row.get('fields', {})
    required = set(OUTPUT_KEYS) if job or official else set(OUTPUT_KEYS) - {'GCS', 'GCC', 'GDJ'}
    if (not required <= set(indexed) <= set(OUTPUT_KEYS)
            or row.get('version') != metadata['header']
            or indexed != {k: values.get(k) for k in indexed}):
        raise ValueError('Índice no corresponde al SES')
    read_ref(row['summary'])  # Solo diagnóstico, no prueba del importe.
    checks = verify_pdf(read_ref(row['pdf']), values, metadata['year'])
    if official:
        if {k: metadata[k] for k in ('year', 'rules', 'model')} != {k: official[k] for k in ('year', 'rules', 'model')}:
            raise ValueError('Versión SES distinta de la fijada')
        observed = visible_version(read_ref(row['bootstrap']))
        if observed != official['visible'] or row.get('visibleVersion') != observed:
            raise ValueError('Versión visible distinta de la fijada')
    if job:
        if row.get('id') != job['id']:
            raise ValueError('Resultado de otra entrada')
        for field, key in (('IDII', 'gross'), ('GSS', 'ss'), ('IDRE', 'retention'), ('IDICLDED2', 'gross'), ('GSSCLDED2', 'ss')):
            if values.get(field) is None or monetary(values[field]) != monetary(job[key]):
                raise ValueError('Entrada consumida distinta: ' + field)
    # Relectura después del cotejo y antes de done, incluido el tamaño.
    for name in ('ses', 'pdf', 'summary') + (('bootstrap',) if official else ()):
        read_ref(row[name])
    return {'policy': POLICY, 'metadata': metadata, 'checks': checks}
