# Correcciones públicas de X: evidencia y continuación de fixes

Base histórica examinada: `b6339967dec543d78cd69f7f56a04870c3ac9b07`. Las conclusiones y referencias al motor de este informe corresponden a esa base. La revisión posterior de estas afirmaciones y de la evidencia de redondeo está en [la contrarrevisión de correcciones de X](../../revisiones/correcciones-x-v1/INFORME.md).

`pruebas/validacion.log` registra dos pruebas focalizadas, lint y comprobaciones de tipos. Son controles técnicos acotados; no acreditan aceptación fiscal de las correcciones.

La búsqueda ha recuperado siete posts del corrector `@tzautxi` relacionados con esta conversación: cinco respuestas directas al estado encargado, con cinco imágenes repartidas en cuatro posts, y dos posts en una rama sobre IPC. Se han contrastado además ancestros, citas y candidatos de expansión: 60 posts solicitados al script de Reactivity. El número no significa exhaustividad de X ni 60 correcciones. El estado encargado es respuesta a `2051954837579800679`; la conversación tiene raíz `2051953980767367299`. La sexta respuesta directa recuperada pertenece a Elies y habla del código, no añade una corrección fiscal.

## Resultado y límites de la investigación

Diez afirmaciones separadas en `hallazgos.json` y `correcciones/CX-01.md` a `CX-10.md`. CX-02 identifica el reparto histórico de solidaridad que ya fue corregido en el perfil canónico. La decisión independiente precisa es `SS-SOLIDARIDAD-REPARTO-2025`, en `docs/procedencia/revisiones/seguridad-social/revisiones.json`; su aceptación se limita al reparto, no a la liquidación TGSS anual. D018 y `correcciones/trabajo-y-cotizaciones.md` explican el fix anterior. Se documenta una regresión positiva para el salario de 132.500 euros y una reproducción del comportamiento legacy. No se presenta como rojo nuevo ni como revisión independiente de aquella aceptación.

Las otras nueve afirmaciones permanecen indeterminadas como correcciones fiscales concretas. Se conservan coincidencias aritméticas, las entradas ausentes y los lugares precisos que debe investigar el siguiente implementador. No se ha demostrado aquí un defecto fiscal presente con entradas completas y evidencia suficiente para exigir un fix numérico. No se inventan entradas ni un rojo para cumplir formalmente la entrega. Esto deja **incompleta la acreditación de correcciones nuevas** en esta investigación; el mapa siguiente es el trabajo restante y no acredita un cierre fiscal.

## Mapa de continuación

1. CX-01/CX-03: contrato mensual de cotización. Archivo `lib/dominio/laboral/cotizaciones-perfil-uniforme.ts`, conexión en `liquidacion/liquidar-irpf-anual.ts`. Obtener instrucción TGSS primaria sobre precisión de bases y redondeo por concepto/tramo; fijar remuneraciones mensuales, días, grupo y contrato. Recalcular fuera del motor, escribir rojo del contrato mensual y revisar antes de aplicar. El perfil examinado declara `redondeoTgss: pendiente`; no redefinirlo silenciosamente. Las anotaciones 673,44/132,84 se reproducen bajo hipótesis de redondeo mensual, distinta de la salida analítica 673,42246/132,74372.
2. CX-04/CX-06: escalas estatal/autonómica y mínimos. Archivos `cuotas/escalas-gravamen.ts`, `liquidacion/liquidar-irpf-anual.ts`, `minimos/minimo-descendientes.ts`. La captura no fija decimal interno ni todos los hechos familiares. Verificar reglas de casillas, orden de minoración y reparto con AEAT; no usar «par» como teorema sobre euros enteros. El modo simulado no es una comunidad autónoma real. Test rojo únicamente al disponer del caso exacto.
3. CX-05/CX-10: retención versus liquidación. Conservar separados modelo 145, art. 85.3 RIRPF, elección individual/conjunta, mínimos y DA 61 del año. La tabla no muestra ejercicio ni territorio. Revisar los contratos examinados de retenciones y trabajo anual, y las decisiones TDE-20/22/23 sin extender aceptaciones. No aplicar una tabla con hipótesis ausentes a la API canónica.
4. CX-07: comparación nominal/real 2025–2026. Fijar escenario IPC, bruto nominal, rastro decimal y cuotas antes/después de transformación. La captura muestra rendimiento previo, no base liquidable, y un factor 1,0300. No pisar `compatibilidad-legacy/progresividad-frio.ts` ni el oracle. La anotación 2.938 € no es un cálculo independiente documentado.
5. CX-08/CX-09: separar comparación de poder adquisitivo, actualización contractual del salario y deflactación normativa. La rama literal aclara esta diferencia; no desplazar IPC un año ni imponer suelo cero sin contrato de modelo y fuente. D031 ya separa hipótesis 2026 de observación. Una predicción de deflactación no autoriza modificar tramos.

La promoción de estos hallazgos requiere revisión independiente de la evidencia y de sus hipótesis. La adición ejecutable propuesta en esta base es una regresión de CX-02, sin cambio fiscal; el reparto aceptado ya estaba corregido.

## Adquisición y cobertura

La búsqueda usó Grok CLI; consultas y resultados de descubrimiento en `pruebas/grok-02.txt`, `grok-03.txt`, `grok-04.txt`. Los resultados de búsqueda, por sí solos, no se usaron para acreditar un post. Se utilizaron `conversation_id`, `from`, `to`, `quoted_tweet_id`, URLs, filtros de imágenes, paginación `max_id`/`since_id` y cuatro frases después de verificarlas. `in_reply_to_tweet_id` dio error de dependencia según Grok; no se contabiliza como ausencia de respuestas. La repetición por frases no aportó nuevos posts vinculados al proyecto.

Se leyó entero `/home/elies/Repos/Reactivity/scripts/fetch-x-posts.nu` y se ejecutó sin modificarlo mediante `nix shell nixpkgs#nushell -c nu … <urls>`. Sus resultados saneados contienen handle público, texto, fecha, enlaces y medios; no perfiles ni cookies. La normalización elimina enlaces, handles iniciales y espacios y puede aceptar solo un prefijo cuando `note_tweet` existe. `pruebas/clasificacion-embed.json` conserva texto X y la clasificación; `posts-verificados.json` distingue completo normalizado, prefijo y error. Las colas de prefijos no son evidencia literal acreditada. Los padres y citas contrastados se conservan; una mención no se convierte en filiación.

Los originales de imágenes de la conversación relacionada se adquieren con `name=orig`, sin transformación, con UA `IRoboPF-auditoria/1.0`, límite de 10 MB, dos intentos como máximo y pausa. SHA-256 se comprueba tras copia. `imagenes.json` separa fecha de publicación y adquisición, MIME, bytes, URL, post y handle. El CAS `cas-x-no-oficial/` es de afirmaciones públicas y capturas de producto, **no corpus oficial**. Se inspeccionaron visualmente los originales relacionados, sin OCR. `transcripciones.json` conserva cálculos, signos, unidades, columnas y huecos; los puntos sin etiqueta de las gráficas no se inventan.

La captura del post `2051958135284232358` contiene avatar incidental: se excluye de publicación y de copia a la entrega; se conserva referencia/hash. Los candidatos de otras conversaciones de `@tzautxi` recuperados por búsqueda mensual amplia quedan descartados del alcance, con sus textos contrastados pero sin incorporar sus imágenes ni formular hallazgos fiscales. La imagen GIF de una recomendación no contiene evidencia de corrección y no se descargó. Es un límite explícito de la adquisición, no cobertura de todos los medios de todos los candidatos.

## Decisiones, objeciones y costes

- Separar cada proposición evita aceptar la cuota mensual porque los tipos coincidan. Objeción experta: los mismos números admiten órdenes de redondeo distintos. Coste: un hallazgo histórico corregido y pendientes documentales distintos.
- Conservar la precisión de lo observado evita reconstruir una entrada desde texto a dos decimales. Objeción experta: el rastro formateado no prueba el decimal usado. Coste: CX-04/CX-07 no tienen rojo fiscal nuevo.
- No publicar la captura con avatar respeta el límite de privacidad. Objeción experta: archivar todo sin filtro excede el permiso. Coste: esa imagen solo se referencia por hash y URL, no se redistribuye.
- Conservar oracles, registros y contratos al contrastar la evidencia. Objeción experta: un verde obtenido editando expectativas no confirma una norma. Coste: cualquier fix requiere revisión independiente sobre una base identificada.

Integridad, autenticidad, interpretación, exactitud y aceptación son dimensiones distintas. Ni SHA-256, ni acuerdo X/Fx, ni una prueba positiva aceptan fiscalmente una regla. No se han validado aquí firmas PAdES, confianza histórica, CSV o cadena completa de vigencia.

## Reproducción y entrega

`pruebas/validacion.log` registra prueba focalizada, lint y typecheck reales, bajo `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador y Bun/Node de Nix. `pruebas/evidencia.log` corresponde a reextracción y Decimal mediante `bash tools/procedencia/run.sh`, entorno Nix/uv fijado. `citas-candidatas.json` identifica originales oficiales del corpus por ambos hashes, página física, caja, texto y facsímil; no se modifican originales. Los comandos exactos están en `pruebas/COMANDOS.md`.

Reproducción final del script entregado correcta (exit0): seis facsímiles, reparto analítico/mensual y diez diferenciales/límites de la tabla comprobados con Decimal. `pruebas/aritmetica-tablas.json` distingue esta exactitud aritmética de la aceptación fiscal. La inspección adicional confirma 59 posts completos tras normalización y uno con solo prefijo (XMihura, excluido de los hallazgos); los siete posts relevantes del corrector son completos tras esa normalización.
