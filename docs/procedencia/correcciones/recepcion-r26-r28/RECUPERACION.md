# Recuperar el corte v5 r2 conservado por el padre

La copia fuera de T3 está en `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/`. Conservar el directorio completo, incluidos `manifest-externo.json`, `PIN-final.json`, `manifest-entrada-r1.json` y `CENSO-EXTERNO.json`. Los originales del autor siguen además en su worktree; no es necesario usarlos para recuperar esta copia.

Pin externo del manifiesto: `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88`. SHA512 y tamaño están en `preservacion-v5.json`. El manifiesto JSON tiene 26.184.815 bytes; el gzip versionado tiene otra huella.

Para verificar el paquete desde la raíz del repositorio, con Nix/uv y el entorno ya disponible:

```sh
export PYTHONDONTWRITEBYTECODE=1
export UV_PROJECT_ENVIRONMENT=/home/elies/Repos/IRoboPF/.cache/procedencia/derechos-r15-venv
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh \
  docs/procedencia/preservacion-v5-sol/consumidor.py verify \
  --manifest /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/manifest-externo.json \
  --pin 2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88 \
  --destination /home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/paquete
```

La restauración del padre ya realizada está en el directorio hermano `restauracion/`. Para otra restauración, usar la acción `transfer`, el paquete como `--source` y una ruta absoluta nueva como `--destination`; el consumidor rechaza destinos existentes. No borrar copias anteriores para reutilizar su nombre. Adquirir el mismo bloqueo y comprobar espacio antes del transporte. La restauración efectiva recibida es la registrada en `preservacion-v5.json`; estas instrucciones no cuentan como una ejecución adicional.

`verify` comprueba el conjunto exacto y los bytes. `confirm` añade la confirmación de durabilidad según el contrato del consumidor. La publicación del marcador no es por sí sola un éxito de fsync: si el resultado indica durabilidad indeterminada, conservar bytes y diagnóstico. El software fijado debe coincidir con las identidades del manifiesto; no cambiar fuentes para hacer pasar un paquete antiguo. Para reconstruir herramientas desde el paquete, seguir `materializar2.py` y la receta de la entrega v5, conservando el input r1 exacto. No usar imports u originales de otra caché para ocultar faltantes.

El paquete conserva un corte R26, 1.447 objetos y 19.477 referencias auxiliares. El conjunto físico tiene 18.146 archivos y 2.169.593.524 bytes por copia. Las referencias no resueltas y las limitaciones del censo siguen abiertas. Un hash de origen de metadatos saneados no permite recuperar los campos omitidos; los originales documentales incorporados conservan sus bytes. Los locks y fuentes de herramientas no son un cierre binario del entorno Nix para una máquina sin almacén o red.

No hay respaldo remoto acreditado de este corte. Crossa conserva v1 desfasado, copia local en otra máquina del mismo dueño y casa. La revisión independiente de v5 está pendiente; no se deduce aceptación fiscal, autenticidad histórica o cobertura completa de una restauración correcta.
