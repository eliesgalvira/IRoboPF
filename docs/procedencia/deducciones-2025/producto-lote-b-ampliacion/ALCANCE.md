# Ampliación de Asturias y Cantabria2025 por hechos

Este candidato añade ramas para los37 códigos pendientes del primer módulo:34 generan cuantía racional directamente y3 representan una dependencia de magnitudes anuales. Incluye el resolutor de las tres fórmulas anuales. El candidato fue validado después bajo PESADO2:81 pruebas Vitest y controles focales de tipos estrictos/Effect,Oxlint/anti-slop y ESLint correctos. No se presentan como37 deducciones cerradas en producción ni como acreditación fiscal completa. La matriz conserva los48 códigos y distingue las ramas nuevas de los9 previos y2 contratos auxiliares existentes.

La primera entrega permanece intacta. Los imports de implementación previa apuntan a `../asturias-cantabria-hechos-2025/comun` y su territorio, integrados en raíz. No importan carpetas de Backups ni requieren mantener la entrega anterior. La ampliación sólo crea `asturias-cantabria-ampliacion-2025`, sus tests y esta documentación; no modifica dispatcher, anual, archivos comunes, inventarios ni los módulos corregidos. La prueba de conservación importa la API canónica integrada y fija RBM01:6000 comunes entre dos titulares al30% generan900 por persona, con máximo personal después del reparto. No copia la fórmula forestal.

## Contrato y precisión

`evaluarAmpliacionB2025(marco, hechos)` recibe `MarcoB` y la unión discriminada `HechosAmpliacionB`. Reutiliza ámbito, fechas y error tipado del módulo integrado. La frontera de API debe decodificar el objeto antes de llamar: no se introduce un parser JSON ni un campo genérico cumple. Los hechos identifican personas, progenitores, parentesco y titulares exhaustivos, fechas/intervalos, rentas con y sin exentas, declaración del familiar, pagos, documentos, entidades, activos, participaciones temporales y usos incompatibles. Las colecciones marcadas completas se entienden exhaustivas para su solicitud, incluidos ceros reales: omitir hechos no equivale a declarar que no existen.

El resultado diferencia:

- `calculo_parcial`: cuantía racional previa a aplicación común de cuota; `coberturaHechos` distingue rama completa de rama acotada y `pendientes` concreta lo que falta. Rama completa significa que se calcularon las condiciones representadas, nunca autenticidad o aceptación fiscal.
- `dependencia_anual`: fórmula legal fija y referencias de magnitudes anuales; no se elige fórmula desde fuera ni se introduce una deducción ya calculada.
- `excluida`: condición normativa incumplida.
- `no_soportado`: contradicción, dato concreto ausente o rama acotada que no permite escoger una cuantía. No incluye importe cero.

La moneda entra como cadenas decimales no negativas de hasta18 dígitos enteros y dos decimales; bases negativas requieren ampliación de contrato y se rechazan sin exclusión fiscal inventada. Los tipos medios anuales admiten hasta8 decimales. El módulo no transforma importes en Number ni redondea a céntimos para calcular. Usa un clon local Decimal de precisión200 para operar sobre numeradores y denominadores enteros reducidos. Antes de operar acota los operandos y rechaza un racional que exceda80 dígitos normalizados, en vez de aceptar un redondeo silencioso. Las fechas y contadores usan aritmética civil ordinaria. La presentación es posterior y separada.

## Cobertura material

Familia contiene13 códigos: adopción internacional, partos/adopciones múltiples, familias numerosas y monoparentales asturianas, centros0–3, libros/material, cuidado hasta25/26, fallecimiento laboral del otro progenitor, celiaquía, cuidado cántabro de familiares, acogimiento y dos guarderías. No cuenta dos veces una misma persona por edad y discapacidad. Acogimiento cántabro calcula máximo simultáneo por intervalos inclusivos, no número de eventos anual. La guardería cántabra reparte por gastos justificados de cada progenitor; no impone mitades. Las ayudas asturianas de centros0–3 y las becas de libros minoran la deducción después del máximo, no la base porcentual.

Vivienda contiene7 códigos: discapacidad, alquiler asturiano, adquisición de determinados colectivos, gastos de alquiler sostenible y tres códigos cántabros de alquiler rural, obras y viviendas vacías. El alquiler asturiano comprueba edad, título numeroso, monoparentalidad material o documento de violencia, además de municipio y base. La adquisición ordinaria fuera de zona rural mantiene250000 de valor; en zona rural distingue5%/10%. En discapacidad, renta del familiar incluye exentas, convivencia>183 y grado>=65; el máximo de base se reparte para ascendiente/descendiente de igual grado cercano. Los casos de futura ocupación requieren compromiso identificado y plazo ordinario12meses, y se devuelven condicionados a ocupación efectiva; no se afirma que ya haya ocurrido. Precio sostenible requiere referencia autonómica o SERPAVI concreta de vivienda, municipio y2025; no basta repetir la etiqueta.

Trabajo y movilidad contienen12 códigos: segundo/sucesivos hijos, autónomos rurales, transporte, formación cualificada, traslado asturiano, vehículos eléctricos, emancipación, ELA, traslado laboral rural cántabro, residencia rural, ayuda doméstica y desplazamiento de nuevos residentes. Formación conserva gastos históricos durante la formación y exige incorporación dentro de tres años, una sola aplicación y grupo1/actividad material. Software exige informe favorable; empresa innovadora representa las alternativas auditadas de evaluación externa, costes de I+D y EIC/CASSINI/ISEP/espacio/defensa, con fechas. No basta autodenominarse innovadora. La compra de vehículo permite la ventana2022–2025 y gasto2025, deriva categorías de ficha técnica y descuenta ayudas; no exige recibir MOVES. El traslado rural cántabro no hereda los cuatro años de ausencia de otros traslados. La compensación por nuevos residentes excluye consumo de suministros y adquisición de vivienda. Ayuda doméstica identifica una única persona empleada, empleadores TGSS y reparto acordado; no crea una deducción por cada empleador.

Inversión contiene5 códigos: sociedades nuevas asturianas/cántabras, donativos, economía social y nuevos residentes extranjeros. La participación familiar se calcula por intervalos, sumando capital y votos según tercer/segundo grado;40 es admisible y40,01 no. PYME agrega propia, asociadas y vinculadas; los balances temporales distinguen actividad y patrimonio, con exclusiones materiales identificadas. No se importan a Asturias las prohibiciones cántabras de dirección o empleo. Economía social calcula las tres modalidades antes del máximo común3000 y evita duplicidad de operación/pago. Donativos reduce la disponibilidad del10% de base liquidable por las bases estatales68.3 y68.5, conserva orden de la colección y no lo optimiza. Los inmuebles de nuevos residentes extranjeros deben no destinarse a vivienda/turismo; no se inventa afectación empresarial obligatoria. Se distinguen inversión del año previo en valores españoles, pagos de precio/gastos frente a intereses y reinversión total en un mes.

## Magnitudes y régimen posterior

`resolverDependenciaAnualB` calcula sólo las tres reglas específicas:

| Rama | Magnitudes identificadas | Fórmula |
| --- | --- | --- |
| ELA asturiana | Ayuda integrada en base liquidable; tipos medios estatal/autonómico de igual liquidación/persona/2025 | Ayuda por suma de tipos medios dividida por100 |
| Residencia rural cántabra | Cuota íntegra autonómica por cada contribuyente menor40 residente rural todo el año | min(20% de esa cuota,500) por persona |
| Traslado laboral rural cántabro | Cuota íntegra autonómica procedente de trabajo/actividad por beneficiario | min(500,esa cuota) por persona |

La ausencia de magnitud no produce cero. Se rechazan magnitudes duplicadas, ajenas o mezcladas entre liquidaciones. El resolutor no consume la cuota disponible ni duplica su aplicación: el padre conserva una sola composición anual.

`regimenPosterior` describe el origen2025, prioridad y clases de arrastre. Obras cántabras devuelve exceso calculado sobre el límite anual, derivado de pagos, para dos ejercicios; no inventa arrastre por insuficiencia de cuota. Desplazamiento de nuevos residentes conserva prioridad primera y arrastre cuatro por insuficiencia. Inversión desde extranjero conserva cinco por insuficiencia. La aplicación compartida, saldos históricos y orden se conectan después; no se admiten importes de deducción externos como hechos para reproducirlos. Los mantenimientos futuros de residencia, alta, participación y empleo quedan como condiciones concretas, no como datos ficticios ya observados.

## Límites de rama pendientes

La matriz enumera los pendientes por código. Destacan el criterio de cómputo del mes partido cuando se cumplen3 o26 años en día distinto de1, la composición de colectivos personales mixtos en conjunta, los requisitos de actividades ajenas/destinatarios/remuneración de asociaciones de Ley49/2002 y la correspondencia de fines análogos no tipificados de fundaciones. No se requiere acreditar semánticamente todo el expediente para ejecutar las demás ramas. Una referencia documental identifica un hecho aportado, no prueba automáticamente autenticidad ni derecho. La residencia autonómica aportada sigue sujeta a las reglas generales del art.72; este módulo no sustituye el cómputo anual de puntos de conexión.

Las reservas previas no se reabren: edad asturiana exactamente30 sigue sólo en el evaluador integrado; estudios cántabros mantiene <8000; BC01 separa representativa del manual de asistencial y conserva patria transitoria. La ampliación no los reimplementa ni altera la corrección forestal.

## Estado de validación

Se preparan37 casos base de fuentes, pruebas adversas y de dependencias anuales, y una regresión del módulo previo. `oraculos-37.json` conserva operaciones racionales independientes de las constantes del módulo. El control Python verifica su aritmética, cobertura37/48, concejos53, imports y transporte; no ejecuta las implementaciones TypeScript. La fase ligera quedó conservada como antecedente. Tras asignación explícita de PESADO2 se ejecutaron81 pruebas Vitest con un worker,tipos estrictos/Effect,Oxlint/anti-slop y ESLint focales. No se ejecutaron inventario ni CI global.

Para repetir privadamente con turno pesado, los harness en validacion/ resuelven dependencias fijadas de raíz y el módulo integrado desde raíz, con un worker, sin instalar ni copiar paquetes. Tras integración se pueden usar las rutas canónicas de tests. No hay dependencia operativa de carpetas privadas anteriores, ni de originales CAS. La recepción y revisión del cambio material corresponden al padre.

La validación de autor reprodujo y corrigió cuatro fallos de identidad/cronología/magnitudes; véase VALIDACION-AUTOR.md. Los37 oráculos originales se conservaron byte por byte.
