# Primera revisión independiente ligera del recuento de 60 comparaciones

Dictamen: **favorable acotado** para los datos y el texto candidatos de
`RECOMPARACION-2018-60.{md,json}` recibidos el 2026-11-05. No se identifica
defecto de publicación que altere el recuento ni infle la cobertura. No se
propone ni aplica reparación. El manifiesto de recepción sigue declarando
«primera revisión de recuento pendiente»: se conserva como original recibido.

Se revisó en lectura desde `/home/elies/Repos/IRoboPF`, sin VCS, worktree,
subdelegación, red, navegador, motor, API fiscal, PDF renderizado ni suites
pesadas. Sólo se escribieron los artefactos de esta entrega externa. No se
tocaron reservas CLAUDE/historiale16 ni se reabrió la revisión de fórmulas H18.

## Hallazgos reproducibles

- Las identidades publicadas son exactamente `seed20261104-0` a `-59`, una
  vez cada una, ligadas a la matriz original SHA-256
  `59d82988079fb1ffc9e4609cb56376c749586b2b02cdb319449087a132fcf2d2`.
  Coinciden los hechos y hashes de caso, recibos de captura, recibos de
  comparación, índices del lote, entradas enviadas y efectivas. Los hashes
  de entrada y entrada efectiva se validan por separado: el orden de claves
  del decodificador cambia su serialización aunque sus valores coincidan.
- El apéndice de 2018 contiene 120 filas cerradas: 60 `started` y 60 `done`,
  con 60 intentos nuevos distintos, sin errores. Cada inicio tiene su cierre
  con la misma identidad. No es un resumen de resultados antiguos. El log
  registra los 60 `DONE`, 26,172331617679447 segundos, cierre verdadero y
  guardia nula; la medición registra salida 0 y 26,280437503941357 segundos
  del supervisor. El texto redondea correctamente a 26,17 segundos.
- Recuento independiente de los 60 recibos y 14 casillas por recibo:
  **717 coincide-condicionada, 0 difiere, 3 oficial-ausente y 120
  mapeo-no-acreditado**, total 840. Se verifica la igualdad decimal sólo
  para importes presentes, y cada importe se enlaza con la validación SES
  de captura y la proyección monetaria del lote.
- Las 120 reservas corresponden a 0023/0414, con valor del motor `null`;
  quedan fuera de las coincidencias. Las tres ausencias son 0532, 0533 y
  0595 de `seed20261104-17`: SES ausente, `official:null`, motor `"0"`;
  la validación PDF conservada dice `"0.00"`. Se inspeccionan también los
  bytes SES descomprimidos con stdlib: no aparecen esas claves. No se
  convierten ausencias en cero ni en éxitos. «Ausencia oficial» en el
  informe se refiere aquí al dato SES consumido, no a ausencia simultánea
  en PDF y SES.
- Las 60 evaluaciones permanecen `condicionado`, con reservas explícitas,
  incluida `negativos-no-acreditados-por-silencio-SES`. El documento limita
  los hechos sintéticos y el perfil Madrid 2018. No suma los 28 testigos
  parciales ni pilotos, ni declara completadas las 2.020 entradas del año,
  otros años o territorios. Esta revisión no vuelve a certificar esos 28
  testigos ni los cuenta como nuevas observaciones.
- Se verifican por bytes/hash los catorce prefijos pre/post del journal.
  Sólo aumenta `2018/compare.jsonl` en 120 filas. Las siete capturas y los
  seis journals de comparación restantes son idénticos. El resultado rojo
  anterior conserva 688 coincidencias, 29 diferencias en nueve entradas,
  tres ausencias y 120 reservas; sus 60 recibos siguen en el prefijo antiguo.
- Los hashes del manifiesto público corresponden a los dos candidatos;
  el JSON público reproduce los datos privados retirando sólo las rutas
  locales de los recibos. Su `resultadoPrivadoSHA256` coincide con
  `86f3c230287a5cf2e1bd60d8d87b1ec09fb62009dc75431293e6b8e5f4ea58c3`.
- Los recibos enlazados y sus artefactos CAS se verifican por longitud y
  SHA-256, incluidos PDF/SES, lote, logs e identidad de motor; no se copia
  ni modifica el CAS. La captura piloto reutilizada de la semilla 9 usa
  `id=2018-salario-componentes` y `matrixId=seed20261104-9`: el vínculo se
  comprueba por `matrixId`, hechos y hash, sin exigir un ID nuevo al original.

## Motor y código realmente registrados

La identidad de motor del lote es
`5f49d4c2e30a9a8c8d3ed6dadb5cbdc05257a90c4638d506462d3055ede417e4`,
con base `218c23d6c7831350b3592e5335dde4445352a281` y `sourcesSha256`
`00922188d55397379c239a40d30b06d05190a22f201bf2eab73ed88961e527cc`.
Se recompone el orden del inventario JS para verificar ese hash, con 46.925
entradas registradas; se cotejan además 282 fuentes/configuraciones actuales
de la raíz contra dicho inventario. No se recorre ni reinstala node_modules.

Las 120 filas registran la misma identidad de código; se coteja cada archivo
de ese mapa con su hash actual, incluidos el operador privado y los módulos
`historical_batches.py`, `historical_core.py`, receipts, worker y engine.
La lectura del worker confirma que usa el engine privado con
`HIST_ENGINE_ROOT=str(ROOT)`; el engine importa la API desde esa raíz.
`env.sh` fija ambas raíces al repositorio; la medición registra la revisión
declarada. Esto respalda el vínculo entre el lote y las fuentes publicadas,
sin confundir la variable de revisión por sí sola con prueba de ejecución.

El cierre de lote conserva una identidad compacta `inventory`; la igualdad
original `before==after` es una precondición explícita de `close_batch` en
el código registrado, no dos inventarios separados que esta revisión vuelva
a obtener ejecutando el motor. Se conserva el transporte cuyo hash consta
en el mapa de código; no se reevalúa su anterior revisión independiente.

## Reproducción y límites

Comando desde cualquier directorio, Python stdlib del entorno Nix disponible:

```sh
timeout -k 5s 120s /nix/store/h3l4z7p6wny3phbckwwhy1i2g52pdnj4-python3-3.13.15/bin/python3 /home/elies/Backups/IRoboPF/historico-2018-revision-recuento60-20261105/verificar.py
```

Resultado final: **3.706 comprobaciones satisfactorias, cero fallos**.
`RESULTADOS.json` conserva cada comprobación, las 60 identidades y los hashes
relevantes. `FUENTES-ANTES.json` y `FUENTES-DESPUES.json` registran 869 fuentes
leídas con longitud y SHA-256; son iguales. El inventario cubre las fuentes
leídas, no pretende ser una fotografía completa de todo el repositorio/CAS.

No se ejecutaron CI, inventario, linters o controles monetarios ya revisados.
La afirmación de 31 comandos CI local y el enlace de CI remoto del documento
quedan fuera de esta revisión de datos; no se verificó la red ni se concede
autorización de push con este dictamen. La entrega sólo respalda el recuento
y la trazabilidad acotados: no declara nuevo éxito en ramas fiscales cuyos
hechos no están acreditados. Publicación e integración corresponden al padre
tras sus controles requeridos.

`entrega.patch` empaqueta únicamente estos artefactos de revisión como altas
en una carpeta vacía; no modifica ni propone sustituir datos de producción.
`MANIFIESTO.json` permite comprobar los bytes entregados. Turno ligero liberado.
