# URL públicas y fechas desconocidas

La [revisión independiente A](../../revisiones/a/INFORME.md#contrato-url-y-fecha) reprodujo dos defectos del contrato documental. El [contraste posterior](../../revisiones/correcciones-ae/INFORME.md) corroboró la restricción de fecha nula y el rechazo de credenciales, con un defecto residual en enlaces Markdown.

Una URL con credenciales o parámetros de sesión podía entrar por una reserva de texto, aunque se rechazaba en `urlOficial`. Ahora se comprueban las URL reconocidas en cualquier texto antes de distinguir una URL oficial con el segmento `/home/` de una ruta local. Los diagnósticos no reproducen el valor recibido. La URL oficial válida sigue admitida.

El schema aislado admitía una norma con `fechaPublicacion: null`; el verificador ejecutable ya la rechazaba. Ambos exigen ahora que el nulo corresponda a un manual con una reserva no vacía. La fecha editorial del manual continúa separada de su publicación desconocida.

Se reprodujeron los tres casos rojos de `revisiones/a/pruebas-contrato.py` antes del arreglo. Los tres pasan después, junto con 47 regresiones y Ruff. Las pruebas adicionales cubren parámetros codificados o vacíos, URL dentro de prosa, clases de documentos normativos y reservas ausentes o vacías. No se reabren los defectos anteriores ya contrastados ni se infiere aceptación normativa de estos controles técnicos.

El defecto residual permitía un parámetro sensible sin valor cuando el cierre del enlace Markdown se interpretaba como parte de su nombre. Se reprodujeron los dos casos independientes y veinte variantes. La [revisión posterior](../../revisiones/privacidad-markdown/INFORME.md) corroboró su rechazo, pero detectó cuatro variantes de recorte prematuro en destinos angulares o escapados.

El verificador comprueba ahora tanto la URL textual completa como los destinos resueltos por CommonMark. Así se conservan los paréntesis que pertenecen a la dirección, las entidades, las imágenes y los enlaces por referencia. Se utiliza `markdown-it-py==4.0.0` junto a `jsonschema==4.26.0`; el lanzador fija ambas versiones. El análisis de tokens está descrito en la [documentación del parser](https://markdown-it-py.readthedocs.io/en/latest/using.html#the-token-stream). No se renderiza HTML ni se descarga ningún destino.

Las cuatro variantes se reprodujeron antes del cambio y se rechazan después. Pasan los 36 casos del revisor y 53 regresiones, con controles de enlaces inocuos y diagnósticos que no reproducen su valor. El coste es una dependencia adicional para reconocer Markdown, además de la inspección de URL textuales. Esta corrección de límites queda pendiente de revisión independiente; no reabre los contrastes favorables de fechas o del lote E.
