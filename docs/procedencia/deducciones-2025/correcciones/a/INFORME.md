# Rectificaciones y remisiones del lote A, ejercicio 2025

Se entregan 49 expedientes individuales: 17 de Andalucía, 19 de Aragón y 13 de Catalunya. La [cobertura](cobertura.json) enlaza magnitudes, condiciones, discriminantes, publicaciones regionales, remisiones y sección física del manual. Los [dictámenes](../../lotes/a/dictamenes.json) continúan como candidatos. La entrega no acepta una liquidación ni sustituye la revisión independiente del padre.

La base comprobada es `b95e56d6edc6c53ad68e41cd03e23ec85a6f073b`. `baseCommit` del paquete conserva la base original de auditoría `016ec72d9539ccd887202735960ce306bd2354e5`. Las pruebas y contraejemplos ejecutados describen esa base y estos cambios. No se atribuyen sus resultados al candidato posterior `c5c6988d`.

## Rectificaciones comprobadas

Las [nueve rectificaciones](rectificaciones.json) explicitan: alternativa VPO/menor de 35 años; sujetos habilitados, conjunta y pago individual del alquiler andaluz; convivencia mínima de 90 días en acogimiento; residencia del contribuyente aragonés en el año del evento y el anterior; autorización educativa y reparto de guardería; incompatibilidad catalana entre adopción y acogimiento; vías de habilitación y reparto del alquiler catalán; exclusión de quienes puedan acogerse al artículo 89.A RIRPF, aunque no hayan optado; y facturación de ángel inversor como requisito autónomo de constitución y ampliación.

Se conservan los ocho arreglos anteriores: orden de minoración de ayudas en las tres fichas aragonesas y desarrollo de las cinco fichas catalanas. Además se explicitan mantenimiento y excepciones de cooperativas, bases históricas de vivienda, documentación de donativos y sentido de la excepción de parentesco en dependencia. Se retira de víctimas de violencia machista la prohibición por vivienda importada del artículo 612-3: el artículo 612-11 reproducido no la establece.

El alquiler andaluz permanece en 1.200/1.500 euros. Ley 7/2024 DF quinta.2 fijó 900/1.000, pero Ley 8/2025 DF novena.1 lo sustituye y DF decimoctava.b da efectos desde 1/1/2025 a los apartados uno a cinco. También se acredita la supresión del límite de renta anterior del artículo 11. La residencia aragonesa se atribuye a 160-2.8 bajo 160-1; el pago bancario, a DA segunda añadida por Ley 17/2023 artículo 64.10. El artículo 110-1 regula la escala.

## Cadena y remisiones

Se incorporan originales regionales BOA de Ley 14/2014, Ley 2/2014 y Ley 2/2016, junto con Ley 13/2023 y Ley 17/2023 ya recuperadas. Las correcciones BOA 45/2013 y 91/2013 se cotejan con sus reproducciones BOE: afectan a 132-5 y tasas 32/64, y al alcance del artículo 30 sobre vivienda protegida, respectivamente; no modifican las deducciones IRPF examinadas. El original DOGC de Ley 8/2025 se recupera en reproducción oficial de la Generalitat y acredita DF tercera, con efectos desde 1/1/2025.

Vivienda se reconstruye desde originales: Ley 35/2006, RDL 20/2011 DF segunda para la redacción íntegra de 68.1, Ley 22/2009 para 78, y artículo 70. RD 439/2007 aporta ocupación, permanencia, adquisición, construcción y adecuación; RD 861/2008 modifica 55.5: reconstrucción por coste superior al 25%, adquisición en los dos años anteriores o valor de mercado, excluyendo suelo. Ley 16/2012 introduce DT 18 y RD 960/2013 conserva el reglamento histórico en DT 12. Las bases 9.040 y 12.080 son distintas; se representan reinversión, vivienda anterior, patrimonio y excepciones. No se impone el acceso al régimen transitorio estatal a toda deducción autonómica que remita a conceptos históricos.

Los objetos solicitados con fecha `31/12/2012` por la revisión muestran redacciones posteriores y no prueban la versión histórica. Se preservan en la revisión y el CAS; se excluyen del manifiesto activo de este lote. La reconstrucción utiliza los originales y reformas indicados.

Cooperativas exige cinco años de aportación y condiciones de 2.1/2.2, con reintegro e intereses por incumplimiento y excepciones expresas de reinversión y transmisión estatutaria. Investigación conserva el límite combinado estatal del 100%: donativo 100, deducción estatal 80 y cuota suficiente dejan como máximo 20 autonómicos. Se añaden originales de Ley 49/2002 y RD 1270/2003 para entidades y certificado de donación.

Los pasajes del manual se delimitan por el título propio y el siguiente del índice interno, con páginas físicas efectivamente contrastadas. Se incluyen tablas y condiciones antes omitidas. Se corrigen 22 referencias de página de las fichas para que apunten a los intervalos físicos contrastados; el censo histórico permanece en paginasFicha. Se inspeccionan visualmente las tablas de páginas 74 y 85. Las citas de índices, pies o comienzos del artículo siguiente se sustituyen por pasajes materiales. Las citas de las disposiciones modificadoras y de sus efectos tienen atribuciones separadas.

## Limitación externa y trabajo común

Para Orden VEH/192/2018 se localiza DOGC 7750, 19/11/2018, PDF 1712225. La ruta oficial `portaldogc` falla en negociación TLS; las rutas alternativas `dogc` y archivo `eadop` devuelven 404. La ficha enlazada por ATC devuelve navegación sin el texto de la orden. Falta recuperar sus bytes para cotejar artículos y anexo. La página oficial de ATC sí acredita modelo 993, presentación telemática y plazo del 1 al 20 de enero del año siguiente. Sus [metadatos auxiliares](fuentes-auxiliares.json) se separan del manifiesto normativo: el contrato no tiene categoría de información administrativa. No se falsea el tipo para superar su validación. Esta reserva afecta a las tres deducciones catalanas de donativos.

La reforma elimina la obligación de compatibilidad. Las [reglas para cálculo](reglas-para-calculo.json) especifican por código parámetros, hechos, condiciones, discriminantes y referencias de cada proposición. Son documentación para el propietario del contrato común, sin API regional ejecutable. El motor debe recibir hechos de residencia y fechas, titularidad y pagos, rentas por modalidad, reparto, calificación de entidades, mantenimiento y documentación; debe devolver el importe atribuible y la procedencia de sus parámetros. Un booleano global y un importe consignado no representan ese cálculo.

El propietario común debe integrar los evaluadores útiles del candidato `c5c6988d` en la ruta única y retirar su puente duplicado. No se añade otro cálculo, ni se conserva una firma por compatibilidad, ni se modifica el helper compartido desde este ámbito. Las descripciones existentes siguen siendo útiles y se corrigen en sus módulos; no se renombra una estructura sin una necesidad de integración. No se modifican contrato central ni UI. No hay borrados de código en esta entrega.

## Verificación y transporte

Las pruebas focalizadas comprueban las condiciones discriminantes y su ubicación en límites/requisitos, además del soporte original de efectos andaluces, vivienda histórica y excepciones de cooperativas. Se conservan rojos previos: doce fallos documentales iniciales, uno adicional para parentesco y otro para paginación. Se ejecutan las regresiones independientes anteriores sin editar su evidencia. Los resultados finales y el manifiesto de transporte se entregan exclusivamente en privado.

La reextracción comprueba SHA-256, SHA-512, tamaño y cada localizador. El verificador central valida estructura, cobertura e integridad de bytes; no certifica interpretación jurídica. La revisión nueva pendiente es la única revisión independiente del padre sobre estos cambios.

Resultado final: 75 pruebas focalizadas verdes, tipos focalizados sin errores y ESLint sin errores. Las regresiones independientes anteriores pasan. Se verifican 47 documentos y 4.078 citas por reextracción; el control central completo pasa con 351 registros e integridad de bytes comprobada. Estos controles no aceptan jurídicamente el lote.
