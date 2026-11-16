# Candidato conjunto ordinario2025

Estado: candidato con pruebas focales, tipos y revisión de coherencia. Las entradas son diez hogares sintéticos, ocho matrimoniales y dos monoparentales, conservados como conjuntos. La medición pública mantiene sus diez resultados pendientes: una inspección exploratoria de pantalla no equivale a una captura SES/PDF vinculada. Los importes legales citados son parámetros normativos.

## Contrato cerrado

`lib/dominio/irpf/conjunta-2025/contrato.ts` define una entrada propia, discriminada por `perfil: conjunta-trabajo-ordinario-2025` y `modalidad: conjunta`. Declarante18–64, cónyuge18–64 sólo en matrimonio no separado, un hijo menor de tres años sin rentas ni vida independiente. Todos residentes IRPF, vivos y convivientes todo2025 en el mismo territorio. No hay actividades, ahorro, inmuebles, ganancias, discapacidad, fallecimientos, saldos, previsión social ni deducciones adicionales. El corte acepta exclusivamente los ocho territorios presentes en estos diez hogares.

Cada persona expresa opción conjunta, unidad, ausencia de declaración separada y de pertenencia a otra unidad. Se exige igualdad de los censos completos de miembros, personas y convivencia, identidades únicas, fecha civil válida y titulares completos del hijo. En matrimonio ambos progenitores son titulares convivientes. En monoparental hay un único titular y otro progenitor externo sin convivencia, derecho al mínimo, dependencia, alimentos ni inclusión en otra conjunta. Una declaración individual incompatible o miembro duplicado se rechaza; no se convierte modalidad alguna.

La guarda se declara expresamente: ambos cónyuges convivientes o guarda exclusiva
del declarante durante todo 2025. Una guarda compartida, desconocida o incompatible
con el tipo de unidad queda fuera. Es un hecho sintético adicional del contrato,
no una conclusión inferida de la ausencia de rentas del otro progenitor. También
se rechaza un nacimiento posterior al 1 de enero de 2025 cuando la entrada afirma
vida y convivencia durante todo el año; no se generaliza esa restricción técnica
a los derechos legales de un recién nacido.

La economía identifica un perceptor y todos los demás miembros sin rentas. Se exige empleo laboral único con cotizaciones efectivas y bruto>=30000EUR. Este límite técnico cubre los diez hogares y deja fuera DA61 positiva conjunta, cuya atribución necesita ampliar el contrato. No es un umbral legal de admisión de conjunta. La conciliación anual y las retenciones efectivas conservan operaciones y procedencias; se rechazan retenciones repetidas. No se estima SS a partir del salario.

## Ruta y extensión del núcleo

`preparar.ts` reutiliza `baseTrabajoMiembro2025` y `adaptarTrabajoAnual`: art19 y art20 existentes, sin activar compatibilidad Open individual. Cónyuge e hijo permanecen explícitos con base y pagos cero. No se amplía el productor civil familiar existente ni sus territorios.

`anual.ts` llama una vez a `componerLiquidacionAnual` y una vez a `liquidarPagosAnuales`. El despacho de `trabajo-anual/conexion.ts` reconoce el nuevo perfil antes del despacho anterior. `conexion-contrato.ts` expone la unión `CasoFiscalAnualConConjunta2025`, conservando `CasoFiscalAnualExplicito` para las entradas individuales. La API canónica y sus productores conservan sus contratos.

La extensión interna de `liquidacion/composicion-anual.ts` admite tipo conjunto sólo con el contrato completo; vuelve a validar hechos y conciliación de bases, salarios, cotizaciones, edad y territorio, exige precisión80 y política decimal ordinaria y excluye otros productores. Aplica una etapa identificada antes de escalas: reducción3400 matrimonial o2150 monoparental, limitada primero a base general y remanente a ahorro sin negatividad. El ahorro sigue rechazado en esta API; la función de etapa permite preparar su prueba normativa aislada.

Se reutilizan los selectores regionales, escalas y parámetros existentes. El mínimo del contribuyente estatal se aplica una vez; el hijo recibe el mínimo completo de primer descendiente y menor de tres, sin reparto individual. El mínimo autonómico usa la tabla del territorio. El núcleo no recibe mínimos calculados por el cliente. La firma del auxiliar de discapacidad sólo pide el dato que utiliza; no cambia su cálculo ni amplía sus hechos admisibles.

DA61 conserva la fórmula común; su contrato añade un ámbito explícito conjunto limitado a bruto>=30000 y otras rentas cero. En este corte el importe legal es cero. La composición aporta BLG como renta atribuible al único empleo en ausencia de otras fuentes; esta implementación no acredita la proporción para una DA61 conjunta positiva. La salida distingue BIG, reducción teórica/aplicada, BLG, mínimos, pagos y diferencial, con rastro propio; no etiqueta nada como resultado Open.

## Datos y aceptación

`entradas-candidatas.json` contiene adiciones laterales para los diez IDs, con hash del expediente original y referencia relativa. Conserva literalmente trabajo, SS efectiva, conciliación y retenciones; toma titulares y convivencia del hogar preparado. No modifica expedientes, `entradaAPI:null`, resultadoOpen, datos de muestra80, inputs, pesos ni resultadoAPI. Tras validación del integrador se podrá promover cada entrada explícitamente. No hay adaptador Open conjunto acreditado y por eso no cambia el medidor ni su contrato de aceptación: aún no existe ruta única de medición entrada/API/Open.

## Fuentes primarias consultadas

Lectura web del16/11/2026; todas específicas del ejercicio2025:

- [Unidad familiar AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c02-irpf-cuestiones-generales/sujecion-irpf-aspectos-personales/unidad-familiar-irpf.html): modalidades, totalidad de hijos elegibles, pertenencia única y determinación al31/12. Aplicación: `contrato.ts`, `preparar.ts`.
- [Opción conjunta AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c02-irpf-cuestiones-generales/sujecion-irpf-aspectos-personales/tributacion-individual-opcion-tributacion-conjunta.html): opción de todos, acumulación de rentas, escalas comunes, mínimo personal único y reducción previa3400/2150 con topes en ambas bases. Excluye2150 cuando convive el otro progenitor. Aplicación: `preparar.ts`, `liquidacion/composicion-anual.ts`.
- [Cuantías de descendientes AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/cuantias-aplicables.html) y [condiciones AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/condiciones-aplicacion-minimo-descendientes.html): primer hijo y aumento por menor de tres; titulares y devengo. Aplicación: `liquidacion/composicion-anual.ts`, parámetros territoriales ya existentes.
- [Gastos art19.2.f AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c03-rendimientos-trabajo/rendimiento-neto-trabajo-integrar-base-imponible/fase-2-determinacion-rendimiento-neto/particular-analisis-gastos-articulo-19_2_f-lirpf.html): límite por unidad; un perceptor permite reutilizar el productor sin multiplicar gastos.
- [Novedades INFORMA septiembre2025 AEAT](https://sede.agenciatributaria.gob.es/Sede/irpf/novedades-impuesto/novedades-publicadas-informa-2025/novedades-publicadas-informa-mes-septiembre.html): DA61 limitada a rendimientos de servicios inferiores a18276EUR. Justifica el importe cero en el corte técnico>=30000, no una fórmula nueva.

Las rutas abreviadas de implementación se resuelven en `lib/dominio/irpf/conjunta-2025/`; las demás son relativas a la raíz. Los patrones Effect se consultaron en sus fuentes Effect/Schema y en los productores del proyecto; no se instalaron herramientas.

## Validación y pendientes

`tests/conjunta-ordinaria-2025.test.ts` comprueba diez entradas sin cuotas oficiales, casos negativos civiles/económicos, remanente aislado, coherencia de composición y diez controles individuales independientes. Pasaron 188 pruebas entre esta suite, DT18 ordinaria y dos regresiones de CLM. El control global de tipos y los tipos de las herramientas también pasan. Se corrigieron el uso de fechas civiles, el alcance de la unión de esquemas y dos anotaciones de fixtures, sin cambiar esperados monetarios.

La revisión independiente de conjunta y DT18 señaló dos contradicciones de
hechos: nacimiento tardío frente a convivencia anual, e inversión anterior a la
primera adquisición sin anticipos. Las dos se reprodujeron antes de corregirlas;
las seis pruebas independientes y las regresiones focales posteriores pasaron
194 controles. Se preservaron las entradas y los esperados monetarios. La guarda
monoparental se hizo explícita después como condición del corte, con pruebas de
ausencia y contradicción.

Quedan pendientes las diez vinculaciones completas con Open. Las regresiones
de publicación incluyen `tests/conexion-anual.test.ts`,
`tests/composicion-anual-unica.test.ts`, `tests/composicion-anual-revision.test.ts`,
`tests/minimos-derechos-anuales.test.ts` y
`tests/productores-anuales-combinacion.test.ts`. Los controles técnicos no
acreditan aceptación fiscal universal ni resultados oficiales conjuntos.
