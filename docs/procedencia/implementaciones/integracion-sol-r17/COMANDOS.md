# Comandos de reproducción

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Ejecutar las recetas desde la raíz del proyecto; usar Node/Bun/Python mediante Nix.

Secuencia final recomendable, sin reconstruir matrices históricas ni paquetes:

1. `bash tools/procedencia/run.sh docs/procedencia/implementaciones/integracion-sol-r17/preparar.py` para candidatos actuales por identidad exacta.
2. `comandos/validar.sh` registra corpus, puente, ámbitos históricos, Node, preservación, lint y tipos. Su test:lint original falla bajo el TMPDIR ignorado; la comprobación final es `comandos/cierre-calidad.sh` con un trabajador y smoke de inclusión explícita.
3. `bash tools/procedencia/run.sh docs/procedencia/implementaciones/integracion-sol-r17/test_actual.py` para los 264 candidatos actuales y sus mutaciones.
4. `comandos/repetir-coordinador.sh`: coordinador real contra el registro actual. No pasar el subdirectorio sha256 como raíz CAS; CasResolver añade ese segmento.
5. `bun docs/procedencia/implementaciones/integracion-sol-r17/regenerar.mjs` en Nix con bun/nodejs/python3. Separa históricos y generación en procesos nuevos. Para esta misma entrega ya verificada, `--continuar` repite solo publicación con la entrada guardada y exige el hash de primera-publicacion-v2.json; no autoriza adaptar una entrada alterada. Consultar `logs/regeneracion-aislada.log` para el resultado final. El primer artefacto fue conservado antes de interrumpir las repeticiones en proceso compartido.
6. `comandos/regresion-final.sh` y `comandos/comprobar-alias.sh`: comprobaciones de rastro/publicación/contenido, tipos principal/vendor y repetición tras alias v2.
7. `comandos/mypy-final.sh`: dependencias de tipos efímeras mediante uv run --with; `comandos/cierre-calidad.sh`: 16 reglas a error, un trabajador, ESLint y Ruff.
8. `bash tools/procedencia/run.sh docs/procedencia/implementaciones/integracion-sol-r17/cotejar-preservacion.py` verifica en lectura ambos paquetes existentes y guarda el corte propio. No ejecutar collect, export, restore ni confirm en los originales del integrador.
9. `comandos/matrices.sh` reproduce TGSS en scratch, compara discriminantes mediante cmp y ejecuta las 41 comprobaciones CC sin escribir su matriz histórica.

Ensayo sintético: ejecutar `preparar-ensayo.py` de esta carpeta y, desde `.cache/ambitos/e2e`, `bun ../../../docs/procedencia/implementaciones/integracion-sol-r17/ensayo-publicacion.mjs`, siempre bajo el mismo lock y entorno absoluto. No es una revisión ni una atestación de producción. No copiar el árbol scratch al entregable.

Guías Effect consultadas mediante `nix shell nixpkgs#bun nixpkgs#nodejs -c bun /home/elies/.bun/install/cache/effect-solutions@0.5.3@@@1/dist/cli.js list` y `show data-modeling testing`; fuente local Schema.ts, Struct y Literals. La desviación de orden de la lectura de fuente se declara en INFORME.md. No se entrega una copia del código de Effect ni del contexto privado.

Lecturas VCS realizadas: rev-parse, status, ls-tree, show, diff y comprobación del patch con apply --reverse --check. Ninguna inicialización, reparación de índice, commit, bookmark, push, PR ni despliegue. Al integrar se debe integrar por MANIFIESTO.json contra la base exacta y rechazar cualquier conflicto o borrado.
