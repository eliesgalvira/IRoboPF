# Corrección del contrato documental

CP19-01/02/03 reproducidos antes del cambio: dos fallos Node y un fallo del contraste de software. Los logs rojos permanecen íntegros. La corrección resuelve los tres puntos; una revisión independiente nueva debe confirmar el resultado antes de promover bindings.

- El informe de una atestación debe contener texto distinto de espacios.
- La decisión jurídica admite exactamente uno de `status` o `decision`, con valor `accepted`; se rechazan ambos aunque coincidan. Es la alternativa exclusiva del contrato Python.
- Cada recibo se coteja con la versión de explicación del snapshot: generador, lista ordenada de fuentes y bytes conservados. La lista procede del helper histórico, analizado con el AST de TypeScript sin ejecutar ese código. Solo se admite una declaración exportada y un array literal de rutas distintas, incluida la del propio helper. Una fuente sustituida por otro objeto íntegro del CAS cambia la explicación y se rechaza.

Objeción experta: comparar contra el checkout actual invalidaría historia correcta; aceptar cualquier hash existente permitiría cambiar su significado. Respuesta: cotejo con los bytes y el orden de cada versión conservada. Coste: el formato del array histórico es un contrato; una futura generación dinámica necesita migración explícita. TypeScript es una dependencia de herramientas ya instalada, no una nueva API del motor.

Pasaron los 32 snapshots anteriores, siete pruebas Node (incluidas las dos del revisor), cuatro pruebas del recibo histórico, la contraprueba de sustitución, 28 regresiones de integración/rastro/publicación y 20 de contenido. Tipos principal/vendor y lint global correctos. Los recuentos no son reglas fiscales. Node sin resolución TypeScript y `bun` fuera del runner no sirven para la prueba nueva: se usa `bun test tests/software-recibo.test.mjs`. El primer intento del publicador carecía de `python3` en el shell Nix; se conserva el error y se repite con la herramienta disponible, sin alterar resultados esperados.

La regeneración conserva los snapshots históricos y produce versiones con el contrato documental corregido. No concede aceptación fiscal adicional.

Las 78 atestaciones estatales usan el ID canónico de T3. Las 186 autonómicas usan su clave de comando decodificada. `identidades-candidatas.json` documenta la correspondencia exacta con el resultado real del lanzador; no altera atestaciones ni registros y no introduce búsqueda por alias. El siguiente revisor debe juzgar esa identidad antes de registrar cualquier aprobación. Los 264 payloads permanecen pendientes.

Los scripts `historicos.mjs` y `publicar.mjs` adaptan las recetas anteriores con salidas propias. Ejecutar con `flock /tmp/irobopf-validacion-pesada.lock`, Nix Bun/Node/Python y `UV_PROJECT_ENVIRONMENT` absoluto. No ejecutar estas recetas para sobrescribir recibos históricos. La copia de reproducción bajo `.cache/contratos-publicacion-r19-sol` se excluye de Git, conservando sus bytes.
