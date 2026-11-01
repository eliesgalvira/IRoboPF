# Comprobaciones reproducibles

Los fallos provenían de imports de un motor privado en `.cache`, consultas a
blobs Git históricos, rangos AST anteriores a cambios del código y snapshots
cuyo cierre físico exige un CAS externo. El inventario también estaba desfasado.

Se conservan los controles de contratos públicos, mutaciones de obligaciones,
identidad, unidades, duplicación, precisión, selección temporal y los tests
financieros del workflow. Las fuentes de los generadores se fijan por contenido
explícito, con rechazo de bytes alterados. Los sitios actuales se localizan por
su ID literal y vuelven a verificarse contra el AST; la evidencia histórica no
se reescribe. No se modifica `lib/dominio`, `app` ni `lib/procedencia`.

Las comparaciones con el motor privado/legacy y los ensayos de transporte de
contratos adulterados mediante bypass privado se retiran. Las mutaciones de esos
contratos siguen rechazándose por la API pública. Los ensayos completos del CAS
se conservan bajo `tests/corpus-local/` y quedan omitidos explícitamente en CI.
No hay aprobación del corpus histórico ni aceptación fiscal implícita.

La fixture CI construye un snapshot documental v2 de un punto sintético,
comprime sus paquetes e índice, calcula su cierre y ejecuta los verificadores
productivos. Incluye controles negativos de conteo, software, catálogo y
cobertura. El puente Python conserva su fixture Madrid pequeña y su filtro de
una sola entrada; no copia el árbol de correcciones.

Reproducción: [CI.md](../CI.md). El inventario se regeneró mediante
`bun run inventario:generar`, sin cambios financieros ni apertura de puertas.
Los recibos y hashes de entrega permanecen en la entrega privada solicitada.

Los 21 comandos del perfil CI pasan localmente sobre una exportación iniciada
sin Git, caché, variables CAS ni dependencias instaladas. Incluyen lint y tipos
globales, 22 pruebas de puertos y las suites Python de corpus, enlaces y
preservación: 25, 24 y 19 pruebas respectivamente. La confirmación de GitHub
sigue pendiente.

El ensayo de almacenamiento externo crea sus objetos sintéticos y comprueba
acceso, respuestas HTTP, ausencia, corrupción, enlaces simbólicos y descriptores
inválidos. Cada grupo de rechazos parte de un almacén válido recuperado.

Se conserva el rechazo del formato R25. Las expectativas nominales obsoletas
sobre un recibo cuyo hash no coincide se retiran: no se permiten negativos que
pasen por un fallo de integridad anterior a la condición que pretendían probar.
El ensayo nominal Node que necesita originales externos se conserva como suite
CAS local opcional; no lee `.cache`. Los límites de tiempo de R47/R52 se fijan
por caso porque reconstruyen contratos AST completos; no se omiten aserciones.
Riesgo: el corpus histórico opcional requiere sus originales externos y puede
rechazar software actual distinto del preservado; CI no acredita ese corpus.
