# Etapas acotadas Madrid 2023 y 2024

La recepción inicial fue una preparación privada GRANT0. El 12 de noviembre,
el integrador ejecutó la imagen conciliada: 1.465 pruebas pasan en 26 archivos,
incluidas 125 causales, 78 de guardas y 106 de revisión independiente. Tipos
strict+Effect y lint pasan; ESLint conserva 27 avisos anteriores. El CI completo
y su publicación se registran por separado en la entrega del corte.

## Decisiones

La conexión explícita directa y su reexport público seleccionan dos políticas
anuales distintas sólo dentro del perfil. La API canónica no pasa la nueva opción.
Las políticas2018/19/2020–22/2025 y sus comprobaciones permanecen en su sitio.
No hay tabla de casos ni salarios en la selección: intervalo experimental inclusivo
12546.57–58172.55, céntimos finitos y transporte sin pérdida del decimal corto.
Madrid, empleo laboral único, edad38 en2023 o39 en2024, individual, SS1000,
sin familia, discapacidad, otras rentas, ahorro, reducciones ni deducciones.
La retención100 efectiva es parte del perfil observado, no una fórmula fiscal.

2023: núcleo existente art20 Decimal80 (equivalente racional para estas entradas
finitas), HALF_UP de reducción antes de restarla al art19 producido. 15084.75
produce reducción6455.54, base5629.21 y estatal534.77. La alternativa decimal corto
sigue compatible con la evidencia; no se afirma unicidad del procedimiento.

2024: transportar bruto y gastos a–e a Number ANTES de restarlos; ramas y
coeficientes del núcleo art20 existente, operaciones binary64, decimal corto de
cada operación, reducción HALF_UP, resta al art19 Decimal80. 17000.42 necesita
argumento16000.419999999998, no Number del argumento decimal exacto16000.42;
base8708.15 y estatal827.27. 15852.02 produce base5550.06 y estatal527.26.
El testigo15852.02 solo tampoco distingue la alternativa de base racional sin
cuantizar internamente. La política es un candidato compatible con los conjuntos
separados, no equivalencia general Open1.23/1.24 ni algoritmo atribuido a AEAT.

Cuotas: reutiliza calcularCuotaPorEscala/calcularDesgloseCuotaPorEscala. Sólo
estatal y mínimo estatal usan binary64-corto; autonómica usa Decimal80 y mínimos
autonómicos del selector oficial anual. Cada gravamen se cuantiza HALF_UP antes
de restar mínimos. Base26846.30 da estatal3109.69 frente a racional3109.695.
No se deduce de ello truncamiento, regla binaria autonómica ni acreditación de
todas las fórmulas autonómicas. No existe motor fiscal paralelo.

La composición reconstruye gastos/argumento/neto con adaptarTrabajoAnual, exige
gasto general producido2000, igualdad exacta del neto previo y base con la misma
alternativa y mínimo estatal5550. Rechaza actividad anualB incluso con origen
solo-trabajo, mínimo6000, reducción omitida, base inventada/de otra política,
fuentes adicionales, subcéntimos/no finitos y precisión distinta de80. No sanea
hechos para hacerlos elegibles. La opción baja del núcleo no es una autorización
de perfil: sin correspondencia de año, operandos y argumento conserva Decimal.

La traza art20 explica la decisión anual y muestra el argumento binario2024.
La traza resumen conserva0023/0414 reservadas y ausencias sin promoción a cero.
La suite causal sólo compara casillas presentes/acreditadas; las reservas no se
convierten en expectativas de cero. DA61 permanece no aplicable.

## Pruebas ejecutadas y límites

Fixture autónoma124 casos:60PRE por año, uno nuevo2023 y tres nuevos/recuperados2024.
Los inputs son sintéticos con hechos negativos declarados; las referencias y
hashes de los originales están conservados como metadatos, nunca se leen esas
rutas durante las pruebas. PRE2024 contiene59 versiones1.23 visibles y una ausente;
los tres posteriores son1.24, sin recaptura emparejada que pruebe equivalencia.
No se suman a otras campañas. No se afirma verificar124 liquidaciones completas.

causa2023-2024.test.ts conserva 125 pruebas causales y sus esperados monetarios.
open-2023-2024-guardas.test.ts ejecuta 78 pruebas normales: tres positivos,69
negativos de composición y seis de envolvente, aislamiento, hechos, ruta decimal,
traza y canónica. Incluye contexto global5/restauración finally e inmutabilidad.
El PRE causal conserva 18 rojos y 107 verdes. El POST pasa las 124 identidades:
61 de 2023 con 716 pares presentes y 63 de 2024 con 739 pares presentes.
Son 1.455 comparaciones condicionadas de la fixture, sin sumar PRE y POST como
casos nuevos ni convertir ausencias o mapeos reservados en cero.

Se conservan los rojos mecánicos de las pruebas: comparación textual de escala
decimal y comparación profunda de constructores Decimal distintos, corregidas
con igualdad decimal exacta y transporte textual. Los datos adversos y los
esperados oficiales no cambiaron. Las cuatro adversas de listas familiares
rechazan mediante la guarda común ya existente: no se aplicó la propuesta R1.
El padre conserva originales, deltas de pruebas y postimágenes selectivas.

Conservar revision-historico-cuotas, revision-historico2020-2022 y las suites de
2018/19/2020–22/2025; no se han reemplazado. Sólo el padre integra/publica tras los
comandos exactos workflow/Nix, inventario/generados y comprobación remota.

Effect: consultados ai-docs/src/index.md, 01_effect/01_basics/01_effect-gen.ts y
09_testing/index.md en las fuentes locales de Effectv4. Se mantiene Effect.fn,
return yield* Effect.fail y Effect.result/Result de la raíz. El integrador consultó además effect-solutions list y show testing/data-modeling antes de los ajustes. No se añade dependencia de producto.
