# R53: hito no completado; borrador de relaciones estáticas

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Esta entrega **no satisface el hito R53**. No hay impedimento externo demostrado. Faltan capacidades internas del consumidor y pruebas causales; no se atribuyen a admisión ni a fiscalidad pendiente. El nuevo módulo no debe recibirse como grafo transitivo ejecutable terminado. Las cuatro puertas siguen falsas y ningún sitio obtiene cierre de valor o selección. La matriz incluida es un diagnóstico estático por raíz, no la matriz causal completa solicitada.

Base del candidato documentado: `58e2e58b137829f1b664a46d7c0054c2feb5efc2`.

## Implementación que existe

`grafo-transitivo-r53.ts` produce un modelo versionado y compartido por los cuatro programas. Los vértices incluyen programa, identidad de operación y fuente fijada. Las aristas preservan el orden de operandos y la clave de propiedad recibida. Las referencias globales enlazan la definición exacta de su programa; los puertos se toman de R47 verificado, con las correcciones R52, sin reimplementar su router o fórmulas. Cada enlace de puerto conserva propiedad y contexto de contrato. El contador transport no interviene como identidad.

Para un local, el productor localiza el identificador exacto en el AST y pregunta por su símbolo a TypeScript. Enlaza el inicializador de la declaración del símbolo si está representado. No selecciona todos los binds precedentes del archivo ni busca homónimos por nombre. La ruta de una desestructuración sigue los BindingElement, distinguiendo clave propia e índice de array. Esto es referencia estática: asignaciones posteriores, defaults y parámetros efectivos no quedan resueltos por ese enlace. Los parámetros se registran como pendientes, sin terminal satisfecho.

No se ejecuta ni transpila código financiero TS. El compilador solo analiza declaraciones. Los 65 sitios tienen una raíz de valor del fragmento propietario, unidad, frecuencia y destino documental origen.decimal; faltan sus rutas efectivas completas hasta ese destino. Las 19 familias conservan raíz y llamada exactas, cardinalidad declarada y distinción anual/aislada. Se verifica que el cuarto argumento real de cada llamada coincide con su raíz de valor. No se transforma una familia sin instancias en un importe cero.

`verifyTransitiveGraph` comprueba schema cerrado, extremos y reconstrucción estructural desde composición y puertos verificados. Clona antes de entregar. Restaurar hashes no evita el rechazo de sustracciones de aristas o cambios de propiedad. Esta reconstrucción solo comprueba correspondencia e integridad estructural. No es una prueba independiente de suficiencia semántica.

`inspectOutput` consume las relaciones del grafo y recorre dependencias estáticas. Conserva los ciclos detectados como ciclos, sin satisfacerlos por visitado. Devuelve las obligaciones internas pendientes alcanzables, siempre con valueClosed y selectionClosed falsos. **No es un evaluador financiero del grafo**, no devuelve variantes de ejecución por entrada y no acredita qué vínculo se ejecutó. Tampoco convierte globales/primitivas no examinadas en terminales aceptados.

El artefacto tiene 31.737 vértices compartidos y 37.849 relaciones; son operaciones y relaciones técnicas, nunca reglas fiscales. Registra 10.473 pendientes de las clases que el borrador reconoce. No es un censo exhaustivo de todos los pendientes que R53 exige: por ejemplo aún hay que distinguir default y asignación mutable. Esos números no justifican ningún cierre.

## Resultado individual y obligaciones que siguen abiertas

`grafo.json.gz` contiene el grafo compartido y fuentes. `matriz.json.gz` contiene exactamente 65 salidas y 19 familias, cada una con referencias por índice a las aristas y pendientes del grafo, evitando duplicar programas por salida. Los índices solo valen dentro de esta edición fijada; no se presentan como identidades estables entre versiones. La matriz conserva ciclos, cardinalidad y alcance declarado; no incluye casos discriminantes ejecutados por cada fila.

Para **todas las 65 salidas** siguen pendientes la invocación contextual efectiva, la selección por entrada, el transporte hasta la propiedad decimal y la justificación de terminales. La matriz expone además las dependencias estáticas específicas que alcanza cada raíz. Para **todas las 19 familias** falta la evidencia de instancias dinámicas: selector, callback/índice, cardinalidad por entrada, transporte y exclusión razonada, tanto para vacías como múltiples y ordenadas. Las relaciones estáticas del argumento cuarto no satisfacen esas obligaciones.

En particular:

- `anual.pagos.retenciones` alcanza la lectura de retencionesSoportadasCentimos; el test comprueba esa relación, sin sustituir el productor por la estimación de retención. Falta la ejecución discriminante de pagos frente a estimación y del subcaso independiente.
- Los lados empresarial/trabajador y las propiedades de los puertos permanecen separados. La mutación contractual intercambia una propiedad y se rechaza. Falta utilizar ese vínculo dentro del evaluador nuevo y observar la diferencia efectiva o su selección legítima.
- No están implementados los marcos de parámetros/desestructuración/retorno/captura por invocación ni una resolución contextual de los ciclos entre programas. Las referencias a funciones no acreditan llamadas.
- No se ha resuelto por propiedad la elección de tablas/celdas ni mínimo estatal/autonómico, ahorro/pérdidas, año/territorio/modo/lado y unidades ratio/EUR-string/Decimal/céntimos. Los cálculos existentes se conservan, pero conservarlos no completa su composición causal.
- No se implementa una clasificación de terminales financieros finitos documentados. Un import ausente, callback arbitrario o etiqueta opaque no se considera satisfecho.
- No hay API que evalúe estas relaciones con evidencia por salida/instancia ni pruebas de variantes trabajo/actividad/rechazo y cero/no alcanzado para el nuevo grafo. R45 permanece separado y no se ha repetido ni reemplazado.
- No se ha comparado el nuevo consumidor con APIs reales: ese consumidor aún falta. Tampoco existen rojos previos válidos de cada clase, ni contraste racional independiente suficiente, ni mutaciones de selección/instancia bajo ejecución.

Por tanto no se solicita aceptación del hito ni se etiqueta este borrador como candidato de cierre técnico completo. Estas carencias son internas, no bloqueos externos.

## Decisiones, objeciones, respuesta, coste y alcance

1. **Símbolos léxicos para def-use estático.** Evidencia: los nodos local solo llevan nombre; el símbolo del identificador exacto permite distinguir declaraciones homónimas. Objeción experta: una declaración no prueba la versión mutable ni el frame invocado. Respuesta: conservar ese límite y registrar parámetros/llamadas pendientes, sin atribuir cierre. Coste: dependencia del parser/typechecker existente y mantenimiento de rutas de desestructuración. Alcance: análisis estático de los originales verificados, insuficiente para el hito ejecutable.
2. **Grafo compartido y vínculos por propiedad.** Evidencia: 65 raíces pertenecen a cuatro fragmentos; R47 ya suministra los contratos por propiedad. Objeción: copiar toda la receta por salida o enlazar cualquier retorno escondería la propiedad efectiva. Respuesta: un grafo único y referencias por fila; los puertos conservan sus propiedades, pero su selección efectiva queda pendiente. Coste: mantener edición común e índices locales de artefacto. Alcance: correspondencia estructural, sin justificar aún todas las aristas financieras.
3. **No cerrar ciclos por visitado.** Evidencia: las dependencias globales/puertos permiten enlaces cruzados. Objeción: un set de visitados puede convertir una obligación circular en un éxito. Respuesta: conservar aristas de ciclo y devolver cierres falsos; no simular resolución contextual inexistente. Coste: aún debe implementarse el operador contextual que los resuelva. Alcance: diagnóstico, no evaluador.
4. **No promover los pases como R53 completo.** Evidencia: las pruebas actuales solo ejercen relaciones estáticas. Objeción experta: el usuario pidió expresamente completar el hito y ya rechazó entregas parciales. Respuesta: esta entrega incumple esa exigencia; no hay una razón externa que lo excuse. Se conserva el borrador y se explicita el trabajo que no se ha hecho, sin fabricar cierres. Coste: R53 continúa sin resolver y requiere implementación adicional; los contadores, hashes y pruebas no compensan esa falta. Alcance: sin aceptación pública o fiscal.

## Validación y fallos preservados

26 pruebas correctas: siete controles estructurales y 19 relaciones individuales de argumento cuarto. Incluyen sustracción de todas las aristas, reetiquetado de propiedad con hashes intactos, extremos por propietario, lectura de pagos soportados, persistencia de obligaciones de familias aisladas y ciclo privado. No son 26 pruebas financieras ni 19 ejecuciones de familias. El ensayo de ciclo modifica una copia privada consumida por inspectOutput; el constructor verificado no acepta esa mutación.

El primer instrumento llamado rojo no llegó a comprobar su aserción: import relativo incorrecto en scratch. Se preservan fuente y log. **No es un rojo válido ni se presenta como defecto del producto.** Falta el requisito de rojos previos por clase. El primer generador tiene el mismo error y se conserva como generar-intento1.ts.txt con su log. El segundo y el final usan la resolución correcta. El primer chequeo de tipos detectó condiciones no booleanas y tipos inferidos de MJS con null; se corrigieron en el código nuevo, sin proyectar otros tipos ni cambiar checks ajenos.

La lectura inicial de ESTADO usó su final histórico, no su cabecera reciente; la situación R53 se leyó después de escribir el borrador. Incumplimiento del orden de lectura solicitado, sin modificación de ese documento.

Effect-solutions list/show data-modeling/testing se consultaron mediante Bun, después de que Node fallase por ws no resoluble en el CLI de caché. No se añade código Effect ni servicios. Se exploraron las fuentes v4 locales; no se copiaron patrones sin verificar ni se instalaron dependencias. rg y Python no estaban en PATH inicial: se usaron las herramientas Nix.

Al ampliar tipos al generador de scratch aparece globalConsole; el intento fallido se conserva y se sustituye console.log por escritura documental con writeFileSync, sin desactivar el diagnóstico.

Tipos usa el tsconfig real, todos sus archivos y el host de resolución documental adaptado de R52, que remapea solo node_modules y el preparador R47 al scratch propio. checkJs=false conserva el límite de comprobación de los MJS heredados. No se ha activado una proyección alternativa de tipos. Oxlint usa las 16 reglas a error y los plugins compartidos en lectura; la configuración adaptada queda conservada. Los resultados terminales de calidad están en CALIDAD.json y los logs transportados.

Vitest usa --configLoader native, cache:false, cacheDir absoluto propio y maxWorkers:1. Cada validación adquiere y suelta flock /tmp/irobopf-validacion-pesada.lock. No se mantiene durante escritura/lectura. No hay Next build, suites legacy masivas, servidor, preview o instalación. El preparador R47 se ejecuta únicamente en una copia adaptada bajo scratch propio; no escribe la carpeta de R47 ni node_modules/.vite-temp del integrador. Las versiones usadas son Node 24.19.0, Bun 1.3.13, Python Nix 3.13.15 y TypeScript 5.9.3.

## Conservación y transporte

MANIFIESTO.json define el payload con ruta/SHA256/tamaño/modo/baseSha256:null. Incluye **payload ejecutable en .cache/grafo-transitivo-r53-sol/**, sus configuraciones, copias privadas, instrumentos y logs; hay que transportarlo también. No basta copiar docs. Los objetos vacíos o binarios viajan por hash y el texto por patch gzip, incluyendo ausencia de newline. Todos los archivos individuales son menores de 10 MiB.

La reconstrucción en scratch independiente aplica exclusivamente patch y objetos transportados. Compara conjuntos de rutas, bytes, tamaños y modos y exige cero extras; no copia las fuentes como sustituto. El sobre enumera el transporte y el recibo de reconstrucción; no se incluye a sí mismo. RECIBO-TERMINAL es posterior y separado, referencia el sobre y no se introduce en su propio payload. La reconstrucción e integridad no certifican el contenido financiero ni completan R53.

Sin main, PR, deploy, LFS, gasto, transferencia externa, mensajes externos o interacción en X. Originales, históricos, contexto y trabajo ajeno intactos. Entrega sin commits, sin atestaciones ni cambio de confianza. R53 sigue pendiente de implementación, no solo de contrarrevisión.
