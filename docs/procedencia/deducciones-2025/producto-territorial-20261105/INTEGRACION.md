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
