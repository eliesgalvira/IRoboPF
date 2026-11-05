# Contraste independiente P4a — 5 noviembre 2026

**Favorable acotado: R1–R4 corregidos; ningún nuevo bloqueo por importe o publicación incorrectos encontrado en el alcance solicitado.** No acredita cobertura fiscal universal ni sustituye la validación previa a publicar. Candidato congelado: `producto-p4a-correccion-20261105`, parche SHA256 `a08c08a79aafc4418b81e829022f418f6bf0154944ba482d011aece12e7ec214`. No se ha corregido producto, raíz, esperados oficiales ni recepciones.

## Resultados reproducidos

- **Precorrección: 22 tests, 16 verdes y los seis rojos R1/R2/R3 reproducidos literalmente**, dos API. Se usan las postimágenes del candidato anterior conservadas en la primera revisión: son las preimágenes funcionales de esta corrección, no las seis preimágenes del parche base ff92d0da, donde P4a todavía no existe. El arnés recibido se carga directamente sin mutarlo. Log `reintento/antes.log`: R1 devuelve éxito y deducción 1164.51; R2 rechaza servicio anterior a factura; R3 rechaza dos partidas del mismo documento.
- **Candidato: 22/22 de la revisión adaptada**. Conserva todas las aserciones y cantidades originales, incluidos 500, 4300, 883350/365, umbral33000 y cuotas únicas.
- **50/50 adversos propios finales**, ambas API. Comprueban etiquetas y motivos concretos para uso habitual con identidades reales, ubicación canaria/peninsular, pago distinto de factura, importe regional del documento en vez de la línea y pago atribuido a otro inmueble. Repetición de pagos y solicitudes válidas alcanza los errores regionales de reutilización/código duplicado. Duplicar línea entre inmuebles, inconsistencias de fecha/total, suma superior al total y reutilización de ID alcanza errores semánticos del productor. Las tres fechas se prueban fuera2025 y con 29feb inválido.
- **132/132 en siete archivos de regresión selectiva**: focales del autor y corrección, conexión C36, fracciones API, revisión independiente C36, precisión80 y combinación de productores. No se ejecutó CI global, inventario, compilación global ni linters globales; los 925 verdes del padre no se presentan como ejecución propia.

## Mapeo mínimo de los 22 originales

`mapeo-revision.patch` permite revisar cada adaptación. Las fixtures actuales ya aportan ubicación, línea1, total1000 y operación/factura/pago en junio. En la preparación regional se declara ubicación igual a la región de la fixture; en R3 la segunda partida declara línea2. El caso original de gasto5000 añade totalFactura5000 para preservar su gasto y esperado, evitando rechazo por contradicción documental nueva. El umbral de enero traslada la antigua fecha única a las tres fechas nuevas. R2 conserva servicio mayo y factura/pago junio; la prueba adicional distingue operación abril, servicio mayo, factura junio y pago julio. Ningún oráculo ni importe esperado se alteró.

## Evaluación monetaria

R1: `m.inmueblesP4a` fuerza conciliación incluso al cambiar uso a habitual propia. Con identidad real se obtiene ResultadoNoSoportado por historia incompatible; con vivienda fantasma, por falta de productor. La ruta histórica de habitual propia sin P4a mantiene su condición original y queda cubierta por regresión C36.

R4: residencia y ubicación son independientes. Ubicación válida fuera de Illes Balears produce ResultadoNoSoportado con motivo de localización, no fallo de esquema; ubicación balear concede500. El caso sin consumidor admite inmueble peninsular. No se deduce ubicación por residencia.

R2/R3: el productor acumula importes de líneas, no repite el total de factura como gasto. Su clave emisor+factura incluye longitud del emisor; la del registro regional incluye longitudes de los tres componentes. Hay unicidad global de operaciones y de líneas dentro del documento, con fechaFactura/total consistentes y suma exacta no superior al total. El consumidor exige ID, factura, emisor, importe de línea y fechaPago conciliados. La deducción regional registra la misma línea del productor; fueraP4a sigue registrando el documento entero. Positivos propios:600.01+399.99 generan500 y amortización883350/365; dos inmuebles con líneas600/400 de un documento generan100 canarios y neto reducido15100; claves AB+C y A+BC permanecen separadas. La cuota descuenta una sola vez.

No se encontró un camino probado que duplique una línea entre inmuebles, pagos o solicitudes. Cambiar arbitrariamente los identificadores documentales declarados no constituye autenticación de documentos y no se exige tal autenticación a este contrato.

## Fuentes y reservas

`fuentes-verificadas.json` comprueba SHA CAS de cuatro manuales2025 y tres BOE corregidos, con enlace `version-selected` y rótulo24/12/2025 para LIRPF/RIRPF y06/12/2023 para facturación. `comprobar-fuentes.py` reproduce por su cuenta ocho artículos normativos iguales y art23 distinto respecto a la recepción errónea2026; los hashes normalizados propios difieren del comparador recibido porque la normalización es independiente. Los BOE originales p=20251231 sólo son recepción conservada. No se descargó nueva fuente CAS: las versiones correctas ya estaban preservadas.

La [LIRPF seleccionada2025](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20251224&tn=1#a23) confirma art23.2d ordinario50; DT38 remite a la redacción2021 para contratos anteriores a la entrada en vigor de Ley12/2023. El [manual AEAT2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c04-rendimientos-capital-inmobiliario/reducciones-rendimiento-neto/arrendamiento-inmuebles-destinados-vivienda.html) confirma60 para los anteriores al26mayo2023. Las ramas incrementadas quedan excluidas por los hechos del perfil. La petición web adicional de LIRPF agotó su tiempo; la comprobación documental utiliza el CAS íntegro y su rótulo real.

El [reglamento de facturación seleccionado](https://www.boe.es/buscar/act.php?id=BOE-A-2012-14696&p=20231206&tn=1) distingue expedición y operación, permite varias operaciones y contempla recapitulativas. **Reserva no bloqueante:** separar fechas y líneas no valida por sí solo los plazos de expedición del art11 ni el mismo mes de las recapitulativas del art13. El motor calcula hechos declarados; la documentación no debe presentarlo como validador universal de facturas. La ausencia de orden servicio/factura no es un defecto fiscal por sí sola.

El [manual balear2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-illes-balears/determinadas-inversiones-mejora-sostenibilidad-vivienda-habitual.html) confirma localización, inversiones tasadas de renovables/agua, certificados, cantidades satisfechas y requisitos del arrendador. INFORME limita energia/agua a esos hechos tasados y las clases generales a gastos vinculados fiscalmente al arrendamiento. No se detecta contradicción con esa interpretación declarativa.

**Reserva de alcance:** operación, factura, pago íntegro y servicio de la mejora dentro2025 son restricciones expresas; pagos parciales, impagos, ejercicios cruzados y otros perfiles no quedan acreditados. Suma de líneas menor al total representa sólo las partidas imputadas del documento y no autoriza fraccionar el pago de una misma línea. No se convierte esta restricción en una promesa de cobertura universal.

## Reproducción, recursos y preservación

`pruebas-portables.patch` entrega sólo pruebas y arnés propios. Overlay virtual referencia las recepciones sin copiarlas, dependencias de raíz y Vite externo. Desde raíz, para cada modo antes/adaptada/adversos/regresion:

```sh
P4A_TURNO_PESADO_ASIGNADO=1 P4A_RESULTADOS=nueva_ejecucion timeout -k 30s 45m /nix/store/h3l4z7p6wny3phbckwwhy1i2g52pdnj4-python3-3.13.15/bin/python3 /home/elies/Backups/IRoboPF/producto-p4a-contraste-20261105/ejecutar.py adversos
```

Usar etiqueta distinta por repetición del mismo modo: los logs no se sobrescriben. Los JSON registran comandos reales, códigos, segundos y picos muestreados. Cada hijo timeout15m/-k30s, runner45m/-k30s, heap1792MiB, un worker y secuencia exclusiva; aborto al superar3GiB árbol o6GiB grupo. No se lanzó oxlint ni otro proceso pesado paralelo. UV_CACHE_DIR externo; sin instalar dependencias. Todas las ejecuciones terminaron en segundos, sin guardias disparadas. Picos y resumen exactos en EVIDENCIA.json; son muestras, no límites duros del kernel. El periodo de pruebas10:56–10:58 estuvo por debajo del global45min.

Se conserva el fallo inicial de resolución del overlay (`resultados/antes.log`), seguido de reproducción correcta (`reintento/antes.log`). Se conserva `contraste-v1.ts`: el primer caso solicitud duplicada añadió erróneamente id ajeno al esquema; la versión final elimina ese dato y demuestra rechazo real de código duplicado. No se atribuye validez semántica a ese primer rechazo genérico. Una primera extracción documental buscó option-selected y se corrigió a a.version-selected; no alteró las fuentes.

Integridad del candidato:13postimágenes/6preimágenes y parche aplicado en memoria correctos; SHA congelado correcto. Preservación antes/después:26136 archivos de raíz (excluye VCS, dependencias y cachés),87 del candidato,53 de primera revisión y135 de autor: todos idénticos. No hubo VCS mutante, worktree, subagente, CI, push o publicación. Du real:91,075,428KiB para Backups/IRoboPF+Repos/IRoboPF, inferior150GB; no se crearon copias completas.

**PESADO1 LIBERADO.** No quedan suites ni procesos de prueba de esta revisión activos.
