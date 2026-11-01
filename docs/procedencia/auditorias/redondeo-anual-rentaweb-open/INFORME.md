# Redondeo anual observado en Renta WEB Open 2025

**Hay discrepancias reproducibles con la API actual.** Open 1.19 devuelve **2.575,26** para componentes, **1.283,56** para gravámenes y **−721,23** para DA61; la API devuelve 2.575,27, 1.283,57 y −721,21. El padre dispone de un rojo mínimo ejecutado, sin cambios del motor ni de interfaz.

Base exacta `7b5140984299475542cfb291b3075d4c19598f98`. Ejecución personal el 01/11/2026, sin subdelegación. Programa oficial: [Renta WEB Open 2025](https://www2.agenciatributaria.gob.es/wlpl/PARE-RW25/OPEN/index.zul?EJER=2025&TACCESO=COLAB), versión visible **1.19 (OPEN)**; persistencia **VersionReglas=N000088955**, **VersionModelo=0.12**. Los PDF llevan «BORRADOR NO VÁLIDO PARA SU PRESENTACIÓN» y «SIN VALIDAR». No se presentó ni se inició pago alguno.

## Resultados

| Caso (entrada completa en casos.json) | API actual | Open [0670] |
| --- | ---: | ---: |
| art20: bruto 20.747,49 | 2.289,89 | 2.289,89 |
| componentes: bruto 22.004,62 | 2.575,27 | **2.575,26** |
| gravámenes: bruto 18.673,52 | 1.283,57 | **1.283,56** |
| DA61: bruto 17.000,42 | −721,21 | **−721,23** |
| posterior: bruto 17.000,95 | −720,85 | −720,85 |
| control dos pagadores | 1.333,92 | 1.333,92 |
| control devolución | −321,18 | −321,18 |

`observados.json` conserva por caso [0023], [0025], [0500], [0505], [0528–0533], [0414], [0595], [0610] y [0670], cotejados entre PDF y persistencia. `null` significa campo omitido, no un cero transcrito del PDF. Los originales descargados son los `.pdf` y `.ses`; los textos son extracciones auxiliares. `api-actual.json` procede de la API real sobre copias de `lib` cotejadas byte a byte, con el runner recibido intacto. No se usa el modelo aritmético como ejecución oficial.

## Política que reproduce estas ejecuciones

La combinación que reproduce **todas las casillas comparadas de los siete casos** es cuantizar art20 antes de neto/base, cuantizar cada gravamen antes de restar el gravamen del mínimo, y cuantizar DA61 antes de restarla. Sumar/restar después esos céntimos reproduce [0595], [0610] y [0670]. `politicas.json` compara las alternativas aisladas del revisor y esa combinación; `comparar.py` identifica expresamente la única extensión de su modelo. Esto acredita correspondencia en la muestra, no demuestra implementación interna única ni una norma escrita universal.

- Art20: [0023]=0,01 y [0025]=17.747,48. [0528]=1.818,45 y [0529]=1.605,01; mínimos 527,25 y 506,32; cuotas 1.291,20 y 1.098,69. El saldo 2.289,89 coincide accidentalmente con la API. Cuantizar solamente art20 habría dado 2.289,90: esa alternativa aislada no reproduce Open.
- Componentes: [0528]=1.969,30, [0529]=1.739,53, [0530]=527,25, [0531]=506,32; [0532]=1.442,05 y [0533]=1.233,21. [0595]=2.675,26, menos 100 retenidos =2.575,26.
- Gravámenes: base 13.309,18; gravámenes 1.285,85/1.131,28 y mínimos 527,25/506,32; cuotas 758,60/624,96. Resultado 1.283,56. Este caso diferencia redondear los gravámenes de redondear solamente las cuotas después de mínimos.
- DA61: [0023]=5.292,27, [0500]=8.708,15; [0532]/[0533]=300,02/233,87; [0414]=255,12 y [0595]=278,77. Resultado −721,23. El art20 exacto es 5.292,265: esta observación favorece el empate positivo hacia arriba frente al empate al par en esa etapa. La variante que cuantizaba solamente DA61 (−721,22) tampoco reproduce la ejecución completa.
- Posterior: Open ya llega a [0595]=279,15, con base 8.709,61, cuotas 300,16/234,00 y DA61=255,01. No llega al 279,155 del cálculo analítico: **este experimento no identifica un desempate negativo final**, ni demuestra redondear 279,155 a 279,16 antes de retenciones. Las etapas previas eliminan ese empate.

Tras guardar/cargar `posterior.ses` se repitieron vista previa y guardado: veinte campos de entrada/salida idénticos, [0595]=279,15 y resultado −720,85 (`recarga.json`, `posterior-recargado.pdf/.ses`). No se observó pérdida adicional de precisión en este caso; no se afirma conservación universal ni identidad binaria del contenedor.

## Datos consumidos y límites

Perfil sintético: nacido 01/01/1985, 40 años, soltero, individual, Madrid, mínimos 5.550/5.956,65, sin familiares, discapacidad, otras rentas ni deducciones adicionales. Identificador generado para la prueba `90000000B`, nombre `PRUEBA REDONDEO OPEN`, sin consultar identidades reales ni autenticarse. Open rechazó los marcadores PRUEBA/00000000/99999999; no se deduce de ello validación censal. `identificacion.json/.png` y los PDF fijan el perfil efectivamente usado.

El diálogo de trabajo agrega importes del contribuyente. Para el control de dos pagadores se introdujeron **30.000 bruto, 2.000 SS, 100 sindicato, 600 colegio, 400 defensa y 3.000 retenciones**. El `.ses` conserva GCC=600/GDJ=400, y TPCP=500/TPGDJ=300: límites anuales aplicados al agregado. [0017]=27.100 y gasto general [0019]=2.000 producen base 25.100. No se aplicaron límites por pagador ni se volvió a calcular SS. Los documentos de entrada mantienen ambas operaciones de retención distintas.

DA61 requiere **otro diálogo público**, enlazado desde trabajo. Se declararon allí los mismos salarios íntegros de empleo elegible y exclusivamente sus cotizaciones de [0013], sin pensiones ni otras categorías. Las claves persistidas IDICLDED2/GSSCLDED2 se cotejan con la entrada completa. Los gastos sindicales/colegio/defensa no se agregan a ese campo de cotizaciones. `*-entrada-da61.json` conserva el diálogo, y `extraer.py` verifica importes, perfil y salidas.

## Reproducción y alcance

Abrir el enlace Open anterior, pulsar Cargar, aceptar sustituir únicamente los datos de prueba y seleccionar un `.ses` entregado. Revisar trabajo y su enlace DA61; obtener Resumen → Vista previa. Se conservan entradas antes de aceptar, trabajo calculado, resumen y originales por hash. No pulsar Presentar declaración. `browser-interactivo.py.txt` y `experimentos-interactivo.py.txt` documentan los fragmentos del arnés usado; no son programas autónomos. El navegador compartido falló dos veces al arrancar; se usó Chromium 153.0.8010.36/Playwright mediante Nix, sin servidor propio. Todas las pestañas y contextos se cerraron. No se guardan cookies, cabeceras o tokens de navegador.

Los primeros intentos con `fill()` no cambiaban algunos campos ZK. Se descartaron al cotejar entradas y se sustituyeron por teclado, salida del campo y aserción del valor consumido. La evidencia final supera además el cotejo independiente de las entradas del `.ses`. No son discrepancias fiscales del simulador.

Comandos desde la raíz:

```sh
nix shell nixpkgs#python3 nixpkgs#poppler-utils -c python3 docs/procedencia/auditorias/redondeo-anual-rentaweb-open/extraer.py
nix shell nixpkgs#python3 -c python3 docs/procedencia/auditorias/redondeo-anual-rentaweb-open/comparar.py
nix shell nixpkgs#python3 nixpkgs#bun -c python3 docs/procedencia/auditorias/redondeo-anual-rentaweb-open/rojo_api.py
```

El tercero debe fallar: **2575.27 != 2575.26**, con originales adjuntos. Usa dependencias existentes de solo lectura (`REVISION_DEPS` configurable), scratch propio y `flock` durante cada ejecución backend. Ruff y mypy `--check-untyped-defs` pasan para los cuatro scripts propios; no se alteraron ni desactivaron reglas TS/Effect. No se ejecutaron builds ni suites masivas. El CLI effect-solutions no estaba disponible; se consultó el ejemplo local de runSync y se reutilizó sin modificar el runner ya recibido.

Los originales XSD/diccionario/orden del revisor se descomprimieron y cotejaron con sus tres hashes, sin repetir adquisiciones (`originales-previos.json`). No apareció ni se afirma haber localizado código público que demuestre las reglas internas; no se atribuye al XSD el orden observado.

Siguiente acción: el padre debe corregir el contrato anual para reproducir estas casillas y ejecutar el rojo, manteniendo la separación entre comportamiento observado y norma. No extrapolar a 2026, otras rentas, territorios o perfiles. No se modificaron motor, UI, inventario, snapshots, registros de confianza ni VCS. El cotejo final y el parche de adiciones reconstruible acreditan preservación de los archivos base.

El parche `entrega.patch.json` contiene todas las adiciones de contenido y su manifiesto, con gzip/base64, SHA256, tamaños y modos; incluye PDF, SES y el archivo vacío `sin-borrados.txt`. Se reconstruye con `nix shell nixpkgs#python3 -c python3 docs/procedencia/auditorias/redondeo-anual-rentaweb-open/reconstruir.py`. Los controles `entrega.patch.json` y `reconstruccion.json` se excluyen de su propio contenido para evitar autorreferencia.
