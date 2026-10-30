# Recepción de evidencia causal de retenciones y pagos R57

Implementación candidata integrada por archivos. Las seis salidas comparten contexto causal anual y el núcleo finito extraído de SS. La suficiencia de esa evidencia y de las nuevas operaciones permanece pendiente de revisión independiente. No se modifican fórmulas fiscales ni se concede admisión o aceptación fiscal.

## Integridad y cambios

Base del hijo `4f4de8cac1b0bc75c0da654e4b0ec051df6c074b`: cotejadas físicamente las 22.293 entradas contra blobs individuales, con lstat/readlink/bytes/ejecutable. Tres modificaciones autorizadas, cero borrados. El diff aparente de 749 líneas retiradas corresponde a extracción del intérprete SS a un módulo común, no a borrado de archivos del motor. Se comprueban también altas y extras, no solo el índice Git.

Transporte exacto de 172 rutas desde patch y objetos; para las tres modificaciones se usan exclusivamente sus preimágenes base. Incorporadas 130 rutas, 41.519.412 bytes, incluidas fuentes nuevas, tests, schemas, documentación, históricos y sobre. Cada archivo tiene menos de 10 MiB. Las 23 referencias técnicas se conservan por SHA-256, SHA-512 y tamaño fuera del worktree del hijo en el CAS del padre. `recepcion.json` y `cas-preservado.json` fijan rutas y bytes; los históricos propios del autor no se confunden con los recibidos antes de este encargo.

Los únicos archivos base de producto modificados son `causal-ss-r54.ts`, `evidencia-ejecucion-r54.ts` y `flujo-retenciones-r34-consumidor.mjs`. El nuevo núcleo deriva contratos por dominio; el adaptador R34 usa modo causal opcional y conserva los booleanos anteriores. Las APIs exportadas exigen fuentes y obligaciones satisfechas. La instrumentación añade soporte finito de colecciones, presencia, continuaciones, escalas por llamada y unidades. No se acepta su suficiencia por el mero hecho de que el replay coincida.

## Ajuste de integración y fallos del padre

La prueba nueva `causal-comun-r57.test.ts` dependía de un módulo histórico en la caché del autor. Se conserva ese original y se incorpora `tests/fixtures/procedencia/ss-pre-r57.ts` con los tres imports de scripts convertidos a rutas relativas. Solo cambia el import de esa prueba; las aserciones y la implementación histórica quedan intactas. `ajustes.json`, originales y diff documentan el cambio. No se edita ningún test histórico recibido en rondas anteriores ni se usa este fixture como oracle fiscal independiente.

El primer helper de recepción supuso modo 0644 para todo el payload; el manifiesto contiene un lock uv con 0666. Se corrigió el supuesto y se reconstruyen los modos declarados, conservando el instrumento inicial. Ese lock queda en scratch reconstruido, no como archivo de producto. La primera comprobación global de tipos detectó además una preimagen conservada con extensión `.ts`, que se intentó compilar fuera de su directorio original. Se preservan sus bytes como `.ts.txt`; `preimagenes.json` recoge las rutas. Se conservan el diagnóstico y los intentos, sin atribuirlos al autor ni al motor.

## Validación y revisión pendiente

Se ejecutan en la raíz los tests nuevos y de compatibilidad, N01/N02 y la suite causal SS original, porque el núcleo compartido afecta a ambas verticales. Los recuentos de testigos y de pruebas se solapan; no se suman como reglas verificadas. Se comprueban tipos globales principal/vendor, lint global y testigos actuales con los verificadores reales. Resultado en la raíz: 135 pruebas correctas, tipos globales principal/vendor correctos, Oxlint sin diagnósticos y ESLint con cero errores y doce avisos registrados. Los verificadores reales aceptan los 33 testigos recibidos actuales y sus 284 salidas. Los resultados exactos y comandos se registran en los JSON/logs de esta carpeta. La deuda checkJs sigue abierta; un pase del proyecto TypeScript no la elimina.

La nueva revisión independiente debe examinar las seis salidas individualmente, especialmente la separación identidad/valor/selección en filter/sort/find, las continuaciones de guardas, unidades declaradas, filas de escala por invocación, variantes ausencia/cero/rechazo, todas las fronteras exportadas y la compatibilidad SS. Tiene que distinguir comprobaciones locales del replay compartido y aportar expectativas y adversos propios. D129 recoge el coste de compartir núcleo y mantener testigos fijados a software.

Las cuatro puertas permanecen falsas. Los seis sitios son candidatos; los otros 48 y las 19 familias, composición y admisión siguen pendientes. Motor fiscal, inventario, confianza y 45 snapshots no cambian. V5 r2 mantiene el corte R26; Crossa conserva v1 desfasado, copia local fuera de Victus y sin custodia independiente. Sin LFS, gasto, transferencia o limpieza. El encargo global continúa abierto.

Schemas: quince testigos de retenciones, dieciocho SS y contrato válidos; el histórico conserva forma válida sin acreditar aceptación con software nuevo. El padre reproduce el rojo previo con los bytes del consumidor anterior (AssertionError por contexto causal ausente) y el verde actual con las mismas aserciones, adaptando solo rutas. Logs y fuentes conservados.

## Respaldo y contrarrevisión

Bloque respaldado en origin, commit `65c9eb0e5e2e63f3db4fd06452aa93e389054746`: 168 archivos, hashes cotejados y cero borrados. Lanzada una única contrarrevisión independiente de las seis salidas y del núcleo compartido sobre ese commit y sus 22.458 entradas, con gpt-6.1-sol, high y priority explícitos y confirmados. Encargo y respuesta completos en delegaciones-ronda58.json. Su finalización reactivará este hilo; no se sondea ni se lee trabajo parcial.
