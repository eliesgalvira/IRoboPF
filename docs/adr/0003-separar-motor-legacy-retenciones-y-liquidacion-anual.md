# Separar motor legacy, retenciones y liquidacion anual

El motor actual concentra auditoria de progresividad en frio, salario neto, cotizaciones, IRPF simplificado, comparaciones por IPC, exportacion compatible y parametros en `lib/domain/progresividad.ts`. Decidimos separar el calculo por dominios fiscales y laborales, preservando el **Perfil de progresividad en frio legacy** como contrato observable antes de abrir un motor general de **Liquidacion anual del IRPF** y un **Procedimiento de retencion** independiente.

**Considered Options**

- Seguir ampliando `progresividad.ts`: minimiza archivos a corto plazo, pero mezcla el oraculo legacy con reglas fiscales nuevas y hace mas probable romper la exportacion compatible.
- Reescritura completa: permitiria un modelo limpio desde el inicio, pero perderia el contrato legacy y haria dificil aislar regresiones.
- Refactor incremental con fachada y tests de caracterizacion: mantiene el comportamiento actual bajo `legacy-progresividad-frio` y permite anadir casos de Renta por vertical slices.

**Consequences**

La opcion elegida es el refactor incremental. Habra mas modulos y datos normativos versionados, pero la compatibilidad legacy queda protegida, las retenciones no se confundiran con la declaracion anual, y los PDFs se convierten primero a fuentes normalizadas Markdown antes de alimentar parametros ejecutables.
