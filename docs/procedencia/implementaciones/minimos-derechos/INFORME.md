# Derechos atribuibles a mínimos, entrega para revisión

Autor: agente de implementación de este hilo, checkout T3 `t3-5ea7ff42`, identificado en la sesión como `/root`. Trabajo personal, sin subdelegación. Base comprobada mediante lectura Git: `5799bb03826719a4dd3500a962e2d6bb5124fdca`. No se atribuye independencia al autor ni se acepta fiscalmente la implementación.

Se implementa una ruta optativa de mínimos por descendientes para declaración individual, régimen común, Madrid y devengo 31 de diciembre de 2025. No amplía la vigencia a 2026 ni convierte el cálculo anual existente en una declaración íntegramente automatizada. Se conservan las APIs y expectativas históricas.

## Contrato y conexión

`DerechosMinimos2025` exige identificación anónima local de contribuyente, sujetos y posibles titulares; censo declarado completo; nacimiento y edad cumplida al devengo; supervivencia; rentas fiscales no exentas; declaración propia individual o ausencia explícita de declaración; discapacidad fiscal preclasificada; parentesco/grado; convivencia o dependencia; custodia; alimentos judiciales y especialidad; residencia y rentas de todos los posibles titulares. Los IDs solo admiten `s-` y dígitos: no son DNI ni identidades inventadas por el motor.

Las rentas se expresan en céntimos enteros, con signo y límite técnico absoluto de 10^12 céntimos. Renta fiscal no significa salario bruto ni base liquidable: corresponde al saldo algebraico descrito en el manual, antes de integración, compensación y reducciones, con la excepción allí indicada para trabajo. Las rentas de la declaración propia se consignan separadamente. Esta API no audita los documentos de renta ni la preclasificación jurídica de discapacidad. Las listas están limitadas técnicamente a cien sujetos y cien titulares por sujeto; edades y grados son enteros acotados. Ningún porcentaje de reparto manual es admitido.

La validación cerrada rechaza campos extra, ausencias, fechas imposibles, duplicados, identidad sujeto/titular no soportada, incoherencias de edad, renta/residencia contradictorias para un mismo titular y hechos incompatibles de custodia. El orden se deriva del nacimiento de quienes generan derecho al contribuyente; nunca de la posición de entrada. Empates de nacimiento con divisores diferentes se rechazan para no decidir un orden jurídico por ID.

La renta de exactamente 8.000 euros no excluye; con declaración individual, exactamente 1.800 tampoco. El motor determina los titulares con relación habilitante, aplica prioridad del grado próximo (o del siguiente si todos los próximos no superan 8.000 euros) y divide por su número, que puede ser uno, dos o más. No cuenta renuncias a aplicar el mínimo como cesiones. La discapacidad familiar solo se suma si existe derecho al mínimo del descendiente, con el mismo divisor. El contribuyente conserva su mínimo propio íntegro.

El incremento por edad inferior a tres no se acumula con el incremento por adopción. Para adopción, acogimiento permanente o guarda preadoptiva se exige el primer hecho habilitante y su fundamento (inscripción o resolución cuando aquella no es necesaria), junto con la declaración de historia completa. No se reinicia el plazo al cambiar acogimiento por adopción. Para acogimiento temporal, urgencia y guarda judicial, el incremento se limita a menores de tres. La entrada no automatiza la verificación de esa historia documental.

`liquidarIrpfAnualConDerechos` exige los hechos y llama al modo canónico. También se admite `derechosMinimos` explícito en `CasoFiscalAnual`; el modo legacy lo rechaza. La liquidación valida año, territorio, modalidad, ausencia de fallecimiento y concordancia de edad/discapacidad del contribuyente. Las listas antiguas de familiares deben estar vacías cuando se usa la ruta nueva: dos fuentes de datos familiares no se concilian por conjetura.

Los derechos se calculan por separado con las tablas estatal y madrileña, manteniendo el orden y divisor. Ambos resultados alimentan la cuota general y sus respectivos remanentes del ahorro. El rastro de descendientes muestra orden, divisor e incremento sin publicar IDs personales. Los errores del contrato son `DerechosMinimosNoSoportados`; la frontera anual los convierte a `ResultadoNoSoportado`, conservando el canal recuperable de Effect.

Consumidores examinados: cuatro helpers de mínimos, liquidación, `calculo-salario-legacy.ts` y conexión anual de trabajo/EDS. El perfil salarial continúa usando `FamiliarFiscal`, ahora documentado como parcial, sin atribuirle derechos nuevos. La conexión trabajo/EDS anterior conserva su alcance sin familiares; no se modifica su contrato ni se reutiliza como entrada familiar. La nueva ruta amplía solo mínimos, no los demás supuestos simplificados de liquidación.

## Evidencia y esperados

Se consultaron CX-06-A, MIN-002/003/004/005/006/009, D021 y D043–D046. La compilación oficial anual de la Ley 35/2006 se reextrajo personalmente, páginas físicas 36–38, artículos 58, 60 y 61. Original ya conservado en la entrega X: SHA-256 `95d7f10a386b345af1cb9249821faa0c8bf56a9e7b4c578ac9194c50f9b6bf94`, SHA-512 y extracción en `evidencia-primaria.log`. [Original AEAT](https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2025/Normativa-IRPF25/Ley-35-2006.pdf). No se modificó el original.

Se consultaron directamente los apartados oficiales del Manual 2025: [requisitos](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/concepto-requisitos-descendientes.html), [cuantías y adopción](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/cuantias-aplicables.html) y [condiciones](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c14-adecuacion-impuesto-circunstancias-personales/minimo-descendientes/condiciones-aplicacion-minimo-descendientes.html). La consulta web al consolidado BOE fechado no respondió; no se presenta como fuente releída. Modelo 145 no se usa como norma anual.

Derivaciones independientes del resultado del helper:

- Dos hijos de 8/5 con ambos progenitores con derecho: (2.400 + 2.700) / 2 = 2.550 euros por progenitor. Un titular: 5.100.
- Un descendiente con tres titulares: 2.400 / 3 = 800. Cinco con dos titulares: (2.400 + 2.700 + 4.000 + 4.500 + 4.500) / 2 = 9.050.
- Menor de tres con dos titulares: (2.400 + 2.800) / 2 = 2.600.
- Discapacidad de al menos 65% con derecho y dos titulares: (9.000 + 3.000) / 2 = 6.000 adicionales.
- Conexión Madrid: mínimo estatal 8.100; autonómico 5.956,65 + (2.575,85 + 2.897,83) / 2 = 8.693,49. En el primer tramo, 8.100 × 0,095 + 8.693,49 × 0,085 = 1.508,44665; presentación existente a céntimos: 1.508,45. Se usan las tablas ya integradas, sin alterarlas ni aceptar de nuevo toda su vigencia.

## Rojos y verificaciones reales

`rojo-precontrato.log` conserva el fallo real antes de escribir la implementación: 5.100 frente a 2.550. La receta original está en `rojo-precontrato.ts.txt`, conservada como evidencia histórica, no como test de suite ni evasión de lint. Ese rojo denuncia colisión de hechos en el contrato antiguo; no exige dividir siempre su salida por dos.

`rojo-conexion.log` conserva dos fallos antes de conectar la liquidación: se ignoraban los hechos y no se rechazaba su uso legacy. Su esperado inicial contenía una errata aritmética propia de un céntimo (150844). Se corrigió por la derivación anterior a 150845, sin cambiar ningún oracle existente. El recibido era 103357, de modo que la carencia de conexión no depende de aquella errata. No se presenta el esperado inicial erróneo como cifra normativa.

El resto de la matriz nueva son regresiones del contrato, no rojos históricos inventados. No se ha satisfecho literalmente un rojo previo por cada nueva condición: se distingue este límite del trabajo. Las pruebas cubren fronteras de renta/declaración ±0,01, edad, orden, discapacidad, reparto, adopción, errores recuperables y conexión.

Primer pase: 93 pruebas correctas y cuatro errores de tipos (TaggedStruct y uso de Date). Se corrigieron sin desactivar diagnósticos. Segundo: 95 pruebas, tipos principal/vendor, lint y ensayo de las 16 reglas correctos. Tras añadir controles de identidad y la ruta explícita: 97 pruebas correctas; un comentario @ts-expect-error quedó desplazado por formato y produjo dos diagnósticos. Solo se movió el comentario al campo deliberadamente inválido; repetición de tipos/lint en `tipos-lint-cierre.log`. Recuentos solapados; no sumarlos.

Comandos reales, desde este checkout y con Bun/Node de Nix:

    flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/minimos-derechos.test.ts --maxWorkers=1
    flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun run test tests/minimos-derechos.test.ts tests/minimos-procedencia.test.ts tests/liquidacion-irpf-anual.test.ts --maxWorkers=1
    flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bash -c 'set -e; bun run typecheck; bun run lint; bun run test:lint'

El rojo histórico puede reproducirse copiando su receta a un archivo temporal de test en scratch con configuración propia. No se debe sustituir la suite actual ni incorporar su expectativa al helper parcial.

Las guías Effect list, data-modeling, error-handling y testing se consultaron con el lanzador Bun indicado, además de Schema.ts v4 local. Node_modules es enlace de lectura a la raíz del padre. Scratch solo en .cache/minimos-derechos. Ningún build Next, suite legacy completa, instalación global, cambio de paquetes/CI ni wrapper Python de corpus. La extracción usa Poppler de Nix; control de entrega usa Python de Nix bajo el lock.

## Decisiones, objeciones y coste

1. Ruta explícita optativa. Objeción: cambiar la interpretación de una lista de edades convertiría supuestos en derechos. Coste: dos contratos coexistentes y adaptación deliberada de nuevos consumidores. No se modifica la UI.
2. Alcance Madrid 2025 y sin fallecimientos/ascendientes. Objeción: heredar importes no acredita otros ejercicios, conjunta, forales ni requisitos de ascendientes. Coste: rechazos tipados, cobertura parcial visible; MIN-006 no se da por implementado.
3. Prioridad del grado próximo y paso al siguiente si todos los próximos no superan 8.000 euros, conforme al artículo 61. Objeción: mantener el rechazo provisional dejaría sin resolver una regla primaria disponible; mezclar grados sería incorrecto. Coste: se limita la concurrencia a dos grados y se rechaza el caso de rentas mixtas en el grupo próximo, pendiente de aclaración; nunca se convierte ese rechazo en cero. El rojo específico previo y la corrección se conservan en rojo-grado.log y validacion-grado.log.
4. Alimentos: con custodia compartida puede existir mínimo; pagador judicial sin custodia no se cuenta. Cualquier especialidad de alimentos solicitada se rechaza en esta ruta. Objeción: eliminar el mínimo no implementa por sí solo los artículos 64/75. Coste: esos casos de cálculo anual requieren otra ruta; no se ofrece elección fiscal ficticia.
5. Discapacidad preclasificada y censos declarados completos. Objeción: schemas no verifican certificados ni parentesco real. Coste: la aplicación queda condicionada a hechos aportados, y requiere revisión humana/documental; no se publica dato personal como evidencia.
6. Reutilización de tablas y etapas monetarias existentes. Objeción: pasar tests no acredita el conjunto anual ni su redondeo por casillas. Coste: se entrega exactitud de operaciones discriminantes, con aceptación y revisión del binding pendientes.

Tutela/curatela, adopción en mayoría de edad, cambios de convivencia durante el año, fallecimientos, declaraciones conjuntas de cualquier sujeto, grafos multigeneracionales donde un descendiente es también titular, empate de nacimiento con divisores distintos y concurrencias de grado indicadas quedan fuera. No son ausencia de derecho: son falta de soporte de esta ruta. Los datos de convivencia/custodia se declaran para el devengo; la API no reconstruye trayectorias temporales.

## Integración y preservación

El padre debe integrar por manifiesto, comprobar los hashes de base y regenerar inventario/rastro. No se han tocado inventario, snapshots, registro, atestaciones, ESTADO, DECISIONES ni informes ajenos. Integridad, autenticidad, interpretación, exactitud y aceptación son dimensiones distintas: hashes y tests no autentican históricamente los originales ni aceptan fiscalmente esta entrega.

Sin operaciones VCS mutantes, PR, push, despliegue, transferencias ni borrados. v1/v2 permanecen intactos. Crossa sigue siendo la copia v1 histórica comunicada por el coordinador, misma casa y dueño; no se comprobó aquí ni se atribuye custodia independiente. La revisión nueva corresponde al padre.

Cierre de prioridad: tras el rojo propio se implementa también el paso al siguiente grado. La matriz final y los controles obligatorios constan en validacion-grado.log. La propuesta inicial de rechazo de toda excepción queda superada; el log y los informes históricos ajenos permanecen intactos.

Resultado final comprobado: 98 pruebas de tres archivos correctas (28 nuevas y 70 de regresión), tipos principal/vendor, lint global y ensayo anti-slop correctos. El inventario de base conserva exactamente SHA-256 ff58be7c8b497d2b38ad7019afb85e2e621296108eeae85163ad2319c9c9d397. No se ha regenerado con este cambio. El manifiesto excluye su propio hash por autorreferencia y no incluye node_modules ni scratch; el parche incluye código, pruebas y documentos entregados, sin borrados de archivos.
