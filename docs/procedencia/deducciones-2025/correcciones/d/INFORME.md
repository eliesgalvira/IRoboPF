# Rectificación candidata del lote D

Se han ampliado las 63 fichas: 27 de Castilla-La Mancha, 17 de Castilla y León y 19 de Extremadura. Esta entrega **no culmina el cierre jurídico solicitado**: las descripciones y comparaciones se han recompuesto, pero el cotejo sustantivo de las remisiones y de parte de las cadenas enumeradas sigue pendiente. No se ha demostrado una limitación externa que impida realizarlo. No debe aceptarse este trabajo como lote jurídicamente completo.

## Cambios comprobados

- Se delimitan las 63 secciones del manual por encabezados y coordenadas, excluyendo los extremos correspondientes a otras deducciones. [Límites](limites-secciones.json). Se reconstruyen las comparaciones descriptivas y se amplían requisitos, límites, reparto y compatibilidades en las tres comunidades conservando sus códigos, campos, exportaciones, cuantías existentes y entradas. No se añaden fórmulas financieras.
- Se corrigen los cinco artículos extremeños: intereses de jóvenes, 11 quater; donaciones culturales y deportivas, 11 quinquies; traslado, 11 sexies; ayudas ELA, 11 septies; enfermos y familiares, 11 octies. Se incluyen los pasajes íntegros de esos artículos hasta el siguiente precepto o apartado modificador. Las citas activas de los artículos equivocados se retiran; permanecen en la base histórica.
- Ayudas ELA aplica tipos medios a la ayuda integrada en base liquidable, previa integración en base imponible general. Los 2.000 euros pertenecen al artículo 11 octies. Este último distingue al diagnosticado y al familiar, sus condiciones subjetivas y el reparto entre familiares. El campo de consignación no calcula estas cantidades.
- Cuidado de familiares con discapacidad conserva convivencia ininterrumpida durante al menos la mitad del período impositivo, discapacidad, renta del familiar, acreditación y reglas comunes. No hereda cuidado de hijos hasta 14 años. El discriminante de convivencia superior a 90 e inferior a 183 días que aparecía en la revisión tampoco se utiliza para esta ficha.
- Vivienda nueva CyL: Ley 1/2012 artículo 11 introduce DT quinta del TR2008; DF27.2 fija efectos desde 2012-01-01. La derogatoria única.3 del DL1/2013 la preserva. La corrección de 2012-03-16 afecta a la DT quinta de la propia Ley 1/2012, en otro impuesto. El 7,5% de base máxima 9.040 produce máximo aritmético 678; los cinco ejercicios se cuentan desde el primer pago, no desde el visado. Se conservan primera vivienda, localización, financiación, minoraciones y regularización.
- Ley 11/2019 CLM y su corrección recuperadas mediante el índice DOCM. Artículo decimotercero.Uno sustituye artículo 9.2 y 9.3. Subsiste el tramo rural del 20%, máximo 612, con población y distancia; artículo 9.3 fue sustituido después por Ley 1/2022 y artículo 9.1 por Ley 1/2026 para 2025. La corrección de 2019-12-30 afecta solo a DA4.1, empleo público.
- Convalidación del DL11/2020 recuperada en reproducción oficial BOE del DOE suplemento122. Tanto cabecera PDF como metadatos BOE indican **25-06-2020**, no 26-06-2020 como decía la revisión. Se enlaza con cuidado de hijos y su artículo 6.
- Resoluciones extremeñas: acuerdo de 21-11-2024, publicado 26-11-2024, no convalida DL2/2024; acuerdo de 27-02-2025, publicado 06-03-2025, convalida DL1/2025 y acuerda tramitarlo como proyecto. Ley1/2025 reproduce los preceptos IRPF y DF3 fija efectos desde 2025-01-01. La norma no convalidada no sirve como título vigente para 2025.

## Reserva de Castilla-La Mancha

Ambos códigos de intereses de primera vivienda y adquisición/rehabilitación rural enlazan la misma reserva: Ley1/2026 artículo18.8 introduce artículo13.3.g y DF6 da efectos2025 al artículo18; el aviso oficial de campaña excluye de2025 la incompatibilidad y el manual mantiene compatibilidad. Las fichas muestran ambas posiciones. El aviso no se trata como derogación ni se elige silenciosamente una solución.

Se conserva [el manifiesto complementario](../../lotes/d/fuentes-adicionales.json), con adquisición, hash y literal del aviso. La [propuesta de extensión](PROPUESTA-CONTRATO.md) permite representarlo sin inventar tipo normativo ni fecha. No se modifica el contrato central.

## Cobertura y trabajo pendiente

La [matriz individual](matriz-completado.json) contiene los 63 códigos, artículo, límites de sección, remisiones localizadas y campos que la consignación no verifica. Los requisitos incorporados proceden del manual; una coincidencia descriptiva no acredita por sí sola la redacción temporal de cada remisión legal. Los dictámenes actuales permanecen candidatos y no verificables en su alcance jurídico completo. Las diferencias históricas de páginas y sus discriminantes permanecen separadas mediante `momento`.

Queda por realizar, entre otros, el cotejo temporal de mínimos, unidad familiar y residencia de la Ley del IRPF; acreditación de discapacidad del Reglamento; requisitos materiales de familias numerosas, donativos y entidades beneficiarias; vivienda estatal a 31-12-2012, patrimonio, reinversión y regularización; clasificación territorial y censos; y el encadenamiento por apartados de las reformas CyL localizadas. La matriz identifica las referencias por código, pero su enumeración no significa que se hayan agotado. Estos pendientes son trabajo sin culminar, no fuentes declaradas irrecuperables. Las diferencias del cálculo compartido siguen fuera de este alcance.

## Verificación

La salida histórica de 78 controles conformes y siete rojos se conserva privadamente, sin editar la revisión. Los siete discriminantes documentales se corrigen en el paquete; no se cambian sus expectativas. Las pruebas focalizadas nuevas comprueban artículos, contaminación, tablas educativas, reserva común y correspondencia entre los campos exportados y sus comparaciones. El verificador central y la reextracción comprueban estructura e integridad, no aceptan la interpretación fiscal.

Las tablas educativas de páginas243–244 se inspeccionan visualmente: individual sin familia numerosa 6.500/100, 10.000/75, 12.500/50; conjunta 12.000/200, 20.000/100, 25.000/75. Familia numerosa: individual hasta30.000/150 y conjunta hasta40.000/300. La magnitud de renta resta el mínimo por descendientes. El límite se aplica globalmente multiplicado por hijos; después se minoran becas y ayudas, no se repite un límite por actividad.

Los originales, configuraciones, resultados de pruebas, patch y manifiesto SHA256 permanecen en la entrega privada. No se modifica la revisión, el helper, el contrato central ni la UI. La revisión independiente nueva corresponde al padre.

Resultado final de controles: **142 pruebas focalizadas conformes**; arnés de revisión conserva los **78 controles conformes**, y sus siete discriminantes documentales quedan corregidos sin editar sus expectativas. Reextracción: **44 documentos íntegros y 3.702 citas**. Verificador central completo: **351 recibidas, ninguna pendiente estructural, integridad comprobada**; su resultado jurídico sigue requiriendo revisión independiente. Tipos focalizados, ESLint y las 16 reglas de Oxlint pasan utilizando resolución externa de dependencias. Estas conformidades técnicas no cierran los pendientes jurídicos anteriores.
