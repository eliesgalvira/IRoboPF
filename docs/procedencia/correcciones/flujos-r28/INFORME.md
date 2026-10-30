# Rectificaciones de representación de los flujos

Edición candidata separada de los tres grafos históricos R23. El motor no cambia. Los originales, sus informes y sus pruebas rojas permanecen intactos; el contenedor `rectificaciones.json` fija cada fuente, sustitución anterior/posterior y hash del candidato. Los campos históricos de los cuerpos identifican su procedencia, no una nueva autoría de R23. La edición R28 se identifica en ese contenedor y requiere revisión independiente antes de composición.

## Arreglos concretos

- FA25-01: el cuarto argumento de cada una de las 19 llamadas se obtiene de `CallExpression.arguments[3]`, exigiendo fuente y rango de llamada exactos. Se corrigen los seis rangos equivocados tanto en el grafo como en su lista separada. El rango productor no sustituye al argumento consumidor aunque contengan el mismo texto.
- FA25-03: la referencia a fechas se sustituye por un intervalo identificado de las declaraciones monetarias `crearImporteMonetario` a `centimosAEuros`. Se declara que es un intervalo de declaraciones; no se presenta como un literal. La otra arista monetaria correcta se conserva.
- R26-01: cuatro propiedades `escalaAutonomicaIgualEstatal` de 2012–2015 son literalmente `false`. El AST contrasta cada inicializador; se retiran las entradas territoriales de esas cuatro propiedades, sin trasladarlo a otros campos del objeto ni a otros años.
- R26-02: ocho fórmulas de cuota/desglose general y mínimo distinguen la rama `usaEscalaAutonomicaReal`, cuyo valor es la negación de aquella propiedad. La palabra «Simulada» no determina la rama: en 2012–2015 se calculan dos componentes. Se comprueban las declaraciones condicionales, sus bytes y hashes. No se alteran importes, cuotas publicadas ni reglas jurídicas.
- RSS26-02: la edad menor de tres años y el modo del contexto se clasifican como controles de selección, no importes. Además se rectifica la referencia de `A.modo`: la declaración homónima que obtiene el servicio no es la declaración que selecciona la función de cotización. Nodo y arista señalan ahora la llamada condicional real, identificada en AST.

## Verificación y límites

`rectificar.mjs antes` reproduce los fallos contra los cuatro artefactos originales; `corregir` escribe candidatos nuevos. Los resultados efectivos se conservan en `antes.json`, `rectificaciones.json` y los logs. El contraste usa índices UTF16 de JavaScript y fuente TypeScript real; no offsets UTF8 ni búsqueda del primer token homónimo.

`validar.py` verifica hashes, aplica cada sustitución declarada a los originales y exige igualdad completa con los candidatos. Valida los tres schemas heredados y la igualdad entre las 19 instancias del grafo y la lista separada. Es una comprobación de transporte y estructura, no un analizador universal de causalidad. El reporte `validacion.json` distingue ambas cosas. Tipos, anti-slop, Ruff y mypy se registran por separado; los fallos propios, si aparecen, se conservan antes de corregir el instrumento.

Quedan abiertos aporte frente a etapas y sus llamadores, condiciones por rama, puertos concretos de entrada/salida, selección de modo hasta cada componente SS, conversiones céntimos/EUR, instancias por lado y cierre alcanzable. Los validadores heredados no descubren todas las omisiones o adiciones causales; tampoco se presenta el nuevo contraste fijo como garantía de ellas. Los cinco rojos recibidos de escalas y los límites del resto siguen conservados en sus carpetas originales.

La composición posterior necesita un contrato común y adaptadores explícitos entre direcciones y vocabularios de los lotes. Debe resolver propiedades y argumentos concretos, distinguir valor/selección/admisión y producir cierres por sitio con condiciones, sin completar desconocidos mediante prosa genérica. los campos `completeClosure`, `wiringAllowed` y `completeRuleAcceptance` siguen en `false`.

Objeción experta: corregir localizadores no completa una explicación verificable. Respuesta: se corrigen solo las afirmaciones reproducibles y se bloquea la publicación hasta resolver y revisar el resto. Coste: mantener versiones candidatas y un adaptador adicional; no se rebaja el estándar ni se transforma coincidencia técnica en aceptación fiscal. No se generan nuevos snapshots, registros de confianza o atestaciones en este bloque.

## Incidencia del instrumento

El primer lanzamiento con Bun resolvió el alias de tipos `typescript` de la configuración de checkJs hacia `typescript.d.ts` y falló antes de ejecutar las comprobaciones. Se conservan `antes-instrumento.log` y `despues-instrumento.log`. La validación de transporte posterior falló por ausencia del artefacto no generado; también queda en `validar-instrumento.log`. No son pruebas rojas de los grafos ni defectos fiscales. El reproductor se lanza con Node, que resuelve el módulo de ejecución; la fase roja exige además que exista su recibo de casos, no solo un código de salida 1. Los esperados permanecen intactos.

## Resultado efectivo

Con Node, la fase anterior ejecuta 54 comprobaciones y reproduce 28 fallos; la fase corregida pasa las mismas 54. Se conservan 28 sustituciones en cuatro artefactos, incluidos los seis argumentos duplicados en grafo y lista: no son 28 defectos fiscales independientes. Pasan los tres schemas, la reproducción exacta de las sustituciones y la igualdad entre las 19 instancias de ambas representaciones. Los originales conservan su hash.

Tipos y oxlint terminan con código 0. Ruff y mypy con comprobación de cuerpos también terminan con código 0 sobre los dos scripts propios; el alcance de imports/JSON sigue parcial. `calidad-final.json` registra los cuatro códigos. El pase adicional conserva los códigos explícitos que no habían quedado en un recibo del primer lanzamiento; no amplía la cobertura fiscal. Las 16 reglas anti-slop permanecen a error. Revisión independiente nueva pendiente; cierre y publicación siguen bloqueados por las cuestiones enumeradas.
