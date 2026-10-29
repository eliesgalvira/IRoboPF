# Los dos niveles de Option

En `detectarCasoNoSoportado`, `Option.fromNullishOr(caso.deducciones[0])` determina si hay primera entrada. Su onNone devuelve éxito con Option.none; no busca una entrada posterior. Su onSome consulta el catálogo y construye un resultado no soportado tanto si el catálogo devuelve none como si devuelve some; cambia el motivo. El anual propaga el resultado no soportado de ese camino.

Por tanto, «ambos fallan» solo describe las dos respuestas del catálogo, no las dos ramas del Option exterior. Para una lista tipada no vacía de objetos, la primera entrada existe; los controles null/undefined se refieren a la frontera JS y se mantienen separados. No se legitiman deducciones manuales ni se amplía el dominio fiscal.

El agregado `deduccionAutonomicaAgregadaCentimos ?? 0` no sustituye la consulta por código. La nueva representación debe conservar dos propiedades y dos transportes distintos aunque sus importes coincidan. Fuentes contrastadas: `lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts`, funciones `detectarCasoNoSoportado` y `sumarDeduccionesAutonomicasCentimos`; casos R34-03/04 y RA34-S02 recibidos.
