# Cinco defectos de unidades/enlaces e IPC/SS

Corrección del 4 de noviembre de 2026 sobre `28a6fc76deeac986ce7efd9f09af374b36634eae`.
Se recuperan los candidatos compactos y los casos de las revisiones anteriores.
No se modifican parámetros ni fórmulas del motor. Los cinco fallos se reprodujeron
antes de corregirlos; las ejecuciones antiguas cortadas por SIGTERM no se cuentan
como aprobadas. La revisión de esta corrección corresponde al orquestador, sin
subagentes por indicación del encargo actual.

| Defecto reproducido | Corrección | Regresión |
| --- | --- | --- |
| Una caja ampliada traslada la unidad de otra columna | Relación geométrica sobre las palabras reales; control de solapamiento y adyacencia | `casos.py::test_padded_foreign_header_rejected` y `test_geometria_identidad.py` |
| `async (x) => x` se acepta como identidad | Rechazar asincronía, parámetros rest y valores por defecto | `casos.py::test_async_helper_is_not_identity` y `test_identity_subset` |
| El segundo cargo empresarial se etiqueta trabajador | Exigir el literal del cargo trabajador en cada patrón | `test_discriminantes.py::test_segundo_cargo_debe_ser_trabajador` y variantes FP/MEI/solidaridad |
| Cambiar el argumento de año retaggea el mismo PDF | Comprobar año en el título; separar el preámbulo; comprobar el período si se aporta | `test_anio_no_puede_reetiquetarse_sin_evidencia` y controles de título/período |
| Una mínima enero–julio se convierte en máxima anual | Exigir pruebas físicas de columna, grupo, unidad y período; retirar etiquetas operativas sin prueba | `test_columna_y_periodo_no_pueden_reetiquetarse` y `test_contexto.py` |

La regresión del año recibe un cargo trabajador explícito para seguir aislando
el defecto temporal tras corregir el sujeto. Exige extraer en 2024 y rechazar
2025: la antigua igualdad entre dos listas no expresaba ese contrato. Los otros
dos discriminantes IPC/SS y las siete aserciones de unidades conservan su
condición de rechazo. Hay controles positivos con cabecera válida, selector
ampliado legítimo, identidad síncrona y período parcial acreditado.

Una prueba del adaptador IPC anterior esperaba eliminar el espacio de `- 0,5`
sin geometría. Se adapta al contrato común ya vigente: el parser textual lo
rechaza y el parser físico lo admite cuando los dos tokens tienen posiciones
dentro de la celda. Se mantienen el control negativo y el positivo; no se
relaja el parser para aprobar la integración.

## Revisión adicional

Se comprueba que una cabecera temporal de otra tabla no se puede trasplantar,
que una vigencia abierta no adquiere final anual y que una coincidencia parcial
no acredita el parámetro de todo el ejercicio. Las bases sin contexto conservan
su número y `candidateScope`, con `scopeStatus: unverified` y etiquetas operativas
nulas. Los tipos sin período quedan en `physicalRates`; los fallos de año quedan
explicados en `rateGaps`. Sólo las pruebas de ámbito completo alimentan los
enlaces anuales. Esta separación evita convertir la retirada de etiquetas en
una diferencia financiera ficticia.

El censo valida los árboles de datos al importar, excluye funciones declaradas
y servicios y conserva exactamente las 48 hojas, 15 parámetros y 60 casos de
la revisión anterior. Se corrigen sus errores de lint sin desactivar reglas.
Las pruebas públicas se incorporan al trabajo `corpus` de CI; cada comando tiene
`timeout`, y la ejecución local utiliza como máximo dos suites pesadas.

## Evidencia y alcance

Pasan 75 tests de regresión, las comprobaciones generales de CI y Ruff E9,F.
ESLint conserva 18 avisos anteriores y cero errores. Los resultados y hashes
de esta revisión se registran en [validacion.json](validacion.json).
El corpus real se comprueba aparte del CI sintético. Los manifiestos v1/v2 y
balances de los candidatos conservan su significado histórico: sus igualdades
SS no equivalen a resultados del verificador corregido v3.

Las 13 observaciones IPC conservan su coincidencia. Los 101 tipos extraídos
conservan su año documental y cargo, pero ningún período anual acreditado. Se reextraen 414 celdas
numéricas de bases y permanecen tres separadores ambiguos de 2013. Las
obligaciones actuales no incluyen las nuevas pruebas de columna y período:
las 414 bases quedan sin ámbito verificado y los 60 replays documentales del
salario quedan sin verificar. La prueba aritmética independiente de los 196 pares
IPC y cinco bases de 2018 conserva su alcance matemático, sin acreditar vigencia.

El cierre es técnico y acotado a los cinco defectos. Siguen pendientes la
provisión documental del ámbito real de SS, el redondeo y las condiciones de
admisión del lote. No se aceptan puertas ni se declara terminada la auditoría
fiscal de 2012–2026. [Decisión y coste](../../DECISIONES.md#contexto-físico-obligatorio-en-unidades-y-enlaces-ipcss-4-de-noviembre).
