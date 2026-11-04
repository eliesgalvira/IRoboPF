# Cuota compartida y saldos valencianos de 2025

`aplicarCuotaConjuntaValenciana2025`, exportada desde el módulo valenciano,
aplica las deducciones elegidas y los saldos históricos contra una sola cuota.
«Conjunta» se refiere a esa aplicación compartida: el expediente admitido sigue
siendo **individual ordinario**, no una declaración conjunta de la unidad familiar.
Es una API de cálculo parcial, sin integración automática en la liquidación anual.

## Entrada y resultado

Recibe `{ hechos, ordenConsumo, criterioOrden: "eleccion_experta" }`.
`hechos` usa el contrato de composición con `cuota` obligatoria: referencia,
importe disponible y saldos históricos. Reevalúa los hechos; no acepta un
resultado previamente calculado como sustituto. Una composición sin solicitudes
actuales sólo es válida si contiene saldos históricos admisibles.

Cada saldo histórico tiene un identificador y una cuenta consolidada por
código, origen y contribuyente. La generación corriente usa el identificador
`JSON.stringify([codigo, 2025, contribuyente])`. `ordenConsumo` contiene todos
los identificadores elegidos una sola vez. Las deducciones omitidas conservan
su diagnóstico pero no consumen cuota. Se rechazan duplicados, saldos ajenos,
fechas caducadas, códigos sin traslado y posibles dobles usos con consignaciones
externas del mismo código.

Cada movimiento devuelve deducción disponible, aplicado, pendiente futuro,
perdido por insuficiencia de cuota sin régimen de traslado y caducado al cierre.
El último ejercicio permite aplicar saldo; sólo el remanente caduca. Autoconsumo
y DANA vivienda admiten cuatro ejercicios siguientes; inversión en entidades y
DANA aportaciones, tres. Los históricos DANA admisibles en 2025 proceden de 2024.
El exceso de una base que nunca generó deducción no se convierte en saldo.

Se opera con céntimos enteros Decimal. Las entradas deben ser finitas, no negativas,
con dos decimales como máximo y representables sin pérdida al devolver números.
El resultado válido conserva `estado: "calculo_parcial"` y
`aceptacionFiscal: "pendiente"`. Un rechazo devuelve `no_soportado`, movimientos
vacíos y ningún `totalAplicado` ni `cuotaRestante`. Conserva los diagnósticos de
composición, pero su total antes de cuota no es un importe aplicado.

## Orden y fuentes

Los históricos del mismo código preceden a la generación de 2025 en autoconsumo
y en inversión en entidades. Es la prioridad indicada por los manuales AEAT de
[autoconsumo](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunitat-valenciana/cantidades-invertidas-instalaciones-autoconsumo-generacion-termica.html)
y de [inversión en entidades](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunitat-valenciana/inversion-adquisicion-acciones-participaciones-entidades.html).
No se deduce de ella un orden FIFO entre históricos ni una prioridad global entre
códigos. La API exige una elección experta expresa para el orden restante.

Los plazos proceden de la [Ley 13/1997, artículo 4.Uno.o/z](https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202&p=20251229&tn=1),
del [Decreto ley 12/2024](https://dogv.gva.es/datos/2024/11/12/pdf/2024_11848_es.pdf)
y de la modificación del artículo 5.3 por el
[Decreto ley 17/2024](https://www.boe.es/ccaa/dogv/2024/10011/r00001-00009.pdf).
Se reutilizan los originales y las extracciones identificados en la entrega
documental `g-inversion-dana`; la revisión conserva sus hashes.

Ejemplo: saldo de autoconsumo de 2021 por 30 €, generación de 2025 por 40 € y
cuota de 20 €. Se aplican 20 € antiguos, caducan los otros 10 € y quedan los
40 € actuales pendientes. El orden inverso se rechaza: perdería indebidamente
20 € de saldo futuro. Otro ejemplo: dos deducciones compatibles de 15 € con
cuota 20 € aplican 15 € y 5 € según la elección; los 10 € restantes se pierden
si no tienen régimen de traslado.

## Revisión y límites

La revisión independiente detectó la prioridad de autoconsumo omitida y un
diagnóstico que aceptaba saldos DANA anteriores al régimen. Ambos se reprodujeron
en pruebas rojas y se corrigieron. Pasan 23 grupos permanentes y los 263 escenarios
independientes repetidos. La repetición adapta únicamente la observación de ese
diagnóstico DANA para exigir rechazo; conserva todas las expectativas monetarias.
Los dos repros originales de los hallazgos también pasan sin modificación.
Las evidencias y el dictamen previo se conservan en
[la revisión](revisiones/cuota-conjunta-20261104/INTEGRACION.md).
El CI completo previo a publicación se registra por separado; este sondeo no lo
sustituye.

La función no mantiene un registro persistente de consumos. El expediente debe
registrar los movimientos y acreditar identidad, soportes y exhaustividad de los
saldos. No se puede reenviar la misma cuota original como si fuera nueva. Se
conservan los motivos, reservas y exclusiones de cada evaluador; esta aplicación
no certifica la aceptación fiscal de las 351 fichas ni hechos no aportados.
