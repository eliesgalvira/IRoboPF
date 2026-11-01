# Migración de la historia documental

Solo se ha reescrito `procedencia-documental`. Los 213 commits del corte preparado se conservan en el mismo orden y con los mismos padres relativos; 128 cambian de identificador. Mensajes, autores, fechas, modos de archivo y todos los demás archivos se cotejaron para cada commit. Las 19 firmas pertenecen a commits sin cambios y siguen intactas.

| Referencia | Antes | Después del filtro |
| --- | --- | --- |
| Punta publicada al iniciar | `2b6afac382046ed7e7e5846050c686813f0fda64` | `f36ad4f1fa3725a21d3fb24be5e6083619106d00` |
| Base de `rediseno/expertos` en host-b | `6b0f071bf059e621364d9d24b6e620f2b79434ce` | `afa5a930db20fb6f8dce58b05bc28ebc8aeb0327` |
| Preparación del almacén externo | `81d33e78821a124767195cde380f53ac9f60f4d9` | `4cfc256c2920a8996cecc19051ed9886de919530` |

Después del filtro se añaden commits de migración y validación. La punta final está en `origin/procedencia-documental`; no confundirla con la correspondencia de la punta anterior.

## Worktrees existentes

No se han cambiado sus ramas ni sus archivos. Antes de migrar cada trabajo, conservar sus cambios y comprobar su base. Para `rediseno/expertos`, con el árbol limpio y después de traer la nueva rama, la operación equivalente en Git es:

```sh
git rebase --onto origin/procedencia-documental 6b0f071bf059e621364d9d24b6e620f2b79434ce rediseno/expertos
```

Debe ejecutarla el responsable de ese checkout. No inicializar JJ en un worktree Git creado por T3 ni mezclar ambos sistemas en él. El rebase conserva únicamente los commits propios posteriores a la base indicada; los conflictos necesitan revisión.

## Evidencias y citas históricas

[mapa-commits.tsv](mapa-commits.tsv) contiene la correspondencia completa, incluidos los commits que no cambian. [referencias-historicas.json](referencias-historicas.json) localiza las citas de commits en los documentos. Los SHA originales siguen identificando el estado que se auditó; cambiarlos dentro de manifiestos, citas o informes alteraría sus hashes.

Para consultar un archivo que sigue en Git:

```sh
nuevo=$(bun scripts/procedencia/commit-historico.mjs SHA_ANTIGUO)
git show "$nuevo:ruta/del/archivo"
```

Los tres consumidores activos que abrían bases fijas por SHA usan ese resolver. Los scripts de reproducción archivados en `docs/` conservan su versión original: para reproducir el árbol histórico completo, usar la restauración del bundle indicada en [RESPALDO.md](RESPALDO.md). Si la ruta histórica pertenece al almacén retirado, sus bytes se recuperan por su SHA-256 en la semilla externa, no mediante `git show`.

## Alcance de la retirada

Se retira únicamente `docs/procedencia/implementaciones/contenidos/datos/objetos/` y se aplica también la exclusión del PDF externo `e7b629a…d4a4f4`. El PDF de 42.900.459 bytes no aparecía como blob en esta rama; sí se conservó y verificó en la semilla. Los manifiestos, los paquetes de entrega y sus posibles copias incrustadas permanecen, conforme al requisito de conservar todos los demás archivos.

El filtro no purga copias de otras ramas, worktrees, backups ni retenciones internas de GitHub. El bundle completo preserva deliberadamente la historia anterior. No se ha configurado LFS, desplegado ningún servicio ni modificado `main`.
