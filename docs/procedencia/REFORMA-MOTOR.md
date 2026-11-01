# Un solo motor con procedencia

Esta decisión sustituye cualquier requisito anterior de compatibilidad del motor o del catálogo. Se aplica a las deducciones en curso y a todos los bloques del [plan completo](PLAN-COMPLETO.md).

Se eliminan `FamiliarFiscal`, el modo legacy y las rutas duplicadas. Cada cálculo tendrá una sola implementación de producto. Las diferencias legales entre ejercicios, territorios y situaciones se seleccionan explícitamente dentro de ese motor; no justifican conservar una fórmula que sabemos incorrecta. Las pruebas independientes pueden usar cálculos de referencia, pero no se exponen como alternativas del producto.

La evidencia histórica se conserva por commit y hash. No obliga a mantener funciones, aliases, firmas o resultados antiguos ejecutables. Cada retirada debe identificar el código eliminado, sus consumidores y las pruebas que demuestran la sustitución o el rechazo del caso todavía no soportado.

La API y las fichas pueden cambiar. Su contrato vigente se documenta en [API-MOTOR.md](API-MOTOR.md), con entradas, resultados, rechazos y ejemplos. Las páginas actuales se adaptan lo mínimo o se desconectan para que compile la aplicación. El diseño visual corresponde al rediseño separado.

Cada valor normativo debe tener documento por hash, cita, ubicación y ámbito temporal. Los valores derivados identifican sus entradas y regla; los hechos aportados por quien usa el motor se distinguen de las normas. Una referencia pendiente no se presenta como verificada. La falta de datos necesarios produce un rechazo explícito, nunca un cero ficticio ni un retorno a la fórmula retirada.

Los cambios requieren pruebas y revisión independiente. Las eliminaciones concretas del código antiguo están autorizadas; los borrados masivos ajenos al cambio no lo están. Solo se añaden commits en `procedencia-documental`, sin reescribir historia, modificar `main`, desplegar, abrir PR ni usar LFS. Los originales siguen fuera de Git.
