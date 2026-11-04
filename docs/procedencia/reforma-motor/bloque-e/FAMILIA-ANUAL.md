# Familia anual — entrega de implementación 4/11/2026

El contrato `DerechosMinimosAnuales` conecta reparto de descendientes y su discapacidad con el núcleo anual existente en 2012–2026, para las 15 comunidades comunes y Ceuta/Melilla. Los mínimos autonómicos se seleccionan por ejercicio; no se heredan importes de 2025 a 2012. Las tablas existentes siguen sujetas a sus reservas documentales. Esta ampliación no acredita una declaración completa en Ceuta/Melilla ni implementa su deducción territorial.

El orden de hijos se calcula entre los elegibles de cada contribuyente; cada mínimo familiar y discapacidad se divide entre titulares legales elegibles del grado correspondiente. El mínimo propio no se divide. Los hechos al devengo no ponderan meses ni días: el incremento por adopción empieza en el año del primer evento habilitante y dura ese ejercicio y los dos siguientes; no reinicia por adopción posterior a acogimiento. No se admiten porcentajes ni convivencia reconstruida a partir de un importe. Declarar convivencia incluye sus asimilaciones legales documentadas; antes de 2015 la mera dependencia económica no la sustituye. Censo exhaustivo y hechos siguen siendo responsabilidad externa.

2012–2014 usa Ley 39/2010 art.61 (vigencia indefinida), y 2015+ Ley 26/2014 art.1.33–37. Los arts.58/60/61 de LIRPF fijan renta, discapacidad, reparto, prioridad y devengo; la redacción estatal consultada a 4/11/2026 conserva esas cuantías. Fuentes originales y hashes: `FUENTES.json` de la entrega externa; reutiliza los originales AEAT de revisiones v1/v2, sin adquirirlos otra vez. Las condiciones de adopción civil y las reservas v2 permanecen: no se supone adopción de menor por la fecha de inscripción.

2026: la API canónica `liquidarIrpfAnualConDerechos(caso)` admite los 17 territorios comunes, con mínimos estatales y autonómicos separados. B2026 integra las escalas vigentes al 4/11/2026, incluidas cuotas fijas oficiales. Las deducciones autonómicas soportadas de 2026 son una lista vacía: no se traslada el catálogo 2025. [B2026](B2026.md) detalla normas y límites. Esto no constituye una declaración completa ni amplía la entrada efectiva 2025. El conjunto E+B cuenta con [revisión independiente favorable acotada](revision-familia-2026/INFORME.md).

Se rechazan ascendientes, fallecimientos, conjunta, censos incompletos, contradicciones, edades/fechas imposibles, grafos y concurrencia de grados fuera del contrato, ciertos aniversarios bisiestos y adopciones adultas. Alimentos propios sin mínimo rechazan la liquidación; antes de 2015 se rechazan también alimentos propios con mínimo, porque el procedimiento histórico no tiene la misma exclusión que desde 2015. El custodio elegible no queda bloqueado por los alimentos de otro titular. No se calcula una cuota alternativa por alimentos.

La entrada efectiva 2025 añade `familiaresConDerechoMinimo: "segun-derechos"` y derechos completos. Admite descendientes con discapacidad; discapacidad propia sigue fuera de ese productor. La edad efectiva admite 18–150 años. DA61 consume la misma cuota y los servicios acreditados, también con familia; pensión y actividad siguen excluidas de DA61. Se conserva la política Open exclusivamente en empleo Madrid 2025 y los esperados originales. Otros territorios mantienen precisión hasta salida, sin afirmar igualdad con todas las casillas oficiales.

Retenciones conserva su ámbito previo Madrid 2025 activo situación3; añade guardia runtime para no consumir cuantías de 2025 en otro ejercicio por el contrato más amplio del helper.

## Ejemplos

[ejemplos-familia.ts](ejemplos-familia.ts) exporta hechos sintéticos sin datos personales:

```ts
const hechos = familiaAnual(2012, "andalucia")
const padre = await Effect.runPromise(liquidarIrpfAnualConDerechos(casoFamiliaAnual(hechos)))
const madre = await Effect.runPromise(liquidarIrpfAnualConDerechos(
  casoFamiliaAnual({ ...hechos, contribuyenteId: "s-2" })
))
// Cada titular recibe 1938 EUR estatales por dos hijos, además del mínimo propio.
```

Para importes efectivos, partir de `efectivo` y `derechos` en [ejemplos.ts](ejemplos.ts):

```ts
const resultado = await Effect.runPromise(liquidarIrpfAnualExplicito({
  ...efectivo,
  familiaresConDerechoMinimo: "segun-derechos",
  derechosMinimos: derechos,
}))
```

La UI muestra resultado o error recuperable, conserva los textos decimales y no calcula cuotas. La revisión independiente contrasta importes y reglas con primarios; pasan 764 discriminantes propios y 594 regresiones. No amplía los límites declarados de esta API.
