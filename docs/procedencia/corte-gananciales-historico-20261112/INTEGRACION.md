# Gananciales Murcia y etapas de empleo Madrid 2023–2024

La anual individual murciana reconoce el gasto común una sola vez y deriva el
derecho de cada cónyuge desde sus hechos nominales. La conexión explícita de
empleo incorpora las etapas monetarias observadas en los perfiles acotados de
Madrid 2023 y 2024. La API canónica mantiene su política anterior.

## Alcance y evidencia

- Murcia: dos progenitores elegibles, residencia y régimen ganancial estables,
  pago íntegro identificado, sin ayudas ni artículo 81 concurrente. La mitad
  permanece racional: 100,01 EUR de gasto común generan 10,001 EUR por persona.
  El libro consume una sola vez la cuota propia y conserva el pendiente.
- Histórico: 61 identidades de 2023 y 63 de 2024, con 716 y 739 pares presentes,
  respectivamente. Se conservan ausencias y mapeos reservados. Los PRE y POST
  son observaciones de los mismos casos; no se suman como capturas nuevas.
- El PRE causal histórico conserva 107 pruebas correctas y 18 discrepancias.
  El POST pasa las 125 pruebas causales, incluidas las 124 identidades y el
  control del contexto decimal global.

La validación conjunta final pasa **1.465 pruebas en 26 archivos**: incluye 95
pruebas del autor y 228 independientes de Murcia, 78 de guardas históricas,
106 independientes de histórico y las regresiones de 2018–2025, CLM, Murcia
renovables y E38. Tipos strict+Effect y lint global terminan correctamente;
ESLint conserva 27 avisos anteriores. Los 18 oráculos Fraction del autor y los
36 independientes de Murcia coinciden exactamente con las fixtures.

Los ajustes posteriores afectan sólo a las pruebas: construcción de arrays
declarados de sólo lectura, representación de entradas adversas, comparación
exacta de decimales y eliminación de aserciones de tipo innecesarias. No cambian
el código fiscal, los originales oficiales ni los esperados monetarios. Los
rojos y cada preimagen se conservan en la entrega externa. La propuesta R1 del
histórico no se aplicó: sus cuatro adversas familiares ya rechazan mediante
la guarda común de la composición.

Ambas primeras revisiones quedan cerradas favorablemente dentro de su alcance,
con las reservas conservadas: [Murcia B09](../deducciones-2025/murcia-gananciales-20261112/REVISION-INDEPENDIENTE.md)
y [Open 2023–2024](../revisiones/historico2023-2024-primera/CIERRE-20261112.md).
Los revisores conciliaron la evidencia ejecutada por el integrador y los deltas
mecánicos, sin atribuirse una nueva ejecución ni certificar el CI global.

## Límites y comprobación de publicación

No se acredita todo B09, todos los salarios del intervalo técnico ni el algoritmo
interno de AEAT. La distribución de versiones observadas de Open permanece
documentada; no implica equivalencia general entre ellas. El detalle está en
[Murcia](../deducciones-2025/murcia-gananciales-20261112/ALCANCE.md) y
[2023–2024](../implementaciones/open-2023-2024/INFORME.md).

El workflow incorpora las cinco pruebas nuevas en sus pasos existentes. Antes
de publicar se ejecutan sus 31 comandos exactos, con las versiones declaradas y
el shell Nix correspondiente, PATH limpio, inventario y archivos generados. El
resultado y las postimágenes se sellan fuera del repositorio antes del push;
el CI remoto se comprueba sobre el commit publicado. Este informe de validación
focal no sustituye ese resultado global.
