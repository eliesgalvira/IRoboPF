# Almacén documental externo

El índice permitido de snapshots sigue en `docs/procedencia/implementaciones/contenidos/datos/snapshots.json`. Los objetos, incluidos los snapshots, están fuera de Git. Lectores y generadores usan `IROBOPF_CAS_LOCAL`, una ruta absoluta a un directorio cuyos nombres son hashes SHA-256. No se admite una raíz dentro de Git ni una raíz con symlinks. No hay descarga ni fallback al almacén antiguo.

La ubicación se configura en cada entorno. El [respaldo privado](RESPALDO.md) conserva los originales para preparar el backend; su contenido necesita revisión de privacidad antes de publicarse. Este cambio no implementa un backend ni configura un servicio externo.

```sh
export IROBOPF_CAS_LOCAL="$HOME/.local/share/irobopf/procedencia/objetos"
bun scripts/procedencia/rastro-verificar.mjs
bun scripts/procedencia/contenido-verificar.mjs
```

Cada lectura verifica SHA-256 y el tamaño esperado cuando consta en el descriptor. Los PDF externos comprueban además SHA-512 y firma de formato PDF. Las rutas públicas conservan su lista permitida por snapshot; una ausencia o corrupción no se convierte en contenido válido.

Next conserva únicamente el índice en su trazado de archivos, nunca el almacén. Los previews de `procedencia-documental` continúan desactivados. La interfaz y el despliegue del backend corresponden al otro hilo.

Los generadores escriben los objetos nuevos en el directorio externo y los índices en Git. Antes de distribuir un índice nuevo, hay que transferir y verificar sus objetos. Los destinos explícitos de ensayo/restauración siguen admitidos; no son destinos de producción.

La comprobación de los snapshots históricos y sus dependencias pasa, igual que las rutas y el rastro actual. El coordinador `verificar-enlaces.mjs` del registro activo rechaza un binding de otro inventario. Esa discrepancia ya está en la punta anterior a la migración; se conserva y se detalla en [VALIDACION.md](VALIDACION.md). No se han trasladado las aceptaciones históricas al inventario actual.
