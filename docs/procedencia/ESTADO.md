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
- Anti-slop: pendiente. Bloquea el inicio de nueva implementación TypeScript/Effect.
- Auditorías y contrarrevisiones: aún no iniciadas. Cero hallazgos aceptados, cero cifras declaradas verificadas.

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
