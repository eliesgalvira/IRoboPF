# Respaldo completo anterior a la migración

Directorio de conservación en host-a: `/home/local/Backups/IRoboPF/procedencia-20261101-2b6afac3`.

- `repositorio-completo.bundle`: todos los refs Git; restauración independiente en `restauracion.git`, comprobada con `git fsck --full` y cotejo de 1.184 refs.
- `semilla-backend/`: objetos actuales e históricos, PDF externo y registro de snapshots. `almacen-restaurado/` es una segunda copia verificada, sin hardlinks.
- `almacen-manifiesto.json` y `almacen.sha256`: inventario con tamaño y SHA-256. La copia versionada del manifiesto está en esta carpeta.
- `pendientes/`: copia adicional de los archivos de trabajo que no pertenecían a la punta publicada. No se incorporan a la rama.

Comprobación desde el directorio de conservación:

```sh
sha256sum -c repositorio-completo.bundle.sha256
git -C restauracion.git bundle verify ../repositorio-completo.bundle
git -C restauracion.git fsck --full
(cd semilla-backend && sha256sum -c ../almacen.sha256)
(cd almacen-restaurado && sha256sum -c ../almacen.sha256)
```

Para restaurar de nuevo, clonar el bundle en un directorio nuevo y copiar `semilla-backend/` a otro directorio nuevo. No sobrescribir estas copias. Son locales en host-a; no constituyen custodia independiente. La copia previa de host-b no contiene este corte.
