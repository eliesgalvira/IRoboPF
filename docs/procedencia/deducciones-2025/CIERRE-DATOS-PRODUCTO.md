# Datos de producto · deducciones 2025

Corte de composición: 4 de noviembre de 2026. Se integran doce propuestas documentales revisadas: nueve bloques del catálogo valenciano y tres filas de la matriz normativa. Se mantienen las cuarenta fichas valencianas en `normalizada_pendiente_tests`, sus cuantías, límites y páginas del manual. Doce propuestas no equivalen a doce fórmulas ni acreditan 351 deducciones calculadas. Este cierre documental no cierra todo el punto 4 ni la automatización valenciana.

| Propuestas | Campos compuestos | Alcance |
| --- | --- | --- |
| j, w, DA13 | `requisitos`, `entradaNecesaria` del catálogo | Referencia autonómica y superficie construida CaLab; obra actual frente a ejecución 2014/2015; versiones técnicas y pagos. |
| q.1, q.2, q.3 | `requisitos`, `entradaNecesaria` del catálogo | Bien efectivamente inventariado, donatarios restringidos en q.1/q.2; q.3 sustituye las entradas de donación por titularidad, intervención, facturas, ejecución y pago propios. |
| r, s, x | `requisitos`, `entradaNecesaria` del catálogo | Cinco grupos de lengua; beneficiario e interés social separados, comunicación sin denegación en vía legal; abono cubierto y adhesión eficaz sin certificado de donatario. |
| z, DANA vivienda, DANA aportaciones | `remisionesContrastadas`, `remisionesYReserva`, `pendienteConcreto` de [matriz vigente](correcciones/g/matriz-completada.json) | EECV por requisitos materiales del art. 21, sin acto autonómico inventado ni ENISA solo; corte 30 de diciembre; territorio fiscal propio y acreditación particular. Estas tres propuestas tienen preimagen de matriz, no de catálogo. |

Se reutilizan las propuestas de [vivienda](correcciones/g-vivienda/propuestas.json), [inversión/DANA](correcciones/g-inversion-dana/propuestas.json) y [cultura/lengua](correcciones/g-cultura-lengua/propuestas-por-codigo.json). Sus preimágenes se comprobaron antes de editar. Los dictámenes de [vivienda/inversión](revisiones/g-vivienda-inversion/INFORME.md), [localizador gv-31](revisiones/g-localizador/INFORME.md), [cultura/lengua](revisiones/g-cultura-lengua/INFORME.md) y [contraste documental posterior](revisiones/remisiones-documentales/INFORME.md) delimitan el criterio aplicado. Se conservan sus evidencias y las 111 rectificaciones históricas, incluidas comparaciones `momento: antes`; sus reservas históricas se interpretan conforme a estos contrastes posteriores. No se reescriben aquellos informes como actuales.

El fundamento de abonos es Ley 13/1997 art. 4.Uno.x y DA16. Se preservan las correcciones de gv-31, gl-71 y gl-78. q.3 no exige certificado 4.Tres ni declaración de interés social; las ayudas vinculadas se identifican sin inventar descuentos genéricos. Para s, comunicación y ausencia de denegación acompañan la consideración legal; el cambio procedimental de diciembre no se anticipa al resto del año.

## Reservas por rama

Las doce reservas acotadas de la investigación permanecen diferenciadas. Ninguna se convierte en bloqueo universal ni en importe cero:

| Rama | Reserva conservada |
| --- | --- |
| Asturias · gastos vitales | Edad exactamente 30: solapamiento de tramos normativos frente al manual; no escoger tramo automáticamente. |
| Cantabria · traslado por estudios | Renta exactamente 8.000: se conserva el acceso legal estricto `<8000`. |
| CLM · dos deducciones de vivienda | Solo concurrencia arts. 12/12ter frente al aviso de campaña; no cerrar por analogía favorable. |
| CyL · patrimonio natural | Alternativa legal autorización **o** informe frente al resumen acumulativo del manual. |
| CyL · emprendimiento | Inversión directa con sede externa: no importar el domicilio obligatorio de la inversión indirecta. |
| CyL · rehabilitación subvencionada | Programa exclusivamente autonómico: no excluir la alternativa legal por resumen restrictivo. |
| Extremadura · vivienda rural | Adquisición/rehabilitación de 1 de enero a 21 de marzo de 2022, art. 11bis.1.b. |
| Murcia · vehículos eléctricos | Base imponible exactamente 35.000, distinta del precio del vehículo: conservar solapamiento normativo. |
| Murcia · vivienda joven | Comparación patrimonial particular pendiente. |
| Murcia · ahorro de agua | Remisión legal defectuosa: no cerrar mediante analogía silenciosa. |
| Valenciana j | Falta la celda/versión histórica aplicable a la vivienda en 2025; la metodología general de superficie construida está resuelta. No indexar por IPC/IRAV ni sustituir por SERPAVI. |
| Valenciana r · solo grupo 5 | Falta prueba administrativa positiva de funcionamiento/inscripción eficaz en 2025. No afirmar inexistencia del censo; grupos 1–4 conservan sus requisitos propios. |

Los dictámenes que sustentan las diez reservas ajenas a Valencia son [b-condiciones](revisiones/b-condiciones/INFORME.md), [CLM](revisiones/d-clm-remisiones/INFORME.md), [CyL](revisiones/d-cyl-remisiones/INFORME.md), [Extremadura](revisiones/d-extremadura-remisiones/INFORME.md) y [Murcia](revisiones/f-ampliado/INFORME.md). Aquí no se cambian esos datos.

Además, x necesita prueba de convenio/adhesión y prórroga vigente particular: el convenio inicial de Olympia no acredita 2025. En DANA la cadena territorial está contrastada: Loriguilla solo núcleo junto a A3 y València solo pedanías sur; ampliaciones de ayudas 163/164 no amplían por sí el ámbito fiscal. Restan ubicación, daño y gastos del caso; para aportaciones, ambos domicilios, situación de preexistentes a 29 de octubre de 2024 y ERTE. En z está resuelta la remisión general con interpretación motivada del art. 21: restan vigencia, domicilios, tecnología y porcentaje de personal del caso, separados de PYME innovadora y emergente estatal. No se cierran expedientes particulares por añadir texto.

## Comprobación y límite de cálculo

Las pruebas focales `tests/deducciones-valencianas-datos-producto.test.ts` fijan expectativas por campo y contradicción, con un corte previo reducido para conservar códigos, cuantías, límites, manual y estados. El integrador ejecutó las diez pruebas junto con las cuatro de la guardia: catorce correctas, y tipos correctos. El autor documental sólo ejecutó controles acotados de preimágenes y conservación. La [revisión independiente de la composición](revisiones/producto-20261104/INFORME.txt) es favorable acotada; conserva los doce dictámenes previos sin repetir la investigación jurídica.

La consignación de un importe externo, la evaluación parcial y el rechazo explícito de automatización no soportada siguen siendo contratos distintos. Esta entrega no modifica auxiliares, motor ni API, ni certifica cuotas. La corrección del auxiliar y los nueve auxiliares recibieron revisión independiente favorable en el alcance examinado: 333 aserciones propias, sin error monetario nuevo reproducido. No certifica todos sus supuestos ni cierra la automatización valenciana.
