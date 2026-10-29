# Comandos y resultados

CWD: /home/elies/.t3/worktrees/IRoboPF/t3-b2fda12c

- `git rev-parse HEAD`: b6339967dec543d78cd69f7f56a04870c3ac9b07.
- Lecturas completas: BRIEF, AGENTS, CONTRATO-AUDITORIA, COORDINACION, ESTADO, DECISIONES e INFORME de integración ronda10. Una salida conjunta se truncó; se repitieron lecturas por archivo/tramos. Primera lectura encolada con flock, después lecturas pequeñas independientes.
- `/run/current-system/sw/bin/grok -p '…' --output-format plain`: cuatro ejecuciones, descubrimiento únicamente. Consultas reconstruibles y respuestas en grok-02/03/04.txt. Primera ejecución terminó intentando una descarga no autorizable en headless; no fue fuente.
- `nix shell nixpkgs#nushell -c nu /home/elies/Repos/Reactivity/scripts/fetch-x-posts.nu <urls>`: seis lotes raíz, ancestros, corrector, ramas, sexta y expansión; salidas en los JSON *-script.json. Expansión: 40 candidatos, exit0. Los otros lotes también terminaron exit0. Los padres/citas relacionados son retornados por el mismo script.
- Contraste adicional de embed mediante urllib de Python Nix, allowlist de campos antes de persistencia; `clasificacion-embed.json`: 60 posts, uno largo con solo prefijo (XMihura). Los siete del corrector relacionado son completos tras normalización del script.
- Descargas urllib acotadas a10MB, dos intentos, timeout30s, UA identificativo; originales name=orig y SHA-256 tras copia. Los scripts scratch adquirir.py/clasificar.py no son parte del motor.
- Primer intento curl canalizado a nu falló por entrada vacía (`pipeline_mismatch`), exit1; se repitió la adquisición raíz mediante urllib, correcta. No se utilizó esa salida vacía como verificación.

Validación ejecutada bajo lock compartido y un trabajador:

```sh
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs nixpkgs#python3 -c bash -c 'bun run test tests/correcciones-x-solidaridad.test.ts --maxWorkers=1; bun run lint; bun run typecheck'
```

Resultado: dos pruebas correctas, oxlint y ESLint sin diagnósticos, typecheck principal y vendor correctos. Exit0 de proceso. No Next build ni suites legacy completas. Node_modules enlazado para lectura a /home/elies/Repos/IRoboPF/node_modules; no cambios de package/lockfile/CI. No se escribió Effect: el test importa vitest y Decimal y llama API existente.

Evidencia original ejecutada:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh .cache/procedencia/correcciones-x-2051956145145712916/evidencia.py
```

Exit0. Script preservado y formateado como reproducir.py, para repetir desde raíz:

```sh
flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh docs/procedencia/auditorias/correcciones-x-2051956145145712916/reproducir.py
```

Dos originales oficiales cotejados por SHA-256 y registrados por SHA-512; seis páginas extraídas/renderizadas. Páginas16/17 de PJC/178/2025 inspeccionadas visualmente. Decimal independiente: reparto analítico673.422460/132.743720; hipótesis mensual673.44/132.84; cuota sobre exceso66548.01 produce47848.10, tanto agregada como por dos mitades con esta entrada exacta. No prueba qué decimal interno generó la captura histórica.

Ruff inicial encontró estilo del script scratch copiado; se formateó y sustituyó lambda asignada por def. `ruff-final.log` contiene pase correcto. No se relajaron reglas.

Búsqueda adicional web de fuentes de redondeo: `site.seg-social.es "redondeo" "cuotas" "céntimo"` y `site.agenciatributaria.gob.es "cuota íntegra" "dos decimales"`. No aportó regla TGSS precisa; resultados de impuestos especiales, normativa histórica ajena y reglas de tipo medio descartados como fundamento de cuotas IRPF2025. No se tomó un snippet como evidencia ni se descargaron como originales fiscales.

Reproducción final del script preservado: exit0, `reproduccion-final.log`. Además de los seis facsímiles y el reparto, verifica con Decimal los diez límites 43% y diferenciales de la tabla, y la aritmética visible de la comparación2025/2026; resultado en `aritmetica-tablas.json`. La igualdad aritmética no valida requisitos ni cuotas fiscales. Ruff final correcto después de esta ampliación.
