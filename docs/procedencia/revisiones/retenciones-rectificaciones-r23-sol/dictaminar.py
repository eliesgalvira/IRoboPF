"""Decisiones humanas materializadas; no es un validador de admisión."""

import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = Path.cwd()
AUTHOR = ROOT / "docs/procedencia/revisiones/retenciones-2012-2014-sol"


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def main():
    cases = [
        (
            "fecha-antes",
            "Resolución 10/07, comunicación 11/07, confección 15/07; cuatro días.",
            "No aplicar todavía en esa nómina; falta antelación mínima.",
            "87.4/88.4 históricos",
        ),
        (
            "fecha-en",
            "Mismos hechos; confección 16/07, cinco días.",
            "Frontera temporal satisfecha; aún exige resto de hechos y política del pagador.",
            "87.4/88.4 históricos",
        ),
        (
            "fecha-despues",
            "Mismos hechos; confección 17/07, seis días.",
            "Antelación satisfecha; no demuestra cuantía ni retroactividad.",
            "87.4/88.4 históricos",
        ),
        (
            "anualidad-antes",
            "A=0; BASE=20000.",
            "Fuera: no anualidad positiva.",
            "Adenda;85.2",
        ),
        (
            "anualidad-dentro",
            "A=6000; BASE=20000; demás hechos acreditados.",
            "Solo presupuesto de separación; no resultado de nómina.",
            "Adenda;85.2",
        ),
        (
            "anualidad-en",
            "A=BASE=20000.",
            "Fuera: desigualdad estricta incumplida.",
            "85.2 histórico",
        ),
        (
            "anualidad-despues",
            "A=20000.01; BASE=20000.",
            "Fuera; no aplicar una escala separada por esta receta.",
            "85.2 histórico",
        ),
        (
            "candidato-inferior",
            "m=2,t=6,a=12 con misma calificación.",
            "Techo devuelve6; asignar12 elevaría indebidamente.",
            "87.5;subpaso",
        ),
        (
            "minimo-cambiado-igual",
            "Mínimo conserva valor2 pero cambia calificación laboral.",
            "Fuera por cambio de calificación, aunque coincida la cifra.",
            "Adenda",
        ),
        (
            "minimo-cambiado",
            "m anterior0 y nuevo2.",
            "Fuera del subcontrato, aun compatible numéricamente.",
            "Adenda",
        ),
        (
            "minimo-superior",
            "m=15,a=12,t=18.",
            "Fuera. min(max(t,m),a)=12 y max(min(t,a),m)=15 no son alternativas aceptadas.",
            "Adenda;86.2;87.3",
        ),
        (
            "minimo-incumplido",
            "m=2,a=12,t=1.",
            "Fuera; no legitimar1 mediante el techo.",
            "Adenda;86.2",
        ),
        (
            "minimo-desconocido",
            "Contrato laboral sin calificar.",
            "Fuera hasta calificación, no asumir0.",
            "Adenda",
        ),
        (
            "cuantia-anterior",
            "Obligación judicial ya existía; varía solo A de3000 a6000.",
            "Fuera: no es nueva obligación admitida por esta adenda.",
            "Adenda;no decisión jurídica universal",
        ),
        (
            "beneficiario-mismo",
            "Mínimo y anualidad para el mismo hijo.",
            "Fuera por exclusión histórica pendiente; no afirmar que85.2 antiguo lo prohibía.",
            "Adenda;85.2 de2007",
        ),
        (
            "beneficiario-otro",
            "Mínimo por hijoB, nueva anualidad judicial por hijoA; mínimo contractual intacto.",
            "No excluido por identidadB; exige derechos de ambos y demás hechos.",
            "Contrato original paso6;Adenda",
        ),
        (
            "beneficiario-conyuge",
            "Compensatoria judicial al cónyuge, causaPDF3.",
            "No activa alternativa de hijos; calificar primera alternativa por exclusividad.",
            "87.5;83.3.e",
        ),
        (
            "voluntaria",
            "Transferencias voluntarias a hijos sin resolución.",
            "Fuera de alternativa judicial.",
            "85.2;87.5",
        ),
        (
            "sin-resolucion",
            "Flag CAUSA4 sin resolución ni fecha.",
            "Fuera; el flag no prueba la obligación.",
            "Adenda",
        ),
        (
            "sin-comunicacion",
            "Resolución conocida por trabajador pero no comunicada al pagador.",
            "Sin eficacia presupuesta; no obtener tipo utilizable.",
            "88.2/4;Adenda",
        ),
        (
            "sin-eficacia",
            "Comunicación sin fecha de confección ni política trimestral.",
            "Fuera hasta fijar eficacia, no usar fecha bancaria.",
            "87.4;Adenda",
        ),
        (
            "trimestral",
            "Pagador opta por1abril/julio/octubre para variaciones del trimestre previo.",
            "Exigir política documentada; no añadir enero por analogía.",
            "87.4 histórico",
        ),
        (
            "adjunto-2014",
            "Resolución real y comunicación2014; no se adjunta testimonio literal.",
            "No imponer universalmente adjunto previo; conservar resolución y versión de88/85.",
            "RD960/2013 y modelo145;antecedenteSOL05",
        ),
        (
            "delta-positivo",
            "Hipótesis a12,t18,diferencia10000→11000, evento único supuesto.",
            "Techo12 condicionado; no demuestra nómina factible ni independencia empírica de entradas.",
            "RD1788/2010p4",
        ),
        (
            "delta-cero",
            "Diferencia sin cambio y nueva obligación judicial calificada.",
            "Segunda alternativa no depende del signo; la primera no queda probada por0.",
            "87.5 histórico",
        ),
        (
            "delta-negativo-mixto",
            "Variaciones+1000 y−2000 producen delta−1000.",
            "No demuestra exclusividad de primera alternativa; mezcla alimentaria fuera.",
            "87.5;Adenda",
        ),
        (
            "causaPDF4",
            "Entero4 sin hechos jurídicos.",
            "No equiparar al ordinal4 legal ni activar por flag.",
            "87.2.8 original;secuencia histórica, no ordinal2015",
        ),
        (
            "previo-voluntario",
            "Tipo anterior12 por solicitud escrita superior.",
            "Fuera; no reinterpretar como tipo ordinario previo.",
            "88.5;Adenda",
        ),
        (
            "estado-no-conciliado",
            "Retenido y pendiente no concuerdan con percibido.",
            "Fuera hasta conciliar; el intérprete numérico no lo detecta.",
            "Adenda;87.3",
        ),
    ]
    for c in [1, 2, 3, 5, 6, 7, 8, 9, 10, 11]:
        cases.append(
            (
                f"concurrencia-4-{c}",
                f"Nueva obligación judicial más CAUSA{c}, declaradas conciliadas.",
                "Todas fuera por adenda;4+11 además incompatible documentalmente. No obtener salida omitiendo guarda.",
                "Adenda prevalece sobre concurrencias.json y ramas",
            )
        )
    write(
        "casos-juridicos.json",
        [
            {
                "id": key,
                "facts": facts,
                "decision": decision,
                "source": source,
                "kind": "dictamen humano; no ejecución de admisión",
                "objecion": "Una expectativa manual no prueba que un programa admita o rechace el caso.",
                "respuesta": "Se materializa la lectura del contrato, sin atribuirla al intérprete R22 ni al motor.",
                "coste": "Falta implementar y revisar la admisión antes de reutilizar esta receta.",
                "completeRuleAcceptance": False,
            }
            for key, facts, decision, source in cases
        ],
    )
    composed = json.loads((OUT / "superposicion.json").read_text())["effective"]
    for name, output in [
        ("matriz-80.json", "dictamen-80.json"),
        ("ramas-44.json", "dictamen-44.json"),
    ]:
        result = []
        for row in composed[name]:
            kind = row["id"].split(":")[-1]
            scope = {
                "minimos": "Rectificación visual corroborada; SOL03 restante parcial.",
                "regularizacion": "Adenda prevalente; sin regularizador íntegro ni rojos fiscales nuevos.",
                "CAUSA4": "Techo corroborado con hechos externos y dominio excluyente.",
            }.get(
                kind,
                "Conservado como antecedente no rectificado; no renovación de aceptación.",
            )
            result.append(
                {
                    "id": row["id"],
                    "dictamen": scope,
                    "effectiveRow": row,
                    "objecion": "La composición por ID no demuestra corrección fiscal de una fila histórica.",
                    "respuesta": "Se conserva su reserva y solo se revisan C01/C02 y compatibilidad contractual.",
                    "coste": "Revisión sustantiva posterior para ampliación o habilitación.",
                    "completeRuleAcceptance": False,
                }
            )
        write(output, result)
    config = json.loads((ROOT / ".oxlintrc.json").read_text())
    rules = {
        k: v
        for k, v in config["rules"].items()
        if k.startswith(("anti-slop/", "anti-slop-effect/"))
    }
    assert len(rules) == 16 and set(rules.values()) == {"error"}
    write("anti-slop.json", rules)
    print(
        "Decisiones propias de frontera y contrato; dictamen por80/44IDs;16reglas aerror. No es prueba del motor."
    )


if __name__ == "__main__":
    main()
