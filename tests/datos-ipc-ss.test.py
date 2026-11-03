"""Pruebas ordinarias sintéticas: sin CAS, Git ni cachés privadas."""

import importlib.util
import pathlib
import unittest

MODULE = (
    pathlib.Path(__file__).resolve().parents[1]
    / "tools/procedencia/datos/lotes/ipc-ss/lote.py"
)
spec = importlib.util.spec_from_file_location("ipc_ss", MODULE)
lote = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lote)


class ExtractionTests(unittest.TestCase):
    def obligation(self):
        return {
            "id": "ipc-2024",
            "group": "Índice general",
            "measure": "Variación anual",
            "period": "2024M12",
            "unit": "percent",
            "scale": 100,
            "binding": {
                "file": "lib/dominio/normativa/datos/ipc-2012-2026.ts",
                "symbol": "IPC_ANUAL_DICIEMBRE",
                "path": ["2024"],
            },
        }

    def raw(self, value="-0,5", period="2024M12"):
        return (
            "Grupos ECOICOP;Tipo de dato;Periodo;Total\nÍndice general;Variación anual;"
            + period
            + ";"
            + value
            + "\n"
        ).encode()

    def test_sign_and_percent(self):
        self.assertEqual(
            lote.select_ipc(self.raw(), self.obligation())["normalized"], "-0.5"
        )
        self.assertEqual(lote.flujo.number("-0,5", "percent"), "-0.5")
        # Un signo separado requiere posiciones PDF, no limpiar espacios en CSV.
        with self.assertRaises(ValueError):
            lote.flujo.number("- 0,5", "percent")
        self.assertEqual(lote.flujo.physical_number(
            "- 0,5", {"unit": "percent", "bbox": [0, 0, 50, 20]},
            [(5, 5, 10, 15, "-"), (15, 5, 30, 15, "0,5")]), "-0.5")

    def test_omission_duplicate(self):
        for cells in ([], [{"id": "a"}, {"id": "a"}], [{"id": "b"}]):
            with self.assertRaises(ValueError):
                lote.exact_coverage([{"id": "a"}], cells)

    def test_unit_scale_measure_month(self):
        for key, value in [
            ("unit", "index"),
            ("scale", 1),
            ("measure", "Índice"),
            ("period", "2024M11"),
        ]:
            with self.assertRaises(ValueError):
                lote.select_ipc(self.raw(), {**self.obligation(), key: value})

    def test_wrong_year_absence_and_ambiguous_sign(self):
        for raw in [
            self.raw(period="2023M12"),
            self.raw("−0,5"),
            self.raw(""),
            self.raw("0.5"),
        ]:
            with self.assertRaises(ValueError):
                lote.select_ipc(raw, self.obligation())

    def test_worker_employer_scope(self):
        expected = dict(
            party="worker", unit="percent", scale=100, period="2025M01", concept="MEI"
        )
        lote.validate_party(expected, expected)
        for key, value in [
            ("party", "employer"),
            ("unit", "proportion"),
            ("scale", 1),
            ("period", "2026M01"),
            ("concept", "solidarity"),
        ]:
            with self.assertRaises(ValueError):
                lote.validate_party({**expected, key: value}, expected)

    def test_incorrect_binding(self):
        obligation = self.obligation()
        obligation["binding"]["path"] = ["2023"]
        with self.assertRaises(ValueError):
            lote.bind_ipc([], obligation)

    def test_actual_engine_percent_conversion(self):
        item = dict(
            layer="effective",
            source={"file": self.obligation()["binding"]["file"]},
            symbol="IPC_ANUAL_DICIEMBRE",
            path='["2024"]',
            value="-0.005",
        )
        self.assertEqual(
            lote.bind_ipc([item], self.obligation()), lote.Decimal("-0.500")
        )


if __name__ == "__main__":
    unittest.main()
