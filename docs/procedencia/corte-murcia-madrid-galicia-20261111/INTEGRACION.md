# Guardería murciana, vivienda histórica madrileña y alquiler gallego

Este corte se prepara sobre `56ffd1ad`, publicado con ambos trabajos del
[CI remoto](https://github.com/eliesgalvira/IRoboPF/actions/runs/43088216838)
correctos. Las tres ampliaciones usan las dos API y el consumo común de cuota.
La validación y revisión del nuevo conjunto se registran por separado: el verde
del corte anterior no se traslada a este candidato.

## Comportamiento y límites

La guardería de Murcia incorpora `auxiliares.pagadoresMurcia`: filiación,
convivencia, residencia y economía de cada progenitor. La economía propia
procede de la composición; la ajena, del productor familiar compartido.
El mínimo procede de las atribuciones calculadas. No se admiten bases fiscales
ni una respuesta de derecho calculadas por el cliente.

Los pagos separados conservan su pagador; la ayuda minora su base de gasto.
El derecho nominal y la existencia de pago determinan los titulares del reparto
del límite. La primera revisión detectó que el pago ajeno completamente
subvencionado desaparecía del divisor: con pagos de 5.000 y 1.000 euros y ayuda
de 1.000 al segundo, el candidato concedía 1.000 euros al primero en lugar de
500. Se conserva el rojo y se separan el pago bruto y la base neta. El esperado
incorrecto del autor se conserva en la recepción; el esperado independiente
de 500 euros no cambia. El criterio se infiere de la separación entre reparto
y base en el [manual AEAT 2025](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-region-murcia/gastos-guarderia.html);
no se presenta como consulta vinculante específica sobre subvención íntegra.
El contraste independiente reproduce diez fallos anteriores y supera las 31
pruebas posteriores en ambas API, incluida cuota escasa. Respalda la corrección
con la misma reserva interpretativa. El perfil presupone pago acreditado del
progenitor y ayuda atribuida; no representa un pago realizado exclusivamente
por la Administración.

El perfil murciano exige residencia y familia estables, modalidad individual,
pagos privativos y rentas representadas. No habilita la concurrencia de varios
pagadores con el artículo 81; conserva la rama publicada de una sola beneficiaria.

Madrid añade `historiaViviendaMadrid` para la anualidad de 2025 de compras de
2023 o 2024 vinculadas al nacimiento o adopción. Es un contrato distinto de
`historiaNacimientoMadrid`. Reconstruye miembros e ingresos por ejercicio;
no recibe bases ni saldos fiscales externos. El origen debe cumplir el límite
de renta; el exceso de una anualidad intermedia no extingue un origen válido.
La cuota de 2025 depende también de su renta, con el límite de 30.930 euros
por miembro de la unidad y el tope anual de 1.546,50 euros.

Se conserva la fórmula publicada, la incompatibilidad con despoblación sobre
la misma inversión y el rechazo de historia ajena al código solicitado. El
perfil se limita a compraventa terminada, propiedad íntegra, familia estable,
modalidad individual y economías ordinarias representadas. Cotitularidad,
construcción, cambios de familia y regularizaciones complejas siguen fuera.
Una anualidad sin cuota no genera una nueva décima ni un arrastre.

Galicia permite conciliar inversiones con el alquiler de la vivienda habitual
sin aplicar la condición de ausencia de derecho a inversión de La Rioja.
El inventario se coteja con el libro inmobiliario: identidad, importe, fecha y
documento. Principal, intereses y mejoras conservan su tratamiento económico;
vaciar el inventario no evita el cálculo de rentas y bases.

El nuevo calendario representa una vivienda propia que pasa de habitual a
arrendada, con uso continuo y un alquiler propio distinto. El perfil admite un
inmueble pleno y rentas exclusivamente inmobiliarias representadas. No habilita
trabajo mixto, copropiedad, viviendas adicionales ni aplicación concurrente
de DT18. La residencia previa de 36 meses delimita el subperfil técnico;
no se presenta como requisito legal de la deducción gallega. La condición
material riojana y el contrato balear permanecen separados.

## Evidencia de integración

Las seis suites focales suman 279 pruebas correctas tras corregir el defecto
murciano y una guardia de historia madrileña anterior a retornos anticipados.
El control estricto de tipos y Effect pasa tras correcciones de discriminantes
y opcionales. Los esperados monetarios de las pruebas independientes se
conservan. Las primeras revisiones de Madrid y Galicia han conciliado los deltas
y aceptan la ejecución del integrador de sus suites: 32 y 84 casos,
respectivamente. No se atribuyen una ejecución propia. El contraste murciano
añade 31 pruebas propias; estos recuentos no se suman como cobertura fiscal
universal. Las reservas concretas se conservan en los manifiestos.

Tras incorporar el contraste murciano y adaptar los tipos y la construcción de
las fixtures, pasan las siete suites finales: 310 pruebas. Tipos estrictos,
Effect y Oxlint pasan. La fixture gallega conserva exactamente sus valores en
16 configuraciones; se concilia su hash sin cambiar esperados monetarios.
Los dos intentos de CI que detectaron problemas de lint y tipos en las pruebas
quedan preservados, sin publicación. Un tercero terminó por la guardia de memoria
del inventario. Se aisló el checker de la fixture en hijos que terminan antes de
generar el corpus, conservando las 19 pruebas y todas sus aserciones. La medición
con PATH limpio baja de 3173273600 a 2869997568 bytes PSS máximos del árbol;
los límites y el código fiscal no cambian. Ambos ensayos terminan sin supervivientes.

El CI local completo y los generados constan en VALIDACION.json; publicación y comprobación remota posteriores. No se declara cerrado el conjunto de deducciones de 2025.
Las referencias aportadas en las entradas son hechos declarados; el motor no
autentica certificados ni convierte un perfil no representado en cero fiscal.

La integración supera los 31 comandos locales exactos, incluidos inventario y generados. La publicación y la comprobación remota son posteriores a esta evidencia.
