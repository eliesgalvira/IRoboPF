#!/usr/bin/env python3
"""Corpus local: ingestión, citas selectivas, firmas y verificación cerrada ante errores."""
import argparse
from datetime import datetime, timezone
from decimal import Decimal
import hashlib
import json
import math
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import unicodedata

from descargar import DEFAULT_HOSTS, archive, atomic_json, digest, download, verify_blob, verify_origin, sanitize_metadata


def public_document(record):
    result = sanitize_metadata(record)
    result.pop('localPath', None)
    return result


def store_bytes(target, data):
    """Publica bytes cerrados mediante rename; nunca deja un CAS parcial."""
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as out:
            temporary = Path(out.name)
            out.write(data)
            out.flush()
            os.fsync(out.fileno())
        if digest(temporary) != target.name:
            raise ValueError('Bytes del facsímil alterados antes de publicar')
        os.replace(temporary, target)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def ingest(source, root):
    """Lee índices del helper antiguo; nunca escribe en source ni confía en localPath."""
    root = Path(root)
    if Path(source).resolve() == root.resolve():
        raise ValueError('La importación exige origen y destino distintos')
    (root / 'sha256').mkdir(parents=True, exist_ok=True)
    records = []
    for index in sorted((Path(source) / 'urls').glob('*.json')):
        record = sanitize_metadata(json.loads(index.read_text()))
        expected_key = hashlib.sha256(record['canonicalUrl'].encode()).hexdigest()
        if index.stem != expected_key:
            raise ValueError('Índice legacy asociado a otra URL')
        original = verify_blob(record, source)
        target = root / 'sha256' / record['sha256']
        if target.exists() and digest(target) != record['sha256']:
            raise ValueError('CAS destino corrupto')
        with tempfile.NamedTemporaryFile(dir=root, delete=False) as out:
            tmp = Path(out.name)
            with original.open('rb') as stream:
                shutil.copyfileobj(stream, out, 65536)
        if digest(tmp) != record['sha256']:
            tmp.unlink()
            raise ValueError('Fuente cambió durante copia')
        os.replace(tmp, target)
        record['localPath'] = str(target.resolve())
        record['importedFromLegacy'] = True
        try:
            record['sourcePolicy'] = verify_origin(record, record['canonicalUrl'], DEFAULT_HOSTS)
        except ValueError:
            record['sourcePolicy'] = {'status': 'pending', 'reason': 'Origen legacy no autorizado por allowlist actual'}
        for field in ('publication', 'consolidation', 'eli', 'csv', 'officialIdentifier'):
            record.setdefault(field, {'status': 'pending'})
        record.setdefault('redirects', None)  # Desconocidos, no una cadena vacía ficticia.
        archive(record, root)
        records.append(record)
    return records


def validate_schema(value, name):
    import jsonschema
    path = Path(__file__).resolve().parents[2] / 'schemas/procedencia' / (name + '.schema.json')
    jsonschema.Draft202012Validator(json.loads(path.read_text()),
                                   format_checker=jsonschema.FormatChecker()).validate(value)


def mupdf():
    import pymupdf
    return pymupdf


def renderer():
    pdf = mupdf()
    return {'engine': 'MuPDF', 'pymupdf': pdf.VersionBind, 'mupdf': pdf.VersionFitz,
            'dpi': 144, 'colorspace': 'RGB', 'alpha': False, 'annots': False,
            'format': 'png', 'rotation': 'original', 'textFlags': 0, 'sort': False}


def geometry(page):
    return {'mediaBox': list(page.mediabox), 'cropBox': list(page.cropbox),
            'rotation': page.rotation, 'coordinateSystem': 'pymupdf-unrotated-top-left-points'}


def rect_checked(page, values):
    if len(values) != 4 or not all(type(x) in (int, float) and math.isfinite(x) for x in values):
        raise ValueError('Rectángulo no finito')
    pdf = mupdf()
    rect = pdf.Rect(values)
    bounds = page.rect * page.derotation_matrix
    if rect.is_empty or not bounds.contains(rect):
        raise ValueError('BBox fuera de página/cropbox')
    # CropBox y MediaBox usan orígenes distintos si MediaBox.y0 != 0.
    media = page.mediabox
    crop = page.cropbox
    if (crop.x0 < media.x0 or crop.x1 > media.x1 or crop.y0 < 0
            or crop.y1 > media.height):
        raise ValueError('CropBox fuera de MediaBox')
    return rect


def extract(page, box):
    return page.get_text('text', clip=rect_checked(page, box), flags=0, sort=False)


def crop_bytes(page, box):
    pdf = mupdf()
    clip = rect_checked(page, box) * page.rotation_matrix
    if clip.width * clip.height * 4 > 20_000_000:
        raise ValueError('Recorte excede presupuesto de píxeles')
    return page.get_pixmap(dpi=144, clip=clip, colorspace=pdf.csRGB, alpha=False,
                           annots=False).tobytes('png')


def selectors(page_number, box, text):
    x0, y0, x1, y1 = box
    return [{'type': 'TextQuoteSelector', 'exact': text},
            {'type': 'FragmentSelector', 'value': f'page={page_number}',
             'conformsTo': 'https://www.rfc-editor.org/rfc/rfc8118'},
            {'type': 'IRoboPFPdfRectSelector', 'coordinateSystem': 'pymupdf-unrotated-top-left-points',
             'value': [x0, y0, x1 - x0, y1 - y0]}]


def cite(record, root, page_number, box, binding=None, table=None, *, store=True, resolver=None):
    validate_schema(public_document(record), 'document')
    if type(page_number) is not int:
        raise ValueError('Página debe ser entero, no booleano')
    path = verify_blob(record, root) if resolver is None else resolver.resolve(record['sha256'])
    if resolver is not None and (digest(path, 'sha512') != record['sha512'] or path.stat().st_size != record['size']):
        raise ValueError('Original corrupto')
    pdf = mupdf()
    with pdf.open(path) as doc:
        if not doc.is_pdf or doc.needs_pass or not 1 <= page_number <= len(doc):
            raise ValueError('PDF/página inválidos')
        page = doc[page_number - 1]
        text = extract(page, box)
        if not text.strip():
            raise ValueError('OCR requerido: capa de texto vacía; no se inventa cita')
        png = crop_bytes(page, box)
        sha = hashlib.sha256(png).hexdigest()
        target = Path(root) / 'sha256' / sha
        if resolver is None and target.exists() and digest(target) != sha:
            raise ValueError('Facsímil CAS corrupto')
        if store:
            store_bytes(target, png)
        result = {'schemaVersion': 1, 'documentSha256': record['sha256'], 'page': page_number,
                  'bbox': box, 'geometry': geometry(page), 'quote': text,
                  'normalization': 'identity', 'extraction': 'text-layer',
                  'selectors': selectors(page_number, box, text),
                  'facsimile': {'sha256': sha, 'parameters': renderer()},
                  'engineBinding': binding, 'table': table,
                  'semanticValidation': {'status': 'pending'},
                  'independentReview': {'status': 'pending'}}
        if binding is not None:
            verify_binding(text, binding)
        return result


def span(text, spec):
    start, end = spec['start'], spec['end']
    if (type(start) is not int or type(end) is not int or not 0 <= start < end <= len(text)
            or text[start:end] != spec['literal']):
        raise ValueError('Span literal incorrecto')
    return text[start:end]


def verify_binding(text, binding):
    # U+FFFD señala pérdida de información. No inferir un signo, separador
    # ni unidad: reducir el recorte o revisar la extracción antes de enlazar.
    if '\ufffd' in text:
        raise ValueError('La extracción contiene un carácter de sustitución; binding ambiguo')
    literal = span(text, binding['number'])
    start, end = binding['number']['start'], binding['number']['end']
    unsafe = '.,+-−﹣－＋±٫٬，．\u00a0\u202f'

    def unsafe_boundary(char):
        # Categorías, no solo una lista de glifos: incluye menos super/subíndice.
        return (char.isalnum() or char in unsafe
                or unicodedata.category(char) in ('Pd', 'Sm', 'Mn', 'Mc', 'Me'))

    if (start and unsafe_boundary(text[start - 1])
            or end < len(text) and unsafe_boundary(text[end])):
        raise ValueError('Número es substring de otro token')
    # No convertir "− 8,50" en positivo por seleccionar solo los dígitos.
    # No cruzar saltos de línea: pueden separar filas de una tabla.
    left = text[:start].rstrip(' \t')
    if left and (unicodedata.category(left[-1]) in ('Pd', 'Sm', 'Mn', 'Mc', 'Me', 'Cf')
                 or any(word in unicodedata.name(left[-1], '') for word in ('MINUS', 'PLUS'))):
        raise ValueError('Signo separado fuera del número seleccionado')
    patterns = {'es-ES': r'[+-]?(?:[0-9]{1,3}(?:\.[0-9]{3})+|[0-9]+)(?:,[0-9]+)?',
                'decimal': r'[+-]?[0-9]+(?:\.[0-9]+)?'}
    locale = binding['numberFormat']
    if locale not in patterns or not re.fullmatch(patterns[locale], literal):
        raise ValueError('Formato decimal ambiguo o inválido')
    value = literal.replace('.', '').replace(',', '.') if locale == 'es-ES' else literal
    expected = binding['value']
    if not isinstance(expected, str) or not re.fullmatch(r'[+-]?[0-9]+(?:\.[0-9]+)?', expected):
        raise ValueError('Valor del motor debe ser decimal canónico como cadena')
    if Decimal(value) != Decimal(expected):
        raise ValueError('Valor del motor distinto')
    unit = span(text, binding['unit'])
    unit_start, unit_end = binding['unit']['start'], binding['unit']['end']
    if (unit[0].isalnum() and unit_start and text[unit_start - 1].isalnum() or unit[-1].isalnum() and unit_end < len(text) and text[unit_end].isalnum()):
        raise ValueError('Unidad es substring de otro token')
    if unit not in ('%', 'euros', 'Euros', 'EUROS', '€', 'años'):
        raise ValueError('Unidad no soportada explícitamente')
    allowed = {'%': 'percent', 'euros': 'EUR', 'Euros': 'EUR', 'EUROS': 'EUR', '€': 'EUR', 'años': 'year'}
    if allowed[unit] != binding['unitCode']:
        raise ValueError('Unidad distinta')
    return True


def verify(record, citation, root, accepted=False, *, resolver=None):
    validate_schema(public_document(record), 'document')
    validate_schema(citation, 'citation')
    if citation['documentSha256'] != record['sha256']:
        raise ValueError('Referencia documental rota')
    crop_hash = citation['facsimile']['sha256']
    if not re.fullmatch('[0-9a-f]{64}', crop_hash) or digest(Path(root) / 'sha256' / crop_hash if resolver is None else resolver.resolve(crop_hash)) != crop_hash:
        raise ValueError('Facsímil ausente o corrupto')
    regenerated = cite(record, root, citation['page'], citation['bbox'], citation['engineBinding'], citation['table'], store=False, resolver=resolver)
    # No sobrescribir facsímil alterado: cite comprueba el CAS antes de escribir.
    for key in ('geometry', 'quote', 'normalization', 'extraction', 'selectors', 'facsimile'):
        if citation[key] != regenerated[key]:
            raise ValueError('Cita alterada: ' + key)
    if citation['table'] is not None:
        table = citation['table']
        if not table.get('row') or not table.get('column'):
            raise ValueError('Celda sin identificación de fila/columna')
    if accepted:
        raise ValueError('Aceptación deshabilitada: requiere inventario vigente y registro independiente externo')
    return {'integrity': 'verified', 'inventoryBinding': 'unverified',
            'semanticReview': 'pending', 'independentReview': 'pending', 'fiscalAcceptance': 'pending'}


def signatures(record, root):
    path = verify_blob(record, root)
    now = datetime.now(timezone.utc).isoformat()
    try:
        version = subprocess.run(['pdfsig', '-v'], capture_output=True, text=True, timeout=15)
        run = subprocess.run(['pdfsig', '-no-ocsp', str(path)], capture_output=True, text=True,
                             timeout=90, env={**os.environ, 'LC_ALL': 'C'})
    except (FileNotFoundError, subprocess.TimeoutExpired) as error:
        return {'status': 'not-validated', 'reason': str(error), 'checkedAt': now}
    output = run.stdout + run.stderr
    validations = re.findall(r'Signature Validation: (.+)', output)
    certificates = re.findall(r'Certificate Validation: (.+)', output)
    if 'does not contain any signatures' in output and run.returncode in (0, 2):
        status = 'unsigned'
    elif any('Invalid' in item or 'Digest Mismatch' in item for item in validations):
        status = 'invalid'
    elif validations and all(item.strip() == 'Signature is Valid.' for item in validations):
        status = 'trust-indeterminate'
    else:
        status = 'not-validated'
    return {'status': status, 'checkedAt': now, 'tool': 'pdfsig',
            'version': (version.stdout + version.stderr).strip(), 'exitCode': run.returncode,
            'signatureValidations': validations, 'certificateValidations': certificates,
            'report': output, 'networkPolicy': 'OCSP desactivado; AIA no solicitado',
            'scope': 'Integridad criptográfica; confianza histórica/revocación y cobertura total pendientes'}


def verify_csv(record, root, url, identifier):
    """Solo acredita que el endpoint CSV devuelve exactamente el original esperado."""
    verify_blob(record, root)
    response = download(url, root)
    return {'identifier': identifier, 'verificationUrl': url,
            'checkedAt': datetime.now(timezone.utc).isoformat(),
            'method': 'exact-document-sha256', 'responseSha256': response['sha256'],
            'status': 'byte-match' if response['sha256'] == record['sha256'] else 'not-validated',
            'scope': 'Coincidencia de bytes; asociación legal del identificador pendiente de revisión'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('.cache/procedencia'))
    commands = parser.add_subparsers(dest='command', required=True)
    importer = commands.add_parser('ingest')
    importer.add_argument('source', type=Path)
    for name in ('cite', 'verify', 'signature', 'rebuild', 'csv'):
        command = commands.add_parser(name)
        command.add_argument('manifest', type=Path)
        if name == 'csv':
            command.add_argument('--url', required=True)
            command.add_argument('--identifier', required=True)
        if name == 'cite':
            command.add_argument('--page', type=int, required=True)
            command.add_argument('--bbox', type=float, nargs=4, required=True)
            command.add_argument('--binding', type=Path)
            command.add_argument('--output', type=Path, required=True)
        if name == 'verify':
            command.add_argument('citation', type=Path)
            command.add_argument('--accepted', action='store_true')
    args = parser.parse_args()
    if args.command == 'ingest':
        result = ingest(args.source, args.root)
    else:
        record = json.loads(args.manifest.read_text())
        validate_schema(public_document(record), 'document')
        if args.command == 'cite':
            binding = json.loads(args.binding.read_text()) if args.binding else None
            result = cite(record, args.root, args.page, args.bbox, binding)
            atomic_json(args.output, result)
        elif args.command == 'verify':
            result = verify(record, json.loads(args.citation.read_text()), args.root, args.accepted)
        elif args.command == 'csv':
            result = verify_csv(record, args.root, args.url, args.identifier)
        elif args.command == 'signature':
            result = signatures(record, args.root)
        else:
            if (args.root / 'sha256' / record['sha256']).exists():
                verify_blob(record, args.root)
                result = {'status': 'already-present', 'sha256': record['sha256']}
            else:
                result = download(record['canonicalUrl'], args.root, expected_sha256=record['sha256'], refresh=True)
                verify_blob(record, args.root)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
