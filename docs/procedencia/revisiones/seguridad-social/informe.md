# Revisión independiente de Seguridad Social

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Dictamen: **requiere cambios y evidencia adicional**. Se emite decisión para los **108 IDs**, sin omisiones: **25 accepted, 83 needs-evidence, 0 rejected**. Accepted significa aceptación de la proposición expresamente delimitada en `acceptanceScope`, principalmente un defecto o una carencia; no son 25 reglas fiscales certificadas. Los 83 match candidatos no se convierten en aceptación jurídica por coincidencia numérica.

Corte: 29 de octubre de 2026. `estado-auditado.json` fija los hashes del código examinado, posterior a lint. Los cambios de Madrid y del texto del ejercicio no afectan a los defectos SS de esa versión. Una diferencia respecto de una huella anterior no acredita por sí sola corrupción.

## Defectos que debe resolver el orquestador

### P1 — SS-BASE-2018: máximo intranual, no sustitución de una constante

`lib/dominio/normativa/datos/seguridad-social-2012-2026.ts:13` conserva 45.014,40. `lib/dominio/laboral/cotizaciones-sociales.ts:179` aplica `min(brutoAnual, máximoAnual)`.

La Orden ESS/55/2018, art. 2, fija inicialmente 3.751,20 €/mes. Ley 6/2018, art. 130, PDF físico p.168, fija 3.803,70 desde el primer día del mes siguiente a la entrada en vigor; DF46 dispone entrada al día siguiente de publicación. Publicación: 4 de julio de 2018; cambio: agosto. Se ha leído el original, no un consolidado. Contraprueba independiente: anexo económico TGSS 2018 y tabla histórica TGSS 2023, p.19, distinguen 01-01-18 y 01-08-18. Los originales y páginas están en `documentos-adicionales.json` y `citas-contexto.json`.

Reproducciones ejecutadas contra TypeScript real:

- Salario 50.000, doce mensualidades uniformes con prorrata incluida: base actual 45.014,40; suma mensual esperada 45.276,90. Con los tipos del perfil, empresa actual 14.134,5216 frente a 14.216,9466 analíticos; trabajador 2.858,4144 frente a 2.875,08315.
- Salario 45.240, es decir 3.770 €/mes: base actual 45.014,40; esperada **45.108,40** (= 7 × 3.751,20 + 5 × 3.770). Cambiar exclusivamente la constante a 45.276,90 produciría 45.240: seguiría mal.

Descartado aplicar 3.803,70 × 12: anticiparía el cambio cinco meses antes. Estos ejemplos no certifican cuotas ingresables al céntimo: aíslan base y aritmética antes de redondeo por concepto/mes. No extienden la regla a artistas ni a remuneración diaria.

### P1 — SS-SOLIDARIDAD-REPARTO-2025 y 2026

`cotizaciones-sociales.ts:226` reparte total × 5/6 y total /6. El art.17 de las órdenes originales publica tipos por pagador y tramo:

| Ejercicio | Empresa, % | Trabajador, % | Total, % |
|---|---|---|---|
| 2025 | 0,77; 0,83; 0,98 | 0,15; 0,17; 0,19 | 0,92; 1; 1,17 |
| 2026 | 0,96; 1,04; 1,22 | 0,19; 0,21; 0,24 | 1,15; 1,25; 1,46 |

Fuentes originales: BOE-A-2025-3780, pp.16–17; BOE-A-2026-7296, p.16. RDL 2/2023 y RD 322/2024 aportan contexto legal y devengo mensual; la segunda norma se adquirió independientemente con el helper. La aceptación aquí es la contradicción entre el reparto ejecutado y estos preceptos, no el cierre de toda la regulación del ejercicio.

A 5.400,45 €/mes en 2025 (64.805,40 anuales), solidaridad anual analítica empresa 45,36378 y trabajador 8,83710. TS produce 45,16740 y 9,03348. Ambos pagadores fallan; el total coincide. A 5.611,32 €/mes en 2026, empresa esperada 58,765824 y trabajador 11,630736; TS devuelve 58,6638 y 11,73276.

Descartado sustituir 5/6 por 23,60/28,30: no reproduce exactamente los tipos separados publicados. Descartado comprobar solo suma o un salario alto, porque las diferencias de tramos pueden compensarse. El céntimo que inicia el tramo no se resta de nuevo del exceso.

### P1 de integración — los defectos llegan al modo denominado canónico

Lectura y ejecución, no solo búsqueda de nombres:

- `lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts:24` usa `calcularCotizacionesSocialesLegacy` para deducir cotización del trabajador del rendimiento íntegro.
- `lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts:256` calcula el desglose con ese mismo rendimiento anual; líneas 575 y siguientes liquidan los totales a céntimos.
- Líneas 790 y 795 explican 5/6 y 1/6 en el rastro.

Se ejecutaron tres liquidaciones con `{modo: "canonico"}`: 2018/50.000 €, 2025/64.805,40 € y 2026/67.335,84 €. `ejecucion-anual.json` conserva los resultados y rastros completos. En 2025 devuelve solidaridad empresa 4.517 céntimos y trabajador 903; no es solamente una etiqueta errónea. La cotización afecta también al rendimiento neto y a la base del IRPF. No se certifica aquí la corrección del resto de la liquidación.

### P2 — contrato insuficiente y citas demasiado amplias

Los 15 IDs AT/EP se aceptan como limitación de soporte: empresa 1,50 % fijo, sin CNAE ni ocupación. No se acepta retrospectivamente esa tarifa para cualquier trabajador. Los cuadros de oficina exclusiva se han leído, pero SS-ATEP-PERFIL-OFICINA sigue needs-evidence como regla fiscal completa.

Se aceptan las carencias de mínimos, modalidad contractual, horas extra, jornada parcial, periodicidad, RETA y enlace documental. La entrada SS solo contiene año y salario. La existencia del tipo `cotizacion_social` no acredita vínculos por medida en estos resultados. Tampoco se propone añadir un mínimo anual único: podría sobrecotizar contratos parciales o altas incompletas.

Las citas seleccionadas por el autor no siempre prueban el ID: SS-TIPO-DESEMPLEO-2022/2023 apunta a bases mínimas; 2024 incluye tipos agrarios; SS-BASE-2024/2025/2026 selecciona preámbulos. FOGASA incluye pasajes del 0,10 % agrario que no contradicen el 0,20 % ordinario. La Ley de 2018 incluye una cita ajena sobre revisión de pensiones. **Un selector que reproduce texto no garantiza pertinencia.** Se conservan las referencias originales para trazabilidad y páginas de contexto propias; no se actualizan los candidatos del autor.

## Tablas, versiones y las 220 combinaciones pendientes

Se reabrieron y comprobaron por SHA-256/SHA-512 los 35 originales del autor. Se reextrajeron las 397 citas y las 417 celdas de las 209 filas/19 versiones. Se inspeccionaron visualmente los originales de las correcciones de 2019, 2023, 2024 y 2025, además de la tabla TGSS histórica. No se observan tachados que permitan ignorar las sustituciones expresas. Las imágenes inspeccionadas permanecen en scratch.

Las 397 citas y 209 filas reproducen el texto con `get_textbox(textpage)`, el método del autor. Una primera extracción independiente con `get_text(clip)` difiere en 294 citas y diez filas por espacios, tabulaciones y glifos de borde. Esa objeción queda **descartada como corrupción o cifra incorrecta**: se conservan ambos resultados y la explicación en `comprobacion-originales.json`. `citas-refinadas.json` declara expresamente el método alternativo. No confundirlo con una prueba de inexistencia del texto original.

Versiones relevantes contrastadas personalmente:

- 2019: BOE-A-2019-1932 sustituye el cuadro del art.3. Grupo 1: 1.466,40, no 1.466,10.
- 2023: orden inicial, PCM/313/2023 y BOE-A-2023-8706. La corrección sustituye el cuadro: grupo 4, 1.260,00 €/mes.
- 2024: orden inicial, PJC/281/2024 y BOE-A-2024-6627. Grupo 4, 1.323,00 €/mes. La celda máxima del grupo 11 de la tabla sustituida sigue sin transcripción en el candidato; no se inventa. La corrección contiene 157,35 €/día.
- 2025: BOE-A-2025-7292, publicada 11/04/2025, corrige exclusivamente el mínimo del art.38.3 a 8,32 €/hora desde enero. No equivale a toda la tabla horaria por grupos.
- 2026: PJC/297/2026 se publicó realmente el **31/03/2026** y refiere efectos desde enero. RDL3/2026 es original de 04/02/2026. No es lícito calificar estos datos de proyección, ni declarar por ello cerrado todo 2026.

Se recuperó el anexo TGSS 2023 (`5bbb040eba597b85acb1da0e3f26085334ea05b6644f11d38336e33be37ffdde`), página física 19: para 2020 y enero–agosto 2021 presenta grupos 1–3: 1.548,00; 1.283,40; 1.116,60 €/mes, grupos 4–7: 1.108,50 €/mes y grupos 8–11: 36,95 €/día. Máximos 4.070,10 €/mes y 135,67 €/día. **Las 220 combinaciones tienen ahora una tabla TGSS identificada**, conservada individualmente en `minimos-220.json`.

No se aceptan todavía como norma cerrada: falta reconstruir la derivación legal desde SMI y base previa y su política de redondeo. La búsqueda encontró una guía ministerial histórica con 1.466,10 para 2020/2021, incompatible con la tabla TGSS; no se usa esa guía como autoridad. La copia Congreso del anexo devolvió HTTPError al adquirente; se obtuvo la copia oficial TGSS. No se oculta esa contradicción bajo una cifra de cobertura.

## Contrato canónico propuesto y separación del oracle

Este es un criterio de diseño revisable, **no autorización de implementación ni contrato jurídico completamente certificado**:

1. Entrada por trabajador, relación laboral y mes/tramo de alta: fechas, grupo, modalidad de cotización mensual/diaria, jornada y horas, contrato y transformaciones, CNAE/ocupación con condiciones, situaciones especiales y conceptos retributivos con período de devengo. No inferir estos datos de un salario anual.
2. Versiones normativas con fecha de publicación, efectos, sustitución y ámbito. Selección por mes/tramo; regla explícita para retroactividad y rectificaciones. Para 2018 se ejecutan ambos períodos.
3. Separar base CC, profesional, horas extra y retribución relevante para solidaridad. Incorporar prorratas antes de límites; no compensar un mes contra otro. Mínimos y topes necesitan grupo, jornada y días.
4. Tipos por concepto y pagador, incluidas las tres parejas de solidaridad publicadas; MEI sobre base CC y con elegibilidad. AT/EP depende de actividad/ocupación. No usar reparto universal del total.
5. Política de redondeo versionada con cita TGSS, unidad de aplicación (tramo/mes/concepto/pagador) y acumulación documentada. Mientras no esté cerrada, distinguir resultado analítico y cuota liquidada; no anunciar una nómina legal al céntimo.
6. Resultado anual como suma de los períodos; conservar bases, cuotas, redondeos, normas, citas y supuestos por paso. Para IRPF admitir cotizaciones efectivamente soportadas acreditadas, sin recalcularlas silenciosamente desde una suma anual de rendimientos.
7. Oracle separado: conservar compatibilidad Python/Excel bajo un modo explícito `legacy` con huella de datos y supuestos. Una diferencia con el oracle es una observación de compatibilidad, no motivo para alterar una regla canónica demostrada. El modo canónico debe rechazar o declarar no soportadas las entradas insuficientes; no caer silenciosamente en legacy. Versionar la migración para no cambiar análisis históricos sin aviso.

Se buscó el redondeo en el compendio RED 2020–2024 y se descargó el manual SLD de especificaciones técnicas. Los pasajes encontrados sobre tiempo parcial concentrado o bonificaciones no prueban el redondeo general de cuotas. No se generaliza ningún colectivo especial ni la regla del euro de otro tributo. Este punto continúa abierto.

## Ejecución, cobertura y reproducción

`ejecucion-typescript.json`: **38 llamadas al módulo real**, no una réplica TS: los 18 ejemplos del autor, 18 casos con mensualidad representable al céntimo, y dos casos de 2018. `pruebas-rojas.json`: **78 comparaciones de salidas contra expectativas Decimal independientes, 62 fallidas y 16 correctas**. Son comparaciones, no 62 defectos distintos. La tolerancia 1e-12 solo absorbe precisión decimal; no redondea a céntimos para ocultar diferencias. El comparador terminó con código 1. `ejecucion-anual.json`: tres ejecuciones adicionales del servicio anual y sus rastros.

Los 18 ejemplos del autor se conservaron completos como entradas, pero sus expectativas no se usaron como oracle normativo: se recalcularon por intersección de intervalos y tipos separados. Las pruebas rojas incluyen ambos pagadores y B, 1,1B y 1,5B ±0,01 **mensual**. Los valores anuales del autor siguen siendo pruebas analíticas, no mensualidades ingresables.

Desde la raíz, con un worker:

```sh
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-seguridad-social/ejecutar.ts
nix shell nixpkgs#python3 -c python .cache/procedencia/revision-seguridad-social/comparar.py
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-seguridad-social/anual.ts
```

Los scripts propios se mantienen exclusivamente en scratch. Los JSON conservan entradas, resultados y expectativas para regresiones previas a la corrección. No se añadieron tests al motor, ni se ejecutó Next build o la suite legacy. Se consultaron `effect-solutions list/show basics testing` mediante su JS con Bun y la fuente local v4 para el arnés anual. El intento de lint de los dos scripts de scratch no seleccionó archivos por la exclusión `.cache`; **no se declara lint aprobado** para ellos. No se instaló nada globalmente ni se modificó node_modules del proyecto.

`revisiones.json` conserva decisión, estado previo, alcance, objeciones y evidencia individual; `cobertura.json` lista los 108 IDs esperados y revisados. La comprobación de hashes/celdas no es certificación fiscal. Las cadenas completas de los 83 match, convalidaciones y reformas incidentales no examinadas siguen pendientes; los índices HTML BOE se verificaron por hash y se leyeron como localizadores, no como sustitutos de disposiciones originales. Tampoco se validaron firmas PAdES ni CSV. Los originales descargados se adquirieron con `tools/procedencia/descargar.py`, UA identificable, bloqueo y ritmo, en CAS propio; los originales previos solo se leyeron y verificaron.
