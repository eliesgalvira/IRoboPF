# Recepción e integración de la vertical causal SS R55

Se incorpora como candidato el seguimiento ejecutado de las once salidas SS. La recepción exacta y la compatibilidad técnica están comprobadas; la suficiencia causal requiere una contrarrevisión independiente nueva. No se acepta el cierre global de 65 sitios y 19 familias, la admisión anual ni una regla fiscal.

## Recepción y conservación

Entrega de Sol 6.1 High en `/home/elies/.t3/worktrees/IRoboPF/t3-17aedb5e`, contra `34b77cb654064e6cc7ea6108680c2fabd301e068`. El padre cotejó físicamente sus 22.112 entradas: bytes, enlaces y modo ejecutable, mediante blobs individuales. La única modificación base es el consumidor SS; no hay borrados. Se comprobó el censo de extras y se reconstruyeron exactamente las 105 rutas del payload desde patch y objetos, incluidos vacíos. `recepcion.json` conserva hashes y rutas; el hash del patch gzip y el del texto descomprimido son identidades distintas, ambas comprobadas.

Se incorporan 25 rutas de código y documentación de la entrega. El transporte completo y los instrumentos se conservan en `.cache/orquestador-recepcion/r55/transporte`; las fuentes técnicas y ambas ediciones de los archivos corregidos, en `.cache/orquestador-preservacion/recepciones-r55/sha256`. Estos directorios de la raíz sobreviven al worktree del hijo. No constituyen custodia remota independiente. Los informes, el manifiesto y los diez testigos originales del hijo permanecen intactos.

## Correcciones del padre

El primer `bun run typecheck` global falla. La configuración acotada del hijo extendía el proyecto, pero sustituía sus plugins por una lista vacía, habilitaba imports TS y no incluía los consumidores anteriores. Por ello, sus pases no acreditaban compatibilidad con la configuración global. El fallo real está en `types.log`; no se elimina ni se presenta como deuda heredada.

`cambios-integracion.json` y su diff delimitan cinco archivos corregidos:

- Condiciones explícitas para valores opcionales. Las operaciones que interpretan la verdad de JavaScript usan `Boolean`, preservando esa semántica; no se sustituyen por igualdad con `true`.
- Import síncrono de archivos con excepción local comentada al diagnóstico Effect, como herramienta documental fuera de un programa Effect. No se desactiva ninguna regla anti-slop ni el diagnóstico global.
- `allowImportingTsExtensions` junto al `noEmit` existente: permite los imports explícitos que Node 24 ejecuta directamente. Coste: las herramientas que emitan JavaScript necesitarían su propia estrategia de resolución; este proyecto no emite mediante tsc.
- Sobrecargas del adaptador MJS para conservar `trace` en los modos booleanos y `evidence` en el modo causal. La frontera externa sigue sin otorgar admisión; la API causal conserva su validación en ejecución. Los casos anuales con campos adicionales siguen siendo utilizables. Se admite lectura de colecciones readonly sin mutarlas.
- Las mismas comprobaciones explícitas de ausencia en las pruebas nuevas. No se modifican las pruebas antiguas para conseguir el pase.

El cuerpo financiero del modo booleano se conserva dentro de `legacy`; no cambian sus operaciones. Los cambios no afectan al motor, tablas, inventario, confianza ni snapshots. Se consultaron las guías Effect y se conservaron las instrucciones de tipado global.

## Validación del padre

El rojo histórico ejecuta el consumidor anterior y falla por la aserción de productores anuales ausentes, no por un import. El verde conserva la aserción y activa el modo causal. Pasan 86 pruebas distintas: 44 causales nuevas, 21 SS anteriores y 21 de puertos. Los pases previos y posteriores se conservan, pero no se suman como cobertura distinta.

Pasan `bun run typecheck` principal/vendor (`types-integracion-5.log`), Oxlint con las dieciséis reglas anti-slop y ESLint global. La sonda adicional checkJs sigue sin pasar: once diagnósticos, idénticos al conjunto anterior al ignorar posiciones. `checkjs-comparacion.json` acredita ese contraste; la sonda aislada sin plugins no sustituye al chequeo global con Effect activo.

Los diez testigos históricos verificaron antes de las correcciones. Se generan diez testigos nuevos en `testigos-integracion.json.gz`, usando las mismas identidades de ejecución. El cotejo profundo exige igualdad de todo salvo `software`: entrada, contexto, programa, fuentes, eventos, frames, bindings, salidas y slices. Los testigos anteriores son rechazados por el consumidor actual y los nuevos verifican. Los diez nuevos también cumplen el schema 2020-12. Se conservan ambos juegos; no se reescriben hashes históricos para aparentar continuidad.

Incidencias del instrumento del padre: `python` y `python3` no estaban en PATH; se usó Nix. Un helper de sustitución confundió el nombre `callback` con `edge` y se corrigió la edición pendiente. El primer ensayo intermedio de tipos coincidió con ediciones y no se usa como evidencia final; un segundo comando todavía en cola se canceló. Los siguientes ensayos detectaron incompatibilidades reales con casos readonly y con parámetros del router, corregidas sin editar esos tests. El primer comparador de testigos esperaba un mensaje específico de software, pero el consumidor utiliza el mensaje genérico de replay; se conserva ese fallo y se corrige solo la expectativa del arnés. La igualdad salvo software ya se comprueba antes de exigir ese rechazo. Los logs finales se obtienen con las fuentes fijadas.

## Decisión y siguiente contraste

Se recibe un segundo evaluador de primitivas sobre la misma IR, no una copia de fórmulas SS. Objeción experta: puede reproducir el mismo error al generar y verificar, o atribuir dependencias espurias sin alterar el dinero. Por eso el pase de replay no basta. La revisión nueva debe comprobar cada salida con expectativas propias, referencias por propiedad y llamada, unidades, selecciones, colecciones y adversos; también debe revisar el adaptador y las correcciones exactas del padre. D126 registra el coste de mantener esa segunda semántica finita.

Este informe no promueve atestaciones ni aceptación. Los otros 54 sitios y 19 familias siguen pendientes del protocolo causal y de composición. La copia v5 conserva el corte R26; Crossa conserva v1 y está desfasado. No hay main, PR, despliegue, LFS, gasto, transferencia externa ni limpieza. El encargo global sigue abierto.

## Respaldo y revisión lanzada

Commit `ac91fb9eb327aa3cc74dae64b31565c23a4e3dd1` en origin/procedencia-documental: 75 archivos, 6.342.709 bytes, hashes cotejados y cero borrados. El cotejo físico del padre examinó las 22.114 entradas de su base; el commit resultante contiene 22.185 entradas. Las seis diferencias históricas excluidas permanecen intactas.

Lanzada una única revisión independiente nueva sobre ese commit, con gpt-6.1-sol, high y priority explícitos y confirmados por el lanzador. Encargo y respuesta íntegros en delegaciones-ronda55.json. Su finalización reactiva al padre, sin sondeos ni lecturas parciales. El resultado se contrastará antes de aceptar suficiencia o extender el protocolo.
