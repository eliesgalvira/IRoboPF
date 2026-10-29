# Decisiones de la auditoría documental

Cada decisión registra la razón, la objeción experta considerada y el coste aceptado. Las decisiones todavía no resueltas no se presentan como implementación completada.

## D001. Separar evidencia, verificación y aceptación fiscal

Un dato inventariado nace pendiente. El primer auditor propone `match`, `mismatch`, `missing` o `ambiguous`; la aceptación exige otro auditor independiente. Un verificador técnico de bytes y coordenadas no sustituye al juicio sobre vigencia, sujeto, territorio o régimen transitorio.

Objeción experta: dos agentes pueden repetir el mismo error si solo leen la conclusión del primero. La contrarrevisión debe releer originales y comprobar hipótesis, unidades, fechas y contraejemplos. Coste aceptado: duplicar investigación y conservar hallazgos sin aceptar mientras falte esa revisión.

## D002. Conservar la referencia legacy sin elevarla a norma

Python y Excel se utilizan como referencia de comportamiento. Ante diferencias se registrarán los dos resultados y la norma aplicable. Ningún cambio de fixture podrá ocultar una discrepancia legal. Coste aceptado: algunas diferencias canónico/legacy serán deliberadas y requerirán documentación y pruebas separadas.

## D003. Inventario exhaustivo antes de declarar cobertura

El inventario debe incluir tanto literales como valores derivados, tablas heredadas por año, fórmulas, condiciones y redondeos. La identidad fiscal no será un número de línea: se conservará además una localización de código para revisión. Coste aceptado: distinguir descubrimiento sintáctico de catalogación semántica, con lagunas explícitas hasta completar esta última.

## Pendientes

- Almacenamiento de blobs, firma PAdES, CSV, WARC y sellos de tiempo.
- Arquitectura de entrega estática frente a actores; contratos de rutas y rastros.
- Alcance acreditable de nuevas deducciones y actividades económicas.

## D006. No inicializar JJ en checkouts Git gestionados por T3

La instrucción inicial del orquestador de permitir `jj git init --colocate` en esos checkouts fue incorrecta para este entorno: apareció un índice vacío con todos los archivos marcados como borrados. Elies la revocó. Los hijos entregarán archivos y pruebas sin mutar VCS; el orquestador los comparará con la base y los incorporará con Jujutsu en el repositorio principal. Toda futura delegación incluirá la prohibición explícita.

Objeción experta: ni un índice ni un commit aislado bastan para acreditar una entrega si se ha mezclado el control del checkout. Se comprobarán árbol base, árbol entregado, índice y presencia real de archivos; no se aceptarán borrados no autorizados. Coste: integración selectiva y comprobación adicional por entrega, sin perder el trabajo en disco ni restaurarlo destructivamente.

## D004. Oxlint anti-slop junto a ESLint de Next

Se mantienen los presets core-web-vitals y typescript de eslint-config-next 16.1.7 y se añade oxlint 1.78.0 con @oxlint/plugins de la misma versión exacta. El runtime anti-slop v0.1.2 queda incorporado con licencia y hashes. Las 15 reglas generales y la regla Effect están a error. El script lint ejecuta ambos analizadores y falla si cualquiera falla.

Objeción experta: sustituir ESLint sin demostrar equivalencia perdería controles de Next, React Hooks y accesibilidad del preset existente. No se presupone que oxlint carezca de todas esas capacidades: sencillamente no se ha acreditado equivalencia. Se evita la sustitución; coste aceptado: dos recorridos de fuentes y dos configuraciones. Las reglas generales siguen en ESLint; oxlint solo añade anti-slop (`plugins: []`, categoría correctness desactivada para no duplicar la política general). Ninguna regla anti-slop está desactivada.

El runtime de terceros no se fuerza a cumplir su propia política de código de aplicación. Se conserva su semántica y se comprueba con un proyecto TypeScript estricto separado, sin el plugin de diagnósticos arquitectónicos Effect. Objeción: excluirlo del proyecto principal podría ocultar roturas; por eso typecheck ejecuta ambos proyectos, y test:lint carga ambos plugins, verifica todas las severidades y comprueba rechazos reales. Coste: mantener un segundo tsconfig y una pequeña adaptación trazada para noUncheckedIndexedAccess.

## D005. Bootstrap con deuda explícita y CI acotada

La primera ejecución detecta 96 infracciones anti-slop en 25 archivos propios existentes. No se altera el cálculo ni se añaden comentarios SAFETY genéricos para conseguir verde. Se entrega mapa por regla/archivo y diagnóstico con posición, repartible por propietarios. Objeción: una CI inicialmente roja no distingue por sí sola regresiones y deuda. Se acepta temporalmente ese coste, sin baseline permisiva: cada entrega debe comprobar sus archivos y actualizar el mapa; una fase específica debe resolver la deuda antes de exigir verde global.

No existía CI. Se añade un job secuencial con límite de 15 minutos, instalación congelada, humo del lint, lint, typecheck y dos suites pequeñas (fronteras arquitectónicas y dinero, un trabajador). Typecheck y tests se ejecutan aunque lint falle. No se ejecuta build ni suite legacy pesada. Objeción: estas cinco pruebas no acreditan regresión fiscal completa; se acepta solo para bootstrap sin cambios de cálculo. La auditoría y las pruebas amplias posteriores siguen pendientes.
