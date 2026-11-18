# Antes de 2018 y escenario 2026

Este acompañamiento no prolonga las curvas de los [resultados 2018–2025](RESULTADOS.md). Para los mismos tres perfiles de empleo individual en Madrid, sin familia con derecho a mínimos ni especialidades, no hay un neto publicable con el contrato actual fuera de ese intervalo. Existen módulos parciales y una ruta salarial heredada reproducible. No equivalen a una serie de estos perfiles con entradas, cotización de oficina y política anual documentadas.

## 2012–2017: qué está disponible

| Año | Neto anual de los tres perfiles | Piezas implementadas y faltantes para esta trayectoria |
| --- | --- | --- |
| 2012 | No disponible con este contrato | Hay [tarifa autonómica 2012](../../lib/dominio/normativa/datos/irpf-autonomico-2012.ts), [mínimos 2012](../../lib/dominio/normativa/datos/minimos-autonomicos-2012.ts) y art20 hasta 2014 y art80bis aislado; escala estatal ordinaria y complementaria. Faltan A, B y C de la cadena siguiente. |
| 2013 | No disponible con este contrato | Hay [tarifa autonómica 2013](../../lib/dominio/normativa/datos/irpf-autonomico-2013.ts), [mínimos 2013](../../lib/dominio/normativa/datos/minimos-autonomicos-2013.ts) y art20 hasta 2014 y art80bis aislado; escala estatal ordinaria y complementaria. Faltan A, B y C de la cadena siguiente. |
| 2014 | No disponible con este contrato | Hay [tarifa autonómica 2014](../../lib/dominio/normativa/datos/irpf-autonomico-2014.ts), [mínimos 2014](../../lib/dominio/normativa/datos/minimos-autonomicos-2014.ts) y art20 hasta 2014 y art80bis aislado; escala estatal ordinaria y complementaria. Faltan A, B y C de la cadena siguiente. |
| 2015 | No disponible con este contrato | Hay [tarifa autonómica 2015](../../lib/dominio/normativa/datos/irpf-autonomico-2015.ts), [mínimos 2015](../../lib/dominio/normativa/datos/minimos-autonomicos-2015.ts) y art19 con gasto general y art20 de 2015–2017. Faltan A, B y C de la cadena siguiente. |
| 2016 | No disponible con este contrato | Hay [tarifa autonómica 2016](../../lib/dominio/normativa/datos/irpf-autonomico-2016.ts), [mínimos 2016](../../lib/dominio/normativa/datos/minimos-autonomicos-2016.ts) y art19 con gasto general y art20 de 2015–2017. Faltan A, B y C de la cadena siguiente. |
| 2017 | No disponible con este contrato | Hay [tarifa autonómica 2017](../../lib/dominio/normativa/datos/irpf-autonomico-2017.ts), [mínimos 2017](../../lib/dominio/normativa/datos/minimos-autonomicos-2017.ts) y art19 con gasto general y art20 de 2015–2017. Faltan A, B y C de la cadena siguiente. |

La cadena que impide publicar un neto para cada uno de esos años es:

- **A — Entradas e IPC:** las [entradas publicadas](resultados-entradas.json) y el [cociente de índices de diciembre](indices-ipc.json) empiezan en 2018. El [IPC heredado](../../lib/dominio/normativa/datos/ipc-2012-2026.ts) conserva tasas de diciembre redondeadas para los años anteriores; no es la misma edición de índices ni una trayectoria pre-2018 definida para estos perfiles. Harían falta entradas anuales y una decisión documentada de enlace de precios.
- **B — Cotizaciones:** el [perfil uniforme](../../lib/dominio/laboral/cotizaciones-perfil-uniforme.ts) y los [topes heredados](../../lib/dominio/normativa/datos/seguridad-social-2012-2026.ts) permiten estimaciones. El [calendario de oficina](calendario-oficina.json) y sus [fuentes](fuentes-ipc-ss-2018-2025.json) sólo cubren 2018–2025. Faltan calendario mensual de bases mínimas/máximas, tipos y tarifa AT/EP aplicable al grupo y actividad declarados en cada año anterior; una constante heredada no acredita ese perfil ni una liquidación TGSS.
- **C — Conexión fiscal y política:** la [conexión de hechos explícitos](../../lib/dominio/irpf/trabajo-anual/conexion-contrato.ts) no admite 2012–2017; la [API analítica](../../lib/dominio/irpf/analisis-madrid/analizar.ts) tampoco. Hay [gastos y deducciones aislados](../../lib/dominio/irpf/trabajo-anual/calcular.ts), [art20 histórico](../../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts) y [composición de cuotas](../../lib/dominio/irpf/liquidacion/composicion-anual.ts). Haría falta cerrar la conexión desde hechos a cuota posterior, con vigencia anual de cada concepto y política de redondeo identificadas; en 2012–2014 también la aplicación de art80bis cuando proceda. Además, el [selector de cuotas publicadas](../../lib/dominio/irpf/cuotas/escalas-publicadas.ts) no devuelve una tarifa Madrid de cuota fija más exceso para 2012–2017: la liquidación heredada conserva la integración previa de tipos y advierte que esa política no está cerrada. Harían falta las cuotas publicadas y su conexión por ejercicio. Que una pieza devuelva un importe no acredita esa integración.

La [ruta salarial heredada](../../lib/dominio/analisis-salarial/calculo-salario.ts) sí ejecuta liquidación anual y permite indicar comunidad. Por defecto usa comunidad simulada estatal y edad fija: no se sustituye Madrid por ese perfil ni se transportan especialidades a un perfil ordinario. No se usa Excel opaco como equivalente validado. La ausencia aquí es de un contrato completo para esta trayectoria, no de toda aritmética histórica.

## 2026: hipótesis de bruto, sin neto

**Hipótesis versionada madrid-bruto-diciembre2026-mas3pct-v1: precios +3 % de diciembre de 2025 a diciembre de 2026.** Es una elección de escenario, no IPC observado, previsión estándar ni año cerrado. No modifica el IPC real utilizado en 2018–2025. La [clasificación heredada del 3 %](../../lib/dominio/normativa/datos/ipc-2012-2026.ts) tampoco acredita autor ni fecha de emisión de una previsión.

Operación para cada salario: bruto base en EUR de 2018 × (índice diciembre 2025 / índice diciembre 2018 del CLI) × 103 / 100. Se conserva el cociente racional y se redondea una sola vez a céntimos, mitad hacia arriba. No se multiplica el bruto 2025 ya redondeado.

| Bruto base anual (EUR de 2018) | Operación exacta (céntimos EUR de 2026 antes de redondear) | Bruto anual hipotético (EUR de 2026) | Neto anual 2026 |
| ---: | --- | ---: | --- |
| 16000 | 19766441600000 / 9732900 | 20308.89 | No disponible con este contrato |
| 30000 | 37062078000000 / 9732900 | 38079.17 | No disponible con este contrato |
| 60000 | 74124156000000 / 9732900 | 76158.35 | No disponible con este contrato |

Existen [escalas autonómicas 2026](../../lib/dominio/normativa/datos/irpf-autonomico-2026.ts), [mínimos 2026](../../lib/dominio/normativa/datos/minimos-autonomicos-2026.ts) y cotización uniforme con MEI/solidaridad. No bastan para el neto Madrid: la API de análisis y la conexión explícita excluyen 2026; calcularGastosTrabajo rechaza su vigencia y calcularDeduccionTrabajo deja DA61 de 2026 pendiente de cierre. El calendario de oficina termina en 2025. Faltan admisión anual, cierre normativo de gastos/reducciones/deducción aplicable y fuentes laborales 2026 del perfil. La ruta técnica simulada estatal no resuelve ese límite. No se inventa una tarifa ni se fuerza un bruto fuera de dominio. **Contraste Open 2026: inexistente en este acompañamiento.**

## Qué prueban los controles

La [prueba de resultados](../../tests/resultados-madrid.test.mjs) comprueba este documento completo, las tres operaciones racionales, enlaces y rechazo del CLI para cada año excluido y cada salario. Eso acredita reproducción y límites, no importes fiscales antiguos. Las [pruebas de trabajo](../../tests/trabajo-anual-contratos.test.ts) cubren etapas aisladas; las [pruebas territoriales 2026](../../tests/territorios-2026.test.ts) cubren escalas/mínimos y un escenario técnico separado, no el neto Madrid. La [prueba histórica](../../tests/anual-historico-explicito.test.ts) conserva el rechazo fuera de su contrato. No se añaden originales, capturas ni casos métricos; la evidencia 2018–2025 queda en la [referencia técnica original](README.md#referencia-técnica-original).

Reproducir los tres documentos desde la raíz: `timeout -k 30s 3m bun scripts/resultados-madrid.mjs`. Añadir `--check` verifica sin escribir, incluido este acompañamiento. El [generador del acompañamiento](../../scripts/acompanamiento-madrid.mjs) sólo calcula el bruto racional de escenario. No hay cifras fiscales nuevas ni una curva imputada en los años no admitidos.
