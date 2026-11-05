# Correcciones de la revisión D51

H1 aplica el máximo personal después de atribuir el coste de rehabilitación: `min(180000, coste × titularidad) − base histórica personal`. No vuelve a repartir pagos ni bases históricas ya atribuidos. Se conserva el máximo por vivienda de la deducción distinta del artículo 11 bis.

H2 y H3 rechazan sin importe una ayuda positiva. Los contratos recibidos contienen un total sin cronología ni atribución personal suficiente para restar la ayuda de la base del ejercicio y de la historia sin duplicarla. Este rechazo expresa una limitación del contrato; no afirma que recibir ayudas elimine el derecho fiscal. La ampliación pendiente debe representar ayuda total, parte del titular, ejercicio de imputación y ajustes históricos.

Fuentes: [AEAT, rehabilitación para alquiler](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-extremadura/inversiones-rehabilitacion-viviendas-zonas-rurales-alquiler.html) y [AEAT, vivienda habitual rural](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/10-cumplimentacion-irpf-deducciones-autonomicas/10_10-extremadura/10_10_2-adquisicion-rehabilitacion-vivienda.html), cotejadas con las citas preservadas de la revisión independiente.

Los 51 oráculos del autor permanecen intactos. Se añaden los tres discriminantes recibidos y nueve controles de límites, conservación del artículo 11 bis y rechazo sin importe. Validación del integrador: 144 pruebas verdes (132 recibidas, tres de revisión y nueve de límites/ayudas), tipos estrictos con Effect, Oxlint/antislop con canario y ESLint conformes. Los tres discriminantes recibidos fallan sobre la preimagen original. Todos los controles fueron secuenciales, con timeout y un worker.

Los prefijos de los tres módulos conservan íntegramente la API v4 integrada, incluidas sus correcciones anteriores. El resto de las ampliaciones recibidas no se altera. La conexión anual de las 51 ampliaciones sigue pendiente.

El primer rebase detectó 29 errores de referencia: la API v4 había retirado de CLM el parser antiguo que las ampliaciones todavía consumen. Se conserva ese parser original en la sección nueva, sin restaurarlo en los doce evaluadores previos ni cambiar sus contratos. Se guardan el rojo del rebase y su corrección; los 51 oráculos no cambian.
