# Continuación candidata de retenciones/pagos R34

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `d70af62d19291c83d0deb281c09df106ee4a3575`. Los seis rojos específicos contra `composeRetencionesR32` muestran ausencia de frontera por propiedad, constantes, programa consumible, instancias, retornos y obligaciones. Fuentes, esperados y logs se conservan; son carencias de representación, sin conclusión fiscal.

## Contrato y consumidor

scripts/procedencia/flujo-retenciones-r34.mjs exporta composeRetencionesR34 y verifyRetencionesR34. No tiene CLI con escritura automática. Conserva el fragmento R32 por ruta/SHA256 y previousPort de cada uno de sus seis sitios. No modifica ese módulo, sus pruebas, esperados ni informes. La nueva edición agrega crearLineaCalculo a las seis fuentes fijadas y exporta operaciones JSON, bindings globales/locales, campos públicos, constantes, colecciones, tablas, celdas, instancias, salidas y obligaciones.

scripts/procedencia/flujo-retenciones-r34-consumidor.mjs interpreta únicamente esa representación finita. No importa el motor ni TypeScript, no evalúa texto ni usa Function. executeFinite permite recorrer funciones concretas y obtener trazas por operación; consumeAnnual prepara exclusivamente las seis salidas candidatas. El llamante debe verificar el fragmento antes de consumirlo: executeFinite es un ejecutor interno, no una raíz de confianza ni un validador de paquetes hostiles. La admisión anual es una obligación externa pendiente, no una capacidad que este simulador proporcione.

La gramática se limita a expresiones, bloques, declaraciones, retornos, if/switch, callbacks y operaciones presentes en las funciones fijadas. Se rechazan formas e identificadores no resueltos. Las primitivas son Decimal, Match, Number, Array, Math, Error, undefined e Infinity; Effect se reduce en el simulador síncrono a anotación y rechazo. No es un intérprete general de Effect, no preserva fibras/planificación ni ofrece su API de errores tipados. Los yields del recorrido concreto se ejecutan secuencialmente; un rechazo impide las salidas. Inyección arbitraria sigue abierta.

Las fichas pueden obtener la propiedad desde get/index/property y seguir sus operandos, el bloque que establece el local o el parámetro enlazado al argumento concreto. No tienen que interpretar TS ni extraer fórmulas de la prosa. Los índices de fieldBindings.reads agrupan ocurrencias homónimas; el binding concreto y su contexto se resuelven en el programa y en la traza, no deduciendo causalidad por homonimia de ese índice. Las referencias UTF16 conservan fuente/hash/rango. El verificador contrasta cada operación, binding, campo, unidad y selector con la receta finita fijada; esa comparación no constituye por sí sola demostración de exhaustividad causal. Los casos aritméticos y discriminantes son un control separado, y la suficiencia del conjunto queda candidata.

## Correspondencias de los seis sitios

anual.retencion.base: entradas exclusivamente del subcaso, conversiones de céntimos, opcionales a cero, movilidad/discapacidad laboral, saturaciones, reducción por versión y reducciones laborales/pensión. Los retornos monetarios pasan por eurosACentimos y su HALF_UP2; el anual vuelve a centimosAEuros. No se inyectan salario, familia o cotización del anual.

anual.retencion.cuota: hereda esa base y el mínimo de retenciones. Transporta filtrado canónico antes de cardinalidad, orden descendente por edad e índice, cómputo entero/medio, adopción/menor3, discapacidad/movilidad de cada familiar y convivencia. Cada reduce conserva receptor, callback con sus parámetros, semilla y resultado. CERO llega a new Decimal(0), CIEN a new Decimal(100). Los grupos familiares se redondean después de sumar el grupo; la semilla vacía no se confunde con un elemento.

La escala tiene 18 celdas desde/cuota/tipo, con fila, columna, unidad EUR/ratio, referencia y nodo de valor. Las cinco ocurrencias conservan argumento/resultado y selector propio: remanente, alimentos y mínimo+1980 (tres en 0<A<base), base y mínimo ordinarios (dos en el otro caso). Las trazas entregadas muestran argumentos y resultados de cada instancia realmente ejecutada, no cinco resultados simultáneos. La rama histórica exige versión definida, año<=2020 y argumento>=60000; prolonga45%, mientras la general llega a47% desde300000. Las operaciones de reverse/find y fallback0 conservan índice/celda; resto permanece sin consumo. Las condiciones estrictas están en los operadores y sus operandos, no solo en el texto de selector.

Las tablas de umbral y sus celdas, el mapa ejercicio/período/tabla y VERSIONES_RETENCION son bindings navegables. El consumidor sigue selección civil/version.desde, tabla especial2018, fila familiar, columna por cardinalidad, máximo que filtra null, ajustes pensionista/desempleado, exención por los dos <= y límite43 con techo22000/35200. Los literales de reducción temporal y sus operaciones también quedan serializados. No se habilitan años ni ventanas adicionales.

anual.retencion.tipo: transporta ambos flags territoriales, factor.5/.4, vivienda y su corte estricto33007.2, truncados, diferencia saturada y mínimos contractuales15/2,8/1,6/.8. La cuota retornada no recibe la minoración territorial. El porcentaje retorna string2 y el anual crea Decimal sin factor100.

anual.retencion.anual: R*tipo/CIEN, HALF_UP2, retorno en céntimos, conversión anual y crearLineaCalculo.origen.decimal=importe.toFixed(). Los porcentajes y el importe no se identifican con la cuota.

anual.pagos.retenciones: conserva la corroboración condicionada recibida. Es exclusivamente caso.retencionesSoportadasCentimos/100 hasta origen.decimal. No depende del estimador ni del pago declarado por tener cifras iguales.

anual.pagos.cuenta: caso.pagosACuentaCentimos más el importe estimado en céntimos, después /100 y origen.decimal. El binding de invocación anual conserva condición de ausencia, argumentos subcaso/contexto, llamada concreta y rechazo. Ausente: estimación0 y no cuatro líneas; éxito cero: cuatro líneas con cero; error: no salida. Los tres bindings anuales se exportan con sus expresiones, no se sustituyen por una suma en prosa.

Edad del perceptor por defecto40, importes opcionales0 y flags ausentes falsos están separados. Cotizaciones, contrato y situación laboral, aunque opcionales en la interfaz TS, no reciben un default inventado: son requeridos por la guarda antes del éxito. Cada edad/discapacidad/movilidad familiar conserva el elemento de su colección; cada saldo y productor conserva su campo.

## Cierre técnico candidato y composición

valueClosed/selectionClosed se derivan de obligaciones por operación/campo/celda/instancia/constante/colección/tabla/salida. El schema permite pending y false. El verificador exige el conjunto y las correspondencias completas, rechaza omisión, duplicado, campo cruzado, unidad, selector/instancia, semilla o constante desvinculada sin cambiar los hashes fuente. Un pendiente bloquea los cinco recorridos dependientes; soportadas mantiene sus obligaciones propias de entrada/salida/conversión. No se fuerza true para poder representar incertidumbre. El consumidor completo rehúsa estados pendientes.

La separación valor/selección usa una cota conservadora común para los cinco recorridos; no pretende clasificar cada dependencia en una categoría mínima. Un pendiente ajeno puede bloquear más cierres de los estrictamente afectados: el coste es revisión y disponibilidad, nunca una aceptación adicional. El campo directo tiene frontera separada.

SiteClosed=false, wiringAllowed=false y completeRuleAcceptance=false. anual-publico-r32 llega como contrato pendiente de revisión. No se heredan sus booleanos ni fórmulas jurídicas. Los puertos futuros son fieldBindings/globalBindings/annualBindings/outputBindings y admissionInterface; la composición deberá validar unidades, fuentes, implementación concreta, admisión y revisión exacta. No hay wiring con compositor, generador público, SS u otros fragmentos. Los otros48 sitios siguen dentro del encargo global.

## Verificación y límites

Se conservan46 controles originales y31 del revisor, copiados a scratch cambiando rutas sin alterar esperados. Los31 se repiten además sobre wrappers del intérprete; sus expectativas aritméticas son las mismas recibidas. Hay casos nuevos con expectativas racionales independientes del motor para escala ±céntimo,45/47, alimentos, límites, vivienda/truncado, mínimos contractuales, tabla/null y transporte hasta decimal. Los contrastes suplementarios con el motor se identifican como tales: pueden repetir su defecto y no sustituyen esas expectativas. Cambiar solo un flag territorial conserva cuota y altera tipo únicamente con ambos flags; pagos coincidentes se separan cambiando un único campo.

El intérprete evalúa el receptor antes de los argumentos. El esperado discriminante conserva ese orden. Los 31 esperados del contraste recibido no cambian; las expectativas propias de orden del conjunto se mantienen separadas de un defecto financiero.

Tipos: proyecto estricto de pruebas/TS real adaptado, sin incremental. MJS mantiene checkJs=false heredado; no se afirma análisis estático completo de los módulos JavaScript. Oxlint: un hilo, --disable-nested-config,16 reglas a error. ESLint usa la configuración recibida compartidos en lectura; puede avisar de detección React por no haber node_modules en raíz. Prettier tuvo fallos de resolución de plugin/CSS; se preservan y se aplican sus ajustes core a los archivos JS/TS, sin código de clases Tailwind. Python/schema utiliza run.sh, PYTHONDONTWRITEBYTECODE=1 y UV_PROJECT_ENVIRONMENT absoluto dentro del scratch propio. Sin instalación global ni entorno compartido. COMANDOS y controles contienen resultados reales.

Motor, inventario30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7,44 snapshots, confianza activa, ESTADO/DECISIONES e informes ajenos permanecen intactos. RF33-03 conserva su alcance schema/consumidor sin bypass; RF33-04 es editorial preexistente, no arreglado aquí. NR30-01 no se reabre. No se adquieren originales nuevos ni se duplican PDFs: fuentes/CAS existentes permanecen en sus ubicaciones y con sus reservas. V5r2 mantiene corteR26 y pin2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88; Crossa siguev1 desfasado, copia local fuera de Victus, misma casa/dueño, sin custodia independiente. 

Resultado final:177 comprobaciones correctas, cero fallidas en el pase definitivo; tipos TS, Oxlint, ESLint y schema terminan0. El warning de detección React se conserva como entorno. La suficiencia y aceptación del contrato siguen pendientes del contraste externo; ninguno de esos pases concede aceptación fiscal.
