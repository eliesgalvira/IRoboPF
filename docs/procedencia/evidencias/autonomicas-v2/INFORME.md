# Evidencias autonómicas v2

Trabajo personal sobre eaed990c620b5fc4d3ff2e74dc68e0c8481c43db, comprobado mediante lectura Git. Sin subdelegación, mutaciones VCS, cambios del motor, extractor, registros, fixtures compartidos ni atestaciones. Solo se entrega esta carpeta; scratch y entornos auxiliares no se integran.

## Separación histórica y canónica

EAV1-01: `localizadores-estructurales.json` resuelve las 186 identidades sintácticas históricas por árbol de fila y campo. En particular separa los 28 ceros ambiguos. Se contrasta personalmente contra las posiciones UTF-16 del original histórico y contra los localizadores refinados del revisor. No selecciona por igualdad numérica: verifica el valor después de identificar la estructura. Objeción experta: escoger el primer cero igual confunde cuota y base. Coste: mantener la identidad histórica además de los nuevos IDs efectivos.

EAV1-02: los scripts leen manifiesto y gzip mediante `git show` de revisiones completas expresas, verifican hashes fijos y cada fuente de generación de esa misma revisión. La receta no lee el inventario presente por defecto. El histórico usa ed6a43fd750de05609abc3710dabdc2f8261020c; el lote canónico usa eaed990c620b5fc4d3ff2e74dc68e0c8481c43db. `receta.json` enumera fuentes exactas. Objeción experta: cambiar al inventario actual porque contiene la misma cifra destruye identidad. Coste: conservar objetos Git históricos o sus bytes exactos; no se promete regenerar todo el extractor con esta receta de evidencia.

`reproducir_historico.py` adapta el instrumento del revisor, cuya lectura y autoría quedan preservadas. Esta repetición no constituye una segunda revisión independiente del trabajo propio. `preparar.py` añade selección por estructura del árbol, nuevos bindings efectivos, spans geométricos y análisis del contrato vigente. Los resultados históricos mantienen 186 celdas, 94 selecciones, 93 citas, 136 payloads y 317 decisiones. Los 136 payloads antiguos no se migran ni sustituyen.

## Propuestas nuevas y bloqueos

Se identifican las hojas efectivas por archivo, hash, símbolo, fila y campo de los seis helpers exportados, dentro de las 228 hojas de 15 tablas. Se proponen 186 payloads anuales cuota/base. No se usa una tabla legacy como sustituto canónico. Se entregan 94 citas nuevas: las dos selecciones de la cláusula murciana necesitan distintos spans numéricos aunque compartan cita histórica y recorte. `candidatos.json` contiene decisión, objeción, coste, dimensiones actuales y propuestas, revisión original y bloqueos de cada candidato.

Las dimensiones propuestas derivan de las ramas expresas de `obtenerEscalaAutonomicaPublicada`, fijadas por fuente y hash, y requieren revisión. No se aplican al inventario ni se amplía el gate. La selección técnica del motor no prueba vigencia jurídica. Objeción experta: inferir territorio o continuidad normativa solo del nombre de una tabla sería insuficiente. Coste: los candidatos permanecen bloqueados aunque coincida el número.

Se valida la proyección `legal-decision-scope` sin cambiar `status`, `decision` ni `engineLocations`. La aceptación antigua de una discrepancia de cuota no cubre automáticamente una ocurrencia canónica recién exportada. Se conserva el texto y estado original; las decisiones `needs-evidence` no pasan a `accepted`. `propuesta-registro.json` es una propuesta separada, con atestaciones null; no debe copiarse automáticamente al registro operativo. Objeción experta: fabricar alcance para obtener verde encubriría una falta de revisión. Coste: revisión editorial del enlace exacto y sus dimensiones antes de cualquier integración habilitada.

## Originales, unidad y Murcia

Se comprueban los siete originales por SHA-256, SHA-512 y tamaño. Se reextraen celdas y su propia cabecera, texto de cita, geometría y selectores. Los recortes se reproducen a 144 DPI con la receta fijada. Los spans numéricos nuevos se localizan por coordenadas de su celda, con control de unicidad y orden de palabras; nunca por primer valor igual. La unidad procede de la cabecera de esa columna. Se mantiene `Euros` con su capitalización literal, admitida por el lexer integrado. La cláusula murciana carece de cabecera tabular: se usa la unidad adyacente a cada importe en el propio párrafo.

CAS de PNG separado en `cas/sha256/`; originales conservados en sus rutas de corpus, verificadas en `historico/originales.json`. No se copian originales ni se escriben fixtures root. Objeción archivística: CAS local y hash no prueban autenticidad ni preservación externa. Coste: el padre debe suministrar explícitamente raíces que contengan `sha256` y conservar los originales; la entrega no es autónoma sin ese corpus.

Murcia 2022 conserva la cláusula y contexto completos. El último tramo aplica estrictamente a bases superiores a 60.000; en 60.000 la cuarta fila produce 8.625,8332 antes de redondear, no 8.716,67. `historico/murcia-frontera.json` conserva 59.999,99; 60.000; 60.000,01 y 100.000, con mutante inclusivo que discrimina el borde. No se ajustan las cuotas publicadas para hacerlas integrales continuas. No se certifica el supuesto de fallecimiento. No hay fix numérico ni rojo de motor nuevo: se reproduce el contraejemplo aritmético y se conservan los oracles.

## Límites

Integridad: hashes, reextracción y recortes comprobados. Autenticidad: no se revalidan firma histórica, revocación, CSV ni emisor. Interpretación: cadena y alcance individual pendientes de revisión; no se ha realizado búsqueda exhaustiva nueva de reformas. Exactitud: igualdad Decimal con la ocurrencia canónica fijada, sin certificar una liquidación completa. Aceptación: cero nuevas aceptaciones fiscales y cero atestaciones.

No se cierran jurídicamente pendientes individuales por reutilizar una aceptación anterior. Los nuevos candidatos aportan identidad y extracción que faltaban; los bloqueos editoriales se declaran individualmente. No se descargaron documentos ni se transfirieron objetos. Crossa es la copia v1 histórica comunicada por el coordinador, misma casa y propietario; no una verificación nueva propia ni custodia independiente. v1 preservado y paquete v2 quedan intactos.

## Reproducción

Desde la raíz del checkout, con Nix/uv fijados por `tools/procedencia/run.sh`, un trabajador y lock compartido:

```sh
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/docs/procedencia/evidencias/autonomicas-v2/scratch/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$PWD/docs/procedencia/evidencias/autonomicas-v2/reproducir_historico.py"
PYTHONDONTWRITEBYTECODE=1 UV_PROJECT_ENVIRONMENT="$PWD/docs/procedencia/evidencias/autonomicas-v2/scratch/venv" flock /tmp/irobopf-validacion-pesada.lock bash tools/procedencia/run.sh "$PWD/docs/procedencia/evidencias/autonomicas-v2/preparar.py"
```

Se conservan logs reales. No se ejecuta Next build ni suites legacy completas. No se escribió Effect ni TypeScript; Ruff y mypy comprueban los instrumentos Python, sin atribuirles cobertura de tipos del motor. Las primeras lecturas agrupadas se truncaron y se repitieron por secciones; rg no estaba en PATH y se usaron herramientas disponibles. El entorno uv se creó en scratch propio mediante UV_PROJECT_ENVIRONMENT, sin instalaciones globales ni cambios de lockfiles.

Inspección visual propia de los nueve PNG históricos: cabeceras, cifras y bordes legibles; Catalunya 2022 continúa entre páginas 46 y 47. Murcia incluye tabla y párrafo en el recorte amplio, además de su cláusula separada. En las cabeceras catalanas la unidad aparece entre paréntesis: el span selecciona literalmente `euros` dentro del token `(euros)`, manteniendo intacta la cita y la geometría de la columna.

Incidencias del instrumento: `preparar-inicial.log` conserva el rechazo de dos nodos estructurales murcianos (expresión y literal); se restringió la selección al nodo literal dentro de la propiedad. No se alteró una cifra ni una expectativa fiscal. `ruff.log` conserva una primera importación de tipos no utilizada; la comprobación final corresponde a los archivos finales. Las primeras importaciones Python no deshabilitaban bytecode; pudieron crear caché auxiliar `tools/procedencia/__pycache__`. No se borró para ocultarlo; las repeticiones usan PYTHONDONTWRITEBYTECODE=1 y no se integra esa caché.

## Resultado medido y entrega

`preparar.log` termina con 186 payloads nuevos, 94 citas nuevas, 228 hojas de 15 tablas y 28 localizadores ambiguos resueltos. Los 186 candidatos quedan bloqueados por dimensiones territoriales vacías y por ausencia de alcance canónico en las decisiones previas. Los años de estas seis tablas sí están expresos en el inventario. Adicionalmente, 82 candidatos catalanes tienen `engineLocations[].currentLines`, propiedad no admitida por el schema cerrado. No se elimina para obtener verde ni se amplía el contrato desde esta investigación. Los 104 restantes superan el schema de decisión, pero tampoco cubren el helper canónico.

Reparto: Andalucía 48; Valencia 36; Catalunya 2020–2021 28; Catalunya 2022–2024 54; Madrid 10; Murcia 10. Todas son propuestas de cuota/base por año, no 186 reglas aceptadas. La propuesta de registro pasa su schema estructural con atestaciones null; esto no implica que pase el coordinador de aceptación. El coordinador operativo no se ejecutó con un registro ficticio.

`manifiesto.json` enumera path, SHA-256, tamaño y baseSha256 null para las altas; excluye scratch, bytecode y su propia autorreferencia. `entrega.patch` contiene las altas textuales. Los nueve PNG se integran por archivo y hash en `cas/sha256`; `entrega-hashes.json` fija manifiesto y patch. `preflight.json` comprueba presencia de todos los archivos de la base y cero borrados. El padre debe repetir esa comprobación al integrar y encargar una revisión nueva del binding exacto. No se copia toda la carpeta scratch.

El primer pase de tipos ampliado a tres archivos exigió anotar `patch: list[str]` en el empaquetador. Se conserva el diagnóstico en `mypy-empaquetador-inicial.log`; la anotación no cambia el contenido del patch. `ruff-final.log`, `mypy-final.log` e `historico-final.log` corresponden a la repetición final; sus resultados no se suman a los recuentos anteriores. La comprobación de tipos utiliza imports omitidos y cuerpos sin anotación comprobados, no modo estricto completo.

El primer empaquetado rechazó dos symlinks históricos sin destino (`revisiones/preservacion-v2/scratch/.cache/procedencia` y `scratch/alias`). Están incluidos como enlaces en la base; no son borrados de esta entrega. Se corrigió únicamente el control de presencia para reconocer enlaces y cotejar el texto exacto de su destino con `git show BASE:ruta`. Se conservan intactos y se enumeran en preflight.json. Objeción experta: is_file sigue el enlace y confunde ausencia del destino con desaparición del objeto versionado. Coste: distinguir ambos estados, sin atribuir restauración de corpus a un enlace roto. La repetición histórica y los tipos de los tres instrumentos ya habían pasado antes de detectar esta incidencia del empaquetado.
