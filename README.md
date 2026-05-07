# IRoboPF

IRoboPF es una herramienta educativa para entender la progresividad en frío, el
cálculo del IRPF y el impacto de las normas fiscales y laborales aprobadas en
España a lo largo del tiempo.

El proyecto persigue una idea sencilla: hacer legible lo que normalmente queda
enterrado en tramos, mínimos, deducciones, cotizaciones, retenciones, IPC y
redondeos. No basta con dar un resultado. IRoboPF intenta mostrar de dónde sale,
qué norma lo mueve y cuánto cambia cuando se compara con otros años.

No es una asesoría fiscal ni una nómina. Es una aplicación divulgativa y de
auditoría para razonar sobre casos fiscales soportados, comparar escenarios y
detectar efectos que una calculadora opaca no explica.

## Origen

IRoboPF nace a partir de la
[Calculadora de Salarios y Progresividad en Frío](https://github.com/jongonzlz/Calculadora-de-Salarios-y-Progresividad-en-Fr-o).
Ese repositorio aportó el modelo Python inicial y el Excel histórico que sirven
como referencia de migración.

Este proyecto conserva esa referencia como oracle legacy, pero separa dos
objetivos:

- reproducir salidas observables del Excel original cuando haga falta validar
  compatibilidad;
- construir un motor fiscal explicable, trazable y extensible, con dinero
  decimal y redondeos explícitos.

## Qué contiene

La aplicación tiene tres rutas principales:

- `/`: consulta individual de salario neto, IRPF, cotizaciones, carga efectiva,
  cuña fiscal y poder adquisitivo neto ajustado por IPC.
- `/auditoria`: exploración por rangos salariales, comunidades, años y modos de
  gráfico para estudiar progresividad en frío e impacto normativo histórico.
- `/liquidacion-irpf`: interfaz experta para liquidar un caso anual de IRPF con
  más variables fiscales.

El motor cubre, según el caso soportado:

- rendimientos del trabajo;
- rendimientos de capital inmobiliario;
- ganancias y pérdidas patrimoniales;
- base imponible general y base del ahorro;
- mínimos personales, familiares y por discapacidad;
- escalas estatales y autonómicas;
- reducciones por rendimientos del trabajo;
- deducciones autonómicas de 2025, excepto regímenes forales;
- cotizaciones sociales del trabajador y de la empresa;
- retenciones del trabajo;
- obligación de declarar;
- IPC 2012-2026 para comparaciones reales.

Los datos normativos están versionados como código y acompañados, cuando existe
trazabilidad suficiente, por fuentes normalizadas en `docs/fuentes/`.

## Cómo hostearlo

IRoboPF es una aplicación Next.js. Los cálculos se ejecutan en el navegador o en
el proceso de la aplicación, sin enviar salarios ni casos fiscales a un backend
externo.

Requisitos:

- Bun.
- Node compatible con Next.js 16.

Instala dependencias:

```bash
bun install --frozen-lockfile
```

Ejecuta en desarrollo:

```bash
bun run dev
```

Abre `http://localhost:3000`.

Para publicar tu propia instancia en un servidor:

```bash
bun install --frozen-lockfile
bun run build
PORT=3000 bun run start
```

Pon ese proceso detrás de tu proxy inverso habitual, por ejemplo Caddy, Nginx o
Traefik. No hacen falta variables de entorno para el cálculo fiscal. Si
despliegas en Vercel, el flujo normal de Next.js funciona sin configuración
especial: instalar dependencias, construir y servir.

Comprobaciones recomendadas antes de desplegar:

```bash
bun run test
bun run typecheck
bun run lint
bun run build
```

Validaciones legacy pesadas:

```bash
bun run test:legacy-completo
bun run test:liquidacion-legacy-completo
```

Regenerar el fixture canónico tabular:

```bash
bun run fixture:canonico-tabular
```

Ejecutar el script Python original para regenerar el Excel legacy:

```bash
uv run --with-requirements requirements.txt python Calculo_Salario_IRPF.py
```

## Arquitectura

La arquitectura está documentada en `CONTEXT.md` y en `docs/adr/`. Esta sección
resume las decisiones que más condicionan el código.

### Dominio antes que pantalla

La UI vive en `app/` y `components/`. El cálculo vive en `lib/dominio/`.

Esa separación evita que una pantalla decida reglas fiscales. Las rutas pueden
presentar consultas individuales, auditorías o liquidaciones expertas, pero el
lenguaje del dominio sigue siendo el mismo: caso fiscal anual, liquidación,
retención, cotización, mínimo, deducción, escala, impacto normativo y rastro de
cálculo.

### Legacy y canónico no son lo mismo

El proyecto original es imprescindible para validar la migración, pero no debe
dictar la arquitectura futura.

Por eso existen dos modos:

- **compatible legacy**: reproduce contratos observables del Excel histórico,
  incluidos nombres de hojas, columnas, orden y redondeos heredados cuando se
  audita compatibilidad;
- **canónico**: usa dinero decimal, redondeo half-up en fronteras explícitas y
  valores intermedios con significado fiscal.

Esta decisión viene de `docs/adr/0001-separar-modo-compatible-legacy-y-modo-canonico.md`.
Permite comprobar que no se rompe la referencia histórica sin convertir floats o
redondeos implícitos en verdad permanente.

### Motor legacy, retenciones y liquidación anual

El cálculo inicial mezclaba salario neto, IRPF simplificado, cotizaciones,
comparaciones por IPC, auditoría y exportación. Esa mezcla era útil para empezar,
pero impedía crecer sin confundir conceptos.

Ahora hay fronteras separadas:

- `lib/dominio/compatibilidad-legacy/`: perfil histórico de progresividad en frío
  y contratos observables del modelo original.
- `lib/dominio/irpf/liquidacion/`: liquidación anual del IRPF.
- `lib/dominio/irpf/retenciones/`: procedimiento de retención del trabajo.
- `lib/dominio/laboral/`: cotizaciones sociales.
- `lib/dominio/auditoria/`: auditoría de progresividad en frío e impacto
  normativo histórico.
- `lib/export/`: exportaciones educativas y compatibles.

La razón está en `docs/adr/0003-separar-motor-legacy-retenciones-y-liquidacion-anual.md`:
una retención no es una declaración anual, y una auditoría histórica no debe
depender de atajos del Excel legacy.

### Effect para capacidades

El dominio usa Effect v4 para modelar capacidades con frontera clara:
liquidación anual, retenciones, auditoría, parámetros normativos, política
monetaria, cotizaciones, rendimientos, bases, mínimos, escalas, deducciones y
explicación.

No cada función pura es un servicio. La aritmética simple sigue siendo simple.
Effect se reserva para dependencias explícitas, composición, errores recuperables
tipados y ausencia legítima sin `null` ni `undefined`.

La decisión está en `docs/adr/0004-refactorizar-dominio-con-servicios-effect.md`.
El objetivo es que un caso no soportado sea visible, testeable y recuperable, no
un cero silencioso ni una excepción accidental.

### Dinero exacto y redondeos visibles

Los importes monetarios se representan con decimal exacto. El redondeo ocurre en
fronteras declaradas: salida pública, exportación o comparación.

Esto importa porque el proyecto explica céntimos, no solo tendencias. Un float
puede ocultar o inventar diferencias de un céntimo; para una herramienta de
auditoría, ese ruido acaba pareciendo una regla fiscal.

### Ejecución local

La aplicación prioriza ejecución local: los cálculos y exportaciones se hacen sin
mandar el salario del usuario a un servidor de cálculo. La decisión está en
`docs/adr/0002-ejecucion-local-de-calculo-y-exportacion.md`.

La consecuencia es que las exportaciones grandes y los barridos salariales deben
cuidar el rendimiento del navegador. Cuando hace falta, el código usa ejecución
incremental, progreso visible y fixtures para validar contratos pesados sin
obligar a correrlos siempre.

### Normativa trazable

La normativa no se trata como texto decorativo. Primero se normaliza en fuentes
legibles; después se convierte en parámetros y reglas ejecutables.

Esto permite preguntar por qué existe un número, de qué fuente sale y qué parte
del resultado cambia cuando se modifica una medida normativa. También evita que
la UI sea la única documentación de una regla fiscal.

## Tests

La suite combina pruebas unitarias, caracterización legacy, equivalencia tabular,
fronteras de arquitectura y casos de dominio fiscal.

Comando habitual:

```bash
bun run test
```

Pruebas pesadas:

```bash
bun run test:legacy-completo
bun run test:liquidacion-legacy-completo
```

Las pruebas pesadas existen porque parte del valor del proyecto es demostrar que
el motor nuevo puede compararse contra el oracle histórico sin depender de una
captura visual ni de una hoja de cálculo abierta a mano.

## Aviso

IRoboPF es una herramienta educativa. Sus resultados dependen de los datos
normativos versionados, las hipótesis declaradas y los casos soportados por el
motor. No sustituye a una revisión profesional fiscal, laboral o contable.
