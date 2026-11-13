# Consultas para expertos fiscales

Corte del 13 de noviembre de 2026, contrastado con `19072260`. Las doce entradas de discrepancias incluyen tres supuestos de Castilla y León; las tres dudas finales carecen de dos fuentes enfrentadas. Se registran preguntas pendientes, sin dictamen fiscal ni cambio de fórmulas. Los enlaces de código indican la línea en ese corte. Los expedientes enlazados conservan originales, hashes y localizadores de las fuentes.

## Discrepancias de 2025

### 1. F-N01 · Murcia · vehículos eléctricos

Código: `murcia_vehiculos_electricos`. Ejercicio: 2025. Territorio: Región de Murcia.

- Lectura legal: Ley 3/2025, art. 55, modificación de la deducción por vehículos, original BORM de 24/07/2025, página física 50. El 30 % alcanza una base que no supera 35.000 euros y el 22,5 % empieza en una base igual o superior. Hay solapamiento.
- Lectura administrativa: el Manual AEAT 2025, página 471, asigna el 22,5 % en esa frontera. Citas legales `murcia_vehiculos_electricos-regla-46-p50` y `-47-p50` en los [dictámenes y citas F](deducciones-2025/lotes/f/dictamenes.json), contrastadas en la [revisión F-N01](deducciones-2025/revisiones/f-ampliado/INFORME.md).
- Código actual: [vivienda.ts:164](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/vivienda.ts#L164) rechaza la base imponible general más ahorro individual de exactamente 35.000 euros. La reserva no afecta a todos los vehículos ni al precio de compra.

Pregunta exacta: ¿Con una base individual de exactamente 35.000 € se aplica el 30 % o el 22,5 %?

### 2. F-N02 · Murcia · vivienda joven y remisión transitoria

Códigos: `murcia_vivienda_jovenes_hasta_40` y rama `Uno_vigente` de `murcia_regimen_transitorio_inversion_vivienda_habitual`. Ejercicio: 2025. Territorio: Región de Murcia.

- Lectura literal: el apartado Uno.8 compara patrimonio final con final. La reforma original Ley 14/2013, página física 5, cita `murcia_vivienda_jovenes_hasta_40-regla-24-p5`, conserva esa expresión. La ficha AEAT 2025 también la reproduce.
- Lectura de aumento: la guía ATRM actualizada a junio de 2026, página física 10, exige aumento patrimonial. Su página 3 declara que su contenido no es vinculante. El art. 70 LIRPF histórico compara comienzo y final; no enmienda por sí solo la norma autonómica. Las [citas y fuentes oficiales](deducciones-2025/inventario-20261112/fuentes-consulta.json) separan `fn02-aeat2025-final-final`, `fn02-atrm-aumento` y `fn02-atrm-no-vinculante`.
- Código actual: [vivienda.ts:690](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/vivienda.ts#L690) conserva vivienda joven sin importe; [línea 711](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/vivienda.ts#L711) reserva la rama transitoria que remite a Uno vigente. La rama estatal pre-2013 del régimen transitorio sí tiene cálculo dentro de su perfil.

Pregunta exacta: ¿Se compara el patrimonio final con el final, o el inicial con el final exigiendo un aumento?

### 3. F-N03 · Murcia · dispositivos de ahorro de agua

Código: `murcia_dispositivos_ahorro_agua`. Ejercicio: 2025. Territorio: Región de Murcia.

- Lectura literal: Cuatro.3 remite a Uno.5 para definir vivienda habitual, pero Uno.5 trata de rehabilitación. Uno.4 es el que define habitualidad. Cita `murcia_dispositivos_ahorro_agua-regla-9-p7` en los [dictámenes y citas F](deducciones-2025/lotes/f/dictamenes.json), original murciano, página física 7.
- Lectura operativa administrativa: AEAT aplica el requisito de vivienda habitual a la instalación de dispositivos. La [revisión F-N03](deducciones-2025/revisiones/f-ampliado/INFORME.md) conserva la remisión defectuosa y distingue ambos apartados.
- Código actual: [recarga-agua.ts:127](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/recarga-agua.ts#L127) calcula el 20 % con base máxima de 300 euros en el perfil de habitualidad y reconocimiento regional representado. La [línea 163](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/recarga-agua.ts#L163) devuelve expresamente la reserva F-N03. No declara corregida la ley.

Pregunta exacta: ¿Hacen falta obras de rehabilitación o basta con que sea vivienda habitual?

### 4. F-RECARGA · Murcia · porcentaje y ayudas MOVES

Código: `murcia_recarga_vehiculos_electricos`. Ejercicio: 2025. Territorio: Región de Murcia.

- Lectura legal: la reforma de Ley 3/2025 no expresa un porcentaje de deducción y contiene una minoración general por ayudas. El Programa 2 del anexo I del RD 266/2021 delimita costes elegibles de infraestructura, sin ser un porcentaje de deducción regional.
- Lectura administrativa: AEAT 2025 fija el 100 %, base máxima de 4.000 euros y excepción para ayudas del Programa 2. Citas `f-aeat2025-recarga-cuantia`, `f-aeat2025-recarga-base-ayudas`, `f-aeat2025-recarga-ayudas-programa2` y `f-aeat2025-recarga-limite` en las [fuentes y localizadores AEAT](deducciones-2025/producto-f-ampliacion-20261105/fuentes-criterios-aeat-2025.json), con el [expediente de remisiones MOVES](deducciones-2025/correcciones/f/INFORME.md).
- Código actual: [recarga-agua.ts:78](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/recarga-agua.ts#L78) rechaza ayudas positivas; [línea 102](../../lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/recarga-agua.ts#L102) limita la base a 4.000 y aplica el criterio AEAT del 100 % en la rama sin ayudas, con sus demás requisitos.

Pregunta exacta: ¿Vale el 100 % con un límite de 4.000 €, y cómo se descuentan las ayudas MOVES?

### 5. R30 · Asturias · gastos vitales

Código: `asturias_gastos_vitales_hasta_35`. Ejercicio: 2025. Territorio: Principado de Asturias.

- Lectura legal: Ley 8/2024, art. 39.Seis, apartado 14 sexdecies.2, página física 22, imprime 26–30 y 30–35. Los 30 años pertenecen a dos tramos con máximos distintos.
- Lectura administrativa: el Manual AEAT usa 31–35 en el último tramo. La [revisión R30](deducciones-2025/revisiones/b-condiciones/INFORME.md) y la [comprobación de condiciones](deducciones-2025/correcciones/b-condiciones/INFORME.md) conservan la ambigüedad sin atribuirle una corrección oficial.
- Código actual: [index.ts:314](../../lib/dominio/irpf/deducciones/asturias-cantabria-hechos-2025/index.ts#L314) rechaza exactamente los 30 años; conserva los otros tramos.

Pregunta exacta: A los 30 años exactos, ¿el tope es 1.500 € o 1.000 €?

### 6. CLM-12-12TER · Castilla-La Mancha · compatibilidad de vivienda

Códigos: `clm_intereses_primera_vivienda_menores_40` y `clm_adquisicion_rehabilitacion_vivienda_zonas_rurales`. Ejercicio: 2025. Territorio: Castilla-La Mancha.

- Lectura legal: Ley 1/2026, art. 18.8, introduce incompatibilidad entre los arts. 12 y 12 ter; su DF6 le da efectos en 2025.
- Lectura administrativa: el aviso oficial de campaña deja esa incompatibilidad fuera de 2025 y el manual mantiene la compatibilidad. El [expediente por remisiones](deducciones-2025/correcciones/d-clm-remisiones/INFORME.md) y sus [citas](deducciones-2025/correcciones/d-clm-remisiones/citas.json) conservan las dos lecturas y las páginas 265–266 y 270–273.
- Código actual: [castilla-la-mancha-hechos-2025.ts:1208](../../lib/dominio/irpf/deducciones/castilla-la-mancha-hechos-2025.ts#L1208) rechaza la concurrencia declarada de 12 y 12 ter. Las ramas sin concurrencia no quedan bloqueadas por esta reserva.

Pregunta exacta: ¿Son compatibles en 2025?

### 7. CYL-7.2, CYL-8.1 y CYL-9.b · Castilla y León

Ejercicio: 2025. Territorio: Castilla y León. Fuente legal común: Decreto Legislativo 1/2013 en su redacción aplicable. Las [citas por precepto](deducciones-2025/correcciones/d-cyl-remisiones/citas.json) conservan el texto normativo y el Manual AEAT 2025.

- `cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad`, CYL-7.2. La ley admite planes estatales o autonómicos. El propio manual también lo dice en M3 y M22, pero M12 restringe las actuaciones a Planes Estatales, página 299. La discrepancia está en esa condición, no en todo el manual. [castilla-y-leon-hechos-2025.ts:728](../../lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025.ts#L728) rechaza el programa exclusivamente autonómico.
- `cyl_fomento_emprendimiento`, CYL-8.1. El art. 8.1 no impone domicilio regional a la inversión directa; el requisito aparece en la vía indirecta del art. 8.4. El manual lo extiende en M15, página 306. [castilla-y-leon-hechos-2025.ts:803](../../lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025.ts#L803) rechaza inversión directa con sede externa, conservando las otras ramas.
- `cyl_recuperacion_patrimonio_historico_cultural_natural`, CYL-9.b. El art. 9.b admite autorización o informe favorable para patrimonio natural; M7, página 308, los acumula. [castilla-y-leon-hechos-2025.ts:848](../../lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025.ts#L848) rechaza la rama natural con solo uno de esos actos. La rama con ambos puede calcular.

Pregunta exacta para cada código: En cada una, ¿manda la ley o el manual?

### 8. EXT-11BIS · Extremadura · fecha de adquisición rural

Código: `extremadura_vivienda_zonas_rurales`. Ejercicio de deducción: 2025; adquisiciones controvertidas de 2022. Territorio: Extremadura.

- Lectura literal: art. 11 bis.1.b, introducido por [Ley 3/2022](https://www.boe.es/buscar/doc.php?id=BOE-A-2022-5853), exige adquisición desde su entrada en vigor, 22/03/2022.
- Lectura por efectos: DF5 da efectos desde 01/01/2022; el manual admite enero. El [expediente de remisiones](deducciones-2025/correcciones/d-extremadura-remisiones/INFORME.md) conserva la frontera y el ejemplo de 15/02/2022, sin resolverla mediante retroactividad supuesta.
- Código actual: [extremadura-hechos-2025.ts:1051](../../lib/dominio/irpf/deducciones/extremadura-hechos-2025.ts#L1051) rechaza las operaciones entre 01/01 y 21/03/2022; la rama representada comienza en 22/03/2022.

Pregunta exacta: ¿Cuentan las compras del 1/1 al 21/3/2022?

### 9. BC01 · Cantabria · curatela representativa

Código: `cantabria_familias_monoparentales`. Ejercicio: 2025. Territorio: Cantabria.

- Lectura literal: el artículo autonómico conserva incapacitación judicial y patria potestad prorrogada o rehabilitada.
- Lectura administrativa: Manual AEAT 2025, página física 220, extiende las referencias a incapacitación a la curatela representativa por resolución judicial tras Ley 8/2021. Citas `rbc-manual-3` y `rbc-manual-4` en [citas complementarias](deducciones-2025/revisiones/b-condiciones/citas-complementarias.json), con [rectificación BC01](deducciones-2025/correcciones/b-rectificaciones/INFORME.md). Es una extensión administrativa documentada, pendiente de consulta, no dos reglas necesariamente irreconciliables.
- Código actual: [index.ts:596](../../lib/dominio/irpf/deducciones/asturias-cantabria-hechos-2025/index.ts#L596) admite la curatela representativa con las condiciones representadas y deja constancia del criterio del manual en la línea 631. La curatela asistencial no basta.

Pregunta exacta: ¿Es correcto extenderla a la curatela representativa?

### 10. CV-CALAB · Comunitat Valenciana · referencia de alquiler

Código: `valenciana_arrendador_renta_precio_referencia`. Ejercicio: 2025. Territorio: Comunitat Valenciana.

- Lectura del metadato oficial: superficie útil; el conjunto `spaicv0801_viviendas_precio_alquiler_tablas` identifica precios de 2018, no una tabla anual de 2025.
- Lectura metodológica CaLab: superficie construida catastral de uso vivienda, excluidos comunes, garajes y otros usos. La remisión AEAT al visor no autentica por sí sola cada versión histórica. El [dictamen de versión y superficie](deducciones-2025/correcciones/g-vivienda/DICTAMEN.md), las [fuentes](deducciones-2025/correcciones/g-vivienda/fuentes.json) y las [citas](deducciones-2025/correcciones/g-vivienda/citas.json) conservan la cadena oficial.
- Código actual: [gastos.ts:18](../../lib/dominio/irpf/deducciones/valenciana-2025/gastos.ts#L18) exige evidencia `celdaCaLabVersion2025` y recibe `precioReferenciaHistorico`; no reconstruye automáticamente una referencia de 2025.

Pregunta exacta: ¿Qué superficie y qué versión de la tabla valen para 2025?

## Discrepancias históricas

### 11. MADRID-LIMITE · Madrid · escala de 2019–2021

Código documental: `AUT1721-MADRID-2020-LIMITE`. Ejercicios: 2019–2021, con discrepancia observada en el manual de 2020. Territorio: Comunidad de Madrid.

- Lectura legal: [Ley 6/2018, BOCM de 28/12/2018](https://www.bocm.es/boletin/CM_Orden_BOCM/2018/12/28/BOCM-20181228-1.PDF), artículo único.Dos, página física 4, fija 53.407,20 euros como límite inferior del último tramo.
- Lectura administrativa: Manual AEAT 2020, página física 894, imprime 53.407,29. La [comprobación nominal](correcciones/madrid-nominal-r29/INFORME.md) y la [revisión de las dos tablas](revisiones/madrid-v2-r27-sol/INFORME.md) no lo convierten en errata oficialmente declarada ni demuestran qué cifra ejecutaba el simulador de cada año.
- Código actual: [irpf-autonomico-2019.ts:263](../../lib/dominio/normativa/datos/irpf-autonomico-2019.ts#L263) conserva 53.407,20; [comunidades-autonomas.test.ts:54](../../tests/comunidades-autonomas.test.ts#L54) discrimina el límite de 2020. El contrato de cuota fija frente a integración se trata por separado.

Pregunta exacta: ¿Qué cifra aplicó AEAT para el último tramo?

### 12. CANARIAS-CUOTA · Canarias · cuota publicada frente a integración

Ejercicios: 2015–2016. Territorio: Canarias. La cuestión general de cuotas fijas también interesa a Madrid, sin trasladarle automáticamente este resultado.

- Lectura de la tabla: [BOE-A-2015-1113](https://www.boe.es/boe/dias/2015/02/06/pdfs/BOE-A-2015-1113.pdf), página física 73, publica 1.813,61 euros. El [localizador conservado](datos-2012-2026/lotes/escalas-minimos-2012-2018/canarias-fuente.json) identifica bytes, fila y coordenadas.
- Lectura aritmética: integrar los tipos de los tramos hasta esa frontera produce 1.813,62. Es una discrepancia entre tabla y cálculo derivado, no una segunda norma que corrija la primera.
- Código actual: [escalas-gravamen.ts:102](../../lib/dominio/irpf/cuotas/escalas-gravamen.ts#L102) integra cuando no recibe escalas publicadas. El [reproductor canario](../../tests/datos-escalas-minimos-canarias.mjs) conserva esperado 1.813,61 y sale en rojo. No es un archivo `*.test.ts` o `*.test.mjs`, por lo que no pertenece al descubrimiento de `vitest.config.ts`.

Pregunta exacta: ¿Manda la cuota fija publicada o la que sale de integrar los tipos?

## Dudas sin dos fuentes enfrentadas

### MDV2-P01 · régimen común · alimentos sin derecho a mínimo

Ejercicios: perfil anual familiar 2012–2026. Territorio: régimen común dentro de las exclusiones de la API.

El art. 64 LIRPF exige falta de derecho al mínimo; los arts. 58 y 61 condicionan ese derecho. El Manual AEAT describe la exclusión por convivencia/custodia en términos generales. Falta un criterio específico para el custodio pagador cuyo hijo pierde el derecho por renta o declaración propia. La [reserva original](revisiones/minimos-derechos-v2-sol/MDV2-P01.json) y la [revisión de la exclusión](revisiones/alimentos-sin-minimo-sol/INFORME.md) distinguen esa duda de un defecto numérico demostrado. No se inventa una segunda interpretación fiscal cerrada.

Código actual: [liquidar-irpf-anual.ts:230](../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts#L230) rechaza alimentos propios sin mínimo. Las [pruebas de integración](../../tests/minimos-derechos-integracion.test.ts) conservan controles dentro y fuera de la frontera.

Pregunta exacta: ¿Cómo se tratan los alimentos pagados a un hijo que no da derecho a mínimo?

### TGSS-REDONDEO · Seguridad Social · cuantización mensual

Ejercicios: 2012–2026, con solidaridad en 2025–2026. Territorio: sistema estatal, perfil laboral representado.

La documentación recopilada no cierra una regla universal por concepto, mes, pagador, empate y signo. La [contrarrevisión mensual](revisiones/redondeo-tgss-mensual-v1/INFORME.md) sí identifica un ejemplo oficial que discrimina suma de cuotas en céntimos frente a redondeo único del agregado. Las órdenes y el ejemplo no bastan para extrapolarlo a todas las ramas. La [consulta pendiente](auditorias/redondeo-tgss-mensual/contrato/consulta-pendiente.md) conserva el alcance documental; no se atribuye al motor anual una promesa de nómina mensual.

Código actual: [cotizaciones-sociales.ts:3](../../lib/dominio/laboral/cotizaciones-sociales.ts#L3) conecta el perfil uniforme analítico. [liquidar-irpf-anual.ts:762](../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts#L762) declara que no acredita redondeo mensual TGSS.

Pregunta para el experto: ¿Qué regla oficial de redondeo y acumulación corresponde a cada concepto, mes y pagador, incluidos los empates, los negativos y la solidaridad de 2025–2026?

### CV-CENSO · Comunitat Valenciana · funcionamiento en 2025

Código afectado: `valenciana_donaciones_lengua_valenciana`, grupo 5. Ejercicio: 2025. Territorio: Comunitat Valenciana.

El proyecto sometido a información pública en DOGV 9220 de 22/11/2021 y la previsión presupuestaria de creación del censo en 2024 no prueban su funcionamiento efectivo. El [expediente de cultura y lengua](deducciones-2025/correcciones/g-cultura-lengua/INFORME.md) y sus [citas](deducciones-2025/correcciones/g-cultura-lengua/citas.json) conservan esa búsqueda sin convertir la falta de resultado en prueba de inexistencia. Falta un acto o certificación administrativa positiva aplicable a 2025.

Código actual: [donaciones-inversion.ts:63](../../lib/dominio/irpf/deducciones/valenciana-2025/donaciones-inversion.ts#L63) exige `inscripcionEficazCenso2025` para el grupo 5; no bloquea por ello los grupos 1–4 ni demuestra que el censo funcionase.

Pregunta exacta: ¿El censo estaba operativo en 2025?
