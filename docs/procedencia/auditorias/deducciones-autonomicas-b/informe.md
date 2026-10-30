# Auditoría candidata: deducciones autonómicas, grupo B

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Fecha: 29-10-2026. Este informe no acepta hallazgos. Base examinada: `02181b2e66b0c202553431d99486c3742f92cfea`.

## Resultado y alcance real

Se inventarían los **183 códigos** de los siete territorios con fichas: Extremadura 19, Galicia 25, Illes Balears 24, La Rioja 24, Madrid 23, Murcia 28 y Comunitat Valenciana 40. Ceuta y Melilla tienen arrays vacíos. Navarra, Álava, Bizkaia y Gipuzkoa no figuran en `ComunidadAutonoma` del caso anual. No se confunde esta ausencia técnica con inexistencia de beneficios fiscales.

Las 183 fichas se declaran implementadas. El examen del evaluador distingue **174 entradas de importe final manual** (124 redondeadas en la ruta denominada específica y 50 por el genérico), **ocho fórmulas genéricas** (cinco porcentajes con tope global, tres importes fijos con unidades forzadas a un mínimo de uno) y **una fórmula parcial** de nacimiento/adopción en Madrid. Ni «específico» ni el nombre `fichaImplementadaFormula` acreditan una regla fiscal.

La matriz por código está en `matriz-codigos.json`, incluyendo la ficha completa extraída por importación runtime, ruta efectiva, sección del original y pendientes. `hallazgos.json` recoge 183 carencias por código, una carencia de integración, una delimitación de cobertura Ceuta/Melilla, ocho contraejemplos numéricos y tres cuestiones ambiguas (196 candidatos, incluida delimitación Ceuta/Melilla). No son 191 errores legales aceptados: son candidatos de distinta naturaleza. Los controles del repositorio derivan en gran medida la expectativa del mismo parámetro o comprueban que una entrada manual de 123 devuelve 123; eso no contrasta la norma.

**Esta entrega no completa la auditoría jurídica exhaustiva solicitada.** Se ha completado el inventario del ámbito y la clasificación de todas sus rutas ejecutadas, y localizado la sección AEAT de cada código. Falta examinar cada disposición original modificadora y sus efectos temporales, terminar la revisión individual de todos los requisitos y redactar casos discriminantes completos para las 183 fichas. Es una limitación del trabajo efectuado, no un bloqueo técnico ni una reducción del encargo autorizada. `cobertura.json` registra explícitamente lo no terminado.

## Original oficial y coordenadas

Manual AEAT Renta 2025 Parte 2 descargado con `tools/procedencia/descargar.py`, URL y metadatos HTTP completos en cada fuente. SHA-256: `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`. Tiene 635 páginas, fecha impresa 21-10-2026 y Last-Modified 22-10-2026. No coincide con la versión de abril del índice del repositorio (`88a12fbe…`); por eso se han reconstruido las referencias con el índice interno del PDF. No se ha recuperado ni comparado byte a byte la edición de abril.

`citas-candidatas.json` contiene 183 grupos, con sección precisa y 9.924 bloques de contexto extraídos de las páginas pertinentes, página física 1-based, cajas en puntos con origen superior izquierdo y texto reextraído mediante `get_text(clip=bbox)`. Catorce diferencias entre texto de bloque y texto de recorte se corrigieron conservando ambos valores. Las páginas compartidas incluyen pasajes vecinos: **no atribuir automáticamente todos sus bloques a una sola deducción**. Falta seleccionar el párrafo mínimo de cada condición, identificar celdas de todas las tablas y contrarrevisar la correspondencia. Las referencias de DANA comparten sección y deben separarse por subsección.

El hash acredita integridad del archivo conservado, no autenticidad criptográfica. No se han validado firma, CSV ni sellado temporal. Se generaron siete recortes diagnósticos a 72 DPI en scratch; no se presenta eso como cobertura facsimilar de todas las reglas.

Se localizaron las normas autonómicas desde las páginas 630–631 del original. Las respuestas del BOE consultadas con `p=20251231` requieren cautela: una fecha sin versión exacta puede devolver la versión actual. Se conserva la evidencia de navegación y se distingue de las versiones históricas comprobadas en `fuentes-legales.json` cuando están disponibles. Incluso la última publicación de 2025 puede tener efectos en 2026: fecha de versión no equivale a vigencia fiscal.

## Contraejemplos reproducidos

Todos son del helper `calcularDeduccionesAutonomicasAplicadas`, antes de la limitación por cuota en la liquidación. Las entradas y resultados observados están en `ejemplos-runtime.json`; los hechos fiscales completos y expectativas están en `hallazgos.json`.

- **Madrid, nacimiento:** un hijo produce 721,70 sin exigir bases, convivencia o año del nacimiento. Con BI individual 30.930,01 no procede. Dos gemelos nacidos en 2025, un único progenitor con derecho y requisitos cumplidos, producen 1.443,40 frente a 2.886,80 al incluir el incremento del primer ejercicio. AEAT pp. 404–405, artículos 4 y 18.1 del texto refundido.
- **Murcia, guardería:** dos hijos, 5.000 de gasto admisible por hijo y un único progenitor con derecho producen 1.000 frente a 2.000. El genérico topa el total, no cada hijo. AEAT pp. 447–449, artículo 1.Tres. Dos progenitores con derecho exigen además prorratear el límite a 500 por hijo y progenitor; no basta repartir el gasto agregado.
- **Baleares, cuidados:** dos ascendientes elegibles con 2.000 de residencia por persona producen 660 frente a 1.320. AEAT pp. 160–161, artículo 6 quinquies. La convivencia, mínimo, pagos y límites de bases deben satisfacerse; no se presupone que cualquier persona mayor genere derecho.
- **Valenciana, ascendiente:** para BL individual 28.500, un ascendiente elegible y sin reparto, devuelve 197 frente a 98,50. Falta la reducción `197 × (1 − (28.500 − 27.000)/3.000)`. AEAT pp. 553–555, artículo 4.Uno.h), Cuatro y Cinco. No sustituir base liquidable por imponible.
- **Rioja, celiaquía:** cero personas más casilla cumple devuelve 250 por `Math.max(1, unidades)`. Es una entrada contradictoria que debería rechazarse o producir cero, no una deducción. AEAT p. 520, artículo 32.20. Caso fiscal adicional a probar: una misma persona compartida por dos declarantes, 125 cada uno si ambos tienen derecho.
- **Galicia, dos hijos:** acepta 999.999 como importe manual. Con dos hijos que generan mínimo, sin discapacidad, único declarante con derecho y sin familia numerosa, corresponden 250. AEAT pp. 367–368, artículo 5.Tres.1. La ruta llamada específica no calcula esta cuantía ni su incompatibilidad.
- **Extremadura:** un mismo viudo puede sumar 100 manuales de viudedad y 75 de trabajo. Debe optar por 100, dadas las condiciones del ejemplo. AEAT pp. 331 y 339–340, artículos 2 y 7. La incompatibilidad es por persona: no prohibir las dos deducciones a miembros distintos de una declaración conjunta.

No se han añadido tests al repositorio ni fixes. Antes de cualquier corrección, el revisor debe confirmar originales, convertir el contraejemplo en test que falle y comprobar que las entradas describen un caso legalmente posible.

## Integración, territorio y ejercicios

El helper solo recibe un diccionario de entradas; no recibe año ni territorio. Recorre todas las fichas implementadas. `components/liquidacion-irpf.tsx` lo llama para cualquier comunidad distinta de simulada-estatal; el estado no se filtra por territorio en esa llamada. Investigar y probar cambio de Madrid a Murcia conservando entradas: no extrapolar una restricción visual a una garantía del dominio. Ceuta/Melilla podrían recibir importes residuales de otros territorios por esta misma ruta; catálogo vacío no demuestra aplicación correcta.

La liquidación recibe `deduccionAutonomicaAgregadaCentimos`, sin desglose. `sumarDeduccionesAutonomicasCentimos` devuelve ese agregado. La ruta por `caso.deducciones` devuelve «no implementada» incluso si reconoce una ficha: existe una diferencia entre el catálogo, el evaluador de interfaz y la liquidación de reglas tipadas.

Además, la liquidación observada limita las autonómicas a la cuota **general** autonómica después del mínimo. Queda pendiente contrastar el tratamiento de la cuota autonómica del ahorro y deducciones con exceso/reintegro específicos; no se ha dado por correcto ese tope. No basta una deducción agregada si unas reglas tienen límites o mecanismos distintos.

2012–2024 y 2026 no cuentan con catálogo/rutas anuales equivalentes a este 2025 en el ámbito examinado. No se puede heredar 2025 por defecto. La matriz incluye cada año y territorio, separando falta de soporte técnico de investigación histórica pendiente.

Ceuta y Melilla no deben recibir una etiqueta de deducción autonómica ordinaria por las rentas allí obtenidas. La delimitación debe contrastarse con el artículo 68.4 LIRPF y su aplicación sobre las cuotas correspondientes; el tratamiento existente en retenciones no acredita una liquidación anual correcta. Los regímenes forales necesitan sus propios puntos de conexión, normas y módulos; no una comunidad añadida al catálogo común.

## Legacy

Se leyó `Calculo_Salario_IRPF.py`: `obtener_parametros`, `deduccion_smi`, la cuota tras SMI y la cadena de cálculo no contienen estas deducciones autonómicas. Ese perfil no es un oráculo de sus requisitos. No se ha cargado ni contrastado el Excel de 150 MB. No se atribuye a ninguna celda un resultado no observado.

## Ampliaciones prioritarias y decisiones

1. **Separar importe declarado de regla calculada.** Objeción experta: un profesional puede necesitar introducir una deducción ya calculada. Motivo: conservar esa capacidad con procedencia y estado explícitos, sin presentarla como evaluación de la norma. Coste aceptado: disminuir la cobertura anunciada mientras se construyen reglas reales; sin acreditar automatización adicional.
2. **Representar beneficiarios y titulares individualmente.** Para Murcia: hijos/descendientes con derecho al mínimo, centro autorizado, etapa, gastos por concepto, ayudas, pagador, régimen matrimonial, convivencia/custodia, devengo/fallecimiento, declarantes con derecho y bases. Aplicar 20% de gasto admisible por hijo y límite individual/prorrateado antes de sumar. Para Baleares: identidad de beneficiario, edad/discapacidad, relación, derecho a mínimo, servicio, gasto, medio de pago, alta SS del cuidador, bases y deducción de conciliación incompatible. Aplicar 40% y 660 por persona, con la regla específica de reparto según ascendiente/descendiente. Objeción: un array genérico no captura todas las prorratas; motivo: contratos específicos por deducción. Coste: más entradas y reglas, no un booleano universal.
3. **Madrid nacimiento.** Entradas: fecha y tipo de nacimiento/adopción, pluralidad del evento, identificación y convivencia de progenitores, declaración individual/conjunta, BI general y ahorro del contribuyente y de todos los integrantes de la unidad, ejercicios previos y cumplimiento de límites en nacimiento y años siguientes. Regla: periodo del evento y dos siguientes, cuantía e incremento por evento múltiple, reparto entre padres convivientes en individual y límites personales/familiares. Objeción: un contador no acredita continuidad anual; motivo: historial por evento. Coste: guardar hechos fiscales de varios ejercicios.
4. **Valenciana ascendientes.** Entradas: BL general/ahorro, modalidad, edad y discapacidad acreditada incluyendo tipo/permanencia y fecha de devengo, parentesco, días de convivencia/internamiento, rentas exentas/no exentas, declaración y renta declarada, otros declarantes y grado de parentesco. Calcular 197 por elegible; aplicar reducción 27.000–30.000 individual / 44.000–47.000 conjunta y reparto. Objeción: trasladar automáticamente la misma reducción al deporte sería incorrecto: allí se reduce el límite de 150 en 54.000–60.000 / 72.000–78.000. Motivo: fórmulas separadas. Coste: no reutilizar un helper fiscal sin parametrizar su objeto (importe o límite).
5. **Procedencia histórica.** Objeción: consolidado actual y manual informativo no sustituyen disposiciones originales. Motivo: conservarlos como índices y candidatos, recuperar cada modificación con efectos en el ejercicio y contrarrevisarla. Coste: esta entrega no certifica vigencia ni cobertura exhaustiva 2012–2026.

Las decisiones se registran aquí porque el auditor no está autorizado a escribir DECISIONES ni ESTADO.

## Reproducción y herramientas

- Extracción runtime: `nix shell nixpkgs#bun -c bun -e …` importando el catálogo y el helper; salida propia en scratch, sin script TS ni Effect nuevo.
- Descarga: `nix shell nixpkgs#python3 -c python tools/procedencia/descargar.py URL`. Las peticiones propias son secuenciales y comparten lock de máquina.
- PDF: scripts `extraer.py` y `verificar.py` en `.cache/procedencia/deducciones-autonomicas-b/`, ejecutados con `uv run --python python3 --no-python-downloads --with pymupdf`. Nix aporta Python y `stdenv.cc.cc.lib`; se configura `LD_LIBRARY_PATH` para la rueda PyMuPDF.
- Fallos resueltos: `rg` fuera del shell no estaba disponible; Python descargado por uv no ejecutaba en NixOS; la rueda PyMuPDF necesitó libstdc++. `nixpkgs#jj` es otro programa: se utilizó `nixpkgs#jujutsu` para la consulta de solo lectura.

## Contraste legal adicional

Se han descargado ocho consolidaciones HTML con selección comprobada: Baleares 24-07-2025; Extremadura 07-04-2025; Galicia 31-12-2025; Madrid 29-12-2025; Murcia 24-07-2025; La Rioja 30-12-2025; Comunitat Valenciana 29-12-2025; LIRPF 24-12-2025. `citas-legales-candidatas.json` conserva 89 artículos/bloques con selector HTML, texto extraído y hash. Son evidencia legal HTML, **no PDF**, y su selección temporal no acepta automáticamente los efectos de cada reforma.

La lectura focalizada confirma en esos HTML la cuantía por hijo en Murcia (art. 1.Tres), el incremento de Madrid (art. 4), la remisión del art. 77 LIRPF a la cuota íntegra autonómica y la naturaleza de la deducción de Ceuta/Melilla en el art. 68.4. El art. 77.1.a atribuye a la cuota autonómica el 50% de las deducciones de los apartados que enumera del art. 68; ese porcentaje de distribución **no es** el porcentaje del beneficio de Ceuta/Melilla. No aplicar la cifra del régimen de retenciones como sustituto de la deducción anual.

El índice AEAT del original contiene 186 secciones de nivel 2 en los siete capítulos. Ese número no debe compararse directamente con 183 códigos: incluye anexos municipales y requisitos conjuntos, y agrupa dos deducciones DANA en una sección. Se han asociado todos los códigos; falta una conciliación formal de todas las subsecciones, tablas y supuestos para certificar ausencia de omisiones. `reglas-documentadas-pendientes.json` conserva contexto por código, referencias normativas candidatas y dimensiones que falta modelar. Es material de trabajo, no 183 reglas jurídicas ya interpretadas.

## Publicaciones originales incorporadas

Se conservan siete PDFs originales de normas base (Baleares, Extremadura, Galicia, Murcia, Rioja, Valenciana y LIRPF) y tres PDFs modificadores: BOE-A-2024-5610, BOE-A-2025-720 y BOE-A-2018-9268. Estos tres tienen citas candidatas en cinco páginas físicas: Madrid 5 y 14, Baleares 155–156, Ceuta/Melilla 79. La fecha de efectos desde enero de 2023 de Madrid y desde enero de 2018 de Ceuta/Melilla está en el original. Falta recuperar el PDF original del texto refundido de Madrid y todas las demás modificadoras. Los 404 de las rutas antiguas de Valenciana/LIRPF se resolvieron siguiendo sus enlaces oficiales con nombres por rango de páginas. No se han eliminado registros de intentos fallidos.

La comprobación final de hashes, conteos y límites está en `verificacion-entrega.json`. La entrega sigue siendo parcial respecto de la revisión jurídica exhaustiva; ninguna ficha tiene aceptación independiente.
