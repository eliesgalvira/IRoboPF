"""Identidades de pasajes inspeccionados y concepto, sin adquisición nueva."""

from __future__ import annotations
import gzip
import hashlib
import json
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent
ED = Path("docs/procedencia/correcciones/editorial-r21")


def sha(p: str | Path) -> str:
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p: str | Path) -> Any:
    path = Path(p)
    if not path.exists():
        with gzip.open(str(path) + ".gz", "rt") as stream:
            return json.load(stream)
    return json.loads(path.read_text())


def main() -> None:
    rows = []
    for name in [
        "madrid-tabla-ley13-2023",
        "madrid-minimo-ley13-2023",
        "madrid-efectos-ley13-2023",
    ]:
        path = ED / "citas" / (name + ".json")
        citation = read(path)
        original = citation["original"]
        png = citation["facsimil"]
        assert sha(original["path"]) == original["sha256"]
        assert (
            hashlib.sha512(Path(original["path"]).read_bytes()).hexdigest()
            == original["sha512"]
        )
        assert sha(png["path"]) == png["sha256"]
        rows.append(
            {
                "citation": str(path),
                "sha256": sha(path),
                "document": original,
                "facsimile": png,
                "personallyInspected": True,
                "selector": citation["selector"],
                "acceptance": False,
            }
        )
    for legacy_path in [
        "docs/procedencia/editorial/escalas-minimos/citas/ley2025-p37.json",
        "docs/procedencia/evidencias/estatales/citas/min-2012-2014-contribuyente-general.json",
    ]:
        c = read(legacy_path)
        fac = c["facsimile"]
        png = fac.get(
            "path",
            "docs/procedencia/evidencias/estatales/recortes/" + fac["sha256"] + ".png",
        )
        assert sha(png) == fac["sha256"]
        rows.append(
            {
                "citation": legacy_path,
                "sha256": sha(legacy_path),
                "documentSha256": c["documentSha256"],
                "page": c["page"],
                "facsimile": {"path": png, "sha256": sha(png)},
                "personallyInspected": True,
                "acceptance": False,
            }
        )
    concept = read(ED / "escalas-conceptos.json")[0]
    occurrence = concept["ocurrencia"]
    assert sha(occurrence["source"]["file"]) == occurrence["source"]["sha256"]
    concept_result = {
        "version": 1,
        "base": "960773f909d4ecff290edfa3d7a7b2699a8445d3",
        "historicalConcept": concept,
        "analysis": {
            "valueRole": "Límite EUR renta, no cuota; alimenta anchura/selección en representación integrada2020, no cuotas fijas2025.",
            "consumerSymbols": [
                "obtenerEscalaAutonomicaIrpf2020",
                "resolverParametrosComunidadAutonoma2020",
                "obtenerParametrosComunidadAutonoma",
                "calcularDesgloseCuotaPorEscala",
            ],
            "consumerSiteIds": [
                "anual.cuota.general-autonomica-tramo",
                "anual.cuota.minimo-autonomico-tramo",
            ],
            "downstream": [
                "anual.cuota.general-total",
                "anual.cuota.minimo-general-total",
                "anual.cuota.liquida",
                "anual.cuota.diferencial",
            ],
            "excluded": [
                "anual.explicito.cuota.autonomica",
                "anual.cuota.general-estatal-tramo",
                "anual.cuota.ahorro-tramo",
            ],
            "condition": "Madrid,ejercicio2020; representación integrada, no asumirFpublicada. Tabla publicada ejemplo7395.8289 no es expected universal del helper integrado.",
            "completeness": "partial: falta descomposición de cada expresión del selector2020 hacia consumidor; no autoriza wiring.",
            "legalAcceptance": False,
        },
    }
    ast = read(OUT / "ast.json")
    concept_result["consumerSources"] = []
    names = set(concept_result["analysis"]["consumerSymbols"])
    for module in ast:
        for declaration in module["declarations"]:
            if declaration["symbol"] in names:
                concept_result["consumerSources"].append(
                    {
                        "symbol": declaration["symbol"],
                        "source": {
                            "file": module["file"],
                            "sha256": module["sha256"],
                            "start": declaration["start"],
                            "end": declaration["end"],
                            "offsetEncoding": "utf16",
                        },
                        "expression": declaration["text"],
                    }
                )
    (OUT / "concepto-madrid.json").write_text(
        json.dumps(concept_result, ensure_ascii=False, indent=2) + "\n"
    )
    (OUT / "inspeccion-propia.json").write_text(
        json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
    )
    print(
        "5 recortes personalmente inspeccionados, identidades verificadas; concepto candidato, sin aceptación"
    )


if __name__ == "__main__":
    main()
