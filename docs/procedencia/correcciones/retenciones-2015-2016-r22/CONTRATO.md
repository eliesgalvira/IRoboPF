# Precisión candidata del artículo 87.5, edición R22

Esta edición sustituye los doce reemplazos de `retenciones-2015-2016-r21/ajustes.json` por los de `ajustes.json` de esta carpeta. Los tres cambios de mínimos permanecen iguales. La autoría, la revisión y el rojo históricos se conservan. Ninguna versión del motor se habilita; no hay aceptación fiscal completa ni especificación de una nómina íntegra.

La sustitución del contrato base es expresa: en `revisiones/retenciones-2015-2016-sol/CONTRATO-CANDIDATO.md`, apartado «Regularización por ramas», el párrafo que comienza «Tipo regularizado=max» se conserva hasta «Exceso retenido no autoriza restitución por pagador». Sus tres últimas frases, desde «Causas5/6/8/9/10/11 excluyen», quedan sustituidas, para esta edición candidata, por los párrafos siguientes. El archivo original no se modifica. Su hash y los de las matrices están en `ajustes.json`.

## Calificación jurídica y precedencia

Primero se acreditan los hechos, su eficacia temporal y el dominio admitido. Después se califican las alternativas del artículo 87.5. Un número de causa del PDF no desactiva esa calificación. La lista 5/6/8/9/10/11 describe una bifurcación del pseudocódigo histórico y se conserva como comparación documental; no es una excepción normativa que se anteponga al artículo. Si el PDF y la calificación legal no se concilian, este candidato no entrega una nómina utilizable.

La primera alternativa exige circunstancias que **exclusivamente determinen una disminución** de la diferencia positiva. No basta un delta no positivo, ni basta medir el delta para demostrar exclusividad. La segunda alternativa es una nueva obligación judicial de alimentos a hijos a la que resulte aplicable el artículo 85.2. Su condición no exige por sí misma un delta negativo. Una obligación anterior, un cambio de cuantía no calificado o una pensión compensatoria al cónyuge no activan automáticamente esta segunda alternativa.

La causa 4 del PDF es el evento de alimentos a hijos; no se identifica con el ordinal 4 del artículo 87.2. El supuesto normativo pertinente es el 87.2.7. Tampoco la causa 7 del PDF representa ese ordinal. Los códigos sirven para cotejar el pseudocódigo una vez calificados los hechos, nunca como prueba de esos hechos.

## Techo y mínimos

Sean `t` el tipo candidato obtenido por el procedimiento anterior y `a` el tipo previo. Si se ha acreditado una de las alternativas y el caso pertenece al dominio limitado siguiente, el subpaso es `min(t,a)`. Solo cambia el valor si `t>a`. Si `t<a`, se conserva `t`; está descartada la asignación incondicional `t=a`.

El tipo candidato debe llegar con su mínimo del artículo 86.2 ya determinado y satisfecho. Este subcontrato exige que no haya cambiado la calificación de ese mínimo y que el mínimo aplicable no supere `a`. Por tanto, el techo conserva ambos límites en ese dominio. Un candidato que incumple el mínimo, un mínimo desconocido o nuevo, o un mínimo superior al anterior quedan **fuera del alcance**. No se elige un orden arbitrario entre `min(max())` y `max(min())` para decidir una colisión. Los tipos previos solicitados voluntariamente por el perceptor tampoco están admitidos.

Los ejemplos `t=18,a=12 →12`, `t=6,a=12 →6` y `t=0,a=12 →0` son operaciones condicionales, con mínimo cero previamente acreditado. No afirman que exista una nómina del dominio con todas las restantes magnitudes supuestas. Con mínimo 2 y `t=6,a=12`, el resultado sigue siendo 6. Con mínimo 15 y `t=15,a=15`, permanece 15. Con mínimo 15 y `a=12`, no se entrega resultado por este subcontrato.

## Dominio de esta precisión y concurrencias pendientes

Para la alternativa de alimentos se admite únicamente el **nuevo evento judicial de alimentos a hijos como única causa de la regularización**. No se incorporan otras variaciones materiales simultáneas. Se exige acreditar resolución y fecha, hijos y cuantías, ausencia de derecho al mínimo por esos mismos hijos, `0<anualidades<base`, comunicación al pagador y eficacia en la nómina conforme a los artículos 87.4 y 88, estado previo y magnitudes pendientes conciliados, y contrato/relación que determina el mínimo. El caso de custodio pagador sin mínimo por otras condiciones permanece excluido hasta resolver MDV2-P01. Un booleano `article85_2Applies` no acredita estos hechos: en los ejemplos solo expresa una premisa.

| Hechos | Alcance del subcontrato candidato |
| --- | --- |
| Nuevo evento judicial único, 85.2 acreditado, mínimo sin conflicto | Techo condicional `min(t,a)`; no resultado de nómina |
| Nuevo evento y otra variación, aunque se declare «conciliada» | Fuera del alcance; no se calcula ni se omite la guarda para devolver un tipo |
| Causas PDF 4+5, 4+6, 4+8, 4+9 o 4+10 | Concurrencias excluidas de esta edición, sin afirmar que la ley prohíba la regularización |
| Causa PDF 11 junto a 4 | Además incompatible con la entrada 11+1..10 del PDF; no es un contraejemplo admitido |
| Alimentos anteriores, voluntarios, de cónyuge o sin 85.2 acreditado | La alternativa nueva no queda acreditada; revisar las otras reglas, sin resultado de este subpaso |
| Disminución exclusivamente calificada, sin evento alimentario concurrente | Primera alternativa; mismo techo y condiciones de mínimo, sin inferir exclusividad del delta |
| Aumento exclusivamente calificado, sin evento alimentario concurrente | Techo de importe del segundo párrafo87.5, con las reservas previas; no composición automática con alimentos |

La exclusión de concurrencias es una limitación de soporte, no una interpretación que suprima la alternativa legal en esos casos. El principio de que los enteros del PDF no son excepciones permanece explícito, pero la composición completa requerirá hechos y revisión propios. Julio, su condición territorial y la doble minoración de600 mantienen sus reservas. Esta precisión tampoco resuelve fechas de selección de tablas, redondeos de etapas ni calificación íntegra del algoritmo.

Objeción experta: una exclusión amplia reduce cobertura en vez de resolver todas las combinaciones. Respuesta: delimita exactamente el subpaso candidato y evita dos órdenes de ejecución contradictorios mientras falta el contrato de concurrencias. Coste: esas entradas no podrán habilitarse mediante esta edición. El cierre del encargo sigue pendiente.

## Receta del fragmento HTML

`citas-art87-5.json` conserva los hashes originales. `sectionSha256` se calcula sobre los bytes desde el único atributo `id="a87"`, inclusive, hasta el único `id="a88"`, exclusivo. Se guardan ambos offsets de bytes. No es el `outerHTML` del elemento: empieza dentro de su etiqueta y termina dentro de la siguiente. Es una receta heredada reproducible, no una selección semántica que deba reutilizarse por inferencia.

La receta separada del texto elimina etiquetas con la expresión documentada, decodifica entidades HTML, normaliza espacios Unicode con Python y recorta el primer párrafo5. El hash del texto normalizado es otro campo. `selector="#a87"` localiza el artículo para lectura; no declara que su serialización DOM coincida con el fragmento bruto. La comprobación se hace contra los bytes fijados de ambos HTML, sin descargar o normalizar otra edición.

Objeción experta: un digest opaco puede parecer una prueba de cita o vigencia. Respuesta: los offsets, marcadores, transformaciones y hashes separados permiten reproducir exactamente qué se comprobó. Coste: mantener una receta heredada poco intuitiva y no usarla como prueba de autenticidad, historia legislativa o aceptación fiscal. Una futura receta basada en elementos HTML deberá tener identidad nueva.
