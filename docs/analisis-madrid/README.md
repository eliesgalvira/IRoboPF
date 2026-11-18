# Análisis salarial Madrid 2018–2025

<!-- resultados-madrid:inicio -->
## Qué puedes averiguar

¿Cuánto queda del salario tras cotizaciones e impuesto? ¿Conserva su poder adquisitivo cuando el bruto sigue los precios?

El salario bruto acompaña a los precios: parte de 30.000,00 EUR anuales en 2018 y llega a 36.970,07 EUR anuales en 2025. Con la ley de cada año, el neto pasa de 23.299,86 a 28.162,60 EUR del año. Sin embargo, en euros de diciembre de 2018, pasa de 23.299,86 a 22.853,03 EUR anuales: el cambio de poder adquisitivo es -446,83 EUR anuales. Aunque el bruto siga los precios, el neto real puede bajar.

Lee [los resultados anuales](RESULTADOS.md) para comparar la ley de cada año con dos referencias inventadas: la ley de 2018 sin actualizar sus importes y esa misma ley actualizada con los precios. No representan lo que ocurrió realmente. Las tablas separan las comparaciones fiscales del cambio por cotizaciones y redondeo en la referencia; explican supuestos, fuentes y límites. Son ejemplos educativos con cotizaciones estimadas, sin contraste Open para sus 24 filas.

Consulta también el [acompañamiento 2012–2017 y escenario 2026](ACOMPANAMIENTO.md).

Desde la raíz del proyecto, `timeout -k 30s 3m bun scripts/resultados-madrid.mjs` genera los tres documentos; añade `--check` para comprobarlos. La referencia técnica original se conserva a continuación.
<!-- resultados-madrid:fin -->

## Referencia técnica original

API: `analizarMadrid` en `lib/dominio/irpf/analisis-madrid/analizar.ts`.
CLI: `timeout -k 30s 1m bun scripts/analisis-madrid.ts < entrada.json`.
Entrada y salida JSON; importes de entrada en texto decimal EUR a céntimos.
La entrada exige edad anual explícita y el alcance negativo completo declarado.
No infiere fecha de nacimiento ni hechos desde silencios de una captura.

Ejemplo sintético de entrada:

```json
{
  "ejercicio": 2018,
  "edad": 33,
  "brutoBaseEUR2018": "30000",
  "alcance": "madrid-individual-empleo-anual-sin-otras-rentas-familia-discapacidad-especialidades",
  "ssTrabajador": {
    "naturaleza": "efectivas",
    "importe": "1000",
    "ejercicio": 2018,
    "procedencia": "supuesto-sintetico",
    "operacion": "cotizacion-anual"
  },
  "ssEmpresa": { "naturaleza": "no-disponible" },
  "retenciones": "100"
}
```

SS1000 es un hecho del supuesto sintético, nunca una nómina observada. La opción
`{"naturaleza":"estimadas-perfil-uniforme"}` reutiliza el perfil de doce meses
uniformes con prorrata, indefinido y sin especialidades; conserva el reparto
7/5 meses de 2018. No acredita mínimos por grupo/jornada ni ingreso mensual TGSS.
La SS empresarial se selecciona independientemente; si falta, coste y cuña son
null. La estimación no se convierte en SS efectiva para la API legal.

X aplica formas2018 nominales; I las mismas formas con importes monetarios
indexados. Usan la integral exacta de la escala estatal productiva y las cuotas fijas autonómicas publicadas, art20 compartido con mezcla
A+max(0,B−A)/2, mínimos5550 y gasto general2000 indexables. Hdecimal aplica
la composición histórica compartida con política decimal. Hcontractual llama
a la API legal original y conserva rechazo y razón; admitir una política Open
no acredita coincidencia de todas las casillas ni de todo su intervalo.

El factor F predeterminado es el cociente de índices INE de diciembre, base2021,
Iy/I2018, método `ipc-general-nacional-diciembre-cociente-base2021-v1`. Los operandos
entero-milésimas y hashes se consumen de `indices-ipc.json`. F2018=1. La cuantización
del bruto a céntimos se hace con racionales exactos, sin redondear antes F.
IRPF y deflación usan Decimal80. `metodoIpc` acepta únicamente ese método o
`ipc-diciembre-producto-tasas-1decimal-legacy-v1`; no admite factores externos.
La función global IPC se restaura al original; otras rutas conservan su contrato.
Las ramas comparten ese bruto y la SS previamente resuelta. No se escala la
cuota final como sustituto de indexar parámetros. La ley2018 carece de DA61;
H2025 aplica DA61 cuando corresponde. Q es posterior a DA61.

N=bruto−SS−Q. Retenciones sólo modifican el diferencial. Valores reales=N/F,
en EUR de diciembre2018; no equivalen a IPC medio anual de nóminas.
Eindex=(NI−NX)/F; Eley=(NHdecimal−NI)/F;
Erepresentación=(NHcontractual−NHdecimal)/F, sólo si Hcontractual está disponible.
Signo positivo=mejora ciudadana. Identidad de numeradores antes de división y
presentación; división Decimal80 y céntimos half-up separados. No sumar años
como pérdida personal ni presentar Eley como causalidad universal.

Decisión y objeción experta: la serialización congelada exige reconstruir Decimal
locales al consumir parámetros. Ese coste mantiene la misma operación fiscal,
impide mutación compartida y deja el override fuera del contrato legal.
La homogeneidad art20 reexpresa N en EUR2018 y vuelve a EUR nominales después de
la misma fórmula original: indexa límites, elegibilidad y magnitudes, sin cambiar
coeficientes. Sólo otras rentas cero; no generalizar fuera del alcance.

El catálogo identifica fuentes/localizadores y hashes de artefactos presentes.
Los PDF originales que no pueden comprobarse quedan pendientes individualmente;
el hash del extracto nunca se presenta como hash de PDF verificado. Las reservas
históricas de la matriz no se promueven ni se borran. La adenda legal adyacente completa DA61 y escala estatal2025 con hash del PDF original verificado y localizadores concretos. INE/SS enlazan fuentes originales y métodos implementados; conservan las reservas de resolución estadística, hechos laborales y liquidación TGSS. El rastro contiene operandos/resultados/dependencias,
año/precios/política/SS; su verificación ejecutable sigue pendiente. No altera
rastro-reforma ni promueve snapshots.

Serie reproducible sintética, con SS estimada explícita y Hcontractual no disponible:

```sh
timeout -k 30s 2m bun scripts/analisis-madrid.ts < docs/analisis-madrid/serie-ejemplo.json > serie.json
```

La CLI admite un objeto o un array en orden de entrada. Sin reloj/red; JSON
estable. SS estimada no acredita Open, coste empresarial efectivo ni ingreso TGSS.
Para reutilizar exactamente originales existentes con sus hechos y casillas,
ejecutar las suites de fixtures originales; no convertir la serie estimada en
un testigo ni trasladar una cuota esperada desde este motor:

```sh
timeout -k 30s 10m node --max-old-space-size=3072 node_modules/vitest/vitest.mjs run tests/open-2018-etapas.test.ts tests/open-2019-etapas.test.ts tests/open-2020-2022-etapas.test.ts tests/causa2023-2024.test.ts tests/redondeo-salarial-open.test.ts --maxWorkers=1
```

El catálogo enumera hashes actuales de esos fixtures y referencias originales;
esta API conserva siempre sin-identidad-exacta para la entrada analítica. Los
IDs nunca seleccionan políticas. Sólo identidad exacta de hechos, bytes y
casillas presentes permitiría acreditar un cotejo; 0023/0414 siguen reservadas
según cada original. No hay oráculo oficial del contrafactual indexado.

Validación selectiva, con Node24.20.0 del entorno Nix, heap3GiB, un trabajador,
cgroup5GiB/swap0 y timeout externo (el orquestador aplica el cgroup):

```sh
timeout -k 30s 20m node --max-old-space-size=3072 node_modules/typescript/bin/tsc -p tsconfig.analisis-madrid.json --noEmit --pretty false
timeout -k 30s 10m node --max-old-space-size=3072 node_modules/vitest/vitest.mjs run tests/analisis-madrid.test.ts tests/anual-historico-explicito.test.ts tests/historico-open-ambito.test.ts tests/revision-historico-cuotas.test.ts tests/composicion-anual-unica.test.ts tests/art20-open-c300.test.ts --maxWorkers=1
timeout -k 30s 2m node node_modules/eslint/bin/eslint.js lib/dominio/irpf/analisis-madrid scripts/analisis-madrid.ts tests/analisis-madrid.test.ts
timeout -k 30s 2m bun run lint:oxlint lib/dominio/irpf/analisis-madrid scripts/analisis-madrid.ts tests/analisis-madrid.test.ts
```

Estos controles no equivalen a CI global ni a aceptación fiscal. La suite nueva
se incluye en el paso histórico de checks.yml; reproducción limpia exacta del
workflow, inventario/generados, revisión y CI remoto corresponden a integración.
2012–17 quedan como legado parcial fuera del corte. 2026 está fuera de esta API;
IPC3% sólo escenario explícito, nunca observado. Sin nuevas capturas/casos
métricos; se preservan indicadores y cuatro arrendadores pendientes.


## Reproducción con bruto observado y coste sintético

Los modos de bruto son exclusivos: `brutoBaseEUR2018` conserva la trayectoria
de salario real constante; `brutoNominalObservadoEUR` conserva exactamente el
nominal aportado a céntimos en X/I/Hdecimal/Hcontractual. No se divide por IPC
para construir un bruto base redondeado, ni se ajustan céntimos o tolerancias.
La segunda variante permite el replay de un original, sin afirmar que sus ocho
brutos observados constituyan una trayectoria real constante.

La serie original `serie-ejemplo.json` se conserva por valor. La serie separada
`serie-coste-sintetica.json` utiliza SS de trabajador y empresa estimadas por
el perfil histórico de oficina versionado. Coste=bruto+SSempresa; cuña por rama
=(coste−netoRama)/coste, fracción, desconocida con coste ausente o cero.
`cunaHdecimal` nombra la rama del alias anterior `cuna`; `cunas` expone
X/I/Hdecimal y Hcontractual cuando está disponible. SS estimada nunca acredita
nómina ni abre la conexión legal; no se toma una decisión fiscal por coste.

`scripts/analisis-madrid-replay.mjs` selecciona originales existentes de los
ocho ejercicios por posición explícita en los fixtures; nunca selecciona una
política fiscal por ID. Lee 2021–22 de sus lotes CAS originales y verifica
SHA256, tamaño e identidad de posición antes de obtener entrada y observaciones.
Para 2020 y 2023–24 resuelve el recibo original y enlaza los hashes PDF/SES.
No escribe originales, esperados ni tablas de cuotas. El directorio CAS es un
argumento local; no se incorpora su ruta a la salida ni al repositorio.

```sh
timeout -k 30s 2m bun scripts/analisis-madrid.ts < docs/analisis-madrid/serie-coste-sintetica.json > serie-coste.json
timeout -k 30s 2m bun scripts/analisis-madrid-replay.mjs CAS_ORIGINALES > replay.json
```

La salida conserva fixture/pointer/SHA, identidad original, fecha de devengo,
edad, bruto nominal, SS y retención únicos explícitos. Los hechos son supuestos
sintéticos originales, no datos fiscales reales. Los campos negativos se toman
del contrato del fixture, no del silencio SES. No se infieren totales si faltan.
Cada casilla acreditada se coteja con Hcontractual: igualdad decimal exacta,
sin tolerancia. Hdecimal y Erepresentación se muestran por separado; I nunca
se coteja con Open. 0023/0414 siguen reservadas para este cotejo y null no es cero.
El resultado distingue igualdad en casillas acreditadas del fixture, discrepancia,
rechazo y original no disponible. Si falta un original se informa la causa;
no se reemplaza con una entrada compatible. El hash de fixture no certifica
por sí solo los bytes PDF/SES: sus hashes enlazados se conservan y el replay
declara expresamente que no vuelve a verificar esos PDF/SES completos.

Objeción experta: coincidencia en casillas disponibles no prueba identidad de
hechos negativos, aceptación global ni una causa universal. Tradeoff: se obtiene
una demostración numérica reproducible y limitada, manteniendo la reserva de
identidad documental completa. El catálogo global conserva su estado; la adenda
`adenda-legal.json` sólo completa los enlaces y valores del alcance indicado.
El rastro de Hdecimal serializa límites/tipos/cuotas usados, fórmula art20,
mínimos y parámetros DA61; el contractual conserva su rastro legal propio.

La revisión independiente436 y su rojo original de cobertura se conservan como
evidencia histórica; esta demostración nueva no reescribe su recepción ni afirma
que aquella revisión hubiera cerrado la cobertura. No se amplían años: 2012–17
siguen como legado parcial; 2026 está fuera de la API e IPC3% es escenario no
observado. Pensión432 sigue sin fix. Indicadores81/82 y76/80+4/4+1/2 intactos;
los cuatro arrendadores conocidos siguen pendientes.


## Perfil histórico de oficina implementado

`serie-coste-sintetica.json` usa el cociente INE y selecciona explícitamente
`estimadas-oficina-historica`, con perfil
`oficina-exclusiva-grupo7-cnae62-rg-indefinido-completa-12uniformes-v1`.
El grupo7 y CNAE62 forman parte del supuesto sintético, nunca se deducen del salario.
El perfil completo y exclusiones están en `calendario-oficina.json`: oficina exclusiva
sin exposición ni tareas externas, RG, indefinido, jornada completa, 12meses
uniformes con prorrata, sin incidencias/extras/pluriempleo/especialidades.
La selección adopta ese supuesto completo; no valida hechos laborales de terceros.

El calendario final CCgrupo7/CP se comprueba por cada tramo mensual, incluidas las
revisiones retroactivas PCM313/2023 y PJC281/2024. No aplica mínimos vinculantes:
los rechaza exactamente. Con mínimos no vinculantes se reutiliza el desglose
uniforme, con base2018 de siete/cinco meses, MEI y reparto de solidaridad2025
intactos; sólo se aplica el diferencial AT/EP2018: 1% frente al1.5% legacy.
La tarifa incluye IT/IMS y relevo legal25/12/2025 en el rastro. La estimación
anual continua no reproduce redondeos ni acredita ingreso TGSS, cumplimiento
salarial o convenio. Un hecho efectivo requiere su fuente propia y no se
valida por elegir este perfil. `estimadas-perfil-uniforme` queda identificado
como LEGACY, con elegibilidad distinta, sin calificarse como oficina histórica.

Objeción experta: el índice publicado también está redondeado y el perfil sintético
no prueba afiliación, convenio ni bases reales. Tradeoff: resultados reproducibles
dentro del supuesto y rechazo explícito fuera de mínimos, sin convertir estimación
en hecho efectivo ni tomar decisiones fiscales por coste. El ejemplo original
selecciona legacy y conserva sus valores; la serie histórica sintética está
separada de los ocho originales y sus95casillas. CI ejecuta tres replays públicos
y cinco faltantes tipados; los ocho replays con CAS se validan aparte, sin skips.

Los resultados reproducibles de esta trayectoria se muestran en
[`serie-coste-resultados.json`](serie-coste-resultados.json): coste, SS, netos y
cuñas por rama con sus métodos y fuentes. Son resultados del motor, sin autoridad
de oráculo normativo ni Open. No se suman años como pérdida personal.
