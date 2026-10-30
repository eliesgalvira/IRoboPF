# Propuestas actuales para revisión independiente

Documento histórico: los resultados, referencias al motor y pendientes corresponden a la base examinada; no describen el estado vigente del proyecto.

Se conservan 264 candidatos nuevos: 78 estatales y 186 autonómicos. `preparar.py` reconstruye la correspondencia desde el inventario histórico fijado en eaed990c620b5fc4d3ff2e74dc68e0c8481c43db y el actual. Exige archivo, símbolo y ruta estructural exactos, igualdad literal de valor y unidad, hashes documentales, pertenencia al año y territorio técnico y bytes actuales del código. No une cifras por coincidencia numérica.

La ampliación del inventario declara territorio por una lista explícita de pares archivo/símbolo. No lo deduce de que el archivo contenga otras tablas estatales o autonómicas. Son dimensiones técnicas, no una decisión de vigencia. Madrid 2025 añade quince hojas y no forma parte de estos 264 candidatos.

Los payloads originales v2 quedan intactos. Cada propuesta tiene otro ID y autor, fija el inventario actual y conserva la referencia a la decisión histórica. **Esa decisión no acredita el helper canónico actual** y varias tienen un schema editorial distinto del operativo. No se renombran campos, no se amplía `engineLocations` y no se cambia el registro para conseguir un resultado positivo.

La siguiente revisión debe emitir decisiones propias con ámbito limitado, fuente exacta, vigencia anual, condiciones y localización canónica actuales. Solo después podrán prepararse enlaces operativos y revisarse los bytes exactos del payload. Una negativa o necesidad de evidencia se conserva individualmente. Murcia mantiene la desigualdad estricta superior a 60.000 euros; no se transforma en un umbral inclusivo.

Objeción experta: conservar un número no prueba que el código lo seleccione en los mismos supuestos ni que la norma siga vigente. Coste elegido: doble correspondencia técnica y revisión jurídica nueva, sin migración de aceptaciones anteriores. Integridad, autenticidad histórica, interpretación, coincidencia numérica y aceptación fiscal permanecen separadas. Aceptaciones nuevas: cero.

Reproducción: `nix shell nixpkgs#python3 -c python3 docs/procedencia/evidencias/propuestas-r12/preparar.py`. Resultado en `preparacion.log`; todas las identidades, valores y hashes en `correspondencias.json`. La reproducción requiere conservar la base Git indicada y el inventario actual exacto.
