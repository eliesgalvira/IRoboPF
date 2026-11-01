# Revisión técnica de la canalización

**Dictamen: piloto reproducible; resolver RP01 y RP07 y fijar obligaciones independientes (RP02) antes de repartir tablas como cotejo garantizado.** No se modificó producto ni se acepta ningún ejercicio completo. La igualdad comprobada es numérica y limitada al campo efectivo mapeado; no acredita condiciones jurídicas ni selección efectiva por el cálculo.

Base revisada: `fb37c6f03eb35bc826148bc8ab2dc057d277cad6`. El manifiesto histórico corresponde exclusivamente a `67f56a147c04db2e5fb11b7ebc2e88a337b12ac1`, no al HEAD revisado. Se reconstruyeron exactamente sus 392 artefactos con el código final de flujo `04b77e0c2d594957db861b05b1781869382d7eba324f195cff931125afe29ce6`. También se generó y verificó un manifiesto nuevo sobre la base revisada, con los originales exactos y destino externo.

## Evidencia y límites

Se contrastaron independientemente las 277 celdas: palabras contenidas y cajas PDF, literales, normalización decimal, posiciones JSON, ejercicio/periodo INE y unidades. Se evaluaron los 87 bindings contra las páginas del inventario histórico, sin tomar importes esperados del generador. La cola es exactamente el filtro de los 190 resultados distintos de `match`: 189 sin comparación y una ausencia. Resultado histórico y actual: 87 coincidencias, ninguna diferencia, 189 sin comparación y una ausencia. Esto no demuestra exhaustividad de obligaciones.

| Caso | Original SHA256 / posición | Conclusión |
| --- | --- | --- |
| Escalas 2014, 52 celdas | `1e86619d8084b78546299fb64dd40721b373197884ed946d3e2d959b8b6292ea`, páginas físicas 467–468 (impresas 449–450) | 50 bindings iguales; dos tramos abiertos sin comparación. Cabeceras distinguen euros y porcentaje. |
| Discapacidad 2014, 9 celdas | Mismo original, página física 452 (impresa 434) | Ocho bindings iguales. El literal `----` de asistencia es ausencia, no cero; cabeceras y párrafo identifican importes anuales. |
| Escala y mínimos 2025, 39 celdas | `02c6e8300a7f56c8c24aa947d4c39c5657c9a9eda6f5d727d44b4112d7de15d4`, páginas físicas 1120 y 1094 | 29 bindings iguales y diez sin comparación. La unidad se revisó contra cabeceras; las condiciones y sujetos siguen fuera del cotejo numérico. |
| INE, 177 celdas | `c94efbe5606cc9d14ff09436a486b117acb2905c3da4f51d415e2d180ca841dd`, `/Data/0/Valor` a `/Data/176/Valor`, rangos textuales conservados | Índices mensuales de IPC290751, unidad 133 y escala 1. No son variaciones anuales cotejadas. |

El censo histórico tiene 57 módulos y 116.170 rutas; el actual, 57 y 134.360. Una enumeración independiente de exports y recorrido de valores confirmó 116.167 y 134.357 hojas de datos respectivamente; cada censo conserva además tres funciones auxiliares. Se comprobaron hashes de módulos, exports y valores efectivos. Los aliases son ocurrencias, no conceptos únicos. Las clasificaciones, unidades inferidas y vigencias no se convierten por ello en semántica fiscal validada.

El catálogo conserva 519 fuentes: 79 con bytes verificados y 440 ausentes en las raíces de lectura. Ausencia local no es inaccesibilidad oficial. No se repitieron búsquedas oficiales ni se adquirieron nuevos originales; las fechas y búsquedas narradas en el informe previo siguen siendo afirmaciones de ese corte.

Las seis cuotas estatales de 2025 son `0`, `1182.75`, `2112.75`, `4362.75`, `8950.75` y `62950.75`. Una búsqueda de los cinco importes no nulos en **todas** las hojas numéricas efectivas del inventario fijado no produjo candidatos; cero sí existe en cuotas de ahorro y Madrid, que no acreditan esa escala estatal. La conclusión es falta de binding en ese inventario, no inexistencia en cualquier export o cálculo del motor. Debe completarse el inventario fuera de los módulos/exports admitidos antes de declarar ausencia general. No se reconstruyen cuotas integrando tipos.

## Decisiones por ID

| ID | Prioridad / decisión | Evidencia reproducible y acción necesaria |
| --- | --- | --- |
| RP01 | P1, deficiencia de unidad | Cambiar coherentemente EUR a porcentaje en mapping y extracción sigue dando `match`: el binding no aporta unidad comprobable. `casos.py`, prueba RP01; rojo en `regresiones.py`. Exigir evidencia de cabecera y unidad del campo/operación, no solo etiquetas iguales. |
| RP02 | P1, cobertura condicionada | Eliminar la obligación del mapping y su extracción deja resultado vacío válido. `casos.py`, RP02. La cobertura exacta actual es relativa al mapping recibido. Fijar una lista revisada de filas/columnas/obligaciones independiente del extractor, incluido un control de eliminaciones entre versiones. |
| RP03 | P2, límite de API | `compare` acepta documento/página alterados conservando igualdad numérica, RP03. No es un bypass probado de `--verify`: este reconstruye artefactos. Documentar/prevenir el uso de `compare` aislado como autenticación de citas. |
| RP04 | P2, ausencia ambigua | Una caja vacía produce `extraction-absent`, RP04. La ausencia real del piloto contiene `----`; distinguir blanco por recorte equivocado de trazo explícito, sin convertir ninguno en cero. |
| RP05 | P2, selector JSON incorrecto | Una fila etiquetada `999` extrae el primer dato pero cita `/Data/999/Valor`, RP05. Validar correspondencia de fila con índice y existencia/valor del JSON Pointer. Los 177 selectores originales sí se comprobaron. |
| RP06 | Control favorable acotado | Una mutación del valor efectivo cambia `match` a `difference`, RP06. Las pruebas existentes rechazan cambios aislados de unidad, caja, normalización, ejercicio, duplicados y extracción incompleta. No basta para RP01/RP02 coherentes. |
| RP07 | P1, signo externo ignorado | PDF sintético con `12` y guion derecho próximo: caja `[48,35,64,54]`, guion en `(66,50)`, sigue dando `match`. `casos.py`, RP07; rojo en `regresiones.py`. El detector solo mira signos a la izquierda. Rechazar signos ambiguos próximos en ambas direcciones antes de normalizar. No se demostró este defecto en los originales del piloto. |
| RP08 | P2, huella de dependencias incompleta | `run().codeInputs` fija tres archivos del directorio de datos. El inventario fija sus propios generadores, pero no quedan identificados directamente `corpus.py`, `cas.py` y `descargar.py`, ni la versión realmente cargada de PyMuPDF en una invocación directa. Ampliar la huella de ejecución; la reconstrucción exacta observada no elimina este límite. |
| RP09 | P2, alcance de “no representado” | Restringir esa expresión al inventario/export comprobado. Revisar exports adicionales antes de ampliar la afirmación del contrato/informe a todo el motor. |

## Validación y siguiente paso

Se conservaron las seis pruebas del padre. Los siete casos adversos pasan porque documentan el comportamiento actual; **dos regresiones estrictas siguen rojas**, sin `skip`, `expectedFailure` ni correcciones de producto. El primer error de resolución JavaScript fue de arnés y se corrigió con rutas externas privadas. Ruff y MyPy pasan; el lint de `censo.mjs` pasa con las 16 reglas conservadas (un testigo privado infractor confirma que el plugin se ejecuta). La comprobación JavaScript, con resolución externa corregida y opciones ESNext/Bundler, conserva cinco errores TS2339 en `inventario-ast.mjs` (líneas 49, 81, 181 y dos en 197); no quedan errores propios de `censo.mjs`. No se altera configuración del proyecto para ocultarlos.

Reproducción con dependencias ya disponibles, cachés y temporales externos:

```sh
uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 \
  python tools/procedencia/datos/tests/test_flujo.py
uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 \
  python docs/procedencia/datos-2012-2026/revision-canalizacion/casos.py
# Rojo esperado hasta resolver RP01 y RP07:
uv run --no-project --with pymupdf==1.26.7 --with jsonschema==4.25.1 \
  python docs/procedencia/datos-2012-2026/revision-canalizacion/regresiones.py
# Generación y reconstrucción: variables externas y raíces del contrato.
bash tools/procedencia/datos/ejecutar.sh
bash tools/procedencia/datos/ejecutar.sh --verify "$DATOS_OUTPUT"
```

Para ampliar A: primero resolver signos y procedencia de unidades y fijar las obligaciones de cada tabla; después validar selectores y ausencias, completar huellas y búsqueda de exports, y repartir lotes con esos controles. Retenciones requiere versiones intranuales del algoritmo, SS fuentes TGSS e IPC la medida anual correcta. Esta revisión no introduce compatibilidad heredada ni un segundo motor, ni sustituye búsquedas pendientes por aceptación global.
