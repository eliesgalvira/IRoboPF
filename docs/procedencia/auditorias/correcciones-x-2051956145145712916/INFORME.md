# Correcciones públicas de X: evidencia y continuación de fixes

Base comprobada: `b6339967dec543d78cd69f7f56a04870c3ac9b07`. Trabajo personal en el checkout `t3-b2fda12c`, sin subdelegación ni operaciones VCS mutantes. No se modifica motor, registro, fichas, ESTADO, DECISIONES, originales ni trabajo de la ronda 11.

Validación terminada: dos pruebas focalizadas correctas; lint (16 reglas anti-slop a error y ESLint), tipos principal/vendor y Ruff correctos. Se conservan 6.006 archivos de la base, cero ausencias.

La referencia de origen es un divulgador en X (referencia privada). Sus publicaciones no se reproducen en esta copia pública.

## Resultado y límites de la investigación

Diez afirmaciones separadas en `hallazgos.json` y `correcciones/CX-01.md` a `CX-10.md`. CX-02 identifica el reparto histórico de solidaridad que ya fue corregido en el perfil canónico. La decisión independiente precisa es `SS-SOLIDARIDAD-REPARTO-2025`, en `docs/procedencia/revisiones/seguridad-social/revisiones.json`; su aceptación se limita al reparto, no a la liquidación TGSS anual. D018 y `correcciones/trabajo-y-cotizaciones.md` explican el fix anterior. Se entrega una regresión positiva nueva para el salario de 132.500 euros y una reproducción del comportamiento legacy. No se presenta como rojo nuevo ni como revisión independiente de aquella aceptación.

Las otras nueve afirmaciones permanecen indeterminadas como correcciones fiscales concretas. Se conservan coincidencias aritméticas, las entradas ausentes y los lugares precisos que debe investigar el siguiente implementador. No se ha demostrado aquí un defecto fiscal presente con entradas completas y evidencia suficiente para exigir un fix numérico. No se inventan entradas ni un rojo para cumplir formalmente la entrega. Esto deja **incompleta la fase de correcciones nuevas** del mandato; el mapa siguiente es el trabajo restante y no una declaración de cierre.

## Mapa de continuación

1. CX-01/CX-03: contrato mensual de cotización. Archivo `lib/dominio/laboral/cotizaciones-perfil-uniforme.ts`, conexión en `liquidacion/liquidar-irpf-anual.ts`. Obtener instrucción TGSS primaria sobre precisión de bases y redondeo por concepto/tramo; fijar remuneraciones mensuales, días, grupo y contrato. Recalcular fuera del motor, escribir rojo del contrato mensual y revisar antes de aplicar. El perfil actual declara `redondeoTgss: pendiente`; no redefinirlo silenciosamente. El cálculo condicional por fracción mensual produce 673,44/132,84; la salida analítica es 673,42246/132,74372. Ninguno sustituye por sí solo una liquidación TGSS acreditada.
2. CX-04/CX-06: escalas estatal/autonómica y mínimos. Archivos `cuotas/escalas-gravamen.ts`, `liquidacion/liquidar-irpf-anual.ts`, `minimos/minimo-descendientes.ts`. El caso carece de precisión interna y hechos familiares completos. Verificar reglas de casillas, orden de minoración y reparto con AEAT; no usar «par» como teorema sobre euros enteros. El modo simulado no es una comunidad autónoma real. Test rojo únicamente al disponer del caso exacto.
3. CX-05/CX-10: retención versus liquidación. Conservar separados modelo 145, art. 85.3 RIRPF, elección individual/conjunta, mínimos y DA 61 del año. El caso carece de ejercicio y territorio acreditados. Revisar contratos actuales de retenciones y trabajo anual, y las decisiones TDE-20/22/23 sin extender aceptaciones. No aplicar una tabla con hipótesis ausentes a la API canónica.
4. CX-07: comparación nominal/real 2025–2026. Coordinar con el implementador de comparativa de inflación de ronda 11. Fijar escenario IPC, bruto nominal, rastro decimal y cuotas antes/después de transformación. La comparación debe distinguir rendimiento previo, base liquidable y factor del escenario. No pisar `compatibilidad-legacy/progresividad-frio.ts` ni el oracle. La referencia privada no sustituye un resultado oficial de contraste.
5. CX-08/CX-09: separar comparación de poder adquisitivo, actualización contractual del salario y deflactación normativa. Los contratos examinados requieren distinguir estos supuestos; no desplazar IPC un año ni imponer suelo cero sin contrato de modelo y fuente. D031 ya separa hipótesis 2026 de observación. Una predicción de deflactación no autoriza modificar tramos.

El padre debe encargar una revisión NUEVA de esta evidencia y de las hipótesis antes de promover hallazgos. La única adición ejecutable propuesta ahora es la regresión de CX-02, sin cambio fiscal. No se entrega parche candidato numérico porque el reparto aceptado ya está corregido.

## Referencia de origen

La observación inicial procede de un divulgador en X (referencia privada). Contenido social retirado de la copia pública por privacidad. Original conservado en el respaldo privado.

## Decisiones, objeciones y costes

- Separar cada proposición evita aceptar la cuota mensual porque los tipos coincidan. Objeción experta: los mismos números admiten órdenes de redondeo distintos. Coste: un hallazgo histórico corregido y pendientes documentales distintos.
- Conservar la precisión de lo observado evita reconstruir una entrada desde texto a dos decimales. Objeción experta: el rastro formateado no prueba el decimal usado. Coste: CX-04/CX-07 no tienen rojo fiscal nuevo.
- Las publicaciones, imágenes y referencias identificativas de terceros quedan únicamente en el respaldo privado.
- No alterar oracles, registros ni contratos de otro propietario. Objeción experta: un verde obtenido editando expectativas no confirma una norma. Coste: fixes futuros requieren revisión y una base actualizada por el padre.

Integridad, autenticidad, interpretación, exactitud y aceptación son dimensiones distintas. Ni SHA-256, ni acuerdo X/Fx, ni una prueba positiva aceptan fiscalmente una regla. No se han validado aquí firmas PAdES, confianza histórica, CSV o cadena completa de vigencia.

## Reproducción y entrega

`pruebas/validacion.log` registra prueba focalizada, lint y typecheck reales, bajo `flock /tmp/irobopf-validacion-pesada.lock`, un trabajador y Bun/Node de Nix. `pruebas/evidencia.log` corresponde a reextracción y Decimal mediante `bash tools/procedencia/run.sh`, entorno Nix/uv fijado. `citas-candidatas.json` identifica originales oficiales del corpus por ambos hashes, página física, caja, texto y facsímil; no se modifican originales. Los comandos exactos están en `pruebas/COMANDOS.md`.

La entrega se integra por archivo y hash, no por índice. `manifiesto.json` fija ruta, SHA-256, tamaño y `baseSha256` (null en archivos nuevos). `entrega.patch` contiene los archivos textuales nuevos; binarios por ruta/hash. El manifiesto y patch se excluyen de su propio contenido para evitar ciclos. Cero borrados solicitados. No hay PR, commit, push, despliegue, subida LFS, gasto ni limpieza. La copia host-b v1 comunicada por el coordinador sigue siendo de la misma casa/propietario; no se ha verificado aquí ni se equipara a v2 o a custodia independiente.

Reproducción final del script entregado correcta (exit0): seis facsímiles, reparto analítico/mensual y diez diferenciales/límites de la tabla comprobados con Decimal. `pruebas/aritmetica-tablas.json` distingue esta exactitud aritmética de la aceptación fiscal. 