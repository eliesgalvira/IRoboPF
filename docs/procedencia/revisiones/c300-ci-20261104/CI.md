# CI previo a publicar C300

Pasan los **30 comandos** de `.github/workflows/checks.yml`, extraídos del YAML
y ejecutados en orden, en 445.113 segundos. El SHA256 del workflow
es `998df3c7776f9c30c2f1061a5d648c0bfb06d3dad7c1b2b7323d2da386f5cdff`. El lanzador de simuladores incorpora las
regresiones C300 y Andalucía al bloque que ya ejecuta el workflow.

Resultado: 1573 ejecuciones Vitest por bloques, con
pruebas compartidas; 241 métodos Python
contabilizados, de los que 234 se ejecutan y
7 se omiten expresamente por depender
de originales privados. Pasan tipos, lint, `inventario:verificar`, contratos,
fixtures y generados. Las 516 fuentes fijadas conservan
sus bytes. Los registros completos conservan también las advertencias de lint.

La reproducción usa un entorno nuevo por trabajo, sin heredar PATH ni variables
de desarrollo. Comprueba que Bun no esté disponible antes de su instalación;
después aporta Node 24.20.0, Bun 1.3.13 y Python 3.13.15 desde Nix. Los comandos
`nix develop` son los del YAML y utilizan su lock. Dependencias y cachés son
compartidas y externas a la entrega.

No emula Ubuntu ni las acciones de instalación de GitHub. El guardia de cachés
se ejecuta con su script real sobre archivos vacíos que representan las rutas
seguidas por jj, sin copiar el repositorio ni las cachés locales. El resto usa
el repositorio real. El fallo inicial del sondeo portable por `pdftotext` sin
configurar y su repetición correcta se conservan separados de este CI limpio.

El primer recorrido del CI se interrumpió voluntariamente con salida 143 para
aplicar la observación textual de la revisión andaluza antes de fijar las fuentes
finales. Se conserva su [registro parcial](ci-interrumpido-pre-rastro.log) y la
[razón de la interrupción](interrupcion-pre-rastro.json). El recorrido completo
que aquí se cuenta comenzó después de ese cambio y de repetir los 300 cotejos.

[Comandos y resultados](workflow-limpio-resultados.json),
[registro completo](workflow-completo.log), [fuentes fijadas](fuentes-antes.json),
[reproducción](reproducir-workflow.py.txt) y [manifiesto](manifiesto.json).
El resultado remoto de esta publicación se comprobará tras el push; este
documento acredita la reproducción local previa, no una ejecución remota.
