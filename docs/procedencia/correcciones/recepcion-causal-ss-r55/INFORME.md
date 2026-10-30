# Evidencia causal de once salidas SS

Se incorpora como candidato el seguimiento ejecutado de las once salidas SS. La recepción exacta y la compatibilidad técnica están comprobadas; la suficiencia causal requiere una contrarrevisión independiente nueva. No se acepta el cierre global de 65 sitios y 19 familias, la admisión anual ni una regla fiscal.

## Correcciones de integración

El primer `bun run typecheck` global falla. La configuración acotada del autor extendía el proyecto, pero sustituía sus plugins por una lista vacía, habilitaba imports TS y no incluía los consumidores anteriores. Por ello, sus pases no acreditaban compatibilidad con la configuración global. El fallo real está en `types.log`; no se elimina ni se presenta como deuda heredada.

`cambios-integracion.json` y su diff delimitan cinco archivos corregidos:

- Condiciones explícitas para valores opcionales. Las operaciones que interpretan la verdad de JavaScript usan `Boolean`, preservando esa semántica; no se sustituyen por igualdad con `true`.
- Import síncrono de archivos con excepción local comentada al diagnóstico Effect, como herramienta documental fuera de un programa Effect. No se desactiva ninguna regla anti-slop ni el diagnóstico global.
- `allowImportingTsExtensions` junto al `noEmit` existente: permite los imports explícitos que Node 24 ejecuta directamente. Coste: las herramientas que emitan JavaScript necesitarían su propia estrategia de resolución; este proyecto no emite mediante tsc.
- Sobrecargas del adaptador MJS para conservar `trace` en los modos booleanos y `evidence` en el modo causal. La frontera externa sigue sin otorgar admisión; la API causal conserva su validación en ejecución. Los casos anuales con campos adicionales siguen siendo utilizables. Se admite lectura de colecciones readonly sin mutarlas.
- Las mismas comprobaciones explícitas de ausencia en las pruebas nuevas. No se modifican las pruebas antiguas para conseguir el pase.

El cuerpo financiero del modo booleano se conserva dentro de `legacy`; no cambian sus operaciones. Los cambios no afectan al motor, tablas, inventario, confianza ni snapshots. Se consultaron las guías Effect y se conservaron las instrucciones de tipado global.

## Validación de integración

El rojo histórico ejecuta el consumidor anterior y falla por la aserción de productores anuales ausentes, no por un import. El verde conserva la aserción y activa el modo causal. Pasan 86 pruebas distintas: 44 causales nuevas, 21 SS anteriores y 21 de puertos. Los pases previos y posteriores se conservan, pero no se suman como cobertura distinta.

Pasan `bun run typecheck` principal/vendor (`types-integracion-5.log`), Oxlint con las dieciséis reglas anti-slop y ESLint global. La sonda adicional checkJs sigue sin pasar: once diagnósticos, idénticos al conjunto anterior al ignorar posiciones. `checkjs-comparacion.json` acredita ese contraste; la sonda aislada sin plugins no sustituye al chequeo global con Effect activo.

Los diez testigos históricos verificaron antes de las correcciones. Se generan diez testigos nuevos en `testigos-integracion.json.gz`, usando las mismas identidades de ejecución. El cotejo profundo exige igualdad de todo salvo `software`: entrada, contexto, programa, fuentes, eventos, frames, bindings, salidas y slices. Los testigos anteriores son rechazados por el consumidor actual y los nuevos verifican. Los diez nuevos también cumplen el schema 2020-12. Se conservan ambos juegos; no se reescriben hashes históricos para aparentar continuidad.

## Decisión y límites

Se recibe un segundo evaluador de primitivas sobre la misma IR, no una copia de fórmulas SS. Objeción experta: puede reproducir el mismo error al generar y verificar, o atribuir dependencias espurias sin alterar el dinero. Por eso el pase de replay no basta. La revisión nueva debe comprobar cada salida con expectativas propias, referencias por propiedad y llamada, unidades, selecciones, colecciones y adversos; también debe revisar el adaptador y las correcciones exactas de integración. D126 registra el coste de mantener esa segunda semántica finita.

Este informe no promueve atestaciones ni aceptación. El alcance de once salidas SS no acredita otros sitios, las 19 familias de actividad ni la composición.
