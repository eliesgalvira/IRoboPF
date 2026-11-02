# Integración candidata del motor único

La liquidación anual y las retenciones admitidas conectan los derechos familiares completos. El análisis salarial consume la cuota anual. La API de importes efectivos mantiene un recorrido condicionado separado, cuya composición global sigue pendiente. Se retiran los helpers familiares insuficientes, la selección legacy y las fórmulas fiscales salariales paralelas. La API y sus unidades están en [API-MOTOR.md](../../API-MOTOR.md). Los datos regionales y de deducciones permanecen intactos.

La cobertura familiar sigue acotada a Madrid 2025 individual con los hechos de `DerechosMinimos2025`. Los casos restantes se rechazan explícitamente. El perfil salarial con importes efectivos conserva sus siete ejemplos oficiales; una comparación aritmética no amplía su cobertura normativa. Los bloques A–F y las cuatro puertas siguen pendientes.

## Contratos de procedencia

Los artefactos R32–R57 anteriores conservan su genealogía histórica. Sus certificados de composición y causalidad no acreditan las fuentes reformadas. No se regeneran sus aceptaciones ni se modifica un snapshot histórico para hacer pasar el motor actual.

`contrato-motor-unico.ts` produce un censo AST de llamadas y argumentos, con localizadores UTF-16 y hashes de las fuentes actuales. Rechaza fuentes distintas y alteraciones del censo. Es un contrato estructural comprobable, acompañado de pruebas directas de producto; **no sustituye la interpretación simbólica financiera de los grafos anteriores**. Su reconstrucción simbólica y revisión independiente siguen pendientes. Las pruebas actuales contrastan la cuota anual con el análisis salarial en fronteras de salario; comprueban reparto, rechazos, retenciones, importes efectivos, variantes de adaptadores y conservación de registros sin prototipo. No se afirma cobertura dinámica de cada arista del grafo histórico.

El inventario actual se regenera desde las fuentes y se coteja por contenido; los pines actuales cambian con las rutas retiradas, la conexión mediante derechos y la única cotización estimada. Los pines históricos incrustados conservan su versión y no se convierten en aceptación del código nuevo. No se requiere Git histórico, CAS privado ni fixtures preinstaladas para las comprobaciones ordinarias.

## Pruebas retiradas o sustituidas

| Prueba anterior | Motivo | Comprobación vigente |
| --- | --- | --- |
| `auditoria-excel-pesada.test.ts` | Ejecutaba las fórmulas tabulares retiradas. | `retirada-rutas.test.ts`, análisis salarial sobre liquidación; hashes documentales de las hojas históricas conservados. No se afirma equivalencia con Excel. |
| `calculo-salario-legacy.test.ts` | Solo ejercía el motor eliminado. | `retirada-rutas.test.ts`, `puertos-composicion-r47.test.ts` y `conexion-anual.test.ts`: única cuota, neto y ejemplos oficiales. |
| `comparativa-inflacion-tabular.test.ts` | Segunda tabulación fiscal eliminada. | `progresividad.test.ts`, `ipc-escenarios-procedencia.test.ts`, consumidores de liquidaciones nominales. |
| `progresividad-caracterizacion-legacy.test.ts` | Caracterizaba resultados de la ruta retirada. | `progresividad.test.ts` e `importes-comparables.test.ts`; las expectativas legacy no son un oracle fiscal. |
| `redondeos-legacy-oracle.test.ts` | Ejecutaba el algoritmo histórico. | `dinero.test.ts`, `conexion-anual.test.ts` y contratos monetarios. El redondeo TGSS continúa pendiente. |
| Casos legacy en suites mixtas | Funciones y modo eliminados. | Se conservan las ramas canónicas; se añaden rechazo de entradas antiguas y contraste del único reparto por tipos de pagador. |
| Composición R47 sobre funciones retiradas | Su dominio incluía rutas y fórmulas eliminadas. | Censo AST actual con mutaciones de fuentes/llamadas/argumentos y cuota/neto contra liquidación anual. Interpretación simbólica completa pendiente. |
| Transporte R52 a través de R47 | El router anterior ya no corresponde al producto. | Se conserva el observador de registros/arrays/Decimal de rentas; se comprueban los gastos efectivos y las etapas/variantes de los adaptadores actuales. Transporte simbólico entre todos los fragmentos pendiente. |

El workflow y `scripts/ci-comprobaciones.sh` sustituyen los nombres de pruebas retiradas por las suites de liquidación, derechos y retirada; no excluyen las suites ordinarias para ocultar errores. La entrega sigue siendo candidata hasta revisión independiente de sus bytes exactos.

## Finalización de conjunta

Los controles F-C01 y F-C02 se conservan. Antes del cambio, F-M01 devolvía cero y F-M02 rechazaba al usar como referencia al primer declarante. La prueba ordinaria `deducciones-conjunta-identidad.test.ts` conserva los cuatro casos y añade ambos órdenes y referencias, API directa y despachador, varios titulares, máximos por hijo, reparto individual y rechazos por unidad incompleta, discrepancias de identidad y titulares ajenos. Las fórmulas se mantienen en `contratos-2025.ts`; los auxiliares propagan las identidades completas a esa única ruta.

Se conserva la comprobación completa de los 351 manifiestos de deducciones en workflow y script. Los inventarios se regeneran desde las fuentes finales; los pines excluyen las rutas retiradas y fijan las fuentes actuales de los contratos que permanecen, sin reetiquetar evidencia histórica ni promover puertas de aceptación. Los logs y la matriz de comandos se entregan privadamente para recepción y revisión independiente.

## Validación de la entrega final

Se ejecutaron los 22 comandos del workflow, cotejados con el script (incluida la instalación congelada), con resultado correcto. `bun run build` terminó correctamente con `experimental.cpus: 1`; no hubo fallos de red. Las diez pruebas ordinarias de identidad incluyen los dos rojos reproducidos antes de editar el motor de deducciones y sus controles históricos. Tipos y lint pasan sin supresiones nuevas. Se conservan privadamente tanto los logs fallidos intermedios como la pasada final.

Esta pasada se realizó en el checkout preparado. La repetición completa en una exportación sin Git corresponde a la recepción del padre; no se creó otra exportación de la base ni del corpus. El ensayo de transporte reconstruye únicamente las rutas cambiadas, byte a byte, usando patch, preimágenes y payload sin Git. La entrega sigue pendiente de revisión independiente y no modifica la confianza ni las puertas fiscales.

## Correcciones posteriores a la revisión

La [revisión independiente](../revision-finalizacion/INFORME.md) confirmó dos superficies con tarifas truncadas y la admisión indebida de conjunta desde JavaScript; la liquidación pública de 2014 no sufría ese primer error. Los dos arreglos de identidad de deducciones quedaron contrastados: nacimiento de Madrid y guardería de Murcia, no material escolar.

Los [arreglos de las tres observaciones](../correcciones-finalizacion/INFORME.md) retiran los helpers y la tabla incorrectos y rechazan modalidad anual fuera del contrato antes del cálculo. Se conserva la distinción entre revisión de los arreglos de conjunta ya favorable y el contraste nuevo pendiente de estos tres cambios. No se declara terminada la reforma, la composición ni la extensión familiar a otros territorios y años.
