# Contraste independiente acotado REV681-01

**REV681-01 resuelto en el candidato congelado. Sin nuevo bloqueo demostrado en el impacto del certificado y sus guardas.** No constituye revisión fiscal completa ni autorización de publicación.

Se reprodujeron independientemente los siete casos recibidos: con el productor de antes-correccion, 3 verdes y 4 rojas (dos emisiones posteriores y ambas API). Con el candidato final, 236 pruebas verdes en 7 suites, sin skips ni fails: 7 recibidas, 17 propias y 212 regresiones pertinentes. El control rojo cambia exclusivamente la postimagen de inversion-681-2025.ts; la auditoría acredita las rutas físicas y hashes cargados. rojo-propio.log y final.log conservan los resultados reales completos.

## Corrección y guardas

La comparación byte a byte acredita que el único delta productivo de la corrección REV681 es retirar startsWith("2025-") de la fecha de expedición. El esquema común de inversión sigue exigiendo ejercicio acreditado literal2025; validarInversion sigue comprobando fecha civil y fechaEmision>=fechaSuscripcion. El productor positivo conserva conciliación de contribuyente/entidad/escritura/adquisición/referencia del certificado con el censo. No se detecta apertura hacia otro ejercicio o documento ajeno por retirar el año de expedición.

Los adversos nuevos usan emisión2027 como entrada válida y mutan una sola condición: fecha2026-02-29, mes13, emisión anterior a suscripción, referencia de certificado ajena, referencia vacía, titular ajeno y ejercicio acreditado2026. Todos se rechazan tanto en el libro como en ambas API. La entrada con ejercicio incorrecto se pasa deliberadamente sin recodificación previa para comprobar que los límites reales también la rechazan. Se admiten la igualdad con suscripción y el bisiesto válido2028-02-29, conservando50000/2000.

Los siete recibidos comprueban2025/2026/2027, cuotas disjuntas7/11, legado estatal0 y ambas API con emisión2026. Los propios añaden cuotas estatal0/autonómica60000 y estatal60000/autonómica0 con emisión2027; una cuota no consume la otra. Ambas API con emisión2027 reducen líquida y diferencial exactamente52000, sin doble descuento; la técnica conserva300 euros de retenciones/pagos. La suite del autor también verifica cuota estatal insuficiente en ambas API, oráculos racionales, precisión y legado estatal0. El ejemplo conserva base estatal100000, generación50000 y regional2000. El pendiente no se ofrece como arrastre.

Los cinco oráculos monetarios mantienen SHA256 2c6e86e6f351386710818326cf38e9aaac8b664001847c406c94599458f502ce. El negativo del autor se cambió explícitamente de fecha2026 legítima a2025-02-29 imposible; antes-correccion conserva el original. Revisados también los dos arreglos de tipos: some===true conserva la condición de selección80; Result.isFailure separado por API conserva las aserciones de rechazo y evita unir resultados heterogéneos. No cambian la fórmula monetaria.

## Fundamento y límites

Leídos los cuerpos CAS fijados de BOE68.1.5 y requisitos AEAT, verificando de nuevo sus hashes (y los otros cinco cuerpos del registro). La exigencia legal de certificación se refiere a los requisitos del período de adquisición; no sustenta una prohibición general de emisión posterior al31diciembre2025. El control de fecha civil y no anterioridad permanece como contrato técnico revisado. No se reabren perfiles patrimoniales, reinversión, emergentes ni otros extremos de la primera revisión. La reproducción editorial de TSJM765/2024 no se ha presentado como CENDOJ ni como doctrina general y no es necesaria para el contraste ejecutable.

Las 17 pruebas propias son autocontenidas JavaScript publicable sobre la fixture pública de raíz. Reutilizan de forma declarada los constructores de entrada/API de las siete recibidas; las mutaciones adversas y esperados nuevos son de este contraste. No usan helpers ni oráculos del autor681. Hubo dos errores de importación al generar el JavaScript, corregidos sólo en la entrega: se conservan ejecucion-1.log y ejecucion-2.log sin esconderlos. Sus rechazos no se cuentan como validación. ejecucion-3.log y final.log ejecutan el archivo definitivo completo.

No se ejecutaron tipos/lints de nuevo (los resultados242 semánticos/0 del integrador sólo se leyeron), CIglobal, inventario, r43, capturas, canarios repetidos ni CI remoto. No se consultó VCS: base218c23d6c7831350b3592e5335dde4445352a281 es la base declarada. De las708 rutas de la huella recibida,707 existen y se comprobaron antes/después; node_modules/@effect/language-service/index.cjs ya estaba ausente al empezar. No se afirma haber reproducido esa comprobación de tipos. Los80 archivos del candidato también permanecen byteidénticos; las13 postimágenes coinciden con entradas.json. El original del autor no se abrió ni alteró. No se instaló ninguna dependencia.

## Recursos y entrega

Una sola suite simultánea, CPU0,1, worker1, heap1792MiB, timeout hijo15min y supervisor45min con guardas3GiB árbol/6GiB grupo. El máximo observado final fue571610112 bytes PSS del árbol y5033316352 bytes del grupo; ninguna guarda se activó. Supervisor heredado inspeccionado: subreaper y limpieza exclusivamente por PID+nacimiento de descendientes propios. No hubo subdelegación, worktree ni copia del repositorio. Caché Vite externa a entrega; UV_CACHE_DIR fijado al del usuario.

entrega.patch agrega únicamente tests/contraste-certificado-681.test.js; MANIFIESTO.json contiene SHA pre/post (pre ausente) y hashes de artefactos. entradas.json fija las13 postimágenes externas; no se incluyen copias de lib, tests completos, dependencias ni cachés. El arnés de revisión referencia el candidato congelado, autorizado en este encargo; el test publicado usa rutas relativas de repositorio. Consultados effect-solutions list/show testing error-handling y fuentev4 local antes de crear las pruebas.

**PESADO1 liberado al finalizar. Cero procesos propios vivos: ver PROCESOS-FINALES.json.** Publicación y verificaciones previas al push quedan exclusivamente a cargo del padre según AGENTS.md.
