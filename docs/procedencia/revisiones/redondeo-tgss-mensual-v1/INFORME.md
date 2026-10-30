# Contrarrevisión del redondeo mensual TGSS

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base examinada: `5799bb03826719a4dd3500a962e2d6bb5124fdca`. La revisión conserva el motor, los originales y los esperados.

## Dictamen

La entrega es aprovechable como investigación y como especificación de límites, pero no habilita una liquidación mensual ingresable. Se confirman sus discriminantes aritméticos y se precisan tres pendientes: las dos erratas localizadas del BNR 07/2024 no afectan a solidaridad; la instrucción RED de 2001 aporta el empate al alza en el ámbito del pago; el manual SLD acredita identidades y destinos de acumulación de IT/IMS, sin establecer por ello la cuantización de cada producto. No hay fundamento para sustituir el resultado analítico del motor por la cifra manuscrita de X.

Integridad, autenticidad, interpretación, exactitud y aceptación se evalúan separadamente. Los 19 originales se resuelven por hash en el CAS de la raíz, sin usar rutas del autor. SHA-256, SHA-512 y tamaños coinciden. Las 42 citas se reextraen literalmente y sus 42 PNG se regeneran con hash idéntico; los PNG entregados también coinciden. Esto verifica integridad y receta, no autoridad jurídica. No se valida confianza histórica PAdES/CSV. El diagnóstico NSS previo sigue indeterminado; no se transforma en confianza por repetir un hash.

## Decisión individual: siete hallazgos

| ID | Decisión de revisión y alcance | Objeción experta y coste |
|---|---|---|
| RTM01 | Confirmado como carencia de cobertura mensual, no defecto de la API analítica explícita. Lectura del helper actual y reproducción conservada. | Exigir meses variables a una entrada anual uniforme fabricaría un rojo. Coste: contrato mensual separado antes de ampliar cobertura. |
| RTM02 | Confirmado aritméticamente: ocho meses de 11.041,67 y cuatro de 11.041,66 suman 132.500; doce de 11.041,67 suman 132.500,04. | No son hechos acreditados de nómina. Coste: conservar vector declarado y no deducir distribución real de una captura. |
| RTM03 | Confirmado como ambigüedad interpretativa, con reproducción numérica independiente. | Coincidir con 673,44/132,84 no distingue todos los algoritmos posibles ni prueba empates. Coste: separar escenario y cuota legal. |
| RTM04 | Confirmado con alcance BNR 07/2024 p.3, aclarado por BNR 09/2024 y 01/2025. 497–499 se comunican en el primer tramo temporal. Erratas septiembre/octubre examinadas, sin modificación de este pasaje. | «No repartir por tramos temporales» no dispensa de derivar bien las retribuciones y los días del mes. Coste: conservar ambas dimensiones y las complementarias. |
| RTM05 | Confirmado como carencia de tarifa/hechos y de política monetaria; separación IT/IMS respaldada documentalmente. | 1,5 % agregado no reconstruye los dos conceptos; 0,8/0,7 no se adjudica a todo trabajador. Coste: tarifa y elegibilidad por fecha, más trazabilidad de ambos componentes. |
| RTM06 | Confirmado parcialmente y precisado: falta el algoritmo SLD; no falta toda evidencia primaria sobre empates de pago. RED 2001 explicita empate superior. | Transferir una instrucción de transición al euro a cada multiplicación SLD es un salto no probado. Coste: regla de pago separada, etapas y ajustes todavía pendientes. |
| RTM07 | Confirmado como contrato de formato TipoDato C, no precisión de devengo ni operación jurídica. | Un string de céntimos no acredita cómo se calculó su valor. Coste: separar dato transmitido de derivación de base y residuo. |

## Decisión individual: doce reglas

| Regla | Resultado y evidencia | Objeción experta y coste |
|---|---|---|
| R01 | Documentada para formato C: C035, Bases 2.0.2 p.31. | No redondear toda prorrata por inferencia del formato. Coste: política de construcción de base aparte. |
| R02 | Procedimiento corroborado: C026/C027 y página completa; importes por concepto y tipos de cada pagador. Erratas examinadas no lo alteran. | El ejemplo usa expresamente máximo 2024 para ilustrar 2025. Coste: seleccionar máximo legal por ejercicio, no copiar el ejemplo. |
| R03 | Campos separados corroborados en C040/C041 y consulta de cálculos p.24. Rechazo de 5/6 se funda además en tipos publicados, no solo en el schema. | Tener tres campos no prueba cuál es residual. Coste: no resolver la cuota empresarial por diferencia sin instrucción. |
| R04 | Corroborada con alcance pago/conversión; ampliación RED 2001 p.1 explicita el empate superior para importes abonados. | La orden conserva referencia a conversión y art.11 de Ley 46/1998; el boletín no redefine cada producto intermedio. Coste: no extender HALF_UP universalmente. |
| R05 | Sigue incompleta tras buscar en instrucciones, manuales, RED y norma euro. Se acredita producto por concepto en solidaridad, no ubicación exacta de cuantización, empate de producto o signo negativo. | Dos algoritmos que coinciden en una captura no quedan identificados. Coste: salida mensual no ingresable y casos discriminantes conservados. |
| R06 | Parcialmente cerrada en estructura: tabla SLD pp.90–91 indica tramo/liquidación y destinos de acumulación; 701/702/703 alimentan 700. | «Acumula» no dice precisión interna ni impone cuadrar total por diferencia. Coste: conservar árbol de conceptos; ajuste residual pendiente. |
| R07 | Corroborada prorrata de conceptos de devengo superior al mensual: C002/C036. | Dividir extras por doce no ordena repartir todo salario anual en ocho y cuatro pagos. Coste: hechos de devengo y remuneración mensual explícitos. |
| R08 | Tipos 2025 y máximo corroborados en original PJC/178/2025 pp.4,16–17. Errata BOE-A-2025-7292 trata art.38.3, no estos tipos. | Validez de los tipos no acepta cálculo completo ni régimen especial. Coste: mantener ámbito RG e hipótesis. |
| R09 | Tipos 2026 y máximo corroborados en PJC/297/2026. Publicada 31/03/2026, efectos enero; índice BOE consultado ofrece texto inicial. | Fecha de adquisición o portada no prueba continuidad de todas las instrucciones. Coste: no extrapolar a 2012–2024 ni afirmar búsqueda exhaustiva de reformas. |
| R10 | Identidades IT 601 e IMS 611 corroboradas, incluidos destinos de situaciones especiales. Se cierra la separación estructural; quedan tarifa elegible y redondeo. | En 2026 la orden remite a DA61 LGSS introducida por RDL3/2026; no basta repetir DA4 Ley42/2006 como fundamento atemporal. Coste: versionar tarifa y ámbito, sin cambiar motor. |
| R11 | Tipos MEI separados corroborados en órdenes 2025/2026; cálculo monetario incompleto. | El importe mostrado de MEI no acredita dónde se redondea. Coste: mantener concepto separado de ordinarias y solidaridad. |
| R12 | Identidades CC/desempleo/FOGASA/FP/IT/IMS corroboradas; acumulaciones del manual precisadas. | Sumar tipos y redondear una vez no equivale a sumar cuotas redondeadas. Coste: no aceptar 6,35 % agregado como algoritmo mensual. |

Todas son decisiones de revisión acotadas; ninguna constituye aceptación fiscal completa ni una promoción del registro.

## Investigación primaria adicional y vigencia

Se consultaron búsquedas dirigidas sobre redondeo, tercer decimal, IT/IMS, solidaridad y erratas. Los términos y resultados están en BUSQUEDAS.md. No se acepta la ausencia de resultados como inexistencia de instrucción.

Dos documentos resuelven el pendiente concreto de erratas del BNR 07/2024: la fe del 13/09/2024 cambia fracción de cuota 01 por 07 en Copa América; BNR 10/2024 p.2 corrige fechas de Copa América y Ceuta/Melilla. No corrigen 497–499. Los tres nuevos PDF adquiridos están preservados en `originales/`, con metadatos saneados y ambos hashes en `nuevos-originales.json`. La fecha de portada no se reemplaza por fecha de indexación del buscador.

La instrucción RED sobre euro, endpoint 168749, p.1, permite precisar R04/RTM06. La norma de 2001 sigue siendo el fundamento jurídico leído en C001; el documento administrativo describe la transición. No se presenta el boleto histórico como especificación de SLD vigente desde 2012. El texto tampoco identifica el punto donde habría que redondear las tres cuotas de solidaridad de 2025.

La consulta BOE de la errata 2025 confirma un mínimo horario del art.38.3. El índice 2026 y el preámbulo corroboran publicación/efectos y cambio de remisión de la tarifa AT/EP. Estas consultas web son evidencia de búsqueda; no se finge una nueva adquisición CAS de esas páginas. Los originales de las órdenes ya están en los 19 comprobados. La revisión no completa una cadena exhaustiva de toda norma 2012–2026.

## Citas, cabeceras y columnas

Se inspeccionaron visualmente las páginas completas correspondientes a C001, C026, C035, C040, C041 y C042, además de las páginas ampliadas de cálculos y acumulación. C001 es la columna derecha del BOE 25/05/2001, art.2; no confundirla con el régimen de órdenes de pago del art.1. C026 está bajo instrucciones numeradas de solidaridad y su ejemplo declara base 2024. C035 corresponde a la fila TipoDato C del elemento Valor, no al elemento Código que precede. C040/C041 distinguen ValorBase, ValorCuotaTrabajador, Empresarial y Total, con signo negativo admitido; esa admisión no define cómo redondear negativos. C042 es el nodo de tramo, sin algoritmo monetario.

La reextracción de 42 cajas y regeneración de 42 PNG es completa. La inspección visual contextual es una selección declarada, no una afirmación de lectura visual individual de las 42 imágenes. C016/C017, que solo contienen códigos, siguen necesitando contexto. Las páginas ampliadas añaden cabecera y columnas a la receta, sin sobrescribir originales ni citas del autor.

## Aritmética y contrato operativo condicionado

`recalcular.py` usa fracciones racionales y división entera, sin importar el cálculo Decimal del autor. Reutiliza exclusivamente las entradas de sus 21 escenarios para contrastar seis variantes de solidaridad y sus resultados exactos; también contrasta los cuatro empates positivos. Son discriminantes aritméticos, no oracles fiscales.

El vector 8×11.041,67 + 4×11.041,66 y el uniforme infinito 132.500/12 producen la misma solidaridad analítica 673,42246/132,74372: ambos están en el tercer intervalo y allí la función es afín. Esa igualdad no permite sustituir bases comunicadas por una fracción infinita. HALF_UP por concepto/pagador/mes da 673,44/132,84; sumar productos mensuales antes de redondear da 673,44/132,72. Redondear solo el anual analítico daría 673,42/132,74, otro contrato.

Con base mensual 4.909,50, ordinaria por concepto y AT agregado hipotético da 18.498,96/3.741,12; el agregado trabajador 6,35 % por mes da 3.741,00. Separar IT 0,8 % e IMS 0,7 % da 18.499,08 para empresa. MEI separado por pagador/mes da 394,68/76,56. Son hipótesis, sin asignar tarifa ni hechos a X. Seis meses de 3.000, cuatro de 19.083,33 y dos de 19.083,34 conservan 132.500 y dan solidaridad analítica 809,56123/158,04686. La base ordinaria también cambia: no es un mero residuo de céntimos.

Contrato propuesto: exigir mes, relación laboral, días/modalidad, tramos temporales, devengo y bases comunicadas, tipos por concepto/pagador, tarifa IT/IMS y situaciones especiales. Calcular magnitudes exactas y separar comunicación, cálculo, nómina e ingreso. Devolver solo análisis etiquetado mientras falten etapas de cuantización, tratamiento de empate/signo y conciliación total/componentes. Al cerrar una etapa, exigir original, selector y caso que discrimine alternativas; un rojo solo contra una API que prometa esa etapa. No se crean pruebas rojas normativas ni fixes en esta revisión.

Objeción experta: mantener el rechazo no satisface una nómina completa. Coste explícito: ampliar todavía evidencia y contrato; escoger HALF_UP para reproducir X ocultaría la incertidumbre. La implementación analítica existente conserva su significado y el oracle permanece intacto.

## Controles y límites operativos

Base exacta verificada por lectura Git. Inventario esperado `ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397`, artefacto esperado `ae25e219e75593d7a0d408e325db872faca31261ded79a2115a563536073b3d0`; snapshots v2 `efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6` y v1 técnico `8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3`. Son referencias de la base, no una regeneración ni aceptación de sus fichas.

Comandos/resultados en COMANDOS.md y logs. El primer checker encontró una entrada de adquisición fallida sin sha256; se corrigió el recorrido para verificar las 19 adquisiciones exitosas, preservando el fallo histórico. No era corrupción del CAS. Nix y wrapper uv fijado con UV_PROJECT_ENVIRONMENT absoluto propio; trabajos pesados serializados mediante flock y un trabajador. No Next build ni suites legacy completas. No se escribió Effect nuevo.

Crossa es copia local v1 histórica comunicada por el coordinador, misma casa/dueño, sin comprobación propia nueva. v1/v2/restauración y originales conservados. Sin transferencias, LFS, gasto ni contacto con terceros. No se consultaron entregas en curso para derivar conclusiones fiscales. La entrega no declara todas las fichas ni todo Seguridad Social aceptados.

## Discriminante adicional encontrado en las columnas de cálculo

La captura de consulta de cálculos, p.24 (original de octubre de 2018), muestra base 2.600,71; desempleo total 183,35; FOGASA 5,20; formación profesional 18,20; líquido de otras cotizaciones 206,75. Su suma es 206,75. Aplicar directamente el tipo total 7,95 % a la base da 206,756445, cuyo redondeo al céntimo más próximo es 206,76. Por tanto, **el ejemplo publicado discrimina acumulación de cuotas ya expresadas en céntimos frente a suma de productos exactos con un único redondeo final**. IT 29,91 e IMS 28,61 aparecen separados; suman 58,52, que aquí también coincide con redondear el tipo combinado: ese ejemplo concreto no discrimina las dos políticas de AT/EP.

Esto refina R06 y RTM06: hay evidencia primaria de un resultado de acumulación que el informe del autor no explotó, aunque no una especificación universal. R05 sigue sin determinar empate porque ninguno de estos productos es un empate; HALF_UP y HALF_EVEN coinciden en estas filas. No extrapolar el ejemplo de 2017 mostrado en manual 2018 a solidaridad 2025, ni convertir una pantalla ilustrativa en norma general. Objeción experta: los ejemplos pueden contener erratas y no expresan todas las ramas del algoritmo. Coste: conservar el caso discriminante como evidencia candidata explícita, pendiente de contrato, sin añadir un rojo a la API anual. Esta es una decisión adicional, no una aceptación fiscal completa.

La transcripción propia se limita a cifras y etiquetas de cálculo. No se trasladan nombres ni identificadores de demostración de las pantallas a metadatos publicables; los facsímiles reproducen el documento oficial sin manipularlo.

Cierre de validación: lint global, typecheck principal/vendor, ensayo de las 16 reglas anti-slop y Ruff/mypy del script entregado terminan correctamente. La llamada real conserva el alcance analítico. Los 21 escenarios y cuatro empates coinciden en el contraste racional. El control final comprueba 8.456 entradas presentes, incluidos enlaces simbólicos históricos, sin borrados. No se atribuye al motor un rojo normativo que no se ha demostrado.
