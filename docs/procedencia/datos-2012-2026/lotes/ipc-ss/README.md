# IPC y Seguridad Social: enlaces candidatos v2

> Antecedente conservado. Los cinco defectos técnicos y el alcance vigente se
> documentan en la [corrección del 4 de noviembre](../../correcciones-cinco/INFORME.md).
> Las cifras y dictámenes de este documento corresponden al candidato anterior.

Base de implementación: `7cabefcf666ca93aeb767c572e003b50c874514e`. Solo procedencia documental, sin modificar parámetros del motor ni aceptar puertas. `enlaces.py` sustituye el cotejo preparatorio v1; el adaptador anterior se conserva como antecedente reproducible. Los originales y resultados completos quedan fuera del repositorio, identificados por el manifiesto. La revisión independiente corresponde al integrador.

IPC: trece observaciones oficiales 2013–2025 enlazadas por grupo, medida y período en el CSV INE 50902. Se verifica también la página de identidad de la tabla, nacional y base 2021, y la política de revisión (§17.2) del [informe metodológico INE](https://ine.es/dynt3/metadatos/es/RespuestaPrint.html?oper=25). Es una serie mensual: diciembre contra diciembre anterior, convertida dividiendo por cien. Sus tasas son definitivas; no se usa el indicador adelantado. Se conserva la [publicación de diciembre de 2025](https://www.ine.es/dyngs/Prensa/IPC1225.htm). La base 2021 identifica la serie descargada, incluidos los períodos históricos enlazados; no afirma que todas las publicaciones originales usaran esa base.

`calcularFactorIpcDiciembre` multiplica `1+tasa` entre ambos años y toma el recíproco en sentido inverso. Es un factor derivado de tasas publicadas, sujeto a la precisión de estas, no una nueva observación ni cociente de índices redondeados. 2012 es referencia identidad; no falta una tasa consumida. Diciembre de 2026 no está publicado al corte: la tasa 3% y sus metadatos son escenario explícito. No se hereda 2025 ni se presenta una media anual de 2026 como real.

SS: extracción programática por posiciones de las tablas oficiales. Cada celda conserva documento, hash, página, rectángulo, literal, grupo, concepto, unidad diaria/mensual, sujetos y período. Las mínimas no son consumidas por el perfil uniforme; su ausencia en el motor es alcance declarado, no diferencia financiera. Las máximas mensuales se normalizan a doce mensualidades solo para el perfil uniforme. Las posiciones de versiones sustituidas y correcciones permanecen separadas; el balance distingue posiciones físicas de dimensiones únicas y no suma aliases como importes nuevos.

2018 requiere enero–julio y agosto–diciembre: el parámetro legacy representa el primer tramo, mientras la ruta activa aplica `7*min(S/12,3751.20)+5*min(S/12,3803.70)`. No se limita el salario por una máxima media anual. Se conserva la ley original, artículo 130 y entrada en vigor, en XML con posición. Para 2020 se acredita la prórroga expresa de TMS/83/2019 por la DA segunda del RDL 18/2019; no es una herencia supuesta. Para 2021 se conserva además la Ley 11/2020 y su máxima desde enero; las tablas de PCM/1353/2021 describen el período desde septiembre. No se extienden esas mínimas retrospectivamente a enero.

Los tipos se extraen por concepto y cargo. El extractor v1 omitía «por 100» y podía devolver el 33% de discapacidad en desempleo; v2 captura los cargos publicados y conserva la posición de cada número con el parser común. Excluye de la búsqueda el margen vertical del BOE (x ≥ 550 puntos), manteniendo los selectores numéricos originales. MEI se coteja por año y sujeto; solidaridad por sus tres tramos y dos sujetos. Cero trabajador en FOGASA/AT-EP es cargo exclusivo empresarial, no una celda impresa con cero. AT/EP 1,5% permanece hipótesis del perfil: no se acredita elegibilidad universal.

La tabla 2013 se reextrae celda a celda: 19 de las 22 lecturas son válidas con el parser común. Las tres mínimas diarias de grupos 9, 10 y 11 conservan `25.10`, original, posición y error específico. No se interpreta ese punto por aproximación al motor ni se relaja el parser compartido.

`unidades-candidatas.json` declara dimensiones y restricciones pendientes de admisión central. Ni una igualdad ni esta declaración conceden aceptación. No se evalúan etapas de redondeo de nómina ni se cierran CX-01/03: bloque D separado.

## Reproducción local explícita

Dependencias: Python con `pymupdf==1.26.7`, `jsonschema==4.25.1`; censo con Bun, `decimal.js==10.6.0`, `typescript==5.9.3`, `effect==4.0.0-beta.57`. Preparar dependencias fuera del repositorio mediante el gestor correspondiente. Los tests públicos no necesitan CAS, Git, datos del corpus ni dependencias JS.

```sh
timeout -k 30s 20m bun tools/procedencia/datos/lotes/ipc-ss/censar.mjs "$PWD" CENSO.json
timeout -k 30s 20m uv run --with pymupdf==1.26.7 --with jsonschema==4.25.1 python \
  tools/procedencia/datos/lotes/ipc-ss/enlaces.py \
  --config docs/procedencia/datos-2012-2026/lotes/ipc-ss/obligaciones-v1.json \
  --census CENSO.json --sources FUENTES_NUEVAS.json --repo "$PWD" \
  --read-root CAS_ANTERIOR --read-root CAS_NUEVO --output RESULTADO.json
```

Repetir con `--verify RESULTADO_ANTERIOR.json` exige igualdad byte a byte. La suite completa es local, no se representa como CI. `test_enlaces.py` aporta fixtures sintéticos pequeños y `tests/datos-ipc-ss.test.py` conserva siete regresiones del adaptador. Ruff y tipos se ejecutan sobre los programas del lote. El balance por año y estados no verificables concretos se transporta junto con el replay y se resume en `BALANCE.md`.
