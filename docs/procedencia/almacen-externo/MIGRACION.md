# Migración de la historia documental

Solo se reescribe `procedencia-documental`: primero se retiró el almacén y después se anonimizaron datos del entorno. La segunda pasada conserva los 214 commits existentes, sus mensajes, autores, fechas y las 19 firmas. Cambian 149 identificadores de commit. Se cotejaron todos los archivos y modos de cada commit; solo se aplicaron las sustituciones y los dos cambios de nombre documentados. [Comprobación de historia](../privacidad/historia.json).

| Referencia histórica | SHA antiguo | Correspondencia actual |
| --- | --- | --- |
| Punta anterior a la retirada del almacén | `2b6afac382046ed7e7e5846050c686813f0fda64` | `692e355ba40ee05aa4da3c8163164daaf9fa4671` |
| Punta anterior a la anonimización | `4ea70baed920bcb35782c8f883bac59f5c3f0a48` | `279bec2ee519abc7a8bb7dbb3e976933b42b4db4` |
| Base de `rediseno/expertos` | `6b0f071bf059e621364d9d24b6e620f2b79434ce` | `7b5435a83600e6b614678243cea524dbd83f5d91` |

Las correspondencias son estados históricos. La punta publicada incluye además los commits posteriores de portabilidad y documentación y se consulta en `origin/procedencia-documental`.

## Migrar un trabajo existente

Conservar los cambios locales y traer la rama nueva antes de migrar. Para trasladar únicamente los commits propios de `rediseno/expertos` sobre la base equivalente, la operación Git es:

```sh
git rebase --onto 7b5435a83600e6b614678243cea524dbd83f5d91 6b0f071bf059e621364d9d24b6e620f2b79434ce rediseno/expertos
```

Usar `origin/procedencia-documental` como destino incorpora también los cambios posteriores a aquella base. Debe elegirlo el responsable del checkout y revisar los conflictos y el diff antes de publicar, para no reintroducir el almacén ni datos retirados. No mezclar Git y JJ dentro de un worktree Git creado por T3. No se ha migrado ni limpiado ningún otro worktree.

## Resolver citas históricas

El [mapa acumulado](mapa-commits.tsv) contiene las identidades de ambas reescrituras. Los informes mantienen sus SHA originales; el resolver devuelve la correspondencia final:

```sh
bun scripts/procedencia/commit-historico.mjs SHA_ANTIGUO
```

Los destinos del mapa existen en la historia nueva. Los originales retirados del almacén se recuperan de la semilla por hash. Los archivos anonimizados tienen otro hash y su [mapa de objetos](../privacidad/objetos.json) identifica la copia pública sin renovar la revisión de sus bytes. Para reproducir exactamente un recibo antiguo se conserva el bundle privado.

`main` y las otras ramas no se reescriben. Los clones, worktrees, respaldos y posibles cachés del proveedor conservan su propia historia; un force-push no los elimina. [Límites de eliminación en GitHub](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
