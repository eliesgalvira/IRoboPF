# Lecturas monetarias de las conjuntas

Todos los casos son sintéticos. `conjunta-readbacks11.mjs` deriva la evidencia monetaria de los archivos originales inventariados en el recibo. Comprueba el inicio de una nueva declaración, las acciones del plan, la secuencia de observaciones y censos, los selectores, las etiquetas, los valores y su ámbito SES. El verificador vuelve a derivar esos registros desde las fuentes y compara sus campos.

## Cinco controles

`GCS`, `GCC` y `GDJ` requieren escritura explícita de cero, lectura tras perder foco, cierre del diálogo y lectura tras reabrirlo. Sólo dentro de esa cadena se admite que Open muestre el cero como blanco y lo omita en SES. Los identificadores efímeros se resuelven en cada DOM mediante la etiqueta y su celda contigua.

`IDICLDED2` y `GSSCLDED2` corresponden a los controles reales del detalle salarial: posiciones 0 y 8, contrastadas con el título y el inventario previo de nueve controles. Requieren lectura tras perder foco y persistencia en `IRPF2025`, titular `DECLARANTE`. No se atribuye una lectura tras reapertura que no se haya realizado.

Los importes salariales `IDII`, `GSS` e `IDRE` pertenecen a `DECLARANTE/ATRABAJO/DLGTRABAJO`. El detalle tiene un ámbito diferente, observado en las capturas. Las cadenas originales se conservan; su comparación usa aritmética decimal exacta.

## Autoridad de Aragón-02-v2

El expediente original conserva un bloque `hogar` con salario 45.000 €, cotizaciones 2.925 € y retenciones 8.500 €. Su entrada candidata, el diseño previo y la captura v2 usan 47.000 €, 3.055 € y 6.580 €. No se oculta esa divergencia ni se reescribe el original.

La adición `open2025-aragon-02-v2-autoridad.json`, en `docs/procedencia/simuladores/medicion-2025/conjuntas-preparacion/datos/`, identifica la entrada v2 y enlaza el expediente, el fixture capturado y el diseño anterior a la captura. El verificador exige sus bytes, la fuente de diseño y la igualdad de entrada, trabajo, retenciones, territorio y ejercicio. Cambiar sólo el estado de una referencia no permite aceptar el caso.

## Reproducción

La preparación offline recibe plan, capturas, raíz de referencia y una salida nueva:

```text
timeout -k 30s 5m bun tools/procedencia/simuladores/preparar-conjunta-readbacks11.mjs plan.json capturas raiz-referencia salida-nueva
```

Este paso genera referencias para revisión y no ejecuta el motor. La CLI del verificador carga los archivos originales del paquete, `fixture.json` y `expediente.json`. Para la adición v2 requiere también `autoridad.json` y `diseno.json`, comprobados mediante sus huellas. Los originales permanecen intactos.

Las pruebas adversas cubren solicitudes ausentes o alteradas, ceros no persistidos, reapertura falsa, cambios de identificador, etiqueta o posición incorrectas, detalle en blanco, ámbitos SES erróneos, duplicados y fuentes modificadas, también con recibos rehuellados. La vinculación del transporte y la coincidencia fiscal son resultados distintos.
