# D: cotizaciones estimadas y alcance para el producto

Nota de producto del 4 de noviembre de 2026. D corresponde a **redondeo observado en cotizaciones**, según PLAN-COMPLETO.md. Esta nota reutiliza investigación conservada; no incorpora una ejecución nueva de TGSS o AEAT ni cierra D.

## Decisión aplicable al rediseño

El producto familiar puede avanzar con el contrato actual. La falta de política mensual TGSS no bloquea el cálculo de IRPF con cotizaciones efectivas admitidas por su entrada. El anual salarial exige esos importes efectivos; el anual canónico conserva su estimación uniforme y su alcance. No se intercambian ambos datos automáticamente.

| Entrada o resultado | Uso y texto para el producto |
| --- | --- |
| Cotizaciones efectivas de la entrada salarial | Campo: «Cotizaciones a la Seguridad Social satisfechas». Ayuda: «Introduce el importe de tu certificado de retenciones o de tus nóminas correspondiente al ejercicio». Se conserva la procedencia exigida por el contrato; la API no autentica por sí sola el documento. |
| Estimación del perfil uniforme | Resultado: «Cotizaciones estimadas». Ayuda: «Estimación para doce mensualidades uniformes. Puede diferir de la suma de tus nóminas». Detalle: «No incluye todas las particularidades de cotización». |
| Solicitud de cuota mensual a ingresar en TGSS | No hay una salida admitida para este uso. Mensaje: «Este cálculo no determina la cuota mensual a ingresar en la Seguridad Social». |

La capa de presentación puede mostrar euros con dos decimales. Ese formato no cambia la naturaleza del cálculo ni convierte una estimación en una suma de cuotas mensuales. Se conserva la precisión del motor hasta la conversión prevista por cada contrato.

El discriminante técnico de la estimación sigue siendo `alcance: "analitico-doce-mensualidades-uniformes"`, `redondeoTgss: "pendiente"`, en `laboral/cotizaciones-perfil-uniforme.ts`. El núcleo anual conserva `cotizaciones.naturaleza`: `efectivas` o `estimadas-perfil-uniforme`. El adaptador de producto debe conservar esa distinción aunque solo exponga un importe redondeado. No es necesario crear otro motor ni ampliar la arquitectura.

## Qué permite afirmar la evidencia reutilizada

- La investigación de Ley del euro distingue criterio de empate, periodicidad y etapa. La liquidación ordinaria mensual y la suma de saldos finales en céntimos no identifican dónde se cuantizan todos los componentes SLD.
- CX-01: el perfil anual uniforme tiene un alcance analítico explícito; representar liquidaciones reales exige hechos mensuales y otro contrato. No hay un fallo demostrado contra ese alcance.
- CX-03: el empate positivo superior tiene respaldo en los ámbitos examinados. Siguen pendientes la unidad y orden de cuantización SLD y la conciliación entre aportaciones y total; no falta toda regla de redondeo.
- Una calculadora AEAT permite observar su propio comportamiento de retenciones. Ese resultado no se etiqueta como liquidación TGSS. Renta WEB Open que recibe un gasto de cotizaciones tampoco acredita cómo se calculó ese gasto.

No se reescriben los dictámenes históricos CX-01/CX-03 ni se promueve ninguna variante a cuota oficial. La ampliación revisada de Ley del euro es la referencia para interpretar esos pendientes; las fichas históricas conservan su versión.

## Tres contrastes suficientes para orientar la siguiente actuación

Se reutilizan los casos; no se descargan otra vez los originales ni se genera un corpus masivo.

1. **Reparto entre empresa y trabajador:** Fichero de Cálculos, portada diciembre de 2021, anexo XML p.57, ejemplo de período 2019. Publica base 125,00; desempleo trabajador 1,94, empresa 6,87 y total 8,81. El producto empresarial compatible 125 × 5,50 % = 6,875 redondeado directamente da 6,88; total menos trabajador da 6,87. Discrimina alternativas en ese ejemplo, pero también admite otras explicaciones o una errata. No demuestra un residual empresarial universal ni vigencia 2025.
2. **Acumulación de conceptos:** consulta de cálculos, manual de octubre de 2018, p.24. Publica base 2.600,71; desempleo 183,35; FOGASA 5,20; FP 18,20; suma 206,75. El producto agregado hipotético por 7,95 % da 206,756445 → 206,76. Discrimina acumulación de cuotas en céntimos frente a un solo redondeo del producto agregado en esa fila histórica; no identifica empates ni solidaridad 2025.
3. **Solidaridad y etapa:** escenario sintético conservado para 2025, vector 8 × 11.041,67 + 4 × 11.041,66 = 132.500. Por empresa/trabajador, cuantizar por fracción y mes da 673,44/132,84; sumar fracciones y cuantizar por mes da 673,44/132,72; sumar productos del año y cuantizar al final da 673,42/132,74. Ninguna de las variantes es una salida oficial observada. `expectedNormativoTgss` permanece `null`.

Estos tres contrastes no cierran el desempate universal, IT/IMS, signos negativos ni ajustes. No deben usarse como pruebas fiscales esperadas. Los casos pequeños de céntimos del corpus tampoco demuestran elegibilidad de una base laboral real.

## Próximo experimento, solo cuando exista una herramienta adecuada

Primero comprobar si la herramienta oficial admite hechos suficientes y muestra cotizaciones por concepto y aportación. Registrar nombre, versión/fecha, período, fuente y huella del artefacto. Si únicamente calcula retenciones o recibe las cotizaciones como dato, no sirve para resolver D por sí sola.

Para un caso sintético admisible registrar: días y modalidad de cotización, grupo, contrato, jornada, remuneración y prorrata, base por contingencia, tramos temporales, tarifa elegible IT/IMS, conceptos, aportaciones y salida íntegra. Reutilizar el tercer contraste solo si la herramienta admite esa remuneración y permite observar las etapas que se quieren distinguir. Si lo oculta en un agregado, documentar esa limitación; una coincidencia final aislada no identifica la política.

Comparar la salida sin tolerancia de un céntimo ni ajuste de residuos para cuadrar. Conservar un caso de empate positivo que separe HALF_UP y HALF_EVEN, además de los contrastes de etapa; `1,015` no los distingue. Rectificaciones negativas requieren evidencia propia, no extrapolación del empate positivo.

Una regla nueva se describirá como «comportamiento observado en herramienta oficial», con versión, entradas, salidas, alcance y prueba discriminante. Cualquier cambio de importes o nuevos datos públicos pasará una única revisión independiente acotada antes de integrarse. No se repite la revisión favorable de la investigación conservada por rutina.

## Referencias reutilizadas

- [API vigente](API-MOTOR.md), apartados «Retenciones y cotizaciones estimadas» y contrato de composición anual.
- [Investigación Ley del euro](auditorias/redondeo-ley-euro/INFORME.md), [revisión independiente favorable acotada](auditorias/redondeo-ley-euro/revision-independiente.json), [discriminantes exactos](auditorias/redondeo-ley-euro/discriminantes.json) y [contrato analítico observado entonces](auditorias/redondeo-ley-euro/contrato-existente.json).
- [Etapas operativas TGSS](auditorias/tgss-etapas-operativas/INFORME.md) y [contrarrevisión mensual](revisiones/redondeo-tgss-mensual-v1/INFORME.md). Son investigaciones históricas con ámbitos declarados.
- Original del [Fichero de Cálculos](https://www.seg-social.es/descarga/es/187654), SHA-256 `f5e22887ee94801b315e8c2a9cc4f235567a5dd826b53cdb1a4adbb7ea65a386`, identificado en `auditorias/tgss-etapas-operativas/reutilizados.json`. Reutilizar por hash en el almacén externo; el enlace puede servir otra versión en el futuro.

## Estado de esta entrega

Nota incorporada al tramo acotado de producto; sin cambio de código, importes ni datos fiscales. No hay nueva simulación oficial ni política TGSS elegida; D general sigue pendiente. No bloquea E por acreditación universal pendiente. El siguiente avance útil requiere una observación oficial discriminante, no otra ronda general de acreditación ni un rediseño de arquitectura.
