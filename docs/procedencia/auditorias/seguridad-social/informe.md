# Seguridad Social 2012–2026: auditoría documental candidata

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Esta entrega examina el cálculo de cotizaciones de IRoboPF, no certifica una nómina. Todos los hallazgos, incluidas las coincidencias, requieren revisión por otro auditor. No se ha modificado el motor ni se han aceptado correcciones. La evidencia está en originales BOE descargados por el adquirente compartido; los índices Markdown no se usan como prueba.

## Resultado principal

1. **2018 necesita dos períodos.** `BASE_MAXIMA_COTIZACION_LEGACY[2018]` conserva 45.014,40 € (3.751,20 × 12). El artículo 130 de la Ley 6/2018 eleva el máximo a 3.803,70 € desde el primer día del mes siguiente a su entrada en vigor: agosto. Para un trabajador mensual en alta todo el año, con remuneración suficiente en cada mes, la suma de máximos es **45.276,90 €**: siete meses a 3.751,20 y cinco a 3.803,70. No reemplazarlo por 45.644,40, que aplicaría indebidamente el máximo nuevo a enero–julio.
2. **El reparto de solidaridad no es exactamente 5/6.** `repartirCotizacionSolidaridad` aplica esa fracción a la cuota total en ambos ejercicios. Las órdenes publican tipos empresa/trabajador por tramo. Para 2025 son 0,77/0,15 %, 0,83/0,17 % y 0,98/0,19 %; para 2026, 0,96/0,19 %, 1,04/0,21 % y 1,22/0,24 %. Los tipos totales del motor y las anchuras 10 % + 40 % + resto coinciden con esa estructura. La discrepancia está en quién paga cada parte. El cociente de contingencias comunes 23,60/28,30 tampoco es 5/6; debe respetarse el desarrollo anual publicado.
3. **La base anual y el tipo empresarial agregado son un perfil simplificado.** La entrada solo contiene año y salario anual. No hay grupo, modalidad contractual, CNAE/ocupación, horas, días de alta, conceptos retributivos ni distribución mensual. El motor omite mínimos, aplica siempre desempleo indefinido y AT/EP 1,50 %, y usa una base única para todas las contingencias. Esto no define una cotización universal.
4. **La liquidación anual consume este mismo cálculo.** `lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts`, en la llamada identificada como `liquidacion.cotizacionesSociales.desglosarLegacy`, calcula el desglose a partir del rendimiento íntegro del trabajo. Su rastro reproduce literalmente el reparto 5/6 y 1/6. Delimitar el perfil es necesario también allí, aunque el servicio se llame legacy.

## Tabla y fórmulas examinadas

Se examinan las 15 entradas de base máxima, los cinco conceptos ordinarios con ambos pagadores, las cuatro parejas MEI, las seis tasas totales de solidaridad, las dos anchuras de tramo, el reparto, el tope de base, el exceso no negativo, las sumas por pagador y el uso de estos resultados en la liquidación y exportación. `hallazgos.json` contiene los símbolos estables; `cobertura.json` separa estados y pendientes.

La base anual es un **valor derivado**, no una norma que permita compensar excesos de un mes con bases bajas de otro. La regla general es computar la remuneración mensual, añadir la prorrata de gratificaciones y aplicar límites. Las órdenes distinguen remuneración mensual (prorrata /12) y diaria (reglas diarias). Doce y catorce pagas de igual remuneración anual, con correcta prorrata, pueden dar la misma base; multiplicar el máximo mensual por catorce sería incorrecto.

`baseCotizacionPara` calcula `min(bruto, máximo)` y `max(0, bruto−máximo)`. La segunda operación evita solidaridad negativa, pero la primera no aplica mínimos ni rechaza negativos por sí misma. La validación de la entrada debe seguir en su frontera; no se ha demostrado aquí que la interfaz permita un salario negativo.

La estructura de solidaridad es continua: primer exceso `min(E,0,1B)`, segundo `min(max(E−0,1B,0),0,4B)` y resto `max(E−0,5B,0)`. Los extremos monetarios publicados empiezan al céntimo posterior al límite; ese céntimo no debe restarse otra vez de la base del exceso. La equivalencia con umbrales anuales requiere doce meses uniformes y el mismo tope.

El tipo ordinario del perfil suma 31,40 % empresa y 6,35 % trabajador antes de MEI. CC 23,60/4,70 %, desempleo indefinido 5,50/1,55 %, FOGASA 0,20/0 % y formación 0,60/0,10 % son reglas del régimen ordinario delimitado. AT/EP 1,50/0 % es un supuesto que exige actividad y fecha; las órdenes remiten a una tarifa, no a un tipo universal. No se acepta una tarifa histórica de oficina por simple semejanza con el supuesto.

Para temporales generales, desempleo 6,70/1,60 % produce, sobre 2.000 €/mes, 24 € empresariales y 1 € del trabajador adicionales respecto al perfil. En 2012–2013 el temporal parcial tiene 7,70/1,60 %; las modalidades expresamente equiparadas al indefinido son excepciones, por lo que tampoco basta un booleano temporal. Transformaciones de contrato y reconocimiento de discapacidad tienen fechas propias.

Las horas extraordinarias necesitan tratamiento separado: CC ordinaria, base profesional y cotización adicional no son una sola base. Las órdenes contemplan adicional 12/2 % por fuerza mayor y 23,60/4,70 % en las restantes. También existen alta sin remuneración, tiempo parcial, pluriempleo, contratos cortos y sistemas especiales. El actual perfil no los representa. RETA no está soportado y queda expresamente fuera de la implementación auditada.

## Casos discriminantes y comparación legacy

`legacy-celdas.json` guarda las 16 filas de `CONTROL_GENERAL` y cuatro filas por cada hoja `DAT_2018`, `DAT_2025` y `DAT_2026` (cabecera y salarios 50.000, 65.000 y 100.000). Se leyeron directamente del ZIP/XML en streaming, liberando filas, sin cargar los 145 MB del libro como tabla. Las cifras Python coinciden en parámetros y fórmulas con TypeScript por inspección del original, no por ejecutar la generación masiva.

Para 50.000 € en 2018, el Excel guarda empresa 14.134,52 y trabajador 2.858,41. Si se conserva expresamente el AT/EP supuesto del perfil y se corrige solo la suma de bases mensuales, las cuotas analíticas antes de liquidación mensual son 14.216,9466 y 2.875,08315. La diferencia analítica es 82,425 y 16,66875 €. **No son importes certificados de nómina al céntimo**: falta decidir redondeo por concepto y mes con evidencia TGSS.

`casos-frontera.json` contiene 18 casos: B, 1,1B y 1,5B, cada uno ±0,01 €, para 2025 y 2026. Conserva bases por tramo, cuota legal analítica de cada pagador, cuota legacy y diferencia. Los casos no suponen que una doceava parte de un céntimo sea una remuneración mensual ingresable; prueban la fórmula anual y deben complementarse con fronteras mensuales representables.

En el límite 1,5B, la infracotización analítica del trabajador por el reparto legacy es 0,58914 € en 2025 y 0,306072 € en 2026; la empresa paga ese mismo exceso. A 100.000 € las diferencias se compensan en gran parte entre tramos: comprobar solo un salario alto puede ocultar el error. Las pruebas propuestas deben fallar **antes** del cambio y comprobar ambos pagadores, no solo la suma.

## Fuentes, autenticidad y citas

`documentos.json` conserva URL canónica/final, descarga UTC, HTTP, cabeceras útiles recibidas, excluidas las de sesión y autorización, SHA-256/SHA-512, tamaño, MIME, identificador y evidencia de publicación extraída del PDF. Si el servidor no devuelve ETag o Last-Modified, no se inventan. Los originales permanecen por hash en `.cache/procedencia/sha256/` y sus `localPath` son absolutos.

`citas-candidatas.json` conserva bloques de texto exactos con página 1-based y cajas en puntos PDF, origen superior izquierdo. Son candidatos de evidencia, no todos ellos reglas aceptadas. `bases-por-grupo.json` separa las celdas mínimas/máximas de los grupos 1–11 y mantiene las unidades mensuales o diarias; distingue fallos de extracción. Las reformas posteriores no se sobrescriben sobre el original: hay que relacionarlas con su período.

Los hashes verifican identidad e integridad local. No se ha validado criptográficamente PAdES ni el servicio CSV; tampoco se afirma sello de tiempo confiable externo. La descarga por HTTPS y la identificación BOE son evidencia de adquisición, no sustitutos de esos controles. No se ha renderizado ningún manual entero ni generado una captura ficticia desde Markdown.

## Decisiones, objeciones y coste explícito

- **Mantener el motor intacto.** El mejor experto objetaría corregir antes de contrarrevisión o romper silenciosamente el oracle. Motivo: preservar prueba reproducible y separar compatibilidad de exactitud legal. Coste: el error candidato sigue en el motor hasta que otro auditor lo confirme y exista prueba fallida.
- **Separar período mensual y anualización.** El experto rechazaría un único máximo anual que mezcle cambios o meses de alta. Motivo: la obligación se determina por períodos y conceptos. Coste: el futuro motor necesitará más entrada y el modo histórico conservará explícitamente su simplificación.
- **No legitimar 1,50 % AT/EP como tarifa universal.** El experto exigiría actividad, ocupación y vigencia. Motivo: las órdenes remiten a tarifas específicas. Coste: no se cierra la tarifa CNAE completa en esta entrega; solo puede conservarse como hipótesis declarada del perfil.
- **Publicar cifras analíticas sin llamarlas liquidaciones TGSS.** El experto objetaría redondear al final una suma anual sin conocer la regla por cuota/mes. Motivo: aislar el fallo del parámetro frente al de redondeo. Coste: los céntimos finales siguen pendientes del criterio TGSS y del caso mensual.
- **Conservar originales y citas, sin afirmar autenticación.** El experto archivista rechazaría equiparar SHA con firma. Motivo: los metadatos permiten repetir el contraste ahora. Coste: verificación PAdES/CSV y facsímiles seleccionados pendientes.
- **No ampliar RETA por analogía.** El experto rechazaría cotizar autónomos con fórmulas de nómina. Motivo: no hay régimen/entrada soportados. Coste: registrar no soporte en lugar de fabricar una cuota.

## Reproducción y límites

Scripts propios: `.cache/procedencia/seguridad-social/{adquirir,extras,extraer,tablas,casos,redactar}.py`. Adquisición: `nix shell nixpkgs#python3 -c python .cache/procedencia/seguridad-social/adquirir.py` y después `extras.py`. Ambos llaman al adquirente oficial del proyecto y respetan su bloqueo/ritmo. Ejemplos/Excel: `nix shell nixpkgs#python3 -c python .cache/procedencia/seguridad-social/casos.py`.

Para PyMuPDF se usó `uv run --python` con el Python de Nix y `--with pymupdf`, proporcionando `LD_LIBRARY_PATH` de `nixpkgs#stdenv.cc.cc.lib`.

La cobertura normativa no se confunde con haber descargado una orden. Permanecen pendientes los controles de vigencia señalados en `cobertura.json`, las tarifas completas y excepciones no representables, redondeo TGSS y contrarrevisión. Este informe no declara exhaustividad jurídica cerrada de todos los regímenes de Seguridad Social.

## Ampliación tras leer reformas y correcciones

La revisión de originales adicionales confirma que no basta con la primera tabla publicada. Se conservan **209 filas de tablas** (19 versiones × 11 grupos), incluidas versiones sustituidas, sin presentarlas como simultáneamente vigentes. La tabla de 2019 fue sustituida por BOE-A-2019-1932. Las tablas modificadas de 2023 y 2024 se corrigieron nuevamente mediante BOE-A-2023-8706 y BOE-A-2024-6627. Los mínimos finales del grupo 4 son respectivamente 1.260,00 y 1.323,00 €/mes. Las versiones anteriores están marcadas `superseded`.

La corrección BOE-A-2025-7292 cambia el mínimo por hora del artículo 38.3 de **7,97 a 8,32 €**. Es una limitación de soporte de jornada parcial del motor, no un número presente que deba sustituirse ciegamente. Las erratas de 2013, 2014 y 2015 revisadas afectan a encabezamientos, categorías o sistemas especiales y no alteran los tipos ordinarios del perfil ni su máximo mensual general.

El original de RDL 28/2018 y el de RDL 3/2026 sí documentan en su cuadro II el 1,50 % para personal en trabajos **exclusivos de oficina**, con definición de la ocupación. También muestran 3,60 % para limpieza. Por tanto, existe un perfil real posible para el supuesto en esos ejercicios, pero no una tasa empresarial universal: a 2.000 €/mes la diferencia en AT/EP sería 42 €/mes. Esta comprobación no se extrapola automáticamente a 2012–2018.

La base de 2026 **no es una proyección**: PJC/297/2026, publicada el 31 de marzo, desarrolla con efectos desde enero el máximo de 5.101,20 €/mes, equivalente a 61.214,40 € únicamente bajo doce meses mensuales completos. RDL 3/2026 es parte de su cadena normativa. El máximo del grupo diario es 170,04 €/día, que no autoriza convertir toda situación diaria en doce mensualidades.

Se han ejecutado aisladamente las dos funciones puras `obtener_parametros` y `calcular_nomina_agregada` del Python original mediante AST, sin imports ni `main`. `comparacion-python.json` conserva las 18 comparaciones de frontera con una réplica decimal de la aritmética leída en TypeScript y con las tasas legales separadas. No se ejecutó TypeScript en este análisis. La compatibilidad observada sigue siendo evidencia del oracle, nunca prueba normativa.

Se descargó también el compendio oficial TGSS de Noticias RED 2020–2024 (20 MB), buscando las tablas históricas y el criterio de redondeo. La búsqueda de su capa de texto no cerró las bases mínimas por grupo de 2020/enero–agosto de 2021. Se conserva el original y la limitación; los pasajes de redondeo para colectivos específicos no se generalizan. Poppler avisó de destinos de anotación defectuosos, no de pérdida del texto; no se renderizó el compendio.

La verificación propia detectó y retiró una celda máxima mal extraída del grupo 11 en la tabla sustituida BOE-A-2024-6218: había tomado una cifra del cuadro siguiente. Esa celda queda nula y con motivo; la corrección BOE-A-2024-6627 contiene la celda válida. Se conservan 209 filas y 417 celdas con cita, sin inventar la ausente.

## Recuento de entrega

35 originales (34 BOE y un compendio TGSS), 397 citas candidatas de bloques, 209 filas de tabla con 417 celdas citadas, 1.980 combinaciones mes/grupo y 18 casos de frontera comparados con Python. Los 108 hallazgos se distribuyen en 83 coincidencias condicionadas, 3 discrepancias, 16 ambigüedades y 6 reglas/capacidades ausentes. **Todos están pendientes de revisión independiente.** Los mínimos de 220 combinaciones mes/grupo permanecen sin cierre documental. No se añadieron pruebas al motor ni se aplicaron fixes.

Verificación técnica final: 35 originales con SHA-256/SHA-512 correctos, 397 citas reextraídas literalmente, 417 celdas cotejadas y esquema/referencias de 108 hallazgos sin incidencias. Resultado en `verificacion-tecnica.json`; no es la revisión adversarial requerida. Comando reproducible:

```sh
nix shell nixpkgs#python3 nixpkgs#stdenv.cc.cc.lib -c bash -c 'LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib" uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/seguridad-social/verificar.py'
```

Los metadatos publicables se filtraron de cabeceras de sesión y autorización, incluidas las fuentes embebidas. Los bytes PDF/HTML y sus hashes se conservaron. Los originales ocupan 98.343.761 bytes en la caché compartida; no forman parte de los archivos documentales versionables.
