# Madrid 2020: límite legal y ejercicio del rastro

Corrección del hallazgo `AUT1721-MAD-2020` contrastado en la revisión independiente.

La Ley 6/2018, artículo único.Dos, publicada en [BOCM-20181228-1](https://www.bocm.es/boletin/CM_Orden_BOCM/2018/12/28/BOCM-20181228-1.PDF), página física 4, fija el inicio del último tramo en 53.407,20 euros. SHA-256 del original: `8a77dd284eb0c38b271ea0530ee475eb24f07762ea18d78a34f3d01a48648660`. La caja refinada es `[98, 628, 497, 748]`, en puntos PDF. La revisión de vigencia, incluida la corrección de 2019 y la reforma efectiva desde 2022, está en `../revisiones/autonomicas-2017-2021/`. El orquestador volvió a leer la tabla mediante pdftotext.

El manual AEAT 2020 conserva 53.407,29. Esa contradicción queda documentada; la referencia del dato corregido pasa al original normativo. No se afirma que AEAT publicara una declaración formal de errata.

Antes de cambiar el código, se añadieron dos regresiones y se ejecutaron juntas: ambas fallaron. Para base 53.407,29, la cuota liquidada obtenida era 7.395,82. La expresión publicada `7.395,81 + (53.407,29 − 53.407,20) × 0,21` da 7.395,8289, es decir, 7.395,83 con el redondeo actual. Cambiar solo el límite hace pasar este caso. La otra prueba calculó un caso de 2020 y encontró «escala autonómica general de 2025» en el rastro; ahora se utiliza el ejercicio de los parámetros seleccionados.

Comprobación posterior: 80 pruebas completas de comunidades y liquidación pasan; lint global correcto. Comando de pruebas:

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x --no-install vitest run tests/comunidades-autonomas.test.ts tests/liquidacion-irpf-anual.test.ts --maxWorkers=1
```

Límite de aceptación: la cuota del caso es íntegra autonómica antes de mínimos y deducciones. No queda resuelta la política general de cuotas fijas frente a integración de tipos, ni validada toda la escala, ni autenticada criptográficamente la firma del documento. Los selectores refinados siguen pendientes de promoción al corpus y facsímil definitivo. La corrección del texto no implica que el motor seleccionara globalmente un ejercicio incorrecto.
