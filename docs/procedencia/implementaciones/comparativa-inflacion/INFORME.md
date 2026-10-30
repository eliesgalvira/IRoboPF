# Comparativa de inflación: entrega candidata

Documento histórico del candidato de este directorio. Los resultados y estados corresponden a esa versión; no acreditan el estado actual del proyecto.

Base del candidato documentado: `eaed990c620b5fc4d3ff2e74dc68e0c8481c43db`.

## Contrato, objeción experta y coste

La exportación COMPARATIVA_INFLACION adopta una ruta binaria separada. Objeción experta: usar la liquidación de céntimos para reproducir una hoja cuyo Python conserva intermedios pierde precisión y cambia la etapa mensual. Decisión: reproducir calcular_nomina_agregada y generar_comparativa_inflacion, manteniendo intactas las APIs de céntimos. Coste: un helper adicional con fórmulas heredadas que deben mantenerse y revisarse separadamente. La duplicación acotada evita editar detalle-tabular.ts fuera de propiedad; sus salidas ya redondeadas no permiten recuperar intermedios. Una futura extracción compartida requiere coordinación y pruebas de ambas hojas.

Se conserva el producto secuencial de tasas de diciembre, en binary64, incluido el escenario explícito 2026 del 3 %. Objeción: convertir el resultado Decimal a Number no reproduce necesariamente la acumulación binaria original; sustituir tasas por cocientes de índices tampoco reproduce el método. Decisión: consumir los mismos datos observados y el mismo escenario, y conservar procedencia desde factorIpcPerfilLegacy. Coste: dos perfiles numéricos explícitos del mismo método estadístico. No se cambia la clasificación ni los metadatos existentes de exportación. 2026 no se convierte en observación.

El salario nominal se divide por el factor sin redondear; cada nómina se calcula íntegra, se reexpresan sus componentes y se obtiene el delta neto preciso. Se divide ese delta por doce antes de redondear. Dinero tabular recibe round NumPy; factor y texto porcentual reciben round Python. Objeción: ambos usan binary64, pero round no tiene el mismo procedimiento. Coste: mantener dos helpers de redondeo ya existentes; no epsilon ni tolerancia monetaria.

Las APIs de comparación, pérdida acumulada y presentación mensual conservan Decimal y céntimos: Math.round(anual/12) mantiene el empate hacia más infinito. Objeción: cambiarlo silenciosamente alteraría resultados de usuario y confundiría liquidación con exportación. Coste: diferencias deliberadas y documentadas entre API y hoja. El arreglo afecta exclusivamente a construirTablaComparativaInflacionCompatible y a sus consumidores tabulares; no certifica otras exportaciones basadas en las APIs.

## Evidencia independiente

extraer.py resuelve workbook.xml y sus relaciones, lee XML por streaming y rechaza fórmulas inesperadas. Extrae las 1.290 filas × 13 columnas y cabeceras de COMPARATIVA_INFLACION, y las 543 celdas de datos CONTROL. Los números del XML se conservan en excel.json; no se redondean a céntimos. Original de 150 MB identificado por SHA-256 y SHA-512 y tamaño.

oracle.py compila y ejecuta cuerpos AST originales sin alterar instrucciones; captura DataFrame para no generar Excel. La ejecución normal conserva np.arange original. La ejecución adicional sustituye solo el iterable por 22 salarios explícitos, incluidos negativos, cero, céntimos, umbrales de retención, SMI, base máxima y solidaridad; produce 330 filas adicionales. Python 3.13.15, NumPy 2.5.4, hash de fuente y factores constan en python.json. No se afirma conocer las versiones que generaron el libro histórico.

Objeción experta: los residuos de escritura XML no autorizan una tolerancia general. La prueba exige que la serialización de cada salida Python a 16 cifras significativas produzca exactamente el valor XML. Aplica la misma regla al TypeScript; compara además Python y TypeScript directamente, sin canonicalización. La prueba discriminante conserva 9,36 distinto de 9,37. Coste: documentar esta frontera de serialización y mantener dos comprobaciones distintas. No se alteran hashes del fixture canonical-tabular-hashes.json ni sus expectativas.

## Integridad y límites

Integridad: hashes de libro, fuente original, archivos de entrega y base; cero borrados comprobados por presencia del árbol base. Autenticidad: no se acredita autoría del libro ni confianza histórica del entorno. Interpretación: reproducción técnica de una hoja, no vigencia fiscal de sus parámetros. Exactitud: limitada a las celdas y fronteras ejecutadas que indican los logs. Aceptación: pendiente de contrarrevisión independiente; no se promueven registros ni atestaciones.

No se ejecutan Next build ni suites legacy completas. El fixture de hashes tabulares antiguo permanece intacto y su fallo conocido no se declara resuelto. La suma por años de pérdidas ya liquidadas de la API sigue siendo un contrato distinto de sumar deltas precisos; esta entrega no altera esa API. No se transfiere corpus, no se usa LFS ni se borra preservación v1/v2. La copia Crossa v1 sigue siendo la comunicada por el coordinador, misma casa y propietario, sin nueva verificación propia ni independencia.

## Reproducción y entrega

COMANDOS.md enumera entorno y comandos. MANIFIESTO.json fija path, sha256, size y baseSha256; implementacion.patch contiene cambios textuales y tiene digest separado. Las salidas JSON son evidencia nueva del original, no expectativas regeneradas desde la implementación. Los logs de pruebas distinguen rojo y verde; no se suman recuentos de ejecuciones solapadas.

## Rojo y verde medidos

rojo.log y rojo-repetido.log ejecutan el constructor de base antes de conectar el helper: tres pruebas fallidas y cuatro correctas en cada pase. El segundo pase es una repetición pequeña que había quedado en cola; no añade cobertura. La conexión se hizo después de ambos rojos, dentro del lock.

diferencias-antes.json conserva 69 diferencias exactas entre las 16.770 celdas del constructor de base y el Python: una en columna 10 (neto real en su año), quince en columna 11 (neto real 2026) y 53 en columna 12 (delta mensual). Ninguna en columna 13 (delta anual) en esas 1.290 filas; no se inventa un defecto anual universal. En las fronteras adicionales sí se reproduce un delta anual de 0,01 frente a 0,02 para salario de 10 euros. Ejemplos de hoja: 2012/18.000, neto 2026 16.206,19 frente a 16.206,18; 2012/26.000, mensual 28,74 frente a 28,73.

verde.log: siete pruebas correctas. Las 16.770 celdas Python se comparan exactamente con TypeScript; las mismas celdas XML se contrastan tras serialización explícita. Las 330 filas adicionales cubren 4.290 celdas. Las 543 celdas CONTROL y cabeceras se comparan con ambos originales. Son coberturas solapadas, no sumar como reglas fiscales verificadas. La prueba de precisión exige además igualdad exacta de los quince factores con Python y desigualdad discriminante del factor de 2012 frente a Decimal convertido a Number. Los metadatos coinciden con el perfil existente.

Las fronteras distinguen −0,005 (NumPy −0, Python −0,01), mensualización de ±18 céntimos (+2/−1) y delta preciso 0,059/12 (0,00) frente a anual de seis céntimos mensualizado (0,01). No se cambia ninguno de los contratos de API para forzar antisimetría.

ESLint y oxlint iniciales correctos. anti-slop.log confirma las 16 reglas a error y el rechazo de la muestra inválida. El primer typecheck encontró node:fs en diferencias.ts; typecheck-inicial.log conserva el diagnóstico. Se elimina esa dependencia y el script emite JSON por stdout, sin cambiar lenguaje, extensión, reglas ni exclusiones.

Ruff pasa con el ejecutable de Nix (`nix shell nixpkgs#ruff -c ruff check ...`).

Regresiones seleccionadas: nueve pruebas correctas en progresividad-caracterizacion-legacy.test.ts y dinero.test.ts. Conservan sus expectativas originales y cubren el contrato de cálculo y dinero de usuario; no son las suites legacy completas. El verde de esta entrega no resuelve el hash tabular histórico ajeno.

Validación final: typecheck principal sin incremental correcto. ESLint, oxlint y Ruff correctos; 16 reglas anti-slop a error. La salida del script usa Console de Effect tras rechazar también console.log; diagnósticos iniciales conservados.
