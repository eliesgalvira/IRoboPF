# Revisión de publicación de evidencia v1

Base comprobada: `5799bb03826719a4dd3500a962e2d6bb5124fdca`. Autor real: Codex, agente `/root`, hilo `01a18835-f5a0-7f21-b5ee-cedaaf9c5c2b`, checkout `t3-dd9694a5`. Trabajo personal, sin subdelegación, fixes ni operaciones VCS mutantes. Esta identidad identifica la ejecución; no pretende acreditar independencia mediante un seudónimo.

**La publicación no es aprobable en esta base.** El CAS histórico verifica, pero falta una ruta exigida por el propio software y la ruta de ficha no consume los estados del snapshot. Los resultados verdes del padre no se reproducen en el árbol comprometido. No se inspeccionó trabajo en curso ajeno ni se restauraron archivos desde él.

## PE-01 — Ruta de objetos ausente y puerta actual rota (P1)

`app/procedencia/[snapshot]/objetos/[hash]/route.ts` no existe ni pertenece al árbol Git de la base. `FUENTES_EXPLICACION` la exige. `prepararEntrada` aborta con ENOENT; la suite de publicación falla antes de sus seis pruebas, que quedan omitidas. `verificarRastroGenerado` aborta por el mismo archivo. No es una falta de instalación ni un fallo del selector v1 del test.

Las URLs prometidas `/procedencia/<snapshot>/objetos/<hash>` corresponden, en este árbol, a la ruta genérica `[id]/[revision]`. Importé su GET real sin servidor con `id=objetos`: devuelve 404 para ambos blobs públicos. El helper `responderObjeto` devuelve 200, PDF/PNG, nosniff, no-referrer, CSP y caché inmutable correctos; **probar ese helper no prueba una ruta que falta**. Para un auxiliar privado devuelve 404; ante original corrupto devuelve 503/no-store.

Decisión: bloquear la aprobación de publicación y pedir al padre integrar la ruta y verificar la puerta fresca antes de regenerar. Objeción experta: incorporar un archivo desde otra entrega sin cotejarlo podría ocultar una segunda divergencia de fuentes. Coste: integración explícita por hashes, nueva publicación determinista y prueba de GET real. No se ofrece fix en esta revisión.

## PE-02 — GET de ficha pierde estados y enlaces documentales (P2; EC-04 abierto)

El GET existente resuelve la entidad y llama `Ficha({ entidad, snapshot })`, sin `evidencia` ni `enlaces`. La ficha del sujeto Madrid responde 200/text-html/no-store pero no tiene el enlace «Original PDF» ni el bloque estructurado de estados técnicos. Presenta el mensaje genérico de pendientes. Puede contener `trust-indeterminate` dentro de prosa heredada: el campo `estados` de resultados.json busca esa cadena y **no acredita el bloque estructurado**. La lectura del consumidor demuestra qué props faltan. No hay nosniff en este HTML; la exigencia del contrato de blobs sí está implementada en el helper.

El test del padre crea Ficha directamente con las props correctas y por ello no descubre la desconexión del GET. Las aristas documentales genéricas siguen apareciendo, pero no sustituyen los enlaces de descarga ni los estados por sujeto exacto.

Decisión: EC-04 queda aprobado solo para el modelo v2 y su CAS; no para el consumidor público. Objeción experta: mostrar estados de otro sujeto sería peor que omitirlos. Coste: seleccionar por ID y revisión exactos y ensayar un sujeto sin evidencia además de Madrid. No heredar los estados de Madrid a 51.943 fichas.

## PE-03 — Omisión de estados no detectada por el verificador (P2 de cobertura)

En una copia propia se vacía `evidencias`, se recalculan los bytes/hash del snapshot y se registra únicamente ese nuevo hash. `verificar` devuelve integridad comprobada, aceptación pendiente y 51.943 entidades. Hash resultante: `bda61e53afaa6f8916b8669c08c8f1db4c7720095c3a53a735cefd150088e9c9`. Las entidades documentales y el recibo permanecen en CAS. El verificador solo coteja estados presentes; no exige cobertura del conjunto publicado.

Esto no modifica el snapshot fijado ni falsifica una aceptación: requiere elegir otro snapshot. Sí permite publicar una versión que pierde metadatos sin que la puerta de contenido lo detecte. Decisión: definir cobertura esperada por recibo/sujetos y rechazar omisiones antes de afirmar EC-04 cerrado. Objeción: v2 puede necesitar sujetos sin evidencia y no debe exigir una evidencia para cada ocurrencia técnica. Coste: una relación explícita entre lote documental y estados, con controles de duplicados/omisiones, sin obligación de aceptar sujetos técnicos.

## EC-02 y controles que sí cierran

Se verificaron únicamente el v1 técnico `8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3` y el v2 actual `efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6`; no se repitieron los dieciséis históricos. Ambos pasan el verificador completo: 51.939 y 51.943 entidades. V2 tiene 51.943 IDs únicos, 65 puntos de catálogo y cierre físico verificado por el recorrido de sus dependencias. Se conservan inventario, código, adquisición, payload, cita y recibo, no solo nombres de auxiliares. Esto cierra EC-02 para los bytes del caso publicado, no disponibilidad externa o durabilidad frente a corte eléctrico.

El sujeto exacto es `inv-c24095c17f76bb198b34cf8b8d5a45ed`, revisión `0879a0a3ecf28ee2eb7af2cf9dab4c7a827ebf647264be986a8330b54e66bac8`. Recibo conservado: `9165ee1974fc65639ed12dd193b32e685fffdd943b6a19d55e42ff1d25c03fd2`. Una nueva ejecución personal del coordinador real reconstruye desde código, comprueba siete dependencias y devuelve integridad/exactitud verificadas, binding pendiente y aceptación completa false. No se inyectó runner ni recibo.

Se rechazan manifiesto ausente, original corrupto, índice alterado con hash rehecho y sujeto ajeno al recibo. La etiqueta del último adverso dice «recibo rehasheado», pero el script cambia el sujeto del snapshot en memoria y conserva el recibo: no se atribuye a ese caso una falsificación completa de recibo. El índice sí se reserializa, comprime y guarda por su nuevo hash. La corrupción persistente del índice después de calentar la caché se detecta: cada lectura relee y hashea bytes, sin depender de mtime.

Decisión: reconocer el cierre físico medido sin ampliar la aceptación semántica. Objeción archivística: una copia local y hashes válidos no acreditan emisor, custodia independiente ni restauración en otra máquina. Coste: conservar esas limitaciones y las preservaciones previas. Crossa sigue siendo v1 histórico comunicado, misma casa/dueño; no se hizo verificación propia allí. No se tocó v1, v2 ni restauraciones.

## Medición de consultas y memoria

`metricas.json` procede de un proceso Bun nuevo bajo lock, sin generación previa en ese proceso. Consulta «Madrid», 30 resultados: v2 primera 476,95 ms, segunda 118,46 ms; v1 74,38 ms; retorno v2 108,02 y 107,74 ms. RSS respectivamente 417.615.872, 429.363.200, 448.147.456, 452.116.480 y 456.675.328 bytes. No se vació la caché del sistema operativo. V1 corta al encontrar treinta resultados: su cifra no prueba menor coste para búsquedas completas o ausentes.

La implementación retiene un único índice decodificado, limita bytes comprimidos a 10 MB y expansión a 30 MB. La secuencia v2/v1/v2 no introduce otro índice v2 distinto: no se presenta como ensayo de expulsión de múltiples índices documentales. El RSS no es un límite duro de memoria ni prueba de fuga. En el proceso que además verificó snapshots alcanzó aproximadamente 1,29 GB; esa medición está separada de la consulta fría. Decisión: aceptar la cota estructural de un índice, sin prometer carga concurrente. Objeción: tamaño del JSON y tamaño de objetos JavaScript no son iguales. Coste: medir posteriormente un host real y múltiples índices distintos antes de fijar presupuesto operativo.

## Alias, determinismo y software actual

El alias selecciona v2. El test busca el v1 cuya terna algoritmo/datos/explicación coincide; encuentra el v1 esperado y llega a prepararEntrada. Ese criterio es correcto para evitar publicar sobre v2. No prueba unicidad de múltiples v1 con igual terna; no se observó una selección equivocada en esta base.

La generación doble determinista del padre no puede repetirse sin corregir PE-01: no se declara demostrada por esta revisión. El CAS histórico conserva la explicación publicada, pero la puerta de software actual falla. No se altera el código, el alias ni la expectativa para forzar verde. Objeción: un snapshot verificable no demuestra que el checkout pueda producirlo. Coste: conservar rojo y exigir nueva ejecución después de integración.

## Madrid y atestación candidata

Reabrí personalmente el PDF original y el PNG. Render propio de página física 4, página impresa 13 del BOCM de 28/12/2018: artículo 1, escala autonómica. Última fila: 53.407,20 / 7.395,81 / en adelante / 21,00 %. El recorte muestra cabeceras y filas; 53.407,20 es inicio de la última fila y límite de la anterior. La ejecución real enlaza ese valor con `53407.2` del sujeto actual.

Original SHA-256 `8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660`; PNG `95c51f213a841bdc1658a260620f891f77c22311d12aa7b9d2e06c5289ba1868`; cita `9ddaab1ca3a55d960b27b0f471535103231eda90eb755fe513a3cd43b1fa5fa4`; payload `7e2a9cf3f953a6f3bf61c1d8af2be6e7d77e6775bbbfa0a85d4079d89cf9ecd1`. Inventario `ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397`, artifact `ae25e219e75593d7a0d408e325db872faca31261ded79a2115a563536073b3d0`.

No se ha demostrado bloqueo del payload numérico. Se emite atestación **CANDIDATA**, separada de la aprobación de publicación, para ese enlace exacto y alcance limitado. No se reabre ni acepta aquí toda la cadena normativa de 2020; se referencia la decisión jurídica previa sin extenderla. Autenticidad histórica indeterminada, interpretación candidata y regla completa false. Objeción experta: una cifra visual y una igualdad Decimal no acreditan vigencia completa ni firma histórica. Coste: limitar la decisión al binding examinado y exigir que el coordinador acredite identidad/independencia antes de cualquier promoción. No se toca registro, revisores ni atestaciones anteriores.

## Contrato futuro accepted-limited

El publicador y EstadoEvidencia solo admiten pending. Para accepted-limited hacen falta modelo y schema versionados, resolución de la atestación externa por hash, identidad real de tarea registrada por el coordinador, informe revisado, payload e inventario exactos y alcance idéntico, más estado explícito por sujeto. Debe mantenerse `aceptacionFiscalCompleta: false`, autenticidad separada y exclusión de cuotas, mínimos, otras anualidades y liquidación completa. Hay que revisar consumidores, verificador y determinismo juntos; un cambio de enum no basta. El límite de 10 MB es independiente de ese estado: documentos mayores necesitan contrato de almacenamiento resoluble y verificado, no un permiso jurídico ni una URL prometida. No se implementa ninguna de esas extensiones.

## Validación y límites de entrega

Lint global y typecheck principal/vendor terminaron con código 0. Las dieciséis reglas anti-slop siguen configuradas a error y oxlint usa --disable-nested-config. No se escribió Effect. El primer comando de tests nombró además un archivo de adaptador inexistente (`evidencia-contenido.test.ts`); solo seleccionó la suite de publicación, fallida por PE-01. No se atribuyen trece pruebas de adaptador ejecutadas ni seis pruebas verdes. Los scripts propios se entregan como .mjs, con imports al checkout fijado; no se disfraza código mediante otra extensión. Las mediciones y adversos son observaciones, no una suite general fiscal.

Se leyeron BRIEF, AGENTS, contrato, coordinación, estado, decisiones D001–D046, integración completa, redondeos, entrega de X y su revisión, implementación y revisión de evidencia, modelo/schema, almacén, HTTP, rutas, publicador, verificadores y consumidor. Sin Next build, suites legacy completas, descargas, LFS, gasto o transferencia externa. Scratch exclusivamente en .cache propia. No se tocaron originales ni informes ajenos. El manifiesto selecciona la entrega; nunca node_modules, fuentes copiadas o árboles CAS. No hay fixes numéricos ni oracles modificados.

Controles finales: `grafo.json` demuestra rechazo de IDs iguales con revisiones diferentes y de receta de Facsimile divergente de Citation tras recalcular revisiones y referencias. La búsqueda exacta del sujeto lo devuelve para Madrid 2020 y no para Andalucía 2020 ni Madrid 2021. Esto confirma el filtro técnico; no acredita vigencia por analogía ni reproduce de nuevo todos los adversos jurídicos EC-01. Preflight: 8.456 archivos de base presentes, cero ausencias; diff de producto vacío. El primer lint explícito de la entrega se lanzó desde el checkout y ESLint omitió los archivos por estar fuera de su base; se conserva ese diagnóstico y se repite desde la raíz del padre, solo sobre los tres scripts propios y usando la configuración explícita del checkout.

La repetición de lint propio terminó con código 0 en ESLint y oxlint, sin diagnósticos (`lint-entrega-real.log`). Los tres scripts fueron analizados desde una base que los incluye; no se cuenta el intento omitido como validación. La atestación candidata fija el hash final de este informe y su contexto separa snapshot técnico y documental. Su campo accepted-limited es una propuesta editorial limitada del binding, no un estado ya autorizado en el publicador pending ni aceptación fiscal completa.
