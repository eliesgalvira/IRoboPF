# Contenido versionado: entrega técnica candidata

Base de integración comunicada: `d9ff49c7`. No hay operaciones VCS mutantes, cambios al motor, al inventario, a auditorías históricas, package, CI o componentes existentes. No se ejecutaron build, navegador ni suite legacy. La integración y una contrarrevisión nueva corresponden al padre. Esta entrega no acepta fiscalidad.

Snapshot recomendado para examinar: `31be43e7347ee116fd6349e946914602a706dbdce56b955a5aa8290fa9f7325e`. Los tres snapshots anteriores de esta misma implementación se conservan; comparten paquetes por hash y no duplican las fichas. El registro admite exclusivamente esos snapshots. No existe alias latest.

## Qué contiene

47.789 fichas de ocurrencias técnicas y cuatro conceptos editoriales: discrepancia del límite madrileño, conservación de pérdidas, exención por adquisición de inmuebles y renta vitalicia. Las fichas conservan identidad versionada, tipo técnico original, fuente/hash/localizador, expresión, valor observado y dimensiones candidatas. Cada una tiene fórmula, derivación, norma, evidencia y bordes con estados pendientes explícitos. **No son 47.789 reglas jurídicas redactadas ni revisadas.**

Los conceptos remiten a informes históricos existentes, cuyo hash se fija; no inventan cita oficial, facsímil, bindings ni propagación de sus aceptaciones acotadas. La primera capa editorial es `conceptos.json`; editarla crea otra revisión y otro snapshot. Los informes originales permanecen intactos.

Modelo ejecutable en `lib/procedencia/modelo.ts`, schema generado en `schemas/procedencia/contenido/entidad.schema.json`. Parameter, Formula, Step y Derivation comparten contrato de observación; Rule, Document, Citation y Facsimile tienen payload propio. No se promueven literalmente los catorce schemas candidatos de arquitectura: este contrato nuevo acota la fase implementada. Los importes ejecutados del rastro usan decimal textual; el valor observado del inventario sigue siendo texto técnico, incluso cuando representa un límite abierto, y no se presenta como importe fiscal validado.

El verificador comprueba hashes, índices exactos, pertenencia, tipos de arista, DAG mediante recorrido iterativo, intervalos semiabiertos y compatibilidad de ámbitos de dependencias computacionales. Citas requieren documento único y selector compatible con MIME; PDF, HTML, texto y CSV son variantes distintas. Facsímiles requieren cita, imagen y receta. Blobs auxiliares deben pertenecer al snapshot y sus bytes se cotejan en la verificación completa. La extracción de citas y la reproducción de PDF siguen en el corpus existente; declarar un selector válido no acredita su texto.

Las revisiones son externas al payload: hash de entidad, proposición, fuentes, ámbito y bytes del informe. El registro de confianza lo proporciona el integrador, fuera del payload; dos nombres no acreditan independencia. Incluso una revisión documentada devuelve aceptación fiscal pendiente: falta el puente al inventario reconstruido y la política fiscal revisada.

## Rutas y rastro

- `/procedencia`: lista acotada de snapshots.
- `/procedencia/SNAPSHOT`: búsqueda por título/ID, máximo 30 resultados.
- `/procedencia/SNAPSHOT/ambito/TERRITORIO/EJERCICIO`: filtro por dimensiones candidatas; no selecciona reglas fiscales.
- `/procedencia/SNAPSHOT/ID/REVISION`: HTML de servidor completo mediante Route Handler. 404 para desconocido; 503 para objeto prometido ausente/corrupto; ninguna sustitución de versión. No prerenderiza las fichas.

La ficha individual usa HTML semántico sin script, CSP y Referrer-Policy no-referrer. Los índices heredan el layout existente: su Analytics y privacidad observable siguen sin certificar. Ninguna función del adaptador incorpora salario, entradas ni resultados a un enlace documental. La búsqueda es pública y no debe usarse para introducir casos personales.

`lib/procedencia/rastro.ts` entrega contratos de versiones, siteId, instanceId, sujeto y resultados discriminados. `no-soportada` tiene motivo y no admite decimal. El adaptador antiguo solo declara pendiente; no parsea etiquetas. No se han modificado los callsites ni los dos tipos históricos para evitar conflicto con el editor del rastro.

Instrumentación por el padre:

1. Fijar snapshot, digest de algoritmo/datos y versión de explicación al comenzar el cálculo; no derivarlos de una etiqueta ni del reloj.
2. Asignar siteId explícito por punto semántico y por línea; instanceId explícito por emisión, con identidad del tramo/operación, no una identidad conceptual basada en posición.
3. Construir un BindingIndex revisable con referencias exactas resueltas en ese snapshot. No enlazar automáticamente una ocurrencia solo porque su expresión parezca igual.
4. Comprobar versiones, unicidad y bindings con `verificarRastro`; comprobar también el ámbito del sujeto con el selector y el snapshot. El adaptador no crea ni selecciona bindings por sí mismo.
5. Construir el href con `enlaceRastro`; transportar únicamente snapshot/ID/revisión. Mantener entradas e intermedios privados en el rastro local.
6. Agregar pruebas por rama del motor después de la integración del otro editor. La cobertura de callsites continúa pendiente.

## Comandos

Dependencias existentes enlazadas, sin instalación. Nix proporciona Bun/Node. Un worker y lock compartido:

```sh
free -m
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun scripts/procedencia/contenido-generar.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun scripts/procedencia/contenido-verificar.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bunx vitest run --config scripts/procedencia/contenido-vitest.mjs
nix shell nixpkgs#bun nixpkgs#nodejs -c bun run lint
nix shell nixpkgs#bun nixpkgs#nodejs -c flock /tmp/irobopf-validacion-pesada.lock bun run typecheck
```

El generador **lee** el artefacto y no reconstruye inventario. Si el padre cambia fuentes del motor, debe regenerar inventario al integrar y después contenido. El verificador de contenido compara contra el artefacto fijado; no acredita que este siga vigente respecto al motor actual. Las versiones anteriores requieren su inventario conservado para un cotejo histórico, no el nuevo artefacto del checkout.

## Costes y decisiones

1. Paquetes CAS gzip por 256 prefijos del hash del ID. Objeción: muchos archivos pequeños y búsqueda lineal. Motivo: resolver una ficha leyendo solo su índice y paquete, sin descomprimir el inventario completo. Coste: 512 objetos de índices/paquetes y lectura de hasta 256 paquetes en búsquedas sin resultados. El índice guarda solo ID/revisión; no duplica contenido.
2. Observaciones pendientes y ámbito desconocido. Objeción: no satisfacen todavía la redacción jurídica experta. Motivo: no convertir inferencia sintáctica en interpretación. Coste: trabajo editorial y contrarrevisión pendientes por ocurrencia/concepto.
3. Selección temporal estricta sin jerarquía territorial implícita. Objeción: una norma estatal puede aplicarse a varias comunidades. Motivo: esa compatibilidad debe declararse, no inferirse por prefijo o fallback. Coste: variantes explícitas y rechazo de ámbitos aún desconocidos; no es un nuevo intérprete fiscal.
4. IO local síncrono en una frontera Node `.mjs`, modelos y validadores TypeScript. Objeción: bloquea el worker mientras lee/descomprime y el IO mjs no recibe el mismo análisis estático de TypeScript. Motivo: mantener dependencias existentes y lectura pequeña, determinista, sin introducir plataforma o servicio remoto. Coste: medir concurrencia y output tracing antes de producción. Lint incluye esa frontera; las pruebas ejercitan errores reales. No se desactiva ninguna regla.
5. Ficha como Route Handler de Next con HTML de servidor. Objeción: no usa el layout visual ni RSC de la calculadora. Motivo: devolver 503 real y contenido legible sin telemetría propia, sin rediseñar componentes. Coste: ficha austera y cabeceras host/CDN aún sin ensayo; índices sí usan Server Components.
6. Registro publicado mediante rename tras escribir objetos. Objeción: atomicidad del archivo no acredita preservación ni multiwriter distribuido. Motivo: fallo anterior al cambio del registro conserva la lista previa. Coste: usar el lock; objetos huérfanos tras interrupción pueden permanecer. No hay GC, publicación remota ni réplica.
7. Saneamiento cerrado antes de hash: campos extra rechazados, Document sin cabeceras/localPath y URL sin credenciales/query/fragmento. Objeción: algunas URL oficiales requieren query. Motivo: no publicar secretos arbitrarios ni asumir que cualquier query es pública. Coste: esas adquisiciones necesitan proyección editorial explícita; no se importan automáticamente. La validación no equivale a un detector universal de secretos escritos en prosa.

## Mediciones y límites de aceptación

256 paquetes, 10.927.910 bytes gzip totales, máximo 54.864 bytes por paquete. Generación final: RSS al terminar 1.342.984.192 bytes (no pico medido). Los paquetes son compartidos por los cuatro snapshots. Todos los archivos entregados están por debajo de 10 MB. Los PDF y originales del corpus no entran en el bundle ni se copian aquí.

No se ha ejecutado build, output tracing, prueba de CDN, restauración desde copia externa, firma/CSV nueva, tráfico del navegador ni carga concurrente. El lector usa ruta relativa al cwd del servidor: el padre debe incluir `datos/` en el artefacto de despliegue y comprobar output tracing antes de publicar. Sin estos archivos falla cerrado. No se afirma soporte de output export ni preservación externa.

La exactitud aritmética del motor, la integridad de bytes, la interpretación legal y la aceptación fiscal siguen siendo cuatro obligaciones distintas. Esta entrega acredita controles técnicos locales y pruebas sintéticas/servidor; requiere contrarrevisión nueva antes de aceptación.
