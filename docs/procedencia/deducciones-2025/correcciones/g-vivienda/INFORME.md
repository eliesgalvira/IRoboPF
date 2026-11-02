# Vivienda valenciana · remisiones 2025

Candidato sobre `39b29c55474f57b296a10654ae44350c8294b501`, limitado a tres códigos. Sin cambios de cálculo ni API. La revisión independiente corresponde a la integración.

[Dictámenes](dictamenes.json), [cadenas con efecto temporal](cadenas.json), [originales por ambos hashes](fuentes.json), [citas reextraídas](citas.json), [propuestas con preimagen](propuestas.json) y [fronteras](fronteras.json) permiten revisar y componer los cambios sin modificar registros compartidos. Se conservan las 111 rectificaciones anteriores.

El alquiler se compara con la referencia **autonómica**, incluyendo gastos y tributos repercutidos, salvo suministros. AEAT2025 remite al visor GVA; los metadatos oficiales identifican tablas de datos2018, revisión2018 y metadato2023. No existe aquí una tabla anual2025 inventada ni actualización por IRAV/IPC/SERPAVI. El valor aplicable a una vivienda requiere área, período constructivo, superficie y tabla/consulta acreditada. La consulta actual no demuestra por sí sola la versión publicada en cada fecha histórica; hay además una diferencia terminológica entre superficie útil del metadato y construida de uso vivienda de CaLab. Véase [criterio y reservas](DICTAMEN.md).

Fianza: el arrendador deposita; el plazo administrativo de un mes y la condición fiscal de depósito antes de acabar el período son diferentes. Un ingreso en enero puede estar en plazo administrativo y fallar fiscalmente; uno tardío dentro del período no incumple por ese solo retraso la condición temporal fiscal.

Obras: se documentan DC09, errata2009, Orden19/2010, Decreto184/2013, sentencia2016 y auto2017, Decreto65/2019 y reforma de su anexoII por DL14/2025 desde30diciembre. DC23 se prorrogó dos veces y se derogó desde1junio2025 antes de su entrada prevista: no sustituye a DC09 en2025. La presunta errata65/2019 del parcial es realmente una orden deportiva y se descarta.

Obras2014/2015 pagadas2025 conservan DA13 y su alternativa de plan histórico o normativa autonómica. Las actuales se contrastan con programas materiales de RD42/2022 y RD853/2021, sus modificaciones y erratas; la concesión de ayuda no sustituye el cumplimiento técnico. El expediente particular decide régimen transitorio, actuación y documentación. No se declara conforme una obra hipotética ni una ficha financiera completa.

Validación documental sin red ni CAS:

```sh
python3 docs/procedencia/deducciones-2025/correcciones/g-vivienda/verificar.py
```

La opción `--cas` reextrae originales y requiere PyMuPDF1.26.7 y beautifulsoup4 4.14.3. Las fronteras son especificaciones para el motor común; la API regional inspeccionada contiene consignación descriptiva. No se presentan como pruebas financieras ejecutadas. No procede build global por este cambio documental.
