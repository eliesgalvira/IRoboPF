# Validación conjunta de vivienda y ayudas

Los 31 comandos del workflow pasan con PATH limpio, Node 24.20.0, Bun 1.3.13, Python 3.13.15 y los mismos comandos Nix. Incluyen tipos globales, lint, inventario y archivos generados, flujo de datos y contratos del corpus. Se reproducen los pasos ejecutables; no se emula Ubuntu ni las acciones de instalación. [Comandos, tiempos y límites](CI-LOCAL.json).

El grupo territorial pasa 5.599 pruebas en 125 archivos, con dos omisiones y dos TODO anteriores. Incluye las ocho suites añadidas al workflow para Baleares emergencia, DT18/Rioja e hipoteca madrileña. Las validaciones de autor, revisión y focales se solapan con este grupo y no se suman como cobertura adicional.

Se conservan dos fallos previos del CI local. El primero reprodujo una colisión entre dos funciones locales con nombre «no» en el extractor R30. La cola del extractor conserva ahora los nodos AST ya resueltos y distingue su posición; no vuelve a buscar una declaración global por el nombre local. Pasan 27 pruebas focales, incluida la regresión nueva, y su revisión estática independiente es favorable. Los sellos documentales y la aceptación cerrada no cambian.

El segundo fallo era una expectativa antigua del test hipotecario de F: esperaba una dependencia anual que este corte ya implementa. La entrada carece del contrato madrileño necesario; la prueba exige ahora el rechazo concreto por esa ausencia y ningún importe o dependencia sustitutoria. Las 142 pruebas focales pasan. No se modifica producto ni se cambia ningún oráculo monetario por este ajuste.

El tercer CI completo termina correctamente en 17 minutos y 37 segundos. Picos muestreados: 2.84 GiB PSS del árbol y 4.70 GiB en el grupo de agentes, sin activación de guardias. Se mantuvieron la ejecución pesada secuencial, CPU 0 y 1 y los límites temporales de los hijos.

La condición patrimonial riojana conserva su primera revisión y el contraste favorable del arreglo grave. Baleares e hipoteca conservan sus primeras revisiones independientes y los límites declarados en [INTEGRACION.md](INTEGRACION.md). Las deducciones de 2025 siguen abiertas; no se habilita aceptación fiscal general. La comprobación remota corresponde al push posterior.
