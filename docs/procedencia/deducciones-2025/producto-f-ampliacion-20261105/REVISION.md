NO APTO PARA INTEGRAR: tres hallazgos monetarios bloqueantes.
Primera revisión propia de este combinado F anual, 2026-11-05.
Candidato producto-deducciones-f-anual-rebase-20261105; base declarada
b9122c2bf61310922e856117ed4490136a628d03. Sin dictámenes previos reutilizados.

Prefijo de las rutas siguientes:
lib/dominio/irpf/deducciones/territorial-f-ampliacion-2025/

R1 — ALTA — anual-cuota.ts:25 y :58.
La inversión de nuevos residentes extranjeros recibe prioridad1 y desempate
alfabético: consume antes de madrid_vivienda_municipios_despoblacion.
Con cuota1000, inversión5000 (deducción1000) y vivienda100000 (anualidad1000),
la vivienda aplica0 en lugar de1000. Las dos API reales reproducen vivienda0
con inversión50000. El total corriente puede coincidir por agotamiento, pero
se pierde aplicación no arrastrable y se consume anticipadamente la arrastrable.
Causa: falta prioridad específica posterior para art17bis, pese a la reserva
de inversiones.ts:517. Fuente: DL1/2010 Madrid, art17bis.3.
Comando portable: timeout -k 30s 5m bun run test tests/revision-f-monetaria.test.ts --maxWorkers=1 -t R1

R2 — MEDIA MONETARIA, BLOQUEANTE — anual-cuota.ts:16 y :87–95;
inversiones.ts:509–518; anual.ts:217–229.
Para inversión extranjera2025 de5000 y cuota1, generado1000/aplicado1/
pendiente999 quedan marcados completos pero sin origen estructurado, titular,
objeto ni arrastre2026–2030. El tipo sólo permite2027|2028 y las únicas ramas
que construyen arrastre son los tres incentivos Murcia. La reserva textual de
cinco ejercicios no entrega el contrato de saldo. No afirmo que desaparezca
el número pendiente999: falta su calificación temporal y subjetiva operativa.
Fuente: mismo art17bis.3. Corregir productor/libro o delimitar expresamente
el alcance sin presentar esa rama como conexión de saldo completa.
Comando portable: timeout -k 30s 5m bun run test tests/revision-f-monetaria.test.ts --maxWorkers=1 -t R2

R3 — ALTA — inversiones.ts:477–482.
Ambas API publican deducción400 por ampliación de1000 el01/06/2025 para una
SL cuya creación se declara01/01/2026. Debe rechazarse/excluirse esa cronología,
no producir importe positivo ni cuota final reducida400. El código comprueba
sólo que creación no sea anterior a inversión menos3años; falta el extremo
superior creación<=ampliación. El certificado y compromiso de plantilla no
pueden reconciliar la contradicción temporal aportada por la propia entrada.
Fuente: DL1/2010 Madrid art15.3.c.4; sociedad constituida en los tres años
anteriores a la ampliación. No se exige autenticar documentación externa.
Comando portable: timeout -k 30s 5m bun run test tests/revision-f-monetaria.test.ts --maxWorkers=1 -t R3

Fuentes cotejadas en esta revisión:
https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20241230&tn=0
Localizadores: artículo17bis apartado3; artículo15 apartado3.c ordinal4.
Conexión documental del candidato: citas.ts:685–733, códigos
madrid_inversiones_nuevos_contribuyentes_extranjero-*; matriz-51.json,
entradas de ambas inversiones, referencias *-original y *-regla-*.
Los defectos están también en conflicto con las propias reservas del candidato.
https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-region-murcia/gastos-instalacion-infraestructuras-recarga-vehiculos-electricos.html
Localizadores: Cuantía, Base/base máxima, Requisitos, Ámbito temporal,
Orden de aplicación/saldos. Criterios candidato f-aeat2025-recarga-*.
https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-region-murcia/inversiones-dispositivos-domesticos-ahorro-agua.html
Localizadores: Cuantía/límite, Base máxima y Requisitos.
Criterios candidato f-aeat2025-agua-*. Sin cuerpos CAS en entrega.

Ejecución propia (PESADO2, secuencial, timeout-k30s, maxWorkers1):
182/182 focales;572 verdes+2TODO previos en10 archivos de preservación.
22 adversos propios:16 verdes y6 rojos, correspondientes a R1(3),R2(1),R3(2).
Verdes propios: agua0/299.99/300/300.01, exacto59.998 sin redondeo prematuro;
recarga3999.99/4000/4000.01 con cuota0.01 y saldo racional; ambas API,
historia positiva pendiente y agua/recarga sin doble consumo.
F-N01 propia: BI35000 exacta pendiente; ±1e-40 selecciona300/225 sin redondeo;
BI45000 da150; precio35000 con BI20000 no abre reserva y topa7000.
Tipos strict/Effect candidato:0 diagnósticos. Pruebas nuevas también verificadas con strict/Effect:0 diagnósticos;
rojos de construcción del arnés conservados en tipos-pruebas-01/02.log.
Antislop/Oxlint candidato21rutas:
salida0. No se ejecutaron inventario, CI global, instalación ni VCS mutante.
Los95 históricos no acreditan este combinado. Los182/572 son reproducción
propia del arnés de autor; NO sustituyen los oráculos independientes.

Alcance y resto concreto:
Se leyeron informe/manifiesto/validación/correcciones, cinco deltas centrales,
contratos de conexión, libro, canales internos y módulos de fórmulas.
Recarga100%/4000 y agua20%/300/60 cotejadas contra AEAT; reservas F-N03,
rechazo de ayudas positivas, orden Murcia y seguimiento2 presentes.
Inspección de código: F-N01 limitada a BI35000, F-N02 no resuelta; bases de
terceros no derivadas desde renta; canal80 y rechazo específico heredado40;
pendientes rechazan cuota final. Focales cubren identidad, duplicados y esquema.
No se certifican condiciones externas ni códigos enteros por esos casos.
ALCANCE.json enumera51 códigos sin otorgarles aprobación global: permanece
pendiente cotejo normativo exhaustivo independiente de cada subrama de las
otras familias, vivienda e inversiones, especialmente prorratas/convivencia,
regímenes transitorios y mecenazgo/censo/pago; también adversos independientes
adicionales de bases/minimos/tipos, rechazo heredado40 y asignación estatalcero.
B37 y A40/H12 sin F se reprodujeron en regresiones; no se hizo comparación
adicional ejecutable contra la base pública. No hay arnés privado @pre.
El dictamen negativo es suficiente para bloquear; no acredita auditoría
normativa exhaustiva de36+5+10 ni cierre anual de todas las ramas.

Transporte:
revision-portable.patch contiene únicamente dos archivos nuevos en tests/.
Importaciones relativas públicas; sin alias privados, rutas privadas ni deps
externas a las declaradas por el proyecto. Fixtures documentales de transporte
adaptados del candidato; esperados adversos y razonamiento propios.
Aplicar ese parche sobre la base pública con el candidato ya integrado y usar
los comandos anteriores desde la raíz con su entorno y deps fijadas.
El arnés vitest.private.config.mjs se entrega separado para reproducir sobre
el candidato selectivo congelado; NO forma parte del parche público.
Hashes pre/post549rutas: cero cambios; incluye candidato entero y lib/tests
productivos (superset de las rutas leídas). PESADO2 LIBERADO; procesos terminados.
