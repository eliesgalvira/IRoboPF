# Flujo candidato del lote de escalas R21

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Base examinada: `960773f909d4ecff290edfa3d7a7b2699a8445d3`. Propuesta editorial sin atestación ni aceptación fiscal.

El contrato localiza los 28 sitios y conserva individualmente las 264 celdas. **El cierre transitivo exhaustivo sigue abierto**: los campos completeness y omissions de cada sitio señalan dónde termina el análisis descompuesto. Las cadenas entregadas son candidatas para otra revisión y no autorizan wiring automático. No se equiparan estas cifras a reglas fiscales aceptadas ni a cierre del encargo largo.

## Qué transporta el contrato

`flujo.json` fija versión1, base, inventario, sujeto/revisión actuales del rastro y llamada exacta por bytes/rango UTF16. Conserva además la referencia histórica del editor; no la sustituye por una revisión actual fingida. `nodos.json` materializa las declaraciones/expresiones de cada símbolo y sus importaciones, con archivo, hash y rango. Las importaciones son contexto de resolución: su presencia en ese array **no constituye una arista de valor**.

Cada sitio separa aristas directas, transitivas, condiciones de admisión y cohabitaciones excluidas. Los tramos se originan en el array recorrido y los componentes en `ahorroConMinimos`, no en el nombre genérico `tramo` o en una cifra coincidente. Las cadenas usan dirección resultado→entrada; las de `celdas-flujo.json` usan celda→consumidor. Una arista a un objeto significa solo las propiedades que consume la expresión conservada. No afirma que todas las propiedades de ese objeto modifiquen el resultado.

`celdas-flujo.json` vuelve a resolver cada decisionId hacia su payloadR19 por ruta/hash, itemId, símbolo y segmentos de tabla. Conserva ocurrencia del artefacto de inventario y caso por celda. Los dos consumidores inmediatos son la cuota general y la cuota del mínimo del mismo componente; las sumas/líquida/diferencial son consumidores posteriores condicionales. No consume ninguna de estas264 celdas el ahorro, las bases o el explícito Madrid2025: sus tablas seleccionadas son otras. Conservar la distinción aunque dos cuotas coincidan.

## Juicio independiente de las enmiendas

**SEM-01.** Inspeccioné personalmente los tres recortes nuevos de Ley13/2023: tabla, mínimo propio y efectos. La tabla separa límite de renta, cuota de impuesto y porcentaje; 5.956,65 está en artículo2. Los efectos desde2023 no convierten la rama técnica Madrid2025 sin fallecimiento en soporte universal de2023–2026. La enmienda mejora el enlace por afirmación; no cierra automáticamente todas las renovaciones temporales ni los fallecimientos.

Objeción experta: una norma con efectos desde2023 podría bastar para heredar2025. Respuesta: eso requiere contrastar reformas posteriores y el caso, y es distinto de ampliar una rama que explícitamente no calcula fallecimientos. Coste: conservar la cita válida y la reserva de alcance.

**SEM-02.** Inspeccioné el recorte histórico de Ley39/2010, página física61. Artículo61 de esa ley reforma artículo57 LIRPF: aparecen5.151,918,1.122 y efectos desde2011. No confundir ese artículo61 histórico con el artículo61 LIRPF sobre reglas comunes familiares. Las tres referencias añadidas localizan la afirmación, pero no son por sí solas una investigación completa de las reformas2012–2014 ni de otras cuantías de discapacidad.

Objeción: la vigencia indefinida escrita permitiría cerrar todos los ejercicios posteriores. Respuesta: indefinida no significa inmune a reformas. Coste: enlaces reutilizables sin extender su aceptación temporal.

**SEM-03.** Inspeccioné personalmente la página37 del apéndice: artículo61.1 distingue rentas del titular próximo, hasta8.000 no exentos, de las del descendiente. La lectura del código `titularesConDerecho` confirma dos decisiones: filtrar elegibilidad del descendiente y después escoger titulares/grado. Padre8.000 frente8.000,01 cambia prioridad, no la renta del menor. El código rechaza rentas mixtas en el grado próximo y más de dos grados; no presentar la explicación como algoritmo universal de cualquier genealogía.

Objeción: un ejemplo de padre/abuelo no acredita el reparto de cualquier familia. Respuesta: se mantiene ese ejemplo acotado y las guardas de estructura. Coste: conservar reservas y exigir hechos de todos los titulares antes del cálculo.

Las cuatro ediciones A se contrastan por hashes con `ediciones.json`. Solo fichas cambia sus bytes; derivaciones, conceptos y celdas conservan sus hashes declarados. No se edita la autoría histórica ni se traslada a ella el texto nuevo. El apéndice95d7… tiene adquisición recuperada en `adquisicion-apendice.json`: URL original,200,fecha,ambos hashes y tamaño; no se inventa otra URL ni se atribuye al archivo una adquisición nueva.

## Recorrido técnico por familias

**Bases (3 sitios).** Ahorro recibe exclusivamente gananciaSujetaAhorro y satura0. General imponible recibe trabajo neto menos reducción saturado, alquiler simplificado con signo y ganancias generales. Otras rentas entra transitivamente en esa reducción; no es sumando separado de BIG. BLG es alias de BIG en este perfil. Las pérdidas generales pueden sobrevivir; una pérdida del ahorro saturada no se convierte en exención. Faltan las categorías e integración/compensación que el perfil no representa.

**General (3 sitios de tramos/total).** La ruta real obtiene tramos anuales de comunidad, puede sustituirlos por tabla publicada y conserva cada escala estatal2012–2014 como sumando distinto. La ruta simulada usa la escala conjunta legacy; su nombre estatal no autoriza tratarla como componente legal. En tabla publicada, findLast exigeB>0 y elige la última base inferior aplicable. Q se suma como EUR de impuesto, L restringe selección y se resta deB, t multiplica como proporción. El límite superior calculado para mostrar una fila publicada no entra en Q+(B−L)t. En integración sí afecta el ancho entre límites.

Murcia2022 exige **B>60000**, no>=. En60000 permanece la fila anterior; en60000,01 aparece8716,67227. No suavizar el salto publicado ni inferir continuidad de la tabla. Madrid2025 no sustituye Madrid2020. Años estatales2012–2014 son ejercicios nominales del payload y una condición del selector; no son aceptación universal de cualquier devengo o supuesto.

**Mínimos (6 sitios nominales y3 de cuota).** Mpropio es acumulativo, sin reparto por familiares. Mdesc filtra antes de ordenar; en derechos explícitos, además se seleccionan titulares, orden y divisor por derecho. Masc usa edad/discapacidad en el helper parcial y cero ascendientes en el contrato de derechos actual. Mdis suma roles, sin confundirlo con gasto de trabajo por discapacidad activa. ME agrega los cinco subtotales estatales; MA se calcula con el juego autonómico. Las cuotas usan min(M,BG), nunca restan el mínimo a la base general. Las tablas estatales antiguas son distintas de las reutilizadas desde2015. El selector autonómico puede depender de base y fecha; un import no acredita su vigencia.

**Ahorro (4 sitios).** Total y tramos brutos usan `obtenerTramosIrpfAhorro`, conjunto integrado. Postmínimo y minoración total usan `calcularAhorroConMinimos` y tablas por componente: hasta2014 F(B−r); desde2015 max(0,F(B)−F(r)). r limita el exceso del mínimo sobreBG positiva aBA positiva. Cada componente tiene su mínimo. En2015 las escalas estatal y autonómica difieren; no dividir el total por dos. La continuidad técnica2026 en el selector de ahorro no habilita comunidades reales que la liquidación rechaza.

**Deducciones, líquida y diferencial (3 sitios).** La deducción consignada se limita a cuota autonómica general postmínimo más ahorro autonómico postmínimo, salvo rama simulada. Esa cuota límite no es una deducción ni una entrada de BIG. La líquida suma general/ahorro postmínimo, resta la deducción aplicada y satura0. El diferencial convierte a céntimos según política, resta soportadas y pagos; los pagos pueden incluir la retención estimada opcional. No atribuir retenciones a cuotas anteriores ni duplicar el mismo hecho en dos entradas. El rechazo de ejercicio de retención incoherente restringe el dominio de toda la salida, aunque no se sume al mínimo.

**Explícito (6 sitios).** BIG yBLG usan neto con signo; solo la base de las tarifas se satura0. Estatal integra escala estatal y su mínimo propio. Autonómica usa tabla publicada Madrid2025 y mínimo autonómico. Líquida legal suma ambas; posterior puede restar DA61 una vez tras artículo80, con bruto de servicios positivos. Pensión no se vuelve servicio laboral por calificarse de trabajo. La rama EDS está separada y no habilita activos históricos ni discapacidad. La precisión decimal y presentación half-up final no deben sustituirse silenciosamente por el contrato agregado en céntimos.

El500 colegial puede afectar transitivamente neto/ bases/cuotas de trabajo explícito mediante gastos a–e, nunca se añade directamente a una suma que no lo consume. La suma del íntegro no consume ese límite. No se toca la entrega del investigador de37sitios para corregir esa distinción.

## Los dos contratos familiares se conservan

`conexion-contrato.Alcance` exige individualMadrid2025,18–64,sin familiares ni discapacidad, sin otras rentas/reducciones/saldos. El anual general admite `derechosMinimos` bajo su contrato distinto: Madrid2025, modo canónico, devengo y edad concordantes, familiares legacy vacíos y discapacidad coherente. `validarRentasAnualesDerechos` concilia netos antes de reducciones/compensaciones, con frontera8.000 preservada incluso si el redondeo de céntimos la cruzara. `hayAlimentosPropiosSinMinimo` excluye MDV2-P01; no lo resuelve jurídicamente ni atribuye por descarte la especialidad.

Objeción: las condiciones son dependencias del resultado porque deciden si existe. Respuesta: sí, de control/admisión; no son importes directos del valor que se produciría dentro del dominio. La prioridad de grado también cambia importes mediante selección de titulares y debe conservar esa segunda función. Coste: representar control y selección por separado, sin esconder la norma en validación auxiliar.

## Omisiones que impiden wiring

Los28 sitios tienen entrada propia y sus cinco secciones de A conservadas. El contrato no oculta estas fronteras:

- Submotores de trabajo,cotizaciones,ganancias yEDS: faltan aristas por propiedad/literal interno. Se conserva su llamada o bloque, no se declara cerrado todo su inventario.
- Los seis sitios explícitos conservan ya las escrituras de neto/posterior y sus ramas trabajo/EDS/DA61. Falta descomponer las propiedades internas de los submotores: no convertir su bloque compartido en dependencia de todos sus parámetros.
- Selectores de comunidad: falta descomponer todos los resolutores/importaciones y mínimos dependientes de base (incluida Catalunya). La localización del dispatcher no autoriza enlazar todo su módulo a cada salida.
- Funciones terminales: tener cuerpo exacto es reproducibilidad, no prueba de que se hayan descompuesto todos sus símbolos. Los consumidores de las264 celdas están localizados; los caminos nuevos aún requieren contraste.
- Norma/evidencia/bordes: mantener condiciones temporales, autenticidad e interpretación pendientes. Los ejemplos por celda no verifican la selección anual ni convierten tipo en cuota aceptada.

Objeción experta: llamarlo cierre de lote sin cierre transitivo sería engañoso. Respuesta: completeness es partial-explicit-omissions en cada sitio y wiringAllowed=false. Coste: se conserva un contrato verificable y una lista concreta de trabajo pendiente, no una autorización para publicar. No se ha completado el cierre solicitado por sustituir sus aristas por listas de módulos.

## Preservación y comprobaciones

La comprobación inicial lee por separado cada blob de las14.537 entradas y contrasta lstat,readlink,bytes y tipo físico; cero diferencias. La final repite ese cotejo. Se conserva el diff contra base, incluidos archivos nuevos por manifiesto y patch textual. No hay borrados de base ni mutaciones VCS. La consulta inicial JJ informó que no hay repositorio JJ y no se inicializó ninguno.

Los resultados efectivos de instrumentos están en sus logs/JSON. No se ejecutan Next build ni suites legacy. AST y pruebas usan el bloqueo pesado común; la comprobación de archivos usa un recorrido acotado. Se consultaron effect-solutions list/show basics/testing y Array.findFirst/findLast de la fuente local antes de preparar el mutante temporal del helper real. No se cambia código mantenido del motor ni expectativas históricas.

No hay originales nuevos adquiridos. Los recortes inspeccionados son los ya entregados; no se atribuye inspección personal de todos losPDF o celdas por verificar hashes. No se valida PAdES/CSV ni autenticidad histórica. La evidencia de este análisis no acredita custodia independiente ni restauración externa.

## Resultado efectivo de esta entrega

La regeneración final y el schema pasan:28 sitios,117 nodos y264 resoluciones de payload. Las264 decisiones nominales referencian102 ocurrencias efectivas distintas; los aliases anuales no se inventan como264 valores independientes. Se verifican las cadenas por símbolo y cada fuente por hash/UTF16, con cuatro adversos de schema rechazados. Pasan cinco identidades de recortes/pasajes inspeccionados, los12 discriminantes generales y264 mutaciones de celdas sobreTS real. Ruff,mypy de los seis instrumentosPython y anti-slop final terminan 0. Los códigos iniciales 1 permanecen en codigos.log y sus diagnósticos se conservan separados.

Estos pases prueban estructura, localización y discriminantes concretos. No validan por sí solos la semántica de cada arista nueva. El contrato marca sus28 cierres como parciales con omisiones explícitas y no habilita wiring: no se presenta un bloque fuente indiviso como cierre transitivo por cada parámetro. La continuación necesaria es descomponer las fronteras señaladas y contrarrevisar el grafo antes de integrar el publicador. Ninguna atestación histórica o candidata adquiere aceptación por estos resultados.
