# Enlace entre original, inventario y revisión

La entrada de comprobación completa es `scripts/procedencia/verificar-enlaces.mjs`. Reconstruye el inventario en un proceso nuevo, compara todos los archivos del artefacto y comprueba otra vez las fuentes y manifiestos al terminar. El auxiliar Python recibe los elementos efectivos de ese inventario. Ejecutarlo por separado con JSON suministrado por un llamador solo comprueba ese contexto; **no acredita el código actual**.

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bun scripts/procedencia/verificar-enlaces.mjs
bash tools/procedencia/run.sh tests/procedencia-enlaces_test.py
```

El registro fijo es `enlaces/registro.json`. Cada entrada fija los bytes de un payload y, cuando exista, de una atestación externa. El payload fija manifiesto y artefacto de inventario, ID de ocurrencia, archivo/símbolo/ruta/huella del motor, documento, cita, decisión jurídica y alcance. No acepta IDs inventados, números sintácticos confundidos con valores efectivos, conversiones implícitas ni un valor repetido únicamente en la cita. Por ahora la conversión admitida es identidad; porcentajes a proporciones requieren otro contrato revisado.

El primer payload corresponde al límite madrileño de 2020. Se conserva el original BOCM de 28 de diciembre de 2018, SHA-256 `8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660`, y el recorte de la tabla de su página 4. La cita fija la celda 53.407,20 y la cabecera literal EUROS. El recorte completo permite inspeccionar fila y columnas; se reextraen texto, geometría, PNG y número con MuPDF/PyMuPDF fijados. El orquestador también inspeccionó visualmente el PNG. La contrarrevisión jurídica previa es `AUT1721-MADRID-2020-LIMITE`; su alcance no acepta todas las cuotas de la escala.

La comprobación integrada obtiene 53407.2 del módulo actual y lo compara como Decimal con 53407.20 del original. `bindingReview` queda **pending** hasta que una nueva revisión examine este payload exacto, incluida su unidad, selección temporal y relación entre celda y símbolo. La firma del documento queda `trust-indeterminate`; no se promociona por coincidencia de hash ni por éxito numérico. Ninguna salida acepta una regla completa.

## Atestaciones y confianza

Una atestación válida fija hash exacto del payload, snapshot, alcance, decisión limitada, tarea revisora e informe con hash. El catálogo separado `enlaces/revisores.json` debe registrar esa tarea en un archivo de delegaciones del orquestador y limitar su directorio de informes. Se rechazan autor igual a revisor, revisor no registrado, informe ausente y atestación de otro contenido. Cambiar el payload exige nueva revisión; no se migra automáticamente una aceptación tras regenerar el inventario.

La raíz de confianza es editorial: las delegaciones y atestaciones son archivos revisados del repositorio. Esto no es autenticación criptográfica de personas ni protege frente a un mantenedor que reescriba todos los registros de confianza. La independencia se acredita por la tarea externa registrada y su informe, nunca por dos nombres dentro de una cita. El verificador de corpus conserva su `--accepted` deshabilitado; la comprobación de enlaces mantiene resultados separados.

## Validación y límites

Las pruebas usan el original real de Madrid y expectativas ajenas a la función implementada. Cubren valor de motor alterado, snapshot obsoleto, ID ausente/duplicado, ocurrencia equivocada, unidad incompatible, cita o PNG alterados, decisión ausente, escape de rutas, claves JSON duplicadas y atestaciones propias, desconocidas, alteradas o con informe sustituido. Las atestaciones de prueba son sintéticas y viven exclusivamente en temporales; no se incorporan al registro editorial.

CI ejecuta tanto el auxiliar adversarial como la entrada completa. La reconstrucción consume alrededor de 2 GB y debe serializarse en Victus; se reutiliza el entorno Nix/uv fijado del corpus. El proceso de inventario no hereda el límite de 1,5 GiB del auxiliar PDF. La comprobación no es atómica frente a un adversario que cambie y restaure fuentes durante la ejecución; debe ejecutarse en checkout estable de CI. Detecta cambios observables al inicio y final.

Hay un enlace numérico completo, todavía candidato de revisión técnica. Los restantes elementos conservan sus estados pendientes. No se confunde este caso con cobertura fiscal exhaustiva, preservación de todo el corpus fuera del equipo ni autenticidad histórica de certificados.

Se corrigió además IT3-01: signos menos U+207B/U+208B omitibles y un signo separado por espacio. Las tres reproducciones fallaban antes del cambio. El lexer usa dígitos ASCII y rechaza vecinos de categorías matemáticas, guiones y marcas Unicode, manteniendo texto original sin normalización. Son 21 pruebas de corpus y 16 del puente; no sustituyen la revisión visual del contexto.
