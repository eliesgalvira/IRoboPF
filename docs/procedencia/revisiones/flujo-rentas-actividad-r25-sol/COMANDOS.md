# Reproducción

Desde /home/elies/.t3/worktrees/IRoboPF/t3-70a9a10f:

```sh
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/fisico.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun -c node docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/revisar.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/matrices.mjs
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#nodejs nixpkgs#bun -c bash docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/calidad.sh
flock /tmp/irobopf-recepcion-acotada.lock nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/fisico.mjs final
```

La primera generación pequeña de matrices se ejecutó con Nix sin flock; no hizo pruebas ni recorrido de base. Las repeticiones usan lock pesado. revisar.mjs termina1 deliberadamente por nueve rojos. No ejecutar generadores ajenos: escriben sus resultados. La adaptación del verificador reemplaza exactamente su const out original por `.cache/flujo-rentas-actividad-r25-sol/`, conservando las aserciones y condiciones originales. Los tres grafos alterados solo se escriben allí. Node/Bun explícitos mediante Nix; no se utilizó Python ni se creó entornoUV.

fisico.mjs primero falló en ls-tree con `spawnSync git ENOBUFS`, stdout1081344bytes y SIGTERM por maxBuffer implícito. Se conserva este diagnóstico textual sin volver a ejecutar el instrumento defectuoso. No se relajó ningún cotejo. El reintento inicial completo se produjo después de comenzar las escrituras propias; véase desviación en INFORME.

Lint: oxlint --threads=1 --disable-nested-config, configuración propia con16 reglas aerror y plugins del padre solo lectura. TypeScript checkJs de los mjs propios. El script calidad imprime ambos códigos, por lo que hay que leerlos y no inferir resultado por el exit del shell.

Tras terminar el cotejo final:

```sh
nix shell nixpkgs#nodejs -c node docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/entregar.mjs
```

Este último paso escribe solo manifiesto.json, patch.diff.gz y binarios.json, excluidos de su propia autorreferencia. El manifiesto también fija hashes/tamaños del patch y mapa binario. Las adiciones se obtienen con git diff --no-index contra /dev/null; no hay operación VCS mutante.
