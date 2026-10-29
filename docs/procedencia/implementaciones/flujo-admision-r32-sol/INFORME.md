# Admisión pública anual R32, candidato Sol

Base exigida: `846f25e183ba07414065d4e6bdf9e98311b98a17`, 16.855 entradas. Implementación por el runtime real gpt-6.1-sol, esfuerzo high, en T3 Code mediante Codex; sin subdelegación. No se emite atestación ni se verifica independientemente la autoría propia. La prioridad fue solicitada por el encargo; este proceso no dispone de un recibo independiente del planificador para certificarla.

El contrato exportable es `anual-publico-r32`. Produce un fragmento separado, con diecisiete siteId, puertos y aristas de admisión. `siteClosed`, `completeRuleAcceptance` y `wiringAllowed` son false. El cierre candidato de admisión describe ejecución del software fijado; no acredita autenticidad, derecho fiscal, fórmulas de SS/retención ni composición/publicación. Las conclusiones nuevas requieren contraste del padre y revisión independiente.

## Recepción

El cotejo inicial terminó antes de editar scripts, schema o pruebas. Instrumento en `.cache/flujo-admision-r32/cotejo.cjs`, recibo `recepcion-inicial.json`: lstat, readlink, bytes y ejecutabilidad de las 16.855 entradas, un blob por invocación; cero cambios y ausencias; diff vacío. Se adquirió exclusivamente `/tmp/irobopf-recepcion-acotada.lock`. La espera de ese bloqueo no se presentó como validación terminada.

Se leyeron BRIEF, instrucciones locales, contrato de auditoría, coordinación, situación ESTADO/DECISIONES, recepción R30/R32, CONTINUACION y nominal R32. Las instrucciones urgentes revocan modelo, delegación, mutaciones VCS y limpieza del BRIEF. No se consultaron entregas activas ni se alteraron informes históricos, compositor, motor, confianza o snapshots. Para Effect se consultaron list y guías basics, services-and-layers, testing, error-handling, además del test local de Effect v4.

## APIs, resultados y sitios

`construirLiquidarIrpfAnual` es una fábrica privada capturada por `LiquidacionIrpfAnual.layer`; `liquidarTrabajoIndividualSimple` también es privado. No son entradas públicas independientes. El servicio obtenido de ese layer, `liquidarIrpfAnual` y `liquidarIrpfAnualConDerechos` llegan a los once `anual.ss.*` y dos `anual.pagos.*` cuando devuelven `LiquidacionIrpfAnualCalculada`. Los cuatro `anual.retencion.*` requieren además subcaso presente y éxito del servicio de retención. Se construyen todos después de sus operaciones falibles; un Effect.fail no devuelve un rastro anual parcial con esos sitios, aunque SS ya se haya calculado internamente.

`ConDerechos` valida hechos antes de invocar al anual canónico. En cambio, la API ordinaria comprueba primero igualdad de ejercicio de la retención, luego derechos. La misma entrada con dos defectos puede devolver motivos distintos según API. No se convierte rechazo en éxito con `_tag: ResultadoNoSoportado`: está en canal de error.

`liquidarIrpfAnualExplicito` es una ruta diferente, Madrid 2025, que conecta realmente `adaptarTrabajoAnual` o `adaptarActividadGeneral`. Usa sitios `anual.explicito.*`; su intersección con estos diecisiete sitios es vacía tanto en éxito como en rechazo. No hay arista hacia `liquidarTrabajoIndividualSimple`. No se revalidan sus fórmulas ajenas para demostrar esa ausencia. `calcularRetencionTrabajoAeat` aislada tampoco crea sitios anuales: los cuatro los crea `pasoRetencionTrabajoAeat` del anual.

El adaptador salarial `casoFiscalLegacy` se conecta efectivamente al servicio anual. Transporta año y salario, fija edad 40, cero pagos, sin derechos y perfil por defecto soltero; comunidad por defecto simulada. El subcaso aparece solo si se suministra perfilAuditoria o seleccionRetencion. Copia selección temporal, año, salario y SS calculada según modo. El perfil determina hijos y situación de retención; el usuario no aporta esos subcampos por esta API. La salida salarial pública proyecta importes y pierde el rastro, aunque los sitios existan en la liquidación interna.

## Guardas, orden y dependencias

`fragmento.json` conserva `evaluationOrder`, árboles booleanos con cortocircuito izquierda/derecha, cuerpos completos de predicados y schemas, llamadas con índices de argumento y rangos AST UTF-16 [start,end), path y SHA256. Los predicados familiares no terminan en el nombre de un helper: están expandidos `cumpleRentas`, `tieneRelacion`, `titularesConDerecho`, fechas, esquema y controles de coherencia, renta y empate. Los valores numéricos de fórmulas fiscales ajenas se reciben por frontera de valor; su transporte y el predicado que los consume sí están descritos aquí.

La guarda anual compara ejercicio del subcaso y del caso. Con derechos exige schema cerrado de Madrid 2025 común individual y devengo 31/12, sin fallecimientos ni ascendientes. Comprueba IDs, nacimiento/edad, censo, custodia, consistencia entre titulares, residencia propia, convivencia exclusiva, ausencia de ciclos sujeto/titular, especialidad judicial y grados/vínculos/fechas/mayoría/bisiesto y concurrencia. Tras validar, alimentos propios sin derecho al mínimo bloquean el anual; no se atribuye una especialidad que el motor no calcula.

Elegibilidad relevante: renta descendiente <=800.000 céntimos y no declaración o renta declarada <=180.000; edad <25 o discapacidad. Titulares residentes con relación o custodia compartida, excluido pagador judicial sin custodia. Se toma grado próximo salvo grados siguientes presentes y todos próximos con renta <=800.000, en cuyo caso se toman siguientes. Más de dos grados o renta mixta próxima con concurrencia fallan. La compatibilidad anual exige modo canónico, ejercicio/territorio/edad/discapacidad coherentes, sin familiares del perfil parcial ni fallecimiento. No se infieren hechos legales externos de estos campos.

La renta propia se contrasta después de netos: trabajo más alquiler simplificado y ganancias sujetas general/ahorro, antes de reducciones y compensaciones. Requiere declaración de conciliación; renta finita; redondeo half-up a céntimos igual a cada titular propio y mismo lado del umbral de 8.000 euros. Usar bruto o base liquidable es transporte incorrecto. El cálculo de derechos se repite con mínimos estatal y autonómico; después de seleccionar y ordenar por nacimiento/id, empate de fecha con distinto divisor rechaza.

Sin deducciones se evita catálogo. Con deducciones solo se consulta la primera: tanto no catalogada como reconocida sin implementación fallan, con motivos diferentes. La deducción agregada manual sigue otra vía: se aplica sin que la lista pendiente la legitime. El selector territorial es puro: 2012–2025 tienen rama, 2026 solo simulada-estatal; año fuera del conjunto falla en el selector si la ejecución llega hasta él, pero puede haber antes un defecto de índice. No se promete rechazo recuperable universal de entradas JS fuera del tipo.

Retención exige edad opcional y edades familiares enteras seguras no negativas, retribución y cotizaciones obligatorias enteras seguras no negativas, importes opcionales seguros no negativos, arrays de familiares, convivencia de ascendiente entera positiva, familiar distinto general y strings laboral/contrato. Estos últimos son strings, no una validación runtime completa de sus enums. Situación1 exige hijos antes y después del filtro canónico. Los flags y discapacidad no reciben validación completa por esta guarda.

Tras ese predicado se rechaza regularización. Legacy prohíbe fecha/perfil temporal y retorna antes de versión, límites IRREGULAR1, manuales y filtro canónico. Canónico selecciona tabla: calendario civil válido del año; fecha/perfil mutuamente excluyentes; intervalos inclusivos; cierre busca 31/12; ausencia de selección solo admite versión única de año entero. 2012–2016 no tienen versión; 2026 solo 10/09–29/10 y no cierre. Luego IRREGULAR1 <=90.000 euros y <=30% retribución, contrato no manuales y situación1 aún con hijos de edad <25 o discapacidad. Rangos, cambios y versiones exactos se conservan en tabla AST del catálogo fijado, no se extrapolan a otros días.

El anual entrega `caso.retencionTrabajoAeat` y `contexto` por identidad al subservicio. No completa SS ni retribución desde la renta anual ni corrige sus familiares. La retención estimada se suma a pagos a cuenta, no a retenciones soportadas; ambos campos declarados conservan su identidad.

## Inyección y supuestos

El layer anual proporciona sus cuatro servicios. El wrapper público proporciona de nuevo ese layer y no se sustituye suministrando externamente otro servicio anual. Un consumidor que obtiene `LiquidacionIrpfAnual` puede recibir implementación arbitraria: el contrato no afirma que esa implementación cree ningún sitio. Cotizaciones y política monetaria se capturan, pero el cuerpo simple usa funciones puras para SS y conversiones. Parámetros inyectados se usan en mínimos estatales fallback y catálogo, mientras el selector territorial es puro. Retención sí usa servicio capturado y llamada condicional.

El caso anual es interfaz TS sin decode general: no ejecuta una validación integral de rangos monetarios/edad, un régimen ni elegibilidad real para doce mensualidades uniformes. `reducciones` no participa como guarda. Los supuestos escritos del perfil SS no son rechazos ejecutados. Errores Decimal/índice/acceso son defectos cuando ocurren; no se rebautizan Effect.fail. La corrección jurídica y el ámbito temporal de fórmulas permanecen pendientes.

## Decisiones y límites de verificación

Las decisiones con objeción experta, respuesta y coste están en DECISIONES.json. La reconstrucción del contrato exige pines fijados; un candidato no puede recalcular su propio hash y autorizar otra fuente. El verificador rechaza también alteraciones del artefacto respecto de la reconstrucción. Su límite es deliberado: detecta obsolescencia por cambio de bytes, incluso semánticamente equivalente. La revisión del padre debe examinar la interpretación y las fronteras además de esos controles.

Las mutaciones eliminan cada guarda referenciada o cruzan campos y verifican invalidación del contrato fijado. No se presentan como ejecución de todos los mutantes del motor ni como prueba universal de equivalencia. Los controles reales usan el motor sin mocks de módulos y distinguen éxito, rechazo y orden. No son una contrarrevisión independiente.

## Hallazgo de producto separado

A32-P01: pagosACuentaCentimos y retencionesSoportadasCentimos negativos se admiten en la API anual tipada. El ensayo conserva éxito y total negativo, en vez de inventar una guarda. El contrato no declara corrección jurídica de ello. No se corrige el motor; el padre debe contrastar si requiere rechazo o un contrato explícito de ajustes negativos. A32-P02: los enums de contrato/situación laboral del subservicio solo reciben control string; el riesgo de entrada JS ajena al tipo debe revisarse sin atribuirle cobertura runtime inexistente.

## Reproducción

Dependencias recibidas del padre exclusivamente en lectura. Nix proporciona Node/Bun; no se crea entorno Python, node_modules ni copia de app en docs. La variable `IROBOPF_DEPENDENCIES_PACKAGE=/home/elies/Repos/IRoboPF/package.json` configura resolución del TypeScript existente; tras integrar, se omite si las dependencias están instaladas en el checkout receptor.

Generar: `node scripts/procedencia/flujo-admision-r32.mjs write`. Verificar: mismo comando sin write. Pruebas focalizadas con configuración scratch; lint/tipos y todos los recorridos pesados toman y liberan el bloqueo común por comando. No se ejecuta Next build, servidor, preview ni suites legacy masivas. Comandos y resultados efectivos se conservan en los recibos de validación; ningún comando pendiente se considera aprobado.

## Resultados efectivos finales

El rojo previo conservado ejecutó 169 pruebas: 168 correctas y una fallida por ausencia de `evaluateRetentionAdmission`. Tras incorporar el predicado, el primer y último pase completo del alcance dan 204 correctas: 61 del contrato/mutaciones y 143 de ejecución real/predicado. No se modificaron esperados históricos ni el motor. Los registros JSON conservan cada caso y su estado. Los recuentos no representan reglas fiscales aceptadas.

Tipos del alcance e imports transitivos pasan con configuración scratch que resuelve Effect y tipos Node desde dependencias recibidas. El primer fallo por resolución de paquetes se conserva como `tipos-entorno-inicial.log`; no fue rojo fiscal. El segundo pase independiente de tipos también terminó con código cero. Oxlint final pasa con un hilo, disable-nested-config y las dieciséis reglas a error; ESLint final pasa sin diagnósticos. Se conservan el error propio inicial de spread condicional vacío y los avisos iniciales de variables omitidas, luego corregidos sin tocar comportamiento.

El schema nuevo usa draft-07, compatible con Ajv6 recibido; es un formato específico nuevo y no migra ni relaja schemas históricos. Su primer control legítimo rechazó evidencia AST por un tipo incorrecto string; el fallo y schema previo quedan conservados. Se corrige evidence a referencia AST cerrada. El pase final admite el legítimo y rechaza promoción fiscal, wiring, campo extra y sitio perdido. La reconstrucción exacta por módulo aporta el control semántico; el schema por sí solo no acredita cierre. Dos errores de sintaxis en instrumentos scratch de generación de pines/schema se corrigieron antes de utilizarlos; no son pruebas de producto ni ejecuciones correctas.

El cotejo físico final volvió a concluir correctamente: 16.855 entradas base, cero cambios y cero ausencias, diff vacío. No hay archivos base modificados a los que atribuir un hash anterior distinto; todos los payloads de esta entrega son adiciones y declaran `baseSha256:null`. Inventario, motor, confianza e históricos conservan sus bytes. Solo se añaden las rutas autorizadas; no hubo operaciones VCS mutantes.

El manifiesto enumera rutas relativas, SHA256, tamaño y baseSha256; el sobre separa sus propios archivos para evitar hashes autorreferentes. El patch textual gzip contiene esas adiciones contra la base, y TRANSPORTE.json registra su aplicación en scratch vacío y comparación de bytes por ruta. No hay binarios nuevos de producto: la lista binaria es vacía; el gzip del patch es un sobre de transporte. El CAS de fuentes técnicas continúa en scratch y puede recuperarse del commit base según CAS.json. Conservarlo antes de retirar este checkout; no se escribe fuera del ámbito propio ni se transfiere al exterior.

La admisión técnica finita queda entregada como candidata para los diecisiete sitios. La composición con valor/selección, la revisión independiente y el contraste del padre no son autoaceptados por esta entrega. El encargo global del BRIEF permanece abierto.
