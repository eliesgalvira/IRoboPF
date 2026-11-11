# Cierre de la misma primera revisión: base patrimonial parcial

Dictamen: FAVORABLE ACOTADO. Se cierran REV-PARCIAL-01 y REV-PARCIAL-02 sobre la evidencia ejecutada por el padre y las preimágenes/postimágenes preservadas. No quedan objeciones monetarias, de reservas o documentales abiertas dentro del perfil y los discriminantes revisados. Este cierre continúa la primera revisión; no es una revisión nueva ni una ejecución del revisor.

La entrega inicial /home/elies/Backups/IRoboPF/revision-patrimonio-base-parcial-20261111 conserva INFORME.md, revision.patch, manifiesto, fuentes y pruebas originales sin sobrescribirlos. Su dictamen pendiente queda actualizado por este cierre aditivo. La documentación antigua conservada es evidencia histórica, no la especificación vigente.

## Evidencia y enlace al resultado final

H identifica /home/elies/Backups/IRoboPF/producto-historico2023-2024-integracion-20261111. Se leyeron COMANDO.json, RESULTADO.json, supervision.json y reportes JSON del padre. Los estados de las aserciones, las rutas de testResults y los códigos de salida coinciden:

- H/patrimonio-pre-01: 3/40; antecedente PRE discriminante.
- H/patrimonio-post-01: repetición PRE accidental declarada por el padre, también 3/40. Se excluye como evidencia POST.
- H/patrimonio-post-02: 37/40; dos fallos de REV-PARCIAL-01 y un fallo de preparación del helper negativo.
- H/patrimonio-post-03: 44/44 en dos archivos, las 40 pruebas de esta revisión y cuatro fronteras adicionales del padre.
- H/patrimonio-regresiones-02: 874/874 en 19 archivos.
- H/producto-final-01: 1372/1372 en 29 archivos. Incluye las mismas 40+4 focales pasadas después del cambio de rastro y las correcciones de tipos. Los conjuntos anteriores se solapan; no se suman como pruebas distintas.

Para esos recibos se comprobó la igualdad entre el comando supervisado y el comando de COMANDO.json, cwd en raíz y entorno explícito Nix, con Bun1.3.13 y Node24.20.0. Los comandos de pruebas usaron maxWorkers=1. El timeout exterior era905s, presupuesto900s y timeout interior835s. El supervisor registra limpieza verificada y ausencia de supervivientes; RESULTADO y primary_exit concuerdan. No se ejecutaron esos comandos durante el cierre.

H/producto-tipos-05 acredita exit0 en bun run typecheck. H/producto-lint-03 acredita exit0: oxlint sin errores ni advertencias y ESLint con27 advertencias, cero errores. Son comprobaciones globales del padre posteriores al resultado1372, no una certificación propia de todos los módulos ni del CI. Las modificaciones posteriores de workflow y JSON documental CLM se identifican por la declaración del padre; este cierre no audita el árbol completo ni verifica ese workflow.

Se verificaron los62 hashes de H/evidencia-producto-1372/MANIFIESTO.json contra sus post congelados. El manifiesto es selectivo y posterior al runtime: no captura exhaustivamente las dependencias evaluadas. Al observar raíz coincidían60/62; las otras dos rutas eran los cierres documentales de B08 y Madrid, preservados como diferencias frente al congelado. Ningún archivo productivo o de pruebas de ese manifiesto difería. No se atribuye a esas observaciones una prueba del estado íntegro en el instante de ejecución.

Se reconstruyeron en memoria los13 post de los parches candidato, patrimonio-correccion-01, patrimonio-regresiones-01 y mecanica-final-01 contra sus pre preservados. La guarda corregida coincide byte a byte con el productor DT18 congelado final. La prueba propia final difiere de la original únicamente en la construcción racional del argumento negativo. El productor P5a final difiere del candidato revisado sólo en el literal explicativo ISD. EVIDENCIA.json fija esas comprobaciones; PRE/POST registran hashes y deriva de las entradas leídas.

## REV-PARCIAL-01 cerrado: reparto sólo cuando existe ambigüedad

La guarda final cuenta proyectos con amortización positiva y rechaza únicamente cuando hay más de uno y el incremento es positivo e inferior al capital total. Si el segundo proyecto sólo paga intereses, existe un único destino de capital computable. Si el incremento es cero o negativo, todos los capitales computables son cero. Ambos supuestos se admiten sin inventar una elección; siguen conciliando pagos, préstamos y documentos.

Las dos pruebas propias que fallaban en post-02 pasan en post-03 y producto-final-01. Adquisición con capital3000 e intereses50, segundo proyecto con sólo intereses50 e incremento2999,99 conserva base3099,99. Los cuatro casos añadidos de incremento0/-0,01 con varios capitales conservan base100 de intereses en ambas API y regional0. Dos destinos de capital positivo con déficit positivo siguen rechazados con causa de atribución explícita; no retornan cero fiscal ficticio.

El tercer fallo de post-02 era un error de mi preparación: euros("-0.01") lanzaba antes de alcanzar ajustarPatrimonioP5a. El padre sustituyó ese argumento por {n:-1n,d:1n}. La preimagen original se conserva y el esperado de rechazo no cambia. No se presenta ese fallo como defecto productivo ni se elimina el discriminante.

La base DT18 limita la inversión propia por el incremento no negativo, suma financiación documentada e intereses y conserva los límites anuales. Pasan el ejemplo AEAT con amortización8000, incremento5300 e intereses1000, base6300; comisión fuera del límite patrimonial; déficit1c; incrementos0/negativo; fronteras±1c de9040 y12080; contraste ordinario Murcia y derecho material Balears. Las cuotas estatales/autonómicas se contrastan por separado con racionales propios. No se importan esperados del productor.

## Reservas y alcance territorial conservados

Las pruebas suficientes multirrama conservan bases3050/3050, reserva regional6100, previas0/3050 y cuota533,75 por cada parte. La coordinación de rehabilitación/adecuación y el límite separado12080 no pasan a una bolsa única. Las regresiones de patrimonio conjunto incluyen los órdenes de solicitudes; las expectativas de rechazo de reparto ambiguo están preservadas con su causa en patrimonio-regresiones-01. No se detecta una nueva rotura de reserva u ordinal en los casos admitidos comprobados.

La regla regional riojana permanece separada: vivienda-rioja.ts conserva el retorno cero cuando crecimiento<capitalTotal. La parcialidad estatal no se extiende a esa deducción regional. El consumidor anual conserva el cerco B08 de patrimonio suficiente; la concurrencia con donativos sigue sinISD. Las suites de ambos perfiles están en los registros874/1372. P5a, Canarias y los derechos de alquiler Balears/Rioja tienen sus regresiones en esos conjuntos; no se declara auditoría exhaustiva de esas ramas o de los demás módulos del conjunto1372.

Los cambios de expectativas de cinco archivos en patrimonio-regresiones-01 conservan pre/post y causa: sustituyen cero estatal indebido por base parcial, cero ISD por rechazo técnico y resultado multirrama ambiguo por rechazo. No abren B08 a patrimonio insuficiente ni convierten el requisito regional en parcial.

## REV-PARCIAL-02 cerrado: contrato, rastro y antecedentes

En el congelado final, API-MOTOR.md:452 explica base parcial y el significado de cumpleCondicionPatrimonial: cobertura íntegra del capital, compatible con base estatal parcial si es falso. Distingue el requisito regional y la atribución ambigua. El apartado454 define la ausencia de cronología ISD como restricción del contrato, con rechazo sin importe y sin resta automática.

La nota patrimonio-parcial-20261111.md describe financiación y límites, incremento no positivo y varios proyectos, cronología del derecho e isdExcluido heredado. La adenda de patrimonio-p5a-20261105/REVISION-INICIAL.md rectifica expresamente la lectura antigua manteniendo el original histórico. La traza P5a cambia sólo su literal a perfil sin ingresos ISD; mecanica-final-01 preserva el delta. Estos documentos y el rastro están incluidos en los62 post del manifiesto1372.

## Fuentes y límites del cierre

Se conserva como fuente primaria el manual AEAT Renta2025, comprobación de situación patrimonial, recuperado11/11/2026T21:51:23Z, actualizado17/03/2026, SHA256850984c322165aa82357b0a3e46e1e8608339b8747f814d8c4c8c280c34b917f. Su nota del ejemplo fundamenta5300+1000=6300. URL: https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c16-deducciones-generales-cuota/deduccion-inversion-vivienda-habitual-regimen-transitorio/condiciones-requisitos-caracter-general/comprobacion-situacion-patrimonial.html . Original y metadatos en H/fuentes-patrimonio-padre; la entrega inicial fija el resto de fuentes y reservas temporales. No hay nueva descarga.

Se leyó /home/elies/Backups/IRoboPF/contraste-patrimonio-parcial-20261111/INFORME.txt y su evidencia: dictamen favorable acotado y512 ternas Fraction comprobadas por ese revisor. Es corroboración separada; no se reejecuta ni se atribuye a este cierre. La decisión aquí se apoya además en la cadena causal propia, los archivos congelados y las40 pruebas originales ejecutadas por el padre.

ISD se acepta exclusivamente como rechazo contractual por falta de cronología de adquisición del derecho y patrimonio inicial. No se certifica doctrina ISD, exclusión legal, inclusión automática ni prohibición general. isdExcluido vale cero en los perfiles admitidos. Se mantienen las reservas de investigacion-art70-isd-20261111.

Este cierre sólo añade documentación y manifiestos en el destino de la revisión. No modifica código ni pruebas, no inicia runtime fiscal/JS/TS/Bun, CI, inventario, instalaciones, VCS mutante, worktree, publicación, borrados ni subagentes. Lectura y comprobaciones documentales stdlib bajo timeout -k5s30s. No se escribe Effect, por lo que no se introduce patrón ni se ejecuta el CLI prohibido; la consulta de fuentes Effect usada al preparar las pruebas queda documentada en el informe original.

La primera revisión monetaria y documental queda cerrada favorablemente dentro de ese alcance. CI exacto de workflow/Nix, generados/inventario, publicación y comprobación remota permanecen a cargo del padre; no se certifican aquí ni se autoriza una publicación general por este dictamen.
