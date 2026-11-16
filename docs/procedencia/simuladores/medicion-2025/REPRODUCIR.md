# Medición Open 2025

La unidad es un perfil sintético distinto, no una invocación. `casos.json` fija
80 objetivos; una captura fallida, un contrato pendiente o un rechazo de la API
permanecen dentro de ese denominador. C300 es una regresión separada de Madrid.

## Captura

`tools/procedencia/simuladores/capturar-casos.mjs` recibe `--cases`, `--limit` y,
opcionalmente, `--case`. El JSON puede ser una lista o el manifiesto con `casos`.
El plan de transporte identifica los perfiles admitidos antes de abrir Open.
No convierte un caso objetivo conjunto en su referencia individual.

El entorno debe proporcionar `C_CHROMIUM` y `C_PLAYWRIGHT_MODULE`, ambos con
archivos ejecutables o módulos instalados externamente, y `C_RUN_DIR`, un
directorio de resultados fuera del repositorio. No se instalan dependencias de
captura en las carpetas de evidencia ni se modifican dependencias de la web.

La captura usa un navegador, una declaración y una petición tras otra, con
pausas entre interacciones. Cada caso tiene un límite de diez minutos y no se
reintenta automáticamente. SES y PDF son los bytes descargados; los importes
se introducen por formulario y se leen de nuevo después de abandonar el campo.
Los intentos fallidos y los diagnósticos se conservan separadamente.

Los datos son inventados: nombres de prueba, identificadores sintéticos e
importes del manifiesto. Un diagnóstico HTML, una captura de pantalla o un log
no es publicable automáticamente. Debe pasar la puerta de privacidad antes de
añadirse al repositorio.

## Comparación

El medidor ejecuta `liquidarIrpfAnualExplicito`, valida la entrada con el esquema
público y compara `cuotaDiferencialPresentada` con la casilla 0670 del PDF.
Comprueba además que el SES corresponde a los hechos transportados. Los hashes
por sí solos sólo acreditan integridad de bytes.

El lector PDF lo fija el entorno Nix. Para reproducir una colección `observaciones.json`:

```nu
timeout -k 30s 5m nix develop path:tools/procedencia --command bun tools/procedencia/simuladores/medir-casos.mjs docs/procedencia/simuladores/medicion-2025/observaciones.json --manifest docs/procedencia/simuladores/medicion-2025/casos.json
```

Salida 0 significa igualdad verificada en todos los objetivos. Salida 1 indica
que hay comparaciones completas sin igualdad verificada; salida 2 conserva
casos todavía sin comparación. Una salida distinta de cero del medidor puede
ser el resultado esperado de una línea base: no se disfraza como exactitud
fiscal porque los tests del instrumento pasen.

`iguales` sólo incluye vinculaciones comprobadas. `igualesExploratorias` queda
separado y no se usa como nota. Una familia cuyo transporte aún no acredite los
predicados relevantes sigue pendiente aunque los dos importes coincidan.

`discrepanciasPorPrioridad` ordena diferencia absoluta por peso externo, con
aritmética decimal exacta. El peso de este diseño es un proxy territorial
basado en declaraciones AEAT 2024; no representa una incidencia conjunta
estimada. Los rechazos sin importe no reciben un cero ni euros inventados.

## Controles

El CI ejecuta la comprobación offline del transporte y las pruebas del medidor,
la vinculación SES/PDF y las identidades familiares. No abre Open ni depende
de que el servicio público esté disponible durante CI. Las comprobaciones
completas del repositorio y el sanitizador externo siguen siendo obligatorios
antes de publicar.
