# Contrato candidato de admisión anual

Se integra como candidato la continuación de admisión R36. El contraste de integración comprueba su entrega, lee las seis familias de obligaciones, contratos de frontera, consumidor y verificador, y reproduce sus controles en el repositorio actual. No se acepta todavía la suficiencia de admisión ni su composición: requiere una revisión independiente nueva de estos bytes.

## Alcance y contraste

Las seis familias describen derechos, Option/catálogo de deducciones, selectores territoriales, adaptador y servicios, fronteras financieras y propagación final. El candidato contiene 470 definiciones, 75 archivos fuente, 27 contratos financieros/de servicio y 48 instancias. Estos recuentos describen el artefacto; no acreditan su suficiencia.

El consumidor devuelve success, reject, defect o pending, y solo extrae los sitios del resultado final exitoso. Los callbacks financieros requieren resultados ligados a argumentos y nodo; un recibo no autentica al emisor ni valida la fórmula. La revisión deberá contrastar identidad por instancia, dominios y salidas, y distinguir el proveedor default de servicios sustituidos. Los valores sintéticos de propagación no son expectativas de cuota.

La composición y la admisión son contratos separados cuya conexión necesita contraste expreso de interfaces. Los diecisiete cierres del candidato, wiring y aceptación completa permanecen false; no se extrapolan a los 65 sitios por coincidencia de nombres.

## Verificación de integración

Pasan las 236 pruebas recibidas en la integración actual, con un trabajador, cargador Vitest nativo y caché absoluta propia. Se conserva la adaptación de rutas/configuración en scratch, sin tocar los originales. El productor reconstruye un JSON idéntico al fragmento entregado y pasa su verificador. El ensayo autónomo bloquea imports del motor, TypeScript y productores anteriores; conserva un selector correcto y un rechazo de deducción con motivo exacto. Pasan tipos principal/vendor, Oxlint y ESLint globales; las 16 reglas anti-slop siguen a error. Los cuerpos MJS mantienen checkJs=false y no se presenta el typecheck como tipado estático completo de esos cuerpos.

Los cinco rojos históricos y los fallos de desarrollo permanecen en la entrega. No se repiten ni se anuncian verdes las suites históricas que terminan en 1. Los 236 pases de integración repiten cobertura del autor; no se suman como nuevos controles independientes. No se ejecutan build de Next ni matrices Excel masivas.

## Decisión

Objeción experta: separar valores financieros de admisión puede dejar una dependencia circular o aceptar un resultado sintético sin procedencia. Respuesta: mantener contratos explícitos por propiedad e instancia, exigir evidencia en la composición y revisar de forma independiente que pending no se confunda con rechazo o éxito del motor. El verificador de receta y los hashes son controles de integridad, no sustituyen el contraste semántico. Coste: consumidor y contratos finitos adicionales, revisión nueva y composición posterior; no habilitar interfaces públicas antes de completar esas obligaciones.
