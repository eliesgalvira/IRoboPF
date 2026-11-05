# Ayudas gallegas e historia de bases CLM/Extremadura

Corte integrado sobre `eeecc27c`, 5 de noviembre de 2026. Las revisiones independientes están terminadas y sus P2 corregidos. Pasan 573 pruebas conjuntas, los tipos globales y los 31 pasos completos del CI local. Este corte no cierra las deducciones autonómicas de 2025.

## Incendios gallegos VI100B

Ambas API reciben un expediente identificado de reparación de vivienda habitual afectada por los incendios de 2025: cobro íntegro, facturas y pagos causales, reparación completa del daño descrito y ausencia expresa de otras coberturas. El productor deriva la no integración de la ayuda bajo DA5.3 y conserva el asiento en el libro común. Pedir una deducción por ese ingreso no integrado produce un rechazo motivado; no se fabrica un importe positivo.

La revisión detectó que un pago al propio contribuyente podía contarse como coste y que se admitía justificación posterior al plazo. Se conservan los tres rojos y se exige proveedor distinto del contribuyente y justificación hasta el 15 de diciembre de 2025. Las 486 pruebas de la corrección pasan. Se añaden fronteras del 15 y 16 de diciembre para ambas API en la integración, incluidas en las 573 pruebas conjuntas correctas.

La [orden VI100B](https://www.xunta.gal/dog/Publicados/2025/20250830/AnuncioC3Q2-260825-0001_es.html), artículo 20.3, fija el plazo. Los originales y la cadena normativa quedan identificados en [FUENTES.json](FUENTES.json). Destrucción/ruina, pérdidas fiscales, otras coberturas, reintegros y calendarios distintos conservan sus reservas concretas.

## Ayudas a deportistas de Galicia

El censo identifica al beneficiario, resolución, reconocimiento gallego, convocatoria, finalidad y cobros. El corte conecta ayudas por resultados deportivos, sin relación laboral, prestación de servicios, actividad, beca ni otra exención. El reconocimiento autonómico no se equipara al estatuto estatal ni basta para aplicar la exención deportiva. Los importes cobrados se integran una vez en la base general; el selector territorial referencia el mismo ingreso.

La revisión independiente ejecutó 559 pruebas: 424 regresiones de autor, 86 propias y 49 controles P2. El libro, la base y los tipos generales conservan sus valores al añadir o retirar el selector. Los oráculos de 14 importes y las pruebas adversas se reciben completos. No se suman esas ejecuciones a futuras pruebas del mismo conjunto.

El P2 documental afectaba a las URLs de LIRPF/RIRPF: `p=20251231` seleccionaba realmente una versión de 2026. Se conservan las recepciones, pero se excluyen como evidencia de corte de 2025. Se sustituyen por las versiones seleccionadas [LIRPF 24/12/2025](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20251224&tn=1) y [RIRPF 24/12/2025](https://www.boe.es/buscar/act.php?id=BOE-A-2007-6820&p=20251224&tn=1), contrastadas por el revisor. El [manual AEAT de 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-galicia/ayudas-subvenciones-recibidas-deportistas-alto-nivel.html) y los originales autonómicos conservan su identificación. No cambia el cálculo por esta rectificación documental.

## Historia de bases CLM/Extremadura

`historiaBases` concilia contribuyente, objeto, primera operación, pagos y aplicaciones anteriores para las rutas de vivienda rural de CLM, cuenta ahorro vivienda de CLM, rehabilitación rural para alquiler de Extremadura y vivienda rural extremeña. Un censo ausente no significa base histórica cero. El corte deriva cero sólo desde hechos completos que lo permiten: primera operación de 2025, regla nacida en 2025 o pagos anteriores expresamente no deducidos. Las aplicaciones históricas positivas siguen rechazadas hasta poder reconstruirlas.

La cuenta de ahorro concilia movimientos desde la apertura; una retirada y reposición no convierte todo el saldo anterior en una nueva base. Vivienda, contribuyente y ejercicio no pueden intercambiar historia. No se reciben saldos o bases fiscales calculadas por el cliente.

La revisión confirma el 15 % de CLM rural y conserva los doce esperados iniciales erróneos del autor, rectificados con norma primaria. Sus 232 pruebas dieron 226 verdes y seis rojos por un único P2: la prorrata extremeña por 365 se había transportado como decimal redondeado a 80 cifras. No se demostró una diferencia de céntimos. El arreglo mantiene numerador y divisor exactos hasta el consumo común de cuota, conserva las cadenas decimales finitas del subcálculo y presenta los periódicos como fracciones. Las 22 pruebas de precisión recibidas pasan sin modificar sus esperados, incluidas las seis rojas. También pasan 99 focales y 93 regresiones. La comprobación posterior de tipos se detuvo por la guardia global de 6 GiB; no se atribuye resultado a ese paso. La ejecución global posterior, en exclusiva, pasa después de adaptar los helpers de pruebas al contrato racional, conservando sus oráculos.

## Integración y límites

Las tres ampliaciones comparten la composición anual, el libro de ingresos o bases que les corresponde y el consumo único de cuota. La mezcla de programas en un expediente no se acepta. Los cambios ajenos en `CLAUDE.md` y el historial documental reservado no forman parte de la entrega.

La autenticidad y exhaustividad de hechos externos no quedan certificadas por los tests. Tampoco se convierten las restricciones del primer perfil en requisitos legales universales. El [CI local completo](VALIDACION.md) pasa con inventario y demás generados actualizados. La publicación y el CI remoto se registran después del push.
