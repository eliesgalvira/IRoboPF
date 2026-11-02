# Revisión acotada de las correcciones del motor

Base comprobada: `9f8e6a8f75aaa12fd6ffd18ea8a09eeefe004275`, integración procedencia-documental. Dictamen favorable limitado a estas correcciones; no autoriza aceptación fiscal, ampliación familiar ni cierre global. No se reevalúan F-M01/F-M02 ni las 351 deducciones.

| Punto | Dictamen sobre esta base | Evidencia discriminante |
| --- | --- | --- |
| R-M01 | **Corregido** | Desaparecen ambos helpers generales, las cuatro tablas y el selector legacy. La ruta común integra 4382,532 euros en 17707,20 para el contraste técnico 2014; la anual mantiene base 1770720 y cuota íntegra 438253 céntimos. |
| R-M02 | **Corregido** | Desaparecen constructor y reexportación de la tabla. Los libros corriente y progresivo contienen CONTROL_GENERAL y COMPARATIVA_INFLACION, sin CONTROL_TRAMOS_IRPF. |
| R-M03 | **Corregido** | JavaScript con conjunta se rechaza por API directa y servicio, con y sin derechos. La causa contiene un único Fail con ResultadoNoSoportado, sin Die. Los controles individuales equivalentes sí se admiten. |
| Consecuencia de retirar el selector | **Demostrada y delimitada** | Las filas antiguas coinciden con dos veces la estatal en 2016–2020. En 2021–2026 cambia únicamente el último tipo de esa comparación: 47 a 49 %. Un euro sobre 300000 produce antes 47 céntimos y ahora 49. |

## Contraste anterior y consumidores

Los casos originales se ejecutaron sin alterar sus bytes ni expectativas: tres fallos ordinarios, R-M01 con 4382.5425 frente a 4382.532; R-M02 con 17707 frente a 17707.2; R-M03 con Success frente a Failure. El control anual 2014 pasó. No se cuentan errores de reconstrucción como reproducción financiera.

Se buscó la superficie retirada en `lib`, `app`, `components` y `hooks`: no aparecen consumidores ejecutables de esos nombres. Se inspeccionó la sucesión: análisis salarial y auditoría consumen el servicio anual; cuota íntegra, mínimo y sus desgloses usan `calcularCuotaPorEscala` / `calcularDesgloseCuotaPorEscala`, con parámetros del selector territorial. Las menciones históricas de metadatos no son llamadas vivas. Excel proyecta resultados recibidos y no reconstruye la tabla eliminada.

La duplicación de la estatal está condicionada por `escalaAutonomicaIgualEstatal`. La comprobación Madrid 2025 conserva 45 céntimos marginales, tanto antes como después. Las fuentes `irpf-autonomico-*.ts` son idénticas byte a byte entre la reconstrucción anterior y esta base: no se desplazan las fronteras canarias. El 47 % localizado en retención AEAT pertenece a otra operación, no a una segunda tabla de simulación. No se encontró otra tabla viva incorrecta de la superficie revisada.

El cambio 47→49 describe exclusivamente el escenario técnico simulado; no es tarifa autonómica real ni validación normativa de 2026. La composición global de la API explícita y el perfil técnico continúa pendiente.

## Reproducción pública y límites

Desde raíz, con las dependencias del lockfile instaladas:

```sh
bun run test --config docs/procedencia/reforma-motor/revision-correcciones/vitest.config.mjs --reporter=verbose --maxWorkers=1
bun run test tests/motor-unico-revision.test.ts tests/auditoria-excel.test.ts tests/anual-salarial-completo.test.ts --reporter=verbose --maxWorkers=1
```

Ejecución propia: **17 pruebas nuevas y 68 ordinarias pasan**, incluidas las siete referencias salariales Open; pasan además los siete adversos documentales existentes. Las pruebas propias integran expectativas estáticas independientes en seis bases por ejercicio 2016–2026 y prueban también modalidades vacía, ausente, nula, numérica y objeto. No leen caché, CAS, originales privados ni objetos Git antiguos. Su configuración explícita no modifica las puertas ordinarias.

La reproducción anterior es una comprobación privada separada, no CI público. Se reconstruyó solo el subconjunto de módulos necesario: base común exacta indicada arriba, preimágenes de la integración y después payload del candidato anterior. Los seis módulos distintos del HEAD quedan fijados abajo por SHA256; los demás módulos comunes conservan los bytes del HEAD. El inventario completo y el arnés de observación anterior se conservan con la entrega privada. La comprobación tabular anterior suma once pases; el contraste con las expectativas actuales falla en los seis ejercicios 2021–2026 y pasa en 2016–2020 y Madrid 2025.

| Módulo anterior (bajo `lib/`) | SHA256 |
| --- | --- |
| export/auditoria-excel.ts | `01a33d0d9f2a253f15aa410cc2caaadf27242a4c2a289278dce6a20e18b9ed05` |
| dominio/auditoria/auditoria-progresividad-frio.ts | `e5ba4ef965a9e8c027d6cc8102b26e372741ad45c74689e351228c54652e1590` |
| dominio/analisis-salarial/progresividad-frio.ts | `734747085b40a52193cee6f26a6cad68752296f00cfdaea98f22cd72cb049575` |
| dominio/normativa/datos/irpf-estatal-2012-2026.ts | `9087fd03dd973a32e904dd9842ded3d3b33a5e239c7d34c6f062487a698b2479` |
| dominio/irpf/cuotas/escalas-gravamen.ts | `e199aa7dab1a4e4e4dcf5dd99ef0c4ea81daa69e0c11261b47b0568d5afadb19` |
| dominio/irpf/liquidacion/liquidar-irpf-anual.ts | `74e4634336c58667b9abe7ae76d83b6ecadf9984db91d37cb96af8d32ce9ef9b` |

No se repitieron build, lint, tipos ni el workflow completo. Los 22 comandos y build facilitados son evidencia del padre, no ejecuciones propias. No se demuestra equivalencia general de todas las rutas ni se amplía el ámbito admitido. Se consultaron AGENTS.md, effect-solutions y ejemplos locales antes del arnés Effect. Las altas propias se limitan a esta carpeta; los bytes de base se cotejan antes y después y se conservan transporte y respaldo fuera del contenido público. Integra el padre, sin autoaceptación.
