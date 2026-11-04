# CI previo a publicar la cuota valenciana

Pasan los **30 comandos** de `.github/workflows/checks.yml`, extraídos del YAML
y ejecutados en orden, en 448,575 segundos. El SHA256 del workflow es
`998df3c7776f9c30c2f1061a5d648c0bfb06d3dad7c1b2b7323d2da386f5cdff`.
El cambio del workflow y del lanzador local añade la prueba permanente de cuota
valenciana al bloque correspondiente.

Resultado: 1.545 ejecuciones Vitest por bloques, con pruebas compartidas, y 234
métodos Python contabilizados: 227 ejecutados y siete omitidos explícitamente
por depender de originales privados. Pasan lint, tipos, `inventario:verificar`,
contratos, fixtures y generados. Se conservan los 18 avisos previos de lint.
Las 513 fuentes, pruebas y archivos de configuración fijados conservan sus bytes.

Se usa un entorno nuevo por trabajo, sin heredar PATH ni variables de desarrollo.
Bun no está disponible en el paso anterior a su instalación. Después se añaden
Node 24.20.0, Bun 1.3.13 y Python 3.13.15 desde Nix. Los comandos `nix develop`
son los mismos del YAML y usan el lock del proyecto. Las dependencias y la caché
de uv son compartidas y externas a la entrega.

La reproducción manual no emula Ubuntu ni las acciones de instalación de GitHub.
El guardia de rutas se ejecuta sobre un árbol de archivos vacíos con los nombres
seguidos por jj y su script real, para representar el checkout sin cachés locales.
El resto de pasos usa el repositorio real. El snapshot incluye tres archivos
C300 todavía no publicados que no forman parte de los comandos de este CI;
su presencia no acredita la campaña ni la corrección monetaria posterior.

La [reproducción](reproducir-workflow.py.txt), el [registro completo](workflow-completo.log),
los [resultados por comando](workflow-limpio-resultados.json) y el
[manifiesto](manifiesto.json) conservan la comprobación. El CI remoto de esta
publicación se comprobará inmediatamente después del push y se registrará en
el siguiente avance. No se presenta este resultado local como resultado remoto.
