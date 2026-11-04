# Recuperación del motor: estado inicial del 4 de noviembre

La brecha descrita en este cotejo tiene su [cierre técnico posterior](CIERRE.md).
Se conserva el estado inicial para explicar la recuperación.

Cotejo del 4 de noviembre sobre `e03ce06729b85f55ec76ddfe24234f7afc4fccab`.
La ejecución antigua de integración se considera fallida; no se utiliza como
prueba de cierre. Su rama conservada apunta a la base, no a su trabajo final.

La entrega `integracion-motor-ci` y su recuperación contienen exactamente el
mismo parche y manifiesto de 90 rutas. La finalización posterior transporta
95 rutas: 77 archivos resultantes, cuyos hashes se han comprobado, y 18
retiradas. No se debe reintroducir ninguno de esos archivos retirados ni
sobrescribir las correcciones posteriores aplicando otra vez el parche.

| Entrega cotejada | Archivos idénticos al código actual | Retiradas conservadas | Archivos evolucionados |
| --- | ---: | ---: | ---: |
| Integración inicial | 58 | 18 | 14 |
| Recuperación de esa integración | 58 | 18 | 14 |
| Finalización posterior | 64 | 18 | 13 |

Los trece archivos evolucionados de la finalización son el workflow, el script
de CI, la API y el informe de integración, los dos inventarios, los pines,
la liquidación anual, dos módulos de análisis/auditoría salarial, la exportación
Excel y dos archivos de pruebas de esa exportación. Las correcciones de
`9f8e6a8f` retiraron las superficies truncadas y cerraron el rechazo de conjunta;
las comprobaciones posteriores conservaron su alcance. El cambio del 4 de
noviembre añadió las regresiones documentales a CI. Los bytes anteriores y
sus manifiestos permanecen fuera del repositorio público.

## Brecha que se debe cerrar

`liquidar-irpf-anual.ts` y `trabajo-anual/conexion.ts` todavía contienen dos
recorridos de liquidación. Compartir sólo el cálculo elemental de una escala
no demuestra una única liquidación. Los importes efectivos y la cotización
estimada son entradas de naturaleza distinta: no deben intercambiarse ni
convertirse mediante hechos inventados para hacer coincidir resultados.

El trabajo prioritario consiste en llevar las entradas admitidas a una única
composición del motor, con políticas temporales y monetarias explícitas,
preservando las siete referencias salariales oficiales, las fronteras de 2014,
los derechos familiares y sus rechazos. Las APIs y servicios deben consumir
esa composición; los adaptadores no deben conservar otra fórmula de cuota.
La documentación para el rediseño debe expresar entradas, unidades, resultados,
errores, alcance y ejemplos ejecutables. Después se requiere revisión
independiente de los cambios nuevos y CI completo antes de publicar.

Esto no acredita por sí mismo los mínimos de todos los años y territorios.
La ampliación familiar fuera de Madrid 2025 requiere las condiciones y los
datos contrastados de A/E. Un ámbito sin respaldo se rechaza expresamente,
sin aplicar automáticamente el contrato de 2025 a otro ejercicio.

## Escalas y mínimos

La entrega de enlaces recibida sigue incompleta: 11.204 ocurrencias deduplicadas,
con selectores pendientes y unidades/ámbitos candidatos. Sus coincidencias
numéricas no equivalen a concordancias normativas. No se relanza mientras se
cierra la composición del motor. Se conserva el transporte y la propuesta
canaria con su regresión, que debe cotejarse contra la versión vigente antes
de cualquier integración. No se sustituye una revisión pendiente por los
tests declarados por el autor.
