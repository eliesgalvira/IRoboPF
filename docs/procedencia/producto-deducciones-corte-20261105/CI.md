# CI del corte de deducciones de 2025

Pasan los 31 comandos exactos de `.github/workflows/checks.yml`, con PATH limpio y Node24.20.0, Bun1.3.13 y Python3.13.15. Incluye tipos estrictos/Effect, linters, pruebas de dominio, verificación del inventario regenerado y los comandos Nix de corpus y simuladores. Se reproducen comandos y versiones; no se emulan Ubuntu ni las acciones de instalación de GitHub.

El corte conecta primer alquiler de Canarias/Baleares, ayudas ELA de Galicia/Extremadura, DA58 con movilidad de Castilla y León y la inversión estatal68.1 de Aragón. Corrige la dependencia del Decimal global en preparación monetaria y el rechazo de certificados68.1 emitidos después del ejercicio acreditado. Cada cambio monetario tiene primera revisión; el defecto grave del certificado tiene contraste favorable. Las pruebas nuevas y las independientes están incluidas en el workflow.

Antes del CI, una generación del inventario se interrumpió por la guardia de6GiB de grupo con caché de archivos acumulada. La siguiente detectó que faltaba Python en el PATH de aquel comando de preparación. Se conserva cada intento. La generación final correcta incorpora los tres runtimes. Durante el workflow se reclama caché de archivo entre órdenes cuando supera el umbral documentado, sin cambiar límites ni fuentes.

La primera ejecución completa se detuvo en el paso13: dos fixtures D51 conservaban el contrato ELA antiguo. Se migraron a ingresoId y diagnóstico, conservando el rechazo cuando falta el libro interno; una prueba adicional rechaza los importes concedida/cobrada externos. No cambió ninguna fórmula ni expectativa monetaria. La segunda ejecución detectó en el paso30 un esperado IPC/SS calculado con Decimal global20: se conservó la fracción normativa y se sustituyó su evaluación por BigInt y representación HALF_UP80, probando tres configuraciones globales distintas. No cambió la producción ni las cuotas. La tercera ejecución completa es la que acredita estos31 pasos.

Una suite a la vez, CPU0,1, timeout por orden e hijos, guardias3GiB por árbol y6GiB por grupo. Los resultados previos con errores de colección en suites históricas r43/r45 no se convierten en aprobaciones; los31 pasos del workflow son la validación conjunta de este corte.

Los datos declarados, autenticidad de documentos, permanencias futuras y las ramas expresamente rechazadas siguen condicionados. Las deducciones de2025 permanecen abiertas y no se añade cobertura Open por ejecutar pruebas sintéticas. La recomparación histórica de2018 conserva su informe separado.

[CI.json](CI.json) fija comandos, duraciones, hashes y memoria. La comprobación remota corresponde al commit publicado después de este informe.
