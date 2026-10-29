# Contrarrevisión documental de mínimos

Revisión personal del 29 de octubre de 2026 sobre checkout compartido; base comunicada d9ff49c7. **Requiere cambios.** Los 33 IDs tienen decisión:32 aceptaciones acotadas y MIN-017 pendiente de evidencia jurídica. Accepted acepta la proposición delimitada, incluidos defectos y carencias; no significa que el motor cumpla esa regla. No se certifican un ejercicio, una declaración ni las 4788 cuantías candidatas.

Se leyeron BRIEF, AGENTS y los cuatro documentos obligatorios. Sin subdelegación, cambios de motor, inventario, hallazgos ajenos, ESTADO, DECISIONES ni operaciones VCS. Las huellas actuales están en huellas-motor.json. Se preservan resultados anteriores y no se reabre Madrid 2020 ni CG-01/02/03.

## Defectos reproducidos

**MIN-001, prioridad alta.** Descendientes 30 y10 sin discapacidad: TypeScript devuelve5100 €, frente a2400 por el único elegible. Un descendiente25 devuelve2400 en vez de cero. Control 24→2400; mayor 30 con discapacidad y menor 10→5100 antes del adicional de discapacidad. Ley 39/2010 p 62 y Ley 26/2014 p 27 exigen menor 25 salvo discapacidad. Filtrar después de ordenar sería insuficiente si conserva índices de inelegibles.

Objeción: podría haber preselección externa. Motivo del hallazgo: tipo y función no expresan esa precondición y ya reciben edad. Coste futuro: separar elegibilidad y orden, conservando discapacidad, fallecimiento y reparto.

**MIN-007.** Edades 64/65/66: contribuyente 5550/6700/6700; ascendiente 0/0/1150. Edades 74/75/76: contribuyente 6700/6700/8100; ascendiente 1150/1150/2550. Manuales AEAT 2014 p 447 y2025 p 1069 aclaran igual o superior 65/75 para incrementos del contribuyente, en una explicación sobre cónyuges en conjunta. La página oficial de ascendientes dice expresamente igual o superior 65. Se acepta bajo contrato de años cumplidos al devengo. Extender coherentemente75 al ascendiente es interpretación, no cita literal de esa página. Conjunta queda fuera.

Objeción: no sustituir mecánicamente todo «mayor» legal por un operador. Coste: fijar contrato de edad y probar cumpleaños exactos si la API recibe fechas.

**MIN-033, prioridad alta.** Se ejecutaron liquidaciones completas: Madrid y Aragón,2012/2013/2014, edad 40, sin familiares, trabajo, deducciones ni pagos; ganancia10000 adquirida2010 y transmitida en junio del ejercicio. BG 0 y BA 10000:1178,29 € frente a1018,29 € con remanente5151. Exceso160 € en seis casos. Las fechas descartan ganancia corta general en2013/2014.

Antes de2015 se grava la base del ahorro descontado el remanente; desde2015 se resta la cuota del remanente. Ley 39/2010 p 64, manual2014 p 467 y Ley 26/2014 pp 30–31/34 discriminan la operación. Controles BA 0/4000→0;2015 BA 10000→947,75. Una prueba dentro del primer tramo oculta el error. Coordinar con EEA-MINIMO-AHORRO-2012-14, sin duplicar fix.

**MIN-010, prioridad alta.** Madrid 2022 BG 0 BA 10000: motor882,27 €, separado903,88. Madrid 2025:848,24 frente886,87. Entradas y resultados completos guardados. Aplicar tarifa conjunta al máximo de remanentes traslada indebidamente la ventaja autonómica al Estado. Aragón controla mínimos iguales. En2015 los primeros tipos son9,5% estatal y10% autonómico: no dividir tarifa conjunta por dos.

Objeción: exactitud de esta operación no certifica toda cuantía o redondeo. Motivo: aislar defecto con bases observadas y cálculo Decimal independiente. Coste: quedan sin ejecutar BG entre mínimos, orden inverso de remanentes y matriz completa de bases. Coordinar con EEA-MINIMOS-DISTINTOS.

**API adicional.** obtenerMinimoContribuyente con año2012, edad 40 y tabla omitida devuelve5550. La liquidación anual sí suministra tabla. La prueba exige5151 según año pedido; se puede exigir tabla o seleccionar por año, pero no mantener un argumento engañoso.

## Condiciones familiares

MIN-002/003/004/005/006/009: faltan rentas fiscales, declaración, convivencia, dependencia, parentesco, duración, cotitulares, inscripción/modalidad de adopción y fallecimiento familiar. No se inyectaron campos extra fingiendo que el motor los evalúa.

casos-no-ejecutados.json contiene especificaciones:8000/8000,01;1800/1800,01; mitad del período; reparto; adopción en inscripción y dos ejercicios siguientes; fallecimiento antes/después2015. Se releyeron arts58–61 originales. Antes2015 la cuantía especial solo cubre descendiente fallecido; la reforma añade ascendiente y ajusta convivencia. No prorratear indiscriminadamente por días.

Objeción: campos ambiguos no resuelven el dominio. Renta fiscal no equivale a bruto y reparto no siempre es50%. Coste: definir hechos y requisitos versionados antes de implementar. No se certifican criterios TEAC de custodias: sus originales no se completaron aquí.

## Asturias y Catalunya

**MIN-017 needs-evidence.** Releídos Ley 3/2025 BOE pp 2/3/6, BOPA y LGT10.2 original BOE-A-2003-23186, hash1a8d517292c793d7ac41757a3f8a0fb7862b44550d623cfe2534895727ebafed. CadenaA se usa como índice, no evidencia. Sondeos02/03diciembre devuelven6105. DF: entrada3diciembre; preámbulo8: aplicación al ejercicio2025. LGT10.2 toma inicio del período como regla supletoria en tributos periódicos, no solo el devengo.

La objeción del preámbulo impide la conclusión categórica del candidato: no prueba retroactividad para todos los fallecidos, pero tampoco puede ignorarse al interpretar una norma diseñada para el ejercicio en curso. No queda acreditado5550 como esperado automático para todo fallecido anterior. Se buscó criterio oficial específico sin encontrarlo; una referencia de software de tercero no se elevó a fuente jurídica. Acción: criterio administrativo primario o documentación oficial discriminante. Coste: no autorizar todavía el fix temporal.

**MIN-018 accepted como defecto del contrato histórico.** STC186/2021 FJ3D p 13 protege las obligaciones devengadas a su amparo frente a revisión por esta nulidad y alude expresamente a2020. Canon5550 y sondeos12450/12450,01 no representan condición histórica6105. Separar obligaciones protegidas, sumaBG+BA y aplicación actual. No borrar retrospectivamente la norma ni aplicar6105 universalmente.

Objeción: el fallo no resuelve toda pretensión futura de rectificación. Coste: preservar versiones y explicar qué reconstruye cada resultado.

## Cuantías y cadenas

CLM 2014 DTsegunda: adicional 2356,20, no2244. Galicia 2022: efectos expresos del art 2 pese a BOE2023. Canarias: DFdécima p 142 da efectos1enero2024, importes pp 157–158 en reproducción oficial. La Rioja:3300/9900 solo discapacidad de descendientes, asistencia 3000 sin modificar.

Balears 1820 es derivado:5550+1820=6105+1265. Sustituir solo1820 por1265 rompe el total. Ley 11/2023 art 1 y DFúnica p 19 distinguen entrada de retroactividad de otros artículos. Valencia 2022 y Balears 2023 tienen sondeos UTC a mediodía; fecha civil con offset sigue pendiente.

Cantabria 2014 pp 27–28 acredita importes, pero imprime «superior al65%» para discapacidad. MIN-024 acepta cifras, no frontera exacta65 ni continuidad. Preservar esta objeción nueva.

Se añadió compilación oficial Hacienda2013, SHA256 dd7a45ded1c188e7a10613cdb69845caad077735814c515741ab6ca354b91674. P91:5151,918,1122 y descendientes1836/2040/3672/4182, con notas de Ley 39/2010. Corroboración histórica junto a promulgación original; no se trasladó2025 atrás. Manuales2012/2013 y continuidad de todos los territorios siguen pendientes.

270 consultas al motor; 4.788 hojas numéricas2012–2025. El contraste nuevo de16 variantes, transcrito separadamente desde los pasajes normativos, compara304 componentes numéricos y coincide en304; véase cuantias-contraste.json. No se hereda la transcripción de tablas del autor. No aceptación jurídica independiente de las 4788 hojas. Los 32 accepted no son porcentaje de cobertura.2026 no certificado;17 territorios reales rechazados, simulada-estatal supuesto. Forales y conjunta fuera.

## Integridad y reproducción

40 originales del autor pasan SHA256, SHA512 y tamaño calculados personalmente. Nueva adquisición con manifiesto saneado y hash verificado. citas-refinadas.json contiene3944 bloques independientes con página física desde1, cajas PDF y texto reextraído. No equivalen a3944 reglas revisadas. comprobacion-citas-candidatas.json separa contraste técnico e interpretación. HTML: selectores de texto sin geometría inventada.

No se validaron PAdES, CSV, sellado, conservación externa ni facsímiles visuales de todas las citas. La primera extracción se detuvo por coste y se repitió reutilizando TextPage; entrega de segunda pasada terminada. El verificador también se reinició para reutilizar el documento abierto entre páginas, manteniendo un único documento activo.

pruebas-rojas.json:44 comprobaciones,14 fallos esperados y30 controles correctos. TypeScript real ejecutado mediante Bun, sin modificar cálculo. contraste-independiente.json:36 liquidaciones,8 discrepancias y28 coincidencias. Recetas conservadas como .txt con hashes; copiar a scratch para ejecutar desde raíz:

- nix shell nixpkgs#bun -c bun .cache/procedencia/revision-minimos/pruebas-rojas.mjs — salida1 esperada.
- nix shell nixpkgs#python3 -c python .cache/procedencia/revision-minimos/contraste.py.
- Extraer/verificar con Nix Python/uv/pymupdf y biblioteca C++; recetas en scratch.

Se consultaron effect-solutions list/show basics/testing y fuente v4 antes de Effect.runSync. Un proceso, memoria comprobada; sin build, suites legacy, instalaciones globales ni reconstrucción del inventario. No hay TypeScript mantenido nuevo ni aplicación modificada: no se presenta lint/typecheck global como ejecutado. Las recetas scratch están excluidas del recorrido global por política existente. Se comprobaron explícitamente Ruff (11 recetas Python), ESLint y anti-slop (tres recetas mjs; copias idénticas en ruta docs autorizada para evitar exclusión de caché). Sin reglas desactivadas. La sintaxis también pasa. Promoverlas como TypeScript mantenido requiere tipos y revisión.

El integrador debe reproducir fallos y corregir solo alcances aceptados. Se completa el registro de33 decisiones; no se cierra la auditoría fiscal exhaustiva.

Control 2015 ampliado: releído RDL 9/2015, BOE-A-2015-7765 pp 9–10, DA 31 letrasc/e; hash y extracciones en fuentes-complementarias.json. RDL 20/2011 p 53 acredita recargo2/4/6% en2012–2013 sobre ahorro tras remanente. La receta Decimal queda limitada a las bases ensayadas, no es sustituto del motor.

Objeción adicional de Catalunya: la STC p 1 menciona6150 en antecedentes, mientras su FJ1 p 8 transcribe el art 88 con6105 y umbral12450. Se conserva la discrepancia documental: para cuantía y condición se utiliza el precepto transcrito en FJ1, y para protección temporal el FJ3D p 13. No aceptar una cifra solo porque aparezca en una cita oficial.

Cierre técnico:13.555 citas PDF candidatas contrastadas independientemente;10.751 exactas tras normalizar espacios y2.804 contenidas íntegramente con contexto adicional; ninguna sin localizar. Las67 candidatas HTML no se cotejan exhaustivamente; se refinan únicamente los pasajes HTML utilizados. Todos los JSON parsean y las huellas de fuentes revisadas siguen iguales al cierre.
