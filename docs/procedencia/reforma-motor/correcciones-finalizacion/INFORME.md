# Retirada de escalas duplicadas y rechazo de modalidad anual

Se corrigen R-M01, R-M02 y R-M03 de la [revisión independiente](../revision-finalizacion/INFORME.md). Los tres fallos se reprodujeron antes de editar. La revisión de los fixes de identidad de nacimiento de Madrid y guardería de Murcia ya era favorable y no se reabre.

| Observación | Cambio y comprobación |
| --- | --- |
| R-M01: helper de cuota con límites truncados | Se retiran las dos funciones generales sin ámbito, el selector legacy y sus cuatro tablas. El cálculo usa el evaluador común y los parámetros del selector territorial. La representación vigente de 2014 conserva 4382,532 euros en el caso técnico de frontera 17707,20; la cuota anual continúa en 438253 céntimos. |
| R-M02: tabla exportada truncada | Se retira la función, su reexportación y la hoja CONTROL_TRAMOS_IRPF del libro corriente. Las pruebas de exportación comprueban las hojas restantes y los valores recibidos. |
| R-M03: conjunta admitida sin derechos | La API y el servicio rechazan cualquier modalidad distinta de individual antes del cálculo, independientemente de la presencia de derechos. Los adversos distinguen el error recuperable de un defecto de ejecución. No se habilita conjunta anual. |

El escenario simulado que duplica la parte estatal también usaba la tabla separada. Las filas derivadas coinciden con las anteriores en 2016–2020; desde 2021 cambia el último tipo simulado de 47 % a 49 %. Se conserva el contraejemplo: un euro adicional sobre 300.000 generaba 47 céntimos en vez de 49. El test comprueba la variación en los seis ejercicios 2021–2026. Esto describe el escenario técnico, no una tarifa autonómica real ni la validación normativa de 2026. Las tarifas reales y las fronteras canarias no se cambian.

Las primeras cinco suites suman 82 pases: regresiones de las observaciones, identidad de conjunta, retirada, exportación Excel y los ejemplos salariales. Tipos principales/vendor y lint pasan; lint conserva avisos previos. Las nuevas regresiones forman parte del workflow ordinario. La comprobación completa previa al push se ejecuta en exportación sin Git; el corpus externo completo sigue siendo una suite local separada.

Las pruebas rojas de la revisión se conservan como texto, byte a byte y con su hash, porque importan funciones retiradas. `tests/motor-unico-revision.test.ts` comprueba la ausencia de esas superficies y el comportamiento de sus sucesores. No se cambia la expectativa del rojo original para hacerlo pasar ni se vuelve a implementar la tarifa incorrecta como fixture financiero.

Los inventarios y pines actuales se regeneran; los snapshots y dictámenes históricos no se convierten en aceptación de este código. La composición entre el recorrido técnico y el de importes efectivos, el contrato completo de deducciones, la extensión familiar 2012–2026 y los bloques A–F siguen pendientes. Estas correcciones necesitan un contraste independiente nuevo y acotado.
