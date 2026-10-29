# Coordinación de la primera ronda

Anti-slop está activo. Los auditores documentales leen el motor sin modificarlo; los editores de código trabajan en checkouts aislados preparados por T3. Solo el orquestador integra, mueve `procedencia-documental` y respalda en origin.

## Reparto

- Inventario: extracción reproducible de parámetros, literales, pasos y derivaciones, con cobertura anual y territorial.
- Lint: las 96 infracciones actuales, preservando comportamiento y sin rediseño.
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

La contrarrevisión será otra delegación por cada lote, a cargo de agentes nuevos. El inventario y los informes de primera ronda no constituyen aceptación.

## Descargas y archivos

Se puede usar `tools/procedencia/descargar.py URL` con Python estándar. Conserva original por hash, metadatos HTTP y un índice por URL en `.cache/procedencia/`, fuera de Git. Serializa descargas con un lock de máquina y dos segundos entre peticiones. Identifica el proyecto mediante User-Agent. La caché no acredita autenticidad ni interpretación legal y es una base transitoria para la canalización del corpus.

Cada auditor escribe solamente `docs/procedencia/auditorias/<su-dominio>/`, sin tocar ESTADO, DECISIONES, código ni informes ajenos. Allí entrega informe y JSON con metadatos y citas propuestas. Los blobs se recuperan por `localPath` y hash. No publicar notas privadas ni archivos de contexto. Los editores aislados no modifican esos informes.

Un original HTML puede acreditar texto legal pero no constituye un facsímil PDF. No inventar páginas o coordenadas; obtener PDF oficial cuando esté disponible. Los documentos sin firma válida, sin CSV o sin validación registran esa limitación. No confundir hash con autenticación del emisor.

## Memoria

Máximo tres tareas de código con pruebas pequeñas simultáneas. Ningún hijo ejecuta Next build ni prueba legacy exhaustiva en esta ronda. No instalar dependencias en paralelo: los checkouts pueden usar un enlace a node_modules de la raíz solo para lectura y sin cambiar lockfile. Si necesitan dependencias nuevas, declararlas en su informe para instalación por el orquestador. PDF: extraer páginas concretas, sin renderizar manuales enteros a alta resolución.
