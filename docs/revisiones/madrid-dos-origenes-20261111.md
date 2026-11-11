# Primera revisión B02 — revisión final con evidencia del padre

Estado: cerrada favorablemente para el alcance monetario y documental descrito, con reservas de soporte conservadas. Este cierre continúa la misma primera revisión B02 iniciada en GRANT0; no constituye una segunda revisión ni una ejecución nueva. Las tres objeciones iniciales quedan atendidas dentro de ese alcance. No certifica tipos, lint, CI global, publicación ni aceptación fiscal universal.

## Alcance y reservas

Madrid, artículo 4, liquidación individual ordinaria2025: dos eventos de un hijo cada uno, uno de2023 y otro de2024, nacimiento o adopción, mismo declarante, progenitores y convivencia del perfil soportado. No se revisan vivienda/art13, terceros, patrimonio, B08 ni core DT18. La verificación de hashes del paquete conjunto acredita identidad de bytes, no una auditoría de sus demás módulos o dependencias transitivas.

Se mantiene la independencia de orígenes y de los límites por ejercicio: si2023 excede y2024 cumple, sólo genera el origen2024; si ambos cumplen, se suman ambos una sola vez antes del consumo de cuota; si ambos exceden, se excluye. Se conserva expresamente `no_soportado` / `historia:2024:criterio_anualidad_intermedia` cuando un origen2023 válido encuentra exceso intermedio en2024. Este rechazo es una reserva de soporte: no se infiere recuperación, pérdida ni una regla del artículo13.

Los importes nominales por hijo y anualidad son721,70 euros, o360,85 con dos progenitores convivientes. Dos orígenes válidos generan1443,40 o721,70 respectivamente. Se verifican los censos por filiación: el adoptado en2024, aunque nacido en2020, no entra por ese vínculo en el censo2023. La economía se produce por ejercicio, no por origen ni mediante cuotas históricas externas. Se conserva el perfil de censos completos, unidad familiar conciliada y hechos ordinarios declarado por el motor.

## Evidencia aceptada y trazabilidad

Evidencia aportada y ejecutada por el padre, leída sin reejecutarla:

- Integración: `producto-historico2023-2024-integracion-20261111` bajo `/home/elies/Backups/IRoboPF/`.
- Instantánea final selectiva: `evidencia-producto-1372/post` y `MANIFIESTO.json`, SHA256 `d9dd9176f538dbb51a4ebb27f0bde3e08d8e4ab72f9494ffb9bb8a2bfbc76ee3`. Se verificaron62/62 hashes. No representa el árbol transitorio completo ni prueba por sí solo qué bytes ejecutó cada dependencia; se acepta como asociación documental del padre con la ejecución final.
- `producto-final-01/COMANDO.json`, `RESULTADO.json`, `supervision.json`, `salida.log` y `reporte.json`: ejecución final posterior a los deltas mecánicos,1372/1372 casos aprobados, cero fallidos y cero pendientes;29 archivos en el log y29 entradas de archivo en el reporte. El contador interno `numTotalTestSuites=38` del JSON no se interpreta como38 archivos.
- El comando y la supervisión coinciden; el SHA del supervisor declarado coincide con el archivo aportado. Consta entorno de herramientas Nix fijado, raíz del proyecto, un trabajador, timeout exterior905s, presupuesto del supervisor900s y timeout interior835s. Supervisión: salida0, sin razón de interrupción ni excepción, limpieza verificada y cero supervivientes. Esto se registra como evidencia de ejecución del padre, no como reproducción de workflows/CI por esta revisión.
- Dentro del total conjunto: `madrid-dos-origenes.test.ts`111/111, `revision-madrid-dos-origenes.test.ts`100/100 y `madrid-historia.test.ts`70/70. Se comprobaron individualmente los estados de sus281 aserciones. El resultado conjunto no amplía el dictamen a los otros módulos.

Corrección de recuento: la entrega inicial anunciaba116 casos independientes por un error manual. La matriz escrita contiene100:72 de cuota/residual,4 de límites/orígenes,2 de validación del origen sin derecho,1 de censo de adopción,16 de ambas API y5 de identidades/filiación adversas. El diff íntegro inicial/final no elimina tests ni reduce la matriz; no se retiraron16 casos para obtener el resultado.

## Cadena de correcciones y cierre de objeciones

1. Acceso a la salida canónica: aplicado el fix de esta revisión basado en `saldoEjercicio.cuotaInicial`. Ya no se exige `componentesCuota` a la API canónica. El archivo final conserva ese fix y los111 casos del autor pasan en la evidencia del padre. La suite independiente comprueba cada salida pública y el efecto en liquidación final.
2. Cuota escasa y consumo único: la evidencia incluye los100 casos independientes, con cuotas y residuales racionales, generado/aplicado/pendiente/disponible, una sola aplicación y ausencia de arrastre; incluye escasez exigida para uno y dos progenitores, ambas API y renombrado del declarante. Las comparaciones finales sin/con solicitud mantienen el descuento único: en la canónica, tolerancia máxima de un céntimo por la resta de totales presentados y misma caída en cuota líquida y diferencial; en la explícita, comparación exacta. El oráculo usa BigInt y no los helpers fiscales/aritméticos del candidato. La cuota anual disponible se observa del motor: no es un oráculo independiente de tarifas o mínimos generales.
3. Prioridad de validación: la instantánea de `docs/procedencia/API-MOTOR.md`, SHA256 `3f6e00474e4911280b507efb30b66e43804194b32e4641e6664d72679672b271`, aclara que, si no queda ningún origen válido, la exclusión de renta puede preceder a la comprobación de eventos. Cuando2024 sí es válido, la suite conserva el rechazo del evento contradictorio del origen2023 aunque éste no genere derecho. Se acepta esta delimitación documental sin modificar la prioridad cuando ambos quedan excluidos.

El rojo previo no se oculta: `madrid-murcia-pre-01` registra430/452, con22 fallidos. De éstos,16 pertenecían a la suite B02 del autor y4 a la independiente, todos en casos canónicos escasos; los otros2 quedan fuera de este dictamen. `madrid-murcia-fixtures-01` conserva pre/post y causa: se había reutilizado SS2203,20, correspondiente a bruto34000, en otros brutos. El autor ajustó24000×6,48%=1555,20 y renta20444,80; esta revisión calcula la SS sobre el bruto real `integro+2000` (20500 en el caso escaso). Se comprobó esta aritmética con Fraction stdlib. Son hechos conciliados del perfil canónico uniforme; no certifican cotizaciones reales ingresadas. No se cambian nominales ni expectativas de cuota para hacer pasar el caso.

Se verificó por SHA la cadena relevante desde las postimágenes de la primera entrega hasta la instantánea final:

- Suite del autor: `madrid-murcia-fixtures-01` → `lint-correccion-02` → `tipos-correccion-03` → final.
- Suite independiente: `madrid-murcia-fixtures-01` → `lint-correccion-02` → final.
- `madrid-historia.ts`: B02 → `tipos-correccion-03` → final. `auxiliares-anual.ts`, fixture y JSON de oráculos de B02 conservan exactamente sus hashes originales.

Los demás deltas B02 son mecánicos y se examinaron íntegros: renombrado JSON de identificadores completos en las fixtures presentes, sin afectar dinero ni claves de su contrato; `o.familiar===true` y guard de ejercicio; comprobaciones `Map.get(...)!==true`, equivalentes para los valores booleanos/ausencia que produce ese mapa. No se extrapola la equivalencia del renombrador a contratos futuros con claves iguales a IDs ni mapas encadenados. Se conservan las fronteras individuales/familiares, nominales, censos de adopción y reservas del origen intermedio. `producto-conjunto-02` aporta869 aprobados como antecedente; el dictamen se apoya en1372 finales posteriores, no sólo en ese antecedente.

## Fuentes y límites del cierre

Se mantienen las fuentes primarias temporales ya consultadas y preservadas con URL/SHA en `fuentes.json` de la entrega inicial: [Ley13/2023, texto original](https://www.boe.es/buscar/doc.php?id=BOE-A-2024-5610), artículo único.Seis/Veintidós y DF única; [Ley3/2023, texto original](https://www.boe.es/buscar/doc.php?id=BOE-A-2023-14346), artículo único.Tres/Once y DF única; y [manual AEAT2025 10.12.1](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/10-cumplimentacion-irpf-deducciones-autonomicas/10_12-comunidad-madrid/10_12_1-nacimiento-adopcion-hijos.html). Los consolidados informativos se fijaron a20231229,20241230 y20251229. Este cierre no introduce una interpretación normativa nueva.

La evidencia es suficiente para cerrar las objeciones B02 dentro del perfil soportado. Permanecen las reservas de acreditación documental, límites de soporte y oráculo de cuota observada descritas arriba. Tipos, lint, workflows/Nix completos, generados/inventario y CI remoto quedan a cargo exclusivo del padre; no se declaran superados ni se autoriza publicación desde esta revisión. Cualquier cambio posterior relevante queda fuera de los hashes aceptados.

No se ejecutó runtime fiscal, JS/TS/Bun, compilador, suites ni CI en este cierre: sólo lecturas y Python stdlib bajo timeout, sin modificar la raíz, crear worktrees, delegar, instalar, borrar o publicar. No se escribió código Effect nuevo; siguen documentadas las guías locales consultadas antes de los tests iniciales, sin ejecutar el CLI JS. El original GRANT0 y su parche/manifiesto permanecen intactos; este cierre se entrega como parche sólo documental con pre/post y manifiesto separado.
