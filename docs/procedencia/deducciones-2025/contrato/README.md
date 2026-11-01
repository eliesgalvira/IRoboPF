# Contrato de entrega y verificación

Entrega candidata para revisión independiente. No emite dictámenes fiscales ni acepta los de otros lotes.

Desde la raíz, con Node, Python 3 del sistema y uv disponibles (jsonschema 4.26.0 se resuelve en caché externa):

```sh
node scripts/procedencia/deducciones-2025/verificar.mjs --lotes docs/procedencia/deducciones-2025/lotes --modo parcial
node scripts/procedencia/deducciones-2025/verificar.mjs --lotes docs/procedencia/deducciones-2025/lotes --modo completo --cas "$CAS_EXTERNO" --formato sha256
```

`sha256` resuelve `ROOT/sha256/HASH`; `plano` resuelve `ROOT/HASH`. Ambos requieren root explícito externo al repositorio. El verificador solo lee, no descarga ni mueve bytes. Comprueba tamaño, SHA-256 y SHA-512 de cada documento recibido; detecta enlaces que escapen del root. Sin `--cas` informa `integridadBytes: no_comprobada`, también en modo completo. Cobertura completa e integridad son ejes separados: para exigir ambas en integración se debe pasar CAS. Un original ausente o alterado produce error al comprobar bytes.

El modo parcial admite lotes enteros aún no recibidos y devuelve sus códigos como pendientes. Cada lote recibido debe estar completo. El modo completo exige los 351 códigos exactos del censo, con comunidad y lote correctos; Ceuta y Melilla no añaden registros. La base de paquete es el commit exacto indicado en el encargo de implementación.

El JSON Schema `scripts/procedencia/deducciones-2025/contrato.schema.json` contiene `$defs.lote` y `$defs.fuentes` (Draft 2020-12). El consumidor usa `jsonschema` (Draft202012Validator) mediante `uv run --no-project --python python3 --no-managed-python --with jsonschema==4.26.0`; no crea un entorno dentro del repositorio. Se pueden fijar `UV_CACHE_DIR` y `UV_PROJECT_ENVIRONMENT` a ubicaciones externas; por defecto usa el directorio temporal del sistema. Para usar otro validador se selecciona la definición correspondiente con `$ref`. El schema exige todos los campos comunes; los arrays vacíos no fabrican evidencia. `pendientes` exige `causa`, `actuacionesRealizadas` (array no vacío) y `evidenciaNecesaria`.

Convenciones precisas: un localizador HTML usa `selector`, `inicio`, `fin` (rango semiabierto de caracteres) y `recetaExtraccion`; PDF usa página física desde 1 y bbox `[x0,y0,x1,y1]` en puntos. `manual.documentoId` referencia un documento de tipo manual, `manual.citas` solo citas a ese documento. `paginasFicha` conserva el censo; `paginasComprobadas` registra lo realmente contrastado. Las diferencias de paginación se explican en reservas. `vigencia.citas` y las listas anidadas `citas`/`citaIds` se contrastan con las citas locales. Las reservas pueden detallar reformas, transitorios, límites y remisiones todavía abiertos.

Los contraejemplos usan `entradas`, `esperado`, `calculoIndependiente`, `observado`, `apiOCampo`, `pruebaReproducible`, `alcance`. Los cambios usan `archivo`, `motivo`, `pruebaRojaAnterior`, `resultadoPosterior`. La comparación exige aspecto, valores, regla oficial, citas, resultado y motivo. Una diferencia exige comparación discrepante y discriminante reproducible. Un cambio entre dictamen anterior y posterior exige prueba/fix. Una coincidencia global no puede ocultar cálculo o ficha no verificables, y una diferencia de ficha/cálculo debe conservarse en el global.

Los documentos requieren URL HTTPS sin credenciales, fechas, ambos hashes y metadatos editoriales. Los IDs repetidos entre lotes solo se admiten con metadatos idénticos. Las citas deben apuntar a documentos declarados con MIME compatible y localizadores no vacíos. Se rechazan campos privados conocidos, rutas locales y firmas de originales embebidos. Este filtro no sustituye la inspección de privacidad: ni la sintaxis de una URL prueba su oficialidad ni un hash prueba el contenido de una cita. La titularidad oficial, reextracción literal desde PDF/HTML, correspondencia de artículos y efectos jurídicos requieren cotejo independiente. El verificador no ejecuta recetas arbitrarias de extracción ni pruebas mencionadas en los dictámenes.

Para dictámenes positivos o diferencias actuales se exige original, comparación, manual enlazado y vigencia enlazada. Los `no_verificable` necesitan pendientes concretos con actuaciones: una ficha no investigada debe permanecer ausente como lote pendiente, no rellenarse con un dictamen artificial. El control estructural no puede probar que las actuaciones narradas se realizaron. El resultado siempre es `candidato` y `requiere_revision_independiente`.

Pruebas de contrato: `bun run test tests/deducciones-procedencia-2025-contrato.test.ts --maxWorkers=1`. Los fixtures son hipotéticos y no constituyen evidencia fiscal. Los bytes mínimos temporales se escriben fuera de Git y se conservan; no se toca ningún original existente.

En NixOS, si faltan ejecutables en PATH, ejecutar dentro de `nix shell nixpkgs#nodejs nixpkgs#python3 nixpkgs#uv` (y `nixpkgs#bun` para pruebas). No se usan intérpretes Python descargados por uv.
