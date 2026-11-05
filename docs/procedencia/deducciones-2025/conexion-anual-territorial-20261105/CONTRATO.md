# Conexión anual territorial 2025

Implementación parcial sobre las 55 altas publicadas en bc351098249470ecddd55049113063429c1a7af8. No modifica matrices, revisiones favorables ni fichas normativas. Revisión independiente y contrastes P1 terminados con dictamen favorable acotado; CI de integración pendiente.

## Entrada y fuente de magnitudes

Ambas API reciben `deduccionesTerritoriales2025: { solicitudes: [...] }`. En la efectiva, declarar `deducciones: "territoriales-por-hechos-y-da61"`. Cada solicitud discrimina su lote (A, B, C, CLM, CYL, EXT, E, F) y código; la unión Schema es cerrada, valida objetos anidados y rechaza campos sobrantes. No hay bolsa de hechos desconocidos. El tipo auxiliar y su generador privado producen esa unión estática: no existe generación dinámica en producción.

El caso anual selecciona ejercicio, territorio, contribuyente, modalidad, devengo y declarantes. La composición única inyecta bases general/ahorro (imponibles y liquidables coinciden en los perfiles sin reducciones de base admitidos), mínimo personal/familiar y cuota autonómica general más ahorro después de mínimos. Los hechos no pueden introducir esas magnitudes ni una cuota distinta. Catalunya y Galicia reciben esa cuota única como base de sus límites proporcionales y después se consume una sola vez en el libro común; no se recalcula una segunda cuota.

Las fechas de nacimiento particulares siguen siendo hechos porque el caso anual sólo contiene edad propia, no fecha propia completa. Se concilia la edad con el caso; para descendientes se concilian identidad, nacimiento exacto, edad y categoría de discapacidad con derechosMinimos. Los mínimos actuales exigidos por las ramas conectadas se contrastan con las atribuciones calculadas. Cada lista de titulares del mínimo se vincula al descendiente concreto y al conjunto completo de titulares de la atribución efectivamente calculada. La pertenencia al censo por sí sola no acredita un mínimo aplicable. No se transforma un expediente o referencia genérica en derecho. Grados declarados se concilian con las categorías fiscales; no se inventa un porcentaje exacto a partir de una categoría.

## Dinero y composición

A usa importeExactoEuros; B importeExacto.numeradorEuros/divisor (textos); C importeExacto (texto); D importeExacto (texto); E exacto.numeradorEuros/divisor (divisor numérico); F añade importeExactoEuros anterior a presentación. No se suman importes presentados, importe, importeCentimos ni presentacionEuros.

El libro usa enteros BigInt como fracciones exactas, conserva generado/aplicado/pendiente y consume disponibilidad una sola vez siguiendo el orden explícito del array solicitudes. El resultado incluye códigos, evaluaciones originales y reservas, total y saldo racionales, estado condicionado y aceptación fiscal pendiente. Al volver al cálculo anual Decimal se usa el constructor local ya seleccionado por la composición (precisión 20/80); la cuantización final conserva la política anual existente. No se aplica una nueva política de céntimos al entrar en evaluadores. La API monetaria anual conserva sus salidas enteras en céntimos.

Duplicados por código y por identidad de pago o documento monetario entre códigos se rechazan; los evaluadores preservan sus controles internos. CLM discapacidad propia/mayores75 se resuelve por los códigos solicitados, aun con elecciones externas vacías. No se mezclan hechos territoriales con agregado/consignaciones ni con la solicitud valenciana anterior. Valencia40 conserva su composición, restricciones y arrastres existentes.

## Alcance concreto

Hay adaptadores y contratos para las 55 altas; esto no significa todas las ramas calculables ni aceptación fiscal integral. Se conservan las exclusiones y no_soportado originales, con motivo, y jamás se convierten no_soportado o falta de salida exacta en cero. Una exclusión fiscal explícita sí genera cero. No se exige acreditación documental universal: documentos declarados suficientes producen resultado condicionado, con las reservas originales.

Sólo 2025 individual ordinario sin fallecimiento. La entrada efectiva conserva sus restricciones propias (sin discapacidad propia, otras rentas o reducciones; familiares según derechos); la analítica conserva su cotización estimada. Ninguna de estas rutas incorpora las rentas de cónyuges, otras personas ni pagadores ajenos al caso. Los censos territoriales de titulares pueden incluir otras personas para repartir un derecho sin sumar sus bases a las del declarante. Las ramas que requieren bases anuales de otras personas, declaración conjunta o cónyuge no representado quedan fuera, con motivo concreto.

Los ascendientes siguen sin representación en derechosMinimos: las ramas que requieren sus datos anuales no se habilitan con una referencia externa. D admite aquí sólo repartos de expansión decimal finita (factores 2 y 5): sus evaluadores originales devuelven texto decimal y no hay transporte racional exacto para tercios u otros divisores. Esa limitación evita presentar como exacta una aproximación del helper y no bloquea los otros lotes. B y E conservan sus fracciones, incluidos tercios. Se mantienen R30 de Asturias y demás ramas no soportadas por los evaluadores.

Esta entrega no conecta automáticamente todos los contratos heredados: se mantiene su comportamiento público; una salida heredada exclusivamente presentada no puede alimentar la nueva anual. No hay arrastre territorial nuevo ni aplicación simultánea de más de un expediente del mismo código; no se reclama que el saldo pendiente sea un arrastre legalmente utilizable.

## Ajustes mínimos en evaluadores auditados

- Catalunya: cuota opcional en euros decimales exactos, alternativa exclusiva al campo histórico de céntimos enteros; idéntica fórmula y salida anterior.
- B: parser separado de magnitudes anuales (bases y base liquidable menos mínimo); pagos mantienen dos decimales. La base minorada puede tener signo, sin sanearla a cero.
- C: parser separado de bases anuales hasta 80 decimales y precisión local de 200 cifras para conservar los límites; pagos mantienen su contrato previo.
- D: exportación de esquemas existentes para tipar el adaptador; parser exclusivo de bases/mínimo hasta80 decimales; los importes de hechos conservan el parser anterior hasta8 decimales. No se cambia la fórmula de reparto.
- E: validación específica de las tres magnitudes anuales derivadas; pagos mantienen su contrato.
- F: bases anuales decimales sin cuantizar y campo exacto antes del redondeo de presentación; importes públicos previos conservados. Los contratos heredados sin exacto siguen fuera de esta nueva composición.

La revisión independiente comprobó estos ajustes junto al libro y la conexión anual. No se reabren ni se atribuyen a esta conexión las revisiones favorables anteriores.

## Corrección tras revisión independiente

H1: se concilian también el nacimiento y discapacidad propios situados en la raíz de los hechos canarios y baleares. Una contradicción produce un rechazo explícito sin importe.

H2: Extremadura trabajo dependiente recibe el rendimiento íntegro y las demás rentas de la composición anual. Los duplicados de esos dos importes en los hechos se sustituyen por esas magnitudes derivadas; no son una fuente alternativa. La entrada efectiva de solo trabajo aporta su íntegro conciliado y cero otras rentas. La analítica aporta el íntegro y las otras rentas no exentas ya calculadas en su perfil. Sin esas magnitudes, la rama se rechaza.

H3: pacientes, adoptados y titulares requieren el mínimo efectivamente atribuido al sujeto correspondiente. Un expediente, una persona censada o el derecho de otro descendiente no lo sustituyen. H4 conserva el último de los 80 decimales admitidos al comparar límites. H5 elimina los accesos sin contrato y las aserciones innecesarias; las guardas se basan en Schema y la unión discriminada.

Se conservan los ocho fallos originales en la recepción de revisión. Las pruebas permanentes incluyen 21 discriminantes recibidos y cuatro adicionales del integrador. Los oráculos monetarios recibidos no cambian; dos pruebas de API expresan el rechazo mediante el canal de error de Effect. Por la gravedad P1 de H1–H3 se solicita un contraste independiente acotado antes de publicar.


El primer contraste de H1–H3 confirmó H1/H2 y reprodujo un H3 residual: un titular censado para el mismo sujeto pero sin derecho reducía 784 a 392 euros. La composición ahora entrega `atribucionesMinimo` directamente desde el productor de mínimos. La lista territorial debe coincidir, sin omisiones, duplicados ni titulares adicionales, con el conjunto efectivo de ese sujeto. No se copia la lógica de elegibilidad ni se infiere derecho desde el censo.

Cinco regresiones nuevas conservan 784 con un único titular efectivo y 392 con dos; rechazan incluir un titular inelegible, omitir un titular efectivo o duplicarlo. Tres fallan sobre la primera corrección y se conservan en el respaldo. La corrección residual requiere su contraste monetario antes de publicar.

## Vínculos y hechos familiares conciliados

El segundo contraste validó la pertenencia efectiva al mínimo y detectó que aún se aceptaba una adopción con vínculo consanguíneo conocido. La conexión ahora contrasta vínculo adoptivo, fecha de constitución conocida y cronología de inscripción. El contraste se aplica también a los eventos representados de Catalunya, Madrid y Murcia. El nacimiento o parto debe coincidir con el nacimiento anual. No se interpreta la ausencia de un sujeto en el expediente como una contradicción para deducciones que no exigen mínimo; las ramas que sí lo exigen mantienen el control de derecho efectivo.

CLM vincula el reparto a cada hijo del evento, no al identificador del parto. CYL concilia `hijoNacimiento` y discapacidad y exige que el censo de descendientes computados para familia numerosa coincida con los mínimos del caso; un cónyuge no representado se rechaza. El título administrativo sigue siendo un hecho declarado condicionado.

Para gastos de adopción CYL, el reparto mixto entre titulares adoptivos y biológicos se rechaza con un motivo específico: falta distinguir quién tiene derecho a esta deducción. Es una limitación de representación, no una afirmación de exclusión legal del progenitor biológico. La [AEAT](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-castilla-leon/gastos-adopcion.html) exige prorratear entre contribuyentes con derecho a la deducción. El mínimo no acredita por sí solo ese conjunto.

Se mantienen los esperados monetarios de los controles válidos: 784/392 en adopción CYL, 150 en hogar CYL, 100 en nacimiento CLM, 150 en Catalunya y 721,70 en adopción internacional Madrid. Las fixtures positivas adoptivas ahora declaran vínculos adoptivos coherentes. Se conservan nueve fallos sobre la versión anterior y otro fallo específico del reparto mixto. Las pruebas permanentes son 41; 607 regresiones pasan. El [contraste independiente](REVISION-VINCULOS.md) es favorable en su alcance: 34 pruebas propias más las 41 recibidas pasan en ambas API. El CI completo de integración sigue pendiente.

Las solicitudes de contraste mencionadas en la historia de correcciones ya están resueltas. La versión integrada conserva las 75 pruebas de revisión y contraste; las reservas de representación y aceptación fiscal siguen vigentes.
