# Revisión independiente de geometría RP07

**Dictamen favorable acotado: los ocho contraejemplos RP07 quedan corregidos.** No se ha encontrado un defecto nuevo en el alcance ensayado. No hay aceptación fiscal ni cierre del bloque A. No se requiere otra revisión de este mismo alcance sin cambios o un defecto reproducible nuevo.

Base revisada: `d1e5411b3be72e4d11f35cd4b1b1e5e629d8ed48`. Contraste anterior: `39b29c55474f57b296a10654ae44350c8294b501`, únicamente para `tools/procedencia/datos/flujo.py`. La diferencia entre ambos archivos se limita a la guarda geométrica. Se cotejaron físicamente las 15.509 entradas versionadas de la base, incluidos enlaces como enlaces. Esta entrega solo añade este informe y `casos.py`; no modifica producto ni expectativas anteriores.

## Evidencia y decisiones

| Comprobación | Resultado |
| --- | --- |
| Ocho originales de `revision-correcciones/regresiones.py`, sin alterar | Antes: ocho fallos por ausencia del error exigido. Después: ocho rechazos por signo. Sin errores de ejecución ni omisiones. |
| 96 casos PDF propios: Courier, Times Roman y Helvetica Bold; tamaños 5, 9, 15 y 23; signos `+`/`-` | 48 signos externos próximos rechazados; 48 controles de otra fila o columna distante conservan `1.234,56` → `1234.56`. |
| Dos PDF con signo incluido como palabra separada y otra fuente | `- 1.234,56` → `-1234.56`; `+ 1.234,56` → `1234.56`. Sin inferencia del signo externo. |
| 200 combinaciones de cajas sintéticas exactas | Ambos lados, cinco glifos reconocidos (`+`, `-`, `−`, `–`, `—`), separación 0/11,999/12/12,001 y solapamiento 0/4,999/5/5,001/10. Se distingue correctamente `<12` de `>=12` y `>= media altura` de menor solapamiento. |
| Una selección de varias palabras con signo alto parcialmente solapado | Rechazo por proximidad a una palabra individual; no se diluye el solapamiento usando la altura total de la selección. |
| Contraste diferencial de los 299 casos propios | 190 salidas admitidas idénticas en bytes de la celda completa serializada, antes/después; 109 rechazos candidatos, de los cuales 84 antes se admitían y 25 ya se rechazaban. |

Pasan cuatro métodos propios con 299 comprobaciones. Los 200 casos de cajas exactas y el caso por palabra aíslan la lógica con dobles de página: no acreditan que un motor PDF produzca esos glifos/cajas. Los otros 98 usan PDF generado y PyMuPDF real. No se han repetido unidades/cobertura, CI global ni la reextracción real de 277 celdas; los datos del padre no sustituyen aquí pruebas propias. La invariancia observada se limita a los 190 controles admitidos.

## Contrato y límites

La implementación evalúa cada palabra seleccionada: altura menor positiva, solapamiento de al menos su mitad y distancia horizontal menor de 12 puntos. Rechaza, sin elegir signo ni convención contable. La sección «Signos externos y geometría» de `CORRECCIONES-RP.md` describe honestamente esos límites y exige incluir el signo del valor en la caja o revisar el original ante ambigüedad.

La guarda reconoce palabras que consisten exactamente en uno de esos cinco glifos. No garantiza asociación semántica de signos, lectura de trazos vectoriales, cualquier tokenización, rotación o maquetación. Un signo de otra celda dentro del umbral también puede provocar rechazo conservador; un signo fuera del umbral no queda asociado automáticamente al importe. Son límites del criterio declarado, no discrepancias fiscales demostradas ni una nueva objeción bloqueante a este arreglo.

## Reproducción ordinaria

Desde la raíz, con Python y uv (usar el entorno de desarrollo del proyecto si hace falta):

```sh
uv run --no-project --python python3 --with pymupdf==1.26.7 --with jsonschema==4.25.1 python docs/procedencia/datos-2012-2026/revision-correcciones/regresiones.py
uv run --no-project --python python3 --with pymupdf==1.26.7 --with jsonschema==4.25.1 python docs/procedencia/datos-2012-2026/revision-geometria/casos.py
```

Las pruebas ordinarias generan fixtures pequeños sin CAS privado, historial Git ni rutas privadas. La entrega privada conserva la versión anterior, los ocho rojos, los contrastes finales, el fallo inicial del arnés diferencial (dobles no aplicados a ambos módulos, corregido únicamente en el arnés), payload, patch POSIX, manifiestos y ensayo de reconstrucción sin Git. No se cambia la API.
