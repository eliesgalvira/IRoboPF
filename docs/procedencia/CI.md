# CI reproducible

Antes de cada push se ejecutan los pasos vigentes de `.github/workflows`, con
sus comandos, versiones y flake Nix, incluida la comprobación del inventario
generado. Una ejecución con variables adicionales de desarrollo no demuestra
por sí sola que el workflow funcione. Los cambios del workflow o de sus scripts
requieren `act` o reproducción de cada paso en un entorno limpio sin heredar
el PATH del operador; sólo se publica si pasa. Se comprueba después el resultado
remoto del commit publicado.

En la reproducción manual, la fase anterior a `setup-bun` debe funcionar sin
Bun. El control de cachés examina las rutas que tendría el checkout publicado,
sin confundir la caché local ignorada con un archivo versionado. Puede usarse
una representación de esas rutas sin contenido, copiando únicamente el script
del control; las demás pruebas ejecutan el código real. Esto no emula la imagen
Ubuntu ni las acciones de instalación: se registran los runtimes Nix usados y
la identidad del YAML. No hace falta una copia completa del repositorio.

`Comprobaciones` ejecuta contratos y verificadores sin historial Git ni CAS privado.
Instalar Bun 1.3.13, Node 24, Python 3.13 y Nix; desde la raíz:

```sh
timeout -k 30s 10m bun install --frozen-lockfile
timeout -k 30s 40m bash scripts/ci-comprobaciones.sh
```

Los comandos `contenido-verificar.mjs --fixture` y `rastro-verificar.mjs --fixture`
construyen un snapshot pequeño con bytes sintéticos en el directorio temporal.
Ejecutan los verificadores productivos sin rebajar integridad ni aceptación fiscal.
`verificar-enlaces.mjs --fixture` ejecuta los ataques del auxiliar documental con
el único payload Madrid versionado, sin las demás entradas del registro.
El ensayo de almacenamiento externo genera también sus objetos: comprueba bytes,
respuestas HTTP, restricciones de acceso, ausencia, corrupción y enlaces simbólicos
sin necesitar un almacén previamente instalado.

El corpus CAS completo está **omitido explícitamente en CI**, no aprobado.
El contrato de los siete lotes de deducciones sí se valida con los manifiestos
versionados: exige los 351 códigos, localizadores admitidos y referencias a
documentos declarados. Se ejecuta sin CAS; no certifica los originales ni sus
interpretaciones jurídicas. Una ampliación regional debe normalizarse antes
de incorporarla al registro común. Sus expedientes conservan la evidencia
complementaria mientras esa incorporación está pendiente.

Con el almacén externo configurado, la suite local opcional es:

```sh
timeout -k 30s 20m bun run test --config scripts/procedencia/corpus-local-vitest.mjs
timeout -k 30s 20m bun tests/corpus-local/nominal.test.mjs
timeout -k 30s 20m bun scripts/procedencia/contenido-verificar.mjs
timeout -k 30s 20m bun scripts/procedencia/rastro-verificar.mjs
timeout -k 30s 20m bun scripts/procedencia/verificar-enlaces.mjs
```

Estos ensayos históricos pueden señalar desfase entre software actual y snapshots;
no deben actualizarse o retaggearse para aparentar evidencia actual. Las versiones
anteriores siguen conservadas en Git. Los ensayos ordinarios fijan fuentes por
SHA-256 en `scripts/procedencia/fuentes-actuales.json`: cambiar una fuente exige
revisar su contrato explícitamente, sin consultar objetos Git históricos.

`UV_PROJECT_ENVIRONMENT`, `UV_CACHE_DIR` y `TMPDIR` pueden apuntar a rutas privadas
fuera del repositorio. No se necesita `.venv` dentro del checkout.

El trabajo `corpus` incluye `scripts/ci-datos.sh`: regresiones públicas de unidades,
resolución de propiedades e IPC/SS, además de la aritmética del motor. Usa Python
3.13, PyMuPDF 1.26.7 y jsonschema 4.25.1 mediante `uv`; la caché es
`$HOME/.cache/uv`. Cada suite tiene su propio `timeout` y se ejecuta en secuencia.
Estos casos no necesitan los originales privados ni aceptan la vigencia fiscal
del corpus. Para ejecutar sólo este bloque:

```sh
timeout -k 30s 12m nix develop path:tools/procedencia --command bash scripts/ci-datos.sh
```

`scripts/ci-simuladores.sh` añade los 14 métodos portables del transporte y
88 pruebas Vitest de proyección, composición y referencias Open. Incluye el
operador Bun real con entradas válidas y rechazo por campo sobrante. Las
capturas oficiales privadas y la campaña masiva siguen fuera de estos fixtures.

Ese operador necesita Jujutsu para identificar su base. El entorno Nix fijado
incluye `jj`; en GitHub Actions se inicializa sobre el checkout Git normal de
la acción. Se rechaza un `.git` que sea archivo de worktree. En local se usa
el repositorio Jujutsu existente, sin inicializar ni copiar otro checkout:

```sh
timeout -k 30s 12m nix develop path:tools/procedencia --command bash scripts/ci-simuladores.sh
```

La proyección de seis componentes de cuota aprobada en C conserva las siete
referencias monetarias. Los pins vigentes están en
`scripts/procedencia/fuentes-actuales.json`; la ampliación histórica posterior
actualiza los módulos revisados sin atribuir aceptación fiscal al operador.

El bloque de datos incluye además 46 regresiones públicas de escalas y mínimos:
reanudación, extracción de ambos lotes, enlaces y transporte de reservas A1–A2.
Con ellas, `scripts/ci-datos.sh` ejecuta 121 métodos Python, además del control
aritmético IPC/SS. No necesita los originales privados ni regenera el censo
real de los lotes. El contraejemplo canario `tests/datos-escalas-minimos-canarias.mjs`
permanece rojo y separado del CI ordinario hasta integrar su corrección financiera
acotada; no se cuenta como un pase ni como un defecto resuelto.


Desde el corte de registros, ayudas e inversión del 5/11, la configuración general recoge `tests/**/*.test.{ts,mjs}`. Antes excluía cinco archivos `.mjs` aunque estuvieran nombrados en el paso territorial. Su exclusión quedó reproducida con salida 1 y «No test files found»; tras el ajuste pasan sus 237 pruebas y las nuevas revisiones portadas. El paso territorial nombra expresamente las nuevas pruebas. La repetición completa se efectúa en entorno limpio antes de publicar.
