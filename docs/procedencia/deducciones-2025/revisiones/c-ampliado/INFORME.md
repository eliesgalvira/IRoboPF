# Revisión documental C ampliado — 2025

Candidato examinado: `6301c8da457ced81c348bdb10d8e5e04f67ec7fe`; bytes nuevos frente a `937ea5d504755a337274e420e5123d2b492ef1c6`. Resultado: **49 coincidencias documentales y dos diferencias** en las 51 decisiones de [decisiones.json](decisiones.json). Esta revisión no acepta el candidato ni certifica cálculos fiscales o liquidaciones. La recepción y decisión corresponden al padre.

Las diferencias están en [hallazgos.json](hallazgos.json), con hechos completos, alcance y corrección propuesta:

- **CAMP-01 — traslado canario de 2024:** la ficha ampliada solo reproduce 46.455/61.770 euros. La segunda anualidad de un traslado de 2024 requiere el umbral del ejercicio de origen, 45.500/60.500. Con renta individual de origen 46.000, el derecho no nació; la lectura de la ficha con el umbral nuevo permite indebidamente 300 euros en 2025. El manual, página física 180, identifica expresamente ambos años. Es una omisión documental; no se ha observado esa salida en el motor.
- **CAMP-02 — conciliación balear:** `cuantia.descripcion` y la propuesta `parametros.reglaDocumentada` fechan el régimen reforzado «desde11julio». Ley 11/2023 ya establecía 50%/900 para los colectivos cualificados. Contribuyente de 35 años, fallecido el 10 de julio, gasto admisible de 1.000 euros: 500, no los 400 que resulta de reducirlo al régimen general. Los requisitos extensos sí conservan correctamente la redacción previa. Corregir el resumen y la propuesta de parámetros, sin reabrir ese requisito ya corregido.

[Citas de los hallazgos](citas-hallazgos.json) conserva originales, SHA-256, SHA-512, tamaño, localizador y literal. Las cifras de los contraejemplos son discriminantes jurídicos independientes; no son ejecuciones de una API fiscal. No se atribuyen a este HEAD los siete rojos del auxiliar histórico de b95.

## Cobertura y límites

Se reabrieron desde los almacenes externos los **100 registros documentales** y se reextrajeron exactamente las **6.360 citas** del lote. SHA-256, SHA-512 y tamaños concordaron. Cada decisión enlaza la sección propia del manual, artículo, recortes primarios y remisiones individualizadas del paquete. La identidad textual se ha separado del alcance de la norma: una cabecera, una frase repetida o una tabla histórica no se convierten en evidencia vigente por coincidir.

En las prioridades del encargo:

- BOC 124/2012, art.45: 10%/20%, límite 10% de cuota y 150; la errata 139 no modifica ese artículo. Art.4 ter: la tabla 37,5 de 2017 es antecedente; la reescritura de 2019 sustenta 20/15/17,5 y el límite sobre base liquidable. Art.5 distingue certificación común del certificado de proyecto exclusivo de 4 bis.
- Ley 9/2025: efectos 1 de enero de 2025 circunscritos a lo modificado. DL 1/2025: reparto por propiedad/usufructo en 15 ter y máximo de cinco inmuebles en 16, sin extender ese máximo a toda deducción inmobiliaria.
- Discapacidad balear: 80/150 históricos no sustituyen 88/165. Cuidados: 40% y 660 por persona; ascendientes comunes íntegros por titular y descendientes comunes prorrateados en individuales. No se reconstruye una base por persona dividiendo un agregado.
- Conciliación: régimen reforzado previo conservado en requisitos; persiste CAMP-02 en el resumen. Reformas de 11 y 25 de julio: distinguir devengos por fallecimiento anteriores y colectivos añadidos. El 6 ter histórico de Ucrania no acredita nacimiento; el nuevo reparto de nacimiento alcanza el supuesto en que solo un progenitor tenga derecho.
- Las dos citas de primas canarias ahora remiten a `cc-a3df455189604e5d` (BOC 235/2018), no a la ley balear de texto compartido. Se comprobó la sustitución de atribución, además del literal.
- Remisiones: vivienda 68.1 a 1 de enero de 2012; título y categorías de familia numerosa; entidades, bases y certificados de donativos; comodatos y valoración anual del 4%, días y límites; actividad, plantilla, participación e innovación. Las referencias a certificación energética histórica se distinguen del procedimiento sucesor RD 390/2021, sin deducir de la derogación del procedimiento la desaparición del beneficio fiscal.

Los HTML oficiales de las leyes baleares 3/2015, 6/2015 y 5/2023 permiten contrastar el **contenido textual** recuperado, identificación de la publicación y disposiciones. Se retira para este alcance el `no_verificable` global de las tres fichas del autor. Persiste exclusivamente el contraste pendiente del PDF oficial/facsímil: no se afirma haber comprobado firma, sello o equivalencia material con un PDF no recuperado. La interfaz del BOIB distingue expresamente el PDF como contenido oficial y auténtico; ello exige delimitar la prueba, no ignorar el texto HTML accesible. No se realizaron nuevas adquisiciones al CAS.

Las coincidencias son documentales y se limitan a los cambios examinados y sus remisiones. No sustituyen la revisión del contrato o del motor compartido. La consignación de un importe externo se distingue de la admisión y del cálculo de una deducción. No se crea API regional ni se modifica API-MOTOR.md.

## Reproducción

Pruebas del autor: **181/181**. Discriminantes independientes: **12 comprobaciones pasan y dos quedan rojas**, CAMP-01 y CAMP-02. El rojo documental es deliberado y se conserva sin alterar expectativas. El archivo es una comprobación local explícita; no añade dependencia de CAS, cachés privadas u objetos Git históricos a las pruebas ordinarias.

```sh
bun run test tests/deducciones-procedencia-2025-c.test.ts tests/deducciones-procedencia-2025-c-evidencias.test.ts --maxWorkers=1
bun docs/procedencia/deducciones-2025/revisiones/c-ampliado/casos.ts
```

El segundo comando termina con código 1 mientras persistan las dos diferencias. La reextracción del corpus real es otro ensayo **local explícito**, con dependencias y CAS aportados por quien lo ejecute:

```sh
uv run --no-project --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 python docs/procedencia/deducciones-2025/lotes/c/verificar_citas.py --cas "$CAS_EXTERNO"
```

Tipos y lint se acotan a los dos módulos regionales, pruebas documentales y discriminantes añadidos. No se repitió CI global ni build. El resultado de CI facilitado por el padre se conserva como antecedente, sin convertirlo en una ejecución propia.

Solo se añaden archivos en esta carpeta. El cotejo físico inicial cubrió los 15.475 archivos versionados, incluidos enlaces sin seguir sus destinos. El cotejo final, patch POSIX, manifiesto de altas con ambos hashes y tamaños, lista de vacíos, cero retiradas y reconstrucción exacta sobre exportación sin Git se entregan privadamente. Sin commits, cambios a producto, autoaceptación ni operaciones remotas mutantes.
