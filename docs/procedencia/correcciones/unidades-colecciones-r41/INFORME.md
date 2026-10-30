# Unidades de SS y colecciones de rentas: contraste R41

El padre reproduce y corrige cuatro grupos documentales de SS (SS39-01/02/03/04) y RR40-01 en rentas. Los programas numéricos, sus fuentes y sus resultados permanecen iguales. El cambio necesita una revisión independiente nueva de estos bytes. No habilita admisión, composición pública, wiring ni aceptación fiscal.

## Recepción

Se comprueban todas las entradas físicas de cada base, con bytes, enlaces y ejecutabilidad, un blob cada vez. SS: 20.498 entradas intactas; rentas: 20.670. Se ensayan los parches y binarios en scratch ordinario antes de incorporar las entregas. Cero borrados o cambios de base en ambos hijos.

- SS R39: 78 archivos y 5.172.635 bytes. Manifiesto `95492a56a02dea5b2fd28b78250a55bf8ab2ade7b2bd53f09fa6f51a540c2576`.
- Rentas R40: 44 archivos y 3.049.633 bytes. Manifiesto `6160cc2cc2be4c3fe6eb7d6c0d0b1c80555bf9503424dd3ae88a886b8a3518a0`.

Los recibos individuales enumeran los 122 archivos. Los informes, originales, rojos, incidencias y manifiestos de los revisores se conservan intactos. El cotejo de cada checkout no acredita todo el árbol externo de node_modules.

## Diagnóstico y corrección

El padre contrasta los campos con las interfaces, declaraciones y llamadas TS fijadas, además de las reproducciones independientes recibidas. Se añaden 19 regresiones antes de modificar productores: fallan las 16 expectativas documentales y pasan tres controles. `rojo-previo.log` conserva el fallo; ninguna expectativa se rebaja para obtener verde.

1. **SS39-01:** cinco valores `mei` contienen un objeto con los tipos empresarial y trabajador. Se documentan como estructura de dos ratios. Las cuotas `meiEmpresarial`/`meiTrabajador` siguen siendo EUR, y cada tipo por lado sigue siendo ratio.
2. **SS39-02:** cuatro valores `trabajador` pertenecen a las ternas de solidaridad, no al lado escalar de MEI. La clasificación usa la declaración, el propietario y la forma del AST fijado; se representan como `tuple3<ratio>`.
3. **SS39-03:** el resultado de `obtenerParametrosCotizacionLegacy` describe un registro de categorías con dos lados, el objeto MEI y la unión etiquetada de solidaridad. Se precisa también el resultado de `obtenerPoliticaSolidaridad`: la variante `SinSolidaridad` no contiene tres tipos. La expectativa del padre explicita ambos niveles del registro, más precisamente que la abreviatura `record<lado:ratio>` del revisor. Permanecen las abreviaturas de otros contratos; no se presenta esta corrección como un sistema universal de unidades.
4. **SS39-04:** los ceros de `Decimal.max(0, salarioBrutoAnual.minus(baseOrdinaria))` y `excesoBase.lte(0)` son EUR. Se identifican por función, llamada y posición; no se reclasifican todos los ceros. La semilla salarial continúa en céntimos y los índices conservan su dimensión.
5. **RR40-01:** las cuatro llamadas `EffectArray.map/reduce` usan datos primero. `collections.receiver` pasa a señalar la colección; callback y semilla respetan sus posiciones. Las llamadas nativas conservan los argumentos anteriores. Se verifica la identidad global de EffectArray y la aridad; el programa ejecutable no cambia. Se consultan effect-solutions y las implementaciones locales de Array.map/reduce.

Los productores siguen acotados a fuentes fijadas; estas reglas documentales no infieren dimensiones para cualquier programa TypeScript. Los consumidores y el motor fiscal no se modifican. La admisión anual externa, las fronteras de servicios, el dominio de datos ordinarios y la verificación previa del programa siguen siendo condiciones necesarias. Los límites sobre instrumentación y ejecutores sin verificación descritos por los revisores se mantienen; no se transforman en defectos financieros demostrados.

## Verificación

`contraste.json` comprueba que SS solo cambia `unitContracts`, `fieldUnits` y `literalUnits`; rentas solo cambia `collections` y el hash de su productor en `software`. Las 1.172 operaciones SS y las 6.196 de rentas son estructuralmente idénticas, igual que las fuentes. Se guardan artefactos anteriores y posteriores comprimidos, sin sobrescribir los fragmentos históricos R36. Los posteriores en esta carpeta son los candidatos corregidos que debe revisar el siguiente agente.

Pasan 78 pruebas Vitest: 19 nuevas, 58 de SS recibidas y un grupo que contiene los 41 controles de rentas. No se suman otra vez los controles internos. El padre reproduce además los 438 casos racionales del revisor SS, con once salidas por caso, contra el consumidor y el TS real: tolerancia absoluta declarada menor que 1e-12 EUR respecto de las fracciones, sin discrepancias. Los 41 controles de rentas se repiten directamente; casos y ejecuciones coinciden exactamente con R40. Estas repeticiones no se presentan como cobertura independiente adicional. Trece mutaciones de unidades/receptores se rechazan mediante los verificadores reales.

Typecheck principal y vendor, Oxlint global, ESLint global y ambos schemas pasan. Las 16 reglas anti-slop siguen a error; ESLint conserva nueve avisos sin errores. Vitest usa cargador nativo, caché propia y un trabajador. Cada comprobación pesada toma y libera el bloqueo compartido. No se ejecutan Next build ni las suites Excel masivas.

La comprobación adicional `checkJs` de ambos productores devuelve cinco diagnósticos en SS. Se repite con una copia exacta del productor anterior: los cinco mensajes y posiciones coinciden, normalizando únicamente la ruta. No se declara verde ese control ni se desactiva ninguna regla. CheckJs separado de rentas pasa. `limite-checkjs.json` y los logs conservan esta limitación previa; no hay tipado estático completo del productor SS.

Las primeras consultas no encontraron bun/rg en PATH y un nombre de configuración antiguo no existía. Se usaron Nix y el nombre real; estos intentos de consulta no se cuentan como pruebas. Los instrumentos del padre, configuraciones, diff y hashes se conservan como texto. Los originales históricos mantienen sus propios resultados, incluidos los rojos aún pertinentes fuera del alcance.

## Decisión, objeción y coste

Se corroboran los cinco diagnósticos documentales y se prepara una corrección conjunta para revisión nueva. Objeción: un extractor y su validador pueden coincidir y aun describir mal una unidad o un callback. Respuesta: expectativas externas por ID, inspección de los propietarios y firmas reales, conservación del rojo anterior y comparación exacta del programa numérico. Coste: mantener contratos finitos y sus regresiones, además de revisar cada cambio de fuentes. Ni los hashes ni las coincidencias aritméticas bastan para aceptar una regla fiscal.

Las condiciones de las revisiones de valor/selección se conservan, sin promover sus booleanos a cierre de sitio. La revisión nueva se limita al cambio documental y sus efectos; no repite toda la auditoría fiscal ni acepta automáticamente los demás contratos. Continúan por separado la admisión y la revisión de escalas.

Motor, confianza activa, inventario y 45 snapshots permanecen intactos. V5 r2 conserva corte R26. Crossa sigue v1 desfasado, copia local fuera de Victus del mismo dueño y casa; no constituye custodia independiente ni remota. Sin LFS, gasto, transferencias, main, PR, despliegue o limpieza. El encargo global permanece abierto.
