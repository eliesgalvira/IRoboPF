"""Reabre originales CAS; no descarga ni modifica registros compartidos."""
import hashlib
import json
from pathlib import Path
import pymupdf

root = Path(__file__).resolve().parent
catalogo = root.parents[1] / 'auditorias/trabajo-deducciones-estatales/documentos.json'
salida = []
for documento in json.loads(catalogo.read_text()):
    etiqueta = documento['auditLabel']
    if etiqueta not in ['reglamento-original', 'aeat2025', 'aeat2015', 'ley26-2009', 'correccion2009', 'ley26-2014']:
        continue
    with open(documento['localPath'], 'rb') as archivo:
        assert hashlib.file_digest(archivo, 'sha256').hexdigest() == documento['sha256']
    with pymupdf.open(documento['localPath']) as pdf:
        for indice, pagina in enumerate(pdf):
            texto = pagina.get_text()
            elegida = (
                (etiqueta == 'reglamento-original' and '500 euros' in texto)
                or (etiqueta == 'aeat2025' and indice + 1 in [1374, 1375])
                or (etiqueta == 'aeat2015' and indice + 1 in [144, 145])
                or (etiqueta == 'ley26-2009' and 'Artículo 70.' in texto)
                or etiqueta == 'correccion2009'
                or (etiqueta == 'ley26-2014' and ('80 bis' in texto or 'sexta.' in texto))
            )
            if elegida:
                salida.append({'fuente': etiqueta, 'sha256': documento['sha256'], 'url': documento['canonicalUrl'], 'paginaFisica': indice+1, 'texto': texto})
(root / 'cadena-releida.json').write_text(json.dumps(salida, ensure_ascii=False, indent=2))
print(json.dumps(salida, ensure_ascii=False, indent=2))
