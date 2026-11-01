# Migración de la historia documental

Solo se reescribe `procedencia-documental`. El mapa acumulado comprende la retirada del almacén, la anonimización del entorno y la retirada de referencias personales de terceros. La última pasada conserva 217 commits, mensajes, autores, fechas y 19 firmas. [Informe de privacidad de terceros](../privacidad-terceros/INFORME.md).

| Referencia anterior | Correspondencia actual |
| --- | --- |
| `a11c26a367346ea0961b0da5c2a8652abe42dece` —punta previa— | `ea0de5e221e8c8bb10491f1e1893fd91646e39aa` |
| `7b5435a83600e6b614678243cea524dbd83f5d91` —base actual del rediseño— | `fa751a19e19f522008d7a0f6dc182d977abd5142` |
| `6b0f071bf059e621364d9d24b6e620f2b79434ce` —base previa a la primera anonimización— | `fa751a19e19f522008d7a0f6dc182d977abd5142` |

Son correspondencias históricas. La punta de la rama añade los commits posteriores de documentación y mapas.

## Trasladar el rediseño

Conservar antes los cambios locales y traer la rama nueva. Para trasladar solo los commits propios sobre la base equivalente:

```sh
git rebase --onto fa751a19e19f522008d7a0f6dc182d977abd5142 7b5435a83600e6b614678243cea524dbd83f5d91 rediseno/expertos
```

Elegir `origin/procedencia-documental` como destino incorporaría además los cambios posteriores. El responsable del checkout debe revisar conflictos y diff antes de subirlo, para no reintroducir el almacén ni material retirado. No mezclar Git y JJ dentro de un worktree Git de T3. No se ha migrado ni limpiado ningún otro worktree.

## Resolver referencias históricas

El [mapa acumulado](mapa-commits.tsv) conserva 494 identidades. Los informes mantienen sus SHA originales; el resolver devuelve su correspondencia final:

```sh
bun scripts/procedencia/commit-historico.mjs SHA_ANTIGUO
```

Los destinos existen en la nueva historia. El [mapa de objetos](../privacidad/objetos.json) distingue derivados anonimizados; las [retiradas completas](../privacidad-terceros/retirados.json) requieren el respaldo privado. No se renueva aceptación de evidencias.

`main`, otras ramas, clones y worktrees conservan sus propias historias. GitHub puede seguir sirviendo commits antiguos por SHA hasta que soporte purgue los objetos y vistas correspondientes. [Límites de eliminación](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
