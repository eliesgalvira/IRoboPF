# Candidato por hechos del lote A: primer sublote catalán

Se añaden seis códigos catalanes con evaluación específica por hechos, todos de alcance parcial individual ordinario 2025. La matriz49 enumera exactamente los otros 43 códigos pendientes de esta entrega y conserva la existencia del evaluador andaluz y de aritmética genérica anterior. No declara errores monetarios nuevos ni modifica evaluadores previos. Los discriminantes contrastan la nueva implementación con reglas revisadas, sin presentar un diagnóstico del código previo.

El módulo es puro y separado; el discriminante propio se propone para futura integración. No cambia tipos ni contratos comunes, dispatcher, liquidación, catálogo o UI. No debe agregarse su resultado a una liquidación como cuota ya aplicada. La aprobación del contrato de conexión corresponde al propietario común.

Importes de entrada: céntimos enteros seguros no negativos. Operaciones: constructor local Decimal de 80 cifras, sin cambiar configuración global. Se conserva importeExactoEuros; importePresentadoCentimos es exclusivamente presentación HALF_UP. No hay prueba de una política oficial especial de redondeo en estos códigos y no se importa ninguna valenciana. La integración debe conservar el exacto hasta la etapa monetaria pertinente.

Los tres donativos consolidan los pagos del mismo código antes del límite del 10%/5% de cuota íntegra autonómica. Investigación limita también la deducción por cada donativo al remanente después de la deducción estatal del mismo donativo. Modelo993 requiere fecha 1–20 enero 2026, ejercicio2025, vía telemática y referencia aportada. Presentaciones fuera del régimen ordinario se rechazan con motivo, sin presumir pérdida definitiva del derecho. Se reutiliza VEH/192/2018 ya conservada en a-ampliado; no se afirma que falte descargarla.

Nacimiento individual ordinario concede 150 por persona, incluso con un solo titular: no se divide una supuesta cuantía300 por un número genérico de titulares. Monoparental requiere título específico y genera300. Acogimiento exige acuerdo Ley14/2010 y minoría de edad en el evento. Eventos repetidos de la misma persona se rechazan para resolver incompatibilidad adopción/acogimiento, sin sumarlos. La fecha admite el año2025 completo por los efectos expresos de DL5/2025. No se infieren modalidades conjuntas.

Viudedad conserva la ventana año del fallecimiento y dos siguientes; los300 no se multiplican por descendiente. El incremento sólo se calcula en la rama inequívoca donde un mismo descendiente mantiene el derecho todos los años. Cada descendiente aporta historial y referencia al resultado/documento de derechos al mínimo; no basta número de hijos ni un cumple global. Cambios de descendientes o interrupciones con mínimo actual se rechazan con motivo. No reimplementa el motor del mínimo ni acredita ese derecho.

Intereses exige préstamo identificado, prestatario, concesión, canal AGAUR, estudios máster/doctorado y pagos identificados como intereses. Canal distinto u otros estudios no generan importe. No admite principal ni identidad de pago repetida entre préstamos. La calificación documental de intereses queda aportada externamente.

Las referencias documentales son afirmaciones específicas externas, no documentos automáticamente autenticados. Todos los resultados monetarios son calculo_parcial, aceptacionFiscal pendiente. No existen puertas generales nuevas. Las ramas fuera de alcance se rechazan; jamás se presentan como un impuesto cero. Las listas vacías expresas sí permiten importe cero en ausencia de hechos.

Validación de entrega: suite focal propia con 64 pruebas verdes y maxWorkers=1; tipos estrictos con el plugin Effect del proyecto; Oxlint con las reglas propias y un hilo; ESLint sin errores ni advertencias de código. ESLint emitió avisos de entorno por ausencia de aplicación React/pages en la carpeta de entrega. Los controles Python verifican cobertura49, citas conservadas, hashes y reconstrucción exacta del parche. Todos los comandos usaron timeout exterior con kill de30s y se ejecutaron secuencialmente en el turno PESADO1 autorizado. No se ejecutaron inventario, CI global ni suites ajenas.

El esquema territorial se exporta junto con su tipo derivado. La función acepta ese contrato y lo decodifica de nuevo al ejecutarse, rechazando campos sobrantes incluso en objetos anidados; las llamadas JS malformadas producen no_soportado. La validación civil usa calendario gregoriano explícito, probado en años bisiestos y siglos. No construye fechas globales ni introduce servicios o cálculos paralelos. Las guías Effect y su fuente local se consultaron antes de introducir Schema. Las pruebas negativas simulan llamadas JS mediante una única aserción justificada; la implementación no necesita aserciones de tipos.


Corrección CAT-01 del integrador: la adopción exige `antecedenteAcogimiento`,
con persona, contribuyente, estado y soporte del expediente. Sólo se calcula
esta rama cuando se declara específicamente ausencia de acogimiento previo
para esos sujetos; desconocido, omisión o identidades ajenas se rechazan. Un
acogimiento previo impide generar una segunda deducción: la solicitud se rechaza
con ese motivo y se separa esa rama del resto. No se confunde el antecedente
con haber practicado una deducción en el año anterior. Las referencias siguen
siendo declaradas, no autenticadas por el módulo. La revisión independiente
reprodujo dos rojos y veinte controles verdes, más64del autor. Los resultados
de comprobación posterior del integrador se registran por separado.
