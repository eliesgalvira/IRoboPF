# Primera revisión B08 — dictamen final monetario acotado

Veredicto final de esta misma primera revisión: acepto la evidencia aportada por el padre y cierro favorablemente el dictamen monetario para 2025 Murcia, adquisición estatal_pre2013 y donativo dinerario ordinario Ley49 general_40, con selección expresa dt18_antes_donativos, patrimonio suficiente y sin entradas ISD. No quedan bloqueos B08 abiertos dentro de ese perfil comprobado. No es una segunda revisión ni un recheck ejecutado por este revisor.

La preparación inicial fue GRANT0. Este cierre lee exclusivamente evidencia ya producida por el padre y usa stdlib con timeout para hashes, comparación textual y lectura de reportes. No ejecuta motor fiscal, JS/TS/Bun, pruebas, inventario ni CI; raíz sólo lectura, sin VCS mutante, worktree, subagentes, instalaciones ni borrados. El único parche de cierre actualiza este documento.

## R1 cerrado con causal preservado

El hallazgo original P1 se mantiene en la entrega inicial: tests/murcia-dt18-donativos.test.ts, línea29, accedía a s.donativosEstatales2025.operaciones68_3 después de eliminar el productor en sin_donativos (línea65). El reporte padre madrid-murcia-pre-01 confirma TypeError en ambas API: la suite del autor obtuvo50/52 y la revisión76/76; el conjunto de esa fase obtuvo430/452. No se atribuyen los otros fallos a B08.

madrid-murcia-fixtures-01 conserva pre/post, parche y causa. La sustitución calcula el desembolso desde movimientos bancarios de consumo ya existentes (excepto CON), sin leer el productor eliminado. Conserva la mutación adversa del movimiento y no la repara para forzar aceptación. La comparación original/final del autor muestra sólo esta sustitución y un non-null en la fixture positiva de inversión del orden de claves. Las expectativas y el JSON de oráculos del autor permanecen intactos.

La comparación original/final de la suite de revisión muestra únicamente tres non-null en esa misma fixture positiva de orden, introducidos por tipos-correccion-03/04 y mecanica-final-01; ninguna expectativa, mutación adversa ni importe se alteró. El oráculo propio conserva SHA256 edfa05730b1eda495c422dfd431fce8327c1cea122a1a2919b6ec99e7ca057a4. En producto-final-01 pasan52/52 del autor y76/76 de revisión. R1 queda resuelto por corrección causal y ejecución del padre, no por ocultar el caso.

## Evidencia admitida y límites de trazabilidad

H identifica /home/elies/Backups/IRoboPF/producto-historico2023-2024-integracion-20261111. El snapshot final es H/evidencia-producto-1372/post; MANIFIESTO.json contiene62 rutas y su SHA256 es d9dd9176f538dbb51a4ebb27f0bde3e08d8e4ab72f9494ffb9bb8a2bfbc76ee3. Se verificaron los62 hashes de contenido del snapshot. Esto verifica integridad de los archivos preservados; no constituye auditoría semántica completa de los módulos evaluados ni medición de todas las dependencias en el instante de ejecución.

Se admiten COMANDO.json, RESULTADO.json, supervision.json, reporte.json y salida.log de producto-final-01:1372/1372 assertions pasadas, cero fallos,29 archivos en testResults y en la salida de Vitest. El contador numTotalTestSuites del JSON es38 e incluye suites internas; no representa38 archivos. El comando declarado coincide con el comando supervisado y con las29 rutas del reporte; cwd es la raíz, entorno explícito Nix con Bun1.3.13/Node24.20.0, maxWorkers=1 y NODE_OPTIONS de1792MiB. Timeout exterior905s, presupuesto del supervisor900s y timeout del comando835s; exit0, sin excepción, señales ni supervivientes, cleanup verificado. No se volvió a ejecutar ese comando.

producto-conjunto-02 (869/869) y patrimonio-regresiones-02 (874/874) se leen como antecedentes solapados; no se suman con1372 ni se atribuyen como muestras independientes. El resultado final incluye autor, revisión y regresiones DT18. Los hashes son posteriores y selectivos respecto del universo de módulos: se acepta la evidencia con esta reserva de procedencia, sin proclamar auditoría completa de ejecución.

El manifiesto de cierre fija hashes de los registros, originales, correcciones y archivos B08 usados para el dictamen. Los cuatro archivos de coordinación B08 del snapshot mantienen los hashes del post del autor: esquema territorial, composición, libro territorial y validador DT18/donativos. Se compararon también con la raíz por lectura. La entrega inicial y sus fuentes/oráculos/parche no se sobrescriben.

## Alcance y resultado estático

La composición genera DT18, aplica cada parte, pasa sólo su residual a donativos y conserva baseLiquidableGeneral/Ahorro. La liquidación descuenta DT18 y donativos una vez; F recibe consumoCompartidoDT18 y total común cero para esa rama. La conciliación exige id/documento/fecha/importe/persona, clase consumo y salida; incluye no_aplicar y bloquea reutilización de pagos corrientes e históricos. No encontré otro bloqueo de producción dentro del perfil examinado; la ejecución del padre ahora está acreditada con las reservas anteriores.

Se prepararon y el padre ejecutó pruebas normales independientes para ambas API. No importan fixtures ni oráculos nuevos del autor B08: reutilizan sólo hechos históricos existentes en tests/dt18-rioja-fixture.ts y donativos existentes en p5-fixtures.ts. Siete oráculos racionales propios: suficiente, escasa, DT18 agota, cero, límite de base, partes asimétricas y no_aplicar. Se comprueban base intacta, residual por parte, base vivienda/patrimonio, F compartido y cuota final. 27 adversas nominales por API más selección exigida con cuota suficiente/escasa/cero y orden físico de claves. El caso asimétrico usa capital8990+intereses50, DT18 678 por parte y donativo1400: agota sólo la autonómica y deja residual estatal; detecta transferencia o compensación entre partes. Los importes de consumo se construyen antes de la mutación adversa y nunca se reparan dentro de la llamada.

## Separación del núcleo patrimonial

B08 mantiene el cerco cumplePatrimonio y ausencia de movimientos donacion/herencia. No equivale a pérdida legal del derecho con incremento insuficiente. La evidencia normativa inicial sobre base parcial e intereses/gastos sigue preservada. El padre ha cambiado tres fuentes del núcleo para art70 parcial, rechazo técnico ISD y guardia multimodal, con primera revisión y contraste grave separados. Este dictamen no certifica esos cambios ni sus otros perfiles. Las adversas B08 de patrimonio insuficiente/ISD se mantienen y pasan en la ejecución final.

El documento B08 del snapshot distingue esa corrección del núcleo de la concurrencia aquí admitida. No se acredita la resta automática de ISD ni se convierte falta de cronología en cero fiscal. El verde de B08 sigue limitado a patrimonio suficiente/sinISD; no hay verde universal DT18.

## Fuentes temporales exactas

fuentes.json identifica URLs, SHA256 de respuesta y extractos preservados. Recuperación BOE propia del 11-11-2026: LIRPF p=20251224 selecciona a67/a77=20141128, a69=20130928, DT18=20121228; confirma los cuatro bloques del autor sin confiar en un corte2022 para representar todo2025. LIRPF p=20111231 selecciona a67/a77=20091219 y a68=20111231. Ley49 p=20231220 a19 corresponde a escala250/80/resto40, con efectos2024 (nota del bloque). La comprobación adicional p=20121227 devolvió bloques2026 por no ser fecha de redacción existente: se conserva expresamente DESCARTADA en fuentes.json, sin usarla como norma. El selector de la fuente20111231 no ofrece redacciones intermedias2012 antes de la supresión20121228 para esos tres artículos. Los textos AEAT son extractos primarios conservados por el autor, identificados como tales, no una recuperación independiente.

- [LIRPF2025 arts67/77/69 y DT18](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20251224&tn=1): suma y suelo cero por parte; art69.1 limita base68.3 al10% de base liquidable. DT18.3 remite al69.2 para cuota de incentivos empresariales; no prescribe restar DT18 de la base69.1 de donativos.
- [Redacción2012 arts67/77/68](https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20111231&tn=1): DT18.2 preserva normativa histórica de vivienda. La supresión publicada28-12-2012 tiene efectos01-01-2013; no se aplica hacia atrás.
- [Ley49 arts19/24](https://www.boe.es/buscar/act.php?id=BOE-A-2002-25039&p=20231220&tn=1): escala y certificado. No se extiende a reiteración, especie u operaciones68.5.

Estos artículos y AEAT8.7.1 no imponen prioridad DT18 sobre donativos. dt18_antes_donativos es la selección expresa del perfil, no una prioridad legal inferida. Tampoco autorizan transferir residual estatal/autonómico.

## Oráculo y Effect

Cálculo propio con Python Fraction stdlib, sin importar motor ni ejecutar el generador del autor. SS=bruto*0.0648, neto=bruto−SS, base=max(0,neto−2000−reducción20). Escala expresada independientemente en tramos cerrados: hasta12450 al9.5%; exceso hasta20200 al12% estatal/11.2% Murcia; exceso hasta35200 al15%/13.3%. Restar mínimo5550 por la misma escala. DT18=min(cuota,baseVivienda*7.5%); baseDonativo=min(pagado,base/10), franquicia250 al80%, resto40%; aplicación=min(residual,generado/2) por parte. Redondeo único half-up a céntimos sobre suma final. Los cinco casos comunes se cotejaron después contra la hoja del autor y coinciden. El caso asimétrico y no_aplicar amplían la discriminación.

Consulta local Effect previa: packages/effect/src/Effect.ts 1770–1825 (try/catch) y packages/effect/test/Effect.test.ts (runSync/flip). No se ejecuta CLI effect-solutions por prohibición de runtime JS en esta fase. Las pruebas usan el patrón existente Effect.runSync/flip; no se añaden capas ni arnés.

## Cierre e integración documental

Se cierra esta primera revisión sobre evidencia padre ya existente. No se ejecutaron pruebas nuevas ni se regeneraron oráculos. El alcance monetario aceptado conserva base del donativo sin restar DT18, residual independiente por parte, selección expresa, conciliación de pagos y único consumo. La prioridad expresa sigue siendo una selección del perfil, no una primacía legal.

El parche de cierre modifica sólo este documento sobre la preimagen del snapshot final, verificada por SHA256 y coincidente con la raíz al preparar el parche. Aplicación exclusiva del padre, abortando ante otra preimagen. El manifiesto preserva referencias y hashes de los originales y de esta evidencia. No se cambian pruebas, productores, oráculos ni fuentes normativas.

Tipos, lints conjuntos y CI globales quedan pendientes según el corte de evidencia recibido; este cierre no los declara verdes. Publicación sólo por el padre en procedencia-documental tras sus comandos exactos workflow/Nix, generados/inventario y comprobación remota. La corrección patrimonial y su contraste grave conservan su revisión separada.
