# API del cotejo documental

El extractor no cambia la API de cálculo del motor. Consume sus exports mediante el inventario efectivo admitido; carecer de binding significa únicamente falta de correspondencia en ese inventario.

`compare(tables, cells, items, *, obligations, store, semantics, repo)` requiere obligaciones revisadas independientes y acceso explícito a originales. Valida cobertura y ámbito. Para admitir `match` exige prueba de unidad de cabecera y del campo u operación. Devuelve `not-verifiable` con motivo cuando no se acreditan; no transforma ausencia documental en cero. Solo compara números: no autentica por sí mismo las palabras, geometría o posiciones de una extracción aportada.

`run(repo, cas, roots, work, mapping, base)` reextrae originales, fija huellas de código y runtime y genera el manifiesto v2. `--verify` reconstruye y exige igualdad completa. `--base` declara el SHA completo de la base y permite usar una exportación sin Git; no autentica por sí solo el código. CAS, temporales y salida son externos. La ejecución real con corpus es opcional y separada de las pruebas ordinarias sintéticas.

No se acepta globalmente ningún ejercicio ni se acreditan condiciones jurídicas o selección efectiva por el cálculo con una igualdad numérica.
