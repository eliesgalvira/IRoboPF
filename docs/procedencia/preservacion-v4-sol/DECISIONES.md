# Decisiones candidatas de la edición v4

## V4-D01 — Corte nuevo con pin externo

Objeción del mejor archivero: actualizar v3 destruiría el corte histórico y permitiría confianza circular. Respuesta: paquete nuevo v4, HEAD exacto y SHA256 externo obligatorio en carga, traslado, verificación y confirmación. Los marcadores v3 y todas sus dependencias se conservan por ambos hashes, sin alterar bytes. Coste: consumidor nuevo y otra revisión independiente; el pin debe recibirse por un canal editorial ajeno al paquete.

## V4-D02 — Unión por contenido y alcance de las fuentes

Objeción: los 85 posteriores no censan R20/R21; recorrer toda la caché incorporaría posts, mocks y material sin procedencia. Respuesta: archivos versionados del corte, localizadores explícitos entregados y búsquedas por hash en cuatro CAS concretos. Los binarios requieren adquisición admisible coincidente o referencia explícita de facsímil. Código, índices y recetas son auxiliares. Coste: referencias no resueltas y exclusiones explícitas; no se garantiza descubrir documentos sin referencias ni fuera de esos CAS. Un hash hexadecimal cualquiera no equivale a documento perdido. No se infiere adquisición del nombre o fecha del checkout.

## V4-D03 — Fuente y derivado saneado con identidades distintas

Objeción: transportar cookies y rutas privadas con un PDF íntegro no preserva privacidad; sanear conservando el hash falsificaría la fuente. Respuesta: saneamiento de JSON nuevos antes del CAS auxiliar; SHA256/SHA512/tamaño de origen y derivado separados. Se omiten cabeceras, redirecciones, localPath y claves sensibles conocidas; se sustituyen localizadores absolutos. Adquisiciones proyectadas por campos explícitos. Marcadores y dependencias v3 exactos como históricos, sin prometer anonimización retroactiva. Coste: no es captura HTTP completa; la política mecánica no acredita ausencia semántica universal de información privada. Hace falta revisión editorial nueva antes de respaldar el paquete como actualizado.

## V4-D04 — Transporte local exclusivo y recuperación

Objeción: dos copias en el mismo disco no son custodia independiente ni ensayo de corte eléctrico. Respuesta: destinos inexistentes, un blob por vez, sin hardlinks; cotejo de ambos hashes, tamaño, metadatos y referencias; fsync. Fallo posterior al marcador significa durabilidad indeterminada, con conservación y confirmación posterior. Coste: tres copias contando recepción, más residuos de ensayos y colecciones exploratorias conservadas. Sin garantía contra escritor hostil, hardware defectuoso ni rollback.

## V4-D05 — Reproducibilidad sin aceptación fiscal

Objeción: contar objetos o pruebas no evalúa autenticidad, interpretación ni revisión. Respuesta: primarios candidatos, capturas secundarias, facsímiles y auxiliares separados; aceptación ninguna. Rojos históricos intactos; pruebas heredadas con expectativas originales. Sin atestaciones propias ni cambios en confianza. Coste: todo hallazgo nuevo requiere contraste independiente. No se promueven inventario, sitios, snapshots o payloads por recuentos.

## V4-D06 — Herramientas y memoria

Objeción: paralelizar recorridos o copiar un entorno completo arriesga Victus. Respuesta: Nix/uv, entorno absoluto propio, un trabajador y bloqueo pesado; cotejo físico un blob por vez. Sin código Effect o TypeScript nuevo; mypy comprueba Python con alcance registrado. Coste: espera del bloqueo compartido y tipado parcial del parser JSON dinámico, sin garantía estática estricta de todas las estructuras. Sin instalación global, build, servidor, preview, red documental ni gasto. Crossa conserva v1 `2df6c208…`, desfasado respecto de v5 R26, misma casa y propietario, sin custodia independiente.

## V4-D07 — Localizadores entregados y URLs documentales exactas

Objeción: ampliar por sufijo libre la política TGSS o copiar toda la revisión de X eludiría privacidad y procedencia. Respuesta: once URLs nuevas exactas examinadas: cinco pares canónica/final de los originales TGSS entregados y la del apéndice AEAT. Lista propia fijada como dependencia, sin modificar v3. Solo se leen los cinco CAS TGSS indicados expresamente en posteriores.json y el PDF AEAT por su hash completo; no se exploran otros checkouts ni se copian posts o imágenes X. Se reconocen cropSha256 y dos índices CDX como auxiliares de adquisición, nunca como PDF primario. Coste: otra lista que revisar y localizadores históricos necesarios solo durante la recepción; el paquete final resuelve todos esos bytes por hash. La clasificación candidata no certifica autenticidad del emisor.

## V4-D08 — Incluir el índice grande de citas

Objeción: el corte intermedio excluía citas-candidatas.json de retenciones2020–2026 por 24.110.694 bytes, heredando sin justificación material la cota de 16 MiB de v3. Respuesta: el corte final admite 64 MiB por archivo y conserva este metadato con saneamiento, dos identidades y comprobación de referencias tipadas. Se conservan paquete-v4/restauracion-v4 intermedios y se exportan destinos nuevos paquete-v4-final/restauracion-v4-final con otro pin. Coste: nueva colección, otros dos traslados y más disco local; no se altera la historia ni se presenta el primer pin como cierre. Un archivo mayor de 64 MiB exigiría tratamiento acotado adicional, pero no hay otro metadato omitido por tamaño en el corte final.
