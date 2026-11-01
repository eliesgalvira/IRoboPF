"""Validación documental; nunca aceptación fiscal. Dependencia: jsonschema==4.26.0."""
import argparse
import hashlib
import json
import math
import re
import sys
from pathlib import Path
from urllib.parse import parse_qsl, urlsplit
from datetime import date, datetime

from jsonschema import Draft202012Validator

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
SCHEMA = json.loads((HERE / 'contrato.schema.json').read_text())


def exigir(ok, mensaje):
    if not ok:
        raise ValueError(mensaje)


def unicos(valores, contexto):
    exigir(len(set(valores)) == len(valores), f'{contexto}: duplicados')


def validar_schema(valor, regla):
    Draft202012Validator(regla).validate(valor)


def privacidad(valor):
    if isinstance(valor, float):
        exigir(math.isfinite(valor), "Número JSON no finito")
    if isinstance(valor, str):
        exigir(not re.search(r'/(?:home|Users|tmp|private|var|mnt)/|file://|[A-Z]:\\|data:[^;]+;base64|-----BEGIN|<html\b|%PDF-', valor, re.I), 'Contenido privado u original embebido')
        exigir(len(valor) <= 20000, 'Texto excesivo: revisar original embebido')
    elif isinstance(valor, list):
        for x in valor:
            privacidad(x)
    elif isinstance(valor, dict):
        for k, x in valor.items():
            exigir(not re.fullmatch(r'localPath|cookie|authorization|session|password|token|ip|hostname|usuario', k, re.I), f'Campo privado: {k}')
            privacidad(x)


def referencias(ids, disponibles, contexto):
    exigir(isinstance(ids, list), f'{contexto}: citas debe ser array')
    unicos(ids, contexto)
    for ident in ids:
        exigir(ident in disponibles, f'{contexto}: referencia rota {ident}')


def refs_anidadas(valor, disponibles, contexto):
    if isinstance(valor, dict):
        for k, x in valor.items():
            if k in ('citas', 'citaIds'):
                referencias(x, disponibles, contexto)
            else:
                refs_anidadas(x, disponibles, contexto)
    elif isinstance(valor, list):
        for x in valor:
            refs_anidadas(x, disponibles, contexto)


def comprobar_bytes(documento, cas):
    exigir(cas and cas.get('formato') in ('sha256', 'plano'), 'CAS externo y formato explícito requeridos')
    root = Path(cas['root']).resolve(strict=True)
    exigir(not root.is_relative_to(REPO), 'CAS debe estar fuera del repositorio')
    exigir(re.fullmatch('[a-f0-9]{64}', documento['sha256']), 'Hash SHA256 inválido')
    archivo = (root / ('sha256' if cas['formato'] == 'sha256' else '') / documento['sha256']).resolve(strict=True)
    exigir(archivo.is_relative_to(root), 'CAS: enlace fuera del root')
    contenido = archivo.read_bytes()
    exigir(len(contenido) == documento['bytes'], f"Bytes incorrectos: {documento['id']}")
    for algoritmo in ('sha256', 'sha512'):
        exigir(hashlib.new(algoritmo, contenido).hexdigest() == documento[algoritmo], f"Hash {algoritmo} incorrecto: {documento['id']}")


def comprobar_comparaciones(f):
    codigo = f['codigo']
    anteriores = [x for x in f['comparaciones'] if x.get('momento', 'despues') == 'antes']
    actuales = [x for x in f['comparaciones'] if x.get('momento', 'despues') == 'despues']
    campos_actuales = {x['campoCodigo'] for x in actuales}
    if anteriores:
        exigir(f['cambios'], f'{codigo}: comparación anterior sin cambio acreditado')
        exigir(all(x['campoCodigo'] in campos_actuales for x in anteriores),
               f'{codigo}: comparación anterior sin contraste actual del mismo aspecto')
    resultados = {x['resultado'] for x in actuales}
    if 'diferencia' in resultados:
        exigir(f['dictamenDespues'] == 'diferencia'
               and 'diferencia' in (f['dictamenFicha'], f['dictamenCalculo']),
               f'{codigo}: global oculta diferencia actual')
    if 'no_verificable' in resultados:
        exigir(f['pendientes'] and f['dictamenDespues'] != 'coincide',
               f'{codigo}: global oculta reserva actual')
    if f['dictamenDespues'] == 'diferencia':
        exigir('diferencia' in resultados,
               f'{codigo}: diferencia actual sin comparación actual discrepante')
    if f['dictamenDespues'] == 'coincide':
        exigir(actuales and resultados == {'coincide'},
               f'{codigo}: coincidencia sin comparación actual concordante')


def verificar_paquetes(censo, paquetes, modo='parcial', cas=None):
    exigir(modo in ('parcial', 'completo'), 'Modo desconocido')
    exigir(censo['total'] == 351 and len(censo['fichas']) == 351, 'Censo: se requieren exactamente 351 fichas')
    unicos([f['codigo'] for f in censo['fichas']], 'Censo')
    censadas = {f['codigo']: f for f in censo['fichas']}
    for f in censo['fichas']:
        exigir(f['comunidad'] in censo['lotes'].get(f['lote'], []), 'Censo: lote/comunidad incoherente')
    unicos([p['dictamenes']['lote'] for p in paquetes], 'Lotes')
    vistos, contenidos = set(), {}
    for paquete in paquetes:
        lote, fuentes = paquete['dictamenes'], paquete['fuentes']
        validar_schema(lote, SCHEMA['$defs']['lote'])
        validar_schema(fuentes, SCHEMA['$defs']['fuentes'])
        privacidad(lote)
        privacidad(fuentes)
        unicos([d['id'] for d in fuentes['documentos']], 'Documentos')
        docs = {d['id']: d for d in fuentes['documentos']}
        for d in docs.values():
            url = urlsplit(d['urlOficial'])
            exigir(url.scheme == 'https' and url.hostname and not url.username and not url.password and not url.fragment and not re.match(r'localhost$|\d+\.\d+\.\d+\.\d+$|.*:', url.hostname), f"URL pública inválida: {d['id']}")
            parametros = {k.casefold() for k, _ in parse_qsl(url.query, keep_blank_values=True)}
            exigir(not parametros.intersection({'token', 'key', 'session', 'signature', 'auth'}), 'URL con credenciales')
            date.fromisoformat(d['fechaPublicacion'])
            datetime.fromisoformat(d['fechaRecuperacion'].replace('Z', '+00:00'))
            # Los IDs pertenecen al lote; cada adquisición conserva URL y fecha.
            # El contenido compartido debe conservar tamaño, digest y formato.
            contenido = {k: d[k] for k in ('sha512', 'bytes', 'mimeType')}
            exigir(d['sha256'] not in contenidos or contenidos[d['sha256']] == contenido,
                   f"Contenido contradictorio: {d['id']}")
            contenidos[d['sha256']] = contenido
            if cas:
                comprobar_bytes(d, cas)
        for f in lote['deducciones']:
            codigo = f['codigo']
            c = censadas.get(codigo)
            exigir(c and c['comunidad'] == f['comunidad'] and c['lote'] == lote['lote'], f'Código/comunidad/lote incorrecto: {codigo}')
            exigir(codigo not in vistos, f'Código duplicado: {codigo}')
            vistos.add(codigo)
            unicos([x['id'] for x in f['citas']], f'{codigo}: citas')
            citas = {x['id']: x for x in f['citas']}
            for cita in citas.values():
                d = docs.get(cita['documentoId'])
                exigir(d, f"Documento no declarado: {cita['documentoId']}")
                loc = cita['localizador']
                exigir((loc['tipo'] == 'pdf') == (d['mimeType'] == 'application/pdf'), 'MIME/localizador incoherente')
                if loc['tipo'] == 'pdf':
                    x0, y0, x1, y1 = loc['bbox']
                    exigir(x1 > x0 and y1 > y0, 'bbox vacía')
                else:
                    exigir(loc['fin'] > loc['inicio'], 'Rango HTML vacío')
            refs_anidadas(f['vigencia'], citas, 'Vigencia')
            refs_anidadas(f['manual'], citas, 'Manual')
            for x in f['comparaciones']:
                referencias(x['citas'], citas, 'Comparación')
            for x in f['cambios']:
                exigir(not Path(x['archivo']).is_absolute() and '..' not in re.split(r'[/\\]', x['archivo']), 'Cambio: ruta no relativa segura')
            actuales = [f[k] for k in ('dictamenDespues', 'dictamenFicha', 'dictamenCalculo')]
            if 'no_verificable' in actuales:
                exigir(f['pendientes'], f'{codigo}: falta límite concreto de evidencia')
            if 'diferencia' in actuales or f['dictamenAntes'] == 'diferencia':
                exigir(f['contraejemplos'] and any(x['resultado'] == 'diferencia' for x in f['comparaciones']), f'{codigo}: diferencia sin discriminante')
            if f['dictamenAntes'] != f['dictamenDespues']:
                exigir(f['cambios'], f'{codigo}: transición sin prueba roja/fix')
            comprobar_comparaciones(f)
            if any(x != 'no_verificable' for x in actuales):
                exigir(f['comparaciones'] and any(docs[x['documentoId']]['tipo'] == 'original' for x in f['citas']), f'{codigo}: dictamen sin original/comparación')
                manual = f['manual']
                exigir(docs.get(manual.get('documentoId'), {}).get('tipo') == 'manual', f'{codigo}: manual sin documento')
                exigir(manual.get('paginasFicha') == c['fuenteManual']['paginas'], f'{codigo}: páginas de ficha no preservadas')
                exigir(manual.get('paginasComprobadas') and manual.get('citas') and f['vigencia'].get('citas'), f'{codigo}: faltan vínculos de manual/vigencia')
                for ident in manual['citas']:
                    exigir(citas[ident]['documentoId'] == manual['documentoId'], 'Cita del manual apunta a otro documento')
            if f['dictamenDespues'] == 'coincide':
                exigir(f['dictamenFicha'] == f['dictamenCalculo'] == 'coincide', f'{codigo}: global oculta límites/diferencias')
            if 'diferencia' in [f['dictamenFicha'], f['dictamenCalculo']]:
                exigir(f['dictamenDespues'] == 'diferencia', f'{codigo}: global oculta diferencia')
        exigir(all(f['codigo'] in vistos for f in censo['fichas'] if f['lote'] == lote['lote']), f"Lote {lote['lote']}: cobertura incompleta")
    pendientes = [f['codigo'] for f in censo['fichas'] if f['codigo'] not in vistos]
    exigir(modo != 'completo' or not pendientes, f'Cobertura incompleta: faltan {len(pendientes)}')
    return dict(estadoRevision='candidato', recibidas=len(vistos), pendientes=pendientes, integridadBytes='comprobada' if cas else 'no_comprobada', vigenciaJuridica='requiere_revision_independiente')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--operacion', choices=['paquetes', 'bytes', 'schema'])
    parser.add_argument('--lotes', type=Path)
    parser.add_argument('--modo', choices=['parcial', 'completo'], default='parcial')
    parser.add_argument('--cas')
    parser.add_argument('--formato', choices=['sha256', 'plano'])
    args = parser.parse_args()
    if args.operacion:
        entrada = json.load(sys.stdin)
        if args.operacion == 'paquetes':
            resultado = verificar_paquetes(**entrada)
        elif args.operacion == 'bytes':
            comprobar_bytes(**entrada)
            resultado = None
        else:
            validar_schema(**entrada)
            resultado = None
    else:
        exigir(args.lotes, '--lotes obligatorio')
        paquetes = []
        for letra in 'abcdefg':
            d, f = args.lotes / letra / 'dictamenes.json', args.lotes / letra / 'fuentes.json'
            exigir(d.exists() == f.exists(), f'Lote {letra}: falta pareja dictámenes/fuentes')
            if d.exists():
                dictamenes = json.loads(d.read_text())
                exigir(dictamenes['lote'] == letra, f'Directorio/lote incoherente: {letra}')
                paquetes.append(dict(dictamenes=dictamenes, fuentes=json.loads(f.read_text())))
        censo = json.loads((REPO / 'docs/procedencia/deducciones-2025/censo.json').read_text())
        cas = dict(root=args.cas, formato=args.formato) if args.cas else None
        resultado = verificar_paquetes(censo, paquetes, args.modo, cas)
    print(json.dumps(resultado, ensure_ascii=False, allow_nan=False))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
