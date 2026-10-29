# Auditoría candidata de retenciones del trabajo, 2012–2019

Esta entrega NO valida el motor histórico ni declara completada la auditoría exhaustiva solicitada. Documenta diferencias sustantivas, coincidencias parciales y lagunas concretas. Todos los hallazgos quedan pendientes de revisión independiente. No se han modificado cálculos, tests, índices de VCS, bookmarks ni archivos de otros auditores.

## Resultado principal

`retencion-trabajo-aeat.ts` admite cualquier `AnioFiscal`, pero únicamente utiliza el año para seleccionar umbrales de exclusión. El resto de parámetros se aplica sin selección histórica: reducción 7302, gastos 2000, mínimo 5550, escala 19–47% y límite 43% hasta 35200. Por ello un resultado calculado para 2012–2019 no acredita ejecución del algoritmo de ese ejercicio. El rastro siempre cita 2026.

La tabla anual aporta datos reales, pero no arregla el procedimiento. Ni siquiera cubre todas las variantes de 2018: desde 5 julio hay una tabla distinta para pensionistas y desempleados, mientras `situacionLaboral` se recibe y se ignora en los helpers. La interfaz del procedimiento carece de fecha de pago, retribuciones ya percibidas, retenciones ya practicadas y causas de regularización.

## Originales recuperados y cómo leerlos

El manifiesto `documentos.json` contiene originales locales por hash, URLs solicitada y final, momento de recuperación, estado HTTP, cabeceras, tamaño, MIME y SHA256/SHA512. La caché compartida utiliza `tools/procedencia/descargar.py`, lock de máquina, User-Agent IRoboPF y pausa de 2 s; ninguna descarga propia se ha paralelizado. Los hashes prueban integridad de la copia, no la firma del emisor. PAdES y CSV siguen sin validar.

Se han recuperado los algoritmos oficiales 2017,2018 inicial,2018 desde 5 julio y 2019. El original 2017 tiene portada no numerada: página física 22 corresponde a página impresa 21. Las citas utilizan siempre página física 1-based y cajas en puntos PDF, origen superior izquierdo. Los originales 2018 julio/2019 tienen numeración física alineada con la impresa.

**Advertencia esencial de 2019:** el documento muestra cambios con texto tachado. La extracción textual devuelve tanto lo eliminado como lo vigente. Revisé las imágenes de páginas 22 y 29: las fórmulas 2018 y sus condiciones están tachadas; la nueva reducción y tabla están destacadas. No es válido interpretar toda la capa textual como pseudocódigo ejecutable. Se conservan candidatos con texto literal, pero el revisor debe ver el original y los tachados. No he borrado texto del original para aparentar una versión limpia.

Los índices oficiales 2012–2016 no están disponibles en las rutas anuales consultadas. Las rutas migradas ensayadas para PDF2012,2014,2015,2016 y el enlace antiguo 2013 se registran como intentos fallidos; el enlace 2013 además falla en Python por certificado con algoritmo débil. No se desactivó TLS. Las copias secundarias localizadas solo sirvieron para encontrar enlaces antiguos; no se aceptan como autoridad normativa. Falta recuperar los algoritmos y todas sus revisiones, especialmente enero/febrero 2012 y las revisiones 2015.

**Advertencia del BOE:** solicitar una fecha no listada (`p=20120101`) devolvió el texto de 2026 del RIRPF. Ese documento se identifica como intento histórico fallido y no prueba valores 2012. Hay que comprobar la cabecera y la redacción efectivamente seleccionada, no inferirla del parámetro URL.

## Diferencias por etapa

1. **Remuneración e irregularidad.** Se recibe un total y dos reducciones ya calculadas; no se construye la previsión legal anual ni se comprueban las reglas de irregularidad. No hay separación del componente en especie ni ingreso a cuenta. Puede ser una frontera legítima si se declara que las entradas ya están normalizadas, pero no cuenta como implementación de esos pasos. Faltan comprobaciones de límites, signos y coherencia.
2. **Gastos y reducción.** Los gastos generales 2000 son posteriores al régimen 2012–2014. Faltan las reglas antiguas de movilidad, discapacidad y prolongación de actividad. La reducción 2015–2017 llega a 3700 y desaparece por encima de 14450; el motor usa la fórmula posterior 7302. En 2019 corresponde 5565/13115/16825 y pendiente 1,5. En 2018 hasta 4 julio rige la reducción antigua; desde 5 julio el propio algoritmo establece la media antigua/nueva. La coincidencia de esta última con Python no valida usarla para todos los pagos del año.
3. **Mínimos.** El motor aplica los importes posteriores a 2015 a todos los años. Desde 2015 las cuantías examinadas coinciden, pero eso no valida elegibilidad: descendientes de 25 años sin discapacidad se incluyen, edades son entradas sin referencia al 31 diciembre y convivencia 0 permite división por cero. La edad 40 por defecto es un supuesto técnico, no una regla fiscal. La adopción reciente booleana no comprueba todos los requisitos históricos.
4. **Escala.** Faltan escala antigua y gravamen complementario 2012–2014, la excepción de enero 2012 y las dos escalas 2015. El BOE RDL9/2015 p 11 publica 20/25/31/39/47 antes del 12 julio y 19,5/24,5/30,5/38/46 después; permite aplazar la regularización a los primeros pagos desde 1 agosto. Desde 2016 hasta 2019 el último marginal es 45%, sin tramo 47% desde 300000.
5. **Exclusiones.** Se compararon las ocho celdas de las tablas generales recuperadas y el caso inexistente situación 1 sin hijos. Son coincidencias parciales. En 2018 desdejulio, pensionistas/desempleados requieren otra tabla; por ejemplo situación 3 sin descendientes:13000 más 600/1200, no 12643 más 600/1200. La fecha opcional del helper no llega desde el procedimiento. Fechas fuera de rango caen silenciosamente a la tabla de cierre: supuesto técnico pendiente de rechazo explícito.
6. **Límite 43%.** Los algoritmos históricos examinados y RD1003/2014 p 8 condicionan su aplicación a retribución no superior a 22000; el motor la extiende a 35200. La constante 0,43 enlazada exclusivamente a 2026 en `irpf-retenciones-2026.ts` no demuestra ni vigencia histórica ni condiciones. Python aplica el tope sin rango superior: otra simplificación, no árbitro legal.
7. **Deducción por rendimientos.** Falta el régimen anterior del artículo 85 bis y la deducción 80 bis, suprimidos desde 2015. No confundirlos con deducciones posteriores ligadas al SMI. Faltan tipo previo, reglas de deducción y orden de operaciones antiguos.
8. **Tipo y redondeo.** Truncar el tipo a dos decimales y redondear el importe final half-up coincide en los algoritmos 2017–2019 sobre entradas válidas. No extrapolarlo a 2012–2014: la reforma suprime el redondeo al entero del tipo previo antiguo; el tipo final tras deducción exige su tratamiento propio. La cuota interna conserva más de dos decimales y se convierte al devolver céntimos; falta probar por separado cada frontera intermedia.
9. **Ceuta/Melilla y contratos.** Antes del cambio 2018 se reduce la cuota a la mitad, no al 40%. AEAT2017 y 2018 julio publican mínimos 8%/1% frente 6%/0,8% del motor. La duda inicial 7,5% frente 8% quedó resuelta: RIRPF86.2 histórico prescribe expresamente 8%, por lo que no procede dividir 15% por dos. AEAT2019 publica 6%/0,8%. El contrato `manuales` está declarado, pero no tiene cálculo propio de remuneración diaria×regla de 100 jornadas; no debe contarse como soporte completo.
10. **Anualidades y vivienda.** El incremento del mínimo para anualidades es 1600 antes de 2015 frente 1980 siempre en el motor. Desde 2015 debe evitarse aplicar el mínimo por los mismos hijos que generan el tratamiento especial. El cálculo inicial de minoración vivienda coincide en los originales modernos examinados, pero presupone derecho transitorio comunicado; no implementa su regularización ni distingue el régimen de enero 2012.
11. **Regularización y comunicación.** Ausentes las causas, límites de subida/bajada, tope máximo, fórmula sobre remuneración restante, cambios de residencia y vivienda, comunicación temporal y solicitud de tipo superior. El estado actual solo representa una retención inicial simplificada. Faltan pruebas de retribución pendiente cero y de exceso ya retenido.
12. **Varios pagadores y territorio.** No existe procedimiento especial para pensiones de varios pagadores delart 89.A ni identificación de cada pagador ordinario. Sumar sueldos como un solo pagador no es el procedimiento. El contrato no selecciona forales ni reglas de conexión; Navarra y territorios vascos quedan fuera de validación. En régimen común la escala de retención no se sustituye por la escala autonómica de liquidación.

## Ejemplos independientes y pruebas propuestas

`ejemplos-numericos.json` contiene entradas y pasos calculados con Decimal de Python estándar. Es una comprobación independiente de fórmulas, **no una ejecución del motor TypeScript**, ni una respuesta del servicio AEAT. Los ejemplos quedan pendientes de contrarrevisión y de convertirse en tests que fallen antes de cualquier fix.

- 2017, bruto 18000 y cotización 1143, persona 40 años, situación 3, general, sin familia ni otros ajustes: base oficial 14857 frente 11063,75; tipo 10,49% frente 5,82%; retención 1888,20 frente 1047,60€.
- 2019, mismas entradas: el tope 43% deja cuota 1720 y tipo 9,55%, importe 1719€, frente 1047,60€ del cálculo transcrito del motor.
- 2019, bruto 400000, cotización 0 como entrada sintética: tipo 42,23% frente 42,72%; importe 168920 frente 170880€. Aísla el tramo 47% indebido.
- Se añaden dos casos de 23000€, situación 2 con dos descendientes computados por mitad y mínimo 8100, para activar indebidamente el límite 43% por encima de 22000. El caso de 23000 sin hijos se conserva como control: coincide y demuestra por qué una prueba favorable no valida la condición.

Bordes obligatorios: cada umbral de exclusión a−0,01/igual/+0,01 en las ocho celdas; condición inexistente situación 1 sin hijos; todas las fronteras de reducción; cada corte de escala;22000 y 35200;33007,20; edades 2/3,24/25,64/65,74/75; discapacidad 33/65; descendientes 2/3; prorrateo 1/2/3; anualidad 0/base−0,01/base/base+0,01; contratos general/especial/inferior-año/manuales; Ceuta/Melilla en las cuatro combinaciones residencia/rendimientos. Fechas: enero/febrero 2012 con devengoenero pagado tarde;12 julio/1 agosto 2015 y opción del pagador;4/5 julio 2018 y posibles opciones transitorias de regularización.

## Legacy y fronteras

Se leyó `Calculo_Salario_IRPF.py`, especialmente `obtener_parametros`, `reduccion_trabajo`, `tramos_irpf` y el límite 43%. Distingue algunos valores anuales que el procedimiento nuevo no distingue; conserva simplificaciones incompatibles con una nómina completa:2015 solo escala final,2018 media anual, límites de escala antiguos truncados a euros, límite 43% sin rango, sin estados de regularización. No se ejecutó el script porque su salida por defecto regenera el libro completo. No se ha leído el Excel de 150MB ni realizado contraste de celdas: queda expresamente pendiente, sin alegar equivalencia.

La frontera con el auditor de trabajo está en `frontera-trabajo.md`. `reduccion-rendimientos-trabajo.ts` tiene fecha de fallecimiento para liquidación anual, pero el procedimiento auditado no lo llama. No se encontró mezcla directa de fecha de fallecimiento en retenciones; sí ausencia de la fecha de pago necesaria. Reutilizar esa función sin separar semánticas no resolvería el problema temporal.

Los tests existentes comprueban casos 2025/26 y un importe de límite 2019, además de vectores locales de umbrales. No prueban la corrección integral 2012–2019. No se ejecutaron build ni suite legacy; no se escribió TypeScript ni Effect.

## Decisiones, objeción experta y coste

- Recuperar originales por la herramienta común y esperar el lock. Objeción: limita velocidad y no verifica firmas. Motivo: preserva evidencias y evita sobrecargar servidores; coste aceptado: esperas y autenticación criptográfica pendiente.
- Separar HTML histórico de PDF original. Objeción: un consolidado puede escoger versión equivocada. Motivo: conservar el intento fallido y verificar cabecera; coste: no declarar validación histórica con una URL aparente.
- Usar extracción por bloques y cajas, con inspección visual selectiva. Objeción:2019 contiene tachados invisibles para texto plano. Motivo: citas literales verificables sin alterar originales; coste: selección fina y revisión visual de cada evidencia antes de aceptación.
- No usar copias secundarias como evidencia ni desactivar TLS. Objeción: deja algoritmos antiguos sin recuperar. Motivo: el estándar exige procedencia oficial; coste: huecos 2012–2016 explícitos y búsqueda posterior en archivo oficial.
- No corregir el motor ni sustituir tests existentes. Objeción: mantiene errores conocidos. Motivo: autorización de esta ronda solo documental y aceptación por agente nuevo; coste: resultados siguen incorrectos hasta contrarrevisión y prueba fallida.
- Generar ejemplos con fórmula independiente sin ejecutar suite pesada. Objeción: una transcripción puede diferir del programa. Motivo: casos revisables de alcance acotado; coste: no llamarlos resultados ejecutados del motor y exigir prueba posterior.

## Reproducción y límites de entrega

Scratch propio: `.cache/procedencia/retenciones-2012-2019/`. Adquisición: `nix shell nixpkgs#python3 -c python tools/procedencia/descargar.py URL`. Los scripts propios `adquirir.py`, `extras.py` e `historicos.py` usan esa misma función y su lock. Ejemplos: `nix shell nixpkgs#python3 -c python .cache/procedencia/retenciones-2012-2019/ejemplos.py`.

Extracción: `uv run --python <python3 de Nix> --with pymupdf python .../extraer.py`, proporcionando `LD_LIBRARY_PATH` de `nixpkgs#stdenv.cc.cc.lib` en NixOS. La primera ejecución deuv sin PythonNix falló por ejecutable dinámico genérico; se resolvió seleccionando PythonNix. No hubo instalación global. Solo se renderizaron páginas seleccionadas de 2019 a 72 dpi para revisar tachados.

Pendiente para cerrar de verdad: recuperar originales anuales 2012–2016 y revisiones; completar cadena histórica de reformas de cada artículo; cotejar las variantes judiciales, pensiones, movilidad, discapacidad y remuneración irregular; vincular inventario global cuando exista; selección final de citas y facsímiles; verificar firmas; ejecutar tests independientes fallidos y contraste concreto Excel en streaming; contrarrevisión por un auditor nuevo. La matriz de 160 celdas es un inventario de examen, no 160 validaciones ni exhaustividad demostrada.

Actualización de evidencia histórica: recuperadas redacciones RIRPF de 20/12/2011 y 06/12/2013, comprobando cabecera. Acreditan artículo 86 (tipo previo entero y tipo final con dos decimales), mínimos especiales 8%/1%, artículos 81/83/85 bis/88/89. RD2004/2009 y RD861/2008 se conservan en PDF. Queda por cotejar toda la cadena de reformas, incluida corrección de errores de 2009. Añadidos candidatos de excepciones a mínimos de contratos especiales y posible doble reducción 600+600 para pensionista con másdedoshijos en régimen antiguo.

## Conteos y comprobación local

Entrega:34 hallazgos candidatos (11 mismatch,13 missing,5 ambiguous,5 match),160 celdas paso-año,89 comparaciones de celdas de umbrales (81 generales incluida casilla inexistente y 8 especiales 2018),22 originales únicos y 2314 citas candidatas. Ningún hallazgo aceptado. Las coincidencias se limitan al subpaso o importe descrito.

`verificacion-local.json`: hashes de 22 originales comprobados,2292 citasPDF reextraídas desde cajas con igualdad exacta del texto y 22 citasHTML sin geometría ficticia. Cero errores en esas verificaciones; no equivalen a aceptación jurídica. Reproducción mediante `verificar.py` en scratch con el mismo entorno PyMuPDF descrito. `adquisicion-pendiente.json` conserva las URLs y errores de descarga. `tablas-comparadas.json` distingue tabla general y variante 2018 omitida.

Se filtraron recursivamente cabeceras de sesión y autorización de todos los JSON versionables, incluidas fuentes embebidas. No se alteraron bytes ni hashes de los originales. El metadato de publicación/versión diferencia fecha de portada AEAT, publicaciónBOE, redacción histórica e índice web sin versión histórica acreditada.
