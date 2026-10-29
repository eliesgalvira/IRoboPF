import json
import hashlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd() / "tools/procedencia"))
import corpus

out = Path(
    "/home/elies/Repos/IRoboPF/docs/procedencia/revisiones/evidencias-autonomicas-v2"
)
selected = {
    "09f01627f64790629169c728da9292d81e46a99392641597d1cc93b1b1799154": [4],
    "0ed3161792ae3a79877c8d9a533447a3f04db4cd31078be29f0b2c2fefd4c70d": [57, 127],
    "adb7645ce524963d3768e6dfff8547c1fa3076d18e9b64c76f3af93978b214ef": [62],
    "60e424f977fd690377672d08d817ed3bb5e8e187d741efe25b82cec796118d14": [46],
    "7a302c1d77124747d65ad2b7181b899f023baceb96d88638d37c44a05e7ad49b": [5],
    "962a88eff2128d036bf8745c31faadb050c45abc0e93e712c3b3d50c72906bf4": [3, 4],
    "0b1f62e13ef96a78c4d156f171eb5402a027d1276d01da22d874de8787c6b422": [3, 4, 5, 6],
}
rows = []
for h, ns in selected.items():
    raw = Path("/home/elies/Repos/IRoboPF/.cache/procedencia/sha256", h).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == h
    pdf = corpus.mupdf().open(stream=raw, filetype="pdf")
    for n in ns:
        page = pdf[n - 1]
        for b in page.get_text("blocks"):
            if b[6] == 0 and any(
                s in b[4].lower()
                for s in [
                    "efectos",
                    "enero",
                    "período",
                    "periodo",
                    "entrada en vigor",
                    "entrará en vigor",
                    "ley 24/2010",
                    "derog",
                    "escala autonómica",
                    "611-1",
                ]
            ):
                rows.append(
                    {
                        "documentSha256": h,
                        "page": n,
                        "bbox": list(b[:4]),
                        "quote": page.get_textbox(b[:4]),
                        "extraction": "get_textbox",
                        "completeRuleAcceptance": False,
                    }
                )
(out / "citas-temporales.json").write_text(
    json.dumps(rows, ensure_ascii=False, indent=2) + "\n"
)
print(json.dumps(rows, ensure_ascii=False, indent=2))
