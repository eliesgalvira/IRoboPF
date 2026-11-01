"""Coteja entradas persistidas y casillas de PDF con el .ses oficial descargado."""

import hashlib
import json
import re
import subprocess
import zlib
from decimal import Decimal
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
CACHE = ROOT / '.cache/redondeo-anual-rentaweb-open'
MAPPING = dict(zip(
    ['0023', '0025', '0500', '0505', '0528', '0529', '0530', '0531',
     '0532', '0533', '0414', '0595', '0610', '0670'],
    ['TPRRT', 'TPTOTAL', 'BLGRAL', 'BLGGRAV', 'CEXGE1', 'CEXGA1',
     'CEXGE2', 'CEXGA2', 'CIGEST', 'CIGAUT', 'CLDED2', 'CAUTLIQ',
     'CDIF', 'RESULTADO'], strict=True,
))


def main():
    cases = json.loads((HERE / 'casos.json').read_text())
    results = []
    for case in cases:
        name = case['id']
        ses = CACHE / (name + '.ses')
        pdf = CACHE / (name + '.pdf')
        if not ses.exists():
            ses = HERE / ses.name
        if not pdf.exists():
            pdf = HERE / pdf.name
        decoded = zlib.decompress(ses.read_bytes()).decode('latin1')
        fields = dict(re.findall(r'^\s*(\w+)~[13]~([^~\r\n]+)', decoded, re.M))
        text = subprocess.check_output(['pdftotext', '-layout', str(pdf), '-']).decode()
        (HERE / (name + '-pdf.txt')).write_text(text)
        incomes = case['entrada']['trabajo']['rendimientos']
        expected = {
            'IDII': sum(Decimal(r['integro']) for r in incomes),
            'GSS': sum(sum(Decimal(v) for k, v in r['cotizaciones'].items()
                           if k != 'clase') for r in incomes),
            'IDRE': sum(Decimal(r['importe']) for r in case['entrada']['retenciones']),
            'GCS': sum(Decimal(r['sindicato']['importe']) for r in incomes),
            'GCC': sum(Decimal(r['colegio']['importe']) for r in incomes),
            'GDJ': sum(Decimal(r['defensa']['importe']) for r in incomes),
        }
        for key, amount in expected.items():
            assert Decimal(fields.get(key, '0')) == amount, (name, key, fields.get(key), amount)
        assert Decimal(fields['IDICLDED2']) == expected['IDII']
        assert Decimal(fields['GSSCLDED2']) == expected['GSS']
        assert fields['EDADD'] == '40' and fields['CAC_D'] == '12'
        assert fields['INDV'] == 'true' and fields['SOLTERO'] == 'true'
        assert Decimal(fields['MPERFA']) == Decimal('5550')
        assert Decimal(fields['MPERFAAU']) == Decimal('5956.65')
        values = {}
        for box, key in MAPPING.items():
            matches = re.findall(r'(-?[\d.]+,\d\d)\s+' + box + r'\b', text)
            pdf_value = matches[-1].replace('.', '').replace(',', '.') if matches else None
            ses_value = fields.get(key)
            if pdf_value is not None:
                assert ses_value is not None and Decimal(pdf_value) == Decimal(ses_value), (name, box)
            values[box] = {'pdf': pdf_value, 'ses': ses_value, 'clave': key}
        version = re.search(r'<\?xml.*?\?>', decoded)
        assert version is not None
        results.append({
            'id': name, 'casillas': values,
            'entradasPersistidas': {key: fields.get(key) for key in expected},
            'entradaDA61': {key: fields.get(key) for key in ['IDICLDED2', 'GSSCLDED2']},
            'perfil': {key: fields.get(key) for key in ['EDADD', 'INDV', 'CAC_D', 'MPERFA', 'MPERFAAU']},
            'versiones': version.group(),
            'sha256': {f.suffix[1:]: hashlib.sha256(f.read_bytes()).hexdigest() for f in [ses, pdf]},
        })
        print(name, values['0670']['pdf'])
    (HERE / 'observados.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
