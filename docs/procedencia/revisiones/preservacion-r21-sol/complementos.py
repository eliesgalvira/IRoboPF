"""Contrastes adicionales de cierre de niveles y privacidad de diagnóstico."""

import copy
import json
from revisar import OUT, fixture, r

c = fixture()
rows = []
cases: list[tuple[str, dict[str, object]]] = [
    ("unresolvedReferences", {"sha256": "f" * 64, "sources": ["doc.json"]}),
    ("exclusions", {"path": "doc.json", "reason": "URL-no-admitida"}),
]
try:
    original = copy.deepcopy(c.m)
    for field, value in cases:
        for key in value:
            c.m = copy.deepcopy(original)
            obj = copy.deepcopy(value)
            del obj[key]
            c.m[field] = [obj]
            c.store()
            try:
                r.load()
                rejected = False
            except ValueError:
                rejected = True
            rows.append(dict(field=field, missing=key, rejected=rejected))
            assert rejected
    c.m = copy.deepcopy(original)
    c.m["annex"][0]["acquisitions"][0]["canonicalUrl"] = (
        "https://www.seg-social.es:PRIVATE_SENTINEL/descarga/es/123"
    )
    c.store()
    leaked = False
    try:
        r.load()
        rows.append(dict(case="private-port", rejected=False))
    except ValueError as error:
        leaked = "PRIVATE_SENTINEL" in str(error)
        rows.append(
            dict(
                case="private-port",
                rejected=True,
                sentinelLeaked=leaked,
                error=str(error),
            )
        )
    (OUT / "complementos.json").write_text(json.dumps(rows, indent=2) + "\n")
    assert not leaked, "El diagnóstico expone PRIVATE_SENTINEL del puerto recibido"
finally:
    c.doCleanups()
