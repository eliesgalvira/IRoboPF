# URL públicas y fechas desconocidas

La [revisión independiente A](../../revisiones/a/INFORME.md#contrato-url-y-fecha) reprodujo dos defectos del contrato documental. Están corregidos y pendientes de contraste independiente.

Una URL con credenciales o parámetros de sesión podía entrar por una reserva de texto, aunque se rechazaba en `urlOficial`. Ahora se comprueban las URL reconocidas en cualquier texto antes de distinguir una URL oficial con el segmento `/home/` de una ruta local. Los diagnósticos no reproducen el valor recibido. La URL oficial válida sigue admitida.

El schema aislado admitía una norma con `fechaPublicacion: null`; el verificador ejecutable ya la rechazaba. Ambos exigen ahora que el nulo corresponda a un manual con una reserva no vacía. La fecha editorial del manual continúa separada de su publicación desconocida.

Se reprodujeron los tres casos rojos de `revisiones/a/pruebas-contrato.py` antes del arreglo. Los tres pasan después, junto con 47 regresiones y Ruff. Las pruebas adicionales cubren parámetros codificados o vacíos, URL dentro de prosa, clases de documentos normativos y reservas ausentes o vacías. No se reabren los defectos anteriores ya contrastados ni se infiere aceptación normativa de estos controles técnicos.
