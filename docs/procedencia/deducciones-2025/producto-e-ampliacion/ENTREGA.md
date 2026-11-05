# Galicia y La Rioja · ampliación de hechos2025

Candidato corregido y validado por el autor en PESADO2: añade38 códigos a las diez ramas revisadas y a celiaquía reutilizable de raíz. Contiene funciones fiscales concretas y38 oráculos numéricos, no sustituye el expediente por `cumple` o por un importe de deducción consignado. La matriz49 distingue las38 altas de las once capacidades anteriores, que conservan su alcance. No cierra el punto4 ni certifica derechos particulares.

Los archivos nuevos están en `lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025`. `index.ts` solo despacha dentro de esta ampliación: no cambia el dispatcher del producto, la anual, las cuotas, la API revisada ni archivos compartidos existentes. Las funciones trabajan por titular. En modalidad conjunta, la salida sigue siendo una atribución a ese titular con magnitudes de la declaración conjunta, no su total ni cuota aplicada. La composición de varias atribuciones debe compartir una única reserva de base/cupo anual; no se suman llamadas que reutilicen el mismo saldo.

## Expedientes y magnitudes

`Contexto.expediente` exige `completo_todos_pagadores`. Cada pago conserva identidad de pagador/receptor, fecha, factura/concepto, importe, subvención, especie exenta y medio. Las ramas de gasto común agregan todos los pagadores antes de repartir base/límite. Cuidados puede calcular un expediente de A+B sin eliminar los pagos de B. Las inversiones identifican al titular económico y rechazan pagos inconsistentes; patrimonio histórico limita explícitamente su entrada a pagos del titular. Ninguna lista incompleta se transforma en impuesto cero.

La primera API `galicia-rioja-hechos-2025` permanece intacta: solo admite pagos propios en sus diez ramas. Su revisión favorable acotada no acredita el gasto común de A+B. La ampliación no reexporta esas funciones ni las importa desde una carpeta privada. Sus rutas operativas anteriores están en raíz y no dependen de las carpetas de entregas que se retiren.

`MagnitudAnual` identifica clave fiscal, euros, ejercicio, declarantes exhaustivos y nodo de derivación. Una magnitud ausente se rechaza con su nombre; no se finge que sea cero ni se exige una conexión anual ya terminada. Las definiciones se enumeran en `MAGNITUDES-ANUALES.md`. Las ayudas identifican además porcentajes racionales de tipo medio estatal y autonómico y, por resolución, la parte de ayuda atribuida a base liquidable mediante su nodo anual. Se aplican esos tipos medios sobre esa parte, sin inventar una tasa marginal ni deducir sobre lo concedido íntegro.

Los documentos y los hechos de mínimos, parentesco, homologación, diagnóstico, perímetro y titularidad quedan pendientes de acreditación externa. Los seguimientos de empleo, actividad, domicilio, arriendo y mantenimiento conservan sus plazos futuros; una previsión documentada no certifica que ya se hayan cumplido. No se reabre la auditoría jurídica favorable ni F general. En incendios se conserva la cadena RDL10/2026 y convalidación, efectos26/8/2025, siniestros23/6–25/8 y acuerdo estatal; no todas las ayudas gallegas son exentas.

## Precisión y límites

La entrada monetaria usa cadenas con hasta dos decimales y32 caracteres. Un Decimal local con precisión80 convierte a céntimos; toda la aritmética posterior es racional exacta de enteros normalizados. La salida `exacto` expresa numerador de céntimos y denominador. La presentación se redondea a céntimos mediante enteros antes del formato Decimal: ni las divisiones periódicas ni la presentación alimentan otras reglas.500/3 euros conserva50000/3 céntimos y se presenta166.67. Un céntimo al15% conserva3/20 de céntimo aunque se presente0.00.

Se distinguen topes personales y compartidos. Renovables atribuye el coste según propiedad y después limita280 por sujeto pasivo. Eficiencia limita base9000 por sujeto pasivo después de atribuir coste; certificado150 se pondera por propiedad y se conserva un techo único. Alquiler reparte base y límite por contrato. Adecuación de vacío limita base3000 por vivienda antes de la atribución de propiedad, con techo6000 para concurrentes y9000 total por vivienda. MAB limita la cohorte de generación a4000 antes de repartir sus cuatro anualidades. Los casos preparados discriminan estas operaciones.

Los saldos de adecuación identifican inmueble, tipo base, origen, caducidad e importe racional. Los históricos conservan caducidad y se consumen antes de la base nueva; no se renuevan por pasar a2025. El remanente de cuota no se fabrica con el saldo de base: requiere aplicación anual. Viviendas vacías conserva la condición de arrendamiento y eventual remanente4años; actividad agraria riojana pide aplicación última y eventual arrastre3años. La matriz concreta estas obligaciones por código.

## Alcance que sigue abierto

Cada fila nueva de la matriz tiene función, archivo, citas y condición o magnitud concreta. La aritmética de la rama declarada está implementada, con184 pruebas focales correctas y tipos estrictos/Effect,Oxlint/anti-slop y ESLint correctos;no equivale a revisión independiente. Entre las ramas deliberadamente rechazadas están titulares asimétricos de cuidado gallego bajo un máximo común, cumplimiento18 durante acogimiento riojano y acumulación de acogimientos cortos que supera90 sin estancia individual>90. Esta última necesita fijar la atribución de cuantía en la regla especial32.4; no se le inventa cero ni150/300. Los incrementos de inversión por innovación se modelan en capital, sin extender por analogía el incremento a préstamos/garantías. La valoración de un depósito cultural exige el informe particular competente.

La vivienda histórica recibe fechas de inversión/pagos/fin, ocupación, permanencia, excepciones y comparación patrimonial, no una bandera genérica de derecho estatal. Comprar antes2013 no habilita obras de adecuación nuevas de2025. Las bases regionales compartidas9040 se calculan con magnitudes nominadas de base estatal sin adecuación y consumos de las otras modalidades. AnexoI y anexoII siguen separados para2025. Centros históricos compara centro, municipio, instrumento y fecha de la tabla auditada más el certificado particular de perímetro.

## Validación focal realizada

Pasan184 tests Vitest4.1.5 con maxWorkers1, tipos estrictos TypeScript5.9.3 con diagnósticos EffectLS0.85.1 activos y cero diagnósticos, Oxlint1.78.0 con12 archivos/16 reglas/un hilo y cero diagnósticos, y ESLint9.39.4 con12 archivos/cero errores o avisos. Se conservaron29 rojos adversos y dos diagnósticos iniciales de fixtures. Los38 esperados monetarios iniciales no cambian: ahora se comprueba también su racional exacto. El [reporte de validación](VALIDACION-P2.md) identifica discriminantes,correcciones y fundamento primario.

Las pruebas y nuevos contratos distinguen participación propia/familiar,ejercicio de deducción previa y saldo de financiación del vehículo. La cobertura hipotecaria se declara como importe del expediente común y se atribuye después de restarla de los intereses;no puede excederlos. Para arriendos,`hasta` es límite exclusivo del intervalo contractual: los plazos y cadenas deben normalizarse así antes de evaluar. El calendario de convivencia cuenta extremos inclusivos.

Las magnitudes anuales se validan para toda la declaración, incluso si una rama no utiliza alguna: una magnitud ajena o duplicada no es parte de ese contexto. Un centro/situación desconocido o una cadena pendiente no se convierte en exclusión fiscal conocida. Los pagos de terceros sin atribución económica identificada se rechazan con ese motivo; no se eliminan de la lista para simular exhaustividad.

PESADO2 liberado;sin suites o procesos de validación pendientes. Solo se ejecutaron controles focales autorizados;no inventario ni CI global. Las herramientas se resuelven desde dependencias fijadas de raíz, sin instalaciones. Todos los arneses y scripts dependientes del manifiesto permanecen privados,fuera del parche.

El parche añade módulo,pruebas y documentos. Sin cambios de raíz, VCS mutante, worktree, subdelegación, entornos ni cachés en la entrega. No se escribió código Effect. Los originales CAS no se incorporan: `citas.json` referencia por código/cita el índice auditado,documento/hash y localizador. La primera carpeta privada ya retirada no es dependencia operativa. Las magnitudes y reservas concretas de la matriz siguen pendientes de composición o acreditación particular;la validación no cierra el punto4.

## Rectificación posterior a revisión

Véase [CORRECCIONES-REVISION.md](CORRECCIONES-REVISION.md). El oráculo M1 de150se rectifica a0 por suspensión; la afirmación anterior de conservación de38esperados describe la recepción previa. En el candidato corregido se conservan37, el original de M1 y las pruebas rojas. Esta corrección todavía requiere contraste P1 e integración.
