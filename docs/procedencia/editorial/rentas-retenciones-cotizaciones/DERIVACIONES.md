# Derivaciones compartidas candidatas

Cada ficha remite a este documento por dominio. Las variables monetarias se expresan en euros salvo que se indique céntimos. Los coeficientes de multiplicación son proporciones por uno. Los casos son sintéticos, calculados sin llamar al motor. Esta autoría no cambia aceptación, confianza ni contratos ejecutables.

## Trabajo: artículo 20 por ejercicio

P es el rendimiento íntegro menos gastos a–e; desde 2015 no se resta f para determinar el argumento de la reducción. O es suma algebraica de otras rentas no exentas antes de reducciones y compensaciones. No es base del ahorro saturada en cero. Se necesita calificación fiscal de cada componente.

- 2012–2014: con O≤6500, 4080 si P≤9180; 4080−0.35(P−9180) hasta13260; 2652 por encima. Con O>6500,2652. Ejemplo P10000,O0:3793. El régimen antiguo de prolongación de actividad y discapacidad no queda representado por esta fórmula ordinaria.
- 2015–2017: O≤6500;3700 hastaP11250;3700−1.15625(P−11250) hasta14450;0 por encima. Ejemplo P12000:2832.8125. Con O>6500,0.
- 2018: régimen anterior para fallecimiento antes5julio; en el resto, anterior+max(0,nueva−anterior)/2. Para P12000: anterior2832.8125,nueva5565,media4198.90625. Esta regla anual por devengo no permite aplicar la media a todos los pagos de retención del año.
- 2019–2022:5565 hasta13115;max(0,5565−1.5(P−13115)) hasta16825;0 después, si O≤6500. P14000 da4237.50.
- 2023:6498 hasta14047.50;max(0,6498−1.14(P−14047.50)) hasta19747.50. P15000 da5412.15.
- 2024 y perfil2025:7302 hasta14852;7302−1.75(P−14852) hasta17673.52;2364.34−1.14(P−17673.52) para P<19747.50;0 desde esa igualdad. P18000 da1992.1528. La cifra inmediatamente anterior al último umbral puede ser diminuta y positiva; la igualdad no debe producir reducción negativa. RDL4/2024 p23 establece efectos anuales desde1enero2024; su régimen de retención tiene otra fecha.
- 2026: la función contiene la rama desde2024; esta coincidencia técnica no cierra reformas ni una vigencia futura. El módulo explícito de trabajo rechaza2026.

El módulo explícito limita R al saldo positivo del neto del artículo19. El perfil general mantiene su contrato simplificado distinto. No trasladar el suelo de f a gastos efectivos a–e ni confundir reducción de rendimiento con deducción de cuota.

Fuentes originales: Ley39/2010 p60; Ley26/2014 pp11–12; Ley6/2018 pp77–79; Ley31/2022 pp84–85; RDL4/2024 p23. Las páginas incorporadas en citas.json no sustituyen eslabones pendientes de vigencia.

## Actividad: instancias de anual.explicito.actividad.etapa

Identidad exacta de cada instancia: siteId común más reglaId, id de etapa y documentos del resultado de calcularActividad2025. No enlazar por etiqueta ni por igualdad del importe. La instancia numérica es posición de ejecución, no identidad fiscal permanente. Fuente exacta: lib/dominio/irpf/actividades-economicas/calcular.ts, símbolos etapa/calcularActividad2025, hash fijado en fuentes-codigo.json.

1. AE25-01, admisión: servicios profesionales individuales, régimen común, EDS continuo sin renuncia/exclusión, criterio de devengo e historial completo. Volumen anterior anualizado no superior600000: comparar volumen×366 con600000×días cuando2024 es parcial; inicio2025 exige volumen2024=0 y días0. No deducir que la renuncia caducó tras tres años. Familia, otras rentas, actividades previas desconocidas, valoración no soportada y hechos especiales se rechazan.
2. AE25-02, ingreso:<id>: base devengada sin IVA recuperable y antes de retención. Factura base1000,IVA210,retención150 aporta1000, no1060 ni850. Correlacionar cliente, fecha y justificante; gratuito/autoconsumo/rectificativa fuera de contrato.
3. AE25-16, gasto:<id>: gasto de categoría admitida, afectación exclusiva, registro y correlación con ingreso. Base200,IVA42 plenamente recuperable aporta200. No deducir otra vez activo capitalizado ni importe de RETA.
4. AE25-03, reta:<id>: cuota propia ordinaria efectivamente satisfecha en2025, una por período. Cuotas250 y250 de meses distintos suman500. No deduplicar por igualdad monetaria; deuda antigua, devolución y regularización quedan excluidas. Consulta DGT primaria sobre regularización no recuperada en revisión histórica: no crear regla nueva desde un manual.
5. AE25-04, activo:<id>: base amortizable=coste+puestaMarcha−residual; saldo=base−acumulada; cuota=min(saldo,base×coef). Coste1000,residual100,acumulada800,coef.10 da cuota90 y saldo10. El submotor admite historia lineal de año completo y grupos restringidos; la conexión anual rechaza todos los activos. No contar su saldo como gasto adicional. El prorrateo y redondeo fiscal no quedan acreditados por la tabla.
6. AE25-04, <id>:saldo: saldo anterior−cuota. Es saldo patrimonial de amortización, no aporte a renta. Agregar cuotas de activos produce etapa amortizacion; sumar saldos no reduce renta.
7. AE25-02, ingresos: I=Σbases de ingresos. AE25-02,gastos: O=Σbases de gastos ordinarios admitidos. AE25-03,reta: T=Σcuotas. AE25-04,amortizacion:A=Σcuotas de amortización,0 en la conexión.
8. AE25-02,P: I−O−T−A, con signo. I30000,O6000,T3000,A0 da21000. I1000,O1500,T500 da−1000. Este saldo es anterior al gasto de difícil justificación; nunca volver a restar T en el anual.
9. AE25-08,elegibilidad: cliente único no vinculado, sin TRADE en este perfil; I>0,gastos conjuntos O+T+A≤.30I, bases sujetas a retención≥.70I y obligaciones formales. El70% es fracción de ingresos sujetos, no tipo de retención;30% incluye RETA y amortización. Igualdad cumple ambos límites. I10000,O2500,T600 da3100 y no cumple30%. Cumplir elegibilidad no equivale a elegirla.
10. AE25-05,G: opción cliente único implica0; otra opción min(2000,.05max(P,0)). P21000 da1050. P40000 da2000;P40000.01 sigue2000;P−1000 da0. El7% extraordinario correspondía2023, no2025. RD633/2015 p7 y Ley26/2014 tope2000; art30 RIRPF.
11. AE25-06,RN: P−G, con signo;21000−1050=19950 y−1000−0=−1000. No confundir con beneficio después de pagos a cuenta.
12. AE25-09,adicional: si opción cliente único,6498 hastaRN14047.50;max(0,6498−1.14(RN−14047.50)) después. RN15000 da5412.15. No importar7302 salarial2025: art32 y art20 son distintos.
13. AE25-10,discapacidad:3500 o7750 alternativos, con ejercicio efectivo y acreditación. Nunca sumar ambos. La conexión anual rechaza discapacidad de actividad, aunque exista esta etapa en submotor.
14. AE25-08,reduccion32_2 para cliente único: min(max(RN,0),2000+adicional+incremento). RN10000 sin discapacidad:8498, neto1502. Incompatible con G. La condición material del cliente y su contrato sigue siendo hecho externo.
15. AE25-11,reduccion32_2 fuera de elegibilidad cliente único y con elección rentas bajas: min(max(RN,0),max(0,1620−.405max(RN−8000,0))). RN10000 produce810;RN12000 produce0. Quien cumple cliente único y eligeG no abre por ello esta reducción. Sin otras rentas en este perfil; no evaluar la condición legal general desde una casilla genérica.
16. AE25-12,reduccionInicio: si elección e historia elegible,.20min(100000,max(RN−R32_2,0)). Primer período con RN positivo y siguiente; no reiniciar por un año negativo. Inicio desde2013, sin actividad previa excluida y sin más50% de ingresos de antiguo empleador en el año anterior al inicio. Igualdad50% no excluye. RN19950,R32_2=0 da3990 y aporte15960. La historia usa neto antes de reducciones, no resultado después de DA61.
17. AE25-14,aporteBIG: RN−R32_2−Rinicio, conserva signo. No aplica cotización salarial, art20 ni DA61 de servicios laborales. RN−1000 aporta−1000; su compensación con otros años no está modelada. La conexión usa max(neto,0) para tarifa actual y conserva BIG/BLG firmadas.
18. AE25-15,retenciones/pagos: suma de operaciones efectivas únicas en canales separados. Retención1000 y pago500 no alteran aporte15960: se deducen después de cuota. El código valida factura retenida y período del fraccionado; no calcula el modelo130 ni acredita el ingreso con el booleano.

Ejemplo completo ordinario con inicio elegible: I30000,O6000,T3000,A0 →P21000→G1050→RN19950→R32_2=0→Rinicio3990→aporte15960. Sin inicio elegible, aporte19950. Si el cliente único cumple requisitos y se elige, G0 y la secuencia es otra; no elegir automáticamente la opción aparentemente más favorable. La cadena de documentos de esta autoría no acredita la situación real del profesional.

Primarios: LIRPF original arts28–32 (pp21–22), Ley26/2014 pp17–18, RD633/2015 p7, Ley31/2022 pp85–86 y Ley11/2013 art8 pp16–17. Se preservan los documentos adicionales en citas.json. Las revisiones históricas son índices, nunca fundamento jurídico por sí solas.

## Capital, pérdidas e integración

Ganancia precalculada=valor de transmisión−valor de adquisición ajustado; el motor recibe el resultado, no determina esos valores. Exención se calcula antes de integración y nunca hace exenta una pérdida. Calificar una pérdida no computable es una etapa distinta de conservar signo.

DA37: la ventana de adquisición12mayo–31dic2012 es inclusiva y no pone plazo2012 a venta. Urbano, onerosidad y vinculación se comprueban por hechos. RDL18/2012 p8 y Ley8/2012 pp11–12 son originales separados. El orden con reinversión de vivienda exige análisis propio, no multiplicar porcentajes indiscriminadamente.

Vitalicia: margen=max(240000−reinversiones anteriores,0); reinversión computable=min(importe reinvertido,margen); proporción=min(1,computable/transmisión), solo si transmisión>0; exención limitada por ganancia positiva. Con dos ventas200000 y ganancia100000 cada una, previas0 para primera y200000 para segunda: exenciones100000+20000=120000. Dos previas0 producirían200000: inconsistencia de hechos no resuelta por la función por operación. Art38.3 desde2015; vivienda habitual mayores65 es otro supuesto y no se elimina en2014.

Integración ordinaria de transmisiones:2013–2014 distingue permanencia superior a un año. No suponer ahorro sin fechas; frontera bisiesta históricamente pendiente. Compensación no equivale a exención: general separa rentas y pérdidas, con25% en2012,10%2013–14 y25% desde2015; ahorro separa capital mobiliario y transmisiones, cruzada ordinaria10/15/20/25% en2015/16/17/desde2018. Hay transiciones y excepciones de preferentes anteriores. El motor no tiene todas las bolsas ni arrastres de cuatro años; no presentar estas tasas como funcionalidad ejecutada.

Alquiler: íntegro−min(íntegro,intereses+reparaciones)−otros gastos−amortización, antes de reducciones y especialidades. Con5000,7000 y500: neto−500,exceso financiación/reparación2000, sin mezclar límites de otros inmuebles. Principal del préstamo no es gasto; mejora no es reparación. El sitio neto actual copia íntegro. Las reducciones históricas, parentesco y días vacíos requieren contrato distinto. En2026 existen textos posteriores y cuestiones de transición sin cierre: esta entrega no adjudica una norma vigente completa a un alquiler no identificado.

## Retenciones, pagos y neto

El servicio calcula una retención inicial parcial por versión, usando retribución anual normalizada y cotizaciones suministradas. La base no es BLG; mínimo familiar minora cuota por escala. El tipo se trunca a dos decimales antes de multiplicar retribución. Q1720 sobre18000 da t9.55 e importe1719. Esa cuenta aísla la transformación cuota→tipo→importe; no atribuye Q1720 a cualquier entrada18000.

Años rechazados por selector actual:2012–2016;2026 antes10sept y después29oct; cierre2026; fechas imposibles/ajenas; regularización. También se rechazan opciones temporales en compatible-legacy. Versiones ordinarias completas de2017/19/20/22 pueden resolverse sin fecha; otros años necesitan fecha o cierre expresamente elegido. Fechas de reforma:5jul2018,21oct2021,1feb2023,8feb/28jun2024,27nov2025. Opción del pagador de regularizar después no cambia por sí sola el cálculo inicial. Los PDFs antiguos concluidos y sus marcas/tachados no habilitan años rechazados.

H_soportadas, pagos efectivos y H_estimado se distinguen. El perfil general suma estimación opcional a pagos, por contrato de simulación, y puede duplicarla si el llamador ya la consignó como soportada. El explícito exige operaciones conciliadas. La cuota diferencial negativa no es salario neto ni devolución reconocida. Para neto comparado, usar el mismo modo y cuota que en la comparación; no restar cuota anual y después otra vez retenciones como impuesto adicional.

## Cotizaciones: parámetro anual y operación mensual

Variables: S remuneración computable; M_m máximo mensual; B suma de bases limitadas; X exceso. No hay hechos de grupo/jornada/alta; mínimos no comprobados. El canon uniforme supone12mensualidades con extras prorrateadas, indefinido y tipos ordinarios heredados. El legacy mantiene su tabla anual. En2018 canónico tiene7meses al máximo3751.20 y5a3803.70:45276.90, frente45014.40 legacy. No imponer un único año a todo el archivo.

2025: B máximo58914=12×4909.50. Ordinaria empresa31.40% incluye AT/EP1.50 del perfil; obrero6.35%. MEI empresa.67% y obrero.13%. Solidaridad por tramos de exceso10%,40%,resto: empresa.77/.83/.98%;obrero.15/.17/.19%.2026 son otros tipos y otro máximo; no reutilizar automáticamente2025. Importe exacto analítico no equivale a cuota ingresable.

TGSS-etapas-operativas, entrega concluida recibida: XML2019 publicado en manual2021 muestra desempleo empresa6.87 frente producto6.875→6.88 y IT/IMS1.88+1.38=3.26 frente producto agregado3.25. Discrimina alternativas históricas, pero no demuestra redondeo2025 universal ni autoriza residual general. Las etapas, empate, acumulación y signos necesitan especificación primaria fechada. RNT/DCL y confirmación tampoco son por sí mismos oracles de la política aritmética. No imputar un céntimo al empleador solo para cuadrar.
