# Primera revisión independiente monetaria/jurídica P4a

Dictamen: NO ACEPTAR el candidato congelado para integración productiva. R1 permite una deducción indebida en ambas API. R2 y R3 rechazan hechos legítimos del perfil. R4 impide afirmar elegibilidad territorial balear con los hechos disponibles. No se propone modificar fórmulas u oráculos durante esta revisión.

Base declarada ff92d0da162e7732102d754304502c398cfaa018. Parche examinado SHA256 2e4a49fcfe93a5098ab9925afd894736a9ce12643c75e7f6eda0fa1c851d0c79. Antes de ejecutar se verificaron 127 artefactos, 12 postimágenes, seis preimágenes coincidentes con raíz y seis fuentes oficiales en CAS. No se ejecutó el verificador del autor porque escribe en el candidato. Se usó overlay virtual independiente, dependencias raíz y copias únicamente de los 12 archivos y seis preimágenes autorizados. Ningún VCS mutante, instalación, inventario, CI global o publicación.

## Hallazgos reproducidos

### R1 — Alta/P1: cambiar uso balear a habitual propia evita el productor y el censo

Localización: files/lib/dominio/irpf/deducciones/canarias-balears-hechos-2025/anual-adaptador.ts:226-228 (requiereP4a depende de v.uso), y consumidores.ts:6 (sólo ejecutado cuando se pide conciliar). El productor sólo restringe el código, no su subrama.

Reproductor portable: tests/revision-p4a.test.ts, “ROJO R1”, para API canónica y explícita. Partir de regional(true): alquiler36000; coste construcción80000, mejora1000 disponible1junio. En la solicitud cambiar uso a habitual_propia, id FANTASMA, catastro OTRA-RC, gasto P-FANTASMA/factura F-FANTASMA e importe10000; fijar alquiler.arrendatario=s-1. No cambiar el censo productor, que sólo tiene V1/RC1 y gasto1000.

Esperado: rechazo de rama ajena al perfil o de identidad/pago sin conciliación. Real: Success en ambas API; total aplicado1164.5106164383562 EUR (1164,51 al céntimo), frente a500 del caso conciliado. La base solicitada nominalmente permite5000, recortados por la cuota disponible. El sobreconsumo respecto del positivo es664,51 EUR. No es una exigencia de autenticar documentos: el propio motor acepta hechos incompatibles con su censo exhaustivo y un cambio de categoría que desactiva las comprobaciones.

Fuente: AEAT-Baleares, apartado2, exige al arrendador declarar el rendimiento como capital inmobiliario, no repercutir y depósito IBAVI; apartado Base máxima exige inversión realmente satisfecha por el contribuyente. Contrato P4a de perfil exclusivo: la rama habitual propia no debe abrir un segundo consumidor sin productor. Cerrar también los cambios de identidad y uso dentro de este perfil, preservando la rama histórica habitual propia fuera de P4a.

### R2 — Media/P2: fecha de factura/pago confundida con puesta en servicio

Localización: files/lib/dominio/irpf/inmobiliario-2025/productor.ts:69-70 exige puestaEnServicio >= g.fecha; consumidores.ts:23 exige igualdad de fecha de gasto y pago regional. El propio error llama a g.fecha “factura”.

ROJO R2 en ambas API: misma mejora1000, puesta en servicio2025-05-01, factura/pago2025-06-01. Es perfectamente posible terminar una instalación y facturar/pagar después. Todo ocurre en2025; no hay ayudas, uso mixto ni historia anterior de mejora. Esperado amortización2400+7350/365=2420.13698630137 EUR, neto33579.86301369863 y neto reducido16789.931506849315; deducción balear500. Real RechazoP4a/gasto, “mejora sin puesta en servicio2025 posterior a factura”.

Fuentes: BOE-RIRPF-2025 art14.1-2 y AEAT-amortizacion (coste de inversiones/mejoras); BOE-facturacion-2025 art6.1.i distingue fecha de operación y expedición, art11 regula expedición posterior; AEAT-Baleares Base máxima usa cantidades satisfechas. Se precisan fechas separadas de devengo/operación, factura, pago y servicio cuando difieren; no imponer una cronología fiscal inexistente. Si g.fecha se redefine como devengo, la igualdad obligatoria con fecha de pago regional mantiene el defecto para pagos posteriores del mismo ejercicio.

### R3 — Media/P2: confundir factura con operación rechaza partidas no duplicadas

Localización: productor.ts:100-103 crea documentos con todas las facturas y exige unicidad global, además de la unicidad correcta de IDs de operación.

ROJO R3 en ambas API: sustituir factura F1/importe1000 por dos partidas F1/P1/reparación600 y F1/P2/servicios400; misma fecha/prestador/inmueble. Son dos partidas distintas de una factura, no dos deducciones de la misma partida. Esperado neto8600, reducido4300. Real RechazoP4a/duplicado. Sin deducción regional ni cotitularidad; completamente dentro del perfil. Hay casos igualmente legítimos de factura recapitulativa con más de un inmueble.

Fuente: BOE-facturacion-2025 art6.1.f y art13 (descripción de operaciones y recapitulación); BOE-RIRPF-2025 art13 (deducción por naturaleza y cuantía, límite conjunto intereses/reparación). El contrato necesita identidad de factura y de línea/operación, con conciliación de importes; prohibir reutilizar documentos no sustituye ese control.

## R4 — Alta/P1, insuficiencia de hechos territorial (lectura estática)

El art3 balear exige que el inmueble esté situado en Illes Balears (AEAT-Baleares, requisitos generales, primer punto). InmuebleP4a y ViviendaCHechos no tienen ubicación territorial del inmueble. anual-adaptador.ts:293 asigna territorio=h.territorio, que procede de residencia/comunidad del contribuyente. vivienda-ampliacion.ts:239 comprueba después ese mismo valor. Residencia fiscal balear no prueba que todas las viviendas arrendadas estén en Baleares.

Dos propietarios residentes en Baleares con iguales cantidades y viviendas respectivamente en Mallorca y Barcelona tienen la misma representación disponible; el positivo devuelve500 en ambos supuestos. El catastro es texto opaco sin resolución territorial. Es un dato declarado faltante, no una petición de autenticación externa del documento. Añadir el hecho de ubicación y conciliarlo; no declarar esta condición acreditada por el resultado actual. No se cuenta R4 como una séptima prueba roja: es análisis de indistinguibilidad del esquema cerrado.

## Cotejo sustantivo y alcance por rama

- Íntegro: el productor suma exigibilidades de2025, no cobros; fechas inválidas se rechazan. Art22 y14 LIRPF. Hospedaje/personal a jornada completa excluidos por literales; art27.2. Magnitudes externas y cambios de categoría/personal fueron rechazados en ambas API por adversos propios.
- Gastos: principal y sanciones no se deducen. Reparación/intereses se limitan por inmueble y el exceso queda visible; art23.1a LIRPF/art13 RIRPF. Adverso propio con dos inmuebles: exceso3000 en primero, reducido-2400; segundo reducido4800; agregado2400. No se usa renta de otro inmueble para absorber exceso. El exceso no es un saldo certificado de ejercicios futuros.
- Otros gastos: tributos/comunidad/seguro/servicios/defensa/suministros se restan según clase declarada. Reserva adicional: los nombres genéricos no explicitan destino del préstamo, incidencia del tributo o conexión de servicios con arrendamiento (art13 RIRPF). Si el contrato considera “gastos del inmueble” una declaración expresa de necesidad/afectación, documentarlo; en caso contrario faltan hechos. No se califican automáticamente gastos particulares como válidos por presentar una factura.
- Amortización: 3% de mayor coste sin suelo/catastro construcción; coste incluye gastos de adquisición sin suelo y mejoras. Límite acumulado por coste, sin amortización histórica porque se declara uso personal exhaustivo anterior. Fórmula base y oráculos de autor examinados coherentes bajo este perfil, incluido catastro superior al coste y límite final; reserva de fechas R2. No se generaliza a gratuitos, usufructo ni alquiler previo.
- Reducción: sólo netos positivos, por inmueble, DT38 anterior26/05/2023=60%, fecha26/05 y posteriores=50%, sin ramas incrementadas por literales. Oráculos3440/4300 del autor coherentes con firma y resto de sus hechos. No reinterpretar la fecha de inicio de uso como fecha de celebración. Fuente AEAT-reducciones y art23.2/DT38 LIRPF2025. Condiciones procedimentales de autoliquidación previa a comprobación no modeladas: alcance cálculo ordinario, no certificación universal en comprobación.
- Canarias: positivo propio ambas API100, límite de cuota0 cuando no hay cuota. Prestador, titular, pago, factura, reparto100%, ausencia ayudas y contrato se concilian. Fórmula10% y máximo150 por inmueble coherentes con AEAT-Canarias art15ter. R3 afecta también a este perfil. No se habilitan15quater ni otros consumidores; no se presume que una reserva sea cero.
- Baleares: positivo propio ambas API500, límite de cuota0; base33000 incluida y33000.01 fuera produce reserva ResultadoNoSoportado (no deducción0). Certificados D/C y no repercusión presentes en positivo. Art3 admite sólo inversiones renovables y ahorro/reutilización agua: concepto genérico energia exige interpretación contractual acotada, no cualquier reforma energética. Depósito se trata como hecho declarado; no se exige consulta externa. Contrato anual y habitualidad LAU se acotan al perfil. R1 y R4 bloquean esta rama.
- Consumo: en positivos propios ambas API se comprueba que cuota líquida = cuotas estatal/autonómica tras mínimos menos deducción autonómica aplicada, una sola vez. DA61/art20 no se activan en perfil inmobiliario. No se afirma validez para renta mixta/P4b.
- 100 inmuebles: adverso propio con identidades separadas, neto reducido racional exacto430000; correcto. Fronteras de neto1200/1200.01/1199.99 con amortización1200 generan0/0.005/-0.01.

## Oráculos y evidencia

No se modificaron los oráculos del autor. Se examinaron sus nueve entradas y27 focales, incluidas dentro de la regresión35. Sus ejemplos base, DT38, mejora de enero/julio/diciembre, suelo y exceso son aritméticamente coherentes; no discriminan R1-R4. El positivo balear usa sólo un subconjunto de hechos que deja la ubicación sin representar.

Resultados propios finales:22 pruebas,16 correctas y6 rojas (R1/R2/R3 en ambas API). Exit Vitest1. El campo ok=true del envoltorio significa únicamente “reproducción roja esperada con marcas exactas”, NO aprobación fiscal ni suite verde. Ejecución inicial tenía tres fallos del arnés: comparación flotante estricta, leer Decimal como racional y esperar éxito en una reserva por superar33000. Se conservaron pruebas-v1-original.ts y resultados_adversos; se corrigieron sólo nuestras aserciones, sin tocar producto/oráculos. resultados_adversos_v2 deja6 rojas/14correctas; final agrega100 inmuebles y cierre de esquema,6rojas/16correctas.

Regresión selectiva independiente:35 archivos,895 correctas y2 omitidas previas. Incluye F, ELA, donativos, maternidad e histórico según regresiones.json;27focales incluidas, no sumadas. No se repitieron tipos/lint/CI global; sus evidencias de autor no sustituyen este dictamen. Un worker, heap1792MiB; guardia3GiB árbol/6GiB grupo,15min hijo/45min secuencia; picos y comandos en JSON. Ninguna guardia disparada.

## Entrega y reproducción

revision.patch añade sólo la prueba independiente; autonomo.patch conserva exactamente el candidato. files/ conserva12postimágenes y añade una prueba; preimagenes/ conserva6. No aplicar esta entrega a raíz durante la revisión. El overlay usa dependencias raíz y caché Vite externa.

Ejecutar cada comando por separado y esperar terminación:

```sh
timeout -k 30s 45m env P4A_TURNO_PESADO_ASIGNADO=1 P4A_RESULTADOS=reproduccion_adversos /nix/store/h3l4z7p6wny3phbckwwhy1i2g52pdnj4-python3-3.13.15/bin/python3 /home/elies/Backups/IRoboPF/producto-p4a-revision-20261105/ejecutar.py adversos
```

Cambiar adversos por regresiones y P4A_RESULTADOS por un nombre nuevo para35archivos. Exige asignación pesada nueva; no ejecutarlo simultáneamente con otras suites. El script fija entorno Node/Bun Nix del env indicado y UV_CACHE_DIR, sin instalar nada. Consultadas effect-solutions list/show testing,error-handling mediante Bun Nix dist/cli.js y fuente v4 packages/vitest/test/index.test.ts antes de escribir pruebas. Intentos de invocar binario ELF genérico fallaron por Nix; no son verificaciones correctas y no se usaron para ejecutar las pruebas.

Fuentes originales: fuentes.json con CAS/hash/localizador; nueva BOE facturación2025: fuentes-nuevas.json y CAS externo estable. Snapshot y comprobación final: candidato-antes/despues.json, raiz-antes/despues.json, cierre.json. Dictamen por ramas y por hechos declarados; ninguna aceptación fiscal universal.
