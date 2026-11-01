# Respaldos privados y restauración

El corte más reciente, anterior a la retirada de referencias de terceros, conserva un bundle de 2.982.979.274 bytes y dos copias verificadas del almacén. Sus hashes y comprobaciones están en el [informe de retirada](../privacidad-terceros/INFORME.md#respaldo-privado). Las copias descritas a continuación se conservan como antecedentes.

Se conservan fuera del repositorio dos cortes íntegros: antes de retirar el almacén y antes de anonimizar la historia. Sus directorios se entregan al propietario fuera de Git; en los comandos siguientes se representan mediante variables que debe configurar con esas ubicaciones.

## Historia anterior a la anonimización

`antes.bundle` ocupa 2.356.334.737 bytes y tiene SHA-256 `2b5991f18c244fe434e5108c262594da6c0f355419b88a060187972950aee8bb`. Se restauró en un repositorio independiente, pasó `git fsck --full` y se cotejaron sus 1.356 referencias, incluidas las de worktrees. Los archivos de trabajo pendientes también son recuperables; no se incorporan a la rama pública.

```sh
sha256sum "$RESPALDO_PRIVACIDAD/antes.bundle"
git bundle verify "$RESPALDO_PRIVACIDAD/antes.bundle"
```

Una restauración nueva se hace clonando el bundle en otro directorio. No sobrescribir las copias conservadas ni trasladar sus refs antiguos a origin.

## Historia original y semilla documental

El primer respaldo conserva `repositorio-completo.bundle`, restaurado y verificado, y el almacén completo. La semilla ampliada está en `semilla-final/`, con manifiesto y lista SHA-256; `semilla-final-restaurada/` es otra copia verificada, sin hardlinks. Son 10.067 archivos y 523.865.905 bytes por copia. Pin del manifiesto: `5462e689ff034b3e21c59bb801d651e5e2e96ad71b0be2b441714244c761685c`.

```sh
(cd "$RESPALDO_ALMACEN/semilla-final" && sha256sum -c ../semilla-final.sha256)
(cd "$RESPALDO_ALMACEN/semilla-final-restaurada" && sha256sum -c ../semilla-final.sha256)
```

La semilla conserva los originales y el PDF externo de 42.900.459 bytes. Incluye metadatos privados históricos: necesita revisión antes de distribuirse desde el backend. No se ha implementado ni desplegado ese backend.

Son copias locales del propietario. La copia anterior en su otro equipo sigue desfasada; no se le atribuye una actualización ni custodia independiente. Ningún respaldo ni worktree se ha borrado.
