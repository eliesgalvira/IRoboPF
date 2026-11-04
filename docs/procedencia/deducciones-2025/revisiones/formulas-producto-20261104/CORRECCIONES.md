# Correcciones tras la revisión de fórmulas valencianas

La revisión independiente conservada en `INFORME.md` encontró tres defectos P2
y una observación P3. El integrador corrigió los cuatro sin cambiar las fuentes
ni convertir los resultados parciales en deducciones aceptadas.

- H1: deporte aplicaba dos veces el reparto. Un gasto común de 200 EUR entre
  dos titulares de 50 años produce 30 EUR por titular, en lugar de 15.
- H2: fertilidad excluía toda una conjunta si una unidad quedaba fuera de edad.
  Ahora cada unidad conserva su elegibilidad; la pareja de 45 y 46 años puede
  conservar los 100 EUR correspondientes a la primera.
- H3: el comodato de inmueble admitía días superiores al período. Se exigen
  días enteros, como máximo 365 y nunca más que los transcurridos hasta el devengo.
- O1: la aplicación de cuota conserva las reservas documentales del resultado
  generado, incluida la relativa al CTE.

Las regresiones permanentes están en
`tests/deducciones-valencianas-correcciones.test.ts`. El integrador repitió las
106 comprobaciones independientes: todas pasan, incluidas las cuatro rojas
originales. La copia de ejecución ajusta una expectativa adicional de la prueba
`extras-no-inyectan`, de 15 a 30 EUR: usaba el mismo gasto compartido afectado por
H1. Su objetivo de rechazar inyección de campos se conserva. El arnés original,
su expectativa anterior y su resultado rojo permanecen intactos en esta recepción.
`revision-valenciana-verde.log` registra la repetición; `focal-integrado.log`
recoge 374 pruebas del conjunto integrado. No se presenta esta repetición del
integrador como una segunda revisión independiente.

La variante pública `valenciana_hechos` valida hechos y contexto, conserva
`calculo_parcial` y detecta duplicación por código con consignaciones. La revisión
ejecutó 23 comprobaciones de esa integración, todas correctas. Los límites
compartidos y las incompatibilidades entre solicitudes siguen pendientes; el
catálogo no se promociona y el total fiscal no acepta parciales.
