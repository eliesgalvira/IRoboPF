# Contraste de cinco rectificaciones documentales

Base exacta: `7a91219490ab8daaa3f9a19275c168bafc3e5668`. Las cinco rectificaciones quedan corroboradas dentro de su alcance documental. [Decisiones individuales y contraejemplos](decisiones.json); [literales, hashes y localizadores](evidencias.json). La recepción corresponde al padre. No se modifican producto ni entregas revisadas y no se repiten las 142 concordancias previas.

- **AAMP-01:** las ocho citas ajenas desaparecen del expediente de donativos, cobertura y proposiciones. Las ocho siguen presentes en celiaquía con artículo 22 quater. BOJA artículo 22 y manual páginas 54–55 preservan 10% y máximo 150 euros. La incorporación común de VEH/192/2018 sigue siendo otro pendiente.
- **BC01:** la curatela representativa judicial figura como criterio del manual, página física 220. No se interpola en el artículo autonómico ni se elimina la patria potestad prorrogada o rehabilitada transitoria. La curatela asistencial por sí sola no acredita ese criterio.
- **BC02:** Ley 3/2024, artículo 3.Uno, excluye rentas iguales o superiores a 8.000 euros; manual página física 226 admite el extremo. La divergencia está registrada y la ficha conserva la desigualdad estricta. Los casos 7.999,99 / 8.000 / 8.000,01 distinguen ambos textos.
- **CAMP-01:** la segunda anualidad mantiene renta, modalidad y umbral del ejercicio del traslado. En 2024 son 45.500/60.500; en 2025, 46.455/61.770. El PDF oficial `2c5f46bdb36e9ab8c3cad48cdac7a977a21846b86b74c532c1f82fff4d24f030`, páginas físicas 142/144/145, confirma **DF décima.Tres**, efectos desde 1/1/2024 y artículo 8.4. La excepción del apartado Cuatro afecta al artículo 9. La atribución histórica DF12 queda rectificada expresamente.
- **CAMP-02:** Ley 11/2023, artículo sexto, página física 5, ya incorpora 50%/900 para colectivos cualificados. Su disposición final única está en la página 14. Ley 3/2025, DF tercera y quinta, páginas 17–18, respalda las incorporaciones con entrada el 11/7/2025. El resumen y la propuesta preservan el régimen reforzado previo para devengos anteriores; julio no origina todo el régimen.

Los discriminantes propios comprueban las tres cadenas de AAMP-01, preservación de las ocho citas válidas, separación manual/ley en BC01, frontera estricta de BC02 y hechos temporales del traslado. Los ejemplos numéricos son oráculos documentales, con los demás requisitos expresamente supuestos; no ejecutan una API fiscal. Una renta corriente alta no elimina por sí sola el derecho nacido con renta de origen admisible, y una renta corriente baja no lo crea si faltó en origen. Para conciliación, 35 años y devengo por fallecimiento el 10/7, menor todo el año y un titular: gasto 1.000 permite 500; gasto 2.000 alcanza 900, sujetos al resto de condiciones.

Se conserva una reserva auxiliar concreta: el selector histórico de `rbc-ley-1` no localiza el elemento con beautifulsoup4 4.14.3. El original íntegro y su literal de DT segunda se corroboran mediante el localizador independiente `cinco-DT2`. Esto no desmiente BC01 ni se presenta como un fallo nuevo de producto. Se conservan privadamente el error y la reextracción alternativa; no se modifica aquella entrega.

Verificación: 273 pruebas en seis suites documentales del alcance; regresiones previas A/B/C verdes (3 pruebas, 9 pruebas y 14 comprobaciones); cinco grupos propios verdes; tipos y ESLint focalizados sin errores. Cien citas reextraíbles, con originales externos y ambos hashes/tamaño. Las pruebas ordinarias no necesitan CAS, red ni historia Git. El antecedente de 21 comandos de CI pertenece al padre; no se ejecuta aquí CI global ni build. No cambia la API y esta revisión no acredita una liquidación fiscal completa.

Desde la raíz, con las dependencias del proyecto disponibles:

```sh
bun docs/procedencia/deducciones-2025/revisiones/cinco-rectificaciones/casos.ts
python3 docs/procedencia/deducciones-2025/revisiones/a-ampliado/casos.py
bun run test --config docs/procedencia/deducciones-2025/revisiones/b-condiciones/vitest.config.mjs
bun docs/procedencia/deducciones-2025/revisiones/c-ampliado/casos.ts
```

Contraste opcional externo, con PyMuPDF 1.26.7 y beautifulsoup4 4.14.3 en un entorno aislado; repetir `--cas` por cada almacén plano aportado:

```sh
python3 docs/procedencia/deducciones-2025/revisiones/cinco-rectificaciones/corpus.py --cas "$CAS_EXTERNO"
```

El transporte privado conserva payload completo, patch POSIX, manifiestos antes/después, logs, cotejo físico y prueba de reconstrucción sin Git. Los originales permanecen fuera del repositorio.
