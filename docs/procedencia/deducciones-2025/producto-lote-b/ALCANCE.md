# Lote B por hechos · sublote de implementación 2025

Se añaden nueve evaluadores parciales en un módulo independiente, con una matriz de los 48 códigos. Se conservan los dos códigos cántabros por hechos ya existentes sin copiar su aritmética. Los otros 37 necesitan implementación posterior: la matriz concreta la regla y el contrato pendientes por código. Esta entrega no cierra el lote ni certifica derechos de expedientes particulares.

La evidencia es la ya auditada en `lotes/b`, `correcciones/b`, `revisiones/b-condiciones` y `revisiones/cinco-rectificaciones`. PRE/1/2025 se deriva de `correcciones/b-condiciones/municipios.json`: 41 códigos, incluidos tratamiento especial y riesgo grave. El solicitante aporta un código INE y un documento de residencia; no puede elegir la lista normativa. No se ha repetido auditoría, descarga ni extracción CAS. El manifiesto privado fija hashes de los insumos leídos.

## API y exactitud

`evaluarHechosB2025(marco, hechos)` recibe una unión discriminada `HechosB`. `MarcoB` identifica ejercicio, territorio, modalidad, contribuyente, declarantes exhaustivos y las dos bases imponibles. Cada rama añade personas, fechas, magnitudes, documentos y pagos concretos. No existe un campo `cumple`, elegibilidad genérica ni una fórmula elegida por el consumidor. El contrato TypeScript requiere entradas tipadas; la frontera de API del padre deberá decodificar objetos desconocidos antes de llamar. Los controles internos monetarios, temporales, de duplicación, ámbito y exhaustividad rechazan entradas inválidas. No se ofrece un decodificador de JSON en este sublote.

La salida distingue `calculo_parcial`, `excluida` y `no_soportado`. Los rechazos no incluyen importe. Un cero parcial sólo significa colección exhaustiva sin hechos que generen cuantía, pagos excluidos o gasto neto cero; no representa falta de soporte ni impuesto liquidado. Toda cuantía positiva o cero conserva aceptación fiscal pendiente y aplicación de cuota pendiente del padre. No se agrega a la liquidación anual.

Moneda de entrada: cadena decimal de euros, no negativa, hasta 18 dígitos enteros y dos decimales. No se admite notación exponencial. Las bases negativas se rechazan sin afirmar exclusión fiscal; su soporte es una ampliación posterior del contrato. La aritmética usa un clon local de Decimal con precisión 100 y resultados racionales reducidos `{numeradorEuros, divisor}`; conserva 500/3 y fracciones de céntimo. Los porcentajes y cantidades monetarias nunca operan con Number. La presentación `presentarB` redondea explícitamente a dos decimales, separada del cálculo y sin reutilizar su salida como hecho.

Para acotar precisión y consumo se aceptan como máximo mil registros por colección de gastos/personas y diez titulares de un reparto. Los IDs y repartos son hechos del expediente, no certificados fiscales. Las edades se calculan al devengo ordinario 31/12/2025; los devengos anticipados por fallecimiento requieren otro contrato y no están cubiertos.

## Ramas entregadas

| Código abreviado | Regla implementada | Límite concreto |
| --- | --- | --- |
| Asturias acogimiento menores | 250 en 91–182 días, 500 desde 183; minoría de edad, exclusión preadoptiva y reparto racional | Identidades distintas y convivencia limitada por intervalo civil en2025; no reconstruye intervalos distintos por titular |
| Asturias acogimiento mayores | >65 años, >183 días, 500; ayuda de ambas partes, remuneración, parentesco y base 26000/37000 | Resolución del acogimiento aportada, sin verificar autenticidad |
| Asturias certificación forestal | 30% del expediente total neto de subvención, reparto y después máximo personal1000; año de obtención | Propiedad anterior a certificación y gastos; una certificación/monte, agregación entre montes pendiente |
| Asturias gastos vitales | Gastos concretos y topes 2000/1500/1000; edad y base <=28000 | Individual; exactamente30 se rechaza por R30, sin extender reserva a las demás edades |
| Asturias vivienda protegida | Gasto propio efectivo limitado por máximo inicial5000/sucesivo1000 repartido entre titulares | Sólo generación2025; cuota y arrastre tres años a cargo del padre |
| Cantabria estudios | 200 por hijo, mitad individual; <25 años, renta <8000, estudios fuera y pagos bancarios | BC02 excluye exactamente8000; progenitores distintos del hijo, curso solapado con2025, residencia documentada y lista fijada |
| Cantabria educación | Libros100% + idiomas extraescolares15%, máximo familiar200; etapa y medio de pago | Conjunta; individual rechaza hasta representar gasto familiar completo de ambos progenitores |
| Cantabria enfermedad | 10% de honorarios sanitarios no cubiertos, máximo500/700 +100 por declarante >=65; base liquidable minorada estricta | Personas del mínimo y certificado sanitario aportados, no certifica su derecho |
| Cantabria monoparental | 200; base minorada <31485; vínculo, convivencia y medidas judiciales | Individual; BC01 distingue patria transitoria (resolución originaria anterior a3/9/2021), representativa del manual y asistencial insuficiente |

En forestal, `pagosCertificacion` y `subvenciones` son el expediente común completo de todos los titulares; se reparte la cuantía antes de imponer el máximo personal1000. Esta rama se limita a individual; composición conjunta pendiente. En vivienda protegida, `pagos` es gasto propio de los declarantes y sólo se reparte el máximo. Mezclarlos produciría un doble reparto: los tests fijan ambos contratos.

Las entradas de gasto sólo incluyen conceptos atribuibles a esa rama, con ID, pagador, receptor, fecha, importe y justificante. En enfermedad, el importe cubierto por Seguridad Social, mutua o seguro se identifica por cada honorario; no se inventa deducción por una prestación cubierta. Para educación y estudios, el efectivo queda fuera. Los pagos de otro año no suman. Las categorías de gasto y documentos identificados siguen requiriendo contraste del caso; un cálculo parcial no acredita su autenticidad.

## Conexión que queda al padre

La cuota común no se reproduce ni se recibe como importe intercambiable por gasto. El padre deberá aplicar una sola cuota disponible, evitar duplicar solicitudes/consignaciones, componer expedientes y máximos por contribuyente, y gestionar el arrastre de vivienda protegida tres años después de deducciones corrientes. La ayuda ELA sigue pendiente: requiere identificar ayuda integrada en base general y la parte en base liquidable, y enlazar tipos medios de gravamen identificados con la liquidación; no se inventa tipo ni una fórmula escalar externa. El rastro del resultado es normativo y de decisiones; el padre debe enlazarlo a la identidad de la solicitud/pagos al componer resultados.

Los dos contratos existentes se localizan en `hechos-auxiliar-2025.ts`: alquiler cántabro y nacimiento cántabro. No se vuelven a implementar. Sus límites, incluido el contrato de elegibilidad externa y cantidades Number heredadas, no se presentan como resueltos por esta entrega. Para producción hace falta adaptador explícito; no convertir el racional a Number silenciosamente.

## Validación y recepción

La entrega incluye tests propios con expectativas numéricas independientes del catálogo y de constantes internas: límites de días, edad/base, tres rentas alrededor de8000, pagos bancarios/efectivo, ayudas, coberturas, topes, tercio exacto, fechas imposibles, duplicados y documentos ausentes. La comparación de cantidades usa productos racionales BigInt en el test.

La fase ligera se amplió tras asignación explícita de PESADO2. Validación final de autor: 48 pruebas Vitest correctas con un worker, tipos focales correctos heredando la configuración y diagnósticos Effect de raíz, Oxlint con anti-slop y ESLint focales correctos. El control Python verifica transporte, cobertura48, clasificación9/2/37, lista territorial y hashes. Se conservan rojos y comandos en la validación privada. No se ejecutaron inventario ni CI global. Se usan DateTime/Option y Schema.TaggedErrorClass después de consultar effect-solutions list/show y fuente local; no hay ejecución asíncrona ni servicios Effect en el evaluador puro.

Para repetir tras integración en el entorno de desarrollo del proyecto, con turno pesado y sin otras suites propias simultáneas:

```sh
timeout -k 30s 20m bun run test tests/deducciones-asturias-cantabria-hechos-2025.test.ts --maxWorkers=1
timeout -k 30s 12m bun run typecheck
```

La validación privada usó directamente el Oxlint fijado en node_modules y .oxlintrc.json de raíz, incluidos ambos plugins anti-slop; ESLint usó la configuración de raíz y --max-warnings=0. No hay cambio de workflow ni publicación en esta entrega. El padre conserva revisión, recepción, conexión e integración. El parche sólo crea módulo, tests y documentación propia; no toca dispatcher, anual, archivos comunes ni rutas de Catalunya, Madrid/Murcia o Valencia.

## Antecedentes temporales y correcciones de autor

Acogimiento incluye inicio/fin y días efectivos: los días declarados no pueden superar la intersección del intervalo con2025, ni empezar antes del nacimiento. La resolución tampoco puede preceder al nacimiento. En estudios se identifican ambos progenitores, se impide que el hijo sea cualquiera de ellos y se exige un intervalo de estudios coincidente con2025; los pagos no pueden preceder al nacimiento. En monoparentalidad la resolución judicial es la originaria constitutiva de la medida, no una referencia genérica ni un certificado posterior de continuidad. Para patria prorrogada/rehabilitada se exige antecedente anterior al3/9/2021; se conserva su carácter transitorio conforme a BC01/DTsegunda. Una resolución originaria posterior no se acepta por repetir la etiqueta transitoria. Las resoluciones no se autentican ni su fecha acredita por sí sola la vigencia actual: el tipo de medida y su continuidad son hechos declarados del expediente sujetos a contraste, con resultado parcial.

La corrección de vivienda sigue sin calcular consumo de cuota o arrastre. No se añaden dispatcher ni anual. Las pruebas y hashes acreditan la validación técnica de este alcance, no la revisión independiente ni la acreditación fiscal particular.
