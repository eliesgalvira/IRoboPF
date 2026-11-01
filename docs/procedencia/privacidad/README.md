# Privacidad de la historia documental

La rama conserva los resultados de las auditorías y los originales oficiales. Se han sustituido datos identificativos del entorno de trabajo en archivos y transportes comprimidos. Los 214 mensajes se revisaron y no precisaron sustituciones; autoría y fechas también se conservan.

## Originales y copias anonimizadas

Los hashes históricos siguen identificando los bytes que se revisaron entonces. Una copia anonimizada tiene otro hash: [objetos.json](objetos.json) relaciona ambas identidades, sin publicar los valores retirados. El mapa incluye contenido descomprimido y anidado, además de los blobs Git.

Para comprobar una copia:

```sh
node scripts/procedencia/privacidad-verificar.mjs --original SHA256 --archivo RUTA
```

El resultado distingue `bytes-originales` de `copia-anonimizada`. Este comprobador no modifica los verificadores del almacén ni renueva decisiones o atestaciones. Los recibos antiguos conservan sus hashes originales: para reproducirlos exactamente se necesita el respaldo privado. El mapa permite comprobar sus copias públicas sin confundirlas con aquellos originales.

La copia íntegra anterior a la anonimización y la semilla documental se conservan fuera del repositorio. **Contienen material privado y requieren revisión antes de distribuirse desde un backend.** La ubicación local y las instrucciones de restauración se entregan al propietario fuera de Git.

## Referencias a commits

El [mapa acumulado](../almacen-externo/mapa-commits.tsv) permite resolver las referencias anteriores a ambas reescrituras:

```sh
node scripts/procedencia/commit-historico.mjs SHA_ANTERIOR
```

Los clones y worktrees basados en la historia anterior deben migrarse antes de volver a subir cambios. Reescribir una rama no elimina las copias existentes en otros equipos, forks o cachés del proveedor. [Límites de la eliminación en GitHub](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## Casos conservados

- El Excel de auditoría es una matriz generada por el código, con 1.290 combinaciones de ejercicio y salario. No se ha identificado como un registro de nóminas reales.
- Los PDF y sesiones de Renta WEB Open están documentados como simulaciones. Sus identificadores de prueba se conservan.
- Las atribuciones públicas de bibliotecas, sus correos de licencia y los ejemplos de pruebas se conservan.
- Un metadato de usuario en un PDF institucional tiene atribución indeterminada. Dos cachés MessagePack del entorno Python se identificaron y reconstruyeron sin pérdida estructural; una contenía rutas anonimizadas. El PDF conservado se enumera en [dudas.json](dudas.json), sin reproducir el dato encontrado.

El análisis combina patrones, Gitleaks, revisión de contenedores y extracción de documentos e imágenes. No acredita ausencia de información oculta mediante cifrado, esteganografía o formatos no reconocidos.
