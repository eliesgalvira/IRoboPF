# Almacén documental externo

El índice permitido de snapshots sigue en `docs/procedencia/implementaciones/contenidos/datos/snapshots.json`. Los objetos, incluidos los snapshots, están fuera de Git. Lectores y generadores usan `IROBOPF_CAS_LOCAL`, una ruta absoluta a un directorio cuyos nombres son hashes SHA-256. No se admite una raíz dentro de Git ni una raíz con symlinks. No hay descarga ni fallback al almacén antiguo.

En host-a, la copia de trabajo es `/home/local/.local/share/irobopf/procedencia/objetos`. El respaldo independiente de esta copia de trabajo se describe en [RESPALDO.md](RESPALDO.md). El backend futuro podrá recibir la semilla; este cambio no implementa ese backend ni configura un servicio externo.

```sh
export IROBOPF_CAS_LOCAL=/home/local/.local/share/irobopf/procedencia/objetos
bun scripts/procedencia/rastro-verificar.mjs
bun scripts/procedencia/contenido-verificar.mjs
bun scripts/procedencia/verificar-enlaces.mjs --cas-root "$IROBOPF_CAS_LOCAL"
```

Cada lectura verifica SHA-256 y el tamaño esperado cuando consta en el descriptor. Los PDF externos comprueban además SHA-512 y firma de formato PDF. Las rutas públicas conservan su lista permitida por snapshot; una ausencia o corrupción no se convierte en contenido válido.

Next conserva únicamente el índice en su trazado de archivos, nunca el almacén. Los previews de `procedencia-documental` continúan desactivados. La interfaz y el despliegue del backend corresponden al otro hilo.

Los generadores escriben los objetos nuevos en el directorio externo y los índices en Git. Antes de distribuir un índice nuevo, hay que transferir y verificar sus objetos. Los destinos explícitos de ensayo/restauración siguen admitidos; no son destinos de producción.
