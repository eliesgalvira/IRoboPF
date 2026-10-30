# Revisión independiente del flujo de retenciones y SS R23

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen: uso editorial limitado como explicación técnica candidata acompañada de sus contratos. No componer ni publicar automáticamente el cierre transitivo del grafo. Hay diferencias entre la explicación correcta de varias ramas y su representación por aristas, además de una conversión omitida. No se corrige el lote, el motor ni los esperados. Los resultados efectivos de los casos y del cotejo se incorporan al cierre de este informe.

Base examinada: `6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9`, 15.456 entradas. Se contrastaron las decisiones D077–D079 y los recibos R26.

## Hallazgos

**RSS26-01. Falta el transporte explícito del selector de modo hasta las salidas SS.** `A.modo` recibe `entrada:contexto.modo`, pero no tiene consumidores en las aristas. `S.B` menciona en prosa «A.modo selecciona» y conserva como inputs salario, máximo, base legacy, año y constantes. Ningún camino del selector llega a `S.B`, `S.solE` o `S.solT`. El código anual sí escoge entre dos funciones; en 2018 cambian base y exceso, y en 2025/2026 cambia el reparto de solidaridad. Es una omisión del contrato de composición del grafo, no un error demostrado de esas funciones fiscales. El rojo exige ese camino y conserva su esperado. Las condiciones escritas y `rutas-ss.json` son evidencia útil para una adaptación futura; no se borran ni se declaran inexistentes.

**RSS26-02. Valor y selección se mezclan en algunas aristas.** `R.menor3 → R.minHijos` tiene relation `valor`, aunque el booleano selecciona qué descendientes reciben incremento de 2.800; no se suma como importe. El rango TS muestra el filtro y la suma posteriores. `entrada:contexto.modo → A.modo` también está marcado como valor, pese a seleccionar función. El significado técnico descrito puede recuperarse de las fórmulas, pero el consumidor no debe sumar ni transportar estos controles como cantidades. El rojo acotado exige `control-seleccion` para el primer caso. Edad, discapacidad, índices y los objetos de tipos agrupan a su vez selección y cantidad: no se puede derivar la clase por el nombre del nodo.

**RSS26-03. `A.cuenta` no explicita la conversión de céntimos a EUR.** Su fórmula suma `caso.pagosACuentaCentimos` e importe estimado y sus inputs solo contienen ambos valores. El sitio público llama `centimosAEuros(pagosACuentaAplicadosCentimos)`. `contratos.json` y el informe del autor sí expresan correctamente `/100`. Por eso se trata de discrepancia interna de representación, no de un factor cien observado en el motor. El rojo protector exige la conversión en los inputs del nodo. La base y cuota públicas de retención también requieren seguir su retorno `aCentimos` y su presentación posterior: no equiparar el nodo interno en euros con todos sus transportes públicos.

**RSS26-04. Los nodos SS agregados requieren instancias por lado y modo antes de recorrer caminos por propiedad.** `S.tipos`, `S.meiTipos`, `S.tiposSolid` y `S.tramos` confluyen en ambos lados. Las fórmulas y argumentos conservados distinguen empresarial/trabajador, pero un recorrido que concatene IDs sin instanciar la llamada crea relaciones falsas entre tipos empresariales y cuota trabajadora. La mutación de un único tipo empresarial canónico cambia su solidaridad y conserva exactamente la trabajadora. El máximo legacy mutado de 2018 cambia la base legacy y deja intacta la canónica 7/5; una ruta genérica máximo→base sin la guarda correspondiente no acredita dependencia en esa rama. Las exclusiones de `ocurrencias-r21.json` reconocen parte de esto; el hallazgo exige conservarlas, no sustituirlas por un cierre bruto. No se interpreta una ejecución legacy intermedia como consumo de todos sus retornos.

**RSS26-O05. Límite del validador, no garantía de analizador general.** `verificar.mjs` coteja nodos, sitios, literales, llamadas y ocurrencias, recorre `inputs` y valida schema. No recorre los rangos de las aristas ni contrasta endpoints o igualdad `edges`/`inputs`. El ensayo ejecuta el verificador real en memoria con grafo sin aristas, texto falso en una arista, destino inexistente y binding alterado. Los resultados exactos están en `limites-validador.json`. No se cambia su contrato para obligarlo a ejecutar JS arbitrario. El límite declarado sobre omisiones semánticas es correcto, pero sus pases no sirven como sello de integridad de todas las aristas o de un sobre externo. Ninguna mutación se guarda en la carpeta del autor ni en registros versionados de confianza.

## Los 17 sitios, individualmente

| Sitio | Contraste de productor, unidad y salida | Reserva editorial |
| --- | --- | --- |
| anual.pagos.retenciones | Declarado anual /100, sin estimador como productor | Guardas anuales; no prueba hechos declarados |
| anual.pagos.cuenta | Declarado más estimación opcional, cero ausente, /100 público | RSS26-03; sin deduplicación por igualdad |
| anual.retencion.base | Neto saturado menos gastos/reducción y reducciones comunicadas; retorno en céntimos, presentación EUR | Versionado, filtros y dominio del subcaso |
| anual.retencion.cuota | Escala propia, alimentos, mínimo, exención y mínimo con límite43; retorno en céntimos | No equivale a tipo ni importe |
| anual.retencion.tipo | Diferencia territorial/vivienda, cociente truncado y mínimo contractual; percent | Exención no elimina mínimo contractual |
| anual.retencion.anual | R × tipo /100; redondeo HALF_UP, retorno céntimos, presentación EUR | No sustituye soportadas declaradas |
| anual.ss.base | min(S,M) legacy; 2018 canónico siete/cinco topes; EUR Decimal | RSS26-01/04; no mínimos por grupo |
| anual.ss.exceso | max(0,S−base del modo); EUR | No usar máximo legacy en rama canónica 2018 |
| anual.ss.empresarial-ordinaria | Base × suma solo tipos empresariales | Sin MEI ni solidaridad; puerto de lado |
| anual.ss.trabajador-ordinaria | Base × suma solo tipos trabajador | No importar tipos empresariales |
| anual.ss.mei-empresarial | Base × tipo MEI empresarial del año | Antes 2023 cero; fracción, no porcentaje100 |
| anual.ss.mei-trabajador | Base × tipo MEI trabajador del año | Componente distinto; no total MEI |
| anual.ss.solidaridad-empresarial | Bandas y tipos canónicos de empresa o 5/6 del total legacy | RSS26-04, año y modo |
| anual.ss.solidaridad-trabajador | Bandas y tipos canónicos trabajador o 1/6 legacy | No heredar alteración del otro lado |
| anual.ss.empresarial-total | Ordinaria + MEI + solidaridad empresarial | Solo el mismo lado |
| anual.ss.trabajador-total | Ordinaria + MEI + solidaridad trabajadora | No cotización empresarial ni coste |
| anual.ss.coste-laboral | Íntegro + total empresarial, liquidado a céntimos y presentado EUR | No sumar otra vez trabajador |

La lista fija sujetos y productores, no acepta 17 reglas por recuento. `nodos-revisados.json` y `aristas-revisadas.json` mantienen las entradas individuales y sus rangos, fórmulas, condiciones y reservas. El cotejo UTF16 usa índices de string JS, no offsets UTF8 ni hashes de un texto normalizado. El rango amplio de una declaración acredita que se conservó ese código; no demuestra por sí solo causalidad ni convierte cada literal contenido en entrada efectiva. Los 665 tokens y 388 IDs son índices de localización, no pruebas fiscales.

## Retenciones: ramas y hechos que no se heredan

Se contrasta el TS real mediante AST/transpilación en memoria. Se exponen únicamente auxiliares arrow identificados en AST para ejecutar fronteras internas; el motor en disco queda intacto. Cada carga registra hash original y ejecutado y cualquier mutación. El ensayo no es ejecución nativa idéntica al empaquetado Next ni typecheck completo del motor.

El neto es max(0,R−irregular1−irregular2−C). El cap de otros gastos usa R−C antes de irregularidades; movilidad y discapacidad activa se acumulan antes de ese cap. Pensión compensatoria reduce base y alimentos afecta cuota, aunque compartan conversor opcional. La reducción depende de versión; legacy undefined usa actual. Los casos recorren los límites de reducción y conservan la distinción entre cálculos intermedios ejecutados y valores retornados.

El filtro canónico elimina el hijo de 25 sin discapacidad antes de orden, length y beneficio por tres hijos. Legacy conserva el original. Los cálculos de mínimos de retención son propios: no se conectan por semejanza a mínimos anuales autonómicos. El mínimo del perceptor por defecto usa edad40. Los familiares comunicados no acreditan renta, parentesco o los restantes requisitos jurídicos. Los divisores de convivencia y las sumas redondeadas por grupo se conservan como operaciones distintas.

La escala propia prolonga45% desde60.000 hasta2020 definido; desde2021 y undefined usa47% por encima300.000. `resto` no selecciona ni produce cuota. Alimentos exige0<A<base y emplea E(base−A)+E(A)−E(min+1980); igualdad y exceso vuelven a rama ordinaria. El máximo de exclusión recorre celdas no nulas; la fila efectiva y columna son otra lectura. null rechaza, no se convierte en cero. El techo43 depende de versión/reducción y compara estrictamente R>techo. Ceuta modifica la diferencia para tipo, no la propiedad de cuota ya retornada. Vivienda se trunca y desaparece desde33.007,2 inclusive. Los mínimos contractuales posteriores pueden producir importe aun con cuota cero.

Las fechas se contrastan en ambos extremos de cada ventana del catálogo, incluidas las reformas intraanuales. La fechaPago selecciona versión y la tabla recibe version.desde. No se usa fallecimiento anual. La tabla2018 con fecha definida y pensionista difiere de undefined legacy. Las ventanas2012–2016 siguen ausentes;2026 conserva solamente10sept–29oct. No se habilita cierre2026 ni procedimiento de regularización. Los rechazos son parte del contrato, no cifras aceptadas.

## SS, transporte y fronteras entre lotes

2018 canónico pondera siete meses con3.751,20 y cinco con3.803,70. Los casos saturan antes/en/después de ambos topes anuales. MEI conserva ejercicio y lado; solidaridad discrimina bandas en1,1M y1,5M, año y modo. El cálculo conserva fracciones y Decimal EUR; los componentes no reciben redondeo TGSS mensual por observar resultados a dos decimales. El coste sí pasa por eurosACentimos y presentación. `redondeoTgss=pendiente`, sin deuda completa ni elegibilidad de mínimos por grupo/jornada.

Frontera con rentas ya en base: `sumarRendimientosTrabajo(caso.rendimientos.trabajo,centimosAEuros)` devuelve Decimal EUR íntegro (`g.I` en su grafo, `A.bruto` aquí). Coinciden archivo y SHA256 fd9f9171…; no se transporta gasto, reducción ni neto como salario. Se lee solo ese lote recibido, nunca archivos R25 todavía no recibidos. De los anexos heredados se mantienen separados76 valores y15 controles de SS;119 valores y115 controles son de otro lote. No se duplican estados ni se declaran revisados esos234 como propios. El manifiesto de disposición preserva IDs, selector, fuente y estado de cada registro.

Frontera con escalas ya en base: su contrato de SS observa en el anual la selección de modo y la cuota trabajadora consumida por el rendimiento/base general; aquí se producen componentes y total por lado. La retención entrega importe anual estimado al diferencial, no cuota, tipo ni mínimos. La coincidencia del símbolo no compone automáticamente su grafo orientado de otro modo ni hereda sus estados. Se conserva el bloqueo D079.

El anual pasa `caso.retencionTrabajoAeat,contexto` y verifica mismo ejercicio antes de liquidar. No reemplaza bruto/cotizaciones/familia del subcaso con el resultado SS o los mínimos del anual. Soportadas es un declarado separado; pagos suma estimación opcional, no soportadas. No hay deduplicación por números iguales: conciliar hechos sigue pendiente. El error del subservicio impide salida. La admisión general anual se conserva como frontera de control, no se presenta el estimador como terminal sin guardas.

## Decisiones, objeciones y costes

1. Retener la publicación automática del grafo, conservando la explicación candidata. Objeción del mejor experto: los contratos escritos ya permiten entender modo, lado y conversión, y bloquear todo texto desperdicia evidencia útil. Respuesta: se admite lectura técnica con reservas, pero un consumidor de aristas no puede inferir puertos o guardas de prosa libre. Coste: adaptación y nueva revisión de composición; no se arregla aquí el lote.
2. Mantener rojos protectores y distinguirlos de fallos de entorno o hipótesis. Objeción: un test rojo de representación no prueba error fiscal. Respuesta: cada esperado identifica exactamente un contrato gráfico; los casos de TS se registran aparte. Coste: handoff con bloqueos y explicación de alcance; sin cambiar esperados ni cifras para anunciar verde.
3. Ejecutar mutaciones delimitadas del verificador real. Objeción: exigir análisis general a un reproductor fijo cambia el encargo. Respuesta: solo se informa de qué entradas acepta y de qué no comprueba, sin atribuirle promesas inexistentes. Coste: los consumidores futuros necesitan otra validación antes de usar el sobre como frontera de confianza.
4. No adquirir normas nuevas. Objeción: una auditoría fiscal necesita vigencia y autenticidad primaria. Respuesta: esta revisión examina relaciones de software contra las fuentes TS fijadas, no vuelve a dictaminar la ley. Coste: ningún resultado técnico acepta números, interpretación, PAdES/CSV o regla completa; cualquier conclusión nueva necesita contraste posterior.
5. Usar un trabajador y lock pesado para pruebas, tipos y recorridos. Objeción: la cola retrasa la entrega. Respuesta: Victus tiene11GB sin swap y la continuidad del trabajo importa más que saltar serialización. Coste: espera explícita, sin rebajar validaciones ni usar lock de recepción para pruebas.

## Conservación y límites de entrega

Los36 snapshots y confianza activa se conservan. V1a0c7… y V25737… no cambian; cierre719 objetos no prueba completitud jurídica. Madrid e16b… y264 candidatos siguen pendientes; tampoco se integra ni interpreta como aceptación el aviso de los tres lotes R25. Crossa conserva v1 desfasado, misma casa/dueño y copia local; no es remoto independiente y no se escribe allí. Sin nuevas fuentes/CAS, transferencia externa, LFS, gasto, PR, publicación, deploy, servidor, preview, UI, cambios VCS o limpieza.

La recepción física lee lstat/readlink, bytes y ejecutabilidad contra un blob por vez, además del diff y HEAD. Los recibos comprimidos enumeran todas las entradas. El cierre repite el procedimiento y el manifiesto entrega rutas relativas, SHA256, tamaño y baseSha256, patch textual gzip y mapa de binarios. Los metadatos autorreferentes se excluyen explícitamente de su propio manifiesto. No se cambia ESTADO, DECISIONES, informes originales ni resultados ajenos. El encargo global sigue abierto.

## Resultado efectivo de ejecución

Pasan19 controles nuevos, incluidos el transporte anual real hasta `origen.decimal`, la independencia respecto al bruto anual y el rechazo del subcaso de otro ejercicio. Permanecen tres rojos protectores RSS26-01/02/03. No son tres defectos fiscales aceptados: señalan contratos gráficos que la entrega aún no satisface. La mutación empresarial discrimina RSS26-04 sin convertir un nodo agregado en una arista falsa por sí mismo.

El reproductor original pasa sus28 discriminantes y coteja1.446 localizaciones en su variante base. Nuestro recorrido adicional coteja4.710 referencias de fuente, con repeticiones de rangos en nodos, aristas, bindings y anexos comprimidos; no son4.710 pruebas independientes. Las89 entradas de nodo y243 de arista tienen disposición separada, además de los17 sitios. No se acepta ninguna regla por esos recuentos.

El verificador real también acepta las cinco mutaciones ensayadas: borrar todas las aristas, falsear el texto de una arista, inventar su destino, cambiar los argumentos de un binding y añadir un campo al sujeto. Esto delimita el pase, no demuestra que el instrumento prometiera rechazarlas. Sus tres rechazos originales de schema siguen ejecutándose y pasando. Para un publicador futuro no basta ese pase como comprobación integral del grafo.

CheckJs del alcance termina sin diagnósticos; oxlint termina sin diagnósticos con las16 reglas anti-slop a error, threads1 y nested config deshabilitado. Se conservan `tipos-inicial.log`, `lint.log` y `validador-inicial.log`: hubo errores del instrumento propios, corregidos sin cambiar fuentes ni expectativas recibidas. La redirección inicial del verificador fallaba por concatenación de rutas; el ensayo definitivo sustituye la expresión de lectura de data y redirige escrituras en memoria, con variante base correcta antes de interpretar las alteraciones. Esta corrección de instrumento no es fix del lote revisado.

El cotejo físico inicial dio cero diferencias y diff vacío. El resultado final completo queda en `fisico-final.json.gz` y `fisico-final.log`; el manifiesto fija su identidad y las del resto de la entrega. Solo se transportan adiciones de esta carpeta. La caché propia contiene auxiliares de preparación, sin entornos ni copia de app. Las conclusiones nuevas quedan para contraste posterior; no se declara aprobado el lote ni terminado el encargo global.
