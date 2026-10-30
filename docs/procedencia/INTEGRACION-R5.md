# Integración de implementaciones y correcciones

Registro histórico de las implementaciones integradas sobre `d9ff49c7`. Describe ese corte; los estados de ejecución y cobertura actuales se consultan en los contratos y verificadores correspondientes. Los manifiestos y `recepcion-implementaciones-r5.json` conservan la recepción original.

## Implementaciones recibidas

- Escalas: cuotas publicadas para proposiciones acotadas; ahorro separado por componente, régimen de mínimos anterior a 2015 y límite autonómico general más ahorro. Asturias pendiente no se promueve. Informes, originales reabiertos, pruebas rojas y tablas están en implementaciones/escalas-ahorro.
- Deducciones: filtro de ámbito y limpieza de estado territorial, contratos nuevos y consignación profesional separada. Los controles antiguos siguen usando aritmética parcial; varios perfiles nuevos no pueden agregarse ni están conectados a esos controles. No se anuncia automatización completa. Detalles en implementaciones/deducciones.
- Actividades: rendimiento profesional EDS 2025 con diarios, historia, rechazos y adaptador; no conectado todavía a la liquidación anual. Criterios desconocidos no producen cero. Detalles y condiciones estrictas en implementaciones/actividades-economicas-2025.
- Contenido: entidades, rutas, snapshots y adaptador de rastro. Las fichas técnicas no son reglas jurídicas aceptadas ni redacción experta completada. El rastro anual aún necesita instrumentación explícita. Los cuatro conceptos editoriales no sustituyen citas. Detalles en implementaciones/contenidos.

<a id="correcciones-pequeñas-del-orquestador"></a>

## Correcciones del corte

**Retenciones:** RET20-008 rechaza divisor de convivencia cero, negativo o fraccionario e importes no finitos o no representables como céntimos enteros seguros. No valida irregularidades, edades familiares, fechas, regularización ni todo el algoritmo histórico.

**Mínimos:** MIN-001 filtra descendientes de 25 o más sin discapacidad antes de asignar orden. MIN-007 aplica las fronteras 65/75 bajo contrato de años cumplidos al devengo. La API de mínimo del contribuyente selecciona cuantías estatales históricas si no recibe tabla; no ignora el ejercicio 2012–2014. Siete pruebas fallaron antes del cambio. No se añaden convivencia, renta, declaración, adopción ni reparto inexistentes. MIN-017 Asturias sigue pendiente; Catalunya no se aplica retroactivamente por intuición. Las correcciones de ahorro MIN-010/033 quedan cubiertas por la entrega de escalas, sin duplicar fórmula.

**Cotizaciones:** el modo canónico anual consume el perfil analítico de doce mensualidades uniformes. El rendimiento del trabajo recibe exactamente su cotización del trabajador; no la vuelve a calcular con otro perfil. El modo compatible-legacy conserva la cotización histórica. El rastro explica los supuestos y los tipos por pagador. Dos pruebas de integración fallaron antes. Un test anual de salario 400.000 en Madrid 2018 conservaba la antigua base de SS: se actualizó su expectativa con la diferencia independiente de gasto 16,66875 euros y marginal conjunto 43,5 %, sin presentar esa declaración entera como fiscalmente validada.

**Puente documental:** ENV1-01/02/03 reproducidos y corregidos: marcas combinantes junto al signo separado, cambios persistentes de dependencias documentales y manifiestos publicables aún sin sanear. Se capturan y recomprueban todas las dependencias consumidas, incluidos blobs, registros e informes, al terminar el auxiliar y de nuevo en Node. Se exige que el documento ya sea público antes del hash. Las tres regresiones eran rojas; pasan 22 pruebas de corpus y 18 del puente. No resuelve cambios/restauraciones adversarios ABA ni identidad criptográfica del editor. Requiere nueva contrarrevisión.

La revisión enlaces-v1 acepta únicamente el payload madrileño anterior exacto. Se conserva en enlaces/historial por hash junto a la atestación candidata del revisor. El inventario nuevo cambia el payload: el binding actual permanece candidato; no se migra la aceptación automáticamente.

## Conservación de versiones de contenido

Al integrar se corrigió un problema operativo: el verificador original de contenido leía siempre el inventario actual. Se separa la lectura de artefacto desde bytes y se conserva también el gzip por hash. Cada snapshot se coteja con su manifiesto y artefacto originales. Los cuatro snapshots anteriores conservan su propio artefacto sin alteraciones. La nueva generación conserva los anteriores y añade el correspondiente al motor integrado.

Inventario nuevo: 22.056 ocurrencias sintácticas, 16.100 efectivas y 11.727 seleccionadas: 49.883 ocurrencias técnicas. Contenido nuevo: 49.887 fichas incluyendo cuatro conceptos. No son porcentajes de cierre jurídico. La huella del snapshot integrado inicial es 4919c9ec5fa20e858d5a4e99f53e7628c2a6e0a9e7852a44de34513de0b0763c.

Este corte no acredita contrarrevisión posterior, instrumentación del rastro, integración anual de todos los contratos, respaldo completo, autenticidad histórica ni cierre documental por regla. Esos límites deben comprobarse sobre la versión que se utilice.
