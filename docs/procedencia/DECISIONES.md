# Decisiones de la auditoría documental

Los criterios siguientes consolidan las decisiones técnicas y sus límites. Los IDs D001–D137 conservan sus referencias; agruparlos no convierte candidatos históricos en trabajos terminados. El [informe](INFORME-FINAL.md) y la [matriz por sitio](correcciones/cierre-r66/MATRIZ-65.md) delimitan el resultado vigente.

## Mapa de decisiones

| Criterio | Decisiones de origen |
| --- | --- |
| [Garantías separadas y revisión independiente](#garantias) | D001, D002, D003, D011, D015, D017, D019, D035, D042, D045, D052, D059, D060, D062, D067, D072, D075, D076, D086, D087, D093, D096, D103, D105, D106 |
| [Identidad del inventario, software y evidencias históricas](#identidad) | D013, D016, D020, D023, D024, D026, D029, D039, D044, D047, D064, D069, D080, D084, D091, D099 |
| [Correcciones fiscales acotadas y contratos explícitos](#fiscal) | D007, D012, D014, D018, D021, D022, D025, D027, D028, D032, D033, D038, D043, D051, D054, D055, D056, D058, D066, D068, D071 |
| [Aritmética legacy, inflación y presentación coherente](#legacy) | D031, D037, D040, D046, D048 |
| [Preservación por cortes, saneamiento y almacenamiento](#preservacion) | D009, D030, D034, D036, D053, D061, D065, D070, D074, D077, D078, D081, D082, D083, D088, D089, D092, D095, D104 |
| [Publicación y dependencias efectivamente servidas](#publicacion) | D049, D050 |
| [Calidad del producto y verificación de entregas](#calidad) | D004, D005, D006, D008, D010, D041, D057, D063 |
| [Causalidad por propiedad, instancia y llamada](#causalidad) | D073, D079, D085, D090, D094, D097, D098, D100, D101, D102, D107, D108, D109, D110, D111, D112, D113, D114, D115, D116, D117, D118, D119, D120, D121, D122, D123, D124, D125, D126, D127, D128, D129, D130, D132, D133, D134, D135, D136 |
| [Cierre del alcance](#cierre) | D131, D137 |

<a id="garantias"></a>
<a id="d001"></a>
<a id="d001-separar-evidencia-verificación-y-aceptación-fiscal"></a>
<a id="d002"></a>
<a id="d002-conservar-la-referencia-legacy-sin-elevarla-a-norma"></a>
<a id="d003"></a>
<a id="d003-inventario-exhaustivo-antes-de-declarar-cobertura"></a>
<a id="d011"></a>
<a id="d011-cerrar-la-aceptación-del-corpus-hasta-enlazar-inventario-y-revisiones"></a>
<a id="d015"></a>
<a id="d015-corpus-de-integridad-con-aceptación-fiscal-deshabilitada"></a>
<a id="d017"></a>
<a id="d017-adoptar-arquitectura-con-puertas-explícitas"></a>
<a id="d019"></a>
<a id="d019-binding-numérico-actual-y-atestación-externa-del-payload-exacto"></a>
<a id="d035"></a>
<a id="d035--candidatos-documentales-sin-sustitución-de-identidad"></a>
<a id="d042"></a>
<a id="d042--correcciones-públicas-como-afirmaciones-contrastables"></a>
<a id="d045"></a>
<a id="d045--nuevas-identidades-sin-heredar-aceptación"></a>
<a id="d052"></a>
<a id="d052--las-condiciones-editoriales-deben-ser-comprobables"></a>
<a id="d059"></a>
<a id="d059--contenido-semántico-antes-de-declarar-completas-las-fichas"></a>
<a id="d060"></a>
<a id="d060--integrar-contratos-documentales-sin-heredar-aprobación"></a>
<a id="d062"></a>
<a id="d062--recibir-la-autoría-sin-confundirla-con-publicación"></a>
<a id="d067"></a>
<a id="d067--enmiendas-por-afirmación-y-dependencias-aún-candidatas"></a>
<a id="d072"></a>
<a id="d072--un-contraste-fijo-no-es-un-validador-general"></a>
<a id="d075"></a>
<a id="d075--aprobar-pares-exactos-sin-reescribir-identidades"></a>
<a id="d076"></a>
<a id="d076--un-rojo-puede-conservar-una-hipótesis-refutada"></a>
<a id="d086"></a>
<a id="d086--la-decisión-nominal-no-habilita-un-período-fiscal"></a>
<a id="d087"></a>
<a id="d087--distinguir-coherencia-de-un-sobre-y-autorización-para-servirlo"></a>
<a id="d093"></a>
<a id="d093--cerrar-la-forma-nominal-con-el-contrato-externo"></a>
<a id="d096"></a>
<a id="d096--preparar-el-lote-documental-tras-corroborar-el-cas"></a>
<a id="d103"></a>
<a id="d103--incorporar-solo-los-264-enlaces-revisados-y-preparar-recuperación-local"></a>
<a id="d105"></a>
<a id="d105--continuar-componentes-parciales-sin-promover-sus-booleanos"></a>
<a id="d106"></a>
<a id="d106--corroborar-la-operación-local-sin-extender-su-aceptación"></a>

## Garantías separadas y revisión independiente

Integridad de bytes, coincidencia numérica, autenticidad, vigencia, interpretación y aceptación fiscal son ejes distintos. La aceptación jurídica y el enlace exacto requieren revisión independiente de originales, unidades, fechas, ámbito y contraejemplos. Los 264 enlaces incorporados se aceptan solo por celda/año sobre 102 sujetos; Madrid 2020 mantiene su identidad y reserva separadas. Una propuesta, una firma autodeclarada, una publicación visible o un fixture coincidente no amplían ese alcance.

**Objeción:** dos lecturas o una reconstrucción pueden repetir el mismo error. **Respuesta:** expectativas externas y dictámenes por proposición, sin trasladar aceptación entre aliases, versiones o ejercicios. Una hipótesis refutada se conserva como tal, sin alterar su esperado para anunciar verde. **Coste:** revisión adicional y estados pendientes explícitos; la exhaustividad del inventario y la aceptación completa siguen sin acreditarse. [Inventario](INVENTARIO.md), [contrato del corpus](CORPUS.md), [enlaces](ENLACES-VERIFICABLES.md).

<a id="identidad"></a>
<a id="d013"></a>
<a id="d013-inventario-técnico-versionado-y-reconstrucción-obligatoria"></a>
<a id="d016"></a>
<a id="d016-reconstruir-en-proceso-nuevo-y-rechazar-prototipos-no-soportados"></a>
<a id="d020"></a>
<a id="d020-integrar-por-contenido-comprobado-y-conservar-versiones-documentales"></a>
<a id="d023"></a>
<a id="d023-cierre-de-dependencias-y-saneamiento-previo-al-hash"></a>
<a id="d024"></a>
<a id="d024-información-perdida-no-admite-binding-numérico"></a>
<a id="d026"></a>
<a id="d026-identidad-del-rastro-en-el-punto-de-código"></a>
<a id="d029"></a>
<a id="d029--integridad-de-la-explicación-actual-e-identidad-de-ficha"></a>
<a id="d039"></a>
<a id="d039--identidad-de-ámbito-y-grafo"></a>
<a id="d044"></a>
<a id="d044--publicación-documental-con-cierre-físico"></a>
<a id="d047"></a>
<a id="d047--árbol-comprometido-y-cobertura-de-evidencia"></a>
<a id="d064"></a>
<a id="d064--el-recibo-conserva-una-versión-semántica-de-software"></a>
<a id="d069"></a>
<a id="d069--gramática-histórica-limitada-para-la-lista-de-fuentes"></a>
<a id="d080"></a>
<a id="d080--una-ocurrencia-y-todos-sus-enlaces-exactos"></a>
<a id="d084"></a>
<a id="d084--corregir-la-identidad-del-consumo-antes-de-componer"></a>
<a id="d091"></a>
<a id="d091--versionar-las-dependencias-nominales-incorporadas"></a>
<a id="d099"></a>
<a id="d099--fijar-los-contenidos-del-plan-sin-congelar-head-para-siempre"></a>

## Identidad del inventario, software y evidencias históricas

Las ocurrencias se identifican por fuente, símbolo, ruta y valor efectivo; su snapshot y software forman parte de la identidad. El inventario se reconstruye desde fuentes actuales en proceso limpio y rechaza tipos no soportados. El rastro fija sitio, instancia y Decimal antes del formato. Cada explicación histórica conserva fuentes y dependencias por hash y se comprueba contra su propia versión, sin ejecutar JavaScript histórico ni sustituirla por el checkout actual.

Una ocurrencia puede tener varios enlaces: se conservan proposición, ámbito, cita, payload y revisión de cada uno; deduplicar bytes no fusiona decisiones jurídicas. El lector histórico admite una gramática limitada explícita, no JavaScript arbitrario. Las citas con información perdida o signos ambiguos se rechazan para binding numérico; los originales permanecen disponibles.

**Objeción:** un extractor y su verificador pueden repetir una omisión, y un hash correcto puede pertenecer a otro campo o versión. **Respuesta:** correspondencias exactas, revisión externa, conjuntos/bytes reconstruidos y dependencias completas; los cambios generan identidad nueva. **Coste:** más IO, artefactos y migraciones explícitas. La identidad no autentica al emisor ni valida fiscalmente el contenido. [Contrato y límites](ENLACES-VERIFICABLES.md).

<a id="fiscal"></a>
<a id="d007"></a>
<a id="d007-investigar-actividades-económicas-antes-de-comprometer-su-implementación"></a>
<a id="d012"></a>
<a id="d012-corregir-el-límite-madrileño-con-la-norma-conservando-la-discrepancia-del-manual"></a>
<a id="d014"></a>
<a id="d014-conservar-pérdidas-y-fechar-exenciones-sin-extender-su-aceptación"></a>
<a id="d018"></a>
<a id="d018-cotizaciones-analíticas-explícitas-y-reducción-en-su-extremo-legal"></a>
<a id="d021"></a>
<a id="d021-edad-cumplida-y-orden-después-de-elegibilidad-acotada"></a>
<a id="d022"></a>
<a id="d022-rechazar-entradas-que-permiten-nan-en-retenciones"></a>
<a id="d025"></a>
<a id="d025-saldo-explícito-de-otras-rentas-y-perfil-heredado-separado"></a>
<a id="d027"></a>
<a id="d027--aplicación-anual-de-deducciones-incompletas"></a>
<a id="d028"></a>
<a id="d028--modo-del-perfil-y-comparación-legacy"></a>
<a id="d032"></a>
<a id="d032--coherencia-temporal-y-errores-recuperables"></a>
<a id="d033"></a>
<a id="d033--identidad-y-fechas-en-consignaciones"></a>
<a id="d038"></a>
<a id="d038--conexión-anual-con-hechos-conciliados-y-alcance-expreso"></a>
<a id="d043"></a>
<a id="d043--cuotas-publicadas-y-rastro-de-la-entrada-anual"></a>
<a id="d051"></a>
<a id="d051--derechos-familiares-declarados-y-reparto-explícito"></a>
<a id="d054"></a>
<a id="d054--conciliar-renta-propia-antes-de-decidir-prioridad-de-grado"></a>
<a id="d055"></a>
<a id="d055--fechas-civiles-del-evento-y-fronteras-pendientes"></a>
<a id="d056"></a>
<a id="d056--los-hechos-de-alimentos-prevalecen-sobre-el-flag-de-cálculo"></a>
<a id="d058"></a>
<a id="d058--alimentos-propios-sin-mínimo-quedan-fuera-del-contrato-anual"></a>
<a id="d066"></a>
<a id="d066--rectificar-pérdidas-de-extracción-sin-reescribir-el-original"></a>
<a id="d068"></a>
<a id="d068--un-techo-no-debe-elevar-el-candidato-inferior"></a>
<a id="d071"></a>
<a id="d071--rectificación-histórica-sin-trasladar-reglas-modernas"></a>

## Correcciones fiscales acotadas y contratos explícitos

Los arreglos demostrados se aplican dentro de sus perfiles, conservando reglas históricas y discrepancias. Madrid conserva el límite legal de 53.407,20 frente a 53.407,29 del manual 2020, sin convertir esa corrección nominal en vigencia civil completa. Las cuotas publicadas de Madrid 2025 tienen tabla anual expresa. Pérdidas, fechas de exención y saldo algebraico de otras rentas mantienen sus contratos; las entradas no finitas, incoherentes o con divisores inválidos se rechazan.

Las cotizaciones analíticas declaran mensualidades uniformes y sus supuestos; no se anuncian como nómina mensual universal. La liquidación respeta ejercicio, selección temporal, modo y variante de cotización. EDS anual solo cubre el perfil 2025 individual de Madrid admitido, con hechos conciliados y exclusiones; no equivale a salario ni a cobertura general de autónomos.

Edad y discapacidad no agotan el derecho a mínimos. Se requieren hechos, renta propia conciliada, prioridad, titulares y reparto explícitos; el redondeo no puede decidir por sí solo el lado del límite de 8.000 euros. Se validan fechas civiles y se separa la constitución del vínculo del inicio de un plazo fiscal. Los cruces de alimentos sin contrato suficiente se rechazan, sin fabricar una cuota o inferir una renuncia a partir de un flag.

Los controles antiguos trasladan únicamente deducciones consignadas; las fórmulas parciales no se presentan como automatización completa. Los algoritmos históricos de retenciones conservan rectificaciones de extracción y reservas de concurrencia, doble600/julio y versiones; los PDF recuperados no habilitan el motor. El techo del subcontrato de alimentos no eleva el candidato inferior y exige sus hechos compatibles.

**Objeción:** corregir una cifra, una condición o un subpaso puede ocultar requisitos y categorías no representados. **Respuesta:** perfiles y rechazos explícitos, originales discrepantes conservados y aceptación limitada al cambio revisado. **Coste:** menor cobertura y contratos adicionales antes de ampliar. [Correcciones de trabajo y cotizaciones](correcciones/trabajo-y-cotizaciones.md), [auditoría de correcciones públicas y reservas](auditorias/correcciones-x-2051956145145712916/INFORME.md).

<a id="legacy"></a>
<a id="d031"></a>
<a id="d031--ipc-observado-escenario-y-sentido-de-comparación"></a>
<a id="d037"></a>
<a id="d037--dos-contratos-aritméticos-y-un-oracle-independiente"></a>
<a id="d040"></a>
<a id="d040--hashes-del-original-y-conversiones-binarias"></a>
<a id="d046"></a>
<a id="d046--comparativa-tabular-y-cobertura-real-de-x"></a>
<a id="d048"></a>
<a id="d048--cuota-y-neto-de-la-comparación-gráfica"></a>

## Aritmética legacy, inflación y presentación coherente

Excel/Python son referencias de comportamiento, no normas. La reproducción tabular conserva tipos y orden binary64 originales; el cálculo monetario canónico mantiene su contrato separado. Las expectativas del Excel se extraen independientemente, sin regenerarlas desde el motor para ocultar diferencias.

El IPC observado se distingue del escenario: diciembre de 2026 no pertenece a la serie observada; el perfil heredado elige explícitamente el 3 %. El producto de tasas publicadas no se equipara a un cociente de índices. La inversión usa el recíproco y la falta de dato no se convierte en cero.

La comparación gráfica resta al neto la misma cuota que selecciona para mostrar y declara ajustes entre componentes redondeados y totales originales. Esa presentación no determina obligación de declarar ni liquidación anual exigible.

**Objeción:** unificar redondeos puede romper reproducción, mientras mezclar cuotas y netos fabrica coherencia aparente. **Respuesta:** contratos separados y contraste independiente. **Coste:** mantener dos aritméticas y explicar diferencias deliberadas. [DAT](revisiones/redondeos-legacy-v1/INFORME.md), [inflación](revisiones/comparativa-inflacion-v1/INFORME.md), [cuota y neto](revisiones/publicacion-cuota-v2/INFORME.md).

<a id="preservacion"></a>
<a id="d009"></a>
<a id="d009-publicar-cabeceras-de-procedencia-sin-cookies-de-sesión"></a>
<a id="d030"></a>
<a id="d030--originales-fuera-del-equipo"></a>
<a id="d034"></a>
<a id="d034--paquetes-de-preservación-inequívocos-y-durables"></a>
<a id="d036"></a>
<a id="d036--publicación-visible-con-durabilidad-indeterminada"></a>
<a id="d053"></a>
<a id="d053--preservar-originales-nuevos-sin-cargar-el-respaldo-de-código"></a>
<a id="d061"></a>
<a id="d061--los-nuevos-originales-se-preservan-fuera-de-t3"></a>
<a id="d065"></a>
<a id="d065--sobre-cerrado-y-durabilidad-distinguida-de-presencia"></a>
<a id="d070"></a>
<a id="d070--unicidad-de-evidencia-y-multiplicidad-de-observaciones"></a>
<a id="d074"></a>
<a id="d074--preservar-el-corte-candidato-sin-presentarlo-como-actual"></a>
<a id="d077"></a>
<a id="d077--conservar-un-corte-y-endurecer-su-consumidor-son-operaciones-distintas"></a>
<a id="d078"></a>
<a id="d078--completar-el-censo-por-referencias-no-por-número-de-hashes"></a>
<a id="d081"></a>
<a id="d081--conservar-el-identificador-documental-borm-sin-admitir-queries-libres"></a>
<a id="d082"></a>
<a id="d082--mantener-el-original-grande-y-separar-su-almacenamiento"></a>
<a id="d083"></a>
<a id="d083--preservar-v5-r2-con-su-entrada-exacta-y-sin-ampliar-el-corte"></a>
<a id="d088"></a>
<a id="d088--clasificar-la-huella-antes-de-heredar-la-url-contigua"></a>
<a id="d089"></a>
<a id="d089--incorporar-cas-externo-como-mecanismo-local-candidato"></a>
<a id="d092"></a>
<a id="d092--no-equiparar-origen-y-software-ni-documento-y-recorte"></a>
<a id="d095"></a>
<a id="d095--conservar-una-evidencia-comprimida-mayor-que-el-umbral-local-de-recepción"></a>
<a id="d104"></a>
<a id="d104--separar-el-cas-operativo-del-paquete-congelado-y-conservar-la-publicación-anterior"></a>

## Preservación por cortes, saneamiento y almacenamiento

Los originales conservan sus bytes y hashes. Los metadatos públicos omiten cookies y autorización; endpoints documentales admitidos tienen contratos estrechos y no heredan oficialidad de una URL contigua. Hash documental, recorte, texto, selección y software son clases distintas; sin contexto suficiente se conserva «desconocido». La política no certifica anonimización universal ni autenticidad histórica.

Los paquetes usan schemas cerrados, rutas e identidades inequívocas, conjunto exacto y comprobación física. Un fallo de sincronización después de hacer visible el manifiesto comunica durabilidad indeterminada y exige recuperación; borrar un marcador no demuestra rollback durable. La multiplicidad de observaciones se informa aparte de los registros únicos. Las excepciones históricas se restringen al pin completo externo y no las hereda un sobre editado.

Un corte congelado no cambia al endurecer su consumidor o descubrir fuentes posteriores. V5 r2 conserva R26 y sus reservas de selección; las referencias no resueltas no se dan por cerradas. Crossa mantiene V1 desfasado, en la misma vivienda y bajo el mismo propietario. El CAS operativo se separa del paquete y Git no restaura por sí solo los originales grandes. El límite del almacén interno se mantiene; las excepciones de artefactos técnicos son enumeradas, no permiso general para insertar PDF grandes.

**Objeción:** hashes y copias locales no prueban selección exhaustiva, durabilidad ni custodia independiente. **Respuesta:** pin externo, manifiestos, restauración y estados diferenciados; adquisiciones posteriores requieren otra edición. **Coste:** espacio, IO y configuración de recuperación. Preparar una transferencia no autoriza gasto ni LFS; los punteros no transfieren objetos. [Conservación e identidades](INFORME-FINAL.md#respaldo-y-conservación), [contrato del corpus](CORPUS.md).

<a id="publicacion"></a>
<a id="d049"></a>
<a id="d049--verificar-la-ruta-compilada-y-conservar-respuestas-http"></a>
<a id="d050"></a>
<a id="d050--dependencias-documentales-en-el-paquete-de-next"></a>

## Publicación y dependencias efectivamente servidas

Las fichas usan el contrato Response/Web Streams y esperan el render completo, conservando rechazos y políticas de contenido. Una ruta que compila debe probarse sirviendo sus respuestas reales. Las trazas del paquete incluyen expresamente snapshots y objetos necesarios, también los históricos.

**Objeción:** un GET dentro del repositorio puede leer archivos ausentes del paquete distribuido. **Respuesta:** comprobar una copia formada por las trazas y medir sus dependencias. **Coste:** volumen histórico, pruebas de empaquetado y compatibilidad con límites de alojamiento aún no acreditada. Estas decisiones no constituyen despliegue ni capacidad de producción certificada. [Resultado y límites de publicación](INFORME-FINAL.md).

<a id="calidad"></a>
<a id="d004"></a>
<a id="d004-oxlint-anti-slop-junto-a-eslint-de-next"></a>
<a id="d005"></a>
<a id="d005-bootstrap-con-deuda-explícita-y-ci-acotada"></a>
<a id="d006"></a>
<a id="d006-no-inicializar-jj-en-checkouts-git-gestionados-por-t3"></a>
<a id="d008"></a>
<a id="d008-preservar-defensas-runtime-durante-la-corrección-de-lint"></a>
<a id="d010"></a>
<a id="d010-separar-artefactos-temporales-de-las-fuentes-comprobadas"></a>
<a id="d041"></a>
<a id="d041--copias-aisladas-y-configuración-de-lint"></a>
<a id="d057"></a>
<a id="d057--sol-61-high-para-todos-los-hijos"></a>
<a id="d063"></a>
<a id="d063--separar-recepción-acotada-y-trabajos-pesados"></a>

## Calidad del producto y verificación de entregas

ESLint y oxlint cumplen funciones complementarias; las 16 reglas anti-slop permanecen a error. Las correcciones de lint preservan defensas runtime y no alteran cifras para obtener verde. El runtime incorporado mantiene comprobación TypeScript separada; los tipos principal/vendor y el tipado estricto MJS son garantías distintas. La deuda y los avisos se declaran por su host y edición comprobados.

Los temporales y copias aisladas no reciben por sí solos garantía global de producto. Su promoción exige controles de su lenguaje. Las entregas se cotejan contra base y archivos físicos, además de VCS; no se acepta un índice como única prueba. Se conservan originales de instrumentos adaptados y se verifica el contenido efectivamente respaldado.

**Objeción:** excluir temporales o comprobar una configuración parcial puede ocultar regresiones. **Respuesta:** alcance explícito, configuración global de producto y controles de las fuentes mantenidas, sin excepciones genéricas por regla. **Coste:** dos analizadores, proyectos de tipos separados y verificaciones adicionales. Los antiguos acuerdos sobre modelos, checkouts, bloqueos y bootstrap fueron operativos; sus IDs se conservan para referencias y no fijan capacidades del producto. [Calidad acreditada y deuda](INFORME-FINAL.md#calidad-y-mantenimiento).

<a id="causalidad"></a>
<a id="d073"></a>
<a id="d073--completar-el-flujo-por-propiedades-y-contratos-de-llamada"></a>
<a id="d079"></a>
<a id="d079--componer-las-páginas-conservando-la-dirección-y-el-estado-de-cada-relación"></a>
<a id="d085"></a>
<a id="d085--construir-un-contrato-común-de-puertos-para-las-páginas"></a>
<a id="d090"></a>
<a id="d090--completar-la-composición-por-contratos-concretos"></a>
<a id="d094"></a>
<a id="d094--separar-cierres-de-valor-selección-y-admisión-sin-declarar-terminado-el-conjunto"></a>
<a id="d097"></a>
<a id="d097--revisar-la-suficiencia-del-fragmento-antes-de-aceptar-sus-cierres"></a>
<a id="d098"></a>
<a id="d098--recibir-los-fragmentos-sin-aceptar-todavía-su-cierre-conjunto"></a>
<a id="d100"></a>
<a id="d100--completar-las-correspondencias-omitidas-sin-repetir-una-revisión-favorable-parcial"></a>
<a id="d101"></a>
<a id="d101--hacer-evaluable-la-admisión-y-declarar-su-dominio"></a>
<a id="d102"></a>
<a id="d102--corregir-origen-sin-atribuir-suficiencia-al-cierre"></a>
<a id="d107"></a>
<a id="d107--corroborar-el-valor-y-selección-de-retenciones-bajo-condiciones-explícitas"></a>
<a id="d108"></a>
<a id="d108--revisar-dimensiones-y-suficiencia-del-candidato-ss-por-separado-de-sus-cifras"></a>
<a id="d109"></a>
<a id="d109--integrar-programas-condicionados-con-el-arnés-sometido-a-las-reglas-globales"></a>
<a id="d110"></a>
<a id="d110--corregir-dimensiones-y-argumentos-con-expectativas-externas"></a>
<a id="d111"></a>
<a id="d111--declarar-las-lecturas-necesarias-antes-de-componer-escalas"></a>
<a id="d112"></a>
<a id="d112--corroborar-r41-sin-encadenar-revisiones-favorables-de-los-mismos-bytes"></a>
<a id="d113"></a>
<a id="d113--corroborar-fronteras-bajo-sus-condiciones-y-conservar-el-arnés-original"></a>
<a id="d114"></a>
<a id="d114--componer-contratos-revisados-sin-anticipar-la-admisión"></a>
<a id="d115"></a>
<a id="d115--recibir-admisión-ejecutable-sin-convertir-recibos-financieros-en-aceptación"></a>
<a id="d116"></a>
<a id="d116--conservar-los-puentes-sin-confundirlos-con-composición-terminada"></a>
<a id="d117"></a>
<a id="d117--corregir-identidad-forma-y-selección-antes-de-aceptar-recibos"></a>
<a id="d118"></a>
<a id="d118--completar-los-puertos-antes-del-grafo-de-cierre-común"></a>
<a id="d119"></a>
<a id="d119--conservar-atributos-de-constructor-y-versionar-el-recibo"></a>
<a id="d120"></a>
<a id="d120--corroborar-identidad-sin-confundirla-con-aceptación-de-valores"></a>
<a id="d121"></a>
<a id="d121--corroborar-resultados-finitos-con-su-precondición-de-composición"></a>
<a id="d122"></a>
<a id="d122--hacer-ejecutables-los-puertos-y-revisar-su-suficiencia-antes-de-componer-cierres"></a>
<a id="d123"></a>
<a id="d123--conservar-el-dominio-de-registros-y-declarar-cada-propiedad-consumida"></a>
<a id="d124"></a>
<a id="d124--corroborar-puertos-y-avanzar-a-dependencias-transitivas"></a>
<a id="d125"></a>
<a id="d125--completar-una-vertical-causal-antes-de-extender-el-grafo"></a>
<a id="d126"></a>
<a id="d126--revisar-la-semántica-causal-y-comprobar-la-configuración-global"></a>
<a id="d127"></a>
<a id="d127--exigir-obligaciones-satisfechas-y-separar-estructura-de-valores-en-los-folds"></a>
<a id="d128"></a>
<a id="d128--corroborar-la-vertical-ss-y-extender-la-evidencia-a-retenciones"></a>
<a id="d129"></a>
<a id="d129--compartir-el-evaluador-finito-y-revisar-la-gramática-añadida"></a>
<a id="d130"></a>
<a id="d130--avanzar-a-rentas-generales-con-una-frontera-ss-concreta"></a>
<a id="d132"></a>
<a id="d132--cerrar-rentas-generales-bajo-condiciones-sin-repetir-revisión-favorable"></a>
<a id="d133"></a>
<a id="d133--agrupar-escalas-y-conservar-las-variantes-excluidas-como-bloqueo"></a>
<a id="d134"></a>
<a id="d134--cerrar-escalas-bajo-condiciones-y-conservar-el-bloqueo-de-actividad"></a>
<a id="d135"></a>
<a id="d135--recibir-los-últimos-diez-sitios-y-reservar-una-única-revisión"></a>
<a id="d136"></a>
<a id="d136--conservar-identidad-mutable-e-instantáneas-para-el-defecto-reproducido"></a>

## Causalidad por propiedad, instancia y llamada

La evidencia debe resolver productores, argumentos, propiedades consumidas, unidades, selección, colecciones y transporte hasta terminales admitidos. Una referencia al cuerpo de una función, una dirección de arista asumida o un número coincidente no resuelven causalidad. Se distinguen propiedad de salida y entrada, declaración y argumento, receptor y callback, pertenencia estructural y operando financiero. Los puertos aislados no cierran sus obligaciones transitivas.

La semántica documental es finita y está ligada al software. Se contrasta con API reales, expectativas racionales y adulteraciones que conservan el importe. Un replay compartido puede repetir errores; su reconstrucción acredita integridad de receta, no suficiencia universal. El dominio ordinario, el servicio normativo concreto, runtime fijo y preadmisión factual externa siguen siendo condiciones. El decoder conserva estructura dentro de su contrato, sin prometer transformaciones/defaults arbitrarios de Effect.

Los recibos conservan tipos, propiedades, orden y atributos relevantes; normalizar identidad entre constructores reconocidos no autentica emisores ni valida importes. Los cambios de codec necesitan recibos nuevos, sin reescribir históricos. Las obligaciones pendientes se rechazan en productor y verificador. Los folds distinguen receptor y orden estructurales de operandos propios; las mutaciones mantienen alias compartidos e instantáneas anteriores, y se comprueba el retorno completo.

**Objeción:** pruebas numéricas y schemas correctos pueden coexistir con omisiones de propiedades, unidades falsas o pasos perdidos. **Respuesta:** revisión independiente por propiedad/instancia, casos de sustracción, argumentos reales e historia causal. **Coste:** mantener una segunda semántica, contratos y testigos por versión; subsisten deuda `checkJs`, restricciones de Effect y composición/admisión pendientes. Los hitos parciales y objetivos históricos de continuación no amplían el cierre final definido en D131/D137. [Dictámenes por dominio y reservas](INFORME-FINAL.md#qué-queda-demostrado), [matriz individual](correcciones/cierre-r66/MATRIZ-65.md).

<a id="cierre"></a>
<a id="d131"></a>
<a id="d131--final-explícito-en-65-sitios-y-revisión-única-por-lote"></a>
<a id="d137"></a>

## D137 — Cerrar el encargo acotado sin promover garantías globales

El alcance final comprende los 65 sitios o su bloqueo demostrado: **64 corroboraciones técnicas condicionadas y un bloqueo de actividad**. Las variantes excluidas se distinguen de los perfiles corroborados. Las 19 familias, composición global, admisión y activación de puertas quedan fuera; los objetivos históricos más amplios no se presentan como completados.

`siteClosed`, `admissionClosed`, `wiringAllowed` y `completeRuleAcceptance` permanecen en **`false`**. Una revisión favorable no se repite sin cambios ni problema nuevo; un defecto reproducido exige corrección y contraste acotados. El cierre conserva cada dictamen, sus condiciones y la evidencia discrepante.

**Objeción:** sumar sitios puede ocultar ramas excluidas o hacer pasar un replay por validación fiscal. **Respuesta:** matriz por ID, condiciones explícitas y trabajos posteriores separados. **Coste:** semántica finita y deuda técnica mantenidas; no existe garantía universal ni corpus remoto completo acreditado. Los rangos de esfuerzo son planificación incierta: 32–64 h para familias; composición, admisión y puertas tienen sus propias dependencias. La provisión jurídica de 80–200 h solo cubre una primera fase acotada, sin cota total defendible para 2012–2026. [Resultados, evidencias, conservación y estimaciones](INFORME-FINAL.md).
