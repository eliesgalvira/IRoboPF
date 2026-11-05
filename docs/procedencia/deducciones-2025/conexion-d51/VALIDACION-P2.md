# Validación de autor PESADO2

Base: raíz publicada b9122c2b; corte114 f848de69227445de23681a787659e7053d39251ea361c3db828906e56ae8ca99. Raíz sólo lectura, sin VCS mutante, integración, subdelegación ni CI global. Todos los comandos llevan timeout -k30s y las suites se ejecutaron de una en una con maxWorkers=1.

- Rojo conservado: 01-vitest-rojo.log,78 correctas/1 fallo en API explícita con mínimos por tercios. Expectativa racional intacta. Diagnóstico: transporte DA61 limitado a60decimales frente a precisión80 de la anual.
- Corrección: trabajo-anual/contrato.ts amplía sólo magnitudes calculadas a80decimales; calcular.ts conserva la fórmula con aritmética80. Importes de hechos sin cambios. La prueba original pasa sin cambiar expectativas y se añade límite80/81.
- D51 final: 10-vitest-final.log,80 correctas.
- Regresiones finales: 09-regresiones-final.log,461 correctas y2todo preexistentes en13 archivos; A40/H12, B37/prioridades, C2025, tres archivos D51 aislados y contratos de trabajo.
- Tipos estrictos: 11-tipos-final.log, cero diagnósticos. 05-effect-canario.log rechazado con floatingEffect, prueba de activación Effect en el mismo host lógico de lectura.
- Antislop: 06-antislop.log, exit0; 08-antislop-canario.log rechazado por no-unknown-parameters.
- ESLint de raíz sobre archivos selectivos: 07-eslint.log, exit0; avisos de entorno React/pages, sin errores.

541 pruebas correctas en14 archivos, más2todo preexistentes. Se conservan el rojo inicial y los canarios; no se altera ningún oráculo fiscal. Los51 oráculos conservan SHA e99a5ca8b3d9d87c506816039341db16cf3926d336cd7817f1b11c936f9303b6; prefijos12/R1/R2 y H1–H3 intactos.

El verificador Python reconstruye exactamente los dos parches y coteja pre/post y las74 rutas lib/tests del corte. Hay51 conexiones, no51 deducciones completamente cerradas: once códigos mantienen productores fiscales ausentes y hay límites condicionales de censo, rentas e históricos por rama. Primera revisión anual independiente D pendiente; aceptación fiscal pendiente. PESADO2 se libera al entregar.
