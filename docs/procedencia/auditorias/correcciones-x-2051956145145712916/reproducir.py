import json
import hashlib
import pathlib
from decimal import Decimal as D, ROUND_HALF_UP
import pymupdf

root = pathlib.Path.cwd()
out = root / "docs/procedencia/auditorias/correcciones-x-2051956145145712916"
cas = pathlib.Path("/home/elies/Repos/IRoboPF/.cache/procedencia/sha256")
rows = []
for h, pages, url in [
    (
        "918a1c126ddf1427506c151390f2326d7eaeaaeae174b1463ed1e87bf03c11d6",
        [2, 3, 16, 17],
        "https://www.boe.es/boe/dias/2025/02/26/pdfs/BOE-A-2025-3780.pdf",
    ),
    (
        "0236d8d1047209852e31cca4e7902d8ba0f3004cd49da5b1080847cf78eb3886",
        [23, 24],
        "https://www.boe.es/boe/dias/2024/06/27/pdfs/BOE-A-2024-12944.pdf",
    ),
]:
    b = (cas / h).read_bytes()
    assert hashlib.sha256(b).hexdigest() == h
    with pymupdf.open(cas / h) as pdf:
        for n in pages:
            p = pdf[n - 1]
            png = p.get_pixmap(dpi=110, alpha=False).tobytes("png")
            ph = hashlib.sha256(png).hexdigest()
            dest = out / "facsímiles" / f"{ph}.png"
            dest.parent.mkdir(exist_ok=True)
            dest.write_bytes(png)
            rows.append(
                {
                    "documentSha256": h,
                    "documentSha512": hashlib.sha512(b).hexdigest(),
                    "url": url,
                    "page": n,
                    "bbox": list(p.rect),
                    "quote": p.get_text(),
                    "facsimile": str(dest.relative_to(root)),
                    "facsimileSha256": ph,
                    "dpi": 110,
                    "renderer": pymupdf.VersionBind,
                    "authenticity": "no validada criptográficamente",
                    "acceptance": False,
                }
            )
(out / "citas-candidatas.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
)


def q(x):
    return x.quantize(D(".01"), rounding=ROUND_HALF_UP)


bases = list(map(D, ["5891.40", "23565.60", "44129.00"]))
r = {}
for name, ts in [
    ("empresa", [".0077", ".0083", ".0098"]),
    ("trabajador", [".0015", ".0017", ".0019"]),
]:
    annual = [b * D(t) for b, t in zip(bases, ts)]
    monthly = [q(b / 12 * D(t)) * 12 for b, t in zip(bases, ts)]
    r[name] = {
        "sinRedondeo": [str(x) for x in annual],
        "sumaSinRedondeo": str(sum(annual)),
        "hipotesisRedondeoMensualPorTramo": [str(x) for x in monthly],
        "sumaHipotesis": str(sum(monthly)),
    }
r["cuotaImagen"] = {
    "exceso": "66548.01",
    "producto45": str(D("66548.01") * D(".45")),
    "totalUnico": str(q(D("17901.50") + D("66548.01") * D(".45"))),
    "dosMitades": str(2 * q(D("8950.75") + D("66548.01") * D(".225"))),
}
(out / "pruebas/decimal.json").write_text(json.dumps(r, indent=2) + "\n")
print(json.dumps(r))

# Comprobación aritmética de la tabla pública, sin atribuir año/territorio.
family = []
for bruto, limite, retencion, liquida, diferencial in [
    ("17000", "0", "0", "0", "0"),
    ("18000", "0", "0", "0", "0"),
    ("19000", "0", "0", "0", "0"),
    ("20000", "317.34", "316", "278.24", "-37.76"),
    ("21000", "747.34", "745.50", "741.72", "-3.78"),
    ("22000", "1177.34", "1177", "995.86", "-181.14"),
    ("24000", "2037.34", "2035.20", "1444.76", "-590.44"),
    ("26000", "2897.34", "2834", "1893.64", "-940.36"),
    ("28000", "3757.34", "3396.40", "2377.68", "-1018.72"),
    ("30000", "4617.34", "3957", "2938.80", "-1018.20"),
]:
    assert max(D(0), (D(bruto) - D(19262)) * D(".43")) == D(limite)
    assert D(liquida) - D(retencion) == D(diferencial)
    family.append(
        {
            "bruto": bruto,
            "limiteAritmetico": limite,
            "diferencialAritmetico": diferencial,
        }
    )
comparison = {
    "brutoComparable": str(D("22038.99") * D("1.03")),
    "neto2025": str(D("21229.19") - D("2729.59")),
    "neto2026": str(D("21224.65") - D("2934.39")),
    "diferenciaNeto": str(D("18499.60") - D("18290.26")),
    "diferenciaMensual": str(q((D("18499.60") - D("18290.26")) / 12)),
    "diferenciaCuota": str(D("2934.39") - D("2729.59")),
}
(out / "pruebas/aritmetica-tablas.json").write_text(
    json.dumps(
        {"family": family, "comparison": comparison, "fiscalAcceptance": False},
        indent=2,
    )
    + "\n"
)
print(
    "Diez diferenciales y límites aritméticos comprobados; no validan la cuota ni sus requisitos."
)
