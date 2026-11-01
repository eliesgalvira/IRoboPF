# Contraste independiente: destinos Markdown completos

**Favorable para el fix `9ff7637b31745ffe602b4f25741e9faaeb87537b`: corrige los cuatro contraejemplos de recorte y conserva el corpus.** Queda una observación documental menor, D01, reproducida abajo. No se modifica producto ni se propone otra revisión de los aspectos favorables. El resultado no acepta fiscalmente los 351 dictámenes ni reabre E o la fecha nula normativa.

Base comprobada: `fb37c6f03eb35bc826148bc8ab2dc057d277cad6`. Los cinco archivos del fix coinciden con sus bytes en esa base. Anterior rojo: `d1978f48dde2524c1ea19bf78c3e205f1f86d440`, exportado a scratch sin checkout. Evidencia original de código, SHA-256 de `scripts/procedencia/deducciones-2025/verificar.py`: anterior `2ec559ccc3d964d70f8a414b0e78576a75f6eda938be616a0eb080c9ac37a6f1`; actual `b170ee0943c8a785adf2d932dd8e4fb87a1bb5fd951e7333b776a1c2f6b91f78`. Posiciones actuales: líneas 58–70 (destinos CommonMark), 80–85 (URL textual entera y destino), 17 y 23 (parser y configuración).

## Decisiones por ID

Los cuatro casos originales se conservan en [casos anteriores](../privacidad-markdown/casos.py); su [control sintáctico](../privacidad-markdown/sintaxis.py) confirma los destinos con `markdown-it-py==4.0.0`, modo CommonMark.

| ID | Base roja | Fix actual | Decisión |
| --- | --- | --- | --- |
| limite-0-angular | Admite | Rechaza | Corregido |
| limite-1-angular | Admite | Rechaza | Corregido |
| limite-0-escapado | Admite | Rechaza | Corregido |
| limite-1-escapado | Admite | Rechaza | Corregido |
| M-* | 39 fallos entre los 84 casos nuevos | Sin fallos | Destinos discriminantes protegidos |
| C-* | Controles y fragmento sensible distinguidos | Sin fallos | Conserva decisiones esperadas |
| D01 | Comando documental incompleto | Falla antes de ejecutar pruebas | Observación menor; corregir comando |

La anterior revisión acreditó tres regresiones y una variante residual; no son cuatro defectos distintos. En este contraste se reproducen primero los cuatro fallos sobre los bytes rojos y después sus cuatro rechazos actuales. Pasan las 53 regresiones recibidas (métodos más subtests), los 36 casos anteriores completos y los [84 casos nuevos](casos.py). Estos últimos incluyen entidades decimales/hexadecimales, separadores y nombres codificados, referencias completas/cortas/colapsadas, imágenes directas y por referencia, escapes y nombres vacíos. Se contrasta cada destino con CommonMark antes de probar el paquete completo. Los controles distinguen nombres de valores, fragmentos, escapes no reconocidos y codificación simple de doble codificación; no exigen decodificar arbitrariamente una URL repetidas veces.

Los rechazos sintéticos solo aceptan dos mensajes cerrados: `URL con credenciales` y `URL pública inválida: credenciales`. Se comprueban también valores marcadores y usuario/contraseña sintéticos: ningún diagnóstico aceptado contiene su destino ni su valor. No se ha encontrado una credencial real.

## Lanzador, corpus y observación documental

El lanzador fija ambas versiones: `jsonschema==4.26.0` y `markdown-it-py==4.0.0`. Ejecutado en modo completo con CAS externo explícito devuelve 351 recibidas, ningún pendiente e `integridadBytes: comprobada`; mantiene `estadoRevision: candidato` y `vigenciaJuridica: requiere_revision_independiente`. Es comprobación estructural y de bytes, sin nueva aceptación normativa.

**D01, severidad baja.** `contrato/README.md`, línea 32, conserva un comando con solo `--with jsonschema==4.26.0`. En un entorno uv aislado falla con `ModuleNotFoundError: No module named 'markdown_it'`. Evidencia SHA-256 del README: `1801d6894a4ff5355db3ae7b0bdcc7acb58133240c97cdda8f456b07e53f30aa`. La declaración de dependencias del módulo importado no abastece el entorno del script de regresiones. Añadir al comando `--with markdown-it-py==4.0.0` resuelve el fallo: las 53 pruebas pasan. Es una instrucción de reproducción incompleta, no un rojo de privacidad ni un fallo del lanzador. Se entrega al integrador sin editar archivos fuera del ámbito.

## Reproducción y límites

Desde la raíz, con `REVIEW_TMP`, `UV_CACHE_DIR` y `UV_PROJECT_ENVIRONMENT` en directorios privados externos existentes y `PYTHONDONTWRITEBYTECODE=1`:

```sh
uv run --no-project --python python3 --no-managed-python --with jsonschema==4.26.0 --with markdown-it-py==4.0.0 python docs/procedencia/deducciones-2025/revisiones/markdown-completo/casos.py
uv run --no-project --python python3 --no-managed-python --with jsonschema==4.26.0 --with markdown-it-py==4.0.0 python docs/procedencia/deducciones-2025/contrato/regresiones.py
node scripts/procedencia/deducciones-2025/verificar.mjs --lotes docs/procedencia/deducciones-2025/lotes --modo completo --cas "$CAS_EXTERNO" --formato sha256
```

El primer script acepta como argumento opcional el verificador anterior exportado junto a su schema; conserva 39 rojos sobre esa versión. No escribe fixtures en el repositorio ni descarga originales.

Ruff sobre el nuevo Python, sintaxis Node, las 16 reglas configuradas de Oxlint sobre el lanzador y tipos de esas reglas pasan. ESLint pasa con aviso del arnés por ausencia de directorio `pages` en el scratch mínimo. No se han desactivado reglas ni cambiado configuraciones. No se ejecutan build ni suites legacy: no aportan cobertura a este cambio Python/Markdown. El contraste se limita al filtro HTTP(S), CommonMark y los escenarios descritos; no afirma cobertura de HTML arbitrario u otros lenguajes ni oficialidad o corrección fiscal de las URL.

Entrega pública: este informe y la prueba sintética. Inventarios físicos, rojos, logs, patch contra la base exigida, manifiesto y ensayo exacto de aplicación se conservan en la entrega privada. Pendiente del integrador: D01 e integración de estos dos archivos; no queda trabajo interno de revisión de producto.
