# Conexiones de deducciones 2025 y etapas históricas

Este corte añade cuatro perfiles de deducciones a las dos API anuales y una política operativa acotada para Open Madrid 2020–2022. Las primeras revisiones monetarias y los contrastes graves están cerrados favorablemente en su alcance. Los 31 comandos del workflow han terminado correctamente en local con el entorno Nix y las versiones declaradas, generados e inventario incluidos. El resultado remoto se comprueba por separado; este documento no declara aceptación fiscal universal.

## Perfiles de producto

- **La Rioja, alquiler:** deriva el derecho material a inversión en vivienda desde los hechos de adquisición, ocupación, práctica histórica, préstamo y patrimonio del perfil DT18. La existencia de derecho durante el ejercicio excluye el alquiler aunque no se elija aplicar la inversión o falte cuota. No se confunde el derecho con la cantidad aplicada. Permanecen fuera los historiales complejos y las adquisiciones no representadas.
- **Murcia, guardería y maternidad:** concilia pagos y ayudas por factura y pagador, admite varios pagos coherentes de la misma factura y conserva el reparto nominal entre los titulares con derecho. Una ayuda de 1.000 € al segundo pagador de un gasto de 5.000 + 1.000 € no elimina al segundo titular del divisor: el primero conserva 500 €. La maternidad estatal se calcula en su libro propio; una propiedad opcional con valor `undefined` no activa esa conciliación. Permanecen fuera los cambios familiares y los perfiles excluidos por el contrato anual.
- **Valencia, salud y dos descendientes:** salud y deporte consumen una única cuota en el orden experto declarado; el 10 % por descendientes se calcula después sobre el residual. El orden entre salud y deporte es una elección del perfil, no una prioridad legal ni una optimización. El perfil sanitario se limita a gasto propio y categorías conciliadas. Los reembolsos deben incluir las prestaciones reintegrables que cubren el gasto, aunque todavía no se hayan cobrado: el expediente debe acreditar ese dato. Referencias de factura, informe o registro no autentican por sí mismas los documentos.
- **Andalucía, ayuda doméstica:** deriva los rendimientos de la pareja y concilia vínculo estable, declaración y elección exclusiva del beneficiario. Conserva el 20 % y el tope de 500 €, la vía de hijos y la alternativa de edad del perfil. Un rendimiento íntegro positivo puede coexistir con base cero. Si hay censo familiar común, se comparan los hechos económicos y la modalidad de declaración; comparar sólo las bases permitía aceptar relatos contradictorios. El perfil anual de hijos exige el mínimo del propio contribuyente representado: no certifica la rama donde sólo la pareja tendría el derecho. Las actividades y las historias familiares no representadas siguen rechazadas.

Los límites de renta valencianos de salud y deporte se apoyan también en los artículos 2 y 3 del [Decreto-ley 1/2026](https://www.boe.es/buscar/doc.php?id=DOGV-r-2026-90037), con efectos desde el 1 de enero de 2025. El corte normativo de diciembre de 2025, por sí solo, no contiene esa modificación retroactiva. Para ayuda doméstica andaluza se conserva la vigencia de la ampliación a parejas desde 2022; no se presenta 2023 como inicio.

## Pruebas y correcciones

| Bloque | Pruebas focales y regresiones ejecutadas | Resultado |
| --- | ---: | --- |
| Rioja | 434 | Correctas |
| Murcia | 259 | Correctas; dos omisiones preexistentes separadas |
| Valencia | 432 | Correctas |
| Andalucía | 169 | Correctas tras la conciliación de censos |
| Histórico 2020–2022 | 431 | Correctas, incluido el control externo de 186 entradas |

Son conjuntos de pruebas con regresiones compartidas; no se suman como casos fiscales únicos. Los fallos previos se conservan en la entrega privada. En Andalucía se corrigieron dos esperados de cuota baja que habían usado la reducción máxima del artículo 20 fuera de su tramo. Los nuevos esperados se derivan de la fórmula de 2025: para íntegro 16.000 €, cotizaciones cero y gasto general 2.000 €, reducción 5.293 €, base 8.707 € y cuota autonómica 277,115 € antes de presentación; para 16.200 €, reducción 4.943 €, base 9.257 € y cuota 329,365 €. No se alteró el algoritmo productivo para satisfacer esas expectativas.

La revisión histórica detectó bases internas no derivadas de los hechos, un mínimo arbitrario y una actividad contradictoria con el perfil de empleo. La corrección reconstruye la base con el productor común del artículo 20, exige el mínimo estatal del ejercicio y rechaza la actividad adicional. No duplica fórmulas fiscales. La política permanece separada de 2023 y 2024; véase [alcance histórico](../simuladores/historico/ETAPAS-2020-2022-20261111.md).

El punto 4 del plan sigue abierto: estos perfiles no cierran las 351 deducciones, sus concurrencias ni todas las historias familiares. En particular, no se inventa la renta previa de un no declarante gallego desde un certificado de imputaciones cuya correspondencia con la base todavía no está acreditada.

## Cierre de revisiones y ajustes mecánicos

- [REVISION-RIOJA.txt](REVISION-RIOJA.txt)
- [REVISION-MURCIA.txt](REVISION-MURCIA.txt)
- [REVISION-VALENCIA.md](REVISION-VALENCIA.md)
- [REVISION-ANDALUCIA.md](REVISION-ANDALUCIA.md)
- [REVISION-HISTORICO.md](REVISION-HISTORICO.md)
- [CONTRASTE-ANDALUCIA.txt](CONTRASTE-ANDALUCIA.txt)
- [CONTRASTE-HISTORICO.txt](CONTRASTE-HISTORICO.txt)

Los dictámenes conservan su fecha y el estado de controles conocido al emitirlos. Después de los ajustes mecánicos de tipos y lint, el padre ejecutó de nuevo 930 pruebas en doce archivos, sin fallos. Incluyen las suites independientes afectadas y el control privado histórico; no se suman a los recuentos anteriores. El código fiscal y los esperados monetarios no cambiaron durante estos ajustes. El CI completo volvió a comprobar el estado final: tipos globales y Effect, ambos linters, inventario, datos y simuladores correctos. La suite de deducciones pasó 7.808 pruebas, con dos omisiones y dos TODO preexistentes separados. Los cuatro fallos iniciales de pruebas del CI y los ajustes posteriores de tipos y lint quedaron preservados; las correcciones no cambiaron fórmulas ni esperados monetarios. Los originales, los rojos y cada preimagen permanecen en la entrega privada.
