"""Política C300: ausencia SES y cero impreso no son igualdad monetaria."""
import re
import subprocess

from config import executable
from contract import MAP, OUTPUT_KEYS, monetary, parse
from evidence import REQUIRED_PDF, visible_version
from storage import read_ref

POLICY = 'c300-pdf-ses-absence-explicit-v1'


def pdf_checks(text, values, year):
    if set(re.findall(r'Ejercicio\s+(20\d\d)\b', text)) != {str(year)}:
        raise ValueError('Ejercicio PDF ausente o incompatible')
    checks = {}
    for box, key in MAP.items():
        amounts = [v.replace('.', '').replace(',', '.') for v in re.findall(r'(-?[\d.]+,\d\d)\s+' + box + r'\b', text)]
        expected = values.get(key)
        if box in REQUIRED_PDF and not amounts:
            raise ValueError('Casilla obligatoria ausente: ' + box)
        for value in amounts:
            if expected is None:
                if monetary(value) != 0:
                    raise ValueError('PDF no cero sin dato SES: ' + box)
            elif monetary(value) != monetary(expected):
                raise ValueError('Discrepancia PDF/SES en ' + box)
        if not amounts and expected is not None and monetary(expected) != 0:
            raise ValueError('Cuantía SES sin correspondencia PDF: ' + box)
        checks[box] = dict(occurrences=len(amounts), ses=expected, pdf=amounts,
                           state='ses-ausente' if expected is None else 'pdf-ausente' if not amounts else 'coincide')
    return checks


def validate_result(row, official):
    parsed = parse(read_ref(row['ses']), official['year'])
    meta, values = parsed['metadata'], parsed['fields']
    if (set(row['fields']) != set(OUTPUT_KEYS) or row['version'] != meta['header']
            or row['fields'] != {k: values.get(k) for k in OUTPUT_KEYS}):
        raise ValueError('Índice no corresponde al SES')
    if {k: meta[k] for k in ('year', 'rules', 'model')} != {k: official[k] for k in ('year', 'rules', 'model')}:
        raise ValueError('Versión SES distinta de la fijada')
    visible = visible_version(read_ref(row['bootstrap']))
    if visible != official['visible'] or row['visibleVersion'] != visible:
        raise ValueError('Versión visible distinta de la fijada')
    pdf = read_ref(row['pdf'])
    if not pdf.startswith(b'%PDF'):
        raise ValueError('Respuesta no PDF')
    text = subprocess.check_output([executable('C_PDFTOTEXT', 'pdftotext'), '-layout', '-', '-'], input=pdf, timeout=30, stderr=subprocess.PIPE).decode()
    checked = pdf_checks(text, values, official['year'])
    for name in ('ses', 'pdf', 'summary', 'bootstrap'):
        read_ref(row[name])
    return dict(policy=POLICY, metadata=meta, checks=checked)
