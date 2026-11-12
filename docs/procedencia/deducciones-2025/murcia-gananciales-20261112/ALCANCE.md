# B09 — Guardería Murcia 2025 en gananciales

La preparación inicial del 12 de noviembre se recibió sin ejecución. La integración
posterior pasa 95 pruebas del autor y 228 independientes, incluidas en las
1.465 pruebas conjuntas de 26 archivos. Tipos strict+Effect y lint pasan, con
27 avisos ESLint anteriores. Los 18 oráculos Fraction del autor y los 36 de la
revisión coinciden con sus fixtures. El código fiscal y los esperados permanecen
intactos; los ajustes de pruebas y sus rojos están preservados en la entrega.
El CI completo y la publicación se registran por separado.

## Alcance

Dos progenitores casados, sin separación legal ni cambios civiles en2025, régimen ganancial vigente todo el ejercicio y convivencia estable acreditada por el censo nominal y grafo anual. Ambos residen en Murcia, tributan individualmente y tienen derecho regional producido para los mismos hijos. Gananciales y matrimonio se aportan como hechos nominales documentados; no como booleanos de elegibilidad ni bases fiscales. Los períodos, identidades y soportes se contrastan con auxiliares, PagadoresMurcia2025 y grafo; si existe libro civil anual también se concilia. No se abre el productor de bases familiares a Murcia ni se infiere art82 de miembrosUnidad.

Se añaden hechos `auxiliares.ganancialesMurcia`: dos cónyuges, fecha/soporte de matrimonio, estado casado no separado, censo civil sin cambios, período/soporte de régimen y censo de movimientos del fondo común. Se mantiene cada pago íntegro una sola vez, con su ordenante real y soporte; movimientoId único y cobertura exacta de pagos. `atribucion=“comun_ganancial”` no es otro pago. Se atribuye internamente la mitad racional a cada cónyuge y se utiliza el productor nominal existente y la función exacta20%/tope. El libro común conserva un generado, un aplicado y un pendiente propios; nunca calcula cuota del otro.

Para gasto común G y un hijo: derecho individual=min(G/10,500), sin ayudas.100.01 genera10.001 por persona;0.01 genera1/1000;5000 genera500. Los medios céntimos de atribución permanecen racionales hasta el libro monetario único. No hay redondeo del50% a céntimos ni dos pagos ficticios.

## Fuentes y límites

AEAT IRPF2025 y ATRM Renta2025 confirman la presunción de gasto de ambos en gananciales aunque ordene uno y el reparto individual con máximo500. Originales HTTP íntegros, headers, UTC y SHA se conservan sólo en evidencia externa; el parche lleva enlaces y alcance, no copias completas del portal.

AEAT: https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-region-murcia/gastos-guarderia.html

ATRM: https://agenciatributaria.carm.es/renta

Se preservan reservas para única persona elegible, ayudas de cualquier importe (primera rama sin ayudas), art81 concurrente, conjunta, fallecimientos, cambios de régimen o separación, custodia especial, filiación distinta de ambos progenitores y cambios de convivencia. El soporte documental es hecho declarado, no certificación de autenticidad. No se afirma cierre universal de B09 ni aceptación fiscal. El resto de perfiles conserva las causas anteriores, incluido gananciales sin nuevo contrato.

## Validación y límites de la entrega

- Modificaciones: auxiliares-esquemas.ts y auxiliares-anual.ts; nuevo conciliador civil murcia-gananciales.ts, sin segundo productor económico.
- Pruebas ejecutadas: ambas API, ambos ordenantes y contribuyente alternativo, orden nominal y de movimientos, misma factura con dos movimientos genuinos,0/0.01/0.03/100.01/1000/4999.99/5000/5000.01/10000.01, cuota pública0 y libro interno17.03, no_derecho/no_separados, ayudas/cambios civiles/exceso fiscal/duplicados/centro/concepto/mínimo, control separado y rechazo art81.
-18 oráculos JSON obtenidos sólo con Fraction; script independiente preparado en tests/oraculos. Los scripts Fraction y las pruebas TS se ejecutaron. Ambos derechos se producen nominalmente; la revisión añade cuota pública escasa y cero por ambas API, delta final de 500 EUR y conservación entre generado, aplicado y pendiente.
- Consulta Effect: fuentes v4 locales (Schema.Struct/optionalKey y esquemas vigentes); effect-solutions list/show consultados por el integrador. Sin nuevas APIs Effect.
- Antes de publicación se completan los pasos/versiones/Nix de .github/workflows (incluido inventario:verificar y generados), sobre la imagen con las revisiones conciliadas. Antes de cualquier push, reproducir CI local completo; si cambian scripts/workflow, act o entorno limpio sin PATH heredado, conservar reproducción y verificar CI remoto. Esta entrega no cambia scripts/workflow.

## Recepción reproducible

`candidato.patch` contiene pre/post de dos archivos y altas nuevas. MANIFEST-PRE.json conserva hashes selectivos vigentes y compara con PRE-CI del padre sin resellarlo; preimagen conserva sólo los dos archivos a modificar. MANIFEST-POST.json enumera cada artefacto candidato y la ausencia/presencia esperada en raíz. Aplicar exclusivamente sobre prehash coincidente; si hay deriva, reconciliar y mantener ambos manifiestos. No aplicar durante CI activo. No borrar ni sustituir entregas previas.

Reglas de operación: JJ único y bookmark procedencia-documental; cada script/test con timeout que cubra hijos; máximo5subagentes/2pesados+3ligeros y una suite por agente (aquí ligero sin suites), padre exclusivo pesado; UV_CACHE_DIR=/home/elies/.cache/uv, caché bun default, dependencias fuera de entregas; copias/worktrees<150GB; ninguna copia completa/env/node_modules/caché, ningún worktree ni limpieza en esta entrega. No se ha utilizado Git mutante ni jj git init.
