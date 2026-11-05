# Contraste independiente acotado: residencia P1 y API 32.2

**APTO para cerrar el P1 y la objeción de alcance público 32.2 en este candidato, con las reservas expresas siguientes. Sin nuevo bloqueo monetario identificado.** Es un dictamen nuevo de contraste, no una reedición del revisor original ni una aprobación fiscal general o de publicación.

Candidato: `/home/elies/Backups/IRoboPF/producto-p5a-integracion-20261105`, base declarada `9bac679032fd9cbfc492fc150acfea0c0fcdb9a2`. Parche SHA256 `8934148f18b0ac5eb03839ba3d134bf76e0bf7da4a8efbc76d3be57ab925af70`; manifiesto SHA256 `1848639576ef45fc37f1b900a2bb190ef95b3d220bb6c507062a2329debbcbf3`.

## Conclusión monetaria

La nueva condición de `habitual`, en `vivienda-rioja.ts`, vincula el final de residencia a la adquisición para esa operación. Ya no basta reutilizar los tres años de una residencia abandonada. Los casos propios que terminan la víspera de comprar dan cero en el adaptador y las dos API, también añadiendo documentos de excepción de ocupación, permanencia o ambos. No se fuerza que la ocupación comience después de comprar: una ocupación desde2020 continuada hasta diciembre2025 conserva 452 euros para precio directo12000 de32.2 y382,50 euros para la operación financiada de32.11. Ocupación futura dentro de doce meses conserva los importes condicionales; fuera del plazo sin excepción da cero. La guarda no altera las otras operaciones, contrastadas mediante regresiones del consumidor.

La API anual comprueba `prestamo === null` para32.2 antes de llamar al productor. Con préstamo devuelve `ResultadoNoSoportado`, motivo concreto de financiación pendiente y sin importe/total/deducciones publicadas. No transforma la reserva en derecho cero. No se elude anulando préstamo y conservando censo o movimientos: el productor exige censo exacto, disposición cero sin préstamo y coherencia entre libro, pagos e inventario anual. Probé anulación sola, retirada de censo, retirada de flujos, retirada de ambos, ausencia de patrimonio y deuda añadida al censo de una compra directa. Todas rechazan en el adaptador y ambas API. Si se sustituyen todos los hechos por una operación íntegramente sin préstamo y conciliada, se trata de otra entrada; no existe verificación de autenticidad bancaria implícita.

Una compra directa adicional de1200 euros produce exactamente60 euros en los tres accesos. Evita que el límite452 oculte un error de base.32.11 sigue admitiendo el préstamo oficial del fixture y conserva382,50 euros; no traslado sus conceptos financieros a32.2. El consumidor aislado conserva su aritmética parcial condicionada: no avalo57,50/127,50 para32.2 financiada ni invento55/125.

## Evidencia y límites

Leídos el hallazgo original, corrección/validación, entradas, código de habitualidad/productor/adaptación anual y sus pruebas, investigación de intereses y fuentes recibidas. Consultados en CAS el original Ley2/2020 y RIRPF histórico20/12/2011; hashes en `transporte.json`. La remisión a habitualidad no convierte una residencia abandonada en residencia de una compra nueva;32.11 contiene enumeración financiera expresa. No se ha repetido la investigación de intereses ni se aplica normativa2026.

Los cuatro rojos originales se corrigieron antes de acotar financiación según el log recibido de129 verdes. Verifiqué que la prueba original del revisor sigue íntegra en `antes-acotar-322/tests`, salvo normalización de imports. No ejecuté de nuevo esas129 entradas históricas contra el corte intermedio. Las pruebas32.2 actuales utilizan entradas distintas sin préstamo: los452 euros no acreditan las anteriores operaciones financiadas. Los ocho oráculos históricos siguen congelados y condicionados.

Permanencia futura es expectativa sometida a cumplimiento y regularización: la advertencia pública ahora lo dice expresamente. Las excepciones materiales y su autenticidad no quedan acreditadas por documentos genéricos; esta corrección no certifica todas las modalidades del artículo54. Sigue siendo necesario distinguir el perfil habilitado de supuestos excepcionales fuera de su acreditación. No encuentro motivo para bloquear el cierre acotado por esos límites declarados. No se valida IP general, DT18, cotitularidad ni otras combinaciones tributarias.

## Ejecución propia

Pasada final: **369 pruebas únicas verdes =22 propias +134 focales recibidas +213 regresiones del consumidor (184+29)**. Son cinco archivos de prueba distintos; no sumo de nuevo las134 ni las pasadas preliminares. No repetí1562. Las propias comprueban importes o rechazo en adaptador/canónica/explícita; se cuentan casos, no aserciones como pruebas adicionales.

Los logs preliminares se conservan: una resolución virtual incorrecta impidió cargar la suite; después siete aserciones propias suponían equivocadamente que el fallo tipado era instancia deError. Se corrigió el arnés para verificar su `_tag`, motivo y ausencia de importe. No se tocó producto ni se relajó un esperado monetario. Pasada final completa verde.

No añadí TypeScript: las pruebas nuevas sonMJS y el helperMJS se deriva de la fixture recibida. No vuelvo a atribuirme tipos/lints del padre ni los repito sin cambioTS. El CLIeffect-solutions no está disponible; se consultó el ejemplo local v4 `packages/effect/test/Effect.test.ts` para el runSync heredado. No se escribe códigoEffect de producto.

Ejecución secuencial en el turnoPESADO1, afinidad dosCPU, maxWorkers1, fileParallelismfalse, heap1792MiB, timeout-k30s/15m por hijo y45m por ejecutor. Guardia árbol3GiB y cgroup real conjunto6GiB, sin activación ni reintentos por guardia. Máximos de la pasada final: árbol681402368 bytes; grupo4535246848 bytes. Cada ejecutor terminó en segundos; no quedan hijos activos. Las cachésVite son externas.

## Conservación y entrega

1275 archivos congelados comparados antes/después sin deriva; se comprobaron también conjuntos de fuentes de raíz, los diez transportes aplicados sólo en memoria y hashes de las fuentesCAS recibidas. `integridad.json` contiene los sellos; los snapshots pre/post comparten SHA256 `d7b883346812d3529dc817cce8a978807109b0746e95d34116d6cafc979ef942`. Se usó únicamente `verificar-lectura.py` propio, nunca el verificador recibido que escribe en candidato.

`revision.patch` transporta la pruebaMJS, su helper y este dictamen, sin aplicarlos. El resto de herramientas y evidencia queda sellado por `manifiesto.json` y `manifiesto.sha256`. Sin copias completas, dependencias, entornos, worktrees, borrados, VCS mutante, push/PR/CI, mensajes a terceros ni subdelegación. No certifico un censo global de150GB; esta entrega sólo agrega archivos pequeños. La reproducción de workflow previa a publicación sigue siendo responsabilidad de la integración, fuera de este contraste.

**PESADO1 LIBERADO.**
