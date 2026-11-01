# Ejercicio de origen y vigencia de dos deducciones

Se corrigen las diferencias documentales CAMP-01 y CAMP-02 de la [revisión independiente](../../revisiones/c-ampliado/INFORME.md). No se cambia una fórmula financiera ni se acredita un cálculo automático.

La ficha de traslado entre islas canarias distingue ahora los límites del año de origen: 45.500/60.500 euros para traslados de 2024 y 46.455/61.770 para los de 2025, en individual/conjunta. La segunda anualidad conserva la renta y el umbral del ejercicio del traslado. Se amplía también la lista de hechos necesarios para la ruta única.

El PDF oficial de [Ley 5/2024](https://sede.gobiernodecanarias.org/boc/boc-a-2024-260-4427.pdf), disposición final **décima.Tres**, reproduce el artículo 8.4; el encabezado de la disposición fija efectos desde el 1 de enero de 2024. Las páginas físicas 142 y 145 quedan citadas por hash, texto y coordenadas en [evidencias.json](evidencias.json). La referencia a «DF 12» de la revisión era incorrecta; se conserva en su informe histórico, pero no se usa como atribución activa. El original permanece en el almacén externo.

La descripción balear y la propuesta de parámetros dejan de fechar todo el régimen reforzado en julio de 2025. La [Ley 11/2023, artículo sexto](https://www.atib.es/normas/Llei_11-2023_s.pdf) ya establecía el 50%, con máximo de 900 euros, para los colectivos cualificados. La fecha del 11 de julio de 2025 delimita las incorporaciones de autónomos y el incremento de renta de familias numerosas especiales. Se conservan los requisitos detallados y las reglas para devengos anteriores.

Los dos discriminantes independientes fallaban antes de la corrección. Su reproducción no necesita originales externos ni objetos Git históricos:

```sh
bun docs/procedencia/deducciones-2025/revisiones/c-ampliado/casos.ts
```

La corrección requiere un contraste independiente acotado. No reabre las otras 49 concordancias documentales ni elimina las reservas de autenticidad del PDF de las tres publicaciones baleares cuyo HTML está disponible.
