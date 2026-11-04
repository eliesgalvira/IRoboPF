# Revisión independiente de composición valenciana 2025

Dictamen: **condicionado por un P2 monetario reproducido; no integrar importes todavía**. Cero P1 identificados. No se implementaron arreglos. Esta conclusión se limita al candidato recibido y a la composición individual ordinaria del 31/12/2025; no supone aceptación fiscal universal.

## P2 · C01: aportación DANA de 2024 incorporada como generación de 2025

Ruta candidata: `lib/dominio/irpf/deducciones/valenciana-2025/composicion.ts:205–223`, especialmente evaluación en 209 y suma en 218. La composición hereda la excepción de fecha de `index.ts` para DANA aportaciones y convierte su resultado en total de generación corriente sin separar el ejercicio de origen. La ventana 13/11/2024–31/12/2025 no autoriza regenerar en 2025 una deducción de 2024.

Repro mínimo completo: `repro-minimo.json`. Contribuyente A, individual 2025, liquidable e imponible general 2.000 €, ahorro cero; aportación DANA única de 300 €, fecha **01/12/2024**, entidad nueva del ámbito fiscal declarado; libro coherente y **sin cuota ni arrastres**. Sólo una solicitud aplicada; no existe conflicto ni hecho alternativo que elegir.

Esperado: rechazar la solicitud de generación corriente o marcarla excluida y no emitir `totalParcialAntesCuota`. La aportación pertenece al ejercicio 2024; únicamente un saldo histórico identificado puede entrar en la vía separada de arrastres, sin ser generación nueva. No se pide devolver cero ni deducir automáticamente un saldo histórico.

Actual (`repro-actual.json`): `estado: calculo_parcial`, fila con `importe: 135`, `incidencias: []`, **`totalParcialAntesCuota: 135`**. Cálculo reproducido: 45 % × mínimo(300, 30 % × 2.000). Usa así la renta de 2025 para generar otra vez un derecho de 2024. El aviso de aceptación pendiente no evita el importe incorrecto.

Oráculo primario: [DL17/2024, disposición final primera, nueva redacción del art.5.3 DL12/2024, página 9](https://www.boe.es/ccaa/dogv/2024/10011/r00001-00009.pdf). Establece el ejercicio de la aportación y permite trasladar exclusivamente el importe no deducido por insuficiencia de cuota durante tres ejercicios. El art.5.2 establece su propio techo del 30 %. [AEAT Renta 2025, aportaciones DANA](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunitat-valenciana/dirigidas-personas-afectadas-dana/aportaciones-fondos-propios-entidades-que-economicas.html) corrobora la separación temporal.

Es un defecto de interacción entre la excepción histórica del evaluador y el nuevo total; no se reabren H1/H2/H3/O1 ni se exige autenticidad externa. Prueba roja preservada: último grupo de `adversos.casos.ts`, portable a Vitest mediante `adversos.test.ts`. No se inicia un segundo contraste sin decisión del padre.

## Resultado del resto de la revisión

Los 20 grupos del autor pasan en Bun. Los 15 grupos independientes terminan con **14 correctos y C01 rojo**; incluyen 121 asignaciones con oráculo racional de techos y tramos dentro de un único grupo. `adversos.log` conserva el fallo real. Hubo una ejecución previa con un fallo del constructor de mi prueba de JS nulo; se corrigió exclusivamente el constructor y se repitió, dejando C01 como único fallo. No se alteró ninguna expectativa monetaria.

Se comprobó: orden que cambia asignaciones e importe (137,50 frente a 125 €); consumo conjunto sin una segunda reducción efectiva al 30 %; céntimos y comodato fraccionario sin redondeo previo; tramo de 250 € y régimen estatal de s; rechazo con base asignada cero; conservación del motivo del censo; omitidas sin suma; excluida sin cero sustitutorio; dos magnitudes primarias rechazadas; salud sin repetición de categoría; alquiler consolidado con reparto único (200 €); colisión de consignación con omitida; entrada congelada sin mutación; cuota devuelta como copia sin consumo; fronteras históricas de tres/cuatro años; JS null, arrays y campos internos malformados recuperables, seguidos de una llamada válida.

La inspección de las reglas y los casos del autor respalda i frente a e/f/h aun con sujetos distintos, k/l por cantidades comunes, m sólo sobre otras porciones, aa por descendiente del incremento, z/DANA por entidad, y rechazo de otras cantidades comunes como límite de representación. No se ha encontrado otro importe incorrecto reproducible en ese ámbito.

Contraste jurídico: [Ley13/1997, art.4, redacción 29/12/2025](https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202&p=20251229&tn=1). Uno.i establece incompatibilidad personal con e/f/h; k y l son compatibles y m excluye las mismas cantidades; aa limita el conflicto al incremento por ese descendiente. Dos comprende q2/q3/r/s; no incorpora DANA. El art.5.4 DL12/2024 regula separadamente la incompatibilidad con z por entidad. q/r y s conservan sus regímenes porcentuales y las reservas de acreditación. No se sustituye la normativa aplicable a 2025 por el texto material de una reforma posterior.

Leídos los informes conservados de `correcciones/g-inversion-dana`, `revisiones/g-vivienda-inversion`, `correcciones/g-cultura-lengua` y `revisiones/g-cultura-lengua`, además de `VALENCIANA-EVALUADORES.md`. Se conservan en el candidato las reservas de territorio/subámbito, ambos domicilios, ERTE, EECV diferenciada de ENISA y censo. C01 contradice precisamente la separación de ejercicio y arrastre, sin refutar esas rectificaciones. No se presenta una nueva auditoría exhaustiva de sus originales ni de todas las fórmulas congeladas.

## Exposición, contratos y límites

El parche de exposición sólo añade export de función y tipos. La raíz coincide con la preimagen; la postimagen reconstruida coincide con el hash declarado. No añade llamadas ni conecta el total a anual, cuota o agregado fiscal. La búsqueda en `lib` no encuentra usos de esta función o de su total en la raíz congelada. No se ejecutó el barrel parcheado: su ciclo con el evaluador se inspeccionó estáticamente; el sondeo privado redirige el import al barrel de raíz, como el del autor.

Una solicitud/unidad por código y el rechazo de varias unidades no sanitarias son restricciones declaradas, aunque limiten expedientes legítimos. Tampoco se convierte el rechazo genérico de una acumulación legítima en prohibición jurídica ni en fallo monetario. Los IDs son correspondencias declaradas: el libro comprueba unicidad y sumas, pero no detecta que el aportante haya renombrado un pago real o una entidad. No se exige esa autenticidad externa. Los escalares son los contratos de los evaluadores: se comprobó la exclusión de dos magnitudes primarias; no se atribuye a la API una validación semántica exhaustiva de toda clave escalar sobrante. No se amplía a F.

No ejecutados: Vitest, tipos, lint, suites globales ni CI; LIGERO1, un proceso de sondeo por vez y timeout de 25 s con kill de 30 s. No VCS mutante, instalaciones ni subdelegación. La publicación sigue correspondiendo al padre tras la orden del usuario y CI autorizado.

## Reproducción e integridad

Desde cualquier directorio, ejecutar cada bloque dentro de su timeout:

```sh
timeout -k 30s 25s bash <<'SH'
source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh
/home/elies/.cache/irobopf-corpus/.venv/bin/python /home/elies/Backups/IRoboPF/producto-valenciana-revision-composicion-20261104/preparar.py
bun /home/elies/Backups/IRoboPF/producto-valenciana-revision-composicion-20261104/sondeo.ts
SH
timeout -k 30s 25s bash <<'SH'
source /home/elies/Backups/IRoboPF/limpieza-recursos-20261103/env-pruebas.sh
bun /home/elies/Backups/IRoboPF/producto-valenciana-revision-composicion-20261104/runner-adversos.ts
SH
```

El segundo comando debe salir con código 1 mientras persista C01. `repro-minimo.ts` imprime únicamente el resultado del caso mínimo. Las pruebas portables y este informe se entregan en `revision.patch`, sin arreglo de implementación. Los hashes de recepción y fuentes están en `hashes-antes.json`/`hashes-despues.json`, con comparación en `integridad.json`; `recepcion.json` valida todos los hashes declarados del manifiesto del autor y la preimagen. El original CAS primario del autor fue verificado contra su SHA256 f6fb99a07ec59a18cf0c8a543f2e80b07c3d6e09505831b8fb392aad7228bcc5; su extracción se identifica separadamente en `primarios-antes.json`/`primarios-despues.json`.
