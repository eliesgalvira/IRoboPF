# Contrarrevisión de flujo de rentas y actividad R25

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

**Dictamen candidato: requiere cambios antes de integrar como grafo de dependencias completo.** Hay seis localizadores de cuarto argumento que no señalan el argumento de su llamada, una mezcla entre transporte de `aporte` y `etapas`, evidencia no pertinente para una arista y condiciones insuficientemente discriminadas. No se ha demostrado por ello una cuota fiscal errónea del motor. Este dictamen técnico no implica aceptación fiscal.

Base examinada: `1f8067b8dd01d0d1377e639776c356c98cae4a05`, 15.175 entradas.

Se examinaron recepción R23–R25, registro candidato R25, revisión técnica R23, la entrega de rentas-retenciones-cotizaciones y DERIVACIONES, revisión editorial histórica, correcciones/editorial-r21, flujo-rentas-r21-sol y el lote R23. El cargador de pruebas compila las fuentes TypeScript del checkout fijado y resuelve sus imports relativos allí; las dependencias de herramientas proceden del árbol externo de lectura.

## FA25-01 — Seis cuartos argumentos están localizados fuera de su llamada (P2)

`argumentos-19.json` conserva, para cada llamada en orden fuente, regla, instancia, rango declarado y rango real independiente obtenido con TypeScript `CallExpression.arguments[3]`. Los offsets son UTF16, intervalo semiabierto. El SHA256 recalculado de calcular.ts es `21574125359ea4d98846bb10dc7b669447d316728795c0ddc88b4f924b444d86`.

| Índice | Instancia | Rango declarado | Cuarto argumento real |
| --- | --- | --- | --- |
| 0 | a.id, cuota de activo | 8274–8279 | 10064–10069, `cuota` |
| 4 | reta:${r.id} | 10861–10877 | 12637–12653, `new D(r.importe)` |
| 8 | amortizacion | 8437–8449 | 13288–13300, `amortizacion` |
| 12 | adicional | 14551–14560 | 15032–15041, `adicional` |
| 13 | discapacidad | 14682–14692 | 15177–15187, `incremento` |
| 14 | reduccion32_2 | 1040–1049 | 15573–15582, `reduccion` |

Los trece restantes sí señalan el argumento de la llamada respectiva. Los seis incorrectos pasan el contraste de bytes porque señalan otra aparición del mismo texto. El caso `reduccion` es especialmente discriminante: el rango 1040 está en la declaración de la función `reduccionRentasBajas2025`, no en el consumidor ni en el binding local mutable que alimenta esta etapa. `cuota` señala su declaración; RETA apunta a otra expresión dentro de la validación. Declaración productora, token homónimo y argumento no son intercambiables.

No se afirma que las fórmulas textuales de esas seis filas sean todas falsas. Se puede resolver el productor de cuota o adicional leyendo el código, pero falta conservar separadamente la identidad del consumo. La expresión `reduccion` exige además seguir su inicialización0 y las dos asignaciones condicionadas, no elegir una función porque contiene el mismo nombre. El rojo exige localización de llamada exacta y permanece rojo; no se actualiza el JSON ajeno.

Decisión D1: bloquear estos localizadores para composición. Objeción del mejor experto: un rango de declaración puede servir para explicar de dónde sale el valor. Respuesta: es útil como referencia adicional, pero el campo promete el cuarto argumento exacto; hay llamadas y bindings distintos. Coste: mantener dos clases de referencia y revisar aliases/asignaciones, sin reemplazar una por otra.

## FA25-02 — El grafo mezcla aporte y etapas (P2)

`a.adapter` declara la propiedad `aporte/etapas`, pero recibe como valor solo `a.contribution`, `a.withholding` y `a.payments`. El adaptador real devuelve dos propiedades separadas: `resultado.aporte` y `resultado.etapas`. El array se construye en `etapa` mediante `etapas.push({importe: valor.toFixed(), ...})`; esa función devuelve además el mismo Decimal. La conexión anual no reconstruye las etapas a partir de aporte: recorre cada `e` y pasa `new D(e.importe)` a crearLineaCalculo.

El saldo por activo es una salida de `etapas`, no contribuye al aporte. `a.saldo` no alcanza `a.adapter` en el grafo. La prueba SALDO-ETAPAS conserva ese rojo para el adaptador aislado. Los dos ensayos reales modifican coeficiente .26→.20, con historia concordante: cuota260→200, saldo740→800, P9740→9800. La suma amortización usa cuota, nunca saldo. Los valores intermedios y su transporte no pueden probarse por un camino que pasa únicamente por aporte.

**Límite esencial:** la conexión anual rechaza activos no vacíos y grado de discapacidad distinto de0 antes de invocar el adaptador. No se acusa que el anual actual emita un saldo de activo. El defecto es la descripción conjunta del contrato aislado/anual y el cierre de todas las instancias. Las instancias por activo0/1 se conservan como no alcanzables desde anual; amortización agregada sí existe con0. Adicional/discapacidad solo se emiten en cliente único; la discapacidad aislada puede valer3500/7750, en anual admitido vale0.

Decisión D2: mantener abiertos por separado transporte, aporte y alcanzabilidad. Objeción experta: al excluir activos del anual, el saldo carece de relevancia para ese sitio. Respuesta: es correcto para ese llamador; el lote declara además las 19 instancias y el adaptador, y no debe atribuirles un cierre que solo cubre aporte. Coste: contrato por propiedad y rama; no sumar indiscriminadamente todas las constantes/etapas a todas las salidas.

## FA25-03 — Una evidencia de conversión monetaria cita fechas (P3)

La arista `primitive.decimal → money` con propertyPath `constructor Decimal y divisor100` cita irpf-estatal-2012-2026.ts, rango8110–8539. Ese texto es `sumarUnAnioFechaCivilIso`: split, DateTime y padStart; no implementa el constructor monetario ni la división100. Sus bytes y hash son correctos. Existe otra arista del mismo par cuya evidencia sí señala centimosAEuros; la arista redundante equivocada no borra esa evidencia correcta. El problema es pertinencia, no hash corrupto ni conversión errónea demostrada.

Decisión D3: conservar el defecto aun con una evidencia correcta paralela. Objeción experta: la redundancia puede no cambiar el cierre alcanzable. Respuesta: una ficha de procedencia no debe presentar como prueba de una operación un auxiliar ajeno. Coste: revisar soporte por arista y no deduplicar silenciosamente para anunciar integridad semántica.

## FA25-04 — Condiciones de consumo demasiado amplias (P2 para cierre por rama)

Las fórmulas de nodos suelen describir bien las ramas, pero diversas aristas usan como condition frases genéricas que remiten a la fórmula. Esto impide utilizar la arista aisladamente como afirmación exacta de influencia.

En 2018 ambos cálculos anterior/nuevo se evalúan, pero con fallecimiento anterior a5julio el retorno es solo anterior. Las aristas de ambos componentes hacia r.2018 llevan la misma condición que menciona «antes5julio selecciona anterior». Evaluar `reduccionNueva` no demuestra que influya en ese retorno. Hay que distinguir ejecución y dependencia del valor. Los ensayos reales con P12000 devuelven2832.8125 antes del corte,4198.90625 desde el corte y también con fecha ausente.

En actividad, `a.additional`/`a.dis` se producen solo dentro de cliente único. `a.low` se consume solo fuera de esa opción, cuando !elegible y aplicarRentasBajas. No basta «opción/historial del nodo» como condición de cada arista. Las ramas de edad/tipo/vitalicia y DA37 requieren igualmente distinguir total, candidato de exención y exención final por transmisión. No convertir `h.life → h.age` en influencia para menores65 o vivienda habitual. El valor agregado de total permanece invariante al cambiar edad64→65, mientras exención0→1000 en el caso ejecutado.

Decisión D4: considerar concordantes las fórmulas locales donde el código las sostiene, pero no cerrar las condiciones de todas sus aristas. Objeción experta: un lector humano puede combinar condition y fórmula del destino. Respuesta: esa composición manual sirve para esta revisión, pero no es un contrato de arista autosuficiente para integración por rama. Coste: completar condiciones explícitas y revisar sus negativos; el dictamen no acusa una garantía que el autor haya declarado aceptada.

## FA25-05 — La entrada aislada queda subordinada al anual (observación P3)

`public.activity` está etiquetada public-input y representa calcularActividad2025(caso), pero tiene una arista entrante de public.explicit. Eso describe uno de sus llamadores, no el único origen de la API aislada. A su vez, varias condiciones de actividad incluyen la exclusión anual incluso cuando la fórmula describe activos aislados. Deben coexistir contratos de llamada distintos. No se declara que un consumidor de producción actual haya rechazado por el grafo una actividad válida: no hay wiring de este grafo.

Decisión D5: reservar composición, sin inventar una corrección de API. Objeción experta: una entrada pública puede tener además llamadores internos. Respuesta: sí; el problema aparece si se interpreta ese enlace como dependencia obligatoria o se aplica su guarda anual al uso aislado. Coste: modelar explícitamente cada llamador y no tratar una unión de alcances como contrato universal.

## FA25-06 — Qué detecta y qué no detecta el verificador

Se ejecuta una copia mínima de verificar.mjs con **única adaptación del directorio de entrada/salida** a scratch propio. No se ejecuta calidad.sh del autor porque regenera y escribe resultados ajenos. Se conservan diff de adaptación por receta y resultados completos en mutaciones-validador.json.

Original: código0. Eliminando solo `g.C → g.P`: código0, aunque P sí resta C. Añadiendo la dependencia falsa `a.G → a.income`: código0, aunque G no cambia el ingreso. Cambiando a0 el inicio del argumento de RN: código1 por texto no coincidente. El validador comprueba referencia, ids existentes y unos caminos negativos; no reconstruye causalidad general ni descubre esas omisiones/adiciones. Las expectativas de rechazo de ambas mutaciones causales permanecen rojas.

Esto es una **limitación contractual demostrada**, no un bypass de confianza ni una falsificación de la promesa del autor: su informe ya excluye descubrimiento automático de aristas omitidas. Impide usar el verde estructural como prueba sustantiva. El control ARG4 independiente añade algo que la mera igualdad de texto no detecta.

Decisión D6: conservar los dos rojos como evidencia de límite y exigir contraste independiente. Objeción experta: convertir un verificador sintáctico en analizador general excede su diseño. Respuesta: no se exige desarrollar aquí ese analizador ni se modifica la expectativa recibida; se demuestra qué revisión manual sigue siendo necesaria. Coste: no ofrecer una suite globalmente verde ni inferir aceptación por schema/recuento.

## Propiedades contrastadas y fronteras

Las decisiones por unidad se conservan en sitios-20.json, nodos-111.json, aristas-256.json y argumentos-19.json. Cada fila fija identidad, fuente o evidencia, decisión, motivo y límite; no son pruebas independientes por el hecho de existir filas. Las decisiones compatibles son concordancias técnicas acotadas, no aprobaciones jurídicas ni acreditación de exhaustividad. Las matrices agrupan el razonamiento por familias de operaciones; las excepciones concretas remiten a los hallazgos anteriores. Los 325 terminales conservan clasificación candidata: no se aceptan individualmente como normas por contenerse en esos nodos.

Trabajo general: íntegro reduce solo importes íntegros en céntimos, cero inicial y conversor100. El llamador pasa {anio,salarioBrutoAnual:I} a la función SS elegida por contexto.modo y consume solo cotizacionTrabajador. C se suministra al neto: su fallback nullish legacy no se ejecuta aquí. P=I−C, F tabla por año, N=max(0,P−F). Art20 recibe P, no N; O suma algebraicamente alquiler neto simplificado y ganancias sujetas de ambas bases antes de compensación. El signo de pérdidas no se borra. La validación familiar usa N+O para admisión, no para alterar el íntegro. Nada de esto valida cuantías SS externas.

Trabajo explícito: bucle por rendimiento, bruto separado de gastos efectivos; colegio/defensa se agregan primero y limitan500/300. El caso ejecutado con dos filas400/200 y SS1200 cada una devuelve gastos3200, no3600. Con íntegro100 y SS150 devuelve art19−50, f0. El adaptador devuelve art19 como rendimientoAntesArt20 y P como argumentoArt20; la conexión limita R a art19 positivo y conserva signo tras restar. Discapacidad y f no se importan al bruto ni al argumento P. La rama art80bis está en la función compartida pero no en la llamada DA61 literal. Base0 devuelve legal340, límite0 y aplicable0 en el ensayo; no se cancela una división0/0.

Cuotas: obtenerParametrosComunidadAutonoma recibe año2025, Madrid y x.base; se consumen escala estatal, tramos autonómicos y mínimo autonómico contribuyente.general. obtenerEscalaAutonomicaPublicada recibe año2025/Madrid y devuelve publicada|undefined. MINIMOS_ESTATALES_2025 aporta solo contribuyente.general. calcularCuotaPorEscala recibe base o min(base,mínimo), tramos propios y, solo en autonómica, undefined o [publicada]. Se conserva cada max(0,tarifa(base)−tarifa(mínimo limitado)). DA61 solo empleo, no pensión/EDS; posterior y líquida legal distintas. Diferencial resta retenciones y pagos separados; presentación half-up2 no sustituye el decimal del rastro. Estos contratos se cotejan con las llamadas actuales; las hojas y composición pertenecen a otros lotes y quedan pendientes. No se ocultan los helpers propios trabajo/reducción/adaptador detrás de SS/escalas.

Actividad: entradas individuales ingreso/gasto/RETA y agregados tienen propiedades distintas. IVA recuperable2100 frente0 conserva ingreso10000 en ensayo; cliente vinculado cambia a no-soportado, no a0. RN conserva pérdida; elegibilidad depende de cliente efectivo, I positivo, gastos conjuntos30%, bases sujetas70% y obligaciones. Adicional6498 no7302; discapacidad3500/7750 alternativa; rentas bajas excluye elegibles; inicio usa primer positivo, historia, año>=2013, primer positivo+1 y exclusión estricta>50% empleador. Fechas, períodos, documentos, ids y límites de dominio son validaciones; no autentican diarios. Retenciones/pagos se suman después en sus canales y no son gasto ni ingreso neto. El cálculo no prueba el pago real ni todo el modelo130. Las 19 instancias no son19 ejecuciones obligatorias: bucles pueden emitir cero o muchas, y ramas pueden no emitir adicional/discapacidad.

Ganancias: cada transmisión convierte importe; exención65/vitalicia y DA37 se aplican por j antes de agregar. Se conserva pérdida sin exención negativa. Vitalicia usa margen240000−previas, min reinversión/transmisión y desde2015; no valida el acumulado de varias transmisiones ni plazos/hechos. DA37 usa adquisición inclusiva2012-05-12..2012-12-31 y saldo positivo tras exención65. Clasificación2013/2014 usa comparación estricta con aniversario civil; sin fechas da ahorro; otros años ahorro. Defaults del destructuring del auxiliar de aniversario no justifican admitir fechas desconocidas; semántica de DateTime y casos bisiestos no reciben aceptación jurídica. Alquiler sigue N=I simplificado, sin artículo23 completo.

El transporte real de crearLineaCalculo mantiene `origen.decimal=importe.toFixed()` y por separado EUR con toFixed(2). El ensayo1.23456789 conserva ese decimal mientras muestra1.23 euros. Las etiquetas, fórmula, reglaId y documentos identifican, no producen el importe.

## Omisiones e integración

omisiones-r21-r23.json conserva las omisiones R21 originales y la declaración R23 por cada sitio, sin sustituirlas. Se mantiene pendiente la aceptación de terminales, la composición externa y el contraste de nuevas aristas. En actividad sigue abierta la resolución exacta de seis argumentos y el transporte de todas las etapas. Retenciones y SS internas de R21 continúan fuera del ámbito R23 de rentas/actividad: no se cierran por el nuevo nombre del lote. Familiares se revisan como contrato de admisión general; el perfil explícito sigue excluyéndolos.

No recomiendo integrar/publicar este lote como cierre del flujo. Sí puede conservarse como autoría candidata y aprovechar las fórmulas locales contrastadas después de que el padre corrija y contraste los hallazgos. No se aprueba una implementación propia. Integridad, autenticidad, número, interpretación y revisión siguen siendo ejes distintos.

Inventario30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7 y artefacto59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7 permanecen fijos. Las52.461 ocurrencias,65 sitios,36 snapshots y719 objetos son contexto, no aceptación. V1a0c7d768c664677bffb583a84f3afb11deda0cf92924480e8b0afd97cde8b34f/V257377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146 intactas. Madrid e16bd156… sigue pendiente;264 candidatos sin promoción. No se emite atestación ni cambia confianza. Sin adquisiciones nuevas ni CAS nuevo, PDF en Git, copias de app, instalación global, VCS mutante, PR, deploy, servidor, preview, UI, LFS, gasto, transferencia o mensajes. Crossa conserva v1 desfasado, misma casa/dueño, copia local fuera de Victus, no remota/independiente.

## Ejecución y conservación

revisar.log fija1146 referencias con hash/rango/texto concordantes. Son referencias, no dependencias probadas. La suite propia conserva 50 controles y nueve rojos: seis argumentos, saldo aislado y dos expectativas del validador. Los restantes controles concuerdan; pruebas.json contiene todos los esperados y obtenidos. No se cambia ningún esperado para anunciar verde. Lint y tipos se registran separadamente; checkJs corresponde a los instrumentos propios, no a toda la aplicación. No hay Next build ni suite legacy masiva. No se escribe Effect nuevo.

Incidencias propias: el primer recorrido físico falló con ENOBUFS en ls-tree por el buffer por defecto; se amplió solo ese buffer a8MiB, manteniendo un blob a la vez. El cotejo previo completo **no terminó antes de las primeras escrituras propias**: inicialmente esperaba el lock y después falló; la repetición comprueba la base sin atribuirle una fecha anterior. Esta desviación del orden exigido queda explícita. El primer checkJs detectó inferencia de tupla heterogénea en las mutaciones; se añadió anotación de la colección propia, sin cambiar los casos ni producto. Se conservan tipos-inicial.log/calidad-inicial.log y el diagnóstico de recepción inicial. El control final repite lstat/readlink, modo y bytes contra todas las entradas, además del diff; el resultado efectivo se fija en los archivos de control y manifiesto.

El empaquetado fija rutas relativas, SHA256, tamaño, baseSha256 y HEAD, patch textual gzip de adiciones contra base y binarios por ruta/hash. Los metadatos de empaquetado se excluyen de su autorreferencia expresamente. 

Límite de ejecución: no se ejecuta la entrada anual Effect de extremo a extremo. Sus llamadas, destructuring, retornos, guardas y transporte se contrastan por análisis explícito de propiedades contra el código actual; los discriminantes ejecutados cargan los calculadores y el constructor de línea reales. No equivalen a una liquidación anual autenticada ni a prueba del bundler. Decimal de trabajo usa clon de precisión60 y actividad80; Number/Math del calendario/historial no se presenta como aritmética monetaria. Las posiciones de ejecución de etapas cambian con los bucles; no se adoptan como IDs fiscales estables.

Resultado final de calidad: lint=0 y tipos=0, con las 16 reglas a error conservadas. El pase ampliado ejecuta 50 controles, conserva los mismos nueve rojos y no introduce otro rojo. Los casos nuevos distinguen RETA y pagos (aporte9215 permanece al variar pagos500→700), rechazo de retención no efectiva, reducción de rentas bajas1012.5 frente0 al cambiar elegibilidad, inicio1900 frente0 al cruzar estrictamente50% del empleador con ingresos totales constantes, pérdidas EDS, aniversario igual/posterior, DA37 dentro/fuera y vitalicia2014/2015 con margen previo. Estos resultados técnicos nuevos requieren contraste posterior y no acreditan requisitos legales externos.

La recepción física repetida cotejó las 15.175 entradas, con cero diferencias, cero borrados y diff vacío. El cierre definitivo está en fisico-final.json.gz/fisico-final.log; el manifiesto fija su hash para recepción. El patch textual y binarios.json transportan solo esta carpeta; scratch propio queda fuera. Los resultados y códigos se conservan sin convertir los rojos en éxito.
