# Retirada de referencias personales de terceros

Se retiran de la historia de `procedencia-documental` nombres y usuarios de terceros, enlaces e identificadores de sus publicaciones, texto literal y resúmenes, imágenes, respuestas verificadas de servicios y transportes que reproducían ese material. Las conclusiones técnicas y las fuentes oficiales se conservan. Su origen social se cita como **«un divulgador en X (referencia privada)»**.

Los créditos de `README.md` y `app/layout.tsx` se conservan expresamente, en todas sus versiones. No se cambia la interfaz ni el cálculo. En una prueba solo se anonimiza el nombre del caso, conservando entradas, operaciones y aserciones.

## Historia y migración

Punta anterior: `a11c26a367346ea0961b0da5c2a8652abe42dece`. Su estado equivalente reescrito es `ea0de5e221e8c8bb10491f1e1893fd91646e39aa`. La punta publicada añade los commits de mapas e informe y se consulta en `origin/procedencia-documental`.

Base anterior de `rediseno/expertos`: `7b5435a83600e6b614678243cea524dbd83f5d91`. Base equivalente: **`fa751a19e19f522008d7a0f6dc182d977abd5142`**. La [guía de migración](../almacen-externo/MIGRACION.md) permite trasladar los commits propios sin reintroducir el material retirado.

Se conservan los **217 commits**, autores, fechas y mensajes. Las **19 firmas existentes mantienen sus bytes y commits originales**: ninguno de esos commits necesitaba modificaciones. Cambian 147 identificadores por los cambios de árboles o ascendencia. Se cotejan todos los archivos y modos de cada commit. [Prueba de conservación](historia.json), [mapa acumulado](../almacen-externo/mapa-commits.tsv).

## Material retirado y evidencia conservada

El [inventario por archivo y versión](archivos.json) distingue modificación y retirada completa. El [inventario anónimo de cuentas](terceros.json) enumera 28 identificadores, sin publicar las correspondencias. Incluye al participante señalado y a otros interlocutores de los expedientes de correcciones y necesidades expertas; no afirma que sean 28 personas distintas.

Los originales sociales quedan únicamente en el respaldo privado. Las copias documentales modificadas tienen nuevos hashes en el [mapa acumulado de objetos](../privacidad/objetos.json); las [retiradas completas](retirados.json) no se presentan como copias verificables ni como evidencia oficial. Los recibos antiguos siguen siendo históricos: para repetirlos byte a byte hace falta el respaldo privado. No se renuevan atestaciones ni aceptación fiscal.

Se conserva el contenido propio del responsable del proyecto sobre la Ley del euro, junto con los documentos oficiales que lo sustentan. La retirada no cambia las decisiones sobre CX-01/CX-03 ni convierte las observaciones sociales en fuentes normativas.

## Comprobaciones

La [validación](VALIDACION.md) distingue conservación de historia, decisiones técnicas, copias anonimizadas y pruebas de funcionamiento. No se renuevan dictámenes fiscales.

## Respaldo privado

Antes de reescribir se creó y restauró un bundle de **2.982.979.274 bytes**. SHA-256: `b03c3b4117c5b7dbdd2225f9fc64db9c8410e949df8bf9b24f21bfdccdb38c88`. Se comprobaron 1.376 referencias y `git fsck --full`.

El almacén tiene dos copias verificadas independientes: **10.066 archivos y 523.862.620 bytes** por copia, sin hardlinks. Pin del manifiesto: `039cf98e50b3cff5b5cbd88831949fbcc7b0564db178490be5a574b336b081e4`. [Recibo de respaldo](respaldo.json).

El propietario recibe la ubicación y las instrucciones fuera de Git. El respaldo contiene las referencias reales y no debe publicarse ni distribuirse como semilla del backend sin filtrar. Ninguna copia ni worktree se ha borrado.

## Dudas y límites

- Se conserva una duda anterior sobre un metadato de un PDF institucional, sin atribución demostrada a una persona de estos hilos. [Localización sin reproducir el dato](../privacidad/dudas.json).
- No se investiga la identidad civil detrás de las cuentas. El inventario anónimo evita presentar identificadores como personas acreditadas.
- El análisis incluye los textos, mensajes de commit y contenedores comprimidos o codificados reconocidos. No demuestra ausencia de contenido cifrado, esteganografía ni copias hechas fuera del repositorio. [Comprobación de retirada](retirada-verificada.json).

`main` y las otras ramas permanecen intactas. En sus puntas se conservan los créditos autorizados; no se encontraron otras coincidencias en esas puntas. No se presenta esta comprobación como una auditoría integral de sus historias.

## GitHub y copias anteriores

La consulta con `gh` encontró **cero forks** y ninguna de las 19 solicitudes de cambio examinadas desciende del primer commit afectado, comprobando sus dos identidades históricas. Esto no descarta clones privados ni copias externas.

Un push forzado no purga las vistas por SHA ni los objetos que GitHub pueda conservar en caché. El propietario debe enviar a GitHub Support la solicitud privada preparada para retirar esas vistas y ejecutar la eliminación de objetos inaccesibles; Support decide si procede. Los clones externos necesitan tratamiento separado. [Procedimiento oficial de GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

No se ha enviado esa solicitud. No se reescribe ninguna otra rama ni se modifican los créditos que el propietario decidió conservar.
