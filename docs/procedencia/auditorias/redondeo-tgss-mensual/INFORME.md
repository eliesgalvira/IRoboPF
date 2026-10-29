# Investigación del contrato de redondeo mensual TGSS

Base comprobada: `1da543754a4788b5fa3ae607adc1e98b08947cd9`. Trabajo personal, sin subdelegación ni operaciones VCS mutantes. Entrega candidata para una revisión NUEVA. No hay cambios de motor, registros, fixtures ni aceptación fiscal.

## Resultado

**El contrato oficial completo de redondeo no queda cerrado.** Se aporta evidencia primaria adicional sobre unidad de comunicación y cálculo, precisión del fichero y separación de pagadores, pero no se ha localizado una instrucción suficiente para afirmar el momento exacto del redondeo de cada producto, su empate y los ajustes al combinar cuotas. Declarar HALF_UP por mes y concepto como regla TGSS aceptada excedería la evidencia. La búsqueda documentada no prueba que esa instrucción no exista.

Se adquirieron 19 originales: 16 PDF, dos HTML y un ZIP, con límite de 16 MiB por petición, UA identificativo del helper del proyecto, espera serial y CAS propio. Hay 42 citas con caja, texto exacto y facsímil reproducible a 120 DPI. El HTML sigue siendo HTML; el ZIP de esquemas no se convierte en norma de redondeo. Siete hallazgos quedan candidatos en `hallazgos.json`, con cobertura y bloqueos separados.

## Qué se ha establecido con primarios

- **Formato de bases:** Fichero Bases 2.0.2, p.31: «Importe expresado en céntimos de euro» para TipoDato C (C035). No acepta como valor C una fracción infinita de céntimo. No fija por ello la precisión jurídica de toda remuneración o prorrata anterior.
- **Solidaridad:** BNR 07/2024, p.3 (C026/C027), prescribe aplicar los tipos de empresa y trabajador al importe de cada concepto 497/498/499 y comunicar esos conceptos en el primer tramo temporal. Esa regla impide confundir los intervalos retributivos de solidaridad con los tramos temporales de afiliación. Hay instrucciones específicas incluso cuando en ese primer tramo solo exista cotización empresarial.
- **Modalidad y período:** BNR 09/2024, p.2 (C025), distingue el máximo mensual proporcional a días de alta del diario. BNR 01/2025, p.7 (C029 y original completo), precisa las complementarias, los conceptos a comunicar y que las bases no se recuperan del mes previo si se consignan 497/498/499.
- **Tipos:** PJC/178/2025, arts.16–17, pp.16–17; PJC/297/2026, art.17, p.16. Se conservan las páginas completas para no cortar el tramo segundo en el salto de página. Las parejas 2025 son 0,77/0,15 %, 0,83/0,17 % y 0,98/0,19 %; las de 2026 son 0,96/0,19 %, 1,04/0,21 % y 1,22/0,24 %. No se reconstruye el reparto mediante 5/6 ni por una proporción de CC redondeada.
- **Pago y conversión:** art.2 de la orden de 23/05/2001, C001. Su regla de céntimo próximo se refiere a importes abonados; la frase sobre empate dice expresamente «Si al aplicar el tipo de conversión». No prueba por sí sola el orden de redondeo de cuotas SLD.
- **Presentación y acumulación:** consulta de cálculos de octubre 2018, pp.19/24, distingue cuotas por trabajador/tramo/pagador. RLC p.32 (C033) expresa en céntimos el importe calculado de concepto. El manual general de agosto 2026 acumula conceptos 701/702/703 en 700 (C022). Ninguno de estos pasajes acredita por sí solo ajustar la cuota empresarial por diferencia para cuadrar un total.

`contrato/CONTRATO.md` y `contrato/contrato-candidato.json` separan doce reglas y proponen bloquear la salida ingresable cuando falten R05/R06/R10. `contrato/vigencia.md` distingue portada, publicación en índice, efectos y adquisición. Las referencias históricas 2012–24 del inventario anterior están identificadas con URL/hash, sin presentarse como comprobación propia nueva ni extrapolar el manual2026. La cadena de erratas de BNR07/2024 y la vigencia histórica exhaustiva siguen pendientes.

## Caso discriminante y reproducciones

La API real se ejecutó con año 2025 y salario 132500; `pruebas/api-real.json` conserva resultado y contrato. Devuelve alcance `analitico-doce-mensualidades-uniformes`, `redondeoTgss: pendiente`, solidaridad 673,42246/132,74372. Su salida ordinaria es 18498,996/3741,039; MEI 394,7238/76,5882. Son magnitudes analíticas, no cuotas mensuales liquidadas.

13250000 céntimos dividido por 12 deja resto 8. Doce remuneraciones iguales de 11041,67 suman 132500,04. Para conservar 132500,00 se declara el ejemplo enero–agosto 11041,67 y septiembre–diciembre 11041,66. Es una distribución explícita ilustrativa, no una nómina deducida de la captura. La ley de prorrata permite una división analítica; no se afirma que el contrato salarial anual deba transformarse necesariamente en ese reparto de pagos.

El script Decimal independiente conserva 21 casos, cada uno con doce entradas mensuales explícitas, y cuatro empates positivos. Incluye mensualidad uniforme representable, distribución exacta de céntimos, meses variables, máximo exacto y los tres límites de solidaridad ±0,01 en 2025 y 2026. Se prueban truncamiento, HALF_EVEN y HALF_UP, sumas antes/después y empresa por diferencia. Todos son experimentos aritméticos, no variantes jurídicas ya admitidas.

Para el reparto explícito de 132500, HALF_UP por concepto de solidaridad/pagador/mes reproduce 673,44/132,84. Sumar antes los tres productos mensuales por pagador produce 673,44/132,72. El cambio del trabajador demuestra que no basta acreditar los tipos. La mensualidad uniforme representable de 11041,67 también reproduce la anotación, pese a sumar cuatro céntimos más al año: esa coincidencia tampoco identifica el salario mensual real.

Con base mensual 4909,50 y tipos del perfil, HALF_UP por concepto ordinario reproduce 18498,96/3741,12 si AT/EP se trata agregado al 1,5 %. Para el trabajador, redondear el tipo agregado 6,35 % produce 3741,00, distinto de sumar CC/desempleo/FP redondeados. MEI separado da 394,68/76,56 bajo esa hipótesis. Si se ensaya IT0,8 % e IMS0,7 % separados, la empresa pasa a 18499,08. No se afirma elegibilidad de esa tarifa ni se infiere de la captura qué operación usó su autor.

La variante de meses variables mantiene el total 132500 pero cambia la solidaridad analítica a 809,56123/158,04686. Seis meses tienen 3000, cuatro 19083,33 y dos 19083,34. La API anual no puede distinguir ese vector de otro con igual suma; esto es falta de contrato mensual, no contradicción con su alcance analítico declarado.

No hay prueba roja normativa nueva: no se ha demostrado incumplimiento de una regla mensual que la API prometa ejecutar. Los rojos históricos de reparto pertenecen a la revisión anterior; no se atribuyen a esta tarea. No se cambian fixtures para obtener verde. La propuesta de cambio es una API mensual separada con entradas suficientes y política primaria revisada, conservando el perfil analítico y el oracle.

## Integridad, autenticidad y límites

Los originales están en `.cache/redondeo-tgss-mensual/cas/sha256/` de este checkout, fuera de la carpeta publicable. `fuentes/documentos.json` fija URL, respuesta HTTP, hora UTC, cabeceras saneadas, SHA256/512, MIME, tamaño y ruta absoluta. `binarios.json` permite al padre copiarlos por archivo/hash sin incorporar una caché completa. No se transfieren externamente.

`pdfsig` informa firma matemáticamente válida y documento completo firmado para las órdenes2025/2026. Su validación de certificado es indeterminada y aparece `NSS_Init failed`; no se acepta cadena ni confianza histórica. Los demás PDF no contienen firma según esa herramienta. CSV no comprobado. Los logs no equivalen a autenticación histórica. Los datos institucionales del sello BOE se conservan; no se agregan datos personales de particulares a metadatos publicables.

Las 42 cajas se reextraen literalmente y los PNG se regeneran byte a byte. Inspección visual propia acotada a C001, C026 y C035: regla euro, procedimiento solidaridad y formato de base. El resto es extracción técnica, no inspección visual total. C016/C017 solo capturan los códigos de tabla, por lo que no se usan solos para fundamentar la descripción de los conceptos; para eso se usa BNR07/2024.

El endpoint exploratorio187651 devolvió documento vacío: no se concluyó ausencia y se recuperó Bases en 187653.187661 resultó ser RLC, conservado bajo el identificador interno de descubrimiento `sld-calculos-detalle`; Cálculos real se obtuvo en 187654. El índice de manuales tuvo timeout en web y se recuperó con idioma explícito. El ZIP fue rechazado por el lector web por MIME y se adquirió mediante el helper. `fuentes/busquedas.json` conserva consultas e incidencias; los estados HTTP efectivos de adquisiciones exitosas están en documentos.json. Las búsquedas de terceros solo aportaron pistas de URLs de BNR, verificadas contra originales oficiales.

## Decisiones, objeciones y costes

1. Mantener la política monetaria pendiente. Objeción experta: no cerrar el contrato no satisface el objetivo final. Coste explícito: esta entrega sigue sin habilitar una nómina TGSS; inventar una instrucción sería peor evidencia y no es aceptable.
2. Separar comunicación, cálculo, nómina e ingreso. Objeción: un campo en céntimos no dice cuándo redondear. Coste: más reglas/estados y necesidad de evidencia del algoritmo, no solo de esquemas XML.
3. Mantener escenarios de distribución y AT/EP alternativos. Objeción: reconstruir hechos desde un total y una captura introduciría premisas falsas. Coste: no adjudicar corrección fiscal a la anotación, aunque su aritmética se reproduzca.
4. Conservar fuentes técnicas actuales e históricas por versión. Objeción: manual 2026 no valida 2012. Coste: no declarar cubierta la cadena 2012–24 y dejar referencias previas claramente atribuidas.
5. No escribir una prueba roja falsa. Objeción: cambiar la expectativa de una API analítica para llamarla nómina no demuestra bug. Coste: futuro contrato mensual y prueba contra él tras revisión, sin fix en esta ronda.

## Validación y entrega

Comandos y alcance en `pruebas/COMANDOS.md`; ejecuciones bajo lock pesado, un trabajador, Bun/Node de Nix, corpus Nix/uv fijados. Ruff y mypy comprueban scripts Python; oxlint carga las 16 reglas a error con `--disable-nested-config`; ESLint y TypeScript comprueban el arnés API. El chequeo de tipos usa copia exacta de lib dentro de `.cache` y dependencias del padre enlazadas para lectura, sin copiar fuentes ni node_modules bajo docs. La llamada numérica de API se ejecuta contra el archivo real del checkout, no esa copia.

El primer pase mypy encontró dos errores de tipado del arnés, corregidos sin alterar expectativas numéricas. Se conservan logs inicial/final. No se ejecuta Next build, suite legacy ni generación masiva. No hay escritura Effect nueva. Incidencia de entorno: la primera invocación de run.sh creó automáticamente tools/procedencia/.venv antes de fijar UV_PROJECT_ENVIRONMENT; las siguientes usan exclusivamente `.cache` propia. Se informa esta escritura de infraestructura fuera del ámbito; no se borra ni se integra, y no se modificaron package/lockfiles/CI.

Manifiesto por archivo con baseSha 256, tamaño y hash; parche textual de archivos nuevos y binarios referenciados por hash. Manifiesto y parche se excluyen de sí mismos para evitar ciclos. Cero borrados. La copia Crossa es v 1 histórica, misma casa/propietario, comunicada por coordinador; esta tarea no la verificó. No se tocó v 1, v 2, restauración, contexto ni Reactivity. Nada se autoacepta fiscalmente.
