"""Subconjunto SES observado: declaración individual, ejercicio y ámbitos explícitos."""
import re
import zlib
from decimal import Decimal

MAP = dict(zip(
    ['0023', '0025', '0500', '0505', '0528', '0529', '0530', '0531', '0532', '0533', '0414', '0595', '0610', '0670'],
    ['TPRRT', 'TPTOTAL', 'BLGRAL', 'BLGGRAV', 'CEXGE1', 'CEXGA1', 'CEXGE2', 'CEXGA2', 'CIGEST', 'CIGAUT', 'CLDED2', 'CAUTLIQ', 'CDIF', 'RESULTADO']))
WORK_KEYS = {'IDII', 'GSS', 'IDRE', 'GCS', 'GCC', 'GDJ'}
ANNUAL_KEYS = set(MAP.values()) | {'IDICLDED2', 'GSSCLDED2'}
OUTPUT_KEYS = tuple(MAP.values()) + ('IDII', 'GSS', 'IDRE', 'GCS', 'GCC', 'GDJ', 'IDICLDED2', 'GSSCLDED2')
MONEY_KEYS = ANNUAL_KEYS | WORK_KEYS


def monetary(value):
    if value is None:
        return None
    if not isinstance(value, str) or not re.fullmatch(r'-?\d{1,24}(?:\.\d{1,100})?', value):
        raise ValueError('Importe decimal ambiguo o fuera del contrato')
    return Decimal(value)


def decode(data):
    decoder = zlib.decompressobj()
    raw = decoder.decompress(data, 4 * 1024 * 1024 + 1)
    if len(raw) > 4 * 1024 * 1024 or not decoder.eof or decoder.unused_data:
        raise ValueError('Contenedor SES incompleto, concatenado o demasiado grande')
    return raw.decode('latin1')


def header(text):
    m = re.match(r'^<\?xml\s+(.*?)\?><PERSISTENCIAV2>\s*\n', text)
    if not m or not text.rstrip().endswith('</PERSISTENCIAV2>'):
        raise ValueError('Cabecera o terminación SES inválida')
    attrs = re.findall(r'(\w+)="([^"<>]*)"', m[1])
    if len(attrs) != len(dict(attrs)) or re.sub(r'(\w+)="([^"<>]*)"', '', m[1]).strip():
        raise ValueError('Atributos de cabecera ambiguos')
    attrs = dict(attrs)
    if attrs.get('CodModelo') != '100' or not re.fullmatch(r'20\d\d', attrs.get('EjModelo', '')):
        raise ValueError('Modelo o ejercicio fuera del contrato')
    if not re.fullmatch(r'N\d+', attrs.get('VersionReglas', '')) or not re.fullmatch(r'\d+\.\d+', attrs.get('VersionModelo', '')):
        raise ValueError('Versión oficial ausente o malformada')
    return {'year': int(attrs['EjModelo']), 'rules': attrs['VersionReglas'],
            'model': attrs['VersionModelo'], 'header': text[:text.index('?>') + 2]}, m.end()


def parse(data, expected_year=None):
    text = decode(data)
    metadata, start = header(text)
    if expected_year is not None and metadata['year'] != expected_year:
        raise ValueError('Ejercicio distinto del esperado')
    body = text[start:text.rfind('</PERSISTENCIAV2>')]
    stack, blocks, current = [], [], None
    individual = []
    declarations = 0
    result = {}
    for line in body.splitlines():
        if not line.strip():
            continue
        indent = len(line) - len(line.lstrip(' '))
        section = re.fullmatch(r' *\[([A-Z0-9_]+)\]', line)
        if section:
            while stack and stack[-1][0] >= indent:
                stack.pop()
            name = section[1]
            if name == 'DECLARACIONES':
                declarations += 1
                if indent != 0 or stack or declarations != 1:
                    raise ValueError('Más de una declaración o raíz inválida')
            elif not stack or stack[0][1] != 'DECLARACIONES':
                raise ValueError('Sección fuera de la declaración')
            if name.startswith('IRPF'):
                if name != 'IRPF' + str(metadata['year']) or indent != 2 or len(stack) != 1:
                    raise ValueError('Ámbito IRPF incompatible con cabecera')
                current = {'titular': [], 'records': [], 'values': {}}
                blocks.append(current)
            elif indent <= 2:
                current = None
            stack.append((indent, name))
            continue
        while stack and stack[-1][0] >= indent:
            stack.pop()
        path = [name for _, name in stack]
        prefix = re.match(r' *(\w+)~', line)
        if not prefix:
            # Los delimitadores de arrays observados no son registros escalares.
            if line.strip() in ('{', '}', '(', ')'):
                continue
            raise ValueError('Registro SES sin gramática reconocida')
        key = prefix[1]
        irpf = len(path) >= 2 and path[1] == 'IRPF' + str(metadata['year'])
        protected = key in MONEY_KEYS | {'INDV', 'TITULAR'}
        record = re.fullmatch(r' *(\w+)~([123])~([^~\r\n]*)', line)
        if protected and not record:
            raise ValueError('Registro consumido malformado o tipo desconocido: ' + key)
        if key == 'INDV':
            if path != ['DECLARACIONES'] or indent != 1 or (record[2], record[3]) != ('1', 'true'):
                raise ValueError('Modalidad fuera de ámbito o no individual')
            individual.append(True)
            continue
        if not irpf:
            continue
        if current is None:
            raise ValueError('IRPF sin bloque activo')
        current['records'].append(key)
        if key == 'TITULAR':
            if len(path) != 2 or (record[2], record[3]) != ('1', 'DECLARANTE'):
                raise ValueError('Titular fuera de ámbito o no declarante')
            current['titular'].append(True)
        elif key in MONEY_KEYS:
            expected = (len(path) == 2 and key in ANNUAL_KEYS) or (
                path[2:] == ['ATRABAJO', 'DLGTRABAJO'] and key in WORK_KEYS)
            if not expected or key in result or key in current['values']:
                raise ValueError('Importe fuera de ámbito o duplicado: ' + key)
            value = None if record[2] == '2' else record[3]
            monetary(value)
            current['values'][key] = value
            result[key] = value
    if declarations != 1 or len(individual) != 1 or not blocks:
        raise ValueError('Falta declaración individual completa')
    if any(len(block['titular']) != 1 for block in blocks):
        raise ValueError('Titulares ambiguos')
    # 2018/2019 presentan además un fragmento vacío con solo TITULAR.
    full = [b for b in blocks if b['records'] != ['TITULAR']]
    if len(full) != 1 or (len(blocks) > 1 and metadata['year'] not in (2018, 2019)):
        raise ValueError('Fragmentos fiscales no admitidos')
    result.update(INDV='true', TITULAR='DECLARANTE')
    return {'metadata': metadata, 'fields': result}


def fields(data):
    return parse(data)['fields']


def compare(a, b):
    return {box: {'expected': a.get(k), 'actual': b.get(k),
                  'equal': monetary(a.get(k)) == monetary(b.get(k)),
                  'monetaryComparison': a.get(k) is not None and b.get(k) is not None}
            for box, k in MAP.items()}
