# Contraste independiente F-REV-01

Dictamen: **corrección de F-REV-01 aceptada en el alcance revisado**, sin objeción bloqueante nueva. Se levanta exclusivamente este hallazgo monetario. No certifica otros supuestos ni cierra IRPF2025; CI global y publicación corresponden al integrador.

Recepción: producto-f-auxiliares-correccion-20261105. MANIFIESTO SHA256 2f4ff26f55df9e11cfa359a91915d3ac410bb7d4d79dc4648d0f1f769859319b; entrega.patch SHA256 6cea32bc41c5028c3c3a4e4f73c3f4ab21c2802893d2f73706727668a938a377. Ambos verificados. Trece rutas de raíz idénticas a post/ al inicio y al cierre; FUENTES-ANTES.json y FUENTES-DESPUES.json. Verificadas las33 evidencias declaradas y los seis originales CAS. Se leyeron informe, manifiesto, parche, post/, pre-publico/, candidato-revisado/, revision-recibida/, originales conservados y validacion/, además de revisión y pruebas originales. No se alteró la recepción.

## Filiación y dinero

El delta productivo entre candidato-revisado/ y post/ está limitado a auxiliares-anual.ts: predicado grado1 con consanguinidad/adopción, filtrado del censo de padres para Madrid y comprobación de hijos propios convivientes para todos los integrantes descendientes de la unidad. El núcleo racional y las fórmulas no cambian en esta corrección (delta-candidato.diff). El filtro está condicionado al código Madrid: no modifica el régimen Murcia.

Reproducción original intacta sobre preimagen virtual:53 pruebas,49 verdes/4 rojos. Ambas API concedían indebidamente721,70 EUR al abuelo; con padre y abuelo en el censo dividían hasta360,85 EUR. Logs originales-pre.log y originales-pre-memoria.json; no fails ni skip añadidos a los originales. Sus bytes se preservan en originales/tests/ y ORIGINALES.json.

La corrección mantiene721,70 al único padre con abuelo presente en el grafo y censo parental correcto. Rechaza el censo que incluye al abuelo como progenitor y el nieto adicional incluido como hijo en la unidad, en ambas API. Dos padres auténticos mantienen360,85 cada uno. La adopción de primer grado mantiene721,70; un guardador judicial conviviente adicional no se convierte en progenitor ni divide el derecho del padre.

## Cambio de arnés: no oculta el fallo

El arnés original usaba Effect.runSync esperando una liquidación exitosa también ante censos inválidos. La API existente comunica ResultadoNoSoportado mediante Effect.fail. Effect.result captura ese error tipado como Failure; no convierte automáticamente en verde ni captura defectos arbitrarios como un rechazo fiscal válido.

Prueba discriminante: los cuatro BLOQUEANTE integrados adaptados siguen rojos sobre el candidato defectuoso (arnes-pre.log), precisamente porque retorna Success. Sobre la corrección pasan. Se mantienen esperados0 y prohibición360,85. El segundo esperado original era sólo «distinto de360,85»; aislado es débil. El helper nuevo exige Failure y libro territorial, y mis pruebas adicionales exigen además ResultadoNoSoportado, libro total0 y motivo concreto progenitores.convivientesDevengo o auxiliares.filiacion_unidad. Por tanto, un error ajeno o una deducción positiva en ese libro no satisfacen el contraste.

## Rectificación de los dos it.fails antiguos

La objeción del integrador está fundada. Los originales en pre-publico/ sólo aportaban contador de hijos o gasto global, sin eventos ni gastos por menor. adaptarHechosAuxiliar exige esos hechos y lanza RangeError «Hechos insuficientes para deducción: ...» antes de poder evaluar los importes; it.fails aceptaba esa excepción. No demostraban por sí solos un defecto fiscal activo del agregador. Rectifico esa calificación de la revisión original.

La prueba actual exige el rechazo específico sin hechos y, con un parto múltiple de dos hijos/un padre, mantiene2886,80 EUR; con dos menores/gasto5000 por menor/un titular mantiene2000 EUR. Se ejecutó con éxito. deducciones-autonomicas-aplicadas.ts es idéntico byte por byte al commit público47dec72e: SHA2561861fb500aea64c0cf176a6deffed4c9d3c2c3c2493c0c03030b748f047fb759. El cambio de fixtures no repara una fórmula ni elimina esos importes. Esta conclusión se limita a esas entradas y hechos.

## Fundamento primario acotado

Original BOCM Ley13/2023, página física4, art4.1–3, CAS eed67aed…: cuantía por hijo nacido/adoptado y reparto entre padres convivientes, no entre todos los titulares potenciales del mínimo. Se verificaron bytes y extracción Madrid-art4.txt. No se repite toda la auditoría normativa previa.

Para la unidad no conyugal consulté además el [BOE, Ley35/2006, art82.1.2ª y82.3](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20250101&tn=1#a82): exige padre/madre e hijos convivientes, composición al31 de diciembre. La herramienta web falló; se recuperó directamente de BOE con curl. Bytes originales fijados en CAS externo y FUENTES-LEGALES.json; extracción IRPF-art82.txt. Esto respalda rechazar nietos dentro del perfil de hijos, sin abrir una certificación de modalidades reservadas.

## Pruebas, recursos y límites

Conjunto final:185 verdes únicos en cinco archivos, sin omitidos:53 revisión integrada,14 exactos,4 filiación,100 procedencia y14 pruebas propias. No se suman las ejecuciones previas ni se agregan a los672 del padre. Los49 filtrados en arnes-pre son selección de casos, no éxitos adicionales. Las dos omisiones previas de maternidad quedan fuera de esta selección; no se ejecutaron ni certificaron.

La primera ejecución propia produjo183 verdes/2 rojos: asumí que adopción grado2 llegaría al libro territorial. El validador previo de mínimos ya la rechaza expresamente. Se conservan log y primera versión; ajusté sólo ese esperado al motivo previo concreto y ausencia de libro. La ejecución final pasó185. Es una corrección del arnés propio documentada, sin cambiar importe alguno ni código productivo.

Tipos focales: strict+exactOptionalPropertyTypes,5 raíces/660 fuentes,0 diagnósticos. No se afirma una nueva campaña global ni un chequeo independiente del plugin Effect. Se consultaron effect-solutions list/show testing error-handling y fuente local Effect.result antes de escribir Effect; constan logs.

Todas las suites propias se ejecutaron secuencialmente con un worker, heap1792MiB y timeout externo y del hijo. Medidor adaptado de recepción: límite árbol3GiB/grupo6GiB. No activó guardia. Mayor PSS muestreado propio1409372160 bytes y mayor grupo4985413632 bytes, ambos en tipos. Cada sesión se esperó hasta su salida real antes de la siguiente. No hubo delegación, worktree, instalación, copias de repo, borrados, VCS mutante, inventario global, CI global, capturas ni push. Sólo se escribió esta entrega y el nuevo original BOE en CAS externo.

Pruebas portátiles en tests/contraste-filiacion.test.ts; entrega.patch añade ese archivo a la integración congelada. Manifiesto fija parche y evidencias. COMANDOS.md y las mediciones contienen las reproducciones. Los procesos propios de pruebas/tipos y guardias están finalizados; PESADO1 liberado al cierre.
