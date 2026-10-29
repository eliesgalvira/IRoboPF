import json
from pathlib import Path

r = Path.cwd()
c = r / ".cache/flujo-escalas-r26-sol"
d = "/home/elies/Repos/IRoboPF/node_modules"
(c / "runtime.json").write_text(
    json.dumps(
        {
            "compilerOptions": {
                "baseUrl": str(r),
                "paths": {
                    "effect": [d + "/effect/dist/index.js"],
                    "effect/*": [d + "/effect/dist/*.js"],
                    "decimal.js": [d + "/decimal.js/decimal.mjs"],
                    "@/*": [str(r / "*")],
                },
            }
        }
    )
)
config = json.loads((r / ".oxlintrc.json").read_text())
assert len(config["rules"]) == 16 and set(config["rules"].values()) == {"error"}
config["jsPlugins"] = [str(c / p) for p in config["jsPlugins"]]
(c / "oxlint.json").write_text(json.dumps(config))
(c / "tsconfig.json").write_text(
    json.dumps(
        {
            "compilerOptions": {
                "allowJs": True,
                "checkJs": True,
                "noEmit": True,
                "target": "ES2022",
                "module": "NodeNext",
                "moduleResolution": "NodeNext",
                "skipLibCheck": True,
                "typeRoots": [d + "/@types"],
                "types": ["node"],
                "paths": {
                    d + "/decimal.js/decimal.mjs": [d + "/decimal.js/decimal.d.ts"]
                },
            },
            "files": [
                str(r / "docs/procedencia/revisiones/flujo-escalas-r26-sol/casos.mjs")
            ],
        }
    )
)
