"""Reejecuta las sondas recibidas sin modificar sus esperados ni informes."""

import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "docs/procedencia/preservacion-v5-sol"))
spec = importlib.util.spec_from_file_location(
    "collector_current", ROOT / "docs/procedencia/preservacion-v5-sol/recolector.py"
)
assert spec is not None and spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
rows = json.loads(
    (
        ROOT / "docs/procedencia/revisiones/clasificacion-censo-r30-sol/casos.json"
    ).read_bytes()
)["cases"]
results = []
for row in rows:
    actual = module.classify(row["name"], row["pointer"], row["row"], row["key"])[0]
    results.append(
        {
            "id": row["id"],
            "actual": actual,
            "expected": row["expected"],
            "pass": actual in row["expected"],
        }
    )
failed = [x["id"] for x in results if not x["pass"]]
print(
    json.dumps(
        {
            "cases": results,
            "failed": failed,
            "policy": module.POLICY,
            "completeRuleAcceptance": False,
        },
        ensure_ascii=False,
        indent=2,
    )
)
raise SystemExit(1 if failed else 0)
