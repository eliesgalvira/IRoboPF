# Comunitat Valenciana · ejercicio 2025

Entrega candidata: 40 registros individuales, sin aceptación propia. La base comprobada es `016ec72d9539ccd887202735960ce306bd2354e5`.

Los 40 dictámenes de ficha son `diferencia`, antes y después: se han demostrado omisiones de requisitos, límites o reparto. La modificación regional solo corrige las referencias al manual; no completa las reglas ni cambia el cálculo. Los 40 dictámenes de cálculo jurídico completo son `no_verificable`: 39 fichas requieren un importe calculado externamente; ascendientes multiplica 197 euros por unidades, condicionadas a un booleano externo, sin recibir renta, convivencia ni reparto. Esa limitación no constituye por sí sola una cuota incorrecta.

El PDF fijado del Manual Renta 2025 Parte 2 tiene SHA-256 `765c89ade626abf9726835373d5f15c671b610b00e72109c547f66b8ef9a005c`, edición 21-10-2026, 635 páginas. En el tramo revisado coinciden páginas físicas e impresas. `manual.paginasFicha` conserva el censo; `paginasComprobadas` y `paginas-manual.json` identifican las referencias corregidas. Los rangos compartidos incluyen las páginas de enlace entre dos apartados. En DANA, vivienda ocupa 623–626 y fondos propios 626–628.

Se contrastaron individualmente los apartados a)–ae), las reglas comunes del artículo 4, las disposiciones adicionales sexta, decimotercera, decimosexta y decimoséptima, y los artículos 2, 4 y 5 del Decreto ley 12/2024. Los registros desglosan cantidades, bases, requisitos y repartos, con pasajes literales reextraíbles y discriminantes documentales. Las disposiciones remitidas y el cierre histórico pendientes se identifican expresamente: las comparaciones no equivalen a certificar una cadena normativa completa.

Hay que conservar tres distinciones temporales. La Ley 5/2025 exige separar los devengos anteriores al 1 de junio; el Decreto ley 14/2025 y su corrección de enero de 2026 afectan a los devengos desde el 30 de diciembre. Los decretos leyes 1/2026 y 2/2026, publicados en DOGV 10314 y 10317 bis, tienen efectos expresos para devengos desde el 1 de enero de 2025: los límites de salud/deporte son 60.000/78.000 euros y formación musical existe para 2025. Los originales regionales de estas dos reformas se conservan, mediante reproducción oficial del boletín alojada en BOE, además de su texto HTML. No se trasladan indiscriminadamente a 2025 las modificaciones de julio de 2026.

Se comprobaron visualmente la tabla de donaciones y la fórmula reductora de alquiler. Abonos culturales aplica 21% sobre base máxima 165 euros y renta inferior a 50.000; no es un máximo de cuota de 165. Las donaciones COVID mantienen el primer tramo de 150 euros; las demás donaciones examinadas pasan a 250 con la excepción de fallecimiento indicada. Las obras de 2014/2015 tienen régimen propio y base acumulada de 5.000 euros, distinto del régimen de obras del ejercicio.

La reserva principal es documental: no se ha recuperado el original regional de Ley 13/1997 en DOGV 3153; el acceso ELI ensayado devuelve un portal HTML. Se conserva la reproducción original BOE de 07-04-1998. Se han recuperado y contrastado publicaciones originales y modificadoras de 2013–2026, incluidas correcciones de Ley 5/2025 y Decreto ley 14/2025, pero queda por cerrar por apartado toda la cadena de reformas regionales y actos remitidos. Se expresa como reserva y evidencia necesaria, sin afirmar que esa cadena está acreditada. Los manifiestos de investigaciones anteriores se usaron como índice, validando los hashes contra los bytes reales.

La prueba roja conserva 40 fallos de referencias y un control de cobertura correcto. Después del cambio pasan 81 casos: 41 de cobertura/referencias y 40 de alcance del evaluador. La prueba roja y los materiales de transporte se conservan externamente. No se modifican evaluadores compartidos ni se propone un cambio financiero sin contrato suficiente.

Para reextraer todas las citas, desde la raíz y en un entorno con Python y las dependencias fijadas:

```sh
uv run --no-project --python python3 --no-managed-python --with pymupdf==1.26.7 --with beautifulsoup4==4.14.3 --with jsonschema==4.26.0 python docs/procedencia/deducciones-2025/lotes/g/verificar.py --cas "$CAS_PLANO" --cas "$CAS_ADQUISICIONES" --schema "$SCHEMA_CONTRATO"
```

Los roots CAS y las cachés de uv deben estar fuera del repositorio. El verificador no descarga originales; comprueba ambos hashes, tamaño, cobertura y literal exacto de cada localizador. No determina aceptación jurídica. Los originales, imágenes de inspección y el índice de adquisición permanecen exclusivamente fuera de Git.
