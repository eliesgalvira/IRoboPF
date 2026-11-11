"""Stdlib independiente: sin imports fiscales ni de artefactos del autor.
Ejecutar con timeout desde cualquier directorio; escribe sólo en su entrega.
P1 es la reserva interpretativa conservada, no una consulta vinculante.
"""
from fractions import Fraction as F
from pathlib import Path
import json


def exacto(x):
    return {"numeradorEuros": str(x.numerator), "divisor": str(x.denominator)}


def vector(id, propios, ajenos, ayudas_propias=("0", "0"), ayudas_ajenas=("0", "0"), derecho_ajeno=True, capi=False, empresa="0"):
    propios, ajenos = list(propios), list(ajenos)
    ayudas_propias, ayudas_ajenas = list(ayudas_propias), list(ayudas_ajenas)
    assert all(F(p) >= F(a) >= 0 for ps, aa in ((propios, ayudas_propias), (ajenos, ayudas_ajenas)) for p, a in zip(ps, aa))
    gasto_propio = sum(map(F, propios)) - sum(map(F, ayudas_propias))
    divisor = int(any(F(p) > 0 for p in propios)) + int(derecho_ajeno and any(F(p) > 0 for p in ajenos))
    regional = min(gasto_propio / 5, F(1000, divisor)) if gasto_propio else F(0)
    neto_anual = gasto_propio + sum(map(F, ajenos)) - sum(map(F, ayudas_ajenas))
    meses = sum(F(p) + F(a) > 0 and not (capi and i == 0) for i, (p, a) in enumerate(zip(propios, ajenos)))
    incremento = min(F(1000 * meses, 12), neto_anual)
    return dict(id=id, propios=propios, ajenos=ajenos, ayudasPropias=ayudas_propias, ayudasAjenas=ayudas_ajenas,
                derechoAjeno=derecho_ajeno, capi=capi, empresa=empresa, regional=exacto(regional),
                incremento=exacto(incremento), maternidad=exacto(F(1100 if capi else 1200)),
                delta=exacto(-incremento-F(1100 if capi else 1200)))


def main():
    vs = [
        vector("P1_dos_facturas", ("2600", "2400"), ("400", "600"), ayudas_ajenas=("400", "600")),
        vector("tope_menos_centimo", ("1200", "1299.99"), ("1", "1")),
        vector("tope_exacto", ("1200", "1300"), ("1", "1")),
        vector("tope_mas_centimo", ("1200", "1300.01"), ("1", "1")),
        vector("neto_dos_centimos", ("0.01", "0"), ("0.01", "0")),
        vector("ayudas_agotan", ("100", "200"), ("100", "200"), ("100", "200"), ("100", "200")),
        vector("minimo_ajeno_sin_region", ("2600", "2400"), ("1", "1"), derecho_ajeno=False),
        vector("CAPI_solo_enero", ("2600", "2400"), ("400", "600"), ayudas_ajenas=("400", "600"), capi=True),
        vector("empresa_no_transfiere", ("10", "20"), ("10", "20"), empresa="5000"),
        vector("ayudas_dos_facturas", ("1000", "1000"), ("100", "100"), ("100", "200")),
    ]
    assert vs[0]["regional"] == exacto(F(500))
    assert vs[1]["regional"] == exacto(F(249999, 500))
    assert vs[4]["incremento"] == exacto(F(1, 50))
    out = Path(__file__).resolve().parents[1] / "fixtures/revision-murcia81-independiente.json"
    out.write_text(json.dumps(vs, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"vectores": len(vs), "P1": vs[0]["regional"], "destino": str(out)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
