"""Vínculo conservador. Un SES no acredita por silencio todos los hechos fiscales."""
import re
import json
from pathlib import Path
from contract import decode, parse, monetary
from storage import digest

TEMPLATES = {'d7ea4ea703305e6881d33af1d60a63ae0c884fea0e8a8a3c3a07b5e6f3cabe17',
             '5d5e0610c18b033878e62078c146193657a3e00efbd36942d5b0de86df3d554e'}
# No se convierten en cero campos ausentes: estos hechos requieren acreditación
# adicional a las casillas monetarias y datos personales observados.
PENDING = ['residenciaTodoElAnio', 'otrasRentas', 'familiaresConDerechoMinimo',
           'discapacidad', 'reduccionesBase', 'saldosAnteriores', 'deducciones',
           'rentasExtranjeras', 'especialidades', 'claseEmpleo']
PERSONAL_SCOPES = {
    **{key: ['DECLARACIONES', 'DP'] for key in ('EDADD', 'DPFNAC_D', 'CAD_D', 'CAC_D')},
    **{key: ['DECLARACIONES', 'IRPF2025'] for key in ('ZCCAD', 'ZFNAC_D')},
}


def personal(data):
    text = decode(data)
    result, path = {}, []
    for line in text.splitlines()[1:]:
        level = len(line) - len(line.lstrip(' '))
        section = re.fullmatch(r' *\[([A-Z0-9_]+)\]', line)
        if section:
            path = [(n, s) for n, s in path if n < level] + [(level, section[1])]
            continue
        path = [(n, s) for n, s in path if n < level]
        # Identificar la clave antes de validar su registro: un tipo desconocido
        # o un separador extra no pueden hacer invisible una segunda declaración.
        prefix = re.match(r'\s*(\w+)(?=~|\s|$)', line)
        if prefix and prefix[1] in PERSONAL_SCOPES:
            key = prefix[1]
            match = re.fullmatch(r' *' + key + r'~1~([^~\r\n]+)', line)
            if not match:
                raise ValueError('Registro personal malformado o tipo no admitido: ' + key)
            if key in result or [s for _, s in path] != PERSONAL_SCOPES[key]:
                raise ValueError('Dato personal duplicado o fuera de ámbito: ' + key)
            result[key] = match[1]
    if set(result) != set(PERSONAL_SCOPES):
        raise ValueError('Datos personales incompletos')
    return result


def bind(data, entrada, template=None):
    parsed = parse(data, 2025)
    text = decode(data)
    schema = json.loads((Path(__file__).parent / 'observed-schema.json').read_text())
    if (set(re.findall(r'^ *(\w+)~', text, re.M)) - set(schema['keys'])
            or set(re.findall(r'^ *\[([A-Z0-9_]+)\]', text, re.M)) - set(schema['sections'])):
        raise ValueError('Registro o sección añadida fuera del vocabulario examinado')
    p = personal(data)
    if (entrada['ejercicio'] != 2025 or entrada['comunidadAutonoma'] != 'madrid'
            or entrada['modalidad'] != 'individual' or entrada['edad'] != 40
            or p != {'EDADD': '40', 'DPFNAC_D': '01/01/1985', 'CAD_D': 'MADRID',
                     'CAC_D': '12', 'ZCCAD': '12', 'ZFNAC_D': '01/01/1985'}):
        raise ValueError('Ejercicio/territorio/modalidad/edad no vinculados')
    if entrada['perfil'] != 'solo-trabajo':
        raise ValueError('Solo empleo examinado')
    rs = entrada['trabajo']['rendimientos']
    fields = parsed['fields']
    checks = [('IDII', sum(monetary(r['integro']) for r in rs)),
              ('GSS', sum(monetary(r['cotizaciones'][k]) for r in rs for k in ('seguridadSocial', 'derechosPasivos', 'colegiosHuerfanos'))),
              ('IDRE', sum(monetary(r['importe']) for r in entrada['retenciones']))]
    for field, expected in checks:
        if fields.get(field) is None or monetary(fields[field]) != expected:
            raise ValueError('Entrada monetaria no vinculada: ' + field)
    for field, key in [('GCS', 'sindicato'), ('GCC', 'colegio'), ('GDJ', 'defensa')]:
        expected = sum(monetary(r[key]['importe']) for r in rs)
        if fields.get(field) is not None and monetary(fields[field]) != expected:
            raise ValueError('Gasto contradictorio: ' + field)
        if expected and fields.get(field) is None:
            raise ValueError('Gasto sin acreditación: ' + field)
    if template is not None and digest(template) not in TEMPLATES:
        raise ValueError('Plantilla no examinada')
    # Nunca verde por fijar hash: todavía no hay política auditada exhaustiva de
    # todos los registros SES, ni evidencia positiva para estos hechos.
    return {'state': 'incompleto', 'observed': ['2025', 'madrid', 'individual', 'edad40', 'bruto', 'cotizaciones', 'retenciones'],
            'pending': PENDING + ['auditoria-exhaustiva-registros-plantilla'],
            'sesSha256': digest(data), 'templateSha256': digest(template) if template else None}
