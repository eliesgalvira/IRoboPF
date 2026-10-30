<a id="coordinación-de-la-primera-ronda"></a>

# Coordinación de la auditoría documental

Criterios de coordinación documental y de integración. Las asignaciones concretas y sus estados pertenecen a los registros de trabajo; este documento conserva las reglas para revisar e integrar resultados.

<a id="modelo-obligatorio-de-los-subagentes-corrección-urgente-de-elies"></a>

## Recursos y delegación

La selección de modelos y recursos se rige por las instrucciones vigentes del encargo. Los registros históricos de una auditoría no autorizan nuevas delegaciones ni sustituyen esas instrucciones.

<a id="regla-obligatoria-de-control-de-versiones-corrección-de-elies"></a>

## Control de versiones e integración

El repositorio se gestiona con Jujutsu. No ejecutar `jj git init` dentro de un checkout/worktree Git vinculado ni mezclar escrituras de dos sistemas de control de versiones. Los colaboradores entregan los archivos de su ámbito al responsable de integración, sin operaciones VCS mutantes.

Antes de integrar, comparar el árbol recibido con su base, enumerar borrados y contrastar los archivos reales del checkout. Un índice vacío puede mostrar borrados aunque los archivos existan; una rama sin commits tampoco acredita los cambios en disco. Rechazar borrados masivos no solicitados. Si se integran archivos sueltos, aceptar solo las rutas del ámbito asignado, sin copiar metadatos VCS ni cachés.

## Reparto

- Inventario: extracción reproducible de parámetros, literales, pasos y derivaciones, con cobertura anual y territorial.
- Lint: diagnósticos reproducidos sobre el árbol examinado, preservando comportamiento y sin rediseño.
- Corpus: descarga verificable, almacenamiento por hash, citas, facsímiles y verificador.
- Arquitectura: notas por intención, ADR, contratos de contenido/rutas/rastros.
- Necesidades expertas: análisis de material público contrastado y requisitos de reproducción.
- Escalas estatales y ahorro: 2012–2026.
- Escalas autonómicas: lotes 2012–2016, 2017–2021 y 2022–2026.
- Mínimos personales y familiares: estatales y autonómicos.
- Trabajo: gastos, reducción, deducciones estatales y obligación de declarar.
- Seguridad Social: bases, tipos, MEI, solidaridad y límites.
- Retenciones: lotes 2012–2019 y 2020–2026.
- Capital inmobiliario y ganancias: reglas, integración y compensación.
- Deducciones autonómicas: dos grupos territoriales; diferenciar catálogo y ejecución.
- IPC y redondeos: datos oficiales, proyecciones y política de redondeo por operación.

La contrarrevisión debe ser independiente por lote. El inventario y los informes iniciales no constituyen aceptación.

## Descargas y archivos

Se puede usar `tools/procedencia/descargar.py URL` con Python estándar. Conserva original por hash, metadatos HTTP y un índice por URL en `.cache/procedencia/`, fuera de Git. Serializa descargas con un lock de máquina y dos segundos entre peticiones. Identifica el proyecto mediante User-Agent. La caché no acredita autenticidad ni interpretación legal y es una base transitoria para la canalización del corpus.

Cada auditor escribe solamente `docs/procedencia/auditorias/<su-dominio>/`, sin tocar ESTADO, DECISIONES, código ni informes ajenos. Allí entrega informe y JSON con metadatos y citas propuestas. Los blobs se recuperan por `localPath` y hash. No publicar notas privadas ni archivos de contexto. Los editores aislados no modifican esos informes.

Un original HTML puede acreditar texto legal pero no constituye un facsímil PDF. No inventar páginas o coordenadas; obtener PDF oficial cuando esté disponible. Los documentos sin firma válida, sin CSV o sin validación registran esa limitación. No confundir hash con autenticación del emisor.

## Memoria

Serializar los trabajos de mayor consumo y comprobar memoria antes de ejecutarlos. No instalar dependencias en paralelo ni modificar un lockfile compartido desde entregas aisladas. Declarar las dependencias nuevas para su integración. Para PDF, extraer páginas concretas y evitar renderizar manuales enteros a alta resolución.
