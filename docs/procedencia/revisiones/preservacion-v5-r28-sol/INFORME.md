# Revisión independiente de preservación v5 r2, R28

Se puede **conservar el paquete exacto como corte candidato R26**, con los límites descritos aquí. No se aprueba el censo como taxonomía documental definitiva: el caso nuevo **V5R28-CL01** demuestra que un hash de selección recibe la clase «original-oficial» por tener una URL oficial contigua. No se ha demostrado un defecto bloqueante de recuperación del paquete fijado. Esta conclusión nueva requiere contraste del padre; no activa confianza, publicación ni aceptación fiscal.

Revisión personal en T3 Code/Codex, runtime gpt-6.1-sol, esfuerzo high, checkout `t3-ad56e1f7`. La petición exige prioridad; no fabrico una acreditación del scheduler ni aliases de identidad. Sin subdelegación, atestación, fixes de producto o mutaciones VCS. Base literal `5e69c68077ffd18be20457160595adb3f0ff52e4`, 15.914 entradas. No se confunde con la base R26 del paquete, `6ab4a98e6ce218c30a3a9f18596d0c2f030f47d9`.

## Ancla y recuperación efectiva

Se usa exclusivamente la entrega recibida fuera de T3 en `/home/elies/Repos/IRoboPF/.cache/orquestador-preservacion/v5-r2-2b15925970d4/`: paquete, restauración, manifest-externo.json y manifest-entrada-r1.json. No se leen resultados de hijos activos. El JSON externo de 26.184.815 bytes coincide con SHA256 `2b15925970d4819973598e1640c375ce95fc16c87e6e9981af1e86a2cb0d1c88` y SHA512 `8a8a26877dad98ed16518907258a9a1a79eda74478f58ae21db9e053826e29858365f5fc8dc279492baf28aba771b2e18aa5ea8f2362cbd878b404fda012bf9c`. El pin anterior no designa esta revisión.

`restauracion-recibo.json` documenta una restauración real nueva en `.cache/revision-v5-r28/restauracion-v5`, con conjunto exacto, ambos hashes y tamaño y `fsync-confirmed`. No se reutiliza la restauración del padre como destino. Se verifican también las dos copias recibidas y los inodos/nlink de los objetos entre las tres copias; no hay hardlinks entre ellas. Son copias locales en el mismo equipo, sin custodia independiente.

El software se materializa exclusivamente de las dependencias de esa restauración. Se cotejan las 21 fuentes `software`, origen/transporte y rutas efectivas de consumidor, preservacion, preservacion_urls y el recolector v3 importado. El runner y locks también proceden del paquete. `recuperacion.py` instala una guarda de aperturas que bloquea lecturas del padre fuera de la entrega fija. Los originales se resuelven bajo la restauración propia; el enlace propio `paquete-v5` apunta al paquete entregado únicamente para la comparación física exigida por el helper. No hay cachefallback para suplir ausencias.

El entorno Python gestionado es propio, con PyMuPDF 1.26.7 y dependencias fijadas; Nix/uv reutilizan su almacén disponible. Esto no prueba instalación offline desde una máquina vacía ni un cierre binario de Nix. Se conservan tres tipos de identidad: bytes originales disponibles, bytes derivados transportados y huellas declaradas de orígenes saneados. Los campos omitidos no se recuperan invirtiendo un hash.

## Muestras ejecutadas desde restauración

- Los cuatro originales PV24-01 pasan SHA256/SHA512/tamaño. Dos son JSON INE, dos PDF: CARM `1cfe9683…` y Cantabria `d52f521a…`.
- Los selectores existentes `/Data/11` de IPC251852 e IPC290751 recuperan respectivamente 94.394 y 79.714, diciembre de 2012. No se inventa facsímil PDF para JSON.
- Se extraen literalmente los pasajes conservados de CARM y Cantabria: 4.939 y 118 caracteres. Se respetan `bbox` y `box`; la longitud no acredita corrección jurídica.
- `mei2025`, `madrid-tabla-ley13-2023` y `colegio-art10-p16` reproducen los textos y PNG exactos. SHA256 de PNG: `1c5559d72825952d8b99564bddd5e9fda89d99b41589767e1103974e17093dae`, `75401a4002cbe825b0ccb69c24ea66b5d3195b64090b90b168b0cedac8c99d9f`, `39c62e2d8764dd1f8da840bf489ec2967c45baf7442a7e8d06d73de419b32ec3`. Inspeccioné personalmente los tres recortes: pasaje MEI, tabla autonómica y comienzo del artículo de gastos. El tercero es un pasaje parcial; no lo presento como artículo completo.
- El índice grande de retenciones se analiza y recodifica canónicamente con igualdad de sus 22.164.883 bytes. Esto reproduce el derivado disponible, no sus campos de origen eliminados.
- El HTML histórico `82a57fd7…`, selector `id="a84"`, reproduce la receta conservada: separar bloques, retirar etiquetas, html.unescape y colapsar espacios. Es texto HTML normalizado, no cita PDF literal ni nueva elección jurídica.

`recuperacion.json`, `ine.json` y `recuperacion-independiente.json` conservan resultados e identidades. No se reauditan jurídicamente todos los PDF.

## Receta r2 y censo

Una implementación propia reconstruye la unión por ruta desde la entrada exacta `7883e53fd88d11b8fef626669ce63d0676ea217799551e72195a510710378a41`, las cinco herramientas y `contrato-v5-r2.json`. Coinciden el JSON completo y los bytes del gzip entregado, con mtime cero y nombre vacío. La lista efectiva contiene selector_ine, recuperar2, materializar2, recolector2 y cierre_software; la palabra «cuatro» es una errata conservada. No se ejecuta el inicializador del recolector ni se cambia HEAD para satisfacer su guarda histórica.

Esta prueba corresponde a la transformación mecánica r2. La primera colección sigue dependiendo de cabeceras gzip con fecha y de los resultados presentes al enumerar su carpeta. No se afirma determinismo de aquella colección completa, ni recolección desde cero sin el manifiesto de entrada conservado. Objetos, exclusiones, censo y ausencias de r1 permanecen iguales en la transformación comprobada.

Se cotejan físicamente los 165 archivos del catálogo por ambas huellas/tamaño: **164 fragmentos de observaciones y un mapa de resolución**, no 165 lotes homogéneos. El recorrido registra 1.635.129 observaciones y 32.465 identidades. El mapa separa 1.447 objetos, 16.821 identidades auxiliares y 14.197 no resueltas. Las 19.477 referencias auxiliares del sobre no equivalen a archivos físicos distintos: hay 16.698 hashes transportados distintos de auxiliares, deduplicados por carpeta. Sin marcador son 18.145 archivos y 2.143.408.709 bytes; con marcador, 18.146 y 2.169.593.524. Estas cifras se solapan y no deben sumarse como cobertura.

Se cotejan nueve muestras de clases con sus punteros en blobs históricos R26, además de cinco sondas propias discriminantes y tres formas declaradamente no reconocidas: claves hash, URL sin hash y SHA512 aislado. La misma identidad `02c6e830…` aparece como desconocido-documental en una cita y original-oficial junto a la adquisición: la clase corresponde a una observación contextual, no a una esencia jurídica del hash.

Las muestras de ausencia distinguen un hash histórico de código (`fileSha256`), una página de inventario, un digest de texto Poppler, contenido X excluido y el hash sintético `aaaa…`, que aparece incluso bajo `declared/original`. Son razones concretas para no traducir 14.197 hashes a documentos fiscales perdidos. `censo-receta.json` conserva rutas/punteros sin valores privados. Las 592 filas saneadas declaran 379 identidades de origen sin bytes exactos disponibles en los objetos/auxiliares transportados; son identidades de origen de auxiliares, no 379 PDF perdidos ni una prueba de privacidad universal.

## Hallazgos y controles adversariales

**V5R28-CL01, nuevo, clasificación candidata imprecisa.** En `editorial/flujo-rentas-r21-sol/entradas-editoriales.json`, `/citations/0/selectionSha256`, el digest `5eadc5d5…` coexiste con documentSha256, URL, página, box y citationFile. El clasificador prioriza la URL contigua antes de discriminar esa selección. Un caso sintético independiente obtiene también original-oficial para selectionSha256: esperado protector incumplido, código 1. No se cambia el esperado ni la entrega. Impide aprobar la clasificación como censo semántico de originales; no demuestra pérdida documental, autenticidad ni un fallo de transporte. Su contraste y eventual rectificación corresponden al padre.

`casos.json` conserva 31 controles propios: 29 satisfacen su expectativa y dos permanecen rojos; el programa devuelve código 1. Duplicados de objetos, rutas auxiliares, referencias, adquisiciones y fuentes no resueltas se rechazan. Las rutas con traversal, absolutas, barra inversa, LF y componente vacío se rechazan, además de conflictos de ancestro y origen incoherente. Los extras de raíz/CAS, ausencias, bytes alterados, marcador cambiado y symlink de objeto se rechazan. URLs con credenciales, query privada y dominio parecido tampoco pasan; el identificador BOE público sí.

Se distinguen schema, load y verify: varias duplicidades satisfacen el schema pero load las rechaza; la verificación física es la que descubre extras y bytes corruptos. El recibo expone esas fronteras por caso. No se presenta el schema aislado como verificador de un paquete.

Los dos rojos son residuales ya documentados: localizador dentro de prosa y FILE:// en mayúsculas sobreviven a clean. Las sondas usan únicamente valores sintéticos; no demuestran secretos reales del corte. La expectativa ampliada se conserva, pero excede la política mecánica exacta que declara privacyCertification=false. Las claves privadas y la query con nombre codificado sí se eliminan. No se certifica anonimización universal ni se autoriza distribución.

Las pruebas de publicación exclusiva conservan bytes ante intento de sustitución. Se inyecta además un fallo en la confirmación final de transfer después del marcador: se conserva la publicación visible, se comunica PublicationDurabilityUnknown y confirm recupera fsync-confirmed. No se simulan apagado real, disco defectuoso, bombas gzip ni escritor hostil concurrente.

## Incidencias propias, recursos y calidad

El primer lector propio confundió el mapa de resolución con una observación y terminó con KeyError tras alcanzar ese archivo. Se conserva fuente inicial y log rojo. La adaptación separa las dos gramáticas; no repara los datos ni modifica esperados históricos. Ese primer intento no guardó RSS/tiempo exactos: se declara la laguna, sin inventar medidas. El segundo recorrido completo se justifica por esa corrección del instrumento, no por rutina. La reconstrucción mecánica ya había superado sus aserciones antes del error.

Restauración: 166,386 s y RSS máximo 866.380 KiB. Recuperación y contraste de copias: 129,927 s y 923.556 KiB. Censo/receta corregido: 9,332 s y 231.432 KiB. Son máximos por proceso y tiempos de operaciones solapadas en garantías, sin sumar supuesta cobertura. Se usa un trabajador y flock pesado por comando, liberado entre validaciones; el cotejo físico usa el bloqueo acotado autorizado. La cola del lock no se cuenta como tiempo efectivo de esos procesos.

Se conservan diagnósticos iniciales propios de Ruff y mypy y su corrección de instrumentos. El cierre pasa Ruff y mypy en siete fuentes; mypy usa check-untyped-defs, follow-imports=skip e ignore-missing-imports: no es tipado estricto integral de los JSON/imports. Oxlint pasa con un hilo y disable-nested-config como humo sobre formato.ts intacto, cargando las 16 reglas a error desde las dependencias de solo lectura del padre. No equivale a lint Python ni se ejecuta build, suite legacy o código Effect nuevo.

El primer ensayo de patch propio detectó diferencias en cinco JSON sin salto final: el generador no emitía el marcador de ausencia de newline y concatenaba la cabecera siguiente. Se conservan fuente, patch y restauración iniciales, logs y manifiesto previo en la caché; los logs/fuente iniciales se entregan también aquí. Se corrige únicamente el generador de transporte propio, conservando los bytes de los JSON y ensayando un destino nuevo. No es un defecto del paquete v5 ni se transforma ese primer intento en pase.

## Entrega y límites de la conclusión

Los cotejos físicos inicial/final comparan todas las entradas base mediante lstat, readlink, bytes y ejecutabilidad, un blob cada vez, además de diff. Ningún archivo base se modifica ni se borra; las rutas nuevas pertenecen exclusivamente a esta revisión y a su caché. MANIFIESTO fija ruta relativa, SHA256, tamaño y baseSha256 nulo para lo nuevo, con exclusión de controles autorreferentes. Patch textual gzip, catálogo binario y ensayo de transporte quedan separados. Los controles grandes se entregan comprimidos.

La restauración y PNG propios quedan en `.cache/revision-v5-r28/`; no integrar entornos ni originales PDF en Git. Los originales necesarios ya están en el paquete externo recibido, con ambos hashes y metadatos derivados identificados. No se genera v6 ni se transfieren datos fuera de Victus. DECISIONES local documenta objeciones, respuestas y costes.

Conservar un corte candidato es justificable por la recuperación efectivamente ejecutada y la entrada r2 preservada, **sin aprobar por hashes o pruebas su selección fiscal, clasificación definitiva, autenticidad, interpretación o aplicabilidad**. La limitación nueva CL01 y la privacidad acotada permanecen visibles. V4 conserva R21, v5 r2 conserva R26 y Crossa continúa v1 desfasado, mismo dueño/casa, sin custodia independiente. Madrid2020, publicación/composición, confianza activa y el encargo global mantienen sus estados pendientes. No se tocan ESTADO/DECISIONES generales ni entregas ajenas; las conclusiones nuevas esperan contraste del padre.
