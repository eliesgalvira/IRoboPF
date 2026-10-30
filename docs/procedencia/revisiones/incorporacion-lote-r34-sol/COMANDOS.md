# Comandos propios R34

Cwd: /home/elies/.t3/worktrees/IRoboPF/t3-8fd5f236. Herramientas por Nix; NODE_PATH=/home/elies/Repos/IRoboPF/node_modules, lectura. Cada validación adquiere y libera flock /tmp/irobopf-validacion-pesada.lock por separado. No se anida el bloqueo. El cotejo físico usa /tmp/irobopf-recepcion-acotada.lock y git rev-parse/ls-tree/cat-file/diff/ls-files solo de lectura, blob individual.

1. Inicial: Nix Bun inline, 17.248 blobs, lstat/readlink/bytes/ejecutabilidad. Terminado antes de mkdir/escritura; resultado en fisico-inicial.json.
2. `bun adaptar.mjs`: adapta las cinco recetas recibidas, conserva diffs. Preparador histórico cambia igualdad de HEAD por ascendencia como el padre. Salidas de informe a scratch propio; fuentes de restauración leídas de la carpeta recibida.
3. `bun restaurar.mjs`: siete partes y 3.345 dependencias del candidato histórico, verificador real. restauracion.log.
4. `bun preparar-ensayo.mjs`, `bun completar-ensayo.mjs`, `bun preservar-versiones.mjs`: árbol scratch apto para aplicar/revertir, CAS propio desde v5 r2 de lectura y 44 históricos. No copiar .venv ni node_modules; enlace de lectura al padre. Logs separados.
5. `bun recorrido-r2.mjs`: generación nueva, coordinador Python, fallo ENOTDIR, comprobación del registro previo, publicación y GET importados. PYTHONDONTWRITEBYTECODE=1, UV_OFFLINE=1, UV_PROJECT_ENVIRONMENT=/home/elies/.t3/worktrees/IRoboPF/t3-8fd5f236/.cache/revision-incorporacion-r34/venv. Python de proyecto entra por run.sh. El resultado mide el proceso desde imports y excluye preparación y espera del lock; no es RSS agregado.
6. `node adversos.mjs`, `node parcial.mjs`: pruebas independientes de preestado, identidades, cruces, fuentes, symlinks/hardlinks y fallo EIO de segunda escritura. Los estados desconocidos se conservan en scratch; no se reparan.
7. `bash tools/procedencia/run.sh .cache/revision-incorporacion-r34/consumidores.py`: 265 estados del auxiliar real y nueve cruces con sobres rehasheados, overlays sintéticos explícitos; no son atestaciones nuevas.
8. `bun comprobar-lote.mjs`, `bun historia.mjs`: veinte objetos/36 enlaces del lote, 44 históricos y restauración propia del regenerado. Tiempo/RSS del segundo instrumento se registra sin espera del bloqueo.
9. `bash calidad.sh`: Vitest original en proyección, un trabajador; oxlint --threads=1 --disable-nested-config con las 16 reglas a error; ESLint y tsc con checkJs=true para módulo y pruebas integrados. No Next build ni suite legacy.
10. `node autoridad.mjs`: 264 decisiones R19 originales por payload/itemId/source/scope/inventory/cita/documento/ámbito, autoridad T3 e independencia de autor; sin repetir interpretación fiscal.
11. `bash calidad-python.sh`: Ruff y mypy del instrumento Python, imports omitidos/cuerpos comprobados; uv gestionado en entorno absoluto propio. Logs y fallos de entorno preservados.
12. `bun fisico.mjs`: cierre físico completo y diff; `bun empaquetar.mjs`: gzip textual contra base, binarios por ruta/hash, ensayo con patch sin VCS mutante. El manifiesto excluye autorreferencia; patch excluye sobres que lo describen.

Todos los programas propios están archivados como .txt. Scratch no forma parte de la entrega documental, salvo instrumentos/logs/controles seleccionados. Los originales permanecen en CAS, ambos hashes y referencias en originales.json. No se escribe en v5, registros activos, ESTADO, DECISIONES o informes recibidos.
