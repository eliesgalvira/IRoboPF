# Corpus local verificable

Implementación: `tools/procedencia/descargar.py` y `corpus.py`. Contratos ejecutables: `schemas/procedencia/`. Este pipeline acredita integridad y correspondencia documental; no acepta por sí solo cifras fiscales de 2012–2026. La revisión independiente, vigencia, territorio y condiciones siguen siendo obligaciones del inventario y de los auditores.

## Ejecución reproducible

Desde la raíz del repositorio, con Nix y uv disponibles:

```sh
tools/procedencia/run.sh tests/procedencia-corpus_test.py -v
nix shell nixpkgs#ruff -c ruff check tools/procedencia tests/procedencia-corpus_test.py
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test:lint
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run typecheck
```

Ejecutar los trabajos de mayor consumo de uno en uno. El wrapper limita la memoria virtual a 1,5 GiB por proceso (también para pdfsig); una fuente que exceda el presupuesto falla en vez de consumir toda la máquina. `run.sh` usa PyMuPDF 1.26.7 y jsonschema 4.25.1 en el proyecto Python de tools/procedencia, con uv.lock. flake.lock fija nixpkgs 4c7870105e7f1fdf9c48688c8d7efc21abf0688a, Python 3.13.15, Poppler 26.06.0 y plataforma Linux x86_64. uv recibe el intérprete Nix explícito y tiene prohibidas las descargas de Python. En NixOS necesita libstdc++ para el wheel PyMuPDF; el wrapper configura esa ruta. Ruff también se obtiene de Nix, pues el ejecutable genérico de PyPI no arranca directamente en NixOS.

La descarga conserva la interfaz `download(url, root)` y `descargar.py URL --root DIRECTORIO` del helper anterior; no necesita PyMuPDF. La nueva CLI añade:

```sh
tools/procedencia/run.sh tools/procedencia/descargar.py \
  https://www.boe.es/boe/dias/2025/01/01/pdfs/BOE-A-2025-1.pdf

tools/procedencia/run.sh tools/procedencia/corpus.py ingest /ruta/cache-origen

tools/procedencia/run.sh tools/procedencia/corpus.py \
  --root docs/procedencia/corpus/fixtures verify \
  docs/procedencia/corpus/bocm-firmado.manifest.json \
  docs/procedencia/corpus/bocm-firmado.citation.json

tools/procedencia/run.sh tools/procedencia/corpus.py signature \
  docs/procedencia/corpus/boe-firmado.manifest.json

tools/procedencia/run.sh tools/procedencia/corpus.py rebuild \
  docs/procedencia/corpus/boe-firmado.manifest.json
```

Para crear una cita: `corpus.py cite MANIFEST --page 1 --bbox X0 Y0 X1 Y1 --output CITA.json`. `--binding BINDING.json` comprueba el valor al crearla. `corpus.py verify MANIFEST CITA` comprueba evidencia, sin afirmar aceptación fiscal. `--accepted` falla siempre. La aceptación está deshabilitada: un valor escrito en la cita y dos nombres no acreditan vínculo al inventario ni revisión. La salida distingue integridad verificada, vínculo al inventario no verificado y revisión pendiente. La aceptación requiere un registro externo referido a los bytes exactos de inventario, cita y decisión; esta función no certifica fiscalidad.

## Adquisición y almacenamiento

Solo HTTPS, puerto 443, sin credenciales ni fragmentos. La allowlist es de hosts exactos, no sufijos. Incluye BOE, AEAT, Seguridad Social, INE, Hacienda y los boletines autonómicos enumerados en DEFAULT_HOSTS; `--allow-host HOST` sustituye explícitamente la lista para adquirir otra fuente oficial. La autorización de un host exige revisión humana; el programa no infiere oficialidad por su nombre. Cada salto vuelve a pasar la política, conserva URL, estado y únicamente cabeceras de contenido/cache permitidas y limita la cadena a cinco saltos.

El lock de máquina y usuario es compatible con el helper padre. Hay dos segundos de espera tras cada intento y entre saltos. Tres intentos como máximo ante errores transitorios 429/500/502/503/504 y errores de transporte; espera exponencial o Retry-After numérico limitado a 30 segundos. No interpreta Retry-After con fecha HTTP. Timeout de socket de 30 segundos, presupuesto de lectura de 180 segundos comprobado entre lecturas parciales. Un bloqueo de lectura puede prolongarlo hasta el timeout de socket; la espera del lock no tiene plazo. No existe control global entre distintos usuarios o máquinas.

El cuerpo se lee por bloques de hasta 64 KiB, con límite de 64 MiB, comprobación de Content-Length y rechazo de cuerpos vacíos o codificación de transporte inesperada. Solo acepta 200 completo. PDF declarado por MIME o extensión debe empezar por `%PDF-`; así se rechazan páginas HTML de error servidas con 200. Esto no sustituye el análisis estructural que realiza MuPDF al citar. Los formatos HTML/JSON se preservan como originales, sin inventar una página PDF ni un recorte.

Estructura portable:

- `sha256/HASH`: bytes originales o PNG del recorte; SHA-512 adicional en el manifiesto del original.
- `urls/SHA256_URL.json`: último índice compatible con auditores antiguos.
- `history/SHA256_URL/SHA256_REGISTRO.json`: observaciones previas, incluida su hora y cabeceras.

Las escrituras de JSON usan reemplazo atómico. El historial conserva también índices antiguos antes de reemplazarlos. No es un registro firmado ni un almacén con retención inmutable; el propietario local puede alterarlo. Las cabeceras no prueban la identidad del emisor. `localPath` solo es compatibilidad local: se excluye de los manifiestos publicados y no se utiliza para resolver blobs.

`ingest` lee índices por URL y originales por hash; verifica SHA-256, SHA-512 y tamaño antes de copiar, y vuelve a verificar durante la copia. Nunca modifica el origen. Rechaza origen y destino idénticos. Conserva fechas HTTP del helper antiguo y marca redirecciones desconocidas como `null`. Una cadena legacy desconocida o un origen no incluido en la allowlist queda `sourcePolicy.status=pending`; preservar bytes no lo convierte en evidencia oficial aceptable. Una importación puede ver solo un subconjunto de índices si los auditores añaden otros simultáneamente; se repite para incorporar los siguientes. Un índice escrito parcialmente por el helper antiguo provoca fallo explícito: repetir después de que termine su escritura.

Una caché corrupta provoca error, nunca descarga silenciosa para ocultarlo. `--refresh` es explícito y conserva historial. `rebuild` exige el hash del manifiesto, reutiliza el original si ya existe o descarga y exige que coincida. Una URL mutable que ya no devuelve esos bytes hace fallar la reconstrucción. **Un manifiesto no recupera por sí solo una versión desaparecida.** Respaldar todo `sha256/` en almacenamiento local independiente; sin ese respaldo ni archivo externo no hay garantía de recuperación. La existencia de una caché local no acredita un respaldo externo.

## Citas, recortes y números

Página física 1-based; coordenadas PyMuPDF en puntos, origen superior izquierdo de la página sin rotar. Se conserva MediaBox, CropBox y rotación. Se rechazan cajas no finitas, invertidas, vacías o fuera del área visible. Se comprueba que CropBox esté dentro de MediaBox. Para renderizar se transforma la caja mediante `rotation_matrix`. Las pruebas incluyen desplazamiento de CropBox y rotación de 90 grados.

La [documentación de PyMuPDF](https://pymupdf.readthedocs.io/en/latest/page.html) distingue las coordenadas sin rotar de las de `Page.rect`. Se utilizan extracción `get_text('text', flags=0, sort=False)` y renderizado MuPDF RGB, 144 DPI, sin alpha ni anotaciones. El máximo es 20 millones de píxeles por recorte. La versión PyMuPDF/MuPDF y todos estos parámetros quedan en la cita; la verificación exige igualdad y SHA-256 del PNG regenerado. No se promete identidad de bytes entre versiones o plataformas distintas: conservar el entorno que generó el corpus. El PNG existente debe estar presente y sano; el verificador no lo repara ni escribe en el corpus.

La cita literal es la salida exacta de la capa de texto, incluidos saltos y espacios. Normalización: `identity`. Una región sin texto produce error de OCR requerido. No se ejecuta OCR ni se convierte una transcripción en cita verificada. El facsímil permite revisar errores de la propia capa de texto.

Se emiten TextQuoteSelector literal, FragmentSelector PDF con página y un selector propio para el rectángulo. No se disfraza la caja PyMuPDF de coordenadas `viewrect` de otro visor. Una fila/celda es una cita con su propia caja y `table: {row, column}`; para varias celdas se conservan varias citas. No se reconstruyen automáticamente tablas ni relaciones entre celdas. `corpus/bocm-celda.citation.json` demuestra una celda real con binding decimal, sin aceptar su uso fiscal.

Un binding señala posiciones `start/end` (índices Python Unicode), literal numérico, formato explícito `es-ES` o `decimal`, valor decimal canónico como cadena, posiciones y literal de unidad y código de unidad. Ejemplo de fragmento completo `Importe: 1.234,56 euros`:

```json
{
  "number": {"start": 9, "end": 17, "literal": "1.234,56"},
  "numberFormat": "es-ES",
  "value": "1234.56",
  "unit": {"start": 18, "end": 23, "literal": "euros"},
  "unitCode": "EUR"
}
```

No busca el primer número que coincida: verifica el span exacto y sus límites de token. `1.234,56` y `1234,56` representan el mismo Decimal bajo es-ES, pero sus literales no son intercambiables: cambiar la cita sin cambiar el original falla. Se rechazan separadores mal agrupados, substrings numéricos, NaN, cambios de valor o unidad y valores binarios float. Unidades iniciales soportadas: euros/€, %, años. Otras requieren ampliar el contrato y pruebas, no inferir una conversión. El cotejo de unidad no demuestra que una cabecera o nota se aplique a esa celda: revisión semántica separada obligatoria.

Fórmulas, condiciones, redondeo, vigencia y territorio no se deducen de encontrar números. `semanticValidation` e `independentReview` empiezan pendientes. La verificación del corpus no acepta datos fiscales ni modifica el motor.

## Autenticidad y archivo

`signature` ejecuta pdfsig con `-no-ocsp`, sin `-nocert` ni descarga AIA, guarda salida, versión, fecha, código y diagnósticos de firma/certificado. Distingue `unsigned`, `invalid`, `not-validated` y `trust-indeterminate`. La comprobación de revocación en red está desactivada para permitir pruebas offline. Firma válida criptográficamente no se eleva a confianza histórica válida: falta una política de anclas, revocación histórica y sellos cualificados. Timeout y herramienta ausente son no-validación, no ausencia de firma. El reporte conserva cobertura de rangos; no se acepta automáticamente una revisión incremental posterior. El análisis depende del formato de salida inglesa de Poppler, que las pruebas reales ejercitan.

Resultados reales conservados:

- BOE-A-2025-1, original: firma criptográfica válida; certificado caducado en la comprobación; confianza indeterminada. Fuente elegida para probar autenticidad, no para acreditar IRPF.
- BOCM-20221121-1, original fiscal de Madrid: firma criptográfica válida; certificado caducado; confianza indeterminada. Importado desde caché de auditor.
- BOE-A-2006-20764 consolidado: sin firmas. Importado desde caché de auditor. No se presume firma por el dominio BOE.

Poppler emitió además `NSS_Init failed: security library: bad database`; el diagnóstico se conserva. No se sustituye por una conclusión de confianza. La prueba altera un byte firmado de un PDF real que sigue abriéndose y exige `invalid`.

CSV/CVE: se conserva el identificador y el enlace realmente observado, con estado no validado. `csv MANIFEST --identifier ID --url URL` descarga un endpoint permitido y compara sus bytes con el original. Devuelve `byte-match` o `not-validated` y la evidencia de la respuesta. Eso prueba igualdad, no que el portal vincule legalmente ID y documento. No hay comprobación CSV ejecutada para los ejemplos ni adaptación de formularios/captcha; siguen pendientes. Publicación, ELI y fecha de consolidación se dejan pendientes cuando no se han contrastado; no se deducen de Last-Modified.

WARC sería útil para preservar las respuestas HTTP y enlaces de HTML. Se difiere la captura WARC: no están preservados todos los recursos ni el diálogo TLS, y no se presenta este CAS como un WARC. RFC3161 aportaría prueba temporal del hash emitida por una TSA; no probaría veracidad del contenido ni vigencia legal. No hay TSA configurada ni tokens inventados. El reloj local `retrievedAt` no es un sello de tiempo de confianza.

## Fixtures y CI propuesto

`corpus/fixtures/sha256/` contiene dos PDF oficiales originales íntegros y sus recortes: aproximadamente 1,3 MB en total. No se recortan los PDF originales, porque eso rompería firmas y hashes. El BOE de 2,2 MB queda fuera del subset offline; manifiesto y cita permiten su reconstrucción sujeta a disponibilidad del hash. Los manuales grandes importados solo están en `.cache`.

CI integrada en un job separado de 15 minutos con el mismo flake y uv.lock: ejecutar `run.sh tests/procedencia-corpus_test.py -v` y Ruff con un worker; comprobar manifiestos y citas de todo el corpus promovido con `verify`; la aceptación fiscal permanece deshabilitada. `test:lint` verifica las 16 reglas anti-slop a error. Oxlint/ESLint no analizan Python: el intento focalizado de oxlint informa «No files found» y ESLint ignora el archivo; no se cuentan como validación de estas fuentes. Ruff y pruebas verifican Python. El typecheck existente del proyecto también pasó. El integrador debe mantener anti-slop sobre cualquier adaptador TypeScript que añada.

<a id="integración-del-orquestador"></a>

## Controles de integración

Las correcciones COR-01–08 incorporan puerta cerrada de aceptación, filtro de cabeceras en retornos e historial, comprobación de identidad URL y cadena, signos Unicode, schemas cerrados, PNG atómico, entorno fijado y hosts explícitos. Las regresiones reproducen aceptación inventada, omisión de signo y documento abierto. La correspondencia con el motor y la revisión fiscal requieren comprobaciones externas a este pipeline.
