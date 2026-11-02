# Revisión de las correcciones del extractor

**Resultado: RP07 sigue abierto (P1).** No se recomienda dar por garantizado el tratamiento de signos. Se reproduce un defecto de extracción sintético; no se atribuye una discrepancia financiera a los originales del piloto. No se modifica producto ni se emite aceptación fiscal. A completo continúa abierto.

HEAD revisado: `2e7ed76b34bedcaa4c9b04462dfbe5647d05ffd1`. Los nueve archivos del candidato coinciden con su payload. El cotejo físico de este HEAD abarca 15.501 entradas, incluidos enlaces como enlaces; las 15.498 citadas por el autor corresponden a su base anterior.

## Hallazgo nuevo

`pdf_table`, en `tools/procedencia/datos/flujo.py`, compara la coordenada superior de las cajas con tolerancia menor de 2 puntos. No considera adecuadamente tamaño de fuente y solapamiento vertical. Con `12` en `(50,50)`, fuente 11, caja `[48,35,64,54]`, un signo ASCII externo en `(40,50)` o `(66,50)`, fuente 8, comparte línea base y queda a menos de 12 puntos horizontales, pero se ignora: el resultado es `12`. También se ignora con fuente 11 y línea base 53, cuyas cajas se solapan verticalmente. Positivo/negativo y ambos lados producen ocho fallos estrictos. El signo izquierdo negativo ofrece un contraejemplo inequívoco; el derecho exige rechazo por ambigüedad, sin inferir una convención contable.

Acción necesaria: definir proximidad por geometría y línea de texto, cubrir fuentes distintas y desplazamientos verticales, manteniendo los signos interiores y sin rechazar signos de otras filas o columnas distantes. No se propone aquí un umbral como solución fiscal universal. `regresiones.py` conserva el rojo sin skips ni expectativas adaptadas al defecto.

## Decisiones acotadas

| ID | Decisión y evidencia |
| --- | --- |
| RP01 | Corrección sostenida en el piloto. Reabiertas ocho cabeceras de escalas 2014 y los metadatos INE por hash. Las 39 pruebas de campo corresponden a las dos constantes, índices válidos y campos `baseInferior`, `cuota`, `tipo`; interfaz, orden de tupla y construcción Decimal distinguen EUR/fracción. Operaciones mixtas y porcentajes anidados sin unidad compatible no acreditan unidad. Los tres cuadros restantes continúan sin unidad probada: ninguna igualdad los rehabilita. |
| RP02 | Registro fijo sostenido para estas 277 obligaciones: cotejo de todas sus posiciones/unidades/documentos con extracción histórica preservada y originales, sin derivarlo de la salida nueva. Se rechazan individualmente 277 omisiones y 277 cambios de unidad frente al registro. `run` fija su hash; la API directa necesita un registro independiente confiable aportado por quien llama. Modificar código y registro exige revisión nueva. |
| RP03 | Documento/página se cotejan; no se eleva `compare` a autenticador. Geometría, palabras y selectores requieren reextracción mediante `run/--verify`. La reproducción completa observada acredita solo ese conjunto fijado. |
| RP04 | Se mantiene la distinción entre caja vacía (error), trazo explícito (ausencia) y cero. No hay defecto nuevo demostrado en los originales; la ausencia del piloto no pasa a cero. |
| RP05 | Índice canónico y rangos estructurales sostenidos. Adverso nuevo con valores repetidos y claves escapadas `a/b` y `~x` conserva tres rangos distintos. `compare` aislado conserva su límite de autenticación. |
| RP06 | Se conserva el discriminante existente de mutación del valor efectivo. Sin ampliación de aceptación. |
| RP07 | **P1 abierto:** dos pruebas nuevas, ocho subcasos rojos por tamaño de fuente/solapamiento vertical. Los controles anteriores pasan; no cubrían esta geometría. |
| RP08 | Huellas ampliadas y reproducción exacta observadas en el contexto fijado. El primer intento con resolución distinta y raíces CAS incompletas fue rechazado correctamente; se conservan sus diferencias. La reproducción final sin Git usa dependencias congeladas y originales explícitos, sin cambiar el manifiesto esperado. No demuestra equivalencia en cualquier entorno. |
| RP09 | Redacción limitada correctamente a exports admitidos e inventario revisado. No se amplía a todos los cálculos. Ausencia local de bytes no significa inaccesibilidad oficial. |

## Reproducción y límites

El manifiesto del autor declara base `7a91219490ab8daaa3f9a19275c168bafc3e5668`. Se reprodujo con **esa base declarada**, sobre los bytes candidatos de HEAD, en exportación sin Git: igualdad de bytes del manifiesto completo original, sin alterar expectativas. El HEAD de integración y ESTADO son metadatos adicionales; no se presentan como cambios numéricos ni se confunden con esa base. Se verificaron y preservaron las 404 referencias de artefactos y 79 originales con hashes y tamaños.

Piloto: 277 celdas, 50 `match`, 226 `not-verifiable` y una `extraction-absent`. Las 37 igualdades retiradas quedan sin verificación de unidad; no son diferencias nuevas. Catálogo: 79 fuentes con bytes y 440 ausentes localmente. No se amplían tablas ni se sustituyen condiciones jurídicas por igualdad aritmética.

Pasan las 18 pruebas del autor, sus dos controles estrictos y cuatro pruebas independientes. Las dos pruebas estrictas nuevas fallan en ocho subcasos y se conservan separadas. Los casos históricos que esperaban carencias anteriores permanecen intactos; ya no son criterios de éxito del candidato. Ruff y MyPy del flujo pasan. Lint mantiene las 16 reglas. CheckJs mantiene cinco TS2339 compartidos: `parseDiagnostics` (49), `body` (81), `modifiers` (181), `name` dos veces (197), todos en `inventario-ast.mjs`: accesos no acreditados por los tipos de TypeScript. No se cambia ese archivo ni se ocultan errores. No se repite CI global: la pasada completa corresponde al padre.

Pruebas ordinarias, sin CAS, archivos privados ni historia Git:

```sh
uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 python docs/procedencia/datos-2012-2026/revision-correcciones/casos.py
# Rojo requerido hasta corregir RP07:
uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 python docs/procedencia/datos-2012-2026/revision-correcciones/regresiones.py
```

La entrega privada incluye originales/CAS, logs fallidos y finales, diferencias de contexto, payload completo, patch POSIX, hashes antes/después, inventario de archivos únicos y reconstrucción física sin Git. La recepción e integración corresponden al padre; esta revisión no cierra A.
