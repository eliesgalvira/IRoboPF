# Inventario de deducciones de 2025 al 12 de noviembre

El dato de 308 códigos con evaluación específica parcial corresponde a un
corte histórico. En `5b2a6105` sus 43 ausencias ya tienen una ruta específica
publicada. De esas 43, 42 tienen alguna rama monetaria y una conserva una
fórmula condicionada sin importe: vivienda joven de Murcia. Este inventario
añade cero códigos y no declara cerrado el punto 4.

El [inventario exacto](inventario.json) separa ambos cortes, agrupa todas las
comunidades del censo y enumera los 43 códigos con sus rutas y pruebas. No
afirma que los otros 308 tengan generación monetaria completa: ese recuento
ya incluía dependencias anuales, además de cálculos parciales. Tener una rama
monetaria tampoco acredita todas las ramas, la documentación de un caso ni
su aceptación fiscal.

## Reconstrucción del corte de 308

Se toma la unión por código de las siguientes colecciones, contrastada con
las 351 identidades del [censo](../censo.json):

1. Los 51 registros con `capacidadCalculo.hechosEspecificosParciales=true` del
   [registro base](../cobertura-producto-20261104/registro-351.json).
2. Las 132 altas del [corte territorial](../producto-territorial-20261105/cobertura.json).
   La unión alcanza 183 e incluye A40 y B37.
3. Los registros de [Galicia/La Rioja](../producto-e-ampliacion/matriz-49.json),
   que añaden 38 identidades, las 51 rutas de
   [D51](../conexion-d51/matriz-51.json) y las 36 de
   [C36](../c36-conexion-anual-20261105/matriz-36.json).
   La unión alcanza 308.

La resta exacta del censo da Aragón 2, Madrid 21 y Murcia 20. Las demás
comunidades tienen cero ausencias en ese corte. El inventario conserva las
referencias a las colecciones y las pruebas comprueban la unión, la resta,
los grupos y la ausencia de duplicados. No se usan menciones de un código
en un comentario como prueba de cálculo.

## Entregas posteriores que explican las 43 identidades

Los 41 códigos de Madrid y Murcia están en la ampliación F publicada en
[`3bcec2b0`](https://github.com/eliesgalvira/IRoboPF/commit/3bcec2b08cb1cc21292ca41851d73df4f3c28f19).
Su matriz distingue 36 ramas numéricas nuevas y cinco fórmulas condicionadas.
Las rutas posteriores resuelven cuatro de esas fórmulas en perfiles acotados:

- Madrid, aumento de costes hipotecarios, usa el productor de intereses de
  `hipoteca-madrid.ts` y su trayectoria contractual.
- Madrid, familia numerosa y dos descendientes, aplica las fórmulas en el
  libro de cuota anual. Las bases familiares se derivan de hechos económicos.
- Murcia, régimen transitorio, tiene una rama `estatal_pre2013` en
  `murcia-dt18.ts`. Esto no resuelve sus demás ramas, incluida `Uno_vigente`.

La inversión aragonesa aparece en
[`b9122c2b`](https://github.com/eliesgalvira/IRoboPF/commit/b9122c2bf61310922e856117ed4490136a628d03).
El arrendamiento social dispone del perfil mixto publicado en
[`10de842d`](https://github.com/eliesgalvira/IRoboPF/commit/10de842d1ba5078ba06f0f49836deed9aeb052be).
Su contrato anterior de petición sigue rechazando la falta de atribución
anual; se cuenta la nueva rama que produce importe, no aquella petición.

Se conserva cada matriz anterior como registro histórico. Este inventario
no cambia sus estados originales ni los presenta como dictámenes actuales.

## Prioridad y reserva de Murcia

La lista exacta ordena vivienda y alquiler primero, después familia,
discapacidad y cuidados, educación y el resto. Es una prioridad temática
del encargo, no una estimación estadística de contribuyentes de 2025.
La única identidad de esas 43 sin rama monetaria es
`murcia_vivienda_jovenes_hasta_40`, de prioridad vivienda.

La reserva F-N02 documentada en la
[revisión normativa](../revisiones/f-ampliado/INFORME.md) sigue vigente.
El [manual oficial de 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-region-murcia/inversion-vivienda-habitual-jovenes-edad-anos.html)
conserva la comparación patrimonial final/final. La
[fuente recuperada](fuentes-consulta.json) fija el documento y el pasaje.
La [guía informativa de Murcia](https://agenciatributaria.carm.es/documents/20632/814228/GUIA%2BBENEFICIOS%2BFISCALES%2BATRM.pdf/b8182dc3-3079-44b1-8a47-c15efb95a7c4)
habla de aumento patrimonial, pero su edición de junio de 2026 declara que
su contenido no es vinculante. Esta consulta no demuestra una rectificación
ni una interpretación aplicable a 2025 que cierre F-N02. Se mantiene el
rechazo sin importe; no se sustituye por cero ni por un cálculo positivo.

## Verificación y alcance

`python3 -I tests/procedencia-deducciones-registro_test.py` reproduce la
reconciliación documental sin CAS y verifica los destinos de las referencias.
Las pruebas existentes de F, conexión anual F, los dos códigos aragoneses,
el perfil social, art. 14 de Madrid, DT18 de Murcia y la hipoteca madrileña
son la comprobación de comportamiento. Los controles del inventario no
sustituyen esas ejecuciones ni el cotejo jurídico de las fuentes.

La [revisión independiente](REVISION.md) contrasta las 43 identidades y
sus pruebas, con 379 pruebas correctas. El inventario conserva por fila el
archivo, la línea y el importe del supuesto positivo contrastado, o el rechazo
sin importe. Esos importes son ejemplos, no cuantías universales de cada código.

No se modifican fórmulas, derechos ni importes en esta entrega. El CI del corte
se registra por separado antes de publicar.
