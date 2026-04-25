# IRoboPF

Auditoría de progresividad en frío para España entre 2012 y 2026. El proyecto
convierte una calculadora histórica de salario neto, IRPF, cotizaciones e IPC
en una aplicación web educativa que permite comparar poder adquisitivo neto y
explorar rangos salariales sin enviar datos a un servidor.

La interfaz actual no pretende ser una nómina real ni una asesoría fiscal. Es
un caso fiscal simplificado para entender cómo cambian el salario neto, el IRPF
final y las cotizaciones cuando se comparan salarios equivalentes ajustados por
IPC.

## Estado actual

- Aplicación Next.js con dos rutas principales:
  - `/`: simulador de consulta individual.
  - `/auditoria`: exploración por rango salarial, gráficos, hallazgos y descarga
    de XLSX.
- Motor de cálculo en TypeScript en `lib/domain/progresividad.ts`, usando
  `decimal.js` para dinero y `effect` para modelar cálculos deterministas.
- Período de auditoría heredado: 2012-2026, con 2026 como año de referencia en
  la interfaz actual.
- Ejecución local en navegador: los cálculos y las exportaciones se hacen en el
  dispositivo del usuario.
- Script Python legacy conservado en `Calculo_Salario_IRPF.py` como referencia
  histórica y oráculo de migración.
- Compatibilidad legacy completa implementada en el exportador Effect: hojas de
  control, comparativa de inflación y hojas `DAT_YYYY`.

## Origen del cálculo

El código de cálculo original se basa en el repositorio
[Calculadora de Salarios y Progresividad en Frío](https://github.com/jongonzlz/Calculadora-de-Salarios-y-Progresividad-en-Fr-o).
Ese proyecto generó el modelo Python inicial y el Excel histórico que IRoboPF
está migrando a una experiencia web.

En este repositorio se distinguen dos objetivos:

- **Modo compatible legacy**: reproducir salidas tabulares observables del Excel
  original cuando haga falta validar la migración.
- **Modo canónico**: expresar el dominio con dinero decimal, redondeos explícitos
  y rastros educativos más adecuados para producto.

Las decisiones de arquitectura están documentadas en `CONTEXT.md` y en
`docs/adr/`.

## Qué permite hacer

### Simulador individual

La ruta `/` calcula un salario bruto anual de referencia en 2026 y lo compara
contra un año entre 2012 y 2025. La comparación usa un salario nominal
equivalente en el año comparado y reexpresa el resultado en euros de 2026 con
IPC acumulado.

Muestra:

- salario neto anual;
- cotización del trabajador;
- cotización empresarial y coste laboral;
- IRPF final;
- carga sobre salario bruto;
- cuña fiscal laboral;
- diferencia de poder adquisitivo neto anual y mensual.

El control preciso acepta importes con céntimos. El slider rápido está acotado
al rango pedagógico de 10.000 a 100.000 euros en saltos de 1.000 euros.

### Auditoría por rango salarial

La ruta `/auditoria` ejecuta un barrido salarial local, por defecto entre
10.000 y 60.000 euros, con paso de 5.000 euros. El usuario puede cambiar mínimo,
máximo y año comparado.

La pantalla prioriza hallazgos antes que la tabla completa:

- salario más afectado en poder adquisitivo neto;
- mayor cambio de carga sobre salario bruto;
- primer salario del rango con IRPF final en 2026;
- gráficos de delta anual y neto real comparado;
- tabla de datos del barrido.

Desde esta ruta se pueden descargar dos archivos Excel:

- `IRoboPF_Auditoria_Educativa_YYYY_2026.xlsx`, con manual, hallazgos y tabla de
  exploración.
- `Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx`, con las hojas legacy
  `CONTROL_GENERAL`, `CONTROL_TRAMOS_IRPF`, `COMPARATIVA_INFLACION` y
  `DAT_2012` ... `DAT_2026`.

La exportación compatible replica el alcance funcional del libro legacy. La suite
rápida valida la comparativa contra el fixture versionado y comprueba estructura,
controles y detalle anual con rangos acotados; una validación exhaustiva de todas
las filas `DAT_YYYY` debe ejecutarse como prueba pesada.

## Hipótesis y alcance

El modelo actual calcula un **caso fiscal simplificado**:

- persona individual sin descendientes;
- tramo autonómico igualado al estatal;
- salario bruto anual como entrada;
- distribución mensual solo como lectura equivalente;
- años fiscales 2012-2026;
- IPC acumulado de diciembre a diciembre;
- cotizaciones, MEI, cuota de solidaridad, reducción por rendimientos del
  trabajo, mínimo personal, mínimo exento de retención, deducciones SMI y límite
  del 43% según los parámetros incluidos en el motor.

Fuera de alcance por ahora:

- comunidades autónomas reales;
- situaciones familiares distintas;
- otras rentas, deducciones personales o circunstancias laborales;
- equivalencia binaria completa con el Excel legacy.

## Estructura del repo

- `app/`: rutas Next.js.
- `components/`: interfaz del simulador, auditoría y navegación.
- `lib/domain/progresividad.ts`: motor de cálculo y auditoría por rango.
- `lib/export/auditoria-excel.ts`: exportaciones XLSX en navegador.
- `tests/progresividad.test.ts`: casos de referencia del motor.
- `Calculo_Salario_IRPF.py`: script Python legacy.
- `CONTEXT.md`: lenguaje ubicuo y relaciones del dominio.
- `docs/adr/`: decisiones de arquitectura.

## Desarrollo

Requisitos:

- Bun.
- Node compatible con Next.js 16.
- `uv` para ejecutar el script Python legacy.

Instalación:

```bash
bun install
```

Servidor local:

```bash
bun dev
```

Después abre `http://localhost:3000`.

Comprobaciones habituales:

```bash
bun run test
bun run typecheck
bun run lint
```

Validación pesada contra el fixture Excel legacy completo:

```bash
bun run test:legacy-completo
```

## Ejecutar el legacy Python

El script Python original sigue disponible para regenerar el Excel completo
legacy:

```bash
uv run --with-requirements requirements.txt python Calculo_Salario_IRPF.py
```

Genera `Auditoria_Integral_Nominas_e_Inflacion_2012_2026.xlsx` con hojas de
control, comparativa de inflación y hojas `DAT_YYYY`.

## Aviso

IRoboPF es una herramienta divulgativa y de auditoría educativa. Los resultados
son orientativos y dependen de las hipótesis declaradas. No sustituyen a una
revisión profesional fiscal, laboral o contable.
