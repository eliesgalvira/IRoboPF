# Vivienda murciana, bases familiares de Madrid y titulares de Andalucía

Este corte integra tres ampliaciones revisadas de 2025 en la composición anual
compartida por ambas API. No cierra las deducciones autonómicas de 2025.

- Murcia conecta la adquisición ordinaria anterior a 2013 de la disposición
  transitoria primera.4, mediante `viviendaDT182025` y la rama `estatal_pre2013`.
  El productor reconstruye el derecho y la base desde hechos y aplica una sola
  cuota estatal y autonómica. Jóvenes, `Uno_vigente`, `1998_2000`, rehabilitación
  y los demás perfiles no representados conservan rechazo explícito.
- Madrid utiliza el libro familiar existente en vivienda por nacimiento/adopción
  e incremento hipotecario. Conserva la fórmula hipotecaria y el propietario y
  prestatario único. La conexión familiar de adquisición se acota a compras de
  2025: la historia familiar de acceso de 2023/2024 todavía falta.
- Andalucía deriva bases de otros titulares y reparte adopción internacional y
  familia numerosa entre quienes tienen derecho autonómico. Concilia residencia,
  filiación, título y rentas; otro territorio o exceso de base no divide el importe.

La primera revisión Murcia/Madrid encontró una incompatibilidad monetaria grave:
dos solicitudes sobre la misma inversión permitían deducir 1.898,597185 euros en
la ruta canónica o 1.898,60 en la efectiva, frente a la alternativa admisible de
1.100 euros. La corrección rechaza la combinación antes de calcular un importe.
El contraste independiente reproduce el fallo anterior y conserva alternativas,
órdenes de entrada, otras inversiones y traslado compatible. No elige por el usuario.

[Revisiones y huellas](REVISIONES.json) y [dictamen completo](REVISION-INDEPENDIENTE.txt)
conservan alcance, reservas y recuentos separados. El autor Murcia/Madrid ejecutó
2.282 pruebas y el de Andalucía 408; son validaciones distintas y no se suman como
una revisión. La fusión de `composicion-anual.ts` conserva los dos deltas revisados.
La validación conjunta pasa los 31 pasos exactos del CI, con inventario y generados
actuales. [Resultado y límites](CI.json). Publicación y comprobación remota posteriores.

El corte histórico publica 1.027 capturas y el cotejo de 60 entradas de 2019:
694 coincidencias condicionadas, 17 diferencias en cinco entradas, nueve ausencias
y 120 mapeos reservados. Cuatro observaciones posteriores quedan separadas.
Estas cifras tienen revisión documental; no acreditan una corrección monetaria.
