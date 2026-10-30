# Rechazo de extracción incompleta, ENV2-01

La verificación de integración reproduce y corrige el nuevo hallazgo de la revisión enlaces-v2. El PDF sintético conservado por el revisor extrae un carácter U+FFFD entre un signo y el importe. Seleccionar únicamente los dígitos permitía enlazar +8,50 aunque la extracción no acreditaba que el número fuese positivo.

Antes del cambio fallan dos pruebas con cinco comprobaciones: cuatro cadenas, incluyendo sustitución después del número y en otra línea, y una cita extraída del PDF adversarial real. El log está en `antes.log`. Después pasan las 24 pruebas de corpus. Ruff pasa. La prueba PDF comprueba también que U+FFFD sigue presente: no puede volverse verde porque una biblioteca lo haya eliminado silenciosamente.

Decisión: una cita con U+FFFD puede conservarse como evidencia de extracción pendiente, pero no admite binding numérico. No se normaliza a espacio ni se infiere un signo. Se rechaza toda la cita, no solo el carácter inmediatamente vecino; el coste es exigir recortes más precisos o revisión de extracciones defectuosas. Es preferible ese pendiente a atribuir precisión a información perdida.

La revisión original y sus 25 archivos se conservaron sin cambios y se verificaron contra su manifiesto. ENV1-01/02/03 quedan rechazados para sus reproducciones originales. La nueva atestación candidata de Madrid se refiere al payload `3937b0c9561305de45755a52fa36c48fb8cfd8f75befb7294f0f2a800839d48b`; no se traslada al siguiente inventario. El cambio no acredita autenticidad histórica ni una regla fiscal completa.

Reproducción: `bash tools/procedencia/run.sh tests/procedencia-corpus_test.py`. El fixture sintético está en `docs/procedencia/revisiones/enlaces-v2/tab.pdf`; no se presenta como fuente oficial.
