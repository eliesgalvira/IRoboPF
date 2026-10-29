# Revisión independiente: capital y ganancias

Corte: 29 de octubre de 2026. Se revisaron los **32 IDs**, las **37 expectativas** y se reprodujeron los **seis casos** del autor con un script propio. Hay 27 decisiones `accepted` de alcance limitado y cinco `needs-evidence`; ninguna aceptación certifica el conjunto de reglas fiscales de un ID. CG-07 pasa de `match` candidato a `ambiguous`: las fechas válidas incluyen una frontera bisiesta todavía sin resolver. No se modificaron código, VCS ni hallazgos del autor.

## Dictamen y prioridad

Hay tres correcciones acotadas prioritarias: CG-01 (pérdidas eliminadas), CG-02 (venta posterior a 2012) y CG-03 (vitalicia antes de 2015). Los resultados actuales coinciden con la reproducción inicial, pese al lint integrado. Las correcciones de Madrid2020 y de la explicación comunitaria no afectan estos defectos. Para CG-04 y CG-06, resolver primero el contrato de acumulados y datos temporales. Las carencias de alquiler, bolsas y cálculo de valores requieren ampliación de funcionalidad, no sustituciones aisladas de constantes.

`casos-ejecutados.json` contiene entradas completas para la función real, en céntimos, edad, año, resultados y expectativas. El conversor fue `centimosAEuros`. Los supuestos fiscales externos son: régimen común, titularidad íntegra, ganancias/pérdidas ya calculadas y computables, sin recompra, abatimiento ni concurrencia de exenciones. Para CG-02 la compra y venta son onerosas y sin vinculación, inmueble urbano no habitual, adquisición01-06-2012 y venta01-07-2025. Para vitalicias son contratos asegurados propios y oportunos, sin rescate, salvo la falta temporal que se prueba. No se ejecutó una liquidación completa: son reproducciones de la función del motor, no transcripciones de resultados del autor ni una suite de aceptación fiscal.

CG-01: el saldo de operaciones debe conservar -4000 cuando solo existe una pérdida; eso no exige base imponible negativa. La base cero y el derecho pendiente deben tratarse en integración. Un parche de ahorro que solo haga `max(0, ...)` después de recibir las operaciones mutiladas no arregla el defecto. Coordinar CG-01/20/21 con ahorro como una sola corrección del signo seguida de una ampliación distinta de bolsas.

CG-04: con previas=0 en ambas operaciones se obtienen200000 exentos; con previas=200000 en la segunda se obtienen120000. Queda descartado afirmar que la fórmula por operación siempre incumple el tope. La prueba roja debe expresar el contrato elegido: rechazo de acumulados incoherentes, o un saldo inicial único y acumulación interna. No sumar a ciegas el acumulado recibido y el del año.

## Fuentes y cadena documental

Se comprobaron hashes SHA256 de17 originales heredados y se adquirieron siete documentos adicionales con `tools/procedencia/descargar.py`, caché propia, lock, User-Agent y ritmo del helper. Se añadió Ley8/2012 (DF3, pp11–12), que reproduce la DA37 introducida por RDL18/2012; el selector BOE `#datrigesimaseptima` enumera esos dos eslabones, sin otra modificación listada. Esto refuta que la exención expire por vender después de2012. La cifra5000 del caso deriva del50% de10000 con sus condiciones, no de un test circular.

Ley26/2014 art.1.24, p22, y DF6, p79, sitúan la creación de la vitalicia en01-01-2015; el reglamento RD633/2015 pp8–9 confirma proporcionalidad y acumulación. La contraprueba de vivienda habitual en2014 sigue exenta: su fundamento es distinto. No se acepta con ello cada reforma reglamentaria posterior.

RD439/2007 pp17–18 aporta fuente primaria para gastos, amortización y dudoso cobro; RDL35/2020 arts13/15 separa el incentivo2021 del plazo excepcional2020–2021. Ley18/2014 art122.Dos, pp122–123, cierra parte de la laguna de preferentes y permite corregir la referencia: **DA39**, no DT39. Falta incorporar el antecedente RDL8/2014 para certificar toda la cadena; la ausencia funcional sí está probada.

Se inspeccionaron las reformas originales de2010,2012,2014,2021 y2023 y los pasajes de los manuales utilizados como contraste. Los manuales son contexto, no fundamento suficiente de aceptación. La diferencia de amortización gratuita entre manual2014 p131 y manual2024 pp275–277 persiste: se identifica STS1130/2021, recurso5664/2019, pero la búsqueda no proporcionó original CENDOJ autenticado. No se acepta una fecha de corte basada en la edición de un manual.

## RDL29/2026: resultado específico

La existencia no se deduce de la URL. El PDF tiene encabezamiento BOE249,7-10-2026, disposición20823,99 páginas; el sumario de ese día y la ficha BOE descargados independientemente identifican el mismo título, fecha y publicación. DF11 fija entrada ordinaria08-10-2026. El texto está publicado antes del corte, aunque contenga efectos posteriores. No se califica de inventado por contener2026.

Se distinguen cuatro planos:

- Art6.Primero, p47: texto de la extensión catastral a2026 con efectos desde enero2026. No se cierra aquí la cadena de extensiones previas.
- Art6.Segundo, pp47–50: reforma de reducciones desde entrada en vigor, modulada por DT38, pp62–63. Contratos anteriores a Ley12/2023 y los intermedios conservan redacciones distintas. La prórroga80% tiene su condición posterior al1-12-2026. No es un porcentaje para todo2026.
- Art6.Tercero, pp63–64: nuevo mínimo por parentesco e imputación desde01-01-2027, fuera del ámbito de cálculo2012–2026.
- DA65, pp59–60: exención directa por venta elegible a entes públicos y reinversión complementaria son distintas. La espera de treinta días hábiles y desarrollo de la cuenta no condiciona automáticamente toda exención directa. El caso de venta08-10 debe examinar esa separación.

Las búsquedas por identificador/título en BOE y Congreso y el análisis BOE descargado no aportaron resolución primaria de convalidación ni derogación al29-10. Una búsqueda negativa no demuestra inexistencia. Por eso CG-17 y CG-32 quedan `needs-evidence` para su aplicación fiscal completa, sin negar la publicación comprobada ni inferir cierre del ejercicio. Diciembre2026 y enero2027 son futuros al corte; no ejecutar retrospectivamente esas condiciones por aparecer en un PDF de octubre.

## Cobertura mecánica y límites

Las37 expectativas se recalcularon una por una con Python Decimal: todas coinciden aritméticamente. `expectativas.json` conserva cada escenario y cálculo independiente. Las37 mantienen `needs-evidence` como expectativa fiscal integral: las de alquiler no traen todos los hechos habilitantes y las bolsas no acreditan cada cadena anual, precedencia, origen y excepción. No son37 tests del motor: varias entradas ni siquiera existen en su contrato.

Se ejecutaron13 casos propios: seis reproducciones y siete contrapruebas (acumulado actualizado, vinculación, compra fuera de ventana, vivienda habitual2014, aniversario exacto, día siguiente y bisiesto). No se hizo Next build, suite legacy ni instalación global; ejecución secuencial, un worker. Python/ripgrep ausentes en PATH se habilitaron con Nix; uv se usó con Python Nix para PyMuPDF. No se escribió Effect nuevo.

Los752 segmentos PDF del autor coinciden literalmente al reextraer las cajas de los originales. Eso demuestra localización textual, no interpretación ni vigencia. `citas-reextraidas.json` aporta páginas primarias con bloques y cajas propias, incluidos contextos que no deben presentarse como cita fiscal aceptada. Se inspeccionaron visualmente cuatro páginas clave: RDL18/2012 p8, Ley8/2012 p11, Ley26/2014 p22 y RDL29/2026 p63; no se observan tachados en los pasajes utilizados. No se inspeccionaron visualmente todas las páginas. Los HTML tienen selector sin bbox ficticia. No se validaron PAdES, CSV ni sello temporal externo; hash no autentica emisor.

No se usaron corpus ni inventario candidatos como autoridad. Excel/Python legacy no se ejecutaron: no se acredita comparación de estas rentas con el oráculo salarial. No se certifican forales, resoluciones territoriales de zonas tensionadas, tablas de amortización de muebles, todas las reformas catastrales, ni litigios de regularización. Estas limitaciones impiden aceptación global aunque cada ID tenga decisión.

## Decisiones por ID

### CG-01 — accepted (P1)

Estado candidato: `mismatch`; clasificación revisada: `mismatch`. Se elimina cada pérdida antes de integrar: 10000 y -4000 producen 10000 sujetos y -4000 exentos.

Alcance aceptable: Pérdidas computables del mismo componente y ejercicio, sin exención: saldo 6000 y exención cero. Una pérdida aislada debe conservar saldo -4000, aunque la base final sea cero.

Objeción examinada: No se puede exigir que el llamador compense previamente: la API admite un array de operaciones. No ampliar a pérdidas excluidas por art.33.5.

Acción: Conservar signo antes de la integración. Coordinar con ahorro: una sola corrección de CG-01; CG-21 requiere contrato de bolsas distinto.

### CG-02 — accepted (P1)

Estado candidato: `mismatch`; clasificación revisada: `mismatch`. El guard anio===2012 excluye ventas posteriores. La Ley 8/2012 DF3 reproduce DA37 sin plazo de venta.

Alcance aceptable: Condición temporal de adquisición y defecto del guard; caso de venta 2025 con todos los hechos declarados: 5000 exentos sobre 10000 de ganancia. No certifica concurrencia con otras exenciones.

Objeción examinada: Se descarta que 2012 sea fecha límite de transmisión: ambos originales dicen adquiridos. Vinculación comprende compra y venta.

Acción: Eliminar la restricción al año de venta tras prueba roja; conservar ventana 12-05/31-12 y exclusiones. Ley 8/2012 pp11–12 cierra el eslabón posterior al RDL18/2012.

### CG-03 — accepted (P1)

Estado candidato: `mismatch`; clasificación revisada: `mismatch`. La función de mayores65 no recibe el año. Ley26/2014 art.1.24 y DF6 crean art.38.3 desde 2015.

Alcance aceptable: En 2014 la reinversión en vitalicia del caso no exime la ganancia 10000.

Objeción examinada: No confundir con vivienda habitual: la contraprueba mantiene su exención en 2014.

Acción: Pasar ejercicio y limitar solo la rama vitalicia. Prueba roja 2014 y control 2015.

### CG-04 — accepted (P1)

Estado candidato: `ambiguous`; clasificación revisada: `ambiguous`. Dos reinversiones previas cero dan 200000 exentos; con segunda previa 200000 da 120000. RD633/2015 art.42.4 exige considerar anteriores.

Alcance aceptable: Falta de contrato/validación de coherencia entre operaciones. La cuenta 100000 + 100000*(40000/200000)=120000 solo corresponde a hechos completos del caso.

Objeción examinada: Se confirma objeción del autor: el llamador sí puede proporcionar acumulado correcto. No declarar defectuosa la fórmula por operación ni sumar dos veces.

Acción: Definir si previas es saldo inicial del año o acumulado por operación; validar cronología y rechazar incoherencia. No parche aritmético ciego.

### CG-05 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. El tipo vitalicia solo expresa tres importes. RD633/2015 pp8–9 desarrolla plazo, aseguradora, periodicidad y comunicación.

Alcance aceptable: Ausencia de comprobación de elegibilidad y regularización; no aceptación de todo el régimen 2015–2026.

Objeción examinada: La etiqueta puede ser una atestación externa, pero no prueba cumplimiento; la excepción de retenciones impide un plazo universal de seis meses.

Acción: Documentar cálculo condicionado o añadir hechos y estados de incumplimiento. Completar reformas reglamentarias posteriores antes de implementación completa.

### CG-06 — accepted (P1)

Estado candidato: `ambiguous`; clasificación revisada: `ambiguous`. Las fechas opcionales terminan explícitamente en ahorro en 2013/2014. Sin antigüedad no se distingue permanencia superior al año.

Alcance aceptable: Insuficiencia del contrato y clasificación silenciosa, no obligación de clasificar siempre en general.

Objeción examinada: Puede haber prevalidación externa pero la API no la exige ni recibe categoría alternativa.

Acción: Rechazar dato insuficiente o exigir clasificación acreditada en 2013/2014; conservar el resto de ejercicios.

### CG-07 — needs-evidence (P2)

Estado candidato: `match`; clasificación revisada: `ambiguous`. Aniversario ordinario y día siguiente funcionan. Compra 29-02-2012/venta 01-03-2013 devuelve general; no aceptar todas las fechas válidas por esos dos ejemplos.

Alcance aceptable: Solo coincidencia mecánica de los dos aniversarios ordinarios ensayados; regla fiscal completa no aceptada.

Objeción examinada: Se descarta aceptación global basada en ejemplos positivos; falta cerrar cómputo civil de años sin día equivalente.

Acción: Añadir criterio primario de cómputo civil y caso bisiesto antes de aceptar el match general.

### CG-08 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. El campo se denomina importeIntegroCentimos y la función asigna neto=integro.

Alcance aceptable: Carencia de cálculo neto por inmueble, no error de resta en una funcionalidad implementada.

Objeción examinada: Introducir neto como íntegro falsea contrato; la simplificación sí está explicada en el código y rastro.

Acción: Ampliación de contrato y cálculo por inmueble; no modificar porcentaje global.

### CG-09 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. No hay gastos ni pendientes por inmueble. Art.23.1.a.1 y RIRPF13 distinguen límite y arrastre.

Alcance aceptable: Carencia de financiación/reparación y seguimiento de exceso. Ejemplo algebraico condicionado: neto -500 y pendiente 2000.

Objeción examinada: Otros gastos no comparten este límite; no compensar íntegros de dos inmuebles para ampliar el tope.

Acción: Añadir bolsas de gastos por inmueble y ejercicio; verificar prioridad y antigüedad antes de activar.

### CG-10 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. RIRPF13 enumera tributos, servicios, defensa, seguros y suministros; no hay campos de entrada.

Alcance aceptable: Carencia de desglose de gastos necesarios, sin certificar deducibilidad de facturas concretas.

Objeción examinada: Principal no es interés; mejora no es reparación; IVA deducible requiere tratamiento separado.

Acción: Modelar naturaleza y vinculación al ingreso, sin imponer el límite de intereses a todos los gastos.

### CG-11 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Art.23 y RIRPF14 contienen depreciación y derechos; motor carece de coste, suelo y titularidad.

Alcance aceptable: Carencia de amortización; no aceptación del ejemplo de muebles 10% ni de vigencia completa por años.

Objeción examinada: El 3% no habilita amortizar suelo ni exceder depreciación acumulada. Falta tabla primaria de muebles y cadena de reformas.

Acción: Separar inmueble, muebles y derechos; fechar tablas, prorrata y máximo acumulado.

### CG-12 — needs-evidence (P2)

Estado candidato: `ambiguous`; clasificación revisada: `ambiguous`. La diferencia entre manuales no fecha un cambio legal. Se localiza identificación STS1130/2021, recurso5664/2019, ECLI:ES:TS:2021:3483, pero no original judicial autenticado.

Alcance aceptable: No se acepta regla temporal ni cifra para adquisiciones gratuitas.

Objeción examinada: La sentencia interpreta hechos anteriores; no partir automáticamente la serie en 2021.

Acción: Obtener CENDOJ y examinar alcance de doctrina, firmeza/prescripción; no usar copia de tercero como norma.

### CG-13 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. RIRPF13.e exige más de seis meses desde primera gestión de cobro hasta cierre; RDL35/2020 art15 lo reduce en 2020/2021.

Alcance aceptable: Carencia de exigibilidad, saldo dudoso y recuperación.

Objeción examinada: No confundir art14 RDL35 (deterioro empresarial) con art15 (alquiler); igualdad al plazo no es más de.

Acción: Modelar fechas de gestión, concurso, renovación y recuperación, manteniendo excepciones por ejercicio.

### CG-14 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Ley39/2010 art69 modifica 60/100 y DT19; no hay contrato ni edad de inquilino en API.

Alcance aceptable: Carencia de reducción histórica; no liquidación universal de alquileres 2012–2014.

Objeción examinada: Neto negativo y positivo joven tienen reglas diferentes; no arrastrar límite de 30 años a transición anterior2011.

Acción: Separar regla general, juventud y transición; comprobar IPREM y reparto por inquilinos.

### CG-15 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Ley26/2014 restringe a neto positivo y Ley11/2021 cambia autoliquidación/comprobación.

Alcance aceptable: Carencia de reducción y de fechas normativas, sin certificar todos los litigios de regularización.

Objeción examinada: No extrapolar condiciones de 2021 a hechos anteriores ni reducir pérdidas desde2015.

Acción: Fechar ambas redacciones; completar jurisprudencia antes de regularizaciones.

### CG-16 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Ley12/2023 DF2 y DF9 separan fecha contractual y efecto fiscal2024; no hay hechos habilitantes en motor.

Alcance aceptable: Ausencia de selección por contrato/requisitos. No se aceptan cuatro porcentajes como opciones libres.

Objeción examinada: Exactamente 5% de rebaja no cumple más de 5%; zona tensionada exige resolución aplicable.

Acción: Contrato, rehabilitación, destino social, edad y resolución territorial necesarios; las cuatro expectativas del autor son aritmética condicional.

### CG-17 — needs-evidence (P1)

Estado candidato: `ambiguous`; clasificación revisada: `ambiguous`. PDF original, sumario y ficha BOE coinciden en RDL29/2026 publicado07-10, entrada08-10. No aparece resolución primaria de convalidación en consultas realizadas.

Alcance aceptable: Aceptada únicamente identidad/publicación y presencia de texto; no cierre normativo de 2026 ni aplicación presente de condiciones de diciembre.

Objeción examinada: No rechazar por parecer futuro: publicación anterior al corte sí comprobada. Tampoco confundir vigencia provisional con convalidación.

Acción: Mantener seguimiento parlamentario; separar art6.Primero, Segundo y DT38. Diciembre2026 es futuro al corte29-10; no activar prórroga80% antes del supuesto temporal.

### CG-18 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Ninguna entrada expresa irregularidad o contrato de renta antigua; Ley26/2014 art1.13 cambia art23.3.

Alcance aceptable: Carencia de estas dos reglas distintas. No validar conjunto completo de transiciones.

Objeción examinada: No aplicar irregularidad antes de decidir neto/reducción de vivienda; renta antigua no es otro porcentaje de vivienda.

Acción: Obtener original de régimen de renta antigua y transición completa de fraccionamientos antes de ampliar.

### CG-19 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. No hay inmuebles disponibles, parentesco, catastro ni días. Art24/85 requieren esos hechos.

Alcance aceptable: Ausencia de imputación/mínimo de parentesco, sin aceptar cadena catastral2012–2026.

Objeción examinada: La escala publicada para2027 no puede corregir2026. El alquiler efectivo y días vacíos exigen separación.

Acción: Completar extensiones2023–2025 y mantener futuro2027 fuera; no deducir tasa solo por comunidad.

### CG-20 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. General suma directamente rendimientos y ganancia; no tiene bolsas por origen ni vencimiento. Leyes16/2012 y26/2014 cambian límites/transiciones.

Alcance aceptable: Ausencia de integración/arrastre; 30 expectativas de bolsas son escenarios condicionados, no cobertura ejecutada.

Objeción examinada: No convertir toda pérdida en reducción ilimitada de salario. Origen2013–14 puede cambiar destino desde2015.

Acción: Contrato por componente, año de origen y saldo; máximo anual y caducidad, coordinado con CG01/21.

### CG-21 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Ahorro solo recibe ganancias y hace max(0,saldo). No hay capital mobiliario ni arrastres. DA12 Ley26/2014 contiene10/15/20.

Alcance aceptable: Carencia de dos componentes y arrastres. No aceptación de vigencia anual completa hasta2026.

Objeción examinada: Rechazar siempre 25%; también rechazar siempre cero antes2015 sin excepción de preferentes.

Acción: Compartir contrato con auditor ahorro; no duplicar fixCG01 ni mezclar mínimos CG29.

### CG-22 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Ley18/2014 art122.Dos, pp122–123, contiene DA39 y excepción especial de2014; API no tiene procedencia.

Alcance aceptable: Carencia de bolsa preferentes y corrección de referencia del candidato: ADICIONAL39, no TRANSITORIA39.

Objeción examinada: No todos los rendimientos negativos son preferentes. El plazo de cuatro años no se reinicia por cambiar de componente.

Acción: Completar antecedente RDL8/2014 y trazabilidad de saldos. No usar esta excepción como cruzada general de2014.

### CG-23 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Solo se recibe importeGananciaCentimos; arts34–36 calculan valores, mejoras, tributos y amortización.

Alcance aceptable: Cálculo de ganancia externo al motor, no importe aritmético erróneo demostrado.

Objeción examinada: Dato precalculado puede ser válido: aquí la objeción del autor se conserva, no se presume incorrección de todas las entradas.

Acción: Documentar precondición y futura calculadora de valores; coeficientes2012–14 necesitan originales propios.

### CG-24 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. API sin lotes, fechas de recompra, causa de pérdida ni transmisiones acumuladas. Arts33.5/37 y DT9 contienen tratamientos distintos.

Alcance aceptable: Ausencia de validación de pérdidas, FIFO y abatimiento.

Objeción examinada: No toda pérdida debe deducirse tras CG01: primero debe ser computable; 400000 es transmisión acumulada, no ganancia.

Acción: Separar elegibilidad del signo y conservar lotes/bolsas; no bloquear indiscriminadamente pérdidas válidas.

### CG-25 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Solo etiquetas SinExencion, ViviendaHabitualMayores65 y Vitalicia; no hay dependencia como alternativa ni reinversión ordinaria vivienda.

Alcance aceptable: Carencia de esos tratamientos y condiciones; no certificación de etiqueta vivienda habitual.

Objeción examinada: No eliminar exención vivienda habitual anterior2015 al corregirCG03.

Acción: Añadir hechos verificables/atestación y régimen histórico de habitualidad. Examinar además reforma reglamentaria2026 antes de ampliar ese año.

### CG-26 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. Base liquidable general=imponible y reducciones:never[]. Art50 prevé reducciones y negativos.

Alcance aceptable: Carencia para casos con reducciones o saldos previos; igualdad válida solo en escenario restringido.

Objeción examinada: No acusar de error todos los casos sin reducciones.

Acción: Ampliación separada; no restar aportaciones sin límites y orden legal.

### CG-27 — accepted (P1)

Estado candidato: `mismatch`; clasificación revisada: `mismatch`. Llamada y firma de reducción ignoran otras rentas. Ley26/2014 p12 impone umbral en2015.

Alcance aceptable: Defecto de conexión para2015 con otras rentas no exentas>6500; no aceptar fórmula única para2012–2026.

Objeción examinada: Hasta2014 otras rentas altas no anulan toda reducción: el régimen anterior tiene cuantía residual.

Acción: Coordinar trabajo: incorporar rentas fiscalmente computables y reglas por ejercicio; evitar duplicar corrección.

### CG-28 — accepted (P2)

Estado candidato: `mismatch`; clasificación revisada: `mismatch`. Rastro general omite sumando de ganancia y descripción de ahorro es incondicional. Código suma ganancia general correctamente cuando clasificada.

Alcance aceptable: Defecto explicativo actual en liquidar-irpf-anual.ts; no defecto del selector de tablas por este motivo.

Objeción examinada: La explicación de comunidad ya corregida por el padre es otro texto: no reabrir aquel hallazgo.

Acción: Mostrar sumando y base de integración por ejercicio/operación.

### CG-29 — needs-evidence (P1)

Estado candidato: `ambiguous`; clasificación revisada: `ambiguous`. Se usa max de mínimos estatal/autonómico antes de tarifa conjunta, confirmado en líneas471–485.

Alcance aceptable: Sospecha técnica confirmada; corrección fiscal remitida a ahorro/mínimos con tarifa y ejercicio concretos.

Objeción examinada: La igualdad accidental de mínimos oculta el problema pero no demuestra cuota errónea en todo caso.

Acción: Exigir contraprueba anual donde difieran; no cambiar dos dominios de forma independiente.

### CG-30 — accepted (P3)

Estado candidato: `match`; clasificación revisada: `match`. Suma de céntimos y ubicación del capital inmobiliario en general coinciden con arts45/48.

Alcance aceptable: Solo suma y ubicación ordinarias; no neto, exenciones, imputación ni compensación.

Objeción examinada: Suma correcta no valida que el importe sea fiscalmente neto.

Acción: Mantener match estrictamente acotado.

### CG-31 — accepted (P2)

Estado candidato: `missing`; clasificación revisada: `missing`. RDL35/2020 art13 crea DA49 para mensualidadesenero–marzo2021; API carece de local, actividad, acuerdo y rebaja.

Alcance aceptable: Carencia de gasto extraordinario condicionado; no se acepta deducción900 sin hechos completos.

Objeción examinada: No basta ser pequeño arrendador: actividad tasada, vinculación y compensación posterior importan.

Acción: Añadir contrato/condiciones solo con evidencia; separar menor ingreso de gasto adicional.

### CG-32 — needs-evidence (P1)

Estado candidato: `missing`; clasificación revisada: `missing`. DA65 figura en original2026 pp59–60; hay exención directa y reinversión complementaria con requisitos diferentes.

Alcance aceptable: Presencia documental y ausencia técnica verificadas; no habilitar cifra/regla operativa general al corte.

Objeción examinada: No condicionar toda la exención directa a la orden de la cuenta: la espera de treinta días y orden afecta reinversión complementaria.

Acción: Cerrar situación parlamentaria y distinguir venta directa desde08-10 de desarrollo de cuenta; ningún cierre2026 certificado.

