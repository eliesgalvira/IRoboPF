# Resultados efectivos

58 pruebas correctas:37 originales intactas y21 nuevas; cero fallidas en el pase definitivo. Los rojos/diagnósticos intermedios se conservan en logs separados.684 casos del consumidor R36: cero divergencias con expectativas recibidas y TS real, tolerancia original, sin aceptación fiscal. Tipos TS, Oxlint, ESLint y schema terminan0. CheckJs=false: el cuerpo MJS no recibe tipado completo. ESLint conserva aviso sobre pages en proyección.

Previo a implementar: ocho rojos semánticos y uno adicional de semilla literal, exit1 conservado. No se convierten en hipótesis fiscales ni se alteran esperados históricos.

Cotejo inicial de20227 entradas completo con cero diferencias/borrados. El cotejo final se adjunta como fisico-final.json.gz; los sobres/recibo posteriores se verifican por manifiesto y ensayo. Todas las altas tienen baseSha256=null. El manifiesto excluye sus propios sobres para evitar autorreferencia. La revisión independiente y el contraste del padre siguen pendientes.

Actualización final: las58 pruebas pasan con --configLoader native y cacheDir propio. Tras literalUnits pasan de nuevo tipos/Oxlint/ESLint/schema y los684 casos. validacion.json fija los resultados y la desviación previa de temporales Vite; no se declara intacto node_modules externo por el cotejo del checkout.
