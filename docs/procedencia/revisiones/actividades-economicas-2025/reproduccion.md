# Reproducción

Desde la raíz del proyecto, un proceso por vez:

```sh
nix shell nixpkgs#python3 -c python3 .cache/procedencia/revision-actividades-economicas-2025/casos.py
nix shell nixpkgs#python3 nixpkgs#stdenv.cc.cc.lib -c bash -c 'UV_PYTHON_DOWNLOADS=never LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib" uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/revision-actividades-economicas-2025/extraer.py'
```

Los scripts ejecutables permanecen exclusivamente en scratch. La segunda orden verifica los15 originales candidatos y1721 cajas; el script corregido ya no regenera todas las extracciones de texto. La primera recalcula18 ejemplos condicionados y fronteras aritméticas: no ejecuta el motor. `casos.json` añade razonamiento documental por frontera; regenerar el resultado aritmético no sustituye esa revisión.

Adquisiciones mediante `adquirir.py` y `ampliar.py`, que invocan el helper autorizado con raíz CAS propia. Lock de máquina, UA y espera del helper; ningún original del autor modificado. Los originales públicos no acreditan por hash su firma ni vigencia. Las rutas DGT devolvieron el buscador, registrado como intento fallido de adquisición de la consulta, aunque HTTP200.
