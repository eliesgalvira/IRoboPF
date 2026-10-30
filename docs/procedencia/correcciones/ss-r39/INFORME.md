# Contrato candidato de once recorridos SS

Se integra como candidato la implementación de once recorridos de cotizaciones, con su consumidor, schema, pruebas y evidencia. El contraste de integración examina archivos, fuentes, representación y resultados. La suficiencia de los cierres queda pendiente de una revisión independiente nueva; no se acepta fiscalidad ni se conecta al producto.

## Contraste y pruebas de integración

Se leen compilador, consumidor, pruebas, fuentes de cotizaciones/rendimientos, decisiones y reservas. La representación fija operaciones, argumentos, entornos, llamadas y selecciones por propiedad. Los bindings anuales transportan salario, año y modo; las once salidas llegan a `crearLineaCalculo` y `origen.decimal`. No se deduce suficiencia de la mera reconstrucción del artefacto.

Resultados terminales propios, con un trabajador y bloqueo de recursos por comprobación:

- 58 pruebas correctas: 37 originales y 21 nuevas recibidas, sin alterar esperados.
- 684 casos del consumidor sin diferencias con las expectativas de software recibidas y TS real; JSON idéntico al entregado. Se conserva la tolerancia original inferior a 1e-12 EUR. No son expectativas normativas ni una validación de cuotas TGSS ingresables.
- Reconstrucción estructural exacta: 1.172 operaciones, 62 celdas, 182 llamadas, 171 unidades de literales y 1.989 obligaciones.
- Typecheck principal y vendor correctos. Oxlint global con un hilo y ESLint global correctos; las 16 reglas anti-slop permanecen a error. MJS conserva `checkJs=false`, sin atribuir análisis estático completo.
- Schema correcto para el artefacto y un pendiente representable; no sustituye el verificador semántico.

Vitest usa `--configLoader native` y caché propia. Los instrumentos con salida histórica se copian a scratch y se adaptan sus rutas; se conservan los diffs y no se sobrescribe el informe recibido. Los productores de fragmento/recorridos del autor no se ejecutan sobre sus entregas. Python usa el entorno UV absoluto propio y `PYTHONDONTWRITEBYTECODE=1`.

Los rojos previos del autor, incidencias de selección, tipos y arnés permanecen intactos. Su ejecución anterior pudo escribir temporales Vite bajo el enlace al `node_modules` de integración; el autor lo documentó y repitió sus pruebas con cargador nativo. No se borra ese directorio ni se afirma que el cotejo del checkout acredite el árbol externo de dependencias.

## Observación candidata para revisión

`observacion-unidades.json` localiza cinco ocurrencias de `mei` etiquetadas como EUR. Cuatro son lecturas `parametros.mei`; la quinta es `mei: obtenerTiposMei(anio)`. Las fuentes TS describen ese valor como un objeto de tipos por lado. Se pide al revisor contrastar si la unidad declarada debe ser estructural y sus campos ratios. La clasificación por prefijo no constituye por sí sola un contrato dimensional adecuado.

Esto es una observación candidata de integración, no un hallazgo aceptado ni un cambio fiscal demostrado. No se corrige antes de su contraste independiente. Se debe revisar también el resto de `fieldUnits`, `literalUnits`, celdas y contratos de funciones, sin limitar el examen a esas cinco ocurrencias. Las coincidencias numéricas no zanjan su semántica.

## Decisión y alcance pendiente

Se incorpora el candidato exacto para revisión. Sus cierres de valor/selección se derivan conservadoramente de todas las obligaciones SS: un pendiente bloquea los once. Eso reduce disponibilidad ante una incertidumbre ajena; no autoriza omitir una dependencia. La revisión comprobará cada recorrido contra fuentes y contraejemplos independientes, incluida la frontera transparente de `medirAuditoriaSync` y las excepciones de instrumentación no simuladas.

Admisión anual externa, cierre del sitio, wiring y aceptación fiscal completa permanecen pendientes/falsos. Las coincidencias numéricas y los contratos candidatos no promueven atestaciones.

## Reproducción

`validacion.json` conserva comandos, orden y códigos terminales. Los scripts archivados como texto se ejecutan desde `/home/elies/Repos/IRoboPF`, con salidas en `.cache/orquestador-recepcion/r39`. La recepción usa el bloqueo acotado; cada validación usa `/tmp/irobopf-validacion-pesada.lock` y lo libera después. Para repetir, adaptar las rutas a otro scratch propio, conservando el diff y sin sobrescribir estos recibos. No ejecutar productores recibidos que escriben directamente en sus carpetas históricas.
