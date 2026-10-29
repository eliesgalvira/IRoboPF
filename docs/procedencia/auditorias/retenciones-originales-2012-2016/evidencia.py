"""Extrae evidencia candidata, sin aceptar reglas. Ejecutar con run.sh y flock."""
import base64
import hashlib
import json
import subprocess
from pathlib import Path

import fitz

OUT = Path('docs/procedencia/auditorias/retenciones-originales-2012-2016')
CACHE = Path('.cache/procedencia/retenciones-originales-2012-2016')


def guardar(nombre, datos):
    (OUT / nombre).write_text(json.dumps(datos, ensure_ascii=False, indent=2) + '\n')


def main():
    registros = [json.loads(line) for line in (OUT / 'adquisicion.jsonl').read_text().splitlines()]
    documentos = {}
    cdx = []
    for registro in registros:
        if 'document' not in registro:
            continue
        meta = registro['document']
        datos = (CACHE / 'sha256' / meta['sha256']).read_bytes()
        assert hashlib.sha256(datos).hexdigest() == meta['sha256']
        assert hashlib.sha512(datos).hexdigest() == meta['sha512']
        assert len(datos) == meta['size']
        if '/cdx/' in registro['url']:
            filas = json.loads(datos)
            for fila in filas[1:]:
                cdx.append(dict(zip(filas[0], fila, strict=True)))
        if meta['mimeType'] != 'application/pdf':
            continue
        sha = meta['sha256']
        if sha not in documentos:
            documentos[sha] = {'sha256': sha, 'sha512': meta['sha512'], 'size': meta['size'],
                               'mime': meta['mimeType'], 'localPath': str(CACHE / 'sha256' / sha), 'adquisiciones': []}
        documentos[sha]['adquisiciones'].append(meta)
    citas = []
    for sha, documento in documentos.items():
        original = Path(documento['localPath'])
        pdf = fitz.open(original)
        urls = [m['canonicalUrl'] for m in documento['adquisiciones']]
        archivado = any('/web/' in u for u in urls)
        algoritmo = any('/ALGORITMO' in u or '/Algoritmo' in u for u in urls)
        documento['clase'] = 'algoritmo-captura-secundaria' if algoritmo else ('apoyo-captura-secundaria' if archivado else 'apoyo-emisor-actual')
        documento['pages'] = len(pdf)
        documento['portada'] = pdf[0].get_text()
        documento['integridad'] = 'sha256-sha512-size-verificados'
        documento['autenticidad'] = 'no-certificada'
        documento['interpretacion'] = 'candidata'
        documento['exactitudMotor'] = 'sin-validacion-numerica'
        documento['aceptacion'] = False
        digest = base64.b32encode(hashlib.sha1(original.read_bytes()).digest()).decode().rstrip('=')
        documento['cdxCoincidente'] = [r for r in cdx if r['digest'] == digest]
        firma = subprocess.run(['pdfsig', '-nocert', str(original)], capture_output=True, text=True, check=False)
        documento['firma'] = {'comando': 'pdfsig -nocert ORIGINAL', 'exitCode': firma.returncode,
                              'resumenSaneado': [line.strip() for line in firma.stdout.splitlines()
                                                if any(k in line for k in ['Signature Validation:', 'Certificate Validation:', 'does not contain any signatures'])],
                              'limite': 'Sin validacion de cadena de certificados, revocacion ni confianza historica; sin publicar identidad de firmantes.'}
        texto = []
        paginas = []
        for i in range(len(pdf)):
            pagina = pdf[i]
            contenido = pagina.get_text()
            texto.append(f'\nPAGINA FISICA {i + 1}\n{contenido}')
            paginas.append({'page': i + 1, 'text': contenido})
        (CACHE / (sha + '.txt')).write_text(''.join(texto))
        # Páginas de cálculo, portada y marco temporal; no renderizar manuales completos.
        if algoritmo:
            seleccion = [1, 3, 4, *range(19, 39)]
        elif '4b1117' in sha:
            seleccion = [7, 8, 13, 14, 15]
        elif sha.startswith('6e2dc7'):
            seleccion = [11, 12]
        elif sha.startswith('89eaeb'):
            seleccion = [54]
        elif sha.startswith('bc36ac'):
            seleccion = [4]
        elif sha.startswith('2f1384'):
            seleccion = [1]
        elif sha.startswith('d1fc0f'):
            seleccion = [8, 9, 10, 16, 17, 18, 19, 21, 22, 23, 24]
        elif sha.startswith('6fe878'):
            seleccion = [p['page'] for p in paginas if 'retención' in p['text'] and 'Artículo' in p['text']][-4:]
        else:
            seleccion = [1]
        documento['paginasSeleccionadas'] = seleccion
        for numero in seleccion:
            pagina = pdf[numero - 1]
            caja = list(pagina.rect)
            cita_id = f'{sha[:12]}-p{numero}'
            captura = OUT / 'facsimiles' / (cita_id + '.png')
            captura.parent.mkdir(exist_ok=True)
            imagen = pagina.get_pixmap(dpi=72, alpha=False, colorspace=fitz.csRGB).tobytes('png')
            captura.write_bytes(imagen)
            quote = pagina.get_textbox(fitz.Rect(caja))
            assert quote == pagina.get_textbox(fitz.Rect(caja))
            citas.append({'id': cita_id, 'documentSha256': sha, 'page': numero,
                          'pageConvention': 'fisica-1-based', 'coordinateSystem': 'PDF-points-top-left',
                          'bbox': caja, 'quote': quote, 'extraction': 'text-layer',
                          'warning': 'Cita de pagina completa candidata. Glifos y tachados requieren inspeccion visual; no normalizar texto para binding.',
                          'facsimile': {'path': str(captura), 'sha256': hashlib.sha256(imagen).hexdigest(),
                                        'dpi': 72, 'engine': 'PyMuPDF', 'version': fitz.VersionBind,
                                        'colorspace': 'RGB', 'alpha': False, 'clip': caja},
                          'review': 'pendiente', 'acceptance': False})
    guardar('fuentes.json', list(documentos.values()))
    guardar('citas.json', citas)
    guardar('verificacion.json', {'documentosPDF': len(documentos), 'citasReextraidas': len(citas),
                                 'engine': fitz.VersionBind, 'aceptacionFiscal': False})
    print(json.dumps({'pdfs': len(documentos), 'citas': len(citas)}))


if __name__ == '__main__':
    main()
