# Delta incremental sobre el corte productivo congelado

La base vigente es el corte del padre de114 rutas,parche f848de69227445de23681a787659e7053d39251ea361c3db828906e56ae8ca99. El título histórico del archivo no identifica una base v4 que pueda aplicarse literalmente. Las preimágenes exactas actuales y sus SHA están en el manifiesto privado.

Seis archivos centrales reciben cambios incrementales:

1. anual-territorial-esquemas.ts añade la variante E38 conservando A40,B-ampliado y todas las variantes anteriores.
2. anual-territorial-tipos.ts añade E38 a la unión manual que comparten productores y conciliadores A/B.
3. anual-territorial.ts añade evaluación E,racionales en céntimos y saldos posteriores al consumo. La conciliación específica E coexiste con la específica B. Preparación única B,elecciones,pagos,censos A40,prioridades y mapa público de aplicaciones quedan intactos. El único consumirCuota existente se conserva;los saldos E leen aplicaciones por índice de solicitud tras el mapeo del libro B.
4. composicion-anual.ts transporta únicamente el canal interno E de bases imponibles. Conserva bases liquidables,componentes de mínimo y productores/nodos B,además de políticas C2025.
5. liquidar-irpf-anual.ts entrega las bases imponibles ya calculadas y selecciona80 cifras de composición si hay E38. Sin E38 mantiene la selección previa.
6. trabajo-anual/conexion.ts entrega neto fiscal con signo y ahorro cero del perfil vigente. Todas las ramas C2025 y sus políticas se conservan byte a byte al retirar esa única línea añadida.

Además se extiende comun.ts de E38 con el canal interno exacto ya validado en el candidato333. Los cuatro módulos anuales y las dos pruebas E son idénticos a dicho candidato. Los otros archivos E38 integrados y los tres archivos con38 oráculos permanecen idénticos.

entrega.patch es el paquete autónomo contra esta raíz congelada. delta-central-sobre-corte.patch facilita revisar sólo los seis archivos centrales y no sustituye al paquete completo. No aplicar los deltas centrales del candidato anterior:su base era otra y perderían las integraciones A/B/C. No se lee ninguna carpeta privada A/B en ejecución.

La evidencia focal actual está en REBASE-P2.md y el manifiesto. Quedan pendientes revisión independiente de la conexión,integración del padre y CI global. No se afirma aceptación fiscal ni cierre de productores ausentes.
