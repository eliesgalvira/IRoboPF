# Evaluadores territoriales de deducciones 2025

Se incorporan 55 evaluadores parciales nuevos: Catalunya 6; Madrid/Murcia 8;
Asturias/Cantabria 9; Canarias/Baleares 10; CLM/CyL/Extremadura 12; Galicia/La
Rioja 10. Cada lote tiene revisión independiente y los errores monetarios
reproducidos están corregidos con sus regresiones. Los informes de integración
referenciados en cobertura.json delimitan las ramas, fuentes y resultados.

El corte anterior identificaba 51 códigos con algún evaluador parcial. La unión
sin duplicados alcanza 106 de 351; otros 245 no tienen evaluador específico
identificado. Esto no mide cierre completo por código: se conservan las ramas
pendientes de cada matriz. Las 55 altas todavía no se conectan al dispatcher ni
a la liquidación anual. El punto 4 sigue abierto. Las ampliaciones privadas no
se cuentan antes de integrarlas y revisarlas.

Los módulos exportan sus contratos por hechos, manteniendo resultados parciales
y rechazos explícitos. No deben sumarse directamente como deducciones de una
liquidación: resta derivar sus magnitudes desde la API anual, resolver
incompatibilidades y cuotas comunes, y componer sin duplicar importes o redondeos.

Los diez archivos de prueba añadidos forman parte del mismo paso del workflow
que comprueba deducciones. Antes de publicar se regeneran ambos inventarios y
se reproducen los 31 comandos del workflow con PATH limpio, runtimes fijados y
los mismos comandos Nix. El cierre de ejecución figura en ESTADO.md.

## Ampliación A del 5/11

Se integran otros 40 evaluadores parciales: 16 de Andalucía, 17 de Aragón y siete de Catalunya. La unión sin duplicados alcanza 146 de 351 códigos con algún evaluador específico; 205 siguen sin él en este corte. Estos números no representan cierre de todas las ramas ni conexión anual de las 40 altas.

La revisión independiente reprodujo cuatro defectos y el integrador los corrigió. El contraste del defecto grave AAR-01 es favorable; el nuevo S01 de fechas invertidas se corrigió conservando su expectativa. Pasan 233 pruebas, tipos estrictos y ambos linters. El [informe de integración](../producto-lote-a-ampliacion/REVISION-INTEGRACION.md) y la matriz49 conservan el alcance y las dos reglas aragonesas todavía pendientes en este corte. Los oráculos monetarios del autor permanecen intactos.

## Ampliación B integrada en el árbol de trabajo

37 códigos adicionales de Asturias y Cantabria: 34 cálculos directos y tres resolutores de magnitudes anuales. Revisión monetaria independiente sin bloqueos en el alcance, 81 pruebas de autor y 15 independientes. La conexión anual de estas 37 ramas sigue pendiente; se mantienen limitaciones por rama. El corte acumulado del árbol alcanza 183/351 códigos con algún evaluador parcial; no es cierre integral. Pendiente CI y publicación de este corte.

## Conexión anual de las primeras 55 altas

El adaptador revisado usa los rendimientos, bases, mínimos y cuota de la composición común. Las dos API reciben hechos territoriales cerrados y conservan un único libro de aplicación. Los 55 contratos anteriores tienen conexión anual dentro de los límites de [su contrato](../conexion-anual-territorial-20261105/CONTRATO.md); las 77 altas A40 y B37 siguen pendientes de esa conexión. El contraste de los vínculos es favorable con 75 pruebas permanentes. El total de códigos con algún evaluador parcial es 183; el punto 4 permanece abierto.
