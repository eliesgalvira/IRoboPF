# Revisión independiente — deducciones autonómicas A

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Veredicto: **requiere cambios y continuación documental**. Fecha: 29/10/2026. Se emite decisión para los **191 IDs**, sin omisiones. Se confirma por lectura del evaluador y sondeo de cada código la clasificación de las **168 fichas: 111 manuales, 32 genéricas y 25 específicas parciales**. Se reproducen las salidas de los **19 casos** sobre código actual. Se ejecutan además cuatro contraejemplos propios. **No se ha completado la auditoría jurídica de todas las condiciones de las 168 fichas ni los contratos íntegros solicitados.** No se certifica fiscalidad por conteos, coincidencias ni autotests.

`revisiones.json` contiene estado anterior, decisión, motivo, acceptanceScope, fuentes utilizadas, localización actual y objeciones por ID. `cobertura-ids.json` demuestra igualdad de conjuntos, no suficiencia jurídica. Resultado: 119 accepted y 72 needs-evidence; cero rejected. De los 119, **111 aceptan exclusivamente ausencia de fórmula automática**, siete aceptan discrepancias puntuales bajo supuestos delimitados y uno el defecto de ámbito. Ninguna ficha fiscal completa está aprobada. La clasificación técnica de las otras 57 fichas también está comprobada, aunque su hallazgo integral queda needs-evidence.

## Hallazgos accionables

**P1 — contaminación territorial.** `components/liquidacion-irpf.tsx:571` conserva entradas en estado; `:597` solo anula el resultado para simulada-estatal; `:817` pasa el setter sin limpieza; `:1342` lo conecta directamente al selector; `:1407` actualiza por mezcla con el objeto anterior. El helper `lib/dominio/irpf/deducciones-autonomicas-aplicadas.ts:882` no recibe territorio y suma todas las comunidades. Repro: activar un nacido andaluz (200), cambiar a Aragón con las entradas persistentes; el llamador sigue produciendo 200. Confirmado por flujo de código y reproducción del llamador, **sin navegador ni prueba de montaje React**. La corrección requiere una regresión de interacción y un contrato de filtrado. La pantalla declara expresamente 2025: se descarta atribuirle un selector histórico observado; la falta de ejercicio es una limitación del helper reutilizable.

**P1 — nacimiento andaluz.** Helper `:885`. Repro múltiple: dos nacidos, municipio ordinario, un titular: 400 frente a 800. Repro reparto: un nacido, dos titulares con derecho: 200 frente a 100 para cada uno. La combinación de nacimiento y familia numerosa del caso del autor suma 400 donde no deben acumularse. Original modificador nuevo BOE-A-2026-945, pp. 79 y 93: artículo completo y efectos 1/1/2025. Esta proposición se contrasta con el original 2021 y manual; la página 79 se inspeccionó visualmente, sin tachados. Corregir después de prueba fallida con sujetos/evento/titulares representados. No reintroducir el límite de renta de 2021, suprimido por esta reforma.

**P1 — orden canario.** Helper `:987–1010`: un solo orden se utiliza para todos los nacidos y para el suplemento por discapacidad. Tercero total/primero con discapacidad: 1630 frente a 1130; nacidos tercero y cuarto: 1060 frente a 1326, con un titular y demás condiciones cumplidas. Original BOC Ley 9/2025, DF undécima pp. 149, 153–154: texto completo del art. 10 y efectos 1/1/2025. Modelar ambos órdenes y lista de hijos. La aceptación no extiende vigencia ni cifras a familia numerosa ni a otras fichas canarias.

**P1 — exclusiones catalanas.** Helper `:1087` produce 200 con base total menos mínimo de 30000,01 y `:1103` produce 200 para aportación de 1000 de socio temporal. Original DL 5/2025, art. 3.4 y 3.5, pp. 18–19; efectos 1/1/2025 expresos. Se acepta la exclusión en esos dos escenarios, no la fórmula integral ni el régimen completo de arrastre. Contrato debe distinguir origen del préstamo, condición/acreditación, bases, duración y clase de socio. Intereses y viudedad quedan candidatos por cadena pendiente.

**P1 candidatos restantes.** Dependencia aragonesa, prorrata de tercer hijo, familia numerosa canaria, los tres casos cántabros, los dos asturianos, incompatibilidad castellano-manchega, intereses/viudedad catalanes y base monoparental andaluza mantienen la expectativa jurídica pendiente. Su salida está reproducida; no confundir ese hecho con aceptación del importe esperado. Los originales adicionales y contratos parciales estrechan las lagunas. `contratos-prioritarios.md` explica lo comprobado y qué bloquea cada aceptación.

**P2 — consignación y operaciones parciales.** Las 111 fichas manuales aceptan el importe externo (sondeo individual 987654); la UI muestra «Importe calculado» y una declaración de cumplimiento. Esto puede ser una función profesional legítima. Se confirma falta de fórmula automática, **no que la UI o el producto prometan siempre verificar requisitos**, ni que consignar un importe esté prohibido. Las 32 genéricas usan porcentaje/tope o importe por unidades; las 25 parciales omiten dimensiones legales. `Math.max(1, unidades)` en `:859` impide representar una prorrata y transforma cero en uno. La solución exige sujeto y reparto, no contadores fraccionarios. Los campos `:cumple` no son validación externa demostrada. Las ramas específicas se suman fuera de su control genérico: comprobar comportamiento de cada productor al diseñar la corrección.

## Evidencia independiente y avances de vigencia

Los informes y JSON de la entrega se usaron como **lista de candidatos**, sin atribuirles autoridad probatoria. Se abrieron originales desde CAS, se comprobaron 41 hashes y se reextrajeron los 4415 selectores PDF de los cuatro archivos: cero diferencias. `integridad-extraccion.json` registra cada comprobación. Los dos HTML genéricos de Castilla y León siguen sin ser articulado: comprobar su hash no revoca su rechazo documental.

Se adquirieron **siete originales adicionales** mediante el descargador autorizado, en CAS propio, con su lock de máquina, User-Agent y ritmo: reforma andaluza Ley 8/2025; Ley cántabra 3/2024; originales HTML aragoneses Leyes 13/2005 y 12/2010; BOC original Ley cántabra 3/2023; consolidado asturiano posterior; original Ley asturiana 5/2025. El consolidado adicional es documento de contraste, no disposición original. `documentos-adicionales.json` conserva adquisición, hash y alcance de autenticidad sin validar; no se ha validado PAdES/CSV.

Andalucía: original modificador BOJA publicado 31/12/2025, reproducido BOE 16/1/2026, DF 18.b efectos 1/1/2025. Canarias: original BOC 29/12/2025, DF undécima efectos 1/1/2025. Catalunya: decreto publicado DOGC 26/3/2025, BOE 24/5/2025; original p. 31 señala convalidación DOGC 14/5/2025. Estas publicaciones posteriores no justifican inferir alcance desde el año del presupuesto.

Cantabria: las sustituciones completas de alquiler, cuidado y nacimiento están en Ley **3/2023**, art. 3, BOC pp. 23–25; descargar solo Ley 3/2024 no cerraba ese origen. Asturias: celiaquía nace en art. 39.17 Ley 5/2025; original BOE 9/2/2026, pp. 33 y 43. La DF tercera exceptúa su entrada en vigor general de 2026; exige comprobar publicación BOPA y devengos anteriores, sin inferir aplicación anual indiscriminada. El HTML asturiano anterior no contiene celiaquía. Aragón: se enlazan introducción en 2005, renumeración en 2010 y reforma de base en 2014; sigue pendiente régimen diferenciado.

`citas-refinadas.json` separa líneas de páginas prioritarias con hash, texto exacto y cajas reales. **No son 168 contratos completos ni celdas de todas las tablas**. Hay líneas de contexto ajenas al precepto; solo se usan las páginas y proposiciones expresamente delimitadas. No se inventan cajas para HTML. Las páginas visualmente inspeccionadas son BOE-A-2026-945 p. 79 y AEAT p. 124; el resto tiene extracción de texto, no inspección visual exhaustiva de tachados/tablas. En Asturias el manual presenta tensión entre inclusión y exclusión de gastos repercutidos para precio de alquiler: falta resolverla, no elegir silenciosamente una versión.

## Objeciones expertas revisadas

- Consignación profesional: objeción válida; se reduce la aceptación al modo de ejecución, sin desacreditar una entrada manual explícita.
- Porcentaje correcto: insuficiente; no elimina prorratas, límites conjuntos, identidad ni incompatibilidades. Las fichas parciales quedan pendientes.
- Edición actual frente a antigua: hashes diferentes no son corrupción. Se mantiene el original de 635 páginas y sus selectores; no se aplica desplazamiento fijo a la versión antigua.
- Los casos propios fijan expectativas para regresiones previas a la corrección.
- Extracción por bloques: verifica texto, no cada condición. Se añaden líneas prioritarias; faltan facsímiles finales, celdas y revisión visual completa.
- Exhaustividad: 191 decisiones no equivalen a revisión jurídica exhaustiva. El encargo de cerrar todos los contratos sigue sin satisfacer; se deja explícito en cada aceptación limitada y en los 72 pendientes.

No se usa el inventario/corpus candidato como autoridad. No se usa Python/Excel de terceros como norma ni se carga el Excel. No se ejecutan build, suite legacy ni tests mantenidos. No hay código Effect nuevo ni patrones nuevos que consultar.

## Ejecución y límites

`ejecucion.json`: 168 sondeos y 19 reproducciones reales. `casos-independientes.json`: cuatro ejecuciones adicionales con perfil, entrada del helper, esperado y observado. Las condiciones que el helper no admite están en el perfil; **no se afirma haber ejecutado un motor fiscal completo que las consuma**. Comandos reproducibles:

```sh
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-deducciones-autonomicas-a/sondeo.ts
nix shell nixpkgs#bun -c bun .cache/procedencia/revision-deducciones-autonomicas-a/contrapruebas.ts
nix shell --expr 'let pkgs = import (builtins.getFlake "nixpkgs").outPath {}; in pkgs.python3.withPackages (ps: [ps.pymupdf])' --impure -c python .cache/procedencia/revision-deducciones-autonomicas-a/originales.py
```

Se comprobó memoria y se trabajó secuencialmente, con un worker. `snapshot-codigo.json` fija archivos actuales; las líneas son las del checkout con lint integrado. Los cambios de Madrid 2020 y explicación comunitaria no se atribuyen a este ámbito. No se ha modificado VCS, motor, hallazgos del autor, ESTADO ni DECISIONES. Escrituras limitadas a revisión y scratch propios. No se incluyen cabeceras de sesión.

Siguiente trabajo necesario: cerrar contratos/remisiones por los 57 cálculos parciales/genéricos y las 111 consignaciones si se quieren automatizar; finalizar cadenas pendientes, publicación BOPA y vigencia intranual; comprobar todas las tablas/tachados; completar pruebas con perfiles jurídicos; montar regresión UI de cambio de territorio. La entrega permite priorizar correcciones puntuales, no declarar auditado todo el dominio.
