"""Schema cerrado para el contrato candidato, sin confundir cierre con aceptación."""

import gzip
import json
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent


def obj(
    properties: dict[str, Any], required: list[str] | None = None
) -> dict[str, Any]:
    return {
        "type": "object",
        "properties": properties,
        "required": list(properties) if required is None else required,
        "additionalProperties": False,
    }


def array(items: dict[str, Any]) -> dict[str, Any]:
    return {"type": "array", "items": items}


def main() -> None:
    string = {"type": "string", "minLength": 1}
    hash_schema = {"type": "string", "pattern": "^[0-9a-f]{64}$"}
    ref = obj({"id": string, "revision": hash_schema})
    source = obj(
        {
            "file": string,
            "sha256": hash_schema,
            "start": {"type": "integer", "minimum": 0},
            "end": {"type": "integer", "minimum": 1},
            "offsetEncoding": {"const": "utf16"},
        }
    )
    edge = obj(
        {
            "symbol": string,
            "chain": {"type": "array", "minItems": 1, "items": string},
            "reason": string,
            "conditions": obj(
                {"temporal": string, "territorial": string, "contract": string}
            ),
        }
    )
    flow_path = OUT / "flujo.json"
    if flow_path.exists():
        sample = json.loads(flow_path.read_text())
    else:
        with gzip.open(str(flow_path) + ".gz", "rt") as stream:
            sample = json.load(stream)
    versions = obj({k: hash_schema for k in sample["sites"][0]["snapshot"]})
    sections = obj(
        {
            k: obj(
                {
                    "text": string,
                    "state": {"const": "candidate"},
                    "wiringBlocker": string,
                }
            )
            for k in ["formula", "derivacion", "norma", "evidencia", "bordes"]
        }
    )
    site = obj(
        {
            "siteId": string,
            "subject": ref,
            "snapshot": versions,
            "source": source,
            "expression": string,
            "historicalSelectorPreserved": ref,
            "valueDependencies": obj(
                {"direct": array(edge), "transitive": array(edge)}
            ),
            "controlDependencies": array(edge),
            "excludedCoLocations": array(
                obj({"symbol": string, "source": source, "reason": string})
            ),
            "sections": sections,
            "completeness": obj(
                {
                    "technical": {
                        "enum": ["partial-explicit-omissions", "closed-technical-scope"]
                    },
                    "legalAcceptance": {"const": False},
                    "independentReview": {"const": "pending"},
                    "omissions": array(string),
                }
            ),
        }
    )
    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        **obj(
            {
                "version": {"const": 1},
                "base": {"const": sample["base"]},
                "inventory": obj(
                    {"manifestSha256": hash_schema, "artifactSha256": hash_schema}
                ),
                "sites": {
                    "type": "array",
                    "minItems": 28,
                    "maxItems": 28,
                    "items": site,
                },
            }
        ),
    }
    (OUT / "flujo.schema.json").write_text(
        json.dumps(schema, ensure_ascii=False, indent=2) + "\n"
    )


if __name__ == "__main__":
    main()
