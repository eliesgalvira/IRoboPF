"""Expectativas protectoras nuevas; conservar fallos sin cambiar producto."""

import copy
import unittest
from unittest.mock import patch
from revisar import fixture, r


class Nuevos(unittest.TestCase):
    def test_ruta_con_salto_final_no_debe_publicarse(self):
        c = fixture()
        self.addCleanup(c.doCleanups)
        (c.work / "payload\n").write_bytes((c.work / "payload").read_bytes())
        c.m["annex"][0]["sources"] = ["checkout:payload\n"]
        c.store()
        with patch.object(r, "ROOT", c.work):
            with self.assertRaises(ValueError):
                r.transfer(c.dest)

    def test_rechazar_duplicados_en_listas_del_sobre(self):
        c = fixture()
        self.addCleanup(c.doCleanups)
        original = copy.deepcopy(c.m)
        for field in ("acquisitions", "sources", "references"):
            with self.subTest(field=field):
                c.m = copy.deepcopy(original)
                obj = c.m["annex"][0]
                if not obj[field]:
                    obj[field] = ["adquisicion.json"]
                obj[field].append(copy.deepcopy(obj[field][0]))
                c.store()
                with self.assertRaises(ValueError):
                    r.load()

    def test_rechazar_control_final_en_ruta(self):
        c = fixture()
        self.addCleanup(c.doCleanups)
        for field in ("sources", "references"):
            with self.subTest(field=field):
                c.m["annex"][0][field] = [
                    "checkout:payload\n" if field == "sources" else "doc.json\n"
                ]
                c.store()
                with self.assertRaises(ValueError):
                    r.load()


if __name__ == "__main__":
    unittest.main(verbosity=2)
