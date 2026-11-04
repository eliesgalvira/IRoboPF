# Validación previa a la publicación

El candidato del 4 de noviembre de 2026 supera los 30 comandos de
`.github/workflows/checks.yml`, ejecutados en secuencia y sin heredar el PATH
del operador. Duración acumulada: 447,451 segundos. Pasan tipos, lint, inventario,
verificadores y pruebas: 1.522 ejecuciones Vitest por bloques, con casos compartidos,
y 234 métodos Python contabilizados, de los que se ejecutan 227 y se omiten
explícitamente siete que requieren originales privados. Lint conserva 18 avisos
anteriores y ningún error. El CAS privado completo no queda certificado por CI.

Se conservan [comandos y resultados](workflow-limpio-resultados.json),
[log completo](workflow-completo.log), [resumen](resumen.json),
[fuentes comprobadas](fuentes-antes.json) y el ejecutor usado como
`reproducir-workflow.py.txt`. El manifiesto fija sus bytes. La identidad del YAML
es `5cf83e13495e2040fb50002bf99389cb3fec3fba9d6fbb43d8de2d2e0312d91f`.

El ejecutor suministra Bun 1.3.13, Node 24.20.0 y Python 3.13.15 desde Nix;
los dos últimos pasos usan literalmente `nix develop path:tools/procedencia`
como el workflow. Antes de `setup-bun` comprueba que Bun no está en PATH. El
control de cachés examina una representación vacía de las rutas seguidas por
Jujutsu, con el script real del control. Los restantes pasos ejecutan el código
real. No se emulan Ubuntu ni las acciones de instalación; las dependencias y
sus cachés son compartidas. Se usa el workspace Jujutsu existente, por lo que
la inicialización condicional exclusiva de GitHub conserva su comprobación remota.

Las 510 fuentes, pruebas y scripts del snapshot permanecen idénticos. Incluyen
tres archivos C300 presentes en el trabajo concurrente: no participan en los
comandos de este workflow y quedan fuera de este commit. No se atribuye a este
verde la revisión de C300. Los informes y resultados antiguos conservados en
las recepciones describen sus propios candidatos, no el actual.

Dos intentos locales previos se detuvieron antes de publicar: el primero detectó
tipos insuficientemente acotados en el test histórico nuevo; el segundo, una
expectativa antigua de Madrid 2018. Se corrigieron y se repitió el workflow
completo. La expectativa monetaria se recalculó desde bruto y filas normativas,
con [oráculo decimal conservado](madrid-2018-alta-base-oraculo.json).
Ninguna referencia Open se modificó. Los logs de esos intentos permanecen en
la recepción privada `producto-integracion-correcciones-20261104`.

Los cambios de importes cuentan con revisiones independientes enlazadas en la
[integración A2025](../../datos-2012-2026/producto-escalas2025/INTEGRACION.md),
[integración histórica](../../datos-2012-2026/producto-series-historicas/INTEGRACION.md),
[fórmulas valencianas](../../deducciones-2025/revisiones/formulas-producto-20261104/CORRECCIONES.md)
y [composición valenciana](../../deducciones-2025/revisiones/composicion-producto-20261104/CORRECCIONES.md).
La conexión histórica tiene su [dictamen de API](../../simuladores/revision-historico-api/INTEGRACION.md).
El CI remoto del commit publicado se comprueba después del push.
