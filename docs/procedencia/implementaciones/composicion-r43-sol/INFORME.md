# Composición R43: implementación candidata no completa

Se incorpora un consumidor financiero nuevo que conecta SS, retenciones/pagos, rentas y escalas mediante sus programas finitos actuales. No ejecuta ni transpila el motor TS como evaluador de producción y no recibe callbacks financieros del usuario. La API TS real aparece únicamente en las pruebas. Esta entrega no satisface todavía todas las obligaciones del encargo concreto; no debe recibirse como composición terminada ni como un bloqueo externo. No se declaran valueClosed ni selectionClosed. No se cierra el encargo global.

Identidad: T3 Code, harness Codex, gpt-6.1-sol con esfuerzo high, sin subdelegación. Priority solicitada; no se dispone de recibo independiente del nivel de servicio. Base exigida y observada: 05cf0e159cc0a0eb3b87d554447a2d14939115c2, 21.126 entradas. No hay commits ni mutaciones VCS. Las conclusiones nuevas requieren contraste del padre.

## Implementación efectiva

`produceComposition` importa las cuatro funciones productoras actuales, sin ejecutar sus CLI de escritura. Conserva íntegros los cuatro fragmentos reconstruidos. `verifyComposition` invoca los cuatro verificadores y contrasta después el candidato completo con su receta nueva. La unión exige exactamente 65 identificadores distintos. Esa comprobación solo acredita el universo; no decide cierres causales.

`createComposition` verifica y clona antes de construir los puentes. Los consumidores de escalas que suman trabajo/capital, calculan netos, ganancias, reducción, adaptan trabajo/actividad o aplican DA61 llaman a raíces exactas de rentas por archivo y símbolo. Los dos desgloses de SS llaman a sus raíces finitas propias. El fallback de totales legacy proyecta exclusivamente cotización empresarial y trabajadora desde el desglose representado; no copia fórmulas. Las raíces de comunidad, escala publicada y cuota vuelven desde rentas a escalas. El mínimo estatal se obtiene de su nodo global representado, sin reconstruir su cifra.

El recorrido anual reúne las líneas de los cuatro consumidores, conservando sus conversiones. El estimador de retención usa su subcaso y contexto; no se sustituye su bruto por el anual. Los pagos efectivos siguen siendo propiedades distintas de la estimación. Los bloques y callbacks conservan los bindings de sus intérpretes recibidos. La API explícita de rentas ejecuta el recorrido completo de trabajo/EDS, con cuotas y mínimos resueltos por los puentes. La actividad aislada utiliza su raíz propia y conserva los discriminantes devueltos. No se introduce cero como sustituto de rechazo ni se añaden líneas para ramas no alcanzadas.

`consumePublic` rechaza siempre: no existe paquete revisado de admisión asociado a estos bytes y ruta. No se acepta un objeto favorable aportado por el llamante. El laboratorio financiero presupone admisión; las dos fronteras de validación de derechos se pasan como identidad únicamente en ese dominio condicionado. Esta identidad **no es** una implementación de la validación y no autoriza ejecutar entradas no admitidas como si fueran resultados públicos. El cálculo de derechos permanece en el programa de escalas. Se conserva la diferencia entre activos/discapacidad admitidos por la API aislada y excluidos del anual explícito.

## Evidencia y límites reales

Se conserva un rojo anterior a la implementación: el consumidor de escalas sin puentes falla al pedir `sumarRendimientosTrabajo`. El esperado exige una salida integrada, no un fallo fiscal. El mismo caso pasa con el compositor nuevo. Los logs preservan además fallos propios de entorno, tipos, timeout y proyección; no se cuentan como pruebas correctas.

El último pase focalizado previo al ajuste final de proyección contiene 21 pruebas correctas: seis contrastes anuales generales (cero, salario ordinario y alto, ambos modos), dos subcasos de retención, trabajo explícito, EDS, rechazo explícito, dos opciones de actividad aislada y seis combinaciones con activos/discapacidad, integridad/puerta y sensibilidad SS por lado/año. Se comparan líneas por siteId, decimal y unidad, filtrando líneas editoriales sin origen. La igualdad no cubre la redacción de las etiquetas. La prueba propia SS exige 67 EUR empresarial y 13 EUR trabajador en MEI 2025 para 10.000 EUR; la mutación de lado se ejecuta fuera del verificador como ensayo semántico. No se suman ejecuciones repetidas como cobertura distinta.

Persisten obligaciones de esta implementación, sin atribuirlas a admisión ni a un impedimento externo:

- Los 41 puertos exportados describen las salidas contractuales de fronteras de escalas y sus argumentos/llamadas, pero no constituyen aún un contrato común completo de todos los enlaces por propiedad y llamada. Las otras conexiones están implementadas en código, sin la misma representación normalizada.
- Los 65 registros y 19 descriptores de etapas preservan las fuentes y transportes recibidos. No se demuestra cobertura individual de todas las condiciones de las 19 instancias. Las seis variantes nuevas no sustituyen esa obligación.
- No se deriva todavía cierre transitivo común de valor/selección. Rechazar alteraciones mediante reconstrucción exacta es integridad; no demuestra suficiencia. Faltan discriminantes nuevos de bindings cruzados, unidad, condición, productor de pagos, derechos condicionados y ahorro/pérdidas en la composición completa.
- El anual conserva los throws de consumidores históricos: no ofrece aún una normalización común rigurosa success/fail/defect. La API explícita conserva la distinción que ya implementa rentas. No se atribuye equivalencia universal de Cause, fibras, interrupciones, entorno, servicios o instrumentación.

La salida editorial por sitio enlaza objetos y fuentes, pero su texto genérico no satisface todavía la explicación individual de derivación solicitada. No se presenta como documentación pública lista ni como fundamento jurídico. No hay citas oficiales nuevas, adquisición documental ni nuevo original PDF. Los originales y V5 r2/R26 permanecen en sus ubicaciones. Crossa v1 conserva sus reservas históricas.

## Conservación

Cotejo inicial terminado antes de editar código: lstat/readlink/bytes/modo ejecutable de 21.126 entradas contra un blob cada vez, todas iguales. Los controles finales y el manifiesto registran el extremo de entrega. Las altas tienen baseSha256 null; ningún archivo base está autorizado para cambiar. Los artefactos históricos, motor, inventario, snapshots, confianza, ESTADO y DECISIONES no se modifican.

No se ejecutan servidores, previews, builds Next ni suites legacy masivas. Sin rediseño, main, PR, publicación, LFS, gasto o transferencia externa. Node_modules del padre se lee; el entorno Python se aloja exclusivamente en scratch propio. Los dos primeros intentos de auditoría no completaron el cotejo (Python genérico NixOS y límite de buffer Node); el intento mediante Python Nix/uv sí termina antes de editar. Una edición auxiliar usó Python Nix directo en lugar de uv: desviación de procedimiento conservada, sin escritura de entornos compartidos. Las primeras consultas a productores no tomaron el lock pesado; las validaciones posteriores sí lo toman por operación. No se ocultan esas desviaciones.

## Resultado de calidad de entrega

El pase definitivo del alcance termina con generación 0, 21 pruebas correctas, tipos estrictos 0, Oxlint 0 y schema 0. El último ajuste posterior solo introduce una excepción documental del diagnóstico de importación fs y regenera hashes; no modifica operaciones financieras. Oxlint global pasa sobre 468 archivos antes de añadir el auxiliar de hashes (este queda comprobado por los controles de alcance); ESLint global pasa incluyendo el auxiliar, con advertencia de detección React. Tipos vendor pasa.

El principal no queda verde: reproduce TS2345 en `docs/procedencia/revisiones/fronteras-escalas-r42-sol/propios.test.ts:53:27`, por `ParameterWitness.type` string frente a string|null. Un pase que excluye todos los archivos nuevos produce el mismo diagnóstico, byte por byte en el log. Ningún diagnóstico restante corresponde al código nuevo. No se modifica ese test ajeno ni se maquilla el resultado como tipo principal correcto. Se preservan la configuración de resolución de dependencias y ambos logs.

Los resultados son comprobaciones propias, no contrarrevisión independiente. La ficha editorial sigue siendo preliminar y los cierres causales no se elevan por el número de casos. Ninguno de estos resultados acepta fiscalidad.

El cotejo terminal vuelve a comprobar las 21.126 entradas originales: cero diferencias y borrados. El transporte reconstruye exactamente cada ruta/hash/tamaño enumerados. Su primer intento omitía archivos de texto vacíos porque no generan hunks; se corrige transportándolos como objetos binarios vacíos por SHA256, sin cambiar su contenido. Se conserva el fallo y se usa un scratch nuevo para cada ensayo. Los sobres excluyen sus propias autorreferencias y los objetos de transporte duplicados; el contenido sustantivo queda enumerado en MANIFIESTO.json.
