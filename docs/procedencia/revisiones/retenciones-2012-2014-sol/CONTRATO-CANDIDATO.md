# Contrato operativo candidato, sin habilitación

Ámbito: procedimiento general de retenciones del trabajo en régimen común, por pagador y versión documental identificada. El motor actual rechaza intencionadamente estos períodos; este documento no cambia esa puerta. Candidato significa especificación revisable, no aceptación fiscal completa.

Selección temporal:

| Testimonio | Efectos candidatos expresos | Escala | Tope regularización |
|---|---|---|---|
|2012-enero|Pago en enero2012 correspondiente a enero2012; excepción DA23 yDA35|24/28/37/43/44/45|45;23 solo totalidad Ceuta/Melilla cualificada|
|2012-febrero|Pago desde01/02/2012 que no corresponda a enero; aplicar regularización si procede|24.75/30/40/47/49/51/52|52/26 con mismas condiciones territoriales|
|2013-anual|Pagos ordinarios2013; vivienda con derecho DT18; efectos concretos de RD960/2013 por apartado|Incrementada|52/26|
|2014-anual|Desde01/01/2014 por Ley22/2013 art64|Incrementada|52/26|

Una correspondencia mensual mixta se descompone por concepto y régimen; no se asigna un algoritmo por la fecha bancaria global. Las combinaciones residuales no expresadas por los dos supuestos de2012 requieren calificación previa. Los atrasos imputables a ejercicios anteriores pertenecen a su régimen específico, excluido aquí.

Entradas obligatorias: previsión anual cualificada por pagador; composición dinero/especie sin ingreso a cuenta; gastos art19.2 a/b/c; reducciones irregulares ya calificadas; edad y fechas de referencia; situación familiar legal; situación laboral y contrato clasificados; derechos familiares,discapacidad acreditada,reparto y convivencia; derecho/financiación/comunicación vivienda y total de todos pagadores; condición territorial y derecho68.4; fechas de hechos/comunicación/nómina. Para regularizar, estado anterior admitido por versión y causa, percibido/retenido y causas coherentes.

El algoritmo recibe hechos calificados, no certifica su verdad. NIF pertenece al adaptador documental y no es un dato necesario del motor aritmético puro. CONVIVENCIA es divisor de derechos válidos, nunca número indiferenciado de empadronados. Descendientes por mitad salvo derecho exclusivo en retenciones; no copiar automáticamente una regla de reparto de la liquidación anual. Mantener el artículo84 que exceptúa61.2. Menores/adopciones requieren fecha del hecho habilitante y del vínculo; los años del PDF no bastan para decidir toda frontera civil. Acreditar renta no exenta<=8000 y requisitos de convivencia, incluido período exigible de ascendientes; discapacidad de cualquier edad no queda excluida por los huecos de los contadores auxiliares.

Procedimiento inicial:

1. RNT=max(0,RETRIB−IRREGULAR1−IRREGULAR2−GASTOS).
2. RED20 histórico por9180/13260;4080/2652;pendiente0.35;redondear al céntimo al finalizar. Prolongación/movilidad incrementan RED20 por cada derecho acreditado; DISTRA3264/7242 solo activos. RNTREDU=max(0,RNT−reduccionesart20).
3. Restar minoraciones personales y compensatoria judicial para BASE>=0. Excluir del resultado fiscal único la concurrencia pensionista+másdedosdescendientes mientras no se resuelva RRO-09. Las otras minoraciones individuales siguen especificadas.
4. Determinar mínimo por sujetos/identidades según ley histórica y art84. No ejecutar literalmente los bucles de prefijos discutidos. Constantes y defectos documentados en matriz.
5. Exclusión de tabla81 con incrementos600/1200; nunca HIJOS. Un excluido puede seguir sujeto a mínimo contractual86.2.
6. Aplicar cuota fija+exceso marginal a BASE y mínimo. Si anualidades judiciales0<A<BASE, separar A yBASE−A; mínimo+1600. En este candidato, no hay mínimo por el mismo beneficiario de anualidad: ese supuesto se excluye hasta calificación histórica; sí puede haber mínimo por otro hijo.
7. CUOTA=max(0,cuota1−cuota2); calcular deducción histórica80bis usando BASE. SiRETRIB<=22000, cuota<=deducción+.43×diferencia positiva respecto exclusión.
8. Tipo previo=truncar2(CUOTA/RETRIB×100);redondear entero mitad arriba. Para derecho Ceuta/Melilla, dividir por2 el previo con2decimales,truncar y después entero. El mínimo especial8 no se obtiene dividiendo15.
9. Importe previo=RETRIB×tipo previo entero/100; restar deducción y minoración vivienda truncada;suelo0. Tipo final=truncar2(diferencia/RETRIB×100);aplicar mínimos contractuales salvo excepción judicial/relación especial calificada. Importe final al céntimo mitad arriba.

Vivienda inicial: enero doble régimen; desde febrero umbral únicoRETRIB<33007.20, además del agregado todos pagadores y demás derechos. Desde2013 DT18, no nueva adquisición sin derecho transitorio. Minoración2 puntos con suelo0 y mínimos posteriores. No confundir límite de vivienda con límite43.

Para enero, distinguir adquisición o rehabilitación anterior al 01/01/2011 y derecho transitorio frente a la posterior: modelos 145 de 2011, apartados sexto a/b, y DT11 RIRPF introducida por RD1788/2010. Desde febrero de 2012, el apartado sexto modificado exige agregado estricto de todos los pagadores y no obliga a reiterar al mismo pagador una comunicación anterior si se mantiene el derecho. Desde 2013, DT18 exige inversión anterior al corte y deducción practicada antes de 2013, con la excepción expresa del antiguo art68.1.2; no basta la fecha de escritura. Construcción, ampliación y cuentas vivienda no habilitan esta comunicación de reducción, aunque determinados supuestos puedan tener otro derecho a deducir en la declaración anual.

Irregularidad: solo importes reducidos ya calificados. El límite de base de 300000 procede de Ley39/2010 art66 desde 2011. Para extinciones de relaciones laborales/mercantiles, Ley16/2012 DF10 introduce desde2013 el límite decreciente entre700000.01 y1000000 y la agregación de empresas del grupo; DT25 exceptúa extinciones anteriores a01/01/2013. Registrar la fecha de extinción y el conjunto de rendimientos, además del pago. Opciones sobre acciones y fraccionamientos siguen necesitando calificación propia; este contrato no los calcula a partir de un bruto sin hechos.

Regularización y concurrencias se especifican en `ramas-44.json` y `concurrencias.json`. El número de causa de aplicación no coincide con el ordinal jurídico de87.2. Validar RETRIB>PERCIBIDO antes del cociente. Causas6/7/8 mutuamente incompatibles para un mismo evento;9/10 incompatibles;11 residual incompatible con1..10. Para vivienda+cambio de remuneración, usar fases sucesivas y conservar salida intermedia con su estado; no sumar tipos calculados por separado.

Aplicar los nuevos hechos desde fecha jurídicamente eficaz; comunicación con cinco días para confección,obligaciones de diez días cuando corresponden; opción trimestral del pagador87.4 coherente y documentada. Acreditar política y fecha de nómina, no inferirlas del ejercicio.

Art88.3: comunicar antes del primer día del año o del inicio de relación, atendiendo a la situación previsible; no reiterar sin variaciones. Art88.4: cambios que reducen el tipo pueden comunicarse; los que lo aumentan deben comunicarse en diez días, con efectos en la primera nómina posterior si restan cinco días para confeccionarla. La opción de art87.4 enumera abril, julio y octubre; no se añade enero como cuarto aplazamiento por analogía. Los ordinales legales1–5 y6–12 deben mapearse por hechos, no por el número de las once etiquetas CAUSA del PDF. El tipo voluntariamente superior del art88.5 queda fuera de la aritmética candidata y requiere solicitud escrita propia.

Quedan fuera: procedimiento especial89.A; forales; remuneración irregular sin calificación; hechos familiares insuficientes; derechos de vivienda no acreditados; selección residual2012; concurrenciaRRO-09 con esperado único; implementación literal de contadores defectuosos; extensión por intuición de mezcla territorialCAUSA6. No bloquear por estas exclusiones un caso ordinario con todos los hechos presentes.

Objeción experta: una especificación aritmética parcial puede parecer algoritmo oficial completo. Respuesta: exclusiones expresas y cinco estados separados por fila; casos numéricos no son respuestas AEAT. Coste: menos escenarios implementables automáticamente, conservando evidencia suficiente para revisar cada ampliación sin reescribir originales ni oracles.
