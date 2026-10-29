"""Regresiones del contrato reutilizado y adversos del censo nuevo."""

import importlib.util
import ast
from types import SimpleNamespace
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
import consumidor as c
import recolector as r


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


class CensusTests(unittest.TestCase):
    def test_scalar_document(self):
        obs = list(r.observations({"documentSha256": "a" * 64}, "datos.json"))
        self.assertEqual(obs[0]["kind"], "desconocido-documental")

    def test_array_document_references(self):
        obs = list(r.observations({"documentHashes": ["a" * 64]}, "datos.json"))
        self.assertEqual(len(obs), 1)

    def test_not_every_hex_string(self):
        self.assertEqual(list(r.observations({"texto": "a" * 64}, "datos.json")), [])

    def test_official_and_archive(self):
        for url, kind in [
            (
                "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764",
                "original-oficial",
            ),
            (
                "https://web.archive.org/web/20150101000000id_/http://www.agenciatributaria.es/static_files/AEAT/algoritmo.pdf",
                "captura-secundaria-URL-oficial",
            ),
        ]:
            obs = list(r.observations({"sha256": "a" * 64, "url": url}, "fuentes.json"))
            self.assertEqual(obs[0]["kind"], kind)


def main():
    # Inyectar consumidor v5 en los mismos casos, sin cambiar los esperados.
    sys.modules["edicion"] = c
    old = module(
        "v4_adversos", c.ROOT / "docs/procedencia/preservacion-v4-sol/adversos.py"
    )
    setup = old.EditionTests.setUp

    def new_setup(self):
        setup(self)
        self.m.update(
            format="irobopf-preservacion-local-v5",
            edition=5,
            software={
                "docs/procedencia/preservacion-v5-sol/consumidor.py": c.p.fingerprint(
                    Path(c.__file__)
                )
            },
            cut="R26; excluye entrega v5 y posteriores; R25 no recibido; aceptación ninguna",
        )
        self.store()

    suite = unittest.TestSuite()
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(CensusTests))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(old.EditionTests))
    for filename, classname, prefix in [
        (
            "docs/procedencia/correcciones/preservacion-v4-r26/controles.py",
            "Adicionales",
            "test_r26_",
        ),
        (
            "docs/procedencia/revisiones/preservacion-v4-r24-sol/rojos.py",
            "Rojos",
            "test_r24_",
        ),
    ]:
        tree = ast.parse((c.ROOT / filename).read_text())
        selected = ast.Module(
            body=[node for node in tree.body if isinstance(node, ast.ClassDef)],
            type_ignores=[],
        )
        scope = {
            "EditionTests": old.EditionTests,
            "e": c,
            "inherited": SimpleNamespace(e=c),
            "unittest": unittest,
        }
        exec(compile(selected, filename, "exec"), scope)
        case = scope[classname]
        suite.addTests(
            case(name)
            for name in unittest.defaultTestLoader.getTestCaseNames(case)
            if name.startswith(prefix)
        )
    with patch.object(old.EditionTests, "setUp", new_setup):
        result = unittest.TextTestRunner(verbosity=2).run(suite)
    if not result.wasSuccessful():
        raise SystemExit(1)


if __name__ == "__main__":
    main()
