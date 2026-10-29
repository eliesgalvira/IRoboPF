# Estado de la auditoría documental

Inicio: 29 de octubre de 2026. Trabajo en curso; no es una certificación fiscal.

## Encargo y límites

Auditar todos los parámetros y pasos de IRPF, cotizaciones, retenciones e IPC de 2012–2026 contra fuentes primarias oficiales. Inventariar también las lagunas de cobertura territorial y material. Construir corpus por contenido, citas con coordenadas y facsímiles reproducibles, verificador, contratos de páginas y enlaces desde los rastros. Sin rediseño, despliegue, PR ni modificaciones de producción.

Se trabaja con Jujutsu en `procedencia-documental`, nacida de `main` local (`955a7ece`). El hilo previo solo dejó un cambio vacío (`db6c3ba5`), sin implementación que recuperar. Se respalda exclusivamente este bookmark en origin.

## Secuencia de trabajo

1. Leer contexto, preparar anti-slop y fijar contrato del inventario.
2. Abrir auditorías independientes por dominio y período. Descargar originales y registrar discrepancias candidatas.
3. Diseñar e implementar corpus, verificación de autenticidad, citas y facsímiles; ADR de arquitectura.
4. Contrarrevisar cada hallazgo con un auditor independiente. Los errores confirmados se corrigen después de una prueba que falle.
5. Integrar evidencia, documentación española por elemento y enlaces desde el motor. Ampliar deducciones cuando haya evidencia y pruebas; evaluar actividades económicas como dominio propio.
6. Comparar con Python y Excel, ejecutar verificadores y comprobaciones del proyecto. Revisión adversarial final por agentes nuevos.
7. Resumen final con cobertura medida y pendientes explícitos, respaldo remoto y limpieza autorizada de copias temporales.

## Estado actual

- BRIEF leído íntegro; README, instrucciones, producto, ADR y glosario fiscal revisados.
- GLOSSARY, documentación extensa, notas arquitectónicas y motor: lectura por ámbitos pendiente de completar.
- Configuración del orquestador comprobada: gpt-6-astra, xhigh, priority. Hijos: gpt-6-astra, high, priority, mediante T3.
- Herramientas faltantes se habilitan con Nix; ninguna instalación global.
- Anti-slop instalado: 16 reglas a error, prueba de carga superada. Bootstrap listo para iniciar auditorías documentales y repartir deuda de lint; el lint global sigue rojo (96 errores en 25 archivos). Véase [LINT.md](LINT.md).
- Primera ronda preparada según COORDINACION.md: inventario, corpus, deuda de lint, arquitectura, necesidades expertas y trece lotes documentales. Los identificadores de delegación se guardarán en delegaciones.json. Cero hallazgos aceptados, cero cifras declaradas verificadas.

## Criterios de aceptación

- Coincidencia con una transcripción Markdown o con el oracle legacy no acredita legalidad.
- Toda afirmación aceptada requiere fuente primaria y segunda revisión independiente identificada.
- Distinguir dato observado, proyección, simplificación legacy, supuesto de escenario y regla legal vigente. No atribuir carácter oficial a un ejercicio todavía incompleto.
- Una cita sin original, hash, coordenadas, texto verificable y facsímil permanece incompleta.
- Registrar cobertura por año, territorio, dominio y estado; no esconder lo pendiente detrás de un porcentaje agregado.
- No añadir datos personales de terceros ni copiar las notas privadas al repositorio.

## Recursos y coordinación

Máquina con 11 GB de RAM y sin swap. Máximo tres trabajos pesados simultáneos; comprobar memoria antes de cada lote. Un solo build completo a la vez. Hijos editores simultáneos en checkouts aislados gestionados por T3; integración por el orquestador. Ningún hijo abre PR, despliega o empuja a main.

Las finalizaciones de T3 reactivan el hilo. Una espera entre lotes no significa que el encargo haya terminado. El registro de delegaciones se mantendrá en esta carpeta.

## Preguntas y decisiones pendientes

No hace falta respuesta para empezar. Se documentarán decisiones y alternativas descartadas en DECISIONES.md. No se amplía artificialmente la cobertura fiscal antes de acreditar las reglas existentes.

## Limpieza

Todavía no se ha eliminado ninguna copia temporal. La eliminación de `/home/elies/irobopf-contexto/` y `/home/elies/Repos/Reactivity/` solo procede después del resumen final y su respaldo remoto, según el encargo. Conservar el repositorio local de Effect.

## Bootstrap anti-slop completado

Runtime v0.1.2 verificado, incorporado con licencia y hashes, 16 reglas a error y oxlint 1.78.0 junto a ESLint. CI nueva con límite de 15 minutos y ejecución secuencial, sin build ni suite legacy pesada. Typecheck, humo del plugin y 5 pruebas seleccionadas pasan; ESLint pasa. Lint global falla con 96 errores preexistentes en 25 archivos, registrados en [LINT.md](LINT.md) y `lint/`. No se modificó el motor ni se validó cifra fiscal alguna. Auditoría documental desbloqueada; corrección de deuda pendiente de reparto por archivo. Integración y respaldo corresponden al orquestador. No se borró contexto ni Reactivity.

El orquestador revisó la configuración y volvió a ejecutar `test:lint`: correcto. Bootstrap y coordinación respaldados en `origin/procedencia-documental` (885e16c7). Se probó la adquisición del PDF consolidado BOE-A-2006-20764: HTTP 200, 1.175.521 bytes, SHA-256 `67c8af922fe823337e0130d589cf5d51b364720936fd0319009a4783a728b544`. Firma y vigencia histórica todavía sin validar. El original permanece fuera de Git en la caché de corpus.
