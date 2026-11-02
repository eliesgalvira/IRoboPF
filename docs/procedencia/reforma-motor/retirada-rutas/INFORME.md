# Retirada de rutas de cálculo

Se elimina el cálculo familiar basado solo en edad/discapacidad y la ejecución legacy. La alternativa es la liquidación canónica con los hechos necesarios; los mínimos familiares soportados pasan por `DerechosMinimos2025`. La API real, las unidades, ejemplos y rechazos están en [API-MOTOR.md](../../API-MOTOR.md).

El contraejemplo previo concedía 5.100 euros estatales a cada uno de dos titulares para dos descendientes. La ruta de derechos atribuye 2.550 a cada uno. Se retiran los helpers de descendientes, ascendientes y discapacidad familiar que no conocían titulares, rentas ni convivencia, así como sus bypass en la liquidación anual y en los perfiles de auditoría. Las listas parciales antiguas se rechazan incluso al acceder al servicio.

La liquidación, el adaptador salarial, la auditoría y la comparación por IPC consumen la única cuota anual. Se retiran la reconstrucción del simulador y la tabulación fiscal independiente. Los análisis de inflación siguen siendo escenarios explícitos; no son otra declaración. La ficha anual rechaza contadores familiares insuficientes y el panel del salto basado en limitar una cuota anual por retenciones queda desconectado. La exportación recibe tablas de resultados calculadas previamente; no vuelve a ejecutar las fórmulas Excel. El original Python es una entrada estática del inventario documental por AST, no un consumidor ni una ruta del producto; se retiran de la documentación actual los comandos para ejecutarlo y para regenerar tablas legacy.

Las funciones `calcularCotizacionesSocialesLegacy` y `calcularDesgloseCotizacionesSocialesLegacy` y los métodos `calcularLegacy`/`desglosarLegacy` se retiran. La única política estimada es el perfil uniforme ya declarado, con tipos de solidaridad por pagador y ponderación temporal de 2018. No se introduce una conjetura sobre redondeo TGSS: sigue pendiente D. Las cotizaciones efectivas del perfil anual salarial permanecen efectivas.

## Archivos retirados

Base de todas las retiradas: `9062620236b51cbaacff22f3aa8106700751d6ef`. SHA-256 del contenido anterior:

| Ruta | SHA-256 anterior | Motivo |
| --- | --- | --- |
| `lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts` | `a4a64d6c93ea696cb609e3f5c5cd20c08708cb63835a360030b7a3c6a89fa09e` | Ruta anterior retirada; las piezas conservadas se trasladan a analisis-salarial y las fórmulas fiscales duplicadas se eliminan. |
| `lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts` | `91de05835fc910bf9d42c00892f87598dfa00194ac67444937ba974901200d77` | Ruta anterior retirada; las piezas conservadas se trasladan a analisis-salarial y las fórmulas fiscales duplicadas se eliminan. |
| `lib/dominio/compatibilidad-legacy/comparativa-tabular.ts` | `fbcd3e1cdc24ae1c705b62b332dc5218c68708bc4f793889a7da8daf6250d2e5` | Ruta anterior retirada; las piezas conservadas se trasladan a analisis-salarial y las fórmulas fiscales duplicadas se eliminan. |
| `lib/dominio/compatibilidad-legacy/detalle-tabular.ts` | `3f24db5540dfde431a84bab1454a354097d253a1200491999a29329954fde847` | Ruta anterior retirada; las piezas conservadas se trasladan a analisis-salarial y las fórmulas fiscales duplicadas se eliminan. |
| `lib/dominio/compatibilidad-legacy/perfil-progresividad-frio-legacy.ts` | `3da7f06908a332d648d8a5978fa30c081a00e9ea66dfa03ff9ab2f4aeb2203d5` | Ruta anterior retirada; las piezas conservadas se trasladan a analisis-salarial y las fórmulas fiscales duplicadas se eliminan. |
| `lib/dominio/compatibilidad-legacy/progresividad-frio.ts` | `97d7fef6e6152eb6d66af108d22a2459d359b6d12944e101f2c03ff16f6a81e8` | Ruta anterior retirada; las piezas conservadas se trasladan a analisis-salarial y las fórmulas fiscales duplicadas se eliminan. |
| `lib/dominio/irpf/liquidacion/conciliacion-simulador-legacy.ts` | `2def18a743de7eab42d93e104368a12edfef581fb89b6d2e55734dc76ab53126` | Reconstrucción fiscal legacy retirada sin alternativa paralela. |
| `lib/dominio/irpf/minimos/minimo-ascendientes.ts` | `f51da59f85dce23231acb8396d50e58c2ce2b27202a590b863e4045226a62fca` | Helper de elegibilidad insuficiente; sustituido por derechos completos. |
| `lib/dominio/irpf/minimos/minimo-descendientes.ts` | `21112fb07f3c815be7ca1a0f48e3f3daceafa4e05e0526d47623566cd2431e5d` | Helper de elegibilidad insuficiente; sustituido por derechos completos. |
| `lib/dominio/normativa/datos/compatibilidad-historica.ts` | `2a1eee7042cab84eabb0255a2bc6d19581fdf7688606b1c7a15cc1b925975a49` | Módulo exclusivo de compatibilidad, sin consumidores de producto; valores documentales conservados en fixture. |
| `scripts/generar-fixture-caracterizacion-legacy.ts` | `bc059894a073fbf5d5ac2d326e42bddda296a6097e6c45b3c6a1f5746365218c` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `scripts/generate-canonical-fixture.ts` | `00417f54bc3be4db146019196d5a8f54d290f389373683f345acc34702677a7c` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `scripts/hash-effect-sheet.ts` | `718a750201d5656aa3d0cb503f6182d4dba176e400493d6869762d45f7cea5f6` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `tests/auditoria-excel-pesada.test.ts` | `c02bcfd2bfa258f9b39eed92e84c8a68d0be554479b2d527669d2d8857776cc4` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `tests/calculo-salario-legacy.test.ts` | `31fc04697855f66a8bab3f0617af87ee9efca22d0236f256c5528d50604a55ba` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `tests/comparativa-inflacion-tabular.test.ts` | `e5f73f69457e4187660b3cefa4b399c2b9716a4999ae73b124e90e0c2c219ef5` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `tests/progresividad-caracterizacion-legacy.test.ts` | `6ebb1288edf25a9cbda8334eab5162bb8efe3a376e8bf709051fd09df483088f` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |
| `tests/redondeos-legacy-oracle.test.ts` | `0a616b5a9946143893914c865befc2c865ebde39196ae262c9cc3efd0c7afbb4` | Regeneración o prueba exclusiva del algoritmo/tabulación retirado; fixtures históricos conservados. |

## Cobertura y límites

Se conservan los perfiles canónicos y el resolver normativo existentes cuando bastan los hechos. El reparto familiar completo se limita al contrato Madrid 2025 individual, sin ascendientes ni fallecimientos. Edades, rentas, elegibilidad, titularidad, discapacidad y divisor se validan antes del cálculo. Otros ejercicios o territorios con familiares y especialidades pendientes se rechazan por su carencia concreta; no se copian las condiciones de Madrid. Los perfiles sin familiares no se desactivan en bloque.

Las retenciones mantienen su procedimiento inicial versionado. Se retiran también sus mínimos familiares por orden/multiplicador manual y sus acumuladores de discapacidad familiar. Las entradas antiguas de familiares se rechazan; la conexión admitida pasa por `DerechosMinimos2025` para activo en situación 3, con listas parciales vacías y sin anualidades. La edad del perceptor es un hecho obligatorio. Dos titulares reciben 1.200 euros estatales familiares cada uno también en este procedimiento. Las demás especialidades no se rellenan por defecto. La integración exhaustiva de hechos familiares y normativa sigue en A/E. La API actual de deducciones autonómicas se consume sin editar el auxiliar compartido; queda pendiente su unificación.

Las referencias históricas por hash/versión permanecen. Las líneas de la liquidación reformada señalan la revisión pendiente y conservan las referencias anteriores como históricas. Los snapshots de rastro y los grafos de admisión/composición/causalidad que capturan símbolos retirados necesitan regenerarse y revisarse; sus aceptaciones no se heredan. No se promueven registros, atestaciones ni `completeRuleAcceptance`.

## Validación

La prueba roja previa reproduce el reparto entero para ambos titulares. Las pruebas de derechos ejercen dos y tres titulares, titular único, rentas en los límites, discapacidad, convivencia, grados y rechazos. Las pruebas de retirada comprueban llamadas antiguas, acceso mediante servicio y ausencia física de entrypoints retirados. La migración sustituye expectativas exclusivas del algoritmo legacy por pruebas de encaminamiento; no reconstruye el oracle oficial.

Los siete casos oficiales de Renta WEB Open 2025 y los dos ejemplos anuales conservan sus entradas sintéticas, expectativas y reservas. La muestra oficial no acredita todos los años o familias. Validación final: **492 pruebas aprobadas en 27 archivos**, con un trabajador. Los tipos principales reproducen exactamente los cuatro diagnósticos históricos de r47/r52, sin diagnósticos nuevos. El proyecto vendor pasa. ESLint y Oxlint del alcance pasan sin errores ni avisos, con las 16 reglas configuradas a error. El lint global conserva cinco errores en una revisión regional ajena al ámbito: se ha comprobado que tanto ese archivo como las reglas y dependencias conservan los mismos bytes de la base.

La compilación de consumidores de la versión final con Next/Turbopack termina correctamente en 25 segundos, con un trabajador. El build completo no está aprobado: se interrumpió después, durante la fase de tipos. El pase principal separado conserva los cuatro diagnósticos citados. No se excluye código para ocultarlos ni se despliega.


Se conserva la comprobación documental de hashes de las hojas históricas, pero se retiran sus regeneradores y ejecuciones del algoritmo eliminado. Las pruebas mixtas conservan las ramas canónicas y los selectores de versión. Los predicados R32 anteriores rechazan expresamente las fuentes reformadas por hash; ese rechazo no acredita una nueva composición ni habilita sus puertas.

Esta retirada no cierra los bloques A–F. La revisión independiente de esta versión sigue pendiente.
