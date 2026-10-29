# Contrarrevisión independiente del fragmento R32

Revisor en T3 Code mediante Codex: runtime gpt-6.1-sol, esfuerzo high. Prioridad solicitada; no hay recibo independiente de prioridad. Sin subdelegación, fixes de producto ni atestación. HEAD fa64e05ccb9b52f1fe3495ee9e24b5459c439cc2. Las conclusiones son candidatas y requieren contraste posterior del padre. No se acepta fiscalidad ni se cierra el encargo global.

## Dictamen

No aceptar conjuntamente los doce booleanos valueClosed/selectionClosed del candidato. La relación escalar de retenciones soportadas queda corroborada técnicamente en su alcance condicionado. Los otros cinco sitios necesitan completar el transporte por propiedad; no se ha demostrado un defecto fiscal. SiteClosed=false, anual-publico-r32 pendiente e inyección arbitraria abierta son límites correctos y se conservan.

| Sitio | Valor | Selección | Motivo concreto |
|---|---|---|---|
| anual.retencion.base | Cierre no acreditado | Cierre no acreditado | A.subcaso compuesto; semillas CERO y lectura de flags/defaults sin frontera explícita por propiedad |
| anual.retencion.cuota | Cierre no acreditado | Cierre no acreditado | Hereda base; falta transporte de filas/celdas y selección de tramo por argumento de cada llamada |
| anual.retencion.tipo | Cierre no acreditado | Cierre no acreditado | Hereda cuota; contrato/territorio/vivienda quedan vinculados al subcaso compuesto |
| anual.retencion.anual | Cierre no acreditado | Cierre no acreditado | Hereda tipo y CIEN sin referencia a su declaración literal |
| anual.pagos.retenciones | Corroborado condicionado | Corroborado condicionado | Campo anual directo, /100 y sitio exacto; sin productor estimado ni selección interna adicional |
| anual.pagos.cuenta | Cierre no acreditado | Cierre no acreditado | Suma y conversión correctas; el productor estimado hereda las obligaciones abiertas |

«No acreditado» rechaza el cierre declarado en el contrato de continuación; no afirma que las operaciones numéricas sean incorrectas. El sitio de soportadas se condiciona a entradas anuales admitidas, sin validar aquí su admisión. La ausencia de una rama local no acredita todas las guardas previas del anual.

## Evidencia leída y método

Leídos íntegros BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, CONTINUACION R32, informe/contraste/recepción del padre, informe/decisiones/hallazgos/comandos del autor, módulo, schema y tests. Consultada la situación actual R33/R32 de ESTADO y las decisiones vigentes, en particular D073/D085/D090/D094/D097. El BRIEF histórico queda subordinado a la corrección urgente del usuario. No se consultan checkouts ni resultados de otros hijos activos.

Leídos cuerpos reales de retenciones, catálogo, tablas y política monetaria, y los recorridos anuales de capas, llamada, retorno y seis crearLineaCalculo. La unidad final viene de crearLineaCalculo: origen.decimal conserva importe.toFixed(), sin volver a multiplicar el porcentaje. Este helper no pertenece a las seis fuentes del fragmento: se comprobó en esta base, y el compositor debe conservar también esa obligación de frontera.

Cotejo inicial completado antes de crear instrumentos: 16.909 entradas, lstat/readlink, bytes exactos y ejecutabilidad frente a blobs Git, uno cada vez; cero cambios/borrados y diff vacío. El scratch inicial solo recibió el control del propio cotejo. El final repite el mismo recorrido. Git se usó exclusivamente en lecturas; jj no está inicializado en el worktree y no se inicializó. rg llegó mediante Nix al constatar su ausencia del shell.

## Qué falta realmente en el transporte

A.subcaso es terminal, con property=retencionTrabajoAeat y source en la declaración condicional anual. El grafo conoce el objeto completo; no exporta una frontera explícita para cada propiedad pública ni defaults. R.R/R.C y las referencias de importeOpcional permiten verificar manualmente algunas lecturas. No sería correcto afirmar que todas están ausentes: los argumentos exactos están conservados. El problema es dar por resueltas también las selecciones y valores restantes sin identificar sus correspondencias por propiedad.

Ejemplo discriminante: mantener el salario anual fijo y cambiar solo retencionTrabajoAeat.retribucionAnualCentimos cambia el estimador y pagos.cuenta. Cambiar retencionesSoportadasCentimos no cambia pagos.cuenta; cambiar pagosACuentaCentimos no cambia soportadas, incluso con cifras idénticas. Los casos propios lo comprueban. En cambio, para movilidadGeografica, movilidadReducidaPerceptor, discapacidad, edad por defecto, contrato, familia y convivencia, el consumidor debe volver a interpretar cuerpos TS/Match para reconstruir la ficha por propiedad. Los callbacks conservan parámetros, cuerpo y semilla como rangos; eso es inventario preciso, no una correspondencia ya resuelta de cada lectura, acumulador y salida.

Las semillas apuntan al identificador CERO. La declaración const CERO=new Decimal(0) queda fuera de los contratos seleccionados y de los puertos. CIEN presenta el mismo límite para la anualización. Son constantes sencillas comprobadas en el código: no son errores fiscales ni una incógnita matemática. Sin embargo, conservar un uso del identificador sin su terminal literal contradice el cierre hasta entradas/constantes exigido. No es necesario añadir un compilador general: bastan referencias finitas a esas declaraciones y bindings explícitos para los campos consumidos.

R.escala describe una función y depende únicamente de R.version. El cuerpo está anclado y contiene los seis tramos, pero no hay puertos/referencias de celda para desde/cuota/tipo ni relación de selección desde el argumento propio hacia esas celdas. La fórmula en prosa tampoco enumera las cuotas y tipos intermedios. El listado de calls conserva correctamente **cinco ocurrencias sintácticas**: remanente, alimentos, mínimo+1980, base ordinaria y mínimo ordinario. Son tres evaluaciones en la rama de alimentos y dos en la ordinaria. Se refuta la objeción de que no haya argumentos: sí están, con formal y returnedBy; falta instanciar el resultado y selección por propiedad/celda, no inventariar otra vez las llamadas.

contracts.resolved=true se asigna incondicionalmente después de reconocer nombres de llamadas y métodos permitidos. No se demuestra resolución de todos los identificadores/propiedades, capturas o constantes. close recorre las aristas ya redactadas y detecta ciclos/puertos inexistentes; no verifica que el cuerpo no contenga otra dependencia. Sus booleanos no deben interpretarse como certificación de exhaustividad causal. Las fórmulas y rangos son útiles y permiten contrastes humanos, pero no suplen estos enlaces ausentes para la ficha por propiedad solicitada.

Los cuatro rojos de contraste.json son diagnósticos conservados de esta representación (CERO, CIEN, celdas y frontera compuesta). Los predicados buscan la representación explícita actual; por sí solos no prueban que toda alternativa contractual deba tener los mismos nombres o puertos. La conclusión se apoya también en la lectura completa y los casos discriminantes. Una corrección puede usar otro contrato finito que transporte las mismas correspondencias; no se exige reproducir esos predicados literalmente.

## Contraste de contratos aritméticos y selección

| Contrato | Correspondencia contrastada | Reserva |
|---|---|---|
| Instancia de servicio | LiquidacionIrpfAnual.layer proporciona RetencionTrabajoAeat.layer; Layer.succeed enlaza Impl; argumentos reales subcaso y contexto | Inyección arbitraria abierta; no se infiere implementación por interfaz |
| Base | R/I1/I2/C en céntimos→EUR; neto=max(0,R−I1−I2−C); gastos=min(2000+movilidad+discapacidad,R−C), saturación; reducción por versión; compensatoria y laborales | Frontera de campos/semillas incompleta, no salario/SS anual implícitos |
| Reducción | Antigua3700/11250/1.15625; nueva5565/13115/1.5; media2018; 2023:6498/14047.5/1.14; actual7302 hasta14852, pendiente1.75 hasta17673.52,2364.34−1.14 hasta19747.5; HALF_UP2 | La prosa de R.reduccion abrevia constantes; cuerpo presente, sin fichas explícitas de todos los literales |
| Familia | Filtro canónico edad<25 o discapacidad, antes del conteo; legacy conserva array; copia y sort descendente por edad; índices2400/2700/4000/4500; entero1/medio0.5; menor3/adopción2800 | Semillas y lecturas por propiedad necesitan transporte, no cambio fiscal |
| Ascendientes/discapacidad | 1150 con edad>=65 o discapacidad y1400 si>=75, /convivencia; discapacidad3000/9000 y asistencia3000; redondeo por suma de cada grupo | Divisor válido es guarda local; no prueba elegibilidad material familiar |
| Perceptor | Edad por defecto40,5550 más1150 desde65 o2550 desde75; movilidad/discapacidad propias separadas de familiares | No heredar familia del anual |
| Escala | desde0/12450/20200/35200/60000/300000; cuotas0/2365.5/4225.5/8725.5/17901.5/125901.5; tipos.19/.24/.30/.37/.45/.47; reverse/find mayor desde<=x | resto no se consume; celdas y selección por instancia no transportadas |
| Histórico | Versión definida año<=2020 y x>=60000:17901.5+(x−60000)*.45 | Legacy undefined llega a47%; no equivalencia por año aparente |
| Alimentos | Solo0<A<base: E(base−A)+E(A)−E(minimo+1980), saturado; otro E(base)−E(minimo) | Tres versus dos llamadas, cada una con su x |
| Umbral/exento | Tabla por año/ventana/situación; fila familiar y columna de cardinalidad; máximo de9 celdas quitando null; laborales pensionista/desempleado ajustan ambos; exento exige los dos <= | Celdas de umbral sí tienen puertos; mapa anual de tablas solo indirecto en cuerpos, no equivalente a selección exportada por versión |
| Límite43/cuota | Exento o R>techo devuelve cuotaInicial; techo22000 si año<2023 o reducción2019; otro35200; restante max(0,(R−umbral)*.43); cuota=min(inicial,límite) | Guardas estrictas ensayadas; sin conclusión jurídica |
| Tipo | Ceuta exige dos flags, cuota*.5 en2017/enero2018 u*.4 después; vivienda flag y R<33007.2, truncado2 de R*.02; diferencia saturada; R<=0→0; otro ROUND_DOWN2(diferencia/R*100) | Cuota retornada no recibe reducción territorial |
| Contratos/importe | Mínimo15/2 fuera de Ceuta,8/1 Ceuta antes2019,6/.8 después/undefined; max con calculado. Importe HALF_UP2(R*tipo/100) | Mínimo puede subsistir a cuota cero; no igualar cuota e importe |
| Retornos/pagos | Base/cuota/importe: aCentimos y /100 anual; tipo string2→Decimal sin factor100; soportadas directo, cuenta=declarado+estimación en céntimos antes de /100 | Ausencia solo pone estimación0 y omite cuatro sitios; error aborta anual |

Los 31 casos propios incluyen integración racional independiente de anchuras/tipos en fronteras±un céntimo, histórico45%, alimentos0/interior/igual base/exterior, orden y edad3/25/65/75, convivencia y redondeo por grupo, umbral/tabla julio2018, años/fechas no admitidos, techos22000/35200, vivienda y truncado, productores separados y ausencia/cero/éxito/error. Los esperados no se obtienen del motor ensayado. Las expectativas fiscales oficiales no forman parte de estos casos técnicos.

## Consumidor, schema y entorno

La reconstrucción importando composeRetencionesR32 produce exactamente los bytes recibidos y verifyRetencionesR32 acepta el original. Nunca se invoca generateRetencionesR32 ni su CLI: el gzip histórico permanece intacto. El verificador rechaza un sitio duplicado y un sobre con contratos/puertos/aristas vacíos. El schema aislado admite ambos: no exige unicidad por siteId ni mínimos de esas colecciones, y deja calls/collections/instances/errors como objetos abiertos. Esto no es un bypass de verify: la igualdad exacta con la receta es una validación adicional real. El schema fuerza los booleanos a true y no permite expresar el estado pendiente de esta revisión; revisar esa decisión antes de la composición.

El ancla no procede del JSON suministrado: lee seis blobs de la base Git846f25e y compara bytes antes del AST. Funciona en este entorno, con ese objeto y esas fuentes disponibles. La carga de TypeScript usa createRequire absoluto a /home/elies/Repos/IRoboPF/package.json. Para CI/publicación hacen falta resolver la dependencia local del paquete, preservar el objeto ancla o un paquete de fuentes equivalente y documentar versiones. No se presenta una restricción local explícita como vulnerabilidad ni se atribuyen efectos a rutas públicas no conectadas. El módulo/compositor todavía necesita validar compatibilidad de puertos, dirección, unidad y campos por propiedad antes de ensamblar anual-publico-r32; disponer de role/source/instance no produce esas correspondencias automáticamente.

El título fijo «Algoritmo de retenciones 2026» del paso anual también aparece en2020. Es detalle editorial preexistente, fuera de este fix y sin efecto numérico; el fragmento no lo corrige. No se confunde con selección de la versión efectiva.

## Cambios necesarios, sin ejecutarlos

- scripts/procedencia/flujo-retenciones-r32.mjs: exportar los campos/defaults públicos consumidos, referencias de constantes/semillas, bindings de acumuladores y resultados por propiedad; celdas de escala y selección por cada argumento, mapa tabla/versión; enlazar contratos con puertos concretos. Derivar cierre de obligaciones satisfechas o mantenerlo abierto. Preservar inyección/admisión pendientes.
- schemas/procedencia/flujo/retenciones-r32.schema.json: permitir estados abiertos y precisar los objetos de contratos; definir unicidad/cobertura en el consumidor (JSON Schema solo uniqueItems no basta para unicidad por ID). Mantener separado el verificador exacto de la suficiencia semántica.
- tests/flujo-retenciones-r32.test.ts: añadir controles discriminantes de los enlaces nuevos, no solo existencia de puertos o booleanos. Conservar los 46 esperados históricos. Añadir fronteras y orígenes coincidentes como los casos de esta revisión.
- Compositor futuro: exigir obligaciones de campo/celda/instancia, unidad y condición más admisión común antes de cualquier siteClosed/wiring. No se inspeccionó ninguna implementación parcial de otros hijos.

No se modificó ninguno de esos archivos. Los siete rojos históricos son capacidad nueva contra un esqueleto, no errores del antiguo motor. Los ocho mutantes que rechaza el pin son integridad, no semántica. Los rojos propios permanecen sin arreglo ni cambio de esperados. No hay hallazgo fiscal: tal afirmación necesitaría evidencia oficial y revisión adicional.

## Decisiones, objeciones y costes

D1: corroborar solo el cierre escalar de soportadas y rechazar como no acreditados los otros cinco. Objeción experta: una receta manual finita puede ser correcta sin un compilador universal. Respuesta: se corroboran fórmulas y bindings que sí existen; se exigen únicamente las correspondencias omitidas de propiedades, constantes y celdas necesarias para las fichas. Coste: nueva edición y contraste del padre, sin publicar el candidato.

D2: separar aritmética, transporte, schema e integridad. Objeción experta: pruebas verdes podrían ocultar omisiones, y schema permisivo podría alarmar sin bypass. Respuesta: controles separados, rojos conservados y rechazo efectivo del verificador documentado. Coste: los31 casos no certifican exhaustividad ni fiscalidad y el consumidor exacto sigue dependiendo de su receta.

D3: usar copia scratch del TS real exportando helpers privados solo para ensayo. Objeción experta: una copia podría alterar el comportamiento. Respuesta: diff de adaptación conserva únicamente rutas de importación y exportación de nombres; pruebas públicas y46 originales también se ejecutan. Coste: entorno de ensayo explícito, sin convertirlo en módulo de producto ni revisar trabajo propio como independiente.

D4: no adquirir originales nuevos ni modificar preservación. Objeción experta: faltaría base para cualquier juicio fiscal. Respuesta: no se formula ninguno; alcance técnico y referencias recibidas preservadas. Coste: autenticidad, elegibilidad y aceptación jurídica siguen pendientes. Inventario30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7,44 snapshots y confianza activa permanecen intactos por cotejo físico. V5 r2 conserva corteR26 y pin2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88 sin reexportar; Crossa v1 sigue desfasado, local fuera de Victus, mismo dueño/casa, sin custodia independiente.

Sin VCS mutante, main, PR, deploy, servidor, preview, rediseño, LFS, gasto, transferencia, mensajes externos, borrados ni cambios de registros/confianza. No hay originales nuevos que incorporar a CAS propio; no se duplican PDFs ni dependencias en docs. Entrega reproducible por manifiesto y transporte, con instrumentos como texto y ensayos solo en scratch.
