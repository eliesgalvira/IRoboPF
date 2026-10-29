# Auditoría candidata de escalas autonómicas 2017–2021

Esta entrega cubre la lectura y el contraste fila a fila de las tablas del motor con los cinco manuales oficiales del ejercicio. **No cierra la auditoría normativa exhaustiva solicitada:** falta completar la cadena de originales y vigencias de cada territorio. Ningún hallazgo está aceptado. La reextracción mecánica de una cita no sustituye la revisión independiente.

## Resultados y alcance efectivo

Se examinaron los cinco módulos `lib/dominio/normativa/datos/irpf-autonomico-2017.ts` a `irpf-autonomico-2021.ts`, sus herencias desde `irpf-autonomico-2025.ts`, los resolutores anuales de `lib/dominio/irpf/comunidades/comunidad-autonoma.ts`, la integración por tramos de `lib/dominio/irpf/cuotas/escalas-gravamen.ts` y su selección en `lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts`.

Hay 90 entradas año-territorio: 85 reales (15 comunidades de régimen común y dos ciudades, durante cinco ejercicios) y cinco simuladas. No son 90 validaciones jurídicas. Los manuales contienen 85 tablas pertinentes: cada año una estatal, quince autonómicas y una común a Ceuta/Melilla. Se extrajeron 582 filas, 2.328 celdas con coordenadas y texto exacto. Melilla referencia expresamente la evidencia compartida con Ceuta, sin inventar una segunda tabla. `comparacion-filas.json` conserva todas las filas, los parámetros leídos del código y las diferencias; `cobertura.json` separa lectura, evidencia y pendientes.

Los 95 registros de `hallazgos.json` comprenden 90 contrastes de tabla y cuatro observaciones adicionales, más un registro explícito de cadena normativa pendiente. Hay 60 `match`, dos `mismatch`, 32 `ambiguous` y un `missing`. `match` significa coincidencia numérica candidata dentro del alcance explicado en cada registro; **no significa normativa íntegramente validada**. Las diferencias subcéntimo de cuota exacta se mantienen ambiguas incluso cuando coinciden las cuotas redondeadas.

## Discrepancias y ambigüedades concretas

1. **Madrid 2020, límite 53.407,29 frente a 53.407,20.** El motor introduce `53407.29` en el cuarto tramo. El original BOCM-20181228-1, PDF página 4, artículo único.Dos, publica 53.407,20 y ancho anterior 20.400,00. El manual AEAT 2020 contiene una inconsistencia: ancho 20.400,00 desde 33.007,20, pero comienzo del último tramo 53.407,29. No basta copiar una de esas columnas. La diferencia de límite es 0,09 EUR; la diferencia máxima de cuota integrada, manteniendo lo demás, es 0,00279 EUR: 0,09 × (0,21 − 0,179). Puede afectar al céntimo final según la base. Hace falta cerrar vigencia histórica del artículo y política de cuota acumulada antes de aceptar el arreglo.
2. **Rastro con ejercicio fijo 2025.** La explicación de comunidad autónoma en `liquidar-irpf-anual.ts`, símbolo `PasoExplicacion`/«Comunidad autónoma», dice que aplica su escala general «de 2025» aunque el caso sea de 2017–2021. La selección de tabla anual sí existe. El candidato afecta a trazabilidad, no demuestra uso aritmético de la tabla equivocada.
3. **Castilla y León 2020 y 2021: importes mal formados en AEAT.** Los PDF publican «18.207,20,00» y «53.407,20,00» (páginas 892 y 915 respectivamente). Las citas preservan esos textos. Para explorar el contraste se elimina el último `,00`, pero esa normalización está expresamente pendiente y no constituye prueba de valor. Debe prevalecer la norma original y su vigencia.
4. **Cuotas acumuladas frente a integración exacta.** Asturias, Canarias, Castilla y León, Cataluña, Galicia y Madrid muestran diferencias subcéntimo entre cuota publicada e integral de tramos. Ejemplos 2017: Asturias a 17.707,20, 1.875,864 frente a 1.875,86; Galicia a 20.200, 2.093,375 frente a 2.093,38; Madrid a 17.707,20, 1.771,5564 frente a 1.771,56. La igualdad tras redondear justo en el límite no prueba igualdad para todas las bases del tramo. Todas las diferencias y bases están enumeradas en JSON. No se propone redondear cada tramo sin respaldo legal.
5. **Canarias: columna «desde».** Publica 12.450,01, 17.707,21, etc.; el motor integra desde el extremo continuo anterior. La comparación de límites superiores descuenta explícitamente 0,01 en esas filas. No se debe confundir una convención para bases monetarias discretas con una instrucción automática de omitir un céntimo de base. Queda pendiente resolver esta interpretación contra el original.
6. **Andalucía 2019, puntuación del manual.** Una celda dice literalmente `18.90`; se interpreta como porcentaje 18,90, no 1.890. La cita conserva el punto. El BOJA original aporta una fuente adicional para este cambio.

## Ejercicios, variantes y herencias

2017 y 2018: se compararon por separado las diecisiete tablas de cada manual. No se extrapoló la comprobación de un año al otro. Cambios observados en 2018: Extremadura reduce el primer tipo de 10,5 a 9,5; Madrid de 9,5 a 9; La Rioja cambia tipos intermedios. Sus tablas completas están en el archivo de comparación.

2019: Andalucía inicia la transición anual; Canarias reduce los dos primeros tipos; Murcia cambia su escala progresivamente; La Rioja reduce el primer tipo. 2020: se incorporan cambios en Andalucía, Canarias, Cataluña, Murcia y La Rioja. 2021: Andalucía y Murcia continúan transición; Comunitat Valenciana introduce los tramos superiores de 140.000 y 175.000 y tipos 27,5 y 29,5. Se contrastó cada fila, no solo las novedades.

Castilla-La Mancha, Ceuta y Melilla heredan parámetros de 2025 en los cinco módulos; sus límites y tipos tienen evidencia independiente en cada manual histórico. Eso acredita coincidencia de tablas, no legitima el acoplamiento a un módulo futuro. La tabla estatal 2021 y simulada también heredan 2025; el manual 2021 confirma la tabla estatal, incluido 24,5% desde 300.000. No se ha validado 2026: el resolver leído solo admite simulada-estatal como caso técnico y rechaza territorios reales.

## Fallecimiento, base baja y fechas

Los resolutores 2017–2021 reciben solo comunidad: no pasan fecha de fallecimiento ni base general al selector de escala. Por ello no ejecutan variantes intranuales ni especiales por base baja. Las secciones de escalas de los cinco manuales examinadas no muestran otra tabla especial por base baja. **No se certifica su inexistencia jurídica** sin revisar todas las normas originales y disposiciones transitorias.

Sí se ha leído una regla temporal concreta: Madrid, Ley 6/2018, disposición final única (original BOCM, página 12), aplica los apartados IRPF a todos los períodos impositivos que finalicen durante 2018, pese a entrar en vigor el 31 de diciembre. Una rama que excluyese fallecidos antes del 31 de diciembre sería incorrecta para esta modificación. La Rioja, Ley 10/2017, transitoria tercera (BOE original página 41), da efectos desde 1 de enero de 2017 a artículos 31–33. Andalucía, Decreto-ley 1/2019, contiene tablas expresas para ejercicios 2019–2022 y entrada en vigor el día de publicación; la relación con períodos terminados antes debe revisarse independientemente.

No hay comparación de objetos `Date` dentro de los resolutores del intervalo: la fecha se descarta en la llamada. No tiene sentido dar un test de zona horaria de una comparación que aquí no se ejecuta. Los tests propuestos deben comprobar primero qué variantes legales hacen necesaria esa comparación.

## Territorios y legacy

`ComunidadAutonoma` incluye Ceuta y Melilla; ambos tienen escala y resolución anual 2017–2021. No se afirma que toda su liquidación territorial esté soportada: deducciones por rentas obtenidas allí son otro ámbito. Navarra y País Vasco no están en la unión de tipos ni disponen de tabla/resolver foral. Una entrada inválida forzada por fuera del tipo no demuestra soporte; requiere validación de frontera.

Se leyó `Calculo_Salario_IRPF.py` y se extrajo por AST únicamente `calcular_cuotas_por_tramo`, sin ejecutar generación del libro ni cargar pandas. La función recibe base y tramos, no comunidad. `perfiles-bordes.json` contiene 1.951 comparaciones independientes de base controlada (negativa, cero, 5.550, 23.900, 60.000, 300.001 y cada límite ±0,01). No son 1.951 tests del motor TypeScript, ni nóminas, ni liquidaciones con familias. Se aporta el oráculo aritmético para construir esos tests.

El Excel se leyó mediante ZIP/XML en streaming, únicamente `CONTROL_TRAMOS_IRPF`, filas 33–58: 26 filas documentadas con direcciones de celda en `legacy-celdas.json`. No se cargó el libro de 145 MiB en RAM. Sus tablas son conjuntas: 19/24/30/37/45 en 2017–2020 y 47% por encima de 300.000 en 2021. No prueban tarifas autonómicas.

La simulación ejecutada usa esa escala conjunta y asigna cero a cuota autonómica. En 2021, duplicar realmente la escala estatal daría 49% marginal por encima de 300.000, mientras el legacy ejecutado da 47%. La diferencia es contractual y explicativa: no debe arreglarse como si existiera una comunidad real «simulada-estatal».

## Decisiones, objeciones y coste asumido

- Un experto rechazaría declarar toda la normativa validada con un manual. Se entrega contraste numérico completo y cobertura normativa incompleta, separados. Coste: la aceptación sigue bloqueada para las cadenas legales pendientes; el tamaño del JSON no se usa para ocultarlo.
- Un experto rechazaría normalizar erratas silenciosamente. Se conservan las citas literales y se explicitan las interpretaciones exploratorias de Castilla y León, Canarias y Andalucía. Coste: más candidatos ambiguos y necesidad de releer facsímil/original.
- Un experto rechazaría usar Excel como autoridad legal. Se usa únicamente para caracterizar simulación y aritmética. Coste: las diferencias territoriales necesitan fuentes propias, aunque el legacy «pase».
- Un experto rechazaría un hash como autenticación de firma. Los hashes prueban integridad de los bytes recuperados por HTTPS; PAdES/CSV no se han validado. Coste: autenticidad archivística pendiente.
- Un experto rechazaría considerar una URL BOE con `p=20210101` como prueba de versión histórica sin inspeccionar respuesta. Se detectó que, si la fecha no coincide con una revisión disponible, BOE puede devolver el texto actual. Esas adquisiciones se consideran índices de versiones y modificaciones, nunca evidencia de valores antiguos. Coste: hay que pedir las revisiones exactas y revisar efectos, que pueden comenzar en el ejercicio siguiente.

## Reproducción y pendientes

Scripts propios en `.cache/procedencia/autonomicas-2017-2021/`: `adquirir.py`, `manuales.py`, `extraer.py`, `comparar.py`, `normas.py`, `norma_extraer.py`, `excel.py`, `perfiles.py`, `entrega.py`, `verificar.py`. Los primeros intentos de PyMuPDF fallaron por el Python genérico de uv en NixOS y por nombrar un scratch `inspect.py`; se resolvieron usando Python de Nix y renombrando el scratch. No afectan a los originales ni se ocultan como verificaciones correctas.

Comandos usados:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2017-2021/manuales.py
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2017-2021/comparar.py
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2017-2021/excel.py
nix shell nixpkgs#python3 -c python .cache/procedencia/autonomicas-2017-2021/perfiles.py
nix shell nixpkgs#python3 nixpkgs#stdenv.cc.cc.lib -c bash -c 'export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib"; uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/autonomicas-2017-2021/verificar.py'
```

La reextracción verificó 2.328 citas de cinco documentos: cero diferencias entre caja y texto almacenado, SHA-256 comprobados. No hubo builds, suite pesada, cambios del motor, commits, movimientos de bookmarks, PR ni instalaciones globales.

Pendiente concreto: originales y modificaciones de Aragón art.110-1; Asturias art.2; Balears art.1; Canarias art.18 bis y cambios 2019/2020; Cantabria art.1; Castilla-La Mancha art.13 bis; Castilla y León art.1; Cataluña Ley24/2010 y modificación2020; Extremadura textos2013/2018; Galicia art.4; Murcia art.2 y transitorias; Valenciana art.2 y modificación2021; escalas2017/2018 de Andalucía; cambios2018/2019/2020 de La Rioja; vigencias de Madrid anteriores2018 y continuidad hasta2021; artículo65 y DA32 LIRPF para Ceuta/Melilla. Hay índices BOE descargados, pero no se confunden con esa cadena completada. Falta también contrarrevisión, autenticación de firma, facsímiles recortados y pruebas fallidas del motor antes de cualquier fix.

El corpus de este lote conserva 23 adquisiciones: cinco PDF AEAT, tres PDF normativos originales, dos HTML AEAT y trece HTML BOE usados como índices. `documentos.json` registra el título y la versión realmente devuelta, y corrige la etiqueta scratch de Murcia. Hay además once citas de páginas de normas (2339 citas totales); sus cajas son páginas completas y requieren acotación antes de aceptación.
