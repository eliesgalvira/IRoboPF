"""Adversos del contrato nuevo; no son una revisión fiscal independiente."""

import copy
import json
from pathlib import Path
import unittest
import tempfile
import shutil
import importlib
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools/procedencia"))
enlaces = importlib.import_module("enlaces")
verify_nominal = importlib.import_module("nominal").verify_nominal
CasResolver = importlib.import_module("cas").CasResolver

OUT = ROOT / "docs/procedencia/implementaciones/contrato-nominal-r29-sol"


class Nominal(unittest.TestCase):
    def setUp(self):
        self.payload = json.loads((OUT / "payload.json").read_bytes())
        self.scope = json.loads((OUT / "ambito.json").read_bytes())
        self.reader = enlaces.DocumentaryReadSet(ROOT)
        self.item = {"id": "inv-c24095c17f76bb198b34cf8b8d5a45ed", "value": "53407.2"}

    def run_scope(self, payload=None, scope=None):
        outer = self

        class Reader:
            def read_ref(self, ref):
                if ref == outer.payload["executableScope"] and scope is not None:
                    return scope
                return outer.reader.read_ref(ref)

            def read_bytes(self, path):
                return outer.reader.read_bytes(path)

        return verify_nominal(Reader(), payload or self.payload, self.item)

    def test_exact(self):
        scope = self.run_scope()
        self.assertEqual(scope["source"]["tablePath"], ["madrid", "tramos", "3", "0"])
        self.assertEqual(scope["year"], 2020)
        self.assertEqual(scope["value"], "53407.2")
        self.assertIn("53.407,29", scope["editorialConditions"][2])
        self.assertFalse(scope["completeRuleAcceptance"])
        self.reader.finish()

    def test_independent_discriminants(self):
        mutations = [
            (
                "source",
                {
                    "file": self.scope["source"]["file"],
                    "sha256": self.scope["source"]["sha256"],
                    "symbol": self.scope["source"]["symbol"],
                    "tablePath": ["madrid", "tramos"],
                },
            ),
            ("year", 2022),
            ("territory", "murcia"),
            ("component", "estatal"),
            ("taxBase", "ahorro"),
            ("value", "53407.29"),
            ("unit", "percent"),
            ("exclusions", []),
            ("editorialConditions", []),
            ("meaning", "cuota"),
            ("period", "ordinary-no-death"),
            ("completeRuleAcceptance", True),
        ]
        for key, value in mutations:
            with self.subTest(key=key):
                scope = copy.deepcopy(self.scope)
                scope[key] = value
                payload = copy.deepcopy(self.payload)
                if key in payload["scope"]:
                    payload["scope"][key] = value
                if key == "source":
                    payload[key] = value
                with self.assertRaises(ValueError):
                    self.run_scope(payload, scope)
        scope = copy.deepcopy(self.scope)
        scope["source"]["tablePath"][-1] = "1"
        with self.assertRaises(ValueError):
            self.run_scope(scope=scope)

    def test_envelope_does_not_create_authority(self):
        for key, value in [
            ("status", "accepted"),
            ("attestation", {"sha256": "a" * 64}),
        ]:
            bad = copy.deepcopy(self.scope)
            bad[key] = value
            with self.assertRaises(ValueError):
                self.run_scope(scope=bad)
        decision = self.reader.read_ref(self.payload["legalReview"]["decisions"])[0]
        for author in [
            decision["independentReviewerTaskId"],
            decision["projectionAuthorTaskId"],
        ]:
            with self.assertRaises(ValueError):
                self.run_scope({**self.payload, "authorTaskId": author})
        bad = copy.deepcopy(self.payload)
        bad["legalReview"]["decisions"]["sha256"] = "a" * 64
        with self.assertRaises(ValueError):
            self.run_scope(bad)
        bad = copy.deepcopy(self.payload)
        bad["document"] = bad["citation"]
        with self.assertRaises(ValueError):
            self.run_scope(bad)

    def test_no_civil_context(self):
        for year in [2019, 2020, 2021, 2022]:
            for death in [None, f"{year}-06-20"]:
                context = {
                    "year": year,
                    "territory": "madrid",
                    "component": "autonomico",
                    "taxBase": "general",
                    "periodStart": f"{year}-01-01",
                    "accrual": death or f"{year}-12-31",
                    "death": death,
                    "externalConditions": [
                        "residence-unverified",
                        "eligibility-unverified",
                    ],
                }
                with self.assertRaises(ValueError):
                    enlaces.evaluate_scope(self.scope, context)

    def test_changes_after_first_documentary_read(self):
        dependencies = json.loads(
            (ROOT / "schemas/procedencia/nominal-dependencies.schema.json").read_bytes()
        )["const"]
        for ref in dependencies["documents"]:
            with (
                self.subTest(path=ref["path"]),
                tempfile.TemporaryDirectory(dir=ROOT / ".cache/nominal-r29") as tmp,
            ):
                target = Path(tmp) / ref["path"]
                target.parent.mkdir(parents=True)
                shutil.copyfile(ROOT / ref["path"], target)
                reader = enlaces.DocumentaryReadSet(Path(tmp))
                reader.read_bytes(ref["path"])
                target.write_bytes(target.read_bytes() + b" ")
                with self.assertRaisesRegex(ValueError, "cambió durante"):
                    reader.finish()

    def test_changes_after_first_cas_read(self):
        with tempfile.TemporaryDirectory(dir=ROOT / ".cache/nominal-r29") as tmp:
            root = Path(tmp)
            (root / "sha256").mkdir()
            raw = "original sintético de prueba, no fuente fiscal".encode()
            digest = enlaces.sha(raw)
            path = root / "sha256" / digest
            path.write_bytes(raw)
            resolver = CasResolver([root])
            resolver.resolve(digest)
            path.write_bytes(b"cambiado")
            with self.assertRaisesRegex(ValueError, "cambió durante"):
                resolver.finish()

    def test_r25_still_rejected(self):
        old = json.loads(
            (
                ROOT
                / "docs/procedencia/implementaciones/madrid-v2-r25-sol/payload-v2.json"
            ).read_bytes()
        )
        with self.assertRaisesRegex(ValueError, "Condiciones editoriales"):
            enlaces.verify_executable_scope(self.reader, old, self.item)


if __name__ == "__main__":
    unittest.main()
