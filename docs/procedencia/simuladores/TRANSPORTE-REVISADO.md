# Transporte oficial: contraste de las cinco correcciones

El contraste independiente del 4 de noviembre de 2026 es **favorable dentro
del alcance F1–F5**. No reproduce defectos bloqueantes de esos cinco hallazgos.
Permite preparar la integración y una ampliación pequeña controlada. No acredita
todavía la conexión con el motor vigente ni la comparación masiva.

| Hallazgo | Corrección contrastada |
| --- | --- |
| F1 · Ámbito SES | Ejercicio y titular explícitos, ámbito jerárquico, registros completos, tipos conocidos y rechazo de duplicados. Los fragmentos históricos admitidos son explícitos |
| F2 · Cobertura | Comparación completa dentro del perfil, incompleta o discrepante; la ausencia de diferencias no basta para aceptar. Cobertura vacía devuelve error |
| F3 · Reutilización y CAS | Identidad de código, entorno, plantilla y política; integridad y cotejo repetidos antes de reutilizar. Escritura completa y verificación de objetos existentes |
| F4 · Escritura interrumpida | Recuperación del último sufijo incompleto conservando sus bytes; corrupción intermedia rechazada. El último estado manda y un resultado huérfano no equivale a aceptación |
| F5 · PDF y aceptación | Año, casillas obligatorias y todas las ocurrencias cotejados con SES antes de aceptar. Evidencias corruptas, incompletas o contradictorias se rechazan |

La revisión ejecutó **65 expectativas propias**, todas correctas, y los
**21 métodos de regresión** del candidato. Una extracción independiente de
SES y PDF confirmó las 16 capturas conservadas y un recibo nuevo del piloto.
Son pruebas técnicas y capturas, no 65 declaraciones ni cobertura normativa
de todos los ejercicios. Se comprobaron los 993 objetos CAS y 17 originales
previos; las recepciones permanecieron intactas.

El piloto nuevo aporta bruto 17.000,41, cotizaciones 1.000 y retención 1.000:
Open 2025 devuelve −721,23. Quedan fijados reglas N000088955, modelo 0.12 y
versión visible 1.19. Un intento anterior falló al abrir un diálogo y no se
aceptó; se conserva su error. La repetición posterior reutiliza evidencia
histórica tras verificarla, sin atribuirle frescura del servidor. El journal
global conserva aquel intento fallido y no se presenta como totalmente verde.

Las entregas completas, parches, originales y logs permanecen en el respaldo
privado. El manifiesto del contraste tiene SHA-256
`778025ac32926bf8da664b3535b34934c2900b4fcb4f74401a92cfef43be3391`.
El orquestador comprueba sus archivos y parche antes de integrar. El informe
de revisión no se reescribe para ampliar su dictamen a código posterior.

Faltan integración reproducible, vínculo entre entrada oficial y entrada de
la API, proyección de seis componentes de cuota y revisión de esa conexión.
La admisión completa de las plantillas, 2017 y PADRE permanecen pendientes.
Los siete ejemplos históricos de 2018–2024 no acreditan esos ejercicios en la
API actual. Los selectores de la interfaz oficial pueden fallar; el lote se
detiene ante ese fallo y no lo clasifica como discrepancia fiscal.
