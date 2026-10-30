# Evidencia causal de retenciones y pagos

Implementación candidata integrada por archivos. Las seis salidas comparten contexto causal anual y el núcleo finito extraído de SS. La suficiencia de esa evidencia y de las nuevas operaciones permanece pendiente de revisión independiente. No se modifican fórmulas fiscales ni se concede admisión o aceptación fiscal.

## Integridad y cambios

Los únicos archivos base de producto modificados son `causal-ss-r54.ts`, `evidencia-ejecucion-r54.ts` y `flujo-retenciones-r34-consumidor.mjs`. El nuevo núcleo deriva contratos por dominio; el adaptador R34 usa modo causal opcional y conserva los booleanos anteriores. Las APIs exportadas exigen fuentes y obligaciones satisfechas. La instrumentación añade soporte finito de colecciones, presencia, continuaciones, escalas por llamada y unidades. No se acepta su suficiencia por el mero hecho de que el replay coincida.

## Ajustes de integración

La prueba nueva `causal-comun-r57.test.ts` dependía de un módulo histórico en la caché del autor. Se conserva ese original y se incorpora `tests/fixtures/procedencia/ss-pre-r57.ts` con los tres imports de scripts convertidos a rutas relativas. Solo cambia el import de esa prueba; las aserciones y la implementación histórica quedan intactas. `ajustes.json`, originales y diff documentan el cambio. No se edita ningún test histórico recibido en rondas anteriores ni se usa este fixture como oracle fiscal independiente.

## Validación y revisión pendiente

Se ejecutan en la raíz los tests nuevos y de compatibilidad, N01/N02 y la suite causal SS original, porque el núcleo compartido afecta a ambas verticales. Los recuentos de testigos y de pruebas se solapan; no se suman como reglas verificadas. Se comprueban tipos globales principal/vendor, lint global y testigos actuales con los verificadores reales. Resultado en la raíz: 135 pruebas correctas, tipos globales principal/vendor correctos, Oxlint sin diagnósticos y ESLint con cero errores y doce avisos registrados. Los verificadores reales aceptan los 33 testigos recibidos actuales y sus 284 salidas. Los resultados exactos y comandos se registran en los JSON/logs de esta carpeta. La deuda checkJs sigue abierta; un pase del proyecto TypeScript no la elimina.

La nueva revisión independiente debe examinar las seis salidas individualmente, especialmente la separación identidad/valor/selección en filter/sort/find, las continuaciones de guardas, unidades declaradas, filas de escala por invocación, variantes ausencia/cero/rechazo, todas las fronteras exportadas y la compatibilidad SS. Tiene que distinguir comprobaciones locales del replay compartido y aportar expectativas y adversos propios. D129 recoge el coste de compartir núcleo y mantener testigos fijados a software.

Las cuatro puertas permanecen falsas. El dictamen de seis salidas candidatas no acredita las 19 familias de actividad, la composición global ni la admisión anual.

Schemas: quince testigos de retenciones, dieciocho SS y contrato válidos; el histórico conserva forma válida sin acreditar aceptación con software nuevo. El contraste de integración reproduce el rojo previo con los bytes del consumidor anterior (AssertionError por contexto causal ausente) y el verde actual con las mismas aserciones, adaptando solo rutas. Logs y fuentes conservados.
