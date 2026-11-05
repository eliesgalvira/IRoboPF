# CI del productor inmobiliario de 2025

Pasan los 31 comandos de `.github/workflows/checks.yml` con PATH limpio y las versiones fijadas: Node 24.20.0, Bun 1.3.13 y Python 3.13.15, incluidos los comandos Nix del trabajo de corpus. Se comprueba la secuencia de disponibilidad de Bun y se ejecutan los mismos comandos; no se emula Ubuntu ni las acciones de instalación de GitHub. El inventario se regenera y verifica antes de publicar.

Los intentos locales previos detectaron errores de tipos y un bloqueo del extractor R52; ambos están corregidos y conservados en los logs antes de repetir el workflow. La validación ampliada ajena al workflow conserva incidencias detalladas en [VALIDACION-INTEGRACION.md](VALIDACION-INTEGRACION.md); el verde de estos 31 comandos no afirma que todos los extractores históricos pasen.

Los primeros 29 comandos terminaron en el intento 4. La guardia de 6 GiB interrumpió el comando 30; después de liberar caché de archivos del grupo, se repitieron 30 y 31 con las 39 fuentes y el YAML idénticos. El informe conserva el origen del prefijo y el corte por memoria, sin contarlo como ejecución correcta.

El paso territorial incluye las pruebas P4a del autor, las correcciones y el traslado tipado de los 50 adversos independientes. Tipos estrictos/Effect, ambos linters, canarios, motor y corpus pasan. Los dos casos de maternidad apartados anteriormente siguen omitidos y no cuentan como verdes. Los recuentos de suites solapadas no se suman como casos únicos. Las advertencias previas de ESLint se conservan en el log.

[CI.json](CI.json) fija comandos, duraciones, hashes y mediciones de memoria. Una suite a la vez, dos CPU y guardias de 3 GiB por árbol y 6 GiB por grupo, con límites internos de tiempo. La revisión monetaria y el contraste grave recibidos acreditan sólo el perfil declarado. El CI remoto se comprueba después sobre el commit publicado.
