# Cadena normativa autonómica A — candidatos para contrarrevisión

Ámbito: Andalucía, Aragón, Asturias, Illes Balears, Canarias y Cantabria; ejercicios 2012–2026; fecha de corte 29 de octubre de 2026. Trabajo personal, sin subdelegación ni cambios del motor, VCS, informes ajenos, ESTADO o DECISIONES. **No hay hallazgos aceptados.**

La entrega reconstruye 31 grupos de vigencia de escala, con 90 enlaces anuales, y otros 90 enlaces de apoyo para mínimos. El grupo balear de 2015 contiene dos variantes temporales. No son 180 validaciones: mínimos requiere el contraste especializado, y quedan cuestiones de devengo y autenticación abiertas. `cadena-normativa.json` enlaza cada grupo con originales, hashes, artículos, tablas y citas. `historial-articulos.json` conserva las fechas reales de las versiones ofrecidas por BOE; no se pidieron fechas inventadas mediante `p=`.

## Secuencias reconstruidas

- **Andalucía:** art.15 quáter del texto refundido de 2009, introducido por DL1/2012 art.2.1 y Ley3/2012 art.2.2 (efectos1/1/2012); Ley1/2015 DF4.1 (efectos1/1/2016); refundición1/2018 art.17; DL1/2019 art.único.7 y DT3 con tablas expresas2019,2020,2021,2022; Ley5/2021 art.23; DL7/2022 art.1.1 y DF2, efectos1/1/2022. La tabla transitoria2022 de2019 no debe aplicarse automáticamente después de la nueva ley. El artículo23bis añadido por DL7/2022 aporta los mínimos desde2022.
- **Aragón:** art.110-1 del texto refundido1/2005; Ley3/2012 art.10.1 hace aplicable la tabla desde1/1/2012; Ley14/2014 art.1.1, desde2015; Ley10/2015 art.1.1 y DF2.2, desde2016; Ley8/2022 art.64.1, desde1/1/2022 con vigencia indefinida; Ley17/2023 art.64.1, desde1/1/2023 con vigencia indefinida. Las suspensiones que aparecen en el análisis de Ley10/2015 motivaron recuperar las leyes2016/2017/2018: no deben presumirse suspensiones de IRPF; la referencia examinada trata del impuesto medioambiental de transporte por cable.
- **Asturias:** Ley5/2010 art.2, aplicable desde el ejercicio2011, para2012; Ley3/2012 art.42 desde2013; refundición2/2014 art.2; Ley11/2014 art.39.1 desde2015; Ley3/2025 art.único.1 y DFúnica. Esta última entra en vigor3/12/2025 y crea también los artículos2bis a2quinquies de mínimos. No se considera demostrada una regla retroactiva para fallecidos anteriores solo porque el preámbulo mencione2025.
- **Illes Balears:** Ley6/2010 art.8 para períodos iniciados desde1/1/2011; refundición1/2014 art.1; Ley13/2014 DF2.1 para2015; Ley12/2015 DF2.1 y DF16.1 desde31/12/2015; Ley12/2023 DF2.1 desde1/1/2024. Los mínimos siguen el art.2: reforma de Ley13/2014 y ampliación por Ley11/2023 art.primero. Se obtuvo además DL4/2023, antecedente expresamente derogado por esa ley. La DFúnica de Ley11/2023 fija26/11/2023 y solo retrotrae determinados otros artículos: queda abierta la consecuencia para devengos anteriores.
- **Canarias:** art.18bis añadido por Ley11/2011; Ley4/2012 art.45.12 y DF9.2 desde1/1/2012; Ley11/2014 DF2.1 desde2015; Ley7/2018 DF8.2 para2019; Ley19/2019 DF7.6 para2020; DA4 del texto refundido, introducida por Ley7/2022 y modificada por DL1/2023, con escala explícita2022–2023; Ley5/2024 DF10.23, efectos1/1/2024 y vigencia indefinida; Ley9/2025 DF11.17, efectos1/1/2025 y vigencia indefinida. Esta última se publica en BOE el3/4/2026: la fecha de BOE no retrasa sus efectos fiscales a2026. La corrección BOE-A-2025-5521 cambia la denominación del nuevo artículo de mínimos de18ter a18quater, sin establecer por ello nuevos importes.
- **Cantabria:** art.1 del texto refundido62/2008; Ley11/2010 art.11.1 desde2011 para2012–2013; Ley10/2013 art.10.1 para2014; Ley7/2014 art.11.1 para2015; Ley6/2015 art.9.6 para2016–2023; Ley3/2023 art.3.1 y cláusula final desde1/1/2024. El historial recuperado no muestra una modificación posterior de este artículo.

Las referencias BOE/BOJA completas, las fechas de publicación que constan en las fichas y las URL ELI están en `documentos.json`. Se conserva el original PDF de las normas enlazadas, no el PDF de un consolidado actual. Cuando BOE aloja una reproducción autonómica, se conserva esa procedencia. No se ha descargado sistemáticamente una segunda copia regional de cada PDF BOE: la publicación autonómica se identifica en el texto y metadatos; no se presenta esa identificación como un segundo original adquirido.

## Qué aporta frente a las rondas AEAT

La tabla original asturiana de2013 publica **16.592,80** como resto desde53.407,20 hasta70.000. Eso permite resolver la transcripción ministerial anterior que mostraba36.592,80 sin atribuir el defecto al motor. Las cuotas fijas se conservan junto a los tipos: Asturias2015 publica1.875,86 desde17.707,20, mientras la integral exacta da1.875,864. La igualdad redondeada en el límite no garantiza igualdad al añadir el exceso.

La norma canaria de presupuestos2023 publicaba inicialmente cuotas sin céntimos (por ejemplo7.894). El DL1/2023 sustituye la tabla para2022–2023 con céntimos (7.894,39 desde55.276). Las dos publicaciones son parte de la cadena; no son dos alternativas elegibles por conveniencia. En2015/2019/2020 los originales conservan las bases «desde» terminadas en,01 o,21. No se ha inventado una regla de redondeo ni eliminado ese céntimo del literal legal. `filas-numericas-originales.json` compara la integral con la cuota de cada fila utilizando la base inferior publicada; expresamente no es ejecución del motor ni interpretación aceptada de esos intervalos.

En2026 el motor rechaza los seis territorios reales. Una ley de vigencia indefinida puede seguir siendo fuente en2026 sin que exista una tabla ejecutable2026. Por eso los enlaces a2026 son candidatos de persistencia sustentados en norma e historial, separados de la falta de modelo; no se copia una tabla2025 como supuesto técnico.

## Citas, seguridad y límites

`citas-candidatas.json` utiliza página PDF1-based, cajas en puntos desde esquina superior izquierda, texto literal extraído con PyMuPDF y hash del original. Son candidatos por bloques de páginas localizadas; algunos son contexto contiguo y requieren selección editorial final. No son recortes renderizados ni firma validada. Las tablas HTML oficiales se conservan completas en `tablas-originales-html.json`, con ordinal y contexto; **no se hacen pasar por facsímiles PDF**. Los pasajes temporales HTML son un índice de búsqueda y contienen también disposiciones ajenas al IRPF: deben leerse con el artículo concreto.

Se buscaron referencias de corrección en las fichas originales (`indice-correcciones.json`) y se adquirieron las correcciones pertinentes para revisión. El índice no demuestra por sí solo que una corrección afecte a la escala. No se certifica una búsqueda negativa universal de todos los boletines hasta la fecha de corte. La persistencia es una conclusión candidata contrastable, no una garantía archivística absoluta.

Quedan abiertos: interpretación de fallecimientos en Asturias2025, IllesBalears2023 y las reformas intranuales andaluzas; alcance preciso de todas las correcciones; cotejo visual final de continuaciones de tablas PDF; mínimos componente a componente y sus condiciones por el auditor especializado; validación PAdES/CSV; recortes facsimilares; prueba ejecutable fallida antes de cualquier cambio fiscal. El rechazo técnico de2026 no es una discrepancia numérica. No se han corrido builds ni suites legacy.

## Decisiones y objeciones explícitas

1. Usar originales más historial de artículo para la persistencia. Objeción experta: el índice puede omitir una corrección o una regla temporal externa. Motivo: enlaza cada cambio real y evita inferir quince años de una hoja actual. Coste aceptado: persistencia candidata y revisión de excepciones pendiente.
2. Deduplicar períodos iguales. Objeción: una misma tabla puede cambiar de fundamento jurídico. Motivo: el mapa conserva refundiciones y modificadoras además de valores. Coste: el revisor debe distinguir continuidad numérica de sucesión de normas.
3. Conservar cuotas y límites literales. Objeción: una fórmula ingenua sobre columnas desdeX.01 puede introducir discontinuidades artificiales. Motivo: no borrar lo que publica el legislador. Coste: los ejemplos independientes no autorizan un fix global ni una política de redondeo.
4. Facilitar mínimos sin repetir su auditoría. Objeción: la cuota final depende de esos mínimos. Motivo: reparto exclusivo y evitar conclusiones duplicadas. Coste: esta carpeta no acredita por sí sola liquidaciones familiares completas.
5. Hashes y HTTPS sin afirmar firma válida. Objeción: integridad no acredita autoría criptográfica. Motivo: preservar bytes originales verificables ahora. Coste: autenticación PAdES/CSV pendiente.
6. Entregar candidatos sin tocar cálculo. Objeción: todavía no hay regresión ejecutada que falle. Motivo: el contrato exige revisión independiente antes de corregir. Coste: el orquestador debe materializar las pruebas propuestas; cero hallazgos aceptados aquí.

## Reproducción

Scratch propio `.cache/procedencia/cadena-autonomica-a/`: `indices.py`, `cadena.py`, `ampliar.py`, `extra.py`, `correcciones.py`, `metadatos.py`, `tablas.py`, `numeros.py`, `mapa.py`, `pdf.py`, `entrega.py`, `verificar.py`. Las descargas importan `tools/procedencia/descargar.py`: lock común, User-Agent IRoboPF, pausa y originales por hash. No hay descargas propias paralelas. Se excluyen cabeceras de sesión de la publicación.

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/cadena-autonomica-a/tablas.py
nix shell nixpkgs#python3 -c python .cache/procedencia/cadena-autonomica-a/numeros.py
nix shell nixpkgs#python3 -c python .cache/procedencia/cadena-autonomica-a/entrega.py
nix shell nixpkgs#python3 nixpkgs#uv nixpkgs#stdenv.cc.cc.lib -c bash -c 'export LD_LIBRARY_PATH="$(nix eval --raw nixpkgs#stdenv.cc.cc.lib.outPath)/lib"; uv run --python "$(command -v python3)" --with pymupdf python .cache/procedencia/cadena-autonomica-a/verificar.py'
```

Se corrigió un identificador BOJA inicial que devolvió404; está registrado. Se interrumpió una extracción PDF propia para reutilizar TextPage y reducir trabajo repetido, y una expansión de enlaces demasiado amplia; no se alteraron originales. La reextracción mecánica no cuenta como contrarrevisión independiente. La entrega es documental; anti-slop no aplica a estos JSON/Markdown ni se escribió TypeScript.

## Conteo y comprobación de cierre

Corpus: 144 adquisiciones (68 PDF originales, 68 HTML originales, ocho índices). Incluye antecedentes y normas descartadas para este ámbito; no son144 reglas fiscales. La selección conserva1.071 citas candidatas. `citas-filas.json` registra301 filas localizadas,262 con bloque PDF candidato y39 pendientes por fragmentación o formato. Las celdas HTML tienen espacios normalizados; el texto PDF citado se conserva literalmente. El recálculo independiente admite273 filas; las tablas con formato ambiguo o celdas vacías se registran en `tablas-no-normalizadas.json`, sin transformarlas silenciosamente en números. En particular, `1.120.50` del original canario2019 no se convierte en112050 ni en1120,50 por conjetura.

Hallazgos:33 candidatos,31 ambiguos de alcance de cadena, un match acotado al resto asturiano2013–2014 y una ausencia de modelo territorial2026; cero aceptados. Las diez correcciones examinadas están en `correcciones-examinadas.json`: nueve no cambian las escalas investigadas en los pasajes leídos y la canaria2025 corrige la numeración del artículo de mínimos. Sus referencias se añaden a las variantes pertinentes. No se afirma que esto agote cualquier corrección no indexada.

El primer intento de verificación con TextPage falló por una referencia débil a una página PyMuPDF ya liberada. El script se corrigió para retener las páginas junto a sus TextPage; no se alteraron los textos ni cajas para ocultar discrepancias. El resultado efectivo de la nueva ejecución consta en `verificacion-local.json`.

Verificación local completada: **144 documentos y1.071 citas; cero diferencias de hash o reextracción literal y sin cabeceras de sesión publicadas**. No valida firmas ni interpretación fiscal. Se validó también la sintaxis de todos los JSON y la presencia de los campos obligatorios de los33 hallazgos. No se ejecutaron pruebas del motor.
