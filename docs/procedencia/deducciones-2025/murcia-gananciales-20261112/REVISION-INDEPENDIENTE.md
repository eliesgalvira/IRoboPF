# B09 — Cierre de la primera revisión independiente de gananciales

Adición documental de2026-11-12 a la primera revisión de guardería murciana2025. No abre una segunda revisión ni modifica código, pruebas, oráculos o la recepción original. Actualiza el estado pendiente de ejecución del informe inicial con la evidencia supervisada del padre.

## Dictamen

**Favorable para la rama acotada revisada**, con las reservas siguientes. La evidencia recibida resuelve los pendientes de ejecución y consumo monetario planteados en la primera revisión: ambas API, ambos declarantes y ordenantes, mitad racional sin redondeo anticipado, máximo500 por persona/hijo, cuota pública positiva escasa y cero, y un único descuento monetario final. No queda una objeción material abierta de esta revisión para ese perfil.

El perfil comprende dos progenitores casados en gananciales, ambos con derecho regional producido para los mismos hijos, residencia murciana y declaraciones individuales estables, pagos del fondo común, sin ayudas ni concurrencia art81. El matrimonio no reemplaza la producción nominal del derecho; la base propia procede del anual y la ajena de su economía conciliada con el grafo. Un pago físico permanece entero y se atribuye internamente por mitad; el motor consume sólo la cuota del declarante.

La regla específica contrastada en la primera revisión se conserva: presunción de gasto de ambos en gananciales aunque ordene uno, reparto individual por mitad y máximo500 por persona. Las reservas de ayudas, art81, única persona elegible, conjunta, fallecimiento, cambios civiles o de régimen y otros vínculos son límites de este contrato, no nuevas condiciones legales universales ni incompatibilidades fiscales generales. Fuentes primarias de la revisión: [AEAT IRPF2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-region-murcia/gastos-guarderia.html) y [ATRM Renta2025](https://agenciatributaria.carm.es/renta).

## Evidencia conciliada

El sello recibido es `VALIDACION-FINAL.json`, SHA256 `1e020bdf885d78c0d10325b040ec890fc2536e1f1a101cbd54fe6f88bb488a09`, de la unión congelada `producto-gananciales-historico-integracion-20261112`, base `b9a76c7562473d89caf413ec7c8fd4481ad58a94`. Se contrastaron los hashes del sello, la imagen validada y resultados, registros y supervisión de las tres fases finales. Esta adición se basa en esos archivos, sin volver a ejecutar producto ni pruebas.

- `conjunto-02`:1465 pruebas aprobadas,0 fallidas, en26 archivos; la suite independiente B09 aporta228 y la del autor95. El campo agregado `numTotalTestSuites` del reportero vale41;26 es el número de archivos de `testResults`. Ambas suites B09 tienen todas sus aserciones aprobadas.
- `tipos-03`: exit0 del `typecheck`, con `tsc --noEmit` y la configuración adicional de herramientas; evidencia de tipos strict y Effect de la unión.
- `lint-02`: exit0; oxlint0 errores/0 avisos y ESLint0 errores/27 avisos existentes fuera de las dos suites B09. No se transforma ese resultado en “cero avisos globales”.
- Las fases conservan comando, entorno Nix explícito, timeout y supervisión de hijos. Los resultados finales declaran ausencia de supervivientes y la supervisión confirma limpieza verificada.
- `FRACCIONES.json` conserva salida exit0 de los dos scripts:36 filas independientes y18 del autor, ambas iguales a sus fixtures. Se cotejaron por bytes las fixtures y scripts con sus originales recibidos, además de comprobar los hashes de las salidas congeladas.

Los tres archivos de producto B09 en la imagen tienen exactamente los hashes de la recepción original: `auxiliares-anual.ts`=`effa909f94aac1dd6882740d5a77289199a5f94cfa9247bcaf6124ab3d1b1904`, `auxiliares-esquemas.ts`=`dfdd821e3c3be372b075deddd218c7b64eb4f6d81c76492e97af46424bb5eeae`, `murcia-gananciales.ts`=`dbe96b62e6a0cf661b5bca8bc2d4b2e3b93dc30f1db4825d884b4268bd918a7e`. La unión incluye trabajo histórico ajeno al objeto de este dictamen; su resultado conjunto acredita regresión en las pruebas ejecutadas, sin ampliar el alcance fiscal revisado aquí.

## Correcciones mecánicas de las pruebas

Se aceptan los deltas preservados en `tipos-correccion-01` y `lint-correccion-01`. Se cotejó la cadena original→preimagen de tipos→postimagen de tipos/preimagen de lint→postimagen de lint/imagen final, tanto para la suite independiente como para la del autor.

La corrección de tipos reemplaza mutaciones de colecciones readonly por arrays nuevos con los mismos elementos y orden final: altas de servicios/progenitores y reversión de orden. No cambia hechos fiscales, importes esperados, casos ni criterio de aceptación. La corrección de lint elimina la ampliación de tipo de residencia y usa `Object.assign` para conservar el dato adverso crudo; prepara los dos objetos de entrada y agrega art81 por asignación en vez de spreads vacíos. La suite del autor conserva los valores mediante expresiones condicionales equivalentes.

No se incorporó un decodificador ni una conversión que sanee entradas adversas antes del canal público. Todas las líneas de aserción `expect` de ambas suites permanecen idénticas por comparación textual con los originales. Por lectura de los deltas también se conservan los valores y órdenes de los datos. El hash de la suite independiente pasa de `430d6b912c7c681199d845b3127ab69473dd1dfaef8dc8b25385e9087bf27bc5` a `8de573ecef1a66cd82285eb24acf00631825b5ccddaf000cce8274386fc9f977` y finalmente a `92a8cb9e1e1aaf4cadcf84947ec45af2f95b6d18e8541c15d6984c9e35c167bb`. Los originales y los registros rojos de tipos/lint permanecen preservados; esta adición no los sustituye.

## Reservas que permanecen

El resultado respalda la exactitud y consumo monetario de los casos ensayados. La cuota pública escasa se comprueba sobre la cuota producida, con conservación algebraica de generado/aplicado/pendiente; no convierte la suite en un oráculo fiscal completo e independiente de salarios, cotizaciones y escalas. Los36 casos Fraction sí fijan generación y consumo con cuotas exactas3000/17.03/0 sin usar fórmulas de producción.

Los ids de movimientos y soportes son hechos declarados: su conciliación no certifica la autenticidad o exhaustividad documental. No se impone unicidad universal del texto del soporte ni se presume que cambiar un id pruebe otra transferencia física. El contrato no traslada gasto del inelegible ni permite inferir su derecho por sólo matrimonio.

Este cierre no es aceptación fiscal ni declaración de CI completo o publicación. El sello recibido declara `globalCI: Pendiente`. Antes de cualquier push siguen siendo obligatorios el workflow exacto con versiones y entorno Nix, inventario, archivos generados y comprobación remota conforme a AGENTS.md. No se cambia un workflow ni script con esta adición.

## Trazabilidad de esta adición

El paquete de cierre contiene únicamente esta alta documental, su parche y manifiesto con hashes de las evidencias leídas. Preserva intactos el informe inicial, la entrega original, producto y esperados por valor. Sólo se hicieron lecturas y comprobaciones stdlib ligeras bajo timeout; sin runtime de candidato/TS/JS/Bun, nuevas pruebas, tipos, lint, instalaciones, VCS mutante, publicación, worktrees, borrados o subagentes. Se mantiene al padre como pesado exclusivo y se libera el turno ligero al entregar.
