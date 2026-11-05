"""Control ligero: estructura y oráculos racionales; no ejecuta TypeScript."""
from pathlib import Path
from fractions import Fraction as F
import hashlib
import json
import re
import sys


def control(entrega: Path, raiz: Path) -> None:
    m = json.loads((entrega / "manifest.json").read_text())
    for archivo in m["archivos"]:
        relativo = archivo["ruta"]
        original = raiz / relativo
        previo = hashlib.sha256(original.read_bytes()).hexdigest() if original.exists() else None
        assert previo == archivo["preSHA256"], relativo
        assert hashlib.sha256((entrega / "payload" / relativo).read_bytes()).hexdigest() == archivo["postSHA256"], relativo
    for entrada in m["fuentesConsumidas"]:
        assert hashlib.sha256((raiz / entrada["ruta"]).read_bytes()).hexdigest() == entrada["sha256"], entrada["ruta"]
    base = json.loads((raiz / "docs/procedencia/deducciones-2025/producto-lote-d-hechos/matriz-63.json").read_text())
    matriz = json.loads((entrega / "payload/docs/procedencia/deducciones-2025/producto-lote-d-hechos/matriz-63.json").read_text())
    anteriores = {r["codigo"]: r for r in base["deducciones"]}
    nuevos = {r["codigo"]: r for r in matriz["deducciones"]}
    assert len(nuevos) == len(matriz["deducciones"]) == 63
    assert nuevos.keys() == anteriores.keys()
    reutilizados = [r for r in base["deducciones"] if r["funcion"]]
    assert len(reutilizados) == 12
    for r in reutilizados:
        assert r == nuevos[r["codigo"]], r["codigo"]
    for region in ["castilla-la-mancha", "castilla-y-leon", "extremadura"]:
        ruta = "lib/dominio/irpf/deducciones/" + region + "-hechos-2025.ts"
        anterior = (raiz / ruta).read_bytes()
        actual = (entrega / "payload" / ruta).read_bytes()
        assert actual.startswith(anterior), ruta
        funciones = re.findall(rb"export function (\w+)\(", actual)
        assert len(funciones) == len(set(funciones)), ruta
    fixtures = json.loads((entrega / "payload/tests/fixtures/deducciones-d-ampliacion-2025.json").read_text())
    assert len(fixtures) == len({c["codigo"] for c in fixtures}) == 51
    assert {c["codigo"] for c in fixtures} == {r["codigo"] for r in base["deducciones"] if not r["funcion"]}
    def contrato(spec, valor):
        if isinstance(spec,dict):
            assert isinstance(valor,dict) and set(spec)==set(valor)
            for key in spec: contrato(spec[key],valor[key])
        elif isinstance(spec,list):
            assert isinstance(valor,list)
            for value in valor: contrato(spec[0],value)
        elif spec=="p":
            contrato([{"id":"s","fecha":"s","pagador":"s","importe":"s"}],valor)
        elif spec=="a":
            contrato({"ejercicio":2025,"declarantes":"ss","concepto":"s","valor":"s"},valor)
        elif spec=="ss":
            assert isinstance(valor,list) and all(isinstance(x,str) for x in valor)
        elif spec=="s": assert isinstance(valor,str)
        elif spec=="n": assert isinstance(valor,(int,float))
        elif isinstance(spec,str) and spec.startswith("="): assert valor in spec[1:].split("|")
        else: assert spec==valor
    for c in fixtures: contrato(nuevos[c["codigo"]]["contratoHechos"],c["datos"])
    # Aritmética explícita independiente de Decimal/TS; un oráculo por cada fixture.
    oraculos = {
        "familiaMonoparental": F(200), "familiaNumerosaAmpliada": F(900,2),
        "discapacidadFamiliares": F(300,2), "gastosEducacion": min(F(100)+F(200)*F(15,100),F(100))-10,
        "guarderia": min(F(900)*F(30,100),F(250,2)), "acogimientoMenores": F(500,2), "acogimientoMayores": F(600,2),
        "alquilerJoven": F(612,2), "alquilerDacion": F(500,2), "alquilerNumerosa": F(500,2),
        "alquilerMonoparental": F(500,2), "alquilerDiscapacidad": F(500,2),
        "donacionesCooperacion": min(F(1000),F(10000)*F(1,10))*F(15,100),
        "donacionesIdi": min(F(1000)*F(15,100),F(500)*F(1,10)),
        "mecenazgoCultural": min(F(2000),F(10000)*F(1,10))*F(15,100),
        "interesesPrimeraVivienda": min(F(150),F(500)), "residenciaRural": F(1000)*F(25,100),
        "viviendaRural": F(10000)*F(15,100), "trasladoLaboral": min(F(500),F(400)),
        "inversionMercantil": min(F(4000),F(10000)*F(20,100)), "inversionEconomiaSocial": min(F(4000),F(10000)*F(20,100)),
        "cuentaVivienda": min(F(750),F(3000),F(5000)*F(15,100)), "perrosAsistencia": min(F(100),F(400)*F(30,100)),
        "nacimientoCyl": F(1010,2), "multiplesCyl": (F(1010)+F(1475))/2*F(1,2),
        "cuidadoMenoresCyl": min(F(1320)-1000,F(1200)-1000), "viviendaJovenRuralCyl": F(10000)*F(15,100),
        "rehabilitacionSubvencionadaCyl": F(20000)*F(15,100), "rehabilitacionAlquilerCyl": F(20000)*F(15,100),
        "emprendimientoCyl": min(F(10000),F(60000)*F(20,100)), "patrimonioCyl": (F(1000)-500)*F(15,100),
        "donacionesPatrimonioCyl": (F(1000)-500)*F(15,100), "donacionesIdiCyl": (F(1000)-500)*F(15,100),
        "movilidadCyl": min(F(20000)*F(15,100),F(4000,2)-1500),
        "viviendaNuevaCyl": F(9040)*F(75,1000), "alquilerJovenCyl": min(F(612),F(2000)*F(25,100),F(2000)-1000),
        "acogimientoMenoresExt": F(250,2), "viudedadExt": F(200), "cuidadoDiscapacidadExt": F(220,2),
        "cuidadoHasta14Ext": min(F(400),F(4000)*F(1,10))*F(3000,4000),
        "viviendaJovenExt": F(9040)*F(5,100), "alquilerExt": min(F(6000)*F(30,100),F(1500,2)),
        "arrendadoresVaciasExt": min(F(1200),F(1500)), "rehabilitacionAlquilerExt": F(9040)*F(15,100),
        "inversionMercantilExt": (F(10000)-2000)*F(20,100), "viviendaRuralExt": F(9040)*F(10,100),
        "residenciaRuralExt": F(1000)*F(15,100), "interesesJovenExt": min(F(1200),F(1000))*F(25,100),
        "donativosExt": min(F(500),F(3000)*F(20,100)), "trasladoExt": F(1000)*F(75,100),
        "subvencionesElaExt": F(1500)*F(10+8,100),
    }
    assert len(oraculos) == 51
    for c in fixtures:
        assert F(int(c["numerador"]),int(c["denominador"])) == oraculos[c["funcion"]], c["codigo"]
        row = nuevos[c["codigo"]]
        assert row["funcion"] == c["funcion"] and row["siguienteRama"]
        assert row["conexionAnual"] is False and row["aceptacionFiscal"] == "pendiente"
    assert F(500,2)/365 == F(50,73)
    # Reconstrucción POSIX en memoria: no usa Git ni escribe sobre la raíz.
    reconstruidos = {}
    for section in re.split(r"(?m)^diff --git ",(entrega / "entrega.patch").read_text())[1:]:
        lines = section.splitlines(keepends=True)
        path = next(line[6:].strip() for line in lines if line.startswith("+++ b/"))
        original = (raiz / path).read_text().splitlines(keepends=True) if (raiz / path).exists() else []
        cursor = 0
        resultado = []
        activo = False
        for line in lines:
            if line.startswith("@@ "):
                hunk = re.match(r"@@ -(\d+)(?:,\d+)? \+\d+(?:,\d+)? @@",line)
                assert hunk, line
                comienzo = max(0,int(hunk.group(1))-1)
                resultado.extend(original[cursor:comienzo])
                cursor = comienzo
                activo = True
            elif activo:
                if line.startswith(" "):
                    assert original[cursor] == line[1:]
                    resultado.append(original[cursor]); cursor += 1
                elif line.startswith("-"):
                    assert original[cursor] == line[1:]
                    cursor += 1
                elif line.startswith("+"):
                    resultado.append(line[1:])
                else:
                    raise AssertionError("Transporte diff inesperado")
        resultado.extend(original[cursor:])
        reconstruidos[path] = "".join(resultado).encode()
    assert set(reconstruidos) == {a["ruta"] for a in m["archivos"]}
    for path,data in reconstruidos.items():
        assert data == (entrega / "payload" / path).read_bytes(), path
    assert hashlib.sha256((entrega / "entrega.patch").read_bytes()).hexdigest() == m["patch"]["sha256"]
    print("OK: 63 códigos; 12 filas y prefijos intactos; 51 funciones/fixtures/oráculos Fraction; parche reconstruido byte a byte. Este control Python no ejecuta TS; consultar controles separados.")


if __name__ == "__main__":
    control(Path(sys.argv[1]),Path(sys.argv[2]))
