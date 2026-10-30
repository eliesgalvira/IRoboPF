# Arquitectura de procedencia: propuesta documental

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Propuesta de 29 de octubre de 2026 sobre la base `d4d708f6`, sin aceptación de hallazgos en este análisis.

La propuesta conserva Next 16.1.7 y el cálculo local. Define un corpus inmutable por hashes, snapshots fijados por versión del motor, páginas españolas individuales y enlaces por cada paso y línea del rastro. Los actores quedan como posible herramienta futura de coordinación editorial, sin incorporarlos a la lectura documental ni al cálculo privado. Cada una de las diez decisiones del ADR expresa objeción experta, motivo y coste aceptado.

## Entrega

- `ADR-propuesta.md`: diez decisiones, rutas, publicación atómica, caché, tamaño, retención, integridad, accesibilidad, análisis de Rivet/Durable Objects y límites de hosting.
- `schemas/model.schema.json` y 13 schemas de entrada: Parameter, Formula, Step, Derivation, Rule, Document, Citation, Facsimile, Snapshot, Package, BindingIndex, Trace y PageEnvelope. **14 archivos JSON Schema**.
- `contratos-y-pruebas.md`: invariantes semánticas y 36 pruebas propuestas; distinción entre validación estructural y aceptación fiscal.
- `hallazgos.json`: **7 observaciones arquitectónicas candidatas** (6 missing, 1 ambiguous), con ubicaciones y hashes del código leído.
- `fuentes.json`: **8 fuentes técnicas primarias descargadas**, originales conservados en CAS compartido; ninguna fuente fiscal se ha validado desde este ámbito.
- `citas-candidatas.json`: **8 pasajes comprobados** contra texto extraído de esas adquisiciones, con hashes y posiciones. HTML/texto, sin fingir PDF o coordenadas.
- `cobertura.json`: **29 áreas de diseño**, ejercicios 2012–2026 y territorios considerados como dimensión contractual; cero años/territorios validados fiscalmente. Lagunas precisas y responsables de integración.
- `validacion-esquemas.json`: **49 comprobaciones estructurales pasadas**. No sustituye las 36 pruebas semánticas/de integración propuestas.

## Diferencias concretas respecto al estado leído

1. `LineaCalculo` solo contiene etiqueta, fórmula y resultado; la propuesta fija identidad semántica y referencias a versión de regla/cita por línea, incluidas ramas y repeticiones.
2. `RastroCalculo` no declara versión de algoritmo/datos/corpus; el sobre propuesto fija las cuatro versiones y el escenario para reproducción.
3. `ParametroNormativoEjecutable` guarda nombre/valor/fuente; el modelo editorial añade ámbito temporal/territorial, unidad, tipo de conocimiento, derivaciones y estado de ejecución sin cambiar el repositorio de cálculo.
4. `FuenteNormativaNormalizada` no identifica bytes ni selectores; Document/Citation/Facsimile separan original, localización y render reproducible.
5. El rastro anual contiene referencias generales al Manual de 2025 y fuentes vacías en cuota diferencial. Esto demuestra una carencia de enlace preciso, **no demuestra por sí mismo cálculo fiscal incorrecto**. La propuesta exige versiones aplicables y pendientes explícitos.
6. El catálogo de deducciones tiene páginas de manual pero no hash/celdas. Se preserva catalogada frente a implementada y se separa esa condición de la contrarrevisión documental.
7. El layout incluye Analytics. Antes de prometer privacidad en fichas, debe probarse que navegación y errores no incorporan datos del caso. No se ha auditado el tráfico real ni se afirma fuga.

El diseño evita un defecto adicional: referencias bidireccionales por hash crearían ciclos sin solución. Las dependencias directas son hashes; los enlaces inversos de Citation son IDs interpretados dentro del snapshot. Aceptar una evidencia requiere un informe externo por hash, no una autorreferencia del objeto revisado.

## Límites y trabajo pendiente

No se han creado fichas fiscales reales para todo el inventario: hacerlo exige los itemIds y las citas contrarrevisadas de los auditores fiscales. Aquí queda definido el contrato de cada ficha, incluidos contenido pendiente, fórmula, derivación, norma, captura y bordes. No hay aceptación por semejanza con tests ni con el legacy.

No se han medido build, RSS o proveedor público. Los tamaños del ADR son supuestos de planificación marcados como tales; no cifras observadas. No se contrata ni presupone hosting nuevo. Publicar requiere destino durable, copia independiente, restauración y pruebas de cabeceras reales.

No se han validado PAdES, CSV, vigencia normativa ni cifras tributarias. Las fuentes de este ámbito son documentación técnica HTML y un RFC textual. No se solicitaron facsímiles PDF porque no son disposiciones fiscales; no se inventaron páginas/cajas. WARC y timestamp se evalúan como política archivística futura, no como capacidades ya ejecutadas.

Los schemas no prueban integridad del grafo, validez jurídica, igualdad de valores ni independencia efectiva del revisor. Esas puertas quedan especificadas para el pipeline/verificador de otro editor. No se ha duplicado su implementación. La documentación Next actual tiene APIs posteriores; se contrastó el mecanismo propuesto con la configuración del Next instalado, sin actualizar ni compilar.

## Comandos y reproducción

Desde `/home/elies/Repos/IRoboPF`:

```sh
nix shell nixpkgs#python3 -c python .cache/procedencia/arquitectura/fuentes.py
nix shell nixpkgs#python3 -c python .cache/procedencia/arquitectura/pasajes.py
nix shell nixpkgs#uv nixpkgs#python3 -c bash -c 'uv run --python "$(command -v python3)" --with jsonschema python .cache/procedencia/arquitectura/comprobar.py'
```

`fuentes.py` llama secuencialmente a `tools/procedencia/descargar.py` mediante su función `download`; respeta su lock global, User-Agent y pausa entre peticiones. No se lanzaron descargas paralelas. Las citas derivan del original por el algoritmo registrado, y el original conserva los hashes de adquisición. Los scripts son auxiliares de investigación, no pipeline de aplicación. No regenerar schemas con `esquemas.py`: fue un generador inicial; los JSON entregados son el contrato final revisado localmente.
