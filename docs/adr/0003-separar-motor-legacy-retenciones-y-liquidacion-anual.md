# Separar motor legacy, retenciones y liquidacion anual

El motor original concentraba auditoria de progresividad en frio, salario neto, cotizaciones, IRPF simplificado, comparaciones por IPC, exportacion compatible y parametros en `lib/domain/progresividad.ts`. Decidimos separar el calculo por dominios fiscales y laborales, preservando el **Perfil de progresividad en frio legacy** como contrato observable antes de abrir un motor general de **Liquidacion anual del IRPF** y un **Procedimiento de retencion** independiente.

**Considered Options**

- Seguir ampliando `progresividad.ts`: minimiza archivos a corto plazo, pero mezcla el oraculo legacy con reglas fiscales nuevas y hace mas probable romper la exportacion compatible.
- Reescritura completa: permitiria un modelo limpio desde el inicio, pero perderia el contrato legacy y haria dificil aislar regresiones.
- Refactor incremental con fachada y tests de caracterizacion: mantiene el comportamiento actual bajo `legacy-progresividad-frio` y permite anadir casos de Renta por incrementos funcionales pequenos.

**Consequences**

La opcion elegida es el refactor incremental. Habra mas modulos y datos normativos versionados, pero la compatibilidad legacy queda protegida, las retenciones no se confundiran con la declaracion anual, y los PDFs se convierten primero a fuentes normalizadas Markdown antes de alimentar parametros ejecutables.

## Actualizacion 2026-05-01

Con la incorporacion de IRPF 2012, el rango legacy 2012-2025 ya esta cubierto por `LiquidacionIrpfAnual` para el perfil canonico de contraste: contribuyente individual, soltero sin hijos y comunidad `simulada-estatal`. El adaptador salarial `calculo-salario-legacy` deja de caer al motor tabular legacy y solo acepta ejercicios 2012-2025 migrados a la liquidacion anual.

`progresividad-frio` queda como oraculo historico y generador tabular para auditoria contra las hojas `DAT_YYYY`, no como ruta de calculo de compatibilidad salarial.
