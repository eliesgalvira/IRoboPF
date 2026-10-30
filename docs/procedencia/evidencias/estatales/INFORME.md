# Evidencia estatal candidata contra ed6a43fd

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Base examinada: `ed6a43fd750de05609abc3710dabdc2f8261020c`. Evidencia candidata sin aceptación fiscal de bindings.

Los candidatos siguen los contratos de `corpus.py`, `enlaces.py`, sus schemas y ENLACES-VERIFICABLES. Los documentos originales son la evidencia; las transcripciones Markdown permiten localizarla.

## Resultado y denominadores

El lote está cerrado sobre 26 celdas de base/cuota ordinaria y complementaria 2012–2014; 19 conceptos de mínimos estatales para cada año 2012–2025; metadatos nominales efectivos del artículo 20 y gasto fijo legacy; seis límites canónicos sin exposición efectiva. `cobertura.json` enumera candidatos y bloqueos. No incluye todos los parámetros estatales ni las condiciones completas de cada regla.

- **81 citas numéricas distintas y dos citas de contexto de prórroga**, con texto literal, página física desde 1, caja de contexto, caja de palabra/celda, cabeceras y receta de render. **13 facsímiles únicos**, compartidos sin multiplicarlos por año, ocupan 4.04 MB. Se conservan siete manifiestos publicables de originales; uno corresponde a la prórroga de 2014, que complementa la lectura de las tablas.
- **319 payloads candidatos**: 266 ocurrencias de mínimos (19 conceptos × 14 años), 42 metadatos nominales de reducción y 11 gastos generales legacy. No son 319 reglas distintas ni 319 evidencias independientes. Todos comparan por Decimal, con conversión identidad, contra una hoja efectiva del artefacto.
- **76** pasan además la puerta que exige que el archivo del motor figure en la decisión jurídica: 57 mínimos de 2012–2014 y 19 de 2025. **243** no pasan esa puerta: 190 alias anuales de mínimos de 2015–2024 y 53 metadatos de trabajo. Se entregan los payloads válidos por schema para revisión, con el bloqueo en la matriz; no se registran como bindings integrados.
- **26** bases/cuotas publicadas quedan sin payload por ausencia de hoja efectiva. **13** tipos de esas escalas quedan bloqueados tanto por exposición como por conversión porcentaje→fracción. **6** límites canónicos de trabajo también carecen de exposición efectiva. Otros **14** registros nominales quedan fuera por alcance 2026 o ausencia de literal directo. Los estados no se suman como porcentaje de aceptación fiscal.

## Bloqueos que no deben resolverse con coincidencias numéricas

**Escalas.** `lib/dominio/irpf/cuotas/escalas-publicadas.ts`, símbolos `ESTATAL_ORDINARIA_2012_2014` y `ESTATAL_COMPLEMENTARIA_2012_2014`, rutas `[fila, baseInferior]`, `[fila, cuota]` y `[fila, tipo]`. El extractor de `scripts/procedencia/inventario.mjs:204` solo evalúa efectivamente módulos en `/normativa/datos/`. Las tablas publicadas están fuera. Las 26 celdas del BOE coinciden con las tuplas sintácticas actuales, pero esa comprobación no crea valores efectivos. EEA-CUOTAS-FIJAS tampoco menciona el nuevo archivo en `engineLocations`. Un experto rechazaría reutilizar una ocurrencia de otra tabla porque repite 17.707,20. Se conserva el bloqueo; coste: será necesario ampliar y revisar el extractor, reconstruir una vez y obtener revisión nueva antes de enlazarlas.

**Mínimos.** MIN-012 identifica los tres módulos históricos. MIN-013 acepta el texto de la reforma, no todos sus alias anuales; solo registra el módulo 2025. Cada año tiene payload propio, con su ID, hash de fuente, ruta e inventario. No se modifica esa decisión para conseguir verde. Coste: revisión del alcance anual y de la relación con los aliases. Los conceptos de discapacidad de ascendiente y descendiente comparten el pasaje normativo, pero conservan bindings distintos. No se acepta elegibilidad familiar, reparto ni operador de edad mediante estas citas de cuantías.

**Trabajo.** `METADATOS_ARTICULO_20_LEGACY` y `GASTOS_FIJOS_IRPF_LEGACY` son hojas efectivas, pero su nombre y correspondencia no demuestran que el cálculo canónico consuma esas hojas. Las decisiones TDE referidas no incluyen `engineLocations`, por lo que la puerta vigente las rechaza. El umbral 6.500 de otras rentas, los límites 300 de defensa, 3.500/7.750 de discapacidad activa y 17.673,52/2.364,34 de la reducción reciente viven dentro de funciones; sus localizaciones exactas están en la matriz y no se sustituyen por una tabla legacy. El tope de colegio 500 también está en `calcularGastosTrabajo`, `lib/dominio/irpf/trabajo-anual/calcular.ts:95`, sin exposición efectiva; su cita completa no forma parte del lote numérico. TDE-02 conserva su fundamento reglamentario. La transición 2018 consta como texto `Transitorio` en metadatos: no ofrece las cuatro hojas numéricas requeridas para ese año. No se inventan ceros legales desde una constante técnica ni se cierra 2026.

**CAS y puente.** El auxiliar integrado busca originales y PNG exclusivamente en `docs/procedencia/corpus/fixtures/sha256`. Esta entrega deja los PDF originales en el CAS autorizado y conserva PNG en su propia carpeta. Por ello ni siquiera los 76 candidatos con puerta jurídica positiva están listos para insertarse sin más en el registro actual. No se copian cientos de MB de PDF a Git ni se modifica el puente fuera del ámbito. Coste: integración del almacenamiento y revisión de cierre durante la integración. La comprobación por componentes no se presenta como ejecución del coordinador completo.

## Qué se ha comprobado

**Integridad:** SHA-256, SHA-512 y tamaño de los originales; referencias con hash; schema cerrado de documentos, citas y payloads; regeneración de texto, geometría y PNG con `corpus.verify`. Manifiestos HTTP saneados antes de hashearlos. Se utiliza el entorno Nix/uv fijado del corpus, MuPDF/PyMuPDF y su receta de 144 dpi, RGB, sin anotaciones ni alpha, flags de texto 0 y orden original.

**Autenticidad:** no validada en esta entrega. La procedencia HTTPS y los hashes identifican bytes; no acreditan firma histórica, CSV ni emisor. No se heredan afirmaciones criptográficas de otros informes.

**Interpretación:** selección por artículo, concepto, fila y columna. En las escalas se fijan columnas geométricas; en mínimos, artículo y sujeto; en trabajo, artículo 20 frente a otros importes de la misma página. Las cajas de palabra pueden intersectar glifos de renglones vecinos: se verifica la palabra y su geometría en la lista de palabras del PDF y se conserva además el texto literal del clip con vecinos, sin normalizarlo para simular una celda aislada. El facsímil conserva la página completa para mostrar contexto y cabeceras. Objeción experta: un recorte mínimo podría ocultar el sujeto o la columna; motivo de esta elección: mantener el contexto jurídico; coste: PNG mayores y revisión visual nueva pendiente.

**Exactitud:** 319 igualdades decimales contra `readArtifact`, con ID, capa efectiva, símbolo, ruta y hash de fuente actuales. Las 26 coincidencias adicionales contra tuplas fuente son solo sintácticas. El lector valida el artefacto `29fb5e311f33982395227b15f2e08705e2943bf5ea21409702f48dd8ba4e613c`, manifiesto `6872a5fb9315a4e970c5da7fb3d8ad58f2ebf74b3d84fe07101b90cb8c58564d`, correspondiente al snapshot comunicado `babfc930e2c4096600e68895d13bbfae23c996bacd3ba7fbd376ae32f8713c68`. No se ha reconstruido el inventario. Esto no sustituye al coordinador fresco ni demuestra la ejecución anual de cada hoja.

**Aceptación:** ninguna nueva; `bindingReview` pendiente y `completeRuleAcceptance: false`. No se han escrito atestaciones ni migrado aceptaciones. MIN-012/013 y TDE se referencian con sus bytes e identificadores originales; sus alcances no se amplían por esta entrega.

## Reproducción e integración

Las recetas conservadas son instrumentos de investigación, no código de producto ni sustitutos del coordinador. Copiar `leer-inventario.mjs.txt` a `.cache/estatales/leer-inventario.mjs`, `preparar.py.txt`  , `contextos.py.txt` y `verificar.py.txt` a ese mismo scratch. Desde la raíz:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c bun .cache/estatales/leer-inventario.mjs
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/estatales/preparar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/estatales/verificar.py
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/estatales/contextos.py
```

El CAS scratch solo enlaza originales de lectura y recortes propios; no modifica originales. Los PDF se localizan por hash en `/home/elies/Repos/IRoboPF/.cache/procedencia/sha256`. Los manifiestos mantienen URL para recuperación controlada con `tools/procedencia/descargar.py` y hash esperado, nunca descarga silenciosa de otra versión. El entorno puede crear su `.venv` ignorado; no cambia dependencias ni lockfiles. Un trabajador y bloqueo compartido; sin Next build ni suites legacy.

`comprobaciones.json` conserva resultados por cita, puertas y control negativo de número alterado. Los instrumentos Python pasan Ruff; no se escribió Effect ni TypeScript de producto. No se afirma lint/typecheck global de una aplicación sin cambios. Los intentos iniciales detectaron metadatos antiguos incompatibles y un selector con espacio tipográfico distinto; se corrigió la receta sobre el original. El ensayo de clip de palabra detectó texto vecino, conservado explícitamente en la comprobación final.

`manifiesto.json` enumera archivos, tamaños y hashes. `entrega.patch` es el patch textual de archivos nuevos contra la base declarada; los PNG se integran por archivo y hash (no tienen diff textual). No hay borrados ni modificaciones de archivos base propuestos. La integración debe comprobar base y ausencia de colisiones, copiar solo esta carpeta, comprobar hashes, ejecutar su coordinador tras resolver los bloqueos y encargar una revisión NUEVA del payload exacto. No basta aplicar el patch para abrir aceptación fiscal.
