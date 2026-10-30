# Comandos y resultados

Desde `/home/elies/.t3/worktrees/IRoboPF/t3-4f88346e`.

2. `UV_PROJECT_ENVIRONMENT="$PWD/docs/procedencia/evidencias/autonomicas-v2/scratch/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$PWD/docs/procedencia/evidencias/autonomicas-v2/reproducir_historico.py"`: salida 0; historico.log registra 94 selecciones, 93 citas, 317 decisiones, 136 payloads y 186 celdas, sin discrepancias. Nueve PNG reproducidos.
3. `PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/docs/procedencia/evidencias/autonomicas-v2/scratch/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$PWD/docs/procedencia/evidencias/autonomicas-v2/preparar.py"`: salida 0 en preparar.log, con 186 candidatos y bloqueos explícitos.
4. `nix shell nixpkgs#ruff nixpkgs#mypy -c bash -c 'ruff check --no-cache docs/procedencia/evidencias/autonomicas-v2/*.py > docs/procedencia/evidencias/autonomicas-v2/ruff.log 2>&1; flock /tmp/irobopf-validacion-pesada.lock mypy --cache-dir=docs/procedencia/evidencias/autonomicas-v2/scratch/mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs docs/procedencia/evidencias/autonomicas-v2/*.py > docs/procedencia/evidencias/autonomicas-v2/mypy.log 2>&1'`: Ruff señaló una importación no utilizada; mypy correcto sobre dos instrumentos. Repetición final ampliada a tres archivos en los logs finales.

Comando de calidad y repetición final:

```sh
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/docs/procedencia/evidencias/autonomicas-v2/scratch/venv" flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#ruff nixpkgs#mypy nixpkgs#python3 -c bash -c 'set -e; ruff check --no-cache docs/procedencia/evidencias/autonomicas-v2/*.py > docs/procedencia/evidencias/autonomicas-v2/ruff-final.log 2>&1; mypy --cache-dir=docs/procedencia/evidencias/autonomicas-v2/scratch/mypy --follow-imports=skip --ignore-missing-imports --check-untyped-defs docs/procedencia/evidencias/autonomicas-v2/*.py > docs/procedencia/evidencias/autonomicas-v2/mypy-final.log 2>&1; bash tools/procedencia/run.sh "$PWD/docs/procedencia/evidencias/autonomicas-v2/reproducir_historico.py" > docs/procedencia/evidencias/autonomicas-v2/historico-final.log 2>&1'
```

Empaquetado: `flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#python3 -c python3 docs/procedencia/evidencias/autonomicas-v2/empaquetar.py`. Los binarios se entregan por ruta/hash, excluidos del patch textual. No se ejecutaron pruebas de producto, Next build ni suites legacy; no hubo cambios de código de producto. Mypy omite imports: no equivale a tipado estricto del corpus.

La repetición final, tras añadir la anotación `patch: list[str]`, emplea el mismo comando agrupado de calidad y reproducción, seguido dentro del mismo lock por `python3 docs/procedencia/evidencias/autonomicas-v2/empaquetar.py`. El primer diagnóstico de los tres archivos queda en mypy-empaquetador-inicial.log. No se relajaron opciones de lint o tipos.

Primer empaquetado: salida 1 por dos enlaces simbólicos históricos cuyo destino no existe; no faltan sus entradas versionadas. Se comprobó `git ls-tree -r HEAD` (modo 120000) y se modificó el control para cotejar readlink contra git show de la base. Última repetición: mismo lock y Nix con Ruff, mypy y empaquetar.py; no se repite la extracción porque no cambió.
