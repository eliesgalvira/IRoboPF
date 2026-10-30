Los comandos funcionales y calidad, con códigos, están en COMANDOS.json. Todos se ejecutaron mediante flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs --command …, sin anidamiento.

Recepción/cotejos físicos (salida 0 tras corregir el arnés):

PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/.cache/revision-admision-r46-r47-sol/uv" flock /tmp/irobopf-recepcion-acotada.lock tools/procedencia/run.sh .cache/revision-admision-r46-r47-sol/fisico.py .cache/revision-admision-r46-r47-sol/pretransporte.json

Transporte/reconstrucción: mismo entorno, flock /tmp/irobopf-validacion-pesada.lock tools/procedencia/run.sh .cache/revision-admision-r46-r47-sol/empaquetar.py; código en TRANSPORTE.json. No es un checkout: solo reconstruye los archivos del payload.

Después del transporte se repite fisico.py con salida .cache/revision-admision-r46-r47-sol/final.json, y su ledger final.json.entradas.json.gz. El resultado final se deja fuera del payload para evitar un ciclo de autorreferencia. Se exige 21514 entradas, cero cambios/borrados y cero extras fuera de los dos ámbitos.

No hay VCS mutante. HEAD, ls-tree, cat-file, show y diff se usan solo para lectura.
