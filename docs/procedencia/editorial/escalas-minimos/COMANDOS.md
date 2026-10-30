# Comandos de reproducción

Desde la raíz de la base1196269d4e73742beeed35cc05011b70c21a0b69:

```sh
export UV_PROJECT_ENVIRONMENT="$PWD/.cache/escalas-minimos/venv"
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/editorial/escalas-minimos/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy -c ruff check docs/procedencia/editorial/escalas-minimos/verificar.py
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#mypy -c mypy --ignore-missing-imports --check-untyped-defs docs/procedencia/editorial/escalas-minimos/verificar.py
```

El primer comando reextrae y coteja originales locales por hash. No necesita red. El entorno fijado de tools/procedencia contiene PyMuPDF1.26.7 y jsonschema4.25.1. Las herramientas de calidad proceden de Nix; los logs indican las ejecuciones reales y sus códigos, no una promesa de pase.
