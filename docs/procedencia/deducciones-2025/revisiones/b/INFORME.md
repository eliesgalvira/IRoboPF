# Revisión independiente del lote B — ejercicio 2025

**Requiere rectificación documental; no procede aceptar el recuento 2/46 como resultado final de esta revisión.** Se emiten 48 decisiones: 27 Asturias y 21 Cantabria. Hay **tres diferencias respecto de código/ficha**: dos del helper parcial ya conocidas y una frontera nueva de renta en la ficha de estudios. Los otros 45 globales permanecen sin certificación fiscal completa; sus campos legibles tienen contrastes y casos específicos en [decisiones.json](decisiones.json), no 45 declaraciones de imposibilidad de leer la norma. Separadamente, hay defectos de atribución jurídica en la evidencia. Ninguna de estas cifras acredita un error en la cuota de la declaración visible.

HEAD leído antes de escribir: `2aa38fec9a1e43ca63ae8e464577d05d9cbcf1ca`. Base del contraste de las fichas y pruebas: `016ec72d9539ccd887202735960ce306bd2354e5`. Sin subdelegación, edición de producto ni mutación VCS. La precisión comunicada sobre `1cbb5f7716e13cd2d2e80bd30ece4eb448c80793` se considera exclusivamente editorial: fecha del manual desconocida como publicación; el pie acredita fecha editorial 21/10/2026. No se cambia el HEAD ni la entrega del autor. Se mantiene fuera del ámbito la revisión técnica de URL/fecha.

## Decisión sobre las 19 modificaciones

El diff regional contiene exactamente 19 fichas afectadas: cuidado de familiares y las 18 descripciones `mixta`. Conserva tipos, identificadores, exports y claves manuales. El diff del test añade cinco pruebas, pero solo obras/economía social y cuidado tienen aserciones fiscales textuales específicas. La prueba que comprueba ausencia de la frase genérica no acredita la corrección de las otras descripciones.

La recomposición independiente anterior arroja21 diferencias y27 sin verificación global:19 fichas cambiadas más los dos helpers. Después quedan3 diferencias y45 sin certificación global. No se cuentan los18 defectos de atribución como18 nuevas deducciones con cálculo erróneo.

La clasificación **anterior** de las 18 promesas como diferencias documentales se sostiene: ni `cuantia` indicaba magnitudes fiscales ni la ruta de consignación ejecutaba los controles prometidos. Los discriminantes documentales bastan para demostrar esa omisión, no para contar errores numéricos ni fórmulas corregidas. La corrección de cuidado elimina una restricción del contribuyente que no está en el artículo 2.2. Se acepta ese cambio, con la reserva de que el derecho también exige categoría familiar, convivencia e incompatibilidades.

De los 18 resúmenes nuevos, **17 son aceptables con alcance cuantitativo parcial**. Se examinó cada uno, con porcentajes, topes, modalidades y condiciones resumidas individualizados en el JSON y en la matriz. No se exige convertir un resumen manual en motor completo, pero tampoco se eleva su aritmética legible a `no_verificable` por carecer de evaluador.

**El resumen de traslado por estudios requiere rectificación.** Dice «rentas anuales no superiores a 8.000 euros», mientras Ley 3/2024 art. 3.Uno, redacción del art. 2.11.4, excluye rentas iguales o superiores a 8.000. Hijo estudiante elegible de 24 años, renta exactamente 8.000: norma cero; la frase permite 200 nominales, o 100 por progenitor en individual. A 7.999,99 sí puede cumplir; a 8.000,01 no. Se prueba una contradicción de ficha, no el importe aplicado por consignación. Testimonio `rb-1`; manual pp.225–226.

Otros límites de lectura que deben conservarse: donativos comparte la base máxima del 10% con las deducciones estatales, no dispone de otra base independiente; obras incrementa 500 por cada contribuyente discapacitado en conjunta; guardería general reparte según gasto justificado; economía social mantiene inversión cinco años y condiciones de entidad tres; viviendas vacías limita la titularidad total a tres viviendas, no permite deducir tres de una cartera mayor. Sus descripciones no sustituyen esos apartados.

## Literalidad y correspondencia jurídica

Se reextrajeron las **672 citas**, y se comprobaron tamaño, SHA-256 y SHA-512 de los **16 documentos** del autor. Todo pasa. Eso no confirma sus artículos. [rectificaciones-citas.json](rectificaciones-citas.json) identifica **18 atribuciones que deben corregirse o sustituirse**, sin duplicar sus textos:

- En las citas HTML cántabras se arrastra como artículo el encabezado de la escala IRPF, un anexo de tasas o «Créditos ampliables». Los pasajes fiscales pertenecen a los apartados del art.3 de las leyes reformadoras; las correcciones distinguen artículo modificador y artículo modificado.
- La cita de familia numerosa que se usa para autónomos asturianos pertenece a art.39.Seis de Ley4/2023, redacción del art.11. No prueba el art.14 quinquies.
- La factura del art.6.4 de vivienda protegida, Ley4/2023 art.39.Tres, se atribuye a transporte, emancipación y gastos vitales. El límite de renta del art.14 duodecies.2 también se usa como testimonio de emancipación. El texto literal repetido no crea una remisión jurídica.

**Educación cántabra:** el consolidado conserva dos apartados «13», uno histórico de inflación 2022 y otro de educación (`13 [sic]`). Las citas `n1` y `n2` y varias comparaciones de renta, modalidad y temporalidad corresponden al primero. Deben retirarse de la evidencia de educación. No existe en esa deducción el límite de renta 22.946/31.485 por esa vía. La descripción nueva de educación es cuantitativamente correcta; el defecto está en sus comparaciones/citas, no en haber calculado una deducción por inflación en 2025. Fuente primaria: Ley3/2023 art.3.Ocho; manual pp.229–230.

**Vehículos asturianos:** la cita `n1` del consolidado incorpora 2026. La Ley5/2025 art.39.21 queda fuera de los apartados1–17 que entran en vigor en 2025. Para acreditar 2025 corresponde Ley8/2024 art.39.3. La ficha limita su afirmación a2025; el defecto temporal es del testimonio utilizado. También se deben contrastar las categorías del anexo MOVES para el vehículo concreto.

Se inspeccionaron visualmente las páginas104,225,229 y238 del PDF del manual: tabla de libros individual/conjunta, separación entre traslado laboral y estudios, separación entre economía social y educación y alcance de la titularidad de viviendas. Capturas en transporte privado, sin originales en Git.

## Vigencia: reservas que pueden levantarse y las que quedan

La [matriz de 48 artículos/apartados](matriz-vigencia.json) distingue norma base, redacción modificadora, publicación primaria conservada, entrada en vigor, correcciones y reserva concreta. No exige reconstruir textos íntegramente sustituidos para conocer una redacción posterior completa, ni convierte la ausencia del facsímil autonómico en desconocimiento del contenido publicado en BOE.

Se recuperó **Ley3/2023 en BOC extraordinario87 de29/12/2023, CVE-2023-11100**, desde su índice oficial hasta el PDF. Se mantiene `tipo: reforma`: es publicación primaria de norma modificadora. Corrobora art.3.Dos/Tres/Cuatro/Cinco/Seis/Ocho/Nueve y DF segunda (1/1/2024). Nacimiento queda acreditado por norma autonómica, además del BOE ya conservado; no procede conservar allí la reserva de «falta de original autonómico». El documento BOE-A-2024-1373 es publicación BOE, no facsímil BOC.

Ley3/2024, ya conservada en BOC, sustituye el apartado11 completo y añade15–17: art.3.Uno a Cuatro, DF segunda desde1/1/2025. Sus reglas pueden contrastarse sin exigir toda la sucesión anterior de versiones del apartado11. Queda pendiente la delimitación municipal concreta por OrdenPRE/1/2025, distinta de la redacción fiscal. No se aplica a2025 la reforma de abril2026. Para donativos/inversión, acogimiento, enfermedad, monoparental y economía social se recuperan publicaciones BOE de leyes2/2017,11/2018,5/2019 y11/2022. Se conserva reserva del facsímil autonómico pendiente, no de accesibilidad de su texto.

Asturias: originales2014, Ley4/2023 y Ley5/2025 ya conservados permiten levantar reservas sobre los textos que reproducen. Ley5/2025 art.39.1–17 está vigente el31/12/2025 por DF tercera; no basta leer el título «presupuestos2026». La nueva celiaquía es art.39.17, con cónyuge solo en conjunta y requisitos de diagnóstico/renta/reparto. Ley3/2025 entra el3/12/2025 y reforma escala y mínimos personales/familiares; no introduce celiaquía. Es contexto de cuota y mínimos, no sustituto de los artículos individuales de deducción.

Se recuperan también leyes asturianas3/2020 y6/2021 en publicación BOE para la cadena de formación cualificada. **Su cotejo integral de actividades y composición de apartados1–3 queda pendiente**, indicado como trabajo por terminar, no como imposibilidad de verificar. Permanecen adquisiciones de facsímiles autonómicos anteriores y remisiones específicas (Decreto83/2025, OrdenPRE/1/2025, mínimos estatales, MOVES, requisitos societarios). No se afirma ausencia exhaustiva de correcciones no investigadas. La auditoría histórica no está cerrada.

Las [siete nuevas fuentes](fuentes-complementarias.json) se conservan por hash en CAS externo; el manifiesto público excluye rutas y datos de transporte. Las [once citas complementarias](citas-complementarias.json) son fragmentos con localizadores y reextracción propia. Una fuente recuperada pendiente de cotejo completo no se presenta como aceptación favorable.

## Helper y consignación

Se reproducen independientemente los dos defectos, con fronteras y perfiles contrastantes en [casos.test.ts](casos.test.ts):

- Alquiler6.000, conjunta elegible: `min(6.000 ×10%,600)=600`; helper300. Individual con idénticas entradas representables:300. La API no recibe modalidad ni personas que deben cumplir edad/discapacidad/renta y pago.
- Nacimiento2025 de un hijo, dos progenitores que declaran individualmente:1.400/2=700 por progenitor; helper1.400. Dos hijos:1.400 por progenitor frente2.800 del helper. La API recibe unidades, no modalidad, titulares ni años de nacimiento/adopción. El caso no presupone la respuesta de todos los supuestos de progenitor único.

No basta subir el máximo genérico de alquiler a600: rompería individual. Arreglo mínimo compatible a coordinar después: contexto opcional explícito de modalidad y reparto, con comportamiento anterior documentado cuando falte; rama específica para esas dos deducciones, conservando claves/exports. Para una evaluación fiscal completa se necesitan además los hechos de elegibilidad descritos por código. Otra opción compatible con el uso visible es mantener el helper expresamente parcial y exigir importe externo; eso no corrige su resultado como calculador general.

`components/liquidacion-irpf.tsx` importa y consume `calcularDeduccionesConsignadas`. Esta ruta devuelve cero sin `:importe`, conserva700 o600 explícitos y requiere `:cumple`. Incluso conserva900 de alquiler si se consigna: acredita suma/contrato, no validación fiscal. No hay reproducción aquí de cuota anual incorrecta de la interfaz actual. La omisión de modalidad en el helper exportado es real aunque no esté consumido por esa ruta.

## Verificador y validación ejecutada

Se considera correcto el cambio acotado `original` → `original|reforma|correccion` como categorías de publicación primaria. No se renombra ninguna reforma. El rechazo de consolidado se conserva y la regresión se ejecutó. El filtro comprueba categoría, no pertinencia jurídica: los defectos anteriores pasan su estructura. No se reabren R01–R03.

Ejecuciones independientes:

- Reextracción del autor:48 registros,16 documentos,672 citas; ambos hashes y tamaño.
- Cuatro suites focalizadas:26 pruebas aprobadas, `maxWorkers=1`.
- Casos propios más esas suites:37 pruebas aprobadas (11 propias), `maxWorkers=1`. Una primera ejecución falló por comparar coma flotante nativa con igualdad exacta; se corrigió la aserción propia, sin atribuirlo a defecto fiscal ni modificar producto.
- Regresiones del contrato:39 aprobadas. Primer intento no llegó a ejecutar casos por faltar directorio externo de fixtures; repetido con entorno resuelto.
- Verificador central, modo parcial y CAS:48 recibidas, integridad comprobada; resto del censo pendiente, resultado candidato. Reextracción del complemento:48 códigos,23 documentos y11 citas nuevas.

Ruff del verificador propio pasa. No se ejecutaron build, suites legacy pesadas ni una nueva revisión de lint de producto: no hay edición de producto. El cierre exige corregir las atribuciones, la frontera de estudios y las reservas concretas pendientes; aceptar la eliminación de promesas genéricas no cierra esos trabajos.
