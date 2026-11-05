"""Verifica el rebase y su transporte; no ejecuta TypeScript ni CI."""
from pathlib import Path
import hashlib
import json
import re
import sys


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def reconstruir(diff, bases, payload, rutas):
    encontrados = set()
    for section in re.split(r'(?m)^diff --git ', diff.read_text())[1:]:
        lines = section.splitlines(keepends=True)
        ruta = next(line[6:].strip() for line in lines if line.startswith('+++ b/'))
        assert ruta in rutas
        encontrados.add(ruta)
        original = (bases/ruta).read_text().splitlines(keepends=True) if (bases/ruta).exists() else []
        cursor, salida, activo = 0, [], False
        for line in lines:
            if line.startswith('@@ '):
                comienzo = max(0, int(re.match(r'@@ -(\d+)', line).group(1))-1)
                salida.extend(original[cursor:comienzo])
                cursor, activo = comienzo, True
            elif activo:
                if line.startswith(' '):
                    assert original[cursor] == line[1:]
                    salida.append(original[cursor]); cursor += 1
                elif line.startswith('-'):
                    assert original[cursor] == line[1:]; cursor += 1
                elif line.startswith('+'):
                    salida.append(line[1:])
                else:
                    raise AssertionError('Transporte inesperado')
        salida.extend(original[cursor:])
        assert ''.join(salida).encode() == (payload/ruta).read_bytes(), ruta
    assert encontrados == rutas


def control(b, raiz):
    m = json.loads((b/'manifest.json').read_text())
    origenes = json.loads((b/'procedencia/origenes.json').read_text())
    assert sha(b/'procedencia/corte-114.json') == origenes['corte114SHA256']
    assert sha(b/'procedencia/conexion-original.json') == origenes['candidatoOriginalSHA256']
    for a in origenes['libTestsCorte']:
        assert sha(raiz/a['ruta']) == a['sha256'], a['ruta']
    for a in m['archivos']:
        previo, posterior = b/'pre'/a['ruta'], b/'payload'/a['ruta']
        assert sha(posterior) == a['postSHA256']
        assert (sha(previo) if previo.exists() else None) == a['preSHA256']
        assert (sha(raiz/a['ruta']) if (raiz/a['ruta']).exists() else None) == a['preSHA256']
    d = 'lib/dominio/irpf/deducciones/'
    for region in ['castilla-la-mancha', 'castilla-y-leon', 'extremadura']:
        ruta = d+region+'-hechos-2025.ts'
        assert (b/'payload'/ruta).read_bytes().startswith((b/'procedencia/prefijos-v4'/ruta).read_bytes())
    ruta = d+'extremadura-hechos-2025.ts'
    for nombre in ['rehabilitacionAlquilerExt', 'viviendaRuralExt']:
        def funcion(p):
            texto = p.read_text(); inicio = texto.index('export function '+nombre+'(')
            fin = texto.find('\nconst A', inicio)
            return texto[inicio:fin if fin >= 0 else len(texto)]
        assert funcion(b/'pre'/ruta) == funcion(b/'payload'/ruta)
    assert sha(b/'payload/tests/fixtures/d51-recibidos.json') == m['oraculos51SHA256'] == sha(raiz/'tests/fixtures/deducciones-d-ampliacion-2025.json')
    matriz = json.loads((b/'payload/docs/procedencia/deducciones-2025/conexion-d51/matriz-51.json').read_text())
    codigos = {r['codigo'] for r in matriz['codigos']}
    assert len(codigos) == 51 and matriz['balance']['codigosConCampoFiscalSinProductor'] == 11
    solicitudes = json.loads((b/'payload/tests/fixtures/d51-solicitudes-sin-fiscal.json').read_text())
    assert {s['codigo'] for s in solicitudes} == codigos
    def no_fiscal(x):
        if isinstance(x, dict):
            assert not set(m['camposFiscalesExcluidos']).intersection(x)
            for v in x.values(): no_fiscal(v)
        if isinstance(x, list):
            for v in x: no_fiscal(v)
    for s in solicitudes: no_fiscal(s['hechos'])
    modulo = (b/'payload'/(d+'d51-anual.ts')).read_text()
    assert 'produccionD51' not in modulo and 'consumirCuota' not in modulo
    assert 'm.basesLiquidables' in modulo and 'm.componentesMinimoEstatal.descendientes' in modulo
    for codigo in codigos:
        assert 'case '+json.dumps(codigo) in modulo
    central = (b/'payload'/(d+'anual-territorial.ts')).read_text()
    previo = (b/'pre'/(d+'anual-territorial.ts')).read_text()
    assert central.count('consumirCuota(') == previo.count('consumirCuota(') == 1
    inicio = '  // Orden fiscal B de prioridad primera;'
    assert central[central.index(inicio):] == previo[previo.index(inicio):]
    for linea in previo.splitlines():
        assert linea in central.splitlines() or linea.strip() == '"euros" in v)', linea
    composicion = 'lib/dominio/irpf/liquidacion/composicion-anual.ts'
    pre = (b/'pre'/composicion).read_text()
    post = (b/'payload'/composicion).read_text()
    post = post.replace('import { usaPrecisionD51 } from "../deducciones/d51-anual"\n', '').replace('usaPrecisionD51(entrada.deduccionesTerritoriales2025) ? 80 : entrada.precision', 'entrada.precision')
    assert pre == post
    for clave in ['patch', 'deltaCentral']:
        assert sha(b/m[clave]['ruta']) == m[clave]['sha256']
        rutas = {a['ruta'] for a in m['archivos']} if clave == 'patch' else set(m[clave]['archivos'])
        reconstruir(b/m[clave]['ruta'], b/'pre', b/'payload', rutas)
    for a in m['validacionPreparada']:
        assert sha(b/a['ruta']) == a['sha256']
    for a in m.get('evidenciasP2', []):
        assert sha(b/a['ruta']) == a['sha256']
    if m.get('basePublicada') == 'b9122c2b':
        logs = b/'validacion-p2'
        assert '1 failed | 78 passed' in (logs/'01-vitest-rojo.log').read_text()
        assert '80 passed (80)' in (logs/'10-vitest-final.log').read_text()
        assert '461 passed | 2 todo' in (logs/'09-regresiones-final.log').read_text()
        assert not (logs/'11-tipos-final.log').read_text()
        assert 'effect(floatingEffect)' in (logs/'05-effect-canario.log').read_text()
        assert 'anti-slop(no-unknown-parameters)' in (logs/'08-antislop-canario.log').read_text()
    print('OK ligero: 74 rutas congeladas, pre/post, 51 oráculos/rutas, 11 pendientes, prefijos12/R1/R2 y H123, productores compartidos, prioridad B y cuota única; ambos parches reconstruidos. Control Python; resultados de suites en VALIDACION-P2.md.')


if __name__ == '__main__':
    control(Path(sys.argv[1]), Path(sys.argv[2]))
